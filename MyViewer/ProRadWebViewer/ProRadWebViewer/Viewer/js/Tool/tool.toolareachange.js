/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// ツール位置変更
var Tool_ToolAreaChange = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_ToolAreaChange.Enabled) {
            return;
        }
        Tool_ToolAreaChange.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-ToolAreaChange").addClass("Tool-Common-SizeA Tool-ToolAreaChange-Top-OFF"));

        // Cookie取得
        var pos = Common_GetCookie("ToolAreaPos");
        if (pos == "1") {
            // 遅延処理を行う
            setTimeout(function () {
                // Separatorの隣に移動
                Tool_ToolAreaChange.Command(true);
            }, 100);
        }

        // ボタンクリックイベント設定
        $("#Tool-ToolAreaChange").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態
                if ($this.hasClass($this.attr("id") + "-Top-OFF")) {
                    $this.removeClass($this.attr("id") + "-Top-OFF").addClass($this.attr("id") + "-Top-ON");
                }
                else if ($this.hasClass($this.attr("id") + "-Bottom-OFF")) {
                    $this.removeClass($this.attr("id") + "-Bottom-OFF").addClass($this.attr("id") + "-Bottom-ON");
                }

                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

                // タッチイベント設定
                var event = function (e) {
                    // タッチ移動時
                    if (e.type == "touchmove") {
                        // 位置情報更新後、ドラッグ状態の場合
                        if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                            // 選択状態解除
                            if ($this.hasClass($this.attr("id") + "-Top-ON")) {
                                $this.removeClass($this.attr("id") + "-Top-ON").addClass($this.attr("id") + "-Top-OFF");
                            }
                            else if ($this.hasClass($this.attr("id") + "-Bottom-ON")) {
                                $this.removeClass($this.attr("id") + "-Bottom-ON").addClass($this.attr("id") + "-Bottom-OFF");
                            }

                            // タッチイベント解除
                            $this.off("touchmove touchend touchcancel", event);
                        }
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && !pointInfo.IsDrag) {
                        // 遅延処理を行う
                        setTimeout(function () {
                            // クリック処理
                            Tool_ToolAreaChange.Click();
                        }, 100);
                    }

                    // 選択状態解除
                    if ($this.hasClass($this.attr("id") + "-Top-ON")) {
                        $this.removeClass($this.attr("id") + "-Top-ON").addClass($this.attr("id") + "-Top-OFF");
                    }
                    else if ($this.hasClass($this.attr("id") + "-Bottom-ON")) {
                        $this.removeClass($this.attr("id") + "-Bottom-ON").addClass($this.attr("id") + "-Bottom-OFF");
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                var $this = $(this);

                // 選択状態
                if ($this.hasClass($this.attr("id") + "-Top-OFF")) {
                    $this.removeClass($this.attr("id") + "-Top-OFF").addClass($this.attr("id") + "-Top-ON");
                }
                else if ($this.hasClass($this.attr("id") + "-Bottom-OFF")) {
                    $this.removeClass($this.attr("id") + "-Bottom-OFF").addClass($this.attr("id") + "-Bottom-ON");
                }

                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

                // マウスイベント設定
                var event = function (e) {
                    // マウス移動時
                    if (e.type == "mousemove") {
                        // 位置情報更新後、ドラッグ状態の場合
                        if (pointInfo.Update(e.pageX, e.pageY)) {
                            // 選択状態解除
                            if ($this.hasClass($this.attr("id") + "-Top-ON")) {
                                $this.removeClass($this.attr("id") + "-Top-ON").addClass($this.attr("id") + "-Top-OFF");
                            }
                            else if ($this.hasClass($this.attr("id") + "-Bottom-ON")) {
                                $this.removeClass($this.attr("id") + "-Bottom-ON").addClass($this.attr("id") + "-Bottom-OFF");
                            }

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
                        // 遅延処理を行う
                        setTimeout(function () {
                            // クリック処理
                            Tool_ToolAreaChange.Click();
                        }, 100);
                    }

                    // 選択状態解除
                    if ($this.hasClass($this.attr("id") + "-Top-ON")) {
                        $this.removeClass($this.attr("id") + "-Top-ON").addClass($this.attr("id") + "-Top-OFF");
                    }
                    else if ($this.hasClass($this.attr("id") + "-Bottom-ON")) {
                        $this.removeClass($this.attr("id") + "-Bottom-ON").addClass($this.attr("id") + "-Bottom-OFF");
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });
    },
    // クリック
    Click: function () {
        // 状態確認
        if ($("#Tool-ToolAreaChange").hasClass("Tool-ToolAreaChange-Top-OFF")) {
            // Separatorの隣に移動
            Tool_ToolAreaChange.Command(true);
        }
        else {
            // ViewerHeadの内部に移動
            Tool_ToolAreaChange.Command(false);
        }
    },
    // コマンド
    Command: function (command) {
        // コマンド確認
        if (command == true) {
            // アイコン変更
            $("#Tool-ToolAreaChange").removeClass("Tool-ToolAreaChange-Top-OFF").addClass("Tool-ToolAreaChange-Bottom-OFF");

            // ヘッダ部を非表示
            $("#ViewerHead").hide();

            // Separatorの隣に移動
            $("#Separator").after($("#ToolArea"));

            // Cookie設定
            Common_SetCookie("ToolAreaPos", "1", 0);
        }
        else {
            // アイコン変更
            $("#Tool-ToolAreaChange").removeClass("Tool-ToolAreaChange-Bottom-OFF").addClass("Tool-ToolAreaChange-Top-OFF");

            // ヘッダ部を表示
            $("#ViewerHead").show();

            // ViewerHeadの内部に移動
            $("#ViewerHead").append($("#ToolArea"));

            // Cookie設定
            Common_SetCookie("ToolAreaPos", "0", 0);
        }

        // セパレータ(横)リサイズ処理を強制的に行うことにより
        // IE6、IE7でレイアウトが正しい位置に表示される
        var width = $("#SeriesList").offset().left;
        ViewerWindow_Separator_Side_Resize(width - 1);
        ViewerWindow_Separator_Side_Resize(width);
    },
    // ツール位置変更状態確認
    IsTop: function () {
        if ($("#Tool-ToolAreaChange").hasClass("Tool-ToolAreaChange-Top-OFF")) {
            return true;
        }
        else {
            return false;
        }
    }
}
