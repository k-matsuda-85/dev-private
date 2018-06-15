/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
// シリーズ更新チェック用
var PreSelectSeries = {
    Index: -1,
    SeriesKey: null,
    IsUpdate: false,
    Series: null
};

// GSPS管理用
var GSPSList = {
    item: {},
    Add: function (SeriesKey, GSPS) {
        for (i in GSPS) {
            GSPS[i].Items = null;
        }
        this.item[SeriesKey] = GSPS;
    },
    Get: function (SeriesKey) {
        if (SeriesKey in this.item) {
            return this.item[SeriesKey];
        }
        else {
            return null;
        }
    },
    GetDataList: function (SeriesKey, index, obj, func) {
        var gsps = this.Get(SeriesKey);
        if (gsps == null || gsps[index] == null) {
            return;
        }

        // 未取得の場合
        if (gsps[index].Items == null) {
            var req = {};
            req.SeriesKey = SeriesKey;
            req.index = index;
            req.obj = obj;
            req.func = func;

            // GSPSデータ取得
            Viewer_GetGspsDataList(gsps[index].GSPSKey, req, function (result, _req) {
                // データ更新
                var _gsps = GSPSList.Get(_req.SeriesKey);
                if (_gsps == null || _gsps[_req.index] == null || result.d.Items.length == 0) {
                    return;
                }

                // jsonデータを変換して登録
                for (i in result.d.Items) {
                    for (j in result.d.Items[i]) {
                        try {
                            var obj = $.parseJSON(result.d.Items[i][j]);
                            result.d.Items[i][j] = obj;
                        }
                        catch (e) {
                            result.d.Items[i][j] = null;
                        }
                    }
                }
                _gsps[_req.index].Items = result.d.Items;

                // コールバック呼び出し
                _req.func(_req.obj);
            });
        }
        else {
            // 取得済みのため呼び出し
            setTimeout(function () {
                func(obj);
            }, 0);
        }
    },
    GetData: function (SeriesKey, index, ImageKey) {
        var gsps = this.Get(SeriesKey);
        if (gsps == null || gsps[index] == null || gsps[index].Items == null || !gsps[index].Items[ImageKey]) {
            return null;
        }
        return gsps[index].Items[ImageKey];
    }
};

//シリーズ目視確認用
var SeriesCountCheck = {
    Color: null,
    IsUpdate: false,
    Series: {},
    SetSeriesKey: function (SeriesKey, Count) {
        if (this.Color == null) {
            return;
        }
        if (!(SeriesKey in this.Series)) {
            this.Series[SeriesKey] = {};
            this.Series[SeriesKey].View = 0;
            this.Series[SeriesKey].ImageCount = 0;
            this.Series[SeriesKey].ImageList = [];
        }
        this.Series[SeriesKey].Count = Count;
    },
    SetImageKey: function (SeriesKey, ImageKey) {
        if (this.Color == null) {
            return;
        }
        var oldView = this.Series[SeriesKey].View;
        if (!(ImageKey in this.Series[SeriesKey].ImageList)) {
            this.Series[SeriesKey].ImageList[ImageKey] = true;
            this.Series[SeriesKey].ImageCount++;
        }
        if (this.Series[SeriesKey].ImageCount == 0) {
            this.Series[SeriesKey].View = 0;
        }
        else if (this.Series[SeriesKey].ImageCount < this.Series[SeriesKey].Count / 2) {
            this.Series[SeriesKey].View = 1;
        }
        else if (this.Series[SeriesKey].ImageCount < this.Series[SeriesKey].Count) {
            this.Series[SeriesKey].View = 2;
        }
        else {
            this.Series[SeriesKey].View = 3;
        }
        if (this.Series[SeriesKey].View != oldView) {
            this.IsUpdate = true;
        }
    },
    UpdateThumbnail: function () {
        if (this.Color == null) {
            return;
        }
        if (!this.IsUpdate) {
            return;
        }
        var $items = $("#SeriesList .SeriesList-Item:visible");
        $items.each(function () {
            $(this).children(".SeriesList-Item-SeriesNumber").css("color", SeriesCountCheck.Color[SeriesCountCheck.Series[$(this).data("SeriesKey")].View]);
        });
        this.IsUpdate = false;
    }
};

// シリーズ入れ替え用
var SeriesSwap = {
    SeriesIndex: null,
    OffsetX: Number.NaN,
    OffsetY: Number.NaN,
    SetPanel: function (series) {
        // シリーズ入れ替えパネルの初期化
        $(series.Element).find(".SeriesWorkPanel .SeriesSwapPanel").remove();

        // データチェック
        if (series == null || series.seriesData == null) {
            return;
        }

        // シリーズ入れ替えパネルを追加
        $(series.Element).find(".SeriesWorkPanel .SeriesSyncPanel").before($("<div>").addClass("SeriesSwapPanel"));
    },
    Drag: function (x, y) {
        // パネル取得
        var offset = $("#ViewerLib").offset();
        var wnd = viewer.getSeriesPanelFromPoint(x - offset.left, y - offset.top);
        if (wnd == null) {
            return;
        }

        // Viewerのイベントを一時的に停止する
        viewer.IsEnable = false;

        // ドラッグ中描画開始
        $("#DragDropItem").css({ left: x - 32, top: y - 56 }).show();

        // データ初期化
        this.SeriesIndex = wnd.SeriesIndex;
        this.OffsetX = x;
        this.OffsetY = y;
    },
    Move: function (x, y) {
        // ドラッグ情報更新
        $("#DragDropItem").css({ left: x - 32, top: y - 56 });
        this.OffsetX = x;
        this.OffsetY = y;
    },
    Drop: function () {
        // ドラッグ中描画解除
        $("#DragDropItem").hide();

        // Viewerのイベントを元に戻す
        viewer.IsEnable = true;

        // 範囲チェック
        var offset = $("#ViewerLib").offset();
        var width = $("#ViewerLib").width();
        var height = $("#ViewerLib").height();
        if (isNaN(this.OffsetX) || isNaN(this.OffsetY)) {
            return;
        }
        if (this.OffsetX < offset.left || this.OffsetX > offset.left + width) {
            return;
        }
        if (this.OffsetY < offset.top || this.OffsetY > offset.top + height) {
            return;
        }

        // パネル取得
        var wnd = viewer.getSeriesPanelFromPoint(this.OffsetX - offset.left, this.OffsetY - offset.top);
        if (wnd == null || wnd.SeriesIndex == this.SeriesIndex) {
            return;
        }
        if ($(wnd.Element).children().hasClass("SeriesLoading")) {
            return;
        }

        // シリーズ入れ替え
        viewer.viewerData.swapSeriesData(this.SeriesIndex, wnd.SeriesIndex);
    }
};

// シリーズコントロール用クラス
function SeriesControlQueue(studyKey, seriesKey, modality, imageKeys) {
    this.StudyKey = studyKey;
    this.SeriesKey = seriesKey;
    this.Modality = modality;
    this.ImageKeys = imageKeys;
    this.Index = 0;
    this.PointX = null;
    this.PointY = null;
}

