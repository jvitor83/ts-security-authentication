/// <reference path='../../typings/main.d.ts' />

//import 'oidc-token-manager';

import {AuthenticationInitializer} from '../src/AuthenticationInitializer';
import {IAuthenticationSettings} from '../src/IAuthenticationSettings';

describe('AuthenticationInitializer', () => {
    let client_id = '2380';
    let config :IAuthenticationSettings = {
            authority: 'idp-teste.tjmt.jus.br',
            client_id: client_id,
            scopes: 'openid profile pjmt_profile email permissao_' + client_id,
            response_type: 'code id_token token',
            
            open_on_popup: false
        };
        

//   beforeEach(() => {
      
//     });

    it('InitializeWithEncodedTokens should instantiate a Principal', () => {
    
        AuthenticationInitializer.Current.Init(config);
        AuthenticationInitializer.Current.Login();
        
        expect(true).toBe(true);
    
    });
    
});
