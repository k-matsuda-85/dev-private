/// <reference path="/Core/js/jquery-1.4.1-vsdoc.js" />  /* IntelliSense */

// グローバル宣言
var _SearchWindow_LoadImages = new Array();

// 画像読み込み処理
function SearchWindow_LoadImages() {
    var base = "./img/x1/";
    if (Common_DevicePixelRatio() == 2) {
        base = "./img/x2/";
    }
    SearchWindow_LoadImagesSub(base, "Close_off.png");
    SearchWindow_LoadImagesSub(base, "dummy_off.png");
    SearchWindow_LoadImagesSub(base, "dummy_on.png");
    SearchWindow_LoadImagesSub(base, "HeadCenter.png");
    SearchWindow_LoadImagesSub(base, "HeadLeft.png");
    SearchWindow_LoadImagesSub(base, "HeadRight.png");
    SearchWindow_LoadImagesSub(base, "HeadRight_down_off.png");
    SearchWindow_LoadImagesSub(base, "HeadRight_down_on.png");
    SearchWindow_LoadImagesSub(base, "HeadRight_up_off.png");
    SearchWindow_LoadImagesSub(base, "HeadRight_up_on.png");
    SearchWindow_LoadImagesSub(base, "Help_off.png");
    SearchWindow_LoadImagesSub(base, "InputSubMenu.png");
    SearchWindow_LoadImagesSub(base, "Loding.gif");
    SearchWindow_LoadImagesSub(base, "Logout2_off.png");
    SearchWindow_LoadImagesSub(base, "MemoIcon_off.png");
    SearchWindow_LoadImagesSub(base, "Menu_off.png");
    SearchWindow_LoadImagesSub(base, "Menu_on.png");
    SearchWindow_LoadImagesSub(base, "MenuBack2.png");
    SearchWindow_LoadImagesSub(base, "MenuInfo2.png");
    SearchWindow_LoadImagesSub(base, "MenuPreset.png");
    SearchWindow_LoadImagesSub(base, "MenuReset.png");
    SearchWindow_LoadImagesSub(base, "MenuSearch.png");
    SearchWindow_LoadImagesSub(base, "NowLoading.png");
    SearchWindow_LoadImagesSub(base, "Option_off.png");
    SearchWindow_LoadImagesSub(base, "Option_on.png");
    SearchWindow_LoadImagesSub(base, "OverlayA_Left.png");
    SearchWindow_LoadImagesSub(base, "OverlayA_Right.png");
    SearchWindow_LoadImagesSub(base, "PACS_off.png");
    SearchWindow_LoadImagesSub(base, "PACS_on.png");
    SearchWindow_LoadImagesSub(base, "Portal.png");
    SearchWindow_LoadImagesSub(base, "Portal_off.png");
    SearchWindow_LoadImagesSub(base, "Separator.png");
    SearchWindow_LoadImagesSub(base, "SeriesItem_off.png");
    SearchWindow_LoadImagesSub(base, "ShortURL.png");
    SearchWindow_LoadImagesSub(base, "StudyPassword.png");
    SearchWindow_LoadImagesSub(base, "Uploader_off.png");
}
function SearchWindow_LoadImagesSub(base, name) {
    var param = "?20150706a";
    _SearchWindow_LoadImages.push($("<img>").attr("src", base + name + param));
}
