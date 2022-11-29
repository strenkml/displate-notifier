import axios from "axios";
import DisplateItem from "../models/DisplateItem";

export class DisplateAPI {
  private static url = "https://sapi.displate.com/artworks/limited";

  private static async getData(): Promise<any> {
    const res = await axios.get(this.url, {
      headers: {
        "Accept-Encoding": "application/json",
      },
    });
    return res.data;
  }

  static async getDisplateInfo(): Promise<Array<DisplateItem>> {
    const d = await this.getData();
    const dataArray = d.data;

    const info: Array<DisplateItem> = [];

    if (Array.isArray(dataArray)) {
      for (let i = 0; i < dataArray.length; i++) {
        const data = dataArray[i];
        info.push(new DisplateItem(data));
      }
    }
    return info;
  }
}
