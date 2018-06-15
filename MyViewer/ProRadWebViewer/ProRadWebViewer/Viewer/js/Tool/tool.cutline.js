/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// カットライン
var Tool_Cutline = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_Cutline.Enabled) {
            return;
        }
        Tool_Cutline.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-Cutline").addClass("Tool-Common-SizeA Tool-Cutline-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-Cutline").on({
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
                        Tool_Cutline.Click();
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
                        Tool_Cutline.Click();
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
        if ($("#Tool-Cutline").hasClass("Tool-Cutline-OFF")) {
            // 有効
            Tool_Cutline.Command(true);
        }
        else {
            // 無効
            Tool_Cutline.Command(false);
        }
    },
    // コマンド
    Command: function (command) {
        // コマンド確認
        var flag;
        if (command == true) {
            // 有効
            flag = true;

            // アイコン変更
            $("#Tool-Cutline").removeClass("Tool-Cutline-OFF").addClass("Tool-Cutline-ON");
        }
        else {
            // 無効
            flag = false;

            // アイコン変更
            $("#Tool-Cutline").removeClass("Tool-Cutline-ON").addClass("Tool-Cutline-OFF");
        }

        // カットライン制御
        var data = viewer.getData();
        if (data != null && data.SeriesDatas != null) {
            data.isCutline = flag;
        }
    }
}
