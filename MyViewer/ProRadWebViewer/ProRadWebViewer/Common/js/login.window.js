/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var InputTimeout = null;
var $LoginID;
var $Password;
var $LoginButton;

// 起動処理
$(window).load(function () {
    // 画像読み込み処理
    LoginWindow_LoadImages();

    // サイズが0の場合があるのでタイマでチェックする
    var timerID = setInterval(function () {
        // サイズチェック
        if ($(window).width() == 0 || $(window).height() == 0) {
            return;
        }

        // タイマ終了
        clearInterval(timerID);

        // 初期化処理
        LoginWindow_Init();
    }, 100);
});

// 初期化処理
function LoginWindow_Init() {
    // オブジェクトキャッシュ
    $LoginID = $("#LoginID input");
    $Password = $("#Password input");
    $LoginButton = $("#LoginButton");

    // 初期化完了のため表示
    $("body").css("visibility", "visible");

    // 初期フォーカス設定
    $("body").focus();

    // ログインIDモード設定と判定
    $("#LoginInput").data("LoginMode", $("#LoginMode").val());
    if ($("#LoginMode").val() == "1") {
        // 前回ログインID
        // Cookie取得
        var lastLoginID = Common_GetCookie("LastLoginID");
        if (lastLoginID != "") {
            // デスクトップの場合
            if (Common_IsDesktop()) {
                // 初期フォーカス設定
                $Password.focus();
            }

            // LoginID設定
            $LoginID.val(lastLoginID);
        }
        else {
            // デスクトップの場合
            if (Common_IsDesktop()) {
                // 初期フォーカス設定
                $LoginID.focus();
            }
        }
    }
    else if ($("#LoginMode").val() == "2") {
        // デフォルト設定
        // デスクトップの場合
        if (Common_IsDesktop()) {
            // 初期フォーカス設定
            $LoginID.focus();
        }

        // デフォルト取得
        $LoginID.val($("#DefaultID").val());
        $Password.val($("#DefaultPass").val());
    }
    else {
        // なし
        // デスクトップの場合
        if (Common_IsDesktop()) {
            // 初期フォーカス設定
            $LoginID.focus();
        }
    }

    // ログインボタンチェック処理
    LoginWindow_Button_Check();

    // 情報削除
    $("#Hidden").remove();

    // 全画面設定
    $("body").height(window.innerHeight ? window.innerHeight : $(window).height());

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
            $(this).focus();
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
    }, "input");

    // イベント設定
    $(window).on({
        // フォーカス処理設定
        "focus": function () {
            // iOS8でタブにより画面レイアウトが崩れるため暫定追加
            setTimeout(function () {
                $("body").height($(window).height());
                setTimeout(function () {
                    $("body").height(window.innerHeight);
                }, 100);
            }, 100);
        },
        // 全体のリサイズ処理設定
        "resize": function () {
            // iOS8でタブにより画面レイアウトが崩れるため暫定追加
            setTimeout(function () {
                $("body").height($(window).height());
                setTimeout(function () {
                    $("body").height(window.innerHeight);
                }, 100);
            }, 100);
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
        }
    });

    // フォーカスイベント設定
    $("#LoginID input, #Password input").on({
        "focus": function () {
            // ログインボタンチェック処理
            LoginWindow_Button_Check();

            $(this).select().addClass("Input-Focus");
        },
        "blur": function () {
            $(this).removeClass("Input-Focus");
        }
    });

    // キーイベント設定
    $("#LoginID input, #Password input, a").on({
        "keydown": function (e) {
            // Enter以外の場合
            if (e.keyCode != 13) {
                return;
            }

            // 空文字チェック
            if ($LoginID.val() == "") {
                $LoginID.focus();
                return false;
            }
            if ($Password.val() == "") {
                $Password.focus();
                return false;
            }

            // ボタン選択可能以外はキャンセル
            if (!$LoginButton.hasClass("LoginButton-Active")) {
                return false;
            }

            // アイコン変更
            $LoginButton.removeClass("LoginButton-Active").addClass("LoginButton-ON");

            // デスクトップの場合
            var $this;
            if (Common_IsDesktop()) {
                // イベント対象設定
                $this = $("#LoginID input, #Password input, a");
            }
            else {
                // イベント対象設定
                $this = $(this);
            }

            // キーイベント設定
            $this.on("keyup", function (e) {
                // 遅延処理を行う
                setTimeout(function () {
                    // Enterの場合
                    if (e.keyCode == 13) {
                        // 入力中をキャンセルするためフォーカスを外す
                        $(":input").blur();

                        // クリック処理
                        LoginWindow_Button_Click();
                    }

                    // アイコン変更
                    $LoginButton.removeClass("LoginButton-ON").addClass("LoginButton-Active");
                }, 100);

                // キーイベント解除
                $this.off("keyup");
            });
        },
        "keyup": function () {
            // ログインボタンチェック処理
            LoginWindow_Button_Check();
        }
    });

    // ログインボタンイベント設定
    $LoginButton.on({
        // 開始イベント設定
        "touchstart mousedown": function (e) {
            var $this = $(this);
            var eTouch = Common_GetTouch(e);
            if (!eTouch) {
                return;
            }

            // ログインボタンチェック処理
            LoginWindow_Button_Check();

            // ボタン選択可能以外は何もしない
            if (!$LoginButton.hasClass("LoginButton-Active")) {
                return;
            }

            // アイコン変更
            $LoginButton.removeClass("LoginButton-Active").addClass("LoginButton-ON");

            // 要素位置情報用クラス生成
            var rectInfo = new Common_RectInfo($this);

            // イベント設定
            var eType = (e.type == "touchstart") ? "touchmove touchend touchcancel" : "mousemove mouseup mouseout";
            var eFunc = function (e) {
                var touch = Common_GetTouch(e, eTouch.ID);
                if (!touch) {
                    return;
                }

                // 移動時
                if (e.type == "touchmove" || e.type == "mousemove") {
                    // 要素位置情報更新後、範囲内の場合
                    if (rectInfo.Update(touch.PointX, touch.PointY)) {
                        // アイコン変更
                        $LoginButton.removeClass("LoginButton-Active").addClass("LoginButton-ON");
                    }
                    else {
                        // アイコン変更
                        $LoginButton.removeClass("LoginButton-ON").addClass("LoginButton-Active");
                    }
                    return;
                }

                // 画面内をドラッグしていれば継続
                if (e.type == "mouseout" && e.relatedTarget) {
                    return;
                }

                // クリック時
                if ((e.type == "touchend" || e.type == "mouseup") && rectInfo.IsHit) {
                    // タッチイベント二重動作防止のためタイマを使用する
                    setTimeout(function () {
                        // クリック処理
                        LoginWindow_Button_Click();

                        // アイコン変更
                        $LoginButton.removeClass("LoginButton-ON").addClass("LoginButton-Active");
                    }, 0);
                }
                else {
                    // アイコン変更
                    $LoginButton.removeClass("LoginButton-ON").addClass("LoginButton-Active");
                }

                // イベント解除
                $(document).off(eType, eFunc);
            }
            $(document).on(eType, eFunc);
        }
    });
}

