import axios from "axios";
import zlib from "zlib";
import DisplateItem from "../models/DisplateItem";

export class DisplateAPI {
  private static url = "https://sapi.displate.com/artworks/limited";

  private static async getData(): Promise<any> {
    const res = await axios.get(this.url, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://displate.com/",
        Origin: "https://displate.com",
      },
    });
    const buf = new Uint8Array(res.data as ArrayBuffer);
    const encoding = res.headers["content-encoding"];
    let text: string;
    if (encoding === "br") {
      text = zlib.brotliDecompressSync(buf).toString("utf8");
    } else if (encoding === "gzip" || encoding === "deflate") {
      text = zlib.unzipSync(buf).toString("utf8");
    } else {
      // Server sends brotli without Content-Encoding header
      try {
        text = zlib.brotliDecompressSync(buf).toString("utf8");
      } catch {
        text = Buffer.from(buf).toString("utf8");
      }
    }
    return JSON.parse(text);
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
