/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var _LoginWindow_LoadImages = new Array();

// 画像読み込み処理
function LoginWindow_LoadImages() {
    var base = "./Common/img/x1/";
    if (Common_DevicePixelRatio() == 2) {
        base = "./Common/img/x2/";
    }
    LoginWindow_LoadImagesSub(base, "Login_back.png");
    LoginWindow_LoadImagesSub(base, "LoginButton_active.png");
    LoginWindow_LoadImagesSub(base, "LoginButton_off.png");
    LoginWindow_LoadImagesSub(base, "LoginButton_on.png");
    LoginWindow_LoadImagesSub(base, "LoginInput.png");
}
function LoginWindow_LoadImagesSub(base, name) {
    var param = "?20150706a";
    _LoginWindow_LoadImages.push($("<img>").attr("src", base + name + param));
}
