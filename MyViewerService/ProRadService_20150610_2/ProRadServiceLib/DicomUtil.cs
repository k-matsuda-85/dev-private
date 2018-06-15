using DcmtkCtrl.DcmtkUtil;
using DcmUtil;
using DicomAnalyzer;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;

namespace ProRadServiceLib
{
    class DicomUtil
    {
        static object dicomLock = new object();

        //タグ取得
        public static void GetDicomTag(string path, uint[] tags, out List<DicomTagItem> items)
        {
            items = new List<DicomTagItem>();

            if (File.Exists(path))
            {
                using (var dcm = DicomData.Open(path))
                {
                    var dic = DicomAnalyzer.DicomTagDictionary.Open(dcm, tags);
                    foreach (var dicP in dic)
                    {
                        var tag = dicP.Value;

                        var item = new DicomTagItem();
                        item.Tag = tag.Tag;
                        item.VR = tag.VR;
                        item.DataSize = tag.DataSize;
                        if (tag.Tag != 0x7FE00010)
                        {
                            item.Value = tag.ToString();
                        }
                        else
                        {
                            item.Value = "";
                        }

                        var tagData = DicomTagTbl.GetTagData(tag.Tag);
                        if (tagData != null)
                        {
                            item.EName = tagData.EName;
                            item.JName = tagData.JName;
                        }

                        items.Add(item);
                    }
                }
            }
        }

        //全タグ取得
        public static void GetDicomTagAll(string path, out List<DicomTagItem> items)
        {
            items = new List<DicomTagItem>();

            if (File.Exists(path))
            {
                using (var dcm = DicomData.Open(path))
                {
                    foreach (DicomTag tag in dcm)
                    {
                        var item = new DicomTagItem();
                        item.Tag = tag.Tag;
                        item.VR = tag.VR;
                        item.DataSize = tag.DataSize;
                        if (tag.DataSize >= 0 && tag.DataSize <= 1024)
                        {
                            item.Value = tag.ToString();
                        }
                        else
                        {
                            item.Value = "";
                        }

                        var tagData = DicomTagTbl.GetTagData(tag.Tag);
                        if (tagData != null)
                        {
                            item.EName = tagData.EName;
                            item.JName = tagData.JName;
                        }

                        items.Add(item);
                    }
                }
            }
        }

        //SeriesTagの取得
        public static void GetSeriesTag(string file, out SeriesTag tag)
        {
            tag = new SeriesTag();

            using (var dcm = new DicomData(file))
            {
                var dic = DicomTagDictionary.Open(dcm, DcmTag.ToTagArray(DCM.SERIES_TAG));

                tag.Modality = dic.GetValue<string>(DcmTag.Modality.Tag, "");
                tag.SeriesDescription = dic.GetValue<string>(DcmTag.SeriesDescription.Tag, "");
                tag.SeriesNumber = dic.GetValue<long>(DcmTag.SeriesNumber.Tag, 0);
                tag.NumberOfImages = 1;

                if (dcm.Images.Load())
                {
                    tag.NumberOfFrames = dcm.Images.NumberOfFrame;
                }
            }
        }

