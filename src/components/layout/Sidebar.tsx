
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { name: 'Home', path: '/', icon: Home },
];

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

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {sidebarLinks.map((link) => (
            <li key={link.path}>
              <NavLink 
                to={link.path}
                className={({ isActive }) => 
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 transition-colors",
                    isActive 
                      ? "bg-[#3ECF8E] text-white font-medium" 
                      : "hover:bg-[#272727] hover:text-white",
                    collapsed && "justify-center px-2"
                  )
                }
              >
                <link.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{link.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
