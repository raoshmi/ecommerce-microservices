@echo off
echo ===================================================
echo   🚀 MICROSERVICES ONE-CLICK DEPLOYER
echo ===================================================
echo.
echo 1. Creating GitHub Repository...
echo [Please go to https://github.com/new and create a repo named 'ecommerce-microservices']
echo.
set /p REPO_URL="Enter your GitHub Repo URL (e.g. https://github.com/youruser/repo.git): "
echo.
echo 2. Connecting to GitHub...
git remote add origin %REPO_URL%
git branch -M main
echo.
echo 3. Pushing Code...
git push -u origin main
echo.
echo ===================================================
echo 🎉 SUCCESS! Your code is now on GitHub.
echo.
echo Next Steps for Cloud:
echo - Connect this repo to Railway.app or Render.com
echo - They will automatically see the Dockerfile and deploy!
echo ===================================================
pause
