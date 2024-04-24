import { apiSlice } from "./apiSlice.js";

const USERS_URL = "/auth";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.query({
      query: () => ({
        url: `${USERS_URL}/login/success`,
        method: "GET",
      }),
      transformResponse: (response) => response.user,
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "GET",
      }),
    }),

    sendEmail: builder.mutation({
      query: (data) => ({
        url: `send-email`,
        method: "POST",
        body: data,
      }),
    }),

    receiveEmail: builder.mutation({
      query: (data) => ({
        url: `read-emails`,
        method: "GET",
        body: data,
      }),
    }),


  }),
});

export const {
  useLoginQuery,
  useLogoutMutation,
  useSendEmailMutation,
  useReceiveEmailMutation,
} = usersApiSlice;
