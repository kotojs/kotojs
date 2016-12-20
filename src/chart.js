import 'babel-polyfill';
import * as d3 from 'd3';
import kotoAssert from './assert.js';
import Layer from './layer.js';

// d3 is required
kotoAssert(d3, 'd3 js is required.');
/**
 * Create a koto chart
 *
 * @constructor
 *
 * @param {d3.selection} selection The chart's "base" DOM node. This should
 *        contain any nodes that the chart generates.
 */
class Chart {
  constructor(selection) {
    this.base = selection; // Container for chart @type {d3.selection}.
    this.hasDrawn = false; // Has this chart been drawn at least once?

    this.merge = {};
    this.merge.configs = (...args) => {
      this.configs = Object.assign({}, this.configs, ...args);
      return this.configs;
    };
    this.merge.accessors = (...args) => {
      this.accessors = Object.assign({}, this.accessors, ...args);
      return this.accessors;
    };

    // exposed properties
    this.configs = {};
    this.accessors = {};
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
   * sub-classes. You may optionally return a promise if your data transformation
   * is asynchronous (i.e. you're using web workers).
   *
   * Note: you will most likely never call this method directly, but rather
   * include it as part of a chart definition, and then rely on koto to
   * invoke it when you draw the chart with {@link Chart#draw}.
   *
   * @param {Array} data Input data provided to @link Chart#draw}.
   * @returns {mixed} Data to be used in drawing the chart's layers and
   *                  attachments.
   */
  transform(data) { return data; }

  /**
   * A "hook" method that you may define to choose which mutation of the input
   * data is sent to which of the attached charts (by name). This method will
   * be used by all sub-classes. This only applies to charts that use the
   * {@link Chart#attach} method.
   *
   * Note: you will most likely never call this method directly, but rather
   * include it as part of a chart definition, and then rely on koto to
   * invoke it when you draw the chart with {@link Chart#draw}.
   *
   * @param {String} data Name of attached chart defined in {@link Chart#attach}.
   * @param {Array} data Input data provided to {@link Chart#draw}.
   * @returns {mixed} Data to be used in drawing the chart's layers and
   *                  attachments.
   */
  demux(name, data) { return data; }

  /**
   * A "hook" method that will allow you to run some arbitrary code before
   * {@link Chart#draw}. This will run every time {@link Chart#draw} is called.
   *
   * Note: you will most likely never call this method directly, but rather
   * include it as part of a chart definition, and then rely on koto to
   * invoke it when you draw the chart with {@link Chart#draw}.
   *
   * Note 2: a `postDraw` event is also fired when appropriate;
   *
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  preDraw() {}

  /**
   * A "hook" method that will allow you to run some arbitrary code after
   * {@link Chart#draw}. This will run every time {@link Chart#draw} is called.
   *
   * Note: you will most likely never call this method directly, but rather
   * include it as part of a chart definition, and then rely on koto to
   * invoke it when you draw the chart with {@link Chart#draw}.
   *
   * @param  {[type]} data [description]
   */
  postDraw() {}

  /**
   * A "hook" method that will allow you to run some arbitrary code after
   * {@link Chart#draw} is called AND after all transitions for all layers
   * and attached charts have been completed. This will run every time
   * {@link Chart#draw} is called.
   *
   * Note: you will most likely never call this method directly, but rather
   * include it as part of a chart definition, and then rely on koto to
   * invoke it when you draw the chart with {@link Chart#draw}.
   *
   * Note 2: a `postTransition` event is also fired when appropriate;
   *
   * @param  {[type]} data
   */
  postTransition() {}

  /**
   * Remove a layer from the chart.
   *
   * @param {String} name The name of the layer to remove.
   * @returns {Layer} The layer removed by this operation.
   */
  unlayer(name) {
    var layer = this.layer(name);

    this._layers.delete(name);
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
  layer(name, selection, options) {
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
      _Chart._layers.delete(name);
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
  attach(attachmentName, chart) {
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
  draw(rawData) {
    var layer, attachmentData, promises = [];

    return Promise.resolve(this.transform(rawData))
      .then((data) => {
        this.preDraw(data);
        this.trigger('preDraw', data);

        for (layer of this._layers.values()) {
          layer.draw(data);
          promises.push(layer.promise);
        }

        for (var [attachmentName, attachment] of this._attached.entries()) {
          attachmentData = this.demux ? this.demux(attachmentName, data) : data;
          attachment.draw(attachmentData);
          promises.push(attachment.promise);
        }

        this.hasDrawn = true;

        this.promise = Promise.all(promises);

        this.postDraw();
        this.trigger('postDraw', data);

        this.promise.then(() => {
          this.postTransition(data);
          this.trigger('postTransition', data);
        });

        return data;
      });
  }

  /**
   * Subscribe a callback function to an event triggered on the chart. See {@link
   * Chart#once} to subscribe a callback function to an event for one occurrence.
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
  on(name, callback, context) {
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
   * function will be invoked at the next occurrence of the event and immediately
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
  once(name, callback, context) {
    var self = this;
    var _once = function() {
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
   * @param {Object} [context] Contexts to be unsubscribed
   *
   * @returns {Chart} A reference to this chart (chainable).
   */
  off(name, callback, context) {

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

    this._events.get(name).forEach((event, clone, map) => {
      if ((callback && callback === clone.callback) ||
          (context && context === clone.context)) {
        map.delete(event);
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
  trigger(name, ...args) {
    if (this._events.has(name)) {
      this._events.get(name).forEach((event) => {
        event.callback.call(event.context, ...args);
      });
    }
    return this;
  }

  /**
   * Cleanly dispose of chart
   *
   * @return undefined
   */
  destroy() {
    var node = this.base.node();

    // exposed properties
    this.configs = {};
    this.accessors = {};
    this.promise = null;

    // clear up remaining data
    this._layers.clear();
    this._attached.clear();
    this._events.clear();

    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }

  /**
   * Get and set chart options (or configs)
   *
   * @param  {mixed} nameOrObject Name of item getting or setting
   *                              or an object with key-value pairs.
   * @param  {mixed} value The value for config item with that name.
   * @return {mixed} if getting: the value. if setting: the chart instance.
   */
  config(nameOrObject, value) {
    var key;
    var definition;
    var _Chart = this;

    function setPercentage () {
      function calculatePercentage (arr, initialValue) {
        var min = Math.min.call(null, arr.map(function (name) { return _Chart.config(name); }));
        return initialValue / min;
      }

      if (definition.constrain === true) {
        definition.percentage = calculatePercentage(['width', 'height'], definition.value);
      } else if (Array.isArray(definition.constrain)) {
        definition.percentage = calculatePercentage(definition.constrain, definition.value);
      } else {
        definition.percentage = calculatePercentage([definition.constrain], definition.value);
      }
    }

    if (arguments.length === 0) {
      return this.configs;
    }

    if (arguments.length === 1) {
      if (typeof nameOrObject === 'object') {
        for (key in nameOrObject) {
          if(this.configs.hasOwnProperty(key)) {
            definition = this.configs[key];
            if (definition.hasOwnProperty('setter')) {
              definition.value = definition.setter.call(definition, nameOrObject[key]);
            } else {
              definition.value = nameOrObject[key];
            }
            if (definition.hasOwnProperty('constrain')) {
              setPercentage();
            }
            this.configs[key] = definition;
          } else {
            console.warn(`config with name ${nameOrObject} is not defined.`);
          }
        }
        return this;
      }

      kotoAssert(this.configs.hasOwnProperty(nameOrObject), `${nameOrObject} is not a valid option.`);
      definition = this.configs[nameOrObject];
      if (definition.hasOwnProperty('getter')) {
        return definition.getter.call(definition);
      }
      return definition.value;
    }

    if(arguments.length === 2) {
      if (this.configs.hasOwnProperty(nameOrObject)) {
        definition = this.configs[nameOrObject];
        if (definition.hasOwnProperty('setter')) {
          definition.value = definition.setter.call(definition, value);
        } else {
          definition.value = value;
        }
        if (definition.hasOwnProperty('constrain')) {
          setPercentage();
        }
        this.configs[nameOrObject] = definition;
      } else {
        console.warn(`config with name ${nameOrObject} is not defined.`);
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
  accessor (item, value) {
    var key;
    if (arguments.length === 0) {
      return this.accessors;
    }

    if (arguments.length === 1) {
      if (typeof item === 'string') {
        kotoAssert(this.accessors.hasOwnProperty(item), `${item} is not a valid accessor.`);
        return this.accessors[item];
      } else {
        for (key in item) {
          this.accessors[key] = item[key];
        }
      }
    } else {
      this.accessors[item] = value;
    }
    return this;
  }

  /**
   * This will extend a chart by passing in an object of initialize function.
   * @param  {Object || function} init Initialize function of object with initialize method.
   * @return {Construtor}      Chart constructor
   */
  static extend(init) {
    class chart extends this {
      constructor(selection) {
        var key;
        super(selection);

        if (typeof init === 'function') {
          init.call(this);
        } else {
          for (key in init) {
            this[key] = init[key];
          }
          this.initialize.call(this);
        }

      }
    }
    return chart;
  }

}

/**
* Expose the Layer class so that it can be subclassed.
*/
Chart.Layer = Layer;

// run tests if on test environment
if (ON_TEST) {
  require('./assert.spec.js')(kotoAssert);
  require('./layer.spec.js')(Layer, Chart);
  require('./chart.spec.js')(Chart);
}

module.exports = Chart;
