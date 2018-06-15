using System;
using System.Runtime.CompilerServices;

namespace ProRadServiceLib
{
    public class DebugLog : IDisposable
    {
#if DEBUG
        string name = "";
        long tick = 0;
#endif
        public DebugLog([CallerMemberName] string member = "")
        {
#if DEBUG
            name = member;
            tick = DateTime.Now.Ticks;
            LogUtil.Info("[" + tick + "] " + name + " IN");
#endif
        }
        public void Dispose()
        {
#if DEBUG
            LogUtil.Info("[" + tick + "] " + name + " OUT");
#endif
        }
    }
}
