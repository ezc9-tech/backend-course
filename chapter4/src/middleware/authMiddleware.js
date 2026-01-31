import jwt from "jsonwebtoken"

export function authMiddleware (req, res, next) {
    const token = req.headers['authorization']

    if (!token) {
        return res.status(401).json({message: "No token provided"})
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return resizeBy.staus(401).json({message: "Invalid token"})
        }
        req.userId = decoded.id
        next()
    })
}