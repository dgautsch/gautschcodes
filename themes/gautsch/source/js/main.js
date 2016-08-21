'use strict';
// Global Namespace
var DG = DG || {};

DG.fonts = require('./_components/fonts.js');
DG.home = require('./_components/home.js');

// Loop through the namespace and check if the object has an init method
Object.keys(DG).forEach(function (key) {
    if (DG[key].hasOwnProperty('init')){
        DG[key].init();
    }
});
