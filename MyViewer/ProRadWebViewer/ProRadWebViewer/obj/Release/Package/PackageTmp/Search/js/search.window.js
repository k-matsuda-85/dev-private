/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var InputTimeout = null;

// 起動処理
$(window).load(function () {
    // 画像読み込み処理
    SearchWindow_LoadImages();

    // サイズが0の場合があるのでタイマでチェックする
    var timerID = setInterval(function () {
        // サイズチェック
        if ($(window).width() == 0 || $(window).height() == 0) {
            return;
        }

        // タイマ終了
        clearInterval(timerID);

        // 初期化処理
        SearchWindow_Init();
    }, 100);
});

// 初期化処理
function SearchWindow_Init() {
    // ViewerConfigに時間情報設定
    var dd = new Date();
    $("#ViewerConfig").data("time", dd.getTime());

    // ViewerConfigにIEバージョン設定
    $("#ViewerConfig").data("IEVersion", Common_GetIeVersion());

    // ViewerConfigにiOSバージョン設定
    $("#ViewerConfig").data("iOSVersion", Common_GetiOSVersion());

    // ViewerConfigにスクロールバー幅設定
    $("#ViewerConfig").data("ScrollBarWidth", Common_ScrollBarWidth());

    // ViewerConfigにViewerURL設定
    $("#ViewerConfig").data("ViewerURL", "../Viewer/WebViewer.aspx");

    // ViewerConfigにUploaderURL設定
    $("#ViewerConfig").data("UploaderURL", "../Uploader/NadiaUploader.aspx");

    // ポータルマスタ初期化
    $("#ViewerConfig").data("PortalMst", null);

    // パラメータ取得
    $("#ViewerConfig").data("GetConfig", false);    // コンフィグ取得完了初期化
    Search_GetParams(null, SearchWindow_GetParams_Result); // 取得後「パラメータ取得結果」呼び出し
    if ($("#ViewerConfig").data("GetConfig") == false) {
        return;
    }

    // エラー処理設定
    Common_ErrorProc_CloseFunc = function () {
        // URLコールで呼ばれた場合
        if ($("#ViewerConfig").data("login") == "2") {
            // 閉じる
            Common_WindowClose();
        }
            // ポータルから呼ばれた場合
        else if ($("#ViewerConfig").data("login") == "3") {
            // ログアウト
            Common_WindowLogout($("#ViewerConfig").data("TopLinkURL"));
        }
        else {
            // ログアウト
            Common_WindowLogout();
        }
    };

    // 検査一覧表示列作成
    var col = parseInt($("#StudyList-Table-Foot").attr("colspan"));
    $("#StudyList-Head-Right")
        .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Left-Margin"));
    $("#SearchMenu-Input-Right")
        .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-Left-Margin")
            .append($("<span>")));
    $.each($("#ViewerConfig").data("SearchStudyColumn").split(","), function () {
        if (this.toString() == "HospitalName") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-HospitalName").text("病院名")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-HospitalName-View").addClass("SearchMenu-Input-Center StudyList-Body-HospitalName SearchMenu-Input-Side-Enable")
                    .append($("<input>").attr("id", "SearchMenu-Input-HospitalName").attr("readonly", "readonly"))
                    .append($("<div>").attr("id", "SearchMenu-Input-HospitalName-Side")));
            return true;
        }
        if (this.toString() == "StudyDate") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyDate").text("検査日")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-StudyDate-View").addClass("SearchMenu-Input-Center StudyList-Body-StudyDate SearchMenu-Input-Side-Enable")
                    .append($("<input>").attr("id", "SearchMenu-Input-StudyDate"))
                    .append($("<div>").attr("id", "SearchMenu-Input-StudyDate-Side")));
            return true;
        }
        if (this.toString() == "PatientID") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-PatientID").text("患者ID")
                .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-PatientID-View").addClass("SearchMenu-Input-Center StudyList-Body-PatientID SearchMenu-Input-Side-Disable")
                    .append($("<input>").attr("id", "SearchMenu-Input-PatientID")));
            return true;
        }
        if (this.toString() == "PatientsName") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-PatientsName").text("患者名")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-PatientsName-View").addClass("SearchMenu-Input-Center StudyList-Body-PatientsName SearchMenu-Input-Side-Disable")
                    .append($("<input>").attr("id", "SearchMenu-Input-PatientsName")));
            return true;
        }
        if (this.toString() == "Modality") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Modality").text("種別")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-Modality-View").addClass("SearchMenu-Input-Center StudyList-Body-Modality SearchMenu-Input-Side-Enable")
                    .append($("<input>").attr("id", "SearchMenu-Input-Modality"))
                    .append($("<div>").attr("id", "SearchMenu-Input-Modality-Side")));
            return true;
        }
        if (this.toString() == "BodyPartExamined") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-BodyPartExamined").text("部位")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-BodyPartExamined")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "NumberOfImages") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-NumberOfImages").text("画像数")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-NumberOfImages")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "AccessionNumber") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-AccessionNumber").text("受付番号")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-AccessionNumber-View").addClass("SearchMenu-Input-Center StudyList-Body-AccessionNumber SearchMenu-Input-Side-Disable")
                    .append($("<input>").attr("id", "SearchMenu-Input-AccessionNumber")));
            return true;
        }
        if (this.toString() == "PatientsSex") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-PatientsSex").text("性別")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-PatientsSex")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "PatientsAge") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-PatientsAge").text("年齢")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-PatientsAge")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "PatientsBirthDate") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-PatientsBirthDate").text("生年月日")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-PatientsBirthDate")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "StudyDescription") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyDescription").text("検査記述")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-StudyDescription")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "StudyTime") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyTime").text("検査時間")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-StudyTime")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "UploadDate") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-UploadDate").text("登録日")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-UploadDate-View").addClass("SearchMenu-Input-Center StudyList-Body-UploadDate SearchMenu-Input-Side-Enable")
                    .append($("<input>").attr("id", "SearchMenu-Input-UploadDate"))
                    .append($("<div>").attr("id", "SearchMenu-Input-UploadDate-Side")));
            return true;
        }
        if (this.toString() == "UploadDateTime") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-UploadDateTime").text("登録日時")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-UploadDateTime-View").addClass("SearchMenu-Input-Center StudyList-Body-UploadDateTime SearchMenu-Input-Side-Enable")
                    .append($("<input>").attr("id", "SearchMenu-Input-UploadDateTime"))
                    .append($("<div>").attr("id", "SearchMenu-Input-UploadDateTime-Side")));
            return true;
        }
        if (this.toString() == "StudyDateTime") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyDateTime").text("検査日時")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-StudyDateTime-View").addClass("SearchMenu-Input-Center StudyList-Body-StudyDateTime SearchMenu-Input-Side-Enable")
                    .append($("<input>").attr("id", "SearchMenu-Input-StudyDateTime"))
                    .append($("<div>").attr("id", "SearchMenu-Input-StudyDateTime-Side")));
            return true;
        }
        if (this.toString() == "Memo") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Memo")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-Memo")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "Keyword") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Keyword").text($("#ViewerConfig").data("KeywordTitle"))
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-Keyword-View").addClass("SearchMenu-Input-Center StudyList-Body-Keyword SearchMenu-Input-Side-Enable")
                    .append($("<input>").attr("id", "SearchMenu-Input-Keyword"))
                    .append($("<div>").attr("id", "SearchMenu-Input-Keyword-Side")));
            return true;
        }
        if (this.toString() == "Comment") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Comment").text("コメント")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").attr("id", "SearchMenu-Input-Comment-View").addClass("SearchMenu-Input-Center StudyList-Body-Comment SearchMenu-Input-Side-Disable")
                    .append($("<input>").attr("id", "SearchMenu-Input-Comment")));
            return true;
        }
        if (this.toString() == "StudyPassword") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyPassword")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-StudyPassword")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "Portal") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Portal")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-Portal")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "ShortURL") {
            col++;
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-ShortURL")
                    .append($("<span>")));
            $("#SearchMenu-Input-Right")
                .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-ShortURL")
                    .append($("<span>")));
            return true;
        }
    });
    $("#StudyList-Head-Right")
        .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Right-Margin"));
    $("#SearchMenu-Input-Right")
        .before($("<th>").addClass("SearchMenu-Input-Center StudyList-Body-Right-Margin")
            .append($("<span>")));
    $("#StudyList-Head-Right")
        .before($("<th>").attr("id", "StudyList-Head-Right-Margin"));
    $("#SearchMenu-Input-Right")
        .before($("<th>").addClass("SearchMenu-Input-Center")
            .append($("<span>")));
    $("#StudyList-Table-Foot").attr("colspan", col);

    // ユーザー情報設定
    if ($("#ViewerConfig").data("UserName") != "") {
        $("#UserInfo").text($("#ViewerConfig").data("UserName"));
    }

    // Androidバージョン取得
    var andver = Common_GetAndroidVersion();
    if (andver) {
        // Android 4.0.4以前はoverflowをhiddenにする
        if ((andver[0] < 4) || (andver[0] == 4 && andver[1] == 0 && andver[2] <= 4)) {
            $("#StudyList-Table").css("overflow", "hidden");
            $("#SeriesList-Body-View").css("overflow", "hidden");
            $("#SearchMenu-Command-Sub-Menu").css("overflow", "hidden");
            $("#SearchMenu-Command-Sub-Option").css("overflow", "hidden");
            $("#SearchMenu-Input-Sub-HospitalName").css("overflow", "hidden");
            $("#SearchMenu-Input-Sub-StudyDate").css("overflow", "hidden");
            $("#SearchMenu-Input-Sub-Modality").css("overflow", "hidden");
            $("#SearchMenu-Input-Sub-UploadDate").css("overflow", "hidden");
            $("#SearchMenu-Input-Sub-UploadDateTime").css("overflow", "hidden");
            $("#SearchMenu-Input-Sub-StudyDateTime").css("overflow", "hidden");
            $("#SearchMenu-Input-Sub-Keyword").css("overflow", "hidden");
        }
    }

    // 各種初期処理呼び出し
    SearchMenu_Init();
    SearchStudyList_Init();
    SearchSeriesList_Init();

    // リサイズ処理
    SearchWindow_Resize_Proc();

    // 初期化完了のため表示
    $("body").css("visibility", "visible");

    // 初期フォーカス設定
    if ($("#SearchMenu-Input-PatientID").is(":enabled")) {
        $("#SearchMenu-Input-PatientID").focus();
    }
    else {
        $("body").focus();
    }

    // 自動ログアウト
    Common_AutoLogout(true, $("#ViewerConfig").data("LogoutTime"));
    
    // URLコールで呼ばれた場合
    if ($("#ViewerConfig").data("login") == "2") {
        // パラメータチェック
        var defParams = Common_ParseUrlParams($("#ViewerConfig").data("DefSearch"), true);
        if (("hospid" in defParams) ||
            ("date" in defParams) ||
            ("patid" in defParams) ||
            ("patname" in defParams) ||
            ("mod" in defParams) ||
            ("upload" in defParams) ||
            ("accno" in defParams) ||
            ("keyword" in defParams) ||
            ("comment" in defParams) ||
            $("#ViewerConfig").data("prmpatientid") != "" ||
            $("#ViewerConfig").data("prmmodality") != "" ||
            $("#ViewerConfig").data("prmdate") != "" ||
            $("#ViewerConfig").data("prmaccessionno") != "") {
            // 検索ボタンクリック処理
            SearchMenu_Search_Button_Click();
        }
    }

    // イベント設定
    $("body").on({
        // IE独自イベントの選択機能停止設定
        "selectstart": function (e) {
            if ($(e.target).is(":input")) {
                return true;
            }
            return false;
        },
        // ドラッグ機能キャンセル
        "dragstart": function () {
            return false;
        },
        // ヘルプ機能キャンセル
        "help": function () {
            return false;
        },
        // デフォルト動作停止設定
        "touchstart mousedown": function (e) {
            // 自動ログアウト用更新処理
            Common_AutoLogoutUpdate();

            // 入力時は何もしない
            if ($(e.target).is(":input") && $(e.target).attr("type") != "button") {
                return;
            }

            // ラベル要素が親にいる場合は何もしない
            if ($(e.target).closest("label").length == 1) {
                return;
            }

            // デフォルト動作停止
            e.preventDefault();

            // IE10で選択中の場合ソフトウェアキーボードがキャンセルできないため追加
            if (document.selection) {
                try {
                    document.selection.empty();
                }
                catch (ex) { }
            }

            // 入力中をキャンセルするためフォーカスを外す
            $(":input").blur();

            // フォーカス設定
            $(this).focus();
        },
        // マウス上乗せイベント設定
        "mouseover": function () {
            // 自動ログアウト用更新処理
            Common_AutoLogoutUpdate();
        },
        // キーイベント用設定
        "keydown keyup": function (e) {
            if (!$(e.target).is("body")) {
                return;
            }
            if ($("#CommonLayer").is(":visible")) {
                return;
            }
            switch (e.type) {
                case "keydown":
                    switch (e.which) {
                        case 65:    // A
                            if (e.ctrlKey) {
                                // デフォルト動作停止
                                e.preventDefault();
                            }
                            break;
                    }
                    break;
                case "keyup":
                    switch (e.which) {
                        case 65:    // A
                            if (e.ctrlKey) {
                                // 検査選択処理
                                SearchStudyList_Select(null, "all");
                            }
                            break;
                    }
                    break;
            }
        }
    });

    // イベント設定
    $("body").on({
        "focus": function (e) {
            // デフォルト動作停止
            e.preventDefault();
            clearTimeout(InputTimeout);
            InputTimeout = null;
        },
        "blur": function () {
            // 遅延処理
            if (InputTimeout == null) {
                InputTimeout = setTimeout(function () {
                    // iOS7で画面レイアウトが崩れるため暫定追加
                    $("body").scrollTop(0);
                    $("body").scrollLeft(0);
                    InputTimeout = null;
                }, 0);
            }
        }
    }, "input, textarea");

    // イベント設定
    $(window).on({
        // フォーカス処理設定
        "focus": function () {
            var ver = $("#ViewerConfig").data("iOSVersion");
            if (ver && ver >= 7) {
                // iOS8でタブにより画面レイアウトが崩れるため暫定追加
                setTimeout(function () {
                    $("body").height($(window).height());
                    setTimeout(function () {
                        $("body").height(window.innerHeight);
                    }, 100);
                }, 100);
            }
        },
        // 全体のリサイズ処理設定
        "resize": function () {
            var ver = $("#ViewerConfig").data("iOSVersion");
            if ($("#ViewerConfig").data("IEVersion") <= 7) {
                // IE7以下は遅延で処理する
                setTimeout(function () {
                    // リサイズ処理
                    SearchWindow_Resize_Proc();
                }, 100);
            }
            else if (ver && ver >= 7) {
                // iOS7以上は遅延で処理する
                // iOS8でタブにより画面レイアウトが崩れるため暫定追加
                setTimeout(function () {
                    $("body").height($(window).height());
                    setTimeout(function () {
                        $("body").height(window.innerHeight);

                        // リサイズ処理
                        SearchWindow_Resize_Proc();
                    }, 100);
                }, 100);
            }
            else {
                // リサイズ処理
                SearchWindow_Resize_Proc();
            }
        },
        // 向き変更イベント設定
        "orientationchange": function () {
            // 入力中をキャンセルするためフォーカスを外す
            $(":input").blur();

            // フォーカス設定
            $("body").focus();

            // iOS7で画面レイアウトが崩れるため暫定追加
            $("body").scrollTop(0);
            $("body").scrollLeft(0);
        },
        // 全体の終了処理
        "unload": function () {
            // 子ウィンドウを閉じる
            Common_ChildWindowClose();
        }
    });

    // イベント設定
    $(document).on("touchstart mousedown", function (e) {
        // 処理対象外チェック
        if ($(e.target).is("#SearchMenu-Command-Menu")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Command-Sub-Menu")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Command-Sub-Menu .SearchMenu-Command-Sub-Menu-Item")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Command-Option")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Command-Sub-Option")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Command-Sub-Option .SearchMenu-Command-Sub-Option-Item")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-HospitalName-Side")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-HospitalName")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-HospitalName .SearchMenu-Input-Sub-HospitalName-Item")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-StudyDate-Side")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-StudyDate")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-StudyDate .SearchMenu-Input-Sub-StudyDate-Item")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-StudyDateTime-Side")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-StudyDateTime")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-StudyDateTime .SearchMenu-Input-Sub-StudyDateTime-Item")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Modality-Side")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-Modality")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-Modality .SearchMenu-Input-Sub-Modality-Item")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-UploadDate-Side")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-UploadDate")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-UploadDate .SearchMenu-Input-Sub-UploadDate-Item")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-UploadDateTime-Side")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-UploadDateTime")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-UploadDateTime .SearchMenu-Input-Sub-UploadDateTime-Item")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Keyword-Side")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-Keyword")) {
            return;
        }
        if ($(e.target).is("#SearchMenu-Input-Sub-Keyword .SearchMenu-Input-Sub-Keyword-Item")) {
            return;
        }

        // サブメニューキャンセル処理
        SearchMenu_Cancel();
    });
    
    // Ajax通信イベント設定
    $("#WebStatus").on({
        // Ajax通信状態表示設定
        "ajaxStart": function () {
            // 表示設定
            $(this).text("Loading...");
        },
        // Ajax通信状態表示解除設定
        "ajaxStop": function () {
            // 表示解除
            $(this).text("");
        }
    });
}

