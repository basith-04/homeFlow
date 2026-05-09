import { pool } from "../db/db.js";
async function createGroceryPurchase(req, res) {

    const { item_id, quantity, unit, amount } = req.body
    try {
        const household_id = req.household_id;
        const user_id=req.user.userId
        const result = await pool.query('INSERT INTO grocery_purchases (item_id,household_id,user_id,quantity,unit,amount) VALUES($1,$2,$3,$4,$5,$6) RETURNING id', [item_id, household_id, user_id, quantity, unit, amount])
        const id = result.rows[0].id
        res.status(201).json({ message: "grocery purchase created", id })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
async function getGroceryPurchases(req, res) {
    const household_id = req.household_id
    try {
        const result = await pool.query(
            `
  SELECT
    gp.id AS purchase_id,
    gp.quantity,
    gp.unit,
    gp.amount AS totalprice,
    gp.price_per_unit AS unitprice ,
    gp.date,
    gp.notes,
    gp.created_at AS purchase_created_at,
    gp.user_id AS by,

    i.id AS item_id,
    i.name AS item,
    i.default_unit,

    gc.id AS category_id,
    gc.name AS category

  FROM grocery_purchases gp

  INNER JOIN items i
    ON gp.item_id = i.id

  LEFT JOIN grocery_categories gc
    ON i.category_id = gc.id

  WHERE gp.household_id = $1

  ORDER BY gp.date DESC
  `,
            [household_id]
        ); 
        res.status(200).json(result.rows)
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
async function updateGroceryPurchase(req, res) {

}
async function removeGroceryPurchase(req, res) {
    const { id } = req.params
    try {
        const result = await pool.query('DELETE FROM grocery_purchases where id=$1 AND  user_id=$2', [id, req.user.userId])
        res.status(200).json({ message: "grocery purchase removed" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "server gone " })
    }
}
export { createGroceryPurchase, getGroceryPurchases, removeGroceryPurchase ,updateGroceryPurchase}