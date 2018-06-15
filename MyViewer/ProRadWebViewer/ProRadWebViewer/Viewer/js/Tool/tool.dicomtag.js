/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// DicomTag表示
var Tool_DicomTag = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_DicomTag.Enabled) {
            return;
        }
        Tool_DicomTag.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-DicomTag").addClass("Tool-Common-SizeA Tool-DicomTag-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-DicomTag").on({
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
                        Tool_DicomTag.Command();
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
                        Tool_DicomTag.Command();
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
        // パラメータ作成
        var series = viewer.getSelectSeries();
        if (series != null) {
            var sop = series.getSelectSop();
            if (sop != null && sop.sopData != null && !sop.sopData.InitParam.IsImageInfo) {
                // Viewer起動処理
                Common_WindowOpen("./WebDicomTag.aspx?sk=" + $("#ViewerConfig").data("sk") + "&key=" + sop.sopData.InitParam.ImageKey, "DicomTag" + $("#ViewerConfig").data("time"), true);
            }
        }
    }
}
