import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({}), // endpoints are on the features folder
});
