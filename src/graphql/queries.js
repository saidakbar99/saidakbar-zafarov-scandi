import { gql } from "@apollo/client";

export const fetchProducts = gql`
  query Category($title: String!) {
    category(input: { title: $title }) {
      products {
        id
        name
        brand
        inStock
        gallery
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        attributes {
          name
          items {
            value
          }
        }
      }
    }
  }
`;

export const fetchCategories = gql`
  query {
    categories {
      name
    }
  }
`;

export const fetchProduct = gql`
  query Product($id: String!) {
    product(id: $id) {
      id
      brand
      name

      inStock
      gallery
      description
      attributes {
        name
        type
        items {
          value
        }
      }

      prices {
        currency {
          label
          symbol
        }
        amount
      }
      inStock
    }
  }
`;

export const fetchCurrencies = gql`
    query {
        currencies {
            label
            symbol
        }
    }
`