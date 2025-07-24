-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Insert a sample user for testing
INSERT INTO users (email, password) VALUES ('admin@example.com', 'admin123')
ON DUPLICATE KEY UPDATE password = 'admin123';

-- Hero images
CREATE TABLE IF NOT EXISTS hero_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  link_button VARCHAR(255)
);

-- Histoire images
CREATE TABLE IF NOT EXISTS histoire_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  periode VARCHAR(255)
);

-- Map images (only one row allowed)
CREATE TABLE IF NOT EXISTS map_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(255) NOT NULL
);

-- Actualites (medias)
CREATE TABLE IF NOT EXISTS actualites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  periode VARCHAR(255)
); 