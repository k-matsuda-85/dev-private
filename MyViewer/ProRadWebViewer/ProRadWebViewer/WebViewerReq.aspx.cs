using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ProRadWebViewer
{
    public partial class WebViewerReq : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string _ErrorMessage;
            CommonWebServiceProc.LoadWebViewerReq(out _ErrorMessage);
            this.ErrorMessage.Value = _ErrorMessage;
        }
    }
}