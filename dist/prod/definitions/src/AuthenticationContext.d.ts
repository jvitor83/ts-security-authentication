import { IAuthenticationSettings } from './IAuthenticationSettings';
import { IAuthenticationManagerSettings } from './IAuthenticationManagerSettings';
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
    protected AccessToken: string;
    protected AccessTokenContent: any;
    protected IdentityToken: string;
    protected IdentityTokenContent: any;
    protected ProfileContent: any;
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
