import { cookies } from "next/headers";
import { getAllStores } from "./data";

export interface User {
  id: string;
  name: string;
  email: string;
}

import prisma from "@/lib/prisma";

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  
  if (!userId) return null;
  
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  return user;
}

export async function login(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("userId", userId, { path: "/" });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}

export async function getUserStore() {
  const user = await getSession();
  if (!user) return null;
  
  const stores = await getAllStores();
  return stores.find(s => s.ownerId === user.id) || null;
}
