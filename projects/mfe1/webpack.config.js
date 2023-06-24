const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;
const webpack = require('webpack')


const set = new Set();
const regexpDev = /url\('([^;\)]*)\.(ttf|woff2?|eot|otf|svg)(\?(.*))?'\)/g;
const regexpProd = /url\(([^;\)]*)\.(ttf|woff2?|eot|otf|svg)(\?(.*))?\)/g;
class OutputFontPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("outputFont", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "outputFont",
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
        },
        (assets) => {
          for (let key in assets) {
            if (/\.(ttf|woff2?|eot|otf)$/.test(key) && !set.has(key)) {
              let path = "assets/mfe1/" + key;
              assets[path] = assets[key];
              set.add(path);
            }

            if (/(app.component.css)$/.test(key)) {
              let regexp =
                compilation.options.mode === "production"
                  ? regexpProd
                  : regexpDev;

              if (assets[key]._value) {
                let _value = assets[key]._value;
                regexp.test(_value);
                let temp = _value.replace(regexp, `url('assets/mfe1/$1.$2')`);
                assets[key]._value = temp;
              } else {
                let _value = assets[key]._valueAsBuffer.toString();
                regexp.test(_value);
                let temp = _value.replace(regexp, `url('assets/mfe1/$1.$2')`);
                assets[key]._valueAsBuffer = Buffer.from(temp);
              }
            }
          }
        }
      );
    });
  }
}

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "mfe1",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },   
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new OutputFontPlugin(),
    new ModuleFederationPlugin({
        library: { type: "module" },

        // For remotes (please adjust)
        name: "mfe1",
        filename: "remoteEntry.js",
        exposes: {
            './AppModule': './projects/mfe1/src/app/app.module.ts',
        },        
        
        // For hosts (please adjust)
        // remotes: {
        //     "main": "http://localhost:9000/remoteEntry.js",

        // },

        shared: share({
          "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' }, 
          "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' }, 
          "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' }, 
          "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },

          ...sharedMappings.getDescriptors()
        })
        
    }),
    sharedMappings.getPlugin()
  ],
};
