import { gql } from '@apollo/client';

export const QUERY_GEO_COUNTRIES = gql`
	query GeoCountries {		
		geo_countries	@rest(
				path: "/geo/countries/list"
				method: "GET" 
			) {
       items {
				 id
				 name
				 code
			 }
      }
	}
`;


export const QUERY_GEO_STATES = gql`
	query States($input: QueryInput!) {
		states: states(input: $input)
			@rest(
				path: "/geo/states/list"
				method: "POST" 				
			) {
				items {
					id
					name
				}
      }
	}
`;

export const MUTATION_CHECK_EMAIL_EXISTS = gql`
  mutation CheckEmailExists($input: Input!) {
    checkEmailExists(input: $input) 
		@rest(
			path: "/auth/check_email_exists"
			method: "POST"
		)
		{
			isExists
		}
  }
`;

export const MUTATION_REGISTER_REST = gql`
  mutation Register($input: Input!) {
    register(input: $input) 
		@rest(
			path: "/auth/register"
			method: "POST"
		)
		{
			message
			token
		}
  }
`;

export const MUTATION_NEWSLETTER_SEND_TO_FRIEND = gql`
  mutation SendToFriend($input: Input!) {
    send_to_friend(input: $input) 
		@rest(
			path: "/newsletter/send_to_friend"
			method: "POST"
		)
		{
			message
		}
  }
`;