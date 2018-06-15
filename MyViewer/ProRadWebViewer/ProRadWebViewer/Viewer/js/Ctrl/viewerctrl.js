function ViewerControl_Draw(sop, type, e, gpoint) {
    if (sop == null || sop.sopPanel==null)
        return;
    ViewerUtil.setTrace("draw1");
    if (this.PanelDrawMode == null)
        return;
    var selectTime = 600;
    //PanelベースからDataベースに仕様変更のため入れかえ
    var data = sop;
    sop = sop.sopPanel;
    if(type=="close")
    {
    	if(this.work!=null){
    	    if(this.work.mode=="draw")
    	    {
    	        data.DrawItems.pop();
            }
            this.work=null;
    	}
        return;
    }
    switch (this.prevtype) {
        case "move":
            if (type == "down")
                return;
    }
    this.prevtype = type;
    if(!gpoint)
        var gpoint = sop.cursorPosition(e);
    var point = sop.globalToLocal(gpoint);
	if (this.work == null) {
	    this.work={
	        item: null,
	        items: null,
            itemsindex: 0,
	        spoint: { x: 0, y: 0 },
	        point: { x: 0, y: 0 },
	        gpoint: { x: 0, y: 0 },
	        mode:"default",
	        step: "",
            points:new Array()
	    };
	}
	if (type == "down") {
	    this.work.spoint = gpoint;
	    this.work.points.length = 0;
	}
	this.work.points.push(point);
	if (type == "move" && this.work.mode == "drawormove") {
	    var x = this.work.spoint.x - gpoint.x;
	    var y = this.work.spoint.y - gpoint.y;
	    if (Math.sqrt(x * x + y * y) < 8)
	        return;
	}
	var my = this;
	var wk=this.work;
	while(true)
	{
	    switch (wk.mode)
	    {
	        case "move":
	            switch (type) {
	                case "down":
	                    wk.step = "begin";
	                    wk.point = point;
	                    wk.gpoint = gpoint;
	                    wk.orgpoint = point;
	                    break;
	                case "move":
	                    if (wk.step == "begin")
	                        wk.step = "run";
	                    if (wk.step == "run") {
	                        wk.item.move(point.x - wk.point.x, point.y - wk.point.y,
                                gpoint.x - wk.gpoint.x, gpoint.y - wk.gpoint.y);
	                        wk.point = point;
	                        wk.gpoint = gpoint;
	                        data.updateDraw();
	                    }
	                    break;
	                case "up":
	                    if (wk.item.onevent)
	                        wk.item.onevent("moveend", null);
	                    wk.item.isselect = false;
	                    var obj = new UndoObject("moveDrawItem", function () { this.item.move(this.point.x, this.point.y); });
	                    obj.item = wk.item;
	                    obj.point = { x: wk.orgpoint.x - wk.point.x, y: wk.orgpoint.y - wk.point.y };
	                    data.UndoStack.push(obj);
	                    wk.mode = "default";
	                    data.updateDraw();
	                    data.endDrawItem();
	                    break;
	            }
	            return;
	            break;
	        case "draw":
	            var params = [];
	            switch (type) {
	                case "downup":
	                    params.push({ type: "down", point: wk.points[0] });
	                    params.push({ type: "up", point: wk.points[0] });
	                    wk.point.length = 0;
	                    break;
	                case "down":
	                    if (type == "down") {
	                        params.push({ type: "down", point: wk.points.shift() });
	                        type = "move";
	                    }
	                    break;
	                default:
	                    break;
	            }
                //遅延処理をまとめて行う
	            while(wk.points.length>0){
	                params.push({ type: type, point: wk.points.shift() });
	            }

	            for (var n = 0; n < params.length; n++) {
	                type = params[n].type;
	                point = params[n].point;
	                switch (type) {
	                    case "down":
	                        wk.step = "begin";
	                        run = "begin";
	                        do {
	                            wk.item = wk.drawstack.pop();
	                            if (!wk.item)
	                                break;
	                            var items = wk.item.init("begin", point);
	                            wk.drawstack = wk.drawstack.concat(items);
	                        } while (items.length != 0);
	                        break;
	                    case "move":
	                        if (wk.step == "begin")
	                            wk.step = "run";
	                        if (wk.step == "run") {
	                            wk.item.init("run", point)(this);
	                            data.updateDraw();
	                            //	                        sop.DrawTempItem();
	                        }
	                        break;
	                    case "up":
	                        if (wk.step == "begin" || wk.step == "run") {
	                            wk.step = "";
	                            if (!wk.item.isinit()) {
	                                wk.drawstack.push(wk.item);
	                                data.updateDraw();
	                                return;
	                            }
	                            wk.item.init("end", point)(this);
	                            data.updateDraw();
	                            if (wk.drawstack.length == 0) {
	                                if (!wk.item.isinit())
	                                    data.DrawItems.pop();
	                                data.endDrawItem();
	                                wk.mode = "default";
	                                ViewerUtil.Events.onDrawEnd(data.DrawItems[data.DrawItems.length - 1]);
	                            }
	                            //	                        data.updateDraw();
	                        }
	                        break;
	                }
	            }
	            return;
	            break;
	        case "drawormove":
	            ViewerUtil.Events.removeTimeOut(function (data) { return data == wk.timeout; });
	            if (type == "move" || type == "up" || type == "!move") {
	                //描画モード
	                if ((new Date() - this.work.time) < selectTime) {
	                    this.work.mode = "draw";
	                    if (type == "up") {
	                        type = "downup";
	                    } else {
	                        type = "down";
	                        point = this.work.points[0];
	                    }
	                    this.work.step = "";
	                    this.tmp = this.PanelDrawMode;
	                    var item = this.tmp(sop, point);
	                    this.work.drawstack = [item];
	                    data.beginDrawItem(item);

	                    data.updateDraw();
	                } else {
	                    //移動モード
	                    var hititem = null;
	                    if (this.work.items == null) {
	                        var scale = sop.getScale();
	                        var size = this.DrawObjectHitWidth / scale;
	                        var hititems = new Array();
	                        for (var k = 2; k < size; k *= 2) {
	                            for (var i = data.DrawItems.length - 1; i >= 0; i--) {
	                                if (data.DrawItems[i] == null) {
	                                    data.DrawItems.splice(i, 1);
	                                    continue;
	                                }
	                                var items = data.DrawItems[i].getitems();
	                                for (var n = 0; n < items.length; n++)
	                                    if (items[n].ishit(size, point, gpoint, scale)) {
	                                        hititem = items[n];
	                                        break;
	                                    }
	                                if (hititem != null) {
	                                    hititems.push(hititem);
	                                    break;
	                                }
	                            }
	                            if (hititem) {
	                                break;
	                            }
	                        }
	                        this.work.items = hititems;
	                        this.work.itemsindex = 0;
	                        hititem = hititems[0];
	                    }
	                    hititem = this.work.items[this.work.itemsindex];
	                    if (hititem) {
	                        hititem.isselect = true;
	                        var rootitem = hititem.getroot();
	                        data.updateDraw();
	                        data.beginDrawItem(rootitem);
	                        if (type == "move" || type == "!move") {
	                            type = "down";
	                            this.work.mode = "move";
	                            this.work.step = "";
	                            this.work.item = hititem;
	                            continue;
	                        }
	                        //保留                            
	                        //	                        var timeout = function () {
	                        //	                            if (wk.items.length > 0) {
	                        //	                                wk.itemsindex++;
	                        //	                                if (wk.items.length == wk.itemsindex) {
	                        //	                                    wk.itemsindex = 0;
	                        //	                                }
	                        //	                            }
	                        //	                            ViewerControl_Draw.call(my, sop, "!move", e);
	                        //	                        }
	                        //	                        this.work.timeout = ViewerUtil.Events.addTimeOut(timeout, selectTime);
	                        //	                        this.work.timeout.name = "nextselect";
	                        return;
	                    }
	                    else {
	                        this.work.mode = "";
	                        return;
	                    }
	                }
	            } else {
	                this.work.mode = "";
	                return;
	            }
	            break;
	        default:
	            if (type == "click")
	                return;
//	            if (hititem != null) {
//	                document.body.style.cursor = hititem.cursor;
//	            } else {
//	                document.body.style.cursor = "default";
//	            }

	            switch (type) {
	                case "down":
//	                    if (hititem != null) {
//	                        var rootitem = hititem.getroot();
//	                        this.work.mode = "move";
//	                        this.work.step = "";
//	                        this.work.item = hititem;
//	                        data.updateDraw();
//	                        data.beginDrawItem(rootitem);
//	                        continue;
//	                    } else {
//	                        if (this.PanelDrawMode == null)
//	                            return;
//	                        this.work.mode = "draw";
//	                        this.work.step = "";
//	                        this.tmp = this.PanelDrawMode;
//	                        var item = this.tmp(sop, point);
//	                        this.work.drawstack = [item];
//	                        data.beginDrawItem(item);
//	                    }
//	                    if (this.PanelDrawMode == null)
//	                        return;
	                    this.work.mode = "drawormove";
	                    this.work.time = new Date();
	                    var timeout = function () {
	                        my.work.items=null;
	                        ViewerControl_Draw.call(my, data, "!move", e,gpoint);
	                    }
                        this.work.timeout = ViewerUtil.Events.addTimeOut(timeout, selectTime);
                        this.work.timeout.name = "drawmodeselect";
	                    return;
	                default:
	                    return;
	            }
	            break;
        }
    }
}

