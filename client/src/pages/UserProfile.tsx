import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/apis/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/lib/use-toast";
import {
  Package,
  Heart,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  X,
} from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().min(10, { message: "Phone is required" }),
  address: z.string().min(5, { message: "Address is required" }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Enter current password" }),
  newPassword: z.string().min(6, { message: "New password must be 6+ chars" }),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ORIGINAL mockUser had a full name string; we extract parts for firstName/lastName/username
const baseMockUser = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+254 712 345 678",
  address: "Nairobi, Kenya",
  avatar: "/avatar.jpg",
  joinDate: "March 2024",
};

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  const username =
    (firstName + (lastName ? "." + lastName.split(" ")[0] : "")).toLowerCase().replace(/\s+/g, "");
  return { firstName, lastName, username };
}

export default function UserProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(baseMockUser.avatar);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // derive initial firstName/lastName/username from baseMockUser.name
  const nameParts = splitName(baseMockUser.name);

  // maintain local user state so UI updates after successful profile update
  const [user, setUser] = useState({
    id: baseMockUser.id,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    username: nameParts.username,
    email: baseMockUser.email,
    phone: baseMockUser.phone,
    address: baseMockUser.address,
    avatar: baseMockUser.avatar,
    joinDate: baseMockUser.joinDate,
  });

  // --- Profile Form (react-hook-form using the split fields) ---
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetProfileForm,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
    },
  });

  // --- Password Form ---
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // --- Mutations ---
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => axiosInstance.put("/api/user/profile", data),
    onSuccess: (res) => {
      // If backend returns updated user, prefer that; otherwise update local state from submitted data
      const responseData = (res && (res.data ?? res)) as any;
      const updated = responseData?.user ?? null;

      if (updated) {
        // If backend returns user object
        const firstName = updated.firstName ?? updated.name?.split(" ")[0] ?? user.firstName;
        const lastName =
          updated.lastName ??
          (updated.name ? updated.name.split(" ").slice(1).join(" ") : user.lastName);
        const username = updated.username ?? user.username;

        setUser((prev) => ({
          ...prev,
          firstName,
          lastName,
          username,
          email: updated.email ?? prev.email,
          phone: updated.phone ?? prev.phone,
          address: updated.address ?? prev.address,
        }));
      } else {
        // fallback: update from form values stored in mutation variables
        // react-query does not give them here, so just keep UI optimistic by resetting form defaults below
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      // Reset form defaults to reflect updated user
      resetProfileForm({
        firstName: updated?.firstName ?? undefined,
        lastName: updated?.lastName ?? undefined,
        username: updated?.username ?? undefined,
        email: updated?.email ?? undefined,
        phone: updated?.phone ?? undefined,
        address: updated?.address ?? undefined,
      });
    },
    onError: (_err) => {
      toast.error("Failed to update profile. Try again.");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordFormData) => axiosInstance.post("/api/user/change-password", data),
    onSuccess: () => {
      toast.success("Password updated successfully!");
      resetPasswordForm();
      setShowPasswordModal(false);
    },
    onError: () => {
      toast.error("Password update failed.");
    },
  });

  // --- Handlers ---
  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setAvatarUrl(result);
      setUser((prev) => ({ ...prev, avatar: result }));
      toast.success("Profile picture updated!");
      // TODO: Upload to backend (multipart/form-data) if desired
    };
    reader.readAsDataURL(file);
  };

  const onSubmitProfile = (data: ProfileFormData) => {
    // send firstName, lastName, username, email, phone, address to backend
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      address: data.address,
    };
    // Optimistically update local state (so UI updates immediately)
    setUser((prev) => ({ ...prev, ...payload }));
    updateProfileMutation.mutate(payload);
  };

  const onSubmitPassword = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  // compute display full name from state
  const displayName = `${user.firstName}${user.lastName ? " " + user.lastName : ""}`;
  const avatarInitials = `${(user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")}`.toUpperCase();

  return (
    <div className="min-h-screen bg-background py-8 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and view orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Avatar */}
          <div className="lg:col-span-1">
            <Card className="border-border">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block">
                  <Avatar className="h-32 w-32 mx-auto mb-4 ring-4 ring-background">
                    <AvatarImage src={user.avatar ?? avatarUrl} />
                    <AvatarFallback className="text-3xl bg-primary/10">
                      {avatarInitials || "JD"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Edit Icon */}
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all"
                    title="Change profile picture"
                  >
                    <Camera className="h-4 w-4" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>

                <h2 className="text-xl font-bold">{displayName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-2">
                  Member since {user.joinDate}
                </Badge>

                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <Lock className="h-4 w-4 mr-2" /> Change Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right column: Info + Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="h-4 w-4 mr-2" />
                  Orders
                </TabsTrigger>
                <TabsTrigger value="saved">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Personal Information</CardTitle>
                      <Button
                        variant={isEditing ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setIsEditing((s) => {
                            const next = !s;
                            if (next) {
                              // when entering edit mode, reset form to current user state
                              resetProfileForm({
                                firstName: user.firstName,
                                lastName: user.lastName,
                                username: user.username,
                                email: user.email,
                                phone: user.phone,
                                address: user.address,
                              });
                            }
                            return next;
                          });
                        }}
                      >
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...register("firstName")} />
                            {errors.firstName && (
                              <p className="text-sm text-destructive">{errors.firstName.message}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register("lastName")} />
                            {errors.lastName && (
                              <p className="text-sm text-destructive">{errors.lastName.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input id="username" {...register("username")} />
                          {errors.username && (
                            <p className="text-sm text-destructive">{errors.username.message}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} />
                            {errors.email && (
                              <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" {...register("phone")} />
                            {errors.phone && (
                              <p className="text-sm text-destructive">{errors.phone.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" {...register("address")} />
                          {errors.address && (
                            <p className="text-sm text-destructive">{errors.address.message}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{displayName}</p>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground">Username</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{user.email}</p>
                            <p className="text-sm text-muted-foreground">Email Address</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{user.phone}</p>
                            <p className="text-sm text-muted-foreground">Phone Number</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{user.address}</p>
                            <p className="text-sm text-muted-foreground">Shipping Address</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders and Saved tabs kept minimal (mock data omitted here for brevity) */}
              <TabsContent value="orders">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">No orders yet.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle>Saved Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground py-8">No saved items.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* --- Change Password Modal --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPasswordModal(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2" /> Change Password
            </h2>

            <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...registerPassword("newPassword")} />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={changePasswordMutation.isPending}>
                {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
