/// <reference path="../../Common/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

//document.onselectstart = function () { return false; }
//document.onmousedown = function () { return false; }
document.ondragstart = function () { return false; }
function ViewerData() {
    this.viewerPanel = null;
    this.SeriesDatas = new Array();
    this.isUpdate = false;
    this._setViewerPanel = function (panel) {
        this.viewerPanel = panel;
    }
    this.setSeriesData = function (index, data) {
        if (this.SeriesDatas[index] == data)
            return;
        var prev = this.SeriesDatas[index];
        if (prev) {
            prev.Dispose
        }
        if(data)
            data.setViewer(this);
        this.SeriesDatas[index] = data;
        this.isUpdate = true;
    }
    this.clearSeriesData = function () {
        if (this.SeriesDatas.length > 0) {
            this.SeriesDatas = new Array();
            this.isUpdate = true;
        }
    }

    this.setWindowLevel = function (series, wc, ww) {
        if (series.getSync()) {
            for (var i = 0; i < this.SeriesDatas.length; i++) {
                var series = this.SeriesDatas[i];
                if (series && series.getSync()) {
                    series.setWindowLevel(wc, ww);
                }
            }
        } else {
            series.setWindowLevel(wc, ww);
        }
    }

    this.swapSeriesData = function (index1, index2) {
        var t = this.SeriesDatas[index1];
        this.SeriesDatas[index1] = this.SeriesDatas[index2];
        this.SeriesDatas[index2] = t;
        this.isUpdate = true;
    }
    //同期
    var syncStart = function (data) {
        for (var i = 0; i < data.SeriesDatas.length; i++) {
            if (data.SeriesDatas[i] && data.SeriesDatas[i].getSync()) {
                data.SeriesDatas[i].syncStart();
            }
        }
    }
    this._syncControl = null;
    this.setSyncControl = function (sync) {
        this._syncControl = sync;
        syncStart(this);
    }
    var IsSync = false;
    this.getSync = function (value) {
        return IsSync;
    }
    this.setSync = function (value) {
        IsSync = value;
        syncStart(this);
    }
    this.syncStart = function (series) {
        if (this._syncControl)
            this._syncControl.initSeries(series);
    }
    this.isCutline = false;
}
function ViewerPanel(element) {
    //Seriesパネル
    this.SeriesPanels = new Array();
    //ViwerData型が入る
    this.viewerData = null;
    var viewerData = null;
    //ターゲットとなるDiv要素
    this.Element = element;

    //全体再描画要求
    this.IsDelayUpdateDraw = false;
    this.IsUpdateDraw = false;

    //プライベートメソッド用
    var self = this;

    this.Config = {
        SeriesBorderSize: 2,
        SopBorderSize: 2,
        //ボーダー用などにサイズを変更
        seriesPanelInterruptResize: function (series, rect) {
            rect.Width -= this.SeriesBorderSize * 2 - 1;
            rect.Height -= this.SeriesBorderSize * 2 - 1;
            if (rect.Width < 0)
                rect.Width = 0;
            if (rect.Height < 0)
                rect.Height = 0;
            return rect;
        },
        sopPanelInterruptResize: function (sop, rect) {
            rect.Width -= this.SopBorderSize;
            rect.Height -= this.SopBorderSize;
            if (rect.Width < 0)
                rect.Width = 0;
            if (rect.Height < 0)
                rect.Height = 0;
            return rect;
        }
    };

    var self = this;
    var appendChild = function (element) {
        element.style.position = "absolute";
        element.style.width = "100%";
        element.style.height = "100%";
        self.Element.appendChild(element);
    }
    this.LogPanel = document.createElement("DIV");
    appendChild(this.LogPanel);
    this.LogPanel.style.width = "auto";
    this.LogPanel.style.color = "green";
    this.LogPanel.style.bottom = "0px";
    this.LogPanel.style.zIndex = 2;
    ViewerUtil.initLog(this.LogPanel, 20);
    ViewerUtil.setLogDisp(false);
    //画像送り begin,current,end,center
    this.setSopIndex = function (offset, origin) {
        var s = self.getSelectSeries();
        if (s == null)
            return;
        s.setSopIndex(offset,origin);
    };
    //選択
    var prevSelectSeries = null;
    this._setSelectSeries = function (series) {
        if (prevSelectSeries == series.seriesData)
            return;
        prevSelectSeries = series.seriesData;
        for (var i = 0; i < this.SeriesPanels.length; i++) {
            this.SeriesPanels[i]._setSelect(this.SeriesPanels[i] == series);
        }
        ViewerUtil.Events.onSelectSeries(series);
        this.work = null;
    }
    this.getSelectSeries = function () {
        for (var i = 0; i < this.SeriesPanels.length; i++) {
            if (this.SeriesPanels[i].isSelect())
                return this.SeriesPanels[i];
        }
        return null;
    }
    this._setSelectSop = function (sop) {
        var isselect=sop.isSelect();
        sop.Series._setSelectSop(sop);
        ViewerUtil.Events.onSelectSop(sop);
        if (this.getData().isCutline)
            this.IsDelayUpdateDraw = true;
        if(!isselect)
            this.work = null;
    }
    //同期
    this.setSyncControl = function (sync) {
        if (!this.getData())
            return;
        this.getData().setSyncControl(sync);
    }
    this.setSync = function (sync) {
        if (!this.getData())
            return;
        this.getData().setSync(sync);
    }

    //イベント
    this.DrawObjectHitWidth = 32;
    this._EventControl = null;
    this.PanelDrawMode = null;
    this.work = null;
    this.setEventControl = function (ctrl) {
        this._EventControl = ctrl;
        this.work = null;
    }
    this.setEventControl = function (ctrl, mode) {
        this.onEvent(prevEventSop, "up", prevEventValue);
        ViewerToolsCommit();
        this.work = null;
        this._EventControl = ctrl;
        this.PanelDrawMode = mode;
    }
    this.eventMode = "single";
    eventState = false;
    var prevEventValue;
    var prevEventSop;
    this.onEvent = function (sop, name, value) {
        switch (name) {
            case "down":
                eventState = true;
                break;
            case "up":
                eventState = false;
                break;
        }
        prevEventSop = sop;
        prevEventValue = value;
        if (this._EventControl) {
            this._EventControl(sop, name, value);
            ViewerUtil.TryTick();
        }
    }
    this.setEventMode = function (mode) {
        if (mode == "multi" && this.eventState) {
            this.onEvent(prevEventSop, "up", prevEventValue);
        }
        this.eventMode = mode;
    }
    $(this.Element).mousewheel(function (event, delta) {
        var pos = ViewerUtil.getElementPoint(this, event);
        var series = self.getSeriesPanelFromPoint(pos.x, pos.y);
        if (series) {
            series.setSelect();
        }
        if (delta > 0)
            self.setSopIndex(-1, "current");
        else if (delta < 0)
            self.setSopIndex(1, "current");
        return false; // prevent default
    });

    //現在の横幅と高さ（Elementと違いレイアウト前を保持）
    this.Width = $(element).width();
    this.Height = $(element).height();
    //データの設定
    this.setViewerData = function (data) {
        data._setViewerPanel(this);
        viewerData = data;
    }
    this.getData = function () {
        return viewerData;
    }
    this.setViewerData(new ViewerData());
    this.setSeriesData = function (index, data) {
        if (this.viewerData != null)
            this.viewerData.setSeriesData(index, data);
    }
    this.clearSeriesData = function () {
        if (this.viewerData != null)
            this.viewerData.clearSeriesData();
    }
    //分割設定(遅延設定用と現在)
    var Column = 1; var Row = 1;
    this.Column = 1; this.Row = 1;
    this.split = function (w, h) {
        Column = w;
        Row = h;
    }
    //遅延考慮取得
    this.getSplit = function(){
        return {
            column:Column,
            row:Row
        };
    }
    this.splitAutoIndex = function (w, h) {
        var series = this.getSelectSeries();
        var index = 0;
        if (series) {
            //index = series.SeriesIndex+SeriesIndex;
            index = series.SeriesIndex;
        }
        if (index < 0)
            index = 0;
        if (index >= viewerData.SeriesDatas.length)
            index = viewerData.SeriesDatas.length - 1;
        var count = w * h - 1;
        var i;
        for (i = 1; i <= count && (index + i) < viewerData.SeriesDatas.length; i++) {
            if (viewerData.SeriesDatas[index + i] == null)
                break;
        }
        index -= count - (i - 1);
        if (index < 0) index = 0;
        this.split(w, h);
        this.setSeriesIndex(index);
    } 

    //パネル取得（分割座標
    this.getSeriesPanel = function (x, y) {
        var p = this.SeriesPanels[this.Column * y + x];
        if (typeof p == 'undefined')
            return null;
        return p;
    }
    this.getSeriesPanelFromIndex = function (index) {
        var p = this.SeriesPanels[index];
        if (typeof p == 'undefined')
            return null;
        return p;
    }
    //パネル取得（座標 Series
    this.getSeriesPanelFromPoint = function (x, y) {
        var p = null;
        jQuery.each(this.SeriesPanels, function () {
            if (this.isHit(x, y)) {
                p = this;
                return false;
            }
        });
        return p;
    }
    //当たり判定
    this.isHit = function (x, y) {
        return (x >= 0 && y >= 0 && x < $(this.Element).width() && y < $(this.Element).height());
    }
    //SeriesIndex分割に使用する先頭の位置
    var SeriesIndex = 0;
    this.SeriesIndex = 0;
    this.setSeriesIndex = function (index) {
        SeriesIndex = index;
    }
    this.getSeriesIndex = function () {
        return SeriesIndex;
    }
    var invokeItem = new Array();
    this.invoke = function (fc) {
        invokeItem.push(fc);
    }

    //画像読込み優先処理
    this._getNextSeriesPanel = function (count) {
        for (var i = 0; i < 2; i++) {
            var series = this.getSeriesPanelFromIndex(count.index++);
            if (this.SeriesPanels.length <= count.index)
                count.index = 0;
            if (series)
                return series;
        }
        return null;
    }
    this._LodingSeriesIndex = {index:0};
    this._getLodingNextSeriesPanel = function () {
        return this._getNextSeriesPanel(this._LodingSeriesIndex);
    }
    this._getInfoSeriesIndex = { index: 0 };
    this._getInfoNextSeriesPanel = function () {
        return this._getNextSeriesPanel(this._getInfoSeriesIndex);
    }

    this.getLoadImage = function () {
        var ret = null;
        //選択されているシリーズ表示されているSOP
        var series = this.getSelectSeries();
        if (series) {
            ret = series.getLoadImage(true);
        }
        if (ret)
            return ret;
        //表示されているシリーズ表示されているSOP
        for (var index = 0; index < this.Row * this.Column; index++) {
            var series = this._getLodingNextSeriesPanel();
            if (series) {
                ret = series.getLoadImage(true);
            }
            if (ret)
                return ret;
        }
        //選択されているシリーズ表示されてないSOP(キャッシュ範囲内)
        var series = this.getSelectSeries();
        if (series) {
            ret = series.getLoadImage(false);
        }
        if (ret)
            return ret;

        //表示されているシリーズ表示されていないSOP
        for (var index = 0; index < this.Row * this.Column; index++) {
            var series = this._getLodingNextSeriesPanel();
            if (series) {
                ret = series.getLoadImage(false);
            }
            if (ret)
                return ret;
        }
        return null;
    }
    this.getImageInfoData = function () {
        var ret = null;
        //選択されているシリーズ表示されているSOP→表示されてないSOP
        var series = this.getSelectSeries();
        if (series) {
            ret = series.getImageInfoData(true);
            if(ret==null)
                ret = series.getImageInfoData(false);
        }
        if (ret)
            return ret;
        //表示されているシリーズ表示されているSOP
        for (var index = 0; index < this.Row * this.Column; index++) {
            var series = this._getInfoNextSeriesPanel();
            if (series) {
                ret = series.getImageInfoData(true);
            }
            if (ret)
                return ret;
        }
        //表示されているシリーズ表示されていないSOP
        for (var index = 0; index < this.Row * this.Column; index++) {
            var series = this._getInfoNextSeriesPanel();
            if (series) {
                ret = series.getImageInfoData(false);
            }
            if (ret)
                return ret;
        }
        return null;
    }

    this.onUpdateSopIndex = function (series, prev, now) {
        var syncControl = null;
        if (this.getData()) {
            syncControl = this.getData()._syncControl;
            if (!this.getData().getSync())
                return;
        }
        if (syncControl == null)
            return;
        if (series.isSelect()) {
            var data = series.getData();
            if (data == null)
                return;
            if (!data.getSync())
                return;
            var vdata = this.getData();
            if (vdata) {
                syncControl.updateSeries(data, data, prev, now);
                for (var i = 0; i < vdata.SeriesDatas.length; i++) {
                    var sdata = vdata.SeriesDatas[i];
                    if (sdata && sdata != data && sdata.getSync()) {
                        syncControl.updateSeries(sdata, data, prev, now);
                    }
                }
            }
        }
    }
    //遅延更新
    var self = this;
    var onTick = function () {
        self.onTick();
    }
    this.onTick = function () {
        ViewerUtil.pushTrace("Viewer.onTick");
        //ループ中で反映されるとループ前方に適用されないの為遅延で行う
        this.IsUpdateDraw = this.IsDelayUpdateDraw;
        this.IsDelayUpdateDraw = false;
        //分割数が更新されていたらデータ再設定フラグ
        var updateRowColumn = (this.Column != Column || this.Row != Row);
        var updateData = false;
        //データ更新要求
        if (this.viewerData != viewerData || (viewerData != null && viewerData.isUpdate)) {
            updateData = true;
            this.viewerData = viewerData;
        }
        ViewerUtil.setTrace("1");
        //分割数が変わっているのでデータ再設定
        if (updateRowColumn)
            updateData = true;
        //シリーズの先頭が変わってるのでデータ再設定
        if (SeriesIndex != this.SeriesIndex) {
            updateData = true;
            this.SeriesIndex = SeriesIndex;
        }
        //リサイズ要素
        // 横幅および高さ
        // 分割数
        if ($(this.Element).width() != this.Width || $(this.Element).height() != this.Height ||
            updateData
        ) {
            //設定を反映するので実際の値にあわせる
            this.Width = $(this.Element).width();
            this.Height = $(this.Element).height();
            this.Row = Row;
            this.Column = Column;

            //シリーズパネル要素の数を合わせる、できるだけデータの再設定をなくす
            this.SeriesPanels = ViewerUtil.sortPanelFromDatas(this.SeriesPanels, this.viewerData.SeriesDatas, this.SeriesIndex, Row * Column);
            for (var i = 0; i < Row * Column; i++) {
                if (this.SeriesPanels[i] == null) {
                    this.SeriesPanels[i] = new SeriesPanel(this);
                }
                this.SeriesPanels[i]._setSeriesIndex(i + this.SeriesIndex);
            }
            //シリーズパネルの位置再設定
            var sw = Math.floor(this.Width / Column);
            var sh = Math.floor(this.Height / Row);
            for (var y = 0; y < Row; y++) {
                for (var x = 0; x < Column; x++) {
                    this.getSeriesPanel(x, y).setRect(x * sw, y * sh, sw, sh);
                }
            }
        }
        ViewerUtil.setTrace("2");

        //データ再設定
        if (updateData) {
            if (this.viewerData == null) {
                for (var i = 0; i < this.SeriesPanels.length; i++) {
                    this.SeriesPanels[i].setSeriesData(null);
                }
            } else {
                var panels = new Array();
                for (var i = 0; i < this.SeriesPanels.length; i++) {
                    var s = this.viewerData.SeriesDatas[i + this.SeriesIndex];
                    if (typeof s == 'undefined')
                        s = null;
                    var p = this.SeriesPanels[i];
                    p.setSeriesData(s);
                }
            }
        }
        ViewerUtil.setTrace("3");
        //各パネル更新
        for (var y = 0; y < Row; y++) {
            for (var x = 0; x < Column; x++) {
                this.getSeriesPanel(x, y).onTickBefor();
            }
        }
        for (var y = 0; y < Row; y++) {
            for (var x = 0; x < Column; x++) {
                this.getSeriesPanel(x, y).onTick();
            }
        }
        ViewerUtil.setTrace("4");
        //更新完了
        if (viewerData != null)
            viewerData.isUpdate = false;
        this.IsUpdateDraw = false;
        ViewerUtil.setTrace("5");
        //遅延実行
        var item = null;
        while (item = invokeItem.shift()) {
            item();
        }
        ViewerUtil.setTrace("6");
        ImageLoader.Run();
        ViewerUtil.setTrace("7");
        ViewerUtil.popTrace();
    }
    ViewerUtil.Events.onTickEvents.push(onTick);
    ViewerUtil.Viewers.push(this);
    this.onInit();
    ViewerUtil.Tick();
}
ViewerPanel.prototype = {
    IsEnable: true,
    onInit: function () {
        var self = this;
        var sop = null;
        var series = null;
        var isseriesEvent = false;
        var point = null;
        var touchs = new Array();
        var JudgmentCount = 0;
        var analyze = function () {
            var ret = new Object();
            var x = 0;
            var y = 0;
            for (var i = 0; i < touchs.length; i++) {
                ret['x' + i] = touchs[i].point.x;
                ret['y' + i] = touchs[i].point.y;
                x += touchs[i].point.x;
                y += touchs[i].point.y;
            }
            ret['center'] = new Object();
            ret['center'].x = x / touchs.length;
            ret['center'].y = y / touchs.length;
            if (touchs.length == 2) {
                var p0 = touchs[0].point;
                var p1 = touchs[1].point;
                ret.len = Math.sqrt(
                    (p1.x - p0.x) * (p1.x - p0.x) +
                    (p1.y - p0.y) * (p1.y - p0.y));
            }
            return ret;
        }
        var start = null;
        var prev = null;
        var startindex = 0;
        var skipmode = "";
        var maxtouch = 0;
        var tick = function (viewer) {
            switch (skipmode) {
                case "next":
                    viewer.setSopIndex(1, "current");
                    break;
                case "prev":
                    viewer.setSopIndex(-1, "current");
                    break;
            }
        }
        var touchCtrl = function (state, e, seriespanel) {
            switch (state) {
                case "start":
                    prev = start = analyze();
                    //                    JudgmentCount = 0;
                    //return;
                    break;
                case "move":
                    //                    JudgmentCount++;
                    //                    if (JudgmentCount < 6)
                    //                        return;
                    //                    else {
                    //                        if (JudgmentCount == 6) {
                    //                            state = "start";
                    //                        }
                    //                    }
                    break;
                case "end":
                    break;
            }
            switch (touchs.length) {
                case 2:
                    //どの座標を取るかわからなくなるのでキャンセル
                    if (maxtouch == 3)
                        return;
                    switch (state) {
                        case "start":
                            var dat = seriespanel.getData();
                            if (dat) {
                                if (dat.getSync()) {
                                    for (var i = 0; i < dat.Viewer.SeriesDatas.length; i++) {
                                        var series = dat.Viewer.SeriesDatas[i];
                                        if (series && series.getSync()) {
                                            series.baseScale = series.ImageScale;
                                            series.baseLeft = series.ImageLeft;
                                            series.baseTop = series.ImageTop;
                                        }
                                    }
                                } else {
                                    dat.baseScale = dat.ImageScale;
                                    dat.baseLeft = dat.ImageLeft;
                                    dat.baseTop = dat.ImageTop;
                                }
                                seriespanel.setSelect();
                            }
                            break;
                        case "move":
                            var now = analyze();
                            var dat = seriespanel.getData();
                            if (dat) {
                                if (dat.getSync()) {
                                    for (var i = 0; i < dat.Viewer.SeriesDatas.length; i++) {
                                        var series = dat.Viewer.SeriesDatas[i];
                                        if (series && series.getSync()) {
                                            var scale = series.baseScale * (now.len / start.len);
                                            series.setScale(scale);
                                            series.setMove(series.baseLeft + now.center.x - start.center.x, series.baseTop + now.center.y - start.center.y);
                                        }
                                    }
                                } else {
                                    var scale = dat.baseScale * (now.len / start.len);
                                    if (scale > 4)
                                        scale = 4;
                                    if (scale < 0.25)
                                        scale = 0.25;
                                    if (isNaN(scale))
                                        return;
                                    dat.setScale(scale);
                                    dat.setMove(dat.baseLeft + now.center.x - start.center.x, dat.baseTop + now.center.y - start.center.y);
                                }
                            }
                            break;
                        case "end":
                            break;
                    }
                    break;
                case 3:
                    {
                        switch (state) {
                            case "start":
                                skipmode = "";
                                var dat = seriespanel.getData();
                                if (dat) {
                                    seriespanel.setSelect();
                                    startindex = dat.getSopIndex();
                                }
                                break;
                            case "move":
                                var now = analyze(ViewerUtil.getTouches(e, seriespanel.Element));
                                var lentotal = now.y1 - start.y1;
                                if (Math.abs(lentotal) > 50) {
                                    if (lentotal > 0) {
                                        seriespanel.autosetSopIndex(1);
                                    } else {
                                        seriespanel.autosetSopIndex(-1);
                                    }
                                    prev = now;
                                }
                                break;
                            case "end":
                                seriespanel.autosetSopIndex(0);
                                break;
                        }
                    }
                    break;
            }
        }


        var mdown = function (e) {
            //領域外無効
            var p = ViewerUtil.getElementPoint(self.Element, e);
            if (!self.isHit(p.x, p.y))
                return;
            //同じIDが残っていたら削除
            for (var i = 0; i < touchs.length; i++) {
                if (touchs[i].id == e.pointerId) {
                    touchs.splice(i, 1);
                    break;
                }
            }

            //Windowsタッチ座標登録
            if (window.navigator.msPointerEnabled) {
                if (e.button != 0)
                    return;
                touchs.push({ id: e.pointerId, point: { x: e.pageX, y: e.pageY} });
            } else {
                if (ViewerUtil.isTouch) {
                    touchs = new Array();
                    var t = ViewerUtil.getTouches(e);
                    for (var i = 0; i < t.length; i++) {
                        touchs.push({ id: i, point: { x: t[i].pageX, y: t[i].pageY} });
                    }
                } else {
                    touchs = new Array();
                    touchs.push({ id: 0, point: { x: e.pageX, y: e.pageY} });
                }
            }
            if (maxtouch < touchs.length) {
                maxtouch = touchs.length;
            }
            self.setEventMode(touchs.length == 1 ? "single" : "multi");
            if (!self.IsEnable)
                return;
            if (!series) {
                var p = ViewerUtil.getElementPoint(self.Element, e);
                point = p;
                series = self.getSeriesPanelFromPoint(p.x, p.y);
                isseriesEvent = false;
                if (series) {
                    p = series.ToLocalPoint(p.x, p.y);
                    if (series.onEvent("down", e)) {
                        isseriesEvent = true;
                        return;
                    }
                    sop = series.getSopPanelFromPoint(p.x, p.y);
                    if (sop == null || sop.getData() == null) {
                        var data = series.getData();
                        if (data != null && data.SopDatas.length > 0) {
                            sop = data.SopDatas[data.SopIndex];
                        }
                    } else {
                        sop = sop.getData();
                    }
                    if (sop && sop.sopPanel) {
                        sop.sopPanel.setSelect();
                    }
                } else {
                    sop = null;
                }
            }
            switch (touchs.length) {
                case 0:
                    break;

                //シングル                                                
                case 1:
                    self.onEvent(sop, "down", e);
                    break;
                //マルチタッチ                                              
                default:
                    ViewerToolsCommit();
                    self.onEvent(sop, "up", e);
                    touchCtrl("start", e, series);
                    break;
            }
        }
        var mmove = function (e) {
            if (touchs.length == 0)
                return;
            //Windowsタッチ座標更新
            if (window.navigator.msPointerEnabled) {
                for (var i = 0; i < touchs.length; i++) {
                    if (touchs[i].id == e.pointerId) {
                        touchs[i].point = { x: e.pageX, y: e.pageY };
                        break;
                    }
                }
            } else {
                if (ViewerUtil.isTouch) {
                    touchs = new Array();
                    var t = ViewerUtil.getTouches(e);
                    for (var i = 0; i < t.length; i++) {
                        touchs.push({ id: i, point: { x: t[i].pageX, y: t[i].pageY} });
                    }
                } else {
                    touchs[0].point = { x: e.pageX, y: e.pageY };
                }
            }
            if (self.IsEnable) {
                switch (touchs.length) {
                    case 0:
                        break;
                    //シングル                                                
                    case 1:
                        var p = ViewerUtil.getElementPoint(self.Element, e);
                        if (point && p.x == point.x && p.y == point.y)
                            return;
                        point = p;
                        if (series == null)
                            return;
                        if (isseriesEvent) {
                            series.onEvent("move", e);
                        } else {
                            self.onEvent(sop, "move", e);
                        }
                        break;
                    //マルチタッチ                                               
                    default:
                        touchCtrl("move", e, series);
                        break;
                }
            }
        }
        var mup = function (e) {
            if (window.navigator.msPointerEnabled) {
                if (e.button != 0)
                    return;
            }
            if (self.IsEnable && series) {
                switch (touchs.length) {
                    case 0:
                        break;
                    //シングル                                                
                    case 1:
                        if (isseriesEvent) {
                            series.onEvent("up", e);
                        } else {
                            self.onEvent(sop, "up", e);
                        }
                        break;
                    default:
                        touchCtrl("end", e, series);
                        break;
                }
            }
            //Windowsタッチ座標削除
            //            if (window.navigator.msPointerEnabled) {
            //                for (var i = 0; i < touchs.length; i++) {
            //                    if (touchs[i].id == e.pointerId) {
            //                        touchs.splice(i, 1);
            //                        break;
            //                    }
            //                }
            //            } else {
            //                if (ViewerUtil.isTouch) {
            //                    touchs = new Array();
            //                    var t = ViewerUtil.getTouches(e);
            //                    for (var i = 0; i < t.length; i++) {
            //                        touchs.push({ id: i, point: { x: t[i].pageX, y: t[i].pageY} });
            //                    }
            //                } else {
            //                    touchs = new Array();
            //                }
            //            }
            touchs = new Array();
            if (touchs.length == 0) {
                series = null;
                maxtouch = 0;
            }
        }
        ViewerUtil.setUIDeviceEvent(self.Element, mdown, mmove, mup);
    }
};

