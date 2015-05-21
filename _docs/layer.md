---
title: Layer
description: The layer class.
---

## Koto.layer(name, selection, options)
The Layer class is used internally by the `Koto.layer` method to create and attach layers to charts. The `selection` and `options` parameters are passed into the layer constructor to create a new layer.

## Parameters
* **name** - {string} the name of your new layer.
* **selection** - {d3Selection} the container for this new layer
* **options** - {object} object must include a `dataBind` method AND an `insert` method. Optionally, you can include an 'events' object with keys that are the layer's 'life-cycle' events

**Returns** Layer instance
{% highlight javascript %}
// basic example
class KotoChartName extends Koto {
  constructor(container){
    super(container);
    
    var layerContainer = this.base.append('g');
    var layer = this.layer('bars', layerContainer, {
      dataBind: function (data) {
        return this.selectAll('.bars').data(data);
      },
      insert: function () {
        this.append('rect').classed('bars', true)
      }
    });
    
    // var layer is an instance of the 'Layer' class.
    // because I did not pass the life-cycle events in as optoins,
    // I'll have to use the layer's `on` method to define what do
    // on those events. See `Layer.on`
    layer.on('enter', function () { /* code */ })
    .on('merge:transition', function () { /* code */ })
    .on('exit', function () { /* code */ });
  }
}

// example with 'life-cycle' events passed in as options
class KotoChartName extends Koto {
  constructor(container){
    super(container);
    
    var layerContainer = this.base.append('g');
    var layer = this.layer('bars', layerContainer, {
      dataBind: function (data) {
        return this.selectAll('.bars').data(data);
      },
      insert: function () {
        this.append('rect').classed('bars', true)
      },
      events: {
        'enter': function () { /* code */ },
        'merge:transition': function () { /* code */ },
        'exit': function () { /* code */ }
      }
    });
    
    // var layer is an instance of the 'Layer' class.
  }
}


{% endhighlight %}


> **Note:** You will never instantiate a new 'Layer' instance directly, you'll use the `Koto.layer` method to create a new layer instance.

## Layer.dataBind(array data)
This method is invoked by the `Layer.draw` method which is invoked by the `Koto.draw` method. The purpose of this function is to join data to the layer's DOM nodes. This method must be overwritten for each layer instance.

**The `this` context of the function is the layers base selection.**

{% highlight javascript %}
// basic example
class KotoChartName extends Koto {
  constructor(container){
    super(container);
    
    var layerContainer = this.base.append('g');
    var layer = this.layer('bars', layerContainer, {
      dataBind: function (data) {
        // this is the base selection (layerContainer)
        return this.selectAll('.bars').data(data);
      },
      insert: function () {
        // this is the 'enter' selection of item returned by dataBind
        this.append('rect').classed('bars', true)
      }
    });
  }
}
{% endhighlight %}


## Layer.insert()
This method is invoked by the `Layer.draw` method which is invoked by the `Koto.draw` method. The purpose of this function is to insert missing DOM nodes based on the data. This method must be overwritten for each layer instance.

**The `this` context of this function is the 'enter' selection of the 'data bound' selection returned by `dataBind` method.**

{% highlight javascript %}
// basic example
class KotoChartName extends Koto {
  constructor(container){
    super(container);
    
    var layerContainer = this.base.append('g');
    var layer = this.layer('bars', layerContainer, {
      dataBind: function (data) {
        // this is the base selection (layerContainer)
        return this.selectAll('.bars').data(data);
      },
      insert: function () {
        // this is the 'enter' selection of item returned by dataBind
        this.append('rect').classed('bars', true)
      }
    });
  }
}
{% endhighlight %}


## Layer.on(string event, function handler[, Chart chart])
Subscribe a handler to a "lifecycle event". These events (and only these events) are triggered when `Layer#draw` is invoked. More information on 'life-cycle events' will follow.

{% highlight javascript %}
// basic example
class KotoChartName extends Koto {
  constructor(container){
    super(container);
    
    var layerContainer = this.base.append('g');
    var layer = this.layer('bars', layerContainer, {
      dataBind: function (data) {
        return this.selectAll('.bars').data(data);
      },
      insert: function () {
        this.append('rect').classed('bars', true)
      }
    });

    // Because I did not pass the life-cycle events in as optoins,
    // I'll have to use the layer's `on` method to define what do
    // on those events. See `Layer.on`
    layer.on('update', function () { /* code */ })
    .on('enter', function () { /* code */ })
    .on('merge:transition', function () { /* code */ })
    .on('exit', function () { /* code */ });
  }
}
{% endhighlight %}

Valid 'life-cycle' events are:

* update -> merge selection before enter
* enter -> enter selection
* merge -> merge selection after enter
* exit -> exit selection.

Also, subscribe handlers to a 'life-cycle' event's *transition* selection by attaching ':transition' to the event name. In other words, the following are also valid event names:

* 'update:transition'
* 'enter:transition'
* 'merge:transition'
* 'exit:transition' 

For more information on 'life-cycle' events see this blog (post.)[http://bost.ocks.org/mike/join/]

## Layer.off([string name])
Unsubscribe the specified handler from the specified event. If no handler is supplied, remove *all* handlers from the event.

{% highlight javascript %}
layer.on('enter', function () {
  this.style({
    fill: 'blue',
    stroke: 'none'
  });
});

// 'enter' event handler will execute
layer.draw(data);

layer.off('enter');

// 'enter' event handle WON'T execute
layer.draw(data);
{% endhighlight %}


## Layer.draw(array data)
Render the layer according to the input data:

## Process
* Bind the data to the layer (according to `Layer#dataBind`), 
* insert new elements (according to `Layer#insert`), 
* make lifecycle selections, 
* invoke all relevant handlers (as attached via `Layer#on`) with the lifecycle selections.

## Life-cycle events order
1. update
2. update:transition
3. enter
4. enter:transition
5. merge
6. merge:transition
7. exit
8. exit:transition

> **Note:** You will probably never call this method directly but rely on the `Koto.draw` to call it.