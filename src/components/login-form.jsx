"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, googleProvider } from "@/firebase/firebase";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  SignInMethod,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "sonner";
import { saveUserToDB } from "@/firebase/saveUserToDB";
import { useRouter } from "next/navigation";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false); // To track if process is ongoing
  const [isUserFound, setIsUserFound] = useState(false); // To track if the user exists
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter()


  const handleContinue = async (e) => {
    e.preventDefault();
    try {
      const user = await fetchSignInMethodsForEmail(auth, email);
      if (user[0] === SignInMethod.GOOGLE) {
        toast.error("This email is already registered with Google. Please sign in with Google.");
        return;
      }
      if (user.length > 0) {
        setIsUserFound(true);
        setIsSignUp(false);
      } else {
        setIsUserFound(false); // User doesn't exist
        setIsSignUp(true); // Switch to sign-up
      }
    } catch (error) {
      toast.error("Error fetching user: " + error.message);
      console.error("Error fetching user:", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const [firstName, lastName] = user.displayName?.split(" ") || ["User", ""];
      await saveUserToDB(user, firstName, lastName)
      toast.success("Signed in successfully with Google!");
    } catch (error) {
      toast.error("Error signing in with Google",{
        description: "Please check your internet connection and try again.",
        descriptionClassName: "text-black",
        action:{
          text: "Retry",
          onClick: () => {
            signInWithGoogle();
          },
          altText: "Retry",
        }
      })
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
      router.push("/");
    }
  };

  const signUpWithEmail = async (email, password) => {
      try {
        setLoading(true);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await saveUserToDB(user, name, lastName);
        toast.success("Account created successfully!");
      } catch (error) {
        toast.error("Error creating account", {
          description: "Please check your internet connection and try again.",
          descriptionClassName: "text-black",
        })
        console.error("Error creating account:", error);
      } finally {
        setLoading(false);
        router.push("/");
      }
    };

  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
        setPassword("");
        return
      }
      console.error(error.message);
    } finally {
      setLoading(false);
      router.push("/");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      signUpWithEmail(email, password);
    } else {
      signInWithEmail(email, password);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            {isSignUp
              ? "Create Account"
              : isUserFound
              ? "Sign in"
              : "Sign in or create account"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Enter your details to create a new account"
              : isUserFound
              ? " "
              : "Enter your email below"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!(isUserFound || isSignUp) ? (
            <form onSubmit={handleContinue}>
              <div className="flex flex-col gap-4">
                  <Input
                    id="email"
                    type="email"
                    placeholder="snapshop@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />

                <Button type="submit" className={`w-full`} disabled={loading}>
                  {loading ? "Loading..." : "Continue"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={signInWithGoogle}
                  disabled={loading}>
                  Continue with Google
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4">
              {isUserFound ? (
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="snapshop@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={true}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <div className="grid gap-2 flex-1">
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Harvey"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      required
                    />
                    </div>
                    <div className="grid gap-2 flex-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Spectar"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                      required
                    />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="snapshop@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={true}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              )}
              <Button type="submit" className={`w-full`} disabled={loading}>
                  {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign in"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={signInWithGoogle}
                  disabled={loading}>
                  Continue with Google
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
