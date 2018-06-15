/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
// 検査一覧アイテム管理用
var StudyRowItem = {
    // 初期化
    Init: function () {
        this.$Template = $("<tr>")
            .append($("<td>").addClass("StudyList-Item StudyList-Body-Left").append($("<span>")))
            .append($("<td>").addClass("StudyList-Item StudyList-Body-Left-Margin").append($("<span>")));
        $.each($("#ViewerConfig").data("SearchStudyColumn").split(","), function () {
            if (this == "HospitalName") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-HospitalName").append($("<span>")));
                return true;
            }
            if (this == "StudyDate") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-StudyDate").append($("<span>")));
                return true;
            }
            if (this == "StudyTime") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-StudyTime").append($("<span>")));
                return true;
            }
            if (this == "StudyDateTime") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-StudyDateTime").append($("<span>")));
                return true;
            }
            if (this == "PatientID") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-PatientID").append($("<span>")));
                return true;
            }
            if (this == "PatientsName") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-PatientsName").append($("<span>")));
                return true;
            }
            if (this == "Modality") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Modality").append($("<span>")));
                return true;
            }
            if (this == "BodyPartExamined") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-BodyPartExamined").append($("<span>")));
                return true;
            }
            if (this == "NumberOfImages") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-NumberOfImages").append($("<span>")));
                return true;
            }
            if (this == "AccessionNumber") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-AccessionNumber").append($("<span>")));
                return true;
            }
            if (this == "PatientsSex") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-PatientsSex").append($("<span>")));
                return true;
            }
            if (this == "PatientsAge") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-PatientsAge").append($("<span>")));
                return true;
            }
            if (this == "PatientsBirthDate") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-PatientsBirthDate").append($("<span>")));
                return true;
            }
            if (this == "StudyDescription") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-StudyDescription").append($("<span>")));
                return true;
            }
            if (this == "UploadDate") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-UploadDate").append($("<span>")));
                return true;
            }
            if (this == "UploadDateTime") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-UploadDateTime").append($("<span>")));
                return true;
            }
            if (this == "Memo") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Memo").append($("<span>")));
                return true;
            }
            if (this == "Keyword") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Keyword").append($("<span>")));
                return true;
            }
            if (this == "Comment") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Comment").append($("<span>")));
                return true;
            }
            if (this == "StudyPassword") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-StudyPassword").append($("<span>")));
                return true;
            }
            if (this == "Portal") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Portal").append($("<span>")));
                return true;
            }
            if (this == "ShortURL") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-ShortURL").append($("<span>")));
                return true;
            }
        });
        this.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Right-Margin").append($("<span>")));
        this.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Margin").append($("<span>")));
    },
    // 取得
    Get: function (tag) {
        var row = this.$Template.clone().data("StudyKey", tag.StudyKey).data("PatientID", tag.PatientID);
        row.find(".StudyList-Body-HospitalName span").text(Search_GetHospitalName(tag.HospitalID));
        row.find(".StudyList-Body-StudyDate").data("Sort", Common_DateFmt(tag.StudyDate) + " " + Common_TimeFmt(tag.StudyTime));
        row.find(".StudyList-Body-StudyDate span").text(Common_DateFmt(tag.StudyDate));
        row.find(".StudyList-Body-StudyTime span").text(Common_TimeFmt(tag.StudyTime));
        row.find(".StudyList-Body-StudyDateTime span").text(Common_DateFmt(tag.StudyDate) + " " + Common_TimeFmt(tag.StudyTime));
        row.find(".StudyList-Body-PatientID span").text(tag.PatientID);
        row.find(".StudyList-Body-PatientsName span").text(tag.PatientsName);
        row.find(".StudyList-Body-Modality span").text(tag.Modality);
        row.find(".StudyList-Body-BodyPartExamined span").text(tag.BodyPartExamined);
        row.find(".StudyList-Body-NumberOfImages span").text(tag.NumberOfImages);
        row.find(".StudyList-Body-AccessionNumber span").text(tag.AccessionNumber);
        row.find(".StudyList-Body-PatientsSex span").text(tag.PatientsSex);
        row.find(".StudyList-Body-PatientsAge span").text(tag.PatientsAge);
        row.find(".StudyList-Body-PatientsBirthDate span").text(Common_DateFmt(tag.PatientsBirthDate));
        row.find(".StudyList-Body-StudyDescription span").text(tag.StudyDescription);
        row.find(".StudyList-Body-UploadDate").data("Sort", tag.UploadDate + " " + tag.UploadTime);
        row.find(".StudyList-Body-UploadDate span").text(tag.UploadDate);
        row.find(".StudyList-Body-UploadDateTime span").text(tag.UploadDate + " " + tag.UploadTime);
        row.find(".StudyList-Body-Memo").data("Sort", 0);
        if (tag.MemoUmu == 1) {
            row.find(".StudyList-Body-Memo").data("Sort", 1).addClass("StudyList-Body-Memo-ON");
        }
        row.find(".StudyList-Body-Keyword span").text(tag.Keyword);
        row.find(".StudyList-Body-Comment span").text(tag.Comment);
        row.find(".StudyList-Body-StudyPassword").data("Sort", 0);
        if (tag.StudyPasswordUmu == 1) {
            row.find(".StudyList-Body-StudyPassword").data("Sort", 1).addClass("StudyList-Body-StudyPassword-ON");
        }
        row.find(".StudyList-Body-Portal").data("Sort", 0);
        if (tag.StudyPortalUmu == 1) {
            row.find(".StudyList-Body-Portal").data("Sort", 1).addClass("StudyList-Body-Portal-ON");
        }
        row.find(".StudyList-Body-ShortURL").data("Sort", 0);
        if (tag.StudyUrlUmu == 1) {
            row.find(".StudyList-Body-ShortURL").data("Sort", 1).addClass("StudyList-Body-ShortURL-ON");
        }
        return row;
    }
};

