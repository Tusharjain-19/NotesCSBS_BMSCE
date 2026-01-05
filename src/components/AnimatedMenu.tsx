import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Users, Menu, X, Home, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import bmsceLogo from "@/assets/bmsce-logo.png";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { label: "Home", href: "/", icon: <Home className="h-4 w-4" /> },
  { label: "Contributors", href: "/contributors", icon: <Users className="h-4 w-4" /> },
];

export function AnimatedHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'border-b border-border bg-background/90 backdrop-blur-lg shadow-sm' 
          : 'border-b border-transparent bg-background/50 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 transition-all duration-300 hover:opacity-80"
          data-magnetic
        >
          <img 
            src={bmsceLogo} 
            alt="BMSCE Logo" 
            className={`transition-all duration-300 object-contain ${
              isScrolled ? 'h-10 w-10' : 'h-12 w-12 md:h-14 md:w-14'
            }`}
          />
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Notes CSBS</span>
            <span className="text-xs text-muted-foreground hidden sm:block">BMSCE Resources</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              data-magnetic
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                location.pathname === item.href
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'slideIn 0.3s ease-out forwards'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <a
            href="mailto:notescsbsbmsce@gmail.com"
            data-magnetic
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Mail className="h-4 w-4" />
            <span>Feedback</span>
          </a>
          <div className="ml-2" data-magnetic>
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative overflow-hidden"
            data-magnetic
          >
            <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}>
              <Menu className="h-5 w-5" />
            </div>
            <div className={`absolute transition-all duration-300 ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`}>
              <X className="h-5 w-5" />
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 top-16 bg-background/95 backdrop-blur-lg transition-all duration-500 md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="container mx-auto px-4 py-6">
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-4 text-lg rounded-xl transition-all duration-300 mb-2 ${
                location.pathname === item.href
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              } ${isMenuOpen ? 'menu-item-visible' : 'menu-item-hidden'}`}
              style={{ 
                transitionDelay: isMenuOpen ? `${index * 75}ms` : '0ms',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <a
            href="mailto:notescsbsbmsce@gmail.com"
            className={`flex items-center gap-3 px-4 py-4 text-lg rounded-xl transition-all duration-300 mb-2 text-muted-foreground hover:text-foreground hover:bg-accent ${isMenuOpen ? 'menu-item-visible' : 'menu-item-hidden'}`}
            style={{ 
              transitionDelay: isMenuOpen ? `${menuItems.length * 75}ms` : '0ms',
            }}
          >
            <Mail className="h-4 w-4" />
            <span>Feedback</span>
          </a>
        </nav>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .menu-item-hidden {
          opacity: 0;
          transform: translateX(-20px);
        }
        
        .menu-item-visible {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>
    </header>
  );
}
