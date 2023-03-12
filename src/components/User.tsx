import { useParams } from "react-router-dom";
import React from "react";
import { trpc } from "../trpc";

export const User = () => {
  const { userId } = useParams();
  const { data: user } = trpc.userById.useQuery(Number(userId));
  //const user = { id, name: "John Doe" };
  return <div>Hello {user?.name}</div>;
};
