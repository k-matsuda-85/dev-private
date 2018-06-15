/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 画像スキップ
var Tool_SkipImage = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_SkipImage.Enabled) {
            return;
        }
        Tool_SkipImage.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-SkipImage").addClass("Tool-Common-SizeA Tool-SkipImage-OFF"));
        $("#ToolArea-Sub").append($("<div>").attr("id", "Tool-SkipImage-Sub")
            .append($("<div>").attr("id", "Tool-SkipImage-Sub-Top").addClass("Tool-Common-SizeA Tool-SkipImage-Sub-Top-OFF").data("command", "begin"))
            .append($("<div>").attr("id", "Tool-SkipImage-Sub-Middle").addClass("Tool-Common-SizeA Tool-SkipImage-Sub-Middle-OFF").data("command", "center"))
            .append($("<div>").attr("id", "Tool-SkipImage-Sub-Bottom").addClass("Tool-Common-SizeA Tool-SkipImage-Sub-Bottom-OFF").data("command", "end")));

        // ボタンクリックイベント設定
        $("#Tool-SkipImage").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態の場合
                if ($("#Tool-SkipImage-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_SkipImage.Command(false);
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
                        Tool_SkipImage.Click();
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                // 選択状態の場合
                if ($("#Tool-SkipImage-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_SkipImage.Command(false);
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
                        Tool_SkipImage.Click();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // ボタンクリックイベント設定(サブメニュー)
        $("#Tool-SkipImage-Sub").on({
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
                        Tool_SkipImage.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_SkipImage.Command(false);
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
                        Tool_SkipImage.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_SkipImage.Command(false);
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
        if ($("#Tool-SkipImage").hasClass("Tool-SkipImage-OFF")) {
            // 有効
            Tool_SkipImage.Command(true);
        }
        else {
            // 無効
            Tool_SkipImage.Command(false);
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
            $("#Tool-SkipImage").removeClass("Tool-SkipImage-OFF").addClass("Tool-SkipImage-ON");

            // サブメニュー表示位置補正表示
            var offset = $("#Tool-SkipImage").offset();
            $("#Tool-SkipImage-Sub").css({ left: offset.left - 48, top: offset.top + 48 }).show();
        }
        else {
            // Viewerのイベントを元に戻す
            viewer.IsEnable = true;

            // アイコン変更
            $("#Tool-SkipImage").removeClass("Tool-SkipImage-ON").addClass("Tool-SkipImage-OFF");
            $("#Tool-SkipImage-Sub").hide();
        }
    },
    // サブメニューコマンド
    SubCommand: function (command) {
        // 選択シリーズ取得
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null || selectSeries.SopPanels.length == 0) {
            return;
        }

        // コマンド確認
        if (command == "imageprev") {
            // 画像送り(前へ)
            viewer.setSopIndex(-1, "current");
        }
        else if (command == "imagenext") {
            // 画像送り(次へ)
            viewer.setSopIndex(1, "current");
        }
        else if (command == "pageingprev") {
            // ページング(前へ)
            viewer.setSopIndex(-selectSeries.SopPanels.length, "current");
        }
        else if (command == "pageingnext") {
            // ページング(次へ)
            viewer.setSopIndex(selectSeries.SopPanels.length, "current");
        }
        else if (command == "begin" || command == "center" || command == "end") {
            // 画像スキップ
            viewer.setSopIndex(0, command);
        }
    }
}

// 画像送り(次へ)
var Tool_SkipImageNext = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_SkipImageNext.Enabled) {
            return;
        }
        Tool_SkipImageNext.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-SkipImageNext").addClass("Tool-Common-SizeA Tool-SkipImageNext-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-SkipImageNext").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態
                $this.removeClass($this.attr("id") + "-OFF").addClass($this.attr("id") + "-ON");

                // 開始処理
                Tool_SkipImageNext.Command(true);

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

                            // 終了処理
                            Tool_SkipImageNext.Command(false);

                            // タッチイベント解除
                            $this.off("touchmove touchend touchcancel", event);
                        }
                        return;
                    }

                    // 選択状態解除
                    $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

                    // 終了処理
                    Tool_SkipImageNext.Command(false);

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

                // 開始処理
                Tool_SkipImageNext.Command(true);

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

                            // 終了処理
                            Tool_SkipImageNext.Command(false);

                            // マウスイベント解除
                            $(document).off("mousemove mouseup mouseout", event);
                        }
                        return;
                    }

                    // 画面内をドラッグしていれば継続
                    if (e.type == "mouseout" && e.relatedTarget) {
                        return;
                    }

                    // 選択状態解除
                    $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

                    // 終了処理
                    Tool_SkipImageNext.Command(false);

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });
    },
    // コマンド
    Command: function (command) {
        // 選択シリーズ取得
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null) {
            return;
        }

        // コマンド確認
        if (command == true) {
            // タイマ設定
            Tool_SkipImageNext.RepeatTimer = setTimeout(function () {
                // ViewerCtrl呼び出し
                selectSeries.autosetSopIndex(1);
                Tool_SkipImageNext.IsRepeat = true;
            }, 400);
        }
        else {
            // タイマクリア
            if (Tool_SkipImageNext.RepeatTimer) {
                clearTimeout(Tool_SkipImageNext.RepeatTimer);
            }

            // ViewerCtrl呼び出し
            if (Tool_SkipImageNext.IsRepeat) {
                selectSeries.autosetSopIndex(0);
            }
            else {
                // キャンセルしなかった場合
                if (!Tool_Menu.IsCancel) {
                    viewer.setSopIndex(1, "current");
                }
            }
            Tool_SkipImageNext.IsRepeat = false;
        }
    }
}

