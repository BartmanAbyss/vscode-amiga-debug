var setup = (function (exports) {
	'use strict';

	// MODULE: src/view/valoo.ts
	/**
	 * We'll use this variable to track used dependencies
	 */
	let tracking = new Set();
	const dummy = new Set();
	/**
	 * Base observable primitive.
	 */

	function valoo(v) {
	  // In an earlier version we used a function to read and write values:
	  //
	  //   read: foo()
	  //   write: foo(2)
	  //
	  // The problem with that is that TypeScript is unable to discriminate
	  // types automatically because from the perspective of TypeScript it's
	  // always a new function call. This is really cumbersome when null-types
	  // are involved.
	  //
	  //   const foo = valoo<null | number>(2)
	  //   if (foo()!=null) {
	  //     // Compilation Error, because the return value
	  //     // of foo() could be null
	  //     console.log(foo().toFixed(2));
	  //   }
	  //
	  // Long story short: This is why we're using getters and setters now.
	  const cb = [];
	  const obs = {
	    get $() {
	      tracking.add(obs);
	      return v;
	    },

	    set $(c) {
	      v = c; // Be careful not to track any observables in callbacks

	      const old = tracking;
	      tracking = dummy; // Call listeners

	      cb.forEach(f => f && f(v)); // Restore old tracking

	      tracking = old;
	      dummy.clear();
	    },

	    on(c, options = {}) {
	      const i = cb.push(c) - 1;
	      if (options.init) c(v);
	      return () => cb[i] = null;
	    },

	    update(fn) {
	      const res = fn ? fn(v) : undefined;
	      obs.$ = res !== undefined ? res : v;
	    },

	    _disposers: []
	  };
	  return obs;
	}
	/**
	 * Track used observables automatically and re-execute the callback
	 * whenever one of the dependencies changes.
	 */

	function watch(fn) {
	  const out = valoo(null); // Perf: Don't allocate this in update, because it's much better
	  // to reuse the Set and just mutate + clear it for an update cycle.

	  const tracker = new Set();

	  const update = () => {
	    const oldTracker = tracking;
	    tracking = tracker; // Unsubscribe previous listeners

	    out._disposers.forEach(fn => fn());

	    out._disposers = []; // Call the actual function

	    out.$ = fn(); // Resubscribe to listeners

	    tracking.forEach(x => {
	      const disp = x.on(update);

	      out._disposers.push(disp);
	    });
	    tracker.clear();
	    tracking = oldTracker;
	  };

	  update();
	  return out;
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

	function s$p(n, l) {
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

	function p$1(n) {
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

	function w$1(n) {
	  var l, u;

	  if (null != (n = n.__) && null != n.__c) {
	    for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) {
	      n.__e = n.__c.base = u.__e;
	      break;
	    }

	    return w$1(n);
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
	    n.__d && (r = (o = (l = n).__v).__e, (f = l.__P) && (u = [], (i = s$p({}, o)).__v = o.__v + 1, t = $(f, o, i, l.__n, void 0 !== f.ownerSVGElement, null != o.__h ? [r] : null, u, null == r ? _(o) : r, o.__h), j$1(u, o), t != r && w$1(o)));
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

	  for (s == f$1 && (s = null != r ? r[0] : P ? _(i, 0) : null), u.__k = [], y = 0; y < l.length; y++) if (null != (k = u.__k[y] = null == (k = l[y]) || "boolean" == typeof k ? null : "string" == typeof k || "number" == typeof k ? h$1(null, k, null, null, k) : Array.isArray(k) ? h$1(p$1, {
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

	function A$1(n, l, u, i, t) {
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
	      if (g = u.props, b = (a = P.contextType) && t[a.__c], x = a ? b ? b.props.value : a.__ : t, i.__c ? k = (v = u.__c = i.__c).__ = v.__E : ("prototype" in P && P.prototype.render ? u.__c = v = new P(g, x) : (u.__c = v = new d$1(g, x), v.constructor = P, v.render = M), b && b.sub(v), v.props = g, v.state || (v.state = {}), v.context = x, v.__n = t, h = v.__d = !0, v.__h = []), null == v.__s && (v.__s = v.state), null != P.getDerivedStateFromProps && (v.__s == v.state && (v.__s = s$p({}, v.__s)), s$p(v.__s, P.getDerivedStateFromProps(g, v.__s))), y = v.props, _ = v.state, h) null == P.getDerivedStateFromProps && null != v.componentWillMount && v.componentWillMount(), null != v.componentDidMount && v.__h.push(v.componentDidMount);else {
	        if (null == P.getDerivedStateFromProps && g !== y && null != v.componentWillReceiveProps && v.componentWillReceiveProps(g, x), !v.__e && null != v.shouldComponentUpdate && !1 === v.shouldComponentUpdate(g, v.__s, x) || u.__v === i.__v) {
	          v.props = g, v.state = v.__s, u.__v !== i.__v && (v.__d = !1), v.__v = u, u.__e = i.__e, u.__k = i.__k, v.__h.length && f.push(v), T(u, e, l);
	          break n;
	        }

	        null != v.componentWillUpdate && v.componentWillUpdate(g, v.__s, x), null != v.componentDidUpdate && v.__h.push(function () {
	          v.componentDidUpdate(y, _, w);
	        });
	      }
	      v.context = x, v.props = g, v.state = v.__s, (a = n$1.__r) && a(u), v.__d = !1, v.__v = u, v.__P = l, a = v.render(v.props, v.state, v.context), v.state = v.__s, null != v.getChildContext && (t = s$p(s$p({}, t), v.getChildContext())), h || null == v.getSnapshotBeforeUpdate || (w = v.getSnapshotBeforeUpdate(y, _)), A = null != a && a.type == p$1 && null == a.key ? a.props.children : a, m$2(l, Array.isArray(A) ? A : [A], u, i, t, o, r, f, e, c), v.base = u.__e, u.__h = null, v.__h.length && f.push(v), k && (v.__E = v.__ = null), v.__e = !1;
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

	    A$1(n, d, p, t, c), h ? l.__k = [] : (s = l.props.children, m$2(n, Array.isArray(s) ? s : [s], l, u, i, "foreignObject" !== l.type && t, o, r, f$1, c)), c || ("value" in d && void 0 !== (s = d.value) && (s !== n.value || "progress" === l.type && !s) && C(n, "value", s, p.value, !1), "checked" in d && void 0 !== (s = d.checked) && s !== n.checked && C(n, "checked", s, p.checked, !1));
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
	  n$1.__ && n$1.__(l, u), r = (t = i === o$1) ? null : i && i.__k || u.__k, l = v$1(p$1, null, [l]), c = [], $(u, (t ? u : i || u).__k = l, r || f$1, f$1, void 0 !== u.ownerSVGElement, i && !t ? [i] : r ? null : u.childNodes.length ? e$2.slice.call(u.childNodes) : null, c, i || f$1, t), j$1(c, l);
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
	  u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = s$p({}, this.state), "function" == typeof n && (n = n(s$p({}, u), this.props)), n && s$p(u, n), null != n && this.__v && (l && this.__h.push(l), k$1(this));
	}, d$1.prototype.forceUpdate = function (n) {
	  this.__v && (this.__e = !0, n && this.__h.push(n), k$1(this));
	}, d$1.prototype.render = p$1, u$1 = [], i$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, g$1.__r = 0, o$1 = f$1, r$1 = 0;

	// MODULE: node_modules/preact/hooks/dist/hooks.module.js
	var t$1,
	    u,
	    r,
	    o = 0,
	    i = [],
	    c = n$1.__b,
	    f = n$1.__r,
	    e$1 = n$1.diffed,
	    a = n$1.__c,
	    v = n$1.unmount;

	function m$1(t, r) {
	  n$1.__h && n$1.__h(u, t, o || r), o = 0;
	  var i = u.__H || (u.__H = {
	    __: [],
	    __h: []
	  });
	  return t >= i.__.length && i.__.push({}), i.__[t];
	}

	function l(n) {
	  return o = 1, p(w, n);
	}

	function p(n, r, o) {
	  var i = m$1(t$1++, 2);
	  return i.t = n, i.__c || (i.__ = [o ? o(r) : w(void 0, r), function (n) {
	    var t = i.t(i.__[0], n);
	    i.__[0] !== t && (i.__ = [t, i.__[1]], i.__c.setState({}));
	  }], i.__c = u), i.__;
	}

	function y(r, o) {
	  var i = m$1(t$1++, 3);
	  !n$1.__s && k(i.__H, o) && (i.__ = r, i.__H = o, u.__H.__h.push(i));
	}

	function h(r, o) {
	  var i = m$1(t$1++, 4);
	  !n$1.__s && k(i.__H, o) && (i.__ = r, i.__H = o, u.__h.push(i));
	}

	function s$o(n) {
	  return o = 5, d(function () {
	    return {
	      current: n
	    };
	  }, []);
	}

	function d(n, u) {
	  var r = m$1(t$1++, 7);
	  return k(r.__H, u) && (r.__ = n(), r.__H = u, r.__h = n), r.__;
	}

	function A(n, t) {
	  return o = 8, d(function () {
	    return n;
	  }, t);
	}

	function F(n) {
	  var r = u.context[n.__c],
	      o = m$1(t$1++, 9);
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
	  f && f(n), t$1 = 0;
	  var r = (u = n.__c).__H;
	  r && (r.__h.forEach(g), r.__h.forEach(j), r.__h = []);
	}, n$1.diffed = function (t) {
	  e$1 && e$1(t);
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

	function w(n, t) {
	  return "function" == typeof t ? t(n) : t;
	}

	// MODULE: src/view/store/react-bindings.ts
	// reference is not the same and won't trigger any "resize" (and likely
	// other) events at all.

	const WindowCtx = B(null);
	const AppCtx = B(null);
	const EmitCtx = B(() => null);
	const useEmitter = () => F(EmitCtx);
	const useStore = () => F(AppCtx);
	function useObserver(fn) {
	  // eslint-disable-next-line @typescript-eslint/no-unused-vars
	  const [_, set] = l(0);
	  const count = s$o(0);
	  const tmp = s$o(null);
	  const ref = s$o(tmp.current || (tmp.current = watch(fn)));
	  const dispose = d(() => {
	    const disp = ref.current.on(() => {
	      set(count.current = count.current + 1);
	    });
	    return () => {
	      disp();

	      ref.current._disposers.forEach(disp => disp());
	    };
	  }, []);
	  y(() => {
	    return () => dispose();
	  }, []);
	  return ref.current.$;
	}

	// MODULE: node_modules/escape-string-regexp/index.js

	var escapeStringRegexp = string => {
	  if (typeof string !== 'string') {
	    throw new TypeError('Expected a string');
	  } // Escape characters with special meaning either inside or outside character sets.
	  // Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.


	  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
	};

	// MODULE: src/view/store/search.ts
	function createRegex(s) {
	  if (s[0] === "/") {
	    s = s.slice(1);

	    if (s[s.length - 1] === "/") {
	      s = s.slice(0, -1);
	    }

	    try {
	      return new RegExp(s, "i");
	    } catch (err) {
	      return new RegExp("");
	    }
	  }

	  return new RegExp(`(${escapeStringRegexp(s)})`, "i");
	}
	function createSearchStore(items, list) {
	  const value = valoo("");
	  const selected = valoo(0);
	  const selectedIdx = valoo(-1);
	  const regex = valoo(null);
	  const match = valoo([]);
	  const count = valoo(0);

	  const onChange = s => {
	    value.$ = s;
	    match.$ = [];

	    if (s === "") {
	      regex.$ = null;
	      count.$ = 0;
	      selected.$ = 0;
	      return;
	    }

	    const reg = createRegex(s);
	    regex.$ = reg;
	    const ids = [];
	    list.$.forEach(id => {
	      const node = items.$.get(id);

	      if (node && (reg.test(node.name) || node.hocs && node.hocs.some(h => reg.test(h)))) {
	        ids.push(id);
	      }
	    });

	    if (ids.length > 0) {
	      selected.$ = 0;
	    }

	    count.$ = ids.length;
	    match.$ = ids;
	  };

	  const reset = () => {
	    selectedIdx.$ = -1;
	    onChange("");
	  };

	  function go(n) {
	    if (n < 0) n = match.$.length - 1;else if (n > match.$.length - 1) n = 0;
	    selected.$ = n;
	    selectedIdx.$ = list.$.findIndex(id => match.$[n] === id);
	  }

	  const selectNext = () => go(selected.$ + 1);

	  const selectPrev = () => go(selected.$ - 1);

	  return {
	    selected,
	    selectedIdx,
	    regex,
	    count,
	    value,
	    match,
	    reset,
	    onChange,
	    selectNext,
	    selectPrev
	  };
	}
	function useSearch() {
	  const {
	    search: s
	  } = useStore();
	  const match = useObserver(() => s.match.$);
	  const value = useObserver(() => s.value.$);
	  const marked = useObserver(() => s.selected.$);
	  const regex = useObserver(() => s.regex.$);
	  const count = useObserver(() => s.count.$);
	  const selected = useObserver(() => s.selected.$);
	  const selectedId = useObserver(() => s.match.$[s.selected.$]);
	  return {
	    count,
	    selected,
	    selectedId,
	    marked,
	    regex,
	    match,
	    goNext: s.selectNext,
	    goPrev: s.selectPrev,
	    value
	  };
	}

	// MODULE: src/view/store/filter.ts
	function createFilterStore(onSubmit) {
	  const defaults = {
	    fragment: true,
	    dom: true,
	    hoc: true,
	    root: true,
	    regex: []
	  };
	  const filters = valoo(defaults.regex);
	  const filterFragment = valoo(defaults.fragment);
	  const filterDom = valoo(defaults.dom);
	  const filterHoc = valoo(defaults.hoc);
	  const filterRoot = valoo(defaults.root);

	  const submit = () => {
	    const s = {
	      regex: [],
	      type: {
	        fragment: filterFragment.$,
	        dom: filterDom.$,
	        hoc: filterHoc.$,
	        root: filterRoot.$
	      }
	    };
	    filters.$.forEach(x => {
	      s.regex.push({
	        value: escapeStringRegexp(x.value),
	        enabled: x.enabled
	      });
	    });
	    onSubmit("update-filter", s);
	  };

	  const restore = state => {
	    try {
	      filterFragment.$ = !!state.type.fragment;
	      filterDom.$ = !!state.type.dom;
	      filterHoc.$ = !!state.type.hoc;
	      filterRoot.$ = !!state.type.root;
	      filters.$ = state.regex; // Refetch component tree if filters are not the default ones

	      if (defaults.fragment !== filterFragment.$ || defaults.dom !== filterDom.$ || defaults.hoc !== filterHoc.$ || defaults.root !== filterRoot.$ || filters.$.some(f => f.enabled)) {
	        submit();
	      }
	    } catch (err) {
	      // eslint-disable-next-line no-console
	      console.log(err);
	    }
	  };

	  return {
	    filters,
	    filterFragment,
	    filterDom,
	    filterHoc,
	    filterRoot,

	    setEnabled(filter, v) {
	      if (typeof filter === "string") {
	        if (filter === "dom") {
	          filterDom.$ = v;
	        } else if (filter === "fragment") {
	          filterFragment.$ = v;
	        } else if (filter === "hoc") {
	          filterHoc.$ = v;
	        } else if (filter === "root") {
	          filterRoot.$ = v;
	        }
	      } else {
	        filter.enabled = v;
	      }

	      filters.update();
	    },

	    setValue(filter, value) {
	      filter.value = value;
	      filters.update();
	    },

	    add() {
	      filters.update(v => {
	        v.push({
	          value: "",
	          enabled: false
	        });
	      });
	    },

	    remove(filter) {
	      const idx = filters.$.indexOf(filter);

	      if (idx > -1) {
	        filters.update(v => {
	          v.splice(idx, 1);
	        });
	      }
	    },

	    submit,
	    restore
	  };
	}

	// MODULE: src/view/components/tree/windowing.ts
	function flattenChildren(tree, id, isCollapsed) {
	  const out = [];
	  const visited = new Set();
	  const stack = [id];

	  while (stack.length > 0) {
	    const item = stack.pop();
	    if (item == null) continue;
	    const node = tree.get(item);
	    if (!node) continue;

	    if (!visited.has(node.id)) {
	      out.push(node.id);
	      visited.add(node.id);

	      if (!isCollapsed(node.id)) {
	        for (let i = node.children.length; i--;) {
	          stack.push(node.children[i]);
	        }
	      }
	    }
	  }

	  return out;
	}
	function clamp(n, max) {
	  return Math.max(0, Math.min(n, max));
	}
	function getLastChild(nodes, id) {
	  const stack = [id];
	  let item;
	  let last = id;

	  while ((item = stack.pop()) != null) {
	    last = item;
	    const node = nodes.get(item);

	    if (node && node.children.length > 0) {
	      stack.push(node.children[node.children.length - 1]);
	    }
	  }

	  return last;
	}

	// MODULE: src/view/store/selection.ts
	/**
	 * Manages selection state of the TreeView.
	 */

	function createSelectionStore(list) {
	  const selected = valoo(list.$.length > 0 ? list.$[0] : -1);
	  const selectedIdx = valoo(0);

	  const selectByIndex = idx => {
	    const n = clamp(idx, list.$.length - 1);
	    selected.$ = list.$[n];
	    selectedIdx.$ = n;
	  };

	  const selectNext = () => selectByIndex(selectedIdx.$ + 1);

	  const selectPrev = () => selectByIndex(selectedIdx.$ - 1);

	  const selectById = id => {
	    const idx = list.$.findIndex(x => x === id);
	    selectByIndex(idx);
	  };

	  return {
	    selected,
	    selectedIdx,
	    selectByIndex,
	    selectById,
	    selectNext,
	    selectPrev
	  };
	}
	function useSelection() {
	  const sel = F(AppCtx).selection;
	  const selected = useObserver(() => sel.selected.$);
	  const selectedIdx = useObserver(() => sel.selectedIdx.$);
	  return {
	    selected,
	    selectedIdx,
	    selectByIndex: sel.selectByIndex,
	    selectById: sel.selectById,
	    selectPrev: sel.selectPrev,
	    selectNext: sel.selectNext
	  };
	}

	// MODULE: src/view/store/collapser.ts
	/**
	 * The Collapser deals with hiding sections in a tree view
	 */

	function createCollapser(collapsed) {
	  const collapseNode = (id, shouldCollapse) => {
	    collapsed.update(s => {
	      shouldCollapse ? s.add(id) : s.delete(id);
	    });
	  };

	  const toggle = id => collapseNode(id, !collapsed.$.has(id));

	  return {
	    collapsed,
	    collapseNode,
	    toggle
	  };
	}
	function useCollapser() {
	  const c = F(AppCtx).collapser;
	  const collapsed = useObserver(() => c.collapsed.$);
	  return {
	    collapsed,
	    collapseNode: c.collapseNode,
	    toggle: c.toggle
	  };
	}

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

	// MODULE: src/view/components/profiler/flamegraph/FlamegraphStore.ts
	function getRoot(tree, id) {
	  let item = tree.get(id);
	  let last = id;

	  while (item !== undefined) {
	    last = item.id;
	    item = tree.get(item.parent);
	  }

	  return last;
	}

	// MODULE: src/view/components/profiler/data/gradient.ts
	function getGradient(max, n) {
	  const maxColor = 9; // Amount of colors, see css variables

	  let i = 0;

	  if (!isNaN(n)) {
	    if (!isFinite(n)) {
	      i = max;
	    } else {
	      const slope = 1 * (maxColor - 0) / max - 0;
	      i = 0 + Math.round(slope * (n - 0));
	    }
	  } // i can be NaN at this point


	  if (isNaN(i)) return 0;
	  return Math.max(i, 0);
	}

	// MODULE: src/view/components/profiler/flamegraph/modes/patchTree.ts
	/**
	 * Place commit tree. When a node's children are bigger than it's parent,
	 * the parent and all next siblings will be expanded (pushed) to the right.
	 */

	function patchTree(commit) {
	  const {
	    nodes,
	    commitRootId
	  } = commit;
	  const idToTransform = new Map();
	  placeNode(commit, idToTransform, commit.rootId, 0, 1);
	  let direct = nodes.get(commitRootId);

	  if (direct !== undefined) {
	    while (direct = nodes.get(direct.parent)) {
	      const transform = idToTransform.get(direct.id);

	      if (transform) {
	        transform.commitParent = true;
	      }
	    }
	  }

	  return idToTransform;
	}

	function placeNode(commit, idToTransform, id, depth, scale) {
	  const node = commit.nodes.get(id);
	  if (!node) return;
	  let start = 0;

	  if (node.parent !== -1 && idToTransform.has(node.parent)) {
	    const parentPos = idToTransform.get(node.parent);
	    start = parentPos.x + parentPos.width;
	  }

	  const selfDuration = (commit.selfDurations.get(id) || 0) * scale;
	  const nodePos = {
	    id,
	    row: depth,
	    x: start,
	    commitParent: false,
	    maximized: false,
	    visible: false,
	    weight: commit.rendered.has(id) ? getGradient(50, selfDuration) : -1,
	    width: selfDuration
	  };
	  idToTransform.set(id, nodePos); // Enlarge to make node visible if width == 0

	  if (nodePos.width === 0) {
	    enlargeParents(commit, idToTransform, id, 0.01);
	  } // Find the total render time of children that rendered in case
	  // we're dealing with static subtrees. If ther are static subtrees
	  // we'll use the remaining space to place them.


	  let staticTreeTime = 0;
	  const nodeRendered = commit.rendered.has(id);

	  if (nodeRendered) {
	    let staticChildrenCount = 0;

	    for (let i = 0; i < node.children.length; i++) {
	      const childId = node.children[i];

	      if (!commit.rendered.has(childId)) {
	        staticChildrenCount++;
	        continue;
	      }
	    }

	    if (staticChildrenCount > 0) {
	      const availableStaticSpace = Math.max(0, selfDuration);
	      staticTreeTime = Math.max(0.01, availableStaticSpace / staticChildrenCount);
	    }
	  }

	  for (let i = 0; i < node.children.length; i++) {
	    const childId = node.children[i]; // Potentially scale static subtrees

	    let childSelfDuration = commit.selfDurations.get(childId) || 0;
	    let childScale = scale;

	    if (nodeRendered && !commit.rendered.has(childId)) {
	      const child = commit.nodes.get(childId);
	      if (!child) continue;
	      const duration = Math.max(0.01, child.endTime - child.startTime);
	      childScale = staticTreeTime / duration;
	    }

	    childSelfDuration *= childScale;
	    placeNode(commit, idToTransform, childId, depth + 1, childScale); // Expand parents upwards by self duration

	    enlargeParents(commit, idToTransform, id, childSelfDuration);
	  }
	}

	function enlargeParents(commit, idToTransform, id, value) {
	  let parentId = id;

	  while (parentId !== -1) {
	    const parent = commit.nodes.get(parentId);

	    if (!idToTransform.has(parentId)) {
	      break;
	    }

	    idToTransform.get(parentId).width += value;
	    parentId = parent.parent;
	  }
	}

	// MODULE: src/view/components/profiler/flamegraph/ranked/ranked-utils.ts
	const MIN_WIDTH = 4;
	/**
	 * Convert commit data into an array of position data to operate on.
	 */

	function toTransform(commit) {
	  return Array.from(commit.rendered.values()).sort((a, b) => commit.selfDurations.get(b) - commit.selfDurations.get(a)).map((id, i) => {
	    const selfDuration = commit.selfDurations.get(id);
	    return {
	      id,
	      width: selfDuration,
	      x: 0,
	      row: i,
	      maximized: false,
	      weight: getGradient(commit.maxSelfDuration, selfDuration),
	      visible: true,
	      commitParent: false
	    };
	  });
	}
	function placeRanked(selfDurations, sorted, selected, canvasWidth) {
	  const selectedDuration = selfDurations.get(selected.id) || 0.01;
	  const scale = (canvasWidth || 1) / selectedDuration;
	  let maximized = true;
	  return sorted.map(pos => {
	    // Ensure nodes are always visible
	    const width = maximized ? canvasWidth : Math.max(Math.max(pos.width, 0.01) * scale, MIN_WIDTH);
	    const posMaximized = maximized;

	    if (pos.id === selected.id) {
	      maximized = false;
	    }

	    return { ...pos,
	      width,
	      maximized: posMaximized
	    };
	  });
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

	function getMaxSelfDurationNode(commit) {
	  let id = commit.commitRootId;
	  let max = commit.selfDurations.get(id) || 0;
	  commit.rendered.forEach(rId => {
	    const t = commit.selfDurations.get(rId) || 0;

	    if (t > max) {
	      max = t;
	      id = rId;
	    }
	  });
	  return id;
	}

	function getCommitInitalSelectNodeId(commit, type) {
	  return type === FlamegraphType.FLAMEGRAPH ? commit.commitRootId : getMaxSelfDurationNode(commit);
	}
	/**
	 * Create a new profiler instance. It intentiall doesn't have
	 * any methods, to not go down the OOP rabbit hole.
	 */

	function createProfiler() {
	  const commits = valoo([]);
	  const isSupported = valoo(false); // Render Reasons

	  const supportsRenderReasons = valoo(false);
	  const renderReasons = valoo(new Map());
	  const captureRenderReasons = valoo(false);

	  const setRenderReasonCapture = v => {
	    captureRenderReasons.$ = v;
	  }; // Highlight updates


	  const showUpdates = valoo(false); // Selection

	  const activeCommitIdx = valoo(0);
	  const selectedNodeId = valoo(0);
	  const activeCommit = watch(() => {
	    return commits.$.length > 0 && commits.$[activeCommitIdx.$] || null;
	  });
	  const selectedNode = watch(() => {
	    return activeCommit.$ != null ? activeCommit.$.nodes.get(selectedNodeId.$) || null : null;
	  }); // Flamegraph

	  const flamegraphType = valoo(FlamegraphType.FLAMEGRAPH);
	  flamegraphType.on(() => {
	    selectedNodeId.$ = activeCommit.$ ? getCommitInitalSelectNodeId(activeCommit.$, flamegraphType.$) : -1;
	  }); // Recording

	  const isRecording = valoo(false);
	  isRecording.on(v => {
	    // Clear current selection and profiling data when
	    // a new recording starts.
	    if (v) {
	      commits.$ = [];
	      activeCommitIdx.$ = 0;
	      selectedNodeId.$ = 0;
	    } else {
	      // Reset selection when recording stopped
	      // and new profiling data was collected.
	      if (commits.$.length > 0) {
	        selectedNodeId.$ = getCommitInitalSelectNodeId(commits.$[0], flamegraphType.$);
	      }
	    }
	  }); // Render reasons

	  const activeReason = watch(() => {
	    if (activeCommit.$ !== null) {
	      const commitId = activeCommit.$.commitRootId;
	      const reason = renderReasons.$.get(commitId);

	      if (reason) {
	        return reason.get(selectedNodeId.$) || null;
	      }
	    }

	    return null;
	  }); // FlamegraphNode

	  const flamegraphNodes = watch(() => {
	    const commit = activeCommit.$;

	    if (!commit || flamegraphType.$ !== FlamegraphType.FLAMEGRAPH) {
	      return new Map();
	    }

	    for (let i = activeCommitIdx.$ - 1; i >= 0; i--) {
	      if (i >= commits.$.length) {
	        return new Map();
	      }
	    }

	    return patchTree(commit);
	  });
	  const rankedNodes = watch(() => {
	    const commit = activeCommit.$;

	    if (!commit || flamegraphType.$ !== FlamegraphType.RANKED) {
	      return [];
	    }

	    return toTransform(commit);
	  });
	  return {
	    supportsRenderReasons,
	    captureRenderReasons,
	    setRenderReasonCapture,
	    highlightUpdates: showUpdates,
	    isSupported,
	    isRecording,
	    commits,
	    activeCommitIdx,
	    activeCommit,
	    renderReasons,
	    activeReason,
	    selectedNodeId,
	    selectedNode,
	    // Rendering
	    flamegraphType,
	    flamegraphNodes,
	    rankedNodes
	  };
	}
	function stopProfiling(state) {
	  state.isRecording.$ = false;
	  state.activeCommitIdx.$ = 0;
	  state.selectedNodeId.$ = -1;
	}
	function resetProfiler(state) {
	  stopProfiling(state);
	  state.commits.$ = [];
	}
	function recordProfilerCommit(tree, profiler, rendered, commitRootId) {
	  const nodes = new Map(); // The time of the node that took the longest to render

	  let maxSelfDuration = 0;
	  let totalCommitDuration = 0;
	  const selfDurations = new Map();
	  const rootId = getRoot(tree, commitRootId); // Find previous commit to copy over timing data later

	  const commits = profiler.commits.$;
	  let prevCommit;

	  for (let i = commits.length - 1; i >= 0; i--) {
	    if (commits[i].rootId === rootId) {
	      prevCommit = commits[i];
	      break;
	    }
	  } // Traverse nodes from the actual root to be able to build
	  // the full tree.


	  const stack = [rootId];
	  let id;

	  while (id = stack.pop()) {
	    const node = tree.get(id);
	    if (!node) continue;

	    if (rendered.has(node.id)) {
	      // Collect the time a node took to render excluding its children
	      let selfDuration = node.endTime - node.startTime;

	      for (let i = 0; i < node.children.length; i++) {
	        const childId = node.children[i];

	        if (rendered.has(childId)) {
	          const child = tree.get(childId);
	          selfDuration -= child.endTime - child.startTime;
	        }
	      }

	      if (selfDuration > maxSelfDuration) {
	        maxSelfDuration = selfDuration;
	      }

	      totalCommitDuration += selfDuration;
	      selfDurations.set(node.id, selfDuration);
	    } else if (prevCommit) {
	      // Otherwise just copy over the duration from the previous commit
	      // of that root id.
	      selfDurations.set(node.id, prevCommit.selfDurations.get(node.id) || 0);
	    }

	    nodes.set(node.id, node);
	    stack.push(...node.children);
	  } // Very useful to grab test cases from live websites
	  // console.groupCollapsed("patch");
	  // console.log("====", commitRoot.name, commitRootId);
	  // console.log(JSON.stringify(Array.from(nodes.values())));
	  // console.groupEnd();


	  profiler.commits.update(arr => {
	    arr.push({
	      rootId: getRoot(tree, commitRootId),
	      commitRootId: commitRootId,
	      rendered,
	      nodes,
	      maxSelfDuration,
	      duration: totalCommitDuration,
	      selfDurations
	    });
	  });
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

	// MODULE: src/view/store/props.ts
	const PROPS_LIMIT = 7;
	function isCollapsed(ids, id) {
	  return id !== "root" && ids.indexOf(id) === -1;
	}
	/**
	 * Props, Context and State are passed as serialized objects.
	 * We just need to convert that into a tree-like structure
	 * for rendering.
	 */

	function parseObjectState(data, uncollapsed) {
	  if (data != null) {
	    const tree = new Map();
	    tree.set("root", {
	      children: [],
	      depth: 0,
	      name: "root",
	      editable: false,
	      id: "root",
	      type: "object",
	      value: null,
	      meta: null
	    });
	    parseProps(data, "root", PROPS_LIMIT, 0, "root", tree);
	    const items = flattenChildren(tree, "root", id => {
	      return tree.get(id).children.length > 0 && isCollapsed(uncollapsed, id);
	    });
	    return items.slice(1).map(id => tree.get(id));
	  }

	  return [];
	}
	function filterCollapsed(items, uncollapsed) {
	  const skip = [];
	  const visible = new Set();
	  const uncoll = new Set(uncollapsed);
	  return items.filter(node => {
	    if (skip.some(x => node.id.startsWith(x))) {
	      return false;
	    }

	    if (node.id === "root" || uncoll.has(node.id)) {
	      node.children.forEach(childId => visible.add(childId));
	    } else if (node.children.length) {
	      skip.push(node.id);
	    }

	    return true;
	  });
	}

	// MODULE: src/view/store/index.ts
	function createStore() {
	  const listeners = [];

	  const notify = (name, data) => {
	    listeners.forEach(fn => fn && fn(name, data));
	  };

	  const debugMode = valoo(!!false);
	  const nodes = valoo(new Map());
	  const roots = valoo([]); // Toggle

	  const isPicking = valoo(false);
	  const filterState = createFilterStore(notify); // List

	  const collapsed = valoo(new Set());
	  const collapser = createCollapser(collapsed);
	  const nodeList = watch(() => {
	    return roots.$.map(root => {
	      const items = flattenChildren(nodes.$, root, id => collapser.collapsed.$.has(id));

	      if (filterState.filterRoot.$) {
	        return items.slice(1);
	      }

	      return items;
	    }).reduce((acc, val) => acc.concat(val), []);
	  }); // Sidebar

	  const sidebar = {
	    props: {
	      uncollapsed: valoo([]),
	      items: valoo([])
	    },
	    state: {
	      uncollapsed: valoo([]),
	      items: valoo([])
	    },
	    context: {
	      uncollapsed: valoo([]),
	      items: valoo([])
	    },
	    hooks: {
	      uncollapsed: valoo([]),
	      items: valoo([])
	    }
	  };
	  const inspectData = valoo(null);
	  watch(() => {
	    const data = inspectData.$ ? inspectData.$.props : null;
	    sidebar.props.items.$ = parseObjectState(data, sidebar.props.uncollapsed.$);
	  });
	  watch(() => {
	    const data = inspectData.$ ? inspectData.$.state : null;
	    sidebar.state.items.$ = parseObjectState(data, sidebar.state.uncollapsed.$);
	  });
	  watch(() => {
	    const data = inspectData.$ ? inspectData.$.context : null;
	    sidebar.context.items.$ = parseObjectState(data, sidebar.context.uncollapsed.$);
	  });
	  const supportsHooks = valoo(false);
	  watch(() => {
	    if (supportsHooks) {
	      const items = inspectData.$ && inspectData.$.hooks ? inspectData.$.hooks : [];
	      sidebar.hooks.items.$ = filterCollapsed(items, sidebar.hooks.uncollapsed.$).slice(1);
	    }
	  });
	  const selection = createSelectionStore(nodeList);
	  const stats = valoo(null);
	  return {
	    supports: {
	      hooks: supportsHooks
	    },
	    stats: {
	      isRecording: valoo(false),
	      data: stats
	    },
	    debugMode,
	    activePanel: valoo(Panel.ELEMENTS),
	    profiler: createProfiler(),
	    notify,
	    nodeList,
	    inspectData,
	    isPicking,
	    roots,
	    nodes,
	    collapser,
	    search: createSearchStore(nodes, nodeList),
	    filter: filterState,
	    selection,
	    theme: valoo("auto"),
	    sidebar,

	    clear() {
	      roots.$ = [];
	      nodes.$ = new Map();
	      selection.selected.$ = -1;
	      collapser.collapsed.$ = new Set();
	      stats.$ = null;
	    },

	    subscribe(fn) {
	      const idx = listeners.push(fn);
	      return () => listeners[idx] = null;
	    },

	    emit: notify
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
	    t = new Map();

	function e (s) {
	  var r = t.get(this);
	  return r || (r = new Map(), t.set(this, r)), (r = n(this, r.get(s) || (r.set(s, r = function (n) {
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
	var m = e.bind(v$1);

	var s$n = {"actions":"Actions-module_actions__3EP54","sep":"Actions-module_sep__2cw8m"};

	// MODULE: src/view/components/Actions.tsx
	function Actions(props) {
	  return m`<div class=${`${s$n.actions} ${props.class || ""}`}>${props.children}</div>`;
	}
	function ActionSeparator() {
	  return m`<div class=${s$n.sep}/>`;
	}

	var s$m = {"root":"IconBtn-module_root__3KzOY","inner":"IconBtn-module_inner__1Hh9Y","secondary":"IconBtn-module_secondary__3k-mL","bg":"IconBtn-module_bg__2mOwW"};

	// MODULE: src/view/components/IconBtn.tsx
	function IconBtn(props) {
	  return m`<button type="button" class=${`${s$m.root} + ${props.styling === "secondary" ? s$m.secondary : ""}`} data-active=${props.active} title=${props.title} disabled=${props.disabled} data-testid=${props.testId} onClick=${e => {
    e.stopPropagation();
    if (props.onClick) props.onClick();
  }}><span class=${s$m.inner} tabIndex=${-1} style=${props.color ? "color: " + props.color : undefined}>${props.children}<span class=${s$m.bg}/></span></button>`;
	}

	// MODULE: src/view/components/icons.tsx
	const sizes = {
	  xs: ".8rem",
	  s: "1rem",
	  m: "2rem",
	  l: "4rem"
	};
	function createSvgIcon(size, children) {
	  return m`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style=${`width: ${sizes[size]}; height: ${sizes[size]}`}>${children}</svg>`;
	}
	function Undo({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" fill="currentColor"/>`);
	}
	function AddCircle({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<g><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/><path d="M0 0h24v24H0z" fill="none"/></g>`);
	}
	function BugIcon({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M20 8h-2.81a5.985 5.985 0 0 0-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5c-.49 0-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z" fill="currentColor"/>`);
	}
	function InspectNativeIcon({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<${p$1}><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/></${p$1}>`);
	}
	function Remove({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<g><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/><path d="M0 0h24v24H0z" fill="none"/></g>`);
	}
	function Refresh({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>`);
	}
	function Picker() {
	  return m`<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g stroke="currentColor"><path stroke-width=".291" fill="currentColor" fill-rule="nonzero" stroke-linecap="round" stroke-linejoin="round" d="M6 6l3.014 9 2.508-3.533L15 8.791z"/><path stroke-width="2" d="M10.417 10.417l2.87 2.87L15 15"/></g><path d="M12.188 0A2.812 2.812 0 0 1 15 2.813V5h-1V2.857A1.857 1.857 0 0 0 12.143 1H2.857A1.857 1.857 0 0 0 1 2.857v9.286C1 13.169 1.831 14 2.857 14H5v1H2.812A2.812 2.812 0 0 1 0 12.187V2.813A2.812 2.812 0 0 1 2.813 0h9.374z" fill="currentColor" fill-rule="nonzero"/></g></svg>`;
	}
	function KeyboardDown({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>`);
	}
	function KeyboardUp({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" fill="currentColor"/>`);
	}
	function Close({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>`);
	}
	function Search({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>`);
	}
	function FilterList({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="currentColor"/>`);
	}
	function CheckboxChecked({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>`);
	}
	function CheckboxUnChecked({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<${p$1}><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" fill="currentColor"/><path d="M0 0h24v24H0z" fill="none"/></${p$1}>`);
	}
	function FileCopy({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm-1 4l6 6v10c0 1.1-.9 2-2 2H7.99C6.89 23 6 22.1 6 21l.01-14c0-1.1.89-2 1.99-2h7zm-1 7h5.5L14 6.5V12z" fill="currentColor"/>`);
	}
	function ArrowBack({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<g><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/></g>`);
	}
	function ArrowForward({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<g><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/></g>`);
	}
	function RecordIcon({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<circle fill="currentColor" cx="12" cy="12" r="8"/>`);
	}
	function NotInterested({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" fill="currentColor"/>`);
	}
	function SortIcon({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<${p$1}><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" fill="currentColor"/><path d="M0 0h24v24H0z" fill="none"/></${p$1}>`);
	}
	function FireIcon({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<${p$1}><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" fill="currentColor"/><path d="M0 0h24v24H0z" fill="none"/></${p$1}>`);
	}
	function CodeIcon({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<${p$1}><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"/></${p$1}>`);
	}
	function SuspendIcon({
	  size = "s"
	}) {
	  return createSvgIcon(size, m`<${p$1}><path d="M0 0h24v24H0z" fill="none"/><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="currentColor"/></${p$1}>`);
	}

	var s$l = {"btnIcon":"TreeBar-module_btnIcon__3C1ae","btnWrapper":"TreeBar-module_btnWrapper__6WSvm","searchContainer":"TreeBar-module_searchContainer__2MRTP","search":"TreeBar-module_search__B4HJi","searchCounter":"TreeBar-module_searchCounter__2RT5-","filterBtnWrapper":"TreeBar-module_filterBtnWrapper__2RYHW","filter":"TreeBar-module_filter__1nYSK","filterRow":"TreeBar-module_filterRow__2aPry","filterCheck":"TreeBar-module_filterCheck__1PctG","filterValue":"TreeBar-module_filterValue__5YZLS","filterValueText":"TreeBar-module_filterValueText__2RILs","filterAdd":"TreeBar-module_filterAdd__2cQE3","filterName":"TreeBar-module_filterName__3ryz4","filterActions":"TreeBar-module_filterActions__3hgvw","filterSubmitBtn":"TreeBar-module_filterSubmitBtn__-B5-8","removeWrapper":"TreeBar-module_removeWrapper__XSV28","vSep":"TreeBar-module_vSep__2A1Nd"};

	// MODULE: src/view/components/OutsideClick.tsx
	function OutsideClick(props) {
	  const ref = s$o();
	  y(() => {
	    if (!ref.current) return;

	    const listener = e => {
	      if (ref.current && !ref.current.contains(e.target)) {
	        props.onClick();
	      }
	    };

	    const root = ref.current.getRootNode();
	    root.addEventListener("click", listener);
	    return () => root.removeEventListener("click", listener);
	  }, [props.children, ref.current]);
	  return m`<div ref=${ref} class=${props.class} style=${props.style}>${props.children}</div>`;
	}

	// MODULE: src/view/components/elements/TreeBar.tsx
	function TreeBar() {
	  const store = useStore();
	  const isPicking = useObserver(() => store.isPicking.$);
	  const {
	    value,
	    count,
	    selected,
	    goPrev,
	    goNext
	  } = useSearch();
	  const [filterVisible, setFilterVisible] = l(false);

	  const onKeyDown = e => {
	    if (e.key === "Enter") {
	      e.preventDefault();

	      if (e.shiftKey) {
	        goPrev();
	      } else {
	        goNext();
	      }
	    }
	  };

	  const searchActive = value !== "";
	  return m`<${Actions}><div class=${s$l.btnWrapper}><${IconBtn} active=${isPicking} title="Pick a Component from the page" testId="inspect-btn" onClick=${() => {
    store.isPicking.$ = !isPicking;
    store.notify(!isPicking ? "start-picker" : "stop-picker", null);
  }}><${Picker}/></${IconBtn}></div><${ActionSeparator}/><div class=${s$l.searchContainer}><${Search} size="xs"/><input class=${s$l.search} type="text" data-testid="element-search" placeholder="Search (text or /regex/)" value=${value} onKeyDown=${onKeyDown} onInput=${e => store.search.onChange(e.target.value)}/>${searchActive && m`<div class=${s$l.searchCounter} data-testid="search-counter">${count > 0 ? selected + 1 : 0} | ${count}</div>`}</div><div class=${s$l.btnWrapper}><${IconBtn} onClick=${store.search.selectNext} title="Select next result" disabled=${!searchActive}><${KeyboardDown}/></${IconBtn}></div><div class=${s$l.btnWrapper}><${IconBtn} onClick=${store.search.selectPrev} title="Select previous result" disabled=${!searchActive}><${KeyboardUp}/></${IconBtn}></div><div class=${s$l.btnWrapper}><${IconBtn} onClick=${store.search.reset} title="Clear search input" disabled=${!searchActive}><${Close}/></${IconBtn}></div><${ActionSeparator}/><div class=${s$l.btnWrapper}><${OutsideClick} onClick=${() => setFilterVisible(false)} class=${s$l.filterBtnWrapper}><${IconBtn} title="Filter Components" active=${filterVisible} testId="filter-menu-button" onClick=${() => setFilterVisible(!filterVisible)}><${FilterList}/></${IconBtn}>${filterVisible && m`<${FilterPopup}/>`}</${OutsideClick}></div></${Actions}>`;
	}

	function FilterCheck({
	  checked,
	  label,
	  onInput
	}) {
	  return m`<label class=${s$l.filterRow}><span class=${s$l.filterCheck}><input type="checkbox" checked=${checked} onInput=${e => onInput(e.target.checked)}/>${checked ? m`<${CheckboxChecked}/>` : m`<${CheckboxUnChecked}/>`}</span><span class=${`${s$l.filterValue} ${s$l.filterValueText}`}>${label}</span></label>`;
	}

	function FilterPopup() {
	  const store = useStore();
	  const [filterDom, setFilterDom] = l(store.filter.filterDom.$);
	  const [filterFragment, setFilterFragment] = l(store.filter.filterFragment.$);
	  const [filterHoc, setFilterHoc] = l(store.filter.filterHoc.$);
	  const [filterRoot, setFilterRoot] = l(store.filter.filterRoot.$);
	  const [filters, setFilters] = l(store.filter.filters.$);
	  return m`<div class=${s$l.filter} data-testid="filter-popup"><form onSubmit=${e => {
    e.preventDefault();
    store.filter.filterDom.$ = filterDom;
    store.filter.filterFragment.$ = filterFragment;
    store.filter.filterRoot.$ = filterRoot;
    store.filter.filterHoc.$ = filterHoc;
    store.filter.filters.$ = filters;
    store.filter.submit();
  }}><${FilterCheck} label="Roots" onInput=${checked => setFilterRoot(checked)} checked=${filterRoot}/><${FilterCheck} label="Fragments" onInput=${checked => setFilterFragment(checked)} checked=${filterFragment}/><${FilterCheck} label="HOC-Components" onInput=${checked => setFilterHoc(checked)} checked=${filterHoc}/><${FilterCheck} label="DOM nodes" onInput=${checked => setFilterDom(checked)} checked=${filterDom}/>${filters.map((x, i) => {
    return m`<div key=${i} class=${s$l.filterRow}><label class=${s$l.filterCheck}><input type="checkbox" checked=${x.enabled} onInput=${e => {
      const copy = [...filters];
      copy[i].enabled = e.target.checked;
      setFilters(copy);
    }}/>${x.enabled ? m`<${CheckboxChecked}/>` : m`<${CheckboxUnChecked}/>`}</label><span class=${s$l.filterValue}><input className=${s$l.filterName} type="text" placeholder="MyComponent" value=${x.value} onInput=${e => {
      const copy = [...filters];
      copy[i].value = e.target.value;
      setFilters(copy);
    }}/></span><span class=${s$l.removeWrapper}><${IconBtn} title="Remove filter" styling="secondary" onClick=${() => {
      const idx = filters.indexOf(x);

      if (idx > -1) {
        const copy = [...filters];
        copy.splice(idx, 1);
        setFilters(copy);
      }
    }}><${Remove}/></${IconBtn}></span></div>`;
  })}<div class=${s$l.vSep}/><div class=${s$l.filterActions}><${IconBtn} styling="secondary" title="Add new filter" testId="add-filter" onClick=${() => setFilters([...filters, {
    enabled: false,
    value: ""
  }])}><span class=${s$l.filterAdd}><span class=${s$l.filterCheck}><${AddCircle}/></span>Add filter</span></${IconBtn}><button type="submit" class=${s$l.filterSubmitBtn} data-testid="filter-update">Update</button></div></form></div>`;
	}

	var s$k = {"tree":"TreeView-module_tree__3aPlM","pane":"TreeView-module_pane__1iiz8","empty":"TreeView-module_empty__16S0S","emptyInner":"TreeView-module_emptyInner__1PH2b","emptyDescription":"TreeView-module_emptyDescription__2fcs6","bgLogo":"TreeView-module_bgLogo__2eOXh","item":"TreeView-module_item__1fccQ","itemHeader":"TreeView-module_itemHeader__3xWBi","toggle":"TreeView-module_toggle__HM1Uz","noToggle":"TreeView-module_noToggle__2OKG9","name":"TreeView-module_name__3rnAD","dimmer":"TreeView-module_dimmer__1dHtL","keyLabel":"TreeView-module_keyLabel__nnSv3","key":"TreeView-module_key__wZgmb","mark":"TreeView-module_mark__2h0Ul","markSelected":"TreeView-module_markSelected__2QJ6h","hocs":"TreeView-module_hocs__19Hpr","rootLabel":"TreeView-module_rootLabel__3VX2I"};

	// MODULE: src/view/components/tree/keyboard.ts
	function useKeyListNav(opts) {
	  return A(e => {
	    if (/^Arrow/.test(e.key)) e.preventDefault();
	    const sel = opts.selected;
	    const {
	      onCollapse,
	      canCollapse,
	      checkCollapsed: checkCollapssed,
	      onPrev,
	      onNext
	    } = opts;

	    if (e.key === "ArrowLeft") {
	      if (canCollapse(sel) && !checkCollapssed(sel)) {
	        return onCollapse(sel, true);
	      }

	      onPrev(sel);
	    } else if (e.key === "ArrowUp") {
	      onPrev(sel);
	    } else if (e.key === "ArrowRight") {
	      if (canCollapse(sel) && checkCollapssed(sel)) {
	        return onCollapse(sel, false);
	      }

	      onNext(sel);
	    } else if (e.key === "ArrowDown") {
	      onNext(sel);
	    }
	  }, [opts.selected]);
	}

	// MODULE: src/view/components/elements/background-logo.tsx
	function BackgroundLogo(props) {
	  return m`<svg width="149" height="172" xmlns="http://www.w3.org/2000/svg" class=${props.class}><path d="M73.902.275L0 43.192v85.835l73.902 42.918 73.902-42.918V43.192L73.902.275zM36.103 38.4c3.978.195 8.357 1.076 13.058 2.527 7.6 2.346 16.061 6.389 24.74 11.608 8.679-5.218 17.143-9.263 24.741-11.608 6.268-1.935 11.968-2.85 16.897-2.491 4.929.359 9.239 2.084 11.943 5.565 2.705 3.483 3.324 8.107 2.477 13.003-.847 4.898-3.099 10.239-6.481 15.887-2.558 4.272-5.966 8.73-9.752 13.218 3.786 4.488 7.194 8.934 9.752 13.205 3.382 5.649 5.634 11.002 6.481 15.9.847 4.896.228 9.52-2.477 13.002-2.704 3.482-7.014 5.196-11.943 5.554-4.929.358-10.63-.544-16.897-2.479-7.6-2.346-16.072-6.388-24.752-11.608-8.674 5.215-17.134 9.263-24.729 11.608-6.267 1.935-11.968 2.837-16.897 2.48-4.928-.36-9.239-2.073-11.943-5.555-2.705-3.482-3.324-8.106-2.477-13.003s3.099-10.25 6.482-15.899c2.557-4.271 5.966-8.717 9.751-13.205-3.785-4.488-7.194-8.946-9.751-13.218-3.383-5.648-5.635-10.99-6.482-15.887-.846-4.896-.228-9.52 2.477-13.002 2.704-3.482 7.015-5.208 11.943-5.566 1.233-.09 2.514-.1 3.84-.036zm-.272 5.363a25.89 25.89 0 0 0-3.187.024c-3.965.288-6.584 1.526-8.129 3.516s-2.091 4.833-1.41 8.772c.681 3.939 2.645 8.793 5.794 14.052 2.256 3.767 5.296 7.773 8.674 11.834 5.522-6.018 11.997-12.05 19.29-17.782 3.955-3.108 7.928-5.915 11.884-8.51-7.518-4.32-14.753-7.643-21.15-9.617-4.376-1.351-8.371-2.116-11.766-2.289zm76.141 0c-3.395.173-7.39.938-11.766 2.289-6.397 1.975-13.643 5.297-21.162 9.618 3.957 2.594 7.93 5.401 11.885 8.51 7.293 5.73 13.78 11.764 19.302 17.781 3.377-4.06 6.417-8.067 8.673-11.835 3.149-5.258 5.113-10.112 5.794-14.051.681-3.94.136-6.782-1.41-8.772-1.545-1.99-4.164-3.227-8.128-3.516a25.821 25.821 0 0 0-3.188-.024zM73.89 58.817c-4.557 2.873-9.161 5.98-13.745 9.582-7.278 5.72-13.67 11.757-19.076 17.711 5.406 5.953 11.798 11.979 19.076 17.699 4.588 3.605 9.196 6.719 13.757 9.594 4.56-2.875 9.158-5.99 13.745-9.594 7.278-5.72 13.682-11.746 19.088-17.699-5.406-5.953-11.81-11.979-19.088-17.699-4.59-3.607-9.194-6.718-13.757-9.594zm.012 15.887a11.3 11.3 0 0 1 8.012 3.343 11.434 11.434 0 0 1 3.316 8.063c-.004 6.291-5.073 11.39-11.328 11.394a11.3 11.3 0 0 1-8.016-3.335 11.433 11.433 0 0 1-3.324-8.059 11.434 11.434 0 0 1 3.32-8.067 11.3 11.3 0 0 1 8.02-3.339zM37.573 90.257c-3.377 4.061-6.417 8.068-8.673 11.835-3.15 5.259-5.125 10.101-5.806 14.04-.681 3.94-.124 6.794 1.421 8.784 1.546 1.99 4.164 3.215 8.129 3.504 3.964.288 9.119-.452 14.953-2.253 6.401-1.976 13.64-5.306 21.163-9.63-3.96-2.596-7.939-5.387-11.897-8.498-7.293-5.73-13.768-11.764-19.29-17.782zm72.658 0c-5.522 6.018-12.009 12.051-19.302 17.782-3.958 3.11-7.937 5.902-11.897 8.498 7.524 4.324 14.774 7.654 21.175 9.63 5.834 1.801 10.988 2.541 14.953 2.253 3.965-.289 6.583-1.515 8.128-3.504 1.546-1.99 2.091-4.845 1.41-8.784-.68-3.939-2.645-8.781-5.794-14.04-2.256-3.767-5.296-7.774-8.673-11.835z" fill="currentColor" fill-rule="nonzero"/></svg>`;
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

	// MODULE: src/view/components/elements/VirtualizedList.tsx
	function useVirtualizedList({
	  rowHeight,
	  minBufferCount,
	  items,
	  container,
	  renderRow
	}) {
	  const [height, setHeight] = l(0);
	  const [scroll, setScroll] = l(0);
	  const bufferCount = height > 0 ? Math.max(minBufferCount, Math.ceil(height / rowHeight / 2)) : minBufferCount;
	  let idx = Math.max(0, Math.floor(scroll / rowHeight) - bufferCount);
	  const max = idx + Math.ceil(height / rowHeight) + bufferCount;
	  let top = idx * rowHeight; // A bit hacky, we bascially want to ensure that `scrollToItem`
	  // is ALWAYS stable

	  const timeoutRef = s$o(null);
	  const scrollRef = s$o(scroll);
	  const itemsRef = s$o(items);
	  const heightRef = s$o(height);
	  scrollRef.current = scroll;
	  itemsRef.current = items;
	  heightRef.current = height;
	  const scrollToItem = A(item => {
	    const scroll = scrollRef.current;
	    const items = itemsRef.current;
	    const height = heightRef.current;

	    if (timeoutRef.current) {
	      clearTimeout(timeoutRef.current);
	    }

	    const nextIdx = items.findIndex(t => t === item);
	    if (nextIdx < 0) return; // Check if the item we want to scroll to is already in view

	    const pos = Math.floor(nextIdx * rowHeight);
	    const EDGE = rowHeight / 2;
	    const isBefore = scroll + EDGE > pos;
	    const isAfter = scroll + height - EDGE < pos;

	    if (isBefore || isAfter) {
	      // Clamp to available range to avoid overflow
	      const maxScroll = Math.floor(rowHeight * items.length - height);
	      const nextPos = Math.max(0, Math.min(isBefore ? pos : pos - height + rowHeight * 2, maxScroll)); // Debounce scroll to avoid flickering when quickly hovering
	      // a bunch of elements

	      timeoutRef.current = setTimeout(() => {
	        if (container.current) {
	          container.current.scrollTop = nextPos;
	        }
	      }, 100);
	    }
	  }, [rowHeight]);
	  y(() => {
	    const scrollFn = e => {
	      const top = e.target.scrollTop; // Ignore overscroll

	      if (top >= 0) {
	        setScroll(top);
	      }
	    };

	    if (container.current) {
	      container.current.addEventListener("scroll", scrollFn);
	    }

	    return () => {
	      if (container.current) {
	        container.current.removeEventListener("scroll", scrollFn);
	      }
	    };
	  }, [container.current]);
	  useResize(() => {
	    if (container.current) {
	      setHeight(container.current.clientHeight);
	    }
	  }, [], true);
	  const vnodes = d(() => {
	    const vnodes = [];

	    while (idx < items.length && idx <= max) {
	      vnodes.push(renderRow(items[idx], idx, top));
	      top += rowHeight;
	      idx++;
	    }

	    return vnodes;
	  }, [items, idx, max, top]);
	  return {
	    containerHeight: rowHeight * items.length,
	    children: vnodes,
	    scrollToItem
	  };
	}

	// MODULE: src/view/components/elements/useAutoIndent.ts
	const INITIAL = 24;
	const RIGHT_MARGIN = 16;
	function useAutoIndent(container, deps) {
	  const indent = s$o(INITIAL);
	  const [available, setAvailable] = l(0);
	  const cacheRef = s$o(new Map());
	  useResize(() => {
	    indent.current = INITIAL;

	    if (container.current) {
	      setAvailable(container.current.clientWidth);
	    }
	  }, [], true);
	  h(() => {
	    if (container.current) {
	      let space = available;

	      if (available === 0) {
	        space = container.current.clientWidth;
	      }

	      const cache = cacheRef.current;
	      const {
	        childNodes
	      } = container.current;
	      let nextIndent = indent.current;

	      for (let i = 0; i < childNodes.length; i++) {
	        const child = childNodes[i];
	        if (!child) continue;
	        const id = child.getAttribute("data-id");
	        if (!id) continue; // Measure the actual first child

	        const el = child.firstChild;
	        if (!el) continue;
	        let width = cache.get(id);

	        if (!width) {
	          width = el.offsetWidth + RIGHT_MARGIN;
	          cache.set(id, width);
	        }

	        const depth = +(child.getAttribute("data-depth") || 0);
	        nextIndent = Math.min(nextIndent, Math.max(0, (space - width) / depth));
	      }

	      container.current.style.setProperty("--indent-depth", `${nextIndent}px`);
	      indent.current = nextIndent;
	    }
	  }, [...deps, available]);
	  return indent;
	}

	var s$j = {"root":"HocPanel-module_root__2kcEK","hoc":"HocPanel-module_hoc__hHyxK","small":"HocPanel-module_small__1xxBu"};

	// MODULE: src/view/components/sidebar/HocPanel.tsx
	function Hoc(props) {
	  return m`<span class=${`${s$j.hoc} ${props.small ? s$j.small : ""} hoc-item`}>${props.children}</span>`;
	}
	function HocPanel(props) {
	  return m`<div class=${s$j.root} data-testid="hoc-panel">${props.hocs.map((hoc, i) => m`<${Hoc} key=${i}>${hoc}</${Hoc}>`)}</div>`;
	}

	// MODULE: src/view/components/elements/TreeView.tsx
	const ROW_HEIGHT$1 = 18;
	const highlightNode$1 = debounce((notify, id) => notify("highlight", id), 100);
	function TreeView() {
	  const store = useStore();
	  const nodeList = useObserver(() => store.nodeList.$);
	  const roots = useObserver(() => store.roots.$);
	  const {
	    collapseNode,
	    collapsed
	  } = useCollapser();
	  const {
	    selected,
	    selectNext,
	    selectPrev
	  } = useSelection();
	  const onKeyDown = useKeyListNav({
	    selected,
	    onCollapse: collapseNode,
	    canCollapse: id => {
	      const node = store.nodes.$.get(id);
	      return node ? node.children.length > 0 : false;
	    },
	    checkCollapsed: id => collapsed.has(id),
	    onNext: () => {
	      selectNext();
	      const s = store.selection.selected.$;
	      highlightNode$1(store.notify, s);
	      store.notify("inspect", s);
	    },
	    onPrev: () => {
	      selectPrev();
	      const s = store.selection.selected.$;
	      highlightNode$1(store.notify, s);
	      store.notify("inspect", s);
	    }
	  });
	  const onMouseLeave = A(() => highlightNode$1(store.notify, null), []);
	  const ref = s$o(null);
	  const paneRef = s$o(null);
	  const search = useSearch();
	  const [updateCount, setUpdateCount] = l(0);
	  useResize(() => setUpdateCount(updateCount + 1), [updateCount]);
	  const {
	    children: listItems,
	    containerHeight,
	    scrollToItem
	  } = useVirtualizedList({
	    rowHeight: ROW_HEIGHT$1,
	    minBufferCount: 5,
	    container: ref,
	    items: nodeList,
	    // eslint-disable-next-line react/display-name
	    renderRow: (id, _, top) => m`<${TreeItem} key=${id} id=${id} top=${top}/>`
	  }); // Scroll to item on selection change

	  y(() => {
	    scrollToItem(selected);
	  }, [selected, scrollToItem]); // Scroll to item on search value change

	  const searchSelectedId = search.selectedId;
	  y(() => {
	    scrollToItem(searchSelectedId);
	  }, [searchSelectedId, scrollToItem]);
	  useAutoIndent(paneRef, [listItems]); // When the devtools is connected, but nothing has been sent to the panel yet

	  const isOnlyConnected = nodeList.length === 0 && roots.length === 0; // When client sent messages, but no nodes were sent due to filters.

	  const hasNoResults = nodeList.length === 0 && roots.length > 0;
	  return m`<div ref=${ref} tabIndex=${0} class=${s$k.tree} onKeyDown=${onKeyDown} data-tree=${true} onMouseLeave=${onMouseLeave}>${isOnlyConnected && m`<div class=${s$k.empty} data-testid="msg-only-connected"><div class=${s$k.emptyInner}><${BackgroundLogo} class=${s$k.bgLogo}/><p><b>Connected</b>, listening for Preact operations...</p><p class=${s$k.emptyDescription}><small>If this message doesn't go away Preact started rendering before devtools was initialized. You can fix this by adding the <code>preact/debug</code> or <code>preact/devtools</code> import at the <b>top</b> of your entry file.</small></p></div></div>`}${hasNoResults && m`<div class=${s$k.empty} data-testid="msg-no-results"><div class=${s$k.emptyInner}><${BackgroundLogo} class=${s$k.bgLogo}/><p><b>Nothing to show</b></p><p class=${s$k.emptyDescription}><small>No nodes visible with active filters. To fix this update filters or make sure to render at least one component in your app.</small></p></div></div>`}<div class=${s$k.pane} ref=${paneRef} data-testid="elements-tree" style=${`height: ${containerHeight}px`}>${listItems}<${HighlightPane} treeDom=${ref.current}/></div></div>`;
	}
	function MarkResult(props) {
	  const {
	    regex,
	    selectedId
	  } = useSearch();
	  const {
	    text,
	    id
	  } = props;
	  const isActive = id === selectedId;

	  if (regex != null && regex.test(text)) {
	    const m$1 = text.match(regex);
	    const idx = m$1.index || 0;
	    const start = idx > 0 ? text.slice(0, idx) : "";
	    const end = idx < text.length ? text.slice(idx + m$1[0].length) : "";
	    return m`<span data-testid="node-name">${start}<mark class=${`${s$k.mark} ${isActive ? s$k.markSelected : ""}`} data-marked=${isActive}>${m$1[0]}</mark>${end}</span>`;
	  }

	  return m`<span data-testid="node-name">${text}</span>`;
	}
	function TreeItem(props) {
	  const {
	    id
	  } = props;
	  const store = useStore();
	  const as = useSelection();
	  const {
	    collapsed,
	    toggle
	  } = useCollapser();
	  const node = useObserver(() => store.nodes.$.get(id) || null);
	  const filterRoot = useObserver(() => store.filter.filterRoot.$);
	  const filterHoc = useObserver(() => store.filter.filterHoc.$);
	  const roots = useObserver(() => store.roots.$);

	  const onToggle = () => toggle(id);

	  const ref = s$o();
	  if (!node) return null;
	  const isRoot = node.parent === -1 && roots.includes(node.id);
	  return m`<div ref=${ref} class=${s$k.item} data-testid="tree-item" data-name=${node.name} onClick=${() => {
    as.selectById(id);
    store.notify("inspect", id);
  }} onMouseEnter=${() => highlightNode$1(store.notify, id)} data-selected=${as.selected === id} data-id=${id} data-depth=${node.depth} style=${`top: ${props.top}px;`}><div class=${s$k.itemHeader} style=${`transform: translate3d(calc(var(--indent-depth) * ${node.depth + (filterRoot ? -1 : 0)}), 0, 0);`}>${node.children.length > 0 && m`<button class=${s$k.toggle} data-collapsed=${collapsed.has(id)} onClick=${onToggle}><${Arrow}/></button>`}${node.children.length === 0 && m`<div class=${s$k.noToggle}/>`}<span class=${s$k.name}><${MarkResult} text=${node.name} id=${id}/>${node.key ? m`<span class=${s$k.keyLabel}> key="<span class=${s$k.key}>${node.key.length > 15 ? `${node.key.slice(0, 15)}…` : node.key}</span>"</span>` : ""}${filterHoc && node.hocs && node.hocs.length > 0 && m`<${HocLabels} hocs=${node.hocs} nodeId=${id}/>`}${isRoot ? m`<span class=${s$k.rootLabel}>(Root)</span>` : ""}</span></div></div>`;
	}
	function HocLabels({
	  hocs,
	  nodeId,
	  canMark = true
	}) {
	  return m`<span class=${s$k.hocs} data-testid="hoc-labels">${hocs.map((hoc, i) => {
    return m`<${Hoc} key=${i} small>${canMark ? m`<${MarkResult} text=${hoc} id=${nodeId}/>` : hoc}</${Hoc}>`;
  })}</span>`;
	}
	function Arrow() {
	  return m`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 4.233 4.233"><path d="M1.124 1.627H3.11l-.992 1.191-.993-1.19" fill="currentColor"/></svg>`;
	}
	function HighlightPane(props) {
	  const store = useStore();
	  const nodes = useObserver(() => store.nodes.$);
	  const {
	    selected
	  } = useSelection();
	  const {
	    collapsed
	  } = useCollapser(); // Subscribe to nodeList so that we rerender whenever nodes
	  // are collapsed

	  const list = useObserver(() => store.nodeList.$);
	  const [pos, setPos] = l({
	    top: 0,
	    height: 0
	  });
	  y(() => {
	    if (selected > -1 && !collapsed.has(selected)) {
	      if (props.treeDom != null) {
	        const start = props.treeDom.querySelector(`[data-id="${selected}"`);
	        const lastId = getLastChild(nodes, selected);
	        const last = props.treeDom.querySelector(`[data-id="${lastId}"]`);

	        if (start != null && last != null) {
	          const rect = start.getBoundingClientRect();
	          const top = start.offsetTop + rect.height;
	          const lastRect = last.getBoundingClientRect();
	          const height = last.offsetTop + lastRect.height - top;
	          setPos({
	            top,
	            height
	          });
	        } else {
	          setPos({
	            top: 0,
	            height: 0
	          });
	        }
	      } else {
	        setPos({
	          top: 0,
	          height: 0
	        });
	      }
	    } else {
	      setPos({
	        top: 0,
	        height: 0
	      });
	    }
	  }, [selected, list]);
	  return m`<div class=${s$k.dimmer} style=${`top: ${pos.top}px; height: ${pos.height}px;`}/>`;
	}

	var s$i = {"body":"Sidebar-module_body__1V7vR","actions":"Sidebar-module_actions__1ua5f","iconActions":"Sidebar-module_iconActions__iVCRM"};

	var s$h = {"title":"ComponentName-module_title__H2Plu","nameCh":"ComponentName-module_nameCh__26vJy"};

	// MODULE: src/view/components/ComponentName/index.tsx
	function ComponentName(props) {
	  return m`<span class=${s$h.title} data-testid="inspect-component-name">${props.children ? m`<${p$1}><span class=${s$h.nameCh}>${"<"}</span>${props.children}<span class=${s$h.nameCh}>></span></${p$1}>` : "-"}</span>`;
	}

	// MODULE: src/view/components/sidebar/SidebarActions.tsx
	function SidebarActions() {
	  const store = useStore();
	  const emit = useEmitter();
	  const node = useObserver(() => store.nodes.$.get(store.selection.selected.$) || null);
	  const log = A(() => {
	    if (node) emit("log", {
	      id: node.id,
	      children: node.children
	    });
	  }, [node]);
	  const inspectHostNode = A(() => {
	    emit("inspect-host-node", null);
	  }, []);
	  const viewSource = A(() => {
	    if (node) {
	      emit("view-source", node.id);
	    }
	  }, [node]);
	  const canViewSource = node && node.type !== DevNodeType.Group && node.type !== DevNodeType.Element;
	  const suspense = useObserver(() => {
	    const state = {
	      canSuspend: false,
	      suspended: false
	    };

	    if (store.inspectData.$) {
	      state.canSuspend = store.inspectData.$.canSuspend;
	      state.suspended = store.inspectData.$.suspended;
	    }

	    return state;
	  });
	  const onSuspend = A(() => {
	    if (node) {
	      emit("suspend", {
	        id: node.id,
	        active: !suspense.suspended
	      });
	    }
	  }, [node, suspense]);
	  return m`<${Actions} class=${s$i.actions}><${ComponentName}>${node && node.name}</${ComponentName}><div class=${s$i.iconActions}>${node && m`<${p$1}>${suspense.canSuspend && m`<${IconBtn} title="Suspend Tree" testId="suspend-action" active=${suspense.suspended} onClick=${onSuspend}><${SuspendIcon}/></${IconBtn}>`}<${IconBtn} title="Show matching DOM element" onClick=${inspectHostNode}><${InspectNativeIcon}/></${IconBtn}><${IconBtn} title="Log internal vnode" onClick=${log}><${BugIcon}/></${IconBtn}><${IconBtn} title="View Component Source" onClick=${viewSource} disabled=${!canViewSource}><${CodeIcon}/></${IconBtn}></${p$1}>`}</div></${Actions}>`;
	}

	var s2$2 = {"root":"ElementProps-module_root__37m8F","form":"ElementProps-module_form__2v3k5","row":"ElementProps-module_row__2anvy","name":"ElementProps-module_name__2unR7","nameEditable":"ElementProps-module_nameEditable__219wa","nameInput":"ElementProps-module_nameInput__1Ga28","property":"ElementProps-module_property__1tbUj","noCollapse":"ElementProps-module_noCollapse__2ugm7","toggle":"ElementProps-module_toggle__2BRo9","mask":"ElementProps-module_mask__2D3eP"};

	var s$g = {"valueWrapper":"DataInput-module_valueWrapper__2s1Ox","check":"DataInput-module_check__2eN1C","withCheck":"DataInput-module_withCheck__tU3v_","valueInput":"DataInput-module_valueInput__171wV","innerWrapper":"DataInput-module_innerWrapper__2vYql","undoBtn":"DataInput-module_undoBtn__zso5w","showUndoBtn":"DataInput-module_showUndoBtn__3G6xX","mask":"DataInput-module_mask__8henq"};

	// MODULE: src/view/components/DataInput/parseValue.ts
	function parseValue(v) {
	  v = ("" + v).trim();

	  switch (v) {
	    case "true":
	    case "false":
	      return v === "true";

	    case "null":
	      return null;

	    case "":
	    case "undefined":
	      return undefined;

	    case "NaN":
	      return NaN;

	    case "Infinity":
	    case "+Infinity":
	      return Infinity;

	    case "-Infinity":
	      return -Infinity;
	  }

	  if (/^["]/.test(v)) {
	    if (/["]$/.test(v)) return v.slice(1, v.length - 1);
	    throw new TypeError("Invalid input");
	  } else if (/^[-+.]?\d*(?:[.]?\d*)$/.test(v)) {
	    return Number(v);
	  } else if (/^\{.*\}$/.test(v) || /^\[.*\]$/.test(v)) {
	    try {
	      return JSON.parse(v);
	    } catch (err) {
	      throw new TypeError(err.message);
	    }
	  }

	  throw new TypeError("Unknown type");
	}
	const MAX_PREVIEW = 50;

	function truncate(s) {
	  return s.length > MAX_PREVIEW ? `${s.substr(0, MAX_PREVIEW)}…` : s;
	}

	function genPreview(v) {
	  if (v !== null && typeof v === "object") {
	    if (v.type === "set") {
	      return `Set(${v.entries.length}) ${truncate(genPreview(v.entries))})`;
	    } else if (v.type === "map") {
	      return `Map(${v.entries.length}) ${truncate(genPreview(v.entries))})`;
	    }

	    if (Array.isArray(v)) {
	      return `[${v.map(x => genPreview(x)).join(", ")}]`;
	    }

	    if (Object.keys(v).length === 2) {
	      if (v.type === "vnode") return `<${truncate(v.name)} />`;

	      if (v.type === "function") {
	        return `ƒ ${v.name === "anonymous" ? "" : truncate(v.name)}()`;
	      }

	      if (v.type === "blob") return "Blob {}";
	      if (v.type === "symbol") return v.name;
	      if (v.type === "html") return v.name;
	    }

	    const obj = Object.entries(v).map(x => {
	      return `${x[0]}: ${genPreview(x[1])}`;
	    });
	    return `{${obj.join(", ")}}`;
	  }

	  if (typeof v === "string") {
	    if (v === "__preact_empty__") return "";
	    if (v === "[[Circular]]") return v;
	    return `"${truncate(v)}"`;
	  }

	  return truncate("" + v);
	}

	// MODULE: src/view/components/DataInput/index.tsx
	function DataInput({
	  value,
	  onChange,
	  name,
	  onCommit,
	  onReset,
	  showReset,
	  ...props
	}) {
	  const [focus, setFocus] = l(false);
	  const valid = d(() => {
	    try {
	      parseValue(value);
	      return true;
	    } catch (err) {
	      return false;
	    }
	  }, [value]);
	  const type = d(() => {
	    try {
	      const parsed = parseValue(value);
	      if (parsed === null) return "null";else if (Array.isArray(parsed)) return "array";else if (parsed.type === "map") return "map";else if (parsed.type === "set") return "set";
	      return typeof parsed;
	    } catch (err) {
	      return "undefined";
	    }
	  }, [value]);
	  const ref = s$o();
	  d(() => {
	    if (ref.current) {
	      ref.current.setCustomValidity(valid ? "" : "Invalid input value");
	    }
	  }, [ref.current, valid]);
	  const onKeyUp = A(e => {
	    let parsed;

	    try {
	      parsed = parseValue(value);
	    } catch (err) {
	      return;
	    }

	    if (e.key === "Enter") {
	      onCommit(parsed);
	    } else {
	      if (typeof parsed === "number") {
	        if (e.key === "ArrowUp") {
	          onChange(String(parsed + 1));
	        } else if (e.key === "ArrowDown") {
	          onChange(String(parsed - 1));
	        }
	      }
	    }
	  }, [onChange, value, onCommit]);
	  const onInput = A(e => {
	    onChange(e.target.value);
	  }, [onChange]);
	  const onCheckboxChange = A(e => {
	    onChange(e.target.checked);
	  }, [onChange]);
	  const onFocus = A(() => setFocus(true), []);
	  const onBlur = A(() => setFocus(false), []);
	  return m`<div class=${s$g.valueWrapper}>${typeof value === "boolean" && !focus && m`<input class=${s$g.check} type="checkbox" checked=${value} onInput=${onCheckboxChange}/>`}<div class=${`${s$g.innerWrapper} ${typeof value === "boolean" ? s$g.withCheck : ""}`}><input type="text" ref=${ref} class=${`${s$g.valueInput} ${props.class || ""} ${focus ? s$g.focus : ""}`} value=${value === undefined ? "" : value} onKeyUp=${onKeyUp} onInput=${onInput} onFocus=${onFocus} onBlur=${onBlur} placeholder=${props.placeholder} data-type=${type} name=${name} autoComplete="off"/><button class=${`${s$g.undoBtn} ${showReset ? s$g.showUndoBtn : ""}`} type="button" onClick=${onReset} data-testid=${showReset ? "undo-btn" : "undo-btn-hidden"}><${Undo} size="s"/></button></div></div>`;
	}

	// MODULE: src/view/components/sidebar/inspect/ElementProps.tsx
	function ElementProps(props) {
	  const {
	    onChange,
	    uncollapsed,
	    items,
	    onCollapse
	  } = props;
	  return m`<div class=${s2$2.root}><form class=${s2$2.form} onSubmit=${e => e.preventDefault()}>${items.map(item => {
    const id = item.id;
    return m`<${SingleItem} id=${id} key=${id} type=${item.type} name=${item.name} collapseable=${item.children.length > 0} collapsed=${isCollapsed(uncollapsed, id)} onCollapse=${() => onCollapse && onCollapse(id)} editable=${item.editable} value=${item.value} onChange=${v => onChange && onChange(v, id, item)} depth=${item.depth}/>`;
  })}</form></div>`;
	}
	function SingleItem(props) {
	  const {
	    id,
	    onChange,
	    editable = false,
	    name,
	    type,
	    collapseable = false,
	    collapsed = false,
	    depth,
	    onCollapse,
	    value: initial
	  } = props;
	  const [value, setValue] = l(initial);
	  h(() => {
	    setValue(genPreview(initial));
	  }, [initial]);
	  const onCommit = A(v => {
	    if (onChange) onChange(v);
	  }, [onChange]);
	  const onChangeValue = A(v => {
	    setValue(v);
	  }, []);
	  const onReset = A(() => {
	    setValue(initial);
	  }, [initial]);
	  const onClick = A(() => {
	    onCollapse && onCollapse(id);
	  }, [onCollapse, id]);
	  const preview = d(() => genPreview(initial), [initial]);
	  return m`<div key=${id} class=${s2$2.row} data-testid="props-row" data-depth=${depth} style=${`padding-left: calc(var(--indent-depth) * ${depth - 1})`}>${collapseable && m`<button class=${s2$2.toggle} type="button" data-collapsed=${collapsed} onClick=${onClick}><${Arrow}/><span class=${`${s2$2.name} ${s2$2.nameEditable}`} data-testid="prop-name" data-type=${initial !== "__preact_empty__" ? type : "empty"}>${name}</span>${initial !== "__preact_empty__" && m`<span class=${s2$2.property} data-testid="prop-value"><span class=${s2$2.mask}>${preview}</span></span>`}</button>`}${!collapseable && m`<${p$1}><span class=${`${s2$2.name} ${s2$2.noCollapse} ${s2$2.nameStatic} ${editable ? s2$2.nameEditable : ""}`} data-testid="prop-name" data-type=${value !== "__preact_empty__" ? type : "empty"}>${name}</span><div class=${s2$2.property} data-testid="prop-value">${value !== "__preact_empty__" && m`<${p$1}>${editable ? m`<${DataInput} value=${value} onReset=${onReset} onCommit=${onCommit} showReset=${value !== preview} onChange=${onChangeValue} name=${`${id}`}/>` : m`<div class=${s2$2.mask}>${preview}</div>`}</${p$1}>`}</div></${p$1}>`}</div>`;
	}

	var s$f = {"panel":"SidebarPanel-module_panel__325H9","empty":"SidebarPanel-module_empty__sz7aw","panelHeader":"SidebarPanel-module_panelHeader__ArSlV","title":"SidebarPanel-module_title__3LIHJ","content":"SidebarPanel-module_content__33iZt"};

	// MODULE: src/view/components/sidebar/SidebarPanel.tsx
	function SidebarPanel(props) {
	  return m`<div class=${s$f.panel} data-testid=${props.testId}><header class=${s$f.panelHeader}><h3 class=${s$f.title}>${props.title}</h3>${props.onCopy && props.children != null && m`<${IconBtn} onClick=${props.onCopy} title=${`Copy ${props.title}`}><${FileCopy}/></${IconBtn}>`}</header><div class=${s$f.content}>${props.children}</div></div>`;
	}
	function Empty(props) {
	  return m`<span class=${s$f.empty}>${props.children}</span>`;
	}

	var s$e = {"root":"NewProp-module_root__1GDF6","name":"NewProp-module_name__3hPyh","nameWrapper":"NewProp-module_nameWrapper__3Jp_j","value":"NewProp-module_value__2qEOb"};

	// MODULE: src/view/components/sidebar/inspect/NewProp.tsx
	const initial = undefined;
	function NewProp(props) {
	  const [name, setName] = l("");
	  const [value, setValue] = l(initial);
	  const onChangeName = A(e => {
	    setName(e.target.value);
	  }, []);
	  const onReset = A(() => {
	    setValue(initial);
	  }, []);
	  const onChangeValue = A(v => {
	    setValue(v);
	  }, []);
	  const onCommit = A(value => {
	    if (name) {
	      props.onChange(value, "." + name);
	      setName("");
	      setValue(initial);
	    }
	  }, [name, props.onChange]);
	  return m`<div class=${s$e.root}><div class=${`${s2$2.name} ${s$e.nameWrapper}`}><input name="new-prop-name" type="text" placeholder="new prop" class=${`${s2$2.nameInput} ${s$e.name}`} value=${name} onInput=${onChangeName}/></div><${DataInput} class=${s$e.value} value=${value} showReset=${initial !== value} onChange=${onChangeValue} onCommit=${onCommit} onReset=${onReset} placeholder="new value" name="new-prop-value"/></div>`;
	}

	var s$d = {"root":"Message-module_root__3tSnj","icon":"Message-module_icon__3DTYK","btn":"Message-module_btn__19toh"};

	// MODULE: src/view/components/Message/Message.tsx
	const infoIcon = m`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/></svg>`;
	const warnIcon = m`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/></svg>`;
	function Message(props) {
	  return m`<div class=${`${s$d.root} ${props.type === "info" ? s$d.info : s$d.warning}`} data-type=${props.type} data-testid=${props.testId}><span class=${s$d.icon}>${props.type === "info" ? infoIcon : warnIcon}</span>${props.children}</div>`;
	}
	function MessageBtn(props) {
	  return m`<button class=${s$d.btn} onClick=${props.onClick} data-testid=${props.testId}>${props.children}</button>`;
	}

	// MODULE: src/view/components/sidebar/inspect/PropsPanel.tsx
	function PropsPanel(props) {
	  const {
	    label,
	    onCopy,
	    onChange,
	    canAddNew
	  } = props;
	  const uncollapsed = useObserver(() => props.uncollapsed.$);
	  const items = useObserver(() => props.items.$);
	  const store = useStore();
	  const isSupported = useObserver(() => store.supports.hooks.$);
	  return m`<${SidebarPanel} title=${label} onCopy=${onCopy} testId=${label}>${items.length ? m`<${p$1}><${ElementProps} uncollapsed=${uncollapsed} items=${items} onChange=${onChange} onCollapse=${id => {
    const idx = props.uncollapsed.$.indexOf(id);
    props.uncollapsed.update(v => {
      idx > -1 ? v.splice(idx, 1) : v.push(id);
    });
  }}/>${canAddNew && m`<${NewProp} onChange=${(v, path) => onChange(v, path, null)}/>`}</${p$1}>` : !isSupported && label === "Hooks" ? m`<${Message} type="warning" testId="no-hooks-support-warning">Please upgrade to Preact >=10.4.1 to enable hooks inspection.</${Message}>` : m`<${Empty}>None</${Empty}>`}</${SidebarPanel}>`;
	}

	// MODULE: src/view/components/sidebar/inspect/serializeProps.ts
	function serializeProps(value) {
	  if (Array.isArray(value)) {
	    return value.map(serializeProps);
	  } else if (value !== null && typeof value === "object" && Object.keys(value).length === 2) {
	    if (typeof value.name === "string") {
	      if (value.type === "function") {
	        return value.name + "()";
	      } else if (value.type === "vnode") {
	        return `<${value.name} />`;
	      }
	    }
	  }

	  return value;
	}

	// MODULE: src/view/components/sidebar/DebugTreeStats.tsx
	function DebugTreeStats() {
	  const store = useStore();
	  const nodeList = useObserver(() => store.nodeList.$);
	  return m`<${SidebarPanel} title="Debug Tree Stats" testId="tree-debug-stats"><dl><dt>Active VNode Count</dt><dd>${nodeList.length}</dd></dl></${SidebarPanel}>`;
	}

	var s$c = {"item":"RenderedAt-module_item__3Dtuh"};

	// MODULE: src/view/components/sidebar/DebugNodeNavTree.tsx
	function DebugNodeNavTree() {
	  const store = useStore();
	  const selected = useObserver(() => store.selection.selected.$);
	  const nodes = useObserver(() => store.nodeList.$.map(id => store.nodes.$.get(id)));
	  return m`<${SidebarPanel} title="Debug Node Navigation:" testId="profiler-debug-nav">${nodes.length === 0 ? m`<${Empty}>No nodes found inside commmit</${Empty}>` : m`<nav data-testid="debug-nav">${nodes.map((node, i) => {
    return m`<button key=${node.id} class=${s$c.item} data-active=${selected === node.id} onClick=${() => store.profiler.selectedNodeId.$ = node.id}><span style="display: flex; justify-content: space-between; width: 100%"><span>${node.name}${i === 0 ? m`<b> (R)</b>` : null}</span><span>${node.id}</span></span></button>`;
  })}</nav>`}</${SidebarPanel}>`;
	}

	// MODULE: src/view/components/elements/OwnerInfo.tsx
	function OwnerInfo() {
	  const store = useStore();
	  const selectedId = useObserver(() => store.selection.selected.$);
	  const data = useObserver(() => {
	    const owners = [];
	    const selectedId = store.selection.selected.$;
	    const nodes = store.nodes.$;
	    let id = selectedId;
	    let current;

	    while ((current = nodes.get(id)) !== undefined) {
	      if (!nodes.has(current.owner)) {
	        break;
	      }

	      owners.push(nodes.get(current.owner));
	      id = current.owner;
	    }

	    return owners;
	  });

	  if (selectedId === -1) {
	    return null;
	  }

	  return m`<${SidebarPanel} title="Rendered by"><nav data-testid="owners">${data.length === 0 && m`<p>-</p>`}${data.map(node => {
    return m`<button key=${node.id} class=${s$c.item} data-active=${selectedId === node.id} onClick=${() => {
      store.selection.selectById(node.id);
    }}>${node.name}</button>`;
  })}</nav></${SidebarPanel}>`;
	}

	var s$b = {"key":"KeyPanel-module_key__2B4-T"};

	// MODULE: src/view/components/sidebar/KeyPanel.tsx
	function KeyPanel(props) {
	  return m`<${SidebarPanel} title="Key" testId="key-panel" onCopy=${props.onCopy}><span class=${s$b.key} data-testid="vnode-key">${props.value}</span></${SidebarPanel}>`;
	}

	// MODULE: src/view/components/sidebar/Sidebar.tsx
	function Sidebar() {
	  const store = useStore();
	  const showDebug = useObserver(() => store.debugMode.$);
	  const inspect = useObserver(() => store.inspectData.$);
	  const hocs = useObserver(() => {
	    if (store.inspectData.$) {
	      const node = store.nodes.$.get(store.inspectData.$.id);
	      return node ? node.hocs : null;
	    }

	    return null;
	  });
	  const {
	    props: propData,
	    state,
	    context,
	    hooks
	  } = store.sidebar;
	  const {
	    emit
	  } = store;
	  return m`<${p$1}>${inspect && inspect.key !== null && m`<${KeyPanel} value=${inspect.key} onCopy=${() => emit("copy", inspect.key)}/>`}${inspect && hocs !== null && hocs.length > 0 && m`<${HocPanel} hocs=${hocs}/>`}<${PropsPanel} label="Props" items=${propData.items} uncollapsed=${propData.uncollapsed} onChange=${(value, path) => emit("update-prop", {
    id: inspect.id,
    path,
    value
  })} onCopy=${() => inspect && emit("copy", serializeProps(inspect.props))} canAddNew/>${inspect && inspect.hooks !== null && m`<${PropsPanel} label="Hooks" items=${hooks.items} uncollapsed=${hooks.uncollapsed} onChange=${(value, path, node) => {
    emit("update-hook", {
      id: inspect.id,
      value,
      meta: node != null ? node.meta : null
    });
  }} onCopy=${() => inspect && emit("copy", serializeProps(inspect.hooks))}/>`}${inspect && inspect.state !== null && m`<${PropsPanel} label="State" items=${state.items} uncollapsed=${state.uncollapsed} onChange=${(value, path) => emit("update-state", {
    id: inspect.id,
    path,
    value
  })} onCopy=${() => inspect && emit("copy", serializeProps(inspect.state))}/>`}${inspect && inspect.context !== null && m`<${PropsPanel} label="Context" items=${context.items} uncollapsed=${context.uncollapsed} onChange=${(value, path) => emit("update-context", {
    id: inspect.id,
    path,
    value
  })} onCopy=${() => inspect && emit("copy", serializeProps(inspect.context))}/>`}${inspect && m`<${OwnerInfo}/>`}${showDebug && m`<${DebugNodeNavTree}/>`}${showDebug && m`<${DebugTreeStats}/>`}</${p$1}>`;
	}

	var s$a = {"root":"Devtools-module_root__25-wb","theme":"Devtools-module_theme__2ZXuJ","switcher":"Devtools-module_switcher__3kqpd","switcherInner":"Devtools-module_switcherInner__29xAy","bugLink":"Devtools-module_bugLink__1KF6U","componentActions":"Devtools-module_componentActions__2KOng","components":"Devtools-module_components__2KFbg","sidebarActions":"Devtools-module_sidebarActions__TKT7B","sidebar":"Devtools-module_sidebar__Qk6sv"};

	var s$9 = {"root":"SidebarLayout-module_root__1ka0O","rootSingle":"SidebarLayout-module_rootSingle__2ICYW","rootPage":"SidebarLayout-module_rootPage__1X6Y_","rootPageInner":"SidebarLayout-module_rootPageInner__1RkkZ"};

	// MODULE: src/view/components/SidebarLayout.tsx
	function SidebarLayout(props) {
	  return m`<div class=${s$9.root}>${props.children}</div>`;
	}
	function SingleLayout(props) {
	  return m`<div class=${s$9.rootSingle}>${props.children}</div>`;
	}
	function PageLayout(props) {
	  return m`<div class=${s$9.rootPage}><div class=${s$9.rootPageInner}>${props.children}</div></div>`;
	}

	// MODULE: src/view/components/elements/Elements.tsx
	function Elements() {
	  return m`<${SidebarLayout}><div class=${s$a.componentActions}><${TreeBar}/></div><div class=${s$a.components}><${TreeView}/></div><div class=${s$a.sidebarActions}><${SidebarActions}/></div><div class=${s$a.sidebar}><${Sidebar}/></div></${SidebarLayout}>`;
	}

	var s2$1 = {"flamegraphWrapper":"Profiler-module_flamegraphWrapper__3rWVy","sidebarItemWrapper":"Profiler-module_sidebarItemWrapper__1gPvR"};

	// MODULE: src/view/components/ThemeSwitcher.tsx
	function ThemeSwitcher() {
	  const store = useStore();
	  let theme = useObserver(() => store.theme.$);

	  if (theme === "auto") {
	    theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	  }

	  const ref = s$o(null);
	  y(() => {
	    if (ref.current) {
	      const doc = ref.current.ownerDocument;
	      doc.body.classList.remove("auto", "light", "dark");
	      doc.body.classList.add(theme);
	    }
	  }, [theme, ref.current]);
	  return m`<div ref=${ref} style="display: none"/>`;
	}

	var s$8 = {"root":"CommitTimeline-module_root__3Wdwe","inner":"CommitTimeline-module_inner__1I4AZ","legend":"CommitTimeline-module_legend__3vfri","itemContainer":"CommitTimeline-module_itemContainer__2DFzf","items":"CommitTimeline-module_items__238AU","item":"CommitTimeline-module_item__3bfHN","itemInner":"CommitTimeline-module_itemInner__3imOV","navBtn":"CommitTimeline-module_navBtn__TCI-x","hidden":"CommitTimeline-module_hidden__22_cK"};

	// MODULE: src/view/components/profiler/components/CommitTimeline/CommitTimeline.tsx

	function calcSize(container, inner, pane, paneContainer, count, selected) {
	  if (container.current && inner.current && paneContainer.current && pane.current) {
	    if (count > 0) {
	      const org = paneContainer.current.style.width;
	      paneContainer.current.style.width = "0";
	      const style = window.getComputedStyle(pane.current.firstElementChild);
	      const min = +style.getPropertyValue("min-width").replace("px", "");
	      const max = +style.getPropertyValue("max-width").replace("px", "");
	      const sibling = pane.current.firstElementChild ? pane.current.firstElementChild.nextElementSibling : null;
	      const gap = sibling ? +window.getComputedStyle(sibling).getPropertyValue("margin-left").replace("px", "") : 0;
	      const full = container.current.offsetWidth;
	      const ui = inner.current.offsetWidth;
	      const available = full - ui - 1; // -1 to prevent layout glitch in chrome

	      const itemWidth = Math.max(min, Math.min(Math.floor(available - (count - 1) * gap) / count, max));
	      const paneWidth = itemWidth * count + (count - 1) * gap;
	      const viewport = available > paneWidth ? paneWidth : available;
	      const selOffset = itemWidth * (selected + 1) + selected * gap;
	      const offset = selOffset > viewport ? Math.min(viewport - selOffset - (selected < count - 1 ? itemWidth / 2 : 0), paneWidth - viewport) : 0;
	      paneContainer.current.style.width = org;
	      return {
	        item: itemWidth,
	        pane: paneWidth,
	        viewport,
	        offset
	      };
	    }
	  }

	  return {
	    viewport: 0,
	    pane: 0,
	    item: 0,
	    offset: 0
	  };
	}

	function CommitTimeline(props) {
	  const {
	    items,
	    onChange,
	    selected
	  } = props;
	  const [viewportWidth, setViewportWidth] = l(0);
	  const [paneWidth, setPaneWidth] = l(0);
	  const [offset, setOffset] = l(0);
	  const container = s$o();
	  const inner = s$o();
	  const pane = s$o();
	  const paneContainerRef = s$o();
	  y(() => {
	    if (pane.current) {
	      const active = pane.current.querySelector("[data-selected]"); // JSDOM doesn't support scrollIntoView

	      if (active && active.scrollIntoView) active.scrollIntoView();
	    }
	  }, [selected]);
	  useResize(() => {
	    const sizes = calcSize(container, inner, pane, paneContainerRef, items.length, selected);
	    setPaneWidth(sizes.pane);
	    setViewportWidth(sizes.viewport);
	    setOffset(sizes.offset);
	  }, [pane, container, paneContainerRef, inner, items.length, selected], true);
	  const onPrev = A(() => {
	    const next = selected - 1;
	    onChange(next < 0 ? items.length - 1 : next);
	  }, [selected]);
	  const onNext = A(() => {
	    const next = selected + 1;
	    onChange(next > items.length - 1 ? 0 : next);
	  }, [selected]);

	  if (items.length === 0) {
	    return null;
	  }

	  const selectedCount = "" + (selected + 1);
	  const itemsCountLen = ("" + items.length).length;
	  const leading = selectedCount.padStart(itemsCountLen, "0");
	  return m`<div class=${s$8.root} ref=${container}><div class=${s$8.inner} ref=${inner}><div class=${s$8.legend}><span class=${s$8.hidden}>${leading.slice(0, itemsCountLen - selectedCount.length)}</span><span data-testid="commit-page-info">${selected + 1} / ${items.length}</span></div><button disabled=${items.length <= 1} onClick=${onPrev} class=${s$8.navBtn} data-testid="prev-commit"><${ArrowBack}/></button><div class=${s$8.itemContainer} ref=${paneContainerRef} style=${`width: ${viewportWidth}px`}><div class=${s$8.items} ref=${pane} style=${`width: ${paneWidth}px; transform: translate3d(${offset}px, 0, 0);`}>${items.map((x, i) => {
    return m`<${CommitItem} key=${x} onClick=${() => onChange(i)} selected=${i === selected} percent=${x}/>`;
  })}</div></div><button disabled=${items.length <= 1} onClick=${onNext} class=${s$8.navBtn} data-testid="next-commit"><${ArrowForward}/></button></div></div>`;
	}
	function CommitItem(props) {
	  const {
	    percent
	  } = props;
	  const top = Math.max(20, Math.min(86, 100 - percent));
	  const color = getGradient(100, percent);
	  return m`<div data-testid="commit-item" class=${s$8.item} data-selected=${props.selected} data-weight=${color} onClick=${props.onClick}><div class=${s$8.itemInner} style=${`top: ${top}%`}/></div>`;
	}

	var s$7 = {"group":"Tabs-module_group__2mFkx","root":"Tabs-module_root__sWZyW","label":"Tabs-module_label__NHeAW","input":"Tabs-module_input__3Jo6M","iconRoot":"Tabs-module_iconRoot__5YCZr","iconInner":"Tabs-module_iconInner__1GYC4","iconLabel":"Tabs-module_iconLabel__2GF6h"};

	// MODULE: src/view/components/profiler/components/Tabs/Tabs.tsx
	function SmallTab(props) {
	  const onClick = A(() => {
	    props.onClick(props.value);
	  }, [props]);
	  return m`<label class=${s$7.root}><input class=${s$7.input} type="radio" name=${props.name} value=${props.value} checked=${props.checked} onClick=${onClick}/><span class=${s$7.label}>${props.children}</span></label>`;
	}
	function SmallTabGroup(props) {
	  return m`<div class=${`${s$7.group} ${props.class || ""}`}>${props.children}</div>`;
	}
	function IconTab(props) {
	  const onClick = A(() => {
	    props.onClick(props.value);
	  }, [props]);
	  return m`<label class=${s$7.iconRoot}><input class=${s$7.input} type="radio" name=${props.name} value=${props.value} checked=${props.checked} onClick=${onClick} disabled=${props.disabled}/><span class=${s$7.iconInner}>${props.icon}<span class=${s$7.iconLabel}>${props.children}</span></span></label>`;
	}

	// MODULE: src/view/components/profiler/flamegraph/FlameGraphMode.tsx
	function FlameGraphMode() {
	  const store = useStore();
	  const type = useObserver(() => store.profiler.flamegraphType.$);
	  const disabled = useObserver(() => !store.profiler.isSupported.$);
	  const onClick = A(value => {
	    store.profiler.flamegraphType.$ = value;
	  }, []);
	  return m`<${p$1}><${IconTab} name="flamegraph_mode" icon=${m`<${FireIcon}/>`} value=${FlamegraphType.FLAMEGRAPH} checked=${type === FlamegraphType.FLAMEGRAPH} onClick=${onClick} disabled=${disabled}>Flamegraph</${IconTab}><${IconTab} name="flamegraph_mode" icon=${m`<${SortIcon}/>`} value=${FlamegraphType.RANKED} checked=${type === FlamegraphType.RANKED} onClick=${onClick} disabled=${disabled}>Ranked</${IconTab}></${p$1}>`;
	}

	// MODULE: src/view/components/profiler/components/TimelineBar/TimelineBar.tsx
	function TimelineBar() {
	  const store = useStore();
	  const commits = useObserver(() => store.profiler.commits.$);
	  const isRecording = useObserver(() => store.profiler.isRecording.$);
	  const isSupported = useObserver(() => store.profiler.isSupported.$);
	  const selectedCommit = useObserver(() => store.profiler.activeCommitIdx.$);
	  const stats = useObserver(() => {
	    return {
	      max: Math.max(16, ...store.profiler.commits.$.map(x => x.duration)),
	      min: Math.max(0, Math.min(...store.profiler.commits.$.map(x => x.duration)))
	    };
	  });
	  const onCommitChange = A(n => {
	    const {
	      activeCommitIdx,
	      selectedNodeId,
	      activeCommit,
	      flamegraphType
	    } = store.profiler;
	    activeCommitIdx.$ = n;
	    const commit = activeCommit.$;
	    if (!commit) return;
	    selectedNodeId.$ = getCommitInitalSelectNodeId(commit, flamegraphType.$);
	  }, [store]);
	  const onReloadAndProfile = A(() => {
	    store.profiler.isRecording.$ = true;
	    store.emit("reload-and-profile", {
	      captureRenderReasons: store.profiler.captureRenderReasons.$
	    });
	  }, []);
	  const onReset = A(() => {
	    resetProfiler(store.profiler);
	    store.emit("stop-profiling", null);
	  }, [store]);
	  return m`<${Actions}><div class=${s$l.btnWrapper}><${RecordBtn}/></div><div class=${s$l.btnWrapper}><${IconBtn} title="Reload and profile" disabled=${!isSupported || isRecording} testId="reload-and-profile-btn" onClick=${onReloadAndProfile}><${Refresh} size="s"/></${IconBtn}></div><div class=${s$l.btnWrapper}><${IconBtn} title="Clear profiling data" disabled=${!isSupported || commits.length === 0 || isRecording} onClick=${onReset}><${NotInterested} size="s"/></${IconBtn}></div><${ActionSeparator}/><${FlameGraphMode}/><${ActionSeparator}/>${isSupported && !isRecording && m`<${CommitTimeline} items=${commits.map(commit => {
    const percent = (commit.duration - stats.min) * 100 / (stats.max - stats.min || 0.1);
    return percent;
  })} selected=${selectedCommit} onChange=${onCommitChange}/>`}</${Actions}>`;
	}
	function RecordBtn() {
	  const store = useStore();
	  const isRecording = useObserver(() => store.profiler.isRecording.$);
	  const isSupported = useObserver(() => store.profiler.isSupported.$);
	  const onClick = A(() => {
	    const {
	      isRecording,
	      captureRenderReasons
	    } = store.profiler;
	    const v = !isRecording.$;
	    isRecording.$ = v;

	    if (v) {
	      store.emit("start-profiling", {
	        captureRenderReasons: captureRenderReasons.$
	      });
	    } else {
	      store.emit("stop-profiling", null);
	    }
	  }, [store]);
	  return m`<${IconBtn} title=${!isRecording ? "Start Recording" : "Stop Recording"} color=${isSupported ? isRecording ? "var(--color-record-active)" : "var(--color-selected-bg)" : "var(--color-disabled)"} onClick=${onClick} disabled=${!isSupported} testId="record-btn"><${RecordIcon} size="s"/></${IconBtn}>`;
	}

	var s$6 = {"root":"FlameGraph-module_root__3jHxQ","pane":"FlameGraph-module_pane__2G-a7","node":"FlameGraph-module_node__10F0T","text":"FlameGraph-module_text__BfhZh"};

	// MODULE: src/view/components/profiler/flamegraph/FlameNode.tsx
	const ROW_HEIGHT = 21; // Account 1px for border

	const MIN_TEXT_WIDTH = 32; // Don't show text if smaller than this value

	function FlameNode(props) {
	  const {
	    onClick,
	    selected,
	    node,
	    onMouseEnter,
	    onMouseLeave,
	    name
	  } = props;
	  const transform = s$o("");
	  const widthCss = s$o("");
	  const onRawClick = A(() => onClick(node.id), [node.id]);
	  const onRawMouseEnter = A(() => onMouseEnter(node.id), [node.id]);
	  const {
	    visible,
	    width,
	    x
	  } = node;

	  if (width < 0.5) {
	    return null;
	  }

	  if (visible) {
	    widthCss.current = `width: ${width}px;`;
	    transform.current = `transform: translate3d(${x}px, 0, 0);`;
	  }

	  return m`<div class=${s$6.node} onClick=${onRawClick} onMouseEnter=${onRawMouseEnter} onMouseLeave=${onMouseLeave} data-id=${node.id} data-parent-id=${props.parentId} data-visible=${visible} data-weight=${node.weight} data-commit-parent=${node.commitParent} data-maximized=${node.maximized} data-selected=${selected} data-overflow=${width < MIN_TEXT_WIDTH} data-name=${name} style=${`height: ${ROW_HEIGHT}px; ${transform.current} ${widthCss.current}`}><span class=${s$6.text} style=${widthCss.current}>${props.children}</span></div>`;
	}

	// MODULE: src/view/components/profiler/util.ts
	const formatter = Intl.NumberFormat();
	const decimals = 1;
	function formatTime(time) {
	  if (time < 0.1) return "<0.1ms";

	  if (time > 100) {
	    const display = formatter.format(Number((time / 1000).toFixed(decimals)));
	    return `${display}s`;
	  }

	  return `${time.toFixed(decimals)}ms`;
	}

	// MODULE: src/view/components/profiler/flamegraph/ranked/RankedLayout.tsx
	/**
	 * Layout nodes in a flat list from top to bottom
	 * in descending order by the time it took a node
	 * to render.
	 */

	function RankedLayout({
	  canvasWidth,
	  containerRef,
	  commit,
	  selected,
	  onSelect,
	  onMouseEnter,
	  onMouseLeave
	}) {
	  // Convert node tree to position data
	  const store = useStore();
	  const data = useObserver(() => store.profiler.rankedNodes.$);
	  const filterHoc = useObserver(() => store.filter.filterHoc.$);
	  const placed = d(() => placeRanked(commit.selfDurations, data, selected, canvasWidth), [canvasWidth, selected, commit, data]);
	  const {
	    children: rowItems,
	    containerHeight
	  } = useVirtualizedList({
	    minBufferCount: 5,
	    container: containerRef,
	    items: placed,
	    rowHeight: 21,
	    // eslint-disable-next-line react/display-name
	    renderRow: (pos, _, top) => {
	      const node = commit.nodes.get(pos.id);
	      const selfDuration = commit.selfDurations.get(node.id) || 0;
	      const hocs = filterHoc && node.hocs ? m`<${HocLabels} hocs=${node.hocs} nodeId=${node.id} canMark=${false}/>` : "";
	      return m`<div key=${pos.id} style=${`top: ${top}px; position: absolute; left: 0;`}><${FlameNode} node=${pos} selected=${pos.id === selected.id} parentId=${selected.parent} onClick=${onSelect} name=${node.name} onMouseEnter=${onMouseEnter} onMouseLeave=${onMouseLeave}><span data-testid="node-name">${node.name}</span>${hocs} (${formatTime(selfDuration)})</${FlameNode}></div>`;
	    }
	  });
	  return m`<div class=${s$6.pane} style=${`height: ${containerHeight}px;`}>${rowItems}</div>`;
	}

	// MODULE: src/view/components/profiler/flamegraph/modes/flamegraph-utils.ts
	/**
	 * The default layout that's typical for a flamegraph chart.
	 */
	function placeFlamegraph(tree, idToTransform, rootId, selectedId, canvasWidth) {
	  const maximizedIds = new Set([selectedId]);
	  const commitParentIds = new Set();
	  let parentId = tree.get(rootId).parent;

	  while (parentId !== -1) {
	    const node = tree.get(parentId);
	    if (node === undefined) break;
	    commitParentIds.add(parentId);
	    parentId = node.parent;
	  } // Account for commits not having the currently selected node
	  // TODO: Move this logic elsewhere


	  const selected = !tree.has(selectedId) ? tree.get(rootId) : tree.get(selectedId);
	  parentId = selected.parent;

	  while (parentId !== -1) {
	    const node = tree.get(parentId);
	    if (node === undefined) break;
	    maximizedIds.add(parentId);
	    parentId = node.parent;
	  }

	  let offset = 0;
	  let scale = 1;
	  const selectedPos = idToTransform.get(selectedId);

	  if (selectedPos !== undefined) {
	    offset = selectedPos.x;
	    scale = canvasWidth / selectedPos.width;
	  }

	  const byRow = [];
	  idToTransform.forEach(pos => {
	    let start;
	    let width;
	    let hidden = false;

	    if (maximizedIds.has(pos.id)) {
	      start = 0;
	      width = canvasWidth;
	    } else {
	      start = (pos.x - offset) * scale;
	      width = pos.width * scale; // Hide other sibling nodes of maximized nodes

	      const node = tree.get(pos.id);

	      if (node && node.parent !== -1 && maximizedIds.has(node.parent)) {
	        const parent = tree.get(node.parent);

	        if (parent.children.length > 1) {
	          hidden = parent.children.some(childId => maximizedIds.has(childId));
	        }
	      }
	    }

	    const visible = hidden ? false : start >= 0 && start <= canvasWidth;

	    if (pos.row >= byRow.length) {
	      byRow.push([]);
	    }

	    byRow[pos.row].push({ ...pos,
	      x: start,
	      width,
	      maximized: maximizedIds.has(pos.id),
	      visible
	    });
	  });
	  return byRow;
	}

	// MODULE: src/view/components/profiler/flamegraph/modes/FlamegraphLayout.tsx
	function FlamegraphLayout({
	  commit,
	  selected,
	  canvasWidth,
	  onSelect,
	  onMouseEnter,
	  onMouseLeave,
	  containerRef
	}) {
	  const store = useStore();
	  const data = useObserver(() => store.profiler.flamegraphNodes.$);
	  const filterHoc = useObserver(() => store.filter.filterHoc.$);
	  const placed = d(() => placeFlamegraph(commit.nodes, data, commit.rootId, selected.id, canvasWidth), [commit, data, selected, canvasWidth]);
	  const {
	    children: rowItems,
	    containerHeight,
	    scrollToItem
	  } = useVirtualizedList({
	    minBufferCount: 5,
	    container: containerRef,
	    items: placed,
	    rowHeight: 21,
	    // eslint-disable-next-line react/display-name
	    renderRow: (row, _, top) => {
	      return m`<div style=${`top: ${top}px; position: absolute; left: 0;`}>${row.map(item => m`<${FlameGraphNode} commit=${commit} filterHoc=${filterHoc} onMouseEnter=${onMouseEnter} onMouseLeave=${onMouseLeave} onSelect=${onSelect} pos=${item} selected=${selected} key=${item.id}/>`)}</div>`;
	    }
	  }); // Scroll to item on selection change

	  y(() => {
	    const pos = data.get(selected.id);
	    if (!pos) return;
	    scrollToItem(placed[pos.row]);
	  }, [selected, scrollToItem]);
	  return m`<div class=${s$6.pane} style=${`height: ${containerHeight}px;`}>${rowItems}</div>`;
	}

	function FlameGraphNode({
	  commit,
	  pos,
	  onMouseEnter,
	  onMouseLeave,
	  selected,
	  onSelect,
	  filterHoc
	}) {
	  const node = commit.nodes.get(pos.id);
	  let appendix = "";

	  if (!pos.commitParent && pos.weight !== -1) {
	    const self = formatTime(commit.selfDurations.get(pos.id) || 0);
	    const total = formatTime(node.endTime - node.startTime);
	    appendix = ` (${self} of ${total})`;
	  }

	  return m`<${FlameNode} key=${pos.id} onMouseEnter=${onMouseEnter} onMouseLeave=${onMouseLeave} node=${pos} name=${node.name} selected=${pos.id === selected.id} parentId=${commit.nodes.get(pos.id).parent} onClick=${onSelect}>${node.name}${filterHoc && node.hocs ? m`<${HocLabels} hocs=${node.hocs} nodeId=${node.id} canMark=${false}/>` : null}${appendix}</${FlameNode}>`;
	}

	// MODULE: src/view/components/profiler/flamegraph/placeNodes.ts
	const EMPTY = {
	  children: [],
	  depth: 0,
	  endTime: 0,
	  id: -1,
	  owner: -1,
	  hocs: null,
	  key: "",
	  name: "",
	  parent: -1,
	  startTime: 0,
	  type: 0
	};

	// MODULE: src/view/components/profiler/flamegraph/FlameGraph.tsx
	const highlightNode = debounce((notify, id) => notify("highlight", id), 100);
	function FlameGraph() {
	  const store = useStore();
	  const [canvasWidth, setCanvasWidth] = l(-1);
	  const displayType = useObserver(() => store.profiler.flamegraphType.$);
	  const selected = useObserver(() => store.profiler.selectedNode.$ || EMPTY);
	  const commit = useObserver(() => store.profiler.activeCommit.$);
	  const isRecording = useObserver(() => store.profiler.isRecording.$);
	  const showDebug = useObserver(() => store.debugMode.$);
	  const ref = s$o();
	  y(() => {
	    if (ref.current) {
	      // Pad for potential rounding issues
	      setCanvasWidth(Math.floor(ref.current.clientWidth) - 4);
	    }
	  }, [isRecording, commit]);
	  useResize(() => {
	    if (ref.current) {
	      // Pad for potential rounding issues
	      setCanvasWidth(Math.floor(ref.current.clientWidth) - 4);
	    }
	  }, [commit], true);
	  const onSelect = A(id => {
	    store.profiler.selectedNodeId.$ = id;
	    store.selection.selectById(id);
	  }, [store]);
	  const onMouseEnter = A(id => {
	    highlightNode(store.notify, id);
	  }, []);
	  const onMouseLeave = A(() => {
	    highlightNode(store.notify, null);
	  }, []);
	  if (isRecording || !commit) return null;
	  return m`<div class=${s$6.root} ref=${ref} data-type=${displayType.toLowerCase()} style=${showDebug ? "overflow-x: auto" : ""}>${canvasWidth === -1 ? null : m`<${p$1}>${displayType === FlamegraphType.RANKED ? m`<${RankedLayout} canvasWidth=${canvasWidth} containerRef=${ref} commit=${commit} onSelect=${onSelect} selected=${selected} onMouseEnter=${onMouseEnter} onMouseLeave=${onMouseLeave}/>` : m`<${FlamegraphLayout} canvasWidth=${canvasWidth} containerRef=${ref} commit=${commit} onSelect=${onSelect} selected=${selected} onMouseEnter=${onMouseEnter} onMouseLeave=${onMouseLeave}/>`}</${p$1}>`}</div>`;
	}

	// MODULE: src/view/components/profiler/components/SidebarHeader.tsx
	function SidebarHeader() {
	  const store = useStore();
	  const selected = useObserver(() => store.profiler.selectedNode.$);
	  const emit = useEmitter();
	  const log = A(() => {
	    if (selected) emit("log", {
	      id: selected.id,
	      children: selected.children
	    });
	  }, [selected]);
	  const inspectHostNode = A(() => {
	    emit("inspect-host-node", null);
	  }, []);
	  const viewSource = A(() => {
	    if (selected) {
	      emit("view-source", selected.id);
	    }
	  }, [selected]);
	  const canViewSource = selected && selected.type !== DevNodeType.Group && selected.type !== DevNodeType.Element;
	  return m`<${Actions} class=${s$i.actions}><${ComponentName}>${selected && selected.name}</${ComponentName}><div class=${s$i.iconActions}>${selected && m`<${p$1}><${IconBtn} title="Show matching DOM element" onClick=${inspectHostNode}><${InspectNativeIcon}/></${IconBtn}><${IconBtn} title="Log internal vnode" onClick=${log}><${BugIcon}/></${IconBtn}><${IconBtn} title="View Component Source" onClick=${viewSource} disabled=${!canViewSource}><${CodeIcon}/></${IconBtn}></${p$1}>`}</div></${Actions}>`;
	}

	// MODULE: src/view/components/profiler/components/RenderedAt/RenderedAt.tsx
	function RenderedAt() {
	  const store = useStore();
	  const commit = useObserver(() => store.profiler.activeCommit.$);
	  const selected = useObserver(() => store.profiler.selectedNodeId.$);
	  const data = useObserver(() => {
	    const id = store.profiler.selectedNodeId.$;
	    return store.profiler.commits.$.reduce((acc, commit, i) => {
	      if (!commit.rendered.has(id)) return acc;
	      const selfDuration = commit.selfDurations.get(id) || 0;
	      acc.push({
	        index: i,
	        selfDuration
	      });
	      return acc;
	    }, []);
	  });
	  const commitIdx = useObserver(() => store.profiler.activeCommitIdx.$);
	  if (commit === null) return null;
	  const commitRoot = commit.nodes.get(commit.commitRootId);
	  return m`<${p$1}><${SidebarPanel} title="Commit Root:"><nav data-testid="commitRoot"><button class=${s$c.item} data-active=${selected === commit.commitRootId} onClick=${() => store.profiler.selectedNodeId.$ = commit.commitRootId}><span>${commitRoot.name}</span></button></nav></${SidebarPanel}>${data.length > 0 && m`<${SidebarPanel} title="Rendered at:">${data.length <= 0 ? m`<${Empty}>Did not render during this profiling session</${Empty}>` : m`<nav data-testid="rendered-at">${data.map(node => {
    return m`<button key=${node.index} class=${s$c.item} data-active=${commitIdx === node.index} onClick=${() => store.profiler.activeCommitIdx.$ = node.index}><span>Commit #${node.index} for ${formatTime(node.selfDuration)}</span></button>`;
  })}</nav>`}</${SidebarPanel}>`}</${p$1}>`;
	}

	var s2 = {"root":"ProfilerInfo-module_root__13TPb","title":"ProfilerInfo-module_title__1jCFH","descr":"ProfilerInfo-module_descr__1-jyy","inlineBtn":"ProfilerInfo-module_inlineBtn__2swFY"};

	// MODULE: src/view/components/profiler/components/ProfilerInfo/ProfilerInfo.tsx
	function ProfilerInfo() {
	  const store = useStore();
	  const isRecording = useObserver(() => store.profiler.isRecording.$);
	  const isSupported = useObserver(() => store.profiler.isSupported.$);
	  const commits = useObserver(() => store.profiler.commits.$);

	  if (!isSupported) {
	    return m`<div class=${s2.root} data-testid="profiler-info"><p class=${s2.title}>Profiling is not supported</p><p class=${s2.descr}>Please upgrade Preact to a version that supports it (>=10.3.0).</p></div>`;
	  } else if (isRecording) {
	    return m`<div class=${s2.root} data-testid="profiler-info"><p class=${s2.title}>Profiling in progress...</p><p class=${s2.descr}>Click the record button <span class=${s2.inlineBtn}><${RecordBtn}/></span> to stop recording.</p></div>`;
	  } else if (commits.length === 0) {
	    return m`<div class=${s2.root} data-testid="profiler-info"><p class=${s2.title}>No profiling data collected</p><p class=${s2.descr}>Click the record button <span class=${s2.inlineBtn}><${RecordBtn}/></span> to start recording.</p></div>`;
	  }

	  return null;
	}

	var s$5 = {"list":"CommitInfo-module_list__bnXJb","title":"CommitInfo-module_title__205Nn","value":"CommitInfo-module_value__bABuQ"};

	// MODULE: src/view/components/profiler/components/CommitInfo/CommitInfo.tsx
	function CommitInfo() {
	  const store = useStore();
	  const commit = useObserver(() => store.profiler.activeCommit.$);
	  const isRecording = useObserver(() => store.profiler.isRecording.$);

	  if (commit === null || isRecording) {
	    return null;
	  }

	  const root = commit.nodes.get(commit.commitRootId);

	  if (!root) {
	    return null;
	  }

	  return m`<${SidebarPanel} title="Commit Stats"><dl class=${s$5.list}><dt class=${s$5.title}>Start:</dt><dd class=${s$5.value}>${formatTime(root.startTime)}</dd><br/><dt class=${s$5.title}>Duration:</dt><dd class=${s$5.value}>${formatTime(commit.duration)} </dd></dl></${SidebarPanel}>`;
	}

	var s$4 = {"reason":"RenderReason-module_reason__fnX81","reasonName":"RenderReason-module_reasonName__1M8eN","reasonValue":"RenderReason-module_reasonValue__2ZhrJ","message":"RenderReason-module_message__28ZZI"};

	// MODULE: src/view/components/profiler/components/RenderReasons.tsx

	function getReasonName(reason) {
	  switch (reason) {
	    case 5
	    /* HOOKS_CHANGED */
	    :
	      return "Hooks changed";

	    case 1
	    /* MOUNT */
	    :
	      return "Component mounted";

	    case 2
	    /* PARENT_UPDATE */
	    :
	      return "Parent updated";

	    case 3
	    /* PROPS_CHANGED */
	    :
	      return "Props changed";

	    case 4
	    /* STATE_CHANGED */
	    :
	      return "State changed";

	    case 6
	    /* FORCE_UPDATE */
	    :
	      return "Force update";

	    default:
	      return "Unknown reason";
	  }
	}

	function RenderReasons() {
	  const store = useStore();
	  const isRecording = useObserver(() => store.profiler.isRecording.$);
	  const commits = useObserver(() => store.profiler.commits.$);
	  const reason = useObserver(() => store.profiler.activeReason.$);
	  const commit = useObserver(() => store.profiler.activeCommit.$);
	  const selected = useObserver(() => store.profiler.selectedNode.$);
	  const isSupported = useObserver(() => store.profiler.supportsRenderReasons.$);
	  const captureReason = useObserver(() => store.profiler.captureRenderReasons.$);

	  if (commits.length === 0 || isRecording) {
	    return null;
	  }

	  const hasReasons = reason !== null && reason.items && reason.items.length > 0;
	  const rendered = !captureReason && commit && selected && commit.rendered.has(selected.id);
	  return m`<${SidebarPanel} title="Render reasons"><div data-testid="render-reasons">${reason !== null ? m`<dl class=${s$4.reason}><dt class=${s$4.reasonName}>${getReasonName(reason.type)}${hasReasons ? ":" : ""}</dt><dd class=${s$4.reasonValue}>${hasReasons && reason.items.join(", ")}</dd></dl>` : m`<${Empty}>${rendered ? "-" : "Did not render"}</${Empty}>`}</div><div class=${s$4.message}>${isSupported ? m`<${Message} type=${captureReason ? "info" : "warning"}>${captureReason ? "Timings may be less accurate. " : "Capturing disabled. "}<${MessageBtn} onClick=${() => {
    const value = !captureReason;
    store.profiler.setRenderReasonCapture(value);
    store.profiler.isRecording.$ = true;
    store.emit("start-profiling", {
      captureRenderReasons: value
    });
  }} testId="toggle-render-reason">${captureReason ? "Disable" : "Enable"}</${MessageBtn}></${Message}>` : m`<${Message} type="warning">Upgrade to Preact >=10.4.1 to fully enable this feature.</${Message}>`}</div></${SidebarPanel}>`;
	}

	// MODULE: src/view/components/profiler/components/CommitInfo/DebugInfo.tsx

	const TimeRange = ({
	  from,
	  to
	}) => m`<${p$1}>${from.toFixed(2)} -> ${to.toFixed(2)} | ${(to - from).toFixed(2)}</${p$1}>`;

	function DebugProfilerInfo() {
	  const store = useStore();
	  const commit = useObserver(() => store.profiler.activeCommit.$);
	  const selected = useObserver(() => store.profiler.selectedNode.$);
	  const isRecording = useObserver(() => store.profiler.isRecording.$);
	  const pos = useObserver(() => {
	    const s = store.profiler.selectedNodeId.$;
	    return store.profiler.flamegraphNodes.$.get(s);
	  });

	  if (commit === null || isRecording || !selected || !pos) {
	    return null;
	  }

	  return m`<${SidebarPanel} title="Debug Stats" testId="profiler-debug-stats"><dl class=${s$5.list}><dt class=${s$5.title}>id:</dt><dd class=${s$5.value}>${selected.id}</dd><br/><dt class=${s$5.title}>parentId:</dt><dd class=${s$5.value}>${selected.parent}</dd><br/><dt class=${s$5.title}>rootId:</dt><dd class=${s$5.value}>${getRoot(commit.nodes, selected.id)}</dd><br/><dt class=${s$5.title}>tree:</dt><dd class=${s$5.value}><${TimeRange} from=${pos.x} to=${pos.x + pos.width}/></dd><br/><dt class=${s$5.title}>real:</dt><dd class=${s$5.value}><${TimeRange} from=${selected.startTime} to=${selected.endTime}/></dd></dl></${SidebarPanel}>`;
	}

	// MODULE: src/view/components/profiler/components/RenderedAt/DebugNodeNav.tsx
	function DebugNodeNav() {
	  const store = useStore();
	  const selected = useObserver(() => store.profiler.selectedNodeId.$);
	  const commit = useObserver(() => store.profiler.activeCommit.$);
	  const nodes = useObserver(() => {
	    const commit = store.profiler.activeCommit.$;
	    if (!commit) return [];
	    const out = [];
	    const stack = [commit.rootId];
	    let item;

	    while (item = stack.pop()) {
	      const node = commit.nodes.get(item);
	      if (!node) continue;
	      out.push(node);

	      for (let i = node.children.length - 1; i >= 0; i--) {
	        stack.push(node.children[i]);
	      }
	    }

	    return out;
	  });
	  const isRecording = useObserver(() => store.profiler.isRecording.$);

	  if (isRecording) {
	    return null;
	  }

	  return m`<${SidebarPanel} title="Debug Node Navigation:" testId="profiler-debug-nav">${nodes.length === 0 ? m`<${Empty}>No nodes found inside commmit</${Empty}>` : m`<nav data-testid="debug-nav">${nodes.map(node => {
    return m`<button key=${node.id} class=${s$c.item} data-active=${selected === node.id} onClick=${() => store.profiler.selectedNodeId.$ = node.id}><span style="display: flex; justify-content: space-between; width: 100%"><span>${node.name}${commit && node.id === commit.commitRootId ? m`<b> (R)</b>` : null}</span><span>${node.id}</span></span></button>`;
  })}</nav>`}</${SidebarPanel}>`;
	}

	// MODULE: src/view/components/profiler/components/Profiler.tsx
	function Profiler() {
	  const store = useStore();
	  const showDebug = useObserver(() => store.debugMode.$);
	  const statsRecording = useObserver(() => store.stats.isRecording.$);
	  return m`<${SidebarLayout}><${ThemeSwitcher}/><div class=${s$a.componentActions}><${TimelineBar}/></div><div class=${`${s$a.components} ${s2$1.flamegraphWrapper}`}><${ProfilerInfo}/><${FlameGraph}/></div><div class=${s$a.sidebarActions}><${SidebarHeader}/></div><div class=${s$a.sidebar}>${statsRecording && m`<div class=${s2$1.sidebarItemWrapper}><${Message} type="info">Stats recording is enabled. Timings may be less accurate.<${MessageBtn} onClick=${() => {
    store.stats.isRecording.$ = false;
  }} testId="disable-stats-recording">Disable</${MessageBtn}></${Message}></div>`}<${RenderReasons}/><${RenderedAt}/><${CommitInfo}/>${showDebug && m`<${DebugProfilerInfo}/>`}${showDebug && m`<${DebugNodeNav}/>`}</div></${SidebarLayout}>`;
	}

	var s$3 = {"root":"RadioBar-module_root__1IYNX","label":"RadioBar-module_label__1h8Pi","input":"RadioBar-module_input__1DsAg"};

	// MODULE: src/view/components/RadioBar.tsx
	function RadioBar(props) {
	  return m`<div class=${s$3.root}>${props.items.map(x => {
    return m`<label key=${x.value}><input name=${props.name} class=${s$3.input} checked=${props.value === x.value} type="radio" value=${x.value} onInput=${() => props.onChange(x.value)}/><span class=${s$3.label}>${x.label}</span></label>`;
  })}</div>`;
	}

	var s$2 = {"root":"Settings-module_root__3Us1Q","label":"Settings-module_label__1sQqq","message":"Settings-module_message__13eCy","description":"Settings-module_description__1Mm52","settingSpace":"Settings-module_settingSpace__gsOeF","settingsSpaceSmall":"Settings-module_settingsSpaceSmall__2DAxs"};

	var s$1 = {"root":"Checkbox-module_root__33poc","checkbox":"Checkbox-module_checkbox__213oQ","content":"Checkbox-module_content__2Opc6"};

	// MODULE: src/view/components/Checkbox/Checkbox.tsx
	function Checkbox(props) {
	  return m`<label class=${s$1.root}><span class=${s$1.checkbox}><input type="checkbox" checked=${props.checked} data-testid=${props.testId} onInput=${e => props.onChange(e.target.checked)}/>${props.checked ? m`<${CheckboxChecked}/>` : m`<${CheckboxUnChecked}/>`}</span><span class=${s$1.content}>${props.children}</span></label>`;
	}

	// MODULE: src/view/components/settings/Settings.tsx
	function Settings() {
	  const store = useStore();
	  const theme = useObserver(() => store.theme.$);
	  const renderReasons = useObserver(() => store.profiler.captureRenderReasons.$);
	  const highlightUpdates = useObserver(() => store.profiler.highlightUpdates.$);
	  const debugMode = useObserver(() => store.debugMode.$);
	  const setTheme = A(v => store.theme.$ = v, []);
	  return m`<${PageLayout}><div class=${s$2.root}><form><${Checkbox} checked=${highlightUpdates} onChange=${() => {
    const value = !store.profiler.highlightUpdates.$;
    store.profiler.highlightUpdates.$ = value;
    store.notify(value ? "start-highlight-updates" : "stop-highlight-updates", null);
  }} testId="toggle-highlight-updates">Highlight updates</${Checkbox}><div><p class=${s$2.description}>Visualize updates by highlighting each component that updated in the page.</p></div><${Checkbox} checked=${renderReasons} onChange=${() => store.profiler.setRenderReasonCapture(!renderReasons)} testId="toggle-render-reason">Capture render reasons</${Checkbox}><div class=${`${s$2.message} ${s$2.settingSpace}`}><${Message} type="info">All props, state, and hooks of the current node will be compared to the previous node to determine what changed between renders. Timings may be less accurate because of that.</${Message}></div><label class=${s$2.label}>Theme:</label><${RadioBar} name="theme" value=${theme} onChange=${setTheme} items=${[{
    label: "Auto",
    value: "auto"
  }, {
    label: "Light",
    value: "light"
  }, {
    label: "Dark",
    value: "dark"
  }]}/><h2>Experimental</h2><div class=${s$2.settingsSpaceSmall}><${Checkbox} checked=${debugMode} onChange=${() => store.debugMode.$ = !store.debugMode.$} testId="toggle-debug-mode">Toggle debug mode</${Checkbox}></div></form></div></${PageLayout}>`;
	}

	var s = {"actions":"StatsPanel-module_actions__iLcTQ","content":"StatsPanel-module_content__3qyUo","label":"StatsPanel-module_label__UZoFT","btnWrapper":"StatsPanel-module_btnWrapper__1VHGj","intro":"StatsPanel-module_intro__OzNao","heading":"StatsPanel-module_heading__1PG9G","message":"StatsPanel-module_message__A1zft","description":"StatsPanel-module_description__1-Q-W","cards":"StatsPanel-module_cards__gIUb4","card":"StatsPanel-module_card__2vOwp","table":"StatsPanel-module_table__1E3ME","alignRight":"StatsPanel-module_alignRight__1GZoc"};

	// MODULE: src/view/components/stats/StatsPanel.tsx
	function StatsRecordBtn() {
	  const store = useStore();
	  const isRecording = useObserver(() => store.stats.isRecording.$);
	  const onClick = A(() => {
	    const {
	      isRecording
	    } = store.stats;
	    const v = !isRecording.$;
	    isRecording.$ = v;

	    if (v) {
	      store.emit("start-stats-recording", null);
	    } else {
	      store.emit("stop-stats-recording", null);
	    }
	  }, [store]);
	  return m`<${IconBtn} title=${!isRecording ? "Start Recording" : "Stop Recording"} color=${isRecording ? "var(--color-record-active)" : "var(--color-selected-bg)"} onClick=${onClick} testId="record-btn"><${RecordIcon} size="s"/></${IconBtn}>`;
	}
	function StatsPanel() {
	  const store = useStore();
	  const stats = useObserver(() => store.stats.data.$);
	  const isRecording = useObserver(() => store.stats.isRecording.$);
	  const onReloadAndRecordStats = A(() => {
	    store.stats.isRecording.$ = true;
	    store.emit("reload-and-record-stats", null);
	  }, []);
	  const onReset = A(() => {
	    store.stats.data.$ = null;
	    store.stats.isRecording.$ = false;
	    store.emit("stop-profiling", null);
	  }, [store]);
	  return m`<${SingleLayout}><div class=${s.actions}><${Actions}><div class=${s.btnWrapper}><${StatsRecordBtn}/></div><div class=${s.btnWrapper}><${IconBtn} title="Reload and record statistic" disabled=${isRecording} testId="reload-and-record-stats-btn" onClick=${onReloadAndRecordStats}><${Refresh} size="s"/></${IconBtn}></div><div class=${s.btnWrapper}><${IconBtn} title="Clear statistic data" disabled=${stats === null || isRecording} onClick=${onReset}><${NotInterested} size="s"/></${IconBtn}></div></${Actions}></div><div class=${s.content}>${stats !== null ? m`<${StatsData} stats=${stats}/>` : isRecording ? m`<div class=${s2.root} data-testid="stats-info-recording"><p class=${s2.title}>Statistic recording in progress...</p><p class=${s2.descr}>Click the record button <span class=${s2.inlineBtn}><${StatsRecordBtn}/></span> to stop recording.</p></div>` : m`<div class=${s2.root} data-testid="stats-info"><p class=${s2.title}>No statistic data collected</p><p class=${s2.descr}>Click the record button <span class=${s2.inlineBtn}><${StatsRecordBtn}/></span> to start recording.</p></div>`}</div></${SingleLayout}>`;
	}
	function ChildHeadings() {
	  return m`<tr><th>Type</th><th>Total</th><th>0 Ch.</th><th>1 Ch.</th><th>2 Ch.</th><th>3 Ch.</th><th>n Ch.</th></tr>`;
	}

	function getTotal(arr) {
	  return arr.reduce((acc, n) => acc + n, 0);
	}

	function getOpTotal(info) {
	  return info.components + info.elements + info.text;
	}

	function ChildRow(props) {
	  const {
	    label,
	    total,
	    count,
	    testId = label.toLowerCase().replace(/\s/g, "-")
	  } = props;
	  return m`<tr><td>${label}</td><td class=${s.alignRight} data-testid=${testId + "-total"}>${total}</td><td class=${s.alignRight} data-testid=${testId + "-0"}>${count ? count[0] : "-"}</td><td class=${s.alignRight} data-testid=${testId + "-1"}>${count ? count[1] : "-"}</td><td class=${s.alignRight} data-testid=${testId + "-2"}>${count ? count[2] : "-"}</td><td class=${s.alignRight} data-testid=${testId + "-3"}>${count ? count[3] : "-"}</td><td class=${s.alignRight} data-testid=${testId + "-n"}>${count ? count[4] : "-"}</td></tr>`;
	}

	function OperationRow({
	  name,
	  info
	}) {
	  return m`<tr><td>${name}</td><td class=${s.alignRight} data-testid=${name + "-total"}>${getOpTotal(info)}</td><td class=${s.alignRight} data-testid=${name + "-components"}>${info.components}</td><td class=${s.alignRight} data-testid=${name + "-elements"}>${info.elements}</td><td class=${s.alignRight} data-testid=${name + "-text"}>${info.text}</td></tr>`;
	}

	function StatsData({
	  stats
	}) {
	  return m`<${p$1}><div class=${s.intro}><p>Help us make Preact even faster by sharing these statistics over at <a href="https://github.com/preactjs/preact/issues/2618" rel="noopener noreferrer" target="_blank" data-testid="stats-github-link">this GitHub thread</a>.</p></div><div class=${s.cards}><div class=${s.card}><h2 class=${s.heading}>Operations</h2><table class=${s.table} data-testid="operation-type"><thead><tr><th>Type</th><th>Total</th><th>Components</th><th>Elements</th><th>Text</th></tr></thead><tbody><${OperationRow} name="mount" info=${stats.mounts}/><${OperationRow} name="update" info=${stats.updates}/><${OperationRow} name="unmount" info=${stats.unmounts}/></tbody></table></div><div class=${s.card}><h2 class=${s.heading}>Reconciler</h2><table class=${s.table} data-testid="diff-type"><thead><${ChildHeadings}/></thead><tbody><${ChildRow} label="keyed" total=${getTotal(stats.keyed)} count=${stats.keyed}/><${ChildRow} label="unkeyed" total=${getTotal(stats.unkeyed)} count=${stats.unkeyed}/><${ChildRow} label="mixed" total=${getTotal(stats.mixed)} count=${stats.mixed}/></tbody></table></div><div class=${s.card}><h2 class=${s.heading}>Render Frequency</h2><table class=${s.table} data-testid="vnode-stats"><thead><${ChildHeadings}/></thead><tbody><${ChildRow} label="Root" testId="root" total=${getTotal(stats.roots)} count=${stats.roots}/><${ChildRow} label="Class Component" testId="class-component" total=${getTotal(stats.classComponents)} count=${stats.classComponents}/><${ChildRow} label="Function Component*" testId="function-component" total=${getTotal(stats.functionComponents)} count=${stats.functionComponents}/><${ChildRow} label="Fragment" testId="fragment" total=${getTotal(stats.fragments)} count=${stats.fragments}/><${ChildRow} label="forwardRef" testId="forwardref" total=${getTotal(stats.forwardRef)} count=${stats.forwardRef}/><${ChildRow} label="Memo" testId="memo" total=${getTotal(stats.memo)} count=${stats.memo}/><${ChildRow} label="Suspense" testId="suspense" total=${getTotal(stats.suspense)} count=${stats.suspense}/><${ChildRow} label="Element" testId="element" total=${getTotal(stats.elements)} count=${stats.elements}/><${ChildRow} label="Text**" testId="text" total=${stats.text}/></tbody></table><small>* includes any component that is built via a function.</small><br/><small>** Text nodes can't have children.</small></div><div class=${s.card}><h2 class=${s.heading}>Single Child Type</h2><table class=${s.table} data-testid="sing-child-type"><thead><tr><th>Type</th><th>Total</th></tr></thead><tbody><tr><td>Root</td><td data-testid="single-root">${stats.singleChildType.roots}</td></tr><tr><td>Class Component</td><td data-testid="single-class-component">${stats.singleChildType.classComponents}</td></tr><tr><td>Function Component*</td><td data-testid="single-function-component">${stats.singleChildType.functionComponents}</td></tr><tr><td>Fragment</td><td data-testid="single-fragment">${stats.singleChildType.fragments}</td></tr><tr><td>forwardRef</td><td data-testid="single-forwardref">${stats.singleChildType.forwardRef}</td></tr><tr><td>Memo</td><td data-testid="single-memo">${stats.singleChildType.memo}</td></tr><tr><td>Suspense</td><td data-testid="single-suspense">${stats.singleChildType.suspense}</td></tr><tr><td>Element</td><td data-testid="single-element">${stats.singleChildType.elements}</td></tr><tr><td>Text</td><td data-testid="single-text">${stats.singleChildType.text}</td></tr></tbody></table></div></div></${p$1}>`;
	}

	// MODULE: src/view/components/Devtools.tsx
	function DevTools(props) {
	  const panel = useObserver(() => props.store.activePanel.$);
	  const showElements = panel === Panel.ELEMENTS;
	  const showProfiler = panel === Panel.PROFILER;
	  const showSettings = panel === Panel.SETTINGS;
	  const showStats = panel === Panel.STATISTICS;
	  return m`<${WindowCtx.Provider} value=${props.window}><${EmitCtx.Provider} value=${props.store.emit}><${AppCtx.Provider} value=${props.store}><${p$1}><div class=${`${s$a.theme} ${s$a.root}`}><${ThemeSwitcher}/><${SmallTabGroup} class=${s$a.switcher}><div class=${s$a.switcherInner}><${SmallTab} onClick=${() => props.store.activePanel.$ = Panel.ELEMENTS} checked=${showElements} name="root-panel" value=${Panel.ELEMENTS}>Elements</${SmallTab}><${SmallTab} onClick=${() => props.store.activePanel.$ = Panel.PROFILER} checked=${showProfiler} name="root-panel" value=${Panel.PROFILER}>Profiler</${SmallTab}><${SmallTab} onClick=${() => props.store.activePanel.$ = Panel.STATISTICS} checked=${showStats} name="root-panel" value=${Panel.STATISTICS}>Statistics</${SmallTab}><${SmallTab} onClick=${() => props.store.activePanel.$ = Panel.SETTINGS} checked=${showSettings} name="root-panel" value=${Panel.SETTINGS}>Settings</${SmallTab}></div><a class=${s$a.bugLink} href="https://github.com/preactjs/preact-devtools/issues" target="_blank" rel="noopener noreferrer">Report bug</a></${SmallTabGroup}>${showElements && m`<${Elements}/>`}${showProfiler && m`<${Profiler}/>`}${showStats && m`<${StatsPanel}/>`}${showSettings && m`<${Settings}/>`}</div></${p$1}></${AppCtx.Provider}></${EmitCtx.Provider}></${WindowCtx.Provider}>`;
	}

	// MODULE: src/adapter/protocol/string-table.ts
	/**
	 * Parse message to strings
	 */

	function parseTable(data) {
	  const len = data[0];
	  const strings = [];

	  if (len > 0) {
	    for (let i = 1; i < len; i++) {
	      const strLen = data[i];
	      let start = i + 1;
	      const end = i + strLen + 1;
	      let str = "";

	      for (; start < end; start++) {
	        str += String.fromCodePoint(data[start]);
	      }

	      strings.push(str);
	      i += strLen;
	    }
	  }

	  return strings;
	}

	// MODULE: src/adapter/shared/utils.ts

	function deepClone(obj) {
	  return JSON.parse(JSON.stringify(obj));
	}

	// MODULE: src/constants.ts
	const DevtoolsToClient = "preact-devtools-to-client";
	const PageHookName = "preact-page-hook";
	var Status;

	(function (Status) {
	  Status["Disconnected"] = "disconnected";
	  Status["Connected"] = "connected";
	  Status["Pending"] = "pending";
	})(Status || (Status = {}));
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

	// MODULE: src/adapter/shared/stats.ts
	var DiffType;

	(function (DiffType) {
	  DiffType[DiffType["UNKNOWN"] = 0] = "UNKNOWN";
	  DiffType[DiffType["KEYED"] = 1] = "KEYED";
	  DiffType[DiffType["UNKEYED"] = 2] = "UNKEYED";
	  DiffType[DiffType["MIXED"] = 3] = "MIXED";
	})(DiffType || (DiffType = {}));
	function parseChildrenStats(i, ops) {
	  const data = [ops[i++], ops[i++], ops[i++], ops[i++], ops[i++]];
	  return {
	    i,
	    data
	  };
	}
	function parseTypeStats(i, ops) {
	  const data = {
	    components: ops[i++],
	    elements: ops[i++],
	    text: ops[i++]
	  };
	  return {
	    i,
	    data
	  };
	}
	function parseStats(i, ops) {
	  const roots = parseChildrenStats(i, ops);
	  const klass = parseChildrenStats(roots.i, ops);
	  const fnComps = parseChildrenStats(klass.i, ops);
	  const fragments = parseChildrenStats(fnComps.i, ops);
	  const forwardRef = parseChildrenStats(fragments.i, ops);
	  const memo = parseChildrenStats(forwardRef.i, ops);
	  const suspense = parseChildrenStats(memo.i, ops);
	  const elements = parseChildrenStats(suspense.i, ops);
	  i = elements.i;
	  const text = ops[i++];
	  const keyed = parseChildrenStats(i, ops);
	  const unkeyed = parseChildrenStats(keyed.i, ops);
	  const mixed = parseChildrenStats(unkeyed.i, ops);
	  i = mixed.i;
	  const mounts = parseTypeStats(i, ops);
	  const updates = parseTypeStats(mounts.i, ops);
	  const unmounts = parseTypeStats(updates.i, ops);
	  i = unmounts.i;
	  const singleRoots = ops[i++];
	  const singleClassComponents = ops[i++];
	  const singleFunctionComponents = ops[i++];
	  const singleFragments = ops[i++];
	  const singleForwardRef = ops[i++];
	  const singleMemo = ops[i++];
	  const singleSuspense = ops[i++];
	  const singleElements = ops[i++];
	  const singleText = ops[i++];
	  const stats = {
	    roots: roots.data,
	    classComponents: klass.data,
	    functionComponents: fnComps.data,
	    fragments: fragments.data,
	    forwardRef: forwardRef.data,
	    memo: memo.data,
	    suspense: suspense.data,
	    elements: elements.data,
	    text,
	    keyed: keyed.data,
	    unkeyed: unkeyed.data,
	    mixed: mixed.data,
	    mounts: mounts.data,
	    updates: updates.data,
	    unmounts: unmounts.data,
	    singleChildType: {
	      roots: singleRoots,
	      classComponents: singleClassComponents,
	      functionComponents: singleFunctionComponents,
	      fragments: singleFragments,
	      forwardRef: singleForwardRef,
	      memo: singleMemo,
	      suspense: singleSuspense,
	      elements: singleElements,
	      text: singleText
	    }
	  };
	  return {
	    i,
	    stats
	  };
	}

	// MODULE: src/adapter/protocol/operations.ts
	/**
	 * This is the heart of the devtools. Here we translate incoming events
	 * and construct the tree data structure which all operations in the
	 * Devtools UI are based upon.
	 *
	 * We currently expect all operations to be in order.
	 */

	function ops2Tree(oldTree, existingRoots, ops) {
	  const pending = new Map(oldTree);
	  const rootId = ops[0];
	  const roots = [...existingRoots];
	  const removals = [];
	  const rendered = new Set();
	  const reasons = new Map();
	  let stats = null;
	  let i = ops[1] + 1;
	  const strings = parseTable(ops.slice(1, i + 1));

	  for (i += 1; i < ops.length; i++) {
	    switch (ops[i]) {
	      case MsgTypes.ADD_ROOT:
	        roots.push(ops[i + 1]);
	        i += 1;
	        break;

	      case MsgTypes.ADD_VNODE:
	        {
	          const id = ops[i + 1];
	          const parentId = ops[i + 3];
	          const parent = pending.get(parentId);

	          if (parent) {
	            const clone = deepClone(parent);
	            pending.set(parent.id, clone);
	            clone.children.push(id);
	          }

	          pending.set(id, {
	            children: [],
	            depth: parent ? parent.depth + 1 : 0,
	            id,
	            hocs: null,
	            name: strings[ops[i + 5] - 1],
	            owner: ops[i + 4],
	            parent: parentId,
	            type: ops[i + 2],
	            key: ops[i + 6] > 0 ? strings[ops[i + 6] - 1] : "",
	            startTime: ops[i + 7] / 1000,
	            endTime: ops[i + 8] / 1000
	          });
	          rendered.add(id);
	          i += 8;
	          break;
	        }

	      case MsgTypes.UPDATE_VNODE_TIMINGS:
	        {
	          const id = ops[i + 1];
	          pending.set(id, deepClone(pending.get(id)));
	          const x = pending.get(id);
	          x.startTime = ops[i + 2] / 1000;
	          x.endTime = ops[i + 3] / 1000;
	          rendered.add(id);
	          i += 3;
	          break;
	        }

	      case MsgTypes.REMOVE_VNODE:
	        {
	          const unmounts = ops[i + 1];
	          i += 2;
	          const len = i + unmounts;

	          for (; i < len; i++) {
	            const nodeId = ops[i];
	            removals.push(nodeId);
	            const node = pending.get(nodeId);

	            if (node) {
	              // Remove node from parent children array
	              const parent = pending.get(node.parent);

	              if (parent) {
	                const idx = parent.children.indexOf(nodeId);

	                if (idx > -1) {
	                  const clone = deepClone(parent);
	                  pending.set(parent.id, clone);
	                  clone.children.splice(idx, 1);
	                }
	              } // Check if node was a root


	              const rootIdx = roots.indexOf(node.id);

	              if (rootIdx > -1) {
	                roots.splice(rootIdx, 1);
	              } // Delete children recursively


	              const stack = [node.id];
	              let item;

	              while (item = stack.pop()) {
	                const child = pending.get(item);
	                if (!child) continue;
	                pending.delete(child.id);
	                stack.push(...child.children);
	              }

	              pending.delete(nodeId);
	            }
	          } // Subtract one because of outer loop


	          if (len > 0) i--;
	          break;
	        }

	      case MsgTypes.REORDER_CHILDREN:
	        {
	          const parentId = ops[i + 1];
	          const count = ops[i + 2];
	          const parent = deepClone(pending.get(parentId));
	          parent.children = ops.slice(i + 3, i + 3 + count);
	          pending.set(parentId, parent);
	          i = i + 2 + count;
	          break;
	        }

	      case MsgTypes.RENDER_REASON:
	        {
	          const id = ops[i + 1];
	          const type = ops[i + 2];
	          const count = ops[i + 3];
	          let items = null;

	          if (count > 0) {
	            items = ops.slice(i + 4, i + 4 + count).map(x => strings[x - 1]);
	          }

	          reasons.set(id, {
	            type,
	            items
	          });
	          i = i + 3 + count;
	          break;
	        }

	      case MsgTypes.COMMIT_STATS:
	        {
	          const statsData = parseStats(i + 1, ops);
	          i = statsData.i;
	          stats = statsData.stats;
	          break;
	        }

	      case MsgTypes.HOC_NODES:
	        {
	          const vnodeId = ops[i + 1];
	          const vnode = pending.get(vnodeId);
	          const count = ops[i + 2];

	          if (vnode) {
	            const hocs = [];

	            for (let j = 0; j < count; j++) {
	              hocs.push(strings[ops[i + 3 + j] - 1]);
	            }

	            vnode.hocs = hocs;
	          }

	          i = i + 2 + count;
	          break;
	        }

	      default:
	        throw new Error("Unknown event: " + ops[i]);
	    }
	  }

	  return {
	    rootId,
	    roots,
	    tree: pending,
	    removals,
	    rendered,
	    reasons,
	    stats
	  };
	}

	// MODULE: src/adapter/protocol/legacy/operationsV1.ts
	function applyOperationsV1(store, data) {
	  const nodes = new Map(store.nodes.$);
	  let i = data[1] + 1;
	  const strings = parseTable(data.slice(1, i + 1));
	  const inspected = store.inspectData.$ != null ? store.inspectData.$.id : -2;

	  for (; i < data.length; i++) {
	    switch (data[i]) {
	      case MsgTypes.ADD_ROOT:
	        {
	          const id = data[i + 1];
	          store.roots.$.push(id);
	          i += 1;
	          break;
	        }

	      case MsgTypes.ADD_VNODE:
	        {
	          const id = data[i + 1];
	          const type = data[i + 2];
	          const name = strings[data[i + 5] - 1];
	          const key = data[i + 6] > 0 ? strings[data[i + 6] - 1] : "";
	          let parentId = data[i + 3];

	          if (!nodes.has(id)) {
	            // Roots have their own id as parentId
	            if (id !== parentId) {
	              const parent = nodes.get(parentId);

	              if (!parent) {
	                // throw new Error(`Parent node ${parentId} not found in store.`);
	                // eslint-disable-next-line no-console
	                console.warn(`Parent node ${parentId} not found in store.`);
	                parentId = -1;
	              } else {
	                const clone = deepClone(parent);
	                nodes.set(clone.id, clone);
	                clone.children.push(id);
	              }
	            }

	            const parent = nodes.get(parentId);
	            const depth = parent ? parent.depth + 1 : 1;
	            nodes.set(id, {
	              children: [],
	              depth,
	              id,
	              hocs: null,
	              name,
	              owner: -1,
	              parent: parentId,
	              type,
	              key,
	              startTime: -1,
	              endTime: -1
	            });
	          }

	          i += 6;
	          break;
	        }

	      case MsgTypes.UPDATE_VNODE_TIMINGS:
	        {
	          // Unused event
	          const id = data[i + 1];

	          if (id === inspected) {
	            store.notify("inspect", id);
	          }

	          i += 2;
	          break;
	        }

	      case MsgTypes.REMOVE_VNODE:
	        {
	          const unmounts = data[i + 1];
	          i += 2;
	          const len = i + unmounts;

	          for (; i < len; i++) {
	            const nodeId = data[i];
	            const node = nodes.get(nodeId);

	            if (node) {
	              // Remove node from parent children array
	              const parentId = node.parent;
	              const parent = nodes.get(parentId);

	              if (parent) {
	                const idx = parent.children.indexOf(nodeId);

	                if (idx > -1) {
	                  const clone = deepClone(parent);
	                  nodes.set(clone.id, clone);
	                  clone.children.splice(idx, 1);
	                }
	              }

	              const stack = node.children;

	              while (stack.length > 0) {
	                const childId = stack.pop();

	                if (childId != null) {
	                  const childNode = nodes.get(childId);

	                  if (childNode) {
	                    stack.push(...childNode.children);
	                    nodes.delete(childId);
	                  }
	                }
	              } // Remove node from store


	              nodes.delete(nodeId);
	            }
	          } // Subtract one because of outer loop


	          if (len > 0) i--;
	          break;
	        }

	      case MsgTypes.REORDER_CHILDREN:
	        {
	          const parentId = data[i + 1];
	          const count = data[i + 2];
	          const parent = nodes.get(parentId);

	          if (parent) {
	            const clone = deepClone(parent);
	            nodes.set(clone.id, clone);
	            clone.children = data.slice(i + 3, i + 3 + count);
	          }

	          i = i + 3 + count;
	          break;
	        }
	    }
	  }

	  store.roots.update();
	  store.nodes.$ = nodes;
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

	function sumArrays(a, b) {
	  for (let i = 0; i < b.length; i++) {
	    a[i] += b[i];
	  }
	}

	function sumOps(a, b) {
	  a.components += b.components;
	  a.elements += b.elements;
	  a.text += b.text;
	}
	/**
	 * This is the heart of the devtools. Here we translate incoming events
	 * and construct the tree data structure which all operations in the
	 * Devtools UI are based upon.
	 *
	 * We currently expect all operations to be in order.
	 */


	function applyOperationsV2(store, data) {
	  const {
	    rootId: commitRootId,
	    rendered,
	    roots,
	    tree,
	    reasons,
	    stats
	  } = ops2Tree(store.nodes.$, store.roots.$, data); // Update store data

	  store.roots.$ = roots;
	  store.nodes.$ = tree;

	  if (store.inspectData.$) {
	    const id = store.inspectData.$.id;

	    if (tree.has(id)) {
	      store.notify("inspect", id);
	    }
	  } // If we are profiling, we'll make a frozen copy of the mutable
	  // elements tree because the profiler can step through time


	  if (store.profiler.isRecording.$) {
	    recordProfilerCommit(store.nodes.$, store.profiler, rendered, commitRootId);
	    store.profiler.renderReasons.update(m => {
	      m.set(commitRootId, reasons);
	    });
	  }

	  if (stats !== null) {
	    if (store.stats.data.$ === null) {
	      store.stats.data.$ = stats;
	    } else {
	      store.stats.data.update(v => {
	        if (v === null) return;
	        sumArrays(v.roots, stats.roots);
	        sumArrays(v.classComponents, stats.classComponents);
	        sumArrays(v.functionComponents, stats.functionComponents);
	        sumArrays(v.fragments, stats.fragments);
	        sumArrays(v.forwardRef, stats.forwardRef);
	        sumArrays(v.memo, stats.memo);
	        sumArrays(v.suspense, stats.suspense);
	        sumArrays(v.elements, stats.elements);
	        v.text += stats.text;
	        sumArrays(v.keyed, stats.keyed);
	        sumArrays(v.unkeyed, stats.unkeyed);
	        sumArrays(v.mixed, stats.mixed);
	        sumOps(v.mounts, stats.mounts);
	        sumOps(v.updates, stats.updates);
	        sumOps(v.unmounts, stats.unmounts);
	        const single = v.singleChildType;
	        const singleNew = stats.singleChildType;
	        single.roots += singleNew.roots;
	        single.classComponents += singleNew.classComponents;
	        single.functionComponents += singleNew.functionComponents;
	        single.fragments += singleNew.fragments;
	        single.forwardRef += singleNew.forwardRef;
	        single.memo += singleNew.memo;
	        single.suspense += singleNew.suspense;
	        single.elements += singleNew.elements;
	        return v;
	      });
	    }
	  }
	}
	function applyEvent(store, type, data) {
	  switch (type) {
	    case "attach":
	      if (!store.profiler.isSupported.$) {
	        store.profiler.isSupported.$ = !!data.supportsProfiling;
	      }

	      if (!store.profiler.supportsRenderReasons.$) {
	        store.profiler.supportsRenderReasons.$ = !!data.supportsRenderReasons;
	      }

	      if (!store.supports.hooks.$) {
	        store.supports.hooks.$ = !!data.supportsHooks;
	      }

	      if (store.profiler.highlightUpdates.$) {
	        store.emit("start-highlight-updates", null);
	      }

	      break;

	    case "operation":
	      applyOperationsV1(store, data);
	      break;

	    case "operation_v2":
	      applyOperationsV2(store, data);
	      break;

	    case "inspect-result":
	      {
	        const {
	          props,
	          state,
	          context
	        } = store.sidebar;
	        store.inspectData.$ = data;

	        if (store.selection.selected.$ !== data.id) {
	          store.selection.selectById(data.id); // Reset collapsible state

	          props.uncollapsed.$ = [];
	          state.uncollapsed.$ = [];
	          context.uncollapsed.$ = [];
	        }

	        break;
	      }

	    case "select-node":
	      store.selection.selectById(data);
	      break;

	    case "stop-picker":
	      store.isPicking.$ = false;
	      break;
	  }
	}

	// MODULE: src/shells/inline/index.ts
	function setupFrontendStore(ctx) {
	  const store = createStore();

	  function handleClientEvents(e) {
	    if (e.data && (e.data.source === PageHookName || e.data.source === DevtoolsToClient)) {
	      const data = e.data;
	      applyEvent(store, data.type, data.data);
	    }
	  }

	  ctx.addEventListener("message", handleClientEvents);
	  const unsubscribe = store.subscribe((name, data) => {
	    ctx.postMessage({
	      type: name,
	      data,
	      source: DevtoolsToClient
	    }, "*");
	  });
	  return {
	    store,
	    destroy: () => {
	      ctx.removeEventListener("message", handleClientEvents);
	      unsubscribe();
	    }
	  };
	}
	function setupInlineDevtools(container, ctx) {
	  const {
	    store
	  } = setupFrontendStore(ctx);
	  O(v$1(DevTools, {
	    store,
	    window: ctx
	  }), container);
	  return store;
	}
	function renderDevtools(store, container) {
	  O(v$1(DevTools, {
	    store,
	    window
	  }), container);
	}

	exports.createStore = createStore;
	exports.renderDevtools = renderDevtools;
	exports.setupFrontendStore = setupFrontendStore;
	exports.setupInlineDevtools = setupInlineDevtools;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({});
