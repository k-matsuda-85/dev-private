/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// 起動処理
$(window).load(function () {
    // サイズが0の場合があるのでタイマでチェックする
    var timerID = setInterval(function () {
        // サイズチェック
        if ($(window).width() == 0 || $(window).height() == 0) {
            return;
        }

        // タイマ終了
        clearInterval(timerID);

        // 初期化処理
        DicomTagWindow_Init();
    }, 100);
});

// 初期化処理
function DicomTagWindow_Init() {
    // URLパラメータ取得
    var params = Common_GetUrlParams();
    if (params.length == 0) {
        Common_ErrorProc("URLパラメータ不足です。", true);
        return;
    }

    // 各種パラメータ取得
    var key = ("key" in params) ? params["key"] : "";   //ImageKeyはサービス側でデコードするためそのまま
    var skey = ("sk" in params) ? params["sk"] : "";

    // パラメータチェック
    if (key == "") {
        Common_ErrorProc("URLパラメータが正しくありません。", true);
        return;
    }
    if (skey != "") {
        // SKey初期化
        _Viewer_SKey = Viewer_GetStringJson(skey);
    }

    // DicomTag一覧取得
    Viewer_GetDicomTagAll(key, null, DicomTagWindow_GetDicomTagAll_Result);  // 取得後「DicomTag一覧取得結果」呼び出し

    // iOS8で画面レイアウトが崩れるため暫定追加
    $("body").scrollTop(0);
    $("body").scrollLeft(0);

    // リサイズ処理
    DicomTagWindow_Resize_Proc();

    // 初期化完了のため表示
    $("body").css("visibility", "visible");

    // 全体のリサイズ処理設定
    $(window).resize(function () {
        // リサイズ処理
        DicomTagWindow_Resize_Proc();
    })
}

// DicomTag一覧取得結果
function DicomTagWindow_GetDicomTagAll_Result(result) {
    // 要素を作成
    $.each(result.d.Tags, function () {
        var group = (this.Tag >> 16).toString(16);
        group = group.toUpperCase();
        switch (group.length) {
            case 1:
                group = "000" + group;
                break;
            case 2:
                group = "00" + group;
                break;
            case 3:
                group = "0" + group;
                break;
        }
        var element = (this.Tag & 0xFFFF).toString(16);
        element = element.toUpperCase();
        switch (element.length) {
            case 1:
                element = "000" + element;
                break;
            case 2:
                element = "00" + element;
                break;
            case 3:
                element = "0" + element;
                break;
        }
        if (this.EName == null) {
            this.EName = "";
        }
        if (this.JName == null) {
            this.JName = "";
        }
        var row = $("<tr>")
            .append($("<td>").addClass("DicomTagList-Item DicomTagList-Body-Group").text(group).append($("<span>")))
            .append($("<td>").addClass("DicomTagList-Item DicomTagList-Body-Element").text(element).append($("<span>")))
            .append($("<td>").addClass("DicomTagList-Item DicomTagList-Body-EName").text(this.EName).append($("<span>")))
            .append($("<td>").addClass("DicomTagList-Item DicomTagList-Body-JName").text(this.JName).append($("<span>")))
            .append($("<td>").addClass("DicomTagList-Item DicomTagList-Body-VR").text(this.VR).append($("<span>")))
            .append($("<td>").addClass("DicomTagList-Item DicomTagList-Body-Length").text(this.DataSize).append($("<span>")))
            .append($("<td>").addClass("DicomTagList-Item DicomTagList-Body-Value").text(this.Value).append($("<span>")))
        $("#DicomTagList-View tbody").append(row);
    });
}

// リサイズ処理
function DicomTagWindow_Resize_Proc() {
    // 高さ算出
    var height = $(window).height();  //全体の高さ

    // StudyList更新
    $("#DicomTagList").height(height);
}
