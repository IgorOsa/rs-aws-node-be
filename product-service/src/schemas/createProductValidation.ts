import Joi from 'joi';

const schema = Joi.object({
    title: Joi.string().alphanum().required(),
    description: Joi.string(),
    price: Joi.number().integer(),
    count: Joi.number().integer()
})

export default schema;