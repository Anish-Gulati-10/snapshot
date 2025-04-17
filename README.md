# SnapShop E-Commerce

SnapShop is a demo e-commerce application that allows users to browse products, add them to the cart, and place orders. The application is built with **Next.js**, **Firebase Authentication**, and **Firestore** for data storage.

## Features

- **User Authentication**: 
  - Sign in with **Email & Password** or **Google**.
- **Product Browsing**:
  - View all products on the homepage.
  - View individual product details on product pages.
- **Cart Management**:
  - Add products to the cart from both the homepage and the product page.
  - Edit product quantity directly in the cart.
  - Increment product quantity by 1 when the "Add to Cart" button is clicked multiple times.
- **Wishlist**:
  - Add or remove products from the wishlist.
- **Checkout**:
  - Provide shipping details and UPI for payment during checkout.
  - Place an order and see it in your **Order History** in the profile.

---

## Prerequisites

1. **Node.js**: Make sure you have **Node.js** installed (version 16.x.x or higher).
2. **Firebase Account**: You need a Firebase project with **Firestore** and **Authentication** set up.

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/snapshop.git
cd snapshop
```

### 2. Install Dependencies
Run the following command to install the required dependencies:
```bash
npm install
```

### 3. Setup Firebase
#### Create Firebase Project: Go to Firebase Console, create a project, and set up Firestore and Authentication.

#### Enable Authentication:
In Firebase Console, navigate to Authentication > Sign-in method.
Enable Email/Password and Google sign-in methods.

#### Firestore Setup: Create a collection called users in Firestore where user data and cart will be stored.

### 4. Configure Firebase in Your Project
Create a `.env.local` file at the root of your project and add your Firebase config variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```
Replace the placeholders with your actual Firebase configuration details. You can find these in the Firebase Console under Project settings > General > Your apps.

### Run the Project
To start the development server:
```bash
npm run dev
```
This will run the project on http://localhost:3000.

## Application Flow
### Authentication

#### 1. Sign Up / Sign In:
 - Users can sign up using Email/Password or Google sign-in methods.
 - Once signed in, users will be redirected to the homepage.

#### 2. Browsing Products
- Users can view all available products on the homepage.

- Users can click on a product to view its details on the Product Page.

#### 3. Cart Management
- Adding Products: Users can add products to their cart from both the Homepage and the Product Page.

- Quantity Editing: Users can edit the quantity of products directly in the Cart Page.

#### 4. Wishlist
- Users can add or remove products from their Wishlist.

#### 5. Checkout
- On the Checkout Page, users will be asked to provide shipping details (address, UPI ID, etc.).

- After placing the order, the order will be saved to the user's Order History.

#### 6. Order History
- Once the order is placed, it will appear in the Order History section of the user's profile.

## Firebase Functions in the Project
### Authentication:
- Used for user sign-in using either Email/Password or Google.

### Firestore:

- Stores user data (including cart, wishlist, and order history).

- The cart and order history are stored in Firestore to persist data across sessions.

- Each user’s orderHistory is an array where all their past orders are saved.