// 初期化処理
function SearchStudyList_Init() {
    // ヘッダイベント設定
    $("#StudyList-View").on({
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

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offsetX = e.originalEvent.touches[0].pageX - startX;

                    // タッチ位置更新
                    startX = e.originalEvent.touches[0].pageX;

                    // 検査一覧リサイズ処理
                    SearchStudyList_Resize($this, offsetX);

                    // 位置情報更新
                    pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // 検査一覧ソート
                    SearchStudyList_Sort($this);
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

            // 初期マウス位置登録
            var pointX = e.pageX;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offsetX = e.pageX - pointX;

                    // マウス位置更新
                    pointX = e.pageX;

                    // 検査一覧リサイズ処理
                    SearchStudyList_Resize($this, offsetX);

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
                    // 検査一覧ソート
                    SearchStudyList_Sort($this);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".StudyList-Head-Center");

    // 横スクロールバー制御イベント設定
    $("#StudyList-Table").on({
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

                    // 横スクロールを反映
                    $("#StudyList-Table").scrollLeft($("#StudyList-Table").scrollLeft() - offsetX);
                    $("#StudyList").scrollLeft($("#StudyList-Table").scrollLeft());
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

                    // 横スクロールを反映
                    $("#StudyList-Table").scrollLeft($("#StudyList-Table").scrollLeft() - offsetX);
                    $("#StudyList").scrollLeft($("#StudyList-Table").scrollLeft());
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
        "scroll": function (e) {
            // 横スクロールを反映
            $("#StudyList").scrollLeft($(this).scrollLeft());

            // サブメニューキャンセル処理
            SearchMenu_Cancel();
        }
    });

    // 行選択、縦スクロールバー制御イベント設定
    $("#StudyList-Table").on({
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

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // オフセット算出
                    var offsetY = e.originalEvent.touches[0].pageY - startY;

                    // タッチ位置更新
                    startY = e.originalEvent.touches[0].pageY;

                    // 縦スクロールを反映
                    $("#StudyList-Table").scrollTop($("#StudyList-Table").scrollTop() - offsetY);

                    // 位置情報更新
                    pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // 現在時刻取得
                    var now = new Date().getTime();

                    // クリック判定
                    if ($this.data("dblClick") == undefined || $this.data("dblClick") < now) {
                        // 検査選択処理
                        if (e.ctrlKey && !e.shiftKey) {
                            SearchStudyList_Select($this, "multi");
                        }
                        else if (!e.ctrlKey && e.shiftKey) {
                            SearchStudyList_Select($this, "range");
                        }
                        else {
                            SearchStudyList_Select($this, "");
                        }

                        // ダブルクリック時間登録
                        $this.data("dblClick", now + 300);
                    }
                    // ダブルクリック判定
                    else {
                        // Viewer起動処理(検査)
                        SearchStudyList_Viewer_Open($this);

                        // ダブルクリック時間削除
                        $this.removeData("dblClick");
                    }
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

            // 初期マウス位置登録
            var pointY = e.pageY;

            // 位置情報用クラス生成
            var pointInfo = new Common_PointInfo(e.pageX, e.pageY);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // オフセット算出
                    var offsetY = e.pageY - pointY;

                    // マウス位置更新
                    pointY = e.pageY;

                    // 縦スクロールを反映
                    $("#StudyList-Table").scrollTop($("#StudyList-Table").scrollTop() - offsetY);

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
                    // 現在時刻取得
                    var now = new Date().getTime();

                    // クリック判定
                    if ($this.data("dblClick") == undefined || $this.data("dblClick") < now) {
                        // 検査選択処理
                        if (e.ctrlKey && !e.shiftKey) {
                            SearchStudyList_Select($this, "multi");
                        }
                        else if (!e.ctrlKey && e.shiftKey) {
                            SearchStudyList_Select($this, "range");
                        }
                        else {
                            SearchStudyList_Select($this, "");
                        }

                        // ダブルクリック時間登録
                        $this.data("dblClick", now + 300);
                    }
                    // ダブルクリック判定
                    else {
                        // Viewer起動処理(検査)
                        SearchStudyList_Viewer_Open($this);

                        // ダブルクリック時間削除
                        $this.removeData("dblClick");
                    }
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // ダブルクリックイベント設定
        "dblclick": function () {
            var $this = $(this);

            // IE8以下ではダブルクリック時のmousedownが発生しないため代用
            var ieVer = $("#ViewerConfig").data("IEVersion");
            if (ieVer && ieVer <= 8) {
                // Viewer起動処理(検査)
                SearchStudyList_Viewer_Open($this);

                // ダブルクリック時間削除
                $this.removeData("dblClick");
            }
        }
    }, "tbody tr");

    // 検査一覧アイテム初期化
    StudyRowItem.Init();

    // 検査一覧リサイズ用最小値設定(IE6用)
    if (isNaN(parseInt($("th.StudyList-Body-StudyDate").css("minWidth"))) &&
        isNaN(parseInt($("th.StudyList-Body-StudyDateTime").css("minWidth")))) {
        $("th.StudyList-Body-HospitalName").css("minWidth", "90px");
        $("th.StudyList-Body-StudyDate").css("minWidth", "90px");
        $("th.StudyList-Body-StudyTime").css("minWidth", "90px");
        $("th.StudyList-Body-StudyDateTime").css("minWidth", "90px");
        $("th.StudyList-Body-PatientID").css("minWidth", "90px");
        $("th.StudyList-Body-PatientsName").css("minWidth", "70px");
        $("th.StudyList-Body-Modality").css("minWidth", "55px");
        $("th.StudyList-Body-BodyPartExamined").css("minWidth", "55px");
        $("th.StudyList-Body-NumberOfImages").css("minWidth", "70px");
        $("th.StudyList-Body-AccessionNumber").css("minWidth", "90px");
        $("th.StudyList-Body-PatientsSex").css("minWidth", "55px");
        $("th.StudyList-Body-PatientsAge").css("minWidth", "55px");
        $("th.StudyList-Body-PatientsBirthDate").css("minWidth", "90px");
        $("th.StudyList-Body-StudyDescription").css("minWidth", "70px");
        $("th.StudyList-Body-UploadDate").css("minWidth", "90px");
        $("th.StudyList-Body-UploadDateTime").css("minWidth", "90px");
        $("th.StudyList-Body-Keyword").css("minWidth", "55px");
        $("th.StudyList-Body-Comment").css("minWidth", "55px");

        // リサイズ処理
        SearchWindow_Resize_Proc();

        // 初期スクロール位置がずれるため初期化
        $("#StudyList").scrollLeft(0);
    }

    // 初期検査一覧幅設定
    var columnWidth = Common_ParseUrlParams($("#ViewerConfig").data("SearchStudyColumnWidth"), false);
    var key, offset;
    for (key in columnWidth) {
        offset = parseInt(columnWidth[key]);
        if (!isNaN(offset)) {
            // 検査一覧リサイズ処理
            SearchStudyList_Resize($("#StudyList-View thead .StudyList-Body-" + key), offset);
        }
    }

    // 検査一覧リサイズ処理を行うことにより
    // IE6の場合、サブメニュー部が正しい位置に表示される
    // WebKit系の場合、入力部が正しい位置に表示される
    SearchStudyList_Resize($("#StudyList-View .StudyList-Head-Center"), 1);
    SearchStudyList_Resize($("#StudyList-View .StudyList-Head-Center"), -1);
}

// 検査一覧リサイズ処理
function SearchStudyList_Resize($this, offset) {
    // リサイズ対象確認
    var $obj, width;
    if ($this.hasClass("StudyList-Body-HospitalName")) {
        if ($("#ViewerConfig").data("Hospital").length < 2) {
            // 複数病院無い場合は非表示
            $("th.StudyList-Body-HospitalName, td.StudyList-Body-HospitalName").hide();
        }
        else {
            $obj = $("th.StudyList-Body-HospitalName");
            width = $obj.width();
            if (parseInt($obj.css("minWidth")) < width + offset) {
                $("th.StudyList-Body-HospitalName, td.StudyList-Body-HospitalName").width(width + offset);
            }
        }
    }
    if ($this.hasClass("StudyList-Body-StudyDate")) {
        $obj = $("th.StudyList-Body-StudyDate");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-StudyDate, td.StudyList-Body-StudyDate").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-StudyTime")) {
        $obj = $("th.StudyList-Body-StudyTime");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-StudyTime, td.StudyList-Body-StudyTime").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-StudyDateTime")) {
        $obj = $("th.StudyList-Body-StudyDateTime");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-StudyDateTime, td.StudyList-Body-StudyDateTime").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-PatientID")) {
        $obj = $("th.StudyList-Body-PatientID");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-PatientID, td.StudyList-Body-PatientID").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-PatientsName")) {
        $obj = $("th.StudyList-Body-PatientsName");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-PatientsName, td.StudyList-Body-PatientsName").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-Modality")) {
        $obj = $("th.StudyList-Body-Modality");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-Modality, td.StudyList-Body-Modality").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-BodyPartExamined")) {
        $obj = $("th.StudyList-Body-BodyPartExamined");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-BodyPartExamined, td.StudyList-Body-BodyPartExamined").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-NumberOfImages")) {
        $obj = $("th.StudyList-Body-NumberOfImages");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-NumberOfImages, td.StudyList-Body-NumberOfImages").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-AccessionNumber")) {
        $obj = $("th.StudyList-Body-AccessionNumber");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-AccessionNumber, td.StudyList-Body-AccessionNumber").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-PatientsSex")) {
        $obj = $("th.StudyList-Body-PatientsSex");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-PatientsSex, td.StudyList-Body-PatientsSex").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-PatientsAge")) {
        $obj = $("th.StudyList-Body-PatientsAge");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-PatientsAge, td.StudyList-Body-PatientsAge").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-PatientsBirthDate")) {
        $obj = $("th.StudyList-Body-PatientsBirthDate")
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-PatientsBirthDate, td.StudyList-Body-PatientsBirthDate").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-StudyDescription")) {
        $obj = $("th.StudyList-Body-StudyDescription");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-StudyDescription, td.StudyList-Body-StudyDescription").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-UploadDate")) {
        $obj = $("th.StudyList-Body-UploadDate");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-UploadDate, td.StudyList-Body-UploadDate").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-UploadDateTime")) {
        $obj = $("th.StudyList-Body-UploadDateTime");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-UploadDateTime, td.StudyList-Body-UploadDateTime").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-Keyword")) {
        $obj = $("th.StudyList-Body-Keyword");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-Keyword, td.StudyList-Body-Keyword").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-Comment")) {
        $obj = $("th.StudyList-Body-Comment");
        width = $obj.width();
        if (parseInt($obj.css("minWidth")) < width + offset) {
            $("th.StudyList-Body-Comment, td.StudyList-Body-Comment").width(width + offset);
        }
    }

    // リサイズ処理
    SearchWindow_Resize_Proc();
}

