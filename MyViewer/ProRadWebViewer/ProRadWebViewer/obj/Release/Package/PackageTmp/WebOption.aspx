<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebOption.aspx.cs" Inherits="ProRadWebViewer.WebOption" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Language" content="ja"/>
  <meta http-equiv="Content-type" content="text/html" />
  <meta http-equiv="Content-Style-Type" content="text/css" />
  <meta http-equiv="Content-Script-Type" content="text/javascript" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Cache-Control" content="no-cache" />
  <meta http-equiv="Expires" content="Thu, 01 Dec 1994 16:00:00 GMT" />
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link href="./Common/css/option.css?20150706a" rel="stylesheet" type="text/css" />
  <script src="./Core/js/jquery-1.7.2.min.js?20150706a" type="text/javascript"></script>
  <script src="./Common/js/common.util.js?20150706a" type="text/javascript"></script>
  <script src="./Common/js/option.window.js?20150706a" type="text/javascript"></script>
  <title>ProRadViewer Nadia</title>
</head>
<body>
  <div>
    <table>
      <tr>
        <td>表示位置 (X,Y,Width,Height)</td>
        <td><input id="DispType" type="text" /></td>
      </tr>
      <tr>
        <td></td>
        <td><input id="AddButton" type="button" value=" 登録 " /><input id="ResetButton" type="button" value=" 削除 " /></td>
      </tr>
    </table>
  </div>
</body>
</html>
