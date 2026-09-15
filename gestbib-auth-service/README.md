# GestBib - Microservice Authentification (auth-service)

Microservice d'authentification autonome développé avec **Node.js, Express, JWT et MySQL** pour la plateforme GestBib.

## Fonctionnalités
- **Sign Up (`POST /api/auth/signup`)** : Inscription d'un utilisateur avec hachage de mot de passe via `bcryptjs`.
- **Sign In (`POST /api/auth/signin`)** : Authentification et génération de jeton JWT (valide 24h).
- **Verify Token (`GET /api/auth/verify`)** : Route de vérification des jetons pour la communication inter-microservices.

## Structure du projet

```
gestbib-auth-service/
├── schema.sql         # Script d'initialisation de la base de données MySQL
├── .env.example       # Modèle de variables d'environnement
├── package.json       # Dépendances Node.js
├── index.js           # Point d'entrée du serveur Express
└── README.md          # Documentation du microservice
```

## Démarrage rapide

### 1. Configuration de la Base de Données MySQL
Exécutez le script SQL présent dans `schema.sql` sur votre serveur MySQL :
```bash
mysql -u root -p < schema.sql
```

### 2. Configuration des variables d'environnement
Créez un fichier `.env` basé sur `.env.example` :
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=gestbib_auth
JWT_SECRET=gestbib_secret_key_2026
```

### 3. Installation et Lancement
```bash
# Installer les dépendances
npm install

# Lancer le microservice
npm start
```
