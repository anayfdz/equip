import Accounts from "../../models/accounts";
import { Types } from "mongoose";
import OdooService from "../../services/odoo";

export const queries = {
  testAccQ: async (_: any) => {
    const accounts = await Accounts.find({});
    return accounts.length;
  },
  accountById: async (_: any, { id }: { id: string }) => {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de cuenta inválido");
    }
    const account = await Accounts.findById(id);
    if (!account) {
      throw new Error("Cuenta no encontrada");
    }
    return account;
  },
  accounts: async (
    _: any,
    { name, page = 1, perPage = 20 }: { name?: string; page?: number; perPage?: number }
  ) => {
    const filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }
    const skip = (page - 1) * perPage;
    const accounts = await Accounts.find(filter).skip(skip).limit(perPage);
    return accounts;
  },
  searchOdooClient: async (_: any, { email, name }: { email?: string; name?: string }) => {
    try {
      if (!email && !name) {
        throw new Error("Debe proporcionar email o nombre para buscar");
      }

      let results: any[] = [];

      if (email) {
        const emailResults = await OdooService.getOdooClientInfo(email);
        results = results.concat(emailResults as any[]);
      }

      if (name) {
        const nameResults = await OdooService.getOdooClientByName(name);
        results = results.concat(nameResults as any[]);
      }

      const uniqueResults = results.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      );

      return uniqueResults;
    } catch (error) {
      console.error("Error searching Odoo client:", error);
      throw new Error("Error al buscar cliente en Odoo");
    }
  },
};
