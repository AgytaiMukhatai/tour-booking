@echo off
echo ========================================
echo Syncing with remote and pushing
echo ========================================
echo.

echo Step 1: Fetching remote changes...
git fetch origin
if %errorlevel% neq 0 (
    echo ERROR: Failed to fetch
    pause
    exit /b 1
)

echo.
echo Step 2: Pulling remote changes (with rebase)...
git pull --rebase origin main
if %errorlevel% neq 0 (
    echo.
    echo WARNING: There might be conflicts. Please resolve them manually.
    echo After resolving conflicts, run:
    echo   git rebase --continue
    echo   git push --set-upstream origin main
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
echo SUCCESS! All changes synced and pushed!
echo ========================================
pause

