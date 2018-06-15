using ProRadServiceLib.IComparer;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using TryDb;

namespace ProRadServiceLib
{
    //LOCAL
    partial class LCL
    {
        //スタディ一覧の取得
        public static void GetStudyList(FindParam prm, out List<StudyTag> tags, out int count)
        {
            tags = new List<StudyTag>();
            count = 0;

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    var sbWhere = new StringBuilder();
                    sbWhere.Append(" WHERE 0=0");

                    if (prm.PatientID != null && prm.PatientID.Length > 0)
                    {
                        sbWhere.Append(" AND T_Study.PatientID ILIKE " + cmd.Add(prm.PatientID.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.PatientName != null && prm.PatientName.Length > 0)
                    {
                        sbWhere.Append(" AND T_Study.PatientName ILIKE " + cmd.Add(prm.PatientName.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.AccessionNumber != null && prm.AccessionNumber.Length > 0)
                    {
                        sbWhere.Append(" AND AccessionNumber ILIKE " + cmd.Add(prm.AccessionNumber.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.Modality != null && prm.Modality.Length > 0)
                    {
                        int idx = 0;
                        foreach (var mod in prm.Modality.Split(' '))
                        {
                            if (idx == 0)
                            {
                                sbWhere.Append(" AND (Modality ILIKE " + cmd.Add("%" + mod + "%").ParameterName);
                            }
                            else
                            {
                                sbWhere.Append(" OR Modality ILIKE " + cmd.Add("%" + mod + "%").ParameterName);
                            }
                            idx++;
                        }
                        sbWhere.Append(")");
                    }

                    if (prm.StudyDateFrom != null && prm.StudyDateFrom.Length > 0)
                    {
                        sbWhere.Append(" AND StudyDate>=" + cmd.Add(prm.StudyDateFrom).ParameterName);
                    }

                    if (prm.StudyDateTo != null && prm.StudyDateTo.Length > 0)
                    {
                        sbWhere.Append(" AND StudyDate<=" + cmd.Add(prm.StudyDateTo).ParameterName);
                    }

                    if (prm.Comment != null && prm.Comment.Length > 0)
                    {
                        sbWhere.Append(" AND Comment ILIKE " + cmd.Add(prm.Comment.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.Keyword != null && prm.Keyword.Length > 0)
                    {
                        sbWhere.Append(" AND Keyword ILIKE " + cmd.Add(prm.Keyword.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    sbWhere.Append(" AND NumberOfImages>0");

                    string top = "";
                    if (AppUtil.MaxStudyList > 0)
                    {
                        top = string.Format(" LIMIT {0}", AppUtil.MaxStudyList);
                    }

                    var sb = new StringBuilder();
                    sb.Append("SELECT COUNT(*) cnt FROM T_Study");
                    sb.Append(sbWhere.ToString() + ";");
                    sb.Append("SELECT StudyInstanceUID,StudyDate,StudyTime,AccessionNumber,Modality,StudyDescription,T_Study.PatientName,T_Study.PatientID,PatientBirthDate,PatientSex,PatientAge,BodyPartExamined,Comment,Keyword,NumberOfImages,T_Patient.PatientName PatientName2");
                    sb.Append(" FROM T_Study LEFT JOIN T_Patient ON T_Study.PatientID=T_Patient.PatientID");
                    sb.Append(sbWhere.ToString());
                    sb.Append(" ORDER BY StudyDate DESC,StudyTime DESC,StudyInstanceUID");
                    sb.Append(top);

                    cmd.CommandText = sb.ToString();

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            count = Convert.ToInt32(dr["cnt"]);
                            if (count > 0)
                            {
                                dr.NextResult();
                                while (dr.Read())
                                {
                                    var stkey = new StudyKey()
                                    {
                                        StudyInstanceUID = (string)dr["StudyInstanceUID"]
                                    };

                                    var tag = new StudyTag();
                                    tag.StudyKey = ConvertUtil.Serialize(stkey);

                                    if (dr["StudyDate"] != DBNull.Value)
                                        tag.StudyDate = (string)dr["StudyDate"];

                                    if (dr["StudyTime"] != DBNull.Value)
                                        tag.StudyTime = (string)dr["StudyTime"];

                                    if (dr["AccessionNumber"] != DBNull.Value)
                                        tag.AccessionNumber = (string)dr["AccessionNumber"];

                                    if (dr["Modality"] != DBNull.Value)
                                        tag.Modality = (string)dr["Modality"];

                                    if (dr["StudyDescription"] != DBNull.Value)
                                        tag.StudyDescription = (string)dr["StudyDescription"];

                                    if (dr["PatientName"] != DBNull.Value)
                                        tag.PatientName = (string)dr["PatientName"];

                                    if (dr["PatientName2"] != DBNull.Value)
                                        tag.PatientName = (string)dr["PatientName2"];

                                    if (AppUtil.HideData == "1")
                                        tag.PatientName = "";

                                    if (dr["PatientID"] != DBNull.Value)
                                        tag.PatientID = (string)dr["PatientID"];

                                    if (dr["PatientBirthDate"] != DBNull.Value)
                                        tag.PatientBirthDate = (string)dr["PatientBirthDate"];

                                    if (dr["PatientSex"] != DBNull.Value)
                                        tag.PatientSex = (string)dr["PatientSex"];

                                    if (dr["PatientAge"] != DBNull.Value)
                                        tag.PatientAge = (string)dr["PatientAge"];

                                    if (dr["BodyPartExamined"] != DBNull.Value)
                                        tag.BodyPartExamined = (string)dr["BodyPartExamined"];

                                    if (dr["Comment"] != DBNull.Value)
                                        tag.Comment = (string)dr["Comment"];

                                    if (dr["Keyword"] != DBNull.Value)
                                        tag.Keyword = (string)dr["Keyword"];

                                    if (dr["NumberOfImages"] != DBNull.Value)
                                        tag.NumberOfImages = (int)dr["NumberOfImages"];

                                    //メモ有無
                                    using (var cmd2 = db.CreateCommand())
                                    {
                                        cmd2.CommandText = "SELECT COUNT(*) cnt FROM T_StudyMemo WHERE StudyInstanceUID=@0";
                                        cmd2.Add((string)dr["StudyInstanceUID"]);

                                        using (var dr2 = cmd2.ExecuteReader())
                                        {
                                            if (dr2.Read())
                                            {
                                                tag.StudyMemoUmu = Convert.ToInt32(dr2["cnt"]);
                                            }
                                        }
                                    }

                                    tags.Add(tag);
                                }
                            }
                        }
                    }
                }
            }

            //ソートしない;
        }

        //スタディ一覧の取得 (過去検査)
        public static void GetStudyList_Kako(string patientid, StudyKey key, out List<StudyTag> tags)
        {
            tags = new List<StudyTag>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    var sb = new StringBuilder();
                    sb.Append("SELECT StudyInstanceUID,StudyDate,StudyTime,AccessionNumber,Modality,StudyDescription,T_Study.PatientName,T_Study.PatientID,PatientBirthDate,PatientSex,PatientAge,BodyPartExamined,Comment,Keyword,NumberOfImages,T_Patient.PatientName PatientName2");
                    sb.Append(" FROM T_Study LEFT JOIN T_Patient ON T_Study.PatientID=T_Patient.PatientID");

                    if (patientid.Trim() == "")
                    {
                        sb.Append(" WHERE StudyInstanceUID=" + cmd.Add(key.StudyInstanceUID).ParameterName);
                    }
                    else
                    {
                        sb.Append(" WHERE T_Study.PatientID=" + cmd.Add(patientid).ParameterName);
                    }

                    sb.Append(" AND NumberOfImages>0");
                    sb.Append(" ORDER BY StudyDate DESC,StudyTime DESC,StudyInstanceUID");

                    cmd.CommandText = sb.ToString();

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var stkey = new StudyKey()
                            {
                                StudyInstanceUID = (string)dr["StudyInstanceUID"]
                            };

                            var tag = new StudyTag();
                            tag.StudyKey = ConvertUtil.Serialize(stkey);

                            if (dr["StudyDate"] != DBNull.Value)
                                tag.StudyDate = (string)dr["StudyDate"];

                            if (dr["StudyTime"] != DBNull.Value)
                                tag.StudyTime = (string)dr["StudyTime"];

                            if (dr["AccessionNumber"] != DBNull.Value)
                                tag.AccessionNumber = (string)dr["AccessionNumber"];

                            if (dr["Modality"] != DBNull.Value)
                                tag.Modality = (string)dr["Modality"];

                            if (dr["StudyDescription"] != DBNull.Value)
                                tag.StudyDescription = (string)dr["StudyDescription"];

                            if (dr["PatientName"] != DBNull.Value)
                                tag.PatientName = (string)dr["PatientName"];

                            if (dr["PatientName2"] != DBNull.Value)
                                tag.PatientName = (string)dr["PatientName2"];

                            if (AppUtil.HideData == "1")
                                tag.PatientName = "";

                            if (dr["PatientID"] != DBNull.Value)
                                tag.PatientID = (string)dr["PatientID"];

                            if (dr["PatientBirthDate"] != DBNull.Value)
                                tag.PatientBirthDate = (string)dr["PatientBirthDate"];

                            if (dr["PatientSex"] != DBNull.Value)
                                tag.PatientSex = (string)dr["PatientSex"];

                            if (dr["PatientAge"] != DBNull.Value)
                                tag.PatientAge = (string)dr["PatientAge"];

                            if (dr["BodyPartExamined"] != DBNull.Value)
                                tag.BodyPartExamined = (string)dr["BodyPartExamined"];

                            if (dr["Comment"] != DBNull.Value)
                                tag.Comment = (string)dr["Comment"];

                            if (dr["Keyword"] != DBNull.Value)
                                tag.Keyword = (string)dr["Keyword"];

                            if (dr["NumberOfImages"] != DBNull.Value)
                                tag.NumberOfImages = (int)dr["NumberOfImages"];

                            //メモ有無
                            using (var cmd2 = db.CreateCommand())
                            {
                                cmd2.CommandText = "SELECT COUNT(*) cnt FROM T_StudyMemo WHERE StudyInstanceUID=@0";
                                cmd2.Add((string)dr["StudyInstanceUID"]);

                                using (var dr2 = cmd2.ExecuteReader())
                                {
                                    if (dr2.Read())
                                    {
                                        tag.StudyMemoUmu = Convert.ToInt32(dr2["cnt"]);
                                    }
                                }
                            }

                            tags.Add(tag);
                        }
                    }
                }
            }

            //ソート不要
            //tags.Sort(new StudyTagComparer());
        }

        //スタディの取得 (URLコール用)
        public static bool GetStudyKey(FindParam prm, out string patientid, out List<string> studykey)
        {
            patientid = "";
            studykey = new List<string>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    var sbWhere = new StringBuilder();
                    sbWhere.Append(" WHERE 0=0");

                    if (prm.PatientID != null && prm.PatientID.Length > 0)
                    {
                        sbWhere.Append(" AND T_Study.PatientID ILIKE " + cmd.Add(prm.PatientID.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.PatientName != null && prm.PatientName.Length > 0)
                    {
                        sbWhere.Append(" AND T_Study.PatientName ILIKE " + cmd.Add(prm.PatientName.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.AccessionNumber != null && prm.AccessionNumber.Length > 0)
                    {
                        sbWhere.Append(" AND AccessionNumber ILIKE " + cmd.Add(prm.AccessionNumber.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.Modality != null && prm.Modality.Length > 0)
                    {
                        var mods = new StringBuilder();
                        foreach (var mod in prm.Modality.Split(' '))
                        {
                            if (mod == "") continue;
                            mods.Append(cmd.Add(mod.ToUpper()).ParameterName);
                            mods.Append(',');
                        }
                        sbWhere.Append(" AND Modality IN (" + mods.ToString().TrimEnd(',') + ")");
                    }

                    if (prm.StudyDateFrom != null && prm.StudyDateFrom.Length > 0)
                    {
                        sbWhere.Append(" AND StudyDate>=" + cmd.Add(prm.StudyDateFrom).ParameterName);
                    }

                    if (prm.StudyDateTo != null && prm.StudyDateTo.Length > 0)
                    {
                        sbWhere.Append(" AND StudyDate<=" + cmd.Add(prm.StudyDateTo).ParameterName);
                    }

                    if (prm.Comment != null && prm.Comment.Length > 0)
                    {
                        sbWhere.Append(" AND Comment ILIKE " + cmd.Add(prm.Comment.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.Keyword != null && prm.Keyword.Length > 0)
                    {
                        sbWhere.Append(" AND Keyword ILIKE " + cmd.Add(prm.Keyword.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    sbWhere.Append(" AND NumberOfImages>0");

                    var sb = new StringBuilder();
                    sb.Append("SELECT StudyInstanceUID,PatientID");
                    sb.Append(" FROM T_Study");
                    sb.Append(sbWhere.ToString());
                    sb.Append(" ORDER BY StudyDate DESC,StudyTime DESC,StudyInstanceUID");

                    cmd.CommandText = sb.ToString();

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var key = new StudyKey()
                            {
                                StudyInstanceUID = (string)dr["StudyInstanceUID"]
                            };
                            studykey.Add(ConvertUtil.Serialize(key));

                            string tmp = "";
                            if (dr["PatientID"] != DBNull.Value)
                                tmp = (string)dr["PatientID"];

                            if (studykey.Count == 1)
                            {
                                patientid = tmp;
                            }
                            else
                            {
                                if (patientid != tmp)
                                {
                                    patientid = null;
                                    studykey = null;
                                    return false;
                                }
                            }
                        }
                    }
                }
            }

            return true;
        }

        //シリーズ一覧の取得
        public static void GetSeriesList(StudyKey key, out List<SeriesTag> tags)
        {
            tags = new List<SeriesTag>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    var sb = new StringBuilder();
                    sb.Append("SELECT SeriesInstanceUID,SOPInstanceUID,Modality,SeriesDescription,SeriesNumber,NumberOfImages,NumberOfFrames,StorageID");
                    sb.Append(" FROM T_Series");
                    sb.Append(" WHERE StudyInstanceUID=@0");

                    cmd.CommandText = sb.ToString();
                    cmd.Add(key.StudyInstanceUID);

                    //シリーズ
                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            //無視するモダリティ
                            if (Array.IndexOf(AppUtil.SkipModality, (string)dr["Modality"]) >= 0)
                                continue;

                            string seriesUid = (string)dr["SeriesInstanceUID"];
                            int noi = (int)dr["NumberOfImages"];
                            int nof = (int)dr["NumberOfFrames"];

                            int cnt = 0;
                            if (nof > noi)
                            {
                                //ウォーターラインのチェック
                                using (var cmd2 = db.CreateCommand())
                                {
                                    cmd2.CommandText = "SELECT COUNT(*) FROM T_Image WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1";
                                    cmd2.Add(key.StudyInstanceUID);
                                    cmd2.Add(seriesUid);

                                    cnt = Convert.ToInt32(cmd2.ExecuteScalar());
                                }
                            }

                            //マルチフレームでない or 画像がない
                            if (cnt == 0)
                            {
                                var sekey = new SeriesKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = seriesUid,
                                    SOPInstanceUID = (string)dr["SOPInstanceUID"],
                                    StorageID = (string)dr["StorageID"],
                                    IsImage = false
                                };

                                var tag = new SeriesTag();
                                tag.SeriesKey = ConvertUtil.Serialize(sekey);
                                tag.Modality = (string)dr["Modality"];
                                tag.SeriesDescription = (string)dr["SeriesDescription"];
                                tag.SeriesNumber = (long)dr["SeriesNumber"];
                                tag.NumberOfImages = noi;
                                tag.NumberOfFrames = noi;

                                //ソート用
                                tag.SeriesInstanceUID = seriesUid;

                                //GSPS
                                using (var cmd3 = db.CreateCommand())
                                {
                                    cmd3.CommandText = "SELECT COUNT(*) FROM T_GSPS_R WHERE StudyInstanceUID=@0 AND ReferencedSeriesInstanceUID=@1";
                                    cmd3.Add(key.StudyInstanceUID);
                                    cmd3.Add(seriesUid);

                                    var gsps = Convert.ToInt32(cmd3.ExecuteScalar());
                                    tag.IsGSPS = gsps > 0 ? true : false;
                                }

                                tags.Add(tag);
                            }
                            else
                            {
                                //マルチフレーム
                                using (var cmd2 = db.CreateCommand())
                                {
                                    cmd2.CommandText = "SELECT SOPInstanceUID,InstanceNumber,NumberOfFrames,StorageID FROM T_Image WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1";
                                    cmd2.Add(key.StudyInstanceUID);
                                    cmd2.Add(seriesUid);

                                    using (var dr2 = cmd2.ExecuteReader())
                                    {
                                        while (dr2.Read())
                                        {
                                            var sekey = new SeriesKey()
                                            {
                                                StudyInstanceUID = key.StudyInstanceUID,
                                                SeriesInstanceUID = seriesUid,
                                                SOPInstanceUID = (string)dr2["SOPInstanceUID"],
                                                StorageID = (string)dr2["StorageID"],
                                                IsImage = true
                                            };

                                            var tag = new SeriesTag();
                                            tag.SeriesKey = ConvertUtil.Serialize(sekey);
                                            tag.Modality = (string)dr["Modality"];
                                            tag.SeriesDescription = (string)dr["SeriesDescription"];
                                            tag.SeriesNumber = (long)dr["SeriesNumber"];
                                            tag.NumberOfImages = 1;
                                            tag.NumberOfFrames = (int)dr2["NumberOfFrames"];

                                            //ソート用
                                            tag.SeriesInstanceUID = seriesUid;
                                            tag.SOPInstanceUID = (string)dr2["SOPInstanceUID"];
                                            tag.InstanceNumber = (long)dr2["InstanceNumber"];

                                            //GSPS
                                            using (var cmd3 = db.CreateCommand())
                                            {
                                                cmd3.CommandText = "SELECT COUNT(*) FROM T_GSPS_R WHERE StudyInstanceUID=@0 AND ReferencedSeriesInstanceUID=@1 AND ReferencedSOPInstanceUID=@2";
                                                cmd3.Add(key.StudyInstanceUID);
                                                cmd3.Add(seriesUid);
                                                cmd3.Add((string)dr2["SOPInstanceUID"]);

                                                var gsps = Convert.ToInt32(cmd3.ExecuteScalar());
                                                tag.IsGSPS = gsps > 0 ? true : false;
                                            }

                                            tags.Add(tag);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            //ソート
            tags.Sort(new SeriesTagComparer());
        }

        //画像一覧の取得
        public static void GetImageList(SeriesKey key, out List<ImageTag> tags)
        {
            tags = new List<ImageTag>();

            using (var db = new TryDbConnection(settings))
            {
                if (!key.IsImage)
                {
                    using (var cmd = db.CreateCommand())
                    {
                        var sb = new StringBuilder();
                        sb.Append("SELECT SOPInstanceUID,InstanceNumber,SliceThickness,ImagePositionPatient,ImageOrientationPatient,SliceLocation,Rows,Columns,PixelSpacing,WindowCenter,WindowWidth,StorageID");
                        sb.Append(" FROM T_Image");
                        sb.Append(" WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1");

                        cmd.CommandText = sb.ToString();
                        cmd.Add(key.StudyInstanceUID);
                        cmd.Add(key.SeriesInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                var imkey = new ImageKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = key.SeriesInstanceUID,
                                    SOPInstanceUID = (string)dr["SOPInstanceUID"],
                                    StorageID = (string)dr["StorageID"]
                                };

                                var tag = new ImageTag();
                                tag.ImageKey = ConvertUtil.Serialize(imkey);
                                tag.InstanceNumber = (long)dr["InstanceNumber"];
                                tag.SliceThickness = (string)dr["SliceThickness"];
                                tag.ImagePositionPatient = (string)dr["ImagePositionPatient"];
                                tag.ImageOrientationPatient = (string)dr["ImageOrientationPatient"];
                                tag.SliceLocation = (string)dr["SliceLocation"];
                                tag.Rows = (int)dr["Rows"];
                                tag.Columns = (int)dr["Columns"];
                                tag.PixelSpacing = (string)dr["PixelSpacing"];
                                tag.WindowCenter = (string)dr["WindowCenter"];
                                tag.WindowWidth = (string)dr["WindowWidth"];

                                //ソート用
                                tag.SOPInstanceUID = (string)dr["SOPInstanceUID"];

                                tags.Add(tag);
                            }
                        }
                    }

                    //ソート
                    tags.Sort(new ImageTagComparer());
                }
                else
                {
                    using (var cmd = db.CreateCommand())
                    {
                        var sb = new StringBuilder();
                        sb.Append("SELECT NumberOfFrames,SliceThickness,ImagePositionPatient,ImageOrientationPatient,SliceLocation,Rows,Columns,PixelSpacing,WindowCenter,WindowWidth,StorageID");
                        sb.Append(" FROM T_Image");
                        sb.Append(" WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1 AND SOPInstanceUID=@2");

                        cmd.CommandText = sb.ToString();
                        cmd.Add(key.StudyInstanceUID);
                        cmd.Add(key.SeriesInstanceUID);
                        cmd.Add(key.SOPInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                int frames = (int)dr["NumberOfFrames"];
                                for (int i = 0; i < frames; i++)
                                {
                                    var imkey = new ImageKey()
                                    {
                                        StudyInstanceUID = key.StudyInstanceUID,
                                        SeriesInstanceUID = key.SeriesInstanceUID,
                                        SOPInstanceUID = key.SOPInstanceUID,
                                        FrameNumber = i,
                                        StorageID = (string)dr["StorageID"]
                                    };

                                    var tag = new ImageTag();
                                    tag.ImageKey = ConvertUtil.Serialize(imkey);
                                    tag.InstanceNumber = i;
                                    tag.SliceThickness = (string)dr["SliceThickness"];
                                    tag.ImagePositionPatient = (string)dr["ImagePositionPatient"];
                                    tag.ImageOrientationPatient = (string)dr["ImageOrientationPatient"];
                                    tag.SliceLocation = (string)dr["SliceLocation"];
                                    tag.Rows = (int)dr["Rows"];
                                    tag.Columns = (int)dr["Columns"];
                                    tag.PixelSpacing = (string)dr["PixelSpacing"];
                                    tag.WindowCenter = (string)dr["WindowCenter"];
                                    tag.WindowWidth = (string)dr["WindowWidth"];
                                    tag.NumberOfFrames = frames;

                                    tags.Add(tag);
                                }
                            }
                        }
                    }
                }
            }
        }

        //サムネイルの取得
        public static void GetThumbnail(SeriesKey key, out byte[] thumb)
        {
            thumb = null;

            var sto = DbCacheUtil.GetStorage(key.StorageID);
            using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
            {
                var dicomFile = FileUtil.GetDicomFile(key);
                if (File.Exists(dicomFile))
                {
                    DicomUtil.DicomToThumb(dicomFile, out thumb);
                }
            }
        }

        //StorageIDの取得 (DCM用)
        public static void GetImageStorageID(ref SeriesKey key)
        {
            if (key.StorageID != null && key.StorageID != "")
                return;

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT StorageID FROM T_Image WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1 AND SOPInstanceUID=@2";
                    cmd.Add(key.StudyInstanceUID);
                    cmd.Add(key.SeriesInstanceUID);
                    cmd.Add(key.SOPInstanceUID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            key.StorageID = (string)dr["StorageID"];
                        }
                    }
                }
            }
        }

        //コメントの設定
        public static bool SetComment(StudyKey key, string item)
        {
            for (int i = 0; i < AppUtil.RetryCount; i++)
            {
                string err = "";

                using (var db = new TryDbConnection(settings))
                {
                    db.BeginTransaction();
                    try
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE T_Study SET Comment=@1 WHERE StudyInstanceUID=@0";
                            cmd.Add(key.StudyInstanceUID);
                            cmd.Add(item);

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

        //キーワードの設定
        public static bool SetKeyword(StudyKey key, string item)
        {
            for (int i = 0; i < AppUtil.RetryCount; i++)
            {
                string err = "";

                using (var db = new TryDbConnection(settings))
                {
                    db.BeginTransaction();
                    try
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "UPDATE T_Study SET Keyword=@1 WHERE StudyInstanceUID=@0";
                            cmd.Add(key.StudyInstanceUID);
                            cmd.Add(item);

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

        //レポート連携情報取得
        public static void GetReportInfo(StudyKey key, out StudyTag tag)
        {
            tag = new StudyTag();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT AccessionNumber,PatientID,StudyDate,StudyTime,Modality FROM T_Study WHERE StudyInstanceUID=@0";
                    cmd.Add(key.StudyInstanceUID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            tag.AccessionNumber = (string)dr["AccessionNumber"];
                            tag.PatientID = (string)dr["PatientID"];
                            tag.StudyDate = (string)dr["StudyDate"];
                            tag.StudyTime = (string)dr["StudyTime"];
                            tag.Modality = (string)dr["Modality"];
                        }
                    }
                }
            }
        }

        //スタディの削除
        public static bool DelStudy(StudyKey key, out List<string> items)
        {
            items = new List<string>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand())
                {
                    cmd.CommandText = "SELECT DISTINCT StorageID FROM T_Image WHERE StudyInstanceUID=@0";
                    cmd.Add(key.StudyInstanceUID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            items.Add((string)dr["StorageID"]);
                        }
                    }
                }
            }

            for (int i = 0; i < AppUtil.RetryCount; i++)
            {
                using (var db = new TryDbConnection(settings))
                {
                    db.BeginTransaction();
                    try
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "DELETE FROM T_Study WHERE StudyInstanceUID=@0";
                            cmd.Add(key.StudyInstanceUID);

                            cmd.ExecuteNonQuery();
                        }

                        db.Commit();
                        return true;
                    }
                    catch (Exception ex)
                    {
                        db.Rollback();
                        LogUtil.Warn(ex);
                    }
                }

                //リトライ
                if (i < AppUtil.RetryCount - 1)
                {
                    System.Threading.Thread.Sleep(AppUtil.SleepTime);
                    LogUtil.Info1("RETRY:{0}", i + 1);
                }
                else
                {
                    LogUtil.Error1("STUDY削除:失敗 [{0}]", key.StudyInstanceUID);
                    return false;
                }
            }

            return true;
        }
    }
}
