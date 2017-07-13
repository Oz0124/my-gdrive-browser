/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');

var app = new EmberApp({
          'ember-cli-jquery-ui': {
            'theme': 'black-tie'
          }
      });

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

var bootstrapFonts = pickFiles('bower_components/bootstrap/fonts/',{
  srcDir: '/',
  files: ['*'],
  destDir: 'fonts'
});

app.import('bower_components/bootstrap/dist/css/bootstrap.css');
app.import('bower_components/bootstrap/dist/css/bootstrap.css.map', {
    destDir: 'assets'
  });
app.import('bower_components/bootstrap/dist/js/bootstrap.js');

// avoid jquery ui button conflict with bootstrap one.
app.import('vendor/noConflict.js');
// jquery file upload
app.import('bower_components/jquery-file-upload/js/jquery.fileupload.js');

// fancyTree
app.import('bower_components/jquery.fancytree/dist/jquery.fancytree.js');
app.import('bower_components/jquery.fancytree/dist/skin-bootstrap/ui.fancytree.css');
app.import('bower_components/jquery.fancytree/dist/skin-themeroller/ui.fancytree.css');
app.import('bower_components/jquery.fancytree/dist/skin-themeroller/icons.gif', {destDir: 'assets'});
app.import('bower_components/jquery.fancytree/dist/skin-themeroller/loading.gif', {destDir: 'assets'});
// fancytree 3rd party
//app.import('bower_components/ui-contextmenu/jquery.ui-contextmenu.js');
app.import('vendor/fancytree.extensions/contextmenu/css/jquery.contextMenu.css');
app.import('vendor/fancytree.extensions/contextmenu/js/jquery.fancytree.contextMenu.js');
app.import('vendor/fancytree.extensions/contextmenu/js/jquery.contextMenu-1.6.5.js');
var contextmenuImages = pickFiles('vendor/fancytree.extensions/contextmenu/images/',{
  srcDir: '/',
  files: ['*'],
  destDir: 'images'
});
// google drive api sdk
// app.import('vendor/gdrive.js');

// penpower file browser icon
app.import('app/styles/fBrowser-icon.css');
app.import('vendor/img/fBrowser-icon.png', {
    destDir: 'assets'
  });

app.import('vendor/MyLib/PreGDrive.js');

module.exports = mergeTrees([app.toTree(), bootstrapFonts, contextmenuImages]);
