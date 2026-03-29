import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../api/routers/_app.js";

export const trpc = createTRPCReact<AppRouter>();
