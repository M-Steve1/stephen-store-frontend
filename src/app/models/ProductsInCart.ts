export interface ProductsInCart {
    id?: number
    name: string
    price: number
    url: string,
    category: string,
    description: string,
    quantity?: number,
    cartId?: number
    productInCartId?: number
}