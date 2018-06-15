using DcmtkCtrl;
using DcmtkCtrl.DcmtkUtil;
using ProRadServiceLib.IComparer;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using TryDb;

namespace ProRadServiceLib
{
    //DICOM
    partial class DCM
    {
        //スタディ一覧の取得
        public static void GetStudyList(FindParam prm, out List<StudyTag> tags, out int count)
        {
            tags = new List<StudyTag>();
            count = 0;

            using (var pc = new PacsComm())
            {
                var prm2 = new PacsComm.FindParam();
                prm2.SetStudyDate(prm.StudyDateFrom, prm.StudyDateTo);
                prm2.AccessionNumber = prm.AccessionNumber;
                prm2.PatientName = prm.PatientName;
                prm2.PatientID = prm.PatientID;
                prm2.Modality = prm.Modality;

                DicomTagsResult ret = pc.CFindStudy(prm2);
                if (!ret.IsSuccess)
                {
                    LogUtil.Error("CFINDに失敗しました。");
                    return;
                }

                foreach (var dcmTag in ret.Tags)
                {
                    var stkey = new StudyKey()
                    {
                        StudyInstanceUID = dcmTag.GetTagValue(DicomDic.Find("StudyInstanceUID").Tag),
                        IsPacsSearch = true
                    };

                    var tag = new StudyTag();
                    tag.StudyKey = ConvertUtil.Serialize(stkey);

                    tag.StudyDate = dcmTag.GetTagValue(DicomDic.Find("StudyDate").Tag);
                    tag.StudyTime = dcmTag.GetTagValue(DicomDic.Find("StudyTime").Tag);
                    tag.AccessionNumber = dcmTag.GetTagValue(DicomDic.Find("AccessionNumber").Tag);
                    tag.PatientName = dcmTag.GetTagValue(DicomDic.Find("PatientsName").Tag);
                    tag.PatientID = dcmTag.GetTagValue(DicomDic.Find("PatientID").Tag);

                    tag.Modality = dcmTag.GetTagValue(DicomDic.Find("ModalitiesInStudy").Tag);
                    tag.StudyDescription = dcmTag.GetTagValue(DicomDic.Find("StudyDescription").Tag);
                    tag.PatientBirthDate = dcmTag.GetTagValue(DicomDic.Find("PatientsBirthDate").Tag);
                    tag.PatientSex = dcmTag.GetTagValue(DicomDic.Find("PatientsSex").Tag);
                    tag.PatientAge = dcmTag.GetTagValue(DicomDic.Find("PatientsAge").Tag);
                    Int32.TryParse(dcmTag.GetTagValue(DicomDic.Find("NumberOfStudyRelatedInstances").Tag), out tag.NumberOfImages);

                    //メモ有無
                    using (var db = new TryDbConnection(LCL.settings))
                    {
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
                    }

                    //ソート用
                    tag.StudyInstanceUID = dcmTag.GetTagValue(DicomDic.Find("StudyInstanceUID").Tag);

                    tags.Add(tag);
                }
            }

            count = tags.Count;

            //ソート
            tags.Sort(new StudyTagComparer());

            if (tags.Count > AppUtil.MaxStudyList)
            {
                tags.RemoveRange(AppUtil.MaxStudyList, tags.Count - AppUtil.MaxStudyList);
            }
        }

