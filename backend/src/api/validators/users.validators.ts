import Joi from 'joi'

export const registerUserSchema = Joi.object({
    username: Joi.string().required().min(2).max(20).messages({
        'string.empty':'Username is required',
        'string.min':'Username should have a minimum length of {#limit} characters',
        'string.max':'Username should have a maximum length of {#limit} characters',
        'any.required':'Username is required',
    }),
    email: Joi.string().required().email({
        minDomainSegments:2,
        tlds:{
            allow:['com','net']
        }
    }).messages({
        'string.empty':'Email is required',
        'string.email':'Email can have two domains, e.g example.com whose tlds can either be ".com" or ".net"',
        'any.required':'Email is required'
    }),
    password: Joi.string().required().pattern(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$')
    ).messages({
        'string.empty':'Password is required',
        'string.pattern.base':'Password must contain atleast one lowercase letter,one uppercase letter, one digit, one special character and a minimum length of 6 characters',
        'any.required':'Password is required'
    }),
})


export const loginUserSchema = Joi.object({
    username: Joi.string().required().min(2).max(20).messages({
        'string.empty':'Username is required',
        'string.min':'Username should have a minimum length of {#limit} characters',
        'string.max':'Username should have a maximum length of {#limit} characters',
        'any.required':'Username is required',
    }),
    password: Joi.string().required().pattern(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$')
    ).messages({
        'string.empty':'Password is required',
        'string.pattern.base':'Password must contain atleast one lowercase letter,one uppercase letter, one digit, one special character and a minimum length of 6 characters',
        'any.required':'Password is required'
    }),
})


export const getUserSchema = Joi.object({
    username: Joi.string().optional().min(2).max(20).messages({
        'string.empty':'Username is required',
        'string.min':'Username should have a minimum length of {#limit} characters',
        'string.max':'Username should have a maximum length of {#limit} characters',
        'any.required':'Username is required',
    }),
    email: Joi.string().optional().email({
        minDomainSegments:2,
        tlds:{
            allow:['com','net']
        }
    }).messages({
        'string.empty':'Email is required',
        'string.email':'Email can have two domains, e.g example.com whose tlds can either be ".com" or ".net"',
        'any.required':'Email is required'
    }),
})


export const updateUserSchema = Joi.object({
    username: Joi.string().required().min(2).max(20).messages({
        'string.empty':'Username is required',
        'string.min':'Username should have a minimum length of {#limit} characters',
        'string.max':'Username should have a maximum length of {#limit} characters',
        'any.required':'Username is required',
    }),
    email: Joi.string().required().email({
        minDomainSegments:2,
        tlds:{
            allow:['com','net']
        }
    }).messages({
        'string.empty':'Email is required',
        'string.email':'Email can have two domains, e.g example.com whose tlds can either be ".com" or ".net"',
        'any.required':'Email is required'
    }),
    password: Joi.string().required().pattern(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$')
    ).messages({
        'string.empty':'Password is required',
        'string.pattern.base':'Password must contain atleast one lowercase letter,one uppercase letter, one digit, one special character and a minimum length of 6 characters',
        'any.required':'Password is required'
    }),
})
