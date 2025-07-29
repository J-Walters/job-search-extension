<div id="top"></div>

<h3 align="center">Clocked In</h3>
<h4 align="center">Smarter LinkedIn Job Search Tool</h4>

<p align="center">
  A Chrome extension that enhances the job seeking experience on LinkedIn by giving users finer control over job search filters, especially recency, which LinkedIn buries in its UI (or doesn't expose fully at all).
</p>

<br />

<!-- ABOUT THE PROJECT -->
## About The Project


<p>

After being laid off, I hit the job market and noticed roles on LinkedIn had hundreds or even thousands of applicants within minutes. I discovered that by editing the parameter `f_TPR` in the job link URL, I could surface jobs posted as recently as the last ten minutes, something LinkedIn doesn't allow natively. Manually editing URLs quickly became repetitive and tiresome, so I built Clocked In, a Chrome extension that automates the process and adds helpful filters. It hides scammy listings and lets users block companies they're not interested in. Under the hood, it manages persistent state with Chrome Storage Sync, injects content scripts to clean up job feeds, and provides a React based UI. So now you can be first in line for the roles you want!
 

</p>

---
### Features

- **Recency Filter**: Surface job postings from the last 30 minutes up to 24 hours with one click.
- **Smart URL Generator**: Generate LinkedIn job search URLs with hidden parameters (like f_TPR) and other filters instantly.
- **Saved Searches & Tracking**: Save, relaunch, and manage searches (including ones from other job boards) all in one place.
- **Application Reminders**: Get customizable Chrome notifications at set intervals so you never miss fresh listings.
- **Export Saved Searches**: Download all saved searches as a CSV for easy record-keeping or analysis.
- **Lightweight & Fast**: Popup UI designed to get out of your way and keep you applying.

---

<!-- Screenshots -->
### 📸 Usage


---

### 🛠  Built with

- [React 19](https://react.dev/) – UI library for building the extension's frontend
- [Vite](https://vitejs.dev/) – Bundler and dev server
- [TypeScript](https://www.typescriptlang.org/) – Strongly typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) – Utility first CSS framework
- [Chrome Extension APIs](https://developer.chrome.com/docs/extensions/reference/) – Core APIs powering the extension
- [@crxjs/vite-plugin](https://crxjs.dev/) – Vite plugin for building Chrome extensions
- [React Hook Form](https://react-hook-form.com/) – Form handling
- [Lucide React](https://lucide.dev/) – Icon set
- [Nanoid](https://github.com/ai/nanoid) – Unique ID generation
  
---

### 📎 Installation

1. Clone this repo  `git clone https://github.com/J-Walters/job-search-extension`  
2. Install dependencies  `npm install`  
3. Build the extension  `npm run build`  
4. Open `chrome://extensions/` in Chrome  
5. Enable **Developer mode** (toggle in the top right)  
6. Click **Load unpacked** and select the `dist/` folder  
7. Pin the **ClockedIn** extension to your toolbar and click the icon to launch the popup

---


### 🙋🏽‍♀️ Author

Built by [Jordan Walters](https://github.com/J-Walters) - [LinkedIn](https://www.linkedin.com/in/walters-jordan/) - jwalters012@gmail.com 

---

### 🤝 Contributions

If you’ve figured out other LinkedIn parameter hacks or UX improvements, I’d love to hear them!

<p align="right">(<a href="#top">back to top</a>)</p>