// 検査一覧ソート
function SearchStudyList_Sort($this) {
    // ソート対象の場合
    var $child = $this.children();
    if ($child.is("span")) {
        // ソート方向取得
        var dir = "d";
        if ($child.text() == "∨") {
            // 昇順指定
            dir = "a";
        }

        // 画像数、年齢ならばソート方式を数値に変更
        var type = "s";
        if ($this.hasClass("StudyList-Body-NumberOfImages") || $this.hasClass("StudyList-Body-PatientsAge")) {
            type = "n";
        }

        // 検査日付、登録日付、メモ、検査パスワードの場合ソート方式をデータキャッシュに変更
        if ($this.hasClass("StudyList-Body-StudyDate") ||
            $this.hasClass("StudyList-Body-UploadDate") ||
            $this.hasClass("StudyList-Body-Memo") ||
            $this.hasClass("StudyList-Body-StudyPassword") ||
            $this.hasClass("StudyList-Body-Portal") ||
            $this.hasClass("StudyList-Body-ShortURL")) {
            type = "d";
        }

        // 検査一覧ソートリセット
        SearchStudyList_Sort_Reset();

        // ソート方向設定
        if (dir == "d") {
            $child.text("∨");
        }
        else {
            $child.text("∧");
        }

        // ソート処理
        Common_TableSort("#StudyList-Table-View", $this.index(), type, dir);
    }
}

