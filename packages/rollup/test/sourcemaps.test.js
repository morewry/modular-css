/* eslint-disable */
/* eslint consistent-return: off */
"use strict";

var rollup = require("rollup").rollup,
    shell  = require("shelljs"),
    
    read  = require("test-utils/read.js")(__dirname),
    namer = require("test-utils/namer.js"),
    
    plugin = require("../rollup.js");

describe("/rollup.js", () => {
    /* eslint max-statements: "off" */

    // afterEach(() => shell.rm("-rf", "./packages/rollup/test/output/*"));
    
    it("shouldn't disable sourcemap generation", () =>
        rollup({
            input   : require.resolve("./specimens/simple.js"),
            plugins : [
                plugin({
                    namer,
                    sourcemap : true
                })
            ]
        })
        .then((bundle) => bundle.generate({
            format    : "es",
            sourcemap : true
        }))
        .then((result) => {
            var map = result.map;

            // Sources are absolute file paths, so prevent snapshot testing
            delete map.sources;
            
            expect(map).toMatchSnapshot();
        })
    );
    
    it("should not output sourcemaps when they are disabled", () =>
        rollup({
            input   : require.resolve("./specimens/simple.js"),
            plugins : [
                plugin({
                    namer,
                    map : false,
                    css : "./packages/rollup/test/output/no-maps.css"
                })
            ]
        })
        .then((bundle) => Promise.all([
            bundle,
            bundle.generate({
                format    : "es",
                sourcemap : false
            })
        ]))
        .then((results) => {
            expect(results[1].map).toBe(null);

            return results[0].write({
                format    : "es",
                file      : "./packages/rollup/test/output/no-maps.js",
                sourcemap : false
            });
        })
        .then(() =>
            expect(read("no-maps.css")).toMatchSnapshot()
        )
    );

    it("should generate external sourcemaps", () =>
        rollup({
            input   : require.resolve("./specimens/simple.js"),
            plugins : [
                plugin({
                    namer,
                    css : "./packages/rollup/test/output/simple.css",
                    map : {
                        inline : false
                    }
                })
            ]
        })
        .then((bundle) => bundle.write({
            format : "es",
            file   : "./packages/rollup/test/output/simple.js"
        }))
        .then(() => expect(read("simple.css.map")).toMatchSnapshot())
    );

    it("should generate correct single-css file sourcemaps", () =>
        rollup({
            input   : require.resolve("./specimens/simple.js"),
            plugins : [
                plugin({
                    namer,
                    css : "./packages/rollup/test/output/simple.css",
                    map : {
                        inline : false
                    }
                })
            ]
        })
        .then((bundle) => bundle.write({
            format : "es",
            file   : "./packages/rollup/test/output/simple.js"
        }))
        .then(() => expect(read("simple.css.map")).toMatchSnapshot())
    );
    
    it.only("should generate correct multi-css file sourcemaps", () =>
        rollup({
            input   : require.resolve("./specimens/deep-dependencies.js"),
            plugins : [
                plugin({
                    namer,
                    css : "./packages/rollup/test/output/deep-dependencies.css",
                    map : {
                        inline : false
                    }
                })
            ]
        })
        .then((bundle) => bundle.write({
            format : "es",
            file   : "./packages/rollup/test/output/deep-dependencies.js"
        }))
        .then(() => {
            console.log(
                read("deep-dependencies.css.map")
            );
        })
        // .then(() => expect(read("deep-dependencies.css.map")).toMatchSnapshot())
    );
});
