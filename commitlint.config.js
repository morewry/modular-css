const rules = require("@commitlint/config-conventional").rules;

module.exports = {
    extends : [
        "@commitlint/config-conventional"
    ],

    rules : {
        // I want to be able to use "wip", damnit.
        "type-enum" : [
            2,
            "always",
            rules["type-enum"][2].concat("wip")
        ]
    }
};
