using ProRadServiceLib.Extensions;
using ProRadServiceLib.IComparer;
using System;
using System.Collections.Generic;
using System.IO;
using TryDb;

namespace ProRadServiceLib
{
    //RapidServ
    partial class RS
    {
        //スタディ一覧の取得
        public static void GetStudyList(FindParam prm, out List<StudyTag> tags, out int count)
        {
            tags = new List<StudyTag>();
            count = 0;

            using (var db = new TryDbConnection(LCL.settings))
            {
                var studyQuery = new RBStudyQuery();
                studyQuery.is_with_both_exist = AppUtil.rsNas;
                studyQuery.max_no_of_replay = AppUtil.MaxStudyList > 0 ? AppUtil.MaxStudyList : AppUtil.rsMax;

                if (string.IsNullOrEmpty(prm.PatientID) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_pat_id_on = 1;
                    studyQuery.comp_mode_of_pat_id = AppUtil.cmPatientID;
                    studyQuery.PatientID = prm.PatientID;
                }

                if (string.IsNullOrEmpty(prm.PatientName) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_pat_name_on = 1;
                    studyQuery.comp_mode_of_pat_name = AppUtil.cmPatientName;
                    studyQuery.PatientName = prm.PatientName;
                }

                if (string.IsNullOrEmpty(prm.AccessionNumber) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_acc_no_on = 1;
                    studyQuery.comp_mode_of_acc_no = AppUtil.cmAccessionNumber;
                    studyQuery.AccNo = prm.AccessionNumber;
                }

                if (string.IsNullOrEmpty(prm.Modality) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_modality_on = 1;
                    studyQuery.comp_mode_of_modality = AppUtil.cmModality;
                    studyQuery.Modality = prm.Modality.Replace(',', '|');
                }

                if (string.IsNullOrEmpty(prm.StudyDateFrom) == false && string.IsNullOrEmpty(prm.StudyDateTo) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_st_date_on = 1;
                    studyQuery.StudyDate = string.Format("{0}-{1}", prm.StudyDateFrom, prm.StudyDateTo);
                }
                else if (string.IsNullOrEmpty(prm.StudyDateFrom) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_st_date_on = 1;
                    studyQuery.StudyDate = string.Format("{0}-{1}", prm.StudyDateFrom, DateTime.Now.ToString("yyyyMMdd"));
                }
                else if (string.IsNullOrEmpty(prm.StudyDateTo) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_st_date_on = 1;
                    studyQuery.StudyDate = string.Format("{0}-{1}", "19700101", prm.StudyDateTo);
                }

                List<RBStudy> studyList;
                if (!GetStudyList(studyQuery, out studyList))
                    return;

                var PatName = new Dictionary<string, string>();

                foreach (var study in studyList)
                {
                    int nasno = -1;
                    if (!int.TryParse(study.NASHostName, out nasno))
                    {
                        LogUtil.Error1("NASHostName={0}", study.NASHostName);
                        continue;
                    }

                    var stkey = new StudyKey()
                    {
                        StudyInstanceUID = study.StudyUID,
                        StorageID = nasno.ToString()
                    };

                    var tag = new StudyTag();
                    tag.StudyKey = ConvertUtil.Serialize(stkey);
                    tag.StudyDate = study.StudyDate;
                    tag.StudyTime = study.StudyTime;
                    tag.AccessionNumber = study.AccNo;
                    tag.Modality = study.Modality;
                    tag.StudyDescription = study.StudyDesc;
                    tag.PatientName = study.PatNameSJ != "" ? study.PatNameSJ : study.PatName;
                    tag.PatientID = study.PatID;
                    tag.PatientBirthDate = study.BirthDate;
                    tag.PatientSex = study.Sex;
                    tag.BodyPartExamined = study.BodyPart;
                    tag.NumberOfImages = (int)study.NoOfImg;

                    //患者名
                    if (PatName.ContainsKey(tag.PatientID))
                    {
                        if (PatName[tag.PatientID] != null)
                        {
                            tag.PatientName = PatName[tag.PatientID];
                        }
                    }
                    else
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "SELECT PatientName FROM T_Patient WHERE PatientID=@0";
                            cmd.Add(tag.PatientID);

                            using (var dr = cmd.ExecuteReader())
                            {
                                if (dr.Read())
                                {
                                    tag.PatientName = (string)dr["PatientName"];
                                    PatName.Add(tag.PatientID, (string)dr["PatientName"]);
                                }
                                else
                                {
                                    PatName.Add(tag.PatientID, null);
                                }
                            }
                        }
                    }

                    if (AppUtil.HideData == "1")
                        tag.PatientName = "";

                    //メモ有無
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT COUNT(*) cnt FROM T_StudyMemo WHERE StudyInstanceUID=@0";
                        cmd.Add(stkey.StudyInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                tag.StudyMemoUmu = Convert.ToInt32(dr["cnt"]);
                            }
                        }
                    }

