import { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  CreditCard,
  Bookmark,
  Plus,
  Search,
  X,
  ShieldCheck,
  Wallet,
  Moon,
  Sun,
  Settings,
  Trash2,
  Pencil,
  ExternalLink,
  Download,
  BellRing,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock3,
  ChevronRight,
  CircleHelp,
  LogOut,
  Users,
  UserRound,
} from "lucide-react";

import "./App.css";

/* -------------------- ACCOUNT CONFIGURATION -------------------- */

const accounts = [
  {
    id: "user-1",
    name: "User 1",
    description: "Personal workspace",
    initials: "U1",
  },
  {
    id: "user-2",
    name: "User 2",
    description: "Personal workspace",
    initials: "U2",
  },
  {
    id: "user-3",
    name: "User 3",
    description: "Personal workspace",
    initials: "U3",
  },
  {
    id: "demo",
    name: "Demo Login",
    description: "Explore UNLOOP with an empty dashboard",
    initials: "D",
  },
];

/* -------------------- ACCOUNT INITIAL DATA -------------------- */

const accountSeeds = {
  "user-1": [
    {
      id: 1,
      name: "Netflix",
      category: "Entertainment",
      price: 649,
      cycle: "Monthly",
      date: "2026-11-05",
      status: "Active",
    },
    {
      id: 2,
      name: "Spotify Premium",
      category: "Music",
      price: 119,
      cycle: "Monthly",
      date: "2026-11-08",
      status: "Active",
    },
    {
      id: 3,
      name: "Notion Plus",
      category: "Productivity",
      price: 800,
      cycle: "Monthly",
      date: "2026-11-12",
      status: "Trial",
    },
    {
      id: 4,
      name: "Amazon Prime",
      category: "Entertainment",
      price: 1499,
      cycle: "Yearly",
      date: "2026-11-20",
      status: "Active",
    },
  ],

  "user-2": [
    {
      id: 1,
      name: "YouTube Premium",
      category: "Entertainment",
      price: 149,
      cycle: "Monthly",
      date: "2026-11-06",
      status: "Active",
    },
    {
      id: 2,
      name: "Canva Pro",
      category: "Productivity",
      price: 500,
      cycle: "Monthly",
      date: "2026-11-14",
      status: "Active",
    },
    {
      id: 3,
      name: "Disney+ Hotstar",
      category: "Entertainment",
      price: 299,
      cycle: "Monthly",
      date: "2026-11-22",
      status: "Trial",
    },
  ],

  "user-3": [
    {
      id: 1,
      name: "Netflix",
      category: "Entertainment",
      price: 649,
      cycle: "Monthly",
      date: "2026-11-04",
      status: "Active",
    },
    {
      id: 2,
      name: "Spotify",
      category: "Music",
      price: 119,
      cycle: "Monthly",
      date: "2026-11-09",
      status: "Active",
    },
    {
      id: 3,
      name: "ChatGPT Plus",
      category: "Productivity",
      price: 1999,
      cycle: "Monthly",
      date: "2026-11-15",
      status: "Active",
    },
    {
      id: 4,
      name: "Amazon Prime",
      category: "Entertainment",
      price: 1499,
      cycle: "Yearly",
      date: "2026-11-19",
      status: "Active",
    },
    {
      id: 5,
      name: "Google One",
      category: "Storage",
      price: 130,
      cycle: "Monthly",
      date: "2026-11-25",
      status: "Trial",
    },
  ],

  demo: [],
};

/* -------------------- STORAGE HELPERS -------------------- */

function getAccountStorageKey(accountId) {
  return `unloop-plans-${accountId}`;
}

function getBookmarksStorageKey(accountId) {
  return `unloop-bookmarks-${accountId}`;
}

function loadAccountPlans(accountId) {
  const storageKey = getAccountStorageKey(accountId);

  try {
    const saved = localStorage.getItem(storageKey);

    if (saved !== null) {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    }

    if (accountId === "user-1") {
      const oldData = localStorage.getItem("unloop-plans");

      if (oldData !== null) {
        const parsedOldData = JSON.parse(oldData);

        if (Array.isArray(parsedOldData)) {
          localStorage.setItem(storageKey, JSON.stringify(parsedOldData));
          return parsedOldData;
        }
      }
    }

    const seed = accountSeeds[accountId] || [];
    localStorage.setItem(storageKey, JSON.stringify(seed));

    return seed;
  } catch (error) {
    console.error("Unable to load account data:", error);
    return accountSeeds[accountId] || [];
  }
}

function loadAccountBookmarks(accountId) {
  try {
    const saved = localStorage.getItem(
      getBookmarksStorageKey(accountId)
    );

    if (saved === null) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Unable to load bookmarks:", error);
    return [];
  }
}

