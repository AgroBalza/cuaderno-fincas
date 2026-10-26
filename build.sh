#!/bin/sh
# Compila la app y marca la versión en index.html para que los teléfonos bajen la nueva.
set -e
npx esbuild src/main.js --bundle --format=esm --minify --target=es2020,safari15 --outfile=app.js
V=$(cat app.js config.js | sha1sum | cut -c1-8)
sed -i -E "s#src=\"app\.js(\?v=[a-z0-9]+)?\"#src=\"app.js?v=$V\"#; s#src=\"config\.js(\?v=[a-z0-9]+)?\"#src=\"config.js?v=$V\"#" index.html
echo "version $V"
