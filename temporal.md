## Para MX Linux:

### COMANDO 0: Seguridad
```bash
codex login status && cursor-agent whoami
```

### COMANDO 1: Fetch de newsletters (raw)
```bash
node scriptFetchNewsletters.js --credentials "credentials/credentials.json" --token "credentials/token.json" --hours 24 --max-results 50
```

### COMANDO 2.1: Codex resume (primera tanda: 4 newsletters)
```bash
codex exec "Execute @agent/codex.md. Run only this batch and stop after completing 4 pending newsletters in summary/codex-checklist.md." < /dev/null
```

### COMANDO 2.2: Codex resume (segunda tanda: restantes)
```bash
codex exec "Execute @agent/codex.md. Resume using summary/codex-checklist.md and process all remaining pending newsletters until finished." < /dev/null
```

### COMANDO 3: resúmenes de Codex se parsean a html
```bash
node scriptSummaryToArticle.js --output agent/articlesHtml.md
```

### COMANDO 4: Cursor termina todo el proceso formando los html y commiteando
```bash
prompt="$(cat "./agent/cursorPrompt.mdc")"
cursor-agent -p --trust --force --workspace "/home/Jos/Desktop/newsletters" "$prompt"
```

chmod +x "/home/Jos/Desktop/newsletters/run_daily_newsletters.sh"
bash "/home/Jos/Desktop/newsletters/run_daily_newsletters.sh"