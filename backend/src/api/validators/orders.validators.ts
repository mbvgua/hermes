import Joi from 'joi'

export const makeOrderSchema = Joi.object({
    orderDetails:Joi.object({
        itemId:Joi.string().required(),
        itemQuantity:Joi.number().integer().required(),
        itemPrice:Joi.number().integer().required()
    }),
    // precision allows floating point numbers, where precision is the no. of decimal places
    totalPrice:Joi.number().required().precision(2)
})

export const updateOrderSchema = Joi.object({
    orderDetails:Joi.object({
        itemId:Joi.string().required(),
        itemQuantity:Joi.number().integer().required(),
        itemPrice:Joi.number().integer().required()
    }),
    // precision allows floating point numbers, where precision is the no. of decimal places
    totalPrice:Joi.number().required().precision(2)
})