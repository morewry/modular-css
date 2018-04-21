const rules = require("@commitlint/config-conventional").rules;

module.exports = {
    extends : [
        "@commitlint/config-conventional"
    ],

    rules : {
        "type-enum" : [
            2,
            "always",
            rules["type-enum"][2].concat("wip")
        ]
    }
};
