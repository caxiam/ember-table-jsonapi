/* jshint node: true */
'use strict';
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-tabular',
  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/app.css');
    app.import(app.bowerDirectory + '/font-awesome/css/font-awesome.css');
  },
  postprocessTree: function( type, tree ) {
    // extract font-awesome fonts and place into /fonts directory
    var fonts = new Funnel( 'bower_components/font-awesome', {
      srcDir: 'fonts',
      destDir: '/fonts',
      include: [ 'fontawesome-webfont.*' ]
    });

    return mergeTrees(
      [
        tree,
        fonts
      ],
      {
        overwrite: true
      }
    );
  }
};
