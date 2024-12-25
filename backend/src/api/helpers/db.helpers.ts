import mysql from 'mysql2/promise'
import { sqlConfig } from '../../config'


export const pool = mysql.createPool(sqlConfig)