                    //ソート用
                    tag.StudyInstanceUID = study.StudyUID;

                    tags.Add(tag);
                }

                count = tags.Count;
            }

            //ソート
            tags.Sort(new StudyTagComparer());
        }

        //スタディ一覧の取得 (過去検査)
        public static void GetStudyList_Kako(string patientid, StudyKey key, out List<StudyTag> tags)
        {
            tags = new List<StudyTag>();

            using (var db = new TryDbConnection(LCL.settings))
            {
                var studyQuery = new RBStudyQuery();
                studyQuery.is_with_both_exist = AppUtil.rsNas;
                studyQuery.max_no_of_replay = AppUtil.rsMax;

                if (string.IsNullOrEmpty(patientid))
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_study_id_on = 1;
                    studyQuery.comp_mode_of_study_id = 1;
                    studyQuery.StudyUID = key.StudyInstanceUID;
                }
                else
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_pat_id_on = 1;
                    studyQuery.comp_mode_of_pat_id = 1;
                    studyQuery.PatientID = patientid;
                }

                List<RBStudy> studyList;
                if (!GetStudyList(studyQuery, out studyList))
                    return;

                var PatName = new Dictionary<string, string>();

                foreach (var study in studyList)
                {
                    int nasno = -1;
                    if (!int.TryParse(study.NASHostName, out nasno))
                    {
                        LogUtil.Error1("NASHostName={0}", study.NASHostName);
                        continue;
                    }

                    var stkey = new StudyKey()
                    {
                        StudyInstanceUID = study.StudyUID,
                        StorageID = nasno.ToString()
                    };

                    var tag = new StudyTag();
                    tag.StudyKey = ConvertUtil.Serialize(stkey);
                    tag.StudyDate = study.StudyDate;
                    tag.StudyTime = study.StudyTime;
                    tag.AccessionNumber = study.AccNo;
                    tag.Modality = study.Modality;
                    tag.StudyDescription = study.StudyDesc;
                    tag.PatientName = study.PatNameSJ != "" ? study.PatNameSJ : study.PatName;
                    tag.PatientID = study.PatID;
                    tag.PatientBirthDate = study.BirthDate;
                    tag.PatientSex = study.Sex;
                    tag.BodyPartExamined = study.BodyPart;
                    tag.NumberOfImages = (int)study.NoOfImg;

                    //患者名
                    if (PatName.ContainsKey(tag.PatientID))
                    {
                        if (PatName[tag.PatientID] != null)
                        {
                            tag.PatientName = PatName[tag.PatientID];
                        }
                    }
                    else
                    {
                        using (var cmd = db.CreateCommand())
                        {
                            cmd.CommandText = "SELECT PatientName FROM T_Patient WHERE PatientID=@0";
                            cmd.Add(tag.PatientID);

                            using (var dr = cmd.ExecuteReader())
                            {
                                if (dr.Read())
                                {
                                    tag.PatientName = (string)dr["PatientName"];
                                    PatName.Add(tag.PatientID, (string)dr["PatientName"]);
                                }
                                else
                                {
                                    PatName.Add(tag.PatientID, null);
                                }
                            }
                        }
                    }

                    if (AppUtil.HideData == "1")
                        tag.PatientName = "";

                    //メモ有無
                    using (var cmd = db.CreateCommand())
                    {
                        cmd.CommandText = "SELECT COUNT(*) cnt FROM T_StudyMemo WHERE StudyInstanceUID=@0";
                        cmd.Add(stkey.StudyInstanceUID);

                        using (var dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                tag.StudyMemoUmu = Convert.ToInt32(dr["cnt"]);
                            }
                        }
                    }

                    //ソート用
                    tag.StudyInstanceUID = study.StudyUID;

                    tags.Add(tag);
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

            using (var db = new TryDbConnection(LCL.settings))
            {
                var studyQuery = new RBStudyQuery();
                studyQuery.is_with_both_exist = AppUtil.rsNas;
                studyQuery.max_no_of_replay = AppUtil.rsMax;

                if (string.IsNullOrEmpty(prm.PatientID) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_pat_id_on = 1;
                    studyQuery.comp_mode_of_pat_id = AppUtil.cmPatientID;
                    studyQuery.PatientID = prm.PatientID;
                }

                if (string.IsNullOrEmpty(prm.PatientName) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_pat_name_on = 1;
                    studyQuery.comp_mode_of_pat_name = AppUtil.cmPatientName;
                    studyQuery.PatientName = prm.PatientName;
                }

                if (string.IsNullOrEmpty(prm.AccessionNumber) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_acc_no_on = 1;
                    studyQuery.comp_mode_of_acc_no = AppUtil.cmAccessionNumber;
                    studyQuery.AccNo = prm.AccessionNumber;
                }

                if (string.IsNullOrEmpty(prm.Modality) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_modality_on = 1;
                    studyQuery.comp_mode_of_modality = AppUtil.cmModality;
                    studyQuery.Modality = prm.Modality.Replace(',', '|');
                }

                if (string.IsNullOrEmpty(prm.StudyDateFrom) == false && string.IsNullOrEmpty(prm.StudyDateTo) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_st_date_on = 1;
                    studyQuery.StudyDate = string.Format("{0}-{1}", prm.StudyDateFrom, prm.StudyDateTo);
                }
                else if (string.IsNullOrEmpty(prm.StudyDateFrom) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_st_date_on = 1;
                    studyQuery.StudyDate = string.Format("{0}-{1}", prm.StudyDateFrom, DateTime.Now.ToString("yyyyMMdd"));
                }
                else if (string.IsNullOrEmpty(prm.StudyDateTo) == false)
                {
                    studyQuery.is_filter_on = 1;
                    studyQuery.is_st_date_on = 1;
                    studyQuery.StudyDate = string.Format("{0}-{1}", "19700101", prm.StudyDateTo);
                }

                List<RBStudy> studyList;
                if (!GetStudyList(studyQuery, out studyList))
                    return false;

                //ソート
                studyList.Sort((x, y) =>
                {
                    int c = (y.StudyDate + y.StudyTime).CompareTo(x.StudyDate + x.StudyTime);
                    if (c == 0)
                    {
                        return x.StudyUID.CompareTo(y.StudyUID);
                    }
                    else
                    {
                        return c;
                    }
                });

                foreach (var study in studyList)
                {
                    int nasno = -1;
                    if (!int.TryParse(study.NASHostName, out nasno))
                    {
                        LogUtil.Error1("NASHostName={0}", study.NASHostName);
                        continue;
                    }

                    var key = new StudyKey()
                    {
                        StudyInstanceUID = study.StudyUID,
                        StorageID = nasno.ToString()
                    };
                    studykey.Add(ConvertUtil.Serialize(key));

                    if (studykey.Count == 1)
                    {
                        patientid = study.PatID;
                    }
                    else
                    {
                        if (patientid != study.PatID)
                        {
                            patientid = null;
                            studykey = null;
                            return false;
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

            var seriesQuery = new RBSeriesQuery();
            seriesQuery.is_filter_on = 1;
            seriesQuery.location = Int32.Parse(key.StorageID);
            seriesQuery.StudyUID = key.StudyInstanceUID;

            List<RBSeries> seriesList;
            if (!GetSeriesList(seriesQuery, out seriesList))
                return;

            //ソート
            seriesList.Sort((x, y) =>
            {
                int c = x.SeriesNo.CompareTo(y.SeriesNo);
                if (c == 0)
                {
                    return x.SeriesUID.CompareTo(y.SeriesUID);
                }
                else
                {
                    return c;
                }
            });

            foreach (var series in seriesList)
            {
                var imageQuery = new RBObjectQuery();
                imageQuery.is_filter_on = 1;
                imageQuery.location = Int32.Parse(key.StorageID);
                imageQuery.StudyUID = key.StudyInstanceUID;
                imageQuery.SeriesUID = series.SeriesUID;

                List<RBImage> imageList;
                if (!GetImageList(imageQuery, out imageList))
                    continue;

                //ソート
                imageList.Sort((x, y) =>
                {
                    int c = x.ImageNo.CompareTo(y.ImageNo);
                    if (c == 0)
                    {
                        return x.InstUID.CompareTo(y.InstUID);
                    }
                    else
                    {
                        return c;
                    }
                });

                int nof = 0;
                foreach (var image in imageList)
                {
                    nof += image.NoOfFrames;
                }

                if (nof == 0)
                {
                    var sekey = new SeriesKey()
                    {
                        StudyInstanceUID = key.StudyInstanceUID,
                        SeriesInstanceUID = series.SeriesUID,
                        SOPInstanceUID = null,
                        StorageID = key.StorageID,
                        IsImage = false
                    };

                    var tag = new SeriesTag();
                    tag.SeriesKey = ConvertUtil.Serialize(sekey); //new RsSeriesKey(key, series.SeriesUID, series.Modality, series.SeriesDesc, series.SeriesNo);
                    tag.SeriesNumber = series.SeriesNo;
                    tag.Modality = series.Modality;
                    tag.SeriesDescription = series.SeriesDesc;
                    tag.NumberOfImages = series.no_im;
                    tag.NumberOfFrames = nof;

                    tags.Add(tag);
                }
                else
                {
                    //イメージ
                    foreach (var image in imageList)
                    {
                        var sekey = new SeriesKey()
                        {
                            StudyInstanceUID = key.StudyInstanceUID,
                            SeriesInstanceUID = series.SeriesUID,
                            SOPInstanceUID = image.InstUID,
                            StorageID = key.StorageID,
                            IsImage = true
                        };

                        var tag = new SeriesTag();
                        tag.SeriesKey = ConvertUtil.Serialize(sekey); //new RsSeriesKey(key, series.SeriesUID, image.InstUID, image.NoOfFrames);
                        tag.SeriesNumber = series.SeriesNo;
                        tag.Modality = series.Modality;
                        tag.SeriesDescription = series.SeriesDesc;
                        tag.NumberOfImages = 1;
                        tag.NumberOfFrames = image.NoOfFrames;

                        tags.Add(tag);
                    }
                }
            }
        }

        //画像一覧の取得
        public static void GetImageList(SeriesKey key, out List<ImageTag> tags)
        {
            tags = new List<ImageTag>();

            if (!key.IsImage)
            {
                var imageQuery = new RBObjectQuery();
                imageQuery.is_filter_on = 1;
                imageQuery.location = Int32.Parse(key.StorageID);
                imageQuery.StudyUID = key.StudyInstanceUID;
                imageQuery.SeriesUID = key.SeriesInstanceUID;

                List<RBImage> imageList;
                if (!GetImageList(imageQuery, out imageList))
                    return;

                //ソート
                imageList.Sort((x, y) =>
                {
                    int c = x.ImageNo.CompareTo(y.ImageNo);
                    if (c == 0)
                    {
                        return x.InstUID.CompareTo(y.InstUID);
                    }
                    else
                    {
                        return c;
                    }
                });

                foreach (var image in imageList)
                {
                    var imkey = new ImageKey()
                    {
                        StudyInstanceUID = key.StudyInstanceUID,
                        SeriesInstanceUID = key.SeriesInstanceUID,
                        SOPInstanceUID = image.InstUID,
                        StorageID = key.StorageID
                    };

                    var tag = new ImageTag();
                    tag.ImageKey = ConvertUtil.Serialize(imkey); //new RsImageKey(key, image.InstUID);
                    tag.InstanceNumber = image.ImageNo;
                    tag.SliceThickness = image.SliceThickness.ToString();
                    tag.ImagePositionPatient = image.ImagePosition.ToString('\\');
                    tag.ImageOrientationPatient = image.ImageOrientation.ToString('\\');
                    tag.SliceLocation = image.SliceLocation.ToString();
                    tag.Rows = image.Rows;
                    tag.Columns = image.Columns;
                    tag.PixelSpacing = image.PixelSpacing.ToString('\\');
                    tag.WindowCenter = image.Level.ToString('\\');
                    tag.WindowWidth = image.Width.ToString('\\');

                    tags.Add(tag);
                }
            }
            else
            {
                //※イメージで検索できない
                var imageQuery = new RBObjectQuery();
                imageQuery.is_filter_on = 1;
                imageQuery.location = Int32.Parse(key.StorageID);
                imageQuery.StudyUID = key.StudyInstanceUID;
                imageQuery.SeriesUID = key.SeriesInstanceUID;

                List<RBImage> imageList;
                if (!GetImageList(imageQuery, out imageList))
                    return;

                foreach (var image in imageList)
                {
                    if (image.InstUID == key.SOPInstanceUID)
                    {
                        var nof = image.NoOfFrames;
                        if (nof == 0)
                            nof = 1;

                        for (int i = 0; i < nof; i++)
                        {
                            var imkey = new ImageKey()
                            {
                                StudyInstanceUID = key.StudyInstanceUID,
                                SeriesInstanceUID = key.SeriesInstanceUID,
                                SOPInstanceUID = image.InstUID,
                                FrameNumber = i,
                                StorageID = key.StorageID
                            };

                            var tag = new ImageTag();
                            tag.ImageKey = ConvertUtil.Serialize(imkey); //new RsImageKey(key, i);
                            tag.InstanceNumber = i;
                            tag.SliceThickness = image.SliceThickness.ToString();
                            tag.ImagePositionPatient = image.ImagePosition.ToString('\\');
                            tag.ImageOrientationPatient = image.ImageOrientation.ToString('\\');
                            tag.SliceLocation = image.SliceLocation.ToString();
                            tag.Rows = image.Rows;
                            tag.Columns = image.Columns;
                            tag.PixelSpacing = image.PixelSpacing.ToString('\\');
                            tag.WindowCenter = image.Level.ToString('\\');
                            tag.WindowWidth = image.Width.ToString('\\');
                            tag.NumberOfFrames = nof;

                            tags.Add(tag);
                        }

                        break;
                    }
                }
            }
        }

        //サムネイルの取得
        public static void GetThumbnail(SeriesKey key, out byte[] thumb)
        {
            thumb = null;

            if (key.SOPInstanceUID == null)
            {
                string thumbFile = Path.Combine(server[Int32.Parse(key.StorageID)], key.StudyInstanceUID, key.SeriesInstanceUID, FILE_THUMB);
                if (File.Exists(thumbFile))
                {
                    thumb = File.ReadAllBytes(thumbFile);
                }
                else
                {
                    LogUtil.Error("File Not Found: " + thumbFile);
                }
            }
            else
            {
                string dicomFile = Path.Combine(server[Int32.Parse(key.StorageID)], key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID + EXT_DICOM);
                if (File.Exists(dicomFile))
                {
                    DicomUtil.DicomToThumb(dicomFile, out thumb);
                }
                else
                {
                    LogUtil.Error("File Not Found: " + dicomFile);
                }
            }
        }
    }
}
