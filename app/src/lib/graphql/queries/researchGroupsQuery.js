import { gql } from "@apollo/client";

export const RESEARCH_GROUPS_QUERY = gql`
  query AllResearchGroups {
    research_groups {
      name
      post_id
      projects {
        name
        slug
        active
        contributors {
          name
          slug
          post_id
          research_groups {
            name
            slug
            post_id
          }
          operations_groups {
            name
            slug
            post_id
          }
        }
        funding_organizations {
          name
          slug
          post_id
        }
        partner_organizations {
          name
          slug
          post_id
        }
      }
    }
  }
`;