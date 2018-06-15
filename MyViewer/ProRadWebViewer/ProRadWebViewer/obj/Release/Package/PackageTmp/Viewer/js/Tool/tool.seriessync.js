/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// シリーズ一括同期
var Tool_SeriesSync = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_SeriesSync.Enabled) {
            return;
        }
        Tool_SeriesSync.Enabled = true;

        // 要素を作成
        $("#ToolArea-View")
            .append($("<div>").attr("id", "Tool-SeriesSync").addClass("Tool-Common-SizeA Tool-SeriesSync-Position-OFF"))
            .append($("<div>").attr("id", "Tool-SeriesSync-Side").addClass("Tool-Common-SizeB Tool-SeriesSync-Side-OFF").append($('<span>').append('▼')));
        $("#ToolArea-Sub")
            .append($("<div>").attr("id", "Tool-SeriesSync-Side-Sub")
                .append($("<div>").attr("id", "Tool-SeriesSync-Side-Sub-Index").addClass("Tool-Common-SizeA Tool-SeriesSync-Side-Sub-Index-OFF").data("command", "Index"))
                .append($("<div>").attr("id", "Tool-SeriesSync-Side-Sub-Position").addClass("Tool-Common-SizeA Tool-SeriesSync-Side-Sub-Position-OFF").data("command", "Position"))
                .append($("<div>").attr("id", "Tool-SeriesSync-Side-Sub-Thickness").addClass("Tool-Common-SizeA Tool-SeriesSync-Side-Sub-Thickness-OFF").data("command", "Thickness")));

        // ボタンクリックイベント設定
        $("#Tool-SeriesSync").on({
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
                        Tool_SeriesSync.Click();
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
                        Tool_SeriesSync.Click();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定
        $("#Tool-SeriesSync-Side").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態の場合
                if ($("#Tool-SeriesSync-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_SeriesSync.SideCommand(false);
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
                        Tool_SeriesSync.SideClick();
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                // 選択状態の場合
                if ($("#Tool-SeriesSync-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_SeriesSync.SideCommand(false);
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
                        Tool_SeriesSync.SideClick();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定(サブメニュー)
        $("#Tool-SeriesSync-Side-Sub").on({
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
                        Tool_SeriesSync.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_SeriesSync.SideCommand(false);
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
                        Tool_SeriesSync.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_SeriesSync.SideCommand(false);
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
        if ($("#Tool-SeriesSync").hasClass("Tool-SeriesSync-Index-OFF")) {
            Tool_SeriesSync.Command("Index");
        }
        else if ($("#Tool-SeriesSync").hasClass("Tool-SeriesSync-Position-OFF")) {
            Tool_SeriesSync.Command("Position");
        }
        else if ($("#Tool-SeriesSync").hasClass("Tool-SeriesSync-Thickness-OFF")) {
            Tool_SeriesSync.Command("Thickness");
        }
        else {
            Tool_SeriesSync.Command(false);
        }
    },
    // コマンド
    Command: function (command) {
        // コマンド確認
        var flag = false;
        var data = viewer.getData();
        if (command == "Index") {
            if (data != null && data.SeriesDatas != null) {
                // アイコン変更
                $("#Tool-SeriesSync").removeClass("Tool-SeriesSync-Index-OFF").addClass("Tool-SeriesSync-Index-ON");

                // 同期種別設定
                viewer.setSyncControl(ViewerSync_Index);
                flag = true;
            }
        }
        else if (command == "Position") {
            if (data != null && data.SeriesDatas != null) {
                // アイコン変更
                $("#Tool-SeriesSync").removeClass("Tool-SeriesSync-Position-OFF").addClass("Tool-SeriesSync-Position-ON");

                // 同期種別設定
                viewer.setSyncControl(ViewerSync_Location);
                flag = true;
            }
        }
        else if (command == "Thickness") {
            if (data != null && data.SeriesDatas != null) {
                // アイコン変更
                $("#Tool-SeriesSync").removeClass("Tool-SeriesSync-Thickness-OFF").addClass("Tool-SeriesSync-Thickness-ON");

                // 同期種別設定
                viewer.setSyncControl(ViewerSync_Thickness);
                flag = true;
            }
        }

        // 解除の場合
        if (!flag) {
            if ($("#Tool-SeriesSync").hasClass("Tool-SeriesSync-Index-ON")) {
                // アイコン変更
                $("#Tool-SeriesSync").removeClass("Tool-SeriesSync-Index-ON").addClass("Tool-SeriesSync-Index-OFF");
            }
            else if ($("#Tool-SeriesSync").hasClass("Tool-SeriesSync-Position-ON")) {
                // アイコン変更
                $("#Tool-SeriesSync").removeClass("Tool-SeriesSync-Position-ON").addClass("Tool-SeriesSync-Position-OFF");
            }
            else if ($("#Tool-SeriesSync").hasClass("Tool-SeriesSync-Thickness-ON")) {
                // アイコン変更
                $("#Tool-SeriesSync").removeClass("Tool-SeriesSync-Thickness-ON").addClass("Tool-SeriesSync-Thickness-OFF");
            }
        }

        // 全同期制御
        if (data != null && data.SeriesDatas != null) {
            for (var i = 0; i < data.SeriesDatas.length; i++) {
                var series = data.SeriesDatas[i];
                if (series) {
                    series.setSync(flag);
                }
            }
            viewer.setSync(flag);
        }
    },
    // サイドメニュークリック
    SideClick: function () {
        // 未選択状態確認
        if ($("#Tool-SeriesSync-Side").hasClass("Tool-SeriesSync-Side-OFF")) {
            Tool_SeriesSync.SideCommand(true);
        }
        else {
            Tool_SeriesSync.SideCommand(false);
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
            $("#Tool-SeriesSync-Side").removeClass("Tool-SeriesSync-Side-OFF").addClass("Tool-SeriesSync-Side-ON");

            // サブメニュー表示位置補正表示
            var offset = $("#Tool-SeriesSync-Side").offset();
            $("#Tool-SeriesSync-Side-Sub").css({ left: offset.left - 96, top: offset.top + 48 }).show();
        }
        else {
            // Viewerのイベントを元に戻す
            viewer.IsEnable = true;

            // アイコン変更
            $("#Tool-SeriesSync-Side").removeClass("Tool-SeriesSync-Side-ON").addClass("Tool-SeriesSync-Side-OFF");
            $("#Tool-SeriesSync-Side-Sub").hide();
        }
    },
    // サブメニューコマンド
    SubCommand: function (command) {
        // 全同期するか判定
        var $seriessync = $("#Tool-SeriesSync");
        var flag = false;
        if ($seriessync.hasClass("Tool-SeriesSync-Index-OFF") ||
            $seriessync.hasClass("Tool-SeriesSync-Position-OFF") ||
            $seriessync.hasClass("Tool-SeriesSync-Thickness-OFF")) {
            flag = true;
        }

        // アイコン初期化
        $seriessync
            .removeClass("Tool-SeriesSync-Index-ON").removeClass("Tool-SeriesSync-Index-OFF")
            .removeClass("Tool-SeriesSync-Position-ON").removeClass("Tool-SeriesSync-Position-OFF")
            .removeClass("Tool-SeriesSync-Thickness-ON").removeClass("Tool-SeriesSync-Thickness-OFF");

        // インデックスの場合
        if (command == "Index") {
            // アイコン変更
            $seriessync.addClass("Tool-SeriesSync-Index-ON");

            // 同期種別変更
            viewer.setSyncControl(ViewerSync_Index);
        }
        // スライス位置の場合
        else if (command == "Position") {
            // アイコン変更
            $seriessync.addClass("Tool-SeriesSync-Position-ON");

            // 同期種別変更
            viewer.setSyncControl(ViewerSync_Location);
        }
        // スライス厚の場合
        else if (command == "Thickness") {
            // アイコン変更
            $seriessync.addClass("Tool-SeriesSync-Thickness-ON");

            // 同期種別変更
            viewer.setSyncControl(ViewerSync_Thickness);
        }

        // 全同期判定
        if (flag) {
            var data = viewer.getData();
            if (data != null && data.SeriesDatas != null) {
                // 全同期
                for (var i = 0; i < data.SeriesDatas.length; i++) {
                    var series = data.SeriesDatas[i];
                    if (series) {
                        series.setSync(true);
                    }
                }
                viewer.setSync(true);
            }
        }
    }
}
