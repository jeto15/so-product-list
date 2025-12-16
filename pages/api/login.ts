import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import type { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // ✅ Cast rows as User[]
    const [rows] = await pool.query<User[]>(
      "SELECT id, email, password FROM users WHERE email = ?",
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.setHeader(
      "Set-Cookie",
      serialize("auth_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      })
    );

    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("Login API error:", err);
    return res.status(500).json({ message: "Server error", error: (err as Error).message });
  }
}
