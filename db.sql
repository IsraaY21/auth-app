CREATE DATABASE auth_app;

USE auth_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_attempts (
    rate_key CHAR(64) PRIMARY KEY,
    failures INT NOT NULL DEFAULT 0,
    lock_until DATETIME NULL
);