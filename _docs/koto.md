---
title: Koto
description: The base chart class.
---

### Koto
This is the base class for charts built with KotoJS.

{% highlight javascript %}
class KotoChartName extends Koto {
  // your extend the koto class
}
{% endhighlight %}

> **Best Practices:** It is our recommendation that you name space your charts by prefixing it with `Koto` so if you were making a bar chart, you might name it `KotoBarChart`.

### Koto.constructor(d3Selection container)
Here is where you will write most of the code to `initialize` your chart by setting up static things like default configs, scales, and layers. 

{% highlight javascript %}
class KotoChartName extends Koto {
  constructor(container){
    super(container);
    
    // initialize configs, scales, layers, ect...
    
  }
}
{% endhighlight %}

> **Note:** If you don't have the luxury of authoring your chart in ES6 (ECMAScript 2015) class syntax, then you can accomplish the same thing by extending the base Koto class with it's `extend` method and then passing​ in an `initialize` function. More info on that in the `Koto.extend` docs.


### Koto.transform(array | object data)
A "hook" method that you may define to modify input data before it is used to draw the chart's layers and attachments. It is passed in the data that was passed into the `Koto.draw` method and must return an array of data that will be passed to each of your chart's layers.

**RETURNS:** {array} the data that will be passed to chart's layer's draw methods.

{% highlight javascript %}
transform(data) {
    // do something with the data
    return data.reverse();
  }
}
{% endhighlight %}

> **Note:** You will most likely never call this method directly, but rather include it as part of a chart definition, and then rely on KotoJS to invoke it when you draw the chart with `Koto.draw`.

### Koto.demux(string name, array data)
A "hook" method that you may define to choose which mutation of the input data is sent to which of the attached charts (by name). This only applies to charts that use the {@link Koto#attach} method.

**RETURNS:** {array} the data that will be passed to attached chart (with given name) layer's draw methods.

{% highlight javascript %}
demux(name, data) {
  if (name === 'BarChart') {
    return data.forBarChart;
   } else {
      return data.forLineChart;
   }
}
{% endhighlight %}

> **Note:** You will most likely never call this method directly, but rather include it as part of a chart definition, and then rely on KotoJS to invoke it when you draw the chart with `Koto.draw`.

### Koto.preDraw(array data)
A "hook" method that you may define that will be called after `Koto.transform` and before each of your layers` `draw` method will be called. This is a convenient place to setup chart attributes that are dependent on data (like scales).

{% highlight javascript %}
preDraw(data) {
  this.xScale.domain(
    d3.extent(data, (row) => row.time)
  );
}
{% endhighlight %}

> Also an Event: A 'preDraw' event is called on your chart just AFTER this function is called in the case that you have something that needs to respond to that event that is outside of the chart itself.

> **Note:** You will most likely never call this method directly, but rather include it as part of a chart definition, and then rely on KotoJS to invoke it when you draw the chart with `Koto.draw`.

### Koto.postDraw(array data)
A "hook" method that you may define that is called after all of your layers' `draw` method is called. This method does NOT wait for transitions on your layers to finish. If you need that functionality, then you should use the `Koto.postTransition` hook.

{% highlight javascript %}
postDraw(data) {
  // do something once chart has rendered
}
{% endhighlight %}

> Also an Event: A 'postDraw' event is called on your chart just AFTER this function is called in the case that you have something that needs to respond to that event that is outside of the chart itself.

> **Note:** You will most likely never call this method directly, but rather include it as part of a chart definition, and then rely on KotoJS to invoke it when you draw the chart with `Koto.draw`.

### Koto.postTransition(array data)
A "hook" method that you may define that is called after all of your layers' `draw` method is called AND all of your layers' transitions have finished.

{% highlight javascript %}
postTransition(data){
  // do something when all transitions have finished
}
{% endhighlight %}

> **Pro Tip:** A 'postDraw' event is called on your chart just AFTER this function is called in the case that you have something that needs to respond to that event that is outside of the chart itself.

> **Note:** You will most likely never call this method directly, but rather include it as part of a chart definition, and then rely on KotoJS to invoke it when you draw the chart with `Koto.draw`.

### Koto.Layer(name[, selection[, options]])
Interact with the chart's Layers

The `Layer.draw` method of attached layers will be invoked whenever this chart's `Kotot#draw` is invoked and will receive the data (optionally modified by the chart's ` Koto#transform` method.

#### Params
* name - {string} the name of the layer
* selection - {d3Selection}
* options - {object} an object with at least a `dataBind` and `insert` method

#### Returns:
If only a `name` is provided, simply return the layer registered to that name (if any).

If a `name` and `selection` are provided, treat the `selection` as a previously-created layer and attach it to the chart with the specified `name`.

If all three arguments are specified, initialize a new Layer using the specified `selection` as a base passing along the specified `options`.

{% highlight javascript %}
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
    
  }
}
{% endhighlight %}


