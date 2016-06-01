export interface IAuthenticationSettings
{
    authority: string;
    client_id: string;
    scope?: string;
    response_type?: string;
    
    client_url?: string;
    
    open_on_popup?: boolean;
}