var gt = Object.defineProperty;
var zt = (n, s, t) => s in n ? gt(n, s, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[s] = t;
var d = (n, s, t) => zt(n, typeof s != "symbol" ? s + "" : s, t);
import { Matrix3 as wt, Frustum as It, Vector3 as K, WebGLCoordinateSystem as Rt, Matrix4 as kt, Object3D as ut, Box3 as Ft, Box3Helper as Ht, MeshStandardNodeMaterial as Ct, FrontSide as jt, BufferGeometry as Jt, BufferAttribute as J, LoadingManager as Ut, Vector2 as st, Box2 as ft, MeshBasicNodeMaterial as et, Mesh as Nt, Texture as A, CanvasTexture as Et, ImageLoader as _, SRGBColorSpace as Dt, FileLoader as vt, MathUtils as Ot, LinearFilter as ot, Raycaster as Qt, Clock as Bt } from "three";
import { Fn as Wt, float as N, texture as U, varying as At, vec3 as v, positionLocal as _t, uv as qt, vec2 as nt, cross as $t, transformNormalToView as ts } from "three/tsl";
import { WorkerPool as pt } from "three/examples/jsm/utils/WorkerPool.js";
const I = "0.11.8-osf", Es = {
  name: "GuoJF",
  email: "hz_gjf@163.com"
}, ss = new wt();
function es(n, s, t, e) {
  const o = ss.set(
    n.normal.x,
    n.normal.y,
    n.normal.z,
    s.normal.x,
    s.normal.y,
    s.normal.z,
    t.normal.x,
    t.normal.y,
    t.normal.z
  );
  return e.set(-n.constant, -s.constant, -t.constant), e.applyMatrix3(o.invert()), e;
}
class os extends It {
  constructor() {
    super();
    d(this, "points");
    this.points = Array(8).fill(0).map(() => new K());
  }
  setFromProjectionMatrix(t, e = Rt) {
    return super.setFromProjectionMatrix(t, e), this.calculateFrustumPoints(), this;
  }
  calculateFrustumPoints() {
    const { planes: t, points: e } = this;
    [
      [t[0], t[3], t[4]],
      // Near top left
      [t[1], t[3], t[4]],
      // Near top right
      [t[0], t[2], t[4]],
      // Near bottom left
      [t[1], t[2], t[4]],
      // Near bottom right
      [t[0], t[3], t[5]],
      // Far top left
      [t[1], t[3], t[5]],
      // Far top right
      [t[0], t[2], t[5]],
      // Far bottom left
      [t[1], t[2], t[5]]
      // Far bottom right
    ].forEach((i, a) => {
      es(i[0], i[1], i[2], e[a]);
    });
  }
}
var Q = /* @__PURE__ */ ((n) => (n[n.none = 0] = "none", n[n.create = 1] = "create", n[n.remove = 2] = "remove", n))(Q || {});
function ns(n, s, t, e) {
  if (!n.isLeaf && n.z > t)
    return 2;
  const o = n.distRatio;
  let i = e;
  if (n.z > 13) {
    const a = Math.pow(1.4, n.z - 13), l = n.viewCenterFactor;
    i = e * (1 + (a - 1) * l);
  }
  return n.isLeaf && n.inFrustum && n.z < t && o < i && (n.showing || n.z <= s) ? 1 : !n.isLeaf && n.z >= s && o > i * 1.2 ? 2 : 0;
}
function R(n, s, t, e, o, i, a, l) {
  const r = new w(n, s, t);
  return r.position.set(e, o, 0), r.scale.set(i, a, l), r.updateMatrix(), r;
}
function is(n, s) {
  const { x: t, y: e, z: o } = n, i = [], a = t * 2, l = o + 1, r = 0.25, c = 0.5, h = 1;
  if (o === 0 && s.projectionID === "4326") {
    const m = e, Z = 1, b = R(a, m, l, -0.25, 0, c, Z, h), p = R(a + 1, m, l, r, 0, c, Z, h);
    i.push(b, p);
  } else {
    const m = e * 2, Z = 0.5, b = R(a, m, l, -0.25, r, c, Z, h), p = R(a + 1, m, l, r, r, c, Z, h), u = R(a, m + 1, l, -0.25, -0.25, c, Z, h), L = R(a + 1, m + 1, l, r, -0.25, c, Z, h);
    i.push(b, p, u, L);
  }
  return i;
}
const ls = 10, k = new K(), H = new K();
let it = 1;
const lt = new os(), as = new kt(), at = new K();
class w extends ut {
  /**
   * 构造函数
   * @param x - 瓦片X坐标，默认：0
   * @param y - 瓦片Y坐标，默认：0
   * @param z - 瓦片层级，默认：0
   */
  constructor(t = 0, e = 0, o = 0) {
    super();
    /** 瓦片x坐标 */
    d(this, "x");
    /** 瓦片y坐标 */
    d(this, "y");
    /** 瓦片层级 */
    d(this, "z");
    /** 是否为瓦片 */
    d(this, "isTile", !0);
    /** 瓦片是否正在加载中 */
    d(this, "_isLoading", !1);
    /** 根瓦片 */
    d(this, "_root", this);
    /** 瓦片距离检测点世界坐标 */
    d(this, "_checkPoint", new K());
    /* 瓦片在世界坐标系中的大小*/
    d(this, "_sizeInWorld", -1);
    /** 瓦片包围盒（世界坐标） */
    d(this, "_bbox", null);
    /** 瓦片模型 */
    d(this, "_model");
    /** 子瓦片 */
    d(this, "_subTiles");
    // 是否更新材质
    d(this, "_updateMaterial", !1);
    // 是否更新几何体
    d(this, "_updateGeometry", !1);
    this.x = t, this.y = e, this.z = o, this.name = `Tile ${o}-${t}-${e}`, this.up.set(0, 0, 1), this.matrixAutoUpdate = !1;
  }
  get model() {
    return this._model;
  }
  get subTiles() {
    return this._subTiles;
  }
  /** 瓦片到相机的距离比例，用于 LOD 评估，值越小瓦片越密集 */
  get distRatio() {
    const e = k.distanceTo(this._checkPoint) / this._sizeInWorld;
    return this.inFrustum ? e * 0.8 : e * 2;
  }
  /** Factor [0,1] indicating how close this tile is to the view center ground point (1 = at center, 0 = beyond radius) */
  get viewCenterFactor() {
    const t = this._checkPoint.x - H.x, e = this._checkPoint.z - H.z, o = Math.sqrt(t * t + e * e);
    return Math.max(0, Math.min(1, 1 - o / it));
  }
  /** 瓦片是否在视锥体内 */
  get inFrustum() {
    return !!this._bbox && lt.intersectsBox(this._bbox);
  }
  /** 是否为叶子瓦片 */
  get isLeaf() {
    return !this.subTiles;
  }
  /** 取得瓦片是否显示 */
  get showing() {
    return !!this.model?.visible;
  }
  /** 设置瓦片是否显示 */
  set showing(t) {
    this.model ? (t && (this.model.castShadow = this._root.castShadow, this.model.receiveShadow = this._root.receiveShadow), t != this.showing && (this.model.traverse((e) => e.layers.set(t ? 0 : 31)), this.model.visible = t, this._root.dispatchEvent({ type: "tile-visible-changed", tile: this, visible: t }))) : console.assert(!t);
  }
  get _isDirty() {
    return !!this.model && (this._updateMaterial || this._updateGeometry);
  }
  /**
   * 瓦片射线检测，仅检测视锥体中的瓦片
   */
  raycast(t) {
    return this.inFrustum;
  }
  /**
   * 计算瓦片checkpoint、bbox、size
   */
  computeTileSize(t) {
    if (this._bbox = new Ft(new K(-0.5, -0.5), new K(0.5, 0.5)).applyMatrix4(this.matrixWorld), this._checkPoint = new K().applyMatrix4(this.matrixWorld), this._sizeInWorld = this._bbox.getSize(at).length(), console.assert(this._sizeInWorld > 10), this._bbox.min.setY(-300), this._bbox.max.setY(9e3), t > 1) {
      const e = this._bbox.clone().applyMatrix4(this.matrixWorld.clone().invert()), o = new Ht(e, 1044480);
      o.name = "tilebox", this.add(o);
    }
    return this._sizeInWorld;
  }
  /**
   * 瓦片更新，该函数在每帧渲染中被调用
   * @param params 瓦片加载参数
   */
  update(t) {
    if (!this.parent || this._isLoading)
      return;
    this.parent instanceof w && (this._root = this.parent._root), console.assert(this._root.z === 0);
    const { loader: e, minLevel: o, camera: i } = t;
    if (this.z === 0) {
      i.getWorldPosition(k), lt.setFromProjectionMatrix(as.multiplyMatrices(i.projectionMatrix, i.matrixWorldInverse));
      const a = i.getWorldDirection(at);
      if (a.y < -0.01) {
        const l = -k.y / a.y;
        H.copy(a).multiplyScalar(l).add(k);
      } else
        H.copy(a).multiplyScalar(5e4).add(k), H.y = 0;
      it = Math.max(500, k.y * 2);
    }
    if (this._sizeInWorld < 0 && this.computeTileSize(e.debug), this.z >= o && e.downloadingThreads < ls) {
      if (!this.model) {
        this._startLoad(e);
        return;
      }
      if (this._isDirty && this.inFrustum && !this.subTiles?.some((l) => l._isDirty)) {
        this._startUpdate(e);
        return;
      }
    }
    this.model && (this.model.castShadow = this._root.castShadow, this.model.receiveShadow = this._root.receiveShadow), this.LOD(t), this.subTiles?.forEach((a) => a.update(t));
  }
  /**
   * LOD (Level of Detail).
   * @param threshold - LOD 阈值
   * @returns newTiles - 新创建的子瓦片数组
   */
  LOD(t) {
    const { loader: e, minLevel: o, maxLevel: i, LODThreshold: a } = t, l = ns(this, o, i, a);
    if (l === Q.create) {
      const r = is(this, e);
      this.add(...r), this._subTiles = r, this._subTiles.forEach((c) => {
        c.updateMatrixWorld(), this._root.dispatchEvent({ type: "tile-created", tile: c });
      });
    } else l === Q.remove && this.model && (this.showing = !0, this.unLoad(e, !1));
    return l;
  }
  /**
   * 检查4个兄弟瓦片全部下载完成时再显示
   */
  _checkVisible() {
    const t = this.parent;
    if (t instanceof w)
      if (t.model) {
        const e = t.subTiles;
        if (e) {
          const o = !e.some((i) => !i.model);
          e.forEach((i) => i.showing = o), t.showing = !o;
        }
      } else
        this.showing = !0;
    return this;
  }
  /**
   * 下载瓦片数据
   * @param loader  - 瓦片加载器
   */
  async _startLoad(t) {
    this._isLoading = !0, this._model = await t.load(this), this._model.geometry.computeBoundingBox(), this._checkPoint.y = this._model.geometry.boundingBox?.max.z || 0, this.isLeaf && this._checkVisible(), this._isLoading = !1, this._root.dispatchEvent({ type: "tile-loaded", tile: this }), this.add(this._model);
  }
  /**
   * 更新瓦片数据
   * @param loader - 瓦片加载器
   * @returns this
   */
  async _startUpdate(t) {
    this.model && (this._isLoading = !0, this._model = await t.update(this.model, this, this._updateMaterial, this._updateGeometry), this.model.geometry.computeBoundingBox(), this._checkPoint.y = this.model.geometry.boundingBox?.max.z || 0, this._updateMaterial = !1, this._updateGeometry = !1, this._isLoading = !1, this._root.dispatchEvent({ type: "tile-loaded", tile: this }));
  }
  /**
   * 更新瓦片数据
   * @param updateMaterial - 是否更新材质
   * @param updateGeometry - 是否更新几何体
   * @returns this
   */
  updateData(t, e) {
    return this.traverse((o) => {
      o instanceof w && (o.model || o._isLoading) && (o._updateMaterial = t, o._updateGeometry = e);
    }), this;
  }
  /**
   * 销毁瓦片树重新创建，并加载数据，改变地图投影时必须调用它以生效
   * @param loader - 瓦片加载器
   * @returns this
   */
  reload(t) {
    return this.unLoad(t, !0);
  }
  /**
   * 卸载瓦片 (包括其子瓦片)，释放资源
   * @param loader - 瓦片加载器
   * @param unLoadSelf - 是否卸载自身
   * @returns this
   */
  unLoad(t, e = !0) {
    return this.subTiles && (this.subTiles.forEach((o) => {
      o.unLoad(t, !0);
    }), this.remove(...this.subTiles), this._subTiles = void 0), e && this.model && (t.unload(this.model), this._root.dispatchEvent({ type: "tile-unload", tile: this }), this._model = void 0), t.debug > 1 && this.getObjectByName("tilebox")?.geometry.dispose(), this;
  }
}
class yt extends Ct {
  constructor(s = {}) {
    super({ transparent: !1, side: jt, ...s });
  }
}
const O = /* @__PURE__ */ Wt(([n]) => n.r.mul(65280).add(n.g.mul(255)).add(n.b.mul(N(255).div(256))).sub(32768));
function Ds(n, s) {
  const t = U(s), e = At(v(0, 0, 1));
  return n.positionNode = Wt(() => {
    const o = _t.toVar(), i = qt(), a = U(s, i), l = O(a), r = N(1).div(128), c = O(U(s, i.add(nt(r, 0)))), h = O(U(s, i.add(nt(0, r)))), m = r, Z = v(m, N(0), c.sub(l)), b = v(N(0), m, h.sub(l));
    return e.assign($t(Z, b).normalize()), o.z.addAssign(l), o;
  })(), n.normalNode = ts(e), { heightTextureNode: t };
}
var j = /* @__PURE__ */ ((n) => (n[n.Unknown = 0] = "Unknown", n[n.Point = 1] = "Point", n[n.Linestring = 2] = "Linestring", n[n.Polygon = 3] = "Polygon", n))(j || {});
class vs {
  /**
   * 渲染矢量数据
   * @param ctx 渲染上下文
   * @param type 元素类型
   * @param feature 元素
   * @param style 样式
   * @param scale 拉伸倍数
   */
  render(s, t, e, o, i = 1) {
    switch (s.lineCap = "round", s.lineJoin = "round", (o.shadowBlur ?? 0) > 0 && (s.shadowBlur = o.shadowBlur ?? 2, s.shadowColor = o.shadowColor ?? "black", s.shadowOffsetX = o.shadowOffset ? o.shadowOffset[0] : 0, s.shadowOffsetY = o.shadowOffset ? o.shadowOffset[1] : 0), t) {
      case j.Point:
        s.textAlign = "center", s.textBaseline = "middle", s.font = o.font ?? "14px Arial", s.fillStyle = o.fontColor ?? "white", this._renderPointText(s, e, i, o.textField ?? "name", o.fontOffset ?? [0, -8]);
        break;
      case j.Linestring:
        this._renderLineString(s, e, i);
        break;
      case j.Polygon:
        this._renderPolygon(s, e, i);
        break;
      default:
        console.warn(`Unknown feature type: ${t}`);
    }
    (o.fill || t === j.Point) && (s.globalAlpha = o.fillOpacity || 0.5, s.fillStyle = o.fillColor || o.color || "#3388ff", s.fill(o.fillRule || "evenodd")), (o.stroke ?? !0) && (o.weight ?? 1) > 0 && (s.globalAlpha = o.opacity || 1, s.lineWidth = o.weight || 1, s.strokeStyle = o.color || "#3388ff", s.setLineDash(o.dashArray || []), s.stroke());
  }
  // 渲染点要素
  _renderPointText(s, t, e = 1, o = "name", i = [0, 0]) {
    const a = t.geometry;
    s.beginPath();
    for (const r of a)
      for (let c = 0; c < r.length; c++) {
        const h = r[c];
        s.arc(h.x * e, h.y * e, 2, 0, 2 * Math.PI);
      }
    const l = t.properties;
    l && l[o] && s.fillText(
      l[o],
      a[0][0].x * e + i[0],
      a[0][0].y * e + i[1]
    );
  }
  // 渲染线要素
  _renderLineString(s, t, e) {
    const o = t.geometry;
    s.beginPath();
    for (const i of o)
      for (let a = 0; a < i.length; a++) {
        const { x: l, y: r } = i[a];
        a === 0 ? s.moveTo(l * e, r * e) : s.lineTo(l * e, r * e);
      }
  }
  // 渲染面要素
  _renderPolygon(s, t, e) {
    const o = t.geometry;
    s.beginPath();
    for (let i = 0; i < o.length; i++) {
      const a = o[i];
      for (let l = 0; l < a.length; l++) {
        const { x: r, y: c } = a[l];
        l === 0 ? s.moveTo(r * e, c * e) : s.lineTo(r * e, c * e);
      }
      s.closePath();
    }
  }
}
function f(...n) {
  const s = n, t = s && s.length > 1 && s[0].constructor || null;
  if (!t)
    throw new Error(
      "concatenateTypedArrays - incorrect quantity of arguments or arguments have incompatible data types"
    );
  const e = s.reduce((a, l) => a + l.length, 0), o = new t(e);
  let i = 0;
  for (const a of s)
    o.set(a, i), i += a.length;
  return o;
}
function rs(n, s, t, e) {
  const o = e ? ds(e, n.position.value) : cs(s), i = o.length, a = new Float32Array(i * 6), l = new Float32Array(i * 4), r = new s.constructor(i * 6), c = new Float32Array(i * 6);
  for (let m = 0; m < i; m++)
    ms({
      edge: o[m],
      edgeIndex: m,
      attributes: n,
      skirtHeight: t,
      newPosition: a,
      newTexcoord0: l,
      newTriangles: r,
      newNormals: c
    });
  n.position.value = f(n.position.value, a), n.texcoord.value = f(n.texcoord.value, l), n.normal.value = f(n.normal.value, c);
  const h = f(s, r);
  return {
    attributes: n,
    indices: h
  };
}
function cs(n) {
  const s = [], t = Array.isArray(n) ? n : Array.from(n);
  for (let o = 0; o < t.length; o += 3) {
    const i = t[o], a = t[o + 1], l = t[o + 2];
    s.push([i, a], [a, l], [l, i]);
  }
  s.sort(([o, i], [a, l]) => {
    const r = Math.min(o, i), c = Math.min(a, l);
    return r !== c ? r - c : Math.max(o, i) - Math.max(a, l);
  });
  const e = [];
  for (let o = 0; o < s.length; o++)
    o + 1 < s.length && s[o][0] === s[o + 1][1] && s[o][1] === s[o + 1][0] ? o++ : e.push(s[o]);
  return e;
}
function ds(n, s) {
  const t = (o, i) => {
    o.sort(i);
  };
  t(n.westIndices, (o, i) => s[3 * o + 1] - s[3 * i + 1]), t(n.eastIndices, (o, i) => s[3 * i + 1] - s[3 * o + 1]), t(n.southIndices, (o, i) => s[3 * i] - s[3 * o]), t(n.northIndices, (o, i) => s[3 * o] - s[3 * i]);
  const e = [];
  return Object.values(n).forEach((o) => {
    if (o.length > 1)
      for (let i = 0; i < o.length - 1; i++)
        e.push([o[i], o[i + 1]]);
  }), e;
}
function ms({
  edge: n,
  edgeIndex: s,
  attributes: t,
  skirtHeight: e,
  newPosition: o,
  newTexcoord0: i,
  newTriangles: a,
  newNormals: l
}) {
  const r = t.position.value.length, c = s * 2, h = c + 1;
  o.set(t.position.value.subarray(n[0] * 3, n[0] * 3 + 3), c * 3), o[c * 3 + 2] = o[c * 3 + 2] - e, o.set(t.position.value.subarray(n[1] * 3, n[1] * 3 + 3), h * 3), o[h * 3 + 2] = o[h * 3 + 2] - e, i.set(t.texcoord.value.subarray(n[0] * 2, n[0] * 2 + 2), c * 2), i.set(t.texcoord.value.subarray(n[1] * 2, n[1] * 2 + 2), h * 2);
  const m = s * 2 * 3;
  a[m] = n[0], a[m + 1] = r / 3 + h, a[m + 2] = n[1], a[m + 3] = r / 3 + h, a[m + 4] = n[0], a[m + 5] = r / 3 + c, l[m] = 0, l[m + 1] = 0, l[m + 2] = 1, l[m + 3] = 0, l[m + 4] = 0, l[m + 5] = 1;
}
function hs(n) {
  if (n.length < 4)
    throw new Error(`DEM array must > 4, got ${n.length}!`);
  const s = Math.floor(Math.sqrt(n.length)), t = s, e = s, o = Lt(e, t);
  return { attributes: Zs(n, e, t), indices: o };
}
function Zs(n, s, t) {
  const e = t * s, o = new Float32Array(e * 3), i = new Float32Array(e * 2);
  let a = 0;
  for (let l = 0; l < s; l++)
    for (let r = 0; r < t; r++) {
      const c = r / (t - 1), h = l / (s - 1);
      i[a * 2] = c, i[a * 2 + 1] = h, o[a * 3] = c - 0.5, o[a * 3 + 1] = h - 0.5, o[a * 3 + 2] = n[(s - l - 1) * t + r], a++;
    }
  return {
    // 顶点位置属性
    position: { value: o, size: 3 },
    // UV坐标属性
    texcoord: { value: i, size: 2 },
    // 法线属性
    normal: { value: Gt(o, Lt(s, t)), size: 3 }
  };
}
function Lt(n, s) {
  const t = 6 * (s - 1) * (n - 1), e = new Uint16Array(t);
  let o = 0;
  for (let i = 0; i < n - 1; i++)
    for (let a = 0; a < s - 1; a++) {
      const l = i * s + a, r = l + 1, c = l + s, h = c + 1, m = o * 6;
      e[m] = l, e[m + 1] = r, e[m + 2] = c, e[m + 3] = c, e[m + 4] = r, e[m + 5] = h, o++;
    }
  return e;
}
function Gt(n, s) {
  const t = new Float32Array(n.length);
  for (let e = 0; e < s.length; e += 3) {
    const o = s[e] * 3, i = s[e + 1] * 3, a = s[e + 2] * 3, l = n[o], r = n[o + 1], c = n[o + 2], h = n[i], m = n[i + 1], Z = n[i + 2], b = n[a], p = n[a + 1], u = n[a + 2], L = h - l, S = m - r, W = Z - c, G = b - l, X = p - r, T = u - c, V = S * T - W * X, x = W * G - L * T, M = L * X - S * G, P = Math.sqrt(V * V + x * x + M * M), g = [0, 0, 1];
    if (P > 0) {
      const Y = 1 / P;
      g[0] = V * Y, g[1] = x * Y, g[2] = M * Y;
    }
    for (let Y = 0; Y < 3; Y++)
      t[o + Y] = t[i + Y] = t[a + Y] = g[Y];
  }
  return t;
}
class F extends Jt {
  constructor() {
    super();
    d(this, "type", "TileGeometry");
    const t = new Float32Array([0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0]);
    this.setData(t);
  }
  /**
   * set attribute data to geometry
   * @param data geometry or DEM data
   * @returns this
   */
  setData(t, e = 1e3) {
    let o = t instanceof Float32Array ? hs(t) : t;
    o = rs(o.attributes, o.indices, e);
    const { attributes: i, indices: a } = o;
    return this.setIndex(new J(a, 1)), this.setAttribute("position", new J(i.position.value, i.position.size)), this.setAttribute("uv", new J(i.texcoord.value, i.texcoord.size)), this.setAttribute("normal", new J(i.normal.value, i.normal.size)), this.computeBoundingBox(), this.computeBoundingSphere(), this;
  }
}
class Os {
  /**
   * Constructor for the generator.
   *
   * @param gridSize - Size of the grid.
   */
  constructor(s = 257) {
    /**
     * Size of the grid to be generated.
     */
    d(this, "gridSize");
    /**
     * Number of triangles to be used in the tile.
     */
    d(this, "numTriangles");
    /**
     * Number of triangles in the parent node.
     */
    d(this, "numParentTriangles");
    /**
     * Indices of the triangles faces.
     */
    d(this, "indices");
    /**
     * Coordinates of the points composing the mesh.
     */
    d(this, "coords");
    this.gridSize = s;
    const t = s - 1;
    if (t & t - 1)
      throw new Error(`Expected grid size to be 2^n+1, got ${s}.`);
    this.numTriangles = t * t * 2 - 2, this.numParentTriangles = this.numTriangles - t * t, this.indices = new Uint32Array(this.gridSize * this.gridSize), this.coords = new Uint16Array(this.numTriangles * 4);
    for (let e = 0; e < this.numTriangles; e++) {
      let o = e + 2, i = 0, a = 0, l = 0, r = 0, c = 0, h = 0;
      for (o & 1 ? l = r = c = t : i = a = h = t; (o >>= 1) > 1; ) {
        const Z = i + l >> 1, b = a + r >> 1;
        o & 1 ? (l = i, r = a, i = c, a = h) : (i = l, a = r, l = c, r = h), c = Z, h = b;
      }
      const m = e * 4;
      this.coords[m + 0] = i, this.coords[m + 1] = a, this.coords[m + 2] = l, this.coords[m + 3] = r;
    }
  }
  createTile(s) {
    return new bs(s, this);
  }
}
class bs {
  constructor(s, t) {
    /**
     * Pointer to the martini generator object.
     */
    d(this, "martini");
    /**
     * Terrain to generate the tile for.
     */
    d(this, "terrain");
    /**
     * Errors detected while creating the tile.
     */
    d(this, "errors");
    const e = t.gridSize;
    if (s.length !== e * e)
      throw new Error(
        `Expected terrain data of length ${e * e} (${e} x ${e}), got ${s.length}.`
      );
    this.terrain = s, this.martini = t, this.errors = new Float32Array(s.length), this.update();
  }
  update() {
    const { numTriangles: s, numParentTriangles: t, coords: e, gridSize: o } = this.martini, { terrain: i, errors: a } = this;
    for (let l = s - 1; l >= 0; l--) {
      const r = l * 4, c = e[r + 0], h = e[r + 1], m = e[r + 2], Z = e[r + 3], b = c + m >> 1, p = h + Z >> 1, u = b + p - h, L = p + c - b, S = (i[h * o + c] + i[Z * o + m]) / 2, W = p * o + b, G = Math.abs(S - i[W]);
      if (a[W] = Math.max(a[W], G), l < t) {
        const X = (h + L >> 1) * o + (c + u >> 1), T = (Z + L >> 1) * o + (m + u >> 1);
        a[W] = Math.max(a[W], a[X], a[T]);
      }
    }
  }
  getGeometryData(s = 0) {
    const { gridSize: t, indices: e } = this.martini, { errors: o } = this;
    let i = 0, a = 0;
    const l = t - 1;
    let r, c, h = 0;
    e.fill(0);
    function m(W, G, X, T, V, x) {
      const M = W + X >> 1, P = G + T >> 1;
      Math.abs(W - V) + Math.abs(G - x) > 1 && o[P * t + M] > s ? (m(V, x, W, G, M, P), m(X, T, V, x, M, P)) : (r = G * t + W, c = T * t + X, h = x * t + V, e[r] === 0 && (e[r] = ++i), e[c] === 0 && (e[c] = ++i), e[h] === 0 && (e[h] = ++i), a++);
    }
    m(0, 0, l, l, l, 0), m(l, l, 0, 0, 0, l);
    const Z = i * 2, b = a * 3, p = new Uint16Array(Z), u = new Uint32Array(b);
    let L = 0;
    function S(W, G, X, T, V, x) {
      const M = W + X >> 1, P = G + T >> 1;
      if (Math.abs(W - V) + Math.abs(G - x) > 1 && o[P * t + M] > s)
        S(V, x, W, G, M, P), S(X, T, V, x, M, P);
      else {
        const g = e[G * t + W] - 1, Y = e[T * t + X] - 1, D = e[x * t + V] - 1;
        p[2 * g] = W, p[2 * g + 1] = G, p[2 * Y] = X, p[2 * Y + 1] = T, p[2 * D] = V, p[2 * D + 1] = x, u[L++] = g, u[L++] = Y, u[L++] = D;
      }
    }
    return S(0, 0, l, l, l, 0), S(l, l, 0, 0, 0, l), {
      attributes: this._getMeshAttributes(this.terrain, p, u),
      indices: u
    };
  }
  _getMeshAttributes(s, t, e) {
    const o = Math.floor(Math.sqrt(s.length)), i = o - 1, a = t.length / 2, l = new Float32Array(a * 3), r = new Float32Array(a * 2);
    for (let h = 0; h < a; h++) {
      const m = t[h * 2], Z = t[h * 2 + 1], b = Z * o + m;
      l[3 * h + 0] = m / i - 0.5, l[3 * h + 1] = 0.5 - Z / i, l[3 * h + 2] = s[b], r[2 * h + 0] = m / i, r[2 * h + 1] = 1 - Z / i;
    }
    const c = Gt(l, e);
    return {
      position: { value: l, size: 3 },
      texcoord: { value: r, size: 2 },
      normal: { value: c, size: 3 }
    };
  }
}
class us extends Ut {
  constructor() {
    super(...arguments);
    d(this, "onParseEnd");
  }
  parseEnd(t) {
    this.onParseEnd && this.onParseEnd(t);
  }
}
const rt = { name: "GuoJF" }, y = {
  manager: new us(),
  // Dict of dem loader
  demLoaderMap: /* @__PURE__ */ new Map(),
  // Dict of img loader
  imgLoaderMap: /* @__PURE__ */ new Map(),
  /**
   * Register material loader
   * @param loader material loader
   */
  registerMaterialLoader(n) {
    y.imgLoaderMap.set(n.dataType, n), n.info.author = n.info.author ?? rt.name;
  },
  /**
   * Register geometry loader
   * @param loader geometry loader
   */
  registerGeometryLoader(n) {
    y.demLoaderMap.set(n.dataType, n), n.info.author = n.info.author ?? rt.name;
  },
  /**
   * Get material loader from datasource
   * @param source datasource
   * @returns material loader
   */
  getMaterialLoader(n) {
    const s = typeof n == "string" ? n : n.dataType, t = y.imgLoaderMap.get(s);
    if (t)
      return t;
    throw `Image source dataType "${s}" is not support!`;
  },
  /**
   * Get geometry loader from datasource
   * @param source datasouce
   * @returns geometry loader
   */
  getGeometryLoader(n) {
    const s = typeof n == "string" ? n : n.dataType, t = y.demLoaderMap.get(s);
    if (t)
      return t;
    throw `Terrain source dataType "${s}" is not support!`;
  },
  /**
   * Get all loaders
   * @returns Image loaders and terrain loaders
   */
  getLoaders() {
    return {
      imgLoaders: Array.from(y.imgLoaderMap.values()),
      demLoaders: Array.from(y.demLoaderMap.values())
    };
  }
};
class Qs {
  /**
   * 构造函数
   *
   * @param creator 创建一个 Worker 实例的函数
   */
  constructor(s) {
    d(this, "worker");
    this.worker = s();
  }
  /**
   * 异步执行worker任务，并返回结果。
   *
   * @param message 要传递给worker的消息。
   * @param transfer 可转移对象的数组，用于优化内存传输。
   * @returns 返回一个Promise，解析为worker返回的结果。
   */
  async run(s, t) {
    return new Promise((e) => {
      this.worker.onmessage = (o) => {
        e(o.data);
      }, this.worker.postMessage(s, t);
    });
  }
  /**
   * 终止当前工作进程。
   */
  terminate() {
    this.worker.terminate();
  }
}
function q(n, s) {
  const t = Math.floor(n[0] * s), e = Math.floor(n[1] * s), o = Math.floor((n[2] - n[0]) * s), i = Math.floor((n[3] - n[1]) * s);
  return { sx: t, sy: e, sw: o, sh: i };
}
function Vt(n, s, t, e) {
  if (e < n.minLevel)
    return {
      url: void 0,
      clipBounds: [0, 0, 1, 1]
    };
  if (e <= n.maxLevel)
    return {
      url: n.getUrl(s, t, e),
      clipBounds: [0, 0, 1, 1]
    };
  const o = ps(s, t, e, n.maxLevel), i = o.parentCoord;
  return { url: n.getUrl(i.x, i.y, i.z), clipBounds: o.bounds };
}
function Ws(n, s) {
  const t = n.width, e = new OffscreenCanvas(t, t), o = e.getContext("2d"), { sx: i, sy: a, sw: l, sh: r } = q(s, n.width);
  return o.drawImage(n, i, a, l, r, 0, 0, t, t), e;
}
function ps(n, s, t, e) {
  const o = t - e, i = { x: n >> o, y: s >> o, z: t - o }, a = Math.pow(2, o), l = Math.pow(0.5, o), r = n % a / a - 0.5 + l / 2, c = s % a / a - 0.5 + l / 2, h = new st(r, c), m = new ft().setFromCenterAndSize(h, new st(l, l)), Z = [m.min.x + 0.5, m.min.y + 0.5, m.max.x + 0.5, m.max.y + 0.5];
  return { parentCoord: i, bounds: Z };
}
function ys(n, s, t) {
  if (s[0] <= t[0] && s[1] <= t[1] && s[2] >= t[2] && s[3] >= t[3])
    return n;
  const [e, o, i, a] = s, [l, r, c, h] = t, m = Math.max(e, l), Z = Math.max(o, r), b = Math.min(i, c), p = Math.min(a, h);
  if (m >= b || Z >= p)
    return n;
  const u = new OffscreenCanvas(n.width, n.height), L = u.getContext("2d");
  L.drawImage(n, 0, 0);
  const S = Math.max(l, e), W = Math.min(c, i), G = Math.max(r, o), X = Math.min(h, a);
  L.globalCompositeOperation = "destination-in";
  const T = c - l, V = h - r, x = (S - l) / T * u.width, M = (W - l) / T * u.width, P = u.height - (X - r) / V * u.height, g = u.height - (G - r) / V * u.height;
  return L.beginPath(), L.rect(x, P, M - x, g - P), L.fill(), u;
}
const z = class z {
  constructor() {
    d(this, "_bounds", [-180, -85, 180, 85]);
    d(this, "_imgSource", []);
    d(this, "_demSource");
    /** Error material */
    d(this, "_errorMaterial", new et({
      color: 16711680,
      transparent: !0,
      opacity: 0,
      name: "error-material"
    }));
    /** Error geometry */
    d(this, "_errorGeometry", new F());
    /** Background material */
    d(this, "backgroundMaterial", new et({ color: 1122867 }));
    /** Debug single */
    d(this, "debug", 0);
  }
  get bounds() {
    return this._bounds;
  }
  set bounds(s) {
    this._bounds = s;
  }
  /** Get downloading threads */
  get downloadingThreads() {
    return z._downloadingThreads;
  }
  /** Get image source */
  get imgSource() {
    return this._imgSource;
  }
  /** Set image source */
  set imgSource(s) {
    this._imgSource = s;
  }
  /** Get DEM source */
  get demSource() {
    return this._demSource;
  }
  /** Set DEM source */
  set demSource(s) {
    this._demSource = s;
  }
  get projectionID() {
    return this.imgSource[0].projectionID;
  }
  /** Loader manager */
  get manager() {
    return y.manager;
  }
  /**
   * Load getmetry and materail of tile from x, y and z coordinate.
   * @returns Promise<MeshDateType> tile data
   */
  async load(s) {
    const t = await this.loadGeometry(s), e = await this.loadMaterial(s);
    console.assert(!!e && !!t), t.clearGroups();
    for (let i = 0; i < e.length; i++)
      i === 0 && console.assert(e[i] === this.backgroundMaterial), t.addGroup(0, 1 / 0, i);
    return console.assert(e.length === t.groups.length), new Nt(t, e);
  }
  async updateGeometry(s, t) {
    const e = s.geometry;
    s.geometry = await this.loadGeometry(t), s.geometry.groups = e.groups, e.dispose();
  }
  async updateMaterial(s, t) {
    const e = Array.isArray(s.material) ? s.material : [s.material], o = await this.loadMaterial(t);
    s.material = o, s.geometry.clearGroups();
    for (let i = 0; i < o.length; i++)
      s.geometry.addGroup(0, 1 / 0, i);
    for (let i = 0; i < e.length; i++)
      e[i].dispose();
  }
  /**
   * Update tile mesh data
   * @param tileMesh tile mesh
   */
  async update(s, t, e, o) {
    return o && await this.updateGeometry(s, t), e && await this.updateMaterial(s, t), s;
  }
  /**
   * Unload tile mesh data
   * @param tileMesh tile mesh
   */
  unload(s) {
    const t = Array.isArray(s.material) ? s.material : [s.material];
    for (let e = 0; e < t.length; e++)
      t[e].dispose(), s.geometry.groups.pop();
    s.geometry.dispose();
  }
  /**
   * Load geometry
   * @returns BufferGeometry
   */
  async loadGeometry(s) {
    let t;
    const { bounds: e, z: o } = s;
    if (this.demSource && o >= this.demSource.minLevel && this._intersectsBounds(this.demSource, e)) {
      const i = y.getGeometryLoader(this.demSource), a = this.demSource;
      if (z._downloadingThreads++, t = await i.load({ source: a, ...s }).catch((l) => (this.debug > 0 && console.error("Load Geometry Error:", l), this._errorGeometry)).finally(() => {
        z._downloadingThreads--;
      }), t != this._errorGeometry) {
        const l = (r) => {
          i.unload && i.unload(r.target), r.target.removeEventListener("dispose", l);
        };
        t.addEventListener("dispose", l);
      }
    } else
      t = new F();
    return t;
  }
  /**
   * Load material
   * @param x x coordinate of tile
   * @param y y coordinate of tile
   * @param z z coordinate of tile
   * @returns Material[]
   */
  async loadMaterial(s) {
    const t = [this.backgroundMaterial], { bounds: e, z: o } = s, i = this.imgSource.filter((a) => o >= a.minLevel && this._intersectsBounds(a, e));
    for (let a = 0; a < i.length; a++) {
      const l = i[a], r = y.getMaterialLoader(l);
      z._downloadingThreads++;
      const c = await r.load({ source: l, ...s }).catch((h) => (this.debug > 0 && console.error("Load Material Error:", h), this._errorMaterial)).finally(() => {
        z._downloadingThreads--;
      });
      if (c !== this._errorMaterial && c !== this.backgroundMaterial) {
        if ("map" in c && c.map instanceof A) {
          const m = c.map;
          m.image && (m.image = ys(m.image, l._projectionBounds, s.bounds)), m.needsUpdate = !0;
        }
        c.opacity = l.opacity, c.transparent = l.transparent;
        const h = (m) => {
          r.unload && r.unload(m.target), m.target.removeEventListener("dispose", h);
        };
        c.addEventListener("dispose", h), t.push(c);
      }
    }
    return t;
  }
  /**
   * Check the tile is in the source bounds. (projection coordinate)
   * @returns true in the bounds,else false
   */
  _intersectsBounds(s, t) {
    const e = s._projectionBounds;
    return t[2] >= e[0] && t[3] >= e[1] && t[0] <= e[2] && t[1] <= e[3];
  }
};
d(z, "_downloadingThreads", 0);
let B = z;
class $ {
  constructor() {
    d(this, "info", {
      version: I,
      description: "Terrain loader base class"
    });
    d(this, "dataType", "");
  }
  /**
   * load tile's data from source
   * @param source
   * @param tile
   * @param onError
   * @returns
   */
  async load(s) {
    const { source: t, x: e, y: o, z: i } = s, { url: a, clipBounds: l } = Vt(t, e, o, i);
    if (!a)
      return new F();
    const r = await this.doLoad(a, { ...s, clipBounds: l });
    return y.manager.parseEnd(r), r;
  }
}
class Ls {
  constructor() {
    d(this, "info", {
      version: I,
      description: "Image loader base class"
    });
    d(this, "dataType", "");
    d(this, "_material", new yt());
  }
  /** 取得默认材质 */
  get material() {
    return this._material;
  }
  /** 设置默认材质 */
  set material(s) {
    this.material.dispose(), this._material = s;
  }
  /**
   * Load tile material from source
   * @param source
   * @param tile
   * @returns
   */
  async load(s) {
    const { source: t, x: e, y: o, z: i } = s, a = this.createMaterial(), { url: l, clipBounds: r } = Vt(t, e, o, i);
    return l && (a.map = await this.doLoad(l, { ...s, clipBounds: r })), a;
  }
  /**
   * Dispose material
   * @param material material
   */
  unload(s) {
    const t = s.map;
    t && (t.image instanceof ImageBitmap && t.image.close(), t.dispose());
  }
  /**
   * Create material
   * @returns {ITileMaterial} the material of tile
   */
  createMaterial() {
    return this.material.clone();
  }
  /**
   * Download terrain data
   * @param url url
   * @returns {Promise<TBuffer>} the buffer of download data
   */
  async doLoad(s, t) {
    return Promise.resolve(void 0);
  }
}
class Gs {
  constructor() {
    d(this, "info", {
      version: I,
      description: "Canvas tile abstract loader"
    });
    d(this, "dataType", "");
  }
  /**
   * Asynchronously load tile material
   * @param params Tile loading parameters
   * @returns Returns the tile material
   */
  async load(s) {
    const t = this._creatCanvasContext(256, 256);
    this.drawTile(t, s);
    const e = new Et(t.canvas);
    return new yt({
      transparent: !0,
      map: e,
      opacity: s.source.opacity
    });
  }
  _creatCanvasContext(s, t) {
    const o = new OffscreenCanvas(s, t).getContext("2d");
    if (!o)
      throw new Error("create canvas context failed");
    return o;
  }
  unload(s) {
    const t = s.map;
    t && (t.image instanceof ImageBitmap && t.image.close(), t.dispose());
  }
}
class Vs extends Ls {
  constructor() {
    super(...arguments);
    d(this, "info", {
      version: I,
      description: "Tile image loader. It can load xyz tile image."
    });
    d(this, "dataType", "image");
    d(this, "loader", new _(y.manager));
  }
  /**
   * 加载瓦片图像作为纹理
   *
   * @param url 图像资源的URL
   * @param params 加载参数，包括x, y, z坐标、投影范围，裁剪边界clipBounds
   * @returns 返回一个Promise对象，解析为HTMLImageElement类型。
   */
  async doLoad(t, e) {
    const o = await this.loader.loadAsync(t), i = new A();
    i.colorSpace = Dt, i.image = o;
    const a = e.clipBounds;
    return a[2] - a[0] < 1 && (i.image = Ws(o, a)), i;
  }
}
St(new Vs());
const xt = "dmFyIGNlPU9iamVjdC5kZWZpbmVQcm9wZXJ0eTt2YXIgbWU9KGosWixxKT0+WiBpbiBqP2NlKGosWix7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6cX0pOmpbWl09cTt2YXIgTj0oaixaLHEpPT5tZShqLHR5cGVvZiBaIT0ic3ltYm9sIj9aKyIiOloscSk7KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIGooQSxwKXtjb25zdCBrPW5ldyBGbG9hdDMyQXJyYXkoQS5sZW5ndGgpO2ZvcihsZXQgVT0wO1U8cC5sZW5ndGg7VSs9Myl7Y29uc3QgYT1wW1VdKjMsZT1wW1UrMV0qMyxyPXBbVSsyXSozLHM9QVthXSx0PUFbYSsxXSxuPUFbYSsyXSxoPUFbZV0saT1BW2UrMV0sbz1BW2UrMl0sYz1BW3JdLHU9QVtyKzFdLG09QVtyKzJdLHc9aC1zLGw9aS10LGY9by1uLGc9Yy1zLE09dS10LFY9bS1uLGQ9bCpWLWYqTSx5PWYqZy13KlYsST13Kk0tbCpnLHo9TWF0aC5zcXJ0KGQqZCt5KnkrSSpJKSx4PVswLDAsMV07aWYoej4wKXtjb25zdCB2PTEvejt4WzBdPWQqdix4WzFdPXkqdix4WzJdPUkqdn1mb3IobGV0IHY9MDt2PDM7disrKWtbYSt2XT1rW2Urdl09a1tyK3ZdPXhbdl19cmV0dXJuIGt9Y2xhc3MgWntjb25zdHJ1Y3RvcihwPTI1Nyl7Tih0aGlzLCJncmlkU2l6ZSIpO04odGhpcywibnVtVHJpYW5nbGVzIik7Tih0aGlzLCJudW1QYXJlbnRUcmlhbmdsZXMiKTtOKHRoaXMsImluZGljZXMiKTtOKHRoaXMsImNvb3JkcyIpO3RoaXMuZ3JpZFNpemU9cDtjb25zdCBrPXAtMTtpZihrJmstMSl0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGdyaWQgc2l6ZSB0byBiZSAyXm4rMSwgZ290ICR7cH0uYCk7dGhpcy5udW1UcmlhbmdsZXM9ayprKjItMix0aGlzLm51bVBhcmVudFRyaWFuZ2xlcz10aGlzLm51bVRyaWFuZ2xlcy1rKmssdGhpcy5pbmRpY2VzPW5ldyBVaW50MzJBcnJheSh0aGlzLmdyaWRTaXplKnRoaXMuZ3JpZFNpemUpLHRoaXMuY29vcmRzPW5ldyBVaW50MTZBcnJheSh0aGlzLm51bVRyaWFuZ2xlcyo0KTtmb3IobGV0IFU9MDtVPHRoaXMubnVtVHJpYW5nbGVzO1UrKyl7bGV0IGE9VSsyLGU9MCxyPTAscz0wLHQ9MCxuPTAsaD0wO2ZvcihhJjE/cz10PW49azplPXI9aD1rOyhhPj49MSk+MTspe2NvbnN0IG89ZStzPj4xLGM9cit0Pj4xO2EmMT8ocz1lLHQ9cixlPW4scj1oKTooZT1zLHI9dCxzPW4sdD1oKSxuPW8saD1jfWNvbnN0IGk9VSo0O3RoaXMuY29vcmRzW2krMF09ZSx0aGlzLmNvb3Jkc1tpKzFdPXIsdGhpcy5jb29yZHNbaSsyXT1zLHRoaXMuY29vcmRzW2krM109dH19Y3JlYXRlVGlsZShwKXtyZXR1cm4gbmV3IHEocCx0aGlzKX19Y2xhc3MgcXtjb25zdHJ1Y3RvcihwLGspe04odGhpcywibWFydGluaSIpO04odGhpcywidGVycmFpbiIpO04odGhpcywiZXJyb3JzIik7Y29uc3QgVT1rLmdyaWRTaXplO2lmKHAubGVuZ3RoIT09VSpVKXRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgdGVycmFpbiBkYXRhIG9mIGxlbmd0aCAke1UqVX0gKCR7VX0geCAke1V9KSwgZ290ICR7cC5sZW5ndGh9LmApO3RoaXMudGVycmFpbj1wLHRoaXMubWFydGluaT1rLHRoaXMuZXJyb3JzPW5ldyBGbG9hdDMyQXJyYXkocC5sZW5ndGgpLHRoaXMudXBkYXRlKCl9dXBkYXRlKCl7Y29uc3R7bnVtVHJpYW5nbGVzOnAsbnVtUGFyZW50VHJpYW5nbGVzOmssY29vcmRzOlUsZ3JpZFNpemU6YX09dGhpcy5tYXJ0aW5pLHt0ZXJyYWluOmUsZXJyb3JzOnJ9PXRoaXM7Zm9yKGxldCBzPXAtMTtzPj0wO3MtLSl7Y29uc3QgdD1zKjQsbj1VW3QrMF0saD1VW3QrMV0saT1VW3QrMl0sbz1VW3QrM10sYz1uK2k+PjEsdT1oK28+PjEsbT1jK3UtaCx3PXUrbi1jLGw9KGVbaCphK25dK2VbbyphK2ldKS8yLGY9dSphK2MsZz1NYXRoLmFicyhsLWVbZl0pO2lmKHJbZl09TWF0aC5tYXgocltmXSxnKSxzPGspe2NvbnN0IE09KGgrdz4+MSkqYSsobittPj4xKSxWPShvK3c+PjEpKmErKGkrbT4+MSk7cltmXT1NYXRoLm1heChyW2ZdLHJbTV0scltWXSl9fX1nZXRHZW9tZXRyeURhdGEocD0wKXtjb25zdHtncmlkU2l6ZTprLGluZGljZXM6VX09dGhpcy5tYXJ0aW5pLHtlcnJvcnM6YX09dGhpcztsZXQgZT0wLHI9MDtjb25zdCBzPWstMTtsZXQgdCxuLGg9MDtVLmZpbGwoMCk7ZnVuY3Rpb24gaShmLGcsTSxWLGQseSl7Y29uc3QgST1mK00+PjEsej1nK1Y+PjE7TWF0aC5hYnMoZi1kKStNYXRoLmFicyhnLXkpPjEmJmFbeiprK0ldPnA/KGkoZCx5LGYsZyxJLHopLGkoTSxWLGQseSxJLHopKToodD1nKmsrZixuPVYqaytNLGg9eSprK2QsVVt0XT09PTAmJihVW3RdPSsrZSksVVtuXT09PTAmJihVW25dPSsrZSksVVtoXT09PTAmJihVW2hdPSsrZSkscisrKX1pKDAsMCxzLHMscywwKSxpKHMscywwLDAsMCxzKTtjb25zdCBvPWUqMixjPXIqMyx1PW5ldyBVaW50MTZBcnJheShvKSxtPW5ldyBVaW50MzJBcnJheShjKTtsZXQgdz0wO2Z1bmN0aW9uIGwoZixnLE0sVixkLHkpe2NvbnN0IEk9ZitNPj4xLHo9ZytWPj4xO2lmKE1hdGguYWJzKGYtZCkrTWF0aC5hYnMoZy15KT4xJiZhW3oqaytJXT5wKWwoZCx5LGYsZyxJLHopLGwoTSxWLGQseSxJLHopO2Vsc2V7Y29uc3QgeD1VW2cqaytmXS0xLHY9VVtWKmsrTV0tMSxEPVVbeSprK2RdLTE7dVsyKnhdPWYsdVsyKngrMV09Zyx1WzIqdl09TSx1WzIqdisxXT1WLHVbMipEXT1kLHVbMipEKzFdPXksbVt3KytdPXgsbVt3KytdPXYsbVt3KytdPUR9fXJldHVybiBsKDAsMCxzLHMscywwKSxsKHMscywwLDAsMCxzKSx7YXR0cmlidXRlczp0aGlzLl9nZXRNZXNoQXR0cmlidXRlcyh0aGlzLnRlcnJhaW4sdSxtKSxpbmRpY2VzOm19fV9nZXRNZXNoQXR0cmlidXRlcyhwLGssVSl7Y29uc3QgYT1NYXRoLmZsb29yKE1hdGguc3FydChwLmxlbmd0aCkpLGU9YS0xLHI9ay5sZW5ndGgvMixzPW5ldyBGbG9hdDMyQXJyYXkociozKSx0PW5ldyBGbG9hdDMyQXJyYXkocioyKTtmb3IobGV0IGg9MDtoPHI7aCsrKXtjb25zdCBpPWtbaCoyXSxvPWtbaCoyKzFdLGM9byphK2k7c1szKmgrMF09aS9lLS41LHNbMypoKzFdPS41LW8vZSxzWzMqaCsyXT1wW2NdLHRbMipoKzBdPWkvZSx0WzIqaCsxXT0xLW8vZX1jb25zdCBuPWoocyxVKTtyZXR1cm57cG9zaXRpb246e3ZhbHVlOnMsc2l6ZTozfSx0ZXhjb29yZDp7dmFsdWU6dCxzaXplOjJ9LG5vcm1hbDp7dmFsdWU6bixzaXplOjN9fX19LyogQ29weXJpZ2h0IDIwMTUtMjAyMSBFc3JpLiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgIkxpY2Vuc2UiKTsgeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wIEBwcmVzZXJ2ZSAqL2NvbnN0IGVlPWZ1bmN0aW9uKCl7dmFyIEE9e307QS5kZWZhdWx0Tm9EYXRhVmFsdWU9LTM0MDI3OTk5Mzg3OTAxNDg0ZTIyLEEuZGVjb2RlPWZ1bmN0aW9uKHIscyl7cz1zfHx7fTt2YXIgdD1zLmVuY29kZWRNYXNrRGF0YXx8cy5lbmNvZGVkTWFza0RhdGE9PT1udWxsLG49YShyLHMuaW5wdXRPZmZzZXR8fDAsdCksaD1zLm5vRGF0YVZhbHVlIT09bnVsbD9zLm5vRGF0YVZhbHVlOkEuZGVmYXVsdE5vRGF0YVZhbHVlLGk9cChuLHMucGl4ZWxUeXBlfHxGbG9hdDMyQXJyYXkscy5lbmNvZGVkTWFza0RhdGEsaCxzLnJldHVybk1hc2spLG89e3dpZHRoOm4ud2lkdGgsaGVpZ2h0Om4uaGVpZ2h0LHBpeGVsRGF0YTppLnJlc3VsdFBpeGVscyxtaW5WYWx1ZTppLm1pblZhbHVlLG1heFZhbHVlOm4ucGl4ZWxzLm1heFZhbHVlLG5vRGF0YVZhbHVlOmh9O3JldHVybiBpLnJlc3VsdE1hc2smJihvLm1hc2tEYXRhPWkucmVzdWx0TWFzaykscy5yZXR1cm5FbmNvZGVkTWFzayYmbi5tYXNrJiYoby5lbmNvZGVkTWFza0RhdGE9bi5tYXNrLmJpdHNldD9uLm1hc2suYml0c2V0Om51bGwpLHMucmV0dXJuRmlsZUluZm8mJihvLmZpbGVJbmZvPWsobikscy5jb21wdXRlVXNlZEJpdERlcHRocyYmKG8uZmlsZUluZm8uYml0RGVwdGhzPVUobikpKSxvfTt2YXIgcD1mdW5jdGlvbihyLHMsdCxuLGgpe3ZhciBpPTAsbz1yLnBpeGVscy5udW1CbG9ja3NYLGM9ci5waXhlbHMubnVtQmxvY2tzWSx1PU1hdGguZmxvb3Ioci53aWR0aC9vKSxtPU1hdGguZmxvb3Ioci5oZWlnaHQvYyksdz0yKnIubWF4WkVycm9yLGw9TnVtYmVyLk1BWF9WQUxVRSxmO3Q9dHx8KHIubWFzaz9yLm1hc2suYml0c2V0Om51bGwpO3ZhciBnLE07Zz1uZXcgcyhyLndpZHRoKnIuaGVpZ2h0KSxoJiZ0JiYoTT1uZXcgVWludDhBcnJheShyLndpZHRoKnIuaGVpZ2h0KSk7Zm9yKHZhciBWPW5ldyBGbG9hdDMyQXJyYXkodSptKSxkLHksST0wO0k8PWM7SSsrKXt2YXIgej1JIT09Yz9tOnIuaGVpZ2h0JWM7aWYoeiE9PTApZm9yKHZhciB4PTA7eDw9bzt4Kyspe3ZhciB2PXghPT1vP3U6ci53aWR0aCVvO2lmKHYhPT0wKXt2YXIgRD1JKnIud2lkdGgqbSt4KnUsVD1yLndpZHRoLXYsUz1yLnBpeGVscy5ibG9ja3NbaV0sQixMLEY7Uy5lbmNvZGluZzwyPyhTLmVuY29kaW5nPT09MD9CPVMucmF3RGF0YTooZShTLnN0dWZmZWREYXRhLFMuYml0c1BlclBpeGVsLFMubnVtVmFsaWRQaXhlbHMsUy5vZmZzZXQsdyxWLHIucGl4ZWxzLm1heFZhbHVlKSxCPVYpLEw9MCk6Uy5lbmNvZGluZz09PTI/Rj0wOkY9Uy5vZmZzZXQ7dmFyIGI7aWYodClmb3IoeT0wO3k8ejt5Kyspe2ZvcihEJjcmJihiPXRbRD4+M10sYjw8PUQmNyksZD0wO2Q8djtkKyspRCY3fHwoYj10W0Q+PjNdKSxiJjEyOD8oTSYmKE1bRF09MSksZj1TLmVuY29kaW5nPDI/QltMKytdOkYsbD1sPmY/ZjpsLGdbRCsrXT1mKTooTSYmKE1bRF09MCksZ1tEKytdPW4pLGI8PD0xO0QrPVR9ZWxzZSBpZihTLmVuY29kaW5nPDIpZm9yKHk9MDt5PHo7eSsrKXtmb3IoZD0wO2Q8djtkKyspZj1CW0wrK10sbD1sPmY/ZjpsLGdbRCsrXT1mO0QrPVR9ZWxzZSBmb3IobD1sPkY/RjpsLHk9MDt5PHo7eSsrKXtmb3IoZD0wO2Q8djtkKyspZ1tEKytdPUY7RCs9VH1pZihTLmVuY29kaW5nPT09MSYmTCE9PVMubnVtVmFsaWRQaXhlbHMpdGhyb3ciQmxvY2sgYW5kIE1hc2sgZG8gbm90IG1hdGNoIjtpKyt9fX1yZXR1cm57cmVzdWx0UGl4ZWxzOmcscmVzdWx0TWFzazpNLG1pblZhbHVlOmx9fSxrPWZ1bmN0aW9uKHIpe3JldHVybntmaWxlSWRlbnRpZmllclN0cmluZzpyLmZpbGVJZGVudGlmaWVyU3RyaW5nLGZpbGVWZXJzaW9uOnIuZmlsZVZlcnNpb24saW1hZ2VUeXBlOnIuaW1hZ2VUeXBlLGhlaWdodDpyLmhlaWdodCx3aWR0aDpyLndpZHRoLG1heFpFcnJvcjpyLm1heFpFcnJvcixlb2ZPZmZzZXQ6ci5lb2ZPZmZzZXQsbWFzazpyLm1hc2s/e251bUJsb2Nrc1g6ci5tYXNrLm51bUJsb2Nrc1gsbnVtQmxvY2tzWTpyLm1hc2subnVtQmxvY2tzWSxudW1CeXRlczpyLm1hc2subnVtQnl0ZXMsbWF4VmFsdWU6ci5tYXNrLm1heFZhbHVlfTpudWxsLHBpeGVsczp7bnVtQmxvY2tzWDpyLnBpeGVscy5udW1CbG9ja3NYLG51bUJsb2Nrc1k6ci5waXhlbHMubnVtQmxvY2tzWSxudW1CeXRlczpyLnBpeGVscy5udW1CeXRlcyxtYXhWYWx1ZTpyLnBpeGVscy5tYXhWYWx1ZSxub0RhdGFWYWx1ZTpyLm5vRGF0YVZhbHVlfX19LFU9ZnVuY3Rpb24ocil7Zm9yKHZhciBzPXIucGl4ZWxzLm51bUJsb2Nrc1gqci5waXhlbHMubnVtQmxvY2tzWSx0PXt9LG49MDtuPHM7bisrKXt2YXIgaD1yLnBpeGVscy5ibG9ja3Nbbl07aC5lbmNvZGluZz09PTA/dC5mbG9hdDMyPSEwOmguZW5jb2Rpbmc9PT0xP3RbaC5iaXRzUGVyUGl4ZWxdPSEwOnRbMF09ITB9cmV0dXJuIE9iamVjdC5rZXlzKHQpfSxhPWZ1bmN0aW9uKHIscyx0KXt2YXIgbj17fSxoPW5ldyBVaW50OEFycmF5KHIscywxMCk7aWYobi5maWxlSWRlbnRpZmllclN0cmluZz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsaCksbi5maWxlSWRlbnRpZmllclN0cmluZy50cmltKCkhPT0iQ250WkltYWdlIil0aHJvdyJVbmV4cGVjdGVkIGZpbGUgaWRlbnRpZmllciBzdHJpbmc6ICIrbi5maWxlSWRlbnRpZmllclN0cmluZztzKz0xMDt2YXIgaT1uZXcgRGF0YVZpZXcocixzLDI0KTtpZihuLmZpbGVWZXJzaW9uPWkuZ2V0SW50MzIoMCwhMCksbi5pbWFnZVR5cGU9aS5nZXRJbnQzMig0LCEwKSxuLmhlaWdodD1pLmdldFVpbnQzMig4LCEwKSxuLndpZHRoPWkuZ2V0VWludDMyKDEyLCEwKSxuLm1heFpFcnJvcj1pLmdldEZsb2F0NjQoMTYsITApLHMrPTI0LCF0KWlmKGk9bmV3IERhdGFWaWV3KHIscywxNiksbi5tYXNrPXt9LG4ubWFzay5udW1CbG9ja3NZPWkuZ2V0VWludDMyKDAsITApLG4ubWFzay5udW1CbG9ja3NYPWkuZ2V0VWludDMyKDQsITApLG4ubWFzay5udW1CeXRlcz1pLmdldFVpbnQzMig4LCEwKSxuLm1hc2subWF4VmFsdWU9aS5nZXRGbG9hdDMyKDEyLCEwKSxzKz0xNixuLm1hc2subnVtQnl0ZXM+MCl7dmFyIG89bmV3IFVpbnQ4QXJyYXkoTWF0aC5jZWlsKG4ud2lkdGgqbi5oZWlnaHQvOCkpO2k9bmV3IERhdGFWaWV3KHIscyxuLm1hc2subnVtQnl0ZXMpO3ZhciBjPWkuZ2V0SW50MTYoMCwhMCksdT0yLG09MDtkb3tpZihjPjApZm9yKDtjLS07KW9bbSsrXT1pLmdldFVpbnQ4KHUrKyk7ZWxzZXt2YXIgdz1pLmdldFVpbnQ4KHUrKyk7Zm9yKGM9LWM7Yy0tOylvW20rK109d31jPWkuZ2V0SW50MTYodSwhMCksdSs9Mn13aGlsZSh1PG4ubWFzay5udW1CeXRlcyk7aWYoYyE9PS0zMjc2OHx8bTxvLmxlbmd0aCl0aHJvdyJVbmV4cGVjdGVkIGVuZCBvZiBtYXNrIFJMRSBlbmNvZGluZyI7bi5tYXNrLmJpdHNldD1vLHMrPW4ubWFzay5udW1CeXRlc31lbHNlIG4ubWFzay5udW1CeXRlc3xuLm1hc2subnVtQmxvY2tzWXxuLm1hc2subWF4VmFsdWV8fChuLm1hc2suYml0c2V0PW5ldyBVaW50OEFycmF5KE1hdGguY2VpbChuLndpZHRoKm4uaGVpZ2h0LzgpKSk7aT1uZXcgRGF0YVZpZXcocixzLDE2KSxuLnBpeGVscz17fSxuLnBpeGVscy5udW1CbG9ja3NZPWkuZ2V0VWludDMyKDAsITApLG4ucGl4ZWxzLm51bUJsb2Nrc1g9aS5nZXRVaW50MzIoNCwhMCksbi5waXhlbHMubnVtQnl0ZXM9aS5nZXRVaW50MzIoOCwhMCksbi5waXhlbHMubWF4VmFsdWU9aS5nZXRGbG9hdDMyKDEyLCEwKSxzKz0xNjt2YXIgbD1uLnBpeGVscy5udW1CbG9ja3NYLGY9bi5waXhlbHMubnVtQmxvY2tzWSxnPWwrKG4ud2lkdGglbD4wPzE6MCksTT1mKyhuLmhlaWdodCVmPjA/MTowKTtuLnBpeGVscy5ibG9ja3M9bmV3IEFycmF5KGcqTSk7Zm9yKHZhciBWPTAsZD0wO2Q8TTtkKyspZm9yKHZhciB5PTA7eTxnO3krKyl7dmFyIEk9MCx6PXIuYnl0ZUxlbmd0aC1zO2k9bmV3IERhdGFWaWV3KHIscyxNYXRoLm1pbigxMCx6KSk7dmFyIHg9e307bi5waXhlbHMuYmxvY2tzW1YrK109eDt2YXIgdj1pLmdldFVpbnQ4KDApO2lmKEkrKyx4LmVuY29kaW5nPXYmNjMseC5lbmNvZGluZz4zKXRocm93IkludmFsaWQgYmxvY2sgZW5jb2RpbmcgKCIreC5lbmNvZGluZysiKSI7aWYoeC5lbmNvZGluZz09PTIpe3MrKztjb250aW51ZX1pZih2IT09MCYmdiE9PTIpe2lmKHY+Pj02LHgub2Zmc2V0VHlwZT12LHY9PT0yKXgub2Zmc2V0PWkuZ2V0SW50OCgxKSxJKys7ZWxzZSBpZih2PT09MSl4Lm9mZnNldD1pLmdldEludDE2KDEsITApLEkrPTI7ZWxzZSBpZih2PT09MCl4Lm9mZnNldD1pLmdldEZsb2F0MzIoMSwhMCksSSs9NDtlbHNlIHRocm93IkludmFsaWQgYmxvY2sgb2Zmc2V0IHR5cGUiO2lmKHguZW5jb2Rpbmc9PT0xKWlmKHY9aS5nZXRVaW50OChJKSxJKysseC5iaXRzUGVyUGl4ZWw9diY2Myx2Pj49Nix4Lm51bVZhbGlkUGl4ZWxzVHlwZT12LHY9PT0yKXgubnVtVmFsaWRQaXhlbHM9aS5nZXRVaW50OChJKSxJKys7ZWxzZSBpZih2PT09MSl4Lm51bVZhbGlkUGl4ZWxzPWkuZ2V0VWludDE2KEksITApLEkrPTI7ZWxzZSBpZih2PT09MCl4Lm51bVZhbGlkUGl4ZWxzPWkuZ2V0VWludDMyKEksITApLEkrPTQ7ZWxzZSB0aHJvdyJJbnZhbGlkIHZhbGlkIHBpeGVsIGNvdW50IHR5cGUifWlmKHMrPUkseC5lbmNvZGluZyE9PTMpe3ZhciBELFQ7aWYoeC5lbmNvZGluZz09PTApe3ZhciBTPShuLnBpeGVscy5udW1CeXRlcy0xKS80O2lmKFMhPT1NYXRoLmZsb29yKFMpKXRocm93InVuY29tcHJlc3NlZCBibG9jayBoYXMgaW52YWxpZCBsZW5ndGgiO0Q9bmV3IEFycmF5QnVmZmVyKFMqNCksVD1uZXcgVWludDhBcnJheShEKSxULnNldChuZXcgVWludDhBcnJheShyLHMsUyo0KSk7dmFyIEI9bmV3IEZsb2F0MzJBcnJheShEKTt4LnJhd0RhdGE9QixzKz1TKjR9ZWxzZSBpZih4LmVuY29kaW5nPT09MSl7dmFyIEw9TWF0aC5jZWlsKHgubnVtVmFsaWRQaXhlbHMqeC5iaXRzUGVyUGl4ZWwvOCksRj1NYXRoLmNlaWwoTC80KTtEPW5ldyBBcnJheUJ1ZmZlcihGKjQpLFQ9bmV3IFVpbnQ4QXJyYXkoRCksVC5zZXQobmV3IFVpbnQ4QXJyYXkocixzLEwpKSx4LnN0dWZmZWREYXRhPW5ldyBVaW50MzJBcnJheShEKSxzKz1MfX19cmV0dXJuIG4uZW9mT2Zmc2V0PXMsbn0sZT1mdW5jdGlvbihyLHMsdCxuLGgsaSxvKXt2YXIgYz0oMTw8cyktMSx1PTAsbSx3PTAsbCxmLGc9TWF0aC5jZWlsKChvLW4pL2gpLE09ci5sZW5ndGgqNC1NYXRoLmNlaWwocyp0LzgpO2ZvcihyW3IubGVuZ3RoLTFdPDw9OCpNLG09MDttPHQ7bSsrKXtpZih3PT09MCYmKGY9clt1KytdLHc9MzIpLHc+PXMpbD1mPj4+dy1zJmMsdy09cztlbHNle3ZhciBWPXMtdztsPShmJmMpPDxWJmMsZj1yW3UrK10sdz0zMi1WLGwrPWY+Pj53fWlbbV09bDxnP24rbCpoOm99cmV0dXJuIGl9O3JldHVybiBBfSgpLHJlPWZ1bmN0aW9uKCl7dmFyIEE9e3Vuc3R1ZmY6ZnVuY3Rpb24oYSxlLHIscyx0LG4saCxpKXt2YXIgbz0oMTw8ciktMSxjPTAsdSxtPTAsdyxsLGYsZyxNPWEubGVuZ3RoKjQtTWF0aC5jZWlsKHIqcy84KTtpZihhW2EubGVuZ3RoLTFdPDw9OCpNLHQpZm9yKHU9MDt1PHM7dSsrKW09PT0wJiYobD1hW2MrK10sbT0zMiksbT49cj8odz1sPj4+bS1yJm8sbS09cik6KGY9ci1tLHc9KGwmbyk8PGYmbyxsPWFbYysrXSxtPTMyLWYsdys9bD4+Pm0pLGVbdV09dFt3XTtlbHNlIGZvcihnPU1hdGguY2VpbCgoaS1uKS9oKSx1PTA7dTxzO3UrKyltPT09MCYmKGw9YVtjKytdLG09MzIpLG0+PXI/KHc9bD4+Pm0tciZvLG0tPXIpOihmPXItbSx3PShsJm8pPDxmJm8sbD1hW2MrK10sbT0zMi1mLHcrPWw+Pj5tKSxlW3VdPXc8Zz9uK3cqaDppfSx1bnN0dWZmTFVUOmZ1bmN0aW9uKGEsZSxyLHMsdCxuKXt2YXIgaD0oMTw8ZSktMSxpPTAsbz0wLGM9MCx1PTAsbT0wLHcsbD1bXSxmPWEubGVuZ3RoKjQtTWF0aC5jZWlsKGUqci84KTthW2EubGVuZ3RoLTFdPDw9OCpmO3ZhciBnPU1hdGguY2VpbCgobi1zKS90KTtmb3Iobz0wO288cjtvKyspdT09PTAmJih3PWFbaSsrXSx1PTMyKSx1Pj1lPyhtPXc+Pj51LWUmaCx1LT1lKTooYz1lLXUsbT0odyZoKTw8YyZoLHc9YVtpKytdLHU9MzItYyxtKz13Pj4+dSksbFtvXT1tPGc/cyttKnQ6bjtyZXR1cm4gbC51bnNoaWZ0KHMpLGx9LHVuc3R1ZmYyOmZ1bmN0aW9uKGEsZSxyLHMsdCxuLGgsaSl7dmFyIG89KDE8PHIpLTEsYz0wLHUsbT0wLHc9MCxsLGYsZztpZih0KWZvcih1PTA7dTxzO3UrKyltPT09MCYmKGY9YVtjKytdLG09MzIsdz0wKSxtPj1yPyhsPWY+Pj53Jm8sbS09cix3Kz1yKTooZz1yLW0sbD1mPj4+dyZvLGY9YVtjKytdLG09MzItZyxsfD0oZiYoMTw8ZyktMSk8PHItZyx3PWcpLGVbdV09dFtsXTtlbHNle3ZhciBNPU1hdGguY2VpbCgoaS1uKS9oKTtmb3IodT0wO3U8czt1KyspbT09PTAmJihmPWFbYysrXSxtPTMyLHc9MCksbT49cj8obD1mPj4+dyZvLG0tPXIsdys9cik6KGc9ci1tLGw9Zj4+PncmbyxmPWFbYysrXSxtPTMyLWcsbHw9KGYmKDE8PGcpLTEpPDxyLWcsdz1nKSxlW3VdPWw8TT9uK2wqaDppfXJldHVybiBlfSx1bnN0dWZmTFVUMjpmdW5jdGlvbihhLGUscixzLHQsbil7dmFyIGg9KDE8PGUpLTEsaT0wLG89MCxjPTAsdT0wLG09MCx3PTAsbCxmPVtdLGc9TWF0aC5jZWlsKChuLXMpL3QpO2ZvcihvPTA7bzxyO28rKyl1PT09MCYmKGw9YVtpKytdLHU9MzIsdz0wKSx1Pj1lPyhtPWw+Pj53JmgsdS09ZSx3Kz1lKTooYz1lLXUsbT1sPj4+dyZoLGw9YVtpKytdLHU9MzItYyxtfD0obCYoMTw8YyktMSk8PGUtYyx3PWMpLGZbb109bTxnP3MrbSp0Om47cmV0dXJuIGYudW5zaGlmdChzKSxmfSxvcmlnaW5hbFVuc3R1ZmY6ZnVuY3Rpb24oYSxlLHIscyl7dmFyIHQ9KDE8PHIpLTEsbj0wLGgsaT0wLG8sYyx1LG09YS5sZW5ndGgqNC1NYXRoLmNlaWwocipzLzgpO2ZvcihhW2EubGVuZ3RoLTFdPDw9OCptLGg9MDtoPHM7aCsrKWk9PT0wJiYoYz1hW24rK10saT0zMiksaT49cj8obz1jPj4+aS1yJnQsaS09cik6KHU9ci1pLG89KGMmdCk8PHUmdCxjPWFbbisrXSxpPTMyLXUsbys9Yz4+PmkpLGVbaF09bztyZXR1cm4gZX0sb3JpZ2luYWxVbnN0dWZmMjpmdW5jdGlvbihhLGUscixzKXt2YXIgdD0oMTw8ciktMSxuPTAsaCxpPTAsbz0wLGMsdSxtO2ZvcihoPTA7aDxzO2grKylpPT09MCYmKHU9YVtuKytdLGk9MzIsbz0wKSxpPj1yPyhjPXU+Pj5vJnQsaS09cixvKz1yKToobT1yLWksYz11Pj4+byZ0LHU9YVtuKytdLGk9MzItbSxjfD0odSYoMTw8bSktMSk8PHItbSxvPW0pLGVbaF09YztyZXR1cm4gZX19LHA9e0hVRkZNQU5fTFVUX0JJVFNfTUFYOjEyLGNvbXB1dGVDaGVja3N1bUZsZXRjaGVyMzI6ZnVuY3Rpb24oYSl7Zm9yKHZhciBlPTY1NTM1LHI9NjU1MzUscz1hLmxlbmd0aCx0PU1hdGguZmxvb3Iocy8yKSxuPTA7dDspe3ZhciBoPXQ+PTM1OT8zNTk6dDt0LT1oO2RvIGUrPWFbbisrXTw8OCxyKz1lKz1hW24rK107d2hpbGUoLS1oKTtlPShlJjY1NTM1KSsoZT4+PjE2KSxyPShyJjY1NTM1KSsocj4+PjE2KX1yZXR1cm4gcyYxJiYocis9ZSs9YVtuXTw8OCksZT0oZSY2NTUzNSkrKGU+Pj4xNikscj0ociY2NTUzNSkrKHI+Pj4xNiksKHI8PDE2fGUpPj4+MH0scmVhZEhlYWRlckluZm86ZnVuY3Rpb24oYSxlKXt2YXIgcj1lLnB0cixzPW5ldyBVaW50OEFycmF5KGEsciw2KSx0PXt9O2lmKHQuZmlsZUlkZW50aWZpZXJTdHJpbmc9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLHMpLHQuZmlsZUlkZW50aWZpZXJTdHJpbmcubGFzdEluZGV4T2YoIkxlcmMyIiwwKSE9PTApdGhyb3ciVW5leHBlY3RlZCBmaWxlIGlkZW50aWZpZXIgc3RyaW5nIChleHBlY3QgTGVyYzIgKTogIit0LmZpbGVJZGVudGlmaWVyU3RyaW5nO3IrPTY7dmFyIG49bmV3IERhdGFWaWV3KGEsciw4KSxoPW4uZ2V0SW50MzIoMCwhMCk7dC5maWxlVmVyc2lvbj1oLHIrPTQsaD49MyYmKHQuY2hlY2tzdW09bi5nZXRVaW50MzIoNCwhMCkscis9NCksbj1uZXcgRGF0YVZpZXcoYSxyLDEyKSx0LmhlaWdodD1uLmdldFVpbnQzMigwLCEwKSx0LndpZHRoPW4uZ2V0VWludDMyKDQsITApLHIrPTgsaD49ND8odC5udW1EaW1zPW4uZ2V0VWludDMyKDgsITApLHIrPTQpOnQubnVtRGltcz0xLG49bmV3IERhdGFWaWV3KGEsciw0MCksdC5udW1WYWxpZFBpeGVsPW4uZ2V0VWludDMyKDAsITApLHQubWljcm9CbG9ja1NpemU9bi5nZXRJbnQzMig0LCEwKSx0LmJsb2JTaXplPW4uZ2V0SW50MzIoOCwhMCksdC5pbWFnZVR5cGU9bi5nZXRJbnQzMigxMiwhMCksdC5tYXhaRXJyb3I9bi5nZXRGbG9hdDY0KDE2LCEwKSx0LnpNaW49bi5nZXRGbG9hdDY0KDI0LCEwKSx0LnpNYXg9bi5nZXRGbG9hdDY0KDMyLCEwKSxyKz00MCxlLmhlYWRlckluZm89dCxlLnB0cj1yO3ZhciBpLG87aWYoaD49MyYmKG89aD49ND81Mjo0OCxpPXRoaXMuY29tcHV0ZUNoZWNrc3VtRmxldGNoZXIzMihuZXcgVWludDhBcnJheShhLHItbyx0LmJsb2JTaXplLTE0KSksaSE9PXQuY2hlY2tzdW0pKXRocm93IkNoZWNrc3VtIGZhaWxlZC4iO3JldHVybiEwfSxjaGVja01pbk1heFJhbmdlczpmdW5jdGlvbihhLGUpe3ZhciByPWUuaGVhZGVySW5mbyxzPXRoaXMuZ2V0RGF0YVR5cGVBcnJheShyLmltYWdlVHlwZSksdD1yLm51bURpbXMqdGhpcy5nZXREYXRhVHlwZVNpemUoci5pbWFnZVR5cGUpLG49dGhpcy5yZWFkU3ViQXJyYXkoYSxlLnB0cixzLHQpLGg9dGhpcy5yZWFkU3ViQXJyYXkoYSxlLnB0cit0LHMsdCk7ZS5wdHIrPTIqdDt2YXIgaSxvPSEwO2ZvcihpPTA7aTxyLm51bURpbXM7aSsrKWlmKG5baV0hPT1oW2ldKXtvPSExO2JyZWFrfXJldHVybiByLm1pblZhbHVlcz1uLHIubWF4VmFsdWVzPWgsb30scmVhZFN1YkFycmF5OmZ1bmN0aW9uKGEsZSxyLHMpe3ZhciB0O2lmKHI9PT1VaW50OEFycmF5KXQ9bmV3IFVpbnQ4QXJyYXkoYSxlLHMpO2Vsc2V7dmFyIG49bmV3IEFycmF5QnVmZmVyKHMpLGg9bmV3IFVpbnQ4QXJyYXkobik7aC5zZXQobmV3IFVpbnQ4QXJyYXkoYSxlLHMpKSx0PW5ldyByKG4pfXJldHVybiB0fSxyZWFkTWFzazpmdW5jdGlvbihhLGUpe3ZhciByPWUucHRyLHM9ZS5oZWFkZXJJbmZvLHQ9cy53aWR0aCpzLmhlaWdodCxuPXMubnVtVmFsaWRQaXhlbCxoPW5ldyBEYXRhVmlldyhhLHIsNCksaT17fTtpZihpLm51bUJ5dGVzPWguZ2V0VWludDMyKDAsITApLHIrPTQsKG49PT0wfHx0PT09bikmJmkubnVtQnl0ZXMhPT0wKXRocm93ImludmFsaWQgbWFzayI7dmFyIG8sYztpZihuPT09MClvPW5ldyBVaW50OEFycmF5KE1hdGguY2VpbCh0LzgpKSxpLmJpdHNldD1vLGM9bmV3IFVpbnQ4QXJyYXkodCksZS5waXhlbHMucmVzdWx0TWFzaz1jLHIrPWkubnVtQnl0ZXM7ZWxzZSBpZihpLm51bUJ5dGVzPjApe289bmV3IFVpbnQ4QXJyYXkoTWF0aC5jZWlsKHQvOCkpLGg9bmV3IERhdGFWaWV3KGEscixpLm51bUJ5dGVzKTt2YXIgdT1oLmdldEludDE2KDAsITApLG09Mix3PTAsbD0wO2Rve2lmKHU+MClmb3IoO3UtLTspb1t3KytdPWguZ2V0VWludDgobSsrKTtlbHNlIGZvcihsPWguZ2V0VWludDgobSsrKSx1PS11O3UtLTspb1t3KytdPWw7dT1oLmdldEludDE2KG0sITApLG0rPTJ9d2hpbGUobTxpLm51bUJ5dGVzKTtpZih1IT09LTMyNzY4fHx3PG8ubGVuZ3RoKXRocm93IlVuZXhwZWN0ZWQgZW5kIG9mIG1hc2sgUkxFIGVuY29kaW5nIjtjPW5ldyBVaW50OEFycmF5KHQpO3ZhciBmPTAsZz0wO2ZvcihnPTA7Zzx0O2crKylnJjc/KGY9b1tnPj4zXSxmPDw9ZyY3KTpmPW9bZz4+M10sZiYxMjgmJihjW2ddPTEpO2UucGl4ZWxzLnJlc3VsdE1hc2s9YyxpLmJpdHNldD1vLHIrPWkubnVtQnl0ZXN9cmV0dXJuIGUucHRyPXIsZS5tYXNrPWksITB9LHJlYWREYXRhT25lU3dlZXA6ZnVuY3Rpb24oYSxlLHIscyl7dmFyIHQ9ZS5wdHIsbj1lLmhlYWRlckluZm8saD1uLm51bURpbXMsaT1uLndpZHRoKm4uaGVpZ2h0LG89bi5pbWFnZVR5cGUsYz1uLm51bVZhbGlkUGl4ZWwqcC5nZXREYXRhVHlwZVNpemUobykqaCx1LG09ZS5waXhlbHMucmVzdWx0TWFzaztpZihyPT09VWludDhBcnJheSl1PW5ldyBVaW50OEFycmF5KGEsdCxjKTtlbHNle3ZhciB3PW5ldyBBcnJheUJ1ZmZlcihjKSxsPW5ldyBVaW50OEFycmF5KHcpO2wuc2V0KG5ldyBVaW50OEFycmF5KGEsdCxjKSksdT1uZXcgcih3KX1pZih1Lmxlbmd0aD09PWkqaClzP2UucGl4ZWxzLnJlc3VsdFBpeGVscz1wLnN3YXBEaW1lbnNpb25PcmRlcih1LGksaCxyLCEwKTplLnBpeGVscy5yZXN1bHRQaXhlbHM9dTtlbHNle2UucGl4ZWxzLnJlc3VsdFBpeGVscz1uZXcgcihpKmgpO3ZhciBmPTAsZz0wLE09MCxWPTA7aWYoaD4xKXtpZihzKXtmb3IoZz0wO2c8aTtnKyspaWYobVtnXSlmb3IoVj1nLE09MDtNPGg7TSsrLFYrPWkpZS5waXhlbHMucmVzdWx0UGl4ZWxzW1ZdPXVbZisrXX1lbHNlIGZvcihnPTA7ZzxpO2crKylpZihtW2ddKWZvcihWPWcqaCxNPTA7TTxoO00rKyllLnBpeGVscy5yZXN1bHRQaXhlbHNbVitNXT11W2YrK119ZWxzZSBmb3IoZz0wO2c8aTtnKyspbVtnXSYmKGUucGl4ZWxzLnJlc3VsdFBpeGVsc1tnXT11W2YrK10pfXJldHVybiB0Kz1jLGUucHRyPXQsITB9LHJlYWRIdWZmbWFuVHJlZTpmdW5jdGlvbihhLGUpe3ZhciByPXRoaXMuSFVGRk1BTl9MVVRfQklUU19NQVgscz1uZXcgRGF0YVZpZXcoYSxlLnB0ciwxNik7ZS5wdHIrPTE2O3ZhciB0PXMuZ2V0SW50MzIoMCwhMCk7aWYodDwyKXRocm93InVuc3VwcG9ydGVkIEh1ZmZtYW4gdmVyc2lvbiI7dmFyIG49cy5nZXRJbnQzMig0LCEwKSxoPXMuZ2V0SW50MzIoOCwhMCksaT1zLmdldEludDMyKDEyLCEwKTtpZihoPj1pKXJldHVybiExO3ZhciBvPW5ldyBVaW50MzJBcnJheShpLWgpO3AuZGVjb2RlQml0cyhhLGUsbyk7dmFyIGM9W10sdSxtLHcsbDtmb3IodT1oO3U8aTt1KyspbT11LSh1PG4/MDpuKSxjW21dPXtmaXJzdDpvW3UtaF0sc2Vjb25kOm51bGx9O3ZhciBmPWEuYnl0ZUxlbmd0aC1lLnB0cixnPU1hdGguY2VpbChmLzQpLE09bmV3IEFycmF5QnVmZmVyKGcqNCksVj1uZXcgVWludDhBcnJheShNKTtWLnNldChuZXcgVWludDhBcnJheShhLGUucHRyLGYpKTt2YXIgZD1uZXcgVWludDMyQXJyYXkoTSkseT0wLEksej0wO2ZvcihJPWRbMF0sdT1oO3U8aTt1KyspbT11LSh1PG4/MDpuKSxsPWNbbV0uZmlyc3QsbD4wJiYoY1ttXS5zZWNvbmQ9STw8eT4+PjMyLWwsMzIteT49bD8oeSs9bCx5PT09MzImJih5PTAseisrLEk9ZFt6XSkpOih5Kz1sLTMyLHorKyxJPWRbel0sY1ttXS5zZWNvbmR8PUk+Pj4zMi15KSk7dmFyIHg9MCx2PTAsRD1uZXcgaztmb3IodT0wO3U8Yy5sZW5ndGg7dSsrKWNbdV0hPT12b2lkIDAmJih4PU1hdGgubWF4KHgsY1t1XS5maXJzdCkpO3g+PXI/dj1yOnY9eDt2YXIgVD1bXSxTLEIsTCxGLGIsQztmb3IodT1oO3U8aTt1KyspaWYobT11LSh1PG4/MDpuKSxsPWNbbV0uZmlyc3QsbD4wKWlmKFM9W2wsbV0sbDw9dilmb3IoQj1jW21dLnNlY29uZDw8di1sLEw9MTw8di1sLHc9MDt3PEw7dysrKVRbQnx3XT1TO2Vsc2UgZm9yKEI9Y1ttXS5zZWNvbmQsQz1ELEY9bC0xO0Y+PTA7Ri0tKWI9Qj4+PkYmMSxiPyhDLnJpZ2h0fHwoQy5yaWdodD1uZXcgayksQz1DLnJpZ2h0KTooQy5sZWZ0fHwoQy5sZWZ0PW5ldyBrKSxDPUMubGVmdCksRj09PTAmJiFDLnZhbCYmKEMudmFsPVNbMV0pO3JldHVybntkZWNvZGVMdXQ6VCxudW1CaXRzTFVUUWljazp2LG51bUJpdHNMVVQ6eCx0cmVlOkQsc3R1ZmZlZERhdGE6ZCxzcmNQdHI6eixiaXRQb3M6eX19LHJlYWRIdWZmbWFuOmZ1bmN0aW9uKGEsZSxyLHMpe3ZhciB0PWUuaGVhZGVySW5mbyxuPXQubnVtRGltcyxoPWUuaGVhZGVySW5mby5oZWlnaHQsaT1lLmhlYWRlckluZm8ud2lkdGgsbz1pKmgsYz10aGlzLnJlYWRIdWZmbWFuVHJlZShhLGUpLHU9Yy5kZWNvZGVMdXQsbT1jLnRyZWUsdz1jLnN0dWZmZWREYXRhLGw9Yy5zcmNQdHIsZj1jLmJpdFBvcyxnPWMubnVtQml0c0xVVFFpY2ssTT1jLm51bUJpdHNMVVQsVj1lLmhlYWRlckluZm8uaW1hZ2VUeXBlPT09MD8xMjg6MCxkLHksSSx6PWUucGl4ZWxzLnJlc3VsdE1hc2sseCx2LEQsVCxTLEIsTCxGPTA7Zj4wJiYobCsrLGY9MCk7dmFyIGI9d1tsXSxDPWUuZW5jb2RlTW9kZT09PTEsUj1uZXcgcihvKm4pLE89UixYO2lmKG48Mnx8Qyl7Zm9yKFg9MDtYPG47WCsrKWlmKG4+MSYmKE89bmV3IHIoUi5idWZmZXIsbypYLG8pLEY9MCksZS5oZWFkZXJJbmZvLm51bVZhbGlkUGl4ZWw9PT1pKmgpZm9yKEI9MCxUPTA7VDxoO1QrKylmb3IoUz0wO1M8aTtTKyssQisrKXtpZih5PTAseD1iPDxmPj4+MzItZyx2PXgsMzItZjxnJiYoeHw9d1tsKzFdPj4+NjQtZi1nLHY9eCksdVt2XSl5PXVbdl1bMV0sZis9dVt2XVswXTtlbHNlIGZvcih4PWI8PGY+Pj4zMi1NLHY9eCwzMi1mPE0mJih4fD13W2wrMV0+Pj42NC1mLU0sdj14KSxkPW0sTD0wO0w8TTtMKyspaWYoRD14Pj4+TS1MLTEmMSxkPUQ/ZC5yaWdodDpkLmxlZnQsIShkLmxlZnR8fGQucmlnaHQpKXt5PWQudmFsLGY9ZitMKzE7YnJlYWt9Zj49MzImJihmLT0zMixsKyssYj13W2xdKSxJPXktVixDPyhTPjA/SSs9RjpUPjA/SSs9T1tCLWldOkkrPUYsSSY9MjU1LE9bQl09SSxGPUkpOk9bQl09SX1lbHNlIGZvcihCPTAsVD0wO1Q8aDtUKyspZm9yKFM9MDtTPGk7UysrLEIrKylpZih6W0JdKXtpZih5PTAseD1iPDxmPj4+MzItZyx2PXgsMzItZjxnJiYoeHw9d1tsKzFdPj4+NjQtZi1nLHY9eCksdVt2XSl5PXVbdl1bMV0sZis9dVt2XVswXTtlbHNlIGZvcih4PWI8PGY+Pj4zMi1NLHY9eCwzMi1mPE0mJih4fD13W2wrMV0+Pj42NC1mLU0sdj14KSxkPW0sTD0wO0w8TTtMKyspaWYoRD14Pj4+TS1MLTEmMSxkPUQ/ZC5yaWdodDpkLmxlZnQsIShkLmxlZnR8fGQucmlnaHQpKXt5PWQudmFsLGY9ZitMKzE7YnJlYWt9Zj49MzImJihmLT0zMixsKyssYj13W2xdKSxJPXktVixDPyhTPjAmJnpbQi0xXT9JKz1GOlQ+MCYmeltCLWldP0krPU9bQi1pXTpJKz1GLEkmPTI1NSxPW0JdPUksRj1JKTpPW0JdPUl9fWVsc2UgZm9yKEI9MCxUPTA7VDxoO1QrKylmb3IoUz0wO1M8aTtTKyspaWYoQj1UKmkrUywhenx8eltCXSlmb3IoWD0wO1g8bjtYKyssQis9byl7aWYoeT0wLHg9Yjw8Zj4+PjMyLWcsdj14LDMyLWY8ZyYmKHh8PXdbbCsxXT4+PjY0LWYtZyx2PXgpLHVbdl0peT11W3ZdWzFdLGYrPXVbdl1bMF07ZWxzZSBmb3IoeD1iPDxmPj4+MzItTSx2PXgsMzItZjxNJiYoeHw9d1tsKzFdPj4+NjQtZi1NLHY9eCksZD1tLEw9MDtMPE07TCsrKWlmKEQ9eD4+Pk0tTC0xJjEsZD1EP2QucmlnaHQ6ZC5sZWZ0LCEoZC5sZWZ0fHxkLnJpZ2h0KSl7eT1kLnZhbCxmPWYrTCsxO2JyZWFrfWY+PTMyJiYoZi09MzIsbCsrLGI9d1tsXSksST15LVYsT1tCXT1JfWUucHRyPWUucHRyKyhsKzEpKjQrKGY+MD80OjApLGUucGl4ZWxzLnJlc3VsdFBpeGVscz1SLG4+MSYmIXMmJihlLnBpeGVscy5yZXN1bHRQaXhlbHM9cC5zd2FwRGltZW5zaW9uT3JkZXIoUixvLG4scikpfSxkZWNvZGVCaXRzOmZ1bmN0aW9uKGEsZSxyLHMsdCl7e3ZhciBuPWUuaGVhZGVySW5mbyxoPW4uZmlsZVZlcnNpb24saT0wLG89YS5ieXRlTGVuZ3RoLWUucHRyPj01PzU6YS5ieXRlTGVuZ3RoLWUucHRyLGM9bmV3IERhdGFWaWV3KGEsZS5wdHIsbyksdT1jLmdldFVpbnQ4KDApO2krKzt2YXIgbT11Pj42LHc9bT09PTA/NDozLW0sbD0odSYzMik+MCxmPXUmMzEsZz0wO2lmKHc9PT0xKWc9Yy5nZXRVaW50OChpKSxpKys7ZWxzZSBpZih3PT09MilnPWMuZ2V0VWludDE2KGksITApLGkrPTI7ZWxzZSBpZih3PT09NClnPWMuZ2V0VWludDMyKGksITApLGkrPTQ7ZWxzZSB0aHJvdyJJbnZhbGlkIHZhbGlkIHBpeGVsIGNvdW50IHR5cGUiO3ZhciBNPTIqbi5tYXhaRXJyb3IsVixkLHksSSx6LHgsdixELFQsUz1uLm51bURpbXM+MT9uLm1heFZhbHVlc1t0XTpuLnpNYXg7aWYobCl7Zm9yKGUuY291bnRlci5sdXQrKyxEPWMuZ2V0VWludDgoaSksaSsrLEk9TWF0aC5jZWlsKChELTEpKmYvOCksej1NYXRoLmNlaWwoSS80KSxkPW5ldyBBcnJheUJ1ZmZlcih6KjQpLHk9bmV3IFVpbnQ4QXJyYXkoZCksZS5wdHIrPWkseS5zZXQobmV3IFVpbnQ4QXJyYXkoYSxlLnB0cixJKSksdj1uZXcgVWludDMyQXJyYXkoZCksZS5wdHIrPUksVD0wO0QtMT4+PlQ7KVQrKztJPU1hdGguY2VpbChnKlQvOCksej1NYXRoLmNlaWwoSS80KSxkPW5ldyBBcnJheUJ1ZmZlcih6KjQpLHk9bmV3IFVpbnQ4QXJyYXkoZCkseS5zZXQobmV3IFVpbnQ4QXJyYXkoYSxlLnB0cixJKSksVj1uZXcgVWludDMyQXJyYXkoZCksZS5wdHIrPUksaD49Mz94PUEudW5zdHVmZkxVVDIodixmLEQtMSxzLE0sUyk6eD1BLnVuc3R1ZmZMVVQodixmLEQtMSxzLE0sUyksaD49Mz9BLnVuc3R1ZmYyKFYscixULGcseCk6QS51bnN0dWZmKFYscixULGcseCl9ZWxzZSBlLmNvdW50ZXIuYml0c3R1ZmZlcisrLFQ9ZixlLnB0cis9aSxUPjAmJihJPU1hdGguY2VpbChnKlQvOCksej1NYXRoLmNlaWwoSS80KSxkPW5ldyBBcnJheUJ1ZmZlcih6KjQpLHk9bmV3IFVpbnQ4QXJyYXkoZCkseS5zZXQobmV3IFVpbnQ4QXJyYXkoYSxlLnB0cixJKSksVj1uZXcgVWludDMyQXJyYXkoZCksZS5wdHIrPUksaD49Mz9zPT1udWxsP0Eub3JpZ2luYWxVbnN0dWZmMihWLHIsVCxnKTpBLnVuc3R1ZmYyKFYscixULGcsITEscyxNLFMpOnM9PW51bGw/QS5vcmlnaW5hbFVuc3R1ZmYoVixyLFQsZyk6QS51bnN0dWZmKFYscixULGcsITEscyxNLFMpKX19LHJlYWRUaWxlczpmdW5jdGlvbihhLGUscixzKXt2YXIgdD1lLmhlYWRlckluZm8sbj10LndpZHRoLGg9dC5oZWlnaHQsaT1uKmgsbz10Lm1pY3JvQmxvY2tTaXplLGM9dC5pbWFnZVR5cGUsdT1wLmdldERhdGFUeXBlU2l6ZShjKSxtPU1hdGguY2VpbChuL28pLHc9TWF0aC5jZWlsKGgvbyk7ZS5waXhlbHMubnVtQmxvY2tzWT13LGUucGl4ZWxzLm51bUJsb2Nrc1g9bSxlLnBpeGVscy5wdHI9MDt2YXIgbD0wLGY9MCxnPTAsTT0wLFY9MCxkPTAseT0wLEk9MCx6PTAseD0wLHY9MCxEPTAsVD0wLFM9MCxCPTAsTD0wLEYsYixDLFIsTyxYLEc9bmV3IHIobypvKSxsZT1oJW98fG8sdWU9biVvfHxvLEssUSxKPXQubnVtRGltcywkLEU9ZS5waXhlbHMucmVzdWx0TWFzayxZPWUucGl4ZWxzLnJlc3VsdFBpeGVscyxoZT10LmZpbGVWZXJzaW9uLFA9aGU+PTU/MTQ6MTUsXyxXPXQuek1heCxIO2ZvcihnPTA7Zzx3O2crKylmb3IoVj1nIT09dy0xP286bGUsTT0wO008bTtNKyspZm9yKGQ9TSE9PW0tMT9vOnVlLHY9ZypuKm8rTSpvLEQ9bi1kLCQ9MDskPEo7JCsrKXtpZihKPjE/KEg9WSx2PWcqbipvK00qbyxZPW5ldyByKGUucGl4ZWxzLnJlc3VsdFBpeGVscy5idWZmZXIsaSokKnUsaSksVz10Lm1heFZhbHVlc1skXSk6SD1udWxsLHk9YS5ieXRlTGVuZ3RoLWUucHRyLEY9bmV3IERhdGFWaWV3KGEsZS5wdHIsTWF0aC5taW4oMTAseSkpLGI9e30sTD0wLEk9Ri5nZXRVaW50OCgwKSxMKyssXz10LmZpbGVWZXJzaW9uPj01P0kmNDowLHo9ST4+NiYyNTUseD1JPj4yJlAseCE9PShNKm8+PjMmUCl8fF8mJiQ9PT0wKXRocm93ImludGVncml0eSBpc3N1ZSI7aWYoWD1JJjMsWD4zKXRocm93IGUucHRyKz1MLCJJbnZhbGlkIGJsb2NrIGVuY29kaW5nICgiK1grIikiO2lmKFg9PT0yKXtpZihfKWlmKEUpZm9yKGw9MDtsPFY7bCsrKWZvcihmPTA7ZjxkO2YrKylFW3ZdJiYoWVt2XT1IW3ZdKSx2Kys7ZWxzZSBmb3IobD0wO2w8VjtsKyspZm9yKGY9MDtmPGQ7ZisrKVlbdl09SFt2XSx2Kys7ZS5jb3VudGVyLmNvbnN0YW50KyssZS5wdHIrPUw7Y29udGludWV9ZWxzZSBpZihYPT09MCl7aWYoXyl0aHJvdyJpbnRlZ3JpdHkgaXNzdWUiO2lmKGUuY291bnRlci51bmNvbXByZXNzZWQrKyxlLnB0cis9TCxUPVYqZCp1LFM9YS5ieXRlTGVuZ3RoLWUucHRyLFQ9VDxTP1Q6UyxDPW5ldyBBcnJheUJ1ZmZlcihUJXU9PT0wP1Q6VCt1LVQldSksUj1uZXcgVWludDhBcnJheShDKSxSLnNldChuZXcgVWludDhBcnJheShhLGUucHRyLFQpKSxPPW5ldyByKEMpLEI9MCxFKWZvcihsPTA7bDxWO2wrKyl7Zm9yKGY9MDtmPGQ7ZisrKUVbdl0mJihZW3ZdPU9bQisrXSksdisrO3YrPUR9ZWxzZSBmb3IobD0wO2w8VjtsKyspe2ZvcihmPTA7ZjxkO2YrKylZW3YrK109T1tCKytdO3YrPUR9ZS5wdHIrPUIqdX1lbHNlIGlmKEs9cC5nZXREYXRhVHlwZVVzZWQoXyYmYzw2PzQ6Yyx6KSxRPXAuZ2V0T25lUGl4ZWwoYixMLEssRiksTCs9cC5nZXREYXRhVHlwZVNpemUoSyksWD09PTMpaWYoZS5wdHIrPUwsZS5jb3VudGVyLmNvbnN0YW50b2Zmc2V0KyssRSlmb3IobD0wO2w8VjtsKyspe2ZvcihmPTA7ZjxkO2YrKylFW3ZdJiYoWVt2XT1fP01hdGgubWluKFcsSFt2XStRKTpRKSx2Kys7dis9RH1lbHNlIGZvcihsPTA7bDxWO2wrKyl7Zm9yKGY9MDtmPGQ7ZisrKVlbdl09Xz9NYXRoLm1pbihXLEhbdl0rUSk6USx2Kys7dis9RH1lbHNlIGlmKGUucHRyKz1MLHAuZGVjb2RlQml0cyhhLGUsRyxRLCQpLEw9MCxfKWlmKEUpZm9yKGw9MDtsPFY7bCsrKXtmb3IoZj0wO2Y8ZDtmKyspRVt2XSYmKFlbdl09R1tMKytdK0hbdl0pLHYrKzt2Kz1EfWVsc2UgZm9yKGw9MDtsPFY7bCsrKXtmb3IoZj0wO2Y8ZDtmKyspWVt2XT1HW0wrK10rSFt2XSx2Kys7dis9RH1lbHNlIGlmKEUpZm9yKGw9MDtsPFY7bCsrKXtmb3IoZj0wO2Y8ZDtmKyspRVt2XSYmKFlbdl09R1tMKytdKSx2Kys7dis9RH1lbHNlIGZvcihsPTA7bDxWO2wrKyl7Zm9yKGY9MDtmPGQ7ZisrKVlbdisrXT1HW0wrK107dis9RH19Sj4xJiYhcyYmKGUucGl4ZWxzLnJlc3VsdFBpeGVscz1wLnN3YXBEaW1lbnNpb25PcmRlcihlLnBpeGVscy5yZXN1bHRQaXhlbHMsaSxKLHIpKX0sZm9ybWF0RmlsZUluZm86ZnVuY3Rpb24oYSl7cmV0dXJue2ZpbGVJZGVudGlmaWVyU3RyaW5nOmEuaGVhZGVySW5mby5maWxlSWRlbnRpZmllclN0cmluZyxmaWxlVmVyc2lvbjphLmhlYWRlckluZm8uZmlsZVZlcnNpb24saW1hZ2VUeXBlOmEuaGVhZGVySW5mby5pbWFnZVR5cGUsaGVpZ2h0OmEuaGVhZGVySW5mby5oZWlnaHQsd2lkdGg6YS5oZWFkZXJJbmZvLndpZHRoLG51bVZhbGlkUGl4ZWw6YS5oZWFkZXJJbmZvLm51bVZhbGlkUGl4ZWwsbWljcm9CbG9ja1NpemU6YS5oZWFkZXJJbmZvLm1pY3JvQmxvY2tTaXplLGJsb2JTaXplOmEuaGVhZGVySW5mby5ibG9iU2l6ZSxtYXhaRXJyb3I6YS5oZWFkZXJJbmZvLm1heFpFcnJvcixwaXhlbFR5cGU6cC5nZXRQaXhlbFR5cGUoYS5oZWFkZXJJbmZvLmltYWdlVHlwZSksZW9mT2Zmc2V0OmEuZW9mT2Zmc2V0LG1hc2s6YS5tYXNrP3tudW1CeXRlczphLm1hc2subnVtQnl0ZXN9Om51bGwscGl4ZWxzOntudW1CbG9ja3NYOmEucGl4ZWxzLm51bUJsb2Nrc1gsbnVtQmxvY2tzWTphLnBpeGVscy5udW1CbG9ja3NZLG1heFZhbHVlOmEuaGVhZGVySW5mby56TWF4LG1pblZhbHVlOmEuaGVhZGVySW5mby56TWluLG5vRGF0YVZhbHVlOmEubm9EYXRhVmFsdWV9fX0sY29uc3RydWN0Q29uc3RhbnRTdXJmYWNlOmZ1bmN0aW9uKGEsZSl7dmFyIHI9YS5oZWFkZXJJbmZvLnpNYXgscz1hLmhlYWRlckluZm8uek1pbix0PWEuaGVhZGVySW5mby5tYXhWYWx1ZXMsbj1hLmhlYWRlckluZm8ubnVtRGltcyxoPWEuaGVhZGVySW5mby5oZWlnaHQqYS5oZWFkZXJJbmZvLndpZHRoLGk9MCxvPTAsYz0wLHU9YS5waXhlbHMucmVzdWx0TWFzayxtPWEucGl4ZWxzLnJlc3VsdFBpeGVscztpZih1KWlmKG4+MSl7aWYoZSlmb3IoaT0wO2k8bjtpKyspZm9yKGM9aSpoLHI9dFtpXSxvPTA7bzxoO28rKyl1W29dJiYobVtjK29dPXIpO2Vsc2UgZm9yKG89MDtvPGg7bysrKWlmKHVbb10pZm9yKGM9bypuLGk9MDtpPG47aSsrKW1bYytuXT10W2ldfWVsc2UgZm9yKG89MDtvPGg7bysrKXVbb10mJihtW29dPXIpO2Vsc2UgaWYobj4xJiZzIT09cilpZihlKWZvcihpPTA7aTxuO2krKylmb3IoYz1pKmgscj10W2ldLG89MDtvPGg7bysrKW1bYytvXT1yO2Vsc2UgZm9yKG89MDtvPGg7bysrKWZvcihjPW8qbixpPTA7aTxuO2krKyltW2MraV09dFtpXTtlbHNlIGZvcihvPTA7bzxoKm47bysrKW1bb109cn0sZ2V0RGF0YVR5cGVBcnJheTpmdW5jdGlvbihhKXt2YXIgZTtzd2l0Y2goYSl7Y2FzZSAwOmU9SW50OEFycmF5O2JyZWFrO2Nhc2UgMTplPVVpbnQ4QXJyYXk7YnJlYWs7Y2FzZSAyOmU9SW50MTZBcnJheTticmVhaztjYXNlIDM6ZT1VaW50MTZBcnJheTticmVhaztjYXNlIDQ6ZT1JbnQzMkFycmF5O2JyZWFrO2Nhc2UgNTplPVVpbnQzMkFycmF5O2JyZWFrO2Nhc2UgNjplPUZsb2F0MzJBcnJheTticmVhaztjYXNlIDc6ZT1GbG9hdDY0QXJyYXk7YnJlYWs7ZGVmYXVsdDplPUZsb2F0MzJBcnJheX1yZXR1cm4gZX0sZ2V0UGl4ZWxUeXBlOmZ1bmN0aW9uKGEpe3ZhciBlO3N3aXRjaChhKXtjYXNlIDA6ZT0iUzgiO2JyZWFrO2Nhc2UgMTplPSJVOCI7YnJlYWs7Y2FzZSAyOmU9IlMxNiI7YnJlYWs7Y2FzZSAzOmU9IlUxNiI7YnJlYWs7Y2FzZSA0OmU9IlMzMiI7YnJlYWs7Y2FzZSA1OmU9IlUzMiI7YnJlYWs7Y2FzZSA2OmU9IkYzMiI7YnJlYWs7Y2FzZSA3OmU9IkY2NCI7YnJlYWs7ZGVmYXVsdDplPSJGMzIifXJldHVybiBlfSxpc1ZhbGlkUGl4ZWxWYWx1ZTpmdW5jdGlvbihhLGUpe2lmKGU9PW51bGwpcmV0dXJuITE7dmFyIHI7c3dpdGNoKGEpe2Nhc2UgMDpyPWU+PS0xMjgmJmU8PTEyNzticmVhaztjYXNlIDE6cj1lPj0wJiZlPD0yNTU7YnJlYWs7Y2FzZSAyOnI9ZT49LTMyNzY4JiZlPD0zMjc2NzticmVhaztjYXNlIDM6cj1lPj0wJiZlPD02NTUzNjticmVhaztjYXNlIDQ6cj1lPj0tMjE0NzQ4MzY0OCYmZTw9MjE0NzQ4MzY0NzticmVhaztjYXNlIDU6cj1lPj0wJiZlPD00Mjk0OTY3Mjk2O2JyZWFrO2Nhc2UgNjpyPWU+PS0zNDAyNzk5OTM4NzkwMTQ4NGUyMiYmZTw9MzQwMjc5OTkzODc5MDE0ODRlMjI7YnJlYWs7Y2FzZSA3OnI9ZT49LTE3OTc2OTMxMzQ4NjIzMTU3ZTI5MiYmZTw9MTc5NzY5MzEzNDg2MjMxNTdlMjkyO2JyZWFrO2RlZmF1bHQ6cj0hMX1yZXR1cm4gcn0sZ2V0RGF0YVR5cGVTaXplOmZ1bmN0aW9uKGEpe3ZhciBlPTA7c3dpdGNoKGEpe2Nhc2UgMDpjYXNlIDE6ZT0xO2JyZWFrO2Nhc2UgMjpjYXNlIDM6ZT0yO2JyZWFrO2Nhc2UgNDpjYXNlIDU6Y2FzZSA2OmU9NDticmVhaztjYXNlIDc6ZT04O2JyZWFrO2RlZmF1bHQ6ZT1hfXJldHVybiBlfSxnZXREYXRhVHlwZVVzZWQ6ZnVuY3Rpb24oYSxlKXt2YXIgcj1hO3N3aXRjaChhKXtjYXNlIDI6Y2FzZSA0OnI9YS1lO2JyZWFrO2Nhc2UgMzpjYXNlIDU6cj1hLTIqZTticmVhaztjYXNlIDY6ZT09PTA/cj1hOmU9PT0xP3I9MjpyPTE7YnJlYWs7Y2FzZSA3OmU9PT0wP3I9YTpyPWEtMiplKzE7YnJlYWs7ZGVmYXVsdDpyPWE7YnJlYWt9cmV0dXJuIHJ9LGdldE9uZVBpeGVsOmZ1bmN0aW9uKGEsZSxyLHMpe3ZhciB0PTA7c3dpdGNoKHIpe2Nhc2UgMDp0PXMuZ2V0SW50OChlKTticmVhaztjYXNlIDE6dD1zLmdldFVpbnQ4KGUpO2JyZWFrO2Nhc2UgMjp0PXMuZ2V0SW50MTYoZSwhMCk7YnJlYWs7Y2FzZSAzOnQ9cy5nZXRVaW50MTYoZSwhMCk7YnJlYWs7Y2FzZSA0OnQ9cy5nZXRJbnQzMihlLCEwKTticmVhaztjYXNlIDU6dD1zLmdldFVJbnQzMihlLCEwKTticmVhaztjYXNlIDY6dD1zLmdldEZsb2F0MzIoZSwhMCk7YnJlYWs7Y2FzZSA3OnQ9cy5nZXRGbG9hdDY0KGUsITApO2JyZWFrO2RlZmF1bHQ6dGhyb3cidGhlIGRlY29kZXIgZG9lcyBub3QgdW5kZXJzdGFuZCB0aGlzIHBpeGVsIHR5cGUifXJldHVybiB0fSxzd2FwRGltZW5zaW9uT3JkZXI6ZnVuY3Rpb24oYSxlLHIscyx0KXt2YXIgbj0wLGg9MCxpPTAsbz0wLGM9YTtpZihyPjEpaWYoYz1uZXcgcyhlKnIpLHQpZm9yKG49MDtuPGU7bisrKWZvcihvPW4saT0wO2k8cjtpKyssbys9ZSljW29dPWFbaCsrXTtlbHNlIGZvcihuPTA7bjxlO24rKylmb3Iobz1uLGk9MDtpPHI7aSsrLG8rPWUpY1toKytdPWFbb107cmV0dXJuIGN9fSxrPWZ1bmN0aW9uKGEsZSxyKXt0aGlzLnZhbD1hLHRoaXMubGVmdD1lLHRoaXMucmlnaHQ9cn0sVT17ZGVjb2RlOmZ1bmN0aW9uKGEsZSl7ZT1lfHx7fTt2YXIgcj1lLm5vRGF0YVZhbHVlLHM9MCx0PXt9O2lmKHQucHRyPWUuaW5wdXRPZmZzZXR8fDAsdC5waXhlbHM9e30sISFwLnJlYWRIZWFkZXJJbmZvKGEsdCkpe3ZhciBuPXQuaGVhZGVySW5mbyxoPW4uZmlsZVZlcnNpb24saT1wLmdldERhdGFUeXBlQXJyYXkobi5pbWFnZVR5cGUpO2lmKGg+NSl0aHJvdyJ1bnN1cHBvcnRlZCBsZXJjIHZlcnNpb24gMi4iK2g7cC5yZWFkTWFzayhhLHQpLG4ubnVtVmFsaWRQaXhlbCE9PW4ud2lkdGgqbi5oZWlnaHQmJiF0LnBpeGVscy5yZXN1bHRNYXNrJiYodC5waXhlbHMucmVzdWx0TWFzaz1lLm1hc2tEYXRhKTt2YXIgbz1uLndpZHRoKm4uaGVpZ2h0O3QucGl4ZWxzLnJlc3VsdFBpeGVscz1uZXcgaShvKm4ubnVtRGltcyksdC5jb3VudGVyPXtvbmVzd2VlcDowLHVuY29tcHJlc3NlZDowLGx1dDowLGJpdHN0dWZmZXI6MCxjb25zdGFudDowLGNvbnN0YW50b2Zmc2V0OjB9O3ZhciBjPSFlLnJldHVyblBpeGVsSW50ZXJsZWF2ZWREaW1zO2lmKG4ubnVtVmFsaWRQaXhlbCE9PTApaWYobi56TWF4PT09bi56TWluKXAuY29uc3RydWN0Q29uc3RhbnRTdXJmYWNlKHQsYyk7ZWxzZSBpZihoPj00JiZwLmNoZWNrTWluTWF4UmFuZ2VzKGEsdCkpcC5jb25zdHJ1Y3RDb25zdGFudFN1cmZhY2UodCxjKTtlbHNle3ZhciB1PW5ldyBEYXRhVmlldyhhLHQucHRyLDIpLG09dS5nZXRVaW50OCgwKTtpZih0LnB0cisrLG0pcC5yZWFkRGF0YU9uZVN3ZWVwKGEsdCxpLGMpO2Vsc2UgaWYoaD4xJiZuLmltYWdlVHlwZTw9MSYmTWF0aC5hYnMobi5tYXhaRXJyb3ItLjUpPDFlLTUpe3ZhciB3PXUuZ2V0VWludDgoMSk7aWYodC5wdHIrKyx0LmVuY29kZU1vZGU9dyx3PjJ8fGg8NCYmdz4xKXRocm93IkludmFsaWQgSHVmZm1hbiBmbGFnICIrdzt3P3AucmVhZEh1ZmZtYW4oYSx0LGksYyk6cC5yZWFkVGlsZXMoYSx0LGksYyl9ZWxzZSBwLnJlYWRUaWxlcyhhLHQsaSxjKX10LmVvZk9mZnNldD10LnB0cjt2YXIgbDtlLmlucHV0T2Zmc2V0PyhsPXQuaGVhZGVySW5mby5ibG9iU2l6ZStlLmlucHV0T2Zmc2V0LXQucHRyLE1hdGguYWJzKGwpPj0xJiYodC5lb2ZPZmZzZXQ9ZS5pbnB1dE9mZnNldCt0LmhlYWRlckluZm8uYmxvYlNpemUpKToobD10LmhlYWRlckluZm8uYmxvYlNpemUtdC5wdHIsTWF0aC5hYnMobCk+PTEmJih0LmVvZk9mZnNldD10LmhlYWRlckluZm8uYmxvYlNpemUpKTt2YXIgZj17d2lkdGg6bi53aWR0aCxoZWlnaHQ6bi5oZWlnaHQscGl4ZWxEYXRhOnQucGl4ZWxzLnJlc3VsdFBpeGVscyxtaW5WYWx1ZTpuLnpNaW4sbWF4VmFsdWU6bi56TWF4LHZhbGlkUGl4ZWxDb3VudDpuLm51bVZhbGlkUGl4ZWwsZGltQ291bnQ6bi5udW1EaW1zLGRpbVN0YXRzOnttaW5WYWx1ZXM6bi5taW5WYWx1ZXMsbWF4VmFsdWVzOm4ubWF4VmFsdWVzfSxtYXNrRGF0YTp0LnBpeGVscy5yZXN1bHRNYXNrfTtpZih0LnBpeGVscy5yZXN1bHRNYXNrJiZwLmlzVmFsaWRQaXhlbFZhbHVlKG4uaW1hZ2VUeXBlLHIpKXt2YXIgZz10LnBpeGVscy5yZXN1bHRNYXNrO2ZvcihzPTA7czxvO3MrKylnW3NdfHwoZi5waXhlbERhdGFbc109cik7Zi5ub0RhdGFWYWx1ZT1yfXJldHVybiB0Lm5vRGF0YVZhbHVlPXIsZS5yZXR1cm5GaWxlSW5mbyYmKGYuZmlsZUluZm89cC5mb3JtYXRGaWxlSW5mbyh0KSksZn19LGdldEJhbmRDb3VudDpmdW5jdGlvbihhKXt2YXIgZT0wLHI9MCxzPXt9O2ZvcihzLnB0cj0wLHMucGl4ZWxzPXt9O3I8YS5ieXRlTGVuZ3RoLTU4OylwLnJlYWRIZWFkZXJJbmZvKGEscykscis9cy5oZWFkZXJJbmZvLmJsb2JTaXplLGUrKyxzLnB0cj1yO3JldHVybiBlfX07cmV0dXJuIFV9KCk7dmFyIG5lPWZ1bmN0aW9uKCl7dmFyIEE9bmV3IEFycmF5QnVmZmVyKDQpLHA9bmV3IFVpbnQ4QXJyYXkoQSksaz1uZXcgVWludDMyQXJyYXkoQSk7cmV0dXJuIGtbMF09MSxwWzBdPT09MX0oKSxpZT17ZGVjb2RlOmZ1bmN0aW9uKEEscCl7aWYoIW5lKXRocm93IkJpZyBlbmRpYW4gc3lzdGVtIGlzIG5vdCBzdXBwb3J0ZWQuIjtwPXB8fHt9O3ZhciBrPXAuaW5wdXRPZmZzZXR8fDAsVT1uZXcgVWludDhBcnJheShBLGssMTApLGE9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLFUpLGUscjtpZihhLnRyaW0oKT09PSJDbnRaSW1hZ2UiKWU9ZWUscj0xO2Vsc2UgaWYoYS5zdWJzdHJpbmcoMCw1KT09PSJMZXJjMiIpZT1yZSxyPTI7ZWxzZSB0aHJvdyJVbmV4cGVjdGVkIGZpbGUgaWRlbnRpZmllciBzdHJpbmc6ICIrYTtmb3IodmFyIHM9MCx0PUEuYnl0ZUxlbmd0aC0xMCxuLGg9W10saSxvLGM9e3dpZHRoOjAsaGVpZ2h0OjAscGl4ZWxzOltdLHBpeGVsVHlwZTpwLnBpeGVsVHlwZSxtYXNrOm51bGwsc3RhdGlzdGljczpbXX0sdT0wO2s8dDspe3ZhciBtPWUuZGVjb2RlKEEse2lucHV0T2Zmc2V0OmssZW5jb2RlZE1hc2tEYXRhOm4sbWFza0RhdGE6byxyZXR1cm5NYXNrOnM9PT0wLHJldHVybkVuY29kZWRNYXNrOnM9PT0wLHJldHVybkZpbGVJbmZvOiEwLHJldHVyblBpeGVsSW50ZXJsZWF2ZWREaW1zOnAucmV0dXJuUGl4ZWxJbnRlcmxlYXZlZERpbXMscGl4ZWxUeXBlOnAucGl4ZWxUeXBlfHxudWxsLG5vRGF0YVZhbHVlOnAubm9EYXRhVmFsdWV8fG51bGx9KTtrPW0uZmlsZUluZm8uZW9mT2Zmc2V0LG89bS5tYXNrRGF0YSxzPT09MCYmKG49bS5lbmNvZGVkTWFza0RhdGEsYy53aWR0aD1tLndpZHRoLGMuaGVpZ2h0PW0uaGVpZ2h0LGMuZGltQ291bnQ9bS5kaW1Db3VudHx8MSxjLnBpeGVsVHlwZT1tLnBpeGVsVHlwZXx8bS5maWxlSW5mby5waXhlbFR5cGUsYy5tYXNrPW8pLHI+MSYmKG8mJmgucHVzaChvKSxtLmZpbGVJbmZvLm1hc2smJm0uZmlsZUluZm8ubWFzay5udW1CeXRlcz4wJiZ1KyspLHMrKyxjLnBpeGVscy5wdXNoKG0ucGl4ZWxEYXRhKSxjLnN0YXRpc3RpY3MucHVzaCh7bWluVmFsdWU6bS5taW5WYWx1ZSxtYXhWYWx1ZTptLm1heFZhbHVlLG5vRGF0YVZhbHVlOm0ubm9EYXRhVmFsdWUsZGltU3RhdHM6bS5kaW1TdGF0c30pfXZhciB3LGwsZjtpZihyPjEmJnU+MSl7Zm9yKGY9Yy53aWR0aCpjLmhlaWdodCxjLmJhbmRNYXNrcz1oLG89bmV3IFVpbnQ4QXJyYXkoZiksby5zZXQoaFswXSksdz0xO3c8aC5sZW5ndGg7dysrKWZvcihpPWhbd10sbD0wO2w8ZjtsKyspb1tsXT1vW2xdJmlbbF07Yy5tYXNrRGF0YT1vfXJldHVybiBjfX07Y29uc3QgdGU9ezA6N2UzLDE6NmUzLDI6NWUzLDM6NGUzLDQ6M2UzLDU6MjUwMCw2OjJlMyw3OjE1MDAsODo4MDAsOTo1MDAsMTA6MjAwLDExOjEwMCwxMjo0MCwxMzoxMiwxNDo1LDE1OjIsMTY6MSwxNzouNSwxODouMiwxOTouMSwyMDouMDF9O2Z1bmN0aW9uIGFlKEEpe2NvbnN0e2hlaWdodDpwLHdpZHRoOmsscGl4ZWxzOlV9PWllLmRlY29kZShBKSxhPW5ldyBGbG9hdDMyQXJyYXkocCprKTtmb3IobGV0IGU9MDtlPGEubGVuZ3RoO2UrKylhW2VdPVVbMF1bZV07cmV0dXJue2FycmF5OmEsd2lkdGg6ayxoZWlnaHQ6cH19ZnVuY3Rpb24gc2UoQSxwLGspe2xldCBVPWFlKEEpO2tbMl0ta1swXTwxJiYoVT1mZShVLGspKTtjb25zdHthcnJheTphLHdpZHRoOmV9PVUscz1uZXcgWihlKS5jcmVhdGVUaWxlKGEpLHQ9dGVbcF18fDA7cmV0dXJuIHMuZ2V0R2VvbWV0cnlEYXRhKHQpfWZ1bmN0aW9uIGZlKEEscCl7ZnVuY3Rpb24gayhzLHQsbixoLGksbyxjLHUpe2NvbnN0IG09bmV3IEZsb2F0MzJBcnJheShpKm8pO2ZvcihsZXQgbD0wO2w8bztsKyspZm9yKGxldCBmPTA7ZjxpO2YrKyl7Y29uc3QgZz0obCtoKSp0KyhmK24pLE09bCppK2Y7bVtNXT1zW2ddfWNvbnN0IHc9bmV3IEZsb2F0MzJBcnJheSh1KmMpO2ZvcihsZXQgbD0wO2w8dTtsKyspZm9yKGxldCBmPTA7ZjxjO2YrKyl7Y29uc3QgZz1sKnUrZixNPU1hdGgucm91bmQoZipvL3UpLGQ9TWF0aC5yb3VuZChsKmkvYykqaStNO3dbZ109bVtkXX1yZXR1cm4gd31jb25zdCBVPW9lKHAsQS53aWR0aCksYT1VLnN3KzEsZT1VLnNoKzE7cmV0dXJue2FycmF5OmsoQS5hcnJheSxBLndpZHRoLFUuc3gsVS5zeSxVLnN3LFUuc2gsYSxlKSx3aWR0aDphLGhlaWdodDplfX1mdW5jdGlvbiBvZShBLHApe2NvbnN0IGs9TWF0aC5mbG9vcihBWzBdKnApLFU9TWF0aC5mbG9vcihBWzFdKnApLGE9TWF0aC5mbG9vcigoQVsyXS1BWzBdKSpwKSxlPU1hdGguZmxvb3IoKEFbM10tQVsxXSkqcCk7cmV0dXJue3N4Omssc3k6VSxzdzphLHNoOmV9fXNlbGYub25tZXNzYWdlPUE9Pntjb25zdCBwPUEuZGF0YSxrPXNlKHAuZGVtRGF0YSxwLnoscC5jbGlwQm91bmRzKTtzZWxmLnBvc3RNZXNzYWdlKGspfX0pKCk7Cg==", xs = (n) => Uint8Array.from(atob(n), (s) => s.charCodeAt(0)), ct = typeof self < "u" && self.Blob && new Blob([xs(xt)], { type: "text/javascript;charset=utf-8" });
function Ts(n) {
  let s;
  try {
    if (s = ct && (self.URL || self.webkitURL).createObjectURL(ct), !s) throw "";
    const t = new Worker(s, {
      name: n?.name
    });
    return t.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(s);
    }), t;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + xt,
      {
        name: n?.name
      }
    );
  } finally {
    s && (self.URL || self.webkitURL).revokeObjectURL(s);
  }
}
const Xs = 5;
class Ys extends $ {
  constructor() {
    super();
    d(this, "info", {
      version: I,
      description: "Tile LERC terrain loader. It can load ArcGis-lerc format terrain data."
    });
    d(this, "dataType", "lerc");
    // 图像加载器
    d(this, "fileLoader", new vt(y.manager));
    d(this, "_workerPool", new pt(0));
    this.fileLoader.setResponseType("arraybuffer"), this._workerPool.setWorkerCreator(() => new Ts());
  }
  /**
   * 异步加载并解析数据，返回BufferGeometry对象
   *
   * @param url 数据文件的URL
   * @param params 解析参数，包含瓦片xyz和裁剪边界clipBounds
   * @returns 返回解析后的BufferGeometry对象
   */
  async doLoad(t, e) {
    this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(Xs);
    const { z: o, clipBounds: i } = e, l = {
      demData: await this.fileLoader.loadAsync(t),
      z: o,
      clipBounds: i
    }, r = (await this._workerPool.postMessage(l)).data;
    return new F().setData(r);
  }
}
tt(new Ys());
const Tt = "KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIGModCl7cmV0dXJuIGEodC5kYXRhKX1mdW5jdGlvbiBhKHQpe2Z1bmN0aW9uIG4oZSx1KXtjb25zdCByPXUqNCxbaSxmLGcsbF09ZS5zbGljZShyLHIrNCk7cmV0dXJuIGw9PT0wPzA6LTFlNCsoaTw8MTZ8Zjw8OHxnKSouMX1jb25zdCBvPXQubGVuZ3RoPj4+MixzPW5ldyBGbG9hdDMyQXJyYXkobyk7Zm9yKGxldCBlPTA7ZTxvO2UrKylzW2VdPW4odCxlKTtyZXR1cm4gc31zZWxmLm9ubWVzc2FnZT10PT57Y29uc3Qgbj1jKHQuZGF0YS5pbWdEYXRhKTtzZWxmLnBvc3RNZXNzYWdlKG4pfX0pKCk7Cg==", Ms = (n) => Uint8Array.from(atob(n), (s) => s.charCodeAt(0)), dt = typeof self < "u" && self.Blob && new Blob([Ms(Tt)], { type: "text/javascript;charset=utf-8" });
function Ps(n) {
  let s;
  try {
    if (s = dt && (self.URL || self.webkitURL).createObjectURL(dt), !s) throw "";
    const t = new Worker(s, {
      name: n?.name
    });
    return t.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(s);
    }), t;
  } catch {
    return new Worker(
      "data:text/javascript;base64," + Tt,
      {
        name: n?.name
      }
    );
  } finally {
    s && (self.URL || self.webkitURL).revokeObjectURL(s);
  }
}
const Ks = 10;
class Ss extends $ {
  constructor() {
    super();
    d(this, "info", {
      version: I,
      description: "Mapbox-RGB terrain loader, It can load Mapbox-RGB terrain data."
    });
    // 数据类型标识
    d(this, "dataType", "terrain-rgb");
    // 使用imageLoader下载
    d(this, "imageLoader", new _(y.manager));
    d(this, "_workerPool", new pt(0));
    this._workerPool.setWorkerCreator(() => new Ps());
  }
  // 下载数据
  /**
   * 异步加载BufferGeometry对象
   *
   * @param url 图片的URL地址
   * @param params 加载参数，包含瓦片xyz和裁剪边界clipBounds
   * @returns 返回解析后的BufferGeometry对象
   */
  async doLoad(t, e) {
    const o = await this.imageLoader.loadAsync(t), { clipBounds: i, z: a } = e, l = Ot.clamp((a + 2) * 3, 2, 64), r = gs(o, i, l);
    let c;
    this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(Ks), c = (await this._workerPool.postMessage({ imgData: r }, [r.data.buffer])).data;
    const h = new F();
    return h.setData(c), h;
  }
}
function gs(n, s, t) {
  const e = q(s, n.width);
  t = Math.min(t, e.sw);
  const i = new OffscreenCanvas(t, t).getContext("2d");
  return i.imageSmoothingEnabled = !1, i.drawImage(n, e.sx, e.sy, e.sw, e.sh, 0, 0, t, t), i.getImageData(0, 0, t, t);
}
tt(new Ss());
class zs extends $ {
  constructor() {
    super(...arguments);
    d(this, "info", {
      version: I,
      description: "Terrarium shader loader — uploads raw PNG for GPU decode via TSL positionNode."
    });
    d(this, "dataType", "terrarium-shader");
    d(this, "imageLoader", new _(y.manager));
  }
  async doLoad(t, e) {
    const o = await this.imageLoader.loadAsync(t), { clipBounds: i, z: a } = e, l = Math.min(Math.max((a + 2) * 4, 16), 128), r = q(i, o.width), c = new OffscreenCanvas(l, l), h = c.getContext("2d");
    h.imageSmoothingEnabled = !1, h.drawImage(o, r.sx, r.sy, r.sw, r.sh, 0, 0, l, l);
    const m = new A(c);
    m.colorSpace = "", m.generateMipmaps = !1, m.magFilter = ot, m.minFilter = ot, m.needsUpdate = !0;
    const Z = ws(l);
    return Z.userData.heightTexture = m, Z;
  }
}
function ws(n) {
  const s = new Float32Array(n * n), t = new F();
  return t.setData(s, 1e3), t;
}
tt(new zs());
const mt = [
  "#ff6666",
  "#66ff66",
  "#6666ff",
  "#ffff66",
  "#ff66ff",
  "#66ffff",
  "#ff9933",
  "#9933ff",
  "#33ff99",
  "#ff3399",
  "#3399ff",
  "#99ff33",
  "#cc6600",
  "#0066cc",
  "#66cc00",
  "#cc0066",
  "#00cc66",
  "#6600cc",
  "#ff4444",
  "#44ff44"
];
class Is extends Gs {
  constructor() {
    super(...arguments);
    d(this, "dataType", "debug");
  }
  drawTile(t, e) {
    const { x: o, y: i, z: a } = e, l = t.canvas.width, r = t.canvas.height, c = mt[a % mt.length];
    t.fillStyle = c, t.globalAlpha = 0.4, t.fillRect(0, 0, l, r), t.globalAlpha = 1, t.strokeStyle = "#000", t.lineWidth = 2, t.strokeRect(1, 1, l - 2, r - 2), t.fillStyle = "#000", t.font = "bold 28px monospace", t.textAlign = "center", t.textBaseline = "middle", t.fillText(`Z${a}`, l / 2, r / 2 - 30), t.fillText(`X${o}  Y${i}`, l / 2, r / 2 + 10), t.strokeStyle = "rgba(0,0,0,0.3)", t.lineWidth = 1, t.beginPath(), t.moveTo(l / 2, 0), t.lineTo(l / 2, r), t.moveTo(0, r / 2), t.lineTo(l, r / 2), t.stroke();
  }
}
St(new Is());
class Xt {
  /**
   * constructor
   * @param options SourceOptions
   */
  constructor(s) {
    /** Data type that determines which loader to use for loading and processing data. Default is "image" type */
    d(this, "dataType", "image");
    /** Copyright attribution information for the data source, used for displaying map copyright notices */
    d(this, "attribution", "ThreeTile");
    /** Minimum zoom level supported by the data source. Default is 0 */
    d(this, "minLevel", 0);
    /** Maximum zoom level supported by the data source. Default is 18 */
    d(this, "maxLevel", 18);
    /** Data projection type. Default is "3857" Mercator projection */
    d(this, "projectionID", "3857");
    /** URL template for tile data. Uses variables like {x},{y},{z} to construct tile request URLs */
    d(this, "url", "");
    /** List of URL subdomains for load balancing. Can be an array of strings or a single string */
    d(this, "subdomains", []);
    /** material opacity. Range 0-1, default is 1.0 (completely opaque) */
    d(this, "opacity", 1);
    /** Whether the material is transparent. Default is true (transparent) */
    d(this, "transparent", !0);
    /** Whether to use TMS tile coordinate system. Default false uses XYZ system, true uses TMS system */
    d(this, "isTMS", !1);
    /** Data bounds in format [minLon, minLat, maxLon, maxLat]. Default is undefined */
    d(this, "bounds");
    // = [-180, -85, 180, 85];
    /** Projected data bounds */
    d(this, "_projectionBounds", [-1 / 0, -1 / 0, 1 / 0, 1 / 0]);
    Object.assign(this, s);
  }
  _getBBox(s, t, e) {
    const o = Math.PI * 6378137, i = 2 * o / Math.pow(2, e), a = -o + s * i, l = o - (t + 1) * i, r = -o + (s + 1) * i, c = o - t * i;
    return `${a},${l},${r},${c}`;
  }
  /**
   * Get url from tile coordinate, public, overwrite to custom generation tile url from xyz
   * @param x tile x coordinate
   * @param y tile y coordinate
   * @param z tile z coordinate
   * @returns url tile url
   */
  getUrl(s, t, e, o) {
    const i = this.subdomains.length;
    let a;
    if (i > 0) {
      const c = Math.floor(Math.random() * i);
      a = this.subdomains[c];
    }
    const l = this._getBBox(s, t, e);
    t = this.isTMS ? Math.pow(2, e) - 1 - t : t;
    const r = { ...this, x: s, y: t, z: e, s: a, bbox: l, ...o };
    return Rs(this.url, r);
  }
  /**
   * Get url from tile coordinate, public，called by TileLoader
   * @param x tile x coordinate
   * @param y tile y coordinate
   * @param z tile z coordinate
   * @returns url tile url
   */
  // public _getUrl(x: number, y: number, z: number): string | undefined {
  // 	// reverse y coordinate if TMS scheme
  // 	const reverseY = this.isTMS ? Math.pow(2, z) - 1 - y : y;
  // 	return this.getUrl(x, reverseY, z);
  // }
  /**
   * Create source directly through factoy functions.
   * @param options source options
   * @returns ISource data source instance
   */
  static create(s) {
    return new Xt(s);
  }
}
function Rs(n, s) {
  const t = /\{ *([\w_-]+) *\}/g;
  return n.replace(t, (e, o) => {
    const i = s[o] ?? (() => {
      throw new Error(`source url template error, No value provided for variable: ${e}`);
    })();
    return typeof i == "function" ? i(s) : i;
  });
}
class Yt {
  /**
   * 构造函数
   * @param centerLon 中央经线
   */
  constructor(s = 0) {
    d(this, "_lon0", 0);
    this._lon0 = s;
  }
  /** 中央经线 */
  get lon0() {
    return this._lon0;
  }
  /**
   * 根据中央经线取得变换后的瓦片X坐标
   * @param x
   * @param z
   * @returns
   */
  getTileXWithCenterLon(s, t) {
    const e = Math.pow(2, t);
    let o = s + Math.round(e / 360 * this._lon0);
    return o >= e ? o -= e : o < 0 && (o += e), o;
  }
  /**
   * 取得瓦片左下角投影坐标
   * @param x
   * @param y
   * @param z
   * @returns
   */
  // private getTileXYZproj(x: number, y: number, z: number) {
  // 	const w = this.mapWidth;
  // 	const h = this.mapHeight / 2;
  // 	const px = (x / Math.pow(2, z)) * w - w / 2;
  // 	const py = h - (y / Math.pow(2, z)) * h * 2;
  // 	return { x: px, y: py };
  // }
  /**
   * 取得经纬度范围的投影坐标
   * @param bounds 经纬度边界
   * @returns 投影坐标
   */
  getProjBoundsFromLonLat(s) {
    const t = s[2] - s[0] > 180, e = this.project(s[0] + (t ? this._lon0 : 0), s[1]), o = this.project(s[2] + (t ? this._lon0 : 0), s[3]);
    return [Math.min(e.x, o.x), Math.min(e.y, o.y), Math.max(e.x, o.x), Math.max(e.y, o.y)];
  }
  /**
  	 * 取得瓦片边界投影坐标范围
  
  	 * @param x 瓦片X坐标
  	 * @param y 瓦片Y坐标
  	 * @param z  瓦片层级
  	 * @returns 
  	 */
  getProjBoundsFromXYZ(s, t, e) {
    const o = Math.PI * 6378137, i = 2 * o / Math.pow(2, e), a = -o + s * i, l = o - (t + 1) * i, r = -o + (s + 1) * i, c = o - t * i;
    return [a, l, r, c];
  }
  getLonLatBoundsFromXYZ(s, t, e) {
    const o = this.getProjBoundsFromXYZ(s, t, e), i = this.unProject(o[0], o[1]), a = this.unProject(o[2], o[3]);
    return [i.lon, i.lat, a.lon, a.lat];
  }
}
const C = 6378137;
class Mt extends Yt {
  constructor() {
    super(...arguments);
    d(this, "ID", "3857");
    // projeciton ID
    d(this, "mapWidth", 2 * Math.PI * C);
    //E-W scacle Earth's circumference(m)
    d(this, "mapHeight", this.mapWidth);
    //S-N scacle Earth's circumference(m)
    d(this, "mapDepth", 1);
  }
  //Height scale
  /**
   * Latitude and longitude to projected coordinates
   * @param lon longitude
   * @param lat Latitude
   * @returns projected coordinates
   */
  project(t, e) {
    const o = (t - this.lon0) * (Math.PI / 180), i = e * (Math.PI / 180), a = C * o, l = C * Math.log(Math.tan(Math.PI / 4 + i / 2));
    return { x: a, y: l };
  }
  /**
   * Projected coordinates to latitude and longitude
   * @param x projection x
   * @param y projection y
   * @returns latitude and longitude
   */
  unProject(t, e) {
    let o = t / C * (180 / Math.PI) + this.lon0;
    return o > 180 && (o -= 360), { lat: (2 * Math.atan(Math.exp(e / C)) - Math.PI / 2) * (180 / Math.PI), lon: o };
  }
}
class ks extends Yt {
  constructor() {
    super(...arguments);
    d(this, "ID", "4326");
    d(this, "mapWidth", 36e3 * 1e3);
    //E-W scacle (*0.01°)
    d(this, "mapHeight", 18e3 * 1e3);
    //S-N scale (*0.01°)
    d(this, "mapDepth", 1);
  }
  //height scale
  project(t, e) {
    return { x: (t - this.lon0) * 100 * 1e3, y: e * 100 * 1e3 };
  }
  unProject(t, e) {
    return { lon: t / (100 * 1e3) + this.lon0, lat: e / (100 * 1e3) };
  }
}
const ht = {
  /**
   * create projection object from projection ID
   *
   * @param id projeciton ID, default: "3857"
   * @returns IProjection instance
   */
  createFromID: (n = "3857", s) => {
    let t;
    switch (n) {
      case "3857":
        t = new Mt(s);
        break;
      case "4326":
        t = new ks(s);
        break;
      default:
        throw new Error(`Projection ID: ${n} is not supported.`);
    }
    return t;
  }
};
class Fs extends B {
  constructor() {
    super(...arguments);
    d(this, "_projection", new Mt(0));
  }
  get imgSource() {
    return super.imgSource;
  }
  set imgSource(t) {
    super.imgSource = t, this._updateImgProjBounds();
  }
  get demSource() {
    return super.demSource;
  }
  set demSource(t) {
    super.demSource = t, this._updateDemPrjBounds();
  }
  _updateImgProjBounds() {
    const t = this._projection;
    this.imgSource.forEach((e) => {
      e._projectionBounds = t.getProjBoundsFromLonLat(e.bounds || this.bounds);
    });
  }
  _updateDemPrjBounds() {
    const t = this._projection;
    this.demSource && (this.demSource._projectionBounds = t.getProjBoundsFromLonLat(this.demSource.bounds || this.bounds));
  }
  get projection() {
    return this._projection;
  }
  set projection(t) {
    this._projection = t, this._updateImgProjBounds(), this._updateDemPrjBounds();
  }
  async load(t) {
    const { x: e, y: o, z: i, bounds: a, lonLatBounds: l } = this.getTileCoords(t);
    return super.load({ x: e, y: o, z: i, bounds: a, lonLatBounds: l });
  }
  async update(t, e, o, i) {
    const { x: a, y: l, z: r, bounds: c, lonLatBounds: h } = this.getTileCoords(e);
    return await super.update(t, { x: a, y: l, z: r, bounds: c, lonLatBounds: h }, o, i);
  }
  getTileCoords(t) {
    if (!this._projection)
      throw new Error("projection is undefined");
    const { x: e, y: o, z: i } = t, a = this._projection.getTileXWithCenterLon(e, i), l = this._projection.getProjBoundsFromXYZ(e, o, i), r = this._projection.getLonLatBoundsFromXYZ(e, o, i);
    return { x: a, y: o, z: i, bounds: l, lonLatBounds: r };
  }
}
const E = new Qt(), Hs = new K(0, -1, 0), Zt = new K();
function Pt(n, s) {
  const t = s.intersectObject(n.rootTile, !0);
  if (t.length > 0) {
    const e = t[0];
    console.assert(e.object.visible);
    const o = n.worldToLocal(e.point.clone()), i = n.map2geo(o);
    return Object.assign(e, {
      location: i
    });
  }
}
function bt(n, s) {
  return Zt.set(s.x, 1e4, s.z), E.set(Zt, Hs), Pt(n, E);
}
function Cs(n, s, t) {
  return E.setFromCamera(t, n), Pt(s, E);
}
function js(n) {
  const s = n.loader.manager, t = (e, o) => {
    n.dispatchEvent({ type: e, ...o });
  };
  s.onStart = (e, o, i) => {
    t("loading-start", { url: e, itemsLoaded: o, itemsTotal: i });
  }, s.onError = (e) => {
    t("loading-error", { url: e });
  }, s.onLoad = () => {
    t("loading-complete");
  }, s.onProgress = (e, o, i) => {
    t("loading-progress", { url: e, itemsLoaded: o, itemsTotal: i });
  }, s.onParseEnd = (e) => {
    t("parsing-end", { geometry: e });
  }, n.rootTile.addEventListener("tile-created", (e) => {
    t("tile-created", { tile: e.tile });
  }), n.rootTile.addEventListener("tile-loaded", (e) => {
    t("tile-loaded", { tile: e.tile });
  }), n.rootTile.addEventListener("tile-unload", (e) => {
    t("tile-unload", { tile: e.tile });
  }), n.rootTile.addEventListener("tile-visible-changed", (e) => {
    t("tile-visible-changed", { tile: e.tile });
  });
}
class Kt extends ut {
  /**
   * 地图模型构造函数
   * @param params 地图参数 {@link MapParams}
   */
  constructor(t) {
    super();
    /** 名称 */
    d(this, "name", "map");
    /** 瓦片树更新时钟 */
    d(this, "_mapClock", new Bt());
    /** 是否为LOD模型（LOD模型，当autoUpdate为真时渲染时会自动调用update方法）*/
    d(this, "isLOD", !0);
    /** 地图是否在每帧渲染时自动更新，默认为真 */
    d(this, "autoUpdate", !0);
    /** 调试标志，0：不调试 */
    d(this, "debug", 0);
    /** 瓦片树更新间隔，单位毫秒（默认100ms） */
    d(this, "updateInterval", 100);
    /** 根瓦片 */
    d(this, "rootTile");
    /** 瓦片数据加载器 */
    d(this, "loader");
    d(this, "_minLevel", 2);
    d(this, "_maxLevel", 19);
    d(this, "_LODThreshold", 1);
    this.up.set(0, 0, 1);
    const {
      loader: e = new Fs(),
      rootTile: o = new w(),
      minLevel: i = 2,
      maxLevel: a = 20,
      imgSource: l,
      demSource: r,
      backgroundColor: c,
      bounds: h,
      lon0: m = 0,
      debug: Z = 0
    } = t;
    this._minLevel = i, this._maxLevel = a, this.loader = e, this.rootTile = o, c && this.loader.backgroundMaterial.color.set(c), h && (this.loader.bounds = h), this.debug = this.loader.debug = Z, this.lon0 = m, this.imgSource = Array.isArray(l) ? l : [l], this.demSource = r, this.add(o), this._resize(), js(this);
    const b = () => {
      this.dispatchEvent({ type: "ready" }), this.removeEventListener("loading-complete", b);
    };
    this.addEventListener("loading-complete", b);
  }
  /** 取得地图最小缩放级别，小于这个级别瓦片树不再加载数据 */
  get minLevel() {
    return this._minLevel;
  }
  /** 设置地图最小缩放级别，小于这个级别瓦片树不再加载数据 */
  set minLevel(t) {
    this._minLevel = t;
  }
  /** 地图最大缩放级别，大于这个级别瓦片树不再更新 */
  get maxLevel() {
    return this._maxLevel;
  }
  /** 设置地图最大缩放级别，大于这个级别瓦片树不再更新 */
  set maxLevel(t) {
    this._maxLevel = t;
  }
  /** 取得中央子午线经度 */
  get lon0() {
    return this.projection.lon0;
  }
  /** 设置中央子午线经度，中央子午线决定了地图的投影中心经度，可设置为-90，0，90，默认为0 */
  set lon0(t) {
    this.projection.lon0 !== t && (t != 0 && this.minLevel < 1 && console.warn(`Map centralMeridian is ${this.lon0}, minLevel must > 0`), this.projection = ht.createFromID(this.projection.ID, t), this.updateSource());
  }
  /** 取得地图投影对象 */
  get projection() {
    return this.loader.projection;
  }
  /** 设置地图投影对象 */
  set projection(t) {
    (t.ID != this.projection.ID || t.lon0 != this.lon0) && (this.loader.projection = t, this._resize(), this.reload(), this.debug > 0 && console.log("Map Projection Changed:", t.ID, t.lon0), this.dispatchEvent({
      type: "projection-changed",
      projection: t
    }));
  }
  /** 取得影像数据源 */
  get imgSource() {
    return this.loader.imgSource;
  }
  /** 设置影像数据源 */
  set imgSource(t) {
    const e = Array.isArray(t) ? t : [t];
    if (e.length === 0)
      throw new Error("imgSource can not be empty");
    this.projection = ht.createFromID(e[0].projectionID, this.projection.lon0), this.loader.imgSource = e, this.updateSource(!0, !1), this.debug > 0 && console.log("Img Source Changed:", e), this.dispatchEvent({ type: "source-changed", source: t });
  }
  /** 设置地形数据源 */
  get demSource() {
    return this.loader.demSource;
  }
  /** 取得地形数据源 */
  set demSource(t) {
    this.loader.demSource = t, this.updateSource(!1, !0), this.debug > 0 && console.log("DEM Source Changed:", this.demSource), this.dispatchEvent({ type: "source-changed", source: t });
  }
  /** 取得LOD阈值	 */
  get LODThreshold() {
    return this._LODThreshold;
  }
  /** 设置LOD阈值，LOD阈值越大，瓦片细化，但耗费资源越高，建议取1-2之间，默认为1 */
  set LODThreshold(t) {
    this._LODThreshold = t;
  }
  /** 取得背景色 */
  get backgroundColor() {
    return this.loader.backgroundMaterial.color;
  }
  /** 设置背景色 */
  set backgroundColor(t) {
    this.loader.backgroundMaterial.color.set(t);
  }
  /** 取得地图经纬度范围 */
  get bounds() {
    return this.loader.bounds;
  }
  /** 设置地图经纬度范围 */
  set bounds(t) {
    this.loader.bounds = t;
  }
  /**
      * 地图创建工厂函数
        @param params 地图参数 {@link MapParams}
        @returns map mesh 地图模型
        ```
      */
  static create(t) {
    return new Kt(t);
  }
  _resize() {
    this.rootTile.scale.set(this.projection.mapWidth, this.projection.mapHeight, this.projection.mapDepth), this.rootTile.updateMatrix(), this.rootTile.updateMatrixWorld();
  }
  /**
   * 模型更新回调函数，地图加入场景后会在每帧更新时被调用，该函数调用根瓦片实现瓦片树更新和数据加载
   * @param camera
   */
  update(t) {
    const e = this._mapClock.getElapsedTime();
    e > this.updateInterval / 1e3 && (this.rootTile.update({
      camera: t,
      loader: this.loader,
      minLevel: this.minLevel,
      maxLevel: this.maxLevel,
      LODThreshold: this.LODThreshold
    }), this.rootTile.castShadow = this.castShadow, this.rootTile.receiveShadow = this.receiveShadow, this.dispatchEvent({ type: "update", delta: e }), this._mapClock.start());
  }
  /**
   * 重新加载地图数据
   * @param updateMaterial 是否重新加载材质，默认为true
   * @param updateGeometry 是否重新加载几何体, 默认为true
   */
  updateSource(t = !0, e = !0) {
    this.rootTile.updateData(t, e);
  }
  /**
   * 销毁全部瓦片并重新加载
   */
  reload() {
    this.rootTile.reload(this.loader);
  }
  /**
   * 释放地图资源，并移出场景
   */
  dispose() {
    this.removeFromParent(), this.reload();
  }
  /**
   * 地理坐标转换为地图模型坐标(与geo2map同功能)
   * @param geo 地理坐标（经纬度）
   * @returns 模型坐标
   * @deprecated This method is not recommended. Use geo2map() instead.
   */
  geo2pos(t) {
    return this.geo2map(t);
  }
  /**
   * 地理坐标转换为地图模型坐标(与geo2pos同功能)
   * @param geo 地理坐标（经纬度）
   * @returns 模型坐标
   */
  geo2map(t) {
    const e = this.projection.project(t.x, t.y);
    return new K(e.x, e.y, t.z);
  }
  /**
   * 地理坐标转换为世界坐标
   *
   * @param geo 地理坐标（经纬度）
   * @returns 世界坐标
   */
  geo2world(t) {
    return this.localToWorld(this.geo2map(t));
  }
  /**
   * 地图模型坐标转换为地理坐标(与map2geo同功能)
   * @param pos 模型坐标
   * @returns 地理坐标（经纬度）
   *  @deprecated This method is not recommended. Use map2geo() instead.
   */
  pos2geo(t) {
    return this.map2geo(t);
  }
  /**
   * 地图模型坐标转换为地理坐标(与pos2geo同功能)
   * @param map 模型坐标
   * @returns 地理坐标（经纬度）
   */
  map2geo(t) {
    const e = this.projection.unProject(t.x, t.y);
    return new K(e.lon, e.lat, t.z);
  }
  /**
   * 世界坐标转换为地理坐标
   *
   * @param world 世界坐标
   * @returns 地理坐标（经纬度）
   */
  world2geo(t) {
    return this.pos2geo(this.worldToLocal(t.clone()));
  }
  /**
   * 获取指定经纬度的地面信息（法向量、高度等）
   * @param geo 地理坐标
   * @returns 地面信息
   */
  getLocalInfoFromGeo(t) {
    const e = this.geo2world(t);
    return bt(this, e);
  }
  /**
   * 获取指定世界坐标的地面信息
   * @param pos 世界坐标
   * @returns 地面信息
   */
  getLocalInfoFromWorld(t) {
    return bt(this, t);
  }
  /**
   * 获取指定屏幕坐标的地面信息
   * @param camera 摄像机
   * @param pointer 点的屏幕坐标（-0.5~0.5）
   * @returns 位置信息（经纬度、高度等）
   */
  getLocalInfoFromScreen(t, e) {
    return Cs(t, this, e);
  }
  /**
   * 取得当前正在下载的瓦片数量
   */
  get downloading() {
    return this.loader.downloadingThreads;
  }
  /**
   * 取得地图瓦片状态统计信息
   */
  getTileCount() {
    let t = 0, e = 0, o = 0, i = 0, a = 0, l = 0;
    return this.rootTile.traverse((r) => {
      r instanceof w && (t++, r.isLeaf && (a++, r.showing && e++, r.inFrustum && o++), i = Math.max(i, r.z), l = this.loader.downloadingThreads);
    }), { total: t, leaf: a, visible: e, inFrustum: o, maxLevel: i, downloading: l };
  }
}
function Bs(n, s = 100) {
  return new Promise((t) => {
    const e = () => {
      n() ? t() : setTimeout(e, s);
    };
    e();
  });
}
function St(n) {
  return y.registerMaterialLoader(n), n;
}
function tt(n) {
  return y.registerGeometryLoader(n), n;
}
function As(n) {
  return y.getMaterialLoader(n);
}
function _s(n) {
  return y.getGeometryLoader(n);
}
function qs() {
  return y.getLoaders();
}
export {
  Is as DebugCanvasLoader,
  y as LoaderFactory,
  Os as Martini,
  Qs as PromiseWorker,
  zs as TerrariumShaderLoader,
  w as Tile,
  Gs as TileCanvasLoader,
  F as TileGeometry,
  $ as TileGeometryLoader,
  Vs as TileImageLoader,
  B as TileLoader,
  us as TileLoadingManager,
  Kt as TileMap,
  yt as TileMaterial,
  Ls as TileMaterialLoader,
  Xt as TileSource,
  j as VectorFeatureTypes,
  vs as VectorTileRender,
  rs as addSkirt,
  Ds as applyTerrariumElevation,
  js as attachEvent,
  Es as author,
  f as concatenateTypedArrays,
  O as decodeTerrariumTSL,
  q as getBoundsCoord,
  _s as getDEMLoader,
  hs as getGeometryDataFromDem,
  Lt as getGridIndices,
  As as getImgLoader,
  Pt as getLocalInfoFromRay,
  Cs as getLocalInfoFromScreen,
  bt as getLocalInfoFromWorld,
  Gt as getNormals,
  Vt as getSafeTileUrlAndBounds,
  Ws as getSubImage,
  qs as getTileLoaders,
  tt as registerDEMLoader,
  St as registerImgLoader,
  Rs as strTemplate,
  ys as tileBoundsClip,
  I as version,
  Bs as waitFor
};
