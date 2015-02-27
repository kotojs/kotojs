---
layout:     page
description:   "A d3 chart framework for reusable charts"
---

#Kotojs
**koto.js** is a [d3.js](d3js.org) charting framework written in ES6, the latest iteration of javascript. This framework is based heavily on [d3.chart](), another d3 charting framework.

## Introduction
Coming soon. Here I'll talk about what prompted me to write this library and what my goals are.

{% highlight javascript linenos %}
koto.chart('BarChart', function (Chart) {
	class BarChart extends Chart {
		constructor(){
			// setup chart
		}
		preDraw(data) {
			// Do something before draw
		}
	}
});
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
