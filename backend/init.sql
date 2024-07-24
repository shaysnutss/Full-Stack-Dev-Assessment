CREATE DATABASE IF NOT EXISTS tasks_db;

-- Use the created database
USE tasks_db;

-- Create the tasks table if it does not exist
CREATE TABLE IF NOT EXISTS task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('low', 'medium', 'high') ,
    daysRemaining INT DEFAULT 0,
    isNew BOOLEAN DEFAULT TRUE -- Added isNew column
);

-- Insert some sample records into the tasks table
INSERT INTO task (name, description, priority, daysRemaining, isNew) VALUES
('Task 1', 'Description for Task 1', 'High', 5, TRUE),
('Task 2', 'Description for Task 2', 'Medium', 10, TRUE),
('Task 3', 'Description for Task 3', 'Low', 15, TRUE);