const Ticket = require("../models/Ticket");
const User = require("../models/User");


exports.createTicket = async (req, res) => {
  try {
    // Admins are not allowed to create tickets
    if (req.user && req.user.isAdmin) {
      return res.status(403).json({ message: "Les administrateurs ne peuvent pas créer des tickets" });
    }
    const { title, description, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      status: "ouvert", // pending
      user: req.user.id,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la création du ticket",
      error: err.message,
    });
  }
};

// User: only their own tickets
// User: see only accepted ("résolu")
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id, status: "résolu" }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: err.message });
  }
};

// Admin: list only pending
exports.getPendingTickets = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Accès refusé" });
    const tickets = await Ticket.find({ status: "ouvert" })
      .populate("user", "username email")
      .sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: err.message });
  }
};

// Admin: accept a ticket (status -> accepted)
exports.acceptTicket = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Accès refusé" });
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket non trouvé" });
    ticket.status = "résolu"; // accepted
    await ticket.save();
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'acceptation", error: err.message });
  }
};

// Admin: refuse a ticket (status -> "fermé")
exports.refuseTicket = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Accès refusé" });
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket non trouvé" });
    ticket.status = "fermé"; // refused
    await ticket.save();
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du refus", error: err.message });
  }
};

// Admin: users with accepted tickets and their tickets
exports.getAcceptedUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: "Accès refusé" });
    const tickets = await Ticket.find({ status: "résolu" }).populate("user", "username email");
    const userIdToData = new Map();
    tickets.forEach(t => {
      const u = t.user;
      if (!u) return;
      if (!userIdToData.has(u._id.toString())) {
        userIdToData.set(u._id.toString(), { user: { _id: u._id, username: u.username, email: u.email }, tickets: [] });
      }
      userIdToData.get(u._id.toString()).tickets.push({ _id: t._id, title: t.title, description: t.description, status: t.status });
    });
    res.status(200).json(Array.from(userIdToData.values()));
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: err.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const filter = req.user.isAdmin ? {} : { user: req.user.id };

    const tickets = await Ticket.find(filter)
      .populate("user", "username email")
      .populate("assignedTo", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des tickets",
      error: err.message,
    });
  }
};


exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("user", "username email")
      .populate("assignedTo", "username email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" });
    }

    if (!req.user.isAdmin && ticket.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


exports.updateTicket = async (req, res) => {
  try {
    const { title, description, priority, status, assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket)
      return res.status(404).json({ message: "Ticket non trouvé" });

    const isOwner = ticket.user.toString() === req.user.id;
    if (!req.user.isAdmin && !isOwner) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (priority) ticket.priority = priority;

    if (req.user.isAdmin && status) ticket.status = status;
    if (req.user.isAdmin && assignedTo) ticket.assignedTo = assignedTo;

    ticket.updates.push({
      message: `Ticket modifié par ${req.user.username}`,
      updatedBy: req.user.id,
    });

    await ticket.save();
    res.status(200).json(ticket);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour", error: err.message });
  }
};

// Supprimer un ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket introuvable" });
    }

    if (!req.user.isAdmin && ticket.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Suppression non autorisée" });
    }

    await ticket.deleteOne();
    res.status(200).json({ message: "Ticket supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
