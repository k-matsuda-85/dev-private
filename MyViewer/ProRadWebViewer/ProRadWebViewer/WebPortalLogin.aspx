<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebPortalLogin.aspx.cs" Inherits="ProRadWebViewer.WebPortalLogin" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja">
<head>
  <meta http-equiv="Content-Language" content="ja"/>
  <meta http-equiv="Content-type" content="text/html" />
  <meta http-equiv="Content-Style-Type" content="text/css" />
  <meta http-equiv="Content-Script-Type" content="text/javascript" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Cache-Control" content="no-cache" />
  <meta http-equiv="Expires" content="Thu, 01 Dec 1994 16:00:00 GMT" />
  <link href="./Common/css/portallogin.css?20150706a" rel="stylesheet" type="text/css" />
  <script src="./Core/js/jquery-1.7.2.min.js?20150706a" type="text/javascript"></script>
  <script src="./Common/js/common.config.js?20150706a" type="text/javascript"></script>
  <script src="./Common/js/portallogin.window.js?20150706a" type="text/javascript"></script>
  <title></title>
</head>
<body>
  <div id="Login">
    <div id="LabelID">ID</div>
    <div id="ID">
      <input />
    </div>
    <div id="LabelPassword">パスワード</div>
    <div id="Password">
      <input type="password" />
    </div>
    <div id="Button">
      <input id="LoginButton" type="button" value="ログイン" />
      <input id="ClearButton" type="button" value="クリア" />
    </div>
  </div>
</body>
</html>
