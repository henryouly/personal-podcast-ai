import { db } from "../db";
import { auth } from "../lib/auth";

export const createContext = async (req: Request) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    db,
    user: session?.user ?? null,
    session: session?.session ?? null,
  };
};

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;
