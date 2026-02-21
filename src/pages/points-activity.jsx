import { useMemo, useState } from "react";
import { Icon } from "../components/icons";

export default function PointsActivity({ state }) {
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const filtered = useMemo(() => {
    const list = state.transactions.filter((t) => (filterType === "all" ? true : t.type === filterType));
    return [...list].sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "points-desc") return b.points - a.points;
      return a.points - b.points;
    });
  }, [filterType, sortBy, state.transactions]);

  const totalEarned = state.transactions.filter((t) => t.points > 0).reduce((s, t) => s + t.points, 0);
  const totalRedeemed = Math.abs(state.transactions.filter((t) => t.points < 0).reduce((s, t) => s + t.points, 0));

  return (
    <section className="page-wrap">
      <div className="page-head">
        <h1>Points Activity</h1>
        <p>View and track all your points transactions</p>
      </div>

      <div className="stats-grid three">
        <article className="tile"><p className="tile-label">Total Earned</p><h2 className="plus">+{totalEarned}</h2></article>
        <article className="tile"><p className="tile-label">Total Redeemed</p><h2 className="minus">-{totalRedeemed}</h2></article>
        <article className="tile"><p className="tile-label">Pending Points</p><h2>{state.profile.pendingPoints}</h2></article>
      </div>

      <article className="panel filter-panel">
        <div>
          <label><Icon name="filter" className="icon-inline" /> Filter by Type</label>
          <select className="select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Transactions</option>
            <option value="earned">Earned</option>
            <option value="redeemed">Redeemed</option>
            <option value="pending">Pending</option>
            <option value="pending_redeem">Pending Redeem</option>
            <option value="gifted">Gifted</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <div>
          <label><Icon name="sort" className="icon-inline" /> Sort by</label>
          <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="points-desc">Highest Points</option>
            <option value="points-asc">Lowest Points</option>
          </select>
        </div>
      </article>

      <article className="panel">
        <div className="panel-head">
          <h3>Transaction History</h3>
          <span className="pill light">{filtered.length} transactions</span>
        </div>
        <div className="activity-list">
          {filtered.map((t) => (
            <div key={t.id} className="activity-row row-card">
              <div>
                <p>{t.description}</p>
                <small>{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {t.category}{t.receiptId ? ` • ${t.receiptId}` : ""}</small>
              </div>
              <div className="align-right">
                <strong className={t.points >= 0 ? "plus" : "minus"}>{t.points > 0 ? "+" : ""}{t.points}</strong>
                <span className={`pill ${t.type.replace("_redeem", "")}`}>{t.type}</span>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
