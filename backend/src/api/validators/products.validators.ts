import Joi from 'joi'


export const addProductSchema = Joi.object({
    name:Joi.string().required().min(2).max(20).messages({
        'string.empty':'A name is required',
        'string.min':'A name should have a minimum length of {#limit} characters',
        'string.max':'A name should have a maximum length of {#limit} characters',
        'any.required':'A name is required',
    }),
    description:Joi.string().required().max(500).messages({
        'string.empty':'A description is required',
        'string.max':'A description should have a maximum length of {#limit} characters',
        'any.required':'A description is required'
    }),
    image:Joi.string().required().messages({
        'string.empty':'An image is required',
        'any.required':'An image is required'
    }),
    price:Joi.number().required().messages({
        'number.base':'A price is required',
        'any.required':'A price is required'
    }),
    inStock:Joi.number().required().messages({
        'number.base':'Stock quantity is required',
        'any.required':'Stock quantity is required'

    })
})

export const updateProductSchema = Joi.object({
    name:Joi.string().required().min(2).max(20).messages({
        'string.empty':'A name is required',
        'string.min':'A name should have a minimum length of {#limit} characters',
        'string.max':'A name should have a maximum length of {#limit} characters',
        'any.required':'A name is required',
    }),
    description:Joi.string().required().max(500).messages({
        'string.empty':'A description is required',
        'string.max':'A description should have a maximum length of {#limit} characters',
        'any.required':'A description is required'
    }),
    image:Joi.string().required().messages({
        'string.empty':'An image is required',
        'any.required':'An image is required'
    }),
    price:Joi.number().required().messages({
        'number.base':'A price is required',
        'any.required':'A price is required'
    }),
    inStock:Joi.number().required().messages({
        'number.base':'Stock quantity is required',
        'any.required':'Stock quantity is required'

    })
})
