@echo off
chcp 65001 >nul
echo ========================================
echo Resolving rebase conflicts
echo ========================================
echo.

echo Step 1: Adding all restored files...
git add WORKFLOW.md
git add ai-rules/ai_Gaini_Kutumov.md
git add ai-rules/backend_Gaini_Kutumov.md
git add ai-rules/frontend_Agytai_Mukhatai.md
git add ai-rules/qa_Team.md

echo.
echo Step 2: Resolving conflicts - accepting our version for backend files...
echo (You may need to manually resolve some conflicts)

echo.
echo For backend/README.md - we'll use the version with full documentation
echo For backend/package.json - we'll use the version with all dependencies
echo For backend/ai-agent/agent.js - we'll use the version with sub-agents
echo For backend/api/ai/chat.js - we'll use the latest version

echo.
echo Step 3: Adding resolved files...
git add backend/README.md backend/package.json backend/ai-agent/agent.js backend/api/ai/chat.js

echo.
echo Step 4: Continuing rebase...
git rebase --continue

echo.
echo ========================================
echo If conflicts remain, resolve them manually and run:
echo git add [conflicted-file]
echo git rebase --continue
echo ========================================
pause

