import { Outlet, NavLink } from "react-router";
import {
  LayoutDashboard,
  Calendar,
  Plus,
  Building2,
  Users,
  BarChart3,
  FileText,
  Wallet,
  Bell,
  Gift,
  UserCog,
  Clock,
  ShieldCheck,
  Settings,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { clearHostAuthToken } from "../services/hostAuthStorage";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/bookings", label: "Bookings", icon: Calendar },
  { path: "/new-booking", label: "New Listing", icon: Plus },
  { path: "/properties", label: "Listed Properties", icon: Building2 },
  { path: "/customers", label: "Customers", icon: Users },
  { path: "/reporting", label: "Reporting", icon: BarChart3 },
  { path: "/invoices", label: "Invoices", icon: FileText },
  { path: "/wallet", label: "Wallet", icon: Wallet },
  // { path: "/alerts", label: "Booking Alerts", icon: Bell },
  { path: "/programs", label: "Programs", icon: Gift },
  { path: "/people", label: "People", icon: UserCog },
  // { path: "/pending-actions", label: "Pending Actions", icon: Clock },
  { path: "/verification", label: "Verification", icon: ShieldCheck },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    clearHostAuthToken();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-70" : "w-20"
        } bg-[#0D0D0D] border-r border-[#27F5E8]/15 transition-all duration-300 flex flex-col fixed h-screen z-50`}
      >
        {/* Logo Area */}

<div className="p-6 border-b border-[#1C1C1C] flex items-center justify-center relative">

  <div
    className={`${
      isSidebarOpen ? "w-92 h-18" : "w-12 h-12"
    } flex-shrink-0 rounded-xl flex items-center justify-center p-2.5 transition-all`}
  >
    <img
      src="/logo4.png"
      alt="MetroBook"
      className="w-full h-full object-contain"
    />
  </div>

  <button
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    className="absolute right-6 text-white/60 hover:text-[#27F5E8] transition-colors"
  >
  </button>

</div>
        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                    isActive
                      ? "bg-[#27F5E8]/10 text-[#27F5E8] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-[#27F5E8] before:rounded-r"
                      : "text-white/70 hover:text-white hover:bg-white/5 hover:before:absolute hover:before:left-0 hover:before:top-1 hover:before:bottom-1 hover:before:w-1 hover:before:bg-[#27F5E8]/50 hover:before:rounded-r"
                  }`
                }
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ml-2`} />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#1C1C1C]">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg bg-[#1C1C1C]/50 border border-[#27F5E8]/10 ${
              isSidebarOpen ? "" : "justify-center"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#27F5E8]/20 flex items-center justify-center border border-[#27F5E8]/50">
              <User className="w-5 h-5 text-[#27F5E8]" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">Corporate Admin</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3 h-3 text-[#27F5E8]" />
                  <p className="text-xs text-[#27F5E8]">Verified</p>
                </div>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full mt-2 flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? You will need to sign in again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300 bg-white min-h-screen`}
      >
        <Outlet />
      </main>
    </div>
  );
}