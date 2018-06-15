/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// メニュー
var Tool_Menu = {
    // 選択ツール名
    SelectName: "",
    // 上書きツール名
    OverwriteName: "",
    // 初期化
    Init: function () {
        // ツール設定
        $.each($("#ViewerConfig").data("ViewerTools").split(","), function () {
            // ウィンドウレベル
            if (this.toString() == "WindowLevel") {
                Tool_WindowLevel.Add();
                return true;
            }
            // 拡大・縮小
            if (this.toString() == "Scale") {
                Tool_Scale.Add();
                return true;
            }
            // 移動
            if (this.toString() == "Move") {
                Tool_Move.Add();
                return true;
            }
            // 距離計測
            if (this.toString() == "Distance") {
                Tool_Distance.Add();
                return true;
            }
            // CT値測定
            if (this.toString() == "CTAnalyze") {
                Tool_CTAnalyze.Add();
                return true;
            }
            // 角度計測(3点)
            if (this.toString() == "Angle3") {
                Tool_Angle3.Add();
                return true;
            }
            // 角度計測(4点)
            if (this.toString() == "Angle4") {
                Tool_Angle4.Add();
                return true;
            }
            // CTR計測
            if (this.toString() == "CTRMeasure") {
                Tool_CTRMeasure.Add();
                return true;
            }
            // 計測(距離、CT値、角度、CTR)
            if (this.toString() == "Measure") {
                Tool_Measure.Add();
                return true;
            }
            // 矢印
            if (this.toString() == "Arrow") {
                Tool_Arrow.Add();
                return true;
            }
            // 円
            if (this.toString() == "Circle") {
                Tool_Circle.Add();
                return true;
            }
            // 自由曲線
            if (this.toString() == "FreeLine") {
                Tool_FreeLine.Add();
                return true;
            }
            // テキスト
            if (this.toString() == "Text") {
                Tool_Text.Add();
                return true;
            }
            // 全リセット
            if (this.toString() == "Reset") {
                Tool_Reset.Add();
                return true;
            }
            // 分割
            if (this.toString() == "Split") {
                Tool_Split.Add();
                return true;
            }
            // カットライン
            if (this.toString() == "Cutline") {
                Tool_Cutline.Add();
                return true;
            }
            // シリーズ一括同期
            if (this.toString() == "SeriesSync") {
                Tool_SeriesSync.Add();
                return true;
            }
            // マニュアルシネ
            if (this.toString() == "ManualCine") {
                Tool_ManualCine.Add();

                // デフォルトツール設定
                Tool_Menu.Default();
                return true;
            }
            // 画像送り(前へ)
            if (this.toString() == "SkipImagePrev") {
                Tool_SkipImagePrev.Add();
                return true;
            }
            // 画像送り(次へ)
            if (this.toString() == "SkipImageNext") {
                Tool_SkipImageNext.Add();
                return true;
            }
            // 画像スキップ
            if (this.toString() == "SkipImage") {
                Tool_SkipImage.Add();
                return true;
            }
            // シリーズ送り(前へ)
            if (this.toString() == "SkipSeriesPrev") {
                Tool_SkipSeriesPrev.Add();
                return true;
            }
            // シリーズ送り(次へ)
            if (this.toString() == "SkipSeriesNext") {
                Tool_SkipSeriesNext.Add();
                return true;
            }
            // 回転
            if (this.toString() == "Rotate") {
                Tool_Rotate.Add();
                return true;
            }
            // アノテーション
            if (this.toString() == "Annotation") {
                Tool_Annotation.Add();
                return true;
            }
            // ヘルプ
            if (this.toString() == "Help") {
                Tool_Help.Add();
                return true;
            }
            // 終了
            if (this.toString() == "Exit") {
                Tool_Exit.Add();
                return true;
            }
            // ツール位置変更
            if (this.toString() == "ToolAreaChange") {
                Tool_ToolAreaChange.Add();
                return true;
            }
            // シリーズ表示変更
            if (this.toString() == "SeriesPanelChange") {
                Tool_SeriesPanelChange.Add();
                return true;
            }
            // DicomTag表示
            if (this.toString() == "DicomTag") {
                Tool_DicomTag.Add();
                return true;
            }
            // 検査メモ
            if (this.toString() == "StudyMemo") {
                Tool_StudyMemo.Add();
                return true;
            }
            // レポート連携
            if (this.toString() == "Report") {
                Tool_Report.Add();
                return true;
            }
            // レポート用画像出力
            if (this.toString() == "ReportOutput") {
                Tool_ReportOutput.Add();
                return true;
            }
            // トップリンク
            if (this.toString() == "TopLink") {
                Tool_TopLink.Add();
                return true;
            }
            // 間引き
            if (this.toString() == "ThinOut") {
                Tool_ThinOut.Add();
                return true;
            }
            // GSPS(PR)表示
            if (this.toString() == "GSPS") {
                Tool_GSPS.Add();
                return true;
            }
            // セパレータ
            Tool_Separator.Add();
        });

        // キーイベント初期化処理
        Tool_Key.Init();
    },
    // キャンセル
    Cancel: function () {
        Tool_WindowLevel.Command(false);
        Tool_Scale.Command(false);
        Tool_Move.Command(false);
        Tool_Distance.Command(false);
        Tool_CTAnalyze.Command(false);
        Tool_Angle3.Command(false);
        Tool_Angle4.Command(false);
        Tool_CTRMeasure.Command(false);
        Tool_Measure.Command(false);
        Tool_Arrow.Command(false);
        Tool_Circle.Command(false);
        Tool_FreeLine.Command(false);
        Tool_Text.Command(false);
        Tool_ManualCine.Command(false);
    },
    // サブメニューキャンセル
    SubMenuCancel: function () {
        Tool_WindowLevel.SideCommand(false);
        Tool_Measure.SideCommand(false);
        Tool_Split.Command(false);
        Tool_SeriesSync.SideCommand(false);
        Tool_SkipImage.Command(false);
        Tool_Rotate.Command(false);
        Tool_ThinOut.SideCommand(false);
        Tool_GSPS.SideCommand(false);
    },
    // デフォルト
    Default: function () {
        // メニューにデフォルトツール(ManualCine)が存在する場合かつデフォルトツール以外が選択されている場合
        if ($("#ViewerConfig").data("ViewerTools").indexOf("ManualCine") != -1 &&
            Tool_Menu.SelectName != "ManualCine") {
            // ツール名更新
            if (Tool_Menu.UpdateName("ManualCine")) {
                // キャンセル
                Tool_Menu.Cancel();

                // デフォルトツール設定
                Tool_ManualCine.Command(true);
            }
        }
        else {
            // ツール名更新
            if (Tool_Menu.UpdateName("")) {
                // キャンセル
                Tool_Menu.Cancel();
            }
        }
    },
    // 計測選択確認
    IsMeasureSelect: function () {
        // 選択状態(距離計測)の場合
        if ($("#Tool-Distance").hasClass("Tool-Distance-ON")) {
            return true;
        }
        // 選択状態(CT値測定)の場合
        else if ($("#Tool-CTAnalyze").hasClass("Tool-CTAnalyze-ON")) {
            return true;
        }
        // 選択状態(角度計測(3点))の場合
        else if ($("#Tool-Angle3").hasClass("Tool-Angle3-ON")) {
            return true;
        }
        // 選択状態(角度計測(4点))の場合
        else if ($("#Tool-Angle4").hasClass("Tool-Angle4-ON")) {
            return true;
        }
        // 選択状態(CTR計測)の場合
        else if ($("#Tool-CTRMeasure").hasClass("Tool-CTRMeasure-ON")) {
            return true;
        }
        // 選択状態(計測(距離計測))の場合
        else if ($("#Tool-Measure").hasClass("Tool-Measure-Distance-ON")) {
            return true;
        }
        // 選択状態(計測(CT値測定))の場合
        else if ($("#Tool-Measure").hasClass("Tool-Measure-CTAnalyze-ON")) {
            return true;
        }
        // 選択状態(計測(角度計測(3点)))の場合
        else if ($("#Tool-Measure").hasClass("Tool-Measure-Angle3-ON")) {
            return true;
        }
        // 選択状態(計測(角度計測(4点)))の場合
        else if ($("#Tool-Measure").hasClass("Tool-Measure-Angle4-ON")) {
            return true;
        }
        // 選択状態(計測(CTR計測))の場合
        else if ($("#Tool-Measure").hasClass("Tool-Measure-CTRMeasure-ON")) {
            return true;
        }
        // 選択状態(矢印)の場合
        else if ($("#Tool-Arrow").hasClass("Tool-Arrow-ON")) {
            return true;
        }
        // 選択状態(円)の場合
        else if ($("#Tool-Circle").hasClass("Tool-Circle-ON")) {
            return true;
        }
        // 選択状態(自由曲線)の場合
        else if ($("#Tool-FreeLine").hasClass("Tool-FreeLine-ON")) {
            return true;
        }
        // 選択状態(テキスト)の場合
        else if ($("#Tool-Text").hasClass("Tool-Text-ON")) {
            return true;
        }
        return false;
    },
    // ツール名更新
    UpdateName: function (name) {
        if (Tool_Menu.OverwriteName == "") {
            Tool_Menu.SelectName = name;
            return true;
        }
        else {
            return false;
        }
    },
    // ツール上書き
    Overwrite: function (command) {
        if (command == "WindowLevel") {
            if (Tool_Menu.OverwriteName != "WindowLevel") {
                // 上書きツール名更新
                Tool_Menu.OverwriteName = "WindowLevel";

                // キャンセル
                Tool_Menu.Cancel();

                // ツール設定
                Tool_WindowLevel.Command(true);
            }
            return;
        }
        else if (command == "Move") {
            if (Tool_Menu.OverwriteName != "Move") {
                // 上書きツール名更新
                Tool_Menu.OverwriteName = "Move";

                // キャンセル
                Tool_Menu.Cancel();

                // ツール設定
                Tool_Move.Command(true);
            }
            return;
        }
        else if (command == "Scale") {
            if (Tool_Menu.OverwriteName != "Scale") {
                // 上書きツール名更新
                Tool_Menu.OverwriteName = "Scale";

                // キャンセル
                Tool_Menu.Cancel();

                // ツール設定
                Tool_Scale.Command(true);
            }
            return;
        }

        // 上書き中で無い場合は終了
        if (Tool_Menu.OverwriteName == "") {
            return;
        }

        // 上書きツール名クリア
        Tool_Menu.OverwriteName = "";

        // キャンセル
        Tool_Menu.Cancel();

        // ツール設定(ウィンドウレベル)
        if (Tool_Menu.SelectName == "WindowLevel") {
            Tool_WindowLevel.Command(true);
        }
        // ツール設定(拡大・縮小)
        else if (Tool_Menu.SelectName == "Scale") {
            Tool_Scale.Command(true);
        }
        // ツール設定(移動)
        else if (Tool_Menu.SelectName == "Move") {
            Tool_Move.Command(true);
        }
        // ツール設定(距離計測)
        else if (Tool_Menu.SelectName == "Distance") {
            Tool_Distance.Command(true);
        }
        // ツール設定(CT値測定)
        else if (Tool_Menu.SelectName == "CTAnalyze") {
            Tool_CTAnalyze.Command(true);
        }
        // ツール設定(角度計測(3点))
        else if (Tool_Menu.SelectName == "Angle3") {
            Tool_Angle3.Command(true);
        }
        // ツール設定(角度計測(4点))
        else if (Tool_Menu.SelectName == "Angle4") {
            Tool_Angle4.Command(true);
        }
        // ツール設定(CTR計測)
        else if (Tool_Menu.SelectName == "CTRMeasure") {
            Tool_CTRMeasure.Command(true);
        }
        // ツール設定(計測)
        else if (Tool_Menu.SelectName == "Measure") {
            Tool_Measure.Command(true);
        }
        // ツール設定(矢印)
        else if (Tool_Menu.SelectName == "Arrow") {
            Tool_Arrow.Command(true);
        }
        // ツール設定(円)
        else if (Tool_Menu.SelectName == "Circle") {
            Tool_Circle.Command(true);
        }
        // ツール設定(自由曲線)
        else if (Tool_Menu.SelectName == "FreeLine") {
            Tool_FreeLine.Command(true);
        }
        // ツール設定(テキスト)
        else if (Tool_Menu.SelectName == "Text") {
            Tool_Text.Command(true);
        }
        // ツール設定(マニュアルシネ)
        else if (Tool_Menu.SelectName == "ManualCine") {
            Tool_ManualCine.Command(true);
        }
    }
}

// セパレータ
var Tool_Separator = {
    // 追加
    Add: function () {
        // 要素を作成
        $("#ToolArea-View").append($("<div>").addClass("Tool-Separator"));
    },
    // ダミー追加
    DummyAdd: function () {
        // 要素を作成
        $("#ToolArea-View").append($("<div>").addClass("Tool-Common-SizeA Tool-Dummy"));
    }
}

