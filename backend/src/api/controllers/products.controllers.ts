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
      console.log(
        `Product ${name} of ${id} has succesfully been added to the system`,
      );

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

// // get product by id
// export async function getProductById(request:Request<{id:string}>,response:Response){
//     const id = request.params.id
//     try {
//         const [rows,fields] = await pool.query(
//             `SELECT * FROM products
//             WHERE id='${id}'
//             AND isDeleted=0;`
//         )
//         const [product] = rows as Array<Products>
//         if(product){
//             return response.status(200).send(product)
//         } else {
//             return response.status(401).json({error:`Product does not exist. Try again?`})
//         }
//     } catch(error){
//         console.error('An error occured: ',error)
//         return response.status(500).json({error:error})
//     }
// }
//
// // get products
// export async function getProducts(request:Request,response:Response){
//     try{
//         const [rows,fields] = await pool.query(
//             `SELECT * FROM products
//             WHERE isDeleted=0;`
//         )
//         const products = rows as Array<Products[]>
//         if(products.length != 0){
//             return response.status(200).send(products)
//         } else {
//             return response.status(401).json({error:`There are currently no products. Try again later?`})
//         }
//     } catch(error) {
//         console.error('An error occured: ',error)
//         return response.status(500).json({error:error})
//     }
// }
//
// // update product
// export async function updateProduct(request:Request<{id:string}>,response:Response){
//     const id = request.params.id
//     const{name,description,image,price,inStock} = request.body
//     const {error} = updateProductSchema.validate(request.body)
//     try{
//         if(error){
//             return response.status(401).json({error:error.details[0].message})
//         } else {
//             const [rows,fields] = await pool.query(
//                 `SELECT * FROM products WHERE id='${id}';`
//             )
//             const [product] = rows as Array<Products>
//             if(product){
//                 await pool.query(
//                     `UPDATE products SET
//                     name='${name}',
//                     description='${description}',
//                     image='${image}',
//                     price='${price}',
//                     inStock='${inStock}'
//                     WHERE id='${id}'
//                     AND isDeleted=0;`
//                 )
//                 return response.status(200).json({success:`You have succesfully updated the ${product.name}!`})
//             } else {
//                 return response.status(401).json({error:`The product does not seem to exist. Try again later?`})
//             }
//         }
//     } catch(error) {
//         console.error('An error occurred: ',error)
//         return response.status(500).json({error:error})
//     }
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
