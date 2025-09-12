import { Button } from "@/components/ui/button";
import { Home, Search, PlusSquare, Heart, User, MessageCircle, Video } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: "/feed", label: "Home" },
    { icon: Search, path: "/search", label: "Search" },
    { icon: PlusSquare, path: "/create", label: "Create" },
    { icon: Heart, path: "/activity", label: "Activity" },
    { icon: MessageCircle, path: "/chat", label: "Messages" },
    { icon: User, path: "/profile", label: "Profile" }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Connect & Share
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex items-center space-x-2"
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                alert("Video Call Started – Demo Only");
              }}
              className="flex items-center space-x-2"
            >
              <Video className="w-4 h-4" />
              <span className="hidden lg:inline">Video Call</span>
            </Button>
          </div>

          <div className="md:hidden flex items-center space-x-1">
            {navItems.slice(0, 4).map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
              >
                <item.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;