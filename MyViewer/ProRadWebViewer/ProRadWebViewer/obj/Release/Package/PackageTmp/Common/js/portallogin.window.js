/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 起動処理
$(window).load(function () {
    // サイズが0の場合があるのでタイマでチェックする
    var timerID = setInterval(function () {
        // サイズチェック
        if ($(window).width() == 0 || $(window).height() == 0) {
            return;
        }

        // タイマ終了
        clearInterval(timerID);

        // 初期化処理
        PortalLoginWindow.Init();
    }, 100);
});

// グローバル宣言
var PortalLoginWindow = {
    // 初期化
    Init: function () {
        // 初期フォーカス設定
        $("#ID input").focus();

        // クリックイベント設定
        $("#LoginButton").on("click", function () {
            // クリック処理
            PortalLoginWindow.Click();
        });

        // クリアイベント設定
        $("#ClearButton").on("click", function () {
            // クリア処理
            PortalLoginWindow.Clear();
        });

        // キーイベント設定
        $("#ID input, #Password input").on("keyup", function (e) {
            // Enter以外の場合
            if (e.keyCode != 13) {
                return;
            }

            // クリック処理
            PortalLoginWindow.Click();
        });

        // フォーカスイベント設定
        $("#ID input, #Password input").on("focus", function () {
            $(this).select();
        });
    },
    // クリック
    Click: function () {
        // 空文字チェック
        if ($("#ID input").val() == "") {
            $("#ID input").focus();
            return;
        }
        if ($("#Password input").val() == "") {
            $("#Password input").focus();
            return;
        }

        // 入力中をキャンセルするためフォーカスを外す
        $(":input").blur();

        // ログイン
        Common_Login($("#ID input").val(), $("#Password input").val(), "Portal", null, function (result) {
            // データチェック
            if (result.d == null || result.d != true) {
                alert("ユーザー名またはパスワードが違います。");
                $("#Password input").select();
                return;
            }

            // 検索起動処理
            window.parent.open("./Search/WebSearch.aspx", "_self");
        });
    },
    // クリア
    Clear: function () {
        $("#Password input").val("");
        $("#ID input").val("").focus();
    }
}
