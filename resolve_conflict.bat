@echo off
echo Resolving merge conflict...
git add README.md
echo.
echo Current status:
git status
echo.
echo ========================================
echo Merge conflict resolved!
echo ========================================
echo.
echo To complete the merge, run:
echo   git commit
echo.
echo To push all changes after commit, run:
echo   git push
echo.
pause

