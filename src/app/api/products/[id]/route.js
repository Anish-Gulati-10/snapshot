import axios from "axios";

export async function GET(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // Get product ID from URL

  try {
    // Fetch product details from the Fake Store API by ID
    const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error(`Error fetching product with ID: ${id}`, error);
    return new Response(JSON.stringify({ message: "Error fetching product details" }), { status: 500 });
  }
}