// 初期化処理
function ViewerSeriesList_Init() {
    // 画像表示部イベント設定
    $("#ViewerLib").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合何もしない
            if (e.originalEvent.touches.length != 1) {
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
                    // 現在時刻取得
                    var now = new Date().getTime();

                    // クリック判定
                    if ($this.data("dblClick") == undefined || $this.data("dblClick") < now) {
                        // ダブルクリック時間登録
                        $this.data("dblClick", now + 300);
                    }
                    // ダブルクリック判定
                    else {
                        // 全画面表示処理
                        ViewerSeriesList_FullScreen($this, e);

                        // ダブルクリック時間削除
                        $this.removeData("dblClick");
                    }
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

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
                    // 現在時刻取得
                    var now = new Date().getTime();

                    // クリック判定
                    if ($this.data("dblClick") == undefined || $this.data("dblClick") < now) {
                        // ダブルクリック時間登録
                        $this.data("dblClick", now + 300);
                    }
                    // ダブルクリック判定
                    else {
                        // 全画面表示処理
                        ViewerSeriesList_FullScreen($this, e);

                        // ダブルクリック時間削除
                        $this.removeData("dblClick");
                    }
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // ダブルクリックイベント設定
        "dblclick": function (e) {
            var $this = $(this);

            // IE8以下ではダブルクリック時のmousedownが発生しないため代用
            var ieVer = $("#ViewerConfig").data("IEVersion");
            if (ieVer && ieVer <= 8) {
                // 全画面表示処理
                ViewerSeriesList_FullScreen($this, e);

                // ダブルクリック時間削除
                $this.removeData("dblClick");
            }
        },
        // マウス位置取得用イベント設定
        "mousemove mouseup mouseout": function (e) {
            // 移動中のみ有効
            if (e.type == "mousemove") {
                $("#ViewerLib").data("MouseMove", e);
            }
            else {
                $("#ViewerLib").data("MouseMove", null);
            }
        }
    });

    // シリーズ入れ替え部イベント設定
    $("#ViewerLib").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合何もしない
            if (e.originalEvent.touches.length != 1) {
                return;
            }

            // イベントを停止
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // ドラッグ開始
            SeriesSwap.Drag(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 位置情報更新
                    SeriesSwap.Move(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    return;
                }

                // ドロップ処理
                SeriesSwap.Drop();

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // イベントを停止
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // ドラッグ開始
            SeriesSwap.Drag(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 位置情報更新
                    SeriesSwap.Move(e.pageX, e.pageY);
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // ドロップ処理
                SeriesSwap.Drop();

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SeriesSwapPanel");

    // 縦スクロールバー制御イベント設定
    $("#SeriesList").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // スクロールバー表示位置は対象外
            var sbWidth = $("#ViewerConfig").data("ScrollBarWidth");
            var thisOffset = $this.offset();
            if (($this.width() + thisOffset.left - sbWidth <= e.originalEvent.touches[0].pageX) ||
                ($this.height() + thisOffset.top - sbWidth <= e.originalEvent.touches[0].pageY)) {
                return;
            }

            // 発生元が異なる場合は対象外
            if (!$(e.target).is("#SeriesList")) {
                return;
            }

            // 初期タッチ位置登録
            var startY = e.originalEvent.touches[0].pageY;

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offsetY = e.originalEvent.touches[0].pageY - startY;

                    // タッチ位置更新
                    startY = e.originalEvent.touches[0].pageY;

                    // 縦スクロールを反映
                    $("#SeriesList").scrollTop($("#SeriesList").scrollTop() - offsetY);
                    return;
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // スクロールバー表示位置は対象外
            var sbWidth = $("#ViewerConfig").data("ScrollBarWidth");
            var thisOffset = $this.offset();
            if (($this.width() + thisOffset.left - sbWidth <= e.pageX) ||
                ($this.height() + thisOffset.top - sbWidth <= e.pageY)) {
                return;
            }

            // 発生元が異なる場合は対象外
            if (!$(e.target).is("#SeriesList")) {
                return;
            }

            // 初期マウス位置登録
            var pointY = e.pageY;

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offsetY = e.pageY - pointY;

                    // マウス位置更新
                    pointY = e.pageY;

                    // 縦スクロールを反映
                    $("#SeriesList").scrollTop($("#SeriesList").scrollTop() - offsetY);
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
        }
    });

    // サムネイルイベント設定
    $("#SeriesList").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // シリーズ選択開始処理
            var ctrl = new SeriesControlQueue($this.parent().data("StudyKey"), $this.data("SeriesKey"), $this.data("Modality"), $this.data("ImageKeys"));
            ViewerSeriesList_Select_Start(ctrl);

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // シリーズ選択移動処理
                    ViewerSeriesList_Select_Move(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

                    // 位置情報更新
                    pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // 現在時刻取得
                    var now = new Date().getTime();

                    // クリック判定
                    if ($this.data("dblClick") == undefined || $this.data("dblClick") < now) {
                        // ダブルクリック時間登録
                        $this.data("dblClick", now + 300);
                    }
                    // ダブルクリック判定
                    else {
                        //シリーズ入れ替え表示
                        ViewerSeriesList_ShowAllSeries($this);

                        // ダブルクリック時間削除
                        $this.removeData("dblClick");
                    }
                }

                // シリーズ選択確定処理
                ViewerSeriesList_Select_Fix();

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // シリーズ選択開始処理
            var ctrl = new SeriesControlQueue($this.parent().data("StudyKey"), $this.data("SeriesKey"), $this.data("Modality"), $this.data("ImageKeys"));
            ViewerSeriesList_Select_Start(ctrl);

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // シリーズ選択移動処理
                    ViewerSeriesList_Select_Move(e.pageX, e.pageY);

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
                    // 現在時刻取得
                    var now = new Date().getTime();

                    // クリック判定
                    if ($this.data("dblClick") == undefined || $this.data("dblClick") < now) {
                        // ダブルクリック時間登録
                        $this.data("dblClick", now + 300);
                    }
                    // ダブルクリック判定
                    else {
                        //シリーズ入れ替え表示
                        ViewerSeriesList_ShowAllSeries($this);

                        // ダブルクリック時間削除
                        $this.removeData("dblClick");
                    }
                }

                // シリーズ選択確定処理
                ViewerSeriesList_Select_Fix();

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // ダブルクリックイベント設定
        "dblclick": function () {
            var $this = $(this);

            // IE8以下ではダブルクリック時のmousedownが発生しないため代用
            var ieVer = $("#ViewerConfig").data("IEVersion");
            if (ieVer && ieVer <= 8) {
                //シリーズ入れ替え表示
                ViewerSeriesList_ShowAllSeries($this);

                // ダブルクリック時間削除
                $this.removeData("dblClick");
            }
        }
    }, ".SeriesList-Item");

    // Viewerイベント登録
    ViewerUtil.Events.onSelectSeriesEvents.push(ViewerSeriesList_SelectSeriesProc);
    ViewerUtil.Events.onSelectSopEvents.push(ViewerSeriesList_SelectSopProc);
    ViewerUtil.Events.onLoadSeriesEvents.push(ViewerSeriesList_LoadSeriesProc);
    ViewerUtil.Events.onLoadSopEvents.push(ViewerSeriesList_LoadSopProc);
    ViewerUtil.Events.onTickSopEvents.push(ViewerSeriesList_TickSopProc);
    ViewerUtil.Events.onDrawEndEvents.push(ViewerSeriesList_DrawEndProc);
    ViewerUtil.Events.onInitSopEvents.push(ViewerSeriesList_InitSopProc);

    // カットライン設定
    var $ActiveColor = $("<div>").addClass("CutlineActiveColor").hide();
    var $DefaultColor = $("<div>").addClass("CutlineDefaultColor").hide();
    $("body").append($ActiveColor).append($DefaultColor);
    ViewerUtil.Cutline.ActiveColor = $ActiveColor.css("background-color");
    ViewerUtil.Cutline.DefaultColor = $DefaultColor.css("background-color");
    $ActiveColor.remove();
    $DefaultColor.remove();

    // Viewerスクロールバー設定
    var $BaseColor = $("<div>").addClass("ScrollBarBaseColor").hide();
    var $BaseColorThinOut = $("<div>").addClass("ScrollBarBaseColorThinOut").hide();
    var $OnCacheColor = $("<div>").addClass("ScrollBarOnCacheColor").hide();
    var $OnCacheColorThinOut = $("<div>").addClass("ScrollBarOnCacheColorThinOut").hide();
    var $DispColor = $("<div>").addClass("ScrollBarDispColor").hide();
    var $DispColorThinOut = $("<div>").addClass("ScrollBarDispColorThinOut").hide();
    $("body").append($BaseColor).append($BaseColorThinOut).append($OnCacheColor).append($OnCacheColorThinOut).append($DispColor).append($DispColorThinOut);
    ViewerUtil.ScrollBar.BaseColor = $BaseColor.css("background-color");
    ViewerUtil.ScrollBar.BaseColorThinOut = $BaseColorThinOut.css("background-color");
    ViewerUtil.ScrollBar.OnCacheColor = $OnCacheColor.css("background-color");
    ViewerUtil.ScrollBar.OnCacheColorThinOut = $OnCacheColorThinOut.css("background-color");
    ViewerUtil.ScrollBar.DispColor = $DispColor.css("background-color");
    ViewerUtil.ScrollBar.DispColorThinOut = $DispColorThinOut.css("background-color");
    $BaseColor.remove();
    $BaseColorThinOut.remove();
    $OnCacheColor.remove();
    $OnCacheColorThinOut.remove();
    $DispColor.remove();
    $DispColorThinOut.remove();

    // PR設定
    var $PRText = $("<div>").addClass("PRText").hide();
    var $PRLine = $("<div>").addClass("PRLine").hide();
    $("body").append($PRText).append($PRLine);
    ViewerUtil.PR.Font = $PRText.css("font-style") + " " + $PRText.css("font-weight") + " " + $PRText.css("font-size") + " " + $PRText.css("font-family");
    ViewerUtil.PR.TextColor = $PRText.css("color");
    ViewerUtil.PR.LineWidth = $PRLine.width();
    ViewerUtil.PR.LineColor = $PRLine.css("color");
    $PRText.remove();
    $PRLine.remove();

    // SeriesPanelの拡張
    var base = SeriesPanel.prototype.onInit;
    SeriesPanel.prototype.onInit = function () {
        base.call(this);
        $(this.Element).children(".SeriesLoading").remove();
        $(this.Element).find(".SeriesWorkPanel .StudyList-Panel").remove();
        $(this.Element).find(".SeriesWorkPanel .SeriesTopCenterPanel").remove();
        $(this.Element).find(".SeriesWorkPanel .SeriesSwapPanel").remove();

        // 表示検査パネル更新
        ViewerStudyList_Panel_Update();
    };

    // シリーズキャッシュ設定
    var maxSeriesCache = parseInt($("#ViewerConfig").data("MaxSeriesCache"));
    if (!isNaN(maxSeriesCache)) {
        ViewerUtil.SeriesCacheCount = maxSeriesCache;
    }

    // 事前画像読み込みタイプ設定
    if ($("#ViewerConfig").data("PreLoadType") == "1") {
        ViewerUtil.PreLoadType = "Both";
    }

    // 事前画像読み込み枚数設定
    var preLoadCount = parseInt($("#ViewerConfig").data("PreLoadCount"));
    if (!isNaN(preLoadCount)) {
        ViewerUtil.PreLoadCount = preLoadCount;
    }

    // 画像送りループ設定
    if ($("#ViewerConfig").data("SkipImageLoop") == "1") {
        ViewerUtil.isLoop = true;
    }

    // Image情報取得用関数設定
    ViewerUtil.GetImageInfo = Viewer_GetImageInfo;

    // 画像送りキャッシュ有無設定
    ViewerUtil.AutoCacheLevel = 0;

    // デスクトップの場合
    if (Common_IsDesktop()) {
        // 描画処理周期を100msに変更
        ViewerUtil.TickTime = 100;
    }

    // 画像同時読み込み数変更
    //ImageLoader.MaxLodingCount = 1;

    // シリーズ目視確認設定
    if ($("#ViewerConfig").data("SeriesCountCheckColor") != "") {
        SeriesCountCheck.Color = $("#ViewerConfig").data("SeriesCountCheckColor");
    }

    // パラメータ初期化
    $("#SeriesList").data("studykey", $("#ViewerConfig").data("studykey"));
    $("#SeriesList").data("serieskey", $("#ViewerConfig").data("serieskey"));

    // 初期表示パラメータ初期化
    $("#SeriesList").data("FirstStudyKey", null);

    // シリーズコントロール初期化
    $("#SeriesList").data("SeriesControlQueue", new Array());

    // 事前画像取得初期化
    $("#SeriesList").data("PrefetchSeriesList", new Array());
    $("#SeriesList").data("PrefetchImageList", new Array());
    $("#SeriesList").data("SendPrefetchImage", false);
    $("#SeriesList").data("LastPrefetchTime", new Date().getTime());
}

