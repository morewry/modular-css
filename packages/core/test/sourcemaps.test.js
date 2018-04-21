"use strict";

var Consumer = require("source-map").SourceMapConsumer,
    
    namer = require("test-utils/namer.js"),
    
    Processor = require("../processor.js");

describe("/processor.js", () => {
    describe("sourcemap support", () => {
        var processor, map;
        
        beforeEach(() => {
            processor = new Processor({
                namer,
                map : {
                    inline : false
                }
            });
        });

        afterEach(() => {
            if(map && map.destroy) {
                map.destroy();
            }
        });

        it("should output correct single-file source maps", () =>
            processor.file(
                require.resolve("./specimens/simple.css")
            )
            .then(() => processor.output({
                to : "./packages/core/test/output/simple.css"
            }))
            .then((output) => {
                map = new Consumer(output.map.toString());

                expect(map.sources).toMatchSnapshot();

                const mappings = [];

                map.eachMapping((m) => mappings.push(m));

                expect(mappings).toMatchSnapshot();
            })
        );

        it("should output correct multi-file source maps", () =>
            processor.file(
                require.resolve("./specimens/local.css")
            )
            .then(() => processor.output({
                to : "./packages/core/test/output/local.css"
            }))
            .then((output) => {
                map = new Consumer(output.map.toString());

                expect(map.sources).toMatchSnapshot();

                const mappings = [];

                map.eachMapping((m) => mappings.push(m));

                expect(mappings).toMatchSnapshot();
            })
        );
    });
});
