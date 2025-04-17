"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Label } from "@/components/ui/label"; // Assuming Label is also part of your ShadCN library
import { Skeleton } from "@/components/ui/skeleton";
import { saveOrderToHistory } from "@/firebase/placeOrder";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    upi: "",
  });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please sign in to proceed to checkout.");
        router.push("/signin");
        return;
      }

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

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0).toFixed(2);
  };

  const calculateGST = () => {
    return (calculateTotal() * 0.18).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return (parseFloat(calculateTotal()) + parseFloat(calculateGST())).toFixed(2);
  };

  const handlePlaceOrder = () => {
    if (address.name && address.street && address.city && address.state && address.zip && address.upi) {
      setPlacingOrder(true);
      saveOrderToHistory(cart);
      setTimeout(() => {
        setOrderPlaced(true);
      }, 2000); 
    } else {
      toast.error("Please fill in all the address and payment details.");
    }
  };

  if (loading) {
    return (
      <section className="flex gap-8 p-4 max-w-[1680px] mx-auto md:flex-row flex-col  mt-8">
        <Skeleton className="w-full md:w-2/5 h-96 rounded-lg" />
        <Skeleton className="w-full md:w-3/5 h-96 rounded-lg" />
      </section>
    );
  }

  if (orderPlaced) {
    return (
      <section className="flex flex-col items-center justify-center p-4 gap-6 mt-8 max-w-[1680px] mx-auto min-h-[calc(100vh-80px)]">
        <h2 className="text-3xl font-bold">Thank You for Your Order!</h2>
        <p className="text-lg text-center">
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </p>
        <Link href="/" passHref>
          <Button className="mt-4 w-auto text-white">Go to Home</Button>
        </Link>
        
      </section>
    );
  }

  return (
    <section className="flex gap-8 p-4 max-w-[1680px] mx-auto md:flex-row flex-col mt-8">
      {/* Left side: Address & UPI form */}
      <div className="w-full md:w-2/5  p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
        <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
        <form>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                type="text"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="123 Main St"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="City Name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                type="text"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="State Name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zip">Zip Code</Label>
              <Input
                id="zip"
                type="text"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                placeholder="12345"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="upi">UPI ID</Label>
              <Input
                id="upi"
                type="text"
                value={address.upi}
                onChange={(e) => setAddress({ ...address, upi: e.target.value })}
                placeholder="your-upi-id@upi"
                required
              />
            </div>
          </div>
        </form>
      </div>

      {/* Right side: Bill Summary */}
      <div className="w-full md:w-3/5  p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600">
        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

        {/* Cart items list */}
        <div className="flex flex-col gap-4 mb-6">
          {cart.map((product) => (
            <div key={product.id} className="flex justify-between items-center">
              <div className="flex gap-4">
                <img src={product.image} alt={product.title} className="w-16 h-16 object-contain" />
                <div>
                  <p className="text-lg font-semibold">{product.title}</p>
                  <p className="text-sm text-gray-500">Qty: {product.qty}</p>
                </div>
              </div>
              <p className="text-lg font-semibold">${(product.price * product.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between mb-4">
          <p className="text-lg font-semibold">Subtotal:</p>
          <p className="text-lg font-semibold">${calculateTotal()}</p>
        </div>

        {/* GST */}
        <div className="flex justify-between mb-4">
          <p className="text-lg font-semibold">GST (18%):</p>
          <p className="text-lg font-semibold">${calculateGST()}</p>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between mb-6">
          <p className="text-xl font-semibold">Grand Total:</p>
          <p className="text-xl font-semibold">${calculateGrandTotal()}</p>
        </div>

        {/* Checkout Button */}
        <Button className="w-full text-white" onClick={handlePlaceOrder} disabled={placingOrder}>
          Place Order
        </Button>
      </div>
    </section>
  );
};

export default CheckoutPage;
