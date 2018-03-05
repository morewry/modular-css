"use strict";

const stylelint = require("stylelint");

const mcss = require("postcss-modular-css");

const name = "modular-css/check";
const msgs = stylelint.utils.ruleMessage(name, {
    expected : "Something?"
});

module.exports = stylelint.createPlugin(name, (opts) => {
    
});
