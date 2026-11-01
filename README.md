# UNLOOP
### Break Free from Recurring Payments

**UNLOOP** is an AI-powered subscription management platform concept designed to help users track, organise, and manage their recurring subscriptions from one centralised dashboard.

With the increasing use of digital services, users often subscribe to multiple platforms for entertainment, productivity, cloud storage, and other services. Keeping track of renewal dates, recurring expenses, and free-trial periods can become difficult.

UNLOOP aims to simplify subscription management by providing a centralised platform that helps users monitor their subscriptions, understand recurring expenses, and stay informed about upcoming renewals.

---

## 1. Problem Statement

Digital subscriptions have become a regular part of everyday life. However, managing multiple subscriptions creates several challenges:

- Users often forget upcoming renewal dates.
- Multiple recurring payments make monthly expenses difficult to track.
- Free trials may convert into paid subscriptions without users noticing.
- Subscription details are scattered across different platforms.
- Users may continue paying for services they no longer use.
- Finding cancellation information can be inconvenient.

UNLOOP aims to address these challenges through a unified subscription management experience.

---

## 2. Proposed Solution

UNLOOP provides a centralised dashboard where users can manage subscription information and monitor recurring expenses.

The platform is designed around three major goals:

1. **Track:** Maintain subscription details, prices, billing cycles, and renewal dates.
2. **Monitor:** View upcoming renewals, trial deadlines, and recurring expenses.
3. **Manage:** Organise subscriptions and access relevant cancellation information.

The project also includes a Chrome Extension prototype intended to make subscription entry and website recognition accessible directly from the browser.

---

## 3. Key Features

### A. Subscription Management

- Add new subscriptions.
- Edit existing subscription details.
- Delete subscriptions.
- Store subscription names, prices, and billing dates.
- Search through available subscriptions.

### B. Dashboard Overview

The dashboard provides a consolidated view of subscription information, including:

- Total number of subscriptions.
- Monthly recurring expenses.
- Upcoming renewal dates.
- Subscription overview.
- Trial-related information based on entered dates.

### C. Upcoming Renewals

Users can view upcoming billing dates to stay aware of recurring payments and plan their expenses.

### D. Trial Tracking

Users can enter trial-related dates and monitor the remaining time before a trial deadline.

### E. Search and Organisation

Users can search their subscription records and access the information they need more easily.

### F. Data Export

The platform provides CSV export functionality to help users maintain an external copy of their subscription records.

### G. Dark and Light Mode

The interface supports dark and light themes to provide a comfortable user experience.

### H. Settings

User preferences are maintained locally in the browser.

---

## 4. Chrome Extension

UNLOOP also includes a Chrome Extension prototype designed to extend subscription management into the browser.

Its current capabilities include:

- Recognising supported subscription website domains.
- Identifying platforms such as Netflix, Spotify, Adobe, and YouTube.
- Allowing users to enter subscription information through a browser popup.
- Saving subscription records in Chrome's local extension storage.

The extension is designed to become a convenient entry point for subscription management.

**Current limitation:** Website recognition does not verify an active subscription or payment. The user must confirm and enter the subscription details.

Dashboard synchronisation is planned as a future integration.

---

## 5. Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend application |
| Vite | Development and build tool |
| JavaScript | Application logic |
| HTML5 | Application structure |
| CSS3 | Interface styling |
| Lucide React | Interface icons |
| Browser Local Storage | Website data persistence |
| Chrome Extensions API | Browser extension functionality |
| Chrome Storage API | Extension-side data storage |
| Manifest V3 | Chrome extension configuration |
| Vercel | Website deployment |
| Git and GitHub | Version control and source code hosting |

---

## 6. Project Architecture

The project currently consists of two primary components:

### 1. UNLOOP Web Application

The React-based web application provides the main subscription management interface.

Its major responsibilities include:

- Displaying the dashboard.
- Managing subscription records.
- Calculating dashboard summaries.
- Displaying upcoming renewal information.
- Managing user interface preferences.
- Exporting subscription data.

### 2. UNLOOP Chrome Extension

The browser extension provides website recognition and a subscription entry form.

Its major responsibilities include:

- Identifying supported website domains.
- Displaying the extension popup.
- Collecting subscription details.
- Saving records in Chrome local storage.

