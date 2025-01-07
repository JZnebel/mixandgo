
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

- Ruby (version `3.x` recommended)
- Rails
- Node.js and Yarn
- Puppeteer (installed via Node.js dependencies)
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
   yarn install
   ```

4. Run the database migrations:

   ```bash
   rails db:migrate
   ```

5. Start the Rails server and Puppeteer:

   ```bash
   bin/dev
   ```

6. Open your browser and navigate to `http://localhost:3000`.

## Puppeteer Setup

Puppeteer is used for generating screenshots. If you encounter issues with Puppeteer, ensure its dependencies are installed:

### On Debian/Ubuntu:
```bash
sudo apt-get install -y libnss3 libxss1 libasound2
```

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

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). See the LICENSE file for details.

## Acknowledgments

- **[Rails](https://rubyonrails.org/)**: The web application framework.
- **[Puppeteer](https://pptr.dev/)**: Headless browser for screenshot generation.
- **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework.
- **[Devise](https://github.com/heartcombo/devise)**: Authentication framework.
