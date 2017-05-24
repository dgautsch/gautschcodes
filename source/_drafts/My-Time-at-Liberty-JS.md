---
title: My Time at Liberty JS
tags:
  - JavaScript
  - Standards
  - Polymer
categories:
 - Coding
---

## Polymer

Comcast is using Polymer to build out a number of their web assets including Xfinity, X1 Platform, and My Account.

### Why Use Polymer?
Chris Lorenzo senior principle engineer at Comcast. Develops on the Polymer Library to build out Comcast web products.

* Backed by Google
* Future Oriented
	* Web Components - W3C
		* Custom Elements
		* Templates
		* HTML Imports - Way to reuse HTML documents in other HTML Documents.
		* Shadow DOM - Create new DOM trees within the browser, which encapsulates your components from the rest of the DOM.
	* Documentation
	* New Stuff so happy developers
* It's NOT a framework, it's a library.
* IE10+ Browsers Only

*Key Methods*

`doucment.registerElement`

``` html
<dom-module>
	<template></template> // template markup
	<script></script> // component logic
</dom-module>
```
### Other Polymer Benefits

* Registration and Lifecycle
* Declared Properties
* Local DOM Events
* Data binding
* Behaviors
* Utility Functions
* Docs + Videos
* Custom attributes
* Custom listeners i.e. touch events
* Data binding

> Beta software is subject to change! - Chris Lorenzo

### Tools

Tools used in the development environment.

* ./ polyup coming with Polymer 2.0
* polymer-CLI


The project isn't using SASS. Polymer introduces:

* CSS variables, this is already supported in Firefox and Chrome.
* @apply specify multiple properties and apply them to other rules, implemented in chrome and firefox

> #UseThePlatform - Polymer's slogan

* Fetch is a modern concept equivalent to XMLHttpRequest
	* Works in all browsers except for IE11 and Safari but there are polyfills

> Promises are the new callbacks - Chris Lorenzo

Promises are available in all browsers except IE11

### Benefits of Polymer

* Separating the HTML from the JavaScript
* Sharing components across applications that have no relation
* Variation in component presentation via a modifying attribute
* Polymer comes out of the box with components you can use. This are represented by elements in the periodic table
* No preprocessing or conversion of code for the browser

### Testing with Polymer

* Web Component Tester (WCT)
* Mocha
* Chai
* Sinon

> Polymer is designed with a set of principles in mind: encapsulation, composition and separation of concerns.

### Challenges Faced

> Encapsulation, Composition, and Separation of Concerns.

"As a JavaScript developer you're not used to writing in this paradigm."

Data biding is really tricky, especially with arrays.

> "RTFM and then RTFM"

Sharing components, recommend using bower to install the repo or git submodule.

### Questions

If Chrome supports web components I assume it ignores the poly-fill. Does polymer run faster on Chrome than other browsers because of this?

Why Bower and not NPM?

*Bower had a flat dependency tree back in the day. NPM 3 solves this for the browser. You can use NPM now.*
