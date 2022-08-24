(function () {
	'use strict';

	// MODULE: src/adapter/renderer.ts
	function getRendererByVNodeId(renderers, id) {
	  for (const r of renderers.values()) {
	    if (r.getVNodeById(id) !== null) return r;
	  }

	  return null;
	}

	// MODULE: src/shells/shared/utils.ts
	function debounce(callback, wait) {
	  let timeout = null;
	  return (...args) => {
	    const next = () => callback(...args);

	    clearTimeout(timeout);
	    timeout = setTimeout(next, wait);
	  };
	}
	function throttle(callback, wait) {
	  let running = false;
	  return (...args) => {
	    if (!running) {
	      callback(...args);
	      running = true;
	      setTimeout(() => {
	        running = false;
	        callback(...args);
	      }, wait);
	    }
	  };
	}
	function copyToClipboard(text) {
	  const dom = document.createElement("textarea");
	  dom.textContent = text;
	  document.body.appendChild(dom);
	  dom.select();
	  document.execCommand("copy");
	  dom.blur();
	  document.body.removeChild(dom);
	}

	// MODULE: src/adapter/adapter/picker.ts
	function createPicker(window, renderers, onHover, onStop) {
	  let picking = false;
	  let lastId = -1;
	  let lastTarget = null;

	  function clicker(e) {
	    e.preventDefault();
	    e.stopPropagation(); // eslint-disable-next-line @typescript-eslint/no-use-before-define

	    stop();
	  }

	  function listener(e) {
	    e.preventDefault();
	    e.stopPropagation();

	    if (picking && e.target != null && lastTarget !== e.target) {
	      let id = lastId;

	      for (const r of renderers.values()) {
	        id = r.findVNodeIdForDom(e.target);

	        if (id > -1 && lastId !== id) {
	          onHover(id);
	          break;
	        }
	      }

	      lastTarget = e.target;
	      lastId = id;
	    }
	  }

	  function onMouseEvent(e) {
	    e.preventDefault();
	    e.stopPropagation();
	  }

	  const onScroll = debounce(() => {
	    onHover(-1);
	    lastId = -1;
	    lastTarget = null;
	  }, 16);

	  function start() {
	    if (!picking) {
	      lastId = -1;
	      picking = true;
	      window.addEventListener("mousedown", onMouseEvent, true);
	      window.addEventListener("mousemove", listener, true);
	      window.addEventListener("mouseup", onMouseEvent, true);
	      window.addEventListener("click", clicker, true);
	      document.addEventListener("scroll", onScroll, true);
	    }
	  }

	  function stop() {
	    if (picking) {
	      lastId = -1;
	      picking = false;
	      onStop();
	      window.removeEventListener("mousedown", onMouseEvent, true);
	      window.removeEventListener("mousemove", listener, true);
	      window.removeEventListener("mouseup", onMouseEvent, true);
	      window.removeEventListener("click", clicker, true);
	      document.removeEventListener("scroll", onScroll);
	    }
	  }

	  return {
	    start,
	    stop
	  };
	}

	// MODULE: node_modules/preact/dist/preact.module.js
	var n$1,
	    u$1,
	    i$1,
	    t$2,
	    o$1,
	    r$1,
	    f$1 = {},
	    e$2 = [],
	    c$1 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;

	function s$3(n, l) {
	  for (var u in l) n[u] = l[u];

	  return n;
	}

	function a$1(n) {
	  var l = n.parentNode;
	  l && l.removeChild(n);
	}

	function v$1(n, l, u) {
	  var i,
	      t,
	      o,
	      r = arguments,
	      f = {};

	  for (o in l) "key" == o ? i = l[o] : "ref" == o ? t = l[o] : f[o] = l[o];

	  if (arguments.length > 3) for (u = [u], o = 3; o < arguments.length; o++) u.push(r[o]);
	  if (null != u && (f.children = u), "function" == typeof n && null != n.defaultProps) for (o in n.defaultProps) void 0 === f[o] && (f[o] = n.defaultProps[o]);
	  return h$1(n, f, i, t, null);
	}

	function h$1(l, u, i, t, o) {
	  var r = {
	    type: l,
	    props: u,
	    key: i,
	    ref: t,
	    __k: null,
	    __: null,
	    __b: 0,
	    __e: null,
	    __d: void 0,
	    __c: null,
	    __h: null,
	    constructor: void 0,
	    __v: null == o ? ++n$1.__v : o
	  };
	  return null != n$1.vnode && n$1.vnode(r), r;
	}

	function p(n) {
	  return n.children;
	}

	function d$1(n, l) {
	  this.props = n, this.context = l;
	}

	function _(n, l) {
	  if (null == l) return n.__ ? _(n.__, n.__.__k.indexOf(n) + 1) : null;

	  for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;

	  return "function" == typeof n.type ? _(n) : null;
	}

	function w(n) {
	  var l, u;

	  if (null != (n = n.__) && null != n.__c) {
	    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
	      n.__e = n.__c.base = u.__e;
	      break;
	    }

	    return w(n);
	  }
	}

	function k$1(l) {
	  (!l.__d && (l.__d = !0) && u$1.push(l) && !g$1.__r++ || t$2 !== n$1.debounceRendering) && ((t$2 = n$1.debounceRendering) || i$1)(g$1);
	}

	function g$1() {
	  for (var n; g$1.__r = u$1.length;) n = u$1.sort(function (n, l) {
	    return n.__v.__b - l.__v.__b;
	  }), u$1 = [], n.some(function (n) {
	    var l, u, i, t, o, r, f;
	    n.__d && (r = (o = (l = n).__v).__e, (f = l.__P) && (u = [], (i = s$3({}, o)).__v = o.__v + 1, t = $(f, o, i, l.__n, void 0 !== f.ownerSVGElement, null != o.__h ? [r] : null, u, null == r ? _(o) : r, o.__h), j$1(u, o), t != r && w(o)));
	  });
	}

	function m$2(n, l, u, i, t, o, r, c, s, v) {
	  var y,
	      d,
	      w,
	      k,
	      g,
	      m,
	      b,
	      A = i && i.__k || e$2,
	      P = A.length;

	  for (s == f$1 && (s = null != r ? r[0] : P ? _(i, 0) : null), u.__k = [], y = 0; y < l.length; y++) if (null != (k = u.__k[y] = null == (k = l[y]) || "boolean" == typeof k ? null : "string" == typeof k || "number" == typeof k ? h$1(null, k, null, null, k) : Array.isArray(k) ? h$1(p, {
	    children: k
	  }, null, null, null) : null != k.__e || null != k.__c ? h$1(k.type, k.props, k.key, null, k.__v) : k)) {
	    if (k.__ = u, k.__b = u.__b + 1, null === (w = A[y]) || w && k.key == w.key && k.type === w.type) A[y] = void 0;else for (d = 0; d < P; d++) {
	      if ((w = A[d]) && k.key == w.key && k.type === w.type) {
	        A[d] = void 0;
	        break;
	      }

	      w = null;
	    }
	    g = $(n, k, w = w || f$1, t, o, r, c, s, v), (d = k.ref) && w.ref != d && (b || (b = []), w.ref && b.push(w.ref, null, k), b.push(d, k.__c || g, k)), null != g ? (null == m && (m = g), s = x$1(n, k, w, A, r, g, s), v || "option" != u.type ? "function" == typeof u.type && (u.__d = s) : n.value = "") : s && w.__e == s && s.parentNode != n && (s = _(w));
	  }

	  if (u.__e = m, null != r && "function" != typeof u.type) for (y = r.length; y--;) null != r[y] && a$1(r[y]);

	  for (y = P; y--;) null != A[y] && L(A[y], A[y]);

	  if (b) for (y = 0; y < b.length; y++) I(b[y], b[++y], b[++y]);
	}

	function x$1(n, l, u, i, t, o, r) {
	  var f, e, c;
	  if (void 0 !== l.__d) f = l.__d, l.__d = void 0;else if (t == u || o != r || null == o.parentNode) n: if (null == r || r.parentNode !== n) n.appendChild(o), f = null;else {
	    for (e = r, c = 0; (e = e.nextSibling) && c < i.length; c += 2) if (e == o) break n;

	    n.insertBefore(o, r), f = r;
	  }
	  return void 0 !== f ? f : o.nextSibling;
	}

	function A(n, l, u, i, t) {
	  var o;

	  for (o in u) "children" === o || "key" === o || o in l || C(n, o, null, u[o], i);

	  for (o in l) t && "function" != typeof l[o] || "children" === o || "key" === o || "value" === o || "checked" === o || u[o] === l[o] || C(n, o, l[o], u[o], i);
	}

	function P(n, l, u) {
	  "-" === l[0] ? n.setProperty(l, u) : n[l] = null == u ? "" : "number" != typeof u || c$1.test(l) ? u : u + "px";
	}

	function C(n, l, u, i, t) {
	  var o, r, f;
	  if (t && "className" == l && (l = "class"), "style" === l) {
	    if ("string" == typeof u) n.style.cssText = u;else {
	      if ("string" == typeof i && (n.style.cssText = i = ""), i) for (l in i) u && l in u || P(n.style, l, "");
	      if (u) for (l in u) i && u[l] === i[l] || P(n.style, l, u[l]);
	    }
	  } else "o" === l[0] && "n" === l[1] ? (o = l !== (l = l.replace(/Capture$/, "")), (r = l.toLowerCase()) in n && (l = r), l = l.slice(2), n.l || (n.l = {}), n.l[l + o] = u, f = o ? N : z, u ? i || n.addEventListener(l, f, o) : n.removeEventListener(l, f, o)) : "list" !== l && "tagName" !== l && "form" !== l && "type" !== l && "size" !== l && "download" !== l && "href" !== l && !t && l in n ? n[l] = null == u ? "" : u : "function" != typeof u && "dangerouslySetInnerHTML" !== l && (l !== (l = l.replace(/xlink:?/, "")) ? null == u || !1 === u ? n.removeAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase()) : n.setAttributeNS("http://www.w3.org/1999/xlink", l.toLowerCase(), u) : null == u || !1 === u && !/^ar/.test(l) ? n.removeAttribute(l) : n.setAttribute(l, u));
	}

	function z(l) {
	  this.l[l.type + !1](n$1.event ? n$1.event(l) : l);
	}

	function N(l) {
	  this.l[l.type + !0](n$1.event ? n$1.event(l) : l);
	}

	function T(n, l, u) {
	  var i, t;

	  for (i = 0; i < n.__k.length; i++) (t = n.__k[i]) && (t.__ = n, t.__e && ("function" == typeof t.type && t.__k.length > 1 && T(t, l, u), l = x$1(u, t, t, n.__k, null, t.__e, l), "function" == typeof n.type && (n.__d = l)));
	}

	function $(l, u, i, t, o, r, f, e, c) {
	  var a,
	      v,
	      h,
	      y,
	      _,
	      w,
	      k,
	      g,
	      b,
	      x,
	      A,
	      P = u.type;

	  if (void 0 !== u.constructor) return null;
	  null != i.__h && (c = i.__h, e = u.__e = i.__e, u.__h = null, r = [e]), (a = n$1.__b) && a(u);

	  try {
	    n: if ("function" == typeof P) {
	      if (g = u.props, b = (a = P.contextType) && t[a.__c], x = a ? b ? b.props.value : a.__ : t, i.__c ? k = (v = u.__c = i.__c).__ = v.__E : ("prototype" in P && P.prototype.render ? u.__c = v = new P(g, x) : (u.__c = v = new d$1(g, x), v.constructor = P, v.render = M), b && b.sub(v), v.props = g, v.state || (v.state = {}), v.context = x, v.__n = t, h = v.__d = !0, v.__h = []), null == v.__s && (v.__s = v.state), null != P.getDerivedStateFromProps && (v.__s == v.state && (v.__s = s$3({}, v.__s)), s$3(v.__s, P.getDerivedStateFromProps(g, v.__s))), y = v.props, _ = v.state, h) null == P.getDerivedStateFromProps && null != v.componentWillMount && v.componentWillMount(), null != v.componentDidMount && v.__h.push(v.componentDidMount);else {
	        if (null == P.getDerivedStateFromProps && g !== y && null != v.componentWillReceiveProps && v.componentWillReceiveProps(g, x), !v.__e && null != v.shouldComponentUpdate && !1 === v.shouldComponentUpdate(g, v.__s, x) || u.__v === i.__v) {
	          v.props = g, v.state = v.__s, u.__v !== i.__v && (v.__d = !1), v.__v = u, u.__e = i.__e, u.__k = i.__k, v.__h.length && f.push(v), T(u, e, l);
	          break n;
	        }

	        null != v.componentWillUpdate && v.componentWillUpdate(g, v.__s, x), null != v.componentDidUpdate && v.__h.push(function () {
	          v.componentDidUpdate(y, _, w);
	        });
	      }
	      v.context = x, v.props = g, v.state = v.__s, (a = n$1.__r) && a(u), v.__d = !1, v.__v = u, v.__P = l, a = v.render(v.props, v.state, v.context), v.state = v.__s, null != v.getChildContext && (t = s$3(s$3({}, t), v.getChildContext())), h || null == v.getSnapshotBeforeUpdate || (w = v.getSnapshotBeforeUpdate(y, _)), A = null != a && a.type == p && null == a.key ? a.props.children : a, m$2(l, Array.isArray(A) ? A : [A], u, i, t, o, r, f, e, c), v.base = u.__e, u.__h = null, v.__h.length && f.push(v), k && (v.__E = v.__ = null), v.__e = !1;
	    } else null == r && u.__v === i.__v ? (u.__k = i.__k, u.__e = i.__e) : u.__e = H(i.__e, u, i, t, o, r, f, c);

	    (a = n$1.diffed) && a(u);
	  } catch (l) {
	    u.__v = null, (c || null != r) && (u.__e = e, u.__h = !!c, r[r.indexOf(e)] = null), n$1.__e(l, u, i);
	  }

	  return u.__e;
	}

	function j$1(l, u) {
	  n$1.__c && n$1.__c(u, l), l.some(function (u) {
	    try {
	      l = u.__h, u.__h = [], l.some(function (n) {
	        n.call(u);
	      });
	    } catch (l) {
	      n$1.__e(l, u.__v);
	    }
	  });
	}

	function H(n, l, u, i, t, o, r, c) {
	  var s,
	      a,
	      v,
	      h,
	      y,
	      p = u.props,
	      d = l.props;
	  if (t = "svg" === l.type || t, null != o) for (s = 0; s < o.length; s++) if (null != (a = o[s]) && ((null === l.type ? 3 === a.nodeType : a.localName === l.type) || n == a)) {
	    n = a, o[s] = null;
	    break;
	  }

	  if (null == n) {
	    if (null === l.type) return document.createTextNode(d);
	    n = t ? document.createElementNS("http://www.w3.org/2000/svg", l.type) : document.createElement(l.type, d.is && {
	      is: d.is
	    }), o = null, c = !1;
	  }

	  if (null === l.type) p === d || c && n.data === d || (n.data = d);else {
	    if (null != o && (o = e$2.slice.call(n.childNodes)), v = (p = u.props || f$1).dangerouslySetInnerHTML, h = d.dangerouslySetInnerHTML, !c) {
	      if (null != o) for (p = {}, y = 0; y < n.attributes.length; y++) p[n.attributes[y].name] = n.attributes[y].value;
	      (h || v) && (h && (v && h.__html == v.__html || h.__html === n.innerHTML) || (n.innerHTML = h && h.__html || ""));
	    }

	    A(n, d, p, t, c), h ? l.__k = [] : (s = l.props.children, m$2(n, Array.isArray(s) ? s : [s], l, u, i, "foreignObject" !== l.type && t, o, r, f$1, c)), c || ("value" in d && void 0 !== (s = d.value) && (s !== n.value || "progress" === l.type && !s) && C(n, "value", s, p.value, !1), "checked" in d && void 0 !== (s = d.checked) && s !== n.checked && C(n, "checked", s, p.checked, !1));
	  }
	  return n;
	}

	function I(l, u, i) {
	  try {
	    "function" == typeof l ? l(u) : l.current = u;
	  } catch (l) {
	    n$1.__e(l, i);
	  }
	}

	function L(l, u, i) {
	  var t, o, r;

	  if (n$1.unmount && n$1.unmount(l), (t = l.ref) && (t.current && t.current !== l.__e || I(t, null, u)), i || "function" == typeof l.type || (i = null != (o = l.__e)), l.__e = l.__d = void 0, null != (t = l.__c)) {
	    if (t.componentWillUnmount) try {
	      t.componentWillUnmount();
	    } catch (l) {
	      n$1.__e(l, u);
	    }
	    t.base = t.__P = null;
	  }

	  if (t = l.__k) for (r = 0; r < t.length; r++) t[r] && L(t[r], u, i);
	  null != o && a$1(o);
	}

	function M(n, l, u) {
	  return this.constructor(n, u);
	}

	function O(l, u, i) {
	  var t, r, c;
	  n$1.__ && n$1.__(l, u), r = (t = i === o$1) ? null : i && i.__k || u.__k, l = v$1(p, null, [l]), c = [], $(u, (t ? u : i || u).__k = l, r || f$1, f$1, void 0 !== u.ownerSVGElement, i && !t ? [i] : r ? null : u.childNodes.length ? e$2.slice.call(u.childNodes) : null, c, i || f$1, t), j$1(c, l);
	}

	function B(n, l) {
	  var u = {
	    __c: l = "__cC" + r$1++,
	    __: n,
	    Consumer: function (n, l) {
	      return n.children(l);
	    },
	    Provider: function (n, u, i) {
	      return this.getChildContext || (u = [], (i = {})[l] = this, this.getChildContext = function () {
	        return i;
	      }, this.shouldComponentUpdate = function (n) {
	        this.props.value !== n.value && u.some(k$1);
	      }, this.sub = function (n) {
	        u.push(n);
	        var l = n.componentWillUnmount;

	        n.componentWillUnmount = function () {
	          u.splice(u.indexOf(n), 1), l && l.call(n);
	        };
	      }), n.children;
	    }
	  };
	  return u.Provider.__ = u.Consumer.contextType = u;
	}

	n$1 = {
	  __e: function (n, l) {
	    for (var u, i, t, o = l.__h; l = l.__;) if ((u = l.__c) && !u.__) try {
	      if ((i = u.constructor) && null != i.getDerivedStateFromError && (u.setState(i.getDerivedStateFromError(n)), t = u.__d), null != u.componentDidCatch && (u.componentDidCatch(n), t = u.__d), t) return l.__h = o, u.__E = u;
	    } catch (l) {
	      n = l;
	    }

	    throw n;
	  },
	  __v: 0
	}, d$1.prototype.setState = function (n, l) {
	  var u;
	  u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s$3({}, this.state), "function" == typeof n && (n = n(s$3({}, u), this.props)), n && s$3(u, n), null != n && this.__v && (l && this.__h.push(l), k$1(this));
	}, d$1.prototype.forceUpdate = function (n) {
	  this.__v && (this.__e = !0, n && this.__h.push(n), k$1(this));
	}, d$1.prototype.render = p, u$1 = [], i$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, g$1.__r = 0, o$1 = f$1, r$1 = 0;

	// MODULE: src/constants.ts
	const DevtoolsToClient = "preact-devtools-to-client";
	const PageHookName = "preact-page-hook";
	var Status;

	(function (Status) {
	  Status["Disconnected"] = "disconnected";
	  Status["Connected"] = "connected";
	  Status["Pending"] = "pending";
	})(Status || (Status = {}));

	const PROFILE_RELOAD = "preact-devtools_profile-and-reload";
	const STATS_RELOAD = "preact-devtools_stats-and-reload";
	var NodeType;

	(function (NodeType) {
	  NodeType[NodeType["Element"] = 1] = "Element";
	  NodeType[NodeType["Text"] = 3] = "Text";
	  NodeType[NodeType["CData"] = 4] = "CData";
	  NodeType[NodeType["XMLProcessingInstruction"] = 7] = "XMLProcessingInstruction";
	  NodeType[NodeType["Comment"] = 8] = "Comment";
	  NodeType[NodeType["Document"] = 9] = "Document";
	  NodeType[NodeType["DocumentType"] = 10] = "DocumentType";
	  NodeType[NodeType["DocumentFragment"] = 11] = "DocumentFragment";
	})(NodeType || (NodeType = {}));

	// MODULE: src/adapter/dom.ts
	function getNearestElement(dom) {
	  return dom.nodeType === NodeType.Text ? dom.parentNode : dom;
	}
	function px2Int(input) {
	  return input ? +input.replace(/px/, "") : 0;
	}

	function getBoundsState(rect) {
	  return {
	    top: rect.top + window.pageYOffset < window.scrollY,
	    bottom: rect.top + rect.height > window.innerHeight + scrollY,
	    left: rect.left + window.pageXOffset < window.scrollX,
	    right: rect.left + rect.width > window.scrollX + window.innerWidth
	  };
	}

	function measureNode(dom) {
	  const s = window.getComputedStyle(dom);
	  const r = dom.getBoundingClientRect();
	  const top = r.top + window.pageYOffset;
	  const left = r.left + window.pageXOffset;
	  return {
	    top,
	    left,
	    bounds: getBoundsState(r),
	    boxSizing: s.boxSizing,
	    // Round to at most 2 decimals. This is not 100% accurate,
	    // but good enough for our use case
	    width: Math.round(r.width * 100) / 100,
	    height: Math.round(r.height * 100) / 100,
	    marginTop: px2Int(s.marginTop),
	    marginRight: px2Int(s.marginRight),
	    marginBottom: px2Int(s.marginBottom),
	    marginLeft: px2Int(s.marginLeft),
	    borderTop: px2Int(s.borderTopWidth),
	    borderRight: px2Int(s.borderRightWidth),
	    borderBottom: px2Int(s.borderBottomWidth),
	    borderLeft: px2Int(s.borderLeftWidth),
	    paddingTop: px2Int(s.paddingTop),
	    paddingRight: px2Int(s.paddingRight),
	    paddingBottom: px2Int(s.paddingBottom),
	    paddingLeft: px2Int(s.paddingLeft)
	  };
	}
	function mergeMeasure(a, b) {
	  const top = Math.min(a.top, b.top);
	  const left = Math.min(a.left, b.left);
	  const height = Math.max(a.top + a.height, b.top + b.height) - top;
	  const width = Math.max(a.left + a.width, b.left + b.width) - left;
	  return {
	    boxSizing: a.boxSizing,
	    top,
	    left,
	    bounds: getBoundsState({
	      height,
	      left,
	      top,
	      width
	    }),
	    width,
	    height,
	    // Reset all margins for combined nodes. There is no
	    // meaningful way to display them.
	    marginTop: 0,
	    marginRight: 0,
	    marginBottom: 0,
	    marginLeft: 0,
	    borderTop: 0,
	    borderRight: 0,
	    borderBottom: 0,
	    borderLeft: 0,
	    paddingTop: 0,
	    paddingRight: 0,
	    paddingBottom: 0,
	    paddingLeft: 0
	  };
	}

	// MODULE: node_modules/htm/dist/htm.module.js
	var n = function (t, s, r, e) {
	  var u;
	  s[0] = 0;

	  for (var h = 1; h < s.length; h++) {
	    var p = s[h++],
	        a = s[h] ? (s[0] |= p ? 1 : 2, r[s[h++]]) : s[++h];
	    3 === p ? e[0] = a : 4 === p ? e[1] = Object.assign(e[1] || {}, a) : 5 === p ? (e[1] = e[1] || {})[s[++h]] = a : 6 === p ? e[1][s[++h]] += a + "" : p ? (u = t.apply(a, n(t, a, r, ["", null])), e.push(u), a[0] ? s[0] |= 2 : (s[h - 2] = 0, s[h] = u)) : e.push(a);
	  }

	  return e;
	},
	    t$1 = new Map();

	function e$1 (s) {
	  var r = t$1.get(this);
	  return r || (r = new Map(), t$1.set(this, r)), (r = n(this, r.get(s) || (r.set(s, r = function (n) {
	    for (var t, s, r = 1, e = "", u = "", h = [0], p = function (n) {
	      1 === r && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, ""))) ? h.push(0, n, e) : 3 === r && (n || e) ? (h.push(3, n, e), r = 2) : 2 === r && "..." === e && n ? h.push(4, n, 0) : 2 === r && e && !n ? h.push(5, 0, !0, e) : r >= 5 && ((e || !n && 5 === r) && (h.push(r, 0, e, s), r = 6), n && (h.push(r, n, 0, s), r = 6)), e = "";
	    }, a = 0; a < n.length; a++) {
	      a && (1 === r && p(), p(a));

	      for (var l = 0; l < n[a].length; l++) t = n[a][l], 1 === r ? "<" === t ? (p(), h = [h], r = 3) : e += t : 4 === r ? "--" === e && ">" === t ? (r = 1, e = "") : e = t + e[0] : u ? t === u ? u = "" : e += t : '"' === t || "'" === t ? u = t : ">" === t ? (p(), r = 1) : r && ("=" === t ? (r = 5, s = e, e = "") : "/" === t && (r < 5 || ">" === n[a][l + 1]) ? (p(), 3 === r && (h = h[0]), r = h, (h = h[0]).push(2, 0, r), r = 0) : " " === t || "\t" === t || "\n" === t || "\r" === t ? (p(), r = 2) : e += t), 3 === r && "!--" === e && (r = 4, h = h[0]);
	    }

	    return p(), h;
	  }(s)), r), arguments, [])).length > 1 ? r : r[0];
	}

	// MODULE: node_modules/htm/preact/index.module.js
	var m$1 = e$1.bind(v$1);

	var s$2 = {"root":"Highlighter-module_root__2IWf3","content":"Highlighter-module_content__31vgH","border":"Highlighter-module_border__1zhjb","margin":"Highlighter-module_margin__3NR2g","label":"Highlighter-module_label__1WN1a","value":"Highlighter-module_value__TLDi2","footer":"Highlighter-module_footer__2oVNw","fixed":"Highlighter-module_fixed__2ebe8","fixedLeft":"Highlighter-module_fixedLeft__3457P","fixedTop":"Highlighter-module_fixedTop__19NJY","fixedRight":"Highlighter-module_fixedRight__29Rt7","fixedBottom":"Highlighter-module_fixedBottom__CHJaR","outerContainer":"Highlighter-module_outerContainer__3UQ3c"};

	// MODULE: src/view/components/Highlighter.tsx
	function css2Border(top, right, bottom, left) {
	  return `
		border-top-width: ${top}px;
		border-right-width: ${right}px;
		border-bottom-width: ${bottom}px;
		border-left-width: ${left}px;
	`;
	}
	const style = s$2;
	function Highlighter(props) {
	  const {
	    width,
	    height,
	    boxSizing,
	    top,
	    left,
	    bounds
	  } = props;
	  const isOutOfBounds = bounds.bottom || bounds.left || bounds.right || bounds.top;
	  return m$1`<div class=${s$2.root} data-testid="highlight" style=${`top: ${top}px; left: ${left}px;`}><div class=${s$2.margin} style=${`width: ${width}px; height: ${height}px; ${css2Border(props.marginTop, props.marginRight, props.marginBottom, props.marginLeft)}`}><div class=${s$2.border} style=${css2Border(props.borderTop, props.borderRight, props.borderBottom, props.borderLeft)}><div class=${s$2.content} style=${`${css2Border(props.paddingTop, props.paddingRight, props.paddingBottom, props.paddingLeft)} ${boxSizing === "content-box" ? `height: calc(100% - ${props.paddingTop + props.paddingBottom}px); width: calc(100% - ${props.paddingLeft + props.paddingRight}px);` : ""}`}/></div></div><span class=${`${s$2.footer} ${isOutOfBounds ? s$2.fixed : ""} ${bounds.left && !bounds.right ? s$2.fixedLeft : ""} ${bounds.right ? s$2.fixedRight : ""} ${bounds.top && !bounds.bottom ? s$2.fixedTop : ""}  ${bounds.bottom ? s$2.fixedBottom : ""}`}><span class=${s$2.label}>${props.label}</span> | <span class=${s$2.value}>${width}px</span> × <span class=${s$2.value}>${height}px</span></span></div>`;
	}

	// MODULE: src/adapter/adapter/highlight.ts
	/**
	 * This module is responsible for displaying the transparent element overlay
	 * inside the user's web page.
	 */

	function createHightlighter(getRendererByVnodeId) {
	  /**
	   * Reference to the DOM element that we'll render the selection highlighter
	   * into. We'll cache it so that we don't unnecessarily re-create it when the
	   * hover state changes. We only destroy this elment once the user stops
	   * hovering a node in the tree.
	   */
	  let highlightRef = null;

	  function destroyHighlight() {
	    if (highlightRef) {
	      document.body.removeChild(highlightRef);
	    }

	    highlightRef = null;
	  }

	  function highlight(id) {
	    const renderer = getRendererByVnodeId(id);

	    if (!renderer) {
	      return destroyHighlight();
	    }

	    const vnode = renderer.getVNodeById(id);

	    if (!vnode) {
	      return destroyHighlight();
	    }

	    const dom = renderer.findDomForVNode(id);

	    if (dom != null) {
	      if (highlightRef == null) {
	        highlightRef = document.createElement("div");
	        highlightRef.id = "preact-devtools-highlighter";
	        highlightRef.className = style.outerContainer;
	        document.body.appendChild(highlightRef);
	      } // eslint-disable-next-line prefer-const


	      let [first, last] = dom;
	      if (first === null) return;
	      const node = getNearestElement(first);
	      const nodeEnd = last ? getNearestElement(last) : null;

	      if (node != null) {
	        let label = renderer.getDisplayName(vnode); // Account for HOCs

	        const lastOpenIdx = label.lastIndexOf("(");
	        const firstCloseIdx = label.indexOf(")");

	        if (lastOpenIdx > -1 && lastOpenIdx < firstCloseIdx) {
	          label = label.slice(lastOpenIdx + 1, firstCloseIdx) || "Anonymous";
	        }

	        let size = measureNode(node);

	        if (nodeEnd !== null) {
	          const sizeLast = measureNode(nodeEnd);
	          size = mergeMeasure(size, sizeLast);
	        } // If the current DOM is inside an iframe, the position data
	        // is relative to the content inside the iframe. We need to
	        // add the position of the iframe in the parent document to
	        // display the highlight overlay at the correct place.


	        if (document !== first?.ownerDocument) {
	          let iframe;
	          const iframes = Array.from(document.querySelectorAll("iframe"));

	          for (let i = 0; i < iframes.length; i++) {
	            const w = iframes[i].contentWindow;

	            if (w && w.document === first?.ownerDocument) {
	              iframe = iframes[i];
	              break;
	            }
	          }

	          if (iframe) {
	            const sizeIframe = measureNode(iframe);
	            size.top += sizeIframe.top;
	            size.left += sizeIframe.left;
	          }
	        }

	        let height = size.height;
	        let width = size.width;

	        if (size.boxSizing === "border-box") {
	          height += size.marginTop + size.marginBottom;
	          width += size.marginLeft + size.marginRight;
	        }

	        O(v$1(Highlighter, {
	          label,
	          ...size,
	          top: size.top - size.marginTop,
	          left: size.left - size.marginLeft,
	          height,
	          width
	        }), highlightRef);
	      }
	    }
	  }

	  return {
	    highlight,
	    destroy: destroyHighlight
	  };
	}

	// MODULE: src/adapter/adapter/filter.ts
	const DEFAULT_FIlTERS = {
	  regex: [],
	  type: new Set(["dom", "fragment", "root", "hoc"])
	};
	function parseFilters(raw) {
	  const type = new Set();
	  if (raw.type.fragment) type.add("fragment");
	  if (raw.type.dom) type.add("dom");
	  if (raw.type.hoc) type.add("hoc");
	  if (raw.type.root) type.add("root");
	  return {
	    regex: raw.regex.filter(x => x.enabled).map(x => new RegExp(x.value, "gi")),
	    type
	  };
	}

	// MODULE: src/adapter/adapter/adapter.ts
	function createAdapter(port, profiler, renderers) {
	  const {
	    listen,
	    send
	  } = port;

	  const forAll = fn => {
	    for (const r of renderers.values()) {
	      fn(r);
	    }
	  };

	  const highlight = createHightlighter(id => getRendererByVNodeId(renderers, id));

	  const inspect = id => {
	    const data = getRendererByVNodeId(renderers, id)?.inspect(id);

	    if (data) {
	      send("inspect-result", data);
	    }
	  };

	  const picker = createPicker(window, renderers, id => {
	    highlight.highlight(id);

	    if (id > -1) {
	      inspect(id);
	      send("select-node", id);
	    }
	  }, () => {
	    send("stop-picker", null);
	    highlight.destroy();
	  });
	  listen("start-picker", () => picker.start());
	  listen("stop-picker", () => picker.stop());
	  listen("copy", value => {
	    try {
	      const data = JSON.stringify(value, null, 2);
	      copyToClipboard(data);
	    } catch (err) {
	      // eslint-disable-next-line no-console
	      console.log(err);
	    }
	  });
	  listen("inspect", id => {
	    if (id === null) return;
	    const res = getRendererByVNodeId(renderers, id)?.findDomForVNode(id);

	    if (res && res.length > 0) {
	      window.__PREACT_DEVTOOLS__.$0 = res[0];
	    }

	    inspect(id);
	  });
	  listen("log", e => {
	    getRendererByVNodeId(renderers, e.id)?.log(e.id, e.children);
	  });
	  listen("highlight", id => {
	    if (id == null) highlight.destroy();else highlight.highlight(id);
	  });
	  listen("disconnect", () => {
	    // The devtools disconnected, clear any stateful
	    // ui elements we may be displaying.
	    highlight.destroy();
	  });

	  const update = data => {
	    const {
	      id,
	      type,
	      path,
	      value
	    } = data;
	    getRendererByVNodeId(renderers, id)?.update(id, type, path.split(".").slice(1), value); // Notify all frontends that something changed

	    inspect(id);
	  };

	  listen("update-prop", data => update({ ...data,
	    type: "props"
	  }));
	  listen("update-state", data => update({ ...data,
	    type: "state"
	  }));
	  listen("update-context", data => update({ ...data,
	    type: "context"
	  }));
	  listen("update-hook", data => {
	    if (!data.meta) return;
	    getRendererByVNodeId(renderers, data.id)?.updateHook?.(data.id, data.meta.index, data.value);
	  });
	  listen("update-filter", data => {
	    const filters = parseFilters(data);
	    forAll(r => r.applyFilters(filters));
	  });
	  listen("refresh", () => forAll(r => r.refresh?.())); // Profiler

	  listen("start-profiling", options => {
	    profiler.isProfiling = true;
	    profiler.captureRenderReasons = !!options && !!options.captureRenderReasons;
	  });
	  listen("stop-profiling", () => {
	    profiler.isProfiling = false;
	  });
	  listen("reload-and-profile", options => {
	    window.localStorage.setItem(PROFILE_RELOAD, JSON.stringify(options));

	    try {
	      window.location.reload();
	    } catch (err) {
	      // eslint-disable-next-line no-console
	      console.error("Preact Devtools was not able to reload the current page."); // eslint-disable-next-line no-console

	      console.log(err);
	    }
	  }); // Stats

	  listen("start-stats-recording", () => {
	    profiler.recordStats = true;
	  });
	  listen("stop-stats-recording", () => {
	    profiler.recordStats = false;
	  });
	  listen("reload-and-record-stats", () => {
	    window.localStorage.setItem(STATS_RELOAD, "true");

	    try {
	      window.location.reload();
	    } catch (err) {
	      // eslint-disable-next-line no-console
	      console.error("Preact Devtools was not able to reload the current page."); // eslint-disable-next-line no-console

	      console.log(err);
	    }
	  });
	  listen("start-highlight-updates", () => {
	    profiler.highlightUpdates = true;
	  });
	  listen("stop-highlight-updates", () => {
	    profiler.highlightUpdates = false;
	    profiler.updateRects.clear();
	    profiler.pendingHighlightUpdates.clear();
	  });
	  listen("load-host-selection", () => {
	    const hook = window.__PREACT_DEVTOOLS__;
	    const selected = hook.$0;

	    if (selected) {
	      forAll(r => {
	        const id = r.findVNodeIdForDom(selected);

	        if (id > -1) {
	          send("select-node", id);
	        }
	      });
	    }
	  });
	  listen("view-source", id => {
	    const vnode = getRendererByVNodeId(renderers, id)?.getVNodeById(id);
	    const hook = window.__PREACT_DEVTOOLS__;

	    if (vnode && typeof vnode.type === "function") {
	      const {
	        type
	      } = vnode;
	      hook.$type = type && type.prototype && type.prototype.render ? type.prototype.render : type;
	    } else {
	      hook.$type = null;
	    }
	  });
	  listen("suspend", data => {
	    getRendererByVNodeId(renderers, data.id)?.suspend?.(data.id, data.active);
	  });
	}

	// MODULE: src/adapter/protocol/string-table.ts
	/**
	 * The string table holds a mapping of strings to ids. This saves a lot of space
	 * in messaging because we can only need to declare a string once and can later
	 * refer to its id. This is especially true for component or element names which
	 * expectedoccur multiple times.
	 */

	/**
	 * Convert a string to an id. Works similar to a gzip dictionary.
	 */
	function getStringId(table, input) {
	  if (input === null) return 0;

	  if (!table.has(input)) {
	    table.set("" + input, table.size + 1);
	  }

	  return table.get(input);
	} // TODO: Use a proper LRU cache?

	const encoded = new Map();

	const toCodePoint = s => s.codePointAt(0) || 124; // "|"" symbol;

	/**
	 * Convert a string to an array of codepoints
	 */


	function encode(input) {
	  if (!encoded.has(input)) {
	    encoded.set(input, input.split("").map(toCodePoint));
	  }

	  return encoded.get(input);
	}
	/**
	 * Convert string table to something the extension understands
	 * @param {import('./devtools').AdapterState["stringTable"]} table
	 * @returns {number[]}
	 */

	function flushTable(table) {
	  const ops = [0];
	  table.forEach((_, k) => {
	    ops[0] += k.length + 1;
	    ops.push(k.length, ...encode(k));
	  });
	  return ops;
	}

	// MODULE: src/view/components/profiler/data/commits.ts
	/**
	 * The Flamegraph supports these distinct
	 * view modes.
	 */

	var FlamegraphType;

	(function (FlamegraphType) {
	  FlamegraphType["FLAMEGRAPH"] = "FLAMEGRAPH";
	  FlamegraphType["RANKED"] = "RANKED";
	})(FlamegraphType || (FlamegraphType = {}));

	// MODULE: src/adapter/shared/utils.ts
	function traverse(vnode, fn, bindings) {
	  fn(vnode);
	  const children = bindings.getActualChildren(vnode);

	  for (let i = 0; i < children.length; i++) {
	    const child = children[i];

	    if (child != null) {
	      traverse(child, fn, bindings);
	      fn(child);
	    }
	  }
	} // eslint-disable-next-line @typescript-eslint/ban-types

	// MODULE: src/view/store/types.ts
	var DevNodeType;

	(function (DevNodeType) {
	  /**
	   * Groups are virtual nodes inserted by the devtools
	   * to make certain operations easier. They are not
	   * created by Preact.
	   */
	  DevNodeType[DevNodeType["Group"] = 0] = "Group";
	  DevNodeType[DevNodeType["Element"] = 1] = "Element";
	  DevNodeType[DevNodeType["ClassComponent"] = 2] = "ClassComponent";
	  DevNodeType[DevNodeType["FunctionComponent"] = 3] = "FunctionComponent";
	  DevNodeType[DevNodeType["ForwardRef"] = 4] = "ForwardRef";
	  DevNodeType[DevNodeType["Memo"] = 5] = "Memo";
	  DevNodeType[DevNodeType["Suspense"] = 6] = "Suspense";
	  DevNodeType[DevNodeType["Context"] = 7] = "Context";
	  DevNodeType[DevNodeType["Consumer"] = 8] = "Consumer";
	  DevNodeType[DevNodeType["Portal"] = 9] = "Portal";
	})(DevNodeType || (DevNodeType = {}));

	var Panel;

	(function (Panel) {
	  Panel["ELEMENTS"] = "ELEMENTS";
	  Panel["PROFILER"] = "PROFILER";
	  Panel["SETTINGS"] = "SETTINGS";
	  Panel["STATISTICS"] = "STATISTICS";
	})(Panel || (Panel = {}));

	// MODULE: src/adapter/shared/stats.ts
	var DiffType;

	(function (DiffType) {
	  DiffType[DiffType["UNKNOWN"] = 0] = "UNKNOWN";
	  DiffType[DiffType["KEYED"] = 1] = "KEYED";
	  DiffType[DiffType["UNKEYED"] = 2] = "UNKEYED";
	  DiffType[DiffType["MIXED"] = 3] = "MIXED";
	})(DiffType || (DiffType = {}));

	function getChildCountIdx(count) {
	  return count > 4 ? 4 : count;
	}

	function updateDiffStats(stats, diff, childCount) {
	  const idx = getChildCountIdx(childCount);

	  if (diff === DiffType.KEYED) {
	    stats.keyed[idx]++;
	  } else if (diff === DiffType.UNKEYED) {
	    stats.unkeyed[idx]++;
	  } else if (diff === DiffType.MIXED) {
	    stats.mixed[idx]++;
	  }
	}
	function updateOpStats(stats, kind, vnode, bindings) {
	  if (bindings.isComponent(vnode)) {
	    stats[kind].components++;
	  } else if (bindings.isElement(vnode)) {
	    stats[kind].elements++;
	  } else {
	    stats[kind].text++;
	  }
	} // TODO: store update depth

	function createStats() {
	  return {
	    roots: [0, 0, 0, 0, 0],
	    classComponents: [0, 0, 0, 0, 0],
	    functionComponents: [0, 0, 0, 0, 0],
	    fragments: [0, 0, 0, 0, 0],
	    forwardRef: [0, 0, 0, 0, 0],
	    memo: [0, 0, 0, 0, 0],
	    suspense: [0, 0, 0, 0, 0],
	    elements: [0, 0, 0, 0, 0],
	    text: 0,
	    keyed: [0, 0, 0, 0, 0],
	    unkeyed: [0, 0, 0, 0, 0],
	    mixed: [0, 0, 0, 0, 0],
	    mounts: {
	      components: 0,
	      elements: 0,
	      text: 0
	    },
	    unmounts: {
	      components: 0,
	      elements: 0,
	      text: 0
	    },
	    updates: {
	      components: 0,
	      elements: 0,
	      text: 0
	    },
	    singleChildType: {
	      roots: 0,
	      classComponents: 0,
	      functionComponents: 0,
	      fragments: 0,
	      forwardRef: 0,
	      memo: 0,
	      suspense: 0,
	      elements: 0,
	      text: 0
	    }
	  };
	}
	function stats2ops(stats) {
	  return [MsgTypes.COMMIT_STATS, ...stats.roots, ...stats.classComponents, ...stats.functionComponents, ...stats.fragments, ...stats.forwardRef, ...stats.memo, ...stats.suspense, ...stats.elements, stats.text, ...stats.keyed, ...stats.unkeyed, ...stats.mixed, stats.mounts.components, stats.mounts.elements, stats.mounts.text, stats.updates.components, stats.updates.elements, stats.updates.text, stats.unmounts.components, stats.unmounts.elements, stats.unmounts.text, // Single child types
	  stats.singleChildType.roots, stats.singleChildType.classComponents, stats.singleChildType.functionComponents, stats.singleChildType.fragments, stats.singleChildType.forwardRef, stats.singleChildType.memo, stats.singleChildType.suspense, stats.singleChildType.elements, stats.singleChildType.text];
	}
	function getDiffType(child, prev) {
	  if (prev !== DiffType.MIXED) {
	    if (child.key != null) {
	      return prev === DiffType.UNKNOWN || prev === DiffType.KEYED ? DiffType.KEYED : DiffType.MIXED;
	    } else {
	      return prev === DiffType.UNKNOWN || prev === DiffType.UNKEYED ? DiffType.UNKEYED : DiffType.MIXED;
	    }
	  }

	  return prev;
	}
	function recordComponentStats(config, bindings, stats, vnode, children) {
	  const childrenLen = children.length;
	  const idx = getChildCountIdx(childrenLen);

	  if (bindings.isComponent(vnode)) {
	    if (vnode.type === config.Fragment) {
	      stats.fragments[idx]++;
	    } else if (vnode.type.prototype && vnode.type.prototype.render) {
	      stats.classComponents[idx]++;
	    } else {
	      stats.functionComponents[idx]++;
	    }
	  } else if (bindings.isElement(vnode)) {
	    stats.elements[idx]++;
	  } else {
	    stats.text++;
	  }

	  const devType = getDevtoolsType(vnode, bindings);

	  switch (devType) {
	    case DevNodeType.ForwardRef:
	      stats.forwardRef[idx]++;
	      break;

	    case DevNodeType.Memo:
	      stats.memo[idx]++;
	      break;

	    case DevNodeType.Suspense:
	      stats.suspense[idx]++;
	      break;
	  }

	  if (childrenLen === 1) {
	    const child = children[0];

	    if (child != null) {
	      if (typeof child.type === "function") {
	        if (child.type.prototype && child.type.prototype.render) {
	          stats.singleChildType.classComponents++;
	        } else {
	          if (child.type === config.Fragment) {
	            stats.singleChildType.fragments++;
	          } else {
	            const childType = getDevtoolsType(child, bindings);

	            switch (childType) {
	              case DevNodeType.ForwardRef:
	                stats.singleChildType.forwardRef++;
	                break;

	              case DevNodeType.Memo:
	                stats.singleChildType.memo++;
	                break;

	              case DevNodeType.Suspense:
	                stats.singleChildType.suspense++;
	                break;
	            }
	          }

	          stats.singleChildType.functionComponents++;
	        }
	      } else if (child.type !== null) {
	        stats.singleChildType.elements++;
	      } else {
	        stats.singleChildType.text++;
	      }
	    }
	  }
	}

	// MODULE: src/adapter/protocol/events.ts
	var MsgTypes;

	(function (MsgTypes) {
	  MsgTypes[MsgTypes["ADD_ROOT"] = 1] = "ADD_ROOT";
	  MsgTypes[MsgTypes["ADD_VNODE"] = 2] = "ADD_VNODE";
	  MsgTypes[MsgTypes["REMOVE_VNODE"] = 3] = "REMOVE_VNODE";
	  MsgTypes[MsgTypes["UPDATE_VNODE_TIMINGS"] = 4] = "UPDATE_VNODE_TIMINGS";
	  MsgTypes[MsgTypes["REORDER_CHILDREN"] = 5] = "REORDER_CHILDREN";
	  MsgTypes[MsgTypes["RENDER_REASON"] = 6] = "RENDER_REASON";
	  MsgTypes[MsgTypes["COMMIT_STATS"] = 7] = "COMMIT_STATS";
	  MsgTypes[MsgTypes["HOC_NODES"] = 8] = "HOC_NODES";
	})(MsgTypes || (MsgTypes = {}));
	/**
	 * Collect all relevant data from a commit and convert it to a message
	 * the detools can understand
	 */


	function flush(commit) {
	  const {
	    rootId,
	    unmountIds,
	    operations,
	    strings,
	    stats
	  } = commit;
	  if (unmountIds.length === 0 && operations.length === 0) return;
	  const msg = [rootId, ...flushTable(strings)];

	  if (unmountIds.length > 0) {
	    msg.push(MsgTypes.REMOVE_VNODE, unmountIds.length, ...unmountIds);
	  }

	  msg.push(...operations);

	  if (stats !== null) {
	    msg.push(...stats2ops(stats));
	  }

	  return {
	    type: "operation_v2",
	    data: msg
	  };
	}

	// MODULE: node_modules/preact/hooks/dist/hooks.module.js
	var t,
	    u,
	    r,
	    o = 0,
	    i = [],
	    c = n$1.__b,
	    f = n$1.__r,
	    e = n$1.diffed,
	    a = n$1.__c,
	    v = n$1.unmount;

	function m(t, r) {
	  n$1.__h && n$1.__h(u, t, o || r), o = 0;
	  var i = u.__H || (u.__H = {
	    __: [],
	    __h: []
	  });
	  return t >= i.__.length && i.__.push({}), i.__[t];
	}

	function h(r, o) {
	  var i = m(t++, 4);
	  !n$1.__s && k(i.__H, o) && (i.__ = r, i.__H = o, u.__h.push(i));
	}

	function s$1(n) {
	  return o = 5, d(function () {
	    return {
	      current: n
	    };
	  }, []);
	}

	function d(n, u) {
	  var r = m(t++, 7);
	  return k(r.__H, u) && (r.__ = n(), r.__H = u, r.__h = n), r.__;
	}

	function F(n) {
	  var r = u.context[n.__c],
	      o = m(t++, 9);
	  return o.__c = n, r ? (null == o.__ && (o.__ = !0, r.sub(u)), r.props.value) : n.__;
	}

	function x() {
	  i.forEach(function (t) {
	    if (t.__P) try {
	      t.__H.__h.forEach(g), t.__H.__h.forEach(j), t.__H.__h = [];
	    } catch (u) {
	      t.__H.__h = [], n$1.__e(u, t.__v);
	    }
	  }), i = [];
	}

	n$1.__b = function (n) {
	  u = null, c && c(n);
	}, n$1.__r = function (n) {
	  f && f(n), t = 0;
	  var r = (u = n.__c).__H;
	  r && (r.__h.forEach(g), r.__h.forEach(j), r.__h = []);
	}, n$1.diffed = function (t) {
	  e && e(t);
	  var o = t.__c;
	  o && o.__H && o.__H.__h.length && (1 !== i.push(o) && r === n$1.requestAnimationFrame || ((r = n$1.requestAnimationFrame) || function (n) {
	    var t,
	        u = function () {
	      clearTimeout(r), b && cancelAnimationFrame(t), setTimeout(n);
	    },
	        r = setTimeout(u, 100);

	    b && (t = requestAnimationFrame(u));
	  })(x)), u = void 0;
	}, n$1.__c = function (t, u) {
	  u.some(function (t) {
	    try {
	      t.__h.forEach(g), t.__h = t.__h.filter(function (n) {
	        return !n.__ || j(n);
	      });
	    } catch (r) {
	      u.some(function (n) {
	        n.__h && (n.__h = []);
	      }), u = [], n$1.__e(r, t.__v);
	    }
	  }), a && a(t, u);
	}, n$1.unmount = function (t) {
	  v && v(t);
	  var u = t.__c;
	  if (u && u.__H) try {
	    u.__H.__.forEach(g);
	  } catch (t) {
	    n$1.__e(t, u.__v);
	  }
	};
	var b = "function" == typeof requestAnimationFrame;

	function g(n) {
	  var t = u;
	  "function" == typeof n.__c && n.__c(), u = t;
	}

	function j(n) {
	  var t = u;
	  n.__c = n.__(), u = t;
	}

	function k(n, t) {
	  return !n || n.length !== t.length || t.some(function (t, u) {
	    return t !== n[u];
	  });
	}

	// MODULE: src/view/store/react-bindings.ts
	// reference is not the same and won't trigger any "resize" (and likely
	// other) events at all.

	const WindowCtx = B(null);
	B(null);
	B(() => null);

	// MODULE: src/view/components/utils.ts
	function useResize(fn, args, init = false) {
	  // If we're running inside the browser extension context
	  // we pull the correct window reference from context. And
	  // yes there are multiple `window` objects to keep track of.
	  // If you subscribe to the wrong one, nothing will be
	  // triggered. For testing scenarios we can fall back to
	  // the global window object instead.
	  const win = F(WindowCtx) || window;
	  h(() => {
	    if (init) fn();
	    const fn2 = throttle(fn, 60);
	    win.addEventListener("resize", fn2);
	    return () => {
	      win.removeEventListener("resize", fn2);
	    };
	  }, [...args, init]);
	}

	var s = {"root":"CanvasHighlight-module_root__l0I57"};

	// MODULE: src/view/components/CanvasHighlight/CanvasHighlight.tsx
	function CanvasHighlight() {
	  const ref = s$1();
	  useResize(() => {
	    if (ref.current) {
	      ref.current.width = window.innerWidth;
	      ref.current.height = window.innerHeight;
	    }
	  }, []);
	  return m$1`<canvas class=${s.root} ref=${ref} width=${window.innerWidth} height=${window.innerHeight}/>`;
	}

	// MODULE: src/adapter/adapter/highlightUpdates.ts
	const DISPLAY_DURATION = 250;
	const MAX_DISPLAY_DURATION = 3000;
	const OUTLINE_COLOR = "#f0f0f0";
	const COLORS = ["#37afa9", "#63b19e", "#80b393", "#97b488", "#abb67d", "#beb771", "#cfb965", "#dfba57", "#efbb49", "#febc38"];
	function measureUpdate(updates, dom) {
	  const data = updates.get(dom);
	  const rect = dom.getBoundingClientRect();
	  const now = performance.now();
	  const expirationTime = data ? Math.min(now + MAX_DISPLAY_DURATION, data.expirationTime + DISPLAY_DURATION) : now + DISPLAY_DURATION;
	  updates.set(dom, {
	    expirationTime,
	    height: rect.height,
	    width: rect.width,
	    x: rect.x,
	    y: rect.y,
	    count: data ? data.count + 1 : 1
	  });
	}
	function drawRect(ctx, data) {
	  const colorIndex = Math.min(COLORS.length - 1, data.count - 1); // Outline

	  ctx.lineWidth = 1;
	  ctx.strokeStyle = OUTLINE_COLOR;
	  ctx.strokeRect(data.x - 1, data.y - 1, data.width + 2, data.height + 2); // Inset

	  ctx.lineWidth = 1;
	  ctx.strokeStyle = OUTLINE_COLOR;
	  ctx.strokeRect(data.x + 1, data.y + 1, data.width - 2, data.height - 2); // Border

	  ctx.strokeStyle = COLORS[colorIndex];
	  ctx.lineWidth = 1;
	  ctx.strokeRect(data.x, data.y, data.width, data.height);
	}
	let timer;
	let container = null;
	let canvas = null;
	function destroyCanvas() {
	  if (container) {
	    O(null, container);
	    container.remove();
	    container = null;
	    canvas = null;
	  }
	}

	function draw(updates) {
	  if (!canvas || !canvas.getContext) return;
	  if (timer) clearTimeout(timer);
	  const ctx = canvas.getContext("2d");
	  if (!ctx) return;
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  const now = performance.now();
	  let nextRedraw = Number.MAX_SAFE_INTEGER;
	  updates.forEach((data, key) => {
	    if (data.expirationTime < now) {
	      updates.delete(key);
	    } else {
	      drawRect(ctx, data);
	      nextRedraw = Math.min(nextRedraw, data.expirationTime);
	    }
	  });

	  if (nextRedraw !== Number.MAX_SAFE_INTEGER) {
	    timer = setTimeout(() => draw(updates), nextRedraw - now);
	  } else {
	    destroyCanvas();
	  }
	}

	function startDrawing(updateRects) {
	  if (!canvas) {
	    container = document.createElement("div");
	    container.id = "preact-devtools-highlight-updates";
	    document.body.appendChild(container);
	    O(v$1(CanvasHighlight, null), container);
	    canvas = container.querySelector("canvas");
	  }

	  draw(updateRects);
	}

	// MODULE: src/adapter/shared/serialize.ts
	function serializeVNode(x, config, bindings) {
	  if (bindings.isVNode(x)) {
	    return {
	      type: "vnode",
	      name: bindings.getPropsVNodeDisplayName(x, config)
	    };
	  }

	  return null;
	}
	function jsonify(data, getVNode, seen) {
	  // Break out of circular references
	  if (seen.has(data)) {
	    return "[[Circular]]";
	  }

	  if (data !== null && typeof data === "object") {
	    seen.add(data);
	  }

	  if (typeof Element !== "undefined" && data instanceof Element) {
	    return {
	      type: "html",
	      name: `<${data.localName} />`
	    };
	  }

	  const vnode = getVNode(data);
	  if (vnode != null) return vnode;

	  if (Array.isArray(data)) {
	    return data.map(x => jsonify(x, getVNode, seen));
	  }

	  switch (typeof data) {
	    case "string":
	      return data.length > 300 ? data.slice(300) : data;

	    case "function":
	      {
	        return {
	          type: "function",
	          name: data.displayName || data.name || "anonymous"
	        };
	      }

	    case "symbol":
	      {
	        return {
	          type: "symbol",
	          name: data.toString()
	        };
	      }

	    case "object":
	      {
	        if (data === null) return null;else if (data instanceof window.Blob) {
	          return {
	            type: "blob",
	            name: "Blob"
	          };
	        } else if (data instanceof Set) {
	          return {
	            type: "set",
	            name: "Set",
	            entries: Array.from(data.values()).map(item => jsonify(item, getVNode, seen))
	          };
	        } else if (data instanceof Map) {
	          return {
	            type: "map",
	            name: "Map",
	            entries: Array.from(data.entries()).map(entry => {
	              return [jsonify(entry[0], getVNode, seen), jsonify(entry[1], getVNode, seen)];
	            })
	          };
	        }
	        const out = { ...data
	        };
	        Object.keys(out).forEach(key => {
	          out[key] = jsonify(out[key], getVNode, seen);
	        });
	        return out;
	      }

	    default:
	      return data;
	  }
	}
	function isEditable(x) {
	  switch (typeof x) {
	    case "string":
	    case "number":
	    case "boolean":
	      return true;

	    default:
	      return false;
	  }
	}

	function clone(value) {
	  if (Array.isArray(value)) return value.slice();

	  if (value !== null && typeof value === "object") {
	    if (value instanceof Set) return new Set(value);
	    if (value instanceof Map) return new Map(value);
	    return { ...value
	    };
	  }

	  return value;
	}
	/**
	 * Deeply set a property and clone all parent objects/arrays
	 */


	function setInCopy(obj, path, value, idx = 0) {
	  if (idx >= path.length) return value;
	  const updated = clone(obj);

	  if (obj instanceof Set) {
	    const oldValue = Array.from(obj)[+path[idx]];
	    updated.delete(oldValue);
	    updated.add(setInCopy(oldValue, path, value, idx + 1));
	  } else if (obj instanceof Map) {
	    const oldEntry = Array.from(obj)[+path[idx]];
	    const isKey = +path[idx + 1] === 0;

	    if (isKey) {
	      updated.delete(oldEntry[0]);
	      updated.set(setInCopy(oldEntry[0], path, value, idx + 2), oldEntry[1]);
	    } else {
	      updated.delete(oldEntry[0]);
	      updated.set(oldEntry[0], setInCopy(oldEntry[1], path, value, idx + 2));
	    }
	  } else {
	    const key = path[idx];
	    updated[key] = setInCopy(obj[key], path, value, idx + 1);
	  }

	  return updated;
	}
	function serialize(config, bindings, data) {
	  return jsonify(data, node => serializeVNode(node, config, bindings), new Set());
	}
	/**
	 * Deeply mutate a property by walking down an array of property keys
	 */

	function setIn(obj, path, value) {
	  const last = path.pop();
	  const parent = path.reduce((acc, attr) => acc ? acc[attr] : null, obj);

	  if (parent && last) {
	    parent[last] = value;
	  }
	}

	function cleanProps(props) {
	  if (typeof props === "string" || !props) return null;
	  const out = {};

	  for (const key in props) {
	    if (key === "__source" || key === "__self") continue;
	    out[key] = props[key];
	  }

	  if (!Object.keys(out).length) return null;
	  return out;
	}
	const reg = /__cC\d+/;
	function cleanContext(context) {
	  const res = {};

	  for (const key in context) {
	    if (reg.test(key)) continue;
	    res[key] = context[key];
	  }

	  if (Object.keys(res).length == 0) return null;
	  return res;
	}

	// MODULE: src/adapter/shared/idMapper.ts
	function createIdMappingState(initial, getInstance) {
	  return {
	    instToId: new Map(),
	    idToVNode: new Map(),
	    idToInst: new Map(),
	    nextId: initial,
	    getInstance
	  };
	}
	function getVNodeById(state, id) {
	  return state.idToVNode.get(id) || null;
	}
	function hasVNodeId(state, vnode) {
	  return vnode != null && state.instToId.has(state.getInstance(vnode));
	}
	function getVNodeId(state, vnode) {
	  if (vnode == null) return -1;
	  const inst = state.getInstance(vnode);
	  return state.instToId.get(inst) || -1;
	}
	function getOrCreateVNodeId(state, vnode) {
	  const id = getVNodeId(state, vnode);
	  if (id !== -1) return id;
	  return createVNodeId(state, vnode);
	}
	function updateVNodeId(state, id, vnode) {
	  const inst = state.getInstance(vnode);
	  state.idToInst.set(id, inst);
	  state.idToVNode.set(id, vnode);
	}
	function removeVNodeId(state, vnode) {
	  if (hasVNodeId(state, vnode)) {
	    const id = getVNodeId(state, vnode);
	    state.idToInst.delete(id);
	    state.idToVNode.delete(id);
	  }

	  const inst = state.getInstance(vnode);
	  state.instToId.delete(inst);
	}
	function createVNodeId(state, vnode) {
	  const id = state.nextId++;
	  const inst = state.getInstance(vnode);
	  state.instToId.set(inst, id);
	  state.idToInst.set(id, inst);
	  state.idToVNode.set(id, vnode);
	  return id;
	}

	// MODULE: src/adapter/shared/traverse.ts

	function getHocName(name) {
	  const idx = name.indexOf("(");
	  if (idx === -1) return null;
	  const wrapper = name.slice(0, idx);
	  return wrapper ? wrapper : null;
	}

	function addHocs(commit, id, hocs) {
	  if (hocs.length > 0) {
	    commit.operations.push(MsgTypes.HOC_NODES, id, hocs.length);

	    for (let i = 0; i < hocs.length; i++) {
	      const stringId = getStringId(commit.strings, hocs[i]);
	      commit.operations.push(stringId);
	    }
	  }
	}

	function detectHocs(commit, name, id, hocs) {
	  const hocName = getHocName(name);

	  if (name.startsWith("ForwardRef")) {
	    const idx = name.indexOf("(");
	    name = name.slice(idx + 1, -1) || "Anonymous";
	    addHocs(commit, id, hocs);
	    hocs = [];
	  } else {
	    if (hocName) {
	      hocs = [...hocs, hocName];
	    } else {
	      addHocs(commit, id, hocs);
	      hocs = [];
	    }
	  }

	  return {
	    name,
	    hocs
	  };
	}

	function isTextNode(dom) {
	  return dom != null && dom.nodeType === NodeType.Text;
	}

	function updateHighlight(profiler, vnode, bindings) {
	  if (profiler.highlightUpdates && bindings.isComponent(vnode)) {
	    const stack = [vnode];
	    let item;
	    let dom;

	    while ((item = stack.shift()) !== undefined) {
	      // Account for placholders/holes
	      if (item === null) continue;

	      if (!bindings.isComponent(item)) {
	        dom = bindings.getDom(item);
	        break;
	      }

	      stack.push(...bindings.getActualChildren(item));
	    }

	    if (dom === null || dom === undefined) return;

	    if (isTextNode(dom)) {
	      dom = dom.parentNode;
	    }

	    if (dom && !profiler.pendingHighlightUpdates.has(dom)) {
	      profiler.pendingHighlightUpdates.add(dom);
	      measureUpdate(profiler.updateRects, dom);
	    }
	  }
	}

	function getFilteredChildren(vnode, filters, config, helpers) {
	  const children = helpers.getActualChildren(vnode);
	  const stack = children.slice();
	  const out = [];
	  let child;

	  while (stack.length) {
	    child = stack.pop();

	    if (child != null) {
	      if (!shouldFilter(child, filters, config, helpers)) {
	        out.push(child);
	      } else {
	        const nextChildren = helpers.getActualChildren(child);

	        if (nextChildren.length > 0) {
	          stack.push(...nextChildren.slice());
	        }
	      }
	    }
	  }

	  return out.reverse();
	}
	function shouldFilter(vnode, filters, config, bindings) {
	  // Filter text nodes by default. They are too tricky to match
	  // with the previous one...
	  if (bindings.isTextVNode(vnode)) {
	    return true;
	  } // TODO: Add a virtual root node to be able to filter the actual
	  // ones. Currently we have a workaround on the extension side
	  // that filters it there, but we should really do it here to be
	  // consistent with all other filters.


	  if (vnode.type === config.Fragment && filters.type.has("fragment")) {
	    const parent = bindings.getVNodeParent(vnode); // Only filter non-root nodes

	    if (parent != null) return true;
	    return false;
	  } else if (bindings.isElement(vnode) && filters.type.has("dom")) {
	    return true;
	  } else if (filters.type.has("hoc")) {
	    const name = bindings.getDisplayName(vnode, config);

	    if (name.indexOf("(") > -1 && !name.startsWith("ForwardRef")) {
	      return true;
	    }
	  }

	  if (filters.regex.length > 0) {
	    const name = bindings.getDisplayName(vnode, config);
	    return filters.regex.some(r => {
	      // Regexes with a global flag are stateful in JS :((
	      r.lastIndex = 0;
	      return r.test(name);
	    });
	  } // In Preact V11 we use a Portal component to render Suspense
	  // children. Because that is only an implementation detail
	  // we'll hide this component to avoid confusing users.


	  const parent = bindings.getVNodeParent(vnode);

	  if (parent !== null && bindings.isSuspenseVNode(parent) && bindings.isPortal(vnode)) {
	    return true;
	  }

	  return false;
	}

	function mount(ids, commit, owners, vnode, ownerId, ancestorId, filters, domCache, config, profiler, hocs, bindings, timingsByVNode, renderReasonPre) {
	  if (commit.stats !== null) {
	    updateOpStats(commit.stats, "mounts", vnode, bindings);
	  }

	  const root = bindings.isRoot(vnode, config);
	  const skip = shouldFilter(vnode, filters, config, bindings);
	  let name = bindings.getDisplayName(vnode, config);

	  if (filters.type.has("hoc")) {
	    const hocName = getHocName(name);

	    if (hocName) {
	      hocs = [...hocs, hocName];

	      if (name.startsWith("ForwardRef")) {
	        const idx = name.indexOf("(");
	        name = name.slice(idx + 1, -1) || "Anonymous";
	      }
	    }
	  }

	  if (root || !skip) {
	    const id = getOrCreateVNodeId(ids, vnode);

	    if (root) {
	      commit.operations.push(MsgTypes.ADD_ROOT, id);
	    }

	    if (!root) {
	      const maybeOwner = owners.get(vnode);

	      if (maybeOwner !== undefined && !bindings.isRoot(maybeOwner, config)) {
	        const maybeOwnerId = getVNodeId(ids, maybeOwner);
	        ownerId = maybeOwnerId !== -1 ? maybeOwnerId : ownerId;
	      }
	    }

	    commit.operations.push(MsgTypes.ADD_VNODE, id, getDevtoolsType(vnode, bindings), // Type
	    ancestorId, ownerId, getStringId(commit.strings, name), vnode.key ? getStringId(commit.strings, vnode.key) : 0, // Multiply, because operations array only supports integers
	    // and would otherwise cut off floats
	    (timingsByVNode.start.get(vnode) || 0) * 1000, (timingsByVNode.end.get(vnode) || 0) * 1000);

	    if (ownerId === -1 && !root) {
	      ownerId = id;
	    }

	    if (hocs.length > 0) {
	      addHocs(commit, id, hocs);
	      hocs = [];
	      ownerId = id;
	    } // Capture render reason (mount here)


	    if (profiler.isProfiling && profiler.captureRenderReasons) {
	      commit.operations.push(MsgTypes.RENDER_REASON, id, 1
	      /* MOUNT */
	      , 0);
	    }

	    updateHighlight(profiler, vnode, bindings);
	    ancestorId = id;
	  }

	  if (skip && !bindings.isComponent(vnode)) {
	    const dom = bindings.getDom(vnode);
	    if (dom) domCache.set(dom, vnode);
	  }

	  let diff = DiffType.UNKNOWN;
	  let childCount = 0;
	  const children = bindings.getActualChildren(vnode);

	  for (let i = 0; i < children.length; i++) {
	    const child = children[i];

	    if (child != null) {
	      if (commit.stats !== null) {
	        diff = getDiffType(child, diff);
	        childCount++;
	      }

	      mount(ids, commit, owners, child, ownerId, ancestorId, filters, domCache, config, profiler, hocs, bindings, timingsByVNode);
	    }
	  }

	  if (commit.stats !== null) {
	    updateDiffStats(commit.stats, diff, childCount);
	    recordComponentStats(config, bindings, commit.stats, vnode, children);
	  }
	}

	function resetChildren(commit, ids, id, vnode, filters, config, helpers) {
	  const children = helpers.getActualChildren(vnode);
	  if (!children.length) return;
	  const next = getFilteredChildren(vnode, filters, config, helpers); // Suspense internals mutate child outside of the standard render cycle.
	  // This leads to stale children on the devtools ends. To work around that
	  // We'll always reset the children of a Suspense vnode.

	  let forceReorder = false;

	  if (helpers.isSuspenseVNode(vnode)) {
	    forceReorder = true;
	  }

	  if (!forceReorder && next.length < 2) return;
	  commit.operations.push(MsgTypes.REORDER_CHILDREN, id, next.length, ...next.map(x => getVNodeId(ids, x)));
	}

	function update(ids, commit, owners, vnode, ownerId, ancestorId, filters, domCache, config, profiler, hocs, bindings, timingsByVNode, renderReasonPre) {
	  if (commit.stats !== null) {
	    updateOpStats(commit.stats, "updates", vnode, bindings);
	  }

	  let diff = DiffType.UNKNOWN;
	  const skip = shouldFilter(vnode, filters, config, bindings);

	  if (skip) {
	    const id = getVNodeId(ids, vnode);

	    if (filters.type.has("hoc")) {
	      const name = bindings.getDisplayName(vnode, config);
	      const res = detectHocs(commit, name, id, hocs);
	      hocs = res.hocs;
	    }

	    let childCount = 0;
	    const children = bindings.getActualChildren(vnode);

	    for (let i = 0; i < children.length; i++) {
	      const child = children[i];

	      if (child != null) {
	        if (commit.stats !== null) {
	          diff = getDiffType(child, diff);
	          childCount++;
	        }

	        update(ids, commit, owners, child, ownerId, ancestorId, filters, domCache, config, profiler, hocs, bindings, timingsByVNode, renderReasonPre);
	      }
	    }

	    if (commit.stats !== null) {
	      updateDiffStats(commit.stats, diff, childCount);
	      recordComponentStats(config, bindings, commit.stats, vnode, children);
	    }

	    return;
	  }

	  if (!hasVNodeId(ids, vnode)) {
	    mount(ids, commit, owners, vnode, ownerId, ancestorId, filters, domCache, config, profiler, hocs, bindings, timingsByVNode);
	    return;
	  }

	  const id = getVNodeId(ids, vnode);
	  const oldVNode = getVNodeById(ids, id);
	  updateVNodeId(ids, id, vnode);
	  const didRender = timingsByVNode.end.has(vnode);

	  if (!didRender) {
	    return;
	  }

	  const name = bindings.getDisplayName(vnode, config);

	  if (filters.type.has("hoc")) {
	    const res = detectHocs(commit, name, id, hocs);
	    hocs = res.hocs;
	  }

	  commit.operations.push(MsgTypes.UPDATE_VNODE_TIMINGS, id, (timingsByVNode.start.get(vnode) || 0) * 1000, (timingsByVNode.end.get(vnode) || 0) * 1000);

	  if (profiler.isProfiling && profiler.captureRenderReasons) {
	    const reason = renderReasonPre !== null ? renderReasonPre.get(vnode) || null : bindings.getRenderReasonPost(ids, bindings, timingsByVNode, oldVNode, vnode);

	    if (reason !== null) {
	      const count = reason.items ? reason.items.length : 0;
	      commit.operations.push(MsgTypes.RENDER_REASON, id, reason.type, count);

	      if (reason.items && count > 0) {
	        commit.operations.push(...reason.items.map(str => getStringId(commit.strings, str)));
	      }
	    }
	  }

	  updateHighlight(profiler, vnode, bindings);
	  const oldChildren = oldVNode ? bindings.getActualChildren(oldVNode).map(v => v && getVNodeId(ids, v)) : [];
	  let shouldReorder = false;
	  let childCount = 0;
	  const children = bindings.getActualChildren(vnode);

	  for (let i = 0; i < children.length; i++) {
	    const child = children[i];

	    if (child == null) {
	      const oldChildId = oldChildren[i];

	      if (oldChildId != null) {
	        commit.unmountIds.push(oldChildId);
	      }
	    } else if (hasVNodeId(ids, child) || shouldFilter(child, filters, config, bindings)) {
	      if (commit.stats !== null) {
	        diff = getDiffType(child, diff);
	        childCount++;
	      }

	      update(ids, commit, owners, child, ownerId, id, filters, domCache, config, profiler, hocs, bindings, timingsByVNode, renderReasonPre); // TODO: This is only sometimes necessary

	      shouldReorder = true;
	    } else {
	      if (commit.stats !== null) {
	        diff = getDiffType(child, diff);
	        childCount++;
	      }

	      mount(ids, commit, owners, child, ownerId, id, filters, domCache, config, profiler, hocs, bindings, timingsByVNode);
	      shouldReorder = true;
	    }
	  }

	  if (commit.stats !== null) {
	    updateDiffStats(commit.stats, diff, childCount);
	    recordComponentStats(config, bindings, commit.stats, vnode, children);
	  }

	  if (shouldReorder) {
	    resetChildren(commit, ids, id, vnode, filters, config, bindings);
	  }
	}
	/**
	 * Crawl upwards through potentially filtered vnodes until
	 * we find a non-filtered node or reach the top of the tree
	 */


	function findClosestNonFilteredParent(ids, helpers, vnode) {
	  let parentId = -1;
	  let parent = helpers.getVNodeParent(vnode);

	  while (parent !== null) {
	    parentId = getVNodeId(ids, parent);

	    if (parentId !== -1) {
	      break;
	    }

	    parent = helpers.getVNodeParent(parent);
	  }

	  return parentId;
	}

	function createCommit(ids, roots, owners, vnode, filters, domCache, config, profiler, helpers, timingsByVNode, renderReasonPre) {
	  const commit = {
	    operations: [],
	    rootId: -1,
	    strings: new Map(),
	    unmountIds: [],
	    renderReasons: new Map(),
	    stats: profiler.recordStats ? createStats() : null
	  };
	  let parentId = -1; // Roots have no known ownerId

	  let ownerId = -1;
	  const isNew = !hasVNodeId(ids, vnode);

	  if (helpers.isRoot(vnode, config)) {
	    if (commit.stats !== null) {
	      const childrenLen = helpers.getActualChildren(vnode).length;
	      commit.stats.roots[childrenLen > 4 ? 4 : childrenLen]++;
	    }

	    parentId = -1;
	    roots.add(vnode);
	  } else {
	    parentId = findClosestNonFilteredParent(ids, helpers, vnode);

	    if (!isNew) {
	      ownerId = shouldFilter(vnode, filters, config, helpers) ? parentId : getVNodeId(ids, vnode);
	    }
	  }

	  if (isNew) {
	    mount(ids, commit, owners, vnode, ownerId, parentId, filters, domCache, config, profiler, [], helpers, timingsByVNode);
	  } else {
	    update(ids, commit, owners, vnode, ownerId, parentId, filters, domCache, config, profiler, [], helpers, timingsByVNode, renderReasonPre);
	  }

	  let rootId = getVNodeId(ids, vnode);

	  if (rootId === -1) {
	    rootId = findClosestNonFilteredParent(ids, helpers, vnode);
	  }

	  commit.rootId = rootId;
	  return commit;
	}

	// MODULE: node_modules/errorstacks/dist/esm/index.js
	function createRawFrame(raw) {
	  return {
	    column: -1,
	    fileName: "",
	    line: -1,
	    name: "",
	    raw: raw,
	    sourceColumn: -1,
	    sourceFileName: "",
	    sourceLine: -1,
	    type: ""
	  };
	}

	var FIREFOX = /([^@]+|^)@(.*):(\d+):(\d+)/;

	function parseFirefox(lines) {
	  return lines.map(function (str) {
	    var match = str.match(FIREFOX);

	    if (!match) {
	      return createRawFrame(str);
	    }

	    var line = match[3] ? +match[3] : -1;
	    var column = match[4] ? +match[4] : -1;
	    var fileName = match[2] ? match[2] : "";
	    return {
	      line: line,
	      column: column,
	      type: match[0] ? "" : "native",
	      fileName: fileName,
	      name: (match[1] || "").trim(),
	      raw: str,
	      sourceColumn: -1,
	      sourceFileName: "",
	      sourceLine: -1
	    };
	  });
	}

	var CHROME_MAPPED = /(.*?):(\d+):(\d+)(\s<-\s(.+):(\d+):(\d+))?/;

	function parseMapped(frame, maybeMapped) {
	  var match = maybeMapped.match(CHROME_MAPPED);

	  if (match) {
	    frame.fileName = match[1];
	    frame.line = +match[2];
	    frame.column = +match[3];
	    if (match[5]) frame.sourceFileName = match[5];
	    if (match[6]) frame.sourceLine = +match[6];
	    if (match[7]) frame.sourceColumn = +match[7];
	  }
	}

	var CHROME_IE_NATIVE_NO_LINE = /^at\s(<.*>)$/;
	var CHROME_IE_NATIVE = /^\s*at\s(<.*>):(\d+):(\d+)$/;
	var CHROME_IE_FUNCTION = /^at\s(.*)\s\((.*)\)$/;
	var CHROME_IE_DETECTOR = /\s*at\s.+/;

	function parseChromeIe(lines) {
	  // Many frameworks mess with error.stack. So we use this check
	  // to find the first line of the actual stack
	  var start = lines.findIndex(function (line) {
	    return CHROME_IE_DETECTOR.test(line);
	  });

	  if (start === -1) {
	    return [];
	  }

	  var frames = [];

	  for (var i = start; i < lines.length; i++) {
	    var str = lines[i].replace(/^\s+|\s+$/g, "");
	    var frame = createRawFrame(lines[i]);
	    var nativeNoLine = str.match(CHROME_IE_NATIVE_NO_LINE);

	    if (nativeNoLine) {
	      frame.fileName = nativeNoLine[1];
	      frame.type = "native";
	      frames.push(frame);
	      continue;
	    }

	    var native = str.match(CHROME_IE_NATIVE);

	    if (native) {
	      frame.fileName = native[1];
	      frame.type = "native";
	      if (native[2]) frame.line = +native[2];
	      if (native[3]) frame.column = +native[3];
	      frames.push(frame);
	      continue;
	    }

	    var withFn = str.match(CHROME_IE_FUNCTION);

	    if (withFn) {
	      frame.name = withFn[1];
	      parseMapped(frame, withFn[2]);
	      frames.push(frame);
	      continue;
	    }

	    frames.push(frame);
	  }

	  return frames;
	}

	function parseStackTrace(stack) {
	  var lines = stack.split("\n").filter(Boolean); // Libraries like node's "assert" module mess with the stack trace by
	  // prepending custom data. So we need to do a precheck, to determine
	  // which browser the trace is coming from.

	  if (lines.some(function (line) {
	    return CHROME_IE_DETECTOR.test(line);
	  })) {
	    return parseChromeIe(lines);
	  }

	  return parseFirefox(lines);
	}

	// MODULE: src/view/components/sidebar/inspect/parseProps.ts
	function parseProps(data, path, limit, depth = 0, name = path, out = new Map()) {
	  if (depth >= limit) {
	    out.set(path, {
	      depth,
	      name,
	      id: path,
	      type: "string",
	      editable: false,
	      value: "…",
	      children: [],
	      meta: null
	    });
	    return out;
	  }

	  if (Array.isArray(data)) {
	    const children = [];
	    out.set(path, {
	      depth,
	      name,
	      id: path,
	      type: "array",
	      editable: false,
	      value: data,
	      children,
	      meta: null
	    });
	    data.forEach((item, i) => {
	      const childPath = `${path}.${i}`;
	      children.push(childPath);
	      parseProps(item, childPath, limit, depth + 1, "" + i, out);
	    });
	  } else if (typeof data === "object") {
	    if (data === null) {
	      out.set(path, {
	        depth,
	        name,
	        id: path,
	        type: "null",
	        editable: false,
	        value: data,
	        children: [],
	        meta: null
	      });
	    } else {
	      const keys = Object.keys(data);
	      const maybeCustom = keys.length === 2;
	      const maybeCollection = keys.length === 3; // Functions are encoded as objects

	      if (maybeCustom && typeof data.name === "string" && data.type === "function") {
	        out.set(path, {
	          depth,
	          name,
	          id: path,
	          type: "function",
	          editable: false,
	          value: data,
	          children: [],
	          meta: null
	        });
	      } else if ( // Same for vnodes
	      maybeCustom && typeof data.name === "string" && data.type === "vnode") {
	        out.set(path, {
	          depth,
	          name,
	          id: path,
	          type: "vnode",
	          editable: false,
	          value: data,
	          children: [],
	          meta: null
	        });
	      } else if ( // Same for Set + Map
	      maybeCollection && typeof data.name === "string" && data.type === "set") {
	        const children = [];
	        const node = {
	          depth,
	          name,
	          id: path,
	          type: "set",
	          editable: false,
	          value: data,
	          children,
	          meta: null
	        };
	        data.entries.forEach((item, i) => {
	          const childPath = `${path}.${i}`;
	          children.push(childPath);
	          parseProps(item, childPath, limit, depth + 1, "" + i, out);
	        });
	        out.set(path, node);
	      } else if ( // Same for Map
	      maybeCollection && typeof data.name === "string" && data.type === "map") {
	        const children = [];
	        const node = {
	          depth,
	          name,
	          id: path,
	          type: "map",
	          editable: false,
	          value: data,
	          children,
	          meta: null
	        };
	        data.entries.forEach((item, i) => {
	          const childPath = `${path}.${i}`;
	          children.push(childPath);
	          parseProps(item, childPath, limit, depth + 1, "" + i, out);
	        });
	        out.set(path, node);
	      } else if ( // Same for Blobs
	      maybeCustom && typeof data.name === "string" && data.type === "blob") {
	        out.set(path, {
	          depth,
	          name,
	          id: path,
	          type: "blob",
	          editable: false,
	          value: data,
	          children: [],
	          meta: null
	        });
	      } else if ( // Same for Symbols
	      maybeCustom && typeof data.name === "string" && data.type === "symbol") {
	        out.set(path, {
	          depth,
	          name,
	          id: path,
	          type: "symbol",
	          editable: false,
	          value: data,
	          children: [],
	          meta: null
	        });
	      } else if ( // Same for HTML elements
	      maybeCustom && typeof data.name === "string" && data.type === "html") {
	        out.set(path, {
	          depth,
	          name,
	          id: path,
	          type: "html",
	          editable: false,
	          value: data,
	          children: [],
	          meta: null
	        });
	      } else {
	        const node = {
	          depth,
	          name,
	          id: path,
	          type: "object",
	          editable: false,
	          value: data,
	          children: [],
	          meta: null
	        };
	        out.set(path, node);
	        Object.keys(data).forEach(key => {
	          const nextPath = `${path}.${key}`;
	          node.children.push(nextPath);
	          parseProps(data[key], nextPath, limit, depth + 1, key, out);
	        });
	        out.set(path, node);
	      }
	    }
	  } else {
	    const type = typeof data;
	    out.set(path, {
	      depth,
	      name,
	      id: path,
	      type: type,
	      editable: type !== "undefined" && data !== "[[Circular]]",
	      value: data,
	      children: [],
	      meta: null
	    });
	  }

	  return out;
	}

	// MODULE: src/adapter/shared/hooks.ts
	var HookType;

	(function (HookType) {
	  HookType[HookType["useState"] = 1] = "useState";
	  HookType[HookType["useReducer"] = 2] = "useReducer";
	  HookType[HookType["useEffect"] = 3] = "useEffect";
	  HookType[HookType["useLayoutEffect"] = 4] = "useLayoutEffect";
	  HookType[HookType["useRef"] = 5] = "useRef";
	  HookType[HookType["useImperativeHandle"] = 6] = "useImperativeHandle";
	  HookType[HookType["useMemo"] = 7] = "useMemo";
	  HookType[HookType["useCallback"] = 8] = "useCallback";
	  HookType[HookType["useContext"] = 9] = "useContext";
	  HookType[HookType["useErrorBoundary"] = 10] = "useErrorBoundary";
	  HookType[HookType["useDebugValue"] = 11] = "useDebugValue";
	  HookType[HookType["custom"] = 99] = "custom";
	  HookType[HookType["devtoolsParent"] = 9999] = "devtoolsParent";
	})(HookType || (HookType = {}));

	let hookLog = [];
	let inspectingHooks = false;
	let ancestorName = "unknown";
	const debugValues = new Map();
	let debugNames = [];
	function addHookName(name) {
	  if (!inspectingHooks) return;
	  debugNames.push(String(name));
	}
	function addDebugValue(value) {
	  if (!inspectingHooks) return;
	  const last = hookLog.pop();
	  const location = last.stack.reverse().slice(0, -1).map(x => x.name === "root" ? x.name : `${x.location}.${x.name}`).join(".");
	  debugValues.set(location, value);
	}
	let ignoreNext = false;
	function addHookStack(type) {
	  if (!inspectingHooks || ignoreNext) {
	    ignoreNext = false;
	    return;
	  } // Ignore next useState call coming from useErrorBoundary


	  if (type === HookType.useErrorBoundary) {
	    ignoreNext = true;
	  } // By default browser limit stack trace length to 10 entries


	  const oldLimit = Error.stackTraceLimit;
	  Error.stackTraceLimit = 1000;
	  const err = new Error();
	  let stack = err.stack ? parseStackTrace(err.stack) : [];
	  const ancestorIdx = stack.findIndex(x => x.name === ancestorName);

	  if (ancestorIdx > -1 && stack.length > 0) {
	    // Remove `addHookStack` + `options._hook` + `getHookState` from stack
	    let trim = type === HookType.useDebugValue ? 2 : 3; // These hooks are implemented with other hooks

	    if (type === HookType.useState || type === HookType.useImperativeHandle || type === HookType.useCallback || type === HookType.useRef) {
	      trim += 1;
	    }

	    stack = stack.slice(trim, ancestorIdx);
	  }

	  const normalized = []; // To easy mappings we'll rotate all positional data.

	  for (let i = 0; i < stack.length; i++) {
	    if (i === stack.length - 1) {
	      normalized.push({
	        name: "root",
	        location: "root"
	      });
	      continue;
	    }

	    const frame = stack[i];
	    const next = stack[i + 1];
	    normalized.push({
	      name: frame.name,
	      location: `${next.fileName.replace(window.origin, "")}:${next.line}:${next.column}`
	    });
	  }

	  hookLog.push({
	    type,
	    stack: normalized
	  }); // Restore original stack trace limit

	  Error.stackTraceLimit = oldLimit;
	}
	function parseHookData(config, data, vnode, userHookNames, bindings) {
	  const tree = new Map();
	  const root = {
	    children: [],
	    depth: 0,
	    name: "root",
	    editable: false,
	    id: "root",
	    type: "object",
	    value: null,
	    meta: null
	  };
	  tree.set("root", root);
	  const out = [root];
	  data.forEach((hook, hookIdx) => {
	    const type = HookType[hook.type];
	    let parentId = "root";

	    for (let i = hook.stack.length - 2; i >= 0; i--) {
	      const frame = hook.stack[i];
	      const isNative = i === 0;
	      const id = `${parentId}.${frame.location}.${frame.name}`;

	      if (!tree.has(id)) {
	        let value = "__preact_empty__";
	        let editable = false;
	        let children = [];
	        let nodeType = "undefined";
	        const depth = hook.stack.length - i - 1;
	        let name = isNative ? type : frame.name;

	        if (userHookNames.length > 0 && (hook.type === HookType.useState || hook.type === HookType.useRef || hook.type === HookType.useMemo || hook.type === HookType.useReducer)) {
	          name = `${name} ${userHookNames.pop()}`;
	        }

	        if (debugValues.has(id)) {
	          value = serialize(config, bindings, debugValues.get(id));
	        }

	        let hookValueTree = [];

	        if (isNative) {
	          const s = bindings.getHookState(vnode, hookIdx, hook.type);
	          const rawValue = Array.isArray(s) ? s[0] : s;
	          value = serialize(config, bindings, rawValue); // The user should be able to click through the value
	          // properties if the value is an object. We parse it
	          // separately and append it as children to our hook node

	          if (typeof rawValue === "object" && !(rawValue instanceof Element)) {
	            const tree = parseProps(value, id, 7, 0, name);
	            children = tree.get(id).children;
	            hookValueTree = Array.from(tree.values());

	            if (hookValueTree.length > 1) {
	              hookValueTree = hookValueTree.slice(1);
	            }

	            nodeType = hookValueTree[0].type;
	            hookValueTree.forEach(node => {
	              node.id = id + node.id;
	              node.editable = false;
	              node.depth += depth;
	            });
	          }

	          editable = (hook.type === HookType.useState || hook.type === HookType.useReducer) && isEditable(rawValue);
	        }

	        const item = {
	          children,
	          depth,
	          editable,
	          id,
	          name,
	          type: nodeType,
	          meta: isNative ? {
	            index: hookIdx,
	            type
	          } : frame.name,
	          value
	        };
	        tree.set(id, item);
	        out.push(item);

	        if (tree.has(parentId)) {
	          tree.get(parentId).children.push(id);
	        }

	        if (hookValueTree.length) {
	          hookValueTree.forEach(v => {
	            tree.set(v.id, v);
	            out.push(v);
	          });
	        }
	      }

	      parentId = id;
	    }
	  });
	  return out;
	}
	function inspectHooks(config, options, vnode, helpers) {
	  inspectingHooks = true;
	  hookLog = [];
	  debugValues.clear();
	  debugNames = [];
	  ancestorName = parseStackTrace(new Error().stack)[0].name;
	  const c = helpers.getComponent(vnode);
	  const isClass = vnode.type.prototype && vnode.type.prototype.render; // Disable hook effects

	  options._skipEffects = options.__s = true;
	  const prevConsole = {}; // Temporarily disable all console methods to not confuse users
	  // It sucks that we need to do this :/

	  for (const method in console) {
	    try {
	      prevConsole[method] = console[method];

	      console[method] = () => undefined;
	    } catch (error) {// Ignore errors here
	    }
	  }

	  let pendingValues = null;
	  let statefulHooks = null;

	  try {
	    // Call render on a dummy component, so that any possible
	    // state changes or effect are not written to our original
	    // component.
	    const hooks = helpers.getComponentHooks(vnode);
	    if (hooks === null) return [];
	    statefulHooks = helpers.getStatefulHooks(vnode);

	    if (statefulHooks !== null) {
	      pendingValues = statefulHooks.map(s => helpers.getPendingHookValue(s));
	    }

	    const dummy = {
	      props: c.props,
	      context: c.context,
	      state: {},
	      __hooks: hooks,
	      __H: hooks,
	      __v: null
	    }; // Force preact to reset internal hooks index

	    const renderHook = options.__r || options._render;

	    if (renderHook) {
	      const dummyVNode = v$1("div", null); // Note: A "div" normally won't have the _component property set,
	      // but we can get away with that for the devtools
	      // This is only needed for Preact 10.x

	      dummyVNode._component = dummy;
	      dummyVNode.__c = dummy;
	      dummy.__v = dummyVNode; // Preact V11 for hook names

	      dummyVNode.data = {
	        __hooks: hooks,
	        __H: hooks
	      };
	      renderHook(dummyVNode, null);
	    }

	    if (isClass) {
	      c.render.call(dummy, dummy.props, dummy.state);
	    } else {
	      // Preact V11 doesn't create classes anymore
	      if (c.constructor === Object) {
	        vnode.type.call(dummy, dummy.props, dummy.context);
	      } else {
	        c.constructor.call(dummy, dummy.props, dummy.context);
	      }
	    }
	  } catch (error) {// We don't care about any errors here. We only need
	    // the hook call sites
	  } finally {
	    // Restore hook state
	    if (pendingValues !== null && statefulHooks !== null) {
	      pendingValues.forEach((original, i) => {
	        if (original !== undefined) {
	          helpers.setPendingHookValue(statefulHooks[i], original);
	        }
	      });
	    } // Restore original console


	    for (const method in prevConsole) {
	      try {
	        console[method] = prevConsole[method];
	      } catch (error) {// Ignore errors
	      }
	    }

	    options._skipEffects = options.__s = false;
	  }

	  const parsed = hookLog.length ? parseHookData(config, hookLog, vnode, [...debugNames].reverse(), helpers) : null;
	  debugNames = [];
	  inspectingHooks = false;
	  ancestorName = "unknown";
	  hookLog = [];
	  return parsed;
	}

	// MODULE: src/adapter/shared/inspectVNode.ts
	/**
	 * Serialize all properties/attributes of a `VNode` like `props`, `context`,
	 * `hooks`, and other data. This data will be requested when the user selects a
	 * `VNode` in the devtools. It returning information will be displayed in the
	 * sidebar.
	 */

	function inspectVNode(ids, config, bindings, options, id, supportsHooks) {
	  const vnode = getVNodeById(ids, id);
	  if (!vnode) return null;
	  const c = bindings.getComponent(vnode);
	  const hasState = bindings.isComponent(vnode) && c != null && typeof c.state === "object" && c.state != null && Object.keys(c.state).length > 0;
	  const hasHooks = c != null && bindings.getComponentHooks(vnode) != null;
	  const hooks = supportsHooks && hasHooks ? inspectHooks(config, options, vnode, bindings) : null;
	  const context = c != null ? serialize(config, bindings, cleanContext(c.context)) : null;
	  const props = vnode.type !== null ? serialize(config, bindings, cleanProps(vnode.props)) : null;
	  const state = hasState ? serialize(config, bindings, c.state) : null;
	  let suspended = false;
	  let canSuspend = false;
	  let item = vnode;

	  while (item) {
	    if (bindings.isSuspenseVNode(item)) {
	      canSuspend = true;
	      const res = bindings.getSuspendedState(item);

	      if (res !== null) {
	        suspended = res;
	      }

	      break;
	    }

	    item = bindings.getVNodeParent(item);
	  }

	  return {
	    context,
	    canSuspend,
	    key: vnode.key || null,
	    hooks: supportsHooks ? hooks : !supportsHooks && hasHooks ? [] : null,
	    id,
	    name: bindings.getDisplayName(vnode, config),
	    props,
	    state,
	    // TODO: We're not using this information anywhere yet
	    type: getDevtoolsType(vnode, bindings),
	    suspended
	  };
	}

	// MODULE: src/adapter/shared/renderReasons.ts
	function createReason(type, items) {
	  return {
	    type,
	    items
	  };
	}
	/**
	 * Get all keys that have differnt values in two objects. Does a
	 * shallow comparison.
	 */

	function getChangedKeys(a, b) {
	  const changed = [];
	  let key;

	  for (key in a) {
	    if (!(key in b) || a[key] !== b[key]) {
	      changed.push(key);
	    }
	  }

	  for (key in b) {
	    if (!(key in a)) {
	      changed.push(key);
	    }
	  }

	  return changed;
	}

	// MODULE: src/adapter/10/renderReason.ts
	/**
	 * Detect why a VNode updated.
	 */

	function getRenderReasonPost(ids, bindings, timings, old, next) {
	  if (old === null) {
	    return next !== null ? createReason(1
	    /* MOUNT */
	    , null) : null;
	  } else if (next === null) {
	    return null;
	  } // Components
	  else if (typeof old.type === "function" && old.type === next.type) {
	      const c = bindings.getComponent(next);

	      if (c !== null) {
	        // Check hooks
	        const hooks = bindings.getStatefulHooks(next);

	        if (hooks !== null) {
	          for (let i = 0; i < hooks.length; i++) {
	            if (bindings.isUseReducerOrState(hooks[i]) && hooks[i]._oldValue !== bindings.getStatefulHookValue(hooks[i])) {
	              return createReason(5
	              /* HOOKS_CHANGED */
	              , null);
	            }
	          }
	        } // Check state


	        const prevState = c._prevState;

	        if (prevState != null && prevState !== c.state) {
	          return createReason(4
	          /* STATE_CHANGED */
	          , getChangedKeys(prevState, c.state));
	        } else if (prevState === undefined && c.state !== undefined && Object.keys(c.state).length > 0) {
	          return createReason(4
	          /* STATE_CHANGED */
	          , null);
	        }
	      }
	    } // Check props


	  if (old.props !== next.props) {
	    const propsChanged = getChangedKeys(old.props, next.props);

	    if (propsChanged.length > 0) {
	      return createReason(3
	      /* PROPS_CHANGED */
	      , propsChanged);
	    }
	  }

	  const parent = bindings.getVNodeParent(next);

	  if (parent != null && (timings.start.get(next) || 0) >= (timings.start.get(parent) || 0) && (timings.end.get(next) || 0) <= (timings.end.get(parent) || 0)) {
	    return createReason(2
	    /* PARENT_UPDATE */
	    , null);
	  }

	  return createReason(6
	  /* FORCE_UPDATE */
	  , null);
	}

	// MODULE: src/adapter/10/bindings.ts

	/**
	 * Get the direct parent of a `vnode`
	 */

	function getVNodeParent$1(vnode) {
	  return vnode._parent || vnode.__ || // Older Preact X versions used `__p`
	  vnode.__p || null;
	}
	/**
	 * Check if a `vnode` is the root of a tree
	 */

	function isRoot$1(vnode, config) {
	  return getVNodeParent$1(vnode) == null && vnode.type === config.Fragment;
	}
	/**
	 * Return the component instance of a `vnode` or `hookState`
	 */

	function getComponent$1(node) {
	  return node._component || node.__c || null;
	}
	/**
	 * Get a `vnode`'s _dom reference.
	 */

	function getDom$1(vnode) {
	  return vnode._dom || vnode.__e || null;
	}
	function hasDom(x) {
	  return x != null && ("_dom" in x || "__e" in x);
	}
	/**
	 * Check if a `vnode` represents a `Suspense` component
	 */

	function isSuspenseVNode$1(vnode) {
	  const c = getComponent$1(vnode); // FYI: Mangling of `_childDidSuspend` is not stable in Preact < 10.3.0

	  return c != null && !!(c._childDidSuspend || c.__c);
	}
	/**
	 * Get the internal hooks state of a component
	 */

	function getComponentHooks$1(vnode) {
	  const c = getComponent$1(vnode);
	  if (!c) return null;
	  return c.__hooks || c.__H || null;
	}
	function getStatefulHooks$1(vnode) {
	  const hooks = getComponentHooks$1(vnode);
	  return hooks !== null ? hooks._list || hooks.__ || hooks.i || // Preact 10.1.0
	  null : null;
	}
	function isUseReducerOrState$1(hookState) {
	  return !!hookState._component || !!hookState.__c;
	}
	function getStatefulHookValue$1(hookState) {
	  if (hookState !== null) {
	    const value = hookState._value || hookState.__ || null;

	    if (value !== null && Array.isArray(value)) {
	      return value[0];
	    }
	  }

	  return null;
	}
	function getPendingHookValue$1(state) {
	  // Preact >= 10.8.1
	  if (state.__pendingValue !== undefined) {
	    return state.__pendingValue;
	  } // Preact > 10.8.1
	  else if (state.__V !== undefined) {
	      return state.__V;
	    } // Preact 10.8.1
	    else if (state.o !== undefined) {
	        return state.o;
	      }

	  return undefined;
	}
	function setPendingHookValue$1(state, value) {
	  // Preact >= 10.8.1
	  if ("__pendingValue" in state) {
	    state.__pendingValue = value;
	  } // Preact > 10.8.1
	  else if ("__V" in state) {
	      state.__V = value;
	    } // Preact === 10.8.1
	    else if ("o" in state) {
	        state.o = value;
	      }
	}
	function getHookState$1(vnode, index, type) {
	  const c = getComponent$1(vnode);
	  if (c === null) return null;
	  const list = getStatefulHooks$1(vnode);

	  if (list && list[index]) {
	    // useContext
	    if (type === HookType.useContext) {
	      const context = list[index]._context || list[index].__c || list[index].c;
	      const provider = c.context[context._id] || c.context[context.__c];
	      return provider ? provider.props.value : context._defaultValue || context.__;
	    }

	    let value;
	    const state = list[index]; // Prefer current value before pending

	    if ("_value" in state) {
	      value = state._value;
	    } else if ("__" in state) {
	      value = state.__;
	    } else {
	      value = getPendingHookValue$1(list[index]);
	    }

	    if (type === HookType.useRef) {
	      return value.current;
	    } else if (type === HookType.useErrorBoundary && !value) {
	      return "__preact_empty__";
	    }

	    return value;
	  }

	  return [];
	}
	/**
	 * Get the diffed children of a `vnode`
	 */

	function getActualChildren$1(vnode) {
	  return vnode._children || vnode.__k || [];
	} // End Mangle accessors
	/**
	 * Get human readable name of the component/dom element
	 */

	function getDisplayName$1(vnode, config) {
	  const {
	    type
	  } = vnode;
	  if (type === config.Fragment) return "Fragment";else if (typeof type === "function") {
	    // Context is a special case :((
	    // See: https://reactjs.org/docs/context.html#contextdisplayname
	    const c = getComponent$1(vnode);

	    if (c !== null) {
	      // Consumer
	      if (c.constructor) {
	        const ct = c.constructor.contextType;

	        if (ct && ct.Consumer === type && ct.displayName) {
	          return `${ct.displayName}.Consumer`;
	        }
	      } // Provider


	      if (c.sub) {
	        const ctx = type._contextRef || type.__;

	        if (ctx && ctx.displayName) {
	          return `${ctx.displayName}.Provider`;
	        }
	      }

	      if (isSuspenseVNode$1(vnode)) {
	        return "Suspense";
	      } // Preact 10.4.1 uses a raw Component as a child for Suspense
	      // by doing `createElement(Component, ...);`


	      if (type === config.Component) {
	        return "Component";
	      }
	    }

	    return type.displayName || type.name || "Anonymous";
	  } else if (typeof type === "string") return type;
	  return "#text";
	}
	function getNextState$1(c) {
	  return c._nextState || c.__s || null;
	}
	function setNextState$1(c, value) {
	  return c._nextState = c.__s = value;
	}

	function getSuspenseStateKey$1(c) {
	  if ("_suspended" in c.state) {
	    return "_suspended";
	  } else if ("__e" in c.state) {
	    return "__e";
	  } // This is a bit whacky, but property name mangling is unsafe in
	  // Preact <10.4.9


	  const keys = Object.keys(c.state);

	  if (keys.length > 0) {
	    return keys[0];
	  }

	  return null;
	}

	function getSuspendedState$1(vnode) {
	  const c = getComponent$1(vnode);

	  if (c) {
	    const key = getSuspenseStateKey$1(c);

	    if (key) {
	      return !!c._nextState[key];
	    }
	  }

	  return null;
	}
	function isTextVNode(vnode) {
	  return vnode !== null && vnode.type === null;
	}
	function createSuspenseState$1(vnode, suspended) {
	  const c = getComponent$1(vnode);
	  const key = getSuspenseStateKey$1(c);

	  if (c && key) {
	    return {
	      [key]: suspended
	    };
	  }

	  return {};
	}
	function getInstance$1(vnode) {
	  // For components we use the instance to check refs, otherwise
	  // we'll use a dom node
	  if (typeof vnode.type === "function") {
	    return getComponent$1(vnode);
	  }

	  return getDom$1(vnode);
	}
	function isComponent$1(vnode) {
	  return vnode !== null && typeof vnode.type === "function";
	}
	function isVNode(x) {
	  return x != null && x.type !== undefined && hasDom(x);
	}
	function isElement$1(vnode) {
	  return typeof vnode.type === "string";
	} // eslint-disable-next-line @typescript-eslint/no-unused-vars

	function isPortal$1(vnode) {
	  // TODO: Find a way to detect portals
	  return false;
	}
	const bindingsV10 = {
	  isRoot: isRoot$1,
	  getDisplayName: getDisplayName$1,
	  getPropsVNodeDisplayName: getDisplayName$1,
	  getActualChildren: getActualChildren$1,
	  getDom: getDom$1,
	  isTextVNode,
	  getInstance: getInstance$1,
	  createSuspenseState: createSuspenseState$1,
	  getComponent: getComponent$1,
	  getComponentHooks: getComponentHooks$1,
	  getHookState: getHookState$1,
	  getPendingHookValue: getPendingHookValue$1,
	  setPendingHookValue: setPendingHookValue$1,
	  getVNodeParent: getVNodeParent$1,
	  isComponent: isComponent$1,
	  isElement: isElement$1,
	  isSuspenseVNode: isSuspenseVNode$1,
	  getSuspendedState: getSuspendedState$1,
	  isVNode,
	  setNextState: setNextState$1,
	  isPortal: isPortal$1,
	  getStatefulHookValue: getStatefulHookValue$1,
	  getStatefulHooks: getStatefulHooks$1,
	  isUseReducerOrState: isUseReducerOrState$1,
	  getRenderReasonPost
	};

	// MODULE: src/adapter/10/log.ts
	/**
	 * Pretty print a `VNode` to the browser console. This can be triggered
	 * by clicking a button in the devtools ui.
	 */

	function logVNode(ids, config, id, children) {
	  const vnode = getVNodeById(ids, id);

	  if (vnode == null) {
	    // eslint-disable-next-line no-console
	    console.warn(`Could not find vnode with id ${id}`);
	    return;
	  }

	  const display = getDisplayName$1(vnode, config);
	  const name = display === "#text" ? display : `<${display || "Component"} />`;
	  /* eslint-disable no-console */

	  console.group(`LOG %c${name}`, "color: #ea88fd; font-weight: normal");
	  console.log("props:", vnode.props);
	  const c = getComponent$1(vnode);

	  if (c != null) {
	    console.log("state:", c.state);
	  }

	  console.log("vnode:", vnode);
	  console.log("devtools id:", id);
	  console.log("devtools children:", children);
	  console.groupEnd();
	  /* eslint-enable no-console */
	}

	// MODULE: src/adapter/shared/renderer.ts
	const memoReg = /^Memo\(/;
	const forwardRefReg = /^ForwardRef\(/;
	/**
	 * Get the type of a vnode. The devtools uses these constants to differentiate
	 * between the various forms of components.
	 */

	function getDevtoolsType(vnode, bindings) {
	  if (bindings.isComponent(vnode)) {
	    // TODO: Use getDisplayName here?
	    const name = vnode.type.displayName || "";
	    if (memoReg.test(name)) return DevNodeType.Memo;
	    if (forwardRefReg.test(name)) return DevNodeType.ForwardRef;
	    if (bindings.isSuspenseVNode(vnode)) return DevNodeType.Suspense;
	    if (bindings.isPortal(vnode)) return DevNodeType.Portal; // TODO: Provider and Consumer

	    return vnode.type.prototype && vnode.type.prototype.render ? DevNodeType.ClassComponent : DevNodeType.FunctionComponent;
	  }

	  return DevNodeType.Element;
	}
	function createRenderer(port, config, options, supports, profiler, filters, ids, bindings) {
	  const roots = new Set();
	  let currentUnmounts = [];
	  let prevOwners = new Map();
	  const domToVNode = new WeakMap();
	  let unmountStats = {
	    components: 0,
	    elements: 0,
	    text: 0
	  };

	  function onUnmount(vnode) {
	    if (profiler.recordStats) {
	      if (bindings.isComponent(vnode)) {
	        unmountStats.components++;
	      } else if (bindings.isElement(vnode)) {
	        unmountStats.elements++;
	      } else {
	        unmountStats.text++;
	      }
	    }

	    if (!shouldFilter(vnode, filters, config, bindings)) {
	      if (hasVNodeId(ids, vnode)) {
	        currentUnmounts.push(getVNodeId(ids, vnode));
	      }
	    }

	    if (!bindings.isComponent(vnode)) {
	      const dom = bindings.getDom(vnode);
	      if (dom != null) domToVNode.delete(dom);
	    }

	    removeVNodeId(ids, vnode);
	  }

	  const inspect = id => {
	    return inspectVNode(ids, config, bindings, options, id, supports.hooks);
	  };

	  return {
	    clear() {
	      roots.forEach(vnode => {
	        onUnmount(vnode);
	      });
	    },

	    getVNodeById: id => getVNodeById(ids, id),

	    getDisplayName(vnode) {
	      return bindings.getDisplayName(vnode, config);
	    },

	    log: (id, children) => logVNode(ids, config, id, children),
	    inspect,

	    findDomForVNode(id) {
	      const vnode = getVNodeById(ids, id);
	      if (!vnode) return null;
	      let first = null;
	      let last = null; // Traverse tree until we find the first DOM node

	      let stack = [vnode];
	      let item;

	      while ((item = stack.shift()) !== undefined) {
	        if (item === null) continue;

	        if (!bindings.isComponent(item)) {
	          first = bindings.getDom(item);
	          break;
	        }

	        stack.push(...bindings.getActualChildren(item));
	      } // If we traversed through every child, then there is
	      // no last child present.


	      if (first !== null) {
	        stack = [vnode];

	        while ((item = stack.pop()) !== undefined) {
	          if (item === null) continue;

	          if (!bindings.isComponent(item)) {
	            last = bindings.getDom(item);
	            break;
	          }

	          stack.push(...bindings.getActualChildren(item));
	        }
	      } // Only set last if node is different. If both are the same
	      // we assume that we cannot show correct padding, margin and
	      // border visualizations and skip that.


	      return [first, first === last ? null : last];
	    },

	    findVNodeIdForDom(node) {
	      const vnode = domToVNode.get(node);

	      if (vnode) {
	        if (shouldFilter(vnode, filters, config, bindings)) {
	          let p = vnode;
	          let found = null;

	          while ((p = bindings.getVNodeParent(p)) != null) {
	            if (!shouldFilter(p, filters, config, bindings)) {
	              found = p;
	              break;
	            }
	          }

	          if (found != null) {
	            return getVNodeId(ids, found);
	          }
	        } else {
	          return getVNodeId(ids, vnode);
	        }
	      }

	      return -1;
	    },

	    refresh() {
	      this.applyFilters(filters);
	    },

	    applyFilters(nextFilters) {
	      /** Queue events and flush in one go */
	      const queue = [];
	      roots.forEach(root => {
	        const rootId = getVNodeId(ids, root);
	        unmountStats = {
	          components: 0,
	          elements: 0,
	          text: 0
	        };
	        traverse(root, vnode => this.onUnmount(vnode), bindings);
	        const commit = {
	          operations: [],
	          rootId,
	          strings: new Map(),
	          unmountIds: currentUnmounts,
	          stats: profiler.recordStats ? createStats() : null
	        };

	        if (commit.stats !== null) {
	          commit.stats.unmounts = unmountStats;
	        }

	        const unmounts = flush(commit);

	        if (unmounts) {
	          currentUnmounts = [];
	          queue.push(unmounts);
	        }
	      });
	      filters.regex = nextFilters.regex;
	      filters.type = nextFilters.type;
	      roots.forEach(root => {
	        const commit = createCommit(ids, roots, prevOwners, root, filters, domToVNode, config, profiler, bindings, {
	          start: new Map(),
	          end: new Map()
	        }, null);
	        const ev = flush(commit);
	        if (!ev) return;
	        queue.push(ev);
	      });
	      queue.forEach(ev => port.send(ev.type, ev.data));
	    },

	    onCommit(vnode, owners, timingsByVNode, renderReasonPre) {
	      const commit = createCommit(ids, roots, owners, vnode, filters, domToVNode, config, profiler, bindings, timingsByVNode, renderReasonPre);
	      prevOwners = owners;
	      timingsByVNode.start.clear();
	      timingsByVNode.end.clear();

	      if (commit.stats !== null) {
	        commit.stats.unmounts = unmountStats;
	        unmountStats = {
	          components: 0,
	          elements: 0,
	          text: 0
	        };
	      }

	      commit.unmountIds.push(...currentUnmounts);
	      currentUnmounts = [];
	      const ev = flush(commit);
	      if (!ev) return;

	      if (profiler.updateRects.size > 0) {
	        startDrawing(profiler.updateRects);
	        profiler.pendingHighlightUpdates.clear();
	      }

	      port.send(ev.type, ev.data);
	    },

	    onUnmount,

	    update(id, type, path, value) {
	      const vnode = getVNodeById(ids, id);

	      if (vnode !== null) {
	        if (bindings.isComponent(vnode)) {
	          const c = bindings.getComponent(vnode);

	          if (c) {
	            if (type === "props") {
	              vnode.props = setInCopy(vnode.props || {}, path.slice(), value);
	            } else if (type === "state") {
	              const res = setInCopy(c.state || {}, path.slice(), value);
	              bindings.setNextState(c, res);
	            } else if (type === "context") {
	              // TODO: Investigate if we should disallow modifying context
	              // from devtools and make it readonly.
	              setIn(c.context || {}, path.slice(), value);
	            }

	            c.forceUpdate();
	          }
	        }
	      }
	    },

	    updateHook(id, index, value) {
	      const vnode = getVNodeById(ids, id);

	      if (vnode !== null && bindings.isComponent(vnode)) {
	        const c = bindings.getComponent(vnode);

	        if (c) {
	          const s = bindings.getHookState(vnode, index); // Only useState and useReducer hooks marked as editable so state can
	          // cast to more specific ReducerHookState value.

	          s[0] = value;
	          c.forceUpdate();
	        }
	      }
	    },

	    suspend(id, active) {
	      let vnode = getVNodeById(ids, id);

	      while (vnode !== null) {
	        if (bindings.isSuspenseVNode(vnode)) {
	          const c = bindings.getComponent(vnode);

	          if (c) {
	            c.setState(bindings.createSuspenseState(vnode, active));
	          } // Get nearest non-filtered vnode


	          let nearest = vnode;

	          while (nearest && shouldFilter(nearest, filters, config, bindings)) {
	            nearest = bindings.getVNodeParent(nearest);
	          }

	          if (nearest && hasVNodeId(ids, nearest)) {
	            const nearestId = getVNodeId(ids, nearest);

	            if (id !== nearestId) {
	              const inspectData = inspect(nearestId);

	              if (inspectData) {
	                inspectData.suspended = active;
	                port.send("inspect-result", inspectData);
	              }
	            }
	          }

	          break;
	        }

	        vnode = bindings.getVNodeParent(vnode);
	      }
	    }

	  };
	}

	// MODULE: src/adapter/marks.ts
	// Here we use the "User Timing API" to collect samples for the
	// native profiling tools of browsers. These timings will show
	// up in the "Timing" category.
	const markName = s => `⚛ ${s}`;

	const supportsPerformance = globalThis.performance && typeof globalThis.performance.getEntriesByName === "function";
	function recordMark(s) {
	  if (supportsPerformance) {
	    performance.mark(markName(s));
	  }
	}
	function endMark(nodeName) {
	  if (supportsPerformance) {
	    const name = markName(nodeName);
	    const start = `${name}_diff`;
	    const end = `${name}_diffed`;

	    if (performance.getEntriesByName(start).length > 0) {
	      performance.mark(end);
	      performance.measure(name, start, end);
	    }

	    performance.clearMarks(start);
	    performance.clearMarks(end);
	    performance.clearMeasures(name);
	  }
	}

	// MODULE: src/adapter/shared/timings.ts
	function createVNodeTimings() {
	  return {
	    start: new Map(),
	    end: new Map()
	  };
	}

	// MODULE: src/adapter/10/options.ts
	/**
	 * Inject tracking into setState
	 */

	function trackPrevState$1(Ctor) {
	  const setState = Ctor.prototype.setState;

	  Ctor.prototype.setState = function (update, callback) {
	    // Duplicated in setState() but doesn't matter due to the guard.
	    const nextState = getNextState$1(this);
	    const s = nextState !== this.state && nextState || setNextState$1(this, Object.assign({}, this.state)); // Needed in order to check if state has changed after the tree has been committed:

	    this._prevState = Object.assign({}, s);
	    return setState.call(this, update, callback);
	  };
	}

	function setupOptionsV10(options, renderer, config) {
	  // Track component state. Only supported in Preact > 10.4.0
	  if (config.Component) {
	    trackPrevState$1(config.Component);
	  }

	  let timings = createVNodeTimings();
	  const owners = new Map();
	  let ownerStack = [];
	  const o = options; // Store (possible) previous hooks so that we don't overwrite them

	  const prevVNodeHook = options.vnode;
	  const prevCommitRoot = o._commit || o.__c;
	  const prevBeforeUnmount = options.unmount;
	  const prevBeforeDiff = o._diff || o.__b;
	  const prevRender = o._render || o.__r;
	  const prevAfterDiff = options.diffed;
	  let prevHook = o._hook || o.__h;
	  let prevUseDebugValue = options.useDebugValue; // @ts-ignore

	  let prevHookName = options.useDebugName;
	  const skipEffects = o._skipEffects || o.__s; // Make sure that we are always the first `option._hook` to be called.
	  // This is necessary to ensure that our callstack remains consistent.
	  // Othwerwise we'll end up with an unknown number of frames in-between
	  // the called hook and `options._hook`. This will lead to wrongly
	  // parsed hooks.

	  setTimeout(() => {
	    prevHook = o._hook || o.__h;
	    prevUseDebugValue = options.useDebugValue; // @ts-ignore

	    prevHookName = options._addHookName || options.__a;

	    o._hook = o.__h = (c, index, type) => {
	      const vnode = c._vnode || c.__v;
	      const s = getStatefulHooks$1(vnode);

	      if (s && Array.isArray(s) && s.length > 0 && getComponent$1(s[0])) {
	        s[0]._oldValue = getStatefulHookValue$1(s);
	        s[0]._index = index;
	      }

	      if (type) {
	        addHookStack(type);
	      } // Don't continue the chain while the devtools is inspecting hooks.
	      // Otherwise the next hook will very likely throw as we're only
	      // faking a render and not doing a proper one. #278


	      if (!options._skipEffects && !options.__s) {
	        if (prevHook) prevHook(c, index, type);
	      }
	    };

	    options.useDebugValue = value => {
	      addHookStack(HookType.useDebugValue);
	      addDebugValue(value);
	      if (prevUseDebugValue) prevUseDebugValue(value);
	    }; // @ts-ignore


	    options._addHookName = options.__a = name => {
	      addHookName(name);
	      if (prevHookName) prevHookName(name);
	    };
	  }, 100);

	  options.vnode = vnode => {
	    if (ownerStack.length > 0 && typeof vnode.type === "function" && vnode.type !== config.Fragment) {
	      owners.set(vnode, ownerStack[ownerStack.length - 1]);
	    }

	    if (prevVNodeHook) prevVNodeHook(vnode);
	  };

	  o._diff = o.__b = vnode => {
	    if (typeof vnode.type === "function") {
	      const name = getDisplayName$1(vnode, config);
	      recordMark(`${name}_diff`);
	    }

	    if (vnode.type !== null) {
	      timings.start.set(vnode, performance.now());
	    }

	    if (prevBeforeDiff != null) prevBeforeDiff(vnode);
	  };

	  o._render = o.__r = (vnode, parent) => {
	    if (!skipEffects && typeof vnode.type === "function" && vnode.type !== config.Fragment) {
	      ownerStack.push(vnode);
	    }

	    if (prevRender != null) prevRender(vnode, parent);
	  };

	  options.diffed = vnode => {
	    if (typeof vnode.type === "function") {
	      if (vnode.type !== config.Fragment) {
	        ownerStack.pop();
	      }

	      endMark(getDisplayName$1(vnode, config));
	    }

	    if (vnode.type !== null) {
	      timings.end.set(vnode, performance.now());
	    }

	    if (prevAfterDiff) prevAfterDiff(vnode);
	  };

	  o._commit = o.__c = (vnode, queue) => {
	    if (prevCommitRoot) prevCommitRoot(vnode, queue); // These cases are already handled by `unmount`

	    if (vnode == null) return;
	    const tmpTimings = timings;
	    ownerStack = [];
	    timings = createVNodeTimings();
	    renderer.onCommit(vnode, owners, tmpTimings, null);
	  };

	  options.unmount = vnode => {
	    if (prevBeforeUnmount) prevBeforeUnmount(vnode);

	    if (vnode.type !== null) {
	      timings.start.delete(vnode);
	      timings.end.delete(vnode);
	    }

	    owners.delete(vnode);
	    renderer.onUnmount(vnode);
	  }; // Teardown devtools options. Mainly used for testing


	  return () => {
	    options.unmount = prevBeforeUnmount;
	    o._commit = o.__c = prevCommitRoot;
	    options.diffed = prevAfterDiff;
	    o._diff = o.__b = prevBeforeDiff;
	    options.vnode = prevVNodeHook;
	    o._hook = o.__h = prevHook;
	    options.useDebugValue = prevUseDebugValue;
	  };
	}

	// MODULE: src/adapter/parse-semverish.ts
	const MAJOR = 1;
	const MINOR = 2;
	const PATCH = 3;
	const PRERELEASE = 5;
	const PRERELEASE_TAG = 5;
	const PRERELEASE_VERSION = 6;
	const REGEXP_SEMVERISH = /^(\d+)\.(\d+)\.(\d+)(-(.+)\.(\d+))?$/i;
	/**
	 * semver-ish parsing based on https://github.com/npm/node-semver/blob/master/semver.js
	 *
	 * @param version Version to parse
	 * @param allowPreRelease Flag to indicate whether pre-releases should be allowed & parsed (e.g. -rc.1)
	 */

	function parseSemverish(version) {
	  const match = version.match(REGEXP_SEMVERISH);

	  if (match) {
	    let preRelease = undefined;

	    if (match[PRERELEASE]) {
	      preRelease = {
	        tag: match[PRERELEASE_TAG],
	        version: +match[PRERELEASE_VERSION]
	      };
	    }

	    return {
	      major: +match[MAJOR],
	      minor: +match[MINOR],
	      patch: +match[PATCH],
	      preRelease
	    };
	  }

	  return null;
	}

	// MODULE: src/adapter/11/bindings.ts

	const TYPE_TEXT = 1 << 0;
	const TYPE_ELEMENT = 1 << 1;
	const TYPE_CLASS = 1 << 2;
	const TYPE_FUNCTION = 1 << 3;
	/** Signals this internal has a _parentDom prop that should change the parent
	 * DOM node of it's children */

	const TYPE_ROOT = 1 << 4;
	/** Any type of component */

	const TYPE_COMPONENT = TYPE_CLASS | TYPE_FUNCTION | TYPE_ROOT;
	function isComponent(internal) {
	  return (internal.flags & TYPE_COMPONENT) > 0;
	}
	function isInternal(x) {
	  return x !== null && typeof x === "object" && (typeof x.__v === "number" || typeof x._vnodeId === "number");
	}
	function isTextInternal(internal) {
	  return (internal.flags & TYPE_TEXT) > 0;
	}
	function getComponentHooks(internal) {
	  const data = internal.data;
	  if (data == null) return null;
	  return data.__hooks || data.__H || null;
	}
	function isSuspenseVNode(internal) {
	  const c = getComponent(internal); // FYI: Mangling of `_childDidSuspend` is not stable in Preact < 10.3.0

	  return c != null && !!(c._childDidSuspend || c.__c);
	}
	function getSuspenseStateKey(c) {
	  if ("_suspended" in c.state) {
	    return "_suspended";
	  } else if ("__e" in c.state) {
	    return "__e";
	  } // This is a bit whacky, but property name mangling is unsafe in
	  // Preact <10.4.9


	  const keys = Object.keys(c.state);

	  if (keys.length > 0) {
	    return keys[0];
	  }

	  return null;
	} // Mangle accessors
	// When serializing props we're dealing with vnodes instead of
	// internal objects

	function getPropsVNodeDisplayName(vnode, config) {
	  const {
	    type
	  } = vnode;

	  if (typeof type === "function") {
	    if (type === config.Fragment) return "Fragment"; // Context is a special case :((
	    // See: https://reactjs.org/docs/context.html#contextdisplayname
	    // Consumer

	    const ct = type.contextType;

	    if (ct && ct.Consumer === type && ct.displayName) {
	      return `${ct.displayName}.Consumer`;
	    } // Provider


	    const ctx = type._contextRef || type.__;

	    if (ctx && ctx.displayName) {
	      return `${ctx.displayName}.Provider`;
	    }

	    if (type.prototype && (typeof type.prototype.__c === "function" || typeof type.prototype._childDidSuspend === "function")) {
	      return "Suspense";
	    } else if ("__P" in vnode.props || "_parentDom" in vnode.props) {
	      return "Portal";
	    }

	    return type.displayName || type.name || "Anonymous";
	  } else if (typeof type === "string") {
	    return vnode.type;
	  }

	  return "#text";
	}
	function getDisplayName(internal, config) {
	  const {
	    flags,
	    type
	  } = internal;

	  if (flags & TYPE_COMPONENT) {
	    if (type === config.Fragment) return "Fragment"; // Context is a special case :((
	    // See: https://reactjs.org/docs/context.html#contextdisplayname
	    // Consumer

	    const ct = type.contextType;

	    if (ct && ct.Consumer === type && ct.displayName) {
	      return `${ct.displayName}.Consumer`;
	    } // Provider


	    const ctx = type._contextRef || type.__;

	    if (ctx && ctx.displayName) {
	      return `${ctx.displayName}.Provider`;
	    }

	    if (isSuspenseVNode(internal)) {
	      return "Suspense";
	    } else if (isPortal(internal)) {
	      return "Portal";
	    }

	    return type.displayName || type.name || "Anonymous";
	  } else if (flags & TYPE_ELEMENT) {
	    return internal.type;
	  }

	  return "#text";
	}
	function getActualChildren(internal) {
	  return internal._children || internal.__k || [];
	}
	function getComponent(node) {
	  return node._component || node.__c || null;
	}
	function isElement(node) {
	  return (node.flags & TYPE_ELEMENT) > 0;
	}
	function getNextState(c) {
	  return c._nextState || c.__s || null;
	}
	function setNextState(c, value) {
	  return c._nextState = c.__s = value;
	}
	function getDom(internal) {
	  return internal._dom || internal.__e || null;
	}
	/**
	 * Get the direct parent of a `vnode`
	 */

	function getVNodeParent(internal) {
	  return internal._parent || internal.__ || null;
	}
	/**
	 * Check if a `vnode` is the root of a tree
	 */

	function isRoot(internal, config) {
	  return getVNodeParent(internal) == null && internal.type === config.Fragment;
	}
	function getStatefulHooks(internal) {
	  const hooks = getComponentHooks(internal);
	  return hooks !== null ? hooks._list || hooks.__ || null : null;
	}
	function isUseReducerOrState(hookState) {
	  return !!hookState._internal || !!hookState.__i;
	}
	function getStatefulHookValue(hookState) {
	  if (hookState !== null) {
	    const value = hookState._value || hookState.__ || null;

	    if (value !== null && Array.isArray(value)) {
	      return value[0];
	    }
	  }

	  return null;
	}
	function getHookState(internal, index, type) {
	  const c = getComponent(internal);
	  if (c === null) return [];
	  const list = getStatefulHooks(internal);

	  if (list && list[index]) {
	    // useContext
	    if (type === HookType.useContext) {
	      const context = list[index]._context || list[index].__c || list[index].c;
	      const provider = c.context[context._id] || c.context[context.__c];
	      return provider ? provider.props.value : context._defaultValue || context.__;
	    }

	    const value = getPendingHookValue(list[index]);

	    if (type === HookType.useRef) {
	      return value[0].current;
	    } else if (type === HookType.useErrorBoundary && !value) {
	      return "__preact_empty__";
	    }

	    return value;
	  }

	  return [];
	}
	function getPendingHookValue(state) {
	  return state._value !== undefined ? state._value : state.__;
	}
	function setPendingHookValue(state, value) {
	  if ("_value" in state) {
	    state._value = value;
	  } else {
	    state.__ = value;
	  }
	}
	function createSuspenseState(vnode, suspended) {
	  const c = getComponent(vnode);
	  const key = getSuspenseStateKey(c);

	  if (c && key) {
	    return {
	      [key]: suspended
	    };
	  }

	  return {};
	}
	function getSuspendedState(internal) {
	  const c = getComponent(internal);

	  if (c) {
	    const key = getSuspenseStateKey(c);

	    if (key) {
	      return !!c._nextState[key];
	    }
	  }

	  return null;
	}

	const getInstance = x => x;

	function isPortal(internal) {
	  return "__P" in internal.props || "_parentDom" in internal.props;
	}
	const bindingsV11 = {
	  isRoot,
	  getDisplayName,
	  getPropsVNodeDisplayName,
	  getActualChildren,
	  getDom,
	  isTextVNode: isTextInternal,
	  getInstance,
	  createSuspenseState,
	  getComponent,
	  getComponentHooks,
	  getHookState,
	  getPendingHookValue,
	  setPendingHookValue,
	  getVNodeParent,
	  isComponent,
	  isElement,
	  isSuspenseVNode,
	  isVNode: isInternal,
	  getSuspendedState,
	  setNextState,
	  isPortal,
	  getStatefulHookValue,
	  getStatefulHooks,
	  isUseReducerOrState,

	  getRenderReasonPost() {
	    return null;
	  }

	};

	// MODULE: src/adapter/11/renderReason.ts
	/**
	 * Detect why a VNode updated.
	 */

	function getRenderReasonPre(timings, internal, oldData) {
	  // Components
	  if (isComponent(internal) && internal.type === oldData.type) {
	    const c = getComponent(internal);

	    if (c !== null) {
	      // Check hooks
	      const hooks = getStatefulHooks(internal);

	      if (hooks !== null) {
	        for (let i = 0; i < hooks.length; i++) {
	          if (isUseReducerOrState(hooks[i]) && hooks[i]._oldValue !== getStatefulHookValue(hooks[i])) {
	            return createReason(5
	            /* HOOKS_CHANGED */
	            , null);
	          }
	        }
	      } // Check state


	      const prevState = c._prevState;

	      if (prevState != null && prevState !== c.state) {
	        return createReason(4
	        /* STATE_CHANGED */
	        , getChangedKeys(prevState, c.state));
	      } else if (prevState === undefined && c.state !== undefined && Object.keys(c.state).length > 0) {
	        return createReason(4
	        /* STATE_CHANGED */
	        , null);
	      }
	    }
	  } // Check props


	  if (internal.props !== oldData.props) {
	    const propsChanged = getChangedKeys(internal.props, oldData.props);

	    if (propsChanged.length > 0) {
	      return createReason(3
	      /* PROPS_CHANGED */
	      , propsChanged);
	    }
	  }

	  const parent = getVNodeParent(internal);

	  if (parent != null) {
	    if (parent != null && (timings.start.get(internal) || 0) >= (timings.start.get(parent) || 0) && (timings.end.get(internal) || 0) <= (timings.end.get(parent) || 0)) {
	      return createReason(2
	      /* PARENT_UPDATE */
	      , null);
	    }
	  }

	  return createReason(6
	  /* FORCE_UPDATE */
	  , null);
	}

	// MODULE: src/adapter/11/options.ts
	/**
	 * Inject tracking into setState
	 */

	function trackPrevState(Ctor) {
	  const setState = Ctor.prototype.setState;

	  Ctor.prototype.setState = function (update, callback) {
	    // Duplicated in setState() but doesn't matter due to the guard.
	    const nextState = getNextState(this);
	    const s = nextState !== this.state && nextState || setNextState(this, Object.assign({}, this.state)); // Needed in order to check if state has changed after the tree has been committed:

	    this._prevState = Object.assign({}, s);
	    return setState.call(this, update, callback);
	  };
	}

	function setupOptionsV11(options, renderer, config, profiler) {
	  // Track component state. Only supported in Preact > 10.4.0
	  if (config.Component) {
	    trackPrevState(config.Component);
	  }

	  const timings = createVNodeTimings();
	  let renderReasons = new Map();
	  let reasonTmpData = new Map();
	  const owners = new Map();
	  const o = options; // Store (possible) previous hooks so that we don't overwrite them

	  const prevVNodeHook = options._internal;
	  const prevCommitRoot = o._commit || o.__c;
	  const prevBeforeUnmount = options.unmount;
	  const prevBeforeDiff = o._diff || o.__b;
	  const prevAfterDiff = options.diffed;
	  let prevHook = o._hook || o.__h;
	  let prevUseDebugValue = options.useDebugValue; // @ts-ignore

	  let prevHookName = options.useDebugName; // Make sure that we are always the first `option._hook` to be called.
	  // This is necessary to ensure that our callstack remains consistent.
	  // Othwerwise we'll end up with an unknown number of frames in-between
	  // the called hook and `options._hook`. This will lead to wrongly
	  // parsed hooks.

	  setTimeout(() => {
	    prevHook = o._hook || o.__h;
	    prevUseDebugValue = options.useDebugValue; // @ts-ignore

	    prevHookName = options._addHookName || options.__a;

	    o._hook = o.__h = (internal, index, type) => {
	      if (type) {
	        addHookStack(type);
	      } // Don't continue the chain while the devtools is inspecting hooks.
	      // Otherwise the next hook will very likely throw as we're only
	      // faking a render and not doing a proper one. #278


	      if (!options._skipEffects && !options.__s) {
	        if (prevHook) prevHook(internal, index, type);
	      }
	    };

	    options.useDebugValue = value => {
	      addHookStack(HookType.useDebugValue);
	      addDebugValue(value);
	      if (prevUseDebugValue) prevUseDebugValue(value);
	    }; // @ts-ignore


	    options._addHookName = options.__a = name => {
	      addHookName(name);
	      if (prevHookName) prevHookName(name);
	    };
	  }, 100);

	  o._diff = o.__b = (internal, vnode) => {
	    if (internal.flags & TYPE_COMPONENT) {
	      timings.start.set(internal, performance.now());
	      const name = getDisplayName(internal, config);
	      recordMark(`${name}_diff`);

	      if (profiler.captureRenderReasons) {
	        if (internal === null) {
	          if (vnode !== null) {
	            renderReasons.set(internal, createReason(1
	            /* MOUNT */
	            , null));
	          }
	        } else if (vnode !== null) {
	          reasonTmpData.set(internal, {
	            type: vnode.type,
	            props: internal.props
	          });
	        }
	      }
	    }

	    if (prevBeforeDiff != null) prevBeforeDiff(internal);
	  };

	  options.diffed = internal => {
	    if (internal.flags & TYPE_COMPONENT) {
	      timings.end.set(internal, performance.now());
	      endMark(getDisplayName(internal, config));

	      if (profiler.captureRenderReasons) {
	        const old = reasonTmpData.get(internal);

	        if (old != null) {
	          const reason = getRenderReasonPre(timings, internal, old);

	          if (reason !== null) {
	            renderReasons.set(internal, reason);
	          }
	        }

	        const s = getStatefulHooks(internal);

	        if (s && Array.isArray(s) && s.length > 0) {
	          const internal = s[0]._internal || s[0].__i;

	          if (internal !== undefined && getComponent(internal)) {
	            s[0]._oldValue = getStatefulHookValue(s[0]);
	          }
	        }
	      }
	    }

	    if (prevAfterDiff) prevAfterDiff(internal);
	  };

	  o._commit = o.__c = (internal, queue) => {
	    if (prevCommitRoot) prevCommitRoot(internal, queue); // These cases are already handled by `unmount`

	    if (internal == null) return;
	    renderer.onCommit(internal, owners, timings, renderReasons);

	    if (profiler.captureRenderReasons) {
	      renderReasons = new Map();
	      reasonTmpData = new Map();
	    }
	  };

	  options.unmount = internal => {
	    if (prevBeforeUnmount) prevBeforeUnmount(internal);
	    timings.start.delete(internal);
	    timings.end.delete(internal);
	    renderer.onUnmount(internal);
	  }; // Teardown devtools options. Mainly used for testing


	  return () => {
	    options.unmount = prevBeforeUnmount;
	    o._commit = o.__c = prevCommitRoot;
	    options.diffed = prevAfterDiff;
	    o._diff = o.__b = prevBeforeDiff;
	    options._internal = prevVNodeHook;
	    o._hook = o.__h = prevHook;
	    options.useDebugValue = prevUseDebugValue;
	  };
	}

	// MODULE: src/adapter/adapter/profiler.ts
	function newProfiler() {
	  return {
	    highlightUpdates: false,
	    updateRects: new Map(),
	    pendingHighlightUpdates: new Set(),
	    captureRenderReasons: false,
	    isProfiling: false,
	    recordStats: false
	  };
	}

	// MODULE: src/adapter/hook.ts
	/**
	 * Create hook to which Preact will subscribe and listen to. The hook
	 * is the entrypoint where everything begins.
	 */

	function createHook(port) {
	  const {
	    listen,
	    send
	  } = port;
	  const renderers = new Map();
	  let uid = 0;
	  let status = "disconnected";
	  const profiler = newProfiler();
	  const filters = DEFAULT_FIlTERS; // Lazily init the adapter when a renderer is attached

	  const init = () => {
	    createAdapter(port, profiler, renderers);
	    status = "pending";
	    send("init", null);
	    listen("init", () => {
	      status = "connected";
	    });
	  };

	  const attachRenderer = (renderer, supports) => {
	    if (status === "disconnected") {
	      init();
	    }

	    renderers.set(++uid, renderer); // Content Script is likely not ready at this point, so don't
	    // flush any events here and politely request it to initialize

	    send("attach", {
	      id: uid,
	      supportsProfiling: !!supports.profiling,
	      supportsRenderReasons: !!supports.renderReasons,
	      supportsHooks: !!supports.hooks
	    }); // Feature: Profile and reload
	    // Check if we should immediately start profiling on create

	    const profilerOptions = window.localStorage.getItem(PROFILE_RELOAD);

	    if (profilerOptions !== null) {
	      window.localStorage.removeItem(PROFILE_RELOAD);
	      const options = JSON.parse(profilerOptions);
	      profiler.isProfiling = true;
	      profiler.captureRenderReasons = !!options?.captureRenderReasons;
	    }

	    const statsOptions = window.localStorage.getItem(STATS_RELOAD);

	    if (statsOptions !== null) {
	      window.localStorage.removeItem(STATS_RELOAD);
	      profiler.recordStats = true;
	    }

	    return uid;
	  }; // Delete all roots when the current frame is closed


	  window.addEventListener("pagehide", () => {
	    renderers.forEach(r => {
	      if (r.clear) r.clear();
	    });
	  }); // TODO: This should be added to codesandbox itself. I'm not too
	  // happy with having site specific code in the extension, but
	  // codesandbox is very popular among the Preact/React community
	  // so this will get us started

	  window.addEventListener("message", e => {
	    if (renderers.size > 0 && e.data && e.data.codesandbox && e.data.type === "compile") {
	      renderers.forEach(r => {
	        if (r.clear) r.clear();
	      });
	    }
	  });
	  return {
	    $0: null,
	    $type: null,
	    renderers,

	    get connected() {
	      return status === "connected";
	    },

	    set connected(_) {
	      // eslint-disable-next-line no-console
	      console.warn("Mutating __PREACT_DEVTOOLS__.connected is deprecated.");
	    },

	    emit: port.send,
	    listen: () => {
	      // eslint-disable-next-line no-console
	      console.error("__PREACT_DEVTOOLS__.listen() is deprecated.");
	    },
	    attachPreact: (version, options, config) => {
	      if (status === "disconnected") {
	        init();
	      } // attach the correct renderer/options hooks based on the preact version


	      const preactVersionMatch = parseSemverish(version);

	      if (!preactVersionMatch) {
	        // eslint-disable-next-line no-console
	        console.error(`[PREACT DEVTOOLS] Could not parse preact version ${version}`);
	        return -1;
	      } // Create an integer-based namespace to avoid clashing ids caused by
	      // multiple connected renderers


	      const namespace = Math.floor(Math.random() * 2 ** 32); // currently we only support preact >= 10, later we can add another branch for major === 8

	      if (preactVersionMatch.major == 10) {
	        const supports = {
	          renderReasons: !!config.Component,
	          hooks: preactVersionMatch.minor === 4 && preactVersionMatch.patch >= 1 || preactVersionMatch.minor > 4,
	          profiling: true
	        };
	        const idMapper = createIdMappingState(namespace, bindingsV10.getInstance);
	        const renderer = createRenderer(port, config, options, supports, profiler, filters, idMapper, bindingsV10);
	        setupOptionsV10(options, renderer, config);
	        return attachRenderer(renderer, supports);
	      } else if (preactVersionMatch.major === 11) {
	        const idMapper = createIdMappingState(namespace, bindingsV11.getInstance);
	        const renderer = createRenderer(port, config, options, {
	          hooks: true,
	          renderReasons: true
	        }, profiler, filters, idMapper, bindingsV11);
	        setupOptionsV11(options, renderer, config, profiler);
	        return attachRenderer(renderer, {
	          hooks: true,
	          renderReasons: true,
	          profiling: true
	        });
	      } // eslint-disable-next-line no-console


	      console.error(`[PREACT DEVTOOLS] No devtools adapter exists for preact version "${version}". This is likely a bug in devtools.`);
	      return -1;
	    },
	    attach: renderer => attachRenderer(renderer, {
	      renderReasons: false
	    }),
	    detach: id => renderers.delete(id)
	  };
	}

	// MODULE: src/adapter/adapter/port.ts
	function listenToDevtools(ctx, type, callback) {
	  ctx.addEventListener("message", e => {
	    if (e.source === window && e.data.source === DevtoolsToClient) {
	      const data = e.data;
	      if (data.type === type) callback(data.data);
	    }
	  });
	}
	function sendToDevtools(ctx, type, data) {
	  ctx.postMessage({
	    source: PageHookName,
	    type,
	    data
	  }, "*");
	}
	function createPortForHook(ctx) {
	  return {
	    send: (type, message) => sendToDevtools(ctx, type, message),
	    listen: (type, callback) => listenToDevtools(ctx, type, callback)
	  };
	}

	// MODULE: src/shells/shared/installHook.ts
	window.__PREACT_DEVTOOLS__ = createHook(createPortForHook(window));

})();
