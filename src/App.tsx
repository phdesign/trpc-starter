import React from "react";
import { TrpcProvider } from "./context/trpc";
import { User } from "./components/User";

export const App = () => {
  return (
    <TrpcProvider>
      <User id={1} />
    </TrpcProvider>
  );
};
