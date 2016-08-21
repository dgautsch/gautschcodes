---
title: Coding
date: 2016-08-19 15:41:04
tags:
    - development
    - coding
---

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, `quis nostrud exercitation` ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

``` javascript
    var $ = require('jquery');
    // module
    var home = (function () {
        var $document = $(document);
        function socialToggle() {
            return;
        }
        function bind() {
            $document.on('hover', 'something', socialToggle);
        }
    	return {
    		init: bind
    	};
    }());
    module.exports = home;
```


Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

``` javascript
    Object.keys(DG).forEach(function (key) {
        if (DG[key].hasOwnProperty('init')){
            DG[key].init();
        }
    });
```
## Heading

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

{% codeblock lang:javascript Array.map %}
array.map(callback[, thisArg])
{% endcodeblock %}

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Subheading

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
