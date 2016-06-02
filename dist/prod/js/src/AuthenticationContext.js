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
                    authenticationSettings.client_url = authenticationSettings.client_url || location.href;
                    authenticationSettings.scope = authenticationSettings.scope || 'openid profile email offline_access';
                    authenticationSettings.response_type = authenticationSettings.response_type || 'code id_token token';
                    authenticationSettings.open_on_popup = authenticationSettings.open_on_popup || false;
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
                    if (location.href.indexOf('access_token=') > -1) {
                        console.log('Processing token!');
                        localStorage.setItem('TokenUri', location.href);
                    }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGhlbnRpY2F0aW9uQ29udGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztZQWVBO2dCQWlDSTtvQkFFSSxJQUFJLHVDQUF1QyxHQUFHLElBQUksQ0FBQyw2QkFBNkIsQ0FBQztvQkFDakYsRUFBRSxDQUFBLENBQUMsdUNBQXVDLElBQUksSUFBSSxDQUFDLENBQ25ELENBQUM7d0JBQ0csSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLG1CQUFtQixDQUFDLFlBQVksQ0FBRSx1Q0FBdUMsQ0FBRSxDQUFDO29CQUN4RyxDQUFDO2dCQUNMLENBQUM7Z0JBbkNELHNCQUFrQixnQ0FBTzt5QkFBekI7d0JBRUksRUFBRSxDQUFBLENBQUMscUJBQXFCLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxDQUMzQyxDQUFDOzRCQUNHLHFCQUFxQixDQUFDLFFBQVEsR0FBSSxJQUFJLHFCQUFxQixFQUFFLENBQUM7d0JBQ2xFLENBQUM7d0JBQ0QsTUFBTSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQztvQkFDMUMsQ0FBQzs7O21CQUFBO2dCQUVELHNCQUFXLGdEQUFhO3lCQUF4Qjt3QkFFSSxFQUFFLENBQUEsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLElBQUksSUFBSSxDQUFDLENBQzlDLENBQUM7NEJBQ0csTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDaEIsQ0FBQzt3QkFDRCxJQUFJLENBQ0osQ0FBQzs0QkFDRyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUNqQixDQUFDO29CQUNMLENBQUM7OzttQkFBQTtnQkFFYSwyQkFBSyxHQUFuQjtvQkFFSSxxQkFBcUIsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUMxQyxDQUFDO2dCQWFELHNCQUFjLGdFQUE2Qjt5QkFBM0M7d0JBRUksSUFBSSxzQ0FBc0MsR0FBbUMsSUFBSSxDQUFDO3dCQUNsRixJQUFJLCtDQUErQyxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQzt3QkFD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bkMsQ0FBQzs0QkFDRyxNQUFNLENBQUMsS0FBSyxDQUFDO3dCQUNqQixDQUFDO3dCQUNELElBQUksQ0FDSixDQUFDOzRCQUNHLE1BQU0sQ0FBQyxJQUFJLENBQUM7d0JBQ2hCLENBQUM7b0JBQ0wsQ0FBQzs7O21CQUFBO2dCQUdELHNCQUFXLDBDQUFjO3lCQUF6Qjt3QkFFSSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztvQkFDaEMsQ0FBQzt5QkFDRCxVQUEwQixLQUFVO3dCQUVoQyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztvQkFDakMsQ0FBQzs7O21CQUpBO2dCQVFELHNCQUFXLDhDQUFrQjt5QkFBN0I7d0JBRUksTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztvQkFDcEMsQ0FBQzt5QkFDRCxVQUE4QixLQUFVO3dCQUVwQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO29CQUNyQyxDQUFDOzs7bUJBSkE7Z0JBUUQsc0JBQVcsZ0RBQW9CO3lCQUEvQjt3QkFFSSxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDO29CQUN0QyxDQUFDO3lCQUNELFVBQWdDLEtBQVU7d0JBRXRDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7b0JBQ3ZDLENBQUM7OzttQkFKQTtnQkFPTSxnQ0FBTyxHQUFkO29CQUVJLE1BQU0sQ0FBQyxDQUFFLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBRSxDQUFDO2dCQUN2RixDQUFDO2dCQUNMLHFCQUFDO1lBQUQsQ0FuREEsQUFtREMsSUFBQTtZQW5ERCwyQ0FtREMsQ0FBQSIsImZpbGUiOiJBdXRoZW50aWNhdGlvbkNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQXV0aGVudGljYXRpb25TZXR0aW5ncyB9IGZyb20gJy4vSUF1dGhlbnRpY2F0aW9uU2V0dGluZ3MnO1xyXG5pbXBvcnQgeyBJQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MgfSBmcm9tICcuL0lBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncyc7XHJcbi8vcmVxdWlyZSgnb2lkYy10b2tlbi1tYW5hZ2VyJyk7XHJcbi8vaW1wb3J0ICdvaWRjLXRva2VuLW1hbmFnZXIvZGlzdC9vaWRjLXRva2VuLW1hbmFnZXIuanMnO1xyXG4vL2ltcG9ydCAqIGFzIFEgZnJvbSAncSc7XHJcbi8vaW1wb3J0ICdvaWRjLXRva2VuLW1hbmFnZXInO1xyXG4vL2ltcG9ydCAnY2xpZW50LW9hdXRoMic7XHJcblxyXG5pbXBvcnQgKiBhcyBPcGVuSURDb25uZWN0Q2xpZW50IGZyb20gJ3RzLWNsaWVudC1vcGVuaWRjb25uZWN0JztcclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIEF1dGhlbnRpY2F0aW9uSW5pdGlhbGl6ZXJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBBdXRoZW50aWNhdGlvbkNvbnRleHQgXHJcbntcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX2N1cnJlbnQ6IEF1dGhlbnRpY2F0aW9uQ29udGV4dCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBnZXQgQ3VycmVudCgpOiBBdXRoZW50aWNhdGlvbkNvbnRleHQgXHJcbiAgICB7XHJcbiAgICAgICAgaWYoQXV0aGVudGljYXRpb25Db250ZXh0Ll9jdXJyZW50ID09PSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgQXV0aGVudGljYXRpb25Db250ZXh0Ll9jdXJyZW50ID0gIG5ldyBBdXRoZW50aWNhdGlvbkNvbnRleHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIEF1dGhlbnRpY2F0aW9uQ29udGV4dC5fY3VycmVudDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIGdldCBJc0luaXRpYWxpemVkKClcclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIHN0YXRpYyBSZXNldCgpXHJcbiAgICB7XHJcbiAgICAgICAgQXV0aGVudGljYXRpb25Db250ZXh0Ll9jdXJyZW50ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsaWVudE9BdXRoMjogT3BlbklEQ29ubmVjdENsaWVudC5DbGllbnRPQXV0aDI7XHJcbiAgICAgICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIFxyXG4gICAge1xyXG4gICAgICAgIGxldCBhdXRoZW50aWNhdGlvblNldHRpbmdzTG9hZGVkRnJvbVN0b3JhZ2UgPSB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzO1xyXG4gICAgICAgIGlmKGF1dGhlbnRpY2F0aW9uU2V0dGluZ3NMb2FkZWRGcm9tU3RvcmFnZSAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5jbGllbnRPQXV0aDIgPSBuZXcgT3BlbklEQ29ubmVjdENsaWVudC5DbGllbnRPQXV0aDIoIGF1dGhlbnRpY2F0aW9uU2V0dGluZ3NMb2FkZWRGcm9tU3RvcmFnZSApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIGdldCBBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncygpOiBJQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MgXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3NGcm9tTG9jYWxTdG9yYWdlOiBJQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MgPSBudWxsO1xyXG4gICAgICAgIGxldCBhdXRoZW50aWNhdGlvblNldHRpbmdzRnJvbUxvY2FsU3RvcmFnZVN0cmluZ2lmeSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncycpO1xyXG4gICAgICAgIGlmKGF1dGhlbnRpY2F0aW9uU2V0dGluZ3NGcm9tTG9jYWxTdG9yYWdlU3RyaW5naWZ5ICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhdXRoZW50aWNhdGlvblNldHRpbmdzRnJvbUxvY2FsU3RvcmFnZSA9IEpTT04ucGFyc2UoYXV0aGVudGljYXRpb25TZXR0aW5nc0Zyb21Mb2NhbFN0b3JhZ2VTdHJpbmdpZnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXV0aGVudGljYXRpb25TZXR0aW5nc0Zyb21Mb2NhbFN0b3JhZ2U7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBzZXQgQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3ModmFsdWU6IElBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncylcclxuICAgIHtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MnLCBKU09OLnN0cmluZ2lmeSh2YWx1ZSkpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgSW5pdGlhbGl6ZShhdXRoZW50aWNhdGlvblNldHRpbmdzOiBJQXV0aGVudGljYXRpb25TZXR0aW5ncylcclxuICAgIHtcclxuICAgICAgICBpZihhdXRoZW50aWNhdGlvblNldHRpbmdzLmF1dGhvcml0eSA9PSBudWxsIHx8IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuY2xpZW50X2lkID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aHJvdyBcIlNob3VsZCBiZSBpbmZvcm1lZCBhdCBsZWFzdCAnYXV0aG9yaXR5JyBhbmQgJ2NsaWVudF9pZCchXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vU2V0IGRlZmF1bHQgdmFsdWVzIGlmIG5vdCBpbmZvcm1lZFxyXG4gICAgICAgIGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuY2xpZW50X3VybCA9IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuY2xpZW50X3VybCB8fCBsb2NhdGlvbi5ocmVmOyAvL1NlbGYgdXJpXHJcbiAgICAgICAgYXV0aGVudGljYXRpb25TZXR0aW5ncy5zY29wZSA9IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3Muc2NvcGUgfHwgJ29wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzJzsgLy9PcGVuSWQgZGVmYXVsdCBzY29wZXNcclxuICAgICAgICBhdXRoZW50aWNhdGlvblNldHRpbmdzLnJlc3BvbnNlX3R5cGUgPSBhdXRoZW50aWNhdGlvblNldHRpbmdzLnJlc3BvbnNlX3R5cGUgfHwgJ2NvZGUgaWRfdG9rZW4gdG9rZW4nOyAvL0h5YnJpZCBmbG93IGF0IGRlZmF1bHRcclxuICAgICAgICBhdXRoZW50aWNhdGlvblNldHRpbmdzLm9wZW5fb25fcG9wdXAgPSBhdXRoZW50aWNhdGlvblNldHRpbmdzLm9wZW5fb25fcG9wdXAgfHwgZmFsc2U7IC8vUmVkaXJlY3QgZm9yIGRlZmF1bHRcclxuXHJcbiAgICAgICAgLy9Db252ZXJ0IHRvIHRoZSBtb3JlIGNvbXBsZXRlIElBdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5nc1xyXG4gICAgICAgIHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MgPSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGF1dGhvcml0eTogYXV0aGVudGljYXRpb25TZXR0aW5ncy5hdXRob3JpdHksXHJcbiAgICAgICAgICAgIGNsaWVudF9pZDogYXV0aGVudGljYXRpb25TZXR0aW5ncy5jbGllbnRfaWQsXHJcbiAgICAgICAgICAgIGNsaWVudF91cmw6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuY2xpZW50X3VybCxcclxuICAgICAgICAgICAgb3Blbl9vbl9wb3B1cDogYXV0aGVudGljYXRpb25TZXR0aW5ncy5vcGVuX29uX3BvcHVwLFxyXG4gICAgICAgICAgICByZXNwb25zZV90eXBlOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLnJlc3BvbnNlX3R5cGUsXHJcbiAgICAgICAgICAgIHNjb3BlOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLnNjb3BlLFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgcmVkaXJlY3RfdXJpIDogYXV0aGVudGljYXRpb25TZXR0aW5ncy5jbGllbnRfdXJsLFxyXG4gICAgICAgICAgICBzaWxlbnRfcmVkaXJlY3RfdXJpOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLmNsaWVudF91cmwgKyBcIj9zaWxlbnRyZWZyZXNoZnJhbWU9dHJ1ZVwiLFxyXG4gICAgICAgICAgICBwb3N0X2xvZ291dF9yZWRpcmVjdF91cmk6IGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MuY2xpZW50X3VybCxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25fdXJsIDogYXV0aGVudGljYXRpb25TZXR0aW5ncy5hdXRob3JpdHkgKyBcIi9jb25uZWN0L2F1dGhvcml6ZVwiLFxyXG4gICAgICAgICAgICB0b2tlbl91cmwgOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLmF1dGhvcml0eSArIFwiL2Nvbm5lY3QvdG9rZW5cIixcclxuICAgICAgICAgICAgdXNlcmluZm9fdXJsOiBhdXRoZW50aWNhdGlvblNldHRpbmdzLmF1dGhvcml0eSArIFwiL2Nvbm5lY3QvdXNlcmluZm9cIixcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxvYWRfdXNlcl9wcm9maWxlOiB0cnVlLFxyXG4gICAgICAgICAgICBzaWxlbnRfcmVuZXc6IHRydWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2V0dGluZ3MgPSBcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNsaWVudElkOiB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLmNsaWVudF9pZCxcclxuICAgICAgICAgICAgY2xpZW50U2VjcmV0OiAnc2VjcmV0JyxcclxuICAgICAgICAgICAgYWNjZXNzVG9rZW5Vcmk6IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MudG9rZW5fdXJsLFxyXG4gICAgICAgICAgICBhdXRob3JpemF0aW9uVXJpOiB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLmF1dGhvcml6YXRpb25fdXJsLFxyXG4gICAgICAgICAgICB1c2VySW5mb1VyaTogdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy51c2VyaW5mb191cmwsXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25HcmFudHM6IFsnY3JlZGVudGlhbHMnXSxcclxuICAgICAgICAgICAgcmVkaXJlY3RVcmk6IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MucmVkaXJlY3RfdXJpLFxyXG4gICAgICAgICAgICBzY29wZXM6IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3Muc2NvcGUuc3BsaXQoJyAnKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jbGllbnRPQXV0aDIgPSBuZXcgT3BlbklEQ29ubmVjdENsaWVudC5DbGllbnRPQXV0aDIoc2V0dGluZ3MpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgUHJvY2Vzc1Rva2VuSWZOZWVkZWQoKVxyXG4gICAge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vaWYgdGhlIGFjdHVhbCBwYWdlIGlzIHRoZSAncmVkaXJlY3RfdXJpJyAobG9hZGVkIGZyb20gdGhlIGxvY2FsU3RvcmFnZSksIHRoZW4gaSBjb25zaWRlciB0byAncHJvY2VzcyB0aGUgdG9rZW4gY2FsbGJhY2snICBcclxuICAgICAgICAvL2lmKGxvY2F0aW9uLmhyZWYuc3Vic3RyaW5nKDAsIHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MucmVkaXJlY3RfdXJpLmxlbmd0aCkgPT09IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MucmVkaXJlY3RfdXJpKVxyXG4gICAgICAgIGlmKGxvY2F0aW9uLmhyZWYuaW5kZXhPZignYWNjZXNzX3Rva2VuPScpID4gLTEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUHJvY2Vzc2luZyB0b2tlbiEnKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1Rva2VuVXJpJywgbG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIC8vaWYgdGhlIGFjdHVhbCBwYWdlIGlzIHRoZSAnc2lsZW50X3JlZGlyZWN0X3VyaScgKGxvYWRlZCBmcm9tIHRoZSBsb2NhbFN0b3JhZ2UpLCB0aGVuIGkgY29uc2lkZXIgdG8gJ3Byb2Nlc3MgdGhlIHRva2VuIGNhbGxiYWNrJ1xyXG4gICAgICAgIC8vIGVsc2UgaWYgKGxvY2F0aW9uLmhyZWYuc3Vic3RyaW5nKDAsIHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3Muc2lsZW50X3JlZGlyZWN0X3VyaS5sZW5ndGgpID09PSB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnNpbGVudF9yZWRpcmVjdF91cmkpXHJcbiAgICAgICAgLy8ge1xyXG4gICAgICAgIC8vICAgICB0aGlzLlJlbmV3VG9rZW5TaWxlbnQoKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy9HbyBIb3JzZVxyXG4gICAgICAgIC8vIGVsc2VcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgIGxldCBkZWZlciA9IFEuZGVmZXI8VG9rZW5zQ29udGVudHM+KCk7XHJcbiAgICAgICAgLy8gICAgIGRlZmVyLnJlc29sdmUodGhpcy5Ub2tlbnNDb250ZW50cyk7XHJcbiAgICAgICAgLy8gICAgIHJldHVybiBkZWZlci5wcm9taXNlO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHVibGljIEluaXQoYXV0aGVudGljYXRpb25TZXR0aW5ncz86IElBdXRoZW50aWNhdGlvblNldHRpbmdzLCBmb3JjZSA9IGZhbHNlKVxyXG4gICAge1xyXG4gICAgICAgIGlmKGF1dGhlbnRpY2F0aW9uU2V0dGluZ3MgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuSXNJbml0aWFsaXplZCA9PT0gZmFsc2UgfHwgZm9yY2UgPT09IHRydWUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuSW5pdGlhbGl6ZShhdXRoZW50aWNhdGlvblNldHRpbmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IFwiU2hvdWxkIGJlIHVuaXRpYWxpemF0ZWQgdG8gaW5pdGlhbGl6ZS4gWW91IGFyZSBtaXNzaW5nIHRoZSBmb3JjZSBwYXJhbWV0ZXI/XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5Qcm9jZXNzVG9rZW5JZk5lZWRlZCgpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgUmVkaXJlY3RUb0luaXRpYWxQYWdlKHVyaSA6c3RyaW5nKVxyXG4gICAge1xyXG4gICAgICAgIGxvY2F0aW9uLmFzc2lnbih1cmkpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgcHJvdGVjdGVkIFZhbGlkYXRlSW5pdGlhbGl6YXRpb24oKVxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MgPT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRocm93IFwiQXV0aGVudGljYXRpb25Db250ZXh0IHVuaW5pdGlhbGl6ZWQhXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogTWFrZSB0aGUgbG9naW4gYXQgdGhlIGN1cnJlbnQgVVJJLCBhbmQgcHJvY2VzcyB0aGUgcmVjZWl2ZWQgdG9rZW5zLlxyXG4gICAgICogT0JTOiBUaGUgUmVkaXJlY3QgVVJJIFtjYWxsYmFja191cmxdICh0byByZWNlaXZlIHRoZSB0b2tlbikgYW5kIFNpbGVudCBSZWZyZXNoIEZyYW1lIFVSSSBbc2lsZW50X3JlZGlyZWN0X3VyaV0gKHRvIGF1dG8gcmVuZXcgd2hlbiBleHBpcmVkKSBpZiBub3QgaW5mb3JtZWQgaXMgYXV0byBnZW5lcmF0ZWQgYmFzZWQgb24gdGhlICdjbGllbnRfdXJsJyBpbmZvcm1lZCBhdCAnSW5pdCcgbWV0aG9kIHdpdGggdGhlIGZvbGxvd2luIHN0cmF0ZWd5OlxyXG4gICAgICogYHJlZGlyZWN0X3VybCA9IGNsaWVudF91cmwgKyAnP2NhbGxiYWNrPXRydWUnYFxyXG4gICAgICogYHNpbGVudF9yZWRpcmVjdF91cmkgPSBjbGllbnRfdXJsICsgJz9zaWxlbnRyZWZyZXNoZnJhbWU9dHJ1ZSdgIFxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcGVuT25Qb3BVcF0gKGRlc2NyaXB0aW9uKVxyXG4gICAgICovXHJcbiAgICAvLyBwdWJsaWMgTG9naW5BbmRQcm9jZXNzVG9rZW4ob3Blbk9uUG9wVXA/OiBib29sZWFuKVxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIHRoaXMuVmFsaWRhdGVJbml0aWFsaXphdGlvbigpO1xyXG4gICAgICAgIFxyXG4gICAgLy8gICAgIGxldCBzaG91bGRPcGVuT25Qb3BVcCA9IG9wZW5PblBvcFVwIHx8IHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3Mub3Blbl9vbl9wb3B1cDtcclxuICAgICAgICBcclxuICAgIC8vICAgICAvL2lmIHRoZSBhY3R1YWwgcGFnZSBpcyB0aGUgJ3JlZGlyZWN0X3VyaScgKGxvYWRlZCBmcm9tIHRoZSBsb2NhbFN0b3JhZ2UpLCB0aGVuIGkgY29uc2lkZXIgdG8gJ3Byb2Nlc3MgdGhlIHRva2VuIGNhbGxiYWNrJyAgXHJcbiAgICAvLyAgICAgaWYobG9jYXRpb24uaHJlZi5zdWJzdHJpbmcoMCwgdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5yZWRpcmVjdF91cmkubGVuZ3RoKSA9PT0gdGhpcy5BdXRoZW50aWNhdGlvbk1hbmFnZXJTZXR0aW5ncy5yZWRpcmVjdF91cmkpXHJcbiAgICAvLyAgICAge1xyXG4gICAgLy8gICAgICAgICB0aGlzLlByb2Nlc3NUb2tlbkNhbGxiYWNrKCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIC8vaWYgdGhlIGFjdHVhbCBwYWdlIGlzIHRoZSAnc2lsZW50X3JlZGlyZWN0X3VyaScgKGxvYWRlZCBmcm9tIHRoZSBsb2NhbFN0b3JhZ2UpLCB0aGVuIGkgY29uc2lkZXIgdG8gJ3Byb2Nlc3MgdGhlIHRva2VuIGNhbGxiYWNrJ1xyXG4gICAgLy8gICAgIGVsc2UgaWYgKGxvY2F0aW9uLmhyZWYuc3Vic3RyaW5nKDAsIHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3Muc2lsZW50X3JlZGlyZWN0X3VyaS5sZW5ndGgpID09PSB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLnNpbGVudF9yZWRpcmVjdF91cmkpXHJcbiAgICAvLyAgICAge1xyXG4gICAgLy8gICAgICAgICB0aGlzLlJlbmV3VG9rZW5TaWxlbnQoKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgLy9pZiB0aGUgYWN0dWFsIHBhZ2UgaXMgdGhlICdjbGllbnRfdXJsJywgdGhlbiBpIGNvbnNpZGVyIHRvIG1ha2UgdGhlICdsb2dpbidcclxuICAgIC8vICAgICBlbHNlIGlmKGxvY2F0aW9uLmhyZWYuc3Vic3RyaW5nKDAsIHRoaXMuQXV0aGVudGljYXRpb25NYW5hZ2VyU2V0dGluZ3MuY2xpZW50X3VybC5sZW5ndGgpID09PSB0aGlzLkF1dGhlbnRpY2F0aW9uTWFuYWdlclNldHRpbmdzLmNsaWVudF91cmwpXHJcbiAgICAvLyAgICAge1xyXG4gICAgLy8gICAgICAgICBpZih0aGlzLklzQXV0aGVudGljYXRlZCA9PT0gZmFsc2UpXHJcbiAgICAvLyAgICAgICAgIHtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuTG9naW4oc2hvdWxkT3Blbk9uUG9wVXApO1xyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgXHJcbiAgICBwdWJsaWMgTG9naW4ob3Blbk9uUG9wVXA/OiBib29sZWFuKVxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuVG9rZW5zQ29udGVudHMuSXNBdXRoZW50aWNhdGVkID09PSBmYWxzZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuVmFsaWRhdGVJbml0aWFsaXphdGlvbigpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGV0IHVyaVRvSWRQID0gdGhpcy5jbGllbnRPQXV0aDIudG9rZW4uZ2V0VXJpKCkucmVwbGFjZSgndG9rZW4nLCAnY29kZSUyMGlkX3Rva2VuJTIwdG9rZW4mbm9uY2U9MTIzJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLlJlZGlyZWN0VG9Jbml0aWFsUGFnZSh1cmlUb0lkUCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignQWxyZWFkeSBhdXRoZW50aWNhdGVkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgSXNBdXRoZW50aWNhdGVkKCkgOmJvb2xlYW5cclxuICAgIHtcclxuICAgICAgICBpZih0aGlzLlRva2Vuc0NvbnRlbnRzLklzQXV0aGVudGljYXRlZCA9PT0gZmFsc2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IFRva2Vuc0NvbnRlbnRzKCkgOiBUb2tlbnNDb250ZW50c1xyXG4gICAge1xyXG4gICAgICAgIGxldCB0b2tlbkNvbnRlbnRzID0gbmV3IFRva2Vuc0NvbnRlbnRzKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIHRva2VuQ29udGVudHMuQWNjZXNzVG9rZW5Db250ZW50ID0gdGhpcy5BY2Nlc3NUb2tlbkNvbnRlbnQ7XHJcbiAgICAgICAgdG9rZW5Db250ZW50cy5JZGVudGl0eVRva2VuQ29udGVudCA9IHRoaXMuSWRlbnRpdHlUb2tlbkNvbnRlbnQ7XHJcbiAgICAgICAgdG9rZW5Db250ZW50cy5Qcm9maWxlQ29udGVudCA9IHRoaXMuUHJvZmlsZUNvbnRlbnQ7XHJcblxyXG4gICAgICAgIHJldHVybiB0b2tlbkNvbnRlbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgQWNjZXNzVG9rZW4oKTogc3RyaW5nIFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmNsaWVudE9BdXRoMiAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHRva2VuVXJpID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1Rva2VuVXJpJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih0b2tlblVyaSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xpZW50T0F1dGgyVG9rZW4gPSB0aGlzLmNsaWVudE9BdXRoMi50b2tlbi5nZXRUb2tlbih0b2tlblVyaSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xpZW50T0F1dGgyVG9rZW4uYWNjZXNzVG9rZW47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgQWNjZXNzVG9rZW5Db250ZW50KCk6IGFueSBcclxuICAgIHtcclxuICAgICAgICBpZiAodGhpcy5BY2Nlc3NUb2tlbiAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBhdG9iKHRoaXMuQWNjZXNzVG9rZW4uc3BsaXQoJy4nKVsxXSk7XHJcbiAgICAgICAgICAgIGxldCByZXRvcm5vID0gSlNPTi5wYXJzZShjb250ZW50KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJldG9ybm87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcm90ZWN0ZWQgZ2V0IElkZW50aXR5VG9rZW4oKTogc3RyaW5nIFxyXG4gICAge1xyXG4gICAgICAgIGlmICh0aGlzLmNsaWVudE9BdXRoMiAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IHRva2VuVXJpID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1Rva2VuVXJpJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZih0b2tlblVyaSAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2xpZW50T0F1dGgyVG9rZW4gPSB0aGlzLmNsaWVudE9BdXRoMi50b2tlbi5nZXRUb2tlbih0b2tlblVyaSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xpZW50T0F1dGgyVG9rZW4uaWRlbnRpdHlUb2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIGdldCBJZGVudGl0eVRva2VuQ29udGVudCgpOiBhbnkgXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuSWRlbnRpdHlUb2tlbiAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGNvbnRlbnQgPSBhdG9iKHRoaXMuSWRlbnRpdHlUb2tlbi5zcGxpdCgnLicpWzFdKTtcclxuICAgICAgICAgICAgbGV0IHJldG9ybm8gPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0b3JubztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByb3RlY3RlZCBnZXQgUHJvZmlsZUNvbnRlbnQoKTogYW55XHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2xpZW50T0F1dGgyICE9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZih0aGlzLkFjY2Vzc1Rva2VuICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxldCB1c2VySW5mb1Jlc3BvbnNlID0gdGhpcy5jbGllbnRPQXV0aDIudG9rZW4uZ2V0VXNlckluZm8odGhpcy5BY2Nlc3NUb2tlbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdXNlckluZm9SZXNwb25zZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gLy9UT0RPOiBTcGxpdCB0aGUgcGFyc2VyIHRvIGFub3RoZXIgcHJvamVjdCAocGFja2FnZSAtIHRzLXNlY3VyaXR5LXRva2Vucz8pXHJcbiAgICAvLyAvL0luY2x1ZGUgcmVmYWN0b3J5IGF0IHRoZSB0cy1zZWN1cml0eS1pZGVudGl0eSBhbHNvXHJcbiAgICAvLyBwcm90ZWN0ZWQgR2VuZXJhdGVUb2tlbnMoKVxyXG4gICAgLy8ge1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAvLyAgICAgICAgIGlmKHRoaXMub2lkY1Rva2VuTWFuYWdlci5wcm9maWxlICE9IG51bGwpXHJcbiAgICAvLyAgICAgICAgIHtcclxuICAgIC8vICAgICAgICAgICAgIHRoaXMuUHJvZmlsZUNvbnRlbnQgPSB0aGlzLm9pZGNUb2tlbk1hbmFnZXIucHJvZmlsZTtcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH1cclxuICAgICAgICBcclxuICAgIC8vICAgICAvLyB0aGlzLkFjY2Vzc1Rva2VuQ29udGVudCA9IEpTT04ucGFyc2UoYXRvYih0aGlzLm9pZGNUb2tlbk1hbmFnZXIuYWNjZXNzX3Rva2VuLnNwbGl0KCcuJylbMV0pKTtcclxuICAgIC8vICAgICAvLyB0aGlzLklkZW50aXR5VG9rZW5Db250ZW50ID0gSlNPTi5wYXJzZShhdG9iKHRoaXMub2lkY1Rva2VuTWFuYWdlci5pZF90b2tlbi5zcGxpdCgnLicpWzFdKSk7XHJcbiAgICAvLyAgICAgLy8gdGhpcy5Qcm9maWxlQ29udGVudCA9IHRoaXMub2lkY1Rva2VuTWFuYWdlci5wcm9maWxlO1xyXG4gICAgLy8gfVxyXG4gICAgXHJcblxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVG9rZW5zQ29udGVudHNcclxue1xyXG4gICAgcHVibGljIGdldCBJc0F1dGhlbnRpY2F0ZWQoKSA6Ym9vbGVhblxyXG4gICAge1xyXG4gICAgICAgIGlmKHRoaXMuQWNjZXNzVG9rZW5Db250ZW50ID09IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfcHJvZmlsZUNvbnRlbnQ6IGFueTtcclxuICAgIHB1YmxpYyBnZXQgUHJvZmlsZUNvbnRlbnQoKTogYW55XHJcbiAgICB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Byb2ZpbGVDb250ZW50O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBQcm9maWxlQ29udGVudCh2YWx1ZTogYW55KVxyXG4gICAge1xyXG4gICAgICAgIHRoaXMuX3Byb2ZpbGVDb250ZW50ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBfYWNjZXNzVG9rZW5Db250ZW50OiBhbnk7XHJcbiAgICBwdWJsaWMgZ2V0IEFjY2Vzc1Rva2VuQ29udGVudCgpOiBhbnlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWNjZXNzVG9rZW5Db250ZW50O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCBBY2Nlc3NUb2tlbkNvbnRlbnQodmFsdWU6IGFueSlcclxuICAgIHtcclxuICAgICAgICB0aGlzLl9hY2Nlc3NUb2tlbkNvbnRlbnQgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBwcml2YXRlIF9pZGVudGl0eVRva2VuQ29udGVudDogYW55O1xyXG4gICAgcHVibGljIGdldCBJZGVudGl0eVRva2VuQ29udGVudCgpOiBhbnlcclxuICAgIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faWRlbnRpdHlUb2tlbkNvbnRlbnQ7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgc2V0IElkZW50aXR5VG9rZW5Db250ZW50KHZhbHVlOiBhbnkpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5faWRlbnRpdHlUb2tlbkNvbnRlbnQgPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICBwdWJsaWMgVG9BcnJheSgpIDogQXJyYXk8YW55PlxyXG4gICAge1xyXG4gICAgICAgIHJldHVybiBbIHRoaXMuSWRlbnRpdHlUb2tlbkNvbnRlbnQsIHRoaXMuQWNjZXNzVG9rZW5Db250ZW50LCB0aGlzLlByb2ZpbGVDb250ZW50IF07XHJcbiAgICB9XHJcbn0iXX0=
