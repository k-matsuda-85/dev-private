/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// レポート連携
var Tool_Report = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_Report.Enabled) {
            return;
        }
        Tool_Report.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-Report").addClass("Tool-Common-SizeA Tool-Report-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-Report").on({
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
                        Tool_Report.Command();
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
                        Tool_Report.Command();
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
        // パラメータチェック
        if ($("#ViewerConfig").data("ReportUrl") == "") {
            return;
        }

        // 選択検査取得
        var series = viewer.getSelectSeries();
        if (series == null || series.seriesData == null) {
            return;
        }
        var studyKey = series.seriesData.ExData.StudyKey;

        // 選択検査確認
        var patientID, studyDate, modality, accessionNumber;
        $("#StudyList-Table tr").each(function () {
            if ($(this).data("StudyKey") == studyKey) {
                patientID = encodeURIComponent($(this).data("PatientID"));
                studyDate = encodeURIComponent($(this).data("StudyDate"));
                modality = encodeURIComponent($(this).data("Modality"));
                accessionNumber = encodeURIComponent($(this).data("AccessionNumber"));
                return false;
            }
        });
        if (patientID == undefined) {
            return;
        }

        // 起動パラメータ変換
        var format = $("#ViewerConfig").data("ReportUrl");
        var reg = new RegExp("{[0-3]}");
        var reportUrl = "";
        for (var ma = format.match(reg); ma; ma = RegExp.rightContext.match(reg)) {
            // 先頭以外でマッチした場合はそれ以前の部分を追加
            if (RegExp.index != 0) {
                reportUrl += RegExp.leftContext;
            }

            // 該当文字列を追加
            if (RegExp.lastMatch == "{0}") {
                reportUrl += patientID;
            }
            else if (RegExp.lastMatch == "{1}") {
                reportUrl += studyDate;
            }
            else if (RegExp.lastMatch == "{2}") {
                reportUrl += modality;
            }
            else if (RegExp.lastMatch == "{3}") {
                reportUrl += accessionNumber;
            }
        }
        // 余り部分を追加
        reportUrl += RegExp.rightContext;

        // Viewer起動処理
        Common_WindowOpen(reportUrl, "Report", false);
    }
}

// レポート用画像出力
var Tool_ReportOutput = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_ReportOutput.Enabled) {
            return;
        }

        // パラメータチェック
        if ($("#ViewerConfig").data("rsoutpath") == null) {
            return;
        }
        Tool_ReportOutput.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-ReportOutput").addClass("Tool-Common-SizeA Tool-ReportOutput-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-ReportOutput").on({
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
                        Tool_ReportOutput.Command();
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
                        Tool_ReportOutput.Command();
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
    Command: function (command) {
        // パラメータチェック
        if (!Tool_ReportOutput.Enabled) {
            return;
        }

        // アクティブ処理
        if (command) {
            var event = $("#ViewerLib").data("MouseMove");
            if (!event) {
                return;
            }
            var point = ViewerUtil.getElementPoint($("#ViewerLib").get(0), event);
            var wnd = viewer.getSeriesPanelFromPoint(point.x, point.y);
            if (!wnd) {
                return;
            }
            var p = wnd.ToLocalPoint(point.x, point.y);
            var w = wnd.getSopPanelFromPoint(p.x, p.y);
            if (!w || w.sopData == null) {
                return;
            }
            w.setSelect();
        }

        // 描画情報取得
        var series = viewer.getSelectSeries();
        if (series == null) {
            return;
        }
        var sop = series.getSelectSop();
        if (sop == null || sop.sopData == null || sop.sopData.InitParam.IsImageInfo) {
            return;
        }
        var trace = sop.traceDraw();
        if (trace == null) {
            return;
        }

        // 画像出力
        Viewer_PutImage(trace, $("#ViewerConfig").data("rsoutpath"), null, null);
    }
}
