export const productPrice = (product,currency) => {
    return product?.prices.filter((price) => 
        price.currency.symbol === currency)[0]?.amount
}