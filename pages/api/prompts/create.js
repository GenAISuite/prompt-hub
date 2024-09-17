import pool from "../../../lib/db"; // Assuming you have a db.js file for database connection

export default async function handler(req, res) {
  // write mutiple apis
  if (req.method === "POST") {
    const { name, prompt, updated_by, edit_access } = req.body;
    try {
      const insertRes = await pool.query(
        "INSERT INTO prompt (name, prompt,updated_on, updated_by, edit_access) VALUES ($1, $2, $3, $4,$5) RETURNING *",
        [name, prompt, new Date(), updated_by, edit_access]
      );
      console.log(insertRes.rows[0]);
      res.status(201).json(insertRes.rows[0]);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Failed to create prompt- "+error });
    }
  }else{
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
