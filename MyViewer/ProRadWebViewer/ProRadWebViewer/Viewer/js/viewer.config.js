/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// パラメータ取得
function Viewer_GetParams(obj, func, retry) {
    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetParams",
        data: "{\"SKey\":" + _Viewer_SKey + "}",
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
            // iOS8で初回時通信が出来ないため暫定追加
            if (retry > 0) {
                // リトライ
                retry--;
                Viewer_GetParams(obj, func, retry);
            }
            else {
                // エラー
                Common_ErrorProc("HTTP通信でエラーが発生しました。", true);
            }
        }
    });
}

// ユーザーコンフィグ取得
function Viewer_GetUserConfig(obj, func) {
    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetUserConfig",
        data: "{\"SKey\":" + _Viewer_SKey + "}",
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

// モダリティコンフィグ取得
function Viewer_GetModalityConfig(obj, func) {
    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetModalityConfig",
        data: "{\"SKey\":" + _Viewer_SKey + "}",
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

// アノテーション取得
function Viewer_GetAnnotationList(obj, func) {
    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "./ViewerWebService.asmx/GetAnnotationList",
        data: "{\"SKey\":" + _Viewer_SKey + "}",
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

// モダリティ情報取得
function Viewer_GetModalityConfigVal(Modality, Key) {
    var config = $("#ViewerConfig").data("ModalityConfig");
    if (Key in config) {
        if (Modality in config[Key]) {
            return config[Key][Modality];
        }
        else if ("" in config[Key]) {
            return config[Key][""];
        }
        return "";
    }
    return "";
}

// アノテーション情報取得
function Viewer_GetAnnotationVal(Modality) {
    var config = $("#ViewerConfig").data("AnnotationList");
    var ret = new Array();
    var mod = "";
    $(config).each(function () {
        if (this.Modality == Modality) {
            mod = Modality;
            return false;
        }
    });
    $(config).each(function () {
        if (this.Modality == mod) {
            ret.push(this);
        }
    });
    return ret;
}

// 要求タグ取得
function Viewer_GetRequestTags(Modality) {
    var ret = new Array();

    // アノテーション用追加
    var anno = Viewer_GetAnnotationVal(Modality);
    $(anno).each(function () {
        var item = this.Tag.split(";");
        $(item).each(function () {
            // 固定要素を取得
            if (!isNaN(parseInt(this))) {
                // 無ければ追加
                if (!(this in ret)) {
                    ret.push(this);
                }
            }
        });
    });
    return ret;
}
