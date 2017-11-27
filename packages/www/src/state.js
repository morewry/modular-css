import fs from "fs";

import Processor from "modular-css-core";

import { process } from "./process.js";

var state =  {
    files : [],

    output : {
        css  : "",
        json : ""
    },

    processor : new Processor({
        resolvers : [
            (src, file) => {
                file = file.replace(/^\.\.\/|\.\//, "");

                return `/${file}`;
            }
        ]
    }),
    
    tab : "CSS",
    
    error : false
};

export function createFile() {
    var file = `/${state.files.length + 1}.css`;

    fs.writeFileSync(file, `\n`);
    
    state.files.push(file);
}

export function output() {
    return `## Files\n\n${
        state.files
            .map((file) => `/* ${file} */\n${fs.readFileSync(file, "utf8")}`)
            .concat(
                state.output.css && `## CSS Output\n\n${state.output.css}`,
                state.output.json && `## JSON Output\n\n${state.output.json}`,
                state.error && `## Error\n\n${state.error}`
            )
            .filter(Boolean)
            .join("\n\n")
    }`;
}

export function hash() {
    const hashed = location.hash.length ? location.hash.slice(1) : false;
    let parsed;

    state.files = [];

    // reset fs data
    fs.data = {};

    // No existing state, create a default file
    if(!hashed) {
        createFile();

        return;
    }

    try {
        parsed = JSON.parse(atob(hashed));

        parsed.forEach((file) => {
            state.files.push(file.name);

            fs.writeFileSync(file.name, file.css);
        });

        process();
    } catch(e) {
        state.error = e.stack;

        createFile();
    }
}

export default state;
