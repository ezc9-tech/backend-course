import express from "express";
import db from "../db.js"

const todoRoutes = express.Router()

todoRoutes.get('/', (req, res) => {
    const usersTodosQuery = db.prepare("SELECT * FROM todos WHERE user_id = ? ")
    const todos = usersTodosQuery.all(req.userId)
    res.send(todos)
})

todoRoutes.post('/', (req, res) => {
    const { task } = req.body;
    const userId = req.userId;
    try {
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        const result = insertTodo.run(userId, task)
        res.status(201).json({id: result.lastInsertRowid, task, completed: 0})
    } catch (error) {
        res.sendStatus(503)
    }
})

todoRoutes.put('/:id', (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;
    const userId = req.userId;

    try {
        const updateTodo = db.prepare(`UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?`);

        const result = updateTodo.run(completed, id, userId);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo updated" });
    } catch (error) {
        res.sendStatus(503);
    }
});


todoRoutes.delete('/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const updateTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`);
        const result = updateTodo.run(id, userId);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo Deleted" });
    } catch (error) {
        res.sendStatus(503);
    }
})


export default todoRoutes