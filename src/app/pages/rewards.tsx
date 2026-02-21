import { useState } from "react";
import { Award, ShoppingBag, Gift, Check, Store, Truck } from "lucide-react";
import { availableRewards, currentUser, type Reward } from "../data/mock-data";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";

const rewardImages = [
  "https://images.unsplash.com/photo-1657048167114-0942f3a2dc93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZXZlcmFnZSUyMGN1cHxlbnwxfHx8fDE3NzE2NDAyOTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0cnklMjBjcm9pc3NhbnQlMjBiYWtlcnl8ZW58MXx8fHwxNzcxNTM5MTU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1680381724318-c8ac9fe3a484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXR0ZSUyMHNwZWNpYWx0eSUyMGNvZmZlZXxlbnwxfHx8fDE3NzE2NDAyOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1738682585466-c287db5404de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBzYW5kd2ljaCUyMG1lYWx8ZW58MXx8fHwxNzcxNjQwMjk2fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1561766858-62033ae40ec3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMGJhZ3xlbnwxfHx8fDE3NzE1NjczNTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1666447616947-cd26838cb88b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW1ibGVyJTIwY29mZmVlJTIwbXVnfGVufDF8fHx8MTc3MTY0MDI5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1637910116483-7efcc9480847?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwY2FyZCUyMHZvdWNoZXJ8ZW58MXx8fHwxNzcxNjQwMjk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1683888046273-38c106471115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzdWJzY3JpcHRpb24lMjBwYXNzfGVufDF8fHx8MTc3MTY0MDI5N3ww&ixlib=rb-4.1.0&q=80&w=1080",
];

type RedemptionMethod = "in-store" | "online";

type RedeemedReward = {
  id: string;
  rewardId: string;
  date: Date;
  canUndo: boolean;
  points: number;
  method: RedemptionMethod;
};