// ログインボタンチェック処理
function LoginWindow_Button_Check() {
    // ボタン選択中以外
    if (!$LoginButton.hasClass("LoginButton-ON")) {
        // アイコン変更
        if ($LoginID.val() == "" || $Password.val() == "") {
            $LoginButton.removeClass("LoginButton-Active").addClass("LoginButton-OFF");
        }
        else {
            $LoginButton.removeClass("LoginButton-OFF").addClass("LoginButton-Active");
        }
    }
}

// ログインボタンクリック処理
function LoginWindow_Button_Click() {
    // ログイン
    Common_Login($LoginID.val(), $Password.val(), "Login", null, LoginWindow_Login_Result);
}

// ログイン結果
function LoginWindow_Login_Result(result) {
    // データチェック
    if (result.d == null || result.d != true) {
        alert("ユーザー名またはパスワードが違います。");
        $Password.select();
        return;
    }

    // ログインIDモードが前回ログインIDの場合
    if ($("#LoginInput").data("LoginMode") == "1") {
        // Cookie登録
        Common_SetCookie("LastLoginID", $LoginID.val(), 1);
    }

    // 起動処理
    var url = "./Search/WebSearch.aspx";
    var search = "ReturnUrl=";
    var index = location.search.indexOf(search);
    if (index != -1) {
        url = unescape(location.search.substring(index + search.length));
    }
    Common_WindowOpen(url, "", false);
}
