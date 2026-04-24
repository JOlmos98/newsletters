La forma idónea en MX Linux es **`systemd --user` + timer** (más robusto que `cron`, mejor logs, reintentos y control).

## 1) Crea un script ejecutor

Guárdalo como `~/Desktop/newsletters/run_daily_newsletters.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "/home/Jos/Desktop/newsletters"

# Evita ejecuciones solapadas si un día tarda más de lo normal
exec 9>"/tmp/newsletters_daily.lock"
flock -n 9 || { echo "Ya hay una ejecución en curso"; exit 1; }

# COMANDO 0: Seguridad
codex login status && cursor-agent whoami

# COMANDO 1
node scriptFetchNewsletters.js --credentials "credentials/credentials.json" --token "credentials/token.json" --hours 24 --max-results 50

# COMANDO 2
codex exec "Execute @agent/codex.md" < /dev/null

# COMANDO 3
node scriptSummaryToArticle.js --output agent/articlesHtml.md

# COMANDO 4
prompt="$(cat "./agent/cursorPrompt.mdc")"
cursor-agent -p --trust --force --workspace "/home/Jos/Desktop/newsletters" "$prompt"
```

Dale permisos:

```bash
chmod +x "/home/Jos/Desktop/newsletters/run_daily_newsletters.sh"
```

---

## 2) Crea servicio y timer de usuario

Archivo `~/.config/systemd/user/newsletters-daily.service`:

```ini
[Unit]
Description=Pipeline diario newsletters

[Service]
Type=oneshot
WorkingDirectory=/home/Jos/Desktop/newsletters
ExecStart=/home/Jos/Desktop/newsletters/run_daily_newsletters.sh
```

Archivo `~/.config/systemd/user/newsletters-daily.timer`:

```ini
[Unit]
Description=Ejecutar newsletters cada dia a las 14:00 (Espana peninsula)

[Timer]
OnCalendar=*-*-* 14:00:00
Timezone=Europe/Madrid
Persistent=true
Unit=newsletters-daily.service

[Install]
WantedBy=timers.target
```

Actívalo:

```bash
systemctl --user daemon-reload
systemctl --user enable --now newsletters-daily.timer
systemctl --user list-timers | rg newsletters-daily
```

---

## 3) Ver logs / probar manual

Probar una vez ahora:

```bash
systemctl --user start newsletters-daily.service
```

Ver logs:

```bash
journalctl --user -u newsletters-daily.service -n 200 --no-pager
```

---

## 4) Importante para “solo encender PC y olvidarte”

Si quieres que el timer corra aunque no tengas sesión gráfica abierta, activa linger:

```bash
sudo loginctl enable-linger "$USER"
```

Con esto, sí: dejas el PC encendido y el job se dispara cada día a las **14:00 hora peninsular**.  
Si quieres, te paso también versión `cron` (más simple, menos robusta).