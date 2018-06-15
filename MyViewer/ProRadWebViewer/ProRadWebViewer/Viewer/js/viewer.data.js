/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var _Viewer_AjaxKey = [];       // Ajax用送信キー
var _Viewer_AjaxSend = false;   // Ajax用送信フラグ
var _Viewer_SKey = "\"\"";      // Ajax用SKey

// Ajax用送信キー取得
function Viewer_GetAjaxKey(index) {
    var i = parseInt(index);
    if (isNaN(i)) {
        i = 0;
    }
    if (!_Viewer_AjaxKey[i]) {
        _Viewer_AjaxKey[i] = 0;
    }
    _Viewer_AjaxKey[i]++;
    if (_Viewer_AjaxKey[i] >= Number.MAX_VALUE) {
        _Viewer_AjaxKey[i] = 0;
    }
    return _Viewer_AjaxKey[i];
}

// 文字列設定用Json文字列取得
function Viewer_GetStringJson(param) {
    return "\"" + param.toString().replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, '\\"') + "\"";
}

// 配列設定用Json文字列取得
function Viewer_GetArrayJson(param) {
    var ret = "";
    if ($.isArray(param)) {
        for (var key in param) {
            if (param[key] == null) {
                continue;
            }
            if ($.isArray(param[key])) {
                ret += Viewer_GetArrayJson(param[key]) + ",";
            }
            else if ($.isPlainObject(param[key])) {
                ret += Viewer_GetDictionaryJson(param[key]) + ",";
            }
            else {
                ret += Viewer_GetStringJson(param[key]) + ",";
            }
        }
        ret = "[" + ret.substring(0, ret.length - 1) + "]";
    }
    else if (!$.isPlainObject(param)) {
        // 文字列の場合1個の配列として処理
        ret = "[" + Viewer_GetStringJson(param) + "]";
    }
    else {
        // 0個の配列
        ret = "[]";
    }
    return ret;
}

// Dictionary型設定用Json文字列取得
function Viewer_GetDictionaryJson(param) {
    var ret = "";
    if ($.isArray(param) || $.isPlainObject(param)) {
        for (var key in param) {
            if (param[key] == null) {
                continue;
            }
            ret += Viewer_GetStringJson(key) + ":";
            if ($.isArray(param[key])) {
                ret += Viewer_GetArrayJson(param[key]) + ",";
            }
            else if ($.isPlainObject(param[key])) {
                ret += Viewer_GetDictionaryJson(param[key]) + ",";
            }
            else {
                ret += Viewer_GetStringJson(param[key]) + ",";
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

// 過去検査一覧取得
function Viewer_GetPastStudyList(PatientID, StudyKey, obj, func) {
    // PatientID作成
    var patiID = Viewer_GetStringJson(PatientID);

    // Ajax用送信キー取得
    var localKey = Viewer_GetAjaxKey();

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetPastStudyList",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"PatientID\":" + patiID
            + ",\"StudyKey\":\"" + StudyKey + "\"}",
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
                else if (result.d.Message == "NoData") {
                    Common_ErrorProc("該当する患者情報が見つかりませんでした。", true);
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", true);
                }
                return;
            }

            // 送信キーが不一致の場合キャンセルに設定するため結果を拡張
            result.d.IsCancel = (localKey != _Viewer_AjaxKey[0]) ? true : false;

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

// シリーズ一覧取得
function Viewer_GetSeriesList(StudyKey, Password, obj, func) {
    // Password作成
    var password = null;
    if (Password != null) {
        password = Viewer_GetStringJson(Password);
    }

    // Ajax用送信キー取得
    var localKey = Viewer_GetAjaxKey();

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetSeriesList",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"StudyKey\":\"" + StudyKey + "\""
            + ",\"Password\":" + password + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // データチェック
            if (result.d.Result == "Error") {
                if (result.d.Message != "PasswordNG") {
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
            }

            // 送信キーが不一致の場合キャンセルに設定するため結果を拡張
            result.d.IsCancel = (localKey != _Viewer_AjaxKey[0]) ? true : false;

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
function Viewer_GetImageList(SeriesKey, obj, func) {
    // Ajax用送信キー取得
    var localKey = Viewer_GetAjaxKey(1);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetImageList",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"SeriesKey\":\"" + SeriesKey + "\"}",
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
            result.d.IsCancel = (localKey != _Viewer_AjaxKey[1]) ? true : false;

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
            result.d.IsCancel = (localKey != _Viewer_AjaxKey[1]) ? true : false;

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        }
    });
}
function Viewer_GetImageList2(ImageKeys, obj, func) {
    // ImageKeys作成
    var imKeys = Viewer_GetArrayJson(ImageKeys);

    // Ajax用送信キー取得
    var localKey = Viewer_GetAjaxKey(1);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetImageList2",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"ImageKeys\":" + imKeys + "}",
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
            result.d.IsCancel = (localKey != _Viewer_AjaxKey[1]) ? true : false;

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
            result.d.IsCancel = (localKey != _Viewer_AjaxKey[1]) ? true : false;

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        }
    });
}

