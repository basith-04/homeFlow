import { pool } from "../db/db.js";

async function getFilterLogs(req, res) {
    try {
        const result = await pool.query(
            `SELECT id, user_id, TO_CHAR(change_date, 'YYYY-MM-DD') AS change_date, created_at
             FROM filter_change_logs
             ORDER BY change_date DESC`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server gone" });
    }
}
