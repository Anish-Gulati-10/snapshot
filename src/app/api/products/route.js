import axios from "axios";

export async function GET() {
  try {
    // Fetch all products from the Fake Store API
    const response = await axios.get('https://fakestoreapi.com/products');
    const data = response.data;
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ message: "Error fetching products" }), { status: 500 });
  }
}
