/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
// 検査メモ用コントロールクラス
function StudyMemoControlItem(studyKey, count, memoItem) {
    this.StudyKey = studyKey;
    this.Count = count;
    this.MemoItem = memoItem;
}

// 検査メモ用コントロール管理用
var StudyMemoControl = {
    Status: "Normal",
    StudyKey: null,
    Memo: "",
    HisUserName: "",
    HisMemoDate: "",
    History: "",
    Items: new Array(),
    // クリア
    Clear: function (all) {
        this.Status = "Normal";
        this.StudyKey = null;
        this.Memo = "";
        this.HisUserName = "";
        this.HisMemoDate = "";
        this.History = "";
        if (all) {
            this.Items = new Array();
        }
    },
    // 設定
    Set: function (studyKey, count, memoItem) {
        for (var i = 0; i < this.Items.length; i++) {
            if (this.Items[i].StudyKey == studyKey) {
                this.Items[i].Count = count;
                this.Items[i].MemoItem = memoItem;
                return;
            }
        }
        this.Items.push(new StudyMemoControlItem(studyKey, count, memoItem));
    },
    // 取得
    Get: function (studyKey) {
        for (var i = 0; i < this.Items.length; i++) {
            if (this.Items[i].StudyKey == studyKey) {
                return this.Items[i];
            }
        }
        return null;
    }
};

