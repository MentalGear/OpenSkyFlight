/**
 * Local dev (scripts/serve.js) proxies tile requests through /tiles/... so they're
 * cached on disk. Static hosting (e.g. GitHub Pages) has no such proxy, so there we
 * fetch each provider directly — which only works for sources that answer with
 * CORS headers.
 */
const isLocalDev =
  typeof location !== 'undefined' &&
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1');

export const TILE_SOURCES = isLocalDev
  ? {
      osmUrl: '/tiles/osm/{z}/{x}/{y}.png',
      satelliteUrl: '/tiles/satellite/{z}/{x}/{y}.png',
      demUrl: '/tiles/terrarium/{z}/{x}/{y}.png',
      demDataType: 'terrarium-shader',
      demMaxLevel: 15, // AWS Terrarium caps at zoom 15
    }
  : {
      // OSM and Esri both serve tiles with Access-Control-Allow-Origin: *
      osmUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      satelliteUrl:
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      // AWS's Terrarium elevation bucket has no CORS headers, so it can't be fetched
      // from a browser on a different origin. TrailSplits (https://trailsplits.com/api)
      // mirrors global Copernicus 30m elevation as free, CORS-enabled, no-key Mapbox
      // Terrain-RGB tiles — attribute TrailSplits & OpenStreetMap contributors if reused.
      demUrl: 'https://api.trailsplits.com/tiles/v1/terrainrgb/current/{z}/{x}/{y}.png',
      demDataType: 'terrain-rgb',
      demMaxLevel: 12, // TrailSplits' terrainrgb_planet mirror caps at zoom 12
    };

export function osmTileUrl(z, x, y) {
  return TILE_SOURCES.osmUrl.replace('{z}', z).replace('{x}', x).replace('{y}', y);
}
