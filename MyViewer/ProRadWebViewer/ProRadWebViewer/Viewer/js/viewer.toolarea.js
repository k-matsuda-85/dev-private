/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var overlayTimer;
var overlayTimerCount = 0;

// 初期化処理
function ViewerToolArea_Init() {
    // ツールメニュー初期化
    Tool_Menu.Init();

    // 全体幅を算出保持
    var width = 0;
    $("#ToolArea-View .Tool-Common-SizeA, #ToolArea-View .Tool-Common-SizeB, #ToolArea-View .Tool-Common-SizeC, #ToolArea-View .Tool-Separator").each(function () {
        width += $(this).width();
    });
    $("#ToolArea-View").data("width", width);

    // マージンを保持
    $("#ToolArea-View").data("margin", parseInt($("#ToolArea-View").css("left")));

    // ツール表示領域オーバーレイ処理
    ViewerToolArea_Overlay();

    // ツール領域のドラッグ設定
    $("#ToolArea").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 初期タッチ位置登録
            var startX = e.originalEvent.touches[0].pageX;

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offsetX = e.originalEvent.touches[0].pageX - startX;

                    // タッチ位置更新
                    startX = e.originalEvent.touches[0].pageX;

                    // ツール表示領域リサイズ処理
                    ViewerToolArea_Resize(offsetX, false);
                    return;
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            // 初期マウス位置登録
            var pointX = e.pageX;

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offsetX = e.pageX - pointX;

                    // マウス位置更新
                    pointX = e.pageX;

                    // ツール表示領域リサイズ処理
                    ViewerToolArea_Resize(offsetX, false);
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // マウスホイールイベント設定
        "mousewheel": function (e, delta) {
            // ツール表示領域リサイズ処理
            ViewerToolArea_Resize(delta * 72, false);
        }
    });

    // 左スクロールボタンのマウスダウンイベント設定
    $("#ToolArea-View-Overlay-Left").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新
                    rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // オフセット算出
                    var offset = $("#ToolArea").width() / 2;

                    // ツール表示領域リサイズ処理
                    ViewerToolArea_Resize(offset, true);
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);

            // イベントを通知しない
            return false;
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新
                    rectInfo.Update(e.pageX, e.pageY);
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // オフセット算出
                    var offset = $("#ToolArea").width() / 2;

                    // ツール表示領域リサイズ処理
                    ViewerToolArea_Resize(offset, true);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);

            // イベントを通知しない
            return false;
        }
    });

    // 右スクロールボタンのマウスダウンイベント設定
    $("#ToolArea-View-Overlay-Right").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新
                    rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // オフセット算出
                    var offset = -($("#ToolArea").width() / 2);

                    // ツール表示領域リサイズ処理
                    ViewerToolArea_Resize(offset, true);
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);

            // イベントを通知しない
            return false;
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新
                    rectInfo.Update(e.pageX, e.pageY);
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // オフセット算出
                    var offset = -($("#ToolArea").width() / 2);

                    // ツール表示領域リサイズ処理
                    ViewerToolArea_Resize(offset, true);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);

            // イベントを通知しない
            return false;
        }
    });
}

// ツール表示領域リサイズ処理
function ViewerToolArea_Resize(offset, animate) {
    //アニメーション停止
    $("#ToolArea-View").stop();

    // 現在の値を取得
    var margin = parseInt($("#ToolArea-View").data("margin"));
    var preLeft = parseInt($("#ToolArea-View").css("left")) - margin;

    // 移動後の値を算出
    var left = preLeft + offset;

    // 最大範囲(右移動の最大)
    if (left >= 0) {
        left = 0;
    }
    // 左移動時
    else if (offset < 0) {
        // ツール全体幅取得
        var viewArea = $("#ToolArea-View").data("width");

        // 表示エリア取得
        var showArea = $("#ToolArea").width() - margin;

        // 最小範囲(左移動の最大)算出
        var minLeft = showArea - viewArea;
        if (minLeft > 0) {
            minLeft = 0;
        }

        // リサイズにより右にスペースが発生し、その状態で左移動しようとした場合は移動不要
        if (preLeft < minLeft) {
            left = preLeft;
        }
        // 最小範囲(左移動の最大)
        else if (left < minLeft) {
            left = minLeft;
        }
    }

    // 変更がある場合
    if (left != preLeft) {
        // アニメーション確認
        if (animate == true) {
            // 表示位置更新(終了後「ツール表示領域オーバーレイ処理」呼び出し)
            $("#ToolArea-View").animate(
                { "left": left + margin + "px" },
                "normal",
                "swing",
                ViewerToolArea_Overlay
             );
        }
        else {
            // 表示位置更新
            $("#ToolArea-View").css("left", left + margin + "px");

            // ツール表示領域オーバーレイ処理
            ViewerToolArea_Overlay();
        }
    }

    // サブメニューキャンセル処理
    Tool_Menu.SubMenuCancel();

    // Viewerのイベントを元に戻す
    viewer.IsEnable = true;
}

// ツール表示領域オーバーレイ処理
function ViewerToolArea_Overlay() {
    // タイマチェック
    if (!overlayTimer) {
        overlayTimerCount = 2;
        overlayTimer = setInterval(function () {
            // IE7でfloat適応要素が正しく表示できないため強制的に再設定
            var left = parseInt($("#ToolArea-View").css("left"));
            left++;
            $("#ToolArea-View").css("left", left + "px");
            left--;
            $("#ToolArea-View").css("left", left + "px");

            // 表示位置更新
            var $right = $("#ToolArea-View-Overlay-Right");
            $right.css("left", $("#ToolArea").width() - $right.width() + "px");

            // 左側表示更新
            if (parseInt($("#ToolArea-View").css("left")) != parseInt($("#ToolArea-View").data("margin"))) {
                $("#ToolArea-View-Overlay-Left").show();
            }
            else {
                $("#ToolArea-View-Overlay-Left").hide();
            }

            // 右側表示更新
            if ($("#ToolArea-View").width() != 0 && $("#ToolArea-View").data("width") != $("#ToolArea-View").width()) {
                $("#ToolArea-View-Overlay-Right").show();
            }
            else {
                $("#ToolArea-View-Overlay-Right").hide();
            }

            // タイマ更新
            if (overlayTimerCount <= 0) {
                clearTimeout(overlayTimer);
                overlayTimer = null;
            }
            overlayTimerCount--;
        }, 50);
    }
}
