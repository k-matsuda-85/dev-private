using System;
using System.Collections.Generic;

namespace ProRadServiceLib
{
    class LockUtil
    {
        static Dictionary<string, object> lockObjs = new Dictionary<string, object>();
        static object sync = new object();

        public static object Lock1()
        {
            return Lock(1);
        }

        public static object Lock2()
        {
            return Lock(2);
        }

        private static object Lock(int no)
        {
            string key = no.ToString();

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

                var obj = new object();

                lockObjs.Add(key, obj);
                return obj;
            }
        }
    }
}
