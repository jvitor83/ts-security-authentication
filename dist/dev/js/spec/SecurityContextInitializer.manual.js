/// <reference path='../../typings/main.d.ts' />
System.register(['../src/AuthenticationContextInitializer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AuthenticationContextInitializer_1;
    var client_id, config;
    return {
        setters:[
            function (AuthenticationContextInitializer_1_1) {
                AuthenticationContextInitializer_1 = AuthenticationContextInitializer_1_1;
            }],
        execute: function() {
            client_id = '2380';
            config = {
                authority: 'http://idp-teste.tjmt.jus.br',
                client_id: client_id,
                scopes: 'openid profile pjmt_profile email permissao_' + client_id,
                response_type: 'code id_token token',
                open_on_popup: false
            };
            AuthenticationContextInitializer_1.AuthenticationContextInitializer.Current.Init(config);
            AuthenticationContextInitializer_1.AuthenticationContextInitializer.Current.LoginAndProcessToken();
        }
    }
});
// if(location.href.indexOf('callback=') === -1)
// {
//     AuthenticationInitializer.Current.Login();
// }
// else
// {
//     AuthenticationInitializer.Current.Callback();
// }

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwZWMvU2VjdXJpdHlDb250ZXh0SW5pdGlhbGl6ZXIubWFudWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGdEQUFnRDs7Ozs7UUFPeEMsU0FBUyxFQUNULE1BQU07Ozs7Ozs7WUFETixTQUFTLEdBQUcsTUFBTSxDQUFDO1lBQ25CLE1BQU0sR0FBNEI7Z0JBQzlCLFNBQVMsRUFBRSw4QkFBOEI7Z0JBQ3pDLFNBQVMsRUFBRSxTQUFTO2dCQUNwQixNQUFNLEVBQUUsOENBQThDLEdBQUcsU0FBUztnQkFDbEUsYUFBYSxFQUFFLHFCQUFxQjtnQkFFcEMsYUFBYSxFQUFFLEtBQUs7YUFDdkIsQ0FBQztZQUVGLG1FQUFnQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEQsbUVBQWdDLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLENBQUM7Ozs7QUFDaEUsZ0RBQWdEO0FBQ2hELElBQUk7QUFDSixpREFBaUQ7QUFDakQsSUFBSTtBQUNKLE9BQU87QUFDUCxJQUFJO0FBQ0osb0RBQW9EO0FBQ3BELElBQUkiLCJmaWxlIjoic3BlYy9TZWN1cml0eUNvbnRleHRJbml0aWFsaXplci5tYW51YWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPScuLi8uLi90eXBpbmdzL21haW4uZC50cycgLz5cclxuXHJcbmltcG9ydCB7QXV0aGVudGljYXRpb25Db250ZXh0SW5pdGlhbGl6ZXJ9IGZyb20gJy4uL3NyYy9BdXRoZW50aWNhdGlvbkNvbnRleHRJbml0aWFsaXplcic7XHJcbmltcG9ydCB7SUF1dGhlbnRpY2F0aW9uU2V0dGluZ3N9IGZyb20gJy4uL3NyYy9JQXV0aGVudGljYXRpb25TZXR0aW5ncyc7XHJcblxyXG5cclxuXHJcbiAgICBsZXQgY2xpZW50X2lkID0gJzIzODAnO1xyXG4gICAgbGV0IGNvbmZpZyA6SUF1dGhlbnRpY2F0aW9uU2V0dGluZ3MgPSB7XHJcbiAgICAgICAgICAgIGF1dGhvcml0eTogJ2h0dHA6Ly9pZHAtdGVzdGUudGptdC5qdXMuYnInLFxyXG4gICAgICAgICAgICBjbGllbnRfaWQ6IGNsaWVudF9pZCxcclxuICAgICAgICAgICAgc2NvcGVzOiAnb3BlbmlkIHByb2ZpbGUgcGptdF9wcm9maWxlIGVtYWlsIHBlcm1pc3Nhb18nICsgY2xpZW50X2lkLFxyXG4gICAgICAgICAgICByZXNwb25zZV90eXBlOiAnY29kZSBpZF90b2tlbiB0b2tlbicsXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBvcGVuX29uX3BvcHVwOiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcbiAgICAgICAgQXV0aGVudGljYXRpb25Db250ZXh0SW5pdGlhbGl6ZXIuQ3VycmVudC5Jbml0KGNvbmZpZyk7XHJcbiAgICAgICAgQXV0aGVudGljYXRpb25Db250ZXh0SW5pdGlhbGl6ZXIuQ3VycmVudC5Mb2dpbkFuZFByb2Nlc3NUb2tlbigpO1xyXG4gICAgICAgIC8vIGlmKGxvY2F0aW9uLmhyZWYuaW5kZXhPZignY2FsbGJhY2s9JykgPT09IC0xKVxyXG4gICAgICAgIC8vIHtcclxuICAgICAgICAvLyAgICAgQXV0aGVudGljYXRpb25Jbml0aWFsaXplci5DdXJyZW50LkxvZ2luKCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIGVsc2VcclxuICAgICAgICAvLyB7XHJcbiAgICAgICAgLy8gICAgIEF1dGhlbnRpY2F0aW9uSW5pdGlhbGl6ZXIuQ3VycmVudC5DYWxsYmFjaygpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAiXX0=
