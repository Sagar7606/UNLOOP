# UNLOOP
### Break Free from Recurring Payments

**UNLOOP** is a subscription management platform that helps users organise, track, and manage recurring subscriptions from a centralised dashboard.

It combines a React-based web application with a Chrome Extension prototype, allowing users to manage subscription information, monitor upcoming renewals, track free trials, and save website-related subscription details.

UNLOOP also supports multiple separate workspaces, so users can maintain independent subscription records and bookmarks for different accounts.

**Live Website:** https://unloop-tau.vercel.app/  
**GitHub Repository:** https://github.com/Sagar7606/UNLOOP

---

## 1. Problem Statement

Managing multiple digital subscriptions can become difficult because:

- Users may forget upcoming renewal dates.
- Recurring payments can make monthly expenses difficult to monitor.
- Free trials may convert into paid subscriptions without users noticing.
- Subscription information is spread across different websites.
- Users may continue paying for services they no longer use.
- Manually maintaining subscription records can be inconvenient.

UNLOOP aims to simplify this process through a unified subscription management experience.

---

## 2. Proposed Solution

UNLOOP provides a centralised platform for managing subscription information through a web dashboard and a browser extension.

The platform focuses on three main goals:

1. **Track:** Maintain subscription names, prices, billing cycles, and renewal dates.
2. **Monitor:** View upcoming renewals, trial deadlines, and recurring expenses.
3. **Manage:** Add, edit, delete, search, organise, and export subscription records.

The Chrome Extension further simplifies the process by recognising website information and allowing users to save subscription-related details to a selected UNLOOP account.

---

## 3. Key Features

### A. Multiple Account Workspaces

UNLOOP provides four selectable workspaces:

- User 1
- User 2
- User 3
- Demo Login

Each workspace maintains its own subscription records and bookmarks.

The Demo Login starts with an empty dashboard, allowing users to explore the application without using the sample subscription data.

### B. Subscription Management

- Add new subscriptions.
- Edit existing subscription details.
- Delete subscriptions.
- Store subscription names and prices.
- Maintain billing cycle and renewal date information.
- Search through subscription records.

### C. Dashboard Overview

The dashboard provides a consolidated view of subscription information, including:

- Total number of subscriptions.
- Monthly recurring expense summary.
- Upcoming renewals.
- Subscription overview.
- Trial-related information.

### D. Upcoming Renewals

Users can monitor upcoming billing dates to stay informed about recurring payments.

### E. Trial Tracking

Users can enter trial-related dates and monitor the remaining time before a trial deadline.

### F. Search and Organisation

Users can search their subscription records and access relevant information more easily.

### G. Bookmarks Management

- Save useful website links.
- Maintain separate bookmarks for each account.
- View saved website information.
- Open bookmarked websites directly.

### H. Dark and Light Mode

The interface supports dark and light themes.

### I. Settings

Users can manage available application preferences and data-related settings.

---

## 4. UNLOOP Chrome Extension

The UNLOOP Chrome Extension is designed to connect browser activity with the subscription management dashboard.

Instead of relying only on manually entering website names, the extension can identify the currently opened website and inspect relevant page information.

### Current Capabilities

- Detect the current website name and URL.
- Read relevant information from the active webpage.
- Scan page content for subscription-related details.
- Support extracting information such as plan name, price, billing cycle, and next billing date when available on the page.
- Allow users to review and select the information they want to save.
- Provide account selection before saving.
- Support User 1, User 2, User 3, and Demo Login as destination accounts.
- Send saved information to the UNLOOP web application through its extension messaging integration.

### Account-Based Saving

The extension is designed around account-specific saving:

1. The user opens a subscription-related webpage.
2. The extension identifies the current website.
3. The extension scans the available page content.
4. The user reviews the detected information.
5. The user selects the destination UNLOOP account.
6. The extension sends the selected information to the web application.
7. The application saves the information under the selected account.

The web application handles the incoming extension message and stores the bookmark under the corresponding account.

**Important:** Page scanning is dependent on the information available in the webpage. The extension cannot independently verify whether a subscription is active, whether a payment has succeeded, or whether the detected billing details are correct. User review is required.

---

## 5. Account-Based Data Management

UNLOOP maintains separate local data for each workspace.

The web application uses account-specific browser storage keys.

| Data | Storage Key Pattern |
|---|---|
| Subscription records | `unloop-plans-{accountId}` |
| Bookmarks | `unloop-bookmarks-{accountId}` |

This approach keeps the subscription and bookmark records of different workspaces separate within the browser.

The application also includes compatibility handling for previously stored subscription data.

**Current implementation:** These are local browser workspaces, not separate authenticated cloud accounts.

---

## 6. Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend application |
| Vite | Development and build tool |
| JavaScript | Application logic |
| HTML5 | Application structure |
| CSS3 | Interface styling |
| Lucide React | Interface icons |
| Browser Local Storage | Web application data persistence |
| Chrome Extensions API | Browser extension functionality |
| Chrome Storage API | Extension-side storage capabilities |
| Manifest V3 | Chrome extension configuration |
| Vercel | Website deployment |
| Git | Version control |
| GitHub | Source code hosting |

---

## 7. Project Architecture

UNLOOP currently consists of two primary components.

### 1. Web Application

The React-based application acts as the main subscription management interface.

