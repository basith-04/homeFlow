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

async function createFilterLog(req, res) {
    const { change_date } = req.body;
    const user_id = req.user.user_id;
    try {
        const result = await pool.query(
            'INSERT INTO filter_change_logs (change_date, user_id) VALUES ($1, $2) RETURNING id',
            [change_date, user_id]
        );
        const id = result.rows[0].id;
        res.status(201).json({ message: "filter log created", id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server gone" });
    }
}

async function updateFilterLog(req, res) {
    const { id } = req.params;
    const { change_date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE filter_change_logs SET change_date=$1 WHERE id=$2 RETURNING id',
            [change_date, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Filter log not found' });
        }
        res.status(200).json({ message: 'filter log updated', id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server gone' });
    }
}

export { getFilterLogs, createFilterLog, updateFilterLog };
