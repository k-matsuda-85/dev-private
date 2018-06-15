<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebViewer.aspx.cs" Inherits="ProRadWebViewer.WebViewer" %>

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
  <link href="../Common/img/favicon.ico?20180424" rel="shortcut icon" />
  <link href="./css/viewer.css?20150706a" rel="stylesheet" type="text/css" />
  <script src="../Core/js/jquery-1.7.2.min.js?20150706a" type="text/javascript"></script>
  <script src="../Core/js/jquery.mousewheel.min.js?20150706a" type="text/javascript"></script>
  <script src="../Core/js/excanvas.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.util.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.config.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.data.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.load.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.window.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.patientinfo.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.studylist.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.serieslist.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.toolarea.js?20150706a" type="text/javascript"></script>
  <script src="./js/viewer.studymemo.js?20150706a" type="text/javascript"></script>
  <script src="./js/Ctrl/map.js?20150706a" type="text/javascript"></script>
  <script src="./js/Ctrl/viewer.js?20150706a" type="text/javascript"></script>
  <script src="./js/Ctrl/viewerctrl.js?20150706a" type="text/javascript"></script>
  <script src="./js/Ctrl/viewerseries.js?20150706a" type="text/javascript"></script>
  <script src="./js/Ctrl/viewersop.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.menu.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.windowlevel.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.scale.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.move.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.distance.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.ctanalyze.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.angle.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.ctrmeasure.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.measure.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.arrow.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.circle.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.freeline.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.text.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.reset.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.split.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.cutline.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.seriessync.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.manualcine.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.skipimage.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.skipseries.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.rotate.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.annotation.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.help.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.exit.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.toolareachange.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.seriespanelchange.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.dicomtag.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.studymemo.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.report.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.toplink.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.thinout.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.gsps.js?20150706a" type="text/javascript"></script>
  <script src="./js/Tool/tool.key.js?20150706a" type="text/javascript"></script>
  <title>MyViewer</title>
</head>
<body>
  <div id="ViewerConfig"></div>
  <div id="ViewerHead">
    <div id="ToolArea">
      <div id="ToolArea-View"></div>
      <div id="ToolArea-View-Overlay-Left"></div>
      <div id="ToolArea-View-Overlay-Right"></div>
    </div>
  </div>
  <div id="ViewerCenter">
    <div id="ViewerRight"></div>
    <div id="ViewerLeft">
      <div id="ViewerLib"></div>
    </div>
  </div>
  <div id="ViewerFoot">
    <div id="Separator"><span></span></div>
    <div id="PatientInfo">
      <table id="PatientInfo-View" cellpadding="0" cellspacing="0">
        <thead>
          <tr>
            <th id="PatientInfo-Head-Left"></th>
            <th id="PatientInfo-Head-Center"><span id="PatientInfo-PatientID"></span><span id="PatientInfo-PatientsName"></span><span id="WebStatus"></span></th>
            <th id="PatientInfo-Head-Center-Far"><a></a></th>
            <th id="PatientInfo-Head-Right" class="PatientInfo-Head-Right-Down-OFF"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td id="PatientInfo-Body" colspan="4">
              <div id="StudyList">
                <table id="StudyList-View" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                      <th id="StudyList-Head-Left" class="StudyList-Body-Left"><span></span></th>
                      <th id="StudyList-Head-Right"><span></span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td id="StudyList-Body">
                        <div id="StudyList-Table">
                          <table id="StudyList-Table-View" cellpadding="0" cellspacing="0">
                            <tbody></tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div id="SeriesList"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div id="ToolArea-Sub"></div>
  <div id="DragDropItem"></div>
  <div id="CommonLayer">
    <div id="CommonLayer-Opacity"></div>
  </div>
</body>
</html>
