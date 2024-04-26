const fetchLeadCount = async (filter) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/leads/count/${filter}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leads");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching leads:", error);
  }

}

const fetchLeads = async (pg, filter, sortBy, searchBy, sort_order, filterBy) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/leads/${pg || 1}/${filter || "Cold"}/${
        sortBy || "createdAt"
      }/${searchBy || "G"}/${sort_order || "desc"}/${filterBy || "Default"}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch leads");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching leads:", error);
  }

}

export { fetchLeadCount, fetchLeads}