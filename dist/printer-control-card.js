// node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t3, e4, o5) {
    if (this._$cssResult$ = true, o5 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t3, this.t = e4;
  }
  get styleSheet() {
    let t3 = this.o;
    const s4 = this.t;
    if (e && void 0 === t3) {
      const e4 = void 0 !== s4 && 1 === s4.length;
      e4 && (t3 = o.get(s4)), void 0 === t3 && ((this.o = t3 = new CSSStyleSheet()).replaceSync(this.cssText), e4 && o.set(s4, t3));
    }
    return t3;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t3) => new n("string" == typeof t3 ? t3 : t3 + "", void 0, s);
var i = (t3, ...e4) => {
  const o5 = 1 === t3.length ? t3[0] : e4.reduce((e5, s4, o6) => e5 + ((t4) => {
    if (true === t4._$cssResult$) return t4.cssText;
    if ("number" == typeof t4) return t4;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t4 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s4) + t3[o6 + 1], t3[0]);
  return new n(o5, t3, s);
};
var S = (s4, o5) => {
  if (e) s4.adoptedStyleSheets = o5.map((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet);
  else for (const e4 of o5) {
    const o6 = document.createElement("style"), n4 = t.litNonce;
    void 0 !== n4 && o6.setAttribute("nonce", n4), o6.textContent = e4.cssText, s4.appendChild(o6);
  }
};
var c = e ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
  let e4 = "";
  for (const s4 of t4.cssRules) e4 += s4.cssText;
  return r(e4);
})(t3) : t3;

// node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t3, s4) => t3;
var u = { toAttribute(t3, s4) {
  switch (s4) {
    case Boolean:
      t3 = t3 ? l : null;
      break;
    case Object:
    case Array:
      t3 = null == t3 ? t3 : JSON.stringify(t3);
  }
  return t3;
}, fromAttribute(t3, s4) {
  let i5 = t3;
  switch (s4) {
    case Boolean:
      i5 = null !== t3;
      break;
    case Number:
      i5 = null === t3 ? null : Number(t3);
      break;
    case Object:
    case Array:
      try {
        i5 = JSON.parse(t3);
      } catch (t4) {
        i5 = null;
      }
  }
  return i5;
} };
var f = (t3, s4) => !i2(t3, s4);
var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var y = class extends HTMLElement {
  static addInitializer(t3) {
    this._$Ei(), (this.l ??= []).push(t3);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t3, s4 = b) {
    if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t3) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t3, s4), !s4.noAccessor) {
      const i5 = Symbol(), h3 = this.getPropertyDescriptor(t3, i5, s4);
      void 0 !== h3 && e2(this.prototype, t3, h3);
    }
  }
  static getPropertyDescriptor(t3, s4, i5) {
    const { get: e4, set: r4 } = h(this.prototype, t3) ?? { get() {
      return this[s4];
    }, set(t4) {
      this[s4] = t4;
    } };
    return { get: e4, set(s5) {
      const h3 = e4?.call(this);
      r4?.call(this, s5), this.requestUpdate(t3, h3, i5);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t3) {
    return this.elementProperties.get(t3) ?? b;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t3 = n2(this);
    t3.finalize(), void 0 !== t3.l && (this.l = [...t3.l]), this.elementProperties = new Map(t3.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t4 = this.properties, s4 = [...r2(t4), ...o2(t4)];
      for (const i5 of s4) this.createProperty(i5, t4[i5]);
    }
    const t3 = this[Symbol.metadata];
    if (null !== t3) {
      const s4 = litPropertyMetadata.get(t3);
      if (void 0 !== s4) for (const [t4, i5] of s4) this.elementProperties.set(t4, i5);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t4, s4] of this.elementProperties) {
      const i5 = this._$Eu(t4, s4);
      void 0 !== i5 && this._$Eh.set(i5, t4);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s4) {
    const i5 = [];
    if (Array.isArray(s4)) {
      const e4 = new Set(s4.flat(1 / 0).reverse());
      for (const s5 of e4) i5.unshift(c(s5));
    } else void 0 !== s4 && i5.push(c(s4));
    return i5;
  }
  static _$Eu(t3, s4) {
    const i5 = s4.attribute;
    return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t3 ? t3.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t3) => this.enableUpdating = t3), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t3) => t3(this));
  }
  addController(t3) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t3), void 0 !== this.renderRoot && this.isConnected && t3.hostConnected?.();
  }
  removeController(t3) {
    this._$EO?.delete(t3);
  }
  _$E_() {
    const t3 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
    for (const i5 of s4.keys()) this.hasOwnProperty(i5) && (t3.set(i5, this[i5]), delete this[i5]);
    t3.size > 0 && (this._$Ep = t3);
  }
  createRenderRoot() {
    const t3 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t3, this.constructor.elementStyles), t3;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t3) => t3.hostConnected?.());
  }
  enableUpdating(t3) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t3) => t3.hostDisconnected?.());
  }
  attributeChangedCallback(t3, s4, i5) {
    this._$AK(t3, i5);
  }
  _$ET(t3, s4) {
    const i5 = this.constructor.elementProperties.get(t3), e4 = this.constructor._$Eu(t3, i5);
    if (void 0 !== e4 && true === i5.reflect) {
      const h3 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
      this._$Em = t3, null == h3 ? this.removeAttribute(e4) : this.setAttribute(e4, h3), this._$Em = null;
    }
  }
  _$AK(t3, s4) {
    const i5 = this.constructor, e4 = i5._$Eh.get(t3);
    if (void 0 !== e4 && this._$Em !== e4) {
      const t4 = i5.getPropertyOptions(e4), h3 = "function" == typeof t4.converter ? { fromAttribute: t4.converter } : void 0 !== t4.converter?.fromAttribute ? t4.converter : u;
      this._$Em = e4;
      const r4 = h3.fromAttribute(s4, t4.type);
      this[e4] = r4 ?? this._$Ej?.get(e4) ?? r4, this._$Em = null;
    }
  }
  requestUpdate(t3, s4, i5, e4 = false, h3) {
    if (void 0 !== t3) {
      const r4 = this.constructor;
      if (false === e4 && (h3 = this[t3]), i5 ??= r4.getPropertyOptions(t3), !((i5.hasChanged ?? f)(h3, s4) || i5.useDefault && i5.reflect && h3 === this._$Ej?.get(t3) && !this.hasAttribute(r4._$Eu(t3, i5)))) return;
      this.C(t3, s4, i5);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t3, s4, { useDefault: i5, reflect: e4, wrapped: h3 }, r4) {
    i5 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t3) && (this._$Ej.set(t3, r4 ?? s4 ?? this[t3]), true !== h3 || void 0 !== r4) || (this._$AL.has(t3) || (this.hasUpdated || i5 || (s4 = void 0), this._$AL.set(t3, s4)), true === e4 && this._$Em !== t3 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t3));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t4) {
      Promise.reject(t4);
    }
    const t3 = this.scheduleUpdate();
    return null != t3 && await t3, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t5, s5] of this._$Ep) this[t5] = s5;
        this._$Ep = void 0;
      }
      const t4 = this.constructor.elementProperties;
      if (t4.size > 0) for (const [s5, i5] of t4) {
        const { wrapped: t5 } = i5, e4 = this[s5];
        true !== t5 || this._$AL.has(s5) || void 0 === e4 || this.C(s5, void 0, i5, e4);
      }
    }
    let t3 = false;
    const s4 = this._$AL;
    try {
      t3 = this.shouldUpdate(s4), t3 ? (this.willUpdate(s4), this._$EO?.forEach((t4) => t4.hostUpdate?.()), this.update(s4)) : this._$EM();
    } catch (s5) {
      throw t3 = false, this._$EM(), s5;
    }
    t3 && this._$AE(s4);
  }
  willUpdate(t3) {
  }
  _$AE(t3) {
    this._$EO?.forEach((t4) => t4.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t3) {
    return true;
  }
  update(t3) {
    this._$Eq &&= this._$Eq.forEach((t4) => this._$ET(t4, this[t4])), this._$EM();
  }
  updated(t3) {
  }
  firstUpdated(t3) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");

// node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = (t3) => t3;
var s2 = t2.trustedTypes;
var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
var h2 = "$lit$";
var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var n3 = "?" + o3;
var r3 = `<${n3}>`;
var l2 = document;
var c3 = () => l2.createComment("");
var a2 = (t3) => null === t3 || "object" != typeof t3 && "function" != typeof t3;
var u2 = Array.isArray;
var d2 = (t3) => u2(t3) || "function" == typeof t3?.[Symbol.iterator];
var f2 = "[ 	\n\f\r]";
var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var _ = /-->/g;
var m = />/g;
var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var g = /'/g;
var $ = /"/g;
var y2 = /^(?:script|style|textarea|title)$/i;
var x = (t3) => (i5, ...s4) => ({ _$litType$: t3, strings: i5, values: s4 });
var b2 = x(1);
var w = x(2);
var T = x(3);
var E = Symbol.for("lit-noChange");
var A = Symbol.for("lit-nothing");
var C = /* @__PURE__ */ new WeakMap();
var P = l2.createTreeWalker(l2, 129);
function V(t3, i5) {
  if (!u2(t3) || !t3.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i5) : i5;
}
var N = (t3, i5) => {
  const s4 = t3.length - 1, e4 = [];
  let n4, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = v;
  for (let i6 = 0; i6 < s4; i6++) {
    const s5 = t3[i6];
    let a3, u3, d3 = -1, f3 = 0;
    for (; f3 < s5.length && (c4.lastIndex = f3, u3 = c4.exec(s5), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n4 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n4 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n4 = void 0);
    const x2 = c4 === p2 && t3[i6 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === v ? s5 + r3 : d3 >= 0 ? (e4.push(a3), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x2) : s5 + o3 + (-2 === d3 ? i6 : x2);
  }
  return [V(t3, l3 + (t3[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), e4];
};
var S2 = class _S {
  constructor({ strings: t3, _$litType$: i5 }, e4) {
    let r4;
    this.parts = [];
    let l3 = 0, a3 = 0;
    const u3 = t3.length - 1, d3 = this.parts, [f3, v2] = N(t3, i5);
    if (this.el = _S.createElement(f3, e4), P.currentNode = this.el.content, 2 === i5 || 3 === i5) {
      const t4 = this.el.content.firstChild;
      t4.replaceWith(...t4.childNodes);
    }
    for (; null !== (r4 = P.nextNode()) && d3.length < u3; ) {
      if (1 === r4.nodeType) {
        if (r4.hasAttributes()) for (const t4 of r4.getAttributeNames()) if (t4.endsWith(h2)) {
          const i6 = v2[a3++], s4 = r4.getAttribute(t4).split(o3), e5 = /([.?@])?(.*)/.exec(i6);
          d3.push({ type: 1, index: l3, name: e5[2], strings: s4, ctor: "." === e5[1] ? I : "?" === e5[1] ? L : "@" === e5[1] ? z : H }), r4.removeAttribute(t4);
        } else t4.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r4.removeAttribute(t4));
        if (y2.test(r4.tagName)) {
          const t4 = r4.textContent.split(o3), i6 = t4.length - 1;
          if (i6 > 0) {
            r4.textContent = s2 ? s2.emptyScript : "";
            for (let s4 = 0; s4 < i6; s4++) r4.append(t4[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
            r4.append(t4[i6], c3());
          }
        }
      } else if (8 === r4.nodeType) if (r4.data === n3) d3.push({ type: 2, index: l3 });
      else {
        let t4 = -1;
        for (; -1 !== (t4 = r4.data.indexOf(o3, t4 + 1)); ) d3.push({ type: 7, index: l3 }), t4 += o3.length - 1;
      }
      l3++;
    }
  }
  static createElement(t3, i5) {
    const s4 = l2.createElement("template");
    return s4.innerHTML = t3, s4;
  }
};
function M(t3, i5, s4 = t3, e4) {
  if (i5 === E) return i5;
  let h3 = void 0 !== e4 ? s4._$Co?.[e4] : s4._$Cl;
  const o5 = a2(i5) ? void 0 : i5._$litDirective$;
  return h3?.constructor !== o5 && (h3?._$AO?.(false), void 0 === o5 ? h3 = void 0 : (h3 = new o5(t3), h3._$AT(t3, s4, e4)), void 0 !== e4 ? (s4._$Co ??= [])[e4] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = M(t3, h3._$AS(t3, i5.values), h3, e4)), i5;
}
var R = class {
  constructor(t3, i5) {
    this._$AV = [], this._$AN = void 0, this._$AD = t3, this._$AM = i5;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t3) {
    const { el: { content: i5 }, parts: s4 } = this._$AD, e4 = (t3?.creationScope ?? l2).importNode(i5, true);
    P.currentNode = e4;
    let h3 = P.nextNode(), o5 = 0, n4 = 0, r4 = s4[0];
    for (; void 0 !== r4; ) {
      if (o5 === r4.index) {
        let i6;
        2 === r4.type ? i6 = new k(h3, h3.nextSibling, this, t3) : 1 === r4.type ? i6 = new r4.ctor(h3, r4.name, r4.strings, this, t3) : 6 === r4.type && (i6 = new Z(h3, this, t3)), this._$AV.push(i6), r4 = s4[++n4];
      }
      o5 !== r4?.index && (h3 = P.nextNode(), o5++);
    }
    return P.currentNode = l2, e4;
  }
  p(t3) {
    let i5 = 0;
    for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t3, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t3[i5])), i5++;
  }
};
var k = class _k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t3, i5, s4, e4) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t3, this._$AB = i5, this._$AM = s4, this.options = e4, this._$Cv = e4?.isConnected ?? true;
  }
  get parentNode() {
    let t3 = this._$AA.parentNode;
    const i5 = this._$AM;
    return void 0 !== i5 && 11 === t3?.nodeType && (t3 = i5.parentNode), t3;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t3, i5 = this) {
    t3 = M(this, t3, i5), a2(t3) ? t3 === A || null == t3 || "" === t3 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t3 !== this._$AH && t3 !== E && this._(t3) : void 0 !== t3._$litType$ ? this.$(t3) : void 0 !== t3.nodeType ? this.T(t3) : d2(t3) ? this.k(t3) : this._(t3);
  }
  O(t3) {
    return this._$AA.parentNode.insertBefore(t3, this._$AB);
  }
  T(t3) {
    this._$AH !== t3 && (this._$AR(), this._$AH = this.O(t3));
  }
  _(t3) {
    this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t3 : this.T(l2.createTextNode(t3)), this._$AH = t3;
  }
  $(t3) {
    const { values: i5, _$litType$: s4 } = t3, e4 = "number" == typeof s4 ? this._$AC(t3) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
    if (this._$AH?._$AD === e4) this._$AH.p(i5);
    else {
      const t4 = new R(e4, this), s5 = t4.u(this.options);
      t4.p(i5), this.T(s5), this._$AH = t4;
    }
  }
  _$AC(t3) {
    let i5 = C.get(t3.strings);
    return void 0 === i5 && C.set(t3.strings, i5 = new S2(t3)), i5;
  }
  k(t3) {
    u2(this._$AH) || (this._$AH = [], this._$AR());
    const i5 = this._$AH;
    let s4, e4 = 0;
    for (const h3 of t3) e4 === i5.length ? i5.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i5[e4], s4._$AI(h3), e4++;
    e4 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e4), i5.length = e4);
  }
  _$AR(t3 = this._$AA.nextSibling, s4) {
    for (this._$AP?.(false, true, s4); t3 !== this._$AB; ) {
      const s5 = i3(t3).nextSibling;
      i3(t3).remove(), t3 = s5;
    }
  }
  setConnected(t3) {
    void 0 === this._$AM && (this._$Cv = t3, this._$AP?.(t3));
  }
};
var H = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t3, i5, s4, e4, h3) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t3, this.name = i5, this._$AM = e4, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
  }
  _$AI(t3, i5 = this, s4, e4) {
    const h3 = this.strings;
    let o5 = false;
    if (void 0 === h3) t3 = M(this, t3, i5, 0), o5 = !a2(t3) || t3 !== this._$AH && t3 !== E, o5 && (this._$AH = t3);
    else {
      const e5 = t3;
      let n4, r4;
      for (t3 = h3[0], n4 = 0; n4 < h3.length - 1; n4++) r4 = M(this, e5[s4 + n4], i5, n4), r4 === E && (r4 = this._$AH[n4]), o5 ||= !a2(r4) || r4 !== this._$AH[n4], r4 === A ? t3 = A : t3 !== A && (t3 += (r4 ?? "") + h3[n4 + 1]), this._$AH[n4] = r4;
    }
    o5 && !e4 && this.j(t3);
  }
  j(t3) {
    t3 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t3 ?? "");
  }
};
var I = class extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t3) {
    this.element[this.name] = t3 === A ? void 0 : t3;
  }
};
var L = class extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t3) {
    this.element.toggleAttribute(this.name, !!t3 && t3 !== A);
  }
};
var z = class extends H {
  constructor(t3, i5, s4, e4, h3) {
    super(t3, i5, s4, e4, h3), this.type = 5;
  }
  _$AI(t3, i5 = this) {
    if ((t3 = M(this, t3, i5, 0) ?? A) === E) return;
    const s4 = this._$AH, e4 = t3 === A && s4 !== A || t3.capture !== s4.capture || t3.once !== s4.once || t3.passive !== s4.passive, h3 = t3 !== A && (s4 === A || e4);
    e4 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
  }
  handleEvent(t3) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t3) : this._$AH.handleEvent(t3);
  }
};
var Z = class {
  constructor(t3, i5, s4) {
    this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t3) {
    M(this, t3);
  }
};
var B = t2.litHtmlPolyfillSupport;
B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
var D = (t3, i5, s4) => {
  const e4 = s4?.renderBefore ?? i5;
  let h3 = e4._$litPart$;
  if (void 0 === h3) {
    const t4 = s4?.renderBefore ?? null;
    e4._$litPart$ = h3 = new k(i5.insertBefore(c3(), t4), t4, void 0, s4 ?? {});
  }
  return h3._$AI(t3), h3;
};

