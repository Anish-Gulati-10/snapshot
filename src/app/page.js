"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { heroSection } from "../../public/assets";
import CategoryTabs from "@/components/CategoryTabs";
import {addToCart} from "@/firebase/addToCart";

export default function Home() {
  const [trendingProducts, setTrendingProducts] = useState([]);

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        const products = response.data?.slice(0, 4);
        setTrendingProducts(products);
      } catch (error) {
        console.error("Error fetching trending products:", error);
        return [];
      }
    };
    fetchTrendingProducts();
  }, []);


  return (
    <section className="p-6 max-w-[1680px] mx-auto flex flex-col gap-6 overflow-clip">
      <div className="flex md:flex-row flex-col items-center justify-between max-w-">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">
            Welcome to <span className="text-primary">SnapShop</span>
          </h1>
          <p className="text-lg">
            Discover the latest trends and styles in our collection.
          </p>
          <Link href="#category-tabs">
            <Button variant="default" className={"text-white"}>
              Shop Now
            </Button>
          </Link>
        </div>
        <Image src={heroSection} alt="Hero Section" width={700} />
      </div>
      <div className="bg-[#d2dafc] rounded-2xl w-full shadow-sm min-h-[400px] border border-violet-200 p-6 flex lg:flex-row flex-col gap-4 items-center">
        <div className="lg:w-1/5 w-full text-primary space-y-2.5">
          <p className="font-semibold text-sm">WHAT&apos;`S HOT 🔥</p>
          <h2 className="text-2xl font-bold">
            Don&apos;`t miss out on this week&apos;`s stars
          </h2>
          <p className="text-lg">
            These are flying off the shelves — grab yours before they&apos;`re gone.
          </p>
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingProducts.map((product) => {
            return (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="bg-white flex flex-col justify-between p-2 rounded-lg shadow-md">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={200}
                  height={200}
                  loading="lazy"
                  objectFit="contain"
                  className="mx-auto max-h[200px] "
                />
                <div className="flex flex-col gap-2 text-black justify-end">
                  <h2 className="text-lg font-semibold">
                    {product.title.slice(0, 20)}
                  </h2>
                  <p className="text-gray-500">
                    {product.description.slice(0, 60)}...
                  </p>
                  <div className="flex justify-between lg:items-center lg:flex-row flex-col gap-2">
                    <p className="text-lg font-bold">${product.price}</p>
                    <Button
                      variant="outline"
                      className="hover:!bg-primary hover:!text-white text-primary !border-primary"
                      onClick={() => addToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <CategoryTabs />
    </section>
  );
}
