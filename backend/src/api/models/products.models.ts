export enum ProductCategory {
  Electronics = "electronics",
  Clothing = "clothing",
  Sports = "sports",
  Stationery = "stationery",
  Food = "food",
  Toys = "toys",
}
export interface IProducts {
  id: BigInt;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  price: number;
}

