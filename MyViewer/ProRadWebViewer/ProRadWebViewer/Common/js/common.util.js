/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var _Common_ChildWindow = new Array();  // 子ウィンドウ取得用
var Common_ErrorProc_CloseFunc; // エラークローズ用関数

// 連携起動
function Common_WindowOpen(path, addname, child) {
    if (child == true) {
        // iOSバージョン取得
        var ver = Common_GetiOSVersion();

        // iOSバージョンが5以上、6以下の場合は連携させない(暫定)
        if (ver && ver >= 5 && ver <= 6) {
            window.open(path, addname);
        }
        else {
            _Common_ChildWindow.push(window.open(path, addname));
        }
    }
    else {
        if (addname == "") {
            location.replace(path);
        }
        else {
            window.open(path, addname);
        }
    }
}

// iOSバージョン取得
function Common_GetiOSVersion() {
    var ret;
    var ua = navigator.userAgent;
    var reg1 = new RegExp("iPhone|iPad");
    if (reg1.test(ua)) {
        var reg2 = new RegExp("OS (\\w+){1,3}");
        if (ua.match(reg2)) {
            var reg3 = new RegExp("_", "g");
            var ver = parseInt(RegExp.$1.replace(reg3, "" + "00").slice(0, 1));
            if (!isNaN(ver)) {
                ret = ver;
            }
        }
    }
    return ret;
}

// デスクトップ判定
function Common_IsDesktop() {
    var pf = navigator.platform;
    if (pf == "Win32" || pf == "Win64" || pf == "MacIntel") {
        return true;
    }
    return false;
}

// 画素比率
function Common_DevicePixelRatio() {
    if ('devicePixelRatio' in window) {
        // RetinaDisplayの場合
        if (window.devicePixelRatio == 2) {
            return 2;
        }
    }
    return 1;
}

// タッチポイント取得
function Common_GetTouch(e, id) {
    var item = new Object();
    if (e.originalEvent.touches) {
        if (id != undefined) {
            var i;
            for (i = 0; i < e.originalEvent.changedTouches.length; i++) {
                if (e.originalEvent.changedTouches[i].identifier == id) {
                    item.ID = e.originalEvent.changedTouches[i].identifier;
                    item.PointX = e.originalEvent.changedTouches[i].pageX;
                    item.PointY = e.originalEvent.changedTouches[i].pageY;
                    return item;
                }
            }
            return null;
        }
        if (e.originalEvent.touches.length > 1) {
            return null;
        }
        item.ID = e.originalEvent.changedTouches[0].identifier;
        item.PointX = e.originalEvent.changedTouches[0].pageX;
        item.PointY = e.originalEvent.changedTouches[0].pageY;
        return item;
    }
    item.ID = 0;
    item.PointX = e.pageX;
    item.PointY = e.pageY;
    return item;
}

// 閉じる
function Common_WindowClose() {
    window.open("about:blank", "_self");
    window.opener = window;
    window.close();
}

// 閉じる(子ウィンドウ用)
function Common_ChildWindowClose() {
    try {
        for (var i = _Common_ChildWindow.length - 1; i >= 0; i--) {
            if (_Common_ChildWindow[i] && _Common_ChildWindow[i].closed == false) {
                _Common_ChildWindow[i].close();
            }
        }
    }
    catch (e) {
    }
}

// エラー処理
function Common_ErrorProc(msg, close) {
    // 遅延処理
    setTimeout(function () {
        // メッセージ表示
        if (msg != "") {
            alert(msg);
        }

        // 閉じる
        if (close == true) {
            // 関数呼び出し
            if ($.isFunction(Common_ErrorProc_CloseFunc)) {
                Common_ErrorProc_CloseFunc();
            }
            else {
                Common_WindowClose();
            }
        }
    }, 100);
}

// CookiePath取得
function Common_GetCookiePath(level) {
    var path = "";
    if (level < 0) {
        path = location.pathname;
    }
    else {
        var spli = location.pathname.split("/");
        for (var i = 1; i < spli.length - 1 - level; i++) {
            path += "/" + spli[i];
        }
        path += "/";
    }
    return path;
}

// Cookie取得
function Common_GetCookie(key) {
    var tmp1 = " " + document.cookie + ";";
    var xx1 = 0;
    var xx2 = 0;
    var len = tmp1.length;
    while (xx1 < len) {
        xx2 = tmp1.indexOf(";", xx1);
        var tmp2 = tmp1.substring(xx1 + 1, xx2);
        var xx3 = tmp2.indexOf("=");
        if (tmp2.substring(0, xx3) == key) {
            return (decodeURIComponent(tmp2.substring(xx3 + 1, xx2 - xx1 - 1)));
        }
        xx1 = xx2 + 1;
    }
    return "";
}

// Cookie設定
function Common_SetCookie(key, val, level) {
    var path = Common_GetCookiePath(level);
    var tmp = key + "=" + encodeURIComponent(val) + "; ";
    tmp += "expires=Tue, 31-Dec-2030 23:59:59; ";
    tmp += "path=" + path + "; ";
    if (location.protocol == "https:") {
        tmp += "secure";
    }
    document.cookie = tmp;
}

// Cookie削除
function Common_ClearCookie(key, level) {
    var path = Common_GetCookiePath(level);
    document.cookie = key + "=" + "xx; expires=Tue, 1-Jan-1980 00:00:00; path=" + path + "; ";
}

// 要素位置情報用クラス
function Common_RectInfo($this) {
    var offset = $this.offset();
    this.Top = offset.top;
    this.Right = offset.left + $this.outerWidth();
    this.Bottom = offset.top + $this.outerHeight();
    this.Left = offset.left;
    this.IsHit = true;
    this.Update = function (x, y) {
        if (x < this.Left ||
            x > this.Right ||
            y < this.Top ||
            y > this.Bottom) {
            this.IsHit = false;
        }
        else {
            this.IsHit = true;
        }
        return this.IsHit;
    };
}
