# Learning Hub
![Learning Hub Banner](public/banner.png)
📚🎓🏫👨🏻‍🎓🎒🏛️

![Project Badge](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)
[![CI](https://github.com/Tanay2920003/Learning-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/Tanay2920003/Learning-hub/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Tanay2920003/Learning-hub/actions/workflows/codeql.yml/badge.svg)](https://github.com/Tanay2920003/Learning-hub/actions/workflows/codeql.yml)
[![Release](https://github.com/Tanay2920003/Learning-hub/actions/workflows/release.yml/badge.svg)](https://github.com/Tanay2920003/Learning-hub/actions/workflows/release.yml)

A modern, responsive open-source hub for learning resources, tools, roadmaps, and community-built projects. Learning Hub brings helpful developer content into one clean interface so people can learn, explore, and contribute in one place.

## ✨ Features

- **Flexible Discovery Hub**: Browse learning categories, tools, roadmaps, and community projects from one home page.
- **Glassmorphism UI**: Modern aesthetic with backdrop blurs and gradients.
- **Fully Responsive**: Optimized for 4K ultrawide, desktops, laptops, tablets, and mobile devices.
- **Mobile First**: Smooth hamburger menu overlay and touch-friendly interactions.
- **Direct Links**: Bypasses iframe restrictions by linking directly to resources in new tabs.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS Modules & CSS Variables
- **Font**: [Inter](https://fonts.google.com/specimen/Inter) via `next/font`

## 🚀 Getting Started

You can set up Learning Hub using a one-click deployment or manually via the terminal.

### 🌐 One-Click Deploy (Easiest)

Deploy your own copy of Learning Hub to Vercel in seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTanay2920003%2FLearning-hub)
[![Watch Tutorial](https://img.shields.io/badge/Watch-Tutorial-red?style=for-the-badge&logo=youtube)](https://youtu.be/v2X51AVgl3o?t=221)

### 🖥️ GUI Setup (GitHub Desktop)

1. **Clone in GitHub Desktop**: Click the "Code" button on GitHub and select "Open with GitHub Desktop".
2. **Install & Run**:
   - Open the project in your favorite editor (like VS Code).
   - Use the editor's terminal or a GUI tool like [NPM Scripts](https://marketplace.visualstudio.com/items?itemName=syler.npm-scripts) to run `npm install` and `npm run dev`.

### 💻 Terminal Setup (Advanced)

Follow these steps to set up the project manually.

#### Prerequisites
- Node.js 18.17+
- npm, yarn, or pnpm

#### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Tanay2920003/Learning-hub.git
   cd Learning-hub
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run the development server**
   ```bash
   npm run dev
   ```

## 🤝 How to Contribute

We welcome contributions of all sizes. You do not need to be a terminal expert to help out, and if you contribute through GitHub your name can appear in the contributors section too.

### 📝 Using Data Manager (Easiest for quick fixes)

   

1. **Run Locally**: Clone and run `npm run dev`.
2. **Access Editor**: Click the **"Edit Data"** button in the navbar (only visible in dev mode).
   ![Edit Data Button](https://github.com/user-attachments/assets/abc3ad5c-3f5e-4609-81b0-4ed2d5e5d6f6)
3. **Modify Content**: Use the GUI to update metadata, resources, playlists, or articles.
4. **Save & PR**: Click **"Save Changes"**, then commit and open a Pull Request so your contribution can be reviewed and added.

### 🛠️ Manual JSON edits
For small changes like fixing typos in files:
1. Navigate to the file in `data/` folder.
2. Click the **Edit** (pencil icon) button at the top right.
3. Make your changes and click **Commit changes...**.
4. GitHub will guide you through creating a Pull Request.

### 💻 Using GitHub Desktop
For larger features:
1. **Fork** the repository to your own account.
2. **Clone** your fork using GitHub Desktop.
3. Make your changes and **Commit** them within the app.
4. Click **Push origin** to upload your changes.
5. **Create a Pull Request**: Visit the original repository on the GitHub website, where you'll see a prompt to "Compare & pull request" your recent changes.


### 🚀 Improvements & Features
We love seeing new features, UI refinements, category ideas, tools, and community project submissions.
1. **Explore Issues**: Check our [Issues](https://github.com/Tanay2920003/Learning-hub/issues) for planned features or bugs to fix.
2. **Submit Ideas**: Have an idea for a "wow" UI effect, a new category, a useful tool, or a community project to feature? Open a [Feature Request](https://github.com/Tanay2920003/Learning-hub/issues/new).
3. **Draft a PR**: For large changes, it's best to open a "Draft PR" early to get feedback on your approach.

For more details, please read our [Contributing Guidelines](CONTRIBUTING.md).

## 📂 Project Structure

```
Learning-hub/
├── app/
│   ├── layout.tsx       # Global root layout
│   ├── page.tsx         # Main page with resource data
│   ├── page.module.css  # CSS Modules for the main page
│   └── globals.css      # Global styles & variables
├── public/              # Static assets
└── ...
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
