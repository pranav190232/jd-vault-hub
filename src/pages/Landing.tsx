import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Connect & Share
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our vibrant community to share moments, connect with friends, and discover amazing content from around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="min-w-32"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/login')}
              className="min-w-32"
            >
              Sign In
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-card/50 border border-border/50">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📸</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Moments</h3>
            <p className="text-muted-foreground">Capture and share your favorite moments with friends and family.</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 border border-border/50">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect</h3>
            <p className="text-muted-foreground">Stay connected with real-time messaging and video calls.</p>
          </div>
          
          <div className="text-center p-6 rounded-lg bg-card/50 border border-border/50">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌟</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Discover</h3>
            <p className="text-muted-foreground">Explore trending content and discover new interests.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;