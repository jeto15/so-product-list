import type { NextApiRequest, NextApiResponse } from "next";
import {pool} from "../../lib/db"; // adjust if default or named export

interface Product {
  Id: number;
  product_code: string;
  product_details: string;
  product_category: string;
  product_price: number;
  product_cpt_price: number;
  product_ws_price: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | { error: string }>
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const search = (req.query.q as string) || "";
  const normalizedSearch = search.trim().toLowerCase();

  try {
    const [rows] = await pool.query<Product[] & import("mysql2").RowDataPacket[]>(
      `SELECT Id, product_code, product_details, product_category, product_price, product_cpt_price, product_ws_price
       FROM products
       WHERE LOWER(product_details) LIKE ?
       ORDER BY created_at DESC
       LIMIT 20`,
      [`%${normalizedSearch}%`]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Products API error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