// シリーズ一覧取得済確認
function ViewerSeriesList_Check($this) {
    // 選択検査取得
    var select = $this.data("StudyKey");

    // 取得済チェック
    var $select = null;
    $("#SeriesList .SeriesList-Group").each(function () {
        var tmp = $(this).data("StudyKey");
        if (tmp != select) {
            return true;
        }
        $select = $(this);
        return false;
    });
    return $select;
}

// シリーズ一覧変更
function ViewerSeriesList_Change($this, pass) {
    // 全非表示
    $("#SeriesList .SeriesList-Group").hide();

    // シリーズ一覧取得済確認
    var $select = ViewerSeriesList_Check($this);
    if ($select != null) {
        // 一致(取得済み)のため表示
        $select.show();

        // デスクトップ以外の場合
        if (!Common_IsDesktop()) {
            // 強制リサイズを行い描画を促す
            var wk_left = $("#SeriesList").offset().left;
            ViewerWindow_Separator_Side_Resize(wk_left - 1);
            ViewerWindow_Separator_Side_Resize(wk_left);
        }

        // 取得済みのため終了
        return;
    }

    // シリーズ一覧取得
    Viewer_GetSeriesList(
        $this.data("StudyKey"),
        pass,
        $this,
        ViewerSeriesList_GetSeriesList_Result
    ); // 取得後「シリーズ一覧取得結果」呼び出し
}

// シリーズ一覧取得結果
function ViewerSeriesList_GetSeriesList_Result(result, $this) {
    // キャンセルされた場合
    if (result.d.IsCancel == true) {
        return;
    }

    // パスワード不一致の場合
    if (result.d.Result == "Error") {
        alert("パスワードが違います。");

        // 検査選択解除処理
        ViewerStudyList_Select_Remove();
        return;
    }

    // データなし
    if (result.d.Tags.length == 0) {
        return;
    }

    // シリーズ一覧取得済確認
    var $select = ViewerSeriesList_Check($this);
    if ($select != null) {
        // 一致(取得済み)のため表示
        $select.show();

        // デスクトップ以外の場合
        if (!Common_IsDesktop()) {
            // 強制リサイズを行い描画を促す
            var wk_left = $("#SeriesList").offset().left;
            ViewerWindow_Separator_Side_Resize(wk_left - 1);
            ViewerWindow_Separator_Side_Resize(wk_left);
        }

        // 取得済みのため終了
        return;
    }

    // シリーズ一覧設定
    ViewerSeriesList_SetSeriesList(
        $this.data("StudyKey"),
        result.d.Tags,
        null
    );
}

