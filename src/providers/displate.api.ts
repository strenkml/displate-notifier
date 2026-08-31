import axios from "axios";
import zlib from "zlib";
import DisplateItem from "../models/DisplateItem";
import Logger from "../utils/Logger";

export class DisplateAPI {
  private static url = "https://sapi.displate.com/artworks/limited";

  private static decompress(buf: Uint8Array, encoding: string | undefined): string {
    if (encoding === "br") {
      return zlib.brotliDecompressSync(buf).toString("utf8");
    } else if (encoding === "gzip" || encoding === "deflate") {
      return zlib.unzipSync(buf).toString("utf8");
    } else {
      // Server sends brotli without Content-Encoding header
      try {
        return zlib.brotliDecompressSync(buf).toString("utf8");
      } catch {
        return Buffer.from(buf).toString("utf8");
      }
    }
  }

  // The listing endpoint's format field lags behind reality for newly added items.
  // The item's own page has the correct value, so fetch it and use that instead.
  private static async getCorrectFormat(url: string): Promise<string | undefined> {
    try {
      const res = await axios.get(`https://displate.com${url}`, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Referer: "https://displate.com/",
        },
      });
      const buf = new Uint8Array(res.data as ArrayBuffer);
      const html = this.decompress(buf, res.headers["content-encoding"]);
      const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (!match) {
        return undefined;
      }
      const nextData = JSON.parse(match[1]);
      return nextData?.props?.pageProps?.limitedEdition?.general?.format;
    } catch (e) {
      Logger.warning(`Failed to fetch corrected format for ${url}: ${e}`, "getCorrectFormat");
      return undefined;
    }
  }

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
    const text = this.decompress(buf, res.headers["content-encoding"]);
    return JSON.parse(text);
  }

  static async getDisplateInfo(): Promise<Array<DisplateItem>> {
    const d = await this.getData();
    const dataArray = d.data;

    const info: Array<DisplateItem> = [];

    if (Array.isArray(dataArray)) {
      for (let i = 0; i < dataArray.length; i++) {
        const data = dataArray[i];
        // Only active/upcoming items get shown, so only they need the extra request.
        if (data.edition.status === "active" || data.edition.status === "upcoming") {
          const correctFormat = await this.getCorrectFormat(data.url);
          if (correctFormat) {
            data.edition.format = correctFormat;
          }
        }
        info.push(new DisplateItem(data));
      }
    }
    return info;
  }
}
