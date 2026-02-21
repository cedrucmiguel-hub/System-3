import { useState } from "react";
import { User, Mail, Phone, Calendar, Award, Star, Edit2, Save, X } from "lucide-react";
import { currentUser } from "../data/mock-data";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { toast } from "sonner";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: currentUser.phone,
  });

  const handleSave = () => {
    toast.success("Profile updated!", {
      description: "Your changes have been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
    });
    setIsEditing(false);
  };

  const tierBenefits = {
    Silver: [
      "Earn 2 points per $1 spent",
      "Birthday month bonus: 100 points",
      "Early access to new products",
    ],
    Gold: [
      "Earn 3 points per $1 spent",
      "Birthday month bonus: 200 points",
      "Priority customer support",
      "Exclusive Gold member events",
      "Free delivery on online orders",
    ],
    Platinum: [
      "Earn 5 points per $1 spent",
      "Birthday month bonus: 500 points",
      "VIP customer support",
      "Exclusive Platinum lounges",
      "Complimentary beverage on every 10th purchase",
      "Annual free coffee beans package",
      "Partner rewards access",
    ],
  };

  const nextTierInfo = {
    Silver: { name: "Gold", pointsNeeded: 5000 },
    Gold: { name: "Platinum", pointsNeeded: 10000 },
    Platinum: { name: "Platinum", pointsNeeded: 0 },
  };

  const nextTier = nextTierInfo[currentUser.tier];
  const tierProgress = currentUser.tier === "Platinum" 
    ? 100 
    : (currentUser.lifetimePoints / nextTier.pointsNeeded) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account and view your membership details
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Personal Information</h3>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-50 dark:from-sky-900/30 dark:to-sky-800/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.fullName}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-gradient-to-r from-sky-600 to-sky-500 text-white">
                    {currentUser.tier} Member
                  </Badge>
                  <Badge variant="outline" className={
                    currentUser.status === 'Active' 
                      ? 'border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400'
                      : 'border-gray-200 dark:border-gray-700'
                  }>
                    {currentUser.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Membership Details */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-6">Membership Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member ID</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1">{currentUser.memberId}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1">{currentUser.memberSince}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Points</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1">{currentUser.points.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lifetime Points</p>
                  <p className="font-semibold text-gray-900 dark:text-white mt-1">{currentUser.lifetimePoints.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tier Benefits */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">
              {currentUser.tier} Tier Benefits
            </h3>
            <ul className="space-y-3">
              {tierBenefits[currentUser.tier].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right Column - Stats & Progress */}
        <div className="space-y-6">
          {/* Tier Progress */}
          {currentUser.tier !== "Platinum" && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tier Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress to {nextTier.name}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{Math.min(100, Math.round(tierProgress))}%</span>
                </div>
                <Progress value={tierProgress > 100 ? 100 : tierProgress} className="h-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {currentUser.lifetimePoints.toLocaleString()} / {nextTier.pointsNeeded.toLocaleString()}
                  </span>
                  <span className="text-sky-600 dark:text-sky-400 font-medium">
                    {(nextTier.pointsNeeded - currentUser.lifetimePoints).toLocaleString()} to go
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400 text-sm">This Month</span>
                <div className="text-right">
                  <p className="font-semibold text-green-600 dark:text-green-400">+{currentUser.earnedThisMonth}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">earned</p>
                </div>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Redeemed</span>
                <div className="text-right">
                  <p className="font-semibold text-orange-600 dark:text-orange-400">-{currentUser.redeemedThisMonth}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">this month</p>
                </div>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Transactions</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{currentUser.transactions.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">total</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Surveys Completed</span>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{currentUser.surveysCompleted}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">surveys</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Status */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Profile Complete</span>
                <Badge className={
                  currentUser.profileComplete
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                }>
                  {currentUser.profileComplete ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">App Downloaded</span>
                <Badge className={
                  currentUser.hasDownloadedApp
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                }>
                  {currentUser.hasDownloadedApp ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  Verified
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}