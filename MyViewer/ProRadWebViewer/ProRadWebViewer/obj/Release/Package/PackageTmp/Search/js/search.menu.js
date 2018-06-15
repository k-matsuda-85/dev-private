/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 初期化処理
function SearchMenu_Init() {
    // プリセット初期化
    SearchMenuPreset_Init();

    // メニュー初期化
    SearchMenuCommand_Init();

    // 入力メニュー初期化
    SearchMenuInput_Init();

    // メニューコマンド領域の全体幅を算出保持
    var width = 0;
    $(".SearchMenu-Command-Common").each(function () {
        width += $(this).width();
    });
    $("#SearchMenu-Command-View").data("width", width);

    // メニューコマンド領域のマージンを保持
    $("#SearchMenu-Command-View").data("margin", parseInt($("#SearchMenu-Command-View").css("left")));

    //キャンセル状態初期化
    $("#SearchMenu-Command-View").data("isCancel", false);

    // メニュー領域オーバーレイ処理
    SearchMenu_Overlay();

    // 検索ボタンクリックイベント設定
    $("#SearchMenu-Basic-Search").on({
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

            // プリセット登録項目選択開始処理
            SearchMenuPreset_Select_Start(true);

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // プリセット登録項目選択移動処理
                        SearchMenuPreset_Select_Move(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // タッチイベント二重動作防止のためタイマを使用する
                    setTimeout(function () {
                        // 検索ボタンクリック処理
                        SearchMenu_Search_Button_Click();
                    }, 100);
                }

                // プリセット登録項目選択確定処理
                SearchMenuPreset_Select_Fix();

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

            // プリセット登録項目選択開始処理
            SearchMenuPreset_Select_Start(true);

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.pageX, e.pageY)) {
                        // プリセット登録項目選択移動処理
                        SearchMenuPreset_Select_Move(e.pageX, e.pageY);
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && !pointInfo.IsDrag) {
                    // 検索ボタンクリック処理
                    SearchMenu_Search_Button_Click();
                }

                // プリセット登録項目選択確定処理
                SearchMenuPreset_Select_Fix();

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // リセットボタンクリックイベント設定
    $("#SearchMenu-Basic-Reset").on({
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

            // プリセット登録項目選択開始処理
            SearchMenuPreset_Select_Start(false);

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // プリセット登録項目選択移動処理
                        SearchMenuPreset_Select_Move(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // リセットボタンクリック処理
                    SearchMenu_Reset_Button_Click();
                }

                // プリセット登録項目選択確定処理
                SearchMenuPreset_Select_Fix();

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

            // プリセット登録項目選択開始処理
            SearchMenuPreset_Select_Start(false);

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.pageX, e.pageY)) {
                        // プリセット登録項目選択移動処理
                        SearchMenuPreset_Select_Move(e.pageX, e.pageY);
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && !pointInfo.IsDrag) {
                    // リセットボタンクリック処理
                    SearchMenu_Reset_Button_Click();
                }

                // プリセット登録項目選択確定処理
                SearchMenuPreset_Select_Fix();

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // メニューコマンド領域のドラッグ設定
    $("#SearchMenu-Command").on({
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
            var startX = e.originalEvent.touches[0].pageX;

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offsetX = e.originalEvent.touches[0].pageX - startX;

                    // タッチ位置更新
                    startX = e.originalEvent.touches[0].pageX;

                    // メニュー領域リサイズ処理
                    SearchMenu_Resize(offsetX, false);
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
            var pointX = e.pageX;

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offsetX = e.pageX - pointX;

                    // マウス位置更新
                    pointX = e.pageX;

                    // メニュー領域リサイズ処理
                    SearchMenu_Resize(offsetX, false);
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
        },
        // マウスホイールイベント設定
        "mousewheel": function (e, delta) {
            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // メニュー領域リサイズ処理
            SearchMenu_Resize(delta * 72, false);
        }
    });

    // 左スクロールボタンのマウスダウンイベント設定
    $("#SearchMenu-Command-View-Overlay-Left").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新
                    rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // オフセット算出
                    var offset = $("#SearchMenu-Command").width() / 2;

                    // メニュー領域リサイズ処理
                    SearchMenu_Resize(offset, true);
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);

            // イベントを通知しない
            return false;
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新
                    rectInfo.Update(e.pageX, e.pageY);
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // オフセット算出
                    var offset = $("#SearchMenu-Command").width() / 2;

                    // メニュー領域リサイズ処理
                    SearchMenu_Resize(offset, true);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);

            // イベントを通知しない
            return false;
        }
    });

    // 右スクロールボタンのマウスダウンイベント設定
    $("#SearchMenu-Command-View-Overlay-Right").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新
                    rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // オフセット算出
                    var offset = -($("#SearchMenu-Command").width() / 2);

                    // メニュー領域リサイズ処理
                    SearchMenu_Resize(offset, true);
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);

            // イベントを通知しない
            return false;
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新
                    rectInfo.Update(e.pageX, e.pageY);
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // オフセット算出
                    var offset = -($("#SearchMenu-Command").width() / 2);

                    // メニュー領域リサイズ処理
                    SearchMenu_Resize(offset, true);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);

            // イベントを通知しない
            return false;
        }
    });

    $('div.search-button').on('click', function () {
        var id = $(this).attr('id');

        if (id.indexOf('search-mod') != -1) {
            // モダリティ選択
            if ($(this).hasClass('on-btn')) {
                $(this).addClass('off-btn');
                $(this).removeClass('on-btn');
            } else {
                $(this).addClass('on-btn');
                $(this).removeClass('off-btn');
            }
        } else {
            // 日付選択
            if ($(this).hasClass('on-btn')) {
                $(this).addClass('off-btn');
                $(this).removeClass('on-btn');
            } else {
                $(this).addClass('on-btn');
                $(this).removeClass('off-btn');

                switch (id) {
                    case 'search-today':
                        $('#search-yestaday').addClass('off-btn');
                        $('#search-yestaday').removeClass('on-btn');
                        $('#search-week').addClass('off-btn');
                        $('#search-week').removeClass('on-btn');
                        break;
                    case 'search-yestaday':
                        $('#search-today').addClass('off-btn');
                        $('#search-today').removeClass('on-btn');
                        $('#search-week').addClass('off-btn');
                        $('#search-week').removeClass('on-btn');
                        break;
                    case 'search-week':
                        $('#search-yestaday').addClass('off-btn');
                        $('#search-yestaday').removeClass('on-btn');
                        $('#search-today').addClass('off-btn');
                        $('#search-today').removeClass('on-btn');
                        break;
                }
            }
        }

        SearchMenu_Search_Button_Click();
    });

    $('#patid').on('keydown', function (e) {
        if(e.keyCode == 13)
            SearchMenu_Search_Button_Click();
    });
}

