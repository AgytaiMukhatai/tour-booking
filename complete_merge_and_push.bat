@echo off
echo ========================================
echo Step 1: Resolving merge conflict...
echo ========================================
git add README.md
if %errorlevel% neq 0 (
    echo ERROR: Failed to add README.md
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Committing merge...
echo ========================================
git commit -m "Merge: Resolve README.md conflict"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 3: Pushing to remote...
echo ========================================
git push --set-upstream origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! All changes pushed!
echo ========================================
pause

