using DcmUtil;
using DcmUtil.Extensions;
using System;
using System.Collections.Generic;
using System.Text;
using TryDb;

namespace ProRadServiceLib
{
    //LOCAL
    partial class LCL
    {
        //DBサイズ
        const int LEN_Study_Modality = 16;
        const int LEN_Study_StudyDescription = 64;
        const int LEN_Study_PatientBirthDate = 8;
        const int LEN_Study_PatientAge = 4;
        const int LEN_Study_BodyPartExamined = 64;
        const int LEN_Study_AETitle = 64;
        const int LEN_Study_Comment = 256;
        const int LEN_Series_SeriesDescription = 64;
        const int LEN_Series_BodyPartExamined = 16;
        const int LEN_Image_WindowCenter = 64;
        const int LEN_Image_WindowWidth = 64;

        public static bool DicomToDB(List<Dictionary<string, string>> data)
        {
            if (data == null || data.Count == 0)
                return false;

            var now = DateTime.Now;
            bool studyInsert = true;

            foreach (var sop in data)
            {
                string studyUid = sop[DcmTag.StudyInstanceUID.Name];
                string seriesUid = sop[DcmTag.SeriesInstanceUID.Name];
                string sopUid = sop[DcmTag.SOPInstanceUID.Name];

                for (int i = 0; i < AppUtil.RetryCount; i++)
                {
                    using (var db = new TryDbConnection(settings))
                    {
                        db.BeginTransaction();
                        try
                        {
                            int cnt;

                            if (studyInsert)
                            {
                                //STUDY
                                do
                                {
                                    LogUtil.Info3("DB [{0}][{1}][{2}]", studyUid, seriesUid, sopUid);

                                    cnt = 0;
                                    using (var cmd = db.CreateCommand())
                                    {
                                        cmd.CommandText = "SELECT COUNT(*) FROM T_Study WHERE StudyInstanceUID=@0";
                                        cmd.Add(studyUid);

                                        cnt = Convert.ToInt32(cmd.ExecuteScalar());
                                    }

                                    if (cnt > 0 && Array.IndexOf(AppUtil.SkipModality, sop[DcmTag.Modality.Name]) >= 0)
                                        break;

                                    using (var cmd = db.CreateCommand())
                                    {
                                        var sb = new StringBuilder();
                                        if (cnt == 0)
                                        {
                                            sb.Append("INSERT INTO T_Study(StudyInstanceUID,SpecificCharacterSet,StudyDate,StudyTime,AccessionNumber,Modality,InstitutionName,ReferringPhysicianName,StudyDescription,OperatorsName,PatientName,PatientID,PatientBirthDate,PatientSex,PatientAge,BodyPartExamined,StudyID,RequestingPhysician,RequestingService,AETitle,Comment,UploadUser)");
                                            sb.Append(" VALUES(@0,@1,@2,@3,@4,@5,@6,@7,@8,@9,@10,@11,@12,@13,@14,@15,@16,@17,@18,@19,@20,@21)");
                                        }
                                        else
                                        {
                                            sb.Append("UPDATE T_Study SET SpecificCharacterSet=@1,StudyDate=@2,StudyTime=@3,AccessionNumber=@4,Modality=@5,InstitutionName=@6,ReferringPhysicianName=@7,StudyDescription=@8,OperatorsName=@9,PatientName=@10,PatientID=@11,PatientBirthDate=@12,PatientSex=@13,PatientAge=@14,BodyPartExamined=@15,StudyID=@16,RequestingPhysician=@17,RequestingService=@18,AETitle=@19,Comment=@20,UploadUser=@21,UploadDate=@22");
                                            sb.Append(" WHERE StudyInstanceUID=@0");
                                        }

                                        cmd.CommandText = sb.ToString();
                                        cmd.Add(studyUid);
                                        cmd.Add(sop[DcmTag.SpecificCharacterSet.Name]);
                                        cmd.Add(sop[DcmTag.StudyDate.Name].Replace(".", ""));
                                        cmd.Add(sop[DcmTag.StudyTime.Name]);
                                        cmd.Add(sop[DcmTag.AccessionNumber.Name]);
                                        cmd.Add(sop[DcmTag.Modality.Name]);
                                        cmd.Add(sop[DcmTag.InstitutionName.Name]);
                                        cmd.Add(sop[DcmTag.ReferringPhysicianName.Name]);
                                        cmd.Add(sop[DcmTag.StudyDescription.Name].Substring2(LEN_Study_StudyDescription));
                                        cmd.Add(sop[DcmTag.OperatorsName.Name]);
                                        cmd.Add(sop[DcmTag.PatientName.Name]);
                                        cmd.Add(sop[DcmTag.PatientID.Name]);
                                        cmd.Add(sop[DcmTag.PatientBirthDate.Name].Replace(".", "").Substring2(LEN_Study_PatientBirthDate));
                                        cmd.Add(sop[DcmTag.PatientSex.Name]);
                                        cmd.Add(sop[DcmTag.PatientAge.Name].Substring2(LEN_Study_PatientAge));
                                        cmd.Add(sop[DcmTag.BodyPartExamined.Name]);
                                        cmd.Add(sop[DcmTag.StudyID.Name]);
                                        cmd.Add(sop[DcmTag.RequestingPhysician.Name]);
                                        cmd.Add(sop[DcmTag.RequestingService.Name]);

                                        string aetitle = "";
                                        if (sop.ContainsKey("AETitle"))
                                        {
                                            aetitle = sop["AETitle"].Substring2(LEN_Study_AETitle);
                                        }
                                        cmd.Add(aetitle);

                                        string comment = "";
                                        if (sop.ContainsKey("Comment"))
                                        {
                                            comment = sop["Comment"].Substring2(LEN_Study_Comment);
                                        }
                                        cmd.Add(comment);

                                        cmd.Add(sop["UserName"]);
                                        cmd.Add(now);

                                        cmd.ExecuteNonQuery();
                                    }
                                    LogUtil.Debug("DB_STUDY end");
                                } while (false);

                                //SERIES

                                cnt = 0;
                                using (var cmd = db.CreateCommand())
                                {
                                    cmd.CommandText = "SELECT COUNT(*) FROM T_Series WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1";
                                    cmd.Add(studyUid);
                                    cmd.Add(seriesUid);

                                    cnt = Convert.ToInt32(cmd.ExecuteScalar());
                                }

                                using (var cmd = db.CreateCommand())
                                {
                                    var sb = new StringBuilder();
                                    if (cnt == 0)
                                    {
                                        sb.Append("INSERT INTO T_Series(StudyInstanceUID,SeriesInstanceUID,SOPInstanceUID,Modality,SeriesDescription,BodyPartExamined,SeriesNumber,StorageID)");
                                        sb.Append(" VALUES(@0,@1,@2,@3,@4,@5,@6,@7)");
                                    }
                                    else
                                    {
                                        sb.Append("UPDATE T_Series SET SOPInstanceUID=@2,Modality=@3,SeriesDescription=@4,BodyPartExamined=@5,SeriesNumber=@6,StorageID=@7");
                                        sb.Append(" WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1");
                                    }

                                    cmd.CommandText = sb.ToString();
                                    cmd.Add(studyUid);
                                    cmd.Add(seriesUid);
                                    cmd.Add(sop[DcmTag.SOPInstanceUID.Name]);
                                    cmd.Add(sop[DcmTag.Modality.Name]);
                                    cmd.Add(sop[DcmTag.SeriesDescription.Name].Substring2(LEN_Series_SeriesDescription));
                                    cmd.Add(sop[DcmTag.BodyPartExamined.Name].Substring2(LEN_Series_BodyPartExamined));
                                    cmd.Add(sop[DcmTag.SeriesNumber.Name] == "" ? "0" : sop[DcmTag.SeriesNumber.Name]);
                                    cmd.Add(sop["StorageID"]);

                                    cmd.ExecuteNonQuery();
                                }
                                LogUtil.Debug("DB_SERIES end");
                            }

                            //IMAGE

                            cnt = 0;
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "DELETE FROM T_Image WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1 AND SOPInstanceUID=@2";
                                cmd.Add(studyUid);
                                cmd.Add(seriesUid);
                                cmd.Add(sopUid);

                                cnt = cmd.ExecuteNonQuery();
                            }

                            if (cnt > 0)
                            {
                                LogUtil.Debug1("DB_SOP 削除[{0}]", sopUid);
                            }

                            using (var cmd = db.CreateCommand())
                            {
                                var sb = new StringBuilder();
                                sb.Append("INSERT INTO T_Image(StudyInstanceUID,SeriesInstanceUID,SOPInstanceUID,InstanceNumber,SliceThickness,ImagePositionPatient,ImageOrientationPatient,SliceLocation,PhotometricInterpretation,NumberOfFrames,Rows,Columns,PixelSpacing,WindowCenter,WindowWidth,RescaleIntercept,RescaleSlope,StorageID,FileSize,CompFileSize)");
                                sb.Append(" VALUES(@0,@1,@2,@3,@4,@5,@6,@7,@8,@9,@10,@11,@12,@13,@14,@15,@16,@17,@18,@19)");

                                cmd.CommandText = sb.ToString();
                                cmd.Add(studyUid);
                                cmd.Add(seriesUid);
                                cmd.Add(sopUid);
                                cmd.Add(sop[DcmTag.InstanceNumber.Name] == "" ? "0" : sop[DcmTag.InstanceNumber.Name]);
                                cmd.Add(sop[DcmTag.SliceThickness.Name]);
                                cmd.Add(sop[DcmTag.ImagePositionPatient.Name]);
                                cmd.Add(sop[DcmTag.ImageOrientationPatient.Name]);
                                cmd.Add(sop[DcmTag.SliceLocation.Name]);
                                cmd.Add(sop[DcmTag.PhotometricInterpretation.Name]);
                                cmd.Add(sop[DcmTag.NumberOfFrames.Name] == "" ? "1" : sop[DcmTag.NumberOfFrames.Name]);
                                cmd.Add(sop[DcmTag.Rows.Name]);
                                cmd.Add(sop[DcmTag.Columns.Name]);
                                cmd.Add(sop[DcmTag.PixelSpacing.Name]);
                                cmd.Add(sop[DcmTag.WindowCenter.Name].Substring2(LEN_Image_WindowCenter));
                                cmd.Add(sop[DcmTag.WindowWidth.Name].Substring2(LEN_Image_WindowWidth));
                                cmd.Add(sop[DcmTag.RescaleIntercept.Name]);
                                cmd.Add(sop[DcmTag.RescaleSlope.Name]);
                                cmd.Add(sop["StorageID"]);

                                int fileSize = 0;
                                if (!Int32.TryParse(sop["FileSize"], out fileSize))
                                {
                                    fileSize = 0;
                                }
                                cmd.Add(fileSize);

                                int compFileSize = 0;
                                if (sop.ContainsKey("CompFileSize") && !Int32.TryParse(sop["CompFileSize"], out compFileSize))
                                {
                                    compFileSize = 0;
                                }
                                cmd.Add(compFileSize);

                                cmd.ExecuteNonQuery();
                            }

                            db.Commit();

                            if (studyInsert && sop[DcmTag.Rows.Name] != "" && Array.IndexOf(AppUtil.SkipModality, sop[DcmTag.Modality.Name]) < 0)
                            {
                                studyInsert = false;
                            }
                            break;
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
                        LogUtil.Error3("DB登録:失敗 [{0}][{1}][{2}]", studyUid, seriesUid, sopUid);
                        return false;
                    }
                }
            }

            LogUtil.Debug("DB_SOP end");

            //T_SERIESの更新
            {
                var sop = data[0];
                string studyUid = sop[DcmTag.StudyInstanceUID.Name];
                string seriesUid = sop[DcmTag.SeriesInstanceUID.Name];

                for (int i = 0; i < AppUtil.RetryCount; i++)
                {
                    using (var db = new TryDbConnection(settings))
                    {
                        var sopUid = new List<string>();

                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "SELECT SOPInstanceUID FROM T_Image WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1 AND Rows>0 ORDER BY InstanceNumber";
                            cmd.Add(studyUid);
                            cmd.Add(seriesUid);

                            using (var dr = cmd.ExecuteReader())
                            {
                                while (dr.Read())
                                {
                                    sopUid.Add((string)dr["SOPInstanceUID"]);
                                }
                            }
                        }

                        if (sopUid.Count == 0)
                            break;

                        //サムネイル位置
                        string mod = sop[DcmTag.Modality.Name];
                        string thumbPos;
                        if (!AppUtil.ModalityThumbPos.TryGetValue(mod, out thumbPos))
                        {
                            thumbPos = AppUtil.ThumbPos;
                        }

                        int pos = 0;
                        switch (thumbPos)
                        {
                            case "0":
                                pos = 0;
                                break;
                            case "1":
                                pos = sopUid.Count / 2;
                                break;
                            case "2":
                                pos = sopUid.Count - 1;
                                break;
                            default:
                                pos = 0;
                                break;
                        }

                        //イメージ枚数、フレーム枚数
                        int imageCnt = 0;
                        int frameCnt = 0;
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "SELECT COUNT(*) icnt,SUM(NumberOfFrames) fcnt FROM T_Image WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1 AND Rows>0";
                            cmd.Add(studyUid);
                            cmd.Add(seriesUid);

                            using (var dr = cmd.ExecuteReader())
                            {
                                if (dr.Read())
                                {
                                    imageCnt = Convert.ToInt32(dr["icnt"]);
                                    frameCnt = Convert.ToInt32(dr["fcnt"]);
                                }
                            }
                        }

                        //更新
                        db.BeginTransaction();
                        try
                        {
                            using (var cmd = db.CreateCommand())
                            {
                                cmd.CommandText = "UPDATE T_Series SET SOPInstanceUID=@2,NumberOfImages=@3,NumberOfFrames=@4,StorageID=@5 WHERE StudyInstanceUID=@0 AND SeriesInstanceUID=@1";
                                cmd.Add(studyUid);
                                cmd.Add(seriesUid);
                                cmd.Add(sopUid[pos]);
                                cmd.Add(imageCnt);
                                cmd.Add(frameCnt);
                                cmd.Add(sop["StorageID"]);

                                cmd.ExecuteNonQuery();
                            }

                            db.Commit();
                            LogUtil.Debug("DB_SERIES_2 end");

                            break;
                        }
                        catch (Exception ex)
                        {
                            db.Rollback();
                            LogUtil.Warn1("DB_SERIES_2:{0}", ex.ToString());
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
                        LogUtil.Error3("SERIES登録:失敗 STUDY[{0}] SERIES[{1}] SOP[{2}]", studyUid, seriesUid, sop[DcmTag.SOPInstanceUID.Name]);
                        return false;
                    }
                }
            }

