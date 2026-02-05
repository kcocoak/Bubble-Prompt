@echo off
chcp 65001 >nul
title 🫧 Bubble Prompt 启动器

echo ========================================================
echo        🫧 正在启动 Bubble Prompt 泡泡提示器...
echo ========================================================
echo.

:: 1. Check Node.js
node -v >nul 2>&1
if errorlevel 1 goto NoNode

:: 2. Check Dependencies
if exist "node_modules" goto StartVite

:InstallDeps
echo [INFO] 初次运行，正在安装依赖文件... (可能需要几分钟)
call npm install
if errorlevel 1 goto InstallFail
echo [SUCCESS] 依赖安装完成！
echo.

:StartVite
echo [SUCCESS] 准备就绪！
echo [INFO] 正在启动浏览器...
echo.
call npm run dev -- --open
goto End

:NoNode
echo [ERROR] 未检测到 Node.js！
echo 请先去官网下载安装: https://nodejs.org/
echo.
pause
exit /b

:InstallFail
echo [ERROR] 依赖安装失败，请检查网络或 Node.js 环境。
pause
exit /b

:End
pause