Responsibilities:

- Account selection.
- Subscription management.
- Dashboard statistics.
- Upcoming renewal information.
- Trial countdown.
- Bookmark management.
- Theme and settings management.
- Receiving and processing extension messages.
- Saving data separately for each account.

### 2. Chrome Extension

The Chrome Extension provides browser-based website recognition and subscription information collection.

Responsibilities:

- Identifying the active website.
- Reading relevant webpage information.
- Scanning available subscription details.
- Providing a popup interface.
- Allowing destination account selection.
- Sending selected information to the web application.

### 3. Extension-to-Dashboard Communication

The extension and web application use a messaging integration.

The web application listens for the `SAVE_BOOKMARK` message and processes the received information.

The application identifies the selected account, validates the incoming data, checks for duplicate entries, and stores the bookmark under the selected account's storage key.

This allows extension-saved bookmarks to appear in the corresponding account's dashboard.

---

## 8. How UNLOOP Works

### Web Application Workflow

1. The user opens the UNLOOP website.
2. The user selects one of the available workspaces.
3. The dashboard loads the selected account's subscription records and bookmarks.
4. The user can add, edit, delete, or search subscriptions.
5. Dashboard summaries are calculated from the saved records.
6. Upcoming renewals and trial information are displayed.

### Chrome Extension Workflow

1. The user opens a relevant website in Chrome.
2. The extension identifies the active website and URL.
3. The extension scans available webpage content.
4. Subscription-related information is presented for review when detected.
5. The user selects the destination account.
6. The extension sends the selected information to the web application.
7. The web application processes the message and saves the bookmark under the selected account.

---

## 9. Project Structure

```text
UNLOOP/
│
├── public/
│   └── brand-mark.svg
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
│   └── content.js
│
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

---

## 10. Installation and Setup

### Prerequisites

- Node.js
- npm
- Visual Studio Code
- Google Chrome

### Clone the Repository

```bash
git clone https://github.com/Sagar7606/UNLOOP.git
```

### Navigate to the Application Directory

```bash
cd UNLOOP/unloop
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### Load the Chrome Extension

1. Open Google Chrome.
2. Navigate to `chrome://extensions`.
3. Enable **Developer Mode**.
4. Select **Load unpacked**.
5. Select the `chrome-extension` folder.
6. Pin the UNLOOP extension to the Chrome toolbar if required.

For extension-to-dashboard communication, keep the UNLOOP web application running and use the configured extension integration.

---

## 11. Current Implementation Status

| Component | Status |
|---|---|
| React Web Application | Implemented |
| UNLOOP Landing Page | Implemented |
| Multiple Account Selection | Implemented |
| Separate Account Subscription Data | Implemented |
| Separate Account Bookmarks | Implemented |
| Demo Login Workspace | Implemented |
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
| Chrome Extension Popup | Implemented |
| Active Website Information | Extension prototype |
| Webpage Content Scanning | Extension prototype |
| Subscription Detail Extraction | Dependent on webpage content |
| Destination Account Selection | Extension integration |
| Extension-to-Web App Messaging | Implemented |
| Account-Specific Bookmark Saving | Implemented |
| Cloud Database | Not implemented |
| Email-Based Subscription Detection | Not implemented |
| Automatic Payment Verification | Not implemented |
| Automatic Subscription Cancellation | Not implemented |
| Cloud Synchronisation | Not implemented |

---

## 12. Current Limitations

The current version is a browser-based prototype with local data persistence.

- Subscription records are maintained locally.
- Account workspaces are not protected by individual authentication.
- Data is not synchronised across different devices.
- Webpage scanning depends on the structure and content of the active website.
- Extracted subscription details may require manual correction.
- Website scanning does not verify actual payment transactions.
- The application does not connect to email accounts.
- Automatic subscription cancellation is not available.
- Cloud-based backup and synchronisation are not implemented.

These limitations represent opportunities for future development.

---

## 13. Future Scope

### 1. Cloud-Based Data Management

Introduce a secure backend database for persistent storage and synchronisation across devices.

### 2. User Authentication

Implement individual user registration, login, and secure account management.

### 3. Advanced Browser Integration

Improve webpage scanning and subscription detail extraction across different website structures.


### 5. Renewal Notifications

Introduce notifications for upcoming renewals and trial deadlines.

### 6. AI-Based Subscription Insights

Explore intelligent analysis of recurring expenses and personalised subscription insights.

### 7. Cancellation Assistance

Provide direct cancellation links and guided cancellation instructions for supported services.

### 8. Improved Data Synchronisation

Enable reliable communication between the Chrome Extension, web application, and future backend services.

---

## 14. Project Objective

The primary objective of UNLOOP is to make subscription management simpler, more organised, and more transparent.

By combining a centralised web dashboard with browser-based website recognition and account-specific data management, UNLOOP aims to help users monitor recurring expenses, stay informed about upcoming renewals, and manage their subscriptions more effectively.

---

## 15. Live Demo and Repository

**Live Website:** https://unloop-tau.vercel.app/

**GitHub Repository:** https://github.com/Sagar7606/UNLOOP

**TWO DEMO WEBSITE FOR TESTING: ** https://ruddy-skill-spring-learn.base44.app/ , https://netflixweb.base44.app

---

### UNLOOP
**Break Free from Recurring Payments.**
