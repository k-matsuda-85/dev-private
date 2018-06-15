<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebViewerReq.aspx.cs" Inherits="ProRadWebViewer.WebViewerReq" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-cache" />
<meta http-equiv="Expires" content="Thu, 01 Dec 1994 16:00:00 GMT" />
<script type="text/javascript">
<!--
  window.onload = function () {
    var ele = document.getElementById("ErrorMessage");
    window.alert(ele.value);
    window.open("about:blank", "_self");
    window.opener = window;
    window.close();
  };
// -->
</script>
<title></title>
</head>
<body>
<input runat="server" id="ErrorMessage" type="hidden"/>
</body>
</html>
