import { apiSlice } from "./apiSlice.js";

const DEALS_URL = "/api/deals";

export const dealsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createDeal: builder.mutation({
      query: (data) => ({
        url: `${DEALS_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    retrieveDeals: builder.query({
      query: () => ({
        url: `${DEALS_URL}`,
        method: "GET",
      }),
    }),

    completeDeal: builder.mutation({
      query: ({dealId, boolean}) => ({
        url: `${DEALS_URL}`,
        method: "PUT",
        params: {dealId, boolean}
      }),
    }),
  }),
});

export const { useCreateDealMutation, useRetrieveDealsQuery, useCompleteDealMutation} = dealsApiSlice;