// 検査一覧ソートリセット
function SearchStudyList_Sort_Reset() {
    // ソート方向表示クリア
    $("#StudyList-View .StudyList-Head-Center span").each(function () {
        $(this).text("");
    });
}

// 検査一覧取得結果
function SearchStudyList_GetStudyList_Result(result, studyKey) {
    // データチェック
    if (result.d.Result == "Error") {
        // 処理中を削除
        $("#StudyListLoading").remove();
        return;
    }

    // データクリア
    $("#StudyList-Table tbody").empty();

    // 要素を作成
    $.each(result.d.Tags, function () {
        $("#StudyList-Table tbody").append(StudyRowItem.Get(this));
    });

    // 検査一覧リサイズ処理
    SearchStudyList_Resize($("#StudyList-View .StudyList-Head-Center"), 0);   // 全体更新

    // 検索結果更新
    $("#SearchMenu-Info-Result").text(result.d.Tags.length);
    $("#SearchMenu-Info-Max").text(result.d.Count);

    // 該当するStudyKeyがある場合選択する
    if (studyKey) {
        $("#StudyList-Table tbody tr").each(function () {
            if ($(this).data("StudyKey") == studyKey) {
                // 選択
                $(this).addClass("StudyList-Table-Row-Select");

                // 選択検査変更処理
                SearchStudyList_Select_Change(0);
                return false;
            }
        });
    }

    // 処理中を削除
    $("#StudyListLoading").remove();
}

