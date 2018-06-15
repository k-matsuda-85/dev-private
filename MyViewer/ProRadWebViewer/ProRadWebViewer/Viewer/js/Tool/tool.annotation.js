/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// アノテーション
var Tool_Annotation = {
    // 有効
    Enabled: false,
    // 追加
    Add: function () {
        // 二重登録チェック
        if (Tool_Annotation.Enabled) {
            return;
        }
        Tool_Annotation.Enabled = true;

        // 要素を作成
        $("#ToolArea-View").append($("<div>").attr("id", "Tool-Annotation").addClass("Tool-Common-SizeA Tool-Annotation-OFF"));

        // パラメータ確認
        if ($("#ViewerConfig").data("DefAnnotation") == "1") {
            Tool_Annotation.Command(true);
        }

        // ボタンクリックイベント設定
        $("#Tool-Annotation").on({
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
                        Tool_Annotation.Click();
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
                        Tool_Annotation.Click();
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
        // 未選択状態の場合
        if ($("#Tool-Annotation").hasClass("Tool-Annotation-OFF")) {
            // 有効
            Tool_Annotation.Command(true);
        }
        else {
            // 無効
            Tool_Annotation.Command(false);
        }
    },
    // コマンド
    Command: function (command) {
        // コマンド確認
        if (command == true) {
            // アイコン変更
            $("#Tool-Annotation").removeClass("Tool-Annotation-OFF").addClass("Tool-Annotation-ON");

            // アノテーション全表示
            $("#ViewerLib .AnnotationOff").hide();
            $("#ViewerLib .AnnotationOn").show();

            // 表示上の全パネル分ループ
            for (var i = 0; i < viewer.SeriesPanels.length; i++) {
                var series = viewer.getSeriesPanelFromIndex(i);
                if (series == null) {
                    continue;
                }
                for (var j = 0; j < series.SopPanels.length; j++) {
                    var sop = series.getSopPanelFromIndex(j);
                    if (sop == null || sop.sopData == null) {
                        continue;
                    }

                    // 更新処理呼び出し
                    sop.sopData.isUpdateAnnotation = true;
                }
            }
        }
        else {
            // アイコン変更
            $("#Tool-Annotation").removeClass("Tool-Annotation-ON").addClass("Tool-Annotation-OFF");

            // アノテーション全非表示
            $("#ViewerLib .AnnotationOn").hide();
            $("#ViewerLib .AnnotationOff").show();
        }
    },
    // タグ確認
    CheckTag: function (sopData) {
        // Image情報取得状態確認
        if (sopData.InitParam.IsImageInfo) {
            return false;
        }

        // アノテーション情報取得
        var item = Viewer_GetAnnotationVal(sopData.seriesData.ExData.Modality);

        // アノテーション全非表示状態の場合
        var i;
        if ($("#Tool-Annotation").hasClass("Tool-Annotation-OFF")) {
            // モダリティ毎のアノテーション情報分ループ
            for (i = 0; i < item.length; i++) {
                // OFFに必要なタグがあるか確認
                switch (item[i].Position) {
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        return true;
                }
            }
        }
        else {
            // モダリティ毎のアノテーション情報分ループ
            for (i = 0; i < item.length; i++) {
                // ONに必要なタグがあるか確認
                switch (item[i].Position) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        return true;
                }
            }
        }
        return false;
    },
    // 取得
    Get: function (sopData) {
        // 要求タグ取得
        var tags = Viewer_GetRequestTags(sopData.seriesData.ExData.Modality);
        Viewer_GetDicomTag(sopData.InitParam.ImageKey, tags, null, function (result) {
            // タグ設定
            sopData.InitParam.ExData.RequestTags = result.d.Tags;

            // 再設定するため初期化
            sopData.AnnotationPanel = null;

            // 更新処理呼び出し
            sopData.isUpdateAnnotation = true;
        });
    },
    // 設定
    Set: function (sopData) {
        // 初期化
        var luOn = $("<div>").addClass("AnnotationBase AnnotationLU");
        var ruOn = $("<div>").addClass("AnnotationBase AnnotationRU");
        var ldOn = $("<div>").addClass("AnnotationBase AnnotationLD");
        var rdOn = $("<div>").addClass("AnnotationBase AnnotationRD");
        var parentOn = $("<div>").addClass("AnnotationOn").append(luOn).append(ldOn).append(ruOn).append(rdOn);
        var luOff = $("<div>").addClass("AnnotationBase AnnotationLU");
        var ruOff = $("<div>").addClass("AnnotationBase AnnotationRU");
        var ldOff = $("<div>").addClass("AnnotationBase AnnotationLD");
        var rdOff = $("<div>").addClass("AnnotationBase AnnotationRD");
        var parentOff = $("<div>").addClass("AnnotationOff").append(luOff).append(ldOff).append(ruOff).append(rdOff);

        // アノテーション情報取得
        var item = Viewer_GetAnnotationVal(sopData.seriesData.ExData.Modality);

        // 文字色
        var color = "";
        if (sopData.seriesData.ExData.StudyKey == $("#SeriesList").data("FirstStudyKey")) {
            if ($("#ViewerConfig").data("AnnotationColor") != "") {
                color = $("#ViewerConfig").data("AnnotationColor");
            }
        }
        else {
            if ($("#ViewerConfig").data("AnnotationColorKako") != "") {
                color = $("#ViewerConfig").data("AnnotationColorKako");
            }
        }

        // モダリティ毎のアノテーション情報分ループ
        for (var i = 0; i < item.length; i++) {
            // 初期化
            var tags = item[i].Tag.split(";");

            // アノテーションフォーマット処理
            var ret = Tool_Annotation.Format(sopData, item[i].Format, tags);

            // 追加するdiv作成
            var formatDiv = $("<div>").text(ret.Text);
            if (ret.Text == "") {
                // 空白行として高さを指定
                formatDiv.css("height", "16px");
            }

            // 文字色
            if (color != "") {
                formatDiv.css("color", color);
            }

            // サイズ
            if (item[i].FontSize != "") {
                formatDiv.css("fontSize", item[i].FontSize);
            }

            // スタイル
            if (item[i].FontStyle != "") {
                var fs = item[i].FontStyle.split(",");
                for (var j = 0; j < fs.length; j++) {
                    switch (fs[j]) {
                        case "B":   //太字
                            formatDiv.css("fontWeight", "bold");
                            break;
                        case "I":   //斜体
                            formatDiv.css("fontStyle", "italic");
                            break;
                        case "U":   //下線
                            formatDiv.css("textDecoration", "underline");
                            break;
                    }
                }
            }

            // 更新ありの要素が含まれる場合は情報を保持する
            if (ret.Update) {
                formatDiv.data("Format", item[i].Format)
                     .data("Tags", tags)
                     .addClass("AnnotationUpdate");
            }

            // 各位置に追加
            switch (item[i].Position) {
                case 0: // 左上(ON)
                    luOn.append(formatDiv);
                    break;
                case 1: // 左下(ON)
                    ldOn.append(formatDiv);
                    break;
                case 2: // 右上(ON)
                    ruOn.append(formatDiv);
                    break;
                case 3: // 右下(ON)
                    rdOn.append(formatDiv);
                    break;
                case 4: // 左上(OFF)
                    luOff.append(formatDiv);
                    break;
                case 5: // 左下(OFF)
                    ldOff.append(formatDiv);
                    break;
                case 6: // 右上(OFF)
                    ruOff.append(formatDiv);
                    break;
                case 7: // 右下(OFF)
                    rdOff.append(formatDiv);
                    break;
            }
        }

        // アノテーション全非表示状態の場合
        if ($("#Tool-Annotation").hasClass("Tool-Annotation-OFF")) {
            // 非表示に設定
            parentOn.hide();
        }
        else {
            // 表示に設定
            parentOff.hide();
        }

        // パネル設定
        sopData.AnnotationPanel = $("<div>").append(parentOn).append(parentOff).get(0);
    },
    // 更新
    Update: function (sopData) {
        // 更新ありの要素取得
        $(sopData.AnnotationPanel).children().each(function () {
            var child = $(this).children();
            child.children(".AnnotationUpdate").each(function () {
                // アノテーションフォーマット処理
                var ret = Tool_Annotation.Format(sopData, $(this).data("Format"), $(this).data("Tags"));

                // 要素更新
                $(this).text(ret.Text);
            });
        });

        // アノテーション全非表示状態の場合
        if ($("#Tool-Annotation").hasClass("Tool-Annotation-OFF")) {
            // 非表示に設定
            $(sopData.AnnotationPanel).children(".AnnotationOn").hide();
            $(sopData.AnnotationPanel).children(".AnnotationOff").show();
        }
        else {
            // 表示に設定
            $(sopData.AnnotationPanel).children(".AnnotationOff").hide();
            $(sopData.AnnotationPanel).children(".AnnotationOn").show();
        }
    },
    // 更新
    Format: function (sopData, format, tags) {
        // 初期化
        var stringTag = new Array();
        var reg = new RegExp("{?([0-9]+):?([^}]*?)}");
        var ret = new Array();
        ret.Update = false;
        ret.Text = "";

        // フォーマット分ループ
        for (var i = 0; i < tags.length; i++) {
            // 要素取得
            var uinttag = parseInt(tags[i]);
            if (isNaN(uinttag)) {
                // 動的要素取得
                switch (tags[i]) {
                    case "SC":  //SOP Count
                        stringTag.push(sopData.seriesData.BaseSopDatas.length);
                        break;
                    case "SI":  //SOP Index
                        stringTag.push(sopData.SopIndex + 1);
                        ret.Update = true;
                        break;
                    case "SZ":  //SOP Zoom
                        stringTag.push(Common_DecimalFmt(new String(sopData.getInfo("scale")), "0.00"));
                        ret.Update = true;
                        break;
                    case "SR":  //SOP Rotate
                        stringTag.push(Common_DecimalFmt(new String(sopData.getInfo("rot")), "0"));
                        ret.Update = true;
                        break;
                    case "SF":  //SOP FlipX
                        stringTag.push(sopData.getInfo("flipX"));
                        ret.Update = true;
                        break;
                    case "WL":  //Window Center
                        stringTag.push(Common_DecimalFmt(new String(sopData.getInfo("wc")), ""));
                        ret.Update = true;
                        break;
                    case "WW":  //Window Width
                        stringTag.push(Common_DecimalFmt(new String(sopData.getInfo("ww")), ""));
                        ret.Update = true;
                        break;
                    default:    //未知の形式
                        stringTag.push("");
                        break;
                }
            }
            else {
                // 固定要素取得
                var pushFlag = false;
                if (sopData.InitParam.ExData.RequestTags != null) {
                    for (var j = 0; j < sopData.InitParam.ExData.RequestTags.length; j++) {
                        if (sopData.InitParam.ExData.RequestTags[j].Tag == uinttag) {
                            stringTag.push(sopData.InitParam.ExData.RequestTags[j].Value);
                            pushFlag = true;
                            break;
                        }
                    }
                }
                if (pushFlag != true) {
                    stringTag.push("");
                }
            }
        }

        // 正規表現にてマッチしなくなるまでループ
        for (var ma = format.match(reg); ma; ma = RegExp.rightContext.match(reg)) {
            // 先頭以外でマッチした場合はそれ以前の部分を追加
            if (RegExp.index != 0) {
                ret.Text += RegExp.leftContext;
            }

            // タグの配列に存在するか確認
            var index = parseInt(RegExp.$1);
            if (!(index in stringTag)) {
                // 存在しないため次へ
                continue;
            }

            // フォーマットなしの場合
            if (RegExp.$2 == "") {
                //そのまま追加
                ret.Text += stringTag[index];
                continue;
            }

            // フォーマット判定
            switch (RegExp.$2.substring(0, 1)) {
                case "D":   // 日付
                    // 日付表示に変換
                    ret.Text += Common_DateFmt(stringTag[index]);
                    break;
                case "T":   // 時刻
                    // 時間表示に変換
                    ret.Text += Common_TimeFmt(stringTag[index]);
                    break;
                case "F":   // 小数点
                    // 小数点表示に変換
                    ret.Text += Common_DecimalFmt(stringTag[index], RegExp.$2.substring(1));
                    break;
            }
        }

        // 余り部分を追加
        ret.Text += RegExp.rightContext;
        return ret;
    }
}

// ViewerControl処理
function ViewerControl_UpdateAnnotation(name) {
    // 種別判定
    switch (name) {
        case "panel":
            // 要求タグ未設定の場合
            if (this.InitParam.ExData.RequestTags == null) {
                // タグ確認処理
                if (Tool_Annotation.CheckTag(this)) {
                    // 設定処理
                    Tool_Annotation.Set(this);

                    // 取得処理
                    Tool_Annotation.Get(this);
                }
            }
            // パネル未設定の場合
            else if (this.AnnotationPanel == null) {
                // 設定処理
                Tool_Annotation.Set(this);
            }
            // パネル設定済みの場合
            else {
                // 更新処理
                Tool_Annotation.Update(this);
            }
            break;
        case "wl":
        case "scale":
            // パネル設定済みの場合
            if (this.AnnotationPanel != null) {
                // 更新処理
                Tool_Annotation.Update(this);
            }
            break;
    }
}
