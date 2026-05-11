@echo off
chcp 65001 >nul
title Felpdesigner Chatbot API
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado.
  echo Instale o Node.js LTS em https://nodejs.org/ e tente novamente.
  pause
  exit /b 1
)
echo Iniciando Felpdesigner Chatbot API...
echo.
npm start
pause
