import { IAuthenticationSettings } from './IAuthenticationSettings';
import { IAuthenticationManagerSettings } from './IAuthenticationManagerSettings';
import * as Q from 'q';
import 'client-oauth2';
export declare class AuthenticationContext {
    private static _current;
    static Current: AuthenticationContext;
    IsInitialized: boolean;
    static Reset(): void;
    private clientOAuth2;
    constructor();
    protected AuthenticationManagerSettings: IAuthenticationManagerSettings;
    protected Initialize(authenticationSettings: IAuthenticationSettings): void;
    protected ProcessTokenIfNeeded(): void;
    Init(authenticationSettings?: IAuthenticationSettings, force?: boolean): void;
    protected RedirectToInitialPage(uri: string): void;
    protected ValidateInitialization(): void;
    Login(openOnPopUp?: boolean): void;
    IsAuthenticated: boolean;
    TokensContents: TokensContents;
    protected AccessTokenContent: Q.IPromise<string>;
}
export declare class TokensContents {
    IsAuthenticated: boolean;
    private _profileContent;
    ProfileContent: any;
    private _accessTokenContent;
    AccessTokenContent: any;
    private _identityTokenContent;
    IdentityTokenContent: any;
    ToArray(): Array<any>;
}