### Koto.unlayer(string name)
Removes a layer from the chart. This is usefull if you are extending a chart that has a layer that you don't need.

**RETURNS:** {Layer} the layer that was removed from the chart

{% highlight javascript %}
var layer = KotoChartName.unlayer('layerName');

// to reattach layer
KotoChartName.layer('newName', layer);
{% endhighlight %}

or this can be done from inside a chart's constructor function

{% highlight javascript %}
class KotoExtendedChart extends KotoChartName {
  constructor(container){
    super(container);
    
    // remove the 'bars' layer
    this.unlayer('bars');
    
  }
}
{% endhighlight %}


### Koto.attach(string name[, chart-instance chart])
Register or retrieve an "attachment" Chart. The "attachment" chart's `draw` method will be invoked whenever the containing chart's `draw` method is invoked.

#### Returns
If only name is provided, then it will return the attached chart with given name

If name and chart is provided then it will attach the given chart with given name and return the 'parent chart' instance (for chaining).

{% highlight javascript %}
class KotoPieBars extends Koto {
  constructor(container){
    super(container);
    
    // initialize composite charts
    var barChart = new KotoBarChart(this.base.append('g'));
    var pieChart = new KotPieChart(this.base.append('g'));
    
    // attach composite charts
    this.attach('bars', barChart);
    this.attach('pie', pieChart);
  }
}
{% endhighlight %}


### Koto.draw(array | object data)
Update the chart's representation in the DOM, drawing all of its layers and any "attachment" charts (as attached via `Koto#attach`).

{% highlight javascript %}
var chart = new KotoChartName(d3.select('svg'));

chart.config({
  height: 500,
  width: 500,
  fill: 'blue'
});

chart.draw([1,2,3,4,5,26,47,88]);
{% endhighlight %}

> **Note:** The first time you call this method, the property `hasDrawn` on your chart will be set to true. This is helpful if you want to only run some code on the first time the chart is drawn.

### Koto.on(string name, function callback, [object context])
Subscribe a callback function to an event triggered on the chart. See `Kotot#once` to subscribe a callback function to an event for one occurrence. 

There are a few preset events that Koto will fire as part of each chart's lifecycle. You can also manually trigger custom events using the `Koto.trigger` method.

{% highlight javascript %}
var chart = new KotoChartName(d3.select('svg'));

chart.on('postTransition', function (data) {
  // do something external to chart once the chart has been drawn
  // and all of it's transitions are finished
  positionLegend();
});

chart.draw([1,2,3,4,5,26,47,88]);
{% endhighlight %}


### Koto.once(string name, function callback, [object context])
Subscribe a callback function to an event triggered on the chart. This function will be invoked at the next occurrence of the event and immediately unsubscribed. See `Koto#on` to subscribe a callback function to an event indefinitely.

There are a few preset events that Koto will fire as part of each chart's lifecycle. You can also manually trigger custom events using the `Koto.trigger` method.

