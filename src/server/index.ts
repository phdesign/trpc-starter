import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import * as express from "express";
import * as cors from "cors";

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;

const userList = [
  {
    id: 1,
    name: "John",
  },
];

const appRouter = t.router({
  userById: publicProcedure
    .input((val: unknown) => {
      if (typeof val !== "number") {
        throw new Error("not a number");
      }
      return val;
    })
    .query(({ input }) => {
      const user = userList.find((user) => user.id === input);
      return user;
    }),
  createUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      const user = {
        id: userList.length + 1,
        name: input.name,
      };
      userList.push(user);
      return user;
    }),
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(cors());
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(3000, () =>
  console.error("server listening on http://localhost:3000/trpc")
);
