import { useEffect, useMemo, useState } from "react";
import { Icon } from "../components/icons";

export default function Rewards({
  state,
  redeemReward,
  reserveReward,
  giftPoints,
  applyPartialPayment,
  undoRedemption,
}) {
  const [category, setCategory] = useState("all");
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState("");
  const [selectedReward, setSelectedReward] = useState(null);
  const [mode, setMode] = useState("");
  const [method, setMethod] = useState("in-store");
  const [email, setEmail] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const rewards = useMemo(
    () => state.rewards.filter((r) => category === "all" || r.category === category),
    [category, state.rewards]
  );

  const undoableRedemptions = state.transactions.filter(
    (t) =>
      (t.type === "pending_redeem" || t.type === "redeemed") &&
      t.undoUntil &&
      now <= t.undoUntil
  );

  const close = () => {
    setSelectedReward(null);
    setMode("");
    setEmail("");
    setMethod("in-store");
  };

  return (
    <section className="page-wrap">
      <div className="page-head">
        <h1>Rewards</h1>
        <p>Redeem your points for health and wellness rewards</p>
      </div>

      <article className="balance-hero clickable" onClick={() => setUsePoints((v) => !v)}>
        <p>Available Points</p>
        <h2>{state.profile.points.toLocaleString()}</h2>
        <small>+{state.profile.pendingPoints} pending</small>
      </article>

      <article className="panel">
        <div className="panel-head">
          <div>
            <h3>Use Points as Partial Payment</h3>
            <p>Apply points to reduce checkout total (1 point = $0.01)</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setUsePoints((v) => !v)}>
            <Icon name="wallet" className="icon-sm" /> {usePoints ? "Cancel" : "Use Points"}
          </button>
        </div>
        {usePoints ? (
          <div className="row mt-8">
            <input
              className="input"
              value={pointsToUse}
              onChange={(e) => setPointsToUse(e.target.value)}
              placeholder="Enter points"
            />
            <button
              className="btn btn-soft-green"
              onClick={() => {
                applyPartialPayment(pointsToUse);
                setPointsToUse("");
              }}
            >
              <Icon name="check" className="icon-sm" /> Apply
            </button>
          </div>
        ) : null}
      </article>

      <div className="category-tabs">
        {[
          ["all", "All Rewards"],
          ["supplements", "Supplements"],
          ["nutrition", "Nutrition"],
          ["fitness", "Fitness"],
          ["care", "Care"],
          ["gear", "Gear"],
          ["voucher", "Voucher"],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`tab-btn ${category === key ? "active" : ""}`}
            onClick={() => setCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="reward-grid">
        {rewards.map((r) => {
          const canAfford = state.profile.points >= r.pointsCost;
          const reserved = state.reservedRewardIds.includes(r.id);
          return (
            <article key={r.id} className="reward-card">
              <img
                src={r.imageUrl}
                alt={r.name}
                onClick={() => setPreviewImage({ src: r.imageUrl, title: r.name })}
                className="reward-image-clickable"
              />
              <div className="reward-body">
                <h3>{r.name}</h3>
                <p>{r.description}</p>
                <div className="row between center">
                  <div>
                    <strong className="points-num">{r.pointsCost}</strong> <small>points</small>
                  </div>
                  <span className="pill light">{r.category}</span>
                </div>
                <div className="row mt-8">
                  <button
                    className="btn btn-sm grow"
                    disabled={!canAfford}
                    onClick={() => {
                      setSelectedReward(r);
                      setMode("redeem");
                    }}
                  >
                    <Icon name="award" className="icon-sm" /> {reserved ? "Redeem Now" : "Redeem"}
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={!canAfford || reserved}
                    onClick={() => reserveReward(r.id)}
                  >
                    <Icon name="bookmark" className="icon-sm" /> Reserve
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    disabled={!canAfford}
                    onClick={() => {
                      setSelectedReward(r);
                      setMode("gift");
                    }}
                  >
                    <Icon name="send" className="icon-sm" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {undoableRedemptions.length > 0 ? (
        <article className="panel">
          <div className="panel-head">
            <h3>Recent Redemptions (Undo Available)</h3>
            <span className="pill light">Undo within 5 minutes</span>
          </div>
          <div className="activity-list compact">
            {undoableRedemptions.map((t) => (
              <div key={t.id} className="activity-row row-card">
                <div>
                  <p>{t.finalDescription || t.description}</p>
                  <small>{t.type === "pending_redeem" ? "Pending deduction" : "Deducted, can still restore"}</small>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => undoRedemption(t.id)}>
                  Undo & Restore
                </button>
              </div>
            ))}
          </div>
        </article>
      ) : null}

      {selectedReward && mode === "redeem" ? (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
            <h3>Redeem Reward</h3>
            <p>Choose how you want to receive this reward</p>
            <div className="modal-summary">
              <strong>{selectedReward.name}</strong>
              <span>{selectedReward.pointsCost} points</span>
            </div>
            <div className="method-grid">
              <button
                className={`method-btn ${method === "in-store" ? "active" : ""}`}
                onClick={() => setMethod("in-store")}
              >
                <Icon name="check" className="icon-sm" /> In-Service
              </button>
              <button
                className={`method-btn ${method === "online" ? "active" : ""}`}
                onClick={() => setMethod("online")}
              >
                <Icon name="send" className="icon-sm" /> Delivery
              </button>
            </div>
            <div className="info-box">Note: You can undo this redemption within 5 minutes and restore your points.</div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={close}>Cancel</button>
              <button
                className="btn"
                onClick={() => {
                  redeemReward(selectedReward, method);
                  close();
                }}
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedReward && mode === "gift" ? (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
            <h3>Gift Points</h3>
            <p>Send this reward equivalent to another member</p>
            <div className="modal-summary"><strong>Sending</strong><span>{selectedReward.pointsCost} points</span></div>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="friend@email.com" />
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={close}>Cancel</button>
              <button
                className="btn"
                onClick={() => {
                  giftPoints(selectedReward, email);
                  close();
                }}
                disabled={!email.trim()}
              >
                <Icon name="send" className="icon-sm" /> Send Gift
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {previewImage ? (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="modal-card wide image-preview-card" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <h3>{previewImage.title}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setPreviewImage(null)}>Close</button>
            </div>
            <img src={previewImage.src} alt={previewImage.title} className="image-preview-full" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
