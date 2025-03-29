-- Drop and create database
DROP DATABASE IF EXISTS DotDashAcademy;
CREATE DATABASE DotDashAcademy;
USE DotDashAcademy;

-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,               
    password_hash VARCHAR(255) NOT NULL,                
    -- email VARCHAR(100) NOT NULL UNIQUE,            -- Current Not in use (PDPA Restrictions)
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    last_login TIMESTAMP DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,  
    login_streak INT DEFAULT 0,                         
    call_sign VARCHAR(255),                             
    password_last_change DATETIME DEFAULT CURRENT_TIMESTAMP  
);

-- Lessons Table (Categories)
CREATE TABLE lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE  -- "ABCDE", "FGHIJ"
);

-- Sub Lessons Table (WPM groupings)
CREATE TABLE sub_lessons (
    sublesson_id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_id INT NOT NULL,  
    wpm INT NOT NULL,  -- "8 WPM", "12 WPM"
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);

-- Individual Lessons Table (Tests within sub-lessons)
CREATE TABLE individual_lessons (
    individual_lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    sublesson_id INT NOT NULL,  
    lesson_number INT NOT NULL, -- "Lesson 1", "Lesson 2", etc.
	`groups` JSON  NOT NULL,  -- Stores the actual Morse code content
    FOREIGN KEY (sublesson_id) REFERENCES sub_lessons(sublesson_id) ON DELETE CASCADE
);

-- User Lessons Table (Tracks user enrollment at sub-lesson level)
CREATE TABLE user_lessons (
    user_lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sublesson_id INT NOT NULL,
    status ENUM('in_progress', 'completed') DEFAULT 'in_progress',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (sublesson_id) REFERENCES sub_lessons(sublesson_id) ON DELETE CASCADE
);

-- User Progress Table (Tracks progress for individual lessons)
CREATE TABLE user_progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    individual_lesson_id INT NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,     
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
    attempt_count INT DEFAULT 1,  -- Tracks how many times user attempted a lesson
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (individual_lesson_id) REFERENCES individual_lessons(individual_lesson_id) ON DELETE CASCADE
);
