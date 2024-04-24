import { apiSlice } from "./apiSlice.js";

const LEADS_URL = "/api/leads";

export const leadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteTag: builder.mutation({
      query: ({ leadAccount, tagName }) => ({
        url: `${LEADS_URL}/${leadAccount}/${tagName}`,
        method: "DELETE",
      }),
    }),

    addNotes: builder.mutation({
      query: ({ leadAccount, data }) => ({
        url: `${LEADS_URL}/${leadAccount}/notes`,
        method: "POST",
        body: data,
      }),
    }),

    deleteNote: builder.mutation({
      query: ({ leadAccount, noteId }) => ({
        url: `${LEADS_URL}/${leadAccount}/notes/${noteId}`,
        method: "DELETE",
      }),
    }),

    addTasks: builder.mutation({
      query: ({ leadAccount, data }) => ({
        url: `${LEADS_URL}/${leadAccount}/tasks`,
        method: "POST",
        body: data,
      }),
    }),

    getTasks: builder.query({
      query: (leadAccount) => ({
        url: `${LEADS_URL}/${leadAccount}/tasks`,
        method: "GET",
      }),
    }),

    deleteTask: builder.mutation({
      query: ({ leadAccount, taskId }) => ({
        url: `${LEADS_URL}/${leadAccount}/tasks/${taskId}`,
        method: "DELETE",
      })
    })
  }),
});

export const {
  useDeleteTagMutation,
  useAddNotesMutation,
  useDeleteNoteMutation,
  useAddTasksMutation,
  useGetTasksQuery,
  useDeleteTaskMutation
} = leadsApiSlice;
