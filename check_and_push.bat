@echo off
echo ========================================
echo Checking git status and pushing
echo ========================================
echo.

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Checking if rebase is complete...
git rebase --show-current-patch 2>nul
if %errorlevel% equ 0 (
    echo WARNING: Rebase might still be in progress
    echo.
    echo If rebase is complete, you can force push with:
    echo   git push --force-with-lease origin main
    echo.
    echo Or abort rebase and start fresh:
    echo   git rebase --abort
    echo   git pull origin main
    echo   git push --set-upstream origin main
) else (
    echo Rebase appears to be complete
    echo.
    echo Step 3: Attempting force push with lease...
    git push --force-with-lease origin main
    if %errorlevel% neq 0 (
        echo.
        echo Force push failed. Trying regular push...
        git pull --rebase origin main
        git push --set-upstream origin main
    )
)

echo.
pause

