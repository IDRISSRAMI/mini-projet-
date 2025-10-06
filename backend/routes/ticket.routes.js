const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
} = require("../controllers/ticket.controller");

router.use(authMiddleware);

router.post("/cree", createTicket);
router.get("/getall", getAllTickets);
router.get("/get/:id", getTicketById);
router.put("/modifier/:id", updateTicket);
router.delete("/suppreme/:id", deleteTicket);

module.exports = router;
