import { gql } from "@apollo/client";

export const LAST_UPDATED_QUERY = gql`
  query LastUpdated {
    systemStatus {
      dataLastSyncedAt
    }
  }
`;