var ViewerUtil = {};
ViewerUtil.TickTime = 200;
ViewerUtil.TryTickTime = 500;
//割り込みイベントが多く
//setTimeoutで割り込めない状況時に
//TryTickを行うと一定時間たっていた場合はTickが実行される
ViewerUtil.TryTick = function () {
    var time = new Date() - ViewerUtil.PrevTick;
    if (time > ViewerUtil.TryTickTime) {
        ViewerUtil.Tick();
    }
}
ViewerUtil.PrevTick = new Date();
ViewerUtil.TimerId = null;
ViewerUtil.isTick = false;
ViewerUtil.Trace = new Array();
ViewerUtil.TraceMsg = "";
ViewerUtil.clearTrace = function () {
    ViewerUtil.Trace.length = 0;
    ViewerUtil.setTrace("");
}
ViewerUtil.setTrace = function (msg) {
    ViewerUtil.TraceMsg = msg;
}
ViewerUtil.pushTrace = function (msg) {
    ViewerUtil.Trace.push(msg);
    ViewerUtil.setTrace("");
}
ViewerUtil.popTrace = function () {
    ViewerUtil.Trace.pop();
    ViewerUtil.setTrace("");
}
ViewerUtil.Tick = function () {
    if (ViewerUtil.isTick)
        return;
    ViewerUtil.isTick = true;
    try {
        ViewerUtil.Events.onTick();
    } catch (e) {
        ViewerUtil.writeLog("TickException(" + e + "):" + ViewerUtil.Trace.join(" ") + "(" +  ViewerUtil.TraceMsg + ")");
        ViewerUtil.clearTrace();
    }
    if (ViewerUtil.TimerId)
        clearTimeout(ViewerUtil.TimerId)
    ViewerUtil.TimerId = setTimeout(ViewerUtil.Tick, ViewerUtil.TickTime);
    ViewerUtil.PrevTick = new Date();
    ViewerUtil.isTick = false;
}
ViewerUtil.setElementRect = function (element, rect) {
    $(element).css({ top: rect.Top, left: rect.Left });
    $(element).width(rect.Width).
        height(rect.Height);
}
ViewerUtil.compElementRect = function (element, rect) {
    var pos = $(element).position();
    return pos.left == rect.Left &&
        pos.top == rect.Top &&
        parseInt(element.style.width) == rect.Width &&
        parseInt(element.style.height) == rect.Height;
}
ViewerUtil.setState=function(name,state)
{
    ViewerUtil.States[name] = state;
}
ViewerUtil.States = {
    "ImageInfo": false
};
ViewerUtil.AutoCacheLevel = 1;//キャッシュ有無 0:なし 1:Preview 2:Full
ViewerUtil.Events = {
    onSelectSeriesEvents: new Array(),
    onSelectSopEvents: new Array(),
    onLoadSeriesEvents: new Array(),
    onLoadSopEvents: new Array(),
    onTickEvents: new Array(),
    onTickViewerEvents: new Array(),
    onTickSeriesEvents: new Array(),
    onTickSopEvents: new Array(),
    onDrawEndEvents: new Array(),
    onInitSopEvents: new Array(),
    onTimeOutEvents: new Array(),
    onSelectSeries: function (series) {
        for (var i = 0; i < this.onSelectSeriesEvents.length; i++) {
            this.onSelectSeriesEvents[i](series);
        }
    },
    onSelectSop: function (sop) {
        for (var i = 0; i < this.onSelectSopEvents.length; i++) {
            this.onSelectSopEvents[i](sop);
        }
    },
    onLoadSeries: function (series) {
        for (var i = 0; i < this.onLoadSeriesEvents.length; i++) {
            this.onLoadSeriesEvents[i](series);
        }
    },
    onLoadSop: function (sop) {
        for (var i = 0; i < this.onLoadSopEvents.length; i++) {
            this.onLoadSopEvents[i](sop);
        }
    },
    onTick: function () {
        ViewerUtil.clearTrace();
        ViewerUtil.pushTrace("Core.onTick");
        for (var i = 0; i < this.onTickEvents.length; i++) {
            this.onTickEvents[i]();
        }
        var removeevents = new Array();
        for (var i = 0; i < this.onTimeOutEvents.length; i++) {
            if (this.onTimeOutEvents[i].check()) {
                this.onTimeOutEvents[i].onEvent();
                //実行したものは削除
                removeevents.push(this.onTimeOutEvents[i]);
            }
        }
        for (var i = 0; i < removeevents.length; i++) {
            this.removeTimeOutData(removeevents[i]);
        }
    },
    onTickViewer: function (viewer) {
        for (var i = 0; i < this.onTickViewerEvents.length; i++) {
            this.onTickViewerEvents[i](viewer);
        }
    },
    onTickSeries: function (series) {
        for (var i = 0; i < this.onTickSeriesEvents.length; i++) {
            this.onTickSeriesEvents[i](series);
        }
    },
    onTickSop: function (sop) {
        for (var i = 0; i < this.onTickSopEvents.length; i++) {
            this.onTickSopEvents[i](sop);
        }
    },
    onDrawEnd: function (obj) {
        for (var i = 0; i < this.onDrawEndEvents.length; i++) {
            this.onDrawEndEvents[i](obj);
        }
    },
    onInitSop: function (obj,init) {
        for (var i = 0; i < this.onInitSopEvents.length; i++) {
            this.onInitSopEvents[i](obj,init);
        }
    },
    addTimeOut: function (func, time) {
        var data = {
            name: "",
            onEvent: func,
            date: new Date(),
            time: time,
            check: function () {
                return (new Date() - this.date) >= time;
            }
        };
        this.onTimeOutEvents.push(data);
        return data;
    },
    removeTimeOutData: function (data) {
        for (var i = 0; i < this.onTimeOutEvents.length; i++) {
            if (this.onTimeOutEvents[i] == data) {
                this.onTimeOutEvents.splice(i, 1);
                return;
            }
        }
    },
    removeTimeOutName: function (name) {
        for (var i = 0; i < this.onTimeOutEvents.length; i++) {
            if (this.onTimeOutEvents[i].name==name) {
                this.onTimeOutEvents.splice(i, 1);
                i--;
            }
        }
    },
    removeTimeOut: function (func) {
        for (var i = 0; i < this.onTimeOutEvents.length; i++) {
            if (func(this.onTimeOutEvents[i])) {
                this.onTimeOutEvents.splice(i, 1);
                i--;
            }
        }
    }
}
ViewerUtil.GetImageInfo = function (data) {
//    Viewer_GetImageInfo(data);
}
ViewerUtil.Draw = {
    Font: "bold 20px 'ＭＳ Ｐゴシック'"
};
ViewerUtil.PR = {
    Font: "",//未設定ならViewerUtil.Draw.Fontが使われる
    TextColor: "#FFFFFF",
    LineWidth: 1,
    LineColor: "#00FF00"
};
ViewerUtil.Cutline = {
    ActiveColor: "yellow",
    DefaultColor: "red"
};
ViewerUtil.ScrollBar = {
    BaseColor:"#a9a9a9",
    BaseColorThinOut:"#a9a9a9",
    OnCacheColor:"#537d9a",
    OnCacheColorThinOut:"#537d9a",
    DispColor:"#ffb6c1",
    DispColorThinOut: "#ffb6c1"
};
ViewerUtil.isLoop = false;
ViewerUtil.SeriesCacheCount = 1;
ViewerUtil.PreLoadType = "Order"; // Order,Both
ViewerUtil.PreLoadCount = 2;
ViewerUtil.WindowLevelCommitTime = 1000;
ViewerUtil.isTouch = ('ontouchstart' in window);
ViewerUtil.getElementPoint = function (element, e) {
    var _isTouch = (window.event && ('changedTouches' in window.event)) ? true : false;
    var pageX = (_isTouch ? event.changedTouches[0].pageX : e.pageX);
    var pageY = (_isTouch ? event.changedTouches[0].pageY : e.pageY);
    var offset = $(element).offset();
    return {
        x: pageX - offset.left,
        y: pageY - offset.top
    };
}
ViewerUtil.setCapture = function (element, move, up) {
    //IE9以降のブラウザおよびその他ブラウザ
    if (window.addEventListener) {
        window.addEventListener("mousemove", move, true);
        window.addEventListener("mouseup", up, true);
        window.addEventListener("touchmove", move, true);
        window.addEventListener("touchend", up, true);
    }
    else {
        //IE9以前のブラウザ
        if (element.setCapture) {
            //            if(element.attachEvent)
            //                element.attachEvent("onlosecapture", releaseCapture);
            element.setCapture();
        }
        $(element).bind({
            'touchmove mousemove': function (e) {
                e.preventDefault();
                move(e);
            },
            'touchend mouseup touchcancel': function (e) {
                up(e);
                $(this).unbind("mousemove").unbind("mouseup");
                $(this).unbind("touchmove").unbind("touchend").unbind("touchcancel");
            }
        });
        return true;
    }
}
ViewerUtil.releaseCapture = function (element, move, up) {
    //IE9以降のブラウザおよびその他ブラウザ
    if (window.removeEventListener) {
        if (navigator.msPointerEnabled) {
            window.removeEventListener('MSPointerMove', move, true);
            window.removeEventListener("MSPointerUp", _up, true);
        } else {
            window.removeEventListener("mousemove", move, true);
            window.removeEventListener("mouseup", up, true);
            window.removeEventListener("touchmove", move, true);
            window.removeEventListener("touchend", up, true);
        }
    }
    else {
        //IE9以前のブラウザ
        if (element.releaseCapture) {
            element.releaseCapture();
        }
    }
}

