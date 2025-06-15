const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

// Display connection information for debugging
console.log("Attempting to connect to database with the following parameters:");
console.log(`- Host: ${process.env.DB_HOST || "localhost"}`);
console.log(`- Database: ${process.env.DB_DATABASE || "postgres"}`);
console.log(`- User: ${process.env.DB_USER || "postgres"}`);
console.log(`- Port: ${process.env.DB_PORT || "5432"}`);
console.log(`- SSL: ${process.env.DB_SSL === "true" ? "Enabled" : "Disabled"}`);

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  // Set a more reasonable timeout (5 seconds)
  connectionTimeoutMillis: 5000,
});

const runSQLScript = async () => {
  const filePath = path.join(__dirname, "init.sql");
  let client = null;

  try {
    if (!fs.existsSync(filePath)) {
      console.error(`Error: SQL file not found at ${filePath}`);
      process.exit(1);
    }

    console.log(`Reading SQL script from ${filePath}`);
    const sql = fs.readFileSync(filePath, "utf8");

    console.log("Connecting to database...");
    client = await pool.connect();
    console.log("Connection successful!");

    console.log("Executing SQL script...");
    await client.query(sql);
    console.log("SQL script executed successfully!");
  } catch (err) {
    console.error("Error executing SQL script:");

    if (err.code === "ECONNREFUSED") {
      console.error(
        `\n⚠️ Unable to connect to PostgreSQL server at ${err.address}:${err.port}`
      );
      console.error("\nPossible solutions:");
      console.error(
        "1. Make sure PostgreSQL is installed and running on your machine"
      );
      console.error(
        "2. Check if the database server is running on a different port"
      );
      console.error(
        "3. Verify your .env file has the correct connection parameters"
      );
      console.error(
        "4. If using a remote database, check network/firewall settings"
      );
      console.error("\nTo verify PostgreSQL is running, try:");
      console.error(
        "- On Windows: Check Services app or Task Manager for PostgreSQL service"
      );
      console.error(
        "- On Linux: Run 'sudo service postgresql status' or 'ps aux | grep postgres'"
      );
      console.error(
        "- On macOS: Run 'pg_isready' or 'ps aux | grep postgres'\n"
      );
    } else {
      console.error(err);
    }
    process.exit(1);
  } finally {
    // Release the client back to the pool
    if (client) {
      client.release();
    }

    // Close the pool and exit process
    await pool.end();
    console.log("Connection pool closed. Script execution complete.");
    process.exit(0);
  }
};

// Execute the function
runSQLScript();
