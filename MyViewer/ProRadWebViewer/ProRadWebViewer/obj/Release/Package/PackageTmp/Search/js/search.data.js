/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var _Search_AjaxKey = 0;    // Ajax用送信キー

// Ajax用送信キー取得
function Search_GetAjaxKey() {
    _Search_AjaxKey++;
    if (_Search_AjaxKey >= Number.MAX_VALUE) {
        _Search_AjaxKey = 0;
    }
    return _Search_AjaxKey;
}

// 文字列設定用Json文字列取得
function Search_GetStringJson(param) {
    return "\"" + param.toString().replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"') + "\"";
}

// 配列設定用Json文字列取得
function Search_GetArrayJson(param) {
    var ret = "";
    if ($.isArray(param)) {
        for (var key in param) {
            if (param[key] == null) {
                continue;
            }
            if ($.isArray(param[key])) {
                ret += Search_GetArrayJson(param[key]) + ",";
            }
            else if ($.isPlainObject(param[key])) {
                ret += Search_GetDictionaryJson(param[key]) + ",";
            }
            else {
                ret += Search_GetStringJson(param[key]) + ",";
            }
        }
        ret = "[" + ret.substring(0, ret.length - 1) + "]";
    }
    else if (!$.isPlainObject(param)) {
        // 文字列の場合1個の配列として処理
        ret = "[" + Search_GetStringJson(param) + "]";
    }
    else {
        // 0個の配列
        ret = "[]";
    }
    return ret;
}

// Dictionary型設定用Json文字列取得
function Search_GetDictionaryJson(param) {
    var ret = "";
    if ($.isArray(param) || $.isPlainObject(param)) {
        for (var key in param) {
            if (param[key] == null) {
                continue;
            }
            ret += Search_GetStringJson(key) + ":";
            if ($.isArray(param[key])) {
                ret += Search_GetArrayJson(param[key]) + ",";
            }
            else if ($.isPlainObject(param[key])) {
                ret += Search_GetDictionaryJson(param[key]) + ",";
            }
            else {
                ret += Search_GetStringJson(param[key]) + ",";
            }
        }
        ret = "{" + ret.substring(0, ret.length - 1) + "}";
    }
    else {
        // 0個のDictionary型
        ret = "{}";
    }
    return ret;
}

// 検査一覧取得
function Search_GetStudyList(HospitalID, FindParam, obj, func) {
    // HospitalID作成
    var hospID = Search_GetArrayJson(HospitalID);

    // FindParam作成
    var find = Search_GetDictionaryJson(FindParam);

    // Ajax用送信キー取得
    var localKey = Search_GetAjaxKey();

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetStudyList",
        data: "{\"HospitalID\":" + hospID
            + ",\"FindParam\":" + find + "}",
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
                else if (result.d.Message == "ServiceError") {
                    Common_ErrorProc("サービスでエラーが発生しました。", false);
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", false);
                }
                //return;
            }

            // 送信キーが不一致の場合キャンセルに設定するため結果を拡張
            result.d.IsCancel = (localKey != _Search_AjaxKey) ? true : false;

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
            result.d.IsCancel = (localKey != _Search_AjaxKey) ? true : false;

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        }
    });
}

