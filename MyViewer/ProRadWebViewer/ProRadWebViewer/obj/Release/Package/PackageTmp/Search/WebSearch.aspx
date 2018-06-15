<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebSearch.aspx.cs" Inherits="ProRadWebViewer.WebSearch" %>

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
  <link href="../Common/img/favicon.ico?20180613" rel="shortcut icon" />
  <link href="../Common/img/favicon.ico?20180613" rel="icon" />
  <link href="./css/search.css?20150706a" rel="stylesheet" type="text/css" />

  <link href="../Common/css/Add/bootstrap-theme.min.css" rel="stylesheet"/>
  <link href="../Common/css/Add/bootstrap.css" rel="stylesheet"/>

  <link href="../Common/css/Add/bootstrap-datepicker3.min.css" rel="stylesheet"/>
  <link href="../Common/css/Add/bootstrap-datepicker3.standalone.min.css" rel="stylesheet"/>

  <%--<script src="../Core/js/jquery-1.7.2.min.js?20150706a" type="text/javascript"></script>--%>
  <script src="../Common/js/Add/jquery-1.12.4.min.js" type="text/javascript"></script>
  <script src="../Core/js/jquery.mousewheel.min.js?20150706a" type="text/javascript"></script>
  <script src="../Common/js/Add/bootstrap.js" type="text/javascript"></script>
  <script src="./js/bootstrap-datepicker.min.js" type="text/javascript"></script>
  <script src="./js/bootstrap-datepicker.ja.min.js" type="text/javascript"></script>
  <script src="./js/search.util.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.config.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.data.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.load.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.window.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.menu.input.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.menu.preset.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.menu.command.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.menu.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.studylist.js?20150706a" type="text/javascript"></script>
  <script src="./js/search.serieslist.js?20150706a" type="text/javascript"></script>


  <title>MyViewer</title>
</head>
<body>
  <div id="menu-fld" class="left">
      <div id="logo-btn"></div>
      <section>
          <div class="panel-group" id="accordion">
            <div class="panel panel-default side-menu">
              <div class="panel-heading">
                <h4 class="panel-title accordion-toggle">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne"></a>
                    <p>アルバム</p>
                </h4>
              </div>
              <div id="collapseOne" class="panel-collapse collapse">
                <div class="panel-body">
                </div>
              </div>
            </div>
            <div class="panel panel-default side-menu">
              <div class="panel-heading">
                <h4 class="panel-title accordion-toggle">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" class="collapsed"></a>
                </h4>
              </div>
              <div id="collapseTwo" class="panel-collapse collapse">
                <div class="panel-body">
                </div>
              </div>
            </div>
            <div class="panel panel-default side-menu">
              <div class="panel-heading">
                <h4 class="panel-title accordion-toggle">
                  <a data-toggle="collapse" data-parent="#accordion" href="#collapseThree" class="collapsed"></a>
                </h4>
              </div>
              <div id="collapseThree" class="panel-collapse collapse">
                <div class="panel-body">
                </div>
              </div>
            </div>
          </div>
        </section>
  </div>
  <div id="search-fld" class="left">
      <div id="ViewerConfig"></div>
      <div id="SearchHead">
        <div id="SearchMenu">
          <div id="SearchMenu-Info">
            <div id="SearchMenu-Info-Title"></div>
            <div id="SearchMenu-Info-View"></div>
          </div>
          <div id="SearchMenu-Basic">
            <div id="SearchMenu-Basic-PatientID">
                <label for="patid" class="control-label search-obj">患者 ID</label>
                <div class="search-obj">
                    <input type="text" id="patid"/>
                </div>
            </div>
            <div id="SearchMenu-Basic-StudyDate">
                <label for="patid" class="control-label search-obj">検査日</label>
                <div id="search-today" class="search-button on-btn">今日</div>
                <div id="search-yestaday" class="search-button off-btn">昨日</div>
                <div id="search-week" class="search-button off-btn">1週間</div>
            </div>
            <div id="SearchMenu-Basic-Modality">
                <label id="modality-label" for="modality" class="control-label lbltitle error-label search-obj">モダリティ</label>
                <div id="search-mod-CR" class="search-button off-btn">CR</div>
                <div id="search-mod-CT" class="search-button on-btn">CT</div>
                <div id="search-mod-MR" class="search-button off-btn">MR</div>
                <div id="search-mod-US" class="search-button off-btn">US</div>
                <div id="search-mod-MG" class="search-button off-btn">MG</div>

            </div>
<%--            <div id="SearchMenu-Basic-Search" class="form-control btn">Search</div>
            <div id="SearchMenu-Basic-Reset" class="form-control btn">Reset</div>--%>
          </div>
          <div id="SearchMenu-Command">
          </div>
        </div>
      </div>
      <div id="SearchCenter">
        <div id="StudyList">
          <table id="StudyList-View" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th id="StudyList-Head-Left" class="StudyList-Body-Left"></th>
                <th id="StudyList-Head-Right"></th>
              </tr>
              <tr class="hidden">
                <th id="SearchMenu-Input-Left" class="StudyList-Body-Left"><span></span></th>
                <th id="SearchMenu-Input-Right"><span></span></th>
              </tr>
            </thead>
          </table>
        </div>
        <div id="StudyList-Table">
          <table id="StudyList-Table-View" cellpadding="0" cellspacing="0">
            <tfoot>
              <tr>
                <td id="StudyList-Table-Foot" colspan="4"><span></span></td>
              </tr>
            </tfoot>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div id="SearchFoot">
        <div id="Separator"><span></span></div>
        <div id="SeriesList">
          <table id="SeriesList-View" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th id="SeriesList-Head-Left"></th>
                <th id="SeriesList-Head-Center"></th>
                <th id="SeriesList-Head-Center-Far"><!--<span id="SearchMenu-Info-Result"></span> / <span id="SearchMenu-Info-Max"></span>--></th>
                <th id="SeriesList-Head-Right" class="SeriesList-Head-Right-Down-OFF"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td id="SeriesList-Body" colspan="4">
                  <div id="SeriesList-Body-View"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div id="SearchMenu-Sub">
        <div id="SearchMenu-Command-Sub-Menu"></div>
        <div id="SearchMenu-Command-Sub-Option"></div>
        <div id="SearchMenu-Input-Sub-HospitalName"></div>
        <div id="SearchMenu-Input-Sub-StudyDate"></div>
        <div id="SearchMenu-Input-Sub-StudyDateTime"></div>
        <div id="SearchMenu-Input-Sub-Modality"></div>
        <div id="SearchMenu-Input-Sub-UploadDate"></div>
        <div id="SearchMenu-Input-Sub-UploadDateTime"></div>
        <div id="SearchMenu-Input-Sub-Keyword"></div>
      </div>

  </div>
  <div id="DragDropItem"></div>
  <div id="CommonLayer">
    <div id="CommonLayer-Opacity"></div>
  </div>
</body>
</html>