// シリーズ一覧設定
function ViewerSeriesList_SetSeriesList(StudyKey, Tags, SeriesKey) {
    // シリーズ一覧確認
    var $selectSeries = null;
    $("#SeriesList .SeriesList-Item").each(function () {
        if ($(this).data("SeriesKey") == SeriesKey) {
            //対象のシリーズを保持
            $selectSeries = $(this);
            return false;
        }
    });

    // 要素を作成
    var rows = new Array();
    var seriesKeys = new Array();
    var sk = $("#ViewerConfig").data("sk");
    $.each(Tags, function () {
        // シリーズ表示方法毎に設定
        var row = $("<div>").addClass("SeriesList-Item SeriesList-Item-Content SeriesList-Item-OFF").data("SeriesKey", this.SeriesKey).data("Modality", this.Modality).data("ImageKeys", this.ImageKey)
            .append($("<div>").addClass("SeriesList-Item-NowLoading"))
            .append($("<div>").addClass("SeriesList-Item-Thumbnail"))
            .append($("<div>").addClass("SeriesList-Item-NumberOf").text((this.NumberOfImages < this.NumberOfFrames) ? this.NumberOfFrames : this.NumberOfImages)
                .append($("<span>").text((this.NumberOfImages < this.NumberOfFrames) ? " fr" : " im")))
            .append($("<div>").addClass("SeriesList-Item-SeriesDescription").text(this.SeriesDescription))
            .append($("<span>").addClass("SeriesList-Item-SeriesNumber").text(this.SeriesNumber));
        if (this.IsGSPS) {
            row.append($("<span>").addClass("SeriesList-Item-IsGSPS").text("PR"));

            // GSPS管理用に登録
            GSPSList.Add(this.SeriesKey, this.GSPS);
        }
        if (this.ImageKey) {
            row.children(".SeriesList-Item-Thumbnail").css("backgroundImage", "url(./GetThumbnail.aspx?sk=" + sk + "&im=1&key=" + this.ImageKey[0] + ")");
        }
        else {
            row.children(".SeriesList-Item-Thumbnail").css("backgroundImage", "url(./GetThumbnail.aspx?sk=" + sk + "&key=" + this.SeriesKey + ")");
        }
        rows.push(row);

        // 事前画像取得登録用に追加
        seriesKeys.push(this.SeriesKey);

        // シリーズ目視確認用にSeriesKeyを設定
        SeriesCountCheck.SetSeriesKey(this.SeriesKey, (this.NumberOfImages < this.NumberOfFrames) ? this.NumberOfFrames : this.NumberOfImages);
    });

    // 新規作成か確認
    if ($selectSeries == null) {
        // Groupを新規作成
        var rowG = $("<div>").addClass("SeriesList-Group").data("StudyKey", StudyKey);
        $.each(rows, function () {
            rowG.append(this);
        });
        $("#SeriesList").append(rowG);
    }
    else {
        // 対象シリーズの前に追加
        $.each(rows, function () {
            $selectSeries.before(this);
        });

        // 対象シリーズを削除
        $selectSeries.remove();
    }

    // 検査情報取得処理
    var studyMod = ViewerStudyList_GetStudyInfo(StudyKey, "Modality");

    // モダリティ毎のシリーズ表示方法取得
    var sPanel = Viewer_GetModalityConfigVal(studyMod, "SeriesPanel");

    // シリーズ一覧表示変更処理
    ViewerSeriesList_SeriesPanel_Change(StudyKey, sPanel);

    // デスクトップ以外の場合
    if (!Common_IsDesktop()) {
        // 強制リサイズを行い描画を促す
        var wk_left = $("#SeriesList").offset().left;
        ViewerWindow_Separator_Side_Resize(wk_left - 1);
        ViewerWindow_Separator_Side_Resize(wk_left);
    }

    // パラメータ取得
    var studykey = $("#SeriesList").data("studykey");
    var serieskey = $("#SeriesList").data("serieskey");

    // シリーズ選択チェック
    var $seriesObj;
    if (serieskey != "") {
        $("#SeriesList .SeriesList-Item").each(function () {
            $seriesObj = $(this);
            if ($seriesObj.data("SeriesKey") == serieskey) {
                // モダリティ毎のシリーズ分割取得
                var sSplit = Viewer_GetModalityConfigVal($seriesObj.data("Modality"), "SeriesSplit").split(",");
                if (sSplit.length >= 2 && !isNaN(parseInt(sSplit[0])) && !isNaN(parseInt(sSplit[1]))) {
                    // シリーズ分割設定
                    viewer.split(parseInt(sSplit[1]), parseInt(sSplit[0]));
                }

                // モダリティ毎のカットライン設定
                if (Tool_Cutline.Enabled) {
                    $.each($("#ViewerConfig").data("ScoutLine").split(","), function () {
                        if (this.toString() == $seriesObj.data("Modality")) {
                            Tool_Cutline.Command(true);
                            return false;
                        }
                    });
                }

                // 事前画像取得登録処理
                ViewerSeriesList_SetPrefetchSeriesList(seriesKeys);

                // 遅延呼び出し
                viewer.invoke(function () {
                    // シリーズ入れ替え表示
                    ViewerSeriesList_ShowAllSeries($seriesObj);
                });
                return false;
            }
        });
    }
    // 検査選択チェック
    else if (studykey != "") {
        $seriesObj = $("#SeriesList .SeriesList-Item:first-child");

        // モダリティ毎のシリーズ分割取得
        var sSplit = Viewer_GetModalityConfigVal($seriesObj.data("Modality"), "SeriesSplit").split(",");
        if (sSplit.length >= 2 && !isNaN(parseInt(sSplit[0])) && !isNaN(parseInt(sSplit[1]))) {
            // シリーズ分割設定
            viewer.split(parseInt(sSplit[1]), parseInt(sSplit[0]));
        }

        // モダリティ毎のカットライン設定
        if (Tool_Cutline.Enabled) {
            $.each($("#ViewerConfig").data("ScoutLine").split(","), function () {
                if (this.toString() == $seriesObj.data("Modality")) {
                    Tool_Cutline.Command(true);
                    return false;
                }
            });
        }

        // 事前画像取得登録処理
        ViewerSeriesList_SetPrefetchSeriesList(seriesKeys);

        // 遅延呼び出し
        viewer.invoke(function () {
            // シリーズ入れ替え表示
            ViewerSeriesList_ShowAllSeries($seriesObj);
        });
    }

    // パラメータクリア
    $("#SeriesList").data("studykey", "");
    $("#SeriesList").data("serieskey", "");
}

// シリーズ一覧表示変更処理
function ViewerSeriesList_SeriesPanel_Change(StudyKey, type) {
    // 対象シリーズ確認
    var $series = null;
    $("#SeriesList .SeriesList-Group").each(function () {
        if ($(this).data("StudyKey") == StudyKey) {
            //対象のシリーズを保持
            $series = $(this).children();
            return false;
        }
    });
    if ($series == null) {
        return;
    }

    // 対象シリーズ更新
    $.each($series, function () {
        // 表示状態確認
        var $this = $(this);
        var status;
        if ($this.hasClass("SeriesList-Item-Active") || $this.hasClass("SeriesList-Item1-Active")) {
            status = 2;
        }
        else if ($this.hasClass("SeriesList-Item-ON") || $this.hasClass("SeriesList-Item1-ON")) {
            status = 1;
        }
        else {
            status = 0;
        }

        // 初期化
        $this.removeClass("SeriesList-Item1-Content");
        $this.children(".SeriesList-Item-NowLoading").removeClass("SeriesList-Item1-NowLoading");
        $this.children(".SeriesList-Item-Thumbnail").removeClass("SeriesList-Item1-Thumbnail");
        $this.children(".SeriesList-Item-NumberOf").removeClass("SeriesList-Item1-NumberOf");
        $this.children(".SeriesList-Item-SeriesDescription").removeClass("SeriesList-Item1-SeriesDescription");
        $this.children(".SeriesList-Item-SeriesNumber").removeClass("SeriesList-Item1-SeriesNumber");
        $this.children(".SeriesList-Item-IsGSPS").removeClass("SeriesList-Item1-IsGSPS");

        // 再設定
        if (type == "1") {
            // 簡易表示
            $this.addClass("SeriesList-Item1-Content");
            $this.children(".SeriesList-Item-NowLoading").addClass("SeriesList-Item1-NowLoading");
            $this.children(".SeriesList-Item-Thumbnail").addClass("SeriesList-Item1-Thumbnail");
            $this.children(".SeriesList-Item-NumberOf").addClass("SeriesList-Item1-NumberOf");
            $this.children(".SeriesList-Item-SeriesDescription").addClass("SeriesList-Item1-SeriesDescription");
            $this.children(".SeriesList-Item-SeriesNumber").addClass("SeriesList-Item1-SeriesNumber");
            $this.children(".SeriesList-Item-IsGSPS").addClass("SeriesList-Item1-IsGSPS");
        }

        // シリーズ表示状態変更処理
        ViewerSeriesList_SeriesStatus_Change($this, status);
    });
}

