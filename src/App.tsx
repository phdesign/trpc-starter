import React from "react";
import { TrpcProvider } from "./context/trpc";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { User } from "./components/User";
import { Form } from "./components/Form";

export const App = () => {
  return (
    <React.StrictMode>
      <TrpcProvider>
        <BrowserRouter>
          <Routes>
            <Route path=":userId" element={<User />} />
            <Route path="/" element={<Form />} />
          </Routes>
        </BrowserRouter>
      </TrpcProvider>
    </React.StrictMode>
  );
};
