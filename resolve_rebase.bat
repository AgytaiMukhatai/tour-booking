@echo off
echo ========================================
echo Resolving rebase conflicts
echo ========================================
echo.

echo Step 1: Adding resolved files...
git add README.md backend/README.md backend/package.json
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo Step 2: Continuing rebase...
git rebase --continue
if %errorlevel% neq 0 (
    echo ERROR: Failed to continue rebase
    echo Check if there are more conflicts
    pause
    exit /b 1
)

echo.
echo Step 3: Pushing to remote...
git push --set-upstream origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Rebase completed and pushed!
echo ========================================
pause

