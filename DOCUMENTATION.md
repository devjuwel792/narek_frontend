# Project Setup and Run Guide

This document provides step-by-step instructions to set up, build, and run the React project using Vite.

## Prerequisites

- Node.js (version 16 or higher) installed on your system.
- npm (comes with Node.js) or yarn as a package manager.

## Steps to Set Up and Run the Project

### 1. Install Dependencies

First, navigate to the project root directory in your terminal and run the following command to install all required dependencies:

```bash
npm install
```

This command will read the `package.json` file and install all the dependencies listed under `dependencies` and `devDependencies`.

### 2. Configure Environment Variables

- Create a `.env` file in the root directory of the project if it does not exist.
- Add any necessary environment variables to the `.env` file. For example, if the project requires API keys or other configuration, define them here.
- Example `.env` file content (adjust based on your needs):

  ```
  REACT_APP_API_URL=https://api.example.com
  REACT_APP_ENV=development
  ```

  Note: Ensure that sensitive information is not committed to version control. The `.gitignore` file already excludes `.env` files.

### 3. Update Configuration File

- Open the `src/configtion.js` file.
- Update the `userSideUrl` variable with the appropriate user site link. For example:

  ```javascript
  export const userSideUrl = "https://your-user-site-link.com";
  ```

  Replace `"https://your-user-site-link.com"` with the actual URL of the user-facing site.

### 4. Build the Project

After configuring the environment and configuration file, build the project for production:

```bash
npm run build
```

This command will create an optimized production build in the `dist` directory.

### 5. Run the Project

To run the built project in production mode, use the following command:

```bash
npm run preview
```

This will start a local server to preview the built application. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:4173` or similar).

Note: If you want to run the project in development mode with hot reloading, use:

```bash
npm run dev
```

This is useful for development and will start the Vite development server.

## Additional Scripts

- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.

## Troubleshooting

- If you encounter issues during `npm install`, ensure your Node.js version is compatible and try clearing the npm cache with `npm cache clean --force`.
- For build errors, check the console output for specific error messages and ensure all dependencies are installed correctly.
- If the project does not run as expected, verify the `.env` variables and the `userSideUrl` in `src/configtion.js`.

## Project Structure

- `src/`: Contains the main source code.
- `public/`: Static assets.
- `dist/`: Generated build output (after running `npm run build`).
- `package.json`: Project dependencies and scripts.
- `vite.config.js`: Vite configuration.

For more details, refer to the official Vite documentation: https://vitejs.dev/