// 検索ボタンクリック処理
function SearchMenu_Search_Button_Click() {
    // 入力値取得
    var hospitalName = $("#SearchMenu-Input-HospitalName").data("ID") ? $("#SearchMenu-Input-HospitalName").data("ID") : $("#ViewerConfig").data("Hospital")[0].ID;
    var patientID = $("#SearchMenu-Input-PatientID").val() ? $("#SearchMenu-Input-PatientID").val() : "";
    var patientsName = $("#SearchMenu-Input-PatientsName").val() ? $("#SearchMenu-Input-PatientsName").val() : "";
    var modality = '';//$("#SearchMenu-Input-Modality").val() ? $("#SearchMenu-Input-Modality").val() : "";
    var studyDateVal = '';//SearchMenu_GetStudyDate();
    var uploadDate = SearchMenu_GetUploadDate();
    var accessionNumber = $("#SearchMenu-Input-AccessionNumber").val() ? $("#SearchMenu-Input-AccessionNumber").val() : "";
    var keyword = $("#SearchMenu-Input-Keyword").val() ? $("#SearchMenu-Input-Keyword").val() : "";
    var comment = $("#SearchMenu-Input-Comment").val() ? $("#SearchMenu-Input-Comment").val() : "";
    var isPacsSearch = ($("#SearchMenu-Command-PacsSearch").hasClass("SearchMenu-Command-PacsSearch-ON")) ? "1" : "0";

    $('#SearchMenu-Basic-Modality').children('div.on-btn').each(function (i, mod) {
        if (i > 0)
            modality = modality + ' ';
        modality = modality + $(mod).text();
    });

    $('#SearchMenu-Basic-StudyDate').children('div.on-btn').each(function (i, std) {
        var id = $(std).attr('id');

        switch (id) {
            case 'search-today':
                studyDateVal = '0';
                break;
            case 'search-yestaday':
                studyDateVal = '1';
                break;
            case 'search-week':
                studyDateVal = '6-0';
                break;
        }
    });


    // 検索条件判定
    if ($("#ViewerConfig").data("SearchCheck") == "1") {
        // ワイルドカード削除
        patientID = patientID.replace(/[*?]/g, "");
        if (patientID == "") {
            alert("患者IDを設定してください。");
            return;
        }
    }
    else {
        if (patientID == "" &&
            patientsName == "" &&
            modality == "" &&
            studyDateVal == "" &&
            uploadDate == "" &&
            accessionNumber == "" &&
            keyword == "" &&
            comment == "") {
            if ($("#ViewerConfig").data("AllSearch") != "1") {
                alert("検索条件を設定してください。");
                return;
            }
            if (!confirm("検索条件が空のとき、時間が掛かる場合があります。\r\n\r\n検索してよろしいですか？")) {
                return;
            }
        }
    }

    // 検索補助(PatientID)
    if (patientID != "" && $("#ViewerConfig").data("AssistPatientID") != "") {
        var assPatientID = $("#ViewerConfig").data("AssistPatientID").split(",");
        if (assPatientID.length >= 2) {
            // 0埋め
            if (!isNaN(parseInt(assPatientID[1]))) {
                while (patientID.length < assPatientID[1]) {
                    patientID = "0" + patientID;
                }
            }
            // ワイルドカード付与
            if (assPatientID[0] == "1") {
                patientID = "*" + patientID;
            }
            else if (assPatientID[0] == "2") {
                patientID = patientID + "*";
            }
            else if (assPatientID[0] == "3") {
                patientID = "*" + patientID + "*";
            }
        }
    }

    // 検索補助(PatientsName)
    if (patientsName != "" && $("#ViewerConfig").data("AssistPatientsName") != "") {
        var assPatientsName = $("#ViewerConfig").data("AssistPatientsName").split(",");
        if (assPatientsName.length >= 3) {
            // 全角カナ→半角カナ変換
            if (assPatientsName[1] == "1") {
                patientsName = Common_ToHankakuKana(patientsName);
            }
            // スペース→?変換
            if (assPatientsName[2] == "1") {
                patientsName = patientsName.replace(/\s|　/g, "?");
            }
            // ワイルドカード付与
            if (assPatientsName[0] == "1") {
                patientsName = "*" + patientsName;
            }
            else if (assPatientsName[0] == "2") {
                patientsName = patientsName + "*";
            }
            else if (assPatientsName[0] == "3") {
                patientsName = "*" + patientsName + "*";
            }
        }
    }

    // 検索処理
    SearchMenu_Search(
        hospitalName,
        patientID,
        patientsName,
        modality,
        studyDateVal,
        uploadDate,
        accessionNumber,
        keyword,
        comment,
        isPacsSearch,
        null);
}

