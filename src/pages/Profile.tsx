import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    bio: "Software Developer | Coffee Enthusiast | Travel Lover",
    role: "Senior Developer",
    location: "San Francisco, CA",
    website: "johndoe.dev",
    followers: 1234,
    following: 567,
    posts: 89
  });
  
  const [editProfile, setEditProfile] = useState(profile);
  const { toast } = useToast();

  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated!",
      description: "Your profile changes have been saved successfully"
    });
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Profile</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button onClick={handleSave} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-32 h-32">
                <AvatarImage src="https://picsum.photos/seed/currentuser/200" />
                <AvatarFallback className="text-2xl">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="space-y-4">
                  {!isEditing ? (
                    <>
                      <div>
                        <h1 className="text-3xl font-bold">{profile.name}</h1>
                        <Badge variant="secondary" className="mt-2">{profile.role}</Badge>
                      </div>
                      <p className="text-muted-foreground">{profile.bio}</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>📍 {profile.location}</p>
                        <p>🌐 {profile.website}</p>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={editProfile.name}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <Input
                          value={editProfile.role}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, role: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Bio</label>
                        <Textarea
                          value={editProfile.bio}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, bio: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={editProfile.location}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Website</label>
                        <Input
                          value={editProfile.website}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{profile.posts}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{profile.followers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{profile.following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="aspect-square">
                <img 
                  src={`https://picsum.photos/seed/userpost${i}/300`}
                  alt={`Post ${i + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;