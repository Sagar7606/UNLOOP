
import { useEffect, useState } from "react";
import {
  LayoutDashboard, CreditCard, CalendarDays, Plus,
  Search, Bell, Trash2, X, ShieldCheck, Wallet
} from "lucide-react";
import "./App.css";

const initialPlans = [
  { id: 1, name: "Netflix", category: "Entertainment", price: 649, cycle: "Monthly", date: "2026-11-05", status: "Active" },
  { id: 2, name: "Spotify Premium", category: "Music", price: 119, cycle: "Monthly", date: "2026-11-08", status: "Active" },
  { id: 3, name: "Notion Plus", category: "Productivity", price: 800, cycle: "Monthly", date: "2026-11-12", status: "Trial" },
];

function App() {
  const [plans, setPlans] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("unloop-plans")) || initialPlans;
    } catch {
      return initialPlans;
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "", category: "Entertainment", price: "",
    cycle: "Monthly", date: "", status: "Active"
  });

  useEffect(() => {
    localStorage.setItem("unloop-plans", JSON.stringify(plans));
  }, [plans]);

  const monthlySpend = plans
    .filter(p => p.status === "Active")
    .reduce((sum, p) => sum + Number(p.price) *
      (p.cycle === "Yearly" ? 1 / 12 : 1), 0);

  const addPlan = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.date) return;

    setPlans([...plans, { ...form, id: Date.now(), price: Number(form.price) }]);
    setForm({ name: "", category: "Entertainment", price: "", cycle: "Monthly", date: "", status: "Active" });
    setShowForm(false);
  };

  const deletePlan = (id) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  const filteredPlans = plans.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const upcoming = plans.filter(p => {
    const days = (new Date(p.date) - new Date()) / 86400000;
    return days >= 0 && days <= 7;
  });

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">U</span> UNLOOP</div>
        <p className="nav-label">WORKSPACE</p>
        <div className="nav active"><LayoutDashboard size={19}/> Overview</div>
        <div className="nav"><CreditCard size={19}/> Subscriptions</div>
        <div className="nav"><CalendarDays size={19}/> Renewals</div>
        <div className="sidebar-bottom">
          <ShieldCheck size={20}/>
          <div><b>Stay in control.</b><small>Manage every subscription.</small></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span className="breadcrumb">Workspace / Overview</span>
          <div className="profile"><Bell size={19}/><span className="avatar">S</span></div>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR FINANCIAL CONTROL CENTER</p>
            <h1>Your subscriptions,<br/>in one place.</h1>
            <p className="subtext">Track recurring payments. Never miss a renewal.</p>
          </div>
          <button className="primary" onClick={() => setShowForm(true)}>
            <Plus size={18}/> Add subscription
          </button>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon"><Wallet/></div>
            <p>Monthly spending</p>
            <h2>₹{monthlySpend.toFixed(2)}</h2>
            <small>Based on active subscriptions</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CreditCard/></div>
            <p>Tracked subscriptions</p>
            <h2>{plans.length}</h2>
            <small>Across all your services</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CalendarDays/></div>
            <p>Upcoming in 7 days</p>
            <h2>{upcoming.length}</h2>
            <small>Renewals and trial dates</small>
          </div>
        </section>

        <section className="content-card">
          <div className="section-heading">
            <div><h2>My subscriptions</h2><p>Manage all your recurring plans</p></div>
            <div className="search"><Search size={17}/><input placeholder="Search plans..." value={search} onChange={e => setSearch(e.target.value)}/></div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>SERVICE</th><th>CATEGORY</th><th>PRICE</th><th>NEXT BILLING</th><th>STATUS</th><th></th></tr></thead>
              <tbody>
                {filteredPlans.map(plan => (
                  <tr key={plan.id}>
                    <td><b>{plan.name}</b></td>
                    <td>{plan.category}</td>
                    <td><b>₹{Number(plan.price).toFixed(2)}</b><small className="cycle"> / {plan.cycle}</small></td>
                    <td>{plan.date}</td>
                    <td><span className={`status ${plan.status.toLowerCase()}`}>{plan.status}</span></td>
                    <td><button className="delete" title="Delete subscription" onClick={() => deletePlan(plan.id)}><Trash2 size={17}/></button></td>
                  </tr>
                ))}
                {filteredPlans.length === 0 && <tr><td colSpan="6" className="empty">No subscriptions found. Add your first plan!</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="content-card">
            <h2>Upcoming renewals</h2>
            <p className="muted">Your next billing dates</p>
            {upcoming.length ? upcoming.map(p => (
              <div className="renewal" key={p.id}>
                <div><b>{p.name}</b><small>{p.date}</small></div>
                <strong>₹{Number(p.price).toFixed(2)}</strong>
              </div>
            )) : <p className="empty">No renewals in the next 7 days.</p>}
          </div>
          <div className="tip-card">
            <ShieldCheck size={27}/>
            <h2>Stay subscription smart.</h2>
            <p>Keep track of your free trials and recurring payments before they surprise you.</p>
            <button onClick={() => setShowForm(true)}>Track a new plan <Plus size={16}/></button>
          </div>
        </section>

        {showForm && (
          <div className="overlay">
            <form className="modal" onSubmit={addPlan}>
              <div className="modal-heading"><h2>Add subscription</h2><button type="button" onClick={() => setShowForm(false)}><X/></button></div>
              <label>Service name<input required placeholder="e.g. Netflix" value={form.name} onChange={e => setForm({...form, name:e.target.value})}/></label>
              <label>Category<select value={form.category} onChange={e => setForm({...form, category:e.target.value})}><option>Entertainment</option><option>Music</option><option>Productivity</option><option>Shopping</option><option>Other</option></select></label>
              <div className="form-row">
                <label>Price (₹)<input required type="number" min="0" value={form.price} onChange={e => setForm({...form, price:e.target.value})}/></label>
                <label>Billing cycle<select value={form.cycle} onChange={e => setForm({...form, cycle:e.target.value})}><option>Monthly</option><option>Yearly</option></select></label>
              </div>
              <label>Next billing / trial end date<input required type="date" value={form.date} onChange={e => setForm({...form, date:e.target.value})}/></label>
              <label>Status<select value={form.status} onChange={e => setForm({...form, status:e.target.value})}><option>Active</option><option>Trial</option></select></label>
              <button className="primary submit" type="submit">Save subscription</button>
            </form>
          </div>
        )}
        <footer>UNLOOP © 2026 · Take control of your subscriptions.</footer>
      </main>
    </div>
  );
}

export default App;
