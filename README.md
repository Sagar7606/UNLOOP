# UNLOOP – Chrome Extension

### Break Free from Recurring Payments

UNLOOP is an AI-powered subscription management platform concept designed to help users track recurring payments, manage subscriptions, and avoid unwanted renewals.

The UNLOOP Chrome Extension is the browser-based companion to the main UNLOOP application. It aims to make subscription tracking easier by recognising supported subscription platforms and allowing users to add their subscription details directly through a Chrome popup.

---

## 1. Project Overview

Managing multiple subscriptions can become difficult. Users may forget renewal dates, lose track of recurring expenses, or continue paying for services they no longer use.

UNLOOP aims to address this problem through a centralised subscription management experience.

The Chrome Extension provides a simple interface through which users can:

- Identify supported subscription-related websites.
- Recognise platforms such as Netflix, Spotify, Adobe, and YouTube.
- Enter subscription details manually.
- Save subscription information in Chrome's local extension storage.
- Prepare subscription records for future integration with the main UNLOOP dashboard.

**Important:** Website recognition does not verify whether a user has an active paid subscription. The user must confirm and enter their subscription details.

---

## 2. Features Implemented

### A. Website Recognition

The extension checks the currently active browser tab and identifies whether its domain matches a supported platform.

Currently supported demo platforms include:

- Netflix
- Spotify
- YouTube
- Amazon Prime Video
- Amazon India
- Disney+
- JioHotstar
- Adobe
- Canva
- Apple Services
- Microsoft
- Crunchyroll

If a supported domain is recognised, its service name can be filled into the subscription form.

### B. Subscription Entry Form

The extension provides a form where users can enter:

| Field | Description |
|---|---|
| Service Name | Name of the subscription platform |
| Monthly Price | Subscription cost in INR |
| Next Billing Date | Upcoming billing or renewal date |

The user can submit the form using the **Add to UNLOOP** button.

### C. Local Subscription Storage

Subscription records are saved using Chrome's `chrome.storage.local` API.

Each saved record contains:

- Unique subscription ID
- Service name
- Monthly price
- Billing cycle
- Next billing date
- Source of entry
- Demo status
- Creation timestamp

### D. Background Service Worker

The extension includes a background service worker (`background.js`) that:

- Initialises subscription storage when the extension is installed.
- Provides message handlers to retrieve subscriptions.
- Supports saving subscription records through messages.
- Supports deleting subscription records through messages.

These message handlers are available for future extension functionality.

---

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Extension popup structure |
| CSS3 | Popup styling and layout |
| JavaScript | Website recognition and form functionality |
| Chrome Extensions API | Browser extension functionality |
| Manifest V3 | Chrome extension configuration |
| Chrome Storage API | Local subscription storage |

---

## 4. Project Structure

```text
chrome-extension/
│
├── manifest.json
│
├── popup.html
│
├── popup.css
│
├── popup.js
│
├── background.js
│
└── README.md
```

### File Description

**manifest.json**

Defines the extension name, version, permissions, popup configuration, host permissions, and background service worker.

**popup.html**

Contains the user interface, website recognition section, subscription form, and status messages.

**popup.css**

Controls the visual appearance of the extension, including typography, cards, buttons, input fields, and layout.

**popup.js**

Handles current website recognition, supported platform matching, form validation, and subscription storage.

**background.js**

Initialises extension storage and provides message handlers for retrieving, saving, and deleting subscription records.

---

## 5. How the Extension Works

The current demonstration follows this workflow:

1. The user opens a supported subscription platform in Chrome.
2. The user clicks the UNLOOP extension icon.
3. The extension identifies the current website domain.
4. The user clicks **Detect Subscription**.
5. The recognised service name is entered into the form.
6. The user enters the monthly price and next billing date.
7. The user clicks **Add to UNLOOP**.
8. The subscription is saved in Chrome's local extension storage.

The extension currently relies on user-entered subscription information rather than automatic payment verification.

---

## 6. Installation and Setup

The extension can be tested locally without publishing it to the Chrome Web Store.

### Requirements

- Google Chrome
- Visual Studio Code
- UNLOOP Chrome Extension source files

### Installation Steps

1. Open Google Chrome.
2. Navigate to:

   `chrome://extensions`

3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the `chrome-extension` folder.
6. The UNLOOP extension will appear in the installed extensions list.
7. Pin the extension to the Chrome toolbar for easy access.

### Testing

1. Open a supported website such as Netflix or Spotify.
2. Click the UNLOOP extension icon.
3. Click **Detect Subscription**.
4. Enter a sample monthly price and billing date.
5. Click **Add to UNLOOP**.
6. A confirmation message should appear when the record is successfully saved.

---

## 7. Current Implementation Status

| Component | Status |
|---|---|
| Chrome Extension Manifest V3 | Implemented |
| Extension Popup UI | Implemented |
| Website Domain Recognition | Implemented |
| Subscription Entry Form | Implemented |
| Form Validation | Implemented |
| Chrome Local Storage | Implemented |
| Background Service Worker | Implemented |
| Dashboard Integration | Pending |
| Automatic Email Receipt Detection | Not Implemented |
| Automatic Payment Verification | Not Implemented |
| Automatic Subscription Cancellation | Not Implemented |
| Cloud Synchronisation | Pending |

---

## 8. Current Limitations

The current version is an initial working prototype focused on browser-based subscription entry.

The following capabilities are not yet implemented:

- Automatic detection of active subscriptions.
- Reading subscription receipts from email.
- Verifying actual recurring payments.
- Automatically synchronising records with the main UNLOOP dashboard.
- Sending renewal notifications.
- Cancelling subscriptions automatically.

The current extension stores its data separately in Chrome's local storage. Dashboard integration will require an additional communication mechanism between the extension and the React application.

---

## 9. Future Enhancements

Planned improvements include:

1. **Dashboard Integration:** Connect the Chrome Extension with the existing UNLOOP React dashboard.
2. **Subscription Synchronisation:** Transfer subscription records between the extension and the main application.
3. **Renewal Reminders:** Notify users about upcoming subscription renewals.
4. **Email Receipt Detection:** Explore secure integration with email services to identify subscription receipts.
5. **Subscription Insights:** Display recurring expense summaries and upcoming payment information.
6. **Improved Detection:** Expand supported platforms and improve subscription-related website recognition.

---

## 10. Project Objective

The objective of the UNLOOP Chrome Extension is to simplify subscription tracking by bringing subscription entry and website recognition directly into the browser.

It serves as the first step towards a more connected subscription management platform that helps users stay aware of recurring expenses and manage their subscriptions efficiently.

---

**UNLOOP – Break Free from Recurring Payments.**
