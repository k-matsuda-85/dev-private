/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// トップリンク
var Tool_TopLink = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_TopLink.Enabled) {
            return;
        }
        Tool_TopLink.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-TopLink").addClass("Tool-Common-SizeC Tool-TopLink-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-TopLink").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態
                $this.removeClass("Tool-TopLink-OFF").addClass("Tool-TopLink-ON");

                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

                // タッチイベント設定
                var event = function (e) {
                    // タッチ移動時
                    if (e.type == "touchmove") {
                        // 位置情報更新後、ドラッグ状態の場合
                        if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                            // 選択状態解除
                            $this.removeClass("Tool-TopLink-ON").addClass("Tool-TopLink-OFF");

                            // タッチイベント解除
                            $this.off("touchmove touchend touchcancel", event);
                        }
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && !pointInfo.IsDrag) {
                        // タッチイベント二重動作防止のためタイマを使用する
                        setTimeout(function () {
                            // コマンド処理
                            Tool_TopLink.Command();
                        }, 100);
                    }

                    // 選択状態解除
                    $this.removeClass("Tool-TopLink-ON").addClass("Tool-TopLink-OFF");

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                var $this = $(this);

                // 選択状態
                $this.removeClass("Tool-TopLink-OFF").addClass("Tool-TopLink-ON");

                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

                // マウスイベント設定
                var event = function (e) {
                    // マウス移動時
                    if (e.type == "mousemove") {
                        // 位置情報更新後、ドラッグ状態の場合
                        if (pointInfo.Update(e.pageX, e.pageY)) {
                            // 選択状態解除
                            $this.removeClass("Tool-TopLink-ON").addClass("Tool-TopLink-OFF");

                            // マウスイベント解除
                            $(document).off("mousemove mouseup mouseout", event);
                        }
                        return;
                    }

                    // 画面内をドラッグしていれば継続
                    if (e.type == "mouseout" && e.relatedTarget) {
                        return;
                    }

                    // クリック時
                    if (e.type == "mouseup" && !pointInfo.IsDrag) {
                        // コマンド処理
                        Tool_TopLink.Command();
                    }

                    // 選択状態解除
                    $this.removeClass("Tool-TopLink-ON").addClass("Tool-TopLink-OFF");

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });
    },
    // コマンド
    Command: function () {
        // パラメータチェック
        var url = $("#ViewerConfig").data("TopLinkURL");
        if (url == "") {
            return;
        }

        // トップリンク起動処理
        Common_WindowOpen(url, "TopLink", false);
    }
}
