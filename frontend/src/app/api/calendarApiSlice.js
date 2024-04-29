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

    updateTaskDetails: builder.mutation({
      query: ({taskId, completed}) => ({
        url: `${USERS_URL}/tasks/update`,
        method: "PUT",
        body: {taskId, completed}
      }),
    }),

    deleteTaskDetails: builder.mutation({
      query: ({taskId}) => ({
        url: `${USERS_URL}/tasks/delete`,
        method: "DELETE",
        body: {taskId}
      }),
    }),
    
    
    updateTasks: builder.mutation({
      query: ({ data }) => ({
        url: `${USERS_URL}/tasks/update-by-id`,
        method: "PUT",
        body: data,
      }),
    }),

  }),
});

export const { useGetUserTasksQuery, useGetDateTasksQuery, useGetLeadDetailsQuery, useUpdateTaskDetailsMutation, useDeleteTaskDetailsMutation, useUpdateTasksMutation} = calendarApiSlice;
