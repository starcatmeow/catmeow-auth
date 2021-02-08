import { KoaContextWithOIDC } from 'oidc-provider'
export const logoutSource = async function(ctx: KoaContextWithOIDC, form: string) {
    ctx.body = `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Catmeow 统一认证服务</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.blue-pink.min.css">
            <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
            <style>
                html,body {
                    height: 100%;
                }
                body {
                    background-image: url('https://s.cn.bing.com/th?id=OHR.SnowCraterLake_ROW7226300299_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp');
                    background-position-x: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card {
                    width: 400px;
                    backdrop-filter: blur(5px);
                    background-color: rgba(255,255,255,0.7);
                    padding: 50px;
                    border-radius: 15px;
                    box-shadow: 0px 0px 7px 7px rgba(0,0,0,0.3);
                    animation-name: "<% if(typeof prompt !== 'undefined' && prompt === 'login'){ %>in<% } else { %> none <% } %>";
                    animation-duration: 1s;
                }
                @keyframes in {
                    from {
                        margin-top: 20%;
                        opacity: 0;
                    }
                    to {
                        margin-top: 0%;
                        opacity: 1;
                    }
                }
                .title {
                    text-align: center;
                    font-weight: 300;
                    font-size: 2em;
                    margin: 10px;
                }
                .text {
                    font-weight: 200;
                    font-size: 1em;
                }
                .maxwidth {
                    width: 100% !important;
                }
                form {
                    margin-top: 30px;
                }
                .blue {
                    background: rgb(33,150,243) !important
                }
                .center {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="title">登出 Catmeow 统一认证服务</div>
                <script>
                    function logout() {
                        var form = document.getElementById('op.logoutForm');
                        var input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = 'logout';
                        input.value = 'yes';
                        form.appendChild(input);
                        form.submit();
                    }
                    function rpLogoutOnly() {
                        var form = document.getElementById('op.logoutForm');
                        form.submit();
                    }
                </script>
                ${form}
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored maxwidth" style="margin-top:20px" onclick="logout()">
                    登出所有 Catmeow 应用
                </button>
                <br>
                <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent maxwidth" style="margin-top:10px" onclick="rpLogoutOnly()">
                    只登出当前应用
                </button>
            </div>
        </body>
    </html>`
}

export const postLogoutSuccessSource = async function(ctx: KoaContextWithOIDC) {
    ctx.body = `<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Catmeow 统一认证服务</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
            <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.blue-pink.min.css">
            <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>
            <style>
                html,body {
                    height: 100%;
                }
                body {
                    background-image: url('https://s.cn.bing.com/th?id=OHR.SnowCraterLake_ROW7226300299_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp');
                    background-position-x: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card {
                    width: 400px;
                    backdrop-filter: blur(5px);
                    background-color: rgba(255,255,255,0.7);
                    padding: 50px;
                    border-radius: 15px;
                    box-shadow: 0px 0px 7px 7px rgba(0,0,0,0.3);
                    animation-name: "<% if(typeof prompt !== 'undefined' && prompt === 'login'){ %>in<% } else { %> none <% } %>";
                    animation-duration: 1s;
                }
                @keyframes in {
                    from {
                        margin-top: 20%;
                        opacity: 0;
                    }
                    to {
                        margin-top: 0%;
                        opacity: 1;
                    }
                }
                .title {
                    text-align: center;
                    font-weight: 300;
                    font-size: 2em;
                    margin: 10px;
                }
                .text {
                    font-weight: 200;
                    font-size: 1em;
                }
                .maxwidth {
                    width: 100% !important;
                }
                form {
                    margin-top: 30px;
                }
                .blue {
                    background: rgb(33,150,243) !important
                }
                .center {
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="title">成功</div>
                <div class="text">已成功登出</div>
            </div>
        </body>
    </html>`
}