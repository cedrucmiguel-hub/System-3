import { ArrowUpRight, ArrowDownRight, Clock, TrendingUp, Gift, Award, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { currentUser } from "../data/mock-data";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

export default function Dashboard() {
  const projectedBalance = currentUser.points + currentUser.pendingPoints;
  const nextTierPoints = currentUser.tier === 'Silver' ? 5000 : currentUser.tier === 'Gold' ? 10000 : 20000;
  const tierProgress = (currentUser.lifetimePoints / nextTierPoints) * 100;

  const recentTransactions = currentUser.transactions.slice(0, 5);
  const loyaltyCapabilities = [
    "Earn points automatically when I make a purchase",
    "See points earned displayed on receipt / POS",
    "Earn points for app downloads / completing profile / survey completion",
    "Projected point balance based on pending transactions",
    "Lifetime points earned",
    "Use points as partial payment / apply points automatically at checkout",
    "Reserve rewards before redeeming",
    "Gift points to another member",
    "Redeem points online for delivery",
    "Cancel redemption and restore points",
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {currentUser.fullName.split(' ')[0]}! ☕
        </p>
      </div>

      {/* Points Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Balance */}
        <Card className="p-6 bg-gradient-to-br from-sky-600 to-sky-500 text-white border-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Current Balance</p>
              <h2 className="text-3xl font-bold mt-2">{currentUser.points.toLocaleString()}</h2>
              <p className="text-emerald-100 text-sm mt-1">points</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-100 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+{currentUser.earnedThisMonth} this month</span>
          </div>
        </Card>

        {/* Pending Points */}
        <Card className="p-6 border-sky-200 dark:border-sky-800/30 bg-sky-50/50 dark:bg-sky-900/10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending Points</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {currentUser.pendingPoints}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">processing</p>
            </div>
            <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
          <p className="text-sky-700 dark:text-sky-400 text-sm">
            Projected: {projectedBalance.toLocaleString()} pts
          </p>
        </Card>

        {/* Earned This Month */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Earned This Month</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {currentUser.earnedThisMonth}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">points</p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {currentUser.transactions.filter(t => t.type === 'earned' && new Date(t.date).getMonth() === new Date().getMonth()).length} transactions
          </p>
        </Card>

        {/* Redeemed This Month */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Redeemed This Month</p>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {currentUser.redeemedThisMonth}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">points</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {currentUser.transactions.filter(t => t.type === 'redeemed' && new Date(t.date).getMonth() === new Date().getMonth()).length} redemptions
          </p>
        </Card>
      </div>

      {/* Lifetime & Tier Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lifetime Points */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Lifetime Points</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Total points earned since joining</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              {currentUser.lifetimePoints.toLocaleString()}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">points</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            Member since {currentUser.memberSince}
          </p>
        </Card>

        {/* Tier Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Tier Progress</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {currentUser.tier === 'Platinum' ? 'Highest tier achieved!' : `Progress to ${currentUser.tier === 'Silver' ? 'Gold' : 'Platinum'}`}
              </p>
            </div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-600 to-sky-500 text-white">
              {currentUser.tier}
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={tierProgress > 100 ? 100 : tierProgress} className="h-3" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {currentUser.lifetimePoints.toLocaleString()} / {nextTierPoints.toLocaleString()} points
              </span>
              {currentUser.tier !== 'Platinum' && (
                <span className="text-sky-600 dark:text-sky-400 font-medium">
                  {(nextTierPoints - currentUser.lifetimePoints).toLocaleString()} to go
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {currentUser.expiringPoints > 0 && (
        <Card className="p-4 border-orange-200 dark:border-orange-800/30 bg-orange-50/50 dark:bg-orange-900/10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {currentUser.expiringPoints} Points Expiring Soon
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You have {currentUser.expiringPoints} points expiring in {currentUser.daysUntilExpiry} days. Use them before they're gone!
              </p>
            </div>
            <Link to="/rewards">
              <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white">
                Redeem Now
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Recent Activity</h3>
          <Link to="/activity">
            <Button variant="ghost" size="sm" className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300">
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'earned'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : transaction.type === 'pending'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : transaction.type === 'gifted'
                      ? 'bg-purple-100 dark:bg-purple-900/30'
                      : 'bg-orange-100 dark:bg-orange-900/30'
                  }`}
                >
                  {transaction.type === 'earned' ? (
                    <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : transaction.type === 'pending' ? (
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : transaction.type === 'gifted' ? (
                    <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    transaction.type === 'earned'
                      ? 'text-green-600 dark:text-green-400'
                      : transaction.type === 'pending'
                      ? 'text-blue-600 dark:text-blue-400'
                      : transaction.type === 'gifted'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }`}
                >
                  {transaction.type === 'earned' || transaction.type === 'pending' ? '+' : '-'}
                  {transaction.points}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/earn">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-sky-200 dark:border-sky-800/30 bg-gradient-to-br from-sky-50/50 to-white dark:from-sky-900/10 dark:to-gray-900">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Earn More Points</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete tasks & earn rewards</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/rewards">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-orange-200 dark:border-orange-800/30 bg-gradient-to-br from-orange-50/50 to-white dark:from-orange-900/10 dark:to-gray-900">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Redeem Rewards</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse available rewards</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/activity">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-blue-200 dark:border-blue-800/30 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-gray-900">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">View Activity</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your transactions</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Program Capabilities */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Loyalty Program Capabilities</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              End-to-end earning and redemption experience aligned to your requested flow
            </p>
          </div>
          <Badge variant="outline" className="text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/40">
            {loyaltyCapabilities.length} features
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loyaltyCapabilities.map((feature) => (
            <div
              key={feature}
              className="rounded-xl border border-gray-200 dark:border-gray-800 p-3 bg-white dark:bg-gray-900/60 flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">{feature}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
