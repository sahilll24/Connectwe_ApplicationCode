import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { register as registerUser, getDashboardPath } from "@/lib/auth";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState<"user" | "organizer">("user");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user } = await registerUser(formData.name, formData.email, formData.password, role);
      toast.success("Account created successfully!");
      navigate(getDashboardPath(user.role));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="public" />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-muted-foreground">Join ConnectWe and start discovering events</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-8 shadow-card">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  className="mt-1.5 h-11" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="mt-1.5 h-11" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="mt-1.5 h-11" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>I want to</Label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`rounded-xl border-2 p-4 text-center transition-all ${
                      role === "user" 
                        ? "border-primary bg-accent" 
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl">🙋</span>
                    <p className={`mt-1 text-sm font-medium ${role === "user" ? "text-accent-foreground" : ""}`}>Join Events</p>
                    <p className="text-xs text-muted-foreground">As a User</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("organizer")}
                    className={`rounded-xl border-2 p-4 text-center transition-all ${
                      role === "organizer" 
                        ? "border-primary bg-accent" 
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl">🎯</span>
                    <p className={`mt-1 text-sm font-medium ${role === "organizer" ? "text-accent-foreground" : ""}`}>Host Events</p>
                    <p className="text-xs text-muted-foreground">As an Organizer</p>
                  </button>
                </div>
              </div>
              <Button className="w-full h-11 mt-2" type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
