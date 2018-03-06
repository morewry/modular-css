"use strict";

const stylelint = require("stylelint");

const Processor = require("modular-css-core");

const name = "modular-css/check";
const msgs = stylelint.utils.ruleMessages(name, {
    "invalid composes reference" : (error) =>
        `${error.reason} - `
});

module.exports = stylelint.createPlugin(name, (opts = {}) => {
    const config = Object.assign(Object.create(null), opts, {
        rewrite : false,
        map     : false,
        css     : false,
        json    : false
    });

    return (root, result) => {
        const processor = new Processor(Object.assign(
            Object.create(null),
            result.opts,
            config
        ));
    
        return processor.string(result.opts.from, root)
            .catch((error) => {
                console.log(error);
                // console.log(error.reason);

                stylelint.utils.report({
                    message  : msgs[error.reason.toLowerCase()](error),
                    // node     : error.source,
                    result   : result,
                    ruleName : name
                });
            });
    };
});

module.exports.ruleName = name;
module.exports.messages = msgs;
