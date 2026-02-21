import { useState } from "react";
import { Check, User, Smartphone, Clipboard, Users, Share2, Star, ShoppingCart, Receipt, FileText } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { currentUser, earnOpportunities } from "../data/mock-data";
import { toast } from "sonner";

export default function EarnPoints() {
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState("");

  const handleSurveyComplete = () => {
    toast.success("Survey completed! +50 points", {
      description: "Your points will be added to your account shortly.",
    });
    setSurveyOpen(false);
  };

  const handlePurchase = () => {
    const amount = parseFloat(purchaseAmount);
    if (amount > 0) {
      const pointsEarned = Math.floor(amount * 2); // 2 points per dollar
      toast.success(`Purchase recorded! +${pointsEarned} points`, {
        description: `Earned from $${amount.toFixed(2)} purchase`,
      });
      setReceiptOpen(false);
      setPurchaseAmount("");
    }
  };

  const purchaseValue = parseFloat(purchaseAmount || "0");
  const projectedPointsEarned = purchaseValue > 0 ? Math.floor(purchaseValue * 2) : 0;
  const projectedPostPurchaseBalance = currentUser.points + projectedPointsEarned;

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      user: User,
      smartphone: Smartphone,
      clipboard: Clipboard,
      users: Users,
      'share-2': Share2,
      star: Star,
    };
    return icons[iconName] || User;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Earn Points</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Complete tasks and make purchases to earn more rewards
        </p>
      </div>

      {/* How to Earn */}
      <Card className="p-6 bg-gradient-to-br from-sky-600 to-sky-500 text-white border-0">
        <h2 className="text-xl font-bold mb-4">How to Earn Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Make Purchases</h3>
              <p className="text-emerald-100 text-sm">Earn 2 points for every $1 spent automatically</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clipboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Complete Tasks</h3>
              <p className="text-emerald-100 text-sm">Surveys, reviews, and more</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Refer Friends</h3>
              <p className="text-emerald-100 text-sm">Both get 250 points</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setReceiptOpen(true)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Record Purchase</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Earn points instantly</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Record your purchase and see points added to your receipt in real-time
          </p>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSurveyOpen(true)}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Complete Survey</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quick feedback form</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share your experience and earn 50 points (takes 2 minutes)
          </p>
        </Card>
      </div>

      {/* Earn Opportunities */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Tasks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {earnOpportunities.map((opportunity) => {
            const Icon = getIcon(opportunity.icon);
            return (
              <Card key={opportunity.id} className={opportunity.completed ? 'opacity-60' : ''}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        opportunity.completed
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : 'bg-sky-100 dark:bg-sky-900/30'
                      }`}>
                        {opportunity.completed ? (
                          <Check className="w-6 h-6 text-gray-400 dark:text-gray-600" />
                        ) : (
                          <Icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {opportunity.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {opportunity.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold ${
                        opportunity.completed
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                          : 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400'
                      }`}>
                        +{opportunity.points}
                      </div>
                    </div>
                  </div>
                  {!opportunity.completed && (
                    <Button 
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white"
                      onClick={() => {
                        if (opportunity.id === 'E003') {
                          setSurveyOpen(true);
                        } else {
                          toast.info("Coming soon!", {
                            description: "This feature will be available shortly.",
                          });
                        }
                      }}
                    >
                      Start Task
                    </Button>
                  )}
                  {opportunity.completed && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Check className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Purchase History */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Purchases</h3>
        <div className="space-y-3">
          {currentUser.transactions
            .filter(t => t.type === 'earned' && t.receiptId)
            .slice(0, 5)
            .map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.receiptId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sky-600 dark:text-sky-400">+{transaction.points}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">points earned</p>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Survey Dialog */}
      <Dialog open={surveyOpen} onOpenChange={setSurveyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Feedback Survey</DialogTitle>
            <DialogDescription>
              Help us improve your experience and earn 50 points
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>How would you rate your recent experience?</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex items-center justify-center font-semibold"
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="feedback">What can we improve?</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts..."
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSurveyOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={handleSurveyComplete}>
              Submit & Earn 50 Points
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Purchase Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record Purchase</DialogTitle>
            <DialogDescription>
              Enter your purchase amount to earn points automatically (2 points per $1)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="amount">Purchase Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                className="mt-2"
              />
            </div>
            {projectedPointsEarned > 0 && (
              <div className="p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Purchase Amount</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${purchaseValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Points to Earn</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400 text-lg">
                    +{projectedPointsEarned}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-sky-200 dark:border-sky-800/40">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Projected Point Balance</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {projectedPostPurchaseBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
            {projectedPointsEarned > 0 && (
              <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Receipt / POS Preview</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">${purchaseValue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Points Earned</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-400">+{projectedPointsEarned} pts</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
                    <span className="text-gray-700 dark:text-gray-300">New Balance</span>
                    <span className="font-bold text-gray-900 dark:text-white">{projectedPostPurchaseBalance.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-sky-600 hover:bg-sky-700 text-white" 
              onClick={handlePurchase}
              disabled={!purchaseAmount || parseFloat(purchaseAmount) <= 0}
            >
              Record Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
