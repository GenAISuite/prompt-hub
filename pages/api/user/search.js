import pool from "../../../lib/db"; // Assuming you have a db.js file for database connection
import search from "../user/index";
export default async function handler(req, res) {
  // write mutiple apis
  if (req.method === "POST") {
    console.log("POST"); 
    const { query } = req.body;
    try {
        const result = await pool.query("SELECT id, name FROM prompt_user WHERE name ILIKE $1", [
          `%${query}%`,
        ]);
        res.status(201).json(result.rows);
      } catch (error) {
        console.error("Error searching users:", error);
        throw new Error("Could not search users");
      }
  }
}