USE lab_management;

-- We use the same encrypted password 'admin123' for convenience: 
-- $2b$10$AAx/PZmI/bQHmnh21n3aZOcQxqFNPPVdNbufyeJpOXBTLpPd.7UZW

-- Secrétaire 1 (Role ID 2 - Réception)
INSERT IGNORE INTO users (role_id, username, password, first_name, last_name) 
VALUES (2, 'sec1', '$2b$10$AAx/PZmI/bQHmnh21n3aZOcQxqFNPPVdNbufyeJpOXBTLpPd.7UZW', 'Marie', 'Secrétaire 1');

-- Secrétaire 2 (Role ID 3 - Assignation)
INSERT IGNORE INTO users (role_id, username, password, first_name, last_name) 
VALUES (3, 'sec2', '$2b$10$AAx/PZmI/bQHmnh21n3aZOcQxqFNPPVdNbufyeJpOXBTLpPd.7UZW', 'Sophie', 'Secrétaire 2');

-- Résident (Role ID 4 - Consultation)
INSERT IGNORE INTO users (role_id, username, password, first_name, last_name) 
VALUES (4, 'res1', '$2b$10$AAx/PZmI/bQHmnh21n3aZOcQxqFNPPVdNbufyeJpOXBTLpPd.7UZW', 'Dr.', 'Résident');
