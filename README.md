# Web Feedback Tool

A Rails application designed to streamline feedback for web developers by allowing clients to annotate screenshots of web pages. This app automates screenshot generation using Puppeteer, provides a canvas for markup, and enables easy sharing between clients and developers.

## Features

- **Screenshot Capture**: Automatically takes a screenshot of a provided URL using Puppeteer.
- **Canvas Markup**: Clients can annotate screenshots directly in the browser using a rich canvas interface.
- **Download Annotations**: Clients can download annotated screenshots to share with developers.
- **Tailwind CSS Styling**: Clean, responsive user interface styled with Tailwind CSS.
- **Devise Authentication**: User authentication for secure access.

## How It Works

1. **Input a URL**: Users submit the URL of the page they want to provide feedback on.
2. **Screenshot Generation**: The app triggers a Puppeteer script that captures a screenshot of the URL.
3. **Canvas Annotation**: The screenshot is loaded into a canvas where clients can:
   - Add notes
   - Draw directly on the image
4. **Download and Share**: Annotated screenshots can be downloaded and shared with developers.

## Prerequisites

To run this project locally, ensure you have the following installed:

- Ruby (version `3.3.0` recommended)
- Rails (8.0.1)
- Node.js and npm
- Puppeteer (installed via npm dependencies)
- PostgreSQL (download and install if not already available)
- Tailwind CSS (integrated via Rails)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install Ruby gems:

   ```bash
   bundle install
   ```

3. Install JavaScript dependencies, including Puppeteer:

   ```bash
   npm install
   ```

4. Configure the database:
   - Open `config/database.yml` and ensure it matches your PostgreSQL login credentials (e.g., username, password, host, and port).
   - If you don’t have PostgreSQL installed, download it from [PostgreSQL Downloads](https://www.postgresql.org/download/) and set it up.

5. Run the database migrations:

   ```bash
   rails db:migrate
   ```

6. Start the Rails server:

   ```bash
   rails server
   ```

7. Open your browser and navigate to `http://localhost:3000`.

## Puppeteer Setup

Puppeteer is used for generating screenshots. If you encounter issues with Puppeteer, ensure its dependencies are installed:

### On Debian/Ubuntu:
```bash
sudo apt-get install -y libnss3 libxss1 libasound2
```

### On Windows:
- Ensure Google Chrome is installed.
- If Puppeteer cannot find Chrome, you may need to modify the `screenshot.js` script to specify the correct path to Chrome or Chromium.

#### Modifying `screenshot.js`:
Edit the Puppeteer configuration to include the `executablePath`:
```javascript
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Replace with your Chrome/Chromium path
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
```
Replace the path with the actual location of your `chrome.exe` or Chromium binary.

## Key Features

### Screenshot and Canvas Workflow
- Users can input any valid URL.
- The app takes a high-resolution screenshot of the page.
- The screenshot is rendered on an interactive canvas for annotation.

### Annotation Tools
- **Drawing**: Freehand drawing with customizable colors.
- **Text Notes**: Add text annotations to specific areas.
- **Clear**: Easily clear the canvas.

### Secure Access
- User authentication is handled with Devise to ensure only authorized users can access project resources.

## Troubleshooting

### Screenshots Not Working
- Ensure Puppeteer is correctly installed by running:
  ```bash
  npm install puppeteer
  ```
- Verify that Chrome/Chromium is installed and accessible.
- If screenshots fail, check the `screenshot.js` script and update the `executablePath` to point to the correct Chrome/Chromium binary on your system.

### Database Issues
- If you encounter database connection errors, double-check the `config/database.yml` file to ensure it matches your PostgreSQL setup.
- Ensure the PostgreSQL server is running.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the LICENSE file for details.

## Acknowledgments

- **[Rails](https://rubyonrails.org/)**: The web application framework.
- **[Puppeteer](https://pptr.dev/)**: Headless browser for screenshot generation.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework.
- **[Devise](https://github.com/heartcombo/devise)**: Authentication framework.

