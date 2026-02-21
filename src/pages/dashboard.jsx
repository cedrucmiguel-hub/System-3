import { Icon } from "../components/icons";

function sumBy(transactions, predicate) {
  return transactions.filter(predicate).reduce((sum, t) => sum + t.points, 0);
}

export default function Dashboard({ state, navigate, projectedBalance }) {
  const { profile, transactions } = state;
  const recent = transactions.slice(0, 5);
  const earnedThisMonth = sumBy(transactions, (t) => t.type === "earned" && t.date.startsWith("2026-02"));
  const redeemedThisMonth = Math.abs(sumBy(transactions, (t) => (t.type === "redeemed" || t.type === "pending_redeem") && t.date.startsWith("2026-02")));
  const pendingCount = transactions.filter((t) => t.type === "pending" || t.type === "pending_redeem").length;
  const pendingPoints = transactions
    .filter((t) => t.type === "pending" && t.points > 0)
    .reduce((sum, t) => sum + t.points, 0);

  return (
    <section className="page-wrap">
      <div className="page-head">
        <h1>Dashboard</h1>
        <p>Welcome back, {profile.fullName.split(" ")[0]}!</p>
      </div>

      <div className="stats-grid four">
        <article className="tile tile-primary clickable" onClick={() => navigate("/profile")}>
          <p className="tile-label">Current Balance</p>
          <h2>{profile.points.toLocaleString()}</h2>
          <small>points</small>
          <p className="tile-foot"><Icon name="user" className="icon-inline" /> Open profile</p>
        </article>
        <article className="tile tile-soft blue clickable" onClick={() => navigate("/activity")}>
          <p className="tile-label">Pending Points</p>
          <h2>{pendingPoints}</h2>
          <small>processing</small>
          <p className="tile-foot">
            <Icon name="clock" className="icon-inline" /> Projected: {projectedBalance.toLocaleString()} pts
          </p>
        </article>
        <article className="tile clickable" onClick={() => navigate("/activity")}>
          <p className="tile-label">Earned This Month</p>
          <h2>{earnedThisMonth}</h2>
          <small>points</small>
          <p className="tile-foot"><Icon name="up" className="icon-inline" /> {pendingCount} pending records</p>
        </article>
        <article className="tile clickable" onClick={() => navigate("/rewards")}>
          <p className="tile-label">Redeemed This Month</p>
          <h2>{redeemedThisMonth}</h2>
          <small>points</small>
          <p className="tile-foot"><Icon name="award" className="icon-inline" /> Open rewards</p>
        </article>
      </div>

      <div className="stats-grid two">
        <article className="panel">
          <div className="panel-head">
            <div>
              <h3>Lifetime Points</h3>
              <p>Total points earned since joining</p>
            </div>
            <button className="chip violet link-reset" onClick={() => navigate("/activity")}><Icon name="activity" className="icon-sm" /></button>
          </div>
          <div className="big-number">{profile.lifetimePoints.toLocaleString()} <small>points</small></div>
          <p className="panel-note">Member since {profile.memberSince}</p>
        </article>

        <article className="panel">
          <div className="panel-head">
            <div>
              <h3>Tier Progress</h3>
              <p>Highest tier achieved!</p>
            </div>
            <span className="pill blue">{profile.tier}</span>
          </div>
          <div className="progress-track"><span style={{ width: "100%" }} /></div>
          <p className="panel-note">{profile.lifetimePoints.toLocaleString()} / 20,000 points</p>
        </article>
      </div>

      <article className="alert-strip">
        <div>
          <strong>{profile.expiringPoints} Points Expiring Soon</strong>
          <p>You have {profile.expiringPoints} points expiring in {profile.daysUntilExpiry} days.</p>
        </div>
        <button className="btn btn-sm" onClick={() => navigate("/rewards")}><Icon name="award" className="icon-sm" /> Redeem Now</button>
      </article>

      <article className="panel">
        <div className="panel-head">
          <h3>Recent Activity</h3>
          <button className="btn-link" onClick={() => navigate("/activity")}>View All</button>
        </div>
        <div className="activity-list">
          {recent.map((t) => (
            <div key={t.id} className="activity-row">
              <div>
                <p>{t.description}</p>
                <small>{new Date(t.date).toLocaleDateString()} • {t.category}</small>
              </div>
              <div className="align-right">
                <strong className={t.points >= 0 ? "plus" : "minus"}>{t.points > 0 ? "+" : ""}{t.points}</strong>
                <small>{t.type}</small>
              </div>
            </div>
          ))}
        </div>
      </article>

      <div className="quick-grid">
        <button className="quick-card blue" onClick={() => navigate("/earn")}><Icon name="gift" className="icon-sm" /> Earn More Points</button>
        <button className="quick-card orange" onClick={() => navigate("/rewards")}><Icon name="award" className="icon-sm" /> Redeem Rewards</button>
        <button className="quick-card indigo" onClick={() => navigate("/activity")}><Icon name="activity" className="icon-sm" /> View Activity</button>
      </div>
    </section>
  );
}