ViewerUtil.setUIDeviceEvent = function (element, down, move, up) {
    //    var _up = function (e) {
    //        up(e);
    //        ViewerUtil.releaseCapture(element, move, _up);
    //    }
    //    $(element).bind({
    //        'touchstart mousedown': function (e) {
    //            e.preventDefault();
    //            down(e);
    //            ViewerUtil.setCapture(element, move, _up);
    //        }
    //    });
    if (window.addEventListener) {
        if (navigator.msPointerEnabled) {
            window.addEventListener('MSPointerDown', down, true);
            window.addEventListener('MSPointerMove', move, true);
            window.addEventListener("MSPointerUp", up, true);
            window.addEventListener("MSPointerCancel", up, true);
        } else {
            window.addEventListener("touchstart", down, false);
            window.addEventListener("mousedown", down, true);
            window.addEventListener("mousemove", move, true);
            window.addEventListener("mouseup", up, true);
            window.addEventListener("touchmove", move, false);
            window.addEventListener("touchend", up, false);
            window.addEventListener("touchcancel", up, false);
        }
    } else {
        $(element).bind({
            'touchstart mousedown': function (e) {
                e.preventDefault();
                down(e);
                if (element.setCapture) {
                    element.setCapture();
                }
            },
            'touchmove mousemove': function (e) {
                e.preventDefault();
                move(e);
            },
            'touchend mouseup touchcancel': function (e) {
                up(e);
                if (element.releaseCapture) {
                    element.releaseCapture();
                }
            }
        });
    }
}
ViewerUtil.targetElement = null;
ViewerUtil.prevPoint = null;
ViewerUtil.setUIDeviceCanvasEvent = function (element, down, move, up) {
    element.isMouseDown = false;
    element.isMouseDown = false;
    var _move = function (e) {
        if (!element.isMouseDown)
            return;
        e.preventDefault();
        //前と同じ座標ははじく
        if (!ViewerUtil.isTouch && ViewerUtil.prevPoint && e.pageX == ViewerUtil.prevPoint.x &&
            e.pageY == ViewerUtil.prevPoint.y)
            return;
        ViewerUtil.prevPoint = { x: e.pageX, y: e.pageY };
        move(e);
    };
    var _up = function (e) {
        up(e);
        ViewerUtil.releaseCapture(element, _move, _up);
        element.isMouseDown = false;
    }
    var self = null;
    if (navigator.msPointerEnabled) {
        window.addEventListener('MSPointerDown', down, true);
        window.addEventListener('MSPointerMove', move, true);
        window.addEventListener("MSPointerUp", _up, true);
    } else {
        $(element).bind({
            'touchstart mousedown': function (e) {
                ViewerUtil.targetElement = this;
                e.preventDefault();
                down(e);
                ViewerUtil.prevPoint = { x: e.pageX, y: e.pageY };
                ViewerUtil.setCapture(element, _move, _up);
                element.isMouseDown = true;
            }
        });
    }
}
ViewerUtil.setUIDeviceButtonEvent = function (element, click) {
    $(element).bind({
        'touchstart mousedown': function (e) {
            e.preventDefault();
            var end = function (obj) {
                $(obj).unbind("mousemove").unbind("mouseup");
                $(obj).unbind("touchmove").unbind("touchend");
                $(obj).unbind("touchcancel").unbind("mouseout");
            }
            $(this).bind({
                'touchmove mousemove': function (e) {
                    e.preventDefault();
                },
                'touchend mouseup': function (e) {
                    click(e);
                    end(this);
                },
                'touchcancel mouseout': function (e) {
                    end(this);
                }
            });
        }
    });
}
//データの並び順にパネルを並べる
ViewerUtil.sortPanelFromDatas = function (panels, datas, index, count) {
    var ret = new Array();
    var panels2 = new Array();
    //パネルのコピー
    jQuery.each(panels, function () {
        panels2.push(this);
    });
    //コピーされたパネル配列からデータ検索
    var search = function (data) {
        var p = null;
        jQuery.each(panels2, function () {
            if (this.getData() == data) {
                p = this;
                return false;
            }
        });
        return p;
    }
    //配置予定のデータをすでに持っているパネルを配置先に移動
    for (var i = 0; i < count; i++) {
        ret[i] = null;
        var d = datas[i + index];
        if (d) {
            var p = search(d);
            ret[i] = p;
            if (p != null) {
                for (var n = 0; n < panels2.length; n++) {
                    if (panels2[n] == p) {
                        panels2.splice(n, 1);
                        break;
                    }
                }
            }
        }
    }
    //使われなかったパネルを可能なら再利用
    for (var i = 0; i < count; i++) {
        if (ret[i] == null) {
            if (panels2.length > 0) {
                ret[i] = panels2.shift();
            } else
                break;
        }
    }
    //あまったパネルを開放
    while (panels2.length > 0) {
        var p = panels2.pop();
        p.Dispose();
    }
    return ret;
}
//ユーザーデータからSeriesDataの初期化
ViewerUtil.initSeriesData = function (seriesdata) {
    var loc = 0;
    for (var i = 0; i < seriesdata.SopDatas.length; i++) {
        if (seriesdata.SopDatas[i].SliceThickness) {
            seriesdata.SopDatas[i].SliceThicknessLocation = loc;
            loc += seriesdata.SopDatas[i].SliceThickness;
        } else {
            seriesdata.SopDatas[i].SliceThicknessLocation = null;
        }
    }
}
//ユーザーデータからSopDataの初期化
ViewerUtil.initSopData = function (sopdata, param) {
    var space = [1, 1];
    var unit = "pixel";
    if (param.PixelSpacing != "") {
        space = param.PixelSpacing.split('\\');
        sopdata.XLength = Number(space[0]);
        sopdata.YLength = Number(space[1]);
        unit = "mm";
    }
    var url = "GetImage.aspx?sk=" + param.ExData.SKey + "&key=" + escape(param.ImageKey);
    sopdata.initSopData(url, "wc=" + param.WindowCenter + "&ww=" + param.WindowWidth, param.Columns, param.Rows, Number(space[0]), Number(space[1]), unit);
    sopdata.DefaultWindowCenter = Number(param.WindowCenter);
    sopdata.DefaultWindowWidth = Number(param.WindowWidth);
    sopdata.SliceLocation = (param.SliceLocation != "") ? Number(param.SliceLocation) : null;
    sopdata.SliceThickness = (param.SliceThickness != "") ? Number(param.SliceThickness) : null;
    sopdata.SliceThicknessLocation = null;

    //カットライン用
    sopdata.ImageOrientationPatient = new Array();
    if (param.ImageOrientationPatient != "" && param.ImageOrientationPatient!=null) {
        var tmp = param.ImageOrientationPatient.split("\\");
        for (var i = 0; i < tmp.length; i++) {
            sopdata.ImageOrientationPatient.push(Number(tmp[i]));
        }
    }
    sopdata.ImagePositionPatient = new Array();
    if (param.ImagePositionPatient != "" && param.ImagePositionPatient != null) {
        var tmp = param.ImagePositionPatient.split("\\");
        for (var i = 0; i < tmp.length; i++) {
            sopdata.ImagePositionPatient.push(Number(tmp[i]));
        }
    }
    sopdata.isCutline = sopdata.ImageOrientationPatient.length == 6 && sopdata.ImagePositionPatient.length == 3;
    sopdata.ImagePositionPatient;
    sopdata.isInit = true;
}

