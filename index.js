const express = require("express");
const app = express();
const path = require("path");
const { Pool } = require("pg");

const authRoute = require('./routes/auth');
const avgRoute = require('./routes/avg');
const gradesRoute = require('./routes/grades');
const instituteRoute = require('./routes/institute');
const userRoute = require('./routes/user');



app.use('/auth', authRoute);
app.use('/avg', avgRoute);
app.use('/grades', gradesRoute);
app.use('/institute', instituteRoute);
app.use('/user', userRoute);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) =>
  res.status(200).send("Hallo Welt seid mir gegrüßt!")
);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

function showTimes() {
  const times = process.env.TIMES || 5;
  let result = "";
  for (i = 0; i < times; i++) {
    result += i + " ";
  }
  return result;
}




app.get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM test_table");
    const results = { results: result ? result.rows : null };
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
