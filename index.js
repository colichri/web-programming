const express = require("express");
const app = express();
const { Pool } = require("pg");
const path = require("path");

const authRoute = require('./routes/auth');
const avgRoute = require('./routes/avg');
const gradesRoute = require('./routes/grades');
const instituteRoute = require('./routes/institute');
const userRoute = require('./routes/user');


const DATABASE_URL="postgres://kueqgryutxmqdf:45e8ee86568f6bb2b4067d3d939b068f5fc4611aaa9b2c6aea1308a39be0d24d@ec2-34-233-242-44.compute-1.amazonaws.com:5432/d3g0abr6n7fbko"
// Create a new connection pool
console.log("connectionString: " + DATABASE_URL); // Check the value of connectionString
const pgpool = new Pool({
  DATABASE_URL,
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
        const client = await pgpool.connect();
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
    pgpool, // Export the pgpool to be used in other files
};
