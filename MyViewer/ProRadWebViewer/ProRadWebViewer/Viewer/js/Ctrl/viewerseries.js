/// <reference path="../../Common/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */
function SeriesData(data) {
    this.seriesPanel = null;
    this.SopDatas = new Array();
    this.BaseSopDatas = this.SopDatas;
    this.IsUpdate = false;
    this.Viewer = null;
    this.Row = 1;
    this.Column = 1;
    this.IsDataChange = false;
    this.SelectSopData = null;
    this.SeriesCacheCount = ViewerUtil.SeriesCacheCount;
    var my = this;
    this.IsUpdateScrollBar = false;
    //グループ座標変換
    this.ImageRotate = 0;
    this.ImageFlipX = false;
    this.ImageScale = 1;
    this.ImageLeft  = 0;
    this.ImageTop   = 0;
    //WL
    this.WindowCenter = 0;
    this.WindowWidth = 0;
    this.setViewer = function(viewer){
        this.Viewer = viewer;
    }

    //PR
    this.PR = null;

    //同期    
    var IsSync = false;
    this.getSync = function (value) {
        return IsSync;
    }
    this.setSync = function (value) {
        IsSync = value;
        if (value) {
            this.Viewer.syncStart(this);
        }
    }
    this.syncStart = function () {
        this.Viewer.syncStart(this);
    }
    this.SyncWork = {}
    var previewUpdate = false;
    //Index
    this.SopIndex = 0;
    var SopIndex = 0;
    //Indexの遅延反映がまだ行われていなかったらキャンセル
    this.setSopIndex = function (offset, origin) {
        if (this.SopIndex != SopIndex)
            return false;
        if (this.SopDatas.length <= 1)
            return false;
        var tmpSopIndex = SopIndex;
        //遅延WindowLevelの確定
        //this.delayWindowLevelSetup();
        var prev = SopIndex;
        switch (origin) {
            case "begin":
                tmpSopIndex = offset;
                break;
            case "current":
            case "auto":
                tmpSopIndex += offset;
                break;
            case "end":
                tmpSopIndex = (this.SopDatas.length - 1) + offset;
                break;
            case "center":
                tmpSopIndex = Math.floor(this.SopDatas.length / 2 + offset);
                break;
        }

        if (ViewerUtil.isLoop) {
            if (this.SopDatas.length <= tmpSopIndex)
                tmpSopIndex %= this.SopDatas.length;
            if (tmpSopIndex < 0)
                tmpSopIndex = this.SopDatas.length + (tmpSopIndex % this.SopDatas.length);
        } else {
            if (this.SopDatas.length <= tmpSopIndex)
                tmpSopIndex = this.SopDatas.length - 1;
            if (tmpSopIndex < 0)
                tmpSopIndex = 0;
        }
        if (prev == tmpSopIndex)
            return false;
        if (origin=="auto") {
            if (this.SopDatas[tmpSopIndex].getCacheLevel()<ViewerUtil.AutoCacheLevel)
                return false;
        }
        SopIndex = tmpSopIndex;
        if (previewUpdate) {
            var array = new Array(); //結果配列
            //上下取得配列
            var array1 = new Array();
            var array2 = new Array();
            //上へ
            if (prev > SopIndex) {
                for (var i = SopIndex; i >= 0; i--) {
                    if (!this.SopDatas[i].getIsCache()) {
                        var sop = this.SopDatas[i];
                        if (sop) {
                            array1.push(sop);
                        }
                    }
                }
                for (var i = SopIndex + 1; i < this.SopDatas.length; i++) {
                    if (!this.SopDatas[i].getIsCache()) {
                        var sop = this.SopDatas[i];
                        if (sop) {
                            array2.push(sop);
                        }
                    }
                }
            }
            //下へ
            if (prev < SopIndex) {
                for (var i = SopIndex; i < this.SopDatas.length; i++) {
                    if (!this.SopDatas[i].getIsCache()) {
                        var sop = this.SopDatas[i];
                        if (sop) {
                            array1.push(sop);
                        }
                    }
                }
                for (var i = SopIndex; i >= 0; i--) {
                    if (!this.SopDatas[i].getIsCache()) {
                        var sop = this.SopDatas[i];
                        if (sop) {
                            array2.push(sop);
                        }
                    }
                }
            }
            switch (ViewerUtil.PreLoadType) {
                case "Order":
                    array = array1.concat(array2);
                    break;
                case "Both":
                    var flag = true;
                    while (flag) {
                        flag = false;
                        if (array1.length > 0) {
                            array.push(array1.shift());
                            flag = true;
                        }
                        if (array2.length > 0) {
                            array.push(array2.shift());
                            flag = true;
                        }
                    }
                    break;
            }
            for (var i = 0; i < array.length; i++) {
                array[i].updateParam();
            }
            previewUpdate = false;
        }
        else {
            this.preload();
        }
        return true;
    }
    this.preload = function () {
        var loadlist = new Array();
        var loadlist2 = new Array();
        if (this.SeriesCacheCount > 0) {
            var index = SopIndex - Math.floor(this.SeriesCacheCount / 2);
            if (index > this.SopDatas.length - this.SeriesCacheCount) {
                index = this.SopDatas.length - this.SeriesCacheCount;
            }
            if (index < 0) {
                index = 0;
            }
            for (var i = 0; i < this.SopDatas.length; i++) {
                if (i < index || i >= (index + this.SeriesCacheCount)) {
                    //キャッシュ外
                    if (this.SopDatas[i].isInit) {
                        this.SopDatas[i].cacheOut();
                    }
                } else {
                    if (SopIndex > i) {
                        //後読み
                        loadlist2.push(i);
                    } else {
                        //先読み
                        loadlist.push(i);
                    }
                }
            }
        } else {
            this.imageGroup.clear();
            for (var i = 0; i < this.SopDatas.length; i++) {
                if (SopIndex > i) {
                    //後読み
                    loadlist2.push(i);
                } else {
                    //先読み
                    loadlist.push(i);
                }
            }
        }
        loadlist2.reverse();
        switch (ViewerUtil.PreLoadType) {
            case "Order":
                loadlist = loadlist.concat(loadlist2);
                break;
            case "Both":
                var array = new Array();
                var flag = true;
                while (flag) {
                    flag = false;
                    if (loadlist.length > 0) {
                        array.push(loadlist.shift());
                        flag = true;
                    }
                    if (loadlist2.length > 0) {
                        array.push(loadlist2.shift());
                        flag = true;
                    }

                }
                loadlist = array;
                break;
        }

        for (var i = 0; i < loadlist.length; i++) {
            var n = loadlist[i];
            //キャッシュ内
            if (this.SopDatas[n].isInit) {
                this.SopDatas[n].loadPreview();
            } else {
                this.SopDatas[n].Init();
            }
        }
    }
    this.getSopIndex = function () {
        return SopIndex;
    }
    this.updateSopIndex = function () {
        this.SopIndex = SopIndex;
    }
    this.getDispSops = function () {
        var array = new Array();
        var cnt = this.Column * this.Row;
        for (var i = 0; i < cnt; i++) {
            var sop = this.SopDatas[SopIndex+i];
            if(sop)
                array.push(sop);
        }
        return array;
    }

    //画像読込み登録
    this.imageGroup = new ImageGroup("series",this);
    this.setLoadImage = function (img) {
        this.imageGroup.setLoadImage(img);
    }
    this.getLoadImage = function () {
        return this.imageGroup.getLoadImage();
    }

    this._setSeriesPanel = function (panel) {
        this.seriesPanel = panel;
        this.preload();
    }
    this.setSopData = function (data) {
        this.SopDatas = data;
        this.IsUpdate = true;
    }
    this.cancelCacheCore = function () {
        this.imageGroup.clear();
    }
    this.cancelCacheTimeOutObj=null;
    this.cancelCache = function (preloadcnt) {
        if (this.cancelCacheTimeOutObj) {
            var cancelObj = this.cancelCacheTimeOutObj;
            ViewerUtil.Events.removeTimeOut(function (obj) {
                return obj == cancelObj;
            });
        }
        this.imageGroup.clear();
        for (var i = 0; i < this.SopDatas.length; i++) {
            if (this.SopDatas[i].getIsCache()) {
                this.SopDatas[i].onCache(false);
                //表示されていなかったらクリア
                if(!this.SopDatas[i].sopPanel)
                    this.SopDatas[i].Map.clearBackGround();
            }
        }
        //表示されているところと前後の画像を更新
        var cnt = this.Column * this.Row;
        var ind = new Array();
        for (var i = 0; i < cnt; i++) {
            ind.push(this.SopIndex + i);
        }
        for (var i = 0; i < preloadcnt * 2; i++) {
            var offset = Math.floor(i / 2);
            if (i % 2 == 0) {
                ind.push(this.SopIndex - 1 - offset);
            }
            else {
                ind.push(this.SopIndex + cnt + offset);
            }
        }
        for (var i = 0; i < ind.length; i++) {
            if (ind[i] < 0 || ind[i] >= this.SopDatas.length)
                continue;
            var sop = this.SopDatas[ind[i]];
            if (sop) {
                sop.updateParam();
                if (sop.loadPreview)
                    sop.loadPreview();
            }
        }
        //var cnt = this.Column * this.Row;
        //for (var i = -preloadcnt; i < cnt + preloadcnt; i++) {
        //    var index = this.SopIndex + i;
        //    if (index < 0 || index >= this.SopDatas.length)
        //        continue;
        //    var sop = this.SopDatas[index];
        //    if (sop) {
        //        sop.updateParam();
        //        if(sop.loadPreview)
        //            sop.loadPreview();
        //    }
        //}
        /*//キャンセル後時間経過で再読み込み
        if (preloadcnt > 0) {
            this.cancelCacheTimeOutObj = ViewerUtil.Events.addTimeOut(
                    function () {
                        var series = this.series;
                        for (var i = 0; i < series.SopDatas.length; i++) {
                            var indexs = [series.SopIndex + i, series.SopIndex - i];
                            for (var n = 0; n < 2; n++) {
                                var index = indexs[n];
                                if (index >= 0 && index < series.SopDatas.length) {
                                    if (!series.SopDatas[index].getIsCache()) {
                                        var sop = series.SopDatas[index];
                                        if (sop) {
                                            sop.updateParam();
                                            sop.loadPreview();
                                        }
                                    }
                                }
                            }
                        }
                    }
                    ,
                    2 * 1000
                    );
            this.cancelCacheTimeOutObj.series = this;
        }
        */
        previewUpdate = true;
    }
    this.setWindowLevel = function (wc, ww) {
        if (this.WindowCenter != wc || this.WindowWidth != ww) {
            if(WindowLevelCommit)
                WindowLevelCommit();
            this.WindowCenter = wc;
            this.WindowWidth = ww;
            this.cancelCache(ViewerUtil.PreLoadCount);
        }
    }
    this._setWindowLevel = function (wc, ww) {
        if (this.WindowCenter != wc || this.WindowWidth != ww) {
            this.WindowCenter = wc;
            this.WindowWidth = ww;
        }
    }
    this.reset = function (sync) {
        if (typeof sync == "undefined")
        {
            sync = true;
        }
        if (ViewerToolsCommit)
            ViewerToolsCommit();
        var reset = function (series) {
            series.setWindowLevel(0, 0);
            series.setRotate(0, 0, 0);
            series.ImageScale = 1;
            series.ImageLeft = 0;
            series.ImageTop = 0;
            for (var i = 0; i < series.SopDatas.length; i++) {
                series.SopDatas[i].reset();
            }
            series.cancelCache(ViewerUtil.PreLoadCount);
        }
        if (sync &&  this.getSync()) {
            for (var i = 0; i < this.Viewer.SeriesDatas.length; i++) {
                var series = this.Viewer.SeriesDatas[i];
                if (series && series.getSync()) {
                    reset(series);
                }
            }
        } else {
            reset(this);
        }
    }
    this.setRotate = function (rot, flipx, flipy) {
        if (flipy) {
            flipx = !flipx;
            rot += 180;
        }
        rot %= 360;
        if (this.ImageRotate != rot || this.ImageFlipX != flipx) {
            this.ImageRotate = rot;
            this.ImageFlipX = flipx;
            this.cancelCache(ViewerUtil.PreLoadCount);
        }
    }
    this.setScale = function (scale) {
        this.ImageScale = scale;
    }
    this.setMove = function (x, y) {
        this.ImageLeft = x;
        this.ImageTop  = y;
    }
    this.onCache = function (index) {
        this.IsUpdateScrollBar = true;
    }
    this.Dispose = function () {
        ViewerUtil.writeLog("SeriesDispose");
        for (var i = 0; i < this.SopDatas.length; i++) {
            if(this.SopDatas[i].Dispose)
                this.SopDatas[i].Dispose();
        }
        this.imageGroup.clear();
    }
    this.reverse = function () {
        this.updateSopIndex();
        var sopindex = SopIndex;
        var sopdata = this.SopDatas[SopIndex];
        var soplen = this.SopDatas.length;
        this.BaseSopDatas = this.BaseSopDatas.reverse();
        for (var i = 0; i < this.BaseSopDatas.length; i++) {
            this.BaseSopDatas[i].SopIndex = i;
            this.BaseSopDatas[i].thinIndex = i;
            this.BaseSopDatas[i].isUpdateAnnotation = true;
        }
        this.SopDatas = [];
        this.thinOut(soplen, true, sopdata);
        SopIndex = sopindex;
        data.IsDataChange = true;
    }
    this.thinOut = function (count, cancel, sopdata) {
        if (this.SopDatas.length == count)
            return;
        if (typeof cancel === "undefined")
            cancel = true;
        if (cancel) {
            this.cancelCacheCore();
        }
        var data = new Array();
        var sopindex;
        if (sopdata) {
            sopindex = sopdata.SopIndex;
        } else {
            sopindex = this.SopDatas[this.SopIndex].SopIndex;
        }
        this.SopDatas = data;
        if (count > 0 && this.BaseSopDatas.length > count) {
            var insertindex = -1;
            var isinsert = true;
            for (var i = 0; i < count; i++) {
                var thinIndex = Math.round(this.BaseSopDatas.length * i / count);
                data[i] = this.BaseSopDatas[thinIndex];
                if (sopindex == thinIndex) {
                    isinsert = false;
                    insertindex = i;
                } else if (sopindex > thinIndex) {
                    insertindex = i + 1;
                }
            }
            if (isinsert && insertindex != -1) {
                data.splice(insertindex, 0, this.BaseSopDatas[sopindex]);
            }
            SopIndex = insertindex;
            for (var i = 0; i < data.length; i++) {
                data[i].thinIndex = i;
            }

        } else {
            this.SopDatas = this.BaseSopDatas;
            SopIndex = sopindex;
            for (var i = 0; i < this.SopDatas.length; i++) {
                this.SopDatas[i].thinIndex = i;
                if (cancel) {
                    this.SopDatas[i].updateParam();
                }
            }
        }
        for (var i = 0; i < this.SopDatas.length; i++) {
            if (this.SopDatas[i].isInit) {
                this.SopDatas[i].isUpdateParamPreview = true;
            }
        }
        this.IsUpdate = true;
        this.preload();
    }
    //以下の関数をセット Sopのキーを渡されたら対応のパラメータをセットした値を返す
    //pr.getPRInfo(key)
    //戻り値:
    // ret.DisplayArea
    // ret.VoiLut
    // ret.Info
    this.setPRInfo = function (pr) {
        this.PR = pr;
        this.reset(false);
    }
    //Sop高層化の為の仮初期化
    for (var i = 0; i < data.length; i++) {
        var initdata = {
            series: my,
            SopIndex: i,
            data: data[i],
            isInit: false,
            getIsCache: function () { return false; },
            thinIndex: -1,
            updateAnnotation: function (name) { },
            SliceLocation: Number(data[i].SliceLocation),
            SliceThicknessLocation: 0,
            SliceThickness: Number(data[i].SliceThickness),
            isUpdateParam: false,
            reset: function () { },
            updateParam:function(){ this.isUpdateParam=true;},
            //IsInitがfalseの時に自身の初期化を行う
            Init: function () {
                if (this.isInitCall)
                    return;
                this.isInitCall = true;
                var my2 = this;
                var init = function (isinit) {
                    var sop = my2.series.BaseSopDatas[my2.SopIndex];
                    sop.SliceThicknessLocation = my2.SliceThicknessLocation;
                    sop.updateAnnotation = my2.updateAnnotation;
                    if (my2.isUpdateParam) {
                        sop.updateParam();
                    }
                    if (isinit) {
                        sop.loadPreview();
                    }
                    sop.isInit = isinit;
                    sop.data = my2.data;
                    sop.Init = function () { };
                    sop.isDraw = isinit;
                    my.IsUpdate = true;
                }
                var sop = new SopData(my, this.SopIndex, this.data);
                this.series.BaseSopDatas[this.SopIndex] = sop;
                //if (my2.thinIndex != -1) {
                //    my2.series.SopDatas[my2.thinIndex] = sop;
                //    sop.thinIndex = my2.thinIndex;
                //}
                for (var i = 0; i < my2.series.SopDatas.length; i++)
                {
                    if (my2.series.SopDatas[i] == this) {
                        my2.series.SopDatas[i] = sop;
                        sop.thinIndex = i;
                        break;
                    }
                }
                if (this.data.IsImageInfo) {
                    this.data.onInit = function () {
                        ViewerUtil.initSopData(sop, my2.data);
                        init(true);
                        ViewerUtil.getImageInfoResult();
                        sop.updateAnnotation("panel");
                        ViewerUtil.Events.onInitSop(sop,true);
                        //ViewerUtil.GetImageInfoRequest(true);
                    };
                    this.data.onError = function () {
                        ViewerUtil.getImageInfoResult();
                        sop.updateAnnotation("panel");
                        ViewerUtil.Events.onInitSop(sop, false);
                        //ViewerUtil.GetImageInfoRequest(true);
                    };
                    //ダミー初期化設定
                    this.data.Columns = 1;
                    this.data.ImageOrientationPatient = "";
                    this.data.ImagePositionPatient = "";
                    this.data.InstanceNumber = 0;
//                    this.data.IsImageInfo = false;
                    this.data.IsMultiframe = false;
                    this.data.PixelSpacing ="1\\1";
                    this.data.Rows = 1;
                    this.data.SliceLocation = "0\\0";
                    this.data.SliceThickness = 0;
                    this.data.WindowCenter = 0;
                    this.data.WindowWidth = 1;
                    init(false);
                } else {
//非同期初期化テスト用
//                    setTimeout(init, 500);
                    init(true);
                    ViewerUtil.Events.onInitSop(sop,true);
                }
            }
        };
        this.SopDatas.push(initdata);
    }
    ViewerUtil.initSeriesData(this);
//    this.thinOut(10);   
}
function SeriesPanel(viewer) {
    //SOPパネル
    this.SopPanels = new Array();
    //初期値およびDOM-Element生成
    this.Viewer = viewer;
    this.Element = document.createElement("DIV");
    this.Element.className = "SeriesPanel";
    this.Element.style.position = "absolute";
    viewer.Element.appendChild(this.Element);
    var isThinOut = false;
    var self=this;

    this.WorkPanel = document.createElement("DIV");
    self.Element.appendChild(this.WorkPanel);
    this.WorkPanel.className = "SeriesWorkPanel";


    //ScrollBarElements
    this.ScrollBarPanel = document.createElement("DIV");
    this.ScrollBarPanel.className = "ScrollBarPanel";
    this.Element.appendChild(this.ScrollBarPanel);
    this.ScrollBarUpPanel = document.createElement("DIV");
    this.ScrollBarUpPanel.className = "ScrollBarUpPanel";
    this.ScrollBarUpPanel.style.position = "absolute";
    this.ScrollBarPanel.appendChild(this.ScrollBarUpPanel);
    this.ScrollBarBodyPanel = document.createElement("CANVAS");
    this.ScrollBarBodyPanel.className = "ScrollBarBodyPanel";
    this.ScrollBarBodyPanel.style.position = "absolute";
    this.ScrollBarPanel.appendChild(this.ScrollBarBodyPanel);
    this.ScrollBarDownPanel = document.createElement("DIV");
    this.ScrollBarDownPanel.className = "ScrollBarDownPanel";
    this.ScrollBarDownPanel.style.position = "absolute";
    this.ScrollBarPanel.appendChild(this.ScrollBarDownPanel);


    this.ctx = null;
    if (typeof G_vmlCanvasManager != "undefined") {
        G_vmlCanvasManager.initElement(this.ScrollBarBodyPanel);
    }
    if (this.ScrollBarBodyPanel.getContext){
        this.scrollBarCtx = this.ScrollBarBodyPanel.getContext("2d");
    }

//    this.WorkPanel.style.height = "100%";

//    this.WorkPanel = document.createElement("DIV");
//    this.WorkPanelParent.appendChild(this.WorkPanel);
//    this.WorkPanel.style.width = "100%";
//    this.WorkPanel.style.height = "100%";
    this.ScrollBarSopPanels = new Array();

    this.SyncPanel = document.createElement("DIV");
    this.SyncPanel.className = "SeriesSyncPanel";
    this.WorkPanel.appendChild(this.SyncPanel);
    $(this.SyncPanel).hide();
    this.SyncPanel.IsShow = false;
   
    //イベント
    ViewerUtil.initEventSeries(this);

    var eventTarget = null;
    this.onEvent = function (type, e) {
        if (this.seriesData == null)
            return false;
        if (type == "down") {
            eventTarget = null;
            do {
                var p = ViewerUtil.getElementPoint(this.ScrollBarDownPanel, e);
                if (p.x >= 0 && p.y >= 0 && $(this.ScrollBarDownPanel).width() > p.x && $(this.ScrollBarDownPanel).height() > p.y) {
                    eventTarget = this.ScrollBarDownPanel;
                    break;
                }
                p = ViewerUtil.getElementPoint(this.ScrollBarUpPanel, e);
                if (p.x >= 0 && p.y >= 0 && $(this.ScrollBarUpPanel).width() > p.x && $(this.ScrollBarUpPanel).height() > p.y) {
                    eventTarget = this.ScrollBarUpPanel;
                    break;
                }
                p = ViewerUtil.getElementPoint(this.ScrollBarBodyPanel, e);
                if (p.x >= 0 && p.y >= 0 && $(this.ScrollBarBodyPanel).width() > p.x && $(this.ScrollBarBodyPanel).height() > p.y) {
                    eventTarget = this.ScrollBarBodyPanel;
                    break;
                }
                if (this.SyncPanel.IsShow) {
                    p = ViewerUtil.getElementPoint(this.SyncPanel, e);
                    if (p.x >= 0 && p.y >= 0 && $(this.SyncPanel).width() > p.x && $(this.SyncPanel).height() > p.y) {
                        eventTarget = this.SyncPanel;
                    }
                }
            } while (false);
        }
        if (eventTarget == this.ScrollBarDownPanel) {
            switch (type) {
                case "down":
                    this.setSelect();
                    this.autosetSopIndex(1);
                    break;
                case "up":
                    this.autosetSopIndex(0);
                    break;
            }
            return true;
        }
        if (eventTarget == this.ScrollBarUpPanel) {
            switch (type) {
                case "down":
                    this.setSelect();
                    this.autosetSopIndex(-1);
                    break;
                case "up":
                    this.autosetSopIndex(0);
                    break;
            }
            return true;
        }
        if (eventTarget == this.ScrollBarBodyPanel) {
            var p = ViewerUtil.getElementPoint(this.ScrollBarBodyPanel, e);
            switch (type) {
                case "down":
                case "move":
                    this.setSelect();
                    var p = ViewerUtil.getElementPoint(this.ScrollBarBodyPanel, e);
                    this.setSopIndex(Math.floor(p.y * self.seriesData.SopDatas.length / $(self.ScrollBarBodyPanel).height()), "begin");
                    break;
                case "up":
                    break;
            }
            return true;
        }
        if (eventTarget == this.SyncPanel) {
            if (type == "down") {
                this.seriesData.setSync(!this.seriesData.getSync());
            }
            return true;
        }
        return false;
    }
    //選択
    this.isSelect = function () {
        return $(this.Element).hasClass("Selected");
    }
    this.setSelect = function () {
        this.Viewer._setSelectSeries(this);
    }
    this._setSelect = function (isselect) {
//        if (this.isSelect() == isselect)
//            return;
        var sop = this.getSelectSop();
        if (isselect) {
            $(this.Element).addClass("Selected");
            if (sop == null && this.SopPanels.length > 0) this.SopPanels[0].setSelect();
            else if(sop) sop.setSelect();

        } else {
            $(this.Element).removeClass("Selected");
            if (sop) sop._setSelect(false);
        }
    }
    this.getSelectSop = function () {
        for (var i = 0; i < this.SopPanels.length; i++) {
            if (this.SopPanels[i].isSelect())
                return this.SopPanels[i];
        }
        return null;
    }
    this._setSelectSop = function (sop) {
        if (!seriesData)
            return;
        for (var i = 0; i < this.SopPanels.length; i++) {
            this.SopPanels[i]._setSelect(this.SopPanels[i] == sop);
        }
        seriesData.SelectSopData = sop.sopData;
    }
    //位置設定
    var Rect = {
        Top:0,
        Left:0,
        Width:0,
        Height:0
    };
    //データ
    this.seriesData = null;
    var seriesData = null;
    //データの設定
    this.setSeriesData = function (data) {
        if (seriesData == data)
            return;
        seriesData = data;
        if (data) {
            data._setSeriesPanel(this);
            this.split(data.Column, data.Row);
        }
        this.Viewer.setSeriesData(this.SeriesIndex, data);
    }
    //データの取得(抽象化用)
    this.getData = function () {
        return seriesData;
    }
    //分割設定(遅延設定用と現在)
    var Column = 1; var Row = 1;
    this.split = function (w, h) {
        Column = w;
        Row = h;
    }
    this.splitAutoIndex = function (w, h) {
        var index = 0;
        var sop = this.getSelectSop();
        if (sop != null && sop.getData() != null) {
            index = sop.getData().thinIndex;
        }
        this.setSopIndex(index, "begin");
        this.split(w, h);
    }
    //パネル取得（分割座標
    this.getSopPanel = function (x, y) {
        if (this.seriesData == null) {
            var p = this.SopPanels[Column * y + x];
        } else {
            var p = this.SopPanels[this.seriesData.Column * y + x];
        }
        if (typeof p == 'undefined')
            return null;
        return p;
    }
    this.getSopPanelFromIndex = function (index) {
        var p = this.SopPanels[index];
        if (typeof p == 'undefined')
            return null;
        return p;
    }
    //Sopの開始位置
    var AutoSopIndex = 0;
    this.autosetSopIndex = function (offset) {
        AutoSopIndex = offset;
    }
    //画像送り
    this.setSopIndex = function (offset, origin) {
        var data = this.getData();
        if (data) {
            return data.setSopIndex(offset, origin);
        }
        return true;
    };
    //画像読込み優先処理
    this._LodingSopIndex = 0;
    this._getLodingNextSopPanel = function () {
        for (var i = 0; i < 2; i++) {
            var sop = this.getSopPanelFromIndex(this._LodingSopIndex++);
            if (this.SopPanels.length <= this._LodingSopIndex)
                this._LodingSopIndex = 0;
            if (sop)
                return sop;
        }
        return null;
    }
    this.getLoadImage = function (disp) {
        var ret = null;
        var data = this.getData();
        if (data) {
            if (disp) {
                for (var index = 0; index < data.Row * data.Column; index++) {
                    var sop = this._getLodingNextSopPanel();
                    if (sop && sop.getData()) {
                        var data = sop.getData();
                        if (data != null && !data.isImageInfoRequest && data.isInit == false && data.data && data.data.onInit)
                            return data.data;
                        ret = data.getLoadImage();
                    }
                    if (ret)
                        return ret;
                }
            } else {
                return data.getLoadImage();
            }
        }
        return null;
    }
    //画像情報読込み優先処理
    this.getImageInfoData = function (disp) {
        var ret = null;
        var data = this.getData();
        if (data) {
            if (disp) {
                //選択優先
                var sop = this.getSelectSop();
                if (sop && sop.getData()) {
                    ret = sop.getData();
                }
                if (ret != null && !ret.data.isImageInfoRequest && ret != null && ret.isInit == false && ret.data && ret.data.onInit)
                    return ret.data;

                for (var index = 0; index < data.Row * data.Column; index++) {
                    var sop = this._getLodingNextSopPanel();
                    if (sop && sop.getData()) {
                        ret = sop.getData();
                    }
                    if (ret!=null && !ret.data.isImageInfoRequest &&  ret != null && ret.isInit == false && ret.data && ret.data.onInit)
                        return ret.data;
                }
            } else
            {
                for (var i = 0; i < data.SopDatas.length; i++)
                {
                    var ret = data.SopDatas[i];
                    if (ret.isInit == false) {
                        ret.Init();
                        ret=data.SopDatas[i];
                    }
                    if (!ret.data.isImageInfoRequest && ret.isInit == false && ret.data && ret.data.onInit)
                        return ret.data;
                }
            }
        }
        return null;
    }


    this.ToLocalPoint = function(x, y)
    {
        return {
            x: x - Rect.Left,
            y: y - Rect.Top
        };
    }
    //パネル取得（座標 SOP
    this.getSopPanelFromPoint = function (x, y) {
        var p = null;
        jQuery.each(this.SopPanels, function () {
            if (this.isHit(x, y)) {
                p = this;
                return false;
            }
        });
        return p;
    }

    //当たり判定
    this.isHit = function (x, y) {
        return (Rect.Top <= y && Rect.Left <= x && (Rect.Top + Rect.Height) > y && (Rect.Left + Rect.Width) > x);
    }
    //Seriesの位置(今のところ遅延なし)
    this.SeriesIndex = 0;
    this._setSeriesIndex = function (index) {
        this.SeriesIndex = index;
    }
    //パネルの位置設定
    this.setRect = function (x, y, w, h) {
        Rect = {
            Top: y,
            Left: x,
            Width: w,
            Height: h
        };
        this.Viewer.Config.seriesPanelInterruptResize(this, Rect);
    }
    //開放
    this.Dispose = function () {
        viewer.Element.removeChild(this.Element);
    }
    //更新処理
    this.onTickBefor = function () {
        var dat = this.getData();
        if (dat == null)
            return;
        if (AutoSopIndex != 0) {
            dat.setSopIndex(AutoSopIndex, "auto");
            for (var i = 0; i < Row * Column; i++) {
                var sop=dat.SopDatas[dat.getSopIndex()+i];
                if(sop && !sop.getIsCache())
                    return;
            }
        }
        if (dat.SopIndex != dat.getSopIndex()) {
            this.Viewer.onUpdateSopIndex(this, dat.SopIndex, dat.getSopIndex());
        }
    }
    this.onTick = function () {
        ViewerUtil.pushTrace("Series.onTick");
        var isDataChange = false;
        var isResize = false;
        var isSelectEvent = false;
        //SopData遅延初期化
        if (seriesData) {
            for (var i = 0; i < Row * Column; i++) {
                var sop = seriesData.SopDatas[i + seriesData.getSopIndex()];
                if (sop && !sop.isInit) {
                    sop.Init();
                }
            }
        }
        //分割数が更新されていたらデータ再設定フラグ
        if (this.seriesData) {
            var updateRowColumn = (this.seriesData.Column != Column || this.seriesData.Row != Row);
        }
        var updateData = updateRowColumn;
        //データ更新要求
        if (this.seriesData != seriesData || (this.seriesData && this.seriesData.IsDataChange)) {
            isDataChange = true;
            updateData = true;
            if (this.seriesData != null)
                this.seriesData.IsDataChange = false;
        }
        ViewerUtil.setTrace("1");
        if (this.seriesData != seriesData || (seriesData != null && seriesData.IsUpdate)) {
            updateData = true;
            this.seriesData = seriesData;
            if (!this.seriesData) {
                this.onInit();
            }
        }
        ViewerUtil.setTrace("2");
        var dispSync = false;
        if (this.Viewer.getData()) {
            dispSync = this.Viewer.getData().getSync();
        }
        ViewerUtil.setTrace("3");
        if (dispSync != this.SyncPanel.IsShow) {
            if (dispSync) {
                $(this.SyncPanel).show("normal");
            } else {
                $(this.SyncPanel).hide("normal");
            }
            this.SyncPanel.IsShow = dispSync;
        }
        ViewerUtil.setTrace("4");
        if (this.seriesData) {
            if ($(this.SyncPanel).hasClass("On") != this.seriesData.getSync()) {
                if (this.seriesData.getSync()) {
                    $(this.SyncPanel).addClass("On");
                } else {
                    $(this.SyncPanel).removeClass("On");
                }
            }
        }
        ViewerUtil.setTrace("6");
        var selectUpdate = "none";
        if (seriesData && seriesData.SopIndex != seriesData.getSopIndex()) {
            if (this.isSelect()) {
                var sop = this.getSelectSop();
                if (sop) {
                    var sopdata = sop.getData();
                    if (sopdata && sopdata.thinIndex < seriesData.getSopIndex()) {
                        selectUpdate = "top";
                        if (sopdata.thinIndex >= seriesData.getSopIndex() + Column * Row) {
                            selectUpdate = "end";
                        }
                    }
                }
            }
            seriesData.updateSopIndex();
            updateData = true;
        }
        ViewerUtil.setTrace("7");
        //データの更新
        if (updateData) {
            var datas = new Array();
            //シリーズパネル要素の数を合わせる、できるだけデータの再設定をなくす
            if (this.seriesData) {
                for (var i = 0; i < this.SopPanels.length; i++) {
                    var data = this.SopPanels[i].getData();
                    if (data)
                        datas.push(data);
                }
                this.SopPanels = ViewerUtil.sortPanelFromDatas(this.SopPanels, this.seriesData.SopDatas, seriesData.SopIndex, Row * Column);
            }
            for (var i = 0; i < Row * Column; i++) {
                if (this.SopPanels[i] == null)
                    this.SopPanels[i] = new SopPanel(this);
                var s = null;
                if (this.seriesData) {
                    s = this.seriesData.SopDatas[i + seriesData.SopIndex];
                    if (typeof s == 'undefined')
                        s = null;
                }
//                if(s==null || (s &&  s.isInit))
                    this.SopPanels[i].setSopData(s);
            }
            if (this.seriesData) {
                for (var d = 0; d < datas.length; d++) {
                    var f = false;
                    for (var i = 0; i < this.SopPanels.length; i++) {
                        var data = this.SopPanels[i].getData();
                        if (data == datas[d]) {
                            f = true;
                            break;
                        }
                    }
                    if (!f) {
                        datas[d].onNonActive();
                    }
                }
            }
            //
            if (this.seriesData) {
                this.seriesData.Column = Column;
                this.seriesData.Row = Row;
                if (this.isSelect()) {
                    isSelectEvent = true;
                }
            }
        }
        ViewerUtil.setTrace("8");
        //位置とサイズの更新
        var p = $(this.Element).position();
        if (updateData || !ViewerUtil.compElementRect(this.Element, Rect)) {
            isResize = true;
            if (ViewerUtil.isIE6()) {
                this.WorkPanel.style.width = Math.ceil(Rect.Width - $(this.ScrollBarPanel).width()) + "px";
                this.WorkPanel.style.height = Rect.Height + "px";
                this.ScrollBarPanel.style.height = Rect.Height + "px";
            }
            var h = (Rect.Height - $(this.ScrollBarDownPanel).height() - $(this.ScrollBarUpPanel).height());
            if (h >= 0) {
                this.ScrollBarBodyPanel.style.height = h + "px";
            }
            ViewerUtil.setElementRect(this.Element, Rect);
            var sw = Math.floor($(this.WorkPanel).width() / Column);
            var sh = Math.floor($(this.WorkPanel).height() / Row);
            for (var y = 0; y < Row; y++) {
                for (var x = 0; x < Column; x++) {
                    var sop = this.getSopPanel(x, y);
                    if (sop)
                        sop.setRect(x * sw, y * sh, sw, sh);
                }
            }
        }
        ViewerUtil.setTrace("9");
        if (updateRowColumn || isResize || updateData ||
            (this.seriesData && this.seriesData.IsUpdateScrollBar)
        ) {
            if (this.scrollBarCtx.canvas.height != $(this.ScrollBarBodyPanel).height()) {
                this.scrollBarCtx.canvas.height = $(this.ScrollBarBodyPanel).height();
            }
            if (this.scrollBarCtx.canvas.width != $(this.ScrollBarBodyPanel).width()) {
                this.scrollBarCtx.canvas.width = $(this.ScrollBarBodyPanel).width();
            }
            this.scrollBarCtx.clearRect(0, 0, this.scrollBarCtx.canvas.width, this.scrollBarCtx.canvas.height);
            var isThinOut = false;
            if (this.seriesData && this.seriesData.SopDatas.length != this.seriesData.BaseSopDatas.length) {
                isThinOut = true;
            }
            var basecolor = (isThinOut) ? ViewerUtil.ScrollBar.BaseColorThinOut : ViewerUtil.ScrollBar.BaseColor;
            var oncachecolor = (isThinOut) ? ViewerUtil.ScrollBar.OnCacheColorThinOut : ViewerUtil.ScrollBar.OnCacheColor;
            var dispcolor = (isThinOut) ? ViewerUtil.ScrollBar.DispColorThinOut : ViewerUtil.ScrollBar.DispColor;
            this.scrollBarCtx.fillStyle = basecolor;
            this.scrollBarCtx.fillRect(0, 0, this.scrollBarCtx.canvas.width, this.scrollBarCtx.canvas.height);
            //スクロールバー再描画
            if (this.seriesData) {
                var index = 0;
                var cachecount = this.seriesData.SopDatas.length;
                if (this.seriesData.SeriesCacheCount > 0) {
                    var index = this.seriesData.SopIndex - Math.floor(this.seriesData.SeriesCacheCount / 2);
                    if (index > this.seriesData.SopDatas.length - this.seriesData.SeriesCacheCount) {
                        index = this.seriesData.SopDatas.length - this.seriesData.SeriesCacheCount;
                    }
                    if (index < 0) {
                        index = 0;
                    }
                    cachecount = this.seriesData.SeriesCacheCount;
                }
                for (var i = 0; i < cachecount; i++) {
                    var n = index + i;
                    if (n >= this.seriesData.SopDatas.length)
                        break;
                    var start = this.scrollBarCtx.canvas.height * n / this.seriesData.SopDatas.length;
                    var end = this.scrollBarCtx.canvas.height * (n + 1) / this.seriesData.SopDatas.length;
                    if (this.seriesData.SopDatas[n].getIsCache()) {
                        this.scrollBarCtx.fillStyle = oncachecolor;
                        this.scrollBarCtx.fillRect(0, start, this.scrollBarCtx.canvas.width, end - start);
                    }
                }
                this.scrollBarCtx.fillStyle = dispcolor;
                var cnt = this.seriesData.SopDatas.length - this.seriesData.SopIndex;
                if (cnt > Column * Row)
                    cnt = Column * Row;
                var start = this.scrollBarCtx.canvas.height * this.seriesData.SopIndex / this.seriesData.SopDatas.length;
                var size = this.scrollBarCtx.canvas.height * cnt / this.seriesData.SopDatas.length;
                if (size < 4) size = 4;
                this.scrollBarCtx.fillRect(0, start, this.scrollBarCtx.canvas.width, size);
                this.seriesData.IsUpdateScrollBar = false;
            }
        }
        ViewerUtil.setTrace("10");
        //各パネル更新
        for (var y = 0; y < Row; y++) {
            for (var x = 0; x < Column; x++) {
                var sop = this.getSopPanel(x, y);
                if (sop)
                    sop.onTick();
            }
        }
        if (AutoSopIndex!=0)
        {
            var s = null;
            if(AutoSopIndex<0)
            {
                if (seriesData.SopIndex > 0) {
                    s = this.seriesData.SopDatas[seriesData.SopIndex - 1];
                }
            } else {
                if ((seriesData.SopIndex+1) < this.seriesData.SopDatas.length) {
                    s = this.seriesData.SopDatas[seriesData.SopIndex + 1];
                }
            }
            if(s)
            {
                var sop = this.getSopPanel(0,0).getData();
                if (sop) {
                    s.Request(sop.Map.currentLevel);
                }
            }
        }
        switch (selectUpdate) {
            case "top":
                this.SopPanels[0].setSelect();
                break;
            case "end":
                this.SopPanels[this.SopPanels.length - 1].setSelect();
                break;
        }
        ViewerUtil.setTrace("11");
        if (isDataChange) {
            ViewerUtil.Events.onLoadSeries(this);
            if (this.isSelect()) {
                ViewerUtil.Events.onSelectSeries(this);
            }
        }
        ViewerUtil.setTrace("12");
        ViewerUtil.Events.onTickSeries(this);
        //更新完了
        if (seriesData != null)
            seriesData.IsUpdate = false;
        //選択状態でデータ更新による選択イベント
        if (isSelectEvent)
        {
            ViewerUtil.Events.onSelectSeries(this);
        }
        ViewerUtil.popTrace();
    }
}
SeriesPanel.prototype = {
    onInit: function () {
        while (this.ScrollBarSopPanels.length > 0) {
            var e = this.ScrollBarSopPanels.pop();
            this.ScrollBarBodyPanel.removeChild(e);
        }
    }
};
