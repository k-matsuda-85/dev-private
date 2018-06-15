/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 初期化処理
function SearchMenuCommand_Init() {
    var $commonLayer = $("#CommonLayer");
    // マージン作成
    var $command = $("#SearchMenu-Command-View");
    $command.append($("<div>").attr("id", "SearchMenu-Command-Left-Margin").addClass("SearchMenu-Command-Common"));

    // PACS検索ボタン要素作成
    if ($("#ViewerConfig").data("IsPacsSearch") == "1") {
        $command.append($("<div>").attr("id", "SearchMenu-Command-PacsSearch").addClass("SearchMenu-Command-Common SearchMenu-Command-PacsSearch-OFF"));
        $command.append($("<div>").attr("id", "SearchMenu-Command-PacsSearch-Margin").addClass("SearchMenu-Command-Common"));
    }

    // 操作ボタン要素作成
    var showMenu = false;
    var $subMenu = $("#SearchMenu-Command-Sub-Menu");
    // ポータル作成権限がある場合
    if ($("#ViewerConfig").data("IsPortal") == "1" && $("#ViewerConfig").data("PortalName") != "") {
        $subMenu.append($("<div>").addClass("SearchMenu-Command-Sub-Menu-Item").text("ポータル画面設定").data("command", "SetPortal"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Head-Title").text("ポータル画面設定")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Column1-Label")
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortal-Body-Label"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortal-Body-Notes").text("※16文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Column1-Text")
                    .append($("<input>").attr("maxlength", "16")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Column2-Label")
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortal-Body-Label"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortal-Body-Notes").text("※100文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Column2-Text")
                    .append($("<textarea>").attr("cols", "35").attr("rows", "3")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Column2-Count"))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Column3-Label")
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortal-Body-Label"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortal-Body-Notes").text("※500文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Column3-Text")
                    .append($("<textarea>").attr("cols", "35").attr("rows", "5")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Column3-Count"))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Enable")
                    .append($("<label>")
                        .append($("<input>").attr("type", "checkbox"))
                        .append($("<span>").text("ポータル画面表示ON"))))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Body-Message")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "設定")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortal-Foot-Cancel")
                    .append($("<input>").attr("type", "button").attr("value", "キャンセル")))));
        showMenu = true;
    }
    // キーワード設定権限がある場合
    if ($("#ViewerConfig").data("IsKeyword") == "1") {
        $subMenu.append($("<div>").addClass("SearchMenu-Command-Sub-Menu-Item").text("キーワード設定").data("command", "SetKeyword"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-SetKeyword")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetKeyword-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetKeyword-Head-Title").text("キーワード設定")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetKeyword-Body")
                .append($("<div>")
                    .append($("<input>").attr("id", "SearchMenu-Command-Menu-SetKeyword-Body-Input").attr("maxlength", "256"))))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetKeyword-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetKeyword-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "設定")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetKeyword-Foot-Cancel")
                    .append($("<input>").attr("type", "button").attr("value", "キャンセル")))));
        // 短縮URL制御が有効の場合
        if ($("#ViewerConfig").data("IsShortURL") == "1" && $("#ViewerConfig").data("KeywordShortURL") == "1") {
            $("#SearchMenu-Command-Menu-SetKeyword-Body").after($("<div>").attr("id", "SearchMenu-Command-Menu-SetKeyword-Body-Option")
                .append($("<input>").attr("id", "SearchMenu-Command-Menu-SetKeyword-Body-Option-Checkbox").attr("type", "checkbox").attr("checked", "checked"))
                .append($("<span>").text("空白時、短縮URLを削除")));
        }
        showMenu = true;
    }
    // コメント設定権限がある場合
    if ($("#ViewerConfig").data("IsComment") == "1") {
        $subMenu.append($("<div>").addClass("SearchMenu-Command-Sub-Menu-Item").text("コメント設定").data("command", "SetComment"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-SetComment")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetComment-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetComment-Head-Title").text("コメント設定")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetComment-Body")
                .append($("<div>")
                    .append($("<input>").attr("id", "SearchMenu-Command-Menu-SetComment-Body-Input").attr("maxlength", "256"))))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetComment-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetComment-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "設定")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetComment-Foot-Cancel")
                    .append($("<input>").attr("type", "button").attr("value", "キャンセル")))));
        showMenu = true;
    }
    // 検査パスワード設定権限がある場合
    if ($("#ViewerConfig").data("IsStudyPassword") == "1") {
        $subMenu.append($("<div>").addClass("SearchMenu-Command-Sub-Menu-Item").text("パスワード設定").data("command", "SetStudyPassword"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-SetStudyPassword")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetStudyPassword-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetStudyPassword-Head-Title").text("パスワード設定")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetStudyPassword-Body")
                .append($("<div>")
                    .append($("<input>").attr("id", "SearchMenu-Command-Menu-SetStudyPassword-Body-Input").attr("type", "password").attr("maxlength", "64"))))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetStudyPassword-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetStudyPassword-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "設定")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetStudyPassword-Foot-Cancel")
                    .append($("<input>").attr("type", "button").attr("value", "キャンセル")))));
        showMenu = true;
    }
    // 短縮URL表示権限がある場合
    if ($("#ViewerConfig").data("IsShortURL") == "1") {
        $subMenu.append($("<div>").addClass("SearchMenu-Command-Sub-Menu-Item").text("URL表示").data("command", "ShowURL"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-ShowURL")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-ShowURL-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ShowURL-Head-Title").text("URL")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-ShowURL-Body")
                .append($("<div>")
                    .append($("<input>").attr("id", "SearchMenu-Command-Menu-ShowURL-Body-Input").attr("readonly", "readonly"))
                    .append($("<input>").attr("id", "SearchMenu-Command-Menu-ShowURL-Body-Button").attr("type", "button"))))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-ShowURL-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ShowURL-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "OK")))));
        // デスクトップ以外の場合
        if (!Common_IsDesktop()) {
            $("#SearchMenu-Command-Menu-ShowURL-Body-Input").attr("readonly", null);
        }
        showMenu = true;
    }
    // 検査削除権限がある場合
    if ($("#ViewerConfig").data("IsDelete") == "1") {
        $subMenu.append($("<div>").addClass("SearchMenu-Command-Sub-Menu-Item").text("検査削除").data("command", "DeleteStudy"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteStudy")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteStudy-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteStudy-Head-Title").text("検査削除")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteStudy-Body")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteStudy-Body-Text")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteStudy-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteStudy-Foot-Cancel")
                    .append($("<input>").attr("type", "button").attr("value", "キャンセル")))));
        showMenu = true;
    }
    // 画像削除権限がある場合
    if ($("#ViewerConfig").data("IsDeleteImage") == "1") {
        $subMenu.append($("<div>").addClass("SearchMenu-Command-Sub-Menu-Item").text("画像削除").data("command", "DeleteImage"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Head-Title").text("画像削除")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-List")
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-List-Series"))
                    .append($("<label>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectSeries")
                        .append($("<input>").attr("type", "checkbox")))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-List-DeleteSeries")
                        .append($("<input>").attr("type", "button").attr("value", "シリーズ削除")))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-List-Image"))
                    .append($("<label>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectImage")
                        .append($("<input>").attr("type", "checkbox")))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-List-DeleteImage")
                        .append($("<input>").attr("type", "button").attr("value", "画像削除")))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-List-Message")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-Image")
                    .append($("<img>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-Image-View").attr("width", "256").attr("height", "256"))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-Image-NowLoading"))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-Image-InstanceNumber"))
                    .append($("<label>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-Image-Checkbox")
                        .append($("<input>").attr("type", "checkbox")))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-Image-Count"))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-Image-Prev")
                        .append($("<input>").attr("type", "button").attr("value", "前へ")))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-Image-Next")
                        .append($("<input>").attr("type", "button").attr("value", "次へ")))
                    .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Body-Image-Message").text("戻る場合は、画像をクリックして下さい"))))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-DeleteImage-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "閉じる")))));
        showMenu = true;
    }
    // 操作ボタン要素がある場合
    if (showMenu) {
        $command.append($("<div>").attr("id", "SearchMenu-Command-Menu").addClass("SearchMenu-Command-Common SearchMenu-Command-Menu-OFF"));
        $command.append($("<div>").attr("id", "SearchMenu-Command-Menu-Margin").addClass("SearchMenu-Command-Common"));
    }

    // オプションボタン要素作成
    var showOption = false;
    var $subOption = $("#SearchMenu-Command-Sub-Option");
    // ポータルマスタ設定権限がある場合
    if ($("#ViewerConfig").data("IsPortalMst") == "1" && $("#ViewerConfig").data("PortalName") != "") {
        $subOption.append($("<div>").addClass("SearchMenu-Command-Sub-Option-Item").text("ポータルマスタ設定").data("command", "SetPortalMst"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Head-Title").text("ポータルマスタ設定")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Title-Label")
                    .append($("<span>").text("タイトル"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortalMst-Body-Notes").text("※32文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Title-Text")
                    .append($("<input>").attr("maxlength", "32")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Column1-Label")
                    .append($("<span>").text("項目1"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortalMst-Body-Notes").text("※16文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Column1-Text")
                    .append($("<input>").attr("maxlength", "16")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Column2-Label")
                    .append($("<span>").text("項目2"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortalMst-Body-Notes").text("※16文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Column2-Text")
                    .append($("<input>").attr("maxlength", "16")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Column3-Label")
                    .append($("<span>").text("項目3"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortalMst-Body-Notes").text("※16文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Column3-Text")
                    .append($("<input>").attr("maxlength", "16")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Password-Label")
                    .append($("<span>").text("パスワード"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortalMst-Body-Notes").text("※16文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Password-Text")
                    .append($("<input>").attr("maxlength", "16")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-LinkTitle-Label")
                    .append($("<span>").text("URLボタン名"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortalMst-Body-Notes").text("※16文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-LinkTitle-Text")
                    .append($("<input>").attr("maxlength", "16")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Label")
                    .append($("<span>").text("URL"))
                    .append($("<span>").addClass("SearchMenu-Command-Menu-SetPortalMst-Body-Notes").text("※256文字")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Text")
                    .append($("<input>")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Count"))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Body-Message")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "設定")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-SetPortalMst-Foot-Cancel")
                    .append($("<input>").attr("type", "button").attr("value", "キャンセル")))));
        showOption = true;
    }
    // パスワード変更権限がある場合
    if ($("#ViewerConfig").data("IsChangePass") == "1") {
        $subOption.append($("<div>").addClass("SearchMenu-Command-Sub-Option-Item").text("ログインパスワード変更").data("command", "ChangePass"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Head-Title").text("ログインパスワード変更")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Body")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Body-Present-Label").text("現在のパスワード"))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Body-Present-Text")
                    .append($("<input>").attr("type", "password").attr("maxlength", "64")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Body-New-Label").text("新しいパスワード"))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Body-New-Text")
                    .append($("<input>").attr("type", "password").attr("maxlength", "64")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Body-Confirm-Label").text("新しいパスワードの確認"))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Body-Confirm-Text")
                    .append($("<input>").attr("type", "password").attr("maxlength", "64")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Body-Message")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "変更")))
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-ChangePass-Foot-Cancel")
                    .append($("<input>").attr("type", "button").attr("value", "キャンセル")))));
        showOption = true;
    }
    // 使用容量表示権限がある場合
    if ($("#ViewerConfig").data("IsUsedSize") == "1") {
        $subOption.append($("<div>").addClass("SearchMenu-Command-Sub-Option-Item").text("使用容量表示").data("command", "UsedSize"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-UsedSize")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-UsedSize-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-UsedSize-Head-Title").text("使用容量")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-UsedSize-Body")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-UsedSize-Body-Text")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-UsedSize-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-UsedSize-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "OK")))));
        showOption = true;
    }
    // CSVフォーマット表示権限がある場合
    if ($("#ViewerConfig").data("IsCsvFormat") == "1") {
        $subOption.append($("<div>").addClass("SearchMenu-Command-Sub-Option-Item").text("CSVフォーマット").data("command", "CsvFormat"));
        // 表示項目作成
        $commonLayer.append($("<div>").attr("id", "SearchMenu-Command-Menu-CsvFormat")
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-CsvFormat-Head")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-CsvFormat-Head-Title").text("CSVフォーマット")))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-CsvFormat-Body")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-CsvFormat-Body-Text")
                    .append($("<textarea>").attr("readonly", "readonly").attr("cols", "80").attr("rows", "5").attr("wrap", "off"))))
            .append($("<div>").attr("id", "SearchMenu-Command-Menu-CsvFormat-Foot")
                .append($("<div>").attr("id", "SearchMenu-Command-Menu-CsvFormat-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "OK")))));
        // デスクトップ以外の場合
        if (!Common_IsDesktop()) {
            $("#SearchMenu-Command-Menu-CsvFormat-Body-Text textarea").attr("readonly", null);
        }
        showOption = true;
    }

    //オプションボタン要素がある場合
    if (showOption) {
        $command.append($("<div>").attr("id", "SearchMenu-Command-Option").addClass("SearchMenu-Command-Common SearchMenu-Command-Option-OFF"));
        $command.append($("<div>").attr("id", "SearchMenu-Command-Option-Margin").addClass("SearchMenu-Command-Common"));
    }

    // アップローダーボタン要素作成
    if ($("#ViewerConfig").data("IsUploader") == "1" && Common_IsSilverlight(false)) {
        $command.append($("<div>").attr("id", "SearchMenu-Command-Uploader").addClass("SearchMenu-Command-Common"));
        $command.append($("<div>").attr("id", "SearchMenu-Command-Uploader-Margin").addClass("SearchMenu-Command-Common"));
    }

    // ポータルボタン要素作成
    if ($("#ViewerConfig").data("PortalURL") != "" && $("#ViewerConfig").data("PortalName") != "") {
        $command.append($("<div>").attr("id", "SearchMenu-Command-Portal").addClass("SearchMenu-Command-Common"));
        $command.append($("<div>").attr("id", "SearchMenu-Command-Portal-Margin").addClass("SearchMenu-Command-Common"));
    }

    // ヘルプボタン要素作成
    if ($("#ViewerConfig").data("SearchHelpUrl") != "") {
        $command.append($("<div>").attr("id", "SearchMenu-Command-SearchHelp").addClass("SearchMenu-Command-Common"));
        $command.append($("<div>").attr("id", "SearchMenu-Command-SearchHelp-Margin").addClass("SearchMenu-Command-Common"));
    }

    // 閉じるボタン要素作成
    $command.append($("<div>").attr("id", "SearchMenu-Command-Close").addClass("SearchMenu-Command-Common"));
    $command.append($("<div>").attr("id", "SearchMenu-Command-Close-Margin").addClass("SearchMenu-Command-Common"));
    // URLコールで呼ばれた場合
    if ($("#ViewerConfig").data("login") == "2") {
        // 終了
        $("#SearchMenu-Command-Close").addClass("SearchMenu-Command-Close-Exit");
    }
    else {
        // ログアウト
        $("#SearchMenu-Command-Close").addClass("SearchMenu-Command-Close-Logout");
    }

    // PACS検索ボタンクリックイベント設定
    $("#SearchMenu-Command-PacsSearch").on({
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
                    // PACS検索ボタンクリック処理
                    SearchMenuCommand_PacsSearch_Button_Click();
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
                    // PACS検索ボタンクリック処理
                    SearchMenuCommand_PacsSearch_Button_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 操作ボタンクリックイベント設定
    $("#SearchMenu-Command-Menu").on({
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
            if ($("#SearchMenu-Command-Sub-Menu").is(":visible")) {
                // 操作ボタンキャンセル処理
                SearchMenuCommand_Menu_Cancel();
                return;
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
                    // 操作ボタンクリック処理
                    SearchMenuCommand_Menu_Button_Click();
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

            // 選択状態の場合
            if ($("#SearchMenu-Command-Sub-Menu").is(":visible")) {
                // 操作ボタンキャンセル処理
                SearchMenuCommand_Menu_Cancel();
                return;
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
                    // 操作ボタンクリック処理
                    SearchMenuCommand_Menu_Button_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 操作ボタンクリックイベント設定(サブメニュー)
    $("#SearchMenu-Command-Sub-Menu").on({
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
            $this.addClass("SearchMenu-Command-Sub-Menu-Item-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態
                        $this.addClass("SearchMenu-Command-Sub-Menu-Item-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Command-Sub-Menu-Item-ON");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // タッチイベント二重動作防止のためタイマを使用する
                    setTimeout(function () {
                        // 操作ボタンクリック処理(サブメニュー)
                        SearchMenuCommand_Menu_Sub_Click($this);

                        // 操作ボタンキャンセル処理
                        SearchMenuCommand_Menu_Cancel();

                        // 入力中をキャンセルするためフォーカスを外す
                        $(":input").blur();
                    }, 100);
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Command-Sub-Menu-Item-ON");

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

            // 選択状態
            $this.addClass("SearchMenu-Command-Sub-Menu-Item-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態
                        $this.addClass("SearchMenu-Command-Sub-Menu-Item-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Command-Sub-Menu-Item-ON");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // 操作ボタンクリック処理(サブメニュー)
                    SearchMenuCommand_Menu_Sub_Click($this);

                    // 操作ボタンキャンセル処理
                    SearchMenuCommand_Menu_Cancel();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Command-Sub-Menu-Item-ON");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Command-Sub-Menu-Item");

    // キーワード設定キーイベント設定
    $("#SearchMenu-Command-Menu-SetKeyword-Body-Input").on("keydown", function (e) {
        var $this = $(this);

        // Enter以外の場合
        if (e.keyCode != 13) {
            return;
        }

        // キーイベント設定
        $this.on("keyup", function (e) {
            // 遅延処理を行う
            setTimeout(function () {
                // Enter以外の場合
                if (e.keyCode != 13) {
                    return;
                }

                // キーワード設定ボタンクリック処理
                SearchMenuCommand_SetKeyword_Button_Click();
            }, 100);

            // キーイベント解除
            $this.off("keyup");
        });
    });

    // キーワード設定ボタンクリックイベント設定
    $("#SearchMenu-Command-Menu-SetKeyword-Foot-OK input").on({
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
                    // キーワード設定ボタンクリック処理
                    SearchMenuCommand_SetKeyword_Button_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // キーワード設定ボタンクリック処理
                    SearchMenuCommand_SetKeyword_Button_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // キーワード設定ボタンクリック処理
                    SearchMenuCommand_SetKeyword_Button_Click();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // キーワード設定キャンセルクリックイベント設定
    $("#SearchMenu-Command-Menu-SetKeyword-Foot-Cancel input").on({
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-SetKeyword").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-SetKeyword").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-SetKeyword").hide();
                    SearchMenuCommand_Common_Hide();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // コメント設定キーイベント設定
    $("#SearchMenu-Command-Menu-SetComment-Body-Input").on("keydown", function (e) {
        var $this = $(this);

        // Enter以外の場合
        if (e.keyCode != 13) {
            return;
        }

        // キーイベント設定
        $this.on("keyup", function (e) {
            // 遅延処理を行う
            setTimeout(function () {
                // Enter以外の場合
                if (e.keyCode != 13) {
                    return;
                }

                // コメント設定ボタンクリック処理
                SearchMenuCommand_SetComment_Button_Click();
            }, 100);

            // キーイベント解除
            $this.off("keyup");
        });
    });

    // コメント設定ボタンクリックイベント設定
    $("#SearchMenu-Command-Menu-SetComment-Foot-OK input").on({
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
                    // コメント設定ボタンクリック処理
                    SearchMenuCommand_SetComment_Button_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // コメント設定ボタンクリック処理
                    SearchMenuCommand_SetComment_Button_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // コメント設定ボタンクリック処理
                    SearchMenuCommand_SetComment_Button_Click();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // コメント設定キャンセルクリックイベント設定
    $("#SearchMenu-Command-Menu-SetComment-Foot-Cancel input").on({
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-SetComment").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-SetComment").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-SetComment").hide();
                    SearchMenuCommand_Common_Hide();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // 検査パスワード設定キーイベント設定
    $("#SearchMenu-Command-Menu-SetStudyPassword-Body-Input").on("keydown", function (e) {
        var $this = $(this);

        // Enter以外の場合
        if (e.keyCode != 13) {
            return;
        }

        // キーイベント設定
        $this.on("keyup", function (e) {
            // 遅延処理を行う
            setTimeout(function () {
                // Enter以外の場合
                if (e.keyCode != 13) {
                    return;
                }

                // 検査パスワード設定ボタンクリック処理
                SearchMenuCommand_SetStudyPassword_Button_Click();
            }, 100);

            // キーイベント解除
            $this.off("keyup");
        });
    });

    // 検査パスワード設定ボタンクリックイベント設定
    $("#SearchMenu-Command-Menu-SetStudyPassword-Foot-OK input").on({
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
                    // 検査パスワード設定ボタンクリック処理
                    SearchMenuCommand_SetStudyPassword_Button_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 検査パスワード設定ボタンクリック処理
                    SearchMenuCommand_SetStudyPassword_Button_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 検査パスワード設定ボタンクリック処理
                    SearchMenuCommand_SetStudyPassword_Button_Click();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // 検査パスワード設定キャンセルクリックイベント設定
    $("#SearchMenu-Command-Menu-SetStudyPassword-Foot-Cancel input").on({
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-SetStudyPassword").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-SetStudyPassword").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-SetStudyPassword").hide();
                    SearchMenuCommand_Common_Hide();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // ポータル設定フォーカスイベント設定
    $("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Text textarea, #SearchMenu-Command-Menu-SetPortal-Body-Column3-Text textarea").on({
        // フォーカスインイベント設定
        "focus": function () {
            // 現状のタイマをクリア
            var $this = $(this);
            var oldTimer = $this.data("Timer");
            if (oldTimer != undefined) {
                clearTimeout(oldTimer);
            }
            var flag = true;

            // 周期タイマ処理設定
            var newTimer = setInterval(function () {
                var oldVal = $this.data("Value");
                var newVal = $this.val();
                if (newVal != oldVal || flag) {
                    // 残り文字数更新
                    var $terget, maxlen;
                    if ($this.is("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Text textarea")) {
                        $terget = $("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Count");
                        maxlen = 100;
                    }
                    else {
                        $terget = $("#SearchMenu-Command-Menu-SetPortal-Body-Column3-Count");
                        maxlen = 500;
                    }
                    if (newVal.length <= maxlen) {
                        $terget.text("あと" + (maxlen - newVal.length) + "文字").removeClass("SearchMenu-Command-Menu-Text-Invalid");
                    }
                    else {
                        $terget.text((newVal.length - maxlen) + "文字オーバーしています").addClass("SearchMenu-Command-Menu-Text-Invalid");
                    } flag = false;
                }
                $this.data("Value", newVal);
            }, 10);

            // データを保持
            $this.data("Value", $this.val()).data("Timer", newTimer);
        },
        // フォーカスアウトイベント設定
        "blur": function () {
            var $this = $(this);
            var oldTimer = $this.data("Timer");
            if (oldTimer != undefined) {
                clearTimeout(oldTimer);
                $this.removeData("Timer");
                if ($this.is("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Text textarea")) {
                    $("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Count").text("");
                }
                else {
                    $("#SearchMenu-Command-Menu-SetPortal-Body-Column3-Count").text("");
                }
            }
        }
    });

    // ポータル設定クリックイベント設定
    $("#SearchMenu-Command-Menu-SetPortal-Foot-OK input").on({
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
                    // ポータル設定ボタンクリック処理
                    SearchMenuCommand_SetPortal_Button_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // ポータル設定ボタンクリック処理
                    SearchMenuCommand_SetPortal_Button_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // ポータル設定ボタンクリック処理
                    SearchMenuCommand_SetPortal_Button_Click();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // ポータル設定キャンセルクリックイベント設定
    $("#SearchMenu-Command-Menu-SetPortal-Foot-Cancel input").on({
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
                    // ポータル設定非表示処理
                    SearchMenuCommand_SetPortal_Hide();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // ポータル設定非表示処理
                    SearchMenuCommand_SetPortal_Hide();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // ポータル設定非表示処理
                    SearchMenuCommand_SetPortal_Hide();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // URL表示テキストイベント設定
    $("#SearchMenu-Command-Menu-ShowURL-Body-Input").on({
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
                    // 全選択
                    $this.focus().select();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function () {
            // コピーできるよう削除
            //return false;
        }
    });

    // 短縮URLボタンクリックイベント設定
    $("#SearchMenu-Command-Menu-ShowURL-Body-Button").on({
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
                    // 短縮URLボタンクリック処理
                    SearchMenuCommand_ShortURL_Button_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 短縮URLボタンクリック処理
                    SearchMenuCommand_ShortURL_Button_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 短縮URLボタンクリック処理
                    SearchMenuCommand_ShortURL_Button_Click();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // URL表示OKクリックイベント設定
    $("#SearchMenu-Command-Menu-ShowURL-Foot-OK input").on({
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-ShowURL").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-ShowURL").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-ShowURL").hide();
                    SearchMenuCommand_Common_Hide();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // 検査削除キャンセルクリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteStudy-Foot-Cancel input").on({
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
                    // 検査削除キャンセル処理
                    SearchMenuCommand_DeleteStudy_Cancel();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 検査削除キャンセル処理
                    SearchMenuCommand_DeleteStudy_Cancel();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 検査削除キャンセル処理
                    SearchMenuCommand_DeleteStudy_Cancel();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // 画像削除シリーズイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            // バブリングを中止する
            e.stopPropagation();
        }
    });

    // 画像削除シリーズチェックボックスクリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").on({
        // 変更イベント設定
        "change": function () {
            // 画像削除チェックボックスカウント処理
            SearchMenuCommand_DeleteImage_CheckboxCount(false);
        },
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ状態保持
            $this.data("touch", true);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // タッチ状態確認
            if ($this.data("touch")) {
                $this.removeData("touch");
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
                    // 画像削除範囲選択処理
                    SearchMenuCommand_DeleteImage_RangeSelect(false, $this.closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item"), e);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Checkbox");

    // 画像削除シリーズクリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ状態保持
            $this.data("touch", true);

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
                    // 画像削除シリーズ選択処理
                    SearchMenuCommand_DeleteImage_SeriesSelect($this.closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item"));
                }

                // デフォルト動作停止
                e.preventDefault();

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // タッチ状態確認
            if ($this.data("touch")) {
                $this.removeData("touch");
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
                    // 画像削除シリーズ選択処理
                    SearchMenuCommand_DeleteImage_SeriesSelect($this.closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item"));
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Content");

    // 画像削除画像イベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            // バブリングを中止する
            e.stopPropagation();
        }
    });

    // 画像削除画像チェックボックスクリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").on({
        // 変更イベント設定
        "change": function () {
            // 画像削除チェックボックスカウント処理
            SearchMenuCommand_DeleteImage_CheckboxCount(true);
        },
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ状態保持
            $this.data("touch", true);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // タッチ状態確認
            if ($this.data("touch")) {
                $this.removeData("touch");
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
                    // 画像削除範囲選択処理
                    SearchMenuCommand_DeleteImage_RangeSelect(true, $this.closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item"), e);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Checkbox");

    // 画像削除画像クリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ状態保持
            $this.data("touch", true);

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
                    // 画像削除画像選択処理
                    SearchMenuCommand_DeleteImage_ImageSelect($this.closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item"));
                }

                // デフォルト動作停止
                e.preventDefault();

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // タッチ状態確認
            if ($this.data("touch")) {
                $this.removeData("touch");
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
                    // 画像削除画像選択処理
                    SearchMenuCommand_DeleteImage_ImageSelect($this.closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item"));
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Content");

    // 画像削除シリーズ全選択クリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectSeries input").on({
        // 変更イベント設定
        "change": function () {
            // 画像削除全選択処理
            SearchMenuCommand_DeleteImage_AllSelect(false);
        }
    });

    // 画像削除シリーズ削除クリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-DeleteSeries input").on({
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
                    // 画像削除シリーズ処理
                    SearchMenuCommand_DeleteImage_Series();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // バブリングを中止する
            e.stopPropagation();

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
                    // 画像削除シリーズ処理
                    SearchMenuCommand_DeleteImage_Series();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 画像削除画像全選択クリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectImage input").on({
        // 変更イベント設定
        "change": function () {
            // 画像削除全選択処理
            SearchMenuCommand_DeleteImage_AllSelect(true);
        }
    });

    // 画像削除画像削除クリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-DeleteImage input").on({
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
                    // 画像削除画像処理
                    SearchMenuCommand_DeleteImage_Image();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // バブリングを中止する
            e.stopPropagation();

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
                    // 画像削除画像処理
                    SearchMenuCommand_DeleteImage_Image();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 画像削除画像表示画面イベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-View, #SearchMenu-Command-Menu-DeleteImage-Body-Image-NowLoading").on({
        // 読み込み完了イベント設定
        "load error": function (e) {
            // ローディング解除
            $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-NowLoading").hide();
        },
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
                    if (e.ctrlKey && !e.shiftKey) {
                        // チェックボックス更新
                        var check = $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Checkbox input").is(":checked");
                        $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Checkbox input").val(check ? ["off"] : ["on"]);

                        // 画像削除チェックボックス更新処理
                        SearchMenuCommand_DeleteImage_UpdateCheckbox();
                    }
                    else {
                        // 画像削除戻る処理
                        SearchMenuCommand_DeleteImage_Return();
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

            // バブリングを中止する
            e.stopPropagation();

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
                    if (e.ctrlKey && !e.shiftKey) {
                        // チェックボックス更新
                        var check = $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Checkbox input").is(":checked");
                        $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Checkbox input").val(check ? ["off"] : ["on"]);

                        // 画像削除チェックボックス更新処理
                        SearchMenuCommand_DeleteImage_UpdateCheckbox();
                    }
                    else {
                        // 画像削除戻る処理
                        SearchMenuCommand_DeleteImage_Return();
                    }
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // マウスホイールイベント設定
        "mousewheel": function (e, delta) {
            // デフォルト動作停止
            e.preventDefault();

            if (delta > 0) {
                // 画像削除表示変更処理
                SearchMenuCommand_DeleteImage_ChangeView(false);
            }
            else if (delta < 0) {
                // 画像削除表示変更処理
                SearchMenuCommand_DeleteImage_ChangeView(true);
            }
        }
    });

    // 画像削除画像表示画面チェックボックスイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Checkbox").on({
        // 変更イベント設定
        "change": function () {
            // 画像削除チェックボックス更新処理
            SearchMenuCommand_DeleteImage_UpdateCheckbox();
        }
    });

    // 画像削除前へクリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Prev input").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // リピート開始
            var isRepeat = false;
            var repeatTimer = null;
            var repeat = function () {
                repeatTimer = setTimeout(function () {
                    // 画像削除表示変更処理
                    SearchMenuCommand_DeleteImage_ChangeView(false);
                    isRepeat = true;
                    repeat();
                }, isRepeat ? 50 : 400);
            };
            repeat();

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
                    // リピートしなかった場合
                    if (!isRepeat) {
                        // 画像削除表示変更処理
                        SearchMenuCommand_DeleteImage_ChangeView(false);
                    }
                }

                // タイマクリア
                clearTimeout(repeatTimer);

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // バブリングを中止する
            e.stopPropagation();

            // リピート開始
            var isRepeat = false;
            var repeatTimer = null;
            var repeat = function () {
                repeatTimer = setTimeout(function () {
                    // 画像削除表示変更処理
                    SearchMenuCommand_DeleteImage_ChangeView(false);
                    isRepeat = true;
                    repeat();
                }, isRepeat ? 50 : 400);
            };
            repeat();

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
                    // リピートしなかった場合
                    if (!isRepeat) {
                        // 画像削除表示変更処理
                        SearchMenuCommand_DeleteImage_ChangeView(false);
                    }
                }

                // タイマクリア
                clearTimeout(repeatTimer);

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 画像削除次へクリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Next input").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // リピート開始
            var isRepeat = false;
            var repeatTimer = null;
            var repeat = function () {
                repeatTimer = setTimeout(function () {
                    // 画像削除表示変更処理
                    SearchMenuCommand_DeleteImage_ChangeView(true);
                    isRepeat = true;
                    repeat();
                }, isRepeat ? 50 : 400);
            };
            repeat();

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
                    // リピートしなかった場合
                    if (!isRepeat) {
                        // 画像削除表示変更処理
                        SearchMenuCommand_DeleteImage_ChangeView(true);
                    }
                }

                // タイマクリア
                clearTimeout(repeatTimer);

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // バブリングを中止する
            e.stopPropagation();

            // リピート開始
            var isRepeat = false;
            var repeatTimer = null;
            var repeat = function () {
                repeatTimer = setTimeout(function () {
                    // 画像削除表示変更処理
                    SearchMenuCommand_DeleteImage_ChangeView(true);
                    isRepeat = true;
                    repeat();
                }, isRepeat ? 50 : 400);
            };
            repeat();

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
                    // リピートしなかった場合
                    if (!isRepeat) {
                        // 画像削除表示変更処理
                        SearchMenuCommand_DeleteImage_ChangeView(true);
                    }
                }

                // タイマクリア
                clearTimeout(repeatTimer);

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 画像削除終了クリックイベント設定
    $("#SearchMenu-Command-Menu-DeleteImage-Foot-OK input").on({
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
                    // 画像削除キャンセル処理
                    SearchMenuCommand_DeleteImage_Cancel();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

            // バブリングを中止する
            e.stopPropagation();

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
                    // 画像削除キャンセル処理
                    SearchMenuCommand_DeleteImage_Cancel();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 画像削除キャンセル処理
                    SearchMenuCommand_DeleteImage_Cancel();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // オプションボタンクリックイベント設定
    $("#SearchMenu-Command-Option").on({
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
            if ($("#SearchMenu-Command-Sub-Option").is(":visible")) {
                // オプションボタンキャンセル処理
                SearchMenuCommand_Option_Cancel();
                return;
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
                    // オプションボタンクリック処理
                    SearchMenuCommand_Option_Button_Click();
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

            // 選択状態の場合
            if ($("#SearchMenu-Command-Sub-Option").is(":visible")) {
                // オプションボタンキャンセル処理
                SearchMenuCommand_Option_Cancel();
                return;
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
                    // オプションボタンクリック処理
                    SearchMenuCommand_Option_Button_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // オプションボタンクリックイベント設定(サブメニュー)
    $("#SearchMenu-Command-Sub-Option").on({
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
            $this.addClass("SearchMenu-Command-Sub-Option-Item-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態
                        $this.addClass("SearchMenu-Command-Sub-Option-Item-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Command-Sub-Option-Item-ON");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // タッチイベント二重動作防止のためタイマを使用する
                    setTimeout(function () {
                        // オプションボタンクリック処理(サブメニュー)
                        SearchMenuCommand_Option_Sub_Click($this);

                        // オプションボタンキャンセル処理
                        SearchMenuCommand_Option_Cancel();

                        // 入力中をキャンセルするためフォーカスを外す
                        $(":input").blur();
                    }, 100);
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Command-Sub-Option-Item-ON");

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

            // 選択状態
            $this.addClass("SearchMenu-Command-Sub-Option-Item-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態
                        $this.addClass("SearchMenu-Command-Sub-Option-Item-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("SearchMenu-Command-Sub-Option-Item-ON");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // オプションボタンクリック処理(サブメニュー)
                    SearchMenuCommand_Option_Sub_Click($this);

                    // オプションボタンキャンセル処理
                    SearchMenuCommand_Option_Cancel();
                }

                // 選択状態解除
                $this.removeClass("SearchMenu-Command-Sub-Option-Item-ON");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".SearchMenu-Command-Sub-Option-Item");

    // パスワード変更キーイベント設定
    $("#SearchMenu-Command-Menu-ChangePass-Body-Present-Text input,#SearchMenu-Command-Menu-ChangePass-Body-New-Text input,#SearchMenu-Command-Menu-ChangePass-Body-Confirm-Text input").on("keydown", function (e) {
        var $this = $(this);

        // Enter以外の場合
        if (e.keyCode != 13) {
            return;
        }

        // キーイベント設定
        $this.on("keyup", function (e) {
            // 遅延処理を行う
            setTimeout(function () {
                // Enter以外の場合
                if (e.keyCode != 13) {
                    return;
                }

                // パスワード変更チェック処理
                SearchMenuCommand_ChangePass_Check();
            }, 100);

            // キーイベント解除
            $this.off("keyup");
        });
    });

    // パスワード変更クリックイベント設定
    $("#SearchMenu-Command-Menu-ChangePass-Foot-OK input").on({
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
                    // パスワード変更チェック処理
                    SearchMenuCommand_ChangePass_Check();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // パスワード変更チェック処理
                    SearchMenuCommand_ChangePass_Check();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // パスワード変更チェック処理
                    SearchMenuCommand_ChangePass_Check();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // パスワード変更キャンセルクリックイベント設定
    $("#SearchMenu-Command-Menu-ChangePass-Foot-Cancel input").on({
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-ChangePass").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-ChangePass").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-ChangePass").hide();
                    SearchMenuCommand_Common_Hide();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // 使用容量表示OKクリックイベント設定
    $("#SearchMenu-Command-Menu-UsedSize-Foot-OK input").on({
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-UsedSize").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-UsedSize").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-UsedSize").hide();
                    SearchMenuCommand_Common_Hide();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // CSVフォーマット表示テキストクリックイベント設定
    $("#SearchMenu-Command-Menu-CsvFormat-Body-Text textarea").on({
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
                    // 全選択
                    $this.focus().select();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function () {
            // コピーできるよう削除
            //return false;
        }
    });

    // CSVフォーマット表示OKクリックイベント設定
    $("#SearchMenu-Command-Menu-CsvFormat-Foot-OK input").on({
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-CsvFormat").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-CsvFormat").hide();
                    SearchMenuCommand_Common_Hide();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // 入力中をキャンセルするためフォーカスを外す
                    $(":input").blur();

                    // 非表示
                    $("#SearchMenu-Command-Menu-CsvFormat").hide();
                    SearchMenuCommand_Common_Hide();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // ポータルマスタ設定フォーカスイベント設定
    $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Text input").on({
        // フォーカスインイベント設定
        "focus": function () {
            // 現状のタイマをクリア
            var $this = $(this);
            var oldTimer = $this.data("Timer");
            if (oldTimer != undefined) {
                clearTimeout(oldTimer);
            }
            var flag = true;

            // 周期タイマ処理設定
            var newTimer = setInterval(function () {
                var oldVal = $this.data("Value");
                var newVal = $this.val();
                if (newVal != oldVal || flag) {
                    // 残り文字数更新
                    var $terget = $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Count");
                    if (newVal.length <= 256) {
                        $terget.text("あと" + (256 - newVal.length) + "文字").removeClass("SearchMenu-Command-Menu-Text-Invalid");
                    }
                    else {
                        $terget.text((newVal.length - 256) + "文字オーバーしています").addClass("SearchMenu-Command-Menu-Text-Invalid");
                    }
                    flag = false;
                }
                $this.data("Value", newVal);
            }, 10);

            // データを保持
            $this.data("Value", $this.val()).data("Timer", newTimer);
        },
        // フォーカスアウトイベント設定
        "blur": function () {
            var $this = $(this);
            var oldTimer = $this.data("Timer");
            if (oldTimer != undefined) {
                clearTimeout(oldTimer);
                $this.removeData("Timer");
                $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Count").text("");
            }
        }
    });

    // ポータルマスタ設定クリックイベント設定
    $("#SearchMenu-Command-Menu-SetPortalMst-Foot-OK input").on({
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
                    // ポータルマスタ設定ボタンクリック処理
                    SearchMenuCommand_SetPortalMst_Button_Click();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // ポータルマスタ設定ボタンクリック処理
                    SearchMenuCommand_SetPortalMst_Button_Click();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // ポータルマスタ設定ボタンクリック処理
                    SearchMenuCommand_SetPortalMst_Button_Click();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // ポータルマスタ設定キャンセルクリックイベント設定
    $("#SearchMenu-Command-Menu-SetPortalMst-Foot-Cancel input").on({
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
                    // ポータル設定非表示処理
                    SearchMenuCommand_SetPortalMst_Hide();
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
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
                    // ポータル設定非表示処理
                    SearchMenuCommand_SetPortalMst_Hide();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        },
        // 入力イベント設定
        "keydown": function (e) {
            var $this = $(this);

            // Enter以外かつスペース以外の場合
            if (e.keyCode != 13 && e.keyCode != 32) {
                return;
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enter以外かつスペース以外の場合
                    if (e.keyCode != 13 && e.keyCode != 32) {
                        return;
                    }

                    // ポータル設定非表示処理
                    SearchMenuCommand_SetPortalMst_Hide();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // アップローダーボタンクリックイベント設定
    $("#SearchMenu-Command-Uploader").on({
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
                    // サービスチェック
                    Common_CheckService(function (result) {
                        // アップローダー起動
                        Common_WindowOpen($("#ViewerConfig").data("UploaderURL"), "Uploader", true);
                    });
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
                    // サービスチェック
                    Common_CheckService(function (result) {
                        // アップローダー起動
                        Common_WindowOpen($("#ViewerConfig").data("UploaderURL"), "Uploader", true);
                    });
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // ポータルボタンクリックイベント設定
    $("#SearchMenu-Command-Portal").on({
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
                    // ポータル起動する場合
                    if ($("#ViewerConfig").data("PortalURL")) {
                        // ポータル起動処理
                        Common_WindowOpen($("#ViewerConfig").data("PortalURL"), "Portal", false);
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
                    // ポータル起動する場合
                    if ($("#ViewerConfig").data("PortalURL")) {
                        // ポータル起動処理
                        Common_WindowOpen($("#ViewerConfig").data("PortalURL"), "Portal", false);
                    }
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // ヘルプボタンクリックイベント設定
    $("#SearchMenu-Command-SearchHelp").on({
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
                    // ヘルプ起動
                    Common_WindowOpen($("#ViewerConfig").data("SearchHelpUrl"), "SearchHelp", false);
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
                    // ヘルプ起動
                    Common_WindowOpen($("#ViewerConfig").data("SearchHelpUrl"), "SearchHelp", false);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });

    // 閉じるボタンクリックイベント設定
    $("#SearchMenu-Command-Close").on({
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
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });
}

// PACS検索ボタンクリック処理
function SearchMenuCommand_PacsSearch_Button_Click() {
    // 選択状態の場合
    if ($("#SearchMenu-Command-PacsSearch").hasClass("SearchMenu-Command-PacsSearch-ON")) {
        // アイコン変更
        $("#SearchMenu-Command-PacsSearch").removeClass("SearchMenu-Command-PacsSearch-ON").addClass("SearchMenu-Command-PacsSearch-OFF");
    }
    // 未選択状態の場合
    else {
        // アイコン変更
        $("#SearchMenu-Command-PacsSearch").removeClass("SearchMenu-Command-PacsSearch-OFF").addClass("SearchMenu-Command-PacsSearch-ON");
    }
}

// 操作ボタンクリック処理
function SearchMenuCommand_Menu_Button_Click() {
    // 未選択状態の場合
    if ($("#SearchMenu-Command-Sub-Menu").is(":hidden")) {
        // サブメニューキャンセル処理
        SearchMenu_Cancel();

        // 表示処理
        SearchMenuCommand_Menu_Sub_Show();
    }
    // 選択状態の場合
    else {
        // キャンセル処理
        SearchMenuCommand_Menu_Cancel();
    }
}

// 操作ボタンキャンセル処理
function SearchMenuCommand_Menu_Cancel() {
    // アイコン変更
    $("#SearchMenu-Command-Menu").removeClass("SearchMenu-Command-Menu-ON").addClass("SearchMenu-Command-Menu-OFF");

    // アイコン変更
    $("#SearchMenu-Command-Sub-Menu").hide();
}

// 操作ボタン表示処理(サブメニュー)
function SearchMenuCommand_Menu_Sub_Show() {
    // アイコン変更
    $("#SearchMenu-Command-Menu").removeClass("SearchMenu-Command-Menu-OFF").addClass("SearchMenu-Command-Menu-ON");

    // サブメニュー表示位置補正表示
    var offset = $("#SearchMenu-Command-Menu").offset();
    var width = ($("#SearchMenu-Command-Sub-Menu").width() + 3) / 2;
    $("#SearchMenu-Command-Sub-Menu").css({ left: offset.left + 24 - width, top: offset.top + 48 })
                                     .show();
}

// 操作ボタンクリック処理(サブメニュー)
function SearchMenuCommand_Menu_Sub_Click($this) {
    // 処理取得
    var command = $this.data("command");

    // キーワード設定の場合
    if (command == "SetKeyword") {
        // キーワード設定処理
        SearchMenuCommand_SetKeyword();
        return;
    }

    // コメント設定の場合
    if (command == "SetComment") {
        // コメント設定処理
        SearchMenuCommand_SetComment();
        return;
    }

    // コメント設定の場合
    if (command == "SetStudyPassword") {
        // コメント設定処理
        SearchMenuCommand_SetStudyPassword();
        return;
    }

    // ポータル設定の場合
    if (command == "SetPortal") {
        // ポータル設定処理
        SearchMenuCommand_SetPortal();
        return;
    }

    // URL表示の場合
    if (command == "ShowURL") {
        // URL表示処理
        SearchMenuCommand_ShowURL();
        return;
    }

    // 検査削除の場合
    if (command == "DeleteStudy") {
        // 検査削除処理
        SearchMenuCommand_DeleteStudy();
        return;
    }

    // 画像削除の場合
    if (command == "DeleteImage") {
        // 画像削除処理
        SearchMenuCommand_DeleteImage();
        return;
    }
}

// キーワード設定処理
function SearchMenuCommand_SetKeyword() {
    // 検査情報一覧取得処理
    var study = SearchStudyList_GetList(false);
    if (study.length == 0) {
        alert("検査が選択されていません。");
        return;
    }
    else if (study.length > 1) {
        alert("検査が複数選択されています。");
        return;
    }

    // 表示初期化
    $("#SearchMenu-Command-Menu-SetKeyword-Body-Input").val(study[0].$obj.find(".StudyList-Body-Keyword span").text());
    SearchMenuCommand_Common_Show();
    $("#SearchMenu-Command-Menu-SetKeyword").data("Study", study[0]).show();
    $("#SearchMenu-Command-Menu-SetKeyword-Body-Input").focus().select();
}

// キーワード設定ボタンクリック処理
function SearchMenuCommand_SetKeyword_Button_Click() {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-SetKeyword").data("Study");
    var keyword = $("#SearchMenu-Command-Menu-SetKeyword-Body-Input").val();

    // 変更がない場合
    if (study.$obj.children(".StudyList-Body-Keyword").text() == keyword) {
        // 短縮URL制御確認(キーワード設定用)
        SearchMenuCommand_SetKeyword_ShortUrl_Check(keyword);
        return;
    }

    // キーワード設定
    Search_SetKeyword(
        study.StudyKey,
        keyword,
        keyword,
        SearchMenuCommand_SetKeyword_Result
    ); // 取得後「キーワード設定結果」呼び出し
}

// キーワード設定結果
function SearchMenuCommand_SetKeyword_Result(result, keyword) {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-SetKeyword").data("Study");

    // 選択検査更新
    study.$obj.find(".StudyList-Body-Keyword span").text(keyword);

    // 短縮URL制御確認(キーワード設定用)
    SearchMenuCommand_SetKeyword_ShortUrl_Check(keyword);
}

// 短縮URL制御確認(キーワード設定用)
function SearchMenuCommand_SetKeyword_ShortUrl_Check(keyword) {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-SetKeyword").data("Study");

    // 短縮URL制御確認
    var $check = $("#SearchMenu-Command-Menu-SetKeyword-Body-Option-Checkbox");
    if ($check.length == 1 && (keyword != "" || (keyword == "" && $check.is(":checked")))) {
        // 短縮URL取得
        Search_GetShortUrl(
            study.StudyKey,
            keyword,
            SearchMenuCommand_SetKeyword_GetShortUrl_Result
        ); // 取得後「短縮URL取得結果(キーワード設定用)」呼び出し
    }
    else {
        // キーワード設定非表示処理
        SearchMenuCommand_SetKeyword_Hide();
    }
}

// 短縮URL取得結果(キーワード設定用)
function SearchMenuCommand_SetKeyword_GetShortUrl_Result(result, keyword) {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-SetKeyword").data("Study");

    // 制御確認
    if (keyword != "" && result.d.StudyUrl == "") {
        // 短縮URL設定
        Search_SetShortUrl(
            study.StudyKey,
            null,
            SearchMenuCommand_SetKeyword_Hide
        ); // 取得後「キーワード設定非表示処理」呼び出し
    }
    else if (keyword == "" && result.d.StudyUrl != "") {
        // 短縮URL削除
        Search_DelShortUrl(
            study.StudyKey,
            null,
            SearchMenuCommand_SetKeyword_Hide
        ); // 取得後「キーワード設定非表示処理」呼び出し
    }
    else {
        // キーワード設定非表示処理
        SearchMenuCommand_SetKeyword_Hide();
    }
}

// キーワード設定非表示処理
function SearchMenuCommand_SetKeyword_Hide() {
    // 入力中をキャンセルするためフォーカスを外す
    $(":input").blur();

    // 非表示
    $("#SearchMenu-Command-Menu-SetKeyword").hide();
    SearchMenuCommand_Common_Hide();
}

// コメント設定処理
function SearchMenuCommand_SetComment() {
    // 検査情報一覧取得処理
    var study = SearchStudyList_GetList(false);
    if (study.length == 0) {
        alert("検査が選択されていません。");
        return;
    }
    else if (study.length > 1) {
        alert("検査が複数選択されています。");
        return;
    }

    // 表示初期化
    $("#SearchMenu-Command-Menu-SetComment-Body-Input").val(study[0].$obj.find(".StudyList-Body-Comment span").text());
    SearchMenuCommand_Common_Show();
    $("#SearchMenu-Command-Menu-SetComment").data("Study", study[0]).show();
    $("#SearchMenu-Command-Menu-SetComment-Body-Input").focus().select();
}

// コメント設定ボタンクリック処理
function SearchMenuCommand_SetComment_Button_Click() {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-SetComment").data("Study");
    var comment = $("#SearchMenu-Command-Menu-SetComment-Body-Input").val();

    // 変更がない場合
    if (study.$obj.children(".StudyList-Body-Comment").text() == comment) {
        // コメント設定非表示処理
        SearchMenuCommand_SetComment_Hide();
        return;
    }

    // コメント設定
    Search_SetComment(
        study.StudyKey,
        comment,
        comment,
        SearchMenuCommand_SetComment_Result
    ); // 取得後「コメント設定結果」呼び出し
}

// コメント設定結果
function SearchMenuCommand_SetComment_Result(result, comment) {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-SetComment").data("Study");

    // 選択検査更新
    study.$obj.find(".StudyList-Body-Comment span").text(comment);

    // コメント設定非表示処理
    SearchMenuCommand_SetComment_Hide();
}

// コメント設定非表示処理
function SearchMenuCommand_SetComment_Hide() {
    // 入力中をキャンセルするためフォーカスを外す
    $(":input").blur();

    // 非表示
    $("#SearchMenu-Command-Menu-SetComment").hide();
    SearchMenuCommand_Common_Hide();
}

// 検査パスワード設定処理
function SearchMenuCommand_SetStudyPassword() {
    // 検査情報一覧取得処理
    var study = SearchStudyList_GetList(false);
    if (study.length == 0) {
        alert("検査が選択されていません。");
        return;
    }
    else if (study.length > 1) {
        alert("検査が複数選択されています。");
        return;
    }

    // 表示初期化
    $("#SearchMenu-Command-Menu-SetStudyPassword-Body-Input").val("");
    SearchMenuCommand_Common_Show();
    $("#SearchMenu-Command-Menu-SetStudyPassword").data("Study", study[0]).show();
    $("#SearchMenu-Command-Menu-SetStudyPassword-Body-Input").focus().select();
}

// 検査パスワード設定ボタンクリック処理
function SearchMenuCommand_SetStudyPassword_Button_Click() {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-SetStudyPassword").data("Study");
    var comment = $("#SearchMenu-Command-Menu-SetStudyPassword-Body-Input").val();

    // 検査パスワード設定
    Search_SetStudyPassword(
        study.StudyKey,
        comment,
        comment,
        SearchMenuCommand_SetStudyPassword_Result
    ); // 取得後「検査パスワード設定結果」呼び出し
}

// 検査パスワード設定結果
function SearchMenuCommand_SetStudyPassword_Result(result, comment) {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-SetStudyPassword").data("Study");

    // 選択検査更新
    if (comment != "") {
        study.$obj.find(".StudyList-Body-StudyPassword").data("Sort", 1).addClass("StudyList-Body-StudyPassword-ON");
    }
    else {
        study.$obj.find(".StudyList-Body-StudyPassword").data("Sort", 0).removeClass("StudyList-Body-StudyPassword-ON");
    }

    // 検査パスワード設定非表示処理
    SearchMenuCommand_SetStudyPassword_Hide();
}

// 検査パスワード設定非表示処理
function SearchMenuCommand_SetStudyPassword_Hide() {
    // 入力中をキャンセルするためフォーカスを外す
    $(":input").blur();

    // 非表示
    $("#SearchMenu-Command-Menu-SetStudyPassword").hide();
    SearchMenuCommand_Common_Hide();
}

// ポータル設定処理
function SearchMenuCommand_SetPortal() {
    // 検査情報一覧取得処理
    var study = SearchStudyList_GetList(false);
    if (study.length == 0) {
        alert("検査が選択されていません。");
        return;
    }
    else if (study.length > 1) {
        alert("検査が複数選択されています。");
        return;
    }

    // ポータルマスタが未取得の場合
    if ($("#ViewerConfig").data("PortalMst") == null) {
        // ポータルマスタ取得
        Search_GetPortalMst(
            null,
            function (result) {
                // ポータルマスタ設定
                $("#ViewerConfig").data("PortalMst", result.d.Items);

                // ポータル設定処理
                SearchMenuCommand_SetPortal();
            }
        );
        return;
    }

    // ポータル取得
    Search_GetPortal(
        study[0].StudyKey,
        null,
        function (result) {
            // 表示初期化
            var mst = $("#ViewerConfig").data("PortalMst");
            $("#SearchMenu-Command-Menu-SetPortal-Body-Column1-Label .SearchMenu-Command-Menu-SetPortal-Body-Label").text("項目1： " + mst[0].Column1);
            $("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Label .SearchMenu-Command-Menu-SetPortal-Body-Label").text("項目2： " + mst[0].Column2);
            $("#SearchMenu-Command-Menu-SetPortal-Body-Column3-Label .SearchMenu-Command-Menu-SetPortal-Body-Label").text("項目3： " + mst[0].Column3);
            $("#SearchMenu-Command-Menu-SetPortal-Body-Column1-Text input").val(result.d.Items[0].Column1);
            $("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Text textarea").val(result.d.Items[0].Column2);
            $("#SearchMenu-Command-Menu-SetPortal-Body-Column3-Text textarea").val(result.d.Items[0].Column3);
            $("#SearchMenu-Command-Menu-SetPortal-Body-Enable input").attr("checked", "checked");
            $("#SearchMenu-Command-Menu-SetPortal-Body-Message").text("");
            SearchMenuCommand_Common_Show();
            $("#SearchMenu-Command-Menu-SetPortal").data("Study", study[0]).show();
            $("#SearchMenu-Command-Menu-SetPortal-Body-Column1-Text input").focus();
        }
    );
}

// ポータル設定ボタンクリック処理
function SearchMenuCommand_SetPortal_Button_Click() {
    // 項目作成
    var study = $("#SearchMenu-Command-Menu-SetPortal").data("Study");
    var param = { };
    param["Column1"] = $("#SearchMenu-Command-Menu-SetPortal-Body-Column1-Text input").val();
    param["Column2"] = $("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Text textarea").val();
    param["Column3"] = $("#SearchMenu-Command-Menu-SetPortal-Body-Column3-Text textarea").val();
    param["Enable"] = $("#SearchMenu-Command-Menu-SetPortal-Body-Enable input").is(":checked");

    // 項目チェック
    if (param["Column1"].length > 16) {
        $("#SearchMenu-Command-Menu-SetPortal-Body-Message").text("「" + $("#SearchMenu-Command-Menu-SetPortal-Body-Column1-Label .SearchMenu-Command-Menu-SetPortal-Body-Label").text() + "」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortal-Body-Column1-Text input").focus().select();
        return;
    }
    if (param["Column2"].length > 100) {
        $("#SearchMenu-Command-Menu-SetPortal-Body-Message").text("「" + $("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Label .SearchMenu-Command-Menu-SetPortal-Body-Label").text() + "」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortal-Body-Column2-Text input").focus().select();
        return;
    }
    if (param["Column3"].length > 500) {
        $("#SearchMenu-Command-Menu-SetPortal-Body-Message").text("「" + $("#SearchMenu-Command-Menu-SetPortal-Body-Column3-Label .SearchMenu-Command-Menu-SetPortal-Body-Label").text() + "」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortal-Body-Column3-Text input").focus().select();
        return;
    }

    // ポータル設定
    Search_SetPortal(
        study.StudyKey,
        param,
        null,
        function (result) {
            // 選択検査更新
            study.$obj.find(".StudyList-Body-Keyword span").text(result.d.Keyword);
            if (param["Enable"] == true) {
                study.$obj.find(".StudyList-Body-Portal").data("Sort", 1).addClass("StudyList-Body-Portal-ON");
            }
            else {
                study.$obj.find(".StudyList-Body-Portal").data("Sort", 0).removeClass("StudyList-Body-Portal-ON");
            }

            // ポータル設定非表示処理
            SearchMenuCommand_SetPortal_Hide();
        }
    );
}

// ポータル設定非表示処理
function SearchMenuCommand_SetPortal_Hide() {
    // 入力中をキャンセルするためフォーカスを外す
    $(":input").blur();

    // 非表示
    $("#SearchMenu-Command-Menu-SetPortal").hide();
    SearchMenuCommand_Common_Hide();
}

// URL表示処理
function SearchMenuCommand_ShowURL() {
    // 検査情報一覧取得処理
    var study = SearchStudyList_GetList(false);
    if (study.length == 0) {
        alert("検査が選択されていません。");
        return;
    }
    else if (study.length > 1) {
        alert("検査が複数選択されています。");
        return;
    }

    // 表示初期化
    $("#SearchMenu-Command-Menu-ShowURL-Body-Input").val("取得中...");
    $("#SearchMenu-Command-Menu-ShowURL-Body-Button").val("");
    SearchMenuCommand_Common_Show();
    $("#SearchMenu-Command-Menu-ShowURL").data("Study", study[0]).show();
    $("#SearchMenu-Command-Menu-ShowURL-Foot-OK input").focus();

    // 短縮URL取得
    Search_GetShortUrl(
        study[0].StudyKey,
        null,
        SearchMenuCommand_GetShortUrl_Result
    ); // 取得後「短縮URL取得結果」呼び出し
}

// 短縮URL取得結果
function SearchMenuCommand_GetShortUrl_Result(result) {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-ShowURL").data("Study");

    // StudyUrlがある場合
    if (result.d.StudyUrl != "") {
        $("#SearchMenu-Command-Menu-ShowURL-Body-Input").val(result.d.StudyUrl);
        $("#SearchMenu-Command-Menu-ShowURL-Body-Button").val("削除");
        study.$obj.find(".StudyList-Body-ShortURL").data("Sort", 1).addClass("StudyList-Body-ShortURL-ON");
    }
    else {
        $("#SearchMenu-Command-Menu-ShowURL-Body-Input").val("");
        $("#SearchMenu-Command-Menu-ShowURL-Body-Button").val("作成");
        study.$obj.find(".StudyList-Body-ShortURL").data("Sort", 0).removeClass("StudyList-Body-ShortURL-ON");
    }
}

// 短縮URLボタンクリック処理
function SearchMenuCommand_ShortURL_Button_Click() {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-ShowURL").data("Study");

    // 作成時
    if ($("#SearchMenu-Command-Menu-ShowURL-Body-Button").val() == "作成") {
        // 表示初期化
        $("#SearchMenu-Command-Menu-ShowURL-Body-Input").val("作成中...");
        $("#SearchMenu-Command-Menu-ShowURL-Body-Button").val("");

        // 短縮URL設定
        Search_SetShortUrl(
            study.StudyKey,
            null,
            SearchMenuCommand_GetShortUrl_Result
        ); // 取得後「短縮URL取得結果」呼び出し
    }
    // 削除時
    else if ($("#SearchMenu-Command-Menu-ShowURL-Body-Button").val() == "削除") {
        // 表示初期化
        $("#SearchMenu-Command-Menu-ShowURL-Body-Input").val("削除中...");
        $("#SearchMenu-Command-Menu-ShowURL-Body-Button").val("");

        // 短縮URL削除
        Search_DelShortUrl(
            study.StudyKey,
            null,
            SearchMenuCommand_DelShortUrl_Result
        ); // 取得後「短縮URL削除結果」呼び出し
    }
}

// 短縮URL削除結果
function SearchMenuCommand_DelShortUrl_Result() {
    // 検査取得
    var study = $("#SearchMenu-Command-Menu-ShowURL").data("Study");

    // 短縮URL更新
    $("#SearchMenu-Command-Menu-ShowURL-Body-Input").val("");
    $("#SearchMenu-Command-Menu-ShowURL-Body-Button").val("作成");
    study.$obj.find(".StudyList-Body-ShortURL").data("Sort", 0).removeClass("StudyList-Body-ShortURL-ON");
}

// 検査削除処理
function SearchMenuCommand_DeleteStudy() {
    // 検査情報一覧取得処理
    var study = SearchStudyList_GetList(false);
    if (study.length == 0) {
        alert("検査が選択されていません。");
        return;
    }

    // 確認
    if (!confirm("本当に削除しますか？")) {
        return;
    }

    // リスト作成
    var list = new Array();
    for (var i = 0; i < study.length; i++) {
        list.push(study[i].StudyKey);
    }

    // 表示初期化
    $("#SearchMenu-Command-Menu-DeleteStudy-Body-Text").text("削除中(1/" + list.length + ")");
    SearchMenuCommand_Common_Show();
    $("#SearchMenu-Command-Menu-DeleteStudy").data("StudyKey", list).data("Count", list.length).show();
    $("#SearchMenu-Command-Menu-DeleteStudy-Foot-Cancel input").focus();

    // 検査削除
    Search_DelStudy(
        list[0],
        null,
        SearchMenuCommand_DelStudy_Result
    ); // 削除後「検査削除結果」呼び出し
}

// 検査削除結果
function SearchMenuCommand_DelStudy_Result(result) {
    // キャンセルされた場合
    if (result.d.IsCancel == true) {
        // 検査削除終了処理
        SearchMenuCommand_DeleteStudy_End();
        return;
    }

    // リスト更新
    var list = $("#SearchMenu-Command-Menu-DeleteStudy").data("StudyKey");
    list.shift();

    // 処理完了時
    if (list.length == 0) {
        // 検査削除終了処理
        SearchMenuCommand_DeleteStudy_End();
        return;
    }

    // 表示更新
    var count = $("#SearchMenu-Command-Menu-DeleteStudy").data("Count");
    $("#SearchMenu-Command-Menu-DeleteStudy-Body-Text").text("削除中(" + (count - list.length + 1) + "/" + count + ")");
    $("#SearchMenu-Command-Menu-DeleteStudy").data("StudyKey", list);

    // 検査削除
    Search_DelStudy(
        list[0],
        null,
        SearchMenuCommand_DelStudy_Result
    ); // 削除後「検査削除結果」呼び出し
}

// 検査削除キャンセル処理
function SearchMenuCommand_DeleteStudy_Cancel() {
    // Ajax用送信キーを更新し通信中をキャンセルする
    Search_GetAjaxKey();

    // 表示更新
    $("#SearchMenu-Command-Menu-DeleteStudy-Body-Text").text("応答を待っています");
}

// 検査削除終了処理
function SearchMenuCommand_DeleteStudy_End() {
    // 非表示
    $("#SearchMenu-Command-Menu-DeleteStudy").removeData("StudyKey").removeData("Count").hide();
    SearchMenuCommand_Common_Hide();

    // 再検索処理
    SearchMenu_ReSearch(null);
}

// 画像削除処理
function SearchMenuCommand_DeleteImage() {
    // 検査情報一覧取得処理
    var study = SearchStudyList_GetList(false);
    if (study.length == 0) {
        alert("検査が選択されていません。");
        return;
    }
    else if (study.length > 1) {
        alert("検査が複数選択されています。");
        return;
    }

    // 表示初期化
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List").css("visibility", "visible");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image").css("visibility", "hidden");
    SearchMenuCommand_Common_Show();
    $("#SearchMenu-Command-Menu-DeleteImage").data("Study", study[0]).data("Direction", false).data("Queue", []).data("IsUpdate", false).data("IsCancel", false).show();
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text("");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-View").attr("src", "");
    $("#SearchMenu-Command-Menu-DeleteImage-Foot").show();
    $("#SearchMenu-Command-Menu-DeleteImage-Foot-OK input").focus();

    // 画像削除シリーズ一覧取得処理
    SearchMenuCommand_DeleteImage_GetSeriesList();
}

// 画像削除シリーズ一覧取得処理
function SearchMenuCommand_DeleteImage_GetSeriesList() {
    // 要素削除
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").empty().data("SeriesCount", 0)
        .append(($("<span>").css("marginLeft", "3px").text("読み込み中")));
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").empty().data("ImageCount", 0);

    // チェックボックスを初期化
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectSeries input").val(["off"]);
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectImage input").val(["off"]);

    // シリーズ一覧取得
    Search_GetSeriesList(
        $("#SearchMenu-Command-Menu-DeleteImage").data("Study").StudyKey,
        null,
        function (result) {
            // キャンセルされた場合
            if (result.d.IsCancel == true) {
                // 画像削除終了処理
                SearchMenuCommand_DeleteImage_End();
                return;
            }

            // データなし
            var len = result.d.Tags.length;
            if (len == 0) {
                // 画像削除終了処理
                SearchMenuCommand_DeleteImage_End();
                return;
            }

            // 初期化
            $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").empty().data("SeriesCount", len);

            // 要素を作成
            var classStr = "SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item";
            var cnt = 1;
            $.each(result.d.Tags, function () {
                var row = $("<div>").addClass(classStr).data("SeriesKey", this.SeriesKey).data("IsFrames", (this.NumberOfImages < this.NumberOfFrames) ? true : false).data("Index", cnt)
                    .append($("<label>").addClass(classStr + "-Checkbox")
                        .append($("<input>").attr("type", "checkbox")))
                    .append($("<div>").addClass(classStr + "-Border"))
                    .append($("<div>").addClass(classStr + "-Content")
                        .append($("<div>").addClass(classStr + "-NowLoading"))
                        .append($("<div>").addClass(classStr + "-Thumbnail").css("backgroundImage", "url(../Viewer/GetThumbnail.aspx?key=" + this.SeriesKey + ")"))
                        .append($("<span>").addClass(classStr + "-SeriesNumber").text(this.SeriesNumber)));
                $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").append(row);
                cnt++;
            });
        }
    );
}

// 画像削除シリーズ選択処理
function SearchMenuCommand_DeleteImage_SeriesSelect($item) {
    // 削除キュー確認
    if ($("#SearchMenu-Command-Menu-DeleteImage").data("Queue").length != 0) {
        return;
    }

    // 画像削除
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").empty().data("ImageCount", 0)
        .append(($("<span>").css("marginLeft", "3px").text("読み込み中")));

    // 選択更新
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Select").removeClass("SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Select");
    $item.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Border").addClass("SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Select");

    // チェックボックスを初期化
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").find(":checkbox").val(["off"]);
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectSeries input").val(["off"]);
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectImage input").val(["off"]);

    // メッセージ更新
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text("");

    // マルチフレームか確認
    if ($item.data("IsFrames")) {
        $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").empty()
            .append(($("<span>").css("marginLeft", "3px").text("マルチフレームは")))
            .append(($("<br>")))
            .append(($("<span>").css("marginLeft", "3px").text("シリーズ削除のみ")))
            .append(($("<br>")))
            .append(($("<span>").css("marginLeft", "3px").text("行えます")));
        return;
    }

    // Image一覧取得
    Search_GetImageList(
        $item.data("SeriesKey"),
        null,
        function (result) {
            // キャンセルされた場合
            if (result.d.IsCancel == true) {
                return;
            }

            // データなし
            var len = result.d.ImTags.length;
            if (len == 0) {
                // 画像削除シリーズ一覧取得処理
                SearchMenuCommand_DeleteImage_GetSeriesList();
                return;
            }

            // 初期化
            $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").empty().data("ImageCount", len);

            // 要素を作成
            var classStr = "SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item";
            var cnt = 1;
            $.each(result.d.ImTags, function () {
                var size = (this.Columns > this.Rows) ? this.Columns : this.Rows;
                if (size > 512) {
                    // 最大サイズ
                    size = 512;
                }
                if (len > 10) {
                    // 枚数が多い場合は最大256
                    size = 256;
                }
                var src = "../Viewer/GetThumbnail2.aspx?key=" + this.ImageKey + "&size=" + size;
                var row = $("<div>").addClass(classStr).data("ImageKey", this.ImageKey).data("Index", cnt)
                    .append($("<label>").addClass(classStr + "-Checkbox")
                        .append($("<input>").attr("type", "checkbox")))
                    .append($("<div>").addClass(classStr + "-Border"))
                    .append($("<div>").addClass(classStr + "-Content")
                        .append($("<div>").addClass(classStr + "-NowLoading"))
                        .append($("<img>").addClass(classStr + "-Thumbnail").attr("width", "64").attr("height", "64").data("src", src).hide().on({ "load error": SearchMenuCommand_DeleteImage_LoadThumbnail }))
                        .append($("<span>").addClass(classStr + "-InstanceNumber").text(this.InstanceNumber)));
                $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").append(row);
                cnt++;
            });

            // 画像削除画像サムネイル読み込み処理
            SearchMenuCommand_DeleteImage_LoadThumbnail();
        }
    );
}

// 画像削除画像サムネイル読み込み処理
function SearchMenuCommand_DeleteImage_LoadThumbnail() {
    // imgタグの場合非表示を解除
    if ($(this).is("img")) {
        $(this).show();
    }

    // 一覧取得
    var $obj = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").children();

    // 向きを確認
    if ($("#SearchMenu-Command-Menu-DeleteImage").data("Direction")) {
        // 最終から空きに設定
        for (var i = $obj.length - 1; i >= 0; i--) {
            var $thumb = $obj.eq(i).find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Thumbnail");
            if ($thumb.attr("src") == undefined || $thumb.attr("src") == "") {
                $thumb.attr("src", $thumb.data("src"));
                $("#SearchMenu-Command-Menu-DeleteImage").data("Direction", false);
                break;
            }
        }
    }
    else {
        // 先頭から空きに設定
        for (var i = 0; i < $obj.length; i++) {
            var $thumb = $obj.eq(i).find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Thumbnail");
            if ($thumb.attr("src") == undefined || $thumb.attr("src") == "") {
                $thumb.attr("src", $thumb.data("src"));
                $("#SearchMenu-Command-Menu-DeleteImage").data("Direction", true);
                break;
            }
        }
    }
}

// 画像削除画像選択処理
function SearchMenuCommand_DeleteImage_ImageSelect($item) {
    // 削除キュー確認
    if ($("#SearchMenu-Command-Menu-DeleteImage").data("Queue").length != 0) {
        return;
    }

    // 選択更新
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Select").removeClass("SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Select");
    $item.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Border").addClass("SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Select");

    // 表示更新
    var $thumb = $item.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Thumbnail");
    var src = $thumb.data("src");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-View").attr("src", src);
    if ($thumb.attr("src") == undefined || $thumb.attr("src") == "") {
        // サムネイルに反映
        $thumb.off({ "load error": SearchMenuCommand_DeleteImage_LoadThumbnail }).attr("src", src).show();
    }
    var number = $item.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-InstanceNumber").text();
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-InstanceNumber").text("No : " + number);
    var cnt = "(" + $item.data("Index") + " / " + $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").data("ImageCount") + ")";
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Count").text(cnt);
    var check = $item.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Checkbox input").is(":checked");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Checkbox input").val(check ? ["on"] : ["off"]);
    var element = $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-View").get();
    if (element.length != 0 && !element[0].complete) {
        $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-NowLoading").show();
    }

    // 表示切り替え
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List").css("visibility", "hidden");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image").css("visibility", "visible");
    $("#SearchMenu-Command-Menu-DeleteImage-Foot").hide();
}

// 画像削除範囲選択処理
function SearchMenuCommand_DeleteImage_RangeSelect(isImage, $item, e) {
    // イベント確認
    if (!isImage) {
        var $list = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series");
        var $select = $list.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Select");
        var first = ($select.length == 0) ? -1 : $select.closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item").data("Index") - 1;
        var selectText = "SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Select";
        var borderText = ".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Border";
    }
    else {
        var $list = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image");
        var $select = $list.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Select");
        var first = ($select.length == 0) ? -1 : $select.closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item").data("Index") - 1;
        var selectText = "SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Select";
        var borderText = ".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Border";
    }
    var second = $item.data("Index") - 1;
    if (e.ctrlKey || !e.shiftKey || first == -1 || first == second) {
        // 選択更新
        $select.removeClass(selectText);
        $item.find(borderText).addClass(selectText);

        // 画像削除チェックボックスカウント処理
        SearchMenuCommand_DeleteImage_CheckboxCount(isImage);
        return;
    }

    // 選択状態を確認
    var check = ($list.children(":eq(" + first + ")").find("input:checked").length == 1) ? true : false;
    var min, max;
    if (first < second) {
        min = first;
        max = second;
    }
    else {
        min = second;
        max = first;
    }
    var $items = [];
    for (var i = min; i <= max; i++) {
        $items.push($list.children(":eq(" + i + ")").find(":checkbox"));
    }

    // 反転するか確認
    var rev = true;
    for (var i = 0; i < $items.length; i++) {
        if ($items[i].is(":checked") != check) {
            rev = false;
            break;
        }
    }
    if (rev) {
        check = !check;
    }
    var val = check ? ["on"] : ["off"];

    // 遅延処理を行う
    setTimeout(function () {
        // 範囲分ループ
        for (var i = 0; i < $items.length; i++) {
            $items[i].val(val);
        }

        // 画像削除チェックボックスカウント処理
        SearchMenuCommand_DeleteImage_CheckboxCount(isImage);
    }, 10);
}

// 画像削除全選択処理
function SearchMenuCommand_DeleteImage_AllSelect(isImage) {
    var $all = !isImage ? $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectSeries input") : $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectImage input");
    var $obj = !isImage ? $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series") : $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image");
    var $check = $obj.find(":checkbox");
    if ($all.is(":checked")) {
        $check.val(["on"]);
    }
    else {
        $check.val(["off"]);
    }

    // 画像削除チェックボックスカウント処理
    SearchMenuCommand_DeleteImage_CheckboxCount(isImage);
}

// 画像削除画像チェックボックスカウント処理
function SearchMenuCommand_DeleteImage_CheckboxCount(isImage) {
    // 遅延処理を行う
    setTimeout(function () {
        if (!isImage) {
            // 画像リスト初期化
            $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").empty().data("ImageCount", 0);

            // チェックボックス初期化
            $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectImage input").val(["off"]);

            // 状態チェック
            var count = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").data("SeriesCount");
            var select = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item input:checked").length;
            if (select == 0) {
                // メッセージ更新
                $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text("");

                // チェックボックス初期化
                $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectSeries input").val(["off"]);
            }
            else {
                // メッセージ更新
                $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text(count + "シリーズ中 " + select + "シリーズ選択");

                // チェックボックス初期化
                if (select == count) {
                    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectSeries input").val(["on"]);
                }
            }
        }
        else {
            // 状態チェック
            var count = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").data("ImageCount");
            var select = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item input:checked").length;
            if (select == 0) {
                // メッセージ更新
                if (count != 0) {
                    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text("");
                }

                // チェックボックス初期化
                $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectImage input").val(["off"]);
            }
            else {
                // メッセージ更新
                $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text("画像" + count + "枚中 " + select + "枚選択");

                // チェックボックス初期化
                if (select == count) {
                    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-AllSelectImage input").val(["on"]);
                }
            }
        }
    }, 10);
}

// 画像削除シリーズ処理
function SearchMenuCommand_DeleteImage_Series() {
    // 遅延処理を行う
    setTimeout(function () {
        // 削除キュー確認
        var queue = $("#SearchMenu-Command-Menu-DeleteImage").data("Queue");
        if (queue.length != 0) {
            return;
        }

        // 選択状態確認
        var $check = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item input:checked");
        if ($check.length == 0) {
            alert("シリーズが選択されていません。");
            return;
        }

        // 確認
        if (!confirm("本当に削除しますか？")) {
            return;
        }

        // キュー更新
        $check.each(function () {
            queue.push($(this).closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item").data("SeriesKey"));
        });
        $("#SearchMenu-Command-Menu-DeleteImage").data("Queue", queue).data("Count", queue.length);

        // メッセージ更新
        $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text("シリーズ削除中(1/" + queue.length + ")");

        // シリーズ削除
        Search_DelSeries(
            queue[0],
            null,
            SearchMenuCommand_DeleteImage_Series_Result
        ); // 削除後「画像削除シリーズ削除結果」呼び出し
    }, 10);
}

// 画像削除シリーズ削除結果
function SearchMenuCommand_DeleteImage_Series_Result(result) {
    // キャンセルされた場合
    if (result.d.IsCancel == true) {
        // 画像削除終了処理
        SearchMenuCommand_DeleteImage_End();
        return;
    }

    // キャンセルフラグが設定された場合
    if ($("#SearchMenu-Command-Menu-DeleteImage").data("IsCancel")) {
        // 確認
        if (confirm("画像削除を終了してもよろしいですか？")) {
            // 画像削除終了処理
            SearchMenuCommand_DeleteImage_End();
            return;
        }

        // キャンセルフラグを解除
        $("#SearchMenu-Command-Menu-DeleteImage").data("IsCancel", false);
    }

    // データ更新
    $("#SearchMenu-Command-Menu-DeleteImage").data("IsUpdate", true);
    var queue = $("#SearchMenu-Command-Menu-DeleteImage").data("Queue");
    queue.shift();

    // 処理完了時
    if (queue.length == 0) {
        // 画像削除シリーズ一覧取得処理
        SearchMenuCommand_DeleteImage_GetSeriesList();
        return;
    }

    // 表示更新
    var count = $("#SearchMenu-Command-Menu-DeleteImage").data("Count");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text("シリーズ削除中(" + (count - queue.length + 1) + "/" + count + ")");
    $("#SearchMenu-Command-Menu-DeleteImage").data("Queue", queue);

    // シリーズ削除
    Search_DelSeries(
        queue[0],
        null,
        SearchMenuCommand_DeleteImage_Series_Result
    ); // 削除後「画像削除シリーズ削除結果」呼び出し
}

// 画像削除画像処理
function SearchMenuCommand_DeleteImage_Image() {
    // 遅延処理を行う
    setTimeout(function () {
        // 削除キュー確認
        var queue = $("#SearchMenu-Command-Menu-DeleteImage").data("Queue");
        if (queue.length != 0) {
            return;
        }

        // 選択状態確認
        var $check = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item input:checked");
        if ($check.length == 0) {
            alert("画像が選択されていません。");
            return;
        }

        // 確認
        if (!confirm("本当に削除しますか？")) {
            return;
        }

        // キュー更新
        $check.each(function () {
            queue.push($(this).closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item").data("ImageKey"));
        });
        $("#SearchMenu-Command-Menu-DeleteImage").data("Queue", queue).data("Count", queue.length);

        // メッセージ更新
        $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text("画像削除中(1/" + queue.length + ")");

        // 画像削除
        Search_DelImage(
            queue[0],
            null,
            SearchMenuCommand_DeleteImage_Image_Result
        ); // 削除後「画像削除画像削除結果」呼び出し
    }, 10);
}

// 画像削除画像削除結果
function SearchMenuCommand_DeleteImage_Image_Result(result) {
    // キャンセルされた場合
    if (result.d.IsCancel == true) {
        // 画像削除終了処理
        SearchMenuCommand_DeleteImage_End();
        return;
    }

    // キャンセルフラグが設定された場合
    if ($("#SearchMenu-Command-Menu-DeleteImage").data("IsCancel")) {
        // 確認
        if (confirm("画像削除を終了してもよろしいですか？")) {
            // 画像削除終了処理
            SearchMenuCommand_DeleteImage_End();
            return;
        }

        // キャンセルフラグを解除
        $("#SearchMenu-Command-Menu-DeleteImage").data("IsCancel", false);
    }

    // データ更新
    $("#SearchMenu-Command-Menu-DeleteImage").data("IsUpdate", true);
    var queue = $("#SearchMenu-Command-Menu-DeleteImage").data("Queue");
    queue.shift();

    // 処理完了時
    if (queue.length == 0) {
        // 画像削除シリーズ選択処理
        SearchMenuCommand_DeleteImage_SeriesSelect($("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").find(":has(.SearchMenu-Command-Menu-DeleteImage-Body-List-Series-Item-Select)"));
        return;
    }

    // 表示更新
    var count = $("#SearchMenu-Command-Menu-DeleteImage").data("Count");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Message").text("画像削除中(" + (count - queue.length + 1) + "/" + count + ")");
    $("#SearchMenu-Command-Menu-DeleteImage").data("Queue", queue);

    // 画像削除
    Search_DelImage(
        queue[0],
        null,
        SearchMenuCommand_DeleteImage_Image_Result
    ); // 削除後「画像削除画像削除結果」呼び出し
}

// 画像削除チェックボックス更新処理
function SearchMenuCommand_DeleteImage_UpdateCheckbox() {
    // 現在の状態を取得
    var $select = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image")
        .find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Select")
        .closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item")
        .find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Checkbox input");
    var check = $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Checkbox input").is(":checked");

    // 選択更新
    $select.val(check ? ["on"] : ["off"]);

    // 画像削除チェックボックスカウント処理
    SearchMenuCommand_DeleteImage_CheckboxCount(true);
}

// 画像削除表示変更処理
function SearchMenuCommand_DeleteImage_ChangeView(isNext) {
    // 状態確認
    var $obj = $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image");
    var $select = $obj.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Select");
    var index = $select.closest(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item").data("Index");
    var imageCount = $obj.data("ImageCount");
    if (isNext) {
        var checkIndex = imageCount;
        var nextIndex = index;
    }
    else {
        var checkIndex =  1;
        var nextIndex = index - 2;
    }
    if (index == checkIndex) {
        // 何もしない
        return;
    }

    // 選択更新
    $select.removeClass("SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Select");
    var $item = $obj.children().eq(nextIndex);
    $item.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Border").addClass("SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Select");

    // スクロール位置更新
    if (isNext) {
        var area = $obj.height();
        var h = $obj.children().eq(0).outerHeight({ margin: true });
        var scr = $obj.scrollTop();
        var off = h * (index + 1);
        if (off - scr > area) {
            $obj.scrollTop(off - area);
        }
    }
    else {
        var h = $obj.children().eq(0).outerHeight({ margin: true });
        var scr = $obj.scrollTop();
        var off = h * (index - 2);
        if (off - scr < 0) {
            $obj.scrollTop(off);
        }
    }

    // 表示更新
    var $thumb = $item.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Thumbnail");
    var src = $thumb.data("src");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-View").attr("src", src);
    if ($thumb.attr("src") == undefined || $thumb.attr("src") == "") {
        // サムネイルに反映
        $thumb.off({ "load error": SearchMenuCommand_DeleteImage_LoadThumbnail }).attr("src", src).show();
    }
    var number = $item.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-InstanceNumber").text();
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-InstanceNumber").text("No : " + number);
    var cnt = "(" + $item.data("Index") + " / " + imageCount + ")";
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Count").text(cnt);
    var check = $item.find(".SearchMenu-Command-Menu-DeleteImage-Body-List-Image-Item-Checkbox input").is(":checked");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-Checkbox input").val(check ? ["on"] : ["off"]);
    var element = $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-View").get();
    if (element.length != 0 && !element[0].complete) {
        $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-NowLoading").show();
    }
}

// 画像削除戻る処理
function SearchMenuCommand_DeleteImage_Return() {
    // 表示切り替え
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List").css("visibility", "visible");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image").css("visibility", "hidden");
    $("#SearchMenu-Command-Menu-DeleteImage-Body-Image-View").attr("src", "");
    $("#SearchMenu-Command-Menu-DeleteImage-Foot").show();
}

// 画像削除キャンセル処理
function SearchMenuCommand_DeleteImage_Cancel() {
    // 削除中か確認
    if ($("#SearchMenu-Command-Menu-DeleteImage").data("Queue").length != 0) {
        // キャンセルフラグを設定
        $("#SearchMenu-Command-Menu-DeleteImage").data("IsCancel", true);
        return;
    }

    // 遅延処理を行う
    setTimeout(function () {
        // 確認
        if (!confirm("画像削除を終了してもよろしいですか？")) {
            return;
        }

        // 画像削除終了処理
        SearchMenuCommand_DeleteImage_End();
    }, 10);
}

// 画像削除終了処理
function SearchMenuCommand_DeleteImage_End() {
    // データ取得
    var study = $("#SearchMenu-Command-Menu-DeleteImage").data("Study");
    var isUpdate = $("#SearchMenu-Command-Menu-DeleteImage").data("IsUpdate");

    // 要素削除
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Series").empty().data("SeriesCount", 0);
    $("#SearchMenu-Command-Menu-DeleteImage-Body-List-Image").empty().data("ImageCount", 0);

    // 非表示
    $("#SearchMenu-Command-Menu-DeleteImage").removeData("Study").removeData("Direction").removeData("Queue").removeData("IsUpdate").removeData("IsCancel").hide();
    SearchMenuCommand_Common_Hide();

    // 更新確認
    if (isUpdate) {
        // 再検索処理
        SearchMenu_ReSearch(study.StudyKey);
    }
}

// オプションボタンクリック処理
function SearchMenuCommand_Option_Button_Click() {
    // 未選択状態の場合
    if ($("#SearchMenu-Command-Sub-Option").is(":hidden")) {
        // サブメニューキャンセル処理
        SearchMenu_Cancel();

        // 表示処理
        SearchMenuCommand_Option_Sub_Show();
    }
    // 選択状態の場合
    else {
        // キャンセル処理
        SearchMenuCommand_Option_Cancel();
    }
}

// オプションボタンキャンセル処理
function SearchMenuCommand_Option_Cancel() {
    // アイコン変更
    $("#SearchMenu-Command-Option").removeClass("SearchMenu-Command-Option-ON").addClass("SearchMenu-Command-Option-OFF");

    // アイコン変更
    $("#SearchMenu-Command-Sub-Option").hide();
}

// オプションボタン表示処理(サブメニュー)
function SearchMenuCommand_Option_Sub_Show() {
    // アイコン変更
    $("#SearchMenu-Command-Option").removeClass("SearchMenu-Command-Option-OFF").addClass("SearchMenu-Command-Option-ON");

    // サブメニュー表示位置補正表示
    var offset = $("#SearchMenu-Command-Option").offset();
    var width = ($("#SearchMenu-Command-Sub-Option").width() + 3) / 2;
    $("#SearchMenu-Command-Sub-Option").css({ left: offset.left + 24 - width, top: offset.top + 48 })
                                       .show();
}

// オプションボタンクリック処理(サブメニュー)
function SearchMenuCommand_Option_Sub_Click($this) {
    // 処理取得
    var command = $this.data("command");

    // パスワード変更の場合
    if (command == "ChangePass") {
        // パスワード変更処理
        SearchMenuCommand_ChangePass();
        return;
    }

    // 使用容量表示の場合
    if (command == "UsedSize") {
        // 使用容量表示処理
        SearchMenuCommand_UsedSize();
        return;
    }

    // CSVフォーマット表示の場合
    if (command == "CsvFormat") {
        // CSVフォーマット表示処理
        SearchMenuCommand_CsvFormat();
        return;
    }

    // ポータルマスタ設定の場合
    if (command == "SetPortalMst") {
        // ポータルマスタ設定処理
        SearchMenuCommand_SetPortalMst();
        return;
    }
}

// パスワード変更処理
function SearchMenuCommand_ChangePass() {
    // メッセージクリア
    $("#SearchMenu-Command-Menu-ChangePass-Body-Message").text("");

    // 表示
    SearchMenuCommand_Common_Show();
    $("#SearchMenu-Command-Menu-ChangePass").show();

    // パスワード変更クリア処理
    SearchMenuCommand_ChangePass_Clear();
}

// パスワード変更チェック処理
function SearchMenuCommand_ChangePass_Check() {
    // チェック
    if ($("#SearchMenu-Command-Menu-ChangePass-Body-Present-Text input").val() == "" ||
        $("#SearchMenu-Command-Menu-ChangePass-Body-New-Text input").val() == "" ||
        $("#SearchMenu-Command-Menu-ChangePass-Body-Confirm-Text input").val() == "") {
        $("#SearchMenu-Command-Menu-ChangePass-Body-Message").text("未入力の項目があります。");
        // パスワード変更クリア処理
        SearchMenuCommand_ChangePass_Clear();
        return;
    }
    if ($("#SearchMenu-Command-Menu-ChangePass-Body-New-Text input").val() !=
        $("#SearchMenu-Command-Menu-ChangePass-Body-Confirm-Text input").val()) {
        $("#SearchMenu-Command-Menu-ChangePass-Body-Message").text("パスワードが一致しません。");
        // パスワード変更クリア処理
        SearchMenuCommand_ChangePass_Clear();
        return;
    }
    var figure = parseInt($("#ViewerConfig").data("figurepassword"));
    if (!isNaN(figure)) {
        var len = $("#SearchMenu-Command-Menu-ChangePass-Body-New-Text input").val().length;
        if (len < figure) {
            $("#SearchMenu-Command-Menu-ChangePass-Body-Message").text(figure + "文字以上入力してください。");
            return;
        }
        if (len > 64) {
            $("#SearchMenu-Command-Menu-ChangePass-Body-Message").text("入力文字数が長すぎます。");
            return;
        }
    }

    // パスワード設定
    Search_SetUserPassword(
        $("#SearchMenu-Command-Menu-ChangePass-Body-Present-Text input").val(),
        $("#SearchMenu-Command-Menu-ChangePass-Body-New-Text input").val(),
        null,
        SearchMenuCommand_SetUserPassword_Result
    ); // 設定後「パスワード設定結果」呼び出し
}

// パスワード設定結果
function SearchMenuCommand_SetUserPassword_Result(result) {
    // データチェック
    if (result.d.Result == "Error") {
        if (result.d.Message == "ServiceError") {
            $("#SearchMenu-Command-Menu-ChangePass-Body-Message").text("パスワードが違います。");
        }
        if (result.d.Message == "ParameterNG") {
            $("#SearchMenu-Command-Menu-ChangePass-Body-Message").text("入力禁止文字が含まれています。");
        }

        // パスワード変更クリア処理
        SearchMenuCommand_ChangePass_Clear();
        return;
    }

    // 入力中をキャンセルするためフォーカスを外す
    $(":input").blur();

    // 非表示
    $("#SearchMenu-Command-Menu-ChangePass").hide();
    SearchMenuCommand_Common_Hide();
}

// パスワード変更クリア処理
function SearchMenuCommand_ChangePass_Clear() {
    $("#SearchMenu-Command-Menu-ChangePass-Body-New-Text input").val("");
    $("#SearchMenu-Command-Menu-ChangePass-Body-Confirm-Text input").val("");
    $("#SearchMenu-Command-Menu-ChangePass-Body-Present-Text input").val("").focus();
}

// 使用容量表示処理
function SearchMenuCommand_UsedSize() {
    // 表示初期化
    $("#SearchMenu-Command-Menu-UsedSize-Body-Text").text("取得中...");
    SearchMenuCommand_Common_Show();
    $("#SearchMenu-Command-Menu-UsedSize").show();
    $("#SearchMenu-Command-Menu-UsedSize-Foot-OK input").focus();

    // 使用容量情報取得
    Search_GetStorage(null, SearchMenuCommand_GetStorage_Result); // 取得後「使用容量情報取得結果」呼び出し
}

// 使用容量情報取得結果
function SearchMenuCommand_GetStorage_Result(result) {
    // 表示
    $("#SearchMenu-Command-Menu-UsedSize-Body-Text").text(Common_FileSizeFmt(result.d.Capacity) + " 中 " + Common_FileSizeFmt(result.d.InUse) + " を使用しています");
}

// CSVフォーマット表示処理
function SearchMenuCommand_CsvFormat() {
    // 検査情報一覧取得処理
    var study = SearchStudyList_GetList(true);
    for (var i = 0; i < study.length; i++) {
        // 検査情報一覧拡張
        study[i].ShortUrl = "";
    }

    // 表示初期化
    SearchMenuCommand_Common_Show();
    $("#SearchMenu-Command-Menu-CsvFormat").data("Count", 0).data("StudyList", study).show();
    $("#SearchMenu-Command-Menu-CsvFormat-Foot-OK input").focus();

    // 短縮URL有効の場合
    if ($("#ViewerConfig").data("IsShortURL") == "1") {
        // CSVフォーマット用短縮URL取得処理
        SearchMenuCommand_CsvFormat_GetShortUrl();
    }
    else {
        // CSVフォーマット設定処理
        SearchMenuCommand_CsvFormat_Set();
    }
}

// CSVフォーマット用短縮URL取得処理
function SearchMenuCommand_CsvFormat_GetShortUrl() {
    // 情報取得
    var count = $("#SearchMenu-Command-Menu-CsvFormat").data("Count");
    var list = $("#SearchMenu-Command-Menu-CsvFormat").data("StudyList");

    // 表示状態確認
    if ($("#SearchMenu-Command-Menu-CsvFormat").is(":hidden")) {
        // キャンセル
        return;
    }

    // 取得完了確認
    if (count >= list.length) {
        // CSVフォーマット設定処理
        SearchMenuCommand_CsvFormat_Set();
        return;
    }

    // 取得中表示更新
    $("#SearchMenu-Command-Menu-CsvFormat-Body-Text textarea").text("取得中(" + count + "/" + list.length + ")");

    // 短縮URL取得
    Search_GetShortUrl(
        list[count].StudyKey,
        null,
        SearchMenuCommand_CsvFormat_GetShortUrl_Result
    ); // 取得後「CSVフォーマット用短縮URL取得結果」呼び出し
}

// CSVフォーマット用短縮URL取得結果
function SearchMenuCommand_CsvFormat_GetShortUrl_Result(result) {
    // 情報取得
    var count = $("#SearchMenu-Command-Menu-CsvFormat").data("Count");
    var list = $("#SearchMenu-Command-Menu-CsvFormat").data("StudyList");

    // 情報更新
    list[count].ShortUrl = result.d.StudyUrl;
    $("#SearchMenu-Command-Menu-CsvFormat").data("StudyList", list);
    count++;
    $("#SearchMenu-Command-Menu-CsvFormat").data("Count", count);

    // CSVフォーマット用短縮URL取得処理
    SearchMenuCommand_CsvFormat_GetShortUrl();
}

// CSVフォーマット設定処理
function SearchMenuCommand_CsvFormat_Set() {
    // 情報取得
    var isShortURL = $("#ViewerConfig").data("IsShortURL");
    var list = $("#SearchMenu-Command-Menu-CsvFormat").data("StudyList");
    var csv = "";

    // ヘッダ作成
    $("#StudyList-View .StudyList-Head-Center:not(.StudyList-Body-Left-Margin,.StudyList-Body-Memo,.StudyList-Body-StudyPassword,.StudyList-Body-Portal,.StudyList-Body-ShortURL,.StudyList-Body-Right-Margin,:hidden)").each(function () {
        // ヘッダ文字列追加
        if (csv != "") {
            csv += ",";
        }
        csv += "\"" + $(this).text() + "\"";
    });

    // 短縮URL有効の場合
    if (isShortURL == "1") {
        if (csv != "") {
            csv += ",";
        }
        csv += "\"短縮URL\"";
    }

    // 改行追加
    csv += "\r\n";

    // 各行作成
    for (var i = 0; i < list.length; i++) {
        var tmp = "";
        $(list[i].$obj.children(":not(.StudyList-Body-Left,.StudyList-Body-Left-Margin,.StudyList-Body-Memo,.StudyList-Body-StudyPassword,.StudyList-Body-Portal,.StudyList-Body-ShortURL,.StudyList-Body-Right-Margin,.StudyList-Body-Margin,:hidden)")).each(function () {
            // 文字列追加
            if (tmp != "") {
                tmp += ",";
            }
            tmp += "\"" + $(this).text() + "\"";
        });

        // 短縮URL有効の場合
        if (isShortURL == "1") {
            if (tmp != "") {
                tmp += ",";
            }
            tmp += "\"" + list[i].ShortUrl + "\"";
        }

        // 行追加
        csv += tmp + "\r\n";
    }

    // 表示更新
    $("#SearchMenu-Command-Menu-CsvFormat-Body-Text textarea").text(csv);
}

// ポータルマスタ設定処理
function SearchMenuCommand_SetPortalMst() {
    // ポータルマスタ取得
    Search_GetPortalMst(
        null,
        function (result) {
            // 表示初期化
            $("#SearchMenu-Command-Menu-SetPortalMst-Body-Title-Text input").val(result.d.Items[0].Title);
            $("#SearchMenu-Command-Menu-SetPortalMst-Body-Column1-Text input").val(result.d.Items[0].Column1);
            $("#SearchMenu-Command-Menu-SetPortalMst-Body-Column2-Text input").val(result.d.Items[0].Column2);
            $("#SearchMenu-Command-Menu-SetPortalMst-Body-Column3-Text input").val(result.d.Items[0].Column3);
            $("#SearchMenu-Command-Menu-SetPortalMst-Body-Password-Text input").val(result.d.Items[0].Password);
            $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkTitle-Text input").val(result.d.Items[0].LinkTitle);
            $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Text input").val(result.d.Items[0].LinkURL);
            $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("");
            SearchMenuCommand_Common_Show();
            $("#SearchMenu-Command-Menu-SetPortalMst").show();
            $("#SearchMenu-Command-Menu-SetPortalMst-Body-Title-Text input").focus();
        }
    );
}

// ポータルマスタ設定ボタンクリック処理
function SearchMenuCommand_SetPortalMst_Button_Click() {
    // 項目作成
    var param = {};
    param["Title"] = $("#SearchMenu-Command-Menu-SetPortalMst-Body-Title-Text input").val();
    param["Column1"] = $("#SearchMenu-Command-Menu-SetPortalMst-Body-Column1-Text input").val();
    param["Column2"] = $("#SearchMenu-Command-Menu-SetPortalMst-Body-Column2-Text input").val();
    param["Column3"] = $("#SearchMenu-Command-Menu-SetPortalMst-Body-Column3-Text input").val();
    param["Password"] = $("#SearchMenu-Command-Menu-SetPortalMst-Body-Password-Text input").val();
    param["LinkTitle"] = $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkTitle-Text input").val();
    param["LinkURL"] = $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Text input").val();

    // 項目チェック
    if (param["Title"].length > 32) {
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("「タイトル」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Title-Text input").focus().select();
        return;
    }
    if (param["Column1"].length > 16) {
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("「項目1」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Column1-Text input").focus().select();
        return;
    }
    if (param["Column2"].length > 16) {
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("「項目2」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Column2-Text input").focus().select();
        return;
    }
    if (param["Column3"].length > 16) {
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("「項目3」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Column3-Text input").focus().select();
        return;
    }
    if (param["Password"].length > 16) {
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("「パスワード」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Password-Text input").focus().select();
        return;
    }
    if (param["Password"].match(/[^!-~]/)) {
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("「パスワード」を半角英数字記号で入力してください。");
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Password-Text input").focus().select();
        return;
    }
    if (param["LinkTitle"].length > 16) {
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("「リンク名」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkTitle-Text input").focus().select();
        return;
    }
    if (param["LinkURL"].length > 256) {
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("「URL」を短くしてください。");
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Text input").focus().select();
        return;
    }
    if (param["LinkURL"].length > 0 && param["LinkURL"].indexOf("http://") != 0 && param["LinkURL"].indexOf("https://") != 0) {
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-Message").text("「URL」のパスが正しくありません。");
        $("#SearchMenu-Command-Menu-SetPortalMst-Body-LinkURL-Text input").focus().select();
        return;
    }

    // ポータルマスタ設定
    Search_SetPortalMst(
        param,
        null,
        function (result) {
            // ポータルマスタ初期化
            $("#ViewerConfig").data("PortalMst", null);

            // ポータル設定非表示処理
            SearchMenuCommand_SetPortalMst_Hide();
        }
    );
}

// ポータルマスタ設定非表示処理
function SearchMenuCommand_SetPortalMst_Hide() {
    // 入力中をキャンセルするためフォーカスを外す
    $(":input").blur();

    // 非表示
    $("#SearchMenu-Command-Menu-SetPortalMst").hide();
    SearchMenuCommand_Common_Hide();
}

// 共通表示処理
function SearchMenuCommand_Common_Show() {
    $("#StudyList-View thead :input").attr("disabled", "disabled");
    $("#CommonLayer").show();
}

// 共通非表示処理
function SearchMenuCommand_Common_Hide() {
    $("#StudyList-View thead :input").removeAttr("disabled");
    $("#CommonLayer").hide();
}