/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// パスワード設定
function Search_SetUserPassword(Password, NewPassword, obj, func) {
    // Password作成
    var pass = Search_GetStringJson(Password);

    // NewPassword作成
    var newPass = Search_GetStringJson(NewPassword);

    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/SetUserPassword",
        data: "{\"Password\":" + pass
            + ",\"NewPassword\":" + newPass + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // データチェック
            if (result.d.Result == "Error") {
                if (result.d.Message == "NoSession") {
                    Common_ErrorProc("セッションの有効期限が切れています。", true);
                    return;
                }
                else if (result.d.Message == "ParameterNG") {
                    //Common_ErrorProc("パラメータが正しくありません。", false);
                }
                else if (result.d.Message == "ServiceError") {
                    //Common_ErrorProc("サービスでエラーが発生しました。", false);
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", false);
                }
                //return;
            }

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        },
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", false);

            // 結果を拡張
            result.d = new Array();
            result.d.Result = "Error";
            result.d.Message = "";

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        }
    });
}

// パラメータ設定
function Search_SetParams(Param, obj, func) {
    // Param作成
    var param = Search_GetDictionaryJson(Param);

    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/SetParams",
        data: "{\"Param\":" + param + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // データチェック
            if (!result.d) {
                Common_ErrorProc("サービスで例外が発生しました。", false);
                return;
            }

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        },
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", false);
        }
    });
}

// パラメータ取得
function Search_GetParams(obj, func) {
    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetParams",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // データチェック
            if (result.d.Result == "Error") {
                Common_ErrorProc("サービスで例外が発生しました。", true);
                return;
            }

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        },
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", true);
        }
    });
}

// 病院一覧取得
function Search_GetHospitalList(obj, func) {
    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetHospitalList",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // データチェック
            if (result.d.Result == "Error") {
                if (result.d.Message == "NoSession") {
                    Common_ErrorProc("セッションの有効期限が切れています。", true);
                }
                else if (result.d.Message == "ServiceError") {
                    Common_ErrorProc("サービスでエラーが発生しました。", true);
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", true);
                }
                return;
            }

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        },
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", true);
        }
    });
}

// ユーザーコンフィグ取得
function Search_GetUserConfig(obj, func) {
    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetUserConfig",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // データチェック
            if (result.d.Result == "Error") {
                if (result.d.Message == "NoSession") {
                    Common_ErrorProc("セッションの有効期限が切れています。", true);
                }
                else if (result.d.Message == "ServiceError") {
                    Common_ErrorProc("サービスでエラーが発生しました。", true);
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", true);
                }
                return;
            }

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        },
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", true);
        }
    });
}

// ユーザーコンフィグ設定
function Search_SetUserConfig(Param, obj, func) {
    // Param作成
    var param = Search_GetDictionaryJson(Param);

    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/SetUserConfig",
        data: "{\"Param\":" + param + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // データチェック
            if (result.d.Result == "Error") {
                if (result.d.Message == "NoSession") {
                    Common_ErrorProc("セッションの有効期限が切れています。", true);
                }
                else if (result.d.Message == "ServiceError") {
                    Common_ErrorProc("サービスでエラーが発生しました。", false);
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", false);
                }
                return;
            }

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        },
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", false);
        }
    });
}

// 病院名取得
function Search_GetHospitalName(id) {
    var hosp = $("#ViewerConfig").data("Hospital");
    var name = "";
    $(hosp).each(function () {
        if (this.ID == id) {
            name = this.Name;
            return true;
        }
    });
    return name;
}
