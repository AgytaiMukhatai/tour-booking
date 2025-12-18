@echo off
chcp 65001 >nul
echo ========================================
echo Auto-resolving conflicts - choosing MCP version
echo ========================================
echo.

echo Step 1: Choosing our version (HEAD) for all conflicted files...
echo This keeps MCP integration and sub-agents

echo.
echo For backend/ai-agent/agent.js - keeping version with OpenAI and MCP
git checkout --ours backend/ai-agent/agent.js

echo.
echo For backend/api/ai/chat.js - keeping version with full context
git checkout --ours backend/api/ai/chat.js

echo.
echo For backend/README.md - already resolved manually
echo For backend/package.json - already resolved manually

echo.
echo Step 2: Adding all resolved files...
git add backend/README.md
git add backend/package.json
git add backend/ai-agent/agent.js
git add backend/api/ai/chat.js
git add ai-agent/prompts/system-prompt.md
git add README.md

echo.
echo Step 3: Adding restored files...
git add WORKFLOW.md
git add ai-rules/*.md

echo.
echo Step 4: Continuing rebase...
git rebase --continue

echo.
echo ========================================
echo If successful, run: git push origin main
echo ========================================
pause

