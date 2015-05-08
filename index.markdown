---
layout:     page
description:   "A d3 framework for reusable charts"
---

#Kotojs
**koto.js** is a [d3.js](http://www.d3js.org) charting framework written in ES6, the latest iteration of javascript.

## Introduction
Coming soon. Here I'll talk about what prompted me to write this library and what my goals are.

{% highlight javascript %}
koto.BarChart = class extends koto.Base {
	constructor(){
		// setup chart
	}
	preDraw(data) {
		// Do something before draw
	}
}
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

- [iojs](https://iojs.org/en/index.html) or [node 0.10+](http://www.nodejs.org)
- [gulp](http://gulpjs.com/)


{% highlight bash %}
$ npm install
$ gulp build
{% endhighlight %}

## Acknowledgements
This project is **HEAVILY** inspired by the awesome work done by @jugglinmike and @iros and their charting framework called [d3.chart](https://github.com/misoproject/d3.chart).
