-- Création de la base de données pour le microservice Auth
CREATE DATABASE IF NOT EXISTS gestbib_auth;
USE gestbib_auth;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'LIBRARIAN', 'ADMIN') DEFAULT 'USER',
    subscriber_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
