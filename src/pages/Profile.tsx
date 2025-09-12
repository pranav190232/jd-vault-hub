import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Settings, FileText, Upload, TrendingUp } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm mb-8">
            <CardHeader>
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Professional User</h1>
                  <p className="text-muted-foreground mb-3">HR Manager • Document Specialist</p>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">Premium Member</Badge>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Total Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">127</div>
                <p className="text-sm text-muted-foreground">Job descriptions uploaded</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">23</div>
                <p className="text-sm text-muted-foreground">Files uploaded recently</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Success Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">98.5%</div>
                <p className="text-sm text-muted-foreground">Upload success rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="text-foreground font-medium">Professional User</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="text-foreground font-medium">user@company.com</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <div className="text-foreground font-medium">HR Manager</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  <div className="text-foreground font-medium">Human Resources</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <div className="text-foreground font-medium">January 2024</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Default File Format</label>
                  <div className="text-foreground font-medium">PDF Documents</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Auto-Preview</label>
                  <div className="text-foreground font-medium">Enabled</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notifications</label>
                  <div className="text-foreground font-medium">Email & In-App</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Storage Limit</label>
                  <div className="text-foreground font-medium">10 GB (Premium)</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Theme</label>
                  <div className="text-foreground font-medium">Dark Mode</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Update Profile
            </Button>
            <Button variant="outline" size="lg">
              Change Password
            </Button>
            <Button variant="outline" size="lg">
              Download Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;