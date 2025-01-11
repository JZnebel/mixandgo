const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const takeScreenshot = async (url, outputPath) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--ignore-certificate-errors' // Ignore SSL certificate errors
      ],
    });

    const page = await browser.newPage();

    // Set default navigation timeout
    await page.setDefaultNavigationTimeout(60000);

    // Navigate to the provided URL
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.setViewport({ width: 1280, height: 720 });

    // Scroll the page to ensure all content is loaded
    await autoScroll(page);

    // Add a delay to allow animations or lazy-loaded content to finish
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Take a screenshot
    await page.screenshot({ path: outputPath, fullPage: true });

    // Close the browser
    await browser.close();

    console.log(`Screenshot saved at: ${outputPath}`);
  } catch (error) {
    if (error.message.includes('ERR_CERT_COMMON_NAME_INVALID')) {
      console.error(
        'Error taking screenshot: SSL certificate issue. Consider verifying the certificate or use a trusted domain.'
      );
    } else {
      console.error('Error taking screenshot:', error);
    }
  }
};

// Function to scroll the page
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

// Get URL and output file name from command-line arguments
const [url, outputFileName] = process.argv.slice(2);
if (!url || !outputFileName) {
  console.error('Usage: node screenshot.js <url> <outputFileName>');
  process.exit(1);
}

// Resolve the output path and take the screenshot
const outputPath = path.resolve(__dirname, outputFileName);
takeScreenshot(url, outputPath);