        //スタディ一覧の取得 (過去検査)
        public static void GetStudyList_Kako(string patientid, StudyKey key, out List<StudyTag> tags)
        {
            tags = new List<StudyTag>();

            using (var pc = new PacsComm())
            {
                var prm2 = new PacsComm.FindParam();
                if (patientid.Trim() == "")
                {
                    prm2.StudyInstanceUID = key.StudyInstanceUID;
                }
                else
                {
                    prm2.PatientID = patientid;
                }

                DicomTagsResult ret = pc.CFindStudy(prm2);
                if (!ret.IsSuccess)
                {
                    LogUtil.Error("CFINDに失敗しました。");
                    return;
                }

                foreach (var dcmTag in ret.Tags)
                {
                    var stkey = new StudyKey()
                    {
                        StudyInstanceUID = dcmTag.GetTagValue(DicomDic.Find("StudyInstanceUID").Tag),
                        IsPacsSearch = true
                    };

                    var tag = new StudyTag();
                    tag.StudyKey = ConvertUtil.Serialize(stkey);

                    tag.StudyDate = dcmTag.GetTagValue(DicomDic.Find("StudyDate").Tag);
                    tag.StudyTime = dcmTag.GetTagValue(DicomDic.Find("StudyTime").Tag);
                    tag.AccessionNumber = dcmTag.GetTagValue(DicomDic.Find("AccessionNumber").Tag);
                    tag.PatientName = dcmTag.GetTagValue(DicomDic.Find("PatientsName").Tag);
                    tag.PatientID = dcmTag.GetTagValue(DicomDic.Find("PatientID").Tag);

                    tag.Modality = dcmTag.GetTagValue(DicomDic.Find("ModalitiesInStudy").Tag);
                    tag.StudyDescription = dcmTag.GetTagValue(DicomDic.Find("StudyDescription").Tag);
                    tag.PatientBirthDate = dcmTag.GetTagValue(DicomDic.Find("PatientsBirthDate").Tag);
                    tag.PatientSex = dcmTag.GetTagValue(DicomDic.Find("PatientsSex").Tag);
                    tag.PatientAge = dcmTag.GetTagValue(DicomDic.Find("PatientsAge").Tag);
                    Int32.TryParse(dcmTag.GetTagValue(DicomDic.Find("NumberOfStudyRelatedInstances").Tag), out tag.NumberOfImages);

                    //メモ有無
                    using (var db = new TryDbConnection(LCL.settings))
                    {
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
                    }

                    //ソート用
                    tag.StudyInstanceUID = dcmTag.GetTagValue(DicomDic.Find("StudyInstanceUID").Tag);

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

            var tags = new List<StudyTag>();

            using (var pc = new PacsComm())
            {
                var prm2 = new PacsComm.FindParam();
                prm2.SetStudyDate(prm.StudyDateFrom, prm.StudyDateTo);
                prm2.AccessionNumber = prm.AccessionNumber;
                prm2.PatientName = prm.PatientName;
                prm2.PatientID = prm.PatientID;
                prm2.Modality = prm.Modality;

                DicomTagsResult ret = pc.CFindStudy(prm2);
                if (!ret.IsSuccess)
                {
                    LogUtil.Error("CFINDに失敗しました。");
                    return true;
                }

                foreach (var dcmTag in ret.Tags)
                {
                    var tag = new StudyTag();
                    tag.StudyDate = dcmTag.GetTagValue(DicomDic.Find("StudyDate").Tag);
                    tag.StudyTime = dcmTag.GetTagValue(DicomDic.Find("StudyTime").Tag);
                    tag.PatientID = dcmTag.GetTagValue(DicomDic.Find("PatientID").Tag);

                    //ソート用
                    tag.StudyInstanceUID = dcmTag.GetTagValue(DicomDic.Find("StudyInstanceUID").Tag);

                    tags.Add(tag);
                }
            }

            if (tags.Count == 0)
                return true;

            //ソート
            tags.Sort(new StudyTagComparer());

            foreach (var tag in tags)
            {
                var key = new StudyKey()
                {
                    StudyInstanceUID = tag.StudyInstanceUID,
                    IsPacsSearch = true
                };
                studykey.Add(ConvertUtil.Serialize(key));

                if (studykey.Count == 1)
                {
                    patientid = tag.PatientID;
                }
                else
                {
                    if (patientid != tag.PatientID)
                    {
                        patientid = null;
                        studykey = null;
                        return false;
                    }
                }
            }

            return true;
        }

        //シリーズ一覧の取得
        public static void GetSeriesList(StudyKey key, out List<SeriesTag> seTags)
        {
            seTags = new List<SeriesTag>();
            var tags = new List<SeriesTag>();

            using (var pc = new PacsComm())
            {
                DicomTagsResult ret = pc.CFindSeries(key.StudyInstanceUID);
                if (!ret.IsSuccess)
                {
                    LogUtil.Error("CFINDに失敗しました。");
                    return;
                }

                foreach (var dcmTag in ret.Tags)
                {
                    string mod = dcmTag.GetTagValue(DicomDic.Find("Modality").Tag);

                    //無視するモダリティ
                    if (Array.IndexOf(AppUtil.SkipModality, mod) >= 0)
                        continue;

                    var sekey = new SeriesKey()
                    {
                        StudyInstanceUID = key.StudyInstanceUID,
                        SeriesInstanceUID = dcmTag.GetTagValue(DicomDic.Find("SeriesInstanceUID").Tag),
                        IsImage = false,
                        IsPacsSearch = true
                    };

                    var tag = new SeriesTag();
                    tag.SeriesKey = ConvertUtil.Serialize(sekey);
                    tag.Modality = mod;
                    Int64.TryParse(dcmTag.GetTagValue(DicomDic.Find("SeriesNumber").Tag), out tag.SeriesNumber);
                    Int32.TryParse(dcmTag.GetTagValue(DicomDic.Find("NumberOfSeriesRelatedInstances").Tag), out tag.NumberOfImages);
                    tag.SeriesDescription = dcmTag.GetTagValue(DicomDic.Find("SeriesDescription").Tag);

                    //ソート用
                    tag.SeriesInstanceUID = dcmTag.GetTagValue(DicomDic.Find("SeriesInstanceUID").Tag);

                    tags.Add(tag);
                }
            }

            //ソート
            tags.Sort(new SeriesTagComparer());

            //重複チェック
            foreach (var tag in tags)
            {
                var sekey = ConvertUtil.Deserialize<SeriesKey>(tag.SeriesKey);

                bool chk = true;
                foreach (var setag in seTags)
                {
                    var sekey2 = ConvertUtil.Deserialize<SeriesKey>(setag.SeriesKey);

                    if (sekey.StudyInstanceUID == sekey2.StudyInstanceUID && sekey.SeriesInstanceUID == sekey2.SeriesInstanceUID)
                    {
                        chk = false;
                        break;
                    }
                }

                if (chk)
                    seTags.Add(tag);
            }
        }

        //画像一覧の取得
        public static void GetImageList(LoginItem login, SeriesKey key, out List<ImageTag> imTags, out List<SeriesTag> seTags)
        {
            imTags = null;
            seTags = null;
            var tags = new List<ImageTag>();

            if (key.IsImage)
            {
                var imkey = new ImageKey()
                {
                    StudyInstanceUID = key.StudyInstanceUID,
                    SeriesInstanceUID = key.SeriesInstanceUID,
                    SOPInstanceUID = key.SOPInstanceUID,
                    StorageID = login.StorageID
                };

                var tag = new ImageTag();
                tag.ImageKey = ConvertUtil.Serialize(imkey);

                tags.Add(tag);
            }
            else
            {
                using (var pc = new PacsComm())
                {
                    DicomTagsResult ret = pc.CFindImage(key.StudyInstanceUID, key.SeriesInstanceUID);
                    if (!ret.IsSuccess)
                    {
                        LogUtil.Error("CFINDに失敗しました。");
                        return;
                    }

                    foreach (var dcmTag in ret.Tags)
                    {
                        var imkey = new ImageKey()
                        {
                            StudyInstanceUID = key.StudyInstanceUID,
                            SeriesInstanceUID = key.SeriesInstanceUID,
                            SOPInstanceUID = dcmTag.GetTagValue(DicomDic.Find("SOPInstanceUID").Tag),
                            StorageID = login.StorageID
                        };

                        var tag = new ImageTag();
                        tag.ImageKey = ConvertUtil.Serialize(imkey);
                        Int64.TryParse(dcmTag.GetTagValue(DicomDic.Find("InstanceNumber").Tag), out tag.InstanceNumber);

                        //ソート用
                        tag.SOPInstanceUID = dcmTag.GetTagValue(DicomDic.Find("SOPInstanceUID").Tag);

                        tags.Add(tag);
                    }
                }

                //ソート
                tags.Sort(new ImageTagComparer());
            }

            //DICOMファイルの取得
            int cnt = 0;
            foreach (var tag in tags)
            {
                var imkey = ConvertUtil.Deserialize<ImageKey>(tag.ImageKey);

                var sto = DbCacheUtil.GetStorage(imkey.StorageID);
                using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                {
                    var dcmfile = FileUtil.GetDicomFile(imkey);
                    if (!File.Exists(dcmfile))
                        cnt++;
                }
            }
            if (cnt > 0)
            {
                DCM.GetImage(login, key);
            }

            int MultiCount = 0;

            //タグの取得
            foreach (var tag in tags)
            {
                var imkey = ConvertUtil.Deserialize<ImageKey>(tag.ImageKey);

                var sto = DbCacheUtil.GetStorage(imkey.StorageID);
                using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                {
                    var dcmfile = FileUtil.GetDicomFile(imkey);
                    if (File.Exists(dcmfile))
                    {
                        ImageTag tmp = null;
                        DicomUtil.GetImageTag(dcmfile, out tmp);

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

                        if (tag.IsMultiframe)
                            MultiCount += 1;
                    }
                }
            }

            if (key.IsImage)
            {
                var sto = DbCacheUtil.GetStorage(key.StorageID);
                using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                {
                    var dcmfile = FileUtil.GetDicomFile(key);
                    if (File.Exists(dcmfile))
                    {
                        imTags = new List<ImageTag>();

                        ImageTag tmp = tags[0];
                        if (tmp.IsMultiframe)
                        {
                            for (var i = 0; i < tmp.NumberOfFrames; i++)
                            {
                                var imkey = new ImageKey()
                                {
                                    StudyInstanceUID = key.StudyInstanceUID,
                                    SeriesInstanceUID = key.SeriesInstanceUID,
                                    SOPInstanceUID = key.SOPInstanceUID,
                                    FrameNumber = i,
                                };

                                var tag = new ImageTag();
                                tag.ImageKey = ConvertUtil.Serialize(imkey);
                                tag.InstanceNumber = i;
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

                                imTags.Add(tag);
                            }
                        }
                        else
                        {
                            imTags.Add(tmp);
                        }
                    }
                }
            }
            else if (MultiCount >= 1)
            {
                //マルチフレームがある場合はシリーズで返す
                seTags = new List<SeriesTag>();

                foreach (var tag in tags)
                {
                    var imkey = ConvertUtil.Deserialize<ImageKey>(tag.ImageKey);

                    var sto = DbCacheUtil.GetStorage(imkey.StorageID);
                    using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                    {
                        var dcmfile = FileUtil.GetDicomFile(imkey);
                        if (File.Exists(dcmfile))
                        {
                            SeriesTag tmp;
                            DicomUtil.GetSeriesTag(dcmfile, out tmp);

                            var sekey = new SeriesKey()
                            {
                                StudyInstanceUID = imkey.StudyInstanceUID,
                                SeriesInstanceUID = imkey.SeriesInstanceUID,
                                SOPInstanceUID = imkey.SOPInstanceUID,
                                StorageID = login.StorageID,
                                IsImage = true,
                                IsPacsSearch = key.IsPacsSearch
                            };

                            tmp.SeriesKey = ConvertUtil.Serialize(sekey);

                            seTags.Add(tmp);
                        }
                    }
                }

                //ソート
                seTags = seTags.OrderBy(n => n.SeriesNumber).ToList();
            }
            else
            {
                imTags = tags;
            }
        }

        //画像一覧の取得（横展開したシリーズ用）
        public static void GetImageList(ImageKey[] keys, out List<ImageTag> tags)
        {
            tags = new List<ImageTag>();

            //タグの取得
            foreach (var key in keys)
            {
                var sto = DbCacheUtil.GetStorage(key.StorageID);
                using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                {
                    var file = FileUtil.GetDicomFile(key);
                    if (File.Exists(file))
                    {
                        ImageTag tag;
                        DicomUtil.GetImageTag(file, out tag);
                        tag.ImageKey = ConvertUtil.Serialize(key);

                        tags.Add(tag);
                    }
                }
            }
        }
    }
}
