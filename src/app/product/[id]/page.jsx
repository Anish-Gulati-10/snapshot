"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";
import { addToCart, checkCart } from "@/firebase/addToCart";
import {
  addToWishlist,
  checkWishlist,
  removeFromWishlist,
} from "@/firebase/wishlist";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const Page = ({ params }) => {
  const { id } = React.use(params); // Fetching the product ID from the URL parameters
  const [product, setProduct] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`); // Using the dynamic API route
        const data = res.data;
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  useEffect(() => {
    setIsInWishlist(checkWishlist(product));
    setIsInCart(checkCart(product));
  }, [product]);

  const handleWishlistClick = () => {
    if (isInWishlist) {
      removeFromWishlist(product);
      setIsInWishlist(false);
    } else {
      addToWishlist(product);
      setIsInWishlist(true);
    }
  };

  if (!product) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="ease-linear rounded-full border-4 border-t-gray-200 border-gray-600 h-20 w-20 animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex md:flex-row flex-col items-center justify-center p-4 md:gap-8 gap-4 max-w-[1680px] mx-auto">
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-[500px] h-[500px] object-contain"
        />
      </div>

      <div className="flex flex-col gap-4 max-w-96 md:h-[500px] h-auto">
        <h1 className="text-4xl font-bold">{product.title}</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Star /> {product.rating.rate} ({product.rating.count})
        </p>
        <p className="text-xl font-semibold">Price: ${product.price}</p>
        <p className="text-lg">{product.description}</p>
        <div className="mt-auto flex gap-2">
          <Button
            onClick={handleWishlistClick}
            className="text-white"
            variant="outline">
            {isInWishlist ? (
              <Heart strokeWidth={1.25} fill="red" />
            ) : (
              <Heart strokeWidth={1.25} className="text-foreground" />
            )}
          </Button>
          {/* Cart Button */}
          {isInCart ? (
            <Link href="/cart" className="flex-1">
              <Button className="text-white w-full">Go to Cart</Button>
            </Link>
          ) : (
            <Button
              className="text-white flex-1"
              onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
