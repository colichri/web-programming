const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Client } = require('pg');
const { DATABASE_URL } = require("../index.js")


//Testing the connection
router.get("/", (req, res) => {
  res.send("Get method klappt als routing");
});

// login user
router.route("/").post(bodyParser.json(), async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body;
    const { expiresInMins = 60 } = req.body;


    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();


    // Query the database for the user's login information
    console.log("email", email, "password", password);
    const { rows } = await client.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    await client.end();

    // If the user is not found, return an error
    if (rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    // Otherwise, create a payload with the user's information
    const payload = {
      id: rows[0].id,
      email: rows[0].email,
      expiresIn: new Date(Date.now() + expiresInMins * 60000),
    };

    // Return the payload
    res.send(payload);
  } catch (error) {
    next(error);
  }
});

// register user
router.route("/register").post(bodyParser.json(), async (req, res, next) => {
  try {
    const { email = "", username = "", password = "" } = req.body;

    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();

    // Check if the user already exists
    const { rows } = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // If the user already exists, return an error
    if (rows.length > 0) {
      return res.status(409).send("User already exists");
    }

    // Otherwise, insert the new user into the database
    await client.query(
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)",
      [email, username, password]
    );

    // Return a success message
    res.send("User registered successfully");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
