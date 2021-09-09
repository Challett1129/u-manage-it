INSERT INTO departments (department_name) 
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO roles (title, salary, department_id)
VALUES 
('Sales Lead', 100000, 1), 
('Salesperson', 80000, 1), 
('Lead Engineer', 150000, 2),
('Software Engineer', 125000, 2),
('Accountant Team Lead', 90000, 3),
('Accountant', 60000, 3),
('Legal Team Lead', 250001, 4),
('Lawyer', 190000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES 
('Collin', 'Hallett', 4, 3),
('Michael', 'Quinones', 7, NULL),
('Chris', 'Gemperle', 3, NULL), 
('Jeb', 'Breadmaker', 1, NULL),
('Thomas', 'Chow', 2, 4),
('Alexis', 'Mendoza', 8, 2),
('Logan', 'Regan', 2, 4),
('Trinity', 'Carnes', 5, NULL),
('Crispin', 'Valadez', 6, 8);
