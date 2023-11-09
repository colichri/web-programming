const express = require("express");
const app = express();
const DATABASE_URL="postgres://miacqskbeyafwb:d7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4@ec2-34-242-199-141.eu-west-1.compute.amazonaws.com:5432/d967mmgnsklhd0";
// const { Client } = require("pg");
const path = require("path");

const authRoute = require('./routes/auth');
const gradesRoute = require('./routes/grades');
const instituteRoute = require('./routes/institute');
const userRoute = require('./routes/user');
const addressRoute = require('./routes/address');



app.use('/auth', authRoute);
app.use('/grades', gradesRoute);
app.use('/institute', instituteRoute);
app.use('/user', userRoute);
app.use('/address', addressRoute);

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) =>
  res.status(200).send("Hallo Welt seid mir gegrüßt!")
);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

module.exports = {
    DATABASE_URL, // Export the DATABASE_URL to be used in other files
};