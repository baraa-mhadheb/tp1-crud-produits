#!/usr/bin/env bash
pkill -f "uvicorn app.main:app" && echo "Backend arrêté"
pkill -f vite && echo "Frontend arrêté"
