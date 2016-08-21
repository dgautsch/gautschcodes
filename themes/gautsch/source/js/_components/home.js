'use strict';
var Cookies = require('js-cookie');

// module
var home = (function () {

    var nightModeBtn = document.querySelectorAll('[data-action=night]')[0];
    var body = document.getElementsByTagName('body')[0];

    function toggleNightMode() {
        if (body.classList.contains('sunset')) {
            body.classList.remove('sunset');
            Cookies.set('nightMode', false);
        } else {
            body.classList.add('sunset');
            Cookies.set('nightMode', true);
        }
    }

    function checkCookies() {
        var nightModeState = Cookies.get('nightMode');

        if (nightModeState === undefined) {
            Cookies.set('nightMode', false);
        }

        if (nightModeState === 'true') {
            body.classList.add('notransition', 'sunset');
            body.classList.remove('notransition');
        }
    }

    function bind() {
        window.onload = checkCookies;
        nightModeBtn.onclick = toggleNightMode;
    }

	return {
		init: bind
	};
}());

//export
module.exports = home;
