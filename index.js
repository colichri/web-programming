const express = require("express");
const app = express();
const { Pool } = require("pg");
const path = require("path");

const authRoute = require('./routes/auth');
const avgRoute = require('./routes/avg');
const gradesRoute = require('./routes/grades');
const instituteRoute = require('./routes/institute');
const userRoute = require('./routes/user');


const DATABASE_URL="postgres://miacqskbeyafwb:d7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4@ec2-34-242-199-141.eu-west-1.compute.amazonaws.com:5432/d967mmgnsklhd0"
// Create a new connection pool
console.log("connectionString: " + DATABASE_URL); // Check the value of connectionString
const pgpool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use('/auth', authRoute);
app.use('/avg', avgRoute);
app.use('/grades', gradesRoute);
app.use('/institute', instituteRoute);
app.use('/user', userRoute);

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) =>
  res.status(200).send("Hallo Welt seid mir gegrüßt!")
);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

// GET method route
app.get("/db", async (req, res) => {
    try {
      console.log(pgpool);
      console.log("0");
        const client = await pgpool.connect()
        console.log("1");
        const result = await client.query("SELECT * FROM user");
        console.log("2");
        const results = { results: result ? result.rows : null };
        console.log("3");
        res.send(results);
        console.log("4");
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

module.exports = {
    pgpool // Export the pgpool to be used in other files
};
