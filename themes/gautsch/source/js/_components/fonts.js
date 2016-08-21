'use strict';
// imports
var wf = require('webfontloader');

// module
var fonts = (function () {

	function load() {
		wf.load({
			google: {
				families: ['Lato', 'Lora']
			}
		});
	}
	return {
		init: load
	};
}());

//export
module.exports = fonts;
