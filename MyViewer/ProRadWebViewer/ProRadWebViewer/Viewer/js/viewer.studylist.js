/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
// 表示検査アイコン用クラス
function ShowStudyIconItem(index, studyKey) {
    this.ClassName = "StudyList-Icon-" + index;
    this.Index = index;
    this.StudyKey = studyKey;
    this.Count = 0;
}

// 表示検査アイコン管理用
var ShowStudyIcon = {
    Start: 0,
    Count: 8,
    // 初期化
    Init: function () {
        this.Items = new Array();
        for (var i = 0; i < this.Count; i++) {
            this.Items.push(new ShowStudyIconItem(i, null));
        }
        this.PreStudyKey = new Array();
        this.PreIndex = new Array();
    },
    // 確認
    Check: function (studyKey) {
        for (var i = 0; i < this.Count; i++) {
            if (this.Items[i].StudyKey == studyKey) {
                this.Items[i].Count--;
                if (this.Items[i].Count == 0) {
                    this.PreStudyKey.push(this.Items[i].StudyKey);
                    this.PreIndex.push(this.Items[i].Index);
                    this.Items[i].StudyKey = null;
                }
                return;
            }
        }
    },
    // クリア
    Clear: function () {
        for (var i = 0; i < this.Count; i++) {
            if (this.Items[i].StudyKey != null) {
                this.PreStudyKey.push(this.Items[i].StudyKey);
                this.PreIndex.push(this.Items[i].Index);
            }
            this.Items[i].StudyKey = null;
            this.Items[i].Count = 0;
        }
    },
    // 取得(StudyKey)
    GetStudyKey: function (studyKey) {
        var nullIndex = -1;
        var i = this.Start;
        var flag = true;
        for (var pre = 0; pre < this.PreStudyKey.length; pre++) {
            if (this.PreStudyKey[pre] == studyKey) {
                i = this.PreIndex[pre];
                flag = false;
                break;
            }
        }
        this.PreStudyKey = new Array();
        this.PreIndex = new Array();
        while (true) {
            if (nullIndex == -1 && this.Items[i].StudyKey == null) {
                nullIndex = i;
                continue;
            }
            if (this.Items[i].StudyKey == studyKey) {
                this.Items[i].Count++;
                return this.Items[i];
            }
            i++;
            if (i == this.Count) {
                i = 0;
            }
            if (i == this.Start) {
                break;
            }
        }
        if (nullIndex != -1) {
            this.Items[nullIndex].StudyKey = studyKey;
            this.Items[nullIndex].Count++;
            if (flag) {
                this.Start = nullIndex + 1;
                if (this.Start == this.Count) {
                    this.Start = 0;
                }
            }
            return this.Items[nullIndex];
        }
        return null;
    }
};

