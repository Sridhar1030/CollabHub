#!/usr/bin/env bash
# setup-k8s-dev.sh
# Exposes the k8s backend NodePort via minikube tunnel and
# writes VITE_API_URL to .env.local so `npm run dev` hits the pods.
#
# Usage:  bash setup-k8s-dev.sh
#         bash setup-k8s-dev.sh --stop   (kill tunnel and reset .env.local)

set -euo pipefail

ENV_FILE="$(dirname "$0")/.env.local"

# ── Stop mode ────────────────────────────────────────────────────────────────
if [[ "${1:-}" == "--stop" ]]; then
  echo "🛑 Killing minikube service tunnel..."
  pkill -f "minikube service collabhub-backend" 2>/dev/null || true
  echo "VITE_API_URL=http://localhost:5000" > "$ENV_FILE"
  echo "✅ Reverted to localhost:5000"
  exit 0
fi

# ── Make sure minikube context is active ─────────────────────────────────────
echo "🔧 Switching kubectl context to minikube..."
kubectl config use-context minikube

# ── Check the service exists ─────────────────────────────────────────────────
if ! kubectl get svc collabhub-backend &>/dev/null; then
  echo "❌ Service 'collabhub-backend' not found."
  echo "   Run: kubectl apply -f backend/k8s/backend-deployment.yaml"
  exit 1
fi

# ── Start minikube service tunnel in background ───────────────────────────────
echo "🚇 Starting minikube service tunnel (NodePort 30500)..."
# `minikube service --url` prints the URL then blocks.  Capture the URL first.
TUNNEL_OUT=$(mktemp)
minikube service collabhub-backend --url > "$TUNNEL_OUT" &
TUNNEL_PID=$!

# Wait up to 15 s for the URL to appear
for i in $(seq 1 30); do
  URL=$(cat "$TUNNEL_OUT" 2>/dev/null | head -1 | tr -d '[:space:]')
  [[ "$URL" == http* ]] && break
  sleep 0.5
done

if [[ "$URL" != http* ]]; then
  echo "❌ Could not get service URL. Is minikube running?"
  kill "$TUNNEL_PID" 2>/dev/null || true
  exit 1
fi

echo "✅ Backend reachable at: $URL"
echo "VITE_API_URL=$URL" > "$ENV_FILE"
echo "📝 Written to .env.local → VITE_API_URL=$URL"
echo ""
echo "🚀 Starting Vite dev server..."
echo "   (press Ctrl-C to stop both the tunnel and the dev server)"
echo ""

# Trap Ctrl-C to kill the tunnel too
cleanup() {
  echo ""
  echo "🛑 Shutting down tunnel (PID $TUNNEL_PID)..."
  kill "$TUNNEL_PID" 2>/dev/null || true
  rm -f "$TUNNEL_OUT"
  echo "✅ Done"
}
trap cleanup EXIT INT TERM

npm run dev
