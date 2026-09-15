# GestBib - Application Microservices de Gestion de Bibliothèque

Projet complet de gestion de bibliothèque basé sur une architecture Microservices (Node.js, Express, MySQL) et Frontend (React JS).

## Structure du projet

- `gestbib-user-service/`: Microservice de gestion des abonnés et abonnements.
- `gestbib-catalog-service/`: Microservice de gestion du catalogue (livres, éditeurs) et nettoyage automatique.
- `gestbib-borrow-service/`: Microservice de gestion des emprunts et du calcul des pénalités.
- `gestbib-frontend/`: Application frontend en React JS.
- `database/`: Scripts SQL pour initialiser les bases de données MySQL.

## Démarrage rapide

1. **Bases de données MySQL :**
   Exécuter les scripts dans `database/init.sql` sur votre serveur MySQL (ou via PhpMyAdmin/MySQL Workbench).

2. **Microservices (Services Backend) :**
   Pour chacun des services (`gestbib-user-service`, `gestbib-catalog-service`, `gestbib-borrow-service`) :
   ```bash
   cd <nom-du-service>
   npm install
   npm start
   ```

3. **Frontend (React JS) :**
   ```bash
   cd gestbib-frontend
   npm install
   npm start
   ```
