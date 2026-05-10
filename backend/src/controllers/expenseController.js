import { pool } from "../db/db.js";
async function createExpense(req, res) {

    const { user_id, description, amount, category } = req.body
    try {
        const household_id = req.household_id;
        const result = await pool.query('INSERT INTO expenses (item_id,household_id,user_id,description,amount,category) VALUES($1,$2,$3,$4,$5,$6) RETURNING id', [item_id, household_id, user_id, description, amount, category])
        const id = result.rows[0].id
        res.status(201).json({ message: "expense created", id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }

}
async function getExpenses(req, res) {
    const household_id = req.household_id;
    try {
        const result = await pool.query('SELECT * FROM expenses e inner join items i on e.item_id= i.id where e.household_id=$1', [household_id])
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
export { createExpense, getExpenses }