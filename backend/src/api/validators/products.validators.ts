import Joi from "joi";

export const addProductSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(20).messages({
    "string.base": "Product name must be a string",
    "any.required": "Product name is required",
    "string.trim": "Product name cannot contain whitespace before or after it",
    "string.min":
      "Product name should have a minimum length of {#limit} characters",
    "string.max":
      "Product name should have a maximum length of {#limit} characters",
  }),
  category: Joi.string()
    .required()
    .valid("electronics", "clothing", "sports", "stationery", "food", "toys")
    .messages({
      "string.base": "Product category must be a string",
      "any.required": "Product category is required",
      "any.valid":
        "Product category can only be between 'electronics', 'clothing', 'sports', 'stationery', 'food', 'toys'",
    }),
  description: Joi.string().required().max(500).messages({
    "string.base": "Product description must be a string",
    "any.required": "Product description is required",
    "string.max": "Product description cannot exceed {#limit} characters",
  }),
  image: Joi.string().required().messages({
    "string.base": "Product image must be a string",
    "any.required": "Product image is required",
  }),
  //TODO: enforce decimal number accurracy, i.e (10,2)
  price: Joi.number().required().min(1).max(1000000).precision(2).messages({
    "number.base": "Product price must be a string",
    "any.required": "Product price is required",
    "number.min": "Product price cannot be lower than {#limit}",
    "number.max": "Product price cannot exceed {#limit}",
    "number.integer": "Produc needs to be to 2 decimal places",
  }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().required().min(2).max(20).messages({
    "string.empty": "A name is required",
    "string.min": "A name should have a minimum length of {#limit} characters",
    "string.max": "A name should have a maximum length of {#limit} characters",
    "any.required": "A name is required",
  }),
  description: Joi.string().required().max(500).messages({
    "string.empty": "A description is required",
    "string.max":
      "A description should have a maximum length of {#limit} characters",
    "any.required": "A description is required",
  }),
  image: Joi.string().required().messages({
    "string.empty": "An image is required",
    "any.required": "An image is required",
  }),
  price: Joi.number().required().messages({
    "number.base": "A price is required",
    "any.required": "A price is required",
  }),
  inStock: Joi.number().required().messages({
    "number.base": "Stock quantity is required",
    "any.required": "Stock quantity is required",
  }),
});
