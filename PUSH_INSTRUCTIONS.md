# Инструкции для Push изменений

Из-за проблем с кодировкой в PowerShell, выполните следующие команды вручную:

## Шаг 1: Завершить rebase

```bash
git add backend/README.md backend/package.json
git rebase --continue
```

Если rebase завершится с ошибкой, можно попробовать:
```bash
git rebase --abort
```
И затем продолжить с обычным коммитом.

## Шаг 2: Добавить все новые файлы

```bash
git add WORKFLOW.md
git add ai-rules/ai_Gaini_Kutumov.md
git add ai-rules/backend_Gaini_Kutumov.md
git add ai-rules/frontend_Agytai_Mukhatai.md
git add ai-rules/qa_Team.md
git add README.md
git add backend/ai-agent/agent.js
git add backend/ai-agent/mcp-client.js
```

Или одной командой:
```bash
git add WORKFLOW.md ai-rules/*.md README.md backend/ai-agent/agent.js backend/ai-agent/mcp-client.js
```

## Шаг 3: Создать коммит

```bash
git commit -m "Complete project requirements: Add MCP integration, sub-agents, AI rules, and WORKFLOW.md"
```

## Шаг 4: Запушить в репозиторий

```bash
git push origin main
```

Если возникнут проблемы с push (из-за rebase), используйте:
```bash
git push --force-with-lease origin main
```

## Альтернатива: Использовать bat файл

Запустите `final_push.bat` двойным кликом или через cmd:
```cmd
cmd /c final_push.bat
```

---

## Что будет закоммичено:

✅ WORKFLOW.md - полная документация процесса
✅ ai-rules/ai_Gaini_Kutumov.md - правила для AI Engineer
✅ ai-rules/backend_Gaini_Kutumov.md - правила для Backend Developer  
✅ ai-rules/frontend_Agytai_Mukhatai.md - правила для Frontend Developer
✅ ai-rules/qa_Team.md - правила для QA Engineer
✅ Обновленный README.md
✅ Обновленный backend/ai-agent/agent.js с sub-agents
✅ Обновленный backend/ai-agent/mcp-client.js с MCP SDK
✅ Разрешенные конфликты в backend/README.md и backend/package.json