        //ImageTagの取得
        public static void GetImageTag(string file, out ImageTag tag)
        {
            tag = new ImageTag();

            using (var dcm = new DicomData(file))
            {
                var dic = DicomTagDictionary.Open(dcm, DcmTag.ToTagArray(DCM.IMAGE_TAG));

                tag.InstanceNumber = dic.GetValue<long>(DcmTag.InstanceNumber.Tag, 0);
                tag.SliceThickness = dic.GetValue<string>(DcmTag.SliceThickness.Tag, "");
                tag.ImagePositionPatient = dic.GetValue<string>(DcmTag.ImagePositionPatient.Tag, "");
                tag.ImageOrientationPatient = dic.GetValue<string>(DcmTag.ImageOrientationPatient.Tag, "");
                tag.SliceLocation = dic.GetValue<string>(DcmTag.SliceLocation.Tag, "");
                tag.Rows = dic.GetValue<int>(DcmTag.Rows.Tag, 0);
                tag.Columns = dic.GetValue<int>(DcmTag.Columns.Tag, 0);
                tag.PixelSpacing = dic.GetValue<string>(DcmTag.PixelSpacing.Tag, "");
                tag.WindowCenter = dic.GetValue<string>(DcmTag.WindowCenter.Tag, "");
                tag.WindowWidth = dic.GetValue<string>(DcmTag.WindowWidth.Tag, "");

                if (dcm.Images.Load())
                {
                    if (dcm.Images.Bits == 8 || dcm.Images.Bits == 24)
                    {
                        tag.WindowCenter = "127";
                        tag.WindowWidth = "255";
                    }
                    else
                    {
                        ImageControl ctrl = null;

                        if (dcm.Images.WindowCenters.Length > 0)
                        {
                            tag.WindowCenter = dcm.Images.WindowCenters[0].ToString();
                        }
                        else
                        {
                            if (ctrl == null)
                                ctrl = dcm.Images.CreateImageControl(0);

                            //MinMax
                            if (ctrl != null)
                                tag.WindowCenter = ctrl.WindowCenter.ToString();
                        }

                        if (dcm.Images.WindowWidths.Length > 0)
                        {
                            tag.WindowWidth = dcm.Images.WindowWidths[0].ToString();
                        }
                        else
                        {
                            if (ctrl == null)
                                ctrl = dcm.Images.CreateImageControl(0);

                            //MinMax
                            if (ctrl != null)
                                tag.WindowWidth = ctrl.WindowWidth.ToString();
                        }
                    }

                    tag.NumberOfFrames = dcm.Images.NumberOfFrame;
                }
            }
        }

        //サムネイル作成
        public static void DicomToThumb(string file, out byte[] thumb)
        {
            lock (dicomLock)
            {
                using (var dcm = new DicomData(file))
                {
                    DicomToThumb(dcm, out thumb);
                }
            }
        }

        public static void DicomToThumb(IDicomStream stream, out byte[] thumb)
        {
            lock (dicomLock)
            {
                using (var dcm = new DicomData(stream))
                {
                    DicomToThumb(dcm, out thumb);
                }
            }
        }

        private static void DicomToThumb(DicomData dcm, out byte[] thumb)
        {
            thumb = null;

            if (dcm.Images.Load())
            {
                var ctrl = dcm.Images.CreateImageControl(0);
                if (ctrl != null)
                {
                    int width = AppUtil.THUMB_SIZE * 2;
                    int height = AppUtil.THUMB_SIZE * 2;

                    if (ctrl.Width > width || ctrl.Height > height)
                    {
                        if (ctrl.Width <= ctrl.Height)
                        {
                            width = width * ctrl.Width / ctrl.Height;
                        }
                        else
                        {
                            height = height * ctrl.Height / ctrl.Width;
                        }
                        ctrl = new ImageControl(ctrl, new Rectangle(0, 0, ctrl.Width, ctrl.Height), width, height, true);
                    }

                    width = AppUtil.THUMB_SIZE;
                    height = AppUtil.THUMB_SIZE;

                    if (ctrl.Width <= ctrl.Height)
                    {
                        width = width * ctrl.Width / ctrl.Height;
                    }
                    else
                    {
                        height = height * ctrl.Height / ctrl.Width;
                    }

                    ctrl = new ImageControl(ctrl, new Rectangle(0, 0, ctrl.Width, ctrl.Height), width, height, false);

                    using (var img = ctrl.CreateImage())
                    using (var ms = new MemoryStream())
                    using (var bmp = new Bitmap(AppUtil.THUMB_SIZE, AppUtil.THUMB_SIZE))
                    using (var g = Graphics.FromImage(bmp))
                    {
                        g.Clear(Color.FromArgb(0, Color.Black));
                        g.DrawImage(img, (AppUtil.THUMB_SIZE - img.Width) / 2, (AppUtil.THUMB_SIZE - img.Height) / 2);

                        bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                        thumb = ms.GetBuffer();
                    }
                }
            }
        }

        static readonly object fileLock = new object();
        static readonly object fileLock2 = new object();

