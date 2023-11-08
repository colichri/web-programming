const express = require("express");
const app = express();
const DATABASE_URL="postgres://mwsvxbtyequwmi:cc2192e32e5507ee2f6821d5ad153d604febbdf3a78b552dd4a59bfda2fdad2e@ec2-3-233-77-220.compute-1.amazonaws.com:5432/d8ic32b6u6g5cs";
// const { Client } = require("pg");
const path = require("path");

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

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) =>
  res.status(200).send("Hallo Welt seid mir gegrüßt!")
);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

module.exports = {
    DATABASE_URL, // Export the DATABASE_URL to be used in other files
};