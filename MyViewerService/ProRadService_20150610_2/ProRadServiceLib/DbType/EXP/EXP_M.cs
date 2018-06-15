using System;
using TryDb;

namespace ProRadServiceLib
{
    //Exporter
    //  GroupID   ：""
    //  UserID    ：USER_ID
    //  StorageID ：Web.configより
    partial class EXP
    {
        public static void Login(string loginID, string password, out string SID)
        {
            SID = null;

            var now = DateTime.Now;
            string loginPW = null;

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT PASSWORD FROM UserTbl WHERE USER_ID=@0";
                    cmd.Add(loginID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            loginPW = (string)dr["PASSWORD"];
                        }
                        else
                        {
                            return;
                        }
                    }
                }
            }

            //ログインチェック
            if (loginPW == password)
            {
                using (var db = new TryDbConnection(LCL.settings))
                {
                    db.BeginTransaction();
                    try
                    {
                        string sid = null;
                        lock (typeof(LCL))
                        {
                            var len = new Random(Environment.TickCount).Next(8, 16);
                            sid = System.Web.Security.Membership.GeneratePassword(len, 0);
                        }

                        //有効期限の作成
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "INSERT INTO M_Login(SID,GroupID,UserID,StorageID,TimeLimit) VALUES(@0,@1,@2,@3,@4)";
                            cmd.Add(sid);
                            cmd.Add("");
                            cmd.Add(loginID);
                            cmd.Add("");
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
        }

        public static void LoginUrl(string loginID, out string SID)
        {
            SID = null;
            var now = DateTime.Now;

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT PASSWORD FROM UserTbl WHERE USER_ID=@0";
                    cmd.Add(loginID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                        }
                        else
                        {
                            return;
                        }
                    }
                }
            }

            using (var db = new TryDbConnection(LCL.settings))
            {
                db.BeginTransaction();
                try
                {
                    string sid = null;
                    lock (typeof(LCL))
                    {
                        var len = new Random(Environment.TickCount).Next(8, 16);
                        sid = System.Web.Security.Membership.GeneratePassword(len, 0);
                    }

                    //有効期限の作成
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "INSERT INTO M_Login(SID,GroupID,UserID,StorageID,TimeLimit) VALUES(@0,@1,@2,@3,@4)";
                        cmd.Add(sid);
                        cmd.Add("");
                        cmd.Add(loginID);
                        cmd.Add("");
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
    }
}
