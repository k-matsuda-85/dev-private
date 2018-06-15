/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var _Common_ChildWindow = new Array();  // 子ウィンドウ取得用
var Common_ErrorProc_CloseFunc; // エラークローズ用関数

// 日付表示
function Common_DateFmt(strDate) {
    var value = strDate.replace(" ", "");
    if (value.length != 8) {
        return strDate;
    }
    var yyyy = value.substring(0, 4);
    var mm = value.substring(4, 6);
    var dd = value.substring(6, 8);
    if (isNaN(parseInt(yyyy)) || isNaN(parseInt(mm)) || isNaN(parseInt(dd))) {
        return strDate;
    }
    return yyyy + "/" + mm + "/" + dd;
}

// 時間表示
function Common_TimeFmt(strTime) {
    var value = strTime.replace(" ", "");
    value = value.split(".")[0];
    if (value.length != 6) {
        return strTime;
    }
    var hh = value.substring(0, 2);
    var mm = value.substring(2, 4);
    var ss = value.substring(4, 6);
    if (isNaN(parseInt(hh)) || isNaN(parseInt(mm)) || isNaN(parseInt(ss))) {
        return strDate;
    }
    return hh + ":" + mm + ":" + ss;
}

// 小数点表示
function Common_DecimalFmt(strDecimal, format) {
    var dec = parseFloat(strDecimal);
    var fmt = parseFloat(format);
    if (isNaN(dec) || (format != "" && isNaN(fmt))) {
        return strDecimal;
    }
    var decsp = strDecimal.split(".");
    var fmtsp;
    if (format != "") {
        fmtsp = format.split(".");
    }
    else {
        fmtsp = new Array();
        fmtsp.push("0");
        if ((decsp[0] == "0" || decsp[0] == "-0") && decsp.length == 2) {
            var len = decsp[1].search(/[^0]/);
            if (len >= 0) {
                var newfm = "";
                for (var i = 0; i <= len; i++) {
                    newfm += "0";
                }
                fmtsp.push(newfm);
            }
        }
    }
    var ret = "";
    if (decsp[0].length < fmtsp[0].length) {
        ret += fmtsp[0].substring(0, fmtsp[0].length - decsp[0].length);
    }
    ret += decsp[0];
    if (decsp.length == 2 && fmtsp.length == 2) {
        ret += ".";
        if (decsp[1].length < fmtsp[1].length) {
            ret += decsp[1] + fmtsp[1].substring(fmtsp[1].length - decsp[1].length - 1);
        }
        else {
            ret += decsp[1].substring(0, fmtsp[1].length);
        }
    }
    return ret;
}

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

// URLパラメータ取得
function Common_GetUrlParams() {
    var vars = [];
    if (window.location.search == "") {
        return vars;
    }
    return Common_ParseUrlParams(window.location.search.slice(1), true);
}

// URLパラメータ分離
function Common_ParseUrlParams(params, lower) {
    var hashes = params.split('&');
    var vars = new Array(hashes.length);
    for (var i = 0; i < hashes.length; i++) {
        var hash = hashes[i].split('=');

        // 値はエンコードしたまま渡す場合があるのでdecodeURIComponentは各自行う
        if (lower) {
            vars[decodeURIComponent(hash[0]).toLowerCase()] = hash[1];
        }
        else {
            vars[decodeURIComponent(hash[0])] = hash[1];
        }
    }
    return vars;
}

// IEバージョン取得(IE5～9まで)
function Common_GetIeVersion() {
    var undef, v = 3, div = document.createElement('div');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        div.getElementsByTagName('i')[0]
    );

    return v > 4 ? v : undef;
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

