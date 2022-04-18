import { gql } from '@apollo/client';

export const QUERY_ADDRESS_LIST_FULL_REST = gql`
	query AddressListFull($input: QueryInput!) {
		addressListFull: addressListFull(input: $input)
			@rest(
				path: "/p/addresses/list_full"
				method: "POST" 				
			) {
				items {
					id
					fullAddress
				}
      }
	}
`;