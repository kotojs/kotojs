(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["d3"], factory);
	else if(typeof exports === 'object')
		exports["Koto"] = factory(require("d3"));
	else
		root["Koto"] = factory(root["d3"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_89__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(1)['default'];

	var _classCallCheck = __webpack_require__(5)['default'];

	var _get = __webpack_require__(6)['default'];

	var _inherits = __webpack_require__(19)['default'];

	var _slicedToArray = __webpack_require__(30)['default'];

	var _Map = __webpack_require__(59)['default'];

	var _getIterator = __webpack_require__(31)['default'];

	var _Promise = __webpack_require__(74)['default'];

	var _Set = __webpack_require__(84)['default'];

	var _interopRequireDefault = __webpack_require__(88)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _d3 = __webpack_require__(89);

	var _d32 = _interopRequireDefault(_d3);

	var _assertJs = __webpack_require__(90);

	var _assertJs2 = _interopRequireDefault(_assertJs);

	var _layerJs = __webpack_require__(91);

	var _layerJs2 = _interopRequireDefault(_layerJs);

	// d3 is required
	(0, _assertJs2['default'])(_d32['default'], 'd3 js is required.');

	/**
	 * Create a koto chart
	 *
	 * @constructor
	 *
	 * @param {d3.selection} selection The chart's "base" DOM node. This should
	 *        contain any nodes that the chart generates.
	 */

	var Chart = (function () {
	  function Chart(selection) {
	    _classCallCheck(this, Chart);

	    this.base = selection; // Container for chart @type {d3.selection}.
	    this.hasDrawn = false; // Has this chart been drawn at lease once?

	    function baseExtend(dst, maps) {
	      var setDst = function setDst(value, key) {
	        dst.set(key, value);
	      };
	      for (var i = 0, ii = maps.length; i < ii; ++i) {
	        var map = maps[i];
	        map.forEach(setDst);
	      }
	      return dst;
	    }

	    this.merge = {
	      configs: (function () {
	        var merged = baseExtend(this.configs, arguments);
	        return merged;
	      }).bind(this),
	      accessors: (function () {
	        var merged = baseExtend(this.accessors, arguments);
	        return merged;
	      }).bind(this)
	    };

	    // exposed properties
	    this.configs = new _Map();
	    this.accessors = new _Map();
	    this.promise = null;

	    // private
	    this._layers = new _Map();
	    this._attached = new _Map();
	    this._events = new _Map();

	    // alias
	    this.c = this.config;
	    this.a = this.accessor;
	  }

	  /**
	   * A "hook" method that you may define to modify input data before it is used
	   * to draw the chart's layers and attachments. This method will be used by all
	   * sub-classes.
	   *
	   * Note: you will most likely never call this method directly, but rather
	   * include it as part of a chart definition, and then rely on d3.chart to
	   * invoke it when you draw the chart with {@link Chart#draw}.
	   *
	   * @param {Array} data Input data provided to @link Chart#draw}.
	   * @returns {mixed} Data to be used in drawing the chart's layers and
	   *                  attachments.
	   */

	  _createClass(Chart, [{
	    key: 'transform',
	    value: function transform(data) {
	      return data;
	    }

	    /**
	     * A "hook" method that you may define to choose which mutation of the input
	     * data is sent to which of the attached charts (by name). This method will
	     * be used by all sub-classes. This only applies to charts that use the
	     * {@link Chart#attach} method.
	     *
	     * Note: you will most likely never call this method directly, but rather
	     * include it as part of a chart definition, and then rely on d3.chart to
	     * invoke it when you draw the chart with {@link Chart#draw}.
	     *
	     * @param {String} data Name of attached chart defined in {@link Chart#attach}.
	     * @param {Array} data Input data provided to {@link Chart#draw}.
	     * @returns {mixed} Data to be used in drawing the chart's layers and
	     *                  attachments.
	     */
	  }, {
	    key: 'demux',
	    value: function demux(name, data) {
	      return data;
	    }

	    /**
	     * A "hook" method that will allow you to run some arbitrary code before
	     * {@link Chart#draw}. This will run everytime {@link Chart#draw} is called.
	     *
	     * Note: you will most likely never call this method directly, but rather
	     * include it as part of a chart definition, and then rely on d3.chart to
	     * invoke it when you draw the chart with {@link Chart#draw}.
	     *
	     * Note 2: a `postDraw` event is also fired when appropriate;
	     *
	     * @param  {[type]} data [description]
	     * @return {[type]}      [description]
	     */
	  }, {
	    key: 'preDraw',
	    value: function preDraw() {}

	    /**
	     * A "hook" method that will allow you to run some arbitrary code after
	     * {@link Chart#draw}. This will run everytime {@link Chart#draw} is called.
	     *
	     * Note: you will most likely never call this method directly, but rather
	     * include it as part of a chart definition, and then rely on d3.chart to
	     * invoke it when you draw the chart with {@link Chart#draw}.
	     *
	     * @param  {[type]} data [description]
	     */
	  }, {
	    key: 'postDraw',
	    value: function postDraw() {}

	    /**
	     * A "hook" method that will allow you to run some arbitrary code after
	     * {@link Chart#draw} is called AND after all transitions for all layers
	     * and attached charts have been completed. This will run everytime
	     * {@link Chart#draw} is called.
	     *
	     * Note: you will most likely never call this method directly, but rather
	     * include it as part of a chart definition, and then rely on d3.chart to
	     * invoke it when you draw the chart with {@link Chart#draw}.
	     *
	     * Note 2: a `postTransition` event is also fired when appropriate;
	     *
	     * @param  {[type]} data
	     */
	  }, {
	    key: 'postTransition',
	    value: function postTransition() {}

	    /**
	     * Remove a layer from the chart.
	     *
	     * @param {String} name The name of the layer to remove.
	     * @returns {Layer} The layer removed by this operation.
	     */
	  }, {
	    key: 'unlayer',
	    value: function unlayer(name) {
	      var layer = this.layer(name);

	      this._layers['delete'](name);
	      delete layer._chart;

	      return layer;
	    }

	    /**
	     * Interact with the chart's {@link Layer|layers}.
	     *
	     * If only a `name` is provided, simply return the layer registered to that
	     * name (if any).
	     *
	     * If a `name` and `selection` are provided, treat the `selection` as a
	     * previously-created layer and attach it to the chart with the specified
	     * `name`.
	     *
	     * If all three arguments are specified, initialize a new {@link Layer} using
	     * the specified `selection` as a base passing along the specified `options`.
	     *
	     * The {@link Layer.draw} method of attached layers will be invoked
	     * whenever this chart's {@link Chart#draw} is invoked and will receive the
	     * data (optionally modified by the chart's {@link Chart#transform} method.
	     *
	     * @param {String} name Name of the layer to attach or retrieve.
	     * @param {d3.selection|Layer} [selection] The layer's base or a
	     *        previously-created {@link Layer}.
	     * @param {Object} [options] Options to be forwarded to {@link Layer|the Layer
	     *        constructor}
	     *
	     * @returns {Layer}
	     */
	  }, {
	    key: 'layer',
	    value: function layer(name, selection, options) {
	      var _Chart = this;
	      var _layer;

	      if (arguments.length === 1) {
	        return this._layers.get(name);
	      }

	      // we are reattaching a previous layer, which the
	      // selection argument is now set to.
	      if (arguments.length === 2) {

	        if (selection instanceof _layerJs2['default']) {
	          selection._chart = this;
	          this._layers.set(name, selection);
	          return this._layers.get(name);
	        } else {
	          (0, _assertJs2['default'])(false, 'When reattaching a layer, the second argument must be a koto layer');
	        }
	      }

	      selection._chart = this;

	      _layer = new _layerJs2['default'](selection, options);

	      _layer.remove = function () {
	        _Chart._layers['delete'](name);
	        return this;
	      };

	      this._layers.set(name, _layer);

	      return _layer;
	    }

	    /**
	     * Register or retrieve an "attachment" Chart. The "attachment" chart's `draw`
	     * method will be invoked whenever the containing chart's `draw` method is
	     * invoked.
	     *
	     * @param {String} attachmentName Name of the attachment
	     * @param {Chart} [chart] koto to register as a mix in of this chart. When
	     *        unspecified, this method will return the attachment previously
	     *        registered with the specified `attachmentName` (if any).
	     *
	     * @returns {Chart} Reference to this chart (chainable).
	     */
	  }, {
	    key: 'attach',
	    value: function attach(attachmentName, chart) {
	      if (arguments.length === 1) {
	        return this._attached.get(attachmentName);
	      }

	      this._attached.set(attachmentName, chart);
	      return chart;
	    }

	    /**
	     * Update the chart's representation in the DOM, drawing all of its layers and
	     * any "attachment" charts (as attached via {@link Chart#attach}).
	     *
	     * Note: The first time you call this method, the property `hasDrawn` will be
	     * set to true. This is helpful if you want to only run some code on the first
	     * time the chart is drawn.
	     *
	     * @param {Object} data Data to pass to the {@link Layer#draw|draw method} of
	     *        this cart's {@link Layer|layers} (if any) and the {@link
	     *        Chart#draw|draw method} of this chart's attachments (if any).
	     */
	  }, {
	    key: 'draw',
	    value: function draw(rawData) {
	      var layer,
	          attachmentData,
	          promises = [];

	      var data = this.transform(rawData);

	      this.preDraw(data);
	      this.trigger('preDraw', data);

	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = _getIterator(this._layers.values()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          layer = _step.value;

	          layer.draw(data);
	          promises.push(layer.promise);
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator['return']) {
	            _iterator['return']();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }

	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;

	      try {
	        for (var _iterator2 = _getIterator(this._attached.entries()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var _step2$value = _slicedToArray(_step2.value, 2);

	          var attachmentName = _step2$value[0];
	          var attachment = _step2$value[1];

	          attachmentData = this.demux ? this.demux(attachmentName, data) : data;
	          attachment.draw(attachmentData);
	          promises.push(attachment.promise);
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	            _iterator2['return']();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }

	      this.hasDrawn = true;

	      this.promise = _Promise.all(promises);

	      this.postDraw();
	      this.trigger('postDraw', data);

	      this.promise.then((function () {
	        this.postTransition(data);
	        this.trigger('postTransition', data);
	      }).bind(this));
	    }

	    /**
	     * Function invoked with the context specified when the handler was bound (via
	     * {@link Chart#on} {@link Chart#once}).
	     *
	     * @callback ChartEventHandler
	     * @param {...*} arguments Invoked with the arguments passed to {@link
	     *         Chart#trigger}
	     */

	    /**
	     * Subscribe a callback function to an event triggered on the chart. See {@link
	     * Chart#once} to subscribe a callback function to an event for one occurence.
	     *
	     * @externalExample {runnable} chart-on
	     *
	     * @param {String} name Name of the event
	     * @param {ChartEventHandler} callback Function to be invoked when the event
	     *        occurs
	     * @param {Object} [context] Value to set as `this` when invoking the
	     *        `callback`. Defaults to the chart instance.
	     *
	     * @returns {Chart} A reference to this chart (chainable).
	     */
	  }, {
	    key: 'on',
	    value: function on(name, callback, context) {
	      var events;
	      if (this._events.has(name)) {
	        events = this._events.get(name);
	      } else {
	        events = new _Set();
	      }

	      events.add({
	        callback: callback,
	        context: context || this,
	        _chart: this
	      });

	      this._events.set(name, events);
	      return this;
	    }

	    /**
	     * Subscribe a callback function to an event triggered on the chart. This
	     * function will be invoked at the next occurance of the event and immediately
	     * unsubscribed. See {@link Chart#on} to subscribe a callback function to an
	     * event indefinitely.
	     *
	     * @externalExample {runnable} chart-once
	     *
	     * @param {String} name Name of the event
	     * @param {ChartEventHandler} callback Function to be invoked when the event
	     *        occurs
	     * @param {Object} [context] Value to set as `this` when invoking the
	     *        `callback`. Defaults to the chart instance
	     *
	     * @returns {Chart} A reference to this chart (chainable)
	     */
	  }, {
	    key: 'once',
	    value: function once(name, callback, context) {
	      var self = this;
	      var _once = function _once() {
	        self.off(name, _once);
	        callback.apply(this, arguments);
	      };
	      return this.on(name, _once, context);
	    }

	    /**
	     * Unsubscribe one or more callback functions from an event triggered on the
	     * chart. When no arguments are specified, *all* handlers will be unsubscribed.
	     * When only a `name` is specified, all handlers subscribed to that event will
	     * be unsubscribed. When a `name` and `callback` are specified, only that
	     * function will be unsubscribed from that event. When a `name` and `context`
	     * are specified (but `callback` is omitted), all events bound to the given
	     * event with the given context will be unsubscribed.
	     *
	     * @externalExample {runnable} chart-off
	     *
	     * @param {String} [name] Name of the event to be unsubscribed
	     * @param {ChartEventHandler} [callback] Function to be unsubscribed
	     * @param {Object} [context] Contexts to be unsubscribe
	     *
	     * @returns {Chart} A reference to this chart (chainable).
	     */
	  }, {
	    key: 'off',
	    value: function off(name, callback, context) {

	      // remove all events
	      if (arguments.length === 0) {
	        this._events.clear();
	        return this;
	      }

	      // remove all events for a specific name
	      if (arguments.length === 1) {
	        if (this._events.has(name)) {
	          this._events.get(name).clear();
	        }
	        return this;
	      }

	      // remove all events that match whatever combination of name, context
	      // and callback.

	      this._events.get(name).forEach(function (event, clone, map) {
	        if (callback && callback === clone.callback || context && context === clone.context) {
	          map['delete'](event);
	        }
	      });

	      return this;
	    }

	    /**
	     * Publish an event on this chart with the given `name`.
	     *
	     * @externalExample {runnable} chart-trigger
	     *
	     * @param {String} name Name of the event to publish
	     * @param {...*} arguments Values with which to invoke the registered
	     *        callbacks.
	     *
	     * @returns {Chart} A reference to this chart (chainable).
	     */
	  }, {
	    key: 'trigger',
	    value: function trigger(name) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      if (this._events.has(name)) {
	        this._events.get(name).forEach(function (event) {
	          var _event$callback;

	          (_event$callback = event.callback).call.apply(_event$callback, [event.context].concat(args));
	        });
	      }
	      return this;
	    }

	    /**
	     * Get and set chart options (or configs)
	     *
	     * @param  {mixed} nameOrObject name of item getting or setting
	     *                              or its an object with key value pairs.
	     * @param  {mixed} value the value for config item witha that name.
	     * @return {mixed} if getting, its the value. if setting it is the chart instance.
	     */
	  }, {
	    key: 'config',
	    value: function config(nameOrObject, value) {
	      var key;
	      var definition;
	      var _Chart = this;

	      function setPercentage() {
	        function calcultePerecentage(arr, initialValue) {
	          var min = Math.min.call(null, arr.map(function (name) {
	            return _Chart.config(name);
	          }));
	          return initialValue / min;
	        }

	        if (definition.constrain === true) {
	          definition.percentage = calcultePerecentage(['width', 'height'], definition.value);
	        } else if (Array.isArray(definition.constrain)) {
	          definition.percentage = calcultePerecentage(definition.constrain, definition.value);
	        } else {
	          definition.percentage = calcultePerecentage([definition.constrain], definition.value);
	        }
	      }

	      if (arguments.length === 0) {
	        return this.configs;
	      }

	      if (arguments.length === 1) {
	        if (typeof nameOrObject === 'object') {
	          for (key in nameOrObject) {
	            if (this.configs.has(key)) {
	              definition = this.configs.get(key);
	              if (definition.hasOwnProperty('setter')) {
	                definition.value = definition.setter.call(definition, nameOrObject[key]);
	              } else {
	                definition.value = nameOrObject[key];
	              }
	              if (definition.hasOwnProperty('constrain')) {
	                setPercentage();
	              }
	              this.configs.set(key, definition);
	            } else {
	              console.warn('config with name ' + nameOrObject + ' is not defined.');
	            }
	          }
	          return this;
	        }

	        (0, _assertJs2['default'])(this.configs.has(nameOrObject), nameOrObject + ' is not a valid option.');
	        definition = this.configs.get(nameOrObject);
	        if (definition.hasOwnProperty('getter')) {
	          return definition.getter.call(definition);
	        }
	        return definition.value;
	      }

	      if (arguments.length === 2) {
	        if (this.configs.has(nameOrObject)) {
	          definition = this.configs.get(nameOrObject);
	          if (definition.hasOwnProperty('setter')) {
	            definition.value = definition.setter.call(definition, value);
	          } else {
	            definition.value = value;
	          }
	          if (definition.hasOwnProperty('constrain')) {
	            setPercentage();
	          }
	          this.configs.set(nameOrObject, definition);
	        } else {
	          console.warn('config with name ' + nameOrObject + ' is not defined.');
	        }
	        return this;
	      }
	    }

	    /**
	     * This will get or set any of the chart's accessors.
	     *
	     * @param  {String or Object} item If string, it will return the function for that accessor item.
	     *                                 If object, it will update that accessor with set function.
	     * @param  {function} [value] The function to update accessor item with.
	     * @return {object} The chart to preserve chainability.
	     */
	  }, {
	    key: 'accessor',
	    value: function accessor(item, value) {
	      var key;
	      if (arguments.length === 0) {
	        return this.accessors;
	      }

	      if (arguments.length === 1) {
	        if (typeof item === 'string') {
	          (0, _assertJs2['default'])(this.accessors.has(item), item + ' is not a valid accessor.');
	          return this.accessors.get(item);
	        } else {
	          for (key in item) {
	            this.accessors.set(key, item[key]);
	          }
	        }
	      } else {
	        this.accessors.set(item, value);
	      }
	      return this;
	    }

	    /**
	     * This will extend a chart by passing in an object of initialize function.
	     * @param  {Object || function} init Initialize function of object with initialize method.
	     * @return {Construtor}      Chart constructor
	     */
	  }], [{
	    key: 'extend',
	    value: function extend(init) {
	      var chart = (function (_ref) {
	        _inherits(chart, _ref);

	        function chart(selection) {
	          _classCallCheck(this, chart);

	          var key;
	          _get(Object.getPrototypeOf(chart.prototype), 'constructor', this).call(this, selection);

	          if (typeof init === 'function') {
	            init.call(this);
	          } else {
	            for (key in init) {
	              this[key] = init[key];
	            }
	            this.initialize.call(this);
	          }
	        }

	        return chart;
	      })(this);

	      return chart;
	    }
	  }]);

	  return Chart;
	})();

	exports['default'] = Chart;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$defineProperty = __webpack_require__(2)["default"];

	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;

	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(4);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	exports.__esModule = true;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$getOwnPropertyDescriptor = __webpack_require__(7)["default"];

	exports["default"] = function get(_x, _x2, _x3) {
	  var _again = true;

	  _function: while (_again) {
	    var object = _x,
	        property = _x2,
	        receiver = _x3;
	    desc = parent = getter = undefined;
	    _again = false;
	    if (object === null) object = Function.prototype;

	    var desc = _Object$getOwnPropertyDescriptor(object, property);

	    if (desc === undefined) {
	      var parent = Object.getPrototypeOf(object);

	      if (parent === null) {
	        return undefined;
	      } else {
	        _x = parent;
	        _x2 = property;
	        _x3 = receiver;
	        _again = true;
	        continue _function;
	      }
	    } else if ("value" in desc) {
	      return desc.value;
	    } else {
	      var getter = desc.get;

	      if (getter === undefined) {
	        return undefined;
	      }

	      return getter.call(receiver);
	    }
	  }
	};

	exports.__esModule = true;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(8), __esModule: true };

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(4);
	__webpack_require__(9);
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $.getDesc(it, key);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(10);

	__webpack_require__(14)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(11)
	  , defined = __webpack_require__(13);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// indexed object, fallback for non-array-like ES3 strings
	var cof = __webpack_require__(12);
	module.exports = 0 in Object('z') ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	module.exports = function(KEY, exec){
	  var $def = __webpack_require__(15)
	    , fn   = (__webpack_require__(17).Object || {})[KEY] || Object[KEY]
	    , exp  = {};
	  exp[KEY] = exec(fn);
	  $def($def.S + $def.F * __webpack_require__(18)(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(16)
	  , core      = __webpack_require__(17)
	  , PROTOTYPE = 'prototype';
	var ctx = function(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	};
	var $def = function(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , isProto  = type & $def.P
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {})[PROTOTYPE]
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    if(isGlobal && typeof target[key] != 'function')exp = source[key];
	    // bind timers to global for call from export context
	    else if(type & $def.B && own)exp = ctx(out, global);
	    // wrap global constructors for prevent change them in library
	    else if(type & $def.W && target[key] == out)!function(C){
	      exp = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      exp[PROTOTYPE] = C[PROTOTYPE];
	    }(out);
	    else exp = isProto && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export
	    exports[key] = exp;
	    if(isProto)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	module.exports = $def;

/***/ },
/* 16 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var UNDEFINED = 'undefined';
	var global = module.exports = typeof window != UNDEFINED && window.Math == Math
	  ? window : typeof self != UNDEFINED && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 17 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _Object$create = __webpack_require__(20)["default"];

	var _Object$setPrototypeOf = __webpack_require__(22)["default"];

	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	exports.__esModule = true;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(21), __esModule: true };

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(4);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(23), __esModule: true };

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(24);
	module.exports = __webpack_require__(17).Object.setPrototypeOf;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $def = __webpack_require__(15);
	$def($def.S, 'Object', {setPrototypeOf: __webpack_require__(25).set});

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(4).getDesc
	  , isObject = __webpack_require__(26)
	  , anObject = __webpack_require__(27);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line no-proto
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(28)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(29);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _getIterator = __webpack_require__(31)["default"];

	var _isIterable = __webpack_require__(56)["default"];

	exports["default"] = (function () {
	  function sliceIterator(arr, i) {
	    var _arr = [];
	    var _n = true;
	    var _d = false;
	    var _e = undefined;

	    try {
	      for (var _i = _getIterator(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	        _arr.push(_s.value);

	        if (i && _arr.length === i) break;
	      }
	    } catch (err) {
	      _d = true;
	      _e = err;
	    } finally {
	      try {
	        if (!_n && _i["return"]) _i["return"]();
	      } finally {
	        if (_d) throw _e;
	      }
	    }

	    return _arr;
	  }

	  return function (arr, i) {
	    if (Array.isArray(arr)) {
	      return arr;
	    } else if (_isIterable(Object(arr))) {
	      return sliceIterator(arr, i);
	    } else {
	      throw new TypeError("Invalid attempt to destructure non-iterable instance");
	    }
	  };
	})();

	exports.__esModule = true;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(32), __esModule: true };

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(33);
	__webpack_require__(50);
	module.exports = __webpack_require__(53);

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(34);
	var Iterators = __webpack_require__(37);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var setUnscope = __webpack_require__(35)
	  , step       = __webpack_require__(36)
	  , Iterators  = __webpack_require__(37)
	  , toIObject  = __webpack_require__(10);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	__webpack_require__(38)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 36 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY         = __webpack_require__(39)
	  , $def            = __webpack_require__(15)
	  , $redef          = __webpack_require__(40)
	  , hide            = __webpack_require__(41)
	  , has             = __webpack_require__(44)
	  , SYMBOL_ITERATOR = __webpack_require__(45)('iterator')
	  , Iterators       = __webpack_require__(37)
	  , BUGGY           = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR     = '@@iterator'
	  , KEYS            = 'keys'
	  , VALUES          = 'values';
	var returnThis = function(){ return this; };
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
	  __webpack_require__(48)(Constructor, NAME, next);
	  var createMethod = function(kind){
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG      = NAME + ' Iterator'
	    , proto    = Base.prototype
	    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , _default = _native || createMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if(_native){
	    var IteratorPrototype = __webpack_require__(4).getProto(_default.call(new Base));
	    // Set @@toStringTag to native iterators
	    __webpack_require__(49)(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, SYMBOL_ITERATOR, returnThis);
	  }
	  // Define iterator
	  if(!LIBRARY || FORCE)hide(proto, SYMBOL_ITERATOR, _default);
	  // Plug for library
	  Iterators[NAME] = _default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      keys:    IS_SET            ? _default : createMethod(KEYS),
	      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
	      entries: DEFAULT != VALUES ? _default : createMethod('entries')
	    };
	    if(FORCE)for(key in methods){
	      if(!(key in proto))$redef(proto, key, methods[key]);
	    } else $def($def.P + $def.F * BUGGY, NAME, methods);
	  }
	};

/***/ },
/* 39 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(41);

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(4)
	  , createDesc = __webpack_require__(42);
	module.exports = __webpack_require__(43) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(18)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 44 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(46)('wks')
	  , Symbol = __webpack_require__(16).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || __webpack_require__(47))('Symbol.' + name));
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(16)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 47 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $ = __webpack_require__(4)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(41)(IteratorPrototype, __webpack_require__(45)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: __webpack_require__(42)(1,next)});
	  __webpack_require__(49)(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var has  = __webpack_require__(44)
	  , hide = __webpack_require__(41)
	  , TAG  = __webpack_require__(45)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))hide(it, TAG, tag);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(51)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(38)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// true  -> String#at
	// false -> String#codePointAt
	var toInteger = __webpack_require__(52)
	  , defined   = __webpack_require__(13);
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	        ? TO_STRING ? s.charAt(i) : a
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(27)
	  , get      = __webpack_require__(54);
	module.exports = __webpack_require__(17).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(55)
	  , ITERATOR  = __webpack_require__(45)('iterator')
	  , Iterators = __webpack_require__(37);
	module.exports = __webpack_require__(17).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(12)
	  , TAG = __webpack_require__(45)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(57), __esModule: true };

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(33);
	__webpack_require__(50);
	module.exports = __webpack_require__(58);

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(55)
	  , ITERATOR  = __webpack_require__(45)('iterator')
	  , Iterators = __webpack_require__(37);
	module.exports = __webpack_require__(17).isIterable = function(it){
	  var O = Object(it);
	  return ITERATOR in O || '@@iterator' in O || Iterators.hasOwnProperty(classof(O));
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(60), __esModule: true };

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(61);
	__webpack_require__(50);
	__webpack_require__(33);
	__webpack_require__(62);
	__webpack_require__(72);
	module.exports = __webpack_require__(17).Map;

/***/ },
/* 61 */
/***/ function(module, exports) {

	

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(63);

	// 23.1 Map Objects
	__webpack_require__(71)('Map', function(get){
	  return function Map(){ return get(this, arguments[0]); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $            = __webpack_require__(4)
	  , hide         = __webpack_require__(41)
	  , ctx          = __webpack_require__(28)
	  , species      = __webpack_require__(64)
	  , strictNew    = __webpack_require__(65)
	  , defined      = __webpack_require__(13)
	  , forOf        = __webpack_require__(66)
	  , step         = __webpack_require__(36)
	  , ID           = __webpack_require__(47)('id')
	  , $has         = __webpack_require__(44)
	  , isObject     = __webpack_require__(26)
	  , isExtensible = Object.isExtensible || isObject
	  , SUPPORT_DESC = __webpack_require__(43)
	  , SIZE         = SUPPORT_DESC ? '_s' : 'size'
	  , id           = 0;

	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!$has(it, ID)){
	    // can't set id to frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add id
	    if(!create)return 'E';
	    // add missing object id
	    hide(it, ID, ++id);
	  // return object id with prefix
	  } return 'O' + it[ID];
	};

	var getEntry = function(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index !== 'F')return that._i[index];
	  // frozen object case
	  for(entry = that._f; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	};

	module.exports = {
	  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
	    var C = wrapper(function(that, iterable){
	      strictNew(that, C, NAME);
	      that._i = $.create(null); // index
	      that._f = undefined;      // first entry
	      that._l = undefined;      // last entry
	      that[SIZE] = 0;           // size
	      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
	    });
	    __webpack_require__(70)(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear(){
	        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that._f == entry)that._f = next;
	          if(that._l == entry)that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /*, that = undefined */){
	        var f = ctx(callbackfn, arguments[1], 3)
	          , entry;
	        while(entry = entry ? entry.n : this._f){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if(SUPPORT_DESC)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return defined(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that._f)that._f = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index !== 'F')that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function(C, NAME, IS_MAP){
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    __webpack_require__(38)(C, NAME, function(iterated, kind){
	      this._t = iterated;  // target
	      this._k = kind;      // kind
	      this._l = undefined; // previous
	    }, function(){
	      var that  = this
	        , kind  = that._k
	        , entry = that._l;
	      // revert to the last existing entry
	      while(entry && entry.r)entry = entry.p;
	      // get next entry
	      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if(kind == 'keys'  )return step(0, entry.k);
	      if(kind == 'values')return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    species(C);
	    species(__webpack_require__(17)[NAME]); // for wrapper
	  }
	};

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $       = __webpack_require__(4)
	  , SPECIES = __webpack_require__(45)('species');
	module.exports = function(C){
	  if(__webpack_require__(43) && !(SPECIES in C))$.setDesc(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(28)
	  , call        = __webpack_require__(67)
	  , isArrayIter = __webpack_require__(68)
	  , anObject    = __webpack_require__(27)
	  , toLength    = __webpack_require__(69)
	  , getIterFn   = __webpack_require__(54);
	module.exports = function(iterable, entries, fn, that){
	  var iterFn = getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    call(iterator, f, step.value, entries);
	  }
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(27);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators = __webpack_require__(37)
	  , ITERATOR  = __webpack_require__(45)('iterator');
	module.exports = function(it){
	  return (Iterators.Array || Array.prototype[ITERATOR]) === it;
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(52)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	var $redef = __webpack_require__(40);
	module.exports = function(target, src){
	  for(var key in src)$redef(target, key, src[key]);
	  return target;
	};

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $          = __webpack_require__(4)
	  , $def       = __webpack_require__(15)
	  , hide       = __webpack_require__(41)
	  , forOf      = __webpack_require__(66)
	  , strictNew  = __webpack_require__(65);

	module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
	  var Base  = __webpack_require__(16)[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  if(!__webpack_require__(43) || typeof C != 'function'
	    || !(IS_WEAK || proto.forEach && !__webpack_require__(18)(function(){ new C().entries().next(); }))
	  ){
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    __webpack_require__(70)(C.prototype, methods);
	  } else {
	    C = wrapper(function(target, iterable){
	      strictNew(target, C, NAME);
	      target._c = new Base;
	      if(iterable != undefined)forOf(iterable, IS_MAP, target[ADDER], target);
	    });
	    $.each.call('add,clear,delete,forEach,get,has,set,keys,values,entries'.split(','),function(KEY){
	      var chain = KEY == 'add' || KEY == 'set';
	      if(KEY in proto && !(IS_WEAK && KEY == 'clear'))hide(C.prototype, KEY, function(a, b){
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return chain ? this : result;
	      });
	    });
	    if('size' in proto)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return this._c.size;
	      }
	    });
	  }

	  __webpack_require__(49)(C, NAME);

	  O[NAME] = C;
	  $def($def.G + $def.W + $def.F, O);

	  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $def  = __webpack_require__(15);

	$def($def.P, 'Map', {toJSON: __webpack_require__(73)('Map')});

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var forOf   = __webpack_require__(66)
	  , classof = __webpack_require__(55);
	module.exports = function(NAME){
	  return function toJSON(){
	    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
	    var arr = [];
	    forOf(this, false, arr.push, arr);
	    return arr;
	  };
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(75), __esModule: true };

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(61);
	__webpack_require__(50);
	__webpack_require__(33);
	__webpack_require__(76);
	module.exports = __webpack_require__(17).Promise;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $          = __webpack_require__(4)
	  , LIBRARY    = __webpack_require__(39)
	  , global     = __webpack_require__(16)
	  , ctx        = __webpack_require__(28)
	  , classof    = __webpack_require__(55)
	  , $def       = __webpack_require__(15)
	  , isObject   = __webpack_require__(26)
	  , anObject   = __webpack_require__(27)
	  , aFunction  = __webpack_require__(29)
	  , strictNew  = __webpack_require__(65)
	  , forOf      = __webpack_require__(66)
	  , setProto   = __webpack_require__(25).set
	  , same       = __webpack_require__(77)
	  , species    = __webpack_require__(64)
	  , SPECIES    = __webpack_require__(45)('species')
	  , RECORD     = __webpack_require__(47)('record')
	  , asap       = __webpack_require__(78)
	  , PROMISE    = 'Promise'
	  , process    = global.process
	  , isNode     = classof(process) == 'process'
	  , P          = global[PROMISE]
	  , Wrapper;

	var testResolve = function(sub){
	  var test = new P(function(){});
	  if(sub)test.constructor = Object;
	  return P.resolve(test) === test;
	};

	var useNative = function(){
	  var works = false;
	  function P2(x){
	    var self = new P(x);
	    setProto(self, P2.prototype);
	    return self;
	  }
	  try {
	    works = P && P.resolve && testResolve();
	    setProto(P2, P);
	    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
	    // actual Firefox has broken subclass support, test that
	    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
	      works = false;
	    }
	    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
	    if(works && __webpack_require__(43)){
	      var thenableThenGotten = false;
	      P.resolve($.setDesc({}, 'then', {
	        get: function(){ thenableThenGotten = true; }
	      }));
	      works = thenableThenGotten;
	    }
	  } catch(e){ works = false; }
	  return works;
	}();

	// helpers
	var isPromise = function(it){
	  return isObject(it) && (useNative ? classof(it) == 'Promise' : RECORD in it);
	};
	var sameConstructor = function(a, b){
	  // library wrapper special case
	  if(LIBRARY && a === P && b === Wrapper)return true;
	  return same(a, b);
	};
	var getConstructor = function(C){
	  var S = anObject(C)[SPECIES];
	  return S != undefined ? S : C;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function(record, isReject){
	  if(record.n)return;
	  record.n = true;
	  var chain = record.c;
	  asap(function(){
	    var value = record.v
	      , ok    = record.s == 1
	      , i     = 0;
	    var run = function(react){
	      var cb = ok ? react.ok : react.fail
	        , ret, then;
	      try {
	        if(cb){
	          if(!ok)record.h = true;
	          ret = cb === true ? value : cb(value);
	          if(ret === react.P){
	            react.rej(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(ret)){
	            then.call(ret, react.res, react.rej);
	          } else react.res(ret);
	        } else react.rej(value);
	      } catch(err){
	        react.rej(err);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    chain.length = 0;
	    record.n = false;
	    if(isReject)setTimeout(function(){
	      var promise = record.p
	        , handler, console;
	      if(isUnhandled(promise)){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      } record.a = undefined;
	    }, 1);
	  });
	};
	var isUnhandled = function(promise){
	  var record = promise[RECORD]
	    , chain  = record.a || record.c
	    , i      = 0
	    , react;
	  if(record.h)return false;
	  while(chain.length > i){
	    react = chain[i++];
	    if(react.fail || !isUnhandled(react.P))return false;
	  } return true;
	};
	var $reject = function(value){
	  var record = this;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  record.v = value;
	  record.s = 2;
	  record.a = record.c.slice();
	  notify(record, true);
	};
	var $resolve = function(value){
	  var record = this
	    , then;
	  if(record.d)return;
	  record.d = true;
	  record = record.r || record; // unwrap
	  try {
	    if(then = isThenable(value)){
	      asap(function(){
	        var wrapper = {r: record, d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      record.v = value;
	      record.s = 1;
	      notify(record, false);
	    }
	  } catch(e){
	    $reject.call({r: record, d: false}, e); // wrap
	  }
	};

	// constructor polyfill
	if(!useNative){
	  // 25.4.3.1 Promise(executor)
	  P = function Promise(executor){
	    aFunction(executor);
	    var record = {
	      p: strictNew(this, P, PROMISE),         // <- promise
	      c: [],                                  // <- awaiting reactions
	      a: undefined,                           // <- checked in isUnhandled reactions
	      s: 0,                                   // <- state
	      d: false,                               // <- done
	      v: undefined,                           // <- value
	      h: false,                               // <- handled rejection
	      n: false                                // <- notify
	    };
	    this[RECORD] = record;
	    try {
	      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
	    } catch(err){
	      $reject.call(record, err);
	    }
	  };
	  __webpack_require__(70)(P.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var S = anObject(anObject(this).constructor)[SPECIES];
	      var react = {
	        ok:   typeof onFulfilled == 'function' ? onFulfilled : true,
	        fail: typeof onRejected == 'function'  ? onRejected  : false
	      };
	      var promise = react.P = new (S != undefined ? S : P)(function(res, rej){
	        react.res = res;
	        react.rej = rej;
	      });
	      aFunction(react.res);
	      aFunction(react.rej);
	      var record = this[RECORD];
	      record.c.push(react);
	      if(record.a)record.a.push(react);
	      if(record.s)notify(record, false);
	      return promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	}

	// export
	$def($def.G + $def.W + $def.F * !useNative, {Promise: P});
	__webpack_require__(49)(P, PROMISE);
	species(P);
	species(Wrapper = __webpack_require__(17)[PROMISE]);

	// statics
	$def($def.S + $def.F * !useNative, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    return new this(function(res, rej){ rej(r); });
	  }
	});
	$def($def.S + $def.F * (!useNative || testResolve(true)), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    return isPromise(x) && sameConstructor(x.constructor, this)
	      ? x : new this(function(res){ res(x); });
	  }
	});
	$def($def.S + $def.F * !(useNative && __webpack_require__(83)(function(iter){
	  P.all(iter)['catch'](function(){});
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C      = getConstructor(this)
	      , values = [];
	    return new C(function(res, rej){
	      forOf(iterable, false, values.push, values);
	      var remaining = values.length
	        , results   = Array(remaining);
	      if(remaining)$.each.call(values, function(promise, index){
	        C.resolve(promise).then(function(value){
	          results[index] = value;
	          --remaining || res(results);
	        }, rej);
	      });
	      else res(results);
	    });
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C = getConstructor(this);
	    return new C(function(res, rej){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(res, rej);
	      });
	    });
	  }
	});

/***/ },
/* 77 */
/***/ function(module, exports) {

	module.exports = Object.is || function is(x, y){
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(16)
	  , macrotask = __webpack_require__(79).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , isNode    = __webpack_require__(12)(process) == 'process'
	  , head, last, notify;

	var flush = function(){
	  var parent, domain;
	  if(isNode && (parent = process.domain)){
	    process.domain = null;
	    parent.exit();
	  }
	  while(head){
	    domain = head.domain;
	    if(domain)domain.enter();
	    head.fn.call(); // <- currently we use it only for Promise - try / catch not required
	    if(domain)domain.exit();
	    head = head.next;
	  } last = undefined;
	  if(parent)parent.enter();
	}

	// Node.js
	if(isNode){
	  notify = function(){
	    process.nextTick(flush);
	  };
	// browsers with MutationObserver
	} else if(Observer){
	  var toggle = 1
	    , node   = document.createTextNode('');
	  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	  notify = function(){
	    node.data = toggle = -toggle;
	  };
	// for other environments - macrotask based on:
	// - setImmediate
	// - MessageChannel
	// - window.postMessag
	// - onreadystatechange
	// - setTimeout
	} else {
	  notify = function(){
	    // strange IE + webpack dev server bug - use .call(global)
	    macrotask.call(global, flush);
	  };
	}

	module.exports = function asap(fn){
	  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
	  if(last)last.next = task;
	  if(!head){
	    head = task;
	    notify();
	  } last = task;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx                = __webpack_require__(28)
	  , invoke             = __webpack_require__(80)
	  , html               = __webpack_require__(81)
	  , cel                = __webpack_require__(82)
	  , global             = __webpack_require__(16)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listner = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(12)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listner;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScript){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listner, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 80 */
/***/ function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16).document && document.documentElement;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(26)
	  , document = __webpack_require__(16).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var SYMBOL_ITERATOR = __webpack_require__(45)('iterator')
	  , SAFE_CLOSING    = false;
	try {
	  var riter = [7][SYMBOL_ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	module.exports = function(exec){
	  if(!SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[SYMBOL_ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[SYMBOL_ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(85), __esModule: true };

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(61);
	__webpack_require__(50);
	__webpack_require__(33);
	__webpack_require__(86);
	__webpack_require__(87);
	module.exports = __webpack_require__(17).Set;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(63);

	// 23.2 Set Objects
	__webpack_require__(71)('Set', function(get){
	  return function Set(){ return get(this, arguments[0]); };
	}, {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function add(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $def  = __webpack_require__(15);

	$def($def.P, 'Set', {toJSON: __webpack_require__(73)('Set')});

/***/ },
/* 88 */
/***/ function(module, exports) {

	"use strict";

	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};

	exports.__esModule = true;

/***/ },
/* 89 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_89__;

/***/ },
/* 90 */
/***/ function(module, exports) {

	/**
	 * Simple Assertion function
	 * @param  {anything} test    Anything that will evaluate to true of false.
	 * @param  {string} message The error message to send if `test` is false
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function kotoAssert(test, message) {
	  if (test) {
	    return;
	  }
	  throw new Error("[koto] " + message);
	}

	exports["default"] = kotoAssert;
	module.exports = exports["default"];

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = __webpack_require__(1)['default'];

	var _classCallCheck = __webpack_require__(5)['default'];

	var _Promise = __webpack_require__(74)['default'];

	var _interopRequireDefault = __webpack_require__(88)['default'];

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _assertJs = __webpack_require__(90);

	var _assertJs2 = _interopRequireDefault(_assertJs);

	/**
	 * Create a layer using the provided `base`. The layer instance is *not*
	 * exposed to d3.chart users. Instead, its instance methods are mixed in to the
	 * `base` selection it describes; users interact with the instance via these
	 * bound methods.
	 *
	 * @private
	 * @class
	 *
	 * @param {d3.selection} base The containing DOM node for the layer.
	 */

	var Layer = (function () {
	  function Layer(base, options) {
	    _classCallCheck(this, Layer);

	    this._base = base;
	    this._handlers = {};
	    this._lifecycleRe = /^(enter|update|merge|exit)(:transition)?$/;

	    if (options) {
	      // Set layer methods (required)
	      this.dataBind = options.dataBind;
	      this.insert = options.insert;

	      // Bind events (optional)
	      if ('events' in options) {
	        for (var eventName in options.events) {
	          this.on(eventName, options.events[eventName]);
	        }
	      }
	    }
	  }

	  /**
	   * Invoked by {@link Layer#draw} to join data with this layer's DOM nodes. This
	   * implementation is "virtual"--it *must* be overridden by Layer instances.
	   *
	   * @param {Array} data Value passed to {@link Layer#draw}
	   */

	  _createClass(Layer, [{
	    key: 'dataBind',
	    value: function dataBind() {
	      (0, _assertJs2['default'])(false, 'Layers must specify a dataBind method.');
	    }

	    /**
	     * Invoked by {@link Layer#draw} in order to insert new DOM nodes into this
	     * layer's `base`. This implementation is "virtual"--it *must* be overridden by
	     * Layer instances.
	     */
	  }, {
	    key: 'insert',
	    value: function insert() {
	      (0, _assertJs2['default'])(false, 'Layers must specify an `insert` method.');
	    }

	    /**
	     * Subscribe a handler to a "lifecycle event". These events (and only these
	     * events) are triggered when {@link Layer#draw} is invoked--see that method
	     * for more details on lifecycle events.
	     *
	     * @param {String} eventName Identifier for the lifecycle event for which to
	     *        subscribe.
	     * @param {Function} handler Callback function
	     *
	     * @returns {Chart} Reference to the layer instance (chaining).
	     */
	  }, {
	    key: 'on',
	    value: function on(eventName, handler, options) {
	      options = options || {};

	      (0, _assertJs2['default'])(this._lifecycleRe.test(eventName), 'Unrecognized lifecycle event name specified to \'Layer#on\': \'' + eventName + '\'.');

	      if (!(eventName in this._handlers)) {
	        this._handlers[eventName] = [];
	      }
	      this._handlers[eventName].push({
	        callback: handler,
	        chart: options.chart || null
	      });

	      return this;
	    }

	    /**
	     * Unsubscribe the specified handler from the specified event. If no handler is
	     * supplied, remove *all* handlers from the event.
	     *
	     * @param {String} eventName Identifier for event from which to remove
	     *        unsubscribe
	     * @param {Function} handler Callback to remove from the specified event
	     *
	     * @returns {Chart} Reference to the layer instance (chaining).
	     */
	  }, {
	    key: 'off',
	    value: function off(eventName, handler) {
	      var handlers = this._handlers[eventName];
	      var idx;

	      (0, _assertJs2['default'])(this._lifecycleRe.test(eventName), 'Unrecognized lifecycle event name specified to \'Layer#on\': \'' + eventName + '\'.');

	      if (!handlers) {
	        return this;
	      }

	      if (arguments.length === 1) {
	        handlers.length = 0;
	        return this;
	      }

	      for (idx = handlers.length - 1; idx > -1; --idx) {
	        if (handlers[idx].callback === handler) {
	          handlers.splice(idx, 1);
	        }
	      }

	      return this;
	    }

	    /**
	     * Render the layer according to the input data: Bind the data to the layer
	     * (according to {@link Layer#dataBind}, insert new elements (according to
	     * {@link Layer#insert}, make lifecycle selections, and invoke all relevant
	     * handlers (as attached via {@link Layer#on}) with the lifecycle selections.
	     *
	     * - update
	     * - update:transition
	     * - enter
	     * - enter:transition
	     * - exit
	     * - exit:transition
	     *
	     * @param {Array} data Data to drive the rendering.
	     */
	  }, {
	    key: 'draw',
	    value: function draw(data) {
	      var bound,
	          entering,
	          events,
	          selection,
	          method,
	          handlers,
	          eventName,
	          idx,
	          len,
	          tidx,
	          tlen,
	          promises = [];

	      function endall(transition, callback) {
	        var n = 0;
	        if (transition.size() === 0) {
	          callback();
	        } else {
	          transition.each(function () {
	            ++n;
	          }).each('interrupt.promise', function () {
	            callback.apply(this, arguments);
	          }).each('end.promise', function () {
	            if (! --n) {
	              callback.apply(this, arguments);
	            }
	          });
	        }
	      }

	      function promiseCallback(resolve) {
	        selection.call(endall, function () {
	          resolve(true);
	        });
	      }

	      bound = this.dataBind.call(this._base, data);

	      (0, _assertJs2['default'])(bound instanceof d3.selection, 'Invalid selection defined by `Layer#dataBind` method.');
	      (0, _assertJs2['default'])(bound.enter, 'Layer selection not properly bound.');

	      entering = bound.enter();
	      entering._chart = this._base._chart;

	      events = [{
	        name: 'update',
	        selection: bound
	      }, {
	        name: 'enter',
	        selection: entering,
	        method: this.insert
	      }, {
	        name: 'merge',
	        // Although the `merge` lifecycle event shares its selection object
	        // with the `update` lifecycle event, the object's contents will be
	        // modified when d3.chart invokes the user-supplied `insert` method
	        // when triggering the `enter` event.
	        selection: bound
	      }, {
	        name: 'exit',
	        // Although the `exit` lifecycle event shares its selection object
	        // with the `update` and `merge` lifecycle events, the object's
	        // contents will be modified when d3.chart invokes
	        // `d3.selection.exit`.
	        selection: bound,
	        method: bound.exit
	      }];

	      for (var i = 0, l = events.length; i < l; ++i) {
	        eventName = events[i].name;
	        selection = events[i].selection;
	        method = events[i].method;

	        // Some lifecycle selections modify shared state, so they must be
	        // deferred until just prior to handler invocation.
	        if (typeof method === 'function') {
	          selection = method.call(selection);
	        }

	        if (selection.empty()) {
	          continue;
	        }

	        // Although `selection instanceof d3.selection` is more explicit,
	        // it fails in IE8, so we use duck typing to maintain
	        // compatability.

	        (0, _assertJs2['default'])(selection && selection instanceof d3.selection, 'Invalid selection defined for ' + eventName + ' lifecycle event.');

	        handlers = this._handlers[eventName];

	        if (handlers) {
	          for (idx = 0, len = handlers.length; idx < len; ++idx) {
	            // Attach a reference to the parent chart so the selection"s
	            // `chart` method will function correctly.
	            selection._chart = handlers[idx].chart || this._base._chart;
	            selection.call(handlers[idx].callback);
	          }
	        }

	        handlers = this._handlers[eventName + ':transition'];

	        if (handlers && handlers.length) {
	          selection = selection.transition();
	          for (tlen = handlers.length, tidx = 0; tidx < tlen; ++tidx) {
	            selection._chart = handlers[tidx].chart || this._base._chart;
	            selection.call(handlers[tidx].callback);
	            promises.push(new _Promise(promiseCallback));
	          }
	        }
	        this.promise = _Promise.all(promises);
	      }
	    }
	  }]);

	  return Layer;
	})();

	exports['default'] = Layer;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;