---
title: NPM Build Tools and WordPress
date: 2016-09-22 15:51:48
tags:
    - JavaScript
    - Node
    - BrowserSync
    - WordPress
    - NPM
    - VVV
categories: coding
---
I recently put together a front-end toolset for one of our WordPress projects at Think Brownstone. As it is with most things you start out from scratch, there was a lot of initial Googling of already known solutions before I crafted my own. Through this googling, I found a lot of fragmented pieces of what I wanted, but nothing concrete, so I decided to document everything I found here. But first, let me go over the requirements I had in mind while I was putting this together.

## The Requirements

1. Should not use Gulp or Grunt.
2. Will make use of NPM scripts.
3. Will keep dependencies as minimal as possible.
4. Will use BrowserSync to inject/reload assets without a proxy.
5. WebPack to bundle my JavaScript.
6. LESS to compile my CSS.

I first set out to configure my BrowserSync portion of the site. Normally when I'm working on a static HarpJS site or Angular project, I'll have BrowserSync's built-in server proxy the application or host the code locally. This is a very easy solution, but because this is a WordPress project, I didn't want to proxy my site.

## WordPress Development Environment

The WordPress setup is leveraging [Varying Vagrant Vagrants](https://github.com/Varying-Vagrant-Vagrants/VVV) or VVV. If you're familiar with [Vagrant](https://www.vagrantup.com/) it's a Vagrant Profile that comes prepackaged with lots of WordPress specific goodies for development. In addition to VVV we're using [WordPress Packagist](https://wpackagist.org/) in conjunction with composer to manage our plugin dependencies. To start out our theme we have a basic [Underscores](http://underscores.me/) theme that's been heavily stripped.

## Setting Up NPM

Below I've listed all of the dependencies we pulled in for this project. Besides the obvious choices, I'll go over why I'm using packages such as nodemon and concurrently.

{% codeblock package.json lang:JSON %}
"devDependencies": {
  "browser-sync": "^2.16.0",
  "concurrently": "^2.2.0",
  "eslint": "^3.2.2",
  "eslint-config-thinkbrownstone": "^1.1.1",
  "eslint-loader": "^1.5.0",
  "less": "^2.7.1",
  "nodemon": "^1.10.2",
  "webpack": "^1.13.1"
}
{% endcodeblock %}

### Concurrently

When I am writing NPM scripts, there are times where I want to run two or more scripts at the same time with the use of one command. This is in the same vein as Gulp or Grunt.

With bash you can run two commands synchronously with the && operator. For example `git fetch && git pull` is a common combo you see. What this is doing is if git fetch completes successfully then run git pull. Additionally, If you need two tasks to run at the same time you can use a |. If you apply this to NPM Scripts, you can run two scripts with one command like this:

``` json
"scripts": {
  "dev": "npm run build && npm run watch",
  "build": "npm run build:css | npm run build:js"
}
```

With that setup, I can then execute `npm run dev` and my watch script will only execute after the build script has completed successfully. Unfortunately using the | is a platform specific command that only works on a UNIX-like environment.

While we are a Mac OSX shop at Think Brownstone, at home I am a Windows user and I don't feel it's a good practice to add platform specific commands to your NPM scripts. This would be especially true in open source development where the the contributor's computer could be anything.

Enter [concurrently](https://www.npmjs.com/package/concurrently), a handy node package that allows concurrent tasks to be run in NPM scripts and remain platform agnostic. With the use of concurrently our scripts now look like this:

``` json
"scripts": {
  "dev": "concurrently --raw 'npm run build' 'npm run watch'",
  "build": "concurrently --raw 'npm run build:css' 'npm run build:js'"
}
```

### Nodemon

[Nodemon](http://nodemon.io/) is a dependency I reluctantly pulled into the project because of our tooling choices. For this particular project, we were required to use LESS. Normally I'm a SASS fan and the great thing about the command line tools for node-sass is that it has a built in watch command. Ruby's sass command also has this functionality, but I didn't want to pull Ruby into the development environment if it wasn't absolutely necessary. This brings us back to LESS, it unfortunately does not have a watch option.

To get around this, I decided to use nodemon, which is a great tool for watching various parts of your project and executing commands on file changes. It can even reload your development server if you need it to. I've commonly found nodemon in use on express applications for this very reason.

``` json
"scripts": {
  "watch:css":"nodemon -q -e less -x lessc --source-map-map-inline site/theme/less/main.less site/theme/assets/css/bundle.css"
}
```
The above command does a couple things. The -q flag silences the output of nodemon since I didn't feel it was necessary for development. The relevant output comes from BrowserSync, but we'll get to that later. The -e flag stands for extension and it will monitor all of the less files in your project, if it notices a change in any of these files, it will then execute the `lessc` command. This is accomplished with the -x portion of the command.

With CSS compilation covered, I was able to address the bundling of my JavaScript.

## Webpack and JavaScript Bundling

In the past I've used [Browserify](http://browserify.org/) on all of my projects. I hadn't really seen a need to use [Webpack](https://webpack.github.io/) because the Browserify setup I had was working so well. It was only recently that I found out that Browserify has a tendency to create very large bundles which take a long time for the browser to process because of it's lack of tree shaking. You can read more about this by reading Nolan Lawson's ["The cost of small modules."](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules/)

Armed with this new knowledge, I felt it was appropriate to give Webpack a try for bundling.

Webpack is broken into three configuration files rather than one, they are named, `webpack.base.config.js`, `webpack.dev.config.js`, and `webpack.prod.config.js`. The default config contains all the basic entry and output parameters and modules I plan on using. The other two files have environment specific configurations. Development has a watch option and Production has a minify plugin. Each config is called depending on the environment or scenario that needs to use it.

{% codeblock webpack.base.config.js lang:javascript %}
'use strict';
module.exports = {
  entry: {
    main: './site/theme/js/main.js'
  },
  output: {
    filename: 'bundle.js',
    path: './site/theme/assets/js'
  },
  plugins: [],
  eslint: {
    configFile: './.eslintrc'
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/
    }]
  },
  watch: false
};
{% endcodeblock %}

{% codeblock webpack.dev.config.js lang:javascript %}
'use strict';
var config = require('./webpack.base.config');
config.devtool = 'source-map';
config.output.sourceMapFilename = '[file].map';
config.watch = true;
module.exports = config;
{% endcodeblock %}

{% codeblock webpack.prod.config.js lang:javascript %}
'use strict';
var webpack = require('webpack');
var config = require('./webpack.base.config');
config.plugins = (config.plugins || []).concat([
	new webpack.optimize.UglifyJsPlugin({
	    mangle: {
	        except: ['$', 'exports', 'require']
	    }
	})
]);
module.exports = config;
{% endcodeblock %}

Each file is then referenced in an NPM script command:

``` json
"scripts": {
  "build:js": "webpack --config build/webpack.prod.config.js",
  "watch:js": "webpack --config build/webpack.dev.config.js"
}
```

## Setting Up BrowserSync

With the JavaScript and LESS solutions in place, I had to tie this all together with BrowserSync so during the development we wouldn't have to constantly refresh our browser to see our changes. This part of the solution took me the longest because I had trouble configuring how my VVV server was referencing the BrowserSync JavaScript.

There are a couple common ways BrowserSync is run, one is to proxy an existing server or stand up your own server that hosts the BrowserSync assets. I chose the later.

The first thing I did was generate a basic configuration file for BrowserSync by running `browser-sync init`.

If you then run BrowserSync without specifying a proxy in the configuration you'll get a message that looks like this:

`[BS] Copy the following snippet into your website, just before the closing
</body> tag`

``` html
<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://HOST:3000/browser-sync/browser-sync-client.js?v=2.16.0'><\/script>".replace("HOST", location.hostname));
//]]></script>
```
The problem I was encountering is that when this was added to my site it would replace the hostname with my dev URL and then look for the client JavaScript on my filesystem in VVV. I could've hosted it there but then when I made configuration changes I'd have to recopy the code and update my local copy. This was less than ideal. To solve this I made a couple configuration changes to BrowserSync.

In my theme files I updated the above script to this:

``` php
<?php if ( $_SERVER['HTTP_HOST'] == 'local.dev'):?>
	<script id="__bs_script__">//<![CDATA[
    document.write("<script async src='http://localhost:3000/browser-sync/browser-sync-client.js?v=2.16.0'><\/script>");
//]]></script>
<?php endif; ?>
```

This now loads BrowserSync from localhost and only loads the script when I'm running the site in local development. (I admit there's probably a more elegant solution to this but it works.)

Next, I also had to update the socket configuration for BrowserSync to point to `localhost:3000`. This is done in the socket parameter of the config file that was generated above. The property is called `domain`.

After refreshing my server, I had my BrowserSync files loading correctly and talking with my WordPress setup. The next thing I had to do was make sure the right files were being monitored and injected into the site on change.

My first attempt was to add my files I needed to have injected into the files parameter in the BrowserSync config. This worked, but didn't allow a lot of flexibility. I decided to write a small node script that leveraged the BrowserSync API.

{% codeblock watch-browsersync.js lang:javascript %}
'use strict';
var bs = require('browser-sync').create('VVV Server');
var BS_CONFIG = require('./bs-config');
bs.watch('./site/theme/**/*.less', function(event, file) {
  if (event === 'change') {
		console.log('\x1b[36m%s\x1b[0m', 'Less changed: \x1b[35m' + file + '\x1b[0m');
	}
});
bs.watch('./site/theme/assets/css/bundle.css', function(event) {
	if (event === 'change') {
		bs.reload('style.css'); // stream endpoint
	}
});
bs.watch('./site/theme/assets/js/*.js', function(event) {
	if (event === 'change') {
		bs.reload();
	}
});
bs.watch('./site/theme/**/*.php', function(event) {
	if (event === 'change') {
		bs.reload();
	}
});
bs.init(BS_CONFIG);
{% endcodeblock %}

If I need to add more functionality to how BrowserSync is functioning this script allows room for that.

### The Final Scripts

With all of the above pieces in place, the final scripts package ended up looking like this:

``` json
"scripts": {
  "build": "concurrently --raw 'npm run build:css' 'npm run build:js'",
  "build:css": "lessc -x site/theme/less/main.less site/theme/assets/css/bundle.css",
  "build:js": "webpack --config build/webpack.prod.config.js",
  "dev": "concurrently --raw 'npm run watch:css' 'npm run watch:js' 'npm run watch'",
  "lint": "eslint site/theme/js",
  "watch": "node ./build/browser-sync.js",
  "watch:css": "nodemon -q -e less -x lessc --source-map-map-inline site/theme/less/main.less site/theme/assets/css/bundle.css",
  "watch:js": "webpack --config build/webpack.dev.config.js"
},
```

## Conclusion

I was really pleased with this configuration because it felt minimal and didn't require a lot of script writing in Gulp or configuration in Grunt. Additionally, with the use of NPM scripts, a developer won't have to have LESS or Webpack or any other tool installed globally to run the project's dev tools.
