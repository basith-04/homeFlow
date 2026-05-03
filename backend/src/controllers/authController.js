import { pool } from '../db/db.js'
import bcrypt from 'bcrypt'
async function registerUser(req, res) {
    const { name, email, password, created_at } = req.body
    const password_hash = await bcrypt.hash(password, 10)
    try {
        const result = await pool.query('INSERT INTO users (name,email,password_hash,created_at ) VALUES($1,$2,$3,$4)', [name, email, password_hash, created_at])
    } catch (err) {
        console.error('DB ERROR', err)

    }
}Z
async function loginUser(req,res){
    const {email,password}=req.body
}
export { registerUser }