function ViewerDraw_Text(sop,point)
{
    return new DrawTextObject(null,point,"<font size=4 color='green'>TEXT</font>");
}
function ViewerDraw_Line(sop,point)
{
    return new DrawLineObject(null,
			point,
			point,
			3,"red");
}
function ViewerDraw_Circle(sop, point)
{
    var obj=new DrawCircleObject(null,
			point,
			0, "red");
    obj.lineWidth = 3;
    return obj;
}
function ViewerDraw_Arrow(sop,point)
{
    return new DrawArrowObject(null,
			point,
			point,
			3, "red");
}
function ViewerDraw_Measure(sop,point)
{
    return new DrawMeasureObject(sop.getData(),null,
			point,
			point,
			3, "red",
            "bold 20px 'ＭＳ Ｐゴシック'", "green");
}
function ViewerDraw_Angle4(sop,point) {
    return new DrawAngle4Object(sop.getData(),null, point, point, point, point, 3, "red", 3, "blue",
        "bold 20px 'ＭＳ Ｐゴシック'", "green"
    );
}
function ViewerDraw_Angle3(sop, point) {
    return new DrawAngle3Object(sop.getData(), null, point, point, point, 3, "red", 3, "blue",
        "bold 20px 'ＭＳ Ｐゴシック'", "green"
    );
}
function ViewerDraw_CTR(sop, point) {
    for (var i = 0; i < sop.getData().DrawItems.length;i++ ) {
        if (sop.getData().DrawItems[i].name == "DrawCTRObject") {
            sop.getData().removeDrawItem(sop.getData().DrawItems[i]);
            sop.getData().updateDraw();
            break;
        }
    }
    return new DrawCTRObject(sop.getData(), null, 3, "blue",
        "bold 40px 'ＭＳ Ｐゴシック'", "green"
    );
}