ViewerUtil.initLog = function (element, cnt) {
    this.logElement = element;
    this.logCnt = 0;
    this.logMax = cnt;
    this.log = [];
    this.lastlog = "";
    this.logNo = 0;
}
ViewerUtil.setLogDisp = function (disp) {
    this.logElement.style.display = (disp)?"block":"none";
}
ViewerUtil.writeLog = function (text) {
    try {
        if (this.lastlog != text) {
            this.logCnt = 1;
            this.lastlog = text;
        }
        else {
            this.logCnt++;
            this.log.pop();
            text = text + " " + this.logCnt;
        }
        this.log.push(this.logNo + ":" + text);
        this.logNo++;
        while (this.log.length > this.logMax) {
            this.log.shift();
        }
        this.logElement.innerHTML = this.log.join("<BR/>");
    } catch (e) {
        ViewerUtil.Exception(e);
    }
}
ViewerUtil.Exception=function(e){
}
ViewerUtil.Viewers = new Array();
ViewerUtil._ViewersLoadIndex = 0;
ViewerUtil.getLoadImage = function () {
    if (ViewerUtil.Viewers.length == 0) {
        return null;
    }
    var index = ViewerUtil._ViewersLoadIndex;
    do {
        var img = ViewerUtil.Viewers[ViewerUtil._ViewersLoadIndex].getLoadImage();
        if (img) {
            return img;
        }
        ViewerUtil._ViewersLoadIndex++;
        if (ViewerUtil.Viewers.length <= ViewerUtil._ViewersLoadIndex) {
            ViewerUtil._ViewersLoadIndex = 0;
        }
    } while (index != ViewerUtil._ViewersLoadIndex);
    return null;
}
ViewerUtil.getImageInfoData = function () {
    if (ViewerUtil.Viewers.length == 0) {
        return null;
    }
    var index = ViewerUtil._ViewersLoadIndex;
    do {
        var img = ViewerUtil.Viewers[ViewerUtil._ViewersLoadIndex].getImageInfoData();
        if (img) {
            return img;
        }
        ViewerUtil._ViewersLoadIndex++;
        if (ViewerUtil.Viewers.length <= ViewerUtil._ViewersLoadIndex) {
            ViewerUtil._ViewersLoadIndex = 0;
        }
    } while (index != ViewerUtil._ViewersLoadIndex);
    return null;
}
ViewerUtil.GetImageInfoIsRequest = false;
ViewerUtil.getImageInfoResult = function()
{
    ViewerUtil.GetImageInfoIsRequest = false;
    ImageLoader.Run();
}
ViewerUtil.getImageInfoRequest = function (flag,obj)
{
    if (flag)
    {
        ViewerUtil.GetImageInfoIsRequest = false;
    }
    if (ViewerUtil.GetImageInfoIsRequest == false) {
        var data = null;
        if (obj) {
            data = obj;
        } else {
            data = ViewerUtil.getImageInfoData();
        }
        if (data == null) {
            return;
        }
        ViewerUtil.GetImageInfoIsRequest = true;
        data.isImageInfoRequest = true;
        ViewerUtil.GetImageInfo(data);
    }
}
ViewerUtil.ie = (function () {
   var undef, v = 3, div = document.createElement('div');
   while (
       div.innerHTML = '<!--[if gt IE '+(++v)+']><i></i><![endif]-->',
       div.getElementsByTagName('i')[0]
   );
   return v> 4 ? v : undef;
}());
ViewerUtil.isIE6 = function () {
    return this.ie == 6;
}
ViewerUtil.getTouches = function (e) {
    var _touchs = new Array();
    if (e.originalEvent) {
        if (e.originalEvent.touches) {
            return e.originalEvent.touches;
        }
        _touchs.push({ id: 0, point: { x: e.originalEvent.pageX, y: e.originalEvent.pageY} });
    } else {
        if (e.touches) {
            return e.touches;
        }
        _touchs.push({ id: 0, point: { x: e.pageX, y: e.pageY} });
    }
    return _touchs;
}
ViewerUtil.initEventSeries = function (seriespanel) {
}
//共通アクティブ状態フラグ
function ImageActive(category) {
    this.isActive = true;
    this.Category = category;
    this.setIsActive = function (active) {
        this.isActive = active;
    }
    this.getIsActive = function () {
        if (!this.isActive)
            return false;
        for (var i = 0; i < this.Actives.length; i++) {
            if (!this.Actives[i].getIsActive())
                return false;
        }
        return true;
    }
    this.setActive = function (sub) {
        if (sub == this)
            return;
        for (var i = 0; i < this.Actives.length; i++) {
            if (this.Actives[i].Category == sub.Category) {
                this.Actives[i] = sub;
                return;
            }
        }
        this.Actives.push(sub);
    }
    this.Actives = new Array();
}
function ImageGroup(category,owner) {
    this.Images = new Array();
    this.Category = category;
    this.Owner = owner;
    var Active = new ImageActive(category);
    this.count = 0;
    //今読み込み中のものを含めてクリア終了処理用
    this.dispose = function () {
        Active.setIsActive(false);
        this.clear();
    }
    //読み込みリストのクリア
    //今読み込み中のものはOK
    this.clear = function () {
        for (var i = 0; i < this.Images.length; i++) {
            var obj = this.Images[i];
            if (!obj.isLoading) {
                if (obj.Image) {
                    obj.Image.loaderCancel();
                }
                obj.Image = null;
            }
        }
        this.Images = new Array();
        Active = new ImageActive(this.Category);
        Active.dbgOwner = this;
        this.gc();
    }
    this.gc = function () {
        for (var i = 0; i < this.Images.length; i++) {
            if (this.Images[i].Image == null) {
                this.Images.splice(i, 1); i--;
            }
        }
    }
    this.setLoadImage = function (img) {
        var ctrl;
        this.count++;
        if(this.count%16==0)
            this.gc();
        this.Images.push(img);
        if (img.Active)
            img.Active.setActive(Active);
        else
            img.Active = Active;
        img.isLoading = false;
    }
    this.getLoadImage = function () {
        var obj = null;
        while (obj = this.Images.shift()) {
            if (obj.Active.getIsActive() && obj.isLoading == false) {
                return obj;
            }
        }
        return null;
    }
}
var ImageLoader = {
    RetryTime: 20000,
    RetryCount: 4,
    MaxLodingCount: 4,
    LoadingImages:new Array()
};
ImageLoader.setLoadingImage = function (obj) {
    obj.loadingStartTime = new Date();
    obj.retryCount = 0;
    for (var i = 0; i < this.LoadingImages.length; i++) {
        if (this.LoadingImages[i] == null) {
            this.LoadingImages[i] = obj;
            obj.loadingImageIndex = i;            
            return;
        }
    }
    this.LoadingImages.push(obj);
    obj.loadingImageIndex = this.LoadingImages.length - 1;
}
ImageLoader.removeLoadingImage = function (img) {
    if (img.loadingImageIndex == -1)
        return;
    this.LoadingImages[img.loadingImageIndex] = null;
    img.loadingImageIndex = -1;
}
ImageLoader.checkLoadingImage = function () {
    var date = new Date();
    for (var i = 0; i < this.LoadingImages.length; i++) {
        var obj = this.LoadingImages[i];
        if (obj) {
            var img = obj.Image;
            if (img) {
                if ((date - obj.loadingStartTime) > ImageLoader.RetryTime) {
                    obj.retryCount++;
                    if (obj.retryCount >= ImageLoader.RetryCount) {
                        this.LoadingImages[i] = null;
                        obj.loadingImageIndex = -1;
                        continue;
                    }
                    obj.loadingStartTime = new Date();
                    img.src = "";
                    img.loadStart();
                }
            }
        }
    }
}
ImageLoader.canLoad = function () {
    for (var i = 0; i < ImageLoader.MaxLodingCount; i++) {
        if (this.LoadingImages[i])
            continue;
        return true;
    }
    return false;
}
ImageLoader.getLodingCount = function () {
    var count = 0;
    for (var i = 0; i < ImageLoader.MaxLodingCount; i++) {
        if (this.LoadingImages[i]) {
            count++;
        }
    }
    return count;
}
ImageLoader.GetImageCount = 0;
ImageLoader.Run = function () {
    ImageLoader.checkLoadingImage();
    var getimageInfo = ImageLoader.getLodingCount() == 0;
    while (this.canLoad()) {
        var request = ViewerUtil.getLoadImage();
        //画像がないので終了
        if (!request) {
            break;
        }
        //優先Info要求　特に画像より先に取得する必要があるSOP
        if (request.onInit) {
            ViewerUtil.setState("ImageInfo", true);
            ViewerUtil.getImageInfoRequest(false, request);
            return;
        }
        if (!request.Image) {
            continue;
        }
        //画像読み込みを優先
        getimageInfo = false;

        ImageLoader.GetImageCount++;
        try {
            var img = request.Image;
            img.LoadControl = request;
            img.imageNumber = ImageLoader.GetImageCount;
            //画像の読み込み開始
            request.isLoading = true;
            //画像の読み込み完了イベント
            img.onload = function (e) {
                this.onload = function () { };
                if (this.LoadControl.IsCancel==false && this.LoadControl.Active.getIsActive())
                    this.loaderOnLoad();
                else {
                    ViewerUtil.writeLog("LoadImageCancel");
                    this.loaderCancel();
                }
                ViewerUtil.TryTick();
                ImageLoader.removeLoadingImage(this.LoadControl);
                setTimeout(function () {
                    ImageLoader.Run();
                }, 0);
            }
            img.onabort = img.onerror = function (e) {
                if (this.LoadControl.Active.getIsActive())
                    this.loaderOnError();
                else {
                    ViewerUtil.writeLog("LoadImageCancel");
                    this.loaderCancel();
                }
                setTimeout(function () {
                    ImageLoader.Run();
                }, 0);
                ViewerUtil.writeLog("ImageLoadError");
                ImageLoader.removeLoadingImage(this.LoadControl);
            }
            this.setLoadingImage(request);
            img.loadStart();
            //キャッシュなどですでに読込み完了しているとき
            if (img.complete) {
                img.onload();
            }
        } catch (e) {
            ViewerUtil.writeLog(e);
        }
    }
    if (getimageInfo) {
        ViewerUtil.setState("ImageInfo", true);
        ViewerUtil.getImageInfoRequest(true);
    } else {
        ViewerUtil.setState("ImageInfo",false);
    }
}

//ポーリング開始
ViewerUtil.Tick();

