import { db } from "../src/db/index.js";
import { auth } from "../src/lib/auth.js";
import type { Context } from "hono";

export const createContext = async (c: Context) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  return {
    db,
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
};

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;