// シリーズ表示状態変更処理
function ViewerSeriesList_SeriesStatus_Change($this, status) {
    // 初期化
    $this.removeClass("SeriesList-Item-Active SeriesList-Item-ON SeriesList-Item-OFF")
        .removeClass("SeriesList-Item1-Active SeriesList-Item1-ON SeriesList-Item1-OFF");

    // 再設定
    if ($this.hasClass("SeriesList-Item1-Content")) {
        if (status == 2) {
            $this.addClass("SeriesList-Item1-Active");
        }
        else if (status == 1) {
            $this.addClass("SeriesList-Item1-ON");
        }
        else {
            $this.addClass("SeriesList-Item1-OFF");
        }
    }
    else {
        if (status == 2) {
            $this.addClass("SeriesList-Item-Active");
        }
        else if (status == 1) {
            $this.addClass("SeriesList-Item-ON");
        }
        else {
            $this.addClass("SeriesList-Item-OFF");
        }
    }
}

// シリーズ選択開始処理
function ViewerSeriesList_Select_Start(ctrl) {
    // データ登録
    $("#SeriesList").data("select", ctrl);

    // シリーズ選択位置初期化
    $("#DragDropItem").data("offsetX", Number.NaN);
    $("#DragDropItem").data("offsetY", Number.NaN);
}

// シリーズ選択移動処理
function ViewerSeriesList_Select_Move(x, y) {
    $("#DragDropItem").css({ left: x - 32, top: y - 56 }).show();
    $("#DragDropItem").data("offsetX", x);
    $("#DragDropItem").data("offsetY", y);
}

// シリーズ選択確定処理
function ViewerSeriesList_Select_Fix() {
    // ドラッグ中描画解除
    $("#DragDropItem").hide();

    // 範囲チェック
    var x = $("#DragDropItem").data("offsetX");
    var y = $("#DragDropItem").data("offsetY");
    var offset = $("#ViewerLib").offset();
    var width = $("#ViewerLib").width();
    var height = $("#ViewerLib").height();
    if (isNaN(x) || isNaN(y)) {
        return;
    }
    if (x < offset.left || x > offset.left + width) {
        return;
    }
    if (y < offset.top || y > offset.top + height) {
        return;
    }

    // シリーズコントロール設定
    var ctrl = $("#SeriesList").data("select");
    ctrl.PointX = $("#DragDropItem").data("offsetX") - $("#ViewerLib").offset().left;
    ctrl.PointY = $("#DragDropItem").data("offsetY") - $("#ViewerLib").offset().top;
    ViewerSeriesList_SetSeriesControl(ctrl);
}

// シリーズ入れ替え表示
function ViewerSeriesList_ShowAllSeries($this) {
    var select = $this.prevAll().length;
    var $seriesList = $this.parent().children();
    var index = 0;
    var x = 0;
    var y = 0;
    var endFlag = false;
    var split = viewer.getSplit();
    var ctrl;
    var item;

    // 取得中を確認
    if ($("#ViewerLib .SeriesPanel").children(".SeriesLoading").length > 0) {
        // 登録中のためキャンセル
        return;
    }

    // 表示クリア
    viewer.clearSeriesData();

    // 表示検査アイコンクリア
    ShowStudyIcon.Clear();

    // 選択したシリーズから表示
    for (item = select; item < $seriesList.length; item++) {
        // シリーズコントロール設定
        ctrl = new SeriesControlQueue(
            $this.parent().data("StudyKey"),
            $seriesList.eq(item).data("SeriesKey"),
            $seriesList.eq(item).data("Modality"),
            $seriesList.eq(item).data("ImageKeys")
        );
        ctrl.Index = index;
        ViewerSeriesList_SetSeriesControl(ctrl);

        // 表示位置変更
        index++;
        if (x + 1 < split.column) {
            x++;
        }
        else if (y + 1 < split.row) {
            x = 0;
            y++;
        }
        else {
            endFlag = true;
            break;
        }
    }

    // シリーズウィンドウに空きがある場合は先頭から表示する
    if (!endFlag) {
        for (item = 0; item < select; item++) {
            // シリーズコントロール設定
            ctrl = new SeriesControlQueue(
                $this.parent().data("StudyKey"),
                $seriesList.eq(item).data("SeriesKey"),
                $seriesList.eq(item).data("Modality"),
                $seriesList.eq(item).data("ImageKeys")
            );
            ctrl.Index = index;
            ViewerSeriesList_SetSeriesControl(ctrl);

            // 表示位置変更
            index++;
            if (x + 1 < split.column) {
                x++;
            }
            else if (y + 1 < split.row) {
                x = 0;
                y++;
            }
            else {
                break;
            }
        }
    }

    // 画面内初期化を行うためシリーズコントロールにnullを設定する
    ViewerSeriesList_SetSeriesControl(null);
}

// 表示中シリーズ入れ替え表示
function ViewerSeriesList_ShowAllSeries_Visible() {
    // 表示シリーズ取得
    $seriesObj = $("#SeriesList .SeriesList-Group:visible .SeriesList-Item:first-child");

    // シリーズ入れ替え表示
    ViewerSeriesList_ShowAllSeries($seriesObj);
}

// シリーズコントロール設定
function ViewerSeriesList_SetSeriesControl(ctrl) {
    // 取得中を表示
    if (ctrl != null) {
        var wnd;
        // 位置指定ではない場合はパネル位置
        if (ctrl.PointX == null || ctrl.PointX == null) {
            wnd = viewer.getSeriesPanelFromIndex(ctrl.Index);
        }
        else {
            wnd = viewer.getSeriesPanelFromPoint(ctrl.PointX, ctrl.PointY);
        }
        if (wnd == null) {
            return;
        }

        // 取得中を確認
        if ($(wnd.Element).children().hasClass("SeriesLoading")) {
            // 登録中のためキャンセル
            return;
        }

        // シリーズ情報をクリア
        wnd.setSeriesData(null);
    }

    // アイテム追加
    var queue = $("#SeriesList").data("SeriesControlQueue");
    queue.push(ctrl);
    $("#SeriesList").data("SeriesControlQueue", queue);

    // 新規追加の場合
    if (queue.length == 1) {
        $("#SeriesList").data("SeriesControlStart", true);
    }

    // 遅延呼び出し
    viewer.invoke(function () {
        // キューに登録されているシリーズパネルに取得中を設定
        var queue2 = $("#SeriesList").data("SeriesControlQueue");
        for (var i = 0; i < queue2.length; i++) {
            if (queue[i] == null) {
                continue;
            }
            var wnd2;
            // 位置指定ではない場合はパネル位置
            if (queue2[i].PointX == null || queue2[i].PointX == null) {
                wnd2 = viewer.getSeriesPanelFromIndex(queue2[i].Index);
            }
            else {
                wnd2 = viewer.getSeriesPanelFromPoint(queue2[i].PointX, queue2[i].PointY);
            }
            if (wnd2 == null) {
                continue;
            }

            // 取得中に設定
            if ($(wnd2.Element).children(".SeriesLoading").length == 0) {
                $(wnd2.Element).append($("<div>").addClass("SeriesLoading"));
            }
        }

        // 新規追加の場合
        if ($("#SeriesList").data("SeriesControlStart")) {
            $("#SeriesList").removeData("SeriesControlStart");
            // シリーズコントロール処理呼び出し
            ViewerSeriesList_CallSeriesControl();
        }
    });
}

