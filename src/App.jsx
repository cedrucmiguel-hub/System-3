import { useEffect, useState } from "react";
import Root from "./root";
import Dashboard from "./pages/dashboard";
import EarnPoints from "./pages/earn-points";
import PointsActivity from "./pages/points-activity";
import Rewards from "./pages/rewards";
import Profile from "./pages/profile";
import { initialAppState } from "./data/mock-data";

const STORAGE_KEY = "health-rewards-state-v2";
const DELAY_MS = 5000;
const UNDO_WINDOW_MS = 5 * 60 * 1000;

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

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initialAppState;
  } catch {
    return initialAppState;
  }
}

function uid(prefix = "tx") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function getPendingNet(transactions) {
  return transactions
    .filter((t) => t.type === "pending" || t.type === "pending_redeem")
    .reduce((sum, t) => sum + t.points, 0);
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [state, setState] = useState(loadState);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setState((prev) => {
        let changed = false;
        let pointsChange = 0;

        const nextTx = prev.transactions.map((t) => {
          if (t.type === "pending_redeem" && t.applyAt && now >= t.applyAt) {
            changed = true;
            pointsChange += t.points;
            return {
              ...t,
              type: "redeemed",
              description: t.finalDescription || t.description,
              applyAt: null,
              finalDescription: undefined,
            };
          }
          return t;
        });

        if (!changed) return prev;

        return {
          ...prev,
          transactions: nextTx,
          profile: {
            ...prev.profile,
            points: prev.profile.points + pointsChange,
          },
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const navigate = (nextPath) => {
    if (nextPath === path) return;
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  const recordPurchase = (amount, options = {}) => {
    const dollars = Number(amount);
    if (!Number.isFinite(dollars) || dollars <= 0) return;

    let summary = null;

    setState((prev) => {
      const maxAutoApply = Math.max(0, Number(options.maxAutoApplyPoints || 0));
      const autoApply = Boolean(options.autoApplyPoints) && maxAutoApply > 0;
      const pointsApplied = autoApply ? Math.min(prev.profile.points, Math.floor(maxAutoApply)) : 0;
      const discount = pointsApplied / 100;
      const netAmount = Math.max(0, dollars - discount);
      const pointsEarned = Math.floor(netAmount * 2);
      const receiptId = `RCP-${Date.now()}`;
      const date = new Date().toISOString().slice(0, 10);

      const earnTx = {
        id: uid(),
        date,
        description: `Health Purchase ($${dollars.toFixed(2)})`,
        type: "earned",
        points: pointsEarned,
        category: "Purchase",
        receiptId,
      };

      const nextTx = [earnTx, ...prev.transactions];
      if (pointsApplied > 0) {
        nextTx.unshift({
          id: uid(),
          date,
          description: `Auto-applied points at checkout (${receiptId})`,
          type: "redeemed",
          points: -pointsApplied,
          category: "Payment",
        });
      }

      const nextPoints = prev.profile.points - pointsApplied + pointsEarned;
      summary = {
        receiptId,
        purchaseAmount: dollars,
        netAmount,
        pointsApplied,
        pointsEarned,
        projectedBalance: nextPoints + getPendingNet(nextTx),
      };

      return {
        ...prev,
        transactions: nextTx,
        profile: {
          ...prev.profile,
          points: nextPoints,
          lifetimePoints: prev.profile.lifetimePoints + pointsEarned,
        },
      };
    });

    if (summary) {
      setToast(
        summary.pointsApplied > 0
          ? `+${summary.pointsEarned} earned, ${summary.pointsApplied} auto-applied`
          : `+${summary.pointsEarned} points added from purchase`
      );
    }
    return summary;
  };

  const completeTask = (taskId) => {
    setState((prev) => {
      const task = prev.tasks.find((t) => t.id === taskId);
      if (!task || task.completed) return prev;

      const tx = {
        id: uid(),
        date: new Date().toISOString().slice(0, 10),
        description: `${task.title} Completed`,
        type: "earned",
        points: task.points,
        category: "Bonus",
      };

      return {
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t)),
        transactions: [tx, ...prev.transactions],
        profile: {
          ...prev.profile,
          points: prev.profile.points + task.points,
          lifetimePoints: prev.profile.lifetimePoints + task.points,
          surveysCompleted:
            taskId === "E003" ? prev.profile.surveysCompleted + 1 : prev.profile.surveysCompleted,
        },
      };
    });

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
        applyAt: Date.now() + DELAY_MS,
        undoUntil: Date.now() + UNDO_WINDOW_MS,
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

    setToast(`Redemption queued, points will be deducted in ${Math.round(DELAY_MS / 1000)}s`);
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
    projectedBalance: state.profile.points + getPendingNet(state.transactions),
  };

  const Page = pageMap[path] || Dashboard;

  return (
    <Root currentPath={path} navigate={navigate} profile={state.profile}>
      <Page {...context} />
      {toast ? <div className="toast success">{toast}</div> : null}
    </Root>
  );
}
