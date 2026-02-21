import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Clock, Gift, Filter, Calendar, XCircle } from "lucide-react";
import { currentUser } from "../data/mock-data";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";

export default function PointsActivity() {
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const filteredTransactions = currentUser.transactions
    .filter((t) => {
      if (filterType === "all") return true;
      return t.type === filterType;
    })
    .sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === "points-desc") return b.points - a.points;
      if (sortBy === "points-asc") return a.points - b.points;
      return 0;
    });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "earned":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/30";
      case "pending":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30";
      case "redeemed":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/30";
      case "gifted":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/30";
      case "expired":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "earned":
        return <ArrowUpRight className="w-5 h-5" />;
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "redeemed":
        return <ArrowDownRight className="w-5 h-5" />;
      case "gifted":
        return <Gift className="w-5 h-5" />;
      case "expired":
        return <XCircle className="w-5 h-5" />;
      default:
        return <ArrowUpRight className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Points Activity</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View and track all your points transactions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Earned</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                +{currentUser.transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.points, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Redeemed</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                -{currentUser.transactions.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + t.points, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Points</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {currentUser.pendingPoints.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter by Type
            </label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="earned">Earned Only</SelectItem>
                <SelectItem value="redeemed">Redeemed Only</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
                <SelectItem value="gifted">Gifted Only</SelectItem>
                <SelectItem value="expired">Expired Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sort by
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="points-desc">Highest Points</SelectItem>
                <SelectItem value="points-asc">Lowest Points</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filterType !== "all" && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilterType("all")}
              className="text-emerald-600 dark:text-emerald-400"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Transaction List */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
          <span>Transaction History</span>
          <Badge variant="secondary">{filteredTransactions.length} transactions</Badge>
        </h3>
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  transaction.type === 'earned'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : transaction.type === 'pending'
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : transaction.type === 'gifted'
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : transaction.type === 'expired'
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : 'bg-orange-100 dark:bg-orange-900/30'
                }`}>
                  <div className={
                    transaction.type === 'earned'
                      ? 'text-green-600 dark:text-green-400'
                      : transaction.type === 'pending'
                      ? 'text-blue-600 dark:text-blue-400'
                      : transaction.type === 'gifted'
                      ? 'text-purple-600 dark:text-purple-400'
                      : transaction.type === 'expired'
                      ? 'text-gray-600 dark:text-gray-400'
                      : 'text-orange-600 dark:text-orange-400'
                  }>
                    {getTypeIcon(transaction.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                    {transaction.category && (
                      <>
                        <span className="text-gray-400 dark:text-gray-600">•</span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </>
                    )}
                    {transaction.receiptId && (
                      <>
                        <span className="text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {transaction.receiptId}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className={`text-lg font-bold ${
                  transaction.type === 'earned'
                    ? 'text-green-600 dark:text-green-400'
                    : transaction.type === 'pending'
                    ? 'text-blue-600 dark:text-blue-400'
                    : transaction.type === 'gifted'
                    ? 'text-purple-600 dark:text-purple-400'
                    : transaction.type === 'expired'
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
                  {transaction.type === 'earned' || transaction.type === 'pending' ? '+' : '-'}
                  {transaction.points}
                </p>
                <Badge className={getTypeColor(transaction.type)} variant="outline">
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No transactions found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
