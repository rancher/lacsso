/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
    outputPaths: {
      app: {
        css: {
          'lacsso': '/assets/lacsso.css',
          'app': '/assets/dummy.css'
        }
      }
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
    app.import('vendor/fonts/prompt-v1-latin-700.woff',{destDir: 'assets/fonts/', overwrite: true});
    app.import('vendor/fonts/prompt-v1-latin-700.woff2',{destDir: 'assets/fonts/', overwrite: true});
    app.import('vendor/fonts/prompt-v1-latin-regular.woff',{destDir: 'assets/fonts/', overwrite: true});
    app.import('vendor/fonts/prompt-v1-latin-regular.woff2',{destDir: 'assets/fonts/', overwrite: true});

  return app.toTree();
};
