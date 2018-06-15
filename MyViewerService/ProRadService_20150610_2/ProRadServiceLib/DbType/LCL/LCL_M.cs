using System;
using System.Collections.Generic;
using System.Text;
using TryDb;

namespace ProRadServiceLib
{
    //LOCAL
    partial class LCL
    {
        public static void LoginCheck(string SID, out LoginItem item)
        {
            item = null;

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT * FROM M_Login WHERE SID=@0";
                    cmd.Add(SID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            //有効期限チェック
                            var limit = (DateTime)dr["TimeLimit"];
                            if (limit >= DateTime.Now)
                            {
                                item = new LoginItem();
                                item.GroupID = (string)dr["GroupID"];
                                item.UserID = (string)dr["UserID"];
                                item.UserName = (string)dr["UserName"];
                                item.StorageID = (string)dr["StorageID"];
                                item.IsAdmin = (int)dr["IsAdmin"];
                            }
                        }
                    }
                }
            }

            if (item == null)
            {
                LogUtil.Warn1("NOT LOGIN [{0}]", SID);
            }
        }

        public static void Login(string loginID, string password, string flag, out string SID, out string UserID, out int IsAdmin)
        {
            SID = null;
            UserID = null;
            IsAdmin = 0;

            const string AdminFlag = "1";
            var now = DateTime.Now;

            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    string groupID = null;
                    string userID = null;
                    string userName = null;
                    string loginPW = null;
                    int lockoutCount = 0;
                    DateTime lastLockoutDate;
                    int isAdmin = 0;

                    using (var cmd = db.CreateCommand())
                    {
                        if (flag == AdminFlag)
                        {
                            cmd.CommandText = "SELECT * FROM M_User WHERE lower(LoginID)=@0 AND InvalidFlag=0 AND IsAdmin>=1";
                            cmd.Add(loginID.ToLower());
                        }
                        else
                        {
                            cmd.CommandText = "SELECT * FROM M_User WHERE lower(LoginID)=@0 AND InvalidFlag=0";
                            cmd.Add(loginID.ToLower());
                        }

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                groupID = (string)dr["GroupID"];
                                userID = (string)dr["UserID"];
                                userName = (string)dr["UserName"];
                                loginPW = (string)dr["LoginPW"];
                                lockoutCount = (int)dr["LockoutCount"];
                                lastLockoutDate = (DateTime)dr["LastLockoutDate"];
                                isAdmin = (int)dr["IsAdmin"];
                            }
                            else
                            {
                                LogUtil.Warn1("ログイン不正 [{0}]", loginID);
                                return;
                            }
                        }
                    }

                    //ロックアウトの期間
                    if (lockoutCount > AppUtil.LockoutThreshold)
                    {
                        if (AppUtil.LockoutDuration == 0 || lastLockoutDate.AddMinutes(AppUtil.LockoutDuration) > now)
                        {
                            LogUtil.Warn1("ログイン不正 [{0}]", loginID);
                            return;
                        }
                    }

                    //ロックアウトのリセット期間
                    if (AppUtil.LockoutReset > 0)
                    {
                        if (lastLockoutDate.AddMinutes(AppUtil.LockoutReset) < now)
                        {
                            lockoutCount = 0;
                        }
                    }

                    string sysID = "";
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT ConfigValue FROM M_ServerConfig WHERE ConfigKey='SystemID'";

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                sysID = (string)dr["ConfigValue"];
                            }
                        }
                    }

                    string sid = null;

                    //ログインチェック
                    if (loginPW == CryptoUtil.PasswordString(password, userID, sysID))
                    {
                        lockoutCount = 0;

                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE M_User SET LockoutCount=@1,LastLoginDate=@2 WHERE UserID=@0";
                            cmd.Add(userID);
                            cmd.Add(lockoutCount);
                            cmd.Add(now);

                            cmd.ExecuteNonQuery();
                        }

                        lock (typeof(LCL))
                        {
                            var len = new Random(Environment.TickCount).Next(16, 24);
                            sid = System.Web.Security.Membership.GeneratePassword(len, 0);
                        }

                        //有効期限の作成
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "INSERT INTO M_Login(SID,GroupID,UserID,UserName,IsAdmin,TimeLimit) VALUES(@0,@1,@2,@3,@4,@5)";
                            cmd.Add(sid);
                            cmd.Add(groupID);
                            cmd.Add(userID);
                            cmd.Add(userName);
                            cmd.Add(isAdmin);
                            cmd.Add(now.AddHours(AppUtil.TimeLimit));

                            cmd.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        if (AppUtil.LockoutThreshold > 0)
                        {
                            lockoutCount++;
                        }

                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE M_User SET LockoutCount=@1,LastLockoutDate=@2 WHERE UserID=@0";
                            cmd.Add(userID);
                            cmd.Add(lockoutCount);
                            cmd.Add(now);

                            cmd.ExecuteNonQuery();
                        }
                    }

                    db.Commit();

                    SID = sid;
                    UserID = userID;
                    IsAdmin = isAdmin;
                }
                catch (Exception ex)
                {
                    db.Rollback();
                    LogUtil.Error(ex.ToString());
                }
            }
        }

        public static void LoginUrl(string loginID, out string SID)
        {
            SID = null;
            var now = DateTime.Now;

            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    string groupID = null;
                    string userID = null;
                    string loginPW = null;
                    int isAdmin = 0;

                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT * FROM M_User WHERE lower(LoginID)=@0 AND InvalidFlag=0";
                        cmd.Add(loginID.ToLower());

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                groupID = (string)dr["GroupID"];
                                userID = (string)dr["UserID"];
                                loginPW = (string)dr["LoginPW"];
                                isAdmin = (int)dr["IsAdmin"];
                            }
                            else
                            {
                                LogUtil.Warn1("ログイン不正 [{0}]", loginID);
                                return;
                            }
                        }
                    }

                    string sid = null;

                    lock (typeof(LCL))
                    {
                        var len = new Random(Environment.TickCount).Next(16, 24);
                        sid = System.Web.Security.Membership.GeneratePassword(len, 0);
                    }

                    //有効期限の作成
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "INSERT INTO M_Login(SID,GroupID,UserID,IsAdmin,TimeLimit) VALUES(@0,@1,@2,@3,@4)";
                        cmd.Add(sid);
                        cmd.Add(groupID);
                        cmd.Add(userID);
                        cmd.Add(isAdmin);
                        cmd.Add(now.AddHours(AppUtil.TimeLimit));

                        cmd.ExecuteNonQuery();
                    }

                    db.Commit();

                    SID = sid;
                }
                catch (Exception ex)
                {
                    db.Rollback();
                    LogUtil.Error(ex.ToString());
                }
            }
        }

        //有効期限が過ぎたデータの削除
        public static void DelLogin()
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "DELETE FROM M_Login WHERE TimeLimit<@0";
                        cmd.Add(DateTime.Now);

                        cmd.ExecuteNonQuery();
                    }
                    db.Commit();
                }
                catch (Exception ex)
                {
                    db.Rollback();
                    LogUtil.Error(ex.ToString());
                }
            }
        }

        public static void GetUserConfig(LoginItem login, out Dictionary<string, string> items)
        {
            items = new Dictionary<string, string>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT ConfigKey,ConfigValue FROM M_SystemConfig";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            items.Add((string)dr["ConfigKey"], (string)dr["ConfigValue"]);
                        }
                    }
                }

                if (login.GroupID != "")
                {
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT ConfigKey,ConfigValue FROM M_GroupConfig WHERE GroupID=@0";
                        cmd.Add(login.GroupID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                if (items.ContainsKey((string)dr["ConfigKey"]))
                                {
                                    items[(string)dr["ConfigKey"]] = (string)dr["ConfigValue"];
                                }
                                else
                                {
                                    items.Add((string)dr["ConfigKey"], (string)dr["ConfigValue"]);
                                }
                            }
                        }
                    }
                }

                if (login.UserID != "")
                {
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT ConfigKey,ConfigValue FROM M_UserConfig WHERE UserID=@0";
                        cmd.Add(login.UserID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                if (items.ContainsKey((string)dr["ConfigKey"]))
                                {
                                    items[(string)dr["ConfigKey"]] = (string)dr["ConfigValue"];
                                }
                                else
                                {
                                    items.Add((string)dr["ConfigKey"], (string)dr["ConfigValue"]);
                                }
                            }
                        }
                    }

                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT UserName FROM M_User WHERE UserID=@0";
                        cmd.Add(login.UserID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                if (items.ContainsKey("UserName"))
                                {
                                    items["UserName"] = (string)dr["UserName"];
                                }
                                else
                                {
                                    items.Add("UserName", (string)dr["UserName"]);
                                }
                            }
                        }
                    }
                }
            }
        }

        public static bool SetUserPassword(string UserID, string Password, string NewPassword)
        {
            var now = DateTime.Now;

            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    string loginPW = null;
                    int lockoutCount = 0;
                    DateTime lastLockoutDate;

                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT * FROM M_User WHERE UserID=@0 AND InvalidFlag=0";
                        cmd.Add(UserID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                loginPW = (string)dr["LoginPW"];
                                lockoutCount = (int)dr["LockoutCount"];
                                lastLockoutDate = (DateTime)dr["LastLockoutDate"];
                            }
                            else
                            {
                                LogUtil.Warn1("ユーザ不正 [{0}]", UserID);
                                return false;
                            }
                        }
                    }

                    //ロックアウトの期間
                    if (lockoutCount > AppUtil.LockoutThreshold)
                    {
                        if (AppUtil.LockoutDuration == 0 || lastLockoutDate.AddMinutes(AppUtil.LockoutDuration) > now)
                        {
                            LogUtil.Warn1("ユーザ不正 [{0}]", UserID);
                            return false;
                        }
                    }

                    //ロックアウトのリセット期間
                    if (AppUtil.LockoutReset > 0)
                    {
                        if (lastLockoutDate.AddMinutes(AppUtil.LockoutReset) < now)
                        {
                            lockoutCount = 0;
                        }
                    }

                    string sysID = "";
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT ConfigValue FROM M_ServerConfig WHERE ConfigKey='SystemID'";

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                sysID = (string)dr["ConfigValue"];
                            }
                        }
                    }

                    //ログインチェック
                    if (loginPW == CryptoUtil.PasswordString(Password, UserID, sysID))
                    {
                        lockoutCount = 0;

                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE M_User SET LoginPW=@1,LockoutCount=@2 WHERE UserID=@0";
                            cmd.Add(UserID);
                            cmd.Add(CryptoUtil.PasswordString(NewPassword, UserID, sysID));
                            cmd.Add(lockoutCount);

                            cmd.ExecuteNonQuery();
                        }

                        db.Commit();
                        return true;
                    }
                    else
                    {
                        if (AppUtil.LockoutThreshold > 0)
                        {
                            lockoutCount++;
                        }

                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE M_User SET LockoutCount=@1,LastLockoutDate=@2 WHERE UserID=@0";
                            cmd.Add(UserID);
                            cmd.Add(lockoutCount);
                            cmd.Add(now);

                            cmd.ExecuteNonQuery();
                        }

                        db.Commit();
                        LogUtil.Warn1("パスワード不正 [{0}]", UserID);
                        return false;
                    }
                }
                catch (Exception ex)
                {
                    db.Rollback();
                    LogUtil.Error(ex.ToString());
                    LogUtil.Error1("パスワード変更エラー [{0}]", UserID);
                    return false;
                }
            }
        }

        public static void GetModalityConfig(LoginItem login, out Dictionary<string, Dictionary<string, string>> items)
        {
            items = new Dictionary<string, Dictionary<string, string>>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT ConfigKey,ConfigValue FROM M_ModalityConfig WHERE GroupID='' AND Modality=''";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            items.Add((string)dr["ConfigKey"], new Dictionary<string, string>() { { "", (string)dr["ConfigValue"] } });
                        }
                    }
                }

                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT Modality,ConfigKey,ConfigValue FROM M_ModalityConfig WHERE GroupID='' AND Modality!=''";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            items[(string)dr["ConfigKey"]].Add((string)dr["Modality"], (string)dr["ConfigValue"]);
                        }
                    }
                }

                if (login.GroupID != "")
                {
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT ConfigKey,ConfigValue FROM M_ModalityConfig WHERE GroupID=@0 AND Modality=''";
                        cmd.Add(login.GroupID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                items[(string)dr["ConfigKey"]][""] = (string)dr["ConfigValue"];
                            }
                        }
                    }

                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT Modality,ConfigKey,ConfigValue FROM M_ModalityConfig WHERE GroupID=@0 AND Modality!=''";
                        cmd.Add(login.GroupID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                if (items[(string)dr["ConfigKey"]].ContainsKey((string)dr["Modality"]))
                                {
                                    items[(string)dr["ConfigKey"]][(string)dr["Modality"]] = (string)dr["ConfigValue"];
                                }
                                else
                                {
                                    items[(string)dr["ConfigKey"]].Add((string)dr["Modality"], (string)dr["ConfigValue"]);
                                }
                            }
                        }
                    }
                }
            }
        }

        public static void GetAnnotationList(LoginItem login, out List<AnnotationItem> items)
        {
            items = new List<AnnotationItem>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT * FROM M_Annotation WHERE GroupID='' ORDER BY Modality,Position,SeqNo";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            AnnotationItem item = new AnnotationItem();
                            item.Modality = (string)dr["Modality"];
                            item.Position = (int)dr["Position"];
                            item.Format = (string)dr["Format"];
                            item.Tag = (string)dr["Tag"];
                            item.FontSize = (string)dr["FontSize"];
                            item.FontStyle = (string)dr["FontStyle"];

                            items.Add(item);
                        }
                    }
                }

                if (login.GroupID != "")
                {
                    var items2 = new List<AnnotationItem>();

                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT * FROM M_Annotation WHERE GroupID=@0 ORDER BY Modality,Position,SeqNo";
                        cmd.Add(login.GroupID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AnnotationItem item = new AnnotationItem();
                                item.Modality = (string)dr["Modality"];
                                item.Position = (int)dr["Position"];
                                item.Format = (string)dr["Format"];
                                item.Tag = (string)dr["Tag"];
                                item.FontSize = (string)dr["FontSize"];
                                item.FontStyle = (string)dr["FontStyle"];

                                items2.Add(item);
                            }
                        }
                    }

                    if (items2.Count > 0)
                        items = items2;
                }
            }
        }

        //ストレージ情報の取得
        public static void GetStorageList(out List<StorageItem> items)
        {
            items = new List<StorageItem>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT StorageID,DicomPath,LogonUsername,LogonPassword,Priority FROM M_Storage ORDER BY Priority";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var item = new StorageItem();
                            item.StorageID = (string)dr["StorageID"];
                            item.DicomPath = (string)dr["DicomPath"];
                            item.LogonUsername = (string)dr["LogonUsername"];
                            item.LogonPassword = (string)dr["LogonPassword"];
                            item.Priority = (int)dr["Priority"];

                            items.Add(item);
                        }
                    }
                }
            }
        }

        //ユーザ設定の保存
        public static void SetUserConfig(string UserID, Dictionary<string, string> items)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    foreach (var kv in items)
                    {
                        if (kv.Value != null)
                        {
                            string val = null;
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "SELECT ConfigValue FROM M_UserConfig WHERE UserID=@0 AND ConfigKey=@1";
                                cmd.Add(UserID);
                                cmd.Add(kv.Key);

                                using (var dr = cmd.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        val = (string)dr["ConfigValue"];
                                    }
                                }
                            }

                            if (val == kv.Value)
                                continue;

                            using (var cmd = db.CreateCommand())
                            {
                                if (val == null)
                                {
                                    cmd.CommandText = "INSERT INTO M_UserConfig(UserID,ConfigKey,ConfigValue) VALUES(@0,@1,@2)";
                                }
                                else
                                {
                                    cmd.CommandText = "UPDATE M_UserConfig SET ConfigValue=@2 WHERE UserID=@0 AND ConfigKey=@1";
                                }
                                cmd.Add(UserID);
                                cmd.Add(kv.Key);
                                cmd.Add(kv.Value);

                                cmd.ExecuteNonQuery();
                            }
                        }
                        else
                        {
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "DELETE FROM M_UserConfig WHERE UserID=@0 AND ConfigKey=@1";
                                cmd.Add(UserID);
                                cmd.Add(kv.Key);

                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                    db.Commit();
                }
                catch (Exception ex)
                {
                    db.Rollback();
                    LogUtil.Error(ex);
                }
            }
        }

        //LoginIDのチェック
        public static void CheckLoginID(string LoginID, out bool used)
        {
            used = false;

            using (var db = new TryDbConnection(settings))
            {
                int cnt = 0;
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT count(*) FROM M_User WHERE lower(LoginID)=@0";
                    cmd.Add(LoginID.ToLower());

                    cnt = Convert.ToInt32(cmd.ExecuteScalar());
                }

                used = (cnt == 1) ? true : false;
            }
        }

        //採番マスタの取得
        public static void GetSaiban(string SaibanID, out string item)
        {
            item = null;

            if (SaibanID == null || SaibanID == "")
                throw new ArgumentException("設定がありません", "SaibanID");

            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    int saiban = -1;
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT Saiban FROM M_Saiban WHERE SaibanID=@0";
                        cmd.Add(SaibanID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                saiban = (int)dr["Saiban"];
                            }
                        }
                    }

                    using (var cmd = db.CreateCommand())
                    {
                        if (saiban == -1)
                        {
                            cmd.CommandText = "INSERT INTO M_Saiban(SaibanID,Saiban) VALUES(@0,@1)";
                            saiban = 1;
                        }
                        else
                        {
                            cmd.CommandText = "UPDATE M_Saiban SET Saiban=@1 WHERE SaibanID=@0";
                            saiban++;
                        }
                        cmd.Add(SaibanID);
                        cmd.Add(saiban);

                        cmd.ExecuteNonQuery();
                    }

                    item = string.Format("{0}_{1}", SaibanID, saiban);
                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }

        //サーバー設定の取得
        public static void GetServerConfig(out Dictionary<string, string> items)
        {
            items = new Dictionary<string, string>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT ConfigKey,ConfigValue FROM M_ServerConfig";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            items.Add((string)dr["ConfigKey"], (string)dr["ConfigValue"]);
                        }
                    }
                }
            }
        }

        //サーバー設定マスタの取得
        public static void GetMServerConfig(out Dictionary<string, Tuple<string, string>> items)
        {
            items = new Dictionary<string, Tuple<string, string>>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT ConfigKey,ConfigValue,ConfigTitle FROM M_ServerConfig";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            items.Add((string)dr["ConfigKey"], Tuple.Create((string)dr["ConfigValue"], (string)dr["ConfigTitle"]));
                        }
                    }
                }
            }
        }

        //サーバー設定マスタの保存
        public static void SetMServerConfig(Dictionary<string, string> items)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    foreach (var kv in items)
                    {
                        if (kv.Value != null)
                        {
                            string val = null;
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "SELECT ConfigValue FROM M_ServerConfig WHERE ConfigKey=@0";
                                cmd.Add(kv.Key);

                                using (var dr = cmd.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        val = (string)dr["ConfigValue"];
                                    }
                                }
                            }

                            if (val == null || val == kv.Value)
                                continue;

                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "UPDATE M_ServerConfig SET ConfigValue=@1 WHERE ConfigKey=@0";
                                cmd.Add(kv.Key);
                                cmd.Add(kv.Value);

                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }

        //システム設定マスタの取得
        public static void GetMSystemConfig(out Dictionary<string, Tuple<string, string>> items)
        {
            items = new Dictionary<string, Tuple<string, string>>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT ConfigKey,ConfigValue,ConfigTitle FROM M_SystemConfig";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            items.Add((string)dr["ConfigKey"], Tuple.Create((string)dr["ConfigValue"], (string)dr["ConfigTitle"]));
                        }
                    }
                }
            }
        }

        //システム設定マスタの保存
        public static void SetMSystemConfig(Dictionary<string, string> items)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    foreach (var kv in items)
                    {
                        if (kv.Value != null)
                        {
                            string val = null;
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "SELECT ConfigValue FROM M_SystemConfig WHERE ConfigKey=@0";
                                cmd.Add(kv.Key);

                                using (var dr = cmd.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        val = (string)dr["ConfigValue"];
                                    }
                                }
                            }

                            if (val == null || val == kv.Value)
                                continue;

                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "UPDATE M_SystemConfig SET ConfigValue=@1 WHERE ConfigKey=@0";
                                cmd.Add(kv.Key);
                                cmd.Add(kv.Value);

                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }

        //グループ情報マスタの取得
        public static void GetMGroup(out List<MGroupItem> items)
        {
            items = new List<MGroupItem>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT * FROM M_Group";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var item = new MGroupItem();
                            item.GroupID = (string)dr["GroupID"];
                            item.GroupName = (string)dr["GroupName"];

                            items.Add(item);
                        }
                    }
                }
            }
        }

        //グループ情報マスタの保存
        public static void SetMGroup(MGroupItem item, DbActionType type)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    if (type != DbActionType.Delete)
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            if (type == DbActionType.Insert)
                            {
                                cmd.CommandText = "INSERT INTO M_Group(GroupID,GroupName) VALUES(@0,@1)";
                            }
                            else
                            {
                                cmd.CommandText = "UPDATE M_Group SET GroupName=@1 WHERE GroupID=@0";
                            }
                            cmd.Add(item.GroupID);
                            cmd.Add(item.GroupName);

                            cmd.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "DELETE FROM M_Group WHERE GroupID=@0";
                            cmd.Add(item.GroupID);

                            cmd.ExecuteNonQuery();
                        }
                    }

                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }

        //グループ設定マスタの取得
        public static void GetMGroupConfig(string GroupID, out Dictionary<string, string> items)
        {
            items = new Dictionary<string, string>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT ConfigKey,ConfigValue FROM M_GroupConfig WHERE GroupID=@0";
                    cmd.Add(GroupID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            if (items.ContainsKey((string)dr["ConfigKey"]))
                            {
                                items[(string)dr["ConfigKey"]] = (string)dr["ConfigValue"];
                            }
                            else
                            {
                                items.Add((string)dr["ConfigKey"], (string)dr["ConfigValue"]);
                            }
                        }
                    }
                }
            }
        }

        //グループ設定マスタの保存
        public static void SetMGroupConfig(string GroupID, Dictionary<string, string> items)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    foreach (var kv in items)
                    {
                        if (kv.Value != null)
                        {
                            string val = null;
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "SELECT ConfigValue FROM M_GroupConfig WHERE GroupID=@0 AND ConfigKey=@1";
                                cmd.Add(GroupID);
                                cmd.Add(kv.Key);

                                using (var dr = cmd.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        val = (string)dr["ConfigValue"];
                                    }
                                }
                            }

                            if (val == kv.Value)
                                continue;

                            using (var cmd = db.CreateCommand())
                            {
                                if (val == null)
                                {
                                    cmd.CommandText = "INSERT INTO M_GroupConfig(GroupID,ConfigKey,ConfigValue) VALUES(@0,@1,@2)";
                                }
                                else
                                {
                                    cmd.CommandText = "UPDATE M_GroupConfig SET ConfigValue=@2 WHERE GroupID=@0 AND ConfigKey=@1";
                                }
                                cmd.Add(GroupID);
                                cmd.Add(kv.Key);
                                cmd.Add(kv.Value);

                                cmd.ExecuteNonQuery();
                            }
                        }
                        else
                        {
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "DELETE FROM M_GroupConfig WHERE GroupID=@0 AND ConfigKey=@1";
                                cmd.Add(GroupID);
                                cmd.Add(kv.Key);

                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }

        //ユーザ情報マスタの取得
        public static void GetMUser(int IsAdmin, out List<MUserItem> items)
        {
            items = new List<MUserItem>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT * FROM M_User WHERE IsAdmin<=@0 ORDER BY UserID";
                    cmd.Add(IsAdmin);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var item = new MUserItem();
                            item.GroupID = (string)dr["GroupID"];
                            item.UserID = (string)dr["UserID"];
                            item.UserName = (string)dr["UserName"];
                            item.LoginID = (string)dr["LoginID"];

                            item.IsAdmin = (int)dr["IsAdmin"];
                            item.InvalidFlag = ((int)dr["InvalidFlag"] == 0) ? false : true;
                            item.LockoutFlag = ((int)dr["LockoutCount"] > AppUtil.LockoutThreshold) ? true : false;

                            item.LastLoginDate = (DateTime)dr["LastLoginDate"];

                            items.Add(item);
                        }
                    }
                }
            }
        }

        //ユーザ情報マスタの保存
        public static void SetMUser(MUserItem item, DbActionType type)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    if (type != DbActionType.Delete)
                    {
                        string sysID = "";
                        if (item.LoginPW != null && item.LoginPW != "")
                        {
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "SELECT ConfigValue FROM M_ServerConfig WHERE ConfigKey='SystemID'";

                                using (var dr = cmd.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        sysID = (string)dr["ConfigValue"];
                                    }
                                }
                            }
                        }

                        using (var cmd = db.CreateCommand())
                        {
                            cmd.Add(item.UserID);
                            cmd.Add(item.GroupID);
                            cmd.Add(item.UserName);
                            cmd.Add(item.IsAdmin);
                            cmd.Add(item.LockoutFlag ? AppUtil.LockoutThreshold + 1 : 0);
                            cmd.Add(item.InvalidFlag ? 1 : 0);

                            if (type == DbActionType.Insert)
                            {
                                cmd.CommandText = "INSERT INTO M_User(UserID,GroupID,UserName,IsAdmin,LockoutCount,InvalidFlag,LoginID,LoginPW) VALUES(@0,@1,@2,@3,@4,@5,@6,@7)";
                                cmd.Add(item.LoginID);
                                cmd.Add(CryptoUtil.PasswordString(item.LoginPW, item.UserID, sysID));
                            }
                            else
                            {
                                var sbSET = new StringBuilder();
                                if (item.LoginID != null && item.LoginID != "")
                                {
                                    sbSET.Append(",LoginID=" + cmd.Add(item.LoginID).ParameterName);
                                }
                                if (item.LoginPW != null && item.LoginPW != "")
                                {
                                    sbSET.Append(",LoginPW=" + cmd.Add(CryptoUtil.PasswordString(item.LoginPW, item.UserID, sysID)).ParameterName);
                                }

                                var sb = new StringBuilder();
                                sb.Append("UPDATE M_User SET GroupID=@1,UserName=@2,IsAdmin=@3,LockoutCount=@4,InvalidFlag=@5");
                                sb.Append(sbSET.ToString());
                                sb.Append(" WHERE UserID=@0");

                                cmd.CommandText = sb.ToString();
                            }

                            cmd.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "DELETE FROM M_User WHERE UserID=@0";
                            cmd.Add(item.UserID);

                            cmd.ExecuteNonQuery();
                        }
                    }

                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }

        //ユーザ設定マスタの取得
        public static void GetMUserConfig(string UserID, out Dictionary<string, string> items)
        {
            items = new Dictionary<string, string>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT ConfigKey,ConfigValue FROM M_UserConfig WHERE UserID=@0";
                    cmd.Add(UserID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            if (items.ContainsKey((string)dr["ConfigKey"]))
                            {
                                items[(string)dr["ConfigKey"]] = (string)dr["ConfigValue"];
                            }
                            else
                            {
                                items.Add((string)dr["ConfigKey"], (string)dr["ConfigValue"]);
                            }
                        }
                    }
                }
            }
        }

        //ユーザ設定マスタの保存
        public static void SetMUserConfig(string UserID, Dictionary<string, string> items)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    foreach (var kv in items)
                    {
                        if (kv.Value != null)
                        {
                            string val = null;
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "SELECT ConfigValue FROM M_UserConfig WHERE UserID=@0 AND ConfigKey=@1";
                                cmd.Add(UserID);
                                cmd.Add(kv.Key);

                                using (var dr = cmd.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        val = (string)dr["ConfigValue"];
                                    }
                                }
                            }

                            if (val == kv.Value)
                                continue;

                            using (var cmd = db.CreateCommand())
                            {
                                if (val == null)
                                {
                                    cmd.CommandText = "INSERT INTO M_UserConfig(UserID,ConfigKey,ConfigValue) VALUES(@0,@1,@2)";
                                }
                                else
                                {
                                    cmd.CommandText = "UPDATE M_UserConfig SET ConfigValue=@2 WHERE UserID=@0 AND ConfigKey=@1";
                                }
                                cmd.Add(UserID);
                                cmd.Add(kv.Key);
                                cmd.Add(kv.Value);

                                cmd.ExecuteNonQuery();
                            }
                        }
                        else
                        {
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "DELETE FROM M_UserConfig WHERE UserID=@0 AND ConfigKey=@1";
                                cmd.Add(UserID);
                                cmd.Add(kv.Key);

                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }

        //ストレージ情報マスタの取得
        public static void GetMStorage(out List<MStorageItem> items)
        {
            items = new List<MStorageItem>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT * FROM M_Storage";

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var item = new MStorageItem();
                            item.StorageID = (string)dr["StorageID"];
                            item.DicomPath = (string)dr["DicomPath"];
                            item.Priority = (int)dr["Priority"];
                            item.LogonUsername = (string)dr["LogonUsername"];
                            item.LogonPassword = (string)dr["LogonPassword"];

                            items.Add(item);
                        }
                    }
                }
            }
        }

        //ストレージ情報マスタの保存
        public static void SetMStorage(MStorageItem item, DbActionType type)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    if (type != DbActionType.Delete)
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            if (type == DbActionType.Insert)
                            {
                                cmd.CommandText = "INSERT INTO M_Storage(StorageID,DicomPath,Priority,LogonUsername,LogonPassword) VALUES(@0,@1,@2,@3,@4)";
                            }
                            else
                            {
                                cmd.CommandText = "UPDATE M_Storage SET DicomPath=@1,Priority=@2,LogonUsername=@3,LogonPassword=@4 WHERE StorageID=@0";
                            }
                            cmd.Add(item.StorageID);
                            cmd.Add(item.DicomPath);
                            cmd.Add(item.Priority);
                            cmd.Add(item.LogonUsername);
                            cmd.Add(item.LogonPassword);

                            cmd.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "DELETE FROM M_Storage WHERE StorageID=@0";
                            cmd.Add(item.StorageID);

                            cmd.ExecuteNonQuery();
                        }
                    }

                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }

        //モダリティ設定マスタのモダリティ取得
        public static void GetMModalityConfig_Modality(string GroupID, out List<string> items)
        {
            items = new List<string>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT DISTINCT Modality FROM M_ModalityConfig WHERE GroupID=@0 AND Modality != ''";
                    cmd.Add(GroupID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            items.Add((string)dr["Modality"]);
                        }
                    }
                }
            }
        }

        //モダリティ設定マスタの取得
        public static void GetMModalityConfig(string GroupID, string Modality, out Dictionary<string, Tuple<string, string>> items)
        {
            items = new Dictionary<string, Tuple<string, string>>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT ConfigKey,ConfigValue,ConfigTitle FROM M_ModalityConfig WHERE GroupID=@0 AND Modality=@1";
                    cmd.Add(GroupID);
                    cmd.Add(Modality);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            string title = "";
                            if (dr["ConfigTitle"] != DBNull.Value)
                                title = (string)dr["ConfigTitle"];

                            if (items.ContainsKey((string)dr["ConfigKey"]))
                            {
                                items[(string)dr["ConfigKey"]] = Tuple.Create((string)dr["ConfigValue"], title);
                            }
                            else
                            {
                                items.Add((string)dr["ConfigKey"], Tuple.Create((string)dr["ConfigValue"], title));
                            }
                        }
                    }
                }
            }
        }

        //モダリティ設定マスタの保存
        public static void SetMModalityConfig(string GroupID, string Modality, Dictionary<string, string> items)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    foreach (var kv in items)
                    {
                        if (kv.Value != null)
                        {
                            string val = null;
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "SELECT ConfigValue FROM M_ModalityConfig WHERE GroupID=@0 AND Modality=@1 AND ConfigKey=@2";
                                cmd.Add(GroupID);
                                cmd.Add(Modality);
                                cmd.Add(kv.Key);

                                using (var dr = cmd.ExecuteReader())
                                {
                                    if (dr.Read())
                                    {
                                        val = (string)dr["ConfigValue"];
                                    }
                                }
                            }

                            if (val == kv.Value)
                                continue;

                            using (var cmd = db.CreateCommand())
                            {
                                if (val == null)
                                {
                                    cmd.CommandText = "INSERT INTO M_ModalityConfig(GroupID,Modality,ConfigKey,ConfigValue) VALUES(@0,@1,@2,@3)";
                                }
                                else
                                {
                                    cmd.CommandText = "UPDATE M_ModalityConfig SET ConfigValue=@3 WHERE GroupID=@0 AND Modality=@1 AND ConfigKey=@2";
                                }
                                cmd.Add(GroupID);
                                cmd.Add(Modality);
                                cmd.Add(kv.Key);
                                cmd.Add(kv.Value);

                                cmd.ExecuteNonQuery();
                            }
                        }
                        else
                        {
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "DELETE FROM M_ModalityConfig WHERE GroupID=@0 AND Modality=@1 AND ConfigKey=@2";
                                cmd.Add(GroupID);
                                cmd.Add(Modality);
                                cmd.Add(kv.Key);

                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }

        //アノテーション設定マスタのモダリティ取得
        public static void GetMAnnotation_Modality(string GroupID, out List<string> items)
        {
            items = new List<string>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT DISTINCT Modality FROM M_Annotation WHERE GroupID=@0 AND Modality != ''";
                    cmd.Add(GroupID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            items.Add((string)dr["Modality"]);
                        }
                    }
                }
            }
        }

        //アノテーション設定マスタの取得
        public static void GetMAnnotation(string GroupID, string Modality, out List<AnnotationItem> items)
        {
            items = new List<AnnotationItem>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT * FROM M_Annotation WHERE GroupID=@0 AND Modality=@1 Order By Position,SeqNo";
                    cmd.Add(GroupID);
                    cmd.Add(Modality);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var item = new AnnotationItem();
                            item.Modality = (string)dr["Modality"];
                            item.Position = (int)dr["Position"];
                            item.Format = (string)dr["Format"];
                            item.Tag = (string)dr["Tag"];
                            item.FontSize = (string)dr["FontSize"];
                            item.FontStyle = (string)dr["FontStyle"];

                            items.Add(item);
                        }
                    }
                }
            }
        }

        //アノテーション設定マスタの保存
        public static void SetMAnnotation(string GroupID, string Modality, List<AnnotationItem> items)
        {
            using (var db = new TryDbConnection(settings))
            {
                db.BeginTransaction();
                try
                {
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "DELETE FROM M_Annotation WHERE GroupID=@0 AND Modality=@1";
                        cmd.Add(GroupID);
                        cmd.Add(Modality);

                        cmd.ExecuteNonQuery();
                    }

                    if (items != null)
                    {
                        int no = 0;
                        foreach (var item in items)
                        {
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "INSERT INTO M_Annotation(GroupID,Modality,Position,SeqNo,Format,Tag,FontSize,FontStyle) VALUES(@0,@1,@2,@3,@4,@5,@6,@7)";
                                cmd.Add(GroupID);
                                cmd.Add(Modality);
                                cmd.Add(item.Position);
                                cmd.Add(no++);
                                cmd.Add(item.Format);
                                cmd.Add(item.Tag);
                                cmd.Add(item.FontSize);
                                cmd.Add(item.FontStyle);

                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                    db.Commit();
                }
                catch
                {
                    db.Rollback();
                    throw;
                }
            }
        }
    }
}
