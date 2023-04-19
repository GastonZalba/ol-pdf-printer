(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/control/Control'), require('ol/source/TileWMS'), require('ol/layer/Tile'), require('ol/proj'), require('ol/Observable'), require('jspdf'), require('pdfjs-dist'), require('ol/proj/Units')) :
  typeof define === 'function' && define.amd ? define(['ol/control/Control', 'ol/source/TileWMS', 'ol/layer/Tile', 'ol/proj', 'ol/Observable', 'jspdf', 'pdfjs-dist', 'ol/proj/Units'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PdfPrinter = factory(global.ol.control.Control, global.ol.source.TileWMS, global.ol.layer.Tile, global.ol.proj, global.ol.Observable, global.jsPDF, global.pdfjsLib, global.ol.proj.Units));
})(this, (function (Control, TileWMS, Tile, proj, Observable, jspdf, pdfjsDist, Units) { 'use strict';

  var global = window;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _typeof$1(obj) {
    "@babel/helpers - typeof";

    return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof$1(obj);
  }

  function _toPrimitive(input, hint) {
    if (_typeof$1(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (_typeof$1(res) !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }

  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof$1(key) === "symbol" ? key : String(key);
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
    return _setPrototypeOf(o, p);
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof$1(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var regeneratorRuntime$1 = {exports: {}};

  var _typeof = {exports: {}};

  (function (module) {
  	function _typeof(obj) {
  	  "@babel/helpers - typeof";

  	  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
  	    return typeof obj;
  	  } : function (obj) {
  	    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  	  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
  	}
  	module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports; 
  } (_typeof));

  var _typeofExports = _typeof.exports;

  (function (module) {
  	var _typeof = _typeofExports["default"];
  	function _regeneratorRuntime() {
  	  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
  	    return exports;
  	  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  	  var exports = {},
  	    Op = Object.prototype,
  	    hasOwn = Op.hasOwnProperty,
  	    defineProperty = Object.defineProperty || function (obj, key, desc) {
  	      obj[key] = desc.value;
  	    },
  	    $Symbol = "function" == typeof Symbol ? Symbol : {},
  	    iteratorSymbol = $Symbol.iterator || "@@iterator",
  	    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
  	    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  	  function define(obj, key, value) {
  	    return Object.defineProperty(obj, key, {
  	      value: value,
  	      enumerable: !0,
  	      configurable: !0,
  	      writable: !0
  	    }), obj[key];
  	  }
  	  try {
  	    define({}, "");
  	  } catch (err) {
  	    define = function define(obj, key, value) {
  	      return obj[key] = value;
  	    };
  	  }
  	  function wrap(innerFn, outerFn, self, tryLocsList) {
  	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
  	      generator = Object.create(protoGenerator.prototype),
  	      context = new Context(tryLocsList || []);
  	    return defineProperty(generator, "_invoke", {
  	      value: makeInvokeMethod(innerFn, self, context)
  	    }), generator;
  	  }
  	  function tryCatch(fn, obj, arg) {
  	    try {
  	      return {
  	        type: "normal",
  	        arg: fn.call(obj, arg)
  	      };
  	    } catch (err) {
  	      return {
  	        type: "throw",
  	        arg: err
  	      };
  	    }
  	  }
  	  exports.wrap = wrap;
  	  var ContinueSentinel = {};
  	  function Generator() {}
  	  function GeneratorFunction() {}
  	  function GeneratorFunctionPrototype() {}
  	  var IteratorPrototype = {};
  	  define(IteratorPrototype, iteratorSymbol, function () {
  	    return this;
  	  });
  	  var getProto = Object.getPrototypeOf,
  	    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  	  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  	  function defineIteratorMethods(prototype) {
  	    ["next", "throw", "return"].forEach(function (method) {
  	      define(prototype, method, function (arg) {
  	        return this._invoke(method, arg);
  	      });
  	    });
  	  }
  	  function AsyncIterator(generator, PromiseImpl) {
  	    function invoke(method, arg, resolve, reject) {
  	      var record = tryCatch(generator[method], generator, arg);
  	      if ("throw" !== record.type) {
  	        var result = record.arg,
  	          value = result.value;
  	        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
  	          invoke("next", value, resolve, reject);
  	        }, function (err) {
  	          invoke("throw", err, resolve, reject);
  	        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
  	          result.value = unwrapped, resolve(result);
  	        }, function (error) {
  	          return invoke("throw", error, resolve, reject);
  	        });
  	      }
  	      reject(record.arg);
  	    }
  	    var previousPromise;
  	    defineProperty(this, "_invoke", {
  	      value: function value(method, arg) {
  	        function callInvokeWithMethodAndArg() {
  	          return new PromiseImpl(function (resolve, reject) {
  	            invoke(method, arg, resolve, reject);
  	          });
  	        }
  	        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
  	      }
  	    });
  	  }
  	  function makeInvokeMethod(innerFn, self, context) {
  	    var state = "suspendedStart";
  	    return function (method, arg) {
  	      if ("executing" === state) throw new Error("Generator is already running");
  	      if ("completed" === state) {
  	        if ("throw" === method) throw arg;
  	        return doneResult();
  	      }
  	      for (context.method = method, context.arg = arg;;) {
  	        var delegate = context.delegate;
  	        if (delegate) {
  	          var delegateResult = maybeInvokeDelegate(delegate, context);
  	          if (delegateResult) {
  	            if (delegateResult === ContinueSentinel) continue;
  	            return delegateResult;
  	          }
  	        }
  	        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
  	          if ("suspendedStart" === state) throw state = "completed", context.arg;
  	          context.dispatchException(context.arg);
  	        } else "return" === context.method && context.abrupt("return", context.arg);
  	        state = "executing";
  	        var record = tryCatch(innerFn, self, context);
  	        if ("normal" === record.type) {
  	          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
  	          return {
  	            value: record.arg,
  	            done: context.done
  	          };
  	        }
  	        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
  	      }
  	    };
  	  }
  	  function maybeInvokeDelegate(delegate, context) {
  	    var methodName = context.method,
  	      method = delegate.iterator[methodName];
  	    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
  	    var record = tryCatch(method, delegate.iterator, context.arg);
  	    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
  	    var info = record.arg;
  	    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  	  }
  	  function pushTryEntry(locs) {
  	    var entry = {
  	      tryLoc: locs[0]
  	    };
  	    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  	  }
  	  function resetTryEntry(entry) {
  	    var record = entry.completion || {};
  	    record.type = "normal", delete record.arg, entry.completion = record;
  	  }
  	  function Context(tryLocsList) {
  	    this.tryEntries = [{
  	      tryLoc: "root"
  	    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  	  }
  	  function values(iterable) {
  	    if (iterable) {
  	      var iteratorMethod = iterable[iteratorSymbol];
  	      if (iteratorMethod) return iteratorMethod.call(iterable);
  	      if ("function" == typeof iterable.next) return iterable;
  	      if (!isNaN(iterable.length)) {
  	        var i = -1,
  	          next = function next() {
  	            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
  	            return next.value = undefined, next.done = !0, next;
  	          };
  	        return next.next = next;
  	      }
  	    }
  	    return {
  	      next: doneResult
  	    };
  	  }
  	  function doneResult() {
  	    return {
  	      value: undefined,
  	      done: !0
  	    };
  	  }
  	  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
  	    value: GeneratorFunctionPrototype,
  	    configurable: !0
  	  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
  	    value: GeneratorFunction,
  	    configurable: !0
  	  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
  	    var ctor = "function" == typeof genFun && genFun.constructor;
  	    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  	  }, exports.mark = function (genFun) {
  	    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  	  }, exports.awrap = function (arg) {
  	    return {
  	      __await: arg
  	    };
  	  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
  	    return this;
  	  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
  	    void 0 === PromiseImpl && (PromiseImpl = Promise);
  	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
  	    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
  	      return result.done ? result.value : iter.next();
  	    });
  	  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
  	    return this;
  	  }), define(Gp, "toString", function () {
  	    return "[object Generator]";
  	  }), exports.keys = function (val) {
  	    var object = Object(val),
  	      keys = [];
  	    for (var key in object) keys.push(key);
  	    return keys.reverse(), function next() {
  	      for (; keys.length;) {
  	        var key = keys.pop();
  	        if (key in object) return next.value = key, next.done = !1, next;
  	      }
  	      return next.done = !0, next;
  	    };
  	  }, exports.values = values, Context.prototype = {
  	    constructor: Context,
  	    reset: function reset(skipTempReset) {
  	      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
  	    },
  	    stop: function stop() {
  	      this.done = !0;
  	      var rootRecord = this.tryEntries[0].completion;
  	      if ("throw" === rootRecord.type) throw rootRecord.arg;
  	      return this.rval;
  	    },
  	    dispatchException: function dispatchException(exception) {
  	      if (this.done) throw exception;
  	      var context = this;
  	      function handle(loc, caught) {
  	        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
  	      }
  	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
  	        var entry = this.tryEntries[i],
  	          record = entry.completion;
  	        if ("root" === entry.tryLoc) return handle("end");
  	        if (entry.tryLoc <= this.prev) {
  	          var hasCatch = hasOwn.call(entry, "catchLoc"),
  	            hasFinally = hasOwn.call(entry, "finallyLoc");
  	          if (hasCatch && hasFinally) {
  	            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
  	            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
  	          } else if (hasCatch) {
  	            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
  	          } else {
  	            if (!hasFinally) throw new Error("try statement without catch or finally");
  	            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
  	          }
  	        }
  	      }
  	    },
  	    abrupt: function abrupt(type, arg) {
  	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
  	        var entry = this.tryEntries[i];
  	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
  	          var finallyEntry = entry;
  	          break;
  	        }
  	      }
  	      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
  	      var record = finallyEntry ? finallyEntry.completion : {};
  	      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
  	    },
  	    complete: function complete(record, afterLoc) {
  	      if ("throw" === record.type) throw record.arg;
  	      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
  	    },
  	    finish: function finish(finallyLoc) {
  	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
  	        var entry = this.tryEntries[i];
  	        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
  	      }
  	    },
  	    "catch": function _catch(tryLoc) {
  	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
  	        var entry = this.tryEntries[i];
  	        if (entry.tryLoc === tryLoc) {
  	          var record = entry.completion;
  	          if ("throw" === record.type) {
  	            var thrown = record.arg;
  	            resetTryEntry(entry);
  	          }
  	          return thrown;
  	        }
  	      }
  	      throw new Error("illegal catch attempt");
  	    },
  	    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
  	      return this.delegate = {
  	        iterator: values(iterable),
  	        resultName: resultName,
  	        nextLoc: nextLoc
  	      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
  	    }
  	  }, exports;
  	}
  	module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports; 
  } (regeneratorRuntime$1));

  var regeneratorRuntimeExports = regeneratorRuntime$1.exports;

  // TODO(Babel 8): Remove this file.

  var runtime = regeneratorRuntimeExports();
  var regenerator = runtime;

  // Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    if (typeof globalThis === "object") {
      globalThis.regeneratorRuntime = runtime;
    } else {
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  }

  var _regeneratorRuntime = /*@__PURE__*/getDefaultExportFromCjs(regenerator);

  var domToImageImproved = {exports: {}};

  (function (module, exports) {
  	(function(global) {

  	    var util = newUtil();
  	    var inliner = newInliner();
  	    var fontFaces = newFontFaces();
  	    var images = newImages();

  	    // Default impl options
  	    var defaultOptions = {
  	        // Default is to fail on error, no placeholder
  	        imagePlaceholder: undefined,
  	        // Default cache bust is false, it will use the cache
  	        cacheBust: false,
  	        // Use (existing) authentication credentials for external URIs (CORS requests)
  	        useCredentials: false
  	    };

  	    var domtoimage = {
  	        toSvg: toSvg,
  	        toPng: toPng,
  	        toJpeg: toJpeg,
  	        toBlob: toBlob,
  	        toPixelData: toPixelData,
  	        toCanvas: toCanvas,
  	        impl: {
  	            fontFaces: fontFaces,
  	            images: images,
  	            util: util,
  	            inliner: inliner,
  	            options: {}
  	        }
  	    };

  	    module.exports = domtoimage;

  	    /**
  	     * @param {Node} node - The DOM Node object to render
  	     * @param {Object} options - Rendering options
  	     * @param {Function} options.filter - Should return true if passed node should be included in the output
  	     *          (excluding node means excluding it's children as well). Not called on the root node.
  	     * @param {String} options.bgcolor - color for the background, any valid CSS color value.
  	     * @param {Number} options.width - width to be applied to node before rendering.
  	     * @param {Number} options.height - height to be applied to node before rendering.
  	     * @param {Object} options.style - an object whose properties to be copied to node's style before rendering.
  	     * @param {Number} options.quality - a Number between 0 and 1 indicating image quality (applicable to JPEG only),
  	     defaults to 1.0.
  	     * @param {Number} options.scale - a Number multiplier to scale up the canvas before rendering to reduce fuzzy images, defaults to 1.0.
  	     * @param {String} options.imagePlaceholder - dataURL to use as a placeholder for failed images, default behaviour is to fail fast on images we can't fetch
  	     * @param {Boolean} options.cacheBust - set to true to cache bust by appending the time to the request url
  	     * @return {Promise} - A promise that is fulfilled with a SVG image data URL
  	     * */
  	    function toSvg(node, options) {
  	        options = options || {};
  	        copyOptions(options);
  	        return Promise.resolve(node)
  	        .then(function(node) {
  	            return cloneNode(node, options.filter, true);
  	        })
  	        .then(embedFonts)
  	        .then(inlineImages)
  	        .then(applyOptions)
  	        .then(function(clone) {
  	            return makeSvgDataUri(clone,
  	              options.width || util.width(node),
  	              options.height || util.height(node)
  	            );
  	        });

  	        function applyOptions(clone) {
  	            if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;
  	            if (options.width) clone.style.width = options.width + 'px';
  	            if (options.height) clone.style.height = options.height + 'px';

  	            if (options.style)
  	                Object.keys(options.style).forEach(function(property) {
  	                    clone.style[property] = options.style[property];
  	                });

  	            return clone;
  	        }
  	    }

  	    /**
  	     * @param {Node} node - The DOM Node object to render
  	     * @param {Object} options - Rendering options, @see {@link toSvg}
  	     * @return {Promise} - A promise that is fulfilled with a Uint8Array containing RGBA pixel data.
  	     * */
  	    function toPixelData(node, options) {
  	        return draw(node, options || {})
  	        .then(function(canvas) {
  	            return canvas.getContext('2d').getImageData(
  	              0,
  	              0,
  	              util.width(node),
  	              util.height(node)
  	            ).data;
  	        });
  	    }

  	    /**
  	     * @param {Node} node - The DOM Node object to render
  	     * @param {Object} options - Rendering options, @see {@link toSvg}
  	     * @return {Promise} - A promise that is fulfilled with a PNG image data URL
  	     * */
  	    function toPng(node, options) {
  	        return draw(node, options || {})
  	        .then(function(canvas) {
  	            return canvas.toDataURL();
  	        });
  	    }

  	    /**
  	     * @param {Node} node - The DOM Node object to render
  	     * @param {Object} options - Rendering options, @see {@link toSvg}
  	     * @return {Promise} - A promise that is fulfilled with a JPEG image data URL
  	     * */
  	    function toJpeg(node, options) {
  	        options = options || {};
  	        return draw(node, options)
  	        .then(function(canvas) {
  	            return canvas.toDataURL('image/jpeg', options.quality || 1.0);
  	        });
  	    }

  	    /**
  	     * @param {Node} node - The DOM Node object to render
  	     * @param {Object} options - Rendering options, @see {@link toSvg}
  	     * @return {Promise} - A promise that is fulfilled with a PNG image blob
  	     * */
  	    function toBlob(node, options) {
  	        return draw(node, options || {})
  	        .then(util.canvasToBlob);
  	    }

  	    /**
  	     * @param {Node} node - The DOM Node object to render
  	     * @param {Object} options - Rendering options, @see {@link toSvg}
  	     * @return {Promise} - A promise that is fulfilled with a canvas object
  	     * */
  	    function toCanvas(node, options) {
  	        return draw(node, options || {});
  	    }

  	    function copyOptions(options) {
  	        // Copy options to impl options for use in impl
  	        if (typeof(options.imagePlaceholder) === 'undefined') {
  	            domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;
  	        } else {
  	            domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;
  	        }

  	        if (typeof(options.cacheBust) === 'undefined') {
  	            domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;
  	        } else {
  	            domtoimage.impl.options.cacheBust = options.cacheBust;
  	        }

  	        if(typeof(options.useCredentials) === 'undefined') {
  	            domtoimage.impl.options.useCredentials = defaultOptions.useCredentials;
  	        } else {
  	            domtoimage.impl.options.useCredentials = options.useCredentials;
  	        }
  	    }

  	    function draw(domNode, options) {
  	        return toSvg(domNode, options)
  	        .then(util.makeImage)
  	        .then(util.delay(100))
  	        .then(function(image) {
  	            var scale = typeof(options.scale) !== 'number' ? 1 : options.scale;
  	            console.log('scale', scale);
  	            var canvas = newCanvas(domNode, scale);
  	            var ctx = canvas.getContext('2d');
  	            if (image) {
  	                //console.log('should be scaled', image);
  	                ctx.scale(scale, scale);
  	                //canvas.height = 620;
  	                //ctx.drawImage(image, 150, 600, 1150, 700, 0, 0, 1150, 700);
  	                // canvas.height = options.image.height + 50;
  	                // //canvas.width = options.image.width - 135;// - options.image.offsetRight
  	                // canvas.width = options.image.width - options.image.offsetRight - options.image.offsetLeft + 60;
  	                // ctx.drawImage(image, options.image.offsetLeft, options.image.offsetTop - 50, options.image.width, options.image.height + 50, 0, 0, options.image.width, options.image.height);

  	                if (options.canvas && options.canvas.width) {
  	                    canvas.width = options.canvas.width;
  	                }

  	                if (options.canvas && options.canvas.height) {
  	                    canvas.height = options.canvas.height;
  	                }

  	                if (options.canvas) {
  	                    console.log('canv', options.canvas);
  	                    ctx.drawImage(
  	                      image,
  	                      options.canvas.sx  || 0,
  	                      options.canvas.sy || 0,
  	                      options.canvas.sw || options.width,
  	                      options.canvas.sh || options.height,
  	                      options.canvas.dx || 0,
  	                      options.canvas.dy || 0,
  	                      options.canvas.dw || options.width,
  	                      options.canvas.dh || options.height
  	                    );
  	                } else {
  	                    ctx.drawImage(image, 0, 0);
  	                }

  	            }
  	            return canvas;
  	        });

  	        function newCanvas(domNode, scale) {
  	            var canvas = document.createElement('canvas');
  	            canvas.width = (options.width || util.width(domNode)) * scale;
  	            canvas.height = (options.height || util.height(domNode)) * scale;

  	            console.log(canvas.width, canvas.height);

  	            if (options.bgcolor) {
  	                var ctx = canvas.getContext('2d');
  	                ctx.fillStyle = options.bgcolor;
  	                ctx.fillRect(0, 0, canvas.width, canvas.height);
  	            }

  	            return canvas;
  	        }
  	    }

  	    function cloneNode(node, filter, root) {
  	        if (!root && filter && !filter(node)) return Promise.resolve();

  	        return Promise.resolve(node)
  	        .then(makeNodeCopy)
  	        .then(function(clone) {
  	            return cloneChildren(node, clone, filter);
  	        })
  	        .then(function(clone) {
  	            return processClone(node, clone);
  	        });

  	        function makeNodeCopy(node) {
  	            if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());
  	            return node.cloneNode(false);
  	        }

  	        function cloneChildren(original, clone, filter) {
  	            var children = original.tagName === 'use' ? copyShadowChild(original) : original.childNodes;
  	            if (children.length === 0) return Promise.resolve(clone);

  	            return cloneChildrenInOrder(clone, util.asArray(children), filter)
  	            .then(function() {
  	                return clone;
  	            });

  	            function cloneChildrenInOrder(parent, children, filter) {
  	                var done = Promise.resolve();
  	                children.forEach(function(child) {
  	                    done = done
  	                    .then(function() {
  	                        return cloneNode(child, filter);
  	                    })
  	                    .then(function(childClone) {
  	                        if (childClone) parent.appendChild(childClone);
  	                    });
  	                });
  	                return done;
  	            }
  	        }

  	        function copyShadowChild(original) {
  	            var child = document.getElementById(original.href.baseVal.replace('#', ''));
  	            return [child.cloneNode(true)];
  	        }

  	        function processClone(original, clone) {
  	            if (!(clone instanceof Element)) return clone;

  	            return Promise.resolve()
  	            .then(cloneStyle)
  	            .then(clonePseudoElements)
  	            .then(copyUserInput)
  	            .then(fixSvg)
  	            .then(function() {
  	                return clone;
  	            });

  	            function cloneStyle() {
  	                copyStyle(window.getComputedStyle(original), clone.style);

  	                if (util.isChrome() && clone.style.marker && ( clone.tagName === 'line' || clone.tagName === 'path')) {
  	                    clone.style.marker = '';
  	                }

  	                function copyStyle(source, target) {
  	                    if (source.cssText) {
  	                        target.cssText = source.cssText;
  	                        target.font = source.font; // here, we re-assign the font prop.
  	                    } else copyProperties(source, target);

  	                    function copyProperties(source, target) {
  	                        util.asArray(source).forEach(function(name) {
  	                            target.setProperty(
  	                              name,
  	                              source.getPropertyValue(name),
  	                              source.getPropertyPriority(name)
  	                            );
  	                        });
  	                    }
  	                }
  	            }

  	            function clonePseudoElements() {
  	                [':before', ':after'].forEach(function(element) {
  	                    clonePseudoElement(element);
  	                });

  	                function clonePseudoElement(element) {
  	                    var style = window.getComputedStyle(original, element);
  	                    var content = style.getPropertyValue('content');

  	                    if (content === '' || content === 'none') return;

  	                    var className = util.uid();
  	                    var currentClass = clone.getAttribute('class');
  	                    if (currentClass) {
  	                        clone.setAttribute('class', currentClass + ' ' + className);
  	                    }

  	                    var styleElement = document.createElement('style');
  	                    styleElement.appendChild(formatPseudoElementStyle(className, element, style));
  	                    clone.appendChild(styleElement);

  	                    function formatPseudoElementStyle(className, element, style) {
  	                        var selector = '.' + className + ':' + element;
  	                        var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);
  	                        return document.createTextNode(selector + '{' + cssText + '}');

  	                        function formatCssText(style) {
  	                            var content = style.getPropertyValue('content');
  	                            return style.cssText + ' content: ' + content + ';';
  	                        }

  	                        function formatCssProperties(style) {

  	                            return util.asArray(style)
  	                            .map(formatProperty)
  	                            .join('; ') + ';';

  	                            function formatProperty(name) {
  	                                return name + ': ' +
  	                                  style.getPropertyValue(name) +
  	                                  (style.getPropertyPriority(name) ? ' !important' : '');
  	                            }
  	                        }
  	                    }
  	                }
  	            }

  	            function copyUserInput() {
  	                if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
  	                if (original instanceof HTMLInputElement) clone.setAttribute("value", original.value);
  	            }

  	            function fixSvg() {
  	                if (!(clone instanceof SVGElement)) return;
  	                clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  	                if (!(clone instanceof SVGRectElement)) return;
  	                ['width', 'height'].forEach(function(attribute) {
  	                    var value = clone.getAttribute(attribute);
  	                    if (!value) return;

  	                    clone.style.setProperty(attribute, value);
  	                });
  	            }
  	        }
  	    }

  	    function embedFonts(node) {
  	        return fontFaces.resolveAll()
  	        .then(function(cssText) {
  	            var styleNode = document.createElement('style');
  	            node.appendChild(styleNode);
  	            styleNode.appendChild(document.createTextNode(cssText));
  	            return node;
  	        });
  	    }

  	    function inlineImages(node) {
  	        return images.inlineAll(node)
  	        .then(function() {
  	            return node;
  	        });
  	    }

  	    function makeSvgDataUri(node, width, height) {
  	        return Promise.resolve(node)
  	        .then(function(node) {
  	            node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
  	            return new XMLSerializer().serializeToString(node);
  	        })
  	        .then(util.escapeXhtml)
  	        .then(function(xhtml) {
  	            return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>';
  	        })
  	        .then(function(foreignObject) {
  	            return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
  	              foreignObject + '</svg>';
  	        })
  	        .then(function(svg) {
  	            return 'data:image/svg+xml;charset=utf-8,' + svg;
  	        });
  	    }

  	    function newUtil() {
  	        return {
  	            escape: escape,
  	            parseExtension: parseExtension,
  	            mimeType: mimeType,
  	            dataAsUrl: dataAsUrl,
  	            isDataUrl: isDataUrl,
  	            canvasToBlob: canvasToBlob,
  	            resolveUrl: resolveUrl,
  	            getAndEncode: getAndEncode,
  	            uid: uid(),
  	            delay: delay,
  	            asArray: asArray,
  	            isChrome: isChrome,
  	            escapeXhtml: escapeXhtml,
  	            makeImage: makeImage,
  	            width: width,
  	            height: height
  	        };

  	        function mimes() {
  	            /*
  	             * Only WOFF and EOT mime types for fonts are 'real'
  	             * see http://www.iana.org/assignments/media-types/media-types.xhtml
  	             */
  	            var WOFF = 'application/font-woff';
  	            var JPEG = 'image/jpeg';

  	            return {
  	                'woff': WOFF,
  	                'woff2': WOFF,
  	                'ttf': 'application/font-truetype',
  	                'eot': 'application/vnd.ms-fontobject',
  	                'png': 'image/png',
  	                'jpg': JPEG,
  	                'jpeg': JPEG,
  	                'gif': 'image/gif',
  	                'tiff': 'image/tiff',
  	                'svg': 'image/svg+xml'
  	            };
  	        }

  	        function parseExtension(url) {
  	            var match = /\.([^\.\/]*?)(\?|$)/g.exec(url);
  	            if (match) return match[1];
  	            else return '';
  	        }

  	        function mimeType(url) {
  	            var extension = parseExtension(url).toLowerCase();
  	            return mimes()[extension] || '';
  	        }

  	        function isDataUrl(url) {
  	            return url.search(/^(data:)/) !== -1;
  	        }

  	        function toBlob(canvas) {
  	            return new Promise(function(resolve) {
  	                var binaryString = window.atob(canvas.toDataURL().split(',')[1]);
  	                var length = binaryString.length;
  	                var binaryArray = new Uint8Array(length);

  	                for (var i = 0; i < length; i++)
  	                    binaryArray[i] = binaryString.charCodeAt(i);

  	                resolve(new Blob([binaryArray], {
  	                    type: 'image/png'
  	                }));
  	            });
  	        }

  	        function canvasToBlob(canvas) {
  	            if (canvas.toBlob)
  	                return new Promise(function(resolve) {
  	                    canvas.toBlob(resolve);
  	                });

  	            return toBlob(canvas);
  	        }

  	        function resolveUrl(url, baseUrl) {
  	            var doc = document.implementation.createHTMLDocument();
  	            var base = doc.createElement('base');
  	            doc.head.appendChild(base);
  	            var a = doc.createElement('a');
  	            doc.body.appendChild(a);
  	            base.href = baseUrl;
  	            a.href = url;
  	            return a.href;
  	        }

  	        function uid() {
  	            var index = 0;

  	            return function() {
  	                return 'u' + fourRandomChars() + index++;

  	                function fourRandomChars() {
  	                    /* see http://stackoverflow.com/a/6248722/2519373 */
  	                    return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
  	                }
  	            };
  	        }

  	        function makeImage(uri) {
  	            if (uri === 'data:,') return Promise.resolve();
  	            return new Promise(function(resolve, reject) {
  	                var image = new Image();
  	                if(domtoimage.impl.options.useCredentials) {
  	                    image.crossOrigin = 'use-credentials';
  	                }
  	                image.onload = function() {
  	                    resolve(image);
  	                };
  	                image.onerror = reject;
  	                image.src = uri;
  	            });
  	        }

  	        function getAndEncode(url) {
  	            var TIMEOUT = 30000;
  	            if (domtoimage.impl.options.cacheBust) {
  	                // Cache bypass so we dont have CORS issues with cached images
  	                // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
  	                url += ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
  	            }

  	            return new Promise(function(resolve) {
  	                var request = new XMLHttpRequest();

  	                request.onreadystatechange = done;
  	                request.ontimeout = timeout;
  	                request.responseType = 'blob';
  	                request.timeout = TIMEOUT;
  	                if(domtoimage.impl.options.useCredentials) {
  	                    request.withCredentials = true;
  	                }
  	                request.open('GET', url, true);
  	                request.send();

  	                var placeholder;
  	                if (domtoimage.impl.options.imagePlaceholder) {
  	                    var split = domtoimage.impl.options.imagePlaceholder.split(/,/);
  	                    if (split && split[1]) {
  	                        placeholder = split[1];
  	                    }
  	                }

  	                function done() {
  	                    if (request.readyState !== 4) return;

  	                    if (request.status !== 200) {
  	                        if (placeholder) {
  	                            resolve(placeholder);
  	                        } else {
  	                            fail('cannot fetch resource: ' + url + ', status: ' + request.status);
  	                        }

  	                        return;
  	                    }

  	                    var encoder = new FileReader();
  	                    encoder.onloadend = function() {
  	                        var content = encoder.result.split(/,/)[1];
  	                        resolve(content);
  	                    };
  	                    encoder.readAsDataURL(request.response);
  	                }

  	                function timeout() {
  	                    if (placeholder) {
  	                        resolve(placeholder);
  	                    } else {
  	                        fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url);
  	                    }
  	                }

  	                function fail(message) {
  	                    console.error(message);
  	                    resolve('');
  	                }
  	            });
  	        }

  	        function dataAsUrl(content, type) {
  	            return 'data:' + type + ';base64,' + content;
  	        }

  	        function escape(string) {
  	            return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
  	        }

  	        function isChrome() {
  	            return /chrome/i.test( navigator.userAgent );
  	        }

  	        function delay(ms) {
  	            return function(arg) {
  	                return new Promise(function(resolve) {
  	                    setTimeout(function() {
  	                        resolve(arg);
  	                    }, ms);
  	                });
  	            };
  	        }

  	        function asArray(arrayLike) {
  	            var array = [];
  	            var length = arrayLike.length;
  	            for (var i = 0; i < length; i++) array.push(arrayLike[i]);
  	            return array;
  	        }

  	        function escapeXhtml(string) {
  	            return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
  	        }

  	        function width(node) {
  	            var leftBorder = px(node, 'border-left-width');
  	            var rightBorder = px(node, 'border-right-width');
  	            return node.scrollWidth + leftBorder + rightBorder;
  	        }

  	        function height(node) {
  	            var topBorder = px(node, 'border-top-width');
  	            var bottomBorder = px(node, 'border-bottom-width');
  	            return node.scrollHeight + topBorder + bottomBorder;
  	        }

  	        function px(node, styleProperty) {
  	            var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
  	            return parseFloat(value.replace('px', ''));
  	        }
  	    }

  	    function newInliner() {
  	        var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

  	        return {
  	            inlineAll: inlineAll,
  	            shouldProcess: shouldProcess,
  	            impl: {
  	                readUrls: readUrls,
  	                inline: inline
  	            }
  	        };

  	        function shouldProcess(string) {
  	            return string.search(URL_REGEX) !== -1;
  	        }

  	        function readUrls(string) {
  	            var result = [];
  	            var match;
  	            while ((match = URL_REGEX.exec(string)) !== null) {
  	                result.push(match[1]);
  	            }
  	            return result.filter(function(url) {
  	                return !util.isDataUrl(url);
  	            });
  	        }

  	        function inline(string, url, baseUrl, get) {
  	            return Promise.resolve(url)
  	            .then(function(url) {
  	                return baseUrl ? util.resolveUrl(url, baseUrl) : url;
  	            })
  	            .then(get || util.getAndEncode)
  	            .then(function(data) {
  	                return util.dataAsUrl(data, util.mimeType(url));
  	            })
  	            .then(function(dataUrl) {
  	                return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3');
  	            });

  	            function urlAsRegex(url) {
  	                return new RegExp('(url\\([\'"]?)(' + util.escape(url) + ')([\'"]?\\))', 'g');
  	            }
  	        }

  	        function inlineAll(string, baseUrl, get) {
  	            if (nothingToInline()) return Promise.resolve(string);

  	            return Promise.resolve(string)
  	            .then(readUrls)
  	            .then(function(urls) {
  	                var done = Promise.resolve(string);
  	                urls.forEach(function(url) {
  	                    done = done.then(function(string) {
  	                        return inline(string, url, baseUrl, get);
  	                    });
  	                });
  	                return done;
  	            });

  	            function nothingToInline() {
  	                return !shouldProcess(string);
  	            }
  	        }
  	    }

  	    function newFontFaces() {
  	        return {
  	            resolveAll: resolveAll,
  	            impl: {
  	                readAll: readAll
  	            }
  	        };

  	        function resolveAll() {
  	            return readAll()
  	            .then(function(webFonts) {
  	                return Promise.all(
  	                  webFonts.map(function(webFont) {
  	                      return webFont.resolve();
  	                  })
  	                );
  	            })
  	            .then(function(cssStrings) {
  	                return cssStrings.join('\n');
  	            });
  	        }

  	        function readAll() {
  	            return Promise.resolve(util.asArray(document.styleSheets))
  	            .then(getCssRules)
  	            .then(selectWebFontRules)
  	            .then(function(rules) {
  	                return rules.map(newWebFont);
  	            });

  	            function selectWebFontRules(cssRules) {
  	                return cssRules
  	                .filter(function(rule) {
  	                    return rule.type === CSSRule.FONT_FACE_RULE;
  	                })
  	                .filter(function(rule) {
  	                    return inliner.shouldProcess(rule.style.getPropertyValue('src'));
  	                });
  	            }

  	            function getCssRules(styleSheets) {
  	                var cssRules = [];
  	                styleSheets.forEach(function(sheet) {
  	                    if (sheet.hasOwnProperty("cssRules")) {
  	                        try {
  	                            util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
  	                        } catch (e) {
  	                            console.log('Error while reading CSS rules from ' + sheet.href, e.toString());
  	                        }
  	                    }
  	                });
  	                return cssRules;
  	            }

  	            function newWebFont(webFontRule) {
  	                return {
  	                    resolve: function resolve() {
  	                        var baseUrl = (webFontRule.parentStyleSheet || {}).href;
  	                        return inliner.inlineAll(webFontRule.cssText, baseUrl);
  	                    },
  	                    src: function() {
  	                        return webFontRule.style.getPropertyValue('src');
  	                    }
  	                };
  	            }
  	        }
  	    }

  	    function newImages() {
  	        return {
  	            inlineAll: inlineAll,
  	            impl: {
  	                newImage: newImage
  	            }
  	        };

  	        function newImage(element) {
  	            return {
  	                inline: inline
  	            };

  	            function inline(get) {
  	                if (util.isDataUrl(element.src)) return Promise.resolve();

  	                return Promise.resolve(element.src)
  	                .then(get || util.getAndEncode)
  	                .then(function(data) {
  	                    return util.dataAsUrl(data, util.mimeType(element.src));
  	                })
  	                .then(function(dataUrl) {
  	                    return new Promise(function(resolve, reject) {
  	                        element.onload = resolve;
  	                        // for any image with invalid src(such as <img src />), just ignore it
  	                        element.onerror = resolve;
  	                        element.src = dataUrl;
  	                    });
  	                });
  	            }
  	        }

  	        function inlineAll(node) {
  	            if (!(node instanceof Element)) return Promise.resolve(node);

  	            return inlineBackground(node)
  	            .then(function() {
  	                if (node instanceof HTMLImageElement)
  	                    return newImage(node).inline();
  	                else
  	                    return Promise.all(
  	                      util.asArray(node.childNodes).map(function(child) {
  	                          return inlineAll(child);
  	                      })
  	                    );
  	            });

  	            function inlineBackground(node) {
  	                var background = node.style.getPropertyValue('background');

  	                if (!background) return Promise.resolve(node);

  	                return inliner.inlineAll(background)
  	                .then(function(inlined) {
  	                    node.style.setProperty(
  	                      'background',
  	                      inlined,
  	                      node.style.getPropertyPriority('background')
  	                    );
  	                })
  	                .then(function() {
  	                    return node;
  	                });
  	            }
  	        }
  	    }
  	})(); 
  } (domToImageImproved));

  var domToImageImprovedExports = domToImageImproved.exports;
  var domtoimage = /*@__PURE__*/getDefaultExportFromCjs(domToImageImprovedExports);

  function createElement(tagName) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }
    if (tagName === 'null' || tagName === null) return children;
    if (typeof tagName === 'function') return tagName(attrs, children);
    var elem = document.createElement(tagName);
    Object.entries(attrs || {}).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];
      if (_typeof$1(value) !== undefined && value !== null) {
        if (name.startsWith('on') && name.toLowerCase() in window && typeof value === 'function') elem.addEventListener(name.toLowerCase().substr(2), value);else {
          if (name === 'className') elem.setAttribute('class', value.toString());else if (name === 'htmlFor') elem.setAttribute('for', value.toString());else elem.setAttribute(name, value.toString());
        }
      }
    });
    for (var _i = 0, _children = children; _i < _children.length; _i++) {
      var child = _children[_i];
      if (!child) continue;
      if (Array.isArray(child)) elem.append.apply(elem, _toConsumableArray(child));else {
        if (child.nodeType === undefined) elem.innerHTML += child;else elem.appendChild(child);
      }
    }
    return elem;
  }

  /**
   * @private
   */
  var Pdf = /*#__PURE__*/function () {
    function Pdf(params) {
      var _this = this;
      _classCallCheck(this, Pdf);
      _defineProperty(this, "_pdf", void 0);
      _defineProperty(this, "_view", void 0);
      _defineProperty(this, "_scaleDenominator", void 0);
      _defineProperty(this, "_form", void 0);
      _defineProperty(this, "_style", void 0);
      _defineProperty(this, "_i18n", void 0);
      _defineProperty(this, "_config", void 0);
      /**
       *
       * @protected
       */
      _defineProperty(this, "addMapHelpers", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var _this$_config, mapElements, extraInfo, style, watermark;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _this$_config = _this._config, mapElements = _this$_config.mapElements, extraInfo = _this$_config.extraInfo, style = _this$_config.style, watermark = _this$_config.watermark;
              _this._style = style;
              if (!watermark) {
                _context.next = 5;
                break;
              }
              _context.next = 5;
              return _this._addWatermark(watermark);
            case 5:
              if (!mapElements) {
                _context.next = 12;
                break;
              }
              if (!(mapElements.compass && _this._form.compass)) {
                _context.next = 9;
                break;
              }
              _context.next = 9;
              return _this._addCompass(mapElements.compass);
            case 9:
              if (mapElements.description && _this._form.description) {
                _this._addDescription();
              }
              if (mapElements.scalebar && _this._form.scalebar) {
                _this._addScaleBar();
              }
              if (mapElements.attributions && _this._form.attributions) {
                _this._addAttributions();
              }
            case 12:
              if (extraInfo) {
                // Bottom info
                if (extraInfo.url) {
                  _this._addUrl();
                }
                if (extraInfo.date) {
                  _this._addDate();
                }
                if (extraInfo.specs) {
                  _this._addSpecs();
                }
              }
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee);
      })));
      /**
       * Convert an SVGElement to an PNG string
       * @param svg
       * @returns
       */
      _defineProperty(this, "_processSvgImage", function (svg) {
        // https://stackoverflow.com/questions/3975499/convert-svg-to-image-jpeg-png-etc-in-the-browser#answer-58142441
        return new Promise(function (resolve, reject) {
          var svgToPng = function svgToPng(svg, callback) {
            var url = getSvgUrl(svg);
            svgUrlToPng(url, function (imgData) {
              callback(imgData);
              URL.revokeObjectURL(url);
            });
          };
          var getSvgUrl = function getSvgUrl(svg) {
            return URL.createObjectURL(new Blob([svg.outerHTML], {
              type: 'image/svg+xml'
            }));
          };
          var svgUrlToPng = function svgUrlToPng(svgUrl, callback) {
            var svgImage = document.createElement('img');
            document.body.appendChild(svgImage);
            svgImage.onerror = function (err) {
              console.error(err);
              return reject(_this._i18n.errorImage);
            };
            svgImage.onload = function () {
              try {
                var canvas = document.createElement('canvas');
                canvas.width = svgImage.clientWidth;
                canvas.height = svgImage.clientHeight;
                var canvasCtx = canvas.getContext('2d');
                canvasCtx.drawImage(svgImage, 0, 0);
                var imgData = canvas.toDataURL('image/png');
                callback(imgData);
                document.body.removeChild(svgImage);
              } catch (err) {
                return reject(err);
              }
            };
            svgImage.src = svgUrl;
          };
          svgToPng(svg, function (imgData) {
            resolve(imgData);
          });
        });
      });
      /**
       *
       * @param position
       * @param offset
       * @param size
       * @returns
       * @protected
       */
      _defineProperty(this, "_calculateOffsetByPosition", function (position, offset) {
        var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var x, y;
        switch (position) {
          case 'topleft':
            x = offset.x + _this._style.paperMargin;
            y = offset.y + _this._style.paperMargin + size;
            break;
          case 'topright':
            x = _this._pdf.width - offset.x - _this._style.paperMargin;
            y = offset.y + _this._style.paperMargin + size;
            break;
          case 'bottomright':
            x = _this._pdf.width - offset.x - _this._style.paperMargin;
            y = _this._pdf.height - offset.y - _this._style.paperMargin - size;
            break;
          case 'bottomleft':
            y = _this._pdf.height - offset.y - _this._style.paperMargin - size;
            x = offset.x + _this._style.paperMargin;
            break;
        }
        return {
          x: x,
          y: y
        };
      });
      /**
       *
       * @param x
       * @param y
       * @param width
       * @param height
       * @param bkcolor
       * @param brcolor
       * @protected
       */
      _defineProperty(this, "_addRoundedBox", function (x, y, width, height, bkcolor, brcolor) {
        var rounding = 1;
        _this._pdf.doc.setDrawColor(brcolor);
        _this._pdf.doc.setFillColor(bkcolor);
        _this._pdf.doc.roundedRect(x, y, width, height, rounding, rounding, 'FD');
      });
      /**
       *
       * @param x
       * @param y
       * @param width
       * @param fontSize
       * @param color
       * @param align
       * @param str
       * @protected
       */
      _defineProperty(this, "_addText", function (x, y, width, fontSize, color) {
        var align = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'left';
        var str = arguments.length > 6 ? arguments[6] : undefined;
        _this._pdf.doc.setTextColor(color);
        _this._pdf.doc.setFontSize(fontSize);
        _this._pdf.doc.text(str, x, y, {
          align: align
        });
      });
      /**
       *
       * @param position
       * @param offset
       * @param width
       * @param fontSize
       * @param color
       * @param align
       * @param str
       * @protected
       */
      _defineProperty(this, "_addTextByOffset", function (position, offset, width, fontSize, color, align, str) {
        var _this$_calculateOffse = _this._calculateOffsetByPosition(position, offset),
          x = _this$_calculateOffse.x,
          y = _this$_calculateOffse.y;
        var fixX = align === 'center' ? x - width / 2 : x;
        _this._addText(fixX, y, width, fontSize, color, align, str);
      });
      /**
       * @protected
       */
      _defineProperty(this, "_addDescription", function () {
        var str = _this._form.description.trim();
        var position = 'topleft';
        var offset = {
          x: 2,
          y: 2
        };
        var fontSize = 8;
        var maxWidth = 50;
        var paddingBack = 4;
        var _this$_calculateOffse2 = _this._calculateOffsetByPosition(position, offset),
          x = _this$_calculateOffse2.x,
          y = _this$_calculateOffse2.y;
        _this._pdf.doc.setTextColor(_this._style.txcolor);
        _this._pdf.doc.setFontSize(fontSize);
        var _this$_pdf$doc$getTex = _this._pdf.doc.getTextDimensions(str, {
            maxWidth: maxWidth
          }),
          w = _this$_pdf$doc$getTex.w,
          h = _this$_pdf$doc$getTex.h;
        _this._addRoundedBox(x, y, w + paddingBack * 2, h + paddingBack, _this._style.bkcolor, _this._style.brcolor);
        _this._pdf.doc.text(str, x + paddingBack, y + paddingBack, {
          align: 'left',
          maxWidth: maxWidth
        });
      });
      /**
       * This functions is a mess
       * @returns
       * @protected
       */
      _defineProperty(this, "_addWatermark", /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(watermark) {
          var position, offset, fontSize, imageSize, fontSizeSubtitle, back, _this$_calculateOffse3, x, y, paddingBack, acumulativeWidth, _this$_pdf$doc$getTex2, w, wSub, height, widthBack, _this$_pdf$doc$getTex3, _w, _widthBack, marginTop, addImage, _widthBack2, imgData;
          return _regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                position = 'topright';
                offset = {
                  x: 0,
                  y: 0
                };
                fontSize = 14;
                imageSize = 12;
                fontSizeSubtitle = fontSize / 1.8;
                back = false;
                _this$_calculateOffse3 = _this._calculateOffsetByPosition(position, offset), x = _this$_calculateOffse3.x, y = _this$_calculateOffse3.y;
                paddingBack = 2;
                acumulativeWidth = watermark.logo ? imageSize + 0.5 : 0;
                if (watermark.title) {
                  _this._pdf.doc.setTextColor(watermark.titleColor);
                  _this._pdf.doc.setFontSize(fontSize);
                  _this._pdf.doc.setFont('helvetica', 'bold');
                  // This function works bad
                  _this$_pdf$doc$getTex2 = _this._pdf.doc.getTextDimensions(watermark.title), w = _this$_pdf$doc$getTex2.w;
                  if (watermark.subtitle) {
                    _this._pdf.doc.setFontSize(fontSizeSubtitle);
                    wSub = _this._pdf.doc.getTextDimensions(watermark.subtitle).w;
                    w = wSub - 4 > w ? wSub : w + 4; // weird fix needed
                    _this._pdf.doc.setFontSize(fontSize);
                  } else {
                    w += 4;
                  }
                  // Adaptable width, fixed height
                  height = 16;
                  widthBack = w + paddingBack;
                  _this._addRoundedBox(x - widthBack + 4 - acumulativeWidth, y - 4, widthBack + acumulativeWidth, height, '#ffffff', '#ffffff');
                  back = true;
                  _this._pdf.doc.text(watermark.title, x, y + paddingBack + 3 + (!watermark.subtitle ? 2 : 0), {
                    align: 'right'
                  });
                  acumulativeWidth += w;
                }
                if (watermark.subtitle) {
                  _this._pdf.doc.setTextColor(watermark.subtitleColor);
                  _this._pdf.doc.setFontSize(fontSizeSubtitle);
                  _this._pdf.doc.setFont('helvetica', 'normal');
                  if (!back) {
                    _this$_pdf$doc$getTex3 = _this._pdf.doc.getTextDimensions(watermark.subtitle), _w = _this$_pdf$doc$getTex3.w;
                    _widthBack = paddingBack * 2 + _w;
                    _this._addRoundedBox(x - _widthBack + 3 - acumulativeWidth, y - 4, _widthBack + acumulativeWidth, 16, '#ffffff', '#ffffff');
                    acumulativeWidth += _widthBack;
                    back = true;
                  }
                  marginTop = watermark.title ? fontSize / 2 : 4;
                  _this._pdf.doc.text(watermark.subtitle, x, y + paddingBack + marginTop, {
                    align: 'right'
                  });
                }
                if (watermark.logo) {
                  _context2.next = 13;
                  break;
                }
                return _context2.abrupt("return");
              case 13:
                addImage = function addImage(image) {
                  _this._pdf.doc.addImage(image, 'PNG', x - acumulativeWidth + paddingBack * 2 - 1, y - 1, imageSize, imageSize);
                };
                if (!back) {
                  _widthBack2 = acumulativeWidth + paddingBack;
                  _this._addRoundedBox(x - _widthBack2 + 4, y - 4, _widthBack2, 16, '#ffffff', '#ffffff');
                }
                if (!(watermark.logo instanceof Image)) {
                  _context2.next = 20;
                  break;
                }
                addImage(watermark.logo);
                return _context2.abrupt("return");
              case 20:
                if (!(typeof watermark.logo === 'string')) {
                  _context2.next = 24;
                  break;
                }
                imgData = watermark.logo;
                _context2.next = 31;
                break;
              case 24:
                if (!(watermark.logo instanceof SVGElement)) {
                  _context2.next = 30;
                  break;
                }
                _context2.next = 27;
                return _this._processSvgImage(watermark.logo);
              case 27:
                imgData = _context2.sent;
                _context2.next = 31;
                break;
              case 30:
                throw _this._i18n.errorImage;
              case 31:
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  var image = new Image(imageSize, imageSize);
                  image.onload = function () {
                    try {
                      addImage(image);
                      resolve();
                    } catch (err) {
                      return reject(err);
                    }
                  };
                  image.onerror = function () {
                    return reject(_this._i18n.errorImage);
                  };
                  image.src = imgData;
                }));
              case 32:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }());
      /**
       * @protected
       */
      _defineProperty(this, "_addDate", function () {
        var position = 'bottomright';
        var width = 250;
        var offset = {
          x: 0,
          y: -5
        };
        var fontSize = 7;
        var txcolor = '#000000';
        var align = 'right';
        _this._pdf.doc.setFont('helvetica', 'normal');
        var str = new Date(Date.now()).toLocaleDateString(_this._config.dateFormat);
        _this._addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
      });
      /**
       * @protected
       */
      _defineProperty(this, "_addUrl", function () {
        var position = 'bottomleft';
        var width = 250;
        var offset = {
          x: 0,
          y: -6.5
        };
        var fontSize = 6;
        var txcolor = '#000000';
        var align = 'left';
        _this._pdf.doc.setFont('helvetica', 'italic');
        var str = window.location.href;
        _this._addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
      });
      /**
       * @protected
       */
      _defineProperty(this, "_addSpecs", function () {
        var position = 'bottomleft';
        var offset = {
          x: 0,
          y: -3.5
        };
        var fontSize = 6;
        var txcolor = '#000000';
        var align = 'left';
        _this._pdf.doc.setFont('helvetica', 'bold');
        _this._pdf.doc.setFontSize(fontSize);
        var scale = "".concat(_this._i18n.scale, " 1:").concat(_this._scaleDenominator.toLocaleString('de'));
        var paper = "".concat(_this._i18n.paper, " ").concat(_this._form.format.toUpperCase());
        var dpi = "".concat(_this._form.resolution, " DPI");
        var specs = [scale, dpi, paper];
        var str = specs.join(' - ');
        var _this$_pdf$doc$getTex4 = _this._pdf.doc.getTextDimensions(str),
          w = _this$_pdf$doc$getTex4.w;
        _this._addTextByOffset(position, offset, w, fontSize, txcolor, align, str);
      });
      /**
       * The attributions are obtained from the Control in the DOM.
       * @protected
       */
      _defineProperty(this, "_addAttributions", function () {
        var attributionsUl = document.querySelector('.ol-attribution ul');
        if (!attributionsUl) return;
        var ATTRI_SEPATATOR = ' · ';
        var position = 'bottomright';
        var offset = {
          x: 1,
          y: 1
        };
        var fontSize = 7;
        _this._pdf.doc.setFont('helvetica', 'normal');
        _this._pdf.doc.setFontSize(fontSize);
        var _this$_calculateOffse4 = _this._calculateOffsetByPosition(position, offset),
          x = _this$_calculateOffse4.x,
          y = _this$_calculateOffse4.y;
        var xPos = x;
        var _this$_pdf$doc$getTex5 = _this._pdf.doc.getTextDimensions(attributionsUl.textContent),
          w = _this$_pdf$doc$getTex5.w,
          h = _this$_pdf$doc$getTex5.h;
        var paddingBack = 4;
        var whiteSpaceWidth = _this._pdf.doc.getTextDimensions(ATTRI_SEPATATOR).w;
        var attributions = document.querySelectorAll('.ol-attribution li');
        var sumWhiteSpaceWidth = whiteSpaceWidth * (attributions.length - 1);
        _this._addRoundedBox(x - w - sumWhiteSpaceWidth - 2, y - h, w + paddingBack + sumWhiteSpaceWidth + 2, h + paddingBack, '#ffffff', '#ffffff');
        Array.from(attributions).reverse().forEach(function (attribution, index) {
          Array.from(attribution.childNodes).reverse().forEach(function (node) {
            var content = node.textContent;
            if ('href' in node) {
              _this._pdf.doc.setTextColor('#0077cc');
              _this._pdf.doc.textWithLink(content, xPos, y, {
                align: 'right',
                url: node.href
              });
            } else {
              _this._pdf.doc.setTextColor('#666666');
              _this._pdf.doc.text(content, xPos, y, {
                align: 'right'
              });
            }
            var _this$_pdf$doc$getTex6 = _this._pdf.doc.getTextDimensions(content),
              w = _this$_pdf$doc$getTex6.w;
            xPos -= w;
          });
          // Excldue last element
          if (index !== attributions.length - 1) {
            // To add separation between diferents attributtions
            _this._pdf.doc.text(ATTRI_SEPATATOR, xPos, y, {
              align: 'right'
            });
            xPos -= whiteSpaceWidth;
          }
        });
      });
      /**
       * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
       * @protected
       */
      _defineProperty(this, "_addScaleBar", function () {
        var offset = {
          x: 2,
          y: 2
        };
        var maxWidth = 90; // in mm
        // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10#Polyfill
        var log10 = Math.log10 ||
        // more precise, but unsupported by IE
        function (x) {
          return Math.log(x) * Math.LOG10E;
        };
        var maxLength = maxWidth * _this._scaleDenominator;
        var unit;
        var unitConversionFactor;
        if (_this._config.units === 'metric') {
          unit = 'mm';
          var millimetre = 1;
          var metre = 1000;
          var kilometre = metre * 1000;
          unitConversionFactor = millimetre;
          if (maxLength >= kilometre * 10) {
            unit = 'km';
            unitConversionFactor = 1e6;
          } else if (maxLength >= metre * 10) {
            unit = 'm';
            unitConversionFactor = metre;
          }
        } else if (_this._config.units === 'imperial') {
          var inch = 25.4; // Millimetre to inch
          var mile = inch * 63360;
          var yard = inch * 36;
          unit = 'in';
          unitConversionFactor = inch;
          if (maxLength >= mile * 10) {
            unit = 'mi';
            unitConversionFactor = mile;
          } else if (maxLength >= yard * 10) {
            unit = 'yd';
            unitConversionFactor = yard;
          }
        }
        maxLength /= unitConversionFactor;
        var unroundedLength = maxLength;
        var numberOfDigits = Math.floor(log10(unroundedLength));
        var factor = Math.pow(10, numberOfDigits);
        var mapped = unroundedLength / factor;
        var length = Math.floor(maxLength); // just to have an upper limit
        // manually only use numbers that are very nice to devide by 4
        // note that this is taken into account for rounding later
        if (mapped > 8) {
          length = 8 * factor;
        } else if (mapped > 4) {
          length = 4 * factor;
        } else if (mapped > 2) {
          length = 2 * factor;
        } else {
          length = factor;
        }
        var size = length * unitConversionFactor / _this._scaleDenominator / 4;
        var percentageMargin = _this._style.paperMargin ? _this._style.paperMargin * 2 / _this._pdf.width * 100 : null;
        // Reduce length acording to margins
        size = percentageMargin ? size / 100 * (100 - percentageMargin) : size;
        var fullSize = size * 4;
        // x/y defaults to offset for topleft corner (normal x/y coordinates)
        var x = offset.x + _this._style.paperMargin;
        var y = offset.y + _this._style.paperMargin;
        y = _this._pdf.height - offset.y - 10 - _this._style.paperMargin;
        // to give the outer white box 4mm padding
        var scaleBarX = x + 4;
        var scaleBarY = y + 5; // 5 because above the scalebar will be the numbers
        // draw outer box
        _this._addRoundedBox(x, y, fullSize + 8, 10, _this._style.bkcolor, _this._style.brcolor);
        // draw first part of scalebar
        _this._pdf.doc.setDrawColor(_this._style.brcolor);
        _this._pdf.doc.setFillColor(0, 0, 0);
        _this._pdf.doc.rect(scaleBarX, scaleBarY, size, 1, 'FD');
        // draw second part of scalebar
        _this._pdf.doc.setDrawColor(_this._style.brcolor);
        _this._pdf.doc.setFillColor(255, 255, 255);
        _this._pdf.doc.rect(scaleBarX + size, scaleBarY, size, 1, 'FD');
        // draw third part of scalebar
        _this._pdf.doc.setDrawColor(_this._style.brcolor);
        _this._pdf.doc.setFillColor(0, 0, 0);
        _this._pdf.doc.rect(scaleBarX + size * 2, scaleBarY, size * 2, 1, 'FD');
        // draw numeric labels above scalebar
        _this._pdf.doc.setTextColor(_this._style.txcolor);
        _this._pdf.doc.setFontSize(6);
        _this._pdf.doc.text('0', scaleBarX, scaleBarY - 1);
        // /4 and could give 2.5. We still round, because of floating point arith
        _this._pdf.doc.text(String(Math.round(length * 10 / 4) / 10), scaleBarX + size - 1, scaleBarY - 1);
        _this._pdf.doc.text(String(Math.round(length / 2)), scaleBarX + size * 2 - 2, scaleBarY - 1);
        _this._pdf.doc.text(Math.round(length).toString() + ' ' + unit, scaleBarX + size * 4 - 4, scaleBarY - 1);
      });
      /**
       *
       * @param imgSrc
       * @returns
       * @protected
       */
      _defineProperty(this, "_addCompass", /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(imgSrc) {
          var position, offset, size, rotationRadians, imageSize, _this$_calculateOffse5, x, y, addRotation, addImage, image, imgData;
          return _regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                position = 'bottomright';
                offset = {
                  x: 2,
                  y: 6
                };
                size = 6;
                rotationRadians = _this._view.getRotation();
                imageSize = 100;
                _this$_calculateOffse5 = _this._calculateOffsetByPosition(position, offset, size), x = _this$_calculateOffse5.x, y = _this$_calculateOffse5.y;
                addRotation = function addRotation(image) {
                  var canvas = document.createElement('canvas');
                  // Must be bigger than the image to prevent clipping
                  canvas.height = 120;
                  canvas.width = 120;
                  var context = canvas.getContext('2d');
                  context.translate(canvas.width * 0.5, canvas.height * 0.5);
                  context.rotate(rotationRadians);
                  context.translate(-canvas.width * 0.5, -canvas.height * 0.5);
                  context.drawImage(image, (canvas.height - imageSize) / 2, (canvas.width - imageSize) / 2, imageSize, imageSize);
                  // Add back circle
                  var xCircle = x - size;
                  var yCircle = y;
                  _this._pdf.doc.setDrawColor(_this._style.brcolor);
                  _this._pdf.doc.setFillColor(_this._style.bkcolor);
                  _this._pdf.doc.circle(xCircle, yCircle, size, 'FD');
                  return canvas;
                };
                addImage = function addImage(image) {
                  var rotatedCanvas = addRotation(image);
                  var sizeImage = size * 1.5;
                  var xImage = x - sizeImage - size / 4.3;
                  var yImage = y - sizeImage / 2;
                  _this._pdf.doc.addImage(rotatedCanvas, 'PNG', xImage, yImage, sizeImage, sizeImage);
                };
                if (!(imgSrc instanceof Image)) {
                  _context3.next = 13;
                  break;
                }
                addImage(image);
                return _context3.abrupt("return");
              case 13:
                if (!(typeof imgSrc === 'string')) {
                  _context3.next = 17;
                  break;
                }
                imgData = imgSrc;
                _context3.next = 24;
                break;
              case 17:
                if (!(imgSrc instanceof SVGElement)) {
                  _context3.next = 23;
                  break;
                }
                _context3.next = 20;
                return _this._processSvgImage(imgSrc);
              case 20:
                imgData = _context3.sent;
                _context3.next = 24;
                break;
              case 23:
                throw _this._i18n.errorImage;
              case 24:
                return _context3.abrupt("return", new Promise(function (resolve, reject) {
                  var image = new Image(imageSize, imageSize);
                  image.onload = function () {
                    addImage(image);
                    resolve();
                  };
                  image.onerror = function () {
                    reject(_this._i18n.errorImage);
                  };
                  image.src = imgData;
                }));
              case 25:
              case "end":
                return _context3.stop();
            }
          }, _callee3);
        }));
        return function (_x2) {
          return _ref3.apply(this, arguments);
        };
      }());
      var view = params.view,
        form = params.form,
        i18n = params.i18n,
        config = params.config,
        _height = params.height,
        _width = params.width,
        scaleResolution = params.scaleResolution;
      this._view = view;
      this._form = form;
      this._i18n = i18n;
      this._config = config;
      this._pdf = this.create(this._form.orientation, this._form.format, _height, _width);
      this._scaleDenominator = this._calculateScaleDenominator(this._form.resolution, scaleResolution);
    }
    /**
     *
     * @param orientation
     * @param format
     * @param width
     * @param height
     * @returns
     * @protected
     */
    _createClass(Pdf, [{
      key: "create",
      value: function create(orientation, format, height, width) {
        var _window$jspdf;
        // UMD support
        var _jsPDF = ((_window$jspdf = window.jspdf) === null || _window$jspdf === void 0 ? void 0 : _window$jspdf.jsPDF) || jspdf.jsPDF;
        return {
          doc: new _jsPDF({
            orientation: orientation,
            format: format
          }),
          height: height,
          width: width
        };
      }
      /**
       *
       * @param dataUrl
       * @protected
       */
    }, {
      key: "addMapImage",
      value: function addMapImage(dataUrl) {
        this._pdf.doc.addImage(dataUrl, 'JPEG', this._config.style.paperMargin,
        // Add margins
        this._config.style.paperMargin, this._pdf.width - this._config.style.paperMargin * 2, this._pdf.height - this._config.style.paperMargin * 2);
      }
    }, {
      key: "savePdf",
      value:
      /**
       * @protected
       */
      function savePdf() {
        var _this2 = this;
        var downloadURI = function downloadURI(uri, name) {
          var link = createElement("a", {
            download: name,
            href: uri
          });
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        return new Promise(function (resolve, reject) {
          if (_this2._form.typeExport === 'pdf') {
            _this2._pdf.doc.save(_this2._config.filename + '.pdf');
            resolve();
          } else {
            var _window, _window$pdfjsLib;
            var pdf = _this2._pdf.doc.output('dataurlstring');
            // UMD support
            var versionPdfJS = ((_window = window) === null || _window === void 0 ? void 0 : (_window$pdfjsLib = _window.pdfjsLib) === null || _window$pdfjsLib === void 0 ? void 0 : _window$pdfjsLib.version) || pdfjsDist.version;
            pdfjsDist.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/".concat(versionPdfJS, "/pdf.worker.js");
            pdfjsDist.getDocument(pdf).promise.then(function (pdf) {
              pdf.getPage(1).then(function (page) {
                var scale = 2;
                var viewport = page.getViewport({
                  scale: scale
                });
                // Prepare canvas
                var canvas = createElement("canvas", null);
                canvas.style.display = 'none';
                document.body.appendChild(canvas);
                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                // Render PDF page into canvas context
                var task = page.render({
                  canvasContext: context,
                  viewport: viewport
                });
                task.promise.then(function () {
                  downloadURI(canvas.toDataURL("image/".concat(_this2._form.typeExport)), _this2._config.filename + ".".concat(_this2._form.typeExport));
                  canvas.remove();
                  resolve();
                });
              });
            }, function (error) {
              reject(error);
              console.log(error);
            });
          }
        });
      }
    }, {
      key: "_calculateScaleDenominator",
      value:
      /**
       * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
       * @protected
       */
      function _calculateScaleDenominator(resolution, scaleResolution) {
        var pixelsPerMapMillimeter = resolution / 25.4;
        return Math.round(1000 * pixelsPerMapMillimeter * this._getMeterPerPixel(scaleResolution));
      }
      /**
       * @protected
       */
    }, {
      key: "_getMeterPerPixel",
      value: function _getMeterPerPixel(scaleResolution) {
        var proj$1 = this._view.getProjection();
        return proj.getPointResolution(proj$1, scaleResolution, this._view.getCenter()) * proj$1.getMetersPerUnit();
      }
    }]);
    return Pdf;
  }();

  var domain;

  // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).
  function EventHandlers() {}
  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }

  // nodejs oddity
  // require('events') === require('events').EventEmitter
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.usingDomains = false;

  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function() {
    this.domain = null;
    if (EventEmitter.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active ) ;
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n))
      throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.
  function emitNone(handler, isFn, self) {
    if (isFn)
      handler.call(self);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self);
    }
  }
  function emitOne(handler, isFn, self, arg1) {
    if (isFn)
      handler.call(self, arg1);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1);
    }
  }
  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn)
      handler.call(self, arg1, arg2);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2);
    }
  }
  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn)
      handler.call(self, arg1, arg2, arg3);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2, arg3);
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn)
      handler.apply(self, args);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].apply(self, args);
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = (type === 'error');

    events = this._events;
    if (events)
      doError = (doError && events.error == null);
    else if (!doError)
      return false;

    domain = this.domain;

    // If there is no 'error' event listener then throw.
    if (doError) {
      er = arguments[1];
      if (domain) {
        if (!er)
          er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
      return false;
    }

    handler = events[type];

    if (!handler)
      return false;

    var isFn = typeof handler === 'function';
    len = arguments.length;
    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;
      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;
      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;
      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower
      default:
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        emitMany(handler, isFn, this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');

    events = target._events;
    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type,
                    listener.listener ? listener.listener : listener);

        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] :
                                            [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      }

      // Check for listener leak
      if (!existing.warned) {
        m = $getMaxListeners(target);
        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + type + ' listeners added. ' +
                              'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }
  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };

  function _onceWrap(target, type, listener) {
    var fired = false;
    function g() {
      target.removeListener(type, g);
      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }
    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;

        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');

        events = this._events;
        if (!events)
          return this;

        list = events[type];
        if (!list)
          return this;

        if (list === listener || (list.listener && list.listener === listener)) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;

          for (i = list.length; i-- > 0;) {
            if (list[i] === listener ||
                (list[i].listener && list[i].listener === listener)) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (list.length === 1) {
            list[0] = undefined;
            if (--this._eventsCount === 0) {
              this._events = new EventHandlers();
              return this;
            } else {
              delete events[type];
            }
          } else {
            spliceOne(list, position);
          }

          if (events.removeListener)
            this.emit('removeListener', type, originalListener || listener);
        }

        return this;
      };
      
  // Alias for removeListener added in NodeJS 10.0
  // https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
  EventEmitter.prototype.off = function(type, listener){
      return this.removeListener(type, listener);
  };

  EventEmitter.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events;

        events = this._events;
        if (!events)
          return this;

        // not listening for removeListener, no need to emit
        if (!events.removeListener) {
          if (arguments.length === 0) {
            this._events = new EventHandlers();
            this._eventsCount = 0;
          } else if (events[type]) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else
              delete events[type];
          }
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          for (var i = 0, key; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = new EventHandlers();
          this._eventsCount = 0;
          return this;
        }

        listeners = events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners) {
          // LIFO order
          do {
            this.removeListener(type, listeners[listeners.length - 1]);
          } while (listeners[0]);
        }

        return this;
      };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;

    if (!events)
      ret = [];
    else {
      evlistener = events[type];
      if (!evlistener)
        ret = [];
      else if (typeof evlistener === 'function')
        ret = [evlistener.listener || evlistener];
      else
        ret = unwrapListeners(evlistener);
    }

    return ret;
  };

  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  };

  // About 1.5x faster than the two-arg version of Array#splice().
  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
      list[i] = list[k];
    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);
    while (i--)
      copy[i] = arr[i];
    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }

  /**
   * Vanilla JS Modal compatible with Bootstrap
   * modal-vanilla 0.12.0 <https://github.com/KaneCohen/modal-vanilla>
   * Copyright 2020 Kane Cohen <https://github.com/KaneCohen>
   * Available under BSD-3-Clause license
   */

  let _factory = null;

  const _defaults = Object.freeze({
    el: null,               // Existing DOM element that will be 'Modal-ized'.
    animate: true,          // Show Modal using animation.
    animateClass: 'fade',   //
    animateInClass: 'show', //
    appendTo: 'body',       // DOM element to which constructed Modal will be appended.
    backdrop: true,         // Boolean or 'static', Show Modal backdrop blocking content.
    keyboard: true,         // Close modal on esc key.
    title: false,           // Content of the title in the constructed dialog.
    header: true,           // Show header content.
    content: false,         // Either string or an HTML element.
    footer: true,           // Footer content. By default will use buttons.
    buttons: null,          //
    headerClose: true,      // Show close button in the header.
    construct: false,       // Creates new HTML with a given content.
    transition: 300,        //
    backdropTransition: 150 //
  });

  const _buttons = deepFreeze({
    dialog: [
      {text: 'Cancel',
        value: false,
        attr: {
          'class': 'btn btn-default',
          'data-dismiss': 'modal'
        }
      },
      {text: 'OK',
        value: true,
        attr: {
          'class': 'btn btn-primary',
          'data-dismiss': 'modal'
        }
      }
    ],
    alert: [
      {text: 'OK',
        attr: {
          'class': 'btn btn-primary',
          'data-dismiss': 'modal'
        }
      }
    ],
    confirm: [
      {text: 'Cancel',
        value: false,
        attr: {
          'class': 'btn btn-default',
          'data-dismiss': 'modal'
        }
      },
      {text: 'OK',
        value: true,
        attr: {
          'class': 'btn btn-primary',
          'data-dismiss': 'modal'
        }
      }
    ]
  });

  const _templates = {
    container: '<div class="modal"></div>',
    dialog: '<div class="modal-dialog"></div>',
    content: '<div class="modal-content"></div>',
    header: '<div class="modal-header"></div>',
    headerClose: '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>',
    body: '<div class="modal-body"></div>',
    footer: '<div class="modal-footer"></div>',
    backdrop: '<div class="modal-backdrop"></div>'
  };

  function deepFreeze(obj) {
    for (let k in obj) {
      if (Array.isArray(obj[k])) {
        obj[k].forEach(v => {
          deepFreeze(v);
        });
      } else if (obj[k] !== null && typeof obj[k] === 'object') {
        Object.freeze(obj[k]);
      }
    }
    return Object.freeze(obj);
  }

  function guid() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16) +
      (((1 + Math.random()) * 0x10000) | 0).toString(16);
  }

  function data(el, prop, value) {
   let prefix = 'data';
   let elData = el[prefix] || {};
   if (typeof value === 'undefined') {
     if (el[prefix] && el[prefix][prop]) {
       return el[prefix][prop];
     } else {
       var dataAttr = el.getAttribute(`${prefix}-${prop}`);
       if (typeof dataAttr !== 'undefined') {
         return dataAttr;
       }
       return null;
     }
   } else {
     elData[prop] = value;
     el[prefix] = elData;
     return el;
   }
  }

  function build(html, all) {
    if (html.nodeName) return html;
    html = html.replace(/(\t|\n$)/g, '');

    if (!_factory) {
      _factory = document.createElement('div');
    }

    _factory.innerHTML = '';
    _factory.innerHTML = html;
    if (all === true) {
      return _factory.childNodes;
    } else {
      return _factory.childNodes[0];
    }
  }

  function calcScrollbarWidth() {
    let inner;
    let width;
    let outerWidth;
    let outer = document.createElement('div');
    Object.assign(outer.style, {
      visibility: 'hidden',
      width: '100px'
    });
    document.body.appendChild(outer);

    outerWidth = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    width = outerWidth - inner.offsetWidth;
    document.body.removeChild(outer);

    return width;
  }

  function getPath(node) {
    let nodes = [node];
    while (node.parentNode) {
      node = node.parentNode;
      nodes.push(node);
    }
    return nodes;
  }

  class Modal extends EventEmitter {
    static set templates(templates) {
      this._baseTemplates = templates;
    }

    static get templates() {
      return Object.assign({}, _templates, Modal._baseTemplates || {});
    }

    static set buttons(buttons) {
      this._baseButtons = buttons;
    }

    static get buttons() {
      return Object.assign({}, _buttons, Modal._baseButtons || {});
    }

    static set options(options) {
      this._baseOptions = options;
    }

    static get options() {
      return Object.assign({}, _defaults, Modal._baseOptions || {});
    }

    static get version() {
      return '0.12.0';
    }

    static alert(message, _options = {}) {
      let options = Object.assign({},
        _defaults,
        {
          title:  message,
          content: false,
          construct: true,
          headerClose: false,
          buttons: Modal.buttons.alert
        },
        _options
      );

      return new Modal(options);
    }

    static confirm(question, _options = {}) {
      let options = Object.assign({},
        _defaults,
        {
          title:  question,
          content: false,
          construct: true,
          headerClose: false,
          buttons: Modal.buttons.confirm
        },
        _options
      );

      return new Modal(options);
    }

    constructor(options = {}) {
      super();

      this.id = guid();
      this.el = null;
      this._html = {};
      this._events = {};
      this._visible = false;
      this._pointerInContent = false;
      this._options = Object.assign({}, Modal.options, options);
      this._templates = Object.assign({}, Modal.templates, options.templates || {});
      this._html.appendTo = document.querySelector(this._options.appendTo);
      this._scrollbarWidth = calcScrollbarWidth();

      if (this._options.buttons === null) {
        this._options.buttons = Modal.buttons.dialog;
      }

      if (this._options.el) {
        let el = this._options.el;
        if (typeof this._options.el == 'string') {
          el = document.querySelector(this._options.el);
          if (! el) {
            throw new Error(`Selector: DOM Element ${this._options.el} not found.`);
          }
        }
        data(el, 'modal', this);
        this.el = el;
      } else {
        this._options.construct = true;
      }

      if (this._options.construct) {
        this._render();
      } else {
        this._mapDom();
      }
    }

    _render() {
      let html = this._html;
      let o = this._options;
      let t = this._templates;
      let animate = o.animate ? o.animateClass : false;

      html.container = build(t.container);
      html.dialog = build(t.dialog);
      html.content = build(t.content);
      html.header = build(t.header);
      html.headerClose = build(t.headerClose);
      html.body = build(t.body);
      html.footer = build(t.footer);
      if (animate) html.container.classList.add(animate);

      this._setHeader();
      this._setContent();
      this._setFooter();

      this.el = html.container;

      html.dialog.appendChild(html.content);
      html.container.appendChild(html.dialog);

      return this;
    }

    _mapDom() {
      let html = this._html;
      let o = this._options;

      if (this.el.classList.contains(o.animateClass)) {
        o.animate = true;
      }

      html.container = this.el;
      html.dialog = this.el.querySelector('.modal-dialog');
      html.content = this.el.querySelector('.modal-content');
      html.header = this.el.querySelector('.modal-header');
      html.headerClose = this.el.querySelector('.modal-header .close');
      html.body = this.el.querySelector('.modal-body');
      html.footer = this.el.querySelector('.modal-footer');

      this._setHeader();
      this._setContent();
      this._setFooter();

      return this;
    }

    _setHeader() {
      let html = this._html;
      let o = this._options;

      if (o.header && html.header) {
        if (o.title.nodeName) {
          html.header.innerHTML = o.title.outerHTML;
        } else if (typeof o.title === 'string') {
          html.header.innerHTML = `<h4 class="modal-title">${o.title}</h4>`;
        }
        // Add header close button only to constructed modals.
        if (this.el === null && html.headerClose && o.headerClose) {
          html.header.appendChild(html.headerClose);
        }
        if (o.construct) {
          html.content.appendChild(html.header);
        }
      }
    }

    _setContent() {
      let html = this._html;
      let o = this._options;

      if (o.content && html.body) {
        if (typeof o.content === 'string') {
          html.body.innerHTML = o.content;
        } else {
          html.body.innerHTML = o.content.outerHTML;
        }
        if (o.construct) {
          html.content.appendChild(html.body);
        }
      }
    }

    _setFooter() {
      let html = this._html;
      let o = this._options;

      if (o.footer && html.footer) {
        if (o.footer.nodeName) {
          html.footer.ineerHTML = o.footer.outerHTML;
        } else if (typeof o.footer === 'string') {
          html.footer.innerHTML = o.footer;
        } else if (! html.footer.children.length) {
          o.buttons.forEach((button) => {
            let el = document.createElement('button');
            data(el, 'button', button);
            el.innerHTML = button.text;
            el.setAttribute('type', 'button');
            for (let j in button.attr) {
              el.setAttribute(j, button.attr[j]);
            }
            html.footer.appendChild(el);
          });
        }
        if (o.construct) {
          html.content.appendChild(html.footer);
        }
      }

    }

    _setEvents() {
      this._options;
      let html = this._html;

      this._events.keydownHandler = this._handleKeydownEvent.bind(this);
      document.body.addEventListener('keydown',
        this._events.keydownHandler
      );

      this._events.mousedownHandler = this._handleMousedownEvent.bind(this);
      html.container.addEventListener('mousedown',
        this._events.mousedownHandler
      );

      this._events.clickHandler = this._handleClickEvent.bind(this);
      html.container.addEventListener('click',
        this._events.clickHandler
      );

      this._events.resizeHandler = this._handleResizeEvent.bind(this);
      window.addEventListener('resize',
        this._events.resizeHandler
      );
    }

    _handleMousedownEvent(e) {
      this._pointerInContent = false;
      let path = getPath(e.target);
      path.every(node => {
        if (node.classList && node.classList.contains('modal-content')) {
          this._pointerInContent = true;
          return false;
        }
        return true;
      });
    }

    _handleClickEvent(e) {
      let path = getPath(e.target);
      path.every(node => {
        if (node.tagName === 'HTML') {
          return false;
        }
        if (this._options.backdrop !== true && node.classList.contains('modal')) {
          return false;
        }
        if (node.classList.contains('modal-content')) {
          return false;
        }
        if (node.getAttribute('data-dismiss') === 'modal') {
          this.emit('dismiss', this, e, data(e.target, 'button'));
          this.hide();
          return false;
        }

        if (!this._pointerInContent && node.classList.contains('modal')) {
          this.emit('dismiss', this, e, null);
          this.hide();
          return false;
        }
        return true;
      });

      this._pointerInContent = false;
    }

    _handleKeydownEvent(e) {
      if (e.which === 27 && this._options.keyboard) {
        this.emit('dismiss', this, e, null);
        this.hide();
      }
    }

    _handleResizeEvent(e) {
      this._resize();
    }

    show() {
      let o = this._options;
      let html = this._html;
      this.emit('show', this);

      this._checkScrollbar();
      this._setScrollbar();
      document.body.classList.add('modal-open');

      if (o.construct) {
        html.appendTo.appendChild(html.container);
      }

      html.container.style.display = 'block';
      html.container.scrollTop = 0;

      if (o.backdrop !== false) {
        this.once('showBackdrop', () => {
          this._setEvents();

          if (o.animate) html.container.offsetWidth; // Force reflow

          html.container.classList.add(o.animateInClass);

          setTimeout(() => {
            this._visible = true;
            this.emit('shown', this);
          }, o.transition);
        });
        this._backdrop();
      } else {
        this._setEvents();

        if (o.animate) html.container.offsetWidth; // Force reflow

        html.container.classList.add(o.animateInClass);

        setTimeout(() => {
          this._visible = true;
          this.emit('shown', this);
        }, o.transition);
      }
      this._resize();

      return this;
    }

    toggle() {
      if (this._visible) {
        this.hide();
      } else {
        this.show();
      }
    }

    _resize() {
      var modalIsOverflowing =
        this._html.container.scrollHeight > document.documentElement.clientHeight;

      this._html.container.style.paddingLeft =
        ! this.bodyIsOverflowing && modalIsOverflowing ? this._scrollbarWidth + 'px' : '';

      this._html.container.style.paddingRight =
        this.bodyIsOverflowing && ! modalIsOverflowing ? this._scrollbarWidth + 'px' : '';
    }

    _backdrop() {
      let html = this._html;
      let t = this._templates;
      let o = this._options;
      let animate = o.animate ? o.animateClass : false;

      html.backdrop = build(t.backdrop);
      if (animate) html.backdrop.classList.add(animate);
      html.appendTo.appendChild(html.backdrop);

      if (animate) html.backdrop.offsetWidth;

      html.backdrop.classList.add(o.animateInClass);

      setTimeout(() => {
        this.emit('showBackdrop', this);
      }, this._options.backdropTransition);
    }

    hide() {
      let html = this._html;
      let o = this._options;
      let contCList = html.container.classList;
      this.emit('hide', this);

      contCList.remove(o.animateInClass);

      if (o.backdrop) {
        let backCList = html.backdrop.classList;
        backCList.remove(o.animateInClass);
      }

      this._removeEvents();

      setTimeout(() => {
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = this.originalBodyPad;
      }, o.backdropTransition);

      setTimeout(() => {
        if (o.backdrop) {
          html.backdrop.parentNode.removeChild(html.backdrop);
        }
        html.container.style.display = 'none';

        if (o.construct) {
          html.container.parentNode.removeChild(html.container);
        }

        this._visible = false;
        this.emit('hidden', this);
      }, o.transition);

      return this;
    }

    _removeEvents() {
      if (this._events.keydownHandler) {
        document.body.removeEventListener('keydown',
          this._events.keydownHandler
        );
      }

      this._html.container.removeEventListener('mousedown',
        this._events.mousedownHandler
      );

      this._html.container.removeEventListener('click',
        this._events.clickHandler
      );

      window.removeEventListener('resize',
        this._events.resizeHandler
      );
    }

    _checkScrollbar() {
      this.bodyIsOverflowing = document.body.clientWidth < window.innerWidth;
    }

    _setScrollbar() {
      this.originalBodyPad = document.body.style.paddingRight || '';
      if (this.bodyIsOverflowing) {
        let basePadding = parseInt(this.originalBodyPad || 0, 10);
        document.body.style.paddingRight = basePadding + this._scrollbarWidth + 'px';
      }
    }
  }

  /**
   *
   * @param map
   * @param opt_round
   * @returns
   * @protected
   */
  var getMapScale = function getMapScale(map) {
    var opt_round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var dpi = 25.4 / 0.28;
    var view = map.getView();
    var unit = view.getProjection().getUnits();
    var res = view.getResolution();
    var inchesPerMetre = 39.37;
    var scale = res * Units.METERS_PER_UNIT[unit] * inchesPerMetre * dpi;
    if (opt_round) {
      scale = Math.round(scale);
    }
    return scale;
  };

  function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
  function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  /**
   * @private
   */
  var SettingsModal = /*#__PURE__*/function () {
    function SettingsModal(map, options, i18n, printMap) {
      var _this = this;
      _classCallCheck(this, SettingsModal);
      _defineProperty(this, "_modal", void 0);
      this._modal = new Modal(_objectSpread$2({
        headerClose: true,
        header: true,
        animate: true,
        title: i18n.printPdf,
        content: this.Content(i18n, options),
        footer: this.Footer(i18n, options)
      }, options.modal));
      this._modal.on('dismiss', function (modal, event) {
        var print = event.target.dataset.print;
        if (!print) return;
        var form = document.getElementById('printMap');
        var formData = new FormData(form);
        var values = {
          format: formData.get('printFormat'),
          orientation: formData.get('printOrientation'),
          resolution: formData.get('printResolution'),
          scale: formData.get('printScale'),
          description: formData.get('printDescription'),
          compass: formData.get('printCompass'),
          attributions: formData.get('printAttributions'),
          scalebar: formData.get('printScalebar'),
          typeExport: _this._modal.el.querySelector('select[name="printTypeExport"]').value
        };
        printMap(values, /* showLoading */true, /* delay */options.modal.transition);
      });
      this._modal.on('shown', function () {
        var actualScaleVal = getMapScale(map);
        var actualScale = _this._modal.el.querySelector('.actualScale');
        actualScale.value = String(actualScaleVal / 1000);
        actualScale.innerHTML = "".concat(i18n.current, " (1:").concat(actualScaleVal.toLocaleString('de'), ")");
      });
    }
    /**
     *
     * @param i18n
     * @param options
     * @returns
     * @protected
     */
    _createClass(SettingsModal, [{
      key: "Content",
      value: function Content(i18n, options) {
        var scales = options.scales,
          dpi = options.dpi,
          mapElements = options.mapElements,
          paperSizes = options.paperSizes;
        return createElement("form", {
          id: "printMap"
        }, createElement("div", null, createElement("div", {
          className: "printFieldHalf"
        }, createElement("label", {
          htmlFor: "printFormat"
        }, i18n.paperSize), createElement("select", {
          name: "printFormat",
          id: "printFormat"
        }, paperSizes.map(function (paper) {
          return createElement("option", _objectSpread$2({
            value: paper.value
          }, paper.selected ? {
            selected: 'selected'
          } : {}), paper.value);
        }))), createElement("div", {
          className: "printFieldHalf"
        }, createElement("label", {
          htmlFor: "printOrientation"
        }, i18n.orientation), createElement("select", {
          name: "printOrientation",
          id: "printOrientation"
        }, createElement("option", {
          value: "landscape",
          selected: true
        }, i18n.landscape), createElement("option", {
          value: "portrait"
        }, i18n.portrait)))), createElement("div", null, createElement("div", {
          className: "printFieldHalf"
        }, createElement("label", {
          htmlFor: "printResolution"
        }, i18n.resolution), createElement("select", {
          name: "printResolution",
          id: "printResolution"
        }, dpi.map(function (d) {
          return createElement("option", _objectSpread$2({
            value: d.value
          }, d.selected ? {
            selected: 'selected'
          } : {}), d.value, " dpi");
        }))), createElement("div", {
          className: "printFieldHalf"
        }, createElement("label", {
          htmlFor: "printScale"
        }, i18n.scale), createElement("select", {
          name: "printScale",
          id: "printScale"
        }, createElement("option", {
          className: "actualScale",
          value: "",
          selected: true
        }), scales.map(function (scale) {
          return createElement("option", {
            value: scale
          }, "1:", (scale * 1000).toLocaleString('de'));
        })))), mapElements && createElement("div", null, mapElements.description && createElement("div", null, createElement("label", {
          htmlFor: "printDescription"
        }, i18n.addNote), createElement("textarea", {
          id: "printDescription",
          name: "printDescription",
          rows: "4"
        })), createElement("div", null, i18n.mapElements), createElement("div", {
          className: "printElements"
        }, mapElements.compass && createElement("label", {
          htmlFor: "printCompass"
        }, createElement("input", {
          type: "checkbox",
          id: "printCompass",
          name: "printCompass",
          checked: true
        }), i18n.compass), mapElements.scalebar && createElement("label", {
          htmlFor: "printScalebar"
        }, createElement("input", {
          type: "checkbox",
          id: "printScalebar",
          name: "printScalebar",
          checked: true
        }), i18n.scale), mapElements.attributions && createElement("label", {
          htmlFor: "printAttributions"
        }, createElement("input", {
          type: "checkbox",
          id: "printAttributions",
          name: "printAttributions",
          checked: true
        }), i18n.layersAttributions))));
      }
      /**
       *
       * @param i18n
       * @returns
       * @protected
       */
    }, {
      key: "Footer",
      value: function Footer(i18n, options) {
        var mimeTypeExports = options.mimeTypeExports;
        return createElement("div", null, createElement("button", {
          type: "button",
          className: "btn-sm btn btn-secondary",
          "data-dismiss": "modal"
        }, i18n.cancel), createElement("div", {
          class: "typeExportContainer"
        }, createElement("button", {
          type: "button",
          className: "btn-sm btn btn-primary",
          "data-print": "true",
          "data-dismiss": "modal"
        }, i18n.print), createElement("select", {
          className: "typeExport",
          name: "printTypeExport",
          id: "printTypeExport"
        }, mimeTypeExports.map(function (type) {
          return createElement("option", _objectSpread$2({
            value: type.value
          }, type.selected ? {
            selected: 'selected'
          } : {}), type.value);
        })))).outerHTML;
      }
    }, {
      key: "hide",
      value: function hide() {
        this._modal.hide();
      }
    }, {
      key: "show",
      value: function show() {
        if (!this._modal._visible) this._modal.show();
      }
    }]);
    return SettingsModal;
  }();

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
  function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  /**
   * @private
   */
  var ProcessingModal = /*#__PURE__*/function () {
    /**
     *
     * @param i18n
     * @param options
     * @param onEndPrint
     * @protected
     */
    function ProcessingModal(i18n, options, onEndPrint) {
      _classCallCheck(this, ProcessingModal);
      _defineProperty(this, "_modal", void 0);
      _defineProperty(this, "_footer", void 0);
      _defineProperty(this, "_i18n", void 0);
      this._i18n = i18n;
      this._modal = new Modal(_objectSpread$1({
        headerClose: false,
        title: this._i18n.printing,
        backdrop: 'static',
        content: ' ',
        footer: "\n            <button\n                type=\"button\"\n                class=\"btn-sm btn btn-secondary\"\n                data-dismiss=\"modal\"\n            >\n                ".concat(this._i18n.cancel, "\n            </button>\n            ")
      }, options.modal));
      this._modal.on('dismiss', function () {
        onEndPrint();
      });
    }
    /**
     *
     * @param string
     * @protected
     */
    _createClass(ProcessingModal, [{
      key: "_setContentModal",
      value: function _setContentModal(string) {
        this._modal._html.body.innerHTML = string;
      }
      /**
       *
       * @param string
       * @protected
       */
    }, {
      key: "_setFooterModal",
      value: function _setFooterModal(string) {
        this._modal._html.footer.innerHTML = string;
      }
      /**
       *
       * @param string
       * @param footer
       * @protected
       */
    }, {
      key: "show",
      value: function show(string) {
        this._setContentModal(string);
        if (!this._modal._visible) this._modal.show();
      }
      /**
       * @protected
       */
    }, {
      key: "hide",
      value: function hide() {
        this._modal.hide();
      }
    }]);
    return ProcessingModal;
  }();

  var es = {
    printPdf: 'Exportar PDF',
    pleaseWait: 'Por favor espere...',
    almostThere: 'Ya casi...',
    error: 'Error al generar pdf',
    errorImage: 'Ocurrió un error al tratar de cargar una imagen',
    printing: 'Exportando',
    cancel: 'Cancelar',
    close: 'Cerrar',
    print: 'Exportar',
    mapElements: 'Elementos en el mapa',
    compass: 'Brújula',
    scale: 'Escala',
    layersAttributions: 'Atribuciones de capas',
    addNote: 'Agregar nota (opcional)',
    resolution: 'Resolución',
    orientation: 'Orientación',
    paperSize: 'Tamaño de página',
    landscape: 'Paisaje',
    portrait: 'Retrato',
    current: 'Actual',
    paper: 'Hoja'
  };

  var en = {
    printPdf: 'Print PDF',
    pleaseWait: 'Please wait...',
    almostThere: 'Almost there...',
    error: 'An error occurred while printing',
    errorImage: 'An error ocurred while loading an image',
    printing: 'Exporting',
    cancel: 'Cancel',
    close: 'Close',
    print: 'Export',
    mapElements: 'Map elements',
    compass: 'Compass',
    scale: 'Scale',
    layersAttributions: 'Layer attributions',
    addNote: 'Add note (optional)',
    resolution: 'Resolution',
    orientation: 'Orientation',
    paperSize: 'Paper size',
    landscape: 'Landscape',
    portrait: 'Portrait',
    current: 'Current',
    paper: 'Paper'
  };

  var i18n = /*#__PURE__*/Object.freeze({
    __proto__: null,
    en: en,
    es: es
  });

  function compassIcon() {
  	return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" id=\"compass\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"0 0 300 300\" style=\"enable-background:new 0 0 300 300;\" xml:space=\"preserve\">\r\n<style type=\"text/css\">\r\n\t.st0{fill:#EA6868;}\r\n</style>\r\n<g>\r\n\t<g>\r\n\t\t<g>\r\n\t\t\t<g>\r\n\t\t\t\t<g>\r\n\t\t\t\t\t<path class=\"st0\" d=\"M146.3,9.1L75.5,287.2c-0.5,1.8,0.5,3.7,2.1,4.4c1.8,0.8,3.7,0.2,4.7-1.5l68.4-106.7l66.8,106.7\r\n\t\t\t\t\t\tc0.6,1.1,1.9,1.8,3.2,1.8c0.5,0,1-0.2,1.5-0.3c1.8-0.8,2.6-2.6,2.3-4.4L153.7,9.1C152.9,5.7,147.2,5.7,146.3,9.1z M154.2,174.2\r\n\t\t\t\t\t\tc-0.6-1.1-1.9-1.8-3.2-1.8l0,0c-1.3,0-2.6,0.6-3.2,1.8l-59,92L150,25.5l61.1,239.9L154.2,174.2z\"/>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t\t<g>\r\n\t\t\t\t<g>\r\n\t\t\t\t\t<path class=\"st0\" d=\"M220.8,293.1c-1.8,0-3.4-1-4.2-2.3l-65.8-105.1L83.4,290.8c-1.3,1.9-4,2.9-6.1,1.9c-2.3-1-3.4-3.4-2.9-5.8\r\n\t\t\t\t\t\tL145.1,8.8c0.5-2.1,2.4-3.4,4.9-3.4s4.4,1.3,4.9,3.4l70.8,278.1c0.6,2.4-0.6,4.9-2.9,5.8C222.1,292.9,221.5,293.1,220.8,293.1z\r\n\t\t\t\t\t\t M150.8,181.2l1,1.6l66.8,106.7c0.6,1,1.9,1.5,3.2,1c1.1-0.5,1.8-1.8,1.5-3.1L152.4,9.3c-0.3-1.1-1.6-1.6-2.6-1.6\r\n\t\t\t\t\t\ts-2.3,0.5-2.6,1.6L76.4,287.4c-0.3,1.3,0.3,2.6,1.5,3.1c1.1,0.5,2.6,0,3.2-1L150.8,181.2z M85.6,273.2L150,20.6l64.2,251.9\r\n\t\t\t\t\t\tl-61.1-97.7c-1-1.6-3.4-1.5-4.4,0L85.6,273.2z\"/>\r\n\t\t\t\t</g>\r\n\t\t\t</g>\r\n\t\t</g>\r\n\t</g>\r\n</g>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
  }

  function pdfIcon() {
  	return (new DOMParser().parseFromString("<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\r\n\t viewBox=\"0 0 490 490\" xml:space=\"preserve\">\r\n<g>\r\n\t<path d=\"M65.4,6v157.1c0,3.3-2.9,6-6.5,6H33.6c-3.6,0-6.5,2.7-6.5,6v189.6h0l36.3,33.8c1.2,1.1,1.9,2.7,1.9,4.3l0,81.2\r\n\t\tc0,3.3,2.9,6,6.5,6h383.8c3.6,0,6.5-2.7,6.5-6V104.9c0-1.6-0.7-3.1-1.9-4.3l-106-98.9c-1.2-1.1-2.9-1.8-4.6-1.8H71.8\r\n\t\tC68.2,0,65.4,2.7,65.4,6z M431.3,357.4h-374c-3.8,0-6.9-4-6.9-9V203.2c0-5,3.1-9,6.9-9h374c3.8,0,6.9,4,6.9,9v145.2\r\n\t\tC438.2,353.4,435.1,357.4,431.3,357.4z M340.2,27.6l70.8,66c7.2,6.7,2.1,18.2-8.1,18.2h-70.8c-6.3,0-11.4-4.8-11.4-10.7v-66\r\n\t\tC320.7,25.6,333,20.9,340.2,27.6z\"/>\r\n\t<path d=\"M136.9,207.4h-6.5H87.9c-5.8,0-10.5,4.9-10.5,11v115.5c0,6.1,4.7,11,10.5,11h4c5.8,0,10.5-4.9,10.5-11v-22.4\r\n\t\tc0-6.1,4.7-11,10.5-11h18.9l5.8-0.1c18,0,29.9-3,35.8-9.1c5.9-6.1,8.9-18.3,8.9-36.7c0-18.5-3.1-31-9.3-37.5\r\n\t\tC166.6,210.6,154.7,207.4,136.9,207.4z M152.2,274.4c-3.1,2.7-10.2,4.1-21.5,4.1h-17.9c-5.8,0-10.5-4.9-10.5-11v-27.2\r\n\t\tc0-6.1,4.7-11,10.5-11h20.4c10.6,0,17.2,1.4,19.8,4.2c2.5,2.8,3.8,10,3.8,21.6C156.8,265.2,155.3,271.6,152.2,274.4z\"/>\r\n\t<path d=\"M262.6,207.4h-54.1c-5.8,0-10.5,4.9-10.5,11v115.5c0,6.1,4.7,11,10.5,11h54.9c20.7,0,34.1-4.9,39.9-14.6\r\n\t\tc5.9-9.8,8.9-31.8,8.9-66.1c0-21-3.7-35.7-11-44.1C293.8,211.5,281,207.4,262.6,207.4z M281.6,314.2c-3.5,5.8-11.2,8.6-23.1,8.6\r\n\t\th-25c-5.8,0-10.5-4.9-10.5-11v-71.6c0-6.1,4.7-11,10.5-11H260c11.6,0,19,2.7,22.1,8.2c3.1,5.5,4.7,18.4,4.7,38.7\r\n\t\tC286.9,295.8,285.1,308.5,281.6,314.2z\"/>\r\n\t<path d=\"M340.9,344.8h3.9c5.8,0,10.5-4.9,10.5-11v-34.5c0-6.1,4.7-11,10.5-11h37.9c5.8,0,10.5-4.9,10.5-11v0\r\n\t\tc0-6.1-4.7-11-10.5-11h-37.9c-5.8,0-10.5-4.9-10.5-11v-15.1c0-6.1,4.7-11,10.5-11h41.1c5.8,0,10.5-4.9,10.5-11v0\r\n\t\tc0-6.1-4.7-11-10.5-11h-66c-5.8,0-10.5,4.9-10.5,11v115.5C330.4,339.9,335.1,344.8,340.9,344.8z\"/>\r\n</g>\r\n</svg>\r\n", 'image/svg+xml')).firstChild;
  }

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
  /**
   * @protected
   */
  var DEFAULT_LANGUAGE = 'en';
  /**
   * @protected
   */
  var CLASS_PRINT_MODE = 'printMode';
  /**
   * @protected
   */
  function deepObjectAssign(target) {
    for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }
    sources.forEach(function (source) {
      Object.keys(source).forEach(function (key) {
        var s_val = source[key];
        var t_val = target[key];
        target[key] = t_val && s_val && _typeof$1(t_val) === 'object' && _typeof$1(s_val) === 'object' && !Array.isArray(t_val) // Don't merge arrays
        ? deepObjectAssign(t_val, s_val) : s_val;
      });
    });
    return target;
  }
  var PdfPrinter = /*#__PURE__*/function (_Control) {
    _inherits(PdfPrinter, _Control);
    var _super = _createSuper(PdfPrinter);
    function PdfPrinter(opt_options) {
      var _this;
      _classCallCheck(this, PdfPrinter);
      var controlElement = document.createElement('button');
      _this = _super.call(this, {
        target: opt_options.target,
        element: controlElement
      });
      // Check if the selected language exists
      _defineProperty(_assertThisInitialized(_this), "_i18n", void 0);
      _defineProperty(_assertThisInitialized(_this), "_map", void 0);
      _defineProperty(_assertThisInitialized(_this), "_view", void 0);
      _defineProperty(_assertThisInitialized(_this), "_mapTarget", void 0);
      _defineProperty(_assertThisInitialized(_this), "_pdf", void 0);
      _defineProperty(_assertThisInitialized(_this), "_processingModal", void 0);
      _defineProperty(_assertThisInitialized(_this), "_settingsModal", void 0);
      _defineProperty(_assertThisInitialized(_this), "_initialized", void 0);
      _defineProperty(_assertThisInitialized(_this), "_timeoutProcessing", void 0);
      _defineProperty(_assertThisInitialized(_this), "_initialViewResolution", void 0);
      _defineProperty(_assertThisInitialized(_this), "_options", void 0);
      _defineProperty(_assertThisInitialized(_this), "_renderCompleteKey", void 0);
      _defineProperty(_assertThisInitialized(_this), "_isCanceled", void 0);
      _this._i18n = opt_options.language && opt_options.language in i18n ? i18n[opt_options.language] : i18n[DEFAULT_LANGUAGE];
      if (opt_options.i18n) {
        // Merge custom translations
        _this._i18n = _objectSpread(_objectSpread({}, _this._i18n), opt_options.i18n);
      }
      // Default options
      _this._options = {
        language: DEFAULT_LANGUAGE,
        filename: 'Ol Pdf Printer',
        style: {
          paperMargin: 10,
          brcolor: '#000000',
          bkcolor: '#273f50',
          txcolor: '#ffffff'
        },
        extraInfo: {
          date: true,
          url: true,
          specs: true
        },
        mapElements: {
          description: true,
          attributions: true,
          scalebar: true,
          compass: compassIcon()
        },
        watermark: {
          title: 'Ol Pdf Printer',
          titleColor: '#d65959',
          subtitle: 'https://github.com/GastonZalba/ol-pdf-printer',
          subtitleColor: '#444444',
          logo: false
        },
        paperSizes: [
        // { size: [1189, 841], value: 'A0' },
        // { size: [841, 594], value: 'A1' },
        {
          size: [594, 420],
          value: 'A2'
        }, {
          size: [420, 297],
          value: 'A3'
        }, {
          size: [297, 210],
          value: 'A4',
          selected: true
        }, {
          size: [210, 148],
          value: 'A5'
        }],
        dpi: [{
          value: 72
        }, {
          value: 96
        }, {
          value: 150,
          selected: true
        }, {
          value: 200
        }, {
          value: 300
        }],
        scales: [10000, 5000, 1000, 500, 250, 100, 50, 25, 10],
        mimeTypeExports: [{
          value: 'pdf',
          selected: true
        }, {
          value: 'png'
        }, {
          value: 'jpeg'
        }, {
          value: 'webp'
        }],
        units: 'metric',
        dateFormat: undefined,
        ctrlBtnClass: '',
        modal: {
          animateClass: 'fade',
          animateInClass: 'show',
          transition: 150,
          backdropTransition: 100,
          templates: {
            dialog: '<div class="modal-dialog modal-dialog-centered"></div>',
            headerClose: "<button type=\"button\" class=\"btn-close\" data-dismiss=\"modal\" aria-label=\"".concat(_this._i18n.close, "\"><span aria-hidden=\"true\">\xD7</span></button>")
          }
        }
      };
      // Merge options
      _this._options = deepObjectAssign(_this._options, opt_options);
      controlElement.className = "ol-print-btn-menu ".concat(_this._options.ctrlBtnClass);
      controlElement.title = _this._i18n.printPdf;
      controlElement.onclick = function () {
        return _this.showPrintSettingsModal();
      };
      controlElement.append(pdfIcon());
      return _this;
    }
    /**
     * @protected
     */
    _createClass(PdfPrinter, [{
      key: "_init",
      value: function _init() {
        this._map = this.getMap();
        this._view = this._map.getView();
        this._mapTarget = this._map.getTargetElement();
        this._settingsModal = new SettingsModal(this._map, this._options, this._i18n, this._printMap.bind(this));
        this._processingModal = new ProcessingModal(this._i18n, this._options, this._onEndPrint.bind(this));
        this._initialized = true;
      }
      /**
       * @protected
       */
    }, {
      key: "_setMapSizForPrint",
      value: function _setMapSizForPrint(width, height, resolution) {
        var pixelsPerMapMillimeter = resolution / 25.4;
        return [Math.round(width * pixelsPerMapMillimeter), Math.round(height * pixelsPerMapMillimeter)];
      }
      /**
       * Restore inital view, remove classes, disable loading
       * @protected
       */
    }, {
      key: "_onEndPrint",
      value: function _onEndPrint() {
        this._mapTarget.style.width = '';
        this._mapTarget.style.height = '';
        this._map.updateSize();
        this._view.setResolution(this._initialViewResolution);
        this._mapTarget.classList.remove(CLASS_PRINT_MODE);
        this._view.setConstrainResolution(true);
        clearTimeout(this._timeoutProcessing);
        this._cancel();
      }
      /**
       * @protected
       */
    }, {
      key: "_prepareLoading",
      value: function _prepareLoading() {
        var _this2 = this;
        this._processingModal.show(this._i18n.pleaseWait);
        this._timeoutProcessing = setTimeout(function () {
          _this2._processingModal.show(_this2._i18n.almostThere);
        }, 4000);
      }
      /**
       * @protected
       */
    }, {
      key: "_disableLoading",
      value: function _disableLoading() {
        this._processingModal.hide();
      }
      /**
       * This could be used to increment the DPI before printing
       * @protected
       */
    }, {
      key: "_setFormatOptions",
      value: function _setFormatOptions() {
        var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var layers = this._map.getLayers();
        layers.forEach(function (layer) {
          if (layer instanceof Tile) {
            var source = layer.getSource();
            // Set WMS DPI
            if (source instanceof TileWMS) {
              source.updateParams({
                FORMAT_OPTIONS: string
              });
            }
          }
        });
      }
      /**
       *
       * @param form
       * @param showLoading
       * @param delay Delay to prevent glitching with modals animation
       * @protected
       */
    }, {
      key: "_printMap",
      value: function _printMap(form) {
        var _this3 = this;
        var showLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        if (showLoading) {
          this._mapTarget.classList.add(CLASS_PRINT_MODE);
        }
        setTimeout(function () {
          if (showLoading) {
            _this3._prepareLoading();
          }
          _this3._isCanceled = false;
          // To allow intermediate zoom levels
          _this3._view.setConstrainResolution(false);
          var dim = _this3._options.paperSizes.find(function (e) {
            return e.value === form.format;
          }).size;
          dim = form.orientation === 'landscape' ? dim : _toConsumableArray(dim).reverse();
          var widthPaper = dim[0];
          var heightPaper = dim[1];
          var mapSizeForPrint = _this3._setMapSizForPrint(widthPaper, heightPaper, form.resolution);
          var _mapSizeForPrint = _slicedToArray(mapSizeForPrint, 2),
            width = _mapSizeForPrint[0],
            height = _mapSizeForPrint[1];
          // Save current resolution to restore it later
          _this3._initialViewResolution = _this3._view.getResolution();
          var pixelsPerMapMillimeter = form.resolution / 25.4;
          var scaleResolution = form.scale / proj.getPointResolution(_this3._view.getProjection(), pixelsPerMapMillimeter, _this3._view.getCenter());
          _this3._renderCompleteKey = _this3._map.once('rendercomplete', function () {
            domtoimage.toJpeg(_this3._mapTarget.querySelector('.ol-unselectable.ol-layers'), {
              width: width,
              height: height
            }).then( /*#__PURE__*/function () {
              var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(dataUrl) {
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      if (!_this3._isCanceled) {
                        _context.next = 2;
                        break;
                      }
                      return _context.abrupt("return");
                    case 2:
                      _this3._pdf = new Pdf({
                        view: _this3._view,
                        i18n: _this3._i18n,
                        config: _this3._options,
                        form: form,
                        height: heightPaper,
                        width: widthPaper,
                        scaleResolution: scaleResolution
                      });
                      _this3._pdf.addMapImage(dataUrl);
                      _context.next = 6;
                      return _this3._pdf.addMapHelpers();
                    case 6:
                      if (!_this3._isCanceled) {
                        _context.next = 8;
                        break;
                      }
                      return _context.abrupt("return");
                    case 8:
                      _context.next = 10;
                      return _this3._pdf.savePdf();
                    case 10:
                      // Reset original map size
                      _this3._onEndPrint();
                      if (showLoading) _this3._disableLoading();
                    case 12:
                    case "end":
                      return _context.stop();
                  }
                }, _callee);
              }));
              return function (_x) {
                return _ref.apply(this, arguments);
              };
            }()).catch(function (err) {
              var message = typeof err === 'string' ? err : _this3._i18n.error;
              console.error(err);
              _this3._onEndPrint();
              _this3._processingModal.show(message);
            });
          });
          // Set print size
          _this3._mapTarget.style.width = width + 'px';
          _this3._mapTarget.style.height = height + 'px';
          _this3._map.updateSize();
          _this3._map.getView().setResolution(scaleResolution);
        }, delay);
      }
      /**
       * @protected
       */
    }, {
      key: "_cancel",
      value: function _cancel() {
        if (this._renderCompleteKey) {
          Observable.unByKey(this._renderCompleteKey);
        }
        this._isCanceled = true;
      }
      /**
       * Show the Settings Modal
       * @public
       */
    }, {
      key: "showPrintSettingsModal",
      value: function showPrintSettingsModal() {
        if (!this._initialized) this._init();
        this._settingsModal.show();
      }
      /**
       * Hide the Settings Modal
       * @public
       */
    }, {
      key: "hidePrintSettingsModal",
      value: function hidePrintSettingsModal() {
        this._settingsModal.hide();
      }
      /**
       * Create PDF programatically without displaying the Settings Modal
       * @param options
       * @public
       */
    }, {
      key: "createPdf",
      value: function createPdf(options, showLoading) {
        options = {};
        this._printMap(_objectSpread({
          format: (this._options.paperSizes.find(function (p) {
            return p.selected;
          }) || this._options.paperSizes[0]).value,
          resolution: (this._options.dpi.find(function (p) {
            return p.selected;
          }) || this._options.dpi[0]).value,
          orientation: 'landscape',
          compass: true,
          attributions: true,
          scalebar: true,
          scale: 1000,
          typeExport: 'pdf'
        }, options), showLoading);
      }
    }]);
    return PdfPrinter;
  }(Control);

  return PdfPrinter;

}));
//# sourceMappingURL=ol-pdf-printer.js.map
