import { toast } from "sonner";
import { auth, firestore } from "./firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

/**
 * Function to save the cart to the user's order history with a timestamp
 * @param {Object[]} cart - The cart array with product details
 */
export const saveOrderToHistory = async (cart) => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Please sign in to place an order.");
    return;
  }

  try {
    // Get the user's reference from Firestore
    const userRef = doc(firestore, "users", user.uid);

    // Fetch user data from Firestore
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      toast.error("User not found in the database.");
      return;
    }

    // Prepare the order object with cart and timestamp
    const order = {
      orderID: Date.now(), // Unique order ID based on timestamp
      items: cart,
      timestamp: new Date(),
    };

    // Add the order to the user's orderHistory array
    await updateDoc(userRef, {
      cart: [], // Clear the cart after placing the order
      orderHistory: arrayUnion(order),
    });
    toast.success("Order placed successfully!");
  } catch (error) {
    console.error("Error saving order to history:", error);
    toast.error("Failed to save order. Please try again.");
  }
};
