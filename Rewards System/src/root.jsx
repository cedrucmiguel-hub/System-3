import { useState } from "react";
import { Icon } from "./components/icons";

const navItems = [
  { name: "Dashboard", href: "/", icon: "home" },
  { name: "Earn Points", href: "/earn", icon: "gift" },
  { name: "Activity", href: "/activity", icon: "activity" },
  { name: "Rewards", href: "/rewards", icon: "award" },
  { name: "Profile", href: "/profile", icon: "user" },
];

export default function Root({ currentPath, navigate, profile, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pointsCompact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(profile.points);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="topbar-mini" onClick={() => setSidebarOpen((s) => !s)}>
          <Icon name={sidebarOpen ? "x" : "menu"} className="icon-sm" />
        </button>
        <div className="topbar-title">Health Rewards Dashboard</div>
        <button className="share-btn" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
          <Icon name="share" className="icon-sm" /> Share
        </button>
      </header>

      <div className="layout">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <button className="logo-wrap link-reset" onClick={() => navigate("/") }>
            <div className="logo">H</div>
            <div>
              <p className="brand">CHUPAPI</p>
              <p className="sub-brand">Rewards Program</p>
            </div>
          </button>

          <button className="member-mini-card link-reset" onClick={() => navigate("/profile") }>
            <img src={profile.profileImage} alt={profile.fullName} className="avatar-img" />
            <div>
              <p className="member-name">{profile.fullName}</p>
              <p className="member-meta" title={`${profile.points.toLocaleString()} pts`}>
                {profile.tier} | {pointsCompact} pts
              </p>
            </div>
          </button>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.href}
                className={`nav-item ${currentPath === item.href ? "active" : ""}`}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
              >
                <span className="btn-icon"><Icon name={item.icon} className="icon-sm" /></span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">© 2026 ZUS Health</div>
        </aside>

        {sidebarOpen ? <div className="backdrop" onClick={() => setSidebarOpen(false)} /> : null}

        <main className="main-area">{children}</main>
      </div>
    </div>
  );
}