// パラメータ取得結果
function SearchWindow_GetParams_Result(result) {
    // パラメータ設定
    $("#ViewerConfig").data("login", ("login" in result.d.Params) ? result.d.Params.login : "");
    $("#ViewerConfig").data("prmhospitalid", ("prmhospitalid" in result.d.Params) ? result.d.Params.prmhospitalid : "");
    $("#ViewerConfig").data("prmpatientid", ("prmpatientid" in result.d.Params) ? result.d.Params.prmpatientid : "");
    $("#ViewerConfig").data("prmmodality", ("prmmodality" in result.d.Params) ? result.d.Params.prmmodality : "");
    $("#ViewerConfig").data("prmdate", ("prmdate" in result.d.Params) ? result.d.Params.prmdate : "");
    $("#ViewerConfig").data("prmaccessionno", ("prmaccessionno" in result.d.Params) ? result.d.Params.prmaccessionno : "");
    $("#ViewerConfig").data("figurepassword", ("figurepassword" in result.d.Params) ? result.d.Params.figurepassword : "");

    if ("ishospital" in result.d.Params) {
        // 病院一覧取得
        Search_GetHospitalList(null, SearchWindow_GetHospitalList_Result); // 取得後「病院一覧取得結果」呼び出し
    }
    else {
        // ポータルID設定
        $("#ViewerConfig").data("PortalName", "");

        // 一覧設定
        var hospitems = [];
        var hosp = {};
        hosp["Name"] = "";
        hosp["ID"] = "";
        hospitems.push(hosp);
        $("#ViewerConfig").data("Hospital", hospitems);

        // ユーザーコンフィグ取得
        Search_GetUserConfig(null, SearchWindow_GetUserConfig_Result); // 取得後「ユーザーコンフィグ取得結果」呼び出し
    }
}

