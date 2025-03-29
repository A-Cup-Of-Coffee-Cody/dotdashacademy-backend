const sql = require("mssql"); // Import the mssql package
const dbConfig = require("../config/dbConfig"); // Import dbConfig from external file

// Function to connect to SQL Server using connection pooling
const connectToDB = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("✅ Connected to Azure SQL Server (User)");
    return pool; // Return the connection pool for reuse
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err; // Propagate error to handle connection issues
  }
};

// Execute queries using SQL Server
module.exports = {
  getUserLessons: async (userId) => {
    const pool = await connectToDB(); // Ensure connection
    try {
      const result = await pool.request().input("userId", sql.Int, userId)
        .query(`
          SELECT ul.*, l.title, sl.wpm, il.lesson_number, il.groups
          FROM user_lessons ul
          JOIN individual_lessons il ON ul.individual_lesson_id = il.individual_lesson_id
          JOIN sub_lessons sl ON il.sublesson_id = sl.sublesson_id
          JOIN lessons l ON sl.lesson_id = l.lesson_id
          WHERE ul.user_id = @userId;
        `);
      return result.recordset; // Return the query result
    } catch (error) {
      console.error("Error in getUserLessons:", error);
    } finally {
      pool.close(); // Close the connection pool after the query
    }
  },

  getAllLessons: async () => {
    const pool = await connectToDB(); // Ensure connection
    try {
      const result = await pool.request().query("SELECT * FROM lessons");
      return result.recordset; // Return the query result
    } catch (error) {
      console.error("Error in getAllLessons:", error);
    } finally {
      pool.close(); // Close the connection pool after the query
    }
  },

  getSubLessons: async (lessonId) => {
    const pool = await connectToDB(); // Ensure connection
    try {
      const result = await pool.request().input("lessonId", sql.Int, lessonId)
        .query(`
          SELECT sl.sublesson_id, l.title AS lesson_title, sl.wpm, il.groups, il.lesson_number, il.individual_lesson_id
          FROM sub_lessons sl
          JOIN lessons l ON sl.lesson_id = l.lesson_id
          JOIN individual_lessons il ON sl.sublesson_id = il.sublesson_id
          WHERE l.lesson_id = @lessonId
          ORDER BY sl.wpm ASC;
        `);
      return result.recordset; // Return the query result
    } catch (error) {
      console.error("Error in getSubLessons:", error);
    } finally {
      pool.close(); // Close the connection pool after the query
    }
  },

  getUserProgress: async (userId) => {
    const pool = await connectToDB(); // Ensure connection
    try {
      const result = await pool.request().input("userId", sql.Int, userId)
        .query(`
          SELECT * FROM user_progress WHERE user_id = @userId;
        `);
      return result.recordset; // Return the query result
    } catch (error) {
      console.error("Error in getUserProgress:", error);
    } finally {
      pool.close(); // Close the connection pool after the query
    }
  },

  getUserProgressByIndividualLessonId: async (userId, individualLessonId) => {
    const pool = await connectToDB(); // Ensure connection
    try {
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("individualLessonId", sql.Int, individualLessonId).query(`
          SELECT * FROM user_progress WHERE user_id = @userId AND individual_lesson_id = @individualLessonId;
        `);
      return result.recordset.length ? result.recordset[0] : null;
    } catch (error) {
      console.error("Error in getUserProgressByIndividualLessonId:", error);
    } finally {
      pool.close(); // Close the connection pool after the query
    }
  },

  updateUserProgress: async (userId, individualLessonId, accuracy) => {
    const existingProgress =
      await module.exports.getUserProgressByIndividualLessonId(
        userId,
        individualLessonId
      );

    const pool = await connectToDB(); // Ensure connection
    try {
      if (existingProgress) {
        // If progress exists, update the record
        const newAttemptCount = existingProgress.attempt_count + 1;
        const status = accuracy >= 90 ? "completed" : "in_progress";

        await pool
          .request()
          .input("accuracy", sql.Decimal(5, 2), accuracy)
          .input("newAttemptCount", sql.Int, newAttemptCount)
          .input("status", sql.VarChar, status)
          .input("userId", sql.Int, userId)
          .input("individualLessonId", sql.Int, individualLessonId).query(`
            UPDATE user_progress
            SET progress_percentage = @accuracy, last_updated = GETDATE(), attempt_count = @newAttemptCount
            WHERE user_id = @userId AND individual_lesson_id = @individualLessonId;
          `);

        await pool
          .request()
          .input("status", sql.VarChar, status)
          .input("userId", sql.Int, userId)
          .input("individualLessonId", sql.Int, individualLessonId).query(`
            UPDATE user_lessons
            SET status = @status
            WHERE user_id = @userId AND individual_lesson_id = @individualLessonId;
          `);
      } else {
        // If no progress, insert new record
        const status = accuracy >= 90 ? "completed" : "in_progress";

        await pool
          .request()
          .input("accuracy", sql.Decimal(5, 2), accuracy)
          .input("status", sql.VarChar, status)
          .input("userId", sql.Int, userId)
          .input("individualLessonId", sql.Int, individualLessonId).query(`
            INSERT INTO user_progress (user_id, individual_lesson_id, progress_percentage, last_updated, attempt_count)
            VALUES (@userId, @individualLessonId, @accuracy, GETDATE(), 1);
          `);

        await pool
          .request()
          .input("status", sql.VarChar, status)
          .input("userId", sql.Int, userId)
          .input("individualLessonId", sql.Int, individualLessonId).query(`
            INSERT INTO user_lessons (user_id, individual_lesson_id, status)
            VALUES (@userId, @individualLessonId, @status);
          `);
      }
    } catch (error) {
      console.error("Error in updateUserProgress:", error);
    } finally {
      pool.close(); // Close the connection pool after the query
    }
  },
};

// Connect to the database on startup
connectToDB();
