import Enmap from "enmap";

import Time from "../utils/Time";

export default class DisplateDB {
  private static instance: DisplateDB;
  private db: Enmap;

  private constructor() {
    this.db = new Enmap({ name: "displate" });
  }

  static getInstance(): DisplateDB {
    if (!DisplateDB.instance) {
      DisplateDB.instance = new DisplateDB();
    }
    return DisplateDB.instance;
  }

  addId(id: string): boolean {
    if (!this.hasId(id)) {
      this.db.set(id, Time.getCurrentTime().getTime());
      return true;
    }
    return false;
  }

  removeId(id: string): boolean {
    if (this.hasId(id)) {
      this.db.delete(id);
      return true;
    }
    return false;
  }

  hasId(id: string): boolean {
    return this.db.has(id);
  }
}
