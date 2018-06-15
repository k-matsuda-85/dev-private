using DcmtkCtrl;
using DcmtkCtrl.DcmtkUtil;
using DcmUtil;
using DcmUtil.Extensions;
using DicomAnalyzer;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ProRadServiceLib
{
    //DICOM
    partial class DCM
    {
        //サムネイルの作成
        public static void GetThumbnail(SeriesKey key, out byte[] thumb)
        {
            thumb = null;

            if (key.SOPInstanceUID == null || key.SOPInstanceUID == "")
            {
                using (var pc = new PacsComm())
                {
                    DicomTagsResult ret = pc.CFindImage(key.StudyInstanceUID, key.SeriesInstanceUID);
                    if (!ret.IsSuccess)
                    {
                        LogUtil.Error("CFINDに失敗しました。");
                        return;
                    }

                    var tags = new List<Tuple<string, long>>();

                    foreach (var dcmTag in ret.Tags)
                    {
                        long InstanceNumber = 0;
                        Int64.TryParse(dcmTag.GetTagValue(DicomDic.Find("InstanceNumber").Tag), out InstanceNumber);

                        var tag = Tuple.Create(dcmTag.GetTagValue(DicomDic.Find("SOPInstanceUID").Tag), InstanceNumber);
                        tags.Add(tag);
                    }

                    //ソート
                    tags = tags.OrderBy(n => n.Item2).ToList();

                    if (tags.Count > 0)
                    {
                        key.SOPInstanceUID = tags[0].Item1;
                    }
                }
            }

            if (key.SOPInstanceUID != null && key.SOPInstanceUID != "")
            {
                //DICOMがある
                {
                    LCL.GetImageStorageID(ref key);
                    if (key.StorageID != null && key.StorageID != "")
                    {
                        var sto = DbCacheUtil.GetStorage(key.StorageID);
                        using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                        {
                            var file = FileUtil.GetDicomFile(key);
                            if (File.Exists(file))
                            {
                                DicomUtil.DicomToThumb(file, out thumb);
                                if (thumb != null)
                                    return;
                            }
                        }
                    }
                }

                //DICOMがない
                using (var pc = new PacsComm())
                {
                    //画像取得
                    DicomFilesResult ret = pc.CMoveImage(key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID);
                    if (!ret.IsSuccess)
                    {
                        LogUtil.Error("CMoveImage");
                        return;
                    }

                    if (ret.Files.Length == 0)
                    {
                        LogUtil.Error("CMoveImage [File=0]");
                        return;
                    }

                    LogUtil.Debug1("CMoveImage [File={0}]", ret.Files.Length.ToString());

                    foreach (DicomFile dcmfile in ret.Files)
                    {
                        var file = dcmfile.FileName.Trim();
                        if (!File.Exists(file))
                            continue;

                        DicomUtil.DicomToThumb(file, out thumb);

                        if (thumb != null)
                            return;
                    }

                }
            }
        }

        //DICOMの取得
        public static void GetImage(LoginItem login, SeriesKey key)
        {
            GetImage(login.UserName, login.StorageID, key.StudyInstanceUID, key.SeriesInstanceUID, key.SOPInstanceUID);
        }
        private static void GetImage(string UserName, string StorageID, string StudyUID, string SeriesUID, string SopUID)
        {
            LogUtil.Debug3("CMOVE [{0}][{1}][{2}]", StudyUID, SeriesUID, SopUID);

            var sto = DbCacheUtil.GetStorage(StorageID);

            using (var pc = new PacsComm())
            {
                //画像取得
                DicomFilesResult ret = pc.CMoveImage(StudyUID, SeriesUID, SopUID);
                if (!ret.IsSuccess)
                {
                    LogUtil.Error("CMoveImage");
                    return;
                }

                if (ret.Files.Length == 0)
                {
                    LogUtil.Error("CMoveImage [File=0]");
                    return;
                }

                LogUtil.Debug1("CMoveImage [File={0}]", ret.Files.Length.ToString());

                var seriesList = new Dictionary<string, List<Dictionary<string, string>>>();
                int cnt = 0;

                foreach (DicomFile dcmfile in ret.Files)
                {
                    var file = dcmfile.FileName.Trim();
                    if (!File.Exists(file))
                        continue;

                    var tags = new Dictionary<string, string>();

                    tags.Add("StorageID", sto.StorageID);
                    tags.Add("UserName", UserName);

                    tags.Add("AETitle", "");
                    tags.Add("File", file);

                    var fi = new FileInfo(file);
                    tags.Add("FileSize", fi.Length.ToString());

                    //タグ取得
                    using (var dcm = new DicomData(file))
                    {
                        var tmpTags = new List<uint>(DcmTag.ToTagArray(AppUtil.IMAGE_TAG));
                        var dic = DicomTagDictionary.Open(dcm, tmpTags.ToArray());

                        foreach (DcmTag dcmTag in AppUtil.IMAGE_TAG)
                        {
                            tags.Add(dcmTag.Name, dic.GetString(dcmTag.Tag));
                        }

                        if (dcm.Images.Load())
                        {
                            if (dcm.Images.Bits == 8 || dcm.Images.Bits == 24)
                            {
                                tags.SetString("WindowCenter", "127");
                                tags.SetString("WindowWidth", "255");
                            }
                            else
                            {
                                ImageControl ctrl = null;

                                if (dcm.Images.WindowCenters.Length > 0)
                                {
                                    tags.SetString("WindowCenter", dcm.Images.WindowCenters[0].ToString());
                                }
                                else
                                {
                                    if (ctrl == null)
                                        ctrl = dcm.Images.CreateImageControl(0);

                                    //MinMax
                                    if (ctrl != null)
                                        tags.SetString("WindowCenter", ctrl.WindowCenter.ToString());
                                }

                                if (dcm.Images.WindowWidths.Length > 0)
                                {
                                    tags.SetString("WindowWidth", dcm.Images.WindowWidths[0].ToString());
                                }
                                else
                                {
                                    if (ctrl == null)
                                        ctrl = dcm.Images.CreateImageControl(0);

                                    //MinMax
                                    if (ctrl != null)
                                        tags.SetString("WindowWidth", ctrl.WindowWidth.ToString());
                                }
                            }
                        }
                    }

                    var studyUid = tags[DcmTag.StudyInstanceUID.Name];
                    var seriesUid = tags[DcmTag.SeriesInstanceUID.Name];
                    var sopUid = tags[DcmTag.SOPInstanceUID.Name];
                    var mod = tags[DcmTag.Modality.Name];

                    //DICOMチェック
                    if (studyUid == "" || seriesUid == "" || sopUid == "" || mod == "")
                    {
                        LogUtil.Error1("NOT DICOM [{0}]", Path.GetFileName(file));
                        continue;
                    }

                    //無視するモダリティ
                    if (Array.IndexOf(AppUtil.SkipModality, mod) >= 0)
                    {
                        LogUtil.Debug2("SKIP:{0} [{1}]", mod, Path.GetFileName(file));
                        continue;
                    }

                    if (!seriesList.ContainsKey(seriesUid))
                    {
                        seriesList.Add(seriesUid, new List<Dictionary<string, string>>());
                    }

                    seriesList[seriesUid].Add(tags);
                    cnt++;
                }

                //SERIES毎のSOPソート
                foreach (var series in seriesList.Values)
                {
                    series.Sort((x, y) =>
                    {
                        long n1, n2;
                        if (!long.TryParse(x[DcmTag.SeriesNumber.Name], out n1))
                        {
                            n1 = long.MaxValue;
                        }
                        if (!long.TryParse(y[DcmTag.SeriesNumber.Name], out n2))
                        {
                            n2 = long.MaxValue;
                        }
                        return (int)(n1 - n2);
                    });
                }

                int idx = 0;

                foreach (var series in seriesList.Values)
                {
                    if (series.Count == 0)
                        continue;

                    LogUtil.Info5("AETitle[{0}] StudyDate[{1}] StudyTime[{2}] Modality[{3}] PatientID[{4}]",
                        series[0]["AETitle"], series[0][DcmTag.StudyDate.Name], series[0][DcmTag.StudyTime.Name], series[0][DcmTag.Modality.Name], series[0][DcmTag.PatientID.Name]);

                    var importList = new List<Dictionary<string, string>>();

                    foreach (var sop in series)
                    {
                        var studyUid = sop[DcmTag.StudyInstanceUID.Name];
                        var seriesUid = sop[DcmTag.SeriesInstanceUID.Name];
                        var sopUid = sop[DcmTag.SOPInstanceUID.Name];
                        var file = sop["File"];

                        idx++;
                        LogUtil.Debug3("{0}/{1} [{2}]", idx, cnt, Path.GetFileName(file));

                        //画像圧縮
                        using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                        {
                            var dicomFile = Path.Combine(sto.DicomPath, studyUid, seriesUid, sopUid + AppUtil.DicomExt);
                            if (DicomUtil.DicomToComp(file, dicomFile, sop))
                            {
                                sop.Add("DicomFile", dicomFile);
                                LogUtil.Debug("圧縮 end");

                                var fi = new FileInfo(dicomFile);
                                sop.Add("CompFileSize", fi.Length.ToString());
                            }
                            else
                            {
                                LogUtil.Error1("圧縮エラー [{0}]", file);
                                return;
                            }
                        }

                        importList.Add(sop);
                    }

                    //DB登録
                    if (importList.Count > 0)
                    {
                        if (DbUtil.DicomToDB(importList))
                        {
                            LogUtil.Debug("DB登録 end");
                        }
                        else
                        {
                            LogUtil.Error("DB登録エラー");
                        }
                    }
                    else
                    {
                        LogUtil.Debug("DB登録 なし");
                    }
                }

                //DB更新
                DbUtil.UpdateStudy(StudyUID);
            }
        }
    }
}
