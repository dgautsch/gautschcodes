---
title: Quick Guide to Code Editor Linting
date: 2016-08-19 15:41:04
tags:
    - development
    - coding
categories: coding
---

If you're not using a JavaScript linter, you should be. There are a lot of great reasons to use a linter, to name a few:

- Improved code quality
- Less errors in your code
- Quickly spot common problems with JavaScript
- Less time debugging

Most modern code editors support linting in some form or another. For the purposes of this article I'll show you how to quickly get setup in Sublime Text 3.

1. First make sure you have the [Sublime Text package manager](https://packagecontrol.io/) installed.
2. Then make sure you have [Node installed.](http://node.io/)
3. While in Sublime Text you can press `Shift+Command P` to bring up your command palette.
4. Then type install and press enter.
5. Type in `sublime-linter` and hit enter. This will install the sublime linter package.
6. Bring up the command palette again and type in `jshint` There should be a package called `sublimelinter-jshint`, hit enter to install it.
7. Open up your favorite terminal and type in `npm install -g jshint`
8. Restart Sublime Text and then open any JavaScript file and you should start to see yellow and red icons in your gutter denoting linting errors and warnings. If you don't, you probably have pretty clean code!

If you have another linter you prefer such as `eslint` feel free to install the packages for that.

### Sample Lint Configuration

You can place this snippet in the root of your project and name it `.jshintrc` to apply your own custom rules. Or you can modify your global jshint configuration in sublime text.

{

    "undef": true,
	"unused": true,
	"browser": true,
	"predef": [
		"module",
		"console",
		"require"
	]
}

### Resource Links

- [https://github.com/SublimeLinter/SublimeLinter-jshint](https://github.com/SublimeLinter/SublimeLinter-jshint)
- [https://github.com/roadhump/SublimeLinter-eslint](https://github.com/roadhump/SublimeLinter-eslint)