function ViewerDraw_CTValue(sop, point) {
    for (var i = 0; i < sop.getData().DrawItems.length; i++) {
        if (sop.getData().DrawItems[i].name == "DrawCTValueObject") {
            sop.getData().DrawItems.splice(i, 1);
            sop.getData().updateDraw();
            break;
        }
    }
    var getValue = function (imagekey, param, func) {
        func("計測中");
        // CT値取得
        Viewer_GetCTValue(sop.getData().InitParam.ImageKey, param, null, function (value) {
            func(value);
        });
    }
    
    return new DrawCTValueObject(sop.getData(), null,
			point,
			0,
            "red",
            "bold 20px 'ＭＳ Ｐゴシック'", "green",
            getValue
            );
}
function ViewerDraw_FreeLine(sop, point) {
    var child=null;
    if (sop.getData().FreeLineItem) {
        if ((new Date() - sop.getData().FreeLineItem.time) < 1000){
            child = sop.getData().FreeLineItem;
            sop.getData().removeDrawItem(child);
        }
    }
    var obj = new DrawFreeLineObject(null, 3, "red");
    if (child) {
        obj.child.push(child);
        child.parent = obj;
    }
    sop.getData().FreeLineItem = obj;
    return obj;
}


//function PanelEvent_Rotate(type,e)
//{
//    if(this.data==null)
//        return;
//    if(type=="close")
//        return;
//	var pos;
//    var cgpos=this.getcenter();
//	var vec=new Vector(this.cursorPosition(e).x-cgpos.x,this.cursorPosition(e).y-cgpos.y);
//	vec.Normal();
//	switch(type)
//	{
//	case "down":
////    	var cpos=this.GlobalToLocal(cgpos);
////    	var lpos=this.GlobalToLocal(this.cursorPosition(e));
//		this.work={
//			point: this.cursorPosition(e),
//			center: this.getcenter(),
//			rotbase:Math.atan2(vec.x,-vec.y)
////			,draw:new DrawAngleObject(null,this.data.x_length,this.data.y_length,cpos,lpos,cpos,lpos,3,"red",3,"blue")
//		};
//		break;
//	case "move":
//		if(this.work)
//		{
//		    var rot=Math.atan2(vec.x,-vec.y);
//            this.viewer.setRotation(rot-this.work.rotbase);
//            this.work.rotbase=rot;
//            layoutSync();
////            var lpos=this.GlobalToLocal(this.cursorPosition(e));
////		    this.work.draw.child[0].child[1].point=this.GlobalToLocal(this.work.point);
////		    this.work.draw.child[1].child[1].point=lpos;
//		}
//		break;
//	case "up":
//	    if(this.work)
//	    {
//	        this.work=null;
//	    }
//	    break;
//	}
//}

