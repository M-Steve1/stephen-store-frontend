export interface ProductsInCart {
    id?: number | string
    name: string
    price: number
    url: string,
    category: string,
    description: string,
    quantity?: number,
    cartId?: number | string
    productInCartId?: string | number
}