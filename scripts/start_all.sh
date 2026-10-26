#!/usr/bin/env bash
cd "$(dirname "$0")/.."
sudo service postgresql start
pkill -f "uvicorn app.main:app" 2>/dev/null; pkill -f vite 2>/dev/null
setsid nohup ./scripts/run_backend.sh > backend.log 2>&1 &
setsid nohup ./scripts/run_frontend.sh > frontend.log 2>&1 &
sleep 5
echo "✅ Backend  : http://localhost:8000/docs"
echo "✅ Frontend : http://localhost:5173"