// シリーズ一覧取得
function Search_GetSeriesList(StudyKey, obj, func) {
    // Ajax用送信キー取得
    var localKey = Search_GetAjaxKey();

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetSeriesList",
        data: "{\"StudyKey\":\"" + StudyKey + "\"}",
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

            // 送信キーが不一致の場合キャンセルに設定するため結果を拡張
            result.d.IsCancel = (localKey != _Search_AjaxKey) ? true : false;

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

// Image一覧取得
function Search_GetImageList(SeriesKey, obj, func) {
    // Ajax用送信キー取得
    var localKey = Search_GetAjaxKey();

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetImageList",
        data: "{\"SeriesKey\":\"" + SeriesKey + "\"}",
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

            // 送信キーが不一致の場合キャンセルに設定するため結果を拡張
            result.d.IsCancel = (localKey != _Search_AjaxKey) ? true : false;

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

// キーワード設定
function Search_SetKeyword(StudyKey, Keyword, obj, func) {
    // Keyword作成
    var key = Search_GetStringJson(Keyword);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/SetKeyword",
        data: "{\"StudyKey\":\"" + StudyKey + "\""
            + ",\"Keyword\":" + key + "}",
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

// 短縮URL取得
function Search_GetShortUrl(StudyKey, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetShortUrl",
        data: "{\"StudyKey\":\"" + StudyKey + "\"}",
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

// 短縮URL設定
function Search_SetShortUrl(StudyKey, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/SetShortUrl",
        data: "{\"StudyKey\":\"" + StudyKey + "\"}",
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

// 短縮URL削除
function Search_DelShortUrl(StudyKey, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/DelShortUrl",
        data: "{\"StudyKey\":\"" + StudyKey + "\"}",
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

// 検査削除
function Search_DelStudy(StudyKey, obj, func) {
    // Ajax用送信キー取得
    var localKey = Search_GetAjaxKey();

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/DelStudy",
        data: "{\"StudyKey\":\"" + StudyKey + "\"}",
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
                else if (result.d.Message == "ServiceError") {
                    Common_ErrorProc("サービスでエラーが発生しました。", false);
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", false);
                }
                //return;
            }

            // 送信キーが不一致の場合キャンセルに設定するため結果を拡張
            result.d.IsCancel = (localKey != _Search_AjaxKey) ? true : false;

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

// シリーズ削除
function Search_DelSeries(SeriesKey, obj, func) {
    // Ajax用送信キー取得
    var localKey = Search_GetAjaxKey();

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/DelSeries",
        data: "{\"SeriesKey\":\"" + SeriesKey + "\"}",
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
                else if (result.d.Message == "ServiceError") {
                    Common_ErrorProc("サービスでエラーが発生しました。", false);
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", false);
                }
                //return;
            }

            // 送信キーが不一致の場合キャンセルに設定するため結果を拡張
            result.d.IsCancel = (localKey != _Search_AjaxKey) ? true : false;

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

// Image削除
function Search_DelImage(ImageKey, obj, func) {
    // Ajax用送信キー取得
    var localKey = Search_GetAjaxKey();

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/DelImage",
        data: "{\"ImageKey\":\"" + ImageKey + "\"}",
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
                else if (result.d.Message == "ServiceError") {
                    Common_ErrorProc("サービスでエラーが発生しました。", false);
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", false);
                }
                //return;
            }

            // 送信キーが不一致の場合キャンセルに設定するため結果を拡張
            result.d.IsCancel = (localKey != _Search_AjaxKey) ? true : false;

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

// 使用容量情報取得
function Search_GetStorage(obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetStorage",
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

// コメント設定
function Search_SetComment(StudyKey, Comment, obj, func) {
    // Comment作成
    var comm = Search_GetStringJson(Comment);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/SetComment",
        data: "{\"StudyKey\":\"" + StudyKey + "\""
            + ",\"Comment\":" + comm + "}",
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

// ポータルマスタ取得
function Search_GetPortalMst(obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetPortalMst",
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

// ポータルマスタ設定
function Search_SetPortalMst(Param, obj, func) {
    // Param作成
    var param = Search_GetDictionaryJson(Param);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/SetPortalMst",
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
                else if (result.d.Message == "ParameterNG") {
                    Common_ErrorProc("パラメータが正しくありません。", false);
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

// ポータル取得
function Search_GetPortal(StudyKey, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/GetPortal",
        data: "{\"StudyKey\":\"" + StudyKey + "\"}",
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

// ポータル設定
function Search_SetPortal(StudyKey, Param, obj, func) {
    // Param作成
    var param = Search_GetDictionaryJson(Param);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/SetPortal",
        data: "{\"StudyKey\":\"" + StudyKey + "\""
            + ",\"Param\":" + param + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // データチェック
            if (result.d.Result == "Error") {
                if (result.d.Message == "NoSession") {
                    Common_ErrorProc("セッションの有効期限が切れています。", true);
                }
                else if (result.d.Message == "ParameterNG") {
                    Common_ErrorProc("パラメータが正しくありません。", false);
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

// 検査パスワード設定
function Search_SetStudyPassword(StudyKey, Password, obj, func) {
    // Password作成
    var pass = Search_GetStringJson(Password);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./SearchWebService.asmx/SetStudyPassword",
        data: "{\"StudyKey\":\"" + StudyKey + "\""
            + ",\"Password\":" + pass + "}",
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
