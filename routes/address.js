const { Client } = require('pg');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const DATABASE_URL = "postgres://miacqskbeyafwb:d7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4@ec2-34-242-199-141.eu-west-1.compute.amazonaws.com:5432/d967mmgnsklhd0";

// Establishing a connection
const connectToClient = async () => {
    try {
      const client = new Client({
        connectionString: DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });
      await client.connect();
      return client;
    } catch (error) {
      console.error('Error connecting to addressatabase:', error);
    }
  };

//GET Method
router.get('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const client = await connectToClient();

        const query = 'SELECT * FROM addresses WHERE userid = $1';
        const values = [userId];
        const result = await client.query(query, values);

        res.send(result.rows);
    } catch (error) {
        next(error);
    }
})

// POST endpoint to add a new address for a user to the database
    .post('/:userId', bodyParser.json(), async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { street = "", city = "", postal_code = "", country = "" } = req.body;

        const client = await connectToClient();
        const query = 'INSERT INTO addresses (userid, street, city, postal_code, country) VALUES ($1, $2, $3, $4, $5)';
        const values = [userId, street, city, postal_code, country];
        await client.query(query, values);

        res.send('Address entered successfully');
    } catch (error) {
        next(error);
    }
})
.put('/:userId/:addressId', bodyParser.json(), async (req, res, next) => {
    try {
      const { userId, addressId } = req.params;
      const { street, city, postal_code, country } = req.body;
  
      const client = await connectToClient();
      const query = 'UPDATE addresses SET street = $1, city = $2, postal_code = $3, country = $4 WHERE userid = $5 AND addressid = $6';
      const values = [street, city, postal_code, country, userId, addressId];
      await client.query(query, values);
  
      res.send('Address updated successfully');
    } catch (error) {
      next(error);
    }
  })

  .delete('/:userId', async (req, res, next) => {
    try {
      const { userId } = req.params;
  
      const client = await connectToClient();
      await client.query('DELETE FROM adresses WHERE userid = $1', [userId]);
  
      res.send('User data deleted successfully');
    } catch (error) {
      next(error);
    }
  });


module.exports = router;