// リセットボタンクリック処理
function SearchMenu_Reset_Button_Click() {
    // 検索条件クリア
    var $subHospital = $("#SearchMenu-Input-Sub-HospitalName");
    $("#SearchMenu-Input-HospitalName").val($subHospital.children().eq(0).text()).data("ID", $subHospital.children().eq(0).data("ID"));
    if ($("#SearchMenu-Input-PatientID").is(":enabled")) {
        $("#SearchMenu-Input-PatientID").val("");
    }
    $("#SearchMenu-Input-PatientsName").val("");
    if ($("#SearchMenu-Input-Modality").is(":enabled")) {
        $("#SearchMenu-Input-Modality").val("");
    }
    if ($("#SearchMenu-Input-StudyDate").is(":enabled")) {
        $("#SearchMenu-Input-StudyDate").val("");
    }
    if ($("#SearchMenu-Input-StudyDateTime").is(":enabled")) {
        $("#SearchMenu-Input-StudyDateTime").val("");
    }
    if ($("#SearchMenu-Input-AccessionNumber").is(":enabled")) {
        $("#SearchMenu-Input-AccessionNumber").val("");
    }
    $("#SearchMenu-Input-UploadDate").val("");
    $("#SearchMenu-Input-UploadDateTime").val("");
    $("#SearchMenu-Input-Keyword").val("");
    $("#SearchMenu-Input-Comment").val("");
    $("#SearchMenu-Command-PacsSearch").removeClass("SearchMenu-Command-PacsSearch-ON").addClass("SearchMenu-Command-PacsSearch-OFF");
}

