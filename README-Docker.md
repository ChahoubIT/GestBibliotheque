# Guide de Conteneurisation Docker - GestBib

Ce dossier contient toute la configuration **Docker** et **Docker Compose** pour orchestrer les microservices de GestBib.

## 📁 Fichiers inclus
- `docker-compose.yml` : Fichier principal d'orchestration de tous les services (MySQL, Auth, Catalog, Borrow, Frontend).
- `gestbib-auth-service/Dockerfile` : Fichier Dockerfile pour le microservice Authentification.
- `Dockerfile.node-template` : Modèle de Dockerfile à placer dans vos autres microservices Node.js si besoin.

---

## 🚀 Commandes d'exécution

### 1. Démarrer toute la plateforme GestBib
À la racine de votre projet :
```bash
docker-compose up -d --build
```

### 2. Vérifier l'état des conteneurs
```bash
docker-compose ps
```

### 3. Consulter les logs d'un microservice
```bash
# Pour le microservice authentification
docker-compose logs -f auth-service

# Pour tous les microservices
docker-compose logs -f
```

### 4. Arrêter l'ensemble de la plateforme
```bash
docker-compose down
```

Pour supprimer également les données stockées dans le volume MySQL :
```bash
docker-compose down -v
```

---

## 🌐 Ports exposés

| Service | Host Port | Container Port | URL |
| :--- | :--- | :--- | :--- |
| **MySQL DB** | `3306` | `3306` | `localhost:3306` |
| **Auth Service** | `3000` | `3000` | `http://localhost:3000` |
| **Catalog Service** | `3001` | `3001` | `http://localhost:3001` |
| **Borrow Service** | `3002` | `3002` | `http://localhost:3002` |
| **Frontend Web** | `8080` | `80` | `http://localhost:8080` |
