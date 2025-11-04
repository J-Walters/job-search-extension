<div align="center">
  <a href="https://github.com/J-Walters/job-search-extension">
  </a>

  <h3 align="center">ClockedIn</h3>
  <h4 align="center">Smarter LinkedIn Job Search Tool</h4>

  <p align="center">
    A Chrome extension that enhances the job-seeking experience on LinkedIn by giving users finer control over job search filters, especially recency, which LinkedIn buries deep in its UI (or doesn't expose fully at all).
  </p>
</div>

---

### Demo

Watch a walkthrough of the extension in action:  
👉 [Loom Video Demo](https://www.loom.com/share/13cf794f3a9d4a8b81e05536b3721f28)

---

### Features
- **Time-based filters**: Instantly surface jobs posted within the last 10 minutes, 30 minutes, 1 hour, or 24 hours.
- **Company blocking**: Hide listings from companies you’re not interested in.
- **Save and organize searches**: Keep track of promising leads in one place.
- **Reminders and tracking**: Stay consistent with your search habits.
- **Customizable settings**: Tailor your filters and layout preferences.
- **Uses Chrome Storage Sync**: Your saved searches and settings stay synced across devices.

---

### Built With
- [React 19](https://react.dev/) – UI library for building the extension's frontend  
- [Vite](https://vitejs.dev/) – Lightning-fast bundler and dev server  
- [TypeScript](https://www.typescriptlang.org/) – Strongly-typed JavaScript  
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework  
- [Chrome Extension APIs](https://developer.chrome.com/docs/extensions/reference/) – Core APIs powering the extension  
- [@crxjs/vite-plugin](https://crxjs.dev/) – Vite plugin for building Chrome extensions  
- [React Hook Form](https://react-hook-form.com/) – Form handling  
- [Lucide React](https://lucide.dev/) – Icon set  
- [Nanoid](https://github.com/ai/nanoid) – Unique ID generation  

---

### Installation
1. Clone this repo  
   `git clone https://github.com/J-Walters/job-search-extension`  
2. Install dependencies  
   `npm install`  
3. Build the extension  
   `npm run build`  
4. Open `chrome://extensions/` in Chrome  
5. Enable **Developer mode** (toggle in the top right)  
6. Click **Load unpacked** and select the `dist/` folder  
7. Pin the **ClockedIn** extension to your toolbar and click the icon to launch the popup  

---

### Roadmap
- [ ] Folder support for saved searches  
- [ ] Location-based filters  
- [ ] Keyword highlighting in search results  
- [ ] Dark mode support  
- [ ] Drag & drop reordering of saved searches  

---

### Feedback
This extension is still in progress so feedback is welcome!  
Feel free to open an issue or suggest a feature via [GitHub Issues](https://github.com/J-Walters/job-search-extension/issues).

