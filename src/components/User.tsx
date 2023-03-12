import React from "react";
import { trpc } from "../trpc";

export type UserProps = {
  id: number;
};

export const User = ({ id }: UserProps) => {
  const user = trpc.userById.useQuery(id);
  //const user = { id, name: "John Doe" };
  return <div>Hello {user.name}</div>;
};
