/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 回転、リバース
var Tool_Rotate = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_Rotate.Enabled) {
            return;
        }
        Tool_Rotate.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-Rotate").addClass("Tool-Common-SizeA Tool-Rotate-OFF"));
        $("#ToolArea-Sub").append($("<div>").attr("id", "Tool-Rotate-Sub")
            .append($("<div>").text("0°").data("command", "0").addClass("Tool-Rotate-Sub-Item"))
            .append($("<div>").text("90°").data("command", "90").addClass("Tool-Rotate-Sub-Item"))
            .append($("<div>").text("180°").data("command", "180").addClass("Tool-Rotate-Sub-Item"))
            .append($("<div>").text("270°").data("command", "270").addClass("Tool-Rotate-Sub-Item"))
            .append($("<div>").text("左右反転").data("command", "FlipX").addClass("Tool-Rotate-Sub-Item"))
            .append($("<div>").text("上下反転").data("command", "FlipY").addClass("Tool-Rotate-Sub-Item"))
            .append($("<div>").addClass("Tool-Rotate-Sub-Separator"))
            .append($("<div>").text("画像逆順").data("command", "Reverse").addClass("Tool-Rotate-Sub-Item")));

        // セパレータを設定
        $("#Tool-Rotate-Sub").show();
        var $sep = $("#Tool-Rotate-Sub").children(".Tool-Rotate-Sub-Separator");
        $sep.width($("#Tool-Rotate-Sub").width() - $sep.outerWidth({ magin: true })).show();
        $("#Tool-Rotate-Sub").hide();

        // ボタンクリックイベント設定
        $("#Tool-Rotate").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態の場合
                if ($("#Tool-Rotate-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_Rotate.Command(false);
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
                        Tool_Rotate.Click();
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                // 選択状態の場合
                if ($("#Tool-Rotate-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_Rotate.Command(false);
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
                        Tool_Rotate.Click();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // ボタンクリックイベント設定(サブメニュー)
        $("#Tool-Rotate-Sub").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態
                $this.addClass("Tool-Rotate-Sub-Item-ON");

                // 要素位置情報用クラス生成
                var rectInfo = new Common_RectInfo($this);

                // タッチイベント設定
                var event = function (e) {
                    // タッチ移動時
                    if (e.type == "touchmove") {
                        // 要素位置情報更新後、範囲内の場合
                        if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                            // 選択状態
                            $this.addClass("Tool-Rotate-Sub-Item-ON");
                        }
                        else {
                            // 選択状態解除
                            $this.removeClass("Tool-Rotate-Sub-Item-ON");
                        }
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && rectInfo.IsHit) {
                        // サブメニューコマンド処理
                        Tool_Rotate.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_Rotate.Command(false);
                    }

                    // 選択状態解除
                    $this.removeClass("Tool-Rotate-Sub-Item-ON");

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function () {
                var $this = $(this);

                // 選択状態
                $this.addClass("Tool-Rotate-Sub-Item-ON");

                // 要素位置情報用クラス生成
                var rectInfo = new Common_RectInfo($this);

                // マウスイベント設定
                var event = function (e) {
                    // マウス移動時
                    if (e.type == "mousemove") {
                        // 要素位置情報更新後、範囲内の場合
                        if (rectInfo.Update(e.pageX, e.pageY)) {
                            // 選択状態
                            $this.addClass("Tool-Rotate-Sub-Item-ON");
                        }
                        else {
                            // 選択状態解除
                            $this.removeClass("Tool-Rotate-Sub-Item-ON");
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
                        Tool_Rotate.SubCommand($this.data("command"));

                        // 非表示(キャンセル処理)
                        Tool_Rotate.Command(false);
                    }

                    // 選択状態解除
                    $this.removeClass("Tool-Rotate-Sub-Item-ON");

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        }, ".Tool-Rotate-Sub-Item");
    },
    // クリック
    Click: function () {
        // 未選択状態の場合
        if ($("#Tool-Rotate").hasClass("Tool-Rotate-OFF")) {
            // 有効
            Tool_Rotate.Command(true);
        }
        else {
            // 無効
            Tool_Rotate.Command(false);
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
            $("#Tool-Rotate").removeClass("Tool-Rotate-OFF").addClass("Tool-Rotate-ON");

            // サブメニュー表示位置補正表示
            var offset = $("#Tool-Rotate").offset();
            $("#Tool-Rotate-Sub").css({ left: offset.left, top: offset.top + 48 }).show();
        }
        else {
            // Viewerのイベントを元に戻す
            viewer.IsEnable = true;

            // アイコン変更
            $("#Tool-Rotate").removeClass("Tool-Rotate-ON").addClass("Tool-Rotate-OFF");
            $("#Tool-Rotate-Sub").hide();
        }
    },
    // サブメニューコマンド
    SubCommand: function (command) {
        // 選択シリーズ取得
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null ||
        selectSeries.getData() == null ||
        selectSeries.getData().SopDatas.length <= selectSeries.getData().SopIndex ||
        selectSeries.getData().SopDatas[selectSeries.getData().SopIndex] == null) {
            return;
        }

        // ViewerCtrl呼び出し(相対にするなら現在値から計算 加算して360の余り)
        var data = selectSeries.getData();
        switch (command) {
            case "0":
                data.setRotate(0, data.ImageFlipX, false);
                break;
            case "90":
                data.setRotate(90, data.ImageFlipX, false);
                break;
            case "180":
                data.setRotate(180, data.ImageFlipX, false);
                break;
            case "270":
                data.setRotate(270, data.ImageFlipX, false);
                break;
            case "FlipX":
                data.setRotate(data.ImageRotate, !data.ImageFlipX, false);
                break;
            case "FlipY":
                data.setRotate((data.ImageRotate + 180) % 360, !data.ImageFlipX, false);
                break;
            case "Reverse":
                if (data == null || data.SopDatas.length <= data.SopIndex || data.SopDatas[data.SopIndex] == null) {
                    break;
                }

                // ViewerCtrl呼び出し
                selectSeries.seriesData.reverse();
                break;
        }
    }
}
