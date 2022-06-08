
module.exports.cognito = {
  region: process.env.REACT_APP_AWS_REGION,
  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID
}