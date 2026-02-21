import { User, Mail, Award, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface MemberData {
  memberId: string;
  fullName: string;
  email: string;
  tier: string;
  memberSince: string;
  status: string;
}

interface MemberInfoProps {
  member: MemberData;
}

export function MemberInfo({ member }: MemberInfoProps) {
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return 'bg-gradient-to-r from-slate-400 to-slate-300 text-slate-900';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-yellow-900';
      case 'silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900';
      default:
        return 'bg-gray-200 text-gray-900';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-md h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            Member Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <User className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Member ID</p>
                <p className="font-semibold text-gray-900">{member.memberId}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <User className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900">{member.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-900">{member.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <Award className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Membership Tier</p>
                <Badge className={`${getTierColor(member.tier)} mt-1 px-3 py-1`}>
                  {member.tier}
                </Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-semibold text-gray-900">{member.memberSince}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Status</p>
                <Badge className="bg-green-100 text-green-700 border-green-300 mt-1 px-3 py-1">
                  {member.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
