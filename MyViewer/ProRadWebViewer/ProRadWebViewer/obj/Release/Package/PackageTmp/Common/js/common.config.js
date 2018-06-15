/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// ログイン
function Common_Login(LoginID, Password, Extension, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./Common/CommonWebService.asmx/Login",
        data: "{\"LoginID\":\"" + LoginID.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"') + "\""
            + ",\"Password\":\"" + Password.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"') + "\""
            + ",\"Extension\":\"" + Extension.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"') + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: func,
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", false);
        }
    });
}
