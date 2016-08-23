---
title: Browserify and the Module Pattern
date: 2016-08-22 22:38:19
tags:
 - browserify
 - JavaScript
categories: coding
---


I've recently started building out our projects with the well known [module pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) and a tool called [Browserify](http://browserify.org/). I made this architectural decision because I wanted a way to manage dependencies and at the same time limit our impact on the global scope. Browserify uses CommonJS modules as its pattern. This appealed to me because it is the same pattern that Node JS uses.

Browsers don't have the require method defined, but Node.js does. With Browserify you can write code that uses require in the same way that you would use it in Node.

JavaScript traditionally has no module system (this is changing with ES2015) for importing pieces of functionality and managing dependencies between parts of the application. Typically you would write your modules and include them in a global mega object with many different methods which themselves contain multiple properties and methods. An architecture like this isn't bad but It can lead to accidents if the global scope is overwritten or clobbered by a rogue developer or third-party scripts. Simply, there is risk with this model.

Before I go any further, let me talk about the module pattern and why it can help us write maintainable code in our JavaScript applications.

### What is the module pattern?

The traditional module pattern looks like this:


``` javascript
var exampleModule = (function(){
  var privateString = 'A string';
function concatenate(str) {
 // private function
  if(str) {
    return privateString + ' ' + str;
  }
 }
return {
  concat: concatenate;
 }
}());
// usage
exampleModule.concat('is just a string'); // outputs 'A string is just a string'
```

This pattern allows us to contain our module into logical pieces of functionality without falling into creating mega objects with many properties and methods which encourages the overuse of the this keyword. Private and public functions are clearly stated and easy to read.

Additionally, the module is wrapped in an Immediately Invoked Function Expression (IIFE) which prevents the global scope from being polluted. [Todd Motto has written a good article explaining the benefits of the pattern](https://toddmotto.com/mastering-the-module-pattern/).

### How does this work with Browserify?

Traditionally, we would have many different modules written in this fashion and we would then concatenate all of our JavaScript into one big file. This keeps our code modularized and also prevents global collisions. Honestly, we're still doing this, but Browserify makes dependency management more streamlined because we don't have to worry about including dependencies in the right order via &lt;script&gt; tags in our HTML or in the way our JavaScript is concatenated. Using the module pattern above, we would include a line at the bottom of the file that looks like this:

#### Modules

``` javascript
module.exports = exampleModule;
```

This line tells other files in our application to include it as a dependency. Previously you would have to make sure that the script from exampleModule.js was loaded or defined before using it in another module.

Then if we wanted to use our exampleModule in another file. We'd include it with this line:


``` javascript
// Filename exampleModule2.js
var exampleModule = require('./exampleModule');
exampleModule.concat('can be big strings.') // outputs A string can be big strings.

```

#### Application Folder Structure

The piece that brings everything together is what's called an endpoint in browserify. The endpoint is the script that browserify compiles and combines all the references into a large bundled file. 

Consider this folder structure:
```
    app/
    -- directives/
    ---- index.js
    -- controllers/
    ---- index.js
    -- views/
    ---- index.js
    -- app.js
```
Inside of our endpoint called app.js we would have the following:

 ``` javascript

global.jQuery = $ = require('jquery');
require('./directives');
require('./controllers');
require('./views');
```

##### What is all of that doing?

Previously, I had to use a relative path to specify the JavaScript file I wanted to include. You may have noticed that i don't reference the index.js file but only the folder. Browserify allows me to reference folders and by default it will search for the index.js file first and then look for a file with the same name. This allows you to chain references without cluttering up your endpoint file. 

##### How is this all built?

There are lots of options to then bundle your Browserify files. I prefer to use gulp, but you can also do it with the command line.

### Package Management

Adding new dependencies to a project is done via the package.json. The name of the package and the version are all controlled via the npm package manager and then bundled with Browserify. This works in the following way.

To include a new dependency you would type this while in your project's working directory 


``` bash
npm install jquery --save
```
npm will then download jquery into your node_modules folder. If you look at the previous code example you'll see this line



``` javascript
global.jQuery = $ = require('jquery');
```

This isn't a relative path because Browserify knows to look in the package.json for dependencies. So, if it doesn't find a an index.js or the name of the file you've specified it'll search the node_modules for the appropriate file. The global object tells Browserify that you'd like to include jQuery in ALL of your files which then releases you from writing var $ = require('jquery'); in all of your files.

### Conclusion

Feel free to tweet me [@iamdaninphilly](http://twitter.com/iamdaninphilly) about anything I may have gotten wrong, I'm always open for discussion!

#### What's the benefit in all of this?

- A simplified application folder structure.
- Built in dependency management.
- Less pollution in the global scope.
- No broken references
