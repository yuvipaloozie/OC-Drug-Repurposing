var Xy = (n) => {
  throw TypeError(n);
};
var Qy = (n, i, o) => i.has(n) || Xy("Cannot " + o);
var Dt = (n, i, o) => (Qy(n, i, "read from private field"), o ? o.call(n) : i.get(n)), Zy = (n, i, o) => i.has(n) ? Xy("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(n) : i.set(n, o), Cd = (n, i, o, r) => (Qy(n, i, "write to private field"), r ? r.call(n, o) : i.set(n, o), o);
function yE(n, i) {
  for (var o = 0; o < i.length; o++) {
    const r = i[o];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const c in r)
        if (c !== "default" && !(c in n)) {
          const f = Object.getOwnPropertyDescriptor(r, c);
          f && Object.defineProperty(n, c, f.get ? f : {
            enumerable: !0,
            get: () => r[c]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
function bE(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var wd = { exports: {} }, tr = {};
var Ky;
function SE() {
  if (Ky) return tr;
  Ky = 1;
  var n = /* @__PURE__ */ Symbol.for("react.transitional.element"), i = /* @__PURE__ */ Symbol.for("react.fragment");
  function o(r, c, f) {
    var d = null;
    if (f !== void 0 && (d = "" + f), c.key !== void 0 && (d = "" + c.key), "key" in c) {
      f = {};
      for (var g in c)
        g !== "key" && (f[g] = c[g]);
    } else f = c;
    return c = f.ref, {
      $$typeof: n,
      type: r,
      key: d,
      ref: c !== void 0 ? c : null,
      props: f
    };
  }
  return tr.Fragment = i, tr.jsx = o, tr.jsxs = o, tr;
}
var Jy;
function xE() {
  return Jy || (Jy = 1, wd.exports = SE()), wd.exports;
}
var b = xE(), Ed = { exports: {} }, _e = {};
var Wy;
function CE() {
  if (Wy) return _e;
  Wy = 1;
  var n = /* @__PURE__ */ Symbol.for("react.transitional.element"), i = /* @__PURE__ */ Symbol.for("react.portal"), o = /* @__PURE__ */ Symbol.for("react.fragment"), r = /* @__PURE__ */ Symbol.for("react.strict_mode"), c = /* @__PURE__ */ Symbol.for("react.profiler"), f = /* @__PURE__ */ Symbol.for("react.consumer"), d = /* @__PURE__ */ Symbol.for("react.context"), g = /* @__PURE__ */ Symbol.for("react.forward_ref"), h = /* @__PURE__ */ Symbol.for("react.suspense"), y = /* @__PURE__ */ Symbol.for("react.memo"), x = /* @__PURE__ */ Symbol.for("react.lazy"), p = /* @__PURE__ */ Symbol.for("react.activity"), S = /* @__PURE__ */ Symbol.for("react.view_transition"), C = Symbol.iterator;
  function R(E) {
    return E === null || typeof E != "object" ? null : (E = C && E[C] || E["@@iterator"], typeof E == "function" ? E : null);
  }
  var _ = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, T = Object.assign, O = {};
  function D(E, A, j) {
    this.props = E, this.context = A, this.refs = O, this.updater = j || _;
  }
  D.prototype.isReactComponent = {}, D.prototype.setState = function(E, A) {
    if (typeof E != "object" && typeof E != "function" && E != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, E, A, "setState");
  }, D.prototype.forceUpdate = function(E) {
    this.updater.enqueueForceUpdate(this, E, "forceUpdate");
  };
  function U() {
  }
  U.prototype = D.prototype;
  function P(E, A, j) {
    this.props = E, this.context = A, this.refs = O, this.updater = j || _;
  }
  var Q = P.prototype = new U();
  Q.constructor = P, T(Q, D.prototype), Q.isPureReactComponent = !0;
  var B = Array.isArray;
  function H() {
  }
  var $ = { H: null, A: null, T: null, S: null }, ae = Object.prototype.hasOwnProperty;
  function K(E, A, j) {
    var V = j.ref;
    return {
      $$typeof: n,
      type: E,
      key: A,
      ref: V !== void 0 ? V : null,
      props: j
    };
  }
  function se(E, A) {
    return K(E.type, A, E.props);
  }
  function oe(E) {
    return typeof E == "object" && E !== null && E.$$typeof === n;
  }
  function he(E) {
    var A = { "=": "=0", ":": "=2" };
    return "$" + E.replace(/[=:]/g, function(j) {
      return A[j];
    });
  }
  var ge = /\/+/g;
  function de(E, A) {
    return typeof E == "object" && E !== null && E.key != null ? he("" + E.key) : A.toString(36);
  }
  function Z(E) {
    switch (E.status) {
      case "fulfilled":
        return E.value;
      case "rejected":
        throw E.reason;
      default:
        switch (typeof E.status == "string" ? E.then(H, H) : (E.status = "pending", E.then(
          function(A) {
            E.status === "pending" && (E.status = "fulfilled", E.value = A);
          },
          function(A) {
            E.status === "pending" && (E.status = "rejected", E.reason = A);
          }
        )), E.status) {
          case "fulfilled":
            return E.value;
          case "rejected":
            throw E.reason;
        }
    }
    throw E;
  }
  function le(E, A, j, V, te) {
    var F = typeof E;
    (F === "undefined" || F === "boolean") && (E = null);
    var ue = !1;
    if (E === null) ue = !0;
    else
      switch (F) {
        case "bigint":
        case "string":
        case "number":
          ue = !0;
          break;
        case "object":
          switch (E.$$typeof) {
            case n:
            case i:
              ue = !0;
              break;
            case x:
              return ue = E._init, le(
                ue(E._payload),
                A,
                j,
                V,
                te
              );
          }
      }
    if (ue)
      return te = te(E), ue = V === "" ? "." + de(E, 0) : V, B(te) ? (j = "", ue != null && (j = ue.replace(ge, "$&/") + "/"), le(te, A, j, "", function(Ee) {
        return Ee;
      })) : te != null && (oe(te) && (te = se(
        te,
        j + (te.key == null || E && E.key === te.key ? "" : ("" + te.key).replace(
          ge,
          "$&/"
        ) + "/") + ue
      )), A.push(te)), 1;
    ue = 0;
    var re = V === "" ? "." : V + ":";
    if (B(E))
      for (var ce = 0; ce < E.length; ce++)
        V = E[ce], F = re + de(V, ce), ue += le(
          V,
          A,
          j,
          F,
          te
        );
    else if (ce = R(E), typeof ce == "function")
      for (E = ce.call(E), ce = 0; !(V = E.next()).done; )
        V = V.value, F = re + de(V, ce++), ue += le(
          V,
          A,
          j,
          F,
          te
        );
    else if (F === "object") {
      if (typeof E.then == "function")
        return le(
          Z(E),
          A,
          j,
          V,
          te
        );
      throw A = String(E), Error(
        "Objects are not valid as a React child (found: " + (A === "[object Object]" ? "object with keys {" + Object.keys(E).join(", ") + "}" : A) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return ue;
  }
  function ie(E, A, j) {
    if (E == null) return E;
    var V = [], te = 0;
    return le(E, V, "", "", function(F) {
      return A.call(j, F, te++);
    }), V;
  }
  function me(E) {
    if (E._status === -1) {
      var A = E._result, j = A();
      j.then(
        function(V) {
          (E._status === 0 || E._status === -1) && (E._status = 1, E._result = V, j.status === void 0 && (j.status = "fulfilled", j.value = V));
        },
        function(V) {
          (E._status === 0 || E._status === -1) && (E._status = 2, E._result = V, j.status === void 0 && (j.status = "rejected", j.reason = V));
        }
      ), E._status === -1 && (E._status = 0, E._result = j);
    }
    if (E._status === 1) return E._result.default;
    throw E._result;
  }
  var ne = typeof reportError == "function" ? reportError : function(E) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var A = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof E == "object" && E !== null && typeof E.message == "string" ? String(E.message) : String(E),
        error: E
      });
      if (!window.dispatchEvent(A)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", E);
      return;
    }
    console.error(E);
  };
  function ze(E) {
    var A = $.T, j = {};
    j.types = A !== null ? A.types : null, $.T = j;
    try {
      var V = E(), te = $.S;
      te !== null && te(j, V), typeof V == "object" && V !== null && typeof V.then == "function" && V.then(H, ne);
    } catch (F) {
      ne(F);
    } finally {
      A !== null && j.types !== null && (A.types = j.types), $.T = A;
    }
  }
  function W(E) {
    var A = $.T;
    if (A !== null) {
      var j = A.types;
      j === null ? A.types = [E] : j.indexOf(E) === -1 && j.push(E);
    } else ze(W.bind(null, E));
  }
  var M = {
    map: ie,
    forEach: function(E, A, j) {
      ie(
        E,
        function() {
          A.apply(this, arguments);
        },
        j
      );
    },
    count: function(E) {
      var A = 0;
      return ie(E, function() {
        A++;
      }), A;
    },
    toArray: function(E) {
      return ie(E, function(A) {
        return A;
      }) || [];
    },
    only: function(E) {
      if (!oe(E))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return E;
    }
  };
  return _e.Activity = p, _e.Children = M, _e.Component = D, _e.Fragment = o, _e.Profiler = c, _e.PureComponent = P, _e.StrictMode = r, _e.Suspense = h, _e.ViewTransition = S, _e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = $, _e.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(E) {
      return $.H.useMemoCache(E);
    }
  }, _e.addTransitionType = W, _e.cache = function(E) {
    return function() {
      return E.apply(null, arguments);
    };
  }, _e.cacheSignal = function() {
    return null;
  }, _e.cloneElement = function(E, A, j) {
    if (E == null)
      throw Error(
        "The argument must be a React element, but you passed " + E + "."
      );
    var V = T({}, E.props), te = E.key;
    if (A != null)
      for (F in A.key !== void 0 && (te = "" + A.key), A)
        !ae.call(A, F) || F === "key" || F === "__self" || F === "__source" || F === "ref" && A.ref === void 0 || (V[F] = A[F]);
    var F = arguments.length - 2;
    if (F === 1) V.children = j;
    else if (1 < F) {
      for (var ue = Array(F), re = 0; re < F; re++)
        ue[re] = arguments[re + 2];
      V.children = ue;
    }
    return K(E.type, te, V);
  }, _e.createContext = function(E) {
    return E = {
      $$typeof: d,
      _currentValue: E,
      _currentValue2: E,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, E.Provider = E, E.Consumer = {
      $$typeof: f,
      _context: E
    }, E;
  }, _e.createElement = function(E, A, j) {
    var V, te = {}, F = null;
    if (A != null)
      for (V in A.key !== void 0 && (F = "" + A.key), A)
        ae.call(A, V) && V !== "key" && V !== "__self" && V !== "__source" && (te[V] = A[V]);
    var ue = arguments.length - 2;
    if (ue === 1) te.children = j;
    else if (1 < ue) {
      for (var re = Array(ue), ce = 0; ce < ue; ce++)
        re[ce] = arguments[ce + 2];
      te.children = re;
    }
    if (E && E.defaultProps)
      for (V in ue = E.defaultProps, ue)
        te[V] === void 0 && (te[V] = ue[V]);
    return K(E, F, te);
  }, _e.createRef = function() {
    return { current: null };
  }, _e.forwardRef = function(E) {
    return { $$typeof: g, render: E };
  }, _e.isValidElement = oe, _e.lazy = function(E) {
    return {
      $$typeof: x,
      _payload: { _status: -1, _result: E },
      _init: me
    };
  }, _e.memo = function(E, A) {
    return {
      $$typeof: y,
      type: E,
      compare: A === void 0 ? null : A
    };
  }, _e.startTransition = ze, _e.unstable_useCacheRefresh = function() {
    return $.H.useCacheRefresh();
  }, _e.use = function(E) {
    return $.H.use(E);
  }, _e.useActionState = function(E, A, j) {
    return $.H.useActionState(E, A, j);
  }, _e.useCallback = function(E, A) {
    return $.H.useCallback(E, A);
  }, _e.useContext = function(E) {
    return $.H.useContext(E);
  }, _e.useDebugValue = function() {
  }, _e.useDeferredValue = function(E, A) {
    return $.H.useDeferredValue(E, A);
  }, _e.useEffect = function(E, A) {
    return $.H.useEffect(E, A);
  }, _e.useEffectEvent = function(E) {
    return $.H.useEffectEvent(E);
  }, _e.useId = function() {
    return $.H.useId();
  }, _e.useImperativeHandle = function(E, A, j) {
    return $.H.useImperativeHandle(E, A, j);
  }, _e.useInsertionEffect = function(E, A) {
    return $.H.useInsertionEffect(E, A);
  }, _e.useLayoutEffect = function(E, A) {
    return $.H.useLayoutEffect(E, A);
  }, _e.useMemo = function(E, A) {
    return $.H.useMemo(E, A);
  }, _e.useOptimistic = function(E, A) {
    return $.H.useOptimistic(E, A);
  }, _e.useReducer = function(E, A, j) {
    return $.H.useReducer(E, A, j);
  }, _e.useRef = function(E) {
    return $.H.useRef(E);
  }, _e.useState = function(E) {
    return $.H.useState(E);
  }, _e.useSyncExternalStore = function(E, A, j) {
    return $.H.useSyncExternalStore(
      E,
      A,
      j
    );
  }, _e.useTransition = function() {
    return $.H.useTransition();
  }, _e.version = "19.3.0", _e;
}
var e0;
function kg() {
  return e0 || (e0 = 1, Ed.exports = CE()), Ed.exports;
}
var v = kg();
const ab = /* @__PURE__ */ bE(v), Qa = /* @__PURE__ */ yE({
  __proto__: null,
  default: ab
}, [v]);
var Rd = { exports: {} }, nr = {}, _d = { exports: {} }, Td = {};
var t0;
function wE() {
  return t0 || (t0 = 1, (function(n) {
    function i(Z, le) {
      var ie = Z.length;
      Z.push(le);
      e: for (; 0 < ie; ) {
        var me = ie - 1 >>> 1, ne = Z[me];
        if (0 < c(ne, le))
          Z[me] = le, Z[ie] = ne, ie = me;
        else break e;
      }
    }
    function o(Z) {
      return Z.length === 0 ? null : Z[0];
    }
    function r(Z) {
      if (Z.length === 0) return null;
      var le = Z[0], ie = Z.pop();
      if (ie !== le) {
        Z[0] = ie;
        e: for (var me = 0, ne = Z.length, ze = ne >>> 1; me < ze; ) {
          var W = 2 * (me + 1) - 1, M = Z[W], E = W + 1, A = Z[E];
          if (0 > c(M, ie))
            E < ne && 0 > c(A, M) ? (Z[me] = A, Z[E] = ie, me = E) : (Z[me] = M, Z[W] = ie, me = W);
          else if (E < ne && 0 > c(A, ie))
            Z[me] = A, Z[E] = ie, me = E;
          else break e;
        }
      }
      return le;
    }
    function c(Z, le) {
      var ie = Z.sortIndex - le.sortIndex;
      return ie !== 0 ? ie : Z.id - le.id;
    }
    if (n.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var f = performance;
      n.unstable_now = function() {
        return f.now();
      };
    } else {
      var d = Date, g = d.now();
      n.unstable_now = function() {
        return d.now() - g;
      };
    }
    var h = [], y = [], x = 1, p = null, S = 3, C = !1, R = !1, _ = !1, T = !1, O = typeof setTimeout == "function" ? setTimeout : null, D = typeof clearTimeout == "function" ? clearTimeout : null, U = typeof setImmediate < "u" ? setImmediate : null;
    function P(Z) {
      for (var le = o(y); le !== null; ) {
        if (le.callback === null) r(y);
        else if (le.startTime <= Z)
          r(y), le.sortIndex = le.expirationTime, i(h, le);
        else break;
        le = o(y);
      }
    }
    function Q(Z) {
      if (_ = !1, P(Z), !R)
        if (o(h) !== null)
          R = !0, B || (B = !0, oe());
        else {
          var le = o(y);
          le !== null && de(Q, le.startTime - Z);
        }
    }
    var B = !1, H = -1, $ = 5, ae = -1;
    function K() {
      return T ? !0 : !(n.unstable_now() - ae < $);
    }
    function se() {
      if (T = !1, B) {
        var Z = n.unstable_now();
        ae = Z;
        var le = !0;
        try {
          e: {
            R = !1, _ && (_ = !1, D(H), H = -1), C = !0;
            var ie = S;
            try {
              t: {
                for (P(Z), p = o(h); p !== null && !(p.expirationTime > Z && K()); ) {
                  var me = p.callback;
                  if (typeof me == "function") {
                    p.callback = null, S = p.priorityLevel;
                    var ne = me(
                      p.expirationTime <= Z
                    );
                    if (Z = n.unstable_now(), typeof ne == "function") {
                      p.callback = ne, P(Z), le = !0;
                      break t;
                    }
                    p === o(h) && r(h), P(Z);
                  } else r(h);
                  p = o(h);
                }
                if (p !== null) le = !0;
                else {
                  var ze = o(y);
                  ze !== null && de(
                    Q,
                    ze.startTime - Z
                  ), le = !1;
                }
              }
              break e;
            } finally {
              p = null, S = ie, C = !1;
            }
            le = void 0;
          }
        } finally {
          le ? oe() : B = !1;
        }
      }
    }
    var oe;
    if (typeof U == "function")
      oe = function() {
        U(se);
      };
    else if (typeof MessageChannel < "u") {
      var he = new MessageChannel(), ge = he.port2;
      he.port1.onmessage = se, oe = function() {
        ge.postMessage(null);
      };
    } else
      oe = function() {
        O(se, 0);
      };
    function de(Z, le) {
      H = O(function() {
        Z(n.unstable_now());
      }, le);
    }
    n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function(Z) {
      Z.callback = null;
    }, n.unstable_forceFrameRate = function(Z) {
      0 > Z || 125 < Z ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : $ = 0 < Z ? Math.floor(1e3 / Z) : 5;
    }, n.unstable_getCurrentPriorityLevel = function() {
      return S;
    }, n.unstable_next = function(Z) {
      switch (S) {
        case 1:
        case 2:
        case 3:
          var le = 3;
          break;
        default:
          le = S;
      }
      var ie = S;
      S = le;
      try {
        return Z();
      } finally {
        S = ie;
      }
    }, n.unstable_requestPaint = function() {
      T = !0;
    }, n.unstable_runWithPriority = function(Z, le) {
      switch (Z) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          Z = 3;
      }
      var ie = S;
      S = Z;
      try {
        return le();
      } finally {
        S = ie;
      }
    }, n.unstable_scheduleCallback = function(Z, le, ie) {
      var me = n.unstable_now();
      switch (typeof ie == "object" && ie !== null ? (ie = ie.delay, ie = typeof ie == "number" && 0 < ie ? me + ie : me) : ie = me, Z) {
        case 1:
          var ne = -1;
          break;
        case 2:
          ne = 250;
          break;
        case 5:
          ne = 1073741823;
          break;
        case 4:
          ne = 1e4;
          break;
        default:
          ne = 5e3;
      }
      return ne = ie + ne, Z = {
        id: x++,
        callback: le,
        priorityLevel: Z,
        startTime: ie,
        expirationTime: ne,
        sortIndex: -1
      }, ie > me ? (Z.sortIndex = ie, i(y, Z), o(h) === null && Z === o(y) && (_ ? (D(H), H = -1) : _ = !0, de(Q, ie - me))) : (Z.sortIndex = ne, i(h, Z), R || C || (R = !0, B || (B = !0, oe()))), Z;
    }, n.unstable_shouldYield = K, n.unstable_wrapCallback = function(Z) {
      var le = S;
      return function() {
        var ie = S;
        S = le;
        try {
          return Z.apply(this, arguments);
        } finally {
          S = ie;
        }
      };
    };
  })(Td)), Td;
}
var n0;
function EE() {
  return n0 || (n0 = 1, _d.exports = wE()), _d.exports;
}
var Ad = { exports: {} }, Ot = {};
var l0;
function RE() {
  if (l0) return Ot;
  l0 = 1;
  var n = kg();
  function i(x) {
    var p = "https://react.dev/errors/" + x;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var S = 2; S < arguments.length; S++)
        p += "&args[]=" + encodeURIComponent(arguments[S]);
    }
    return "Minified React error #" + x + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function o() {
  }
  var r = {
    d: {
      f: o,
      r: function() {
        throw Error(i(522));
      },
      D: o,
      C: o,
      L: o,
      m: o,
      X: o,
      S: o,
      M: o
    },
    p: 0,
    findDOMNode: null
  }, c = /* @__PURE__ */ Symbol.for("react.portal"), f = /* @__PURE__ */ Symbol.for("react.recoverable"), d = /* @__PURE__ */ Symbol.for("react.optimistic_key");
  function g(x, p, S) {
    var C = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: C == null ? null : C === d ? d : "" + C,
      children: x,
      containerInfo: p,
      implementation: S
    };
  }
  var h = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function y(x, p) {
    if (x === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return Ot.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = r, Ot.browser = function(x) {
    return { $$typeof: f, _reason: x };
  }, Ot.createPortal = function(x, p) {
    var S = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(i(299));
    return g(x, p, null, S);
  }, Ot.flushSync = function(x) {
    var p = h.T, S = r.p;
    try {
      if (h.T = null, r.p = 2, x) return x();
    } finally {
      h.T = p, r.p = S, r.d.f();
    }
  }, Ot.preconnect = function(x, p) {
    typeof x == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, r.d.C(x, p));
  }, Ot.prefetchDNS = function(x) {
    typeof x == "string" && r.d.D(x);
  }, Ot.preinit = function(x, p) {
    if (typeof x == "string" && p && typeof p.as == "string") {
      var S = p.as, C = y(S, p.crossOrigin), R = typeof p.integrity == "string" ? p.integrity : void 0, _ = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      S === "style" ? r.d.S(
        x,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: C,
          integrity: R,
          fetchPriority: _
        }
      ) : S === "script" && r.d.X(x, {
        crossOrigin: C,
        integrity: R,
        fetchPriority: _,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, Ot.preinitModule = function(x, p) {
    if (typeof x == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var S = y(
            p.as,
            p.crossOrigin
          );
          r.d.M(x, {
            crossOrigin: S,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0
          });
        }
      } else p == null && r.d.M(x);
  }, Ot.preload = function(x, p) {
    if (typeof x == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var S = p.as, C = y(S, p.crossOrigin);
      r.d.L(x, S, {
        crossOrigin: C,
        integrity: typeof p.integrity == "string" ? p.integrity : void 0,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0,
        type: typeof p.type == "string" ? p.type : void 0,
        fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
        referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
        imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
        imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
        media: typeof p.media == "string" ? p.media : void 0
      });
    }
  }, Ot.preloadModule = function(x, p) {
    if (typeof x == "string")
      if (p) {
        var S = y(p.as, p.crossOrigin);
        r.d.m(x, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: S,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0,
          fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0
        });
      } else r.d.m(x);
  }, Ot.requestFormReset = function(x) {
    r.d.r(x);
  }, Ot.unstable_batchedUpdates = function(x, p) {
    return x(p);
  }, Ot.useFormState = function(x, p, S) {
    return h.H.useFormState(x, p, S);
  }, Ot.useFormStatus = function() {
    return h.H.useHostTransitionStatus();
  }, Ot.version = "19.3.0", Ot;
}
var a0;
function ib() {
  if (a0) return Ad.exports;
  a0 = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), Ad.exports = RE(), Ad.exports;
}
var i0;
function _E() {
  if (i0) return nr;
  i0 = 1;
  var n = EE(), i = kg(), o = ib();
  function r(e) {
    var t = "https://react.dev/errors/" + e;
    if (1 < arguments.length) {
      t += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var l = 2; l < arguments.length; l++)
        t += "&args[]=" + encodeURIComponent(arguments[l]);
    }
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function f(e) {
    for (var t = e, l = t; l && !l.alternate; )
      t = l, (t.flags & 4098) !== 0 && (e = t.return), l = t.return;
    for (; t.return; ) t = t.return;
    return t.tag === 3 ? e : null;
  }
  function d(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function g(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function h(e) {
    if (f(e) !== e)
      throw Error(r(188));
  }
  function y(e) {
    var t = e.alternate;
    if (!t) {
      if (t = f(e), t === null) throw Error(r(188));
      return t !== e ? null : e;
    }
    for (var l = e, a = t; ; ) {
      var u = l.return;
      if (u === null) break;
      var s = u.alternate;
      if (s === null) {
        if (a = u.return, a !== null) {
          l = a;
          continue;
        }
        break;
      }
      if (u.child === s.child) {
        for (s = u.child; s; ) {
          if (s === l) return h(u), e;
          if (s === a) return h(u), t;
          s = s.sibling;
        }
        throw Error(r(188));
      }
      if (l.return !== a.return) l = u, a = s;
      else {
        for (var m = !1, w = u.child; w; ) {
          if (w === l) {
            m = !0, l = u, a = s;
            break;
          }
          if (w === a) {
            m = !0, a = u, l = s;
            break;
          }
          w = w.sibling;
        }
        if (!m) {
          for (w = s.child; w; ) {
            if (w === l) {
              m = !0, l = s, a = u;
              break;
            }
            if (w === a) {
              m = !0, a = s, l = u;
              break;
            }
            w = w.sibling;
          }
          if (!m) throw Error(r(189));
        }
      }
      if (l.alternate !== a) throw Error(r(190));
    }
    if (l.tag !== 3) throw Error(r(188));
    return l.stateNode.current === l ? e : t;
  }
  function x(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null; ) {
      if (t = x(e), t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  function p(e, t, l, a, u, s) {
    for (; e !== null; ) {
      if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && l(e, a, u, s) || (e.tag !== 22 || e.memoizedState === null) && (t || e.tag !== 5 && e.tag !== 27) && p(
        e.child,
        t,
        l,
        a,
        u,
        s
      ))
        return !0;
      e = e.sibling;
    }
    return !1;
  }
  function S(e) {
    for (e = e.return; e !== null; ) {
      if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
      e = e.return;
    }
    return null;
  }
  function C(e) {
    var t = !1;
    for (e = e.return; e !== null && (e.tag === 4 && (t = !0), !(e.tag === 3 || e.tag === 5 || e.tag === 27)); )
      e = e.return;
    return t;
  }
  function R(e) {
    var t = [null, null], l = S(e);
    return l === null || _(
      t,
      e,
      l.child,
      { foundSelf: !1 }
    ), t;
  }
  function _(e, t, l, a) {
    for (; l !== null; ) {
      if (l === t) a.foundSelf = !0;
      else if (l.tag === 5 || l.tag === 27 || l.tag === 6) {
        if (a.foundSelf) return e[1] = l, !0;
        e[0] = l;
      } else if ((l.tag !== 22 || l.memoizedState === null) && _(
        e,
        t,
        l.child,
        a
      ))
        return !0;
      l = l.sibling;
    }
    return !1;
  }
  function T(e) {
    switch (e.tag) {
      case 5:
      case 27:
      case 6:
        return e.stateNode;
      case 3:
        return e.stateNode.containerInfo;
      default:
        throw Error(r(559));
    }
  }
  var O = null, D = null;
  function U(e, t, l) {
    return e === l ? !0 : e === t ? (O = e, !0) : !1;
  }
  function P(e, t, l) {
    return e === l ? (D = e, !1) : e === t ? (D !== null && (O = e), !0) : !1;
  }
  function Q(e) {
    if (e === null) return null;
    do
      e = e === null ? null : e.return;
    while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
    return e || null;
  }
  function B(e, t, l) {
    for (var a = 0, u = e; u; u = l(u)) a++;
    u = 0;
    for (var s = t; s; s = l(s)) u++;
    for (; 0 < a - u; ) e = l(e), a--;
    for (; 0 < u - a; ) t = l(t), u--;
    for (; a--; ) {
      if (e === t || t !== null && e === t.alternate)
        return e;
      e = l(e), t = l(t);
    }
    return null;
  }
  var H = Object.assign, $ = /* @__PURE__ */ Symbol.for("react.element"), ae = /* @__PURE__ */ Symbol.for("react.transitional.element"), K = /* @__PURE__ */ Symbol.for("react.portal"), se = /* @__PURE__ */ Symbol.for("react.fragment"), oe = /* @__PURE__ */ Symbol.for("react.strict_mode"), he = /* @__PURE__ */ Symbol.for("react.profiler"), ge = /* @__PURE__ */ Symbol.for("react.consumer"), de = /* @__PURE__ */ Symbol.for("react.context"), Z = /* @__PURE__ */ Symbol.for("react.forward_ref"), le = /* @__PURE__ */ Symbol.for("react.suspense"), ie = /* @__PURE__ */ Symbol.for("react.suspense_list"), me = /* @__PURE__ */ Symbol.for("react.memo"), ne = /* @__PURE__ */ Symbol.for("react.lazy"), ze = /* @__PURE__ */ Symbol.for("react.activity"), W = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), M = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), E = /* @__PURE__ */ Symbol.for("react.view_transition"), A = /* @__PURE__ */ Symbol.for("react.recoverable"), j = Symbol.iterator;
  function V(e) {
    return e === null || typeof e != "object" ? null : (e = j && e[j] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var te = /* @__PURE__ */ Symbol.for("react.client.reference");
  function F(e) {
    if (e == null) return null;
    if (typeof e == "function")
      return e.$$typeof === te ? null : e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case se:
        return "Fragment";
      case he:
        return "Profiler";
      case oe:
        return "StrictMode";
      case le:
        return "Suspense";
      case ie:
        return "SuspenseList";
      case ze:
        return "Activity";
      case E:
        return "ViewTransition";
    }
    if (typeof e == "object")
      switch (e.$$typeof) {
        case K:
          return "Portal";
        case de:
          return e.displayName || "Context";
        case ge:
          return (e._context.displayName || "Context") + ".Consumer";
        case Z:
          var t = e.render;
          return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
        case me:
          return t = e.displayName || null, t !== null ? t : F(e.type) || "Memo";
        case ne:
          t = e._payload, e = e._init;
          try {
            return F(e(t));
          } catch {
          }
      }
    return null;
  }
  var ue = Array.isArray, re = i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ce = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Ee = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Qe = [], rt = -1;
  function ut(e) {
    return { current: e };
  }
  function Je(e) {
    0 > rt || (e.current = Qe[rt], Qe[rt] = null, rt--);
  }
  function Re(e, t) {
    rt++, Qe[rt] = e.current, e.current = t;
  }
  var Mt = ut(null), Hn = ut(null), X = ut(null), Me = ut(null);
  function Ln(e, t) {
    switch (Re(X, t), Re(Hn, e), Re(Mt, null), t.nodeType) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? ly(e) : 0;
        break;
      default:
        if (e = t.tagName, t = t.namespaceURI)
          t = ly(t), e = ay(t, e);
        else
          switch (e) {
            case "svg":
              e = 1;
              break;
            case "math":
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    Je(Mt), Re(Mt, e);
  }
  function Ja() {
    Je(Mt), Je(Hn), Je(X);
  }
  function Bs(e) {
    var t = e.memoizedState;
    t !== null && (Gi._currentValue = t.memoizedState, Re(Me, e)), t = Mt.current;
    var l = ay(t, e.type);
    t !== l && (Re(Hn, e), Re(Mt, l));
  }
  function br(e) {
    Hn.current === e && (Je(Mt), Je(Hn)), Me.current === e && (Je(Me), Gi._currentValue = Ee);
  }
  var qs, Em;
  function Tl(e) {
    if (qs === void 0)
      try {
        throw Error();
      } catch (l) {
        var t = l.stack.trim().match(/\n( *(at )?)/);
        qs = t && t[1] || "", Em = -1 < l.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < l.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + qs + e + Em;
  }
  var Ps = !1;
  function Is(e, t) {
    if (!e || Ps) return "";
    Ps = !0;
    var l = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var a = {
        DetermineComponentFrameRoot: function() {
          try {
            if (t) {
              var ee = function() {
                throw Error();
              };
              if (Object.defineProperty(ee.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(ee, []);
                } catch (fe) {
                  var L = fe;
                }
                Reflect.construct(e, [], ee);
              } else {
                try {
                  ee.call();
                } catch (fe) {
                  L = fe;
                }
                ee = !1;
                try {
                  var I = Object.getOwnPropertyDescriptor(
                    e.prototype,
                    "props"
                  );
                  Object.defineProperty(e.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), ee = !0, new e();
                } finally {
                  ee && (I !== void 0 ? Object.defineProperty(e.prototype, "props", I) : delete e.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (fe) {
                L = fe;
              }
              (ee = e()) && typeof ee.catch == "function" && ee.catch(function() {
              });
            }
          } catch (fe) {
            if (fe && L && typeof fe.stack == "string")
              return [fe.stack, L.stack];
          }
          return [null, null];
        }
      };
      a.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var u = Object.getOwnPropertyDescriptor(
        a.DetermineComponentFrameRoot,
        "name"
      );
      u && u.configurable && Object.defineProperty(
        a.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var s = a.DetermineComponentFrameRoot(), m = s[0], w = s[1];
      if (m && w) {
        var z = m.split(`
`), k = w.split(`
`);
        for (u = a = 0; a < z.length && !z[a].includes("DetermineComponentFrameRoot"); )
          a++;
        for (; u < k.length && !k[u].includes(
          "DetermineComponentFrameRoot"
        ); )
          u++;
        if (a === z.length || u === k.length)
          for (a = z.length - 1, u = k.length - 1; 1 <= a && 0 <= u && z[a] !== k[u]; )
            u--;
        for (; 1 <= a && 0 <= u; a--, u--)
          if (z[a] !== k[u]) {
            if (a !== 1 || u !== 1)
              do
                if (a--, u--, 0 > u || z[a] !== k[u]) {
                  var Y = `
` + z[a].replace(" at new ", " at ");
                  return e.displayName && Y.includes("<anonymous>") && (Y = Y.replace("<anonymous>", e.displayName)), Y;
                }
              while (1 <= a && 0 <= u);
            break;
          }
      }
    } finally {
      Ps = !1, Error.prepareStackTrace = l;
    }
    return (l = e ? e.displayName || e.name : "") ? Tl(l) : "";
  }
  function C1(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Tl(e.type);
      case 16:
        return Tl("Lazy");
      case 13:
        return e.child !== t && t !== null ? Tl("Suspense Fallback") : Tl("Suspense");
      case 19:
        return Tl("SuspenseList");
      case 0:
      case 15:
        return Is(e.type, !1);
      case 11:
        return Is(e.type.render, !1);
      case 1:
        return Is(e.type, !0);
      case 31:
        return Tl("Activity");
      case 30:
        return Tl("ViewTransition");
      default:
        return "";
    }
  }
  function Rm(e) {
    try {
      var t = "", l = null;
      do
        t += C1(e, l), l = e, e = e.return;
      while (e);
      return t;
    } catch (a) {
      return `
Error generating stack: ` + a.message + `
` + a.stack;
    }
  }
  var $s = Object.prototype.hasOwnProperty, Ys = n.unstable_scheduleCallback, Fs = n.unstable_cancelCallback, w1 = n.unstable_shouldYield, E1 = n.unstable_requestPaint, Kt = n.unstable_now, R1 = n.unstable_getCurrentPriorityLevel, _m = n.unstable_ImmediatePriority, Tm = n.unstable_UserBlockingPriority, Sr = n.unstable_NormalPriority, _1 = n.unstable_LowPriority, Am = n.unstable_IdlePriority, T1 = n.log, A1 = n.unstable_setDisableYieldValue, ro = null, Jt = null;
  function Al(e) {
    if (typeof T1 == "function" && A1(e), Jt && typeof Jt.setStrictMode == "function")
      try {
        Jt.setStrictMode(ro, e);
      } catch {
      }
  }
  var Wt = Math.clz32 ? Math.clz32 : M1, z1 = Math.log, O1 = Math.LN2;
  function M1(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (z1(e) / O1 | 0) | 0;
  }
  var xr = 256, Cr = 262144, wr = 4194304;
  function ha(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & -e;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Er(e, t, l) {
    var a = e.pendingLanes;
    if (a === 0) return 0;
    var u = 0, s = e.suspendedLanes, m = e.pingedLanes;
    e = e.warmLanes;
    var w = a & 134217727;
    return w !== 0 ? (a = w & ~s, a !== 0 ? u = ha(a) : (m &= w, m !== 0 ? u = ha(m) : l || (l = w & ~e, l !== 0 && (u = ha(l))))) : (w = a & ~s, w !== 0 ? u = ha(w) : m !== 0 ? u = ha(m) : l || (l = a & ~e, l !== 0 && (u = ha(l)))), u === 0 ? 0 : t !== 0 && t !== u && (t & s) === 0 && (s = u & -u, l = t & -t, s >= l || s === 32 && (l & 4194048) !== 0) ? t : u;
  }
  function uo(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function zm(e, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var l = e.entangledLanes;
    if (l !== 0)
      for (e = e.entanglements, l &= t; 0 < l; ) {
        var a = 31 - Wt(l), u = 1 << a;
        t |= e[a], l &= ~u;
      }
    return t;
  }
  function N1(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Om() {
    var e = wr;
    return wr <<= 1, (wr & 62914560) === 0 && (wr = 4194304), e;
  }
  function Xs(e) {
    for (var t = [], l = 0; 31 > l; l++) t.push(e);
    return t;
  }
  function so(e, t) {
    e.pendingLanes |= t, t !== 268435456 && (e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0);
  }
  function D1(e, t, l, a, u, s) {
    var m = e.pendingLanes;
    e.pendingLanes = l, e.suspendedLanes = 0, e.pingedLanes = 0, e.warmLanes = 0, e.expiredLanes &= l, e.entangledLanes &= l, e.errorRecoveryDisabledLanes &= l, e.shellSuspendCounter = 0;
    var w = e.entanglements, z = e.expirationTimes, k = e.hiddenUpdates;
    for (l = m & ~l; 0 < l; ) {
      var Y = 31 - Wt(l), ee = 1 << Y;
      w[Y] = 0, z[Y] = -1;
      var L = k[Y];
      if (L !== null)
        for (k[Y] = null, Y = 0; Y < L.length; Y++) {
          var I = L[Y];
          I !== null && (I.lane &= -536870913);
        }
      l &= ~ee;
    }
    a !== 0 && Mm(e, a, 0), s !== 0 && u === 0 && e.tag !== 0 && (e.suspendedLanes |= s & ~(m & ~t));
  }
  function Mm(e, t, l) {
    e.pendingLanes |= t, e.suspendedLanes &= ~t;
    var a = 31 - Wt(t);
    e.entangledLanes |= t, e.entanglements[a] = e.entanglements[a] | 1073741824 | l & 261930;
  }
  function Nm(e, t) {
    var l = e.entangledLanes |= t;
    for (e = e.entanglements; l; ) {
      var a = 31 - Wt(l), u = 1 << a;
      u & t | e[a] & t && (e[a] |= t), l &= ~u;
    }
  }
  function Dm(e, t) {
    var l = t & -t;
    return l = (l & 42) !== 0 ? 1 : Qs(l), (l & (e.suspendedLanes | t)) !== 0 ? 0 : l;
  }
  function Qs(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function Zs(e) {
    return e &= -e, 2 < e ? 8 < e ? (e & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function jm() {
    var e = ce.p;
    return e !== 0 ? e : (e = window.event, e === void 0 ? 32 : By(e.type));
  }
  function Hm(e, t) {
    var l = ce.p;
    try {
      return ce.p = e, t();
    } finally {
      ce.p = l;
    }
  }
  var tl = Math.random().toString(36).slice(2), Et = "__reactFiber$" + tl, qt = "__reactProps$" + tl, Wa = "__reactContainer$" + tl, Lm = "__reactEvents$" + tl, j1 = "__reactListeners$" + tl, H1 = "__reactHandles$" + tl, Um = "__reactResources$" + tl, co = "__reactMarker$" + tl, Rr = "__reactLoad$" + tl;
  function _r(e) {
    delete e[Et], delete e[qt], delete e[j1], delete e[H1];
  }
  function pa(e) {
    var t;
    if (t = e[Et]) return t;
    for (var l = e.parentNode; l; ) {
      if (t = l[Wa] || l[Et]) {
        if (l = t.alternate, t.child !== null || l !== null && l.child !== null)
          for (e = xy(e); e !== null; ) {
            if (l = e[Et]) return l;
            e = xy(e);
          }
        return t;
      }
      e = l, l = e.parentNode;
    }
    return null;
  }
  function ei(e) {
    if (e = e[Et] || e[Wa]) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3)
        return e;
    }
    return null;
  }
  function fo(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(r(33));
  }
  function ti(e) {
    var t = e[Um];
    return t || (t = e[Um] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), t;
  }
  function vt(e) {
    e[co] = !0;
  }
  function Vm(e) {
    e[Rr] = void 0;
  }
  var Gm = /* @__PURE__ */ new Set(), km = {};
  function va(e, t) {
    ni(e, t), ni(e + "Capture", t);
  }
  function ni(e, t) {
    for (km[e] = t, e = 0; e < t.length; e++)
      Gm.add(t[e]);
  }
  var L1 = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), Bm = {}, qm = {};
  function U1(e) {
    return $s.call(qm, e) ? !0 : $s.call(Bm, e) ? !1 : L1.test(e) ? qm[e] = !0 : (Bm[e] = !0, !1);
  }
  var Ge = !1;
  function Pm() {
    var e = Ge;
    return Ge = !1, e;
  }
  function Tr(e, t, l) {
    if (U1(t))
      if (l === null) e.removeAttribute(t);
      else {
        switch (typeof l) {
          case "undefined":
          case "function":
          case "symbol":
            e.removeAttribute(t);
            return;
          case "boolean":
            var a = t.toLowerCase().slice(0, 5);
            if (a !== "data-" && a !== "aria-") {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, l);
      }
  }
  function Ar(e, t, l) {
    if (l === null) e.removeAttribute(t);
    else {
      switch (typeof l) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, l);
    }
  }
  function nl(e, t, l, a) {
    if (a === null) e.removeAttribute(l);
    else {
      switch (typeof a) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          e.removeAttribute(l);
          return;
      }
      e.setAttributeNS(t, l, a);
    }
  }
  function en(e) {
    switch (typeof e) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function Im(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function V1(e, t, l) {
    var a = Object.getOwnPropertyDescriptor(
      e.constructor.prototype,
      t
    );
    if (!e.hasOwnProperty(t) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
      var u = a.get, s = a.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function() {
          return u.call(this);
        },
        set: function(m) {
          l = "" + m, s.call(this, m);
        }
      }), Object.defineProperty(e, t, {
        enumerable: a.enumerable
      }), {
        getValue: function() {
          return l;
        },
        setValue: function(m) {
          l = "" + m;
        },
        stopTracking: function() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }
  function Ks(e) {
    if (!e._valueTracker) {
      var t = Im(e) ? "checked" : "value";
      e._valueTracker = V1(
        e,
        t,
        "" + e[t]
      );
    }
  }
  function $m(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var l = t.getValue(), a = "";
    return e && (a = Im(e) ? e.checked ? "true" : "false" : e.value), e = a, e !== l ? (t.setValue(e), !0) : !1;
  }
  var G1 = /[\n"\\]/g;
  function gn(e) {
    return e.replace(
      G1,
      function(t) {
        return "\\" + t.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Js(e, t, l, a, u, s, m, w) {
    e.name = "", m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" ? e.type = m : e.removeAttribute("type"), t != null ? m === "number" ? (t === 0 && e.value === "" || e.value != t) && (e.value = "" + en(t)) : e.value !== "" + en(t) && (e.value = "" + en(t)) : m !== "submit" && m !== "reset" || e.removeAttribute("value"), t != null ? m === "number" && e.value == t ? Ws(e, en(e.value)) : Ws(e, en(t)) : l != null ? Ws(e, en(l)) : a != null && e.removeAttribute("value"), u == null && s != null && (e.defaultChecked = !!s), u != null && (e.checked = u && typeof u != "function" && typeof u != "symbol"), w != null && typeof w != "function" && typeof w != "symbol" && typeof w != "boolean" ? e.name = "" + en(w) : e.removeAttribute("name");
  }
  function Ym(e, t, l, a, u, s, m, w) {
    if (s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (e.type = s), t != null || l != null) {
      if (!(s !== "submit" && s !== "reset" || t != null)) {
        Ks(e);
        return;
      }
      l = l != null ? "" + en(l) : "", t = t != null ? "" + en(t) : l, w || t === e.value || (e.value = t), e.defaultValue = t;
    }
    a = a ?? u, a = typeof a != "function" && typeof a != "symbol" && !!a, e.checked = w ? e.checked : !!a, e.defaultChecked = !!a, m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" && (e.name = m), Ks(e);
  }
  function Ws(e, t) {
    e.defaultValue !== "" + t && (e.defaultValue = "" + t);
  }
  function li(e, t, l, a) {
    if (e = e.options, t) {
      t = {};
      for (var u = 0; u < l.length; u++)
        t["$" + l[u]] = !0;
      for (l = 0; l < e.length; l++)
        u = t.hasOwnProperty("$" + e[l].value), e[l].selected !== u && (e[l].selected = u), u && a && (e[l].defaultSelected = !0);
    } else {
      for (l = "" + en(l), t = null, u = 0; u < e.length; u++) {
        if (e[u].value === l) {
          e[u].selected = !0, a && (e[u].defaultSelected = !0);
          return;
        }
        t !== null || e[u].disabled || (t = e[u]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Fm(e, t, l) {
    if (t != null && (t = "" + en(t), t !== e.value && (e.value = t), l == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = l != null ? "" + en(l) : "";
  }
  function Xm(e, t, l, a) {
    if (t == null) {
      if (a != null) {
        if (l != null) throw Error(r(92));
        if (ue(a)) {
          if (1 < a.length) throw Error(r(93));
          a = a[0];
        }
        l = a;
      }
      l == null && (l = ""), t = l;
    }
    l = en(t), e.defaultValue = l, a = e.textContent, a === l && a !== "" && a !== null && (e.value = a), Ks(e);
  }
  function ai(e, t) {
    if (t) {
      var l = e.firstChild;
      if (l && l === e.lastChild && l.nodeType === 3) {
        l.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var k1 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function Qm(e, t, l) {
    var a = t.indexOf("--") === 0;
    l == null || typeof l == "boolean" || l === "" ? a ? e.setProperty(t, "") : t === "float" ? e.cssFloat = "" : e[t] = "" : a ? e.setProperty(t, l) : typeof l != "number" || l === 0 || k1.has(t) ? t === "float" ? e.cssFloat = l : e[t] = ("" + l).trim() : e[t] = l + "px";
  }
  function Zm(e, t, l) {
    if (t != null && typeof t != "object")
      throw Error(r(62));
    if (e = e.style, l != null) {
      for (var a in l)
        !l.hasOwnProperty(a) || t != null && t.hasOwnProperty(a) || (a.indexOf("--") === 0 ? e.setProperty(a, "") : a === "float" ? e.cssFloat = "" : e[a] = "", Ge = !0);
      for (var u in t)
        a = t[u], t.hasOwnProperty(u) && l[u] !== a && (Qm(e, u, a), Ge = !0);
    } else
      for (var s in t)
        t.hasOwnProperty(s) && Qm(e, s, t[s]);
  }
  function ec(e) {
    if (e.indexOf("-") === -1) return !1;
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var B1 = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), q1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function zr(e) {
    return q1.test("" + e) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : e;
  }
  function Un() {
  }
  var tc = null;
  function nc(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ii = null, oi = null;
  function Km(e) {
    var t = ei(e);
    if (t && (e = t.stateNode)) {
      var l = e[qt] || null;
      e: switch (e = t.stateNode, t.type) {
        case "input":
          if (Js(
            e,
            l.value,
            l.defaultValue,
            l.defaultValue,
            l.checked,
            l.defaultChecked,
            l.type,
            l.name
          ), t = l.name, l.type === "radio" && t != null) {
            for (l = e; l.parentNode; ) l = l.parentNode;
            for (l = l.querySelectorAll(
              'input[name="' + gn(
                "" + t
              ) + '"][type="radio"]'
            ), t = 0; t < l.length; t++) {
              var a = l[t];
              if (a !== e && a.form === e.form) {
                var u = a[qt] || null;
                if (!u) throw Error(r(90));
                Js(
                  a,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name
                );
              }
            }
            for (t = 0; t < l.length; t++)
              a = l[t], a.form === e.form && $m(a);
          }
          break e;
        case "textarea":
          Fm(e, l.value, l.defaultValue);
          break e;
        case "select":
          t = l.value, t != null && li(e, !!l.multiple, t, !1);
      }
    }
  }
  var lc = !1;
  function Jm(e, t, l) {
    if (lc) return e(t, l);
    lc = !0;
    try {
      var a = e(t);
      return a;
    } finally {
      if (lc = !1, (ii !== null || oi !== null) && (zu(), ii && (t = ii, e = oi, oi = ii = null, Km(t), e)))
        for (t = 0; t < e.length; t++) Km(e[t]);
    }
  }
  function go(e, t) {
    var l = e.stateNode;
    if (l === null) return null;
    var a = l[qt] || null;
    if (a === null) return null;
    l = a[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (a = !a.disabled) || (e = e.type, a = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !a;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (l && typeof l != "function")
      throw Error(
        r(231, t, typeof l)
      );
    return l;
  }
  var ll = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), ac = !1;
  if (ll)
    try {
      var mo = {};
      Object.defineProperty(mo, "passive", {
        get: function() {
          ac = !0;
        }
      }), window.addEventListener("test", mo, mo), window.removeEventListener("test", mo, mo);
    } catch {
      ac = !1;
    }
  var zl = null, ic = null, Or = null;
  function Wm() {
    if (Or) return Or;
    var e, t = ic, l = t.length, a, u = "value" in zl ? zl.value : zl.textContent, s = u.length;
    for (e = 0; e < l && t[e] === u[e]; e++) ;
    var m = l - e;
    for (a = 1; a <= m && t[l - a] === u[s - a]; a++) ;
    return Or = u.slice(e, 1 < a ? 1 - a : void 0);
  }
  function Mr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Nr() {
    return !0;
  }
  function eh() {
    return !1;
  }
  function Lt(e) {
    function t(l, a, u, s, m) {
      this._reactName = l, this._targetInst = u, this.type = a, this.nativeEvent = s, this.target = m, this.currentTarget = null;
      for (var w in e)
        e.hasOwnProperty(w) && (l = e[w], this[w] = l ? l(s) : s[w]);
      return this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? Nr : eh, this.isPropagationStopped = eh, this;
    }
    return H(t.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var l = this.nativeEvent;
        l && (l.preventDefault ? l.preventDefault() : typeof l.returnValue != "unknown" && (l.returnValue = !1), this.isDefaultPrevented = Nr);
      },
      stopPropagation: function() {
        var l = this.nativeEvent;
        l && (l.stopPropagation ? l.stopPropagation() : typeof l.cancelBubble != "unknown" && (l.cancelBubble = !0), this.isPropagationStopped = Nr);
      },
      persist: function() {
      },
      isPersistent: Nr
    }), t;
  }
  var Ol = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Dr = Lt(Ol), ho = H({}, Ol, { view: 0, detail: 0 }), P1 = Lt(ho), oc, rc, po, jr = H({}, ho, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: sc,
    button: 0,
    buttons: 0,
    relatedTarget: function(e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function(e) {
      return "movementX" in e ? e.movementX : (e !== po && (po && e.type === "mousemove" ? (oc = e.screenX - po.screenX, rc = e.screenY - po.screenY) : rc = oc = 0, po = e), oc);
    },
    movementY: function(e) {
      return "movementY" in e ? e.movementY : rc;
    }
  }), th = Lt(jr), I1 = H({}, jr, { dataTransfer: 0 }), $1 = Lt(I1), Y1 = H({}, ho, { relatedTarget: 0 }), uc = Lt(Y1), F1 = H({}, Ol, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), X1 = Lt(F1), Q1 = H({}, Ol, {
    clipboardData: function(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), Z1 = Lt(Q1), K1 = H({}, Ol, { data: 0 }), nh = Lt(K1), J1 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, W1 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, eC = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function tC(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = eC[e]) ? !!t[e] : !1;
  }
  function sc() {
    return tC;
  }
  var nC = H({}, ho, {
    key: function(e) {
      if (e.key) {
        var t = J1[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress" ? (e = Mr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? W1[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: sc,
    charCode: function(e) {
      return e.type === "keypress" ? Mr(e) : 0;
    },
    keyCode: function(e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function(e) {
      return e.type === "keypress" ? Mr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), lC = Lt(nC), aC = H({}, jr, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), lh = Lt(aC), iC = H({}, Ol, { submitter: 0 }), oC = Lt(iC), rC = H({}, ho, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: sc
  }), uC = Lt(rC), sC = H({}, Ol, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), cC = Lt(sC), fC = H({}, jr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), dC = Lt(fC), gC = H({}, Ol, {
    newState: 0,
    oldState: 0,
    source: 0
  }), mC = Lt(gC), hC = [9, 13, 27, 32], cc = ll && "CompositionEvent" in window, vo = null;
  ll && "documentMode" in document && (vo = document.documentMode);
  var pC = ll && "TextEvent" in window && !vo, ah = ll && (!cc || vo && 8 < vo && 11 >= vo), ih = " ", oh = !1;
  function rh(e, t) {
    switch (e) {
      case "keyup":
        return hC.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function uh(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var ri = !1;
  function vC(e, t) {
    switch (e) {
      case "compositionend":
        return uh(t);
      case "keypress":
        return t.which !== 32 ? null : (oh = !0, ih);
      case "textInput":
        return e = t.data, e === ih && oh ? null : e;
      default:
        return null;
    }
  }
  function yC(e, t) {
    if (ri)
      return e === "compositionend" || !cc && rh(e, t) ? (e = Wm(), Or = ic = zl = null, ri = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length)
            return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return ah && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var bC = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function sh(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!bC[e.type] : t === "textarea";
  }
  function ch(e, t, l, a) {
    ii ? oi ? oi.push(a) : oi = [a] : ii = a, t = Hu(t, "onChange"), 0 < t.length && (l = new Dr(
      "onChange",
      "change",
      null,
      l,
      a
    ), e.push({ event: l, listeners: t }));
  }
  var yo = null, bo = null;
  function SC(e) {
    Kv(e, 0);
  }
  function Hr(e) {
    var t = fo(e);
    if ($m(t)) return e;
  }
  function fh(e, t) {
    if (e === "change") return t;
  }
  var dh = !1;
  if (ll) {
    var fc;
    if (ll) {
      var dc = "oninput" in document;
      if (!dc) {
        var gh = document.createElement("div");
        gh.setAttribute("oninput", "return;"), dc = typeof gh.oninput == "function";
      }
      fc = dc;
    } else fc = !1;
    dh = fc && (!document.documentMode || 9 < document.documentMode);
  }
  function mh() {
    yo && (yo.detachEvent("onpropertychange", hh), bo = yo = null);
  }
  function hh(e) {
    if (e.propertyName === "value" && Hr(bo)) {
      var t = [];
      ch(
        t,
        bo,
        e,
        nc(e)
      ), Jm(SC, t);
    }
  }
  function xC(e, t, l) {
    e === "focusin" ? (mh(), yo = t, bo = l, yo.attachEvent("onpropertychange", hh)) : e === "focusout" && mh();
  }
  function CC(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown")
      return Hr(bo);
  }
  function wC(e, t) {
    if (e === "click") return Hr(t);
  }
  function EC(e, t) {
    if (e === "input" || e === "change")
      return Hr(t);
  }
  function RC(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var tn = typeof Object.is == "function" ? Object.is : RC;
  function So(e, t) {
    if (tn(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null)
      return !1;
    var l = Object.keys(e), a = Object.keys(t);
    if (l.length !== a.length) return !1;
    for (a = 0; a < l.length; a++) {
      var u = l[a];
      if (!$s.call(t, u) || !tn(e[u], t[u]))
        return !1;
    }
    return !0;
  }
  function gc(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function ph(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function vh(e, t) {
    var l = ph(e);
    e = 0;
    for (var a; l; ) {
      if (l.nodeType === 3) {
        if (a = e + l.textContent.length, e <= t && a >= t)
          return { node: l, offset: t - e };
        e = a;
      }
      e: {
        for (; l; ) {
          if (l.nextSibling) {
            l = l.nextSibling;
            break e;
          }
          l = l.parentNode;
        }
        l = void 0;
      }
      l = ph(l);
    }
  }
  function yh(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? yh(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function bh(e) {
    e = e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null ? e.ownerDocument.defaultView : window;
    for (var t = gc(e.document); t instanceof e.HTMLIFrameElement; ) {
      try {
        var l = typeof t.contentWindow.location.href == "string";
      } catch {
        l = !1;
      }
      if (l) e = t.contentWindow;
      else break;
      t = gc(e.document);
    }
    return t;
  }
  function mc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  var _C = ll && "documentMode" in document && 11 >= document.documentMode, ui = null, hc = null, xo = null, pc = !1;
  function Sh(e, t, l) {
    var a = l.window === l ? l.document : l.nodeType === 9 ? l : l.ownerDocument;
    pc || ui == null || ui !== gc(a) || (a = ui, "selectionStart" in a && mc(a) ? a = { start: a.selectionStart, end: a.selectionEnd } : (a = (a.ownerDocument && a.ownerDocument.defaultView || window).getSelection(), a = {
      anchorNode: a.anchorNode,
      anchorOffset: a.anchorOffset,
      focusNode: a.focusNode,
      focusOffset: a.focusOffset
    }), xo && So(xo, a) || (xo = a, a = Hu(hc, "onSelect"), 0 < a.length && (t = new Dr(
      "onSelect",
      "select",
      null,
      t,
      l
    ), e.push({ event: t, listeners: a }), t.target = ui)));
  }
  function ya(e, t) {
    var l = {};
    return l[e.toLowerCase()] = t.toLowerCase(), l["Webkit" + e] = "webkit" + t, l["Moz" + e] = "moz" + t, l;
  }
  var si = {
    animationend: ya("Animation", "AnimationEnd"),
    animationiteration: ya("Animation", "AnimationIteration"),
    animationstart: ya("Animation", "AnimationStart"),
    transitionrun: ya("Transition", "TransitionRun"),
    transitionstart: ya("Transition", "TransitionStart"),
    transitioncancel: ya("Transition", "TransitionCancel"),
    transitionend: ya("Transition", "TransitionEnd")
  }, vc = {}, xh = {};
  ll && (xh = document.createElement("div").style, "AnimationEvent" in window || (delete si.animationend.animation, delete si.animationiteration.animation, delete si.animationstart.animation), "TransitionEvent" in window || delete si.transitionend.transition);
  function ba(e) {
    if (vc[e]) return vc[e];
    if (!si[e]) return e;
    var t = si[e], l;
    for (l in t)
      if (t.hasOwnProperty(l) && l in xh)
        return vc[e] = t[l];
    return e;
  }
  var Ch = ba("animationend"), wh = ba("animationiteration"), Eh = ba("animationstart"), TC = ba("transitionrun"), AC = ba("transitionstart"), zC = ba("transitioncancel"), Rh = ba("transitionend"), _h = /* @__PURE__ */ new Map(), yc = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  yc.push("scrollEnd");
  function _n(e, t) {
    _h.set(e, t), va(t, [e]);
  }
  var OC = 0;
  function al(e, t) {
    if (e.name != null && e.name !== "auto") return e.name;
    if (t.autoName !== null) return t.autoName;
    e = On.identifierPrefix;
    var l = OC++;
    return e = "_" + e + "t_" + l.toString(32) + "_", t.autoName = e;
  }
  function Th(e) {
    if (e == null || typeof e == "string")
      return e;
    var t = null, l = zi;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var u = e[l[a]];
        if (u != null) {
          if (u === "none") return "none";
          t = t == null ? u : t + (" " + u);
        }
      }
    return t ?? e.default;
  }
  function il(e, t) {
    return e = Th(e), t = Th(t), t == null ? e === "auto" ? null : e : t === "auto" ? null : t;
  }
  var Lr = typeof reportError == "function" ? reportError : function(e) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var t = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof e == "object" && e !== null && typeof e.message == "string" ? String(e.message) : String(e),
        error: e
      });
      if (!window.dispatchEvent(t)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", e);
      return;
    }
    console.error(e);
  }, mn = [], ci = 0, bc = 0;
  function Ur() {
    for (var e = ci, t = bc = ci = 0; t < e; ) {
      var l = mn[t];
      mn[t++] = null;
      var a = mn[t];
      mn[t++] = null;
      var u = mn[t];
      mn[t++] = null;
      var s = mn[t];
      if (mn[t++] = null, a !== null && u !== null) {
        var m = a.pending;
        m === null ? u.next = u : (u.next = m.next, m.next = u), a.pending = u;
      }
      s !== 0 && Ah(l, u, s);
    }
  }
  function Vr(e, t, l, a) {
    mn[ci++] = e, mn[ci++] = t, mn[ci++] = l, mn[ci++] = a, bc |= a, e.lanes |= a, e = e.alternate, e !== null && (e.lanes |= a);
  }
  function Sc(e, t, l, a) {
    return Vr(e, t, l, a), Gr(e);
  }
  function Sa(e, t) {
    return Vr(e, null, null, t), Gr(e);
  }
  function Ah(e, t, l) {
    e.lanes |= l;
    var a = e.alternate;
    a !== null && (a.lanes |= l);
    for (var u = !1, s = e.return; s !== null; )
      s.childLanes |= l, a = s.alternate, a !== null && (a.childLanes |= l), s.tag === 22 && (e = s.stateNode, e === null || e._visibility & 1 || (u = !0)), e = s, s = s.return;
    return e.tag === 3 ? (s = e.stateNode, u && t !== null && (u = 31 - Wt(l), e = s.hiddenUpdates, a = e[u], a === null ? e[u] = [t] : a.push(t), t.lane = l | 536870912), s) : null;
  }
  function Gr(e) {
    if (50 < Po)
      throw Po = 0, Au = null, Error(r(185));
    for (var t = e.return; t !== null; )
      e = t, t = e.return;
    return e.tag === 3 ? e.stateNode : null;
  }
  var fi = {};
  function MC(e, t, l, a) {
    this.tag = e, this.key = l, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = a, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Pt(e, t, l, a) {
    return new MC(e, t, l, a);
  }
  function xc(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function ol(e, t) {
    var l = e.alternate;
    return l === null ? (l = Pt(
      e.tag,
      t,
      e.key,
      e.mode
    ), l.elementType = e.elementType, l.type = e.type, l.stateNode = e.stateNode, l.alternate = e, e.alternate = l) : (l.pendingProps = t, l.type = e.type, l.flags = 0, l.subtreeFlags = 0, l.deletions = null), l.flags = e.flags & 1206910976, l.childLanes = e.childLanes, l.lanes = e.lanes, l.child = e.child, l.memoizedProps = e.memoizedProps, l.memoizedState = e.memoizedState, l.updateQueue = e.updateQueue, t = e.dependencies, l.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, l.sibling = e.sibling, l.index = e.index, l.ref = e.ref, l.refCleanup = e.refCleanup, l;
  }
  function zh(e, t) {
    e.flags &= 1206910978;
    var l = e.alternate;
    return l === null ? (e.childLanes = 0, e.lanes = t, e.child = null, e.subtreeFlags = 0, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null) : (e.childLanes = l.childLanes, e.lanes = l.lanes, e.child = l.child, e.subtreeFlags = 0, e.deletions = null, e.memoizedProps = l.memoizedProps, e.memoizedState = l.memoizedState, e.updateQueue = l.updateQueue, e.type = l.type, t = l.dependencies, e.dependencies = t === null ? null : {
      lanes: t.lanes,
      firstContext: t.firstContext
    }), e;
  }
  function kr(e, t, l, a, u, s) {
    var m = 0;
    if (a = e, typeof a == "function") xc(a) && (m = 1);
    else if (typeof a == "string")
      m = iE(
        e,
        l,
        Mt.current
      ) ? 26 : e === "html" || e === "head" || e === "body" ? 27 : 5;
    else
      e: switch (a) {
        case ze:
          return e = Pt(31, l, t, u), e.elementType = ze, e.lanes = s, e;
        case se:
          return xa(l.children, u, s, t);
        case oe:
          m = 8, u |= 24;
          break;
        case he:
          return e = Pt(12, l, t, u | 2), e.elementType = he, e.lanes = s, e;
        case le:
          return e = Pt(13, l, t, u), e.elementType = le, e.lanes = s, e;
        case ie:
          return e = Pt(19, l, t, u), e.elementType = ie, e.lanes = s, e;
        case W:
        case E:
          return e = u | 32, e = Pt(30, l, t, e), e.elementType = E, e.lanes = s, e.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, e;
        default:
          if (typeof a == "object" && a !== null)
            switch (a.$$typeof) {
              case de:
                m = 10;
                break e;
              case ge:
                m = 9;
                break e;
              case Z:
                m = 11;
                break e;
              case me:
                m = 14;
                break e;
              case ne:
                m = 16, a = null;
                break e;
            }
          m = 29, l = Error(
            r(130, e === null ? "null" : typeof e, "")
          ), a = null;
      }
    return t = Pt(m, l, t, u), t.elementType = e, t.type = a, t.lanes = s, t;
  }
  function xa(e, t, l, a) {
    return e = Pt(7, e, a, t), e.lanes = l, e;
  }
  function Cc(e, t, l) {
    return e = Pt(6, e, null, t), e.lanes = l, e;
  }
  function Oh(e) {
    var t = Pt(18, null, null, 0);
    return t.stateNode = e, t;
  }
  function wc(e, t, l) {
    return t = Pt(
      4,
      e.children !== null ? e.children : [],
      e.key,
      t
    ), t.lanes = l, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }
  var Mh = /* @__PURE__ */ new WeakMap();
  function hn(e, t) {
    if (typeof e == "object" && e !== null) {
      var l = Mh.get(e);
      return l !== void 0 ? l : (t = {
        value: e,
        source: t,
        stack: Rm(t)
      }, Mh.set(e, t), t);
    }
    return {
      value: e,
      source: t,
      stack: Rm(t)
    };
  }
  var di = [], gi = 0, Br = null, Co = 0, pn = [], vn = 0, Ml = null, Vn = 1, Gn = "";
  function rl(e, t) {
    di[gi++] = Co, di[gi++] = Br, Br = e, Co = t;
  }
  function Nh(e, t, l) {
    pn[vn++] = Vn, pn[vn++] = Gn, pn[vn++] = Ml, Ml = e;
    var a = Vn;
    e = Gn;
    var u = 32 - Wt(a) - 1;
    a &= ~(1 << u), l += 1;
    var s = 32 - Wt(t) + u;
    if (30 < s) {
      var m = u - u % 5;
      s = (a & (1 << m) - 1).toString(32), a >>= m, u -= m, Vn = 1 << 32 - Wt(t) + u | l << u | a, Gn = s + e;
    } else
      Vn = 1 << s | l << u | a, Gn = e;
  }
  function qr(e) {
    e.return !== null && (rl(e, 1), Nh(e, 1, 0));
  }
  function Ec(e) {
    for (; e === Br; )
      Br = di[--gi], di[gi] = null, Co = di[--gi], di[gi] = null;
    for (; e === Ml; )
      Ml = pn[--vn], pn[vn] = null, Gn = pn[--vn], pn[vn] = null, Vn = pn[--vn], pn[vn] = null;
  }
  function Dh(e, t) {
    pn[vn++] = Vn, pn[vn++] = Gn, pn[vn++] = Ml, Vn = t.id, Gn = t.overflow, Ml = e;
  }
  var yt = null, Ze = null, Ne = !1, Nl = null, yn = !1, Rc = Error(r(519));
  function Dl(e) {
    var t = Error(
      r(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw wo(hn(t, e)), Rc;
  }
  function jh(e) {
    var t = e.stateNode, l = e.type, a = e.memoizedProps;
    switch (t[Et] = e, t[qt] = a, l) {
      case "dialog":
        He("cancel", t), He("close", t);
        break;
      case "iframe":
      case "object":
      case "embed":
        He("load", t);
        break;
      case "video":
      case "audio":
        for (l = 0; l < $o.length; l++)
          He($o[l], t);
        break;
      case "source":
        He("error", t);
        break;
      case "img":
      case "image":
      case "link":
        He("error", t), He("load", t);
        break;
      case "details":
        He("toggle", t);
        break;
      case "input":
        He("invalid", t), Ym(
          t,
          a.value,
          a.defaultValue,
          a.checked,
          a.defaultChecked,
          a.type,
          a.name,
          !0
        );
        break;
      case "select":
        He("invalid", t);
        break;
      case "textarea":
        He("invalid", t), Xm(t, a.value, a.defaultValue, a.children);
    }
    l = a.children, typeof l != "string" && typeof l != "number" && typeof l != "bigint" || t.textContent === "" + l || a.suppressHydrationWarning === !0 || ty(t.textContent, l) ? (a.popover != null && (He("beforetoggle", t), He("toggle", t)), a.onScroll != null && He("scroll", t), a.onScrollEnd != null && He("scrollend", t), a.onClick != null && (t.onclick = Un), t = !0) : t = !1, t || Dl(e, !0);
  }
  function Pr(e) {
    for (yt = e.return; yt; )
      switch (yt.tag) {
        case 5:
        case 31:
        case 13:
          yn = !1;
          return;
        case 27:
        case 3:
          yn = !0;
          return;
        default:
          yt = yt.return;
      }
  }
  function mi(e) {
    if (e !== yt) return !1;
    if (!Ne) return Pr(e), Ne = !0, !1;
    var t = e.tag, l;
    if ((l = t !== 3 && t !== 27) && ((l = t === 5) && (l = e.type, l = !(l !== "form" && l !== "button") || nd(e.type, e.memoizedProps)), l = !l), l && Ze && Dl(e), Pr(e), t === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      Ze = Sy(e);
    } else if (t === 31) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(317));
      Ze = Sy(e);
    } else
      t === 27 ? (t = Ze, Ql(e.type) ? (e = fd, fd = null, Ze = e) : Ze = t) : Ze = yt ? Sn(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ca() {
    Ze = yt = null, Ne = !1;
  }
  function _c() {
    var e = Nl;
    return e !== null && (Yt === null ? Yt = e : Yt.push.apply(
      Yt,
      e
    ), Nl = null), e;
  }
  function wo(e) {
    Nl === null ? Nl = [e] : Nl.push(e);
  }
  var Tc = ut(null), wa = null, ul = null;
  function jl(e, t, l) {
    Re(Tc, t._currentValue), t._currentValue = l;
  }
  function sl(e) {
    e._currentValue = Tc.current, Je(Tc);
  }
  function Ir(e, t, l) {
    for (; e !== null; ) {
      var a = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, a !== null && (a.childLanes |= t)) : a !== null && (a.childLanes & t) !== t && (a.childLanes |= t), e === l) break;
      e = e.return;
    }
  }
  function Ac(e, t, l, a) {
    var u = e.child;
    for (u !== null && (u.return = e); u !== null; ) {
      var s = u.dependencies;
      if (s !== null) {
        var m = u.child;
        s = s.firstContext;
        e: for (; s !== null; ) {
          var w = s;
          s = u;
          for (var z = 0; z < t.length; z++)
            if (w.context === t[z]) {
              s.lanes |= l, w = s.alternate, w !== null && (w.lanes |= l), Ir(
                s.return,
                l,
                e
              ), a || (m = null);
              break e;
            }
          s = w.next;
        }
      } else if (u.tag === 18) {
        if (m = u.return, m === null) throw Error(r(341));
        m.lanes |= l, s = m.alternate, s !== null && (s.lanes |= l), Ir(m, l, e), m = null;
      } else
        u.tag === 13 && u.memoizedState !== null && u.memoizedState.dehydrated === null ? (u.lanes |= l, m = u.alternate, m !== null && (m.lanes |= l), Ir(
          u.return,
          l,
          e
        ), m = u.child, m = m !== null ? m.sibling : null) : m = u.child;
      if (m !== null) m.return = u;
      else
        for (m = u; m !== null; ) {
          if (m === e) {
            m = null;
            break;
          }
          if (u = m.sibling, u !== null) {
            u.return = m.return, m = u;
            break;
          }
          m = m.return;
        }
      u = m;
    }
  }
  function Ea(e, t, l, a) {
    e = null;
    for (var u = t, s = !1; u !== null; ) {
      if (!s) {
        if ((u.flags & 524288) !== 0) s = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var m = u.alternate;
        if (m === null) throw Error(r(387));
        if (m = m.memoizedProps, m !== null) {
          var w = u.type;
          tn(u.pendingProps.value, m.value) || (e !== null ? e.push(w) : e = [w]);
        }
      } else if (u === Me.current) {
        if (m = u.alternate, m === null) throw Error(r(387));
        m.memoizedState.memoizedState !== u.memoizedState.memoizedState && (e !== null ? e.push(Gi) : e = [Gi]);
      }
      u = u.return;
    }
    return e !== null && Ac(
      t,
      e,
      l,
      a
    ), t.flags |= 262144, e !== null;
  }
  function $r(e) {
    for (e = e.firstContext; e !== null; ) {
      if (!tn(
        e.context._currentValue,
        e.memoizedValue
      ))
        return !0;
      e = e.next;
    }
    return !1;
  }
  function Ra(e) {
    wa = e, ul = null, e = e.dependencies, e !== null && (e.firstContext = null);
  }
  function Rt(e) {
    return Hh(wa, e);
  }
  function Yr(e, t) {
    return wa === null && Ra(e), Hh(e, t);
  }
  function Hh(e, t) {
    var l = t._currentValue;
    if (t = { context: t, memoizedValue: l, next: null }, ul === null) {
      if (e === null) throw Error(r(308));
      ul = t, e.dependencies = { lanes: 0, firstContext: t }, e.flags |= 524288;
    } else ul = ul.next = t;
    return l;
  }
  var NC = typeof AbortController < "u" ? AbortController : function() {
    var e = [], t = this.signal = {
      aborted: !1,
      addEventListener: function(l, a) {
        e.push(a);
      }
    };
    this.abort = function() {
      t.aborted = !0, e.forEach(function(l) {
        return l();
      });
    };
  }, DC = n.unstable_scheduleCallback, jC = n.unstable_NormalPriority, st = {
    $$typeof: de,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function zc() {
    return {
      controller: new NC(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Eo(e) {
    e.refCount--, e.refCount === 0 && DC(jC, function() {
      e.controller.abort();
    });
  }
  function Lh(e, t) {
    if ((e.pendingLanes & 4194048) !== 0) {
      var l = e.transitionTypes;
      for (l === null && (l = e.transitionTypes = []), e = 0; e < t.length; e++) {
        var a = t[e];
        l.indexOf(a) === -1 && l.push(a);
      }
    }
  }
  var Ro = null;
  function HC(e) {
    var t = e.transitionTypes;
    return e.transitionTypes = null, t;
  }
  var _o = null, Oc = 0, _a = 0, hi = null;
  function LC(e, t) {
    if (_o === null) {
      var l = _o = [];
      Oc = 0, _a = Ff(), hi = {
        status: "pending",
        value: void 0,
        then: function(a) {
          l.push(a);
        }
      };
    }
    return Oc++, t.then(Uh, Uh), t;
  }
  function Uh() {
    if (--Oc === 0 && (Ro = null, _o !== null)) {
      hi !== null && (hi.status = "fulfilled");
      var e = _o;
      _o = null, _a = 0, hi = null;
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function UC(e, t) {
    var l = [], a = {
      status: "pending",
      value: null,
      reason: null,
      then: function(u) {
        l.push(u);
      }
    };
    return e.then(
      function() {
        a.status = "fulfilled", a.value = t;
        for (var u = 0; u < l.length; u++) (0, l[u])(t);
      },
      function(u) {
        for (a.status = "rejected", a.reason = u, u = 0; u < l.length; u++)
          (0, l[u])(void 0);
      }
    ), a;
  }
  var Vh = re.S;
  re.S = function(e, t) {
    if (Ov = Kt(), typeof t == "object" && t !== null && typeof t.then == "function" && LC(e, t), Ro !== null)
      for (var l = Di; l !== null; )
        Lh(l, Ro), l = l.next;
    if (l = e.types, l !== null) {
      for (var a = Di; a !== null; )
        Lh(a, l), a = a.next;
      if (_a !== 0) {
        a = Ro, a === null && (a = Ro = []);
        for (var u = 0; u < l.length; u++) {
          var s = l[u];
          a.indexOf(s) === -1 && a.push(s);
        }
      }
    }
    Vh !== null && Vh(e, t);
  };
  var Ta = ut(null);
  function Mc() {
    var e = Ta.current;
    return e !== null ? e : Xe.pooledCache;
  }
  function Fr(e, t) {
    t === null ? Re(Ta, Ta.current) : Re(Ta, t.pool);
  }
  function Gh() {
    var e = Mc();
    return e === null ? null : { parent: st._currentValue, pool: e };
  }
  var pi = Error(r(460)), Nc = Error(r(474)), Xr = Error(r(542)), Qr = { then: function() {
  } };
  function kh(e) {
    return e = e.status, e === "fulfilled" || e === "rejected";
  }
  function Bh(e, t, l) {
    switch (l = e[l], l === void 0 ? e.push(t) : l !== t && (t.then(Un, Un), t = l), t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw e = t.reason, Ph(e), e === void 0 && !("reason" in t) ? Error(r(600)) : e;
      default:
        if (typeof t.status == "string") t.then(Un, Un);
        else {
          if (e = Xe, e !== null && 100 < e.shellSuspendCounter)
            throw Error(r(482));
          e = t, e.status = "pending", e.then(
            function(a) {
              if (t.status === "pending") {
                var u = t;
                u.status = "fulfilled", u.value = a;
              }
            },
            function(a) {
              if (t.status === "pending") {
                var u = t;
                u.status = "rejected", u.reason = a;
              }
            }
          );
        }
        switch (t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw e = t.reason, Ph(e), e;
        }
        throw za = t, pi;
    }
  }
  function Aa(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (l) {
      throw l !== null && typeof l == "object" && typeof l.then == "function" ? (za = l, pi) : l;
    }
  }
  var za = null;
  function qh() {
    if (za === null) throw Error(r(459));
    var e = za;
    return za = null, e;
  }
  function Ph(e) {
    if (e === pi || e === Xr)
      throw Error(r(483));
  }
  var vi = null, To = 0;
  function Zr(e) {
    var t = To;
    return To += 1, vi === null && (vi = []), Bh(vi, e, t);
  }
  function Hl(e, t) {
    t = t.props.ref, e.ref = t !== void 0 ? t : null;
  }
  function Kr(e, t) {
    throw t.$$typeof === $ ? Error(r(525)) : (e = Object.prototype.toString.call(t), Error(
      r(
        31,
        e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e
      )
    ));
  }
  function Ih(e) {
    function t(G, N) {
      if (e) {
        var q = G.deletions;
        q === null ? (G.deletions = [N], G.flags |= 16) : q.push(N);
      }
    }
    function l(G, N) {
      if (!e) return null;
      for (; N !== null; )
        t(G, N), N = N.sibling;
      return null;
    }
    function a(G) {
      for (var N = /* @__PURE__ */ new Map(); G !== null; )
        G.key === null ? N.set(G.index, G) : N.set(G.key, G), G = G.sibling;
      return N;
    }
    function u(G, N) {
      return G = ol(G, N), G.index = 0, G.sibling = null, G;
    }
    function s(G, N, q) {
      return G.index = q, e ? (q = G.alternate, q !== null ? (q = q.index, q < N ? (G.flags |= 2, N) : q) : (G.flags |= 134217730, N)) : (G.flags |= 1048576, N);
    }
    function m(G) {
      return e && G.alternate === null && (G.flags |= 134217730), G;
    }
    function w(G, N, q, J) {
      return N === null || N.tag !== 6 ? (N = Cc(q, G.mode, J), N.return = G, N) : (N = u(N, q), N.return = G, N);
    }
    function z(G, N, q, J) {
      var pe = q.type;
      return pe === se ? (G = Y(
        G,
        N,
        q.props.children,
        J,
        q.key
      ), Hl(G, q), G) : N !== null && (N.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === ne && Aa(pe) === N.type) ? (N = u(N, q.props), Hl(N, q), N.return = G, N) : (N = kr(
        q.type,
        q.key,
        q.props,
        null,
        G.mode,
        J
      ), Hl(N, q), N.return = G, N);
    }
    function k(G, N, q, J) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== q.containerInfo || N.stateNode.implementation !== q.implementation ? (N = wc(q, G.mode, J), N.return = G, N) : (N = u(N, q.children || []), N.return = G, N);
    }
    function Y(G, N, q, J, pe) {
      return N === null || N.tag !== 7 ? (N = xa(
        q,
        G.mode,
        J,
        pe
      ), N.return = G, N) : (N = u(N, q), N.return = G, N);
    }
    function ee(G, N, q) {
      if (typeof N == "string" && N !== "" || typeof N == "number" || typeof N == "bigint")
        return N = Cc(
          "" + N,
          G.mode,
          q
        ), N.return = G, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case ae:
            return q = kr(
              N.type,
              N.key,
              N.props,
              null,
              G.mode,
              q
            ), Hl(q, N), q.return = G, q;
          case K:
            return N = wc(
              N,
              G.mode,
              q
            ), N.return = G, N;
          case ne:
            return N = Aa(N), ee(G, N, q);
        }
        if (ue(N) || V(N))
          return N = xa(
            N,
            G.mode,
            q,
            null
          ), N.return = G, N;
        if (typeof N.then == "function")
          return ee(G, Zr(N), q);
        if (N.$$typeof === de)
          return ee(
            G,
            Yr(G, N),
            q
          );
        Kr(G, N);
      }
      return null;
    }
    function L(G, N, q, J) {
      var pe = N !== null ? N.key : null;
      if (typeof q == "string" && q !== "" || typeof q == "number" || typeof q == "bigint")
        return pe !== null ? null : w(G, N, "" + q, J);
      if (typeof q == "object" && q !== null) {
        switch (q.$$typeof) {
          case ae:
            return q.key === pe ? z(G, N, q, J) : null;
          case K:
            return q.key === pe ? k(G, N, q, J) : null;
          case ne:
            return q = Aa(q), L(G, N, q, J);
        }
        if (ue(q) || V(q))
          return pe !== null ? null : Y(G, N, q, J, null);
        if (typeof q.then == "function")
          return L(
            G,
            N,
            Zr(q),
            J
          );
        if (q.$$typeof === de)
          return L(
            G,
            N,
            Yr(G, q),
            J
          );
        Kr(G, q);
      }
      return null;
    }
    function I(G, N, q, J, pe) {
      if (typeof J == "string" && J !== "" || typeof J == "number" || typeof J == "bigint")
        return G = G.get(q) || null, w(N, G, "" + J, pe);
      if (typeof J == "object" && J !== null) {
        switch (J.$$typeof) {
          case ae:
            return G = G.get(
              J.key === null ? q : J.key
            ) || null, z(N, G, J, pe);
          case K:
            return G = G.get(
              J.key === null ? q : J.key
            ) || null, k(N, G, J, pe);
          case ne:
            return J = Aa(J), I(
              G,
              N,
              q,
              J,
              pe
            );
        }
        if (ue(J) || V(J))
          return G = G.get(q) || null, Y(N, G, J, pe, null);
        if (typeof J.then == "function")
          return I(
            G,
            N,
            q,
            Zr(J),
            pe
          );
        if (J.$$typeof === de)
          return I(
            G,
            N,
            q,
            Yr(N, J),
            pe
          );
        Kr(N, J);
      }
      return null;
    }
    function fe(G, N, q, J) {
      for (var pe = null, Ue = null, Se = N, xe = N = 0, dt = null; Se !== null && xe < q.length; xe++) {
        Se.index > xe ? (dt = Se, Se = null) : dt = Se.sibling;
        var Ve = L(
          G,
          Se,
          q[xe],
          J
        );
        if (Ve === null) {
          Se === null && (Se = dt);
          break;
        }
        e && Se && Ve.alternate === null && t(G, Se), N = s(Ve, N, xe), Ue === null ? pe = Ve : Ue.sibling = Ve, Ue = Ve, Se = dt;
      }
      if (xe === q.length)
        return l(G, Se), Ne && rl(G, xe), pe;
      if (Se === null) {
        for (; xe < q.length; xe++)
          Se = ee(G, q[xe], J), Se !== null && (N = s(
            Se,
            N,
            xe
          ), Ue === null ? pe = Se : Ue.sibling = Se, Ue = Se);
        return Ne && rl(G, xe), pe;
      }
      for (Se = a(Se); xe < q.length; xe++)
        dt = I(
          Se,
          G,
          xe,
          q[xe],
          J
        ), dt !== null && (e && (Ve = dt.alternate, Ve !== null && Se.delete(Ve.key === null ? xe : Ve.key)), N = s(
          dt,
          N,
          xe
        ), Ue === null ? pe = dt : Ue.sibling = dt, Ue = dt);
      return e && Se.forEach(function(ea) {
        return t(G, ea);
      }), Ne && rl(G, xe), pe;
    }
    function be(G, N, q, J) {
      if (q == null) throw Error(r(151));
      for (var pe = null, Ue = null, Se = N, xe = N = 0, dt = null, Ve = q.next(); Se !== null && !Ve.done; xe++, Ve = q.next()) {
        Se.index > xe ? (dt = Se, Se = null) : dt = Se.sibling;
        var ea = L(G, Se, Ve.value, J);
        if (ea === null) {
          Se === null && (Se = dt);
          break;
        }
        e && Se && ea.alternate === null && t(G, Se), N = s(ea, N, xe), Ue === null ? pe = ea : Ue.sibling = ea, Ue = ea, Se = dt;
      }
      if (Ve.done)
        return l(G, Se), Ne && rl(G, xe), pe;
      if (Se === null) {
        for (; !Ve.done; xe++, Ve = q.next())
          Ve = ee(G, Ve.value, J), Ve !== null && (N = s(Ve, N, xe), Ue === null ? pe = Ve : Ue.sibling = Ve, Ue = Ve);
        return Ne && rl(G, xe), pe;
      }
      for (Se = a(Se); !Ve.done; xe++, Ve = q.next())
        Ve = I(Se, G, xe, Ve.value, J), Ve !== null && (e && (dt = Ve.alternate, dt !== null && Se.delete(
          dt.key === null ? xe : dt.key
        )), N = s(Ve, N, xe), Ue === null ? pe = Ve : Ue.sibling = Ve, Ue = Ve);
      return e && Se.forEach(function(vE) {
        return t(G, vE);
      }), Ne && rl(G, xe), pe;
    }
    function Ae(G, N, q, J) {
      if (typeof q == "object" && q !== null && q.type === se && q.key === null && q.props.ref === void 0 && (q = q.props.children), typeof q == "object" && q !== null) {
        switch (q.$$typeof) {
          case ae:
            e: {
              for (var pe = q.key; N !== null; ) {
                if (N.key === pe) {
                  if (pe = q.type, pe === se) {
                    if (N.tag === 7) {
                      l(
                        G,
                        N.sibling
                      ), J = u(
                        N,
                        q.props.children
                      ), Hl(J, q), J.return = G, G = J;
                      break e;
                    }
                  } else if (N.elementType === pe || typeof pe == "object" && pe !== null && pe.$$typeof === ne && Aa(pe) === N.type) {
                    l(
                      G,
                      N.sibling
                    ), J = u(N, q.props), Hl(J, q), J.return = G, G = J;
                    break e;
                  }
                  l(G, N);
                  break;
                } else t(G, N);
                N = N.sibling;
              }
              q.type === se ? (J = xa(
                q.props.children,
                G.mode,
                J,
                q.key
              ), Hl(J, q), J.return = G, G = J) : (J = kr(
                q.type,
                q.key,
                q.props,
                null,
                G.mode,
                J
              ), Hl(J, q), J.return = G, G = J);
            }
            return m(G);
          case K:
            e: {
              for (pe = q.key; N !== null; ) {
                if (N.key === pe)
                  if (N.tag === 4 && N.stateNode.containerInfo === q.containerInfo && N.stateNode.implementation === q.implementation) {
                    l(
                      G,
                      N.sibling
                    ), J = u(N, q.children || []), J.return = G, G = J;
                    break e;
                  } else {
                    l(G, N);
                    break;
                  }
                else t(G, N);
                N = N.sibling;
              }
              J = wc(q, G.mode, J), J.return = G, G = J;
            }
            return m(G);
          case ne:
            return q = Aa(q), Ae(
              G,
              N,
              q,
              J
            );
        }
        if (ue(q))
          return fe(
            G,
            N,
            q,
            J
          );
        if (V(q)) {
          if (pe = V(q), typeof pe != "function") throw Error(r(150));
          return q = pe.call(q), be(
            G,
            N,
            q,
            J
          );
        }
        if (typeof q.then == "function")
          return Ae(
            G,
            N,
            Zr(q),
            J
          );
        if (q.$$typeof === de)
          return Ae(
            G,
            N,
            Yr(G, q),
            J
          );
        Kr(G, q);
      }
      return typeof q == "string" && q !== "" || typeof q == "number" || typeof q == "bigint" ? (q = "" + q, N !== null && N.tag === 6 ? (l(G, N.sibling), J = u(N, q), J.return = G, G = J) : (l(G, N), J = Cc(q, G.mode, J), J.return = G, G = J), m(G)) : l(G, N);
    }
    return function(G, N, q, J) {
      try {
        To = 0;
        var pe = Ae(
          G,
          N,
          q,
          J
        );
        return vi = null, pe;
      } catch (Se) {
        if (Se === pi || Se === Xr) throw Se;
        var Ue = Pt(29, Se, null, G.mode);
        return Ue.lanes = J, Ue.return = G, Ue;
      }
    };
  }
  var Oa = Ih(!0), $h = Ih(!1), Ll = !1;
  function Dc(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function jc(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = {
      baseState: e.baseState,
      firstBaseUpdate: e.firstBaseUpdate,
      lastBaseUpdate: e.lastBaseUpdate,
      shared: e.shared,
      callbacks: null
    });
  }
  function Ul(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function Vl(e, t, l) {
    var a = e.updateQueue;
    if (a === null) return null;
    if (a = a.shared, (ke & 2) !== 0) {
      var u = a.pending;
      return u === null ? t.next = t : (t.next = u.next, u.next = t), a.pending = t, t = Gr(e), Ah(e, null, l), t;
    }
    return Vr(e, a, t, l), Gr(e);
  }
  function Ao(e, t, l) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (l & 4194048) !== 0)) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Nm(e, l);
    }
  }
  function Hc(e, t) {
    var l = e.updateQueue, a = e.alternate;
    if (a !== null && (a = a.updateQueue, l === a)) {
      var u = null, s = null;
      if (l = l.firstBaseUpdate, l !== null) {
        do {
          var m = {
            lane: l.lane,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          };
          s === null ? u = s = m : s = s.next = m, l = l.next;
        } while (l !== null);
        s === null ? u = s = t : s = s.next = t;
      } else u = s = t;
      l = {
        baseState: a.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: s,
        shared: a.shared,
        callbacks: a.callbacks
      }, e.updateQueue = l;
      return;
    }
    e = l.lastBaseUpdate, e === null ? l.firstBaseUpdate = t : e.next = t, l.lastBaseUpdate = t;
  }
  var Lc = !1;
  function zo() {
    if (Lc) {
      var e = hi;
      if (e !== null) throw e;
    }
  }
  function Oo(e, t, l, a) {
    Lc = !1;
    var u = e.updateQueue;
    Ll = !1;
    var s = u.firstBaseUpdate, m = u.lastBaseUpdate, w = u.shared.pending;
    if (w !== null) {
      u.shared.pending = null;
      var z = w, k = z.next;
      z.next = null, m === null ? s = k : m.next = k, m = z;
      var Y = e.alternate;
      Y !== null && (Y = Y.updateQueue, w = Y.lastBaseUpdate, w !== m && (w === null ? Y.firstBaseUpdate = k : w.next = k, Y.lastBaseUpdate = z));
    }
    if (s !== null) {
      var ee = u.baseState;
      m = 0, Y = k = z = null, w = s;
      do {
        var L = w.lane & -536870913, I = L !== w.lane;
        if (I ? (Le & L) === L : (a & L) === L) {
          L !== 0 && L === _a && (Lc = !0), Y !== null && (Y = Y.next = {
            lane: 0,
            tag: w.tag,
            payload: w.payload,
            callback: null,
            next: null
          });
          e: {
            var fe = e, be = w;
            L = t;
            var Ae = l;
            switch (be.tag) {
              case 1:
                if (fe = be.payload, typeof fe == "function") {
                  ee = fe.call(Ae, ee, L);
                  break e;
                }
                ee = fe;
                break e;
              case 3:
                fe.flags = fe.flags & -65537 | 128;
              case 0:
                if (fe = be.payload, L = typeof fe == "function" ? fe.call(Ae, ee, L) : fe, L == null) break e;
                ee = H({}, ee, L);
                break e;
              case 2:
                Ll = !0;
            }
          }
          L = w.callback, L !== null && (e.flags |= 64, I && (e.flags |= 8192), I = u.callbacks, I === null ? u.callbacks = [L] : I.push(L));
        } else
          I = {
            lane: L,
            tag: w.tag,
            payload: w.payload,
            callback: w.callback,
            next: null
          }, Y === null ? (k = Y = I, z = ee) : Y = Y.next = I, m |= L;
        if (w = w.next, w === null) {
          if (w = u.shared.pending, w === null)
            break;
          I = w, w = I.next, I.next = null, u.lastBaseUpdate = I, u.shared.pending = null;
        }
      } while (!0);
      Y === null && (z = ee), u.baseState = z, u.firstBaseUpdate = k, u.lastBaseUpdate = Y, s === null && (u.shared.lanes = 0), $l |= m, e.lanes = m, e.memoizedState = ee;
    }
  }
  function Yh(e, t) {
    if (typeof e != "function")
      throw Error(r(191, e));
    e.call(t);
  }
  function Fh(e, t) {
    var l = e.callbacks;
    if (l !== null)
      for (e.callbacks = null, e = 0; e < l.length; e++)
        Yh(l[e], t);
  }
  var Gl = ut(null), Jr = ut(0);
  function Xh(e, t) {
    e = ml, Re(Jr, e), Re(Gl, t), ml = e | t.baseLanes;
  }
  function Uc() {
    Re(Jr, ml), Re(Gl, Gl.current);
  }
  function Vc() {
    ml = Jr.current, Je(Gl), Je(Jr);
  }
  var _t = ut(null), Nt = null;
  function kl(e) {
    var t = e.alternate;
    Re(Tt, Tt.current & 1), Re(_t, e), Nt === null && (t === null || Gl.current !== null || t.memoizedState !== null) && (Nt = e);
  }
  function Gc(e) {
    Re(Tt, Tt.current), Re(_t, e), Nt === null && (Nt = e);
  }
  function Qh(e) {
    e.tag === 22 ? (Re(Tt, Tt.current), Re(_t, e), Nt === null && (Nt = e)) : Bl();
  }
  function Bl() {
    Re(Tt, Tt.current), Re(_t, _t.current);
  }
  function nn(e) {
    Je(_t), Nt === e && (Nt = null), Je(Tt);
  }
  var Tt = ut(0);
  function Mo(e, t) {
    Re(_t, _t.current), Re(Tt, t);
  }
  function kc(e) {
    Je(Tt), Je(_t), Nt === e && (Nt = null);
  }
  function Wr(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var l = t.memoizedState;
        if (l !== null && (l = l.dehydrated, l === null || sd(l) || cd(l)))
          return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== "independent") {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var cl = 0, Te = null, $e = null, ct = null, eu = !1, yi = !1, Ma = !1, tu = 0, No = 0, bi = null, VC = 0;
  function lt() {
    throw Error(r(321));
  }
  function Bc(e, t) {
    if (t === null) return !1;
    for (var l = 0; l < t.length && l < e.length; l++)
      if (!tn(e[l], t[l])) return !1;
    return !0;
  }
  function qc(e, t, l, a, u, s) {
    return cl = s, Te = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, re.H = e === null || e.memoizedState === null ? Np : Dp, Ma = !1, s = l(a, u), Ma = !1, yi && (s = Kh(
      t,
      l,
      a,
      u
    )), Zh(e), s;
  }
  function Zh(e) {
    re.H = uu;
    var t = $e !== null && $e.next !== null;
    if (cl = 0, ct = $e = Te = null, eu = !1, No = 0, bi = null, t) throw Error(r(300));
    e === null || ft || (e = e.dependencies, e !== null && $r(e) && (ft = !0));
  }
  function Kh(e, t, l, a) {
    Te = e;
    var u = 0;
    do {
      if (yi && (bi = null), No = 0, yi = !1, 25 <= u) throw Error(r(301));
      if (u += 1, ct = $e = null, e.updateQueue != null) {
        var s = e.updateQueue;
        s.lastEffect = null, s.events = null, s.stores = null, s.memoCache != null && (s.memoCache.index = 0);
      }
      re.H = YC, s = t(l, a);
    } while (yi);
    return s;
  }
  function GC() {
    var e = re.H, t = e.useState()[0];
    return t = typeof t.then == "function" ? Do(t) : t, e = e.useState()[0], ($e !== null ? $e.memoizedState : null) !== e && (Te.flags |= 1024), t;
  }
  function Pc() {
    var e = tu !== 0;
    return tu = 0, e;
  }
  function Ic(e, t, l) {
    t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l;
  }
  function $c(e) {
    if (eu) {
      for (e = e.memoizedState; e !== null; ) {
        var t = e.queue;
        t !== null && (t.pending = null), e = e.next;
      }
      eu = !1;
    }
    cl = 0, ct = $e = Te = null, yi = !1, No = tu = 0, bi = null;
  }
  function Ut() {
    var e = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return ct === null ? Te.memoizedState = ct = e : ct = ct.next = e, ct;
  }
  function ot() {
    if ($e === null) {
      var e = Te.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = $e.next;
    var t = ct === null ? Te.memoizedState : ct.next;
    if (t !== null)
      ct = t, $e = e;
    else {
      if (e === null)
        throw Te.alternate === null ? Error(r(467)) : Error(r(310));
      $e = e, e = {
        memoizedState: $e.memoizedState,
        baseState: $e.baseState,
        baseQueue: $e.baseQueue,
        queue: $e.queue,
        next: null
      }, ct === null ? Te.memoizedState = ct = e : ct = ct.next = e;
    }
    return ct;
  }
  function nu() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Do(e) {
    var t = No;
    return No += 1, bi === null && (bi = []), e = Bh(bi, e, t), t = Te, (ct === null ? t.memoizedState : ct.next) === null && (t = t.alternate, re.H = t === null || t.memoizedState === null ? Np : Dp), e;
  }
  function lu(e) {
    if (e !== null && typeof e == "object") {
      if (typeof e.then == "function") return Do(e);
      if (e.$$typeof === A) return;
      if (e.$$typeof === de) return Rt(e);
    }
    throw Error(r(438, String(e)));
  }
  function Yc(e) {
    var t = null, l = Te.updateQueue;
    if (l !== null && (t = l.memoCache), t == null) {
      var a = Te.alternate;
      a !== null && (a = a.updateQueue, a !== null && (a = a.memoCache, a != null && (t = {
        data: a.data.map(function(u) {
          return u.slice();
        }),
        index: 0
      })));
    }
    if (t == null && (t = { data: [], index: 0 }), l === null && (l = nu(), Te.updateQueue = l), l.memoCache = t, l = t.data[t.index], l === void 0)
      for (l = t.data[t.index] = Array(e), a = 0; a < e; a++)
        l[a] = M;
    return t.index++, l;
  }
  function fl(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function au(e) {
    var t = ot();
    return Fc(t, $e, e);
  }
  function Fc(e, t, l) {
    var a = e.queue;
    if (a === null) throw Error(r(311));
    a.lastRenderedReducer = l;
    var u = e.baseQueue, s = a.pending;
    if (s !== null) {
      if (u !== null) {
        var m = u.next;
        u.next = s.next, s.next = m;
      }
      t.baseQueue = u = s, a.pending = null;
    }
    if (s = e.baseState, u === null) e.memoizedState = s;
    else {
      t = u.next;
      var w = m = null, z = null, k = t, Y = !1;
      do {
        var ee = k.lane & -536870913;
        if (ee !== k.lane ? (Le & ee) === ee : (cl & ee) === ee) {
          var L = k.revertLane;
          if (L === 0)
            z !== null && (z = z.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: k.action,
              hasEagerState: k.hasEagerState,
              eagerState: k.eagerState,
              next: null
            }), ee === _a && (Y = !0);
          else if ((cl & L) === L) {
            k = k.next, L === _a && (Y = !0);
            continue;
          } else
            ee = {
              lane: 0,
              revertLane: k.revertLane,
              gesture: null,
              action: k.action,
              hasEagerState: k.hasEagerState,
              eagerState: k.eagerState,
              next: null
            }, z === null ? (w = z = ee, m = s) : z = z.next = ee, Te.lanes |= L, $l |= L;
          ee = k.action, Ma && l(s, ee), s = k.hasEagerState ? k.eagerState : l(s, ee);
        } else
          L = {
            lane: ee,
            revertLane: k.revertLane,
            gesture: k.gesture,
            action: k.action,
            hasEagerState: k.hasEagerState,
            eagerState: k.eagerState,
            next: null
          }, z === null ? (w = z = L, m = s) : z = z.next = L, Te.lanes |= ee, $l |= ee;
        k = k.next;
      } while (k !== null && k !== t);
      if (z === null ? m = s : z.next = w, !tn(s, e.memoizedState) && (ft = !0, Y && (l = hi, l !== null)))
        throw l;
      e.memoizedState = s, e.baseState = m, e.baseQueue = z, a.lastRenderedState = s;
    }
    return u === null && (a.lanes = 0), [e.memoizedState, a.dispatch];
  }
  function Xc(e) {
    var t = ot(), l = t.queue;
    if (l === null) throw Error(r(311));
    l.lastRenderedReducer = e;
    var a = l.dispatch, u = l.pending, s = t.memoizedState;
    if (u !== null) {
      l.pending = null;
      var m = u = u.next;
      do
        s = e(s, m.action), m = m.next;
      while (m !== u);
      tn(s, t.memoizedState) || (ft = !0), t.memoizedState = s, t.baseQueue === null && (t.baseState = s), l.lastRenderedState = s;
    }
    return [s, a];
  }
  function Jh(e, t, l) {
    var a = Te, u = ot(), s = Ne;
    if (s) {
      if (l === void 0) throw Error(r(407));
      l = l();
    } else l = t();
    var m = !tn(
      ($e || u).memoizedState,
      l
    );
    if (m && (u.memoizedState = l, ft = !0), u = u.queue, Kc(tp.bind(null, a, u, e), [
      e
    ]), e = u.getSnapshot !== t || m || ct !== null && (ct.memoizedState.tag & 1) !== 0, Si(
      e ? 9 : 8,
      { destroy: void 0 },
      ep.bind(null, a, u, l, t),
      null
    ), e) {
      if (a.flags |= 2048, Xe === null) throw Error(r(349));
      s || (cl & 127) !== 0 || Wh(a, t, l);
    }
    return l;
  }
  function Wh(e, t, l) {
    e.flags |= 16384, e = { getSnapshot: t, value: l }, t = Te.updateQueue, t === null ? (t = nu(), Te.updateQueue = t, t.stores = [e]) : (l = t.stores, l === null ? t.stores = [e] : l.push(e));
  }
  function ep(e, t, l, a) {
    t.value = l, t.getSnapshot = a, np(t) && lp(e);
  }
  function tp(e, t, l) {
    return l(function() {
      np(t) && lp(e);
    });
  }
  function np(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var l = t();
      return !tn(e, l);
    } catch {
      return !0;
    }
  }
  function lp(e) {
    var t = Sa(e, 2);
    t !== null && Ft(t, e, 2);
  }
  function Qc(e) {
    var t = Ut();
    if (typeof e == "function") {
      var l = e;
      if (e = l(), Ma) {
        Al(!0);
        try {
          l();
        } finally {
          Al(!1);
        }
      }
    }
    return t.memoizedState = t.baseState = e, t.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: fl,
      lastRenderedState: e
    }, t;
  }
  function ap(e, t, l, a) {
    return e.baseState = l, Fc(
      e,
      $e,
      typeof a == "function" ? a : fl
    );
  }
  function kC(e, t, l, a, u) {
    if (ru(e)) throw Error(r(485));
    if (e = t.action, e !== null) {
      var s = {
        payload: u,
        action: e,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(m) {
          s.listeners.push(m);
        }
      };
      re.T !== null ? l(!0) : s.isTransition = !1, a(s), l = t.pending, l === null ? (s.next = t.pending = s, ip(t, s)) : (s.next = l.next, t.pending = l.next = s);
    }
  }
  function ip(e, t) {
    var l = t.action, a = t.payload, u = e.state;
    if (t.isTransition) {
      var s = re.T, m = {};
      m.types = s !== null ? s.types : null, re.T = m;
      try {
        var w = l(u, a), z = re.S;
        z !== null && z(m, w), op(e, t, w);
      } catch (k) {
        Zc(e, t, k);
      } finally {
        s !== null && m.types !== null && (s.types = m.types), re.T = s;
      }
    } else
      try {
        s = l(u, a), op(e, t, s);
      } catch (k) {
        Zc(e, t, k);
      }
  }
  function op(e, t, l) {
    l !== null && typeof l == "object" && typeof l.then == "function" ? l.then(
      function(a) {
        rp(e, t, a);
      },
      function(a) {
        return Zc(e, t, a);
      }
    ) : rp(e, t, l);
  }
  function rp(e, t, l) {
    t.status = "fulfilled", t.value = l, up(t), e.state = l, t = e.pending, t !== null && (l = t.next, l === t ? e.pending = null : (l = l.next, t.next = l, ip(e, l)));
  }
  function Zc(e, t, l) {
    var a = e.pending;
    if (e.pending = null, a !== null) {
      a = a.next;
      do
        t.status = "rejected", t.reason = l, up(t), t = t.next;
      while (t !== a);
    }
    e.action = null;
  }
  function up(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function sp(e, t) {
    return t;
  }
  function cp(e, t) {
    if (Ne) {
      var l = Xe.formState;
      if (l !== null) {
        e: {
          var a = Te;
          if (Ne) {
            if (Ze) {
              t: {
                for (var u = Ze, s = yn; u.nodeType !== 8; ) {
                  if (!s) {
                    u = null;
                    break t;
                  }
                  if (u = Sn(
                    u.nextSibling
                  ), u === null) {
                    u = null;
                    break t;
                  }
                }
                s = u.data, u = s === "F!" || s === "F" ? u : null;
              }
              if (u) {
                Ze = Sn(
                  u.nextSibling
                ), a = u.data === "F!";
                break e;
              }
            }
            Dl(a);
          }
          a = !1;
        }
        a && (t = l[0]);
      }
    }
    return l = Ut(), l.memoizedState = l.baseState = t, a = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: sp,
      lastRenderedState: t
    }, l.queue = a, l = zp.bind(
      null,
      Te,
      a
    ), a.dispatch = l, a = Qc(!1), s = nf.bind(
      null,
      Te,
      !1,
      a.queue
    ), a = Ut(), u = {
      state: t,
      dispatch: null,
      action: e,
      pending: null
    }, a.queue = u, l = kC.bind(
      null,
      Te,
      u,
      s,
      l
    ), u.dispatch = l, a.memoizedState = e, [t, l, !1];
  }
  function fp(e) {
    var t = ot();
    return dp(t, $e, e);
  }
  function dp(e, t, l) {
    if (t = Fc(
      e,
      t,
      sp
    )[0], e = au(fl)[0], typeof t == "object" && t !== null && typeof t.then == "function")
      try {
        var a = Do(t);
      } catch (m) {
        throw m === pi ? Xr : m;
      }
    else a = t;
    t = ot();
    var u = t.queue, s = u.dispatch;
    return l !== t.memoizedState && (Te.flags |= 2048, Si(
      9,
      { destroy: void 0 },
      BC.bind(null, u, l),
      null
    )), [a, s, e];
  }
  function BC(e, t) {
    e.action = t;
  }
  function gp(e) {
    var t = ot(), l = $e;
    if (l !== null)
      return dp(t, l, e);
    ot(), t = t.memoizedState, l = ot();
    var a = l.queue.dispatch;
    return l.memoizedState = e, [t, a, !1];
  }
  function Si(e, t, l, a) {
    return e = { tag: e, create: l, deps: a, inst: t, next: null }, t = Te.updateQueue, t === null && (t = nu(), Te.updateQueue = t), l = t.lastEffect, l === null ? t.lastEffect = e.next = e : (a = l.next, l.next = e, e.next = a, t.lastEffect = e), e;
  }
  function mp() {
    return ot().memoizedState;
  }
  function iu(e, t, l, a) {
    var u = Ut();
    Te.flags |= e, u.memoizedState = Si(
      1 | t,
      { destroy: void 0 },
      l,
      a === void 0 ? null : a
    );
  }
  function ou(e, t, l, a) {
    var u = ot();
    a = a === void 0 ? null : a;
    var s = u.memoizedState.inst;
    $e !== null && a !== null && Bc(a, $e.memoizedState.deps) ? u.memoizedState = Si(t, s, l, a) : (Te.flags |= e, u.memoizedState = Si(
      1 | t,
      s,
      l,
      a
    ));
  }
  function hp(e, t) {
    iu(8390656, 8, e, t);
  }
  function Kc(e, t) {
    ou(2048, 8, e, t);
  }
  function qC(e) {
    Te.flags |= 4;
    var t = Te.updateQueue;
    if (t === null)
      t = nu(), Te.updateQueue = t, t.events = [e];
    else {
      var l = t.events;
      l === null ? t.events = [e] : l.push(e);
    }
  }
  function pp(e) {
    var t = ot().memoizedState;
    return qC({ ref: t, nextImpl: e }), function() {
      if ((ke & 2) !== 0) throw Error(r(440));
      return t.impl.apply(void 0, arguments);
    };
  }
  function vp(e, t) {
    return ou(4, 2, e, t);
  }
  function yp(e, t) {
    return ou(4, 4, e, t);
  }
  function bp(e, t) {
    if (typeof t == "function") {
      e = e();
      var l = t(e);
      return function() {
        typeof l == "function" ? l() : t(null);
      };
    }
    if (t != null)
      return e = e(), t.current = e, function() {
        t.current = null;
      };
  }
  function Sp(e, t, l) {
    l = l != null ? l.concat([e]) : null, ou(4, 4, bp.bind(null, t, e), l);
  }
  function Jc() {
  }
  function xp(e, t) {
    var l = ot();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    return t !== null && Bc(t, a[1]) ? a[0] : (l.memoizedState = [e, t], e);
  }
  function Cp(e, t) {
    var l = ot();
    t = t === void 0 ? null : t;
    var a = l.memoizedState;
    if (t !== null && Bc(t, a[1]))
      return a[0];
    if (a = e(), Ma) {
      Al(!0);
      try {
        e();
      } finally {
        Al(!1);
      }
    }
    return l.memoizedState = [a, t], a;
  }
  function Wc(e, t, l) {
    return l === void 0 || (cl & 1073741824) !== 0 && (Le & 261930) === 0 ? e.memoizedState = t : (e.memoizedState = l, e = Nv(), Te.lanes |= e, $l |= e, l);
  }
  function wp(e, t, l, a) {
    return tn(l, t) ? l : Gl.current !== null ? (e = Wc(e, l, a), tn(e, t) || (ft = !0), e) : (cl & 106) === 0 || (cl & 1073741824) !== 0 && (Le & 261930) === 0 ? (ft = !0, e.memoizedState = l) : (e = Nv(), Te.lanes |= e, $l |= e, t);
  }
  function Ep(e, t, l, a, u) {
    var s = ce.p;
    ce.p = s !== 0 && 8 > s ? s : 8;
    var m = re.T, w = {};
    w.types = m !== null ? m.types : null, re.T = w, nf(e, !1, t, l);
    try {
      var z = u(), k = re.S;
      if (k !== null && k(w, z), z !== null && typeof z == "object" && typeof z.then == "function") {
        var Y = UC(
          z,
          a
        );
        jo(
          e,
          t,
          Y,
          rn(e)
        );
      } else
        jo(
          e,
          t,
          a,
          rn(e)
        );
    } catch (ee) {
      jo(
        e,
        t,
        { then: function() {
        }, status: "rejected", reason: ee },
        rn()
      );
    } finally {
      ce.p = s, m !== null && w.types !== null && (m.types = w.types), re.T = m;
    }
  }
  function PC() {
  }
  function ef(e, t, l, a) {
    if (e.tag !== 5) throw Error(r(476));
    var u = Rp(e).queue;
    Ep(
      e,
      u,
      t,
      Ee,
      l === null ? PC : function() {
        return _p(e), l(a);
      }
    );
  }
  function Rp(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Ee,
      baseState: Ee,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: fl,
        lastRenderedState: Ee
      },
      next: null
    };
    var l = {};
    return t.next = {
      memoizedState: l,
      baseState: l,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: fl,
        lastRenderedState: l
      },
      next: null
    }, e.memoizedState = t, e = e.alternate, e !== null && (e.memoizedState = t), t;
  }
  function _p(e) {
    var t = Rp(e);
    t.next === null && (t = e.alternate.memoizedState), jo(
      e,
      t.next.queue,
      {},
      rn()
    );
  }
  function tf() {
    return Rt(Gi);
  }
  function Tp() {
    return ot().memoizedState;
  }
  function Ap() {
    return ot().memoizedState;
  }
  function IC(e) {
    for (var t = e.return; t !== null; ) {
      switch (t.tag) {
        case 24:
        case 3:
          var l = rn();
          e = Ul(l);
          var a = Vl(t, e, l);
          a !== null && (Ft(a, t, l), Ao(a, t, l)), t = { cache: zc() }, e.payload = t;
          return;
      }
      t = t.return;
    }
  }
  function $C(e, t, l) {
    var a = rn();
    l = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ru(e) ? Op(t, l) : (l = Sc(e, t, l, a), l !== null && (Ft(l, e, a), Mp(l, t, a)));
  }
  function zp(e, t, l) {
    var a = rn();
    jo(e, t, l, a);
  }
  function jo(e, t, l, a) {
    var u = {
      lane: a,
      revertLane: 0,
      gesture: null,
      action: l,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (ru(e)) Op(t, u);
    else {
      var s = e.alternate;
      if (e.lanes === 0 && (s === null || s.lanes === 0) && (s = t.lastRenderedReducer, s !== null))
        try {
          var m = t.lastRenderedState, w = s(m, l);
          if (u.hasEagerState = !0, u.eagerState = w, tn(w, m))
            return Vr(e, t, u, 0), Xe === null && Ur(), !1;
        } catch {
        }
      if (l = Sc(e, t, u, a), l !== null)
        return Ft(l, e, a), Mp(l, t, a), !0;
    }
    return !1;
  }
  function nf(e, t, l, a) {
    if (a = {
      lane: 2,
      revertLane: Ff(),
      gesture: null,
      action: a,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, ru(e)) {
      if (t) throw Error(r(479));
    } else
      t = Sc(
        e,
        l,
        a,
        2
      ), t !== null && Ft(t, e, 2);
  }
  function ru(e) {
    var t = e.alternate;
    return e === Te || t !== null && t === Te;
  }
  function Op(e, t) {
    yi = eu = !0;
    var l = e.pending;
    l === null ? t.next = t : (t.next = l.next, l.next = t), e.pending = t;
  }
  function Mp(e, t, l) {
    if ((l & 4194048) !== 0) {
      var a = t.lanes;
      a &= e.pendingLanes, l |= a, t.lanes = l, Nm(e, l);
    }
  }
  var uu = {
    readContext: Rt,
    use: lu,
    useCallback: lt,
    useContext: lt,
    useEffect: lt,
    useImperativeHandle: lt,
    useLayoutEffect: lt,
    useInsertionEffect: lt,
    useMemo: lt,
    useReducer: lt,
    useRef: lt,
    useState: lt,
    useDebugValue: lt,
    useDeferredValue: lt,
    useTransition: lt,
    useSyncExternalStore: lt,
    useId: lt,
    useHostTransitionStatus: lt,
    useFormState: lt,
    useActionState: lt,
    useOptimistic: lt,
    useMemoCache: lt,
    useCacheRefresh: lt,
    useEffectEvent: lt
  }, Np = {
    readContext: Rt,
    use: lu,
    useCallback: function(e, t) {
      return Ut().memoizedState = [
        e,
        t === void 0 ? null : t
      ], e;
    },
    useContext: Rt,
    useEffect: hp,
    useImperativeHandle: function(e, t, l) {
      l = l != null ? l.concat([e]) : null, iu(
        4194308,
        4,
        bp.bind(null, t, e),
        l
      );
    },
    useLayoutEffect: function(e, t) {
      return iu(4194308, 4, e, t);
    },
    useInsertionEffect: function(e, t) {
      iu(4, 2, e, t);
    },
    useMemo: function(e, t) {
      var l = Ut();
      t = t === void 0 ? null : t;
      var a = e();
      if (Ma) {
        Al(!0);
        try {
          e();
        } finally {
          Al(!1);
        }
      }
      return l.memoizedState = [a, t], a;
    },
    useReducer: function(e, t, l) {
      var a = Ut();
      if (l !== void 0) {
        var u = l(t);
        if (Ma) {
          Al(!0);
          try {
            l(t);
          } finally {
            Al(!1);
          }
        }
      } else u = t;
      return a.memoizedState = a.baseState = u, e = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: u
      }, a.queue = e, e = e.dispatch = $C.bind(
        null,
        Te,
        e
      ), [a.memoizedState, e];
    },
    useRef: function(e) {
      var t = Ut();
      return e = { current: e }, t.memoizedState = e;
    },
    useState: function(e) {
      e = Qc(e);
      var t = e.queue, l = zp.bind(null, Te, t);
      return t.dispatch = l, [e.memoizedState, l];
    },
    useDebugValue: Jc,
    useDeferredValue: function(e, t) {
      var l = Ut();
      return Wc(l, e, t);
    },
    useTransition: function() {
      var e = Qc(!1);
      return e = Ep.bind(
        null,
        Te,
        e.queue,
        !0,
        !1
      ), Ut().memoizedState = e, [!1, e];
    },
    useSyncExternalStore: function(e, t, l) {
      var a = Te, u = Ut();
      if (Ne) {
        if (l === void 0)
          throw Error(r(407));
        l = l();
      } else {
        if (l = t(), Xe === null)
          throw Error(r(349));
        (Le & 127) !== 0 || Wh(a, t, l);
      }
      u.memoizedState = l;
      var s = { value: l, getSnapshot: t };
      return u.queue = s, hp(tp.bind(null, a, s, e), [
        e
      ]), a.flags |= 2048, Si(
        9,
        { destroy: void 0 },
        ep.bind(
          null,
          a,
          s,
          l,
          t
        ),
        null
      ), l;
    },
    useId: function() {
      var e = Ut(), t = Xe.identifierPrefix;
      if (Ne) {
        var l = Gn, a = Vn;
        l = (a & ~(1 << 32 - Wt(a) - 1)).toString(32) + l, t = "_" + t + "R_" + l, l = tu++, 0 < l && (t += "H" + l.toString(32)), t += "_";
      } else
        l = VC++, t = "_" + t + "r_" + l.toString(32) + "_";
      return e.memoizedState = t;
    },
    useHostTransitionStatus: tf,
    useFormState: cp,
    useActionState: cp,
    useOptimistic: function(e) {
      var t = Ut();
      t.memoizedState = t.baseState = e;
      var l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return t.queue = l, t = nf.bind(
        null,
        Te,
        !0,
        l
      ), l.dispatch = t, [e, t];
    },
    useMemoCache: Yc,
    useCacheRefresh: function() {
      return Ut().memoizedState = IC.bind(
        null,
        Te
      );
    },
    useEffectEvent: function(e) {
      var t = Ut(), l = { impl: e };
      return t.memoizedState = l, function() {
        if ((ke & 2) !== 0)
          throw Error(r(440));
        return l.impl.apply(void 0, arguments);
      };
    }
  }, Dp = {
    readContext: Rt,
    use: lu,
    useCallback: xp,
    useContext: Rt,
    useEffect: Kc,
    useImperativeHandle: Sp,
    useInsertionEffect: vp,
    useLayoutEffect: yp,
    useMemo: Cp,
    useReducer: au,
    useRef: mp,
    useState: function() {
      return au(fl);
    },
    useDebugValue: Jc,
    useDeferredValue: function(e, t) {
      var l = ot();
      return wp(
        l,
        $e.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = au(fl)[0], t = ot().memoizedState;
      return [
        typeof e == "boolean" ? e : Do(e),
        t
      ];
    },
    useSyncExternalStore: Jh,
    useId: Tp,
    useHostTransitionStatus: tf,
    useFormState: fp,
    useActionState: fp,
    useOptimistic: function(e, t) {
      var l = ot();
      return ap(l, $e, e, t);
    },
    useMemoCache: Yc,
    useCacheRefresh: Ap,
    useEffectEvent: pp
  }, YC = {
    readContext: Rt,
    use: lu,
    useCallback: xp,
    useContext: Rt,
    useEffect: Kc,
    useImperativeHandle: Sp,
    useInsertionEffect: vp,
    useLayoutEffect: yp,
    useMemo: Cp,
    useReducer: Xc,
    useRef: mp,
    useState: function() {
      return Xc(fl);
    },
    useDebugValue: Jc,
    useDeferredValue: function(e, t) {
      var l = ot();
      return $e === null ? Wc(l, e, t) : wp(
        l,
        $e.memoizedState,
        e,
        t
      );
    },
    useTransition: function() {
      var e = Xc(fl)[0], t = ot().memoizedState;
      return [
        typeof e == "boolean" ? e : Do(e),
        t
      ];
    },
    useSyncExternalStore: Jh,
    useId: Tp,
    useHostTransitionStatus: tf,
    useFormState: gp,
    useActionState: gp,
    useOptimistic: function(e, t) {
      var l = ot();
      return $e !== null ? ap(l, $e, e, t) : (l.baseState = e, [e, l.queue.dispatch]);
    },
    useMemoCache: Yc,
    useCacheRefresh: Ap,
    useEffectEvent: pp
  };
  function lf(e, t, l, a) {
    t = e.memoizedState, l = l(a, t), l = l == null ? t : H({}, t, l), e.memoizedState = l, e.lanes === 0 && (e.updateQueue.baseState = l);
  }
  var af = {
    enqueueSetState: function(e, t, l) {
      e = e._reactInternals;
      var a = rn(), u = Ul(a);
      u.payload = t, l != null && (u.callback = l), t = Vl(e, u, a), t !== null && (Ft(t, e, a), Ao(t, e, a));
    },
    enqueueReplaceState: function(e, t, l) {
      e = e._reactInternals;
      var a = rn(), u = Ul(a);
      u.tag = 1, u.payload = t, l != null && (u.callback = l), t = Vl(e, u, a), t !== null && (Ft(t, e, a), Ao(t, e, a));
    },
    enqueueForceUpdate: function(e, t) {
      e = e._reactInternals;
      var l = rn(), a = Ul(l);
      a.tag = 2, t != null && (a.callback = t), t = Vl(e, a, l), t !== null && (Ft(t, e, l), Ao(t, e, l));
    }
  };
  function jp(e, t, l, a, u, s, m) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(a, s, m) : t.prototype && t.prototype.isPureReactComponent ? !So(l, a) || !So(u, s) : !0;
  }
  function Hp(e, t, l, a) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(l, a), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(l, a), t.state !== e && af.enqueueReplaceState(t, t.state, null);
  }
  function Na(e, t) {
    var l = t;
    if ("ref" in t) {
      l = {};
      for (var a in t)
        a !== "ref" && (l[a] = t[a]);
    }
    if (e = e.defaultProps) {
      l === t && (l = H({}, l));
      for (var u in e)
        l[u] === void 0 && (l[u] = e[u]);
    }
    return l;
  }
  function Lp(e) {
    Lr(e);
  }
  function Up(e) {
    console.error(e);
  }
  function Vp(e) {
    Lr(e);
  }
  function su(e, t) {
    try {
      var l = e.onUncaughtError;
      l(t.value, { componentStack: t.stack });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function Gp(e, t, l) {
    try {
      var a = e.onCaughtError;
      a(l.value, {
        componentStack: l.stack,
        errorBoundary: t.tag === 1 ? t.stateNode : null
      });
    } catch (u) {
      setTimeout(function() {
        throw u;
      });
    }
  }
  function of(e, t, l) {
    return l = Ul(l), l.tag = 3, l.payload = { element: null }, l.callback = function() {
      su(e, t);
    }, l;
  }
  function kp(e) {
    return e = Ul(e), e.tag = 3, e;
  }
  function Bp(e, t, l, a) {
    var u = l.type.getDerivedStateFromError;
    if (typeof u == "function") {
      var s = a.value;
      e.payload = function() {
        return u(s);
      }, e.callback = function() {
        Gp(t, l, a);
      };
    }
    var m = l.stateNode;
    m !== null && typeof m.componentDidCatch == "function" && (e.callback = function() {
      Gp(t, l, a), typeof u != "function" && (Yl === null ? Yl = /* @__PURE__ */ new Set([this]) : Yl.add(this));
      var w = a.stack;
      this.componentDidCatch(a.value, {
        componentStack: w !== null ? w : ""
      });
    });
  }
  function FC(e, t, l, a, u) {
    if (l.flags |= 32768, a !== null && typeof a == "object" && typeof a.then == "function") {
      if (t = l.alternate, t !== null && Ea(
        t,
        l,
        u,
        !0
      ), l = _t.current, l !== null) {
        switch (l.tag) {
          case 31:
          case 13:
          case 19:
            return Nt === null ? Ou() : l.alternate === null && at === 0 && (at = 3), l.flags &= -257, l.flags |= 65536, l.lanes = u, a === Qr ? l.flags |= 16384 : (t = l.updateQueue, t === null ? l.updateQueue = /* @__PURE__ */ new Set([a]) : t.add(a), If(e, a, u)), !1;
          case 22:
            return l.flags |= 65536, a === Qr ? l.flags |= 16384 : (t = l.updateQueue, t === null ? (t = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([a])
            }, l.updateQueue = t) : (l = t.retryQueue, l === null ? t.retryQueue = /* @__PURE__ */ new Set([a]) : l.add(a)), If(e, a, u)), !1;
        }
        throw Error(r(435, l.tag));
      }
      return If(e, a, u), Ou(), !1;
    }
    if (Ne)
      return t = _t.current, t !== null ? ((t.flags & 65536) === 0 && (t.flags |= 256), t.flags |= 65536, t.lanes = u, a !== Rc && (e = Error(r(422), { cause: a }), wo(hn(e, l)))) : (a !== Rc && (t = Error(r(423), {
        cause: a
      }), wo(
        hn(t, l)
      )), e = e.current.alternate, e.flags |= 65536, u &= -u, e.lanes |= u, a = hn(a, l), u = of(
        e.stateNode,
        a,
        u
      ), Hc(e, u), at !== 4 && (at = 2)), !1;
    var s = Error(r(520), { cause: a });
    if (s = hn(s, l), qo === null ? qo = [s] : qo.push(s), at !== 4 && (at = 2), t === null) return !0;
    a = hn(a, l), l = t;
    do {
      switch (l.tag) {
        case 3:
          return l.flags |= 65536, e = u & -u, l.lanes |= e, e = of(l.stateNode, a, e), Hc(l, e), !1;
        case 1:
          if (t = l.type, s = l.stateNode, (l.flags & 128) === 0 && (typeof t.getDerivedStateFromError == "function" || s !== null && typeof s.componentDidCatch == "function" && (Yl === null || !Yl.has(s))))
            return l.flags |= 65536, u &= -u, l.lanes |= u, u = kp(u), Bp(
              u,
              e,
              l,
              a
            ), Hc(l, u), !1;
          break;
        case 22:
          if (l.memoizedState !== null)
            return l.flags |= 65536, !1;
      }
      l = l.return;
    } while (l !== null);
    return !1;
  }
  var rf = Error(r(461)), ft = !1;
  function ht(e, t, l, a) {
    t.child = e === null ? $h(t, null, l, a) : Oa(
      t,
      e.child,
      l,
      a
    );
  }
  function qp(e, t, l, a, u) {
    l = l.render;
    var s = t.ref;
    if ("ref" in a) {
      var m = {};
      for (var w in a)
        w !== "ref" && (m[w] = a[w]);
    } else m = a;
    return Ra(t), a = qc(
      e,
      t,
      l,
      m,
      s,
      u
    ), w = Pc(), e !== null && !ft ? (Ic(e, t, u), dl(e, t, u)) : (Ne && w && qr(t), t.flags |= 1, ht(e, t, a, u), t.child);
  }
  function Pp(e, t, l, a, u) {
    if (e === null) {
      var s = l.type;
      return typeof s == "function" && !xc(s) && s.defaultProps === void 0 && l.compare === null ? (t.tag = 15, t.type = s, Ip(
        e,
        t,
        s,
        a,
        u
      )) : (e = kr(
        l.type,
        null,
        a,
        t,
        t.mode,
        u
      ), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (s = e.child, !hf(e, u)) {
      var m = s.memoizedProps;
      if (l = l.compare, l = l !== null ? l : So, l(m, a) && e.ref === t.ref)
        return dl(e, t, u);
    }
    return t.flags |= 1, e = ol(s, a), e.ref = t.ref, e.return = t, t.child = e;
  }
  function Ip(e, t, l, a, u) {
    if (e !== null) {
      var s = e.memoizedProps;
      if (So(s, a) && e.ref === t.ref)
        if (ft = !1, t.pendingProps = a = s, hf(e, u))
          (e.flags & 131072) !== 0 && (ft = !0);
        else
          return t.lanes = e.lanes, dl(e, t, u);
    }
    return uf(
      e,
      t,
      l,
      a,
      u
    );
  }
  function $p(e, t, l, a) {
    var u = a.children, s = e !== null ? e.memoizedState : null;
    if (e === null && t.stateNode === null && (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), a.mode === "hidden") {
      if ((t.flags & 128) !== 0) {
        if (s = s !== null ? s.baseLanes | l : l, e !== null) {
          for (a = t.child = e.child, u = 0; a !== null; )
            u = u | a.lanes | a.childLanes, a = a.sibling;
          a = u & ~s;
        } else a = 0, t.child = null;
        return Yp(
          e,
          t,
          s,
          l,
          a
        );
      }
      if ((l & 536870912) !== 0)
        t.memoizedState = { baseLanes: 0, cachePool: null }, e !== null && Fr(
          t,
          s !== null ? s.cachePool : null
        ), s !== null ? Xh(t, s) : Uc(), Qh(t);
      else
        return a = t.lanes = 536870912, Yp(
          e,
          t,
          s !== null ? s.baseLanes | l : l,
          l,
          a
        );
    } else
      s !== null ? (Fr(t, s.cachePool), Xh(t, s), Bl(), t.memoizedState = null) : (e !== null && Fr(t, null), Uc(), Bl());
    return ht(e, t, u, l), t.child;
  }
  function Ho(e, t) {
    return e !== null && e.tag === 22 || t.stateNode !== null || (t.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), t.sibling;
  }
  function Yp(e, t, l, a, u) {
    var s = Mc();
    return s = s === null ? null : { parent: st._currentValue, pool: s }, t.memoizedState = {
      baseLanes: l,
      cachePool: s
    }, e !== null && Fr(t, null), Uc(), Qh(t), e !== null && Ea(e, t, a, !0), t.childLanes = u, null;
  }
  function cu(e, t) {
    return t = fu(
      { mode: t.mode, children: t.children },
      e.mode
    ), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Fp(e, t, l) {
    return Oa(t, e.child, null, l), e = cu(t, t.pendingProps), e.flags |= 2, nn(t), t.memoizedState = null, e;
  }
  function XC(e, t, l) {
    var a = t.pendingProps, u = (t.flags & 128) !== 0;
    if (t.flags &= -129, e === null) {
      if (Ne) {
        if (a.mode === "hidden")
          return e = cu(t, a), t.lanes = 536870912, e.memoizedState = { baseLanes: 0, cachePool: null }, Ho(null, e);
        if (Gc(t), (e = Ze) ? (e = by(
          e,
          yn
        ), e = e !== null && e.data === "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Ml !== null ? { id: Vn, overflow: Gn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Oh(e), l.return = t, t.child = l, yt = t, Ze = null)) : e = null, e === null) throw Dl(t);
        return t.lanes = 536870912, null;
      }
      return cu(t, a);
    }
    var s = e.memoizedState;
    if (s !== null) {
      var m = s.dehydrated;
      if (Gc(t), u)
        if (t.flags & 256)
          t.flags &= -257, t = Fp(
            e,
            t,
            l
          );
        else if (t.memoizedState !== null)
          t.child = e.child, t.flags |= 128, t = null;
        else throw Error(r(558));
      else if (ft || Ea(e, t, l, !1), u = (l & e.childLanes) !== 0, ft || u) {
        if (Gl.current === null) {
          if (a = Xe, a !== null && (m = Dm(a, l), m !== 0 && m !== s.retryLane))
            throw s.retryLane = m, Sa(e, m), Ft(a, e, m), rf;
          Ou();
        }
        t = Fp(
          e,
          t,
          l
        );
      } else
        e = s.treeContext, Ze = Sn(m.nextSibling), yt = t, Ne = !0, Nl = null, yn = !1, e !== null && Dh(t, e), t = cu(t, a), t.flags |= 134221824;
      return t;
    }
    return e = ol(e.child, {
      mode: a.mode,
      children: a.children
    }), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function xi(e, t) {
    var l = t.ref;
    if (l === null)
      e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof l != "function" && typeof l != "object")
        throw Error(r(284));
      (e === null || e.ref !== l) && (t.flags |= 4194816);
    }
  }
  function uf(e, t, l, a, u) {
    return Ra(t), l = qc(
      e,
      t,
      l,
      a,
      void 0,
      u
    ), a = Pc(), e !== null && !ft ? (Ic(e, t, u), dl(e, t, u)) : (Ne && a && qr(t), t.flags |= 1, ht(e, t, l, u), t.child);
  }
  function Xp(e, t, l, a, u, s) {
    return Ra(t), t.updateQueue = null, l = Kh(
      t,
      a,
      l,
      u
    ), Zh(e), a = Pc(), e !== null && !ft ? (Ic(e, t, s), dl(e, t, s)) : (Ne && a && qr(t), t.flags |= 1, ht(e, t, l, s), t.child);
  }
  function Qp(e, t, l, a, u) {
    if (Ra(t), t.stateNode === null) {
      var s = fi, m = l.contextType;
      typeof m == "object" && m !== null && (s = Rt(m)), s = new l(a, s), t.memoizedState = s.state !== null && s.state !== void 0 ? s.state : null, s.updater = af, t.stateNode = s, s._reactInternals = t, s = t.stateNode, s.props = a, s.state = t.memoizedState, s.refs = {}, Dc(t), m = l.contextType, s.context = typeof m == "object" && m !== null ? Rt(m) : fi, s.state = t.memoizedState, m = l.getDerivedStateFromProps, typeof m == "function" && (lf(
        t,
        l,
        m,
        a
      ), s.state = t.memoizedState), typeof l.getDerivedStateFromProps == "function" || typeof s.getSnapshotBeforeUpdate == "function" || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (m = s.state, typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount(), m !== s.state && af.enqueueReplaceState(s, s.state, null), Oo(t, a, s, u), zo(), s.state = t.memoizedState), typeof s.componentDidMount == "function" && (t.flags |= 4194308), a = !0;
    } else if (e === null) {
      s = t.stateNode;
      var w = t.memoizedProps, z = Na(l, w);
      s.props = z;
      var k = s.context, Y = l.contextType;
      m = fi, typeof Y == "object" && Y !== null && (m = Rt(Y));
      var ee = l.getDerivedStateFromProps;
      Y = typeof ee == "function" || typeof s.getSnapshotBeforeUpdate == "function", w = t.pendingProps !== w, Y || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (w || k !== m) && Hp(
        t,
        s,
        a,
        m
      ), Ll = !1;
      var L = t.memoizedState;
      s.state = L, Oo(t, a, s, u), zo(), k = t.memoizedState, w || L !== k || Ll ? (typeof ee == "function" && (lf(
        t,
        l,
        ee,
        a
      ), k = t.memoizedState), (z = Ll || jp(
        t,
        l,
        z,
        a,
        L,
        k,
        m
      )) ? (Y || typeof s.UNSAFE_componentWillMount != "function" && typeof s.componentWillMount != "function" || (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = a, t.memoizedState = k), s.props = a, s.state = k, s.context = m, a = z) : (typeof s.componentDidMount == "function" && (t.flags |= 4194308), a = !1);
    } else {
      s = t.stateNode, jc(e, t), m = t.memoizedProps, Y = Na(l, m), s.props = Y, ee = t.pendingProps, L = s.context, k = l.contextType, z = fi, typeof k == "object" && k !== null && (z = Rt(k)), w = l.getDerivedStateFromProps, (k = typeof w == "function" || typeof s.getSnapshotBeforeUpdate == "function") || typeof s.UNSAFE_componentWillReceiveProps != "function" && typeof s.componentWillReceiveProps != "function" || (m !== ee || L !== z) && Hp(
        t,
        s,
        a,
        z
      ), Ll = !1, L = t.memoizedState, s.state = L, Oo(t, a, s, u), zo();
      var I = t.memoizedState;
      m !== ee || L !== I || Ll || e !== null && e.dependencies !== null && $r(e.dependencies) ? (typeof w == "function" && (lf(
        t,
        l,
        w,
        a
      ), I = t.memoizedState), (Y = Ll || jp(
        t,
        l,
        Y,
        a,
        L,
        I,
        z
      ) || e !== null && e.dependencies !== null && $r(e.dependencies)) ? (k || typeof s.UNSAFE_componentWillUpdate != "function" && typeof s.componentWillUpdate != "function" || (typeof s.componentWillUpdate == "function" && s.componentWillUpdate(a, I, z), typeof s.UNSAFE_componentWillUpdate == "function" && s.UNSAFE_componentWillUpdate(
        a,
        I,
        z
      )), typeof s.componentDidUpdate == "function" && (t.flags |= 4), typeof s.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof s.componentDidUpdate != "function" || m === e.memoizedProps && L === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || m === e.memoizedProps && L === e.memoizedState || (t.flags |= 1024), t.memoizedProps = a, t.memoizedState = I), s.props = a, s.state = I, s.context = z, a = Y) : (typeof s.componentDidUpdate != "function" || m === e.memoizedProps && L === e.memoizedState || (t.flags |= 4), typeof s.getSnapshotBeforeUpdate != "function" || m === e.memoizedProps && L === e.memoizedState || (t.flags |= 1024), a = !1);
    }
    return s = a, xi(e, t), a = (t.flags & 128) !== 0, s || a ? (s = t.stateNode, l = a && typeof l.getDerivedStateFromError != "function" ? null : s.render(), t.flags |= 1, e !== null && a ? (t.child = Oa(
      t,
      e.child,
      null,
      u
    ), t.child = Oa(
      t,
      null,
      l,
      u
    )) : ht(e, t, l, u), t.memoizedState = s.state, e = t.child) : e = dl(
      e,
      t,
      u
    ), e;
  }
  function Zp(e, t, l, a) {
    return Ca(), t.flags |= 256, ht(e, t, l, a), t.child;
  }
  var sf = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function cf(e) {
    return { baseLanes: e, cachePool: Gh() };
  }
  function ff(e, t, l) {
    return e = e !== null ? e.childLanes & ~l : 0, t && (e |= on), e;
  }
  function Kp(e, t, l) {
    var a = t.pendingProps, u = !1, s = (t.flags & 128) !== 0, m;
    if ((m = s) || (m = e !== null && e.memoizedState === null ? !1 : (Tt.current & 2) !== 0), m && (u = !0, t.flags &= -129), m = (t.flags & 32) !== 0, t.flags &= -33, e === null) {
      if (Ne) {
        if (u ? kl(t) : Bl(), (e = Ze) ? (e = by(
          e,
          yn
        ), e = e !== null && e.data !== "&" ? e : null, e !== null && (t.memoizedState = {
          dehydrated: e,
          treeContext: Ml !== null ? { id: Vn, overflow: Gn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, l = Oh(e), l.return = t, t.child = l, yt = t, Ze = null)) : e = null, e === null) throw Dl(t);
        return cd(e) ? t.lanes = 32 : t.lanes = 536870912, null;
      }
      return s = a.children, a = a.fallback, u ? (Bl(), u = t.mode, s = fu(
        { mode: "hidden", children: s },
        u
      ), a = xa(
        a,
        u,
        l,
        null
      ), s.return = t, a.return = t, s.sibling = a, t.child = s, a = t.child, a.memoizedState = cf(l), a.childLanes = ff(
        e,
        m,
        l
      ), t.memoizedState = sf, Ho(null, a)) : (kl(t), df(t, s));
    }
    var w = e.memoizedState;
    if (w !== null) {
      var z = w.dehydrated;
      if (z !== null)
        return QC(
          e,
          t,
          s,
          m,
          a,
          z,
          w,
          l
        );
    }
    return u ? (Bl(), u = a.fallback, s = t.mode, w = e.child, z = w.sibling, a = ol(w, {
      mode: "hidden",
      children: a.children
    }), a.subtreeFlags = w.subtreeFlags & 1206910976, z !== null ? u = ol(z, u) : (u = xa(
      u,
      s,
      l,
      null
    ), u.flags |= 2), u.return = t, a.return = t, a.sibling = u, t.child = a, Ho(null, a), a = t.child, u = e.child.memoizedState, u === null ? u = cf(l) : (s = u.cachePool, s !== null ? (w = st._currentValue, s = s.parent !== w ? { parent: w, pool: w } : s) : s = Gh(), u = {
      baseLanes: u.baseLanes | l,
      cachePool: s
    }), a.memoizedState = u, a.childLanes = ff(
      e,
      m,
      l
    ), t.memoizedState = sf, Ho(e.child, a)) : (kl(t), l = e.child, e = l.sibling, l = ol(l, {
      mode: "visible",
      children: a.children
    }), l.return = t, l.sibling = null, e !== null && (m = t.deletions, m === null ? (t.deletions = [e], t.flags |= 16) : m.push(e)), t.child = l, t.memoizedState = null, l);
  }
  function df(e, t) {
    return t = fu(
      { mode: "visible", children: t },
      e.mode
    ), t.return = e, e.child = t;
  }
  function fu(e, t) {
    return e = Pt(22, e, null, t), e.lanes = 0, e;
  }
  function du(e, t, l) {
    return Oa(t, e.child, null, l), e = df(
      t,
      t.pendingProps.children
    ), e.flags |= 2, t.memoizedState = null, e;
  }
  function QC(e, t, l, a, u, s, m, w) {
    if (l)
      return t.flags & 256 ? (kl(t), t.flags &= -257, du(
        e,
        t,
        w
      )) : t.memoizedState !== null ? (Bl(), t.child = e.child, t.flags |= 128, null) : (Bl(), s = u.fallback, m = t.mode, u = fu(
        { mode: "visible", children: u.children },
        m
      ), s = xa(
        s,
        m,
        w,
        null
      ), s.flags |= 2, u.return = t, s.return = t, u.sibling = s, t.child = u, Oa(t, e.child, null, w), u = t.child, u.memoizedState = cf(w), u.childLanes = ff(
        e,
        a,
        w
      ), t.memoizedState = sf, Ho(null, u));
    if (kl(t), cd(s)) {
      if (a = s.nextSibling && s.nextSibling.dataset, a) var z = a.dgst;
      return a = z, a !== "" && (u = Error(r(419)), u.stack = "", u.digest = a, wo({ value: u, source: null, stack: null })), du(
        e,
        t,
        w
      );
    }
    if (ft || Ea(e, t, w, !1), a = (w & e.childLanes) !== 0, ft || a) {
      if (Gl.current !== null)
        return du(
          e,
          t,
          w
        );
      if (a = Xe, a !== null && (u = Dm(
        a,
        w
      ), u !== 0 && u !== m.retryLane))
        throw m.retryLane = u, Sa(e, u), Ft(a, e, u), rf;
      return sd(s) || Ou(), du(
        e,
        t,
        w
      );
    }
    return sd(s) ? (t.flags |= 192, t.child = e.child, null) : (e = m.treeContext, Ze = Sn(s.nextSibling), yt = t, Ne = !0, Nl = null, yn = !1, e !== null && Dh(t, e), t = df(
      t,
      u.children
    ), t.flags |= 134221824, t);
  }
  function Jp(e, t, l) {
    e.lanes |= t;
    var a = e.alternate;
    a !== null && (a.lanes |= t), Ir(e.return, t, l);
  }
  function Wp(e) {
    for (var t = null; e !== null; ) {
      var l = e.alternate;
      l !== null && Wr(l) === null && (t = e), e = e.sibling;
    }
    return t;
  }
  function gu(e, t, l, a, u, s) {
    var m = e.memoizedState;
    m === null ? e.memoizedState = {
      isBackwards: t,
      rendering: null,
      renderingStartTime: 0,
      last: a,
      tail: l,
      tailMode: u,
      treeForkCount: s
    } : (m.isBackwards = t, m.rendering = null, m.renderingStartTime = 0, m.last = a, m.tail = l, m.tailMode = u, m.treeForkCount = s);
  }
  function gf(e) {
    var t = e.child;
    for (e.child = null; t !== null; ) {
      var l = t.sibling;
      t.sibling = e.child, e.child = t, t = l;
    }
  }
  function mf(e, t, l) {
    var a = t.pendingProps, u = a.revealOrder, s = a.tail;
    a = a.children;
    var m = Tt.current;
    if (t.flags & 128)
      return Mo(t, m), null;
    var w = (m & 2) !== 0;
    if (w ? (m = m & 1 | 2, t.flags |= 128) : m &= 1, Mo(t, m), u === "backwards" && e !== null ? (gf(e), ht(e, t, a, l), gf(e)) : ht(e, t, a, l), a = Ne ? Co : 0, !w && e !== null && (e.flags & 128) !== 0)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13)
          e.memoizedState !== null && Jp(e, l, t);
        else if (e.tag === 19)
          Jp(e, l, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t)
            break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    switch (u) {
      case "backwards":
        l = Wp(t.child), l === null ? (u = t.child, t.child = null) : (u = l.sibling, l.sibling = null, gf(t)), gu(
          t,
          !0,
          u,
          null,
          s,
          a
        );
        break;
      case "unstable_legacy-backwards":
        for (l = null, u = t.child, t.child = null; u !== null; ) {
          if (e = u.alternate, e !== null && Wr(e) === null) {
            t.child = u;
            break;
          }
          e = u.sibling, u.sibling = l, l = u, u = e;
        }
        gu(
          t,
          !0,
          l,
          null,
          s,
          a
        );
        break;
      case "together":
        gu(
          t,
          !1,
          null,
          null,
          void 0,
          a
        );
        break;
      case "independent":
        t.memoizedState = null;
        break;
      default:
        l = Wp(t.child), l === null ? (u = t.child, t.child = null) : (u = l.sibling, l.sibling = null), gu(
          t,
          !1,
          u,
          l,
          s,
          a
        );
    }
    return t.child;
  }
  function ev(e, t, l) {
    var a = t.pendingProps;
    return jl(t, t.type, a.value), ht(e, t, a.children, l), t.child;
  }
  function dl(e, t, l) {
    if (e !== null && (t.dependencies = e.dependencies), $l |= t.lanes, (l & t.childLanes) === 0)
      if (e !== null) {
        if (Ea(
          e,
          t,
          l,
          !1
        ), (l & t.childLanes) === 0)
          return null;
      } else return null;
    if (e !== null && t.child !== e.child)
      throw Error(r(153));
    if (t.child !== null) {
      for (e = t.child, l = ol(e, e.pendingProps), t.child = l, l.return = t; e.sibling !== null; )
        e = e.sibling, l = l.sibling = ol(e, e.pendingProps), l.return = t;
      l.sibling = null;
    }
    return t.child;
  }
  function hf(e, t) {
    return (e.lanes & t) !== 0 ? !0 : (e = e.dependencies, !!(e !== null && $r(e)));
  }
  function ZC(e, t, l) {
    switch (t.tag) {
      case 3:
        Ln(t, t.stateNode.containerInfo), jl(t, st, e.memoizedState.cache), Ca();
        break;
      case 27:
      case 5:
        Bs(t);
        break;
      case 4:
        Ln(t, t.stateNode.containerInfo);
        break;
      case 10:
        jl(
          t,
          t.type,
          t.memoizedProps.value
        );
        break;
      case 31:
        if (t.memoizedState !== null)
          return t.flags |= 128, Gc(t), null;
        break;
      case 13:
        var a = t.memoizedState;
        if (a !== null) {
          if (a.dehydrated !== null)
            return kl(t), t.flags |= 128, null;
          a = Ea(
            e,
            t,
            l,
            !1
          );
          var u = t.child.childLanes;
          return a || (l & u) !== 0 ? Kp(e, t, l) : (kl(t), e = dl(
            e,
            t,
            l
          ), e !== null ? e.sibling : null);
        }
        kl(t);
        break;
      case 19:
        if (t.flags & 128)
          return mf(
            e,
            t,
            l
          );
        if (u = (e.flags & 128) !== 0, a = (l & t.childLanes) !== 0, a || (Ea(
          e,
          t,
          l,
          !1
        ), a = (l & t.childLanes) !== 0), u) {
          if (a)
            return mf(
              e,
              t,
              l
            );
          t.flags |= 128;
        }
        if (u = t.memoizedState, u !== null && (u.rendering = null, u.tail = null, u.lastEffect = null), Mo(t, Tt.current), a) break;
        return null;
      case 22:
        return t.lanes = 0, $p(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        jl(t, st, e.memoizedState.cache);
    }
    return dl(e, t, l);
  }
  function tv(e, t, l) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps)
        ft = !0;
      else {
        if (!hf(e, l) && (t.flags & 128) === 0)
          return ft = !1, ZC(
            e,
            t,
            l
          );
        ft = (e.flags & 131072) !== 0;
      }
    else
      ft = !1, Ne && (t.flags & 1048576) !== 0 && Nh(t, Co, t.index);
    switch (t.lanes = 0, t.tag) {
      case 16:
        e: {
          var a = t.pendingProps;
          if (e = Aa(t.elementType), t.type = e, typeof e == "function")
            xc(e) ? (a = Na(e, a), t.tag = 1, t = Qp(
              null,
              t,
              e,
              a,
              l
            )) : (t.tag = 0, t = uf(
              null,
              t,
              e,
              a,
              l
            ));
          else {
            if (e != null) {
              var u = e.$$typeof;
              if (u === Z) {
                t.tag = 11, t = qp(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (u === me) {
                t.tag = 14, t = Pp(
                  null,
                  t,
                  e,
                  a,
                  l
                );
                break e;
              } else if (u === de) {
                t.tag = 10, t.type = e, t = ev(
                  null,
                  t,
                  l
                );
                break e;
              }
            }
            throw t = F(e) || e, Error(r(306, t, ""));
          }
        }
        return t;
      case 0:
        return uf(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 1:
        return a = t.type, u = Na(
          a,
          t.pendingProps
        ), Qp(
          e,
          t,
          a,
          u,
          l
        );
      case 3:
        e: {
          if (Ln(
            t,
            t.stateNode.containerInfo
          ), e === null) throw Error(r(387));
          a = t.pendingProps;
          var s = t.memoizedState;
          u = s.element, jc(e, t), Oo(t, a, null, l);
          var m = t.memoizedState;
          if (a = m.cache, jl(t, st, a), a !== s.cache && Ac(
            t,
            [st],
            l,
            !0
          ), zo(), a = m.element, s.isDehydrated)
            if (s = {
              element: a,
              isDehydrated: !1,
              cache: m.cache
            }, t.updateQueue.baseState = s, t.memoizedState = s, t.flags & 256) {
              t = Zp(
                e,
                t,
                a,
                l
              );
              break e;
            } else if (a !== u) {
              u = hn(
                Error(r(424)),
                t
              ), wo(u), t = Zp(
                e,
                t,
                a,
                l
              );
              break e;
            } else
              for (e = t.stateNode.containerInfo, e.nodeType === 9 ? e = e.body : e = e.nodeName === "HTML" ? e.ownerDocument.body : e, Ze = Sn(e.firstChild), yt = t, Ne = !0, Nl = null, yn = !0, l = $h(
                t,
                null,
                a,
                l
              ), t.child = l; l; )
                l.flags = l.flags & -3 | 134221824, l = l.sibling;
          else {
            if (Ca(), a === u) {
              t = dl(
                e,
                t,
                l
              );
              break e;
            }
            ht(e, t, a, l);
          }
          t = t.child;
        }
        return t;
      case 26:
        return xi(e, t), e === null ? (l = _y(
          t.type,
          null,
          t.pendingProps,
          null
        )) ? t.memoizedState = l : Ne || (t.stateNode = iy(
          t.type,
          t.pendingProps,
          X.current,
          t
        )) : t.memoizedState = _y(
          t.type,
          e.memoizedProps,
          t.pendingProps,
          e.memoizedState
        ), null;
      case 27:
        return Bs(t), e === null && Ne && (a = t.stateNode = Cy(
          t.type,
          t.pendingProps,
          X.current
        ), yt = t, yn = !0, u = Ze, Ql(t.type) ? (fd = u, Ze = Sn(a.firstChild)) : Ze = u), ht(
          e,
          t,
          t.pendingProps.children,
          l
        ), xi(e, t), e === null && (t.flags |= 4194304), t.child;
      case 5:
        return e === null && Ne && ((u = a = Ze) && (a = Iw(
          a,
          t.type,
          t.pendingProps,
          yn
        ), a !== null ? (t.stateNode = a, yt = t, Ze = Sn(a.firstChild), yn = !1, u = !0) : u = !1), u || Dl(t)), Bs(t), u = t.type, s = t.pendingProps, m = e !== null ? e.memoizedProps : null, a = s.children, nd(u, s) ? a = null : m !== null && nd(u, m) && (t.flags |= 32), t.memoizedState !== null && (u = qc(
          e,
          t,
          GC,
          null,
          null,
          l
        ), Gi._currentValue = u), xi(e, t), ht(e, t, a, l), t.child;
      case 6:
        return e === null && Ne && ((e = l = Ze) && (l = $w(
          l,
          t.pendingProps,
          yn
        ), l !== null ? (t.stateNode = l, yt = t, Ze = null, e = !0) : e = !1), e || Dl(t)), null;
      case 13:
        return Kp(e, t, l);
      case 4:
        return Ln(
          t,
          t.stateNode.containerInfo
        ), a = t.pendingProps, e === null ? t.child = Oa(
          t,
          null,
          a,
          l
        ) : ht(e, t, a, l), t.child;
      case 11:
        return qp(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 7:
        return a = t.pendingProps, xi(e, t), ht(e, t, a, l), t.child;
      case 8:
        return ht(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 12:
        return ht(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 10:
        return ev(e, t, l);
      case 9:
        return u = t.type._context, a = t.pendingProps.children, Ra(t), u = Rt(u), a = a(u), t.flags |= 1, ht(e, t, a, l), t.child;
      case 14:
        return Pp(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 15:
        return Ip(
          e,
          t,
          t.type,
          t.pendingProps,
          l
        );
      case 19:
        return mf(e, t, l);
      case 31:
        return XC(e, t, l);
      case 22:
        return $p(
          e,
          t,
          l,
          t.pendingProps
        );
      case 24:
        return Ra(t), a = Rt(st), e === null ? (u = Mc(), u === null && (u = Xe, s = zc(), u.pooledCache = s, s.refCount++, s !== null && (u.pooledCacheLanes |= l), u = s), t.memoizedState = { parent: a, cache: u }, Dc(t), jl(t, st, u)) : ((e.lanes & l) !== 0 && (jc(e, t), Oo(t, null, null, l), zo()), u = e.memoizedState, s = t.memoizedState, u.parent !== a ? (u = { parent: a, cache: a }, t.memoizedState = u, t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u), jl(t, st, a)) : (a = s.cache, jl(t, st, a), a !== u.cache && Ac(
          t,
          [st],
          l,
          !0
        ))), ht(
          e,
          t,
          t.pendingProps.children,
          l
        ), t.child;
      case 30:
        return t.stateNode === null && (t.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), a = t.pendingProps, a.name != null && a.name !== "auto" ? t.flags |= e === null ? 18882560 : 18874368 : Ne && qr(t), e !== null && e.memoizedProps.name !== a.name ? t.flags |= 4194816 : xi(e, t), ht(e, t, a.children, l), t.child;
      case 29:
        throw t.pendingProps;
    }
    throw Error(r(156, t.tag));
  }
  function gl(e) {
    e.flags |= 4;
  }
  function pf(e, t, l, a, u) {
    var s;
    if ((s = (e.mode & 32) !== 0) && (s = l === null ? Oy(t, a) : Oy(t, a) && (a.src !== l.src || a.srcSet !== l.srcSet)), s) {
      if (e.flags |= 16777216, (u & 335544128) === u)
        if (e.stateNode.complete) e.flags |= 8192;
        else if (Lv()) e.flags |= 8192;
        else
          throw za = Qr, Nc;
    } else e.flags &= -16777217;
  }
  function nv(e, t) {
    if (t.type !== "stylesheet" || (t.state.loading & 4) !== 0)
      e.flags &= -16777217;
    else if (e.flags |= 16777216, !My(t))
      if (Lv()) e.flags |= 8192;
      else
        throw za = Qr, Nc;
  }
  function mu(e, t) {
    t !== null && (e.flags |= 4), e.flags & 16384 && (t = e.tag !== 22 ? Om() : 536870912, e.lanes |= t, _i |= t);
  }
  function Lo(e, t) {
    if (!Ne)
      switch (e.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var l = e.tail, a = null; l !== null; )
            l.alternate !== null && (a = l), l = l.sibling;
          a === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : a.sibling = null;
          break;
        default:
          for (t = e.tail, l = null; t !== null; )
            t.alternate !== null && (l = t), t = t.sibling;
          l === null ? e.tail = null : l.sibling = null;
      }
  }
  function Ke(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, l = 0, a = 0;
    if (t)
      for (var u = e.child; u !== null; )
        l |= u.lanes | u.childLanes, a |= u.subtreeFlags & 1206910976, a |= u.flags & 1206910976, u.return = e, u = u.sibling;
    else
      for (u = e.child; u !== null; )
        l |= u.lanes | u.childLanes, a |= u.subtreeFlags, a |= u.flags, u.return = e, u = u.sibling;
    return e.subtreeFlags |= a, e.childLanes = l, t;
  }
  function KC(e, t, l) {
    var a = t.pendingProps;
    switch (Ec(t), t.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Ke(t), null;
      case 1:
        return Ke(t), null;
      case 3:
        return l = t.stateNode, a = null, e !== null && (a = e.memoizedState.cache), t.memoizedState.cache !== a && (t.flags |= 2048), sl(st), Ja(), l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), (e === null || e.child === null) && (mi(t) ? gl(t) : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, _c())), Ke(t), null;
      case 26:
        var u = t.type, s = t.memoizedState;
        return e === null ? (gl(t), s !== null ? (Ke(t), nv(t, s)) : (Ke(t), pf(
          t,
          u,
          null,
          a,
          l
        ))) : s ? s !== e.memoizedState ? (gl(t), Ke(t), nv(t, s)) : (Ke(t), t.flags &= -16777217) : (e = e.memoizedProps, e !== a && gl(t), Ke(t), pf(
          t,
          u,
          e,
          a,
          l
        )), null;
      case 27:
        if (br(t), l = X.current, u = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && gl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return Ke(t), t.subtreeFlags &= -33554433, null;
          }
          e = Mt.current, mi(t) ? jh(t) : (e = Cy(u, a, l), t.stateNode = e, gl(t));
        }
        return Ke(t), t.subtreeFlags &= -33554433, null;
      case 5:
        if (br(t), u = t.type, e !== null && t.stateNode != null)
          e.memoizedProps !== a && gl(t);
        else {
          if (!a) {
            if (t.stateNode === null)
              throw Error(r(166));
            return Ke(t), t.subtreeFlags &= -33554433, null;
          }
          if (s = Mt.current, mi(t))
            jh(t);
          else {
            var m = Fo(
              X.current
            );
            switch (s) {
              case 1:
                s = m.createElementNS(
                  "http://www.w3.org/2000/svg",
                  u
                );
                break;
              case 2:
                s = m.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  u
                );
                break;
              default:
                switch (u) {
                  case "svg":
                    s = m.createElementNS(
                      "http://www.w3.org/2000/svg",
                      u
                    );
                    break;
                  case "math":
                    s = m.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      u
                    );
                    break;
                  case "script":
                    s = m.createElement("div"), s.innerHTML = "<script><\/script>", s = s.removeChild(
                      s.firstChild
                    );
                    break;
                  case "select":
                    s = typeof a.is == "string" ? m.createElement("select", {
                      is: a.is
                    }) : m.createElement("select"), a.multiple ? s.multiple = !0 : a.size && (s.size = a.size);
                    break;
                  default:
                    s = typeof a.is == "string" ? m.createElement(u, { is: a.is }) : m.createElement(u);
                }
            }
            s[Et] = t, s[qt] = a;
            e: for (m = t.child; m !== null; ) {
              if (m.tag === 5 || m.tag === 6)
                s.appendChild(m.stateNode);
              else if (m.tag !== 4 && m.tag !== 27 && m.child !== null) {
                m.child.return = m, m = m.child;
                continue;
              }
              if (m === t) break e;
              for (; m.sibling === null; ) {
                if (m.return === null || m.return === t)
                  break e;
                m = m.return;
              }
              m.sibling.return = m.return, m = m.sibling;
            }
            t.stateNode = s;
            e: switch (zt(s, u, a), u) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                a = !!a.autoFocus;
                break e;
              case "img":
                a = !0;
                break e;
              default:
                a = !1;
            }
            a && gl(t);
          }
        }
        return Ke(t), t.subtreeFlags &= -33554433, pf(
          t,
          t.type,
          e === null ? null : e.memoizedProps,
          t.pendingProps,
          l
        ), null;
      case 6:
        if (e && t.stateNode != null)
          e.memoizedProps !== a && gl(t);
        else {
          if (typeof a != "string" && t.stateNode === null)
            throw Error(r(166));
          if (e = X.current, mi(t)) {
            if (e = t.stateNode, l = t.memoizedProps, a = null, u = yt, u !== null)
              switch (u.tag) {
                case 27:
                case 5:
                  a = u.memoizedProps;
              }
            e[Et] = t, e = !!(e.nodeValue === l || a !== null && a.suppressHydrationWarning === !0 || ty(e.nodeValue, l)), e || Dl(t, !0);
          } else
            e = Fo(e).createTextNode(
              a
            ), e[Et] = t, t.stateNode = e;
        }
        return Ke(t), null;
      case 31:
        if (l = t.memoizedState, e === null || e.memoizedState !== null) {
          if (a = mi(t), l !== null) {
            if (e === null) {
              if (!a) throw Error(r(318));
              if (e = t.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(r(557));
              e[Et] = t;
            } else
              Ca(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ke(t), e = !1;
          } else
            l = _c(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = l), e = !0;
          if (!e)
            return t.flags & 256 ? (nn(t), t) : (nn(t), null);
          if ((t.flags & 128) !== 0)
            throw Error(r(558));
        }
        return Ke(t), null;
      case 13:
        if (a = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (u = mi(t), a !== null && a.dehydrated !== null) {
            if (e === null) {
              if (!u) throw Error(r(318));
              if (u = t.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(r(317));
              u[Et] = t;
            } else
              Ca(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Ke(t), u = !1;
          } else
            u = _c(), e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = u), u = !0;
          if (!u)
            return t.flags & 256 ? (nn(t), t) : (nn(t), null);
        }
        return nn(t), (t.flags & 128) !== 0 ? (t.lanes = l, t) : (l = a !== null, e = e !== null && e.memoizedState !== null, l && (a = t.child, u = null, a.alternate !== null && a.alternate.memoizedState !== null && a.alternate.memoizedState.cachePool !== null && (u = a.alternate.memoizedState.cachePool.pool), s = null, a.memoizedState !== null && a.memoizedState.cachePool !== null && (s = a.memoizedState.cachePool.pool), s !== u && (a.flags |= 2048)), l !== e && l && (t.child.flags |= 8192), mu(t, t.updateQueue), Ke(t), null);
      case 4:
        return Ja(), e === null && Kf(t.stateNode.containerInfo), t.flags |= 67108864, Ke(t), null;
      case 10:
        return sl(t.type), Ke(t), null;
      case 19:
        if (kc(t), a = t.memoizedState, a === null) return Ke(t), null;
        if (u = (t.flags & 128) !== 0, s = a.rendering, s === null)
          if (u) Lo(a, !1);
          else {
            if (at !== 0 || e !== null && (e.flags & 128) !== 0)
              for (e = t.child; e !== null; ) {
                if (s = Wr(e), s !== null) {
                  for (t.flags |= 128, Lo(a, !1), e = s.updateQueue, t.updateQueue = e, mu(t, e), t.subtreeFlags = 0, e = l, l = t.child; l !== null; )
                    zh(l, e), l = l.sibling;
                  return Mo(
                    t,
                    Tt.current & 1 | 2
                  ), Ne && rl(t, a.treeForkCount), t.child;
                }
                e = e.sibling;
              }
            a.tail !== null && Kt() > _u && (t.flags |= 128, u = !0, Lo(a, !1), t.lanes = 4194304);
          }
        else {
          if (!u)
            if (e = Wr(s), e !== null) {
              if (t.flags |= 128, u = !0, e = e.updateQueue, t.updateQueue = e, mu(t, e), Lo(a, !0), a.tail === null && a.tailMode !== "collapsed" && a.tailMode !== "visible" && !s.alternate && !Ne)
                return Ke(t), null;
            } else
              2 * Kt() - a.renderingStartTime > _u && l !== 536870912 && (t.flags |= 128, u = !0, Lo(a, !1), t.lanes = 4194304);
          a.isBackwards ? (s.sibling = t.child, t.child = s) : (e = a.last, e !== null ? e.sibling = s : t.child = s, a.last = s);
        }
        if (a.tail !== null) {
          e = a.tail;
          e: {
            for (l = e; l !== null; ) {
              if (l.alternate !== null) {
                l = !1;
                break e;
              }
              l = l.sibling;
            }
            l = !0;
          }
          return a.rendering = e, a.tail = e.sibling, a.renderingStartTime = Kt(), e.sibling = null, s = Tt.current, s = u ? s & 1 | 2 : s & 1, a.tailMode === "visible" || a.tailMode === "collapsed" || !l || Ne ? Mo(t, s) : (l = s, Re(_t, t), Re(Tt, l), Nt === null && (Nt = t)), Ne && rl(t, a.treeForkCount), e;
        }
        return Ke(t), null;
      case 22:
      case 23:
        return nn(t), Vc(), a = t.memoizedState !== null, e !== null ? e.memoizedState !== null !== a && (t.flags |= 8192) : a && (t.flags |= 8192), a ? (l & 536870912) !== 0 && (t.flags & 128) === 0 && (Ke(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Ke(t), l = t.updateQueue, l !== null && mu(t, l.retryQueue), l = null, e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), a = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), a !== l && (t.flags |= 2048), e !== null && Je(Ta), null;
      case 24:
        return l = null, e !== null && (l = e.memoizedState.cache), t.memoizedState.cache !== l && (t.flags |= 2048), sl(st), Ke(t), null;
      case 25:
        return null;
      case 30:
        return t.flags |= 33554432, Ke(t), null;
    }
    throw Error(r(156, t.tag));
  }
  function JC(e, t) {
    switch (Ec(t), t.tag) {
      case 1:
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return sl(st), Ja(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 26:
      case 27:
      case 5:
        return br(t), null;
      case 31:
        if (t.memoizedState !== null) {
          if (nn(t), t.alternate === null)
            throw Error(r(340));
          Ca();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 13:
        if (nn(t), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null)
            throw Error(r(340));
          Ca();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return kc(t), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, e = t.memoizedState, e !== null && (e.rendering = null, e.tail = null), t.flags |= 4, t) : null;
      case 4:
        return Ja(), null;
      case 10:
        return sl(t.type), null;
      case 22:
      case 23:
        return nn(t), Vc(), e !== null && Je(Ta), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 24:
        return sl(st), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function lv(e, t) {
    switch (Ec(t), t.tag) {
      case 3:
        sl(st), Ja();
        break;
      case 26:
      case 27:
      case 5:
        br(t);
        break;
      case 4:
        Ja();
        break;
      case 31:
        t.memoizedState !== null && nn(t);
        break;
      case 13:
        nn(t);
        break;
      case 19:
        kc(t);
        break;
      case 10:
        sl(t.type);
        break;
      case 22:
      case 23:
        nn(t), Vc(), e !== null && Je(Ta);
        break;
      case 24:
        sl(st);
    }
  }
  function Uo(e, t) {
    try {
      var l = t.updateQueue, a = l !== null ? l.lastEffect : null;
      if (a !== null) {
        var u = a.next;
        l = u;
        do {
          if ((l.tag & e) === e) {
            a = void 0;
            var s = l.create, m = l.inst;
            a = s(), m.destroy = a;
          }
          l = l.next;
        } while (l !== u);
      }
    } catch (w) {
      Pe(t, t.return, w);
    }
  }
  function ql(e, t, l) {
    try {
      var a = t.updateQueue, u = a !== null ? a.lastEffect : null;
      if (u !== null) {
        var s = u.next;
        a = s;
        do {
          if ((a.tag & e) === e) {
            var m = a.inst, w = m.destroy;
            if (w !== void 0) {
              m.destroy = void 0, u = t;
              var z = l, k = w;
              try {
                k();
              } catch (Y) {
                Pe(
                  u,
                  z,
                  Y
                );
              }
            }
          }
          a = a.next;
        } while (a !== s);
      }
    } catch (Y) {
      Pe(t, t.return, Y);
    }
  }
  function av(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var l = e.stateNode;
      try {
        Fh(t, l);
      } catch (a) {
        Pe(e, e.return, a);
      }
    }
  }
  function iv(e, t, l) {
    l.props = Na(
      e.type,
      e.memoizedProps
    ), l.state = e.memoizedState;
    try {
      l.componentWillUnmount();
    } catch (a) {
      Pe(e, t, a);
    }
  }
  function kn(e, t) {
    try {
      var l = e.ref;
      if (l !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var a = e.stateNode;
            break;
          case 30:
            var u = e.stateNode, s = al(e.memoizedProps, u);
            (u.ref === null || u.ref.name !== s) && (u.ref = dy(s)), a = u.ref;
            break;
          case 7:
            if (e.stateNode === null) {
              var m = new un(e);
              p(
                e.child,
                !1,
                qw,
                m,
                void 0,
                void 0
              ), e.stateNode = m;
            }
            a = e.stateNode;
            break;
          default:
            a = e.stateNode;
        }
        typeof l == "function" ? e.refCleanup = l(a) : l.current = a;
      }
    } catch (w) {
      Pe(e, t, w);
    }
  }
  function At(e, t) {
    var l = e.ref, a = e.refCleanup;
    if (l !== null)
      if (typeof a == "function")
        try {
          a();
        } catch (u) {
          Pe(e, t, u);
        } finally {
          e.refCleanup = null, e = e.alternate, e != null && (e.refCleanup = null);
        }
      else if (typeof l == "function")
        try {
          l(null);
        } catch (u) {
          Pe(e, t, u);
        }
      else l.current = null;
  }
  function hu(e, t) {
    if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null)
      for (var l = 0; l < t.length; l++)
        yy(
          e.stateNode,
          t[l]
        );
  }
  function ov(e) {
    for (var t = e.return; t !== null && (yf(t) && yy(e.stateNode, t.stateNode), !vf(t)); )
      t = t.return;
  }
  function Vo(e) {
    for (var t = e.return; t !== null && (yf(t) && Pw(e.stateNode, t.stateNode), !vf(t)); )
      t = t.return;
  }
  function vf(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 27;
  }
  function yf(e) {
    return e && e.tag === 7 && e.stateNode !== null;
  }
  function bf(e) {
    var t = e.type, l = e.memoizedProps, a = e.stateNode;
    try {
      e: switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          l.autoFocus && a.focus();
          break e;
        case "img":
          l.src ? a.src = l.src : l.srcSet && (a.srcset = l.srcSet);
      }
    } catch (u) {
      Pe(e, e.return, u);
    }
  }
  function Sf(e, t, l) {
    try {
      var a = e.stateNode;
      Ew(a, e.type, l, t), a[qt] = t;
    } catch (u) {
      Pe(e, e.return, u);
    }
  }
  function rv(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 26 || e.tag === 27 && Ql(e.type) || e.tag === 4;
  }
  function xf(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || rv(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.tag === 27 && Ql(e.type) || e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Cf(e, t, l, a) {
    var u = e.tag;
    if (u === 5 || u === 6)
      u = e.stateNode, t ? (l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l).insertBefore(u, t) : (t = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, t.appendChild(u), l = l._reactRootContainer, l != null || t.onclick !== null || (t.onclick = Un)), hu(e, a), Ge = !0;
    else if (u !== 4 && (u === 27 && (hu(e, a), a = null, Ql(e.type) && (l = e.stateNode, t = null)), e = e.child, e !== null))
      for (Cf(
        e,
        t,
        l,
        a
      ), e = e.sibling; e !== null; )
        Cf(
          e,
          t,
          l,
          a
        ), e = e.sibling;
  }
  function pu(e, t, l, a) {
    var u = e.tag;
    if (u === 5 || u === 6)
      u = e.stateNode, t ? l.insertBefore(u, t) : l.appendChild(u), hu(e, a), Ge = !0;
    else if (u !== 4 && (u === 27 && (hu(e, a), a = null, Ql(e.type) && (l = e.stateNode)), e = e.child, e !== null))
      for (pu(
        e,
        t,
        l,
        a
      ), e = e.sibling; e !== null; )
        pu(
          e,
          t,
          l,
          a
        ), e = e.sibling;
  }
  function uv(e) {
    var t = e.stateNode, l = e.memoizedProps;
    try {
      for (var a = e.type, u = t.attributes; u.length; )
        t.removeAttributeNode(u[0]);
      zt(t, a, l), t[Et] = e, t[qt] = l;
    } catch (s) {
      Pe(e, e.return, s);
    }
  }
  var vu = !1, ln = null;
  function sv(e) {
    (e.tag === 30 || (e.subtreeFlags & 33554432) !== 0) && (vu = !0);
  }
  var Bn = null;
  function cv() {
    var e = Bn;
    return Bn = null, e;
  }
  var It = 0;
  function Ci(e, t, l, a, u) {
    return It = 0, fv(
      e.child,
      t,
      l,
      a,
      u
    );
  }
  function fv(e, t, l, a, u) {
    for (var s = !1; e !== null; ) {
      if (e.tag === 5) {
        var m = e.stateNode;
        if (a !== null) {
          var w = id(m);
          a.push(w), w.view && (s = !0);
        } else
          s || id(m).view && (s = !0);
        vu = !0, cy(
          m,
          It === 0 ? t : t + "_" + It,
          l
        ), It++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && u || fv(
        e.child,
        t,
        l,
        a,
        u
      ) && (s = !0));
      e = e.sibling;
    }
    return s;
  }
  function qn(e, t) {
    for (; e !== null; )
      e.tag === 5 ? fy(e.stateNode, e.memoizedProps) : (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && t || qn(
        e.child,
        t
      )), e = e.sibling;
  }
  function yu(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if ((e.tag !== 22 || e.memoizedState === null) && (yu(e), e.tag === 30 && (e.flags & 18874368) !== 0 && e.stateNode.paired)) {
          var t = e.memoizedProps;
          if (t.name == null || t.name === "auto")
            throw Error(r(544));
          var l = t.name;
          t = il(t.default, t.share), t !== "none" && (Ci(
            e,
            l,
            t,
            null,
            !1
          ) || qn(e.child, !1));
        }
        e = e.sibling;
      }
  }
  function wf(e, t) {
    if (e.tag === 30) {
      var l = e.stateNode, a = e.memoizedProps, u = al(a, l), s = il(
        a.default,
        l.paired ? a.share : a.enter
      );
      s !== "none" ? Ci(e, u, s, null, !1) ? (yu(e), l.paired || t || Oi(e, a.onEnter)) : qn(e.child, !1) : yu(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        wf(e, t), e = e.sibling;
    else yu(e);
  }
  function Ef(e) {
    if (ln !== null && ln.size !== 0) {
      var t = ln;
      if ((e.subtreeFlags & 18874368) !== 0)
        for (e = e.child; e !== null; ) {
          if (e.tag !== 22 || e.memoizedState === null) {
            if (e.tag === 30 && (e.flags & 18874368) !== 0) {
              var l = e.memoizedProps, a = l.name;
              if (a != null && a !== "auto") {
                var u = t.get(a);
                if (u !== void 0) {
                  var s = il(
                    l.default,
                    l.share
                  );
                  if (s !== "none" && (Ci(
                    e,
                    a,
                    s,
                    null,
                    !1
                  ) ? (s = e.stateNode, u.paired = s, s.paired = u, Oi(e, l.onShare)) : qn(e.child, !1)), t.delete(a), t.size === 0) break;
                }
              }
            }
            Ef(e);
          }
          e = e.sibling;
        }
    }
  }
  function Rf(e) {
    if (e.tag === 30) {
      var t = e.memoizedProps, l = al(t, e.stateNode), a = ln !== null ? ln.get(l) : void 0, u = il(
        t.default,
        a !== void 0 ? t.share : t.exit
      );
      u !== "none" && (Ci(e, l, u, null, !1) ? a !== void 0 ? (u = e.stateNode, a.paired = u, u.paired = a, ln.delete(l), Oi(e, t.onShare)) : Oi(e, t.onExit) : qn(e.child, !1)), ln !== null && Ef(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        Rf(e), e = e.sibling;
    else
      ln !== null && Ef(e);
  }
  function dv(e) {
    for (e = e.child; e !== null; ) {
      if (e.tag === 30) {
        var t = e.memoizedProps, l = al(t, e.stateNode);
        t = il(t.default, t.update), e.flags &= -5, t !== "none" && Ci(
          e,
          l,
          t,
          e.memoizedState = [],
          !1
        );
      } else
        (e.subtreeFlags & 33554432) !== 0 && dv(e);
      e = e.sibling;
    }
  }
  function _f(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null; ) {
        if (e.tag !== 22 || e.memoizedState === null) {
          if (e.tag === 30 && (e.flags & 18874368) !== 0) {
            var t = e.stateNode;
            t.paired !== null && (t.paired = null, qn(e.child, !1));
          }
          _f(e);
        }
        e = e.sibling;
      }
  }
  function bu(e) {
    if (e.tag === 30)
      e.stateNode.paired = null, qn(e.child, !1), _f(e);
    else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null; )
        bu(e), e = e.sibling;
    else _f(e);
  }
  function gv(e) {
    for (e = e.child; e !== null; )
      e.tag === 30 ? qn(e.child, !1) : (e.subtreeFlags & 33554432) !== 0 && gv(e), e = e.sibling;
  }
  function Tf(e, t, l, a, u, s, m) {
    for (var w = !1; t !== null; ) {
      if (t.tag === 5) {
        var z = t.stateNode;
        if (s !== null && It < s.length) {
          var k = s[It], Y = id(z);
          (k.view || Y.view) && (w = !0);
          var ee;
          if (ee = (e.flags & 4) === 0)
            if (Y.clip) ee = !0;
            else {
              ee = k.rect;
              var L = Y.rect;
              ee = ee.y !== L.y || ee.x !== L.x || ee.height !== L.height || ee.width !== L.width;
            }
          ee && (e.flags |= 4), Y.abs ? Y = !k.abs : (k = k.rect, Y = Y.rect, Y = k.height !== Y.height || k.width !== Y.width), Y && (e.flags |= 32);
        } else e.flags |= 32;
        (e.flags & 4) !== 0 && cy(
          z,
          It === 0 ? l : l + "_" + It,
          u
        ), w && (e.flags & 4) !== 0 || (Bn === null && (Bn = []), Bn.push(
          z,
          It === 0 ? a : a + "_" + It,
          t.memoizedProps
        )), It++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && m ? e.flags |= t.flags & 32 : Tf(
        e,
        t.child,
        l,
        a,
        u,
        s,
        m
      ) && (w = !0));
      t = t.sibling;
    }
    return w;
  }
  function mv(e, t) {
    for (e = e.child; e !== null; ) {
      if (e.tag === 30) {
        var l = e.memoizedProps, a = e.stateNode, u = al(l, a), s = il(l.default, l.update), m;
        m = e.memoizedState, e.memoizedState = null, a = e;
        var w = e.child;
        It = 0, u = Tf(
          a,
          w,
          u,
          u,
          s,
          m,
          !1
        ), (e.flags & 4) !== 0 && u && Oi(e, l.onUpdate);
      } else
        (e.subtreeFlags & 33554432) !== 0 && mv(e);
      e = e.sibling;
    }
  }
  var bt = !1, Be = !1, Pn = !1, Af = !1, hv = typeof WeakSet == "function" ? WeakSet : Set, St = null, In = !1, Go = !1, Su = !1, zf = !1;
  function WC(e, t, l) {
    if (e = e.containerInfo, ed = ki, e = bh(e), mc(e)) {
      if ("selectionStart" in e)
        var a = {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      else
        e: {
          a = (a = e.ownerDocument) && a.defaultView || window;
          var u = a.getSelection && a.getSelection();
          if (u && u.rangeCount !== 0) {
            a = u.anchorNode;
            var s = u.anchorOffset, m = u.focusNode;
            u = u.focusOffset;
            try {
              a.nodeType, m.nodeType;
            } catch {
              a = null;
              break e;
            }
            var w = 0, z = -1, k = -1, Y = 0, ee = 0, L = e, I = null;
            t: for (; ; ) {
              for (var fe; L !== a || s !== 0 && L.nodeType !== 3 || (z = w + s), L !== m || u !== 0 && L.nodeType !== 3 || (k = w + u), L.nodeType === 3 && (w += L.nodeValue.length), (fe = L.firstChild) !== null; )
                I = L, L = fe;
              for (; ; ) {
                if (L === e) break t;
                if (I === a && ++Y === s && (z = w), I === m && ++ee === u && (k = w), (fe = L.nextSibling) !== null) break;
                L = I, I = L.parentNode;
              }
              L = fe;
            }
            a = z === -1 || k === -1 ? null : { start: z, end: k };
          } else a = null;
        }
      a = a || { start: 0, end: 0 };
    } else a = null;
    for (td = { focusedElem: e, selectionRange: a }, ki = !1, l = (l & 335544064) === l, St = t, t = l ? 9270 : 1024; St !== null; ) {
      if (e = St, l && (a = e.deletions, a !== null))
        for (s = 0; s < a.length; s++)
          l && Rf(a[s]);
      if (e.alternate === null && (e.flags & 2) !== 0)
        l && sv(e), xu(l);
      else {
        if (e.tag === 22) {
          if (a = e.alternate, e.memoizedState !== null) {
            a !== null && a.memoizedState === null && l && Rf(a), xu(l);
            continue;
          } else if (a !== null && a.memoizedState !== null) {
            l && sv(e), xu(l);
            continue;
          }
        }
        a = e.child, (e.subtreeFlags & t) !== 0 && a !== null ? (a.return = e, St = a) : (l && dv(e), xu(l));
      }
    }
    ln = null;
  }
  function xu(e) {
    for (; St !== null; ) {
      var t = St, l = e, a = t.alternate, u = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((u & 1024) !== 0 && a !== null) {
            l = void 0, u = a.memoizedProps, a = a.memoizedState;
            var s = t.stateNode;
            try {
              var m = Na(
                t.type,
                u
              );
              l = s.getSnapshotBeforeUpdate(
                m,
                a
              ), s.__reactInternalSnapshotBeforeUpdate = l;
            } catch (w) {
              Pe(t, t.return, w);
            }
          }
          break;
        case 3:
          if ((u & 1024) !== 0) {
            if (a = t.stateNode.containerInfo, l = a.nodeType, l === 9)
              ud(a);
            else if (l === 1)
              switch (a.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  ud(a);
                  break;
                default:
                  a.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          l && a !== null && (l = al(
            a.memoizedProps,
            a.stateNode
          ), u = t.memoizedProps, u = il(u.default, u.update), u !== "none" && Ci(
            a,
            l,
            u,
            a.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((u & 1024) !== 0) throw Error(r(163));
      }
      if (a = t.sibling, a !== null) {
        a.return = t.return, St = a;
        break;
      }
      St = t.return;
    }
  }
  function pv(e, t, l) {
    var a = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        $n(e, l), a & 4 && Uo(5, l);
        break;
      case 1:
        if ($n(e, l), a & 4)
          if (e = l.stateNode, t === null)
            try {
              e.componentDidMount();
            } catch (m) {
              Pe(l, l.return, m);
            }
          else {
            var u = Na(
              l.type,
              t.memoizedProps
            );
            t = t.memoizedState;
            try {
              e.componentDidUpdate(
                u,
                t,
                e.__reactInternalSnapshotBeforeUpdate
              );
            } catch (m) {
              Pe(
                l,
                l.return,
                m
              );
            }
          }
        a & 64 && av(l), a & 512 && kn(l, l.return);
        break;
      case 3:
        if ($n(e, l), a & 64 && (e = l.updateQueue, e !== null)) {
          if (t = null, l.child !== null)
            switch (l.child.tag) {
              case 27:
              case 5:
                t = l.child.stateNode;
                break;
              case 1:
                t = l.child.stateNode;
            }
          try {
            Fh(e, t);
          } catch (m) {
            Pe(l, l.return, m);
          }
        }
        break;
      case 27:
        t === null && a & 4 && uv(l);
      case 26:
      case 5:
        $n(e, l), t === null && a & 4 && bf(l), a & 512 && kn(l, l.return);
        break;
      case 12:
        $n(e, l);
        break;
      case 31:
        $n(e, l), a & 4 && Sv(e, l);
        break;
      case 13:
        $n(e, l), a & 4 && xv(e, l), a & 64 && (e = l.memoizedState, e !== null && (e = e.dehydrated, e !== null && (l = fw.bind(
          null,
          l
        ), Yw(e, l))));
        break;
      case 22:
        if (a = l.memoizedState !== null || bt, !a) {
          var s = t !== null && t.memoizedState !== null || Be;
          t = bt, u = Be, bt = a, (Be = s) && !u ? (a = 2, (l.subtreeFlags & 8772) !== 0 && (a |= 1), zn(
            e,
            l,
            a
          )) : $n(e, l), bt = t, Be = u;
        }
        break;
      case 30:
        $n(e, l), a & 512 && kn(l, l.return);
        break;
      case 7:
        a & 512 && kn(l, l.return);
      default:
        $n(e, l);
    }
  }
  function Of(e, t) {
    for (e = e.child; e !== null; )
      vv(e, t), e = e.sibling;
  }
  function vv(e, t) {
    switch (e.tag) {
      case 5:
      case 26:
        try {
          var l = e.stateNode;
          if (t) {
            var a = l.style;
            typeof a.setProperty == "function" ? a.setProperty("display", "none", "important") : a.display = "none";
          } else {
            var u = e.stateNode, s = e.memoizedProps.style, m = s != null && s.hasOwnProperty("display") ? s.display : null;
            u.style.display = m == null || typeof m == "boolean" ? "" : ("" + m).trim();
          }
        } catch (z) {
          Pe(e, e.return, z);
        }
        Mf(e, t);
        break;
      case 6:
        try {
          e.stateNode.nodeValue = t ? "" : e.memoizedProps, Ge = !0;
        } catch (z) {
          Pe(e, e.return, z);
        }
        break;
      case 18:
        try {
          var w = e.stateNode;
          t ? sy(w, !0) : sy(e.stateNode, !1);
        } catch (z) {
          Pe(e, e.return, z);
        }
        break;
      case 22:
      case 23:
        e.memoizedState === null && Of(e, t);
        break;
      default:
        Of(e, t);
    }
  }
  function Mf(e, t) {
    if (e.subtreeFlags & 67108864)
      for (e = e.child; e !== null; ) {
        e: {
          var l = e, a = t;
          switch (l.tag) {
            case 4:
              vv(l, a);
              break e;
            case 22:
              l.memoizedState === null && Mf(l, a);
              break e;
            default:
              Mf(l, a);
          }
        }
        e = e.sibling;
      }
  }
  function yv(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, yv(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && _r(t)), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  var We = null, $t = !1;
  function Tn(e, t, l) {
    for (l = l.child; l !== null; )
      bv(e, t, l), l = l.sibling;
  }
  function bv(e, t, l) {
    if (Jt && typeof Jt.onCommitFiberUnmount == "function")
      try {
        Jt.onCommitFiberUnmount(ro, l);
      } catch {
      }
    switch (l.tag) {
      case 26:
        Be || At(l, t), Tn(
          e,
          t,
          l
        ), l.memoizedState ? l.memoizedState.count-- : l.stateNode && !Be && (l = l.stateNode, l.parentNode.removeChild(l));
        break;
      case 27:
        Be || At(l, t), Vo(l);
        var a = We, u = $t;
        Ql(l.type) && (We = l.stateNode, $t = !1), Tn(
          e,
          t,
          l
        ), wy(
          l.stateNode,
          l.type,
          l.memoizedProps
        ), We = a, $t = u;
        break;
      case 5:
        Be || At(l, t), Vo(l);
      case 6:
        if (l.tag === 6 && Vo(l), a = We, u = $t, We = null, Tn(
          e,
          t,
          l
        ), We = a, $t = u, We !== null)
          if ($t)
            try {
              (We.nodeType === 9 ? We.body : We.nodeName === "HTML" ? We.ownerDocument.body : We).removeChild(l.stateNode), Ge = !0;
            } catch (s) {
              Pe(
                l,
                t,
                s
              );
            }
          else
            try {
              We.removeChild(l.stateNode), Ge = !0;
            } catch (s) {
              Pe(
                l,
                t,
                s
              );
            }
        break;
      case 18:
        We !== null && ($t ? (e = We, uy(
          e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e,
          l.stateNode
        ), Bi(e)) : uy(We, l.stateNode));
        break;
      case 4:
        a = We, u = $t, We = l.stateNode.containerInfo, $t = !0, Tn(
          e,
          t,
          l
        ), We = a, $t = u;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ql(2, l, t), Be || ql(4, l, t), Tn(
          e,
          t,
          l
        );
        break;
      case 1:
        Be || (At(l, t), a = l.stateNode, typeof a.componentWillUnmount == "function" && iv(
          l,
          t,
          a
        )), Tn(
          e,
          t,
          l
        );
        break;
      case 21:
        Tn(
          e,
          t,
          l
        );
        break;
      case 22:
        Be = (a = Be) || l.memoizedState !== null, Tn(
          e,
          t,
          l
        ), Be = a;
        break;
      case 30:
        At(l, t), Tn(
          e,
          t,
          l
        );
        break;
      case 7:
        Be || At(l, t), Tn(
          e,
          t,
          l
        );
        break;
      default:
        Tn(
          e,
          t,
          l
        );
    }
  }
  function Sv(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null))) {
      e = e.dehydrated;
      try {
        Bi(e);
      } catch (l) {
        Pe(t, t.return, l);
      }
    }
  }
  function xv(e, t) {
    if (t.memoizedState === null && (e = t.alternate, e !== null && (e = e.memoizedState, e !== null && (e = e.dehydrated, e !== null))))
      try {
        Bi(e);
      } catch (l) {
        Pe(t, t.return, l);
      }
  }
  function ew(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return t === null && (t = e.stateNode = new hv()), t;
      case 22:
        return e = e.stateNode, t = e._retryCache, t === null && (t = e._retryCache = new hv()), t;
      default:
        throw Error(r(435, e.tag));
    }
  }
  function Cu(e, t) {
    var l = ew(e);
    t.forEach(function(a) {
      if (!l.has(a)) {
        l.add(a);
        var u = dw.bind(null, e, a);
        a.then(u, u);
      }
    });
  }
  function Vt(e, t, l) {
    var a = t.deletions;
    if (a !== null)
      for (var u = 0; u < a.length; u++) {
        var s = a[u], m = e, w = t, z = w;
        e: for (; z !== null; ) {
          switch (z.tag) {
            case 27:
              if (Ql(z.type)) {
                We = z.stateNode, $t = !1;
                break e;
              }
              break;
            case 5:
              We = z.stateNode, $t = !1;
              break e;
            case 3:
            case 4:
              We = z.stateNode.containerInfo, $t = !0;
              break e;
          }
          z = z.return;
        }
        if (We === null) throw Error(r(160));
        bv(m, w, s), We = null, $t = !1, m = s.alternate, m !== null && (m.return = null), s.return = null;
      }
    if (t.subtreeFlags & 13886)
      for (t = t.child; t !== null; )
        Cv(t, e, l), t = t.sibling;
  }
  var An = null;
  function Cv(e, t, l) {
    var a = e.alternate, u = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (u & 4 && (a = e.updateQueue, a = a !== null ? a.events : null, a !== null))
          for (var s = 0; s < a.length; s++) {
            var m = a[s];
            m.ref.impl = m.nextImpl;
          }
        Vt(t, e, l), Gt(e), u & 4 && (ql(3, e, e.return), Uo(3, e), ql(5, e, e.return));
        break;
      case 1:
        Vt(t, e, l), Gt(e), u & 512 && (Be || a === null || At(a, a.return)), u & 64 && bt && (e = e.updateQueue, e !== null && (t = e.callbacks, t !== null && (l = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = l === null ? t : l.concat(t))));
        break;
      case 26:
        if (s = An, Vt(t, e, l), Gt(e), u & 512 && (Be || a === null || At(a, a.return)), u & 4)
          if (u = a !== null ? a.memoizedState : null, l = e.memoizedState, a === null)
            if (l === null)
              if (e.stateNode === null)
                if (bt)
                  e.stateNode = iy(
                    e.type,
                    e.memoizedProps,
                    t.containerInfo,
                    e
                  );
                else {
                  e: {
                    t = e.type, l = e.memoizedProps, u = s.ownerDocument || s;
                    t: switch (t) {
                      case "title":
                        a = u.getElementsByTagName("title")[0], (!a || a[co] || a[Et] || a.namespaceURI === "http://www.w3.org/2000/svg" || a.hasAttribute("itemprop")) && (a = u.createElement(t), u.head.insertBefore(
                          a,
                          u.querySelector("head > title")
                        )), zt(a, t, l), a[Et] = e, vt(a), t = a;
                        break e;
                      case "link":
                        if (s = zy(
                          "link",
                          "href",
                          u
                        ).get(t + (l.href || ""))) {
                          for (m = 0; m < s.length; m++)
                            if (a = s[m], a.getAttribute("href") === (l.href == null || l.href === "" ? null : l.href) && a.getAttribute("rel") === (l.rel == null ? null : l.rel) && a.getAttribute("title") === (l.title == null ? null : l.title) && a.getAttribute("crossorigin") === (l.crossOrigin == null ? null : l.crossOrigin)) {
                              s.splice(m, 1);
                              break t;
                            }
                        }
                        a = u.createElement(t), zt(a, t, l), u.head.appendChild(a);
                        break;
                      case "meta":
                        if (s = zy(
                          "meta",
                          "content",
                          u
                        ).get(t + (l.content || ""))) {
                          for (m = 0; m < s.length; m++)
                            if (a = s[m], a.getAttribute("content") === (l.content == null ? null : "" + l.content) && a.getAttribute("name") === (l.name == null ? null : l.name) && a.getAttribute("property") === (l.property == null ? null : l.property) && a.getAttribute("http-equiv") === (l.httpEquiv == null ? null : l.httpEquiv) && a.getAttribute("charset") === (l.charSet == null ? null : l.charSet)) {
                              s.splice(m, 1);
                              break t;
                            }
                        }
                        a = u.createElement(t), zt(a, t, l), u.head.appendChild(a);
                        break;
                      default:
                        throw Error(r(468, t));
                    }
                    a[Et] = e, vt(a), t = a;
                  }
                  e.stateNode = t;
                }
              else
                bt || hd(s, e.type, e.stateNode);
            else
              e.stateNode = Ay(
                s,
                l,
                e.memoizedProps
              );
          else
            u !== l ? (u === null ? (t = a.stateNode, t === null || Be || t.parentNode.removeChild(t)) : u.count--, l === null ? bt || hd(s, e.type, e.stateNode) : Ay(s, l, e.memoizedProps)) : l === null && e.stateNode !== null && Sf(
              e,
              e.memoizedProps,
              a.memoizedProps
            );
        break;
      case 27:
        Vt(t, e, l), Gt(e), u & 512 && (Be || a === null || At(a, a.return)), a !== null && u & 4 && Sf(
          e,
          e.memoizedProps,
          a.memoizedProps
        );
        break;
      case 5:
        if (s = Pn, Pn = !1, Vt(t, e, l), Pn = s, Gt(e), u & 512 && (Be || a === null || At(a, a.return)), e.flags & 32) {
          t = e.stateNode;
          try {
            ai(t, ""), Ge = !0;
          } catch (Y) {
            Pe(e, e.return, Y);
          }
        }
        u & 4 && e.stateNode != null && (t = e.memoizedProps, Sf(
          e,
          t,
          a !== null ? a.memoizedProps : t
        )), u & 1024 && (Af = !0);
        break;
      case 6:
        if (Vt(t, e, l), Gt(e), u & 4) {
          if (e.stateNode === null)
            throw Error(r(162));
          t = e.memoizedProps, l = e.stateNode;
          try {
            l.nodeValue = t, Ge = !0;
          } catch (Y) {
            Pe(e, e.return, Y);
          }
        }
        break;
      case 3:
        if (Ge = !1, Uu = null, s = An, An = Xo(t.containerInfo), Vt(t, e, l), An = s, Gt(e), u & 4 && a !== null && a.memoizedState.isDehydrated)
          try {
            Bi(t.containerInfo);
          } catch (Y) {
            Pe(e, e.return, Y);
          }
        Af && (Af = !1, wv(e)), Ge = !1;
        break;
      case 4:
        u = Pn, Pn = bt, a = Pm(), s = An, An = Xo(
          e.stateNode.containerInfo
        ), Vt(t, e, l), Gt(e), An = s, Ge && Go && (Su = !0), Ge = a, Pn = u;
        break;
      case 12:
        Vt(t, e, l), Gt(e);
        break;
      case 31:
        Vt(t, e, l), Gt(e), u & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
        break;
      case 13:
        Vt(t, e, l), Gt(e), e.child.flags & 8192 && e.memoizedState !== null != (a !== null && a.memoizedState !== null) && (Ru = Kt()), u & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
        break;
      case 22:
        s = e.memoizedState !== null, m = a !== null && a.memoizedState !== null;
        var w = bt, z = Be, k = Pn;
        bt = w || s, Pn = k || s, Be = z || m, Vt(t, e, l), Be = z, Pn = k, bt = w, Gt(e), u & 8192 && (t = e.stateNode, t._visibility = s ? t._visibility & -2 : t._visibility | 1, !s || a === null || m || bt || Be || (t = m || Be, l = bt, a = Be, bt = s || bt, Be = t, Pl(e, 2), bt = l, Be = a), !s && Pn || Of(e, s)), u & 4 && (t = e.updateQueue, t !== null && (l = t.retryQueue, l !== null && (t.retryQueue = null, Cu(e, l))));
        break;
      case 19:
        Vt(t, e, l), Gt(e), u & 4 && (t = e.updateQueue, t !== null && (e.updateQueue = null, Cu(e, t)));
        break;
      case 30:
        u & 512 && (Be || a === null || At(a, a.return)), u = Pm(), s = Go, m = (l & 335544064) === l, w = e.memoizedProps, Go = m && il(
          w.default,
          w.update
        ) !== "none", Vt(t, e, l), Gt(e), m && a !== null && Ge && (e.flags |= 4), Go = s, Ge = u;
        break;
      case 21:
        break;
      case 7:
        u & 512 && (Be || a === null || At(a, a.return)), a && a.stateNode !== null && (a.stateNode._fragmentFiber = e);
      default:
        Vt(t, e, l), Gt(e);
    }
  }
  function Gt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var l, a = e.return; a !== null; ) {
          if (rv(a)) {
            l = a;
            break;
          }
          a = a.return;
        }
        a = null;
        for (var u = e.return; u !== null; ) {
          if (yf(u)) {
            var s = u.stateNode;
            a === null ? a = [s] : a.push(s);
          }
          if (vf(u)) break;
          u = u.return;
        }
        var m = a;
        if (l == null) throw Error(r(160));
        switch (l.tag) {
          case 27:
            var w = l.stateNode, z = xf(e);
            pu(
              e,
              z,
              w,
              m
            );
            break;
          case 5:
            var k = l.stateNode;
            l.flags & 32 && (ai(k, ""), l.flags &= -33);
            var Y = xf(e);
            pu(
              e,
              Y,
              k,
              m
            );
            break;
          case 3:
          case 4:
            var ee = l.stateNode.containerInfo, L = xf(e);
            Cf(
              e,
              L,
              ee,
              m
            );
            break;
          default:
            throw Error(r(161));
        }
      } catch (I) {
        Pe(e, e.return, I);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function wv(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null; ) {
        var t = e;
        wv(t), t.tag === 5 && t.flags & 1024 && (t = t.stateNode, ki = !0, t.reset(), ki = !1), e = e.sibling;
      }
  }
  function wi(e, t) {
    if (t.subtreeFlags & 9270)
      for (t = t.child; t !== null; )
        Ev(t, e), t = t.sibling;
    else mv(t);
  }
  function Ev(e, t) {
    var l = e.alternate;
    if (l === null) wf(e, !1);
    else
      switch (e.tag) {
        case 3:
          if (zf = In = !1, cv(), wi(t, e), !In && !Su) {
            if (e = Bn, e !== null)
              for (var a = 0; a < e.length; a += 3) {
                l = e[a];
                var u = e[a + 1];
                fy(l, e[a + 2]), l = l.ownerDocument.documentElement, l !== null && l.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + u + ")"
                  }
                );
              }
            e = t.containerInfo, e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "" && (e.style.viewTransitionName = "none", e.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), e.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), zf = !0;
          }
          Bn = null;
          break;
        case 5:
          wi(t, e);
          break;
        case 4:
          a = In, In = !1, wi(t, e), In && (Su = !0), In = a;
          break;
        case 22:
          e.memoizedState === null && (l.memoizedState !== null ? wf(e, !1) : wi(t, e));
          break;
        case 30:
          a = In, u = cv(), In = !1, wi(t, e), In && (e.flags |= 4);
          var s = e.memoizedProps, m = e.stateNode;
          t = al(s, m), m = al(l.memoizedProps, m);
          var w = il(s.default, s.update);
          w === "none" ? t = !1 : (s = l.memoizedState, l.memoizedState = null, l = e.child, It = 0, t = Tf(
            e,
            l,
            t,
            m,
            w,
            s,
            !0
          ), It !== (s === null ? 0 : s.length) && (e.flags |= 32)), (e.flags & 4) !== 0 && t ? (Oi(
            e,
            e.memoizedProps.onUpdate
          ), Bn = u) : u !== null && (u.push.apply(u, Bn), Bn = u), In = (e.flags & 32) !== 0 ? !0 : a;
          break;
        default:
          wi(t, e);
      }
  }
  function $n(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null; )
        pv(e, t.alternate, t), t = t.sibling;
  }
  function Pl(e, t) {
    for (e = e.child; e !== null; ) {
      var l = e, a = t;
      switch (l.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ql(4, l, l.return), Pl(
            l,
            a
          );
          break;
        case 1:
          At(l, l.return);
          var u = l.stateNode;
          typeof u.componentWillUnmount == "function" && iv(
            l,
            l.return,
            u
          ), Pl(
            l,
            a
          );
          break;
        case 27:
          (a & 2) !== 0 && wy(
            l.stateNode,
            l.type,
            l.memoizedProps
          );
        case 5:
          At(l, l.return), l.tag !== 5 && l.tag !== 27 || Vo(l), Pl(
            l,
            a
          );
          break;
        case 6:
          Vo(l);
          break;
        case 26:
          At(l, l.return), u = l.stateNode, l.memoizedState !== null || u === null || Be || u.parentNode.removeChild(u), Pl(
            l,
            a
          );
          break;
        case 22:
          l.memoizedState === null && Pl(
            l,
            a
          );
          break;
        case 30:
          At(l, l.return), Pl(
            l,
            a
          );
          break;
        case 7:
          At(l, l.return);
        default:
          Pl(
            l,
            a
          );
      }
      e = e.sibling;
    }
  }
  function zn(e, t, l) {
    for (l = (t.subtreeFlags & 8772) !== 0 ? l : l & -2, t = t.child; t !== null; ) {
      var a = t.alternate, u = e, s = t, m = s.flags, w = (l & 1) !== 0;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          zn(
            u,
            s,
            l
          ), Uo(4, s);
          break;
        case 1:
          if (zn(
            u,
            s,
            l
          ), a = s, u = a.stateNode, typeof u.componentDidMount == "function")
            try {
              u.componentDidMount();
            } catch (Y) {
              Pe(a, a.return, Y);
            }
          if (a = s, u = a.updateQueue, u !== null) {
            var z = a.stateNode;
            try {
              var k = u.shared.hiddenCallbacks;
              if (k !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < k.length; u++)
                  Yh(k[u], z);
            } catch (Y) {
              Pe(a, a.return, Y);
            }
          }
          w && m & 64 && av(s), kn(s, s.return);
          break;
        case 27:
          (l & 2) !== 0 && uv(s);
        case 5:
          s.tag !== 5 && s.tag !== 27 || ov(s), zn(
            u,
            s,
            l
          ), w && a === null && m & 4 && bf(s), kn(s, s.return);
          break;
        case 6:
          ov(s);
          break;
        case 26:
          z = s.stateNode, s.memoizedState !== null || z === null || bt || hd(
            Xo(z.ownerDocument),
            s.type,
            z
          ), zn(
            u,
            s,
            l
          ), w && a === null && m & 4 && bf(s), kn(s, s.return);
          break;
        case 12:
          zn(
            u,
            s,
            l
          );
          break;
        case 31:
          zn(
            u,
            s,
            l
          ), w && m & 4 && Sv(u, s);
          break;
        case 13:
          zn(
            u,
            s,
            l
          ), w && m & 4 && xv(u, s);
          break;
        case 22:
          s.memoizedState === null && zn(
            u,
            s,
            l
          ), kn(s, s.return);
          break;
        case 30:
          zn(
            u,
            s,
            l
          ), kn(s, s.return);
          break;
        case 7:
          kn(s, s.return);
        default:
          zn(
            u,
            s,
            l
          );
      }
      t = t.sibling;
    }
  }
  function Nf(e, t) {
    var l = null;
    e !== null && e.memoizedState !== null && e.memoizedState.cachePool !== null && (l = e.memoizedState.cachePool.pool), e = null, t.memoizedState !== null && t.memoizedState.cachePool !== null && (e = t.memoizedState.cachePool.pool), e !== l && (e != null && e.refCount++, l != null && Eo(l));
  }
  function Df(e, t) {
    e = null, t.alternate !== null && (e = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== e && (t.refCount++, e != null && Eo(e));
  }
  function bn(e, t, l, a) {
    var u = (l & 335544064) === l;
    if (t.subtreeFlags & (u ? 10262 : 10256))
      for (t = t.child; t !== null; )
        Rv(
          e,
          t,
          l,
          a
        ), t = t.sibling;
    else u && gv(t);
  }
  function Rv(e, t, l, a) {
    var u = (l & 335544064) === l;
    u && t.alternate === null && t.return !== null && t.return.alternate !== null && bu(t);
    var s = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        bn(
          e,
          t,
          l,
          a
        ), s & 2048 && Uo(9, t);
        break;
      case 1:
        bn(
          e,
          t,
          l,
          a
        );
        break;
      case 3:
        bn(
          e,
          t,
          l,
          a
        ), u && zf && (e = e.containerInfo, e = e.nodeType === 9 ? e.body : e.nodeName === "HTML" ? e.ownerDocument.body : e, e.style.viewTransitionName === "root" && (e.style.viewTransitionName = ""), e = e.ownerDocument.documentElement, e !== null && e.style.viewTransitionName === "none" && (e.style.viewTransitionName = "")), s & 2048 && (s = null, t.alternate !== null && (s = t.alternate.memoizedState.cache), t = t.memoizedState.cache, t !== s && (t.refCount++, s != null && Eo(s)));
        break;
      case 12:
        if (s & 2048) {
          bn(
            e,
            t,
            l,
            a
          ), s = t.stateNode;
          try {
            var m = t.memoizedProps, w = m.id, z = m.onPostCommit;
            typeof z == "function" && z(
              w,
              t.alternate === null ? "mount" : "update",
              s.passiveEffectDuration,
              -0
            );
          } catch (k) {
            Pe(t, t.return, k);
          }
        } else
          bn(
            e,
            t,
            l,
            a
          );
        break;
      case 31:
        bn(
          e,
          t,
          l,
          a
        );
        break;
      case 13:
        bn(
          e,
          t,
          l,
          a
        );
        break;
      case 23:
        break;
      case 22:
        m = t.stateNode, w = t.alternate, t.memoizedState !== null ? (u && w !== null && w.memoizedState === null && bu(w), m._visibility & 2 ? bn(
          e,
          t,
          l,
          a
        ) : ko(
          e,
          t
        )) : (u && w !== null && w.memoizedState !== null && bu(t), m._visibility & 2 ? bn(
          e,
          t,
          l,
          a
        ) : (m._visibility |= 2, Ei(
          e,
          t,
          l,
          a,
          (t.subtreeFlags & 10256) !== 0 || !1
        ))), s & 2048 && Nf(w, t);
        break;
      case 24:
        bn(
          e,
          t,
          l,
          a
        ), s & 2048 && Df(t.alternate, t);
        break;
      case 30:
        u && (s = t.alternate, s !== null && (qn(s.child, !0), qn(t.child, !0))), bn(
          e,
          t,
          l,
          a
        );
        break;
      default:
        bn(
          e,
          t,
          l,
          a
        );
    }
  }
  function Ei(e, t, l, a, u) {
    for (u = u && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null; ) {
      var s = e, m = t, w = l, z = a, k = m.flags;
      switch (m.tag) {
        case 0:
        case 11:
        case 15:
          Ei(
            s,
            m,
            w,
            z,
            u
          ), Uo(8, m);
          break;
        case 23:
          break;
        case 22:
          var Y = m.stateNode;
          m.memoizedState !== null ? Y._visibility & 2 ? Ei(
            s,
            m,
            w,
            z,
            u
          ) : ko(
            s,
            m
          ) : (Y._visibility |= 2, Ei(
            s,
            m,
            w,
            z,
            u
          )), u && k & 2048 && Nf(
            m.alternate,
            m
          );
          break;
        case 24:
          Ei(
            s,
            m,
            w,
            z,
            u
          ), u && k & 2048 && Df(m.alternate, m);
          break;
        default:
          Ei(
            s,
            m,
            w,
            z,
            u
          );
      }
      t = t.sibling;
    }
  }
  function ko(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; ) {
        var l = e, a = t, u = a.flags;
        switch (a.tag) {
          case 22:
            ko(l, a), u & 2048 && Nf(
              a.alternate,
              a
            );
            break;
          case 24:
            ko(l, a), u & 2048 && Df(a.alternate, a);
            break;
          default:
            ko(l, a);
        }
        t = t.sibling;
      }
  }
  var Da = 8192;
  function ja(e, t, l) {
    if (e.subtreeFlags & Da)
      for (e = e.child; e !== null; )
        _v(
          e,
          t,
          l
        ), e = e.sibling;
  }
  function _v(e, t, l) {
    switch (e.tag) {
      case 26:
        ja(
          e,
          t,
          l
        ), e.flags & Da && (e.memoizedState !== null ? oE(
          l,
          An,
          e.memoizedState,
          e.memoizedProps
        ) : (e = e.stateNode, (t & 335544128) === t && Dy(l, e)));
        break;
      case 5:
        ja(
          e,
          t,
          l
        ), e.flags & Da && (e = e.stateNode, (t & 335544128) === t && Dy(l, e));
        break;
      case 3:
      case 4:
        var a = An;
        An = Xo(e.stateNode.containerInfo), ja(
          e,
          t,
          l
        ), An = a;
        break;
      case 22:
        e.memoizedState === null && (a = e.alternate, a !== null && a.memoizedState !== null ? (a = Da, Da = 16777216, ja(
          e,
          t,
          l
        ), Da = a) : ja(
          e,
          t,
          l
        ));
        break;
      case 30:
        if ((e.flags & Da) !== 0 && (a = e.memoizedProps.name, a != null && a !== "auto")) {
          var u = e.stateNode;
          u.paired = null, ln === null && (ln = /* @__PURE__ */ new Map()), ln.set(a, u);
        }
        ja(
          e,
          t,
          l
        );
        break;
      default:
        ja(
          e,
          t,
          l
        );
    }
  }
  function Tv(e) {
    var t = e.alternate;
    if (t !== null && (e = t.child, e !== null)) {
      t.child = null;
      do
        t = e.sibling, e.sibling = null, e = t;
      while (e !== null);
    }
  }
  function Bo(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          St = a, zv(
            a,
            e
          );
        }
      Tv(e);
    }
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; )
        Av(e), e = e.sibling;
  }
  function Av(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Bo(e), e.flags & 2048 && ql(9, e, e.return);
        break;
      case 3:
        Bo(e);
        break;
      case 12:
        Bo(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13) ? (t._visibility &= -3, wu(e)) : Bo(e);
        break;
      default:
        Bo(e);
    }
  }
  function wu(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var l = 0; l < t.length; l++) {
          var a = t[l];
          St = a, zv(
            a,
            e
          );
        }
      Tv(e);
    }
    for (e = e.child; e !== null; ) {
      switch (t = e, t.tag) {
        case 0:
        case 11:
        case 15:
          ql(8, t, t.return), wu(t);
          break;
        case 22:
          l = t.stateNode, l._visibility & 2 && (l._visibility &= -3, wu(t));
          break;
        default:
          wu(t);
      }
      e = e.sibling;
    }
  }
  function zv(e, t) {
    for (; St !== null; ) {
      var l = St;
      switch (l.tag) {
        case 0:
        case 11:
        case 15:
          ql(8, l, t);
          break;
        case 23:
        case 22:
          if (l.memoizedState !== null && l.memoizedState.cachePool !== null) {
            var a = l.memoizedState.cachePool.pool;
            a != null && a.refCount++;
          }
          break;
        case 24:
          Eo(l.memoizedState.cache);
      }
      if (a = l.child, a !== null) a.return = l, St = a;
      else
        e: for (l = e; St !== null; ) {
          a = St;
          var u = a.sibling, s = a.return;
          if (yv(a), a === l) {
            St = null;
            break e;
          }
          if (u !== null) {
            u.return = s, St = u;
            break e;
          }
          St = s;
        }
    }
  }
  var tw = {
    getCacheForType: function(e) {
      var t = Rt(st), l = t.data.get(e);
      return l === void 0 && (l = e(), t.data.set(e, l)), l;
    },
    cacheSignal: function() {
      return Rt(st).controller.signal;
    }
  }, nw = typeof WeakMap == "function" ? WeakMap : Map, ke = 0, Xe = null, je = null, Le = 0, qe = 0, an = null, Il = !1, Ri = !1, jf = !1, ml = 0, at = 0, $l = 0, Ha = 0, Eu = 0, on = 0, _i = 0, qo = null, Yt = null, Hf = !1, Ru = 0, Ov = 0, _u = 1 / 0, Tu = null, Yl = null, tt = 0, On = null, La = null, Yn = 0, Lf = 0, Uf = null, Mv = null, Ti = null, Ai = null, zi = null, Po = 0, Au = null;
  function rn() {
    return (ke & 2) !== 0 && Le !== 0 ? Le & -Le : re.T !== null ? Ff() : jm();
  }
  function Nv() {
    if (on === 0)
      if ((Le & 536870912) === 0 || Ne) {
        var e = Cr;
        Cr <<= 1, (Cr & 3932160) === 0 && (Cr = 262144), on = e;
      } else on = 536870912;
    return e = _t.current, e !== null && (e.flags |= 32), on;
  }
  function Oi(e, t) {
    if (t != null) {
      var l = e.stateNode, a = l.ref;
      a === null && (a = l.ref = dy(
        al(e.memoizedProps, l)
      )), Ai === null && (Ai = []), Ai.push(t.bind(null, a));
    }
  }
  function Ft(e, t, l) {
    (e === Xe && (qe === 2 || qe === 9) || e.cancelPendingCommit !== null) && (Mi(e, 0), Fl(
      e,
      Le,
      on,
      !1
    )), so(e, l), ((ke & 2) === 0 || e !== Xe) && (e === Xe && ((ke & 2) === 0 && (Ha |= l), at === 4 && Fl(
      e,
      Le,
      on,
      !1
    )), Fn(e));
  }
  function Dv(e, t, l) {
    if ((ke & 6) !== 0) throw Error(r(327));
    var a = !l && (t & 127) === 0 && (t & e.expiredLanes) === 0 || uo(e, t), u = a ? iw(e, t) : Gf(e, t, !0), s = a;
    do {
      if (u === 0) {
        Ri && !a && Fl(e, t, 0, !1);
        break;
      } else {
        if (l = e.current.alternate, s && !lw(l)) {
          u = Gf(e, t, !1), s = !1;
          continue;
        }
        if (u === 2) {
          if (s = t, e.errorRecoveryDisabledLanes & s)
            var m = 0;
          else
            m = e.pendingLanes & -536870913, m = m !== 0 ? m : m & 536870912 ? 536870912 : 0;
          if (m !== 0) {
            t = m;
            e: {
              var w = e;
              u = qo;
              var z = w.current.memoizedState.isDehydrated;
              if (z && (Mi(w, m).flags |= 256), m = Gf(
                w,
                m,
                !1
              ), m !== 2 && m !== 6) {
                if (jf && !z) {
                  w.errorRecoveryDisabledLanes |= s, Ha |= s, u = 4;
                  break e;
                }
                s = Yt, Yt = u, s !== null && (Yt === null ? Yt = s : Yt.push.apply(
                  Yt,
                  s
                ));
              }
              u = m;
            }
            if (s = !1, u !== 2) continue;
          }
        }
        if (u === 1) {
          Mi(e, 0), Fl(e, t, 0, !0);
          break;
        }
        e: {
          switch (a = e, s = u, s) {
            case 0:
            case 1:
              throw Error(r(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t)
                break;
            case 6:
              Fl(
                a,
                t,
                on,
                !Il
              );
              break e;
            case 2:
              Yt = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(r(329));
          }
          if ((t & 62914560) === t && (u = Ru + 300 - Kt(), 10 < u)) {
            if (Fl(
              a,
              t,
              on,
              !Il
            ), Er(a, 0, !0) !== 0) break e;
            Yn = t, a.timeoutHandle = ad(
              jv.bind(
                null,
                a,
                l,
                Yt,
                Tu,
                Hf,
                t,
                on,
                Ha,
                _i,
                Il,
                s,
                "Throttled",
                -0,
                0
              ),
              u
            );
            break e;
          }
          jv(
            a,
            l,
            Yt,
            Tu,
            Hf,
            t,
            on,
            Ha,
            _i,
            Il,
            s,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Fn(e);
  }
  function jv(e, t, l, a, u, s, m, w, z, k, Y, ee, L, I) {
    e.timeoutHandle = -1;
    var fe = t.subtreeFlags, be = (s & 335544064) === s;
    if (ee = null, (be || fe & 8192 || (fe & 16785408) === 16785408) && (ee = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: Un
    }, ln = null, _v(
      t,
      s,
      ee
    ), be && (fe = ee, be = e.containerInfo, be = (be.nodeType === 9 ? be : be.ownerDocument).__reactViewTransition, be != null && (fe.count++, fe.waitingForViewTransition = !0, fe = Ko.bind(fe), be.finished.then(fe, fe))), fe = (s & 62914560) === s ? Ru - Kt() : (s & 4194048) === s ? Ov - Kt() : 0, fe = rE(
      ee,
      fe
    ), fe !== null)) {
      Yn = s, e.cancelPendingCommit = fe(
        qv.bind(
          null,
          e,
          t,
          s,
          l,
          a,
          u,
          m,
          w,
          z,
          k,
          Y,
          ee,
          null,
          L,
          I
        )
      ), Fl(e, s, m, !k);
      return;
    }
    qv(
      e,
      t,
      s,
      l,
      a,
      u,
      m,
      w,
      z,
      k,
      Y,
      ee
    );
  }
  function lw(e) {
    for (var t = e; ; ) {
      var l = t.tag;
      if ((l === 0 || l === 11 || l === 15) && t.flags & 16384 && (l = t.updateQueue, l !== null && (l = l.stores, l !== null)))
        for (var a = 0; a < l.length; a++) {
          var u = l[a], s = u.getSnapshot;
          u = u.value;
          try {
            if (!tn(s(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (l = t.child, t.subtreeFlags & 16384 && l !== null)
        l.return = t, t = l;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function Fl(e, t, l, a) {
    t = zm(e, t), t &= ~Eu, t &= ~Ha, e.suspendedLanes |= t, e.pingedLanes &= ~t, a && (e.warmLanes |= t), a = e.expirationTimes;
    for (var u = t; 0 < u; ) {
      var s = 31 - Wt(u), m = 1 << s;
      a[s] = -1, u &= ~m;
    }
    l !== 0 && Mm(e, l, t);
  }
  function zu() {
    return (ke & 6) === 0 ? (Io(0), !1) : !0;
  }
  function Vf() {
    if (je !== null) {
      if (qe === 0)
        var e = je.return;
      else
        e = je, ul = wa = null, $c(e), vi = null, To = 0, e = je;
      for (; e !== null; )
        lv(e.alternate, e), e = e.return;
      je = null;
    }
  }
  function Mi(e, t) {
    var l = e.timeoutHandle;
    return l !== -1 && (e.timeoutHandle = -1, Tw(l)), l = e.cancelPendingCommit, l !== null && (e.cancelPendingCommit = null, l()), Yn = 0, Vf(), Xe = e, je = l = ol(e.current, null), Le = t, qe = 0, an = null, Il = !1, Ri = uo(e, t), jf = !1, _i = on = Eu = Ha = $l = at = 0, Yt = qo = null, Hf = !1, ml = zm(e, t), Ur(), l;
  }
  function Hv(e, t) {
    Te = null, re.H = uu, t === pi || t === Xr ? (t = qh(), qe = 3) : t === Nc ? (t = qh(), qe = 4) : qe = t === rf ? 8 : t !== null && typeof t == "object" && typeof t.then == "function" ? 6 : 1, an = t, je === null && (at = 1, su(
      e,
      hn(t, e.current)
    ));
  }
  function Lv() {
    var e = _t.current;
    return e === null ? !0 : (Le & 4194048) === Le ? Nt === null : (Le & 62914560) === Le || (Le & 536870912) !== 0 ? e === Nt : !1;
  }
  function Uv() {
    var e = re.H;
    return re.H = uu, e === null ? uu : e;
  }
  function Vv() {
    var e = re.A;
    return re.A = tw, e;
  }
  function Ou() {
    at = 4, Il || (Le & 4194048) !== Le && _t.current !== null || (Ri = !0), ($l & 134217727) === 0 && (Ha & 134217727) === 0 || Xe === null || Fl(
      Xe,
      Le,
      on,
      !1
    );
  }
  function Gf(e, t, l) {
    var a = ke;
    ke |= 2;
    var u = Uv(), s = Vv();
    (Xe !== e || Le !== t) && (Tu = null, Mi(e, t)), t = !1;
    var m = at;
    e: do
      try {
        if (qe !== 0 && je !== null) {
          var w = je, z = an;
          switch (qe) {
            case 8:
              Vf(), m = 6;
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              _t.current === null && (t = !0);
              var k = qe;
              if (qe = 0, an = null, Ni(e, w, z, k), l && Ri) {
                m = 0;
                break e;
              }
              break;
            default:
              k = qe, qe = 0, an = null, Ni(e, w, z, k);
          }
        }
        aw(), m = at;
        break;
      } catch (Y) {
        Hv(e, Y);
      }
    while (!0);
    return t && e.shellSuspendCounter++, ul = wa = null, ke = a, re.H = u, re.A = s, je === null && (Xe = null, Le = 0, Ur()), m;
  }
  function aw() {
    for (; je !== null; ) Gv(je);
  }
  function iw(e, t) {
    var l = ke;
    ke |= 2;
    var a = Uv(), u = Vv();
    Xe !== e || Le !== t ? (Tu = null, _u = Kt() + 500, Mi(e, t)) : Ri = uo(
      e,
      t
    );
    e: do
      try {
        if (qe !== 0 && je !== null) {
          t = je;
          var s = an;
          t: switch (qe) {
            case 1:
              qe = 0, an = null, Ni(e, t, s, 1);
              break;
            case 2:
            case 9:
              if (kh(s)) {
                qe = 0, an = null, kv(t);
                break;
              }
              t = function() {
                qe !== 2 && qe !== 9 || Xe !== e || (qe = 7), Fn(e);
              }, s.then(t, t);
              break e;
            case 3:
              qe = 7;
              break e;
            case 4:
              qe = 5;
              break e;
            case 7:
              kh(s) ? (qe = 0, an = null, kv(t)) : (qe = 0, an = null, Ni(e, t, s, 7));
              break;
            case 5:
              var m = null;
              switch (je.tag) {
                case 26:
                  m = je.memoizedState;
                case 5:
                case 27:
                  var w = je;
                  if (m ? My(m) : w.stateNode.complete) {
                    qe = 0, an = null;
                    var z = w.sibling;
                    if (z !== null) je = z;
                    else {
                      var k = w.return;
                      k !== null ? (je = k, Mu(k)) : je = null;
                    }
                    break t;
                  }
              }
              qe = 0, an = null, Ni(e, t, s, 5);
              break;
            case 6:
              qe = 0, an = null, Ni(e, t, s, 6);
              break;
            case 8:
              Vf(), at = 6;
              break e;
            default:
              throw Error(r(462));
          }
        }
        ow();
        break;
      } catch (Y) {
        Hv(e, Y);
      }
    while (!0);
    return ul = wa = null, re.H = a, re.A = u, ke = l, je !== null ? 0 : (Xe = null, Le = 0, Ur(), at);
  }
  function ow() {
    for (; je !== null && !w1(); )
      Gv(je);
  }
  function Gv(e) {
    var t = tv(e.alternate, e, ml);
    e.memoizedProps = e.pendingProps, t === null ? Mu(e) : je = t;
  }
  function kv(e) {
    var t = e, l = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Xp(
          l,
          t,
          t.pendingProps,
          t.type,
          void 0,
          Le
        );
        break;
      case 11:
        t = Xp(
          l,
          t,
          t.pendingProps,
          t.type.render,
          t.ref,
          Le
        );
        break;
      case 5:
        $c(t);
        var a = t;
        a === yt && (Ne ? (Pr(a), a.tag === 5 && a.stateNode != null && (Ze = a.stateNode)) : (Pr(a), Ne = !0));
      default:
        lv(l, t), t = je = zh(t, ml), t = tv(l, t, ml);
    }
    e.memoizedProps = e.pendingProps, t === null ? Mu(e) : je = t;
  }
  function Ni(e, t, l, a) {
    ul = wa = null, $c(t), vi = null, To = 0;
    var u = t.return;
    try {
      if (FC(
        e,
        u,
        t,
        l,
        Le
      )) {
        at = 1, su(
          e,
          hn(l, e.current)
        ), je = null;
        return;
      }
    } catch (s) {
      if (u !== null) throw je = u, s;
      at = 1, su(
        e,
        hn(l, e.current)
      ), je = null;
      return;
    }
    t.flags & 32768 ? (Ne || a === 1 ? e = !0 : Ri || (Le & 536870912) !== 0 ? e = !1 : (Il = e = !0, (a === 2 || a === 9 || a === 3 || a === 6) && (a = _t.current, a !== null && a.tag === 13 && (a.flags |= 16384))), Bv(t, e)) : Mu(t);
  }
  function Mu(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Bv(
          t,
          Il
        );
        return;
      }
      e = t.return;
      var l = KC(
        t.alternate,
        t,
        ml
      );
      if (l !== null) {
        je = l;
        return;
      }
      if (t = t.sibling, t !== null) {
        je = t;
        return;
      }
      je = t = e;
    } while (t !== null);
    at === 0 && (at = 5);
  }
  function Bv(e, t) {
    do {
      var l = JC(e.alternate, e);
      if (l !== null) {
        l.flags &= 32767, je = l;
        return;
      }
      if (l = e.return, l !== null && (l.flags |= 32768, l.subtreeFlags = 0, l.deletions = null), !t && (e = e.sibling, e !== null)) {
        je = e;
        return;
      }
      je = e = l;
    } while (e !== null);
    at = 6, je = null;
  }
  function qv(e, t, l, a, u, s, m, w, z, k, Y, ee) {
    e.cancelPendingCommit = null;
    do
      Nu();
    while (tt !== 0);
    if ((ke & 6) !== 0) throw Error(r(327));
    if (t !== null) {
      if (t === e.current) throw Error(r(177));
      e === Xe && (je = Xe = null, Le = 0), La = t, On = e, Yn = l, Uf = u, Mv = a, rw(
        e,
        t,
        l,
        m,
        w,
        z,
        ee
      );
    }
  }
  function rw(e, t, l, a, u, s, m) {
    var w = t.lanes | t.childLanes;
    if (Lf = w, w |= bc, D1(
      e,
      l,
      w,
      a,
      u,
      s
    ), Ai = null, (l & 335544064) === l ? (zi = HC(e), a = 10262) : (zi = null, a = 10256), (t.subtreeFlags & a) !== 0 || (t.flags & a) !== 0 ? (e.callbackNode = null, e.callbackPriority = 0, gw(Sr, function() {
      return Pf(), null;
    })) : (e.callbackNode = null, e.callbackPriority = 0), vu = !1, a = (t.flags & 13878) !== 0, (t.subtreeFlags & 13878) !== 0 || a) {
      a = re.T, re.T = null, u = ce.p, ce.p = 2, s = ke, ke |= 4;
      try {
        WC(e, t, l);
      } finally {
        ke = s, ce.p = u, re.T = a;
      }
    }
    tt = 1, vu ? Ti = Dw(
      m,
      e.containerInfo,
      zi,
      kf,
      Bf,
      sw,
      qf,
      Pf,
      uw
    ) : (kf(), Bf(), qf());
  }
  function uw(e) {
    if (tt !== 0) {
      var t = On.onRecoverableError;
      t(e, { componentStack: null });
    }
  }
  function sw() {
    tt === 3 && (tt = 0, Ev(La, On), tt = 4);
  }
  function kf() {
    if (tt === 1) {
      tt = 0;
      var e = On, t = La, l = Yn, a = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || a) {
        a = re.T, re.T = null;
        var u = ce.p;
        ce.p = 2;
        var s = ke;
        ke |= 4;
        try {
          Go = Su = !1, Cv(t, e, l), l = td;
          var m = bh(e.containerInfo), w = l.focusedElem, z = l.selectionRange;
          if (m !== w && w && w.ownerDocument && yh(
            w.ownerDocument.documentElement,
            w
          )) {
            if (z !== null && mc(w)) {
              var k = z.start, Y = z.end;
              if (Y === void 0 && (Y = k), "selectionStart" in w)
                w.selectionStart = k, w.selectionEnd = Math.min(
                  Y,
                  w.value.length
                );
              else {
                var ee = w.ownerDocument || document, L = ee && ee.defaultView || window;
                if (L.getSelection) {
                  var I = L.getSelection(), fe = w.textContent.length, be = Math.min(z.start, fe), Ae = z.end === void 0 ? be : Math.min(z.end, fe);
                  !I.extend && be > Ae && (m = Ae, Ae = be, be = m);
                  var G = vh(
                    w,
                    be
                  ), N = vh(
                    w,
                    Ae
                  );
                  if (G && N && (I.rangeCount !== 1 || I.anchorNode !== G.node || I.anchorOffset !== G.offset || I.focusNode !== N.node || I.focusOffset !== N.offset)) {
                    var q = ee.createRange();
                    q.setStart(G.node, G.offset), I.removeAllRanges(), be > Ae ? (I.addRange(q), I.extend(N.node, N.offset)) : (q.setEnd(N.node, N.offset), I.addRange(q));
                  }
                }
              }
            }
            for (ee = [], I = w; I = I.parentNode; )
              I.nodeType === 1 && ee.push({
                element: I,
                left: I.scrollLeft,
                top: I.scrollTop
              });
            for (typeof w.focus == "function" && w.focus(), w = 0; w < ee.length; w++) {
              var J = ee[w];
              J.element.scrollLeft = J.left, J.element.scrollTop = J.top;
            }
          }
          ki = !!ed, td = ed = null;
        } finally {
          ke = s, ce.p = u, re.T = a;
        }
      }
      e.current = t, tt = 2;
    }
  }
  function Bf() {
    if (tt === 2) {
      tt = 0;
      var e = On, t = La, l = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || l) {
        l = re.T, re.T = null;
        var a = ce.p;
        ce.p = 2;
        var u = ke;
        ke |= 4;
        try {
          pv(e, t.alternate, t);
        } finally {
          ke = u, ce.p = a, re.T = l;
        }
      }
      tt = 3;
    }
  }
  function qf() {
    if (tt === 4 || tt === 3) {
      tt = 0;
      var e = Ti;
      Ti = null, E1();
      var t = On, l = La, a = Yn, u = Mv, s = (a & 335544064) === a ? 10262 : 10256;
      if ((l.subtreeFlags & s) !== 0 || (l.flags & s) !== 0 ? tt = 5 : (tt = 0, La = On = null, Pv(t, t.pendingLanes)), s = t.pendingLanes, s === 0 && (Yl = null), Zs(a), l = l.stateNode, Jt && typeof Jt.onCommitFiberRoot == "function")
        try {
          Jt.onCommitFiberRoot(
            ro,
            l,
            void 0,
            (l.current.flags & 128) === 128
          );
        } catch {
        }
      if (u !== null) {
        l = re.T, s = ce.p, ce.p = 2, re.T = null;
        try {
          for (var m = t.onRecoverableError, w = 0; w < u.length; w++) {
            var z = u[w];
            m(z.value, {
              componentStack: z.stack
            });
          }
        } finally {
          re.T = l, ce.p = s;
        }
      }
      if (u = Ai, m = zi, zi = null, u !== null && (Ai = null, m === null && (m = []), e !== null))
        for (z = 0; z < u.length; z++)
          l = (0, u[z])(
            m
          ), l !== void 0 && e.finished.finally(l);
      (Yn & 3) !== 0 && Nu(), Fn(t), s = t.pendingLanes, (a & 261930) !== 0 && (s & 42) !== 0 ? t === Au ? Po++ : (Po = 0, Au = t) : (Po = 0, Au = null), Io(0);
    }
  }
  function Pv(e, t) {
    (e.pooledCacheLanes &= t) === 0 && (t = e.pooledCache, t != null && (e.pooledCache = null, Eo(t)));
  }
  function Nu() {
    return Ti !== null && (Ti.skipTransition(), Ti = null), kf(), Bf(), qf(), Pf();
  }
  function Pf() {
    if (tt !== 5) return !1;
    var e = On, t = Lf;
    Lf = 0;
    var l = Zs(Yn), a = re.T, u = ce.p;
    try {
      ce.p = 32 > l ? 32 : l, re.T = null, l = Uf, Uf = null;
      var s = On, m = Yn;
      if (tt = 0, La = On = null, Yn = 0, (ke & 6) !== 0) throw Error(r(331));
      var w = ke;
      if (ke |= 4, Av(s.current), Rv(
        s,
        s.current,
        m,
        l
      ), ke = w, Io(0, !1), Jt && typeof Jt.onPostCommitFiberRoot == "function")
        try {
          Jt.onPostCommitFiberRoot(ro, s);
        } catch {
        }
      return !0;
    } finally {
      ce.p = u, re.T = a, Pv(e, t);
    }
  }
  function Iv(e, t, l) {
    t = hn(l, t), t = of(e.stateNode, t, 2), e = Vl(e, t, 2), e !== null && (so(e, 2), Fn(e));
  }
  function Pe(e, t, l) {
    if (e.tag === 3)
      Iv(e, e, l);
    else
      for (; t !== null; ) {
        if (t.tag === 3) {
          Iv(
            t,
            e,
            l
          );
          break;
        } else if (t.tag === 1) {
          var a = t.stateNode;
          if (typeof t.type.getDerivedStateFromError == "function" || typeof a.componentDidCatch == "function" && (Yl === null || !Yl.has(a))) {
            e = hn(l, e), l = kp(2), a = Vl(t, l, 2), a !== null && (Bp(
              l,
              a,
              t,
              e
            ), so(a, 2), Fn(a));
            break;
          }
        }
        t = t.return;
      }
  }
  function If(e, t, l) {
    var a = e.pingCache;
    if (a === null) {
      a = e.pingCache = new nw();
      var u = /* @__PURE__ */ new Set();
      a.set(t, u);
    } else
      u = a.get(t), u === void 0 && (u = /* @__PURE__ */ new Set(), a.set(t, u));
    u.has(l) || (jf = !0, u.add(l), e = cw.bind(null, e, t, l), t.then(e, e));
  }
  function cw(e, t, l) {
    var a = e.pingCache;
    a !== null && a.delete(t), e.pingedLanes |= e.suspendedLanes & l, e.warmLanes &= ~l, Xe === e && (Le & l) === l && ((at === 4 || at === 3 && (Le & 62914560) === Le && 300 > Kt() - Ru) && (ke & 2) === 0 ? Mi(e, 0) : Eu |= l, _i === Le && (_i = 0)), Fn(e);
  }
  function $v(e, t) {
    t === 0 && (t = Om()), e = Sa(e, t), e !== null && (so(e, t), Fn(e));
  }
  function fw(e) {
    var t = e.memoizedState, l = 0;
    t !== null && (l = t.retryLane), $v(e, l);
  }
  function dw(e, t) {
    var l = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var a = e.stateNode, u = e.memoizedState;
        u !== null && (l = u.retryLane);
        break;
      case 19:
        a = e.stateNode;
        break;
      case 22:
        a = e.stateNode._retryCache;
        break;
      default:
        throw Error(r(314));
    }
    a !== null && a.delete(t), $v(e, l);
  }
  function gw(e, t) {
    return Ys(e, t);
  }
  var Di = null, ji = null, $f = !1, Du = !1, Yf = !1, Xl = 0;
  function Fn(e) {
    e !== ji && e.next === null && (ji === null ? Di = ji = e : ji = ji.next = e), Du = !0, $f || ($f = !0, hw());
  }
  function Io(e, t) {
    if (!Yf && Du) {
      Yf = !0;
      do
        for (var l = !1, a = Di; a !== null; ) {
          if (e !== 0) {
            var u = a.pendingLanes;
            if (u === 0) var s = 0;
            else {
              var m = a.suspendedLanes, w = a.pingedLanes;
              s = (1 << 31 - Wt(42 | e) + 1) - 1, s &= u & ~(m & ~w), s = s & 201326741 ? s & 201326741 | 1 : s ? s | 2 : 0;
            }
            s !== 0 && (l = !0, Qv(a, s));
          } else
            s = Le, s = Er(
              a,
              a === Xe ? s : 0,
              a.cancelPendingCommit !== null || a.timeoutHandle !== -1
            ), (s & 3) === 0 || uo(a, s) || (l = !0, Qv(a, s));
          a = a.next;
        }
      while (l);
      Yf = !1;
    }
  }
  function mw() {
    Yv();
  }
  function Yv() {
    Du = $f = !1;
    var e = 0;
    Xl !== 0 && _w() && (e = Xl);
    for (var t = Kt(), l = null, a = Di; a !== null; ) {
      var u = a.next, s = Fv(a, t);
      s === 0 ? (a.next = null, l === null ? Di = u : l.next = u, u === null && (ji = l)) : (l = a, (e !== 0 || (s & 3) !== 0) && (Du = !0)), a = u;
    }
    tt !== 0 && tt !== 5 || Io(e), Xl !== 0 && (Xl = 0);
  }
  function Fv(e, t) {
    for (var l = e.suspendedLanes, a = e.pingedLanes, u = e.expirationTimes, s = e.pendingLanes & -62914561; 0 < s; ) {
      var m = 31 - Wt(s), w = 1 << m, z = u[m];
      z === -1 ? ((w & l) === 0 || (w & a) !== 0) && (u[m] = N1(w, t)) : z <= t && (e.expiredLanes |= w), s &= ~w;
    }
    if (t = Xe, l = Le, l = Er(
      e,
      e === t ? l : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a = e.callbackNode, l === 0 || e === t && (qe === 2 || qe === 9) || e.cancelPendingCommit !== null)
      return a !== null && a !== null && Fs(a), e.callbackNode = null, e.callbackPriority = 0;
    if ((l & 3) === 0 || uo(e, l)) {
      if (t = l & -l, t === e.callbackPriority) return t;
      switch (a !== null && Fs(a), Zs(l)) {
        case 2:
        case 8:
          l = Tm;
          break;
        case 32:
          l = Sr;
          break;
        case 268435456:
          l = Am;
          break;
        default:
          l = Sr;
      }
      return a = Xv.bind(null, e), l = Ys(l, a), e.callbackPriority = t, e.callbackNode = l, t;
    }
    return a !== null && a !== null && Fs(a), e.callbackPriority = 2, e.callbackNode = null, 2;
  }
  function Xv(e, t) {
    if (tt !== 0 && tt !== 5)
      return e.callbackNode = null, e.callbackPriority = 0, null;
    var l = e.callbackNode;
    if (Nu() && e.callbackNode !== l)
      return null;
    var a = Le;
    return a = Er(
      e,
      e === Xe ? a : 0,
      e.cancelPendingCommit !== null || e.timeoutHandle !== -1
    ), a === 0 ? null : (Dv(e, a, t), Fv(e, Kt()), e.callbackNode != null && e.callbackNode === l ? Xv.bind(null, e) : null);
  }
  function Qv(e, t) {
    if (Nu()) return null;
    Dv(e, t, !0);
  }
  function hw() {
    Aw(function() {
      (ke & 6) !== 0 ? Ys(
        _m,
        mw
      ) : Yv();
    });
  }
  function Ff() {
    if (Xl === 0) {
      var e = _a;
      e === 0 && (e = xr, xr <<= 1, (xr & 261888) === 0 && (xr = 256)), Xl = e;
    }
    return Xl;
  }
  function Zv(e) {
    return e == null || typeof e == "symbol" || typeof e == "boolean" ? null : typeof e == "function" ? e : zr(e);
  }
  function pw(e, t, l, a, u) {
    if (t === "submit" && l && l.stateNode === u) {
      var s = Zv(
        (u[qt] || null).action
      ), m = a.submitter;
      m && (t = (t = m[qt] || null) ? Zv(t.formAction) : m.getAttribute("formAction"), t !== null && (s = t, m = null));
      var w = new Dr(
        "action",
        "action",
        null,
        a,
        u
      );
      e.push({
        event: w,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (a.defaultPrevented) {
                if (Xl !== 0) {
                  var z = new FormData(u, m);
                  ef(
                    l,
                    {
                      pending: !0,
                      data: z,
                      method: u.method,
                      action: s
                    },
                    null,
                    z
                  );
                }
              } else
                typeof s == "function" && (w.preventDefault(), z = new FormData(u, m), ef(
                  l,
                  {
                    pending: !0,
                    data: z,
                    method: u.method,
                    action: s
                  },
                  s,
                  z
                ));
            },
            currentTarget: u
          }
        ]
      });
    }
  }
  for (var Xf = 0; Xf < yc.length; Xf++) {
    var Qf = yc[Xf], vw = Qf.toLowerCase(), yw = Qf[0].toUpperCase() + Qf.slice(1);
    _n(
      vw,
      "on" + yw
    );
  }
  _n(Ch, "onAnimationEnd"), _n(wh, "onAnimationIteration"), _n(Eh, "onAnimationStart"), _n("dblclick", "onDoubleClick"), _n("focusin", "onFocus"), _n("focusout", "onBlur"), _n(TC, "onTransitionRun"), _n(AC, "onTransitionStart"), _n(zC, "onTransitionCancel"), _n(Rh, "onTransitionEnd"), ni("onMouseEnter", ["mouseout", "mouseover"]), ni("onMouseLeave", ["mouseout", "mouseover"]), ni("onPointerEnter", ["pointerout", "pointerover"]), ni("onPointerLeave", ["pointerout", "pointerover"]), va(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), va(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), va("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), va(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), va(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), va(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var $o = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), bw = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat($o)
  );
  function Kv(e, t) {
    t = (t & 4) !== 0;
    for (var l = 0; l < e.length; l++) {
      var a = e[l], u = a.event;
      a = a.listeners;
      e: {
        var s = void 0;
        if (t)
          for (var m = a.length - 1; 0 <= m; m--) {
            var w = a[m], z = w.instance, k = w.currentTarget;
            if (w = w.listener, z !== s && u.isPropagationStopped())
              break e;
            s = w, u.currentTarget = k;
            try {
              s(u);
            } catch (Y) {
              Lr(Y);
            }
            u.currentTarget = null, s = z;
          }
        else
          for (m = 0; m < a.length; m++) {
            if (w = a[m], z = w.instance, k = w.currentTarget, w = w.listener, z !== s && u.isPropagationStopped())
              break e;
            s = w, u.currentTarget = k;
            try {
              s(u);
            } catch (Y) {
              Lr(Y);
            }
            u.currentTarget = null, s = z;
          }
      }
    }
  }
  function He(e, t) {
    var l = t[Lm];
    l === void 0 && (l = t[Lm] = /* @__PURE__ */ new Set());
    var a = e + "__bubble";
    l.has(a) || (Jv(t, e, 2, !1), l.add(a));
  }
  function Zf(e, t, l) {
    var a = 0;
    t && (a |= 4), Jv(
      l,
      e,
      a,
      t
    );
  }
  var ju = "_reactListening" + Math.random().toString(36).slice(2);
  function Kf(e) {
    if (!e[ju]) {
      e[ju] = !0, Gm.forEach(function(l) {
        l !== "selectionchange" && (bw.has(l) || Zf(l, !1, e), Zf(l, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[ju] || (t[ju] = !0, Zf("selectionchange", !1, t));
    }
  }
  function Jv(e, t, l, a) {
    switch (By(t)) {
      case 2:
        var u = fE;
        break;
      case 8:
        u = dE;
        break;
      default:
        u = vd;
    }
    l = u.bind(
      null,
      t,
      l,
      e
    ), u = void 0, !ac || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (u = !0), a ? u !== void 0 ? e.addEventListener(t, l, {
      capture: !0,
      passive: u
    }) : e.addEventListener(t, l, !0) : u !== void 0 ? e.addEventListener(t, l, {
      passive: u
    }) : e.addEventListener(t, l, !1);
  }
  function Jf(e, t, l, a, u) {
    var s = a;
    if ((t & 1) === 0 && (t & 2) === 0 && a !== null)
      e: for (; ; ) {
        if (a === null) return;
        var m = a.tag;
        if (m === 3 || m === 4) {
          var w = a.stateNode.containerInfo;
          if (w === u) break;
          if (m === 4)
            for (m = a.return; m !== null; ) {
              var z = m.tag;
              if ((z === 3 || z === 4) && m.stateNode.containerInfo === u)
                return;
              m = m.return;
            }
          for (; w !== null; ) {
            if (m = pa(w), m === null) return;
            if (z = m.tag, z === 5 || z === 6 || z === 26 || z === 27) {
              a = s = m;
              continue e;
            }
            w = w.parentNode;
          }
        }
        a = a.return;
      }
    Jm(function() {
      var k = s, Y = nc(l), ee = [];
      e: {
        var L = _h.get(e);
        if (L !== void 0) {
          var I = Dr, fe = e;
          switch (e) {
            case "keypress":
              if (Mr(l) === 0) break e;
            case "keydown":
            case "keyup":
              I = lC;
              break;
            case "focusin":
              fe = "focus", I = uc;
              break;
            case "focusout":
              fe = "blur", I = uc;
              break;
            case "beforeblur":
            case "afterblur":
              I = uc;
              break;
            case "click":
              if (l.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              I = th;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              I = $1;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              I = uC;
              break;
            case Ch:
            case wh:
            case Eh:
              I = X1;
              break;
            case Rh:
              I = cC;
              break;
            case "scroll":
            case "scrollend":
              I = P1;
              break;
            case "wheel":
              I = dC;
              break;
            case "copy":
            case "cut":
            case "paste":
              I = Z1;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              I = lh;
              break;
            case "submit":
              I = oC;
              break;
            case "toggle":
            case "beforetoggle":
              I = mC;
          }
          var be = (t & 4) !== 0, Ae = !be && (e === "scroll" || e === "scrollend"), G = be ? L !== null ? L + "Capture" : null : L;
          be = [];
          for (var N = k, q; N !== null; ) {
            var J = N;
            if (q = J.stateNode, J = J.tag, J !== 5 && J !== 26 && J !== 27 || q === null || G === null || (J = go(N, G), J != null && be.push(
              Yo(N, J, q)
            )), Ae) break;
            N = N.return;
          }
          0 < be.length && (L = new I(
            L,
            fe,
            null,
            l,
            Y
          ), ee.push({ event: L, listeners: be }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (I = e === "mouseover" || e === "pointerover", L = e === "mouseout" || e === "pointerout", I && l !== tc && (fe = l.relatedTarget || l.fromElement) && (pa(fe) || fe[Wa]))
            break e;
          (L || I) && (fe = Y.window === Y ? Y : (I = Y.ownerDocument) ? I.defaultView || I.parentWindow : window, L ? (I = l.relatedTarget || l.toElement, L = k, I = I ? pa(I) : null, I !== null && (Ae = f(I), be = I.tag, I !== Ae || be !== 5 && be !== 27 && be !== 6) && (I = null)) : (L = null, I = k), L !== I && (be = th, J = "onMouseLeave", G = "onMouseEnter", N = "mouse", (e === "pointerout" || e === "pointerover") && (be = lh, J = "onPointerLeave", G = "onPointerEnter", N = "pointer"), Ae = L == null ? fe : fo(L), q = I == null ? fe : fo(I), fe = new be(
            J,
            N + "leave",
            L,
            l,
            Y
          ), fe.target = Ae, fe.relatedTarget = q, J = null, pa(Y) === k && (be = new be(
            G,
            N + "enter",
            I,
            l,
            Y
          ), be.target = q, be.relatedTarget = Ae, J = be), Ae = J, be = L && I ? B(
            L,
            I,
            Sw
          ) : null, L !== null && Wv(
            ee,
            fe,
            L,
            be,
            !1
          ), I !== null && Ae !== null && Wv(
            ee,
            Ae,
            I,
            be,
            !0
          )));
        }
        e: {
          if (L = k ? fo(k) : window, I = L.nodeName && L.nodeName.toLowerCase(), I === "select" || I === "input" && L.type === "file")
            var pe = fh;
          else if (sh(L))
            if (dh)
              pe = EC;
            else {
              pe = CC;
              var Ue = xC;
            }
          else
            I = L.nodeName, !I || I.toLowerCase() !== "input" || L.type !== "checkbox" && L.type !== "radio" ? k && ec(k.elementType) && (pe = fh) : pe = wC;
          if (pe && (pe = pe(e, k))) {
            ch(
              ee,
              pe,
              l,
              Y
            );
            break e;
          }
          Ue && Ue(e, L, k);
        }
        switch (Ue = k ? fo(k) : window, e) {
          case "focusin":
            (sh(Ue) || Ue.contentEditable === "true") && (ui = Ue, hc = k, xo = null);
            break;
          case "focusout":
            xo = hc = ui = null;
            break;
          case "mousedown":
            pc = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            pc = !1, Sh(ee, l, Y);
            break;
          case "selectionchange":
            if (_C) break;
          case "keydown":
          case "keyup":
            Sh(ee, l, Y);
        }
        var Se;
        if (cc)
          e: {
            switch (e) {
              case "compositionstart":
                var xe = "onCompositionStart";
                break e;
              case "compositionend":
                xe = "onCompositionEnd";
                break e;
              case "compositionupdate":
                xe = "onCompositionUpdate";
                break e;
            }
            xe = void 0;
          }
        else
          ri ? rh(e, l) && (xe = "onCompositionEnd") : e === "keydown" && l.keyCode === 229 && (xe = "onCompositionStart");
        xe && (ah && l.locale !== "ko" && (ri || xe !== "onCompositionStart" ? xe === "onCompositionEnd" && ri && (Se = Wm()) : (zl = Y, ic = "value" in zl ? zl.value : zl.textContent, ri = !0)), Ue = Hu(k, xe), 0 < Ue.length && (xe = new nh(
          xe,
          e,
          null,
          l,
          Y
        ), ee.push({ event: xe, listeners: Ue }), Se ? xe.data = Se : (Se = uh(l), Se !== null && (xe.data = Se)))), (Se = pC ? vC(e, l) : yC(e, l)) && (xe = Hu(k, "onBeforeInput"), 0 < xe.length && (Ue = new nh(
          "onBeforeInput",
          "beforeinput",
          null,
          l,
          Y
        ), ee.push({
          event: Ue,
          listeners: xe
        }), Ue.data = Se)), pw(
          ee,
          e,
          k,
          l,
          Y
        );
      }
      Kv(ee, t);
    });
  }
  function Yo(e, t, l) {
    return {
      instance: e,
      listener: t,
      currentTarget: l
    };
  }
  function Hu(e, t) {
    for (var l = t + "Capture", a = []; e !== null; ) {
      var u = e, s = u.stateNode;
      if (u = u.tag, u !== 5 && u !== 26 && u !== 27 || s === null || (u = go(e, l), u != null && a.unshift(
        Yo(e, u, s)
      ), u = go(e, t), u != null && a.push(
        Yo(e, u, s)
      )), e.tag === 3) return a;
      e = e.return;
    }
    return [];
  }
  function Sw(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function Wv(e, t, l, a, u) {
    for (var s = t._reactName, m = []; l !== null && l !== a; ) {
      var w = l, z = w.alternate, k = w.stateNode;
      if (w = w.tag, z !== null && z === a) break;
      w !== 5 && w !== 26 && w !== 27 || k === null || (z = k, u ? (k = go(l, s), k != null && m.unshift(
        Yo(l, k, z)
      )) : u || (k = go(l, s), k != null && m.push(
        Yo(l, k, z)
      ))), l = l.return;
    }
    m.length !== 0 && e.push({ event: t, listeners: m });
  }
  var xw = /\r\n?/g, Cw = /\u0000|\uFFFD/g;
  function ey(e) {
    return (typeof e == "string" ? e : "" + e).replace(xw, `
`).replace(Cw, "");
  }
  function ty(e, t) {
    return t = ey(t), ey(e) === t;
  }
  function Ie(e, t, l, a, u, s) {
    switch (l) {
      case "children":
        if (typeof a == "string")
          t === "body" || t === "textarea" && a === "" || ai(e, a);
        else if (typeof a == "number" || typeof a == "bigint")
          t !== "body" && ai(e, "" + a);
        else return;
        break;
      case "className":
        Ar(e, "class", a);
        break;
      case "tabIndex":
        Ar(e, "tabindex", a);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Ar(e, l, a);
        break;
      case "style":
        Zm(e, a, s);
        return;
      case "data":
        if (t !== "object") {
          Ar(e, "data", a);
          break;
        }
      case "src":
      case "href":
        if (a === "" && (t !== "a" || l !== "href")) {
          e.removeAttribute(l);
          break;
        }
        if (a == null || typeof a == "function" || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = zr(a), e.setAttribute(l, a);
        break;
      case "action":
      case "formAction":
        if (typeof a == "function") {
          e.setAttribute(
            l,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof s == "function" && (l === "formAction" ? (t !== "input" && Ie(e, t, "name", u.name, u, null), Ie(
            e,
            t,
            "formEncType",
            u.formEncType,
            u,
            null
          ), Ie(
            e,
            t,
            "formMethod",
            u.formMethod,
            u,
            null
          ), Ie(
            e,
            t,
            "formTarget",
            u.formTarget,
            u,
            null
          )) : (Ie(e, t, "encType", u.encType, u, null), Ie(e, t, "method", u.method, u, null), Ie(e, t, "target", u.target, u, null)));
        if (a == null || typeof a == "symbol" || typeof a == "boolean") {
          e.removeAttribute(l);
          break;
        }
        a = zr(a), e.setAttribute(l, a);
        break;
      case "onClick":
        a != null && (e.onclick = Un);
        return;
      case "onScroll":
        a != null && He("scroll", e);
        return;
      case "onScrollEnd":
        a != null && He("scrollend", e);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (u.children != null) throw Error(r(60));
            s?.__html !== l && (e.innerHTML = l);
          }
        }
        break;
      case "multiple":
        e.multiple = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "muted":
        e.muted = a && typeof a != "function" && typeof a != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (a == null || typeof a == "function" || typeof a == "boolean" || typeof a == "symbol") {
          e.removeAttribute("xlink:href");
          break;
        }
        l = zr(a), e.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          l
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        a && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, "") : e.removeAttribute(l);
        break;
      case "capture":
      case "download":
        a === !0 ? e.setAttribute(l, "") : a !== !1 && a != null && typeof a != "function" && typeof a != "symbol" ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        a != null && typeof a != "function" && typeof a != "symbol" && !isNaN(a) && 1 <= a ? e.setAttribute(l, a) : e.removeAttribute(l);
        break;
      case "rowSpan":
      case "start":
        a == null || typeof a == "function" || typeof a == "symbol" || isNaN(a) ? e.removeAttribute(l) : e.setAttribute(l, a);
        break;
      case "popover":
        He("beforetoggle", e), He("toggle", e), Tr(e, "popover", a);
        break;
      case "xlinkActuate":
        nl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          a
        );
        break;
      case "xlinkArcrole":
        nl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          a
        );
        break;
      case "xlinkRole":
        nl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          a
        );
        break;
      case "xlinkShow":
        nl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          a
        );
        break;
      case "xlinkTitle":
        nl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          a
        );
        break;
      case "xlinkType":
        nl(
          e,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          a
        );
        break;
      case "xmlBase":
        nl(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          a
        );
        break;
      case "xmlLang":
        nl(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          a
        );
        break;
      case "xmlSpace":
        nl(
          e,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          a
        );
        break;
      case "is":
        Tr(e, "is", a);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < l.length) || l[0] !== "o" && l[0] !== "O" || l[1] !== "n" && l[1] !== "N")
          l = B1.get(l) || l, Tr(e, l, a);
        else return;
    }
    Ge = !0;
  }
  function Wf(e, t, l, a, u, s) {
    switch (l) {
      case "style":
        Zm(e, a, s);
        return;
      case "dangerouslySetInnerHTML":
        if (a != null) {
          if (typeof a != "object" || !("__html" in a))
            throw Error(r(61));
          if (l = a.__html, l != null) {
            if (u.children != null) throw Error(r(60));
            s?.__html !== l && (e.innerHTML = l);
          }
        }
        break;
      case "children":
        if (typeof a == "string") ai(e, a);
        else if (typeof a == "number" || typeof a == "bigint")
          ai(e, "" + a);
        else return;
        break;
      case "onScroll":
        a != null && He("scroll", e);
        return;
      case "onScrollEnd":
        a != null && He("scrollend", e);
        return;
      case "onClick":
        a != null && (e.onclick = Un);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!km.hasOwnProperty(l))
          e: {
            if (l[0] === "o" && l[1] === "n" && (u = l.endsWith("Capture"), s = l.slice(2, u ? l.length - 7 : void 0), t = e[qt] || null, t = t != null ? t[l] : null, typeof t == "function" && e.removeEventListener(s, t, u), typeof a == "function")) {
              typeof t != "function" && t !== null && (l in e ? e[l] = null : e.hasAttribute(l) && e.removeAttribute(l)), e.addEventListener(s, a, u);
              break e;
            }
            Ge = !0, l in e ? e[l] = a : a === !0 ? e.setAttribute(l, "") : Tr(e, l, a);
          }
        return;
    }
    Ge = !0;
  }
  function zt(e, t, l) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        He("error", e), He("load", e);
        var a = !1, u = !1, s;
        for (s in l)
          if (l.hasOwnProperty(s)) {
            var m = l[s];
            if (m != null)
              switch (s) {
                case "src":
                  a = !0;
                  break;
                case "srcSet":
                  u = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(r(137, t));
                default:
                  Ie(e, t, s, m, l, null);
              }
          }
        u && Ie(e, t, "srcSet", l.srcSet, l, null), a && Ie(e, t, "src", l.src, l, null);
        return;
      case "input":
        He("invalid", e);
        var w = s = m = u = null, z = null, k = null;
        for (a in l)
          if (l.hasOwnProperty(a)) {
            var Y = l[a];
            if (Y != null)
              switch (a) {
                case "name":
                  u = Y;
                  break;
                case "type":
                  m = Y;
                  break;
                case "checked":
                  z = Y;
                  break;
                case "defaultChecked":
                  k = Y;
                  break;
                case "value":
                  s = Y;
                  break;
                case "defaultValue":
                  w = Y;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (Y != null)
                    throw Error(r(137, t));
                  break;
                default:
                  Ie(e, t, a, Y, l, null);
              }
          }
        Ym(
          e,
          s,
          w,
          z,
          k,
          m,
          u,
          !1
        );
        return;
      case "select":
        He("invalid", e), a = m = s = null;
        for (u in l)
          if (l.hasOwnProperty(u) && (w = l[u], w != null))
            switch (u) {
              case "value":
                s = w;
                break;
              case "defaultValue":
                m = w;
                break;
              case "multiple":
                a = w;
              default:
                Ie(e, t, u, w, l, null);
            }
        t = s, l = m, e.multiple = !!a, t != null ? li(e, !!a, t, !1) : l != null && li(e, !!a, l, !0);
        return;
      case "textarea":
        He("invalid", e), s = u = a = null;
        for (m in l)
          if (l.hasOwnProperty(m) && (w = l[m], w != null))
            switch (m) {
              case "value":
                a = w;
                break;
              case "defaultValue":
                u = w;
                break;
              case "children":
                s = w;
                break;
              case "dangerouslySetInnerHTML":
                if (w != null) throw Error(r(91));
                break;
              default:
                Ie(e, t, m, w, l, null);
            }
        Xm(e, a, u, s);
        return;
      case "option":
        for (z in l)
          l.hasOwnProperty(z) && (a = l[z], a != null) && (z === "selected" ? e.selected = a && typeof a != "function" && typeof a != "symbol" : Ie(e, t, z, a, l, null));
        return;
      case "dialog":
        He("beforetoggle", e), He("toggle", e), He("cancel", e), He("close", e);
        break;
      case "iframe":
      case "object":
        He("load", e);
        break;
      case "video":
      case "audio":
        for (a = 0; a < $o.length; a++)
          He($o[a], e);
        break;
      case "image":
        He("error", e), He("load", e);
        break;
      case "details":
        He("toggle", e);
        break;
      case "embed":
      case "source":
      case "link":
        He("error", e), He("load", e);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (k in l)
          if (l.hasOwnProperty(k) && (a = l[k], a != null))
            switch (k) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(r(137, t));
              default:
                Ie(e, t, k, a, l, null);
            }
        return;
      default:
        if (ec(t)) {
          for (Y in l)
            l.hasOwnProperty(Y) && (a = l[Y], a !== void 0 && Wf(
              e,
              t,
              Y,
              a,
              l,
              void 0
            ));
          return;
        }
    }
    for (w in l)
      l.hasOwnProperty(w) && (a = l[w], a != null && Ie(e, t, w, a, l, null));
  }
  var ww = {};
  function Ew(e, t, l, a) {
    switch (t) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var u = null, s = null, m = null, w = null, z = null, k = null, Y = null;
        for (I in l) {
          var ee = l[I];
          if (l.hasOwnProperty(I) && ee != null)
            switch (I) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                z = ee;
              default:
                a.hasOwnProperty(I) || Ie(e, t, I, null, a, ee);
            }
        }
        for (var L in a) {
          var I = a[L];
          if (ee = l[L], a.hasOwnProperty(L) && (I != null || ee != null))
            switch (L) {
              case "type":
                I !== ee && (Ge = !0), s = I;
                break;
              case "name":
                I !== ee && (Ge = !0), u = I;
                break;
              case "checked":
                I !== ee && (Ge = !0), k = I;
                break;
              case "defaultChecked":
                I !== ee && (Ge = !0), Y = I;
                break;
              case "value":
                I !== ee && (Ge = !0), m = I;
                break;
              case "defaultValue":
                I !== ee && (Ge = !0), w = I;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (I != null)
                  throw Error(r(137, t));
                break;
              default:
                I !== ee && Ie(
                  e,
                  t,
                  L,
                  I,
                  a,
                  ee
                );
            }
        }
        Js(
          e,
          m,
          w,
          z,
          k,
          Y,
          s,
          u
        );
        return;
      case "select":
        I = m = w = L = null;
        for (s in l)
          if (z = l[s], l.hasOwnProperty(s) && z != null)
            switch (s) {
              case "value":
                break;
              case "multiple":
                I = z;
              default:
                a.hasOwnProperty(s) || Ie(
                  e,
                  t,
                  s,
                  null,
                  a,
                  z
                );
            }
        for (u in a)
          if (s = a[u], z = l[u], a.hasOwnProperty(u) && (s != null || z != null))
            switch (u) {
              case "value":
                s !== z && (Ge = !0), L = s;
                break;
              case "defaultValue":
                s !== z && (Ge = !0), w = s;
                break;
              case "multiple":
                s !== z && (Ge = !0), m = s;
              default:
                s !== z && Ie(
                  e,
                  t,
                  u,
                  s,
                  a,
                  z
                );
            }
        t = w, l = m, a = I, L != null ? li(e, !!l, L, !1) : !!a != !!l && (t != null ? li(e, !!l, t, !0) : li(e, !!l, l ? [] : "", !1));
        return;
      case "textarea":
        I = L = null;
        for (w in l)
          if (u = l[w], l.hasOwnProperty(w) && u != null && !a.hasOwnProperty(w))
            switch (w) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ie(e, t, w, null, a, u);
            }
        for (m in a)
          if (u = a[m], s = l[m], a.hasOwnProperty(m) && (u != null || s != null))
            switch (m) {
              case "value":
                u !== s && (Ge = !0), L = u;
                break;
              case "defaultValue":
                u !== s && (Ge = !0), I = u;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (u != null) throw Error(r(91));
                break;
              default:
                u !== s && Ie(e, t, m, u, a, s);
            }
        Fm(e, L, I);
        return;
      case "option":
        for (var fe in l)
          L = l[fe], l.hasOwnProperty(fe) && L != null && !a.hasOwnProperty(fe) && (fe === "selected" ? e.selected = !1 : Ie(
            e,
            t,
            fe,
            null,
            a,
            L
          ));
        for (z in a)
          L = a[z], I = l[z], a.hasOwnProperty(z) && L !== I && (L != null || I != null) && (z === "selected" ? (L !== I && (Ge = !0), e.selected = L && typeof L != "function" && typeof L != "symbol") : Ie(
            e,
            t,
            z,
            L,
            a,
            I
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var be in l)
          L = l[be], l.hasOwnProperty(be) && L != null && !a.hasOwnProperty(be) && Ie(e, t, be, null, a, L);
        for (k in a)
          if (L = a[k], I = l[k], a.hasOwnProperty(k) && L !== I && (L != null || I != null))
            switch (k) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (L != null)
                  throw Error(r(137, t));
                break;
              default:
                Ie(
                  e,
                  t,
                  k,
                  L,
                  a,
                  I
                );
            }
        return;
      default:
        if (ec(t)) {
          for (var Ae in l)
            L = l[Ae], l.hasOwnProperty(Ae) && L !== void 0 && !a.hasOwnProperty(Ae) && Wf(
              e,
              t,
              Ae,
              void 0,
              a,
              L
            );
          for (Y in a)
            L = a[Y], I = l[Y], !a.hasOwnProperty(Y) || L === I || L === void 0 && I === void 0 || Wf(
              e,
              t,
              Y,
              L,
              a,
              I
            );
          return;
        }
    }
    for (var G in l)
      L = l[G], l.hasOwnProperty(G) && L != null && !a.hasOwnProperty(G) && Ie(e, t, G, null, a, L);
    for (ee in a)
      L = a[ee], I = l[ee], !a.hasOwnProperty(ee) || L === I || L == null && I == null || Ie(e, t, ee, L, a, I);
  }
  function ny(e) {
    switch (e) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function Rw() {
    if (typeof performance.getEntriesByType == "function") {
      for (var e = 0, t = 0, l = performance.getEntriesByType("resource"), a = 0; a < l.length; a++) {
        var u = l[a], s = u.transferSize, m = u.initiatorType, w = u.duration;
        if (s && w && ny(m)) {
          for (m = 0, w = u.responseEnd, a += 1; a < l.length; a++) {
            var z = l[a], k = z.startTime;
            if (k > w) break;
            var Y = z.transferSize, ee = z.initiatorType;
            Y && ny(ee) && (z = z.responseEnd, m += Y * (z < w ? 1 : (w - k) / (z - k)));
          }
          if (--a, t += 8 * (s + m) / (u.duration / 1e3), e++, 10 < e) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && (e = navigator.connection.downlink, typeof e == "number") ? e : 5;
  }
  var ed = null, td = null;
  function Fo(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function ly(e) {
    switch (e) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function ay(e, t) {
    if (e === 0)
      switch (t) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === "foreignObject" ? 0 : e;
  }
  function iy(e, t, l, a) {
    return l = Fo(
      l
    ).createElement(e), l[Et] = a, l[qt] = t, zt(l, e, t), vt(l), l;
  }
  function nd(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.children == "bigint" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var ld = null;
  function _w() {
    var e = window.event;
    return e && e.type === "popstate" ? e === ld ? !1 : (ld = e, !0) : (ld = null, !1);
  }
  var ad = typeof setTimeout == "function" ? setTimeout : void 0, Tw = typeof clearTimeout == "function" ? clearTimeout : void 0, oy = typeof Promise == "function" ? Promise : void 0, ry = typeof requestAnimationFrame == "function" ? requestAnimationFrame : ad, Aw = typeof queueMicrotask == "function" ? queueMicrotask : typeof oy < "u" ? function(e) {
    return oy.resolve(null).then(e).catch(zw);
  } : ad;
  function zw(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Ql(e) {
    return e === "head";
  }
  function uy(e, t) {
    var l = t, a = 0;
    do {
      var u = l.nextSibling;
      if (e.removeChild(l), u && u.nodeType === 8)
        if (l = u.data, l === "/$" || l === "/&") {
          if (a === 0) {
            e.removeChild(u), Bi(t);
            return;
          }
          a--;
        } else if (l === "$" || l === "$?" || l === "$~" || l === "$!" || l === "&")
          a++;
        else if (l === "html")
          dd(
            e.ownerDocument.documentElement
          );
        else if (l === "head") {
          l = e.ownerDocument.head, dd(l);
          for (var s = l.firstChild; s; ) {
            var m = s.nextSibling, w = s.nodeName;
            s[co] || w === "SCRIPT" || w === "STYLE" || w === "LINK" && s.rel.toLowerCase() === "stylesheet" || l.removeChild(s), s = m;
          }
        } else
          l === "body" && dd(e.ownerDocument.body);
      l = u;
    } while (l);
    Bi(t);
  }
  function sy(e, t) {
    var l = e;
    e = 0;
    do {
      var a = l.nextSibling;
      if (l.nodeType === 1 ? t ? (l._stashedDisplay = l.style.display, l.style.display = "none") : (l.style.display = l._stashedDisplay || "", l.getAttribute("style") === "" && l.removeAttribute("style")) : l.nodeType === 3 && (t ? (l._stashedText = l.nodeValue, l.nodeValue = "") : l.nodeValue = l._stashedText || ""), a && a.nodeType === 8)
        if (l = a.data, l === "/$") {
          if (e === 0) break;
          e--;
        } else
          l !== "$" && l !== "$?" && l !== "$~" && l !== "$!" || e++;
      l = a;
    } while (l);
  }
  function cy(e, t, l) {
    if (t = CSS.escape(t) !== t ? "r-" + btoa(t).replace(/=/g, "") : t, e.style.viewTransitionName = t, l != null && (e.style.viewTransitionClass = l), l = getComputedStyle(e), l.display === "inline") {
      if (t = e.getClientRects(), t.length === 1) var a = 1;
      else
        for (var u = a = 0; u < t.length; u++) {
          var s = t[u];
          0 < s.width && 0 < s.height && a++;
        }
      a === 1 && (e = e.style, e.display = t.length === 1 ? "inline-block" : "block", e.marginTop = "-" + l.paddingTop, e.marginBottom = "-" + l.paddingBottom);
    }
  }
  function fy(e, t) {
    e = e.style, t = t.style;
    var l = t != null ? t.hasOwnProperty("viewTransitionName") ? t.viewTransitionName : t.hasOwnProperty("view-transition-name") ? t["view-transition-name"] : null : null;
    e.viewTransitionName = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), l = t != null ? t.hasOwnProperty("viewTransitionClass") ? t.viewTransitionClass : t.hasOwnProperty("view-transition-class") ? t["view-transition-class"] : null : null, e.viewTransitionClass = l == null || typeof l == "boolean" ? "" : ("" + l).trim(), e.display === "inline-block" && (t == null ? e.display = e.margin = "" : (l = t.display, e.display = l == null || typeof l == "boolean" ? "" : l, l = t.margin, l != null ? e.margin = l : (l = t.hasOwnProperty("marginTop") ? t.marginTop : t["margin-top"], e.marginTop = l == null || typeof l == "boolean" ? "" : l, t = t.hasOwnProperty("marginBottom") ? t.marginBottom : t["margin-bottom"], e.marginBottom = t == null || typeof t == "boolean" ? "" : t)));
  }
  function Ow(e, t, l) {
    return l = l.ownerDocument.defaultView, {
      rect: e,
      abs: t.position === "absolute" || t.position === "fixed",
      clip: t.clipPath !== "none" || t.overflow !== "visible" || t.filter !== "none" || t.mask !== "none" || t.mask !== "none" || t.borderRadius !== "0px",
      view: 0 <= e.bottom && 0 <= e.right && e.top <= l.innerHeight && e.left <= l.innerWidth
    };
  }
  function id(e) {
    var t = e.getBoundingClientRect(), l = getComputedStyle(e);
    return Ow(t, l, e);
  }
  function Mw(e) {
    return e.documentElement.clientHeight;
  }
  function Nw(e) {
    this.addEventListener("load", e), this.addEventListener("error", e);
  }
  function Dw(e, t, l, a, u, s, m, w, z) {
    var k = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var Y = k.startViewTransition({
        update: function() {
          var L = k.defaultView, I = L.navigation && L.navigation.transition, fe = k.fonts.status;
          a();
          var be = [];
          if (fe === "loaded" && (Mw(k), k.fonts.status === "loading" && be.push(k.fonts.ready)), fe = be.length, e !== null)
            for (var Ae = e.suspenseyImages, G = 0, N = 0; N < Ae.length; N++) {
              var q = Ae[N];
              if (!q.complete) {
                var J = q.getBoundingClientRect();
                if (0 < J.bottom && 0 < J.right && J.top < L.innerHeight && J.left < L.innerWidth) {
                  if (G += Ny(q), G > Vu) {
                    be.length = fe;
                    break;
                  }
                  q = new Promise(
                    Nw.bind(q)
                  ), be.push(q);
                }
              }
            }
          if (0 < be.length)
            return L = Promise.race([
              Promise.all(be),
              new Promise(function(pe) {
                return setTimeout(pe, 500);
              })
            ]).then(u, u), (I ? Promise.allSettled([I.finished, L]) : L).then(s, s);
          if (u(), I)
            return I.finished.then(
              s,
              s
            );
          s();
        },
        types: l
      });
      k.__reactViewTransition = Y;
      var ee = [];
      return Y.ready.then(
        function() {
          for (var L = k.documentElement.getAnimations({
            subtree: !0
          }), I = 0; I < L.length; I++) {
            var fe = L[I], be = fe.effect, Ae = be.pseudoElement;
            if (Ae != null && Ae.startsWith("::view-transition")) {
              ee.push(fe), fe = be.getKeyframes();
              for (var G = Ae = void 0, N = !0, q = 0; q < fe.length; q++) {
                var J = fe[q], pe = J.width;
                if (Ae === void 0) Ae = pe;
                else if (Ae !== pe) {
                  N = !1;
                  break;
                }
                if (pe = J.height, G === void 0) G = pe;
                else if (G !== pe) {
                  N = !1;
                  break;
                }
                delete J.width, delete J.height, J.transform === "none" && delete J.transform;
              }
              N && Ae !== void 0 && G !== void 0 && (be.setKeyframes(fe), N = getComputedStyle(
                be.target,
                be.pseudoElement
              ), N.width !== Ae || N.height !== G) && (N = fe[0], N.width = Ae, N.height = G, N = fe[fe.length - 1], N.width = Ae, N.height = G, be.setKeyframes(fe));
            }
          }
          m();
        },
        function(L) {
          k.__reactViewTransition === Y && (k.__reactViewTransition = null);
          try {
            typeof L == "object" && L !== null && L.name === "InvalidStateError" && (L.message === "View transition was skipped because document visibility state is hidden." || L.message === "Skipping view transition because document visibility state has become hidden." || L.message === "Skipping view transition because viewport size changed." || L.message === "Transition was aborted because of invalid state") && (L = null), L !== null && z(L);
          } finally {
            a(), u(), m();
          }
        }
      ), Y.finished.finally(function() {
        for (var L = 0; L < ee.length; L++)
          ee[L].cancel();
        k.__reactViewTransition === Y && (k.__reactViewTransition = null), w();
      }), Y;
    } catch {
      return a(), u(), m(), null;
    }
  }
  function Ua(e, t) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + e + "(" + t + ")";
  }
  Ua.prototype.animate = function(e, t) {
    return t = typeof t == "number" ? { duration: t } : H({}, t), t.pseudoElement = this._selector, this._scope.animate(e, t);
  }, Ua.prototype.getAnimations = function() {
    for (var e = this._scope, t = this._selector, l = e.getAnimations({ subtree: !0 }), a = [], u = 0; u < l.length; u++) {
      var s = l[u].effect;
      s !== null && s.target === e && s.pseudoElement === t && a.push(l[u]);
    }
    return a;
  }, Ua.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function dy(e) {
    return {
      name: e,
      group: new Ua("group", e),
      imagePair: new Ua("image-pair", e),
      old: new Ua("old", e),
      new: new Ua("new", e)
    };
  }
  function un(e) {
    this._fragmentFiber = e, this._observers = this._eventListeners = null;
  }
  un.prototype.addEventListener = function(e, t, l) {
    var a = null, u = null;
    if (!(l != null && typeof l != "boolean" && (a = l.signal || null, a !== null && a.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var s = this._eventListeners;
      if (my(s, e, t, l) === -1) {
        var m = this, w = t;
        l != null && typeof l != "boolean" && l.once === !0 && (w = function(z) {
          m.removeEventListener(
            e,
            t,
            l
          ), typeof t == "function" ? t.call(this, z) : t.handleEvent(z);
        }), a !== null && (u = m.removeEventListener.bind(
          m,
          e,
          t,
          l
        ), a.addEventListener("abort", u, { once: !0 }), u = a.removeEventListener.bind(a, "abort", u)), a = Hi(l), s.push({
          type: e,
          listener: t,
          optionsOrUseCapture: l,
          attachedListener: w,
          cleanup: u
        }), p(
          this._fragmentFiber.child,
          !1,
          jw,
          e,
          w,
          a
        );
      }
      this._eventListeners = s;
    }
  };
  function jw(e, t, l, a) {
    return T(e).addEventListener(
      t,
      l,
      a
    ), !1;
  }
  un.prototype.removeEventListener = function(e, t, l) {
    var a = this._eventListeners;
    if (a !== null && (t = my(
      a,
      e,
      t,
      l
    ), t !== -1)) {
      var u = a[t];
      l = u.attachedListener;
      var s = u.cleanup;
      u = Hi(u.optionsOrUseCapture), p(
        this._fragmentFiber.child,
        !1,
        Hw,
        e,
        l,
        u
      ), a.splice(t, 1), s !== null && s();
    }
  };
  function Hw(e, t, l, a) {
    return T(e).removeEventListener(
      t,
      l,
      a
    ), !1;
  }
  function Hi(e) {
    return e != null && typeof e != "boolean" && (e.once === !0 || e.signal instanceof AbortSignal) ? { capture: e.capture, passive: e.passive } : e;
  }
  function gy(e) {
    return e == null ? "c=0" : typeof e == "boolean" ? "c=" + (e ? "1" : "0") : "c=" + (e.capture ? "1" : "0");
  }
  function my(e, t, l, a) {
    if (e.length === 0) return -1;
    a = gy(a);
    for (var u = 0; u < e.length; u++) {
      var s = e[u];
      if (s.type === t && s.listener === l && gy(s.optionsOrUseCapture) === a)
        return u;
    }
    return -1;
  }
  un.prototype.dispatchEvent = function(e) {
    var t = S(
      this._fragmentFiber
    );
    if (t === null) return !0;
    t = T(t);
    var l = this._eventListeners;
    if (l !== null && 0 < l.length || !e.bubbles) {
      var a = t.nodeType === 9 ? t.createComment("") : document.createTextNode("");
      if (l)
        for (var u = 0; u < l.length; u++) {
          var s = l[u];
          a.addEventListener(
            s.type,
            s.attachedListener,
            Hi(s.optionsOrUseCapture)
          );
        }
      if (t.appendChild(a), e = a.dispatchEvent(e), l)
        for (u = 0; u < l.length; u++)
          s = l[u], a.removeEventListener(
            s.type,
            s.attachedListener,
            Hi(s.optionsOrUseCapture)
          );
      return t.removeChild(a), e;
    }
    return t.dispatchEvent(e);
  }, un.prototype.focus = function(e) {
    p(
      this._fragmentFiber.child,
      !0,
      hy,
      e,
      void 0,
      void 0
    );
  };
  function hy(e, t) {
    return e.tag === 6 ? !1 : (e = T(e), Fw(e, t));
  }
  un.prototype.focusLast = function(e) {
    var t = [];
    p(
      this._fragmentFiber.child,
      !0,
      od,
      t,
      void 0,
      void 0
    );
    for (var l = t.length - 1; 0 <= l && !hy(t[l], e); l--) ;
  };
  function od(e, t) {
    return t.push(e), !1;
  }
  un.prototype.blur = function() {
    var e = S(
      this._fragmentFiber
    );
    e !== null && (e = T(e), e = Fo(e).activeElement, e !== null && p(
      this._fragmentFiber.child,
      !1,
      Lw,
      e,
      void 0,
      void 0
    ));
  };
  function Lw(e, t) {
    return e.tag === 6 ? !1 : (e = T(e), e === t || e.contains(t) ? (t.blur(), !0) : !1);
  }
  un.prototype.observeUsing = function(e) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(e), p(
      this._fragmentFiber.child,
      !1,
      Uw,
      e,
      void 0,
      void 0
    );
  };
  function Uw(e, t) {
    return e.tag === 6 || (e = T(e), t.observe(e)), !1;
  }
  un.prototype.unobserveUsing = function(e) {
    var t = this._observers;
    if (t !== null && t.has(e)) {
      t.delete(e), p(
        this._fragmentFiber.child,
        !1,
        Vw,
        e,
        void 0,
        void 0
      );
      for (var l = t = 0; l < Mn.length; l++) {
        var a = Mn[l];
        a.fragmentInstance === this && a.observer === e ? e.unobserve(a.instance) : Mn[t++] = a;
      }
      Mn.length = t;
    }
  };
  function Vw(e, t) {
    return e.tag === 6 || (e = T(e), t.unobserve(e)), !1;
  }
  var Mn = [], rd = !1;
  function Gw(e, t, l) {
    Mn.push({
      fragmentInstance: e,
      observer: t,
      instance: l
    }), rd || (rd = !0, Xw(function() {
      rd = !1;
      var a = Mn;
      Mn = [];
      for (var u = 0; u < a.length; u++) {
        var s = a[u];
        s.observer.unobserve(s.instance);
      }
    }));
  }
  un.prototype.getClientRects = function() {
    var e = [];
    return p(
      this._fragmentFiber.child,
      !1,
      kw,
      e,
      void 0,
      void 0
    ), e;
  };
  function kw(e, t) {
    if (e.tag === 6) {
      e = e.stateNode;
      var l = e.ownerDocument.createRange();
      l.selectNodeContents(e), t.push.apply(t, l.getClientRects());
    } else
      e = T(e), t.push.apply(t, e.getClientRects());
    return !1;
  }
  un.prototype.getRootNode = function(e) {
    var t = S(
      this._fragmentFiber
    );
    return t === null ? this : T(t).getRootNode(e);
  }, un.prototype.compareDocumentPosition = function(e) {
    var t = S(
      this._fragmentFiber
    );
    if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var l = [];
    p(
      this._fragmentFiber.child,
      !1,
      od,
      l,
      void 0,
      void 0
    );
    var a = T(t);
    if (l.length === 0) {
      if (l = a, C(this._fragmentFiber)) {
        e: {
          for (t = this._fragmentFiber.return; t !== null; ) {
            if (t.tag === 4) {
              t = t.stateNode.containerInfo;
              break e;
            }
            if (t.tag === 3 || t.tag === 5 || t.tag === 27)
              break;
            t = t.return;
          }
          t = null;
        }
        t != null && (l = t);
      }
      t = this._fragmentFiber;
      var u = a = l.compareDocumentPosition(e);
      return l === e ? u = Node.DOCUMENT_POSITION_CONTAINS : a & Node.DOCUMENT_POSITION_CONTAINED_BY && (l = R(t)[1], l === null ? u = Node.DOCUMENT_POSITION_PRECEDING : (e = T(l).compareDocumentPosition(
        e
      ), u = e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), u |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    t = T(l[0]), u = T(l[l.length - 1]);
    var s = C(this._fragmentFiber) ? t.parentElement : a;
    if (s == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    a = s.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY, s = s.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var m = t.compareDocumentPosition(e), w = u.compareDocumentPosition(e), z = m & Node.DOCUMENT_POSITION_CONTAINED_BY || w & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return w = a && s && m & Node.DOCUMENT_POSITION_FOLLOWING && w & Node.DOCUMENT_POSITION_PRECEDING, t = a && t === e || s && u === e || z || w ? Node.DOCUMENT_POSITION_CONTAINED_BY : !a && t === e || !s && u === e ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : m, t & Node.DOCUMENT_POSITION_DISCONNECTED || t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Bw(
      t,
      this._fragmentFiber,
      l[0],
      l[l.length - 1],
      e
    ) ? t : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function Bw(e, t, l, a, u) {
    var s = pa(u);
    if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (l = !!s)
        e: {
          for (; s !== null; ) {
            if (s.tag === 7 && (s === t || s.alternate === t)) {
              l = !0;
              break e;
            }
            s = s.return;
          }
          l = !1;
        }
      return l;
    }
    if (e & Node.DOCUMENT_POSITION_CONTAINS) {
      if (s === null)
        return s = u.ownerDocument, u === s || u === s.documentElement || u === s.body;
      e: {
        for (s = t, t = S(t); s !== null; ) {
          if (!(s.tag !== 5 && s.tag !== 3 && s.tag !== 27 || s !== t && s.alternate !== t)) {
            s = !0;
            break e;
          }
          s = s.return;
        }
        s = !1;
      }
      return s;
    }
    return e & Node.DOCUMENT_POSITION_PRECEDING ? ((t = !!s) && !(t = s === l) && (t = B(
      l,
      s,
      Q
    ), t === null ? t = !1 : (p(
      t,
      !0,
      U,
      s,
      l
    ), s = O, O = null, t = s !== null)), t) : e & Node.DOCUMENT_POSITION_FOLLOWING ? ((t = !!s) && !(t = s === a) && (t = B(
      a,
      s,
      Q
    ), t === null ? t = !1 : (p(
      t,
      !0,
      P,
      s,
      a
    ), s = O, D = O = null, t = s !== null)), t) : !1;
  }
  function py(e, t) {
    var l = e.ownerDocument.createRange();
    l.selectNodeContents(e), e = l.getBoundingClientRect(), window.scrollTo(
      window.scrollX + e.left,
      t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight
    );
  }
  un.prototype.scrollIntoView = function(e) {
    if (typeof e == "object") throw Error(r(566));
    var t = [];
    p(
      this._fragmentFiber.child,
      !1,
      od,
      t,
      void 0,
      void 0
    );
    var l = e !== !1;
    if (t.length === 0) {
      var a = R(
        this._fragmentFiber
      );
      if (a = l ? a[1] || a[0] || S(this._fragmentFiber) : a[0] || a[1], a === null) return;
      if (a.tag === 6) {
        e = T(a), py(e, l);
        return;
      }
      if (a = T(a), a.nodeType !== 9) {
        if (a.nodeType === 11) {
          l = "host" in a ? a.host : null, l !== null && l.scrollIntoView(e);
          return;
        }
        a.scrollIntoView(e);
      }
    }
    for (a = l ? t.length - 1 : 0; a !== (l ? -1 : t.length); ) {
      var u = t[a];
      u.tag === 6 ? (u = T(u), py(u, l)) : T(u).scrollIntoView(e), a += l ? -1 : 1;
    }
  };
  function qw(e, t) {
    return e = T(e), vy(e, t), !1;
  }
  function vy(e, t) {
    e.reactFragments == null && (e.reactFragments = /* @__PURE__ */ new Set()), e.reactFragments.add(t);
  }
  function yy(e, t) {
    var l = t._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var u = l[a];
        e.addEventListener(
          u.type,
          u.attachedListener,
          Hi(u.optionsOrUseCapture)
        );
      }
    e.nodeType !== 3 && (l = t._observers, l !== null && l.forEach(function(s) {
      for (var m = 0, w = 0; w < Mn.length; w++) {
        var z = Mn[w];
        (z.fragmentInstance !== t || z.observer !== s || z.instance !== e) && (Mn[m++] = z);
      }
      Mn.length = m, s.observe(e);
    }), vy(e, t));
  }
  function Pw(e, t) {
    var l = t._eventListeners;
    if (l !== null)
      for (var a = 0; a < l.length; a++) {
        var u = l[a];
        e.removeEventListener(
          u.type,
          u.attachedListener,
          Hi(u.optionsOrUseCapture)
        );
      }
    e.nodeType !== 3 && (l = t._observers, l !== null && l.forEach(function(s) {
      typeof s.rootMargin == "string" ? Gw(
        t,
        s,
        e
      ) : s.unobserve(e);
    }), e.reactFragments != null && e.reactFragments.delete(t));
  }
  function ud(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t; ) {
      var l = t;
      switch (t = t.nextSibling, l.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          ud(l), _r(l);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (l.rel.toLowerCase() === "stylesheet") continue;
      }
      e.removeChild(l);
    }
  }
  function Iw(e, t, l, a) {
    for (; e.nodeType === 1; ) {
      var u = l;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!a && (e.nodeName !== "INPUT" || e.type !== "hidden"))
          break;
      } else if (a) {
        if (!e[co])
          switch (t) {
            case "meta":
              if (!e.hasAttribute("itemprop")) break;
              return e;
            case "link":
              if (s = e.getAttribute("rel"), s === "stylesheet" && e.hasAttribute("data-precedence"))
                break;
              if (s !== u.rel || e.getAttribute("href") !== (u.href == null || u.href === "" ? null : u.href) || e.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin) || e.getAttribute("title") !== (u.title == null ? null : u.title))
                break;
              return e;
            case "style":
              if (e.hasAttribute("data-precedence")) break;
              return e;
            case "script":
              if (s = e.getAttribute("src"), (s !== (u.src == null ? null : u.src) || e.getAttribute("type") !== (u.type == null ? null : u.type) || e.getAttribute("crossorigin") !== (u.crossOrigin == null ? null : u.crossOrigin)) && s && e.hasAttribute("async") && !e.hasAttribute("itemprop"))
                break;
              return e;
            default:
              return e;
          }
      } else if (t === "input" && e.type === "hidden") {
        var s = u.name == null ? null : "" + u.name;
        if (u.type === "hidden" && e.getAttribute("name") === s)
          return e;
      } else return e;
      if (e = Sn(e.nextSibling), e === null) break;
    }
    return null;
  }
  function $w(e, t, l) {
    if (t === "") return null;
    for (; e.nodeType !== 3; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !l || (e = Sn(e.nextSibling), e === null)) return null;
    return e;
  }
  function by(e, t) {
    for (; e.nodeType !== 8; )
      if ((e.nodeType !== 1 || e.nodeName !== "INPUT" || e.type !== "hidden") && !t || (e = Sn(e.nextSibling), e === null)) return null;
    return e;
  }
  function sd(e) {
    return e.data === "$?" || e.data === "$~";
  }
  function cd(e) {
    return e.data === "$!" || e.data === "$?" && e.ownerDocument.readyState !== "loading";
  }
  function Yw(e, t) {
    var l = e.ownerDocument;
    if (e.data === "$~") e._reactRetry = t;
    else if (e.data !== "$?" || l.readyState !== "loading")
      t();
    else {
      var a = function() {
        t(), l.removeEventListener("DOMContentLoaded", a);
      };
      l.addEventListener("DOMContentLoaded", a), e._reactRetry = a;
    }
  }
  function Sn(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?" || t === "$~" || t === "&" || t === "F!" || t === "F")
          break;
        if (t === "/$" || t === "/&") return null;
      }
    }
    return e;
  }
  var fd = null;
  function Sy(e) {
    e = e.nextSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "/$" || l === "/&") {
          if (t === 0)
            return Sn(e.nextSibling);
          t--;
        } else
          l !== "$" && l !== "$!" && l !== "$?" && l !== "$~" && l !== "&" || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function xy(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var l = e.data;
        if (l === "$" || l === "$!" || l === "$?" || l === "$~" || l === "&") {
          if (t === 0) return e;
          t--;
        } else l !== "/$" && l !== "/&" || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function Fw(e, t) {
    function l() {
      a = !0;
    }
    if (e.ownerDocument.activeElement === e) return !0;
    var a = !1;
    try {
      e.ownerDocument.addEventListener("focus", l, !0), (e.focus || HTMLElement.prototype.focus).call(e, t);
    } finally {
      e.ownerDocument.removeEventListener("focus", l, !0);
    }
    return a;
  }
  function Xw(e) {
    ry(function() {
      ry(function(t) {
        return e(t);
      });
    });
  }
  function Cy(e, t, l) {
    switch (t = Fo(l), e) {
      case "html":
        if (e = t.documentElement, !e) throw Error(r(452));
        return e;
      case "head":
        if (e = t.head, !e) throw Error(r(453));
        return e;
      case "body":
        if (e = t.body, !e) throw Error(r(454));
        return e;
      default:
        throw Error(r(451));
    }
  }
  function wy(e, t, l) {
    for (var a in l) {
      var u = l[a];
      l.hasOwnProperty(a) && u != null && Ie(e, t, a, null, ww, u);
    }
    l.dangerouslySetInnerHTML != null && (e.textContent = ""), e.onclick === Un && (e.onclick = null), _r(e);
  }
  function dd(e) {
    for (var t = e.attributes; t.length; )
      e.removeAttributeNode(t[0]);
    _r(e);
  }
  var xn = /* @__PURE__ */ new Map(), Ey = /* @__PURE__ */ new Set();
  function Xo(e) {
    if (typeof e.getRootNode == "function") {
      var t = e.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  var hl = ce.d;
  ce.d = {
    f: Qw,
    r: Zw,
    D: Kw,
    C: Jw,
    L: Ww,
    m: eE,
    X: nE,
    S: tE,
    M: lE
  };
  function Qw() {
    var e = hl.f(), t = zu();
    return e || t;
  }
  function Zw(e) {
    var t = ei(e);
    t !== null && t.tag === 5 && t.type === "form" ? _p(t) : hl.r(e);
  }
  var Li = typeof document > "u" ? null : document;
  function Ry(e, t, l) {
    var a = Li;
    if (a && typeof t == "string" && t) {
      var u = gn(t);
      u = 'link[rel="' + e + '"][href="' + u + '"]', typeof l == "string" && (u += '[crossorigin="' + l + '"]'), Ey.has(u) || (Ey.add(u), e = { rel: e, crossOrigin: l, href: t }, a.querySelector(u) === null && (t = a.createElement("link"), zt(t, "link", e), vt(t), a.head.appendChild(t)));
    }
  }
  function Kw(e) {
    hl.D(e), Ry("dns-prefetch", e, null);
  }
  function Jw(e, t) {
    hl.C(e, t), Ry("preconnect", e, t);
  }
  function Ww(e, t, l) {
    hl.L(e, t, l);
    var a = Li;
    if (a && e && t) {
      var u = 'link[rel="preload"][as="' + gn(t) + '"]';
      t === "image" && l && l.imageSrcSet ? (u += '[imagesrcset="' + gn(
        l.imageSrcSet
      ) + '"]', typeof l.imageSizes == "string" && (u += '[imagesizes="' + gn(
        l.imageSizes
      ) + '"]')) : u += '[href="' + gn(e) + '"]';
      var s = u;
      switch (t) {
        case "style":
          s = Ui(e);
          break;
        case "script":
          s = Vi(e);
      }
      if (!(xn.has(s) || (e = H(
        {
          rel: "preload",
          href: t === "image" && l && l.imageSrcSet ? void 0 : e,
          as: t
        },
        l
      ), xn.set(s, e), a.querySelector(u) !== null || t === "style" && a.querySelector(Qo(s)) || t === "script" && a.querySelector(Zo(s))))) {
        var m = a.createElement("link");
        zt(m, "link", e), t === "style" && (m[Rr] = !0, m.onload = m.onerror = function() {
          Vm(m);
        }), vt(m), a.head.appendChild(m);
      }
    }
  }
  function eE(e, t) {
    hl.m(e, t);
    var l = Li;
    if (l && e) {
      var a = t && typeof t.as == "string" ? t.as : "script", u = 'link[rel="modulepreload"][as="' + gn(a) + '"][href="' + gn(e) + '"]', s = u;
      switch (a) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          s = Vi(e);
      }
      if (!xn.has(s) && (e = H({ rel: "modulepreload", href: e }, t), xn.set(s, e), l.querySelector(u) === null)) {
        switch (a) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (l.querySelector(Zo(s)))
              return;
        }
        a = l.createElement("link"), zt(a, "link", e), vt(a), l.head.appendChild(a);
      }
    }
  }
  function tE(e, t, l) {
    hl.S(e, t, l);
    var a = Li;
    if (a && e) {
      var u = ti(a).hoistableStyles, s = Ui(e);
      t = t || "default";
      var m = u.get(s);
      if (!m) {
        var w = { loading: 0, preload: null };
        if (m = a.querySelector(
          Qo(s)
        ))
          w.loading = 5;
        else {
          e = H(
            { rel: "stylesheet", href: e, "data-precedence": t },
            l
          ), (l = xn.get(s)) && gd(e, l);
          var z = m = a.createElement("link");
          vt(z), zt(z, "link", e), z._p = new Promise(function(k, Y) {
            z.onload = k, z.onerror = Y;
          }), z.addEventListener("load", function() {
            w.loading |= 1;
          }), z.addEventListener("error", function() {
            w.loading |= 2;
          }), w.loading |= 4, Lu(m, t, a);
        }
        m = {
          type: "stylesheet",
          instance: m,
          count: 1,
          state: w
        }, u.set(s, m);
      }
    }
  }
  function nE(e, t) {
    hl.X(e, t);
    var l = Li;
    if (l && e) {
      var a = ti(l).hoistableScripts, u = Vi(e), s = a.get(u);
      s || (s = l.querySelector(Zo(u)), s || (e = H({ src: e, async: !0 }, t), (t = xn.get(u)) && md(e, t), s = l.createElement("script"), vt(s), zt(s, "link", e), l.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, a.set(u, s));
    }
  }
  function lE(e, t) {
    hl.M(e, t);
    var l = Li;
    if (l && e) {
      var a = ti(l).hoistableScripts, u = Vi(e), s = a.get(u);
      s || (s = l.querySelector(Zo(u)), s || (e = H({ src: e, async: !0, type: "module" }, t), (t = xn.get(u)) && md(e, t), s = l.createElement("script"), vt(s), zt(s, "link", e), l.head.appendChild(s)), s = {
        type: "script",
        instance: s,
        count: 1,
        state: null
      }, a.set(u, s));
    }
  }
  function _y(e, t, l, a) {
    var u = (u = X.current) ? Xo(u) : null;
    if (!u) throw Error(r(446));
    switch (e) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof l.precedence == "string" && typeof l.href == "string" ? (l = Ui(l.href), t = ti(
          u
        ).hoistableStyles, a = t.get(l), a || (a = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, t.set(l, a)), a) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (l.rel === "stylesheet" && typeof l.href == "string" && typeof l.precedence == "string") {
          e = Ui(l.href);
          var s = ti(
            u
          ).hoistableStyles, m = s.get(e);
          if (m || (u = u.ownerDocument || u, m = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, s.set(e, m), (s = u.querySelector(
            Qo(e)
          )) ? s._p || (m.instance = s, m.state.loading = 5) : (s = xn.get(e), s || (s = {
            rel: "preload",
            as: "style",
            href: l.href,
            crossOrigin: l.crossOrigin,
            integrity: l.integrity,
            media: l.media,
            hrefLang: l.hrefLang,
            referrerPolicy: l.referrerPolicy
          }, xn.set(e, s)), aE(
            u,
            e,
            s,
            m.state
          ))), t && a === null)
            throw Error(r(528, ""));
          return m;
        }
        if (t && a !== null)
          throw Error(r(529, ""));
        return null;
      case "script":
        return t = l.async, l = l.src, typeof l == "string" && t && typeof t != "function" && typeof t != "symbol" ? (l = Vi(l), t = ti(
          u
        ).hoistableScripts, a = t.get(l), a || (a = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, t.set(l, a)), a) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(r(444, e));
    }
  }
  function Ui(e) {
    return 'href="' + gn(e) + '"';
  }
  function Qo(e) {
    return 'link[rel="stylesheet"][' + e + "]";
  }
  function Ty(e) {
    return H({}, e, {
      "data-precedence": e.precedence,
      precedence: null
    });
  }
  function aE(e, t, l, a) {
    if (t = e.querySelector(
      'link[rel="preload"][as="style"][' + t + "]"
    )) {
      if (t[Rr] !== !0) {
        a.loading = 1;
        return;
      }
    } else
      t = e.createElement("link"), t[Rr] = !0, t.onload = t.onerror = Vm.bind(null, t), zt(t, "link", l), vt(t), e.head.appendChild(t);
    a.preload = t, t.addEventListener("load", function() {
      return a.loading |= 1;
    }), t.addEventListener("error", function() {
      return a.loading |= 2;
    });
  }
  function Vi(e) {
    return '[src="' + gn(e) + '"]';
  }
  function Zo(e) {
    return "script[async]" + e;
  }
  function Ay(e, t, l) {
    if (t.count++, t.instance === null)
      switch (t.type) {
        case "style":
          var a = e.querySelector(
            'style[data-href~="' + gn(l.href) + '"]'
          );
          if (a)
            return t.instance = a, vt(a), a;
          var u = H({}, l, {
            "data-href": l.href,
            "data-precedence": l.precedence,
            href: null,
            precedence: null
          });
          return a = (e.ownerDocument || e).createElement(
            "style"
          ), vt(a), zt(a, "style", u), Lu(a, l.precedence, e), t.instance = a;
        case "stylesheet":
          u = Ui(l.href);
          var s = e.querySelector(
            Qo(u)
          );
          if (s)
            return t.state.loading |= 4, t.instance = s, vt(s), s;
          a = Ty(l), (u = xn.get(u)) && gd(a, u), s = (e.ownerDocument || e).createElement("link"), vt(s);
          var m = s;
          return m._p = new Promise(function(w, z) {
            m.onload = w, m.onerror = z;
          }), zt(s, "link", a), t.state.loading |= 4, Lu(s, l.precedence, e), t.instance = s;
        case "script":
          return s = Vi(l.src), (u = e.querySelector(
            Zo(s)
          )) ? (t.instance = u, vt(u), u) : (a = l, (u = xn.get(s)) && (a = H({}, l), md(a, u)), e = e.ownerDocument || e, u = e.createElement("script"), vt(u), zt(u, "link", a), e.head.appendChild(u), t.instance = u);
        case "void":
          return null;
        default:
          throw Error(r(443, t.type));
      }
    else
      t.type === "stylesheet" && (t.state.loading & 4) === 0 && (a = t.instance, t.state.loading |= 4, Lu(a, l.precedence, e));
    return t.instance;
  }
  function Lu(e, t, l) {
    for (var a = l.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), u = a.length ? a[a.length - 1] : null, s = u, m = 0; m < a.length; m++) {
      var w = a[m];
      if (w.dataset.precedence === t) s = w;
      else if (s !== u) break;
    }
    s ? s.parentNode.insertBefore(e, s.nextSibling) : (t = l.nodeType === 9 ? l.head : l, t.insertBefore(e, t.firstChild));
  }
  function gd(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.title == null && (e.title = t.title);
  }
  function md(e, t) {
    e.crossOrigin == null && (e.crossOrigin = t.crossOrigin), e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy), e.integrity == null && (e.integrity = t.integrity);
  }
  var Uu = null;
  function zy(e, t, l) {
    if (Uu === null) {
      var a = /* @__PURE__ */ new Map(), u = Uu = /* @__PURE__ */ new Map();
      u.set(l, a);
    } else
      u = Uu, a = u.get(l), a || (a = /* @__PURE__ */ new Map(), u.set(l, a));
    if (a.has(e)) return a;
    for (a.set(e, null), l = l.getElementsByTagName(e), u = 0; u < l.length; u++) {
      var s = l[u];
      if (!(s[co] || s[Et] || e === "link" && s.getAttribute("rel") === "stylesheet") && s.namespaceURI !== "http://www.w3.org/2000/svg") {
        var m = s.getAttribute(t) || "";
        m = e + m;
        var w = a.get(m);
        w ? w.push(s) : a.set(m, [s]);
      }
    }
    return a;
  }
  function hd(e, t, l) {
    e = e.ownerDocument || e, e.head.insertBefore(
      l,
      t === "title" ? e.querySelector("head > title") : null
    );
  }
  function iE(e, t, l) {
    if (l === 1 || t.itemProp != null) return !1;
    switch (e) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof t.precedence != "string" || typeof t.href != "string" || t.href === "")
          break;
        return !0;
      case "link":
        if (typeof t.rel != "string" || typeof t.href != "string" || t.href === "" || t.onLoad || t.onError)
          break;
        return t.rel === "stylesheet" ? (e = t.disabled, typeof t.precedence == "string" && e == null) : !0;
      case "script":
        if (t.async && typeof t.async != "function" && typeof t.async != "symbol" && !t.onLoad && !t.onError && t.src && typeof t.src == "string")
          return !0;
    }
    return !1;
  }
  function Oy(e, t) {
    return e === "img" && t.src != null && t.src !== "" && t.onLoad == null && t.loading !== "lazy";
  }
  function My(e) {
    return !(e.type === "stylesheet" && (e.state.loading & 3) === 0);
  }
  function Ny(e) {
    return (e.width || 100) * (e.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Dy(e, t) {
    typeof t.decode == "function" && (e.imgCount++, t.complete || (e.imgBytes += Ny(t), e.suspenseyImages.push(t)), e = uE.bind(e), t.decode().then(e, e));
  }
  function oE(e, t, l, a) {
    if (l.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (l.state.loading & 4) === 0) {
      if (l.instance === null) {
        var u = Ui(a.href), s = t.querySelector(
          Qo(u)
        );
        if (s) {
          t = s._p, t !== null && typeof t == "object" && typeof t.then == "function" && (e.count++, e = Ko.bind(e), t.then(e, e)), l.state.loading |= 4, l.instance = s, vt(s);
          return;
        }
        s = t.ownerDocument || t, a = Ty(a), (u = xn.get(u)) && gd(a, u), s = s.createElement("link"), vt(s);
        var m = s;
        m._p = new Promise(function(w, z) {
          m.onload = w, m.onerror = z;
        }), zt(s, "link", a), l.instance = s;
      }
      e.stylesheets === null && (e.stylesheets = /* @__PURE__ */ new Map()), e.stylesheets.set(l, t), (t = l.state.preload) && (l.state.loading & 3) === 0 && (e.count++, l = Ko.bind(e), t.addEventListener("load", l), t.addEventListener("error", l));
    }
  }
  var Vu = 0;
  function rE(e, t) {
    return e.stylesheets && e.count === 0 && ku(e, e.stylesheets), 0 < e.count || 0 < e.imgCount ? function(l) {
      var a = setTimeout(function() {
        if (e.stylesheets && ku(e, e.stylesheets), e.unsuspend) {
          var s = e.unsuspend;
          e.unsuspend = null, s();
        }
      }, 6e4 + t);
      0 < e.imgBytes && Vu === 0 && (Vu = 62500 * Rw());
      var u = setTimeout(
        function() {
          if (e.waitingForImages = !1, e.count === 0 && (e.stylesheets && ku(e, e.stylesheets), e.unsuspend)) {
            var s = e.unsuspend;
            e.unsuspend = null, s();
          }
        },
        (e.imgBytes > Vu ? 50 : 800) + t
      );
      return e.unsuspend = l, function() {
        e.unsuspend = null, clearTimeout(a), clearTimeout(u);
      };
    } : null;
  }
  function jy(e) {
    if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
      if (e.stylesheets) ku(e, e.stylesheets);
      else if (e.unsuspend) {
        var t = e.unsuspend;
        e.unsuspend = null, t();
      }
    }
  }
  function Ko() {
    this.count--, jy(this);
  }
  function uE() {
    this.imgCount--, jy(this);
  }
  var Gu = null;
  function ku(e, t) {
    e.stylesheets = null, e.unsuspend !== null && (e.count++, Gu = /* @__PURE__ */ new Map(), t.forEach(sE, e), Gu = null, Ko.call(e));
  }
  function sE(e, t) {
    if (!(t.state.loading & 4)) {
      var l = Gu.get(e);
      if (l) var a = l.get(null);
      else {
        l = /* @__PURE__ */ new Map(), Gu.set(e, l);
        for (var u = e.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), s = 0; s < u.length; s++) {
          var m = u[s];
          (m.nodeName === "LINK" || m.getAttribute("media") !== "not all") && (l.set(m.dataset.precedence, m), a = m);
        }
        a && l.set(null, a);
      }
      u = t.instance, m = u.getAttribute("data-precedence"), s = l.get(m) || a, s === a && l.set(null, u), l.set(m, u), this.count++, a = Ko.bind(this), u.addEventListener("load", a), u.addEventListener("error", a), s ? s.parentNode.insertBefore(u, s.nextSibling) : (e = e.nodeType === 9 ? e.head : e, e.insertBefore(u, e.firstChild)), t.state.loading |= 4;
    }
  }
  var Gi = {
    $$typeof: de,
    Provider: null,
    Consumer: null,
    _currentValue: Ee,
    _currentValue2: Ee,
    _threadCount: 0
  };
  function cE(e, t, l, a, u, s, m, w, z) {
    this.tag = 1, this.containerInfo = e, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Xs(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Xs(0), this.hiddenUpdates = Xs(null), this.identifierPrefix = a, this.onUncaughtError = u, this.onCaughtError = s, this.onRecoverableError = m, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = z, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Hy(e, t, l, a, u, s, m, w, z, k, Y, ee) {
    return e = new cE(
      e,
      t,
      l,
      m,
      z,
      k,
      Y,
      ee,
      w
    ), t = 1, s === !0 && (t |= 24), s = Pt(3, null, null, t), e.current = s, s.stateNode = e, t = zc(), t.refCount++, e.pooledCache = t, t.refCount++, s.memoizedState = {
      element: a,
      isDehydrated: l,
      cache: t
    }, Dc(s), e;
  }
  function Ly(e) {
    return e ? (e = fi, e) : fi;
  }
  function Uy(e, t, l, a, u, s) {
    u = Ly(u), a.context === null ? a.context = u : a.pendingContext = u, a = Ul(t), a.payload = { element: l }, s = s === void 0 ? null : s, s !== null && (a.callback = s), l = Vl(e, a, t), l !== null && (Ft(l, e, t), Ao(l, e, t));
  }
  function Vy(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var l = e.retryLane;
      e.retryLane = l !== 0 && l < t ? l : t;
    }
  }
  function pd(e, t) {
    Vy(e, t), (e = e.alternate) && Vy(e, t);
  }
  function Gy(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = Sa(e, 67108864);
      t !== null && Ft(t, e, 67108864), pd(e, 67108864);
    }
  }
  function ky(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = rn();
      t = Qs(t);
      var l = Sa(e, t);
      l !== null && Ft(l, e, t), pd(e, t);
    }
  }
  var ki = !0;
  function fE(e, t, l, a) {
    var u = re.T;
    re.T = null;
    var s = ce.p;
    try {
      ce.p = 2, vd(e, t, l, a);
    } finally {
      ce.p = s, re.T = u;
    }
  }
  function dE(e, t, l, a) {
    var u = re.T;
    re.T = null;
    var s = ce.p;
    try {
      ce.p = 8, vd(e, t, l, a);
    } finally {
      ce.p = s, re.T = u;
    }
  }
  function vd(e, t, l, a) {
    if (ki) {
      var u = yd(a);
      if (u === null)
        Jf(
          e,
          t,
          a,
          Bu,
          l
        ), qy(e, a);
      else if (mE(
        u,
        e,
        t,
        l,
        a
      ))
        a.stopPropagation();
      else if (qy(e, a), t & 4 && -1 < gE.indexOf(e)) {
        for (; u !== null; ) {
          var s = ei(u);
          if (s !== null)
            switch (s.tag) {
              case 3:
                if (s = s.stateNode, s.current.memoizedState.isDehydrated) {
                  var m = ha(s.pendingLanes);
                  if (m !== 0) {
                    var w = s;
                    for (w.pendingLanes |= 2, w.entangledLanes |= 2; m; ) {
                      var z = 1 << 31 - Wt(m);
                      w.entanglements[1] |= z, m &= ~z;
                    }
                    Fn(s), (ke & 6) === 0 && (_u = Kt() + 500, Io(0));
                  }
                }
                break;
              case 31:
              case 13:
                w = Sa(s, 2), w !== null && Ft(w, s, 2), zu(), pd(s, 2);
            }
          if (s = yd(a), s === null && Jf(
            e,
            t,
            a,
            Bu,
            l
          ), s === u) break;
          u = s;
        }
        u !== null && a.stopPropagation();
      } else
        Jf(
          e,
          t,
          a,
          null,
          l
        );
    }
  }
  function yd(e) {
    return e = nc(e), bd(e);
  }
  var Bu = null;
  function bd(e) {
    if (Bu = null, e = pa(e), e !== null) {
      var t = f(e);
      if (t === null) e = null;
      else {
        var l = t.tag;
        if (l === 13) {
          if (e = d(t), e !== null) return e;
          e = null;
        } else if (l === 31) {
          if (e = g(t), e !== null) return e;
          e = null;
        } else if (l === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return Bu = e, null;
  }
  function By(e) {
    switch (e) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (R1()) {
          case _m:
            return 2;
          case Tm:
            return 8;
          case Sr:
          case _1:
            return 32;
          case Am:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Sd = !1, Zl = null, Kl = null, Jl = null, Jo = /* @__PURE__ */ new Map(), Wo = /* @__PURE__ */ new Map(), Wl = [], gE = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function qy(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Zl = null;
        break;
      case "dragenter":
      case "dragleave":
        Kl = null;
        break;
      case "mouseover":
      case "mouseout":
        Jl = null;
        break;
      case "pointerover":
      case "pointerout":
        Jo.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Wo.delete(t.pointerId);
    }
  }
  function er(e, t, l, a, u, s) {
    return e === null || e.nativeEvent !== s ? (e = {
      blockedOn: t,
      domEventName: l,
      eventSystemFlags: a,
      nativeEvent: s,
      targetContainers: [u]
    }, t !== null && (t = ei(t), t !== null && Gy(t)), e) : (e.eventSystemFlags |= a, t = e.targetContainers, u !== null && t.indexOf(u) === -1 && t.push(u), e);
  }
  function mE(e, t, l, a, u) {
    switch (t) {
      case "focusin":
        return Zl = er(
          Zl,
          e,
          t,
          l,
          a,
          u
        ), !0;
      case "dragenter":
        return Kl = er(
          Kl,
          e,
          t,
          l,
          a,
          u
        ), !0;
      case "mouseover":
        return Jl = er(
          Jl,
          e,
          t,
          l,
          a,
          u
        ), !0;
      case "pointerover":
        var s = u.pointerId;
        return Jo.set(
          s,
          er(
            Jo.get(s) || null,
            e,
            t,
            l,
            a,
            u
          )
        ), !0;
      case "gotpointercapture":
        return s = u.pointerId, Wo.set(
          s,
          er(
            Wo.get(s) || null,
            e,
            t,
            l,
            a,
            u
          )
        ), !0;
    }
    return !1;
  }
  function Py(e) {
    var t = pa(e.target);
    if (t !== null) {
      var l = f(t);
      if (l !== null) {
        if (t = l.tag, t === 13) {
          if (t = d(l), t !== null) {
            e.blockedOn = t, Hm(e.priority, function() {
              ky(l);
            });
            return;
          }
        } else if (t === 31) {
          if (t = g(l), t !== null) {
            e.blockedOn = t, Hm(e.priority, function() {
              ky(l);
            });
            return;
          }
        } else if (t === 3 && l.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = l.tag === 3 ? l.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function qu(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var l = yd(e.nativeEvent);
      if (l === null) {
        l = e.nativeEvent;
        var a = new l.constructor(
          l.type,
          l
        );
        tc = a, l.target.dispatchEvent(a), tc = null;
      } else
        return t = ei(l), t !== null && Gy(t), e.blockedOn = l, !1;
      t.shift();
    }
    return !0;
  }
  function Iy(e, t, l) {
    qu(e) && l.delete(t);
  }
  function hE() {
    Sd = !1, Zl !== null && qu(Zl) && (Zl = null), Kl !== null && qu(Kl) && (Kl = null), Jl !== null && qu(Jl) && (Jl = null), Jo.forEach(Iy), Wo.forEach(Iy);
  }
  function Pu(e, t) {
    e.blockedOn === t && (e.blockedOn = null, Sd || (Sd = !0, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      hE
    )));
  }
  var Iu = null;
  function $y(e) {
    Iu !== e && (Iu = e, n.unstable_scheduleCallback(
      n.unstable_NormalPriority,
      function() {
        Iu === e && (Iu = null);
        for (var t = 0; t < e.length; t += 3) {
          var l = e[t], a = e[t + 1], u = e[t + 2];
          if (typeof a != "function") {
            if (bd(a || l) === null)
              continue;
            break;
          }
          var s = ei(l);
          s !== null && (e.splice(t, 3), t -= 3, ef(
            s,
            {
              pending: !0,
              data: u,
              method: l.method,
              action: a
            },
            a,
            u
          ));
        }
      }
    ));
  }
  function Bi(e) {
    function t(z) {
      return Pu(z, e);
    }
    Zl !== null && Pu(Zl, e), Kl !== null && Pu(Kl, e), Jl !== null && Pu(Jl, e), Jo.forEach(t), Wo.forEach(t);
    for (var l = 0; l < Wl.length; l++) {
      var a = Wl[l];
      a.blockedOn === e && (a.blockedOn = null);
    }
    for (; 0 < Wl.length && (l = Wl[0], l.blockedOn === null); )
      Py(l), l.blockedOn === null && Wl.shift();
    if (l = (e.ownerDocument || e).$$reactFormReplay, l != null)
      for (a = 0; a < l.length; a += 3) {
        var u = l[a], s = l[a + 1], m = u[qt] || null;
        if (typeof s == "function")
          m || $y(l);
        else if (m) {
          var w = null;
          if (s && s.hasAttribute("formAction")) {
            if (u = s, m = s[qt] || null)
              w = m.formAction;
            else if (bd(u) !== null) continue;
          } else w = m.action;
          typeof w == "function" ? l[a + 1] = w : (l.splice(a, 3), a -= 3), $y(l);
        }
      }
  }
  function Yy() {
    function e(s) {
      s.canIntercept && s.info === "react-transition" && s.intercept({
        handler: function() {
          return new Promise(function(m) {
            return u = m;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function t() {
      u !== null && (u(), u = null), a || setTimeout(l, 20);
    }
    function l() {
      if (!a && !navigation.transition) {
        var s = navigation.currentEntry;
        s && s.url != null && navigation.navigate(s.url, {
          state: s.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var a = !1, u = null;
      return navigation.addEventListener("navigate", e), navigation.addEventListener("navigatesuccess", t), navigation.addEventListener("navigateerror", t), setTimeout(l, 100), function() {
        a = !0, navigation.removeEventListener("navigate", e), navigation.removeEventListener("navigatesuccess", t), navigation.removeEventListener("navigateerror", t), u !== null && (u(), u = null);
      };
    }
  }
  function xd(e) {
    this._internalRoot = e;
  }
  $u.prototype.render = xd.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(r(409));
    var l = t.current, a = rn();
    Uy(l, a, e, t, null, null);
  }, $u.prototype.unmount = xd.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      Uy(e.current, 2, null, e, null, null), zu(), t[Wa] = null;
    }
  };
  function $u(e) {
    this._internalRoot = e;
  }
  $u.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = jm();
      e = { blockedOn: null, target: e, priority: t };
      for (var l = 0; l < Wl.length && t !== 0 && t < Wl[l].priority; l++) ;
      Wl.splice(l, 0, e), l === 0 && Py(e);
    }
  };
  var Fy = i.version;
  if (Fy !== "19.3.0")
    throw Error(
      r(
        527,
        Fy,
        "19.3.0"
      )
    );
  ce.findDOMNode = function(e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(r(188)) : (e = Object.keys(e).join(","), Error(r(268, e)));
    return e = y(t), e = e !== null ? x(e) : null, e = e === null ? null : e.stateNode, e;
  };
  var pE = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: re,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Yu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Yu.isDisabled && Yu.supportsFiber)
      try {
        ro = Yu.inject(
          pE
        ), Jt = Yu;
      } catch {
      }
  }
  return nr.createRoot = function(e, t) {
    if (!c(e)) throw Error(r(299));
    var l = !1, a = "", u = Lp, s = Up, m = Vp;
    return t != null && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (a = t.identifierPrefix), t.onUncaughtError !== void 0 && (u = t.onUncaughtError), t.onCaughtError !== void 0 && (s = t.onCaughtError), t.onRecoverableError !== void 0 && (m = t.onRecoverableError)), t = Hy(
      e,
      1,
      !1,
      null,
      null,
      l,
      a,
      null,
      u,
      s,
      m,
      Yy
    ), e[Wa] = t.current, Kf(e), new xd(t);
  }, nr.hydrateRoot = function(e, t, l) {
    if (!c(e)) throw Error(r(299));
    var a = !1, u = "", s = Lp, m = Up, w = Vp, z = null;
    return l != null && (l.unstable_strictMode === !0 && (a = !0), l.identifierPrefix !== void 0 && (u = l.identifierPrefix), l.onUncaughtError !== void 0 && (s = l.onUncaughtError), l.onCaughtError !== void 0 && (m = l.onCaughtError), l.onRecoverableError !== void 0 && (w = l.onRecoverableError), l.formState !== void 0 && (z = l.formState)), t = Hy(
      e,
      1,
      !0,
      t,
      l ?? null,
      a,
      u,
      z,
      s,
      m,
      w,
      Yy
    ), t.context = Ly(null), l = t.current, a = rn(), a = Qs(a), u = Ul(a), u.callback = null, Vl(l, u, a), l = a, t.current.lanes = l, so(t, l), Fn(t), e[Wa] = t.current, Kf(e), new $u(t);
  }, nr.version = "19.3.0", nr;
}
var o0;
function TE() {
  if (o0) return Rd.exports;
  o0 = 1;
  function n() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
      } catch (i) {
        console.error(i);
      }
  }
  return n(), Rd.exports = _E(), Rd.exports;
}
var AE = TE();
const zE = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), ob = (...n) => n.filter((i, o, r) => !!i && i.trim() !== "" && r.indexOf(i) === o).join(" ").trim();
var OE = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const ME = v.forwardRef(
  ({
    color: n = "currentColor",
    size: i = 24,
    strokeWidth: o = 2,
    absoluteStrokeWidth: r,
    className: c = "",
    children: f,
    iconNode: d,
    ...g
  }, h) => v.createElement(
    "svg",
    {
      ref: h,
      ...OE,
      width: i,
      height: i,
      stroke: n,
      strokeWidth: r ? Number(o) * 24 / Number(i) : o,
      className: ob("lucide", c),
      ...g
    },
    [
      ...d.map(([y, x]) => v.createElement(y, x)),
      ...Array.isArray(f) ? f : [f]
    ]
  )
);
const nt = (n, i) => {
  const o = v.forwardRef(
    ({ className: r, ...c }, f) => v.createElement(ME, {
      ref: f,
      iconNode: i,
      className: ob(`lucide-${zE(n)}`, r),
      ...c
    })
  );
  return o.displayName = `${n}`, o;
};
const NE = nt("ArrowUpDown", [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
]);
const zd = nt("ArrowUpRight", [
  ["path", { d: "M7 7h10v10", key: "1tivn9" }],
  ["path", { d: "M7 17 17 7", key: "1vkiza" }]
]);
const rg = nt("Atom", [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  [
    "path",
    {
      d: "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",
      key: "1l2ple"
    }
  ],
  [
    "path",
    {
      d: "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",
      key: "1wam0m"
    }
  ]
]);
const r0 = nt("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
const DE = nt("Columns2", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M12 3v18", key: "108xh3" }]
]);
const rb = nt("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
const jE = nt("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
]);
const HE = nt("Filter", [
  ["polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3", key: "1yg77f" }]
]);
const LE = nt("Focus", [
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }]
]);
const UE = nt("GripVertical", [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
]);
const VE = nt("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const GE = nt("Maximize", [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
]);
const kE = nt("Network", [
  ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }],
  ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
  ["path", { d: "M12 12V8", key: "2874zd" }]
]);
const BE = nt("PanelLeftClose", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "m16 15-3-3 3-3", key: "14y99z" }]
]);
const qE = nt("PanelLeftOpen", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "m14 9 3 3-3 3", key: "8010ee" }]
]);
const PE = nt("PanelRightClose", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }],
  ["path", { d: "m8 9 3 3-3 3", key: "12hl5m" }]
]);
const IE = nt("PanelRightOpen", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }],
  ["path", { d: "m10 15-3-3 3-3", key: "1pgupc" }]
]);
const u0 = nt("Pin", [
  ["path", { d: "M12 17v5", key: "bb1du9" }],
  [
    "path",
    {
      d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
      key: "1nkz8b"
    }
  ]
]);
const $E = nt("RotateCcw", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
]);
const ug = nt("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
const ub = nt("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
const YE = nt("ZoomIn", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14", key: "1vmskp" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
]);
const FE = nt("ZoomOut", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65", key: "13gj7c" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11", key: "durymu" }]
]);
var XE = Object.defineProperty, Bg = (n, i) => XE(n, "name", { value: i, configurable: !0 });
function sg(n, i) {
  if (typeof n == "function")
    return n(i);
  n != null && (n.current = i);
}
Bg(sg, "setRef");
function Ia(...n) {
  return (i) => {
    let o = !1;
    const r = n.map((c) => {
      const f = sg(c, i);
      return !o && typeof f == "function" && (o = !0), f;
    });
    if (o)
      return () => {
        for (let c = 0; c < r.length; c++) {
          const f = r[c];
          typeof f == "function" ? f() : sg(n[c], null);
        }
      };
  };
}
Bg(Ia, "composeRefs");
function Ht(...n) {
  return v.useCallback(Ia(...n), n);
}
Bg(Ht, "useComposedRefs");
var QE = Object.defineProperty, jn = (n, i) => QE(n, "name", { value: i, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function ia(n) {
  const i = v.forwardRef((o, r) => {
    let { children: c, ...f } = o, d = null, g = !1;
    const h = [];
    cg(c) && typeof Fu == "function" && (c = Fu(c._payload)), v.Children.forEach(c, (S) => {
      if (gb(S)) {
        g = !0;
        const C = S;
        let R = "child" in C.props ? C.props.child : C.props.children;
        cg(R) && typeof Fu == "function" && (R = Fu(R._payload)), d = KE(C, R), h.push(d?.props?.children);
      } else
        h.push(S);
    }), d ? d = v.cloneElement(d, void 0, h) : (
      // A `Slottable` was found but it didn't resolve to a single element (e.g.
      // it wrapped multiple elements, text, or a render-prop `child` that
      // wasn't an element). Don't fall back to treating the `Slottable` wrapper
      // itself as the slot target — throw a descriptive error below instead.
      !g && v.Children.count(c) === 1 && v.isValidElement(c) && (d = c)
    );
    const y = d ? db(d) : void 0, x = Ht(r, y);
    if (!d) {
      if (c || c === 0)
        throw new Error(
          g ? eR(n) : WE(n)
        );
      return c;
    }
    const p = fb(f, d.props ?? {});
    return d.type !== v.Fragment && (p.ref = r ? x : y), v.cloneElement(d, p);
  });
  return i.displayName = `${n}.Slot`, i;
}
jn(ia, "createSlot");
var ZE = /* @__PURE__ */ ia("Slot"), sb = /* @__PURE__ */ Symbol.for("radix.slottable");
// @__NO_SIDE_EFFECTS__
function cb(n) {
  const i = /* @__PURE__ */ jn((o) => "child" in o ? o.children(o.child) : o.children, "Slottable");
  return i.displayName = `${n}.Slottable`, i.__radixId = sb, i;
}
jn(cb, "createSlottable");
var KE = /* @__PURE__ */ jn((n, i) => {
  if ("child" in n.props) {
    const o = n.props.child;
    return v.isValidElement(o) ? v.cloneElement(o, void 0, n.props.children(o.props.children)) : null;
  }
  return v.isValidElement(i) ? i : null;
}, "getSlottableElementFromSlottable");
function fb(n, i) {
  const o = { ...i };
  for (const r in i) {
    const c = n[r], f = i[r];
    /^on[A-Z]/.test(r) ? c && f ? o[r] = (...g) => {
      const h = f(...g);
      return c(...g), h;
    } : c && (o[r] = c) : r === "style" ? o[r] = { ...c, ...f } : r === "className" && (o[r] = [c, f].filter(Boolean).join(" "));
  }
  return { ...n, ...o };
}
jn(fb, "mergeProps");
function db(n) {
  let i = Object.getOwnPropertyDescriptor(n.props, "ref")?.get, o = i && "isReactWarning" in i && i.isReactWarning;
  return o ? n.ref : (i = Object.getOwnPropertyDescriptor(n, "ref")?.get, o = i && "isReactWarning" in i && i.isReactWarning, o ? n.props.ref : n.props.ref || n.ref);
}
jn(db, "getElementRef");
function gb(n) {
  return v.isValidElement(n) && typeof n.type == "function" && "__radixId" in n.type && n.type.__radixId === sb;
}
jn(gb, "isSlottable");
var JE = /* @__PURE__ */ Symbol.for("react.lazy");
function cg(n) {
  return n != null && typeof n == "object" && "$$typeof" in n && n.$$typeof === JE && "_payload" in n && mb(n._payload);
}
jn(cg, "isLazyComponent");
function mb(n) {
  return typeof n == "object" && n !== null && "then" in n;
}
jn(mb, "isPromiseLike");
var WE = /* @__PURE__ */ jn((n) => `${n} failed to slot onto its children. Expected a single React element child or \`Slottable\`.`, "createSlotError"), eR = /* @__PURE__ */ jn((n) => `${n} failed to slot onto its \`Slottable\`. Expected \`Slottable\` to receive a single React element child.`, "createSlottableError"), Fu = Qa[" use ".trim().toString()];
function hb(n) {
  var i, o, r = "";
  if (typeof n == "string" || typeof n == "number") r += n;
  else if (typeof n == "object") if (Array.isArray(n)) {
    var c = n.length;
    for (i = 0; i < c; i++) n[i] && (o = hb(n[i])) && (r && (r += " "), r += o);
  } else for (o in n) n[o] && (r && (r += " "), r += o);
  return r;
}
function pb() {
  for (var n, i, o = 0, r = "", c = arguments.length; o < c; o++) (n = arguments[o]) && (i = hb(n)) && (r && (r += " "), r += i);
  return r;
}
const s0 = (n) => typeof n == "boolean" ? `${n}` : n === 0 ? "0" : n, c0 = pb, vb = (n, i) => (o) => {
  var r;
  if (i?.variants == null) return c0(n, o?.class, o?.className);
  const { variants: c, defaultVariants: f } = i, d = Object.keys(c).map((y) => {
    const x = o?.[y], p = f?.[y];
    if (x === null) return null;
    const S = s0(x) || s0(p);
    return c[y][S];
  }), g = o && Object.entries(o).reduce((y, x) => {
    let [p, S] = x;
    return S === void 0 || (y[p] = S), y;
  }, {}), h = i == null || (r = i.compoundVariants) === null || r === void 0 ? void 0 : r.reduce((y, x) => {
    let { class: p, className: S, ...C } = x;
    return Object.entries(C).every((R) => {
      let [_, T] = R;
      return Array.isArray(T) ? T.includes({
        ...f,
        ...g
      }[_]) : {
        ...f,
        ...g
      }[_] === T;
    }) ? [
      ...y,
      p,
      S
    ] : y;
  }, []);
  return c0(n, d, h, o?.class, o?.className);
}, tR = (n, i) => {
  const o = new Array(n.length + i.length);
  for (let r = 0; r < n.length; r++)
    o[r] = n[r];
  for (let r = 0; r < i.length; r++)
    o[n.length + r] = i[r];
  return o;
}, nR = (n, i) => ({
  classGroupId: n,
  validator: i
}), yb = (n = /* @__PURE__ */ new Map(), i = null, o) => ({
  nextPart: n,
  validators: i,
  classGroupId: o
}), vs = "-", f0 = [], lR = "arbitrary..", aR = (n) => {
  const i = oR(n), {
    conflictingClassGroups: o,
    conflictingClassGroupModifiers: r
  } = n;
  return {
    getClassGroupId: (d) => {
      if (d.startsWith("[") && d.endsWith("]"))
        return iR(d);
      const g = d.split(vs), h = g[0] === "" && g.length > 1 ? 1 : 0;
      return bb(g, h, i);
    },
    getConflictingClassGroupIds: (d, g) => {
      if (g) {
        const h = r[d], y = o[d];
        return h ? y ? tR(y, h) : h : y || f0;
      }
      return o[d] || f0;
    }
  };
}, bb = (n, i, o) => {
  if (n.length - i === 0)
    return o.classGroupId;
  const c = n[i], f = o.nextPart.get(c);
  if (f) {
    const y = bb(n, i + 1, f);
    if (y) return y;
  }
  const d = o.validators;
  if (d === null)
    return;
  const g = i === 0 ? n.join(vs) : n.slice(i).join(vs), h = d.length;
  for (let y = 0; y < h; y++) {
    const x = d[y];
    if (x.validator(g))
      return x.classGroupId;
  }
}, iR = (n) => n.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const i = n.slice(1, -1), o = i.indexOf(":"), r = i.slice(0, o);
  return r ? lR + r : void 0;
})(), oR = (n) => {
  const {
    theme: i,
    classGroups: o
  } = n;
  return rR(o, i);
}, rR = (n, i) => {
  const o = yb();
  for (const r in n) {
    const c = n[r];
    qg(c, o, r, i);
  }
  return o;
}, qg = (n, i, o, r) => {
  const c = n.length;
  for (let f = 0; f < c; f++) {
    const d = n[f];
    uR(d, i, o, r);
  }
}, uR = (n, i, o, r) => {
  if (typeof n == "string") {
    sR(n, i, o);
    return;
  }
  if (typeof n == "function") {
    cR(n, i, o, r);
    return;
  }
  fR(n, i, o, r);
}, sR = (n, i, o) => {
  const r = n === "" ? i : Sb(i, n);
  r.classGroupId = o;
}, cR = (n, i, o, r) => {
  if (dR(n)) {
    qg(n(r), i, o, r);
    return;
  }
  i.validators === null && (i.validators = []), i.validators.push(nR(o, n));
}, fR = (n, i, o, r) => {
  const c = Object.entries(n), f = c.length;
  for (let d = 0; d < f; d++) {
    const [g, h] = c[d];
    qg(h, Sb(i, g), o, r);
  }
}, Sb = (n, i) => {
  let o = n;
  const r = i.split(vs), c = r.length;
  for (let f = 0; f < c; f++) {
    const d = r[f];
    let g = o.nextPart.get(d);
    g || (g = yb(), o.nextPart.set(d, g)), o = g;
  }
  return o;
}, dR = (n) => "isThemeGetter" in n && n.isThemeGetter === !0, gR = (n) => {
  if (n < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let i = 0, o = /* @__PURE__ */ Object.create(null), r = /* @__PURE__ */ Object.create(null);
  const c = (f, d) => {
    o[f] = d, i++, i > n && (i = 0, r = o, o = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(f) {
      let d = o[f];
      if (d !== void 0)
        return d;
      if ((d = r[f]) !== void 0)
        return c(f, d), d;
    },
    set(f, d) {
      f in o ? o[f] = d : c(f, d);
    }
  };
}, fg = "!", d0 = ":", mR = [], g0 = (n, i, o, r, c) => ({
  modifiers: n,
  hasImportantModifier: i,
  baseClassName: o,
  maybePostfixModifierPosition: r,
  isExternal: c
}), hR = (n) => {
  const {
    prefix: i,
    experimentalParseClassName: o
  } = n;
  let r = (c) => {
    const f = [];
    let d = 0, g = 0, h = 0, y;
    const x = c.length;
    for (let _ = 0; _ < x; _++) {
      const T = c[_];
      if (d === 0 && g === 0) {
        if (T === d0) {
          f.push(c.slice(h, _)), h = _ + 1;
          continue;
        }
        if (T === "/") {
          y = _;
          continue;
        }
      }
      T === "[" ? d++ : T === "]" ? d-- : T === "(" ? g++ : T === ")" && g--;
    }
    const p = f.length === 0 ? c : c.slice(h);
    let S = p, C = !1;
    p.endsWith(fg) ? (S = p.slice(0, -1), C = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      p.startsWith(fg) && (S = p.slice(1), C = !0)
    );
    const R = y && y > h ? y - h : void 0;
    return g0(f, C, S, R);
  };
  if (i) {
    const c = i + d0, f = r;
    r = (d) => d.startsWith(c) ? f(d.slice(c.length)) : g0(mR, !1, d, void 0, !0);
  }
  if (o) {
    const c = r;
    r = (f) => o({
      className: f,
      parseClassName: c
    });
  }
  return r;
}, pR = (n) => {
  const i = /* @__PURE__ */ new Map();
  return n.orderSensitiveModifiers.forEach((o, r) => {
    i.set(o, 1e6 + r);
  }), (o) => {
    const r = [];
    let c = [];
    for (let f = 0; f < o.length; f++) {
      const d = o[f], g = d[0] === "[", h = i.has(d);
      g || h ? (c.length > 0 && (c.sort(), r.push(...c), c = []), r.push(d)) : c.push(d);
    }
    return c.length > 0 && (c.sort(), r.push(...c)), r;
  };
}, vR = (n) => ({
  cache: gR(n.cacheSize),
  parseClassName: hR(n),
  sortModifiers: pR(n),
  postfixLookupClassGroupIds: yR(n),
  ...aR(n)
}), yR = (n) => {
  const i = /* @__PURE__ */ Object.create(null), o = n.postfixLookupClassGroups;
  if (o)
    for (let r = 0; r < o.length; r++)
      i[o[r]] = !0;
  return i;
}, bR = /\s+/, SR = (n, i) => {
  const {
    parseClassName: o,
    getClassGroupId: r,
    getConflictingClassGroupIds: c,
    sortModifiers: f,
    postfixLookupClassGroupIds: d
  } = i, g = [], h = n.trim().split(bR);
  let y = "";
  for (let x = h.length - 1; x >= 0; x -= 1) {
    const p = h[x], {
      isExternal: S,
      modifiers: C,
      hasImportantModifier: R,
      baseClassName: _,
      maybePostfixModifierPosition: T
    } = o(p);
    if (S) {
      y = p + (y.length > 0 ? " " + y : y);
      continue;
    }
    let O = !!T, D;
    if (O) {
      const H = _.substring(0, T);
      D = r(H);
      const $ = D && d[D] ? r(_) : void 0;
      $ && $ !== D && (D = $, O = !1);
    } else
      D = r(_);
    if (!D) {
      if (!O) {
        y = p + (y.length > 0 ? " " + y : y);
        continue;
      }
      if (D = r(_), !D) {
        y = p + (y.length > 0 ? " " + y : y);
        continue;
      }
      O = !1;
    }
    const U = C.length === 0 ? "" : C.length === 1 ? C[0] : f(C).join(":"), P = R ? U + fg : U, Q = P + D;
    if (g.indexOf(Q) > -1)
      continue;
    g.push(Q);
    const B = c(D, O);
    for (let H = 0; H < B.length; ++H) {
      const $ = B[H];
      g.push(P + $);
    }
    y = p + (y.length > 0 ? " " + y : y);
  }
  return y;
}, xR = (...n) => {
  let i = 0, o, r, c = "";
  for (; i < n.length; )
    (o = n[i++]) && (r = xb(o)) && (c && (c += " "), c += r);
  return c;
}, xb = (n) => {
  if (typeof n == "string")
    return n;
  let i, o = "";
  for (let r = 0; r < n.length; r++)
    n[r] && (i = xb(n[r])) && (o && (o += " "), o += i);
  return o;
}, CR = (n, ...i) => {
  let o, r, c, f;
  const d = (h) => {
    const y = i.reduce((x, p) => p(x), n());
    return o = vR(y), r = o.cache.get, c = o.cache.set, f = g, g(h);
  }, g = (h) => {
    const y = r(h);
    if (y)
      return y;
    const x = SR(h, o);
    return c(h, x), x;
  };
  return f = d, (...h) => f(xR(...h));
}, wR = [], pt = (n) => {
  const i = (o) => o[n] || wR;
  return i.isThemeGetter = !0, i.themeKey = n, i;
}, Cb = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, wb = /^\((?:(\w[\w-]*):)?(.+)\)$/i, ER = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, RR = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, _R = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, TR = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/, AR = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, zR = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, ta = (n) => ER.test(n), De = (n) => !!n && !Number.isNaN(Number(n)), Xn = (n) => !!n && Number.isInteger(Number(n)), Od = (n) => n.endsWith("%") && De(n.slice(0, -1)), pl = (n) => RR.test(n), Eb = () => !0, OR = (n) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  _R.test(n) && !TR.test(n)
), Pg = () => !1, MR = (n) => AR.test(n), NR = (n) => zR.test(n), DR = (n) => !ve(n) && !ye(n), jR = (n) => n.startsWith("@container") && (n[10] === "/" && n[11] !== void 0 || n[11] === "s" && n[16] !== void 0 && n.startsWith("-size/", 10) || n[11] === "n" && n[18] !== void 0 && n.startsWith("-normal/", 10)), HR = (n) => da(n, Tb, Pg), ve = (n) => Cb.test(n), Va = (n) => da(n, Ab, OR), m0 = (n) => da(n, PR, De), LR = (n) => da(n, Ob, Eb), UR = (n) => da(n, zb, Pg), h0 = (n) => da(n, Rb, Pg), VR = (n) => da(n, _b, NR), Xu = (n) => da(n, Mb, MR), ye = (n) => wb.test(n), lr = (n) => Za(n, Ab), GR = (n) => Za(n, zb), p0 = (n) => Za(n, Rb), kR = (n) => Za(n, Tb), BR = (n) => Za(n, _b), Qu = (n) => Za(n, Mb, !0), qR = (n) => Za(n, Ob, !0), da = (n, i, o) => {
  const r = Cb.exec(n);
  return r ? r[1] ? i(r[1]) : o(r[2]) : !1;
}, Za = (n, i, o = !1) => {
  const r = wb.exec(n);
  return r ? r[1] ? i(r[1]) : o : !1;
}, Rb = (n) => n === "position" || n === "percentage", _b = (n) => n === "image" || n === "url", Tb = (n) => n === "length" || n === "size" || n === "bg-size", Ab = (n) => n === "length", PR = (n) => n === "number", zb = (n) => n === "family-name", Ob = (n) => n === "number" || n === "weight", Mb = (n) => n === "shadow", IR = () => {
  const n = pt("color"), i = pt("font"), o = pt("text"), r = pt("font-weight"), c = pt("tracking"), f = pt("leading"), d = pt("breakpoint"), g = pt("container"), h = pt("spacing"), y = pt("radius"), x = pt("shadow"), p = pt("inset-shadow"), S = pt("text-shadow"), C = pt("drop-shadow"), R = pt("blur"), _ = pt("perspective"), T = pt("aspect"), O = pt("ease"), D = pt("animate"), U = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], P = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], Q = () => [...P(), ye, ve], B = () => ["auto", "hidden", "clip", "visible", "scroll"], H = () => ["auto", "contain", "none"], $ = () => [ye, ve, h], ae = () => [ta, "full", "auto", ...$()], K = () => [Xn, "none", "subgrid", ye, ve], se = () => ["auto", {
    span: ["full", Xn, ye, ve]
  }, Xn, ye, ve], oe = () => [Xn, "auto", ye, ve], he = () => ["auto", "min", "max", "fr", ye, ve], ge = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], de = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], Z = () => ["auto", ...$()], le = () => [ta, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...$()], ie = () => [g, ta, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...$()], me = () => [ta, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...$()], ne = () => [n, ye, ve], ze = () => [...P(), p0, h0, {
    position: [ye, ve]
  }], W = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], M = () => ["auto", "cover", "contain", kR, HR, {
    size: [ye, ve]
  }], E = () => [Od, lr, Va], A = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    y,
    ye,
    ve
  ], j = () => ["", De, lr, Va], V = () => ["solid", "dashed", "dotted", "double"], te = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], F = () => [De, Od, p0, h0], ue = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    R,
    ye,
    ve
  ], re = () => ["none", De, ye, ve], ce = () => ["none", De, ye, ve], Ee = () => [De, ye, ve], Qe = () => [ta, "full", ...$()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [pl],
      breakpoint: [pl],
      color: [Eb],
      container: [pl],
      "drop-shadow": [pl],
      ease: ["in", "out", "in-out"],
      font: [DR],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [pl],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [pl],
      shadow: [pl],
      spacing: ["px", De],
      text: [pl],
      "text-shadow": [pl],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", ta, ve, ye, T]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Container Type
       * @see https://tailwindcss.com/docs/responsive-design#container-queries
       */
      "container-type": [{
        "@container": ["", "normal", "size", ye, ve]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [jR],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [De, "auto", ve, ye, g]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": U()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": U()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: Q()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: B()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": B()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": B()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: H()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": H()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": H()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: ae()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": ae()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": ae()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": ae(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: ae()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": ae(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: ae()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": ae()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": ae()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: ae()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: ae()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: ae()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: ae()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [Xn, "auto", ye, ve]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [ta, "full", "auto", g, ...$()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [De, ta, "auto", "initial", "none", ve]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", De, ye, ve]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", De, ye, ve]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Xn, "first", "last", "none", ye, ve]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": K()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: se()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": oe()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": oe()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": K()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: se()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": oe()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": oe()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": he()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": he()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: $()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": $()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": $()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...ge(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...de(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...de()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...ge()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...de(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...de(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": ge()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...de(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...de()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: $()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: $()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: $()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: $()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: $()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: $()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: $()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: $()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: $()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: $()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: $()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: Z()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: Z()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: Z()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: Z()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: Z()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: Z()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: Z()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: Z()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: Z()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: Z()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: Z()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": $()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": $()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: le()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/inline-size
       */
      "inline-size": [{
        inline: ["auto", ...ie()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-inline-size
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...ie()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-inline-size
       */
      "max-inline-size": [{
        "max-inline": ["none", ...ie()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/block-size
       */
      "block-size": [{
        block: ["auto", ...me()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-block-size
       */
      "min-block-size": [{
        "min-block": ["auto", ...me()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-block-size
       */
      "max-block-size": [{
        "max-block": ["none", ...me()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [g, "screen", ...le()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          g,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...le()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          g,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [d]
          },
          ...le()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...le()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...le()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", "none", ...le()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", o, lr, Va]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [r, qR, LR]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Od, ve]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [GR, UR, i]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [ve]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [c, ye, ve]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [De, "none", ye, m0]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          f,
          ...$()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", ye, ve]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", ye, ve]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: ne()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: ne()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...V(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [De, "from-font", "auto", ye, Va]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: ne()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [De, "auto", ye, ve]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: $()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [Xn, ye, ve]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", ye, ve]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", ye, ve]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: ze()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: W()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: M()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Xn, ye, ve],
          radial: ["", ye, ve],
          conic: ["", Xn, ye, ve]
        }, BR, VR]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: ne()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: E()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: E()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: E()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: ne()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: ne()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: ne()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: A()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": A()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": A()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": A()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": A()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": A()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": A()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": A()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": A()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": A()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": A()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": A()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": A()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": A()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": A()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: j()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": j()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": j()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": j()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": j()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": j()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": j()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": j()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": j()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": j()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": j()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": j()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": j()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...V(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...V(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: ne()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": ne()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": ne()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": ne()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": ne()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": ne()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": ne()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": ne()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": ne()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": ne()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": ne()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: ne()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...V(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [De, ye, ve]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", De, lr, Va]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: ne()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          // Deprecated since Tailwind CSS v4.0.0
          "inner",
          "none",
          x,
          Qu,
          Xu
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: ne()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", p, Qu, Xu]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": ne()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: j()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: ne()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [De, Va]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": ne()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": j()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": ne()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", S, Qu, Xu]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": ne()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [De, ye, ve]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...te(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": te()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [De]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": F()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": F()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": ne()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": ne()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": F()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": F()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": ne()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": ne()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": F()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": F()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": ne()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": ne()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": F()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": F()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": ne()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": ne()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": F()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": F()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": ne()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": ne()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": F()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": F()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": ne()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": ne()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": F()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": F()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": ne()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": ne()
      }],
      "mask-image-radial": [{
        "mask-radial": [ye, ve]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": F()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": F()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": ne()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": ne()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": P()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [De]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": F()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": F()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": ne()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": ne()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: ze()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: W()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: M()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", ye, ve]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          ye,
          ve
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: ue()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [De, ye, ve]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [De, ye, ve]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          C,
          Qu,
          Xu
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": ne()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", De, ye, ve]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [De, ye, ve]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", De, ye, ve]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [De, ye, ve]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", De, ye, ve]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          ye,
          ve
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": ue()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [De, ye, ve]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [De, ye, ve]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", De, ye, ve]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [De, ye, ve]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", De, ye, ve]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [De, ye, ve]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [De, ye, ve]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", De, ye, ve]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": $()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": $()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": $()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", ye, ve]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [De, "initial", ye, ve]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", O, ye, ve]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [De, ye, ve]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", D, ye, ve]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [_, ye, ve]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": Q()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: re()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": re()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": re()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": re()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: ce()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": ce()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": ce()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": ce()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: Ee()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Ee()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Ee()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [ye, ve, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: Q()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: Qe()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Qe()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Qe()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Qe()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      /**
       * Zoom
       * @see https://tailwindcss.com/docs/zoom
       */
      zoom: [{
        zoom: [Xn, ye, ve]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ne()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: ne()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", ye, ve]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scrollbar Thumb Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": ne()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": ne()
      }],
      /**
       * Scrollbar Gutter
       * @see https://tailwindcss.com/docs/scrollbar-gutter
       */
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      /**
       * Scrollbar Width
       * @see https://tailwindcss.com/docs/scrollbar-width
       */
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": $()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": $()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": $()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": $()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": $()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": $()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": $()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": $()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": $()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": $()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": $()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": $()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": $()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": $()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": $()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": $()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": $()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": $()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": $()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": $()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": $()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": $()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", ye, ve]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...ne()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [De, lr, Va, m0]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...ne()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["start", "end", "right", "left"],
      "inset-y": ["inset-bs", "inset-be", "top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["ps", "pe", "pr", "pl"],
      py: ["pbs", "pbe", "pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["ms", "me", "mr", "ml"],
      my: ["mbs", "mbe", "mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-s", "border-w-e", "border-w-r", "border-w-l"],
      "border-w-y": ["border-w-bs", "border-w-be", "border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-s", "border-color-e", "border-color-r", "border-color-l"],
      "border-color-y": ["border-color-bs", "border-color-be", "border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-ms", "scroll-me", "scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-ps", "scroll-pe", "scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, $R = /* @__PURE__ */ CR(IR);
function Fe(...n) {
  return $R(pb(n));
}
const YR = vb(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), wn = v.forwardRef(
  ({ className: n, variant: i, size: o, asChild: r = !1, ...c }, f) => {
    const d = r ? ZE : "button";
    return /* @__PURE__ */ b.jsx(
      d,
      {
        className: Fe(YR({ variant: i, size: o, className: n })),
        ref: f,
        ...c
      }
    );
  }
);
wn.displayName = "Button";
var FR = Object.defineProperty, to = (n, i) => FR(n, "name", { value: i, configurable: !0 }), Nb = !!(typeof window < "u" && window.document && window.document.createElement);
function et(n, i, { checkForDefaultPrevented: o = !0 } = {}) {
  return /* @__PURE__ */ to(function(c) {
    if (n?.(c), o === !1 || !c || !c.defaultPrevented)
      return i?.(c);
  }, "handleEvent");
}
to(et, "composeEventHandlers");
function XR(n) {
  if (!Nb)
    throw new Error("Cannot access window outside of the DOM");
  return n?.ownerDocument?.defaultView ?? window;
}
to(XR, "getOwnerWindow");
function dg(n) {
  if (!Nb)
    throw new Error("Cannot access document outside of the DOM");
  return n?.ownerDocument ?? document;
}
to(dg, "getOwnerDocument");
function Db(n, i = !1) {
  const { activeElement: o } = dg(n);
  if (!o?.nodeName)
    return null;
  if (jb(o) && o.contentDocument)
    return Db(o.contentDocument.body, i);
  if (i) {
    const r = o.getAttribute("aria-activedescendant");
    if (r) {
      const c = dg(o).getElementById(r);
      if (c)
        return c;
    }
  }
  return o;
}
to(Db, "getActiveElement");
function jb(n) {
  return n.tagName === "IFRAME";
}
to(jb, "isFrame");
var QR = Object.defineProperty, En = (n, i) => QR(n, "name", { value: i, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function ZR(n, i) {
  const o = v.createContext(i);
  o.displayName = n + "Context";
  const r = /* @__PURE__ */ En((f) => {
    const { children: d, ...g } = f, h = v.useMemo(() => g, Object.values(g));
    return /* @__PURE__ */ b.jsx(o.Provider, { value: h, children: d });
  }, "Provider");
  r.displayName = n + "Provider";
  function c(f, d = {}) {
    const { optional: g = !1 } = d, h = v.useContext(o);
    if (h) return h;
    if (i !== void 0) return i;
    if (!g)
      throw new Error(`\`${f}\` must be used within \`${n}\``);
  }
  return En(c, "useContext"), [r, c];
}
En(ZR, "createContext");
// @__NO_SIDE_EFFECTS__
function Rl(n, i = []) {
  let o = [];
  function r(f, d) {
    const g = v.createContext(d);
    g.displayName = f + "Context";
    const h = o.length;
    o = [...o, d];
    const y = /* @__PURE__ */ En((p) => {
      const { scope: S, children: C, ...R } = p, _ = S?.[n]?.[h] || g, T = v.useMemo(() => R, Object.values(R));
      return /* @__PURE__ */ b.jsx(_.Provider, { value: T, children: C });
    }, "Provider");
    y.displayName = f + "Provider";
    function x(p, S, C = {}) {
      const { optional: R = !1 } = C, _ = S?.[n]?.[h] || g, T = v.useContext(_);
      if (T) return T;
      if (d !== void 0) return d;
      if (!R)
        throw new Error(`\`${p}\` must be used within \`${f}\``);
    }
    return En(x, "useContext"), [y, x];
  }
  En(r, "createContext");
  const c = /* @__PURE__ */ En(() => {
    const f = o.map((d) => v.createContext(d));
    return /* @__PURE__ */ En(function(g) {
      const h = g?.[n] || f;
      return v.useMemo(
        () => ({ [`__scope${n}`]: { ...g, [n]: h } }),
        [g, h]
      );
    }, "useScope");
  }, "createScope");
  return c.scopeName = n, [r, Hb(c, ...i)];
}
En(Rl, "createContextScope");
function Hb(...n) {
  const i = n[0];
  if (n.length === 1) return i;
  const o = /* @__PURE__ */ En(() => {
    const r = n.map((c) => ({
      useScope: c(),
      scopeName: c.scopeName
    }));
    return /* @__PURE__ */ En(function(f) {
      const d = r.reduce((g, { useScope: h, scopeName: y }) => {
        const p = h(f)[`__scope${y}`];
        return { ...g, ...p };
      }, {});
      return v.useMemo(() => ({ [`__scope${i.scopeName}`]: d }), [d]);
    }, "useComposedScopes");
  }, "createScope");
  return o.scopeName = i.scopeName, o;
}
En(Hb, "composeContextScopes");
var KR = Object.defineProperty, Ct = (n, i) => KR(n, "name", { value: i, configurable: !0 });
// @__NO_SIDE_EFFECTS__
function Lb(n) {
  const i = n + "CollectionProvider", [o, r] = /* @__PURE__ */ Rl(i), [c, f] = o(
    i,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  ), d = /* @__PURE__ */ Ct((_) => {
    const { scope: T, children: O } = _, D = v.useRef(null), U = v.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ b.jsx(c, { scope: T, itemMap: U, collectionRef: D, children: O });
  }, "CollectionProvider");
  d.displayName = i;
  const g = n + "CollectionSlot", h = /* @__PURE__ */ ia(g), y = v.forwardRef(
    (_, T) => {
      const { scope: O, children: D } = _, U = f(g, O), P = Ht(T, U.collectionRef);
      return /* @__PURE__ */ b.jsx(h, { ref: P, children: D });
    }
  );
  y.displayName = g;
  const x = n + "CollectionItemSlot", p = "data-radix-collection-item", S = /* @__PURE__ */ ia(x), C = v.forwardRef(
    (_, T) => {
      const { scope: O, children: D, ...U } = _, P = v.useRef(null), Q = Ht(T, P), B = f(x, O);
      return v.useEffect(() => (B.itemMap.set(P, { ref: P, ...U }), () => {
        B.itemMap.delete(P);
      })), /* @__PURE__ */ b.jsx(S, { [p]: "", ref: Q, children: D });
    }
  );
  C.displayName = x;
  function R(_) {
    const T = f(n + "CollectionConsumer", _);
    return v.useCallback(() => {
      const D = T.collectionRef.current;
      if (!D) return [];
      const U = Array.from(D.querySelectorAll(`[${p}]`));
      return Array.from(T.itemMap.values()).sort(
        (B, H) => U.indexOf(B.ref.current) - U.indexOf(H.ref.current)
      );
    }, [T.collectionRef, T.itemMap]);
  }
  return Ct(R, "useCollection"), [
    { Provider: d, Slot: y, ItemSlot: C },
    R,
    r
  ];
}
Ct(Lb, "createCollection");
var v0 = /* @__PURE__ */ new WeakMap(), mt, cn, Md = (cn = class extends Map {
  constructor(o) {
    super(o);
    Zy(this, mt);
    Cd(this, mt, [...super.keys()]), v0.set(this, !0);
  }
  set(o, r) {
    return v0.get(this) && (this.has(o) ? Dt(this, mt)[Dt(this, mt).indexOf(o)] = o : Dt(this, mt).push(o)), super.set(o, r), this;
  }
  insert(o, r, c) {
    const f = this.has(r), d = Dt(this, mt).length, g = Ig(o);
    let h = g >= 0 ? g : d + g;
    const y = h < 0 || h >= d ? -1 : h;
    if (y === this.size || f && y === this.size - 1 || y === -1)
      return this.set(r, c), this;
    const x = this.size + (f ? 0 : 1);
    g < 0 && h++;
    const p = [...Dt(this, mt)];
    let S, C = !1;
    for (let R = h; R < x; R++)
      if (h === R) {
        let _ = p[R];
        p[R] === r && (_ = p[R + 1]), f && this.delete(r), S = this.get(_), this.set(r, c);
      } else {
        !C && p[R - 1] === r && (C = !0);
        const _ = p[C ? R : R - 1], T = S;
        S = this.get(_), this.delete(_), this.set(_, T);
      }
    return this;
  }
  with(o, r, c) {
    const f = new cn(this);
    return f.insert(o, r, c), f;
  }
  before(o) {
    const r = Dt(this, mt).indexOf(o) - 1;
    if (!(r < 0))
      return this.entryAt(r);
  }
  /**
   * Sets a new key-value pair at the position before the given key.
   */
  setBefore(o, r, c) {
    const f = Dt(this, mt).indexOf(o);
    return f === -1 ? this : this.insert(f, r, c);
  }
  after(o) {
    let r = Dt(this, mt).indexOf(o);
    if (r = r === -1 || r === this.size - 1 ? -1 : r + 1, r !== -1)
      return this.entryAt(r);
  }
  /**
   * Sets a new key-value pair at the position after the given key.
   */
  setAfter(o, r, c) {
    const f = Dt(this, mt).indexOf(o);
    return f === -1 ? this : this.insert(f + 1, r, c);
  }
  first() {
    return this.entryAt(0);
  }
  last() {
    return this.entryAt(-1);
  }
  clear() {
    return Cd(this, mt, []), super.clear();
  }
  delete(o) {
    const r = super.delete(o);
    return r && Dt(this, mt).splice(Dt(this, mt).indexOf(o), 1), r;
  }
  deleteAt(o) {
    const r = this.keyAt(o);
    return r !== void 0 ? this.delete(r) : !1;
  }
  at(o) {
    const r = rs(Dt(this, mt), o);
    if (r !== void 0)
      return this.get(r);
  }
  entryAt(o) {
    const r = rs(Dt(this, mt), o);
    if (r !== void 0)
      return [r, this.get(r)];
  }
  indexOf(o) {
    return Dt(this, mt).indexOf(o);
  }
  keyAt(o) {
    return rs(Dt(this, mt), o);
  }
  from(o, r) {
    const c = this.indexOf(o);
    if (c === -1)
      return;
    let f = c + r;
    return f < 0 && (f = 0), f >= this.size && (f = this.size - 1), this.at(f);
  }
  keyFrom(o, r) {
    const c = this.indexOf(o);
    if (c === -1)
      return;
    let f = c + r;
    return f < 0 && (f = 0), f >= this.size && (f = this.size - 1), this.keyAt(f);
  }
  find(o, r) {
    let c = 0;
    for (const f of this) {
      if (Reflect.apply(o, r, [f, c, this]))
        return f;
      c++;
    }
  }
  findIndex(o, r) {
    let c = 0;
    for (const f of this) {
      if (Reflect.apply(o, r, [f, c, this]))
        return c;
      c++;
    }
    return -1;
  }
  filter(o, r) {
    const c = [];
    let f = 0;
    for (const d of this)
      Reflect.apply(o, r, [d, f, this]) && c.push(d), f++;
    return new cn(c);
  }
  map(o, r) {
    const c = [];
    let f = 0;
    for (const d of this)
      c.push([d[0], Reflect.apply(o, r, [d, f, this])]), f++;
    return new cn(c);
  }
  reduce(...o) {
    const [r, c] = o;
    let f = 0, d = c ?? this.at(0);
    for (const g of this)
      f === 0 && o.length === 1 ? d = g : d = Reflect.apply(r, this, [d, g, f, this]), f++;
    return d;
  }
  reduceRight(...o) {
    const [r, c] = o;
    let f = c ?? this.at(-1);
    for (let d = this.size - 1; d >= 0; d--) {
      const g = this.at(d);
      d === this.size - 1 && o.length === 1 ? f = g : f = Reflect.apply(r, this, [f, g, d, this]);
    }
    return f;
  }
  toSorted(o) {
    const r = [...this.entries()].sort(o);
    return new cn(r);
  }
  toReversed() {
    const o = new cn();
    for (let r = this.size - 1; r >= 0; r--) {
      const c = this.keyAt(r), f = this.get(c);
      o.set(c, f);
    }
    return o;
  }
  toSpliced(...o) {
    const r = [...this.entries()];
    return r.splice(...o), new cn(r);
  }
  slice(o, r) {
    const c = new cn();
    let f = this.size - 1;
    if (o === void 0)
      return c;
    o < 0 && (o = o + this.size), r !== void 0 && r > 0 && (f = r - 1);
    for (let d = o; d <= f; d++) {
      const g = this.keyAt(d), h = this.get(g);
      c.set(g, h);
    }
    return c;
  }
  every(o, r) {
    let c = 0;
    for (const f of this) {
      if (!Reflect.apply(o, r, [f, c, this]))
        return !1;
      c++;
    }
    return !0;
  }
  some(o, r) {
    let c = 0;
    for (const f of this) {
      if (Reflect.apply(o, r, [f, c, this]))
        return !0;
      c++;
    }
    return !1;
  }
}, mt = new WeakMap(), Ct(cn, "OrderedDict"), cn);
function rs(n, i) {
  if ("at" in Array.prototype)
    return Array.prototype.at.call(n, i);
  const o = Ub(n, i);
  return o === -1 ? void 0 : n[o];
}
Ct(rs, "at");
function Ub(n, i) {
  const o = n.length, r = Ig(i), c = r >= 0 ? r : o + r;
  return c < 0 || c >= o ? -1 : c;
}
Ct(Ub, "toSafeIndex");
function Ig(n) {
  return n !== n || n === 0 ? 0 : Math.trunc(n);
}
Ct(Ig, "toSafeInteger");
// @__NO_SIDE_EFFECTS__
function JR(n) {
  const i = n + "CollectionProvider", [o, r] = /* @__PURE__ */ Rl(i), [c, f] = o(
    i,
    {
      collectionElement: null,
      collectionRef: { current: null },
      collectionRefObject: { current: null },
      itemMap: new Md(),
      setItemMap: /* @__PURE__ */ Ct(() => {
      }, "setItemMap")
    }
  ), d = /* @__PURE__ */ Ct(({ state: U, ...P }) => U ? /* @__PURE__ */ b.jsx(h, { ...P, state: U }) : /* @__PURE__ */ b.jsx(g, { ...P }), "CollectionProvider");
  d.displayName = i;
  const g = /* @__PURE__ */ Ct((U) => {
    const P = T();
    return /* @__PURE__ */ b.jsx(h, { ...U, state: P });
  }, "CollectionInit");
  g.displayName = i + "Init";
  const h = /* @__PURE__ */ Ct((U) => {
    const { scope: P, children: Q, state: B } = U, H = v.useRef(null), [$, ae] = v.useState(
      null
    ), K = Ht(H, ae), [se, oe] = B;
    return v.useEffect(() => {
      if (!$) return;
      const he = kb(() => {
      });
      return he.observe($, {
        childList: !0,
        subtree: !0
      }), () => {
        he.disconnect();
      };
    }, [$]), /* @__PURE__ */ b.jsx(
      c,
      {
        scope: P,
        itemMap: se,
        setItemMap: oe,
        collectionRef: K,
        collectionRefObject: H,
        collectionElement: $,
        children: Q
      }
    );
  }, "CollectionProviderImpl");
  h.displayName = i + "Impl";
  const y = n + "CollectionSlot", x = /* @__PURE__ */ ia(y), p = v.forwardRef(
    (U, P) => {
      const { scope: Q, children: B } = U, H = f(y, Q), $ = Ht(P, H.collectionRef);
      return /* @__PURE__ */ b.jsx(x, { ref: $, children: B });
    }
  );
  p.displayName = y;
  const S = n + "CollectionItemSlot", C = "data-radix-collection-item", R = /* @__PURE__ */ ia(S), _ = v.forwardRef(
    (U, P) => {
      const { scope: Q, children: B, ...H } = U, $ = v.useRef(null), [ae, K] = v.useState(null), se = Ht(P, $, K), oe = f(S, Q), { setItemMap: he } = oe, ge = v.useRef(H);
      Vb(ge.current, H) || (ge.current = H);
      const de = ge.current;
      return v.useEffect(() => {
        const Z = de;
        return he((le) => ae ? le.has(ae) ? le.set(ae, { ...Z, element: ae }).toSorted(gg) : (le.set(ae, { ...Z, element: ae }), le.toSorted(gg)) : le), () => {
          he((le) => !ae || !le.has(ae) ? le : (le.delete(ae), new Md(le)));
        };
      }, [ae, de, he]), /* @__PURE__ */ b.jsx(R, { [C]: "", ref: se, children: B });
    }
  );
  _.displayName = S;
  function T() {
    return v.useState(new Md());
  }
  Ct(T, "useInitCollection");
  function O(U) {
    const { itemMap: P } = f(n + "CollectionConsumer", U);
    return P;
  }
  return Ct(O, "useCollection"), [
    { Provider: d, Slot: p, ItemSlot: _ },
    {
      createCollectionScope: r,
      useCollection: O,
      useInitCollection: T
    }
  ];
}
Ct(JR, "createCollection");
function Vb(n, i) {
  if (n === i) return !0;
  if (typeof n != "object" || typeof i != "object" || n == null || i == null) return !1;
  const o = Object.keys(n), r = Object.keys(i);
  if (o.length !== r.length) return !1;
  for (const c of o)
    if (!Object.prototype.hasOwnProperty.call(i, c) || n[c] !== i[c]) return !1;
  return !0;
}
Ct(Vb, "shallowEqual");
function Gb(n, i) {
  return !!(i.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING);
}
Ct(Gb, "isElementPreceding");
function gg(n, i) {
  return !n[1].element || !i[1].element ? 0 : Gb(n[1].element, i[1].element) ? -1 : 1;
}
Ct(gg, "sortByDocumentPosition");
function kb(n) {
  return new MutationObserver((o) => {
    for (const r of o)
      if (r.type === "childList") {
        n();
        return;
      }
  });
}
Ct(kb, "getChildListObserver");
var Xt = globalThis?.document ? v.useLayoutEffect : () => {
}, WR = Object.defineProperty, e_ = (n, i) => WR(n, "name", { value: i, configurable: !0 }), t_ = Qa[" useId ".trim().toString()] || (() => {
}), n_ = 0;
function fn(n) {
  const [i, o] = v.useState(t_());
  return Xt(() => {
    n || o((r) => r ?? String(n_++));
  }, [n]), n || (i ? `radix-${i}` : "");
}
e_(fn, "useId");
var $g = ib(), l_ = Object.defineProperty, a_ = (n, i) => l_(n, "name", { value: i, configurable: !0 }), i_ = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
], Ye = i_.reduce((n, i) => {
  const o = /* @__PURE__ */ ia(`Primitive.${i}`), r = v.forwardRef((c, f) => {
    const { asChild: d, ...g } = c, h = d ? o : i;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ b.jsx(h, { ...g, ref: f });
  });
  return r.displayName = `Primitive.${i}`, { ...n, [i]: r };
}, {});
function Bb(n, i) {
  n && $g.flushSync(() => n.dispatchEvent(i));
}
a_(Bb, "dispatchDiscreteCustomEvent");
var o_ = Object.defineProperty, r_ = (n, i) => o_(n, "name", { value: i, configurable: !0 });
function oa(n) {
  const i = v.useRef(n);
  return v.useEffect(() => {
    i.current = n;
  }), v.useMemo(() => ((...o) => i.current?.(...o)), []);
}
r_(oa, "useCallbackRef");
var u_ = Object.defineProperty, s_ = (n, i) => u_(n, "name", { value: i, configurable: !0 }), y0 = Qa[" useEffectEvent ".trim().toString()], b0 = Qa[" useInsertionEffect ".trim().toString()];
function qb(n) {
  if (typeof y0 == "function")
    return y0(n);
  const i = v.useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  return typeof b0 == "function" ? b0(() => {
    i.current = n;
  }) : Xt(() => {
    i.current = n;
  }), v.useMemo(() => ((...o) => i.current?.(...o)), []);
}
s_(qb, "useEffectEvent");
var c_ = Object.defineProperty, pr = (n, i) => c_(n, "name", { value: i, configurable: !0 }), f_ = Qa[" useInsertionEffect ".trim().toString()] || Xt;
function ga({
  prop: n,
  defaultProp: i,
  onChange: o = /* @__PURE__ */ pr(() => {
  }, "onChange"),
  caller: r
}) {
  const [c, f, d] = Pb({
    defaultProp: i,
    onChange: o
  }), g = n !== void 0, h = g ? n : c, y = v.useCallback(
    (x) => {
      if (g) {
        const p = Ib(x) ? x(n) : x;
        p !== n && d.current?.(p);
      } else
        f(x);
    },
    [g, n, f, d]
  );
  return [h, y];
}
pr(ga, "useControllableState");
function Pb({
  defaultProp: n,
  onChange: i
}) {
  const [o, r] = v.useState(n), c = v.useRef(o), f = v.useRef(i);
  return f_(() => {
    f.current = i;
  }, [i]), v.useEffect(() => {
    c.current !== o && (f.current?.(o), c.current = o);
  }, [o, c]), [o, r, f];
}
pr(Pb, "useUncontrolledState");
function Ib(n) {
  return typeof n == "function";
}
pr(Ib, "isFunction");
var S0 = /* @__PURE__ */ Symbol("RADIX:SYNC_STATE");
function d_(n, i, o, r) {
  const { prop: c, defaultProp: f, onChange: d, caller: g } = i, h = c !== void 0, y = qb(d), x = [{ ...o, state: f }];
  r && x.push(r);
  const [p, S] = v.useReducer(
    (T, O) => {
      if (O.type === S0)
        return { ...T, state: O.state };
      const D = n(T, O);
      return h && !Object.is(D.state, T.state) && y(D.state), D;
    },
    ...x
  ), C = p.state, R = v.useRef(C);
  v.useEffect(() => {
    R.current !== C && (R.current = C, h || y(C));
  }, [C, R, h]);
  const _ = v.useMemo(() => c !== void 0 ? { ...p, state: c } : p, [p, c]);
  return v.useEffect(() => {
    h && !Object.is(c, p.state) && S({ type: S0, state: c });
  }, [c, p.state, h]), [_, S];
}
pr(d_, "useControllableStateReducer");
var g_ = Object.defineProperty, m_ = (n, i) => g_(n, "name", { value: i, configurable: !0 }), h_ = v.createContext(void 0);
function Rs(n) {
  const i = v.useContext(h_);
  return n || i || "ltr";
}
m_(Rs, "useDirection");
var p_ = Object.defineProperty, Yg = (n, i) => p_(n, "name", { value: i, configurable: !0 }), Nd = !1;
function $b() {
  const [n, i] = v.useState(Nd);
  return v.useEffect(() => {
    Nd || (Nd = !0, i(!0));
  }, []), n;
}
Yg($b, "useIsHydrated");
var Yb = Qa[" useSyncExternalStore ".trim().toString()];
function Fb() {
  return () => {
  };
}
Yg(Fb, "subscribe");
function Xb() {
  return Yb(
    Fb,
    () => !0,
    () => !1
  );
}
Yg(Xb, "useIsHydratedModern");
var v_ = typeof Yb == "function" ? Xb : $b, y_ = Object.defineProperty, Ka = (n, i) => y_(n, "name", { value: i, configurable: !0 }), Dd = "rovingFocusGroup.onEntryFocus", b_ = { bubbles: !1, cancelable: !0 }, _s = "RovingFocusGroup", [mg, Qb, S_] = /* @__PURE__ */ Lb(_s), [x_, Ts] = /* @__PURE__ */ Rl(
  _s,
  [S_]
), [C_, w_] = x_(_s), E_ = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Ka(function(i, o) {
    return /* @__PURE__ */ b.jsx(mg.Provider, { scope: i.__scopeRovingFocusGroup, children: /* @__PURE__ */ b.jsx(mg.Slot, { scope: i.__scopeRovingFocusGroup, children: /* @__PURE__ */ b.jsx(R_, { ...i, ref: o }) }) });
  }, "RovingFocusGroup")
), R_ = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ Ka(function(i, o) {
  const {
    __scopeRovingFocusGroup: r,
    orientation: c,
    loop: f = !1,
    dir: d,
    currentTabStopId: g,
    defaultCurrentTabStopId: h,
    onCurrentTabStopIdChange: y,
    onEntryFocus: x,
    preventScrollOnEntryFocus: p = !1,
    ...S
  } = i, C = v.useRef(null), R = Ht(o, C), _ = Rs(d), [T, O] = ga({
    prop: g,
    defaultProp: h ?? null,
    onChange: y,
    caller: _s
  }), [D, U] = v.useState(!1), P = oa(x), Q = Qb(r), B = v.useRef(!1), [H, $] = v.useState(0);
  return v.useEffect(() => {
    const ae = C.current;
    if (ae)
      return ae.addEventListener(Dd, P), () => ae.removeEventListener(Dd, P);
  }, [P]), /* @__PURE__ */ b.jsx(
    C_,
    {
      scope: r,
      orientation: c,
      dir: _,
      loop: f,
      currentTabStopId: T,
      onItemFocus: v.useCallback(
        (ae) => O(ae),
        [O]
      ),
      onItemShiftTab: v.useCallback(() => U(!0), []),
      onFocusableItemAdd: v.useCallback(
        () => $((ae) => ae + 1),
        []
      ),
      onFocusableItemRemove: v.useCallback(
        () => $((ae) => ae - 1),
        []
      ),
      children: /* @__PURE__ */ b.jsx(
        Ye.div,
        {
          tabIndex: D || H === 0 ? -1 : 0,
          "data-orientation": c,
          ...S,
          ref: R,
          style: { outline: "none", ...i.style },
          onMouseDown: et(i.onMouseDown, () => {
            B.current = !0;
          }),
          onFocus: et(i.onFocus, (ae) => {
            const K = !B.current;
            if (ae.target === ae.currentTarget && K && !D) {
              const se = new CustomEvent(Dd, b_);
              if (ae.currentTarget.dispatchEvent(se), !se.defaultPrevented) {
                const oe = Q().filter((le) => le.focusable), he = oe.find((le) => le.active), ge = oe.find((le) => le.id === T), Z = [he, ge, ...oe].filter(
                  Boolean
                ).map((le) => le.ref.current);
                Fg(Z, p);
              }
            }
            B.current = !1;
          }),
          onBlur: et(i.onBlur, () => U(!1))
        }
      )
    }
  );
}, "RovingFocusGroupImpl")), __ = "RovingFocusGroupItem", T_ = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Ka(function(i, o) {
    const {
      __scopeRovingFocusGroup: r,
      focusable: c = !0,
      active: f = !1,
      tabStopId: d,
      children: g,
      ...h
    } = i, y = fn(), x = d || y, p = w_(__, r), S = p.currentTabStopId === x, C = Qb(r), { onFocusableItemAdd: R, onFocusableItemRemove: _, currentTabStopId: T } = p, O = v_();
    return Xt(() => {
      if (!(!O || !c))
        return R(), () => _();
    }, [O, c, R, _]), v.useEffect(() => {
      if (!(O || !c))
        return R(), () => _();
    }, [O, c, R, _]), /* @__PURE__ */ b.jsx(
      mg.ItemSlot,
      {
        scope: r,
        id: x,
        focusable: c,
        active: f,
        children: /* @__PURE__ */ b.jsx(
          Ye.span,
          {
            tabIndex: S ? 0 : -1,
            "data-orientation": p.orientation,
            ...h,
            ref: o,
            onMouseDown: et(i.onMouseDown, (D) => {
              c ? p.onItemFocus(x) : D.preventDefault();
            }),
            onFocus: et(i.onFocus, () => p.onItemFocus(x)),
            onKeyDown: et(i.onKeyDown, (D) => {
              if (D.key === "Tab" && D.shiftKey) {
                p.onItemShiftTab();
                return;
              }
              if (D.target !== D.currentTarget) return;
              const U = Kb(D, p.orientation, p.dir);
              if (U !== void 0) {
                if (D.metaKey || D.ctrlKey || D.altKey || D.shiftKey) return;
                D.preventDefault();
                let Q = C().filter((B) => B.focusable).map((B) => B.ref.current);
                if (U === "last") Q.reverse();
                else if (U === "prev" || U === "next") {
                  U === "prev" && Q.reverse();
                  const B = Q.indexOf(D.currentTarget);
                  Q = p.loop ? Jb(Q, B + 1) : Q.slice(B + 1);
                }
                setTimeout(() => Fg(Q));
              }
            }),
            children: typeof g == "function" ? g({ isCurrentTabStop: S, hasTabStop: T != null }) : g
          }
        )
      }
    );
  }, "RovingFocusGroupItem")
), A_ = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Zb(n, i) {
  return i !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
Ka(Zb, "getDirectionAwareKey");
function Kb(n, i, o) {
  const r = Zb(n.key, o);
  if (!(i === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(i === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return A_[r];
}
Ka(Kb, "getFocusIntent");
function Fg(n, i = !1) {
  const o = document.activeElement;
  for (const r of n)
    if (r === o || (r.focus({ preventScroll: i }), document.activeElement !== o)) return;
}
Ka(Fg, "focusFirst");
function Jb(n, i) {
  return n.map((o, r) => n[(i + r) % n.length]);
}
Ka(Jb, "wrapArray");
var Wb = E_, eS = T_, z_ = Object.defineProperty, wl = (n, i) => z_(n, "name", { value: i, configurable: !0 });
function tS(n, i) {
  return v.useReducer((o, r) => i[o][r] ?? o, n);
}
wl(tS, "useStateMachine");
var no = /* @__PURE__ */ wl((n) => {
  const { present: i, children: o } = n, r = nS(i), c = typeof o == "function" ? o({ present: r.isPresent }) : v.Children.only(o), f = lS(r.ref, aS(c));
  return typeof o == "function" || r.isPresent ? v.cloneElement(c, { ref: f }) : null;
}, "Presence");
function nS(n) {
  const [i, o] = v.useState(), r = v.useRef(null), c = v.useRef(n), f = v.useRef("none"), d = v.useRef(void 0), g = n ? "mounted" : "unmounted", [h, y] = tS(g, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  return v.useEffect(() => {
    h === "mounted" ? (f.current = d.current ?? Fi(r.current), d.current = void 0) : f.current = "none";
  }, [h]), Xt(() => {
    const x = r.current, p = c.current;
    if (p !== n) {
      const C = f.current, R = Fi(x);
      n ? (d.current = R, y("MOUNT")) : R === "none" || x?.display === "none" ? y("UNMOUNT") : y(p && C !== R ? "ANIMATION_OUT" : "UNMOUNT"), c.current = n;
    }
  }, [n, y]), Xt(() => {
    if (i) {
      let x;
      const p = i.ownerDocument.defaultView ?? window, S = /* @__PURE__ */ wl((R) => {
        const T = Fi(r.current).includes(CSS.escape(R.animationName));
        if (R.target === i && T && (y("ANIMATION_END"), !c.current)) {
          const O = i.style.animationFillMode;
          i.style.animationFillMode = "forwards", x = p.setTimeout(() => {
            i.style.animationFillMode === "forwards" && (i.style.animationFillMode = O);
          });
        }
      }, "handleAnimationEnd"), C = /* @__PURE__ */ wl((R) => {
        R.target === i && (f.current = Fi(r.current));
      }, "handleAnimationStart");
      return i.addEventListener("animationstart", C), i.addEventListener("animationcancel", S), i.addEventListener("animationend", S), () => {
        p.clearTimeout(x), i.removeEventListener("animationstart", C), i.removeEventListener("animationcancel", S), i.removeEventListener("animationend", S);
      };
    } else
      y("ANIMATION_END");
  }, [i, y]), {
    isPresent: ["mounted", "unmountSuspended"].includes(h),
    ref: v.useCallback((x) => {
      if (x) {
        const p = getComputedStyle(x);
        r.current = p, d.current = Fi(p);
      } else
        r.current = null;
      o(x);
    }, [])
  };
}
wl(nS, "usePresence");
function hg(n, i) {
  if (typeof n == "function")
    return n(i);
  n != null && (n.current = i);
}
wl(hg, "setRef");
function lS(...n) {
  const i = v.useRef(n);
  return i.current = n, v.useCallback((o) => {
    const r = i.current;
    let c = !1;
    const f = r.map((d) => {
      const g = hg(d, o);
      return !c && typeof g == "function" && (c = !0), g;
    });
    if (c)
      return () => {
        for (let d = 0; d < f.length; d++) {
          const g = f[d];
          typeof g == "function" ? g() : hg(r[d], null);
        }
      };
  }, []);
}
wl(lS, "useStableComposedRefs");
function Fi(n) {
  return n?.animationName || "none";
}
wl(Fi, "getAnimationName");
function aS(n) {
  let i = Object.getOwnPropertyDescriptor(n.props, "ref")?.get, o = i && "isReactWarning" in i && i.isReactWarning;
  return o ? n.ref : (i = Object.getOwnPropertyDescriptor(n, "ref")?.get, o = i && "isReactWarning" in i && i.isReactWarning, o ? n.props.ref : n.props.ref || n.ref);
}
wl(aS, "getElementRef");
var O_ = Object.defineProperty, lo = (n, i) => O_(n, "name", { value: i, configurable: !0 }), Xg = "Tabs", [M_, QO] = /* @__PURE__ */ Rl(Xg, [
  Ts
]), iS = Ts(), [N_, Qg] = M_(Xg), D_ = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ lo(function(i, o) {
    const {
      __scopeTabs: r,
      value: c,
      onValueChange: f,
      defaultValue: d,
      orientation: g = "horizontal",
      dir: h,
      activationMode: y = "automatic",
      ...x
    } = i, p = Rs(h), [S, C] = ga({
      prop: c,
      onChange: f,
      defaultProp: d ?? "",
      caller: Xg
    });
    return /* @__PURE__ */ b.jsx(
      N_,
      {
        scope: r,
        baseId: fn(),
        value: S,
        onValueChange: C,
        orientation: g,
        dir: p,
        activationMode: y,
        children: /* @__PURE__ */ b.jsx(
          Ye.div,
          {
            dir: p,
            "data-orientation": g,
            ...x,
            ref: o
          }
        )
      }
    );
  }, "Tabs")
), j_ = "TabsList", H_ = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ lo(function(i, o) {
    const { __scopeTabs: r, loop: c = !0, ...f } = i, d = Qg(j_, r), g = iS(r);
    return /* @__PURE__ */ b.jsx(
      Wb,
      {
        asChild: !0,
        ...g,
        orientation: d.orientation,
        dir: d.dir,
        loop: c,
        children: /* @__PURE__ */ b.jsx(
          Ye.div,
          {
            role: "tablist",
            "aria-orientation": d.orientation,
            ...f,
            ref: o
          }
        )
      }
    );
  }, "TabsList")
), L_ = "TabsTrigger", U_ = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ lo(function(i, o) {
    const { __scopeTabs: r, value: c, disabled: f = !1, ...d } = i, g = Qg(L_, r), h = iS(r), y = Zg(g.baseId, c), x = Kg(g.baseId, c), p = c === g.value;
    return /* @__PURE__ */ b.jsx(
      eS,
      {
        asChild: !0,
        ...h,
        focusable: !f,
        active: p,
        children: /* @__PURE__ */ b.jsx(
          Ye.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": p,
            "aria-controls": x,
            "data-state": p ? "active" : "inactive",
            "data-disabled": f ? "" : void 0,
            disabled: f,
            id: y,
            ...d,
            ref: o,
            onMouseDown: et(i.onMouseDown, (S) => {
              !f && S.button === 0 && S.ctrlKey === !1 ? g.onValueChange(c) : S.preventDefault();
            }),
            onKeyDown: et(i.onKeyDown, (S) => {
              f || S.target !== S.currentTarget || [" ", "Enter"].includes(S.key) && g.onValueChange(c);
            }),
            onFocus: et(i.onFocus, () => {
              const S = g.activationMode !== "manual";
              !p && !f && S && g.onValueChange(c);
            })
          }
        )
      }
    );
  }, "TabsTrigger")
), V_ = "TabsContent", G_ = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ lo(function(i, o) {
    const { __scopeTabs: r, value: c, forceMount: f, children: d, ...g } = i, h = Qg(V_, r), y = Zg(h.baseId, c), x = Kg(h.baseId, c), p = c === h.value, S = v.useRef(p);
    return v.useEffect(() => {
      const C = requestAnimationFrame(() => S.current = !1);
      return () => cancelAnimationFrame(C);
    }, []), /* @__PURE__ */ b.jsx(no, { present: f || p, children: ({ present: C }) => /* @__PURE__ */ b.jsx(
      Ye.div,
      {
        "data-state": p ? "active" : "inactive",
        "data-orientation": h.orientation,
        role: "tabpanel",
        "aria-labelledby": y,
        hidden: !C,
        id: x,
        tabIndex: 0,
        ...g,
        ref: o,
        style: {
          ...i.style,
          animationDuration: S.current ? "0s" : void 0
        },
        children: C && d
      }
    ) });
  }, "TabsContent")
);
function Zg(n, i) {
  return `${n}-trigger-${i}`;
}
lo(Zg, "makeTriggerId");
function Kg(n, i) {
  return `${n}-content-${i}`;
}
lo(Kg, "makeContentId");
var k_ = D_, oS = H_, rS = U_, uS = G_;
const x0 = k_, pg = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  oS,
  {
    ref: o,
    className: Fe(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      n
    ),
    ...i
  }
));
pg.displayName = oS.displayName;
const Ba = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  rS,
  {
    ref: o,
    className: Fe(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      n
    ),
    ...i
  }
));
Ba.displayName = rS.displayName;
const us = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  uS,
  {
    ref: o,
    className: Fe(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      n
    ),
    ...i
  }
));
us.displayName = uS.displayName;
var B_ = Object.defineProperty, xt = (n, i) => B_(n, "name", { value: i, configurable: !0 }), vg = "dismissableLayer.update", q_ = "dismissableLayer.pointerDownOutside", P_ = "dismissableLayer.focusOutside", C0, sS = v.createContext({
  layers: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  branches: /* @__PURE__ */ new Set(),
  // Outside elements that belong to a layer's own dismiss affordance (eg, a
  // dialog overlay). Pressing them should dismiss the layer regardless of
  // whether or not they stop propagation.
  //
  // See https://github.com/radix-ui/primitives/issues/3346
  dismissableSurfaces: /* @__PURE__ */ new Set()
}), cS = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ xt(function(i, o) {
    const {
      disableOutsidePointerEvents: r = !1,
      deferPointerDownOutside: c = !1,
      onEscapeKeyDown: f,
      onPointerDownOutside: d,
      onFocusOutside: g,
      onInteractOutside: h,
      onDismiss: y,
      ...x
    } = i, p = v.useContext(sS), [S, C] = v.useState(null), R = S?.ownerDocument ?? globalThis?.document, [, _] = v.useState({}), T = Ht(o, C), O = Array.from(p.layers), [D] = [
      ...p.layersWithOutsidePointerEventsDisabled
    ].slice(-1), U = D ? O.indexOf(D) : -1, P = S ? O.indexOf(S) : -1, Q = p.layersWithOutsidePointerEventsDisabled.size > 0, B = P >= U, H = v.useRef(!1), $ = dS(
      (oe) => {
        d?.(oe), h?.(oe), oe.defaultPrevented || y?.();
      },
      {
        ownerDocument: R,
        deferPointerDownOutside: c,
        isDeferredPointerDownOutsideRef: H,
        dismissableSurfaces: p.dismissableSurfaces,
        shouldHandlePointerDownOutside: v.useCallback(
          (oe) => {
            if (!(oe instanceof Node))
              return !1;
            const he = [...p.branches].some(
              (ge) => ge.contains(oe)
            );
            return B && !he;
          },
          [p.branches, B]
        )
      }
    ), ae = gS((oe) => {
      if (c && H.current)
        return;
      const he = oe.target;
      [...p.branches].some((de) => de.contains(he)) || (g?.(oe), h?.(oe), oe.defaultPrevented || y?.());
    }, R), K = S ? P === O.length - 1 : !1, se = oa((oe) => {
      oe.key === "Escape" && (f?.(oe), !oe.defaultPrevented && y && (oe.preventDefault(), y()));
    });
    return v.useEffect(() => {
      if (K)
        return R.addEventListener("keydown", se, { capture: !0 }), () => R.removeEventListener("keydown", se, { capture: !0 });
    }, [R, K, se]), v.useEffect(() => {
      if (S)
        return r && (p.layersWithOutsidePointerEventsDisabled.size === 0 && (C0 = R.body.style.pointerEvents, R.body.style.pointerEvents = "none"), p.layersWithOutsidePointerEventsDisabled.add(S)), p.layers.add(S), yg(), () => {
          r && (p.layersWithOutsidePointerEventsDisabled.delete(S), p.layersWithOutsidePointerEventsDisabled.size === 0 && (R.body.style.pointerEvents = C0));
        };
    }, [S, R, r, p]), v.useEffect(() => () => {
      S && (p.layers.delete(S), p.layersWithOutsidePointerEventsDisabled.delete(S), yg());
    }, [S, p]), v.useEffect(() => {
      const oe = /* @__PURE__ */ xt(() => _({}), "handleUpdate");
      return document.addEventListener(vg, oe), () => document.removeEventListener(vg, oe);
    }, []), /* @__PURE__ */ b.jsx(
      Ye.div,
      {
        ...x,
        ref: T,
        style: {
          pointerEvents: Q ? B ? "auto" : "none" : void 0,
          ...i.style
        },
        onFocusCapture: et(i.onFocusCapture, ae.onFocusCapture),
        onBlurCapture: et(i.onBlurCapture, ae.onBlurCapture),
        onPointerDownCapture: et(
          i.onPointerDownCapture,
          $.onPointerDownCapture
        )
      }
    );
  }, "DismissableLayer")
);
function fS() {
  const n = v.useContext(sS), [i, o] = v.useState(null);
  return v.useEffect(() => {
    if (i)
      return n.dismissableSurfaces.add(i), () => {
        n.dismissableSurfaces.delete(i);
      };
  }, [i, n.dismissableSurfaces]), o;
}
xt(fS, "useDismissableLayerSurface");
var I_ = /* @__PURE__ */ xt(() => !0, "IS_TRUE");
function dS(n, i) {
  const {
    ownerDocument: o = globalThis?.document,
    deferPointerDownOutside: r = !1,
    isDeferredPointerDownOutsideRef: c,
    dismissableSurfaces: f,
    shouldHandlePointerDownOutside: d = I_
  } = i, g = oa(n), h = v.useRef(!1), y = v.useRef(!1), x = v.useRef(/* @__PURE__ */ new Map()), p = v.useRef(() => {
  });
  return v.useEffect(() => {
    function S() {
      y.current = !1, c.current = !1, x.current.clear();
    }
    xt(S, "resetOutsideInteraction");
    function C() {
      return Array.from(x.current.values()).some(Boolean);
    }
    xt(C, "isOutsideInteractionIntercepted");
    function R(U) {
      if (!y.current)
        return;
      const P = U.target;
      P instanceof Node && [...f].some((B) => B.contains(P)) || x.current.set(U.type, !0), U.type === "click" && window.setTimeout(() => {
        y.current && p.current();
      }, 0);
    }
    xt(R, "handleInteractionCapture");
    function _(U) {
      y.current && x.current.set(U.type, !1);
    }
    xt(_, "handleInteractionBubble");
    const T = /* @__PURE__ */ xt((U) => {
      if (U.target && !h.current) {
        let P = function() {
          o.removeEventListener("click", p.current);
          const B = C();
          S(), B || Jg(
            q_,
            g,
            Q,
            { discrete: !0 }
          );
        };
        if (xt(P, "handleAndDispatchPointerDownOutsideEvent"), !d(U.target)) {
          o.removeEventListener("click", p.current), S(), h.current = !1;
          return;
        }
        const Q = { originalEvent: U };
        y.current = !0, c.current = r && U.button === 0, x.current.clear(), !r || U.button !== 0 ? P() : (o.removeEventListener("click", p.current), p.current = P, o.addEventListener("click", p.current, { once: !0 }));
      } else
        o.removeEventListener("click", p.current), S();
      h.current = !1;
    }, "handlePointerDown"), O = [
      "pointerup",
      "mousedown",
      "mouseup",
      "touchstart",
      "touchend",
      "click"
    ];
    for (const U of O)
      o.addEventListener(U, R, !0), o.addEventListener(U, _);
    const D = window.setTimeout(() => {
      o.addEventListener("pointerdown", T);
    }, 0);
    return () => {
      window.clearTimeout(D), o.removeEventListener("pointerdown", T), o.removeEventListener("click", p.current);
      for (const U of O)
        o.removeEventListener(U, R, !0), o.removeEventListener(U, _);
    };
  }, [
    o,
    g,
    r,
    c,
    f,
    d
  ]), {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: /* @__PURE__ */ xt(() => h.current = !0, "onPointerDownCapture")
  };
}
xt(dS, "usePointerDownOutside");
function gS(n, i = globalThis?.document) {
  const o = oa(n), r = v.useRef(!1);
  return v.useEffect(() => {
    const c = /* @__PURE__ */ xt((f) => {
      f.target && !r.current && Jg(P_, o, { originalEvent: f }, {
        discrete: !1
      });
    }, "handleFocus");
    return i.addEventListener("focusin", c), () => i.removeEventListener("focusin", c);
  }, [i, o]), {
    onFocusCapture: /* @__PURE__ */ xt(() => r.current = !0, "onFocusCapture"),
    onBlurCapture: /* @__PURE__ */ xt(() => r.current = !1, "onBlurCapture")
  };
}
xt(gS, "useFocusOutside");
function yg() {
  const n = new CustomEvent(vg);
  document.dispatchEvent(n);
}
xt(yg, "dispatchUpdate");
function Jg(n, i, o, { discrete: r }) {
  const c = o.originalEvent.target, f = new CustomEvent(n, { bubbles: !1, cancelable: !0, detail: o });
  i && c.addEventListener(n, i, { once: !0 }), r ? Bb(c, f) : c.dispatchEvent(f);
}
xt(Jg, "handleAndDispatchCustomEvent");
var $_ = Object.defineProperty, Bt = (n, i) => $_(n, "name", { value: i, configurable: !0 }), jd = "focusScope.autoFocusOnMount", Hd = "focusScope.autoFocusOnUnmount", w0 = { bubbles: !1, cancelable: !0 }, Y_ = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ Bt(function(i, o) {
    const {
      loop: r = !1,
      trapped: c = !1,
      onMountAutoFocus: f,
      onUnmountAutoFocus: d,
      ...g
    } = i, [h, y] = v.useState(null), x = oa(f), p = oa(d), S = v.useRef(null), C = Ht(o, y), R = v.useRef({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    }).current;
    v.useEffect(() => {
      if (c) {
        let T = function(P) {
          if (R.paused || !h) return;
          const Q = P.target;
          h.contains(Q) ? S.current = Q : vl(S.current, { select: !0 });
        }, O = function(P) {
          if (R.paused || !h) return;
          const Q = P.relatedTarget;
          Q !== null && (h.contains(Q) || vl(S.current, { select: !0 }));
        }, D = function(P) {
          if (document.activeElement === document.body)
            for (const B of P)
              B.removedNodes.length > 0 && vl(h);
        };
        Bt(T, "handleFocusIn"), Bt(O, "handleFocusOut"), Bt(D, "handleMutations"), document.addEventListener("focusin", T), document.addEventListener("focusout", O);
        const U = new MutationObserver(D);
        return h && U.observe(h, { childList: !0, subtree: !0 }), () => {
          document.removeEventListener("focusin", T), document.removeEventListener("focusout", O), U.disconnect();
        };
      }
    }, [c, h, R.paused]), v.useEffect(() => {
      if (h) {
        E0.add(R);
        const T = document.activeElement;
        if (!h.contains(T)) {
          const D = new CustomEvent(jd, w0);
          h.addEventListener(jd, x), h.dispatchEvent(D), D.defaultPrevented || (mS(bS(Wg(h)), { select: !0 }), document.activeElement === T && vl(h));
        }
        return () => {
          h.removeEventListener(jd, x), setTimeout(() => {
            const D = new CustomEvent(Hd, w0);
            h.addEventListener(Hd, p), h.dispatchEvent(D), D.defaultPrevented || vl(T ?? document.body, { select: !0 }), h.removeEventListener(Hd, p), E0.remove(R);
          }, 0);
        };
      }
    }, [h, x, p, R]);
    const _ = v.useCallback(
      (T) => {
        if (!r && !c || R.paused) return;
        const O = T.key === "Tab" && !T.altKey && !T.ctrlKey && !T.metaKey, D = document.activeElement;
        if (O && D) {
          const U = T.currentTarget, [P, Q] = hS(U);
          P && Q ? !T.shiftKey && D === Q ? (T.preventDefault(), r && vl(P, { select: !0 })) : T.shiftKey && D === P && (T.preventDefault(), r && vl(Q, { select: !0 })) : D === U && T.preventDefault();
        }
      },
      [r, c, R.paused]
    );
    return /* @__PURE__ */ b.jsx(Ye.div, { tabIndex: -1, ...g, ref: C, onKeyDown: _ });
  }, "FocusScope")
);
function mS(n, { select: i = !1 } = {}) {
  const o = document.activeElement;
  for (const r of n)
    if (vl(r, { select: i }), document.activeElement !== o) return;
}
Bt(mS, "focusFirst");
function hS(n) {
  const i = Wg(n), o = bg(i, n), r = bg(i.reverse(), n);
  return [o, r];
}
Bt(hS, "getTabbableEdges");
function Wg(n) {
  const i = [], o = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, {
    acceptNode: /* @__PURE__ */ Bt((r) => {
      const c = r.tagName === "INPUT" && r.type === "hidden";
      return r.disabled || r.hidden || c ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }, "acceptNode")
  });
  for (; o.nextNode(); ) i.push(o.currentNode);
  return i;
}
Bt(Wg, "getTabbableCandidates");
function bg(n, i) {
  const o = typeof i.checkVisibility == "function" && i.checkVisibility({ checkVisibilityCSS: !0 });
  for (const r of n)
    if (!(o ? !r.checkVisibility({ checkVisibilityCSS: !0 }) : pS(r, { upTo: i })))
      return r;
}
Bt(bg, "findVisible");
function pS(n, { upTo: i }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (i !== void 0 && n === i) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
Bt(pS, "isHidden");
function vS(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
Bt(vS, "isSelectableInput");
function vl(n, { select: i = !1 } = {}) {
  if (n && n.focus) {
    const o = document.activeElement;
    n.focus({ preventScroll: !0 }), n !== o && vS(n) && i && n.select();
  }
}
Bt(vl, "focus");
var E0 = yS();
function yS() {
  let n = [];
  return {
    add(i) {
      const o = n[0];
      i !== o && o?.pause(), n = Sg(n, i), n.unshift(i);
    },
    remove(i) {
      n = Sg(n, i), n[0]?.resume();
    }
  };
}
Bt(yS, "createFocusScopesStack");
function Sg(n, i) {
  const o = [...n], r = o.indexOf(i);
  return r !== -1 && o.splice(r, 1), o;
}
Bt(Sg, "arrayRemove");
function bS(n) {
  return n.filter((i) => i.tagName !== "A");
}
Bt(bS, "removeLinks");
var F_ = Object.defineProperty, X_ = (n, i) => F_(n, "name", { value: i, configurable: !0 }), SS = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ X_(function(i, o) {
    const { container: r, ...c } = i, [f, d] = v.useState(!1);
    Xt(() => d(!0), []);
    const g = r || f && globalThis?.document?.body;
    return g ? $g.createPortal(/* @__PURE__ */ b.jsx(Ye.div, { ...c, ref: o }), g) : null;
  }, "Portal")
), Q_ = Object.defineProperty, em = (n, i) => Q_(n, "name", { value: i, configurable: !0 }), Zu = 0, qi = null;
function Z_(n) {
  return tm(), n.children;
}
em(Z_, "FocusGuards");
function tm() {
  v.useEffect(() => {
    qi || (qi = { start: xg(), end: xg() });
    const { start: n, end: i } = qi;
    return document.body.firstElementChild !== n && document.body.insertAdjacentElement("afterbegin", n), document.body.lastElementChild !== i && document.body.insertAdjacentElement("beforeend", i), Zu++, () => {
      Zu === 1 && (qi?.start.remove(), qi?.end.remove(), qi = null), Zu = Math.max(0, Zu - 1);
    };
  }, []);
}
em(tm, "useFocusGuards");
function xg() {
  const n = document.createElement("span");
  return n.setAttribute("data-radix-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
em(xg, "createFocusGuard");
var Qn = function() {
  return Qn = Object.assign || function(i) {
    for (var o, r = 1, c = arguments.length; r < c; r++) {
      o = arguments[r];
      for (var f in o) Object.prototype.hasOwnProperty.call(o, f) && (i[f] = o[f]);
    }
    return i;
  }, Qn.apply(this, arguments);
};
function xS(n, i) {
  var o = {};
  for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && i.indexOf(r) < 0 && (o[r] = n[r]);
  if (n != null && typeof Object.getOwnPropertySymbols == "function")
    for (var c = 0, r = Object.getOwnPropertySymbols(n); c < r.length; c++)
      i.indexOf(r[c]) < 0 && Object.prototype.propertyIsEnumerable.call(n, r[c]) && (o[r[c]] = n[r[c]]);
  return o;
}
function K_(n, i, o) {
  if (o || arguments.length === 2) for (var r = 0, c = i.length, f; r < c; r++)
    (f || !(r in i)) && (f || (f = Array.prototype.slice.call(i, 0, r)), f[r] = i[r]);
  return n.concat(f || Array.prototype.slice.call(i));
}
var ss = "right-scroll-bar-position", cs = "width-before-scroll-bar", J_ = "with-scroll-bars-hidden", W_ = "--removed-body-scroll-bar-size";
function Ld(n, i) {
  return typeof n == "function" ? n(i) : n && (n.current = i), n;
}
function eT(n, i) {
  var o = v.useState(function() {
    return {
      // value
      value: n,
      // last callback
      callback: i,
      // "memoized" public interface
      facade: {
        get current() {
          return o.value;
        },
        set current(r) {
          var c = o.value;
          c !== r && (o.value = r, o.callback(r, c));
        }
      }
    };
  })[0];
  return o.callback = i, o.facade;
}
var tT = typeof window < "u" ? v.useLayoutEffect : v.useEffect, R0 = /* @__PURE__ */ new WeakMap();
function nT(n, i) {
  var o = eT(null, function(r) {
    return n.forEach(function(c) {
      return Ld(c, r);
    });
  });
  return tT(function() {
    var r = R0.get(o);
    if (r) {
      var c = new Set(r), f = new Set(n), d = o.current;
      c.forEach(function(g) {
        f.has(g) || Ld(g, null);
      }), f.forEach(function(g) {
        c.has(g) || Ld(g, d);
      });
    }
    R0.set(o, n);
  }, [n]), o;
}
function lT(n) {
  return n;
}
function aT(n, i) {
  i === void 0 && (i = lT);
  var o = [], r = !1, c = {
    read: function() {
      if (r)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return o.length ? o[o.length - 1] : n;
    },
    useMedium: function(f) {
      var d = i(f, r);
      return o.push(d), function() {
        o = o.filter(function(g) {
          return g !== d;
        });
      };
    },
    assignSyncMedium: function(f) {
      for (r = !0; o.length; ) {
        var d = o;
        o = [], d.forEach(f);
      }
      o = {
        push: function(g) {
          return f(g);
        },
        filter: function() {
          return o;
        }
      };
    },
    assignMedium: function(f) {
      r = !0;
      var d = [];
      if (o.length) {
        var g = o;
        o = [], g.forEach(f), d = o;
      }
      var h = function() {
        var x = d;
        d = [], x.forEach(f);
      }, y = function() {
        return Promise.resolve().then(h);
      };
      y(), o = {
        push: function(x) {
          d.push(x), y();
        },
        filter: function(x) {
          return d = d.filter(x), o;
        }
      };
    }
  };
  return c;
}
function iT(n) {
  n === void 0 && (n = {});
  var i = aT(null);
  return i.options = Qn({ async: !0, ssr: !1 }, n), i;
}
var CS = function(n) {
  var i = n.sideCar, o = xS(n, ["sideCar"]);
  if (!i)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var r = i.read();
  if (!r)
    throw new Error("Sidecar medium not found");
  return v.createElement(r, Qn({}, o));
};
CS.isSideCarExport = !0;
function oT(n, i) {
  return n.useMedium(i), CS;
}
var wS = iT(), Ud = function() {
}, As = v.forwardRef(function(n, i) {
  var o = v.useRef(null), r = v.useState({
    onScrollCapture: Ud,
    onWheelCapture: Ud,
    onTouchMoveCapture: Ud
  }), c = r[0], f = r[1], d = n.forwardProps, g = n.children, h = n.className, y = n.removeScrollBar, x = n.enabled, p = n.shards, S = n.sideCar, C = n.noRelative, R = n.noIsolation, _ = n.inert, T = n.allowPinchZoom, O = n.as, D = O === void 0 ? "div" : O, U = n.gapMode, P = xS(n, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), Q = S, B = nT([o, i]), H = Qn(Qn({}, P), c);
  return v.createElement(
    v.Fragment,
    null,
    x && v.createElement(Q, { sideCar: wS, removeScrollBar: y, shards: p, noRelative: C, noIsolation: R, inert: _, setCallbacks: f, allowPinchZoom: !!T, lockRef: o, gapMode: U }),
    d ? v.cloneElement(v.Children.only(g), Qn(Qn({}, H), { ref: B })) : v.createElement(D, Qn({}, H, { className: h, ref: B }), g)
  );
});
As.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
As.classNames = {
  fullWidth: cs,
  zeroRight: ss
};
var rT = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function uT() {
  if (!document)
    return null;
  var n = document.createElement("style");
  n.type = "text/css";
  var i = rT();
  return i && n.setAttribute("nonce", i), n;
}
function sT(n, i) {
  n.styleSheet ? n.styleSheet.cssText = i : n.appendChild(document.createTextNode(i));
}
function cT(n) {
  var i = document.head || document.getElementsByTagName("head")[0];
  i.appendChild(n);
}
var fT = function() {
  var n = 0, i = null;
  return {
    add: function(o) {
      n == 0 && (i = uT()) && (sT(i, o), cT(i)), n++;
    },
    remove: function() {
      n--, !n && i && (i.parentNode && i.parentNode.removeChild(i), i = null);
    }
  };
}, dT = function() {
  var n = fT();
  return function(i, o) {
    v.useEffect(function() {
      return n.add(i), function() {
        n.remove();
      };
    }, [i && o]);
  };
}, ES = function() {
  var n = dT(), i = function(o) {
    var r = o.styles, c = o.dynamic;
    return n(r, c), null;
  };
  return i;
}, gT = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, Vd = function(n) {
  return parseInt(n || "", 10) || 0;
}, mT = function(n) {
  var i = window.getComputedStyle(document.body), o = i[n === "padding" ? "paddingLeft" : "marginLeft"], r = i[n === "padding" ? "paddingTop" : "marginTop"], c = i[n === "padding" ? "paddingRight" : "marginRight"];
  return [Vd(o), Vd(r), Vd(c)];
}, hT = function(n) {
  if (n === void 0 && (n = "margin"), typeof window > "u")
    return gT;
  var i = mT(n), o = document.documentElement.clientWidth, r = window.innerWidth;
  return {
    left: i[0],
    top: i[1],
    right: i[2],
    gap: Math.max(0, r - o + i[2] - i[0])
  };
}, pT = ES(), Ji = "data-scroll-locked", vT = function(n, i, o, r) {
  var c = n.left, f = n.top, d = n.right, g = n.gap;
  return o === void 0 && (o = "margin"), `
  .`.concat(J_, ` {
   overflow: hidden `).concat(r, `;
   padding-right: `).concat(g, "px ").concat(r, `;
  }
  body[`).concat(Ji, `] {
    overflow: hidden `).concat(r, `;
    overscroll-behavior: contain;
    `).concat([
    i && "position: relative ".concat(r, ";"),
    o === "margin" && `
    padding-left: `.concat(c, `px;
    padding-top: `).concat(f, `px;
    padding-right: `).concat(d, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(g, "px ").concat(r, `;
    `),
    o === "padding" && "padding-right: ".concat(g, "px ").concat(r, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(ss, ` {
    right: `).concat(g, "px ").concat(r, `;
  }
  
  .`).concat(cs, ` {
    margin-right: `).concat(g, "px ").concat(r, `;
  }
  
  .`).concat(ss, " .").concat(ss, ` {
    right: 0 `).concat(r, `;
  }
  
  .`).concat(cs, " .").concat(cs, ` {
    margin-right: 0 `).concat(r, `;
  }
  
  body[`).concat(Ji, `] {
    `).concat(W_, ": ").concat(g, `px;
  }
`);
}, _0 = function() {
  var n = parseInt(document.body.getAttribute(Ji) || "0", 10);
  return isFinite(n) ? n : 0;
}, yT = function() {
  v.useEffect(function() {
    return document.body.setAttribute(Ji, (_0() + 1).toString()), function() {
      var n = _0() - 1;
      n <= 0 ? document.body.removeAttribute(Ji) : document.body.setAttribute(Ji, n.toString());
    };
  }, []);
}, bT = function(n) {
  var i = n.noRelative, o = n.noImportant, r = n.gapMode, c = r === void 0 ? "margin" : r;
  yT();
  var f = v.useMemo(function() {
    return hT(c);
  }, [c]);
  return v.createElement(pT, { styles: vT(f, !i, c, o ? "" : "!important") });
}, Cg = !1;
if (typeof window < "u")
  try {
    var Ku = Object.defineProperty({}, "passive", {
      get: function() {
        return Cg = !0, !0;
      }
    });
    window.addEventListener("test", Ku, Ku), window.removeEventListener("test", Ku, Ku);
  } catch {
    Cg = !1;
  }
var Pi = Cg ? { passive: !1 } : !1, ST = function(n) {
  return n.tagName === "TEXTAREA";
}, RS = function(n, i) {
  if (!(n instanceof Element))
    return !1;
  var o = window.getComputedStyle(n);
  return (
    // not-not-scrollable
    o[i] !== "hidden" && // contains scroll inside self
    !(o.overflowY === o.overflowX && !ST(n) && o[i] === "visible")
  );
}, xT = function(n) {
  return RS(n, "overflowY");
}, CT = function(n) {
  return RS(n, "overflowX");
}, T0 = function(n, i) {
  var o = i.ownerDocument, r = i;
  do {
    typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
    var c = _S(n, r);
    if (c) {
      var f = TS(n, r), d = f[1], g = f[2];
      if (d > g)
        return !0;
    }
    r = r.parentNode;
  } while (r && r !== o.body);
  return !1;
}, wT = function(n) {
  var i = n.scrollTop, o = n.scrollHeight, r = n.clientHeight;
  return [
    i,
    o,
    r
  ];
}, ET = function(n) {
  var i = n.scrollLeft, o = n.scrollWidth, r = n.clientWidth;
  return [
    i,
    o,
    r
  ];
}, _S = function(n, i) {
  return n === "v" ? xT(i) : CT(i);
}, TS = function(n, i) {
  return n === "v" ? wT(i) : ET(i);
}, RT = function(n, i) {
  return n === "h" && i === "rtl" ? -1 : 1;
}, _T = function(n, i, o, r, c) {
  var f = RT(n, window.getComputedStyle(i).direction), d = f * r, g = o.target, h = i.contains(g), y = !1, x = d > 0, p = 0, S = 0;
  do {
    if (!g)
      break;
    var C = TS(n, g), R = C[0], _ = C[1], T = C[2], O = _ - T - f * R;
    (R || O) && _S(n, g) && (p += O, S += R);
    var D = g.parentNode;
    g = D && D.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? D.host : D;
  } while (
    // portaled content
    !h && g !== document.body || // self content
    h && (i.contains(g) || i === g)
  );
  return (x && Math.abs(p) < 1 || !x && Math.abs(S) < 1) && (y = !0), y;
}, Ju = function(n) {
  return "changedTouches" in n ? [n.changedTouches[0].clientX, n.changedTouches[0].clientY] : [0, 0];
}, A0 = function(n) {
  return [n.deltaX, n.deltaY];
}, z0 = function(n) {
  return n && "current" in n ? n.current : n;
}, TT = function(n, i) {
  return n[0] === i[0] && n[1] === i[1];
}, AT = function(n) {
  return `
  .block-interactivity-`.concat(n, ` {pointer-events: none;}
  .allow-interactivity-`).concat(n, ` {pointer-events: all;}
`);
}, zT = 0, Ii = [];
function OT(n) {
  var i = v.useRef([]), o = v.useRef([0, 0]), r = v.useRef(), c = v.useState(zT++)[0], f = v.useState(ES)[0], d = v.useRef(n);
  v.useEffect(function() {
    d.current = n;
  }, [n]), v.useEffect(function() {
    if (n.inert) {
      document.body.classList.add("block-interactivity-".concat(c));
      var _ = K_([n.lockRef.current], (n.shards || []).map(z0), !0).filter(Boolean);
      return _.forEach(function(T) {
        return T.classList.add("allow-interactivity-".concat(c));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(c)), _.forEach(function(T) {
          return T.classList.remove("allow-interactivity-".concat(c));
        });
      };
    }
  }, [n.inert, n.lockRef.current, n.shards]);
  var g = v.useCallback(function(_, T) {
    if ("touches" in _ && _.touches.length === 2 || _.type === "wheel" && _.ctrlKey)
      return !d.current.allowPinchZoom;
    var O = Ju(_), D = o.current, U = "deltaX" in _ ? _.deltaX : D[0] - O[0], P = "deltaY" in _ ? _.deltaY : D[1] - O[1], Q, B = _.target, H = Math.abs(U) > Math.abs(P) ? "h" : "v";
    if ("touches" in _ && H === "h" && B.type === "range")
      return !1;
    var $ = window.getSelection(), ae = $ && $.anchorNode, K = ae ? ae === B || ae.contains(B) : !1;
    if (K)
      return !1;
    var se = T0(H, B);
    if (!se)
      return !0;
    if (se ? Q = H : (Q = H === "v" ? "h" : "v", se = T0(H, B)), !se)
      return !1;
    if (!r.current && "changedTouches" in _ && (U || P) && (r.current = Q), !Q)
      return !0;
    var oe = r.current || Q;
    return _T(oe, T, _, oe === "h" ? U : P);
  }, []), h = v.useCallback(function(_) {
    var T = _;
    if (!(!Ii.length || Ii[Ii.length - 1] !== f)) {
      var O = "deltaY" in T ? A0(T) : Ju(T), D = i.current.filter(function(Q) {
        return Q.name === T.type && (Q.target === T.target || T.target === Q.shadowParent) && TT(Q.delta, O);
      })[0];
      if (D && D.should) {
        T.cancelable && T.preventDefault();
        return;
      }
      if (!D) {
        var U = (d.current.shards || []).map(z0).filter(Boolean).filter(function(Q) {
          return Q.contains(T.target);
        }), P = U.length > 0 ? g(T, U[0]) : !d.current.noIsolation;
        P && T.cancelable && T.preventDefault();
      }
    }
  }, []), y = v.useCallback(function(_, T, O, D) {
    var U = { name: _, delta: T, target: O, should: D, shadowParent: MT(O) };
    i.current.push(U), setTimeout(function() {
      i.current = i.current.filter(function(P) {
        return P !== U;
      });
    }, 1);
  }, []), x = v.useCallback(function(_) {
    o.current = Ju(_), r.current = void 0;
  }, []), p = v.useCallback(function(_) {
    y(_.type, A0(_), _.target, g(_, n.lockRef.current));
  }, []), S = v.useCallback(function(_) {
    y(_.type, Ju(_), _.target, g(_, n.lockRef.current));
  }, []);
  v.useEffect(function() {
    return Ii.push(f), n.setCallbacks({
      onScrollCapture: p,
      onWheelCapture: p,
      onTouchMoveCapture: S
    }), document.addEventListener("wheel", h, Pi), document.addEventListener("touchmove", h, Pi), document.addEventListener("touchstart", x, Pi), function() {
      Ii = Ii.filter(function(_) {
        return _ !== f;
      }), document.removeEventListener("wheel", h, Pi), document.removeEventListener("touchmove", h, Pi), document.removeEventListener("touchstart", x, Pi);
    };
  }, []);
  var C = n.removeScrollBar, R = n.inert;
  return v.createElement(
    v.Fragment,
    null,
    R ? v.createElement(f, { styles: AT(c) }) : null,
    C ? v.createElement(bT, { noRelative: n.noRelative, gapMode: n.gapMode }) : null
  );
}
function MT(n) {
  for (var i = null; n !== null; )
    n instanceof ShadowRoot && (i = n.host, n = n.host), n = n.parentNode;
  return i;
}
const NT = oT(wS, OT);
var AS = v.forwardRef(function(n, i) {
  return v.createElement(As, Qn({}, n, { ref: i, sideCar: NT }));
});
AS.classNames = As.classNames;
var DT = function(n) {
  if (typeof document > "u")
    return null;
  var i = Array.isArray(n) ? n[0] : n;
  return i.ownerDocument.body;
}, $i = /* @__PURE__ */ new WeakMap(), Wu = /* @__PURE__ */ new WeakMap(), es = {}, Gd = 0, zS = function(n) {
  return n && (n.host || zS(n.parentNode));
}, jT = function(n, i) {
  return i.map(function(o) {
    if (n.contains(o))
      return o;
    var r = zS(o);
    return r && n.contains(r) ? r : (console.error("aria-hidden", o, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(o) {
    return !!o;
  });
}, HT = function(n, i, o, r) {
  var c = jT(i, Array.isArray(n) ? n : [n]);
  es[o] || (es[o] = /* @__PURE__ */ new WeakMap());
  var f = es[o], d = [], g = /* @__PURE__ */ new Set(), h = new Set(c), y = function(p) {
    !p || g.has(p) || (g.add(p), y(p.parentNode));
  };
  c.forEach(y);
  var x = function(p) {
    !p || h.has(p) || Array.prototype.forEach.call(p.children, function(S) {
      if (g.has(S))
        x(S);
      else
        try {
          var C = S.getAttribute(r), R = C !== null && C !== "false", _ = ($i.get(S) || 0) + 1, T = (f.get(S) || 0) + 1;
          $i.set(S, _), f.set(S, T), d.push(S), _ === 1 && R && Wu.set(S, !0), T === 1 && S.setAttribute(o, "true"), R || S.setAttribute(r, "true");
        } catch (O) {
          console.error("aria-hidden: cannot operate on ", S, O);
        }
    });
  };
  return x(i), g.clear(), Gd++, function() {
    d.forEach(function(p) {
      var S = $i.get(p) - 1, C = f.get(p) - 1;
      $i.set(p, S), f.set(p, C), S || (Wu.has(p) || p.removeAttribute(r), Wu.delete(p)), C || p.removeAttribute(o);
    }), Gd--, Gd || ($i = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new WeakMap(), Wu = /* @__PURE__ */ new WeakMap(), es = {});
  };
}, LT = function(n, i, o) {
  o === void 0 && (o = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), c = DT(n);
  return c ? (r.push.apply(r, Array.from(c.querySelectorAll("[aria-live], script"))), HT(r, c, o, "aria-hidden")) : function() {
    return null;
  };
}, UT = Object.defineProperty, Rn = (n, i) => UT(n, "name", { value: i, configurable: !0 }), nm = "Dialog", [OS, ZO] = /* @__PURE__ */ Rl(nm), [VT, el] = OS(nm), MS = /* @__PURE__ */ Rn((n) => {
  const {
    __scopeDialog: i,
    children: o,
    open: r,
    defaultOpen: c,
    onOpenChange: f,
    modal: d = !0
  } = n, g = v.useRef(null), h = v.useRef(null), [y, x] = ga({
    prop: r,
    defaultProp: c ?? !1,
    onChange: f,
    caller: nm
  }), [p, S] = v.useState(0), [C, R] = v.useState(0);
  return /* @__PURE__ */ b.jsx(
    VT,
    {
      scope: i,
      triggerRef: g,
      contentRef: h,
      contentId: fn(),
      titleId: fn(),
      descriptionId: fn(),
      titlePresent: p > 0,
      descriptionPresent: C > 0,
      setTitleCount: S,
      setDescriptionCount: R,
      open: y,
      onOpenChange: x,
      onOpenToggle: v.useCallback(() => x((_) => !_), [x]),
      modal: d,
      children: o
    }
  );
}, "Dialog"), NS = "DialogPortal", [GT, DS] = OS(NS, {
  forceMount: void 0
}), jS = /* @__PURE__ */ Rn((n) => {
  const { __scopeDialog: i, forceMount: o, children: r, container: c } = n, f = el(NS, i);
  return /* @__PURE__ */ b.jsx(GT, { scope: i, forceMount: o, children: v.Children.map(r, (d) => /* @__PURE__ */ b.jsx(no, { present: o || f.open, children: /* @__PURE__ */ b.jsx(SS, { asChild: !0, container: c, children: d }) })) });
}, "DialogPortal"), wg = "DialogOverlay", lm = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ Rn(function(i, o) {
    const r = DS(wg, i.__scopeDialog), { forceMount: c = r.forceMount, ...f } = i, d = el(wg, i.__scopeDialog);
    return d.modal ? /* @__PURE__ */ b.jsx(no, { present: c || d.open, children: /* @__PURE__ */ b.jsx(BT, { ...f, ref: o }) }) : null;
  }, "DialogOverlay")
), kT = /* @__PURE__ */ ia("DialogOverlay.RemoveScroll"), BT = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Rn(function(i, o) {
    const { __scopeDialog: r, ...c } = i, f = el(wg, r), d = fS(), g = Ht(o, d);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ b.jsx(AS, { as: kT, allowPinchZoom: !0, shards: [f.contentRef], children: /* @__PURE__ */ b.jsx(
        Ye.div,
        {
          "data-state": im(f.open),
          ...c,
          ref: g,
          style: { pointerEvents: "auto", ...c.style }
        }
      ) })
    );
  }, "DialogOverlayImpl")
), cr = "DialogContent", am = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ Rn(function(i, o) {
    const r = DS(cr, i.__scopeDialog), { forceMount: c = r.forceMount, ...f } = i, d = el(cr, i.__scopeDialog);
    return /* @__PURE__ */ b.jsx(no, { present: c || d.open, children: d.modal ? /* @__PURE__ */ b.jsx(qT, { ...f, ref: o }) : /* @__PURE__ */ b.jsx(PT, { ...f, ref: o }) });
  }, "DialogContent")
), qT = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Rn(function(i, o) {
    const r = el(cr, i.__scopeDialog), c = v.useRef(null), f = Ht(o, r.contentRef, c);
    return v.useEffect(() => {
      const d = c.current;
      if (d) return LT(d);
    }, []), /* @__PURE__ */ b.jsx(
      HS,
      {
        ...i,
        ref: f,
        trapFocus: r.open,
        disableOutsidePointerEvents: r.open,
        onCloseAutoFocus: et(i.onCloseAutoFocus, (d) => {
          d.preventDefault(), r.triggerRef.current?.focus();
        }),
        onPointerDownOutside: et(i.onPointerDownOutside, (d) => {
          const g = d.detail.originalEvent, h = g.button === 0 && g.ctrlKey === !0;
          (g.button === 2 || h) && d.preventDefault();
        }),
        onFocusOutside: et(
          i.onFocusOutside,
          (d) => d.preventDefault()
        )
      }
    );
  }, "DialogContentModal")
), PT = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Rn(function(i, o) {
    const r = el(cr, i.__scopeDialog), c = v.useRef(!1), f = v.useRef(!1);
    return /* @__PURE__ */ b.jsx(
      HS,
      {
        ...i,
        ref: o,
        trapFocus: !1,
        disableOutsidePointerEvents: !1,
        onCloseAutoFocus: (d) => {
          i.onCloseAutoFocus?.(d), d.defaultPrevented || (c.current || r.triggerRef.current?.focus(), d.preventDefault()), c.current = !1, f.current = !1;
        },
        onInteractOutside: (d) => {
          i.onInteractOutside?.(d), d.defaultPrevented || (c.current = !0, d.detail.originalEvent.type === "pointerdown" && (f.current = !0));
          const g = d.target;
          r.triggerRef.current?.contains(g) && d.preventDefault(), d.detail.originalEvent.type === "focusin" && f.current && d.preventDefault();
        }
      }
    );
  }, "DialogContentNonModal")
), HS = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Rn(function(i, o) {
    const { __scopeDialog: r, trapFocus: c, onOpenAutoFocus: f, onCloseAutoFocus: d, ...g } = i, h = el(cr, r);
    return tm(), /* @__PURE__ */ b.jsx(b.Fragment, { children: /* @__PURE__ */ b.jsx(
      Y_,
      {
        asChild: !0,
        loop: !0,
        trapped: c,
        onMountAutoFocus: f,
        onUnmountAutoFocus: d,
        children: /* @__PURE__ */ b.jsx(
          cS,
          {
            role: "dialog",
            id: h.contentId,
            "aria-describedby": h.descriptionPresent ? h.descriptionId : void 0,
            "aria-labelledby": h.titlePresent ? h.titleId : void 0,
            "data-state": im(h.open),
            ...g,
            ref: o,
            deferPointerDownOutside: !0,
            onDismiss: () => h.onOpenChange(!1)
          }
        )
      }
    ) });
  }, "DialogContentImpl")
), IT = "DialogTitle", LS = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ Rn(function(i, o) {
    const { __scopeDialog: r, ...c } = i, f = el(IT, r), { setTitleCount: d } = f;
    return Xt(() => (d((g) => g + 1), () => d((g) => g - 1)), [d]), /* @__PURE__ */ b.jsx(Ye.h2, { id: f.titleId, ...c, ref: o });
  }, "DialogTitle")
), $T = "DialogDescription", US = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ Rn(function(i, o) {
    const { __scopeDialog: r, ...c } = i, f = el($T, r), { setDescriptionCount: d } = f;
    return Xt(() => (d((g) => g + 1), () => d((g) => g - 1)), [d]), /* @__PURE__ */ b.jsx(Ye.p, { id: f.descriptionId, ...c, ref: o });
  }, "DialogDescription")
), YT = "DialogClose", FT = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ Rn(function(i, o) {
    const { __scopeDialog: r, ...c } = i, f = el(YT, r);
    return /* @__PURE__ */ b.jsx(
      Ye.button,
      {
        type: "button",
        ...c,
        ref: o,
        onClick: et(i.onClick, () => f.onOpenChange(!1))
      }
    );
  }, "DialogClose")
);
function im(n) {
  return n ? "open" : "closed";
}
Rn(im, "getState");
const kd = MS, XT = jS, VS = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  lm,
  {
    ref: o,
    className: Fe(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      n
    ),
    ...i
  }
));
VS.displayName = lm.displayName;
const fs = v.forwardRef(({ className: n, children: i, ...o }, r) => /* @__PURE__ */ b.jsxs(XT, { children: [
  /* @__PURE__ */ b.jsx(VS, {}),
  /* @__PURE__ */ b.jsxs(
    am,
    {
      ref: r,
      className: Fe(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        n
      ),
      ...o,
      children: [
        i,
        /* @__PURE__ */ b.jsxs(FT, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ b.jsx(ub, { className: "h-4 w-4" }),
          /* @__PURE__ */ b.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
fs.displayName = am.displayName;
const ds = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  LS,
  {
    ref: o,
    className: Fe(
      "text-lg font-semibold leading-none tracking-tight",
      n
    ),
    ...i
  }
));
ds.displayName = LS.displayName;
const gs = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  US,
  {
    ref: o,
    className: Fe("text-sm text-muted-foreground", n),
    ...i
  }
));
gs.displayName = US.displayName;
var O0 = 1, QT = 0.9, ZT = 0.8, KT = 0.17, Bd = 0.1, qd = 0.999, JT = 0.9999, WT = 0.99, e2 = /[\\\/_+.#"@\[\(\{&]/, t2 = /[\\\/_+.#"@\[\(\{&]/g, n2 = /[\s-]/, GS = /[\s-]/g;
function Eg(n, i, o, r, c, f, d) {
  if (f === i.length) return c === n.length ? O0 : WT;
  var g = `${c},${f}`;
  if (d[g] !== void 0) return d[g];
  for (var h = r.charAt(f), y = o.indexOf(h, c), x = 0, p, S, C, R; y >= 0; ) p = Eg(n, i, o, r, y + 1, f + 1, d), p > x && (y === c ? p *= O0 : e2.test(n.charAt(y - 1)) ? (p *= ZT, C = n.slice(c, y - 1).match(t2), C && c > 0 && (p *= Math.pow(qd, C.length))) : n2.test(n.charAt(y - 1)) ? (p *= QT, R = n.slice(c, y - 1).match(GS), R && c > 0 && (p *= Math.pow(qd, R.length))) : (p *= KT, c > 0 && (p *= Math.pow(qd, y - c))), n.charAt(y) !== i.charAt(f) && (p *= JT)), (p < Bd && o.charAt(y - 1) === r.charAt(f + 1) || r.charAt(f + 1) === r.charAt(f) && o.charAt(y - 1) !== r.charAt(f)) && (S = Eg(n, i, o, r, y + 1, f + 2, d), S * Bd > p && (p = S * Bd)), p > x && (x = p), y = o.indexOf(h, y + 1);
  return d[g] = x, x;
}
function M0(n) {
  return n.toLowerCase().replace(GS, " ");
}
function l2(n, i, o) {
  return n = o && o.length > 0 ? `${n + " " + o.join(" ")}` : n, Eg(n, i, M0(n), M0(i), 0, 0, {});
}
var ar = '[cmdk-group=""]', Pd = '[cmdk-group-items=""]', a2 = '[cmdk-group-heading=""]', kS = '[cmdk-item=""]', N0 = `${kS}:not([aria-disabled="true"])`, Rg = "cmdk-item-select", Xi = "data-value", i2 = (n, i, o) => l2(n, i, o), BS = v.createContext(void 0), vr = () => v.useContext(BS), qS = v.createContext(void 0), om = () => v.useContext(qS), PS = v.createContext(void 0), IS = v.forwardRef((n, i) => {
  let o = Qi(() => {
    var W, M;
    return { search: "", value: (M = (W = n.value) != null ? W : n.defaultValue) != null ? M : "", selectedItemId: void 0, filtered: { count: 0, items: /* @__PURE__ */ new Map(), groups: /* @__PURE__ */ new Set() } };
  }), r = Qi(() => /* @__PURE__ */ new Set()), c = Qi(() => /* @__PURE__ */ new Map()), f = Qi(() => /* @__PURE__ */ new Map()), d = Qi(() => /* @__PURE__ */ new Set()), g = $S(n), { label: h, children: y, value: x, onValueChange: p, filter: S, shouldFilter: C, loop: R, disablePointerSelection: _ = !1, vimBindings: T = !0, ...O } = n, D = fn(), U = fn(), P = fn(), Q = v.useRef(null), B = p2();
  $a(() => {
    if (x !== void 0) {
      let W = x.trim();
      o.current.value = W, H.emit();
    }
  }, [x]), $a(() => {
    B(6, he);
  }, []);
  let H = v.useMemo(() => ({ subscribe: (W) => (d.current.add(W), () => d.current.delete(W)), snapshot: () => o.current, setState: (W, M, E) => {
    var A, j, V, te;
    if (!Object.is(o.current[W], M)) {
      if (o.current[W] = M, W === "search") oe(), K(), B(1, se);
      else if (W === "value") {
        if (document.activeElement.hasAttribute("cmdk-input") || document.activeElement.hasAttribute("cmdk-root")) {
          let F = document.getElementById(P);
          F ? F.focus() : (A = document.getElementById(D)) == null || A.focus();
        }
        if (B(7, () => {
          var F;
          o.current.selectedItemId = (F = ge()) == null ? void 0 : F.id, H.emit();
        }), E || B(5, he), ((j = g.current) == null ? void 0 : j.value) !== void 0) {
          let F = M ?? "";
          (te = (V = g.current).onValueChange) == null || te.call(V, F);
          return;
        }
      }
      H.emit();
    }
  }, emit: () => {
    d.current.forEach((W) => W());
  } }), []), $ = v.useMemo(() => ({ value: (W, M, E) => {
    var A;
    M !== ((A = f.current.get(W)) == null ? void 0 : A.value) && (f.current.set(W, { value: M, keywords: E }), o.current.filtered.items.set(W, ae(M, E)), B(2, () => {
      K(), H.emit();
    }));
  }, item: (W, M) => (r.current.add(W), M && (c.current.has(M) ? c.current.get(M).add(W) : c.current.set(M, /* @__PURE__ */ new Set([W]))), B(3, () => {
    oe(), K(), o.current.value || se(), H.emit();
  }), () => {
    f.current.delete(W), r.current.delete(W), o.current.filtered.items.delete(W);
    let E = ge();
    B(4, () => {
      oe(), E?.getAttribute("id") === W && se(), H.emit();
    });
  }), group: (W) => (c.current.has(W) || c.current.set(W, /* @__PURE__ */ new Set()), () => {
    f.current.delete(W), c.current.delete(W);
  }), filter: () => g.current.shouldFilter, label: h || n["aria-label"], getDisablePointerSelection: () => g.current.disablePointerSelection, listId: D, inputId: P, labelId: U, listInnerRef: Q }), []);
  function ae(W, M) {
    var E, A;
    let j = (A = (E = g.current) == null ? void 0 : E.filter) != null ? A : i2;
    return W ? j(W, o.current.search, M) : 0;
  }
  function K() {
    if (!o.current.search || g.current.shouldFilter === !1) return;
    let W = o.current.filtered.items, M = [];
    o.current.filtered.groups.forEach((A) => {
      let j = c.current.get(A), V = 0;
      j.forEach((te) => {
        let F = W.get(te);
        V = Math.max(F, V);
      }), M.push([A, V]);
    });
    let E = Q.current;
    de().sort((A, j) => {
      var V, te;
      let F = A.getAttribute("id"), ue = j.getAttribute("id");
      return ((V = W.get(ue)) != null ? V : 0) - ((te = W.get(F)) != null ? te : 0);
    }).forEach((A) => {
      let j = A.closest(Pd);
      j ? j.appendChild(A.parentElement === j ? A : A.closest(`${Pd} > *`)) : E.appendChild(A.parentElement === E ? A : A.closest(`${Pd} > *`));
    }), M.sort((A, j) => j[1] - A[1]).forEach((A) => {
      var j;
      let V = (j = Q.current) == null ? void 0 : j.querySelector(`${ar}[${Xi}="${encodeURIComponent(A[0])}"]`);
      V?.parentElement.appendChild(V);
    });
  }
  function se() {
    let W = de().find((E) => E.getAttribute("aria-disabled") !== "true"), M = W?.getAttribute(Xi);
    H.setState("value", M || void 0);
  }
  function oe() {
    var W, M, E, A;
    if (!o.current.search || g.current.shouldFilter === !1) {
      o.current.filtered.count = r.current.size;
      return;
    }
    o.current.filtered.groups = /* @__PURE__ */ new Set();
    let j = 0;
    for (let V of r.current) {
      let te = (M = (W = f.current.get(V)) == null ? void 0 : W.value) != null ? M : "", F = (A = (E = f.current.get(V)) == null ? void 0 : E.keywords) != null ? A : [], ue = ae(te, F);
      o.current.filtered.items.set(V, ue), ue > 0 && j++;
    }
    for (let [V, te] of c.current) for (let F of te) if (o.current.filtered.items.get(F) > 0) {
      o.current.filtered.groups.add(V);
      break;
    }
    o.current.filtered.count = j;
  }
  function he() {
    var W, M, E;
    let A = ge();
    A && (((W = A.parentElement) == null ? void 0 : W.firstChild) === A && ((E = (M = A.closest(ar)) == null ? void 0 : M.querySelector(a2)) == null || E.scrollIntoView({ block: "nearest" })), A.scrollIntoView({ block: "nearest" }));
  }
  function ge() {
    var W;
    return (W = Q.current) == null ? void 0 : W.querySelector(`${kS}[aria-selected="true"]`);
  }
  function de() {
    var W;
    return Array.from(((W = Q.current) == null ? void 0 : W.querySelectorAll(N0)) || []);
  }
  function Z(W) {
    let M = de()[W];
    M && H.setState("value", M.getAttribute(Xi));
  }
  function le(W) {
    var M;
    let E = ge(), A = de(), j = A.findIndex((te) => te === E), V = A[j + W];
    (M = g.current) != null && M.loop && (V = j + W < 0 ? A[A.length - 1] : j + W === A.length ? A[0] : A[j + W]), V && H.setState("value", V.getAttribute(Xi));
  }
  function ie(W) {
    let M = ge(), E = M?.closest(ar), A;
    for (; E && !A; ) E = W > 0 ? m2(E, ar) : h2(E, ar), A = E?.querySelector(N0);
    A ? H.setState("value", A.getAttribute(Xi)) : le(W);
  }
  let me = () => Z(de().length - 1), ne = (W) => {
    W.preventDefault(), W.metaKey ? me() : W.altKey ? ie(1) : le(1);
  }, ze = (W) => {
    W.preventDefault(), W.metaKey ? Z(0) : W.altKey ? ie(-1) : le(-1);
  };
  return v.createElement(Ye.div, { ref: i, tabIndex: -1, ...O, "cmdk-root": "", onKeyDown: (W) => {
    var M;
    (M = O.onKeyDown) == null || M.call(O, W);
    let E = W.nativeEvent.isComposing || W.keyCode === 229;
    if (!(W.defaultPrevented || E)) switch (W.key) {
      case "n":
      case "j": {
        T && W.ctrlKey && ne(W);
        break;
      }
      case "ArrowDown": {
        ne(W);
        break;
      }
      case "p":
      case "k": {
        T && W.ctrlKey && ze(W);
        break;
      }
      case "ArrowUp": {
        ze(W);
        break;
      }
      case "Home": {
        W.preventDefault(), Z(0);
        break;
      }
      case "End": {
        W.preventDefault(), me();
        break;
      }
      case "Enter": {
        W.preventDefault();
        let A = ge();
        if (A) {
          let j = new Event(Rg);
          A.dispatchEvent(j);
        }
      }
    }
  } }, v.createElement("label", { "cmdk-label": "", htmlFor: $.inputId, id: $.labelId, style: y2 }, h), zs(n, (W) => v.createElement(qS.Provider, { value: H }, v.createElement(BS.Provider, { value: $ }, W))));
}), o2 = v.forwardRef((n, i) => {
  var o, r;
  let c = fn(), f = v.useRef(null), d = v.useContext(PS), g = vr(), h = $S(n), y = (r = (o = h.current) == null ? void 0 : o.forceMount) != null ? r : d?.forceMount;
  $a(() => {
    if (!y) return g.item(c, d?.id);
  }, [y]);
  let x = YS(c, f, [n.value, n.children, f], n.keywords), p = om(), S = ra((B) => B.value && B.value === x.current), C = ra((B) => y || g.filter() === !1 ? !0 : B.search ? B.filtered.items.get(c) > 0 : !0);
  v.useEffect(() => {
    let B = f.current;
    if (!(!B || n.disabled)) return B.addEventListener(Rg, R), () => B.removeEventListener(Rg, R);
  }, [C, n.onSelect, n.disabled]);
  function R() {
    var B, H;
    _(), (H = (B = h.current).onSelect) == null || H.call(B, x.current);
  }
  function _() {
    p.setState("value", x.current, !0);
  }
  if (!C) return null;
  let { disabled: T, value: O, onSelect: D, forceMount: U, keywords: P, ...Q } = n;
  return v.createElement(Ye.div, { ref: Ia(f, i), ...Q, id: c, "cmdk-item": "", role: "option", "aria-disabled": !!T, "aria-selected": !!S, "data-disabled": !!T, "data-selected": !!S, onPointerMove: T || g.getDisablePointerSelection() ? void 0 : _, onClick: T ? void 0 : R }, n.children);
}), r2 = v.forwardRef((n, i) => {
  let { heading: o, children: r, forceMount: c, ...f } = n, d = fn(), g = v.useRef(null), h = v.useRef(null), y = fn(), x = vr(), p = ra((C) => c || x.filter() === !1 ? !0 : C.search ? C.filtered.groups.has(d) : !0);
  $a(() => x.group(d), []), YS(d, g, [n.value, n.heading, h]);
  let S = v.useMemo(() => ({ id: d, forceMount: c }), [c]);
  return v.createElement(Ye.div, { ref: Ia(g, i), ...f, "cmdk-group": "", role: "presentation", hidden: p ? void 0 : !0 }, o && v.createElement("div", { ref: h, "cmdk-group-heading": "", "aria-hidden": !0, id: y }, o), zs(n, (C) => v.createElement("div", { "cmdk-group-items": "", role: "group", "aria-labelledby": o ? y : void 0 }, v.createElement(PS.Provider, { value: S }, C))));
}), u2 = v.forwardRef((n, i) => {
  let { alwaysRender: o, ...r } = n, c = v.useRef(null), f = ra((d) => !d.search);
  return !o && !f ? null : v.createElement(Ye.div, { ref: Ia(c, i), ...r, "cmdk-separator": "", role: "separator" });
}), s2 = v.forwardRef((n, i) => {
  let { onValueChange: o, ...r } = n, c = n.value != null, f = om(), d = ra((y) => y.search), g = ra((y) => y.selectedItemId), h = vr();
  return v.useEffect(() => {
    n.value != null && f.setState("search", n.value);
  }, [n.value]), v.createElement(Ye.input, { ref: i, ...r, "cmdk-input": "", autoComplete: "off", autoCorrect: "off", spellCheck: !1, "aria-autocomplete": "list", role: "combobox", "aria-expanded": !0, "aria-controls": h.listId, "aria-labelledby": h.labelId, "aria-activedescendant": g, id: h.inputId, type: "text", value: c ? n.value : d, onChange: (y) => {
    c || f.setState("search", y.target.value), o?.(y.target.value);
  } });
}), c2 = v.forwardRef((n, i) => {
  let { children: o, label: r = "Suggestions", ...c } = n, f = v.useRef(null), d = v.useRef(null), g = ra((y) => y.selectedItemId), h = vr();
  return v.useEffect(() => {
    if (d.current && f.current) {
      let y = d.current, x = f.current, p, S = new ResizeObserver(() => {
        p = requestAnimationFrame(() => {
          let C = y.offsetHeight;
          x.style.setProperty("--cmdk-list-height", C.toFixed(1) + "px");
        });
      });
      return S.observe(y), () => {
        cancelAnimationFrame(p), S.unobserve(y);
      };
    }
  }, []), v.createElement(Ye.div, { ref: Ia(f, i), ...c, "cmdk-list": "", role: "listbox", tabIndex: -1, "aria-activedescendant": g, "aria-label": r, id: h.listId }, zs(n, (y) => v.createElement("div", { ref: Ia(d, h.listInnerRef), "cmdk-list-sizer": "" }, y)));
}), f2 = v.forwardRef((n, i) => {
  let { open: o, onOpenChange: r, overlayClassName: c, contentClassName: f, container: d, ...g } = n;
  return v.createElement(MS, { open: o, onOpenChange: r }, v.createElement(jS, { container: d }, v.createElement(lm, { "cmdk-overlay": "", className: c }), v.createElement(am, { "aria-label": n.label, "cmdk-dialog": "", className: f }, v.createElement(IS, { ref: i, ...g }))));
}), d2 = v.forwardRef((n, i) => ra((o) => o.filtered.count === 0) ? v.createElement(Ye.div, { ref: i, ...n, "cmdk-empty": "", role: "presentation" }) : null), g2 = v.forwardRef((n, i) => {
  let { progress: o, children: r, label: c = "Loading...", ...f } = n;
  return v.createElement(Ye.div, { ref: i, ...f, "cmdk-loading": "", role: "progressbar", "aria-valuenow": o, "aria-valuemin": 0, "aria-valuemax": 100, "aria-label": c }, zs(n, (d) => v.createElement("div", { "aria-hidden": !0 }, d)));
}), Zt = Object.assign(IS, { List: c2, Item: o2, Input: s2, Group: r2, Separator: u2, Dialog: f2, Empty: d2, Loading: g2 });
function m2(n, i) {
  let o = n.nextElementSibling;
  for (; o; ) {
    if (o.matches(i)) return o;
    o = o.nextElementSibling;
  }
}
function h2(n, i) {
  let o = n.previousElementSibling;
  for (; o; ) {
    if (o.matches(i)) return o;
    o = o.previousElementSibling;
  }
}
function $S(n) {
  let i = v.useRef(n);
  return $a(() => {
    i.current = n;
  }), i;
}
var $a = typeof window > "u" ? v.useEffect : v.useLayoutEffect;
function Qi(n) {
  let i = v.useRef();
  return i.current === void 0 && (i.current = n()), i;
}
function ra(n) {
  let i = om(), o = () => n(i.snapshot());
  return v.useSyncExternalStore(i.subscribe, o, o);
}
function YS(n, i, o, r = []) {
  let c = v.useRef(), f = vr();
  return $a(() => {
    var d;
    let g = (() => {
      var y;
      for (let x of o) {
        if (typeof x == "string") return x.trim();
        if (typeof x == "object" && "current" in x) return x.current ? (y = x.current.textContent) == null ? void 0 : y.trim() : c.current;
      }
    })(), h = r.map((y) => y.trim());
    f.value(n, g, h), (d = i.current) == null || d.setAttribute(Xi, g), c.current = g;
  }), c;
}
var p2 = () => {
  let [n, i] = v.useState(), o = Qi(() => /* @__PURE__ */ new Map());
  return $a(() => {
    o.current.forEach((r) => r()), o.current = /* @__PURE__ */ new Map();
  }, [n]), (r, c) => {
    o.current.set(r, c), i({});
  };
};
function v2(n) {
  let i = n.type;
  return typeof i == "function" ? i(n.props) : "render" in i ? i.render(n.props) : n;
}
function zs({ asChild: n, children: i }, o) {
  return n && v.isValidElement(i) ? v.cloneElement(v2(i), { ref: i.ref }, o(i.props.children)) : o(i);
}
var y2 = { position: "absolute", width: "1px", height: "1px", padding: "0", margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0" };
const FS = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  Zt,
  {
    ref: o,
    className: Fe(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      n
    ),
    ...i
  }
));
FS.displayName = Zt.displayName;
const XS = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ b.jsx(ug, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ b.jsx(
    Zt.Input,
    {
      ref: o,
      className: Fe(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        n
      ),
      ...i
    }
  )
] }));
XS.displayName = Zt.Input.displayName;
const QS = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  Zt.List,
  {
    ref: o,
    className: Fe("max-h-[300px] overflow-y-auto overflow-x-hidden", n),
    ...i
  }
));
QS.displayName = Zt.List.displayName;
const ZS = v.forwardRef((n, i) => /* @__PURE__ */ b.jsx(
  Zt.Empty,
  {
    ref: i,
    className: "py-6 text-center text-sm",
    ...n
  }
));
ZS.displayName = Zt.Empty.displayName;
const KS = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  Zt.Group,
  {
    ref: o,
    className: Fe(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      n
    ),
    ...i
  }
));
KS.displayName = Zt.Group.displayName;
const b2 = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  Zt.Separator,
  {
    ref: o,
    className: Fe("-mx-1 h-px bg-border", n),
    ...i
  }
));
b2.displayName = Zt.Separator.displayName;
const JS = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  Zt.Item,
  {
    ref: o,
    className: Fe(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      n
    ),
    ...i
  }
));
JS.displayName = Zt.Item.displayName;
const Os = v.createContext(null);
Os.displayName = "PanelGroupContext";
const it = {
  group: "data-panel-group",
  groupDirection: "data-panel-group-direction",
  groupId: "data-panel-group-id",
  panel: "data-panel",
  panelCollapsible: "data-panel-collapsible",
  panelId: "data-panel-id",
  panelSize: "data-panel-size",
  resizeHandle: "data-resize-handle",
  resizeHandleActive: "data-resize-handle-active",
  resizeHandleEnabled: "data-panel-resize-handle-enabled",
  resizeHandleId: "data-panel-resize-handle-id",
  resizeHandleState: "data-resize-handle-state"
}, rm = 10, Pa = v.useLayoutEffect, D0 = Qa.useId, S2 = typeof D0 == "function" ? D0 : () => null;
let x2 = 0;
function um(n = null) {
  const i = S2(), o = v.useRef(n || i || null);
  return o.current === null && (o.current = "" + x2++), n ?? o.current;
}
function WS({
  children: n,
  className: i = "",
  collapsedSize: o,
  collapsible: r,
  defaultSize: c,
  forwardedRef: f,
  id: d,
  maxSize: g,
  minSize: h,
  onCollapse: y,
  onExpand: x,
  onResize: p,
  order: S,
  style: C,
  tagName: R = "div",
  ..._
}) {
  const T = v.useContext(Os);
  if (T === null)
    throw Error("Panel components must be rendered within a PanelGroup container");
  const {
    collapsePanel: O,
    expandPanel: D,
    getPanelSize: U,
    getPanelStyle: P,
    groupId: Q,
    isPanelCollapsed: B,
    reevaluatePanelConstraints: H,
    registerPanel: $,
    resizePanel: ae,
    unregisterPanel: K
  } = T, se = um(d), oe = v.useRef({
    callbacks: {
      onCollapse: y,
      onExpand: x,
      onResize: p
    },
    constraints: {
      collapsedSize: o,
      collapsible: r,
      defaultSize: c,
      maxSize: g,
      minSize: h
    },
    id: se,
    idIsFromProps: d !== void 0,
    order: S
  });
  v.useRef({
    didLogMissingDefaultSizeWarning: !1
  }), Pa(() => {
    const {
      callbacks: ge,
      constraints: de
    } = oe.current, Z = {
      ...de
    };
    oe.current.id = se, oe.current.idIsFromProps = d !== void 0, oe.current.order = S, ge.onCollapse = y, ge.onExpand = x, ge.onResize = p, de.collapsedSize = o, de.collapsible = r, de.defaultSize = c, de.maxSize = g, de.minSize = h, (Z.collapsedSize !== de.collapsedSize || Z.collapsible !== de.collapsible || Z.maxSize !== de.maxSize || Z.minSize !== de.minSize) && H(oe.current, Z);
  }), Pa(() => {
    const ge = oe.current;
    return $(ge), () => {
      K(ge);
    };
  }, [S, se, $, K]), v.useImperativeHandle(f, () => ({
    collapse: () => {
      O(oe.current);
    },
    expand: (ge) => {
      D(oe.current, ge);
    },
    getId() {
      return se;
    },
    getSize() {
      return U(oe.current);
    },
    isCollapsed() {
      return B(oe.current);
    },
    isExpanded() {
      return !B(oe.current);
    },
    resize: (ge) => {
      ae(oe.current, ge);
    }
  }), [O, D, U, B, se, ae]);
  const he = P(oe.current, c);
  return v.createElement(R, {
    ..._,
    children: n,
    className: i,
    id: se,
    style: {
      ...he,
      ...C
    },
    // CSS selectors
    [it.groupId]: Q,
    [it.panel]: "",
    [it.panelCollapsible]: r || void 0,
    [it.panelId]: se,
    [it.panelSize]: parseFloat("" + he.flexGrow).toFixed(1)
  });
}
const ex = v.forwardRef((n, i) => v.createElement(WS, {
  ...n,
  forwardedRef: i
}));
WS.displayName = "Panel";
ex.displayName = "forwardRef(Panel)";
let _g = null, ms = -1, na = null;
function C2(n, i) {
  if (i) {
    const o = (i & ix) !== 0, r = (i & ox) !== 0, c = (i & rx) !== 0, f = (i & ux) !== 0;
    if (o)
      return c ? "se-resize" : f ? "ne-resize" : "e-resize";
    if (r)
      return c ? "sw-resize" : f ? "nw-resize" : "w-resize";
    if (c)
      return "s-resize";
    if (f)
      return "n-resize";
  }
  switch (n) {
    case "horizontal":
      return "ew-resize";
    case "intersection":
      return "move";
    case "vertical":
      return "ns-resize";
  }
}
function w2() {
  na !== null && (document.head.removeChild(na), _g = null, na = null, ms = -1);
}
function Id(n, i) {
  var o, r;
  const c = C2(n, i);
  if (_g !== c) {
    if (_g = c, na === null && (na = document.createElement("style"), document.head.appendChild(na)), ms >= 0) {
      var f;
      (f = na.sheet) === null || f === void 0 || f.removeRule(ms);
    }
    ms = (o = (r = na.sheet) === null || r === void 0 ? void 0 : r.insertRule(`*{cursor: ${c} !important;}`)) !== null && o !== void 0 ? o : -1;
  }
}
function tx(n) {
  return n.type === "keydown";
}
function nx(n) {
  return n.type.startsWith("pointer");
}
function lx(n) {
  return n.type.startsWith("mouse");
}
function Ms(n) {
  if (nx(n)) {
    if (n.isPrimary)
      return {
        x: n.clientX,
        y: n.clientY
      };
  } else if (lx(n))
    return {
      x: n.clientX,
      y: n.clientY
    };
  return {
    x: 1 / 0,
    y: 1 / 0
  };
}
function E2() {
  if (typeof matchMedia == "function")
    return matchMedia("(pointer:coarse)").matches ? "coarse" : "fine";
}
function R2(n, i, o) {
  return n.x < i.x + i.width && n.x + n.width > i.x && n.y < i.y + i.height && n.y + n.height > i.y;
}
function _2(n, i) {
  if (n === i) throw new Error("Cannot compare node with itself");
  const o = {
    a: L0(n),
    b: L0(i)
  };
  let r;
  for (; o.a.at(-1) === o.b.at(-1); )
    n = o.a.pop(), i = o.b.pop(), r = n;
  Oe(r, "Stacking order can only be calculated for elements with a common ancestor");
  const c = {
    a: H0(j0(o.a)),
    b: H0(j0(o.b))
  };
  if (c.a === c.b) {
    const f = r.childNodes, d = {
      a: o.a.at(-1),
      b: o.b.at(-1)
    };
    let g = f.length;
    for (; g--; ) {
      const h = f[g];
      if (h === d.a) return 1;
      if (h === d.b) return -1;
    }
  }
  return Math.sign(c.a - c.b);
}
const T2 = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function A2(n) {
  var i;
  const o = getComputedStyle((i = ax(n)) !== null && i !== void 0 ? i : n).display;
  return o === "flex" || o === "inline-flex";
}
function z2(n) {
  const i = getComputedStyle(n);
  return !!(i.position === "fixed" || i.zIndex !== "auto" && (i.position !== "static" || A2(n)) || +i.opacity < 1 || "transform" in i && i.transform !== "none" || "webkitTransform" in i && i.webkitTransform !== "none" || "mixBlendMode" in i && i.mixBlendMode !== "normal" || "filter" in i && i.filter !== "none" || "webkitFilter" in i && i.webkitFilter !== "none" || "isolation" in i && i.isolation === "isolate" || T2.test(i.willChange) || i.webkitOverflowScrolling === "touch");
}
function j0(n) {
  let i = n.length;
  for (; i--; ) {
    const o = n[i];
    if (Oe(o, "Missing node"), z2(o)) return o;
  }
  return null;
}
function H0(n) {
  return n && Number(getComputedStyle(n).zIndex) || 0;
}
function L0(n) {
  const i = [];
  for (; n; )
    i.push(n), n = ax(n);
  return i;
}
function ax(n) {
  const {
    parentNode: i
  } = n;
  return i && i instanceof ShadowRoot ? i.host : i;
}
const ix = 1, ox = 2, rx = 4, ux = 8, O2 = E2() === "coarse";
let Nn = [], Wi = !1, qa = /* @__PURE__ */ new Map(), Ns = /* @__PURE__ */ new Map();
const fr = /* @__PURE__ */ new Set();
function M2(n, i, o, r, c) {
  var f;
  const {
    ownerDocument: d
  } = i, g = {
    direction: o,
    element: i,
    hitAreaMargins: r,
    setResizeHandlerState: c
  }, h = (f = qa.get(d)) !== null && f !== void 0 ? f : 0;
  return qa.set(d, h + 1), fr.add(g), ys(), function() {
    var x;
    Ns.delete(n), fr.delete(g);
    const p = (x = qa.get(d)) !== null && x !== void 0 ? x : 1;
    if (qa.set(d, p - 1), ys(), p === 1 && qa.delete(d), Nn.includes(g)) {
      const S = Nn.indexOf(g);
      S >= 0 && Nn.splice(S, 1), cm(), c("up", !0, null);
    }
  };
}
function N2(n) {
  const {
    target: i
  } = n, {
    x: o,
    y: r
  } = Ms(n);
  Wi = !0, sm({
    target: i,
    x: o,
    y: r
  }), ys(), Nn.length > 0 && (bs("down", n), n.preventDefault(), sx(i) || n.stopImmediatePropagation());
}
function $d(n) {
  const {
    x: i,
    y: o
  } = Ms(n);
  if (Wi && n.buttons === 0 && (Wi = !1, bs("up", n)), !Wi) {
    const {
      target: r
    } = n;
    sm({
      target: r,
      x: i,
      y: o
    });
  }
  bs("move", n), cm(), Nn.length > 0 && n.preventDefault();
}
function Yd(n) {
  const {
    target: i
  } = n, {
    x: o,
    y: r
  } = Ms(n);
  Ns.clear(), Wi = !1, Nn.length > 0 && (n.preventDefault(), sx(i) || n.stopImmediatePropagation()), bs("up", n), sm({
    target: i,
    x: o,
    y: r
  }), cm(), ys();
}
function sx(n) {
  let i = n;
  for (; i; ) {
    if (i.hasAttribute(it.resizeHandle))
      return !0;
    i = i.parentElement;
  }
  return !1;
}
function sm({
  target: n,
  x: i,
  y: o
}) {
  Nn.splice(0);
  let r = null;
  (n instanceof HTMLElement || n instanceof SVGElement) && (r = n), fr.forEach((c) => {
    const {
      element: f,
      hitAreaMargins: d
    } = c, g = f.getBoundingClientRect(), {
      bottom: h,
      left: y,
      right: x,
      top: p
    } = g, S = O2 ? d.coarse : d.fine;
    if (i >= y - S && i <= x + S && o >= p - S && o <= h + S) {
      if (r !== null && document.contains(r) && f !== r && !f.contains(r) && !r.contains(f) && // Calculating stacking order has a cost, so we should avoid it if possible
      // That is why we only check potentially intersecting handles,
      // and why we skip if the event target is within the handle's DOM
      _2(r, f) > 0) {
        let R = r, _ = !1;
        for (; R && !R.contains(f); ) {
          if (R2(R.getBoundingClientRect(), g)) {
            _ = !0;
            break;
          }
          R = R.parentElement;
        }
        if (_)
          return;
      }
      Nn.push(c);
    }
  });
}
function Fd(n, i) {
  Ns.set(n, i);
}
function cm() {
  let n = !1, i = !1;
  Nn.forEach((r) => {
    const {
      direction: c
    } = r;
    c === "horizontal" ? n = !0 : i = !0;
  });
  let o = 0;
  Ns.forEach((r) => {
    o |= r;
  }), n && i ? Id("intersection", o) : n ? Id("horizontal", o) : i ? Id("vertical", o) : w2();
}
let Xd = new AbortController();
function ys() {
  Xd.abort(), Xd = new AbortController();
  const n = {
    capture: !0,
    signal: Xd.signal
  };
  fr.size && (Wi ? (Nn.length > 0 && qa.forEach((i, o) => {
    const {
      body: r
    } = o;
    i > 0 && (r.addEventListener("contextmenu", Yd, n), r.addEventListener("pointerleave", $d, n), r.addEventListener("pointermove", $d, n));
  }), window.addEventListener("pointerup", Yd, n), window.addEventListener("pointercancel", Yd, n)) : qa.forEach((i, o) => {
    const {
      body: r
    } = o;
    i > 0 && (r.addEventListener("pointerdown", N2, n), r.addEventListener("pointermove", $d, n));
  }));
}
function bs(n, i) {
  fr.forEach((o) => {
    const {
      setResizeHandlerState: r
    } = o, c = Nn.includes(o);
    r(n, c, i);
  });
}
function D2() {
  const [n, i] = v.useState(0);
  return v.useCallback(() => i((o) => o + 1), []);
}
function Oe(n, i) {
  if (!n)
    throw console.error(i), Error(i);
}
function Ya(n, i, o = rm) {
  return n.toFixed(o) === i.toFixed(o) ? 0 : n > i ? 1 : -1;
}
function Sl(n, i, o = rm) {
  return Ya(n, i, o) === 0;
}
function sn(n, i, o) {
  return Ya(n, i, o) === 0;
}
function j2(n, i, o) {
  if (n.length !== i.length)
    return !1;
  for (let r = 0; r < n.length; r++) {
    const c = n[r], f = i[r];
    if (!sn(c, f, o))
      return !1;
  }
  return !0;
}
function Ki({
  panelConstraints: n,
  panelIndex: i,
  size: o
}) {
  const r = n[i];
  Oe(r != null, `Panel constraints not found for index ${i}`);
  let {
    collapsedSize: c = 0,
    collapsible: f,
    maxSize: d = 100,
    minSize: g = 0
  } = r;
  if (Ya(o, g) < 0)
    if (f) {
      const h = (c + g) / 2;
      Ya(o, h) < 0 ? o = c : o = g;
    } else
      o = g;
  return o = Math.min(d, o), o = parseFloat(o.toFixed(rm)), o;
}
function rr({
  delta: n,
  initialLayout: i,
  panelConstraints: o,
  pivotIndices: r,
  prevLayout: c,
  trigger: f
}) {
  if (sn(n, 0))
    return i;
  const d = [...i], [g, h] = r;
  Oe(g != null, "Invalid first pivot index"), Oe(h != null, "Invalid second pivot index");
  let y = 0;
  if (f === "keyboard") {
    {
      const p = n < 0 ? h : g, S = o[p];
      Oe(S, `Panel constraints not found for index ${p}`);
      const {
        collapsedSize: C = 0,
        collapsible: R,
        minSize: _ = 0
      } = S;
      if (R) {
        const T = i[p];
        if (Oe(T != null, `Previous layout not found for panel index ${p}`), sn(T, C)) {
          const O = _ - T;
          Ya(O, Math.abs(n)) > 0 && (n = n < 0 ? 0 - O : O);
        }
      }
    }
    {
      const p = n < 0 ? g : h, S = o[p];
      Oe(S, `No panel constraints found for index ${p}`);
      const {
        collapsedSize: C = 0,
        collapsible: R,
        minSize: _ = 0
      } = S;
      if (R) {
        const T = i[p];
        if (Oe(T != null, `Previous layout not found for panel index ${p}`), sn(T, _)) {
          const O = T - C;
          Ya(O, Math.abs(n)) > 0 && (n = n < 0 ? 0 - O : O);
        }
      }
    }
  }
  {
    const p = n < 0 ? 1 : -1;
    let S = n < 0 ? h : g, C = 0;
    for (; ; ) {
      const _ = i[S];
      Oe(_ != null, `Previous layout not found for panel index ${S}`);
      const O = Ki({
        panelConstraints: o,
        panelIndex: S,
        size: 100
      }) - _;
      if (C += O, S += p, S < 0 || S >= o.length)
        break;
    }
    const R = Math.min(Math.abs(n), Math.abs(C));
    n = n < 0 ? 0 - R : R;
  }
  {
    let S = n < 0 ? g : h;
    for (; S >= 0 && S < o.length; ) {
      const C = Math.abs(n) - Math.abs(y), R = i[S];
      Oe(R != null, `Previous layout not found for panel index ${S}`);
      const _ = R - C, T = Ki({
        panelConstraints: o,
        panelIndex: S,
        size: _
      });
      if (!sn(R, T) && (y += R - T, d[S] = T, y.toPrecision(3).localeCompare(Math.abs(n).toPrecision(3), void 0, {
        numeric: !0
      }) >= 0))
        break;
      n < 0 ? S-- : S++;
    }
  }
  if (j2(c, d))
    return c;
  {
    const p = n < 0 ? h : g, S = i[p];
    Oe(S != null, `Previous layout not found for panel index ${p}`);
    const C = S + y, R = Ki({
      panelConstraints: o,
      panelIndex: p,
      size: C
    });
    if (d[p] = R, !sn(R, C)) {
      let _ = C - R, O = n < 0 ? h : g;
      for (; O >= 0 && O < o.length; ) {
        const D = d[O];
        Oe(D != null, `Previous layout not found for panel index ${O}`);
        const U = D + _, P = Ki({
          panelConstraints: o,
          panelIndex: O,
          size: U
        });
        if (sn(D, P) || (_ -= P - D, d[O] = P), sn(_, 0))
          break;
        n > 0 ? O-- : O++;
      }
    }
  }
  const x = d.reduce((p, S) => S + p, 0);
  return sn(x, 100) ? d : c;
}
function H2({
  layout: n,
  panelsArray: i,
  pivotIndices: o
}) {
  let r = 0, c = 100, f = 0, d = 0;
  const g = o[0];
  Oe(g != null, "No pivot index found"), i.forEach((p, S) => {
    const {
      constraints: C
    } = p, {
      maxSize: R = 100,
      minSize: _ = 0
    } = C;
    S === g ? (r = _, c = R) : (f += _, d += R);
  });
  const h = Math.min(c, 100 - f), y = Math.max(r, 100 - d), x = n[g];
  return {
    valueMax: h,
    valueMin: y,
    valueNow: x
  };
}
function dr(n, i = document) {
  return Array.from(i.querySelectorAll(`[${it.resizeHandleId}][data-panel-group-id="${n}"]`));
}
function cx(n, i, o = document) {
  const c = dr(n, o).findIndex((f) => f.getAttribute(it.resizeHandleId) === i);
  return c ?? null;
}
function fx(n, i, o) {
  const r = cx(n, i, o);
  return r != null ? [r, r + 1] : [-1, -1];
}
function dx(n, i = document) {
  var o;
  if (i instanceof HTMLElement && (i == null || (o = i.dataset) === null || o === void 0 ? void 0 : o.panelGroupId) == n)
    return i;
  const r = i.querySelector(`[data-panel-group][data-panel-group-id="${n}"]`);
  return r || null;
}
function Ds(n, i = document) {
  const o = i.querySelector(`[${it.resizeHandleId}="${n}"]`);
  return o || null;
}
function L2(n, i, o, r = document) {
  var c, f, d, g;
  const h = Ds(i, r), y = dr(n, r), x = h ? y.indexOf(h) : -1, p = (c = (f = o[x]) === null || f === void 0 ? void 0 : f.id) !== null && c !== void 0 ? c : null, S = (d = (g = o[x + 1]) === null || g === void 0 ? void 0 : g.id) !== null && d !== void 0 ? d : null;
  return [p, S];
}
function U2({
  committedValuesRef: n,
  eagerValuesRef: i,
  groupId: o,
  layout: r,
  panelDataArray: c,
  panelGroupElement: f,
  setLayout: d
}) {
  v.useRef({
    didWarnAboutMissingResizeHandle: !1
  }), Pa(() => {
    if (!f)
      return;
    const g = dr(o, f);
    for (let h = 0; h < c.length - 1; h++) {
      const {
        valueMax: y,
        valueMin: x,
        valueNow: p
      } = H2({
        layout: r,
        panelsArray: c,
        pivotIndices: [h, h + 1]
      }), S = g[h];
      if (S != null) {
        const C = c[h];
        Oe(C, `No panel data found for index "${h}"`), S.setAttribute("aria-controls", C.id), S.setAttribute("aria-valuemax", "" + Math.round(y)), S.setAttribute("aria-valuemin", "" + Math.round(x)), S.setAttribute("aria-valuenow", p != null ? "" + Math.round(p) : "");
      }
    }
    return () => {
      g.forEach((h, y) => {
        h.removeAttribute("aria-controls"), h.removeAttribute("aria-valuemax"), h.removeAttribute("aria-valuemin"), h.removeAttribute("aria-valuenow");
      });
    };
  }, [o, r, c, f]), v.useEffect(() => {
    if (!f)
      return;
    const g = i.current;
    Oe(g, "Eager values not found");
    const {
      panelDataArray: h
    } = g, y = dx(o, f);
    Oe(y != null, `No group found for id "${o}"`);
    const x = dr(o, f);
    Oe(x, `No resize handles found for group id "${o}"`);
    const p = x.map((S) => {
      const C = S.getAttribute(it.resizeHandleId);
      Oe(C, "Resize handle element has no handle id attribute");
      const [R, _] = L2(o, C, h, f);
      if (R == null || _ == null)
        return () => {
        };
      const T = (O) => {
        if (!O.defaultPrevented)
          switch (O.key) {
            case "Enter": {
              O.preventDefault();
              const D = h.findIndex((U) => U.id === R);
              if (D >= 0) {
                const U = h[D];
                Oe(U, `No panel data found for index ${D}`);
                const P = r[D], {
                  collapsedSize: Q = 0,
                  collapsible: B,
                  minSize: H = 0
                } = U.constraints;
                if (P != null && B) {
                  const $ = rr({
                    delta: sn(P, Q) ? H - Q : Q - P,
                    initialLayout: r,
                    panelConstraints: h.map((ae) => ae.constraints),
                    pivotIndices: fx(o, C, f),
                    prevLayout: r,
                    trigger: "keyboard"
                  });
                  r !== $ && d($);
                }
              }
              break;
            }
          }
      };
      return S.addEventListener("keydown", T), () => {
        S.removeEventListener("keydown", T);
      };
    });
    return () => {
      p.forEach((S) => S());
    };
  }, [f, n, i, o, r, c, d]);
}
function U0(n, i) {
  if (n.length !== i.length)
    return !1;
  for (let o = 0; o < n.length; o++)
    if (n[o] !== i[o])
      return !1;
  return !0;
}
function gx(n, i) {
  const o = n === "horizontal", {
    x: r,
    y: c
  } = Ms(i);
  return o ? r : c;
}
function V2(n, i, o, r, c) {
  const f = o === "horizontal", d = Ds(i, c);
  Oe(d, `No resize handle element found for id "${i}"`);
  const g = d.getAttribute(it.groupId);
  Oe(g, "Resize handle element has no group id attribute");
  let {
    initialCursorPosition: h
  } = r;
  const y = gx(o, n), x = dx(g, c);
  Oe(x, `No group element found for id "${g}"`);
  const p = x.getBoundingClientRect(), S = f ? p.width : p.height;
  return (y - h) / S * 100;
}
function G2(n, i, o, r, c, f) {
  if (tx(n)) {
    const d = o === "horizontal";
    let g = 0;
    n.shiftKey ? g = 100 : c != null ? g = c : g = 10;
    let h = 0;
    switch (n.key) {
      case "ArrowDown":
        h = d ? 0 : g;
        break;
      case "ArrowLeft":
        h = d ? -g : 0;
        break;
      case "ArrowRight":
        h = d ? g : 0;
        break;
      case "ArrowUp":
        h = d ? 0 : -g;
        break;
      case "End":
        h = 100;
        break;
      case "Home":
        h = -100;
        break;
    }
    return h;
  } else
    return r == null ? 0 : V2(n, i, o, r, f);
}
function k2({
  panelDataArray: n
}) {
  const i = Array(n.length), o = n.map((f) => f.constraints);
  let r = 0, c = 100;
  for (let f = 0; f < n.length; f++) {
    const d = o[f];
    Oe(d, `Panel constraints not found for index ${f}`);
    const {
      defaultSize: g
    } = d;
    g != null && (r++, i[f] = g, c -= g);
  }
  for (let f = 0; f < n.length; f++) {
    const d = o[f];
    Oe(d, `Panel constraints not found for index ${f}`);
    const {
      defaultSize: g
    } = d;
    if (g != null)
      continue;
    const h = n.length - r, y = c / h;
    r++, i[f] = y, c -= y;
  }
  return i;
}
function Yi(n, i, o) {
  i.forEach((r, c) => {
    const f = n[c];
    Oe(f, `Panel data not found for index ${c}`);
    const {
      callbacks: d,
      constraints: g,
      id: h
    } = f, {
      collapsedSize: y = 0,
      collapsible: x
    } = g, p = o[h];
    if (p == null || r !== p) {
      o[h] = r;
      const {
        onCollapse: S,
        onExpand: C,
        onResize: R
      } = d;
      R && R(r, p), x && (S || C) && (C && (p == null || Sl(p, y)) && !Sl(r, y) && C(), S && (p == null || !Sl(p, y)) && Sl(r, y) && S());
    }
  });
}
function ts(n, i) {
  if (n.length !== i.length)
    return !1;
  for (let o = 0; o < n.length; o++)
    if (n[o] != i[o])
      return !1;
  return !0;
}
function B2({
  defaultSize: n,
  dragState: i,
  layout: o,
  panelData: r,
  panelIndex: c,
  precision: f = 3
}) {
  const d = o[c];
  let g;
  return d == null ? g = n != null ? n.toPrecision(f) : "1" : r.length === 1 ? g = "1" : g = d.toPrecision(f), {
    flexBasis: 0,
    flexGrow: g,
    flexShrink: 1,
    // Without this, Panel sizes may be unintentionally overridden by their content
    overflow: "hidden",
    // Disable pointer events inside of a panel during resize
    // This avoid edge cases like nested iframes
    pointerEvents: i !== null ? "none" : void 0
  };
}
function q2(n, i = 10) {
  let o = null;
  return (...c) => {
    o !== null && clearTimeout(o), o = setTimeout(() => {
      n(...c);
    }, i);
  };
}
function V0(n) {
  try {
    if (typeof localStorage < "u")
      n.getItem = (i) => localStorage.getItem(i), n.setItem = (i, o) => {
        localStorage.setItem(i, o);
      };
    else
      throw new Error("localStorage not supported in this environment");
  } catch (i) {
    console.error(i), n.getItem = () => null, n.setItem = () => {
    };
  }
}
function mx(n) {
  return `react-resizable-panels:${n}`;
}
function hx(n) {
  return n.map((i) => {
    const {
      constraints: o,
      id: r,
      idIsFromProps: c,
      order: f
    } = i;
    return c ? r : f ? `${f}:${JSON.stringify(o)}` : JSON.stringify(o);
  }).sort((i, o) => i.localeCompare(o)).join(",");
}
function px(n, i) {
  try {
    const o = mx(n), r = i.getItem(o);
    if (r) {
      const c = JSON.parse(r);
      if (typeof c == "object" && c != null)
        return c;
    }
  } catch {
  }
  return null;
}
function P2(n, i, o) {
  var r, c;
  const f = (r = px(n, o)) !== null && r !== void 0 ? r : {}, d = hx(i);
  return (c = f[d]) !== null && c !== void 0 ? c : null;
}
function I2(n, i, o, r, c) {
  var f;
  const d = mx(n), g = hx(i), h = (f = px(n, c)) !== null && f !== void 0 ? f : {};
  h[g] = {
    expandToSizes: Object.fromEntries(o.entries()),
    layout: r
  };
  try {
    c.setItem(d, JSON.stringify(h));
  } catch (y) {
    console.error(y);
  }
}
function G0({
  layout: n,
  panelConstraints: i
}) {
  const o = [...n], r = o.reduce((f, d) => f + d, 0);
  if (o.length !== i.length)
    throw Error(`Invalid ${i.length} panel layout: ${o.map((f) => `${f}%`).join(", ")}`);
  if (!sn(r, 100) && o.length > 0)
    for (let f = 0; f < i.length; f++) {
      const d = o[f];
      Oe(d != null, `No layout data found for index ${f}`);
      const g = 100 / r * d;
      o[f] = g;
    }
  let c = 0;
  for (let f = 0; f < i.length; f++) {
    const d = o[f];
    Oe(d != null, `No layout data found for index ${f}`);
    const g = Ki({
      panelConstraints: i,
      panelIndex: f,
      size: d
    });
    d != g && (c += d - g, o[f] = g);
  }
  if (!sn(c, 0))
    for (let f = 0; f < i.length; f++) {
      const d = o[f];
      Oe(d != null, `No layout data found for index ${f}`);
      const g = d + c, h = Ki({
        panelConstraints: i,
        panelIndex: f,
        size: g
      });
      if (d !== h && (c -= h - d, o[f] = h, sn(c, 0)))
        break;
    }
  return o;
}
const $2 = 100, ur = {
  getItem: (n) => (V0(ur), ur.getItem(n)),
  setItem: (n, i) => {
    V0(ur), ur.setItem(n, i);
  }
}, k0 = {};
function vx({
  autoSaveId: n = null,
  children: i,
  className: o = "",
  direction: r,
  forwardedRef: c,
  id: f = null,
  onLayout: d = null,
  keyboardResizeBy: g = null,
  storage: h = ur,
  style: y,
  tagName: x = "div",
  ...p
}) {
  const S = um(f), C = v.useRef(null), [R, _] = v.useState(null), [T, O] = v.useState([]), D = D2(), U = v.useRef({}), P = v.useRef(/* @__PURE__ */ new Map()), Q = v.useRef(0), B = v.useRef({
    autoSaveId: n,
    direction: r,
    dragState: R,
    id: S,
    keyboardResizeBy: g,
    onLayout: d,
    storage: h
  }), H = v.useRef({
    layout: T,
    panelDataArray: [],
    panelDataArrayChanged: !1
  });
  v.useRef({
    didLogIdAndOrderWarning: !1,
    didLogPanelConstraintsWarning: !1,
    prevPanelIds: []
  }), v.useImperativeHandle(c, () => ({
    getId: () => B.current.id,
    getLayout: () => {
      const {
        layout: M
      } = H.current;
      return M;
    },
    setLayout: (M) => {
      const {
        onLayout: E
      } = B.current, {
        layout: A,
        panelDataArray: j
      } = H.current, V = G0({
        layout: M,
        panelConstraints: j.map((te) => te.constraints)
      });
      U0(A, V) || (O(V), H.current.layout = V, E && E(V), Yi(j, V, U.current));
    }
  }), []), Pa(() => {
    B.current.autoSaveId = n, B.current.direction = r, B.current.dragState = R, B.current.id = S, B.current.onLayout = d, B.current.storage = h;
  }), U2({
    committedValuesRef: B,
    eagerValuesRef: H,
    groupId: S,
    layout: T,
    panelDataArray: H.current.panelDataArray,
    setLayout: O,
    panelGroupElement: C.current
  }), v.useEffect(() => {
    const {
      panelDataArray: M
    } = H.current;
    if (n) {
      if (T.length === 0 || T.length !== M.length)
        return;
      let E = k0[n];
      E == null && (E = q2(I2, $2), k0[n] = E);
      const A = [...M], j = new Map(P.current);
      E(n, A, j, T, h);
    }
  }, [n, T, h]), v.useEffect(() => {
  });
  const $ = v.useCallback((M) => {
    const {
      onLayout: E
    } = B.current, {
      layout: A,
      panelDataArray: j
    } = H.current;
    if (M.constraints.collapsible) {
      const V = j.map((re) => re.constraints), {
        collapsedSize: te = 0,
        panelSize: F,
        pivotIndices: ue
      } = Ga(j, M, A);
      if (Oe(F != null, `Panel size not found for panel "${M.id}"`), !Sl(F, te)) {
        P.current.set(M.id, F);
        const ce = Zi(j, M) === j.length - 1 ? F - te : te - F, Ee = rr({
          delta: ce,
          initialLayout: A,
          panelConstraints: V,
          pivotIndices: ue,
          prevLayout: A,
          trigger: "imperative-api"
        });
        ts(A, Ee) || (O(Ee), H.current.layout = Ee, E && E(Ee), Yi(j, Ee, U.current));
      }
    }
  }, []), ae = v.useCallback((M, E) => {
    const {
      onLayout: A
    } = B.current, {
      layout: j,
      panelDataArray: V
    } = H.current;
    if (M.constraints.collapsible) {
      const te = V.map((Qe) => Qe.constraints), {
        collapsedSize: F = 0,
        panelSize: ue = 0,
        minSize: re = 0,
        pivotIndices: ce
      } = Ga(V, M, j), Ee = E ?? re;
      if (Sl(ue, F)) {
        const Qe = P.current.get(M.id), rt = Qe != null && Qe >= Ee ? Qe : Ee, Je = Zi(V, M) === V.length - 1 ? ue - rt : rt - ue, Re = rr({
          delta: Je,
          initialLayout: j,
          panelConstraints: te,
          pivotIndices: ce,
          prevLayout: j,
          trigger: "imperative-api"
        });
        ts(j, Re) || (O(Re), H.current.layout = Re, A && A(Re), Yi(V, Re, U.current));
      }
    }
  }, []), K = v.useCallback((M) => {
    const {
      layout: E,
      panelDataArray: A
    } = H.current, {
      panelSize: j
    } = Ga(A, M, E);
    return Oe(j != null, `Panel size not found for panel "${M.id}"`), j;
  }, []), se = v.useCallback((M, E) => {
    const {
      panelDataArray: A
    } = H.current, j = Zi(A, M);
    return B2({
      defaultSize: E,
      dragState: R,
      layout: T,
      panelData: A,
      panelIndex: j
    });
  }, [R, T]), oe = v.useCallback((M) => {
    const {
      layout: E,
      panelDataArray: A
    } = H.current, {
      collapsedSize: j = 0,
      collapsible: V,
      panelSize: te
    } = Ga(A, M, E);
    return Oe(te != null, `Panel size not found for panel "${M.id}"`), V === !0 && Sl(te, j);
  }, []), he = v.useCallback((M) => {
    const {
      layout: E,
      panelDataArray: A
    } = H.current, {
      collapsedSize: j = 0,
      collapsible: V,
      panelSize: te
    } = Ga(A, M, E);
    return Oe(te != null, `Panel size not found for panel "${M.id}"`), !V || Ya(te, j) > 0;
  }, []), ge = v.useCallback((M) => {
    const {
      panelDataArray: E
    } = H.current;
    E.push(M), E.sort((A, j) => {
      const V = A.order, te = j.order;
      return V == null && te == null ? 0 : V == null ? -1 : te == null ? 1 : V - te;
    }), H.current.panelDataArrayChanged = !0, D();
  }, [D]);
  Pa(() => {
    if (H.current.panelDataArrayChanged) {
      H.current.panelDataArrayChanged = !1;
      const {
        autoSaveId: M,
        onLayout: E,
        storage: A
      } = B.current, {
        layout: j,
        panelDataArray: V
      } = H.current;
      let te = null;
      if (M) {
        const ue = P2(M, V, A);
        ue && (P.current = new Map(Object.entries(ue.expandToSizes)), te = ue.layout);
      }
      te == null && (te = k2({
        panelDataArray: V
      }));
      const F = G0({
        layout: te,
        panelConstraints: V.map((ue) => ue.constraints)
      });
      U0(j, F) || (O(F), H.current.layout = F, E && E(F), Yi(V, F, U.current));
    }
  }), Pa(() => {
    const M = H.current;
    return () => {
      M.layout = [];
    };
  }, []);
  const de = v.useCallback((M) => {
    let E = !1;
    const A = C.current;
    return A && window.getComputedStyle(A, null).getPropertyValue("direction") === "rtl" && (E = !0), function(V) {
      V.preventDefault();
      const te = C.current;
      if (!te)
        return () => null;
      const {
        direction: F,
        dragState: ue,
        id: re,
        keyboardResizeBy: ce,
        onLayout: Ee
      } = B.current, {
        layout: Qe,
        panelDataArray: rt
      } = H.current, {
        initialLayout: ut
      } = ue ?? {}, Je = fx(re, M, te);
      let Re = G2(V, M, F, ue, ce, te);
      const Mt = F === "horizontal";
      Mt && E && (Re = -Re);
      const Hn = rt.map((Ln) => Ln.constraints), X = rr({
        delta: Re,
        initialLayout: ut ?? Qe,
        panelConstraints: Hn,
        pivotIndices: Je,
        prevLayout: Qe,
        trigger: tx(V) ? "keyboard" : "mouse-or-touch"
      }), Me = !ts(Qe, X);
      (nx(V) || lx(V)) && Q.current != Re && (Q.current = Re, !Me && Re !== 0 ? Mt ? Fd(M, Re < 0 ? ix : ox) : Fd(M, Re < 0 ? rx : ux) : Fd(M, 0)), Me && (O(X), H.current.layout = X, Ee && Ee(X), Yi(rt, X, U.current));
    };
  }, []), Z = v.useCallback((M, E) => {
    const {
      onLayout: A
    } = B.current, {
      layout: j,
      panelDataArray: V
    } = H.current, te = V.map((Qe) => Qe.constraints), {
      panelSize: F,
      pivotIndices: ue
    } = Ga(V, M, j);
    Oe(F != null, `Panel size not found for panel "${M.id}"`);
    const ce = Zi(V, M) === V.length - 1 ? F - E : E - F, Ee = rr({
      delta: ce,
      initialLayout: j,
      panelConstraints: te,
      pivotIndices: ue,
      prevLayout: j,
      trigger: "imperative-api"
    });
    ts(j, Ee) || (O(Ee), H.current.layout = Ee, A && A(Ee), Yi(V, Ee, U.current));
  }, []), le = v.useCallback((M, E) => {
    const {
      layout: A,
      panelDataArray: j
    } = H.current, {
      collapsedSize: V = 0,
      collapsible: te
    } = E, {
      collapsedSize: F = 0,
      collapsible: ue,
      maxSize: re = 100,
      minSize: ce = 0
    } = M.constraints, {
      panelSize: Ee
    } = Ga(j, M, A);
    Ee != null && (te && ue && Sl(Ee, V) ? Sl(V, F) || Z(M, F) : Ee < ce ? Z(M, ce) : Ee > re && Z(M, re));
  }, [Z]), ie = v.useCallback((M, E) => {
    const {
      direction: A
    } = B.current, {
      layout: j
    } = H.current;
    if (!C.current)
      return;
    const V = Ds(M, C.current);
    Oe(V, `Drag handle element not found for id "${M}"`);
    const te = gx(A, E);
    _({
      dragHandleId: M,
      dragHandleRect: V.getBoundingClientRect(),
      initialCursorPosition: te,
      initialLayout: j
    });
  }, []), me = v.useCallback(() => {
    _(null);
  }, []), ne = v.useCallback((M) => {
    const {
      panelDataArray: E
    } = H.current, A = Zi(E, M);
    A >= 0 && (E.splice(A, 1), delete U.current[M.id], H.current.panelDataArrayChanged = !0, D());
  }, [D]), ze = v.useMemo(() => ({
    collapsePanel: $,
    direction: r,
    dragState: R,
    expandPanel: ae,
    getPanelSize: K,
    getPanelStyle: se,
    groupId: S,
    isPanelCollapsed: oe,
    isPanelExpanded: he,
    reevaluatePanelConstraints: le,
    registerPanel: ge,
    registerResizeHandle: de,
    resizePanel: Z,
    startDragging: ie,
    stopDragging: me,
    unregisterPanel: ne,
    panelGroupElement: C.current
  }), [$, R, r, ae, K, se, S, oe, he, le, ge, de, Z, ie, me, ne]), W = {
    display: "flex",
    flexDirection: r === "horizontal" ? "row" : "column",
    height: "100%",
    overflow: "hidden",
    width: "100%"
  };
  return v.createElement(Os.Provider, {
    value: ze
  }, v.createElement(x, {
    ...p,
    children: i,
    className: o,
    id: f,
    ref: C,
    style: {
      ...W,
      ...y
    },
    // CSS selectors
    [it.group]: "",
    [it.groupDirection]: r,
    [it.groupId]: S
  }));
}
const yx = v.forwardRef((n, i) => v.createElement(vx, {
  ...n,
  forwardedRef: i
}));
vx.displayName = "PanelGroup";
yx.displayName = "forwardRef(PanelGroup)";
function Zi(n, i) {
  return n.findIndex((o) => o === i || o.id === i.id);
}
function Ga(n, i, o) {
  const r = Zi(n, i), f = r === n.length - 1 ? [r - 1, r] : [r, r + 1], d = o[r];
  return {
    ...i.constraints,
    panelSize: d,
    pivotIndices: f
  };
}
function Y2({
  disabled: n,
  handleId: i,
  resizeHandler: o,
  panelGroupElement: r
}) {
  v.useEffect(() => {
    if (n || o == null || r == null)
      return;
    const c = Ds(i, r);
    if (c == null)
      return;
    const f = (d) => {
      if (!d.defaultPrevented)
        switch (d.key) {
          case "ArrowDown":
          case "ArrowLeft":
          case "ArrowRight":
          case "ArrowUp":
          case "End":
          case "Home": {
            d.preventDefault(), o(d);
            break;
          }
          case "F6": {
            d.preventDefault();
            const g = c.getAttribute(it.groupId);
            Oe(g, `No group element found for id "${g}"`);
            const h = dr(g, r), y = cx(g, i, r);
            Oe(y !== null, `No resize element found for id "${i}"`);
            const x = d.shiftKey ? y > 0 ? y - 1 : h.length - 1 : y + 1 < h.length ? y + 1 : 0;
            h[x].focus();
            break;
          }
        }
    };
    return c.addEventListener("keydown", f), () => {
      c.removeEventListener("keydown", f);
    };
  }, [r, n, i, o]);
}
function bx({
  children: n = null,
  className: i = "",
  disabled: o = !1,
  hitAreaMargins: r,
  id: c,
  onBlur: f,
  onClick: d,
  onDragging: g,
  onFocus: h,
  onPointerDown: y,
  onPointerUp: x,
  style: p = {},
  tabIndex: S = 0,
  tagName: C = "div",
  ...R
}) {
  var _, T;
  const O = v.useRef(null), D = v.useRef({
    onClick: d,
    onDragging: g,
    onPointerDown: y,
    onPointerUp: x
  });
  v.useEffect(() => {
    D.current.onClick = d, D.current.onDragging = g, D.current.onPointerDown = y, D.current.onPointerUp = x;
  });
  const U = v.useContext(Os);
  if (U === null)
    throw Error("PanelResizeHandle components must be rendered within a PanelGroup container");
  const {
    direction: P,
    groupId: Q,
    registerResizeHandle: B,
    startDragging: H,
    stopDragging: $,
    panelGroupElement: ae
  } = U, K = um(c), [se, oe] = v.useState("inactive"), [he, ge] = v.useState(!1), [de, Z] = v.useState(null), le = v.useRef({
    state: se
  });
  Pa(() => {
    le.current.state = se;
  }), v.useEffect(() => {
    if (o)
      Z(null);
    else {
      const ze = B(K);
      Z(() => ze);
    }
  }, [o, K, B]);
  const ie = (_ = r?.coarse) !== null && _ !== void 0 ? _ : 15, me = (T = r?.fine) !== null && T !== void 0 ? T : 5;
  v.useEffect(() => {
    if (o || de == null)
      return;
    const ze = O.current;
    Oe(ze, "Element ref not attached");
    let W = !1;
    return M2(K, ze, P, {
      coarse: ie,
      fine: me
    }, (E, A, j) => {
      if (!A) {
        oe("inactive");
        return;
      }
      switch (E) {
        case "down": {
          oe("drag"), W = !1, Oe(j, 'Expected event to be defined for "down" action'), H(K, j);
          const {
            onDragging: V,
            onPointerDown: te
          } = D.current;
          V?.(!0), te?.();
          break;
        }
        case "move": {
          const {
            state: V
          } = le.current;
          W = !0, V !== "drag" && oe("hover"), Oe(j, 'Expected event to be defined for "move" action'), de(j);
          break;
        }
        case "up": {
          oe("hover"), $();
          const {
            onClick: V,
            onDragging: te,
            onPointerUp: F
          } = D.current;
          te?.(!1), F?.(), W || V?.();
          break;
        }
      }
    });
  }, [ie, P, o, me, B, K, de, H, $]), Y2({
    disabled: o,
    handleId: K,
    resizeHandler: de,
    panelGroupElement: ae
  });
  const ne = {
    touchAction: "none",
    userSelect: "none"
  };
  return v.createElement(C, {
    ...R,
    children: n,
    className: i,
    id: c,
    onBlur: () => {
      ge(!1), f?.();
    },
    onFocus: () => {
      ge(!0), h?.();
    },
    ref: O,
    role: "separator",
    style: {
      ...ne,
      ...p
    },
    tabIndex: S,
    // CSS selectors
    [it.groupDirection]: P,
    [it.groupId]: Q,
    [it.resizeHandle]: "",
    [it.resizeHandleActive]: se === "drag" ? "pointer" : he ? "keyboard" : void 0,
    [it.resizeHandleEnabled]: !o,
    [it.resizeHandleId]: K,
    [it.resizeHandleState]: se
  });
}
bx.displayName = "PanelResizeHandle";
const F2 = ({
  className: n,
  ...i
}) => /* @__PURE__ */ b.jsx(
  yx,
  {
    className: Fe(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      n
    ),
    ...i
  }
), Qd = ex, B0 = ({
  withHandle: n,
  className: i,
  ...o
}) => /* @__PURE__ */ b.jsx(
  bx,
  {
    className: Fe(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      i
    ),
    ...o,
    children: n && /* @__PURE__ */ b.jsx("div", { className: "z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border", children: /* @__PURE__ */ b.jsx(UE, { className: "h-2.5 w-2.5" }) })
  }
), X2 = ["top", "right", "bottom", "left"], ua = Math.min, xl = Math.max, Ss = Math.round, ns = Math.floor, Cl = (n) => ({
  x: n,
  y: n
}), Q2 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Sx(n, i, o) {
  return xl(n, ua(i, o));
}
function El(n, i) {
  return typeof n == "function" ? n(i) : n;
}
function sa(n) {
  return n.split("-")[0];
}
function ao(n) {
  return n.split("-")[1];
}
function fm(n) {
  return n === "x" ? "y" : "x";
}
function dm(n) {
  return n === "y" ? "height" : "width";
}
function Kn(n) {
  const i = n[0];
  return i === "t" || i === "b" ? "y" : "x";
}
function gm(n) {
  return fm(Kn(n));
}
function Z2(n, i, o) {
  o === void 0 && (o = !1);
  const r = ao(n), c = gm(n), f = dm(c);
  let d = c === "x" ? r === (o ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return i.reference[f] > i.floating[f] && (d = xs(d)), [d, xs(d)];
}
function K2(n) {
  const i = xs(n);
  return [Tg(n), i, Tg(i)];
}
function Tg(n) {
  return n.includes("start") ? n.replace("start", "end") : n.replace("end", "start");
}
const q0 = ["left", "right"], P0 = ["right", "left"], J2 = ["top", "bottom"], W2 = ["bottom", "top"];
function eA(n, i, o) {
  switch (n) {
    case "top":
    case "bottom":
      return o ? i ? P0 : q0 : i ? q0 : P0;
    case "left":
    case "right":
      return i ? J2 : W2;
    default:
      return [];
  }
}
function tA(n, i, o, r) {
  const c = ao(n);
  let f = eA(sa(n), o === "start", r);
  return c && (f = f.map((d) => d + "-" + c), i && (f = f.concat(f.map(Tg)))), f;
}
function xs(n) {
  const i = sa(n);
  return Q2[i] + n.slice(i.length);
}
function nA(n) {
  var i, o, r, c;
  return {
    top: (i = n.top) != null ? i : 0,
    right: (o = n.right) != null ? o : 0,
    bottom: (r = n.bottom) != null ? r : 0,
    left: (c = n.left) != null ? c : 0
  };
}
function xx(n) {
  return typeof n != "number" ? nA(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function Cs(n) {
  const {
    x: i,
    y: o,
    width: r,
    height: c
  } = n;
  return {
    width: r,
    height: c,
    top: o,
    left: i,
    right: i + r,
    bottom: o + c,
    x: i,
    y: o
  };
}
function I0(n, i, o) {
  let {
    reference: r,
    floating: c
  } = n;
  const f = Kn(i), d = gm(i), g = dm(d), h = sa(i), y = f === "y", x = r.x + r.width / 2 - c.width / 2, p = r.y + r.height / 2 - c.height / 2, S = r[g] / 2 - c[g] / 2;
  let C;
  switch (h) {
    case "top":
      C = {
        x,
        y: r.y - c.height
      };
      break;
    case "bottom":
      C = {
        x,
        y: r.y + r.height
      };
      break;
    case "right":
      C = {
        x: r.x + r.width,
        y: p
      };
      break;
    case "left":
      C = {
        x: r.x - c.width,
        y: p
      };
      break;
    default:
      C = {
        x: r.x,
        y: r.y
      };
  }
  const R = ao(i);
  return R && (C[d] += S * (R === "end" ? 1 : -1) * (o && y ? -1 : 1)), C;
}
async function lA(n, i) {
  var o;
  i === void 0 && (i = {});
  const {
    x: r,
    y: c,
    platform: f,
    rects: d,
    elements: g,
    strategy: h
  } = n, {
    boundary: y = "clippingAncestors",
    rootBoundary: x = "viewport",
    elementContext: p = "floating",
    altBoundary: S = !1,
    padding: C = 0
  } = El(i, n), R = xx(C), T = g[S ? p === "floating" ? "reference" : "floating" : p], O = Cs(await f.getClippingRect({
    element: (o = await (f.isElement == null ? void 0 : f.isElement(T))) == null || o ? T : T.contextElement || await (f.getDocumentElement == null ? void 0 : f.getDocumentElement(g.floating)),
    boundary: y,
    rootBoundary: x,
    strategy: h
  })), D = p === "floating" ? {
    x: r,
    y: c,
    width: d.floating.width,
    height: d.floating.height
  } : d.reference, U = await (f.getOffsetParent == null ? void 0 : f.getOffsetParent(g.floating)), P = await (f.isElement == null ? void 0 : f.isElement(U)) && await (f.getScale == null ? void 0 : f.getScale(U)) || {
    x: 1,
    y: 1
  }, Q = Cs(f.convertOffsetParentRelativeRectToViewportRelativeRect ? await f.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: g,
    rect: D,
    offsetParent: U,
    strategy: h
  }) : D);
  return {
    top: (O.top - Q.top + R.top) / P.y,
    bottom: (Q.bottom - O.bottom + R.bottom) / P.y,
    left: (O.left - Q.left + R.left) / P.x,
    right: (Q.right - O.right + R.right) / P.x
  };
}
const aA = 50, iA = async (n, i, o) => {
  const {
    placement: r = "bottom",
    strategy: c = "absolute",
    middleware: f = [],
    platform: d
  } = o, g = d.detectOverflow ? d : {
    ...d,
    detectOverflow: lA
  }, h = await (d.isRTL == null ? void 0 : d.isRTL(i));
  let y = await d.getElementRects({
    reference: n,
    floating: i,
    strategy: c
  }), {
    x,
    y: p
  } = I0(y, r, h), S = r, C = 0;
  const R = {};
  for (let _ = 0; _ < f.length; _++) {
    const T = f[_];
    if (!T)
      continue;
    const {
      name: O,
      fn: D
    } = T, {
      x: U,
      y: P,
      data: Q,
      reset: B
    } = await D({
      x,
      y: p,
      initialPlacement: r,
      placement: S,
      strategy: c,
      middlewareData: R,
      rects: y,
      platform: g,
      elements: {
        reference: n,
        floating: i
      }
    });
    x = U ?? x, p = P ?? p, R[O] = {
      ...R[O],
      ...Q
    }, B && C < aA && (C++, typeof B == "object" && (B.placement && (S = B.placement), B.rects && (y = B.rects === !0 ? await d.getElementRects({
      reference: n,
      floating: i,
      strategy: c
    }) : B.rects), {
      x,
      y: p
    } = I0(y, S, h)), _ = -1);
  }
  return {
    x,
    y: p,
    placement: S,
    strategy: c,
    middlewareData: R
  };
}, oA = (n) => ({
  name: "arrow",
  options: n,
  async fn(i) {
    const {
      x: o,
      y: r,
      placement: c,
      rects: f,
      platform: d,
      elements: g,
      middlewareData: h
    } = i, {
      element: y,
      padding: x = 0
    } = El(n, i) || {};
    if (y == null)
      return {};
    const p = xx(x), S = {
      x: o,
      y: r
    }, C = gm(c), R = dm(C), _ = await d.getDimensions(y), T = C === "y", O = T ? "top" : "left", D = T ? "bottom" : "right", U = T ? "clientHeight" : "clientWidth", P = f.reference[R] + f.reference[C] - S[C] - f.floating[R], Q = S[C] - f.reference[C], B = await (d.getOffsetParent == null ? void 0 : d.getOffsetParent(y));
    let H = B ? B[U] : 0;
    (!H || !await (d.isElement == null ? void 0 : d.isElement(B))) && (H = g.floating[U] || f.floating[R]);
    const $ = P / 2 - Q / 2, ae = H / 2 - _[R] / 2 - 1, K = ua(p[O], ae), se = ua(p[D], ae), oe = H - _[R] - se, he = H / 2 - _[R] / 2 + $, ge = Sx(K, he, oe), de = !h.arrow && ao(c) != null && he !== ge && f.reference[R] / 2 - (he < K ? K : se) - _[R] / 2 < 0, Z = de ? he < K ? he - K : he - oe : 0;
    return {
      [C]: S[C] + Z,
      data: {
        [C]: ge,
        centerOffset: he - ge - Z,
        ...de && {
          alignmentOffset: Z
        }
      },
      reset: de
    };
  }
}), rA = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(i) {
      var o, r;
      const {
        placement: c,
        middlewareData: f,
        rects: d,
        initialPlacement: g,
        platform: h,
        elements: y
      } = i, {
        mainAxis: x = !0,
        crossAxis: p = !0,
        fallbackPlacements: S,
        fallbackStrategy: C = "bestFit",
        fallbackAxisSideDirection: R = "none",
        flipAlignment: _ = !0,
        ...T
      } = El(n, i);
      if ((o = f.arrow) != null && o.alignmentOffset)
        return {};
      const O = sa(c), D = Kn(g), U = sa(g) === g, P = await (h.isRTL == null ? void 0 : h.isRTL(y.floating)), Q = S || (U || !_ ? [xs(g)] : K2(g)), B = R !== "none";
      !S && B && Q.push(...tA(g, _, R, P));
      const H = [g, ...Q], $ = await h.detectOverflow(i, T), ae = [];
      let K = ((r = f.flip) == null ? void 0 : r.overflows) || [];
      if (x && ae.push($[O]), p) {
        const ge = Z2(c, d, P);
        ae.push($[ge[0]], $[ge[1]]);
      }
      if (K = [...K, {
        placement: c,
        overflows: ae
      }], !ae.every((ge) => ge <= 0)) {
        var se, oe;
        const ge = (((se = f.flip) == null ? void 0 : se.index) || 0) + 1, de = H[ge];
        if (de && (!(p === "alignment" ? D !== Kn(de) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        K.every((ie) => Kn(ie.placement) === D ? ie.overflows[0] > 0 : !0)))
          return {
            data: {
              index: ge,
              overflows: K
            },
            reset: {
              placement: de
            }
          };
        let Z = (oe = K.filter((le) => le.overflows[0] <= 0).sort((le, ie) => le.overflows[1] - ie.overflows[1])[0]) == null ? void 0 : oe.placement;
        if (!Z)
          switch (C) {
            case "bestFit": {
              var he;
              const le = (he = K.filter((ie) => {
                if (B) {
                  const me = Kn(ie.placement);
                  return me === D || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  me === "y";
                }
                return !0;
              }).map((ie) => [ie.placement, ie.overflows.filter((me) => me > 0).reduce((me, ne) => me + ne, 0)]).sort((ie, me) => ie[1] - me[1])[0]) == null ? void 0 : he[0];
              le && (Z = le);
              break;
            }
            case "initialPlacement":
              Z = g;
              break;
          }
        if (c !== Z)
          return {
            reset: {
              placement: Z
            }
          };
      }
      return {};
    }
  };
};
function $0(n, i) {
  return {
    top: n.top - i.height,
    right: n.right - i.width,
    bottom: n.bottom - i.height,
    left: n.left - i.width
  };
}
function Y0(n) {
  return X2.some((i) => n[i] >= 0);
}
const uA = function(n) {
  return n === void 0 && (n = {}), {
    name: "hide",
    options: n,
    async fn(i) {
      const {
        rects: o,
        platform: r
      } = i, {
        strategy: c = "referenceHidden",
        ...f
      } = El(n, i);
      switch (c) {
        case "referenceHidden": {
          const d = await r.detectOverflow(i, {
            ...f,
            elementContext: "reference"
          }), g = $0(d, o.reference);
          return {
            data: {
              referenceHiddenOffsets: g,
              referenceHidden: Y0(g)
            }
          };
        }
        case "escaped": {
          const d = await r.detectOverflow(i, {
            ...f,
            altBoundary: !0
          }), g = $0(d, o.floating);
          return {
            data: {
              escapedOffsets: g,
              escaped: Y0(g)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Cx = /* @__PURE__ */ new Set(["left", "top"]);
async function sA(n, i) {
  const {
    placement: o,
    platform: r,
    elements: c
  } = n, f = await (r.isRTL == null ? void 0 : r.isRTL(c.floating)), d = sa(o), g = ao(o), h = Kn(o) === "y", y = Cx.has(d) ? -1 : 1, x = f && h ? -1 : 1, p = El(i, n);
  let {
    mainAxis: S,
    crossAxis: C,
    alignmentAxis: R
  } = typeof p == "number" ? {
    mainAxis: p,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: p.mainAxis || 0,
    crossAxis: p.crossAxis || 0,
    alignmentAxis: p.alignmentAxis
  };
  return g && typeof R == "number" && (C = g === "end" ? R * -1 : R), h ? {
    x: C * x,
    y: S * y
  } : {
    x: S * y,
    y: C * x
  };
}
const cA = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(i) {
      var o, r;
      const {
        x: c,
        y: f,
        placement: d,
        middlewareData: g
      } = i, h = await sA(i, n);
      return d === ((o = g.offset) == null ? void 0 : o.placement) && (r = g.arrow) != null && r.alignmentOffset ? {} : {
        x: c + h.x,
        y: f + h.y,
        data: {
          ...h,
          placement: d
        }
      };
    }
  };
}, fA = function(n) {
  return n === void 0 && (n = {}), {
    name: "shift",
    options: n,
    async fn(i) {
      const {
        x: o,
        y: r,
        placement: c,
        platform: f
      } = i, {
        mainAxis: d = !0,
        crossAxis: g = !1,
        limiter: h = {
          fn: (D) => {
            let {
              x: U,
              y: P
            } = D;
            return {
              x: U,
              y: P
            };
          }
        },
        ...y
      } = El(n, i), x = {
        x: o,
        y: r
      }, p = await f.detectOverflow(i, y), S = Kn(c), C = fm(S);
      let R = x[C], _ = x[S];
      const T = (D, U) => Sx(U + p[D === "y" ? "top" : "left"], U, U - p[D === "y" ? "bottom" : "right"]);
      d && (R = T(C, R)), g && (_ = T(S, _));
      const O = h.fn({
        ...i,
        [C]: R,
        [S]: _
      });
      return {
        ...O,
        data: {
          x: O.x - o,
          y: O.y - r,
          enabled: {
            [C]: d,
            [S]: g
          }
        }
      };
    }
  };
}, dA = function(n) {
  return n === void 0 && (n = {}), {
    options: n,
    fn(i) {
      var o, r;
      const {
        x: c,
        y: f,
        placement: d,
        rects: g,
        middlewareData: h
      } = i, {
        offset: y = 0,
        mainAxis: x = !0,
        crossAxis: p = !0
      } = El(n, i), S = {
        x: c,
        y: f
      }, C = Kn(d), R = fm(C);
      let _ = S[R], T = S[C];
      const O = El(y, i), D = typeof O == "number" ? {
        mainAxis: O,
        crossAxis: 0
      } : {
        mainAxis: (o = O.mainAxis) != null ? o : 0,
        crossAxis: (r = O.crossAxis) != null ? r : 0
      };
      if (x) {
        const Q = R === "y" ? "height" : "width", B = g.reference[R] - g.floating[Q] + D.mainAxis, H = g.reference[R] + g.reference[Q] - D.mainAxis;
        _ < B ? _ = B : _ > H && (_ = H);
      }
      if (p) {
        var U, P;
        const Q = R === "y" ? "width" : "height", B = Cx.has(sa(d)), H = g.reference[C] - g.floating[Q] + (B && ((U = h.offset) == null ? void 0 : U[C]) || 0) + (B ? 0 : D.crossAxis), $ = g.reference[C] + g.reference[Q] + (B ? 0 : ((P = h.offset) == null ? void 0 : P[C]) || 0) - (B ? D.crossAxis : 0);
        T < H ? T = H : T > $ && (T = $);
      }
      return {
        [R]: _,
        [C]: T
      };
    }
  };
}, gA = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(i) {
      const {
        placement: o,
        rects: r,
        platform: c,
        elements: f
      } = i, {
        apply: d = () => {
        },
        ...g
      } = El(n, i), h = await c.detectOverflow(i, g), y = sa(o), x = ao(o), p = Kn(o) === "y", {
        width: S,
        height: C
      } = r.floating;
      let R, _;
      y === "top" || y === "bottom" ? (R = y, _ = x === (await (c.isRTL == null ? void 0 : c.isRTL(f.floating)) ? "start" : "end") ? "left" : "right") : (_ = y, R = x === "end" ? "top" : "bottom");
      const T = C - h.top - h.bottom, O = S - h.left - h.right, D = ua(C - h[R], T), U = ua(S - h[_], O), P = i.middlewareData.shift, Q = !P;
      let B = D, H = U;
      P != null && P.enabled.x && (H = O), P != null && P.enabled.y && (B = T), Q && !x && (p ? H = S - 2 * xl(h.left, h.right) : B = C - 2 * xl(h.top, h.bottom)), await d({
        ...i,
        availableWidth: H,
        availableHeight: B
      });
      const $ = await c.getDimensions(f.floating);
      return S !== $.width || C !== $.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function js() {
  return typeof window < "u";
}
function io(n) {
  return wx(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function Qt(n) {
  var i;
  return (n == null || (i = n.ownerDocument) == null ? void 0 : i.defaultView) || window;
}
function _l(n) {
  var i;
  return (i = (wx(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : i.documentElement;
}
function wx(n) {
  return js() ? n instanceof Node || n instanceof Qt(n).Node : !1;
}
function Jn(n) {
  return js() ? n instanceof Element || n instanceof Qt(n).Element : !1;
}
function ma(n) {
  return js() ? n instanceof HTMLElement || n instanceof Qt(n).HTMLElement : !1;
}
function F0(n) {
  return !js() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof Qt(n).ShadowRoot;
}
function Hs(n) {
  const {
    overflow: i,
    overflowX: o,
    overflowY: r,
    display: c
  } = Wn(n);
  return /auto|scroll|overlay|hidden|clip/.test(i + r + o) && c !== "inline" && c !== "contents";
}
function mA(n) {
  return /^(table|td|th)$/.test(io(n));
}
function Ls(n) {
  try {
    if (n.matches(":popover-open"))
      return !0;
  } catch {
  }
  try {
    return n.matches(":modal");
  } catch {
    return !1;
  }
}
const hA = /transform|translate|scale|rotate|perspective|filter/, pA = /paint|layout|strict|content/, ka = (n) => !!n && n !== "none";
let Zd;
function mm(n) {
  const i = Jn(n) ? Wn(n) : n;
  return ka(i.transform) || ka(i.translate) || ka(i.scale) || ka(i.rotate) || ka(i.perspective) || !hm() && (ka(i.backdropFilter) || ka(i.filter)) || hA.test(i.willChange || "") || pA.test(i.contain || "");
}
function vA(n) {
  let i = Fa(n);
  for (; ma(i) && !gr(i); ) {
    if (mm(i))
      return i;
    if (Ls(i))
      return null;
    i = Fa(i);
  }
  return null;
}
function hm() {
  return Zd == null && (Zd = typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), Zd;
}
function gr(n) {
  return /^(html|body|#document)$/.test(io(n));
}
function Wn(n) {
  return Qt(n).getComputedStyle(n);
}
function Us(n) {
  return Jn(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function Fa(n) {
  if (io(n) === "html")
    return n;
  const i = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    F0(n) && n.host || // Fallback.
    _l(n)
  );
  return F0(i) ? i.host : i;
}
function Ex(n) {
  const i = Fa(n);
  return gr(i) ? (n.ownerDocument || n).body : ma(i) && Hs(i) ? i : Ex(i);
}
function mr(n, i, o) {
  var r;
  i === void 0 && (i = []), o === void 0 && (o = !0);
  const c = Ex(n), f = c === ((r = n.ownerDocument) == null ? void 0 : r.body), d = Qt(c);
  if (f) {
    const g = Ag(d);
    return i.concat(d, d.visualViewport || [], Hs(c) ? c : [], g && o ? mr(g) : []);
  } else
    return i.concat(c, mr(c, [], o));
}
function Ag(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Rx(n) {
  const i = Wn(n);
  let o = parseFloat(i.width) || 0, r = parseFloat(i.height) || 0;
  const c = ma(n), f = c ? n.offsetWidth : o, d = c ? n.offsetHeight : r, g = Ss(o) !== f || Ss(r) !== d;
  return g && (o = f, r = d), {
    width: o,
    height: r,
    $: g
  };
}
function pm(n) {
  return Jn(n) ? n : n.contextElement;
}
function eo(n) {
  const i = pm(n);
  if (!ma(i))
    return Cl(1);
  const o = i.getBoundingClientRect(), {
    width: r,
    height: c,
    $: f
  } = Rx(i);
  let d = (f ? Ss(o.width) : o.width) / r, g = (f ? Ss(o.height) : o.height) / c;
  return (!d || !Number.isFinite(d)) && (d = 1), (!g || !Number.isFinite(g)) && (g = 1), {
    x: d,
    y: g
  };
}
const yA = /* @__PURE__ */ Cl(0);
function _x(n) {
  const i = Qt(n);
  return !hm() || !i.visualViewport ? yA : {
    x: i.visualViewport.offsetLeft,
    y: i.visualViewport.offsetTop
  };
}
function bA(n, i, o) {
  return i === void 0 && (i = !1), !!o && i && o === Qt(n);
}
function Xa(n, i, o, r) {
  i === void 0 && (i = !1), o === void 0 && (o = !1);
  const c = n.getBoundingClientRect(), f = pm(n);
  let d = Cl(1);
  i && (r ? Jn(r) && (d = eo(r)) : d = eo(n));
  const g = bA(f, o, r) ? _x(f) : Cl(0);
  let h = (c.left + g.x) / d.x, y = (c.top + g.y) / d.y, x = c.width / d.x, p = c.height / d.y;
  if (f && r) {
    const S = Qt(f), C = Jn(r) ? Qt(r) : r;
    let R = S, _ = Ag(R);
    for (; _ && C !== R; ) {
      const T = eo(_), O = _.getBoundingClientRect(), D = Wn(_), U = O.left + (_.clientLeft + parseFloat(D.paddingLeft)) * T.x, P = O.top + (_.clientTop + parseFloat(D.paddingTop)) * T.y;
      h *= T.x, y *= T.y, x *= T.x, p *= T.y, h += U, y += P, R = Qt(_), _ = Ag(R);
    }
  }
  return Cs({
    width: x,
    height: p,
    x: h,
    y
  });
}
function Vs(n, i) {
  const o = Us(n).scrollLeft;
  return i ? i.left + o : Xa(_l(n)).left + o;
}
function Tx(n, i) {
  const o = n.getBoundingClientRect(), r = o.left + i.scrollLeft - Vs(n, o), c = o.top + i.scrollTop;
  return {
    x: r,
    y: c
  };
}
function SA(n) {
  let {
    elements: i,
    rect: o,
    offsetParent: r,
    strategy: c
  } = n;
  const f = c === "fixed", d = _l(r), g = i ? Ls(i.floating) : !1;
  if (r === d || g && f)
    return o;
  let h = {
    scrollLeft: 0,
    scrollTop: 0
  }, y = Cl(1);
  const x = Cl(0), p = ma(r);
  if ((p || !f) && ((io(r) !== "body" || Hs(d)) && (h = Us(r)), p)) {
    const C = Xa(r);
    y = eo(r), x.x = C.x + r.clientLeft, x.y = C.y + r.clientTop;
  }
  const S = d && !p && !f ? Tx(d, h) : Cl(0);
  return {
    width: o.width * y.x,
    height: o.height * y.y,
    x: o.x * y.x - h.scrollLeft * y.x + x.x + S.x,
    y: o.y * y.y - h.scrollTop * y.y + x.y + S.y
  };
}
function xA(n) {
  return n.getClientRects ? Array.from(n.getClientRects()) : [];
}
function CA(n) {
  const i = Us(n), o = n.ownerDocument.body, r = xl(n.scrollWidth, n.clientWidth, o.scrollWidth, o.clientWidth), c = xl(n.scrollHeight, n.clientHeight, o.scrollHeight, o.clientHeight);
  let f = -i.scrollLeft + Vs(n);
  const d = -i.scrollTop;
  return Wn(o).direction === "rtl" && (f += xl(n.clientWidth, o.clientWidth) - r), {
    width: r,
    height: c,
    x: f,
    y: d
  };
}
const wA = 25;
function EA(n, i, o) {
  o === void 0 && (o = "viewport");
  const r = o === "layoutViewport", c = Qt(n), f = _l(n), d = c.visualViewport;
  let g = f.clientWidth, h = f.clientHeight, y = 0, x = 0;
  if (d) {
    const S = !hm() || i === "fixed";
    r ? S || (y = -d.offsetLeft, x = -d.offsetTop) : (g = d.width, h = d.height, S && (y = d.offsetLeft, x = d.offsetTop));
  }
  if (Vs(f) <= 0) {
    const S = f.ownerDocument, C = S.body, R = getComputedStyle(C), _ = S.compatMode === "CSS1Compat" && parseFloat(R.marginLeft) + parseFloat(R.marginRight) || 0, T = Math.abs(f.clientWidth - C.clientWidth - _), O = getComputedStyle(f).scrollbarGutter === "stable both-edges" ? T / 2 : T;
    O <= wA && (g -= O);
  }
  return {
    width: g,
    height: h,
    x: y,
    y: x
  };
}
function RA(n, i) {
  const o = Xa(n, !0, i === "fixed"), r = o.top + n.clientTop, c = o.left + n.clientLeft, f = eo(n), d = n.clientWidth * f.x, g = n.clientHeight * f.y, h = c * f.x, y = r * f.y;
  return {
    width: d,
    height: g,
    x: h,
    y
  };
}
function X0(n, i, o) {
  let r;
  if (i === "viewport" || i === "layoutViewport")
    r = EA(n, o, i);
  else if (i === "document")
    r = CA(_l(n));
  else if (Jn(i))
    r = RA(i, o);
  else {
    const c = _x(n);
    r = {
      x: i.x - c.x,
      y: i.y - c.y,
      width: i.width,
      height: i.height
    };
  }
  return Cs(r);
}
function _A(n, i) {
  const o = i.get(n);
  if (o)
    return o;
  let r = mr(n, [], !1).filter((g) => Jn(g) && io(g) !== "body"), c = null;
  const f = Wn(n).position === "fixed";
  let d = f ? Fa(n) : n;
  for (; Jn(d) && !gr(d); ) {
    const g = Wn(d), h = mm(d), y = c ? c.position : f ? "fixed" : "";
    !h && (y === "fixed" || y === "absolute" && g.position === "static") ? r = r.filter((p) => p !== d) : c = g, d = Fa(d);
  }
  return i.set(n, r), r;
}
function TA(n) {
  let {
    element: i,
    boundary: o,
    rootBoundary: r,
    strategy: c
  } = n;
  const d = [...o === "clippingAncestors" ? Ls(i) ? [] : _A(i, this._c) : [].concat(o), r], g = X0(i, d[0], c);
  let h = g.top, y = g.right, x = g.bottom, p = g.left;
  for (let S = 1; S < d.length; S++) {
    const C = X0(i, d[S], c);
    h = xl(C.top, h), y = ua(C.right, y), x = ua(C.bottom, x), p = xl(C.left, p);
  }
  return {
    width: y - p,
    height: x - h,
    x: p,
    y: h
  };
}
function AA(n) {
  const {
    width: i,
    height: o
  } = Rx(n);
  return {
    width: i,
    height: o
  };
}
function zA(n, i, o) {
  const r = ma(i), c = _l(i), f = o === "fixed", d = Xa(n, !0, f, i);
  let g = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const h = Cl(0);
  if ((r || !f) && ((io(i) !== "body" || Hs(c)) && (g = Us(i)), r)) {
    const S = Xa(i, !0, f, i);
    h.x = S.x + i.clientLeft, h.y = S.y + i.clientTop;
  }
  !r && c && (h.x = Vs(c));
  const y = c && !r && !f ? Tx(c, g) : Cl(0), x = d.left + g.scrollLeft - h.x - y.x, p = d.top + g.scrollTop - h.y - y.y;
  return {
    x,
    y: p,
    width: d.width,
    height: d.height
  };
}
function Kd(n) {
  return Wn(n).position === "static";
}
function Q0(n, i) {
  if (!ma(n) || Wn(n).position === "fixed")
    return null;
  if (i)
    return i(n);
  let o = n.offsetParent;
  return _l(n) === o && (o = o.ownerDocument.body), o;
}
function Ax(n, i) {
  const o = Qt(n);
  if (Ls(n))
    return o;
  if (!ma(n)) {
    let c = Fa(n);
    for (; c && !gr(c); ) {
      if (Jn(c) && !Kd(c))
        return c;
      c = Fa(c);
    }
    return o;
  }
  let r = Q0(n, i);
  for (; r && mA(r) && Kd(r); )
    r = Q0(r, i);
  return r && gr(r) && Kd(r) && !mm(r) ? o : r || vA(n) || o;
}
const OA = async function(n) {
  const i = this.getOffsetParent || Ax, o = this.getDimensions, r = await o(n.floating);
  return {
    reference: zA(n.reference, await i(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function MA(n) {
  return Wn(n).direction === "rtl";
}
const NA = {
  convertOffsetParentRelativeRectToViewportRelativeRect: SA,
  getDocumentElement: _l,
  getClippingRect: TA,
  getOffsetParent: Ax,
  getElementRects: OA,
  getClientRects: xA,
  getDimensions: AA,
  getScale: eo,
  isElement: Jn,
  isRTL: MA
};
function zx(n, i) {
  return n.x === i.x && n.y === i.y && n.width === i.width && n.height === i.height;
}
function DA(n, i, o) {
  let r = null, c;
  const f = _l(n);
  function d() {
    var x;
    clearTimeout(c), (x = r) == null || x.disconnect(), r = null;
  }
  function g(x, p) {
    x === void 0 && (x = !1), p === void 0 && (p = 1), d();
    const S = n.getBoundingClientRect(), {
      left: C,
      top: R,
      width: _,
      height: T
    } = S;
    if (x || i(), !_ || !T)
      return;
    const O = ns(R), D = ns(f.clientWidth - (C + _)), U = ns(f.clientHeight - (R + T)), P = ns(C), B = {
      rootMargin: -O + "px " + -D + "px " + -U + "px " + -P + "px",
      threshold: xl(0, ua(1, p)) || 1
    };
    let H = !0;
    function $(ae) {
      const K = ae[0].intersectionRatio;
      if (!zx(S, n.getBoundingClientRect()))
        return g();
      if (K !== p) {
        if (!H)
          return g();
        K ? g(!1, K) : c = setTimeout(() => {
          g(!1, 1e-7);
        }, 1e3);
      }
      H = !1;
    }
    try {
      r = new IntersectionObserver($, {
        ...B,
        // Handle <iframe>s
        root: f.ownerDocument
      });
    } catch {
      r = new IntersectionObserver($, B);
    }
    r.observe(n);
  }
  const h = Qt(n), y = () => g(o);
  return h.addEventListener("resize", y), g(!0), () => {
    h.removeEventListener("resize", y), d();
  };
}
function jA(n, i, o, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: c = !0,
    ancestorResize: f = !0,
    elementResize: d = typeof ResizeObserver == "function",
    layoutShift: g = typeof IntersectionObserver == "function",
    animationFrame: h = !1
  } = r, y = pm(n), x = c || f ? [...y ? mr(y) : [], ...i ? mr(i) : []] : [];
  x.forEach((O) => {
    c && O.addEventListener("scroll", o), f && O.addEventListener("resize", o);
  });
  const p = y && g ? DA(y, o, f) : null;
  let S = -1, C = null;
  d && (C = new ResizeObserver((O) => {
    let [D] = O;
    D && D.target === y && C && i && (C.unobserve(i), cancelAnimationFrame(S), S = requestAnimationFrame(() => {
      var U;
      (U = C) == null || U.observe(i);
    })), o();
  }), y && !h && C.observe(y), i && C.observe(i));
  let R, _ = h ? Xa(n) : null;
  h && T();
  function T() {
    const O = Xa(n);
    _ && !zx(_, O) && o(), _ = O, R = requestAnimationFrame(T);
  }
  return o(), () => {
    var O;
    x.forEach((D) => {
      c && D.removeEventListener("scroll", o), f && D.removeEventListener("resize", o);
    }), p?.(), (O = C) == null || O.disconnect(), C = null, h && cancelAnimationFrame(R);
  };
}
const HA = cA, LA = fA, UA = rA, VA = gA, GA = uA, Z0 = oA, kA = dA, BA = (n, i, o) => {
  const r = /* @__PURE__ */ new Map(), c = o ?? {}, f = {
    ...NA,
    ...c.platform,
    _c: r
  };
  return iA(n, i, {
    ...c,
    platform: f
  });
};
var qA = typeof document < "u", PA = function() {
}, hs = qA ? v.useLayoutEffect : PA;
function ws(n, i) {
  if (n === i)
    return !0;
  if (typeof n != typeof i)
    return !1;
  if (typeof n == "function" && n.toString() === i.toString())
    return !0;
  let o, r, c;
  if (n && i && typeof n == "object") {
    if (Array.isArray(n)) {
      if (o = n.length, o !== i.length) return !1;
      for (r = o; r-- !== 0; )
        if (!ws(n[r], i[r]))
          return !1;
      return !0;
    }
    if (c = Object.keys(n), o = c.length, o !== Object.keys(i).length)
      return !1;
    for (r = o; r-- !== 0; )
      if (!{}.hasOwnProperty.call(i, c[r]))
        return !1;
    for (r = o; r-- !== 0; ) {
      const f = c[r];
      if (!(f === "_owner" && n.$$typeof) && !ws(n[f], i[f]))
        return !1;
    }
    return !0;
  }
  return n !== n && i !== i;
}
function Ox(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function K0(n, i) {
  const o = Ox(n);
  return Math.round(i * o) / o;
}
function Jd(n) {
  const i = v.useRef(n);
  return hs(() => {
    i.current = n;
  }), i;
}
function IA(n) {
  n === void 0 && (n = {});
  const {
    placement: i = "bottom",
    strategy: o = "absolute",
    middleware: r = [],
    platform: c,
    elements: {
      reference: f,
      floating: d
    } = {},
    transform: g = !0,
    whileElementsMounted: h,
    open: y
  } = n, [x, p] = v.useState({
    x: 0,
    y: 0,
    strategy: o,
    placement: i,
    middlewareData: {},
    isPositioned: !1
  }), [S, C] = v.useState(r);
  ws(S, r) || C(r);
  const [R, _] = v.useState(null), [T, O] = v.useState(null), D = v.useCallback((ie) => {
    ie !== B.current && (B.current = ie, _(ie));
  }, []), U = v.useCallback((ie) => {
    ie !== H.current && (H.current = ie, O(ie));
  }, []), P = f || R, Q = d || T, B = v.useRef(null), H = v.useRef(null), $ = v.useRef(x), ae = h != null, K = Jd(h), se = Jd(c), oe = Jd(y), he = v.useCallback(() => {
    if (!B.current || !H.current)
      return;
    const ie = {
      placement: i,
      strategy: o,
      middleware: S
    };
    se.current && (ie.platform = se.current), BA(B.current, H.current, ie).then((me) => {
      const ne = {
        ...me,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: oe.current !== !1
      };
      ge.current && !ws($.current, ne) && ($.current = ne, $g.flushSync(() => {
        p(ne);
      }));
    });
  }, [S, i, o, se, oe]);
  hs(() => {
    y === !1 && $.current.isPositioned && ($.current.isPositioned = !1, p((ie) => ({
      ...ie,
      isPositioned: !1
    })));
  }, [y]);
  const ge = v.useRef(!1);
  hs(() => (ge.current = !0, () => {
    ge.current = !1;
  }), []), hs(() => {
    if (P && (B.current = P), Q && (H.current = Q), P && Q) {
      if (K.current)
        return K.current(P, Q, he);
      he();
    }
  }, [P, Q, he, K, ae]);
  const de = v.useMemo(() => ({
    reference: B,
    floating: H,
    setReference: D,
    setFloating: U
  }), [D, U]), Z = v.useMemo(() => ({
    reference: P,
    floating: Q
  }), [P, Q]), le = v.useMemo(() => {
    const ie = {
      position: o,
      left: 0,
      top: 0
    };
    if (!Z.floating)
      return ie;
    const me = K0(Z.floating, x.x), ne = K0(Z.floating, x.y);
    return g ? {
      ...ie,
      transform: "translate(" + me + "px, " + ne + "px)",
      ...Ox(Z.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: o,
      left: me,
      top: ne
    };
  }, [o, g, Z.floating, x.x, x.y]);
  return v.useMemo(() => ({
    ...x,
    update: he,
    refs: de,
    elements: Z,
    floatingStyles: le
  }), [x, he, de, Z, le]);
}
const $A = (n) => {
  function i(o) {
    return {}.hasOwnProperty.call(o, "current");
  }
  return {
    name: "arrow",
    options: n,
    fn(o) {
      const {
        element: r,
        padding: c
      } = typeof n == "function" ? n(o) : n;
      return r && i(r) ? r.current != null ? Z0({
        element: r.current,
        padding: c
      }).fn(o) : {} : r ? Z0({
        element: r,
        padding: c
      }).fn(o) : {};
    }
  };
}, YA = (n, i) => {
  const o = HA(n);
  return {
    name: o.name,
    fn: o.fn,
    options: [n, i]
  };
}, FA = (n, i) => {
  const o = LA(n);
  return {
    name: o.name,
    fn: o.fn,
    options: [n, i]
  };
}, XA = (n, i) => ({
  fn: kA(n).fn,
  options: [n, i]
}), QA = (n, i) => {
  const o = UA(n);
  return {
    name: o.name,
    fn: o.fn,
    options: [n, i]
  };
}, ZA = (n, i) => {
  const o = VA(n);
  return {
    name: o.name,
    fn: o.fn,
    options: [n, i]
  };
}, KA = (n, i) => {
  const o = GA(n);
  return {
    name: o.name,
    fn: o.fn,
    options: [n, i]
  };
}, JA = (n, i) => {
  const o = $A(n);
  return {
    name: o.name,
    fn: o.fn,
    options: [n, i]
  };
};
var WA = Object.defineProperty, ez = (n, i) => WA(n, "name", { value: i, configurable: !0 });
function Mx(n) {
  const [i, o] = v.useState(void 0);
  return Xt(() => {
    if (n) {
      o({ width: n.offsetWidth, height: n.offsetHeight });
      const r = new ResizeObserver((c) => {
        if (!Array.isArray(c) || !c.length)
          return;
        const f = c[0];
        let d, g;
        if ("borderBoxSize" in f) {
          const h = f.borderBoxSize, y = Array.isArray(h) ? h[0] : h;
          d = y.inlineSize, g = y.blockSize;
        } else
          d = n.offsetWidth, g = n.offsetHeight;
        o({ width: d, height: g });
      });
      return r.observe(n, { box: "border-box" }), () => r.unobserve(n);
    } else
      o(void 0);
  }, [n]), i;
}
ez(Mx, "useSize");
var tz = Object.defineProperty, aa = (n, i) => tz(n, "name", { value: i, configurable: !0 }), Nx = "Popper", [Dx, jx] = /* @__PURE__ */ Rl(Nx), [nz, Hx] = Dx(Nx), lz = /* @__PURE__ */ aa((n) => {
  const { __scopePopper: i, children: o } = n, [r, c] = v.useState(null), [f, d] = v.useState(void 0);
  return /* @__PURE__ */ b.jsx(
    nz,
    {
      scope: i,
      anchor: r,
      onAnchorChange: c,
      placementState: f,
      setPlacementState: d,
      children: o
    }
  );
}, "Popper"), az = "PopperAnchor", iz = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ aa(function(i, o) {
    const { __scopePopper: r, virtualRef: c, ...f } = i, d = Hx(az, r), g = v.useRef(null), h = d.onAnchorChange, y = v.useCallback(
      (_) => {
        g.current = _, _ && h(_);
      },
      [h]
    ), x = Ht(o, y), p = v.useRef(null);
    v.useEffect(() => {
      if (!c)
        return;
      const _ = p.current;
      p.current = c.current, _ !== p.current && h(p.current);
    });
    const S = d.placementState && Gs(d.placementState), C = S?.[0], R = S?.[1];
    return c ? null : /* @__PURE__ */ b.jsx(
      Ye.div,
      {
        "data-radix-popper-side": C,
        "data-radix-popper-align": R,
        ...f,
        ref: x
      }
    );
  }, "PopperAnchor")
), Lx = "PopperContent", [oz, KO] = Dx(Lx), rz = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ aa(function(i, o) {
    const {
      __scopePopper: r,
      side: c = "bottom",
      sideOffset: f = 0,
      align: d = "center",
      alignOffset: g = 0,
      arrowPadding: h = 0,
      avoidCollisions: y = !0,
      collisionBoundary: x = [],
      collisionPadding: p = 0,
      sticky: S = "partial",
      hideWhenDetached: C = !1,
      updatePositionStrategy: R = "optimized",
      onPlaced: _,
      ...T
    } = i, O = Hx(Lx, r), [D, U] = v.useState(null), P = Ht(o, U), [Q, B] = v.useState(null), H = Mx(Q), $ = H?.width ?? 0, ae = H?.height ?? 0, K = c + (d !== "center" ? "-" + d : ""), se = typeof p == "number" ? p : { top: 0, right: 0, bottom: 0, left: 0, ...p }, oe = Array.isArray(x) ? x : [x], he = oe.length > 0, ge = {
      padding: se,
      boundary: oe.filter(Ux),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: he
    }, { refs: de, floatingStyles: Z, placement: le, isPositioned: ie, middlewareData: me } = IA({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: K,
      whileElementsMounted: /* @__PURE__ */ aa((...F) => jA(...F, {
        animationFrame: R === "always"
      }), "whileElementsMounted"),
      elements: {
        reference: O.anchor
      },
      middleware: [
        YA({ mainAxis: f + ae, alignmentAxis: g }),
        y && FA({
          mainAxis: !0,
          crossAxis: !1,
          limiter: S === "partial" ? XA() : void 0,
          ...ge
        }),
        y && QA({ ...ge }),
        ZA({
          ...ge,
          apply: /* @__PURE__ */ aa(({ elements: F, rects: ue, availableWidth: re, availableHeight: ce }) => {
            const { width: Ee, height: Qe } = ue.reference, rt = F.floating.style;
            rt.setProperty("--radix-popper-available-width", `${re}px`), rt.setProperty("--radix-popper-available-height", `${ce}px`), rt.setProperty("--radix-popper-anchor-width", `${Ee}px`), rt.setProperty("--radix-popper-anchor-height", `${Qe}px`);
          }, "apply")
        }),
        Q && JA({ element: Q, padding: h }),
        uz({ arrowWidth: $, arrowHeight: ae }),
        C && KA({
          strategy: "referenceHidden",
          ...ge,
          // `hide` detects whether the anchor (reference) is clipped, so when
          // no explicit `collisionBoundary` is set we fall back to Floating
          // UI's default clipping ancestors (e.g. a scrollable menu). This
          // lets an occluded submenu hide once its anchor scrolls out of view
          // (#3237). The collision/size middlewares deliberately keep the
          // viewport-based default to avoid clamping content rendered inside
          // transformed or overflow-clipping portal containers.
          boundary: he ? ge.boundary : void 0
        })
      ]
    }), ne = O.setPlacementState;
    Xt(() => (ne(le), () => {
      ne(void 0);
    }), [le, ne]);
    const [ze, W] = Gs(le), M = oa(_);
    Xt(() => {
      ie && M?.();
    }, [ie, M]);
    const E = me.arrow?.x, A = me.arrow?.y, j = me.arrow?.centerOffset !== 0, [V, te] = v.useState();
    return Xt(() => {
      D && te(window.getComputedStyle(D).zIndex);
    }, [D]), /* @__PURE__ */ b.jsx(
      "div",
      {
        ref: de.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...Z,
          transform: ie ? Z.transform : "translate(0, -200%)",
          // keep off the page when measuring
          minWidth: "max-content",
          zIndex: V,
          "--radix-popper-transform-origin": [
            me.transformOrigin?.x,
            me.transformOrigin?.y
          ].join(" "),
          // hide the content if using the hide middleware and should be hidden
          // set visibility to hidden and disable pointer events so the UI behaves
          // as if the PopperContent isn't there at all
          ...me.hide?.referenceHidden && {
            visibility: "hidden",
            pointerEvents: "none"
          }
        },
        dir: i.dir,
        children: /* @__PURE__ */ b.jsx(
          oz,
          {
            scope: r,
            placedSide: ze,
            placedAlign: W,
            onArrowChange: B,
            arrowX: E,
            arrowY: A,
            shouldHideArrow: j,
            children: /* @__PURE__ */ b.jsx(
              Ye.div,
              {
                "data-side": ze,
                "data-align": W,
                ...T,
                ref: P,
                style: {
                  ...T.style,
                  // if the PopperContent hasn't been placed yet (not all
                  // measurements done) we prevent animations so that users'
                  // animations don't kick in too early from the wrong sides.
                  animation: ie ? T.style?.animation : "none"
                }
              }
            )
          }
        )
      }
    );
  }, "PopperContent")
);
function Ux(n) {
  return n !== null;
}
aa(Ux, "isNotNull");
var uz = /* @__PURE__ */ aa((n) => ({
  name: "transformOrigin",
  options: n,
  fn(i) {
    const { placement: o, rects: r, middlewareData: c } = i, d = c.arrow?.centerOffset !== 0, g = d ? 0 : n.arrowWidth, h = d ? 0 : n.arrowHeight, [y, x] = Gs(o), p = { start: "0%", center: "50%", end: "100%" }[x], S = (c.arrow?.x ?? 0) + g / 2, C = (c.arrow?.y ?? 0) + h / 2;
    let R = "", _ = "";
    return y === "bottom" ? (R = d ? p : `${S}px`, _ = `${-h}px`) : y === "top" ? (R = d ? p : `${S}px`, _ = `${r.floating.height + h}px`) : y === "right" ? (R = `${-h}px`, _ = d ? p : `${C}px`) : y === "left" && (R = `${r.floating.width + h}px`, _ = d ? p : `${C}px`), { data: { x: R, y: _ } };
  }
}), "transformOrigin");
function Gs(n) {
  const [i, o = "center"] = n.split("-");
  return [i, o];
}
aa(Gs, "getSideAndAlignFromPlacement");
var sz = lz, cz = iz, fz = rz, dz = Object.defineProperty, gz = (n, i) => dz(n, "name", { value: i, configurable: !0 }), mz = Object.freeze({
  // See: https://github.com/twbs/bootstrap/blob/main/scss/mixins/_visually-hidden.scss
  position: "absolute",
  border: 0,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  wordWrap: "normal"
}), hz = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ gz(function(i, o) {
    return /* @__PURE__ */ b.jsx(
      Ye.span,
      {
        ...i,
        ref: o,
        style: { ...mz, ...i.style }
      }
    );
  }, "VisuallyHidden")
), pz = hz, vz = Object.defineProperty, wt = (n, i) => vz(n, "name", { value: i, configurable: !0 }), [vm, JO] = /* @__PURE__ */ Rl("Tooltip", [
  jx
]), ym = jx(), yz = "TooltipProvider", bz = 700, zg = "tooltip.open", [Sz, bm] = vm(yz), xz = /* @__PURE__ */ wt((n) => {
  const {
    __scopeTooltip: i,
    delayDuration: o = bz,
    skipDelayDuration: r = 300,
    disableHoverableContent: c = !1,
    children: f
  } = n, d = v.useRef(!0), g = v.useRef(!1), h = v.useRef(0);
  return v.useEffect(() => {
    const y = h.current;
    return () => window.clearTimeout(y);
  }, []), /* @__PURE__ */ b.jsx(
    Sz,
    {
      scope: i,
      isOpenDelayedRef: d,
      delayDuration: o,
      onOpen: v.useCallback(() => {
        r <= 0 || (window.clearTimeout(h.current), d.current = !1);
      }, [r]),
      onClose: v.useCallback(() => {
        r <= 0 || (window.clearTimeout(h.current), h.current = window.setTimeout(
          () => d.current = !0,
          r
        ));
      }, [r]),
      isPointerInTransitRef: g,
      onPointerInTransitChange: v.useCallback((y) => {
        g.current = y;
      }, []),
      disableHoverableContent: c,
      children: f
    }
  );
}, "TooltipProvider"), Og = "Tooltip", [Cz, yr] = vm(Og), wz = /* @__PURE__ */ wt((n) => {
  const {
    __scopeTooltip: i,
    children: o,
    open: r,
    defaultOpen: c,
    onOpenChange: f,
    disableHoverableContent: d,
    delayDuration: g
  } = n, h = bm(Og, n.__scopeTooltip), y = ym(i), [x, p] = v.useState(null), [S, C] = v.useState(void 0), R = fn(), _ = v.useRef(0), T = d ?? h.disableHoverableContent, O = g ?? h.delayDuration, D = v.useRef(!1), [U, P] = ga({
    prop: r,
    defaultProp: c ?? !1,
    onChange: /* @__PURE__ */ wt((K) => {
      K ? (h.onOpen(), document.dispatchEvent(new CustomEvent(zg))) : h.onClose(), f?.(K);
    }, "onChange"),
    caller: Og
  }), Q = v.useMemo(() => U ? D.current ? "delayed-open" : "instant-open" : "closed", [U]), B = v.useCallback(() => {
    window.clearTimeout(_.current), _.current = 0, D.current = !1, P(!0);
  }, [P]), H = v.useCallback(() => {
    window.clearTimeout(_.current), _.current = 0, P(!1);
  }, [P]), $ = v.useCallback(() => {
    window.clearTimeout(_.current), _.current = window.setTimeout(() => {
      D.current = !0, P(!0), _.current = 0;
    }, O);
  }, [O, P]);
  v.useEffect(() => () => {
    _.current && (window.clearTimeout(_.current), _.current = 0);
  }, []);
  const ae = S ?? R;
  return /* @__PURE__ */ b.jsx(sz, { ...y, children: /* @__PURE__ */ b.jsx(
    Cz,
    {
      scope: i,
      contentId: ae,
      setContentId: C,
      open: U,
      stateAttribute: Q,
      trigger: x,
      onTriggerChange: p,
      onTriggerEnter: v.useCallback(() => {
        h.isOpenDelayedRef.current ? $() : B();
      }, [h.isOpenDelayedRef, $, B]),
      onTriggerLeave: v.useCallback(() => {
        T ? H() : (window.clearTimeout(_.current), _.current = 0);
      }, [H, T]),
      onOpen: B,
      onClose: H,
      disableHoverableContent: T,
      children: o
    }
  ) });
}, "Tooltip"), J0 = "TooltipTrigger", Ez = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ wt(function(i, o) {
    const { __scopeTooltip: r, ...c } = i, f = yr(J0, r), d = bm(J0, r), g = ym(r), h = v.useRef(null), y = Ht(o, h, f.onTriggerChange), x = v.useRef(!1), p = v.useRef(!1), S = v.useCallback(() => x.current = !1, []);
    return v.useEffect(() => () => document.removeEventListener("pointerup", S), [S]), /* @__PURE__ */ b.jsx(cz, { asChild: !0, ...g, children: /* @__PURE__ */ b.jsx(
      Ye.button,
      {
        "aria-describedby": f.open ? f.contentId : void 0,
        "data-state": f.stateAttribute,
        ...c,
        ref: y,
        onPointerMove: et(i.onPointerMove, (C) => {
          C.pointerType !== "touch" && !p.current && !d.isPointerInTransitRef.current && (f.onTriggerEnter(), p.current = !0);
        }),
        onPointerLeave: et(i.onPointerLeave, () => {
          f.onTriggerLeave(), p.current = !1;
        }),
        onPointerDown: et(i.onPointerDown, () => {
          f.open && f.onClose(), x.current = !0, document.addEventListener("pointerup", S, { once: !0 });
        }),
        onFocus: et(i.onFocus, () => {
          x.current || f.onOpen();
        }),
        onBlur: et(i.onBlur, f.onClose),
        onClick: et(i.onClick, f.onClose)
      }
    ) });
  }, "TooltipTrigger")
), Vx = "TooltipPortal", [Rz, _z] = vm(Vx, {
  forceMount: void 0
}), Tz = /* @__PURE__ */ wt((n) => {
  const { __scopeTooltip: i, forceMount: o, children: r, container: c } = n, f = yr(Vx, i);
  return /* @__PURE__ */ b.jsx(Rz, { scope: i, forceMount: o, children: /* @__PURE__ */ b.jsx(no, { present: o || f.open, children: /* @__PURE__ */ b.jsx(SS, { asChild: !0, container: c, children: r }) }) });
}, "TooltipPortal"), hr = "TooltipContent", Az = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ wt(function(i, o) {
    const r = _z(hr, i.__scopeTooltip), { forceMount: c = r.forceMount, side: f = "top", ...d } = i, g = yr(hr, i.__scopeTooltip);
    return /* @__PURE__ */ b.jsx(no, { present: c || g.open, children: g.disableHoverableContent ? /* @__PURE__ */ b.jsx(Gx, { side: f, ...d, ref: o }) : /* @__PURE__ */ b.jsx(zz, { side: f, ...d, ref: o }) });
  }, "TooltipContent")
), zz = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ wt(function(i, o) {
  const r = yr(hr, i.__scopeTooltip), c = bm(hr, i.__scopeTooltip), f = v.useRef(null), d = Ht(o, f), [g, h] = v.useState(null), { trigger: y, onClose: x } = r, p = f.current, { onPointerInTransitChange: S } = c, C = v.useCallback(() => {
    h(null), S(!1);
  }, [S]), R = v.useCallback(
    (_, T) => {
      const O = _.currentTarget, D = { x: _.clientX, y: _.clientY }, U = kx(D, O.getBoundingClientRect()), P = Bx(D, U), Q = qx(T.getBoundingClientRect()), B = Ix([...P, ...Q]);
      h(B), S(!0);
    },
    [S]
  );
  return v.useEffect(() => () => C(), [C]), v.useEffect(() => {
    if (y && p) {
      const _ = /* @__PURE__ */ wt((O) => R(O, p), "handleTriggerLeave"), T = /* @__PURE__ */ wt((O) => R(O, y), "handleContentLeave");
      return y.addEventListener("pointerleave", _), p.addEventListener("pointerleave", T), () => {
        y.removeEventListener("pointerleave", _), p.removeEventListener("pointerleave", T);
      };
    }
  }, [y, p, R, C]), v.useEffect(() => {
    if (g) {
      const _ = /* @__PURE__ */ wt((T) => {
        const O = T.target, D = { x: T.clientX, y: T.clientY }, U = y?.contains(O) || p?.contains(O), P = !Px(D, g);
        U ? C() : P && (C(), x());
      }, "handleTrackPointerGrace");
      return document.addEventListener("pointermove", _), () => document.removeEventListener("pointermove", _);
    }
  }, [y, p, g, x, C]), /* @__PURE__ */ b.jsx(Gx, { ...i, ref: d });
}, "TooltipContentHoverable")), Oz = /* @__PURE__ */ cb("TooltipContent"), Gx = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ wt(function(i, o) {
    const {
      __scopeTooltip: r,
      children: c,
      "aria-label": f,
      id: d,
      onEscapeKeyDown: g,
      onPointerDownOutside: h,
      ...y
    } = i, x = yr(hr, r), p = ym(r), { onClose: S } = x;
    v.useEffect(() => (document.addEventListener(zg, S), () => document.removeEventListener(zg, S)), [S]), v.useEffect(() => {
      if (x.trigger) {
        const R = /* @__PURE__ */ wt((_) => {
          _.target instanceof Node && _.target.contains(x.trigger) && S();
        }, "handleScroll");
        return window.addEventListener("scroll", R, { capture: !0 }), () => window.removeEventListener("scroll", R, { capture: !0 });
      }
    }, [x.trigger, S]);
    const { setContentId: C } = x;
    return Xt(() => (C(d), () => {
      C(void 0);
    }), [d, C]), /* @__PURE__ */ b.jsx(
      cS,
      {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: g,
        onPointerDownOutside: h,
        onFocusOutside: (R) => R.preventDefault(),
        onDismiss: S,
        children: /* @__PURE__ */ b.jsxs(
          fz,
          {
            "data-state": x.stateAttribute,
            role: f ? void 0 : "tooltip",
            id: f ? void 0 : x.contentId,
            ...p,
            ...y,
            ref: o,
            style: {
              ...y.style,
              "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
              "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
              "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
            },
            children: [
              /* @__PURE__ */ b.jsx(Oz, { children: c }),
              f ? /* @__PURE__ */ b.jsx(pz, { id: x.contentId, role: "tooltip", children: f }) : null
            ]
          }
        )
      }
    );
  }, "TooltipContentImpl")
);
function kx(n, i) {
  const o = Math.abs(i.top - n.y), r = Math.abs(i.bottom - n.y), c = Math.abs(i.right - n.x), f = Math.abs(i.left - n.x);
  switch (Math.min(o, r, c, f)) {
    case f:
      return "left";
    case c:
      return "right";
    case o:
      return "top";
    case r:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
wt(kx, "getExitSideFromRect");
function Bx(n, i, o = 5) {
  const r = [];
  switch (i) {
    case "top":
      r.push(
        { x: n.x - o, y: n.y + o },
        { x: n.x + o, y: n.y + o }
      );
      break;
    case "bottom":
      r.push(
        { x: n.x - o, y: n.y - o },
        { x: n.x + o, y: n.y - o }
      );
      break;
    case "left":
      r.push(
        { x: n.x + o, y: n.y - o },
        { x: n.x + o, y: n.y + o }
      );
      break;
    case "right":
      r.push(
        { x: n.x - o, y: n.y - o },
        { x: n.x - o, y: n.y + o }
      );
      break;
  }
  return r;
}
wt(Bx, "getPaddedExitPoints");
function qx(n) {
  const { top: i, right: o, bottom: r, left: c } = n;
  return [
    { x: c, y: i },
    { x: o, y: i },
    { x: o, y: r },
    { x: c, y: r }
  ];
}
wt(qx, "getPointsFromRect");
function Px(n, i) {
  const { x: o, y: r } = n;
  let c = !1;
  for (let f = 0, d = i.length - 1; f < i.length; d = f++) {
    const g = i[f], h = i[d], y = g.x, x = g.y, p = h.x, S = h.y;
    x > r != S > r && o < (p - y) * (r - x) / (S - x) + y && (c = !c);
  }
  return c;
}
wt(Px, "isPointInPolygon");
function Ix(n) {
  const i = n.slice();
  return i.sort((o, r) => o.x < r.x ? -1 : o.x > r.x ? 1 : o.y < r.y ? -1 : o.y > r.y ? 1 : 0), $x(i);
}
wt(Ix, "getHull");
function $x(n) {
  if (n.length <= 1) return n.slice();
  const i = [];
  for (let r = 0; r < n.length; r++) {
    const c = n[r];
    for (; i.length >= 2; ) {
      const f = i[i.length - 1], d = i[i.length - 2];
      if ((f.x - d.x) * (c.y - d.y) >= (f.y - d.y) * (c.x - d.x)) i.pop();
      else break;
    }
    i.push(c);
  }
  i.pop();
  const o = [];
  for (let r = n.length - 1; r >= 0; r--) {
    const c = n[r];
    for (; o.length >= 2; ) {
      const f = o[o.length - 1], d = o[o.length - 2];
      if ((f.x - d.x) * (c.y - d.y) >= (f.y - d.y) * (c.x - d.x)) o.pop();
      else break;
    }
    o.push(c);
  }
  return o.pop(), i.length === 1 && o.length === 1 && i[0].x === o[0].x && i[0].y === o[0].y ? i : i.concat(o);
}
wt($x, "getHullPresorted");
var Mz = xz, Nz = wz, Dz = Ez, jz = Tz, Yx = Az;
const Hz = Mz, Lz = Nz, Uz = Dz, Fx = v.forwardRef(({ className: n, sideOffset: i = 4, ...o }, r) => /* @__PURE__ */ b.jsx(jz, { children: /* @__PURE__ */ b.jsx(
  Yx,
  {
    ref: r,
    sideOffset: i,
    className: Fe(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
      n
    ),
    ...o
  }
) }));
Fx.displayName = Yx.displayName;
const kt = (n) => n.symbol || n.name || n.id, Cn = (n) => String(
  n == null || n === "" ? "Unknown" : n
).replaceAll("_", " "), bl = (n) => n.type === "rna" ? { mrna: "mRNA", mirna: "miRNA", lncrna: "lncRNA" }[n.rna_type || ""] || "RNA" : n.type.replace(/^(intracellular|extracellular)_/, "");
function Sm(n) {
  const i = n.evidence || [];
  return {
    reviewed: i.some(
      (o) => o.curator_status === "reviewed" && ["source_checked_quote", "source_checked_paraphrase"].includes(
        o.passage_status || ""
      )
    ),
    pending: i.some(
      (o) => !["reviewed", "quarantined"].includes(o.curator_status || "")
    ) || !i.length && n.status !== "quarantined",
    quarantined: n.status === "quarantined" || i.some((o) => o.curator_status === "quarantined"),
    eligible: n.evidence_eligible === !0
  };
}
function ls(n) {
  const i = Sm(n), o = ["reviewed", "pending", "quarantined"].filter(
    (r) => i[r]
  );
  return o.length > 1 ? "Mixed" : o[0] ? o[0][0].toUpperCase() + o[0].slice(1) : "Unknown";
}
function Vz(n, i) {
  return i === "all" || Sm(n)[i] === !0;
}
function Wd(n, i) {
  return n.nodes.find(
    (o) => o.id === i || o.legacy_ids?.includes(i || "")
  );
}
function ps(n) {
  const i = n.structure_candidates || {}, o = [];
  return /^(intracellular|extracellular)_compound$/.test(n.type) && /^assets\/structures\/chebi_\d+\.sdf$/.test(i.small_molecule?.sdf_url || "") && o.push({
    id: i.small_molecule.registry_id,
    kind: "sdf",
    label: "Computed conformer",
    url: i.small_molecule.source_url,
    metadata: i.small_molecule
  }), n.type !== "protein" || (/^(?:[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9](?:[A-Z][A-Z0-9]{2}[0-9]){1,2})$/.test(
    i.uniprot_id || ""
  ) && o.push({
    id: i.uniprot_id,
    kind: "alphafold",
    label: `AlphaFold · ${i.uniprot_id}`,
    url: `https://alphafold.ebi.ac.uk/entry/${i.uniprot_id}`
  }), [
    ...new Set(
      [...i.pdb_structures || [], i.primary_pdb].filter(
        (r) => /^[1-9][a-zA-Z0-9]{3}$/.test(r || "")
      )
    )
  ].forEach(
    (r) => o.push({
      id: r,
      kind: "pdb",
      label: `PDB · ${r}`,
      url: `https://www.rcsb.org/structure/${r}`
    })
  )), o;
}
function Mg(n) {
  const i = n.roles?.includes("enzyme") ? "enzyme" : n.roles?.includes("transcription_factor") ? "tf" : bl(n).toLowerCase();
  return {
    protein: ["#47ad85", "#edf7f1"],
    enzyme: ["#e76560", "#fcefed"],
    tf: ["#247f99", "#edf5f8"],
    gene: ["#bb8139", "#fbf2e7"],
    mrna: ["#d2a019", "#fff8e3"],
    mirna: ["#d2a019", "#fff8e3"],
    lncrna: ["#d2a019", "#fff8e3"],
    compound: ["#c79b22", "#f9f5e5"],
    reaction: ["#5b929e", "#eff5f5"],
    pathway: ["#478d70", "#eef5ed"]
  }[i] || ["#718596", "#edf2f5"];
}
function Ng(n) {
  try {
    const i = new URL(String(n));
    return i.protocol === "https:" ? i.href : void 0;
  } catch {
    return;
  }
}
function Zn({
  label: n,
  children: i,
  onClick: o,
  active: r,
  disabled: c
}) {
  return /* @__PURE__ */ b.jsxs(Lz, { children: [
    /* @__PURE__ */ b.jsx(Uz, { asChild: !0, children: /* @__PURE__ */ b.jsx(
      wn,
      {
        size: "icon",
        variant: r ? "secondary" : "ghost",
        "aria-label": n,
        "aria-pressed": r,
        onClick: o,
        disabled: c,
        children: i
      }
    ) }),
    /* @__PURE__ */ b.jsx(Fx, { children: n })
  ] });
}
function Xx({
  children: n,
  label: i
}) {
  return /* @__PURE__ */ b.jsx("div", { className: "workbench-toolbar", role: "group", "aria-label": i, children: n });
}
const ir = /* @__PURE__ */ new Map();
function Gz({
  nodes: n,
  edges: i,
  root: o,
  selected: r,
  onSelect: c,
  onExplore: f,
  onEdge: d,
  selectedEdge: g,
  layoutKey: h
}) {
  const y = v.useRef(null), x = v.useRef(null), p = v.useRef(null), S = v.useRef(!1), [C, R] = v.useState({ w: 0, h: 0 }), [_, T] = v.useState({ x: 400, y: 300, k: 1 }), [O, D] = v.useState({}), [U, P] = v.useState(1), Q = v.useRef(_);
  Q.current = _;
  const B = v.useMemo(
    () => new Map(n.map((M) => [M.id, kt(M)])),
    [n]
  ), H = v.useMemo(() => {
    const M = /* @__PURE__ */ new Map();
    for (const A of i) {
      const j = JSON.stringify([A.source, A.target]), V = M.get(j) || [];
      V.push(A), M.set(j, V);
    }
    const E = /* @__PURE__ */ new Map();
    for (const A of M.values())
      A.forEach(
        (j, V) => E.set(j.edge_id, (V - (A.length - 1) / 2) * 34)
      );
    return E;
  }, [i]), $ = n.map((M) => M.id).join("|"), [ae, K] = v.useState({}), [se, oe] = v.useState(!1), [he, ge] = v.useState("selected"), de = v.useMemo(
    () => n.length > 30 && he === "selected" ? i.filter(
      (M) => M.source === r || M.target === r || M.edge_id === g
    ) : i,
    [n.length, i, he, r, g]
  );
  v.useEffect(() => {
    const M = `${$}:${h}:${U}`;
    let E = !1;
    function A(F) {
      E || (ir.size >= 12 && ir.delete(ir.keys().next().value), ir.set(M, F), K(F), oe(!1));
    }
    const j = ir.get(M);
    if (j) {
      K(j), oe(!1);
      return;
    }
    if (n.length < 18 && n.some((F) => F.id === o)) {
      const F = n.filter((ue) => ue.id !== o);
      A(
        Object.fromEntries(
          n.map((ue) => {
            const re = F.findIndex((Qe) => Qe.id === ue.id), ce = re * Math.PI * 2 / Math.max(1, F.length) - Math.PI / 2, Ee = Math.max(245, F.length * 38) * U / 1.5;
            return [
              ue.id,
              {
                id: ue.id,
                x: re < 0 ? 0 : Math.cos(ce) * Ee,
                y: re < 0 ? 0 : Math.sin(ce) * Ee * 0.8
              }
            ];
          })
        )
      );
      return;
    }
    oe(!0), D({});
    let V;
    const te = () => {
      const F = Math.max(1, Math.ceil(Math.sqrt(n.length * 1.5)));
      A(
        Object.fromEntries(
          n.map((ue, re) => [
            ue.id,
            {
              id: ue.id,
              x: re % F * 260 * U,
              y: Math.floor(re / F) * 120 * U
            }
          ])
        )
      );
    };
    try {
      V = new Worker(
        new URL(
          /* @vite-ignore */
          "" + new URL("assets/graph-layout.worker-dhay3Raq.js", import.meta.url).href,
          import.meta.url
        ),
        { type: "module" }
      ), V.onmessage = (F) => {
        A(F.data), V?.terminate();
      }, V.onerror = () => {
        V?.terminate(), te();
      }, V.postMessage({
        ids: n.map((F) => F.id),
        edges: i.map((F) => ({ source: F.source, target: F.target })),
        spacing: U
      });
    } catch {
      te();
    }
    return () => {
      E = !0, V?.terminate();
    };
  }, [$, h, U]), v.useEffect(() => D(ae), [ae]), v.useLayoutEffect(() => {
    const M = y.current, E = new ResizeObserver(
      ([A]) => R({ w: A.contentRect.width, h: A.contentRect.height })
    );
    return E.observe(M), () => E.disconnect();
  }, []);
  const Z = () => {
    const M = Object.values(O);
    if (!M.length) return;
    const E = Math.min(...M.map((F) => F.x)) - 115, A = Math.max(...M.map((F) => F.x)) + 115, j = Math.min(...M.map((F) => F.y)) - 55, V = Math.max(...M.map((F) => F.y)) + 55, te = Math.min(
      1.15,
      (C.w - 60) / (A - E),
      (C.h - 125) / (V - j)
    );
    T({
      k: te,
      x: C.w / 2 - (E + A) * te / 2,
      y: (C.h - 60) / 2 - (j + V) * te / 2
    });
  }, le = v.useRef(null);
  v.useEffect(() => {
    if (C.w < 1 || C.h < 1) return;
    const M = le.current;
    if (!M || M.layout !== ae) {
      const E = Object.values(ae);
      if (!E.length) return;
      const A = Math.min(...E.map((ue) => ue.x)) - 115, j = Math.max(...E.map((ue) => ue.x)) + 115, V = Math.min(...E.map((ue) => ue.y)) - 55, te = Math.max(...E.map((ue) => ue.y)) + 55, F = Math.min(
        1.1,
        (C.w - 50) / (j - A),
        (C.h - 125) / (te - V)
      );
      T({
        k: F,
        x: C.w / 2 - (A + j) * F / 2,
        y: (C.h - 60) / 2 - (V + te) * F / 2
      });
    } else
      T((E) => ({
        ...E,
        x: E.x + (C.w - M.w) / 2,
        y: E.y + (C.h - M.h) / 2
      }));
    le.current = { layout: ae, w: C.w, h: C.h };
  }, [ae, C]);
  function ie(M, E = C.w / 2, A = C.h / 2) {
    T((j) => {
      const V = Math.max(5e-3, Math.min(3, j.k * M));
      return { k: V, x: E - (E - j.x) * V / j.k, y: A - (A - j.y) * V / j.k };
    });
  }
  v.useEffect(() => {
    const M = y.current, E = (A) => {
      A.preventDefault();
      const j = M.getBoundingClientRect();
      ie(A.deltaY < 0 ? 1.1 : 1 / 1.1, A.clientX - j.left, A.clientY - j.top);
    };
    return M.addEventListener("wheel", E, { passive: !1 }), () => M.removeEventListener("wheel", E);
  }, []);
  function me(M, E) {
    M.button === 0 && (M.stopPropagation(), S.current = !1, p.current = {
      id: E,
      x: M.clientX,
      y: M.clientY,
      c: Q.current,
      p: E ? O[E] : null
    }, x.current?.setPointerCapture(M.pointerId));
  }
  function ne(M, E) {
    const A = O[M.source], j = O[M.target];
    if (!A || !j) return "";
    if (A === j)
      return `M${A.x + 100},${A.y} C${A.x + 170},${A.y - 120} ${A.x - 70},${A.y - 110} ${A.x},${A.y - 31}`;
    const V = j.x - A.x, te = j.y - A.y, F = Math.min(
      0.45,
      106 / (Math.abs(V) || 1e-3),
      36 / (Math.abs(te) || 1e-3)
    ), ue = H.get(M.edge_id) || 0, re = Math.hypot(V, te) || 1;
    return `M${A.x + V * F},${A.y + te * F} Q${(A.x + j.x) / 2 - te / re * ue},${(A.y + j.y) / 2 + V / re * ue} ${j.x - V * F},${j.y - te * F}`;
  }
  function ze() {
    if (!x.current) return;
    const M = x.current.cloneNode(!0);
    M.setAttribute("xmlns", "http://www.w3.org/2000/svg"), M.setAttribute("width", String(C.w)), M.setAttribute("height", String(C.h));
    const E = URL.createObjectURL(
      new Blob([new XMLSerializer().serializeToString(M)], {
        type: "image/svg+xml"
      })
    ), A = document.createElement("a");
    A.href = E, A.download = "osteoclast-graph.svg", A.click(), setTimeout(() => URL.revokeObjectURL(E), 1e3);
  }
  const W = v.useMemo(
    () => /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
      de.map((M, E) => {
        const A = ne(M), j = Sm(M), V = M.sign === 1 ? "#549984" : M.sign === -1 ? "#dd7772" : "#939e98", te = M.sign === 1 ? "positive" : M.sign === -1 ? "negative" : "unknown";
        return /* @__PURE__ */ b.jsxs(
          "g",
          {
            role: "button",
            tabIndex: 0,
            "aria-label": `${M.relation}: ${B.get(M.source)} to ${B.get(M.target)}`,
            onClick: () => d(M),
            onKeyDown: (F) => {
              (F.key === "Enter" || F.key === " ") && (F.preventDefault(), d(M));
            },
            onPointerDown: (F) => F.stopPropagation(),
            children: [
              /* @__PURE__ */ b.jsx(
                "path",
                {
                  d: A,
                  fill: "none",
                  stroke: "transparent",
                  strokeWidth: 10,
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              /* @__PURE__ */ b.jsx(
                "path",
                {
                  d: A,
                  fill: "none",
                  stroke: g === M.edge_id ? "#217e98" : V,
                  strokeWidth: g === M.edge_id ? 3 : 1.3,
                  opacity: 0.7,
                  vectorEffect: "non-scaling-stroke",
                  strokeDasharray: M.status === "quarantined" ? "2 5" : j.reviewed ? void 0 : "6 4",
                  markerEnd: `url(#arrow-${te})`
                }
              ),
              /* @__PURE__ */ b.jsx("title", { children: M.relation })
            ]
          },
          M.edge_id
        );
      }),
      n.map((M) => {
        const E = O[M.id];
        if (!E) return null;
        const [A, j] = Mg(M), V = kt(M), te = V.lastIndexOf(" ", 23), F = V.length > 24 ? te > 9 ? te : 23 : V.length, ue = V.slice(0, F), re = V.slice(F).trim();
        return /* @__PURE__ */ b.jsxs(
          "g",
          {
            className: "graph-node",
            role: "button",
            tabIndex: 0,
            "aria-label": `Inspect ${V}`,
            transform: `translate(${E.x},${E.y})`,
            onPointerDown: (ce) => me(ce, M.id),
            onClick: () => {
              S.current || c(M);
            },
            onDoubleClick: () => f(M),
            onKeyDown: (ce) => {
              ce.key === "Enter" ? ce.shiftKey ? f(M) : c(M) : ce.key.startsWith("Arrow") && (ce.preventDefault(), D((Ee) => ({
                ...Ee,
                [M.id]: {
                  ...E,
                  x: E.x + (ce.key === "ArrowRight" ? 20 : ce.key === "ArrowLeft" ? -20 : 0),
                  y: E.y + (ce.key === "ArrowDown" ? 20 : ce.key === "ArrowUp" ? -20 : 0)
                }
              })));
            },
            children: [
              /* @__PURE__ */ b.jsx(
                "rect",
                {
                  x: "-100",
                  y: "-31",
                  width: "200",
                  height: "62",
                  rx: "8",
                  fill: M.id === r ? "#eef1cf" : j,
                  stroke: M.id === r ? "#7d942d" : "#d6d7c3",
                  strokeWidth: M.id === r ? 2 : 1
                }
              ),
              /* @__PURE__ */ b.jsx("rect", { x: "-87", y: "-14", width: "7", height: "7", fill: A }),
              /* @__PURE__ */ b.jsx(
                "text",
                {
                  x: "-73",
                  y: V.length > 24 ? -12 : -7,
                  fontFamily: "DM Sans Variable,Segoe UI,sans-serif",
                  fontSize: "13",
                  fontWeight: "600",
                  fill: "#253b30",
                  children: ue
                }
              ),
              V.length > 24 && /* @__PURE__ */ b.jsx(
                "text",
                {
                  x: "-86",
                  y: "3",
                  fontFamily: "DM Sans Variable,Segoe UI,sans-serif",
                  fontSize: "11",
                  fill: "#253b30",
                  children: re.length > 28 ? re.slice(0, 27) + "…" : re
                }
              ),
              /* @__PURE__ */ b.jsxs(
                "text",
                {
                  x: "-86",
                  y: V.length > 24 ? 21 : 15,
                  fontFamily: "DM Sans Variable,Segoe UI,sans-serif",
                  fontSize: "10",
                  fill: "#65766c",
                  children: [
                    bl(M),
                    M.taxon ? " · " + M.taxon : ""
                  ]
                }
              ),
              /* @__PURE__ */ b.jsxs("title", { children: [
                M.name,
                " · ",
                bl(M),
                " · ",
                M.taxon || "unknown"
              ] })
            ]
          },
          M.id
        );
      })
    ] }),
    [
      n,
      de,
      O,
      r,
      g,
      c,
      f,
      d,
      H,
      B
    ]
  );
  return /* @__PURE__ */ b.jsxs("div", { className: "graph-canvas", ref: y, children: [
    /* @__PURE__ */ b.jsxs(
      "svg",
      {
        ref: x,
        "aria-label": "Biological relationship graph",
        onPointerDown: (M) => me(M),
        onPointerMove: (M) => {
          const E = p.current;
          if (!E) return;
          const A = M.clientX - E.x, j = M.clientY - E.y;
          Math.hypot(A, j) > 3 && (S.current = !0), E.id ? D((V) => ({
            ...V,
            [E.id]: {
              ...V[E.id],
              x: E.p.x + A / _.k,
              y: E.p.y + j / _.k
            }
          })) : T({ ...E.c, x: E.c.x + A, y: E.c.y + j });
        },
        onPointerUp: () => p.current = null,
        onPointerCancel: () => p.current = null,
        children: [
          /* @__PURE__ */ b.jsx("defs", { children: [
            ["positive", "#549984"],
            ["negative", "#dd7772"],
            ["unknown", "#939e98"]
          ].map(([M, E]) => /* @__PURE__ */ b.jsx(
            "marker",
            {
              id: `arrow-${M}`,
              viewBox: "0 0 10 10",
              refX: "9",
              refY: "5",
              markerWidth: "7",
              markerHeight: "7",
              orient: "auto",
              children: /* @__PURE__ */ b.jsx(
                "path",
                {
                  d: M === "negative" ? "M8 0 L8 10" : "M0 0 L9 5 L0 10",
                  fill: "none",
                  stroke: E,
                  strokeWidth: "1.5"
                }
              )
            },
            M
          )) }),
          /* @__PURE__ */ b.jsx("g", { transform: `translate(${_.x},${_.y}) scale(${_.k})`, children: W })
        ]
      }
    ),
    !n.length && /* @__PURE__ */ b.jsx("div", { className: "empty-state", children: "No entities match these filters." }),
    se && /* @__PURE__ */ b.jsx("div", { className: "layout-status", role: "status", children: "Arranging network…" }),
    n.length > 18 && /* @__PURE__ */ b.jsxs("div", { className: "graph-display-controls", children: [
      n.length > 30 && /* @__PURE__ */ b.jsxs("label", { children: [
        "Connections",
        /* @__PURE__ */ b.jsxs(
          "select",
          {
            "aria-label": "Connection display",
            value: he,
            onChange: (M) => ge(M.target.value),
            children: [
              /* @__PURE__ */ b.jsx("option", { value: "selected", children: "Selected entity" }),
              /* @__PURE__ */ b.jsx("option", { value: "all", children: "All relationships" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ b.jsxs("label", { className: "graph-spacing", children: [
        "Spacing",
        /* @__PURE__ */ b.jsxs(
          "select",
          {
            "aria-label": "Graph spacing",
            value: U,
            onChange: (M) => P(Number(M.target.value)),
            children: [
              /* @__PURE__ */ b.jsx("option", { value: 1, children: "Standard" }),
              /* @__PURE__ */ b.jsx("option", { value: 1.5, children: "Relaxed" }),
              /* @__PURE__ */ b.jsx("option", { value: 2, children: "Spacious" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ b.jsx("div", { className: "canvas-tools", children: /* @__PURE__ */ b.jsxs(Xx, { label: "Graph tools", children: [
      /* @__PURE__ */ b.jsx(Zn, { label: "Zoom out", onClick: () => ie(0.8), children: /* @__PURE__ */ b.jsx(FE, {}) }),
      /* @__PURE__ */ b.jsxs("span", { className: "zoom-value", children: [
        Math.round(_.k * 100),
        "%"
      ] }),
      /* @__PURE__ */ b.jsx(Zn, { label: "Zoom in", onClick: () => ie(1.25), children: /* @__PURE__ */ b.jsx(YE, {}) }),
      /* @__PURE__ */ b.jsx("span", { className: "tool-divider" }),
      /* @__PURE__ */ b.jsx(Zn, { label: "Fit graph", onClick: Z, children: /* @__PURE__ */ b.jsx(GE, {}) }),
      /* @__PURE__ */ b.jsx(
        Zn,
        {
          label: "Focus selected entity",
          onClick: () => {
            const M = O[r];
            M && T({ k: 1, x: C.w / 2 - M.x, y: C.h / 2 - M.y });
          },
          children: /* @__PURE__ */ b.jsx(LE, {})
        }
      ),
      /* @__PURE__ */ b.jsx(Zn, { label: "Export graph SVG", onClick: ze, children: /* @__PURE__ */ b.jsx(rb, {}) })
    ] }) }),
    /* @__PURE__ */ b.jsxs("div", { className: "canvas-caption", children: [
      n.length,
      " entities ",
      /* @__PURE__ */ b.jsx("span", { children: "·" }),
      " ",
      i.length,
      " relationships",
      de.length !== i.length && /* @__PURE__ */ b.jsxs("span", { children: [
        "· ",
        de.length,
        " shown"
      ] })
    ] })
  ] });
}
var kz = Object.defineProperty, Bz = (n, i) => kz(n, "name", { value: i, configurable: !0 }), qz = "Toggle", Qx = /* @__PURE__ */ v.forwardRef(
  /* @__PURE__ */ Bz(function(i, o) {
    const { pressed: r, defaultPressed: c, onPressedChange: f, ...d } = i, [g, h] = ga({
      prop: r,
      onChange: f,
      defaultProp: c ?? !1,
      caller: qz
    });
    return /* @__PURE__ */ b.jsx(
      Ye.button,
      {
        type: "button",
        "aria-pressed": g,
        "data-state": g ? "on" : "off",
        "data-disabled": i.disabled ? "" : void 0,
        ...d,
        ref: o,
        onClick: et(i.onClick, () => {
          i.disabled || h(!g);
        })
      }
    );
  }, "Toggle")
), Zx = Qx, Pz = Object.defineProperty, ca = (n, i) => Pz(n, "name", { value: i, configurable: !0 }), oo = "ToggleGroup", [Kx, WO] = /* @__PURE__ */ Rl(oo, [
  Ts
]), Jx = Ts(), Wx = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ ca(function(i, o) {
  const { type: r, ...c } = i;
  if (r === "single") {
    const f = c;
    return /* @__PURE__ */ b.jsx(Iz, { role: "radiogroup", ...f, ref: o });
  }
  if (r === "multiple") {
    const f = c;
    return /* @__PURE__ */ b.jsx($z, { role: "toolbar", ...f, ref: o });
  }
  throw new Error(`Missing prop \`type\` expected on \`${oo}\``);
}, "ToggleGroup")), [e1, t1] = Kx(oo), Iz = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ ca(function(i, o) {
  const {
    value: r,
    defaultValue: c,
    onValueChange: f = /* @__PURE__ */ ca(() => {
    }, "onValueChange"),
    ...d
  } = i, [g, h] = ga({
    prop: r,
    defaultProp: c ?? "",
    onChange: f,
    caller: oo
  });
  return /* @__PURE__ */ b.jsx(
    e1,
    {
      scope: i.__scopeToggleGroup,
      type: "single",
      value: v.useMemo(() => g ? [g] : [], [g]),
      onItemActivate: h,
      onItemDeactivate: v.useCallback(() => h(""), [h]),
      children: /* @__PURE__ */ b.jsx(n1, { ...d, ref: o })
    }
  );
}, "ToggleGroupImplSingle")), $z = /* @__PURE__ */ v.forwardRef(/* @__PURE__ */ ca(function(i, o) {
  const {
    value: r,
    defaultValue: c,
    onValueChange: f = /* @__PURE__ */ ca(() => {
    }, "onValueChange"),
    ...d
  } = i, [g, h] = ga({
    prop: r,
    defaultProp: c ?? [],
    onChange: f,
    caller: oo
  }), y = v.useCallback(
    (p) => h((S = []) => [...S, p]),
    [h]
  ), x = v.useCallback(
    (p) => h((S = []) => S.filter((C) => C !== p)),
    [h]
  );
  return /* @__PURE__ */ b.jsx(
    e1,
    {
      scope: i.__scopeToggleGroup,
      type: "multiple",
      value: g,
      onItemActivate: y,
      onItemDeactivate: x,
      children: /* @__PURE__ */ b.jsx(n1, { ...d, ref: o })
    }
  );
}, "ToggleGroupImplMultiple")), [Yz, Fz] = Kx(oo), n1 = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ca(function(i, o) {
    const {
      __scopeToggleGroup: r,
      disabled: c = !1,
      rovingFocus: f = !0,
      orientation: d,
      dir: g,
      loop: h = !0,
      ...y
    } = i, x = Jx(r), p = Rs(g), S = { dir: p, ...y };
    return /* @__PURE__ */ b.jsx(Yz, { scope: r, rovingFocus: f, disabled: c, children: f ? /* @__PURE__ */ b.jsx(
      Wb,
      {
        asChild: !0,
        ...x,
        orientation: d,
        dir: p,
        loop: h,
        children: /* @__PURE__ */ b.jsx(Ye.div, { ...S, ref: o })
      }
    ) : /* @__PURE__ */ b.jsx(Ye.div, { ...S, ref: o }) });
  }, "ToggleGroupImpl")
), Dg = "ToggleGroupItem", l1 = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ca(function(i, o) {
    const r = t1(Dg, i.__scopeToggleGroup), c = Fz(Dg, i.__scopeToggleGroup), f = Jx(i.__scopeToggleGroup), d = r.value.includes(i.value), g = c.disabled || i.disabled, h = { ...i, pressed: d, disabled: g }, y = v.useRef(null);
    return c.rovingFocus ? /* @__PURE__ */ b.jsx(
      eS,
      {
        asChild: !0,
        ...f,
        focusable: !g,
        active: d,
        ref: y,
        children: /* @__PURE__ */ b.jsx(W0, { ...h, ref: o })
      }
    ) : /* @__PURE__ */ b.jsx(W0, { ...h, ref: o });
  }, "ToggleGroupItem")
), W0 = /* @__PURE__ */ v.forwardRef(
  // blank line to reduce diff noise
  /* @__PURE__ */ ca(function(i, o) {
    const { __scopeToggleGroup: r, value: c, ...f } = i, d = t1(Dg, r), g = { role: "radio", "aria-checked": i.pressed, "aria-pressed": void 0 }, h = d.type === "single" ? g : void 0;
    return /* @__PURE__ */ b.jsx(
      Qx,
      {
        ...h,
        ...f,
        ref: o,
        onPressedChange: (y) => {
          y ? d.onItemActivate(c) : d.onItemDeactivate(c);
        }
      }
    );
  }, "ToggleGroupItemImpl")
);
const a1 = vb(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground"
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
), Xz = v.forwardRef(({ className: n, variant: i, size: o, ...r }, c) => /* @__PURE__ */ b.jsx(
  Zx,
  {
    ref: c,
    className: Fe(a1({ variant: i, size: o, className: n })),
    ...r
  }
));
Xz.displayName = Zx.displayName;
const i1 = v.createContext({
  size: "default",
  variant: "default"
}), o1 = v.forwardRef(({ className: n, variant: i, size: o, children: r, ...c }, f) => /* @__PURE__ */ b.jsx(
  Wx,
  {
    ref: f,
    className: Fe("flex items-center justify-center gap-1", n),
    ...c,
    children: /* @__PURE__ */ b.jsx(i1.Provider, { value: { variant: i, size: o }, children: r })
  }
));
o1.displayName = Wx.displayName;
const r1 = v.forwardRef(({ className: n, children: i, variant: o, size: r, ...c }, f) => {
  const d = v.useContext(i1);
  return /* @__PURE__ */ b.jsx(
    l1,
    {
      ref: f,
      className: Fe(
        a1({
          variant: d.variant || o,
          size: d.size || r
        }),
        n
      ),
      ...c,
      children: i
    }
  );
});
r1.displayName = l1.displayName;
let eb;
function Qz() {
  return window.$3Dmol ? Promise.resolve() : eb ??= new Promise((n, i) => {
    const o = document.createElement("script");
    o.src = "assets/vendor/3Dmol-min.js", o.onload = () => n(), o.onerror = () => {
      eb = void 0, o.remove(), i(new Error("3D renderer unavailable."));
    }, document.head.append(o);
  });
}
function Zz({
  entity: n,
  onMetadata: i
}) {
  const o = v.useRef(null), r = v.useRef(null), c = v.useRef(null), f = v.useRef(0), d = ps(n), [g, h] = v.useState(0), [y, x] = v.useState("idle"), [p, S] = v.useState(""), [C, R] = v.useState("cartoon"), [_, T] = v.useState("teal"), [O, D] = v.useState(!0), [U, P] = v.useState("all"), [Q, B] = v.useState([]), H = d[g];
  v.useEffect(() => {
    f.current++, c.current?.abort(), r.current?.removeAllSurfaces(), r.current?.clear(), h(0), x("idle"), S(""), P("all"), B([]), R(n.type.includes("compound") ? "sticks" : "cartoon"), T("teal"), i({});
  }, [n.id]), v.useEffect(() => {
    const K = new ResizeObserver(() => {
      r.current?.resize(), r.current?.render();
    });
    return K.observe(o.current), () => {
      K.disconnect(), f.current++, c.current?.abort(), r.current?.clear(), r.current = null;
    };
  }, []);
  function $() {
    const K = r.current;
    if (!K || y !== "ready") return;
    K.removeAllSurfaces(), K.setStyle({}, {});
    const se = U === "all" ? {} : { chain: U }, oe = _ === "confidence" && H?.kind === "alphafold" ? {
      colorscheme: {
        prop: "b",
        gradient: new window.$3Dmol.Gradient.RWB(50, 100)
      }
    } : _ === "chain" ? { colorscheme: "chain" } : { color: "#419b91" };
    C === "surface" ? (K.addSurface(
      window.$3Dmol.SurfaceType.VDW,
      { opacity: 0.85, ...oe },
      se
    ).then(() => K.render()), K.setStyle(se, { cartoon: oe })) : C === "sticks" ? K.setStyle(se, {
      stick: { radius: 0.17, colorscheme: "Jmol" },
      sphere: { scale: 0.22, colorscheme: "Jmol" }
    }) : K.setStyle(se, { cartoon: oe }), O && H?.kind !== "sdf" && K.setStyle(
      { ...se, hetflag: !0 },
      { stick: { radius: 0.17, colorscheme: "Jmol" } }
    ), K.render();
  }
  v.useEffect($, [C, _, O, U, y]);
  async function ae() {
    if (!H) return;
    c.current?.abort();
    const K = new AbortController();
    c.current = K;
    const se = ++f.current, oe = setTimeout(() => K.abort(), 25e3);
    x("loading"), S(""), r.current?.removeAllSurfaces(), r.current?.clear(), i({});
    try {
      await Qz();
      let he = H.kind === "sdf" ? H.metadata.sdf_url : `https://files.rcsb.org/download/${H.id}.pdb`, ge = "", de = "";
      if (H.kind === "alphafold") {
        const ze = await fetch(
          `https://alphafold.ebi.ac.uk/api/prediction/${H.id}`,
          { signal: K.signal }
        );
        if (!ze.ok) throw new Error("Model unavailable from AlphaFold.");
        const M = (await ze.json()).find(
          (A) => A.uniprotAccession === H.id
        );
        if (!M?.pdbUrl) throw new Error("No coordinates available.");
        const E = new URL(M.pdbUrl);
        if (E.protocol !== "https:" || E.hostname !== "alphafold.ebi.ac.uk")
          throw new Error("Unsupported coordinate source.");
        he = E.href, ge = M.organismScientificName || "", de = M.uniprotDescription || "";
      }
      const Z = await fetch(he, { signal: K.signal });
      if (!Z.ok) throw new Error("Coordinate download failed.");
      const le = await Z.text();
      if (se !== f.current) return;
      r.current || (r.current = window.$3Dmol.createViewer(o.current, {
        backgroundColor: "#faf6e9",
        antialias: !0
      }));
      const ie = r.current, me = ie.addModel(le, H.kind === "sdf" ? "sdf" : "pdb"), ne = me.selectedAtoms({});
      if (!ne.length) throw new Error("No atoms in the coordinate file.");
      B([
        ...new Set(ne.map((ze) => ze.chain).filter(Boolean))
      ]), ie.resize(), ie.zoomTo(), x("ready"), i({
        source: H.label,
        accession: H.id,
        origin: H.kind === "alphafold" ? "Predicted" : H.kind === "sdf" ? "Computed" : "Experimental",
        sourceSpecies: ge || "Unknown",
        description: de,
        atoms: ne.length,
        mapping: "Candidate",
        method: H.metadata?.method,
        confidence: H.kind === "alphafold" && ne.some((ze) => Number.isFinite(ze.b))
      });
    } catch (he) {
      se === f.current && (r.current?.clear(), x("error"), S(he.name === "AbortError" ? "Request timed out." : he.message));
    } finally {
      clearTimeout(oe);
    }
  }
  return /* @__PURE__ */ b.jsxs("div", { className: "structure-pane", children: [
    /* @__PURE__ */ b.jsxs("div", { className: "structure-controls", children: [
      /* @__PURE__ */ b.jsx("label", { className: "sr-only", htmlFor: "structure-source", children: "Structure source" }),
      /* @__PURE__ */ b.jsx(
        "select",
        {
          id: "structure-source",
          value: g,
          disabled: !d.length,
          onChange: (K) => {
            f.current++, c.current?.abort(), r.current?.removeAllSurfaces(), r.current?.clear(), h(Number(K.target.value)), x("idle"), T("teal"), P("all"), B([]), i({});
          },
          children: d.length ? d.map((K, se) => /* @__PURE__ */ b.jsx("option", { value: se, children: K.label }, K.id)) : /* @__PURE__ */ b.jsx("option", { children: "No structure" })
        }
      ),
      /* @__PURE__ */ b.jsxs(
        wn,
        {
          size: "sm",
          onClick: ae,
          disabled: !H || y === "loading",
          children: [
            y === "loading" ? /* @__PURE__ */ b.jsx(VE, { className: "spin" }) : null,
            y === "ready" ? "Reload" : "Load structure"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ b.jsxs("div", { className: "molecule-area", children: [
      /* @__PURE__ */ b.jsx("div", { className: "molecule-host", ref: o }),
      y !== "ready" && /* @__PURE__ */ b.jsxs("div", { className: "empty-state", children: [
        /* @__PURE__ */ b.jsx(rg, { size: 38 }),
        /* @__PURE__ */ b.jsx("strong", { children: y === "loading" ? "Loading structure" : y === "error" ? p : H ? "Structure ready to load" : "No structure available" }),
        y === "error" && /* @__PURE__ */ b.jsx(wn, { variant: "outline", size: "sm", onClick: ae, children: "Retry" })
      ] }),
      y === "ready" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
        /* @__PURE__ */ b.jsxs("div", { className: "molecule-options", children: [
          /* @__PURE__ */ b.jsx(
            o1,
            {
              type: "single",
              value: C,
              onValueChange: (K) => K && R(K),
              "aria-label": "Molecular representation",
              children: (H?.kind === "sdf" ? ["sticks", "surface"] : ["cartoon", "sticks", "surface"]).map((K) => /* @__PURE__ */ b.jsx(r1, { value: K, "aria-label": K, children: K[0].toUpperCase() + K.slice(1) }, K))
            }
          ),
          /* @__PURE__ */ b.jsxs(
            "select",
            {
              "aria-label": "Molecule color",
              value: _,
              onChange: (K) => T(K.target.value),
              children: [
                /* @__PURE__ */ b.jsx("option", { value: "teal", children: "Teal" }),
                /* @__PURE__ */ b.jsx("option", { value: "chain", children: "By chain" }),
                H?.kind === "alphafold" && /* @__PURE__ */ b.jsx("option", { value: "confidence", children: "Confidence" })
              ]
            }
          ),
          Q.length > 1 && /* @__PURE__ */ b.jsxs(
            "select",
            {
              "aria-label": "Chain",
              value: U,
              onChange: (K) => P(K.target.value),
              children: [
                /* @__PURE__ */ b.jsx("option", { value: "all", children: "All chains" }),
                Q.map((K) => /* @__PURE__ */ b.jsx("option", { children: K }, K))
              ]
            }
          ),
          H?.kind !== "sdf" && /* @__PURE__ */ b.jsxs("label", { className: "check-label", children: [
            /* @__PURE__ */ b.jsx(
              "input",
              {
                type: "checkbox",
                checked: O,
                onChange: (K) => D(K.target.checked)
              }
            ),
            "Ligands"
          ] })
        ] }),
        /* @__PURE__ */ b.jsx("div", { className: "canvas-tools", children: /* @__PURE__ */ b.jsxs(Xx, { label: "Structure tools", children: [
          /* @__PURE__ */ b.jsx(
            Zn,
            {
              label: "Reset structure view",
              onClick: () => {
                r.current.zoomTo(), r.current.render();
              },
              children: /* @__PURE__ */ b.jsx($E, {})
            }
          ),
          /* @__PURE__ */ b.jsx(
            Zn,
            {
              label: "Export structure PNG",
              onClick: () => {
                r.current.render();
                const K = document.createElement("a");
                K.href = r.current.pngURI(), K.download = `${H?.id}.png`, K.click();
              },
              children: /* @__PURE__ */ b.jsx(rb, {})
            }
          )
        ] }) }),
        _ === "confidence" && /* @__PURE__ */ b.jsxs("div", { className: "confidence-key", children: [
          "pLDDT ",
          /* @__PURE__ */ b.jsx("span", {}),
          "50–100"
        ] })
      ] })
    ] })
  ] });
}
function la(n, i) {
  return typeof n == "function" ? n(i) : n;
}
function dn(n, i) {
  return (o) => {
    i.setState((r) => ({
      ...r,
      [n]: la(o, r[n])
    }));
  };
}
function ks(n) {
  return n instanceof Function;
}
function Kz(n) {
  return Array.isArray(n) && n.every((i) => typeof i == "number");
}
function Jz(n, i) {
  const o = [], r = (c) => {
    c.forEach((f) => {
      o.push(f);
      const d = i(f);
      d != null && d.length && r(d);
    });
  };
  return r(n), o;
}
function Ce(n, i, o) {
  let r = [], c;
  return (f) => {
    let d;
    o.key && o.debug && (d = Date.now());
    const g = n(f);
    if (!(g.length !== r.length || g.some((x, p) => r[p] !== x)))
      return c;
    r = g;
    let y;
    if (o.key && o.debug && (y = Date.now()), c = i(...g), o == null || o.onChange == null || o.onChange(c), o.key && o.debug && o != null && o.debug()) {
      const x = Math.round((Date.now() - d) * 100) / 100, p = Math.round((Date.now() - y) * 100) / 100, S = p / 16, C = (R, _) => {
        for (R = String(R); R.length < _; )
          R = " " + R;
        return R;
      };
      console.info(`%c⏱ ${C(p, 5)} /${C(x, 5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * S, 120))}deg 100% 31%);`, o?.key);
    }
    return c;
  };
}
function we(n, i, o, r) {
  return {
    debug: () => {
      var c;
      return (c = n?.debugAll) != null ? c : n[i];
    },
    key: !1,
    onChange: r
  };
}
function Wz(n, i, o, r) {
  const c = () => {
    var d;
    return (d = f.getValue()) != null ? d : n.options.renderFallbackValue;
  }, f = {
    id: `${i.id}_${o.id}`,
    row: i,
    column: o,
    getValue: () => i.getValue(r),
    renderValue: c,
    getContext: Ce(() => [n, o, i, f], (d, g, h, y) => ({
      table: d,
      column: g,
      row: h,
      cell: y,
      getValue: y.getValue,
      renderValue: y.renderValue
    }), we(n.options, "debugCells"))
  };
  return n._features.forEach((d) => {
    d.createCell == null || d.createCell(f, o, i, n);
  }, {}), f;
}
function eO(n, i, o, r) {
  var c, f;
  const g = {
    ...n._getDefaultColumnDef(),
    ...i
  }, h = g.accessorKey;
  let y = (c = (f = g.id) != null ? f : h ? typeof String.prototype.replaceAll == "function" ? h.replaceAll(".", "_") : h.replace(/\./g, "_") : void 0) != null ? c : typeof g.header == "string" ? g.header : void 0, x;
  if (g.accessorFn ? x = g.accessorFn : h && (h.includes(".") ? x = (S) => {
    let C = S;
    for (const _ of h.split(".")) {
      var R;
      C = (R = C) == null ? void 0 : R[_];
    }
    return C;
  } : x = (S) => S[g.accessorKey]), !y)
    throw new Error();
  let p = {
    id: `${String(y)}`,
    accessorFn: x,
    parent: r,
    depth: o,
    columnDef: g,
    columns: [],
    getFlatColumns: Ce(() => [!0], () => {
      var S;
      return [p, ...(S = p.columns) == null ? void 0 : S.flatMap((C) => C.getFlatColumns())];
    }, we(n.options, "debugColumns")),
    getLeafColumns: Ce(() => [n._getOrderColumnsFn()], (S) => {
      var C;
      if ((C = p.columns) != null && C.length) {
        let R = p.columns.flatMap((_) => _.getLeafColumns());
        return S(R);
      }
      return [p];
    }, we(n.options, "debugColumns"))
  };
  for (const S of n._features)
    S.createColumn == null || S.createColumn(p, n);
  return p;
}
const jt = "debugHeaders";
function tb(n, i, o) {
  var r;
  let f = {
    id: (r = o.id) != null ? r : i.id,
    column: i,
    index: o.index,
    isPlaceholder: !!o.isPlaceholder,
    placeholderId: o.placeholderId,
    depth: o.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const d = [], g = (h) => {
        h.subHeaders && h.subHeaders.length && h.subHeaders.map(g), d.push(h);
      };
      return g(f), d;
    },
    getContext: () => ({
      table: n,
      header: f,
      column: i
    })
  };
  return n._features.forEach((d) => {
    d.createHeader == null || d.createHeader(f, n);
  }), f;
}
const tO = {
  createTable: (n) => {
    n.getHeaderGroups = Ce(() => [n.getAllColumns(), n.getVisibleLeafColumns(), n.getState().columnPinning.left, n.getState().columnPinning.right], (i, o, r, c) => {
      var f, d;
      const g = (f = r?.map((p) => o.find((S) => S.id === p)).filter(Boolean)) != null ? f : [], h = (d = c?.map((p) => o.find((S) => S.id === p)).filter(Boolean)) != null ? d : [], y = o.filter((p) => !(r != null && r.includes(p.id)) && !(c != null && c.includes(p.id)));
      return as(i, [...g, ...y, ...h], n);
    }, we(n.options, jt)), n.getCenterHeaderGroups = Ce(() => [n.getAllColumns(), n.getVisibleLeafColumns(), n.getState().columnPinning.left, n.getState().columnPinning.right], (i, o, r, c) => (o = o.filter((f) => !(r != null && r.includes(f.id)) && !(c != null && c.includes(f.id))), as(i, o, n, "center")), we(n.options, jt)), n.getLeftHeaderGroups = Ce(() => [n.getAllColumns(), n.getVisibleLeafColumns(), n.getState().columnPinning.left], (i, o, r) => {
      var c;
      const f = (c = r?.map((d) => o.find((g) => g.id === d)).filter(Boolean)) != null ? c : [];
      return as(i, f, n, "left");
    }, we(n.options, jt)), n.getRightHeaderGroups = Ce(() => [n.getAllColumns(), n.getVisibleLeafColumns(), n.getState().columnPinning.right], (i, o, r) => {
      var c;
      const f = (c = r?.map((d) => o.find((g) => g.id === d)).filter(Boolean)) != null ? c : [];
      return as(i, f, n, "right");
    }, we(n.options, jt)), n.getFooterGroups = Ce(() => [n.getHeaderGroups()], (i) => [...i].reverse(), we(n.options, jt)), n.getLeftFooterGroups = Ce(() => [n.getLeftHeaderGroups()], (i) => [...i].reverse(), we(n.options, jt)), n.getCenterFooterGroups = Ce(() => [n.getCenterHeaderGroups()], (i) => [...i].reverse(), we(n.options, jt)), n.getRightFooterGroups = Ce(() => [n.getRightHeaderGroups()], (i) => [...i].reverse(), we(n.options, jt)), n.getFlatHeaders = Ce(() => [n.getHeaderGroups()], (i) => i.map((o) => o.headers).flat(), we(n.options, jt)), n.getLeftFlatHeaders = Ce(() => [n.getLeftHeaderGroups()], (i) => i.map((o) => o.headers).flat(), we(n.options, jt)), n.getCenterFlatHeaders = Ce(() => [n.getCenterHeaderGroups()], (i) => i.map((o) => o.headers).flat(), we(n.options, jt)), n.getRightFlatHeaders = Ce(() => [n.getRightHeaderGroups()], (i) => i.map((o) => o.headers).flat(), we(n.options, jt)), n.getCenterLeafHeaders = Ce(() => [n.getCenterFlatHeaders()], (i) => i.filter((o) => {
      var r;
      return !((r = o.subHeaders) != null && r.length);
    }), we(n.options, jt)), n.getLeftLeafHeaders = Ce(() => [n.getLeftFlatHeaders()], (i) => i.filter((o) => {
      var r;
      return !((r = o.subHeaders) != null && r.length);
    }), we(n.options, jt)), n.getRightLeafHeaders = Ce(() => [n.getRightFlatHeaders()], (i) => i.filter((o) => {
      var r;
      return !((r = o.subHeaders) != null && r.length);
    }), we(n.options, jt)), n.getLeafHeaders = Ce(() => [n.getLeftHeaderGroups(), n.getCenterHeaderGroups(), n.getRightHeaderGroups()], (i, o, r) => {
      var c, f, d, g, h, y;
      return [...(c = (f = i[0]) == null ? void 0 : f.headers) != null ? c : [], ...(d = (g = o[0]) == null ? void 0 : g.headers) != null ? d : [], ...(h = (y = r[0]) == null ? void 0 : y.headers) != null ? h : []].map((x) => x.getLeafHeaders()).flat();
    }, we(n.options, jt));
  }
};
function as(n, i, o, r) {
  var c, f;
  let d = 0;
  const g = function(S, C) {
    C === void 0 && (C = 1), d = Math.max(d, C), S.filter((R) => R.getIsVisible()).forEach((R) => {
      var _;
      (_ = R.columns) != null && _.length && g(R.columns, C + 1);
    }, 0);
  };
  g(n);
  let h = [];
  const y = (S, C) => {
    const R = {
      depth: C,
      id: [r, `${C}`].filter(Boolean).join("_"),
      headers: []
    }, _ = [];
    S.forEach((T) => {
      const O = [..._].reverse()[0], D = T.column.depth === R.depth;
      let U, P = !1;
      if (D && T.column.parent ? U = T.column.parent : (U = T.column, P = !0), O && O?.column === U)
        O.subHeaders.push(T);
      else {
        const Q = tb(o, U, {
          id: [r, C, U.id, T?.id].filter(Boolean).join("_"),
          isPlaceholder: P,
          placeholderId: P ? `${_.filter((B) => B.column === U).length}` : void 0,
          depth: C,
          index: _.length
        });
        Q.subHeaders.push(T), _.push(Q);
      }
      R.headers.push(T), T.headerGroup = R;
    }), h.push(R), C > 0 && y(_, C - 1);
  }, x = i.map((S, C) => tb(o, S, {
    depth: d,
    index: C
  }));
  y(x, d - 1), h.reverse();
  const p = (S) => S.filter((R) => R.column.getIsVisible()).map((R) => {
    let _ = 0, T = 0, O = [0];
    R.subHeaders && R.subHeaders.length ? (O = [], p(R.subHeaders).forEach((U) => {
      let {
        colSpan: P,
        rowSpan: Q
      } = U;
      _ += P, O.push(Q);
    })) : _ = 1;
    const D = Math.min(...O);
    return T = T + D, R.colSpan = _, R.rowSpan = T, {
      colSpan: _,
      rowSpan: T
    };
  });
  return p((c = (f = h[0]) == null ? void 0 : f.headers) != null ? c : []), h;
}
const nO = (n, i, o, r, c, f, d) => {
  let g = {
    id: i,
    index: r,
    original: o,
    depth: c,
    parentId: d,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: (h) => {
      if (g._valuesCache.hasOwnProperty(h))
        return g._valuesCache[h];
      const y = n.getColumn(h);
      if (y != null && y.accessorFn)
        return g._valuesCache[h] = y.accessorFn(g.original, r), g._valuesCache[h];
    },
    getUniqueValues: (h) => {
      if (g._uniqueValuesCache.hasOwnProperty(h))
        return g._uniqueValuesCache[h];
      const y = n.getColumn(h);
      if (y != null && y.accessorFn)
        return y.columnDef.getUniqueValues ? (g._uniqueValuesCache[h] = y.columnDef.getUniqueValues(g.original, r), g._uniqueValuesCache[h]) : (g._uniqueValuesCache[h] = [g.getValue(h)], g._uniqueValuesCache[h]);
    },
    renderValue: (h) => {
      var y;
      return (y = g.getValue(h)) != null ? y : n.options.renderFallbackValue;
    },
    subRows: [],
    getLeafRows: () => Jz(g.subRows, (h) => h.subRows),
    getParentRow: () => g.parentId ? n.getRow(g.parentId, !0) : void 0,
    getParentRows: () => {
      let h = [], y = g;
      for (; ; ) {
        const x = y.getParentRow();
        if (!x) break;
        h.push(x), y = x;
      }
      return h.reverse();
    },
    getAllCells: Ce(() => [n.getAllLeafColumns()], (h) => h.map((y) => Wz(n, g, y, y.id)), we(n.options, "debugRows")),
    _getAllCellsByColumnId: Ce(() => [g.getAllCells()], (h) => h.reduce((y, x) => (y[x.column.id] = x, y), {}), we(n.options, "debugRows"))
  };
  for (let h = 0; h < n._features.length; h++) {
    const y = n._features[h];
    y == null || y.createRow == null || y.createRow(g, n);
  }
  return g;
}, lO = {
  createColumn: (n, i) => {
    n._getFacetedRowModel = i.options.getFacetedRowModel && i.options.getFacetedRowModel(i, n.id), n.getFacetedRowModel = () => n._getFacetedRowModel ? n._getFacetedRowModel() : i.getPreFilteredRowModel(), n._getFacetedUniqueValues = i.options.getFacetedUniqueValues && i.options.getFacetedUniqueValues(i, n.id), n.getFacetedUniqueValues = () => n._getFacetedUniqueValues ? n._getFacetedUniqueValues() : /* @__PURE__ */ new Map(), n._getFacetedMinMaxValues = i.options.getFacetedMinMaxValues && i.options.getFacetedMinMaxValues(i, n.id), n.getFacetedMinMaxValues = () => {
      if (n._getFacetedMinMaxValues)
        return n._getFacetedMinMaxValues();
    };
  }
}, u1 = (n, i, o) => {
  var r, c;
  const f = o == null || (r = o.toString()) == null ? void 0 : r.toLowerCase();
  return !!(!((c = n.getValue(i)) == null || (c = c.toString()) == null || (c = c.toLowerCase()) == null) && c.includes(f));
};
u1.autoRemove = (n) => Dn(n);
const s1 = (n, i, o) => {
  var r;
  return !!(!((r = n.getValue(i)) == null || (r = r.toString()) == null) && r.includes(o));
};
s1.autoRemove = (n) => Dn(n);
const c1 = (n, i, o) => {
  var r;
  return ((r = n.getValue(i)) == null || (r = r.toString()) == null ? void 0 : r.toLowerCase()) === o?.toLowerCase();
};
c1.autoRemove = (n) => Dn(n);
const f1 = (n, i, o) => {
  var r;
  return (r = n.getValue(i)) == null ? void 0 : r.includes(o);
};
f1.autoRemove = (n) => Dn(n);
const d1 = (n, i, o) => !o.some((r) => {
  var c;
  return !((c = n.getValue(i)) != null && c.includes(r));
});
d1.autoRemove = (n) => Dn(n) || !(n != null && n.length);
const g1 = (n, i, o) => o.some((r) => {
  var c;
  return (c = n.getValue(i)) == null ? void 0 : c.includes(r);
});
g1.autoRemove = (n) => Dn(n) || !(n != null && n.length);
const m1 = (n, i, o) => n.getValue(i) === o;
m1.autoRemove = (n) => Dn(n);
const h1 = (n, i, o) => n.getValue(i) == o;
h1.autoRemove = (n) => Dn(n);
const xm = (n, i, o) => {
  let [r, c] = o;
  const f = n.getValue(i);
  return f >= r && f <= c;
};
xm.resolveFilterValue = (n) => {
  let [i, o] = n, r = typeof i != "number" ? parseFloat(i) : i, c = typeof o != "number" ? parseFloat(o) : o, f = i === null || Number.isNaN(r) ? -1 / 0 : r, d = o === null || Number.isNaN(c) ? 1 / 0 : c;
  if (f > d) {
    const g = f;
    f = d, d = g;
  }
  return [f, d];
};
xm.autoRemove = (n) => Dn(n) || Dn(n[0]) && Dn(n[1]);
const yl = {
  includesString: u1,
  includesStringSensitive: s1,
  equalsString: c1,
  arrIncludes: f1,
  arrIncludesAll: d1,
  arrIncludesSome: g1,
  equals: m1,
  weakEquals: h1,
  inNumberRange: xm
};
function Dn(n) {
  return n == null || n === "";
}
const aO = {
  getDefaultColumnDef: () => ({
    filterFn: "auto"
  }),
  getInitialState: (n) => ({
    columnFilters: [],
    ...n
  }),
  getDefaultOptions: (n) => ({
    onColumnFiltersChange: dn("columnFilters", n),
    filterFromLeafRows: !1,
    maxLeafRowFilterDepth: 100
  }),
  createColumn: (n, i) => {
    n.getAutoFilterFn = () => {
      const o = i.getCoreRowModel().flatRows[0], r = o?.getValue(n.id);
      return typeof r == "string" ? yl.includesString : typeof r == "number" ? yl.inNumberRange : typeof r == "boolean" || r !== null && typeof r == "object" ? yl.equals : Array.isArray(r) ? yl.arrIncludes : yl.weakEquals;
    }, n.getFilterFn = () => {
      var o, r;
      return ks(n.columnDef.filterFn) ? n.columnDef.filterFn : n.columnDef.filterFn === "auto" ? n.getAutoFilterFn() : (
        // @ts-ignore
        (o = (r = i.options.filterFns) == null ? void 0 : r[n.columnDef.filterFn]) != null ? o : yl[n.columnDef.filterFn]
      );
    }, n.getCanFilter = () => {
      var o, r, c;
      return ((o = n.columnDef.enableColumnFilter) != null ? o : !0) && ((r = i.options.enableColumnFilters) != null ? r : !0) && ((c = i.options.enableFilters) != null ? c : !0) && !!n.accessorFn;
    }, n.getIsFiltered = () => n.getFilterIndex() > -1, n.getFilterValue = () => {
      var o;
      return (o = i.getState().columnFilters) == null || (o = o.find((r) => r.id === n.id)) == null ? void 0 : o.value;
    }, n.getFilterIndex = () => {
      var o, r;
      return (o = (r = i.getState().columnFilters) == null ? void 0 : r.findIndex((c) => c.id === n.id)) != null ? o : -1;
    }, n.setFilterValue = (o) => {
      i.setColumnFilters((r) => {
        const c = n.getFilterFn(), f = r?.find((x) => x.id === n.id), d = la(o, f ? f.value : void 0);
        if (nb(c, d, n)) {
          var g;
          return (g = r?.filter((x) => x.id !== n.id)) != null ? g : [];
        }
        const h = {
          id: n.id,
          value: d
        };
        if (f) {
          var y;
          return (y = r?.map((x) => x.id === n.id ? h : x)) != null ? y : [];
        }
        return r != null && r.length ? [...r, h] : [h];
      });
    };
  },
  createRow: (n, i) => {
    n.columnFilters = {}, n.columnFiltersMeta = {};
  },
  createTable: (n) => {
    n.setColumnFilters = (i) => {
      const o = n.getAllLeafColumns(), r = (c) => {
        var f;
        return (f = la(i, c)) == null ? void 0 : f.filter((d) => {
          const g = o.find((h) => h.id === d.id);
          if (g) {
            const h = g.getFilterFn();
            if (nb(h, d.value, g))
              return !1;
          }
          return !0;
        });
      };
      n.options.onColumnFiltersChange == null || n.options.onColumnFiltersChange(r);
    }, n.resetColumnFilters = (i) => {
      var o, r;
      n.setColumnFilters(i ? [] : (o = (r = n.initialState) == null ? void 0 : r.columnFilters) != null ? o : []);
    }, n.getPreFilteredRowModel = () => n.getCoreRowModel(), n.getFilteredRowModel = () => (!n._getFilteredRowModel && n.options.getFilteredRowModel && (n._getFilteredRowModel = n.options.getFilteredRowModel(n)), n.options.manualFiltering || !n._getFilteredRowModel ? n.getPreFilteredRowModel() : n._getFilteredRowModel());
  }
};
function nb(n, i, o) {
  return (n && n.autoRemove ? n.autoRemove(i, o) : !1) || typeof i > "u" || typeof i == "string" && !i;
}
const iO = (n, i, o) => o.reduce((r, c) => {
  const f = c.getValue(n);
  return r + (typeof f == "number" ? f : 0);
}, 0), oO = (n, i, o) => {
  let r;
  return o.forEach((c) => {
    const f = c.getValue(n);
    f != null && (r > f || r === void 0 && f >= f) && (r = f);
  }), r;
}, rO = (n, i, o) => {
  let r;
  return o.forEach((c) => {
    const f = c.getValue(n);
    f != null && (r < f || r === void 0 && f >= f) && (r = f);
  }), r;
}, uO = (n, i, o) => {
  let r, c;
  return o.forEach((f) => {
    const d = f.getValue(n);
    d != null && (r === void 0 ? d >= d && (r = c = d) : (r > d && (r = d), c < d && (c = d)));
  }), [r, c];
}, sO = (n, i) => {
  let o = 0, r = 0;
  if (i.forEach((c) => {
    let f = c.getValue(n);
    f != null && (f = +f) >= f && (++o, r += f);
  }), o) return r / o;
}, cO = (n, i) => {
  if (!i.length)
    return;
  const o = i.map((f) => f.getValue(n));
  if (!Kz(o))
    return;
  if (o.length === 1)
    return o[0];
  const r = Math.floor(o.length / 2), c = o.sort((f, d) => f - d);
  return o.length % 2 !== 0 ? c[r] : (c[r - 1] + c[r]) / 2;
}, fO = (n, i) => Array.from(new Set(i.map((o) => o.getValue(n))).values()), dO = (n, i) => new Set(i.map((o) => o.getValue(n))).size, gO = (n, i) => i.length, eg = {
  sum: iO,
  min: oO,
  max: rO,
  extent: uO,
  mean: sO,
  median: cO,
  unique: fO,
  uniqueCount: dO,
  count: gO
}, mO = {
  getDefaultColumnDef: () => ({
    aggregatedCell: (n) => {
      var i, o;
      return (i = (o = n.getValue()) == null || o.toString == null ? void 0 : o.toString()) != null ? i : null;
    },
    aggregationFn: "auto"
  }),
  getInitialState: (n) => ({
    grouping: [],
    ...n
  }),
  getDefaultOptions: (n) => ({
    onGroupingChange: dn("grouping", n),
    groupedColumnMode: "reorder"
  }),
  createColumn: (n, i) => {
    n.toggleGrouping = () => {
      i.setGrouping((o) => o != null && o.includes(n.id) ? o.filter((r) => r !== n.id) : [...o ?? [], n.id]);
    }, n.getCanGroup = () => {
      var o, r;
      return ((o = n.columnDef.enableGrouping) != null ? o : !0) && ((r = i.options.enableGrouping) != null ? r : !0) && (!!n.accessorFn || !!n.columnDef.getGroupingValue);
    }, n.getIsGrouped = () => {
      var o;
      return (o = i.getState().grouping) == null ? void 0 : o.includes(n.id);
    }, n.getGroupedIndex = () => {
      var o;
      return (o = i.getState().grouping) == null ? void 0 : o.indexOf(n.id);
    }, n.getToggleGroupingHandler = () => {
      const o = n.getCanGroup();
      return () => {
        o && n.toggleGrouping();
      };
    }, n.getAutoAggregationFn = () => {
      const o = i.getCoreRowModel().flatRows[0], r = o?.getValue(n.id);
      if (typeof r == "number")
        return eg.sum;
      if (Object.prototype.toString.call(r) === "[object Date]")
        return eg.extent;
    }, n.getAggregationFn = () => {
      var o, r;
      if (!n)
        throw new Error();
      return ks(n.columnDef.aggregationFn) ? n.columnDef.aggregationFn : n.columnDef.aggregationFn === "auto" ? n.getAutoAggregationFn() : (o = (r = i.options.aggregationFns) == null ? void 0 : r[n.columnDef.aggregationFn]) != null ? o : eg[n.columnDef.aggregationFn];
    };
  },
  createTable: (n) => {
    n.setGrouping = (i) => n.options.onGroupingChange == null ? void 0 : n.options.onGroupingChange(i), n.resetGrouping = (i) => {
      var o, r;
      n.setGrouping(i ? [] : (o = (r = n.initialState) == null ? void 0 : r.grouping) != null ? o : []);
    }, n.getPreGroupedRowModel = () => n.getFilteredRowModel(), n.getGroupedRowModel = () => (!n._getGroupedRowModel && n.options.getGroupedRowModel && (n._getGroupedRowModel = n.options.getGroupedRowModel(n)), n.options.manualGrouping || !n._getGroupedRowModel ? n.getPreGroupedRowModel() : n._getGroupedRowModel());
  },
  createRow: (n, i) => {
    n.getIsGrouped = () => !!n.groupingColumnId, n.getGroupingValue = (o) => {
      if (n._groupingValuesCache.hasOwnProperty(o))
        return n._groupingValuesCache[o];
      const r = i.getColumn(o);
      return r != null && r.columnDef.getGroupingValue ? (n._groupingValuesCache[o] = r.columnDef.getGroupingValue(n.original), n._groupingValuesCache[o]) : n.getValue(o);
    }, n._groupingValuesCache = {};
  },
  createCell: (n, i, o, r) => {
    n.getIsGrouped = () => i.getIsGrouped() && i.id === o.groupingColumnId, n.getIsPlaceholder = () => !n.getIsGrouped() && i.getIsGrouped(), n.getIsAggregated = () => {
      var c;
      return !n.getIsGrouped() && !n.getIsPlaceholder() && !!((c = o.subRows) != null && c.length);
    };
  }
};
function hO(n, i, o) {
  if (!(i != null && i.length) || !o)
    return n;
  const r = n.filter((f) => !i.includes(f.id));
  return o === "remove" ? r : [...i.map((f) => n.find((d) => d.id === f)).filter(Boolean), ...r];
}
const pO = {
  getInitialState: (n) => ({
    columnOrder: [],
    ...n
  }),
  getDefaultOptions: (n) => ({
    onColumnOrderChange: dn("columnOrder", n)
  }),
  createColumn: (n, i) => {
    n.getIndex = Ce((o) => [sr(i, o)], (o) => o.findIndex((r) => r.id === n.id), we(i.options, "debugColumns")), n.getIsFirstColumn = (o) => {
      var r;
      return ((r = sr(i, o)[0]) == null ? void 0 : r.id) === n.id;
    }, n.getIsLastColumn = (o) => {
      var r;
      const c = sr(i, o);
      return ((r = c[c.length - 1]) == null ? void 0 : r.id) === n.id;
    };
  },
  createTable: (n) => {
    n.setColumnOrder = (i) => n.options.onColumnOrderChange == null ? void 0 : n.options.onColumnOrderChange(i), n.resetColumnOrder = (i) => {
      var o;
      n.setColumnOrder(i ? [] : (o = n.initialState.columnOrder) != null ? o : []);
    }, n._getOrderColumnsFn = Ce(() => [n.getState().columnOrder, n.getState().grouping, n.options.groupedColumnMode], (i, o, r) => (c) => {
      let f = [];
      if (!(i != null && i.length))
        f = c;
      else {
        const d = [...i], g = [...c];
        for (; g.length && d.length; ) {
          const h = d.shift(), y = g.findIndex((x) => x.id === h);
          y > -1 && f.push(g.splice(y, 1)[0]);
        }
        f = [...f, ...g];
      }
      return hO(f, o, r);
    }, we(n.options, "debugTable"));
  }
}, tg = () => ({
  left: [],
  right: []
}), vO = {
  getInitialState: (n) => ({
    columnPinning: tg(),
    ...n
  }),
  getDefaultOptions: (n) => ({
    onColumnPinningChange: dn("columnPinning", n)
  }),
  createColumn: (n, i) => {
    n.pin = (o) => {
      const r = n.getLeafColumns().map((c) => c.id).filter(Boolean);
      i.setColumnPinning((c) => {
        var f, d;
        if (o === "right") {
          var g, h;
          return {
            left: ((g = c?.left) != null ? g : []).filter((p) => !(r != null && r.includes(p))),
            right: [...((h = c?.right) != null ? h : []).filter((p) => !(r != null && r.includes(p))), ...r]
          };
        }
        if (o === "left") {
          var y, x;
          return {
            left: [...((y = c?.left) != null ? y : []).filter((p) => !(r != null && r.includes(p))), ...r],
            right: ((x = c?.right) != null ? x : []).filter((p) => !(r != null && r.includes(p)))
          };
        }
        return {
          left: ((f = c?.left) != null ? f : []).filter((p) => !(r != null && r.includes(p))),
          right: ((d = c?.right) != null ? d : []).filter((p) => !(r != null && r.includes(p)))
        };
      });
    }, n.getCanPin = () => n.getLeafColumns().some((r) => {
      var c, f, d;
      return ((c = r.columnDef.enablePinning) != null ? c : !0) && ((f = (d = i.options.enableColumnPinning) != null ? d : i.options.enablePinning) != null ? f : !0);
    }), n.getIsPinned = () => {
      const o = n.getLeafColumns().map((g) => g.id), {
        left: r,
        right: c
      } = i.getState().columnPinning, f = o.some((g) => r?.includes(g)), d = o.some((g) => c?.includes(g));
      return f ? "left" : d ? "right" : !1;
    }, n.getPinnedIndex = () => {
      var o, r;
      const c = n.getIsPinned();
      return c ? (o = (r = i.getState().columnPinning) == null || (r = r[c]) == null ? void 0 : r.indexOf(n.id)) != null ? o : -1 : 0;
    };
  },
  createRow: (n, i) => {
    n.getCenterVisibleCells = Ce(() => [n._getAllVisibleCells(), i.getState().columnPinning.left, i.getState().columnPinning.right], (o, r, c) => {
      const f = [...r ?? [], ...c ?? []];
      return o.filter((d) => !f.includes(d.column.id));
    }, we(i.options, "debugRows")), n.getLeftVisibleCells = Ce(() => [n._getAllVisibleCells(), i.getState().columnPinning.left], (o, r) => (r ?? []).map((f) => o.find((d) => d.column.id === f)).filter(Boolean).map((f) => ({
      ...f,
      position: "left"
    })), we(i.options, "debugRows")), n.getRightVisibleCells = Ce(() => [n._getAllVisibleCells(), i.getState().columnPinning.right], (o, r) => (r ?? []).map((f) => o.find((d) => d.column.id === f)).filter(Boolean).map((f) => ({
      ...f,
      position: "right"
    })), we(i.options, "debugRows"));
  },
  createTable: (n) => {
    n.setColumnPinning = (i) => n.options.onColumnPinningChange == null ? void 0 : n.options.onColumnPinningChange(i), n.resetColumnPinning = (i) => {
      var o, r;
      return n.setColumnPinning(i ? tg() : (o = (r = n.initialState) == null ? void 0 : r.columnPinning) != null ? o : tg());
    }, n.getIsSomeColumnsPinned = (i) => {
      var o;
      const r = n.getState().columnPinning;
      if (!i) {
        var c, f;
        return !!((c = r.left) != null && c.length || (f = r.right) != null && f.length);
      }
      return !!((o = r[i]) != null && o.length);
    }, n.getLeftLeafColumns = Ce(() => [n.getAllLeafColumns(), n.getState().columnPinning.left], (i, o) => (o ?? []).map((r) => i.find((c) => c.id === r)).filter(Boolean), we(n.options, "debugColumns")), n.getRightLeafColumns = Ce(() => [n.getAllLeafColumns(), n.getState().columnPinning.right], (i, o) => (o ?? []).map((r) => i.find((c) => c.id === r)).filter(Boolean), we(n.options, "debugColumns")), n.getCenterLeafColumns = Ce(() => [n.getAllLeafColumns(), n.getState().columnPinning.left, n.getState().columnPinning.right], (i, o, r) => {
      const c = [...o ?? [], ...r ?? []];
      return i.filter((f) => !c.includes(f.id));
    }, we(n.options, "debugColumns"));
  }
};
function yO(n) {
  return n || (typeof document < "u" ? document : null);
}
const is = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER
}, ng = () => ({
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: !1,
  columnSizingStart: []
}), bO = {
  getDefaultColumnDef: () => is,
  getInitialState: (n) => ({
    columnSizing: {},
    columnSizingInfo: ng(),
    ...n
  }),
  getDefaultOptions: (n) => ({
    columnResizeMode: "onEnd",
    columnResizeDirection: "ltr",
    onColumnSizingChange: dn("columnSizing", n),
    onColumnSizingInfoChange: dn("columnSizingInfo", n)
  }),
  createColumn: (n, i) => {
    n.getSize = () => {
      var o, r, c;
      const f = i.getState().columnSizing[n.id];
      return Math.min(Math.max((o = n.columnDef.minSize) != null ? o : is.minSize, (r = f ?? n.columnDef.size) != null ? r : is.size), (c = n.columnDef.maxSize) != null ? c : is.maxSize);
    }, n.getStart = Ce((o) => [o, sr(i, o), i.getState().columnSizing], (o, r) => r.slice(0, n.getIndex(o)).reduce((c, f) => c + f.getSize(), 0), we(i.options, "debugColumns")), n.getAfter = Ce((o) => [o, sr(i, o), i.getState().columnSizing], (o, r) => r.slice(n.getIndex(o) + 1).reduce((c, f) => c + f.getSize(), 0), we(i.options, "debugColumns")), n.resetSize = () => {
      i.setColumnSizing((o) => {
        let {
          [n.id]: r,
          ...c
        } = o;
        return c;
      });
    }, n.getCanResize = () => {
      var o, r;
      return ((o = n.columnDef.enableResizing) != null ? o : !0) && ((r = i.options.enableColumnResizing) != null ? r : !0);
    }, n.getIsResizing = () => i.getState().columnSizingInfo.isResizingColumn === n.id;
  },
  createHeader: (n, i) => {
    n.getSize = () => {
      let o = 0;
      const r = (c) => {
        if (c.subHeaders.length)
          c.subHeaders.forEach(r);
        else {
          var f;
          o += (f = c.column.getSize()) != null ? f : 0;
        }
      };
      return r(n), o;
    }, n.getStart = () => {
      if (n.index > 0) {
        const o = n.headerGroup.headers[n.index - 1];
        return o.getStart() + o.getSize();
      }
      return 0;
    }, n.getResizeHandler = (o) => {
      const r = i.getColumn(n.column.id), c = r?.getCanResize();
      return (f) => {
        if (!r || !c || (f.persist == null || f.persist(), lg(f) && f.touches && f.touches.length > 1))
          return;
        const d = n.getSize(), g = n ? n.getLeafHeaders().map((O) => [O.column.id, O.column.getSize()]) : [[r.id, r.getSize()]], h = lg(f) ? Math.round(f.touches[0].clientX) : f.clientX, y = {}, x = (O, D) => {
          typeof D == "number" && (i.setColumnSizingInfo((U) => {
            var P, Q;
            const B = i.options.columnResizeDirection === "rtl" ? -1 : 1, H = (D - ((P = U?.startOffset) != null ? P : 0)) * B, $ = Math.max(H / ((Q = U?.startSize) != null ? Q : 0), -0.999999);
            return U.columnSizingStart.forEach((ae) => {
              let [K, se] = ae;
              y[K] = Math.round(Math.max(se + se * $, 0) * 100) / 100;
            }), {
              ...U,
              deltaOffset: H,
              deltaPercentage: $
            };
          }), (i.options.columnResizeMode === "onChange" || O === "end") && i.setColumnSizing((U) => ({
            ...U,
            ...y
          })));
        }, p = (O) => x("move", O), S = (O) => {
          x("end", O), i.setColumnSizingInfo((D) => ({
            ...D,
            isResizingColumn: !1,
            startOffset: null,
            startSize: null,
            deltaOffset: null,
            deltaPercentage: null,
            columnSizingStart: []
          }));
        }, C = yO(o), R = {
          moveHandler: (O) => p(O.clientX),
          upHandler: (O) => {
            C?.removeEventListener("mousemove", R.moveHandler), C?.removeEventListener("mouseup", R.upHandler), S(O.clientX);
          }
        }, _ = {
          moveHandler: (O) => (O.cancelable && (O.preventDefault(), O.stopPropagation()), p(O.touches[0].clientX), !1),
          upHandler: (O) => {
            var D;
            C?.removeEventListener("touchmove", _.moveHandler), C?.removeEventListener("touchend", _.upHandler), O.cancelable && (O.preventDefault(), O.stopPropagation()), S((D = O.touches[0]) == null ? void 0 : D.clientX);
          }
        }, T = SO() ? {
          passive: !1
        } : !1;
        lg(f) ? (C?.addEventListener("touchmove", _.moveHandler, T), C?.addEventListener("touchend", _.upHandler, T)) : (C?.addEventListener("mousemove", R.moveHandler, T), C?.addEventListener("mouseup", R.upHandler, T)), i.setColumnSizingInfo((O) => ({
          ...O,
          startOffset: h,
          startSize: d,
          deltaOffset: 0,
          deltaPercentage: 0,
          columnSizingStart: g,
          isResizingColumn: r.id
        }));
      };
    };
  },
  createTable: (n) => {
    n.setColumnSizing = (i) => n.options.onColumnSizingChange == null ? void 0 : n.options.onColumnSizingChange(i), n.setColumnSizingInfo = (i) => n.options.onColumnSizingInfoChange == null ? void 0 : n.options.onColumnSizingInfoChange(i), n.resetColumnSizing = (i) => {
      var o;
      n.setColumnSizing(i ? {} : (o = n.initialState.columnSizing) != null ? o : {});
    }, n.resetHeaderSizeInfo = (i) => {
      var o;
      n.setColumnSizingInfo(i ? ng() : (o = n.initialState.columnSizingInfo) != null ? o : ng());
    }, n.getTotalSize = () => {
      var i, o;
      return (i = (o = n.getHeaderGroups()[0]) == null ? void 0 : o.headers.reduce((r, c) => r + c.getSize(), 0)) != null ? i : 0;
    }, n.getLeftTotalSize = () => {
      var i, o;
      return (i = (o = n.getLeftHeaderGroups()[0]) == null ? void 0 : o.headers.reduce((r, c) => r + c.getSize(), 0)) != null ? i : 0;
    }, n.getCenterTotalSize = () => {
      var i, o;
      return (i = (o = n.getCenterHeaderGroups()[0]) == null ? void 0 : o.headers.reduce((r, c) => r + c.getSize(), 0)) != null ? i : 0;
    }, n.getRightTotalSize = () => {
      var i, o;
      return (i = (o = n.getRightHeaderGroups()[0]) == null ? void 0 : o.headers.reduce((r, c) => r + c.getSize(), 0)) != null ? i : 0;
    };
  }
};
let os = null;
function SO() {
  if (typeof os == "boolean") return os;
  let n = !1;
  try {
    const i = {
      get passive() {
        return n = !0, !1;
      }
    }, o = () => {
    };
    window.addEventListener("test", o, i), window.removeEventListener("test", o);
  } catch {
    n = !1;
  }
  return os = n, os;
}
function lg(n) {
  return n.type === "touchstart";
}
const xO = {
  getInitialState: (n) => ({
    columnVisibility: {},
    ...n
  }),
  getDefaultOptions: (n) => ({
    onColumnVisibilityChange: dn("columnVisibility", n)
  }),
  createColumn: (n, i) => {
    n.toggleVisibility = (o) => {
      n.getCanHide() && i.setColumnVisibility((r) => ({
        ...r,
        [n.id]: o ?? !n.getIsVisible()
      }));
    }, n.getIsVisible = () => {
      var o, r;
      const c = n.columns;
      return (o = c.length ? c.some((f) => f.getIsVisible()) : (r = i.getState().columnVisibility) == null ? void 0 : r[n.id]) != null ? o : !0;
    }, n.getCanHide = () => {
      var o, r;
      return ((o = n.columnDef.enableHiding) != null ? o : !0) && ((r = i.options.enableHiding) != null ? r : !0);
    }, n.getToggleVisibilityHandler = () => (o) => {
      n.toggleVisibility == null || n.toggleVisibility(o.target.checked);
    };
  },
  createRow: (n, i) => {
    n._getAllVisibleCells = Ce(() => [n.getAllCells(), i.getState().columnVisibility], (o) => o.filter((r) => r.column.getIsVisible()), we(i.options, "debugRows")), n.getVisibleCells = Ce(() => [n.getLeftVisibleCells(), n.getCenterVisibleCells(), n.getRightVisibleCells()], (o, r, c) => [...o, ...r, ...c], we(i.options, "debugRows"));
  },
  createTable: (n) => {
    const i = (o, r) => Ce(() => [r(), r().filter((c) => c.getIsVisible()).map((c) => c.id).join("_")], (c) => c.filter((f) => f.getIsVisible == null ? void 0 : f.getIsVisible()), we(n.options, "debugColumns"));
    n.getVisibleFlatColumns = i("getVisibleFlatColumns", () => n.getAllFlatColumns()), n.getVisibleLeafColumns = i("getVisibleLeafColumns", () => n.getAllLeafColumns()), n.getLeftVisibleLeafColumns = i("getLeftVisibleLeafColumns", () => n.getLeftLeafColumns()), n.getRightVisibleLeafColumns = i("getRightVisibleLeafColumns", () => n.getRightLeafColumns()), n.getCenterVisibleLeafColumns = i("getCenterVisibleLeafColumns", () => n.getCenterLeafColumns()), n.setColumnVisibility = (o) => n.options.onColumnVisibilityChange == null ? void 0 : n.options.onColumnVisibilityChange(o), n.resetColumnVisibility = (o) => {
      var r;
      n.setColumnVisibility(o ? {} : (r = n.initialState.columnVisibility) != null ? r : {});
    }, n.toggleAllColumnsVisible = (o) => {
      var r;
      o = (r = o) != null ? r : !n.getIsAllColumnsVisible(), n.setColumnVisibility(n.getAllLeafColumns().reduce((c, f) => ({
        ...c,
        [f.id]: o || !(f.getCanHide != null && f.getCanHide())
      }), {}));
    }, n.getIsAllColumnsVisible = () => !n.getAllLeafColumns().some((o) => !(o.getIsVisible != null && o.getIsVisible())), n.getIsSomeColumnsVisible = () => n.getAllLeafColumns().some((o) => o.getIsVisible == null ? void 0 : o.getIsVisible()), n.getToggleAllColumnsVisibilityHandler = () => (o) => {
      var r;
      n.toggleAllColumnsVisible((r = o.target) == null ? void 0 : r.checked);
    };
  }
};
function sr(n, i) {
  return i ? i === "center" ? n.getCenterVisibleLeafColumns() : i === "left" ? n.getLeftVisibleLeafColumns() : n.getRightVisibleLeafColumns() : n.getVisibleLeafColumns();
}
const CO = {
  createTable: (n) => {
    n._getGlobalFacetedRowModel = n.options.getFacetedRowModel && n.options.getFacetedRowModel(n, "__global__"), n.getGlobalFacetedRowModel = () => n.options.manualFiltering || !n._getGlobalFacetedRowModel ? n.getPreFilteredRowModel() : n._getGlobalFacetedRowModel(), n._getGlobalFacetedUniqueValues = n.options.getFacetedUniqueValues && n.options.getFacetedUniqueValues(n, "__global__"), n.getGlobalFacetedUniqueValues = () => n._getGlobalFacetedUniqueValues ? n._getGlobalFacetedUniqueValues() : /* @__PURE__ */ new Map(), n._getGlobalFacetedMinMaxValues = n.options.getFacetedMinMaxValues && n.options.getFacetedMinMaxValues(n, "__global__"), n.getGlobalFacetedMinMaxValues = () => {
      if (n._getGlobalFacetedMinMaxValues)
        return n._getGlobalFacetedMinMaxValues();
    };
  }
}, wO = {
  getInitialState: (n) => ({
    globalFilter: void 0,
    ...n
  }),
  getDefaultOptions: (n) => ({
    onGlobalFilterChange: dn("globalFilter", n),
    globalFilterFn: "auto",
    getColumnCanGlobalFilter: (i) => {
      var o;
      const r = (o = n.getCoreRowModel().flatRows[0]) == null || (o = o._getAllCellsByColumnId()[i.id]) == null ? void 0 : o.getValue();
      return typeof r == "string" || typeof r == "number";
    }
  }),
  createColumn: (n, i) => {
    n.getCanGlobalFilter = () => {
      var o, r, c, f;
      return ((o = n.columnDef.enableGlobalFilter) != null ? o : !0) && ((r = i.options.enableGlobalFilter) != null ? r : !0) && ((c = i.options.enableFilters) != null ? c : !0) && ((f = i.options.getColumnCanGlobalFilter == null ? void 0 : i.options.getColumnCanGlobalFilter(n)) != null ? f : !0) && !!n.accessorFn;
    };
  },
  createTable: (n) => {
    n.getGlobalAutoFilterFn = () => yl.includesString, n.getGlobalFilterFn = () => {
      var i, o;
      const {
        globalFilterFn: r
      } = n.options;
      return ks(r) ? r : r === "auto" ? n.getGlobalAutoFilterFn() : (i = (o = n.options.filterFns) == null ? void 0 : o[r]) != null ? i : yl[r];
    }, n.setGlobalFilter = (i) => {
      n.options.onGlobalFilterChange == null || n.options.onGlobalFilterChange(i);
    }, n.resetGlobalFilter = (i) => {
      n.setGlobalFilter(i ? void 0 : n.initialState.globalFilter);
    };
  }
}, EO = {
  getInitialState: (n) => ({
    expanded: {},
    ...n
  }),
  getDefaultOptions: (n) => ({
    onExpandedChange: dn("expanded", n),
    paginateExpandedRows: !0
  }),
  createTable: (n) => {
    let i = !1, o = !1;
    n._autoResetExpanded = () => {
      var r, c;
      if (!i) {
        n._queue(() => {
          i = !0;
        });
        return;
      }
      if ((r = (c = n.options.autoResetAll) != null ? c : n.options.autoResetExpanded) != null ? r : !n.options.manualExpanding) {
        if (o) return;
        o = !0, n._queue(() => {
          n.resetExpanded(), o = !1;
        });
      }
    }, n.setExpanded = (r) => n.options.onExpandedChange == null ? void 0 : n.options.onExpandedChange(r), n.toggleAllRowsExpanded = (r) => {
      r ?? !n.getIsAllRowsExpanded() ? n.setExpanded(!0) : n.setExpanded({});
    }, n.resetExpanded = (r) => {
      var c, f;
      n.setExpanded(r ? {} : (c = (f = n.initialState) == null ? void 0 : f.expanded) != null ? c : {});
    }, n.getCanSomeRowsExpand = () => n.getPrePaginationRowModel().flatRows.some((r) => r.getCanExpand()), n.getToggleAllRowsExpandedHandler = () => (r) => {
      r.persist == null || r.persist(), n.toggleAllRowsExpanded();
    }, n.getIsSomeRowsExpanded = () => {
      const r = n.getState().expanded;
      return r === !0 || Object.values(r).some(Boolean);
    }, n.getIsAllRowsExpanded = () => {
      const r = n.getState().expanded;
      return typeof r == "boolean" ? r === !0 : !(!Object.keys(r).length || n.getRowModel().flatRows.some((c) => !c.getIsExpanded()));
    }, n.getExpandedDepth = () => {
      let r = 0;
      return (n.getState().expanded === !0 ? Object.keys(n.getRowModel().rowsById) : Object.keys(n.getState().expanded)).forEach((f) => {
        const d = f.split(".");
        r = Math.max(r, d.length);
      }), r;
    }, n.getPreExpandedRowModel = () => n.getSortedRowModel(), n.getExpandedRowModel = () => (!n._getExpandedRowModel && n.options.getExpandedRowModel && (n._getExpandedRowModel = n.options.getExpandedRowModel(n)), n.options.manualExpanding || !n._getExpandedRowModel ? n.getPreExpandedRowModel() : n._getExpandedRowModel());
  },
  createRow: (n, i) => {
    n.toggleExpanded = (o) => {
      i.setExpanded((r) => {
        var c;
        const f = r === !0 ? !0 : !!(r != null && r[n.id]);
        let d = {};
        if (r === !0 ? Object.keys(i.getRowModel().rowsById).forEach((g) => {
          d[g] = !0;
        }) : d = r, o = (c = o) != null ? c : !f, !f && o)
          return {
            ...d,
            [n.id]: !0
          };
        if (f && !o) {
          const {
            [n.id]: g,
            ...h
          } = d;
          return h;
        }
        return r;
      });
    }, n.getIsExpanded = () => {
      var o;
      const r = i.getState().expanded;
      return !!((o = i.options.getIsRowExpanded == null ? void 0 : i.options.getIsRowExpanded(n)) != null ? o : r === !0 || r?.[n.id]);
    }, n.getCanExpand = () => {
      var o, r, c;
      return (o = i.options.getRowCanExpand == null ? void 0 : i.options.getRowCanExpand(n)) != null ? o : ((r = i.options.enableExpanding) != null ? r : !0) && !!((c = n.subRows) != null && c.length);
    }, n.getIsAllParentsExpanded = () => {
      let o = !0, r = n;
      for (; o && r.parentId; )
        r = i.getRow(r.parentId, !0), o = r.getIsExpanded();
      return o;
    }, n.getToggleExpandedHandler = () => {
      const o = n.getCanExpand();
      return () => {
        o && n.toggleExpanded();
      };
    };
  }
}, jg = 0, Hg = 10, ag = () => ({
  pageIndex: jg,
  pageSize: Hg
}), RO = {
  getInitialState: (n) => ({
    ...n,
    pagination: {
      ...ag(),
      ...n?.pagination
    }
  }),
  getDefaultOptions: (n) => ({
    onPaginationChange: dn("pagination", n)
  }),
  createTable: (n) => {
    let i = !1, o = !1;
    n._autoResetPageIndex = () => {
      var r, c;
      if (!i) {
        n._queue(() => {
          i = !0;
        });
        return;
      }
      if ((r = (c = n.options.autoResetAll) != null ? c : n.options.autoResetPageIndex) != null ? r : !n.options.manualPagination) {
        if (o) return;
        o = !0, n._queue(() => {
          n.resetPageIndex(), o = !1;
        });
      }
    }, n.setPagination = (r) => {
      const c = (f) => la(r, f);
      return n.options.onPaginationChange == null ? void 0 : n.options.onPaginationChange(c);
    }, n.resetPagination = (r) => {
      var c;
      n.setPagination(r ? ag() : (c = n.initialState.pagination) != null ? c : ag());
    }, n.setPageIndex = (r) => {
      n.setPagination((c) => {
        let f = la(r, c.pageIndex);
        const d = typeof n.options.pageCount > "u" || n.options.pageCount === -1 ? Number.MAX_SAFE_INTEGER : n.options.pageCount - 1;
        return f = Math.max(0, Math.min(f, d)), {
          ...c,
          pageIndex: f
        };
      });
    }, n.resetPageIndex = (r) => {
      var c, f;
      n.setPageIndex(r ? jg : (c = (f = n.initialState) == null || (f = f.pagination) == null ? void 0 : f.pageIndex) != null ? c : jg);
    }, n.resetPageSize = (r) => {
      var c, f;
      n.setPageSize(r ? Hg : (c = (f = n.initialState) == null || (f = f.pagination) == null ? void 0 : f.pageSize) != null ? c : Hg);
    }, n.setPageSize = (r) => {
      n.setPagination((c) => {
        const f = Math.max(1, la(r, c.pageSize)), d = c.pageSize * c.pageIndex, g = Math.floor(d / f);
        return {
          ...c,
          pageIndex: g,
          pageSize: f
        };
      });
    }, n.setPageCount = (r) => n.setPagination((c) => {
      var f;
      let d = la(r, (f = n.options.pageCount) != null ? f : -1);
      return typeof d == "number" && (d = Math.max(-1, d)), {
        ...c,
        pageCount: d
      };
    }), n.getPageOptions = Ce(() => [n.getPageCount()], (r) => {
      let c = [];
      return r && r > 0 && (c = [...new Array(r)].fill(null).map((f, d) => d)), c;
    }, we(n.options, "debugTable")), n.getCanPreviousPage = () => n.getState().pagination.pageIndex > 0, n.getCanNextPage = () => {
      const {
        pageIndex: r
      } = n.getState().pagination, c = n.getPageCount();
      return c === -1 ? !0 : c === 0 ? !1 : r < c - 1;
    }, n.previousPage = () => n.setPageIndex((r) => r - 1), n.nextPage = () => n.setPageIndex((r) => r + 1), n.firstPage = () => n.setPageIndex(0), n.lastPage = () => n.setPageIndex(n.getPageCount() - 1), n.getPrePaginationRowModel = () => n.getExpandedRowModel(), n.getPaginationRowModel = () => (!n._getPaginationRowModel && n.options.getPaginationRowModel && (n._getPaginationRowModel = n.options.getPaginationRowModel(n)), n.options.manualPagination || !n._getPaginationRowModel ? n.getPrePaginationRowModel() : n._getPaginationRowModel()), n.getPageCount = () => {
      var r;
      return (r = n.options.pageCount) != null ? r : Math.ceil(n.getRowCount() / n.getState().pagination.pageSize);
    }, n.getRowCount = () => {
      var r;
      return (r = n.options.rowCount) != null ? r : n.getPrePaginationRowModel().rows.length;
    };
  }
}, ig = () => ({
  top: [],
  bottom: []
}), _O = {
  getInitialState: (n) => ({
    rowPinning: ig(),
    ...n
  }),
  getDefaultOptions: (n) => ({
    onRowPinningChange: dn("rowPinning", n)
  }),
  createRow: (n, i) => {
    n.pin = (o, r, c) => {
      const f = r ? n.getLeafRows().map((h) => {
        let {
          id: y
        } = h;
        return y;
      }) : [], d = c ? n.getParentRows().map((h) => {
        let {
          id: y
        } = h;
        return y;
      }) : [], g = /* @__PURE__ */ new Set([...d, n.id, ...f]);
      i.setRowPinning((h) => {
        var y, x;
        if (o === "bottom") {
          var p, S;
          return {
            top: ((p = h?.top) != null ? p : []).filter((_) => !(g != null && g.has(_))),
            bottom: [...((S = h?.bottom) != null ? S : []).filter((_) => !(g != null && g.has(_))), ...Array.from(g)]
          };
        }
        if (o === "top") {
          var C, R;
          return {
            top: [...((C = h?.top) != null ? C : []).filter((_) => !(g != null && g.has(_))), ...Array.from(g)],
            bottom: ((R = h?.bottom) != null ? R : []).filter((_) => !(g != null && g.has(_)))
          };
        }
        return {
          top: ((y = h?.top) != null ? y : []).filter((_) => !(g != null && g.has(_))),
          bottom: ((x = h?.bottom) != null ? x : []).filter((_) => !(g != null && g.has(_)))
        };
      });
    }, n.getCanPin = () => {
      var o;
      const {
        enableRowPinning: r,
        enablePinning: c
      } = i.options;
      return typeof r == "function" ? r(n) : (o = r ?? c) != null ? o : !0;
    }, n.getIsPinned = () => {
      const o = [n.id], {
        top: r,
        bottom: c
      } = i.getState().rowPinning, f = o.some((g) => r?.includes(g)), d = o.some((g) => c?.includes(g));
      return f ? "top" : d ? "bottom" : !1;
    }, n.getPinnedIndex = () => {
      var o, r;
      const c = n.getIsPinned();
      if (!c) return -1;
      const f = (o = c === "top" ? i.getTopRows() : i.getBottomRows()) == null ? void 0 : o.map((d) => {
        let {
          id: g
        } = d;
        return g;
      });
      return (r = f?.indexOf(n.id)) != null ? r : -1;
    };
  },
  createTable: (n) => {
    n.setRowPinning = (i) => n.options.onRowPinningChange == null ? void 0 : n.options.onRowPinningChange(i), n.resetRowPinning = (i) => {
      var o, r;
      return n.setRowPinning(i ? ig() : (o = (r = n.initialState) == null ? void 0 : r.rowPinning) != null ? o : ig());
    }, n.getIsSomeRowsPinned = (i) => {
      var o;
      const r = n.getState().rowPinning;
      if (!i) {
        var c, f;
        return !!((c = r.top) != null && c.length || (f = r.bottom) != null && f.length);
      }
      return !!((o = r[i]) != null && o.length);
    }, n._getPinnedRows = (i, o, r) => {
      var c;
      return ((c = n.options.keepPinnedRows) == null || c ? (
        //get all rows that are pinned even if they would not be otherwise visible
        //account for expanded parent rows, but not pagination or filtering
        (o ?? []).map((d) => {
          const g = n.getRow(d, !0);
          return g.getIsAllParentsExpanded() ? g : null;
        })
      ) : (
        //else get only visible rows that are pinned
        (o ?? []).map((d) => i.find((g) => g.id === d))
      )).filter(Boolean).map((d) => ({
        ...d,
        position: r
      }));
    }, n.getTopRows = Ce(() => [n.getRowModel().rows, n.getState().rowPinning.top], (i, o) => n._getPinnedRows(i, o, "top"), we(n.options, "debugRows")), n.getBottomRows = Ce(() => [n.getRowModel().rows, n.getState().rowPinning.bottom], (i, o) => n._getPinnedRows(i, o, "bottom"), we(n.options, "debugRows")), n.getCenterRows = Ce(() => [n.getRowModel().rows, n.getState().rowPinning.top, n.getState().rowPinning.bottom], (i, o, r) => {
      const c = /* @__PURE__ */ new Set([...o ?? [], ...r ?? []]);
      return i.filter((f) => !c.has(f.id));
    }, we(n.options, "debugRows"));
  }
}, TO = {
  getInitialState: (n) => ({
    rowSelection: {},
    ...n
  }),
  getDefaultOptions: (n) => ({
    onRowSelectionChange: dn("rowSelection", n),
    enableRowSelection: !0,
    enableMultiRowSelection: !0,
    enableSubRowSelection: !0
    // enableGroupingRowSelection: false,
    // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
    // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
  }),
  createTable: (n) => {
    n.setRowSelection = (i) => n.options.onRowSelectionChange == null ? void 0 : n.options.onRowSelectionChange(i), n.resetRowSelection = (i) => {
      var o;
      return n.setRowSelection(i ? {} : (o = n.initialState.rowSelection) != null ? o : {});
    }, n.toggleAllRowsSelected = (i) => {
      n.setRowSelection((o) => {
        i = typeof i < "u" ? i : !n.getIsAllRowsSelected();
        const r = {
          ...o
        }, c = n.getPreGroupedRowModel().flatRows;
        return i ? c.forEach((f) => {
          f.getCanSelect() && (r[f.id] = !0);
        }) : c.forEach((f) => {
          delete r[f.id];
        }), r;
      });
    }, n.toggleAllPageRowsSelected = (i) => n.setRowSelection((o) => {
      const r = typeof i < "u" ? i : !n.getIsAllPageRowsSelected(), c = {
        ...o
      };
      return n.getRowModel().rows.forEach((f) => {
        Lg(c, f.id, r, !0, n);
      }), c;
    }), n.getPreSelectedRowModel = () => n.getCoreRowModel(), n.getSelectedRowModel = Ce(() => [n.getState().rowSelection, n.getCoreRowModel()], (i, o) => Object.keys(i).length ? og(n, o) : {
      rows: [],
      flatRows: [],
      rowsById: {}
    }, we(n.options, "debugTable")), n.getFilteredSelectedRowModel = Ce(() => [n.getState().rowSelection, n.getFilteredRowModel()], (i, o) => Object.keys(i).length ? og(n, o) : {
      rows: [],
      flatRows: [],
      rowsById: {}
    }, we(n.options, "debugTable")), n.getGroupedSelectedRowModel = Ce(() => [n.getState().rowSelection, n.getSortedRowModel()], (i, o) => Object.keys(i).length ? og(n, o) : {
      rows: [],
      flatRows: [],
      rowsById: {}
    }, we(n.options, "debugTable")), n.getIsAllRowsSelected = () => {
      const i = n.getFilteredRowModel().flatRows, {
        rowSelection: o
      } = n.getState();
      let r = !!(i.length && Object.keys(o).length);
      return r && i.some((c) => c.getCanSelect() && !o[c.id]) && (r = !1), r;
    }, n.getIsAllPageRowsSelected = () => {
      const i = n.getPaginationRowModel().flatRows.filter((c) => c.getCanSelect()), {
        rowSelection: o
      } = n.getState();
      let r = !!i.length;
      return r && i.some((c) => !o[c.id]) && (r = !1), r;
    }, n.getIsSomeRowsSelected = () => {
      var i;
      const o = Object.keys((i = n.getState().rowSelection) != null ? i : {}).length;
      return o > 0 && o < n.getFilteredRowModel().flatRows.length;
    }, n.getIsSomePageRowsSelected = () => {
      const i = n.getPaginationRowModel().flatRows;
      return n.getIsAllPageRowsSelected() ? !1 : i.filter((o) => o.getCanSelect()).some((o) => o.getIsSelected() || o.getIsSomeSelected());
    }, n.getToggleAllRowsSelectedHandler = () => (i) => {
      n.toggleAllRowsSelected(i.target.checked);
    }, n.getToggleAllPageRowsSelectedHandler = () => (i) => {
      n.toggleAllPageRowsSelected(i.target.checked);
    };
  },
  createRow: (n, i) => {
    n.toggleSelected = (o, r) => {
      const c = n.getIsSelected();
      i.setRowSelection((f) => {
        var d;
        if (o = typeof o < "u" ? o : !c, n.getCanSelect() && c === o)
          return f;
        const g = {
          ...f
        };
        return Lg(g, n.id, o, (d = r?.selectChildren) != null ? d : !0, i), g;
      });
    }, n.getIsSelected = () => {
      const {
        rowSelection: o
      } = i.getState();
      return Cm(n, o);
    }, n.getIsSomeSelected = () => {
      const {
        rowSelection: o
      } = i.getState();
      return Ug(n, o) === "some";
    }, n.getIsAllSubRowsSelected = () => {
      const {
        rowSelection: o
      } = i.getState();
      return Ug(n, o) === "all";
    }, n.getCanSelect = () => {
      var o;
      return typeof i.options.enableRowSelection == "function" ? i.options.enableRowSelection(n) : (o = i.options.enableRowSelection) != null ? o : !0;
    }, n.getCanSelectSubRows = () => {
      var o;
      return typeof i.options.enableSubRowSelection == "function" ? i.options.enableSubRowSelection(n) : (o = i.options.enableSubRowSelection) != null ? o : !0;
    }, n.getCanMultiSelect = () => {
      var o;
      return typeof i.options.enableMultiRowSelection == "function" ? i.options.enableMultiRowSelection(n) : (o = i.options.enableMultiRowSelection) != null ? o : !0;
    }, n.getToggleSelectedHandler = () => {
      const o = n.getCanSelect();
      return (r) => {
        var c;
        o && n.toggleSelected((c = r.target) == null ? void 0 : c.checked);
      };
    };
  }
}, Lg = (n, i, o, r, c) => {
  var f;
  const d = c.getRow(i, !0);
  o ? (d.getCanMultiSelect() || Object.keys(n).forEach((g) => delete n[g]), d.getCanSelect() && (n[i] = !0)) : delete n[i], r && (f = d.subRows) != null && f.length && d.getCanSelectSubRows() && d.subRows.forEach((g) => Lg(n, g.id, o, r, c));
};
function og(n, i) {
  const o = n.getState().rowSelection, r = [], c = {}, f = function(d, g) {
    return d.map((h) => {
      var y;
      const x = Cm(h, o);
      if (x && (r.push(h), c[h.id] = h), (y = h.subRows) != null && y.length && (h = {
        ...h,
        subRows: f(h.subRows)
      }), x)
        return h;
    }).filter(Boolean);
  };
  return {
    rows: f(i.rows),
    flatRows: r,
    rowsById: c
  };
}
function Cm(n, i) {
  var o;
  return (o = i[n.id]) != null ? o : !1;
}
function Ug(n, i, o) {
  var r;
  if (!((r = n.subRows) != null && r.length)) return !1;
  let c = !0, f = !1;
  return n.subRows.forEach((d) => {
    if (!(f && !c) && (d.getCanSelect() && (Cm(d, i) ? f = !0 : c = !1), d.subRows && d.subRows.length)) {
      const g = Ug(d, i);
      g === "all" ? f = !0 : (g === "some" && (f = !0), c = !1);
    }
  }), c ? "all" : f ? "some" : !1;
}
const Vg = /([0-9]+)/gm, AO = (n, i, o) => p1(fa(n.getValue(o)).toLowerCase(), fa(i.getValue(o)).toLowerCase()), zO = (n, i, o) => p1(fa(n.getValue(o)), fa(i.getValue(o))), OO = (n, i, o) => wm(fa(n.getValue(o)).toLowerCase(), fa(i.getValue(o)).toLowerCase()), MO = (n, i, o) => wm(fa(n.getValue(o)), fa(i.getValue(o))), NO = (n, i, o) => {
  const r = n.getValue(o), c = i.getValue(o);
  return r > c ? 1 : r < c ? -1 : 0;
}, DO = (n, i, o) => wm(n.getValue(o), i.getValue(o));
function wm(n, i) {
  return n === i ? 0 : n > i ? 1 : -1;
}
function fa(n) {
  return typeof n == "number" ? isNaN(n) || n === 1 / 0 || n === -1 / 0 ? "" : String(n) : typeof n == "string" ? n : "";
}
function p1(n, i) {
  const o = n.split(Vg).filter(Boolean), r = i.split(Vg).filter(Boolean);
  for (; o.length && r.length; ) {
    const c = o.shift(), f = r.shift(), d = parseInt(c, 10), g = parseInt(f, 10), h = [d, g].sort();
    if (isNaN(h[0])) {
      if (c > f)
        return 1;
      if (f > c)
        return -1;
      continue;
    }
    if (isNaN(h[1]))
      return isNaN(d) ? -1 : 1;
    if (d > g)
      return 1;
    if (g > d)
      return -1;
  }
  return o.length - r.length;
}
const or = {
  alphanumeric: AO,
  alphanumericCaseSensitive: zO,
  text: OO,
  textCaseSensitive: MO,
  datetime: NO,
  basic: DO
}, jO = {
  getInitialState: (n) => ({
    sorting: [],
    ...n
  }),
  getDefaultColumnDef: () => ({
    sortingFn: "auto",
    sortUndefined: 1
  }),
  getDefaultOptions: (n) => ({
    onSortingChange: dn("sorting", n),
    isMultiSortEvent: (i) => i.shiftKey
  }),
  createColumn: (n, i) => {
    n.getAutoSortingFn = () => {
      const o = i.getFilteredRowModel().flatRows.slice(10);
      let r = !1;
      for (const c of o) {
        const f = c?.getValue(n.id);
        if (Object.prototype.toString.call(f) === "[object Date]")
          return or.datetime;
        if (typeof f == "string" && (r = !0, f.split(Vg).length > 1))
          return or.alphanumeric;
      }
      return r ? or.text : or.basic;
    }, n.getAutoSortDir = () => {
      const o = i.getFilteredRowModel().flatRows[0];
      return typeof o?.getValue(n.id) == "string" ? "asc" : "desc";
    }, n.getSortingFn = () => {
      var o, r;
      if (!n)
        throw new Error();
      return ks(n.columnDef.sortingFn) ? n.columnDef.sortingFn : n.columnDef.sortingFn === "auto" ? n.getAutoSortingFn() : (o = (r = i.options.sortingFns) == null ? void 0 : r[n.columnDef.sortingFn]) != null ? o : or[n.columnDef.sortingFn];
    }, n.toggleSorting = (o, r) => {
      const c = n.getNextSortingOrder(), f = typeof o < "u" && o !== null;
      i.setSorting((d) => {
        const g = d?.find((C) => C.id === n.id), h = d?.findIndex((C) => C.id === n.id);
        let y = [], x, p = f ? o : c === "desc";
        if (d != null && d.length && n.getCanMultiSort() && r ? g ? x = "toggle" : x = "add" : d != null && d.length && h !== d.length - 1 ? x = "replace" : g ? x = "toggle" : x = "replace", x === "toggle" && (f || c || (x = "remove")), x === "add") {
          var S;
          y = [...d, {
            id: n.id,
            desc: p
          }], y.splice(0, y.length - ((S = i.options.maxMultiSortColCount) != null ? S : Number.MAX_SAFE_INTEGER));
        } else x === "toggle" ? y = d.map((C) => C.id === n.id ? {
          ...C,
          desc: p
        } : C) : x === "remove" ? y = d.filter((C) => C.id !== n.id) : y = [{
          id: n.id,
          desc: p
        }];
        return y;
      });
    }, n.getFirstSortDir = () => {
      var o, r;
      return ((o = (r = n.columnDef.sortDescFirst) != null ? r : i.options.sortDescFirst) != null ? o : n.getAutoSortDir() === "desc") ? "desc" : "asc";
    }, n.getNextSortingOrder = (o) => {
      var r, c;
      const f = n.getFirstSortDir(), d = n.getIsSorted();
      return d ? d !== f && ((r = i.options.enableSortingRemoval) == null || r) && // If enableSortRemove, enable in general
      (!(o && (c = i.options.enableMultiRemove) != null) || c) ? !1 : d === "desc" ? "asc" : "desc" : f;
    }, n.getCanSort = () => {
      var o, r;
      return ((o = n.columnDef.enableSorting) != null ? o : !0) && ((r = i.options.enableSorting) != null ? r : !0) && !!n.accessorFn;
    }, n.getCanMultiSort = () => {
      var o, r;
      return (o = (r = n.columnDef.enableMultiSort) != null ? r : i.options.enableMultiSort) != null ? o : !!n.accessorFn;
    }, n.getIsSorted = () => {
      var o;
      const r = (o = i.getState().sorting) == null ? void 0 : o.find((c) => c.id === n.id);
      return r ? r.desc ? "desc" : "asc" : !1;
    }, n.getSortIndex = () => {
      var o, r;
      return (o = (r = i.getState().sorting) == null ? void 0 : r.findIndex((c) => c.id === n.id)) != null ? o : -1;
    }, n.clearSorting = () => {
      i.setSorting((o) => o != null && o.length ? o.filter((r) => r.id !== n.id) : []);
    }, n.getToggleSortingHandler = () => {
      const o = n.getCanSort();
      return (r) => {
        o && (r.persist == null || r.persist(), n.toggleSorting == null || n.toggleSorting(void 0, n.getCanMultiSort() ? i.options.isMultiSortEvent == null ? void 0 : i.options.isMultiSortEvent(r) : !1));
      };
    };
  },
  createTable: (n) => {
    n.setSorting = (i) => n.options.onSortingChange == null ? void 0 : n.options.onSortingChange(i), n.resetSorting = (i) => {
      var o, r;
      n.setSorting(i ? [] : (o = (r = n.initialState) == null ? void 0 : r.sorting) != null ? o : []);
    }, n.getPreSortedRowModel = () => n.getGroupedRowModel(), n.getSortedRowModel = () => (!n._getSortedRowModel && n.options.getSortedRowModel && (n._getSortedRowModel = n.options.getSortedRowModel(n)), n.options.manualSorting || !n._getSortedRowModel ? n.getPreSortedRowModel() : n._getSortedRowModel());
  }
}, HO = [
  tO,
  xO,
  pO,
  vO,
  lO,
  aO,
  CO,
  //depends on ColumnFaceting
  wO,
  //depends on ColumnFiltering
  jO,
  mO,
  //depends on RowSorting
  EO,
  RO,
  _O,
  TO,
  bO
];
function LO(n) {
  var i, o;
  const r = [...HO, ...(i = n._features) != null ? i : []];
  let c = {
    _features: r
  };
  const f = c._features.reduce((S, C) => Object.assign(S, C.getDefaultOptions == null ? void 0 : C.getDefaultOptions(c)), {}), d = (S) => c.options.mergeOptions ? c.options.mergeOptions(f, S) : {
    ...f,
    ...S
  };
  let h = {
    ...{},
    ...(o = n.initialState) != null ? o : {}
  };
  c._features.forEach((S) => {
    var C;
    h = (C = S.getInitialState == null ? void 0 : S.getInitialState(h)) != null ? C : h;
  });
  const y = [];
  let x = !1;
  const p = {
    _features: r,
    options: {
      ...f,
      ...n
    },
    initialState: h,
    _queue: (S) => {
      y.push(S), x || (x = !0, Promise.resolve().then(() => {
        for (; y.length; )
          y.shift()();
        x = !1;
      }).catch((C) => setTimeout(() => {
        throw C;
      })));
    },
    reset: () => {
      c.setState(c.initialState);
    },
    setOptions: (S) => {
      const C = la(S, c.options);
      c.options = d(C);
    },
    getState: () => c.options.state,
    setState: (S) => {
      c.options.onStateChange == null || c.options.onStateChange(S);
    },
    _getRowId: (S, C, R) => {
      var _;
      return (_ = c.options.getRowId == null ? void 0 : c.options.getRowId(S, C, R)) != null ? _ : `${R ? [R.id, C].join(".") : C}`;
    },
    getCoreRowModel: () => (c._getCoreRowModel || (c._getCoreRowModel = c.options.getCoreRowModel(c)), c._getCoreRowModel()),
    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: () => c.getPaginationRowModel(),
    //in next version, we should just pass in the row model as the optional 2nd arg
    getRow: (S, C) => {
      let R = (C ? c.getPrePaginationRowModel() : c.getRowModel()).rowsById[S];
      if (!R && (R = c.getCoreRowModel().rowsById[S], !R))
        throw new Error();
      return R;
    },
    _getDefaultColumnDef: Ce(() => [c.options.defaultColumn], (S) => {
      var C;
      return S = (C = S) != null ? C : {}, {
        header: (R) => {
          const _ = R.header.column.columnDef;
          return _.accessorKey ? _.accessorKey : _.accessorFn ? _.id : null;
        },
        // footer: props => props.header.column.id,
        cell: (R) => {
          var _, T;
          return (_ = (T = R.renderValue()) == null || T.toString == null ? void 0 : T.toString()) != null ? _ : null;
        },
        ...c._features.reduce((R, _) => Object.assign(R, _.getDefaultColumnDef == null ? void 0 : _.getDefaultColumnDef()), {}),
        ...S
      };
    }, we(n, "debugColumns")),
    _getColumnDefs: () => c.options.columns,
    getAllColumns: Ce(() => [c._getColumnDefs()], (S) => {
      const C = function(R, _, T) {
        return T === void 0 && (T = 0), R.map((O) => {
          const D = eO(c, O, T, _), U = O;
          return D.columns = U.columns ? C(U.columns, D, T + 1) : [], D;
        });
      };
      return C(S);
    }, we(n, "debugColumns")),
    getAllFlatColumns: Ce(() => [c.getAllColumns()], (S) => S.flatMap((C) => C.getFlatColumns()), we(n, "debugColumns")),
    _getAllFlatColumnsById: Ce(() => [c.getAllFlatColumns()], (S) => S.reduce((C, R) => (C[R.id] = R, C), {}), we(n, "debugColumns")),
    getAllLeafColumns: Ce(() => [c.getAllColumns(), c._getOrderColumnsFn()], (S, C) => {
      let R = S.flatMap((_) => _.getLeafColumns());
      return C(R);
    }, we(n, "debugColumns")),
    getColumn: (S) => c._getAllFlatColumnsById()[S]
  };
  Object.assign(c, p);
  for (let S = 0; S < c._features.length; S++) {
    const C = c._features[S];
    C == null || C.createTable == null || C.createTable(c);
  }
  return c;
}
function UO() {
  return (n) => Ce(() => [n.options.data], (i) => {
    const o = {
      rows: [],
      flatRows: [],
      rowsById: {}
    }, r = function(c, f, d) {
      f === void 0 && (f = 0);
      const g = [];
      for (let y = 0; y < c.length; y++) {
        const x = nO(n, n._getRowId(c[y], y, d), c[y], y, f, void 0, d?.id);
        if (o.flatRows.push(x), o.rowsById[x.id] = x, g.push(x), n.options.getSubRows) {
          var h;
          x.originalSubRows = n.options.getSubRows(c[y], y), (h = x.originalSubRows) != null && h.length && (x.subRows = r(x.originalSubRows, f + 1, x));
        }
      }
      return g;
    };
    return o.rows = r(i), o;
  }, we(n.options, "debugTable", "getRowModel", () => n._autoResetPageIndex()));
}
function VO() {
  return (n) => Ce(() => [n.getState().sorting, n.getPreSortedRowModel()], (i, o) => {
    if (!o.rows.length || !(i != null && i.length))
      return o;
    const r = n.getState().sorting, c = [], f = r.filter((h) => {
      var y;
      return (y = n.getColumn(h.id)) == null ? void 0 : y.getCanSort();
    }), d = {};
    f.forEach((h) => {
      const y = n.getColumn(h.id);
      y && (d[h.id] = {
        sortUndefined: y.columnDef.sortUndefined,
        invertSorting: y.columnDef.invertSorting,
        sortingFn: y.getSortingFn()
      });
    });
    const g = (h) => {
      const y = h.map((x) => ({
        ...x
      }));
      return y.sort((x, p) => {
        for (let C = 0; C < f.length; C += 1) {
          var S;
          const R = f[C], _ = d[R.id], T = _.sortUndefined, O = (S = R?.desc) != null ? S : !1;
          let D = 0;
          if (T) {
            const U = x.getValue(R.id), P = p.getValue(R.id), Q = U === void 0, B = P === void 0;
            if (Q || B) {
              if (T === "first") return Q ? -1 : 1;
              if (T === "last") return Q ? 1 : -1;
              D = Q && B ? 0 : Q ? T : -T;
            }
          }
          if (D === 0 && (D = _.sortingFn(x, p, R.id)), D !== 0)
            return O && (D *= -1), _.invertSorting && (D *= -1), D;
        }
        return x.index - p.index;
      }), y.forEach((x) => {
        var p;
        c.push(x), (p = x.subRows) != null && p.length && (x.subRows = g(x.subRows));
      }), y;
    };
    return {
      rows: g(o.rows),
      flatRows: c,
      rowsById: o.rowsById
    };
  }, we(n.options, "debugTable", "getSortedRowModel", () => n._autoResetPageIndex()));
}
function lb(n, i) {
  return n ? GO(n) ? /* @__PURE__ */ v.createElement(n, i) : n : null;
}
function GO(n) {
  return kO(n) || typeof n == "function" || BO(n);
}
function kO(n) {
  return typeof n == "function" && (() => {
    const i = Object.getPrototypeOf(n);
    return i.prototype && i.prototype.isReactComponent;
  })();
}
function BO(n) {
  return typeof n == "object" && typeof n.$$typeof == "symbol" && ["react.memo", "react.forward_ref"].includes(n.$$typeof.description);
}
function qO(n) {
  const i = {
    state: {},
    // Dummy state
    onStateChange: () => {
    },
    // noop
    renderFallbackValue: null,
    ...n
  }, [o] = v.useState(() => ({
    current: LO(i)
  })), [r, c] = v.useState(() => o.current.initialState);
  return o.current.setOptions((f) => ({
    ...f,
    ...n,
    state: {
      ...r,
      ...n.state
    },
    // Similarly, we'll maintain both our internal state and any user-provided
    // state.
    onStateChange: (d) => {
      c(d), n.onStateChange == null || n.onStateChange(d);
    }
  })), o.current;
}
const v1 = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ b.jsx(
  "table",
  {
    ref: o,
    className: Fe("w-full caption-bottom text-sm", n),
    ...i
  }
) }));
v1.displayName = "Table";
const y1 = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx("thead", { ref: o, className: Fe("[&_tr]:border-b", n), ...i }));
y1.displayName = "TableHeader";
const b1 = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  "tbody",
  {
    ref: o,
    className: Fe("[&_tr:last-child]:border-0", n),
    ...i
  }
));
b1.displayName = "TableBody";
const PO = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  "tfoot",
  {
    ref: o,
    className: Fe(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      n
    ),
    ...i
  }
));
PO.displayName = "TableFooter";
const Gg = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  "tr",
  {
    ref: o,
    className: Fe(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      n
    ),
    ...i
  }
));
Gg.displayName = "TableRow";
const S1 = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  "th",
  {
    ref: o,
    className: Fe(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      n
    ),
    ...i
  }
));
S1.displayName = "TableHead";
const x1 = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  "td",
  {
    ref: o,
    className: Fe(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      n
    ),
    ...i
  }
));
x1.displayName = "TableCell";
const IO = v.forwardRef(({ className: n, ...i }, o) => /* @__PURE__ */ b.jsx(
  "caption",
  {
    ref: o,
    className: Fe("mt-4 text-sm text-muted-foreground", n),
    ...i
  }
));
IO.displayName = "TableCaption";
function Es({ values: n }) {
  return /* @__PURE__ */ b.jsx("dl", { className: "facts", children: Object.entries(n).map(([i, o]) => /* @__PURE__ */ b.jsxs("div", { children: [
    /* @__PURE__ */ b.jsx("dt", { children: i }),
    /* @__PURE__ */ b.jsx("dd", { children: Cn(o) })
  ] }, i)) });
}
function $O({ edge: n, data: i }) {
  const [o, r] = v.useState([]), [c, f] = v.useState(""), [d, g] = v.useState(null), h = (n.evidence || []).filter(
    (T) => JSON.stringify(T).toLowerCase().includes(c.toLowerCase())
  ), y = v.useMemo(
    () => [
      {
        accessorKey: "source_id",
        header: ({ column: T }) => /* @__PURE__ */ b.jsxs(
          "button",
          {
            className: "table-sort",
            onClick: () => T.toggleSorting(T.getIsSorted() === "asc"),
            children: [
              "Source ",
              /* @__PURE__ */ b.jsx(NE, { size: 12 })
            ]
          }
        ),
        cell: ({ row: T }) => /* @__PURE__ */ b.jsx(
          "button",
          {
            className: "source-button",
            onClick: () => g(T.original.evidence_id),
            children: T.original.source_id || "Unknown"
          }
        )
      },
      {
        accessorKey: "curator_status",
        header: "Review",
        cell: ({ getValue: T }) => /* @__PURE__ */ b.jsx("span", { className: `status ${T()}`, children: Cn(T()) })
      }
    ],
    []
  ), x = qO({
    data: h,
    columns: y,
    state: { sorting: o },
    onSortingChange: r,
    getCoreRowModel: UO(),
    getSortedRowModel: VO()
  }), p = h.find((T) => T.evidence_id === d) || h[0], S = i.sources.find((T) => T.source_id === p?.source_id), C = i.experiments.find(
    (T) => T.experiment_id === p?.experiment_id
  ), R = i.contexts.find(
    (T) => T.context_id === (C?.context_id || n.context_id)
  );
  let _ = {};
  try {
    _ = typeof R?.qualifiers == "string" ? JSON.parse(R.qualifiers) : R?.qualifiers || {};
  } catch {
  }
  return /* @__PURE__ */ b.jsxs("div", { className: "evidence-view", children: [
    /* @__PURE__ */ b.jsxs("div", { className: "section-heading", children: [
      /* @__PURE__ */ b.jsx("h3", { children: "Evidence" }),
      /* @__PURE__ */ b.jsx("span", { children: h.length })
    ] }),
    /* @__PURE__ */ b.jsx(
      "input",
      {
        "aria-label": "Filter evidence",
        placeholder: "Filter records…",
        value: c,
        onChange: (T) => f(T.target.value)
      }
    ),
    /* @__PURE__ */ b.jsxs(v1, { children: [
      /* @__PURE__ */ b.jsx(y1, { children: x.getHeaderGroups().map((T) => /* @__PURE__ */ b.jsx(Gg, { children: T.headers.map((O) => /* @__PURE__ */ b.jsx(S1, { children: lb(O.column.columnDef.header, O.getContext()) }, O.id)) }, T.id)) }),
      /* @__PURE__ */ b.jsx(b1, { children: x.getRowModel().rows.map((T) => /* @__PURE__ */ b.jsx(
        Gg,
        {
          "data-state": p?.evidence_id === T.original.evidence_id ? "selected" : void 0,
          children: T.getVisibleCells().map((O) => /* @__PURE__ */ b.jsx(x1, { children: lb(O.column.columnDef.cell, O.getContext()) }, O.id))
        },
        T.original.evidence_id
      )) })
    ] }),
    p ? /* @__PURE__ */ b.jsxs("article", { className: "evidence-detail", children: [
      /* @__PURE__ */ b.jsx("h3", { children: S?.title || p.source_id || "Source record" }),
      /* @__PURE__ */ b.jsxs("div", { className: "record-tags", children: [
        /* @__PURE__ */ b.jsx("span", { className: "status", children: Cn(p.passage_status) }),
        /* @__PURE__ */ b.jsx("span", { className: "status", children: Cn(p.polarity) })
      ] }),
      /* @__PURE__ */ b.jsx("p", { className: "passage", children: p.quote_or_location || p.claim_summary || "No passage recorded." }),
      /* @__PURE__ */ b.jsx("p", { className: "muted", children: p.source_location }),
      Ng(p.source_url || S?.url) && /* @__PURE__ */ b.jsx(wn, { asChild: !0, variant: "outline", size: "sm", children: /* @__PURE__ */ b.jsxs(
        "a",
        {
          href: Ng(p.source_url || S?.url),
          target: "_blank",
          rel: "noreferrer",
          children: [
            "Open publication ",
            /* @__PURE__ */ b.jsx(jE, {})
          ]
        }
      ) }),
      /* @__PURE__ */ b.jsx("h3", { className: "subheading", children: "Conditions" }),
      /* @__PURE__ */ b.jsx(
        Es,
        {
          values: {
            Species: R?.species,
            "Cell / model": R?.cell_type,
            Stage: R?.stage,
            ...Object.fromEntries(
              Object.entries(_).map(([T, O]) => [Cn(T), O])
            )
          }
        }
      ),
      /* @__PURE__ */ b.jsxs("details", { children: [
        /* @__PURE__ */ b.jsx("summary", { children: "Record details" }),
        /* @__PURE__ */ b.jsx(
          Es,
          {
            values: {
              "Evidence ID": p.evidence_id,
              "Experiment ID": p.experiment_id,
              "Claim status": n.status,
              "Strict experimental": n.evidence_eligible ? "Eligible" : "Not eligible",
              "Causal basis": n.causal_basis,
              "Effect level": n.effect_level
            }
          }
        ),
        n.review_note && /* @__PURE__ */ b.jsx("p", { children: n.review_note }),
        p.review_note && /* @__PURE__ */ b.jsx("p", { children: p.review_note }),
        C && /* @__PURE__ */ b.jsx("pre", { children: JSON.stringify(C, null, 2) })
      ] })
    ] }) : /* @__PURE__ */ b.jsx("p", { className: "muted", children: "No matching evidence records." })
  ] });
}
const gt = window.OC_GRAPH;
function YO() {
  const n = new URLSearchParams(location.search), i = Wd(gt, n.get("node")) || Wd(gt, "HGNC:PHGDH") || gt.nodes[0], [o, r] = v.useState(i), [c, f] = v.useState(
    Wd(gt, n.get("root"))?.id || i.id
  ), [d, g] = v.useState(
    ["graph", "structure", "split"].includes(n.get("view") || "") ? n.get("view") : document.body.dataset.mode === "structure" ? "structure" : "graph"
  ), [h, y] = v.useState(n.get("scope") || "neighbors"), [x, p] = v.useState(n.get("module") || "all"), [S, C] = v.useState(n.get("evidence") || "all"), [R, _] = v.useState(n.get("species") || "all"), [T, O] = v.useState(0), [D, U] = v.useState(!0), [P, Q] = v.useState("all"), [B, H] = v.useState(""), [$, ae] = v.useState(!1), [K, se] = v.useState(!0), [oe, he] = v.useState(!0), [ge, de] = v.useState(window.innerWidth < 1e3), [Z, le] = v.useState(!1), [ie, me] = v.useState(!1), [ne, ze] = v.useState("overview"), [W, M] = v.useState(null), [E, A] = v.useState({}), [j, V] = v.useState([]);
  v.useEffect(() => {
    document.querySelector(".entity-row.selected")?.scrollIntoView({ block: "nearest" });
  }, [o.id, B, P, x, Z, K, ge]), v.useEffect(() => {
    const X = () => de(window.innerWidth < 1e3);
    return window.addEventListener("resize", X), () => window.removeEventListener("resize", X);
  }, []), v.useEffect(() => {
    const X = (Me) => {
      (Me.ctrlKey || Me.metaKey) && Me.key === "k" && (Me.preventDefault(), ae((Ln) => !Ln));
    };
    return window.addEventListener("keydown", X), () => window.removeEventListener("keydown", X);
  }, []), v.useEffect(() => {
    const X = new URL(location.href);
    for (const [Me, Ln] of Object.entries({
      node: o.id,
      root: c,
      view: d,
      scope: h,
      module: x,
      evidence: S,
      species: R
    }))
      X.searchParams.set(Me, Ln);
    history.replaceState(null, "", X), document.title = `${kt(o)} · Osteoclast`;
  }, [o.id, c, d, h, x, S, R]);
  const te = v.useMemo(() => new Map(gt.nodes.map((X) => [X.id, X])), []), F = v.useMemo(() => {
    const X = new Map(gt.nodes.map((Me) => [Me.id, []]));
    for (const Me of gt.edges)
      X.get(Me.source)?.push(Me), Me.target !== Me.source && X.get(Me.target)?.push(Me);
    return X;
  }, []), ue = v.useMemo(
    () => [
      ...new Set(
        gt.nodes.map((X) => X.physiological_pillar).filter(Boolean)
      )
    ].sort(),
    []
  ), re = gt.nodes.filter(
    (X) => (x === "all" || X.physiological_pillar === x) && (P === "all" || bl(X) === P) && [X.id, X.name, X.symbol, ...X.aliases || [], ...X.legacy_ids || []].join(" ").toLowerCase().includes(B.toLowerCase())
  ).sort(
    (X, Me) => Number(j.includes(Me.id)) - Number(j.includes(X.id)) || kt(X).localeCompare(kt(Me))
  ), ce = v.useMemo(() => {
    const X = /* @__PURE__ */ new Set([
      c,
      ...(F.get(c) || []).flatMap((Me) => [Me.source, Me.target])
    ]);
    return gt.nodes.filter(
      (Me) => (h === "neighbors" ? X.has(Me.id) : x === "all" || Me.physiological_pillar === x) && (F.get(Me.id)?.length || 0) >= T
    );
  }, [c, h, x, T]), Ee = new Set(ce.map((X) => X.id)), Qe = gt.edges.filter(
    (X) => Ee.has(X.source) && Ee.has(X.target) && Vz(X, S) && (R === "all" || (gt.contexts.find((Me) => Me.context_id === X.context_id)?.species || "unknown") === R)
  );
  function rt(X) {
    r(X), M(null), ze("overview");
  }
  function ut(X) {
    rt(X), f(X.id), y("neighbors"), le(!1);
  }
  function Je(X) {
    M(X), ze("evidence"), he(!0), ge && me(!0);
  }
  const Re = F.get(o.id) || [], Mt = /* @__PURE__ */ b.jsxs("aside", { className: "catalog-pane", children: [
    /* @__PURE__ */ b.jsxs("div", { className: "panel-title", children: [
      /* @__PURE__ */ b.jsx("h2", { children: "Explore biology" }),
      /* @__PURE__ */ b.jsx("span", { children: gt.nodes.length })
    ] }),
    /* @__PURE__ */ b.jsxs("div", { className: "search-field", children: [
      /* @__PURE__ */ b.jsx(ug, { size: 15 }),
      /* @__PURE__ */ b.jsx(
        "input",
        {
          "aria-label": "Find entity",
          placeholder: "Symbol, compound or accession…",
          value: B,
          onChange: (X) => H(X.target.value)
        }
      ),
      B && /* @__PURE__ */ b.jsx("button", { "aria-label": "Clear search", onClick: () => H(""), children: /* @__PURE__ */ b.jsx(ub, { size: 13 }) })
    ] }),
    /* @__PURE__ */ b.jsxs(
      "select",
      {
        "aria-label": "Biological module",
        value: x,
        onChange: (X) => {
          p(X.target.value), y("all");
        },
        children: [
          /* @__PURE__ */ b.jsx("option", { value: "all", children: "All biological modules" }),
          ue.map((X) => /* @__PURE__ */ b.jsx("option", { value: X, children: Cn(X) }, X))
        ]
      }
    ),
    /* @__PURE__ */ b.jsxs(
      "select",
      {
        "aria-label": "Entity type",
        className: "entity-type-filter",
        value: P,
        onChange: (X) => Q(X.target.value),
        children: [
          /* @__PURE__ */ b.jsx("option", { value: "all", children: "All entity types" }),
          [...new Set(gt.nodes.map(bl))].sort().map((X) => /* @__PURE__ */ b.jsx("option", { value: X, children: Cn(X) }, X))
        ]
      }
    ),
    /* @__PURE__ */ b.jsxs("div", { className: "list-label", children: [
      /* @__PURE__ */ b.jsxs("span", { children: [
        re.length,
        " results"
      ] }),
      /* @__PURE__ */ b.jsx("span", { children: "Relations" })
    ] }),
    /* @__PURE__ */ b.jsxs("div", { className: "entity-list", children: [
      re.map((X) => /* @__PURE__ */ b.jsxs(
        "button",
        {
          className: `entity-row ${o.id === X.id ? "selected" : ""}`,
          "aria-label": `Select ${kt(X)} · ${bl(X)} · ${X.taxon || "unknown"}`,
          "aria-pressed": o.id === X.id,
          onClick: () => ut(X),
          children: [
            /* @__PURE__ */ b.jsx("i", { style: { background: Mg(X)[0] } }),
            /* @__PURE__ */ b.jsxs("span", { className: "entity-copy", children: [
              /* @__PURE__ */ b.jsx("strong", { title: X.name, children: kt(X) }),
              /* @__PURE__ */ b.jsxs("small", { children: [
                bl(X),
                " · ",
                X.taxon || "—"
              ] })
            ] }),
            j.includes(X.id) ? /* @__PURE__ */ b.jsx(u0, { size: 12 }) : null,
            /* @__PURE__ */ b.jsx("span", { className: "degree", children: F.get(X.id)?.length })
          ]
        },
        X.id
      )),
      !re.length && /* @__PURE__ */ b.jsx("p", { className: "muted", children: "No matching entities." })
    ] }),
    /* @__PURE__ */ b.jsxs("div", { className: "catalog-bottom", children: [
      /* @__PURE__ */ b.jsxs("span", { className: "palette-dots", children: [
        /* @__PURE__ */ b.jsx("i", {}),
        /* @__PURE__ */ b.jsx("i", {}),
        /* @__PURE__ */ b.jsx("i", {}),
        /* @__PURE__ */ b.jsx("i", {})
      ] }),
      /* @__PURE__ */ b.jsx("span", { children: "Osteoclast collection" })
    ] })
  ] }), Hn = /* @__PURE__ */ b.jsxs("aside", { className: "inspector-pane", children: [
    /* @__PURE__ */ b.jsxs("div", { className: "entity-heading", children: [
      /* @__PURE__ */ b.jsxs("div", { className: "eyebrow", children: [
        bl(o),
        " ",
        /* @__PURE__ */ b.jsx("span", { children: "·" }),
        " ",
        o.taxon || "Unknown species"
      ] }),
      /* @__PURE__ */ b.jsxs("div", { className: "entity-title", children: [
        /* @__PURE__ */ b.jsx("h2", { children: kt(o) }),
        /* @__PURE__ */ b.jsx(
          Zn,
          {
            label: j.includes(o.id) ? "Unpin entity" : "Pin entity",
            active: j.includes(o.id),
            onClick: () => V(
              (X) => X.includes(o.id) ? X.filter((Me) => Me !== o.id) : [...X, o.id]
            ),
            children: /* @__PURE__ */ b.jsx(u0, {})
          }
        )
      ] }),
      /* @__PURE__ */ b.jsx("p", { children: o.name })
    ] }),
    /* @__PURE__ */ b.jsxs(x0, { className: "inspector-tabs", value: ne, onValueChange: ze, children: [
      /* @__PURE__ */ b.jsxs(pg, { children: [
        /* @__PURE__ */ b.jsx(Ba, { value: "overview", children: "Overview" }),
        /* @__PURE__ */ b.jsx(Ba, { value: "evidence", children: "Evidence" }),
        /* @__PURE__ */ b.jsx(Ba, { value: "structure", children: "Structure" })
      ] }),
      /* @__PURE__ */ b.jsxs("div", { className: "inspector-scroll", children: [
        /* @__PURE__ */ b.jsxs(us, { value: "overview", children: [
          /* @__PURE__ */ b.jsx(
            Es,
            {
              values: {
                Identifier: o.id,
                Species: o.taxon,
                Roles: o.roles?.join(", "),
                Module: o.physiological_pillar,
                Compartment: o.compartment
              }
            }
          ),
          /* @__PURE__ */ b.jsxs(
            wn,
            {
              className: "explore-action",
              variant: "outline",
              size: "sm",
              onClick: () => {
                ut(o), g("graph");
              },
              children: [
                "Explore neighborhood ",
                /* @__PURE__ */ b.jsx(zd, {})
              ]
            }
          ),
          /* @__PURE__ */ b.jsxs("div", { className: "section-heading", children: [
            /* @__PURE__ */ b.jsx("h3", { children: "Relationships" }),
            /* @__PURE__ */ b.jsx("span", { children: Re.length })
          ] }),
          /* @__PURE__ */ b.jsx("div", { className: "connection-list", children: Re.map((X) => /* @__PURE__ */ b.jsxs("button", { onClick: () => Je(X), children: [
            /* @__PURE__ */ b.jsxs("span", { className: "connection-top", children: [
              /* @__PURE__ */ b.jsxs("span", { children: [
                X.source === o.id ? "→" : "←",
                " ",
                kt(
                  te.get(
                    X.source === o.id ? X.target : X.source
                  )
                )
              ] }),
              /* @__PURE__ */ b.jsx(r0, { size: 14 })
            ] }),
            /* @__PURE__ */ b.jsxs("span", { className: "connection-meta", children: [
              Cn(X.relation).toLowerCase(),
              /* @__PURE__ */ b.jsx(
                "span",
                {
                  className: `status ${ls(X).toLowerCase()}`,
                  children: ls(X)
                }
              )
            ] })
          ] }, X.edge_id)) }),
          /* @__PURE__ */ b.jsxs("details", { children: [
            /* @__PURE__ */ b.jsx("summary", { children: "Entity fields" }),
            /* @__PURE__ */ b.jsx("pre", { children: JSON.stringify(o, null, 2) })
          ] })
        ] }),
        /* @__PURE__ */ b.jsx(us, { value: "evidence", children: W ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
          /* @__PURE__ */ b.jsx(
            "button",
            {
              className: "back-link",
              onClick: () => {
                M(null);
              },
              children: "← All relationships"
            }
          ),
          /* @__PURE__ */ b.jsxs("div", { className: "claim-heading", children: [
            /* @__PURE__ */ b.jsxs("h3", { children: [
              kt(te.get(W.source)),
              " →",
              " ",
              kt(te.get(W.target))
            ] }),
            /* @__PURE__ */ b.jsxs("span", { children: [
              Cn(W.relation).toLowerCase(),
              " ·",
              " ",
              W.sign === 1 ? "positive" : W.sign === -1 ? "negative" : "unsigned"
            ] })
          ] }),
          /* @__PURE__ */ b.jsx($O, { edge: W, data: gt }, W.edge_id)
        ] }) : /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
          /* @__PURE__ */ b.jsxs("div", { className: "section-heading", children: [
            /* @__PURE__ */ b.jsx("h3", { children: "Relationships" }),
            /* @__PURE__ */ b.jsx("span", { children: Re.length })
          ] }),
          Re.map((X) => /* @__PURE__ */ b.jsxs(
            "button",
            {
              className: "evidence-choice",
              onClick: () => Je(X),
              children: [
                /* @__PURE__ */ b.jsxs("strong", { children: [
                  kt(te.get(X.source)),
                  " → ",
                  kt(te.get(X.target))
                ] }),
                /* @__PURE__ */ b.jsxs("span", { children: [
                  Cn(X.relation).toLowerCase(),
                  " ·",
                  " ",
                  X.evidence?.length || 0,
                  " records"
                ] }),
                /* @__PURE__ */ b.jsx(
                  "span",
                  {
                    className: `status ${ls(X).toLowerCase()}`,
                    children: ls(X)
                  }
                )
              ]
            },
            X.edge_id
          ))
        ] }) }),
        /* @__PURE__ */ b.jsxs(us, { value: "structure", children: [
          /* @__PURE__ */ b.jsx(
            Es,
            {
              values: {
                "KG species": o.taxon,
                "Identity status": o.identity_status,
                "Structure mapping": E.mapping || (ps(o).length ? "Candidate" : "Unavailable"),
                ...Object.keys(E).length ? {
                  Source: E.source,
                  Accession: E.accession,
                  Origin: E.origin,
                  "Source species": E.sourceSpecies,
                  Atoms: E.atoms
                } : {}
              }
            }
          ),
          ps(o).map((X) => /* @__PURE__ */ b.jsxs(
            "a",
            {
              className: "structure-source-link",
              href: Ng(X.url),
              target: "_blank",
              rel: "noreferrer",
              children: [
                /* @__PURE__ */ b.jsx(rg, { size: 15 }),
                X.label,
                /* @__PURE__ */ b.jsx(zd, { size: 14 })
              ]
            },
            X.id
          )),
          !ps(o).length && /* @__PURE__ */ b.jsx("p", { className: "muted", children: "No structure recorded." }),
          /* @__PURE__ */ b.jsxs(
            wn,
            {
              variant: "outline",
              size: "sm",
              onClick: () => {
                g("structure"), me(!1);
              },
              children: [
                "Open structure ",
                /* @__PURE__ */ b.jsx(zd, {})
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
  return /* @__PURE__ */ b.jsx(Hz, { delayDuration: 250, children: /* @__PURE__ */ b.jsxs("div", { className: "app", children: [
    /* @__PURE__ */ b.jsxs("header", { className: "app-header", children: [
      /* @__PURE__ */ b.jsxs("a", { className: "brand", href: "index.html", children: [
        /* @__PURE__ */ b.jsx("span", { className: "brand-icon" }),
        /* @__PURE__ */ b.jsxs("span", { children: [
          "Osteoclast",
          /* @__PURE__ */ b.jsx("small", { children: "Drug discovery atlas" })
        ] })
      ] }),
      /* @__PURE__ */ b.jsx(x0, { value: d, onValueChange: g, className: "view-tabs", children: /* @__PURE__ */ b.jsxs(pg, { "aria-label": "Workspace view", children: [
        /* @__PURE__ */ b.jsxs(Ba, { value: "graph", children: [
          /* @__PURE__ */ b.jsx(kE, { size: 15 }),
          "Graph"
        ] }),
        /* @__PURE__ */ b.jsxs(Ba, { value: "structure", children: [
          /* @__PURE__ */ b.jsx(rg, { size: 15 }),
          "Structure"
        ] }),
        /* @__PURE__ */ b.jsxs(Ba, { value: "split", children: [
          /* @__PURE__ */ b.jsx(DE, { size: 15 }),
          "Split"
        ] })
      ] }) }),
      /* @__PURE__ */ b.jsxs("button", { className: "command-trigger", onClick: () => ae(!0), children: [
        /* @__PURE__ */ b.jsx(ug, { size: 15 }),
        /* @__PURE__ */ b.jsx("span", { children: "Search the atlas" }),
        /* @__PURE__ */ b.jsx("kbd", { children: "Ctrl K" })
      ] })
    ] }),
    /* @__PURE__ */ b.jsxs("div", { className: "workspace-heading", children: [
      /* @__PURE__ */ b.jsxs("div", { className: "heading-left", children: [
        /* @__PURE__ */ b.jsx(
          Zn,
          {
            label: "Toggle entity catalog",
            onClick: () => ge ? le(!0) : se((X) => !X),
            children: K ? /* @__PURE__ */ b.jsx(BE, {}) : /* @__PURE__ */ b.jsx(qE, {})
          }
        ),
        /* @__PURE__ */ b.jsx("span", { className: "breadcrumb", children: "Molecular atlas" }),
        /* @__PURE__ */ b.jsx(r0, { size: 13 }),
        /* @__PURE__ */ b.jsx("h1", { children: h === "neighbors" ? kt(te.get(c)) : x === "all" ? "All entities" : Cn(x) })
      ] }),
      /* @__PURE__ */ b.jsxs("div", { className: "heading-right", children: [
        /* @__PURE__ */ b.jsxs("span", { className: "small-count", children: [
          gt.nodes.length,
          " entities · ",
          gt.edges.length,
          " relationships"
        ] }),
        /* @__PURE__ */ b.jsx(
          Zn,
          {
            label: "Toggle inspector",
            onClick: () => ge ? me(!0) : he((X) => !X),
            children: oe ? /* @__PURE__ */ b.jsx(PE, {}) : /* @__PURE__ */ b.jsx(IE, {})
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ b.jsx("main", { className: "workspace", children: /* @__PURE__ */ b.jsxs(
      F2,
      {
        direction: "horizontal",
        autoSaveId: "osteoclast-panels",
        children: [
          !ge && K && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
            /* @__PURE__ */ b.jsx(
              Qd,
              {
                id: "catalog",
                order: 1,
                defaultSize: 19,
                minSize: 15,
                maxSize: 30,
                children: Mt
              }
            ),
            /* @__PURE__ */ b.jsx(B0, { withHandle: !0 })
          ] }),
          /* @__PURE__ */ b.jsx(Qd, { id: "canvas", order: 2, minSize: 30, defaultSize: 53, children: /* @__PURE__ */ b.jsxs("section", { className: "stage", children: [
            d !== "structure" && /* @__PURE__ */ b.jsxs("div", { className: "stage-tools", children: [
              /* @__PURE__ */ b.jsxs("div", { className: "scope-switch", children: [
                /* @__PURE__ */ b.jsx(
                  wn,
                  {
                    variant: h === "neighbors" ? "secondary" : "ghost",
                    size: "sm",
                    onClick: () => {
                      f(o.id), y("neighbors");
                    },
                    children: "Local network"
                  }
                ),
                /* @__PURE__ */ b.jsx(
                  wn,
                  {
                    variant: h === "all" ? "secondary" : "ghost",
                    size: "sm",
                    onClick: () => y("all"),
                    children: "Full network"
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "filter-compact", children: [
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    "aria-label": "Evidence filter",
                    value: S,
                    onChange: (X) => C(X.target.value),
                    children: [
                      /* @__PURE__ */ b.jsx("option", { value: "all", children: "All evidence" }),
                      /* @__PURE__ */ b.jsx("option", { value: "reviewed", children: "Reviewed" }),
                      /* @__PURE__ */ b.jsx("option", { value: "pending", children: "Pending" }),
                      /* @__PURE__ */ b.jsx("option", { value: "quarantined", children: "Quarantined" }),
                      /* @__PURE__ */ b.jsx("option", { value: "eligible", children: "Strict experimental" })
                    ]
                  }
                ),
                /* @__PURE__ */ b.jsx(
                  wn,
                  {
                    variant: D ? "secondary" : "ghost",
                    size: "icon",
                    "aria-label": "More filters",
                    "aria-expanded": D,
                    onClick: () => U((X) => !X),
                    children: /* @__PURE__ */ b.jsx(HE, {})
                  }
                )
              ] })
            ] }),
            D && d !== "structure" && /* @__PURE__ */ b.jsxs("div", { className: "filter-row", children: [
              /* @__PURE__ */ b.jsxs("label", { children: [
                "Evidence species",
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    value: R,
                    onChange: (X) => _(X.target.value),
                    children: [
                      /* @__PURE__ */ b.jsx("option", { value: "all", children: "All species" }),
                      [
                        ...new Set(
                          gt.contexts.map((X) => X.species || "unknown")
                        )
                      ].sort().map((X) => /* @__PURE__ */ b.jsx("option", { value: X, children: Cn(X) }, X))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("label", { children: [
                "Minimum relationships",
                /* @__PURE__ */ b.jsx(
                  "input",
                  {
                    type: "number",
                    min: 0,
                    max: gt.edges.length,
                    value: T,
                    onChange: (X) => O(Math.max(0, Number(X.target.value) || 0))
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsx(
                wn,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => {
                    O(0), _("all"), C("all");
                  },
                  children: "Reset"
                }
              )
            ] }),
            /* @__PURE__ */ b.jsxs("div", { className: `viewports ${d === "split" ? "split" : ""}`, children: [
              /* @__PURE__ */ b.jsx(
                "div",
                {
                  className: `graph-view ${d === "structure" ? "view-hidden" : ""}`,
                  children: /* @__PURE__ */ b.jsx(
                    Gz,
                    {
                      nodes: ce,
                      edges: Qe,
                      root: c,
                      selected: o.id,
                      onSelect: rt,
                      onExplore: ut,
                      onEdge: Je,
                      selectedEdge: W?.edge_id,
                      layoutKey: `${c}:${h}:${x}`
                    }
                  )
                }
              ),
              /* @__PURE__ */ b.jsx(
                "div",
                {
                  className: `structure-view ${d === "graph" ? "view-hidden" : ""}`,
                  children: /* @__PURE__ */ b.jsx(Zz, { entity: o, onMetadata: A })
                }
              )
            ] }),
            d !== "structure" && /* @__PURE__ */ b.jsxs("footer", { className: "stage-footer", children: [
              /* @__PURE__ */ b.jsxs("div", { className: "sign-legend", children: [
                /* @__PURE__ */ b.jsxs("span", { children: [
                  /* @__PURE__ */ b.jsx("i", { className: "positive" }),
                  "Positive"
                ] }),
                /* @__PURE__ */ b.jsxs("span", { children: [
                  /* @__PURE__ */ b.jsx("i", { className: "negative" }),
                  "Negative"
                ] }),
                /* @__PURE__ */ b.jsxs("span", { children: [
                  /* @__PURE__ */ b.jsx("i", {}),
                  "Unsigned"
                ] })
              ] }),
              /* @__PURE__ */ b.jsxs("details", { className: "legend-details", children: [
                /* @__PURE__ */ b.jsx("summary", { children: "Legend" }),
                /* @__PURE__ */ b.jsxs("div", { children: [
                  /* @__PURE__ */ b.jsx("strong", { children: "Entity types" }),
                  [
                    "Protein",
                    "Enzyme role",
                    "TF role",
                    "Gene",
                    "RNA",
                    "Compound",
                    "Reaction",
                    "Pathway"
                  ].map((X, Me) => /* @__PURE__ */ b.jsxs("span", { children: [
                    /* @__PURE__ */ b.jsx(
                      "i",
                      {
                        style: {
                          background: [
                            "#47ad85",
                            "#e76560",
                            "#247f99",
                            "#bb8139",
                            "#d2a019",
                            "#c79b22",
                            "#5b929e",
                            "#478d70"
                          ][Me]
                        }
                      }
                    ),
                    X
                  ] }, X)),
                  /* @__PURE__ */ b.jsx("strong", { children: "Evidence" }),
                  /* @__PURE__ */ b.jsx("span", { children: "Solid · reviewed passage" }),
                  /* @__PURE__ */ b.jsx("span", { children: "Dashed · pending" }),
                  /* @__PURE__ */ b.jsx("span", { children: "Dotted · quarantined" })
                ] })
              ] })
            ] })
          ] }) }),
          !ge && oe && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
            /* @__PURE__ */ b.jsx(B0, { withHandle: !0 }),
            /* @__PURE__ */ b.jsx(
              Qd,
              {
                id: "inspector",
                order: 3,
                defaultSize: 28,
                minSize: 22,
                maxSize: 42,
                children: Hn
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ b.jsx(kd, { open: Z, onOpenChange: le, children: /* @__PURE__ */ b.jsxs(fs, { className: "side-dialog", children: [
      /* @__PURE__ */ b.jsx(ds, { className: "sr-only", children: "Entity catalog" }),
      /* @__PURE__ */ b.jsx(gs, { className: "sr-only", children: "Find biological entities" }),
      Mt
    ] }) }),
    /* @__PURE__ */ b.jsx(kd, { open: ie, onOpenChange: me, children: /* @__PURE__ */ b.jsxs(fs, { className: "side-dialog", children: [
      /* @__PURE__ */ b.jsx(ds, { className: "sr-only", children: "Entity inspector" }),
      /* @__PURE__ */ b.jsx(gs, { className: "sr-only", children: "Entity, evidence and structure details" }),
      Hn
    ] }) }),
    /* @__PURE__ */ b.jsx(kd, { open: $, onOpenChange: ae, children: /* @__PURE__ */ b.jsxs(fs, { className: "command-dialog", children: [
      /* @__PURE__ */ b.jsx(ds, { className: "sr-only", children: "Find an entity" }),
      /* @__PURE__ */ b.jsx(gs, { className: "sr-only", children: "Search symbols, aliases and identifiers" }),
      /* @__PURE__ */ b.jsxs(FS, { children: [
        /* @__PURE__ */ b.jsx(XS, { placeholder: "Search entities, aliases, identifiers…" }),
        /* @__PURE__ */ b.jsxs(QS, { children: [
          /* @__PURE__ */ b.jsx(ZS, { children: "No matching entities." }),
          /* @__PURE__ */ b.jsx(KS, { heading: "Entities", children: gt.nodes.map((X) => /* @__PURE__ */ b.jsxs(
            JS,
            {
              value: [
                X.id,
                X.name,
                X.symbol,
                ...X.aliases || [],
                ...X.legacy_ids || []
              ].join(" "),
              onSelect: () => {
                ut(X), ae(!1);
              },
              children: [
                /* @__PURE__ */ b.jsx(
                  "i",
                  {
                    className: "entity-dot",
                    style: { background: Mg(X)[0] }
                  }
                ),
                /* @__PURE__ */ b.jsxs("span", { className: "command-copy", children: [
                  /* @__PURE__ */ b.jsx("strong", { children: kt(X) }),
                  /* @__PURE__ */ b.jsx("small", { children: X.name })
                ] }),
                /* @__PURE__ */ b.jsxs("span", { className: "command-type", children: [
                  bl(X),
                  " · ",
                  X.taxon || "—"
                ] })
              ]
            },
            X.id
          )) })
        ] })
      ] })
    ] }) })
  ] }) });
}
class FO extends ab.Component {
  state = { error: !1 };
  static getDerivedStateFromError() {
    return { error: !0 };
  }
  render() {
    return this.state.error ? /* @__PURE__ */ b.jsxs("main", { className: "empty-state", children: [
      /* @__PURE__ */ b.jsx("h1", { children: "Viewer unavailable" }),
      /* @__PURE__ */ b.jsx(wn, { onClick: () => location.reload(), children: "Reload" })
    ] }) : this.props.children;
  }
}
AE.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ b.jsx(FO, { children: /* @__PURE__ */ b.jsx(YO, {}) })
);
