
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Calendar, 
  Settings, 
  Layers,
  Menu,
  X,
  PackageOpen,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { name: 'Low Stock', path: '/inventory', icon: AlertTriangle },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: PackageOpen },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Logistics', path: '/logistics', icon: Calendar },
  { name: 'Stock Entry', path: '/stock-entry', icon: Layers },
  { name: 'Settings', path: '/settings', icon: Settings },
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

      <div className="p-4 border-t border-[#272727]">
        <div className={cn(
          "rounded-md bg-[#161616] p-3",
          collapsed ? "text-center" : "text-left"
        )}>
          {collapsed ? (
            <div className="flex flex-col items-center">
              <ShoppingCart className="h-5 w-5 text-[#3ECF8E]" />
            </div>
          ) : (
            <>
              <h4 className="text-sm font-medium text-white">Pro Version</h4>
              <p className="text-xs mt-1 text-gray-400">
                Upgrade for AI recommendations and advanced analytics
              </p>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
