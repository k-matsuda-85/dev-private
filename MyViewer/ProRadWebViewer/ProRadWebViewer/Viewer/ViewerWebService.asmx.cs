using System.Collections.Generic;
using System.ComponentModel;
using System.Web.Script.Services;
using System.Web.Services;

namespace ProRadWebViewer
{
    [WebService(Namespace = "http://findex.co.jp/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [ToolboxItem(false)]
    [ScriptService]
    public class ViewerWebService : WebService
    {
        // パラメータ取得
        [WebMethod(EnableSession = true)]
        public WebParams GetParams(string SKey)
        {
            return CommonWebServiceProc.GetParams(SKey);
        }

        // ユーザーコンフィグ取得
        [WebMethod(EnableSession = true)]
        public WebUserConfigList GetUserConfig(string SKey)
        {
            return CommonWebServiceProc.GetUserConfig(SKey);
        }

        // モダリティコンフィグ取得
        [WebMethod(EnableSession = true)]
        public WebModalityConfigList GetModalityConfig(string SKey)
        {
            return CommonWebServiceProc.GetModalityConfig(SKey);
        }

        // アノテーション取得
        [WebMethod(EnableSession = true)]
        public WebAnnotationList GetAnnotationList(string SKey)
        {
            return CommonWebServiceProc.GetAnnotationList(SKey);
        }

        // 過去検査一覧取得
        [WebMethod(EnableSession = true)]
        public WebStudyList GetPastStudyList(string SKey, string PatientID, string StudyKey)
        {
            return CommonWebServiceProc.GetPastStudyList(SKey, PatientID, StudyKey);
        }

        // シリーズ一覧取得
        [WebMethod(EnableSession = true)]
        public WebSeriesList GetSeriesList(string SKey, string StudyKey, string Password)
        {
            return CommonWebServiceProc.GetSeriesList(SKey, StudyKey, Password, true);
        }

        // Image一覧取得
        [WebMethod(EnableSession = true)]
        public WebImageList GetImageList(string SKey, string SeriesKey)
        {
            return CommonWebServiceProc.GetImageList(SKey, SeriesKey);
        }
        [WebMethod(EnableSession = true)]
        public WebImageList GetImageList2(string SKey, string[] ImageKeys)
        {
            return CommonWebServiceProc.GetImageList2(SKey, ImageKeys);
        }

        // Image情報取得
        [WebMethod(EnableSession = true)]
        public WebImageInfo GetImageInfo(string SKey, string ImageKey)
        {
            return CommonWebServiceProc.GetImageInfo(SKey, ImageKey);
        }

        // DicomTag取得
        [WebMethod(EnableSession = true)]
        public WebDicomTagList GetDicomTag(string SKey, string ImageKey, uint[] Tags)
        {
            return CommonWebServiceProc.GetDicomTag(SKey, ImageKey, Tags);
        }

        // DicomTag一覧取得
        [WebMethod(EnableSession = true)]
        public WebDicomTagList GetDicomTagAll(string SKey, string ImageKey)
        {
            return CommonWebServiceProc.GetDicomTagAll(SKey, ImageKey);
        }

        // CT値取得
        [WebMethod(EnableSession = true)]
        public WebCTValue GetCTValue(string SKey, string ImageKey, string Params)
        {
            return CommonWebServiceProc.GetCTValue(SKey, ImageKey, Params);
        }

        // 検査メモ取得
        [WebMethod(EnableSession = true)]
        public WebMemoList GetStudyMemo(string SKey, string StudyKey)
        {
            return CommonWebServiceProc.GetStudyMemo(SKey, StudyKey);
        }

        // 検査メモ履歴取得
        [WebMethod(EnableSession = true)]
        public WebMemoList GetStudyMemoHistory(string SKey, string StudyKey)
        {
            return CommonWebServiceProc.GetStudyMemoHistory(SKey, StudyKey);
        }

        // 検査メモ設定
        [WebMethod(EnableSession = true)]
        public WebResult SetStudyMemo(string SKey, string StudyKey, string UserName, string Memo)
        {
            return CommonWebServiceProc.SetStudyMemo(SKey, StudyKey, UserName, Memo);
        }

        // 画像出力
        [WebMethod(EnableSession = true)]
        public WebResult PutImage(string SKey, string[] Trace, string Path)
        {
            return CommonWebServiceProc.PutImage(SKey, Trace, Path);
        }

        // 事前画像対象一覧取得
        [WebMethod(EnableSession = true)]
        public WebPrefetchImageList PrefetchImageList(string SKey, string SeriesKey)
        {
            return CommonWebServiceProc.PrefetchImageList(SKey, SeriesKey);
        }

        // 事前画像取得
        [WebMethod(EnableSession = true)]
        public WebResult PrefetchImage(string SKey, string ImageKey)
        {
            return CommonWebServiceProc.PrefetchImage(SKey, ImageKey);
        }

        // GSPSデータ取得
        [WebMethod(EnableSession = true)]
        public WebGSPSDataList GetGspsDataList(string SKey, string GSPSKey)
        {
            return CommonWebServiceProc.GetGspsDataList(SKey, GSPSKey);
        }
    }
}
