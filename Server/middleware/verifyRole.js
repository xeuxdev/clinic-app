import { pool } from "../db/init_db.js";

export const verifyRole = async (req, res, next) => {
  const userId = req.userId;
  try {
    const account = await pool.query(
      `SELECT * FROM auth.accounts WHERE id = $1`,
      [userId]
    );
    if (account.rows[0].role === "patient") {
      return res
        .status(403)
        .send("You are not authorized to perform this action.");
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
};