// 初期化処理
function ViewerStudyMemo_Init() {
    // 権限確認
    if ($("#ViewerConfig").data("StudyMemo") != "1" &&
        $("#ViewerConfig").data("StudyMemo") != "2" &&
        $("#ViewerConfig").data("StudyMemo") != "3") {
        return;
    }

    // 要素作成
    var $viewerRight = $("#ViewerRight");
    $viewerRight.append($("<div>").attr("id", "StudyMemo")
        .append($("<div>").attr("id", "StudyMemo-Margin")
            .append($("<div>").attr("id", "StudyMemo-StudyInfo")
                .append($("<div>").attr("id", "StudyMemo-StudyInfo-Showing"))
                .append($("<div>").attr("id", "StudyMemo-StudyInfo-StudyDate"))
                .append($("<div>").attr("id", "StudyMemo-StudyInfo-Modality")))
            .append($("<div>").attr("id", "StudyMemo-Button")
                .append($("<div>").attr("id", "StudyMemo-Button-1"))
                .append($("<div>").attr("id", "StudyMemo-Button-2"))
                .append($("<div>").attr("id", "StudyMemo-Button-3"))
                .append($("<div>").attr("id", "StudyMemo-Button-Close").addClass("StudyMemo-Button-Close-OFF")))
            .append($("<div>").attr("id", "StudyMemo-RegUserName"))
            .append($("<div>").attr("id", "StudyMemo-RegMemoDate"))
            .append($("<div>")
                .append($("<textarea>").attr("id", "StudyMemo-Text").addClass("StudyMemo-Text-Normal").attr("cols", "20").attr("rows", "5").attr("readonly", "readonly")))));
    
    // 表示領域の設定
    $("#ViewerRight").width($("#ViewerConfig").data("StudyMemoWidth") + "px");
    $("#StudyMemo-Text").width(parseInt($("#ViewerConfig").data("StudyMemoWidth")) - 18 + "px");

    // フォントサイズの設定
    $("#StudyMemo-Text").css("fontSize", $("#ViewerConfig").data("StudyMemoSize"));

    // 編集ボタンイベント設定
    $("#StudyMemo-Button-1").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 選択状態
            $this.removeClass("StudyMemo-Button-Edit-OFF").addClass("StudyMemo-Button-Edit-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Edit-OFF").addClass("StudyMemo-Button-Edit-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Edit-ON").addClass("StudyMemo-Button-Edit-OFF");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // 検査メモ編集開始処理
                    ViewerStudyMemo_Edit_Start();
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Edit-ON").addClass("StudyMemo-Button-Edit-OFF");

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 選択状態
            $this.removeClass("StudyMemo-Button-Edit-OFF").addClass("StudyMemo-Button-Edit-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Edit-OFF").addClass("StudyMemo-Button-Edit-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Edit-ON").addClass("StudyMemo-Button-Edit-OFF");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // 検査メモ編集開始処理
                    ViewerStudyMemo_Edit_Start();
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Edit-ON").addClass("StudyMemo-Button-Edit-OFF");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".StudyMemo-Button-Edit-OFF");

    // 登録ボタンイベント設定
    $("#StudyMemo-Button-1").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 選択状態
            $this.removeClass("StudyMemo-Button-Register-OFF").addClass("StudyMemo-Button-Register-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Register-OFF").addClass("StudyMemo-Button-Register-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Register-ON").addClass("StudyMemo-Button-Register-OFF");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // タッチイベント二重動作防止のためタイマを使用する
                    setTimeout(function () {
                        // 検査メモ編集登録処理
                        ViewerStudyMemo_Edit_Register();
                    }, 100);
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Register-ON").addClass("StudyMemo-Button-Register-OFF");

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 選択状態
            $this.removeClass("StudyMemo-Button-Register-OFF").addClass("StudyMemo-Button-Register-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Register-OFF").addClass("StudyMemo-Button-Register-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Register-ON").addClass("StudyMemo-Button-Register-OFF");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // 検査メモ編集登録処理
                    ViewerStudyMemo_Edit_Register();
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Register-ON").addClass("StudyMemo-Button-Register-OFF");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".StudyMemo-Button-Register-OFF");

    // 戻るボタンイベント設定
    $("#StudyMemo-Button-1").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 選択状態
            $this.removeClass("StudyMemo-Button-Back-OFF").addClass("StudyMemo-Button-Back-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Back-OFF").addClass("StudyMemo-Button-Back-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Back-ON").addClass("StudyMemo-Button-Back-OFF");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // 検査メモ参照戻る処理
                    ViewerStudyMemo_Reference_Back();
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Back-ON").addClass("StudyMemo-Button-Back-OFF");

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 選択状態
            $this.removeClass("StudyMemo-Button-Back-OFF").addClass("StudyMemo-Button-Back-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Back-OFF").addClass("StudyMemo-Button-Back-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Back-ON").addClass("StudyMemo-Button-Back-OFF");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // 検査メモ参照戻る処理
                    ViewerStudyMemo_Reference_Back();
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Back-ON").addClass("StudyMemo-Button-Back-OFF");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".StudyMemo-Button-Back-OFF");

    // 削除ボタンイベント設定
    $("#StudyMemo-Button-2").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 選択状態
            $this.removeClass("StudyMemo-Button-Delete-OFF").addClass("StudyMemo-Button-Delete-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Delete-OFF").addClass("StudyMemo-Button-Delete-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Delete-ON").addClass("StudyMemo-Button-Delete-OFF");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // タッチイベント二重動作防止のためタイマを使用する
                    setTimeout(function () {
                        // 検査メモ削除処理
                        ViewerStudyMemo_Delete();
                    }, 100);
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Delete-ON").addClass("StudyMemo-Button-Delete-OFF");

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 選択状態
            $this.removeClass("StudyMemo-Button-Delete-OFF").addClass("StudyMemo-Button-Delete-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Delete-OFF").addClass("StudyMemo-Button-Delete-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Delete-ON").addClass("StudyMemo-Button-Delete-OFF");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // 検査メモ削除処理
                    ViewerStudyMemo_Delete();
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Delete-ON").addClass("StudyMemo-Button-Delete-OFF");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".StudyMemo-Button-Delete-OFF");

    // 破棄ボタンイベント設定
    $("#StudyMemo-Button-2").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 選択状態
            $this.removeClass("StudyMemo-Button-Cancel-OFF").addClass("StudyMemo-Button-Cancel-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Cancel-OFF").addClass("StudyMemo-Button-Cancel-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Cancel-ON").addClass("StudyMemo-Button-Cancel-OFF");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // タッチイベント二重動作防止のためタイマを使用する
                    setTimeout(function () {
                        // 検査メモ編集キャンセル処理
                        ViewerStudyMemo_Edit_Cancel();
                    }, 100);
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Cancel-ON").addClass("StudyMemo-Button-Cancel-OFF");

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 選択状態
            $this.removeClass("StudyMemo-Button-Cancel-OFF").addClass("StudyMemo-Button-Cancel-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Cancel-OFF").addClass("StudyMemo-Button-Cancel-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Cancel-ON").addClass("StudyMemo-Button-Cancel-OFF");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // 検査メモ編集キャンセル処理
                    ViewerStudyMemo_Edit_Cancel();
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Cancel-ON").addClass("StudyMemo-Button-Cancel-OFF");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".StudyMemo-Button-Cancel-OFF");

    // コピーボタンイベント設定
    $("#StudyMemo-Button-2").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 選択状態
            $this.removeClass("StudyMemo-Button-Copy-OFF").addClass("StudyMemo-Button-Copy-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Copy-OFF").addClass("StudyMemo-Button-Copy-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Copy-ON").addClass("StudyMemo-Button-Copy-OFF");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // 検査メモ参照コピー処理
                    ViewerStudyMemo_Reference_Copy();
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Copy-ON").addClass("StudyMemo-Button-Copy-OFF");

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 選択状態
            $this.removeClass("StudyMemo-Button-Copy-OFF").addClass("StudyMemo-Button-Copy-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Copy-OFF").addClass("StudyMemo-Button-Copy-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Copy-ON").addClass("StudyMemo-Button-Copy-OFF");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // 検査メモ参照コピー処理
                    ViewerStudyMemo_Reference_Copy();
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Copy-ON").addClass("StudyMemo-Button-Copy-OFF");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".StudyMemo-Button-Copy-OFF");

    // 履歴ボタンイベント設定
    $("#StudyMemo-Button-3").on({
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
                    // 検査メモ履歴処理
                    ViewerStudyMemo_History();
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
                    // 検査メモ履歴処理
                    ViewerStudyMemo_History();
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".StudyMemo-Button-History-OFF");

    // 閉じるボタンイベント設定
    $("#StudyMemo-Button-Close").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
                return false;
            }

            // 選択状態
            $this.removeClass("StudyMemo-Button-Close-OFF").addClass("StudyMemo-Button-Close-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // タッチイベント設定
            var event = function (e) {
                // タッチ移動時
                if (e.type == "touchmove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Close-OFF").addClass("StudyMemo-Button-Close-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Close-ON").addClass("StudyMemo-Button-Close-OFF");
                    }
                    return;
                }

                // クリック時
                if (e.type == "touchend" && rectInfo.IsHit) {
                    // タッチイベント二重動作防止のためタイマを使用する
                    setTimeout(function () {
                        // 閉じる
                        Tool_StudyMemo.Command(false);
                    }, 100);
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Close-ON").addClass("StudyMemo-Button-Close-OFF");

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function () {
            var $this = $(this);

            // 選択状態
            $this.removeClass("StudyMemo-Button-Close-OFF").addClass("StudyMemo-Button-Close-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // マウスイベント設定
            var event = function (e) {
                // マウス移動時
                if (e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(e.pageX, e.pageY)) {
                        // 選択状態
                        $this.removeClass("StudyMemo-Button-Close-OFF").addClass("StudyMemo-Button-Close-ON");
                    }
                    else {
                        // 選択状態解除
                        $this.removeClass("StudyMemo-Button-Close-ON").addClass("StudyMemo-Button-Close-OFF");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if (e.type == "mouseup" && rectInfo.IsHit) {
                    // 閉じる
                    Tool_StudyMemo.Command(false);
                }

                // 選択状態解除
                $this.removeClass("StudyMemo-Button-Close-ON").addClass("StudyMemo-Button-Close-OFF");

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    });
}

// 検査メモ編集開始処理
function ViewerStudyMemo_Edit_Start() {
    // 検査情報更新
    var $select = $("#StudyList-Table .StudyList-Table-Row-Select");
    $select.children(".StudyList-Body-Memo").addClass("StudyList-Memo-ON");

    // 状態更新
    StudyMemoControl.StudyKey = $select.data("StudyKey");

    // メモあり検査の場合
    var studyMemo = StudyMemoControl.Get(StudyMemoControl.StudyKey);
    if (studyMemo.MemoItem) {
        StudyMemoControl.Memo = studyMemo.MemoItem.Memo;
    }
    StudyMemoControl.Status = "Edit";

    // 検査メモ表示更新処理
    ViewerStudyMemo_Update($select);
}

// 検査メモ編集登録処理
function ViewerStudyMemo_Edit_Register() {
    // 入力文字数チェック
    var text = $("#StudyMemo-Text").val();
    if (text.length > 4000) {
        alert("入力文字が長すぎます。");
        return;
    }

    // 編集検査情報取得
    var $edit = $("#StudyList-Table .StudyList-Memo-ON").parent();

    // メモあり検査の場合
    var studyMemo = StudyMemoControl.Get($edit.data("StudyKey"));
    if (studyMemo.MemoItem) {
        // 変更なしの場合
        if (text == studyMemo.MemoItem.Memo) {
            // 検査メモ編集キャンセル処理
            ViewerStudyMemo_Edit_Cancel();
            return;
        }

        // メモあり検査で空の場合
        if (text == "") {
            // 検査メモ設定(削除)
            Viewer_SetStudyMemo(
                StudyMemoControl.StudyKey,
                $("#ViewerConfig").data("UserName"),
                "",
                $edit,
                ViewerStudyMemo_SetStudyMemo_Delete_Result
            );  // 取得後「検査メモ設定(削除)結果」呼び出し
            return;
        }
    }
    else {
        // メモなし検査で空の場合
        if (text == "") {
            // 検査メモ編集キャンセル処理
            ViewerStudyMemo_Edit_Cancel();
            return;
        }
    }

    // 検査メモ設定
    Viewer_SetStudyMemo(
        StudyMemoControl.StudyKey,
        $("#ViewerConfig").data("UserName"),
        $("#StudyMemo-Text").val(),
        null,
        ViewerStudyMemo_SetStudyMemo_Result
    );  // 取得後「検査メモ設定結果」呼び出し
}

// 検査メモ編集キャンセル処理
function ViewerStudyMemo_Edit_Cancel() {
    // 編集検査が無い場合終了
    if (!StudyMemoControl.StudyKey) {
        // 状態更新
        StudyMemoControl.Status = "Normal";

        // 検査メモ表示更新処理
        ViewerStudyMemo_Update($("#StudyList-Table .StudyList-Table-Row-Select"));
        return;
    }

    // 検査メモ破棄確認処理
    if (!ViewerStudyMemo_Cancel_Check()) {
        return;
    }

    // 検査情報更新
    var $edit = $("#StudyList-Table .StudyList-Memo-ON").parent();
    $edit.children(".StudyList-Body-Memo").removeClass("StudyList-Memo-ON");

    // クリア
    StudyMemoControl.Clear(false);

    // 検査メモ表示更新処理
    ViewerStudyMemo_Update($edit);
}

// 検査メモ削除処理
function ViewerStudyMemo_Delete() {
    // 確認
    if (!confirm("本当に削除しますか？")) {
        return;
    }

    // 対象検査取得
    var $select = $("#StudyList-Table .StudyList-Table-Row-Select");

    // メモあり検査で空以外の場合
    var studyMemo = StudyMemoControl.Get($select.data("StudyKey"));
    if (studyMemo.MemoItem && studyMemo.MemoItem.Memo != "") {
        // 検査メモ設定(削除)
        Viewer_SetStudyMemo(
            $select.data("StudyKey"),
            $("#ViewerConfig").data("UserName"),
            "",
            $select,
            ViewerStudyMemo_SetStudyMemo_Delete_Result
        );  // 取得後「検査メモ設定(削除)結果」呼び出し
        return;
    }
}

// 検査メモ参照戻る処理
function ViewerStudyMemo_Reference_Back() {
    // 編集検査情報取得
    var $edit = $("#StudyList-Table .StudyList-Memo-ON").parent();

    // 検査選択処理
    ViewerStudyList_Select($edit);
}

// 検査メモ参照コピー処理
function ViewerStudyMemo_Reference_Copy() {
    // 対象メモ取得
    var memo = $("#StudyMemo-Text").val();

    // 編集中のメモに追加
    StudyMemoControl.Memo += "\r\n" + memo;

    // 検査メモ参照戻る処理
    ViewerStudyMemo_Reference_Back();
}

// 検査メモ履歴処理
function ViewerStudyMemo_History() {
    // 対象検査取得
    var $select = $("#StudyList-Table .StudyList-Table-Row-Select");

    // 未選択状態の場合
    if ($("#StudyMemo-Button-3").children().hasClass("StudyMemo-Button-History-ON")) {
        // 状態更新
        StudyMemoControl.Status = "Normal";

        // 検査メモ表示更新処理
        ViewerStudyMemo_Update($select);
    }
    else {
        // 状態更新
        StudyMemoControl.Status = "History";

        // 検査メモ取得
        Viewer_GetStudyMemoHistory(
            $select.data("StudyKey"),
            $select,
            ViewerStudyMemo_GetStudyMemoHistory_Result
        );  // 取得後「検査メモ取得履歴結果」呼び出し
    }
}

// 検査メモ終了処理
function ViewerStudyMemo_End() {
    // 編集検査がある場合
    if (StudyMemoControl.StudyKey) {
        // 検査メモ破棄確認処理
        if (!ViewerStudyMemo_Cancel_Check()) {
            return false;
        }
    }

    // 検査情報更新
    var $edit = $("#StudyList-Table .StudyList-Memo-ON").parent();
    $edit.children(".StudyList-Body-Memo").removeClass("StudyList-Memo-ON");

    // クリア
    StudyMemoControl.Clear(true);
    return true;
}

// 検査メモ破棄確認処理
function ViewerStudyMemo_Cancel_Check() {
    // 編集状態の場合
    var text;
    if (StudyMemoControl.Status == "Edit") {
        text = $("#StudyMemo-Text").val();
    }
    else {
        text = StudyMemoControl.Memo;
    }
    var flag = false;

    // メモあり検査の場合
    var studyMemo = StudyMemoControl.Get(StudyMemoControl.StudyKey);
    if (studyMemo.MemoItem) {
        // 変更ありの場合
        if (text != studyMemo.MemoItem.Memo) {
            flag = true;
        }
    }
    else {
        // メモなし検査で空以外の場合
        if (text != "") {
            flag = true;
        }
    }
    if (flag) {
        if (!confirm("編集された内容があります。\r\n\r\nこのまま取消しますか？")) {
            return false;
        }
    }
    return true;
}

// 検査メモ表示変更処理
function ViewerStudyMemo_Change($this) {
    // 権限確認
    if ($("#ViewerConfig").data("StudyMemo") != "1" &&
        $("#ViewerConfig").data("StudyMemo") != "2" &&
        $("#ViewerConfig").data("StudyMemo") != "3") {
        return;
    }

    // 表示状態確認
    if (!Tool_StudyMemo.Visible || $this.length == 0) {
        return;
    }

    // 検査メモ表示アイコン変更処理
    ViewerStudyMemo_Change_Icon($this.children(".StudyList-Body-Showing"));

    // 検査情報更新
    $("#StudyMemo-StudyInfo-StudyDate").text(Common_DateFmt($this.data("StudyDate")));
    $("#StudyMemo-StudyInfo-Modality").text($this.data("Modality"));

    // 編集状態の場合
    if (StudyMemoControl.Status == "Edit") {
        // 編集中の内容を退避
        StudyMemoControl.Memo = $("#StudyMemo-Text").val();

        // 状態更新
        StudyMemoControl.Status = "Reference";
    }
    // 参照状態の場合
    else if (StudyMemoControl.Status == "Reference") {
        // 編集中検査の場合
        if ($this.children(".StudyList-Body-Memo").hasClass("StudyList-Memo-ON")) {
            // 状態更新
            StudyMemoControl.Status = "Edit";
        }
    }
    // 履歴状態の場合
    else if (StudyMemoControl.Status == "History") {
        // 状態更新
        StudyMemoControl.Status = "Normal";
    }

    // 検査メモ表示更新処理
    ViewerStudyMemo_Update($this);
}

// 検査メモ表示アイコン変更処理
function ViewerStudyMemo_Change_Icon($this) {
    // 検査情報設定
    for (var i = 0; i < ShowStudyIcon.Count; i++) {
        $("#StudyMemo-StudyInfo-Showing").removeClass("StudyList-Icon-" + i);
        if ($this.hasClass("StudyList-Icon-" + i)) {
            $("#StudyMemo-StudyInfo-Showing").addClass("StudyList-Icon-" + i);
        }
    }
}

// 検査メモ表示更新処理
function ViewerStudyMemo_Update($this) {
    // 表示初期化
    $("#StudyMemo").removeClass("StudyMemo-Status-Edit");
    $("#StudyMemo-Button-1").empty();
    $("#StudyMemo-Button-2").empty();
    $("#StudyMemo-Button-3").empty();
    $("#StudyMemo-RegUserName").text("");
    $("#StudyMemo-RegMemoDate").text("");
    $("#StudyMemo-Text").removeClass("StudyMemo-Text-Edit").val("").attr("readonly", "readonly");

    // 未取得の場合
    var studyMemo = StudyMemoControl.Get($this.data("StudyKey"));
    if (!studyMemo) {
        // 検査メモ取得
        Viewer_GetStudyMemo(
            $this.data("StudyKey"),
            $this,
            ViewerStudyMemo_GetStudyMemo_Result
        );  // 取得後「検査メモ取得結果」呼び出し
        return;
    }

    // 表示状態の場合
    if (StudyMemoControl.Status == "Normal") {
        // 編集権限がある場合
        if ($("#ViewerConfig").data("StudyMemo") == "2" ||
            $("#ViewerConfig").data("StudyMemo") == "3") {
            $("#StudyMemo-Button-1").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-Edit-OFF"));

            // メモあり検査で空以外の場合
            if (studyMemo.MemoItem && studyMemo.MemoItem.Memo != "") {
                $("#StudyMemo-Button-2").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-Delete-OFF"));
            }
        }

        // 履歴あり検査の場合
        if (studyMemo.Count > 1 && $("#ViewerConfig").data("StudyMemo") == "3") {
            $("#StudyMemo-Button-3").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-History-OFF"));
        }

        // メモあり検査の場合
        if (studyMemo.MemoItem) {
            $("#StudyMemo-RegUserName").text(studyMemo.MemoItem.UserName);
            $("#StudyMemo-RegMemoDate").text(studyMemo.MemoItem.MemoDate);
            $("#StudyMemo-Text").val(studyMemo.MemoItem.Memo);
        }
    }
    // 編集状態の場合
    else if (StudyMemoControl.Status == "Edit") {
        // パネル更新
        $("#StudyMemo").addClass("StudyMemo-Status-Edit");
        $("#StudyMemo-Button-1").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-Register-OFF"));
        $("#StudyMemo-Button-2").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-Cancel-OFF"));
        $("#StudyMemo-Text").addClass("StudyMemo-Text-Edit").val(StudyMemoControl.Memo).attr("readonly", null);
    }
    // 参照状態の場合
    else if (StudyMemoControl.Status == "Reference") {
        // パネル更新
        $("#StudyMemo-Button-1").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-Back-OFF"));

        // メモあり検査の場合
        if (studyMemo.MemoItem) {
            $("#StudyMemo-Button-2").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-Copy-OFF"));
            $("#StudyMemo-RegUserName").text(studyMemo.MemoItem.UserName);
            $("#StudyMemo-RegMemoDate").text(studyMemo.MemoItem.MemoDate);
            $("#StudyMemo-Text").val(studyMemo.MemoItem.Memo);
        }
    }
    // 履歴状態の場合
    else if (StudyMemoControl.Status == "History") {
        // 編集権限がある場合
        if ($("#ViewerConfig").data("StudyMemo") == "2" ||
            $("#ViewerConfig").data("StudyMemo") == "3") {
            $("#StudyMemo-Button-1").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-Edit-OFF"));

            // メモあり検査で空以外の場合
            if (studyMemo.MemoItem && studyMemo.MemoItem.Memo != "") {
                $("#StudyMemo-Button-2").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-Delete-OFF"));
            }
        }

        // 履歴あり検査の場合
        if (studyMemo.Count > 1 && $("#ViewerConfig").data("StudyMemo") == "3") {
            $("#StudyMemo-Button-3").append($("<div>").addClass("StudyMemo-Button-Common StudyMemo-Button-History-OFF StudyMemo-Button-History-ON"));
        }

        // パネル更新
        $("#StudyMemo-RegUserName").text(StudyMemoControl.HisUserName);
        $("#StudyMemo-RegMemoDate").text(StudyMemoControl.HisMemoDate);
        $("#StudyMemo-Text").val(StudyMemoControl.History);
    }
}

// 検査メモ取得結果
function ViewerStudyMemo_GetStudyMemo_Result(result, $this) {
    // 検査メモ数確認
    if (result.d.Items.length > 0) {
        // 検査メモ設定
        StudyMemoControl.Set($this.data("StudyKey"), result.d.Count, result.d.Items[0]);

        // 検査情報更新
        $this.data("MemoUmu", 1);
        $this.children(".StudyList-Body-Memo").addClass("StudyList-Memo-OFF").removeClass("StudyList-Memo-ON");
    }
    else {
        // 検査メモ設定
        StudyMemoControl.Set($this.data("StudyKey"), result.d.Count, null);

        // 検査情報更新
        $this.data("MemoUmu", 0);
        $this.children(".StudyList-Body-Memo").removeClass("StudyList-Memo-OFF StudyList-Memo-ON");
    }

    // 検査メモ表示更新処理
    ViewerStudyMemo_Update($this);
}

// 検査メモ取得履歴結果
function ViewerStudyMemo_GetStudyMemoHistory_Result(result, $this) {
    // 履歴追加
    if (result.d.Items.length > 0) {
        var text = result.d.Items[0].Memo;
        for (var i = 1; i < result.d.Items.length; i++) {
            text += "\r\n\r\n--------------------\r\n"
                + "(" + (result.d.Items.length - i) + ") "
                + result.d.Items[i].UserName + "\r\n"
                + result.d.Items[i].MemoDate + "\r\n\r\n"
                + result.d.Items[i].Memo;
        }
        StudyMemoControl.HisUserName = result.d.Items[0].UserName;
        StudyMemoControl.HisMemoDate = result.d.Items[0].MemoDate;
        StudyMemoControl.History = text;

        // 検査メモ表示更新処理
        ViewerStudyMemo_Update($this);
    }
}

// 検査メモ設定結果
function ViewerStudyMemo_SetStudyMemo_Result(result) {
    // 対象検査取得
    var $edit = $("#StudyList-Table .StudyList-Memo-ON").parent();

    // 検査情報更新
    $edit.data("MemoUmu", 1);
    $edit.children(".StudyList-Body-Memo").addClass("StudyList-Memo-OFF").removeClass("StudyList-Memo-ON");

    // クリア
    StudyMemoControl.Clear(true);

    // 検査メモ表示更新処理
    ViewerStudyMemo_Update($edit);
}

// 検査メモ設定(削除)結果
function ViewerStudyMemo_SetStudyMemo_Delete_Result(result, $this) {
    // 検査情報更新
    $this.data("MemoUmu", 0);
    $this.children(".StudyList-Body-Memo").removeClass("StudyList-Memo-OFF StudyList-Memo-ON");

    // クリア
    StudyMemoControl.Clear(true);

    // 検査メモ表示更新処理
    ViewerStudyMemo_Update($this);
}

// 検査メモ領域リサイズ処理
function ViewerStudyMemo_Resize_Proc() {
    var $studyMemo = $("#StudyMemo");
    if ($studyMemo.length == 0) {
        return;
    }
    var row = parseInt($("#StudyMemo-Text").attr("rows"))
    var $sHeight = $("#StudyMemo-Margin").height();
    var $vHeight = $("#ViewerCenter").height();
    var offset = 0;

    // 縮小補正
    if ($vHeight <= $sHeight) {
        offset = Math.floor(($sHeight - $vHeight) / 16);
        row -= offset;
        if (row < 5) {
            row = 5;
        }
    }
    // 拡大補正
    else {
        offset = Math.ceil(($vHeight - $sHeight) / 16);
        row += offset;
    }
    $("#StudyMemo-Text").attr("rows", row);
}
