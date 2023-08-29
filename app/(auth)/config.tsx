export const config = {
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_USER_POOL,
  aws_user_pools_web_client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
  aws_cognito_identity_pool_id: process.env.NEXT_PUBLIC_COGNITO_ID_POOL,
  oauth: {},
}
