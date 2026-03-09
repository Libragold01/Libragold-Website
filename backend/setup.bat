@echo off
echo ================================================
echo  Libragold Backend - First Time Setup
echo ================================================
echo.

echo [1/4] Installing backend dependencies...
call npm install
if errorlevel 1 (echo ERROR: npm install failed & pause & exit /b 1)

echo.
echo [2/4] Installing admin dashboard dependencies...
cd admin
call npm install
if errorlevel 1 (echo ERROR: admin npm install failed & pause & exit /b 1)
cd ..

echo.
echo [3/4] Generating Prisma client...
call npx prisma generate
if errorlevel 1 (echo ERROR: prisma generate failed & pause & exit /b 1)

echo.
echo [4/4] Pushing database schema (creating tables)...
echo NOTE: Make sure PostgreSQL is running and .env DATABASE_URL is set correctly!
call npx prisma db push
if errorlevel 1 (echo ERROR: prisma db push failed - check your DATABASE_URL in .env & pause & exit /b 1)

echo.
echo [5/5] Seeding database (admin user + default content)...
call npx tsx prisma/seed.ts
if errorlevel 1 (echo ERROR: seed failed & pause & exit /b 1)

echo.
echo ================================================
echo  Setup Complete!
echo ================================================
echo.
echo  Admin login: username=admin  password=libragold2026
echo.
echo  To start the API server:
echo    npm run dev
echo.
echo  To start the admin dashboard (in a new terminal):
echo    cd admin ^&^& npm run dev
echo.
echo  API server:       http://localhost:3001
echo  Admin dashboard:  http://localhost:5174
echo.
pause
