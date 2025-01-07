const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const takeScreenshot = async (url, outputPath) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(60000);

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.setViewport({ width: 1280, height: 720 });

    await autoScroll(page);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await page.screenshot({ path: outputPath, fullPage: true });
    await browser.close();

    console.log(`Screenshot saved at: ${outputPath}`);
  } catch (error) {
    console.error('Error taking screenshot:', error);
  }
};

const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

const [url, outputFileName] = process.argv.slice(2);
if (!url || !outputFileName) {
  console.error('Usage: node screenshot.js <url> <outputFileName>');
  process.exit(1);
}

const outputPath = path.resolve(__dirname, outputFileName);
takeScreenshot(url, outputPath);
