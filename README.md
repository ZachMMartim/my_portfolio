# Zach Martim's Portfolio Website

A modern, interactive portfolio showcasing my professional experience, technical skills, and projects. Built with React and featuring a unique desktop-inspired interface with advanced UI/UX design patterns. Feel free to check it out at [zach-martim-portfolio.web.app](https://zach-martim-portfolio.web.app).

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Interactive Landing Page
- Engaging "error message" popup introducing myself as a Software Engineer
- Professional profile display with contact links
- Smooth animations and typing effects
- Responsive glassmorphism design

### Dynamic Skills Section
- Organized skill categories (Programming Languages, Frameworks, Tools)
- Visual proficiency indicators with animated progress bars
- Technology-specific icons (Python, JavaScript, React, Docker, AWS, etc.)
- Expandable skill tags showcasing additional expertise
- Modern card-based layout with hover effects

### Professional Timeline Resume
- Interactive career journey visualization
- Alternating timeline design for visual balance
- Expandable detail panels revealing key achievements
- Filter system (All, Work Experience, Education)
- Duration badges and location tags
- Company logos and role-specific icons
- Technology tags for each position

### Project Showcase
- Interactive project gallery
- Game jam entries and academic projects
- Video demonstrations and live demos
- GitHub integration with direct repository links
- Image previews and detailed descriptions

### AI-Powered Chatbot
- Integrated Supabase-powered chat widget
- Real-time conversation storage
- Context-aware responses about portfolio content
- Clean, modern chat interface

## Tech Stack

### Frontend
- **React** 18.3.1 - UI framework
- **React Router** 6.27.0 - Navigation
- **React Icons** 5.5.0 - Icon library

Animation is plain CSS and small `useEffect` timers. The typewriter, the boot
terminal and the ask bar's caret all respect `prefers-reduced-motion`.

### Backend
- **Firebase Cloud Functions** - one function, `functions/`, holding the API key
- **Claude Haiku 4.5** - the ask bar's model, via the Anthropic Messages API

No database. The system prompt is generated at deploy time from
`portfolio-frontend/src/content/*.json`, the same content the pages render, so
the bot cannot drift from the site. Captured leads and unanswered questions go
to Cloud Logging, plus a webhook if `LEAD_WEBHOOK_URL` is set.

### Development Tools
- **Create React App** - Project setup
- **React Scripts** 5.0.1 - Build tools
- **Patch Package** 8.0.0 - Dependency patches
- **ESLint** - Code linting

### Hosting
- **Firebase Hosting** - Static site hosting with CDN, rewriting `/api/chat` to the function

## Deployment

The site is hosted on Firebase Hosting and deployed manually from the
`main` branch.

```bash
# one-time, if the Firebase CLI is not installed
npm install -g firebase-tools
firebase login

# build and deploy
cd portfolio-frontend && npm run build && cd ..
firebase deploy --only hosting
```

Hosting config lives in `firebase.json`; the target project is set in
`.firebaserc`. All routes rewrite to `index.html` so client-side routing
resolves on refresh and direct navigation.

> **Note:** run the build without `CI=true`. Create React App promotes
> ESLint warnings to errors when `CI` is set, which will fail the build on
> warnings that do not affect the running app.


This is a personal portfolio project, but suggestions and feedback are welcome!


## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**Zach Martim**
- LinkedIn: [linkedin.com/in/zachmartim](https://linkedin.com/in/zachmartim)
- GitHub: [github.com/ZeroTheNerd](https://github.com/ZeroTheNerd)
- Email: zachmartim101@gmail.com

- All open-source contributors
