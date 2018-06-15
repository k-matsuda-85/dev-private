/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var InputTimeout = null;
var viewer;

// 起動処理
$(window).load(function () {
    // 画像読み込み処理
    ViewerWindow_LoadImages();

    // Viewer初期化
    viewer = new ViewerPanel($("#ViewerLib").get(0));

    // サイズが0の場合があるのでタイマでチェックする
    var timerID = setInterval(function () {
        // サイズチェック
        if ($(window).width() == 0 || $(window).height() == 0) {
            return;
        }

        // タイマ終了
        clearInterval(timerID);

        // 初期化処理
        ViewerWindow_Init();
    }, 100);
});

// 初期化処理
function ViewerWindow_Init() {
    // ViewerConfigに時間情報設定
    var dd = new Date();
    $("#ViewerConfig").data("time", dd.getTime());

    // ViewerConfigにIEバージョン設定
    $("#ViewerConfig").data("IEVersion", Common_GetIeVersion());

    // ViewerConfigにiOSバージョン設定
    $("#ViewerConfig").data("iOSVersion", Common_GetiOSVersion());

    // ViewerConfigにスクロールバー幅設定
    $("#ViewerConfig").data("ScrollBarWidth", Common_ScrollBarWidth());

    // URLパラメータ取得
    var params = Common_GetUrlParams();

    // SKey初期化
    if ("sk" in params) {
        _Viewer_SKey = Viewer_GetStringJson(params["sk"]);
        $("#ViewerConfig").data("sk", params["sk"]);
    }
    else {
        $("#ViewerConfig").data("sk", "");
    }

    // ユーザーコンフィグ取得
    $("#ViewerConfig").data("GetConfig", false); // コンフィグ取得完了初期化
    Viewer_GetParams(null, ViewerWindow_GetParams_Result, 1); // 取得後「パラメータ取得結果」呼び出し
    if ($("#ViewerConfig").data("GetConfig") == false) {
        return;
    }

    // URLコールで呼ばれた場合
    if ($("#ViewerConfig").data("sk") != "") {
        // Cookieより表示位置を取得
        var dispType = Common_GetCookie("DispType");
        if (dispType != "") {
            // パラメータチェック
            dispType = dispType.split(",");
            if (!isNaN(parseInt(dispType[0])) &&
            !isNaN(parseInt(dispType[1])) &&
            !isNaN(parseInt(dispType[2])) &&
            !isNaN(parseInt(dispType[3]))) {
                // 表示位置設定
                Common_SetWindow(parseInt(dispType[0]), parseInt(dispType[1]), parseInt(dispType[2]), parseInt(dispType[3]));
            }
        }
    }

    // 検査一覧表示列作成
    $("#StudyList-Head-Right")
        .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Left-Margin")
            .append($("<span>")));
    $.each($("#ViewerConfig").data("ViewerStudyColumn").split(","), function () {
        if (this.toString() == "Showing") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Showing")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "StudyDate") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyDate").text("検査日")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "Modality") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Modality").text("種別")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "BodyPartExamined") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-BodyPartExamined").text("部位")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "NumberOfImages") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-NumberOfImages").text("画像数")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "AccessionNumber") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-AccessionNumber").text("受付番号")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "StudyDescription") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyDescription").text("検査記述")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "StudyTime") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyTime").text("検査時間")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "UploadDate") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-UploadDate").text("登録日")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "UploadDateTime") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-UploadDateTime").text("登録日時")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "StudyDateTime") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyDateTime").text("検査日時")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "Memo") {
            // 権限確認
            if ($("#ViewerConfig").data("StudyMemo") != "1" &&
                $("#ViewerConfig").data("StudyMemo") != "2" &&
                $("#ViewerConfig").data("StudyMemo") != "3") {
                return true;
            }
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Memo")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "Keyword") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Keyword").text($("#ViewerConfig").data("KeywordTitle"))
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "Comment") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Comment").text("コメント")
                    .append($("<span>")));
            return true;
        }
        if (this.toString() == "StudyPassword") {
            $("#StudyList-Head-Right")
                .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-StudyPassword")
                    .append($("<span>")));
            return true;
        }
    });
    $("#StudyList-Head-Right")
        .before($("<th>").addClass("StudyList-Head-Center StudyList-Body-Right-Margin")
            .append($("<span>")));
    $("#StudyList-Head-Right")
        .before($("<th>").attr("id", "StudyList-Head-Right-Margin")
            .append($("<span>")));
    $("#StudyList-Body").attr("colspan", $("#StudyList-View th").length);

    // Androidバージョン取得
    var andver = Common_GetAndroidVersion();
    if (andver) {
        // Android 4.0.4以前はoverflowをhiddenにする
        if ((andver[0] < 4) || (andver[0] == 4 && andver[1] == 0 && andver[2] <= 4)) {
            $("#StudyList-Table").css("overflow", "hidden");
            $("#SeriesList").css("overflow", "hidden");
        }
    }

    // 各種初期処理呼び出し
    ViewerToolArea_Init();
    ViewerStudyMemo_Init();
    ViewerStudyList_Init();
    ViewerSeriesList_Init();

    // 患者情報初期化
    ViewerPatientInfo_Init();

    // iOS8で画面レイアウトが崩れるため暫定追加
    $("body").scrollTop(0);
    $("body").scrollLeft(0);

    // リサイズ処理
    ViewerWindow_Resize_Proc();

    // URLコールで呼ばれた場合
    if ($("#ViewerConfig").data("sk") != "") {
        // 自動ログアウト
        Common_AutoLogout(false, $("#ViewerConfig").data("LogoutTime"));
    }

    // 遅延処理を行う
    setTimeout(function () {
        // 初期化完了のため表示
        $("body").css("visibility", "visible");

        // 初期フォーカス設定
        $("body").focus();
    }, 100);

    // イベント設定
    $("body").on({
        // IE独自イベントの選択機能停止設定
        "selectstart": function (e) {
            if ($(e.target).is(":input")) {
                return true;
            }
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
            $(this).focus()
        },
        // マウス上乗せイベント設定
        "mouseover": function () {
            // 自動ログアウト用更新処理
            Common_AutoLogoutUpdate();
        },
        // マウスアップイベント設定
        "mouseup": function (e) {
            // 右クリックの場合
            if (e.button == 2) {
                // メニュー上書き(解除)
                Tool_Menu.Overwrite("");
            }
        },
        // コンテキストメニューイベント設定
        "contextmenu": function () {
            // メニュー上書き(解除)
            Tool_Menu.Overwrite("");
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
            if (ver && ver >= 7) {
                // iOS7以上は遅延で処理する
                // iOS8でタブにより画面レイアウトが崩れるため暫定追加
                setTimeout(function () {
                    $("body").height($(window).height());
                    setTimeout(function () {
                        $("body").height(window.innerHeight);

                        // リサイズ処理
                        ViewerWindow_Resize_Proc();
                    }, 100);
                }, 100);
            }
            else {
                // リサイズ処理
                ViewerWindow_Resize_Proc();
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
        if ($(e.target).is("#Tool-WindowLevel-Side")) {
            return;
        }
        if ($(e.target).is("#Tool-WindowLevel-Side-Sub")) {
            return;
        }
        if ($(e.target).is("#Tool-WindowLevel-Side-Sub .Tool-WindowLevel-Side-Sub-Item")) {
            return;
        }
        if ($(e.target).is("#Tool-Measure-Side")) {
            return;
        }
        if ($(e.target).is("#Tool-Measure-Side-Sub div")) {
            return;
        }
        if ($(e.target).is("#Tool-Split")) {
            return;
        }
        if ($(e.target).is("#Tool-Split-Sub-Series div, #Tool-Split-Sub-Image div")) {
            return;
        }
        if ($(e.target).is("#Tool-SeriesSync-Side")) {
            return;
        }
        if ($(e.target).is("#Tool-SeriesSync-Side-Sub div")) {
            return;
        }
        if ($(e.target).is("#Tool-SkipImage")) {
            return;
        }
        if ($(e.target).is("#Tool-SkipImage-Sub div")) {
            return;
        }
        if ($(e.target).is("#Tool-Rotate")) {
            return;
        }
        if ($(e.target).is("#Tool-Rotate-Sub")) {
            return;
        }
        if ($(e.target).is("#Tool-Rotate-Sub .Tool-Rotate-Sub-Item")) {
            return;
        }
        if ($(e.target).is("#Tool-ThinOut-Side")) {
            return;
        }
        if ($(e.target).is("#Tool-ThinOut-Side-Sub")) {
            return;
        }
        if ($(e.target).is("#Tool-ThinOut-Side-Sub .Tool-ThinOut-Side-Sub-Item")) {
            return;
        }
        if ($(e.target).is("#Tool-GSPS-Side")) {
            return;
        }
        if ($(e.target).is("#Tool-GSPS-Side-Sub")) {
            return;
        }
        if ($(e.target).is("#Tool-GSPS-Side-Sub .Tool-GSPS-Side-Sub-Item")) {
            return;
        }

        // サブメニューキャンセル処理
        Tool_Menu.SubMenuCancel();

        // Viewerのイベントを元に戻す
        viewer.IsEnable = true;
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
function ViewerWindow_GetParams_Result(result) {
    // パラメータ設定
    $("#ViewerConfig").data("patientid", ("patientid" in result.d.Params) ? result.d.Params.patientid : "");
    $("#ViewerConfig").data("studykey", ("studykey" in result.d.Params) ? result.d.Params.studykey : "");
    $("#ViewerConfig").data("serieskey", ("serieskey" in result.d.Params) ? result.d.Params.serieskey : "");
    $("#ViewerConfig").data("portal", ("portal" in result.d.Params) ? result.d.Params.portal : null);
    $("#ViewerConfig").data("rsoutpath", ("rsoutpath" in result.d.Params) ? result.d.Params.rsoutpath : null);
    $("#ViewerConfig").data("findmodality", ("findmodality" in result.d.Params) ? result.d.Params.findmodality : "");
    $("#ViewerConfig").data("finddate", ("finddate" in result.d.Params) ? result.d.Params.finddate : "");
    $("#ViewerConfig").data("findaccessionno", ("findaccessionno" in result.d.Params) ? result.d.Params.findaccessionno : "");
    $("#ViewerConfig").data("isStudyPassword", ("isStudyPassword" in result.d.Params) ? result.d.Params.isStudyPassword : "");

    // ユーザーコンフィグ取得
    Viewer_GetUserConfig(null, ViewerWindow_GetUserConfig_Result); // 取得後「ユーザーコンフィグ取得結果」呼び出し
}

// ユーザーコンフィグ取得結果
function ViewerWindow_GetUserConfig_Result(result) {
    // 各種コンフィグ設定
    var option, i;
    $("#ViewerConfig").data("AnnotationColor", "");
    $("#ViewerConfig").data("AnnotationColorKako", "");
    if ("AnnotationColor" in result.d.Items) {
        // アノテーション色を加工する
        var color = result.d.Items.AnnotationColor.split(",");
        if (color.length == 2) {
            $("#ViewerConfig").data("AnnotationColor", color[0]);
            $("#ViewerConfig").data("AnnotationColorKako", color[1]);
        }
        else if (color.length == 3) {
            color[0] = parseInt(color[0]).toString(16);
            color[0] = (color[0].length == 1) ? "0" + color[0] : color[0];
            color[1] = parseInt(color[1]).toString(16);
            color[1] = (color[1].length == 1) ? "0" + color[1] : color[1];
            color[2] = parseInt(color[2]).toString(16);
            color[2] = (color[2].length == 1) ? "0" + color[2] : color[2];
            $("#ViewerConfig").data("AnnotationColor", "#" + color[0] + color[1] + color[2]);
            $("#ViewerConfig").data("AnnotationColorKako", "#" + color[0] + color[1] + color[2]);
        }
    }
    $("#ViewerConfig").data("ScoutLine", ("ScoutLine" in result.d.Items) ? result.d.Items.ScoutLine : "");
    $("#ViewerConfig").data("LogoutTime", ("LogoutTime" in result.d.Items) ? result.d.Items.LogoutTime : "");
    if (("ViewerTools" in result.d.Items) && result.d.Items.ViewerTools != "") {
        $("#ViewerConfig").data("ViewerTools", result.d.Items.ViewerTools);
    }
    else {
        $("#ViewerConfig").data("ViewerTools", ",Scale,Move,WindowLevel,,Measure,,Reset,,Split,,Cutline,SeriesSync,,ManualCine,SkipImagePrev,SkipImageNext,SkipImage,,Rotate,,Annotation,,Help,,,,Exit,,ToolAreaChange,");
    }
    $("#ViewerConfig").data("UserName", ("UserName" in result.d.Items) ? result.d.Items.UserName : "");
    $("#ViewerConfig").data("StudyMemo", ("StudyMemo" in result.d.Items) ? result.d.Items.StudyMemo : "");
    $("#ViewerConfig").data("StudyMemoWidth", "200");
    $("#ViewerConfig").data("StudyMemoSize", "80%");
    if ("StudyMemoOption" in result.d.Items) {
        // 検査メモオプションを分離する
        option = result.d.Items.StudyMemoOption.split(",");
        for (i = 0; i < option.length; i++) {
            if (option[i] == "") {
                continue;
            }
            if (i == 0) {
                $("#ViewerConfig").data("StudyMemoWidth", option[i]);
            }
            else if (i == 1) {
                $("#ViewerConfig").data("StudyMemoSize", option[i]);
            }
        }
    }
    $("#ViewerConfig").data("HelpUrl", ("HelpUrl" in result.d.Items) ? result.d.Items.HelpUrl : "");
    $("#ViewerConfig").data("ReportUrl", ("ReportUrl" in result.d.Items) ? result.d.Items.ReportUrl : "");
    $("#ViewerConfig").data("TopLinkURL", ("TopLinkURL" in result.d.Items) ? result.d.Items.TopLinkURL : "");
    $("#ViewerConfig").data("ThinOutCookie", "");
    $("#ViewerConfig").data("ThinOutUrlCall", "");
    if ("ThinOutOption" in result.d.Items) {
        // 間引きオプションを分離する
        option = result.d.Items.ThinOutOption.split(",");
        for (i = 0; i < option.length; i++) {
            if (option[i] == "") {
                continue;
            }
            if (i == 0) {
                $("#ViewerConfig").data("ThinOutCookie", option[i]);
            }
            else if (i == 1) {
                $("#ViewerConfig").data("ThinOutUrlCall", option[i]);
            }
        }
    }
    $("#ViewerConfig").data("MaxSeriesCache", ("MaxSeriesCache" in result.d.Items) ? result.d.Items.MaxSeriesCache : "");
    $("#ViewerConfig").data("PreLoadType", ("PreLoadType" in result.d.Items) ? result.d.Items.PreLoadType : "");
    $("#ViewerConfig").data("PreLoadCount", ("PreLoadCount" in result.d.Items) ? result.d.Items.PreLoadCount : "");
    $("#ViewerConfig").data("ViewerMouseAssist", ("ViewerMouseAssist" in result.d.Items) ? result.d.Items.ViewerMouseAssist : "");
    $("#ViewerConfig").data("ViewerShortcutKey", ("ViewerShortcutKey" in result.d.Items) ? result.d.Items.ViewerShortcutKey : "");
    if (("ViewerStudyColumn" in result.d.Items) && result.d.Items.ViewerStudyColumn != "") {
        $("#ViewerConfig").data("ViewerStudyColumn", result.d.Items.ViewerStudyColumn);
    }
    else {
        $("#ViewerConfig").data("ViewerStudyColumn", "Showing,StudyDate,Modality,BodyPartExamined,NumberOfImages,Memo");
    }
    $("#ViewerConfig").data("KeywordTitle", "");
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
        }
    }
    $("#ViewerConfig").data("ViewerStudyColumnWidth", ("ViewerStudyColumnWidth" in result.d.Items) ? result.d.Items.ViewerStudyColumnWidth : "");
    $("#ViewerConfig").data("IsPrefetchImage", ("IsPrefetchImage" in result.d.Items) ? result.d.Items.IsPrefetchImage : "");
    $("#ViewerConfig").data("DefGSPS", ("DefGSPS" in result.d.Items) ? result.d.Items.DefGSPS : "");
    $("#ViewerConfig").data("SkipImageLoop", ("SkipImageLoop" in result.d.Items) ? result.d.Items.SkipImageLoop : "");
    $("#ViewerConfig").data("SeriesCountCheckColor", "");
    if ("SeriesCountCheckColor" in result.d.Items) {
        // シリーズ目視色を分離する
        var color = result.d.Items.SeriesCountCheckColor.split(",");
        if (color.length == 4) {
            $("#ViewerConfig").data("SeriesCountCheckColor", color);
        }
    }
    $("#ViewerConfig").data("DefAnnotation", ("DefAnnotation" in result.d.Items) ? result.d.Items.DefAnnotation : "1");

    // モダリティコンフィグ取得
    Viewer_GetModalityConfig(null, ViewerWindow_GetModalityConfig_Result);
}

// モダリティコンフィグ設定
function ViewerWindow_GetModalityConfig_Result(result) {
    // コンフィグ設定
    $("#ViewerConfig").data("ModalityConfig", result.d.Items);

    // アノテーション取得
    Viewer_GetAnnotationList(null, ViewerWindow_GetAnnotationList_Result);
}

// アノテーション設定
function ViewerWindow_GetAnnotationList_Result(result) {
    // アノテーション設定
    $("#ViewerConfig").data("AnnotationList", result.d.Items);

    // コンフィグ取得完了
    $("#ViewerConfig").data("GetConfig", true);
}

// セパレータ(縦)リサイズ処理
function ViewerWindow_Separator_Length_Resize(height) {
    // 範囲チェック
    if (height < $("#StudyList-View thead").height()) {
        return;
    }
    else if (height >= $(window).height() - $("#ViewerHead").height()) {
        return;
    }
    else if ($("#PatientInfo-Body").is(":hidden")) {
        return;
    }

    // Tableの高さを0で指定すると自動にサイズになるため補正する(IE6)
    if ($("#ViewerConfig").data("IEVersion") === 6) {
        if (height == $("#StudyList-View thead").height()) {
            height++;
        }
    }

    // 各種エレメント設定
    $("#StudyList").height(height);
    $("#StudyList-Table").height(height - $("#StudyList-View thead").height());
    $("#SeriesList").height(height).css("marginTop", -height);

    // リサイズ処理
    ViewerWindow_Resize_Proc();
}

// セパレータ(横)リサイズ処理
function ViewerWindow_Separator_Side_Resize(width) {
    // 範囲チェック
    if (width < 0) {
        return;
    }
    else if (width >= $(window).width()) {
        width = $(window).width();
    }
    else if ($("#PatientInfo-Body").is(":hidden")) {
        return;
    }

    // 各種エレメント設定
    $("#StudyList").width(width);
    $("#SeriesList").css("marginLeft", width);
}

// リサイズ処理
function ViewerWindow_Resize_Proc() {
    // ViewerLib、StudyMemo更新
    // iOS8でタブにより画面レイアウトが崩れるため暫定追加
    var height = window.innerHeight ? window.innerHeight : $(window).height();  //全体の高さ
    height -= $("#ViewerHead").is(":visible") ? $("#ViewerHead").height() : 0;
    height -= $("#ViewerFoot").is(":visible") ? $("#ViewerFoot").height() : 0;
    $("#ViewerLib").height(height);
    $("#StudyMemo").height(height);

    // PatientInfo更新
    var inner = $("#PatientInfo-PatientID").width() + $("#PatientInfo-PatientsName").width() + $("#WebStatus").width() + 60; // マージンを考慮
    var outer = $("#PatientInfo-Head-Center").width();
    if ($("#PatientInfo-Head-Center-Far").width() == 1) {
        inner += $("#PatientInfo-Head-Center-Far").data("width");
    }
    if (inner > outer) {
        $("#PatientInfo-Head-Center-Far").width(1);
        $("#PatientInfo-Head-Center-Far a").hide();
    }
    else {
        $("#PatientInfo-Head-Center-Far").width($("#PatientInfo-Head-Center-Far").data("width"));
        $("#PatientInfo-Head-Center-Far a").show();
    }

    // ツール表示領域オーバーレイ処理
    ViewerToolArea_Overlay();

    // 検査メモ領域リサイズ処理
    ViewerStudyMemo_Resize_Proc();

    // サブメニューキャンセル処理
    Tool_Menu.SubMenuCancel();

    // Viewerのイベントを元に戻す
    viewer.IsEnable = true;
}
