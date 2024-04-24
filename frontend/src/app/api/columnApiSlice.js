import { apiSlice } from "./apiSlice.js";

const COLUMN_URL = "/api/column";

export const columnApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllColumn: builder.query({
      query: () => ({
        url: `${COLUMN_URL}`,
        method: "GET",
      }),
    }),

    createColumn: builder.mutation({
      query: (data) => ({
        url: `${COLUMN_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    updateColumn: builder.mutation({
      query: ({ title, leadId }) => ({
        url: `${COLUMN_URL}`,
        method: "PUT",
        params: { title, leadId },
      }),
    }),

    deleteColumn: builder.mutation({
      query: (columnId) => ({
        url: `${COLUMN_URL}`,
        method: "DELETE",
        params: { columnId },
      }),
    }),

    updColumnPos: builder.mutation({
      query: ({ title, position }) => ({
        url: `${COLUMN_URL}/position`,
        method: "PUT",
        body: { title, position },
      }),
    }),

    updColumnLead: builder.mutation({
      query: ({ title, leads }) => ({
        url: `${COLUMN_URL}/leads`,
        method: "PUT",
        body: { title, leads },
      }),
    }),

    listColumn: builder.query({
      query: () => ({
        url: `${COLUMN_URL}/leads`,
        method: "GET",
      }),
    }),

    setOppVal: builder.mutation({
      query: ({ leadId, oppVal }) => ({
        url: `${COLUMN_URL}/${leadId}/value`,
        method: "PUT",
        body: { oppVal },
      }),
    }),

    removeCard: builder.mutation({
      query: ({ leadId }) => ({
        url: `${COLUMN_URL}/leads`,
        method: "DELETE",
        params: {leadId}
      }),
    }),

    listLeadsColumn: builder.query({
      query: () => ({
        url: `${COLUMN_URL}/dashboard`,
        method: "GET"
      })
    })
  }),
});

export const {
  useGetAllColumnQuery,
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useUpdColumnPosMutation,
  useUpdColumnLeadMutation,
  useListColumnQuery,
  useSetOppValMutation,
  useRemoveCardMutation,
  useListLeadsColumnQuery
} = columnApiSlice;
