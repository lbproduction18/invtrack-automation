
import React from 'react';
import { Bell, Settings, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMenu from './UserMenu';

const TopBar: React.FC = () => {
  return (
    <header className="border-b border-[#272727] bg-[#121212]/30 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 bg-[#0F0F0F]/50 border-[#2E2E2E] w-[250px] lg:w-[350px] text-gray-200"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-[#272727]">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-[#272727]">
            <Settings className="h-5 w-5" />
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
