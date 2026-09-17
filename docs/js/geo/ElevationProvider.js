// Fetches and decodes elevation tiles into Float32Array heightmaps.
// Source depends on TILE_SOURCES.demDataType (see TileSourceConfig.js):
//  - 'terrarium-shader': AWS Terrarium, height = (R * 256 + G + B / 256) - 32768
//  - 'terrain-rgb':      Mapbox Terrain-RGB, height = -10000 + ((R<<16)|(G<<8)|B) * 0.1

import { acquireFetch, releaseFetch } from './fetchSemaphore.js';
import { TILE_SOURCES } from './TileSourceConfig.js';
import Logger from '../utils/Logger.js';
export default class ElevationProvider {
  constructor() {
    this._cache = new Map();
    this._pending = new Map(); // in-flight fetch promises, keyed by tile key
    this._canvas = document.createElement('canvas');
    this._canvas.width = 256;
    this._canvas.height = 256;
    this._ctx = this._canvas.getContext('2d', { willReadFrequently: true });
  }

  async fetchHeightmap(tileX, tileY, zoom) {
    const key = `${zoom}/${tileX}/${tileY}`;
    if (this._cache.has(key)) {
      Logger.debug('Elevation', `Cache hit: ${key}`);
      return this._cache.get(key);
    }

    // Deduplicate in-flight requests: return existing promise if fetch already running
    if (this._pending.has(key)) return this._pending.get(key);

    const promise = this._doFetch(key, tileX, tileY, zoom);
    this._pending.set(key, promise);
    promise.finally(() => this._pending.delete(key));
    return promise;
  }

  async _doFetch(key, tileX, tileY, zoom) {
    await acquireFetch();
    try {
      // Check cache again — another request may have populated it while queued
      if (this._cache.has(key)) return this._cache.get(key);

      const url = TILE_SOURCES.demUrl
        .replace('{z}', zoom)
        .replace('{x}', tileX)
        .replace('{y}', tileY);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Tile fetch failed (${response.status}): ${url}`);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      this._ctx.clearRect(0, 0, 256, 256);
      this._ctx.drawImage(bitmap, 0, 0, 256, 256);
      bitmap.close();

      const imageData = this._ctx.getImageData(0, 0, 256, 256);
      const pixels = imageData.data;

      const isMapboxRGB = TILE_SOURCES.demDataType === 'terrain-rgb';
      const heightmap = new Float32Array(256 * 256);
      let min = Infinity,
        max = -Infinity;
      for (let i = 0; i < 256 * 256; i++) {
        const p = i * 4;
        const r = pixels[p];
        const g = pixels[p + 1];
        const b = pixels[p + 2];
        const h = isMapboxRGB
          ? -10000 + ((r << 16) | (g << 8) | b) * 0.1
          : r * 256 + g + b / 256 - 32768;
        heightmap[i] = h;
        if (h < min) min = h;
        if (h > max) max = h;
      }

      Logger.info('Elevation', `Fetched ${key}`, { min: Math.round(min), max: Math.round(max) });

      this._cache.set(key, heightmap);
      return heightmap;
    } finally {
      releaseFetch();
    }
  }

  clearCache() {
    this._cache.clear();
    this._pending.clear();
  }
}