The two components currently maintain separate local data. Connecting them is part of the planned development.

---

## 7. How UNLOOP Works

The current web application follows this workflow:

1. The user opens the UNLOOP dashboard.
2. The user adds subscription details.
3. The application stores the information in browser local storage.
4. Dashboard statistics are calculated from the saved records.
5. Upcoming renewals and subscription information are displayed.
6. Users can update, search, delete, or export their records.

The Chrome Extension follows a separate workflow:

1. The user opens a supported website in Chrome.
2. The extension recognises the website domain.
3. The user confirms the subscription details.
4. The user enters the monthly price and next billing date.
5. The extension saves the record in Chrome local storage.

---

## 8. Project Structure

```text
UNLOOP/
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── chrome-extension/
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.css
│   ├── popup.js
│   ├── background.js
│   └── README.md
│
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

---

## 9. Installation and Setup

### Prerequisites

- Node.js
- npm
- Visual Studio Code
- Google Chrome

### Run the Web Application

Clone the repository:

```bash
git clone https://github.com/Sagar7606/UNLOOP.git
```

Navigate to the project directory:

```bash
cd UNLOOP/unloop
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### Load the Chrome Extension

1. Open Google Chrome.
2. Navigate to `chrome://extensions`.
3. Enable Developer Mode.
4. Select **Load unpacked**.
5. Choose the `chrome-extension` folder.

The extension can then be accessed from the Chrome toolbar.

---

## 10. Current Implementation Status

| Component | Status |
|---|---|
| React Dashboard | Implemented |
| Add Subscription | Implemented |
| Edit Subscription | Implemented |
| Delete Subscription | Implemented |
| Subscription Search | Implemented |
| Dashboard Statistics | Implemented |
| Upcoming Renewals | Implemented |
| Trial Countdown | Implemented using entered dates |
| Dark/Light Theme | Implemented |
| CSV Export | Implemented |
| Local Data Persistence | Implemented |
| Chrome Extension Popup | Prototype implemented |
| Website Domain Recognition | Prototype implemented |
| Extension Subscription Form | Implemented |
| Extension Local Storage | Implemented |
| Extension-Dashboard Synchronisation | Pending |
| Email-Based Subscription Detection | Not implemented |
| Automatic Payment Verification | Not implemented |
| Automatic Subscription Cancellation | Not implemented |
| Cloud Synchronisation | Not implemented |

---

## 11. Current Limitations

The current version is a frontend-focused prototype.

- Subscription details are entered manually.
- Data is stored locally in the browser.
- The application does not currently connect to users' email accounts.
- Website recognition does not confirm active paid subscriptions.
- The Chrome Extension does not yet synchronise records with the main dashboard.
- The application does not automatically process subscription cancellations.
- Actual push notifications and cloud-based synchronisation are not implemented.

These limitations define the next stages of development.

---

## 12. Future Scope

The project can be expanded with the following capabilities:

### 1. Chrome Extension Integration
Connect the extension with the main UNLOOP dashboard so that subscription records can be transferred and synchronised.

### 2. Email Receipt Detection
Explore secure email integration to identify subscription-related receipts and recurring payment information.

### 3. Renewal Notifications
Introduce notifications for upcoming renewals and trial deadlines.

### 4. AI-Based Subscription Insights
Analyse recurring expenses and provide useful subscription management insights.

### 5. Cancellation Assistance
Provide direct cancellation links and guided cancellation instructions for supported services.

### 6. Cloud Synchronisation
Enable secure data synchronisation across multiple devices.

### 7. Improved Subscription Detection
Expand supported platforms and improve the accuracy of subscription-related website recognition.

---

## 13. Project Objective

The primary objective of UNLOOP is to make subscription management simpler, more organised, and more transparent.

By combining a centralised web dashboard with browser-based subscription entry, UNLOOP aims to help users understand recurring expenses, stay aware of upcoming renewals, and make better decisions about the services they use.

---

## 14. Live Demo and Repository

**Live Website:** https://unloop-tau.vercel.app/

**GitHub Repository:** https://github.com/Sagar7606/UNLOOP

---

### UNLOOP
**Break Free from Recurring Payments.**
