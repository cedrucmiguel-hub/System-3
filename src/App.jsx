import { useEffect, useMemo, useState } from "react";
import Root from "./root";
import Dashboard from "./pages/dashboard";
import EarnPoints from "./pages/earn-points";
import PointsActivity from "./pages/points-activity";
import Rewards from "./pages/rewards";
import Profile from "./pages/profile";
import { initialAppState } from "./data/mock-data";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const pageMap = {
  "/": Dashboard,
  "/earn": EarnPoints,
  "/activity": PointsActivity,
  "/rewards": Rewards,
  "/profile": Profile,
};

function normalizePath(pathname) {
  return pageMap[pathname] ? pathname : "/";
}

function uid(prefix = "tx") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function getPendingNet(transactions) {
  return transactions
    .filter((t) => t.type === "pending" || t.type === "pending_redeem")
    .reduce((sum, t) => sum + t.points, 0);
}

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status === "ERROR") {
    throw new Error(data.message || data.details || `Request failed: ${res.status}`);
  }
  return data;
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [state, setState] = useState(initialAppState);
  const [toast, setToast] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState(initialAppState.profile.memberId);
  const [memberSearchError, setMemberSearchError] = useState("");
  const [memberLoading, setMemberLoading] = useState(false);

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const loadMemberDashboard = async (memberId, opts = {}) => {
    const normalized = String(memberId || "").trim();
    if (!normalized) throw new Error("Member ID is required.");

    if (!opts.silent) {
      setMemberLoading(true);
      setMemberSearchError("");
    }

    try {
      const data = await requestJson(`/api/members/${encodeURIComponent(normalized)}/dashboard`);
      const profile = data.profile;
      const transactions = Array.isArray(profile.transactions) ? profile.transactions : [];

      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...profile,
          profileImage: profile.profileImage || prev.profile.profileImage,
        },
        transactions,
      }));

      setMemberSearchQuery(profile.memberId || normalized);
      return profile;
    } finally {
      if (!opts.silent) setMemberLoading(false);
    }
  };

  useEffect(() => {
    if (!initialAppState.profile.memberId) return;
    loadMemberDashboard(initialAppState.profile.memberId, { silent: true }).catch((error) => {
      setMemberSearchError(`Live data unavailable. ${error.message}`);
    });
  }, []);

  const navigate = (nextPath) => {
    if (nextPath === path) return;
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  const searchMember = async () => {
    const q = memberSearchQuery.trim();
    if (!q) {
      setMemberSearchError("Please enter a member ID.");
      return;
    }

    setMemberLoading(true);
    setMemberSearchError("");

    try {
      const data = await requestJson(`/api/members?query=${encodeURIComponent(q)}`);
      const members = data.members || [];
      if (!members.length) {
        setMemberSearchError("No member found for that search.");
        return;
      }

      const exact =
        members.find((m) => String(m.member_id || "").toLowerCase() === q.toLowerCase()) || members[0];

      await loadMemberDashboard(exact.member_id, { silent: true });
      setToast(`Loaded member ${exact.member_id}`);
    } catch (error) {
      setMemberSearchError(error.message);
    } finally {
      setMemberLoading(false);
    }
  };

  const postAward = async (points, description, category, receiptId = null) => {
    const memberId = state.profile.memberId;
    const data = await requestJson(`/api/members/${encodeURIComponent(memberId)}/award`, {
      method: "POST",
      body: JSON.stringify({ points, description, category, receiptId }),
    });

    const profile = data.profile;
    const transactions = Array.isArray(profile.transactions) ? profile.transactions : [];

    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profile,
        profileImage: profile.profileImage || prev.profile.profileImage,
      },
      transactions,
    }));

    return profile;
  };

  const recordPurchase = async (amount, options = {}) => {
    const dollars = Number(amount);
    if (!Number.isFinite(dollars) || dollars <= 0) return;

    const maxAutoApply = Math.max(0, Number(options.maxAutoApplyPoints || 0));
    const autoApply = Boolean(options.autoApplyPoints) && maxAutoApply > 0;
    const pointsApplied = autoApply ? Math.min(state.profile.points, Math.floor(maxAutoApply)) : 0;
    const discount = pointsApplied / 100;
    const netAmount = Math.max(0, dollars - discount);
    const pointsEarned = Math.floor(netAmount * 2);
    const receiptId = `RCP-${Date.now()}`;

    if (pointsApplied > 0) {
      await postAward(-pointsApplied, `Auto-applied points at checkout (${receiptId})`, "Payment", receiptId);
    }

    await postAward(pointsEarned, `Health Purchase ($${dollars.toFixed(2)})`, "Purchase", receiptId);

    const projectedBalance = state.profile.points - pointsApplied + pointsEarned + getPendingNet(state.transactions);
    setToast(pointsApplied > 0 ? `+${pointsEarned} earned, ${pointsApplied} auto-applied` : `+${pointsEarned} points added`);

    return {
      receiptId,
      purchaseAmount: dollars,
      netAmount,
      pointsApplied,
      pointsEarned,
      projectedBalance,
    };
  };

  const completeTask = async (taskId) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;

    await postAward(task.points, `${task.title} Completed`, "Bonus");

    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t)),
      profile: {
        ...prev.profile,
        surveysCompleted: taskId === "E003" ? prev.profile.surveysCompleted + 1 : prev.profile.surveysCompleted,
      },
    }));

    setToast("Task completed and points added");
  };

  const redeemReward = (reward, method) => {
    if (!reward) return;

    setState((prev) => {
      if (prev.profile.points < reward.pointsCost) return prev;

      const tx = {
        id: uid(),
        date: new Date().toISOString().slice(0, 10),
        description: `Pending redemption: ${reward.name}`,
        finalDescription: `${reward.name} redeemed (${method})`,
        type: "pending_redeem",
        points: -reward.pointsCost,
        category: "Reward",
        applyAt: Date.now() + 5000,
        undoUntil: Date.now() + 5 * 60 * 1000,
        rewardId: reward.id,
        rewardName: reward.name,
        method,
      };

      return {
        ...prev,
        transactions: [tx, ...prev.transactions],
        reservedRewardIds: prev.reservedRewardIds.filter((id) => id !== reward.id),
      };
    });

    setToast("Redemption queued");
  };

  const reserveReward = (rewardId) => {
    setState((prev) => ({
      ...prev,
      reservedRewardIds: prev.reservedRewardIds.includes(rewardId)
        ? prev.reservedRewardIds
        : [...prev.reservedRewardIds, rewardId],
    }));
    setToast("Reward reserved for 24 hours");
  };

  const giftPoints = (reward, email) => {
    if (!reward || !email) return;

    setState((prev) => {
      if (prev.profile.points < reward.pointsCost) return prev;

      const tx = {
        id: uid(),
        date: new Date().toISOString().slice(0, 10),
        description: `Gifted points for ${reward.name} to ${email}`,
        type: "gifted",
        points: -reward.pointsCost,
        category: "Transfer",
      };

      return {
        ...prev,
        transactions: [tx, ...prev.transactions],
        profile: { ...prev.profile, points: prev.profile.points - reward.pointsCost },
      };
    });

    setToast("Gift sent successfully");
  };

  const applyPartialPayment = (pointsValue) => {
    const points = Number(pointsValue);
    if (!Number.isFinite(points) || points <= 0) return;

    setState((prev) => {
      if (points > prev.profile.points) return prev;

      const tx = {
        id: uid(),
        date: new Date().toISOString().slice(0, 10),
        description: "Points used as partial payment",
        type: "redeemed",
        points: -points,
        category: "Payment",
      };

      return {
        ...prev,
        transactions: [tx, ...prev.transactions],
        profile: { ...prev.profile, points: prev.profile.points - points },
      };
    });

    setToast(`${points} points applied`);
  };

  const undoRedemption = (transactionId) => {
    const now = Date.now();
    let restored = 0;

    setState((prev) => {
      const target = prev.transactions.find((t) => t.id === transactionId);
      if (!target || !target.undoUntil || now > target.undoUntil) return prev;

      if (target.type === "pending_redeem") {
        return {
          ...prev,
          transactions: prev.transactions.filter((t) => t.id !== transactionId),
        };
      }

      if (target.type === "redeemed") {
        restored = Math.abs(target.points);
        const restoreTx = {
          id: uid(),
          date: new Date().toISOString().slice(0, 10),
          description: `Redemption canceled: ${target.rewardName || target.description}`,
          type: "earned",
          points: restored,
          category: "Undo",
        };

        return {
          ...prev,
          transactions: [restoreTx, ...prev.transactions],
          profile: {
            ...prev.profile,
            points: prev.profile.points + restored,
          },
        };
      }

      return prev;
    });

    setToast(restored > 0 ? `${restored} points restored` : "Pending redemption canceled");
  };

  const updateProfile = (partial) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...partial } }));
  };

  const projectedBalance = useMemo(
    () => state.profile.points + getPendingNet(state.transactions),
    [state.profile.points, state.transactions]
  );

  const context = {
    state,
    navigate,
    recordPurchase,
    completeTask,
    redeemReward,
    reserveReward,
    giftPoints,
    applyPartialPayment,
    undoRedemption,
    updateProfile,
    setToast,
    projectedBalance,
    memberSearchQuery,
    setMemberSearchQuery,
    searchMember,
    memberSearchError,
    memberLoading,
  };

  const Page = pageMap[path] || Dashboard;

  return (
    <Root currentPath={path} navigate={navigate} profile={state.profile}>
      <Page {...context} />
      {toast ? <div className="toast success">{toast}</div> : null}
    </Root>
  );
}
