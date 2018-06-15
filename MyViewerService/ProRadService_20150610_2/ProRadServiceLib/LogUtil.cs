using System.Collections.Generic;
using System.Runtime.CompilerServices;

namespace ProRadServiceLib
{
    static class LogUtil
    {
        static LogUtil()
        {
            CommonLib.Log.TraceFileLog.DefaultPath = AppUtil.LogPath;
            CommonLib.Log.TraceFileLog.Start();
        }

        /// <summary>
        /// 開発用のデバッグメッセージ
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Debug(object message, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            Log(CommonLib.Log.LogType.DEBUG, file, line, member, message);
        }

        /// <summary>
        /// 開発用のデバッグメッセージ
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Debug1(string format, object arg0, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.DEBUG, file, line, member, format, arg0);
        }

        /// <summary>
        /// 開発用のデバッグメッセージ
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Debug2(string format, object arg0, object arg1, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.DEBUG, file, line, member, format, arg0, arg1);
        }

        /// <summary>
        /// 開発用のデバッグメッセージ
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Debug3(string format, object arg0, object arg1, object arg2, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.DEBUG, file, line, member, format, arg0, arg1, arg2);
        }

        /// <summary>
        /// 開発用のデバッグメッセージ
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Debug4(string format, object arg0, object arg1, object arg2, object arg3, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.DEBUG, file, line, member, format, arg0, arg1, arg2, arg3);
        }

        /// <summary>
        /// 操作ログなどの情報
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Info(object message, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            Log(CommonLib.Log.LogType.NORMAL, file, line, member, message);
        }

        /// <summary>
        /// 操作ログなどの情報
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Info1(string format, object arg0, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.NORMAL, file, line, member, format, arg0);
        }

        /// <summary>
        /// 操作ログなどの情報
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Info2(string format, object arg0, object arg1, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.NORMAL, file, line, member, format, arg0, arg1);
        }

        /// <summary>
        /// 操作ログなどの情報
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Info3(string format, object arg0, object arg1, object arg2, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.NORMAL, file, line, member, format, arg0, arg1, arg2);
        }

        /// <summary>
        /// 操作ログなどの情報
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Info4(string format, object arg0, object arg1, object arg2, object arg3, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.NORMAL, file, line, member, format, arg0, arg1, arg2, arg3);
        }

        /// <summary>
        /// 操作ログなどの情報
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Info5(string format, object arg0, object arg1, object arg2, object arg3, object arg4, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.NORMAL, file, line, member, format, arg0, arg1, arg2, arg3, arg4);
        }

        /// <summary>
        /// 障害ではない注意警告
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Warn(object message, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            Log(CommonLib.Log.LogType.WARNING, file, line, member, message);
        }

        /// <summary>
        /// 障害ではない注意警告
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Warn1(string format, object arg0, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.WARNING, file, line, member, format, arg0);
        }

        /// <summary>
        /// 障害ではない注意警告
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Warn2(string format, object arg0, object arg1, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.WARNING, file, line, member, format, arg0, arg1);
        }

        /// <summary>
        /// 障害ではない注意警告
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Warn3(string format, object arg0, object arg1, object arg2, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.WARNING, file, line, member, format, arg0, arg1, arg2);
        }

        /// <summary>
        /// 障害ではない注意警告
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Warn4(string format, object arg0, object arg1, object arg2, object arg3, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.WARNING, file, line, member, format, arg0, arg1, arg2, arg3);
        }

        /// <summary>
        /// システム停止はしないが、問題となる障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Error(object message, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            Log(CommonLib.Log.LogType.ERROR, file, line, member, message);
        }

        /// <summary>
        /// システム停止はしないが、問題となる障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Error1(string format, object arg0, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.ERROR, file, line, member, format, arg0);
        }

        /// <summary>
        /// システム停止はしないが、問題となる障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Error2(string format, object arg0, object arg1, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.ERROR, file, line, member, format, arg0, arg1);
        }

        /// <summary>
        /// システム停止はしないが、問題となる障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Error3(string format, object arg0, object arg1, object arg2, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.ERROR, file, line, member, format, arg0, arg1, arg2);
        }

        /// <summary>
        /// システム停止はしないが、問題となる障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Error4(string format, object arg0, object arg1, object arg2, object arg3, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.ERROR, file, line, member, format, arg0, arg1, arg2, arg3);
        }

        /// <summary>
        /// システム停止はしないが、問題となる障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Error5(string format, object arg0, object arg1, object arg2, object arg3, object arg4, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.ERROR, file, line, member, format, arg0, arg1, arg2, arg3, arg4);
        }

        /// <summary>
        /// システム停止するような致命的な障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Fatal(object message, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            Log(CommonLib.Log.LogType.CRITICALERROR, file, line, member, message);
        }

        /// <summary>
        /// システム停止するような致命的な障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Fatal1(string format, object arg0, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.CRITICALERROR, file, line, member, format, arg0);
        }

        /// <summary>
        /// システム停止するような致命的な障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Fatal2(string format, object arg0, object arg1, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.CRITICALERROR, file, line, member, format, arg0, arg1);
        }

        /// <summary>
        /// システム停止するような致命的な障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Fatal3(string format, object arg0, object arg1, object arg2, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.CRITICALERROR, file, line, member, format, arg0, arg1, arg2);
        }

        /// <summary>
        /// システム停止するような致命的な障害
        /// </summary>
        /// <param name="dummy">使用禁止</param>
        /// <param name="file">使用禁止</param>
        /// <param name="line">使用禁止</param>
        /// <param name="member">使用禁止</param>
        public static void Fatal4(string format, object arg0, object arg1, object arg2, object arg3, DUMMY dummy = null, [CallerFilePath] string file = "", [CallerLineNumber] int line = 0, [CallerMemberName] string member = "")
        {
            LogFormat(CommonLib.Log.LogType.CRITICALERROR, file, line, member, format, arg0, arg1, arg2, arg3);
        }

        private static void Log(CommonLib.Log.LogType type, string file, int line, string member, object message)
        {
            string msg = (message != null) ? message.ToString() : "";
            Write(type, file, line, member, msg);
        }

        private static void LogFormat(CommonLib.Log.LogType type, string file, int line, string member, string format, params object[] args)
        {
            string msg = string.Format(format, args);
            Write(type, file, line, member, msg);
        }

        private static void Write(CommonLib.Log.LogType type, string file, int line, string member, string message)
        {
            var msg = new List<object>();
            msg.Add("Member");
            msg.Add(member);
            msg.Add("Message");
            msg.Add(message);

            //if (OperationContext.Current != null &&
            //    OperationContext.Current.IncomingMessageProperties != null &&
            //    OperationContext.Current.IncomingMessageProperties.ContainsKey(RemoteEndpointMessageProperty.Name))
            //{
            //    var property = (RemoteEndpointMessageProperty)OperationContext.Current.IncomingMessageProperties[RemoteEndpointMessageProperty.Name];

            //    msg.Add("Computer");
            //    msg.Add(property.Address);
            //}

            if (System.Web.HttpContext.Current != null && System.Web.HttpContext.Current.Request != null)
            {
                msg.Add("Computer");
                msg.Add(System.Web.HttpContext.Current.Request.UserHostAddress);
            }

            var sender = System.IO.Path.GetFileName(file) + ":" + line.ToString();
            CommonLib.Log.CustomLog.Write(sender, type, msg.ToArray());
        }

        /// <summary>
        /// 使用禁止
        /// </summary>
        public class DUMMY { }
    }
}
