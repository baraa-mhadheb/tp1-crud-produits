#!/usr/bin/env bash
# Installe Node.js 20 via nvm (si node n'est pas déjà présent)
set -e
if command -v node >/dev/null 2>&1; then
  echo "Node déjà installé : $(node -v)"; exit 0
fi
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm install 20
echo "✅ Node $(node -v) installé. Rouvrez le terminal ou faites : source ~/.bashrc"
