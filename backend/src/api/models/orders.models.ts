
export interface Orders {
    id:number,
    userId:number,
    orderDetails:{
        itemId:number,
        itemQuantity:number,
        itemPrice:number
    },
    totalPrice:number,
    isCancelled:number
    // paymentMethod:string
}