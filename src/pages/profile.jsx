import { useState } from "react";
import { Icon } from "../components/icons";

export default function Profile({ state, updateProfile, navigate }) {
  const { profile } = state;
  const [editing, setEditing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [draft, setDraft] = useState({
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    profileImage: profile.profileImage,
  });

  const earnedMonth = state.transactions.filter((t) => t.points > 0 && t.date.startsWith("2026-02")).reduce((s, t) => s + t.points, 0);
  const redeemedMonth = Math.abs(state.transactions.filter((t) => t.points < 0 && t.date.startsWith("2026-02")).reduce((s, t) => s + t.points, 0));

  const startEdit = () => {
    setDraft({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      profileImage: profile.profileImage,
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setDraft({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      profileImage: profile.profileImage,
    });
  };

  const saveEdit = () => {
    updateProfile(draft);
    setEditing(false);
  };

  return (
    <section className="page-wrap profile-layout">
      <div className="page-head">
        <h1>Profile</h1>
        <p>Manage your account and membership details</p>
      </div>

      <div className="profile-grid">
        <div>
          <article className="panel">
            <div className="panel-head">
              <h3>Personal Information</h3>
              <div className="row">
                <button className="btn btn-outline btn-sm" onClick={() => navigate("/")}>
                  <Icon name="home" className="icon-sm" /> Dashboard
                </button>
                {!editing ? (
                  <button className="btn btn-sm" onClick={startEdit}>
                    <Icon name="edit" className="icon-sm" /> Edit
                  </button>
                ) : (
                  <>
                    <button className="btn btn-outline btn-sm" onClick={cancelEdit}>
                      <Icon name="x" className="icon-sm" /> Cancel
                    </button>
                    <button className="btn btn-soft-green btn-sm" onClick={saveEdit}>
                      <Icon name="save" className="icon-sm" /> Save
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="profile-head-row centered">
              <button className="link-reset avatar-button" onClick={() => setPreviewOpen(true)}>
                <img src={editing ? draft.profileImage : profile.profileImage} alt={editing ? draft.fullName : profile.fullName} className="avatar-profile" />
              </button>
              <div className="profile-title-block">
                <h2>{editing ? draft.fullName : profile.fullName}</h2>
                <div className="row center">
                  <span className="pill blue">{profile.tier} Member</span>
                  <span className="pill green">{profile.status}</span>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <label>Full Name<input className="input" disabled={!editing} value={draft.fullName} onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))} /></label>
              <label>Email Address<input className="input" disabled={!editing} value={draft.email} onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))} /></label>
              <label>Phone Number<input className="input" disabled={!editing} value={draft.phone} onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))} /></label>
              <label>Profile Image URL<input className="input" disabled={!editing} value={draft.profileImage} onChange={(e) => setDraft((p) => ({ ...p, profileImage: e.target.value }))} /></label>
            </div>
          </article>

          <article className="panel mt-12">
            <h3>Membership Details</h3>
            <div className="member-details-grid">
              <div><p>Member ID</p><strong>{profile.memberId}</strong></div>
              <div><p>Member Since</p><strong>{profile.memberSince}</strong></div>
              <div><p>Current Points</p><strong>{profile.points.toLocaleString()}</strong></div>
              <div><p>Lifetime Points</p><strong>{profile.lifetimePoints.toLocaleString()}</strong></div>
            </div>
          </article>
        </div>

        <div>
          <article className="panel">
            <h3>Quick Stats</h3>
            <div className="stat-lines">
              <div><span>This Month</span><strong className="plus">+{earnedMonth} <small>earned</small></strong></div>
              <div><span>Redeemed</span><strong className="minus">-{redeemedMonth} <small>redeemed</small></strong></div>
              <div><span>Transactions</span><strong>{state.transactions.length}</strong></div>
              <div><span>Surveys Completed</span><strong>{profile.surveysCompleted}</strong></div>
            </div>
          </article>

          <article className="panel mt-12">
            <h3>Account Status</h3>
            <div className="stat-lines">
              <div><span>Profile Complete</span><span className="pill green">Yes</span></div>
              <div><span>App Connected</span><span className="pill green">Yes</span></div>
              <div><span>Email Verified</span><span className="pill green">Verified</span></div>
            </div>
          </article>
        </div>
      </div>

      {previewOpen ? (
        <div className="modal-overlay" onClick={() => setPreviewOpen(false)}>
          <div className="modal-card image-preview-card" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <h3>{editing ? draft.fullName : profile.fullName}</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setPreviewOpen(false)}>Close</button>
            </div>
            <img src={editing ? draft.profileImage : profile.profileImage} alt={editing ? draft.fullName : profile.fullName} className="image-preview-full" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
