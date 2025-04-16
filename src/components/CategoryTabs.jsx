import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gem, Mars, PlugZap, Store, Venus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import Link from "next/link";
import { addToCart } from "@/firebase/addToCart";

const categories = [
  { name: "all", icon: <Store strokeWidth={1.25} /> },
  { name: "electronics", icon: <PlugZap strokeWidth={1.25} /> },
  { name: "jewelery", icon: <Gem strokeWidth={1.25} /> },
  { name: "men's clothing", icon: <Mars strokeWidth={1.25} /> },
  { name: "women's clothing", icon: <Venus strokeWidth={1.25} /> },
];

const CategoryTabs = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategoryProducts = async (category) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/category/${category}`);
      const data = await res.json();
      console.log(data);
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products. Please try again later.");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProducts(categories[0].name);
  }, []);

  return (
    <section className="w-full mt-6" id="category-tabs">
      <h1 className="text-3xl font-bold mb-8 text-center">
        All the Good Stuff, Sorted
      </h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex gap-4 justify-center mb-6 w-full flex-wrap">
          {categories.map((category) => (
            <TabsTrigger
              key={category.name}
              value={category.name}
              onClick={() => fetchCategoryProducts(category.name)}
              className="flex items-center space-x-2">
              <div className="text-xl">{category.icon}</div>
              <span className="hidden sm:inline">
                {category.name.toUpperCase()}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.name} value={category.name}>
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-6 gap-3">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-[#f4f8ff] shadow-md rounded-lg p-4">
                    {/* Skeleton for image */}
                    <Skeleton className="w-full h-80 mb-4" />
                    {/* Skeleton for title */}
                    <Skeleton className="w-3/4 h-6 mb-2" />
                    {/* Skeleton for price */}
                    <Skeleton className="w-1/2 h-8" />
                    {/* Skeleton for button */}
                    <Skeleton className="w-full h-10 mt-4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 md:gap-6 gap-3">
                {products.map((product) => (
                  <Link
                    href={`/product/${product.id}`}
                    key={product.id}
                    className="bg-[#f8fafe] shadow-sm rounded-lg overflow-hidden flex flex-col items-center md:p-4 p-2 text-black">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full md:h-80 object-center mb-4"
                    />
                    <h2 className="text-lg font-semibold text-center mb-4">
                      {product.title}
                    </h2>
                    <div className="flex md:flex-row flex-col justify-between items-center w-full mt-auto">
                      <p className="text-base font-bold">${product.price}</p>
                      <Button
                        onClick={() => addToCart(product)}
                        className={"md:flex hidden !text-white"}>
                        Add to Cart
                      </Button>
                    </div>
                    <Button
                      onClick={() => addToCart(product)}
                      className={"md:hidden w-full mt-2 !text-white"}>
                      Add to Cart
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default CategoryTabs;
