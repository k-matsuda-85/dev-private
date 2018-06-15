/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// GSPS(PR)表示
var Tool_GSPS = {
    // 有効
    Enabled: false,
    // デフォルト
    Default: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_GSPS.Enabled) {
            return;
        }
        Tool_GSPS.Enabled = true;

        // パラメータ確認
        if ($("#ViewerConfig").data("DefGSPS") == "1") {
            Tool_GSPS.Default = true;
        }

        // 要素を作成
        $("#ToolArea-View")
            .append($("<div>").attr("id", "Tool-GSPS").addClass("Tool-Common-SizeA Tool-GSPS-OFF"))
            .append($("<div>").attr("id", "Tool-GSPS-Side").addClass("Tool-Common-SizeB Tool-GSPS-Side-OFF"));
        $("#ToolArea-Sub")
            .append($("<div>").attr("id", "Tool-GSPS-Side-Sub"));

        // ボタンクリックイベント設定
        $("#Tool-GSPS").on({
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
                        Tool_GSPS.Click();
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
                        Tool_GSPS.Click();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定
        $("#Tool-GSPS-Side").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態の場合
                if ($("#Tool-GSPS-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_GSPS.SideCommand(false);
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
                        Tool_GSPS.SideClick();
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                // 選択状態の場合
                if ($("#Tool-GSPS-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_GSPS.SideCommand(false);
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
                        Tool_GSPS.SideClick();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定(サブメニュー)
        $("#Tool-GSPS-Side-Sub").on({
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
                        // 位置情報更新
                        rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && rectInfo.IsHit) {
                        // サブメニューコマンド
                        Tool_GSPS.SubCommand($this.data("Command"), $this.data("Index"));

                        // 非表示(キャンセル処理)
                        Tool_GSPS.SideCommand(false);
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
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
                        // 位置情報更新
                        rectInfo.Update(e.pageX, e.pageY);
                        return;
                    }

                    // 画面内をドラッグしていれば継続
                    if (e.type == "mouseout" && e.relatedTarget) {
                        return;
                    }

                    // クリック時
                    if (e.type == "mouseup" && rectInfo.IsHit) {
                        // サブメニューコマンド
                        Tool_GSPS.SubCommand($this.data("Command"), $this.data("Index"));

                        // 非表示(キャンセル処理)
                        Tool_GSPS.SideCommand(false);
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        }, ".Tool-GSPS-Side-Sub-Item");
    },
    // クリック
    Click: function () {
        var command;
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null ||
            selectSeries.seriesData == null) {
            command = false;
        }
        else {
            // 未選択状態の場合
            if ($("#Tool-GSPS").hasClass("Tool-GSPS-OFF")) {
                command = true;
            }
            else {
                command = false;
            }
        }

        // コマンド処理
        Tool_GSPS.Command(command, null);
    },
    // コマンド
    Command: function (command, series) {
        var isSeries = true;
        var isLoad = true;
        if (series == null) {
            // 選択シリーズ取得
            series = viewer.getSelectSeries();
            if (series == null ||
                series.seriesData == null) {
                isSeries = false;
            }
            isLoad = false;
        }

        // 初回時設定しない場合読み込み中止しないよう更新処理のみ行う
        if (isLoad && !command) {
            // 更新処理
            Tool_GSPS.Update();
            return;
        }

        // シリーズがある場合
        if (isSeries && GSPSList.Get(series.seriesData.ExData.SeriesKey) != null) {
            // ONでかつ初期値の場合、先頭を表示
            var index = series.seriesData.ExData.GSPSIndex;
            if (command && index == -1) {
                index = 0;
            }

            // サブメニューコマンド
            Tool_GSPS.SubCommand(command, index, series);
        }
        else {
            // 更新処理
            Tool_GSPS.Update();
        }
    },
    // 更新
    Update: function () {
        // アイコン変更
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null ||
            selectSeries.seriesData == null ||
            GSPSList.Get(selectSeries.seriesData.ExData.SeriesKey) == null) {
            $("#Tool-GSPS").removeClass("Tool-GSPS-ON").addClass("Tool-GSPS-OFF");
        }
        else {
            if (selectSeries.seriesData.ExData.GSPS) {
                $("#Tool-GSPS").removeClass("Tool-GSPS-OFF").addClass("Tool-GSPS-ON");
            }
            else {
                $("#Tool-GSPS").removeClass("Tool-GSPS-ON").addClass("Tool-GSPS-OFF");
            }
        }
    },
    // サイドメニュークリック
    SideClick: function () {
        // 未選択状態の場合
        if ($("#Tool-GSPS-Side").hasClass("Tool-GSPS-Side-OFF")) {
            Tool_GSPS.SideCommand(true);
        }
        else {
            Tool_GSPS.SideCommand(false);
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
            $("#Tool-GSPS-Side").removeClass("Tool-GSPS-Side-OFF").addClass("Tool-GSPS-Side-ON");

            // 現要素を削除
            var $obj = $("#Tool-GSPS-Side-Sub");
            $obj.empty();

            // 選択情報取得
            var series = viewer.getSelectSeries();
            if (series == null || series.seriesData == null) {
                // 非表示(キャンセル処理)
                Tool_GSPS.SideCommand(false);
                return;
            }
            var gsps = GSPSList.Get(series.seriesData.ExData.SeriesKey);
            if (gsps == null || gsps.length == 0) {
                // 非表示(キャンセル処理)
                Tool_GSPS.SideCommand(false);
                return;
            }

            // 初期値要素作成
            $obj.append($("<div>").text("初期値").data("Command", false).data("Index", -1).addClass("Tool-GSPS-Side-Sub-Item"))
                .append($("<div>").addClass("Tool-GSPS-Side-Sub-Separator"));

            // ラベル要素作成
            for (var i = 0; i < gsps.length; i++) {
                var $item = $("<div>")
                    .text(gsps[i].ContentLabel)
                    .data("Command", true).data("Index", i)
                    .addClass("Tool-GSPS-Side-Sub-Item");
                if (series.seriesData.ExData.GSPSIndex == i) {
                    $item.addClass("Tool-GSPS-Side-Sub-Item-Select");
                }
                $obj.append($item);
            }

            // サブメニュー表示位置補正表示
            var offset = $("#Tool-GSPS-Side").offset();
            $("#Tool-GSPS-Side-Sub").css({ left: offset.left - 48, top: offset.top + 48 }).show();

            // セパレータを設定
            var $sep = $obj.children(".Tool-GSPS-Side-Sub-Separator");
            $sep.width($obj.width() - $sep.outerWidth({ magin: true })).show();
        }
        else {
            // Viewerのイベントを元に戻す
            viewer.IsEnable = true;

            // アイコン変更
            $("#Tool-GSPS-Side").removeClass("Tool-GSPS-Side-ON").addClass("Tool-GSPS-Side-OFF");
            $("#Tool-GSPS-Side-Sub").hide();
        }
    },
    // サブメニューコマンド
    SubCommand: function (command, index, series) {
        // シリーズ確認
        if (series == null) {
            // 選択シリーズ取得
            series = viewer.getSelectSeries();
        }
        if (series == null ||
            series.seriesData == null) {
            // 更新処理
            Tool_GSPS.Update();
            return;
        }

        // 初期値の場合
        if (!command) {
            // シリーズ情報更新
            series.seriesData.ExData.GSPS = false;

            // Viewer設定
            series.seriesData.setPRInfo(null);

            // 更新処理
            Tool_GSPS.Update();
            return;
        }

        // GSPS要求パラメータ作成
        var obj = {};
        obj.Unique = series.seriesData.ExData.Unique;
        obj.Index = index;
        obj.Command = command;

        // GSPSデータ一覧取得
        GSPSList.GetDataList(series.seriesData.ExData.SeriesKey, index, obj, function (_obj) {
            // 対象シリーズ取得
            var _seriesData = null;
            for (var i = 0; i < viewer.SeriesPanels.length; i++) {
                if (viewer.SeriesPanels[i].seriesData.ExData.Unique == _obj.Unique) {
                    _seriesData = viewer.SeriesPanels[i].seriesData;
                    break;
                }
            }
            if (_seriesData == null) {
                // 更新処理
                Tool_GSPS.Update();
                return;
            }

            // シリーズ情報更新
            _seriesData.ExData.GSPSIndex = _obj.Index;
            _seriesData.ExData.GSPS = _obj.Command;

            // Viewer設定
            if (_obj.Command) {
                var prm = {};
                prm.SeriesKey = _seriesData.ExData.SeriesKey;
                prm.Index = _obj.Index;
                prm.getPRInfo = function (key) {
                    // GSPSデータ取得
                    var data = GSPSList.GetData(this.SeriesKey, this.Index, key);
                    if (data == null) {
                        return null;
                    }
                    return data;
                };
                _seriesData.setPRInfo(prm);
            }
            else {
                _seriesData.setPRInfo(null);
            }

            // 更新処理
            Tool_GSPS.Update();
        });
    }
}