// Image情報取得
function Viewer_GetImageInfo(data) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        global: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetImageInfo",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"ImageKey\":\"" + data.ImageKey + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            // データチェック
            if (result.d.Result == "Error") {
                if (result.d.Message == "NoSession") {
                    Common_ErrorProc("セッションの有効期限が切れています。", true);
                }
                else if (result.d.Message == "ServiceError") {
                    //Common_ErrorProc("サービスでエラーが発生しました。", false);
                }
                else if (result.d.Message == "NoData") {
                    //
                }
                else {
                    Common_ErrorProc("サービスで例外が発生しました。", false);
                }

                // 関数呼び出し
                data.onError();
                return;
            }

            // データ更新
            data.Columns = result.d.Tag.Columns;
            data.ImageOrientationPatient = result.d.Tag.ImageOrientationPatient;
            data.ImagePositionPatient = result.d.Tag.ImagePositionPatient;
            data.InstanceNumber = result.d.Tag.InstanceNumber;
            data.IsImageInfo = result.d.Tag.IsImageInfo;
            data.PixelSpacing = result.d.Tag.PixelSpacing;
            data.Rows = result.d.Tag.Rows;
            data.SliceLocation = result.d.Tag.SliceLocation;
            data.SliceThickness = result.d.Tag.SliceThickness;
            data.WindowCenter = result.d.Tag.WindowCenter;
            data.WindowWidth = result.d.Tag.WindowWidth;

            // 関数呼び出し
            data.onInit();
        },
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", false);

            // 関数呼び出し
            data.onError();
        }
    });
}

// DicomTag取得
function Viewer_GetDicomTag(ImageKey, Tags, obj, func) {
    // Tags作成
    var tags = Viewer_GetArrayJson(Tags);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetDicomTag",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"ImageKey\":\"" + ImageKey + "\""
            + ",\"Tags\":" + tags + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        global: false,
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

            // キャンセルなし
            result.d.IsCancel = false;

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

// DicomTag一覧取得
function Viewer_GetDicomTagAll(ImageKey, obj, func) {
    // Ajax用送信キー取得
    var localKey = Viewer_GetAjaxKey();

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetDicomTagAll",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"ImageKey\":\"" + ImageKey + "\"}",
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

            // 送信キーが不一致の場合キャンセルに設定するため結果を拡張
            result.d.IsCancel = (localKey != _Viewer_AjaxKey[0]) ? true : false;

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

// CT値取得
function Viewer_GetCTValue(ImageKey, Params, obj, func) {
    // 送信中判定
    if (_Viewer_AjaxSend == false) {
        // 送信中
        _Viewer_AjaxSend = true;

        // HTTP通信開始
        $.ajax({
            async: true,
            cache: false,
            type: "POST",
            url: "./ViewerWebService.asmx/GetCTValue",
            data: "{\"SKey\":" + _Viewer_SKey
                + ",\"ImageKey\":\"" + ImageKey + "\""
                + ",\"Params\":\"" + Params + "\"}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            context: obj,
            global: false,
            success: function (result) {
                // 送信完了
                _Viewer_AjaxSend = false;

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

                    // 関数呼び出し
                    if ($.isFunction(func)) {
                        func("", obj);
                    }
                    return;
                }

                // 関数呼び出し
                if ($.isFunction(func)) {
                    func(result.d.Value, obj);
                }
            },
            error: function (result) {
                // エラー
                _Viewer_AjaxSend = false;
                Common_ErrorProc("HTTP通信でエラーが発生しました。", false);

                // 関数呼び出し
                if ($.isFunction(func)) {
                    func("", obj);
                }
            }
        });
    }
    else {
        // 関数呼び出し
        if ($.isFunction(func)) {
            func("", obj);
        }
    }
}

// 検査メモ取得
function Viewer_GetStudyMemo(StudyKey, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetStudyMemo",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"StudyKey\":\"" + StudyKey + "\"}",
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

// 検査メモ履歴取得
function Viewer_GetStudyMemoHistory(StudyKey, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetStudyMemoHistory",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"StudyKey\":\"" + StudyKey + "\"}",
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

// 検査メモ設定
function Viewer_SetStudyMemo(StudyKey, UserName, Memo, obj, func) {
    // UserName作成
    var user = Viewer_GetStringJson(UserName);

    // Memo作成
    var memo = Viewer_GetStringJson(Memo);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/SetStudyMemo",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"StudyKey\":\"" + StudyKey + "\""
            + ",\"UserName\":" + user
            + ",\"Memo\":" + memo + "}",
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

// 画像出力
function Viewer_PutImage(Trace, Path, obj, func) {
    // Trace作成
    var trace = Viewer_GetArrayJson(Trace);

    // Path作成
    var path = Viewer_GetStringJson(Path);

    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/PutImage",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"Trace\":" + trace
            + ",\"Path\":" + path + "}",
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
                    Common_ErrorProc("画像出力に失敗しました。", false);
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

// 事前画像対象一覧取得
function Viewer_PrefetchImageList(SeriesKey, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        global: false,
        type: "POST",
        url: "./ViewerWebService.asmx/PrefetchImageList",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"SeriesKey\":\"" + SeriesKey + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        },
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", false);

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(result, obj);
            }
        }
    });
}

// 事前画像取得
function Viewer_PrefetchImage(ImageKey, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        global: false,
        type: "POST",
        url: "./ViewerWebService.asmx/PrefetchImage",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"ImageKey\":\"" + ImageKey + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // 関数呼び出し
            if ($.isFunction(func)) {
                func(ImageKey, obj);
            }
        },
        error: function (result) {
            // エラー
            Common_ErrorProc("HTTP通信でエラーが発生しました。", false);

            // 関数呼び出し
            if ($.isFunction(func)) {
                func(ImageKey, obj);
            }
        }
    });
}

// GSPSデータ取得
function Viewer_GetGspsDataList(GSPSKey, obj, func) {
    // HTTP通信開始
    $.ajax({
        async: true,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetGspsDataList",
        data: "{\"SKey\":" + _Viewer_SKey
            + ",\"GSPSKey\":\"" + GSPSKey + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        context: obj,
        success: function (result) {
            // データチェック
            if (result.d.Result == "Error") {
                if (result.d.Message != "PasswordNG") {
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