// Androidバージョン取得
function Common_GetAndroidVersion() {
    var ret;
    var ua = navigator.userAgent;
    if (ua.match(/Android ([\d\.]{1,})/)) {
        ret = RegExp.$1;
    }
    if (ret) {
        var vars = [];
        vars[0] = 0;
        vars[1] = 0;
        vars[2] = 0;
        var sp = ret.split(".");
        var par = parseInt(sp[0]);
        if (!isNaN(par)) {
            vars[0] = par;
            if (sp.length > 1) {
                par = parseInt(sp[1]);
                if (!isNaN(par)) {
                    vars[1] = par;
                    if (sp.length > 2) {
                        par = parseInt(sp[2]);
                        if (!isNaN(par)) {
                            vars[2] = par;
                        }
                    }
                }
            }
            ret = vars;
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

// スクロールバー幅取得
function Common_ScrollBarWidth() {
    var div1 = document.createElement('div');
    div1.style.width = document.body.clientWidth + "px";
    div1.style.height = document.body.clientHeight + "px";
    div1.style.overflow = "hidden";
    var div2 = document.createElement('div');
    div2.style.width = document.body.clientWidth + 1 + "px";
    div2.style.height = document.body.clientHeight + "px";
    div1.appendChild(div2);
    document.body.appendChild(div1);
    var width = div1.clientWidth;
    div1.style.overflow = "scroll";
    width -= div1.clientWidth;
    if (!width)
        width = div1.offsetWidth - div1.clientWidth;
    div1.removeChild(div2);
    document.body.removeChild(div1);
    return width;
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

// 閉じる
function Common_WindowClose() {
    if (Common_GetIeVersion() <= 6) {
        window.open("about:blank", "_self");
        window.opener = window;
        window.close();
    }
    else {
        window.open("", "_self").close();
    }
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

// ログアウト
function Common_WindowLogout(url) {
    // 閉じる(子ウィンドウ用)
    Common_ChildWindowClose();

    // HTTP通信開始
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: "../Common/CommonWebService.asmx/Logout",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function () {
            if (url) {
                location.replace(url);
            }
            else {
                location.replace("../WebLogin.aspx");
            }
        },
        error: function (obj, err) {
            if (url) {
                location.replace(url);
            }
            else {
                location.replace("../WebLogin.aspx");
            }
        }
    });
}

// 表示位置設定
function Common_SetWindow(x, y, width, height) {
    try {
        window.moveTo(x, y);
        window.resizeTo(width, height);
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

// 自動ログアウト
function Common_AutoLogout(login, timeout) {
    // 時間情報チェック
    var time = parseInt(timeout);
    if (isNaN(time) || time == 0) {
        return;
    }

    // 分に変換
    time = time * 60000;

    // 自動ログアウト用更新処理
    Common_AutoLogoutUpdate();

    // タイマ起動開始
    var timer = setInterval(function () {
        // 更新時刻を取得
        var cookie = Common_GetCookie("AutoLogout");
        var pre = parseInt(cookie);
        if (isNaN(pre)) {
            // Cookieに無い場合は終了
            clearTimeout(timer);
            return;
        }

        // 時間確認
        var now = new Date();
        if (pre + time > now.getTime()) {
            return;
        }

        // メッセージ表示
        alert("一定時間経過したため、ログアウトしました。");

        if (login == true) {
            // ログアウト
            Common_WindowLogout();
        }
        else {
            // 閉じる
            Common_WindowClose();
        }
    }, 10000);
}

// 自動ログアウト用更新処理
function Common_AutoLogoutUpdate() {
    //現在時刻を取得
    var now = new Date();

    // Cookie設定
    Common_SetCookie("AutoLogout", now.getTime(), 1);
}

// ソート処理
function Common_TableSort(id, colId, type, dir) {
    // id   :テーブルのID
    // colId:ソートする列
    // type :ソート方式(n:数値、s:文字列、d:データキャッシュ)
    // dir  :ソート方向(a:昇順、d:降順)

    var i;
    var rowIds = new Array();

    // tr要素のリスト取得
    var trList = $(id).find("tbody").find("tr");

    // ソート用IDリストを作成
    for (i = 0; i < trList.length; i++) {
        rowIds[i] = i;
    }

    // ソート
    rowIds.sort(function (a, b) {
        // 比較値取得
        var sA, sB;
        if (type == "d") {
            sA = $(trList).eq(a).children(":eq(" + colId + ")").data("Sort") ? $(trList).eq(a).children(":eq(" + colId + ")").data("Sort") : "";
            sB = $(trList).eq(b).children(":eq(" + colId + ")").data("Sort") ? $(trList).eq(b).children(":eq(" + colId + ")").data("Sort") : "";
        }
        else {
            sA = $(trList).eq(a).children(":eq(" + colId + ")").text();
            sB = $(trList).eq(b).children(":eq(" + colId + ")").text();
        }

        // 数値変換
        if (type == "n" && !isNaN(parseInt(sA)) && !isNaN(parseInt(sB))) {
            try {
                sA = eval(sA);
                sB = eval(sB);
            }
            catch (e) {
                // 変換失敗の場合は文字列に戻す
                sA = $(trList).eq(a).children(":eq(" + colId + ")").text();
                sB = $(trList).eq(b).children(":eq(" + colId + ")").text();
            }
        }

        // 比較
        if (sA == sB) {
            return 0;
        } else if (sA > sB) {
            if (dir == "a") {
                return 1;
            }
            else {
                return -1;
            }
        } else {
            if (dir == "a") {
                return -1;
            }
            else {
                return 1;
            }
        }
    });

    // ソート後のテーブル作成
    var tbody = $("<tbody>");
    for (i = 0; i < trList.length; i++) {
        tbody.append($(trList).eq(rowIds[i]).clone(true));
    }

    // テーブル更新
    $(id).find("tbody").replaceWith(tbody);
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

// 位置情報用クラス
function Common_PointInfo(x, y) {
    this.Margin = 10;
    this.X = x;
    this.Y = y;
    this.IsDrag = false;
    this.Update = function (x, y) {
        if (x < this.X - this.Margin ||
            x > this.X + this.Margin ||
            y < this.Y - this.Margin ||
            y > this.Y + this.Margin) {
            this.IsDrag = true;
        }
        return this.IsDrag;
    };
}
