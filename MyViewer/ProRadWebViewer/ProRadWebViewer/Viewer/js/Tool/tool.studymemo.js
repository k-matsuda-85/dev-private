/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 検査メモ
var Tool_StudyMemo = {
    // 有効
    Enabled: false,
    // 表示
    Visible: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_StudyMemo.Enabled) {
            return;
        }

        // 権限確認
        if ($("#ViewerConfig").data("StudyMemo") != "1" &&
        $("#ViewerConfig").data("StudyMemo") != "2" &&
        $("#ViewerConfig").data("StudyMemo") != "3") {
            return;
        }
        Tool_StudyMemo.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-StudyMemo").addClass("Tool-Common-SizeA Tool-StudyMemo-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-StudyMemo").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

                // タッチイベント設定
                var event = function (e) {
                    // タッチ移動時
                    if (e.type == "touchmove") {
                        // 位置情報更新
                        pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && !pointInfo.IsDrag) {
                        // タッチイベント二重動作防止のためタイマを使用する
                        setTimeout(function () {
                            // クリック処理
                            Tool_StudyMemo.Click();
                        }, 100);
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

                // マウスイベント設定
                var event = function (e) {
                    // マウス移動時
                    if (e.type == "mousemove") {
                        // 位置情報更新
                        pointInfo.Update(e.pageX, e.pageY);
                        return;
                    }

                    // 画面内をドラッグしていれば継続
                    if (e.type == "mouseout" && e.relatedTarget) {
                        return;
                    }

                    // クリック時
                    if (e.type == "mouseup" && !pointInfo.IsDrag) {
                        // クリック処理
                        Tool_StudyMemo.Click();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });
    },
    // クリック
    Click: function () {
        // 未選択状態の場合
        if ($("#Tool-StudyMemo").hasClass("Tool-StudyMemo-OFF")) {
            // 有効
            Tool_StudyMemo.Command(true);
        }
        else {
            // 無効
            Tool_StudyMemo.Command(false);
        }
    },
    // コマンド
    Command: function (command) {
        // コマンド確認
        if (command == "Hide") {
            // 検査メモ非表示
            $("#ViewerLeft").css("marginRight", "");
        }
        else if (command == "Show") {
            // 選択状態の場合
            if ($("#Tool-StudyMemo").hasClass("Tool-StudyMemo-ON")) {
                // 検査メモ表示
                $("#ViewerLeft").css("marginRight", $("#ViewerConfig").data("StudyMemoWidth") + "px");
            }
        }
        else if (command == true) {
            // 検査メモ表示
            $("#ViewerLeft").css("marginRight", $("#ViewerConfig").data("StudyMemoWidth") + "px");
            Tool_StudyMemo.Visible = true;

            // アイコン変更
            $("#Tool-StudyMemo").removeClass("Tool-StudyMemo-OFF").addClass("Tool-StudyMemo-ON");

            // 検査メモ表示変更処理
            ViewerStudyMemo_Change($("#StudyList-Table .StudyList-Table-Row-Select"));
        }
        else {
            // 検査メモ終了処理
            if (!ViewerStudyMemo_End()) {
                return;
            }
            // 検査メモ非表示
            $("#ViewerLeft").css("marginRight", "");
            Tool_StudyMemo.Visible = false;

            // アイコン変更
            $("#Tool-StudyMemo").removeClass("Tool-StudyMemo-ON").addClass("Tool-StudyMemo-OFF");
        }
    }
}