// 検査選択処理
function SearchStudyList_Select($this, mode) {
    // 選択状態取得
    var $obj = $(".StudyList-Table-Row-Select");

    // 複数モード
    if (mode == "multi") {
        // シリーズ一覧非表示
        SearchSeriesList_Hide();

        // 選択状態を反転
        if ($this.is(".StudyList-Table-Row-Select")) {
            $this.removeClass("StudyList-Table-Row-Select");
        }
        else {
            $this.addClass("StudyList-Table-Row-Select");
        }

        // 選択状態を再取得し単一選択以外は終了
        $obj = $(".StudyList-Table-Row-Select");
        if ($obj.length != 1) {
            return;
        }

        // 選択状態にする検査設定
        $this = $obj;
    }
    // 範囲モード
    else if (mode == "range") {
        // 単一選択状態の場合
        if ($obj.length == 1) {
            // シリーズ一覧非表示
            SearchSeriesList_Hide();

            // 範囲選択
            var $tr = $("#StudyList-Table tbody tr");
            var indexA = $tr.index($this);
            var indexB = $tr.index($obj);
            if (indexA < indexB) {
                $tr.slice(indexA, indexB + 1).addClass("StudyList-Table-Row-Select");
            }
            else {
                $tr.slice(indexB, indexA + 1).addClass("StudyList-Table-Row-Select");
            }
            return;
        }
    }
    // 全選択モード
    else if (mode == "all") {
        // シリーズ一覧非表示
        SearchSeriesList_Hide();

        // 全選択
        $("#StudyList-Table tbody tr").addClass("StudyList-Table-Row-Select");
        return;
    }

    // 選択状態全クリア
    $("#StudyList-Table tr").each(function () {
        $(this).removeClass("StudyList-Table-Row-Select");
    });

    // 選択状態に設定
    $this.addClass("StudyList-Table-Row-Select");

    // シリーズ一覧変更
    SearchSeriesList_Change($this);
}

