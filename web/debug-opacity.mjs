import puppeteer from "puppeteer-core";

const browser = await puppeteer.connect({
  browserURL: "http://localhost:9222",
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto("http://localhost:3001/", { waitUntil: "domcontentloaded", timeout: 20000 });
await new Promise(r => setTimeout(r, 3000));

const info = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  const input = document.querySelector("input");
  const allEls = [...document.querySelectorAll("*")];
  const hidden = allEls.filter(el => {
    const s = window.getComputedStyle(el);
    return parseFloat(s.opacity) < 0.5 && el.children.length === 0 && el.textContent?.trim();
  }).map(el => ({ tag: el.tagName, text: el.textContent?.slice(0,30), opacity: window.getComputedStyle(el).opacity }));

  return {
    h1Text: h1?.textContent?.slice(0, 60),
    h1Opacity: h1 ? window.getComputedStyle(h1).opacity : "no h1",
    inputPlaceholder: input?.placeholder?.slice(0, 40) || "no input",
    hiddenTextCount: hidden.length,
    hiddenSamples: hidden.slice(0, 5),
  };
});
console.log(JSON.stringify(info, null, 2));

await browser.disconnect();
