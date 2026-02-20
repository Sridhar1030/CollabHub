#!/usr/bin/env bash
# =============================================================================
# auto-kill-pods.sh
# Watches pods via Prometheus and kills them when they breach thresholds.
#
# Thresholds (tweak via env vars):
#   CPU_THRESHOLD_PERCENT  – kill pod when CPU usage > this % of its limit
#   MEM_THRESHOLD_PERCENT  – kill pod when memory usage > this % of its limit
#   RESTART_THRESHOLD      – kill pod when restart count exceeds this value
#   CHECK_INTERVAL_SECS    – how often to poll (default 30s)
#   NAMESPACE              – kubernetes namespace to watch (default: default)
#   PROMETHEUS_URL         – Prometheus service URL
#   DRY_RUN                – set to "true" to log only, no actual kills
# =============================================================================
set -euo pipefail

CPU_THRESHOLD_PERCENT="${CPU_THRESHOLD_PERCENT:-80}"
MEM_THRESHOLD_PERCENT="${MEM_THRESHOLD_PERCENT:-80}"
RESTART_THRESHOLD="${RESTART_THRESHOLD:-5}"
CHECK_INTERVAL_SECS="${CHECK_INTERVAL_SECS:-30}"
NAMESPACE="${NAMESPACE:-default}"
PROMETHEUS_URL="${PROMETHEUS_URL:-http://localhost:9090}"
DRY_RUN="${DRY_RUN:-false}"

RED='\033[0;31m'
YEL='\033[1;33m'
GRN='\033[0;32m'
NC='\033[0m'

log()  { echo -e "${GRN}[$(date '+%H:%M:%S')] $*${NC}"; }
warn() { echo -e "${YEL}[$(date '+%H:%M:%S')] WARN: $*${NC}"; }
kill_pod() {
  local pod="$1" reason="$2"
  if [[ "$DRY_RUN" == "true" ]]; then
    warn "DRY-RUN – would delete pod '$pod' | reason: $reason"
    return
  fi
  echo -e "${RED}[$(date '+%H:%M:%S')] KILLING pod '$pod' | reason: $reason${NC}"
  kubectl delete pod "$pod" -n "$NAMESPACE" --grace-period=0 --force 2>/dev/null || true
}

# Query Prometheus and return numeric result (empty string on error)
prom_query() {
  local query="$1"
  curl -sf --max-time 5 \
    "${PROMETHEUS_URL}/api/v1/query" \
    --data-urlencode "query=${query}" \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
results = data.get('data',{}).get('result',[])
for r in results:
    print(r['metric'].get('pod',''), r['value'][1])
" 2>/dev/null || true
}

check_restarts() {
  log "--- Checking restart counts ---"
  kubectl get pods -n "$NAMESPACE" \
    --no-headers \
    -o custom-columns="NAME:.metadata.name,RESTARTS:.status.containerStatuses[0].restartCount,STATUS:.status.phase" \
  | while read -r pod restarts status; do
      [[ -z "$pod" || "$pod" == "<none>" ]] && continue
      restarts="${restarts:-0}"
      if (( restarts > RESTART_THRESHOLD )); then
        kill_pod "$pod" "restart count ${restarts} > threshold ${RESTART_THRESHOLD}"
      else
        log "  $pod  restarts=${restarts}  status=${status}  ✓"
      fi
    done
}

check_cpu() {
  log "--- Checking CPU usage (threshold ${CPU_THRESHOLD_PERCENT}%) ---"
  # container_cpu_usage_seconds_total rate, compared against requests
  local query='sum by (pod) (rate(container_cpu_usage_seconds_total{namespace="'"$NAMESPACE"'", container!=""}[2m])) / sum by (pod) (kube_pod_container_resource_limits{namespace="'"$NAMESPACE"'", resource="cpu"}) * 100'
  prom_query "$query" | while read -r pod pct; do
    [[ -z "$pod" ]] && continue
    pct_int=$(printf "%.0f" "$pct" 2>/dev/null || echo 0)
    if (( pct_int > CPU_THRESHOLD_PERCENT )); then
      kill_pod "$pod" "CPU usage ${pct_int}% > threshold ${CPU_THRESHOLD_PERCENT}%"
    else
      log "  $pod  cpu=${pct_int}%  ✓"
    fi
  done
}

check_memory() {
  log "--- Checking memory usage (threshold ${MEM_THRESHOLD_PERCENT}%) ---"
  local query='sum by (pod) (container_memory_working_set_bytes{namespace="'"$NAMESPACE"'", container!=""}) / sum by (pod) (kube_pod_container_resource_limits{namespace="'"$NAMESPACE"'", resource="memory"}) * 100'
  prom_query "$query" | while read -r pod pct; do
    [[ -z "$pod" ]] && continue
    pct_int=$(printf "%.0f" "$pct" 2>/dev/null || echo 0)
    if (( pct_int > MEM_THRESHOLD_PERCENT )); then
      kill_pod "$pod" "memory usage ${pct_int}% > threshold ${MEM_THRESHOLD_PERCENT}%"
    else
      log "  $pod  mem=${pct_int}%  ✓"
    fi
  done
}

# ── entrypoint ──────────────────────────────────────────────────────────────
log "Starting pod watchdog"
log "  namespace          : $NAMESPACE"
log "  prometheus         : $PROMETHEUS_URL"
log "  cpu  threshold     : ${CPU_THRESHOLD_PERCENT}%"
log "  mem  threshold     : ${MEM_THRESHOLD_PERCENT}%"
log "  restart threshold  : $RESTART_THRESHOLD"
log "  check interval     : ${CHECK_INTERVAL_SECS}s"
log "  dry-run            : $DRY_RUN"

while true; do
  echo ""
  log "════════════════════════════════════"
  check_restarts
  check_cpu
  check_memory
  log "Next check in ${CHECK_INTERVAL_SECS}s..."
  sleep "$CHECK_INTERVAL_SECS"
done
