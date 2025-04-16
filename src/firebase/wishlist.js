import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

/**
 * Adds a product to the user's wishlist in Firestore
 * @param {Object} product - The product to be added to the wishlist
 */
const addToWishlist = async (product) => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Please sign in to add items to your wishlist.");
    return;
  }

  const userRef = doc(firestore, "users", user.uid);

  try {
    // Get the current wishlist from Firestore
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      toast.error("User not found in the database.");
      return;
    }

    const userData = userDoc.data();
    const currentWishlist = userData.wishlist || [];

    currentWishlist.push(product); // Add the product to the wishlist

    await updateDoc(userRef,{
      wishlist: currentWishlist,
    })

    toast.success("Product added to wishlist!", {
      description: "You can view it in your wishlist.",
    });
   
  } catch (error) {
    console.error("Error adding product to cart:", error);
    toast.error("Failed to add product to cart. Please try again.");
  }
};


/**
 * Removes a product from the user's wishlist in Firestore
 * @param {Object} product - The product to be removes from the wishlist
 */
const removeFromWishlist = async (product) => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Please sign in to remove items from your wishlist.");
    return;
  }

  const userRef = doc(firestore, "users", user.uid);

  try {
    // Get the current wishlist from Firestore
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      toast.error("User not found in the database.");
      return;
    }

    const userData = userDoc.data();
    const currentWishlist = userData.wishlist || [];

    // Remove the product from the wishlist
    const updatedWishlist = currentWishlist.filter((item) => item.id !== product.id);

    await updateDoc(userRef, {
      wishlist: updatedWishlist,
    });

    toast.success("Product removed from your wishlist!");
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    toast.error("Failed to remove product from wishlist. Please try again.");
  }
}


/**
 * Checks if a product is in the user's wishlist
 * @param {Object} product - The product to check
 * @return {boolean} - True if the product is in the wishlist, false otherwise
 */
const checkWishlist = async (product) => {
  const user = auth.currentUser;
  if (!user) {
    return false;
  }

  const userRef = doc(firestore, "users", user.uid);
  try {
    // Get the current wishlist from Firestore
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      toast.error("User not found in the database.", {description:"Please sign in again."});
      return false;
    }
    const userData = userDoc.data();
    const currentWishlist = userData.wishlist || [];
    const productInWishlist = currentWishlist.find((item) => item.id === product.id);
    return productInWishlist;
  } catch (error) {
    return false;
  }
}

export { addToWishlist, removeFromWishlist, checkWishlist };