{% highlight javascript %}
var chart = new KotoChartName(d3.select('svg'));

chart.once('postTransition', function (data) {
  // do something external to chart once the chart has been drawn
  // and all of it's transitions are finished
  showTitle();
});

chart.draw([1,2,3,4,5,26,47,88]);
{% endhighlight %}


### Koto.off([string name, [function callback, [object context]]])
Unsubscribe one or more callback functions from an event triggered on the chart. 

#### Usage
* When no arguments are specified, *all* handlers will be unsubscribed. 
* When only a `name` is specified, all handlers subscribed to that event will be unsubscribed. 
* When a `name` and `callback` are specified, only that function will be unsubscribed from that event. 
* When a `name` and `context` are specified (but `callback` is omitted), all events bound to the given event with the given context will be unsubscribed.

{% highlight javascript %}
var chart = new KotoChartName(d3.select('svg'));

function action () {
  chart.trigger('acted', 'an action occured!');
}

chart.on('acted', function (message) {
  console.log('action: ', message);
});

// will trigger event
action();

chart.off();

// won't trigger event
action();
{% endhighlight %}


### Koto.trigger(string name, ...args)
Publish an event on the chart with the given `name`.

{% highlight javascript %}
var chart = new KotoChartName(d3.select('svg'));

function action () {
  chart.trigger('acted', 'an action occured!');
}

chart.on('acted', function (message) {
  console.log('action: ', message);
});

// will trigger event
action();
{% endhighlight %}


### Koto.config(name, value)
Getter / Setter for chart's config options. This function operates similar to how d3's `attr` or `style` functions operate.

#### Basic Usage
{% highlight javascript %}
var chart = new KotoChartName(d3.select('svg'));

// set config item by name
chart.config('height', 500); 

// get config item
chart.config('height') // => 500;

// bulk set chart configs with object
chart.config({
  height: 500,
  width: 500
});
{% endhighlight %}

#### Also works with config definition objects for use with Domo App Builder
{% highlight javascript %}
var chart = new KotoChartName(d3.select('svg'));

// set config by name with definition object
chart.config('height', {
  displayName: 'Height',
  description: 'The height of the chart',
  type: 'number',
  value: 500,
  units: 'px'
});

// get config item
chart.config('height') // => 500;
{% endhighlight %}

> **Pro Tip:** This method as been aliased as `Koto.c` for convenience​.

### Koto.accessor(name, value)
Getter / Setter for chart's data accessors. This function operates similar to how d3's `attr` or `style` functions operate.

#### Usage
{% highlight javascript %}
var chart = new KotoChartName(d3.select('svg'));

// set accessor by name
chart.accessor('name', function (row) { return row.name; });

// get accessor function by name (and use it)
var data = {name: 'koto', value; 100};
var name = chart.accessor('name')(data) // => 100;
{% endhighlight %}

> **Pro Tip:** This method as been aliased as `Koto.a` for convenience.

### STATIC: Koto.extend(function | object init)
This will extend a chart by passing in an initialization function or object with methods that you would like to overwrite from the base chart. Because the constructor method is a reserved method, we have renamed that option to `initialize`.

**RETURNS:** {Chart} new, extended constructor function

#### Usage
{% highlight javascript %}
var ExtendedChart = KotoChartName.extend(function () {
  // this contex is the extended chart.
  
  // initialize chart as you would in a construtor function
});

var chart = new ExtendedChart(d3.select('svg'));
{% endhighlight %}

#### -or- pass in an object with methods to overwrite.
{% highlight javascript %}
var ExtendedChart = KotoChartName.extend({
  initialize: function () { /* code */ },
  transform: function () { /* code */ },
  preDraw: function () { /* code */ }
});

var chart = new ExtendedChart(d3.select('svg'));
{% endhighlight %}

> **Pro Tip:** This is useful if you don't have the luxury using ES6 (ECMAScript 2015) class syntax for composing charts.