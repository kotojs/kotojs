# Koto

A framework for creating reusable charts with [D3.js](http://d3js.org), written in ES6.

[![Travis build status](http://img.shields.io/travis/kotojs/kotojs.svg?style=flat)](https://travis-ci.org/kotojs/kotojs)
[![Code Climate](https://codeclimate.com/github/kotojs/kotojs/badges/gpa.svg)](https://codeclimate.com/github/kotojs/kotojs)
[![Test Coverage](https://codeclimate.com/github/kotojs/kotojs/badges/coverage.svg)](https://codeclimate.com/github/kotojs/kotojs)
[![Dependency Status](https://david-dm.org/kotojs/kotojs.svg)](https://david-dm.org/kotojs/kotojs)
[![devDependency Status](https://david-dm.org/kotojs/kotojs/dev-status.svg)](https://david-dm.org/kotojs/kotojs#info=devDependencies)
[![Join the chat at https://gitter.im/kotojs/kotojs](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/kotojs/kotojs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Introduction
KotoJS is **HEAVILY** inspired by another reusable charting framework maintained by the Miso Project called d3.chart. I think that project is well designed and well documented.  For those who are not familiar with d3.chart, the framework provides a logical way to ensure that all data-visualization components that are authored using the framework are done in a way that facilitates re-usablily. 

However, as somebody who greatly depends on the d3.chart framework, I've gotten concerned that support for the project has dwindled over the past several months. This has prompted me to write my own reusable charting framework, taking all the things the things that I really like about d3.chart and adding a few things that I had always wanted.

```js
// Basic Example
KotoBarChart = class extends Koto {
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

var barChart = new KotoBarChart(d3.select('#vis'));
barChart.draw(data);
```

### How is it different than d3.chart?

#### ES6 (ECMAScript 2015)
For starters, this entire framework is written in ES6 (ECMAScript 2015). This allows us to use classes as the base structure for widgets and use the syntatic sugar for authoring classes that has added in the latest version of the language commonly called JavaScript. This framework also utilizes Maps and Sets (another feature recently added to JS). The library has been compiled back to ES5 (using babel) and it has listed an ES6 polyfill as a dependency so legacy browsers should be able to use it just fine.

#### Modules (UMD)
I'm a big believer in modules. With KotoJS, all your components are exported as a [UMD (Universal Module Definition)](https://github.com/umdjs/umd) module so that they can be integrated with several bundlers/asset managers. So, if you like using CommonJS, or AMD, or nothing at all, these widgets will work exactly like you'd expect them to. I've tested them with bundlers like RequireJS, Webpack, and Browserify so I'm confident that koto can be easily integrated into most projects. 

#### Common API for getting and setting configurable options.
In d3.chart, it is a common practice to have each configurable option (ex. Height, Widgth, fill) to have its own getter and setter method attached to the chart. This practice is suggested by Mike Bostock (creator of D3) and generally a good thing. For my own personal use case of this framework, I need the abily to store all the configs to a single object and so I found it much easier to have a common API for getting and setting config items like so:

```js
// Similar syntax to other d3 methods like `attr` and `style`
var barChart = new KotoBarChart(d3.select('#vis'));

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

```

#### Common API for getting and setting accessor functions.
In an effort to make components authored with this framework truely reusable, it was important to me that widgets could take in data with a variety of schemas. I can then tell my component how to "access" the data that it needs.

```js
// Similar syntax to other d3 methods like `attr` and `style`
var barChart = new KotoBarChart(d3.select('#vis'));

barChart
  .accessor('name', function(d) { return d.country; })
  .accessor('value', function(d) { return d.population; })
  .draw(data);

// -OR-
barChart
  .accessor({
    name: function(d) { return d.country; },
    value: function(d) { return d.population; }
  })
  .draw(data);

```

#### Extra Hooks
In d3.chart, the only "hooks" that were available for you on the chart level was `initialize` and `transform`. In KotoJS I have extended the list to include `initialize`, `transform`, `preDraw`, and `postDraw`. I have also exposed a `hasDrawn` property that allows for you check if something is being "re-drawn". All of the hooks are optional so you don't have to use them if you don't want to.

#### Removed the extension of d3
In d3.chart, the API for initalizing a chart was an extension of d3's selection prototype. I felt wrong to me to extend d3 so I have removed the need to do that and have opted to have charts authored with KotoJS to initialize like any other constructor function.

```js
// d3.chart
var barChart = d3.select('#vis').chart('BarChart');
barChart.draw(data);

// KotoJS
var barChart = new KotoBarChart(d3.select('#vis'));
barChart.draw(data);
```

## Getting Started
`koto.js` has been written in [ES6](https://babeljs.io/docs/learn-es6/) and then transpired to ES5 with [babel](https://babeljs.io/). It uses the UMD syntax so that it can be integrated with many module/bundle loaders.

### Install
You can install koto via [bower](http://bower.io) by running:

```bash
$ bower install koto --save
```

or via [npm](http://www.npmjs.com) by running:

```bash
$ npm install koto --save
```

## Documentation
Browse the [Wiki](https://github.com/nicksrandall/kotojs/wiki/API-Documentation).

## Build Instructions
Build requirements:

- [Node 0.10+](http://www.nodejs.org)


```js
$ npm install
$ npm run build
```

## Community
The goal is to have a large library of pre-built widgets using this framework open sourced and available for all to use. I'm still thinking through the details but be expecting something to be released soon. If you'd like to contribute a widget (or 2 or 42), I'd welcome the support.

## Examples
- Basic Bar Chart: [http://bl.ocks.org/nicksrandall/53c6d59ea70afaf19cf1](http://bl.ocks.org/nicksrandall/53c6d59ea70afaf19cf1)

## Acknowledgements
This project is **HEAVILY** inspired by the awesome work done by @jugglinmike and @iros and their charting framework called [d3.chart](https://github.com/misoproject/d3.chart).
