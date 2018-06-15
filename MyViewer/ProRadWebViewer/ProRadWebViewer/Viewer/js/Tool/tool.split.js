/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 分割
var Tool_Split = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_Split.Enabled) {
            return;
        }
        Tool_Split.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-Split").addClass("Tool-Common-SizeA Tool-Split-OFF"));
        $("#ToolArea-Sub").append($("<div>").attr("id", "Tool-Split-Sub")
            .append($("<div>").attr("id", "Tool-Split-Sub-Series")
                .append($("<div>").attr("id", "Tool-Split-Sub-Series-11").addClass("Tool-Common-SizeA Tool-Split-Sub-Series-11-OFF").data("command", "Series_11"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Series-12").addClass("Tool-Common-SizeA Tool-Split-Sub-Series-12-OFF").data("command", "Series_12"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Series-21").addClass("Tool-Common-SizeA Tool-Split-Sub-Series-21-OFF").data("command", "Series_21"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Series-22").addClass("Tool-Common-SizeA Tool-Split-Sub-Series-22-OFF").data("command", "Series_22"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Series-23").addClass("Tool-Common-SizeA Tool-Split-Sub-Series-23-OFF").data("command", "Series_23"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Series-24").addClass("Tool-Common-SizeA Tool-Split-Sub-Series-24-OFF").data("command", "Series_24")))
            .append($("<div>").attr("id", "Tool-Split-Sub-Image")
                .append($("<div>").attr("id", "Tool-Split-Sub-Image-11").addClass("Tool-Common-SizeA Tool-Split-Sub-Image-11-OFF").data("command", "Image_11"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Image-12").addClass("Tool-Common-SizeA Tool-Split-Sub-Image-12-OFF").data("command", "Image_12"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Image-21").addClass("Tool-Common-SizeA Tool-Split-Sub-Image-21-OFF").data("command", "Image_21"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Image-22").addClass("Tool-Common-SizeA Tool-Split-Sub-Image-22-OFF").data("command", "Image_22"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Image-23").addClass("Tool-Common-SizeA Tool-Split-Sub-Image-23-OFF").data("command", "Image_23"))
                .append($("<div>").attr("id", "Tool-Split-Sub-Image-24").addClass("Tool-Common-SizeA Tool-Split-Sub-Image-24-OFF").data("command", "Image_24"))));

        // ボタンクリックイベント設定
        $("#Tool-Split").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態の場合
                if ($("#Tool-Split-Sub-Series, #Tool-Split-Sub-Image").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_Split.Command(false);
                    return;
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
                        Tool_Split.Click();
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                // 選択状態の場合
                if ($("#Tool-Split-Sub-Series, #Tool-Split-Sub-Image").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_Split.Command(false);
                    return;
                }

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
                        Tool_Split.Click();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // ボタンクリックイベント設定(サブメニュー)
        $("#Tool-Split-Sub-Series, #Tool-Split-Sub-Image").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態
                $this.removeClass($this.attr("id") + "-OFF").addClass($this.attr("id") + "-ON");

                // 要素位置情報用クラス生成
                var rectInfo = new Common_RectInfo($this);

                // タッチイベント設定
                var event = function (e) {
                    // タッチ移動時
                    if (e.type == "touchmove") {
                        // 要素位置情報更新後、範囲内の場合
                        if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                            // 選択状態
                            $this.removeClass($this.attr("id") + "-OFF").addClass($this.attr("id") + "-ON");
                        }
                        else {
                            // 選択状態解除
                            $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");
                        }
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && rectInfo.IsHit) {
                        // サブメニューコマンド処理
                        Tool_Split.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_Split.Command(false);
                    }

                    // 選択状態解除
                    $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function () {
                var $this = $(this);

                // 選択状態
                $this.removeClass($this.attr("id") + "-OFF").addClass($this.attr("id") + "-ON");

                // 要素位置情報用クラス生成
                var rectInfo = new Common_RectInfo($this);

                // マウスイベント設定
                var event = function (e) {
                    // マウス移動時
                    if (e.type == "mousemove") {
                        // 要素位置情報更新後、範囲内の場合
                        if (rectInfo.Update(e.pageX, e.pageY)) {
                            // 選択状態
                            $this.removeClass($this.attr("id") + "-OFF").addClass($this.attr("id") + "-ON");
                        }
                        else {
                            // 選択状態解除
                            $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");
                        }
                        return;
                    }

                    // 画面内をドラッグしていれば継続
                    if (e.type == "mouseout" && e.relatedTarget) {
                        return;
                    }

                    // クリック時
                    if (e.type == "mouseup" && rectInfo.IsHit) {
                        // サブメニューコマンド処理
                        Tool_Split.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_Split.Command(false);
                    }

                    // 選択状態解除
                    $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        }, ".Tool-Common-SizeA");
    },
    // クリック
    Click: function () {
        // 未選択状態の場合
        if ($("#Tool-Split").hasClass("Tool-Split-OFF")) {
            // 有効
            Tool_Split.Command(true);
        }
        else {
            // 無効
            Tool_Split.Command(false);
        }
    },
    // コマンド
    Command: function (command) {
        // コマンド確認
        if (command == true) {
            // サブメニューキャンセル処理
            Tool_Menu.SubMenuCancel();

            // Viewerのイベントを一時的に停止する
            viewer.IsEnable = false;

            // アイコン変更
            $("#Tool-Split").removeClass("Tool-Split-OFF").addClass("Tool-Split-ON");

            // サブメニュー表示位置補正表示
            var offset = $("#Tool-Split").offset();
            var center = ($("#Tool-Split-Sub").width() / 2) - ($("#Tool-Split").width() / 2);
            $("#Tool-Split-Sub").css({ left: offset.left - center, top: offset.top + 48 }).show();
        }
        else {
            // Viewerのイベントを元に戻す
            viewer.IsEnable = true;

            // アイコン変更
            $("#Tool-Split").removeClass("Tool-Split-ON").addClass("Tool-Split-OFF");
            $("#Tool-Split-Sub").hide();
        }
    },
    // サブメニューコマンド
    SubCommand: function (command) {
        // コマンド確認
        if (command == "Series_11") {
            // 変更なしの場合
            if (viewer.Column == 1 && viewer.Row == 1) {
                return;
            }

            // ViewerCtrl呼び出し
            viewer.splitAutoIndex(1, 1);

            // 遅延呼び出し
            viewer.invoke(function () {
                // 表示検査パネル更新
                ViewerStudyList_Panel_Update();
            });
            return;
        }
        else if (command == "Series_12") {
            // 変更なしの場合
            if (viewer.Column == 2 && viewer.Row == 1) {
                return;
            }

            // ViewerCtrl呼び出し
            viewer.splitAutoIndex(2, 1);

            // 遅延呼び出し
            viewer.invoke(function () {
                // 表示検査パネル更新
                ViewerStudyList_Panel_Update();
            });
            return;
        }
        else if (command == "Series_21") {
            // 変更なしの場合
            if (viewer.Column == 1 && viewer.Row == 2) {
                return;
            }

            // ViewerCtrl呼び出し
            viewer.splitAutoIndex(1, 2);

            // 遅延呼び出し
            viewer.invoke(function () {
                // 表示検査パネル更新
                ViewerStudyList_Panel_Update();
            });
            return;
        }
        else if (command == "Series_22") {
            // 変更なしの場合
            if (viewer.Column == 2 && viewer.Row == 2) {
                return;
            }

            // ViewerCtrl呼び出し
            viewer.splitAutoIndex(2, 2);

            // 遅延呼び出し
            viewer.invoke(function () {
                // 表示検査パネル更新
                ViewerStudyList_Panel_Update();
            });
            return;
        }
        else if (command == "Series_23") {
            // 変更なしの場合
            if (viewer.Column == 3 && viewer.Row == 2) {
                return;
            }

            // ViewerCtrl呼び出し
            viewer.splitAutoIndex(3, 2);

            // 遅延呼び出し
            viewer.invoke(function () {
                // 表示検査パネル更新
                ViewerStudyList_Panel_Update();
            });
            return;
        }
        else if (command == "Series_24") {
            // 変更なしの場合
            if (viewer.Column == 4 && viewer.Row == 2) {
                return;
            }

            // ViewerCtrl呼び出し
            viewer.splitAutoIndex(4, 2);

            // 遅延呼び出し
            viewer.invoke(function () {
                // 表示検査パネル更新
                ViewerStudyList_Panel_Update();
            });
            return;
        }

        // 選択シリーズ取得
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null || selectSeries.seriesData == null || selectSeries.SopPanels.length == 0) {
            return;
        }

        // コマンド確認
        if (command == "Image_11") {
            // 変更なしの場合
            if (selectSeries.seriesData.Column == 1 && selectSeries.seriesData.Row == 1) {
                return;
            }

            // ViewerCtrl呼び出し
            selectSeries.splitAutoIndex(1, 1);
        }
        else if (command == "Image_12") {
            // 変更なしの場合
            if (selectSeries.seriesData.Column == 2 && selectSeries.seriesData.Row == 1) {
                return;
            }

            // ViewerCtrl呼び出し
            selectSeries.splitAutoIndex(2, 1);
        }
        else if (command == "Image_21") {
            // 変更なしの場合
            if (selectSeries.seriesData.Column == 1 && selectSeries.seriesData.Row == 2) {
                return;
            }

            // ViewerCtrl呼び出し
            selectSeries.splitAutoIndex(1, 2);
        }
        else if (command == "Image_22") {
            // 変更なしの場合
            if (selectSeries.seriesData.Column == 2 && selectSeries.seriesData.Row == 2) {
                return;
            }

            // ViewerCtrl呼び出し
            selectSeries.splitAutoIndex(2, 2);
        }
        else if (command == "Image_23") {
            // 変更なしの場合
            if (selectSeries.seriesData.Column == 3 && selectSeries.seriesData.Row == 2) {
                return;
            }

            // ViewerCtrl呼び出し
            selectSeries.splitAutoIndex(3, 2);
        }
        else if (command == "Image_24") {
            // 変更なしの場合
            if (selectSeries.seriesData.Column == 4 && selectSeries.seriesData.Row == 2) {
                return;
            }

            // ViewerCtrl呼び出し
            selectSeries.splitAutoIndex(4, 2);
        }
    }
}
