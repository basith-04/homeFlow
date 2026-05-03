import { pool } from "../db/db.js";

async function createItem(req,res){
    const {name,category_id,default_unit}=req.body
    try {
        const result = await pool.query('INSERT INTO items (name,category_id,default_unit) VALUES($1,$2,$3) RETURNING id', [name, category_id, default_unit])
        const id = result.rows[0].id
        res.status(201).json({ message: "item created", id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }

}
async   function getItems(req,res){
    try {
        const result =await pool.query('SELECT * from items')
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
export {createItem,getItems}