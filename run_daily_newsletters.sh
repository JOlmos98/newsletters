#!/usr/bin/env bash
set -uo pipefail

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
if [ -z "${NVM_DIR:-}" ]; then
  if [ -d "$HOME/.config/nvm" ]; then
    export NVM_DIR="$HOME/.config/nvm"
  else
    export NVM_DIR="$HOME/.nvm"
  fi
fi
if [ -s "$NVM_DIR/nvm.sh" ]; then
  set +u
  # shellcheck disable=SC1091
  source "$NVM_DIR/nvm.sh"
  set -u
fi

# PATH ampliado para cron/no-login shells
export PATH="$HOME/.local/bin:$HOME/bin:$HOME/.npm-global/bin:$HOME/.cargo/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# Evita solapes
exec 9>"/tmp/newsletters_daily.lock"
flock -n 9 || { echo "Ya hay una ejecución en curso"; exit 1; }

timestamp() { date '+%Y-%m-%d %H:%M:%S'; }
log() { printf '[%s] %s\n' "$(timestamp)" "$*"; }

resolve_cmd() {
  local cmd="$1"
  local resolved=""
  resolved="$(command -v "$cmd" 2>/dev/null || true)"
  if [ -n "$resolved" ]; then
    echo "$resolved"
    return 0
  fi

  # Fallbacks comunes en cron
  case "$cmd" in
    codex)
      for candidate in "$HOME/.local/bin/codex" "$HOME/bin/codex" "/usr/local/bin/codex"; do
        if [ -x "$candidate" ]; then
          echo "$candidate"
          return 0
        fi
      done
      ;;
    cursor-agent)
      for candidate in "$HOME/.local/bin/cursor-agent" "$HOME/bin/cursor-agent" "/usr/local/bin/cursor-agent"; do
        if [ -x "$candidate" ]; then
          echo "$candidate"
          return 0
        fi
      done
      ;;
    node)
      for candidate in "$HOME/.config/nvm/versions/node"/*/bin/node "$HOME/.nvm/versions/node"/*/bin/node "/usr/local/bin/node" "/usr/bin/node"; do
        if [ -x "$candidate" ]; then
          echo "$candidate"
          return 0
        fi
      done
      ;;
  esac

  return 1
}

run_step() {
  local name="$1"
  local retries="$2"
  local cmd="$3"
  local attempt=1

  while [ "$attempt" -le "$retries" ]; do
    log "START $name (intento $attempt/$retries)"
    eval "$cmd"
    local exit_code=$?

    if [ "$exit_code" -eq 0 ]; then
      log "OK    $name"
      return 0
    fi

    log "FAIL  $name (exit=$exit_code)"
    attempt=$((attempt + 1))
    if [ "$attempt" -le "$retries" ]; then
      sleep 3
    fi
  done

  return 1
}

CODEX_BIN="$(resolve_cmd codex || true)"
CURSOR_AGENT_BIN="$(resolve_cmd cursor-agent || true)"
NODE_BIN="$(resolve_cmd node || true)"

missing=0
if [ -z "$CODEX_BIN" ]; then
  log "Error: comando no encontrado -> codex"
  missing=1
fi
if [ -z "$CURSOR_AGENT_BIN" ]; then
  log "Error: comando no encontrado -> cursor-agent"
  missing=1
fi
if [ -z "$NODE_BIN" ]; then
  log "Error: comando no encontrado -> node"
  missing=1
fi
if [ "$missing" -ne 0 ]; then
  log "PATH actual: $PATH"
  exit 127
fi

log "Entorno verificado:"
log "- codex: $CODEX_BIN"
log "- node: $NODE_BIN"
log "- cursor-agent: $CURSOR_AGENT_BIN"

# Asegura que scripts con shebang '#!/usr/bin/env node'
# encuentren node aunque cron tenga un PATH mínimo.
NODE_BIN_DIR="$(dirname "$NODE_BIN")"
export PATH="$NODE_BIN_DIR:$PATH"

run_or_exit() {
  local name="$1"
  local retries="$2"
  local cmd="$3"
  if ! run_step "$name" "$retries" "$cmd"; then
    log "Abortando pipeline en: $name"
    exit 1
  fi
}

# COMANDO 0: Seguridad
run_or_exit "COMANDO 0: Seguridad" 2 "$CODEX_BIN login status && $CURSOR_AGENT_BIN whoami"

# COMANDO 1: Fetch raw
run_or_exit "COMANDO 1: Fetch raw" 2 "$NODE_BIN scriptFetchNewsletters.js --credentials 'credentials/credentials.json' --token 'credentials/token.json' --hours 24 --max-results 50"

# COMANDO 2.1: Codex primera tanda (4)
run_or_exit "COMANDO 2.1: Codex primera tanda (4)" 2 "$CODEX_BIN exec \"Execute @agent/codex.md. Run only this batch and stop after completing 4 pending newsletters in summary/codex-checklist.md.\" < /dev/null"

# COMANDO 2.2: Codex segunda tanda (restantes)
run_or_exit "COMANDO 2.2: Codex segunda tanda (restantes)" 2 "$CODEX_BIN exec \"Execute @agent/codex.md. Resume using summary/codex-checklist.md and process all remaining pending newsletters until finished.\" < /dev/null"

# COMANDO 3: Summary -> HTML
run_or_exit "COMANDO 3: Summary -> HTML" 2 "$NODE_BIN scriptSummaryToArticle.js --output agent/articlesHtml.md"

# COMANDO 4: Cursor cierre
run_or_exit "COMANDO 4: Cursor cierre" 2 "prompt=\"\$(< './agent/cursorPrompt.mdc')\"; $CURSOR_AGENT_BIN -p --trust --force --workspace '/home/Jos/Desktop/newsletters' \"\$prompt\""

log "Proceso terminado correctamente."