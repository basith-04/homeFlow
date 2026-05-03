import { pool } from "../db/db.js";
async function createGroceryPurchase(req,res){

    const {item_id,household_id,user_id,quantity,unit,amount,notes}=req.body
    try{
        const result = await pool.query('INSERT INTO grocery_purchases (item_id,household_id,user_id,quantity,unit,amount,notes) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id', [item_id,household_id,user_id,quantity,unit,amount,notes])
        const id = result.rows[0].id
        res.status(201).json({ message: "grocery purchase created", id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
async function getGroceryPurchases(req,res){
    const {household_id}=req.body
    try{
        const result = await pool.query('SELECT * FROM grocery_purchases gp inner join items i on gp.item_id=i.id where gp.household_id=$1', [household_id])
        res.status(200).json(result.rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
export {createGroceryPurchase,getGroceryPurchases}