// 検査日付取得処理
function SearchMenu_GetStudyDate() {
    var val = "";
    if ($("#SearchMenu-Input-StudyDate").length != 0) {
        val = $("#SearchMenu-Input-StudyDate").val() ? $("#SearchMenu-Input-StudyDate").val() : "";
        $.each($("#SearchMenu-Input-Sub-StudyDate .SearchMenu-Input-Sub-StudyDate-Item"), function () {
            if ($(this).text() == val) {
                val = $(this).data("date");
                return false;
            }
        });
    }
    else if ($("#SearchMenu-Input-StudyDateTime").length != 0) {
        val = $("#SearchMenu-Input-StudyDateTime").val() ? $("#SearchMenu-Input-StudyDateTime").val() : "";
        $.each($("#SearchMenu-Input-Sub-StudyDateTime .SearchMenu-Input-Sub-StudyDateTime-Item"), function () {
            if ($(this).text() == val) {
                val = $(this).data("date");
                return false;
            }
        });
    }
    return val;
}

// 登録日時取得処理
function SearchMenu_GetUploadDate() {
    var val = "";
    if ($("#SearchMenu-Input-UploadDate").length != 0) {
        val = $("#SearchMenu-Input-UploadDate").val() ? $("#SearchMenu-Input-UploadDate").val() : "";
        $.each($("#SearchMenu-Input-Sub-UploadDate .SearchMenu-Input-Sub-UploadDate-Item"), function () {
            if ($(this).text() == val) {
                val = $(this).data("date");
                return false;
            }
        });
    }
    else if ($("#SearchMenu-Input-UploadDateTime").length != 0) {
        val = $("#SearchMenu-Input-UploadDateTime").val() ? $("#SearchMenu-Input-UploadDateTime").val() : "";
        $.each($("#SearchMenu-Input-Sub-UploadDateTime .SearchMenu-Input-Sub-UploadDateTime-Item"), function () {
            if ($(this).text() == val) {
                val = $(this).data("date");
                return false;
            }
        });
    }
    return val;
}

// 検索処理
function SearchMenu_Search(hospitalID, patientID, patientsName, modality, studyDate, uploadDate, accessionNumber, keyword, comment, isPacsSearch, studyKey) {
    // 検査日付のチェック
    if (!Common_CheckDateString(studyDate)) {
        alert("検査日付が正しくありません。");
        return;
    }

    //登録日時のチェック
    if (!Common_CheckDateString(uploadDate)) {
        alert("登録日時が正しくありません。");
        return;
    }

    // 検索条件を保持
    $("#SearchMenu").data("HospitalID", hospitalID)
                    .data("PatientID", patientID)
                    .data("PatientsName", patientsName)
                    .data("Modality", modality)
                    .data("StudyDate", studyDate)
                    .data("UploadDate", uploadDate)
                    .data("AccessionNumber", accessionNumber)
                    .data("Keyword", keyword)
                    .data("Comment", comment)
                    .data("IsPacsSearch", isPacsSearch);

    // データクリア
    $("#SearchMenu-Info-Result").text("");
    $("#SearchMenu-Info-Max").text("");
    $("#StudyList-Table tbody").empty();
    $("#SeriesList-Body-View").empty();

    // 検査一覧ソートリセット
    SearchStudyList_Sort_Reset();

    // 処理中に設定
    $("#SearchCenter").append($("<div>").attr("id", "StudyListLoading"));

    // 検索パラメータ作成
    var findParam = new Object();
    findParam["PatientID"] = patientID;
    findParam["PatientsName"] = patientsName;
    findParam["Modality"] = modality;
    findParam["StudyDate"] = studyDate;
    findParam["UploadDate"] = uploadDate;
    findParam["AccessionNumber"] = accessionNumber;
    findParam["Keyword"] = keyword;
    findParam["Comment"] = comment;
    findParam["IsPacsSearch"] = (isPacsSearch == "1") ? true : false;

    // 検査一覧取得
    Search_GetStudyList(
        hospitalID,
        findParam,
        studyKey,
        SearchStudyList_GetStudyList_Result
    );  // 取得後「検査一覧取得結果」呼び出し
}