export default function Rewards() {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [giftDialogOpen, setGiftDialogOpen] = useState(false);
  const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
  const [redemptionMethod, setRedemptionMethod] = useState<RedemptionMethod>("in-store");

  const [availablePoints, setAvailablePoints] = useState(currentUser.points);
  const [usePoints, setUsePoints] = useState(false);
  const [autoApplyAtCheckout, setAutoApplyAtCheckout] = useState(false);
  const [checkoutAmount, setCheckoutAmount] = useState("");
  const [pointsToUse, setPointsToUse] = useState("");

  const [giftEmail, setGiftEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [reservedRewards, setReservedRewards] = useState<string[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);

  const filteredRewards = availableRewards.filter((reward) => reward.available);

  const handleReserve = (reward: Reward) => {
    setSelectedReward(reward);
    setReserveDialogOpen(true);
  };

  const confirmReserve = () => {
    if (!selectedReward) return;
    if (reservedRewards.includes(selectedReward.id)) {
      toast.info("This reward is already reserved.");
      setReserveDialogOpen(false);
      return;
    }
    setReservedRewards((prev) => [...prev, selectedReward.id]);
    toast.success("Reward reserved!", {
      description: `${selectedReward.name} reserved for 24 hours`,
    });
    setReserveDialogOpen(false);
  };

  const handleRedeem = (reward: Reward) => {
    setSelectedReward(reward);
    setRedeemDialogOpen(true);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;
    if (selectedReward.pointsCost > availablePoints) {
      toast.error("Not enough points to redeem this reward.");
      return;
    }

    setAvailablePoints((prev) => prev - selectedReward.pointsCost);
    setRedeemedRewards((prev) => [
      {
        id: `${selectedReward.id}-${Date.now()}`,
        rewardId: selectedReward.id,
        date: new Date(),
        canUndo: true,
        points: selectedReward.pointsCost,
        method: redemptionMethod,
      },
      ...prev,
    ]);

    setReservedRewards((prev) => prev.filter((id) => id !== selectedReward.id));

    toast.success("Reward redeemed!", {
      description:
        redemptionMethod === "online"
          ? `${selectedReward.name} will be delivered.`
          : `Show this confirmation at the counter for ${selectedReward.name}.`,
    });

    setRedeemDialogOpen(false);
    setRedemptionMethod("in-store");
  };

  const handleGift = (reward: Reward) => {
    setSelectedReward(reward);
    setGiftDialogOpen(true);
  };

  const confirmGift = () => {
    if (!selectedReward || !giftEmail) return;
    if (selectedReward.pointsCost > availablePoints) {
      toast.error("Not enough points to send this gift.");
      return;
    }

    setAvailablePoints((prev) => prev - selectedReward.pointsCost);

    toast.success("Points gifted!", {
      description: `${selectedReward.pointsCost} points sent to ${giftEmail}`,
    });

    setGiftDialogOpen(false);
    setGiftEmail("");
    setGiftMessage("");
  };

  const handleUndoRedemption = (redemptionId: string) => {
    const redemption = redeemedRewards.find((item) => item.id === redemptionId);
    if (!redemption) return;

    setAvailablePoints((prev) => prev + redemption.points);
    setRedeemedRewards((prev) => prev.filter((item) => item.id !== redemptionId));

    toast.success("Redemption cancelled", {
      description: `${redemption.points} points restored to your account.`,
    });
  };

  const handlePartialPayment = () => {
    const points = parseInt(pointsToUse, 10);
    if (!Number.isFinite(points) || points <= 0) {
      toast.error("Enter a valid point amount.");
      return;
    }
    if (points > availablePoints) {
      toast.error("You do not have enough points.");
      return;
    }

    setAvailablePoints((prev) => prev - points);
    toast.success(`${points} points applied!`, {
      description: `Remaining balance: ${availablePoints - points} points`,
    });
    setUsePoints(false);
    setPointsToUse("");
  };

  const handleAutoApplyCheckout = () => {
    const subtotal = parseFloat(checkoutAmount);
    if (!subtotal || subtotal <= 0) {
      toast.error("Enter a valid checkout amount.");
      return;
    }

    const maxApplicablePoints = Math.min(availablePoints, Math.floor(subtotal * 100));
    if (maxApplicablePoints <= 0) {
      toast.error("No points available to apply.");
      return;
    }

    const finalAmount = Math.max(0, subtotal - maxApplicablePoints / 100);

    setAvailablePoints((prev) => prev - maxApplicablePoints);
    toast.success("Points auto-applied at checkout!", {
      description: `${maxApplicablePoints} points used. New payable total: $${finalAmount.toFixed(2)}`,
    });
    setCheckoutAmount("");
  };

  const renderRewardCard = (reward: Reward, imageIndex: number) => {
    const isReserved = reservedRewards.includes(reward.id);
    const canAfford = availablePoints >= reward.pointsCost;

    return (
      <Card key={reward.id} className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <ImageWithFallback
            src={rewardImages[imageIndex]}
            alt={reward.name}
            className="w-full h-48 object-cover"
          />
          {isReserved && (
            <Badge className="absolute top-3 right-3 bg-sky-600 text-white">
              Reserved
            </Badge>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{reward.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{reward.description}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{reward.pointsCost}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">points</span>
            </div>
            <Badge variant="outline" className="capitalize">{reward.category}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              className="flex-1 min-w-[120px] bg-sky-600 hover:bg-sky-700 text-white"
              onClick={() => handleRedeem(reward)}
              disabled={!canAfford}
            >
              {isReserved ? "Redeem Now" : "Redeem"}
            </Button>

            {!isReserved && canAfford && (
              <Button variant="outline" onClick={() => handleReserve(reward)}>
                Reserve
              </Button>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handleGift(reward)}
              disabled={!canAfford}
            >
              <Gift className="w-4 h-4" />
            </Button>
          </div>

          {!canAfford && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
              Need {reward.pointsCost - availablePoints} more points
            </p>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rewards</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Redeem your points for exclusive rewards</p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-sky-600 to-sky-500 text-white border-0">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Available Points</p>
            <h2 className="text-4xl font-bold mt-2">{availablePoints.toLocaleString()}</h2>
            <p className="text-emerald-100 text-sm mt-1">
              {currentUser.pendingPoints > 0 && `+${currentUser.pendingPoints} pending`}
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Use Points as Partial Payment</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Apply your points to reduce the cost of any purchase (1 point = $0.01)
            </p>

            {usePoints && (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                <Input
                  type="number"
                  placeholder="Enter points"
                  value={pointsToUse}
                  onChange={(e) => setPointsToUse(e.target.value)}
                  max={availablePoints}
                />
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handlePartialPayment}
                  disabled={!pointsToUse || parseInt(pointsToUse, 10) <= 0}
                >
                  Apply
                </Button>
              </div>
            )}
          </div>

          <Button
            variant={usePoints ? "outline" : "default"}
            className={!usePoints ? "bg-sky-600 hover:bg-sky-700 text-white" : ""}
            onClick={() => setUsePoints((prev) => !prev)}
          >
            {usePoints ? "Cancel" : "Use Points"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/60 dark:bg-emerald-900/10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Apply Points Automatically at Checkout</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Enable auto-apply to use the maximum available points for your current checkout amount.
            </p>

            {autoApplyAtCheckout && (
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Checkout amount (e.g. 18.50)"
                  value={checkoutAmount}
                  onChange={(e) => setCheckoutAmount(e.target.value)}
                />
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleAutoApplyCheckout}>
                  Auto Apply
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Label htmlFor="auto-apply">Auto Apply</Label>
            <Switch id="auto-apply" checked={autoApplyAtCheckout} onCheckedChange={setAutoApplyAtCheckout} />
          </div>
        </div>
      </Card>

      {reservedRewards.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Reserved Rewards ({reservedRewards.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards
              .filter((reward) => reservedRewards.includes(reward.id))
              .map((reward, index) => (
                <div key={reward.id} className="flex items-center gap-4 p-4 rounded-xl border-2 border-sky-200 dark:border-sky-800/30 bg-sky-50/50 dark:bg-sky-900/10">
                  <ImageWithFallback
                    src={rewardImages[index]}
                    alt={reward.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{reward.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{reward.pointsCost} points</p>
                    <Badge className="mt-1 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400">Reserved</Badge>
                  </div>
                  <Button size="sm" onClick={() => handleRedeem(reward)} className="bg-sky-600 hover:bg-sky-700 text-white">
                    Redeem
                  </Button>
                </div>
              ))}
          </div>
        </Card>
      )}

      {redeemedRewards.filter((reward) => reward.canUndo).length > 0 && (
        <Card className="p-6 border-orange-200 dark:border-orange-800/30 bg-orange-50/50 dark:bg-orange-900/10">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Check className="w-5 h-5" />
            Recent Redemptions
          </h3>

          <div className="space-y-3">
            {redeemedRewards
              .filter((reward) => reward.canUndo)
              .map((redemption) => {
                const reward = availableRewards.find((item) => item.id === redemption.rewardId);
                if (!reward) return null;

                return (
                  <div key={redemption.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{reward.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Redeemed {redemption.date.toLocaleTimeString()} - {redemption.points} points ({redemption.method === "online" ? "delivery" : "in-store"})
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUndoRedemption(redemption.id)}
                      className="text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      Undo & Restore Points
                    </Button>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="beverage">Beverages</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
          <TabsTrigger value="merchandise">Merchandise</TabsTrigger>
          <TabsTrigger value="voucher">Vouchers</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward, index) => renderRewardCard(reward, index))}
          </div>
        </TabsContent>

        {["beverage", "food", "merchandise", "voucher"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards
                .filter((reward) => reward.category === category)
                .map((reward) => {
                  const imageIndex = availableRewards.findIndex((item) => item.id === reward.id);
                  return renderRewardCard(reward, imageIndex);
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={redeemDialogOpen} onOpenChange={setRedeemDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Redeem Reward</DialogTitle>
            <DialogDescription>Choose how you'd like to receive your reward</DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedReward.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReward.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{selectedReward.pointsCost}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Redemption Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`p-4 rounded-xl border-2 transition-all ${
                      redemptionMethod === "in-store"
                        ? "border-sky-600 bg-sky-50 dark:bg-sky-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setRedemptionMethod("in-store")}
                  >
                    <Store className={`w-6 h-6 mx-auto mb-2 ${
                      redemptionMethod === "in-store" ? "text-sky-600 dark:text-sky-400" : "text-gray-400"
                    }`} />
                    <p className="font-medium text-sm text-gray-900 dark:text-white">In-Store</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pick up at counter</p>
                  </button>

                  <button
                    className={`p-4 rounded-xl border-2 transition-all ${
                      redemptionMethod === "online"
                        ? "border-sky-600 bg-sky-50 dark:bg-sky-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setRedemptionMethod("online")}
                  >
                    <Truck className={`w-6 h-6 mx-auto mb-2 ${
                      redemptionMethod === "online" ? "text-sky-600 dark:text-sky-400" : "text-gray-400"
                    }`} />
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Delivery</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Redeem online for delivery</p>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                <p className="text-sm text-gray-900 dark:text-white">
                  <strong>Note:</strong> After confirming, this reward appears under Recent Redemptions where you can undo and restore points.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRedeemDialogOpen(false)}>Cancel</Button>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={confirmRedeem}>Confirm Redemption</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={giftDialogOpen} onOpenChange={setGiftDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gift Points to Friend</DialogTitle>
            <DialogDescription>Share points with another member</DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30">
                <p className="text-sm text-gray-900 dark:text-white mb-1"><strong>Sending:</strong> {selectedReward.pointsCost} points</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">For: {selectedReward.name}</p>
              </div>
              <div>
                <Label htmlFor="gift-email">Recipient Email</Label>
                <Input
                  id="gift-email"
                  type="email"
                  placeholder="friend@email.com"
                  value={giftEmail}
                  onChange={(e) => setGiftEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="gift-message">Personal Message (Optional)</Label>
                <Input
                  id="gift-message"
                  placeholder="Enjoy your reward"
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setGiftDialogOpen(false)}>Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={confirmGift} disabled={!giftEmail}>Send Gift</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reserveDialogOpen} onOpenChange={setReserveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reserve Reward</DialogTitle>
            <DialogDescription>Reserve this reward for 24 hours without using points yet</DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedReward.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReward.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{selectedReward.pointsCost}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">points</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
                <ul className="text-sm text-gray-900 dark:text-white space-y-2">
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5" /><span>Points are deducted only when redeemed</span></li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5" /><span>Reservation expires in 24 hours</span></li>
                  <li className="flex items-start gap-2"><Check className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5" /><span>Redeem online delivery or in-store anytime before expiry</span></li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReserveDialogOpen(false)}>Cancel</Button>
            <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={confirmReserve}>Reserve Reward</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
