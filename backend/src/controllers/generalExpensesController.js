import { pool } from "../db/db.js";
async function createExpense(req, res) {

    const { description, amount, category_id, date } = req.body
    try {
        const result = await pool.query('INSERT INTO expenses (household_id,logged_by,description,amount,category_id,date) VALUES($1,$2,$3,$4,$5,$6) RETURNING id', [req.household_id, req.user.user_id, description, amount, category_id, date])
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
        console.log("frrrr")
        const result = await pool.query('SELECT ex.id,ex.logged_by as user_id,ex.category_id,ec.name,ex.description,ex.amount,ex.date FROM expenses ex INNER JOIN expense_categories ec on ex.category_id=ec.id where household_id=$1', [household_id])
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}

async function getExpenseCategories(req, res) {
    try {
        const result = await pool.query('SELECT * FROM expense_categories')
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}

async function updateExpense(req, res) {
    const expense_id = req.params.id;
    const { description, amount, category_id, date } = req.body;
    try {
        const result = await pool.query(
            'UPDATE expenses SET description=$1, amount=$2, category_id=$3, date=$4 WHERE id=$5 AND logged_by=$6 RETURNING id',
            [description, amount, category_id, date, expense_id, req.user.user_id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Expense not found or not authorized' });
        }
        res.status(200).json({ message: 'expense updated', id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server gone' });
    }
}

async function deleteExpense(req, res) {
    const expense_id = req.params.id
    try {
        await pool.query('DELETE FROM expenses WHERE id=$1 AND logged_by=$2', [expense_id, req.user.user_id])
        res.status(200).json({ message: "expense deleted" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}

export { createExpense, getExpenses, getExpenseCategories, deleteExpense, updateExpense }