---
layout: post
title:  "JavaScript Design Patterns: Introduction"
date:   2014-07-19 04:07:49
categories: Programming Patterns
banner_image: "/media/desert.jpg"
featured: true
comments: true
---

One of the most important aspects of writing maintainable code is being able to notice the recurring themes in that code and optimize them. This is an area where knowledge of design patterns can prove invaluable.

<!--more-->

In the first part of this book, we will explore the history and importance of design patterns which can really be applied to any programming language. If you're already sold on or are familiar with this history, feel free to skip to the chapter "What is a Pattern?" to continue reading.

Design patterns can be traced back to the early work of an architect named Christopher Alexander. He would often write publications about his experience in solving design issues and how they related to buildings and towns. One day, it occurred to Alexander that when used time and time again, certain design constructs lead to a desired optimal effect.

In collaboration with Sara Ishikawa and Murray Silverstein, Alexander produced a pattern language that would help empower anyone wishing to design and build at any scale. This was published back in 1977 in a paper titled "A Pattern Language", which was later released as a complete hardcover book.

Some 30 years ago, software engineers began to incorporate the principles Alexander had written about into the first documentation about design patterns, which was to be a guide for novice developers looking to improve their coding skills. It's important to note that the concepts behind design patterns have actually been around in the programming industry since its inception, albeit in a less formalized form.

One of the first and arguably most iconic formal works published on design patterns in software engineering was a book in 1995 called Design Patterns: Elements Of Reusable Object-Oriented Software. This was written by Erich Gamma, Richard Helm, Ralph Johnson and John Vlissides - a group that became known as the Gang of Four (or GoF for short).

The GoF's publication is considered quite instrumental to pushing the concept of design patterns further in our field as it describes a number of development techniques and pitfalls as well as providing twenty-three core Object-Oriented design patterns frequently used around the world today. We will be covering these patterns in more detail in the section "Categories of Design Patterns".

In this book, we will take a look at a number of popular JavaScript design patterns and explore why certain patterns may be more suitable for your projects than others. Remember that patterns can be applied not just to vanilla JavaScript (i.e standard JavaScript code), but also to abstracted libraries such as jQuery or dojo as well. Before we begin, let’s look at the exact definition of a "pattern" in software design.

## What is a Pattern?

A pattern is a reusable solution that can be applied to commonly occurring problems in software design - in our case - in writing JavaScript web applications. Another way of looking at patterns are as templates for how we solve problems - ones which can be used in quite a few different situations.

* **Patterns are proven solutions:** They provide solid approaches to solving issues in software development using proven techniques that reflect the experience and insights the developers that helped define them bring to the pattern.
* **Patterns can be easily reused:** A pattern usually reflects an out of the box solution that can be adapted to suit our own needs. This feature makes them quite robust.
* **Patterns can be expressive:** When we look at a pattern there’s generally a set structure and vocabulary to the solution presented that can help express rather large solutions quite elegantly.

## Design Pattern Categorization

In my early experiences of learning about design patterns, I personally found the following table a very useful reminder of what a number of patterns has to offer - it covers the 23 Design Patterns mentioned by the GoF. The original table was summarized by Elyse Nielsen back in 2004 and I've modified it where necessary to suit our discussion in this section of the book.

I recommend using this table as reference, but do remember that there are a number of additional patterns that are not mentioned here but will be discussed later in the book.

### A brief note on classes

Keep in mind that there will be patterns in this table that reference the concept of "classes". JavaScript is a class-less language, however classes can be simulated using functions.

The most common approach to achieving this is by defining a JavaScript function where we then create an object using the new keyword. this can be used to help define new properties and methods for the object as follows:

<div class="container">

{% highlight javascript linenos %}
function Car( model ) {
	this.model = model;
    this.color = "silver";
    this.year  = "2012";
    this.getInfo = function () {
    	return this.model + " " + this.year;
    };
}
{% endhighlight %}

<div class="reference">
<strong>Code Annotation</strong>
<p>This is an example of a code annotation in Astro.</p>
</div>
</div>
    
***

This extract of text has been used as a demonstration of the Astro Ghost Theme.

Copyright © [Addy Osmani](http://addyosmani.com/) 2013.

Learning JavaScript Design Patterns is released under a [Creative Commons Attribution-Noncommercial-No Derivative Works 3.0](http://creativecommons.org/licenses/by-nc-nd/3.0/) unported license. It is available for purchase via [O'Reilly Media](http://www.oreilly.com/) but will remain available for both free online and as a physical (or eBook) purchase for readers wishing to support the project.