/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 初期化処理
function SearchMenuInput_Init() {
    // 病院名ボタン作成
    var $subHospital = $("#SearchMenu-Input-Sub-HospitalName");
    var ids = new Array();
    $.each($("#ViewerConfig").data("Hospital"), function () {
        $subHospital.append(
            $("<div>").addClass("SearchMenu-Input-Sub-HospitalName-Item")
                      .text(this.Name)
                      .data("ID", this.ID));
        ids.push(this.ID);
    });
    $subHospital.append(
        $("<div>").addClass("SearchMenu-Input-Sub-HospitalName-Item")
                  .text("全て")
                  .data("ID", ids));

    // 病院名ボタン初期値設定
    $("#SearchMenu-Input-HospitalName").val($subHospital.children().eq(0).text())
                                       .data("ID", $subHospital.children().eq(0).data("ID"));
    if ($("#ViewerConfig").data("Hospital").length < 2) {
        // 複数病院無い場合は非表示
        $(".StudyList-Body-HospitalName").hide();
    }

    // 検査日付ボタン作成
    var listStudyDate = $("#ViewerConfig").data("StudyDate");
    if (listStudyDate != "") {
        var $subStudyDate = $("#SearchMenu-Input-Sub-StudyDate");
        $.each(listStudyDate.split(","), function () {
            var params = Common_ParseUrlParams(this, true);
            if ("title" in params && "date" in params) {
                $subStudyDate.append(
                    $("<div>").addClass("SearchMenu-Input-Sub-StudyDate-Item")
                              .text(decodeURIComponent(params["title"]))
                              .data("date", decodeURIComponent(params["date"])));
            }
        });
    }
    else {
        $("#SearchMenu-Input-StudyDate-View").removeClass("SearchMenu-Input-Side-Enable").addClass("SearchMenu-Input-Side-Disable");
        $("#SearchMenu-Input-StudyDate-Side").hide();
    }

    // 検査日時ボタン作成
    var listStudyDateTime = $("#ViewerConfig").data("StudyDate");
    if (listStudyDateTime != "") {
        var $subStudyDateTime = $("#SearchMenu-Input-Sub-StudyDateTime");
        $.each(listStudyDateTime.split(","), function () {
            var params = Common_ParseUrlParams(this, true);
            if ("title" in params && "date" in params) {
                $subStudyDateTime.append(
                    $("<div>").addClass("SearchMenu-Input-Sub-StudyDateTime-Item")
                              .text(decodeURIComponent(params["title"]))
                              .data("date", decodeURIComponent(params["date"])));
            }
        });
    }
    else {
        $("#SearchMenu-Input-StudyDateTime-View").removeClass("SearchMenu-Input-Side-Enable").addClass("SearchMenu-Input-Side-Disable");
        $("#SearchMenu-Input-StudyDateTime-Side").hide();
    }

    // モダリティボタン作成
    var listModality = $("#ViewerConfig").data("Modality");
    if (listModality != "") {
        var $subModality = $("#SearchMenu-Input-Sub-Modality");
        $.each(listModality.split(","), function () {
            $subModality.append(
                $("<div>").addClass("SearchMenu-Input-Sub-Modality-Item")
                          .text(this.toString()));
        });
    }
    else {
        $("#SearchMenu-Input-Modality-View").removeClass("SearchMenu-Input-Side-Enable").addClass("SearchMenu-Input-Side-Disable");
        $("#SearchMenu-Input-Modality-Side").hide();
    }

    // 登録日付ボタン作成
    var listUploadDate = $("#ViewerConfig").data("StudyDate");
    if (listUploadDate != "") {
        var $subUploadDate = $("#SearchMenu-Input-Sub-UploadDate");
        $.each(listUploadDate.split(","), function () {
            var params = Common_ParseUrlParams(this, true);
            if ("title" in params && "date" in params) {
                $subUploadDate.append(
                    $("<div>").addClass("SearchMenu-Input-Sub-UploadDate-Item")
                              .text(decodeURIComponent(params["title"]))
                              .data("date", decodeURIComponent(params["date"])));
            }
        });
    }
    else {
        $("#SearchMenu-Input-UploadDate-View").removeClass("SearchMenu-Input-Side-Enable").addClass("SearchMenu-Input-Side-Disable");
        $("#SearchMenu-Input-UploadDate-Side").hide();
    }

    // 登録日時ボタン作成
    var listUploadDateTime = $("#ViewerConfig").data("StudyDate");
    if (listUploadDateTime != "") {
        var $subUploadDateTime = $("#SearchMenu-Input-Sub-UploadDateTime");
        $.each(listUploadDateTime.split(","), function () {
            var params = Common_ParseUrlParams(this, true);
            if ("title" in params && "date" in params) {
                $subUploadDateTime.append(
                    $("<div>").addClass("SearchMenu-Input-Sub-UploadDateTime-Item")
                              .text(decodeURIComponent(params["title"]))
                              .data("date", decodeURIComponent(params["date"])));
            }
        });
    }
    else {
        $("#SearchMenu-Input-UploadDateTime-View").removeClass("SearchMenu-Input-Side-Enable").addClass("SearchMenu-Input-Side-Disable");
        $("#SearchMenu-Input-UploadDateTime-Side").hide();
    }

    // キーワードボタン作成
    var listKeyword = $("#ViewerConfig").data("Keyword");
    if (listKeyword != "") {
        var $subKeyword = $("#SearchMenu-Input-Sub-Keyword");
        $.each(listKeyword.split(","), function () {
            $subKeyword.append(
                $("<div>").addClass("SearchMenu-Input-Sub-Keyword-Item")
                          .text(this.toString()));
        });
    }
    else {
        $("#SearchMenu-Input-Keyword-View").removeClass("SearchMenu-Input-Side-Enable").addClass("SearchMenu-Input-Side-Disable");
        $("#SearchMenu-Input-Keyword-Side").hide();
    }

    // 検索パラメータ初期値設定
    var defParams = Common_ParseUrlParams($("#ViewerConfig").data("DefSearch"), true);
    if ("hospid" in defParams) {
        //空の場合は全てを選択する
        if (defParams["hospid"] == "") {
            // 病院名ボタン設定処理
            SearchMenuInput_HospitalName_Set(ids);
        }
        else {
            // 病院名ボタン設定処理
            SearchMenuInput_HospitalName_Set(defParams["hospid"]);
        }
    }
    if ("date" in defParams) {
        if ($("#SearchMenu-Input-StudyDate").length != 0) {
            $("#SearchMenu-Input-StudyDate").val(defParams["date"]);
        }
        else if ($("#SearchMenu-Input-StudyDateTime").length != 0) {
            $("#SearchMenu-Input-StudyDateTime").val(defParams["date"]);
        }
    }
    if ("patid" in defParams) {
        $("#SearchMenu-Input-PatientID").val(defParams["patid"]);
    }
    if ("patname" in defParams) {
        $("#SearchMenu-Input-PatientsName").val(defParams["patname"]);
    }
    if ("mod" in defParams) {
        $("#SearchMenu-Input-Modality").val(defParams["mod"]);
    }
    if ("upload" in defParams) {
        if ($("#SearchMenu-Input-UploadDate").length != 0) {
            $("#SearchMenu-Input-UploadDate").val(defParams["upload"]);
        }
        else if ($("#SearchMenu-Input-UploadDateTime").length != 0) {
            $("#SearchMenu-Input-UploadDateTime").val(defParams["upload"]);
        }
    }
    if ("accno" in defParams) {
        $("#SearchMenu-Input-AccessionNumber").val(defParams["accno"]);
    }
    if ("keyword" in defParams) {
        $("#SearchMenu-Input-Keyword").val(defParams["keyword"]);
    }
    if ("comment" in defParams) {
        $("#SearchMenu-Input-Comment").val(defParams["comment"]);
    }

    // URLコールで呼ばれた場合
    if ($("#ViewerConfig").data("login") == "2") {
        //空の場合は全てを選択する
        if ($("#ViewerConfig").data("prmhospitalid") == "") {
            // 病院名ボタン設定処理
            SearchMenuInput_HospitalName_Set(ids);
        }
        else {
            // 病院名ボタン設定処理
            SearchMenuInput_HospitalName_Set($("#ViewerConfig").data("prmhospitalid"));
        }
        if ($("#ViewerConfig").data("prmpatientid")) {
            $("#SearchMenu-Input-PatientID").val($("#ViewerConfig").data("prmpatientid")).attr("disabled", "disabled");
        }
        if ($("#ViewerConfig").data("prmmodality")) {
            $("#SearchMenu-Input-Modality").val($("#ViewerConfig").data("prmmodality")).attr("disabled", "disabled");
        }
        if ($("#ViewerConfig").data("prmdate")) {
            if ($("#SearchMenu-Input-StudyDate").length != 0) {
                $("#SearchMenu-Input-StudyDate").val($("#ViewerConfig").data("prmdate")).attr("disabled", "disabled");
            }
            else if ($("#SearchMenu-Input-StudyDateTime").length != 0) {
                $("#SearchMenu-Input-StudyDateTime").val($("#ViewerConfig").data("prmdate")).attr("disabled", "disabled");
            }
        }
        if ($("#ViewerConfig").data("prmaccessionno")) {
            $("#SearchMenu-Input-AccessionNumber").val($("#ViewerConfig").data("prmaccessionno")).attr("disabled", "disabled");
        }
    }

    // 病院名ボタンクリックイベント設定
    $("#SearchMenu-Input-HospitalName-Side").on({
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

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-HospitalName").is(":visible")) {
                // 病院名ボタンキャンセル処理
                SearchMenuInput_HospitalName_Side_Cancel();
                return;
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
                    // 病院名ボタンクリック処理
                    SearchMenuInput_HospitalName_Side_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-HospitalName").is(":visible")) {
                // 病院名ボタンキャンセル処理
                SearchMenuInput_HospitalName_Side_Cancel();
                return;
            }

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
                    // 病院名ボタンクリック処理
                    SearchMenuInput_HospitalName_Side_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 病院名ボタンクリックイベント設定(サブメニュー)
    $("#SearchMenu-Input-Sub-HospitalName").on({
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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-HospitalName-Item-ON");

            // 初期タッチ位置登録
            var point = e.originalEvent.touches[0].pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offset = e.originalEvent.touches[0].pageY - point;

                    // タッチ位置更新
                    point = e.originalEvent.touches[0].pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-HospitalName").scrollTop($("#SearchMenu-Input-Sub-HospitalName").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-HospitalName-Item-ON");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // 病院名ボタンクリック処理(サブメニュー)
                    SearchMenuInput_HospitalName_SideSub_Click($this);

                    // 病院名ボタンキャンセル処理
                    SearchMenuInput_HospitalName_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-HospitalName-Item-ON");

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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-HospitalName-Item-ON");

            // 初期マウス位置登録
            var point = e.pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offset = e.pageY - point;

                    // マウス位置更新
                    point = e.pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-HospitalName").scrollTop($("#SearchMenu-Input-Sub-HospitalName").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-HospitalName-Item-ON");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && !pointInfo.IsDrag) {
                    // 病院名ボタンクリック処理(サブメニュー)
                    SearchMenuInput_HospitalName_SideSub_Click($this);

                    // 病院名ボタンキャンセル処理
                    SearchMenuInput_HospitalName_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-HospitalName-Item-ON");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Input-Sub-HospitalName-Item");

    // 検査日付ボタンクリックイベント設定
    $("#SearchMenu-Input-StudyDate-Side").on({
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

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-StudyDate").is(":visible")) {
                // 検査日付ボタンキャンセル処理
                SearchMenuInput_StudyDate_Side_Cancel();
                return;
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
                    // 検査日付ボタンクリック処理
                    SearchMenuInput_StudyDate_Side_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-StudyDate").is(":visible")) {
                // 検査日付ボタンキャンセル処理
                SearchMenuInput_StudyDate_Side_Cancel();
                return;
            }

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
                    // 検査日付ボタンクリック処理
                    SearchMenuInput_StudyDate_Side_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 検査日付ボタンクリックイベント設定(サブメニュー)
    $("#SearchMenu-Input-Sub-StudyDate").on({
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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-StudyDate-Item-ON");

            // 初期タッチ位置登録
            var point = e.originalEvent.touches[0].pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offset = e.originalEvent.touches[0].pageY - point;

                    // タッチ位置更新
                    point = e.originalEvent.touches[0].pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-StudyDate").scrollTop($("#SearchMenu-Input-Sub-StudyDate").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-StudyDate-Item-ON");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // 検査日付ボタンクリック処理(サブメニュー)
                    SearchMenuInput_StudyDate_SideSub_Click($this);

                    // 検査日付ボタンキャンセル処理
                    SearchMenuInput_StudyDate_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-StudyDate-Item-ON");

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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-StudyDate-Item-ON");

            // 初期マウス位置登録
            var point = e.pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offset = e.pageY - point;

                    // マウス位置更新
                    point = e.pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-StudyDate").scrollTop($("#SearchMenu-Input-Sub-StudyDate").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-StudyDate-Item-ON");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && !pointInfo.IsDrag) {
                    // 検査日付ボタンクリック処理(サブメニュー)
                    SearchMenuInput_StudyDate_SideSub_Click($this);

                    // 検査日付ボタンキャンセル処理
                    SearchMenuInput_StudyDate_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-StudyDate-Item-ON");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Input-Sub-StudyDate-Item");

    // 検査日時ボタンクリックイベント設定
    $("#SearchMenu-Input-StudyDateTime-Side").on({
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

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-StudyDateTime").is(":visible")) {
                // 検査日時ボタンキャンセル処理
                SearchMenuInput_StudyDateTime_Side_Cancel();
                return;
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
                    // 検査日時ボタンクリック処理
                    SearchMenuInput_StudyDateTime_Side_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-StudyDateTime").is(":visible")) {
                // 検査日時ボタンキャンセル処理
                SearchMenuInput_StudyDateTime_Side_Cancel();
                return;
            }

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
                    // 検査日時ボタンクリック処理
                    SearchMenuInput_StudyDateTime_Side_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 検査日時ボタンクリックイベント設定(サブメニュー)
    $("#SearchMenu-Input-Sub-StudyDateTime").on({
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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-StudyDateTime-Item-ON");

            // 初期タッチ位置登録
            var point = e.originalEvent.touches[0].pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offset = e.originalEvent.touches[0].pageY - point;

                    // タッチ位置更新
                    point = e.originalEvent.touches[0].pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-StudyDateTime").scrollTop($("#SearchMenu-Input-Sub-StudyDateTime").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-StudyDateTime-Item-ON");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // 検査日時ボタンクリック処理(サブメニュー)
                    SearchMenuInput_StudyDateTime_SideSub_Click($this);

                    // 検査日時ボタンキャンセル処理
                    SearchMenuInput_StudyDateTime_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-StudyDateTime-Item-ON");

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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-StudyDateTime-Item-ON");

            // 初期マウス位置登録
            var point = e.pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offset = e.pageY - point;

                    // マウス位置更新
                    point = e.pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-StudyDateTime").scrollTop($("#SearchMenu-Input-Sub-StudyDateTime").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-StudyDateTime-Item-ON");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && !pointInfo.IsDrag) {
                    // 検査日時ボタンクリック処理(サブメニュー)
                    SearchMenuInput_StudyDateTime_SideSub_Click($this);

                    // 検査日時ボタンキャンセル処理
                    SearchMenuInput_StudyDateTime_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-StudyDateTime-Item-ON");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Input-Sub-StudyDateTime-Item");

    // モダリティボタンクリックイベント設定
    $("#SearchMenu-Input-Modality-Side").on({
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

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-Modality").is(":visible")) {
                // モダリティボタンキャンセル処理
                SearchMenuInput_Modality_Side_Cancel();
                return;
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
                    // モダリティボタンクリック処理
                    SearchMenuInput_Modality_Side_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-Modality").is(":visible")) {
                // モダリティボタンキャンセル処理
                SearchMenuInput_Modality_Side_Cancel();
                return;
            }

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
                    // モダリティボタンクリック処理
                    SearchMenuInput_Modality_Side_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // モダリティボタンクリックイベント設定(サブメニュー)
    $("#SearchMenu-Input-Sub-Modality").on({
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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-Modality-Item-ON");

            // 初期タッチ位置登録
            var point = e.originalEvent.touches[0].pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offset = e.originalEvent.touches[0].pageY - point;

                    // タッチ位置更新
                    point = e.originalEvent.touches[0].pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-Modality").scrollTop($("#SearchMenu-Input-Sub-Modality").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-Modality-Item-ON");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // モダリティボタンクリック処理(サブメニュー)
                    SearchMenuInput_Modality_SideSub_Click($this);

                    // モダリティボタンキャンセル処理
                    SearchMenuInput_Modality_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-Modality-Item-ON");

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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-Modality-Item-ON");

            // 初期マウス位置登録
            var point = e.pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offset = e.pageY - point;

                    // マウス位置更新
                    point = e.pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-Modality").scrollTop($("#SearchMenu-Input-Sub-Modality").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-Modality-Item-ON");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && !pointInfo.IsDrag) {
                    // モダリティボタンクリック処理(サブメニュー)
                    SearchMenuInput_Modality_SideSub_Click($this);

                    // モダリティボタンキャンセル処理
                    SearchMenuInput_Modality_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-Modality-Item-ON");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Input-Sub-Modality-Item");

    // 登録日付ボタンクリックイベント設定
    $("#SearchMenu-Input-UploadDate-Side").on({
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

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-UploadDate").is(":visible")) {
                // 登録日付ボタンキャンセル処理
                SearchMenuInput_UploadDate_Side_Cancel();
                return;
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
                    // 登録日付ボタンクリック処理
                    SearchMenuInput_UploadDate_Side_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-UploadDate").is(":visible")) {
                // 登録日付ボタンキャンセル処理
                SearchMenuInput_UploadDate_Side_Cancel();
                return;
            }

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
                    // 登録日付ボタンクリック処理
                    SearchMenuInput_UploadDate_Side_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 登録日付ボタンクリックイベント設定(サブメニュー)
    $("#SearchMenu-Input-Sub-UploadDate").on({
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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-UploadDate-Item-ON");

            // 初期タッチ位置登録
            var point = e.originalEvent.touches[0].pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offset = e.originalEvent.touches[0].pageY - point;

                    // タッチ位置更新
                    point = e.originalEvent.touches[0].pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-UploadDate").scrollTop($("#SearchMenu-Input-Sub-UploadDate").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-UploadDate-Item-ON");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // 登録日付ボタンクリック処理(サブメニュー)
                    SearchMenuInput_UploadDate_SideSub_Click($this);

                    // 登録日付ボタンキャンセル処理
                    SearchMenuInput_UploadDate_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-UploadDate-Item-ON");

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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-UploadDate-Item-ON");

            // 初期マウス位置登録
            var point = e.pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offset = e.pageY - point;

                    // マウス位置更新
                    point = e.pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-UploadDate").scrollTop($("#SearchMenu-Input-Sub-UploadDate").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-UploadDate-Item-ON");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && !pointInfo.IsDrag) {
                    // 登録日付ボタンクリック処理(サブメニュー)
                    SearchMenuInput_UploadDate_SideSub_Click($this);

                    // 登録日付ボタンキャンセル処理
                    SearchMenuInput_UploadDate_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-UploadDate-Item-ON");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Input-Sub-UploadDate-Item");

    // 登録日時ボタンクリックイベント設定
    $("#SearchMenu-Input-UploadDateTime-Side").on({
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

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-UploadDateTime").is(":visible")) {
                // 登録日時ボタンキャンセル処理
                SearchMenuInput_UploadDateTime_Side_Cancel();
                return;
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
                    // 登録日時ボタンクリック処理
                    SearchMenuInput_UploadDateTime_Side_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-UploadDateTime").is(":visible")) {
                // 登録日時ボタンキャンセル処理
                SearchMenuInput_UploadDateTime_Side_Cancel();
                return;
            }

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
                    // 登録日時ボタンクリック処理
                    SearchMenuInput_UploadDateTime_Side_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 登録日時ボタンクリックイベント設定(サブメニュー)
    $("#SearchMenu-Input-Sub-UploadDateTime").on({
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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-UploadDateTime-Item-ON");

            // 初期タッチ位置登録
            var point = e.originalEvent.touches[0].pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offset = e.originalEvent.touches[0].pageY - point;

                    // タッチ位置更新
                    point = e.originalEvent.touches[0].pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-UploadDateTime").scrollTop($("#SearchMenu-Input-Sub-UploadDateTime").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-UploadDateTime-Item-ON");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // 登録日時ボタンクリック処理(サブメニュー)
                    SearchMenuInput_UploadDateTime_SideSub_Click($this);

                    // 登録日時ボタンキャンセル処理
                    SearchMenuInput_UploadDateTime_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-UploadDateTime-Item-ON");

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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-UploadDateTime-Item-ON");

            // 初期マウス位置登録
            var point = e.pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offset = e.pageY - point;

                    // マウス位置更新
                    point = e.pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-UploadDateTime").scrollTop($("#SearchMenu-Input-Sub-UploadDateTime").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-UploadDateTime-Item-ON");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && !pointInfo.IsDrag) {
                    // 登録日時ボタンクリック処理(サブメニュー)
                    SearchMenuInput_UploadDateTime_SideSub_Click($this);

                    // 登録日時ボタンキャンセル処理
                    SearchMenuInput_UploadDateTime_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-UploadDateTime-Item-ON");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Input-Sub-UploadDateTime-Item");

    // キーワードボタンクリックイベント設定
    $("#SearchMenu-Input-Keyword-Side").on({
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

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-Keyword").is(":visible")) {
                // キーワードボタンキャンセル処理
                SearchMenuInput_Keyword_Side_Cancel();
                return;
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
                    // キーワードボタンクリック処理
                    SearchMenuInput_Keyword_Side_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // Ajax通信中は処理しない
            if (SearchWindow_IsAjaxSend() == true) {
                return false;
            }

            // 選択状態の場合
            if ($("#SearchMenu-Input-Sub-Keyword").is(":visible")) {
                // キーワードボタンキャンセル処理
                SearchMenuInput_Keyword_Side_Cancel();
                return;
            }

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
                    // キーワードボタンクリック処理
                    SearchMenuInput_Keyword_Side_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // キーワードボタンクリックイベント設定(サブメニュー)
    $("#SearchMenu-Input-Sub-Keyword").on({
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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-Keyword-Item-ON");

            // 初期タッチ位置登録
            var point = e.originalEvent.touches[0].pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offset = e.originalEvent.touches[0].pageY - point;

                    // タッチ位置更新
                    point = e.originalEvent.touches[0].pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-Keyword").scrollTop($("#SearchMenu-Input-Sub-Keyword").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-Keyword-Item-ON");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // キーワードボタンクリック処理(サブメニュー)
                    SearchMenuInput_Keyword_SideSub_Click($this);

                    // キーワードボタンキャンセル処理
                    SearchMenuInput_Keyword_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-Keyword-Item-ON");

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

            // 選択状態
            $this.addClass("SearchMenu-Input-Sub-Keyword-Item-ON");

            // 初期マウス位置登録
            var point = e.pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offset = e.pageY - point;

                    // マウス位置更新
                    point = e.pageY;

                    // 縦スクロール更新
                    $("#SearchMenu-Input-Sub-Keyword").scrollTop($("#SearchMenu-Input-Sub-Keyword").scrollTop() - offset);

                    // 位置情報更新後、ドラッグ状態の場合
                    if (pointInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Input-Sub-Keyword-Item-ON");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && !pointInfo.IsDrag) {
                    // キーワードボタンクリック処理(サブメニュー)
                    SearchMenuInput_Keyword_SideSub_Click($this);

                    // キーワードボタンキャンセル処理
                    SearchMenuInput_Keyword_Side_Cancel();

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Input-Sub-Keyword-Item-ON");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Input-Sub-Keyword-Item");

    // 入力項目キーイベント設定
    $("#SearchMenu-Input-HospitalName," +
      "#SearchMenu-Input-StudyDate," +
      "#SearchMenu-Input-StudyDateTime," +
      "#SearchMenu-Input-PatientID," +
      "#SearchMenu-Input-PatientsName," +
      "#SearchMenu-Input-Modality," +
      "#SearchMenu-Input-AccessionNumber," +
      "#SearchMenu-Input-UploadDate," +
      "#SearchMenu-Input-UploadDateTime," +
      "#SearchMenu-Input-Keyword," +
      "#SearchMenu-Input-Comment").on({
          // キーダウンイベント設定
          "keydown": function () {
              var $this = $(this);

              // Ajax通信中は処理しない
              if (SearchWindow_IsAjaxSend() == true) {
                  return false;
              }

              // IME状態初期化
              var isIME = true;

              // イベント設定
              $this.on({
                  // キープレスイベント設定
                  "keypress": function () {
                      // IME状態更新
                      isIME = false;
                  },
                  // キーアップイベント設定
                  "keyup": function (e) {
                      // Enterの場合
                      if (e.keyCode == 13 && !isIME) {
                          // 入力中をキャンセルするためフォーカスを外す
                          $(":input").blur();

                          // 検索ボタンクリック処理
                          SearchMenu_Search_Button_Click();
                      }

                      // マウスイベント解除
                      $this.off("keypress keyup");
                  }
              });
          },
          // 入力項目フォーカスイベント設定
          "focus": function () {
              // サブメニューキャンセル処理
              SearchMenu_Cancel();
          }
      });
}

// 病院名ボタンクリック処理
function SearchMenuInput_HospitalName_Side_Click() {
    // 未選択状態の場合
    if ($("#SearchMenu-Input-Sub-HospitalName").is(":hidden")) {
        // サブメニューキャンセル処理
        SearchMenu_Cancel();

        // 表示処理
        SearchMenuInput_HospitalName_SideSub_Show();
    }
    // 選択状態の場合
    else {
        // キャンセル処理
        SearchMenuInput_HospitalName_Side_Cancel();
    }
}

// 病院名ボタンキャンセル処理
function SearchMenuInput_HospitalName_Side_Cancel() {
    // アイコン変更
    $("#SearchMenu-Input-Sub-HospitalName").hide();
}

// 病院名ボタン表示処理(サブメニュー)
function SearchMenuInput_HospitalName_SideSub_Show() {
    // 前回のスクロールバーの補正を削除
    $("#SearchMenu-Input-Sub-HospitalName").css("height", "");
    $("#SearchMenu-Input-Sub-HospitalName").css("width", "");

    // サブメニュー表示位置補正表示
    var offset;
    var width = $("#SearchMenu-Input-Sub-HospitalName").width();
    if ($("#SearchMenu-Input-HospitalName").width() + $("#SearchMenu-Input-HospitalName-Side").width() > width) {
        // ボタンの右側にそろえて表示
        offset = $("#SearchMenu-Input-HospitalName-Side").offset();
        $("#SearchMenu-Input-Sub-HospitalName").css({ left: offset.left + 22 - width, top: offset.top + 24 })
                                               .show();
    }
    else {
        // 入力部の左側にそろえて表示
        offset = $("#SearchMenu-Input-HospitalName").offset();
        $("#SearchMenu-Input-Sub-HospitalName").css({ left: offset.left, top: offset.top + 24 })
                                               .show();
    }

    // スクロールバーの補正
    if ($("#SearchMenu-Input-Sub-HospitalName").offset().top + $("#SearchMenu-Input-Sub-HospitalName").height() > $(window).height()) {
        // サブメニュー表示の高さを補正
        $("#SearchMenu-Input-Sub-HospitalName").height($(window).height() - $("#SearchMenu-Input-Sub-HospitalName").offset().top - 3);

        // スクロールーバー分幅が変更されない場合補正する
        if ($("#SearchMenu-Input-Sub-HospitalName").width() == width) {
            $("#SearchMenu-Input-Sub-HospitalName").width($("#SearchMenu-Input-Sub-HospitalName").width() + $("#ViewerConfig").data("ScrollBarWidth"));
        }
    }
}

// 病院名ボタンクリック処理(サブメニュー)
function SearchMenuInput_HospitalName_SideSub_Click($this) {
    // 病院名設定
    $("#SearchMenu-Input-HospitalName").val($this.text())
                                       .data("ID", $this.data("ID"))
                                       .focus()
                                       .scrollLeft(0);
}

// 病院名ボタン設定処理
function SearchMenuInput_HospitalName_Set(id) {
    // IDより該当データを検索
    var $obj = null;
    $.each($(".SearchMenu-Input-Sub-HospitalName-Item"), function () {
        if ($(this).data("ID") == id) {
            $obj = $(this);
            return false;
        }
    });
    if ($obj == null) {
        return;
    }

    // 病院名設定
    $("#SearchMenu-Input-HospitalName").val($obj.text())
                                       .data("ID", $obj.data("ID"))
                                       .scrollLeft(0);
}

// 検査日付ボタンクリック処理
function SearchMenuInput_StudyDate_Side_Click() {
    // 未選択状態の場合
    if ($("#SearchMenu-Input-Sub-StudyDate").is(":hidden")) {
        // サブメニューキャンセル処理
        SearchMenu_Cancel();

        // 表示処理
        SearchMenuInput_StudyDate_SideSub_Show();
    }
    // 選択状態の場合
    else {
        // キャンセル処理
        SearchMenuInput_StudyDate_Side_Cancel();
    }
}

// 検査日付ボタンキャンセル処理
function SearchMenuInput_StudyDate_Side_Cancel() {
    // アイコン変更
    $("#SearchMenu-Input-Sub-StudyDate").hide();
}

// 検査日付ボタン表示処理(サブメニュー)
function SearchMenuInput_StudyDate_SideSub_Show() {
    // 前回のスクロールバーの補正を削除
    $("#SearchMenu-Input-Sub-StudyDate").css("height", "");
    $("#SearchMenu-Input-Sub-StudyDate").css("width", "");

    // サブメニュー表示位置補正表示
    var offset = $("#SearchMenu-Input-StudyDate-Side").offset();
    var width = $("#SearchMenu-Input-Sub-StudyDate").width();
    $("#SearchMenu-Input-Sub-StudyDate").css({ left: offset.left + 22 - width, top: offset.top + 24 })
                                        .show();

    // スクロールバーの補正
    if ($("#SearchMenu-Input-Sub-StudyDate").offset().top + $("#SearchMenu-Input-Sub-StudyDate").height() > $(window).height()) {
        // サブメニュー表示の高さを補正
        $("#SearchMenu-Input-Sub-StudyDate").height($(window).height() - $("#SearchMenu-Input-Sub-StudyDate").offset().top - 3);

        // スクロールーバー分幅が変更されない場合補正する
        if ($("#SearchMenu-Input-Sub-StudyDate").width() == width) {
            $("#SearchMenu-Input-Sub-StudyDate").width($("#SearchMenu-Input-Sub-StudyDate").width() + $("#ViewerConfig").data("ScrollBarWidth"));
        }
    }
}

// 検査日付ボタンクリック処理(サブメニュー)
function SearchMenuInput_StudyDate_SideSub_Click($this) {
    if ($("#SearchMenu-Input-StudyDate").is(":enabled")) {
        // 検査日付設定
        $("#SearchMenu-Input-StudyDate").val($this.text())
                                        .focus()
                                        .scrollLeft(0);
    }
}

// 検査日時ボタンクリック処理
function SearchMenuInput_StudyDateTime_Side_Click() {
    // 未選択状態の場合
    if ($("#SearchMenu-Input-Sub-StudyDateTime").is(":hidden")) {
        // サブメニューキャンセル処理
        SearchMenu_Cancel();

        // 表示処理
        SearchMenuInput_StudyDateTime_SideSub_Show();
    }
        // 選択状態の場合
    else {
        // キャンセル処理
        SearchMenuInput_StudyDateTime_Side_Cancel();
    }
}

// 検査日時ボタンキャンセル処理
function SearchMenuInput_StudyDateTime_Side_Cancel() {
    // アイコン変更
    $("#SearchMenu-Input-Sub-StudyDateTime").hide();
}

// 検査日時ボタン表示処理(サブメニュー)
function SearchMenuInput_StudyDateTime_SideSub_Show() {
    // 前回のスクロールバーの補正を削除
    $("#SearchMenu-Input-Sub-StudyDateTime").css("height", "");
    $("#SearchMenu-Input-Sub-StudyDateTime").css("width", "");

    // サブメニュー表示位置補正表示
    var offset = $("#SearchMenu-Input-StudyDateTime-Side").offset();
    var width = $("#SearchMenu-Input-Sub-StudyDateTime").width();
    $("#SearchMenu-Input-Sub-StudyDateTime").css({ left: offset.left + 22 - width, top: offset.top + 24 })
                                            .show();

    // スクロールバーの補正
    if ($("#SearchMenu-Input-Sub-StudyDateTime").offset().top + $("#SearchMenu-Input-Sub-StudyDateTime").height() > $(window).height()) {
        // サブメニュー表示の高さを補正
        $("#SearchMenu-Input-Sub-StudyDateTime").height($(window).height() - $("#SearchMenu-Input-Sub-StudyDateTime").offset().top - 3);

        // スクロールーバー分幅が変更されない場合補正する
        if ($("#SearchMenu-Input-Sub-StudyDateTime").width() == width) {
            $("#SearchMenu-Input-Sub-StudyDateTime").width($("#SearchMenu-Input-Sub-StudyDateTime").width() + $("#ViewerConfig").data("ScrollBarWidth"));
        }
    }
}

// 検査日時ボタンクリック処理(サブメニュー)
function SearchMenuInput_StudyDateTime_SideSub_Click($this) {
    if ($("#SearchMenu-Input-StudyDateTime").is(":enabled")) {
        // 検査日付設定
        $("#SearchMenu-Input-StudyDateTime").val($this.text())
                                            .focus()
                                            .scrollLeft(0);
    }
}

// モダリティボタンクリック処理
function SearchMenuInput_Modality_Side_Click() {
    // 未選択状態の場合
    if ($("#SearchMenu-Input-Sub-Modality").is(":hidden")) {
        // サブメニューキャンセル処理
        SearchMenu_Cancel();

        // 表示処理
        SearchMenuInput_Modality_SideSub_Show();
    }
    // 選択状態の場合
    else {
        // キャンセル処理
        SearchMenuInput_Modality_Side_Cancel();
    }
}

// モダリティボタンキャンセル処理
function SearchMenuInput_Modality_Side_Cancel() {
    // アイコン変更
    $("#SearchMenu-Input-Sub-Modality").hide();
}

// モダリティボタン表示処理(サブメニュー)
function SearchMenuInput_Modality_SideSub_Show() {
    // 前回のスクロールバーの補正を削除
    $("#SearchMenu-Input-Sub-Modality").css("height", "");
    $("#SearchMenu-Input-Sub-Modality").css("width", "");

    // サブメニュー表示位置補正表示
    var offset = $("#SearchMenu-Input-Modality-Side").offset();
    var width = $("#SearchMenu-Input-Sub-Modality").width();
    $("#SearchMenu-Input-Sub-Modality").css({ left: offset.left + 22 - width, top: offset.top + 24 })
                                       .show();

    // スクロールバーの補正
    if ($("#SearchMenu-Input-Sub-Modality").offset().top + $("#SearchMenu-Input-Sub-Modality").height() > $(window).height()) {
        // サブメニュー表示の高さを補正
        $("#SearchMenu-Input-Sub-Modality").height($(window).height() - $("#SearchMenu-Input-Sub-Modality").offset().top - 3);

        // スクロールーバー分幅が変更されない場合補正する
        if ($("#SearchMenu-Input-Sub-Modality").width() == width) {
            $("#SearchMenu-Input-Sub-Modality").width($("#SearchMenu-Input-Sub-Modality").width() + $("#ViewerConfig").data("ScrollBarWidth"));
        }
    }
}

// モダリティボタンクリック処理(サブメニュー)
function SearchMenuInput_Modality_SideSub_Click($this) {
    if ($("#SearchMenu-Input-Modality").is(":enabled")) {
        // モダリティ設定
        $("#SearchMenu-Input-Modality").val($this.text())
                                       .focus()
                                       .scrollLeft(0);
    }
}

// 登録日付ボタンクリック処理
function SearchMenuInput_UploadDate_Side_Click() {
    // 未選択状態の場合
    if ($("#SearchMenu-Input-Sub-UploadDate").is(":hidden")) {
        // サブメニューキャンセル処理
        SearchMenu_Cancel();

        // 表示処理
        SearchMenuInput_UploadDate_SideSub_Show();
    }
    // 選択状態の場合
    else {
        // キャンセル処理
        SearchMenuInput_UploadDate_Side_Cancel();
    }
}

// 登録日付ボタンキャンセル処理
function SearchMenuInput_UploadDate_Side_Cancel() {
    // アイコン変更
    $("#SearchMenu-Input-Sub-UploadDate").hide();
}

// 登録日付ボタン表示処理(サブメニュー)
function SearchMenuInput_UploadDate_SideSub_Show() {
    // 前回のスクロールバーの補正を削除
    $("#SearchMenu-Input-Sub-UploadDate").css("height", "");
    $("#SearchMenu-Input-Sub-UploadDate").css("width", "");

    // サブメニュー表示位置補正表示
    var offset = $("#SearchMenu-Input-UploadDate-Side").offset();
    var width = $("#SearchMenu-Input-Sub-UploadDate").width();
    $("#SearchMenu-Input-Sub-UploadDate").css({ left: offset.left + 22 - width, top: offset.top + 24 })
                                         .show();

    // スクロールバーの補正
    if ($("#SearchMenu-Input-Sub-UploadDate").offset().top + $("#SearchMenu-Input-Sub-UploadDate").height() > $(window).height()) {
        // サブメニュー表示の高さを補正
        $("#SearchMenu-Input-Sub-UploadDate").height($(window).height() - $("#SearchMenu-Input-Sub-UploadDate").offset().top - 3);

        // スクロールーバー分幅が変更されない場合補正する
        if ($("#SearchMenu-Input-Sub-UploadDate").width() == width) {
            $("#SearchMenu-Input-Sub-UploadDate").width($("#SearchMenu-Input-Sub-UploadDate").width() + $("#ViewerConfig").data("ScrollBarWidth"));
        }
    }
}

// 登録日付ボタンクリック処理(サブメニュー)
function SearchMenuInput_UploadDate_SideSub_Click($this) {
    // 登録日付設定
    $("#SearchMenu-Input-UploadDate").val($this.text())
                                     .focus()
                                     .scrollLeft(0);
}

// 登録日時ボタンクリック処理
function SearchMenuInput_UploadDateTime_Side_Click() {
    // 未選択状態の場合
    if ($("#SearchMenu-Input-Sub-UploadDateTime").is(":hidden")) {
        // サブメニューキャンセル処理
        SearchMenu_Cancel();

        // 表示処理
        SearchMenuInput_UploadDateTime_SideSub_Show();
    }
        // 選択状態の場合
    else {
        // キャンセル処理
        SearchMenuInput_UploadDateTime_Side_Cancel();
    }
}

// 登録日時ボタンキャンセル処理
function SearchMenuInput_UploadDateTime_Side_Cancel() {
    // アイコン変更
    $("#SearchMenu-Input-Sub-UploadDateTime").hide();
}

// 登録日時ボタン表示処理(サブメニュー)
function SearchMenuInput_UploadDateTime_SideSub_Show() {
    // 前回のスクロールバーの補正を削除
    $("#SearchMenu-Input-Sub-UploadDateTime").css("height", "");
    $("#SearchMenu-Input-Sub-UploadDateTime").css("width", "");

    // サブメニュー表示位置補正表示
    var offset = $("#SearchMenu-Input-UploadDateTime-Side").offset();
    var width = $("#SearchMenu-Input-Sub-UploadDateTime").width();
    $("#SearchMenu-Input-Sub-UploadDateTime").css({ left: offset.left + 22 - width, top: offset.top + 24 })
                                         .show();

    // スクロールバーの補正
    if ($("#SearchMenu-Input-Sub-UploadDateTime").offset().top + $("#SearchMenu-Input-Sub-UploadDateTime").height() > $(window).height()) {
        // サブメニュー表示の高さを補正
        $("#SearchMenu-Input-Sub-UploadDateTime").height($(window).height() - $("#SearchMenu-Input-Sub-UploadDateTime").offset().top - 3);

        // スクロールーバー分幅が変更されない場合補正する
        if ($("#SearchMenu-Input-Sub-UploadDateTime").width() == width) {
            $("#SearchMenu-Input-Sub-UploadDateTime").width($("#SearchMenu-Input-Sub-UploadDateTime").width() + $("#ViewerConfig").data("ScrollBarWidth"));
        }
    }
}

// 登録日時ボタンクリック処理(サブメニュー)
function SearchMenuInput_UploadDateTime_SideSub_Click($this) {
    // 登録日時設定
    $("#SearchMenu-Input-UploadDateTime").val($this.text())
                                         .focus()
                                         .scrollLeft(0);
}

// キーワードボタンクリック処理
function SearchMenuInput_Keyword_Side_Click() {
    // 未選択状態の場合
    if ($("#SearchMenu-Input-Sub-Keyword").is(":hidden")) {
        // サブメニューキャンセル処理
        SearchMenu_Cancel();

        // 表示処理
        SearchMenuInput_Keyword_SideSub_Show();
    }
    // 選択状態の場合
    else {
        // キャンセル処理
        SearchMenuInput_Keyword_Side_Cancel();
    }
}

// キーワードボタンキャンセル処理
function SearchMenuInput_Keyword_Side_Cancel() {
    // アイコン変更
    $("#SearchMenu-Input-Sub-Keyword").hide();
}

// キーワードボタン表示処理(サブメニュー)
function SearchMenuInput_Keyword_SideSub_Show() {
    // 前回のスクロールバーの補正を削除
    $("#SearchMenu-Input-Sub-Keyword").css("height", "");
    $("#SearchMenu-Input-Sub-Keyword").css("width", "");

    // サブメニュー表示位置補正表示
    var offset = $("#SearchMenu-Input-Keyword-Side").offset();
    var width = $("#SearchMenu-Input-Sub-Keyword").width();
    $("#SearchMenu-Input-Sub-Keyword").css({ left: offset.left + 22 - width, top: offset.top + 24 })
                                      .show();

    // スクロールバーの補正
    if ($("#SearchMenu-Input-Sub-Keyword").offset().top + $("#SearchMenu-Input-Sub-Keyword").height() > $(window).height()) {
        // サブメニュー表示の高さを補正
        $("#SearchMenu-Input-Sub-Keyword").height($(window).height() - $("#SearchMenu-Input-Sub-Keyword").offset().top - 3);

        // スクロールーバー分幅が変更されない場合補正する
        if ($("#SearchMenu-Input-Sub-Keyword").width() == width) {
            $("#SearchMenu-Input-Sub-Keyword").width($("#SearchMenu-Input-Sub-Keyword").width() + $("#ViewerConfig").data("ScrollBarWidth"));
        }
    }
}

// キーワードボタンクリック処理(サブメニュー)
function SearchMenuInput_Keyword_SideSub_Click($this) {
    // キーワード設定
    $("#SearchMenu-Input-Keyword").val($this.text())
                                  .focus()
                                  .scrollLeft(0);
}