// シリーズコントロール処理呼び出し
function ViewerSeriesList_CallSeriesControl() {
    var queue = $("#SeriesList").data("SeriesControlQueue");
    if (queue.length > 0) {
        // Image一覧取得
        if (queue[0] != null) {
            // ImageKeyが含まれている場合
            if (queue[0].ImageKeys) {
                // Image一覧取得
                Viewer_GetImageList2(
                        queue[0].ImageKeys,
                        null,
                        ViewerSeriesList_GetImageList_Result
                    );  // 取得後「Image一覧取得結果」呼び出し
            }
            else {
                // Image一覧取得
                Viewer_GetImageList(
                        queue[0].SeriesKey,
                        null,
                        ViewerSeriesList_GetImageList_Result
                    );  // 取得後「Image一覧取得結果」呼び出し
            }
        }
        // 画面内初期化
        else {
            // 遅延呼び出し
            viewer.invoke(function () {
                // 全シリーズパネル確認
                for (var i = 0; i < viewer.SeriesPanels.length; i++) {
                    if (viewer.SeriesPanels[i] != null && viewer.SeriesPanels[i].seriesData != null) {
                        // モダリティ毎のシリーズ内分割取得
                        var mod = viewer.SeriesPanels[i].seriesData.ExData.Modality;
                        var split = Viewer_GetModalityConfigVal(mod, "split").split(",");

                        // シリーズ内分割設定
                        if (split.length >= 2 && !isNaN(parseInt(split[0])) && !isNaN(parseInt(split[1]))) {
                            viewer.SeriesPanels[i].split(parseInt(split[1]), parseInt(split[0]))
                        }
                        else {
                            viewer.SeriesPanels[i].split(1, 1);
                        }

                        // 先頭を選択状態にする
                        if (i == 0) {
                            viewer.SeriesPanels[i].SopPanels[0].setSelect();
                            // イベントが上がらないため強制的に呼び出し
                            ViewerSeriesList_SelectSeriesProc(viewer.SeriesPanels[i]);
                        }
                    }
                }

                // シリーズコントロール更新
                ViewerSeriesList_UpdateSeriesControl();
            });
        }
    }
}

// シリーズコントロール取得
function ViewerSeriesList_GetSeriesControl() {
    var queue = $("#SeriesList").data("SeriesControlQueue");
    if (queue.length > 0) {
        return queue[0];
    }
    else {
        return null;
    }
}

// シリーズコントロール更新
function ViewerSeriesList_UpdateSeriesControl() {
    // アイテム削除
    var queue = $("#SeriesList").data("SeriesControlQueue");
    var del = queue.shift();
    $("#SeriesList").data("SeriesControlQueue", queue);
    if (del != null) {
        // 事前画像取得要求削除(Series)処理
        ViewerSeriesList_DeletePrefetchSeriesList(del.SeriesKey);
    }

    // スタック有
    if (queue.length != 0) {
        // シリーズコントロール処理呼び出し
        ViewerSeriesList_CallSeriesControl();
    }
}

// Image一覧取得結果
function ViewerSeriesList_GetImageList_Result(result) {
    // シリーズコントロール取得
    var ctrl = ViewerSeriesList_GetSeriesControl();

    // データチェック
    if (result.d.Result == "Error") {
        // 取得中キャンセル処理
        ViewerSeriesList_CancelSeriesLoading(ctrl);

        // シリーズコントロール更新
        ViewerSeriesList_UpdateSeriesControl();
        return;
    }

    // キャンセルされた場合
    if (result.d.IsCancel == true) {
        // 取得中キャンセル処理
        ViewerSeriesList_CancelSeriesLoading(ctrl);

        // シリーズコントロール更新
        ViewerSeriesList_UpdateSeriesControl();
        return;
    }

    // Imageデータあり
    if (result.d.ImTags.length > 0) {
        // Image一覧設定
        ViewerSeriesList_SetImageList(ctrl, result.d.ImTags);
    }
    else {
        // Seriesデータあり
        if (result.d.SeTags.length > 1) {
            alert("マルチフレームのため展開します。");

            // シリーズ一覧設定
            ViewerSeriesList_SetSeriesList(ctrl.StudyKey, result.d.SeTags, ctrl.SeriesKey);
        }
        // 1枚のマルチフレームの場合は展開後に再取得
        else if (result.d.SeTags.length == 1) {
            // シリーズ一覧設定
            ViewerSeriesList_SetSeriesList(ctrl.StudyKey, result.d.SeTags, ctrl.SeriesKey);

            // シリーズコントロールの情報を更新
            ctrl.SeriesKey = result.d.SeTags[0].SeriesKey;

            // Image一覧取得
            Viewer_GetImageList(
                result.d.SeTags[0].SeriesKey,
                null,
                ViewerSeriesList_GetImageList_Result
            );  // 取得後「Image一覧取得結果」呼び出し

            // 再取得するため終了
            return;
        }

        // 取得中キャンセル処理
        ViewerSeriesList_CancelSeriesLoading(ctrl);
    }

    // シリーズコントロール更新
    ViewerSeriesList_UpdateSeriesControl();
}

// Image一覧設定
function ViewerSeriesList_SetImageList(ctrl, tags) {
    // Image一覧を拡張
    var i;
    var skey = $("#ViewerConfig").data("sk");
    for (i = 0; i < tags.length; i++) {
        if (!tags[i].ExData) {
            tags[i].ExData = new Object();
        }
        tags[i].ExData.SKey = skey;
        //tags[i].ExData.StudyKey = ctrl.StudyKey;
        //tags[i].ExData.SeriesKey = ctrl.SeriesKey;
        //tags[i].ExData.Modality = ctrl.Modality;
        tags[i].ExData.RequestTags = null;
    }

    // 初期表示パラメータ設定
    if ($("#SeriesList").data("FirstStudyKey") == null) {
        $("#SeriesList").data("FirstStudyKey", ctrl.StudyKey);
    }

    // シリーズデータ作成
    var dat = new SeriesData(tags);

    // シリーズデータ拡張
    if (!dat.ExData) {
        dat.ExData = new Object();
    }
    dat.ExData.Unique = new Date().getTime();

    // 検査情報初期化
    dat.ExData.StudyKey = ctrl.StudyKey;
    dat.ExData.SeriesKey = ctrl.SeriesKey;
    dat.ExData.Modality = ctrl.Modality;

    // 間引き情報初期化
    dat.ExData.ThinOutMode = Tool_ThinOut.Mode(ctrl.Modality);
    dat.ExData.ThinOut = Tool_ThinOut.Default(ctrl.Modality);

    // GSPS(PR)情報初期化
    dat.ExData.GSPSIndex = 0;
    dat.ExData.GSPS = Tool_GSPS.Default;

    // アノテーション要素変更通知初期化
    for (i = 0; i < dat.SopDatas.length; i++) {
        dat.SopDatas[i].updateAnnotation = ViewerControl_UpdateAnnotation;
    }

    // パネル取得
    var wnd;
    if (ctrl.PointX == null || ctrl.PointX == null) {
        wnd = viewer.getSeriesPanelFromIndex(ctrl.Index);
    }
    else {
        wnd = viewer.getSeriesPanelFromPoint(ctrl.PointX, ctrl.PointY);
    }
    if (wnd == null) {
        return;
    }

    // シリーズ情報引継ぎ
    if (wnd.seriesData) {
        // シリーズ内分割更新
        dat.Column = wnd.seriesData.Column;
        dat.Row = wnd.seriesData.Row;

        // 間引き情報更新
        //dat.ExData.ThinOutMode = wnd.seriesData.ExData.ThinOutMode;
        //dat.ExData.ThinOut = wnd.seriesData.ExData.ThinOut;

        // 表示検査アイコン確認
        ShowStudyIcon.Check(wnd.seriesData.ExData.StudyKey);
    }
    else {
        // モダリティ毎のシリーズ内分割取得
        var split = Viewer_GetModalityConfigVal(ctrl.Modality, "split").split(",");
        if (split.length >= 2 && !isNaN(parseInt(split[0])) && !isNaN(parseInt(split[1]))) {
            dat.Column = parseInt(split[1]);
            dat.Row = parseInt(split[0]);
        }
    }

    // 位置指定ではない場合はパネル位置
    if (ctrl.PointX == null || ctrl.PointX == null) {
        // 画像表示
        viewer.setSeriesData(ctrl.Index + viewer.getSeriesIndex(), dat);
    }
    // 位置指定の場合
    else {
        // 画像表示
        wnd.setSeriesData(dat);
    }

    // 遅延呼び出し
    viewer.invoke(function () {
        $("#StudyList-Table tr").show();
        // 選択状態設定
        wnd.setSelect();
    });
}

