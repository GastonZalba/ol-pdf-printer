(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ol/proj'), require('ol/control/Control'), require('ol/source/TileWMS'), require('ol/layer/Tile'), require('ol/Observable'), require('jspdf'), require('ol/proj/Units')) :
  typeof define === 'function' && define.amd ? define(['ol/proj', 'ol/control/Control', 'ol/source/TileWMS', 'ol/layer/Tile', 'ol/Observable', 'jspdf', 'ol/proj/Units'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PdfPrinter = factory(global.ol.proj, global.ol.control.Control, global.ol.source.TileWMS, global.ol.layer.Tile, global.ol.Observable, global.jsPDF, global.ol.proj.Units));
}(this, (function (proj, Control, TileWMS, Tile, Observable, jspdf, Units) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var Control__default = /*#__PURE__*/_interopDefaultLegacy(Control);
  var TileWMS__default = /*#__PURE__*/_interopDefaultLegacy(TileWMS);
  var Tile__default = /*#__PURE__*/_interopDefaultLegacy(Tile);

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
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
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function getAugmentedNamespace(n) {
  	if (n.__esModule) return n;
  	var a = Object.defineProperty({}, '__esModule', {value: true});
  	Object.keys(n).forEach(function (k) {
  		var d = Object.getOwnPropertyDescriptor(n, k);
  		Object.defineProperty(a, k, d.get ? d : {
  			enumerable: true,
  			get: function () {
  				return n[k];
  			}
  		});
  	});
  	return a;
  }

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime_1 = createCommonjsModule(function (module) {
  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function define(obj, key, value) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
      return obj[key];
    }
    try {
      // IE 8 has a broken Object.defineProperty that only works on DOM objects.
      define({}, "");
    } catch (err) {
      define = function(obj, key, value) {
        return obj[key] = value;
      };
    }

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunction.displayName = define(
      GeneratorFunctionPrototype,
      toStringTagSymbol,
      "GeneratorFunction"
    );

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        define(prototype, method, function(arg) {
          return this._invoke(method, arg);
        });
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        define(genFun, toStringTagSymbol, "GeneratorFunction");
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    define(Gp, toStringTagSymbol, "Generator");

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
    module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  var regenerator = runtime_1;

  var domToImageImproved = createCommonjsModule(function (module, exports) {
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
  });

  var __awaiter$1 = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  /**
   * @private
   */

  var Pdf = /*#__PURE__*/function () {
    function Pdf(params) {
      var _this = this;

      _classCallCheck(this, Pdf);

      /**
       *
       * @protected
       */
      this.addMapHelpers = function () {
        return __awaiter$1(_this, void 0, void 0, /*#__PURE__*/regenerator.mark(function _callee() {
          var _this$_config, mapElements, extraInfo, style, watermark;

          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _this$_config = this._config, mapElements = _this$_config.mapElements, extraInfo = _this$_config.extraInfo, style = _this$_config.style, watermark = _this$_config.watermark;
                  this._style = style;

                  if (!watermark) {
                    _context.next = 5;
                    break;
                  }

                  _context.next = 5;
                  return this._addWatermark(watermark);

                case 5:
                  if (!mapElements) {
                    _context.next = 12;
                    break;
                  }

                  if (!(mapElements.compass && this._form.compass)) {
                    _context.next = 9;
                    break;
                  }

                  _context.next = 9;
                  return this._addCompass(mapElements.compass);

                case 9:
                  if (mapElements.description && this._form.description) {
                    this._addDescription();
                  }

                  if (mapElements.scalebar && this._form.scalebar) {
                    this._addScaleBar();
                  }

                  if (mapElements.attributions && this._form.attributions) {
                    this._addAttributions();
                  }

                case 12:
                  if (extraInfo) {
                    // Bottom info
                    if (extraInfo.url) {
                      this._addUrl();
                    }

                    if (extraInfo.date) {
                      this._addDate();
                    }

                    if (extraInfo.specs) {
                      this._addSpecs();
                    }
                  }

                case 13:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));
      };
      /**
       *
       * @param position
       * @param offset
       * @param size
       * @returns
       * @protected
       */


      this._calculateOffsetByPosition = function (position, offset) {
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
      };
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


      this._addRoundedBox = function (x, y, width, height, bkcolor, brcolor) {
        var rounding = 1;

        _this._pdf.doc.setDrawColor(brcolor);

        _this._pdf.doc.setFillColor(bkcolor);

        _this._pdf.doc.roundedRect(x, y, width, height, rounding, rounding, 'FD');
      };
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


      this._addText = function (x, y, width, fontSize, color) {
        var align = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'left';
        var str = arguments.length > 6 ? arguments[6] : undefined;

        _this._pdf.doc.setTextColor(color);

        _this._pdf.doc.setFontSize(fontSize);

        _this._pdf.doc.text(str, x, y, {
          align: align,
          maxWidth: width
        });
      };
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


      this._addTextByOffset = function (position, offset, width, fontSize, color, align, str) {
        var _this$_calculateOffse = _this._calculateOffsetByPosition(position, offset),
            x = _this$_calculateOffse.x,
            y = _this$_calculateOffse.y;

        x = align === 'center' ? x - width / 2 : x;

        _this._addText(x, y, width, fontSize, color, align, str);
      };
      /**
       * @protected
       */


      this._addDescription = function () {
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
      };
      /**
       * This functions is a mess
       * @returns
       * @protected
       */


      this._addWatermark = function (watermark) {
        return new Promise(function (resolve, reject) {
          var position = 'topright';
          var offset = {
            x: 0,
            y: 0
          };
          var fontSize = 14;
          var imageSize = 12;
          var fontSizeSubtitle = fontSize / 1.8;
          var back = false;

          var _this$_calculateOffse3 = _this._calculateOffsetByPosition(position, offset),
              x = _this$_calculateOffse3.x,
              y = _this$_calculateOffse3.y;

          var paddingBack = 2;
          var acumulativeWidth = watermark.logo ? imageSize + 0.5 : 0;

          if (watermark.title) {
            _this._pdf.doc.setTextColor(watermark.titleColor);

            _this._pdf.doc.setFontSize(fontSize);

            _this._pdf.doc.setFont('helvetica', 'bold'); // This function works bad


            var _this$_pdf$doc$getTex2 = _this._pdf.doc.getTextDimensions(watermark.title),
                w = _this$_pdf$doc$getTex2.w;

            if (watermark.subtitle) {
              _this._pdf.doc.setFontSize(fontSizeSubtitle);

              var wSub = _this._pdf.doc.getTextDimensions(watermark.subtitle).w;

              w = wSub - 4 > w ? wSub : w + 4; // weird fix needed

              _this._pdf.doc.setFontSize(fontSize);
            } else {
              w += 4;
            } // Adaptable width, fixed height


            var _height = 16;
            var widthBack = w + paddingBack;

            _this._addRoundedBox(x - widthBack + 4 - acumulativeWidth, y - 4, widthBack + acumulativeWidth, _height, '#ffffff', '#ffffff');

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
              var _this$_pdf$doc$getTex3 = _this._pdf.doc.getTextDimensions(watermark.subtitle),
                  _w = _this$_pdf$doc$getTex3.w;

              var _widthBack = paddingBack * 2 + _w;

              _this._addRoundedBox(x - _widthBack + 3 - acumulativeWidth, y - 4, _widthBack + acumulativeWidth, 16, '#ffffff', '#ffffff');

              acumulativeWidth += _widthBack;
              back = true;
            }

            var marginTop = watermark.title ? fontSize / 2 : 4;

            _this._pdf.doc.text(watermark.subtitle, x, y + paddingBack + marginTop, {
              align: 'right'
            });
          }

          if (!watermark.logo) return resolve();

          var addImage = function addImage(image) {
            _this._pdf.doc.addImage(image, 'PNG', x - acumulativeWidth + paddingBack * 2 - 1, y - 1, imageSize, imageSize);
          };

          if (!back) {
            var _widthBack2 = acumulativeWidth + paddingBack;

            _this._addRoundedBox(x - _widthBack2 + 4, y - 4, _widthBack2, 16, '#ffffff', '#ffffff');
          }

          if (watermark.logo instanceof Image) {
            addImage(watermark.logo);
            resolve();
          } else {
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

            image.src = watermark.logo;
          }
        });
      };
      /**
       * @protected
       */


      this._addDate = function () {
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

        var str = new Date(Date.now()).toLocaleDateString();

        _this._addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
      };
      /**
       * @protected
       */


      this._addUrl = function () {
        var position = 'bottomleft';
        var width = 250;
        var offset = {
          x: 0,
          y: -5
        };
        var fontSize = 7;
        var txcolor = '#000000';
        var align = 'left';

        _this._pdf.doc.setFont('helvetica', 'italic');

        var str = window.location.href;

        _this._addTextByOffset(position, offset, width, fontSize, txcolor, align, str);
      };
      /**
       * @protected
       */


      this._addSpecs = function () {
        var position = 'bottomleft';
        var offset = {
          x: _this._pdf.width / 2 + _this._style.paperMargin,
          y: -5
        };
        var fontSize = 7;
        var txcolor = '#000000';
        var align = 'center';

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
      };
      /**
       * @protected
       */


      this._addAttributions = function () {
        var attributionsUl = document.querySelector('.ol-attribution ul');
        if (!attributionsUl) return;
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

        _this._addRoundedBox(x - w - 2, y - h, w + paddingBack, h + paddingBack, '#ffffff', '#ffffff');

        var attributions = document.querySelectorAll('.ol-attribution li');
        Array.from(attributions).reverse().forEach(function (attribution) {
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
          }); // To add separation between diferents attributtions

          _this._pdf.doc.text(' ', xPos, y, {
            align: 'right'
          });

          var _this$_pdf$doc$getTex7 = _this._pdf.doc.getTextDimensions(' '),
              w = _this$_pdf$doc$getTex7.w;

          xPos -= w;
        });
      };
      /**
       * Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
       * @protected
       */


      this._addScaleBar = function () {
        var offset = {
          x: 2,
          y: 2
        };
        var maxWidth = 90; // in mm
        // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log10#Polyfill

        var log10 = Math.log10 || // more precise, but unsupported by IE
        function (x) {
          return Math.log(x) * Math.LOG10E;
        };

        var maxLength = maxWidth * _this._scaleDenominator;
        var unit = 'mm';
        var unitConversionFactor = 1;

        if (maxLength >= 1e7) {
          // >= 10 km
          unit = 'km';
          unitConversionFactor = 1e6;
        } else if (maxLength >= 1e4) {
          // >= 10 m
          unit = 'm';
          unitConversionFactor = 1e3;
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
        var percentageMargin = _this._style.paperMargin ? _this._style.paperMargin * 2 / _this._pdf.width * 100 : null; // Reduce length acording to margins

        size = percentageMargin ? size / 100 * (100 - percentageMargin) : size;
        var fullSize = size * 4; // x/y defaults to offset for topleft corner (normal x/y coordinates)

        var x = offset.x + _this._style.paperMargin;
        var y = offset.y + _this._style.paperMargin;
        y = _this._pdf.height - offset.y - 10 - _this._style.paperMargin; // to give the outer white box 4mm padding

        var scaleBarX = x + 4;
        var scaleBarY = y + 5; // 5 because above the scalebar will be the numbers
        // draw outer box

        _this._addRoundedBox(x, y, fullSize + 8, 10, _this._style.bkcolor, _this._style.brcolor); // draw first part of scalebar


        _this._pdf.doc.setDrawColor(_this._style.brcolor);

        _this._pdf.doc.setFillColor(0, 0, 0);

        _this._pdf.doc.rect(scaleBarX, scaleBarY, size, 1, 'FD'); // draw second part of scalebar


        _this._pdf.doc.setDrawColor(_this._style.brcolor);

        _this._pdf.doc.setFillColor(255, 255, 255);

        _this._pdf.doc.rect(scaleBarX + size, scaleBarY, size, 1, 'FD'); // draw third part of scalebar


        _this._pdf.doc.setDrawColor(_this._style.brcolor);

        _this._pdf.doc.setFillColor(0, 0, 0);

        _this._pdf.doc.rect(scaleBarX + size * 2, scaleBarY, size * 2, 1, 'FD'); // draw numeric labels above scalebar


        _this._pdf.doc.setTextColor(_this._style.txcolor);

        _this._pdf.doc.setFontSize(6);

        _this._pdf.doc.text('0', scaleBarX, scaleBarY - 1); // /4 and could give 2.5. We still round, because of floating point arith


        _this._pdf.doc.text(String(Math.round(length * 10 / 4) / 10), scaleBarX + size - 1, scaleBarY - 1);

        _this._pdf.doc.text(String(Math.round(length / 2)), scaleBarX + size * 2 - 2, scaleBarY - 1);

        _this._pdf.doc.text(Math.round(length).toString() + ' ' + unit, scaleBarX + size * 4 - 4, scaleBarY - 1);
      };
      /**
       *
       * @param imgSrc
       * @returns
       * @protected
       */


      this._addCompass = function (imgSrc) {
        return new Promise(function (resolve, reject) {
          var position = 'bottomright';
          var offset = {
            x: 2,
            y: 6
          };
          var size = 6;

          var rotationRadians = _this._view.getRotation();

          var imageSize = 100;

          var _this$_calculateOffse5 = _this._calculateOffsetByPosition(position, offset, size),
              x = _this$_calculateOffse5.x,
              y = _this$_calculateOffse5.y;

          var addRotation = function addRotation(image) {
            var canvas = document.createElement('canvas'); // Must be bigger than the image to prevent clipping

            canvas.height = 120;
            canvas.width = 120;
            var context = canvas.getContext('2d');
            context.translate(canvas.width * 0.5, canvas.height * 0.5);
            context.rotate(rotationRadians);
            context.translate(-canvas.width * 0.5, -canvas.height * 0.5);
            context.drawImage(image, (canvas.height - imageSize) / 2, (canvas.width - imageSize) / 2, imageSize, imageSize); // Add back circle

            var xCircle = x - size;
            var yCircle = y;

            _this._pdf.doc.setDrawColor(_this._style.brcolor);

            _this._pdf.doc.setFillColor(_this._style.bkcolor);

            _this._pdf.doc.circle(xCircle, yCircle, size, 'FD');

            return canvas;
          };

          var addImage = function addImage(image) {
            var rotatedCanvas = addRotation(image);
            var sizeImage = size * 1.5;
            var xImage = x - sizeImage - size / 4.3;
            var yImage = y - sizeImage / 2;

            _this._pdf.doc.addImage(rotatedCanvas, 'PNG', xImage, yImage, sizeImage, sizeImage);
          };

          if (imgSrc instanceof Image) {
            addImage(imgSrc);
            resolve();
          } else if (typeof imgSrc === 'string') {
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

            image.src = imgSrc;
          }
        });
      };

      var view = params.view,
          form = params.form,
          i18n = params.i18n,
          config = params.config,
          height = params.height,
          width = params.width,
          scaleResolution = params.scaleResolution;
      this._view = view;
      this._form = form;
      this._i18n = i18n;
      this._config = config;
      this._pdf = this.createPdf(this._form.orientation, this._form.format, height, width);
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
      key: "createPdf",
      value: function createPdf(orientation, format, height, width) {
        var _a; // UMD support


        var _jsPDF = ((_a = window.jspdf) === null || _a === void 0 ? void 0 : _a.jsPDF) || jspdf.jsPDF;

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
        this._pdf.doc.addImage(dataUrl, 'JPEG', this._config.style.paperMargin, // Add margins
        this._config.style.paperMargin, this._pdf.width - this._config.style.paperMargin * 2, this._pdf.height - this._config.style.paperMargin * 2);
      }
      /**
       * @protected
       */

    }, {
      key: "savePdf",
      value: function savePdf() {
        this._pdf.doc.save(this._config.filename + '.pdf');
      }
      /**
       *   Adapted from http://hg.intevation.de/gemma/file/tip/client/src/components/Pdftool.vue#l252
       * @protected
       */

    }, {
      key: "_calculateScaleDenominator",
      value: function _calculateScaleDenominator(resolution, scaleResolution) {
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
   * modal-vanilla 0.8.0 <https://github.com/KaneCohen/modal-vanilla>
   * Copyright 2020 Kane Cohen <https://github.com/KaneCohen>
   * Available under BSD-3-Clause license
   */

  const _factory = document.createElement('div');

  const _scrollbarWidth = calcScrollbarWidth();

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
      return '0.8.0';
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
      this._options = Object.assign({}, Modal.options, options);
      this._templates = Object.assign({}, Modal.templates, options.templates || {});
      this._html.appendTo = document.querySelector(this._options.appendTo);

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

      this._events.clickHandler = this._handleClickEvent.bind(this);
      html.container.addEventListener('click',
        this._events.clickHandler
      );

      this._events.resizeHandler = this._handleResizeEvent.bind(this);
      window.addEventListener('resize',
        this._events.resizeHandler
      );
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
        if (node.classList.contains('modal')) {
          this.emit('dismiss', this, e, null);
          this.hide();
          return false;
        }
        return true;
      });
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
        ! this.bodyIsOverflowing && modalIsOverflowing ? _scrollbarWidth + 'px' : '';

      this._html.container.style.paddingRight =
        this.bodyIsOverflowing && ! modalIsOverflowing ? _scrollbarWidth + 'px' : '';
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
        document.body.style.paddingRight = basePadding + _scrollbarWidth + 'px';
      }
    }
  }

  var modal = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': Modal
  });

  var require$$0 = /*@__PURE__*/getAugmentedNamespace(modal);

  var modalVanilla = require$$0.default;

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

  function createElement(tagName) {
    var attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (tagName === 'fragment') return children;
    if (typeof tagName === 'function') return tagName(attrs, children);
    var elem = document.createElement(tagName);
    Object.entries(attrs || {}).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          name = _ref2[0],
          value = _ref2[1];

      if (name.startsWith('on') && name.toLowerCase() in window) elem.addEventListener(name.toLowerCase().substr(2), value);else {
        if (name === 'className') elem.setAttribute('class', value.toString());else if (name === 'htmlFor') elem.setAttribute('for', value.toString());else elem.setAttribute(name, value.toString());
      }
    });

    for (var _i = 0, _children = children; _i < _children.length; _i++) {
      var child = _children[_i];
      if (!child) continue;
      if (Array.isArray(child)) elem.append.apply(elem, _toConsumableArray(child));else {
        elem.appendChild(child.nodeType === undefined ? document.createTextNode(child.toString()) : child);
      }
    }

    return elem;
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

  /**
   * @private
   */

  var SettingsModal = /*#__PURE__*/function () {
    function SettingsModal(map, options, i18n, printMap) {
      _classCallCheck(this, SettingsModal);

      this._modal = new modalVanilla(Object.assign({
        headerClose: true,
        header: true,
        animate: true,
        title: i18n.printPdf,
        content: this.Content(i18n, options),
        footer: this.Footer(i18n)
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
          scalebar: formData.get('printScalebar')
        };
        printMap(values,
        /* showLaoding */
        true,
        /* delay */
        options.modal.transition);
      });

      this._modal.on('shown', function () {
        var actualScaleVal = getMapScale(map);
        var actualScale = document.querySelector('.actualScale');
        actualScale.value = String(actualScaleVal / 1000);
        actualScale.innerHTML = "".concat(i18n.current, " (1:").concat(actualScaleVal.toLocaleString('de'), ")");
      });
    }
    /**
     *
     * @param i18n
     * @param params
     * @returns
     * @protected
     */


    _createClass(SettingsModal, [{
      key: "Content",
      value: function Content(i18n, params) {
        var scales = params.scales,
            dpi = params.dpi,
            mapElements = params.mapElements,
            paperSizes = params.paperSizes;
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
          return createElement("option", Object.assign({
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
          return createElement("option", Object.assign({
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
      value: function Footer(i18n) {
        return "\n        <div>\n            <button\n                type=\"button\"\n                class=\"btn-sm btn btn-secondary\"\n                data-dismiss=\"modal\"\n            >\n                ".concat(i18n.cancel, "\n            </button>\n            <button\n                type=\"button\"\n                class=\"btn-sm btn btn-primary\"\n                data-print=\"true\"\n                data-dismiss=\"modal\"\n            >\n                ").concat(i18n.print, "\n            </button>\n        </div>\n    ");
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

      this._i18n = i18n;
      this._modal = new modalVanilla(Object.assign({
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
    printPdf: 'Imprimir PDF',
    pleaseWait: 'Por favor espere...',
    almostThere: 'Ya casi...',
    error: 'Error al generar pdf',
    errorImage: 'Ocurrió un error al tratar de cargar una imagen',
    printing: 'Imprimiendo',
    cancel: 'Cancelar',
    close: 'Cerrar',
    print: 'Imprimir',
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
    printing: 'Printing',
    cancel: 'Cancel',
    close: 'Close',
    print: 'Print',
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
    es: es,
    en: en
  });

  var img$1 = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 300 300' style='enable-background:new 0 0 300 300%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .st0%7bfill:%23EA6868%3b%7d%3c/style%3e%3cg%3e %3cg%3e %3cg%3e %3cg%3e %3cg%3e %3cpath class='st0' d='M146.3%2c9.1L75.5%2c287.2c-0.5%2c1.8%2c0.5%2c3.7%2c2.1%2c4.4c1.8%2c0.8%2c3.7%2c0.2%2c4.7-1.5l68.4-106.7l66.8%2c106.7 c0.6%2c1.1%2c1.9%2c1.8%2c3.2%2c1.8c0.5%2c0%2c1-0.2%2c1.5-0.3c1.8-0.8%2c2.6-2.6%2c2.3-4.4L153.7%2c9.1C152.9%2c5.7%2c147.2%2c5.7%2c146.3%2c9.1z M154.2%2c174.2 c-0.6-1.1-1.9-1.8-3.2-1.8l0%2c0c-1.3%2c0-2.6%2c0.6-3.2%2c1.8l-59%2c92L150%2c25.5l61.1%2c239.9L154.2%2c174.2z'/%3e %3c/g%3e %3c/g%3e %3cg%3e %3cg%3e %3cpath class='st0' d='M220.8%2c293.1c-1.8%2c0-3.4-1-4.2-2.3l-65.8-105.1L83.4%2c290.8c-1.3%2c1.9-4%2c2.9-6.1%2c1.9c-2.3-1-3.4-3.4-2.9-5.8 L145.1%2c8.8c0.5-2.1%2c2.4-3.4%2c4.9-3.4s4.4%2c1.3%2c4.9%2c3.4l70.8%2c278.1c0.6%2c2.4-0.6%2c4.9-2.9%2c5.8C222.1%2c292.9%2c221.5%2c293.1%2c220.8%2c293.1z M150.8%2c181.2l1%2c1.6l66.8%2c106.7c0.6%2c1%2c1.9%2c1.5%2c3.2%2c1c1.1-0.5%2c1.8-1.8%2c1.5-3.1L152.4%2c9.3c-0.3-1.1-1.6-1.6-2.6-1.6 s-2.3%2c0.5-2.6%2c1.6L76.4%2c287.4c-0.3%2c1.3%2c0.3%2c2.6%2c1.5%2c3.1c1.1%2c0.5%2c2.6%2c0%2c3.2-1L150.8%2c181.2z M85.6%2c273.2L150%2c20.6l64.2%2c251.9 l-61.1-97.7c-1-1.6-3.4-1.5-4.4%2c0L85.6%2c273.2z'/%3e %3c/g%3e %3c/g%3e %3c/g%3e %3c/g%3e%3c/g%3e%3c/svg%3e";

  var img = "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3csvg version='1.1' id='Capa_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 490 490' style='enable-background:new 0 0 490 490%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .st0%7bfill:white%3b%7d%3c/style%3e%3cg%3e %3cpath class='st0' d='M65.4%2c6v157.1c0%2c3.3-2.9%2c6-6.5%2c6H33.6c-3.6%2c0-6.5%2c2.7-6.5%2c6v189.6h0l36.3%2c33.8c1.2%2c1.1%2c1.9%2c2.7%2c1.9%2c4.3l0%2c81.2 c0%2c3.3%2c2.9%2c6%2c6.5%2c6h383.8c3.6%2c0%2c6.5-2.7%2c6.5-6V104.9c0-1.6-0.7-3.1-1.9-4.3l-106-98.9c-1.2-1.1-2.9-1.8-4.6-1.8H71.8 C68.2%2c0%2c65.4%2c2.7%2c65.4%2c6z M431.3%2c357.4h-374c-3.8%2c0-6.9-4-6.9-9V203.2c0-5%2c3.1-9%2c6.9-9h374c3.8%2c0%2c6.9%2c4%2c6.9%2c9v145.2 C438.2%2c353.4%2c435.1%2c357.4%2c431.3%2c357.4z M340.2%2c27.6l70.8%2c66c7.2%2c6.7%2c2.1%2c18.2-8.1%2c18.2h-70.8c-6.3%2c0-11.4-4.8-11.4-10.7v-66 C320.7%2c25.6%2c333%2c20.9%2c340.2%2c27.6z'/%3e %3cpath class='st0' d='M136.9%2c207.4h-6.5H87.9c-5.8%2c0-10.5%2c4.9-10.5%2c11v115.5c0%2c6.1%2c4.7%2c11%2c10.5%2c11h4c5.8%2c0%2c10.5-4.9%2c10.5-11v-22.4 c0-6.1%2c4.7-11%2c10.5-11h18.9l5.8-0.1c18%2c0%2c29.9-3%2c35.8-9.1c5.9-6.1%2c8.9-18.3%2c8.9-36.7c0-18.5-3.1-31-9.3-37.5 C166.6%2c210.6%2c154.7%2c207.4%2c136.9%2c207.4z M152.2%2c274.4c-3.1%2c2.7-10.2%2c4.1-21.5%2c4.1h-17.9c-5.8%2c0-10.5-4.9-10.5-11v-27.2 c0-6.1%2c4.7-11%2c10.5-11h20.4c10.6%2c0%2c17.2%2c1.4%2c19.8%2c4.2c2.5%2c2.8%2c3.8%2c10%2c3.8%2c21.6C156.8%2c265.2%2c155.3%2c271.6%2c152.2%2c274.4z'/%3e %3cpath class='st0' d='M262.6%2c207.4h-54.1c-5.8%2c0-10.5%2c4.9-10.5%2c11v115.5c0%2c6.1%2c4.7%2c11%2c10.5%2c11h54.9c20.7%2c0%2c34.1-4.9%2c39.9-14.6 c5.9-9.8%2c8.9-31.8%2c8.9-66.1c0-21-3.7-35.7-11-44.1C293.8%2c211.5%2c281%2c207.4%2c262.6%2c207.4z M281.6%2c314.2c-3.5%2c5.8-11.2%2c8.6-23.1%2c8.6 h-25c-5.8%2c0-10.5-4.9-10.5-11v-71.6c0-6.1%2c4.7-11%2c10.5-11H260c11.6%2c0%2c19%2c2.7%2c22.1%2c8.2c3.1%2c5.5%2c4.7%2c18.4%2c4.7%2c38.7 C286.9%2c295.8%2c285.1%2c308.5%2c281.6%2c314.2z'/%3e %3cpath class='st0' d='M340.9%2c344.8h3.9c5.8%2c0%2c10.5-4.9%2c10.5-11v-34.5c0-6.1%2c4.7-11%2c10.5-11h37.9c5.8%2c0%2c10.5-4.9%2c10.5-11v0 c0-6.1-4.7-11-10.5-11h-37.9c-5.8%2c0-10.5-4.9-10.5-11v-15.1c0-6.1%2c4.7-11%2c10.5-11h41.1c5.8%2c0%2c10.5-4.9%2c10.5-11v0 c0-6.1-4.7-11-10.5-11h-66c-5.8%2c0-10.5%2c4.9-10.5%2c11v115.5C330.4%2c339.9%2c335.1%2c344.8%2c340.9%2c344.8z'/%3e%3c/g%3e%3c/svg%3e";

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function (resolve) {
        resolve(value);
      });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
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
        target[key] = t_val && s_val && _typeof(t_val) === 'object' && _typeof(s_val) === 'object' ? deepObjectAssign(t_val, s_val) : s_val;
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
      }); // Check if the selected language exists

      _this._i18n = opt_options.language && opt_options.language in i18n ? i18n[opt_options.language] : i18n[DEFAULT_LANGUAGE];

      if (opt_options.i18n) {
        // Merge custom translations
        _this._i18n = Object.assign(Object.assign({}, _this._i18n), opt_options.i18n);
      } // Default options


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
          compass: img$1
        },
        watermark: {
          title: 'Ol Pdf Printer',
          titleColor: '#d65959',
          subtitle: 'https://github.com/GastonZalba/ol-pdf-printer',
          subtitleColor: '#444444',
          logo: false
        },
        paperSizes: [// { size: [1189, 841], value: 'A0' },
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
      }; // Merge options

      _this._options = deepObjectAssign(_this._options, opt_options);
      controlElement.className = "ol-print-btn-menu ".concat(_this._options.ctrlBtnClass);
      controlElement.innerHTML = "<img src=\"".concat(img, "\"/>");
      controlElement.title = _this._i18n.printPdf;

      controlElement.onclick = function () {
        return _this._show();
      };

      return _this;
    }
    /**
     * @protected
     */


    _createClass(PdfPrinter, [{
      key: "_show",
      value: function _show() {
        if (!this._initialized) this._init();

        this._settingsModal.show();
      }
      /**
       * @protected
       */

    }, {
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
          if (layer instanceof Tile__default['default']) {
            var source = layer.getSource(); // Set WMS DPI

            if (source instanceof TileWMS__default['default']) {
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

          _this3._isCanceled = false; // To allow intermediate zoom levels

          _this3._view.setConstrainResolution(false); // this._prepareLayers(form);


          var dim = _this3._options.paperSizes.find(function (e) {
            return e.value === form.format;
          }).size;

          dim = form.orientation === 'landscape' ? dim : dim.reverse();
          var widthPaper = dim[0];
          var heightPaper = dim[1];

          var mapSizeForPrint = _this3._setMapSizForPrint(widthPaper, heightPaper, form.resolution);

          var _mapSizeForPrint = _slicedToArray(mapSizeForPrint, 2),
              width = _mapSizeForPrint[0],
              height = _mapSizeForPrint[1]; // Save current resolution to restore it later


          _this3._initialViewResolution = _this3._view.getResolution();
          var pixelsPerMapMillimeter = form.resolution / 25.4;
          var scaleResolution = form.scale / proj.getPointResolution(_this3._view.getProjection(), pixelsPerMapMillimeter, _this3._view.getCenter());
          _this3._renderCompleteKey = _this3._map.once('rendercomplete', function () {
            domToImageImproved.toJpeg(_this3._mapTarget.querySelector('.ol-unselectable.ol-layers'), {
              width: width,
              height: height
            }).then(function (dataUrl) {
              return __awaiter(_this3, void 0, void 0, /*#__PURE__*/regenerator.mark(function _callee() {
                return regenerator.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!this._isCanceled) {
                          _context.next = 2;
                          break;
                        }

                        return _context.abrupt("return");

                      case 2:
                        this._pdf = new Pdf({
                          view: this._view,
                          i18n: this._i18n,
                          config: this._options,
                          form: form,
                          height: heightPaper,
                          width: widthPaper,
                          scaleResolution: scaleResolution
                        });

                        this._pdf.addMapImage(dataUrl);

                        _context.next = 6;
                        return this._pdf.addMapHelpers();

                      case 6:
                        if (!this._isCanceled) {
                          _context.next = 8;
                          break;
                        }

                        return _context.abrupt("return");

                      case 8:
                        this._pdf.savePdf(); // Reset original map size


                        this._onEndPrint();

                        if (showLoading) this._disableLoading();

                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));
            }).catch(function (err) {
              var message = typeof err === 'string' ? err : _this3._i18n.error;
              console.error(err);

              _this3._onEndPrint();

              _this3._processingModal.show(message);
            });
          }); // Set print size

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
        options = Object.assign({
          format: (this._options.paperSizes.find(function (p) {
            return p.selected;
          }) || this._options.paperSizes[0]).value,
          resolution: (this._options.dpi.find(function (p) {
            return p.selected;
          }) || this._options.dpi[0]).value,
          orientation: 'landscape',
          compass: true,
          attributions: true,
          scale: true
        }, options);

        this._printMap(options, showLoading);
      }
    }]);

    return PdfPrinter;
  }(Control__default['default']);

  return PdfPrinter;

})));
