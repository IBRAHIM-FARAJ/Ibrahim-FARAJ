USE lab_management;

-- Insert a Doctor (role_id 4)
INSERT IGNORE INTO users (role_id, username, password, first_name, last_name) 
VALUES (4, 'doctor1', '$2b$10$AAx/PZmI/bQHmnh21n3aZOcQxqFNPPVdNbufyeJpOXBTLpPd.7UZW', 'Sarah', 'Connor');

-- Insert a Patient
INSERT IGNORE INTO patients (first_name, last_name, birth_date, gender) 
VALUES ('John', 'Doe', '1985-06-15', 'Male');

-- Insert a Sample for the patient (status defaults to Received)
INSERT IGNORE INTO samples (code, date_received, patient_id, created_by, status) 
VALUES ('SMP-DUMMY-123', '2023-10-25', 1, 1, 'Received');
