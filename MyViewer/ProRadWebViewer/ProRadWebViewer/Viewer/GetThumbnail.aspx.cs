using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace ProRadWebViewer
{
    public partial class GetThumbnail : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            CommonWebServiceProc.GetThumbnail();
        }
    }
}