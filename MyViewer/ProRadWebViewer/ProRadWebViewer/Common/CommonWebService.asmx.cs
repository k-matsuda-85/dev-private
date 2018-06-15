using System.ComponentModel;
using System.Web.Script.Services;
using System.Web.Services;

namespace ProRadWebViewer
{
    [WebService(Namespace = "http://findex.co.jp/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [ToolboxItem(false)]
    [ScriptService]
    public class CommonWebService : WebService
    {
        // ログイン
        [WebMethod(EnableSession = true)]
        public bool Login(string LoginID, string Password, string Extension)
        {
            return CommonWebServiceProc.Login(LoginID, Password, Extension);
        }

        // ログアウト
        [WebMethod(EnableSession = true)]
        public bool Logout()
        {
            return CommonWebServiceProc.Logout();
        }
    }
}
