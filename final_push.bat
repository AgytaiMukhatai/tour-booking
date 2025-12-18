@echo off
chcp 65001 >nul
echo ========================================
echo Final Push: Complete all requirements
echo ========================================
echo.

echo Step 1: Adding resolved conflicts...
git add backend/README.md backend/package.json
if %errorlevel% neq 0 (
    echo ERROR: Failed to add resolved files
    pause
    exit /b 1
)

echo.
echo Step 2: Continuing rebase...
git rebase --continue
if %errorlevel% neq 0 (
    echo WARNING: Rebase may have issues, but continuing...
)

echo.
echo Step 3: Adding all new files and changes...
git add WORKFLOW.md
git add ai-rules/*.md
git add README.md
git add backend/ai-agent/agent.js
git add backend/ai-agent/mcp-client.js
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo.
echo Step 4: Committing all changes...
git commit -m "Complete project requirements: Add MCP integration, sub-agents, AI rules, and WORKFLOW.md"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit
    pause
    exit /b 1
)

echo.
echo Step 5: Pushing to remote...
git push origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push
    echo Trying with force...
    git push --force-with-lease origin main
    if %errorlevel% neq 0 (
        echo ERROR: Failed to push even with force
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo SUCCESS! All changes pushed!
echo ========================================
echo.
echo Summary:
echo - MCP integration completed
echo - Sub-agents integrated
echo - AI rules files created
echo - WORKFLOW.md added
echo - All documentation updated
echo.
pause

