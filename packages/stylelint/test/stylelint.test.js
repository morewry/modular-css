"use strict";

const lint = require("stylelint");

const plugin = require.resolve("../stylelint.js");

describe("stylelint-plugin-modular-css", () => {
    it("should lint code", () => lint.lint({
            config : {
                plugins : [
                    plugin
                ],

                rules : {
                    "modular-css/check" : true
                }
            },

            files : [
                require.resolve("./specimens/error.css")
            ]
        })
        .then(console.log.bind(console, "stylelint then"))
        .catch(console.error.bind(console, "stylelint catch")));
});
