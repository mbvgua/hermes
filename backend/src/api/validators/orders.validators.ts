import Joi from 'joi'

export const makeOrderSchema = Joi.object({
    orderDetails:Joi.object({
        itemId:Joi.number().required().messages({
            'number.base':'Item id must be a number',
            'number.integer':'Item id is not a valid integer',
            'any.required':'An item id is required'
        }),
        itemQuantity:Joi.number().integer().required().messages({
            'number.base':'item quantity must be a number',
            'number.integer':'Item quantity is not a valid integer',
            'any.required':'Item quantity is required'
        }),
        itemPrice:Joi.number().required().integer().precision(2).messages({
            'number.base':'Item price must be a number',
            'number.integer':'Item price is not a valid integer',
            'number.precision':'Item price can only have {#limit} decimal places',
            'any.required':'Item price is required'
        })
    }),
    // precision allows floating point numbers, where precision is the no. of decimal places
    totalPrice:Joi.number().required().precision(2).messages({
        'number.base':'Total price must be a number',
        'number.integer':'Total price is not a valid integer',
        'number.precision':'Total price can only have {#limit} decimal places',
        'any.required':'Total price is required'
    })
})

export const updateOrderSchema = Joi.object({
    orderDetails:Joi.object({
        itemId:Joi.number().required().messages({
            'number.base':'Item id must be a number',
            'number.integer':'Item id is not a valid integer',
            'any.required':'An item id is required'
        }),
        itemQuantity:Joi.number().integer().required().messages({
            'number.base':'item quantity must be a number',
            'number.integer':'Item quantity is not a valid integer',
            'any.required':'Item quantity is required'
        }),
        itemPrice:Joi.number().required().integer().precision(2).messages({
            'number.base':'Item price must be a number',
            'number.integer':'Item price is not a valid integer',
            'number.precision':'Item price can only have {#limit} decimal places',
            'any.required':'Item price is required'
        })
    }),
    // precision allows floating point numbers, where precision is the no. of decimal places
    totalPrice:Joi.number().required().precision(2).messages({
        'number.base':'Total price must be a number',
        'number.integer':'Total price is not a valid integer',
        'number.precision':'Total price can only have {#limit} decimal places',
        'any.required':'Total price is required'
    })
})