// 取得中キャンセル処理
function ViewerSeriesList_CancelSeriesLoading(ctrl) {
    if (ctrl != null) {
        var wnd;
        // 位置指定ではない場合はパネル位置
        if (ctrl.PointX == null || ctrl.PointX == null) {
            wnd = viewer.getSeriesPanelFromIndex(ctrl.Index);
        }
        else {
            wnd = viewer.getSeriesPanelFromPoint(ctrl.PointX, ctrl.PointY);
        }

        // 取得中を削除
        $(wnd.Element).children(".SeriesLoading").remove();
    }
}

// 事前画像取得登録処理
function ViewerSeriesList_SetPrefetchSeriesList(seriesKeys) {
    // 有効確認
    if ($("#ViewerConfig").data("IsPrefetchImage") != "1") {
        return;
    }

    // リスト更新
    var oldlist = $("#SeriesList").data("PrefetchSeriesList");
    var newlist = oldlist.concat(seriesKeys);
    $("#SeriesList").data("PrefetchSeriesList", newlist);
    $("#SeriesList").data("PrefetchImageList", new Array());
}

// 事前画像取得要求削除(Series)処理
function ViewerSeriesList_DeletePrefetchSeriesList(seriesKey) {
    // リスト更新
    var i;
    var list = $("#SeriesList").data("PrefetchSeriesList");
    for (i = 0; i < list.length;) {
        if (list[i] == seriesKey) {
            list.splice(i, 1);
            if (i == 0) {
                // アクティブのImageKeyを削除
                $("#SeriesList").data("PrefetchImageList", new Array());
            }
            continue;
        }
        i++;
    }
    $("#SeriesList").data("PrefetchSeriesList", list);
}

// 事前画像取得要求削除(Image)処理
function ViewerSeriesList_DeletePrefetchImageList(imageKey) {
    // リスト更新
    var i;
    var imagelist = $("#SeriesList").data("PrefetchImageList");
    if (imagelist.length == 0) {
        // Series側で削除された場合を考慮
        return;
    }
    for (i = 0; i < imagelist.length;) {
        if (imagelist[i] == imageKey) {
            imagelist.splice(i, 1);
            continue;
        }
        i++;
    }
    $("#SeriesList").data("PrefetchImageList", imagelist);
    if (imagelist.length == 0) {
        // Series削除
        var serieslist = $("#SeriesList").data("PrefetchSeriesList");
        if (serieslist.length != 0) {
            serieslist.splice(0, 1);
        }
        $("#SeriesList").data("PrefetchSeriesList", serieslist);
    }
}

// 事前画像取得処理
function ViewerSeriesList_PrefetchImage() {
    // 最終処理時刻から処理周期を確認
    var nowtime = new Date().getTime();
    var oldtime = $("#SeriesList").data("LastPrefetchTime");
    if (nowtime - oldtime < 1000) {
        return;
    }
    $("#SeriesList").data("LastPrefetchTime", nowtime);

    // ImageInfo中または画像読み込み中は処理しない
    if (ViewerUtil.GetImageInfoIsRequest || ImageLoader.getLodingCount() > 0) {
        return;
    }

    // 状態確認
    if ($("#SeriesList").data("SendPrefetchImage") == true) {
        return;
    }

    // ImageKey確認
    var imagelist = $("#SeriesList").data("PrefetchImageList");
    if (imagelist.length == 0) {
        // SeriesKey確認
        var serieslist = $("#SeriesList").data("PrefetchSeriesList");
        if (serieslist.length == 0) {
            return;
        }

        // 事前画像対象一覧取得
        Viewer_PrefetchImageList(
            serieslist[0],
            null,
            ViewerSeriesList_PrefetchImageList_Result
        );  // 取得後「事前画像対象一覧取得結果」呼び出し
    }
    else {
        // 事前画像取得
        Viewer_PrefetchImage(
            imagelist[0],
            null,
            ViewerSeriesList_PrefetchImage_Result
        );  // 取得後「事前画像取得結果」呼び出し
    }

    // 状態更新
    $("#SeriesList").data("SendPrefetchImage", true);
}

// 事前画像対象一覧取得結果
function ViewerSeriesList_PrefetchImageList_Result(result) {
    // データチェック
    if (result.d.Result == "Error" || result.d.ImageKey.length == 0) {
        var serieslist = $("#SeriesList").data("PrefetchSeriesList");
        if (serieslist.length != 0 && list) {
            // 事前画像取得要求削除(Series)処理
            ViewerSeriesList_DeletePrefetchSeriesList(list[0]);
        }
    }
    else {
        // リスト更新
        $("#SeriesList").data("PrefetchImageList", result.d.ImageKey);
    }

    // 状態更新
    $("#SeriesList").data("SendPrefetchImage", false);
}

// 事前画像取得結果
function ViewerSeriesList_PrefetchImage_Result(imageKey) {
    // 事前画像取得要求削除(Image)処理
    ViewerSeriesList_DeletePrefetchImageList(imageKey);

    // 状態更新
    $("#SeriesList").data("SendPrefetchImage", false);
}

// 全画面表示処理
function ViewerSeriesList_FullScreen($this, event) {
    // 計測選択状態の場合
    if (Tool_Menu.IsMeasureSelect()) {
        return false;
    }

    // 画像表示部以外のイベントの場合
    if ($(event.target).closest(".SeriesWorkPanel").length == 0) {
        return false;
    }

    // アクティブ取得
    var point = ViewerUtil.getElementPoint($this.get(0), event);
    var wnd = viewer.getSeriesPanelFromPoint(point.x, point.y);
    if (wnd != null && wnd.seriesData != null) {
        var sop = wnd.getSelectSop();
        if (sop != null && sop.sopData != null) {
            // ViewerLib以外が表示中の場合(ViewerHeadはツール位置変更より消えている場合があるため)
            if ($("#ViewerFoot").is(":visible")) {
                // 分割数を保持し1×1へ変更
                var series = viewer.getSplit();
                var seriesIndex = viewer.SeriesIndex;
                var sopColumn = wnd.seriesData.Column;
                var sopRow = wnd.seriesData.Row;
                var sopIndex = wnd.seriesData.SopIndex - sop.sopData.thinIndex;
                $("#ViewerLib").data("seriesColumn", series.column)
                               .data("seriesRow", series.row)
                               .data("seriesIndex", seriesIndex)
                               .data("sopColumn", sopColumn)
                               .data("sopRow", sopRow)
                               .data("sopIndex", sopIndex);
                viewer.splitAutoIndex(1, 1);
                wnd.splitAutoIndex(1, 1);

                // ツール位置変更状態確認処理
                if (!Tool_ToolAreaChange.Enabled || Tool_ToolAreaChange.IsTop()) {
                    // 非表示
                    $("#ViewerHead").hide();
                }

                // 非表示
                $("#ViewerFoot").hide();

                // 非表示
                Tool_StudyMemo.Command("Hide");

                // リサイズ処理
                ViewerWindow_Resize_Proc();
            }
            // ViewerLib以外が非表示の場合
            else {
                // 分割数を元に戻す
                viewer.splitAutoIndex($("#ViewerLib").data("seriesColumn"), $("#ViewerLib").data("seriesRow"));
                viewer.setSeriesIndex($("#ViewerLib").data("seriesIndex"));
                wnd.splitAutoIndex($("#ViewerLib").data("sopColumn"), $("#ViewerLib").data("sopRow"));
                wnd.setSopIndex($("#ViewerLib").data("sopIndex"), "current");

                // ツール位置変更状態確認処理
                if (!Tool_ToolAreaChange.Enabled || Tool_ToolAreaChange.IsTop()) {
                    // 表示
                    $("#ViewerHead").show();
                }

                // 表示
                $("#ViewerFoot").show();

                // 表示
                Tool_StudyMemo.Command("Show");

                // リサイズ処理
                ViewerWindow_Resize_Proc();
            }
        }
    }
}

