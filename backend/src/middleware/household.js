import { pool } from "../db/db.js";
async function attachHouseholdId(req, res, next) {
    const userId = req.user.userId;
    try {
        const result = await pool.query('SELECT household_id FROM users WHERE id = $1', [userId]);
        if (result.rows.length > 0) {
            req.household_id = result.rows[0].household_id; // Attach household_id to request object
            next();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
export { attachHouseholdId }