# 🧠 Resume ATS System

**Resume ATS System** is an open-source, free tool designed to help you optimize your resume by comparing it with job descriptions using AI. It mimics the functionalities of an Applicant Tracking System (ATS) to help you better tailor your resume for each job.

## 🌐 Live Demo
👉 [resumeatssystem.netlify.app](https://resumeatssystem.netlify.app/)

---

## 🚀 Features

- 📄 Upload resume and job description in txt format
- 🤖 Uses LLMs to intelligently parse and compare
- 📊 Ranks resumes based on job matching
- ⚙️ ATS-style functionality simulation
- 🧩 Built with modern technologies

---

## 🛠️ Tech Stack

- **Frontend**: TypeScript, HTML, Tailwind CSS
- **Backend / Logic**: Node.js, Python (for LLM integration)
- **Build Tool**: Vite
- **Configuration**: ESLint, PostCSS, Tailwind, TypeScript config

---

## 📁 Project Structure
```bash
.
├── src/                     # Source code
├── index.html               # Entry HTML
├── package.json             # Project dependencies
├── tsconfig.*.json          # TypeScript configurations
├── tailwind.config.js       # Tailwind setup
├── postcss.config.js        # PostCSS config
├── vite.config.ts           # Vite configuration
└── README.md                # Project overview

# Clone the repository
git clone https://github.com/Aneelkumar999/resume-ats-system.git
cd resume-ats-system

# Install dependencies
npm install

# Run the development server
npm run dev
