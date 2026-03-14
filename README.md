# betterUptime

> A modern monitoring website built with TypeScript.

## 🌟 Overview

**betterUptime** is a powerful monitoring solution designed to help you track the health and uptime of your websites, APIs, and services. Built with TypeScript, this project aims for scalability, reliability, and ease of use. Whether you're looking to monitor your personal blog or a critical production system, betterUptime provides the tools you need.

---

## 🚀 Features

- **Website & Service Monitoring**  
  Ping targets and get real-time status updates.

- **Alerting System**  
  Get notified instantly on downtime or performance issues.

- **Dashboard**  
  Visualize historical data, uptime percentages, and incident reports.

- **Customizable Checks**  
  Set interval, timeout, and custom rules for each monitored endpoint.

- **TypeScript Codebase**  
  Strong typing ensures reliability and maintainability.

---

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 14.x)  
- [npm](https://www.npmjs.com/) or [bun](https://bun.com/)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheManishDaksh/betterUptime.git
   cd betterUptime
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment (optional)**
   - Copy `.env.example` to `.env` and set necessary values.

4. **Start the application**
   ```bash
   bun run start
   ```
   Or for development with hot-reloading:
   ```bash
   bun run dev
   ```

---

## ⚙️ Usage

- Open `http://localhost:3000` in your browser (default port).
- Add websites/services you want to monitor via the dashboard.
- Customize monitoring preferences as needed.

---

## 📖 Project Structure

```
betterUptime/
├── src/          # TypeScript source files
├── public/       # Static assets
├── tests/        # Test suites
├── .env.example  # Example environment configuration
└── README.md     # Project documentation
```

---

## 📋 Roadmap

- [ ] Add advanced alerting integrations (Slack, Email, SMS)
- [ ] Implement authentication and user accounts
- [ ] Improve dashboard UI/UX
- [ ] Expand API features
- [ ] Add plugin support

---

## 🙌 Acknowledgements

- TypeScript
- Node.js Ecosystem
- Open Source Contributors

---

> Made with ❤️ by [TheManishDaksh](https://github.com/TheManishDaksh)