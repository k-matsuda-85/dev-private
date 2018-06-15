using System;
using System.Runtime.InteropServices;
using System.Security.Principal;

namespace ProRadServiceLib
{
    class Impersonate : IDisposable
    {
        [DllImport("advapi32.dll", SetLastError = true)]
        static extern bool LogonUser(string principal, string authority, string password, LogonSessionType logonType, LogonProvider logonProvider, out IntPtr token);

        [DllImport("kernel32.dll", SetLastError = true)]
        static extern bool CloseHandle(IntPtr handle);

        enum LogonSessionType : uint
        {
            Interactive = 2,
            Network,
            Batch,
            Service,
            NetworkCleartext = 8,
            NewCredentials
        }

        enum LogonProvider : uint
        {
            Default = 0, // プラットフォームのデフォルト (これを使用してください!)
            WinNT35,     // authority にスモーク シグナルを送信してください。
            WinNT40,     // NTLM を使用します。
            WinNT50      // Kerb または NTLM でネゴシエーションを行います。
        }

        IntPtr token = IntPtr.Zero;
        WindowsImpersonationContext impersonatedUser = null;

        public Impersonate(string username, string password, string domain = "")
        {
            if (username != null && username != "")
            {
                //トークンを作成します。
                bool result = LogonUser(username, domain, password, LogonSessionType.Interactive, LogonProvider.Default, out token);
                if (result)
                {
                    WindowsIdentity id = new WindowsIdentity(token);

                    // 偽装を開始します。
                    impersonatedUser = id.Impersonate();
                    //LogUtil.Error("Identity after impersonation: {0}", WindowsIdentity.GetCurrent().Name);
                }
                else
                {
                    throw new Exception(string.Format("LogonUser failed: {0}", Marshal.GetLastWin32Error().ToString()));
                }
            }
        }

        ~Impersonate()
        {
            Dispose(false);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                try
                {
                    // 偽装を停止し、プロセス ID に戻します。
                    if (impersonatedUser != null)
                        impersonatedUser.Undo();

                    // トークンを開放します。
                    if (token != IntPtr.Zero)
                        CloseHandle(token);

                    //LogUtil.Error("Identity after Undo: {0}", WindowsIdentity.GetCurrent().Name);
                }
                catch { }
            }
        }
    }
}
