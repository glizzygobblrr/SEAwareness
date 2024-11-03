require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const userController = require("./controllers/userController");
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/register", userController.registerUser); // User register route
app.post("/login", userController.loginUser);

app.listen(port, async () => {
    try {
      await sql.connect(dbConfig);
      console.log("Database connection established successfully");
    } catch (err) {
      console.error("Database connection error:", err);
      process.exit(1);
    }
  
    console.log(`Server listening on port ${port}`);
  });
  
  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
  });
  