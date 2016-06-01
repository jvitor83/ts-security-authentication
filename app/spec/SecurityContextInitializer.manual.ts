/// <reference path='../../typings/main.d.ts' />

import {AuthenticationContextInitializer} from '../src/AuthenticationContextInitializer';
import {IAuthenticationSettings} from '../src/IAuthenticationSettings';



    let client_id = '2380';
    let config :IAuthenticationSettings = {
            authority: 'http://idp-teste.tjmt.jus.br',
            client_id: client_id,
            scopes: 'openid profile pjmt_profile email permissao_' + client_id,
            response_type: 'code id_token token',
            
            open_on_popup: false
        };
        
        AuthenticationContextInitializer.Current.Init(config);
        AuthenticationContextInitializer.Current.LoginAndProcessToken();
        // if(location.href.indexOf('callback=') === -1)
        // {
        //     AuthenticationInitializer.Current.Login();
        // }
        // else
        // {
        //     AuthenticationInitializer.Current.Callback();
        // }
        
        
        