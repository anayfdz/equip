import Products from "../../models/products";
import Accounts from "../../models/accounts";
import { Types } from "mongoose";

export const mutations = {
  testProdM: async (_: any) => {
    return true;
  },
  createProduct: async (_: any, { input }: { input: { name: string; sku: string; stock: number; accountId?: string } }) => {
    const { name, sku, stock, accountId } = input;
    
    if (!name || !sku || stock === undefined) {
      throw new Error("Nombre, SKU y stock son obligatorios");
    }
    
    if (stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }
    
    const exists = await Products.findOne({ sku });
    if (exists) {
      throw new Error("Ya existe un producto con ese SKU");
    }
    
    try {
      const product = await Products.create({ name, sku, stock, accountId });
      console.info(`Product created: ${product._id}`);
      return product;
    } catch (err) {
      console.error("Error creating product", err);
      throw new Error("Error al crear el producto");
    }
  },
  purchaseProduct: async (_: any, { accountId, productId, quantity }: { accountId: string; productId: string; quantity: number }) => {
    if (!Types.ObjectId.isValid(accountId)) {
      throw new Error("ID de cuenta inválido");
    }
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error("ID de producto inválido");
    }
    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }

    try {
      const account = await Accounts.findById(accountId);
      if (!account) {
        return {
          success: false,
          message: "Cuenta no encontrada",
          remainingStock: null
        };
      }

      const product = await Products.findById(productId);
      if (!product) {
        return {
          success: false,
          message: "Producto no encontrado",
          remainingStock: null
        };
      }

      if (product.stock < quantity) {
        return {
          success: false,
          message: `Stock insuficiente. Disponible: ${product.stock}, Solicitado: ${quantity}`,
          remainingStock: product.stock
        };
      }

      const newStock = product.stock - quantity;
      await Products.findByIdAndUpdate(productId, { stock: newStock });

      console.info(`Purchase successful: Product ${productId}, Quantity ${quantity}, Remaining stock ${newStock}`);

      return {
        success: true,
        message: `Compra exitosa. Se vendieron ${quantity} unidades de ${product.name}`,
        remainingStock: newStock
      };

    } catch (err) {
      console.error("Error in purchase", err);
      throw new Error("Error al procesar la compra");
    }
  },
};
