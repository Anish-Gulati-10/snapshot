import { toast } from "sonner";
import { firestore } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Function to save user data in Firestore
 * @param {Object} user - Firebase user object from either Google or email/password signup
 * @param {string} firstName - First name of the user (for email/password sign-up)
 * @param {string} lastName - Last name of the user (for email/password sign-up)
 */
export const saveUserToDB = async (user, firstName = "User", lastName = "") => {
  try {
    // Create a reference to the user's document in Firestore
    const userRef = doc(firestore, "users", user.uid);

    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log("User already exists in Firestore.");
      return;
    }

    // Check if firstName and lastName are provided (for email/password sign-up)
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      createdAt: new Date(),
      wishlist: [],
      cart: [],
      orderHistory: [],
    };

    // Store user data in Firestore
    await setDoc(userRef, userData);

    /* toast.success("User data saved successfully!", {
      description: "User data has been saved to Firestore.",
      duration: 2000,
    }); */
  } catch (error) {
    console.log("Error saving user data: ", error.message);
  }
};