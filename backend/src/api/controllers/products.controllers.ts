import { Request,Response } from 'express'
import {pool} from '../../config/db.config'
import { Products } from '../models/products.models'
import { addProductSchema, updateProductSchema } from '../validators/products.validators'

// add product
export async function addProduct(request:Request,response:Response){
    const {name,description,image,price,inStock} = request.body
    const { error } = addProductSchema.validate(request.body)
    try{
        if(error){
            return response.status(401).json({error:error.details[0].message})
        } else {
            console.log(name,description,image,price,inStock)
            await pool.query(
                `INSERT INTO products(name,description,image,price,inStock) VALUES (
                    '${name}',
                    '${description}',
                    '${image}',
                    '${price}',
                    '${inStock}'
                );`
            )
            return response.status(200).json({success:`${name} has been added succesfully!`})
        }
    } catch(error) {
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}

// get product by id
export async function getProductById(request:Request<{id:string}>,response:Response){
    const id = request.params.id
    try {
        const [rows,fields] = await pool.query(
            `SELECT * FROM products
            WHERE id='${id}'
            AND isDeleted=0;`
        )
        const [product] = rows as Array<Products>
        if(product){
            return response.status(200).send(product)
        } else {
            return response.status(401).json({error:`Product does not exist. Try again?`})
        }
    } catch(error){
        console.error('An error occured: ',error)
        return response.status(500).json({error:error})
    }
}

// get products
export async function getProducts(request:Request,response:Response){
    try{
        const [rows,fields] = await pool.query(
            `SELECT * FROM products
            WHERE isDeleted=0;`
        )
        const products = rows as Array<Products[]>
        if(products.length != 0){
            return response.status(200).send(products)
        } else {
            return response.status(401).json({error:`There are currently no products. Try again later?`})
        }
    } catch(error) {
        console.error('An error occured: ',error)
        return response.status(500).json({error:error})
    }
}

// update product
export async function updateProduct(request:Request<{id:string}>,response:Response){
    const id = request.params.id
    const{name,description,image,price,inStock} = request.body
    const {error} = updateProductSchema.validate(request.body)
    try{
        if(error){
            return response.status(401).json({error:error.details[0].message})
        } else {
            const [rows,fields] = await pool.query(
                `SELECT * FROM products WHERE id='${id}';`
            )
            const [product] = rows as Array<Products>
            if(product){
                await pool.query(
                    `UPDATE products SET
                    name='${name}',
                    description='${description}',
                    image='${image}',
                    price='${price}',
                    inStock='${inStock}'
                    WHERE id='${id}'
                    AND isDeleted=0;`
                )
                return response.status(200).json({success:`You have succesfully updated the ${product.name}!`})
            } else {
                return response.status(401).json({error:`The product does not seem to exist. Try again later?`})
            }
        }
    } catch(error) {
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}

// delete  product
export async function deleteProduct(request:Request<{id:string}>,response:Response){
    const id = request.params.id
    try{
        const [rows,fields] = await pool.query(
            `SELECT * FROM products
            WHERE id='${id}'
            AND isDeleted=0;`
        )
        const [product] = rows as Array<Products>
        if(product){
            await pool.query(
                `UPDATE products SET isDeleted=1 WHERE id='${id}';`
            )
            return response.status(200).json({success:`You have successfuly deleted ${product.name} from the records!`})
        } else {
            return response.status(401).json({error:`It looks like the product does not exists. Try again?`})
        }
    } catch(error){
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}
