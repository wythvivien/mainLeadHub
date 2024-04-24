import { apiSlice } from "./apiSlice.js";

const LEADS_URL = "/api/leads";

export const leadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeads: builder.query({
      query: () => ({
        url: `${LEADS_URL}`,
        method: "GET",
      }),
    }),

    createLead: builder.mutation({
      query: (data) => ({
        url: `${LEADS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    getLead: builder.query({
      query: (leadAccount) => ({
        url: `${LEADS_URL}/${leadAccount}`,
        method: "GET",
      }),
    }),

    updateLead: builder.mutation({
      query: ({ leadId, data }) => ({
        url: `${LEADS_URL}`,
        method: "PUT",
        params: { leadId },
        body: data,
      }),
    }),

    updateLeadDetails: builder.mutation({
      query: ({ leadAccount, data }) => ({
        url: `${LEADS_URL}/${leadAccount}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteLead: builder.mutation({
      query: ({ leadId }) => ({
        url: `${LEADS_URL}/delete`,
        method: "PUT",
        params: { leadId },
      }),
    }),

    updateLeadColumn: builder.mutation({
      query: ({ title, leadId }) => ({
        url: `${LEADS_URL}/card/column`,
        method: "PUT",
        params: { title, leadId },
      }),
    }),

    getLeadId: builder.query({
      query: ({ leadId }) => ({
        url: `${LEADS_URL}/card/column`,
        method: "GET",
        params: { leadId },
      }),
    }),

    listLeads: builder.query({
      query: () => ({
        url: `${LEADS_URL}/form/lists`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useCreateLeadMutation,
  useGetLeadQuery,
  useUpdateLeadDetailsMutation,
  useDeleteLeadMutation,
  useUpdateLeadColumnMutation,
  useGetLeadIdQuery,
  useUpdateLeadMutation,
  useListLeadsQuery
} = leadsApiSlice;
