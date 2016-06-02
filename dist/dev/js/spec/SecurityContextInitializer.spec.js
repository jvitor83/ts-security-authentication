/// <reference path='../../typings/main.d.ts' />
System.register(['../src/AuthenticationInitializer'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var AuthenticationInitializer_1;
    return {
        setters:[
            function (AuthenticationInitializer_1_1) {
                AuthenticationInitializer_1 = AuthenticationInitializer_1_1;
            }],
        execute: function() {
            describe('AuthenticationInitializer', function () {
                var client_id = '2380';
                var config = {
                    authority: 'idp-teste.tjmt.jus.br',
                    client_id: client_id,
                    scopes: 'openid profile pjmt_profile email permissao_' + client_id,
                    response_type: 'code id_token token',
                    open_on_popup: false
                };
                //   beforeEach(() => {
                //     });
                it('InitializeWithEncodedTokens should instantiate a Principal', function () {
                    AuthenticationInitializer_1.AuthenticationInitializer.Current.Init(config);
                    AuthenticationInitializer_1.AuthenticationInitializer.Current.Login();
                    expect(true).toBe(true);
                });
            });
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNwZWMvU2VjdXJpdHlDb250ZXh0SW5pdGlhbGl6ZXIuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnREFBZ0Q7Ozs7Ozs7Ozs7O1lBT2hELFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtnQkFDbEMsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDO2dCQUN2QixJQUFJLE1BQU0sR0FBNEI7b0JBQzlCLFNBQVMsRUFBRSx1QkFBdUI7b0JBQ2xDLFNBQVMsRUFBRSxTQUFTO29CQUNwQixNQUFNLEVBQUUsOENBQThDLEdBQUcsU0FBUztvQkFDbEUsYUFBYSxFQUFFLHFCQUFxQjtvQkFFcEMsYUFBYSxFQUFFLEtBQUs7aUJBQ3ZCLENBQUM7Z0JBR1YsdUJBQXVCO2dCQUV2QixVQUFVO2dCQUVOLEVBQUUsQ0FBQyw0REFBNEQsRUFBRTtvQkFFN0QscURBQXlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDL0MscURBQXlCLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUUxQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUU1QixDQUFDLENBQUMsQ0FBQztZQUVQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6InNwZWMvU2VjdXJpdHlDb250ZXh0SW5pdGlhbGl6ZXIuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9Jy4uLy4uL3R5cGluZ3MvbWFpbi5kLnRzJyAvPlxyXG5cclxuLy9pbXBvcnQgJ29pZGMtdG9rZW4tbWFuYWdlcic7XHJcblxyXG5pbXBvcnQge0F1dGhlbnRpY2F0aW9uSW5pdGlhbGl6ZXJ9IGZyb20gJy4uL3NyYy9BdXRoZW50aWNhdGlvbkluaXRpYWxpemVyJztcclxuaW1wb3J0IHtJQXV0aGVudGljYXRpb25TZXR0aW5nc30gZnJvbSAnLi4vc3JjL0lBdXRoZW50aWNhdGlvblNldHRpbmdzJztcclxuXHJcbmRlc2NyaWJlKCdBdXRoZW50aWNhdGlvbkluaXRpYWxpemVyJywgKCkgPT4ge1xyXG4gICAgbGV0IGNsaWVudF9pZCA9ICcyMzgwJztcclxuICAgIGxldCBjb25maWcgOklBdXRoZW50aWNhdGlvblNldHRpbmdzID0ge1xyXG4gICAgICAgICAgICBhdXRob3JpdHk6ICdpZHAtdGVzdGUudGptdC5qdXMuYnInLFxyXG4gICAgICAgICAgICBjbGllbnRfaWQ6IGNsaWVudF9pZCxcclxuICAgICAgICAgICAgc2NvcGVzOiAnb3BlbmlkIHByb2ZpbGUgcGptdF9wcm9maWxlIGVtYWlsIHBlcm1pc3Nhb18nICsgY2xpZW50X2lkLFxyXG4gICAgICAgICAgICByZXNwb25zZV90eXBlOiAnY29kZSBpZF90b2tlbiB0b2tlbicsXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBvcGVuX29uX3BvcHVwOiBmYWxzZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgXHJcblxyXG4vLyAgIGJlZm9yZUVhY2goKCkgPT4ge1xyXG4gICAgICBcclxuLy8gICAgIH0pO1xyXG5cclxuICAgIGl0KCdJbml0aWFsaXplV2l0aEVuY29kZWRUb2tlbnMgc2hvdWxkIGluc3RhbnRpYXRlIGEgUHJpbmNpcGFsJywgKCkgPT4ge1xyXG4gICAgXHJcbiAgICAgICAgQXV0aGVudGljYXRpb25Jbml0aWFsaXplci5DdXJyZW50LkluaXQoY29uZmlnKTtcclxuICAgICAgICBBdXRoZW50aWNhdGlvbkluaXRpYWxpemVyLkN1cnJlbnQuTG9naW4oKTtcclxuICAgICAgICBcclxuICAgICAgICBleHBlY3QodHJ1ZSkudG9CZSh0cnVlKTtcclxuICAgIFxyXG4gICAgfSk7XHJcbiAgICBcclxufSk7XHJcbiJdfQ==