// node_modules/lit-element/lit-element.js
var s3 = globalThis;
var i4 = class extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t3 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t3.firstChild, t3;
  }
  update(t3) {
    const r4 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Do = D(r4, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
var o4 = s3.litElementPolyfillSupport;
o4?.({ LitElement: i4 });
(s3.litElementVersions ??= []).push("4.2.2");

// src/core/config.js
var DEFAULT_CONFIG = {
  name: "3D Printer",
  printer_hint: "",
  connection_entity: "",
  offline_states: [
    "off",
    "unavailable",
    "unknown",
    "false",
    "0",
    "disconnected",
    "offline"
  ],
  offline_message: "",
  offline_subtitle: "",
  entities: {
    status: "",
    filename: "",
    progress: "",
    started_at: "",
    estimated_end: "",
    remaining_time: "",
    thumbnail: ""
  },
  controls: {
    pause: {
      label: "",
      icon: "mdi:pause",
      entity: "",
      service: "",
      confirmation: false,
      enabled: true
    },
    resume: {
      label: "",
      icon: "mdi:play",
      entity: "",
      service: "",
      confirmation: false,
      enabled: true
    },
    cancel: {
      label: "",
      icon: "mdi:stop",
      entity: "",
      service: "",
      confirmation: true,
      confirmation_text: "Czy na pewno anulowa\u0107 wydruk?",
      enabled: true
    },
    emergency_stop: {
      label: "",
      icon: "mdi:alert-octagon",
      entity: "",
      service: "",
      confirmation: true,
      confirmation_text: "UWAGA! Zatrzymanie awaryjne natychmiast zatrzyma drukark\u0119. Kontynuowa\u0107?",
      enabled: true
    }
  },
  quick_actions: [],
  statistics: [],
  cameras: [],
  sections: {
    quick_actions: {
      title: "",
      enabled: true,
      collapsible: false,
      collapsed: false
    },
    statistics: {
      title: "",
      enabled: true,
      collapsible: true,
      collapsed: false,
      columns: 3
    },
    cameras: {
      title: "",
      enabled: true,
      collapsible: true,
      collapsed: false,
      columns: 2
    }
  },
  appearance: {
    compact_mode: false,
    show_status: true,
    show_progress: true,
    show_times: true,
    show_thumbnails: true,
    camera_aspect_ratio: "16 / 9",
    animation: true
  }
};
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function deepMerge(base, override) {
  const result = { ...base };
  for (const [key, value] of Object.entries(override || {})) {
    if (value && typeof value === "object" && !Array.isArray(value) && base[key] && typeof base[key] === "object" && !Array.isArray(base[key])) {
      result[key] = deepMerge(base[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
function normalizeConfig(userConfig = {}) {
  const defaults = clone(DEFAULT_CONFIG);
  const config = deepMerge(
    defaults,
    userConfig
  );
  config.offline_states = Array.isArray(config.offline_states) ? config.offline_states.map(
    (state) => String(state).toLowerCase()
  ) : defaults.offline_states;
  config.quick_actions = Array.isArray(config.quick_actions) ? config.quick_actions : [];
  config.statistics = Array.isArray(config.statistics) ? config.statistics : [];
  config.cameras = Array.isArray(config.cameras) ? config.cameras : [];
  return config;
}

// src/core/discovery.js
var FIELD_RULES = {
  connection_entity: {
    domains: ["binary_sensor", "sensor"],
    patterns: [
      /moonraker.*connected/i,
      /printer.*connected/i,
      /printer.*online/i,
      /connection.*status/i,
      /klipper.*connected/i
    ]
  },
  status: {
    domains: ["sensor"],
    patterns: [
      /print.*state/i,
      /printer.*state/i,
      /klipper.*state/i,
      /print.*status/i
    ]
  },
  filename: {
    domains: ["sensor"],
    patterns: [
      /current.*print/i,
      /current.*file/i,
      /filename/i,
      /print.*filename/i,
      /job.*name/i
    ]
  },
  progress: {
    domains: ["sensor"],
    patterns: [
      /print.*progress/i,
      /progress.*print/i,
      /print.*percentage/i,
      /completion/i
    ]
  },
  started_at: {
    domains: ["sensor"],
    patterns: [
      /print.*start.*time/i,
      /start.*time/i,
      /print.*started/i
    ]
  },
  estimated_end: {
    domains: ["sensor"],
    patterns: [
      /estimated.*end/i,
      /estimated.*finish/i,
      /print.*end.*time/i,
      /print.*finish.*time/i
    ]
  },
  remaining_time: {
    domains: ["sensor"],
    patterns: [
      /print.*remaining.*time/i,
      /remaining.*time/i,
      /time.*remaining/i
    ]
  },
  thumbnail: {
    domains: ["camera", "image", "sensor"],
    patterns: [
      /thumbnail/i,
      /print.*preview/i,
      /current.*print.*image/i,
      /gcode.*image/i
    ]
  }
};
var CONTROL_RULES = {
  pause: [
    /pause.*print/i,
    /print.*pause/i
  ],
  resume: [
    /resume.*print/i,
    /print.*resume/i
  ],
  cancel: [
    /cancel.*print/i,
    /print.*cancel/i
  ],
  emergency_stop: [
    /emergency.*stop/i,
    /stop.*emergency/i
  ]
};
function getSearchText(entityId, state) {
  const friendlyName = state?.attributes?.friendly_name || "";
  return `${entityId} ${friendlyName}`.toLowerCase();
}
function entityDomain(entityId) {
  return entityId.split(".")[0];
}
function scoreEntity(entityId, state, rules, printerHint = "") {
  const domain = entityDomain(entityId);
  if (!rules.domains.includes(domain)) {
    return 0;
  }
  const searchText = getSearchText(entityId, state);
  let score = 0;
  for (const pattern of rules.patterns) {
    if (pattern.test(searchText)) {
      score += 10;
    }
  }
  if (printerHint && searchText.includes(printerHint.toLowerCase())) {
    score += 15;
  }
  if (state?.state === "unavailable") {
    score -= 2;
  }
  return score;
}
function getCandidates(hass, rules, printerHint = "") {
  const results = [];
  for (const [entityId, state] of Object.entries(hass.states || {})) {
    const score = scoreEntity(
      entityId,
      state,
      rules,
      printerHint
    );
    if (score > 0) {
      results.push({
        entity_id: entityId,
        name: state.attributes?.friendly_name || entityId,
        domain: entityDomain(entityId),
        score
      });
    }
  }
  return results.sort((a3, b3) => b3.score - a3.score);
}
function discoverPrinterEntities(hass, printerHint = "") {
  const result = {
    entities: {},
    candidates: {},
    controls: {},
    cameras: [],
    printer_hint: printerHint
  };
  for (const [field, rules] of Object.entries(FIELD_RULES)) {
    const candidates = getCandidates(
      hass,
      rules,
      printerHint
    );
    result.candidates[field] = candidates;
    result.entities[field] = candidates[0]?.entity_id || "";
  }
  for (const [control, patterns] of Object.entries(CONTROL_RULES)) {
    const matches = [];
    for (const [entityId, state] of Object.entries(hass.states || {})) {
      if (!["button", "script", "input_button"].includes(entityDomain(entityId))) {
        continue;
      }
      const searchText = getSearchText(entityId, state);
      const matched = patterns.some(
        (pattern) => pattern.test(searchText)
      );
      if (matched) {
        matches.push({
          entity_id: entityId,
          name: state.attributes?.friendly_name || entityId
        });
      }
    }
    result.controls[control] = matches;
  }
  result.cameras = Object.entries(hass.states || {}).filter(([entityId]) => entityDomain(entityId) === "camera").map(([entityId, state]) => ({
    entity_id: entityId,
    name: state.attributes?.friendly_name || entityId
  }));
  return result;
}
function discoverTemperatureEntities(hass) {
  return Object.entries(hass.states || {}).filter(([entityId, state]) => {
    const unit = state.attributes?.unit_of_measurement;
    const text = getSearchText(entityId, state);
    return entityDomain(entityId) === "sensor" && (unit === "\xB0C" || unit === "\xB0F" || /temperature|temperatura|temp/i.test(text));
  }).map(([entityId, state]) => ({
    entity_id: entityId,
    name: state.attributes?.friendly_name || entityId,
    unit: state.attributes?.unit_of_measurement || "",
    value: state.state
  }));
}

// src/translations/en.json
var en_default = {
  card: {
    status: {
      online: "Online",
      offline: "Offline",
      printing: "Printing",
      paused: "Paused",
      idle: "Ready",
      unknown: "Unknown status"
    },
    job: {
      current_file: "Current file",
      no_file: "No active print",
      progress: "Print progress",
      started: "Started",
      estimated_end: "Estimated finish",
      remaining: "Time remaining",
      completion: "Completed"
    },
    controls: {
      pause: "Pause",
      resume: "Resume",
      cancel: "Cancel",
      emergency_stop: "Emergency stop"
    },
    sections: {
      quick_actions: "Quick actions",
      statistics: "Statistics",
      temperatures: "Temperatures",
      cameras: "Cameras"
    },
    offline: {
      title: "Printer is sleeping",
      subtitle: "Resting before the next print.",
      description: "No connection to the printer."
    },
    messages: {
      no_statistics: "No statistics configured.",
      no_cameras: "No cameras configured.",
      camera_unavailable: "Camera image is unavailable.",
      action_error: "Action could not be executed.",
      loading: "Loading..."
    },
    editor: {
      title: "Printer configuration",
      general: "General settings",
      printer_name: "Printer name",
      connection_entity: "Printer availability entity",
      automatic_detection: "Automatic detection",
      detect_button: "Detect entities",
      job_settings: "Print information",
      controls: "Printer controls",
      quick_actions: "Custom buttons",
      statistics: "Statistics configuration",
      cameras: "Camera configuration",
      appearance: "Appearance",
      add: "Add",
      remove: "Remove",
      entity: "Entity",
      label: "Name",
      service: "Service",
      url: "URL",
      icon: "Icon",
      unit: "Unit",
      columns: "Number of columns",
      detected: "Matching entities found.",
      not_detected: "No matching entities found."
    }
  }
};

// src/translations/pl.json
var pl_default = {
  card: {
    status: {
      online: "Online",
      offline: "Offline",
      printing: "Drukowanie",
      paused: "Wstrzymano",
      idle: "Gotowa",
      unknown: "Nieznany status"
    },
    job: {
      current_file: "Aktualny plik",
      no_file: "Brak aktywnego wydruku",
      progress: "Post\u0119p wydruku",
      started: "Rozpocz\u0119cie",
      estimated_end: "Przewidywane zako\u0144czenie",
      remaining: "Pozosta\u0142y czas",
      completion: "Uko\u0144czono"
    },
    controls: {
      pause: "Pauza",
      resume: "Wzn\xF3w",
      cancel: "Anuluj",
      emergency_stop: "STOP AWARYJNY"
    },
    sections: {
      quick_actions: "Szybkie akcje",
      statistics: "Statystyki",
      temperatures: "Temperatury",
      cameras: "Kamery"
    },
    offline: {
      title: "Drukarka \u015Bpi",
      subtitle: "Odpoczynek przed kolejnym wydrukiem.",
      description: "Brak po\u0142\u0105czenia z drukark\u0105."
    },
    messages: {
      no_statistics: "Nie skonfigurowano statystyk.",
      no_cameras: "Nie skonfigurowano kamer.",
      camera_unavailable: "Obraz z kamery jest niedost\u0119pny.",
      action_error: "Nie uda\u0142o si\u0119 wykona\u0107 akcji.",
      loading: "\u0141adowanie..."
    },
    editor: {
      title: "Konfiguracja drukarki",
      general: "Ustawienia podstawowe",
      printer_name: "Nazwa drukarki",
      connection_entity: "Encja dost\u0119pno\u015Bci drukarki",
      automatic_detection: "Automatyczne wykrywanie",
      detect_button: "Wykryj encje",
      job_settings: "Informacje o wydruku",
      controls: "Przyciski sterowania",
      quick_actions: "W\u0142asne przyciski",
      statistics: "Konfiguracja statystyk",
      cameras: "Konfiguracja kamer",
      appearance: "Wygl\u0105d",
      add: "Dodaj",
      remove: "Usu\u0144",
      entity: "Encja",
      label: "Nazwa",
      service: "Us\u0142uga",
      url: "Adres URL",
      icon: "Ikona",
      unit: "Jednostka",
      columns: "Liczba kolumn",
      detected: "Znaleziono pasuj\u0105ce encje.",
      not_detected: "Nie znaleziono pasuj\u0105cych encji."
    }
  }
};

// src/core/localize.js
var TRANSLATIONS = {
  en: en_default,
  pl: pl_default
};
function getNestedValue(object, path) {
  return path.split(".").reduce(
    (current, key) => current?.[key],
    object
  );
}
function localize(hass, key, variables = {}) {
  const language = String(
    hass?.locale?.language || "en"
  ).toLowerCase();
  const dictionary = language.startsWith("pl") ? TRANSLATIONS.pl : TRANSLATIONS.en;
  let value = getNestedValue(dictionary, key);
  if (typeof value !== "string") {
    value = getNestedValue(TRANSLATIONS.en, key);
  }
  if (typeof value !== "string") {
    return key;
  }
  return value.replace(
    /\{([^}]+)\}/g,
    (match, variable) => {
      return variables[variable] ?? match;
    }
  );
}

// src/editor/printer-control-card-editor.js
var PrinterControlCardEditor = class extends i4 {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _message: { state: true }
  };
  static styles = i`
    :host {
      display: block;
      color: var(--primary-text-color);
    }

    .editor {
      display: flex;
      flex-direction: column;
      gap: 17px;
      padding: 12px 0;
    }

    .editor-title {
      font-size: 1.1rem;
      font-weight: 650;
      margin: 0 0 3px;
    }

    .editor-section {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
    }

    .section-header {
      padding: 13px 15px;
      font-weight: 650;
      background: var(--secondary-background-color);
    }

    .section-body {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 13px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-width: 0;
    }

    .field-label {
      color: var(--secondary-text-color);
      font-size: 0.82rem;
      font-weight: 550;
    }

    input,
    select,
    textarea {
      box-sizing: border-box;
      min-height: 40px;
      width: 100%;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 0.9rem;
    }

    textarea {
      resize: vertical;
      min-height: 70px;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
      --mdc-menu-max-height: 350px;
    }

    .field-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 11px;
    }

    .item {
      border: 1px solid var(--divider-color);
      border-radius: 10px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 11px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      font-weight: 650;
    }

    .item-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    button {
      font: inherit;
      cursor: pointer;
    }

    .add-button {
      min-height: 40px;
      width: 100%;
      border: 1px dashed var(--primary-color);
      border-radius: 9px;
      background: transparent;
      color: var(--primary-color);
      font-weight: 600;
    }

    .remove-button {
      border: none;
      background: transparent;
      color: var(--error-color);
      font-size: 0.82rem;
      padding: 5px;
    }

    .detect-button {
      min-height: 43px;
      border: 1px solid var(--primary-color);
      border-radius: 9px;
      color: var(--primary-color);
      background: transparent;
      font-weight: 600;
    }

    .message {
      padding: 10px;
      border-radius: 8px;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 9px;
      font-size: 0.88rem;
    }

    .checkbox input {
      width: 18px;
      height: 18px;
      min-height: auto;
      accent-color: var(--primary-color);
    }

    @media (max-width: 450px) {
      .field-grid,
      .item-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  constructor() {
    super();
    this.hass = void 0;
    this._config = void 0;
    this._message = "";
  }
  setConfig(config) {
    this._config = normalizeConfig(config || {});
  }
  _t(key, variables = {}) {
    return localize(this.hass, key, variables);
  }
  /**
   * Zapisuje nową konfigurację i informuje HA.
   */
  _commit(nextConfig) {
    this._config = nextConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: {
          config: nextConfig
        }
      })
    );
  }
  _updateTop(key, value) {
    const next = {
      ...this._config,
      [key]: value
    };
    this._commit(next);
  }
  _updateEntity(key, value) {
    const next = {
      ...this._config,
      entities: {
        ...this._config.entities,
        [key]: value
      }
    };
    this._commit(next);
  }
  _updateControl(key, property, value) {
    const next = {
      ...this._config,
      controls: {
        ...this._config.controls,
        [key]: {
          ...this._config.controls[key],
          [property]: value
        }
      }
    };
    this._commit(next);
  }
  _updateSection(key, property, value) {
    const next = {
      ...this._config,
      sections: {
        ...this._config.sections,
        [key]: {
          ...this._config.sections[key],
          [property]: value
        }
      }
    };
    this._commit(next);
  }
  _updateAppearance(key, value) {
    const next = {
      ...this._config,
      appearance: {
        ...this._config.appearance,
        [key]: value
      }
    };
    this._commit(next);
  }
  _updateArrayItem(arrayName, index, property, value) {
    const items = [
      ...this._config[arrayName]
    ];
    items[index] = {
      ...items[index],
      [property]: value
    };
    this._updateTop(arrayName, items);
  }
  _removeArrayItem(arrayName, index) {
    const items = [
      ...this._config[arrayName]
    ];
    items.splice(index, 1);
    this._updateTop(arrayName, items);
  }
  _addArrayItem(arrayName, item) {
    this._updateTop(arrayName, [
      ...this._config[arrayName] || [],
      item
    ]);
  }
  _textField(label, value, onChange, placeholder = "") {
    return b2`
      <label class="field">
        <span class="field-label">${label}</span>

        <input
          .value=${String(value ?? "")}
          placeholder=${placeholder}
          @change=${(event) => onChange(event.target.value)}
        >
      </label>
    `;
  }
  _numberField(label, value, onChange, min = 0, max = 100) {
    return b2`
      <label class="field">
        <span class="field-label">${label}</span>

        <input
          type="number"
          min=${min}
          max=${max}
          .value=${String(value ?? "")}
          @change=${(event) => onChange(Number(event.target.value))}
        >
      </label>
    `;
  }
  _entityField(label, value, onChange) {
    return b2`
      <label class="field">
        <span class="field-label">${label}</span>

        <ha-entity-picker
          .hass=${this.hass}
          .value=${value || ""}
          allow-custom-entity
          @value-changed=${(event) => onChange(event.detail.value)}
        ></ha-entity-picker>
      </label>
    `;
  }
  _selectField(label, value, options, onChange) {
    return b2`
      <label class="field">
        <span class="field-label">${label}</span>

        <select
          .value=${String(value ?? "")}
          @change=${(event) => onChange(event.target.value)}
        >
          ${options.map((option) => b2`
            <option
              value=${option.value}
              ?selected=${String(value) === String(option.value)}
            >
              ${option.label}
            </option>
          `)}
        </select>
      </label>
    `;
  }
  _checkField(label, value, onChange) {
    return b2`
      <label class="checkbox">
        <input
          type="checkbox"
          .checked=${Boolean(value)}
          @change=${(event) => onChange(event.target.checked)}
        >

        <span>${label}</span>
      </label>
    `;
  }
  _section(title, content) {
    return b2`
      <section class="editor-section">
        <div class="section-header">
          ${title}
        </div>

        <div class="section-body">
          ${content}
        </div>
      </section>
    `;
  }
  /**
   * Podstawowe ustawienia i identyfikacja drukarki.
   */
  _renderGeneral() {
    return this._section(
      this._t("card.editor.general"),
      b2`
        ${this._textField(
        this._t("card.editor.printer_name"),
        this._config.name,
        (value) => this._updateTop("name", value)
      )}

        ${this._entityField(
        this._t("card.editor.connection_entity"),
        this._config.connection_entity,
        (value) => this._updateTop("connection_entity", value)
      )}

        ${this._textField(
        "Filtr wykrywania drukarki",
        this._config.printer_hint || "",
        (value) => this._updateTop("printer_hint", value),
        "np. voron, ender, bambu"
      )}

        <div class="field">
          <span class="field-label">
            Stany oznaczające tryb offline
          </span>

          ${this._textField(
        "Lista stan\xF3w oddzielonych przecinkami",
        this._config.offline_states.join(", "),
        (value) => this._updateTop(
          "offline_states",
          value.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean)
        )
      )}
        </div>

        ${this._textField(
        "Komunikat offline",
        this._config.offline_message,
        (value) => this._updateTop("offline_message", value)
      )}

        ${this._textField(
        "Opis trybu offline",
        this._config.offline_subtitle,
        (value) => this._updateTop("offline_subtitle", value)
      )}

        <button
          class="detect-button"
          @click=${this._detectEntities}
        >
          ${this._t("card.editor.detect_button")}
        </button>

        ${this._message ? b2`<div class="message">${this._message}</div>` : A}
      `
    );
  }
  /**
   * Automatyczne wykrywanie encji.
   *
   * Nie nadpisujemy pól, które użytkownik już skonfigurował.
   */
  _detectEntities() {
    if (!this.hass) {
      return;
    }
    const found = discoverPrinterEntities(
      this.hass,
      this._config.printer_hint || ""
    );
    const next = {
      ...this._config,
      entities: {
        ...this._config.entities
      },
      controls: {
        ...this._config.controls
      }
    };
    const mapping = {
      status: "status",
      filename: "filename",
      progress: "progress",
      started_at: "started_at",
      estimated_end: "estimated_end",
      remaining_time: "remaining_time",
      thumbnail: "thumbnail"
    };
    let count = 0;
    if (!next.connection_entity && found.entities.connection_entity) {
      next.connection_entity = found.entities.connection_entity;
      count++;
    }
    for (const [source, target] of Object.entries(mapping)) {
      if (!next.entities[target] && found.entities[source]) {
        next.entities[target] = found.entities[source];
        count++;
      }
    }
    for (const control of [
      "pause",
      "resume",
      "cancel",
      "emergency_stop"
    ]) {
      const candidate = found.controls[control]?.[0];
      if (candidate && !next.controls[control]?.entity && !next.controls[control]?.service) {
        next.controls[control] = {
          ...next.controls[control],
          entity: candidate.entity_id
        };
        count++;
      }
    }
    this._commit(next);
    this._message = count > 0 ? `Wykrywanie zako\u0144czone. Uzupe\u0142niono ${count} p\xF3l. Sprawd\u017A przypisane encje.` : this._t("card.editor.not_detected");
  }
  /**
   * Konfiguracja encji odpowiedzialnych za wydruk.
   */
  _renderJobSettings() {
    const fields = [
      ["status", "Status drukarki"],
      ["filename", "Nazwa aktualnego pliku"],
      ["progress", "Post\u0119p wydruku (%)"],
      ["started_at", "Czas rozpocz\u0119cia"],
      ["estimated_end", "Przewidywany czas zako\u0144czenia"],
      ["remaining_time", "Pozosta\u0142y czas (sekundy)"],
      ["thumbnail", "Miniatura wydruku"]
    ];
    return this._section(
      this._t("card.editor.job_settings"),
      b2`
        ${fields.map(
        ([key, label]) => this._entityField(
          label,
          this._config.entities[key],
          (value) => this._updateEntity(key, value)
        )
      )}
      `
    );
  }
  /**
   * Konfiguracja przycisków głównych.
   */
  _renderControls() {
    return this._section(
      this._t("card.editor.controls"),
      b2`
        ${[
        "pause",
        "resume",
        "cancel",
        "emergency_stop"
      ].map((key) => {
        const action = this._config.controls[key];
        return b2`
            <div class="item">
              <div class="item-header">
                <span>${action.label || key}</span>

                ${key === "emergency_stop" ? b2`<span style="color:var(--error-color)">STOP</span>` : A}
              </div>

              ${this._textField(
          "Nazwa przycisku",
          action.label,
          (value) => this._updateControl(key, "label", value)
        )}

              ${this._textField(
          "Ikona MDI",
          action.icon,
          (value) => this._updateControl(key, "icon", value),
          "mdi:pause"
        )}

              ${this._entityField(
          "Encja steruj\u0105ca",
          action.entity,
          (value) => this._updateControl(key, "entity", value)
        )}

              ${this._textField(
          "Us\u0142uga HA (domain.service)",
          action.service,
          (value) => this._updateControl(key, "service", value),
          "np. button.press"
        )}

              ${this._checkField(
          "Wymagaj potwierdzenia",
          action.confirmation,
          (value) => this._updateControl(key, "confirmation", value)
        )}

              ${action.confirmation ? this._textField(
          "Tre\u015B\u0107 komunikatu potwierdzenia",
          action.confirmation_text,
          (value) => this._updateControl(
            key,
            "confirmation_text",
            value
          )
        ) : A}

              ${this._checkField(
          "Aktywny",
          action.enabled !== false,
          (value) => this._updateControl(key, "enabled", value)
        )}
            </div>
          `;
      })}
      `
    );
  }
  /**
   * Konfiguracja dowolnych akcji.
   */
  _renderQuickActions() {
    const actions = this._config.quick_actions || [];
    return this._section(
      this._t("card.editor.quick_actions"),
      b2`
        ${actions.map((action, index) => b2`
          <div class="item">
            <div class="item-header">
              <span>
                ${action.label || `Przycisk ${index + 1}`}
              </span>

              <button
                class="remove-button"
                @click=${() => this._removeArrayItem("quick_actions", index)}
              >
                Usuń
              </button>
            </div>

            ${this._textField(
        "Nazwa przycisku",
        action.label,
        (value) => this._updateArrayItem(
          "quick_actions",
          index,
          "label",
          value
        )
      )}

            ${this._textField(
        "Ikona MDI",
        action.icon,
        (value) => this._updateArrayItem(
          "quick_actions",
          index,
          "icon",
          value
        ),
        "mdi:home"
      )}

            ${this._entityField(
        "Encja",
        action.entity,
        (value) => this._updateArrayItem(
          "quick_actions",
          index,
          "entity",
          value
        )
      )}

            ${this._textField(
        "Us\u0142uga",
        action.service,
        (value) => this._updateArrayItem(
          "quick_actions",
          index,
          "service",
          value
        ),
        "button.press"
      )}

            ${this._textField(
        "Adres URL",
        action.url,
        (value) => this._updateArrayItem(
          "quick_actions",
          index,
          "url",
          value
        ),
        "https://fluidd.local"
      )}

            ${this._checkField(
        "Wymagaj potwierdzenia",
        action.confirmation,
        (value) => this._updateArrayItem(
          "quick_actions",
          index,
          "confirmation",
          value
        )
      )}

            ${this._checkField(
        "Aktywny",
        action.enabled !== false,
        (value) => this._updateArrayItem(
          "quick_actions",
          index,
          "enabled",
          value
        )
      )}
          </div>
        `)}

        <button
          class="add-button"
          @click=${() => this._addArrayItem("quick_actions", {
        label: "Nowa akcja",
        icon: "mdi:gesture-tap",
        entity: "",
        service: "",
        url: "",
        confirmation: false,
        enabled: true
      })}
        >
          + Dodaj własny przycisk
        </button>
      `
    );
  }
  /**
   * Statystyki i temperatury.
   */
  _renderStatistics() {
    const items = this._config.statistics || [];
    const temperatureEntities = discoverTemperatureEntities(this.hass);
    return this._section(
      this._t("card.editor.statistics"),
      b2`
        <div class="message">
          Możesz dodawać temperatury dyszy, stołu,
          komory, suszarki, elektroniki oraz dowolne
          inne encje Home Assistant.
        </div>

        ${temperatureEntities.length ? b2`
              <div class="message">
                Wykryto ${temperatureEntities.length}
                encji związanych z temperaturą.
              </div>
            ` : A}

        ${items.map((item, index) => b2`
          <div class="item">
            <div class="item-header">
              <span>${item.label || `Statystyka ${index + 1}`}</span>

              <button
                class="remove-button"
                @click=${() => this._removeArrayItem("statistics", index)}
              >
                Usuń
              </button>
            </div>

            ${this._textField(
        "Nazwa kafelka",
        item.label,
        (value) => this._updateArrayItem(
          "statistics",
          index,
          "label",
          value
        )
      )}

            ${this._entityField(
        "Encja",
        item.entity,
        (value) => this._updateArrayItem(
          "statistics",
          index,
          "entity",
          value
        )
      )}

            <div class="item-grid">
              ${this._textField(
        "Atrybut",
        item.attribute,
        (value) => this._updateArrayItem(
          "statistics",
          index,
          "attribute",
          value
        )
      )}

              ${this._textField(
        "Jednostka",
        item.unit,
        (value) => this._updateArrayItem(
          "statistics",
          index,
          "unit",
          value
        ),
        "Automatyczna, je\u015Bli puste"
      )}

              ${this._textField(
        "Ikona MDI",
        item.icon,
        (value) => this._updateArrayItem(
          "statistics",
          index,
          "icon",
          value
        )
      )}

              ${this._selectField(
        "Rozmiar kafelka",
        item.size || "small",
        [
          { value: "small", label: "Ma\u0142y" },
          { value: "large", label: "Du\u017Cy" },
          { value: "full", label: "Pe\u0142na szeroko\u015B\u0107" }
        ],
        (value) => this._updateArrayItem(
          "statistics",
          index,
          "size",
          value
        )
      )}

              ${this._numberField(
        "Kolejno\u015B\u0107",
        item.order || 0,
        (value) => this._updateArrayItem(
          "statistics",
          index,
          "order",
          value
        ),
        0,
        999
      )}
            </div>

            ${this._checkField(
        "Widoczny",
        item.enabled !== false,
        (value) => this._updateArrayItem(
          "statistics",
          index,
          "enabled",
          value
        )
      )}
          </div>
        `)}

        <button
          class="add-button"
          @click=${() => this._addArrayItem("statistics", {
        label: "Nowa statystyka",
        entity: "",
        attribute: "",
        unit: "",
        icon: "mdi:thermometer",
        size: "small",
        order: items.length,
        enabled: true
      })}
        >
          + Dodaj statystykę
        </button>
      `
    );
  }
  /**
   * Kamery Moonraker, Tapo, LSC i inne encje HA.
   */
  _renderCameras() {
    const cameras = this._config.cameras || [];
    return this._section(
      this._t("card.editor.cameras"),
      b2`
        <div class="message">
          Obsługiwane są encje camera i image
          Home Assistant oraz bezpośrednie adresy URL
          obrazów.
        </div>

        ${cameras.map((camera, index) => b2`
          <div class="item">
            <div class="item-header">
              <span>
                ${camera.label || `Kamera ${index + 1}`}
              </span>

              <button
                class="remove-button"
                @click=${() => this._removeArrayItem("cameras", index)}
              >
                Usuń
              </button>
            </div>

            ${this._textField(
        "Nazwa kamery",
        camera.label,
        (value) => this._updateArrayItem(
          "cameras",
          index,
          "label",
          value
        )
      )}

            ${this._entityField(
        "Encja kamery",
        camera.entity,
        (value) => this._updateArrayItem(
          "cameras",
          index,
          "entity",
          value
        )
      )}

            ${this._textField(
        "Adres URL obrazu",
        camera.url,
        (value) => this._updateArrayItem(
          "cameras",
          index,
          "url",
          value
        ),
        "Opcjonalnie: https://..."
      )}

            ${this._numberField(
        "Od\u015Bwie\u017Canie obrazu (sekundy)",
        camera.refresh_interval || 0,
        (value) => this._updateArrayItem(
          "cameras",
          index,
          "refresh_interval",
          value
        ),
        0,
        3600
      )}

            ${this._checkField(
        "Aktywna kamera",
        camera.enabled !== false,
        (value) => this._updateArrayItem(
          "cameras",
          index,
          "enabled",
          value
        )
      )}
          </div>
        `)}

        <button
          class="add-button"
          @click=${() => this._addArrayItem("cameras", {
        label: "Nowa kamera",
        entity: "",
        url: "",
        refresh_interval: 0,
        enabled: true
      })}
        >
          + Dodaj kamerę
        </button>
      `
    );
  }
  /**
   * Wygląd, sekcje oraz responsywność.
   */
  _renderAppearance() {
    const sections = this._config.sections;
    const appearance = this._config.appearance;
    return this._section(
      this._t("card.editor.appearance"),
      b2`
        <h4>Szybkie akcje</h4>

        ${this._sectionSettings("quick_actions")}

        <h4>Statystyki</h4>

        ${this._sectionSettings("statistics")}

        <h4>Kamery</h4>

        ${this._sectionSettings("cameras")}

        <div class="field-grid">
          ${this._numberField(
        "Kolumny statystyk",
        sections.statistics.columns,
        (value) => this._updateSection("statistics", "columns", value),
        1,
        6
      )}

          ${this._numberField(
        "Kolumny kamer",
        sections.cameras.columns,
        (value) => this._updateSection("cameras", "columns", value),
        1,
        4
      )}
        </div>

        ${this._selectField(
        "Proporcje obrazu kamer",
        appearance.camera_aspect_ratio,
        [
          { value: "16 / 9", label: "16:9" },
          { value: "4 / 3", label: "4:3" },
          { value: "1 / 1", label: "1:1" },
          { value: "9 / 16", label: "9:16" }
        ],
        (value) => this._updateAppearance(
          "camera_aspect_ratio",
          value
        )
      )}

        ${this._checkField(
        "Tryb kompaktowy",
        appearance.compact_mode,
        (value) => this._updateAppearance("compact_mode", value)
      )}

        ${this._checkField(
        "Pokazuj status",
        appearance.show_status,
        (value) => this._updateAppearance("show_status", value)
      )}

        ${this._checkField(
        "Pokazuj pasek post\u0119pu",
        appearance.show_progress,
        (value) => this._updateAppearance("show_progress", value)
      )}

        ${this._checkField(
        "Pokazuj czasy wydruku",
        appearance.show_times,
        (value) => this._updateAppearance("show_times", value)
      )}

        ${this._checkField(
        "Pokazuj miniatur\u0119",
        appearance.show_thumbnails,
        (value) => this._updateAppearance("show_thumbnails", value)
      )}

        ${this._checkField(
        "Animacja trybu offline",
        appearance.animation,
        (value) => this._updateAppearance("animation", value)
      )}
      `
    );
  }
  _sectionSettings(key) {
    const section = this._config.sections[key];
    return b2`
      ${this._textField(
      "Tytu\u0142 sekcji",
      section.title,
      (value) => this._updateSection(key, "title", value)
    )}

      ${this._checkField(
      "Poka\u017C sekcj\u0119",
      section.enabled,
      (value) => this._updateSection(key, "enabled", value)
    )}

      ${this._checkField(
      "Mo\u017Cliwo\u015B\u0107 zwijania",
      section.collapsible,
      (value) => this._updateSection(key, "collapsible", value)
    )}

      ${section.collapsible ? this._checkField(
      "Domy\u015Blnie zwini\u0119ta",
      section.collapsed,
      (value) => this._updateSection(key, "collapsed", value)
    ) : A}
    `;
  }
  render() {
    if (!this._config) {
      return A;
    }
    return b2`
      <div class="editor">
        <h3 class="editor-title">
          ${this._t("card.editor.title")}
        </h3>

        ${this._renderGeneral()}

        ${this._renderJobSettings()}

        ${this._renderControls()}

        ${this._renderQuickActions()}

        ${this._renderStatistics()}

        ${this._renderCameras()}

        ${this._renderAppearance()}
      </div>
    `;
  }
};
customElements.define(
  "printer-control-card-editor",
  PrinterControlCardEditor
);

// src/styles/card.js
var cardStyles = i`
  :host {
    display: block;

    --printer-accent:
      var(--primary-color, #03a9f4);

    --printer-surface:
      var(--ha-card-background,
      var(--card-background-color));

    --printer-border:
      var(--divider-color,
      rgba(127,127,127,0.22));

    --printer-muted:
      var(--secondary-text-color);

    --printer-danger:
      var(--error-color, #db4437);

    --printer-warning:
      var(--warning-color, #e0a000);

    color: var(--primary-text-color);
  }

  ha-card {
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 12px);
  }

  .printer-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .printer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .printer-name {
    font-size: 1.15rem;
    font-weight: 650;
    letter-spacing: -0.02em;
    overflow-wrap: anywhere;
  }

  .printer-status {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--printer-muted);
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--printer-warning);
  }

  .status-dot.online {
    background: var(--success-color, #43a047);
  }

  .job-layout {
    display: grid;
    grid-template-columns: minmax(115px, 34%) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }

  .thumbnail {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 11px;
    border: 1px solid var(--printer-border);
    background: var(--secondary-background-color);
    display: block;
  }

  .thumbnail-placeholder {
    width: 100%;
    aspect-ratio: 4 / 3;
    display: grid;
    place-items: center;
    border-radius: 11px;
    background: var(--secondary-background-color);
    border: 1px solid var(--printer-border);
    color: var(--printer-muted);
  }

  .thumbnail-placeholder ha-icon {
    --mdc-icon-size: 42px;
  }

  .job-details {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .job-filename {
    font-size: 0.98rem;
    font-weight: 600;
    overflow-wrap: anywhere;
    line-height: 1.35;
  }

  .progress-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 7px;
    font-size: 0.85rem;
  }

  .progress-number {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .progress-track {
    width: 100%;
    height: 9px;
    background: var(--disabled-color,
      rgba(127,127,127,0.2));
    border-radius: 20px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--printer-accent);
    border-radius: inherit;
    transition: width 300ms ease;
  }

  .progress-fill.complete {
    background: var(--success-color, #43a047);
  }

  .job-times {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .time-box {
    padding: 9px 10px;
    border-radius: 9px;
    background: var(--secondary-background-color);
    min-width: 0;
  }

  .time-label {
    font-size: 0.72rem;
    color: var(--printer-muted);
    margin-bottom: 5px;
  }

  .time-value {
    font-size: 0.85rem;
    font-weight: 550;
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
  }

  .main-controls {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .printer-button {
    min-height: 44px;
    border: 1px solid var(--printer-border);
    border-radius: 10px;
    padding: 8px;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 0.84rem;
    font-weight: 550;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    transition:
      background 150ms ease,
      border-color 150ms ease,
      opacity 150ms ease;
  }

  .printer-button:hover:not(:disabled) {
    background: var(--input-fill-color,
      var(--secondary-background-color));
    border-color: var(--printer-accent);
  }

  .printer-button:focus-visible {
    outline: 2px solid var(--printer-accent);
    outline-offset: 2px;
  }

  .printer-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .printer-button ha-icon {
    --mdc-icon-size: 19px;
    flex-shrink: 0;
  }

  .printer-button.warning {
    color: var(--printer-warning);
  }

  .printer-button.danger {
    color: var(--printer-danger);
    border-color: var(--printer-danger);
  }

  .printer-button.emergency {
    background: color-mix(
      in srgb,
      var(--printer-danger) 10%,
      transparent
    );
    font-weight: 700;
  }

  .section {
    border-top: 1px solid var(--printer-border);
    padding-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .section-heading {
    font-size: 0.94rem;
    font-weight: 650;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-heading ha-icon {
    --mdc-icon-size: 19px;
    color: var(--printer-muted);
  }

  details.section > summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    user-select: none;
  }

  details.section > summary::-webkit-details-marker {
    display: none;
  }

  .section-chevron {
    color: var(--printer-muted);
    transition: transform 150ms ease;
  }

  details[open] .section-chevron {
    transform: rotate(180deg);
  }

  .section-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(125px, 1fr)
    );
    gap: 8px;
  }

  .statistics-grid {
    display: grid;
    grid-template-columns: repeat(
      var(--statistics-columns, 3),
      minmax(0, 1fr)
    );
    gap: 9px;
  }

  .stat-tile {
    border: 1px solid var(--printer-border);
    border-radius: 11px;
    padding: 11px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    color: var(--printer-muted);
    font-size: 0.76rem;
  }

  .stat-header ha-icon {
    --mdc-icon-size: 18px;
    flex-shrink: 0;
  }

  .stat-label {
    overflow-wrap: anywhere;
  }

  .stat-value {
    font-size: 1.15rem;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }

  .stat-tile.large {
    grid-column: span 2;
  }

  .stat-tile.full {
    grid-column: 1 / -1;
  }

  .cameras-grid {
    display: grid;
    grid-template-columns: repeat(
      var(--camera-columns, 2),
      minmax(0, 1fr)
    );
    gap: 11px;
  }

  .camera-tile {
    min-width: 0;
    border: 1px solid var(--printer-border);
    border-radius: 11px;
    overflow: hidden;
    background: var(--secondary-background-color);
  }

  .camera-image {
    width: 100%;
    aspect-ratio: var(--camera-ratio, 16 / 9);
    display: block;
    object-fit: cover;
    background: var(--secondary-background-color);
  }

  .camera-caption {
    padding: 9px 10px;
    font-size: 0.8rem;
    font-weight: 550;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .empty-message {
    color: var(--printer-muted);
    font-size: 0.85rem;
  }

  .action-error {
    border-radius: 9px;
    padding: 10px 12px;
    color: var(--printer-danger);
    background: color-mix(
      in srgb,
      var(--printer-danger) 10%,
      transparent
    );
    font-size: 0.85rem;
  }

  /* OFFLINE */

  .offline-view {
    min-height: 265px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    text-align: center;
    padding: 15px 8px 23px;
  }

  .sleeping-printer {
    width: min(280px, 85%);
    height: auto;
    overflow: visible;
  }

  .sleep-z {
    animation: sleeping 2.4s ease-in-out infinite;
    transform-origin: center;
  }

  .sleep-z:nth-of-type(2) {
    animation-delay: 0.5s;
  }

  .sleep-z:nth-of-type(3) {
    animation-delay: 1s;
  }

  @keyframes sleeping {
    0% {
      opacity: 0;
      transform: translateY(12px) scale(0.8);
    }

    35% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: translateY(-24px) scale(1.15);
    }
  }

  .offline-title {
    font-size: 1.03rem;
    font-weight: 650;
  }

  .offline-description {
    color: var(--printer-muted);
    font-size: 0.84rem;
  }

  .job-layout.no-thumbnail {
  grid-template-columns: minmax(0, 1fr);
}
  .compact .printer-card {
    gap: 12px;
    padding: 12px;
  }

  @media (max-width: 600px) {
    .job-layout {
      grid-template-columns: minmax(95px, 32%) minmax(0, 1fr);
      gap: 11px;
    }

    .main-controls {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .statistics-grid {
      grid-template-columns: repeat(
        min(var(--statistics-columns, 2), 2),
        minmax(0, 1fr)
      );
    }

    .cameras-grid {
      grid-template-columns: repeat(
        min(var(--camera-columns, 1), 1),
        minmax(0, 1fr)
      );
    }

    .printer-button {
      min-height: 43px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sleep-z,
    .progress-fill {
      animation: none !important;
      transition: none !important;
    }
  }
`;

// src/core/utils.js
function getEntityState(hass, entityId) {
  if (!hass || !entityId) {
    return null;
  }
  return hass.states?.[entityId] || null;
}
function getEntityValue(hass, entityId, attribute = null, fallback = "\u2014") {
  const entity = getEntityState(hass, entityId);
  if (!entity) {
    return fallback;
  }
  if (attribute) {
    return entity.attributes?.[attribute] ?? fallback;
  }
  return entity.state ?? fallback;
}
function getNumericValue(hass, entityId, fallback = 0) {
  const value = Number(
    getEntityValue(hass, entityId, null, fallback)
  );
  return Number.isFinite(value) ? value : fallback;
}
function isPrinterOffline(hass, connectionEntity, offlineStates = []) {
  if (!connectionEntity) {
    return false;
  }
  const state = getEntityState(
    hass,
    connectionEntity
  );
  if (!state) {
    return true;
  }
  const offline = offlineStates.map(
    (value) => String(value).toLowerCase()
  );
  return offline.includes(
    String(state.state).toLowerCase()
  );
}
function formatDateTime(value, language = "pl-PL") {
  if (value === void 0 || value === null || value === "" || value === "unknown" || value === "unavailable") {
    return "\u2014";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return new Intl.DateTimeFormat(language, {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}
function formatDuration(seconds) {
  const total = Number(seconds);
  if (!Number.isFinite(total) || total < 0) {
    return "\u2014";
  }
  const remaining = Math.floor(total);
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor(
    remaining % 3600 / 60
  );
  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} min`;
}
function getEntityUnit(hass, entityId) {
  return getEntityState(hass, entityId)?.attributes?.unit_of_measurement || "";
}
function getImageUrl(hass, entityId, refreshKey = "") {
  if (!entityId) {
    return "";
  }
  const entity = getEntityState(
    hass,
    entityId
  );
  if (!entity) {
    return "";
  }
  const domain = entityId.split(".")[0];
  const imagePicture = entity.attributes?.entity_picture;
  let url = imagePicture || "";
  if (!url && domain === "camera") {
    url = `/api/camera_proxy/${entityId}`;
  }
  if (!url && domain === "image") {
    url = `/api/image/serve/${entityId}/original`;
  }
  if (!url) {
    return "";
  }
  if (refreshKey) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}refresh=${encodeURIComponent(refreshKey)}`;
  }
  return url;
}
function getEntityName(hass, entityId) {
  const state = getEntityState(hass, entityId);
  return state?.attributes?.friendly_name || entityId || "Nieznana encja";
}
function normalizeProgress(value) {
  const progress = Number(value);
  if (!Number.isFinite(progress)) {
    return 0;
  }
  return Math.min(
    100,
    Math.max(0, progress)
  );
}
function getLanguage(hass) {
  return hass?.locale?.language || "pl-PL";
}

// src/core/actions.js
async function executeAction(hass, action) {
  if (!hass) {
    throw new Error("Home Assistant nie jest dost\u0119pny.");
  }
  if (!action || action.enabled === false) {
    return false;
  }
  if (action.confirmation) {
    const message = action.confirmation_text || "Czy na pewno wykona\u0107 t\u0119 operacj\u0119?";
    if (!window.confirm(message)) {
      return false;
    }
  }
  if (action.url) {
    const url = String(action.url).trim();
    if (!/^https?:\/\//i.test(url)) {
      throw new Error("Nieprawid\u0142owy adres URL.");
    }
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
    return true;
  }
  if (action.service) {
    const parts = String(action.service).split(".");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new Error(
        `Nieprawid\u0142owa us\u0142uga: ${action.service}`
      );
    }
    const [domain, service] = parts;
    const target = {
      ...action.entity ? { entity_id: action.entity } : {},
      ...action.target || {}
    };
    const serviceData = {
      ...action.service_data || {},
      ...target
    };
    await hass.callService(
      domain,
      service,
      serviceData
    );
    return true;
  }
  if (action.entity) {
    const entityId = String(action.entity);
    const domain = entityId.split(".")[0];
    const serviceMap = {
      button: ["button", "press"],
      input_button: ["input_button", "press"],
      script: ["script", "turn_on"]
    };
    const serviceDefinition = serviceMap[domain];
    if (!serviceDefinition) {
      throw new Error(
        `Encja ${entityId} wymaga jawnego okre\u015Blenia us\u0142ugi.`
      );
    }
    const [serviceDomain, service] = serviceDefinition;
    await hass.callService(
      serviceDomain,
      service,
      { entity_id: entityId }
    );
    return true;
  }
  throw new Error(
    "Nie skonfigurowano encji, us\u0142ugi ani adresu URL."
  );
}

// src/card/printer-control-card.js
var MAIN_CONTROLS = [
  "pause",
  "resume",
  "cancel",
  "emergency_stop"
];
var PrinterControlCard = class extends i4 {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _actionError: { state: true },
    _refreshCounter: { state: true },
    __sectionOpen: { state: true },
    _cameraError: { state: true }
  };
  static styles = [cardStyles];
  constructor() {
    super();
    this.hass = void 0;
    this._config = void 0;
    this._actionError = "";
    this._refreshCounter = 0;
    this._sectionOpen = {};
    this._cameraTimer = void 0;
    this._cameraError = {};
  }
  /**
   * Domyślna konfiguracja używana przez picker HA.
   */
  static getStubConfig() {
    return {
      name: "My 3D Printer"
    };
  }
  /**
   * Edytor wizualny.
   */
  static getConfigElement() {
    return document.createElement(
      "printer-control-card-editor"
    );
  }
  /**
   * Konfiguracja instancji karty.
   */
  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error(
        "3D Printer Control Card: invalid configuration."
      );
    }
    if (!config.name || !String(config.name).trim()) {
      throw new Error(
        "3D Printer Control Card: printer name is required."
      );
    }
    this._config = normalizeConfig(config);
    this._actionError = "";
    this._sectionOpen = {};
    this._resetCameraTimer();
  }
  getCardSize() {
    const stats = this._config?.statistics?.length || 0;
    const cameras = this._config?.cameras?.length || 0;
    return 6 + Math.ceil(stats / 3) + cameras;
  }
  connectedCallback() {
    super.connectedCallback();
    this._resetCameraTimer();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearCameraTimer();
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("_config")) {
      this._resetCameraTimer();
    }
  }
  _clearCameraTimer() {
    if (this._cameraTimer) {
      clearInterval(this._cameraTimer);
      this._cameraTimer = void 0;
    }
  }
  /**
   * Odświeżanie obrazów kamer.
   *
   * Minimalny interwał spośród skonfigurowanych kamer.
   * Przy wartości 0 odświeżanie okresowe jest wyłączone.
   */
  _resetCameraTimer() {
    this._clearCameraTimer();
    if (!this.isConnected || !this._config) {
      return;
    }
    const intervals = (this._config.cameras || []).map((camera) => Number(camera.refresh_interval || 0)).filter((value) => value > 0);
    if (!intervals.length) {
      return;
    }
    const refreshSeconds = Math.min(...intervals);
    this._cameraTimer = window.setInterval(() => {
      this._refreshCounter += 1;
    }, Math.max(5, refreshSeconds) * 1e3);
  }
  _t(key, variables = {}) {
    return localize(this.hass, key, variables);
  }
  _entityValue(key, fallback = "\u2014") {
    const entityId = this._config?.entities?.[key];
    return getEntityValue(
      this.hass,
      entityId,
      null,
      fallback
    );
  }
  _isOffline() {
    return isPrinterOffline(
      this.hass,
      this._config?.connection_entity,
      this._config?.offline_states
    );
  }
  _statusText() {
    const status = String(
      this._entityValue("status", "")
    ).toLowerCase();
    const statusMap = {
      printing: "printing",
      paused: "paused",
      idle: "idle",
      ready: "idle",
      standby: "idle"
    };
    const key = statusMap[status];
    return key ? this._t(`card.status.${key}`) : status || this._t("card.status.online");
  }
  _statusColor() {
    return this._isOffline() ? "offline" : "online";
  }
  _thumbnailUrl() {
    const source = this._config?.entities?.thumbnail;
    if (!source) {
      return "";
    }
    if (/^https?:\/\//i.test(source)) {
      return source;
    }
    return getImageUrl(
      this.hass,
      source,
      this.hass?.states?.[source]?.last_updated || ""
    );
  }
  _renderThumbnail() {
    const url = this._thumbnailUrl();
    if (!url) {
      return b2`
        <div class="thumbnail-placeholder">
          <ha-icon icon="mdi:file-image-outline"></ha-icon>
        </div>
      `;
    }
    return b2`
      <img
        class="thumbnail"
        src=${url}
        alt="Print thumbnail"
        loading="lazy"
      >
    `;
  }
  _renderHeader(offline = false) {
    return b2`
      <header class="printer-header">
        <div class="printer-name">
          ${this._config.name}
        </div>

        ${this._config.appearance.show_status ? b2`
              <div class="printer-status">
                <span class="status-dot ${offline ? "" : "online"}"></span>

                ${offline ? this._t("card.status.offline") : this._statusText()}
              </div>
            ` : A}
      </header>
    `;
  }
  _getEstimatedEnd() {
    const configuredEnd = this._config.entities.estimated_end;
    const value = getEntityValue(
      this.hass,
      configuredEnd,
      null,
      ""
    );
    if (value && value !== "unknown" && value !== "unavailable") {
      return formatDateTime(
        value,
        getLanguage(this.hass)
      );
    }
    const remainingEntity = this._config.entities.remaining_time;
    const remaining = getEntityState(
      this.hass,
      remainingEntity
    );
    if (remaining) {
      const seconds = Number(remaining.state);
      if (Number.isFinite(seconds) && seconds >= 0) {
        const date = new Date(
          Date.now() + seconds * 1e3
        );
        return formatDateTime(
          date,
          getLanguage(this.hass)
        );
      }
    }
    return "\u2014";
  }
  _renderTimeBox(label, value) {
    return b2`
      <div class="time-box">
        <div class="time-label">${label}</div>
        <div class="time-value">${value || "\u2014"}</div>
      </div>
    `;
  }
  _renderJob() {
    const entities = this._config.entities;
    const filename = getEntityValue(
      this.hass,
      entities.filename,
      null,
      this._t("card.job.no_file")
    );
    const progress = normalizeProgress(
      getNumericValue(
        this.hass,
        entities.progress,
        0
      )
    );
    const startedAt = formatDateTime(
      getEntityValue(
        this.hass,
        entities.started_at,
        null,
        ""
      ),
      getLanguage(this.hass)
    );
    const estimatedEnd = this._getEstimatedEnd();
    const remainingEntity = entities.remaining_time;
    let remaining = "\u2014";
    if (remainingEntity) {
      const value = getEntityValue(
        this.hass,
        remainingEntity,
        null,
        ""
      );
      const seconds = Number(value);
      remaining = Number.isFinite(seconds) ? formatDuration(seconds) : value || "\u2014";
    }
    const appearance = this._config.appearance;
    return b2`
      <section class="job-layout ${appearance.show_thumbnails ? "" : "no-thumbnail"}">
        ${appearance.show_thumbnails ? this._renderThumbnail() : A}

        <div class="job-details">
          <div class="job-filename">
            ${filename}
          </div>

          ${appearance.show_progress ? b2`
                <div class="progress-block">
                  <div class="progress-heading">
                    <span>${this._t("card.job.progress")}</span>

                    <span class="progress-number">
                      ${progress.toFixed(0)}%
                    </span>
                  </div>

                  <div
                    class="progress-track"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow=${progress}
                  >
                    <div
                      class="progress-fill ${progress >= 100 ? "complete" : ""}"
                      style=${`width:${progress}%`}
                    ></div>
                  </div>
                </div>
              ` : A}

          ${appearance.show_times ? b2`
                <div class="job-times">
                  ${this._renderTimeBox(
      this._t("card.job.started"),
      startedAt
    )}

                  ${this._renderTimeBox(
      this._t("card.job.estimated_end"),
      estimatedEnd
    )}

                  ${entities.remaining_time ? this._renderTimeBox(
      this._t("card.job.remaining"),
      remaining
    ) : A}
                </div>
              ` : A}
        </div>
      </section>
    `;
  }
  _renderMainControl(key) {
    const action = this._config.controls[key];
    if (!action || action.enabled === false) {
      return A;
    }
    const configured = Boolean(
      action.entity || action.service
    );
    const label = action.label || this._t(`card.controls.${key}`);
    return b2`
    <button
      class="printer-button
        ${key === "cancel" ? "warning" : ""}
        ${key === "emergency_stop" ? "danger emergency" : ""}"
      ?disabled=${!configured}
      aria-label=${label}
      @click=${() => this._runAction(
      action,
      key === "emergency_stop"
    )}
    >
      <ha-icon
        icon=${action.icon || "mdi:gesture-tap"}
      ></ha-icon>

      <span>${label}</span>
    </button>
  `;
  }
  _renderMainControls() {
    return b2`
      <div class="main-controls">
        ${MAIN_CONTROLS.map(
      (key) => this._renderMainControl(key)
    )}
      </div>
    `;
  }
  async _runAction(action, forceConfirmation = false) {
    try {
      this._actionError = "";
      const safeAction = forceConfirmation ? {
        ...action,
        confirmation: true,
        confirmation_text: action.confirmation_text || "Emergency Stop: immediately stop the printer. Continue?"
      } : action;
      await executeAction(
        this.hass,
        safeAction
      );
    } catch (error) {
      console.error(
        "3D Printer Control Card:",
        error
      );
      this._actionError = error?.message || this._t("card.messages.action_error");
    }
  }
  _renderAction(action) {
    if (!action || action.enabled === false) {
      return A;
    }
    const configured = Boolean(
      action.entity || action.service || action.url
    );
    return b2`
      <button
        class="printer-button"
        ?disabled=${!configured}
        @click=${() => this._runAction(action)}
      >
        <ha-icon
          icon=${action.icon || "mdi:gesture-tap"}
        ></ha-icon>

        <span>${action.label || "Action"}</span>
      </button>
    `;
  }
  _handleSectionToggle(key, event) {
    this._sectionOpen = {
      ...this._sectionOpen,
      [key]: event.currentTarget.open
    };
  }
  _renderSection(key, section, content, icon) {
    if (!section?.enabled) {
      return A;
    }
    const title = section.title || this._t(`card.sections.${key}`);
    if (section.collapsible) {
      const open = this._sectionOpen[key] ?? !section.collapsed;
      return b2`
        <details
          class="section"
          ?open=${open}
          @toggle=${(event) => this._handleSectionToggle(key, event)}
        >
          <summary>
            <span class="section-heading">
              ${icon ? b2`<ha-icon icon=${icon}></ha-icon>` : A}

              ${title}
            </span>

            <ha-icon
              class="section-chevron"
              icon="mdi:chevron-down"
            ></ha-icon>
          </summary>

          <div class="section-content">
            ${content}
          </div>
        </details>
      `;
    }
    return b2`
      <section class="section">
        <div class="section-heading">
          ${icon ? b2`<ha-icon icon=${icon}></ha-icon>` : A}

          ${title}
        </div>

        <div class="section-content">
          ${content}
        </div>
      </section>
    `;
  }
  _renderQuickActions() {
    const actions = this._config.quick_actions || [];
    if (!actions.length) {
      return A;
    }
    const content = b2`
      <div class="quick-actions">
        ${actions.map(
      (action) => this._renderAction(action)
    )}
      </div>
    `;
    return this._renderSection(
      "quick_actions",
      this._config.sections.quick_actions,
      content,
      "mdi:lightning-bolt"
    );
  }
  _renderStatistics() {
    const section = this._config.sections.statistics;
    if (!section?.enabled) {
      return A;
    }
    const statistics = (this._config.statistics || []).filter((item) => item.enabled !== false).slice().sort(
      (a3, b3) => Number(a3.order || 0) - Number(b3.order || 0)
    );
    const content = statistics.length ? b2`
          <div
            class="statistics-grid"
            style=${`--statistics-columns:${Math.max(
      1,
      Math.min(6, Number(section.columns) || 3)
    )}`}
          >
            ${statistics.map((item) => {
      const value = getEntityValue(
        this.hass,
        item.entity,
        item.attribute || null
      );
      const unit = item.unit !== void 0 ? item.unit : getEntityUnit(
        this.hass,
        item.entity
      );
      return b2`
                <div class="stat-tile ${item.size || ""}">
                  <div class="stat-header">
                    <span class="stat-label">
                      ${item.label || getEntityName(this.hass, item.entity)}
                    </span>

                    ${item.icon ? b2`
                          <ha-icon
                            icon=${item.icon}
                          ></ha-icon>
                        ` : A}
                  </div>

                  <div class="stat-value">
                    ${value}
                    ${unit ? b2`<span>${unit}</span>` : A}
                  </div>
                </div>
              `;
    })}
          </div>
        ` : b2`
          <div class="empty-message">
            ${this._t("card.messages.no_statistics")}
          </div>
        `;
    return this._renderSection(
      "statistics",
      section,
      content,
      "mdi:chart-box-outline"
    );
  }
  _cameraUrl(camera) {
    const refreshKey = camera.refresh_interval ? String(this._refreshCounter) : "";
    if (camera.url) {
      if (!refreshKey) {
        return camera.url;
      }
      const separator = camera.url.includes("?") ? "&" : "?";
      return `${camera.url}${separator}refresh=${refreshKey}`;
    }
    return getImageUrl(
      this.hass,
      camera.entity,
      refreshKey
    );
  }
  _renderCameras() {
    const section = this._config.sections.cameras;
    if (!section?.enabled) {
      return A;
    }
    const cameras = (this._config.cameras || []).filter((camera) => camera.enabled !== false);
    const content = cameras.length ? b2`
          <div
            class="cameras-grid"
            style=${`
              --camera-columns:${Math.max(
      1,
      Math.min(4, Number(section.columns) || 2)
    )};
              --camera-ratio:${this._config.appearance.camera_aspect_ratio || "16 / 9"};
            `}
          >
            ${cameras.map((camera, index) => {
      const url = this._cameraUrl(camera);
      const cameraName = camera.label || camera.name || getEntityName(this.hass, camera.entity);
      return b2`
                <div class="camera-tile">
                  ${url ? b2`
                        <img
                          class="camera-image"
                          src=${url}
                          alt=${cameraName}
                          loading="lazy"
                          @error=${() => {
        this._cameraError = {
          ...this._cameraError,
          [index]: true
        };
      }}
                          @load=${() => {
        if (this._cameraError[index]) {
          this._cameraError = {
            ...this._cameraError,
            [index]: false
          };
        }
      }}
                        >
                      ` : b2`
                        <div class="thumbnail-placeholder">
                          <ha-icon icon="mdi:cctv-off"></ha-icon>
                        </div>
                      `}

                  <div class="camera-caption">
                    <span>${cameraName}</span>

                    ${camera.entity ? b2`
                          <ha-icon
                            icon="mdi:video-outline"
                            title=${camera.entity}
                          ></ha-icon>
                        ` : A}
                  </div>

                  ${this._cameraError[index] ? b2`
                        <div class="empty-message">
                          ${this._t("card.messages.camera_unavailable")}
                        </div>
                      ` : A}
                </div>
              `;
    })}
          </div>
        ` : b2`
          <div class="empty-message">
            ${this._t("card.messages.no_cameras")}
          </div>
        `;
    return this._renderSection(
      "cameras",
      section,
      content,
      "mdi:cctv"
    );
  }
  /**
   * Wektorowa grafika śpiącej drukarki.
   */
  _renderSleepingPrinter() {
    const animation = this._config.appearance.animation !== false;
    return b2`
      <div class="offline-view">
        <svg
          class="sleeping-printer"
          viewBox="0 0 340 245"
          role="img"
          aria-label="Sleeping 3D printer"
        >
          <!-- Cień -->
          <ellipse
            cx="166"
            cy="220"
            rx="110"
            ry="9"
            fill="currentColor"
            opacity="0.10"
          />

          <!-- Obudowa -->
          <rect
            x="69"
            y="53"
            width="193"
            height="154"
            rx="13"
            fill="var(--secondary-background-color)"
            stroke="var(--primary-text-color)"
            stroke-opacity="0.5"
            stroke-width="4"
          />

          <!-- Okno komory -->
          <rect
            x="87"
            y="72"
            width="157"
            height="112"
            rx="5"
            fill="var(--printer-surface)"
            stroke="var(--printer-border)"
            stroke-width="3"
          />

          <!-- Drukowana platforma -->
          <path
            d="M113 159 H218"
            stroke="var(--printer-muted)"
            stroke-width="6"
            stroke-linecap="round"
          />

          <!-- Głowica -->
          <rect
            x="150"
            y="99"
            width="33"
            height="19"
            rx="4"
            fill="var(--printer-accent)"
            opacity="0.85"
          />

          <path
            d="M166 118 V133 L161 140"
            fill="none"
            stroke="var(--printer-accent)"
            stroke-width="4"
            stroke-linecap="round"
          />

          <!-- Nogi -->
          <path
            d="M94 207 V214 M237 207 V214"
            stroke="var(--primary-text-color)"
            stroke-width="5"
            stroke-linecap="round"
          />

          <!-- Panel -->
          <rect
            x="195"
            y="40"
            width="42"
            height="20"
            rx="5"
            fill="var(--secondary-background-color)"
            stroke="var(--printer-muted)"
            stroke-width="2"
          />

          <circle
            cx="216"
            cy="50"
            r="4"
            fill="var(--printer-accent)"
          />

          <!-- Zzz -->
          <g
            fill="var(--printer-accent)"
            font-family="sans-serif"
            font-weight="800"
            class=${animation ? "sleep-z" : ""}
          >
            <text x="260" y="89" font-size="27">Z</text>
            <text x="281" y="62" font-size="21">Z</text>
            <text x="301" y="39" font-size="16">Z</text>
          </g>

          <!-- Drobne detale -->
          <path
            d="M120 184 H214"
            stroke="var(--printer-border)"
            stroke-width="2"
          />
        </svg>

        <div class="offline-title">
          ${this._config.offline_message || this._t("card.offline.title")}
        </div>

        <div class="offline-description">
          ${this._config.offline_subtitle || this._t("card.offline.subtitle")}
        </div>
      </div>
    `;
  }
  render() {
    if (!this.hass || !this._config) {
      return A;
    }
    const offline = this._isOffline();
    return b2`
      <ha-card>
        <div class="${this._config.appearance.compact_mode ? "compact" : ""}">
          <div class="printer-card">
            ${this._renderHeader(offline)}

            ${offline ? this._renderSleepingPrinter() : b2`
                  ${this._renderJob()}

                  ${this._renderMainControls()}

                  ${this._actionError ? b2`
                        <div class="action-error" role="alert">
                          ${this._actionError}
                        </div>
                      ` : A}

                  ${this._renderQuickActions()}

                  ${this._renderStatistics()}

                  ${this._renderCameras()}
                `}
          </div>
        </div>
      </ha-card>
    `;
  }
};
customElements.define(
  "printer-control-card",
  PrinterControlCard
);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "printer-control-card",
  name: "3D Printer Control Card",
  description: "Configurable printer dashboard for Moonraker, Klipper and Home Assistant.",
  preview: true,
  documentationURL: "https://github.com/YOUR_GITHUB_USERNAME/3d-printer-control-card"
});

// src/index.js
console.info(
  "%c 3D PRINTER CONTROL CARD %c v0.2.0 ",
  "color: #ffffff; background: #039be5; font-weight: bold; padding: 4px;",
  "color: #039be5; font-weight: bold; padding: 4px;"
);
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
