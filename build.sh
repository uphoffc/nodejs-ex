#!/bin/bash
cp node_modules/katex/dist/katex.min.css public/css/
cp -r node_modules/katex/dist/fonts/ public/css/
cp node_modules/katex/dist/katex.min.js public/js/
cp node_modules/katex/dist/contrib/auto-render.min.js public/js/
cp node_modules/reveal.js/css/reveal.css public/css/reveal.css
browserify client.js -o public/bundle.js
browserify iframe/wave.js -o public/iframe/wave.bundle.js
sass css/theme/source/tum.scss public/css/theme/tum.css
