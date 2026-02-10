import { gql } from "@apollo/client";

export const ORGANIZATIONS_QUERY = gql`
  query AllOrganizationsWithProjects {
    organizations(page: { offset: 0, limit: 500 }){
      name
      slug
      website
      funded_projects {
        post_id
        name
        slug
        research_groups {
          name
        }
        contributors {
          name
          slug
          research_groups {
            name
          }
        }
      }
      partner_projects {
        post_id
        name
        slug
        research_groups {
          name
        }
        contributors {
          name
          slug
          research_groups {
            name
          }
        }
      }
    }
  }
`;
