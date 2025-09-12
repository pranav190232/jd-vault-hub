import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Shield, Zap, Users, CheckCircle } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: "Easy Upload",
      description: "Drag & drop or click to upload PDF, DOCX, and TXT files up to 10MB"
    },
    {
      icon: FileText,
      title: "Smart Preview",
      description: "Preview your job descriptions instantly with our built-in document viewer"
    },
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your files are processed securely with enterprise-grade protection"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Quick processing and instant feedback for all your uploads"
    }
  ];

  const stats = [
    { label: "Files Processed", value: "10,000+" },
    { label: "Happy Users", value: "500+" },
    { label: "Success Rate", value: "99.9%" },
    { label: "File Formats", value: "3" }
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Navigation */}
      <nav className="bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">JD Upload Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Professional Document Management
          </Badge>
          <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
            Upload & Manage
            <br />
            <span className="text-primary">Job Descriptions</span>
            <br />
            Like a Pro
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            The most intuitive platform for uploading, previewing, and managing your job description documents. 
            Supports PDF, DOCX, and TXT formats with instant preview capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8 py-3">
              Start Uploading Free
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')} className="text-lg px-8 py-3">
              Sign In to Continue
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 text-center p-6">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 p-6">
              <CardContent className="p-0">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Preview */}
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm p-8 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">See It In Action</h2>
            <p className="text-muted-foreground">Experience the power of our professional upload system</p>
          </div>
          
          <div className="bg-muted/20 rounded-lg p-8 border border-border/50">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Upload className="w-16 h-16 text-primary/60" />
              <div className="text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">Quick Upload Process</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">Instant File Preview</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">Smart File Management</span>
                </div>
              </div>
            </div>
            <Button size="lg" onClick={() => navigate('/signup')} className="w-full">
              Try It Now - Free Account
            </Button>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your
            <span className="text-primary"> Document Workflow?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of professionals who trust our platform for their job description management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8 py-3">
              Create Free Account
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')} className="text-lg px-8 py-3">
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;