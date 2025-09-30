const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La description est obligatoire"],
      minlength: [10, "La description doit contenir au moins 10 caractères"],
    },
    status: {
      type: String,
      enum: ["ouvert", "en cours", "résolu", "fermé"],
      default: "ouvert",
    },
    priority: {
      type: String,
      enum: ["faible", "moyenne", "élevée"],
      default: "moyenne",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      default: null,
    },
    updates: [
      {
        message: String,
        date: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  {
    timestamps: true, 
  }
);


module.exports = mongoose.model("Ticket", ticketSchema);
