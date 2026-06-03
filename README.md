# 🚢 Email Segregation For Ships (Maritime AI Engine)

An advanced Next.js web application designed to automate the painful process of reading, parsing, and segregating maritime broker emails. 

This platform uses a custom Rule-Based Parsing Engine to instantly scan raw text emails and automatically categorize them into **Tonnage**, **Voyage Charters (VC)**, and **Time Charters (TC)**, extracting all relevant data points along the way.

---

## ✨ Core Features

*   **⚡ Automated Inbox Sync (Simulated):** The moment a broker logs in, the system mimics an IMAP connection, fetching unread maritime emails and piping them directly into the parsing engine.
*   **🧠 AI Extraction Engine:** Uses advanced regex heuristics to isolate critical maritime data without relying on expensive or slow LLMs (like OpenAI/Claude).
    *   **Tonnage Extraction:** Vessel Name, DWT, Open Port, Open Dates.
    *   **Cargo VC:** Load/Discharge Ports, Cargo Type/Quantity, Laycan, Commission.
    *   **Cargo TC:** Delivery/Redelivery Ports, Duration, Cargo Requirements.
*   **🤝 Automated Vessel-Cargo Matching:** An algorithm cross-references available open vessels against firm cargo requirements and assigns a "Match Confidence Score" to help brokers close deals faster.
*   **📊 Analytics Dashboard:** Real-time visual metrics tracking the influx of open vessels vs. cargo requirements.
*   **🔐 Protected Routes & Authentication:** Built-in simulated authentication flow utilizing React Context and global Route Guards.
*   **🎨 Neo-Brutalist UI:** A stunning, bold, and modern interface featuring high-contrast borders and sharp typography.

## 🛠️ Tech Stack

*   **Frontend Framework:** Next.js 14+ (App Router)
*   **Styling:** Tailwind CSS (with custom Neo-Brutalist configuration)
*   **State Management:** React Context API (`ShippingContext`, `AuthContext`)
*   **Language:** TypeScript
*   **Deployment:** Render / Vercel

## 📂 Project Structure

This repository contains:
1.  **`shipping-email-system/`**: The core Next.js application source code.
2.  **`implement plan/`**: Planning documentation, architecture schemas, PRDs, and sample testing data.

## 🚀 Getting Started Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/RahulRana9520/EmailSegregationForShips.git
   cd EmailSegregationForShips/shipping-email-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can log in using any email/password combination to view the prototype!

---
*Built with ❤️ for the Maritime Shipping Industry.*
