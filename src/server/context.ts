import { db } from "../db";
import { auth } from "../lib/auth";
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
