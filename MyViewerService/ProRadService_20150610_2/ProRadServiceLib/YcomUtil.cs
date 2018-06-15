using System;
using System.Collections.Generic;
using YComLib;

namespace ProRadServiceLib
{
    class YcomUtil
    {
        static Dictionary<string, YCom> lockObjs = new Dictionary<string, YCom>();
        static object sync = new object();

        public static YCom Open1(string serverAETitle)
        {
            return Open(1, serverAETitle);
        }

        public static YCom Open2(string serverAETitle)
        {
            return Open(2, serverAETitle);
        }

        public static YCom Open(int no, string serverAETitle)
        {
            string key = no + "_" + serverAETitle;

            if (lockObjs.ContainsKey(key))
            {
                return lockObjs[key];
            }

            lock (sync)
            {
                if (lockObjs.ContainsKey(key))
                {
                    return lockObjs[key];
                }

                var sv = YCOM.GetStoreServer(serverAETitle);
                if (sv == null || sv.IPAddr == "" || sv.PortNumber == "")
                {
                    LogUtil.Error1("YCOM AEエラー[{0}]", serverAETitle);
                    return null;
                }

                int port = 0;
                Int32.TryParse(sv.PortNumber, out port);

                var ycom = new YCom(sv.IPAddr, port, AppUtil.YComClientInfo, AppUtil.YComHospitalID, AppUtil.YComUserID);
                YComErrorStatus status = ycom.Open();
                if (status != YComErrorStatus.Success)
                {
                    LogUtil.Error("YComErrorStatus=" + status);
                }

                lockObjs.Add(key, ycom);
                return ycom;
            }
        }
    }
}
