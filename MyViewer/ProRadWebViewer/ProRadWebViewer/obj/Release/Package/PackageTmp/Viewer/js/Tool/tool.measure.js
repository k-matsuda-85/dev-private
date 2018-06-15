/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 計測(距離、CT値、角度、CTR)
var Tool_Measure = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_Measure.Enabled) {
            return;
        }
        Tool_Measure.Enabled = true;

        // 要素を作成
        $("#ToolArea-View")
            .append($("<div>").attr("id", "Tool-Measure").addClass("Tool-Common-SizeA Tool-Measure-Distance-OFF"))
            .append($("<div>").attr("id", "Tool-Measure-Side").addClass("Tool-Common-SizeB Tool-Measure-Side-OFF").append($('<span>').append('▼')));
        $("#ToolArea-Sub")
            .append($("<div>").attr("id", "Tool-Measure-Side-Sub")
                .append($("<div>").attr("id", "Tool-Measure-Distance-Side-Sub").addClass("Tool-Common-SizeA Tool-Measure-Distance-Side-Sub-OFF").data("command", "Distance"))
                .append($("<div>").attr("id", "Tool-Measure-CTAnalyze-Side-Sub").addClass("Tool-Common-SizeA Tool-Measure-CTAnalyze-Side-Sub-OFF").data("command", "CTAnalyze"))
                .append($("<div>").attr("id", "Tool-Measure-Angle3-Side-Sub").addClass("Tool-Common-SizeA Tool-Measure-Angle3-Side-Sub-OFF").data("command", "Angle3"))
                .append($("<div>").attr("id", "Tool-Measure-Angle4-Side-Sub").addClass("Tool-Common-SizeA Tool-Measure-Angle4-Side-Sub-OFF").data("command", "Angle4"))
                .append($("<div>").attr("id", "Tool-Measure-CTRMeasure-Side-Sub").addClass("Tool-Common-SizeA Tool-Measure-CTRMeasure-Side-Sub-OFF").data("command", "CTRMeasure")));

        // ボタンクリックイベント設定
        $("#Tool-Measure").on({
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
                        Tool_Measure.Click();
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
                        Tool_Measure.Click();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定
        $("#Tool-Measure-Side").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態の場合
                if ($("#Tool-Measure-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_Measure.SideCommand(false);
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
                        // サイドメニュークリック処理
                        Tool_Measure.SideClick();
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                // 選択状態の場合
                if ($("#Tool-Measure-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_Measure.SideCommand(false);
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
                        // サイドメニュークリック処理
                        Tool_Measure.SideClick();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定(サブメニュー)
        $("#Tool-Measure-Side-Sub").on({
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
                        Tool_Measure.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_Measure.SideCommand(false);
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
                        Tool_Measure.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_Measure.SideCommand(false);
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
        // 未選択状態確認
        if ($("#Tool-Measure").hasClass("Tool-Measure-Distance-OFF")) {
            // ツール名更新
            if (Tool_Menu.UpdateName("Measure")) {
                // メニューキャンセル処理
                Tool_Menu.Cancel();

                // コマンド呼び出し
                Tool_Measure.Command("Distance");
            }
        }
        else if ($("#Tool-Measure").hasClass("Tool-Measure-CTAnalyze-OFF")) {
            // ツール名更新
            if (Tool_Menu.UpdateName("Measure")) {
                // メニューキャンセル処理
                Tool_Menu.Cancel();

                // コマンド呼び出し
                Tool_Measure.Command("CTAnalyze");
            }
        }
        else if ($("#Tool-Measure").hasClass("Tool-Measure-Angle3-OFF")) {
            // ツール名更新
            if (Tool_Menu.UpdateName("Measure")) {
                // メニューキャンセル処理
                Tool_Menu.Cancel();

                // コマンド呼び出し
                Tool_Measure.Command("Angle3");
            }
        }
        else if ($("#Tool-Measure").hasClass("Tool-Measure-Angle4-OFF")) {
            // ツール名更新
            if (Tool_Menu.UpdateName("Measure")) {
                // メニューキャンセル処理
                Tool_Menu.Cancel();

                // コマンド呼び出し
                Tool_Measure.Command("Angle4");
            }
        }
        else if ($("#Tool-Measure").hasClass("Tool-Measure-CTRMeasure-OFF")) {
            // ツール名更新
            if (Tool_Menu.UpdateName("Measure")) {
                // メニューキャンセル処理
                Tool_Menu.Cancel();

                // コマンド呼び出し
                Tool_Measure.Command("CTRMeasure");
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
        var data;
        if (command == true) {
            // 未選択状態確認
            if ($("#Tool-Measure").hasClass("Tool-Measure-Distance-OFF")) {
                Tool_Measure.Command("Distance");
            }
            else if ($("#Tool-Measure").hasClass("Tool-Measure-CTAnalyze-OFF")) {
                Tool_Measure.Command("CTAnalyze");
            }
            else if ($("#Tool-Measure").hasClass("Tool-Measure-Angle3-OFF")) {
                Tool_Measure.Command("Angle3");
            }
            else if ($("#Tool-Measure").hasClass("Tool-Measure-Angle4-OFF")) {
                Tool_Measure.Command("Angle4");
            }
            else if ($("#Tool-Measure").hasClass("Tool-Measure-CTRMeasure-OFF")) {
                Tool_Measure.Command("CTRMeasure");
            }
        }
        else if (command == "Distance") {
            data = viewer.getData();
            if (data != null && data.SeriesDatas != null) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(ViewerControl_Draw, ViewerDraw_Measure);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-Distance-OFF").addClass("Tool-Measure-Distance-ON");
            }
        }
        else if (command == "CTAnalyze") {
            data = viewer.getData();
            if (data != null && data.SeriesDatas != null) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(ViewerControl_Draw, ViewerDraw_CTValue);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-CTAnalyze-OFF").addClass("Tool-Measure-CTAnalyze-ON");
            }
        }
        else if (command == "Angle3") {
            data = viewer.getData();
            if (data != null && data.SeriesDatas != null) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(ViewerControl_Draw, ViewerDraw_Angle3);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-Angle3-OFF").addClass("Tool-Measure-Angle3-ON");
            }
        }
        else if (command == "Angle4") {
            data = viewer.getData();
            if (data != null && data.SeriesDatas != null) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(ViewerControl_Draw, ViewerDraw_Angle4);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-Angle4-OFF").addClass("Tool-Measure-Angle4-ON");
            }
        }
        else if (command == "CTRMeasure") {
            data = viewer.getData();
            if (data != null && data.SeriesDatas != null) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(ViewerControl_Draw, ViewerDraw_CTR);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-CTRMeasure-OFF").addClass("Tool-Measure-CTRMeasure-ON");
            }
        }
        else {
            // 選択状態確認
            if ($("#Tool-Measure").hasClass("Tool-Measure-Distance-ON")) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(null);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-Distance-ON").addClass("Tool-Measure-Distance-OFF");
            }
            else if ($("#Tool-Measure").hasClass("Tool-Measure-CTAnalyze-ON")) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(null);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-CTAnalyze-ON").addClass("Tool-Measure-CTAnalyze-OFF");
            }
            else if ($("#Tool-Measure").hasClass("Tool-Measure-Angle3-ON")) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(null);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-Angle3-ON").addClass("Tool-Measure-Angle3-OFF");
            }
            else if ($("#Tool-Measure").hasClass("Tool-Measure-Angle4-ON")) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(null);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-Angle4-ON").addClass("Tool-Measure-Angle4-OFF");
            }
            else if ($("#Tool-Measure").hasClass("Tool-Measure-CTRMeasure-ON")) {
                // ViewerCtrl呼び出し
                viewer.setEventControl(null);

                // アイコン変更
                $("#Tool-Measure").removeClass("Tool-Measure-CTRMeasure-ON").addClass("Tool-Measure-CTRMeasure-OFF");
            }
        }
    },
    // サイドメニュークリック
    SideClick: function () {
        // 未選択状態の場合
        if ($("#Tool-Measure-Side").hasClass("Tool-Measure-Side-OFF")) {
            // 有効
            Tool_Measure.SideCommand(true);
        }
        else {
            // 無効
            Tool_Measure.SideCommand(false);
        }
    },
    // サイドメニューコマンド
    SideCommand: function (command) {
        // コマンド確認
        if (command == true) {
            // サブメニューキャンセル処理
            Tool_Menu.SubMenuCancel();

            // Viewerのイベントを一時的に停止する
            viewer.IsEnable = false;

            // アイコン変更
            $("#Tool-Measure-Side").removeClass("Tool-Measure-Side-OFF").addClass("Tool-Measure-Side-ON");

            // サブメニュー表示位置補正表示
            var offset = $("#Tool-Measure-Side").offset();
            $("#Tool-Measure-Side-Sub").css({ left: offset.left - 144, top: offset.top + 48 }).show();
        }
        else {
            // Viewerのイベントを元に戻す
            viewer.IsEnable = true;

            // アイコン変更
            $("#Tool-Measure-Side").removeClass("Tool-Measure-Side-ON").addClass("Tool-Measure-Side-OFF");
            $("#Tool-Measure-Side-Sub").hide();
        }
    },
    // サブメニューコマンド
    SubCommand: function (command) {
        // ツール名更新
        if (Tool_Menu.UpdateName("Measure")) {
            // メニューキャンセル処理
            Tool_Menu.Cancel();

            // アイコン初期化
            $("#Tool-Measure")
            .removeClass("Tool-Measure-Distance-ON").removeClass("Tool-Measure-Distance-OFF")
            .removeClass("Tool-Measure-CTAnalyze-ON").removeClass("Tool-Measure-CTAnalyze-OFF")
            .removeClass("Tool-Measure-Angle3-ON").removeClass("Tool-Measure-Angle3-OFF")
            .removeClass("Tool-Measure-Angle4-ON").removeClass("Tool-Measure-Angle4-OFF")
            .removeClass("Tool-Measure-CTRMeasure-ON").removeClass("Tool-Measure-CTRMeasure-OFF");

            // 距離計測の場合
            if (command == "Distance") {
                // コマンド呼び出し
                Tool_Measure.Command("Distance");
            }
            // CT値測定の場合
            else if (command == "CTAnalyze") {
                // コマンド呼び出し
                Tool_Measure.Command("CTAnalyze");
            }
            // 角度計測(3点)の場合
            else if (command == "Angle3") {
                // コマンド呼び出し
                Tool_Measure.Command("Angle3");
            }
            // 角度計測(4点)の場合
            else if (command == "Angle4") {
                // コマンド呼び出し
                Tool_Measure.Command("Angle4");
            }
            // CTR計測の場合
            else if (command == "CTRMeasure") {
                // コマンド呼び出し
                Tool_Measure.Command("CTRMeasure");
            }
        }
    }
}