// アクティブシリーズ入れ替え表示
function ViewerSeriesList_ChangeActiveSeries(command) {
    // 選択シリーズ取得
    var activeSeries = viewer.getSelectSeries();
    if (activeSeries == null || activeSeries.seriesData == null) {
        return;
    }
    var activeStudyKey = activeSeries.seriesData.ExData.StudyKey;
    var activeSeriesKey = activeSeries.seriesData.ExData.SeriesKey;
    var $selectSeries = null;
    switch (command) {
        // 前へ
        case "prev":
            // シリーズ一覧確認
            $("#SeriesList .SeriesList-Item").each(function () {
                var $this = $(this);
                if ($this.data("SeriesKey") == activeSeriesKey) {
                    return false;
                }
                if ($this.parent().data("StudyKey") == activeStudyKey) {
                    $selectSeries = $this;
                }
            });
            break;
        // 次へ
        case "next":
            // シリーズ一覧確認
            var getFlag = false;
            $("#SeriesList .SeriesList-Item").each(function () {
                var $this = $(this);
                if (getFlag) {
                    if ($this.parent().data("StudyKey") == activeStudyKey) {
                        $selectSeries = $this;
                    }
                    return false;
                }
                if ($this.data("SeriesKey") == activeSeriesKey) {
                    getFlag = true;
                }
            });
            break;
    }
    if ($selectSeries == null) {
        return;
    }

    // シリーズコントロール設定
    var ctrl = new SeriesControlQueue(
                $selectSeries.parent().data("StudyKey"),
                $selectSeries.data("SeriesKey"),
                $selectSeries.data("Modality"),
                $selectSeries.data("ImageKeys")
            );
    ctrl.Index = activeSeries.SeriesIndex - viewer.SeriesIndex;
    ViewerSeriesList_SetSeriesControl(ctrl);
}

// Viewer選択(Series)処理
function ViewerSeriesList_SelectSeriesProc(series) {
    // 更新確認
    if (series == null || series.seriesData == null) {
        return;
    }
    if (series.SeriesIndex == PreSelectSeries.Index &&
        series.seriesData.ExData.SeriesKey == PreSelectSeries.SeriesKey) {
        return;
    }

    // 情報更新
    PreSelectSeries.Index = series.SeriesIndex;
    PreSelectSeries.SeriesKey = series.seriesData.ExData.SeriesKey;
    PreSelectSeries.Series = series;

    // 処理中以外の場合
    if (PreSelectSeries.IsUpdate == false) {
        // 処理開始
        PreSelectSeries.IsUpdate = true;

        // 遅延呼び出し
        viewer.invoke(function () {
            // Viewer情報取得
            var selectSeriesKey;
            var showSeriesKey = new Array();
            for (var i = 0; i < viewer.SeriesPanels.length; i++) {
                if (viewer.SeriesPanels[i] != null &&
                    viewer.SeriesPanels[i].seriesData != null) {
                    if (viewer.SeriesPanels[i] == PreSelectSeries.Series) {
                        // 選択シリーズ
                        selectSeriesKey = viewer.SeriesPanels[i].seriesData.ExData.SeriesKey;
                    }
                    else {
                        // 表示シリーズ
                        showSeriesKey.push(viewer.SeriesPanels[i].seriesData.ExData.SeriesKey);
                    }
                }
            }

            // シリーズ一覧確認
            var $selectSeries = null;
            $("#SeriesList .SeriesList-Item").each(function () {
                var $this = $(this);
                for (var i = 0; i < showSeriesKey.length; i++) {
                    if ($this.data("SeriesKey") == showSeriesKey[i] && selectSeriesKey != showSeriesKey[i]) {
                        // 表示状態設定
                        // シリーズ表示状態変更処理
                        ViewerSeriesList_SeriesStatus_Change($this, 1);
                        return true;
                    }
                }
                if ($this.data("SeriesKey") == selectSeriesKey) {
                    // 選択状態は最後に行うため情報を保持する
                    $selectSeries = $this;
                }
                else {
                    // 表示状態解除
                    // シリーズ表示状態変更処理
                    ViewerSeriesList_SeriesStatus_Change($this, 0);
                }
            });

            // 選択状態設定
            if ($selectSeries != null) {
                // 選択状態
                // シリーズ表示状態変更処理
                ViewerSeriesList_SeriesStatus_Change($selectSeries, 2);

                // 検査選択処理(studyKey)
                ViewerStudyList_Select_Key(PreSelectSeries.Series.seriesData.ExData.StudyKey);

                // スクロール位置更新
                var top = $selectSeries.position().top;
                if (top + $("#SeriesList .SeriesList-Group :visible").height() > $("#SeriesList").height() || top < 0) {
                    var pre = $("#SeriesList").scrollTop();
                    $("#SeriesList").scrollTop(pre + top);
                }
            }

            // 間引き更新処理
            if (Tool_ThinOut.Enabled) {
                Tool_ThinOut.Update();
            }

            // GSPS(PR)更新処理
            if (Tool_GSPS.Enabled) {
                Tool_GSPS.Update();
            }

            // 処理完了
            PreSelectSeries.IsUpdate = false;
        });
    }
}

// Viewer選択(Sop)処理
function ViewerSeriesList_SelectSopProc(sop) {
}

// Viewer更新(LoadSeries)処理
function ViewerSeriesList_LoadSeriesProc(series) {
    // 表示検査パネル追加
    ViewerStudyList_Panel_Add(series);

    // シリーズ入れ替えパネル設定
    SeriesSwap.SetPanel(series);

    // データチェック
    if (series == null ||
        series.seriesData == null) {
        return;
    }

    // コマンド処理(間引き)
    var mode = series.seriesData.ExData.ThinOutMode;
    var command = ViewerUtil.SeriesCacheCount;
    if (mode == "1") {
        if (series.seriesData.ExData.ThinOut < series.seriesData.BaseSopDatas.length) {
            // 間引きモード用に設定
            command = series.seriesData.ExData.ThinOut;
        }
        else {
            // 間引けない場合はシリーズキャッシュモードに設定
            if (series.seriesData.SeriesCacheCount == -1) {
                mode = "2";
            }
            else {
                mode = "0";
            }
        }
    }
    Tool_ThinOut.Command(mode, command, series, false);

    // コマンド処理(GSPS)
    Tool_GSPS.Command(series.seriesData.ExData.GSPS, series);
}

// Viewer更新(LoadSop)処理
function ViewerSeriesList_LoadSopProc(sop) {
    // 間引きシリーズパネル更新処理
    Tool_ThinOut.PanelUpdate(sop.Series);

    // シリーズ目視確認用にImageKeyを設定
    if (sop.Series.seriesData != null && sop.sopData != null) {
        SeriesCountCheck.SetImageKey(sop.Series.seriesData.ExData.SeriesKey, sop.sopData.data.ImageKey);
    }
}

// Viewer更新(Tick)処理
function ViewerSeriesList_TickSopProc(sop) {
    // 事前画像取得処理
    ViewerSeriesList_PrefetchImage();

    // シリーズ目視確認用サムネイル更新
    SeriesCountCheck.UpdateThumbnail();
}

// Viewer更新(DrawEnd)処理
function ViewerSeriesList_DrawEndProc(obj) {
}

// Viewer更新(InitSop)処理
function ViewerSeriesList_InitSopProc(sopData, init) {
    // エラー時は処理しない
    if (!init) {
        return;
    }

    // 取得中を削除
    var $obj = $(sopData.seriesData.seriesPanel.Element).children(".SeriesLoading");
    if ($obj.length != 0) {
        $obj.remove();
    }
}
