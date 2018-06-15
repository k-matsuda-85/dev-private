using System;
using System.Collections.Generic;
using TryDb;

namespace ProRadServiceLib
{
    //LOCAL
    partial class LCL
    {
        //検査メモの取得
        public static void GetStudyMemo(StudyKey key, out StudyMemoItem item, out int histCount)
        {
            item = null;
            histCount = 0;

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT MemoDate,Memo,UserName FROM T_StudyMemo WHERE StudyInstanceUID=@0";
                    cmd.Add(key.StudyInstanceUID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            item = new StudyMemoItem();
                            item.Memo = (string)dr["Memo"];
                            item.UserName = (string)dr["UserName"];
                            item.MemoDate = (DateTime)dr["MemoDate"];
                        }
                    }
                }

                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT COUNT(*) cnt FROM T_StudyMemoHistory WHERE StudyInstanceUID=@0";
                    cmd.Add(key.StudyInstanceUID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            histCount = Convert.ToInt32(dr["cnt"]);
                        }
                    }
                }
            }
        }

        //検査メモ履歴の取得
        public static void GetStudyMemoHistory(StudyKey key, out List<StudyMemoItem> items)
        {
            items = new List<StudyMemoItem>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT MemoDate,Memo,UserName FROM T_StudyMemoHistory WHERE StudyInstanceUID=@0 ORDER BY MemoDate DESC";
                    cmd.Add(key.StudyInstanceUID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var item = new StudyMemoItem();
                            item.Memo = (string)dr["Memo"];
                            item.UserName = (string)dr["UserName"];
                            item.MemoDate = (DateTime)dr["MemoDate"];

                            items.Add(item);
                        }
                    }
                }
            }
        }

        //検査メモの設定
        public static bool SetStudyMemo(StudyKey key, StudyMemoItem item)
        {
            for (int i = 0; i < AppUtil.RetryCount; i++)
            {
                string err = "";
                var now = DateTime.Now;

                using (var db = new TryDbConnection(settings))
                {
                    db.BeginTransaction();
                    try
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "DELETE FROM T_StudyMemo WHERE StudyInstanceUID=@0";
                            cmd.Add(key.StudyInstanceUID);

                            cmd.ExecuteNonQuery();
                        }

                        if (item.Memo.Trim() != "")
                        {
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "INSERT INTO T_StudyMemo(StudyInstanceUID,MemoDate,Memo,UserName) VALUES(@0,@1,@2,@3)";
                                cmd.Add(key.StudyInstanceUID);
                                cmd.Add(now);
                                cmd.Add(item.Memo);
                                cmd.Add(item.UserName);

                                cmd.ExecuteNonQuery();
                            }
                        }

                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "INSERT INTO T_StudyMemoHistory(StudyInstanceUID,MemoDate,Memo,UserName) VALUES(@0,@1,@2,@3)";
                            cmd.Add(key.StudyInstanceUID);
                            cmd.Add(now);
                            cmd.Add(item.Memo);
                            cmd.Add(item.UserName);

                            cmd.ExecuteNonQuery();
                        }

                        db.Commit();
                        return true;
                    }
                    catch (Exception ex)
                    {
                        db.Rollback();
                        err = ex.ToString();
                    }
                }

                //リトライ
                if (i < AppUtil.RetryCount - 1)
                {
                    System.Threading.Thread.Sleep(AppUtil.SleepTime);
                }
                else
                {
                    LogUtil.Error(err);
                }
            }

            return false;
        }

        //GSPS一覧の取得
        public static void GetGspsList(SeriesKey key, out List<GSPSItem> items)
        {
            items = new List<GSPSItem>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    if (!key.IsImage)
                    {
                        cmd.CommandText = "SELECT DISTINCT ContentLabel,ContentDescription,PresentationCreationDate,PresentationCreationTime,ContentCreatorName FROM T_GSPS_R WHERE StudyInstanceUID=@0 AND ReferencedSeriesInstanceUID=@1 ORDER BY PresentationCreationDate DESC,PresentationCreationTime DESC";
                        cmd.Add(key.StudyInstanceUID);
                        cmd.Add(key.SeriesInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                var gspskey = new GSPSKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    ReferencedSeriesInstanceUID = key.SeriesInstanceUID,
                                    ReferencedSOPInstanceUID = "",
                                    ContentLabel = (string)dr["ContentLabel"],
                                };

                                var item = new GSPSItem();
                                item.GSPSKey = ConvertUtil.Serialize(gspskey);
                                item.ContentLabel = (string)dr["ContentLabel"];
                                item.ContentDescription = (string)dr["ContentDescription"];
                                item.PresentationCreationDate = (string)dr["PresentationCreationDate"];
                                item.PresentationCreationTime = (string)dr["PresentationCreationTime"];
                                item.ContentCreatorName = (string)dr["ContentCreatorName"];

                                items.Add(item);
                            }
                        }
                    }
                    else
                    {
                        cmd.CommandText = "SELECT DISTINCT ContentLabel,ContentDescription,PresentationCreationDate,PresentationCreationTime,ContentCreatorName FROM T_GSPS_R WHERE StudyInstanceUID=@0 AND ReferencedSeriesInstanceUID=@1 AND ReferencedSOPInstanceUID=@2 ORDER BY PresentationCreationDate DESC,PresentationCreationTime DESC";
                        cmd.Add(key.StudyInstanceUID);
                        cmd.Add(key.SeriesInstanceUID);
                        cmd.Add(key.SOPInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                var gspskey = new GSPSKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    ReferencedSeriesInstanceUID = key.SeriesInstanceUID,
                                    ReferencedSOPInstanceUID = key.SOPInstanceUID,
                                    ContentLabel = (string)dr["ContentLabel"],
                                };

                                var item = new GSPSItem();
                                item.GSPSKey = ConvertUtil.Serialize(gspskey);
                                item.ContentLabel = (string)dr["ContentLabel"];
                                item.ContentDescription = (string)dr["ContentDescription"];
                                item.PresentationCreationDate = (string)dr["PresentationCreationDate"];
                                item.PresentationCreationTime = (string)dr["PresentationCreationTime"];
                                item.ContentCreatorName = (string)dr["ContentCreatorName"];

                                items.Add(item);
                            }
                        }
                    }
                }
            }
        }

        //GSPSの取得
        public static void GetGsps(GSPSKey key, out List<ImageKey> items)
        {
            items = new List<ImageKey>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    if (key.ReferencedSOPInstanceUID == "")
                    {
                        cmd.CommandText = "SELECT DISTINCT SeriesInstanceUID,SOPInstanceUID,StorageID FROM T_GSPS_R WHERE StudyInstanceUID=@0 AND ReferencedSeriesInstanceUID=@1 AND ContentLabel=@2";
                        cmd.Add(key.StudyInstanceUID);
                        cmd.Add(key.ReferencedSeriesInstanceUID);
                        cmd.Add(key.ContentLabel);
                    }
                    else
                    {
                        cmd.CommandText = "SELECT DISTINCT SeriesInstanceUID,SOPInstanceUID,StorageID FROM T_GSPS_R WHERE StudyInstanceUID=@0 AND ReferencedSeriesInstanceUID=@1 AND ReferencedSOPInstanceUID=@2 AND ContentLabel=@3";
                        cmd.Add(key.StudyInstanceUID);
                        cmd.Add(key.ReferencedSeriesInstanceUID);
                        cmd.Add(key.ReferencedSOPInstanceUID);
                        cmd.Add(key.ContentLabel);
                    }
                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var imkey = new ImageKey()
                            {
                                StudyInstanceUID = key.StudyInstanceUID,
                                SeriesInstanceUID = (string)dr["SeriesInstanceUID"],
                                SOPInstanceUID = (string)dr["SOPInstanceUID"],
                                StorageID = (string)dr["StorageID"]
                            };

                            items.Add(imkey);
                        }
                    }
                }
            }
        }
    }
}
