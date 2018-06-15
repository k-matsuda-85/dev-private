using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ProRadWebViewer
{
    public partial class WebLogin : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string _LoginMode, _DefaultID, _DefaultPass;
            CommonWebServiceProc.LoadWebLogin(out _LoginMode, out _DefaultID, out _DefaultPass);
            this.LoginMode.Value = _LoginMode;
            this.DefaultID.Value = _DefaultID;
            this.DefaultPass.Value = _DefaultPass;
        }
    }
}