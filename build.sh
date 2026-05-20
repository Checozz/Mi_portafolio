#!/usr/bin/env bash
# Recompila los .jsx a .js minificados.
# Úsalo después de editar src/*.jsx antes de hacer `firebase deploy`.
set -e
cd "$(dirname "$0")"

# Carga nvm si está disponible (para que npx sea visible aunque corras el script
# desde un shell no-interactivo)
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

npx --yes esbuild@0.24.0 \
  src/app.jsx src/sections.jsx src/projects.jsx src/tweaks-panel.jsx \
  --loader:.jsx=jsx \
  --target=es2018 \
  --minify \
  --format=iife \
  --outdir=dist \
  --out-extension:.js=.js
echo "✓ Build listo. Ahora: firebase deploy --only hosting"
