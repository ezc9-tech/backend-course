import express from "express";
import prisma from "../prismaClient.js"

const todoRoutes = express.Router()

todoRoutes.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })
    res.send(todos)
})

todoRoutes.post('/', (req, res) => {
    const { task } = req.body;
    try {
        const todo = prisma.todo.create({
            data: {
                task: task,
                userId: req.userId
            }
        })
        res.status(201).json({id: todo.id, task, completed: 0})
    } catch (error) {
        res.sendStatus(503)
    }
})

todoRoutes.put('/:id', async (req, res) => {
    const { completed } = req.body;
    const { id } = req.params;

    try {
        const updatedTodo = await prisma.todo.update({
            where: {
                id: parseInt(id),
                userId: req.userId
            },
            data: {
                completed: !!completed
            }
        })

        res.status(200).json({ message: "Todo updated" });
    } catch (error) {
        res.sendStatus(503);
    }
});


todoRoutes.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.todo.delete({
            where: {
                id: parseInt(id),
                userId: req.userId
            }
        })

        res.status(200).json({ message: "Todo Deleted" });
    } catch (error) {
        res.sendStatus(503);
    }
})


export default todoRoutes