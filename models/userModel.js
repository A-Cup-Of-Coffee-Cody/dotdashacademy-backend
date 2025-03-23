const sql = require("mssql"); // Import the mssql package
const dbConfig = require("../config/dbConfig"); // Import dbConfig from external file

// Function to connect to SQL Server
const connectToDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("✅ Connected to Azure SQL Server (Lessons)");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

// User Model Functions using SQL Server
module.exports = {
  getUserById: async (userId) => {
    try {
      const pool = await sql.connect(dbConfig); // Ensure connection
      const result = await pool
        .request()
        .input("userId", sql.Int, userId)
        .query("SELECT * FROM users WHERE user_id = @userId");
      return result.recordset[0]; // Return the first row
    } catch (error) {
      console.error("Error in getUserById:", error);
    }
  },

  getUserByUsername: async (username) => {
    try {
      const pool = await sql.connect(dbConfig); // Ensure connection
      const result = await pool
        .request()
        .input("username", sql.VarChar, username)
        .query("SELECT * FROM users WHERE username = @username");
      return result.recordset[0]; // Return the first row
    } catch (error) {
      console.error("Error in getUserByUsername:", error);
    }
  },

  // getUserByEmail: async (email) => { // Commented out but kept for future use
  //   try {
  //     const pool = await sql.connect(dbConfig); // Ensure connection
  //     const result = await pool
  //       .request()
  //       .input("email", sql.VarChar, email)
  //       .query("SELECT * FROM users WHERE email = @email");
  //     return result.recordset[0]; // Return the first row
  //   } catch (error) {
  //     console.error("Error in getUserByEmail:", error);
  //   }
  // },

  getUserByCallSign: async (callSign) => {
    try {
      const pool = await sql.connect(dbConfig); // Ensure connection
      const result = await pool
        .request()
        .input("callSign", sql.VarChar, callSign)
        .query("SELECT * FROM users WHERE call_sign = @callSign");
      return result.recordset[0]; // Return the first row
    } catch (error) {
      console.error("Error in getUserByCallSign:", error);
    }
  },

  // createUser: async (username, hashedPassword, email) => { // Commented out but kept for future use
  createUser: async (username, hashedPassword) => {
    try {
      const pool = await sql.connect(dbConfig); // Ensure connection
      await pool
        .request()
        .input("username", sql.VarChar, username)
        .input("hashedPassword", sql.VarChar, hashedPassword)
        // .input("email", sql.VarChar, email) // Commented out but kept for future use
        .query(
          // "INSERT INTO users (username, password_hash, email) VALUES (@username, @hashedPassword, @email)" // Commented out
          "INSERT INTO users (username, password_hash) VALUES (@username, @hashedPassword)" // Without email
        );
    } catch (error) {
      console.error("Error in createUser:", error);
    }
  },

  // updateUserProfile: async (userId, username, email, callSign, password) => { // Commented out but kept for future use
  updateUserProfile: async (userId, username, callSign, password) => {
    try {
      const pool = await sql.connect(dbConfig); // Ensure connection

      let query =
        "UPDATE users SET username = @username, call_sign = @callSign";
      const request = pool
        .request()
        .input("username", sql.VarChar, username)
        .input("callSign", sql.VarChar, callSign)
        .input("userId", sql.Int, userId);

      // if (email) { // Commented out but kept for future use
      //   query += ", email = @email";
      //   request.input("email", sql.VarChar, email);
      // }

      if (password) {
        query += ", password_hash = @password";
        request.input("password", sql.VarChar, password);
      }

      query += " WHERE user_id = @userId";

      // Execute the update query
      await request.query(query);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  updateUserStreak: async (userId, loginStreak) => {
    try {
      const pool = await sql.connect(dbConfig); // Ensure connection
      await pool
        .request()
        .input("loginStreak", sql.Int, loginStreak)
        .input("userId", sql.Int, userId)
        .query(
          "UPDATE users SET last_login = GETDATE(), login_streak = @loginStreak WHERE user_id = @userId"
        );
    } catch (error) {
      console.error("Error updating user streak:", error);
    }
  },
};

// Connect to the database on startup
connectToDB();
