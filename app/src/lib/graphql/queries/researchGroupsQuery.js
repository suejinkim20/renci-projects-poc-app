import { gql } from "@apollo/client";

export const RESEARCH_GROUPS_QUERY = gql`
  query AllResearchGroups {
    research_groups {
      name
      projects {
        name
        slug
        active
        contributors {
          name
          slug
        }
        funding_organizations {
          name
          slug
        }
        partner_organizations {
          name
          slug
        }
      }
    }
  }
`;