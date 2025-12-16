import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/secure/products?q=${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Search error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white shadow-sm rounded-md text-black">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Product Search</h1>

      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-400 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 text-black"
        />
        <button
          onClick={searchProducts}
          className="bg-blue-400 text-white px-6 py-2 rounded-r-md hover:bg-blue-500 transition"
        >
          Search
        </button>
      </div>

      {loading && (
        <p className="text-center text-gray-700 animate-pulse">Loading...</p>
      )}

      {!loading && products.length === 0 && query && (
        <p className="text-center text-gray-700">No products found</p>
      )}

      {products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-black">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Code</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Details</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left">CPT Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left">WS Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.Id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{p.Id}</td>
                  <td className="border border-gray-300 px-4 py-2">{p.product_code}</td>
                  <td className="border border-gray-300 px-4 py-2">{p.product_details}</td>
                  <td className="border border-gray-300 px-4 py-2">{p.product_category}</td>
                  <td className="border border-gray-300 px-4 py-2">₱{p.product_price}</td>
                  <td className="border border-gray-300 px-4 py-2">₱{p.product_cpt_price}</td>
                  <td className="border border-gray-300 px-4 py-2">₱{p.product_ws_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
