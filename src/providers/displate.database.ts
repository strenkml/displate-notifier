import { Database } from "enmap-wrapper";

import DisplateItem from "../models/DisplateItem";

export default class DisplateDB extends Database {
  private static instance: DisplateDB;

  private constructor() {
    super({
      name: "displate"
    })
  }

  static getInstance(): DisplateDB {
    return this.instance || (this.instance = new this());
  }

  addItem(id: string, info: DisplateItem, embedMessageId: string, mentionMessageId: string): boolean {
    if (!this.hasItem(id)) {
      const item: IDisplateDBItem = {
        info: info,
        embedMessageId: embedMessageId,
        mentionMessageId: mentionMessageId,
        deleted: false,
      };
      this.db.set(id, item);
      return true;
    }
    return false;
  }

  removeItem(id: string): boolean {
    if (this.hasItem(id)) {
      this.db.delete(id);
      return true;
    }
    return false;
  }

  updateInfo(id: string, newInfo: DisplateItem): boolean {
    if (this.hasItem(id)) {
      this.db.set(id, newInfo, "info");
      return true;
    }
    return false;
  }

  hasItem(id: string): boolean {
    return this.db.has(id);
  }

  getItem(id: string): IDisplateDBItem {
    return this.db.get(id);
  }

  markItemDeleted(id: string): boolean {
    if (this.hasItem(id)) {
      this.db.set(id, true, "deleted");
      return true;
    }
    return false;
  }

  isItemDeleted(id: string): boolean {
    return this.db.get(id).deleted;
  }
}

interface IDisplateDBItem {
  info: DisplateItem;
  embedMessageId: string;
  mentionMessageId: string;
  deleted: boolean;
}
