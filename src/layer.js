import kotoAssert from './assert.js';
import { selection } from 'd3-selection';
const D3 = { selection: selection };
/**
 * Create a layer using the provided `base` selection.
 *
 * @class
 *
 * @param {d3.selection} base The containing DOM node for the layer.
 * @param {Object} options Overrides for databind, insert and event methods.
 * @param {Function} options.databind databind override
 * @param {Function} options.insert insert override
 * @param {Function} [options.events] life-cycle event handler overrides.
 *                                  Possible values are [enter, update, merge, exit]
 *                                  with or without the 'transition postfix'.
 */
class Layer {
  constructor(base, options) {
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
   * @param {Object} [context] the instance of this layers
   */
  dataBind() {
    kotoAssert(false, 'Layers must specify a dataBind method.');
  }

  /**
   * Invoked by {@link Layer#draw} in order to insert new DOM nodes into this
   * layer's `base`. This implementation is "virtual"--it *must* be overridden by
   * Layer instances.
   */
  insert() {
    kotoAssert(false, 'Layers must specify an `insert` method.');
  }

  /**
   * Subscribe a handler to a lifecycle event. These events (and only these
   * events) are triggered when {@link Layer#draw} is invoked--see that method
   * for more details on lifecycle events.
   *
   * @param {String} eventName Identifier for the lifecycle event for which to
   *        subscribe.
   * @param {Function} handler Callback function
   *
   * @returns {Chart} Reference to the layer instance (for chaining).
   */
  on(eventName, handler, options) {
    options = options || {};

    kotoAssert(this._lifecycleRe.test(eventName),
      `Unrecognized lifecycle event name specified to 'Layer#on': '${eventName}'.`);

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
   * @returns {Chart} Reference to the layer instance (for chaining).
   */
  off(eventName, handler) {
    var handlers = this._handlers[eventName];
    var idx;

    kotoAssert(this._lifecycleRe.test(eventName),
      `Unrecognized lifecycle event name specified to 'Layer#on': '${eventName}'.`);

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
   * Render the layer according to the input data. Bind the data to the layer
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
  draw(data) {
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
        transition
          .each(function() {
            ++n;
          })
          .each('interrupt.promise', function () {
            callback.apply(this, arguments);
          })
          .each('end.promise', function () {
            if (!--n) {
              callback.apply(this, arguments);
            }
          });
      }
    }

    function promiseCallback (resolve) {
      selection.call(endall, function() {
        resolve(true);
      });
    }

    bound = this.dataBind.call(this._base, data, this);

    kotoAssert(bound instanceof D3.selection,
      'Invalid selection defined by `Layer#dataBind` method.');
    kotoAssert(bound.enter, 'Layer selection not properly bound.');

    entering = bound.enter();
    entering._chart = this._base._chart;

    events = [
      {
        name: 'update',
        selection: bound
      },
      {
        name: 'enter',
        selection: entering,
        method: this.insert
      },
      {
        name: 'merge',
        // Although the `merge` lifecycle event shares its selection object
        // with the `update` lifecycle event, the object's contents will be
        // modified when koto invokes the user-supplied `insert` method
        // when triggering the `enter` event.
        selection: bound
      },
      {
        name: 'exit',
        // Although the `exit` lifecycle event shares its selection object
        // with the `update` and `merge` lifecycle events, the object's
        // contents will be modified when koto invokes
        // `d3.selection.exit`.
        selection: bound,
        method: bound.exit
      }
    ];

    for (var i = 0, l = events.length; i < l; ++i) {
      eventName = events[i].name;
      selection = events[i].selection;
      method = events[i].method;

      // Some lifecycle selections modify shared state, so they must be
      // deferred until just prior to handler invocation.
      if (typeof method === 'function') {
        selection = method.call(selection, selection);
      }

      if (selection.empty()) {
        continue;
      }

      kotoAssert(selection && selection instanceof D3.selection,
        `Invalid selection defined for ${eventName} lifecycle event.`);

      handlers = this._handlers[eventName];

      if (handlers) {
        for (idx = 0, len = handlers.length; idx < len; ++idx) {
          // Attach a reference to the parent chart so the selection's
          // `chart` method will function correctly.
          selection._chart = handlers[idx].chart || this._base._chart;
          // selection.call(handlers[idx].callback);
          handlers[idx].callback.call(selection, selection);
        }
      }

      handlers = this._handlers[eventName + ':transition'];

      if (handlers && handlers.length) {
        selection = selection.transition();
        for (tlen = handlers.length, tidx = 0; tidx < tlen; ++tidx) {
          selection._chart = handlers[tidx].chart || this._base._chart;
          // selection.call(handlers[tidx].callback);
          handlers[tidx].callback.call(selection, selection);
          promises.push(new Promise(promiseCallback));
        }
      }
      this.promise = Promise.all(promises);
    }
  }
}

export default Layer;
