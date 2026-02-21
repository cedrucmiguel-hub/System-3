import { useMemo, useState } from "react";
import { Icon } from "../components/icons";

export default function EarnPoints({ state, recordPurchase, completeTask }) {
  const [amount, setAmount] = useState("");
  const [autoApplyPoints, setAutoApplyPoints] = useState(false);
  const [maxAutoApplyPoints, setMaxAutoApplyPoints] = useState("");
  const [lastReceipt, setLastReceipt] = useState(null);
  const points = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) && n > 0 ? Math.floor(n * 2) : 0;
  }, [amount]);

  return (
    <section className="page-wrap">
      <div className="page-head">
        <h1>Earn Points</h1>
        <p>Complete tasks and make purchases to earn more rewards</p>
      </div>

      <article className="earn-hero">
        <h3>How to Earn Points</h3>
        <div className="earn-hero-grid">
          <div><strong><Icon name="cart" className="icon-sm" /> Make Purchases</strong><p>Earn 2 points for every $1 spent</p></div>
          <div><strong><Icon name="clipboard" className="icon-sm" /> Complete Tasks</strong><p>Surveys, reviews, and more</p></div>
          <div><strong><Icon name="share" className="icon-sm" /> Refer Members</strong><p>Both get 250 points</p></div>
        </div>
      </article>

      <div className="stats-grid two">
        <article className="panel">
          <h3><Icon name="wallet" className="icon-sm" /> Record Purchase</h3>
          <p>Earn points instantly</p>
          <div className="row mt-8">
            <label className="toggle">
              <input type="checkbox" checked={autoApplyPoints} onChange={(e) => setAutoApplyPoints(e.target.checked)} />
              <span>Auto-apply points at checkout</span>
            </label>
            {autoApplyPoints ? (
              <input
                className="input"
                type="number"
                min="0"
                max={state.profile.points}
                value={maxAutoApplyPoints}
                onChange={(e) => setMaxAutoApplyPoints(e.target.value)}
                placeholder="Max points to auto-apply"
              />
            ) : null}
          </div>
          <div className="row mt-8">
            <input className="input" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            <button
              className="btn"
              onClick={() => {
                const receipt = recordPurchase(amount, {
                  autoApplyPoints,
                  maxAutoApplyPoints: Number(maxAutoApplyPoints || 0),
                });
                if (receipt) setLastReceipt(receipt);
                setAmount("");
              }}
              disabled={points <= 0}
            >
              <Icon name="up" className="icon-sm" /> Checkout & Earn
            </button>
          </div>
          {lastReceipt ? (
            <div className="receipt-card mt-8">
              <h4>Receipt / POS Summary</h4>
              <p>Receipt: {lastReceipt.receiptId}</p>
              <p>Purchase: ${lastReceipt.purchaseAmount.toFixed(2)}</p>
              <p>Points Applied: -{lastReceipt.pointsApplied}</p>
              <p>Points Earned: +{lastReceipt.pointsEarned}</p>
              <p>Projected Balance: {lastReceipt.projectedBalance.toLocaleString()} pts</p>
            </div>
          ) : null}
        </article>

        <article className="panel">
          <h3><Icon name="clipboard" className="icon-sm" /> Quick Survey</h3>
          <p>One-click complete for demo flow</p>
          <div className="row mt-8">
            <button className="btn" onClick={() => completeTask("E002")}><Icon name="check" className="icon-sm" /> App Download (+50)</button>
            <button className="btn" onClick={() => completeTask("E001")}><Icon name="check" className="icon-sm" /> Complete Profile (+100)</button>
            <button className="btn" onClick={() => completeTask("E003")}><Icon name="check" className="icon-sm" /> Survey (+50)</button>
          </div>
        </article>
      </div>

      <article className="panel">
        <h3>Available Tasks</h3>
        <div className="task-grid">
          {state.tasks.map((t) => (
            <div key={t.id} className={`task-card ${t.completed ? "done" : ""}`}>
              <div>
                <h4>{t.title}</h4>
                <p>{t.description}</p>
              </div>
              <span className="point-pill">+{t.points}</span>
              <button className="btn" disabled={t.completed} onClick={() => completeTask(t.id)}>
                <Icon name={t.completed ? "check" : "up"} className="icon-sm" /> {t.completed ? "Completed" : "Start Task"}
              </button>
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <h3>Recent Purchases</h3>
        <div className="activity-list compact">
          {state.transactions.filter((t) => t.category === "Purchase" && t.points > 0).slice(0, 5).map((t) => (
            <div key={t.id} className="activity-row">
              <div><p>{t.description}</p><small>{new Date(t.date).toLocaleDateString()} {t.receiptId ? `• ${t.receiptId}` : ""}</small></div>
              <div className="align-right"><strong className="plus">+{t.points}</strong><small>points earned</small></div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
