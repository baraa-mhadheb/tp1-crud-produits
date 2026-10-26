#!/usr/bin/env bash
# Installe PostgreSQL, Python (venv) et curl dans WSL2 Ubuntu
set -e
sudo apt update
sudo apt install -y postgresql postgresql-contrib python3 python3-venv python3-pip curl unzip build-essential libpq-dev
echo "✅ Paquets système installés."
