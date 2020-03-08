USE employee_db;
-- Adding starter departments
INSERT INTO department (id, name)
VALUES (1, 'Accounting');
INSERT INTO department (id, name)
VALUES (2, 'Human Resources');
INSERT INTO department (id, name)
VALUES (3, 'Information Technology');

-- Adding Starter Roles
INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Accountant', 50000, 1);
INSERT INTO role (id, title, salary, department_id)
VALUES (2, 'Account Manager', 70000, 1);
INSERT INTO role (id, title, salary, department_id)
VALUES (3, 'Benefits Advisor', 50000, 2);
INSERT INTO role (id, title, salary, department_id)
VALUES (4, 'Benefits Supervisor', 70000, 2);
INSERT INTO role (id, title, salary, department_id)
VALUES (5, 'Junior Developer', 60000, 3);
INSERT INTO role (id, title, salary, department_id)
VALUES (6, 'VP of IT', 100000, 3);
INSERT INTO role (id, title, salary, department_id)
VALUES (7, 'Senior Developer', 80000, 3);

-- Adding Starter Employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Matt', 'Benson', 5, 2);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, 'Jim', 'Murphy', 6, null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, 'Kim', 'Arent', 7, 2);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, 'Mike', 'Alton', 1, 5);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (5, 'Erin', 'Alford', 2, null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (6, 'Jon', 'Huchison', 3, 7);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (7, 'Dennis', 'Goldenberg', 4, null);