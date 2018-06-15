/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 初期化処理
function SearchMenuPreset_Init() {
    // 要素を作成
    var $command = $("#SearchMenu-Command-View");
    $.each($("#ViewerConfig").data("Preset").split(","), function () {
        // 各パラメータを取得する
        var params = Common_ParseUrlParams(this, true);

        // titleがある場合のみ作成する
        if ("title" in params) {
            var tag = $("<div>").addClass("SearchMenu-Command-Common SearchMenu-Command-Preset")
                                .append($("<div>").addClass("SearchMenu-Command-Preset-Text")
                                                  .text(decodeURIComponent(params["title"])))
                                .data("hospid", ("hospid" in params) ? decodeURIComponent(params["hospid"]) : "")
                                .data("date", ("date" in params) ? decodeURIComponent(params["date"]) : "")
                                .data("patid", ("patid" in params) ? decodeURIComponent(params["patid"]) : "")
                                .data("patname", ("patname" in params) ? decodeURIComponent(params["patname"]) : "")
                                .data("mod", ("mod" in params) ? decodeURIComponent(params["mod"]) : "")
                                .data("upload", ("upload" in params) ? decodeURIComponent(params["upload"]) : "")
                                .data("accno", ("accno" in params) ? decodeURIComponent(params["accno"]) : "")
                                .data("keyword", ("keyword" in params) ? decodeURIComponent(params["keyword"]) : "")
                                .data("comment", ("comment" in params) ? decodeURIComponent(params["comment"]) : "");
            if (params["title"] != "") {
                tag.attr("title", decodeURIComponent(params["title"]));
            }
            $command.append(tag);
            $command.append($("<div>").addClass("SearchMenu-Command-Common SearchMenu-Command-Preset-Margin"));
        }
    });

    // プリセットボタンクリックイベント設定
    $("#SearchMenu-Command-View").on({
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
                    // タッチイベント二重動作防止のためタイマを使用する
                    setTimeout(function () {
                        // プリセットボタンクリック処理
                        SearchMenuPreset_Click($this);
                    }, 100);
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
                    // プリセットボタンクリック処理
                    SearchMenuPreset_Click($this);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Command-Preset");
}

// プリセットボタンクリック処理
function SearchMenuPreset_Click($this) {
    // タイトルが空の場合は何もしない
    if ($this.children().text() == "") {
        return;
    }

    // 各種入力パラメータ設定
    var $subHospital = $("#SearchMenu-Input-Sub-HospitalName");
    if ($this.data("hospid") == "") {
        $("#SearchMenu-Input-HospitalName").val($subHospital.children(":last-child").text()).data("ID", $subHospital.children(":last-child").data("ID"));
    }
    else {
        var setFlag = false;
        $.each($subHospital.children(), function () {
            if ($(this).data("ID") == $this.data("hospid")) {
                $("#SearchMenu-Input-HospitalName").val($(this).text()).data("ID", $(this).data("ID"));
                setFlag = true;
                return false;
            }
        });
        if (setFlag == false) {
            $("#SearchMenu-Input-HospitalName").val($subHospital.children(":last-child").text()).data("ID", $subHospital.children(":last-child").data("ID"));
        }
    }
    if ($("#SearchMenu-Input-PatientID").is(":enabled")) {
        $("#SearchMenu-Input-PatientID").val($this.data("patid"));
    }
    $("#SearchMenu-Input-PatientsName").val($this.data("patname"));
    if ($("#SearchMenu-Input-Modality").is(":enabled")) {
        $("#SearchMenu-Input-Modality").val($this.data("mod"));
    }
    if ($("#SearchMenu-Input-StudyDate").length != 0) {
        if ($("#SearchMenu-Input-StudyDate").is(":enabled")) {
            $("#SearchMenu-Input-StudyDate").val($this.data("date"));
        }
    }
    else if ($("#SearchMenu-Input-StudyDateTime").length != 0) {
        if ($("#SearchMenu-Input-StudyDateTime").is(":enabled")) {
            $("#SearchMenu-Input-StudyDateTime").val($this.data("date"));
        }
    }
    if ($("#SearchMenu-Input-UploadDate").length != 0) {
        if ($("#SearchMenu-Input-UploadDate").is(":enabled")) {
            $("#SearchMenu-Input-UploadDate").val($this.data("upload"));
        }
    }
    else if ($("#SearchMenu-Input-UploadDateTime").length != 0) {
        if ($("#SearchMenu-Input-UploadDateTime").is(":enabled")) {
            $("#SearchMenu-Input-UploadDateTime").val($this.data("upload"));
        }
    }
    if ($("#SearchMenu-Input-AccessionNumber").is(":enabled")) {
        $("#SearchMenu-Input-AccessionNumber").val($this.data("accno"));
    }
    $("#SearchMenu-Input-Keyword").val($this.data("keyword"));
    $("#SearchMenu-Input-Comment").val($this.data("comment"));

    // 検索ボタンクリック処理
    SearchMenu_Search_Button_Click();
}

// プリセット登録項目選択開始処理
function SearchMenuPreset_Select_Start(command) {
    // 処理内容判定
    if (command == true) {
        // 入力値取得
        var patientID = $("#SearchMenu-Input-PatientID").val() ? $("#SearchMenu-Input-PatientID").val() : "";
        var patientsName = $("#SearchMenu-Input-PatientsName").val() ? $("#SearchMenu-Input-PatientsName").val() : "";
        var modality = $("#SearchMenu-Input-Modality").val() ? $("#SearchMenu-Input-Modality").val() : "";
        var studyDate = "";
        if ($("#SearchMenu-Input-StudyDate").length != 0) {
            studyDate = $("#SearchMenu-Input-StudyDate").val() ? $("#SearchMenu-Input-StudyDate").val() : "";
        }
        else if ($("#SearchMenu-Input-StudyDateTime").length != 0) {
            studyDate = $("#SearchMenu-Input-StudyDateTime").val() ? $("#SearchMenu-Input-StudyDateTime").val() : "";
        }
        var uploadDate = "";
        if ($("#SearchMenu-Input-UploadDate").length != 0) {
            uploadDate = $("#SearchMenu-Input-UploadDate").val() ? $("#SearchMenu-Input-UploadDate").val() : "";
        }
        else if ($("#SearchMenu-Input-UploadDateTime").length != 0) {
            uploadDate = $("#SearchMenu-Input-UploadDateTime").val() ? $("#SearchMenu-Input-UploadDateTime").val() : "";
        }
        var accessionNumber = $("#SearchMenu-Input-AccessionNumber").val() ? $("#SearchMenu-Input-AccessionNumber").val() : "";
        var keyword = $("#SearchMenu-Input-Keyword").val() ? $("#SearchMenu-Input-Keyword").val() : "";
        var comment = $("#SearchMenu-Input-Comment").val() ? $("#SearchMenu-Input-Comment").val() : "";

        // 検索条件判定
        if (patientID == "" &&
            patientsName == "" &&
            modality == "" &&
            studyDate == "" &&
            uploadDate == "" &&
            accessionNumber == "" &&
            keyword == "" &&
            comment == "") {
            // 無効を設定
            $("#SearchMenu-Command-View").data("command", null);
        }
        else {
            // 追加を設定
            $("#SearchMenu-Command-View").data("command", true);
        }
    }
    else {
        // 削除を設定
        $("#SearchMenu-Command-View").data("command", false);
    }

    // プリセット登録項目選択位置初期化
    $("#DragDropItem").data("offsetX", Number.NaN).data("offsetY", Number.NaN);
}

// プリセット登録項目選択移動処理
function SearchMenuPreset_Select_Move(x, y) {
    // 処理内容が無効以外は表示
    if ($("#SearchMenu-Command-View").data("command") != null) {
        $("#DragDropItem").css({ left: x - 16, top: y - 28 }).data("offsetX", x).data("offsetY", y).show();
    }
}

// プリセット登録項目選択確定処理
function SearchMenuPreset_Select_Fix() {
    // 処理内容が無効の場合は何もしない
    if ($("#SearchMenu-Command-View").data("command") == null) {
        return;
    }

    // ドラッグ中描画解除
    $("#DragDropItem").hide();

    // 遅延処理を行う
    setTimeout(function () {
        // 範囲チェック
        var x = $("#DragDropItem").data("offsetX");
        var y = $("#DragDropItem").data("offsetY");
        var offset = $("#SearchMenu-Command-View").offset();
        var width = $("#SearchMenu-Command-View").width();
        var height = $("#SearchMenu-Command-View").height();
        if (isNaN(x) || isNaN(y)) {
            return;
        }
        if (x < $("#SearchMenu-Basic").width()) {
            return;
        }
        if (x < offset.left || x > offset.left + width) {
            return;
        }
        if (y < offset.top || y > offset.top + height) {
            return;
        }

        // 対象を特定
        var pointX = $("#DragDropItem").data("offsetX") - $("#SearchMenu-Command-View").offset().left;
        var pointY = $("#DragDropItem").data("offsetY") - $("#SearchMenu-Command-View").offset().top;
        var $preset = $("#SearchMenu-Command-View .SearchMenu-Command-Preset");
        $.each($preset, function () {
            var $this = $(this);
            var o = $this.offset();
            var w = $this.width();
            var h = $this.height();
            if (pointX < o.left - offset.left || pointX > o.left - offset.left + w) {
                return true;
            }
            if (pointY < o.top - offset.top || pointY > o.top - offset.top + h) {
                return true;
            }

            // 処理内容確認
            if ($("#SearchMenu-Command-View").data("command") == true) {
                // 入力値取得
                var hospitalName = $("#SearchMenu-Input-HospitalName").data("ID") ? $("#SearchMenu-Input-HospitalName").data("ID") : $("#ViewerConfig").data("Hospital")[0].ID;
                var patientID = $("#SearchMenu-Input-PatientID").val() ? $("#SearchMenu-Input-PatientID").val() : "";
                var patientsName = $("#SearchMenu-Input-PatientsName").val() ? $("#SearchMenu-Input-PatientsName").val() : "";
                var modality = $("#SearchMenu-Input-Modality").val() ? $("#SearchMenu-Input-Modality").val() : "";
                var studyDate = "";
                if ($("#SearchMenu-Input-StudyDate").length != 0) {
                    studyDate = $("#SearchMenu-Input-StudyDate").val() ? $("#SearchMenu-Input-StudyDate").val() : "";
                }
                else if ($("#SearchMenu-Input-StudyDateTime").length != 0) {
                    studyDate = $("#SearchMenu-Input-StudyDateTime").val() ? $("#SearchMenu-Input-StudyDateTime").val() : "";
                }
                var uploadDate = "";
                if ($("#SearchMenu-Input-UploadDate").length != 0) {
                    uploadDate = $("#SearchMenu-Input-UploadDate").val() ? $("#SearchMenu-Input-UploadDate").val() : "";
                }
                else if ($("#SearchMenu-Input-UploadDateTime").length != 0) {
                    uploadDate = $("#SearchMenu-Input-UploadDateTime").val() ? $("#SearchMenu-Input-UploadDateTime").val() : "";
                }
                var accessionNumber = $("#SearchMenu-Input-AccessionNumber").val() ? $("#SearchMenu-Input-AccessionNumber").val() : "";
                var keyword = $("#SearchMenu-Input-Keyword").val() ? $("#SearchMenu-Input-Keyword").val() : "";
                var comment = $("#SearchMenu-Input-Comment").val() ? $("#SearchMenu-Input-Comment").val() : "";

                // タイトルデフォルト作成
                var def = "";
                if (studyDate != "") {
                    def = studyDate;
                }
                if (patientID != "") {
                    if (def != "") {
                        def += " ";
                    }
                    def += patientID;
                }
                if (patientsName != "") {
                    if (def != "") {
                        def += " ";
                    }
                    def += patientsName;
                }
                if (modality != "") {
                    if (def != "") {
                        def += " ";
                    }
                    def += modality;
                }
                if (uploadDate != "") {
                    if (def != "") {
                        def += " ";
                    }
                    def += uploadDate;
                }
                if (accessionNumber != "") {
                    if (def != "") {
                        def += " ";
                    }
                    def += accessionNumber;
                }
                if (keyword != "") {
                    if (def != "") {
                        def += " ";
                    }
                    def += keyword;
                }
                if (comment != "") {
                    if (def != "") {
                        def += " ";
                    }
                    def += comment;
                }

                // 追加
                var ret = null;
                ret = prompt("タイトルを入力してください。", def);
                if (ret == null) {
                    return false;
                }
                if (ret == "") {
                    alert("タイトル未入力では登録できません。");
                    return false;
                }

                // 各種入力パラメータ設定
                $this.children(".SearchMenu-Command-Preset-Text").text(ret);
                if ($.isArray(hospitalName)) {
                    $this.data("hospid", "");
                }
                else {
                    $this.data("hospid", hospitalName);
                }
                $this.data("patid", patientID)
                     .data("patname", patientsName)
                     .data("mod", modality)
                     .data("date", studyDate)
                     .data("upload", uploadDate)
                     .data("accno", accessionNumber)
                     .data("keyword", keyword)
                     .data("comment", comment);
                $this.attr("title", ret);
            }
            else if ($("#SearchMenu-Command-View").data("command") == false) {
                // 削除
                if ($this.children(".SearchMenu-Command-Preset-Text").text() == "") {
                    // コメントが空の場合、何もしない
                    return false;
                }
                if (!confirm("削除してよろしいですか？")) {
                    return false;
                }

                // 各種入力パラメータクリア
                $this.children(".SearchMenu-Command-Preset-Text").text("");
                $this.data("hospid", "")
                     .data("patid", "")
                     .data("patname", "")
                     .data("mod", "")
                     .data("date", "")
                     .data("upload", "")
                     .data("accno", "")
                     .data("keyword", "")
                     .data("comment", "");
                $this.removeAttr("title");
            }
            else {
                // 無効
                return false;
            }

            // パラメータ作成
            var params = "";
            $.each($preset, function () {
                var $this2 = $(this);
                params += "title=" + encodeURIComponent($this2.children(".SearchMenu-Command-Preset-Text").text());
                if ($this2.data("hospid") != "") {
                    params += "&hospid=" + encodeURIComponent($this2.data("hospid"));
                }
                if ($this2.data("date") != "") {
                    params += "&date=" + encodeURIComponent($this2.data("date"));
                }
                if ($this2.data("patid") != "") {
                    params += "&patid=" + encodeURIComponent($this2.data("patid"));
                }
                if ($this2.data("patname") != "") {
                    params += "&patname=" + encodeURIComponent($this2.data("patname"));
                }
                if ($this2.data("mod") != "") {
                    params += "&mod=" + encodeURIComponent($this2.data("mod"));
                }
                if ($this2.data("upload") != "") {
                    params += "&upload=" + encodeURIComponent($this2.data("upload"));
                }
                if ($this2.data("accno") != "") {
                    params += "&accno=" + encodeURIComponent($this2.data("accno"));
                }
                if ($this2.data("keyword") != "") {
                    params += "&keyword=" + encodeURIComponent($this2.data("keyword"));
                }
                if ($this2.data("comment") != "") {
                    params += "&comment=" + encodeURIComponent($this2.data("comment"));
                }
                params += ",";
            });
            params = params.substring(0, params.length - 1);
            var param = new Object();
            param["Preset"] = params;

            // ユーザーコンフィグ設定
            Search_SetUserConfig(param, null, null);
            return false;
        });
    }, 100);
}

