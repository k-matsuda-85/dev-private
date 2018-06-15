<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebLogin.aspx.cs" Inherits="ProRadWebViewer.WebLogin" %>

<!DOCTYPE html >

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ja">
<head>
  <meta http-equiv="Content-Language" content="ja"/>
  <meta http-equiv="Content-type" content="text/html" />
  <meta http-equiv="Content-Style-Type" content="text/css" />
  <meta http-equiv="Content-Script-Type" content="text/javascript" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Cache-Control" content="no-cache" />
  <meta http-equiv="Expires" content="Thu, 01 Dec 1994 16:00:00 GMT" />
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="apple-touch-icon-precomposed" href="./Common/img/Nadia.png?20150706a" />
  <link href="./Common/img/favicon.ico?20180613" rel="shortcut icon" />
  <link href="./Common/css/login.css?20150706a" rel="stylesheet" type="text/css" />
  <link href="./Common/css/Add/bootstrap-theme.min.css" rel="stylesheet"/>
  <link href="./Common/css/Add/bootstrap.css" rel="stylesheet"/>
  <script src="./Core/js/jquery-1.7.2.min.js?20150706a" type="text/javascript"></script>
  <script src="./Common/js/common.util.js?20150706a" type="text/javascript"></script>
  <script src="./Common/js/common.config.js?20150706a" type="text/javascript"></script>
  <script src="./Common/js/login.load.js?20150706a" type="text/javascript"></script>
  <script src="./Common/js/login.window.js?20150706a" type="text/javascript"></script>
  <title></title>
</head>
<body>
  <div id="LoginInput">
    <div id="Hidden">
      <input runat="server" id="LoginMode" type="hidden" />
      <input runat="server" id="DefaultID" type="hidden"  />
      <input runat="server" id="DefaultPass" type="hidden" />
    </div>
      <div id="Logo"></div>
    <div id="LoginID">
      <input placeholder="login ID"/>
    </div>
    <div id="Password">
      <input type="password" placeholder="password"/>
    </div>
    <div id="LoginButton" class="form-control btn">
      Log In
    </div>
    <div id="Version"></div>
  </div>
</body>
</html>