// 検査一覧アイテム管理用
var StudyRowItem = {
    // 初期化
    Init: function () {
        this.$Template = $("<tr>")
            .append($("<td>").addClass("StudyList-Item StudyList-Body-Left").append($("<span>")))
            .append($("<td>").addClass("StudyList-Item StudyList-Body-Left-Margin").append($("<span>")));
        $.each($("#ViewerConfig").data("ViewerStudyColumn").split(","), function () {
            if (this == "Showing") {
                StudyRowItem.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Showing").append($("<span>")));
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
        });
        this.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Right-Margin").append($("<span>")));
        this.$Template.append($("<td>").addClass("StudyList-Item StudyList-Body-Margin").append($("<span>")));
    },
    // 取得
    Get: function (tag) {
        var row = this.$Template.clone().data("StudyKey", tag.StudyKey).data("MemoUmu", tag.MemoUmu).data("StudyPasswordUmu", tag.StudyPasswordUmu).data("PatientID", tag.PatientID).data("StudyDate", tag.StudyDate).data("Modality", tag.Modality).data("AccessionNumber", tag.AccessionNumber);
        row.find(".StudyList-Body-StudyDate").data("Sort", Common_DateFmt(tag.StudyDate) + " " + Common_TimeFmt(tag.StudyTime));
        row.find(".StudyList-Body-StudyDate span").text(Common_DateFmt(tag.StudyDate));
        row.find(".StudyList-Body-StudyTime span").text(Common_TimeFmt(tag.StudyTime));
        row.find(".StudyList-Body-StudyDateTime span").text(Common_DateFmt(tag.StudyDate) + " " + Common_TimeFmt(tag.StudyTime));
        row.find(".StudyList-Body-Modality span").text(tag.Modality);
        row.find(".StudyList-Body-BodyPartExamined span").text(tag.BodyPartExamined);
        row.find(".StudyList-Body-NumberOfImages span").text(tag.NumberOfImages);
        row.find(".StudyList-Body-AccessionNumber span").text(tag.AccessionNumber);
        row.find(".StudyList-Body-StudyDescription span").text(tag.StudyDescription);
        row.find(".StudyList-Body-UploadDate").data("Sort", tag.UploadDate + " " + tag.UploadTime);
        row.find(".StudyList-Body-UploadDate span").text(tag.UploadDate);
        row.find(".StudyList-Body-UploadDateTime span").text(tag.UploadDate + " " + tag.UploadTime);
        row.find(".StudyList-Body-Memo").data("Sort", 0);
        if (tag.MemoUmu == 1) {
            row.find(".StudyList-Body-Memo").data("Sort", 1).addClass("StudyList-Memo-OFF");
        }
        row.find(".StudyList-Body-Keyword span").text(tag.Keyword);
        row.find(".StudyList-Body-Comment span").text(tag.Comment);
        row.find(".StudyList-Body-StudyPassword").data("Sort", 0);
        if (tag.StudyPasswordUmu == 1) {
            row.find(".StudyList-Body-StudyPassword").data("Sort", 1).addClass("StudyList-StudyPassword-Lock");
        }
        return row;
    }
};

// 初期化処理
function ViewerStudyList_Init() {
    // パスワードが必要な場合
    if ($("#ViewerConfig").data("isStudyPassword") == "1") {
        // 検査パスワード用レイヤー作成
        $("#CommonLayer").append($("<div>").attr("id", "StudyList-Layer-StudyPassword")
            .append($("<div>").attr("id", "StudyList-Layer-StudyPassword-Head")
                .append($("<div>").attr("id", "StudyList-Layer-StudyPassword-Head-Title").text("パスワード")))
            .append($("<div>").attr("id", "StudyList-Layer-StudyPassword-Body")
                .append($("<div>")
                    .append($("<input>").attr("type", "password").attr("id", "StudyList-Layer-StudyPassword-Body-Input"))))
            .append($("<div>").attr("id", "StudyList-Layer-StudyPassword-Foot")
                .append($("<div>").attr("id", "StudyList-Layer-StudyPassword-Foot-OK")
                    .append($("<input>").attr("type", "button").attr("value", "OK")))
                .append($("<div>").attr("id", "StudyList-Layer-StudyPassword-Foot-Cancel")
                    .append($("<input>").attr("type", "button").attr("value", "キャンセル")))));
    }

    // ヘッダイベント設定
    $("#StudyList-View").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
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
                    ViewerStudyList_Resize($this, offsetX);

                    // 位置情報更新
                    pointInfo.Update(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);
                    return;
                }

                // クリック時
                if (e.type == "touchend" && !pointInfo.IsDrag) {
                    // 検査一覧ソート
                    ViewerStudyList_Sort($this);
                }

                // タッチイベント解除
                $this.off("touchmove touchend touchcancel", event);
            }
            $this.on("touchmove touchend touchcancel", event);
        },
        // マウスダウンイベント設定
        "mousedown": function (e) {
            var $this = $(this);

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
                    ViewerStudyList_Resize($this, offsetX);

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
                    ViewerStudyList_Sort($this);
                }

                // マウスイベント解除
                $(document).off("mousemove mouseup mouseout", event);
            }
            $(document).on("mousemove mouseup mouseout", event);
        }
    }, ".StudyList-Head-Center");

    // 行選択、縦スクロールバー制御イベント設定
    $("#StudyList-Table").on({
        // タッチ開始イベント設定
        "touchstart": function (e) {
            var $this = $(this);

            // タッチ数が1以外の場合キャンセル
            if (e.originalEvent.touches.length != 1) {
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
                        ViewerStudyList_Select($this);

                        // ダブルクリック時間登録
                        $this.data("dblClick", now + 300);
                    }
                    // ダブルクリック判定
                    else {
                        // 検査入れ替え表示
                        ViewerStudyList_ShowAllSeries($this);

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
                        ViewerStudyList_Select($this);

                        // ダブルクリック時間登録
                        $this.data("dblClick", now + 300);
                    }
                    // ダブルクリック判定
                    else {
                        // 検査入れ替え表示
                        ViewerStudyList_ShowAllSeries($this);

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
                // 検査入れ替え表示
                ViewerStudyList_ShowAllSeries($this);

                // ダブルクリック時間削除
                $this.removeData("dblClick");
            }
        }
    }, "tbody tr");
    
    // 検査パスワードキーイベント設定
    $("#StudyList-Layer-StudyPassword-Body-Input").on("keydown", function (e) {
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

                // 検査パスワード入力設定処理
                ViewerStudyList_InputStudyPassword_OK();
            }, 100);

            // キーイベント解除
            $this.off("keyup");
        });
    });

    // 検査パスワード設定ボタンクリックイベント設定
    $("#StudyList-Layer-StudyPassword-Foot-OK input").on({
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
                    // 検査パスワード入力設定処理
                    ViewerStudyList_InputStudyPassword_OK();
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
                    // 検査パスワード入力設定処理
                    ViewerStudyList_InputStudyPassword_OK();
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

                    // 検査パスワード入力設定処理
                    ViewerStudyList_InputStudyPassword_OK();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // 検査パスワードキャンセルクリックイベント設定
    $("#StudyList-Layer-StudyPassword-Foot-Cancel input").on({
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
                    // 検査パスワード入力キャンセル処理
                    ViewerStudyList_InputStudyPassword_Cancel();
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
                    // 検査パスワード入力キャンセル処理
                    ViewerStudyList_InputStudyPassword_Cancel();
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

                    // 検査パスワード入力キャンセル処理
                    ViewerStudyList_InputStudyPassword_Cancel();
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        }
    });

    // 表示検査アイコン初期化
    ShowStudyIcon.Init();

    // 検査一覧アイテム初期化
    StudyRowItem.Init();

    // 検査一覧リサイズ用最小値設定(IE6用)
    if (isNaN(parseInt($("th.StudyList-Body-StudyDate").css("minWidth"))) &&
        isNaN(parseInt($("th.StudyList-Body-StudyDateTime").css("minWidth")))) {
        $("th.StudyList-Body-StudyDate").css("minWidth", "90px");
        $("th.StudyList-Body-StudyTime").css("minWidth", "90px");
        $("th.StudyList-Body-StudyDateTime").css("minWidth", "90px");
        $("th.StudyList-Body-Modality").css("minWidth", "40px");
        $("th.StudyList-Body-BodyPartExamined").css("minWidth", "55px");
        $("th.StudyList-Body-NumberOfImages").css("minWidth", "60px");
        $("th.StudyList-Body-AccessionNumber").css("minWidth", "70px");
        $("th.StudyList-Body-StudyDescription").css("minWidth", "70px");
        $("th.StudyList-Body-UploadDate").css("minWidth", "90px");
        $("th.StudyList-Body-UploadDateTime").css("minWidth", "90px");
        $("th.StudyList-Body-Keyword").css("minWidth", "55px");
        $("th.StudyList-Body-Comment").css("minWidth", "55px");
    }

    // 初期検査一覧幅設定
    var columnWidth = Common_ParseUrlParams($("#ViewerConfig").data("ViewerStudyColumnWidth"), false);
    var key, offset;
    for (key in columnWidth) {
        offset = parseInt(columnWidth[key]);
        if (!isNaN(offset)) {
            // 検査一覧リサイズ処理
            ViewerStudyList_Resize($("#StudyList-View thead .StudyList-Body-" + key), offset);
        }
    }

    // 検査一覧リサイズ処理にてレイアウトを初期化する
    ViewerStudyList_Resize($("#StudyList-View .StudyList-Head-Center"), 1);
    ViewerStudyList_Resize($("#StudyList-View .StudyList-Head-Center"), -1);

    // セパレータ初期幅の調整
    var resizeWidth = $("#StudyList-View").width();
    var windowWidth = $(window).width();
    var thumbnailWidth = 130;   // サムネイル + マージン
    var scrollMargin = 26;
    if (resizeWidth > windowWidth - thumbnailWidth - scrollMargin) {
        // 最低保障幅を設定
        resizeWidth = windowWidth - thumbnailWidth - scrollMargin;
    }
    else if (((windowWidth - resizeWidth) % thumbnailWidth) <= scrollMargin) {
        // 最低スクロールマージン保障
        resizeWidth += scrollMargin;
    }    

    // セパレータ(横)リサイズ処理
    ViewerWindow_Separator_Side_Resize(resizeWidth);
}

