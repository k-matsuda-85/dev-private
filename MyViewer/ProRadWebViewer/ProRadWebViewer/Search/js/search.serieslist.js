/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 初期化処理
function SearchSeriesList_Init() {
    // セパレータイベント設定
    $("#Separator, #SeriesList-Head-Left, #SeriesList-Head-Center, #SeriesList-Head-Center-Far").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
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

                    // セパレータ(縦)リサイズ処理
                    SearchWindow_Separator_Length_Resize($("#SeriesList").height() - offsetY);
                    return;
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
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

                    // セパレータ(縦)リサイズ処理
                    SearchWindow_Separator_Length_Resize($("#SeriesList").height() - offsetY);
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

    // シリーズ情報ボタンイベント設定
    $("#SeriesList-Head-Right").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // シリーズ情報ボタン開始処理
            SearchWindow_SeriesInfo_Start();

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // シリーズ情報ボタン開始処理
                        SearchWindow_SeriesInfo_Start();
                    }
                    else {
                        // シリーズ情報ボタンキャンセル処理
                        SearchWindow_SeriesInfo_Cancel();
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // シリーズ情報ボタン確定処理
                    SearchWindow_SeriesInfo_Fix();
                }
                else {
                    // シリーズ情報ボタンキャンセル処理
                    SearchWindow_SeriesInfo_Cancel();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // シリーズ情報ボタン開始処理
            SearchWindow_SeriesInfo_Start();

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // シリーズ情報ボタン開始処理
                        SearchWindow_SeriesInfo_Start();
                    }
                    else {
                        // シリーズ情報ボタンキャンセル処理
                        SearchWindow_SeriesInfo_Cancel();
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // シリーズ情報ボタン確定処理
                    SearchWindow_SeriesInfo_Fix();
                }
                else {
                    // シリーズ情報ボタンキャンセル処理
                    SearchWindow_SeriesInfo_Cancel();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 縦スクロールバー制御イベント設定
    $("#SeriesList-Body-View").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
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
            if (!$(e.target).is("#SeriesList-Body-View")) {
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
                    $("#SeriesList-Body-View").scrollTop($("#SeriesList-Body-View").scrollTop() - offsetY);
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

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // スクロールバー表示位置は対象外
            var sbWidth = $("#ViewerConfig").data("ScrollBarWidth");
            var thisOffset = $this.offset();
            if (($this.width() + thisOffset.left - sbWidth <= e.pageX) ||
                ($this.height() + thisOffset.top - sbWidth <= e.pageY)) {
                return;
            }

            // 発生元が異なる場合は対象外
            if (!$(e.target).is("#SeriesList-Body-View")) {
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
                    $("#SeriesList-Body-View").scrollTop($("#SeriesList-Body-View").scrollTop() - offsetY);
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
    $("#SeriesList-Body-View").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
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
                    // Viewer起動処理(シリーズ)
                    SearchSeriesList_Viewer_Open($this);
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
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
                    // Viewer起動処理(シリーズ)
                    SearchSeriesList_Viewer_Open($this);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SeriesList-Item");
}

// シリーズ一覧非表示
function SearchSeriesList_Hide() {
    // 全非表示
    $("#SeriesList-Body-View .SeriesList-Group").hide();

    // Ajax用送信キーを更新し通信中をキャンセルする
    Search_GetAjaxKey();
}

// シリーズ一覧変更
function SearchSeriesList_Change($this) {
    // シリーズ一覧非表示
    SearchSeriesList_Hide();

    // 選択検査取得
    var select = $this.data("StudyKey");

    // 取得済みチェック
    var dataFlag = false;
    $("#SeriesList-Body-View .SeriesList-Group").each(function () {
        var tmp = $(this).data("StudyKey");
        if (tmp != select) {
            return true;
        }

        // 一致(取得済み)のため表示
        $(this).show();
        dataFlag = true;
        return false;
    });
    if (dataFlag) {
        // 取得済みのため終了
        return;
    }

    // シリーズ一覧取得
    Search_GetSeriesList(
        $this.data("StudyKey"),
        $this,
        SearchSeriesList_GetSeriesList_Result
    ); // 取得後「シリーズ一覧取得結果」呼び出し
}

// シリーズ一覧取得結果
function SearchSeriesList_GetSeriesList_Result(result, $this) {
    // キャンセルされた場合
    if (result.d.IsCancel == true) {
        return;
    }

    // データなし
    if (result.d.Tags.length == 0) {
        return;
    }

    // 選択検査取得
    var select = $this.data("StudyKey");

    // 取得済みチェック
    var dataFlag = false;
    $("#SeriesList-Body-View .SeriesList-Group").each(function () {
        var tmp = $(this).data("StudyKey");
        if (tmp != select) {
            return true;
        }

        // 一致(取得済み)のため表示
        $(this).show();
        dataFlag = true;
        return false;
    });
    if (dataFlag) {
        // 取得済みのため終了
        return;
    }

    // 要素を作成
    var rowG = $("<div>").addClass("SeriesList-Group").data("StudyKey", $this.data("StudyKey")).data("PatientID", $this.data("PatientID"));
    $.each(result.d.Tags, function () {
        var row = $("<div>").addClass("SeriesList-Item SeriesList-Item-OFF").data("SeriesKey", this.SeriesKey)
            .append($("<div>").addClass("SeriesList-Item-SeriesDescription").text(this.SeriesDescription))
            .append($("<div>").addClass("SeriesList-Item-NumberOf").text((this.NumberOfImages < this.NumberOfFrames) ? this.NumberOfFrames : this.NumberOfImages)
                .append($("<span>").text((this.NumberOfImages < this.NumberOfFrames) ? " fr" : " 枚")))
            .append($("<div>").addClass("SeriesList-Item-NowLoading"))
            .append($("<div>").addClass("SeriesList-Item-Thumbnail").css("backgroundImage", "url(../Viewer/GetThumbnail.aspx?key=" + this.SeriesKey + ")"));
//            .append($("<span>").addClass("SeriesList-Item-SeriesNumber").text(this.SeriesNumber));
        if (this.IsGSPS) {
            row.append($("<span>").addClass("SeriesList-Item-IsGSPS").text("PR"));
        }
        rowG.append(row);
    });
    $("#SeriesList-Body-View").append(rowG);
}

// Viewer起動処理(シリーズ)
function SearchSeriesList_Viewer_Open($this) {
    // パラメータ作成
    var param = new Object();
    param["patientid"] = $this.parent().data("PatientID");
    param["studykey"] = $this.parent().data("StudyKey");
    param["serieskey"] = $this.data("SeriesKey");

    // パラメータ設定
    Search_SetParams(
        param,
        null,
        SearchSeriesList_SetParams_Result
    );
}

// パラメータ設定結果(検査)
function SearchSeriesList_SetParams_Result(result) {
    // Viewer起動処理
    if ($("#ViewerConfig").data("MultiView") != "1") {
        Common_WindowOpen($("#ViewerConfig").data("ViewerURL"), "ProRadViewer" + $("#ViewerConfig").data("time"), true);
    }
    else {
        var dd = new Date();
        Common_WindowOpen($("#ViewerConfig").data("ViewerURL"), "ProRadViewer" + dd.getTime(), true);
    }
}