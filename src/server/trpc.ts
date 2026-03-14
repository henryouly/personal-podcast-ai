import { initTRPC, TRPCError } from "@trpc/server";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure.
 */
const isAuthed = t.middleware(({ next, ctx }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            user: ctx.user,
            session: ctx.session,
        },
    });
});

export const protectedProcedure = t.procedure.use(isAuthed);
