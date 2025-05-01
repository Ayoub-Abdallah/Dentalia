@echo off
cd /d C:\dentalia\backend
start cmd /k "npm start"

timeout /t 7

cd /d C:\dentalia\frontend
start cmd /k "npm run dev"