/* -------------------- SERVICE WEBSITES -------------------- */

const serviceDomains = {
  netflix: "https://www.netflix.com",
  spotify: "https://www.spotify.com",
  notion: "https://www.notion.so",
  youtube: "https://www.youtube.com",
  "prime video": "https://www.primevideo.com",
  amazon: "https://www.amazon.in",
  hotstar: "https://www.hotstar.com",
  jio: "https://www.jio.com",
  canva: "https://www.canva.com",
  figma: "https://www.figma.com",
  github: "https://github.com",
  chatgpt: "https://chatgpt.com",
  microsoft: "https://www.microsoft.com",
  google: "https://www.google.com",
  adobe: "https://www.adobe.com",
  disney: "https://www.disneyplus.com",
  "apple music": "https://music.apple.com",
  "apple tv": "https://tv.apple.com",
  dropbox: "https://www.dropbox.com",
  slack: "https://slack.com",
  zoom: "https://zoom.us",
};

function getServiceDomain(name) {
  const normalizedName = String(name || "").toLowerCase();

  const match = Object.keys(serviceDomains).find((service) =>
    normalizedName.includes(service)
  );

  return match ? serviceDomains[match] : null;
}

/* -------------------- HELPERS -------------------- */

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

function formatDate(date) {
  if (!date) return "Date not set";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not set";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getTrialRemaining(date) {
  if (!date) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(endDate.getTime())) return null;

  return Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
}

function getNextSevenDays(date) {
  if (!date) return false;

  const remaining = getTrialRemaining(date);

  return remaining !== null && remaining >= 0 && remaining <= 7;
}

function getStatusClass(status) {
  return String(status || "").toLowerCase().replace(/\s+/g, "-");
}

/* -------------------- COMPANY LOGO -------------------- */

