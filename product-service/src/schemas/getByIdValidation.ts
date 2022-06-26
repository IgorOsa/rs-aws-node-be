import Joi from 'joi';

const schema = Joi.string().uuid().required();

export default schema;