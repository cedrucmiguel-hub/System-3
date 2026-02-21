export const initialAppState = {
  profile: {
    memberId: 'HLTH2024001',
    fullName: 'Sarah Anderson',
    email: 'sarah.anderson@email.com',
    phone: '+1 (555) 123-4567',
    tier: 'Platinum',
    memberSince: 'January 15, 2020',
    status: 'Active',
    points: 2475,
    pendingPoints: 350,
    lifetimePoints: 48920,
    expiringPoints: 150,
    daysUntilExpiry: 7,
    surveysCompleted: 5,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'
  },
  tasks: [
    { id: 'E001', title: 'Complete Health Profile', description: 'Add health goals, allergies, and preferences', points: 100, completed: true },
    { id: 'E002', title: 'Install Wellness App', description: 'Get the mobile app for daily tracking', points: 50, completed: true },
    { id: 'E003', title: 'Monthly Wellness Survey', description: 'Share feedback about your health experience', points: 50, completed: false },
    { id: 'E004', title: 'Refer a Member', description: 'Both get 250 points after first check-in', points: 250, completed: false },
    { id: 'E005', title: 'Follow Health Tips Channel', description: 'Follow us for daily wellness tips', points: 30, completed: false },
    { id: 'E006', title: 'Leave a Service Review', description: 'Rate your experience on app store', points: 75, completed: false }
  ],
  rewards: [
    { id: 'RW001', name: 'Vitamin Bundle Voucher', description: 'Discount on essential vitamins', pointsCost: 120, category: 'supplements', imageUrl: 'https://images.unsplash.com/photo-1577460551100-9077b0e3f2f8?auto=format&fit=crop&w=1080&q=80', available: true },
    { id: 'RW002', name: 'Healthy Meal Coupon', description: 'Redeem for one nutrition meal set', pointsCost: 150, category: 'nutrition', imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1080&q=80', available: true },
    { id: 'RW003', name: 'Fitness Class Pass', description: 'One premium group class', pointsCost: 280, category: 'fitness', imageUrl: 'https://images.unsplash.com/photo-1571019613540-99676f5c7f2f?auto=format&fit=crop&w=1080&q=80', available: true },
    { id: 'RW004', name: 'Health Check Package', description: 'Basic preventive check-up', pointsCost: 350, category: 'care', imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1080&q=80', available: true },
    { id: 'RW005', name: 'Protein Starter Kit', description: 'Starter supplement and shaker set', pointsCost: 500, category: 'supplements', imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c2f70d80d?auto=format&fit=crop&w=1080&q=80', available: true },
    { id: 'RW006', name: 'Smart Water Bottle', description: 'Reusable hydration tracker bottle', pointsCost: 800, category: 'gear', imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1080&q=80', available: true },
    { id: 'RW007', name: '$10 Wellness Voucher', description: 'Redeemable for any wellness service', pointsCost: 1000, category: 'voucher', imageUrl: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?auto=format&fit=crop&w=1080&q=80', available: true },
    { id: 'RW008', name: 'Monthly Care Pass', description: '30 days wellness benefits pass', pointsCost: 2500, category: 'voucher', imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1080&q=80', available: true }
  ],
  reservedRewardIds: [],
  transactions: [
    { id: '1', date: '2026-02-21', description: 'Morning Wellness Purchase', type: 'earned', points: 45, category: 'Purchase', receiptId: 'RCP-20240221-001' },
    { id: '2', date: '2026-02-20', description: 'Points Gift to Friend', type: 'gifted', points: -100, category: 'Transfer' },
    { id: '3', date: '2026-02-20', description: 'Pending: Online Wellness Order #12345', type: 'pending', points: 120, category: 'Purchase', receiptId: 'RCP-20240220-002' },
    { id: '4', date: '2026-02-19', description: 'Health Meal Redemption', type: 'redeemed', points: -150, category: 'Reward' },
    { id: '5', date: '2026-02-18', description: 'Nutrition Purchase Bundle', type: 'earned', points: 85, category: 'Purchase', receiptId: 'RCP-20240218-003' },
    { id: '6', date: '2026-02-17', description: 'Survey Completion Bonus', type: 'earned', points: 50, category: 'Bonus' },
    { id: '7', date: '2026-02-15', description: 'Wellness Month Special', type: 'earned', points: 200, category: 'Bonus' },
    { id: '8', date: '2026-02-14', description: 'Fitness Purchase', type: 'earned', points: 65, category: 'Purchase', receiptId: 'RCP-20240214-004' },
    { id: '9', date: '2026-02-12', description: 'Pending: Supplement Pre-order', type: 'pending', points: 230, category: 'Purchase' },
    { id: '10', date: '2026-02-10', description: 'Care Voucher Redemption', type: 'redeemed', points: -120, category: 'Reward' },
    { id: '11', date: '2026-02-08', description: 'Profile Completion Bonus', type: 'earned', points: 100, category: 'Bonus' },
    { id: '12', date: '2026-02-05', description: 'Weekly Health Purchase', type: 'earned', points: 150, category: 'Purchase', receiptId: 'RCP-20240205-005' },
    { id: '13', date: '2026-01-31', description: 'Points Expired - Jan 2025 Batch', type: 'expired', points: -80, category: 'System' },
    { id: '14', date: '2026-01-28', description: 'Referral Bonus - Member Signup', type: 'earned', points: 250, category: 'Bonus' },
    { id: '15', date: '2026-01-25', description: 'Gift from @michael_chen', type: 'earned', points: 50, category: 'Transfer' }
  ]
};
