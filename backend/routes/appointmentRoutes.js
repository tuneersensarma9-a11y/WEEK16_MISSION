const express = require("express");
const Appointment = require("../models/Appointment");
const protect = require("../middleware/authMiddleware");
const appointmentSchema = require("../validators/appointmentValidator");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { error } = appointmentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const appointment = await Appointment.create({
      ...req.body,
      authorId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Appointment Created Successfully",
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      authorId: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { error } = appointmentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    const updatedAppointment =
      await Appointment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.status(200).json({
      success: true,
      message: "Appointment Updated Successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    await Appointment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Appointment Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;