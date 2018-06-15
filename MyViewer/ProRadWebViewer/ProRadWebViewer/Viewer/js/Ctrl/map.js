function CellMap(ctrl,src,param, width, height) {
    this.ctrl = ctrl;
    this.src = src;
    this.width = width;
    this.height = height;
    this.cellSize = 256;
    this.levelCount = Math.floor(Math.ceil(Math.log(Math.max(width, height)) * Math.LOG2E)) - Math.floor(Math.log(this.cellSize) * Math.LOG2E) + 1;
    if (this.levelCount <= 0)
        this.levelCount = 1;
    //最低解像度を512へ
    //@暫定1024
    this.levelCount = this.levelCount - 2;
    if (this.levelCount < 1) {
        this.levelCount = 1;
    }
    var maxlevel = this.levelCount - 1;
    this.isInit = false;
    this.levels = [];
    this.cw = Math.ceil(width / 256);
    this.ch = Math.ceil(height / 256);
    this.previewMode = false;
    this.map = [];
    this.currentLevel = this.levelCount - 1;
    this.param = param;
    for (var x = 0; x < this.cw; x++) {
        this.map[x] = [];
        for (var y = 0; y < this.ch; y++) {
            this.map[x][y] = null;
        }
    }
    for (var i = 0; i < this.levelCount; i++) {
        this.levels.push(new CellMapLevel(this, i));
    }

    var prevrot = 0;
    this.updateParam = function (param,rot) {
        this.param = param;
        for (var x = 0; x < this.cw; x++) {
            for (var y = 0; y < this.ch; y++) {
                if (this.map[x][y]) {
//                    this.map[x][y].clear();
                    this.map[x][y] = null;
                }
            }
        }
        //高解像度部分は無効に
        if (this.levelCount == 1) {
            this.levels[0].udpateParam();
        }
        else {
            for (var i = 0; i < this.levelCount; i++) {
                this.levels[i].udpateParam();
                if (!this.previewMode && i != this.currentLevel)
                    this.levels[i].clear();
            }
        }
        //回転の途中を見せないための処理
        if (prevrot != rot) {
            prevrot = rot;
            this.backGround = null;
        }
        this.maxlevelcmimage.isPreview = false;
        //最低画像部分は読み込みが完了したら無効に
        //this.maxlevelcmimage.invokeUpdateParam();
        //まだ読み込みが完了されていなかったら読み込みが開始される
        this.maxlevelcmimage.load();
    }
    this.backGround = null;
    //画像が読み込まれたときに呼ばれる
    this.onloadImage = function (cmimage) {
        for (var x = 0; x < cmimage.owner.cellArea; x++) {
            var array = this.map[x + cmimage.owner.cellArea * cmimage.cx];
            if (typeof array == 'undefined')
                break;
            for (var y = 0; y < cmimage.owner.cellArea; y++) {
                var img = array[y + cmimage.owner.cellArea * cmimage.cy];
                if (typeof img == 'undefined')
                    break;
                if (img == null || img.image==null || cmimage.level < img.level) {
                    this.map[x + cmimage.owner.cellArea * cmimage.cx][y + cmimage.owner.cellArea * cmimage.cy] = cmimage;
                }
            }
        }
        //最大低解像度
        if (this.maxlevelcmimage == cmimage) {
            this.backGround = cmimage.image;
            this.ctrl.onCache(true);
        }
        //画像更新通知
        this.ctrl.updateImage();
    }
    this.smart = function () {
        this.currentLevel = this.levels.length - 1;
        for (var lvl = 0; lvl < this.currentLevel; lvl++) {
            this.levels[lvl].clear();
        }
    }
    this.reset = function () {
        if (this.isInit == false) {
            this.currentLevel = this.levels.length - 1;
            this.levels = [];
            for (var i = 0; i < this.levelCount; i++) {
                this.levels.push(new CellMapLevel(this, i));
            }
            this.maxlevelcmimage = this.levels[maxlevel].imagemap[0][0];
            this.maxlevelcmimage.isPreview = true;
            this.maxlevelcmimage.cw = this.levels[maxlevel].w;
            this.maxlevelcmimage.ch = this.levels[maxlevel].h;
            for (var cy = 0; cy < this.levels[maxlevel].h; cy++)
                for (var cx = 0; cx < this.levels[maxlevel].w; cx++) {
                    if (cx == 0 && cy == 0)
                        continue;
                    this.levels[maxlevel].imagemap[cx][cy] = null;
                }
            this.isInit = true;
        }
        for (var i = 0; i < this.levelCount; i++) {
            this.levels[i].clear();
        }
        this.clearBackGround();
    }
    this.mapRebuild = function () {
        //現在のレベルより高解像度を開放
        for (var lvl = 0; lvl < this.currentLevel; lvl++) {
            this.levels[lvl].clear();
        }
//        mapの再構成
//        for (var x = 0; x < this.cw; x++) {
//            for (var y = 0; y < this.ch; y++) {
//                if (this.map[x][y]) {
//                    this.map[x][y].clear();
//                    this.map[x][y] = null;
//                }
//            }
//        }
        for (var lvl = this.currentLevel; lvl < this.levels.length; lvl++) {
            var map = this.levels[lvl];
            for (var x = 0; x < map.w; x++) {
                for (var y = 0; y < map.h; y++) {
                    var cell = map.imagemap[x][y];
                    if (cell == null)
                        continue;
                    var img = cell.image;
                    var f = false;
                    if (img && img.complete) {
                        for (var cx = 0; cx < map.cellArea; cx++) {
                            var mx = map.cellArea * x + cx;
                            if (this.map.length <= mx)
                                break;
                            for (var cy = 0; cy < map.cellArea; cy++) {
                                var my = map.cellArea * y + cy;
                                if (this.map[mx].length <= my)
                                    break;
                                if (this.map[mx][my] == null || this.map[mx][my].image==null) {
                                    this.map[mx][my] = cell;
                                    f = true;
                                }
                            }
                        }
                    }
                    //                    if (lvl != (this.levels.length - 1) && !f) {
                    //                        cell.clear();
                    //                    }
                }
            }
        }

    }
    this.drawrect = function (ctx, x, y, w, h, color) {
        //ctx.strokeStyle = color;
        //ctx.beginPath();
        //ctx.strokeRect(x, y, w, h);
        //ctx.closePath();
        //ctx.stroke();
        //ctx.fillStyle = color;
        //ctx.globalAlpha = 0.5;
        //ctx.fillRect(x, y, w, h);
        //ctx.globalAlpha = 1;
    }
    //キャッシュ有無 0:なし 1:Preview 2:Full
    this.getCacheLevel=function()
    {
        var ret=0;
        if (this.backGround)
            ret = 1;
        if (this.levels.length > this.currentLevel) {
            for (var lvl = 0; lvl <= this.currentLevel; lvl++) {
                if (this.levels[lvl].isComp()) {
                    ret = 2;
                    break;
                }
            }
        }
        return ret;
    }
    this.Request = function(level)
    {
        this.currentLevel = level;
        this.levels[level].request(0, 0, this.width, this.height);
    }
    this.drawImageCanvas = function (ctx, scale, rot, flip, left, top, x, y, w, h) {
        var level = Math.floor(Math.log(1 / scale) * Math.LOG2E);
        if (level < 0) {
            level = 0;
        }
        if (level >= this.levelCount) {
            level = this.levelCount - 1;
        }
        ViewerUtil.setTrace("0");
        //画像の要求
        if (!this.previewMode)
            this.levels[level].request(x, y, w, h);
        var isrebuild = this.currentLevel != level;
        this.currentLevel = level;
        var flag = [];
        for (var x = 0; x < this.cw; x++) {
            flag[x] = [];
            for (var y = 0; y < this.ch; y++) {
                flag[x][y] = false;
            }
        }
        switch (rot) {
            case 0:
                var x = left;
                if (flip)
                    x -= this.width * scale;
                var bx = x;
                var by = top;
                var bw = w * scale;
                var bh = h * scale;
                break;
            case 90:
                var y = top;
                if (flip)
                    y -= this.width * scale;
                var bx = left - h * scale;
                var by = y;
                var bw = h * scale;
                var bh = w * scale;
                break;
            case 180:
                var x = left;
                if (!flip)
                    x -= w * scale;
                var bx = x;
                var by = top - h * scale;
                var bw = w * scale;
                var bh = h * scale;
                break;
            case 270:
                var y = top;
                if (!flip)
                    y -= w * scale;
                var bx = left;
                var by = y;
                var bw = h * scale;
                var bh = w * scale;
                break;
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(bx, by, bw - 0.5, bh - 0.5);
        ctx.clip();
        //        var cellSize = Math.ceil(this.cellSize * scale);
        var cellSize = this.cellSize * scale;
        var mximg = this.maxlevelcmimage;
        if (this.backGround) {
            var img = this.maxlevelcmimage;
            var px = 0;
            var py = 0;
            var pw = 0;
            var ph = 0;
            //            var cs = cellSize * mximg.owner.cellArea;
            var cs = cellSize * mximg.owner.cellArea;
            switch (rot) {
                case 0:
                    px = img.cx * cs;
                    py = img.cy * cs;
                    if (flip) {
                        px = this.width * scale - px - cs * img.cw;
                    }
                    pw = cs * mximg.cw;
                    ph = cs * mximg.ch;
                    break;
                case 90:
                    px = h * scale - cs * mximg.ch;
                    py = 0; //cs *img.cx;
                    if (flip) {
                        py = this.width * scale - py - cs * img.cw;
                    }
                    pw = cs * mximg.ch;
                    ph = cs * mximg.cw;
                    break;
                case 180:
                    px = w * scale - cs * mximg.cw;
                    py = h * scale - cs * mximg.ch;
                    if (flip) {
                        px = this.width * scale - px - cs * img.cw;
                    }
                    pw = cs * mximg.cw;
                    ph = cs * mximg.ch;
                    break;
                case 270:
                    px = 0;
                    py = w * scale - cs * mximg.cw;
                    if (flip) {
                        py = this.width * scale - py - cs * img.cw;
                    }
                    pw = cs * mximg.ch;
                    ph = cs * mximg.cw;
                    break;
            }
            ctx.drawImage(this.backGround,
                            px + bx,
                            py + by,
                            pw,
                            ph);
            //            ctx.drawImage(this.backGround,
            //                            Math.floor(px+bx),
            //                            Math.floor(py+by),
            //                            Math.ceil(pw),
            //                            Math.ceil(ph));
            this.drawrect(ctx,
                            px + bx,
                            py + by,
                            pw,
                            ph,
             "red");
            if (this.backGround.naturalWidth >= this.width &&
                this.backGround.naturalHeight >= this.height) {
                ctx.restore();
                return;
            }
        } else {
            this.maxlevelcmimage.load();
            return;
        }
        if (this.previewMode)
            return;
        ViewerUtil.setTrace("1");
        if (isrebuild)
            this.mapRebuild();
        for (var y = 0; y < this.ch; y++) {
            for (var x = 0; x < this.cw; x++) {
                if (!flag[x][y]) {
                    var img = this.map[x][y];
                    if (img == null)
                        continue;
                    if (img != this.maxlevelcmimage) {
                        ViewerUtil.setTrace("6");
                        if (!img.image)
                            continue;
                        ViewerUtil.setTrace("7");
                        var cs = cellSize * img.owner.cellArea;
                        var px = 0;
                        var py = 0;
                        switch (rot) {
                            case 0:
                                px = (img.cx) * cs;
                                py = (img.cy) * cs;
                                if (flip) {
                                    px = this.width * scale - px - cs;
                                }
                                break;
                            case 90:
                                px = (img.owner.h - img.cy - img.ch) * cs - (img.owner.cellSize * img.owner.h - this.height) * scale;
                                py = (img.cx) * cs;
                                if (flip) {
                                    py = this.width * scale - py - cs;
                                }
                                break;
                            case 180:
                                px = (img.owner.w - img.cx - img.cw) * cs - (img.owner.cellSize * img.owner.w - this.width) * scale;
                                py = (img.owner.h - img.cy - img.ch) * cs - (img.owner.cellSize * img.owner.h - this.height) * scale;
                                if (flip) {
                                    px = this.width * scale - px - cs;
                                }
                                break;
                            case 270:
                                px = (img.cy) * cs;
                                py = (img.owner.w - img.cx - img.cw) * cs - (img.owner.cellSize * img.owner.w - this.width) * scale;
                                if (flip) {
                                    py = this.width * scale - py - cs;
                                }
                                break;
                        }
                        ViewerUtil.setTrace("8");

                        ctx.drawImage(img.image,
                        px + bx,
                        py + by,
                        cs * img.cw,
                        cs * img.ch);
                        //                        ctx.drawImage(img.image,
                        //                            Math.floor(px+bx),
                        //                            Math.floor(py + by),
                        //                            Math.ceil(cs * img.cw),
                        //                            Math.ceil(cs * img.ch));
                        this.drawrect(ctx,
                        px + bx,
                        py + by,
                        cs * img.cw,
                        cs * img.ch,
                            ["green", "blue", "cyan", "yellow", "magenta"][img.level]);
                    }
                    for (var cx = 0; cx < img.owner.cellArea * img.cw; cx++) {
                        var ft = flag[x + cx];
                        if (typeof ft == 'undefined')
                            break;
                        for (var cy = 0; cy < img.owner.cellArea * img.ch; cy++) {
                            if (typeof flag[x + cx][y + cy] == 'undefined')
                                break;
                            flag[x + cx][y + cy] = true;
                        }
                    }
                }
            }
        }
        ctx.restore();
    }
    this.drawImage = function (imagearea, scale, rot, flip, left, top, x, y, w, h) {
        ViewerUtil.pushTrace("map.drawImage");
        var level = Math.floor(Math.log(1 / scale) * Math.LOG2E);
        if (level < 0) {
            level = 0;
        }
        if (level >= this.levelCount) {
            level = this.levelCount - 1;
        }
        ViewerUtil.setTrace("0");
        //画像の要求
        if (!this.previewMode)
            this.levels[level].request(x, y, w, h);
        var isrebuild = this.currentLevel != level;
        this.currentLevel = level;
        var flag = [];
        for (var x = 0; x < this.cw; x++) {
            flag[x] = [];
            for (var y = 0; y < this.ch; y++) {
                flag[x][y] = false;
            }
        }
        ViewerUtil.setTrace("1");
//        var cellSize = Math.ceil(this.cellSize * scale);
        var cellSize = this.cellSize * scale;

        //はみ出た部分のクリッピング
        imagearea.style.overflow = "hidden";
        switch (rot) {
            case 0:
                var x = left;
                if (flip)
                    x -= this.width * scale;
                imagearea.style.left = Math.round(x) + "px";
                imagearea.style.top = Math.round(top) + "px";
                imagearea.style.width = Math.round(w * scale-0.5) + "px";
                imagearea.style.height = Math.round(h * scale - 0.5) + "px";
                break;
            case 90:
                var y = top;
                if (flip)
                    y -= this.width * scale;
                imagearea.style.left = Math.round(left - h * scale) + "px";
                imagearea.style.top = Math.round(y) + "px";
                imagearea.style.width = Math.round(h * scale - 0.5) + "px";
                imagearea.style.height = Math.round(w * scale - 0.5) + "px";
                break;
            case 180:
                var x = left;
                if (!flip)
                    x -= w * scale;
                imagearea.style.left = Math.round(x) + "px";
                imagearea.style.top = Math.round(top - h * scale) + "px";
                imagearea.style.width = Math.round(w * scale - 0.5) + "px";
                imagearea.style.height = Math.round(h * scale - 0.5) + "px";
                break;
            case 270:
                var y = top;
                if (!flip)
                    y -= w * scale;
                imagearea.style.left = Math.round(left) + "px";
                imagearea.style.top = Math.round(y) + "px";
                imagearea.style.width = Math.round(h * scale - 0.5) + "px";
                imagearea.style.height = Math.round(w * scale - 0.5) + "px";
                break;
        }

        ViewerUtil.setTrace("2");

        var mximg = this.maxlevelcmimage;
        //隙間対策で最大レベル描画
        if (this.backGround) {
            //            if (!this.previewMode && !this.backGround.Active.getIsActive())
            //                this.backGround = null;
            //            else
            var img = this.maxlevelcmimage;
            var px = 0;
            var py = 0;
            var pw = 0;
            var ph = 0;
            var cs = cellSize * mximg.owner.cellArea;
            switch (rot) {
                case 0:
                    px = img.cx * cs;
                    py = img.cy * cs;
                    if (flip) {
                        px = this.width * scale - px - cs * img.cw;
                    }
                    pw = cs * mximg.cw;
                    ph = cs * mximg.ch;
                    break;
                case 90:
                    px = h * scale - cs * mximg.ch;
                    py = 0; //cs *img.cx;
                    if (flip) {
                        py = this.width * scale - py - cs * img.cw;
                    }
                    pw = cs * mximg.ch;
                    ph = cs * mximg.cw;
                    break;
                case 180:
                    px = w * scale - cs * mximg.cw; //(img.owner.w - img.cx - img.cw) * cs - (img.owner.cellSize * img.owner.w - this.width) * scale;
                    py = h * scale - cs * mximg.ch; //(img.owner.h - img.cy - img.ch) * cs - (img.owner.cellSize * img.owner.h - this.height) * scale;
                    if (flip) {
                        px = this.width * scale - px - cs * img.cw;
                    }
                    pw = cs * mximg.cw;
                    ph = cs * mximg.ch;
                    break;
                case 270:
                    px = 0;
                    py = w * scale - cs * mximg.cw;
                    if (flip) {
                        py = this.width * scale - py - cs * img.cw;
                    }
                    pw = cs * mximg.ch;
                    ph = cs * mximg.cw;
                    break;
            }

            this.backGround.style.left = px + "px";
            this.backGround.style.top = py + "px";
            this.backGround.style.width = pw + "px";
            this.backGround.style.height = ph + "px";
        }
        ViewerUtil.setTrace("3");
        var element = imagearea.firstChild;
        var next = null;
        while (element) {
            next = element.nextSibling;
            if (element != this.backGround)
                imagearea.removeChild(element);
            element = next;
        }
        if (this.backGround == null) {
            return;
        } else {
            if (this.backGround.naturalWidth >= this.width &&
                this.backGround.naturalHeight >= this.height) {
                return;
            }
        }
        ViewerUtil.setTrace("4");
        if (isrebuild)
            this.mapRebuild();
        if (this.backGround) {
            imagearea.appendChild(this.backGround);
        }
        ViewerUtil.setTrace("5");
        for (var y = 0; y < this.ch; y++) {
            for (var x = 0; x < this.cw; x++) {
                if (!flag[x][y]) {
                    var img = this.map[x][y];
                    if (img == null)
                        continue;
                    if (img != this.maxlevelcmimage) {
                        ViewerUtil.setTrace("6");
                        if (!img.image)
                            continue;
                        imagearea.appendChild(img.image);
                        ViewerUtil.setTrace("7");
                        var cs = cellSize * img.owner.cellArea;
                        var px = 0;
                        var py = 0;
                        switch (rot) {
                            case 0:
                                px = (img.cx) * cs;
                                py = (img.cy) * cs;
                                if (flip) {
                                    px = this.width * scale - px - cs;
                                }
                                break;
                            case 90:
                                px = (img.owner.h - img.cy - img.ch) * cs - (img.owner.cellSize * img.owner.h - this.height) * scale;
                                py = (img.cx) * cs;
                                if (flip) {
                                    py = this.width * scale - py - cs;
                                }
                                break;
                            case 180:
                                px = (img.owner.w - img.cx - img.cw) * cs - (img.owner.cellSize * img.owner.w - this.width) * scale;
                                py = (img.owner.h - img.cy - img.ch) * cs - (img.owner.cellSize * img.owner.h - this.height) * scale;
                                if (flip) {
                                    px = this.width * scale - px - cs;
                                }
                                break;
                            case 270:
                                px = (img.cy) * cs;
                                py = (img.owner.w - img.cx - img.cw) * cs - (img.owner.cellSize * img.owner.w - this.width) * scale;
                                if (flip) {
                                    py = this.width * scale - py - cs;
                                }
                                break;
                        }
                        ViewerUtil.setTrace("8");

                        img.image.style.left = Math.floor(px) + "px";
                        img.image.style.top = Math.floor(py) + "px";
                        img.image.style.width = Math.ceil(cs * img.cw) + "px";
                        img.image.style.height = Math.ceil(cs * img.ch) + "px";
                    }
                    for (var cx = 0; cx < img.owner.cellArea * img.cw; cx++) {
                        var ft = flag[x + cx];
                        if (typeof ft == 'undefined')
                            break;
                        for (var cy = 0; cy < img.owner.cellArea * img.ch; cy++) {
                            if (typeof flag[x + cx][y + cy] == 'undefined')
                                break;
                            flag[x + cx][y + cy] = true;
                        }
                    }
                }
            }
        }
    }
    this.Dispose = function () {
        for (var i = 0; i < this.levels.length; i++)
            this.levels[i].Dispose();
    }
    this.loadPreview = function () {
        return this.maxlevelcmimage.load();
    }
    this.clearBackGround = function () {
        this.backGround = null;
    }
    this.reset();
}
var CellMapLevelLoadCnt = 0;
function CellMapLevel(map, level) {
    var level = level;
    this.map = map;
    this.ctrl = map.ctrl;
    this.cellArea = Math.pow(2, level);
    this.cellSize = 256 * this.cellArea;
    var w = Math.ceil(map.width / this.cellSize);
    var h = Math.ceil(map.height / this.cellSize);
    if (w == 0)
        w = 1;
    if (h == 0)
        h = 1;
    this.w = w;
    this.h = h;
    this.imagemap = [];
    for (var x = 0; x < w; x++) {
        this.imagemap[x] = [];
        for (var y = 0; y < h; y++) {
            this.imagemap[x][y] = new CellMapImage(this, map.src, level, x, y);
        }
    }
    this.request = function (x, y, w, h) {
        var cx1 = Math.ceil(x / this.cellSize);
        var cx2 = Math.ceil((x + w) / this.cellSize);
        var cy1 = Math.ceil(y / this.cellSize);
        var cy2 = Math.ceil((y + h) / this.cellSize);

        for (var cy = cy1; cy < cy2; cy++) {
            for (var cx = cx1; cx < cx2; cx++) {
                if (this.imagemap[cx][cy]) {
                    this.imagemap[cx][cy].load();
                    CellMapLevelLoadCnt++;
                }
            }
        }
    }
    this.isComp = function () {
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                if (this.imagemap[x][y] && this.imagemap[x][y].image==null)
                    return false;
            }
        }
        return true;
    }
    this.udpateParam = function (compfc) {
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                if (this.imagemap[x][y])
                    this.imagemap[x][y].updateParam();
            }
        }
    }
    this.clear = function () {
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                if (this.imagemap[x][y])
                    this.imagemap[x][y].clear();
            }
        }
    }
    this.Dispose = function () {
        for (var x = 0; x < w; x++) {
            for (var y = 0; y < h; y++) {
                if (this.imagemap[x][y])
                    MapImageLoader.RemoveCellMap(this.imagemap[x][y]);
            }
        }
    }
}
function RequestImage(image,cell) {
    this.Image = image;
    this.Cell = cell;
    this.IsCancel = false;
    this.isLoading = false;
}
function CellMapImage(owner,src,level,cx,cy){
    var self = this;
    this.owner = owner;
    this.map   = owner.map;
    this.ctrl = owner.ctrl;
    this.level = level;
    this.requestcount = 0;
    this.lastrequest = -1;
    this.cx = cx;
    this.cy = cy;
    this.cw = 1;
    this.ch = 1;
    this.isPreview = false;
    this.src = src + "&level=" + level + "&cx=" + cx + "&cy=" + cy;
    this.image = null;
    this.requestimage = null;
    this.isupdate = true;
    this.request = false;
    this.updateParam = function () {
        //パラメータが更新されたとき現在の画像を無効化する
        if(!this.map.previewMode)
            this.image = null;
        this.isupdate = true;
    }
    //パラメータが更新されたときに現在の画像を無効化するが
    //呼び出されるタイミングは現在の画像が有効になったときのみ
    this.invokeUpdateParam = function () {
        if (this.image) {
            if (this.image.complete) {
                this.image = null;
            }
        }
        this.isupdate = true;
    }
    this.clear = function () {
        this.image = null;
        this.isupdate = false;
        this.request = false;
        //要求中のものはキャンセル処理を行う
        if (this.requestimage) {
            //画像読み込みが開始されてまだ応答がこない画像
            this.requestimage.IsCancel = true;
            //画像読み込みキューの中
            if (!this.requestimage.isLoading) {
                this.requestimage.isLoading = true;
                if(this.requestimage.Image)
                    this.requestimage.Image.loaderCancel();
            }
        }
    }
    this.load = function () {
        if (this.image == null || this.image.mapsrc != self.map.param) {
            this.request = true;
        }
        if (this.image && this.isupdate == false)
            return false;
        if (this.requestimage)
            return false;
        this.isupdate = false;
        this.request = false;
        var image = new Image();
        this.requestcount++;
        this.requestimage = new RequestImage(image, this);
        image.requestcount = this.requestcount;
        image.style.position = "absolute";
        image.style.border = "0px";
        image.style.padding = "0px";
        image.style.margin = "0px"
        image.style.verticalAlign = "bottom";
        image.style.width = "256px";
        image.style.height = "256px";
        image.loadsrc = this.src + "&cw=" + this.cw + "&ch=" + this.ch + "&" + self.map.param;
        image.mapsrc = self.map.param;
        if (this.isPreview) {
            image.loadsrc += "&preview=1";
        }
        image.loadStart = function () {
            this.src = this.loadsrc;
        }
        image.loaderOnError = function () {
            this.loaderCancel();
        }
        image.loaderOnLoad = function () {
            if (self.lastrequest < this.requestcount) {
                self.lastrequest = this.requestcount;
                self.image = this;
                self.map.onloadImage(self);
                //画像更新通知が来ていた場合画像読み込みのタイミングで
                //画像を無効化して新しいパラメータで読み込む
                if (self.isupdate) {
                    setTimeout(function () {
                        self.load();
                    }, 0);
                }
                self.requestimage = null;
            }
        }
        image.loaderCancel = function () {
            if (self.isupdate || self.request) {
                self.isupdate = true;
                setTimeout(function () {
                    self.load();
                }, 0);
            }
            self.image = null;
            this.isupdate = true;
            self.requestimage = null;
        }
        this.ctrl.setLoadImage(this.requestimage);
        return false;
    }
    this.draw = function (ctx) {
        var size = this.owner.cellSize;
        ctx.drawImage(this.image, size * this.cx, size * this.cy, size, size);
    }
    this.drawimage = function (ctx, image) {
        var size = this.owner.cellSize;
        ctx.drawImage(image, size * this.cx, size * this.cy, size, size);
    }
}