// 再検索処理
function SearchMenu_ReSearch(studyKey) {
    // 検索処理
    SearchMenu_Search(
        $("#SearchMenu").data("HospitalID"),
        $("#SearchMenu").data("PatientID"),
        $("#SearchMenu").data("PatientsName"),
        $("#SearchMenu").data("Modality"),
        $("#SearchMenu").data("StudyDate"),
        $("#SearchMenu").data("UploadDate"),
        $("#SearchMenu").data("AccessionNumber"),
        $("#SearchMenu").data("Keyword"),
        $("#SearchMenu").data("Comment"),
        $("#SearchMenu").data("IsPacsSearch"),
        studyKey);
}

// メニュー領域リサイズ処理
function SearchMenu_Resize(offset, animate) {
    //アニメーション停止
    $("#SearchMenu-Command-View").stop();

    // 現在の値を取得
    var margin = parseInt($("#SearchMenu-Command-View").data("margin"));
    var preLeft = parseInt($("#SearchMenu-Command-View").css("left")) - margin;

    // 移動後の値を算出
    var left = preLeft + offset;

    // 最大範囲(右移動の最大)
    if (left >= 0) {
        left = 0;
    }
    // 左移動時
    else if (offset < 0) {
        // 全体幅取得
        var viewArea = $("#SearchMenu-Command-View").data("width");

        // 表示エリア取得
        var showArea = $("#SearchMenu-Command").width() - margin;

        // 最小範囲(左移動の最大)算出
        var minLeft = showArea - viewArea;
        if (minLeft > 0) {
            minLeft = 0;
        }

        // リサイズにより右にスペースが発生し、その状態で左移動しようとした場合は移動不要
        if (preLeft < minLeft) {
            left = preLeft;
        }
        // 最小範囲(左移動の最大)
        else if (left < minLeft) {
            left = minLeft;
        }
    }

    // 変更がある場合
    if (left != preLeft) {
        // アニメーション確認
        if (animate == true) {
            // 表示位置更新(終了後「メニュー領域オーバーレイ処理」呼び出し)
            $("#SearchMenu-Command-View").animate({ "left": left + margin + "px" }, "normal", "swing", SearchMenu_Overlay);
        }
        else {
            // 表示位置更新
            $("#SearchMenu-Command-View").css("left", left + margin + "px");

            // メニュー領域オーバーレイ処理
            SearchMenu_Overlay();
        }
    }

    // サブメニューキャンセル処理
    SearchMenu_Cancel();
}

// メニュー領域オーバーレイ処理
function SearchMenu_Overlay() {
    // 表示位置更新
    var $right = $("#SearchMenu-Command-View-Overlay-Right");
    $right.css("left", $("#SearchMenu-Command").width() - $right.width() + "px");

    // 左側表示更新
    if (parseInt($("#SearchMenu-Command-View").css("left")) != parseInt($("#SearchMenu-Command-View").data("margin"))) {
        $("#SearchMenu-Command-View-Overlay-Left").show();
    }
    else {
        $("#SearchMenu-Command-View-Overlay-Left").hide();
    }

    // 右側表示更新
    if ($("#SearchMenu-Command-View").data("width") != $("#SearchMenu-Command-View").width()) {
        $("#SearchMenu-Command-View-Overlay-Right").show();
    }
    else {
        $("#SearchMenu-Command-View-Overlay-Right").hide();
    }
}

// サブメニューキャンセル処理
function SearchMenu_Cancel() {
    SearchMenuCommand_Menu_Cancel();
    SearchMenuCommand_Option_Cancel();
    SearchMenuInput_HospitalName_Side_Cancel();
    SearchMenuInput_StudyDate_Side_Cancel();
    SearchMenuInput_StudyDateTime_Side_Cancel();
    SearchMenuInput_Modality_Side_Cancel();
    SearchMenuInput_UploadDate_Side_Cancel();
    SearchMenuInput_UploadDateTime_Side_Cancel();
    SearchMenuInput_Keyword_Side_Cancel();
}
