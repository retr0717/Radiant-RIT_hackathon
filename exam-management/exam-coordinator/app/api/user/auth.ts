import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma"; // Import Prisma client

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    await loginUserHandler(req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function loginUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid inputs" });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Exclude password from response
    const userWithoutPassword = exclude(user, ["password"]);

    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Function to exclude fields from an object
function exclude<T, Key extends keyof T>(user: T, keys: Key[]): Omit<T, Key> {
  const userCopy = { ...user };
  keys.forEach((key) => delete userCopy[key]);
  return userCopy;
}