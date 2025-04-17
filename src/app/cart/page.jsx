"use client";
import React, { useState, useEffect } from "react";
import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { emptyCart } from "../../../public/assets";
import { Minus, Plus, Trash } from "lucide-react";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      console.log("use",user)

      try {
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData && userData.cart) {
          setCart(userData.cart);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to fetch cart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (cart.length === 0) {
    return (
      <section className="min-h-[screen-80px] flex flex-col items-center justify-center p-4 gap-3">
        <Image
          src={emptyCart}
          alt="Empty Cart"
          className="w-1/4 max-w-[400px] h-auto"
        />
        <p className="text-2xl font-medium">Your cart is empty</p>
        <p className="text-lg">Add something to make me happy</p>
        <Link href="/">
          <Button className="text-white">Go to Products</Button>
        </Link>
      </section>
    );
  }

  const updateQuantity = async (product, action) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please sign in to update cart.");
      return;
    }

    try {
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const updatedCart = userData.cart.map((item) => {
        if (item.id === product.id) {
          if (action === "increase") {
            item.qty += 1;
          } else if (action === "decrease" && item.qty > 1) {
            item.qty -= 1;
          }
        }
        return item;
      });

      // Update the cart in Firestore
      await updateDoc(userRef, {
        cart: updatedCart,
      });

      setCart(updatedCart); // Update the local state
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update cart.");
    }
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.qty, 0)
      .toFixed(2);
  };

  const removeFromCart = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      router.push("/signin");
      return;
    }

    try {
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const updatedCart = userData.cart.filter(
        (item) => item.id !== product.id
      );

      // Update the cart in Firestore
      await updateDoc(userRef, {
        cart: updatedCart,
      });

      setCart(updatedCart); // Update the local state
      toast.success("Product removed from cart.");
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error("Failed to remove product from cart.");
    }
  };

  if (loading) {
    return (
      <section className="p-4 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 mt-2">
          <Skeleton width="200px" height="30px" />
        </h1>
        <div className="grid grid-cols-1 md:gap-6 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center gap-8 text-black">
              <Skeleton width={120} height={120} className="mb-4 mx-auto" />
              <div className="flex-1 flex flex-col gap-8">
                <div className="flex md:items-center md:justify-between md:flex-row flex-col gap-2">
                  <Skeleton width="80%" height="20px" />
                  <Skeleton width="40%" height="25px" />
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton width="25px" height="25px" />
                      <Skeleton width="50px" height="25px" />
                      <Skeleton width="25px" height="25px" />
                    </div>
                  </div>
                  <Skeleton width="30px" height="30px" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 md:text-right">
          <Skeleton width="100px" height="30px" />
          <Skeleton width="150px" height="40px" />
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 mt-2">Your Cart</h1>
      <div className="grid grid-cols-1 md:gap-6 gap-3">
        {cart.map((product) => (
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
                <p className="text-xl font-bold">
                  ${product.price * product.qty}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button onClick={() => updateQuantity(product, "decrease")} className={"text-white"}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{product.qty}</span>
                    <Button onClick={() => updateQuantity(product, "increase")} className={"text-white"}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className={"text-red-500 hover:text-red-700"}
                  onClick={() => removeFromCart(product)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 md:text-right">
        <p className="text-2xl font-bold">Total: ${calculateTotal()}</p>
        <Link href="/checkout" passHref>
          <Button className="mt-4 w-full md:w-auto text-white">Proceed to Checkout</Button>
        </Link>
      </div>
    </section>
  );
};

export default CartPage;
