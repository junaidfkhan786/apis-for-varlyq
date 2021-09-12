const Joi = require('@hapi/joi')

const authSchema = Joi.object({
  email: Joi.string().email().lowercase(),
  password: Joi.string().min(2).optional(),
})


module.exports = {
  authSchema
}
