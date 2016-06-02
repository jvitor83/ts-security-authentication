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
                            var content = btoa(this.AccessToken.split('.')[1]);
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
                            var content = btoa(this.IdentityToken.split('.')[1]);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9BdXRoZW50aWNhdGlvbkNvbnRleHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7WUFZQTs7ZUFFRztZQUNIO2dCQWlDSTtvQkFFSSxJQUFJLHVDQUF1QyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztvQkFDakYsRUFBRSxDQUFBLENBQUMsdUNBQXVDLElBQUksSUFBSSxDQUFDLENBQ25ELENBQUM7d0JBQ0csSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLG1CQUFtQixDQUFDLFlBQVksQ0FBRSx1Q0FBdUMsQ0FBRSxDQUFDO29CQUN4RyxDQUFDO2dCQUNMLENBQUM7Z0JBbkNELHNCQUFrQixnQ0FBTzt5QkFBekI7d0JBRUksRUFBRSxDQUFBLENBQUMscUJBQXFCLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUMzQyxDQUFDOzRCQUNHLHFCQUFxQixDQUFDLFFBQVEsR0FBSSxJQUFJLHFCQUFxQixFQUFFLENBQUM7d0JBQ2xFLENBQUM7d0JBQ0QsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQztvQkFDMUMsQ0FBQzs7O21CQUFBO2dCQUVELHNCQUFXLGdEQUFhO3lCQUF4Qjt3QkFFSSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLElBQUksSUFBSSxDQUFDLENBQzlDLENBQUM7NEJBQ0csTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDaEIsQ0FBQzt3QkFDRCxJQUFJLENBQ0osQ0FBQzs0QkFDRyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUNqQixDQUFDO29CQUNMLENBQUM7OzttQkFBQTtnQkFFYSwyQkFBSyxHQUFuQjtvQkFFSSxxQkFBcUIsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUMxQyxDQUFDO2dCQWFELHNCQUFjLGdFQUE2Qjt5QkFBM0M7d0JBRUksSUFBSSxzQ0FBc0MsR0FBbUMsSUFBSSxDQUFDO3dCQUNsRixJQUFJLCtDQUErQyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsK0JBQStC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O2dCQVFELHNCQUFXLGdEQUFvQjt5QkFBL0I7d0JBRUksTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztvQkFDdEMsQ0FBQzt5QkFDRCxVQUFnQyxLQUFVO3dCQUV0QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO29CQUN2QyxDQUFDOzs7bUJBSkE7Z0JBT00sZ0NBQU8sR0FBZDtvQkFFSSxNQUFNLENBQUMsQ0FBRSxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxjQUFjLENBQUUsQ0FBQztnQkFDdkYsQ0FBQztnQkFDTCxxQkFBQztZQUFELENBbkRBLEFBbURDLElBQUE7WUFuREQsMkNBbURDLENBQUEiLCJmaWxlIjoic3JjL0F1dGhlbnRpY2F0aW9uQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBdXRoZW50aWNhdGlvblNldHRpbmdzIH0gZnJvbSAnLi9JQXV0aGVudGljYXRpb25TZXR0aW5ncyc7XHJcbmltcG9ydCB7IElBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncyB9IGZyb20gJy4vSUF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzJztcclxuLy9yZXF1aXJlKCdvaWRjLXRva2VuLW1hbmFnZXInKTtcclxuLy9pbXBvcnQgJ29pZGMtdG9rZW4tbWFuYWdlci9kaXN0L29pZGMtdG9rZW4tbWFuYWdlci5qcyc7XHJcbi8vaW1wb3J0ICogYXMgUSBmcm9tICdxJztcclxuLy9pbXBvcnQgJ29pZGMtdG9rZW4tbWFuYWdlcic7XHJcbi8vaW1wb3J0ICdjbGllbnQtb2F1dGgyJztcclxuXHJcbmltcG9ydCAqIGFzIE9wZW5JRENvbm5lY3RDbGllbnQgZnJvbSAndHMtY2xpZW50LW9wZW5pZGNvbm5lY3QnO1xyXG5cclxuXHJcblxyXG4vKipcclxuICogQXV0aGVudGljYXRpb25Jbml0aWFsaXplclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEF1dGhlbnRpY2F0aW9uQ29udGV4dCBcclxue1xyXG4gICAgXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfY3VycmVudDogQXV0aGVudGljYXRpb25Db250ZXh0ID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldCBDdXJyZW50KCk6IEF1dGhlbnRpY2F0aW9uQ29udGV4dCBcclxuICAgIHtcclxuICAgICAgICBpZihBdXRoZW50aWNhdGlvbkNvbnRleHQuX2N1cnJlbnQgPT09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBBdXRoZW50aWNhdGlvbkNvbnRleHQuX2N1cnJlbnQgPSAgbmV3IEF1dGhlbnRpY2F0aW9uQ29udGV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQXV0aGVudGljYXRpb25Db250ZXh0Ll9jdXJyZW50O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgZ2V0IElzSW5pdGlhbGl6ZWQoKVxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgc3RhdGljIFJlc2V0KClcclxuICAgIHtcclxuICAgICAgICBBdXRoZW50aWNhdGlvbkNvbnRleHQuX2N1cnJlbnQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xpZW50T0F1dGgyOiBPcGVuSURDb25uZWN0Q2xpZW50LkNsaWVudE9BdXRoMjtcclxuICAgICAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkgXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3NMb2FkZWRGcm9tU3RvcmFnZSA9IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3M7XHJcbiAgICAgICAgaWYoYXV0aGVudGljYXRpb25TZXR0aW5nc0xvYWRlZEZyb21TdG9yYWdlICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmNsaWVudE9BdXRoMiA9IG5ldyBPcGVuSURDb25uZWN0Q2xpZW50LkNsaWVudE9BdXRoMiggYXV0aGVudGljYXRpb25TZXR0aW5nc0xvYWRlZEZyb21TdG9yYWdlICk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IEF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzKCk6IElBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncyBcclxuICAgIHtcclxuICAgICAgICBsZXQgYXV0aGVudGljYXRpb25TZXR0aW5nc0Zyb21Mb2NhbFN0b3JhZ2U6IElBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncyA9IG51bGw7XHJcbiAgICAgICAgbGV0IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3NGcm9tTG9jYWxTdG9yYWdlU3RyaW5naWZ5ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ0F1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzJyk7XHJcbiAgICAgICAgaWYoYXV0aGVudGljYXRpb25TZXR0aW5nc0Zyb21Mb2NhbFN0b3JhZ2VTdHJpbmdpZnkgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uU2V0dGluZ3NGcm9tTG9jYWxTdG9yYWdlID0gSlNPTi5wYXJzZShhdXRoZW50aWNhdGlvblNldHRpbmdzRnJvbUxvY2FsU3RvcmFnZVN0cmluZ2lmeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhdXRoZW50aWNhdGlvblNldHRpbmdzRnJvbUxvY2FsU3RvcmFnZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIHNldCBBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncyh2YWx1ZTogSUF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzKVxyXG4gICAge1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncycsIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBJbml0aWFsaXplKGF1dGhlbnRpY2F0aW9uU2V0dGluZ3M6IElBdXRoZW50aWNhdGlvblNldHRpbmdzKVxyXG4gICAge1xyXG4gICAgICAgIGlmKGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuYXV0aG9yaXR5ID09IG51bGwgfHwgYXV0aGVudGljYXRpb25TZXR0aW5ncy5jbGllbnRfaWQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRocm93IFwiU2hvdWxkIGJlIGluZm9ybWVkIGF0IGxlYXN0ICdhdXRob3JpdHknIGFuZCAnY2xpZW50X2lkJyFcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9TZXQgZGVmYXVsdCB2YWx1ZXMgaWYgbm90IGluZm9ybWVkXHJcbiAgICAgICAgYXV0aGVudGljYXRpb25TZXR0aW5ncy5jbGllbnRfdXJsID0gYXV0aGVudGljYXRpb25TZXR0aW5ncy5jbGllbnRfdXJsIHx8IGxvY2F0aW9uLmhyZWY7IC8vU2VsZiB1cmlcclxuICAgICAgICBhdXRoZW50aWNhdGlvblNldHRpbmdzLnNjb3BlID0gYXV0aGVudGljYXRpb25TZXR0aW5ncy5zY29wZSB8fCAnb3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MnOyAvL09wZW5JZCBkZWZhdWx0IHNjb3Blc1xyXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MucmVzcG9uc2VfdHlwZSA9IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MucmVzcG9uc2VfdHlwZSB8fCAnY29kZSBpZF90b2tlbiB0b2tlbic7IC8vSHlicmlkIGZsb3cgYXQgZGVmYXVsdFxyXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uU2V0dGluZ3Mub3Blbl9vbl9wb3B1cCA9IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3Mub3Blbl9vbl9wb3B1cCB8fCBmYWxzZTsgLy9SZWRpcmVjdCBmb3IgZGVmYXVsdFxyXG5cclxuICAgICAgICAvL0NvbnZlcnQgdG8gdGhlIG1vcmUgY29tcGxldGUgSUF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzXHJcbiAgICAgICAgdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncyA9IFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYXV0aG9yaXR5OiBhdXRoZW50aWNhdGlvblNldHRpbmdzLmF1dGhvcml0eSxcclxuICAgICAgICAgICAgY2xpZW50X2lkOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLmNsaWVudF9pZCxcclxuICAgICAgICAgICAgY2xpZW50X3VybDogYXV0aGVudGljYXRpb25TZXR0aW5ncy5jbGllbnRfdXJsLFxyXG4gICAgICAgICAgICBvcGVuX29uX3BvcHVwOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLm9wZW5fb25fcG9wdXAsXHJcbiAgICAgICAgICAgIHJlc3BvbnNlX3R5cGU6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MucmVzcG9uc2VfdHlwZSxcclxuICAgICAgICAgICAgc2NvcGU6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3Muc2NvcGUsXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICByZWRpcmVjdF91cmkgOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLmNsaWVudF91cmwsXHJcbiAgICAgICAgICAgIHNpbGVudF9yZWRpcmVjdF91cmk6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuY2xpZW50X3VybCArIFwiP3NpbGVudHJlZnJlc2hmcmFtZT10cnVlXCIsXHJcbiAgICAgICAgICAgIHBvc3RfbG9nb3V0X3JlZGlyZWN0X3VyaTogYXV0aGVudGljYXRpb25TZXR0aW5ncy5jbGllbnRfdXJsLFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgYXV0aG9yaXphdGlvbl91cmwgOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLmF1dGhvcml0eSArIFwiL2Nvbm5lY3QvYXV0aG9yaXplXCIsXHJcbiAgICAgICAgICAgIHRva2VuX3VybCA6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuYXV0aG9yaXR5ICsgXCIvY29ubmVjdC90b2tlblwiLFxyXG4gICAgICAgICAgICB1c2VyaW5mb191cmw6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuYXV0aG9yaXR5ICsgXCIvY29ubmVjdC91c2VyaW5mb1wiLFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbG9hZF91c2VyX3Byb2ZpbGU6IHRydWUsXHJcbiAgICAgICAgICAgIHNpbGVudF9yZW5ldzogdHJ1ZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzZXR0aW5ncyA9IFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY2xpZW50SWQ6IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MuY2xpZW50X2lkLFxyXG4gICAgICAgICAgICBjbGllbnRTZWNyZXQ6ICdzZWNyZXQnLFxyXG4gICAgICAgICAgICBhY2Nlc3NUb2tlblVyaTogdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy50b2tlbl91cmwsXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25Vcmk6IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MuYXV0aG9yaXphdGlvbl91cmwsXHJcbiAgICAgICAgICAgIHVzZXJJbmZvVXJpOiB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnVzZXJpbmZvX3VybCxcclxuICAgICAgICAgICAgYXV0aG9yaXphdGlvbkdyYW50czogWydjcmVkZW50aWFscyddLFxyXG4gICAgICAgICAgICByZWRpcmVjdFVyaTogdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5yZWRpcmVjdF91cmksXHJcbiAgICAgICAgICAgIHNjb3BlczogdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5zY29wZS5zcGxpdCgnICcpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmNsaWVudE9BdXRoMiA9IG5ldyBPcGVuSURDb25uZWN0Q2xpZW50LkNsaWVudE9BdXRoMihzZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBQcm9jZXNzVG9rZW5JZk5lZWRlZCgpXHJcbiAgICB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy9pZiB0aGUgYWN0dWFsIHBhZ2UgaXMgdGhlICdyZWRpcmVjdF91cmknIChsb2FkZWQgZnJvbSB0aGUgbG9jYWxTdG9yYWdlKSwgdGhlbiBpIGNvbnNpZGVyIHRvICdwcm9jZXNzIHRoZSB0b2tlbiBjYWxsYmFjaycgIFxyXG4gICAgICAgIC8vaWYobG9jYXRpb24uaHJlZi5zdWJzdHJpbmcoMCwgdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5yZWRpcmVjdF91cmkubGVuZ3RoKSA9PT0gdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5yZWRpcmVjdF91cmkpXHJcbiAgICAgICAgaWYobG9jYXRpb24uaHJlZi5pbmRleE9mKCdhY2Nlc3NfdG9rZW49JykgPiAtMSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQcm9jZXNzaW5nIHRva2VuIScpO1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVG9rZW5VcmknLCBsb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gLy9pZiB0aGUgYWN0dWFsIHBhZ2UgaXMgdGhlICdzaWxlbnRfcmVkaXJlY3RfdXJpJyAobG9hZGVkIGZyb20gdGhlIGxvY2FsU3RvcmFnZSksIHRoZW4gaSBjb25zaWRlciB0byAncHJvY2VzcyB0aGUgdG9rZW4gY2FsbGJhY2snXHJcbiAgICAgICAgLy8gZWxzZSBpZiAobG9jYXRpb24uaHJlZi5zdWJzdHJpbmcoMCwgdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5zaWxlbnRfcmVkaXJlY3RfdXJpLmxlbmd0aCkgPT09IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3Muc2lsZW50X3JlZGlyZWN0X3VyaSlcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuUmVuZXdUb2tlblNpbGVudCgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvL0dvIEhvcnNlXHJcbiAgICAgICAgLy8gZWxzZVxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgICAgbGV0IGRlZmVyID0gUS5kZWZlcjxUb2tlbnNDb250ZW50cz4oKTtcclxuICAgICAgICAvLyAgICAgZGVmZXIucmVzb2x2ZSh0aGlzLlRva2Vuc0NvbnRlbnRzKTtcclxuICAgICAgICAvLyAgICAgcmV0dXJuIGRlZmVyLnByb21pc2U7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgSW5pdChhdXRoZW50aWNhdGlvblNldHRpbmdzPzogSUF1dGhlbnRpY2F0aW9uU2V0dGluZ3MsIGZvcmNlID0gZmFsc2UpXHJcbiAgICB7XHJcbiAgICAgICAgaWYoYXV0aGVudGljYXRpb25TZXR0aW5ncyAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5Jc0luaXRpYWxpemVkID09PSBmYWxzZSB8fCBmb3JjZSA9PT0gdHJ1ZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Jbml0aWFsaXplKGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgXCJTaG91bGQgYmUgdW5pdGlhbGl6YXRlZCB0byBpbml0aWFsaXplLiBZb3UgYXJlIG1pc3NpbmcgdGhlIGZvcmNlIHBhcmFtZXRlcj9cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLlByb2Nlc3NUb2tlbklmTmVlZGVkKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBSZWRpcmVjdFRvSW5pdGlhbFBhZ2UodXJpIDpzdHJpbmcpXHJcbiAgICB7XHJcbiAgICAgICAgbG9jYXRpb24uYXNzaWduKHVyaSk7XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgVmFsaWRhdGVJbml0aWFsaXphdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncyA9PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhyb3cgXCJBdXRoZW50aWNhdGlvbkNvbnRleHQgdW5pbml0aWFsaXplZCFcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgLyoqXHJcbiAgICAgKiBNYWtlIHRoZSBsb2dpbiBhdCB0aGUgY3VycmVudCBVUkksIGFuZCBwcm9jZXNzIHRoZSByZWNlaXZlZCB0b2tlbnMuXHJcbiAgICAgKiBPQlM6IFRoZSBSZWRpcmVjdCBVUkkgW2NhbGxiYWNrX3VybF0gKHRvIHJlY2VpdmUgdGhlIHRva2VuKSBhbmQgU2lsZW50IFJlZnJlc2ggRnJhbWUgVVJJIFtzaWxlbnRfcmVkaXJlY3RfdXJpXSAodG8gYXV0byByZW5ldyB3aGVuIGV4cGlyZWQpIGlmIG5vdCBpbmZvcm1lZCBpcyBhdXRvIGdlbmVyYXRlZCBiYXNlZCBvbiB0aGUgJ2NsaWVudF91cmwnIGluZm9ybWVkIGF0ICdJbml0JyBtZXRob2Qgd2l0aCB0aGUgZm9sbG93aW4gc3RyYXRlZ3k6XHJcbiAgICAgKiBgcmVkaXJlY3RfdXJsID0gY2xpZW50X3VybCArICc/Y2FsbGJhY2s9dHJ1ZSdgXHJcbiAgICAgKiBgc2lsZW50X3JlZGlyZWN0X3VyaSA9IGNsaWVudF91cmwgKyAnP3NpbGVudHJlZnJlc2hmcmFtZT10cnVlJ2AgXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wZW5PblBvcFVwXSAoZGVzY3JpcHRpb24pXHJcbiAgICAgKi9cclxuICAgIC8vIHB1YmxpYyBMb2dpbkFuZFByb2Nlc3NUb2tlbihvcGVuT25Qb3BVcD86IGJvb2xlYW4pXHJcbiAgICAvLyB7XHJcbiAgICAvLyAgICAgdGhpcy5WYWxpZGF0ZUluaXRpYWxpemF0aW9uKCk7XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgbGV0IHNob3VsZE9wZW5PblBvcFVwID0gb3Blbk9uUG9wVXAgfHwgdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5vcGVuX29uX3BvcHVwO1xyXG4gICAgICAgIFxyXG4gICAgLy8gICAgIC8vaWYgdGhlIGFjdHVhbCBwYWdlIGlzIHRoZSAncmVkaXJlY3RfdXJpJyAobG9hZGVkIGZyb20gdGhlIGxvY2FsU3RvcmFnZSksIHRoZW4gaSBjb25zaWRlciB0byAncHJvY2VzcyB0aGUgdG9rZW4gY2FsbGJhY2snICBcclxuICAgIC8vICAgICBpZihsb2NhdGlvbi5ocmVmLnN1YnN0cmluZygwLCB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnJlZGlyZWN0X3VyaS5sZW5ndGgpID09PSB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnJlZGlyZWN0X3VyaSlcclxuICAgIC8vICAgICB7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuUHJvY2Vzc1Rva2VuQ2FsbGJhY2soKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgLy9pZiB0aGUgYWN0dWFsIHBhZ2UgaXMgdGhlICdzaWxlbnRfcmVkaXJlY3RfdXJpJyAobG9hZGVkIGZyb20gdGhlIGxvY2FsU3RvcmFnZSksIHRoZW4gaSBjb25zaWRlciB0byAncHJvY2VzcyB0aGUgdG9rZW4gY2FsbGJhY2snXHJcbiAgICAvLyAgICAgZWxzZSBpZiAobG9jYXRpb24uaHJlZi5zdWJzdHJpbmcoMCwgdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5zaWxlbnRfcmVkaXJlY3RfdXJpLmxlbmd0aCkgPT09IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3Muc2lsZW50X3JlZGlyZWN0X3VyaSlcclxuICAgIC8vICAgICB7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuUmVuZXdUb2tlblNpbGVudCgpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICAvL2lmIHRoZSBhY3R1YWwgcGFnZSBpcyB0aGUgJ2NsaWVudF91cmwnLCB0aGVuIGkgY29uc2lkZXIgdG8gbWFrZSB0aGUgJ2xvZ2luJ1xyXG4gICAgLy8gICAgIGVsc2UgaWYobG9jYXRpb24uaHJlZi5zdWJzdHJpbmcoMCwgdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5jbGllbnRfdXJsLmxlbmd0aCkgPT09IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MuY2xpZW50X3VybClcclxuICAgIC8vICAgICB7XHJcbiAgICAvLyAgICAgICAgIGlmKHRoaXMuSXNBdXRoZW50aWNhdGVkID09PSBmYWxzZSlcclxuICAgIC8vICAgICAgICAge1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5Mb2dpbihzaG91bGRPcGVuT25Qb3BVcCk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9XHJcbiAgICAvLyB9XHJcbiAgICBcclxuICAgIHB1YmxpYyBMb2dpbihvcGVuT25Qb3BVcD86IGJvb2xlYW4pXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5Ub2tlbnNDb250ZW50cy5Jc0F1dGhlbnRpY2F0ZWQgPT09IGZhbHNlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5WYWxpZGF0ZUluaXRpYWxpemF0aW9uKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdXJpVG9JZFAgPSB0aGlzLmNsaWVudE9BdXRoMi50b2tlbi5nZXRVcmkoKS5yZXBsYWNlKCd0b2tlbicsICdjb2RlJTIwaWRfdG9rZW4lMjB0b2tlbiZub25jZT0xMjMnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuUmVkaXJlY3RUb0luaXRpYWxQYWdlKHVyaVRvSWRQKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdBbHJlYWR5IGF1dGhlbnRpY2F0ZWQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBJc0F1dGhlbnRpY2F0ZWQoKSA6Ym9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuVG9rZW5zQ29udGVudHMuSXNBdXRoZW50aWNhdGVkID09PSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgVG9rZW5zQ29udGVudHMoKSA6IFRva2Vuc0NvbnRlbnRzXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHRva2VuQ29udGVudHMgPSBuZXcgVG9rZW5zQ29udGVudHMoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgdG9rZW5Db250ZW50cy5BY2Nlc3NUb2tlbkNvbnRlbnQgPSB0aGlzLkFjY2Vzc1Rva2VuQ29udGVudDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRva2VuQ29udGVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldCBBY2Nlc3NUb2tlbigpOiBzdHJpbmcgXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50T0F1dGgyICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgdG9rZW5VcmkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVG9rZW5VcmknKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRva2VuVXJpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbGllbnRPQXV0aDJUb2tlbiA9IHRoaXMuY2xpZW50T0F1dGgyLnRva2VuLmdldFRva2VuKHRva2VuVXJpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGllbnRPQXV0aDJUb2tlbi5hY2Nlc3NUb2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldCBBY2Nlc3NUb2tlbkNvbnRlbnQoKTogYW55IFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLkFjY2Vzc1Rva2VuICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IGJ0b2EodGhpcy5BY2Nlc3NUb2tlbi5zcGxpdCgnLicpWzFdKTtcclxuICAgICAgICAgICAgbGV0IHJldG9ybm8gPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0b3JubztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBnZXQgSWRlbnRpdHlUb2tlbigpOiBzdHJpbmcgXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50T0F1dGgyICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgdG9rZW5VcmkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVG9rZW5VcmknKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRva2VuVXJpICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCBjbGllbnRPQXV0aDJUb2tlbiA9IHRoaXMuY2xpZW50T0F1dGgyLnRva2VuLmdldFRva2VuKHRva2VuVXJpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjbGllbnRPQXV0aDJUb2tlbi5pZGVudGl0eVRva2VuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IElkZW50aXR5VG9rZW5Db250ZW50KCk6IGFueSBcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5JZGVudGl0eVRva2VuICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgY29udGVudCA9IGJ0b2EodGhpcy5JZGVudGl0eVRva2VuLnNwbGl0KCcuJylbMV0pO1xyXG4gICAgICAgICAgICBsZXQgcmV0b3JubyA9IEpTT04ucGFyc2UoY29udGVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXRvcm5vO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIGdldCBQcm9maWxlQ29udGVudCgpOiBhbnlcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5jbGllbnRPQXV0aDIgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuQWNjZXNzVG9rZW4gIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVzZXJJbmZvUmVzcG9uc2UgPSB0aGlzLmNsaWVudE9BdXRoMi50b2tlbi5nZXRVc2VySW5mbyh0aGlzLkFjY2Vzc1Rva2VuKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1c2VySW5mb1Jlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyAvL1RPRE86IFNwbGl0IHRoZSBwYXJzZXIgdG8gYW5vdGhlciBwcm9qZWN0IChwYWNrYWdlIC0gdHMtc2VjdXJpdHktdG9rZW5zPylcclxuICAgIC8vIC8vSW5jbHVkZSByZWZhY3RvcnkgYXQgdGhlIHRzLXNlY3VyaXR5LWlkZW50aXR5IGFsc29cclxuICAgIC8vIHByb3RlY3RlZCBHZW5lcmF0ZVRva2VucygpXHJcbiAgICAvLyB7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgIC8vICAgICAgICAgaWYodGhpcy5vaWRjVG9rZW5NYW5hZ2VyLnByb2ZpbGUgIT0gbnVsbClcclxuICAgIC8vICAgICAgICAge1xyXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5Qcm9maWxlQ29udGVudCA9IHRoaXMub2lkY1Rva2VuTWFuYWdlci5wcm9maWxlO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgLy8gICAgIC8vIHRoaXMuQWNjZXNzVG9rZW5Db250ZW50ID0gSlNPTi5wYXJzZShhdG9iKHRoaXMub2lkY1Rva2VuTWFuYWdlci5hY2Nlc3NfdG9rZW4uc3BsaXQoJy4nKVsxXSkpO1xyXG4gICAgLy8gICAgIC8vIHRoaXMuSWRlbnRpdHlUb2tlbkNvbnRlbnQgPSBKU09OLnBhcnNlKGF0b2IodGhpcy5vaWRjVG9rZW5NYW5hZ2VyLmlkX3Rva2VuLnNwbGl0KCcuJylbMV0pKTtcclxuICAgIC8vICAgICAvLyB0aGlzLlByb2ZpbGVDb250ZW50ID0gdGhpcy5vaWRjVG9rZW5NYW5hZ2VyLnByb2ZpbGU7XHJcbiAgICAvLyB9XHJcbiAgICBcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUb2tlbnNDb250ZW50c1xyXG57XHJcbiAgICBwdWJsaWMgZ2V0IElzQXV0aGVudGljYXRlZCgpIDpib29sZWFuXHJcbiAgICB7XHJcbiAgICAgICAgaWYodGhpcy5BY2Nlc3NUb2tlbkNvbnRlbnQgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9wcm9maWxlQ29udGVudDogYW55O1xyXG4gICAgcHVibGljIGdldCBQcm9maWxlQ29udGVudCgpOiBhbnlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJvZmlsZUNvbnRlbnQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IFByb2ZpbGVDb250ZW50KHZhbHVlOiBhbnkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5fcHJvZmlsZUNvbnRlbnQgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9hY2Nlc3NUb2tlbkNvbnRlbnQ6IGFueTtcclxuICAgIHB1YmxpYyBnZXQgQWNjZXNzVG9rZW5Db250ZW50KCk6IGFueVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hY2Nlc3NUb2tlbkNvbnRlbnQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IEFjY2Vzc1Rva2VuQ29udGVudCh2YWx1ZTogYW55KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuQ29udGVudCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIHByaXZhdGUgX2lkZW50aXR5VG9rZW5Db250ZW50OiBhbnk7XHJcbiAgICBwdWJsaWMgZ2V0IElkZW50aXR5VG9rZW5Db250ZW50KCk6IGFueVxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pZGVudGl0eVRva2VuQ29udGVudDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgSWRlbnRpdHlUb2tlbkNvbnRlbnQodmFsdWU6IGFueSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9pZGVudGl0eVRva2VuQ29udGVudCA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIHB1YmxpYyBUb0FycmF5KCkgOiBBcnJheTxhbnk+XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIFsgdGhpcy5JZGVudGl0eVRva2VuQ29udGVudCwgdGhpcy5BY2Nlc3NUb2tlbkNvbnRlbnQsIHRoaXMuUHJvZmlsZUNvbnRlbnQgXTtcclxuICAgIH1cclxufSJdfQ==