// 病院一覧取得結果
function SearchWindow_GetHospitalList_Result(result) {
    // ポータルID設定
    $("#ViewerConfig").data("PortalName", result.d.PortalName ? result.d.PortalName : "");

    // 一覧設定
    $("#ViewerConfig").data("Hospital", result.d.Items);

    // ユーザーコンフィグ取得
    Search_GetUserConfig(null, SearchWindow_GetUserConfig_Result); // 取得後「ユーザーコンフィグ取得結果」呼び出し
}

// ユーザーコンフィグ取得結果
function SearchWindow_GetUserConfig_Result(result) {
    // 各種コンフィグ設定
    $("#ViewerConfig").data("Preset", ("Preset" in result.d.Items) ? result.d.Items.Preset : "");
    $("#ViewerConfig").data("StudyDate", ("StudyDate" in result.d.Items) ? result.d.Items.StudyDate : "");
    $("#ViewerConfig").data("Modality", ("Modality" in result.d.Items) ? result.d.Items.Modality : "");
    $("#ViewerConfig").data("AllSearch", ("AllSearch" in result.d.Items) ? result.d.Items.AllSearch : "");
    $("#ViewerConfig").data("DefSearch", ("DefSearch" in result.d.Items) ? result.d.Items.DefSearch : "");
    $("#ViewerConfig").data("MultiView", ("MultiView" in result.d.Items) ? result.d.Items.MultiView : "");
    $("#ViewerConfig").data("LogoutTime", ("LogoutTime" in result.d.Items) ? result.d.Items.LogoutTime : "");
    $("#ViewerConfig").data("IsPacsSearch", ("IsPacsSearch" in result.d.Items) ? result.d.Items.IsPacsSearch : "");
    $("#ViewerConfig").data("IsKeyword", ("IsKeyword" in result.d.Items) ? result.d.Items.IsKeyword : "");
    $("#ViewerConfig").data("IsShortURL", ("IsShortURL" in result.d.Items) ? result.d.Items.IsShortURL : "");
    $("#ViewerConfig").data("IsDelete", ("IsDelete" in result.d.Items) ? result.d.Items.IsDelete : "");
    $("#ViewerConfig").data("IsChangePass", ("IsChangePass" in result.d.Items) ? result.d.Items.IsChangePass : "");
    $("#ViewerConfig").data("IsUsedSize", ("IsUsedSize" in result.d.Items) ? result.d.Items.IsUsedSize : "");
    $("#ViewerConfig").data("IsUploader", ("IsUploader" in result.d.Items) ? result.d.Items.IsUploader : "");
    $("#ViewerConfig").data("IsComment", ("IsComment" in result.d.Items) ? result.d.Items.IsComment : "");
    if (("SearchStudyColumn" in result.d.Items) && result.d.Items.SearchStudyColumn != "") {
        $("#ViewerConfig").data("SearchStudyColumn", result.d.Items.SearchStudyColumn);
    }
    else {
        $("#ViewerConfig").data("SearchStudyColumn", "HospitalName,StudyDate,PatientID,PatientsName,Modality,BodyPartExamined,NumberOfImages,AccessionNumber,PatientsSex,PatientsAge,PatientsBirthDate,StudyTime");
    }
    $("#ViewerConfig").data("UserName", ("UserName" in result.d.Items) ? result.d.Items.UserName : "");
    $("#ViewerConfig").data("IsCsvFormat", ("IsCsvFormat" in result.d.Items) ? result.d.Items.IsCsvFormat : "");
    $("#ViewerConfig").data("Keyword", ("Keyword" in result.d.Items) ? result.d.Items.Keyword : "");
    $("#ViewerConfig").data("AssistPatientID", ("AssistPatientID" in result.d.Items) ? result.d.Items.AssistPatientID : "");
    $("#ViewerConfig").data("AssistPatientsName", ("AssistPatientsName" in result.d.Items) ? result.d.Items.AssistPatientsName : "");
    $("#ViewerConfig").data("SearchHelpUrl", ("SearchHelpUrl" in result.d.Items) ? result.d.Items.SearchHelpUrl : "");
    $("#ViewerConfig").data("SearchCheck", ("SearchCheck" in result.d.Items) ? result.d.Items.SearchCheck : "");
    $("#ViewerConfig").data("KeywordTitle", "");
    $("#ViewerConfig").data("KeywordShortURL", "");
    if ("KeywordOption" in result.d.Items) {
        // キーワードオプションを分離する
        var option = result.d.Items.KeywordOption.split(",");
        for (var i = 0; i < option.length; i++) {
            if (option[i] == "") {
                continue;
            }
            if (i == 0) {
                $("#ViewerConfig").data("KeywordTitle", option[i]);
            }
            else if (i == 1) {
                $("#ViewerConfig").data("KeywordShortURL", option[i]);
            }
        }
    }
    // キーワードタイトルは空の場合のみ使用する
    if ($("#ViewerConfig").data("KeywordTitle") == "") {
        $("#ViewerConfig").data("KeywordTitle", ("KeywordTitle" in result.d.Items) ? result.d.Items.KeywordTitle : "");
    }
    $("#ViewerConfig").data("IsPortal", ("IsPortal" in result.d.Items) ? result.d.Items.IsPortal : "");
    $("#ViewerConfig").data("IsPortalMst", ("IsPortalMst" in result.d.Items) ? result.d.Items.IsPortalMst : "");
    $("#ViewerConfig").data("PortalURL", "");
    if ("PortalURL" in result.d.Items) {
        // ポータル名に置換
        $("#ViewerConfig").data("PortalURL", result.d.Items.PortalURL.replace(/{[0]}/g, $("#ViewerConfig").data("PortalName")));
    }
    $("#ViewerConfig").data("TopLinkURL", ("TopLinkURL" in result.d.Items) ? result.d.Items.TopLinkURL : "");
    $("#ViewerConfig").data("IsStudyPassword", ("IsStudyPassword" in result.d.Items) ? result.d.Items.IsStudyPassword : "");
    $("#ViewerConfig").data("SearchStudyColumnWidth", ("SearchStudyColumnWidth" in result.d.Items) ? result.d.Items.SearchStudyColumnWidth : "");
    $("#ViewerConfig").data("IsDeleteImage", ("IsDeleteImage" in result.d.Items) ? result.d.Items.IsDeleteImage : "");

    // コンフィグ取得完了
    $("#ViewerConfig").data("GetConfig", true);
}

