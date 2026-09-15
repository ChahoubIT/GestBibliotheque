-- Microservice 1 : gestbib_user (Abonnés & Abonnements)
CREATE DATABASE IF NOT EXISTS gestbib_user;
USE gestbib_user;

CREATE TABLE IF NOT EXISTS subscriber (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lastname VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscription (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subscriber_id INT NOT NULL,
    year INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    is_faithful_discount TINYINT(1) DEFAULT 0,
    created_at DATE NOT NULL,
    FOREIGN KEY (subscriber_id) REFERENCES subscriber(id)
);

-- Microservice 2 : gestbib_catalog (Livres & Éditeurs)
CREATE DATABASE IF NOT EXISTS gestbib_catalog;
USE gestbib_catalog;

CREATE TABLE IF NOT EXISTS publisher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS book (
    isbn VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    pages_count INT NOT NULL,
    status ENUM('AVAILABLE', 'BORROWED', 'REMOVED') DEFAULT 'AVAILABLE',
    last_borrowed_at DATE
);

CREATE TABLE IF NOT EXISTS book_publisher (
    book_isbn VARCHAR(20),
    publisher_id INT,
    PRIMARY KEY(book_isbn, publisher_id),
    FOREIGN KEY (book_isbn) REFERENCES book(isbn),
    FOREIGN KEY (publisher_id) REFERENCES publisher(id)
);

-- Microservice 3 : gestbib_borrow (Emprunts & Pénalités)
CREATE DATABASE IF NOT EXISTS gestbib_borrow;
USE gestbib_borrow;

CREATE TABLE IF NOT EXISTS borrow (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subscriber_id INT NOT NULL,
    book_isbn VARCHAR(20) NOT NULL,
    borrow_date DATE NOT NULL,
    expected_return_date DATE NOT NULL,
    effective_return_date DATE,
    lateness_penalty DECIMAL(10, 2) DEFAULT 0.00,
    wear_penalty DECIMAL(10, 2) DEFAULT 0.00,
    total_penalty DECIMAL(10, 2) DEFAULT 0.00,
    wear_status ENUM('OK', 'TORN_WEAR', 'DESTROYED') DEFAULT 'OK'
);
