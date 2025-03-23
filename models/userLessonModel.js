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
          SELECT ul.*, l.title, sl.wpm, il.groups, il.lesson_number
          FROM user_lessons ul
          JOIN sub_lessons sl ON ul.sublesson_id = sl.sublesson_id
          JOIN lessons l ON sl.lesson_id = l.lesson_id
          LEFT JOIN individual_lessons il ON sl.sublesson_id = il.sublesson_id
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
          SELECT sl.sublesson_id, l.title AS lesson_title, sl.wpm, il.groups, il.lesson_number
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
};

// Connect to the database on startup
connectToDB();
