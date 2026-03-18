-- ================================================
-- Master Data Management System
-- Database Setup Script
-- ================================================
-- Author  : Chamod Mihiranga
-- Version : 1.0
-- Date    : 2024
-- ================================================

-- Create and select database
CREATE DATABASE IF NOT EXISTS mdm_assignment_db;
USE mdm_assignment_db;

-- ------------------------------------------------
-- Table: users
-- Stores system user accounts
-- ------------------------------------------------
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------
-- Table: departments
-- Stores master data for departments
-- ------------------------------------------------
DROP TABLE IF EXISTS departments;
CREATE TABLE departments (
    id          BIGINT        AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------
-- Default admin user
-- Username : admin
-- Password : admin123 (BCrypt hashed)
-- ------------------------------------------------
INSERT INTO users (username, password, role) VALUES (
    'admin',
    '$2a$10$MHn7fw/HimR7jwsQDXJK9u4KcRYtXZYMdOHAPpxKq1OZATMnTj51a',
    'USER'
);

-- ------------------------------------------------
-- Sample department records
-- ------------------------------------------------
INSERT INTO departments (name, description) VALUES
    ('Engineering',     'Software and hardware engineering team'),
    ('Human Resources', 'HR and recruitment department'),
    ('Finance',         'Accounting and financial operations');

-- ------------------------------------------------
-- Verify data
-- ------------------------------------------------
SELECT 'Users table:' AS '';
SELECT id, username, role, created_at FROM users;

SELECT 'Departments table:' AS '';
SELECT id, name, description, created_at FROM departments;