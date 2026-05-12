import { pool } from "../db/db.js"

async function createHousehold(req, res) {

    const { name } = req.body
    try {
        const result = await pool.query('INSERT INTO households (name) VALUES($1) RETURNING id', [name])
        const id = result.rows[0].id
        const user_id = req.user.user_id
        const result2 = await pool.query('update users set household_id= $1 where id=$2', [id, user_id])

        res.status(201).json({ message: "household created", id })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
async function getHousehold(req, res) {
    const user_id = req.user.user_id
    try {
        const result = await pool.query('SELECT * from households h inner join users u on h.id=u.household_id where u.id=$1', [user_id])
        res.status(200).json(result.rows[0])
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
export { createHousehold, getHousehold }