import path, { resolve } from "path";
import { glob } from "glob";
import PurgecssPlugin from "purgecss-webpack-plugin";

export default function(config, env, helpers) {
    config.plugins.push(
        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, {
                nodir: true
            })
        })
    );

    // Switch css-loader for typings-for-css-modules-loader, which is a wrapper
    // that automatically generates .d.ts files for loaded CSS
    helpers.getLoadersByName(config, "css-loader").forEach(({ loader }) => {
        loader.loader = "typings-for-css-modules-loader";
        loader.options = Object.assign(loader.options, {
            camelCase: true,
            banner:
                "// This file is automatically generated from your CSS. Any edits will be overwritten.",
            namedExport: true,
            silent: true
        });
    });

    // Use any `index` file, not just index.js
    config.resolve.alias["preact-cli-entrypoint"] = resolve(
        process.cwd(),
        "src",
        "index"
    );

    return config;
}
