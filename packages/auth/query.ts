import { gql } from '@apollo/client';


export const AUTH_LOGIN = gql`
  mutation AuthLogin($args: LoginInput!) {
    authLogin(args: $args)
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation AuthChangePassword($args: ChangePasswordInput!) {
    authChangePassword(args: $args)
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation AuthForgotPassword($username: String!) {
    authForgotPassword(username: $username)
  }
`;

export const RESET_PASSWORD = gql`
  mutation AuthPasswordReset($args: PasswordResetInput!) {
    authPasswordReset(args: $args)
  }
`;


export const AUTH_LOGIN_REST = gql`
	mutation AuthLogin($input: LoginInput!) {
		authLogin: authLogin(input: $input)
			@rest(
				path: "/auth/login"
				method: "POST" 
			) {
        token
      }
	}
`;

export const AUTH_FORGOT_PASSWORD_REST = gql`
	mutation AuthForgotPassword($input: Input!) {
		authForgotPassword: authForgotPassword(input: $input)
			@rest(
				path: "/auth/forgot_password"
				method: "POST",
        # bodyKey: "username"
			) {
        message
      }
	}
`;

export const AUTH_RESET_PASSWORD_REST = gql`
	mutation AuthPasswordReset($input: PasswordResetInput!) {
		authPasswordReset: authPasswordReset(input: $input)
			@rest(
				path: "/auth/reset_password"
				method: "POST",
			) {
        message
      }
	}
`;

export const QUERY_AUTH_VALIDATE = gql`
	query AuthValidate {
		authValidate	@rest(
				path: "/auth/validate"
				method: "GET",
			) {
        message
      }
	}
`;