-- releases/001_initial_setup.sql

-- Drop tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS offer_letter;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  f_name VARCHAR(255) NOT NULL,
  l_name VARCHAR(255) NOT NULL,
  jid text NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  otp INT(8),
  is_verified tinyint(1) DEFAULT 0,
  otp_verified tinyint(1) DEFAULT 0,
  date_of_birth DATE,  
  gender ENUM('Male', 'Female', 'Transgender') DEFAULT 'Male',  
  profile TEXT,  
  role VARCHAR(255) DEFAULT 'user', 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Create documents table
CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULl,
  doc_name VARCHAR(255),
  doc_type VARCHAR(255) NOT NULL,
  doc_path VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE offer_letter (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULl,
  offer_letter_path longtext,
  is_accepted tinyint(1) DEFAULT 0, -- 0 means pending , 1 means accepted ,2 means rejected
  is_viewed INT DEFAULT 0
);




INSERT INTO `knowledg_Demo`.`admins` (`user_name`, `password`,`email`) VALUES ('shivam.tiwari', '$2b$10$fWWD8ofHJGFifx.KuvDLwu1iy8vSlafMuTL22cz1Ka.NODaDiIvXC','iafshivam4@gmail.com');
