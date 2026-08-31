import Enmap from "enmap";
import Logger from "../utils/Logger";

import DisplateItem, { DisplateStatus } from "../models/DisplateItem";

export default class DisplateDB {
  private static instance: DisplateDB;
  private db: Enmap<string, IDisplateDBItem>;

  private constructor() {
    this.db = new Enmap({ name: "displate" });
  }

  static getInstance(): DisplateDB {
    if (!DisplateDB.instance) {
      DisplateDB.instance = new DisplateDB();
    }
    return DisplateDB.instance;
  }

  addItem(id: string, info: DisplateItem, embedMessageId: string, mentionMessageId: string): boolean {
    if (!this.hasItem(id)) {
      const item: IDisplateDBItem = {
        info: info,
        embedMessageId: embedMessageId,
        mentionMessageId: mentionMessageId,
        deleted: false,
        watchers: [],
        reminderSent: false,
      };
      this.db.set(id, item);
      return true;
    }
    return false;
  }

  findIdByEmbedMessageId(messageId: string): string | undefined {
    for (const [id, item] of this.db) {
      if (item.embedMessageId === messageId) {
        return id;
      }
    }
    return undefined;
  }

  toggleWatcher(id: string, userId: string): "added" | "removed" | undefined {
    if (!this.hasItem(id)) {
      return undefined;
    }
    const watchers = this.getItem(id).watchers ?? [];
    if (watchers.includes(userId)) {
      this.db.set(
        id,
        watchers.filter((watcherId) => watcherId !== userId),
        "watchers"
      );
      return "removed";
    }
    this.db.set(id, [...watchers, userId], "watchers");
    return "added";
  }

  getItemsPendingReminder(): Array<{ id: string; item: IDisplateDBItem }> {
    const pending: Array<{ id: string; item: IDisplateDBItem }> = [];
    for (const [id, item] of this.db) {
      if (item.watchers?.length > 0 && !item.reminderSent && item.info.status === DisplateStatus.UPCOMING) {
        pending.push({ id, item });
      }
    }
    return pending;
  }

  markReminderSent(id: string): boolean {
    if (this.hasItem(id)) {
      this.db.set(id, true, "reminderSent");
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
    return this.db.get(id) as IDisplateDBItem;
  }

  markItemDeleted(id: string): boolean {
    if (this.hasItem(id)) {
      this.db.set(id, true, "deleted");
      return true;
    }
    return false;
  }

  isItemDeleted(id: string): boolean {
    return this.getItem(id).deleted;
  }

  wipe(): void {
    Logger.info("Wiping database!");
    this.db.clear();
  }
}

interface IDisplateDBItem {
  info: DisplateItem;
  embedMessageId: string;
  mentionMessageId: string;
  deleted: boolean;
  watchers: string[];
  reminderSent: boolean;
}