function ViewerControl_Move(sop,type, e)
{
    if (sop == null || sop.sopPanel == null)
        return;
    sop = sop.sopPanel;
    if (type == "close")
        return;
	switch(type)
	{
	case "down":
		this.work={
		    p0: ViewerUtil.getElementPoint(sop.Element,e)
		};
		break;
    case "move":
        if (this.work) {
            var wk = this.work;
            var p = ViewerUtil.getElementPoint(sop.Element, e);
            var series=sop.Series.seriesData;
            if (series.getSync()) {
                for (var i = 0; i < this.viewerData.SeriesDatas.length; i++) {
                    var series = this.viewerData.SeriesDatas[i];
                    if (series && series.getSync()) {
                        series.setMove(
                            series.ImageLeft + p.x - wk.p0.x,
                            series.ImageTop + p.y - wk.p0.y
                        );
                    }
                }
            } else {
                series.setMove(
                    series.ImageLeft + p.x - wk.p0.x,
                    series.ImageTop + p.y - wk.p0.y
                );
            }
            wk.p0 = p;
        }
    break;
	case "up":
	    if(this.work)
	    {
	        this.work=null;
	    }
		break;
	}
}
function ViewerControl_Scale(sop,type, e){
    if (sop == null || sop.sopPanel == null)
        return;
    sop = sop.sopPanel;
    if (type == "close")
        return;
	var pos;
	var lpos;
	switch(type)
	{
	    case "down":
	        this.work = {
	            point: ViewerUtil.getElementPoint(sop.Element, e),
	            scales: new Array(),
	            scale: sop.Series.getData().ImageScale
	        };
	        for (var i = 0; i < this.viewerData.SeriesDatas.length; i++) {
	            var series = this.viewerData.SeriesDatas[i];
                if(series)
                    this.work.scales[i] = series.ImageScale;
	        }
	        break;
	    case "move":
	        var gpos = ViewerUtil.getElementPoint(sop.Element, e);
	        if (this.work) {
	            var series = sop.Series.seriesData;
	            var scale = (1 + (this.work.point.y - gpos.y) / 400);
	            if (scale < 0.01)
	                scale = 0.01;
	            if (scale > 100)
	                scale = 100;
	            if (series.getSync()) {
	                //ずれが発生するので補正しない
	                for (var i = 0; i < this.viewerData.SeriesDatas.length; i++) {
	                    var series = this.viewerData.SeriesDatas[i];
	                    if (series && series.getSync()) {
	                        series.setScale(scale * this.work.scales[i]);
	                    }
	                }
	            } else {
	                var scale = scale * this.work.scale;
	                if (scale > 4)
	                    scale = 4;
	                if (scale < 0.25)
	                    scale = 0.25;
	                series.setScale(scale);
	            }
	        }
	        break;
	case "up":
	    if(this.work!=null)
	    {
	        this.work=null;
	    }
	    break;
	}
}
function ViewerControl_ManualCine(sop, type, e) {
    if (sop == null)
        return;
    var data = sop;
    sop = sop.sopPanel;
    var series = data.seriesData;
    if (!series)
        return;
    if (type == "close")
        return;
    if (series.seriesPanel == null)
        return;
    var serieselement = series.seriesPanel.Element;
    var pos;
    var lpos;
    switch (type) {
        case "down":
            var dat = series;
            if (dat.SopDatas == null || dat.SopDatas.length <= 1)
                return;
            var height = $(this.Element).height();
            var soplen =  height/ dat.SopDatas.length;
            if (soplen < 5)
                soplen = 5;
            var index = 0;
            if (dat)
                index = dat.getSopIndex();
            this.work2 = {
                point: ViewerUtil.getElementPoint(serieselement, e),
                index: index,
                auto: false,
                soplen: soplen,
                height: height
            };
            break;
        case "move":
            var gpos = ViewerUtil.getElementPoint(serieselement, e);
            if (this.work2 && this.work2.auto==false) {
                var lentotal = gpos.y - this.work2.point.y;
                if (Math.abs(lentotal) > (this.work2.height / 2)) {
                    this.work2.auto=true;
                    if (lentotal > 0) {
                        series.seriesPanel.autosetSopIndex(1);
                    } else {
                        series.seriesPanel.autosetSopIndex(-1);
                    }
                } else {
                    series.setSopIndex(this.work2.index + Math.floor(lentotal / this.work2.soplen), "begin");
                }
            }
            break;
        case "up":
            series.seriesPanel.autosetSopIndex(0);
            this.work2 = null;
            break;
    }
}
function ViewerControl_WindowLevel(sop, type, e) {
    if (sop == null || sop.sopPanel == null)
        return;
    sop = sop.sopPanel;
    if (type == "close")
        return;
    switch (type) {
        case "down":
            this.work = {
                e: e,
                p0: ViewerUtil.getElementPoint(sop.Element, e),
                wc: sop.Series.seriesData.WindowCenter,
                ww: sop.Series.seriesData.WindowWidth,
                cnt: 0,
                update: false
            };
            //遅延確定のデータがあった場合WindowLevelの値を遅延のものに補正
            if (delayWindowLevelCommit) {
                var flag = false;
                for (var i = 0; i < delayWindowLevelCommit.Seriess.length; i++) {
                    if (delayWindowLevelCommit.Seriess[i] == sop.Series.seriesData) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    this.work.wc += delayWindowLevelCommit.WC;
                    this.work.ww += delayWindowLevelCommit.WW;
                }
                //if (delayWindowLevelCommit.Seriess.indexOf(sop.Series.seriesData) != -1) {
                //    this.work.wc += delayWindowLevelCommit.WC;
                //    this.work.ww += delayWindowLevelCommit.WW;
                //}
            }
            sop.setPreviewMode(true);
            break;
        case "move":
            if (this.work) {
                if (this.work.update == false) {
                    this.work.update = true;
                    var series = sop.Series.seriesData;
                    series.cancelCache(0);
                    var seriess = new Array();
                    if (series.getSync()) {
                        for (var i = 0; i < this.viewerData.SeriesDatas.length; i++) {
                            var series = this.viewerData.SeriesDatas[i];
                            if (series && series.getSync()) {
                                seriess.push(series);
                            }
                        }
                    } else {
                        seriess.push(series);
                    }
                    if (delayWindowLevelCommit) {
                        if (!delayWindowLevelCommit.trycommit(sop.getData(), seriess)) {
                            ViewerUtil.Events.removeTimeOutName("WindowLevelCommit");
                        }
                        delayWindowLevelCommit = null;
                    }
                }

                this.work.cnt++;
                var p = ViewerUtil.getElementPoint(sop.Element, e);
                var wk = this.work;
                var length = Math.sqrt((p.y - wk.p0.y) * (p.y - wk.p0.y) + (p.x - wk.p0.x) * (p.x - wk.p0.x));
                var time_hokan = 1;
                var limit = 5;
                if (length > limit) {
                    time_hokan = limit / length;
                }
                var wc = (p.y - wk.p0.y) * sop.getData().DefaultWindowWidth * 0.003 * time_hokan;
                var ww = (p.x - wk.p0.x) * sop.getData().DefaultWindowWidth * 0.003 * time_hokan;
                wk.p0 = p;
                sop.getData().setWindowLevel(sop.getData().SopWindowCenter + wc, sop.getData().SopWindowWidth + ww);
            }
            break;
        case "up":
            var update = false;
            if (this.work) {
                if (this.work.update) {
                    update = true;
                    var c = sop.getData().SopWindowCenter;
                    var w = sop.getData().SopWindowWidth;
                    var series = sop.getData().seriesData;
                    var seriess = new Array();
                    if (series.getSync()) {
                        for (var i = 0; i < this.viewerData.SeriesDatas.length; i++) {
                            var series = this.viewerData.SeriesDatas[i];
                            if (series && series.getSync()) {
                                seriess.push(series);
                            }
                        }
                    } else {
                        seriess.push(series);
                    }
                    var commitdata = new windowLevelCommit(sop.getData(), seriess, c, w);
                    delayWindowLevelCommit = commitdata;
                    var data = ViewerUtil.Events.addTimeOut(
                        function () {
                            if (delayWindowLevelCommit != null) {
                                delayWindowLevelCommit.commit();
                                delayWindowLevelCommit = null;
                            }
                        }
                    ,
                    ViewerUtil.WindowLevelCommitTime
                    );
                    data.name = "WindowLevelCommit";
                }
                this.work = null;
            }
            if (update == false)
                sop.setPreviewMode(false);
            break;
    }
}
var delayWindowLevelCommit=null;
var windowLevelCommit = function (sop, seriess, wc, ww) {
    this.Sop = sop;
    this.WW = ww;
    this.WC = wc;
    this.Seriess = seriess;
    //Sopと同期しているSeriesが一致したら更新しない
    this.trycommit = function (_sop, _seriess) {
        var iscommit = false;
        if (_sop != sop) {
            iscommit = true;
        }
        else if (seriess.length != _seriess.length) {
            iscommit = true;
        } else {
            for (var i = 0; i < seriess.length; i++) {
                var flag = false;
                for (var j = 0; j < seriess.length; j++) {
                    if (seriess[j] == _seriess[i]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    iscommit = true;
                    break;
                }
                //if (seriess.indexOf(_seriess[i]) == -1) {
                //    iscommit = true;
                //    break;
                //}
            }
        }
        if (iscommit) {
            this.commit();
        }
        return iscommit;
    }
    this.commit = function () {
        sop.setPreviewMode(false);
        sop.SopWindowCenter = 0;
        sop.SopWindowWidth = 0;
        for (var i = 0; i < seriess.length; i++) {
            var series = seriess[i];
            series._setWindowLevel(series.WindowCenter + wc, series.WindowWidth + ww);
            series.cancelCache(ViewerUtil.PreLoadCount);
        }
    }
}
//*同期制御*
//インデックス
var ViewerSync_Index = {}
ViewerSync_Index.initSeries = function (series) {
    series.SyncWork.nowIndex = series.SopIndex;
    series.SyncWork.skipIndex = 0;
}
//更新時最初にdstとsrc同じものがくるのでそこで必要な計算を行う
ViewerSync_Index.updateSeries = function (dst_series, src_series, prev, now) {
    if (dst_series == src_series) {
        dst_series.SyncWork.skipIndex = now - dst_series.SyncWork.nowIndex;
    }
    dst_series.SyncWork.nowIndex += src_series.SyncWork.skipIndex;
    if (dst_series != src_series) {
        dst_series.setSopIndex(dst_series.SyncWork.nowIndex, "begin");
    }
}

//位置
var ViewerSync_Location = {}
ViewerSync_Location.initSeries = function (series) {
}
ViewerSync_Location.updateSeries = function (dst_series, src_series, prev, now) {
    if (dst_series == src_series)
        return;
    var loc = src_series.SopDatas[now].SliceLocation;
    if (loc != null) {
        var idx = 0;
        var len = Math.abs(dst_series.SopDatas[idx].SliceLocation - loc);
        if (len != 0) {
            for (var i = 0; i < dst_series.SopDatas.length; i++) {
                var tmp = Math.abs(dst_series.SopDatas[i].SliceLocation - loc);
                if (len > tmp) {
                    idx = i;
                    len = tmp;
                }
            }
        }
        dst_series.setSopIndex(idx, "begin");
    }
}
//厚
var ViewerSync_Thickness = {
}
ViewerSync_Thickness.initSeries = function (series) {
    series.SyncWork.StartLocation = series.SopDatas[series.SopIndex].SliceThicknessLocation;
}
ViewerSync_Thickness.updateSeries = function (dst_series, src_series, prev, now) {
    if (dst_series == src_series)
        return;
    var getNowLocation = function (series,index) {
        return series.SopDatas[index].SliceThicknessLocation - series.SyncWork.StartLocation;
    }
    var loc = getNowLocation(src_series, now);
    if (loc != null) {
        var idx = 0;
        var len = Math.abs(getNowLocation(dst_series, idx) - loc);
        if (len != 0) {
            for (var i = 0; i < dst_series.SopDatas.length; i++) {
                var tmp = Math.abs(getNowLocation(dst_series, i) - loc);
                if (len > tmp) {
                    idx = i;
                    len = tmp;
                }
            }
        }
        dst_series.setSopIndex(idx, "begin");
    }
}
var WindowLevelCommit = function () {
    if (delayWindowLevelCommit) {
        delayWindowLevelCommit.commit();
        delayWindowLevelCommit = null;
    }
    ViewerUtil.Events.removeTimeOutName("WindowLevelCommit");
}
var ViewerToolsCommit = function () {
    WindowLevelCommit();
}