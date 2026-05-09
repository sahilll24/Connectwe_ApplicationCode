import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Camera } from "lucide-react";
import { getUser, setUser } from "@/lib/auth";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const user = getUser();
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    avatar: "",
  });

  useEffect(() => {
    // Load user data when component mounts
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        avatar: user.avatar || "",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await authAPI.updateProfile({
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        avatar: formData.avatar,
      });
      
      // Update local storage with new user data
      setUser(response.data.user);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const formatJoinDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar variant="user" />
        <div className="flex">
          <DashboardSidebar variant="user" />
          <main className="flex-1 p-6 md:p-8">
            <p className="text-muted-foreground">Please login to view your profile.</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="user" />
      <div className="flex">
        <DashboardSidebar variant="user" />
        <main className="flex-1 p-6 md:p-8 max-w-3xl">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">Profile</h1>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={formData.avatar || user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="h-3.5 w-3.5 text-primary-foreground" />
                </button>
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Member since {formatJoinDate(user.joinDate)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-heading font-semibold mb-4">Edit Profile</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5" 
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  placeholder="Tell us about yourself..." 
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="mt-1.5" 
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  placeholder="Your city or location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1.5" 
                />
              </div>
              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input 
                  id="avatar" 
                  placeholder="https://example.com/your-avatar.jpg"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="mt-1.5" 
                />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
