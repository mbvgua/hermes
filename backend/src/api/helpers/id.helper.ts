import crypto from "crypto"

export function generateRandomnId(){
    /*
    * generate a BIGNINT randomn int value to be used
    * as an unique ID. aimed at replacing the uuid module
    * that returns a string hence cannot have a default 
    * auto-incrementing value
    */
    const buf = crypto.randomBytes(8)
    return buf.readBigUInt64BE()
}
