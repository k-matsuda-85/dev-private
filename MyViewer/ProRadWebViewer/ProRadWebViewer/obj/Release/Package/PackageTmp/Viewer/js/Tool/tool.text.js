﻿/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// テキスト
var Tool_Text = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_Text.Enabled) {
            return;
        }
        Tool_Text.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-Text").addClass("Tool-Common-SizeA Tool-Text-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-Text").on({
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
                        // クリック処理
                        Tool_Text.Click();
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
                        Tool_Text.Click();
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
        if ($("#Tool-Text").hasClass("Tool-Text-OFF")) {
            // ツール名更新
            if (Tool_Menu.UpdateName("Text")) {
                // メニューキャンセル処理
                Tool_Menu.Cancel();

                // 有効
                Tool_Text.Command(true);
            }
        }
        else {
            // デフォルトツール設定
            Tool_Menu.Default();
        }
    },
    // コマンド
    Command: function (command) {
        // コマンド確認
        if (command == true) {
            // ViewerCtrl呼び出し
            viewer.setEventControl(ViewerControl_Draw, ViewerDraw_Text);

            // アイコン変更
            $("#Tool-Text").removeClass("Tool-Text-OFF").addClass("Tool-Text-ON");
        }
        else {
            // ViewerCtrl呼び出し
            viewer.setEventControl(null);

            // アイコン変更
            $("#Tool-Text").removeClass("Tool-Text-ON").addClass("Tool-Text-OFF");
        }
    }
}
