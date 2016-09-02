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

  //app.import('bower_components/rancher-icons/style.css');
  app.import('bower_components/rancher-icons/fonts/rancher-icons.svg', {
    destDir: 'assets/fonts'
  });
  app.import('bower_components/rancher-icons/fonts/rancher-icons.ttf', {
    destDir: 'assets/fonts'
  });
  app.import('bower_components/rancher-icons/fonts/rancher-icons.woff', {
    destDir: 'assets/fonts'
  });
  app.import('bower_components/rancher-icons/fonts/rancher-icons.woff2', {
    destDir: 'assets/fonts'
  });

  return app.toTree();
};
