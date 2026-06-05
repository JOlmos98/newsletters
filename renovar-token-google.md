## Chuleta: renovar token Gmail (fetch newsletters)

**Síntoma:** `Error: invalid_grant`

```bash
cd /home/Jos/Desktop/newsletters
node credentials/generateToken.js
# → abrir URL, autorizar, pegar el code en terminal

node scriptFetchNewsletters.js --credentials "credentials/credentials.json" --token "credentials/token.json" --hours 24 --max-results 5

bash run_daily_newsletters.sh
```

**Si falla OAuth con `credentials.json`:**
```bash
# usa credentialsNew.json como base, token sigue siendo token.json
node scriptFetchNewsletters.js --credentials "credentials/credentialsNew.json" --token "credentials/token.json" --hours 24 --max-results 5
```

**Archivos:** `credentials/token.json` (activo) · `credentials/credentials.json` (o `credentialsNew.json`)