// Ajax通信中判定
function SearchWindow_IsAjaxSend() {
    return ($("#WebStatus").text() != "") ? true : false;
}

// シリーズ情報ボタン開始処理
function SearchWindow_SeriesInfo_Start() {
    // アイコン変更
    var $obj = $("#SeriesList-Head-Right");
    if ($obj.hasClass("SeriesList-Head-Right-Down-OFF")) {
        $obj.removeClass("SeriesList-Head-Right-Down-OFF").addClass("SeriesList-Head-Right-Down-ON");
    }
    else if ($obj.hasClass("SeriesList-Head-Right-Up-OFF")) {
        $obj.removeClass("SeriesList-Head-Right-Up-OFF").addClass("SeriesList-Head-Right-Up-ON");
    }
}

// シリーズ情報ボタンキャンセル処理
function SearchWindow_SeriesInfo_Cancel() {
    // アイコン変更
    var $obj = $("#SeriesList-Head-Right");
    if ($obj.hasClass("SeriesList-Head-Right-Down-ON")) {
        $obj.removeClass("SeriesList-Head-Right-Down-ON").addClass("SeriesList-Head-Right-Down-OFF");
    }
    else if ($obj.hasClass("SeriesList-Head-Right-Up-ON")) {
        $obj.removeClass("SeriesList-Head-Right-Up-ON").addClass("SeriesList-Head-Right-Up-OFF");
    }
}

