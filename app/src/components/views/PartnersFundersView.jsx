import { useQuery } from "@apollo/client/react";
import ViewAllPartnersFunders from "../elements/ViewAllPartnersFunders";

import { ORGANIZATIONS_QUERY } from "../../lib/graphql/queries";
import { buildOrganizationRows } from "../../data/adapters/projectRowsFromOrganizations";

export default function PartnersFundersView() {
  const { data, loading, error } = useQuery(ORGANIZATIONS_QUERY);

  if (loading) return <p>Loading organizations…</p>;
  if (error) return <p>Error loading data</p>;

  const rows = buildOrganizationRows(data.organizations);

  return <ViewAllPartnersFunders rows={rows} />;
}
