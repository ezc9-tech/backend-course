import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js"

const authRoutes = express.Router()


authRoutes.post('/register', async (req, res) => {
    const {username, password} = req.body;

    const userExists = await prisma.user.findUnique({
        where: {
            username: username
        }
    })

    if (userExists){
        return res.status(400).json({message: "Username already taken"})
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword
            }
        })

        await prisma.todo.create({
            data: {
                userId: user.id,
                task: "Hello :) add your first todo!"
            }
        })
        
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: '24h'})
        res.status(201).json({token})
    } catch (error) {
        res.sendStatus(503)
    }
})

authRoutes.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        }) 

        if (!user){
            return res.status(404).send({message: "There is no user with that username"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if(!passwordIsValid) {
            return res.status(401).send({message: "Password is incorrect"})
        }
        
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: '24h'})
        res.status(200).json({token})
    } catch (error) {
        res.sendStatus(503)
    }
})

export default authRoutes