export interface Cart {
    id?: number,
    user_id: number,
    status: string
}

export interface CartProduct {
    id?: number
    cart_id: number
    product_id: number
    product_quantity: number
}