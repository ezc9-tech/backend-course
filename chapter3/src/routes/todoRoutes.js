import express from "express";
import db from "../db.js"

const todoRoutes = express.Router()

todoRoutes.get('/', (req, res) => {
    usersTodosQuery = db.prepare("SELECT * FROM todos WHERE ")
})

todoRoutes.post('/', (req, res) => {

})

todoRoutes.put('/:id', (req, res) => {

})

todoRoutes.delete('/:id', (req, res) => {

})


export default todoRoutes