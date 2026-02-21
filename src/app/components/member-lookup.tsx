import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface MemberLookupProps {
  onSearch: (memberId: string) => void;
  isLoading: boolean;
}

export function MemberLookup({ onSearch, isLoading }: MemberLookupProps) {
  const [memberId, setMemberId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberId.trim()) {
      onSearch(memberId.trim());
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-green-600" />
          Member Lookup
        </CardTitle>
        <CardDescription>
          Enter your unique member ID to retrieve your points balance and activity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Enter Member ID (e.g., MEM001)"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !memberId.trim()}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
