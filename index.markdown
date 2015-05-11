---
layout:     page
description:   "A d3 framework for reusable charts"
---

#Kotojs
**koto.js** is a [d3.js](http://www.d3js.org) charting framework written in ES6, the latest iteration of javascript.

## Introduction
KotoJS is **HEAVILY** inspired by another reusable charting framework maintained by the Miso Project called d3.chart. I think that project is well designed and well documented.  For those who are not familiar with d3.chart, the framework provides a logical way to ensure that all data-visualization components that are authored using the framework are done in a way that facilitates re-usablily. 

However, as somebody who greatly depends on the d3.chart framework, I've gotten concerned that support for the project has dwindled over the past several months. This has prompted me to write my own reusable charting framework, taking all the things the things that I really like about d3.chart and adding a few things that I had always wanted.

{% highlight javascript %}
// Basic Example
koto.BarChart = class extends koto.Base {
	constructor(selection){
		// setup chart
    var bars = this.base.append('g').classed('bars', true);
    
    // define layer
    var layer = this.layer('bars', bars, {
      dataBind: function (data) {
        return this.selectAll('rect').data(data);
      },
      insert: function () {
        this.append('rect');
      }
    });
  
    // Setup life-cycle events on layers
    bars.on('enter', function () {
      // this => enter selection
    })
    .on('merge', function () {
      // this => base selection
    })
    .on('exit', function () {
      // this => exit selection
    });
	}
	preDraw(data) {
		// [Optional] Do something before draw
	}
}

var barChart = new koto.BarChart(d3.select('#vis'));
barChart.draw(data);
{% endhighlight %}

### How is it different than d3.chart?
#### ES6 (ECMAScript 2015)
For starters, this entire framework is written in ES6 (ECMAScript 2015). This allows us to use classes as the base structure for widgets and use the syntatic sugur for authoring classes that has added in the latest version of the language commonly called JavaScript. This framework also utilizes Maps and Sets (another feature recently added to JS). The library has been compiled back to ES5 (using babel) and it has listed an ES6 polyfill as a dependency so legacy browsers should be able to use it just fine.

#### Common API for getting and setting configurable options.
In d3.chart, it is a common practice to have each configurable option (ex. Height, Widgth, fill) to have its own getter and setter method attached to the chart. This practice is suggested by Mike Bostock (creator of D3) and generally a good thing. For my own personal use case of this framework, I need the abily to store all the configs to a single object and so I found it much easier to have a common API for getting and setting config items like so:

{% highlight javascript %}
// Similar syntax to other d3 methods like `attr` and `style`
var barChart = new koto.BarChart(d3.select('#vis'));

barChart
  .config('height', 500)
  .config('width', 500)
  .draw(data);

// -OR-
barChart
  .config({
    width: 500,
    height: 500
  })
  .draw(data);

{% endhighlight %}

#### Common API for getting and setting accessor functions.
In an effort to make components authored with this framework truely reusable, it was important to me that widgets could take in data with a variety of schemas. I can then tell my component how to "access" the data that it needs.

{% highlight javascript %}
// Similar syntax to other d3 methods like `attr` and `style`
var barChart = new koto.BarChart(d3.select('#vis'));

barChart
  .accessor('name', function(d) { return d.country; })
  .accessor('value', function(d) { return d.population; })
  .draw(data);

// -OR-
barChart
  .accessor({
    name: function(d) { return d.country; },
    value: function(d) { return d.population; }
  .draw(data);
{% endhighlight %}

#### Extra Hooks
In d3.chart, the only "hooks" that were available for you on the chart level was `initialize` and `transform`. In KotoJS I have extended the list to include `initialize`, `transform`, `preDraw`, and `postDraw`. I have also exposed a `hasDrawn` property that allows for you check if something is being "re-drawn". All of the hooks are optional so you don't have to use them if you don't want to.

#### Removed the extension of d3
In d3.chart, the API for initalizing a chart was an extension of d3's selection prototype. I felt wrong to me to extend d3 so I have removed the need to do that and have opted to have charts authored with KotoJS to initialize like any other constructor function.

{% highlight javascript %}
// d3.chart
var barChart = d3.select('#vis').chart('BarChart');
barChart.draw(data);

// KotoJS
var barChart = new koto.BarChart(d3.select('#vis'));
barChart.draw(data);
{% endhighlight %}

## Getting Started
`koto.js` has been written in [ES6](https://babeljs.io/docs/learn-es6/) and then transpired to ES5 with [babel](https://babeljs.io/). It uses the UMD syntax so that it can be integrated with many module/bundle loaders.

### Install
You can install koto via [bower](http://bower.io) by running:

{% highlight bash %}
$ bower install koto --save
{% endhighlight %}

or via [npm](http://www.npmjs.com) by running:

{% highlight bash %}
$ npm install koto --save
{% endhighlight %}

## Documentation
Browse the [Wiki](https://github.com/nicksrandall/kotojs/wiki/API-Documentation).

### Example Charts
* [Icicle Chart (github)](https://github.com/nicksrandall/koto.Icicle)
* More coming soon

## Build Instructions
Build requirements:

- [iojs](https://iojs.org/en/index.html)
- [gulp](http://gulpjs.com/)


{% highlight bash %}
$ npm install
$ gulp build
{% endhighlight %}

## Acknowledgements
This project is **HEAVILY** inspired by the awesome work done by @jugglinmike and @iros and their charting framework called [d3.chart](https://github.com/misoproject/d3.chart).
