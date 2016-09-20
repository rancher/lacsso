/* jshint node: true */
'use strict';
var merge = require('merge');

module.exports = {
  name: 'lacsso',
  included: function(app) {
    this._super.included(app);

    //app.import(app.bowerDirectory + '/rancher-icons/style.scss', {overwrite: true});
    //app.import(app.bowerDirectory + '/rancher-icons/fonts/rancher-icons.svg',{destDir: 'assets/fonts/', overwrite: true});
    //app.import(app.bowerDirectory + '/rancher-icons/fonts/rancher-icons.ttf',{destDir: 'assets/fonts/', overwrite: true});
    //app.import(app.bowerDirectory + '/rancher-icons/fonts/rancher-icons.woff',{destDir: 'assets/fonts/', overwrite: true});
    //app.import(app.bowerDirectory + '/rancher-icons/fonts/rancher-icons.woff2',{destDir: 'assets/fonts/', overwrite: true});
    //app.import('vendor/fonts/prompt-v1-latin-700.woff',{destDir: 'assets/fonts/', overwrite: true});
    //app.import('vendor/fonts/prompt-v1-latin-700.woff2',{destDir: 'assets/fonts/', overwrite: true});
    //app.import('vendor/fonts/prompt-v1-latin-regular.woff',{destDir: 'assets/fonts/', overwrite: true});
    //app.import('vendor/fonts/prompt-v1-latin-regular.woff2',{destDir: 'assets/fonts/', overwrite: true});
  },

};
