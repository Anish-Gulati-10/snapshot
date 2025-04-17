"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { auth } from "@/firebase/firebase";
import { Heart, User, LogOut, ShoppingBasket, HamIcon, Cross, Menu, X } from "lucide-react"; // icons for cart, wishlist, profile, logout

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // To toggle the mobile menu

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogOut = () => {
    auth.signOut();
    setUser(null); // Clear user state after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="flex items-center justify-between p-5 h-20 text-[var(--navbar-foreground)] border-b border-gray-200 dark:border-gray-700 shadow-sm bg-gradient-to-b from-primary/20 to-white dark:to-transparent ">
      <Link href="/" className="text-2xl font-bold text-primary">
        SnapShop
      </Link>

      {/* Desktop Navbar (visible on large screens) */}
      <div className="hidden md:flex items-center gap-4 dark:!text-white">
        {user ? (
          <>
            <Link href="/cart">
              <Button variant="link" className={"dark:text-white"}>
                <ShoppingBasket className="h-5 w-5" />
                <span className="ml-2">Cart</span>
              </Button>
            </Link>
            <Link href="/wishlist">
              <Button variant="link" className={"dark:text-white"}>
                <Heart className="h-5 w-5" />
                <span className="ml-2">Wishlist</span>
              </Button>
            </Link>
            <Link href="/user">
              <Button variant="link" className={"dark:text-white"}>
                <User className="h-5 w-5" />
                <span className="ml-2">Profile</span>
              </Button>
            </Link>
            <Button onClick={handleLogOut} className={"text-white"}>
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Log Out</span>
            </Button>
          </>
        ) : (
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>

      {/* Mobile Navbar (hamburger menu visible on small screens) */}
      <div className="md:hidden flex items-center">
        <Button variant="link" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
        </Button>
      </div>

      {/* Mobile Menu (hamburger dropdown) */}
      {isMenuOpen && (
        <div className="absolute top-20 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-full md:hidden">
          {user ? (
            <>
              <Link href="/cart">
                <Button
                  variant="link"
                  className="w-full flex items-center gap-2">
                  <ShoppingBasket className="h-5 w-5" />
                  <span>Cart</span>
                </Button>
              </Link>
              <Link href="/wishlist">
                <Button
                  variant="link"
                  className="w-full flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </Button>
              </Link>
              <Link href="/user">
                <Button
                  variant="link"
                  className="w-full flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Button>
              </Link>
              <Button
                variant="link"
                className="w-full flex items-center gap-2"
                onClick={handleLogOut}>
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </Button>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button className="w-full">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
