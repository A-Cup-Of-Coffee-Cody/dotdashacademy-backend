-- Temporarily enable IDENTITY_INSERT for the lessons table
SET IDENTITY_INSERT [dbo].individual_lessons ON;

-- Sample data (you should adapt this part to your lesson data)
DECLARE @letters TABLE (
    title VARCHAR(50),
    sublesson_start INT,
    sublesson_end INT
);

-- Insert each set of letters with corresponding sublesson IDs
INSERT INTO @letters (title, sublesson_start, sublesson_end)
VALUES
    ('PXJWG', 1, 5),
    ('EISHT', 6, 10),
    ('AUVND', 11, 15),
    ('MORLK', 16, 20),
    ('QBCYZ', 21, 25),
    ('EISHTAUVNDFMORLKPXJWGQBCYZ', 26, 30);

-- Loop through each row of data
DECLARE @i INT = 1;
DECLARE @group_count INT = 25;  -- Number of groups to generate per title
DECLARE @group_size INT = 5;    -- Size of each group
DECLARE @lesson_number INT;     -- Reset lesson number for each title
DECLARE @title VARCHAR(50);
DECLARE @sublesson_start INT;
DECLARE @sublesson_end INT;
DECLARE @sublesson_id INT;

-- Iterate over each set of letters
DECLARE letter_cursor CURSOR FOR
SELECT title, sublesson_start, sublesson_end
FROM @letters;

OPEN letter_cursor;

FETCH NEXT FROM letter_cursor INTO @title, @sublesson_start, @sublesson_end;

WHILE @@FETCH_STATUS = 0
BEGIN
    -- Reset lesson_number to 1 for each new title
    SET @lesson_number = 1;

    -- Loop to generate groups for the current title
    DECLARE @j INT = 1;
    WHILE @j <= @group_count
    BEGIN
        -- Generate 25 groups of 5 random letters from the title
        DECLARE @groups NVARCHAR(MAX) = '[';
        DECLARE @k INT = 1;
        
        WHILE @k <= @group_count
        BEGIN
            -- Randomly shuffle the letters of the title to create a group
            DECLARE @group NVARCHAR(5) = '';
            DECLARE @l INT = 1;
            
            WHILE @l <= @group_size
            BEGIN
                -- Get a random letter from the title
                SET @group = @group + SUBSTRING(@title, ABS(CHECKSUM(NEWID()) % LEN(@title)) + 1, 1);
                SET @l = @l + 1;
            END
            
            -- Append the group to the groups list
            SET @groups = @groups + '"' + @group + '"';
            
            -- Add a comma if it's not the last group
            IF @k < @group_count
                SET @groups = @groups + ', ';
            
            SET @k = @k + 1;
        END

        -- Close the array
        SET @groups = @groups + ']';

        -- Insert into the individual_lessons table
        INSERT INTO individual_lessons (individual_lesson_id, sublesson_id, lesson_number, groups)
        VALUES (@i, @sublesson_start, @lesson_number, @groups);

        -- Increment the sublesson_id and reset it if it exceeds the sublesson_end
        SET @sublesson_id = @sublesson_start;
        SET @lesson_number = @lesson_number + 1;  -- Increment lesson_number for each group
        
        IF @sublesson_start < @sublesson_end
        BEGIN
            SET @sublesson_start = @sublesson_start + 1;
        END

        SET @i = @i + 1;
        SET @j = @j + 1;
    END

    FETCH NEXT FROM letter_cursor INTO @title, @sublesson_start, @sublesson_end;
END;

CLOSE letter_cursor;
DEALLOCATE letter_cursor;

-- Optionally, retrieve the inserted rows for confirmation
SELECT * FROM individual_lessons;

-- Disable IDENTITY_INSERT after the insert
SET IDENTITY_INSERT [dbo].individual_lessons OFF;