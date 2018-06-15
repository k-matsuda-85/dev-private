function SopData(series,index, data) {
    this.sopPanel = null;
    this.Map = null;
    this.seriesData = series;
    this.InitParam = data;
    this.ImageWidth = 0;
    this.ImageHeight = 0;
    this.isUpdateImage = false;
    this.isUpdateDraw = false;
    this.isUpdateDrawTemp = false;
    this.isUpdateAnnotation = false;
    this.isDrawing = false;
    this.SopIndex = index;
    this.thinIndex = index;
    this.DefaultWindowCenter = 0;
    this.DefaultWindowWidth = 0;
    this.CustomWindowCenter = 0;
    this.CustomWindowWidth = 0;

    this.XLength = 1;
    this.YLength = 1;
    this.Unit = "";

    this.ImageScale = 1;
    this.ImageLeft  = 0;
    this.ImageTop   = 0;

    this.DrawItems = new Array();
    this.DrawingItem = null;
    this.UndoStack = new Array();
    //使用した直前のシリーズのパラメータ
    this.isUpdateParamPreview = false;
    var isCache = false;

    //使用中のパラメータ
    this.ImageRotate = 0;
    this.ImageFlipX = false;
    this.ImageScale = 1;
    this.ImageLeft = 0;
    this.ImageTop = 0;
    this.WindowCenter = 0;
    this.WindowWidth = 0;

    //SOPのパラメータ
    this.SopImageRotate = 0;
    this.SopImageFlipX = false;
    this.SopWindowCenter = 0;
    this.SopWindowWidth = 0;
    this.SopImageLeft = 0;
    this.SopImageTop = 0;
    this.SopImageScale = 1;


    this.getImageScale = function () {
        return (this.SopImageScale * this.seriesData.ImageScale);
    }
    this.getImageLeft = function()
    {
        return (this.SopImageLeft + this.seriesData.ImageLeft);
    }
    this.getImageTop = function () {
        return (this.SopImageTop + this.seriesData.ImageTop);
    }

    this.getImageRotate = function () {
        return (this.SopImageRotate + this.seriesData.ImageRotate) % 360;
    }
    this.getImageFlipX = function () {
        //return this.SopImageFlipX ^ this.seriesData.ImageFlipX;
        return (this.SopImageFlipX == this.seriesData.ImageFlipX) ? false : true;
    }
    this.getWindowCenter = function () {
        if(this.CustomWindowWidth==0)
            return this.SopWindowCenter + this.seriesData.WindowCenter + this.DefaultWindowCenter;
        else
            return this.SopWindowCenter + this.seriesData.WindowCenter + this.CustomWindowCenter;
    }
    this.getWindowWidth = function () {
        if (this.CustomWindowWidth == 0)
            return this.SopWindowWidth + this.seriesData.WindowWidth + this.DefaultWindowWidth;
        else
            return this.SopWindowWidth + this.seriesData.WindowWidth + this.CustomWindowWidth;
    }

    this.isChangeWindowLevel=function(){
        return this.WindowWidth != this.getWindowWidth();
    }
    this.isChangeRotateFlip = function () {
        return this.ImageRotate != this.getImageRotate();
    }
    this.setWindowLevel = function (wc, ww) {
        this.SopWindowCenter = wc;
        this.SopWindowWidth = ww;
        this.updateParam();
    }
    this.requestUpdateParam = "";
    this.updateParam = function () {
        var req = "wc=" + this.getWindowCenter() +
            "&ww=" + this.getWindowWidth() +
            "&rot=" + this.getImageRotate() +
            "&flipX=" + (this.getImageFlipX() ? "1" : "0");
        if (isCache &&this.requestUpdateParam == req)
            return;
        this.requestUpdateParam = req;
//        if (!this.Map.previewMode) {
//            this.onCache(false);
//        }
        this.Map.updateParam(req, this.getImageRotate());

        this.SeriesWindowCenter = this.seriesData.WindowCenter;
        this.SeriesWindowWidth = this.seriesData.WindowWidth;
        this.updateAnnotation("wl");
    }
    this._setSopPanel = function (panel) {
        this.sopPanel = panel;
    }
    this.onCache = function (flg) {
        if (!flg) {
            this.imageGroup.clear();
        }
        if (isCache != flg) {
            isCache = flg;
            this.seriesData.onCache(this.thinIndex);
        }
    }
    this.getIsCache = function () {
        return isCache;
    }
    //なにか描画中ならTempのほうの更新に
    this.updateDraw = function () {
        if (this.DrawingItem) {
            this.isUpdateDrawTemp = true;
        } else {
            this.isUpdateDraw = true;
        }
    }
    this.updateImage = function () {
        this.isUpdateImage = true;

    }
    this.onNonActive = function (){
        this.Map.smart();
    }
    this.Dispose = function () {
        this.Map.reset();
        this.imageGroup.clear();
    }
    this.Request=function(level)
    {
        if (this.isInit == false)
            return;
        this.Map.Request(level);
    }
    this.setPreviewMode = function (isPreview) {
        this.Map.previewMode = isPreview;
        if (isPreview) {
            this.imageGroup.clear();
        }
    }
    this.loadPreview = function () {
        if (this.isUpdateParamPreview) {
            if (this.isChangeWindowLevel() || this.isChangeRotateFlip()) {
                this.isCache = false;
                this.updateParam();
                this.isUpdateParamPreview = false;
            }
        }
        this.Map.loadPreview();
    }
    this.beginDrawItem = function (item) {
        this.removeDrawItem(item);
        //        this.updateDraw();
        this.DrawingItem = item;
        this.updateDraw();
        this.isDrawing = true;
    }
    this.endDrawItem = function () {
        this.addDrawItem(this.DrawingItem);
        if (this.sopPanel) {
            this.sopPanel.DrawTempItem();
            this.sopPanel.JoinDrawItem();
        }
        this.DrawingItem = null;
        this.isDrawing = false;
    }
    this.addDrawItem = function (item) {
        if (!item)
            return;
        var data = this;
        this.DrawItems.push(item);
        var obj = new UndoObject("addDrawItem", function () { data.DrawItems.pop(); });
        obj.data = data;
        data.UndoStack.push(obj);
        data.updateDraw();
    }
    this.removeDrawItem = function (item) {
        for (var i = 0; i < this.DrawItems.length; i++) {
            if (this.DrawItems[i] == item) {
                this.DrawItems.splice(i, 1);
                break;
            }
        }        
    }
    //画像読込み登録
    this.imageGroup = new ImageGroup("sop",this);
    this.setLoadImage = function (img) {
        this.imageGroup.setLoadImage(img);
        this.seriesData.setLoadImage(img);
    }
    this.getLoadImage = function () {
        return this.imageGroup.getLoadImage();
    }
    //リセット
    this.reset = function () {
        this.Map.reset();
        this.UndoStack.length = 0;
        this.DrawItems.length = 0;
        this.DrawingItem = null;
        this.FreeLineItem = null;
        this.updateDraw();
        this.isUpdateDrawTemp = true;
    }
    //情報
    this.getInfo = function (name) {
        switch (name) {
            case "wc":
                return this.getWindowCenter();
            case "ww":
                return this.getWindowWidth();
            case "scale":
                if (this.sopPanel)
                    return this.sopPanel.getScale();
                return this.getImageScale();
            case "rot":
                return this.getImageRotate();
            case "flipX":
                return this.getImageFlipX();
            case "":
        }
        return "";
    }
    //アノテーション
    this.AnnotationPanel = null;
    //アノテーション要素変更通知
    // panel
    // wl
    // scale
    // rot
    this.updateAnnotation = function (name) {
    }
    //SOP初期化基本パラメータ
    this.initSopData = function (uri, param, w, h, xlen, ylen, unit) {
        this.Map = new CellMap(this, uri, param, w, h);
        this.ImageWidth = w;
        this.ImageHeight = h;
        this.XLength = xlen;
        this.YLength = ylen;
        this.Unit = unit;
    }
    //カットライン
    this.CutlineSeries = null;
    this.CutlineSops= [];

    //キャッシュ有無 0:なし 1:Preview 2:Full
    this.getCacheLevel=function()
    {
        return this.Map.getCacheLevel();
    }

    //キャッシュアウト
    this.cacheOut = function () {
        this.Map.reset();
        this.onCache(false);
    }
    //処理簡略
    this.getData = function () {
        return this;
    }
    //現在のPR
    this.PR = null;
    this.PRInfo = null;
    //初期化
    ViewerUtil.initSopData(this, data);
}
function SopPanel(series) {
    this.Viewer = series.Viewer;
    this.Series = series;
    this.Element = document.createElement("DIV");
    this.Element.className = "SopPanel";
    this.Element.style.position = "absolute";
    this.Element.style.overflow = "hidden";
    series.WorkPanel.appendChild(this.Element);

    var self = this;
    var appendChild = function (element) {
        element.style.position = "absolute";
        element.style.width = "100%";
        element.style.height = "100%";
        self.Element.appendChild(element);
    }

    this.ImagePanel = document.createElement("DIV");
    appendChild(this.ImagePanel);
    this.setPreviewMode = function (isPreview) {
        if (sopData) {
            sopData.setPreviewMode(isPreview);
        }
    }

    //メイン描画領域
    this.DrawPanel = document.createElement("CANVAS");
    this.DrawPanel.style.position = "absolute";
    this.Element.appendChild(this.DrawPanel);
    this.ctx = null;
    if (typeof G_vmlCanvasManager != "undefined") {
        G_vmlCanvasManager.initElement(this.DrawPanel);
    }
    if(this.DrawPanel.getContext)
        this.ctx = this.DrawPanel.getContext("2d");
    
    //一時描画領域
    this.TempDrawPanel = document.createElement("CANVAS");
    this.TempDrawPanel.style.position = "absolute";
    this.Element.appendChild(this.TempDrawPanel);
    this.tmpctx = null;
    if (typeof G_vmlCanvasManager != "undefined") {
        G_vmlCanvasManager.initElement(this.TempDrawPanel);
    }
    if (this.TempDrawPanel.getContext)
        this.tmpctx = this.TempDrawPanel.getContext("2d");

    this.DrawTextPanel = document.createElement ("DIV");
    appendChild(this.DrawTextPanel);
    this.DrawTextPanel.className = "SopDrawTextPanel";

    this.AnnotationPanel = document.createElement("DIV");
    appendChild(this.AnnotationPanel);
    this.AnnotationPanel.style.color = "white";

    //描画用
    this.cursorPosition = function (e) {
        return ViewerUtil.getElementPoint(this.DrawPanel,e);
//        var offset = $(this.DrawPanel).offset();
//        return { x: e.clientX - offset.left, y: e.clientY - offset.top };
    }
    this.globalToLocal = function (gpoint) {
        var scale = this.getScale();
        var local = this.localToGlobal({ x: 0, y: 0 });
        var data = this.getData()
        if (data) {
            switch (data.getImageRotate()) {
                case 0:
                    if (data.getImageFlipX()) {
                        return {
                            x: -(gpoint.x - local.x) / scale,
                            y: (gpoint.y - local.y) / scale
                        };
                    } else {
                        return {
                            x: (gpoint.x - local.x) / scale,
                            y: (gpoint.y - local.y) / scale
                        };
                    }
                case 90:
                    if (data.getImageFlipX()) {
                        return {
                            x: -(gpoint.y - local.y) / scale,
                            y: -(gpoint.x - local.x) / scale
                        };
                    } else {
                        return {
                            x: (gpoint.y - local.y) / scale,
                            y: -(gpoint.x - local.x) / scale
                        };
                    }
                case 180:
                    if (data.getImageFlipX()) {
                        return {
                            x: (gpoint.x - local.x) / scale,
                            y: -(gpoint.y - local.y) / scale
                        };
                    } else {
                        return {
                            x: -(gpoint.x - local.x) / scale,
                            y: -(gpoint.y - local.y) / scale
                        };
                    }
                case 270:
                    if (data.getImageFlipX()) {
                        return {
                            x: (gpoint.y - local.y) / scale,
                            y: (gpoint.x - local.x) / scale
                        };
                    } else {
                        return {
                            x: -(gpoint.y - local.y) / scale,
                            y: (gpoint.x - local.x) / scale
                        };
                    }
            }
        }
    }
    this.localToGlobal = function (local) {
        var scale = this.getScale();
        var data = this.getData()
        if (data) {
            var x = ($(this.Element).width() - sopData.ImageWidth * scale) / 2;
            var y = ($(this.Element).height() - sopData.ImageHeight * scale) / 2;
            switch (data.getImageRotate()) {
                case 0:
                    if (data.getImageFlipX()) {
                        return {
                            x: Math.floor(x + (sopData.ImageWidth - local.x) * scale + sopData.getImageLeft()),
                            y: Math.floor(y + local.y * scale + sopData.getImageTop())
                        }
                    } else {
                        return {
                            x: Math.floor(x + local.x * scale + sopData.getImageLeft()),
                            y: Math.floor(y + local.y * scale + sopData.getImageTop())
                        }
                    }
                case 90:
                    if (data.getImageFlipX()) {
                        return {
                            x: Math.floor(x + (sopData.ImageHeight - local.y) * scale + sopData.getImageLeft()),
                            y: Math.floor(y + (sopData.ImageWidth - local.x) * scale + sopData.getImageTop())
                        }
                    } else {
                        return {
                            x: Math.floor(x + (sopData.ImageHeight - local.y) * scale + sopData.getImageLeft()),
                            y: Math.floor(y + local.x * scale + sopData.getImageTop())
                        }
                    }
                case 180:
                    if (data.getImageFlipX()) {
                        return {
                            x: Math.floor(x + local.x * scale + sopData.getImageLeft()),
                            y: Math.floor(y + (sopData.ImageHeight - local.y) * scale + sopData.getImageTop())
                        }
                    } else {
                        return {
                            x: Math.floor(x + (sopData.ImageWidth - local.x) * scale + sopData.getImageLeft()),
                            y: Math.floor(y + (sopData.ImageHeight - local.y) * scale + sopData.getImageTop())
                        }
                    }
                case 270:
                    if (data.getImageFlipX()) {
                        return {
                            x: Math.floor(x + local.y * scale + sopData.getImageLeft()),
                            y: Math.floor(y + local.x * scale + sopData.getImageTop())
                        }
                    } else {
                        return {
                            x: Math.floor(x + local.y * scale + sopData.getImageLeft()),
                            y: Math.floor(y + (sopData.ImageWidth - local.x) * scale + sopData.getImageTop())
                        }
                    }
            };
        }
        return local;
    }
    this.getBaseScale = function () {
        var baseScaleW = $(this.Element).width() / sopData.ImageWidth;
        var baseScaleH = $(this.Element).height() / sopData.ImageHeight;
        return (baseScaleW > baseScaleH) ? baseScaleH : baseScaleW;
    }
    this.getScale = function () {
        return this.getBaseScale() * sopData.getImageScale();
    }
	this.undo = function () {
	    var data = this.getData();
	    if (data == null)
	        return;
	    this.onEvent("close", null); //描きかけのキャンセル
	    if (data.UndoStack.length > 0) {
	        var undoobj = data.UndoStack.pop();
	        undoobj.undo();
            data.updateDraw();
	    }
    }

    //位置設定
    var Rect = {
        Top: 0,
        Left: 0,
        Width: 0,
        Height: 0
    };
    //データ
    this.sopData = null;
    var sopData = null;
    //データの設定
    this.setSopData = function (data) {
        if (data) {
            data._setSopPanel(this);
        }
        if (sopData && sopData != data && sopData.sopPanel == this) {
            sopData._setSopPanel(null);
        }
        sopData = data;
    }
    //データの取得(抽象化用)
    this.getData = function (data) {
        return sopData;
    }
    //パネルの位置設定
    this.setRect = function (x, y, w, h) {
        Rect = {
            Top: y,
            Left: x,
            Width: w,
            Height: h
        };
        this.Viewer.Config.sopPanelInterruptResize(this, Rect);
    }
    //当たり判定
    this.isHit = function (x, y) {
        return (Rect.Top <= y && Rect.Left <= x && (Rect.Top + Rect.Height) > y && (Rect.Left + Rect.Width) > x);
    }
    //選択
    this.isSelect = function () {
        return $(this.Element).hasClass("Selected");
    }
    this.setSelect = function () {
        this.Viewer._setSelectSop(this);
    }
    this._setSelect = function (isselect) {
        if (this.isSelect() == isselect)
            return;
        if (isselect) {
            $(this.Element).addClass("Selected");
            if (!this.Series.isSelect()) {
                this.Series.setSelect();
            }
        } else {
            $(this.Element).removeClass("Selected");
        }
    }
    //カットライン描画
    this.oriType = function (sopOri) {
        var array = [Math.abs(sopOri[0]) + Math.abs(sopOri[3]), Math.abs(sopOri[1]) + Math.abs(sopOri[4]), Math.abs(sopOri[2]) + Math.abs(sopOri[5])];
        var i = 0;
        if (array[0] < array[1] && array[0] < array[2]) {
            return 0;
        }
        if (array[1] < array[0] && array[1] < array[2]) {
            return 1;
        }
        return 2;
    }
    this.drawCutline = function (gr, sop) {
        var data = this.getData();
        var mat = new Matrix3D();
        var sopOri = data.ImageOrientationPatient;
        var sopPos = data.ImagePositionPatient;
        var Ori = sop.ImageOrientationPatient;
        var Pos = sop.ImagePositionPatient;
        if (this.sopData.seriesData == sop.seriesData)
            return;
        //if (this.sopData.InitParam.ExData.StudyKey != sop.InitParam.ExData.StudyKey)
        //    return;
        if (this.sopData.seriesData.ExData.StudyKey != sop.seriesData.ExData.StudyKey)
            return;
        if (this.oriType(Ori) == this.oriType(sopOri))
            return;
        var size = 1;
        var color = ViewerUtil.Cutline.DefaultColor;
        if (sop.seriesData.SelectSopData == sop) {
            color = ViewerUtil.Cutline.ActiveColor;
        }
        mat.mV[0][0] = sopOri[0]; mat.mV[1][0] = sopOri[1]; mat.mV[2][0] = sopOri[2]; mat.mV[3][0] = 0;
        mat.mV[0][1] = sopOri[3]; mat.mV[1][1] = sopOri[4]; mat.mV[2][1] = sopOri[5]; mat.mV[3][1] = 0;
        mat.mV[0][2] = 0; mat.mV[1][2] = 0; mat.mV[2][2] = 0; mat.mV[3][2] = 0;
        mat.mV[3][0] = sopPos[0]; mat.mV[3][1] = sopPos[1]; mat.mV[3][2] = sopPos[2]; mat.mV[3][3] = 1;
        // 0--1
        // |  |
        // 3--2
        var width = sop.ImageWidth * sop.XLength;
        var height = sop.ImageHeight * sop.YLength;
        var p = [
            mat.transform(Pos[0], Pos[1], Pos[2]),
            mat.transform(Pos[0] + Ori[0] * width, Pos[1] + Ori[1] * width, Pos[2] + Ori[2] * width),
            mat.transform(Pos[0] + Ori[0] * width + Ori[3] * height, Pos[1] + Ori[1] * width + Ori[4] * height, Pos[2] + Ori[2] * width + Ori[5] * height),
            mat.transform(Pos[0] + Ori[3] * height, Pos[1] + Ori[4] * height, Pos[2] + Ori[5] * height)
        ];
        for (var n = 0; n < p.length; n++) {
            p[n].x /= data.XLength;
            p[n].y /= data.YLength;
        }
        var w = p[0].x - p[1].x;
        var h = p[0].y - p[1].y;
        var len1 = Math.sqrt(w * w + h * h);
        var w = p[0].x - p[3].x;
        var h = p[0].y - p[3].y;
        var len2 = Math.sqrt(w * w + h * h);

        if (len1 > len2) {
            var p1 = { x: (p[0].x + p[3].x) / 2, y: (p[0].y + p[3].y) / 2 };
            var p2 = { x: (p[1].x + p[2].x) / 2, y: (p[1].y + p[2].y) / 2 };
        } else {
            var p1 = { x: (p[0].x + p[1].x) / 2, y: (p[0].y + p[1].y) / 2 };
            var p2 = { x: (p[2].x + p[3].x) / 2, y: (p[2].y + p[3].y) / 2 };
        }
        //        gr.drawline(p1, p2, 1, "yellow");
        gr.drawline(p[0], p[1], size, color);
        gr.drawline(p[1], p[2], size, color);
        gr.drawline(p[2], p[3], size, color);
        gr.drawline(p[3], p[0], size, color);
    }
    //一時描画領域とメイン描画領域の合成
    this.JoinDrawItem = function () {
        if (typeof G_vmlCanvasManager != "undefined") {
            // excanvasでもdrawImageはシミュレートされているが
            // Canvas相手の転送までは考慮されていない（技術的に無理）
            this.ctx.element_.insertAdjacentHTML('beforeEnd',this.tmpctx.element_.innerHTML);
        } else {
            this.ctx.drawImage(this.TempDrawPanel, 0, 0);
        }
        this.tmpctx.clearRect(0, 0, this.tmpctx.canvas.width, this.tmpctx.canvas.height);
    }
    this.DrawTempItem = function () {
        //描画ごみ削除
        if (sopData && sopData.isUpdateDrawTemp && sopData.DrawingItem==null) {
            var gr = new Graphics(this, this.tmpctx, "temp");
            gr.clear();
        }
        if (sopData && sopData.DrawingItem && sopData.isUpdateDrawTemp) {
            var w = $(this.Element).width();
            var h = $(this.Element).height();
            if (this.tmpctx.canvas.width != w ||
                this.tmpctx.canvas.height != h) {
                this.tmpctx.canvas.width = w;
                this.tmpctx.canvas.height = h;
            }
            var gr = new Graphics(this, this.tmpctx, "temp");
            if (sopData.DrawingItem.isClearDraw)
                gr.clear();
            sopData.DrawingItem.draw(gr);
            sopData.isUpdateDrawTemp = false;
        }
    }

    var convertPoints = function (p) {
        var result=[];
        for(var i=0;i<p.length;i++)
        {
            result.push(self.localToGlobal(p[i]));
        }
        return result;
    }
    this.getTextPoint = function(ps, format)
    {
        var cps = convertPoints(ps);
        switch (format) {
            case "LEFT":
                var x = cps[0].x;
                var y = cps[0].y;
                for (var i = 1; i < cps.length; i++) {
                    if (x > cps[i].x)
                        x = cps[i].x;
                    if (y > cps[i].y)
                        y = cps[i].y;
                }
                break;
            default:
            case "CENTER":
                var x = 0;
                var y = cps[0].y;
                for (var i = 0; i < cps.length; i++) {
                        x += cps[i].x;
                    if (y > cps[i].y)
                        y = cps[i].y;
                }
                x /= cps.length;
                break;
            case "RIGHT":
                var x = cps[0].x;
                var y = cps[0].y;
                for (var i = 1; i < cps.length; i++) {
                    if (x < cps[i].x)
                        x = cps[i].x;
                    if (y > cps[i].y)
                        y = cps[i].y;
                }
                break;
        }
        return self.globalToLocal({ x: x, y: y });
    }
    //PRの描画
    this.DrawPR=function(gr)
    {
        if (!this.sopData) {
            return;
        }
        var pr = this.sopData.PRInfo;
        if (pr == null || pr.Info == null)
            return;

        //DisplayAreaデバッグ用
        //gr.drawdot(pr.DisplayArea.PointLU ,4,"red");
        //gr.drawdot(pr.DisplayArea.PointRD, 4, "red");

        for (var i = 0; i < pr.Info.length; i++) {
            var info = pr.Info[i];
            var col = info.COL;
            var col2 = info.COL;
            if (!col) {
                col = ViewerUtil.PR.TextColor;
                col2 = ViewerUtil.PR.LineColor;
            }
            switch(info.Type)
            {
                case "TEXT":
                    gr.drawtext(this.getTextPoint(info.P, info.TF), info.TXT, ViewerUtil.PR.Font, col, null, info.TF);
                    //gr.drawrect(
                    //    Math.min(info.P[0].x, info.P[1].x),
                    //    Math.min(info.P[0].y, info.P[1].y),
                    //    Math.abs(info.P[0].x - info.P[1].x),
                    //    Math.abs(info.P[0].y - info.P[1].y),
                    //    "black");
                    if (info.AV) {
                        gr.drawarrow(
                            { x: (info.P[0].x + info.P[1].x) / 2, y: (info.P[0].y + info.P[1].y) / 2 },
                            info.AP,
                            ViewerUtil.PR.LineWidth, col2);
                    }
                    break;
                case "POLYLINE":
                    gr.drawlines(convertPoints(info.P), 0, ViewerUtil.PR.LineWidth, col2);
                    if(info.TXT)
                        gr.drawtext(info.P[0], info.TXT, ViewerUtil.PR.Font, col);
                    break;
                case "ELLIPSE":
                    var w = Math.abs(info.P[0].x - info.P[1].x);
                    var h = Math.abs(info.P[0].y - info.P[1].y);
                    gr.drawcircle(
                        {x:(info.P[0].x+info.P[1].x)/2,y:(info.P[0].y+info.P[1].y)/2},
                        Math.sqrt(w * w + h * h) / 2, ViewerUtil.PR.LineWidth, col2);
                    if (info.TXT)
                        gr.drawtext(info.P[0], info.TXT, ViewerUtil.PR.Font, col);
                    break;
                case "ARROW":
                    gr.drawarrow(
                        { x: (info.P[0].x + info.P[1].x) / 2, y: (info.P[0].y + info.P[1].y) / 2 }, info.AP, ViewerUtil.PR.LineWidth, col2);
                    if (info.TXT)
                        gr.drawtext(info.P[0], info.TXT, ViewerUtil.PR.Font, col);
                    break;
            }

        }
    }
    //更新処理
    this.onTick = function () {
        ViewerUtil.pushTrace("Sop.onTick");
        var isDataChange = false;
        //更新フラグ
        var updateImage = false;
        var updateDraw = false;
        var updateAnnotation = false;
        var updateScale = false;
       

        //サイズが異なるので更新
        if (parseInt(this.Element.style.width) != Rect.Width || parseInt(this.Element.style.height) != Rect.Height) {
            updateImage = true;
            updateDraw = true;
            updateScale = true;
        }
        //位置の更新
        var p = $(this.Element).position();
        if (!ViewerUtil.compElementRect(this.Element, Rect)) {
            ViewerUtil.setElementRect(this.Element, Rect);
            updateImage = true;
        }
        //データの更新種別作成
        if (this.sopData != sopData) {
            isDataChange = true;
            updateImage = true;
            updateDraw = true;
            updateAnnotation = true;
            this.sopData = sopData;
        }
        //PR処理
        if (this.sopData) {
            if (this.sopData.PR != this.sopData.seriesData.PR) {
                this.sopData.PR = this.sopData.seriesData.PR;
                updateDraw = true;
                updateAnnotation = true;
                this.sopData.PRInfo = null;
                if (this.sopData.PR) {
                    var pr = this.sopData.PR.getPRInfo(this.sopData.data.ImageKey);
                    if (pr) {
                        //if (!pr.IsParse) {
                        //    var replaceAll = function (expression, org, dest) {
                        //        return expression.split(org).join(dest);
                        //    }
                        //    var replaceJSON = function (expression) {
                        //        if (expression == "")
                        //            return null;
                        //        return JSON.parse(expression);
                        //    }
                        //    pr.DisplayArea = replaceJSON(pr.DisplayArea);
                        //    pr.Flip = replaceJSON(pr.Flip.toLowerCase());
                        //    pr.Info = replaceJSON(pr.Info);
                        //    pr.Rotate = replaceJSON(pr.Rotate);
                        //    pr.VoiLut = replaceJSON(pr.VoiLut);
                        //    pr.IsParse = true;
                        //}
                        this.sopData.PRInfo = pr;
                        if (pr.VoiLut) {
                            this.sopData.CustomWindowCenter = pr.VoiLut.WindowCenter;
                            this.sopData.CustomWindowWidth = pr.VoiLut.WindowWidth;
                        } else {
                            this.sopData.CustomWindowCenter = 0;
                            this.sopData.CustomWindowWidth = 0;
                        }
                        this.sopData.SopImageRotate = Math.floor(pr.Rotate / 90)*90;//90度単位に精度落とす
                        this.sopData.SopImageFlipX = pr.Flip;
                        this.sopData.updateParam();

                        switch (pr.DisplayArea.SizeMode) {
                            case "SCALE TO FIT":
                                if (pr.DisplayArea.PointLU && pr.DisplayArea.PointRD) {
                                    switch (this.sopData.getImageRotate()) {
                                        case 0:
                                        case 180:
                                            var sx = Rect.Width / Math.abs(pr.DisplayArea.PointLU.x - pr.DisplayArea.PointRD.x);
                                            var sy = Rect.Height / Math.abs(pr.DisplayArea.PointLU.y - pr.DisplayArea.PointRD.y);
                                            break;
                                        case 90:
                                        case 270:
                                            var sx = Rect.Width / Math.abs(pr.DisplayArea.PointLU.y - pr.DisplayArea.PointRD.y);
                                            var sy = Rect.Height / Math.abs(pr.DisplayArea.PointLU.x - pr.DisplayArea.PointRD.x);
                                    }
                                    var s = Math.min(sx, sy);
                                    var mx = Rect.Width - Math.abs(pr.DisplayArea.PointLU.y - pr.DisplayArea.PointRD.y) * s;
                                    var my = Rect.Height - Math.abs(pr.DisplayArea.PointLU.x - pr.DisplayArea.PointRD.x) * s;
                                    this.sopData.SopImageScale = s / this.getBaseScale();
                                    sopData.SopImageTop = 0;
                                    sopData.SopImageLeft = 0;
                                    var tmp = this.sopData.seriesData.ImageScale;
                                    this.sopData.seriesData.ImageScale = 1;
                                    var gp2 = this.localToGlobal(pr.DisplayArea.PointLU);
                                    this.sopData.seriesData.ImageScale = tmp;
                                    sopData.SopImageTop = Math.floor(-gp2.y + my / 2);
                                    sopData.SopImageLeft = Math.floor(-gp2.x + mx / 2);
                                }
                                break;
                        }
                    }
                } else {
                    this.sopData.CustomWindowCenter = 0;
                    this.sopData.CustomWindowWidth = 0;
                    this.sopData.SopImageRotate = 0;
                    this.sopData.SopImageFlipX = false;
                    this.sopData.SopImageLeft = 0;
                    this.sopData.SopImageTop = 0;
                    this.sopData.SopImageScale = 1;
                    this.sopData.updateParam();
                }
            }
        }

        if (this.sopData && this.sopData.isUpdateAnnotation) {
            updateAnnotation = true;
            this.sopData.isUpdateAnnotation = false;
        }
        if (updateAnnotation) {
            while (this.AnnotationPanel.firstChild)
                this.AnnotationPanel.removeChild(this.AnnotationPanel.firstChild);
            if (sopData) {
                sopData.updateAnnotation("panel");
                if (sopData.AnnotationPanel) {
                    this.AnnotationPanel.appendChild(sopData.AnnotationPanel);
                }
            }
        }
        ViewerUtil.setTrace("0");

        if (sopData && sopData.isUpdateImage) {
            updateImage = true;
            this.sopData.isUpdateImage = false;
        }
        if (sopData && sopData.isUpdateDraw) {
            updateDraw = true;
        }
        ViewerUtil.setTrace("1");
        //以前に使用した画像の設定値が変更されている
        if (sopData) {
            var updateWL = false;
            var updateRot = false;
            if (sopData.isChangeWindowLevel())
                updateWL = true;
            if (sopData.getImageRotate() != sopData.ImageRotate ||
                sopData.getImageFlipX() != sopData.ImageFlipX ||
                sopData.getImageScale() != sopData.ImageScale ||
                sopData.getImageLeft() != sopData.ImageLeft ||
                sopData.getImageTop() != sopData.ImageTop) {
                if (sopData.isChangeRotateFlip()) {
                    updateRot = true;
                    updateDraw = true;
                }
                updateScale = sopData.getImageScale() != sopData.ImageScale;
                sopData.ImageRotate = sopData.getImageRotate();
                sopData.ImageFlipX = sopData.getImageFlipX();
                sopData.ImageScale = sopData.getImageScale();
                sopData.ImageLeft = sopData.getImageLeft();
                sopData.ImageTop = sopData.getImageTop();
                updateImage = true;
                updateDraw = true;
            }
            if (updateScale)
                sopData.updateAnnotation("scale");

            if (updateImage || updateWL || updateRot) {
                sopData.updateParam();
                if (updateWL)
                    sopData.updateAnnotation("wl");
                if (updateRot)
                    sopData.updateAnnotation("rot");
            }
            if (this.Viewer.IsUpdateDraw)
                updateDraw = true;
            //カットライン
            if (this.Viewer.getData().isCutline) {
                if (sopData.isCutline) {
                    var series = this.Viewer.getSelectSeries();
                    if (series && series == sopData.CutlineSeries && series.getData() != null) {
                        var sops = series.getData().getDispSops();
                        if (sops.length == sopData.CutlineSops.length) {
                            for (var i = 0; i < sopData.CutlineSops.length; i++) {
                                var hit = false;
                                for (var n = 0; n < sops.length; n++) {
                                    if (sopData.CutlineSops[i] == sops[n]) {
                                        hit = true;
                                        break;
                                    }
                                }
                                if (!hit) {
                                    updateDraw = true;
                                    break;
                                }
                            }
                        } else {
                            updateDraw = true;
                        }
                    } else {
                        updateDraw = true;
                    }
                }
            } else {
                if (sopData.CutlineSeries) {
                    sopData.CutlineSeries = null;
                    sopData.CutlineSops = [];
                    updateDraw = true;
                }
            }
        }
        //IE
        if (typeof G_vmlCanvasManager != "undefined") {
            if (this.sopData && updateImage) {
                var baseScale = this.getBaseScale();
                var point = this.localToGlobal({ x: 0, y: 0 });
                var scale = this.getScale();
                if (scale * sopData.ImageWidth > 8 && scale * sopData.ImageHeight > 8) {
                    this.sopData.Map.drawImage(this.ImagePanel,
                        this.getScale(),
                        sopData.getImageRotate(),
                        sopData.getImageFlipX(),
                        point.x,
                        point.y,
                        0, 0,
                        sopData.ImageWidth,
                        sopData.ImageHeight
                        );
                }
            }
        } else {
            if (this.sopData && updateImage) {
                updateDraw = true;
            }
        }
        ViewerUtil.setTrace("2");
        if (updateDraw || updateImage && this.ctx) {
            while (this.DrawTextPanel.firstChild)
                this.DrawTextPanel.removeChild(this.DrawTextPanel.firstChild);

            var w = $(this.Element).width();
            var h = $(this.Element).height();
            if (this.ctx.canvas.width != w ||
                this.ctx.canvas.height != h) {
                this.ctx.canvas.width = w;
                this.ctx.canvas.height = h;
            }
            this.ctx.save();
            //            this.ctx.translate(w / 2, h / 2);
            //            this.ctx.rotate(sopData.seriesData.ImageRotate/180*Math.PI);
            //            this.ctx.translate(-w / 2, -h / 2);
            if (this.sopData==null || this.sopData.isDrawing==false) {
                this.tmpctx.clearRect(0, 0, w, h);
            }
            this.ctx.clearRect(0, 0, w, h);
            //データの更新に伴う画像の更新
            if (this.sopData && this.sopData.isDraw) {
                var baseScale = this.getBaseScale();
                var point = this.localToGlobal({ x: 0, y: 0 });
                var scale = this.getScale();
                if (scale * sopData.ImageWidth > 8 && scale * sopData.ImageHeight > 8) {
                    if (typeof G_vmlCanvasManager == "undefined") {
                        this.sopData.Map.drawImageCanvas(this.ctx,
                            this.getScale(),
                            sopData.getImageRotate(),
                            sopData.getImageFlipX(),
                            point.x,
                            point.y,
                            0, 0,
                            sopData.ImageWidth,
                            sopData.ImageHeight
                            );
                    }
                }
                var gr = new Graphics(this, this.ctx, "main");
                for (i = 0; i < sopData.DrawItems.length; i++) {
                    sopData.DrawItems[i].draw(gr);
                }
                //カットライン描画
                if (this.Viewer.getData().isCutline) {
                    var series = this.Viewer.getSelectSeries();
                    if (series) {
                        var seriesdata = series.getData();
                        if (seriesdata) {
                            var sops = seriesdata.getDispSops();
                            sopData.CutlineSeries = series;
                            sopData.CutlineSops = sops;
                            for (var i = 0; i < sops.length; i++) {
                                if (sops[i].isCutline) {
                                    this.drawCutline(gr, sops[i]);
                                }
                            }
                        }
                    }
                }
                this.DrawPR(gr);
                sopData.isUpdateDraw = false;
            } else {
                //SOPパネルのデータがなくなっているので全データを削除
                while (this.ImagePanel.firstChild)
                    this.ImagePanel.removeChild(this.ImagePanel.firstChild);
            }
            this.ctx.restore();
        }
        ViewerUtil.setTrace("3");
        this.DrawTempItem();
        ViewerUtil.setTrace("4");
        //開放
        this.Dispose = function () {
            this.Series.WorkPanel.removeChild(this.Element);
        }
        ViewerUtil.setTrace("5");
        if (isDataChange) {
            ViewerUtil.Events.onLoadSop(this);
            if (this.isSelect()) {
                ViewerUtil.Events.onSelectSop(this);
            }
        }
        ViewerUtil.Events.onTickSop(this);
        ViewerUtil.popTrace();
    }
    this.traceDraw = function () {
        if (sopData) {
            var array = [];
            var wc = sopData.getWindowCenter();
            var ww = sopData.getWindowWidth();
            array.push("begin " + this.ctx.canvas.width + " " + this.ctx.canvas.height);
            array.push("set WindowLevel " + wc + " " + ww);
            array.push("set ImageRotate " + sopData.getImageRotate());
            array.push("set ImageScale " + this.getScale());
            //array.push("set ImagePosition " + sopData.SeriesImageLeft + " " + sopData.SeriesImageTop);
            array.push("set ImagePosition " + sopData.getImageLeft() + " " + sopData.getImageTop());
            array.push("set ImageFlipX " + sopData.getImageFlipX());
            array.push("set ImageKey " +sopData.InitParam.ImageKey);
            array.push("image");
            var gr = new TraceGraphics(this);
            for (i = 0; i < sopData.DrawItems.length; i++) {
                sopData.DrawItems[i].draw(gr);
            }
            array = array.concat(gr.trace);
            return array;
        }
        return [];
    }
    this.onInit();
}
SopPanel.prototype = {
    onInit: function () {

    }
};

