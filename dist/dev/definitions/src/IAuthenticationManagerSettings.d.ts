export interface IAuthenticationManagerSettings {
    clientId: string;
    clientSecret: string;
    accessTokenUri: string;
    authorizationUri: string;
    userInfoUri: string;
    authorizationGrants: ['credentials'];
    redirectUri: string;
    scopes: Array<string>;
}
