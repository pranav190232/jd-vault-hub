import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Home, User, LogOut } from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // In a real app, this would clear auth tokens, etc.
    navigate('/');
  };

  return (
    <nav className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">JD Upload Pro</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            <Button
              variant={isActive('/feed') ? 'default' : 'ghost'}
              onClick={() => navigate('/feed')}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
            
            <Button
              variant={isActive('/profile') ? 'default' : 'ghost'}
              onClick={() => navigate('/profile')}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>

            <div className="h-6 w-px bg-border mx-2" />

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;