/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

function ViewerPatientInfo_Init() {
    // セパレータイベント設定
    $("#Separator, #PatientInfo-Head-Left, #PatientInfo-Head-Center, #PatientInfo-Head-Center-Far").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 初期タッチ位置登録
            var startX = e.originalEvent.touches[0].pageX;
            var startY = e.originalEvent.touches[0].pageY;

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offsetX = e.originalEvent.touches[0].pageX - startX;
                    var offsetY = e.originalEvent.touches[0].pageY - startY;

                    // タッチ位置更新
                    startX = e.originalEvent.touches[0].pageX;
                    startY = e.originalEvent.touches[0].pageY;

                    // セパレータ(縦)リサイズ処理
                    ViewerWindow_Separator_Length_Resize($("#SeriesList").height() - offsetY);

                    // セパレータ(横)リサイズ処理
                    ViewerWindow_Separator_Side_Resize($("#SeriesList").offset().left + offsetX);
                    return;
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            // 初期マウス位置登録
            var pointX = e.pageX;
            var pointY = e.pageY;

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offsetX = e.pageX - pointX;
                    var offsetY = e.pageY - pointY;

                    // マウス位置更新
                    pointX = e.pageX;
                    pointY = e.pageY;

                    // セパレータ(縦)リサイズ処理
                    ViewerWindow_Separator_Length_Resize($("#SeriesList").height() - offsetY);

                    // セパレータ(横)リサイズ処理
                    ViewerWindow_Separator_Side_Resize($("#SeriesList").offset().left + offsetX);
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

    // 検査情報ボタンイベント設定
    $("#PatientInfo-Head-Right").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 検査情報ボタン開始処理
            ViewerPatientInfo_StudyInfo_Start();

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 検査情報ボタン開始処理
                        ViewerPatientInfo_StudyInfo_Start();
                    }
                    else {
                        // 検査情報ボタンキャンセル処理
                        ViewerPatientInfo_StudyInfo_Cancel();
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // 検査情報ボタン確定処理
                    ViewerPatientInfo_StudyInfo_Fix();
                }
                else {
                    // 検査情報ボタンキャンセル処理
                    ViewerPatientInfo_StudyInfo_Cancel();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // 検査情報ボタン開始処理
            ViewerPatientInfo_StudyInfo_Start();

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 検査情報ボタン開始処理
                        ViewerPatientInfo_StudyInfo_Start();
                    }
                    else {
                        // 検査情報ボタンキャンセル処理
                        ViewerPatientInfo_StudyInfo_Cancel();
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // 検査情報ボタン確定処理
                    ViewerPatientInfo_StudyInfo_Fix();
                }
                else {
                    // 検査情報ボタンキャンセル処理
                    ViewerPatientInfo_StudyInfo_Cancel();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    //アンカー要素のフォーカス設定
    $("#PatientInfo-Head-Center-Far a").on("focus", function () {
        //選択枠解除
        $(this).blur();
    });

    // 表示幅更新用初期化
    $("#PatientInfo-Head-Center-Far").data("width", $("#PatientInfo-Head-Center-Far").width());

    // 過去検査一覧取得
    Viewer_GetPastStudyList(
            $("#ViewerConfig").data("patientid"),
            $("#ViewerConfig").data("studykey"),
            null,
            ViewerPatientInfo_GetPastStudyList_Result
        );   // 取得後「過去検査一覧取得結果」呼び出し
}

// 過去検査一覧取得結果
function ViewerPatientInfo_GetPastStudyList_Result(result) {
    // 患者情報設定
    if ($("#ViewerConfig").data("portal") == null) {
        $("#PatientInfo-PatientID").text(result.d.Tags[0].PatientID);
        $("#PatientInfo-PatientsName").text(result.d.Tags[0].PatientsName);
    }
    else {
        // ポータル情報を設定
        $("#PatientInfo-PatientID").text($("#ViewerConfig").data("portal"));
    }

    // リサイズ処理
    ViewerWindow_Resize_Proc();

    // 過去検査一覧取得結果
    ViewerStudyList_GetPastStudyList_Result(result);
}

// 検査情報ボタン開始処理
function ViewerPatientInfo_StudyInfo_Start() {
    // アイコン変更
    var $obj = $("#PatientInfo-Head-Right");
    if ($obj.hasClass("PatientInfo-Head-Right-Down-OFF")) {
        $obj.removeClass("PatientInfo-Head-Right-Down-OFF").addClass("PatientInfo-Head-Right-Down-ON");
    }
    else if ($obj.hasClass("PatientInfo-Head-Right-Up-OFF")) {
        $obj.removeClass("PatientInfo-Head-Right-Up-OFF").addClass("PatientInfo-Head-Right-Up-ON");
    }
}

// 検査情報ボタンキャンセル処理
function ViewerPatientInfo_StudyInfo_Cancel() {
    // アイコン変更
    var $obj = $("#PatientInfo-Head-Right");
    if ($obj.hasClass("PatientInfo-Head-Right-Down-ON")) {
        $obj.removeClass("PatientInfo-Head-Right-Down-ON").addClass("PatientInfo-Head-Right-Down-OFF");
    }
    else if ($obj.hasClass("PatientInfo-Head-Right-Up-ON")) {
        $obj.removeClass("PatientInfo-Head-Right-Up-ON").addClass("PatientInfo-Head-Right-Up-OFF");
    }
}

// 検査情報ボタン確定処理
function ViewerPatientInfo_StudyInfo_Fix() {
    // 状態判定
    var $obj = $("#PatientInfo-Head-Right");
    if ($obj.hasClass("PatientInfo-Head-Right-Down-ON")) {
        // 非表示
        $("#PatientInfo-Body").hide();

        // リサイズ処理
        ViewerWindow_Resize_Proc();

        // アイコン変更
        $obj.removeClass("PatientInfo-Head-Right-Down-ON").addClass("PatientInfo-Head-Right-Up-OFF");
    }
    else if ($obj.hasClass("PatientInfo-Head-Right-Up-ON")) {
        // 表示
        $("#PatientInfo-Body").show();

        // リサイズ処理
        ViewerWindow_Resize_Proc();

        // アイコン変更
        $obj.removeClass("PatientInfo-Head-Right-Up-ON").addClass("PatientInfo-Head-Right-Down-OFF");
    }
}
