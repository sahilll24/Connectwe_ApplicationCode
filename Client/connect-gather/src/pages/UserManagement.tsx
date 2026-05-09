import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { toast } from "sonner";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async (userId: string) => {
    try {
      await adminAPI.suspendUser(userId);
      toast.success("User suspended successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to suspend user");
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      await adminAPI.activateUser(userId);
      toast.success("User activated successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to activate user");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    try {
      await adminAPI.deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="admin" />
      <div className="flex">
        <DashboardSidebar variant="admin" />
        <main className="flex-1 p-6 md:p-8">
          <h1 className="font-heading text-2xl md:text-3xl font-bold mb-6">User Management</h1>

          <div className="relative max-w-sm mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'} 
                              alt="" 
                              className="h-8 w-8 rounded-full object-cover" 
                            />
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(user.joinDate || user.createdAt)}</TableCell>
                        <TableCell>
                          <Badge className={user.status === "active" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {user.status === "active" ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-warning"
                                onClick={() => handleSuspend(user._id)}
                              >
                                Suspend
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-success"
                                onClick={() => handleActivate(user._id)}
                              >
                                Activate
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDelete(user._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
