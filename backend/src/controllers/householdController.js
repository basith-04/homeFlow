import { pool } from "../db/db.js"

async function createHousehold(req, res) {

    const { name } = req.body
    try {
        const result = await pool.query('INSERT INTO households (name) VALUES($1) RETURNING id', [name])
        const id = result.rows[0].id
        const userId = req.user.userId
        const result2 = await pool.query('update users set household_id= $1 where id=$2', [id, userId])

        res.status(201).json({ message: "household created", id })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
async function getHousehold(req, res) {

}
export { createHousehold, getHousehold }