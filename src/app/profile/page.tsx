"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Package,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const userDetails = useQuery(
    api.users.getUser,
    user ? { userId: user._id } : "skip"
  );
  const orders = useQuery(
    api.orders.getByUser,
    user ? { userId: user._id } : "skip"
  );

  const updateProfile = useMutation(api.users.updateProfile);
  const verifyEmail = useMutation(api.users.verifyEmail);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (userDetails) {
      setFirstName(userDetails.firstName || "");
      setLastName(userDetails.lastName || "");
      setDob(userDetails.dob || "");
    }
  }, [userDetails]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = async () => {
    if (!user || !firstName || !lastName || !dob) return;
    const age = calculateAge(dob);
    await updateProfile({
      userId: user._id,
      firstName,
      lastName,
      dob,
      age,
    });
    setIsEditing(false);
  };

  const handleVerifyEmail = async () => {
    if (!user) return;
    setVerifying(true);
    try {
      await verifyEmail({ userId: user._id, email: user.email });
    } finally {
      setVerifying(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {(userDetails?.firstName || user.email || "?")[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {userDetails?.firstName && userDetails?.lastName
                ? `${userDetails.firstName} ${userDetails.lastName}`
                : user.email}
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>
        </div>

        {/* Email Verification */}
        {userDetails && !userDetails.emailVerified && (
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">Email not verified</p>
                <p className="text-xs text-muted-foreground">
                  Verify your email to secure your account
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleVerifyEmail}
              disabled={verifying}
              className="rounded-full shrink-0"
            >
              {verifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Verify Now"
              )}
            </Button>
          </div>
        )}

        {userDetails?.emailVerified && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              Email verified
            </p>
          </div>
        )}

        {/* Personal Information */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h2>
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="rounded-full gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    First Name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-secondary/50 border-0 h-10"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Last Name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-secondary/50 border-0 h-10"
                    placeholder="Last Name"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="bg-secondary/50 border-0 h-10"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={!firstName || !lastName || !dob}
                  className="rounded-full"
                >
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">
                  {userDetails?.firstName && userDetails?.lastName
                    ? `${userDetails.firstName} ${userDetails.lastName}`
                    : "Not set"}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium flex items-center gap-1.5">
                  {user.email}
                  {userDetails?.emailVerified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                  )}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">
                  Date of Birth
                </span>
                <span className="text-sm font-medium flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {userDetails?.dob || "Not set"}
                </span>
              </div>
              {userDetails?.age && (
                <>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Age</span>
                    <span className="text-sm font-medium">
                      {userDetails.age} years
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Recent Orders
            </h2>
            {orders && orders.length > 0 && (
              <Link href="/orders">
                <Button variant="ghost" size="sm" className="rounded-full gap-1">
                  View All
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>

          {!orders && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {orders && orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No orders yet</p>
              <Link href="/shop">
                <Button variant="link" size="sm" className="mt-2">
                  Start shopping
                </Button>
              </Link>
            </div>
          )}

          {orders && orders.length > 0 && (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} •{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      ${order.total.toFixed(2)}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-500/10 text-green-600 dark:text-green-400">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account ID */}
        <div className="text-center text-xs text-muted-foreground pb-8">
          <p>Account ID: {user._id}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
