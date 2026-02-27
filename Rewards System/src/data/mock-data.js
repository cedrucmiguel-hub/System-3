export const initialAppState = {
  profile: {
    memberId: '',
    fullName: '',
    email: '',
    phone: '',
    tier: 'Bronze',
    memberSince: '',
    status: 'Active',
    points: 0,
    pendingPoints: 0,
    lifetimePoints: 0,
    expiringPoints: 0,
    daysUntilExpiry: 0,
    surveysCompleted: 0,
    profileImage: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=300&q=80'
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
  transactions: []
};
