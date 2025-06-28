import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Calendar,
  Home,
  PenTool,
  Settings,
  Users,
  Zap,
  Link,
  TrendingUp
} from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar";
import logo from '../assets/logo.png';

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Content Planning", href: "/dashboard/planning", icon: TrendingUp },
  { name: "Content Studio", href: "/dashboard/content", icon: PenTool },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Social Accounts", href: "/dashboard/social-accounts", icon: Link },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/dashboard/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarComponent 
      className={`${collapsed ? "w-16" : "w-64"} border-r bg-white`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            role="img"
            aria-label="Social Mind logo"
          >
            <img src={logo} alt="Social Mind logo" className="w-7 h-7 rounded" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">Social Mind</h1>
              <p className="text-xs text-gray-500">Smart Social Manager</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu role="menubar" aria-label="Main navigation menu">
              {navigation.map((item, index) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.href}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          navIsActive || isActive(item.href)
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                      role="menuitem"
                      aria-label={`Navigate to ${item.name}`}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      tabIndex={0}
                    >
                      <item.icon className="h-5 w-5" aria-hidden="true" />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
}
