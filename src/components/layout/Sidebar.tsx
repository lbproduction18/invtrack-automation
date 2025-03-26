
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "bg-[#0F0F0F] h-screen transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden border-r border-[#272727]",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-[#272727]">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-md flex items-center justify-center text-white font-bold bg-[#3ECF8E]">
              IM
            </div>
          </div>
          {!collapsed && (
            <span className="text-lg font-medium ml-2 text-white">InvTrack</span>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className={cn(
            "text-gray-400 hover:bg-[#272727] hover:text-white p-1 h-auto",
            collapsed && "hidden"
          )}
          onClick={() => setCollapsed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className={cn(
            "text-gray-400 hover:bg-[#272727] hover:text-white p-1 h-auto",
            !collapsed && "hidden"
          )}
          onClick={() => setCollapsed(false)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
