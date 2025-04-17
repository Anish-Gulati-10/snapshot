"use client";
import React, { useState, useEffect } from "react";
import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HeartCrack, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addToCart } from "@/firebase/addToCart";
import { Skeleton } from "@/components/ui/skeleton";
import { onAuthStateChanged } from "firebase/auth";

const Page = () => {
  const [wishlist, setWishlist] = useState(null); // null = loading
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.warn("No user signed in");
        toast.error("Please sign in to view your wish list.", {
          actions: [
            {
              label: "Sign In",
              onClick: () => router.push("/signin"),
            },
          ],
        });
        setWishlist([]);
        return;
      }

      try {
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData && userData.wishlist) {
          setWishlist(userData.wishlist);
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Failed to fetch your wishlist.");
        setWishlist([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const removeFromWishlist = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const updatedWishlist = userData.wishlist.filter(
        (item) => item.id !== product.id
      );

      await updateDoc(userRef, {
        wishlist: updatedWishlist,
      });

      setWishlist(updatedWishlist);
      toast.success("Product removed from wishlist.");
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      toast.error("Failed to remove product from wishlist.");
    }
  };

  const checkIfInCart = async (product) => {
    const user = auth.currentUser;
    if (!user) return false;

    const userRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();

    return userData.cart?.some((item) => item.id === product.id);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (wishlist === null) {
    return (
      <section className="p-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 mt-2">
          <Skeleton className={"w-[200px] h-9 dark:bg-gray-100/50"} />
        </h1>
        <div className="grid grid-cols-1 md:gap-6 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="mb-4 dark:bg-gray-100/50 w-full h-[180px]" />
          ))}
        </div>
      </section>
    );
  }

  if (wishlist.length === 0) {
    return (
      <section className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 gap-3">
        <HeartCrack className="h-36 w-36 text-red-500" />
        <p className="text-2xl font-medium">Your wishlist is empty</p>
        <Link href="/">
          <Button className="text-white">Go to Products</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="p-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 mt-2">Your Wishlist</h1>
      <div className="grid grid-cols-1 md:gap-6 gap-3">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center gap-8 text-black">
            <img
              src={product.image}
              alt={product.title}
              className="w-[120px] h-auto object-cover mb-4 mx-auto"
            />
            <div className="flex-1 flex flex-col gap-8">
              <div className="flex md:items-center md:justify-between md:flex-row flex-col gap-2">
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-xl font-bold">${product.price}</p>
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  className={"text-red-500 hover:text-red-700"}
                  onClick={() => removeFromWishlist(product)}>
                  <Trash className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="text-white w-full md:w-auto">
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 md:text-right">
        <Link href="/cart" passHref>
          <Button className="mt-4 w-full md:w-auto text-white">Go to Cart</Button>
        </Link>
      </div>
    </section>
  );
};

export default Page;
