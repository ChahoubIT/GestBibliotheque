# Guide de Déploiement Kubernetes - GestBib

Ce dossier contient l'ensemble des manifestes Kubernetes (`yaml`) permettant de déployer la plateforme **GestBib** sur un cluster Minikube, MicroK8s, AKS, EKS ou GKE.

## 📁 Structure des fichiers YAML

- **`namespace.yaml`** : Création du Namespace isole `gestbib`.
- **`mysql-deployment.yaml`** : Base de données MySQL + Service K8s.
- **`auth-deployment.yaml`** : Microservice Authentification (2 répliques) + Service K8s.
- **`catalog-deployment.yaml`** : Microservice Catalogue (2 répliques) + Service K8s.
- **`borrow-deployment.yaml`** : Microservice Emprunts (2 répliques) + Service K8s.
- **`frontend-deployment.yaml`** : Application Frontend Web exposée via NodePort (Port `30080`).

---

## 🚀 Déploiement étape par étape

### 1. Appliquer tous les manifestes dans le cluster
```bash
kubectl apply -f k8s/
```

### 2. Vérifier l'état du Namespace et des Ressources
```bash
# Vérifier tous les pods et services dans le namespace gestbib
kubectl get all -n gestbib
```

### 3. Accéder au Frontend Web
- **Sous Minikube** :
  ```bash
  minikube service frontend -n gestbib
  ```
- **Via l'IP du Node (Port Fixe NodePort)** :
  Ouvrez votre navigateur sur `http://<NODE-IP>:30080`

### 4. Supprimer le déploiement
```bash
kubectl delete -f k8s/
```
