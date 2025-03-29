-- Users Table
IF OBJECT_ID('dotdashacademy.dbo.users', 'U') IS NOT NULL 
    DROP TABLE dotdashacademy.dbo.users;
GO

CREATE TABLE dotdashacademy.dbo.users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    -- email VARCHAR(100) NULL UNIQUE, -- Current Not in use (PDPA Restrictions)
    date_created DATETIME2 DEFAULT GETDATE(),
    last_login DATETIME2 NULL,
    login_streak INT DEFAULT 0,
    call_sign VARCHAR(255),
    password_last_change DATETIME2 DEFAULT GETDATE()
);
GO


-- Lessons Table
IF OBJECT_ID('dotdashacademy.dbo.lessons', 'U') IS NOT NULL 
    DROP TABLE dotdashacademy.dbo.lessons;
GO

CREATE TABLE dotdashacademy.dbo.lessons (
    lesson_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE
);
GO

-- Sub Lessons Table
IF OBJECT_ID('dotdashacademy.dbo.sub_lessons', 'U') IS NOT NULL 
    DROP TABLE dotdashacademy.dbo.sub_lessons;
GO

CREATE TABLE dotdashacademy.dbo.sub_lessons (
    sublesson_id INT IDENTITY(1,1) PRIMARY KEY,
    lesson_id INT NOT NULL,
    wpm INT NOT NULL,
    FOREIGN KEY (lesson_id) REFERENCES dotdashacademy.dbo.lessons(lesson_id) ON DELETE CASCADE
);
GO

-- Individual Lessons Table
IF OBJECT_ID('dotdashacademy.dbo.individual_lessons', 'U') IS NOT NULL 
    DROP TABLE dotdashacademy.dbo.individual_lessons;
GO

CREATE TABLE dotdashacademy.dbo.individual_lessons (
    individual_lesson_id INT IDENTITY(1,1) PRIMARY KEY,
    sublesson_id INT NOT NULL,
    lesson_number INT NOT NULL,
    groups NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (sublesson_id) REFERENCES dotdashacademy.dbo.sub_lessons(sublesson_id) ON DELETE CASCADE
);
GO

-- User Lessons Table
IF OBJECT_ID('dotdashacademy.dbo.user_lessons', 'U') IS NOT NULL 
    DROP TABLE dotdashacademy.dbo.user_lessons;
GO

CREATE TABLE dotdashacademy.dbo.user_lessons (
    user_lesson_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    -- sublesson_id INT NOT NULL,
    individual_lesson_id INT NOT NULL,
    status VARCHAR(20) DEFAULT 'in_progress',
    FOREIGN KEY (user_id) REFERENCES dotdashacademy.dbo.users(user_id) ON DELETE CASCADE,
    -- FOREIGN KEY (sublesson_id) REFERENCES dotdashacademy.dbo.sub_lessons(sublesson_id) ON DELETE CASCADE
    FOREIGN KEY (individual_lesson_id) REFERENCES dotdashacademy.dbo.individual_lessons(individual_lesson_id) ON DELETE CASCADE
);
GO

-- User Progress Table
IF OBJECT_ID('dotdashacademy.dbo.user_progress', 'U') IS NOT NULL 
    DROP TABLE dotdashacademy.dbo.user_progress;
GO

CREATE TABLE dotdashacademy.dbo.user_progress (
    progress_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    individual_lesson_id INT NOT NULL,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_updated DATETIME2 DEFAULT GETDATE(),
    attempt_count INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES dotdashacademy.dbo.users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (individual_lesson_id) REFERENCES dotdashacademy.dbo.individual_lessons(individual_lesson_id) ON DELETE CASCADE
);
GO
