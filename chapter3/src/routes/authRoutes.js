import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js"

const authRoutes = express.Router()


authRoutes.post('/register', (req, res) => {
    const {username, password} = req.body;
    
    // if (db.exec(`SELECT * FROM users WHERE username = ${username}`)){
    //     return res.status(400).json({message: "Username already taken"})
    // }

    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        const defaultTodo = 'Hello :) add your first todo!'
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET_KEY, {expiresIn: '24h'})
        res.status(201).json({message: "User has been created", token: token})
    } catch (error) {
        res.status(500).json({message: "Server Error", error})
    }
})

authRoutes.post('/login', (req, res) => {
    const {username, password} = req.body;
    
    if (!db.exec(`SELECT * FROM users WHERE username = ${username}`)){
        return res.status(400).json({message: "There is no user with that username"})
    }


})

export default authRoutes