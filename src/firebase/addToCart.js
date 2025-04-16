import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

/**
 * Adds a product to the user's cart in Firestore
 * @param {Object} product - The product to be added to the cart
 */
const addToCart = async (product) => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Please sign in to add items to your cart.");
    return;
  }

  const userRef = doc(firestore, "users", user.uid);

  try {
    // Get the current cart from Firestore
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      toast.error("User not found in the database.");
      return;
    }

    const userData = userDoc.data();
    const currentCart = userData.cart || [];

    // Check if the product already exists in the cart
    const productIndex = currentCart.findIndex((item) => item.id === product.id);

    if (productIndex !== -1) {
      // If product exists, increment its quantity
      currentCart[productIndex].qty = (currentCart[productIndex].qty || 1) + 1;
      
      // Update the cart with the modified product (replace the old product with updated one)
      await updateDoc(userRef, {
        cart: currentCart,
      });

      toast.success("Product already in cart. Quantity updated.");
    } else {
      // If product does not exist, add it to the cart with quantity 1
      product.qty = 1; // Add product with quantity 1
      currentCart.push(product);

      // Update the cart with the new product
      await updateDoc(userRef, {
        cart: currentCart,
      });

      toast.success("Product added to cart!", {
        description: "You can view it in your cart.",
      });
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    toast.error("Failed to add product to cart. Please try again.");
  }
};


/**
 * Checks if a product is already in the user's cart in Firestore
 * @param {Object} product - The product to check in the cart
 * @returns {boolean} - True if the product is in the cart, false otherwise
 */
const checkCart = async (product) => {
  const user = auth.currentUser;
  if (!user) {
    return false;
  }

  const userRef = doc(firestore, "users", user.uid);

  try {
    // Get the current cart from Firestore
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      toast.error("User not found in the database.", {description:"Please sign in again."});
      return false;
    }

    const userData = userDoc.data();
    const currentCart = userData.cart || [];
    const productInCart = currentCart.find((item) => item.id === product.id);
    return productInCart;
  } catch (error) {
    return false;
  }
}


export  {addToCart, checkCart};
