/**jshint globalstrict:true, sub:true, node:true*/
'use strict';
var gcc = require('gcc-rest');

module.exports = function(grunt) {

    grunt.registerMultiTask('compile', 'Compile code using Google Closure Compiler’s REST API.', function() {
        var done = this.async();
        var options = this.options({
            params: {}
        });

        this.files.forEach(function(file) {
            file.src.filter(function(filepath) {
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    gcc.addFile(filepath);
                }
            });

            gcc.params(options.params);

            /**
             * @param {{
             *    errors: Object,
             *    warnings: Object,
             *    compiledCode: string
             * }} json
             */
            var handleResult = function(json) {
                var k;
                 var errors = json.errors || {};
                 var warnings = json.warnings || {};

                 for (k in errors) {
                     if (errors.hasOwnProperty(k)) {
                         grunt.log.error(errors[k]);
                     }
                 }
                 for (k in warnings) {
                     if (warnings.hasOwnProperty(k)) {
                         grunt.log.warn(warnings[k]);
                     }
                 }

                 grunt.file.write(file.dest, json.compiledCode);
                 grunt.log.writeln('File "' + file.dest + '" created.');
                 done();
            };

            gcc.compilePassJson(handleResult);
        });

    });

};