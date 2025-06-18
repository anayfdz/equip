import Accounts from "../../models/accounts";
import OdooService from "../../services/odoo";
import { Types } from "mongoose";

export const mutations = {
  testAccM: async (_: any) => {
    return true;
  },
  createAccount: async (_: any, { input }: { input: { name: string; email: string } }) => {
    const { name, email } = input;
    if (!name || !email) {
      throw new Error("Nombre y correo electrónico son obligatorios");
    }
    // Validar que el email no exista
    const exists = await Accounts.findOne({ email });
    if (exists) {
      throw new Error("Ya existe una cuenta con ese correo electrónico");
    }
    try {
      const account = await Accounts.create({ name, email });
      console.info(`Account created: ${account._id}`);
      return account;
    } catch (err) {
      console.error("Error creating account", err);
      throw new Error("Error al crear la cuenta");
    }
  },
  createOdooClient: async (_: any, { input }: { input: { name: string; email?: string; vat?: string; street?: string; phone?: string } }) => {
    try {
      const clientId = await OdooService.createOdooClient(input);
      return {
        success: true,
        message: "Cliente creado exitosamente en Odoo",
        clientId: clientId as number,
        clientData: null
      };
    } catch (error) {
      console.error("Error creating Odoo client:", error);
      return {
        success: false,
        message: "Error al crear cliente en Odoo",
        clientId: null,
        clientData: null
      };
    }
  },
  updateOdooClient: async (_: any, { clientId, input }: { clientId: number; input: { name?: string; email?: string; vat?: string; street?: string; phone?: string } }) => {
    try {
      await OdooService.updateOdooClient(clientId, input);
      return {
        success: true,
        message: "Cliente actualizado exitosamente en Odoo",
        clientId: clientId,
        clientData: null
      };
    } catch (error) {
      console.error("Error updating Odoo client:", error);
      return {
        success: false,
        message: "Error al actualizar cliente en Odoo",
        clientId: null,
        clientData: null
      };
    }
  },
  syncAccountWithOdoo: async (_: any, { accountId }: { accountId: string }) => {
    try {
      if (!Types.ObjectId.isValid(accountId)) {
        throw new Error("ID de cuenta inválido");
      }

      const account = await Accounts.findById(accountId);
      if (!account) {
        throw new Error("Cuenta no encontrada");
      }

      const odooClientId = await OdooService.findOrCreateOdooClient({
        name: account.name,
        email: account.email
      });

      return {
        success: true,
        message: "Cuenta sincronizada exitosamente con Odoo",
        clientId: odooClientId as number,
        clientData: null
      };
    } catch (error) {
      console.error("Error syncing account with Odoo:", error);
      return {
        success: false,
        message: "Error al sincronizar cuenta con Odoo",
        clientId: null,
        clientData: null
      };
    }
  },
};
