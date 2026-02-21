import { createBrowserRouter } from "react-router";
import Root from "./root";
import Dashboard from "./pages/dashboard";
import EarnPoints from "./pages/earn-points";
import PointsActivity from "./pages/points-activity";
import Rewards from "./pages/rewards";
import Profile from "./pages/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "earn", Component: EarnPoints },
      { path: "activity", Component: PointsActivity },
      { path: "rewards", Component: Rewards },
      { path: "profile", Component: Profile },
    ],
  },
]);
