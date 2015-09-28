System.register(['d3', './assert.js', './layer.js'], function (_export) {

  // d3 is required
  'use strict';

  var d3, kotoAssert, Layer, Chart;

  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_d3) {
      d3 = _d3['default'];
    }, function (_assertJs) {
      kotoAssert = _assertJs['default'];
    }, function (_layerJs) {
      Layer = _layerJs['default'];
    }],
    execute: function () {
      kotoAssert(d3, 'd3 js is required.');

      /**
       * Create a koto chart
       *
       * @constructor
       *
       * @param {d3.selection} selection The chart's "base" DOM node. This should
       *        contain any nodes that the chart generates.
       */

      Chart = (function () {
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
          this.configs = new Map();
          this.accessors = new Map();
          this.promise = null;

          // private
          this._layers = new Map();
          this._attached = new Map();
          this._events = new Map();

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

              if (selection instanceof Layer) {
                selection._chart = this;
                this._layers.set(name, selection);
                return this._layers.get(name);
              } else {
                kotoAssert(false, 'When reattaching a layer, the second argument must be a koto layer');
              }
            }

            selection._chart = this;

            _layer = new Layer(selection, options);

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
              for (var _iterator = this._layers.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
              for (var _iterator2 = this._attached.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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

            this.promise = Promise.all(promises);

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
              events = new Set();
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

              kotoAssert(this.configs.has(nameOrObject), nameOrObject + ' is not a valid option.');
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
                kotoAssert(this.accessors.has(item), item + ' is not a valid accessor.');
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

      _export('default', Chart);
    }
  };
});
//# sourceMappingURL=chart.js.map