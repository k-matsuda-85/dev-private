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
        OptionWindow_Init();
    }, 100);
});

// 初期化処理
function OptionWindow_Init() {
    // Cookie取得
    var dispType = Common_GetCookie("DispType");
    if (dispType != "") {
        // 現在の表示位置設定
        $("#DispType").val(dispType);
    }

    // スクリーン座標が取れるか確認
    if (window.screenX != undefined && window.screenY != undefined) {
        // 現在位置の設定ボタンを追加
        $("#DispType").after(
            $("<input>").attr("type", "button").attr("id", "SetButton").val(" 現在位置 ")
        );
    }

    // 初期化完了のため表示
    $("body").css("visibility", "visible");

    // デスクトップの場合
    if (Common_IsDesktop()) {
        // 現在位置ボタンイベント
        $("#SetButton").click(function () {
            // 現在位置を表示
            $("#DispType").val(window.screenX + "," + window.screenY + "," + window.outerWidth + "," + window.outerHeight);
        });

        // Cookie登録ボタンイベント
        $("#AddButton").click(function () {
            // パラメータチェック
            var val = $("#DispType").val();
            var tmp = val.split(",");
            if (tmp.length != 4 ||
                isNaN(parseInt(tmp[0])) ||
                isNaN(parseInt(tmp[1])) ||
                isNaN(parseInt(tmp[2])) ||
                isNaN(parseInt(tmp[3]))) {
                return;
            }

            // Cookie登録
            Common_SetCookie("DispType", val, 1);
            alert("登録しました。");
        });

        // Cookie削除ボタンイベント
        $("#ResetButton").click(function () {
            // Cookie削除
            Common_ClearCookie("DispType", 1);
            $("#DispType").val("");
            alert("削除しました。");
        });
    }
}
