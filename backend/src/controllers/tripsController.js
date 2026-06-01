import {pool} from '../db/db.js'

async function getTrips(req,res){
    console.log("Fetching trips for household_id:", req.household_id);
    const household_id = req.household_id
    try{
        const result = await pool.query(
            
            `
            SELECT 
                t.id,
                t.name ,
                t.type,
                TO_CHAR(t.start_date, 'YYYY-MM-DD') AS start_date,
                TO_CHAR(t.end_date, 'YYYY-MM-DD') AS end_date from trips t where t.household_id=$1
            `,[household_id]
        )
        res.status(200).json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

async function getTripById(req,res){

    const trip_id = req.params.id
    try{
        const tripResult = await pool.query(
            `
            SELECT 
                t.id,
                t.name,
                t.type,
                TO_CHAR(t.start_date, 'YYYY-MM-DD') AS start_date,
                TO_CHAR(t.end_date, 'YYYY-MM-DD') AS end_date
            FROM trips t
            WHERE t.id = $1 AND t.household_id = $2
            `,
            [trip_id, req.household_id]
        )

        if (tripResult.rows.length === 0) {
            return res.status(404).json({ error: 'Trip not found' })
        }

        const expenseResult = await pool.query(
            `
            SELECT 
                t.id as trip_expense_id,t.category,
                t.amount, t.expense_date as date,
                t.note from trip_expenses t where t.trip_id=$1
            `,
            [trip_id]
        )

        res.status(200).json({
            ...tripResult.rows[0],
            expenses: expenseResult.rows,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal server error' })
    }                       
        
}
async function createTrip(req,res){
}
async function updateTrip(req,res){
}
async function deleteTrip(req,res){
}
async function addExpenseToTrip(req,res){
}
async function updateExpenseInTrip(req,res){
}
async function removeExpenseFromTrip(req,res){
}

export {getTrips,getTripById,createTrip,updateTrip,deleteTrip,addExpenseToTrip,updateExpenseInTrip,removeExpenseFromTrip}