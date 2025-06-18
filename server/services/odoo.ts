import * as xmlrpc from "xmlrpc";

import config from '../config/app'

const {
    odoo: { url, db, uid, password }
} = config

const client = xmlrpc.createClient({ url });

interface OdooPartner {
  name: string;
  email?: string;
  vat?: string;
  street?: string;
  phone?: string;
}

class OdooService {
  /**
   * Buscar cliente en Odoo por email
   * @param email - Email del cliente
   * @returns Información del cliente encontrado
   */
  getOdooClientInfo = async (email: string) => {
    return new Promise((resolve, reject) => {
      client.methodCall(
        "execute_kw",
        [
          db,
          Number(uid),
          password,
          "res.partner",
          "search_read",
          [[["email", "=", email]]],
          { fields: ["name", "vat", "email", "street", "phone"] },
        ],
        (err: any, value: any) => {
          if (err) {
            console.error("Odoo search by email error:", err);
            reject(err);
          } else {
            console.info(`Odoo client search by email: ${email}, found: ${value.length} records`);
            resolve(value);
          }
        }
      );
    });
  };

  /**
   * Buscar cliente en Odoo por nombre
   * @param name - Nombre del cliente
   * @returns Información del cliente encontrado
   */
  getOdooClientByName = async (name: string) => {
    return new Promise((resolve, reject) => {
      client.methodCall(
        "execute_kw",
        [
          db,
          Number(uid),
          password,
          "res.partner",
          "search_read",
          [[["name", "ilike", name]]],
          { fields: ["name", "vat", "email", "street", "phone"] },
        ],
        (err: any, value: any) => {
          if (err) {
            console.error("Odoo search by name error:", err);
            reject(err);
          } else {
            console.info(`Odoo client search by name: ${name}, found: ${value.length} records`);
            resolve(value);
          }
        }
      );
    });
  };

  /**
   * Crear nuevo cliente en Odoo
   * @param partnerData - Datos del cliente a crear
   * @returns ID del cliente creado
   */
  createOdooClient = async (partnerData: OdooPartner) => {
    return new Promise((resolve, reject) => {
      client.methodCall(
        "execute_kw",
        [
          db,
          Number(uid),
          password,
          "res.partner",
          "create",
          [partnerData],
        ],
        (err: any, value: any) => {
          if (err) {
            console.error("Odoo create client error:", err);
            reject(err);
          } else {
            console.info(`Odoo client created: ${value}, data:`, partnerData);
            resolve(value);
          }
        }
      );
    });
  };

  /**
   * Editar cliente existente en Odoo
   * @param partnerId - ID del cliente en Odoo
   * @param partnerData - Datos a actualizar
   * @returns true si se actualizó correctamente
   */
  updateOdooClient = async (partnerId: number, partnerData: Partial<OdooPartner>) => {
    return new Promise((resolve, reject) => {
      client.methodCall(
        "execute_kw",
        [
          db,
          Number(uid),
          password,
          "res.partner",
          "write",
          [[partnerId], partnerData],
        ],
        (err: any, value: any) => {
          if (err) {
            console.error("Odoo update client error:", err);
            reject(err);
          } else {
            console.info(`Odoo client updated: ${partnerId}, data:`, partnerData);
            resolve(value);
          }
        }
      );
    });
  };

  /**
   * Buscar o crear cliente en Odoo (método combinado)
   * @param partnerData - Datos del cliente
   * @returns ID del cliente (existente o creado)
   */
  findOrCreateOdooClient = async (partnerData: OdooPartner) => {
    try {
      // Primero buscar por email si existe
      if (partnerData.email) {
        const existingByEmail = await this.getOdooClientInfo(partnerData.email);
        if (existingByEmail && (existingByEmail as any[]).length > 0) {
          const existing = (existingByEmail as any[])[0];
          console.info(`Odoo client found by email: ${existing.id}`);
          return existing.id;
        }
      }

      // Buscar por nombre si no se encontró por email
      const existingByName = await this.getOdooClientByName(partnerData.name);
      if (existingByName && (existingByName as any[]).length > 0) {
        const existing = (existingByName as any[])[0];
        console.info(`Odoo client found by name: ${existing.id}`);
        return existing.id;
      }

      // Si no existe, crear nuevo cliente
      const newClientId = await this.createOdooClient(partnerData);
      console.info(`Odoo client created: ${newClientId}`);
      return newClientId;

    } catch (error) {
      console.error("Error in findOrCreateOdooClient:", error);
      throw new Error("Error al buscar o crear cliente en Odoo");
    }
  };
}

export default new OdooService();
