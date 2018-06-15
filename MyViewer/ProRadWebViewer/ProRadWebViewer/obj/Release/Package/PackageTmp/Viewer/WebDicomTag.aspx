<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebDicomTag.aspx.cs" Inherits="ProRadWebViewer.WebDicomTag" %>

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
  <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link href="../Common/img/favicon.ico?20150706a" rel="shortcut icon" />
  <link href="./css/dicomtag.css?20150706a" rel="stylesheet" type="text/css" />
  <script src="../Core/js/jquery-1.7.2.min.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.util.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.data.js?20150706a" type="text/javascript"></script>
  <script src="./js/dicomtag.window.js?20150706a" type="text/javascript"></script>
  <title>DicomTag</title>
</head>
<body>
  <div id="ViewerConfig"></div>
  <div id="DicomTagList">
    <table id="DicomTagList-View" cellpadding="0" cellspacing="0">
      <thead>
        <tr>
          <th class="DicomTagList-Head DicomTagList-Body-Group">Group<span></span></th>
          <th class="DicomTagList-Head DicomTagList-Body-Element">Element<span></span></th>
          <th class="DicomTagList-Head DicomTagList-Body-EName">EName<span></span></th>
          <th class="DicomTagList-Head DicomTagList-Body-JName">JName<span></span></th>
          <th class="DicomTagList-Head DicomTagList-Body-VR">VR<span></span></th>
          <th class="DicomTagList-Head DicomTagList-Body-Length">Length<span></span></th>
          <th class="DicomTagList-Head DicomTagList-Body-Value">Value<span></span></th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
</body>
</html>
