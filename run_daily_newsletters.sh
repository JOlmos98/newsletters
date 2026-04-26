#!/usr/bin/env bash
set -euo pipefail

cd "/home/Jos/Desktop/newsletters"

# Bootstrap de entorno para ejecuciones no interactivas (cron/systemd)
safe_source() {
  local file="$1"
  if [ -f "$file" ]; then
    set +u
    # shellcheck disable=SC1090
    source "$file"
    set -u
  fi
}

safe_source "$HOME/.profile"
safe_source "$HOME/.bashrc"

# Soporte nvm (si aplica)
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  set +u
  # shellcheck disable=SC1091
  source "$NVM_DIR/nvm.sh"
  set -u
fi

# PATH de usuario típico
export PATH="$HOME/.local/bin:$HOME/bin:$PATH"

# Evita solapes
exec 9>"/tmp/newsletters_daily.lock"
flock -n 9 || { echo "Ya hay una ejecución en curso"; exit 1; }

# Preflight de dependencias
for cmd in codex cursor-agent node flock; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Error: comando no encontrado -> $cmd"
    echo "PATH actual: $PATH"
    exit 127
  fi
done

echo "Entorno verificado:"
echo "- codex: $(command -v codex)"
echo "- node: $(command -v node)"
echo "- cursor-agent: $(command -v cursor-agent)"

# COMANDO 0: Seguridad
codex login status && cursor-agent whoami

# COMANDO 1: Fetch raw
node scriptFetchNewsletters.js --credentials "credentials/credentials.json" --token "credentials/token.json" --hours 24 --max-results 50

# COMANDO 2.1: Codex primera tanda (4)
codex exec "Execute @agent/codex.md. Run only this batch and stop after completing 4 pending newsletters in summary/codex-checklist.md." < /dev/null

# COMANDO 2.2: Codex segunda tanda (restantes)
codex exec "Execute @agent/codex.md. Resume using summary/codex-checklist.md and process all remaining pending newsletters until finished." < /dev/null

# COMANDO 3: Summary -> HTML
node scriptSummaryToArticle.js --output agent/articlesHtml.md

# COMANDO 4: Cursor cierre
prompt="$(cat "./agent/cursorPrompt.mdc")"
cursor-agent -p --trust --force --workspace "/home/Jos/Desktop/newsletters" "$prompt"