// 継承関数
function inherit(subClass, superClass) {
    var copy_undef_properties=function(src, dest) {
        for (var prop in src) {
            if (typeof (dest[prop]) == "undefined") {
                dest[prop] = src[prop];
            }
        }
    }
    copy_undef_properties(superClass.prototype, subClass.prototype);
}

function UndoObject(name, fc) {
    this.name = name;
    this.undo = fc;
}
function Graphics(panel,ctx,mode) {
    this.panel = panel;
    this.ctx = ctx;
    this.mode = mode;
    this.clear=function(){
        var w = $(this.panel.Element).width();
        var h = $(this.panel.Element).height();
        this.ctx.clearRect(0, 0, w, h);
    }
    this.localToGlobal = function (p) {
        return panel.localToGlobal(p);
    }
    this.drawrectglobal = function (x, y, w, h, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.strokeRect(x, y, w , h);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    this.drawrect = function (x, y, w, h, color) {
        var p0 = panel.localToGlobal({ x: x, y: y });
        var p1 = panel.localToGlobal({ x: x+w, y: y+h });
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.strokeRect(p0.x, p0.y, p1.x - p0.x, p1.y - p0.y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    this.drawline = function (p0, p1, width, color) {
        var p0g = panel.localToGlobal(p0);
        var p1g = panel.localToGlobal(p1);
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = 'square';
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(p0g.x, p0g.y);
        this.ctx.lineTo(p1g.x, p1g.y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    this.drawlines = function (points, index, width, color) {
        if (points.length -index < 2)
            return;
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = 'square';
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(points[index].x, points[index].y);
        for (var i = index+1; i < points.length; i++)
            this.ctx.lineTo(points[i].x, points[i].y);
        this.ctx.stroke();
    }
    this.drawarrow = function (p0, p1, width, color) {
        p0 = panel.localToGlobal(p0);
        p1 = panel.localToGlobal(p1);
        if (p0.x == p1.x && p0.y == p1.y)
            return;
        var len = Math.sqrt((p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y));
        p2 = { x: p0.x + (p1.x - p0.x) / len * (len - 3), y: p0.y + (p1.y - p0.y) / len * (len - 3) }
        var mat = MatrixFromVector(new Point(p1.x - p0.x, (p1.y - p0.y)), p1);
        var pa = mat.Transform(-20, 10);
        var pb = mat.Transform(-20, -10);
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.ctx.lineCap = 'square';
        this.ctx.lineJoin = 'bevel';
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p2.x, p2.y);
/*
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
*/
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.moveTo(pa.x, pa.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.lineTo(pb.x, pb.y);
        this.ctx.fill();
    }
    this.drawtext = function (p0, text, font, fontstyle, tag,tf) {
        var p0g = panel.localToGlobal(p0);
        /*
        this.ctx.font = font;
        this.ctx.fillStyle = fontstyle;
        this.ctx.fillText(text, p0g.x,p0g.y);
        */
        if (tag == null) {
            tag = document.createElement("SPAN");
        }
        this.panel.DrawTextPanel.appendChild(tag);
        tag.style.position = "absolute";
        tag.style.left = p0g.x + "px";
        tag.style.top = p0g.y + "px";
        if (font != null && font != "") {
            tag.style.font = font;
        } else {
            tag.style.font = ViewerUtil.Draw.Font;
        }
        tag.style.color = fontstyle;
        if (tf) {
            tag.style.textAlign = tf.toLowerCase();
            switch(tf.toLowerCase())
            {
                case "right":
                    tag.style.left = (p0g.x-10000) + "px";
                    tag.style.width = "10000px";
                    break;
                case "center":
                    tag.style.left = (p0g.x - 10000) + "px";
                    tag.style.width = "20000px";
                    break;
                case "left":
                    break;
            }
        }

        tag.innerHTML = text;
        return { x: p0g.x, y: p0g.y, w: tag.offsetWidth, h: tag.offsetHeight , tag: tag };
    }
    this.drawdot = function (p0, width, color) {
        this.ctx.beginPath();
        p0 = panel.localToGlobal(p0);
        this.ctx.arc(p0.x, p0.y, width, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
    this.drawellipse = function (p0, width,height, linewidth, color) {
        width = panel.getScale() * width;
        this.ctx.beginPath();
        p0 = panel.localToGlobal(p0);
        this.ctx.strokeStyle = color;
        this.ctx.save();
        this.ctx.scale(width, height);
        this.ctx.arc(p0.x, p0.y, 1, 0, 2 * Math.PI, false);
        this.ctx.restore();
        this.ctx.lineWidth = linewidth;
        this.ctx.stroke();
    }
    this.drawcircle = function (p0, width, linewidth, color) {
        width=panel.getScale() * width;
        this.ctx.beginPath();
        p0 = panel.localToGlobal(p0);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = linewidth;
        this.ctx.arc(p0.x, p0.y, width, 0, 2 * Math.PI, false);
        this.ctx.stroke();
    }
    this.unscaleddrawcircle = function (p0, width, color) {
        this.ctx.beginPath();
        p0 = panel.localToGlobal(p0);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.arc(p0.x, p0.y, width, 0, 2 * Math.PI, false);
        this.ctx.stroke();
    }
}
function TraceGraphics(panel) {
    this.panel = panel;
    this.mode = "main";
    this.trace = [];
    this.clear = function () {
    }
    this.localToGlobal = function (p) {
        return panel.localToGlobal(p);
    }
    this.drawline = function (p0, p1, width, color) {
        var p0g = panel.localToGlobal(p0);
        var p1g = panel.localToGlobal(p1);
        this.trace.push(
            "line " + p0g.x + "," + p0g.y + " " + p1g.x + "," + p1g.y+" "+width+" "+color
        );
    }
    this.drawlines = function (points, index, width, color) {
        if (points.length - index < 2)
            return;
        var array = [];
        for (var i = 0; i < points.length; i++)
            array.push(points[i].x + "," + points[i].y);
        this.trace.push(
            "lines " + array.join("\\") + " " + width + " " + color
        );
    }
    this.drawarrow = function (p0, p1, width, color) {
        var array = [];
        p0 = panel.localToGlobal(p0);
        p1 = panel.localToGlobal(p1);
        if (p0.x == p1.x && p0.y == p1.y)
            return;
        var len = Math.sqrt((p1.x - p0.x) * (p1.x - p0.x) + (p1.y - p0.y) * (p1.y - p0.y));
        p2 = { x: p0.x + (p1.x - p0.x) / len * (len - 3), y: p0.y + (p1.y - p0.y) / len * (len - 3) }
        var mat = MatrixFromVector(new Point(p1.x - p0.x, (p1.y - p0.y)), p1);
        var pa = mat.Transform(-20, 10);
        var pb = mat.Transform(-20, -10);
        this.trace.push(
            "line " + p0.x + "," + p0.y + " " + p2.x + "," + p2.y + " " + width + " " + color
        );
        array.push(pa.x + "," + pa.y);
        array.push(p1.x + "," + p1.y);
        array.push(pb.x + "," + pb.y);
        this.trace.push(
            "fillpolygon " + array.join("\\") + " " + color
        );
    }
    this.drawtext = function (p0, text, font, fontstyle, tag) {
        if (tag == null)
            return { x: 0, y: 0, w: 0, h: 0, tag: null };
        var p0g = panel.localToGlobal(p0);
        this.trace.push(
            "text \"" + text + "\" " + p0g.x + "," + p0g.y + " \"" + font + "\" " + fontstyle
        );
        return { x: p0g.x, y: p0g.y, w: tag.offsetWidth, h: tag.offsetHeight, tag: tag };
    }
    this.drawdot = function (p0, width, color) {
        p0 = panel.localToGlobal(p0);
        this.trace.push(
            "dot " + p0.x + "," + p0.y + " " + width + " " + color 
        );
    }
    this.drawellipse = function (p0, width, height, linewidth, color) {
        width = panel.getScale() * width;
        p0 = panel.localToGlobal(p0);
        this.trace.push(
            "ellipse " + p0.x + "," + p0.y + " " + width + " " +height + " "+ linewidth + " " + color
        );
    }
    this.drawcircle = function (p0, width,linewidth, color) {
        width = panel.getScale() * width;
        p0 = panel.localToGlobal(p0);
        this.trace.push(
            "circle " + p0.x + "," + p0.y + " " + width + " " + linewidth + " " + color
        );
    }
}

/*
*・描画オブジェクト基本
*　├親オブジェクト
*　├イベント
*　├移動
*　├初期化イベント
*　├描画
*　│├ローカル座標描画   ローカル座標で描画 ※通常はこちら
*　│└グローバル座標描画 自前で座標を算出しなおして描画
*　│　※円などのオブジェクトがローカル座標ではIEへの描画ライブラリにより破綻する対策
*　├当たり判定
*　└ヒット時カーソル形状
*
*・操作点：描画オブジェクト基本
*　└座標
*
*・描画オブジェクト：描画オブジェクト基本
*　├描画オブジェクト配列
*  └制御用配列取得
*
*補助
*・描画オブジェクト設定
*　└イベント
*
*初期化イベント(name,point)
*name
* begin: 開始 初期化リストを返す
* run  : 実行中
* end  : 終了
*end時falseを返すとbeginからやり直し
*
*イベント
*   c_move    :子オブジェクトの移動
*   c_initrun
*   c_initbegin
*   c_initend
*/
//描画オブジェクト
function DrawObjectBase(parent) {
    this.name = "DrawObjectBase";
    this.parent = parent;
    this.cursor = "default";
    this.base = null;
    this.basebase = null;
    this.isClearDraw = true;
}
DrawObjectBase.prototype = {
    onevent: function (name, obj) { },
    move: function (x, y) {
    },
    draw: function (gr) { },
    init: null, //function(name,point){}
    ishit: function (size, pos, gpos) { return false; },
    isinit: function () { return true; },
    isselect: false,
    getroot: function () {
        var p = this;
        while (p.parent) {
            p = p.parent;
        }
        return p;
    }
};
//操作点
function SelectObject(parent, p) {
    this.base = DrawObjectBase;
    this.base(parent);
    this.name = "SelectObject";

    this.cursor = "se-resize";
    this.point = p;
}
SelectObject.prototype = {
    onevent: function (name, obj) { },
    move: function (x, y) {
        this.point.x += x;
        this.point.y += y;
        if (this.parent != null)
            this.parent.onevent("c_move", this, { x: x, y: y });
    },
    ishit: function (size, pos, gpos) {
        return ((this.point.x - size) <= pos.x && (this.point.x + size) >= pos.x &&
			    (this.point.y - size) <= pos.y && (this.point.y + size) >= pos.y);
    },
    draw: function (gr) {
        if (this.isselect) {
            gr.drawdot(this.point, 6, "blue");
            gr.unscaleddrawcircle(this.point, 64, "blue");
        }
    }
};
inherit(SelectObject, DrawObjectBase);
//描画オブジェクト
function DrawObject(parent) {
    this.base = DrawObjectBase;
    this.base(parent);
    this.name = "DrawObject";

    this.cursor = "move";
    this.child = [];
}
DrawObject.prototype = {
    move: function (x, y) {
        for (var i = 0; i < this.child.length; i++)
            this.child[i].move(x, y);
        if (this.parent != null)
            this.parent.onevent("c_move", this, { x: x, y: y });
    },
    getitems: function () {
        var a = new Array();
        for (var i = 0; i < this.child.length; i++) {
            if (this.child[i].getitems != undefined)
                a = a.concat(this.child[i].getitems());
            else
                a.push(this.child[i]);
        }
        a.push(this);
        return a;
    }
};
inherit(DrawObject, DrawObjectBase);
/*
* 描画オブジェクト派生
*・描画オブジェクトn
*　│└直線オブジェクト
*　│　└矢印オブジェクト
*　├点オブジェクト
*　├円オブジェクト
*　├自由曲線オブジェクト
*　├文字列オブジェクト
*　├距離計測オブジェクト
*　│└[直線オブジェクト]
*　└角度計測オブジェクト  
*　　└[直線オブジェクト]
*　　　[直線オブジェクト]
*　　　[直線オブジェクト]
*　　　[文字列オブジェクト]
*/
//直線
function DrawLineObject(parent, p0, p1, width, color) {
    this.base = DrawObject;
    this.base(parent);
    this.name = "DrawLineObject";
    this.child = [
        new SelectObject(this, p0),
        new SelectObject(this, p1)
    ];
    this.width = width;
    this.color = color;
    this.init0 = false;
}
DrawLineObject.prototype = {
    draw: function (gr) {
        if (this.isinit()) {
            gr.drawline(this.child[0].point, this.child[1].point, this.width, this.color);
        } else if (this.init0) {
            gr.drawdot(this.child[0].point, 6, "blue");
        }
        if (this.isselect) {
            gr.drawdot(this.child[0].point, 6, "blue");
            gr.drawdot(this.child[1].point, 6, "blue");
        }
        this.child[0].draw(gr);
        this.child[1].draw(gr);
    },
    isinit: function () {
        if (
            this.child[0].point.x == this.child[1].point.x &&
            this.child[0].point.y == this.child[1].point.y
        )
            return false;
        return true;
    },
    init: function (name, point) {
        switch (name) {
            case "begin":
                if (!this.init0) {
                    this.child[0].point = point;
                    this.init0 = true;
                }
                this.child[1].point = point;
                if (this.parent != null)
                    this.parent.onevent("c_initbegin", this);
                return [];
            case "run":
                this.child[1].point = point;
                if (this.parent != null)
                    this.parent.onevent("c_initrun", this);
                break;
            case "end":
                this.child[1].point = point;
                if (this.parent != null)
                    this.parent.onevent("c_initend", this);
        }
        return function (self) { };
    },
    ishit: function (size, pos, gpos) {
        var fc = function (p0, p1, pos) {
            var dx = p1.x - p0.x;
            var dy = p1.y - p0.y;
            var a = dx * dx + dy * dy;
            if (a == 0)
                return Math.sqrt((p0.x - pos.x) * (p0.x - pos.x) + (p0.y - pos.y) * (p0.y - pos.y));
            var b = dx * (p0.x - pos.x) + dy * (p0.y - pos.y);
            var t = -(b / a);
            if (t < 0) t = 0;
            if (t > 1) t = 1;
            var x = t * dx + p0.x;
            var y = t * dy + p0.y;
            return Math.sqrt((x - pos.x) * (x - pos.x) + (y - pos.y) * (y - pos.y));
        }
        var value = fc(this.child[0].point, this.child[1].point, pos);
        return value < size;
    },
    onevent: function (name, obj, pos) {
        if (this.parent != null) {
            switch (name) {
                case "c_move":
                    this.parent.onevent("p_move", this, { x: pos.x, y: pos.y, item: obj });
                    break;
            }
        }
    },
    center: function () {
        return new Point(
            this.child[0].point.x + (this.child[1].point.x - this.child[0].point.x) / 2,
            this.child[0].point.y + (this.child[1].point.y - this.child[0].point.y) / 2);
    }
};
inherit(DrawLineObject, DrawObject);
//矢印
function DrawArrowObject(parent, p0, p1, width, color) {
    this.base = DrawLineObject;
    this.base(parent, p0, p1, width, color);
    this.name = "DrawArrowObject";
}
DrawArrowObject.prototype = {
    draw: function (gr) {
        gr.drawarrow(this.child[0].point, this.child[1].point, this.width, this.color);
        if (this.isselect) {
            gr.drawdot(this.child[0].point, 6, "blue");
            gr.drawdot(this.child[1].point, 6, "blue");
        }
        this.child[0].draw(gr);
        this.child[1].draw(gr);
    }
};
inherit(DrawArrowObject, DrawLineObject);
//点
function DrawDotObject(parent, point, width, color) {
    this.base = DrawObject;
    this.base(parent);
    this.name = "DrawDotObject";
    this.child = [];
    this.point = point;
    this.width = width;
    this.color = color;
}
DrawDotObject.prototype =
{
    move: function (x, y) {
        this.point.x += x;
        this.point.y += y;
    },
    draw: function (gr) {
        if (this.isselect) {
            gr.drawdot(this.point, this.width + 2, this.color);
            gr.drawdot(this.point, this.width, "blue");
        } else {
            gr.drawdot(this.point, this.width, this.color);
        }
    },
    init: function (name, point) {
        this.point = point;
        switch (name) {
            case "begin":
                if (this.parent != null)
                    this.parent.onevent("c_initbegin", this);
                return [];
            case "run":
                this.point = point;
                if (this.parent != null)
                    this.parent.onevent("c_initbegin", this);
            case "end":
                if (this.parent != null)
                    this.parent.onevent("c_initend", this);
        }
        return function (self) { };
    },
    ishit: function (size, pos, gpos) {
        return false;
    },
    onevent: function (name, obj) {
    }
}
inherit(DrawDotObject, DrawObject);
//円
function DrawCircleObject(parent, point, width, color) {
    this.base = DrawObject;
    this.base(parent);
    this.name = "DrawCircleObject";
    this.child = [];
    this.point = point;
    this.width = width;
    this.lineWidth = 1;
    this.color = color;
}
DrawCircleObject.prototype =
{
    move: function (x, y) {
        this.point.x += x;
        this.point.y += y;
        if (this.parent != null)
            this.parent.onevent("c_move", this, { x: x, y: y });
    },
    draw: function (gr) {
        if (this.isselect) {
            if (this.width > 0) {
                gr.drawcircle(this.point, this.width,this.lineWidth, this.color);
                gr.drawcircle(this.point, this.width + 2,2, "blue");
            } else
                gr.drawdot(this.point, 2, "blue");
        } else {
            if (this.width > 0)
                gr.drawcircle(this.point, this.width,this.lineWidth, this.color);
            else
                gr.drawdot(this.point, 2, this.color);
        }
    },
    init: function (name, point) {
        switch (name) {
            case "begin":
                this.point = point;
                if (this.parent != null)
                    this.parent.onevent("c_initbegin", this);
                return [];
            case "run":
                var w = point.x - this.point.x;
                var h = point.y - this.point.y;
                this.width = Math.sqrt(w * w + h * h);
                if (this.parent != null)
                    this.parent.onevent("c_initrun", this);
                break;
            case "end":
                if (this.parent != null)
                    this.parent.onevent("c_initend", this);
        }
        return function (self) { };
    },
    ishit: function (size, pos, gpos) {
        var w = this.point.x - pos.x;
        var h = this.point.y - pos.y;
        var width = Math.sqrt(w * w + h * h);
        return (Math.abs(width - this.width) < size);
    },
    onevent: function (name, obj) {
        if (this.parent != null)
            this.parent.onevent(name, this);
    }
}
inherit(DrawCircleObject, DrawObject);
//文字列
function DrawTextObject(parent, point, text,font,fontstyle) {
    this.base = DrawObject;
    this.base(parent);
    this.name = "DrawTextObject";
    this.child = [];
    this.point = point;
    this.text = text;
    this.font = font;
    this.fontstyle = fontstyle;
    this.rect = { x: 0, y: 0, w: 0, h: 0 ,tag:null};
}
DrawTextObject.prototype =
{
    move: function (x, y) {
        this.point.x += x;
        this.point.y += y;
    },
    draw: function (gr) {
        this.rect = gr.drawtext(this.point, this.text, this.font, this.fontstyle, this.rect.tag);
        if (this.isselect) {
            gr.drawrectglobal(this.rect.x, this.rect.y, this.rect.w, this.rect.h, "blue");
        }
    },
    init: function (name, point) {
        switch (name) {
            case "begin":
                this.point = point;
                return [];
            case "run":
            case "end":
                this.point = point;
                return function (self) { };
        }
    },
    ishit: function (size, pos, gpos) {
        return (this.rect.x <= gpos.x &&
                 this.rect.y <= gpos.y &&
                (this.rect.x + this.rect.w) > gpos.x &&
                (this.rect.y + this.rect.h) > gpos.y);
    },
    onevent: function (name, obj) {
    }
}
inherit(DrawTextObject, DrawObject);

//距離計測オブジェクト
function DrawMeasureObject(sopdata,parent, p0, p1, width, color,font,fontstyle) {
    this.base = DrawObject;
    this.base(parent);
    this.data = sopdata;
    this.name = "DrawMeasureObject";
    this.child = [
        new DrawLineObject(this, p0, p1, width, color),
        new DrawTextObject(this, p0, "0",font,fontstyle)
    ];
    this.width = width;
    this.color = color;
    this.layout();
}
DrawMeasureObject.prototype = {
    draw: function (gr) {
        //        gr.line(this.child[0].point,this.child[1].point,this.width,this.color);
        this.child[0].draw(gr);
        this.child[1].draw(gr);
        if (this.isselect) {
            gr.drawdot(this.child[0].point, 6, "blue");
            gr.drawdot(this.child[1].point, 6, "blue");
        }
    },
    init: function (name, point) {
        switch (name) {
            case "begin":
                return [
                    this.child[0]
                ];
            case "run":
            case "end":
                return function (self) { };
        }
    },
    ishit: function (size, pos, gpos) {
        return false;
    },
    layout: function () {
        var pos = this.child[0].center();
        this.child[1].point = pos;
        var line = this.child[0];
        var p0 = line.child[0].point;
        var p1 = line.child[1].point;
        var vx = (p1.x - p0.x) * this.data.XLength;
        var vy = (p1.y - p0.y) * this.data.YLength;
        var k = Math.sqrt(vx * vx + vy * vy);
        this.child[1].text = k.toFixed(2) + this.data.Unit;
    },
    onevent: function (name, obj) {
        switch (name) {
            case "p_move":
            case "c_move":
            case "c_initrun":
            case "c_initend":
                if (obj == this.child[0])
                    this.layout();
                break;
        }
    }
}
inherit(DrawMeasureObject, DrawObject);

//角度計測オブジェクト  
function DrawAngle4Object(data, parent, p0, p1, p2, p3, width, color, width2, color2, font, fontstyle) {
    this.data = data;
    this.base = DrawObject;
    this.base(parent);
    this.name = "DrawAngle4Object";
    this.font = font;
    this.fontstyle = fontstyle;
    this.child = [
        new DrawLineObject(this, p0, p1, width, color),
        new DrawLineObject(this, p2, p3, width, color),
        new DrawLineObject(this, p0, p0, width2, color2),
        new DrawTextObject(this, p0, "0",font,fontstyle)
    ];
    for (var i = 0; i < 4; i++) {
        this.child[i].index = i;
        this.child[i].visible = true;
    }
    this.lock = false;
    this.layout();
}
DrawAngle4Object.prototype = {
    draw: function (gr) {
        for (var i = 0; i < this.child.length; i++)
            if (this.child[i].visible) {
                this.child[i].draw(gr);
            }
        if (this.isselect) {
            gr.drawdot(p0, 6, "blue");
            gr.drawdot(p1, 6, "blue");
            gr.drawdot(p2, 6, "blue");
            gr.drawdot(p3, 6, "blue");
        }
    },
    init: function (name, point) {
        switch (name) {
            case "begin":
                this.child[0].visible = true;
                this.child[1].visible = false;
                this.child[2].visible = false;
                return [
                    this.child[1],
                    this.child[0]
                ];
            case "run":
            case "end":
                return function (self) { };
        }
    },
    ishit: function (size, pos, gpos) {
        return false;
    },
    layout: function () {
        this.child[2].child[0].point = this.child[0].center();
        this.child[2].child[1].point = this.child[1].center();
        this.child[3].point = this.child[2].center();
        var line = this.child[0];
        var p0 = [line.child[0].point, line.child[1].point];
        var line = this.child[1];
        var p1 = [line.child[0].point, line.child[1].point];

        var p = crossPoint(p0[0], p0[1], p1[0], p1[1], false);
        var center = this.child[2];
        if (p == null) {
            this.child[3].text = "";
            return;
        }
        var line = this.child[0];
        var p0 = [line.child[0].point, line.child[1].point];
        if (LinePointLR(center.child[0].point, center.child[1].point, line.child[0].point) > 0)
            p0.reverse();
        var line = this.child[1];
        var p1 = [line.child[0].point, line.child[1].point];
        if (LinePointLR(center.child[0].point, center.child[1].point, line.child[0].point) > 0)
            p1.reverse();
        var v0 = new Vector((p0[1].x - p0[0].x) * this.data.XLength, (p0[1].y - p0[0].y) * this.data.YLength);
        var v1 = new Vector((p1[1].x - p1[0].x) * this.data.XLength, (p1[1].y - p1[0].y) * this.data.YLength);
        v0.Normal();
        v1.Normal();
        var dot = v0.x * v1.x + v0.y * v1.y;
        v = Math.acos(dot) * (180.0 / Math.PI);
        this.child[3].text = v.toFixed(2) + "°";

    },
    layout2: function () {
        var o = this.child[0];
        var p1 = o.center();
        var p2 = this.child[2].child[0].point;
        o.child[0].point.x += p2.x - p1.x;
        o.child[0].point.y += p2.y - p1.y;
        o.child[1].point.x += p2.x - p1.x;
        o.child[1].point.y += p2.y - p1.y;

        var o = this.child[1];
        var p1 = o.center();
        var p2 = this.child[2].child[1].point;
        o.child[0].point.x += p2.x - p1.x;
        o.child[0].point.y += p2.y - p1.y;
        o.child[1].point.x += p2.x - p1.x;
        o.child[1].point.y += p2.y - p1.y;

        this.child[3].point = this.child[2].center();

    },
    onevent: function (name, obj, pos) {
        switch (name) {
            case "c_initbegin":
                break;
            case "c_initrun":
                if (obj.index == 1) {
                    this.child[1].visible = true;
                    this.child[2].visible = true;
                    this.child[3].visible = true;
                } break;
            case "c_initend":
                if (obj.index == 0) {
                    this.child[1].visible = true;
                }
                if (obj.index == 1) {
                    this.child[2].visible = true;
                    this.child[3].visible = true;
                }
                break;
            case "c_move":
            case "p_move":
                if (obj.index == 2) {
                    this.layout2();
                    return;
                }
                break;
            default:
                return;
        }
        if (obj.index < 2)
            this.layout();
    }
}
inherit(DrawAngle4Object, DrawObject);

function DrawAngle3Object(data, parent, p0, p1, p2, width, color, width2, color2, font, fontstyle) {
    this.data = data;
    this.base = DrawObject;
    this.base(parent);
    this.name = "DrawAngle3Object";
    this.font = font;
    this.fontstyle = fontstyle;
    this.child = [
        new DrawDotObject(this, p0, 6, "blue"),
        new DrawDotObject(this, p0, 6, "blue"),
        new DrawDotObject(this, p0, 6, "blue"),
        new DrawLineObject(this, p0, p1, width, color),
        new DrawLineObject(this, p1, p2, width, color),
        new DrawLineObject(this, p0, p0, width2, color2),
        new DrawTextObject(this, p0, "0", font, fontstyle)
    ];
    this.lines = [
        this.child[3],
        this.child[4],
        this.child[5]
    ];
    var astline = this.lines[2];
    astline.child[0].ishit = function () { return false; }
    astline.child[1].ishit = function () { return false; }
    var my = this;
    astline.move = function (x, y) {
        my.lines[0].child[0].point.x += x;
        my.lines[0].child[0].point.y += y;
        my.lines[0].child[1].point.x += x;
        my.lines[0].child[1].point.y += y;
        my.lines[1].child[1].point.x += x;
        my.lines[1].child[1].point.y += y;
        my.layout2();
    }
    this.text = this.child[6];
    for (var i = 0; i < 7; i++) {
        this.child[i].index = i;
        this.child[i].visible = false;
    }
    this.lock = false;
    this.layout();
}
DrawAngle3Object.prototype = {
    draw: function (gr) {
        for (var i = 0; i < this.child.length; i++)
            if (this.child[i].visible) {
                this.child[i].draw(gr);
            }
        if (this.isselect) {
            gr.drawdot(p0, 6, "blue");
            gr.drawdot(p1, 6, "blue");
            gr.drawdot(p2, 6, "blue");
            gr.drawdot(p3, 6, "blue");
        }
    },
    init: function (name, point) {
        switch (name) {
            case "begin":
                this.lines[0].visible = false;
                this.lines[1].visible = false;
                this.lines[2].visible = false;
                return [
                    this.child[2],
                    this.child[1],
                    this.child[0]
                ];
            case "run":
            case "end":
                return function (self) { };
        }
    },
    ishit: function (size, pos, gpos) {
        return false;
    },
    layout: function () {
        //アシストライン設定
        var astline = this.lines[2];
        var ast0 = this.lines[0].center();
        var ast1 = this.lines[1].center();
        astline.child[0].point = ast0;
        astline.child[1].point = ast1;
        this.text.point = astline.center();
        var p0 = this.lines[0].child[0].point;
        var p1 = this.lines[0].child[1].point;
        var p2 = this.lines[1].child[0].point;
        var p3 = this.lines[1].child[1].point;
        var p = crossPoint(p0, p1, p2, p3, false);
        if (p == null) {
            this.text.text = "";
            return;
        }
        //角度設定
        var ps0 = [p0, p1];
        if (LinePointLR(ast0, ast1, p0) > 0)
            ps0.reverse();

        var ps1 = [p2, p3];
        if (LinePointLR(ast0, ast1, p2) > 0)
            ps1.reverse();
        var v0 = new Vector((ps0[1].x - ps0[0].x) * this.data.XLength, (ps0[1].y - ps0[0].y) * this.data.YLength);
        var v1 = new Vector((ps1[1].x - ps1[0].x) * this.data.XLength, (ps1[1].y - ps1[0].y) * this.data.YLength);

        v0.Normal();
        v1.Normal();
        var dot = v0.x * v1.x + v0.y * v1.y;
        v = Math.acos(dot) * (180.0 / Math.PI);
        this.text.text = v.toFixed(2) + "°";

    },
    layout2: function () {
        var astline = this.lines[2];
        var ast0 = this.lines[0].center();
        var ast1 = this.lines[1].center();
        astline.child[0].point = ast0;
        astline.child[1].point = ast1;
        this.text.point = astline.center();
    },
    onevent: function (name, obj, pos) {
        switch (name) {
            case "c_initbegin":
                break;
            case "c_initrun":
                break;
            case "c_initend":
                switch (obj.index) {
                    case 0:
                        obj.visible = true;
                        this.lines[0].child[0].point = obj.point;
                        break;
                    case 1:
                        this.child[0].visible = false;
                        obj.visible = true;
                        this.lines[0].visible = true;
                        this.lines[0].child[1].point =
                        this.lines[1].child[0].point = obj.point;
                        this.layout();
                        break;
                    case 2:
                        this.lines[1].child[1].point = obj.point;
                        this.child[1].visible = false;
                        this.lines[1].visible = true;
                        this.lines[2].visible = true;
                        this.text.visible = true;
                        this.layout();
                        break;
                }
                break;
            case "c_move":
            case "p_move":
                break;
            default:
                return;
        }
        if (this.text.visible)
            this.layout();
    }
}
inherit(DrawAngle3Object, DrawObject);
//自由曲線
function DrawFreeLineObject(parent,width, color) {
    this.base = DrawObject;
    this.base(parent);
    this.name = "DrawFreeLineObject";
    this.child = [];
    this.width = width;
    this.color = color;
    this.points = new Array();
    this.gpoints = new Array();
    this.isClearDraw = false;
    this.isDrawEnd = false;
}
DrawFreeLineObject.prototype = {
    draw: function (gr) {
        //座標再計算が必要
        if (gr.mode == "main")
            this.reset_points();
        this.draw_sub(gr);
    },
    reset_points: function () {
        this.gpoints.length = 0;
        for (var i = 0; i < this.child.length; i++) {
            this.child[i].reset_points();
        }
    },
    draw_sub: function (gr) {
        var index = this.gpoints.length;
        for (var i = this.gpoints.length; i < this.points.length; i++) {
            this.gpoints.push(gr.localToGlobal(this.points[i]));
        }
        if (this.isDrawEnd) {
            var color = this.color;
            if (this.isselect) {
                color = "blue";
            }
            gr.drawlines(this.gpoints, 0, this.width, color);
        } else {
            if (index > 0) index--;
            gr.drawlines(this.gpoints, index, this.width, this.color);
        }
        for (var i = 0; i < this.child.length; i++) {
            this.child[i].isselect = this.isselect;
            this.child[i].draw_sub(gr);
        }
    },
    init: function (name, point) {
        this.points.push(point);
        this.time = new Date();
        if (name == "begin")
            return [];
        if (name == "end") {
            this.isDrawEnd = true;
            this.isClearDraw = true;
        }
        return new Function();
    },
    move: function (x, y, ox, oy) {
        this.getroot().movesub(x, y, ox, oy);
    },
    movesub: function (x, y, ox, oy) {
        for (var i = 0; i < this.gpoints.length; i++) {
            this.gpoints[i].x += ox;
            this.gpoints[i].y += oy;
        }
        for (var i = 0; i < this.points.length; i++) {
            this.points[i].x += x;
            this.points[i].y += y;
        }
        for (var i = 0; i < this.child.length; i++) {
            this.child[i].movesub(x, y, ox, oy);
        }
    },
    hittest: function (p0, p1, pos) {
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        var a = dx * dx + dy * dy;
        if (a == 0)
            return Math.sqrt((p0.x - pos.x) * (p0.x - pos.x) + (p0.y - pos.y) * (p0.y - pos.y));
        var b = dx * (p0.x - pos.x) + dy * (p0.y - pos.y);
        var t = -(b / a);
        if (t < 0) t = 0;
        if (t > 1) t = 1;
        var x = t * dx + p0.x;
        var y = t * dy + p0.y;
        return Math.sqrt((x - pos.x) * (x - pos.x) + (y - pos.y) * (y - pos.y));
    },
    onevent: function (name, obj, pos) {
    },
    ishit: function (size, pos, gpos, scale) {
        size *= scale;
        if (this.gpoints.length < 2)
            return false;
        if ((new Date() - this.time) < 1000) {
            return false;
        }
        for (var i = 0; i < this.gpoints.length - 1; i++) {
            var value = this.hittest(this.gpoints[i], this.gpoints[i + 1], gpos);
            if (value < size)
                return true;
        }
        for (var i = 0; i < this.child.length; i++) {
            if (this.child[i].ishit(size, pos, gpos, scale))
                return true;
        }
        return false;
    },
    getitems: function () {
        return [this.getroot()];
    }
}
inherit(DrawFreeLineObject, DrawObject);
//CTR
function DrawCTRObject(data, parent, width, color,font, fontstyle) {
    this.data = data;
    this.base = DrawObject;
    this.base(parent);
    this.name = "DrawCTRObject";
    this.font = font;
    this.fontstyle = fontstyle;
    this.child = [
        new DrawDotObject(this, { x: 0, y: 0 }, 6, "blue"),
        new DrawDotObject(this, { x: 0, y: 0 }, 6, "blue"),
        new DrawDotObject(this, { x: 0, y: 0 }, 6, "blue"),
        new DrawDotObject(this, { x: 0, y: 0 }, 6, "blue"),
        new DrawLineObject(this, { x: 0, y: 0 }, { x: 0, y: 0 }, width, color),
        new DrawLineObject(this, { x: 0, y: 0 }, { x: 0, y: 0 }, width, color),
        new DrawLineObject(this, { x: 0, y: 0 }, { x: 0, y: 0 }, width, color),
        new DrawLineObject(this, { x: 0, y: 0 }, { x: 0, y: 0 }, width, color),
        new DrawTextObject(this, { x: 0, y: 0 }, "0", font, fontstyle)
    ];
    this.lines = [
        this.child[4],
        this.child[5],
        this.child[6],
        this.child[7]
    ];
    for (var i = 0; i < this.lines.length; i++) {
        this.lines[i].child[0].ishit = function (size, pos, gpos) { };
        this.lines[i].child[1].ishit = function (size, pos, gpos) { };
        this.lines[i].move = function (x, y) {
            for (var i = 0; i < this.child.length; i++)
                this.child[i].move(x, 0);
            if (this.parent != null)
                this.parent.onevent("c_move", this, { x: x, y: 0 });
        }
    }
    this.text = this.child[8];
    this.text.point.x = data.ImageWidth / 2-20;
    this.text.point.y = data.ImageHeight-data.ImageHeight / 5;
    for (var i = 0; i < this.child.length; i++) {
        this.child[i].index = i;
        this.child[i].visible = false;
    }
    this.lock = false;
    this.layout();
}
DrawCTRObject.prototype = {
    draw: function (gr) {
        for (var i = 0; i < this.child.length; i++)
            if (this.child[i].visible) {
                this.child[i].draw(gr);
            }
    },
    init: function (name, point) {
        switch (name) {
            case "begin":
                this.lines[0].visible = false;
                this.lines[1].visible = false;
                this.lines[2].visible = false;
                return [
                    this.child[3],
                    this.child[2],
                    this.child[1],
                    this.child[0]
                ];
            case "run":
            case "end":
                return function (self) { };
        }
    },
    ishit: function (size, pos, gpos) {
        return false;
    },
    layout: function () {
        if (this.text.visible) {
            var xs = [];
            for (var i = 0; i < 4; i++) {
                xs.push(this.lines[i].child[0].point.x);
            }
            xs.sort(function (a, b) { return a - b; });
            this.text.text = Math.floor((xs[2] - xs[1])*10000 / (xs[3] - xs[0]))/100+"%";
        }
    },
    layout2: function () {
    },
    onevent: function (name, obj, pos) {
        switch (name) {
            case "c_initbegin":
                break;
            case "c_initrun":
                break;
            case "c_initend":
                switch (obj.index) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        this.lines[obj.index].child[0].point.x = obj.point.x;
                        this.lines[obj.index].child[1].point.x = obj.point.x;
                        this.lines[obj.index].child[0].point.y = 0;
                        this.lines[obj.index].child[1].point.y = this.data.ImageHeight;
                        this.lines[obj.index].visible = true;
                        if (obj.index == 3) {
                            this.text.visible = true;
                        }
                        break;
                }
                break;
            case "c_move":
            case "p_move":
                break;
            default:
                return;
        }
        if (this.text.visible)
            this.layout();
    }
}
inherit(DrawCTRObject, DrawObject);
//CTValue
//距離計測オブジェクト
function DrawCTValueObject(sopdata, parent, p0,  width, color, font, fontstyle,getvaluefc) {
    this.base = DrawObject;
    this.base(parent);
    this.data = sopdata;
    this.name = "DrawCTValueObject";
    this.child = [
        new DrawCircleObject(this, {x:p0.x,y:p0.y}, width, color),
        new DrawTextObject(this, { x: p0.x, y: p0.y }, "0", font, fontstyle)
    ];
    this.getvaluefc = getvaluefc;
    this.text = this.child[1];
    this.text.visible = false;
    this.width = width;
    this.color = color;
    this.layout();
}
DrawCTValueObject.prototype = {
    draw: function (gr) {
        this.child[0].draw(gr);
        if (this.text.visible)
            this.text.draw(gr);
    },
    init: function (name, point) {
        switch (name) {
            case "begin":
                return [
                    this.child[0]
                ];
            case "run":
            case "end":
                return function (self) { };
        }
    },
    ishit: function (size, pos, gpos) {
        return false;
    },
    layout: function () {
        if (this.text.visible) {
            var self = this;
//            this.text.point = { x: this.child[0].point.x, y: this.child[0].point.y };
            this.getvaluefc(this.data.InitParam.ImageKey,
               "x:" + this.child[0].point.x + ",y:" + this.child[0].point.y + ",w:" + this.child[0].width,
               function (text) {
                   self.text.text = text;
                   self.data.updateDraw();
               }
               );
        }
    },
    onevent: function (name, obj) {
        switch (name) {
            case "p_move":
            case "c_move":
                break;
            case "c_initend":
            case "moveend":
                this.text.text = "";
                if (obj == this.child[0]) {
                    this.text.visible = true;
                    this.layout();
                }
                break;
        }
    }
}
inherit(DrawCTValueObject, DrawObject);



/*
function PanelEvent_FreeLine(type,e)
{
if(type=="down")
{
this.drag=true;
this.work={
plst:new Array()
};
}
var wk=this.work;
if(	this.drag &&
(type=="down" || 
type=="move" ||
type=="up"))
{
this.drawprelist.clear();
var pos  = this.cursorPosition(e);
wk.plst.push(this.GlobalToLocal(pos));
}
if(type=="move" || type=="up"){
if(this.drag)
{
if(wk.plst.length>3)
this.drawlist.pop();
if(wk.plst.length==2)
this.undostack.push("this.drawlist.pop()");
if(wk.plst.length>=2)
{
var p0=wk.plst[wk.plst.length-1];p0=this.LocalToGlobal({x:p0.x,y:p0.y});
var p1=wk.plst[wk.plst.length-2];p1=this.LocalToGlobal({x:p1.x,y:p1.y});
this.makeLine("red",3,p0,p1)(this,1);
this.drawlist.push(this.makeFreeLine("red",3,wk.plst));
}
}
}
if(type=="up")
{
this.drag=false;
this.work=null;
}
}
*/
function crossPoint(A, B, C, D, lenflag) {
    var M = new Matrix();
    M.m = [
		[B.x - A.x, C.x - D.x, 0],
		[B.y - A.y, C.y - D.y, 0],
		[0, 0, 1]
    ];
    if (M.Invert()) {
        var result = [
			M.m[0][0] * (C.x - A.x) + M.m[0][1] * (C.y - A.y),
			M.m[1][0] * (C.x - A.x) + M.m[1][1] * (C.y - A.y)
		];
        if (lenflag) {
            if (result[0] < 0.0 || result[0] > 1.0)
                return null;
            if (result[1] < 0.0 || result[1] > 1.0)
                return null;
        }
        var ret = { x: A.x + result[0] * (B.x - A.x), y: A.y + result[0] * (B.y - A.y) }
        return ret;
    } else {
        return null;
    }
}

function LinePointLR(p0, p1, p) {
    var v1 = new Point(p1.x - p0.x, p1.y - p0.y);
    var v2 = new Point(p.x - p0.x, p.y - p0.y);
    var ret;
    if (v1.x * v2.y - v1.y * v2.x > 0)
        ret = 1;
    else if (v1.x * v2.y - v1.y * v2.x < 0)
        ret = -1;
    else
        ret = 0;
    return ret;
}
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype = {
    Add: function (point) {
        this.x += point.x;
        this.y += point.y;
    }
}
function Vector(x, y) {
    this.x = x;
    this.y = y;
}
Vector.prototype = {
    Normal: function () {
        var len = this.Length();
        this.x /= len;
        this.y /= len;
    },
    Length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    FromPoint: function (p0, p1) {
        var v = new Vector(p0.x - p1.x, p0.y - p1.y);
        v.Normal();
        return v;
    }
}
//2D MATRIX
function Matrix() {
    this.m = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
}
function MatrixFromVector(xv, pos) {
    var mat = new Matrix();
    var len = Math.sqrt(xv.x * xv.x + xv.y * xv.y);
    if (len == 0)
        return null;
    xv.x /= len;
    xv.y /= len;
    var yv = {
        x: -xv.y,
        y: xv.x
    };
    mat.m = [
		[xv.x, xv.y, 0],
		[yv.x, yv.y, 0],
		[pos.x, pos.y, 1],
	];
    return mat;
}
Matrix.prototype = {
    Multiply: function (m2) {
        var result = new Matrix();
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 3; y++) {
                var sum = 0;

                for (var z = 0; z < 3; z++) {
                    sum += this.m[x][z] * m2.m[z][y];
                }

                result.m[x][y] = sum;
            }
        }
        return result;
    },
    Translate: function (px, py) {
        var mat = new Matrix();
        mat.m = [
		  [1, 0, 0],
		  [0, 1, 0],
		  [px, py, 1]
		];
        this.m = mat.Multiply(this).m;
    },
    Rotate: function (aRot) {
        var c = Math.cos(aRot);
        var s = Math.sin(aRot);
        var mat = new Matrix();
        mat.m = [
		  [c, s, 0],
		  [-s, c, 0],
		  [0, 0, 1]
		];
        this.m = mat.Multiply(this).m;
    },
    Scale: function (px, py) {
        var mat = new Matrix();
        mat.m = [
			[px, 0, 0],
			[0, py, 0],
			[0, 0, 1]
		]
        this.m = mat.Multiply(this).m;
    },
    Transform: function (px, py) {
        return {
            x: (px * this.m[0][0] + py * this.m[1][0] + this.m[2][0]),
            y: (px * this.m[0][1] + py * this.m[1][1] + this.m[2][1])
        }
    },
    Invert: function () {
        var m = this.m;
        var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
        if (det == 0)
            return false;
        this.m = [
			[m[1][1] / det, -m[0][1] / det, 0],
			[-m[1][0] / det, m[0][0] / det, 0],
			[0, 0, 1],
		];
        this.m[2][0] = -(m[2][0] * this.m[0][0] + m[2][1] * this.m[1][0]);
        this.m[2][1] = -(m[2][0] * this.m[0][1] + m[2][1] * this.m[1][1]);
        return true;
    }
}
//3D MATRIX
function Matrix3D() {
    this.mV = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
    ];
}
Matrix3D.prototype =
{
    multiply: function (mat) {
        var result = new Matrix3D();
        for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 4; y++) {
                var sum = 0;
                for (var z = 0; z < 4; z++) {
                    sum += this.mV[x][z] * mat.mV[z][y];
                }
                result.mV[x][y] = sum;
            }
        }
        return result;
    },
    transform: function (px, py, pz) {
        var x = px - this.mV[3][0];
        var y = py - this.mV[3][1];
        var z = pz - this.mV[3][2];
        return new Point((x * this.mV[0][0] + y * this.mV[1][0] + z * this.mV[2][0]), (x * this.mV[0][1] + y * this.mV[1][1] + z * this.mV[2][1]));
    }
};