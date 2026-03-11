-- Database Schema for Laboratory Sample Management System
CREATE DATABASE IF NOT EXISTS lab_management;
USE lab_management;

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Insert Roles matching the specifications
INSERT IGNORE INTO roles (name) VALUES 
('Administrateur'), 
('Secrétaire 1'), 
('Secrétaire 2'), 
('Résidents');

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Insert admin ('admin' / 'admin123')
INSERT IGNORE INTO users (role_id, username, password, first_name, last_name) 
VALUES (1, 'admin', '$2b$10$AAx/PZmI/bQHmnh21n3aZOcQxqFNPPVdNbufyeJpOXBTLpPd.7UZW', 'System', 'Admin');

-- Teams Table (Équipes)
CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

INSERT IGNORE INTO teams (name) VALUES ('Groupe 1'), ('Groupe 2'), ('Groupe 3'), ('Groupe 4');

-- Samples Table (Prélèvements)
-- We map everything back to English table names internally but use the French columns/enums
-- Dropping old tables to recreate cleanly
DROP TABLE IF EXISTS history;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS samples;
DROP TABLE IF EXISTS patients;

CREATE TABLE samples (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference VARCHAR(50) NOT NULL UNIQUE, -- e.g. B2020
    patient_reference VARCHAR(100) NOT NULL,
    type ENUM('Biopsie', 'Cytologie', 'Pièce opératoire') NOT NULL,
    service VARCHAR(100) NOT NULL, -- e.g. Chirurgie
    date_reception DATE NOT NULL,
    nombre INT NOT NULL DEFAULT 1,
    status ENUM('En attente', 'Assigné', 'En analyse', 'Résultat prêt') DEFAULT 'En attente',
    team_id INT DEFAULT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- History Table
CREATE TABLE history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sample_id INT NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sample_id) REFERENCES samples(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