// 画像スキップ(前へ)
var Tool_SkipImagePrev = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_SkipImagePrev.Enabled) {
            return;
        }
        Tool_SkipImagePrev.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-SkipImagePrev").addClass("Tool-Common-SizeA Tool-SkipImagePrev-OFF"));

        // ボタンクリックイベント設定
        $("#Tool-SkipImagePrev").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態
                $this.removeClass($this.attr("id") + "-OFF").addClass($this.attr("id") + "-ON");

                // 開始処理
                Tool_SkipImagePrev.Command(true);

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

                            // 終了処理
                            Tool_SkipImagePrev.Command(false);

                            // タッチイベント解除
                            $this.off("touchmove touchend touchcancel", event);
                        }
                        return;
                    }

                    // 選択状態解除
                    $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

                    // 終了処理
                    Tool_SkipImagePrev.Command(false);

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

                // 開始処理
                Tool_SkipImagePrev.Command(true);

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

                            // 終了処理
                            Tool_SkipImagePrev.Command(false);

                            // マウスイベント解除
                            $(document).off("mousemove mouseup mouseout", event);
                        }
                        return;
                    }

                    // 画面内をドラッグしていれば継続
                    if (e.type == "mouseout" && e.relatedTarget) {
                        return;
                    }

                    // 選択状態解除
                    $this.removeClass($this.attr("id") + "-ON").addClass($this.attr("id") + "-OFF");

                    // 終了処理
                    Tool_SkipImagePrev.Command(false);

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });
    },
    // コマンド
    Command: function (command) {
        // 選択シリーズ取得
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null) {
            return;
        }

        // コマンド確認
        if (command == true) {
            // タイマ設定
            Tool_SkipImageNext.RepeatTimer = setTimeout(function () {
                // ViewerCtrl呼び出し
                selectSeries.autosetSopIndex(-1);
                Tool_SkipImageNext.IsRepeat = true;
            }, 400);
        }
        else {
            // タイマクリア
            if (Tool_SkipImageNext.RepeatTimer) {
                clearTimeout(Tool_SkipImageNext.RepeatTimer);
            }

            // ViewerCtrl呼び出し
            if (Tool_SkipImageNext.IsRepeat) {
                selectSeries.autosetSopIndex(0);
            }
            else {
                // キャンセルしなかった場合
                if (!Tool_Menu.IsCancel) {
                    viewer.setSopIndex(-1, "current");
                }
            }
            Tool_SkipImageNext.IsRepeat = false;
        }
    }
}
