import { pool } from '../db/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
async function registerUser(req, res) {
    const { name, email, password } = req.body
    const password_hash = await bcrypt.hash(password, 10)
    try {
        const result = await pool.query('INSERT INTO users (name,email,password_hash) VALUES($1,$2,$3)', [name, email, password_hash])
        res.json({ message: "user created successfully" })
    } catch (err) {
        console.error('DB ERROR', err)
        return res.status(500).json({ error: 'Internal server error' })

    }
}
async function loginUser(req, res) {
    console.log("Login request received with body:", req.body);
    const { email, password } = req.body
    try {
        const result = await pool.query('SELECT * from users where email=$1', [email])
        if(result.rows.length === 0) {
            return res.status(400).json({ error: "user not found" })
        }
        const isMatch = await bcrypt.compare(password, result.rows[0].password_hash)
        if (isMatch) {
            const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '5d' })
            return res.status(200).json({ token })
        }
        return res.status(401).json({ error: "invalid credentials" })
    } catch (err) {
        console.error('DB ERROR', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
export { registerUser, loginUser }