import { Link, useLocation } from "react-router-dom";
import { Home, Users, Mail, Settings } from "lucide-react";

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { label: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    { label: "Contributors", href: "/contributors", icon: <Users className="h-5 w-5" /> },
    { label: "Feedback", href: "mailto:notescsbsbmsce@gmail.com", icon: <Mail className="h-5 w-5" />, isExternal: true },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border flex justify-around items-center h-16 pb-safe px-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        if (item.isExternal) {
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors px-2"
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          );
        }

        return (
          <Link
            key={item.label}
            to={item.href}
            className={`flex flex-col items-center gap-1 transition-colors px-2 ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