function CompanyLogo({ name, small = false }) {
  const [imageError, setImageError] = useState(false);
  const domain = getServiceDomain(name);

  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${new URL(domain).hostname}&sz=128`
    : null;

  return (
    <div className={`company-logo ${small ? "small-logo" : ""}`}>
      {faviconUrl && !imageError ? (
        <img
          src={faviconUrl}
          alt={`${name} logo`}
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{name.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

/* -------------------- TRIAL COUNTDOWN -------------------- */

function TrialCountdown({ plan }) {
  if (plan.status !== "Trial") {
    return (
      <span className="trial-label paid-label">
        <CheckCircle2 size={13} />
        Paid Plan
      </span>
    );
  }

  if (!plan.date) {
    return (
      <span className="trial-label neutral-label">
        <Clock3 size={13} />
        Date not set
      </span>
    );
  }

  const remaining = getTrialRemaining(plan.date);

  if (remaining === null) {
    return <span className="trial-label neutral-label">Date not set</span>;
  }

  if (remaining < 0) {
    return (
      <span className="trial-label expired-label">
        <AlertCircle size={13} />
        Trial Expired
      </span>
    );
  }

  if (remaining === 0) {
    return (
      <span className="trial-label warning-label">
        <AlertCircle size={13} />
        Expires Today
      </span>
    );
  }

  if (remaining <= 3) {
    return (
      <span className="trial-label warning-label">
        <AlertCircle size={13} />
        {remaining} days left
      </span>
    );
  }

  return (
    <span className="trial-label safe-label">
      <Clock3 size={13} />
      {remaining} days left
    </span>
  );
}

/* -------------------- EMPTY FORM -------------------- */

const emptyForm = {
  name: "",
  category: "Entertainment",
  price: "",
  cycle: "Monthly",
  date: "",
  status: "Active",
};

/* -------------------- ACCOUNT SELECTION SCREEN -------------------- */

function AccountSelection({ onSelect, theme, onToggleTheme }) {
  return (
    <div className="account-selection-screen">
      <div className="account-selection-topbar">
        <div className="account-brand">
          <div className="brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div className="brand-name">
            <h2>UNLOOP</h2>
            <span>Subscription Guardian</span>
          </div>
        </div>

        <button
          className="icon-button"
          title="Toggle theme"
          onClick={onToggleTheme}
        >
          {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
        </button>
      </div>

      <div className="account-selection-content">
        <div className="account-welcome-icon">
          <Users size={30} />
        </div>

        <span className="account-eyebrow">
          YOUR SUBSCRIPTIONS, YOUR CONTROL
        </span>

        <h1>Welcome to UNLOOP</h1>

        <p className="account-subtitle">
          Select an account to access its subscription dashboard.
        </p>

        <div className="account-cards">
          {accounts.map((account, index) => {
            const subscriptionCount =
              accountSeeds[account.id]?.length || 0;

            return (
              <button
                className={`account-card ${
                  account.id === "demo" ? "demo-account-card" : ""
                }`}
                key={account.id}
                onClick={() => onSelect(account.id)}
              >
                <div className={`account-avatar account-avatar-${index}`}>
                  {account.id === "demo" ? (
                    <UserRound size={25} />
                  ) : (
                    account.initials
                  )}
                </div>

                <div className="account-card-info">
                  <strong>{account.name}</strong>
                  <span>{account.description}</span>

                  <small>
                    {account.id === "demo"
                      ? "Start with a blank dashboard"
                      : `${subscriptionCount} sample subscriptions`}
                  </small>
                </div>

                <ChevronRight size={20} className="account-card-arrow" />
              </button>
            );
          })}
        </div>

        <p className="account-selection-footer">
          <ShieldCheck size={14} />
          Each account has its own separately saved subscription data.
        </p>
      </div>

      <footer className="account-screen-footer">
        © 2026 UNLOOP · Break Free from Recurring Payments.
      </footer>
    </div>
  );
}

/* -------------------- MAIN APP -------------------- */

function App() {
  const [activeUser, setActiveUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const [theme, setTheme] = useState(
    () => localStorage.getItem("unloop-theme") || "light"
  );

  const [page, setPage] = useState("Overview");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);

  const [reminders, setReminders] = useState(
    () => localStorage.getItem("unloop-reminders") !== "false"
  );

  const [reminderDays, setReminderDays] = useState(
    () => localStorage.getItem("unloop-reminder-days") || "3"
  );

  const selectedAccount = accounts.find(
    (account) => account.id === activeUser
  );

  /* -------------------- ACCOUNT HANDLERS -------------------- */

  function loginAs(accountId) {
    setPlans(loadAccountPlans(accountId));
    setBookmarks(loadAccountBookmarks(accountId));
    setActiveUser(accountId);
    setPage("Overview");
    setSearch("");
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function logout() {
    setActiveUser(null);
    setPlans([]);
    setBookmarks([]);
    setPage("Overview");
    setSearch("");
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function resetDemoAccount() {
    const confirmed = window.confirm(
      "Reset Demo Login to an empty dashboard?"
    );

    if (!confirmed) return;

    localStorage.setItem(
      getAccountStorageKey("demo"),
      JSON.stringify([])
    );

    localStorage.setItem(
      getBookmarksStorageKey("demo"),
      JSON.stringify([])
    );

    if (activeUser === "demo") {
      setPlans([]);
      setBookmarks([]);
    }

    alert("Demo account has been reset.");
  }

  /* -------------------- LOCAL STORAGE -------------------- */

  useEffect(() => {
    if (!activeUser) return;

    localStorage.setItem(
      getAccountStorageKey(activeUser),
      JSON.stringify(plans)
    );
  }, [plans, activeUser]);

  useEffect(() => {
    if (!activeUser) return;

    localStorage.setItem(
      getBookmarksStorageKey(activeUser),
      JSON.stringify(bookmarks)
    );
  }, [bookmarks, activeUser]);

  useEffect(() => {
    localStorage.setItem("unloop-theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("unloop-reminders", String(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("unloop-reminder-days", reminderDays);
  }, [reminderDays]);

  /* -------------------- CHROME EXTENSION BRIDGE -------------------- */

useEffect(() => {
  function handleExtensionMessage(event) {
    if (event.source !== window) return;

    const data = event.data;

    if (
      !data ||
      data.source !== "UNLOOP_EXTENSION" ||
      data.type !== "SAVE_BOOKMARK" ||
      typeof data.requestId !== "string"
    ) {
      return;
    }

    function respond(response) {
      window.postMessage(
        {
          source: "UNLOOP_WEB",
          type: "UNLOOP_RESPONSE",
          requestId: data.requestId,
          response,
        },
        window.location.origin
      );
    }

    const subscription = data.payload?.subscription;

    const accountMap = {
      user1: "user-1",
      user2: "user-2",
      user3: "user-3",
      demo: "demo",

      // Also accept IDs already used by the app
      "user-1": "user-1",
      "user-2": "user-2",
      "user-3": "user-3",
    };

    const targetAccountId =
      accountMap[subscription?.targetAccountId];

    if (!targetAccountId) {
      respond({
        success: false,
        message: "Please select a valid UNLOOP account.",
      });
      return;
    }

    if (
      !subscription ||
      typeof subscription.id !== "string" ||
      typeof subscription.name !== "string" ||
      !subscription.name.trim() ||
      !Number.isFinite(Number(subscription.price)) ||
      Number(subscription.price) < 0 ||
      !subscription.nextBillingDate
    ) {
      respond({
        success: false,
        message: "Invalid subscription details.",
      });
      return;
    }

    const bookmark = {
      id: subscription.id,
      name: subscription.name.trim(),
      planName: subscription.planName || subscription.name,
      price: Number(subscription.price),
      currency: subscription.currency || "INR",
      billingCycle: subscription.billingCycle || "Monthly",
      nextBillingDate: subscription.nextBillingDate,
      websiteName: subscription.websiteName || subscription.name,
      websiteUrl: subscription.websiteUrl || "",
      source: "Chrome Extension",
      bookmarkedAt: new Date().toISOString(),
    };

    try {
      const storageKey = getBookmarksStorageKey(targetAccountId);

      const existingBookmarks =
        loadAccountBookmarks(targetAccountId);

      const alreadyExists = existingBookmarks.some(
        (item) =>
          item.id === bookmark.id ||
          (
            item.websiteUrl &&
            bookmark.websiteUrl &&
            item.websiteUrl === bookmark.websiteUrl &&
            item.name.toLowerCase() === bookmark.name.toLowerCase()
          )
      );

      if (alreadyExists) {
        respond({
          success: false,
          message: "This subscription is already bookmarked.",
        });
        return;
      }

      const updatedBookmarks = [
        bookmark,
        ...existingBookmarks,
      ];

      localStorage.setItem(
        storageKey,
        JSON.stringify(updatedBookmarks)
      );

      // Update visible state only if the target account is open.
      if (activeUser === targetAccountId) {
        setBookmarks(updatedBookmarks);
      }

      const account = accounts.find(
        (item) => item.id === targetAccountId
      );

      respond({
        success: true,
        accountId: targetAccountId,
        accountName: account?.name || targetAccountId,
        message: `Bookmark saved to ${account?.name || targetAccountId}.`,
      });
    } catch (error) {
      console.error("Bookmark save failed:", error);

      respond({
        success: false,
        message: "Unable to save bookmark in UNLOOP.",
      });
    }
  }

  window.addEventListener("message", handleExtensionMessage);

  return () => {
    window.removeEventListener(
      "message",
      handleExtensionMessage
    );
  };
}, [activeUser]);

  /* -------------------- CALCULATIONS -------------------- */

  const monthlySpend = useMemo(() => {
    return plans
      .filter((plan) => plan.status === "Active")
      .reduce((total, plan) => {
        const price = Number(plan.price) || 0;

        if (plan.cycle === "Yearly") {
          return total + price / 12;
        }

        if (plan.cycle === "Weekly") {
          return total + price * 4.33;
        }

        return total + price;
      }, 0);
  }, [plans]);

  const upcomingPlans = useMemo(() => {
    return plans
      .filter((plan) => getNextSevenDays(plan.date))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [plans]);

  const filteredPlans = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return plans;

    return plans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(query) ||
        plan.category.toLowerCase().includes(query) ||
        plan.status.toLowerCase().includes(query)
    );
  }, [plans, search]);

  const trialCount = plans.filter(
    (plan) => plan.status === "Trial"
  ).length;

  /* -------------------- FORM HANDLERS -------------------- */

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(plan) {
    setEditingId(plan.id);

    setForm({
      name: plan.name,
      category: plan.category,
      price: String(plan.price),
      cycle: plan.cycle,
      date: plan.date || "",
      status: plan.status,
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function savePlan(event) {
    event.preventDefault();

    if (!form.name.trim() || form.price === "") return;

    const numericPrice = Number(form.price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      alert("Please enter a valid subscription price.");
      return;
    }

    const planData = {
      ...form,
      name: form.name.trim(),
      price: numericPrice,
    };

    if (editingId !== null) {
      setPlans((previous) =>
        previous.map((plan) =>
          plan.id === editingId ? { ...plan, ...planData } : plan
        )
      );
    } else {
      setPlans((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...planData,
        },
      ]);
    }

    closeForm();
  }

  function deletePlan(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscription?"
    );

    if (!confirmed) return;

    setPlans((previous) => previous.filter((plan) => plan.id !== id));
  }

  /* -------------------- BOOKMARK HANDLERS -------------------- */

  function removeBookmark(id) {
    const confirmed = window.confirm(
      "Remove this bookmark from your account?"
    );

    if (!confirmed) return;

    setBookmarks((previous) =>
      previous.filter((bookmark) => bookmark.id !== id)
    );
  }

  /* -------------------- CSV EXPORT -------------------- */

  function exportCSV() {
    if (plans.length === 0) {
      alert("No subscriptions available to export.");
      return;
    }

    const headers = [
      "Name",
      "Category",
      "Price",
      "Billing Cycle",
      "Next Billing Date",
      "Status",
    ];

    const rows = plans.map((plan) => [
      plan.name,
      plan.category,
      plan.price,
      plan.cycle,
      plan.date,
      plan.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `unloop-${activeUser}-subscriptions.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  function clearData() {
    const confirmed = window.confirm(
      `This will permanently clear subscriptions for ${selectedAccount?.name}. Continue?`
    );

    if (!confirmed) return;

    setPlans([]);
  }

  /* -------------------- SIDEBAR -------------------- */

  function Sidebar() {
    const navigation = [
      { name: "Overview", icon: LayoutDashboard },
      { name: "My Subscriptions", icon: CreditCard },
      { name: "Bookmarks", icon: Bookmark },
      { name: "Settings", icon: Settings },
    ];

    return (
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <ShieldCheck size={25} />
          </div>

          <div className="brand-name">
            <h2>UNLOOP</h2>
            <span>Subscription Guardian</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-heading">MENU</p>

          <nav className="navigation">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  className={`nav-item ${
                    page === item.name ? "active" : ""
                  }`}
                  onClick={() => {
                    setPage(item.name);
                    setSearch("");
                  }}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>

                  {page === item.name && (
                    <ChevronRight size={16} className="nav-arrow" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="sidebar-help-icon">
            <CircleHelp size={20} />
          </div>

          <div>
            <strong>Need help?</strong>
            <p>Manage subscriptions smarter.</p>
          </div>
        </div>

        <div className="sidebar-footer">
          <span className="footer-dot"></span>
          UNLOOP v1.1
        </div>
      </aside>
    );
  }

  /* -------------------- TOPBAR -------------------- */

  function Topbar() {
    return (
      <header className="topbar">
        <div>
          <p className="topbar-label">YOUR WORKSPACE</p>
          <h3>{page}</h3>
        </div>

        <div className="topbar-actions">
          <div className="current-account-label">
            <UserRound size={15} />
            <span>{selectedAccount?.name}</span>
          </div>

          <button
            className="icon-button"
            title="Toggle theme"
            onClick={() =>
              setTheme((previous) =>
                previous === "light" ? "dark" : "light"
              )
            }
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          <button
            className="logout-button"
            onClick={logout}
            title="Logout / Switch Account"
          >
            <LogOut size={16} />
            <span>Switch Account</span>
          </button>

          <div className="topbar-avatar">
            {selectedAccount?.initials || "U"}
          </div>
        </div>
      </header>
    );
  }

  /* -------------------- PAGE INTRO -------------------- */

  function PageIntro({ title, description, action }) {
    return (
      <div className="page-intro">
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {action}
      </div>
    );
  }

  /* -------------------- STAT CARD -------------------- */

  function StatCard({ icon: Icon, label, value, description, className }) {
    return (
      <div className={`stat-card ${className || ""}`}>
        <div className="stat-top">
          <div className="stat-icon">
            <Icon size={21} />
          </div>
        </div>

        <p className="stat-label">{label}</p>
        <h2>{value}</h2>
        <span className="stat-description">{description}</span>
      </div>
    );
  }

  /* -------------------- OVERVIEW -------------------- */

  function OverviewPage() {
    return (
      <>
        <section className="welcome-section">
          <div>
            <span className="welcome-tag">
              <span className="welcome-dot"></span>
              SMART SUBSCRIPTION MANAGEMENT
            </span>

            <h1>
              Take control of your
              <br />
              <span>recurring payments.</span>
            </h1>

            <p>
              Keep track of subscriptions, monitor upcoming payments,
              and stay in control of your spending.
            </p>

            <button className="primary-button" onClick={openAddForm}>
              <Plus size={18} />
              Add Subscription
            </button>
          </div>

          <div className="welcome-illustration">
            <div className="illustration-circle">
              <ShieldCheck size={76} strokeWidth={1.4} />
            </div>

            <div className="illustration-caption">
              <CheckCircle2 size={15} />
              Your subscriptions, organized.
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <StatCard
            icon={Wallet}
            label="Monthly Spending"
            value={formatCurrency(monthlySpend)}
            description="Estimated active plan cost"
            className="stat-blue"
          />

          <StatCard
            icon={CreditCard}
            label="Tracked Subscriptions"
            value={plans.length}
            description="Total saved subscriptions"
            className="stat-orange"
          />

          <StatCard
            icon={CalendarDays}
            label="Upcoming in 7 Days"
            value={upcomingPlans.length}
            description="Renewals and trial end dates"
            className="stat-purple"
          />

          <StatCard
            icon={Clock3}
            label="Active Trials"
            value={trialCount}
            description="Trials currently being tracked"
            className="stat-green"
          />
        </section>

        <div className="overview-grid">
          <section className="content-panel overview-subscriptions">
            <div className="section-heading">
              <div>
                <h2>My Subscriptions</h2>
                <p>Your recently tracked subscriptions</p>
              </div>

              <button
                className="text-button"
                onClick={() => setPage("My Subscriptions")}
              >
                View all <ChevronRight size={16} />
              </button>
            </div>

            {plans.length === 0 ? (
              <div className="small-empty-state">
                <CreditCard size={30} />
                <p>No subscriptions added yet.</p>
                <button className="text-button" onClick={openAddForm}>
                  Add your first subscription
                </button>
              </div>
            ) : (
              <div className="overview-plan-list">
                {plans.slice(0, 4).map((plan) => (
                  <div className="overview-plan-row" key={plan.id}>
                    <CompanyLogo name={plan.name} small />

                    <div className="overview-plan-info">
                      <strong>{plan.name}</strong>
                      <span>{plan.category}</span>
                    </div>

                    <div className="overview-plan-price">
                      <strong>{formatCurrency(plan.price)}</strong>
                      <span>/{plan.cycle.toLowerCase()}</span>
                    </div>

                    <span
                      className={`status-badge ${getStatusClass(plan.status)}`}
                    >
                      {plan.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="content-panel upcoming-panel">
            <div className="section-heading">
              <div>
                <h2>Upcoming Dates</h2>
                <p>Next 7 days</p>
              </div>

              <div className="heading-icon">
                <BellRing size={18} />
              </div>
            </div>

            {upcomingPlans.length === 0 ? (
              <div className="small-empty-state">
                <CalendarDays size={30} />
                <p>No upcoming dates in the next 7 days.</p>
              </div>
            ) : (
              <div className="upcoming-list">
                {upcomingPlans.map((plan) => (
                  <div className="upcoming-item" key={plan.id}>
                    <div className="upcoming-date-icon">
                      <CalendarDays size={19} />
                    </div>

                    <div className="upcoming-info">
                      <strong>{plan.name}</strong>
                      <span>{formatDate(plan.date)}</span>
                    </div>

                    <span className="upcoming-price">
                      {formatCurrency(plan.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="upcoming-note">
              <AlertCircle size={16} />
              Keep your billing dates updated to track renewals accurately.
            </div>
          </section>
        </div>

        <section className="tip-card">
          <div className="tip-icon">
            <TrendingUp size={23} />
          </div>

          <div>
            <strong>Stay ahead of recurring payments</strong>
            <p>
              Review your subscriptions regularly and keep your billing
              information up to date.
            </p>
          </div>
        </section>
      </>
    );
  }

  /* -------------------- SUBSCRIPTION CARD -------------------- */

  function SubscriptionCard({ plan }) {
    const website = getServiceDomain(plan.name);

    return (
      <article className="subscription-card">
        <div className="subscription-card-header">
          <div className="subscription-company">
            <CompanyLogo name={plan.name} />

            <div>
              <h3>{plan.name}</h3>
              <p>{plan.category}</p>
            </div>
          </div>

          <span className={`status-badge ${getStatusClass(plan.status)}`}>
            {plan.status}
          </span>
        </div>

        <div className="subscription-price-section">
          <div>
            <span className="price-caption">Subscription cost</span>

            <div className="subscription-price">
              {formatCurrency(plan.price)}
              <span> / {plan.cycle.toLowerCase()}</span>
            </div>
          </div>

          <TrialCountdown plan={plan} />
        </div>

        <div className="subscription-details-grid">
          <div className="detail-box">
            <span>Category</span>
            <strong>{plan.category}</strong>
          </div>

          <div className="detail-box">
            <span>Billing Cycle</span>
            <strong>{plan.cycle}</strong>
          </div>

          <div className="detail-box">
            <span>
              {plan.status === "Trial" ? "Trial End Date" : "Next Billing Date"}
            </span>
            <strong>{formatDate(plan.date)}</strong>
          </div>

          <div className="detail-box">
            <span>Plan Status</span>
            <strong>{plan.status}</strong>
          </div>
        </div>

        <div className="subscription-card-footer">
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="website-link"
            >
              Visit Website <ExternalLink size={14} />
            </a>
          ) : (
            <span className="website-unavailable">Website not available</span>
          )}

          <div className="card-actions">
            <button
              className="edit-button"
              onClick={() => openEditForm(plan)}
            >
              <Pencil size={15} />
              Edit
            </button>

            <button
              className="delete-button"
              onClick={() => deletePlan(plan.id)}
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </div>
      </article>
    );
  }

  /* -------------------- SUBSCRIPTIONS PAGE -------------------- */

  function SubscriptionsPage() {
    return (
      <>
        <PageIntro
          title="All Subscriptions"
          description="View and manage all your tracked subscriptions in one place."
          action={
            <button className="primary-button" onClick={openAddForm}>
              <Plus size={18} />
              Add Subscription
            </button>
          }
        />

        <div className="subscription-toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search by name, category or status..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <span className="results-count">
            {filteredPlans.length} subscription
            {filteredPlans.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CreditCard size={38} />
            </div>

            <h2>
              {search ? "No matching subscriptions" : "No subscriptions yet"}
            </h2>

            <p>
              {search
                ? "Try searching with another name or category."
                : "Add your first subscription to start tracking your recurring payments."}
            </p>

            {search ? (
              <button
                className="secondary-button"
                onClick={() => setSearch("")}
              >
                Clear Search
              </button>
            ) : (
              <button className="primary-button" onClick={openAddForm}>
                <Plus size={18} />
                Add Subscription
              </button>
            )}
          </div>
        ) : (
          <div className="subscription-cards-grid">
            {filteredPlans.map((plan) => (
              <SubscriptionCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </>
    );
  }

  /* -------------------- BOOKMARKS PAGE -------------------- */

function BookmarksPage() {
  return (
    <>
      <PageIntro
        title="Bookmarks"
        description="Subscriptions saved from your browser extension."
      />

      <div className="subscription-toolbar">
        <span className="results-count">
          {bookmarks.length} bookmark
          {bookmarks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Bookmark size={38} />
          </div>

          <h2>No bookmarks yet</h2>

          <p>
            Open any subscription website, use the UNLOOP Chrome
            Extension, select your account, and save the subscription
            to see it here.
          </p>
        </div>
      ) : (
        <div className="subscription-cards-grid">
          {bookmarks.map((bookmark) => (
            <article className="subscription-card" key={bookmark.id}>
              <div className="subscription-card-header">
                <div className="subscription-company">
                  <CompanyLogo
                    name={bookmark.websiteName || bookmark.name}
                  />

                  <div>
                    <h3>{bookmark.name}</h3>
                    <p>
                      {bookmark.planName || "Subscription"} · Chrome
                      Extension
                    </p>
                  </div>
                </div>

                <span className="status-badge active">
                  Bookmarked
                </span>
              </div>

              <div className="subscription-price-section">
                <div>
                  <span className="price-caption">
                    Subscription cost
                  </span>

                  <div className="subscription-price">
                    {formatCurrency(bookmark.price)}
                    <span>
                      / {(bookmark.billingCycle || "Monthly").toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="subscription-details-grid">
                <div className="detail-box">
                  <span>Next Billing Date</span>
                  <strong>
                    {formatDate(bookmark.nextBillingDate)}
                  </strong>
                </div>

                <div className="detail-box">
                  <span>Bookmark Date</span>
                  <strong>
                    {formatDate(bookmark.bookmarkedAt?.slice(0, 10))}
                  </strong>
                </div>
              </div>

              <div className="subscription-card-footer">
                {(bookmark.websiteUrl || bookmark.website) ? (
                  <a
                    href={bookmark.websiteUrl || bookmark.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-link"
                  >
                    Visit Website <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="website-unavailable">
                    Website not available
                  </span>
                )}

                <div className="card-actions">
                  <button
                    className="delete-button"
                    onClick={() => removeBookmark(bookmark.id)}
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
    /* -------------------- SETTINGS PAGE -------------------- */

  function SettingsPage() {
    return (
      <>
        <PageIntro
          title="Settings"
          description="Customize your UNLOOP experience and manage your data."
        />

        <div className="settings-layout">
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">
                <Sun size={20} />
              </div>

              <div>
                <h2>Appearance</h2>
                <p>Choose how UNLOOP looks on your device.</p>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <strong>Dark Mode</strong>
                <span>Switch between light and dark appearance.</span>
              </div>

              <button
                className={`toggle-switch ${theme === "dark" ? "enabled" : ""}`}
                onClick={() =>
                  setTheme((previous) =>
                    previous === "light" ? "dark" : "light"
                  )
                }
                aria-label="Toggle dark mode"
              >
                <span></span>
              </button>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">
                <BellRing size={20} />
              </div>

              <div>
                <h2>Reminder Preferences</h2>
                <p>Choose your preferred reminder settings.</p>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <strong>Enable Reminder Preferences</strong>
                <span>Save your preferred reminder settings.</span>
              </div>

              <button
                className={`toggle-switch ${reminders ? "enabled" : ""}`}
                onClick={() => setReminders((previous) => !previous)}
                aria-label="Toggle reminder preferences"
              >
                <span></span>
              </button>
            </div>

            <div className="settings-row">
              <div>
                <strong>Reminder Timing</strong>
                <span>Preferred number of days before a due date.</span>
              </div>

              <select
                className="settings-select"
                value={reminderDays}
                onChange={(event) => setReminderDays(event.target.value)}
                disabled={!reminders}
              >
                <option value="1">1 day before</option>
                <option value="3">3 days before</option>
                <option value="5">5 days before</option>
                <option value="7">7 days before</option>
              </select>
            </div>

            <div className="settings-info">
              <AlertCircle size={16} />
              These are saved preferences only. Actual browser notifications
              are not enabled yet.
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">
                <Wallet size={20} />
              </div>

              <div>
                <h2>Data Management</h2>
                <p>
                  Export or clear subscription data for the current account.
                </p>
              </div>
            </div>

            <div className="settings-row">
              <div>
                <strong>Export Subscriptions</strong>
                <span>Download your subscription list as a CSV file.</span>
              </div>

              <button className="secondary-button" onClick={exportCSV}>
                <Download size={16} />
                Export CSV
              </button>
            </div>

            <div className="settings-row">
              <div>
                <strong>Clear Current Account Data</strong>
                <span>
                  Remove subscriptions saved for {selectedAccount?.name}.
                </span>
              </div>

              <button className="danger-button" onClick={clearData}>
                <Trash2 size={16} />
                Clear Data
              </button>
            </div>

            {activeUser === "demo" && (
              <div className="settings-row">
                <div>
                  <strong>Reset Demo Account</strong>
                  <span>Restore the Demo Login dashboard to empty.</span>
                </div>

                <button
                  className="secondary-button"
                  onClick={resetDemoAccount}
                >
                  Reset Demo
                </button>
              </div>
            )}

            <div className="settings-info">
              <ShieldCheck size={16} />
              Each account is stored separately in this browser.
              Cloud synchronization is not enabled.
            </div>
          </section>

          <section className="settings-card about-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2>About UNLOOP</h2>
                <p>Break Free from Recurring Payments.</p>
              </div>
            </div>

            <p className="about-description">
              UNLOOP is a subscription management platform designed to help
              users organize recurring payments, track trial dates, and
              stay aware of upcoming billing events.
            </p>

            <div className="about-footer">
              <span>UNLOOP</span>
              <span>Version 1.1</span>
            </div>
          </section>
        </div>
      </>
    );
  }

  /* -------------------- ACCOUNT SELECTION RENDER -------------------- */

  if (!activeUser) {
    return (
      <AccountSelection
        onSelect={loginAs}
        theme={theme}
        onToggleTheme={() =>
          setTheme((previous) =>
            previous === "light" ? "dark" : "light"
          )
        }
      />
    );
  }

  /* -------------------- MAIN RENDER -------------------- */

  return (
    <div className={`app-shell ${theme}`}>
      <Sidebar />

      <main className="main-content">
        <Topbar />

        <div className="page-content">
          {page === "Overview" && <OverviewPage />}

          {page === "My Subscriptions" && <SubscriptionsPage />}

          {page === "Bookmarks" && <BookmarksPage />}

          {page === "Settings" && <SettingsPage />}

          <footer className="main-footer">
            <span>© 2026 UNLOOP. All rights reserved.</span>
            <span>Break Free from Recurring Payments.</span>
          </footer>
        </div>
      </main>

      {/* -------------------- ADD / EDIT MODAL -------------------- */}
      {/* Inline rendering keeps the input mounted while typing. */}

      {showForm && (
        <div className="modal-overlay" onMouseDown={closeForm}>
          <div
            className="modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">
                  SUBSCRIPTION MANAGEMENT
                </span>

                <h2>
                  {editingId !== null
                    ? "Edit Subscription"
                    : "Add Subscription"}
                </h2>

                <p>Enter the details of your subscription below.</p>
              </div>

              <button
                className="modal-close"
                onClick={closeForm}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={savePlan}>
              <div className="form-group">
                <label htmlFor="name">Subscription Name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Netflix, Spotify, Notion"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="category">Category</label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                  >
                    <option>Entertainment</option>
                    <option>Music</option>
                    <option>Productivity</option>
                    <option>Education</option>
                    <option>Shopping</option>
                    <option>Software</option>
                    <option>Gaming</option>
                    <option>Storage</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price (₹)</label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 499"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="cycle">Billing Cycle</label>

                  <select
                    id="cycle"
                    name="cycle"
                    value={form.cycle}
                    onChange={handleFormChange}
                  >
                    <option>Monthly</option>
                    <option>Yearly</option>
                    <option>Weekly</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>

                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option>Active</option>
                    <option>Trial</option>
                    <option>Paused</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="date">
                  {form.status === "Trial"
                    ? "Trial End Date"
                    : "Next Billing Date"}
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleFormChange}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingId !== null ? (
                    <>
                      <CheckCircle2 size={17} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add Subscription
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;