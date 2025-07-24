-- Multimedia table for storing images and videos
CREATE TABLE IF NOT EXISTS multimedia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_type ENUM('image', 'video') NOT NULL DEFAULT 'image',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add some sample data
INSERT INTO multimedia (title, file_path, file_type) VALUES
('Vue aérienne du port', 'sample-port-aerial.jpg', 'image'),
('Opérations portuaires', 'sample-port-operations.mp4', 'video'),
('Terminal conteneurs', 'sample-container-terminal.jpg', 'image'); 