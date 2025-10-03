import { Request, Response } from "express";
import { v4 as uid } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

import { pool } from "../../config/db.config";
import { IProducts } from "../models/products.models";
import {
  addProductSchema,
  updateProductSchema,
} from "../validators/products.validators";
import { validationHelper } from "../helpers/validator.helpers";
import { logger } from "../../config/winston.config";
import { IPayload, UserRoles } from "../models/users.models";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// add product
export async function addProduct(request: Request, response: Response) {
  /*
   * adds new products into the system
   */

  const id = uid();
  const { name, category, description, image, price } = request.body;
  try {
    // check for errors in request schema
    const is_valid_request = await validationHelper(
      request,
      response,
      addProductSchema,
    );

    // if no error present
    if (is_valid_request) {
      // make connection to db and add product
      const connection = await pool.getConnection();
      const [rows]: any = await connection.execute(
        `CALL addProduct(?,?,?,?,?,?);`,
        [id, name, category, description, image, price],
      );
      const product = rows[0] as Array<IProducts>;

      //release db connection
      connection.release();

      //log information
      logger.log({
        level: "info",
        message: `Product ${name} of ${id} has succesfully been added to the system`,
        data: {
          product: {
            id: id,
            name: name,
            category: category,
          },
        },
      });

      //return success response
      return response.status(201).json({
        code: 201,
        status: "success",
        message: `Succesfully added ${name} into the system!`,
        data: {
          product: {
            id: id,
            name: name,
            category: category,
          },
        },
        metadata: null,
      });
    }
    //elif errors found
  } catch (error) {
    // log the error
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    // return respnse
    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}

export async function getProductById(
  request: Request<{ id: string }>,
  response: Response,
) {
  /*
   * get a specific product by its id
   */
  const id = request.params.id;
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute("CALL getProductById(?);", [
      id,
    ]);
    const [product] = rows[0] as Array<IProducts>;

    // if product exists
    if (product) {
      //log the action
      logger.log({
        level: "info",
        message: `Succesfully retrieved the ${product.name} of id:${product.id} from the database`,
        data: {
          product: {
            id: product.id,
            name: product.name,
            category: product.category,
          },
        },
      });

      //return success response
      return response.status(200).json({
        code: 200,
        status: "success",
        message: `Succesfully retrieved the ${product.name} of id:${product.id} from the database`,
        data: {
          product: {
            id: product.id,
            name: product.name,
            category: product.category,
          },
        },
        metadata: null,
      });
    }
    // else if no product return and log error
    logger.log({
      level: "error",
      message: `Tried fetching product of id: ${id} which does not exist.`,
      data: null,
    });

    return response.status(401).json({
      code: 401,
      status: "error",
      message: `Product of id:${id} does not exist in the database`,
      data: null,
      metadata: null,
    });
  } catch (error) {
    // log the error
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    // return respnse
    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}

export async function getProductsByCategory(
  request: Request,
  response: Response,
) {
  /*
   * get products from the db with their categories
   * not a request, but instead in the URL, say 123/get/eectronics
   * pagination implemented with limit-offset
   */
  const category = request.query.category as string;
  //defaults to page 1 and limit of 10 if none passed
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const connection = await pool.getConnection();
    // get total num of products in given category
    const [results]: any = await connection.query(
      `SELECT COUNT(*) AS total FROM products WHERE category=?;`,
      [category],
    );
    const totalItems = results[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // get paginated query based on user input
    const [rows]: any = await connection.query(
      `SELECT * FROM products WHERE category=? LIMIT ? OFFSET ? ;`,
      [category, limit, offset],
    );
    const products = rows as Array<IProducts>;
    connection.release();

    if (products) {
      // log request
      logger.log({
        level: "info",
        message: `Succesfully retrieved ${limit} items under the ${category} category.`,
        data: `totalItems: ${totalItems}`,
        metadata: {
          previousPage: +page - 1,
          currentPage: +page,
          nextPage: +page + 1,
          totalPages,
          totalItems,
        },
      });
      // return response
      return response.status(200).json({
        code: 200,
        status: "success",
        message: `Succesfully retrieved products under the ${category} category`,
        data: {
          products: {
            products,
          },
        },
        metadata: {
          previousPage: +page - 1,
          currentPage: +page,
          nextPage: +page + 1,
          totalPages,
          totalItems,
        },
      });
    }
    // log request
    logger.log({
      level: "error",
      message: `Error fetching products in the ${category} category.`,
      data: null,
      metadata: null,
    });
    // return response
    return response.status(404).json({
      code: 404,
      status: "error",
      message: `No products found in the ${category} category`,
      data: null,
      metadata: null,
    });
  } catch (error) {
    // log the error
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    // return respnse
    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}

export async function getProducts(request: Request, response: Response) {
  /*
   * get all products from the system
   * implement pagination with limit-offset
   */
  const page = parseInt(request.query.page as string) || 1;
  const limit = parseInt(request.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    const connection = await pool.getConnection();
    // get total num of products
    const [results]: any = await connection.query(
      `SELECT COUNT(*) AS total FROM products;`,
    );
    const totalItems = results[0].total;
    const totalPages = Math.ceil(totalItems / limit);

    // get paginated query from user input
    const [rows]: any = await connection.query(
      `SELECT * FROM products LIMIT ? OFFSET ?;`,
      [limit, offset],
    );
    const products = rows as Array<IProducts>;
    connection.release();

    if (products) {
      //log action
      logger.log({
        level: "info",
        message: "Succesfully retrieved all products in the system",
        data: `totalItems: ${totalItems}`,
        metadata: {
          previousPage: +page - 1,
          currentPage: +page,
          nextPage: +page + 1,
          totalPages,
          totalItems,
        },
      });
      //return response
      return response.status(200).json({
        code: 200,
        status: "error",
        message: "Succesfully retrieved all products in the system",
        data: {
          products: {
            products,
          },
        },
        metadata: {
          previousPage: +page - 1,
          currentPage: +page,
          nextPage: +page + 1,
          totalPages,
          totalItems,
        },
      });
    }
    // log request
    logger.log({
      level: "error",
      message: `Error fetching products in the system`,
      data: null,
      metadata: null,
    });
    // return response
    return response.status(404).json({
      code: 404,
      status: "error",
      message: `No products found in the system. Try again later`,
      data: null,
      metadata: null,
    });
  } catch (error) {
    // log the error
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    // return respnse
    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}

// // update product
// export async function updateProduct(
//   request: Request<{ id: string }>,
//   response: Response,
// ) {
//   const id = request.params.id;
//   const { name, description, image, price, inStock } = request.body;
//   const { error } = updateProductSchema.validate(request.body);
//   try {
//     if (error) {
//       return response.status(401).json({ error: error.details[0].message });
//     } else {
//       const [rows, fields] = await pool.query(
//         `SELECT * FROM products WHERE id='${id}';`,
//       );
//       const [product] = rows as Array<Products>;
//       if (product) {
//         await pool.query(
//           `UPDATE products SET
//                     name='${name}',
//                     description='${description}',
//                     image='${image}',
//                     price='${price}',
//                     inStock='${inStock}'
//                     WHERE id='${id}'
//                     AND isDeleted=0;`,
//         );
//         return response
//           .status(200)
//           .json({
//             success: `You have succesfully updated the ${product.name}!`,
//           });
//       } else {
//         return response
//           .status(401)
//           .json({
//             error: `The product does not seem to exist. Try again later?`,
//           });
//       }
//     }
//   } catch (error) {
//     console.error("An error occurred: ", error);
//     return response.status(500).json({ error: error });
//   }
// }

export async function deleteProduct(request: Request, response: Response) {
  /*
   * soft delete a product from the db
   * user id gotten from token. if admin delete item
   */
  //get items to delete id
  const product_id = request.query.id as string;

  try {
    const token = request.headers["token"];
    const decoded_token = jwt.verify(
      token,
      process.env.SECRET_KEY as string,
    ) as IPayload;
    const user_id = decoded_token.id;
    const user_role = decoded_token.role;

    // if user role is an admin
    if (user_role == UserRoles.Admin) {
      const connection = await pool.getConnection();
      const [rows]: any = await connection.execute(`CALL getProductById(?);`, [
        product_id,
      ]);
      const [product] = rows[0] as Array<IProducts>;

      //if product exists
      if (product) {
        await pool.query(
          `UPDATE products SET isDeleted=1 WHERE id='${product_id}';`,
        );
        return response.status(200).json({
          success: `You have successfuly deleted ${product.name} from the records!`,
        });
      }
      //else if it was already deleted

      return response.status(401).json({
        error: `It looks like the product does not exists. Try again?`,
      });
    }
    // else not authorize
  } catch (error) {
    console.error("An error occurred: ", error);
    return response.status(500).json({ error: error });
  }
}
