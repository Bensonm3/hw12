-- Schema
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
    id int NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id int,
    manager_id int NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id int,
    PRIMARY KEY (id)
);
