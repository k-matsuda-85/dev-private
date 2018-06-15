/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// ウィンドウレベル
var Tool_WindowLevel = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_WindowLevel.Enabled) {
            return;
        }
        Tool_WindowLevel.Enabled = true;

        // 要素を作成
        $("#ToolArea-View")
            .append($("<div>").attr("id", "Tool-WindowLevel").addClass("Tool-Common-SizeA Tool-WindowLevel-OFF"))
            .append($("<div>").attr("id", "Tool-WindowLevel-Side").addClass("Tool-Common-SizeB Tool-WindowLevel-Side-OFF").append($('<span>').append('▼')));
        $("#ToolArea-Sub")
            .append($("<div>").attr("id", "Tool-WindowLevel-Side-Sub"));

        // ボタンクリックイベント設定
        $("#Tool-WindowLevel").on({
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
                        Tool_WindowLevel.Click();
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
                        Tool_WindowLevel.Click();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定
        $("#Tool-WindowLevel-Side").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態の場合
                if ($("#Tool-WindowLevel-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_WindowLevel.SideCommand(false);
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
                        Tool_WindowLevel.SideClick();
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                // 選択状態の場合
                if ($("#Tool-WindowLevel-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_WindowLevel.SideCommand(false);
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
                        Tool_WindowLevel.SideClick();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定(サブメニュー)
        $("#Tool-WindowLevel-Side-Sub").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態
                $this.addClass("Tool-WindowLevel-Side-Sub-Item-ON");

                // 要素位置情報用クラス生成
                var rectInfo = new Common_RectInfo($this);

                // タッチイベント設定
                var event = function (e) {
                    // タッチ移動時
                    if (e.type == "touchmove") {
                        // 要素位置情報更新後、範囲内の場合
                        if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                            // 選択状態
                            $this.addClass("Tool-WindowLevel-Side-Sub-Item-ON");
                        }
                        else {
                            // 選択状態解除
                            $this.removeClass("Tool-WindowLevel-Side-Sub-Item-ON");
                        }
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && rectInfo.IsHit) {
                        // サブメニューコマンド
                        Tool_WindowLevel.SubCommand($this.data("WC"), $this.data("WW"));

                        // 非表示(キャンセル処理)
                        Tool_WindowLevel.SideCommand(false);
                    }

                    // 選択状態解除
                    $this.removeClass("Tool-WindowLevel-Side-Sub-Item-ON");

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function () {
                var $this = $(this);

                // 選択状態
                $this.addClass("Tool-WindowLevel-Side-Sub-Item-ON");

                // 要素位置情報用クラス生成
                var rectInfo = new Common_RectInfo($this);

                // マウスイベント設定
                var event = function (e) {
                    // マウス移動時
                    if (e.type == "mousemove") {
                        // 要素位置情報更新後、範囲内の場合
                        if (rectInfo.Update(e.pageX, e.pageY)) {
                            // 選択状態
                            $this.addClass("Tool-WindowLevel-Side-Sub-Item-ON");
                        }
                        else {
                            // 選択状態解除
                            $this.removeClass("Tool-WindowLevel-Side-Sub-Item-ON");
                        }
                        return;
                    }

                    // 画面内をドラッグしていれば継続
                    if (e.type == "mouseout" && e.relatedTarget) {
                        return;
                    }

                    // クリック時
                    if (e.type == "mouseup" && rectInfo.IsHit) {
                        // サブメニューコマンド
                        Tool_WindowLevel.SubCommand($this.data("WC"), $this.data("WW"));

                        // 非表示(キャンセル処理)
                        Tool_WindowLevel.SideCommand(false);
                    }

                    // 選択状態解除
                    $this.removeClass("Tool-WindowLevel-Side-Sub-Item-ON");

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        }, ".Tool-WindowLevel-Side-Sub-Item");
    },
    // クリック
    Click: function () {
        // 未選択状態の場合
        if ($("#Tool-WindowLevel").hasClass("Tool-WindowLevel-OFF")) {
            // ツール名更新
            if (Tool_Menu.UpdateName("WindowLevel")) {
                // メニューキャンセル処理
                Tool_Menu.Cancel();

                // 有効
                Tool_WindowLevel.Command(true);
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
            viewer.setEventControl(ViewerControl_WindowLevel);

            // アイコン変更
            $("#Tool-WindowLevel").removeClass("Tool-WindowLevel-OFF").addClass("Tool-WindowLevel-ON");
        }
        else {
            // ViewerCtrl呼び出し
            viewer.setEventControl(null);

            // アイコン変更
            $("#Tool-WindowLevel").removeClass("Tool-WindowLevel-ON").addClass("Tool-WindowLevel-OFF");
        }
    },
    // サイドメニュークリック
    SideClick: function () {
        // 未選択状態の場合
        if ($("#Tool-WindowLevel-Side").hasClass("Tool-WindowLevel-Side-OFF")) {
            Tool_WindowLevel.SideCommand(true);
        }
        else {
            Tool_WindowLevel.SideCommand(false);
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
            $("#Tool-WindowLevel-Side").removeClass("Tool-WindowLevel-Side-OFF").addClass("Tool-WindowLevel-Side-ON");

            // 現要素を削除
            var $obj = $("#Tool-WindowLevel-Side-Sub");
            $obj.empty();

            // 選択情報取得
            var series = viewer.getSelectSeries();
            if (series == null || series.seriesData == null) {
                return;
            }
            var sop = series.getSelectSop();
            if (sop == null || sop.sopData == null || sop.sopData.InitParam.IsImageInfo) {
                return;
            }

            // 初期値要素作成
            $obj.append($("<div>").text("初期値").data("WC", "").data("WW", "").addClass("Tool-WindowLevel-Side-Sub-Item"))
                .append($("<div>").addClass("Tool-WindowLevel-Side-Sub-Separator"));

            // モダリティ毎のプリセットを取得
            var wl = Viewer_GetModalityConfigVal(series.seriesData.ExData.Modality, "WL").split(",");
            if (wl.length > 0 && wl.length % 3 == 0) {
                //プリセット設定
                for (var i = 0; i < wl.length; i += 3) {
                    if (isNaN(parseFloat(wl[i + 1])) || isNaN(parseFloat(wl[i + 2]))) {
                        continue;
                    }

                    // 要素を作成
                    $obj.append($("<div>")
                        .text(wl[i])
                        .data("WC", wl[i + 1])
                        .data("WW", wl[i + 2])
                        .addClass("Tool-WindowLevel-Side-Sub-Item"));
                }
            }
            $obj.append($("<div>").addClass("Tool-WindowLevel-Side-Sub-Separator"));

            // 白黒反転要素作成
            var wc = new String(sop.sopData.getInfo("wc"));
            var ww = sop.sopData.getInfo("ww");
            if (Math.abs(ww) == ww) {
                ww = "-" + new String(ww);
            }
            else {
                ww = new String(Math.abs(ww));
            }
            $obj.append($("<div>").text("白黒反転").data("WC", wc).data("WW", ww).addClass("Tool-WindowLevel-Side-Sub-Item"));

            // サブメニュー表示位置補正表示
            var offset = $("#Tool-WindowLevel-Side").offset();
            $("#Tool-WindowLevel-Side-Sub").css({ left: offset.left - 48, top: offset.top + 48 }).show();

            // セパレータを設定
            var $sep = $obj.children(".Tool-WindowLevel-Side-Sub-Separator");
            $sep.width($obj.width() - $sep.outerWidth({ magin: true })).show();
        }
        else {
            // Viewerのイベントを元に戻す
            viewer.IsEnable = true;

            // アイコン変更
            $("#Tool-WindowLevel-Side").removeClass("Tool-WindowLevel-Side-ON").addClass("Tool-WindowLevel-Side-OFF");
            $("#Tool-WindowLevel-Side-Sub").hide();
        }
    },
    // サブメニューコマンド
    SubCommand: function (wc, ww) {
        // 選択情報取得
        var series = viewer.getSelectSeries();
        if (series == null) {
            return;
        }
        var sop = series.getSelectSop();
        if (sop == null || sop.sopData == null || sop.sopData.InitParam.IsImageInfo) {
            return;
        }

        // 初期値に設定
        if (wc == "" && ww == "") {
            viewer.viewerData.setWindowLevel(series.seriesData, 0, 0);
        }
        // 絶対値に変換し設定
        else {
            var iwc = sop.sopData.DefaultWindowCenter;
            var iww = sop.sopData.DefaultWindowWidth;
            viewer.viewerData.setWindowLevel(series.seriesData, parseFloat(wc) - iwc, parseFloat(ww) - iww);
        }
    },
    // プリセット
    Preset: function (command) {
        // 初期値の場合
        if (command <= 0) {
            // サブメニューコマンド
            Tool_WindowLevel.SubCommand("", "");
            return;
        }

        // 選択情報取得
        var series = viewer.getSelectSeries();
        if (series == null || series.seriesData == null) {
            return;
        }
        var sop = series.getSelectSop();
        if (sop == null || sop.sopData == null || sop.sopData.InitParam.IsImageInfo) {
            return;
        }

        // モダリティ毎のプリセットを取得
        var wl = Viewer_GetModalityConfigVal(series.seriesData.ExData.Modality, "WL").split(",");
        if (wl.length <= 0 || wl.length % 3 != 0) {
            return;
        }
        var index = (command - 1) * 3;
        if (isNaN(parseFloat(wl[index + 1])) || isNaN(parseFloat(wl[index + 2]))) {
            return;
        }

        // サブメニューコマンド
        Tool_WindowLevel.SubCommand(wl[index + 1], wl[index + 2]);
    }
}
