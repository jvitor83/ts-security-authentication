export interface IAuthenticationSettings {
    authority: string;
    clientId: string;
    clientSecret?: string;
    scope?: Array<string>;
    response_type?: string;
    client_url?: string;
}