// シリーズ情報ボタン確定処理
function SearchWindow_SeriesInfo_Fix() {
    // 状態判定
    var $obj = $("#SeriesList-Head-Right");
    if ($obj.hasClass("SeriesList-Head-Right-Down-ON")) {
        // 非表示
        $("#SeriesList-Body").hide();

        // リサイズ処理
        SearchWindow_Resize_Proc();

        // アイコン変更
        $obj.removeClass("SeriesList-Head-Right-Down-ON").addClass("SeriesList-Head-Right-Up-OFF");
    }
    else if ($obj.hasClass("SeriesList-Head-Right-Up-ON")) {
        // 表示
        $("#SeriesList-Body").show();

        // リサイズ処理
        SearchWindow_Resize_Proc();

        // アイコン変更
        $obj.removeClass("SeriesList-Head-Right-Up-ON").addClass("SeriesList-Head-Right-Down-OFF");
    }
}

// セパレータ(縦)リサイズ処理
function SearchWindow_Separator_Length_Resize(height) {
    // 範囲チェック
    if (height < $("#SeriesList-View thead").height()) {
        return;
    }
    else if (height >= $(window).height() - $("#SearchHead").height() - $("#StudyList").height() - $("#Separator").height()) {
        return;
    }
    else if ($("#SeriesList-Body").is(":hidden")) {
        return;
    }

    // Tableの高さを0で指定すると自動にサイズになるため補正する(IE6)
    if ($("#ViewerConfig").data("IEVersion") === 6) {
        if (height == $("#SeriesList-View thead").height()) {
            height++;
        }
    }

    // 各種エレメント設定
    $("#SeriesList-Body-View").height(height - $("#SeriesList-View thead").height());

    // リサイズ処理
    SearchWindow_Resize_Proc();
}

