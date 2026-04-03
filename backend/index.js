const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());

// Connect to your Northwind database
const pool = new Pool({
  database: "northwind",
  host: "localhost",
  port: 5432,
});

// --- Task 2: Basic Queries ---

// First 10 customers
app.get("/api/customers", async (req, res) => {
  const result = await pool.query("SELECT * FROM customers LIMIT 10");
  res.json(result.rows);
});

// Products with unit price > $50
app.get("/api/products/expensive", async (req, res) => {
  const result = await pool.query(
    "SELECT product_name, unit_price FROM products WHERE unit_price > 50"
  );
  res.json(result.rows);
});

// --- Task 3: Filtering and Sorting ---

// Orders by USA customers
app.get("/api/orders/usa", async (req, res) => {
  const result = await pool.query(`
    SELECT o.* FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE c.country = 'USA'
  `);
  res.json(result.rows);
});

// Employees born after 1960
app.get("/api/employees/born-after-1960", async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM employees
    WHERE birth_date > '1960-12-31'
    ORDER BY birth_date ASC
  `);
  res.json(result.rows);
});

// --- Task 4: Aggregation ---

// Products per category
app.get("/api/products/by-category", async (req, res) => {
  const result = await pool.query(`
    SELECT c.category_name, COUNT(p.product_id) AS total_products
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    GROUP BY c.category_name
  `);
  res.json(result.rows);
});

// Average price per supplier
app.get("/api/products/avg-price-by-supplier", async (req, res) => {
  const result = await pool.query(`
    SELECT s.company_name, ROUND(AVG(p.unit_price)::numeric, 2) AS avg_price
    FROM products p
    JOIN suppliers s ON p.supplier_id = s.supplier_id
    GROUP BY s.company_name
  `);
  res.json(result.rows);
});

// --- Task 5: Joins ---

// Order details with product names
app.get("/api/orders/details", async (req, res) => {
  const result = await pool.query(`
    SELECT o.order_id, p.product_name, od.quantity, od.unit_price
    FROM order_details od
    JOIN orders o ON od.order_id = o.order_id
    JOIN products p ON od.product_id = p.product_id
    LIMIT 100
  `);
  res.json(result.rows);
});

// Customers with no orders
app.get("/api/customers/no-orders", async (req, res) => {
  const result = await pool.query(`
    SELECT c.customer_id, c.company_name
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.order_id IS NULL
  `);
  res.json(result.rows);
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