            return true;
        }

        //STUDYの更新
        public static bool UpdateStudy(string StudyUid)
        {
            for (int i = 0; i < AppUtil.RetryCount; i++)
            {
                using (var db = new TryDbConnection(settings))
                {
                    var modList = new List<string>();
                    var bodList = new List<string>();
                    int images = 0;

                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT Modality,BodyPartExamined,NumberOfImages FROM T_Series WHERE StudyInstanceUID=@0 ORDER BY SeriesNumber";
                        cmd.Add(StudyUid);

                        using (var dr = cmd.ExecuteReader())
                        {
                            var modUQ = new List<string>();
                            var bodUQ = new List<string>();

                            while (dr.Read())
                            {
                                var mod = ((string)dr["Modality"]).Trim();
                                if (mod != "" && !modUQ.Contains(mod.ToUpper()))
                                {
                                    modList.Add(mod);
                                    modUQ.Add(mod.ToUpper());
                                }

                                var bod = ((string)dr["BodyPartExamined"]).Trim();
                                if (bod != "" && !bodUQ.Contains(bod.ToUpper()))
                                {
                                    bodList.Add(bod);
                                    bodUQ.Add(bod.ToUpper());
                                }

                                images += (int)dr["NumberOfImages"];
                            }
                        }
                    }

                    db.BeginTransaction();
                    try
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            var sb = new StringBuilder();
                            sb.Append("UPDATE T_Study SET NumberOfImages=" + cmd.Add(images).ParameterName);

                            if (modList.Count > 0)
                            {
                                sb.Append(",Modality=" + cmd.Add(modList.ToString('\\', LEN_Study_Modality)).ParameterName);
                            }

                            if (bodList.Count > 0)
                            {
                                sb.Append(",BodyPartExamined=" + cmd.Add(bodList.ToString('\\', LEN_Study_BodyPartExamined)).ParameterName);
                            }

                            sb.Append(" WHERE StudyInstanceUID=" + cmd.Add(StudyUid).ParameterName);

                            cmd.CommandText = sb.ToString();

                            cmd.ExecuteNonQuery();
                        }

                        db.Commit();
                        return true;
                    }
                    catch (Exception ex)
                    {
                        db.Rollback();
                        LogUtil.Warn(ex.ToString());
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
                    LogUtil.Error("T_Study更新:失敗");
                    return false;
                }
            }

            return false;
        }
    }
}
