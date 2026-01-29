import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes)

app.get("/", (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`The server is listening at http://localhost:${port}`)
})