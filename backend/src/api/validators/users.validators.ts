import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string()
    .required()
    .alphanum()
    .lowercase()
    .trim()
    .min(3)
    .max(20)
    .messages({
      "string.base": "Username must be a string",
      "any.required": "Username is required",
      "string.alphanum":
        "Username can only contain letters(a-z) and digits(0-9)",
      "string.lowercase": "Username can only be in lowercase",
      "string.trim": "Username cannot contain whitespace before or after it",
      "string.min": "Username must have a minimum of {#limit} characters",
      "string.max": "Username must have a maximum of {#limit} characters",
    }),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net"],
      },
    })
    .messages({
      "string.base": "Email msut be a string",
      "any.required": "Email is required",
      "string.email":
        "Email can only have two domains, e.g example.com whose tlds can either be '.com' or '.net'",
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$",
      ),
    )
    .messages({
      "string.base": "Password must be a string",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must contain atleast one lowercase letter,one uppercase letter, one digit and one special character",
    }),
});

export const loginUserSchema = Joi.object({
  username: Joi.string()
    .required()
    .alphanum()
    .lowercase()
    .trim()
    .min(3)
    .max(20)
    .messages({
      "string.base": "Username must be a string",
      "any.required": "Username is required",
      "string.alphanum":
        "Username can only contain letters(a-z) and digits(0-9)",
      "string.lowercase": "Username can only be in lowercase",
      "string.trim": "Username cannot contain whitespace before or after it",
      "string.min": "Username must have a minimum of {#limit} characters",
      "string.max": "Username must have a maximum of {#limit} characters",
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$",
      ),
    )
    .messages({
      "string.base": "Password must be a string",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must contain atleast one lowercase letter,one uppercase letter, one digit and one special character",
    }),
});

export const getUserSchema = Joi.object({
  role: Joi.string().optional().valid("admin", "customer").messages({
    "string.base": "Role must be of type string",
    "any.valid": "Role can either be 'admin' or 'customer'",
  }),
});

export const updateUserSchema = Joi.object({
  username: Joi.string()
    .required()
    .alphanum()
    .lowercase()
    .trim()
    .min(3)
    .max(20)
    .messages({
      "string.base": "Username must be a string",
      "any.required": "Username is required",
      "string.alphanum":
        "Username can only contain letters(a-z) and digits(0-9)",
      "string.lowercase": "Username can only be in lowercase",
      "string.trim": "Username cannot contain whitespace before or after it",
      "string.min": "Username must have a minimum of {#limit} characters",
      "string.max": "Username must have a maximum of {#limit} characters",
    }),
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: {
        allow: ["com", "net"],
      },
    })
    .messages({
      "string.base": "Email msut be a string",
      "any.required": "Email is required",
      "string.email":
        "Email can only have two domains, e.g example.com whose tlds can either be '.com' or '.net'",
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,10}$",
      ),
    )
    .messages({
      "string.base": "Password must be a string",
      "any.required": "Password is required",
      "string.pattern.base":
        "Password must contain atleast one lowercase letter,one uppercase letter, one digit and one special character",
    }),
});
