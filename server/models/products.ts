import { Schema } from "mongoose";

import { IProduct } from "../interfaces/product";

import { cnxProducts } from "../db/mongodb";

const productsSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    accountId: { type: String, required: false },
  },
  { timestamps: true }
);

const Products = cnxProducts.model<IProduct>("Products", productsSchema);

export default Products;