// 選択検査変更処理
function SearchStudyList_Select_Change(offset) {
    // 単一選択状態以外の場合は無効
    var $obj = $(".StudyList-Table-Row-Select");
    if ($obj.length != 1) {
        return;
    }

    // オフセット分移動
    var i;
    if (offset > 0) {
        for (i = 0; i < offset; i++) {
            var $next = $obj.next();
            if ($next.length != 1) {
                break;
            }
            $obj = $next;
        }
    }
    else if (offset < 0) {
        for (i = offset; i < 0; i++) {
            var $prev = $obj.prev();
            if ($prev.length != 1) {
                break;
            }
            $obj = $prev;
        }
    }

    // 検査選択処理
    SearchStudyList_Select($obj, "");

    // スクロール位置更新
    var $table = $("#StudyList-Table");
    var barsize = $("#ViewerConfig").data("ScrollBarWidth");
    var top = $obj.position().top;
    var pre = $table.scrollTop();
    if (top > $table.height() - $obj.height() - barsize) {
        $table.scrollTop(pre + top + barsize + $obj.height() - $table.height());
    }
    else if (top < 0) {
        $table.scrollTop(pre + top);
    }
}

// 検査情報一覧取得処理
function SearchStudyList_GetList(all) {
    // 取得対象設定
    var $obj = all ? $("#StudyList-Table tbody tr") : $(".StudyList-Table-Row-Select");

    // 検査情報作成
    var list = new Array();
    $obj.each(function () {
        var study = new Object();
        study.StudyKey = $(this).data("StudyKey");
        study.PatientID = $(this).data("PatientID");
        study.$obj = $(this);
        list.push(study);
    });
    return list;
}

// Viewer起動処理(検査)
function SearchStudyList_Viewer_Open($this) {
    // パラメータ作成
    var param = new Object();
    param["patientid"] = $this.data("PatientID");
    param["studykey"] = $this.data("StudyKey");
    param["serieskey"] = "";

    // パラメータ設定
    Search_SetParams(
        param,
        null,
        SearchStudyList_SetParams_Result
    );
}

// パラメータ設定結果(検査)
function SearchStudyList_SetParams_Result(result) {
    // Viewer起動処理
    if ($("#ViewerConfig").data("MultiView") != "1") {
        Common_WindowOpen($("#ViewerConfig").data("ViewerURL"), "ProRadViewer" + $("#ViewerConfig").data("time"), true);
    }
    else {
        var dd = new Date();
        Common_WindowOpen($("#ViewerConfig").data("ViewerURL"), "ProRadViewer" + dd.getTime(), true);
    }
}