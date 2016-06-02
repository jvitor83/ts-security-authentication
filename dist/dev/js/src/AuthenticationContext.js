System.register(['ts-client-openidconnect'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var OpenIDConnectClient;
    var AuthenticationContext, TokensContents;
    return {
        setters:[
            function (OpenIDConnectClient_1) {
                OpenIDConnectClient = OpenIDConnectClient_1;
            }],
        execute: function() {
            /**
             * AuthenticationInitializer
             */
            AuthenticationContext = (function () {
                function AuthenticationContext() {
                    var authenticationSettingsLoadedFromStorage = this.AuthenticationManagerSettings;
                    if (authenticationSettingsLoadedFromStorage != null) {
                        this.clientOAuth2 = new OpenIDConnectClient.ClientOAuth2(authenticationSettingsLoadedFromStorage);
                    }
                }
                Object.defineProperty(AuthenticationContext, "Current", {
                    get: function () {
                        if (AuthenticationContext._current === null) {
                            AuthenticationContext._current = new AuthenticationContext();
                        }
                        return AuthenticationContext._current;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AuthenticationContext.prototype, "IsInitialized", {
                    get: function () {
                        if (this.AuthenticationManagerSettings != null) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                AuthenticationContext.Reset = function () {
                    AuthenticationContext._current = null;
                };
                Object.defineProperty(AuthenticationContext.prototype, "AuthenticationManagerSettings", {
                    get: function () {
                        var authenticationSettingsFromLocalStorage = null;
                        var authenticationSettingsFromLocalStorageStringify = localStorage.getItem('AuthenticationManagerSettings');
                        if (authenticationSettingsFromLocalStorageStringify != null) {
                            authenticationSettingsFromLocalStorage = JSON.parse(authenticationSettingsFromLocalStorageStringify);
                        }
                        return authenticationSettingsFromLocalStorage;
                    },
                    set: function (value) {
                        localStorage.setItem('AuthenticationManagerSettings', JSON.stringify(value));
                    },
                    enumerable: true,
                    configurable: true
                });
                AuthenticationContext.prototype.Initialize = function (authenticationSettings) {
                    if (authenticationSettings.authority == null || authenticationSettings.client_id == null) {
                        throw "Should be informed at least 'authority' and 'client_id'!";
                    }
                    //Set default values if not informed
                    authenticationSettings.client_url = authenticationSettings.client_url || location.href; //Self uri
                    authenticationSettings.scope = authenticationSettings.scope || 'openid profile email offline_access'; //OpenId default scopes
                    authenticationSettings.response_type = authenticationSettings.response_type || 'code id_token token'; //Hybrid flow at default
                    authenticationSettings.open_on_popup = authenticationSettings.open_on_popup || false; //Redirect for default
                    //Convert to the more complete IAuthenticationManagerSettings
                    this.AuthenticationManagerSettings =
                        {
                            authority: authenticationSettings.authority,
                            client_id: authenticationSettings.client_id,
                            client_url: authenticationSettings.client_url,
                            open_on_popup: authenticationSettings.open_on_popup,
                            response_type: authenticationSettings.response_type,
                            scope: authenticationSettings.scope,
                            redirect_uri: authenticationSettings.client_url,
                            silent_redirect_uri: authenticationSettings.client_url + "?silentrefreshframe=true",
                            post_logout_redirect_uri: authenticationSettings.client_url,
                            authorization_url: authenticationSettings.authority + "/connect/authorize",
                            token_url: authenticationSettings.authority + "/connect/token",
                            userinfo_url: authenticationSettings.authority + "/connect/userinfo",
                            load_user_profile: true,
                            silent_renew: true,
                        };
                    var settings = {
                        clientId: this.AuthenticationManagerSettings.client_id,
                        clientSecret: 'secret',
                        accessTokenUri: this.AuthenticationManagerSettings.token_url,
                        authorizationUri: this.AuthenticationManagerSettings.authorization_url,
                        userInfoUri: this.AuthenticationManagerSettings.userinfo_url,
                        authorizationGrants: ['credentials'],
                        redirectUri: this.AuthenticationManagerSettings.redirect_uri,
                        scopes: this.AuthenticationManagerSettings.scope.split(' ')
                    };
                    this.clientOAuth2 = new OpenIDConnectClient.ClientOAuth2(settings);
                };
                AuthenticationContext.prototype.ProcessTokenIfNeeded = function () {
                    //if the actual page is the 'redirect_uri' (loaded from the localStorage), then i consider to 'process the token callback'  
                    //if(location.href.substring(0, this.AuthenticationManagerSettings.redirect_uri.length) === this.AuthenticationManagerSettings.redirect_uri)
                    if (location.href.indexOf('access_token=') > -1) {
                        console.log('Processing token!');
                        localStorage.setItem('TokenUri', location.href);
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
                };
                AuthenticationContext.prototype.Init = function (authenticationSettings, force) {
                    if (force === void 0) { force = false; }
                    if (authenticationSettings != null) {
                        if (this.IsInitialized === false || force === true) {
                            this.Initialize(authenticationSettings);
                        }
                        else {
                            throw "Should be unitializated to initialize. You are missing the force parameter?";
                        }
                    }
                    this.ProcessTokenIfNeeded();
                };
                AuthenticationContext.prototype.RedirectToInitialPage = function (uri) {
                    location.assign(uri);
                };
                AuthenticationContext.prototype.ValidateInitialization = function () {
                    if (this.AuthenticationManagerSettings == null) {
                        throw "AuthenticationContext uninitialized!";
                    }
                };
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
                AuthenticationContext.prototype.Login = function (openOnPopUp) {
                    if (this.TokensContents.IsAuthenticated === false) {
                        this.ValidateInitialization();
                        var uriToIdP = this.clientOAuth2.token.getUri().replace('token', 'code%20id_token%20token&nonce=123');
                        this.RedirectToInitialPage(uriToIdP);
                    }
                    else {
                        console.warn('Already authenticated');
                    }
                };
                Object.defineProperty(AuthenticationContext.prototype, "IsAuthenticated", {
                    get: function () {
                        if (this.TokensContents.IsAuthenticated === false) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AuthenticationContext.prototype, "TokensContents", {
                    get: function () {
                        var tokenContents = new TokensContents();
                        tokenContents.AccessTokenContent = this.AccessTokenContent;
                        tokenContents.IdentityTokenContent = this.IdentityTokenContent;
                        tokenContents.ProfileContent = this.ProfileContent;
                        return tokenContents;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AuthenticationContext.prototype, "AccessToken", {
                    get: function () {
                        if (this.clientOAuth2 != null) {
                            var tokenUri = localStorage.getItem('TokenUri');
                            if (tokenUri != null) {
                                var clientOAuth2Token = this.clientOAuth2.token.getToken(tokenUri);
                                return clientOAuth2Token.accessToken;
                            }
                            return null;
                        }
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AuthenticationContext.prototype, "AccessTokenContent", {
                    get: function () {
                        if (this.AccessToken != null) {
                            var content = atob(this.AccessToken.split('.')[1]);
                            var retorno = JSON.parse(content);
                            return retorno;
                        }
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AuthenticationContext.prototype, "IdentityToken", {
                    get: function () {
                        if (this.clientOAuth2 != null) {
                            var tokenUri = localStorage.getItem('TokenUri');
                            if (tokenUri != null) {
                                var clientOAuth2Token = this.clientOAuth2.token.getToken(tokenUri);
                                return clientOAuth2Token.identityToken;
                            }
                            return null;
                        }
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AuthenticationContext.prototype, "IdentityTokenContent", {
                    get: function () {
                        if (this.IdentityToken != null) {
                            var content = atob(this.IdentityToken.split('.')[1]);
                            var retorno = JSON.parse(content);
                            return retorno;
                        }
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AuthenticationContext.prototype, "ProfileContent", {
                    get: function () {
                        if (this.clientOAuth2 != null) {
                            if (this.AccessToken != null) {
                                var userInfoResponse = this.clientOAuth2.token.getUserInfo(this.AccessToken);
                                return userInfoResponse;
                            }
                            return null;
                        }
                        return null;
                    },
                    enumerable: true,
                    configurable: true
                });
                AuthenticationContext._current = null;
                return AuthenticationContext;
            }());
            exports_1("AuthenticationContext", AuthenticationContext);
            TokensContents = (function () {
                function TokensContents() {
                }
                Object.defineProperty(TokensContents.prototype, "IsAuthenticated", {
                    get: function () {
                        if (this.AccessTokenContent == null) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TokensContents.prototype, "ProfileContent", {
                    get: function () {
                        return this._profileContent;
                    },
                    set: function (value) {
                        this._profileContent = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TokensContents.prototype, "AccessTokenContent", {
                    get: function () {
                        return this._accessTokenContent;
                    },
                    set: function (value) {
                        this._accessTokenContent = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TokensContents.prototype, "IdentityTokenContent", {
                    get: function () {
                        return this._identityTokenContent;
                    },
                    set: function (value) {
                        this._identityTokenContent = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                TokensContents.prototype.ToArray = function () {
                    return [this.IdentityTokenContent, this.AccessTokenContent, this.ProfileContent];
                };
                return TokensContents;
            }());
            exports_1("TokensContents", TokensContents);
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9BdXRoZW50aWNhdGlvbkNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7WUFZQTs7ZUFFRztZQUNIO2dCQWlDSTtvQkFFSSxJQUFJLHVDQUF1QyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztvQkFDakYsRUFBRSxDQUFBLENBQUMsdUNBQXVDLElBQUksSUFBSSxDQUFDLENBQ25ELENBQUM7d0JBQ0csSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLG1CQUFtQixDQUFDLFlBQVksQ0FBRSx1Q0FBdUMsQ0FBRSxDQUFDO29CQUN4RyxDQUFDO2dCQUNMLENBQUM7Z0JBbkNELHNCQUFrQixnQ0FBTzt5QkFBekI7d0JBRUksRUFBRSxDQUFBLENBQUMscUJBQXFCLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUMzQyxDQUFDOzRCQUNHLHFCQUFxQixDQUFDLFFBQVEsR0FBSSxJQUFJLHFCQUFxQixFQUFFLENBQUM7d0JBQ2xFLENBQUM7d0JBQ0QsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQztvQkFDMUMsQ0FBQzs7O21CQUFBO2dCQUVELHNCQUFXLGdEQUFhO3lCQUF4Qjt3QkFFSSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLElBQUksSUFBSSxDQUFDLENBQzlDLENBQUM7NEJBQ0csTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDaEIsQ0FBQzt3QkFDRCxJQUFJLENBQ0osQ0FBQzs0QkFDRyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUNqQixDQUFDO29CQUNMLENBQUM7OzttQkFBQTtnQkFFYSwyQkFBSyxHQUFuQjtvQkFFSSxxQkFBcUIsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUMxQyxDQUFDO2dCQWFELHNCQUFjLGdFQUE2Qjt5QkFBM0M7d0JBRUksSUFBSSxzQ0FBc0MsR0FBbUMsSUFBSSxDQUFDO3dCQUNsRixJQUFJLCtDQUErQyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsK0JBQStC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QkFBbUIsQ0FBQztvQkFDcEMsQ0FBQzt5QkFDRCxVQUE4QixLQUFVO3dCQUVwQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO29CQUNyQyxDQUFDOzs7bUJBSkE7Z0JBUUQsc0JBQVcsZ0RBQW9CO3lCQUEvQjt3QkFFSSxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDO29CQUN0QyxDQUFDO3lCQUNELFVBQWdDLEtBQVU7d0JBRXRDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7b0JBQ3ZDLENBQUM7OzttQkFKQTtnQkFPTSxnQ0FBTyxHQUFkO29CQUVJLE1BQU0sQ0FBQyxDQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBRSxDQUFDO2dCQUN2RixDQUFDO2dCQUNMLHFCQUFDO1lBQUQsQ0FuREEsQUFtREMsSUFBQTtZQW5ERCwyQ0FtREMsQ0FBQSIsImZpbGUiOiJzcmMvQXV0aGVudGljYXRpb25Db250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUF1dGhlbnRpY2F0aW9uU2V0dGluZ3MgfSBmcm9tICcuL0lBdXRoZW50aWNhdGlvblNldHRpbmdzJztcclxuaW1wb3J0IHsgSUF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzIH0gZnJvbSAnLi9JQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MnO1xyXG4vL3JlcXVpcmUoJ29pZGMtdG9rZW4tbWFuYWdlcicpO1xyXG4vL2ltcG9ydCAnb2lkYy10b2tlbi1tYW5hZ2VyL2Rpc3Qvb2lkYy10b2tlbi1tYW5hZ2VyLmpzJztcclxuLy9pbXBvcnQgKiBhcyBRIGZyb20gJ3EnO1xyXG4vL2ltcG9ydCAnb2lkYy10b2tlbi1tYW5hZ2VyJztcclxuLy9pbXBvcnQgJ2NsaWVudC1vYXV0aDInO1xyXG5cclxuaW1wb3J0ICogYXMgT3BlbklEQ29ubmVjdENsaWVudCBmcm9tICd0cy1jbGllbnQtb3BlbmlkY29ubmVjdCc7XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBBdXRoZW50aWNhdGlvbkluaXRpYWxpemVyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXV0aGVudGljYXRpb25Db250ZXh0IFxyXG57XHJcbiAgICBcclxuICAgIHByaXZhdGUgc3RhdGljIF9jdXJyZW50OiBBdXRoZW50aWNhdGlvbkNvbnRleHQgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0IEN1cnJlbnQoKTogQXV0aGVudGljYXRpb25Db250ZXh0IFxyXG4gICAge1xyXG4gICAgICAgIGlmKEF1dGhlbnRpY2F0aW9uQ29udGV4dC5fY3VycmVudCA9PT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIEF1dGhlbnRpY2F0aW9uQ29udGV4dC5fY3VycmVudCA9ICBuZXcgQXV0aGVudGljYXRpb25Db250ZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBBdXRoZW50aWNhdGlvbkNvbnRleHQuX2N1cnJlbnQ7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBnZXQgSXNJbml0aWFsaXplZCgpXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncyAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBzdGF0aWMgUmVzZXQoKVxyXG4gICAge1xyXG4gICAgICAgIEF1dGhlbnRpY2F0aW9uQ29udGV4dC5fY3VycmVudCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGllbnRPQXV0aDI6IE9wZW5JRENvbm5lY3RDbGllbnQuQ2xpZW50T0F1dGgyO1xyXG4gICAgICAgIFxyXG4gICAgY29uc3RydWN0b3IoKSBcclxuICAgIHtcclxuICAgICAgICBsZXQgYXV0aGVudGljYXRpb25TZXR0aW5nc0xvYWRlZEZyb21TdG9yYWdlID0gdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncztcclxuICAgICAgICBpZihhdXRoZW50aWNhdGlvblNldHRpbmdzTG9hZGVkRnJvbVN0b3JhZ2UgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpZW50T0F1dGgyID0gbmV3IE9wZW5JRENvbm5lY3RDbGllbnQuQ2xpZW50T0F1dGgyKCBhdXRoZW50aWNhdGlvblNldHRpbmdzTG9hZGVkRnJvbVN0b3JhZ2UgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBnZXQgQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MoKTogSUF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzIFxyXG4gICAge1xyXG4gICAgICAgIGxldCBhdXRoZW50aWNhdGlvblNldHRpbmdzRnJvbUxvY2FsU3RvcmFnZTogSUF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzID0gbnVsbDtcclxuICAgICAgICBsZXQgYXV0aGVudGljYXRpb25TZXR0aW5nc0Zyb21Mb2NhbFN0b3JhZ2VTdHJpbmdpZnkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MnKTtcclxuICAgICAgICBpZihhdXRoZW50aWNhdGlvblNldHRpbmdzRnJvbUxvY2FsU3RvcmFnZVN0cmluZ2lmeSAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYXV0aGVudGljYXRpb25TZXR0aW5nc0Zyb21Mb2NhbFN0b3JhZ2UgPSBKU09OLnBhcnNlKGF1dGhlbnRpY2F0aW9uU2V0dGluZ3NGcm9tTG9jYWxTdG9yYWdlU3RyaW5naWZ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF1dGhlbnRpY2F0aW9uU2V0dGluZ3NGcm9tTG9jYWxTdG9yYWdlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgc2V0IEF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzKHZhbHVlOiBJQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MpXHJcbiAgICB7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ0F1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzJywgSlNPTi5zdHJpbmdpZnkodmFsdWUpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIEluaXRpYWxpemUoYXV0aGVudGljYXRpb25TZXR0aW5nczogSUF1dGhlbnRpY2F0aW9uU2V0dGluZ3MpXHJcbiAgICB7XHJcbiAgICAgICAgaWYoYXV0aGVudGljYXRpb25TZXR0aW5ncy5hdXRob3JpdHkgPT0gbnVsbCB8fCBhdXRoZW50aWNhdGlvblNldHRpbmdzLmNsaWVudF9pZCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJTaG91bGQgYmUgaW5mb3JtZWQgYXQgbGVhc3QgJ2F1dGhvcml0eScgYW5kICdjbGllbnRfaWQnIVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvL1NldCBkZWZhdWx0IHZhbHVlcyBpZiBub3QgaW5mb3JtZWRcclxuICAgICAgICBhdXRoZW50aWNhdGlvblNldHRpbmdzLmNsaWVudF91cmwgPSBhdXRoZW50aWNhdGlvblNldHRpbmdzLmNsaWVudF91cmwgfHwgbG9jYXRpb24uaHJlZjsgLy9TZWxmIHVyaVxyXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uU2V0dGluZ3Muc2NvcGUgPSBhdXRoZW50aWNhdGlvblNldHRpbmdzLnNjb3BlIHx8ICdvcGVuaWQgcHJvZmlsZSBlbWFpbCBvZmZsaW5lX2FjY2Vzcyc7IC8vT3BlbklkIGRlZmF1bHQgc2NvcGVzXHJcbiAgICAgICAgYXV0aGVudGljYXRpb25TZXR0aW5ncy5yZXNwb25zZV90eXBlID0gYXV0aGVudGljYXRpb25TZXR0aW5ncy5yZXNwb25zZV90eXBlIHx8ICdjb2RlIGlkX3Rva2VuIHRva2VuJzsgLy9IeWJyaWQgZmxvdyBhdCBkZWZhdWx0XHJcbiAgICAgICAgYXV0aGVudGljYXRpb25TZXR0aW5ncy5vcGVuX29uX3BvcHVwID0gYXV0aGVudGljYXRpb25TZXR0aW5ncy5vcGVuX29uX3BvcHVwIHx8IGZhbHNlOyAvL1JlZGlyZWN0IGZvciBkZWZhdWx0XHJcblxyXG4gICAgICAgIC8vQ29udmVydCB0byB0aGUgbW9yZSBjb21wbGV0ZSBJQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3NcclxuICAgICAgICB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzID0gXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhdXRob3JpdHk6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuYXV0aG9yaXR5LFxyXG4gICAgICAgICAgICBjbGllbnRfaWQ6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuY2xpZW50X2lkLFxyXG4gICAgICAgICAgICBjbGllbnRfdXJsOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLmNsaWVudF91cmwsXHJcbiAgICAgICAgICAgIG9wZW5fb25fcG9wdXA6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3Mub3Blbl9vbl9wb3B1cCxcclxuICAgICAgICAgICAgcmVzcG9uc2VfdHlwZTogYXV0aGVudGljYXRpb25TZXR0aW5ncy5yZXNwb25zZV90eXBlLFxyXG4gICAgICAgICAgICBzY29wZTogYXV0aGVudGljYXRpb25TZXR0aW5ncy5zY29wZSxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJlZGlyZWN0X3VyaSA6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuY2xpZW50X3VybCxcclxuICAgICAgICAgICAgc2lsZW50X3JlZGlyZWN0X3VyaTogYXV0aGVudGljYXRpb25TZXR0aW5ncy5jbGllbnRfdXJsICsgXCI/c2lsZW50cmVmcmVzaGZyYW1lPXRydWVcIixcclxuICAgICAgICAgICAgcG9zdF9sb2dvdXRfcmVkaXJlY3RfdXJpOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLmNsaWVudF91cmwsXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBhdXRob3JpemF0aW9uX3VybCA6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuYXV0aG9yaXR5ICsgXCIvY29ubmVjdC9hdXRob3JpemVcIixcclxuICAgICAgICAgICAgdG9rZW5fdXJsIDogYXV0aGVudGljYXRpb25TZXR0aW5ncy5hdXRob3JpdHkgKyBcIi9jb25uZWN0L3Rva2VuXCIsXHJcbiAgICAgICAgICAgIHVzZXJpbmZvX3VybDogYXV0aGVudGljYXRpb25TZXR0aW5ncy5hdXRob3JpdHkgKyBcIi9jb25uZWN0L3VzZXJpbmZvXCIsXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsb2FkX3VzZXJfcHJvZmlsZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2lsZW50X3JlbmV3OiB0cnVlLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNldHRpbmdzID0gXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjbGllbnRJZDogdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5jbGllbnRfaWQsXHJcbiAgICAgICAgICAgIGNsaWVudFNlY3JldDogJ3NlY3JldCcsXHJcbiAgICAgICAgICAgIGFjY2Vzc1Rva2VuVXJpOiB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnRva2VuX3VybCxcclxuICAgICAgICAgICAgYXV0aG9yaXphdGlvblVyaTogdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5hdXRob3JpemF0aW9uX3VybCxcclxuICAgICAgICAgICAgdXNlckluZm9Vcmk6IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MudXNlcmluZm9fdXJsLFxyXG4gICAgICAgICAgICBhdXRob3JpemF0aW9uR3JhbnRzOiBbJ2NyZWRlbnRpYWxzJ10sXHJcbiAgICAgICAgICAgIHJlZGlyZWN0VXJpOiB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnJlZGlyZWN0X3VyaSxcclxuICAgICAgICAgICAgc2NvcGVzOiB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnNjb3BlLnNwbGl0KCcgJylcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY2xpZW50T0F1dGgyID0gbmV3IE9wZW5JRENvbm5lY3RDbGllbnQuQ2xpZW50T0F1dGgyKHNldHRpbmdzKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIFByb2Nlc3NUb2tlbklmTmVlZGVkKClcclxuICAgIHtcclxuICAgICAgICBcclxuICAgICAgICAvL2lmIHRoZSBhY3R1YWwgcGFnZSBpcyB0aGUgJ3JlZGlyZWN0X3VyaScgKGxvYWRlZCBmcm9tIHRoZSBsb2NhbFN0b3JhZ2UpLCB0aGVuIGkgY29uc2lkZXIgdG8gJ3Byb2Nlc3MgdGhlIHRva2VuIGNhbGxiYWNrJyAgXHJcbiAgICAgICAgLy9pZihsb2NhdGlvbi5ocmVmLnN1YnN0cmluZygwLCB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnJlZGlyZWN0X3VyaS5sZW5ndGgpID09PSB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnJlZGlyZWN0X3VyaSlcclxuICAgICAgICBpZihsb2NhdGlvbi5ocmVmLmluZGV4T2YoJ2FjY2Vzc190b2tlbj0nKSA+IC0xKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1Byb2Nlc3NpbmcgdG9rZW4hJyk7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdUb2tlblVyaScsIGxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyAvL2lmIHRoZSBhY3R1YWwgcGFnZSBpcyB0aGUgJ3NpbGVudF9yZWRpcmVjdF91cmknIChsb2FkZWQgZnJvbSB0aGUgbG9jYWxTdG9yYWdlKSwgdGhlbiBpIGNvbnNpZGVyIHRvICdwcm9jZXNzIHRoZSB0b2tlbiBjYWxsYmFjaydcclxuICAgICAgICAvLyBlbHNlIGlmIChsb2NhdGlvbi5ocmVmLnN1YnN0cmluZygwLCB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnNpbGVudF9yZWRpcmVjdF91cmkubGVuZ3RoKSA9PT0gdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5zaWxlbnRfcmVkaXJlY3RfdXJpKVxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgICAgdGhpcy5SZW5ld1Rva2VuU2lsZW50KCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vR28gSG9yc2VcclxuICAgICAgICAvLyBlbHNlXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgICBsZXQgZGVmZXIgPSBRLmRlZmVyPFRva2Vuc0NvbnRlbnRzPigpO1xyXG4gICAgICAgIC8vICAgICBkZWZlci5yZXNvbHZlKHRoaXMuVG9rZW5zQ29udGVudHMpO1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gZGVmZXIucHJvbWlzZTtcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBJbml0KGF1dGhlbnRpY2F0aW9uU2V0dGluZ3M/OiBJQXV0aGVudGljYXRpb25TZXR0aW5ncywgZm9yY2UgPSBmYWxzZSlcclxuICAgIHtcclxuICAgICAgICBpZihhdXRoZW50aWNhdGlvblNldHRpbmdzICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLklzSW5pdGlhbGl6ZWQgPT09IGZhbHNlIHx8IGZvcmNlID09PSB0cnVlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkluaXRpYWxpemUoYXV0aGVudGljYXRpb25TZXR0aW5ncyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBcIlNob3VsZCBiZSB1bml0aWFsaXphdGVkIHRvIGluaXRpYWxpemUuIFlvdSBhcmUgbWlzc2luZyB0aGUgZm9yY2UgcGFyYW1ldGVyP1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuUHJvY2Vzc1Rva2VuSWZOZWVkZWQoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIFJlZGlyZWN0VG9Jbml0aWFsUGFnZSh1cmkgOnN0cmluZylcclxuICAgIHtcclxuICAgICAgICBsb2NhdGlvbi5hc3NpZ24odXJpKTtcclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBWYWxpZGF0ZUluaXRpYWxpemF0aW9uKClcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aHJvdyBcIkF1dGhlbnRpY2F0aW9uQ29udGV4dCB1bmluaXRpYWxpemVkIVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICAvKipcclxuICAgICAqIE1ha2UgdGhlIGxvZ2luIGF0IHRoZSBjdXJyZW50IFVSSSwgYW5kIHByb2Nlc3MgdGhlIHJlY2VpdmVkIHRva2Vucy5cclxuICAgICAqIE9CUzogVGhlIFJlZGlyZWN0IFVSSSBbY2FsbGJhY2tfdXJsXSAodG8gcmVjZWl2ZSB0aGUgdG9rZW4pIGFuZCBTaWxlbnQgUmVmcmVzaCBGcmFtZSBVUkkgW3NpbGVudF9yZWRpcmVjdF91cmldICh0byBhdXRvIHJlbmV3IHdoZW4gZXhwaXJlZCkgaWYgbm90IGluZm9ybWVkIGlzIGF1dG8gZ2VuZXJhdGVkIGJhc2VkIG9uIHRoZSAnY2xpZW50X3VybCcgaW5mb3JtZWQgYXQgJ0luaXQnIG1ldGhvZCB3aXRoIHRoZSBmb2xsb3dpbiBzdHJhdGVneTpcclxuICAgICAqIGByZWRpcmVjdF91cmwgPSBjbGllbnRfdXJsICsgJz9jYWxsYmFjaz10cnVlJ2BcclxuICAgICAqIGBzaWxlbnRfcmVkaXJlY3RfdXJpID0gY2xpZW50X3VybCArICc/c2lsZW50cmVmcmVzaGZyYW1lPXRydWUnYCBcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3Blbk9uUG9wVXBdIChkZXNjcmlwdGlvbilcclxuICAgICAqL1xyXG4gICAgLy8gcHVibGljIExvZ2luQW5kUHJvY2Vzc1Rva2VuKG9wZW5PblBvcFVwPzogYm9vbGVhbilcclxuICAgIC8vIHtcclxuICAgIC8vICAgICB0aGlzLlZhbGlkYXRlSW5pdGlhbGl6YXRpb24oKTtcclxuICAgICAgICBcclxuICAgIC8vICAgICBsZXQgc2hvdWxkT3Blbk9uUG9wVXAgPSBvcGVuT25Qb3BVcCB8fCB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLm9wZW5fb25fcG9wdXA7XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgLy9pZiB0aGUgYWN0dWFsIHBhZ2UgaXMgdGhlICdyZWRpcmVjdF91cmknIChsb2FkZWQgZnJvbSB0aGUgbG9jYWxTdG9yYWdlKSwgdGhlbiBpIGNvbnNpZGVyIHRvICdwcm9jZXNzIHRoZSB0b2tlbiBjYWxsYmFjaycgIFxyXG4gICAgLy8gICAgIGlmKGxvY2F0aW9uLmhyZWYuc3Vic3RyaW5nKDAsIHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MucmVkaXJlY3RfdXJpLmxlbmd0aCkgPT09IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MucmVkaXJlY3RfdXJpKVxyXG4gICAgLy8gICAgIHtcclxuICAgIC8vICAgICAgICAgdGhpcy5Qcm9jZXNzVG9rZW5DYWxsYmFjaygpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICAvL2lmIHRoZSBhY3R1YWwgcGFnZSBpcyB0aGUgJ3NpbGVudF9yZWRpcmVjdF91cmknIChsb2FkZWQgZnJvbSB0aGUgbG9jYWxTdG9yYWdlKSwgdGhlbiBpIGNvbnNpZGVyIHRvICdwcm9jZXNzIHRoZSB0b2tlbiBjYWxsYmFjaydcclxuICAgIC8vICAgICBlbHNlIGlmIChsb2NhdGlvbi5ocmVmLnN1YnN0cmluZygwLCB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnNpbGVudF9yZWRpcmVjdF91cmkubGVuZ3RoKSA9PT0gdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5zaWxlbnRfcmVkaXJlY3RfdXJpKVxyXG4gICAgLy8gICAgIHtcclxuICAgIC8vICAgICAgICAgdGhpcy5SZW5ld1Rva2VuU2lsZW50KCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIC8vaWYgdGhlIGFjdHVhbCBwYWdlIGlzIHRoZSAnY2xpZW50X3VybCcsIHRoZW4gaSBjb25zaWRlciB0byBtYWtlIHRoZSAnbG9naW4nXHJcbiAgICAvLyAgICAgZWxzZSBpZihsb2NhdGlvbi5ocmVmLnN1YnN0cmluZygwLCB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLmNsaWVudF91cmwubGVuZ3RoKSA9PT0gdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5jbGllbnRfdXJsKVxyXG4gICAgLy8gICAgIHtcclxuICAgIC8vICAgICAgICAgaWYodGhpcy5Jc0F1dGhlbnRpY2F0ZWQgPT09IGZhbHNlKVxyXG4gICAgLy8gICAgICAgICB7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLkxvZ2luKHNob3VsZE9wZW5PblBvcFVwKTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuICAgIFxyXG4gICAgcHVibGljIExvZ2luKG9wZW5PblBvcFVwPzogYm9vbGVhbilcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLlRva2Vuc0NvbnRlbnRzLklzQXV0aGVudGljYXRlZCA9PT0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLlZhbGlkYXRlSW5pdGlhbGl6YXRpb24oKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB1cmlUb0lkUCA9IHRoaXMuY2xpZW50T0F1dGgyLnRva2VuLmdldFVyaSgpLnJlcGxhY2UoJ3Rva2VuJywgJ2NvZGUlMjBpZF90b2tlbiUyMHRva2VuJm5vbmNlPTEyMycpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5SZWRpcmVjdFRvSW5pdGlhbFBhZ2UodXJpVG9JZFApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ0FscmVhZHkgYXV0aGVudGljYXRlZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IElzQXV0aGVudGljYXRlZCgpIDpib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5Ub2tlbnNDb250ZW50cy5Jc0F1dGhlbnRpY2F0ZWQgPT09IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBUb2tlbnNDb250ZW50cygpIDogVG9rZW5zQ29udGVudHNcclxuICAgIHtcclxuICAgICAgICBsZXQgdG9rZW5Db250ZW50cyA9IG5ldyBUb2tlbnNDb250ZW50cygpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB0b2tlbkNvbnRlbnRzLkFjY2Vzc1Rva2VuQ29udGVudCA9IHRoaXMuQWNjZXNzVG9rZW5Db250ZW50O1xyXG4gICAgICAgIHRva2VuQ29udGVudHMuSWRlbnRpdHlUb2tlbkNvbnRlbnQgPSB0aGlzLklkZW50aXR5VG9rZW5Db250ZW50O1xyXG4gICAgICAgIHRva2VuQ29udGVudHMuUHJvZmlsZUNvbnRlbnQgPSB0aGlzLlByb2ZpbGVDb250ZW50O1xyXG5cclxuICAgICAgICByZXR1cm4gdG9rZW5Db250ZW50cztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IEFjY2Vzc1Rva2VuKCk6IHN0cmluZyBcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5jbGllbnRPQXV0aDIgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB0b2tlblVyaSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdUb2tlblVyaScpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYodG9rZW5VcmkgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsaWVudE9BdXRoMlRva2VuID0gdGhpcy5jbGllbnRPQXV0aDIudG9rZW4uZ2V0VG9rZW4odG9rZW5VcmkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsaWVudE9BdXRoMlRva2VuLmFjY2Vzc1Rva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IEFjY2Vzc1Rva2VuQ29udGVudCgpOiBhbnkgXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuQWNjZXNzVG9rZW4gIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gYXRvYih0aGlzLkFjY2Vzc1Rva2VuLnNwbGl0KCcuJylbMV0pO1xyXG4gICAgICAgICAgICBsZXQgcmV0b3JubyA9IEpTT04ucGFyc2UoY29udGVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXRvcm5vO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIGdldCBJZGVudGl0eVRva2VuKCk6IHN0cmluZyBcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5jbGllbnRPQXV0aDIgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCB0b2tlblVyaSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdUb2tlblVyaScpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYodG9rZW5VcmkgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNsaWVudE9BdXRoMlRva2VuID0gdGhpcy5jbGllbnRPQXV0aDIudG9rZW4uZ2V0VG9rZW4odG9rZW5VcmkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNsaWVudE9BdXRoMlRva2VuLmlkZW50aXR5VG9rZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgSWRlbnRpdHlUb2tlbkNvbnRlbnQoKTogYW55IFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLklkZW50aXR5VG9rZW4gIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50ID0gYXRvYih0aGlzLklkZW50aXR5VG9rZW4uc3BsaXQoJy4nKVsxXSk7XHJcbiAgICAgICAgICAgIGxldCByZXRvcm5vID0gSlNPTi5wYXJzZShjb250ZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldG9ybm87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IFByb2ZpbGVDb250ZW50KCk6IGFueVxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmNsaWVudE9BdXRoMiAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5BY2Nlc3NUb2tlbiAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdXNlckluZm9SZXNwb25zZSA9IHRoaXMuY2xpZW50T0F1dGgyLnRva2VuLmdldFVzZXJJbmZvKHRoaXMuQWNjZXNzVG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVzZXJJbmZvUmVzcG9uc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIC8vVE9ETzogU3BsaXQgdGhlIHBhcnNlciB0byBhbm90aGVyIHByb2plY3QgKHBhY2thZ2UgLSB0cy1zZWN1cml0eS10b2tlbnM/KVxyXG4gICAgLy8gLy9JbmNsdWRlIHJlZmFjdG9yeSBhdCB0aGUgdHMtc2VjdXJpdHktaWRlbnRpdHkgYWxzb1xyXG4gICAgLy8gcHJvdGVjdGVkIEdlbmVyYXRlVG9rZW5zKClcclxuICAgIC8vIHtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgLy8gICAgICAgICBpZih0aGlzLm9pZGNUb2tlbk1hbmFnZXIucHJvZmlsZSAhPSBudWxsKVxyXG4gICAgLy8gICAgICAgICB7XHJcbiAgICAvLyAgICAgICAgICAgICB0aGlzLlByb2ZpbGVDb250ZW50ID0gdGhpcy5vaWRjVG9rZW5NYW5hZ2VyLnByb2ZpbGU7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgLy8gdGhpcy5BY2Nlc3NUb2tlbkNvbnRlbnQgPSBKU09OLnBhcnNlKGF0b2IodGhpcy5vaWRjVG9rZW5NYW5hZ2VyLmFjY2Vzc190b2tlbi5zcGxpdCgnLicpWzFdKSk7XHJcbiAgICAvLyAgICAgLy8gdGhpcy5JZGVudGl0eVRva2VuQ29udGVudCA9IEpTT04ucGFyc2UoYXRvYih0aGlzLm9pZGNUb2tlbk1hbmFnZXIuaWRfdG9rZW4uc3BsaXQoJy4nKVsxXSkpO1xyXG4gICAgLy8gICAgIC8vIHRoaXMuUHJvZmlsZUNvbnRlbnQgPSB0aGlzLm9pZGNUb2tlbk1hbmFnZXIucHJvZmlsZTtcclxuICAgIC8vIH1cclxuICAgIFxyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFRva2Vuc0NvbnRlbnRzXHJcbntcclxuICAgIHB1YmxpYyBnZXQgSXNBdXRoZW50aWNhdGVkKCkgOmJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLkFjY2Vzc1Rva2VuQ29udGVudCA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3Byb2ZpbGVDb250ZW50OiBhbnk7XHJcbiAgICBwdWJsaWMgZ2V0IFByb2ZpbGVDb250ZW50KCk6IGFueVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9maWxlQ29udGVudDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgUHJvZmlsZUNvbnRlbnQodmFsdWU6IGFueSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9wcm9maWxlQ29udGVudCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIHByaXZhdGUgX2FjY2Vzc1Rva2VuQ29udGVudDogYW55O1xyXG4gICAgcHVibGljIGdldCBBY2Nlc3NUb2tlbkNvbnRlbnQoKTogYW55XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2Vzc1Rva2VuQ29udGVudDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgQWNjZXNzVG9rZW5Db250ZW50KHZhbHVlOiBhbnkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW5Db250ZW50ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfaWRlbnRpdHlUb2tlbkNvbnRlbnQ6IGFueTtcclxuICAgIHB1YmxpYyBnZXQgSWRlbnRpdHlUb2tlbkNvbnRlbnQoKTogYW55XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkZW50aXR5VG9rZW5Db250ZW50O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBJZGVudGl0eVRva2VuQ29udGVudCh2YWx1ZTogYW55KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2lkZW50aXR5VG9rZW5Db250ZW50ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgcHVibGljIFRvQXJyYXkoKSA6IEFycmF5PGFueT5cclxuICAgIHtcclxuICAgICAgICByZXR1cm4gWyB0aGlzLklkZW50aXR5VG9rZW5Db250ZW50LCB0aGlzLkFjY2Vzc1Rva2VuQ29udGVudCwgdGhpcy5Qcm9maWxlQ29udGVudCBdO1xyXG4gICAgfVxyXG59Il19
