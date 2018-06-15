/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 全リセット
var Tool_Reset = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_Reset.Enabled) {
            return;
        }
        Tool_Reset.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-Reset").addClass("Tool-Common-SizeA Tool-Reset-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-Reset").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態
                $this.removeClass($this.attr("id") + "-OFF").addClass($this.attr("id") + "-ON");

                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

                // タッチイベント設定
                var event = function (e) {
                    // タッチ移動時
                    if (e.type == "touchmove") {
                        // 位置情報更新後、ドラッグ状態の場合
                        if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                            // 選択状態解除
                            $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

                            // タッチイベント解除
                            $this.off("touchmove touchend touchcancel", event);
                        }
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && !pointInfo.IsDrag) {
                        // コマンド処理
                        Tool_Reset.Command();
                    }

                    // 選択状態解除
                    $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                var $this = $(this);

                // 選択状態
                $this.removeClass($this.attr("id") + "-OFF").addClass($this.attr("id") + "-ON");

                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

                // マウスイベント設定
                var event = function (e) {
                    // マウス移動時
                    if (e.type == "mousemove") {
                        // 位置情報更新後、ドラッグ状態の場合
                        if (pointInfo.Update(e.pageX, e.pageY)) {
                            // 選択状態解除
                            $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

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
                        Tool_Reset.Command();
                    }

                    // 選択状態解除
                    $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });
    },
    // コマンド
    Command: function () {
        // 選択シリーズ取得
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null ||
        selectSeries.seriesData == null ||
        selectSeries.seriesData.SopDatas.length <= selectSeries.seriesData.SopIndex ||
        selectSeries.seriesData.SopDatas[selectSeries.seriesData.SopIndex] == null) {
            return;
        }

        // リセット
        selectSeries.seriesData.reset();
    }
}
