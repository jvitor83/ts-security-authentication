import { IAuthenticationSettings } from './IAuthenticationSettings';
import { IAuthenticationManagerSettings } from './IAuthenticationManagerSettings';
//require('oidc-token-manager');
//import 'oidc-token-manager/dist/oidc-token-manager.js';
//import * as Q from 'q';
//import 'oidc-token-manager';
//import 'client-oauth2';

import * as OpenIDConnectClient from 'ts-client-openidconnect';



/**
 * AuthenticationInitializer
 */
export class AuthenticationContext 
{
    
    private static _current: AuthenticationContext = null;

    public static get Current(): AuthenticationContext 
    {
        if(AuthenticationContext._current === null)
        {
            AuthenticationContext._current =  new AuthenticationContext();
        }
        return AuthenticationContext._current;
    }
    
    public get IsInitialized()
    {
        if(this.AuthenticationManagerSettings != null)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    public static Reset()
    {
        AuthenticationContext._current = null;
    }

    private clientOAuth2: OpenIDConnectClient.ClientOAuth2;
        
    constructor() 
    {
        let authenticationSettingsLoadedFromStorage = this.AuthenticationManagerSettings;
        if(authenticationSettingsLoadedFromStorage != null)
        {
            this.clientOAuth2 = new OpenIDConnectClient.ClientOAuth2( authenticationSettingsLoadedFromStorage );
        }
    }
    
    protected get AuthenticationManagerSettings(): IAuthenticationManagerSettings 
    {
        let authenticationSettingsFromLocalStorage: IAuthenticationManagerSettings = null;
        let authenticationSettingsFromLocalStorageStringify = localStorage.getItem('AuthenticationManagerSettings');
        if(authenticationSettingsFromLocalStorageStringify != null)
        {
            authenticationSettingsFromLocalStorage = JSON.parse(authenticationSettingsFromLocalStorageStringify);
        }
        return authenticationSettingsFromLocalStorage;
    }
    
    protected set AuthenticationManagerSettings(value: IAuthenticationManagerSettings)
    {
        localStorage.setItem('AuthenticationManagerSettings', JSON.stringify(value));
    }
    
    protected Initialize(authenticationSettings: IAuthenticationSettings)
    {
        if(authenticationSettings.authority == null || authenticationSettings.clientId == null)
        {
            throw "Should be informed at least 'authority' and 'client_id'!";
        }
        
        let defaultRedirectUri : string = null;
        if(location.protocol.indexOf('file:') > -1)
        {
            defaultRedirectUri = 'urn:ietf:wg:oauth:2.0:oob:auto';
        }
        else
        {
            defaultRedirectUri = location.href;
        }
        
        console.log(defaultRedirectUri);
        //Set default values if not informed
        authenticationSettings.client_url = authenticationSettings.client_url || defaultRedirectUri; //Self uri
        authenticationSettings.scope = authenticationSettings.scope || [ 'openid', 'profile', 'email', 'offline_access' ]; //OpenId default scopes
        authenticationSettings.response_type = authenticationSettings.response_type || 'code id_token token'; //Hybrid flow at default
        //authenticationSettings.open_on_popup = authenticationSettings.open_on_popup || false; //Redirect for default

        this.AuthenticationManagerSettings = 
        {
            clientId: authenticationSettings.clientId,
            clientSecret: authenticationSettings.clientSecret,
            accessTokenUri: authenticationSettings.authority + "/connect/token",
            authorizationUri: authenticationSettings.authority + "/connect/authorize",
            userInfoUri: authenticationSettings.authority + "/connect/userinfo",
            authorizationGrants: ['credentials'],
            redirectUri: authenticationSettings.client_url,
            scopes: authenticationSettings.scope
        };

        this.clientOAuth2 = new OpenIDConnectClient.ClientOAuth2(this.AuthenticationManagerSettings);
    }
    
    protected ProcessTokenIfNeeded()
    {
        
        //if the actual page is the 'redirect_uri' (loaded from the localStorage), then i consider to 'process the token callback'  
        //if(location.href.substring(0, this.AuthenticationManagerSettings.redirect_uri.length) === this.AuthenticationManagerSettings.redirect_uri)
        if(location.href.indexOf('access_token=') > -1)
        {
            console.log('Processing token!');
            localStorage.setItem('TokenUri', location.href);
            this.RedirectToInitialPage(this.AuthenticationManagerSettings.redirectUri);
        }
        // //if the actual page is the 'silent_redirect_uri' (loaded from the localStorage), then i consider to 'process the token callback'
        // else if (location.href.substring(0, this.AuthenticationManagerSettings.silent_redirect_uri.length) === this.AuthenticationManagerSettings.silent_redirect_uri)
        // {
        //     this.RenewTokenSilent();
        // }
        //Go Horse
        // else
        // {
        //     let defer = Q.defer<TokensContents>();
        //     defer.resolve(this.TokensContents);
        //     return defer.promise;
        // }
    }
    
    public Init(authenticationSettings?: IAuthenticationSettings, force = false)
    {
        if(authenticationSettings != null)
        {
            if(this.IsInitialized === false || force === true)
            {
                this.Initialize(authenticationSettings);
            }
            else
            {
                console.debug("Should be unitializated to initialize. You are missing the force parameter?");
            }
        }
        
        this.ProcessTokenIfNeeded();
    }
    
    protected RedirectToInitialPage(uri :string)
    {
        location.assign(uri);
    }

    
    protected ValidateInitialization()
    {
        if(this.AuthenticationManagerSettings == null)
        {
            throw "AuthenticationContext uninitialized!";
        }
    }
    
    
    /**
     * Make the login at the current URI, and process the received tokens.
     * OBS: The Redirect URI [callback_url] (to receive the token) and Silent Refresh Frame URI [silent_redirect_uri] (to auto renew when expired) if not informed is auto generated based on the 'client_url' informed at 'Init' method with the followin strategy:
     * `redirect_url = client_url + '?callback=true'`
     * `silent_redirect_uri = client_url + '?silentrefreshframe=true'` 
     * 
     * @param {boolean} [openOnPopUp] (description)
     */
    // public LoginAndProcessToken(openOnPopUp?: boolean)
    // {
    //     this.ValidateInitialization();
        
    //     let shouldOpenOnPopUp = openOnPopUp || this.AuthenticationManagerSettings.open_on_popup;
        
    //     //if the actual page is the 'redirect_uri' (loaded from the localStorage), then i consider to 'process the token callback'  
    //     if(location.href.substring(0, this.AuthenticationManagerSettings.redirect_uri.length) === this.AuthenticationManagerSettings.redirect_uri)
    //     {
    //         this.ProcessTokenCallback();
    //     }
    //     //if the actual page is the 'silent_redirect_uri' (loaded from the localStorage), then i consider to 'process the token callback'
    //     else if (location.href.substring(0, this.AuthenticationManagerSettings.silent_redirect_uri.length) === this.AuthenticationManagerSettings.silent_redirect_uri)
    //     {
    //         this.RenewTokenSilent();
    //     }
    //     //if the actual page is the 'client_url', then i consider to make the 'login'
    //     else if(location.href.substring(0, this.AuthenticationManagerSettings.client_url.length) === this.AuthenticationManagerSettings.client_url)
    //     {
    //         if(this.IsAuthenticated === false)
    //         {
    //             this.Login(shouldOpenOnPopUp);
    //         }
    //     }
    // }
    
    public Login(openOnPopUp?: boolean)
    {
        if(this.TokensContents.IsAuthenticated === false)
        {
            this.ValidateInitialization();
            
            let uriToIdP = this.clientOAuth2.token.getUri().replace('token', 'code%20id_token%20token&nonce=123');
            
            this.RedirectToInitialPage(uriToIdP);
        }
        else
        {
            console.warn('Already authenticated');
        }
    }

    public get IsAuthenticated() :boolean
    {
        if(this.TokensContents.IsAuthenticated === false)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    public get TokensContents() : TokensContents
    {
        let tokenContents = new TokensContents();

        tokenContents.AccessToken = this.AccessToken;
        tokenContents.IdentityToken = this.IdentityToken;
        //tokenContents.Profile = this.ProfileContent;

        tokenContents.AccessTokenContent = this.AccessTokenContent;
        tokenContents.IdentityTokenContent = this.IdentityTokenContent;
        tokenContents.ProfileContent = this.ProfileContent;

        return tokenContents;
    }

    protected get AccessToken(): string 
    {
        if (this.clientOAuth2 != null)
        {
            let tokenUri = localStorage.getItem('TokenUri');
            
            if(tokenUri != null)
            {
                let clientOAuth2Token = this.clientOAuth2.token.getToken(tokenUri);
                return clientOAuth2Token.accessToken;
            }
            return null;
        }
        return null;
    }

    protected get AccessTokenContent(): any 
    {
        if (this.AccessToken != null)
        {
            let content = atob(this.AccessToken.split('.')[1]);
            let retorno = JSON.parse(content);
            return retorno;
        }
        return null;
    }
    
    protected get IdentityToken(): string 
    {
        if (this.clientOAuth2 != null)
        {
            let tokenUri = localStorage.getItem('TokenUri');
            
            if(tokenUri != null)
            {
                let clientOAuth2Token = this.clientOAuth2.token.getToken(tokenUri);
                return clientOAuth2Token.identityToken;
            }
            return null;
        }
        return null;
    }

    protected get IdentityTokenContent(): any 
    {
        if (this.IdentityToken != null)
        {
            let content = atob(this.IdentityToken.split('.')[1]);
            let retorno = JSON.parse(content);
            return retorno;
        }
        return null;
    }
    
    protected get ProfileContent(): any
    {
        if (this.clientOAuth2 != null)
        {
            if(this.AccessToken != null)
            {
                let userInfoResponse = this.clientOAuth2.token.getUserInfo(this.AccessToken);
                return userInfoResponse;
            }
            return null;
        }
        return null;
    }

    // //TODO: Split the parser to another project (package - ts-security-tokens?)
    // //Include refactory at the ts-security-identity also
    // protected GenerateTokens()
    // {

            
    //         if(this.oidcTokenManager.profile != null)
    //         {
    //             this.ProfileContent = this.oidcTokenManager.profile;
    //         }
    //     }
        
    //     // this.AccessTokenContent = JSON.parse(atob(this.oidcTokenManager.access_token.split('.')[1]));
    //     // this.IdentityTokenContent = JSON.parse(atob(this.oidcTokenManager.id_token.split('.')[1]));
    //     // this.ProfileContent = this.oidcTokenManager.profile;
    // }
    

}

export class TokensContents
{
    public get IsAuthenticated() :boolean
    {
        if(this.AccessTokenContent == null)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    
    private _profileContent: any;
    public get ProfileContent(): any
    {
        return this._profileContent;
    }
    public set ProfileContent(value: any)
    {
        this._profileContent = value;
    }
    
    
    
    private _accessToken: string;
    public get AccessToken(): string
    {
        return this._accessToken;
    }
    public set AccessToken(value: string)
    {
        this._accessToken = value;
    }
    
    
    private _accessTokenContent: any;
    public get AccessTokenContent(): any
    {
        return this._accessTokenContent;
    }
    public set AccessTokenContent(value: any)
    {
        this._accessTokenContent = value;
    }
    
    
    
    
    
    private _identityToken: string;
    public get IdentityToken(): string
    {
        return this._identityToken;
    }
    public set IdentityToken(value: string)
    {
        this._identityToken = value;
    }
    
    
    private _identityTokenContent: any;
    public get IdentityTokenContent(): any
    {
        return this._identityTokenContent;
    }
    public set IdentityTokenContent(value: any)
    {
        this._identityTokenContent = value;
    }
    
    
    public ToArray() : Array<any>
    {
        return [ this.IdentityTokenContent, this.AccessTokenContent, this.ProfileContent ];
    }
}