const sql = require("mssql");
const moment = require("moment");
const dbConfig = require("./config/dbConfig"); // Import db configuration
const cron = require("node-cron"); // Import node-cron for scheduling

// 🔹 Cron Job to Check and Remove Inactive Users Every Day at 8:50 PM
const checkInactiveAccounts = async () => {
  const pool = await sql.connect(dbConfig); // Use connection pooling
  console.log("✅ Connected to SQL Server (CronJob)");

  try {
    // Calculate the date 3 months ago
    const threeMonthsAgo = moment()
      .subtract(3, "months")
      .format("YYYY-MM-DD HH:mm:ss");

    // Query for users who haven't logged in for more than 3 months
    const result = await pool
      .request()
      .input("threeMonthsAgo", sql.DateTime, threeMonthsAgo)
      .query(
        "SELECT user_id, username, last_login FROM users WHERE last_login < @threeMonthsAgo"
      );

    const inactiveUsers = result.recordset;

    if (inactiveUsers.length > 0) {
      console.log("Inactive users found:", inactiveUsers);

      // Loop through the inactive users and remove them and their data from the database
      for (const user of inactiveUsers) {

        // Delete the inactive user from the users table
        // Start by deleting user-related data from other tables
        await db
          .promise()
          .execute("DELETE FROM user_progress WHERE user_id = ?", [
            user.user_id,
          ]);
        await db
          .promise()
          .execute("DELETE FROM user_lessons WHERE user_id = ?", [
            user.user_id,
          ]);

        try {
          // Start by deleting user-related data from other tables
          await pool
            .request()
            .input("userId", sql.Int, user.user_id)
            .query("DELETE FROM user_progress WHERE user_id = @userId");

          await pool
            .request()
            .input("userId", sql.Int, user.user_id)
            .query("DELETE FROM user_lessons WHERE user_id = @userId");

          // Finally, delete the user from the users table
          await pool
            .request()
            .input("userId", sql.Int, user.user_id)
            .query("DELETE FROM users WHERE user_id = @userId");

          console.log(
            `User with ID ${user.user_id} and Username ${user.username} has been deleted along with related data.`
          );
        } catch (deleteError) {
          console.error(
            `Error deleting data for user ${user.user_id}:`,
            deleteError
          );
        }

      }
    } else {
      console.log("No inactive users found.");
    }
  } catch (error) {
    console.error("Error checking or deleting inactive users:", error);
  } finally {
    pool.close(); // Close the connection pool after the operation
    console.log("✅ SQL Server connection closed.");
  }
};

// Schedule the task to run every day at 8:50 PM
cron.schedule("50 20 * * *", checkInactiveAccounts);
