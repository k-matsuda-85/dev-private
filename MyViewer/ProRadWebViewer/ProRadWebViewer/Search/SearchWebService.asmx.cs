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
    public class SearchWebService : WebService
    {
        // パスワード設定
        [WebMethod(EnableSession = true)]
        public WebResult SetUserPassword(string Password, string NewPassword)
        {
            return CommonWebServiceProc.SetUserPassword(Password, NewPassword);
        }

        // パラメータ設定
        [WebMethod(EnableSession = true)]
        public bool SetParams(Dictionary<string, string> Param)
        {
            return CommonWebServiceProc.SetParams(Param);
        }

        // パラメータ取得
        [WebMethod(EnableSession = true)]
        public WebParams GetParams()
        {
            return CommonWebServiceProc.GetParams("");
        }

        // ユーザーコンフィグ取得
        [WebMethod(EnableSession = true)]
        public WebUserConfigList GetUserConfig()
        {
            return CommonWebServiceProc.GetUserConfig("");
        }

        // ユーザーコンフィグ設定
        [WebMethod(EnableSession = true)]
        public WebResult SetUserConfig(Dictionary<string, string> Param)
        {
            return CommonWebServiceProc.SetUserConfig(Param);
        }

        // 検査一覧取得
        [WebMethod(EnableSession = true)]
        public WebStudyList GetStudyList(string[] HospitalID, Dictionary<string, string> FindParam)
        {
            return CommonWebServiceProc.GetStudyList(HospitalID, FindParam);
        }

        // シリーズ一覧取得
        [WebMethod(EnableSession = true)]
        public WebSeriesList GetSeriesList(string StudyKey)
        {
            return CommonWebServiceProc.GetSeriesList("", StudyKey, "", false);
        }

        // キーワード設定
        [WebMethod(EnableSession = true)]
        public WebResult SetKeyword(string StudyKey, string Keyword)
        {
            return CommonWebServiceProc.SetKeyword(StudyKey, Keyword);
        }

        // 検査削除
        [WebMethod(EnableSession = true)]
        public WebResult DelStudy(string StudyKey)
        {
            return CommonWebServiceProc.DelStudy(StudyKey);
        }

        // コメント設定
        [WebMethod(EnableSession = true)]
        public WebResult SetComment(string StudyKey, string Comment)
        {
            return CommonWebServiceProc.SetComment(StudyKey, Comment);
        }
    }
}
