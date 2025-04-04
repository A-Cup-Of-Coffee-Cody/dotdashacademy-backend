require("dotenv").config(); // Import dotenv to read from the .env file

console.log("DB Config:", {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "********" : "Not Set",
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  encrypt: process.env.DB_ENCRYPT,
  trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE,
});

module.exports = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true", // Convert to boolean
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === "true", // Convert to boolean
    port: parseInt(process.env.DB_PORT, 10), // Ensure it's a number
  },
};
