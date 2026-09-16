# Integration du Monitoring (Prometheus & Grafana) - GestBib

Ce dossier intègre l'infrastructure de métriques et de supervision pour la plateforme microservices **GestBib**.

## 📊 Composants inclus

1. **`prometheus-configmap.yaml`** : Configuration du 'scraping' des métriques des microservices (`auth-service`, `catalog-service`, `borrow-service`).
2. **`prometheus-deployment.yaml`** : Déploiement de serveur Prometheus + Service `NodePort` (`30090`).
3. **`grafana-datasource-configmap.yaml`** : Liaison automatique de Prometheus comme source de données dans Grafana.
4. **`grafana-deployment.yaml`** : Déploiement du tableau de bord Grafana + Service `NodePort` (`30091`).

---

## 🚀 Étape 1 : Ajouter `prom-client` aux Microservices Node.js

Dans chacun de vos microservices (`auth-service`, `catalog-service`, `borrow-service`), installez le package d'export de métriques :

```bash
npm install prom-client
```

Exposez l'endpoint `/metrics` en suivant le fichier d'exemple `metrics-example.js`.

---

## 🚀 Étape 2 : Déployer la stack de Monitoring sur Kubernetes

Appliquez les fichiers de configuration Kubernetes :

```bash
kubectl apply -f k8s/monitoring/
```

Vérifiez le bon fonctionnement des Pods :
```bash
kubectl get pods -n gestbib
```

---

## 🌐 Étape 3 : Accès aux interfaces Web

| Service | Port NodePort | URL par défaut | Identifiants |
| :--- | :--- | :--- | :--- |
| **Prometheus** | `30090` | `http://<NODE-IP>:30090` | Aucun |
| **Grafana** | `30091` | `http://<NODE-IP>:30091` | `admin` / `admin` |
