@echo off
echo ========================================
echo Committing and pushing AI Chat Bot changes
echo ========================================
echo.

echo Step 1: Adding all files...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo Step 2: Committing changes...
git commit -m "Add AI Chat Bot with OpenAI and MCP integration

- Added OpenAI API integration for LLM
- Created MCP client for Context7 and Database MCP servers
- Implemented 5 tools: search_tours, get_tour_details, compare_tours, save_user_preferences, get_user_history
- Updated AIAgent to use OpenAI Functions/Tools
- Added MCP configuration and setup documentation
- Updated system prompt with MCP tools instructions"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit
    pause
    exit /b 1
)

echo.
echo Step 3: Pushing to remote...
git push
if %errorlevel% neq 0 (
    echo.
    echo NOTE: If this is first push, you may need to run:
    echo   git push --set-upstream origin main
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! All changes pushed!
echo ========================================
pause

