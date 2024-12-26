
export interface Orders {
    id:string,
    userId:string,
    orderDetails:{
        itemId:number,
        itemQuantity:number,
        itemPrice:number
    },
    totalPrice:number,
    isCancelled:number
    // paymentMethod:string
}