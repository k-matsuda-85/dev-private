/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 間引き
var Tool_ThinOut = {
    // 有効
    Enabled: false,
    // モダリティ情報
    Modality: null,
    // モード
    Mode: function (modality) {
        if (Tool_ThinOut.Modality == null) {
            return "0";
        }
        if (modality in Tool_ThinOut.Modality) {
            return Tool_ThinOut.Modality[modality].Mode;
        }
        return Tool_ThinOut.Modality[""].Mode;
    },
    // デフォルト間引き枚数
    Default: function (modality) {
        if (Tool_ThinOut.Modality == null) {
            return 50;
        }
        if (modality in Tool_ThinOut.Modality) {
            return Tool_ThinOut.Modality[modality].Default;
        }
        return Tool_ThinOut.Modality[""].Default;
    },
    // Cookie使用有無
    IsCookie: false,
    // Cookie取得
    GetCookie: function () {
        var items = [];
        var cookie = Common_GetCookie("ThinOut");
        if (cookie != "") {
            cookie = cookie.split(",");
            if (cookie.length % 3 == 0) {
                for (var i = 0; i < cookie.length; i += 3) {
                    if ((cookie[i] in Tool_ThinOut.Modality) && !isNaN(parseInt(cookie[i + 2]))) {
                        var obj = {};
                        obj.Modality = cookie[i];
                        obj.Mode = cookie[i + 1];
                        obj.Default = parseInt(cookie[i + 2]);
                        items.push(obj);
                    }
                }
            }
        }
        return items;
    },
    // Cookie設定
    SetCookie: function (modality, mode, def) {
        // 現在のCookieを取得
        var cookie = Tool_ThinOut.GetCookie();

        // 該当モダリティ取得
        var mod = (modality in Tool_ThinOut.Modality) ? modality : "";

        // 更新確認
        var isUpdate = false;
        for (var i = 0; i < cookie.length; i++) {
            if (cookie[i].Modality == mod) {
                // 更新
                cookie[i].Mode = mode;
                cookie[i].Default = def;
                isUpdate = true;
                break;
            }
        }
        if (!isUpdate) {
            // 新規追加
            var obj = {};
            obj.Modality = mod;
            obj.Mode = mode;
            obj.Default = def;
            cookie.push(obj);
        }

        // 設定文字列作成
        var str = "";
        for (var i = 0; i < cookie.length; i++) {
            str += cookie[i].Modality + "," + cookie[i].Mode + "," + cookie[i].Default + ",";
        }
        str = str.substring(0, str.length - 1);

        // Cookie設定
        Common_SetCookie("ThinOut", str, 0);
    },
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_ThinOut.Enabled) {
            return;
        }

        // 必須パラメータ確認
        var config = $("#ViewerConfig").data("ModalityConfig");
        if (!("ThinOut" in config) || !("ThinOutOption" in config)) {
            // 項目なし
            return;
        }
        var _thinOut = config["ThinOut"];
        var _thinOutOption = config["ThinOutOption"];
        if (!("" in _thinOut) || !("" in _thinOutOption)) {
            // デフォルトなし
            return;
        }
        for (var i in _thinOutOption) {
            if (i in _thinOut) {
                continue;
            }
            _thinOut[i] = _thinOut[""];
        }
        for (var i in _thinOut) {
            if (i in _thinOutOption) {
                continue;
            }
            _thinOutOption[i] = _thinOutOption[""];
        }
        Tool_ThinOut.Modality = {};
        Tool_ThinOut.Enabled = true;

        // パラメータ確認
        for (var i in _thinOutOption) {
            var opt = _thinOutOption[i].split(",");
            if (opt[0] == "" || isNaN(opt[1])) {
                continue;
            }
            var item = {};
            item.Mode = opt[0];
            item.Default = parseInt(opt[1]);
            Tool_ThinOut.Modality[i] = item;
        }
        if ($("#ViewerConfig").data("ThinOutCookie") == "1") {
            Tool_ThinOut.IsCookie = true;
        }

        // URLコール時は一部モードに書き換え
        if ($("#ViewerConfig").data("sk") != "" && $("#ViewerConfig").data("ThinOutUrlCall") != "1") {
            for (var i in Tool_ThinOut.Modality) {
                Tool_ThinOut.Modality[i].Mode = "0";
            }
            Tool_ThinOut.IsCookie = false;
        }

        // Cookieより設定値を取得
        if (Tool_ThinOut.IsCookie) {
            var cookie = Tool_ThinOut.GetCookie();
            for (var i = 0; i < cookie.length; i++) {
                Tool_ThinOut.Modality[cookie[i].Modality].Mode = cookie[i].Mode;
                Tool_ThinOut.Modality[cookie[i].Modality].Default = cookie[i].Default;
            }
        }

        // シリーズキャッシュ設定
        var maxSeriesCache = parseInt($("#ViewerConfig").data("MaxSeriesCache"));
        if (!isNaN(maxSeriesCache)) {
            ViewerUtil.SeriesCacheCount = maxSeriesCache;
        }

        // 要素を作成
        $("#ToolArea-View")
            .append($("<div>").attr("id", "Tool-ThinOut").addClass("Tool-Common-SizeA Tool-ThinOut-Disabled-Part-OFF")
                .append($("<div>").attr("id", "Tool-ThinOut-Disabled"))
                .append($("<div>").attr("id", "Tool-ThinOut-Enabled")))
            .append($("<div>").attr("id", "Tool-ThinOut-Side").addClass("Tool-Common-SizeB Tool-ThinOut-Side-OFF"));
        var $dis = $("<div>").attr("id", "Tool-ThinOut-Side-Sub-Disabled");
        var $ena = $("<div>").attr("id", "Tool-ThinOut-Side-Sub-Enabled");
        $("#ToolArea-Sub")
            .append($("<div>").attr("id", "Tool-ThinOut-Side-Sub")
                .append($dis)
                .append($ena));

        // プルダウン作成
        $dis.append($("<div>").text("一部").data("mode", "0").data("command", ViewerUtil.SeriesCacheCount).addClass("Tool-ThinOut-Side-Sub-Item"));
        $dis.append($("<div>").text("全て").data("mode", "2").data("command", -1).addClass("Tool-ThinOut-Side-Sub-Item"));
        for (var mod in _thinOut) {
            var param = _thinOut[mod].split(",");
            var $group = $("<div>").data("modality", mod).addClass("Tool-ThinOut-Side-Sub-Group");
            for (var key in param) {
                if (param[key] == "") {
                    continue;
                }
                var com = parseInt(param[key]);
                if (isNaN(com)) {
                    continue;
                }
                $group.append($("<div>").text(com).data("mode", "1").data("command", com).addClass("Tool-ThinOut-Side-Sub-Item"));
            }
            if ($group.children().length != 0) {
                $ena.append($group);
            }
        }

        // 更新処理
        Tool_ThinOut.Update();

        // ボタンクリックイベント設定
        $("#Tool-ThinOut").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // アイコン変更(ON)
                if ($("#Tool-ThinOut-Enabled").is(":visible")) {
                    $this.removeClass("Tool-ThinOut-Enabled-OFF").addClass("Tool-ThinOut-Enabled-ON");
                }
                else {
                    if ($this.hasClass("Tool-ThinOut-Disabled-Part-OFF")) {
                        $this.removeClass("Tool-ThinOut-Disabled-Part-OFF").addClass("Tool-ThinOut-Disabled-Part-ON");
                    }
                    else {
                        $this.removeClass("Tool-ThinOut-Disabled-All-OFF").addClass("Tool-ThinOut-Disabled-All-ON");
                    }
                }

                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

                // タッチイベント設定
                var event = function (e) {
                    // タッチ移動時
                    if (e.type == "touchmove") {
                        // 位置情報更新後、ドラッグ状態の場合
                        if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                            // 更新処理
                            Tool_ThinOut.Update();

                            // タッチイベント解除
                            $this.off("touchmove touchend touchcancel", event);
                        }
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && !pointInfo.IsDrag) {
                        // クリック処理
                        Tool_ThinOut.Click();
                    }

                    // 更新処理
                    Tool_ThinOut.Update();

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                var $this = $(this);

                // アイコン変更(ON)
                if ($("#Tool-ThinOut-Enabled").is(":visible")) {
                    $this.removeClass("Tool-ThinOut-Enabled-OFF").addClass("Tool-ThinOut-Enabled-ON");
                }
                else {
                    if ($this.hasClass("Tool-ThinOut-Disabled-Part-OFF")) {
                        $this.removeClass("Tool-ThinOut-Disabled-Part-OFF").addClass("Tool-ThinOut-Disabled-Part-ON");
                    }
                    else {
                        $this.removeClass("Tool-ThinOut-Disabled-All-OFF").addClass("Tool-ThinOut-Disabled-All-ON");
                    }
                }

                // 位置情報用クラス生成
                var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

                // マウスイベント設定
                var event = function (e) {
                    // マウス移動時
                    if (e.type == "mousemove") {
                        // 位置情報更新後、ドラッグ状態の場合
                        if (pointInfo.Update(e.pageX, e.pageY)) {
                            // 更新処理
                            Tool_ThinOut.Update();

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
                        // クリック処理
                        Tool_ThinOut.Click();
                    }

                    // 更新処理
                    Tool_ThinOut.Update();

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定
        $("#Tool-ThinOut-Side").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態の場合
                if ($("#Tool-ThinOut-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_ThinOut.SideCommand(false);
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
                        Tool_ThinOut.SideClick();
                    }

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function (e) {
                // 選択状態の場合
                if ($("#Tool-ThinOut-Side-Sub").is(":visible")) {
                    // 非表示(キャンセル処理)
                    Tool_ThinOut.SideCommand(false);
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
                        Tool_ThinOut.SideClick();
                    }

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        });

        // サイドメニューボタンクリックイベント設定(サブメニュー)
        $("#Tool-ThinOut-Side-Sub").on({
            // タッチ開始イベント設定
            "touchstart": function (e) {
                var $this = $(this);

                // タッチ数が1以外の場合キャンセル
                if (e.originalEvent.touches.length != 1) {
                    return false;
                }

                // 選択状態
                $this.addClass("Tool-ThinOut-Side-Sub-Item-ON");

                // 要素位置情報用クラス生成
                var rectInfo = new Common_RectInfo($this);

                // タッチイベント設定
                var event = function (e) {
                    // タッチ移動時
                    if (e.type == "touchmove") {
                        // 要素位置情報更新後、範囲内の場合
                        if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                            // 選択状態
                            $this.addClass("Tool-ThinOut-Side-Sub-Item-ON");
                        }
                        else {
                            // 選択状態解除
                            $this.removeClass("Tool-ThinOut-Side-Sub-Item-ON");
                        }
                        return;
                    }

                    // クリック時
                    if (e.type == "touchend" && rectInfo.IsHit) {
                        // コマンド処理
                        Tool_ThinOut.Command($this.data("mode"), $this.data("command"), null, true);

                        // 非表示(キャンセル処理)
                        Tool_ThinOut.SideCommand(false);
                    }

                    // 選択状態解除
                    $this.removeClass("Tool-ThinOut-Side-Sub-Item-ON");

                    // タッチイベント解除
                    $this.off("touchmove touchend touchcancel", event);
                }
                $this.on("touchmove touchend touchcancel", event);
            },
            // マウスダウンイベント設定
            "mousedown": function () {
                var $this = $(this);

                // 選択状態
                $this.addClass("Tool-ThinOut-Side-Sub-Item-ON");

                // 要素位置情報用クラス生成
                var rectInfo = new Common_RectInfo($this);

                // マウスイベント設定
                var event = function (e) {
                    // マウス移動時
                    if (e.type == "mousemove") {
                        // 要素位置情報更新後、範囲内の場合
                        if (rectInfo.Update(e.pageX, e.pageY)) {
                            // 選択状態
                            $this.addClass("Tool-ThinOut-Side-Sub-Item-ON");
                        }
                        else {
                            // 選択状態解除
                            $this.removeClass("Tool-ThinOut-Side-Sub-Item-ON");
                        }
                        return;
                    }

                    // 画面内をドラッグしていれば継続
                    if (e.type == "mouseout" && e.relatedTarget) {
                        return;
                    }

                    // クリック時
                    if (e.type == "mouseup" && rectInfo.IsHit) {
                        // コマンド処理
                        Tool_ThinOut.Command($this.data("mode"), $this.data("command"), null, true);

                        // 非表示(キャンセル処理)
                        Tool_ThinOut.SideCommand(false);
                    }

                    // 選択状態解除
                    $this.removeClass("Tool-ThinOut-Side-Sub-Item-ON");

                    // マウスイベント解除
                    $(document).off("mousemove mouseup mouseout", event);
                }
                $(document).on("mousemove mouseup mouseout", event);
            }
        }, ".Tool-ThinOut-Side-Sub-Item");
    },
    // クリック
    Click: function () {
        // 現在と反対の設定値取得
        var mode, command;
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null ||
            selectSeries.seriesData == null) {
            // メニューから取得
            var $select;
            if ($("#Tool-ThinOut-Enabled").is(":visible")) {
                // 表示状態を取得
                $select = $("#Tool-ThinOut-Side-Sub-Disabled .Tool-ThinOut-Side-Sub-Item-Select");
                if ($select.length != 1) {
                    mode = Tool_ThinOut.Mode("");
                    command = ViewerUtil.SeriesCacheCount;
                }
                else {
                    mode = $select.data("mode");
                    command = $select.data("command");
                }
            }
            else {
                // 間引き値を取得
                mode = "1";
                $select = $("#Tool-ThinOut-Side-Sub-Enabled .Tool-ThinOut-Side-Sub-Item-Select");
                if ($select.length != 1) {
                    command = Tool_ThinOut.Default("");
                }
                else {
                    command = $select.data("command");
                }
            }
        }
        else {
            // シリーズから取得
            if ($("#Tool-ThinOut-Enabled").is(":visible")) {
                // 表示状態を取得
                if (selectSeries.seriesData.SeriesCacheCount == -1) {
                    mode = "2";
                }
                else {
                    mode = "0";
                }
                command = selectSeries.seriesData.SeriesCacheCount;
            }
            else {
                // 間引き値を取得
                mode = "1";
                command = selectSeries.seriesData.ExData.ThinOut;
            }
        }

        // コマンド処理
        Tool_ThinOut.Command(mode, command, null, true);
    },
    // コマンド
    Command: function (mode, command, series, cancel) {
        var isSeries = true;
        if (series == null) {
            // 選択シリーズ取得
            series = viewer.getSelectSeries();
            if (series == null ||
                series.seriesData == null ||
                series.seriesData.SopDatas.length <= series.seriesData.SopIndex ||
                series.seriesData.SopDatas[series.seriesData.SopIndex] == null) {
                isSeries = false;
            }
        }

        // シリーズがある場合
        if (isSeries) {
            // 間引きモードの場合
            if (mode == "1") {
                // 間引ける場合
                if (command < series.seriesData.BaseSopDatas.length) {
                    // 間引き設定
                    series.seriesData.thinOut(command, cancel);
                    series.seriesData.ExData.ThinOutMode = "1";
                    series.seriesData.ExData.ThinOut = command;

                    // Cookie設定
                    if (Tool_ThinOut.IsCookie) {
                        Tool_ThinOut.SetCookie(series.seriesData.ExData.Modality, "1", command);
                    }
                }
            }
            // シリーズキャッシュモードの場合
            else {
                // 間引き解除
                series.seriesData.thinOut(-1, cancel);

                // 全表示の場合
                if (mode == "2" || command >= series.seriesData.BaseSopDatas.length) {
                    series.seriesData.SeriesCacheCount = -1;
                    series.seriesData.ExData.ThinOutMode = "2";
                }
                // 一部表示の場合
                else {
                    series.seriesData.SeriesCacheCount = command;
                    series.seriesData.ExData.ThinOutMode = "0";
                }

                // Cookie設定
                if (Tool_ThinOut.IsCookie) {
                    Tool_ThinOut.SetCookie(series.seriesData.ExData.Modality, series.seriesData.ExData.ThinOutMode, series.seriesData.ExData.ThinOut);
                }
            }

            // シリーズパネル更新
            Tool_ThinOut.PanelUpdate(series);
        }

        // 更新処理
        Tool_ThinOut.Update();
    },
    // 更新
    Update: function () {
        var $item, $group;
        var selectSeries = viewer.getSelectSeries();
        if (selectSeries == null ||
            selectSeries.seriesData == null) {
            // メニューから取得
            if (Tool_ThinOut.Mode("") == "1") {
                // 間引きアイコンに更新
                $("#Tool-ThinOut").removeClass("Tool-ThinOut-Disabled-Part-OFF Tool-ThinOut-Disabled-Part-ON Tool-ThinOut-Disabled-All-OFF Tool-ThinOut-Disabled-All-ON Tool-ThinOut-Enabled-ON").addClass("Tool-ThinOut-Enabled-OFF");
                $("#Tool-ThinOut-Disabled").hide();
                $("#Tool-ThinOut-Enabled").text(Tool_ThinOut.Default("")).show();

                // プルダウンメニュー選択クリア
                $item = $("#Tool-ThinOut-Side-Sub-Enabled .Tool-ThinOut-Side-Sub-Item");
                $item.removeClass("Tool-ThinOut-Side-Sub-Item-Select");

                // プルダウングループ再設定
                $group = $("#Tool-ThinOut-Side-Sub-Enabled .Tool-ThinOut-Side-Sub-Group");
                $group.hide();
                for (var i = 0; i < $group.length; i++) {
                    if ($group.eq(i).data("modality") == "") {
                        $group.eq(i).show();
                        break;
                    }
                }

                // プルダウンメニュー選択再設定
                $item = $group.eq(i).children();
                $item.each(function () {
                    if ($(this).data("command") == Tool_ThinOut.Default("")) {
                        $(this).addClass("Tool-ThinOut-Side-Sub-Item-Select");
                        return false;
                    }
                });
            }
            else if (Tool_ThinOut.Mode("") == "2") {
                // 全部アイコンに更新
                $("#Tool-ThinOut").removeClass("Tool-ThinOut-Enabled-OFF Tool-ThinOut-Enabled-ON Tool-ThinOut-Disabled-Part-OFF Tool-ThinOut-Disabled-Part-ON Tool-ThinOut-Disabled-All-ON").addClass("Tool-ThinOut-Disabled-All-OFF");
                $("#Tool-ThinOut-Enabled").hide();
                $("#Tool-ThinOut-Disabled").show();

                // プルダウンメニュー選択クリア
                $item = $("#Tool-ThinOut-Side-Sub-Disabled .Tool-ThinOut-Side-Sub-Item");
                $item.removeClass("Tool-ThinOut-Side-Sub-Item-Select");

                // プルダウンメニュー選択再設定
                $item.eq(1).addClass("Tool-ThinOut-Side-Sub-Item-Select");
            }
            else {
                // 一部アイコンに更新
                $("#Tool-ThinOut").removeClass("Tool-ThinOut-Enabled-OFF Tool-ThinOut-Enabled-ON Tool-ThinOut-Disabled-All-OFF Tool-ThinOut-Disabled-All-ON Tool-ThinOut-Disabled-Part-ON").addClass("Tool-ThinOut-Disabled-Part-OFF");
                $("#Tool-ThinOut-Enabled").hide();
                $("#Tool-ThinOut-Disabled").show();

                // プルダウンメニュー選択クリア
                $item = $("#Tool-ThinOut-Side-Sub-Disabled .Tool-ThinOut-Side-Sub-Item");
                $item.removeClass("Tool-ThinOut-Side-Sub-Item-Select");

                // プルダウンメニュー選択再設定
                $item.eq(0).addClass("Tool-ThinOut-Side-Sub-Item-Select");
            }
        }
        else {
            // シリーズから取得
            if (selectSeries.seriesData.SopDatas.length == selectSeries.seriesData.BaseSopDatas.length) {
                if (selectSeries.seriesData.SeriesCacheCount == -1) {
                    // 全部アイコンに更新
                    $("#Tool-ThinOut").removeClass("Tool-ThinOut-Enabled-OFF Tool-ThinOut-Enabled-ON Tool-ThinOut-Disabled-Part-OFF Tool-ThinOut-Disabled-Part-ON Tool-ThinOut-Disabled-All-ON").addClass("Tool-ThinOut-Disabled-All-OFF");
                    $("#Tool-ThinOut-Enabled").hide();
                    $("#Tool-ThinOut-Disabled").text("").show();

                    // プルダウンメニュー選択クリア
                    $item = $("#Tool-ThinOut-Side-Sub-Disabled .Tool-ThinOut-Side-Sub-Item");
                    $item.removeClass("Tool-ThinOut-Side-Sub-Item-Select");

                    // プルダウンメニュー選択再設定
                    $item.eq(1).addClass("Tool-ThinOut-Side-Sub-Item-Select");
                }
                else {
                    // 一部アイコンに更新
                    $("#Tool-ThinOut").removeClass("Tool-ThinOut-Enabled-OFF Tool-ThinOut-Enabled-ON Tool-ThinOut-Disabled-All-OFF Tool-ThinOut-Disabled-All-ON Tool-ThinOut-Disabled-Part-ON").addClass("Tool-ThinOut-Disabled-Part-OFF");
                    $("#Tool-ThinOut-Enabled").hide();
                    $("#Tool-ThinOut-Disabled").text("").show();

                    // プルダウンメニュー選択クリア
                    $item = $("#Tool-ThinOut-Side-Sub-Disabled .Tool-ThinOut-Side-Sub-Item");
                    $item.removeClass("Tool-ThinOut-Side-Sub-Item-Select");

                    // プルダウンメニュー選択再設定
                    $item.eq(0).addClass("Tool-ThinOut-Side-Sub-Item-Select");
                }
            }
            else {
                // 間引きアイコンに更新
                $("#Tool-ThinOut").removeClass("Tool-ThinOut-Disabled-Part-OFF Tool-ThinOut-Disabled-Part-ON Tool-ThinOut-Disabled-All-OFF Tool-ThinOut-Disabled-All-ON Tool-ThinOut-Enabled-ON").addClass("Tool-ThinOut-Enabled-OFF");
                $("#Tool-ThinOut-Disabled").hide();
                $("#Tool-ThinOut-Enabled").text(selectSeries.seriesData.ExData.ThinOut).show();

                // プルダウンメニュー選択クリア
                $item = $("#Tool-ThinOut-Side-Sub-Enabled .Tool-ThinOut-Side-Sub-Item");
                $item.removeClass("Tool-ThinOut-Side-Sub-Item-Select");

                // 該当モダリティ取得
                var mod = "";
                if (selectSeries.seriesData.ExData.Modality in Tool_ThinOut.Modality) {
                    mod = selectSeries.seriesData.ExData.Modality;
                }

                // プルダウングループ再設定
                $group = $("#Tool-ThinOut-Side-Sub-Enabled .Tool-ThinOut-Side-Sub-Group");
                $group.hide();
                for (var i = 0; i < $group.length; i++) {
                    if ($group.eq(i).data("modality") == mod) {
                        $group.eq(i).show();
                        break;
                    }
                }

                // プルダウンメニュー選択再設定
                $item = $group.eq(i).children();
                $item.each(function () {
                    if ($(this).data("command") == selectSeries.seriesData.ExData.ThinOut) {
                        $(this).addClass("Tool-ThinOut-Side-Sub-Item-Select");
                        return false;
                    }
                });
            }
        }
    },
    // サイドメニュークリック
    SideClick: function () {
        // 未選択状態の場合
        if ($("#Tool-ThinOut-Side").hasClass("Tool-ThinOut-Side-OFF")) {
            Tool_ThinOut.SideCommand(true);
        }
        else {
            Tool_ThinOut.SideCommand(false);
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
            $("#Tool-ThinOut-Side").removeClass("Tool-ThinOut-Side-OFF").addClass("Tool-ThinOut-Side-ON");

            // 表示するメニューを変更
            if ($("#Tool-ThinOut-Enabled").is(":visible")) {
                $("#Tool-ThinOut-Side-Sub-Disabled").hide();
                $("#Tool-ThinOut-Side-Sub-Enabled").show();
            }
            else {
                $("#Tool-ThinOut-Side-Sub-Enabled").hide();
                $("#Tool-ThinOut-Side-Sub-Disabled").show();
            }

            // サブメニュー表示位置補正表示
            var offset = $("#Tool-ThinOut-Side").offset();
            var width = $("#Tool-ThinOut-Side-Sub").width() - $("#Tool-ThinOut-Side").width();
            $("#Tool-ThinOut-Side-Sub").css({ left: offset.left - width, top: offset.top + 48 }).show();
        }
        else {
            // Viewerのイベントを元に戻す
            viewer.IsEnable = true;

            // アイコン変更
            $("#Tool-ThinOut-Side").removeClass("Tool-ThinOut-Side-ON").addClass("Tool-ThinOut-Side-OFF");
            $("#Tool-ThinOut-Side-Sub").hide();
        }
    },
    // シリーズパネル更新
    PanelUpdate: function (series) {
        // データチェック
        if (series == null ||
            series.seriesData == null) {
            return;
        }

        // パネル取得
        var $panel;
        var $work = $(series.Element).children(".SeriesWorkPanel").children();
        if ($work.is(".SeriesTopCenterPanel")) {
            $panel = $work.filter(".SeriesTopCenterPanel");
        }
        else {
            $panel = $("<div>").addClass("SeriesTopCenterPanel");
            $work.filter(".SeriesSyncPanel").before($panel);
        }
        var $panel2;
        var $work2 = $panel.children();
        if ($work2.is(".ThinOutPanel")) {
            $panel2 = $work2.filter(".ThinOutPanel");
        }
        else {
            $panel2 = $("<div>").addClass("ThinOutPanel").append($("<span>"));
            $panel.prepend($panel2);
        }

        // パネル更新
        if (series.seriesData.SopDatas.length == series.seriesData.BaseSopDatas.length) {
            $panel2.hide();
        }
        else {
            $panel2.children().text("間引き表示中 " + (series.SopPanels[0].sopData.SopIndex + 1) + "/" + series.seriesData.BaseSopDatas.length);
            $panel2.show();
        }
    }
}
