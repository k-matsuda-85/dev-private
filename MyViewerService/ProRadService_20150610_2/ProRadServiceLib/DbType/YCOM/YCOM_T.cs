using DcmUtil.Extensions;
using DicomAnalyzer;
using ProRadServiceLib.IComparer;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using TryDb;
using YComLib;

namespace ProRadServiceLib
{
    partial class YCOM
    {
        static object ycomServerLock = new object();
        static Dictionary<string, YcomStoreServer> ycomServer = new Dictionary<string, YcomStoreServer>();

        //スタディ一覧の取得
        public static void GetStudyList(FindParam prm, out List<StudyTag> tags, out int count)
        {
            tags = new List<StudyTag>();
            count = 0;

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand(":"))
                {
                    var sbWhere = new StringBuilder();
                    sbWhere.Append(" WHERE 0=0");

                    if (prm.PatientID != null && prm.PatientID != "")
                    {
                        sbWhere.Append(" AND PatientID LIKE " + cmd.Add(prm.PatientID.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.PatientName != null && prm.PatientName != "")
                    {
                        sbWhere.Append(" AND PatientName LIKE " + cmd.Add(prm.PatientName.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.AccessionNumber != null && prm.AccessionNumber != "")
                    {
                        sbWhere.Append(" AND AccessionNumber LIKE " + cmd.Add(prm.AccessionNumber.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                    }

                    if (prm.Modality != null && prm.Modality != "")
                    {
                        int idx = 0;
                        foreach (var mod in prm.Modality.Split(' '))
                        {
                            if (idx == 0)
                            {
                                sbWhere.Append(" AND (Modality LIKE " + cmd.Add("%" + mod + "%").ParameterName);
                                idx++;
                            }
                            else
                            {
                                sbWhere.Append(" OR Modality LIKE " + cmd.Add("%" + mod + "%").ParameterName);
                            }
                        }
                        sbWhere.Append(")");
                    }

                    if (prm.StudyDateFrom != null && prm.StudyDateFrom != "")
                    {
                        DateTime dt = DateTime.ParseExact(prm.StudyDateFrom, "yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo, System.Globalization.DateTimeStyles.None);
                        sbWhere.Append(" AND StudyDate>=" + cmd.Add(dt).ParameterName);
                    }

                    if (prm.StudyDateTo != null && prm.StudyDateTo != "")
                    {
                        DateTime dt = DateTime.ParseExact(prm.StudyDateTo, "yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo, System.Globalization.DateTimeStyles.None);
                        sbWhere.Append(" AND StudyDate<=" + cmd.Add(dt).ParameterName);
                    }

                    var sb = new StringBuilder();
                    sb.Append("SELECT COUNT(*) FROM MasterStudy");
                    sb.Append(sbWhere.ToString());

                    cmd.CommandText = sb.ToString();

                    count = (int)(decimal)cmd.ExecuteScalar();
                }

                if (count > 0)
                {
                    using (var cmd = db.CreateCommand(":"))
                    {
                        var sbWhere = new StringBuilder();
                        sbWhere.Append(" WHERE 0=0");

                        if (prm.PatientID != null && prm.PatientID != "")
                        {
                            sbWhere.Append(" AND PatientID LIKE " + cmd.Add(prm.PatientID.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                        }

                        if (prm.PatientName != null && prm.PatientName != "")
                        {
                            sbWhere.Append(" AND PatientName LIKE " + cmd.Add(prm.PatientName.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                        }

                        if (prm.AccessionNumber != null && prm.AccessionNumber != "")
                        {
                            sbWhere.Append(" AND AccessionNumber LIKE " + cmd.Add(prm.AccessionNumber.Replace(@"\", @"\\").Replace("%", @"\%").Replace("_", @"\_").Replace('*', '%').Replace('?', '_')).ParameterName);
                        }

                        if (prm.Modality != null && prm.Modality != "")
                        {
                            int idx = 0;
                            foreach (var mod in prm.Modality.Split(' '))
                            {
                                if (idx == 0)
                                {
                                    sbWhere.Append(" AND (Modality LIKE " + cmd.Add("%" + mod + "%").ParameterName);
                                    idx++;
                                }
                                else
                                {
                                    sbWhere.Append(" OR Modality LIKE " + cmd.Add("%" + mod + "%").ParameterName);
                                }
                            }
                            sbWhere.Append(")");
                        }

                        if (prm.StudyDateFrom != null && prm.StudyDateFrom != "")
                        {
                            DateTime dt = DateTime.ParseExact(prm.StudyDateFrom, "yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo, System.Globalization.DateTimeStyles.None);
                            sbWhere.Append(" AND StudyDate>=" + cmd.Add(dt).ParameterName);
                        }

                        if (prm.StudyDateTo != null && prm.StudyDateTo != "")
                        {
                            DateTime dt = DateTime.ParseExact(prm.StudyDateTo, "yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo, System.Globalization.DateTimeStyles.None);
                            sbWhere.Append(" AND StudyDate<=" + cmd.Add(dt).ParameterName);
                        }

                        string top = "";
                        if (AppUtil.MaxStudyList > 0)
                        {
                            top = string.Format(" WHERE ROWNUM <= {0}", AppUtil.MaxStudyList);
                        }

                        var sb = new StringBuilder();
                        sb.Append("SELECT * FROM (");
                        sb.Append("SELECT /*+ INDEX(MasterStudy I_PATIENTID) INDEX(MasterStudy I_PATIENTNAME) INDEX(MasterStudy I_ACCESSIONNUMBER) */ StudyInstanceUID,StudyDate,StudyTime,AccessionNumber,Modality,StudyDescription,PatientName,PatientID,PatientBirthDate,PatientSex,BodyPartExamined,StuImagesNum");
                        sb.Append(" FROM MasterStudy");
                        sb.Append(sbWhere.ToString());
                        sb.Append(" ORDER BY StudyDate DESC,StudyTime DESC,StudyInstanceUID)");
                        sb.Append(top);

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
                                    tag.StudyDate = ((DateTime)dr["StudyDate"]).ToString("yyyyMMdd");

                                if (dr["StudyTime"] != DBNull.Value)
                                    tag.StudyTime = string.Format("{0:000000}", Math.Floor((double)dr["StudyTime"]));

                                if (dr["AccessionNumber"] != DBNull.Value)
                                    tag.AccessionNumber = (string)dr["AccessionNumber"];

                                if (dr["Modality"] != DBNull.Value)
                                    tag.Modality = (string)dr["Modality"];

                                if (dr["StudyDescription"] != DBNull.Value)
                                    tag.StudyDescription = (string)dr["StudyDescription"];

                                if (dr["PatientName"] != DBNull.Value)
                                    tag.PatientName = (string)dr["PatientName"];

                                if (AppUtil.HideData == "1")
                                    tag.PatientName = "";

                                if (dr["PatientID"] != DBNull.Value)
                                    tag.PatientID = (string)dr["PatientID"];

                                if (dr["PatientBirthDate"] != DBNull.Value)
                                    tag.PatientBirthDate = ((DateTime)dr["PatientBirthDate"]).ToString("yyyyMMdd");

                                if (dr["PatientSex"] != DBNull.Value)
                                    tag.PatientSex = (string)dr["PatientSex"];

                                //検査部位
                                using (var cmd2 = db.CreateCommand(":"))
                                {
                                    cmd2.CommandText = "SELECT /*+ INDEX(MasterSeries I_STUDYINSTANCEUID) */ BodyPartExamined FROM MasterSeries WHERE StudyInstanceUID=:0";
                                    cmd2.Add((string)dr["StudyInstanceUID"]);

                                    using (var dr2 = cmd2.ExecuteReader())
                                    {
                                        var BodyPart = new List<string>();

                                        while (dr2.Read())
                                        {
                                            if (dr2["BodyPartExamined"] != DBNull.Value)
                                            {
                                                var s = ((string)dr2["BodyPartExamined"]).Trim();
                                                if (s != "" && !BodyPart.Contains(s))
                                                {
                                                    BodyPart.Add(s);
                                                }
                                            }
                                        }

                                        tag.BodyPartExamined = BodyPart.ToString('\\');
                                    }
                                }

                                if (dr["StuImagesNum"] != DBNull.Value)
                                    tag.NumberOfImages = (int)(long)dr["StuImagesNum"];

                                tags.Add(tag);
                            }
                        }
                    }
                }
            }

            //ソートはDB
        }

        //スタディ一覧の取得 (過去検査)
        public static void GetStudyList_Kako(string patientid, StudyKey key, out List<StudyTag> tags)
        {
            tags = new List<StudyTag>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand(":"))
                {
                    var sb = new StringBuilder();
                    sb.Append("SELECT StudyInstanceUID,StudyDate,StudyTime,AccessionNumber,Modality,StudyDescription,PatientName,PatientID,PatientBirthDate,PatientSex,BodyPartExamined,StuImagesNum");
                    sb.Append(" FROM MasterStudy");

                    if (patientid.Trim() == "")
                    {
                        sb.Append(" WHERE StudyInstanceUID=" + cmd.Add(key.StudyInstanceUID).ParameterName);
                    }
                    else
                    {
                        sb.Append(" WHERE PatientID=" + cmd.Add(patientid).ParameterName);
                    }

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
                                tag.StudyDate = ((DateTime)dr["StudyDate"]).ToString("yyyyMMdd");

                            if (dr["StudyTime"] != DBNull.Value)
                                tag.StudyTime = string.Format("{0:000000}", Math.Floor((double)dr["StudyTime"]));

                            if (dr["AccessionNumber"] != DBNull.Value)
                                tag.AccessionNumber = (string)dr["AccessionNumber"];

                            if (dr["Modality"] != DBNull.Value)
                                tag.Modality = (string)dr["Modality"];

                            if (dr["StudyDescription"] != DBNull.Value)
                                tag.StudyDescription = (string)dr["StudyDescription"];

                            if (dr["PatientName"] != DBNull.Value)
                                tag.PatientName = (string)dr["PatientName"];

                            if (AppUtil.HideData == "1")
                                tag.PatientName = "";

                            if (dr["PatientID"] != DBNull.Value)
                                tag.PatientID = (string)dr["PatientID"];

                            if (dr["PatientBirthDate"] != DBNull.Value)
                                tag.PatientBirthDate = ((DateTime)dr["PatientBirthDate"]).ToString("yyyyMMdd");

                            if (dr["PatientSex"] != DBNull.Value)
                                tag.PatientSex = (string)dr["PatientSex"];

                            //検査部位
                            using (var cmd2 = db.CreateCommand(":"))
                            {
                                cmd2.CommandText = "SELECT /*+ INDEX(MasterSeries I_STUDYINSTANCEUID) */ BodyPartExamined FROM MasterSeries WHERE StudyInstanceUID=:0";
                                cmd2.Add((string)dr["StudyInstanceUID"]);

                                using (var dr2 = cmd2.ExecuteReader())
                                {
                                    var BodyPart = new List<string>();

                                    while (dr2.Read())
                                    {
                                        if (dr2["BodyPartExamined"] != DBNull.Value)
                                        {
                                            var s = ((string)dr2["BodyPartExamined"]).Trim();
                                            if (s != "" && !BodyPart.Contains(s))
                                            {
                                                BodyPart.Add(s);
                                            }
                                        }
                                    }

                                    tag.BodyPartExamined = BodyPart.ToString('\\');
                                }
                            }

                            if (dr["StuImagesNum"] != DBNull.Value)
                                tag.NumberOfImages = (int)(long)dr["StuImagesNum"];

                            //ソート用
                            tag.StudyInstanceUID = (string)dr["StudyInstanceUID"];

                            tags.Add(tag);
                        }
                    }
                }

            }

            //ソート
            tags.Sort(new StudyTagComparer());
        }

        //スタディの取得 (URLコール用)
        public static bool GetStudyKey(FindParam prm, out string patientid, out List<string> studykey)
        {
            patientid = "";
            studykey = new List<string>();

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand(":"))
                {
                    var sbWhere = new StringBuilder();
                    sbWhere.Append(" WHERE 0=0");

                    if (prm.PatientID != null && prm.PatientID != "")
                    {
                        sbWhere.Append(" AND PatientID LIKE " + cmd.Add(prm.PatientID).ParameterName);
                    }

                    if (prm.PatientName != null && prm.PatientName != "")
                    {
                        sbWhere.Append(" AND PatientName LIKE " + cmd.Add(prm.PatientName).ParameterName);
                    }

                    if (prm.AccessionNumber != null && prm.AccessionNumber != "")
                    {
                        sbWhere.Append(" AND AccessionNumber LIKE " + cmd.Add(prm.AccessionNumber).ParameterName);
                    }

                    if (prm.Modality != null && prm.Modality != "")
                    {
                        int idx = 0;
                        foreach (var mod in prm.Modality.Split(' '))
                        {
                            if (idx == 0)
                            {
                                sbWhere.Append(" AND (Modality LIKE " + cmd.Add("%" + mod + "%").ParameterName);
                                idx++;
                            }
                            else
                            {
                                sbWhere.Append(" OR Modality LIKE " + cmd.Add("%" + mod + "%").ParameterName);
                            }
                        }
                        sbWhere.Append(")");
                    }

                    if (prm.StudyDateFrom != null && prm.StudyDateFrom != "")
                    {
                        DateTime dt = DateTime.ParseExact(prm.StudyDateFrom, "yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo, System.Globalization.DateTimeStyles.None);
                        sbWhere.Append(" AND StudyDate>=" + cmd.Add(dt).ParameterName);
                    }

                    if (prm.StudyDateTo != null && prm.StudyDateTo != "")
                    {
                        DateTime dt = DateTime.ParseExact(prm.StudyDateTo, "yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo, System.Globalization.DateTimeStyles.None);
                        sbWhere.Append(" AND StudyDate<=" + cmd.Add(dt).ParameterName);
                    }

                    var sb = new StringBuilder();
                    sb.Append("SELECT /*+ INDEX(MasterStudy I_PATIENTID) INDEX(MasterStudy I_PATIENTNAME) INDEX(MasterStudy I_ACCESSIONNUMBER) */ StudyInstanceUID,PatientID");
                    sb.Append(" FROM MasterStudy");
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
                using (var cmd = db.CreateCommand(":"))
                {
                    var sb = new StringBuilder();
                    sb.Append("SELECT /*+ INDEX(MasterSeries I_STUDYINSTANCEUID) */ SeriesInstanceUID,SeriesNumber,Modality,SeriesDescription,SerImagesNum,SeriesNumberOfFrame");
                    sb.Append(" FROM MasterSeries");
                    sb.Append(" WHERE StudyInstanceUID=:0");

                    cmd.CommandText = sb.ToString();
                    cmd.Add(key.StudyInstanceUID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            //無視するモダリティ
                            if (Array.IndexOf(AppUtil.SkipModality, (string)dr["Modality"]) >= 0)
                                continue;

                            int noi = 0;
                            if (dr["SerImagesNum"] != DBNull.Value)
                                noi = (int)(long)dr["SerImagesNum"];

                            int nof = 0;
                            if (dr["SeriesNumberOfFrame"] != DBNull.Value)
                                nof = (int)(long)dr["SeriesNumberOfFrame"];

                            if (noi >= nof)
                            {
                                var sekey = new SeriesKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = (string)dr["SeriesInstanceUID"],
                                    SOPInstanceUID = null,
                                    IsImage = false
                                };

                                var tag = new SeriesTag();
                                tag.SeriesKey = ConvertUtil.Serialize(sekey);

                                long res;
                                if (dr["SeriesNumber"] != DBNull.Value && Int64.TryParse((string)dr["SeriesNumber"], out res))
                                    tag.SeriesNumber = res;

                                if (dr["Modality"] != DBNull.Value)
                                    tag.Modality = (string)dr["Modality"];

                                if (dr["SeriesDescription"] != DBNull.Value)
                                    tag.SeriesDescription = (string)dr["SeriesDescription"];

                                tag.NumberOfImages = noi;
                                tag.NumberOfFrames = nof;

                                //ソート用
                                tag.SeriesInstanceUID = (string)dr["SeriesInstanceUID"];

                                tags.Add(tag);
                            }
                            else
                            {
                                //イメージ
                                using (var cmd2 = db.CreateCommand(":"))
                                {
                                    sb = new StringBuilder();
                                    sb.Append("SELECT /*+ INDEX(MasterImage I_STUDYINSTANCEUID_IMAGE) INDEX(MasterImage I_SERIESINSTANCEUID_IMAGE) */ SOPInstanceUID,ImageNumber,NumberOfFrame");
                                    sb.Append(" FROM MasterImage");
                                    sb.Append(" WHERE StudyInstanceUID=:0 AND SeriesInstanceUID=:1");

                                    cmd2.CommandText = sb.ToString();
                                    cmd2.Add(key.StudyInstanceUID);
                                    cmd2.Add((string)dr["SeriesInstanceUID"]);

                                    using (var dr2 = cmd2.ExecuteReader())
                                    {
                                        while (dr2.Read())
                                        {
                                            var sekey = new SeriesKey()
                                            {
                                                StudyInstanceUID = key.StudyInstanceUID,
                                                SeriesInstanceUID = (string)dr["SeriesInstanceUID"],
                                                SOPInstanceUID = (string)dr2["SOPInstanceUID"],
                                                IsImage = true
                                            };

                                            var tag = new SeriesTag();
                                            tag.SeriesKey = ConvertUtil.Serialize(sekey);

                                            long res;
                                            if (dr["SeriesNumber"] != DBNull.Value && Int64.TryParse((string)dr["SeriesNumber"], out res))
                                                tag.SeriesNumber = res;

                                            if (dr["Modality"] != DBNull.Value)
                                                tag.Modality = (string)dr["Modality"];

                                            if (dr["SeriesDescription"] != DBNull.Value)
                                                tag.SeriesDescription = (string)dr["SeriesDescription"];

                                            tag.NumberOfImages = 1;

                                            if (dr2["NumberOfFrame"] != DBNull.Value)
                                                tag.NumberOfFrames = (int)(long)dr2["NumberOfFrame"];

                                            //ソート用
                                            tag.SeriesInstanceUID = (string)dr["SeriesInstanceUID"];
                                            tag.SOPInstanceUID = (string)dr2["SOPInstanceUID"];
                                            if (dr2["ImageNumber"] != DBNull.Value && Int64.TryParse((string)dr2["ImageNumber"], out res))
                                                tag.InstanceNumber = res;

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

        //イメージ一覧の取得
        public static void GetImageList(SeriesKey key, out List<ImageTag> tags)
        {
            tags = new List<ImageTag>();

            if (key.SOPInstanceUID == null)
            {
                using (var db = new TryDbConnection(settings))
                {
                    using (var cmd = db.CreateCommand(":"))
                    {
                        var sb = new StringBuilder();
                        if (AppUtil.YComOnlineLocation == 0)
                        {
                            sb.Append("SELECT /*+ INDEX(MasterImage I_STUDYINSTANCEUID_IMAGE) INDEX(MasterImage I_SERIESINSTANCEUID_IMAGE) */ SOPInstanceUID,ImageNumber");
                        }
                        else
                        {
                            sb.Append("SELECT /*+ INDEX(MasterImage I_STUDYINSTANCEUID_IMAGE) INDEX(MasterImage I_SERIESINSTANCEUID_IMAGE) */ SOPInstanceUID,ImageNumber,NVL(F_GetLosslessPath(SOPInstanceUID,0),F_GetLossyPath(SOPInstanceUID,0)) OnlineLocation");

                        }
                        sb.Append(" FROM MasterImage");
                        sb.Append(" WHERE StudyInstanceUID=:0 AND SeriesInstanceUID=:1");

                        cmd.CommandText = sb.ToString();
                        cmd.Add(key.StudyInstanceUID);
                        cmd.Add(key.SeriesInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                if (AppUtil.YComOnlineLocation != 0 && dr["OnlineLocation"] == DBNull.Value)
                                    continue;
                                
                                var imkey = new ImageKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = key.SeriesInstanceUID,
                                    SOPInstanceUID = (string)dr["SOPInstanceUID"]
                                };

                                var tag = new ImageTag();
                                tag.ImageKey = ConvertUtil.Serialize(imkey);

                                long res;
                                if (dr["ImageNumber"] != DBNull.Value && Int64.TryParse((string)dr["ImageNumber"], out res))
                                    tag.InstanceNumber = res;

                                //ソート用
                                tag.SOPInstanceUID = (string)dr["SOPInstanceUID"];

                                //YCOM用
                                tag.YcomImageKey = imkey;

                                tags.Add(tag);
                            }
                        }
                    }
                }

                //ソート
                tags.Sort(new ImageTagComparer());

                foreach (var tag in tags)
                {
                    //DEBUG
                    //GetFile(tag.YcomImageKey);

                    var file = FileUtil.GetDicomFile(tag.YcomImageKey);
                    if (File.Exists(file))
                    {
                        ImageTag tmp;
                        DicomUtil.GetImageTag(file, out tmp);

                        tag.SliceThickness = tmp.SliceThickness;
                        tag.ImagePositionPatient = tmp.ImagePositionPatient;
                        tag.ImageOrientationPatient = tmp.ImageOrientationPatient;
                        tag.SliceLocation = tmp.SliceLocation;
                        tag.Rows = tmp.Rows;
                        tag.Columns = tmp.Columns;
                        tag.PixelSpacing = tmp.PixelSpacing;
                        tag.WindowCenter = tmp.WindowCenter;
                        tag.WindowWidth = tmp.WindowWidth;
                        tag.NumberOfFrames = tmp.NumberOfFrames;
                    }
                    else
                    {
                        tag.IsImageInfo = true;
                    }
                }
            }
            else
            {
                using (var db = new TryDbConnection(settings))
                {
                    using (var cmd = db.CreateCommand(":"))
                    {
                        cmd.CommandText = "SELECT NumberOfFrame FROM MasterImage WHERE SOPInstanceUID=:0";
                        cmd.Add(key.SOPInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                int nof = (dr["NumberOfFrame"] != DBNull.Value) ? (int)(long)dr["NumberOfFrame"] : 1;
                                if (nof == 0)
                                    nof = 1;

                                for (int i = 0; i < nof; i++)
                                {
                                    var imkey = new ImageKey()
                                    {
                                        StudyInstanceUID = key.StudyInstanceUID,
                                        SeriesInstanceUID = key.SeriesInstanceUID,
                                        SOPInstanceUID = key.SOPInstanceUID,
                                        FrameNumber = i
                                    };

                                    var tag = new ImageTag();
                                    tag.ImageKey = ConvertUtil.Serialize(imkey);
                                    tag.InstanceNumber = i;

                                    //YCOM用
                                    if (i == 0)
                                        tag.YcomImageKey = imkey;

                                    tags.Add(tag);
                                }
                            }
                        }
                    }
                }

                if (tags.Count > 0)
                {
                    //DEBUG
                    //GetFile(tags[0].YcomImageKey);

                    var file = FileUtil.GetDicomFile(tags[0].YcomImageKey);
                    if (File.Exists(file))
                    {
                        ImageTag tmp;
                        DicomUtil.GetImageTag(file, out tmp);

                        foreach (var tag in tags)
                        {
                            tag.SliceThickness = tmp.SliceThickness;
                            tag.ImagePositionPatient = tmp.ImagePositionPatient;
                            tag.ImageOrientationPatient = tmp.ImageOrientationPatient;
                            tag.SliceLocation = tmp.SliceLocation;
                            tag.Rows = tmp.Rows;
                            tag.Columns = tmp.Columns;
                            tag.PixelSpacing = tmp.PixelSpacing;
                            tag.WindowCenter = tmp.WindowCenter;
                            tag.WindowWidth = tmp.WindowWidth;
                            tag.NumberOfFrames = tmp.NumberOfFrames;
                        }
                    }
                    else
                    {
                        foreach (var tag in tags)
                        {
                            tag.IsImageInfo = true;
                        }
                    }
                }
            }
        }

        //イメージ情報の取得
        public static void GetImageInfo(ImageKey key, out ImageTag tag)
        {
            tag = null;

            //画像取得
            GetFile(key);

            var file = FileUtil.GetDicomFile(key);
            if (File.Exists(file))
            {
                ImageTag tmp;
                DicomUtil.GetImageTag(file, out tmp);

                tag = new ImageTag();
                tag.ImageKey = ConvertUtil.Serialize(key);

                tag.InstanceNumber = tmp.InstanceNumber;
                tag.SliceThickness = tmp.SliceThickness;
                tag.ImagePositionPatient = tmp.ImagePositionPatient;
                tag.ImageOrientationPatient = tmp.ImageOrientationPatient;
                tag.SliceLocation = tmp.SliceLocation;
                tag.Rows = tmp.Rows;
                tag.Columns = tmp.Columns;
                tag.PixelSpacing = tmp.PixelSpacing;
                tag.WindowCenter = tmp.WindowCenter;
                tag.WindowWidth = tmp.WindowWidth;
                tag.NumberOfFrames = tmp.NumberOfFrames;
            }
        }

        //サムネイルの取得
        public static void GetThumbnail(SeriesKey key, out byte[] thumb, out bool save)
        {
            thumb = null;
            save = true;

            string sopUid = "";
            string serverAETitle = "";
            string onlineLocation = "";
            long fileSize = 0;

            if (key.SOPInstanceUID == null)
            {
                using (var db = new TryDbConnection(settings))
                {
                    using (var cmd = db.CreateCommand(":"))
                    {
                        var sb = new StringBuilder();
                        
                        if (AppUtil.YComOnlineLocation == 0)
                        {
                            sb.Append("SELECT * FROM (");
                            sb.Append("SELECT /*+ INDEX(MasterImage I_STUDYINSTANCEUID_IMAGE) INDEX(MasterImage I_SERIESINSTANCEUID_IMAGE) */ SOPInstanceUID,ServerAETitle,OnlineLocation,FileSize");
                            sb.Append(" FROM MasterImage");
                            sb.Append(" WHERE StudyInstanceUID=:0 AND SeriesInstanceUID=:1");
                            sb.Append(" ORDER BY LPAD(ImageNumber,12,'0'),SOPInstanceUID");
                            sb.Append(") WHERE ROWNUM=1");
                        }
                        else
                        {
                            sb.Append("SELECT /*+ INDEX(MasterImage I_STUDYINSTANCEUID_IMAGE) INDEX(MasterImage I_SERIESINSTANCEUID_IMAGE) */ SOPInstanceUID,ServerAETitle,NVL(F_GetLosslessPath(SOPInstanceUID,0),F_GetLossyPath(SOPInstanceUID,0)) OnlineLocation,FileSize");
                            sb.Append(" FROM MasterImage");
                            sb.Append(" WHERE StudyInstanceUID=:0 AND SeriesInstanceUID=:1");
                            sb.Append(" ORDER BY LPAD(ImageNumber,12,'0'),SOPInstanceUID");
                        }

                        cmd.CommandText = sb.ToString();
                        cmd.Add(key.StudyInstanceUID);
                        cmd.Add(key.SeriesInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (AppUtil.YComOnlineLocation == 0)
                            {
                                if (dr.Read())
                                {
                                    sopUid = (string)dr["SOPInstanceUID"];
                                    serverAETitle = (string)dr["ServerAETitle"];
                                    onlineLocation = (dr["OnlineLocation"] != DBNull.Value) ? (string)dr["OnlineLocation"] : "";
                                    fileSize = (long)dr["FileSize"];
                                }
                            }
                            else
                            {
                                while (dr.Read())
                                {
                                    if (dr["OnlineLocation"] != DBNull.Value)
                                    {
                                        sopUid = (string)dr["SOPInstanceUID"];
                                        serverAETitle = (string)dr["ServerAETitle"];
                                        onlineLocation = (dr["OnlineLocation"] != DBNull.Value) ? (string)dr["OnlineLocation"] : "";
                                        fileSize = (long)dr["FileSize"];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else
            {
                using (var db = new TryDbConnection(settings))
                {
                    using (var cmd = db.CreateCommand(":"))
                    {
                        if (AppUtil.YComOnlineLocation == 0)
                        {
                            cmd.CommandText = "SELECT ServerAETitle,OnlineLocation,FileSize FROM MasterImage WHERE SOPInstanceUID=:0";
                        }
                        else
                        {
                            cmd.CommandText = "SELECT ServerAETitle,NVL(F_GetLosslessPath(SOPInstanceUID,0),F_GetLossyPath(SOPInstanceUID,0)) OnlineLocation,FileSize FROM MasterImage WHERE SOPInstanceUID=:0";
                        }
                        cmd.Add(key.SOPInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                sopUid = key.SOPInstanceUID;
                                serverAETitle = (string)dr["ServerAETitle"];
                                onlineLocation = (dr["OnlineLocation"] != DBNull.Value) ? (string)dr["OnlineLocation"] : "";
                                fileSize = (long)dr["FileSize"];
                            }
                        }
                    }
                }
            }

            if (onlineLocation != "")
            {
                lock (LockUtil.Lock1())
                {
                    var file = FileUtil.GetThumbFile(key);
                    if (File.Exists(file))
                    {
                        thumb = File.ReadAllBytes(file);
                        save = false;
                        return;
                    }

                    using (IDicomStream dcmstream = new YComStream(YcomUtil.Open1(serverAETitle), YGetItem.eFlag.Online, onlineLocation, (int)fileSize, 131072))
                    {
                        if (dcmstream != null)
                        {
                            DicomUtil.DicomToThumb(dcmstream, out thumb);
                        }
                    }
                }
            }
            else
            {
                LogUtil.Debug("OFFLINE: " + key.StudyInstanceUID);

                //サムネイルはオフラインのとき無視する
                using (var ms = new MemoryStream())
                {
                    Properties.Resources.Offline.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    thumb = ms.ToArray();
                    save = false;
                    return;
                }
            }
        }

        //プリフェッチの一覧
        public static void PrefetchImageList(SeriesKey key, out List<string> keys)
        {
            keys = new List<string>();

            if (key.SOPInstanceUID == null)
            {
                using (var db = new TryDbConnection(settings))
                {
                    using (var cmd = db.CreateCommand(":"))
                    {
                        var sb = new StringBuilder();
                        if (AppUtil.YComOnlineLocation == 0)
                        {
                            sb.Append("SELECT /*+ INDEX(MasterImage I_STUDYINSTANCEUID_IMAGE) INDEX(MasterImage I_SERIESINSTANCEUID_IMAGE) */ SOPInstanceUID");
                        }
                        else
                        {
                            sb.Append("SELECT /*+ INDEX(MasterImage I_STUDYINSTANCEUID_IMAGE) INDEX(MasterImage I_SERIESINSTANCEUID_IMAGE) */ SOPInstanceUID,NVL(F_GetLosslessPath(SOPInstanceUID,0),F_GetLossyPath(SOPInstanceUID,0)) OnlineLocation");
                        }
                        sb.Append(" FROM MasterImage");
                        sb.Append(" WHERE StudyInstanceUID=:0 AND SeriesInstanceUID=:1");

                        cmd.CommandText = sb.ToString();
                        cmd.Add(key.StudyInstanceUID);
                        cmd.Add(key.SeriesInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                if (AppUtil.YComOnlineLocation != 0 && dr["OnlineLocation"] == DBNull.Value)
                                    continue;

                                var imkey = new ImageKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = key.SeriesInstanceUID,
                                    SOPInstanceUID = (string)dr["SOPInstanceUID"]
                                };

                                keys.Add(ConvertUtil.Serialize(imkey));
                            }
                        }
                    }
                }
            }
            else
            {
                var imkey = new ImageKey()
                {
                    StudyInstanceUID = key.StudyInstanceUID,
                    SeriesInstanceUID = key.SeriesInstanceUID,
                    SOPInstanceUID = key.SOPInstanceUID
                };

                keys.Add(ConvertUtil.Serialize(imkey));
            }
        }

        //プリフェッチ
        public static void PrefetchImage(ImageKey key)
        {
            GetFileP(key);
        }

        //画像の取得
        private static void GetFile(ImageKey key)
        {
            var file = FileUtil.GetDicomFile(key);
            if (File.Exists(file))
                return;

            string serverAETitle = "";
            string onlineLocation = "";

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand(":"))
                {
                    if (AppUtil.YComOnlineLocation == 0)
                    {
                        cmd.CommandText = "SELECT ServerAETitle,OnlineLocation FROM MasterImage WHERE SOPInstanceUID=:0";
                    }
                    else
                    {
                        cmd.CommandText = "SELECT ServerAETitle,NVL(F_GetLosslessPath(SOPInstanceUID,0),F_GetLossyPath(SOPInstanceUID,0)) OnlineLocation FROM MasterImage WHERE SOPInstanceUID=:0";
                    }
                    cmd.Add(key.SOPInstanceUID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            serverAETitle = (string)dr["ServerAETitle"];
                            onlineLocation = (dr["OnlineLocation"] != DBNull.Value) ? (string)dr["OnlineLocation"] : "";
                        }
                    }
                }
            }

            if (onlineLocation != "")
            {
                lock (LockUtil.Lock1())
                {
                    if (File.Exists(file))
                        return;

                    var res = YcomUtil.Open1(serverAETitle).Get(YGet.eObjectType.Image, new YGetItem[] { new YGetItem(YGetItem.eFlag.Online, onlineLocation, 0, 0) }, null, null);

                    if (res == null)
                    {
                        LogUtil.Error("YGet:res=null");
                        return;
                    }

                    if (res.Items == null)
                    {
                        LogUtil.Error("YGet:Items=null");
                        return;
                    }

                    if (res.Items.Length == 0)
                    {
                        LogUtil.Error("YGet:Length=0");
                        return;
                    }

                    if (res.Items[0].Status != YGet.YGetResultItem.eStatus.Success)
                    {
                        LogUtil.Error("YGet:Status=" + res.Items[0].Status);
                        return;
                    }

                    if (!Directory.Exists(Path.GetDirectoryName(file)))
                        Directory.CreateDirectory(Path.GetDirectoryName(file));

                    if (Directory.Exists(file))
                    {
                        LogUtil.Error("DirDel: " + file);
                        Directory.Delete(file, true);
                    }

                    if (!File.Exists(file))
                        res.Items[0].WriteFile(file);

                    res.Items[0].Close();
                }
            }
            else
            {                
                lock (LockUtil.Lock2())
                {
                    if (File.Exists(file))
                        return;

                    using (var db = new TryDbConnection(settings))
                    {
                        using (var cmd = db.CreateCommand(":"))
                        {
                            if (AppUtil.YComOnlineLocation == 0)
                            {
                                cmd.CommandText = "SELECT ServerAETitle,OnlineLocation FROM MasterImage WHERE SOPInstanceUID=:0";
                            }
                            else
                            {
                                cmd.CommandText = "SELECT ServerAETitle,NVL(F_GetLosslessPath(SOPInstanceUID,0),F_GetLossyPath(SOPInstanceUID,0)) OnlineLocation FROM MasterImage WHERE SOPInstanceUID=:0";
                            }
                            cmd.Add(key.SOPInstanceUID);

                            using (var dr = cmd.ExecuteReader())
                            {
                                if (dr.Read())
                                {
                                    serverAETitle = (string)dr["ServerAETitle"];
                                    onlineLocation = (dr["OnlineLocation"] != DBNull.Value) ? (string)dr["OnlineLocation"] : "";
                                }
                            }
                        }
                    }

                    YGet.cResult res;

                    if (onlineLocation != "")
                    {
                        res = YcomUtil.Open2(serverAETitle).Get(YGet.eObjectType.Image, new YGetItem[] { new YGetItem(YGetItem.eFlag.Online, onlineLocation, 0, 0) }, null, null);
                    }
                    else
                    {
                        res = YcomUtil.Open2(serverAETitle).Get(YGet.eObjectType.Image, new YGetItem[] { new YGetItem(YGetItem.eFlag.Nearline, key.SOPInstanceUID, 0, 0) }, null, null);
                    }

                    if (res == null)
                    {
                        LogUtil.Error("YGet:res=null");
                        return;
                    }

                    if (res.Items == null)
                    {
                        LogUtil.Error("YGet:Items=null");
                        return;
                    }

                    if (res.Items.Length == 0)
                    {
                        LogUtil.Error("YGet:Length=0");
                        return;
                    }

                    if (res.Items[0].Status != YGet.YGetResultItem.eStatus.Success)
                    {
                        LogUtil.Error("YGet:Status=" + res.Items[0].Status);
                        return;
                    }

                    if (!Directory.Exists(Path.GetDirectoryName(file)))
                        Directory.CreateDirectory(Path.GetDirectoryName(file));

                    if (Directory.Exists(file))
                    {
                        LogUtil.Error("DirDel: " + file);
                        Directory.Delete(file, true);
                    }

                    if (!File.Exists(file))
                        res.Items[0].WriteFile(file);

                    res.Items[0].Close();
                }
            }
        }

        private static void GetFileP(ImageKey key)
        {
            var file = FileUtil.GetDicomFile(key);
            if (File.Exists(file))
                return;

            string serverAETitle = "";
            string onlineLocation = "";

            using (var db = new TryDbConnection(settings))
            {
                using (var cmd = db.CreateCommand(":"))
                {
                    if (AppUtil.YComOnlineLocation == 0)
                    {
                        cmd.CommandText = "SELECT ServerAETitle,OnlineLocation FROM MasterImage WHERE SOPInstanceUID=:0";
                    }
                    else
                    {
                        cmd.CommandText = "SELECT ServerAETitle,NVL(F_GetLosslessPath(SOPInstanceUID,0),F_GetLossyPath(SOPInstanceUID,0)) OnlineLocation FROM MasterImage WHERE SOPInstanceUID=:0";
                    }
                    cmd.Add(key.SOPInstanceUID);

                    using (var dr = cmd.ExecuteReader())
                    {
                        if (dr.Read())
                        {
                            serverAETitle = (string)dr["ServerAETitle"];
                            onlineLocation = (dr["OnlineLocation"] != DBNull.Value) ? (string)dr["OnlineLocation"] : "";
                        }
                    }
                }
            }

            if (onlineLocation != "")
            {
                lock (LockUtil.Lock1())
                {
                    if (File.Exists(file))
                        return;

                    var res = YcomUtil.Open1(serverAETitle).Get(YGet.eObjectType.Image, new YGetItem[] { new YGetItem(YGetItem.eFlag.Online, onlineLocation, 0, 0) }, null, null);

                    if (res == null)
                    {
                        LogUtil.Error("YGet:res=null");
                        return;
                    }

                    if (res.Items == null)
                    {
                        LogUtil.Error("YGet:Items=null");
                        return;
                    }

                    if (res.Items.Length == 0)
                    {
                        LogUtil.Error("YGet:Length=0");
                        return;
                    }

                    if (res.Items[0].Status != YGet.YGetResultItem.eStatus.Success)
                    {
                        LogUtil.Error("YGet:Status=" + res.Items[0].Status);
                        return;
                    }

                    if (!Directory.Exists(Path.GetDirectoryName(file)))
                        Directory.CreateDirectory(Path.GetDirectoryName(file));

                    if (Directory.Exists(file))
                    {
                        LogUtil.Error("DirDel: " + file);
                        Directory.Delete(file, true);
                    }

                    if (!File.Exists(file))
                        res.Items[0].WriteFile(file);

                    res.Items[0].Close();
                }
            }
            else
            {
                lock (LockUtil.Lock2())
                {
                    if (File.Exists(file))
                        return;

                    using (var db = new TryDbConnection(settings))
                    {
                        using (var cmd = db.CreateCommand(":"))
                        {
                            if (AppUtil.YComOnlineLocation == 0)
                            {
                                cmd.CommandText = "SELECT ServerAETitle,OnlineLocation FROM MasterImage WHERE SOPInstanceUID=:0";
                            }
                            else
                            {
                                cmd.CommandText = "SELECT ServerAETitle,NVL(F_GetLosslessPath(SOPInstanceUID,0),F_GetLossyPath(SOPInstanceUID,0)) OnlineLocation FROM MasterImage WHERE SOPInstanceUID=:0";
                            }
                            cmd.Add(key.SOPInstanceUID);

                            using (var dr = cmd.ExecuteReader())
                            {
                                if (dr.Read())
                                {
                                    serverAETitle = (string)dr["ServerAETitle"];
                                    onlineLocation = (dr["OnlineLocation"] != DBNull.Value) ? (string)dr["OnlineLocation"] : "";
                                }
                            }
                        }
                    }

                    YGet.cResult res;

                    if (onlineLocation != "")
                    {
                        res = YcomUtil.Open2(serverAETitle).Get(YGet.eObjectType.Image, new YGetItem[] { new YGetItem(YGetItem.eFlag.Online, onlineLocation, 0, 0) }, null, null);
                    }
                    else
                    {
                        res = YcomUtil.Open2(serverAETitle).Get(YGet.eObjectType.Image, new YGetItem[] { new YGetItem(YGetItem.eFlag.Nearline, key.SOPInstanceUID, 0, 0) }, null, null);
                    }

                    if (res == null)
                    {
                        LogUtil.Error("YGet:res=null");
                        return;
                    }

                    if (res.Items == null)
                    {
                        LogUtil.Error("YGet:Items=null");
                        return;
                    }

                    if (res.Items.Length == 0)
                    {
                        LogUtil.Error("YGet:Length=0");
                        return;
                    }

                    if (res.Items[0].Status != YGet.YGetResultItem.eStatus.Success)
                    {
                        LogUtil.Error("YGet:Status=" + res.Items[0].Status);
                        return;
                    }

                    if (!Directory.Exists(Path.GetDirectoryName(file)))
                        Directory.CreateDirectory(Path.GetDirectoryName(file));

                    if (Directory.Exists(file))
                    {
                        LogUtil.Error("DirDel: " + file);
                        Directory.Delete(file, true);
                    }

                    if (!File.Exists(file))
                        res.Items[0].WriteFile(file);

                    res.Items[0].Close();
                }
            }
        }

        //YCOMのIPアドレス＆ポートの取得
        public static YcomStoreServer GetStoreServer(string ServerAETitle)
        {
            if (ycomServer.ContainsKey(ServerAETitle))
            {
                return ycomServer[ServerAETitle];
            }

            lock (ycomServerLock)
            {
                if (ycomServer.ContainsKey(ServerAETitle))
                {
                    return ycomServer[ServerAETitle];
                }

                using (var db = new TryDbConnection(settings))
                {
                    using (var cmd = db.CreateCommand(":"))
                    {
                        cmd.CommandText = "SELECT * FROM StoreServerManage";

                        using (var dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                var item = new YcomStoreServer();
                                item.IPAddr = (string)dr["IPAddr"];
                                item.PortNumber = (string)dr["PortNumber"];

                                ycomServer[(string)dr["ServerAETitle"]] = item;
                            }
                        }
                    }
                }
            }

            if (ycomServer.ContainsKey(ServerAETitle))
            {
                return ycomServer[ServerAETitle];
            }
            else
            {
                LogUtil.Error1("AETitle Not Found. [{0}]", ServerAETitle);
                return null;
            }
        }
    }
}