        //DICOMファイルの圧縮
        public static bool DicomToComp(string file, string dicomFile, Dictionary<string, string> tags)
        {
            try
            {
                //モダリティ
                string Modality = tags[DcmTag.Modality.Name];

                //圧縮タイプ
                string CompType;
                if (!AppUtil.ModalityCompType.TryGetValue(Modality, out CompType))
                    CompType = AppUtil.CompType;

                //圧縮オプション
                string CompOption;
                if (!AppUtil.ModalityCompOption.TryGetValue(Modality, out CompOption))
                    CompOption = AppUtil.CompOption;

                //ディレクトリ作成
                string dicomDir = Path.GetDirectoryName(dicomFile);
                if (!Directory.Exists(dicomDir))
                    Directory.CreateDirectory(dicomDir);

                //ファイル削除
                if (File.Exists(dicomFile))
                {
                    lock (fileLock)
                    {
                        File.Delete(dicomFile);
                    }
                }

                //圧縮
                if (CompType == "0")
                {
                    //なし
                    return FileUtil.Copy(file, dicomFile);
                }
                else if (CompType == "2")
                {
                    //MEG
                    var scale = double.Parse(CompOption);
                    DicomToMeg(file, dicomFile, scale);
                    return true;
                }
                else
                {
                    //転送構文UID
                    string TransferSyntaxUID = tags[DcmTag.TransferSyntaxUID.Name];

                    if (TransferSyntaxUID != "1.2.840.10008.1.2" && TransferSyntaxUID != "1.2.840.10008.1.2.1")
                        LogUtil.Debug1("TransferSyntaxUID[{0}]", TransferSyntaxUID);

                    //画素表現
                    string PixelRepresentation = tags[DcmTag.PixelRepresentation.Name];

                    var dcmCtrl = new DicomFile(file);

                    //圧縮対象
                    if (TransferSyntaxUID == "1.2.840.10008.1.2" || TransferSyntaxUID == "1.2.840.10008.1.2.1" || TransferSyntaxUID == "1.2.840.10008.1.2.2")
                    {
                        //JPEG-Lossy(8bit)圧縮
                        if (CompType == "50" && dcmCtrl.EncodeToJpeg("+eb +un", dicomFile))
                        {
                            dcmCtrl = new DicomFile(dicomFile);
                        }
                        //JPEG-Lossy(12bit)圧縮
                        else if (CompType == "51" && dcmCtrl.EncodeToJpeg("+ee +un", dicomFile))
                        {
                            dcmCtrl = new DicomFile(dicomFile);
                        }
                        //JPEG-Lossless圧縮
                        else if (CompType == "70" && dcmCtrl.EncodeToJpeg("+e1", dicomFile))
                        {
                            dcmCtrl = new DicomFile(dicomFile);
                        }
                        //JPEG2000圧縮
                        else if (CompType == "90" || CompType == "91")
                        {
                            string tmpFile = "";
                            try
                            {
                                //Explicit変換
                                if (TransferSyntaxUID != "1.2.840.10008.1.2.1")
                                {
                                    tmpFile = dcmCtrl.FileName + ".tmp";
                                    if (dcmconv("+te", dcmCtrl.FileName, tmpFile))
                                    {
                                        dcmCtrl = new DicomFile(tmpFile);
                                    }
                                }

                                //JPEG2000変換
                                if (!File.Exists(AppUtil.CompExe))
                                {
                                    throw new FileNotFoundException(AppUtil.CompExe + " NOT FOUND");
                                }

                                //EXE引数
                                string compArg;

                                //JPEG2000-Lossless圧縮
                                if (CompType == "90")
                                {
                                    compArg = "\"" + dcmCtrl.FileName + "\" \"" + dicomFile + "\"";
                                }
                                //JPEG2000-Lossy圧縮
                                else
                                {
                                    string ratio;
                                    if (!AppUtil.ModalityCompOption.TryGetValue(Modality, out ratio))
                                    {
                                        ratio = AppUtil.CompOption;
                                    }

                                    string[] ratios = ratio.Split(':');
                                    if (ratios.Length == 1 || (ratios.Length == 2 && ratios[0] == ratios[1]))
                                    {
                                        ratio = ratios[0];
                                    }
                                    else
                                    {
                                        //画素表現により決定
                                        if (PixelRepresentation == "1")
                                        {
                                            ratio = ratios[1];
                                        }
                                        else
                                        {
                                            ratio = ratios[0];
                                        }
                                    }

                                    compArg = "\"" + dcmCtrl.FileName + "\" \"" + dicomFile + "\" " + ratio;
                                }

                                bool moveFlag = true;

                                using (Process p = new Process())
                                {
                                    p.StartInfo.FileName = AppUtil.CompExe;
                                    p.StartInfo.Arguments = compArg;
                                    p.StartInfo.UseShellExecute = false;
                                    p.StartInfo.CreateNoWindow = true;
                                    if (p.Start())
                                    {
                                        if (p.WaitForExit(AppUtil.ExeTimeout))
                                        {
                                            if (File.Exists(dicomFile))
                                            {
                                                dcmCtrl = new DicomFile(dicomFile);
                                                moveFlag = false;
                                            }
                                            else
                                            {
                                                LogUtil.Warn("CompExe:ExitCode={0}" + p.ExitCode);
                                            }
                                        }
                                        else
                                        {
                                            LogUtil.Warn("CompExe:Timeout");
                                            try
                                            {
                                                p.Kill();
                                                p.WaitForExit();
                                            }
                                            catch { }
                                        }
                                    }
                                    else
                                    {
                                        LogUtil.Warn("CompExe:Process.Start()=false");
                                    }
                                }

                                if (moveFlag)
                                {
                                    for (int i = 0; i < AppUtil.RetryCount; i++)
                                    {
                                        try
                                        {
                                            if (File.Exists(dicomFile))
                                            {
                                                lock (fileLock2)
                                                {
                                                    File.Delete(dicomFile);
                                                }
                                            }
                                            return FileUtil.Copy(file, dicomFile);
                                        }
                                        catch (Exception ex)
                                        {
                                            LogUtil.Warn(ex);
                                        }

                                        //リトライ
                                        if (i < AppUtil.RetryCount - 1)
                                        {
                                            System.Threading.Thread.Sleep(AppUtil.SleepTime);
                                            LogUtil.Info1("RETRY:{0}", i + 1);
                                        }
                                        else
                                        {
                                            LogUtil.Error1("DicomFile.Move():失敗 [{0}]", dicomFile);
                                        }
                                    }
                                }
                            }
                            finally
                            {
                                if (tmpFile != "")
                                {
                                    FileUtil.Delete(tmpFile, true);
                                }
                            }
                        }
                        else
                        {
                            //無変換
                            return FileUtil.Copy(file, dicomFile);
                        }
                    }
                    else
                    {
                        //無変換
                        return FileUtil.Copy(file, dicomFile);
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return false;
            }
        }

        //MEGファイルの作成
        private static void DicomToMeg(string file, string dicomFile, double scale)
        {
            using (var dcm = new DicomData(file))
            {
                if (dcm.Images.Load())
                {
                    if (dcm.Images.Bits == 8 || dcm.Images.Bits == 24)
                    {
                        File.Copy(file, dicomFile, true);
                    }
                    else
                    {
                        using (var ms = new MemoryStream())
                        {
                            MegData.ConvertToFile(dcm, dicomFile, scale);
                        }
                    }
                }
            }
        }

        //dcmconv - Convert DICOM file encoding
        private static bool dcmconv(string options, string dcmfile_in, string dcmfile_out)
        {
            string exeFile = Path.Combine(AppUtil.DcmtkExePath, "dcmconv.exe");
            if (!File.Exists(exeFile))
            {
                LogUtil.Error("dcmconv.exe Not Found");
                return false;
            }

            if (!File.Exists(dcmfile_in))
            {
                LogUtil.Error1("dcmconv.exe dcmfile_in Not Found [{0}]", dcmfile_in);
                return false;
            }

            if (File.Exists(dcmfile_out))
            {
                try
                {
                    File.Delete(dcmfile_out);
                }
                catch { }
            }

            string arg = options + " \"" + dcmfile_in + "\" \"" + dcmfile_out + "\"";

            using (Process p = new Process())
            {
                p.StartInfo.FileName = exeFile;	//起動するファイル名
                p.StartInfo.Arguments = arg;	//起動時の引数
                p.StartInfo.UseShellExecute = false;
                p.StartInfo.CreateNoWindow = true;
                p.Start();
                if (p.WaitForExit(AppUtil.ExeTimeout))
                {
                    if (!File.Exists(dcmfile_out))
                    {
                        LogUtil.Error1("dcmconv.exe 失敗[{0}]", dcmfile_in);
                        return false;
                    }
                }
                else
                {
                    LogUtil.Warn1("dcmconv.exe タイムアウト[{0}]", dcmfile_in);
                    try
                    {
                        p.Kill();
                        p.WaitForExit();
                    }
                    catch { }

                    return false;
                }
            }

            return true;
        }
    }
}
