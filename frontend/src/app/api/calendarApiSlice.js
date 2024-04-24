import { apiSlice } from "./apiSlice.js";

const USERS_URL = "/auth";

export const calendarApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserTasks: builder.query({
      query: () => ({
        url: `${USERS_URL}/tasks`,
        method: "GET",
      }),
    }),

    getDateTasks: builder.query({
      query: (date) => ({
        url: `${USERS_URL}/tasks/date`,
        method: "GET",
        params: { date },
      }),
    }),

    getLeadDetails: builder.query({
      query: ( lead ) => ({
        url: `${USERS_URL}/tasks/lead`,
        method: "GET",
        params: { lead },
      }),
    }),
  }),
});

export const { useGetUserTasksQuery, useGetDateTasksQuery, useGetLeadDetailsQuery } = calendarApiSlice;
