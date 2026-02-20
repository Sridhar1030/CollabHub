import axios from 'axios';

// ------------------------------------------------------------
// Central axios instance — reads VITE_API_URL from env
//
// For local dev (no k8s):   VITE_API_URL=http://localhost:5000
// For minikube k8s:          VITE_API_URL=http://127.0.0.1:30500
//                             (set automatically by setup-k8s-dev.sh)
// ------------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// ------------------------------------------------------------------
// Response interceptor — reads X-Pod-Name from every response header
// and broadcasts a custom DOM event so PodIndicator can pick it up.
// The header is set by the backend using the k8s Downward API
// (POD_NAME env var).  In local dev it falls back to "local-<pid>".
// ------------------------------------------------------------------
api.interceptors.response.use(
  (response) => {
    const podName = response.headers['x-pod-name'];
    if (podName) {
      window.dispatchEvent(
        new CustomEvent('pod-name-changed', { detail: podName })
      );
    }
    return response;
  },
  (error) => {
    // On network error we still want to signal a pod failure
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      window.dispatchEvent(new CustomEvent('pod-name-changed', { detail: null }));
    }
    return Promise.reject(error);
  }
);

export { API_URL };
export default api;
