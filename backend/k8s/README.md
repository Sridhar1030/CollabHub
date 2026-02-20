# Deploy backend to minikube

Prerequisites:
- `minikube` and `kubectl` installed and running.

From the repository root run:

1. Start minikube (if not running):

```bash
minikube start
```

2. Build the backend image into minikube's registry (recommended):

```bash
# from repo root
minikube image build -t collabhub-backend:latest backend
```

Alternative (use Docker daemon inside minikube):

```bash
eval "$(minikube -p minikube docker-env)"
docker build -t collabhub-backend:latest backend
```

3. Apply manifests:

```bash
kubectl apply -f backend/k8s/mongo-pvc.yaml
kubectl apply -f backend/k8s/mongo-deployment.yaml
kubectl apply -f backend/k8s/backend-deployment.yaml
```

4. Forward a local port to access the backend:

```bash
kubectl port-forward svc/collabhub-backend 5000:5000
# then open http://localhost:5000
```

5. Check pods and logs:

```bash
kubectl get pods -l app=collabhub-backend
kubectl logs -l app=collabhub-backend -f
kubectl get pods -l app=mongo
kubectl logs deployment/mongo
```

Notes:
- The manifests expect MongoDB reachable at `mongodb://mongo:27017/collabhub`.
- For production you should provide secrets for any credentials and a stronger storageClass/PVC strategy.

Autoscaling & Ingress (optional):
- To enable the Horizontal Pod Autoscaler, ensure the cluster has the metrics-server running (minikube addon):

```bash
minikube addons enable metrics-server
kubectl apply -f backend/k8s/backend-hpa.yaml
```

- To use Ingress with a hostname, enable the ingress addon and apply the Ingress manifest. Add a host mapping to `/etc/hosts` (requires sudo):

```bash
minikube addons enable ingress
kubectl apply -f backend/k8s/backend-ingress.yaml
# add to /etc/hosts: 127.0.0.1 collabhub.local
```

Notes:
- HPA uses CPU utilization target; the deployment includes `resources.requests` and `limits` to make scaling decisions possible.
- Ingress requires the `ingress` addon (minikube) or an external ingress controller. For local testing you can also use `kubectl port-forward`.
