const Joi = require("joi");

/**
 * Returns an Express middleware that validates req.body against the given Joi schema.
 * Responds with 422 on validation failure.
 */
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const details = error.details.map((d) => d.message);
      return res.status(422).json({ error: "Validation failed", details });
    }
    req.body = value; // use the sanitised/coerced value
    next();
  };
}

const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().lowercase().required(),
  message: Joi.string().trim().min(10).max(2000).required(),
});

const visitSchema = Joi.object({
  sessionId: Joi.string().trim().max(128).required(),
  referrer: Joi.string().trim().max(500).allow("", null),
  page: Joi.string().trim().max(200).allow("", null),
});

const sectionSchema = Joi.object({
  sessionId: Joi.string().trim().max(128).required(),
  section: Joi.string().trim().max(100).required(),
  timeSpentMs: Joi.number().integer().min(0).max(600000).default(0),
});

const sessionEndSchema = Joi.object({
  sessionId: Joi.string().trim().max(128).required(),
  totalTimeMs: Joi.number().integer().min(0).max(3600000).default(0),
});

const chatSchema = Joi.object({
  sessionId: Joi.string().trim().max(128).required(),
  message: Joi.string().trim().min(1).max(500).required(),
});

module.exports = {
  validate,
  contactSchema,
  visitSchema,
  sectionSchema,
  sessionEndSchema,
  chatSchema,
};
