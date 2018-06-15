/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// キーイベント
var Tool_Key = {
    // 初期化
    Init: function () {
        // マウス補助一覧作成
        var item1 = $("#ViewerConfig").data("ViewerMouseAssist").split(",");
        if (item1.length == 3) {
            // マウス補助一覧
            var MouseAssist = new Object();
            MouseAssist.Shift = item1[0];
            MouseAssist.Ctrl = item1[1];
            MouseAssist.ShiftCtrl = item1[2];

            // イベント設定
            function Tool_Key_Assist_Event(e) {
                // 入力中を考慮
                if (!$(e.target).is("body")) {
                    return true;
                }

                // 修飾子コードを作成
                var mod = 0;
                if (e.shiftKey) {
                    mod += 1;
                }
                if (e.ctrlKey) {
                    mod += 2;
                }

                // 各種振り分け
                var ret = false;
                switch (mod) {
                    case 1: // Shift
                        ret = Tool_Key_Assist_Command(MouseAssist.Shift);
                        break;
                    case 2: // Ctrl
                        ret = Tool_Key_Assist_Command(MouseAssist.Ctrl);
                        break;
                    case 3: // Shift + Ctrl
                        ret = Tool_Key_Assist_Command(MouseAssist.ShiftCtrl);
                        break;
                }

                // メニュー上書きの解除チェック
                if (!ret) {
                    // メニュー上書き(解除)
                    Tool_Menu.Overwrite("");
                }
            }
            $("body").on("keydown keyup", Tool_Key_Assist_Event);

            // 各種呼び出し処理
            function Tool_Key_Assist_Command(command) {
                var ret = true;
                switch (command) {
                    case "1":   // メニュー上書き(拡大・縮小)
                        Tool_Menu.Overwrite("Scale");
                        break;
                    case "2":   // メニュー上書き(移動)
                        Tool_Menu.Overwrite("Move");
                        break;
                    case "3":   // メニュー上書き(ウィンドウレベル)
                        Tool_Menu.Overwrite("WindowLevel");
                        break;
                    default:
                        ret = false;
                        break;
                }
                return ret;
            }
        }

        // キー一覧作成
        var items2 = $("#ViewerConfig").data("ViewerShortcutKey").split(",");
        if (items2.length > 0 && items2.length % 2 == 0) {
            // キー一覧
            var KeyList = new Array();
            for (var i = 0; i < items2.length; i += 2) {
                var obj = new Object();
                obj.Command = items2[i];
                var opt = items2[i + 1].split("_");
                if (opt.length == 2) {
                    obj.KeyCode = opt[0];
                    obj.Modify = parseInt(opt[1]);
                }
                else {
                    obj.KeyCode = items2[i + 1];
                    obj.Modify = 0;
                }
                obj.IsPressed = false;
                if (isNaN(obj.Modify)) {
                    continue;
                }
                KeyList.push(obj);
            }

            // イベント設定
            function Tool_Key_Event(e) {
                // 入力中を考慮
                if (!$(e.target).is("body")) {
                    return true;
                }

                // 修飾子コードを作成
                var mod = 0;
                if (e.shiftKey) {
                    mod += 1;
                }
                if (e.ctrlKey) {
                    mod += 2;
                }

                // リストから呼び出す処理をチェック
                var ret = true;
                for (var i = 0; i < KeyList.length; i++) {
                    // キーコードチェック
                    var isCheck = false;
                    switch (KeyList[i].KeyCode) {
                        case "0":           // 0 or 0(テンキー)
                            isCheck = (e.which == 48 || e.which == 96) ? true : false;
                            break;
                        case "1":           // 1 or 1(テンキー)
                            isCheck = (e.which == 49 || e.which == 97) ? true : false;
                            break;
                        case "2":           // 2 or 2(テンキー)
                            isCheck = (e.which == 50 || e.which == 98) ? true : false;
                            break;
                        case "3":           // 3 or 3(テンキー)
                            isCheck = (e.which == 51 || e.which == 99) ? true : false;
                            break;
                        case "4":           // 4 or 4(テンキー)
                            isCheck = (e.which == 52 || e.which == 100) ? true : false;
                            break;
                        case "5":           // 5 or 5(テンキー)
                            isCheck = (e.which == 53 || e.which == 101) ? true : false;
                            break;
                        case "6":           // 6 or 6(テンキー)
                            isCheck = (e.which == 54 || e.which == 102) ? true : false;
                            break;
                        case "7":           // 7 or 7(テンキー)
                            isCheck = (e.which == 55 || e.which == 103) ? true : false;
                            break;
                        case "8":           // 8 or 8(テンキー)
                            isCheck = (e.which == 56 || e.which == 104) ? true : false;
                            break;
                        case "9":           // 9 or 9(テンキー)
                            isCheck = (e.which == 57 || e.which == 105) ? true : false;
                            break;
                        case "F1":          // F1
                            isCheck = (e.which == 112) ? true : false;
                            break;
                        case "F2":          // F2
                            isCheck = (e.which == 113) ? true : false;
                            break;
                        case "F3":          // F3
                            isCheck = (e.which == 114) ? true : false;
                            break;
                        case "F4":          // F4
                            isCheck = (e.which == 115) ? true : false;
                            break;
                        case "F5":          // F5
                            isCheck = (e.which == 116) ? true : false;
                            break;
                        case "F6":          // F6
                            isCheck = (e.which == 117) ? true : false;
                            break;
                        case "F7":          // F7
                            isCheck = (e.which == 118) ? true : false;
                            break;
                        case "F8":          // F8
                            isCheck = (e.which == 119) ? true : false;
                            break;
                        case "F9":          // F9
                            isCheck = (e.which == 120) ? true : false;
                            break;
                        case "F10":         // F10
                            isCheck = (e.which == 121) ? true : false;
                            break;
                        case "F11":         // F11
                            isCheck = (e.which == 122) ? true : false;
                            break;
                        case "F12":         // F12
                            isCheck = (e.which == 123) ? true : false;
                            break;
                        case "Insert":      // Insert
                            isCheck = (e.which == 45) ? true : false;
                            break;
                        case "Delete":      // Delete
                            isCheck = (e.which == 46) ? true : false;
                            break;
                        case "Home":        // Home
                            isCheck = (e.which == 36) ? true : false;
                            break;
                        case "End":         // End
                            isCheck = (e.which == 35) ? true : false;
                            break;
                        case "PageUp":      // Page Up
                            isCheck = (e.which == 33) ? true : false;
                            break;
                        case "PageDown":    // Page Down
                            isCheck = (e.which == 34) ? true : false;
                            break;
                        case "Left":        // ←
                            isCheck = (e.which == 37) ? true : false;
                            break;
                        case "Up":          // ↑
                            isCheck = (e.which == 38) ? true : false;
                            break;
                        case "Right":       // →
                            isCheck = (e.which == 39) ? true : false;
                            break;
                        case "Down":        // ↓
                            isCheck = (e.which == 40) ? true : false;
                            break;
                    }

                    // keydownは修飾子コードをチェックする
                    if (e.type == "keydown") {
                        if (KeyList[i].Modify != mod) {
                            isCheck = false;
                        }
                    }

                    // キー不一致のため次へ
                    if (!isCheck) {
                        continue;
                    }

                    // デフォルト動作停止
                    if (ret) {
                        e.preventDefault();
                        try {
                            e.originalEvent.keyCode = null;
                            e.originalEvent.returnValue = false;
                        }
                        catch (ex) {
                        }
                    }
                    ret = false;

                    // 各種呼び出し処理
                    if (e.type == "keydown") {
                        switch (KeyList[i].Command) {
                            case "100":     // アクティブシリーズ入れ替え(前)
                                if (!KeyList[i].IsPressed) {
                                    ViewerSeriesList_ChangeActiveSeries("prev");
                                }
                                break;
                            case "101":     // アクティブシリーズ入れ替え(次)
                                if (!KeyList[i].IsPressed) {
                                    ViewerSeriesList_ChangeActiveSeries("next");
                                }
                                break;
                            case "200":     // ウィンドウレベルプリセット(初期値)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(0);
                                }
                                break;
                            case "201":     // ウィンドウレベルプリセット(プリセット1)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(1);
                                }
                                break;
                            case "202":     // ウィンドウレベルプリセット(プリセット2)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(2);
                                }
                                break;
                            case "203":     // ウィンドウレベルプリセット(プリセット3)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(3);
                                }
                                break;
                            case "204":     // ウィンドウレベルプリセット(プリセット4)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(4);
                                }
                                break;
                            case "205":     // ウィンドウレベルプリセット(プリセット5)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(5);
                                }
                                break;
                            case "206":     // ウィンドウレベルプリセット(プリセット6)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(6);
                                }
                                break;
                            case "207":     // ウィンドウレベルプリセット(プリセット7)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(7);
                                }
                                break;
                            case "208":     // ウィンドウレベルプリセット(プリセット8)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(8);
                                }
                                break;
                            case "209":     // ウィンドウレベルプリセット(プリセット9)
                                if (!KeyList[i].IsPressed) {
                                    Tool_WindowLevel.Preset(9);
                                }
                                break;
                            case "300":     // 画像スキップ(画像戻し)
                                Tool_SkipImage.SubCommand("imageprev");
                                break;
                            case "301":     // 画像スキップ(画像送り)
                                Tool_SkipImage.SubCommand("imagenext");
                                break;
                            case "302":     // 画像スキップ(ページ戻し)
                                Tool_SkipImage.SubCommand("pageingprev");
                                break;
                            case "303":     // 画像スキップ(ページ送り)
                                Tool_SkipImage.SubCommand("pageingnext");
                                break;
                            case "304":     // 画像スキップ(先頭)
                                if (!KeyList[i].IsPressed) {
                                    Tool_SkipImage.SubCommand("begin");
                                }
                                break;
                            case "305":     // 画像スキップ(中央)
                                if (!KeyList[i].IsPressed) {
                                    Tool_SkipImage.SubCommand("center");
                                }
                                break;
                            case "306":     // 画像スキップ(最終)
                                if (!KeyList[i].IsPressed) {
                                    Tool_SkipImage.SubCommand("end");
                                }
                                break;
                            case "400":     // レポート画像出力
                                if (!KeyList[i].IsPressed) {
                                    if (Tool_ReportOutput.Enabled) {
                                        Tool_ReportOutput.Command(true);
                                    }
                                }
                                break;
                        }
                        KeyList[i].IsPressed = true;
                    }
                    else {
                        KeyList[i].IsPressed = false;
                    }
                }
                return ret;
            }
            $("body").on("keydown keyup", Tool_Key_Event);
        }
    }
}
