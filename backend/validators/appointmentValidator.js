const Joi = require("joi");

const appointmentSchema = Joi.object({
  patientName: Joi.string().required(),

  doctorName: Joi.string().required(),

  appointmentDate: Joi.string().required(),
});

module.exports = appointmentSchema;