import Products from "../../models/products";
import { Types } from "mongoose";

export const queries = {
  testProdQ: async (_: any) => {
    const products = await Products.find({});
    return products.length;
  },
  productById: async (_: any, { id }: { id: string }) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de producto inválido");
    }
    const product = await Products.findById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  },
  products: async (
    _: any,
    { accountId, page = 1, perPage = 20 }: { accountId?: string; page?: number; perPage?: number }
  ) => {
    const filter: any = {};
    if (accountId) {
      filter.accountId = accountId;
    }
    const skip = (page - 1) * perPage;
    const products = await Products.find(filter).skip(skip).limit(perPage);
    return products;
  },
};
