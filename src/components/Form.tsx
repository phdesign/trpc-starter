import React from "react";
import { trpc } from "../trpc";

export const Form = () => {
  const [name, setName] = React.useState("");
  const createUser = trpc.createUser.useMutation();

  const handleSubmit = (e: React.FormEvent) => {
    createUser.mutate({ name });
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 200,
          gap: 10,
        }}
      >
        {createUser.isLoading && <div>Creating user...</div>}
        {createUser.error && <div>Error: {createUser.error.message}</div>}
        {createUser.isSuccess && <div>User {createUser.data?.id} created!</div>}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
};
