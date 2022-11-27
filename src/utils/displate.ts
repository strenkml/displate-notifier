import * as puppeteer from "puppeteer";

import Sleep from "./Sleep";
import Logger from "./Logger";

const browserOptions = {
  // executablePath: "/usr/bin/google-chrome",
  // args: ["--no-sandbox", "--disable-web-security"],
  headless: false,
  dumpio: true,
};

export async function fetchNewComingSoons(): Promise<Map<string, IDisplateInfo>> {
  const url = "https://displate.com/limited-edition";
  const divSel = "#d_app .limited-editions .limited-editions__displates .displate-tile--limited-soldout";

  const output: Map<string, IDisplateInfo> = new Map<string, IDisplateInfo>();

  Logger.info("Running scrapper");
  const browser = await puppeteer.launch(browserOptions);
  const [page] = await browser.pages();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(divSel);
  await Sleep.sleepMilliSec(1000);
  await autoScroll(page);

  Logger.info("Getting image links");
  const imgLinks = await page.evaluate(() => {
    const imgSel = "a.displate-tile--limited-upcoming span img";
    const results: Array<string> = [];
    const elements = document.querySelectorAll(imgSel);
    for (let i = 0; i < elements.length; i++) {
      const ele = elements[i];
      if (ele instanceof HTMLImageElement) {
        results.push(ele.src);
      }
    }
    return results;
  });

  Logger.info("Getting urls");
  const urls = await page.evaluate(() => {
    const urlSel = ".displate-tile--limited-upcoming";
    const results: Array<string> = [];
    const elements = document.querySelectorAll(urlSel);
    for (let i = 0; i < elements.length; i++) {
      const ele = elements[i];
      if (ele instanceof HTMLAnchorElement) {
        results.push(ele.href);
      }
    }
    return results;
  });

  Logger.info("Getting time until drop");
  const timeLeft = await page.evaluate(() => {
    const results: Array<string> = [];
    const sel = ".displate-tile--limited-upcoming-counter span";
    const elements = document.querySelectorAll(sel);

    for (let i = 0; i < elements.length; i += 4) {
      results.push(
        `${elements[i].innerHTML} ${elements[i + 1].innerHTML} ${elements[i + 2].innerHTML} ${
          elements[i + 3].innerHTML
        }`
      );
    }
    return results;
  });

  await browser.close();

  if (urls.length == imgLinks.length && imgLinks.length == timeLeft.length) {
    for (let i = 0; i < imgLinks.length; i++) {
      const myUrl = urls[i];
      const imgLink = imgLinks[i];
      const time = timeLeft[i];

      const id = getIdFromUrl(myUrl);
      output.set(id, { url: myUrl, image: imgLink, availableWhen: time });
    }
  }

  return output;
}

function getIdFromUrl(url: string): string {
  const regex = /^\/limited-edition\/displate\/([0-9]+)$/;
  const matches = url.match(regex);
  if (matches && matches.length >= 1) {
    return matches[1];
  }
  return "";
}

async function autoScroll(page: puppeteer.Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

export interface IDisplateInfo {
  url: string;
  image: string;
  availableWhen: string;
}
