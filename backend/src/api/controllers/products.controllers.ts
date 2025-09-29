import { Request, Response } from "express";
import { v4 as uid } from "uuid";

import { pool } from "../../config/db.config";
import { IProducts } from "../models/products.models";
import {
  addProductSchema,
  updateProductSchema,
} from "../validators/products.validators";
import { validationHelper } from "../helpers/validator.helpers";
import { logger } from "../../config/winston.config";

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
   */
  const category = request.query.category as string;
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
      "CALL getProductByCategory(?);",
      [category],
    );
    const [products] = rows[0] as Array<IProducts>;

    if (products) {
      // log request
      logger.log({
        level: "info",
        message: `Succesfully retrieved items under the ${category} category.`,
        data: {
          products: {
            // begin pagination to return this better
          },
        },
      });
      // return response
      return response.status(200).json({
        code: 200,
        status: "success",
        message:
          "Succesfully retrieved products under the ${category} category",
        data: {
          products: {
            // begin pagination to return this better
          },
        },
      });
    }
    // log request
    logger.log({
      level: "error",
      message: `Error fetching products in the ${category} category.`,
      data: {
        products: {
          // begin pagination to return this better
        },
      },
    });
    // return response
    return response.status(404).json({
      code: 404,
      status: "error",
      message: `No products found in the ${category} category`,
      data: {
        products: {
          // begin pagination to return this better
        },
      },
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
   */
  try {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute(`CALL getProducts();`);
    const [products] = rows[0] as Array<IProducts>;
    connection.release();

    if (products) {
      //log action
      logger.log({
        level: "info",
        message: "Succesfully retrieved all products in the system",
        data: {
          products: {
            // begin pagination to return this better
          },
        },
      });
      //return response
      return response.status(200).json({
        code: 200,
        status: "error",
        message: "Succesfully retrieved all products in the system",
        data: {
          products: {
            // begin pagination to return this better
          },
        },
        metadata: null,
      });
    }
    // log request
    logger.log({
      level: "error",
      message: `Error fetching products in the system`,
      data: {
        products: {
          // begin pagination to return this better
        },
      },
    });
    // return response
    return response.status(404).json({
      code: 404,
      status: "error",
      message: `No products found in the system. Try again later`,
      data: {
        products: {
          // begin pagination to return this better
        },
      },
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
//
// // delete  product
// export async function deleteProduct(request:Request<{id:string}>,response:Response){
//     const id = request.params.id
//     try{
//         const [rows,fields] = await pool.query(
//             `SELECT * FROM products
//             WHERE id='${id}'
//             AND isDeleted=0;`
//         )
//         const [product] = rows as Array<Products>
//         if(product){
//             await pool.query(
//                 `UPDATE products SET isDeleted=1 WHERE id='${id}';`
//             )
//             return response.status(200).json({success:`You have successfuly deleted ${product.name} from the records!`})
//         } else {
//             return response.status(401).json({error:`It looks like the product does not exists. Try again?`})
//         }
//     } catch(error){
//         console.error('An error occurred: ',error)
//         return response.status(500).json({error:error})
//     }
// }
