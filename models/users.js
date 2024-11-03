const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
    constructor(userID, username, email, password, role, contactNo, userCreated, userModified) {
        this.userID = userID;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role || "User"; // Default role to "User" if not specified
        this.contactNo = contactNo; 
        this.userCreated = userCreated;
        this.userModified = userModified;
    }    

  static async getUserByEmail(email) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('Email', sql.VarChar, email)
        .query('SELECT * FROM Users WHERE email = @Email');

      return result.recordset[0]; // Return the first user found
    } catch (err) {
      console.error('Error retrieving user by email:', err);
      throw err; // Rethrow error for handling in controller
    }
  }

  // Method to register a new user
  static async registerUser(newUser) {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('Username', sql.VarChar, newUser.username)
        .input('Email', sql.VarChar, newUser.email)
        .input('Password', sql.VarChar, newUser.password)
        .input('Role', sql.VarChar, newUser.role || "User") 
        .input('ContactNo', sql.VarChar, newUser.contactNo) // Correctly pass the contactNo
        .input('UserCreated', sql.DateTime, newUser.userCreated)
        .input('UserModified', sql.DateTime, newUser.userModified)
        .query('INSERT INTO Users (username, email, password, role, contactNo, userCreated, userModified) OUTPUT INSERTED.userID VALUES (@Username, @Email, @Password, @Role, @contactNo, @UserCreated, @UserModified)');

      return result.recordset[0]; // Return the created user ID
    } catch (err) {
      console.error('Error registering new user:', err);
      throw err; // Rethrow error for handling in controller
    }
  }
}

module.exports = User;
