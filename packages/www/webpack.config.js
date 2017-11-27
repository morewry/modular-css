"use strict";

var path = require("path"),

    webpack = require("webpack"),

    Cleanup = require("webpack-cleanup-plugin"),
    HTML    = require("html-webpack-plugin"),
    Shake   = require("webpack-common-shake").Plugin,
    
    CSS = require("modular-css-webpack/plugin");

module.exports = (env) => {
    const release = env === "dist";
    const debug   = !release;

    return {
        entry   : "./src/index.js",
        devtool : "cheap-source-map",
        output  : {
            path     : path.resolve("./dist"),
            filename : "app.js"
        },
        
        module : {
            rules : [
                {
                    test : /\.css$/,
                    use  : {
                        loader  : "modular-css-webpack/loader",
                        options : {
                            namedExports : false
                        }
                    }
                },
                {
                    test : /\.js$/,
                    use  : "buble-loader"
                }
            ]
        },
        
        plugins : [
            new Cleanup({
                exclude : [
                    ".gitignore"
                ]
            }),

            // tree-shake ES modules
            new webpack.optimize.ModuleConcatenationPlugin(),

            // tree-shake commonJS modules
            new Shake(),

            new CSS({
                css : "./app.css",
                
                namer : release ?
                    require("modular-css-namer")() :
                    null,
                
                done : release ?
                    // can't use cssnano until v4 is out :(
                    // [ require("cssnano")() ] :
                    [] : []
            }),

            new HTML({
                template : "./src/index.ejs",
                inject   : true,
                hash     : release,
                title    : release ?
                    "modular-css" : "modular-css local dev"
            })
        ],
        
        resolve : {
            alias : {
                fs     : require.resolve("./stubs/fs.js"),
                module : require.resolve("./stubs/generic.js")
            }
        },

        watchOptions : {
            ignored : /node_modules/
        },

        devServer : {
            compress   : true,
            publicPath : "http://localhost:8080/"
        }
    };
};