// 検査一覧リサイズ処理
function ViewerStudyList_Resize($this, offset) {
    // リサイズ対象確認
    var width;
    if ($this.hasClass("StudyList-Body-StudyDate")) {
        width = $("th.StudyList-Body-StudyDate").width();
        if (parseInt($("th.StudyList-Body-StudyDate").css("minWidth")) < width + offset) {
            $(".StudyList-Body-StudyDate").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-StudyTime")) {
        width = $("th.StudyList-Body-StudyTime").width();
        if (parseInt($("th.StudyList-Body-StudyTime").css("minWidth")) < width + offset) {
            $(".StudyList-Body-StudyTime").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-StudyDateTime")) {
        width = $("th.StudyList-Body-StudyDateTime").width();
        if (parseInt($("th.StudyList-Body-StudyDateTime").css("minWidth")) < width + offset) {
            $(".StudyList-Body-StudyDateTime").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-Modality")) {
        width = $("th.StudyList-Body-Modality").width();
        if (parseInt($("th.StudyList-Body-Modality").css("minWidth")) < width + offset) {
            $(".StudyList-Body-Modality").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-BodyPartExamined")) {
        width = $("th.StudyList-Body-BodyPartExamined").width();
        if (parseInt($("th.StudyList-Body-BodyPartExamined").css("minWidth")) < width + offset) {
            $(".StudyList-Body-BodyPartExamined").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-NumberOfImages")) {
        width = $("th.StudyList-Body-NumberOfImages").width();
        if (parseInt($("th.StudyList-Body-NumberOfImages").css("minWidth")) < width + offset) {
            $(".StudyList-Body-NumberOfImages").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-AccessionNumber")) {
        width = $("th.StudyList-Body-AccessionNumber").width();
        if (parseInt($("th.StudyList-Body-AccessionNumber").css("minWidth")) < width + offset) {
            $(".StudyList-Body-AccessionNumber").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-StudyDescription")) {
        width = $("th.StudyList-Body-StudyDescription").width();
        if (parseInt($("th.StudyList-Body-StudyDescription").css("minWidth")) < width + offset) {
            $(".StudyList-Body-StudyDescription").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-UploadDate")) {
        width = $("th.StudyList-Body-UploadDate").width();
        if (parseInt($("th.StudyList-Body-UploadDate").css("minWidth")) < width + offset) {
            $(".StudyList-Body-UploadDate").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-UploadDateTime")) {
        width = $("th.StudyList-Body-UploadDateTime").width();
        if (parseInt($("th.StudyList-Body-UploadDateTime").css("minWidth")) < width + offset) {
            $(".StudyList-Body-UploadDateTime").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-Keyword")) {
        width = $("th.StudyList-Body-Keyword").width();
        if (parseInt($("th.StudyList-Body-Keyword").css("minWidth")) < width + offset) {
            $(".StudyList-Body-Keyword").width(width + offset);
        }
    }
    if ($this.hasClass("StudyList-Body-Comment")) {
        width = $("th.StudyList-Body-Comment").width();
        if (parseInt($("th.StudyList-Body-Comment").css("minWidth")) < width + offset) {
            $(".StudyList-Body-Comment").width(width + offset);
        }
    }
}

// 検査一覧ソート
function ViewerStudyList_Sort($this) {
    // ソート対象の場合
    if ($this.hasClass("StudyList-Body-StudyDate") ||
        $this.hasClass("StudyList-Body-StudyTime") ||
        $this.hasClass("StudyList-Body-StudyDateTime") ||
        $this.hasClass("StudyList-Body-Modality") ||
        $this.hasClass("StudyList-Body-BodyPartExamined") ||
        $this.hasClass("StudyList-Body-NumberOfImages") ||
        $this.hasClass("StudyList-Body-AccessionNumber") ||
        $this.hasClass("StudyList-Body-StudyDescription") ||
        $this.hasClass("StudyList-Body-UploadDate") ||
        $this.hasClass("StudyList-Body-UploadDateTime") ||
        $this.hasClass("StudyList-Body-Memo") ||
        $this.hasClass("StudyList-Body-Keyword") ||
        $this.hasClass("StudyList-Body-Comment") ||
        $this.hasClass("StudyList-Body-StudyPassword")) {
        // ソート方向取得
        var dir = "d";
        var $child = $this.children();
        if ($child.text() == "▼") {
            // 昇順指定
            dir = "a";
        }

        // 画像数ならばソート方式を数値に変更
        var type = "s";
        if ($this.hasClass("StudyList-Body-NumberOfImages")) {
            type = "n";
        }

        // 検査日付、登録日付、メモ、検査パスワードの場合ソート方式をデータキャッシュに変更
        if ($this.hasClass("StudyList-Body-StudyDate") ||
            $this.hasClass("StudyList-Body-UploadDate") ||
            $this.hasClass("StudyList-Body-Memo") ||
            $this.hasClass("StudyList-Body-StudyPassword")) {
            type = "d";
        }

        // ソート方向表示クリア
        $("#StudyList-View .StudyList-Head-Center span").each(function () {
            $(this).text("");
        });

        // ソート方向設定
        if (dir == "d") {
            $child.text("▼");
        }
        else {
            $child.text("▲");
        }

        // ソート処理
        Common_TableSort("#StudyList-Table-View", $this.index(), type, dir);
    }
}

// 過去検査一覧取得結果
function ViewerStudyList_GetPastStudyList_Result(result) {
    // 要素を作成
    $.each(result.d.Tags, function () {
        $("#StudyList-Table tbody").append(StudyRowItem.Get(this));
    });

    // 検査一覧リサイズ処理
    ViewerStudyList_Resize($("#StudyList-View .StudyList-Head-Center"), 0);   // 全体更新

    // 同一検査日確認
    var modality = $("#ViewerConfig").data("findmodality");
    var date = $("#ViewerConfig").data("finddate");
    var accessionno = $("#ViewerConfig").data("findaccessionno");
    if (modality != "" || date != "" || accessionno != "") {
        var $tr = $("#StudyList-Table tr");
        var splitMod = null;
        var i = 0;
        $tr.each(function () {
            if ((modality == "" || $(this).data("Modality") == modality) &&
                (date == "" || $(this).data("StudyDate") == date) &&
                (accessionno == "" || $(this).data("AccessionNumber") == accessionno)) {
                if (splitMod == null) {
                    splitMod = $(this).data("Modality");
                }
                i++;
            }
            else {
                $(this).hide();
            }
        });
        if (i < 2) {
            $tr.show();
        }
        else {
            // モダリティ毎のシリーズ分割取得
            var sSplit = Viewer_GetModalityConfigVal(splitMod, "SeriesSplit").split(",");
            if (sSplit.length >= 2 && !isNaN(parseInt(sSplit[0])) && !isNaN(parseInt(sSplit[1]))) {
                // シリーズ分割設定
                viewer.split(parseInt(sSplit[1]), parseInt(sSplit[0]));
            }

            // パラメータクリア
            $("#SeriesList").data("studykey", "");
            $("#SeriesList").data("serieskey", "");

            // 遅延処理を行う
            setTimeout(function () {
                alert("該当検査が複数あります。\r\n一覧から選択し表示してください。");
            }, 100);
            return;
        }
    }

    // 検査選択処理(studykey)
    ViewerStudyList_Select_Key($("#ViewerConfig").data("studykey"));
}

// 検査選択処理
function ViewerStudyList_Select($this) {
    // スクロール位置更新
    var top = $this.position().top - $("#StudyList-View thead").height();
    var pre = $("#StudyList-Table").scrollTop();
    var tr = $("#StudyList-Table-View tr").height();
    var table = $("#StudyList-Table").height();
    if (top < 0) {
        $("#StudyList-Table").scrollTop(pre + top);
    }
    else if (top + tr > table) {
        $("#StudyList-Table").scrollTop(pre + top + tr - table);
    }

    // 選択状態の場合は無効
    if ($this.is(".StudyList-Table-Row-Select")) {
        return;
    }

    // Ajax用送信キーを更新し通信中をキャンセルする
    Viewer_GetAjaxKey();

    // シリーズ一覧取得済確認
    if (ViewerSeriesList_Check($this) == null) {
        // パスワードが必要かつ検査パスワードが設定されていた場合
        if ($("#ViewerConfig").data("isStudyPassword") == "1" && $this.data("StudyPasswordUmu")) {
            // 検査パスワード入力処理
            ViewerStudyList_InputStudyPassword($this);
            return;
        }
    }

    // 検査選択解除
    ViewerStudyList_Select_Remove();

    // 選択状態に設定
    $this.addClass("StudyList-Table-Row-Select");

    // シリーズ一覧変更
    ViewerSeriesList_Change($this, "");

    // 検査メモ表示変更処理
    ViewerStudyMemo_Change($this);
}

// 検査選択処理(studyKey)
function ViewerStudyList_Select_Key(studyKey) {
    // 選択検査確認
    $("#StudyList-Table tr").each(function () {
        if ($(this).data("StudyKey") == studyKey) {
            // 検査選択処理
            ViewerStudyList_Select($(this));
            return false;
        }
    });
}

// 検査選択解除処理
function ViewerStudyList_Select_Remove() {
    // 選択状態全クリア
    $("#StudyList-Table tr").each(function () {
        $(this).removeClass("StudyList-Table-Row-Select");
    });
}

// 検査情報取得処理
function ViewerStudyList_GetStudyInfo(studyKey, tagName) {
    // 選択検査確認
    var ret;
    $("#StudyList-Table tr").each(function () {
        if ($(this).data("StudyKey") == studyKey) {
            ret = $(this).data(tagName);
            return false;
        }
    });
    if (!ret) {
        ret = "";
    }
    return ret;
}

// 検査パスワード入力処理
function ViewerStudyList_InputStudyPassword($this) {
    // 表示初期化
    $("#StudyList-Layer-StudyPassword-Body-Input").val("");
    $("#CommonLayer").show();
    $("#StudyList-Layer-StudyPassword").data("this", $this).show();

    // 遅延処理を行う
    setTimeout(function () {
        $("#StudyList-Layer-StudyPassword-Body-Input").focus().select();
    }, 100);
}

// 検査パスワード入力設定処理
function ViewerStudyList_InputStudyPassword_OK() {
    // 検査選択解除
    ViewerStudyList_Select_Remove();

    var $this = $("#StudyList-Layer-StudyPassword").data("this");

    // 選択状態に設定
    $this.addClass("StudyList-Table-Row-Select");

    // シリーズ一覧変更
    ViewerSeriesList_Change($this, $("#StudyList-Layer-StudyPassword-Body-Input").val());

    // 検査メモ表示変更処理
    ViewerStudyMemo_Change($this);

    // 検査パスワード入力キャンセル処理
    ViewerStudyList_InputStudyPassword_Cancel();
}

// 検査パスワード入力キャンセル処理
function ViewerStudyList_InputStudyPassword_Cancel() {
    // 入力中をキャンセルするためフォーカスを外す
    $(":input").blur();

    // 非表示
    $("#StudyList-Layer-StudyPassword").hide();
    $("#CommonLayer").hide();
}

// 検査入れ替え表示
function ViewerStudyList_ShowAllSeries($this) {
    // 未選択状態の場合は無効
    if (!$this.is(".StudyList-Table-Row-Select")) {
        return;
    }

    // シリーズ一覧取得済確認
    if (ViewerSeriesList_Check($this) == null) {
        return;
    }

    // 表示中シリーズ入れ替え表示
    ViewerSeriesList_ShowAllSeries_Visible();
}

// 表示検査パネル追加
function ViewerStudyList_Panel_Add(series) {
    // 表示検査パネルの初期化
    $(series.Element).find(".SeriesWorkPanel .StudyList-Panel").remove();

    // データチェック
    if (series == null || series.seriesData == null) {
        return;
    }

    // 表示検査アイコン取得
    var item = ShowStudyIcon.GetStudyKey(series.seriesData.ExData.StudyKey);

    // 表示検査パネルを追加
    $(series.Element).find(".SeriesWorkPanel .SeriesSyncPanel").before($("<div>").addClass("StudyList-Panel").addClass(item.ClassName));

    // 表示検査パネル更新
    ViewerStudyList_Panel_Update();
}

// 表示検査パネル更新
function ViewerStudyList_Panel_Update() {
    // 表示上の全パネルのStudyKeyとアイコンを取得
    var studyKeys = new Array();
    var Icons = new Array();
    var i, j, series, $childPanel, flag, studykey;
    for (i = 0; i < viewer.SeriesPanels.length; i++) {
        series = viewer.getSeriesPanelFromIndex(i);
        if (series == null || series.seriesData == null) {
            continue;
        }

        // StudyKeyは重複しないようにする
        flag = true;
        $.each(studyKeys, function () {
            if (this == series.seriesData.ExData.StudyKey) {
                flag = false;
                return false;
            }
        });
        if (flag) {
            // StudyKeyとアイコンを取得
            studyKeys.push(series.seriesData.ExData.StudyKey);
            $childPanel = $(series.Element).find(".SeriesWorkPanel .StudyList-Panel");
            for (j = 0; j < ShowStudyIcon.Count; j++) {
                if ($childPanel.hasClass("StudyList-Icon-" + j)) {
                    Icons.push("StudyList-Icon-" + j);
                    break;
                }
            }
        }
    }

    // 検査一覧のアイコンを全更新
    $("#StudyList-Table tr").each(function () {
        studykey = $(this).data("StudyKey");
        flag = false;
        for (i = 0; i < studyKeys.length; i++) {
            if (studyKeys[i] == studykey) {
                flag = true;
                break;
            }
        }
        $childStudy = $(this).children(".StudyList-Body-Showing");
        for (j = 0; j < ShowStudyIcon.Count; j++) {
            $childStudy.removeClass("StudyList-Icon-" + j);
        }
        if (flag) {
            $childStudy.addClass(Icons[i]);
        }
    });

    // 検査メモ表示アイコン変更処理
    ViewerStudyMemo_Change_Icon($("#StudyList-Table .StudyList-Table-Row-Select .StudyList-Body-Showing"));
}