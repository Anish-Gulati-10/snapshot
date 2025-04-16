import axios from "axios";

export async function GET(request) {
  // Get category from URL path
  const { pathname } = new URL(request.url);
  const category = pathname.split('/').pop(); // Extract category from URL path

  try {
    if (category === "all") {
      const response = await axios.get("https://fakestoreapi.com/products");
      return new Response(JSON.stringify(response.data), { status: 200 });
    }
    const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error(`Error fetching products for category: ${category}`, error);
    return new Response(JSON.stringify({ message: "Error fetching products by category" }), { status: 500 });
  }
}
