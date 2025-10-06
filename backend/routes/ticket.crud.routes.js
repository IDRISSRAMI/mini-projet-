const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");
const {
  createTicket,
  getMyTickets,
  getPendingTickets,
  acceptTicket,
  refuseTicket,
  getAcceptedUsers,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticket.controller");

router.use(authMiddleware);

// RESTful style under /api/tickets
router.post("/", createTicket);                  // POST /api/tickets (user create)
router.get("/", getAllTickets);                  // GET /api/tickets (admin: all, user: own)
router.get("/mine", getMyTickets);               // GET /api/tickets/mine (user only)
router.get("/pending", getPendingTickets);       // GET /api/tickets/pending (admin only)
router.patch("/:id/accept", acceptTicket);       // PATCH /api/tickets/:id/accept (admin only)
router.patch("/:id/refuse", refuseTicket);       // PATCH /api/tickets/:id/refuse (admin only)
router.get("/accepted-users", getAcceptedUsers); // GET /api/tickets/accepted-users (admin only)
router.get("/:id", getTicketById);        // GET /api/tickets/:id
router.put("/:id", updateTicket);         // PUT /api/tickets/:id
router.delete("/:id", deleteTicket);      // DELETE /api/tickets/:id

module.exports = router;


