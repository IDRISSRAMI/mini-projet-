const express = require("express")
const cors = require ("cors")
const connectDB = require("./config/db")
const authRoutes = require("./routes/auth.routes")
const ticketRoutes = require("./routes/ticket.routes")
const ticketCrudRoutes = require("./routes/ticket.crud.routes")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 7460

app.use(cors())
app.use(express.json())

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api", ticketRoutes)
app.use("/api/tickets", ticketCrudRoutes)

app.listen(PORT, () => {
  console.log('Server running on port 7460');
});
