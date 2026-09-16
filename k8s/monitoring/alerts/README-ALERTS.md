# Scripts d'Alerting Prometheus & Alertmanager - GestBib

Ce dossier intègre les scripts PromQL et les manifestes de notification pour le monitoring de la plateforme.

## 📁 Fichiers inclus

- `alert.rules.yml` : Contient la règle PromQL composite (CPU > 80% ET RAM > 85%).
- `alertmanager-config.yaml` : ConfigMap d'Alertmanager pour l'envoi d'e-mails (SMTP).
- `alertmanager-deployment.yaml` : Deployment et Service Kubernetes pour Alertmanager.

---

## 🚀 Déploiement

### 1. Créer le ConfigMap des règles d'alerte pour Prometheus
```bash
kubectl create configmap prometheus-rules --from-file=alert.rules.yml -n gestbib
```

### 2. Déployer Alertmanager
```bash
kubectl apply -f alertmanager-config.yaml
kubectl apply -f alertmanager-deployment.yaml
```
