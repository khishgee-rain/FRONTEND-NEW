require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Create Product Table (Run this manually in your database)
const createTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    colors TEXT[],
    picture TEXT NOT NULL
  )`;
  await pool.query(query);
};
createTable();

// Add Product API
app.post("/add-product", async (req, res) => {
  const { name, price, colors, picture } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO products (name, price, colors, picture) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, price, colors, picture]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Products API
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