// リサイズ処理
function SearchWindow_Resize_Proc() {
    // 幅算出
    var width = $(window).width();  //全体の幅

    // 幅更新
    $("#StudyList").width(width);
    $("#StudyList-Table").width(width);

    // 高さ算出
    // iOS8でタブにより画面レイアウトが崩れるため暫定追加
    var height = window.innerHeight ? window.innerHeight : $(window).height();    //全体の高さ
    height -= $("#SearchHead").height();
    height -= $("#StudyList-View").height();
    height -= $("#SearchFoot").height();

    // 高さ更新
    $("#StudyList-Table").height(height);

    // スクロールバーが有効の場合
    if ($("#ViewerConfig").data("ScrollBarWidth") != 0) {
        // 横スクロールバー確認
        var scrollX = 0;
        if ($("#StudyList-Table-View").width() > $("#StudyList-Table").width()) {
            scrollX = $("#ViewerConfig").data("ScrollBarWidth");
        }

        // 縦スクロールバー確認
        var scrollY = $("#ViewerConfig").data("ScrollBarWidth");
        var margin = $("#StudyList-Table-View .StudyList-Body-Right-Margin");
        var marginWidth = parseInt(margin.css("width"));
        if ($("#StudyList-Table-View").height() > $("#StudyList-Table").height() - scrollX) {
            // 縦スクロールバーを含む幅に変更
            $("#StudyList-Table-View").width($("#StudyList-View").width() - scrollY);
            if (marginWidth > scrollY) {
                margin.css("width", marginWidth - scrollY);
            }
        }
        else {
            // 縦スクロールバーを含まない幅に変更
            $("#StudyList-Table-View").width($("#StudyList-View").width());
            margin.css("width", "");
        }
    }
    else {
        // 縦スクロールバーを含まない幅に変更
        $("#StudyList-Table-View").width($("#StudyList-View").width());
    }

    // ヘッダの横スクロールバーを更新
    $("#StudyList").scrollLeft($("#StudyList-Table").scrollLeft());

    // メニュー領域オーバーレイ処理
    SearchMenu_Overlay();

    // サブメニューキャンセル処理
    SearchMenu_Cancel();
}
