export interface Product {
    _id: string;
    productName: string;
    productPrice: number;
    productDescription: string;
    productImage: string;
    category?:{
       categoryName: string;
    } 
    subcategory?: string;
  }
  