import { gql } from "@apollo/client";

export const PROJECTS_QUERY = gql`
  query Projects {
    projects {
      slug
      post_id
      name
      contributors {
        name
        post_id
      }
      research_groups {
        name
        post_id
      }
    }
  }
`;