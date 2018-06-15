using DcmUtil;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;

namespace ProRadServiceLib
{
    class AppUtil
    {
        public static readonly string LogPath = ConfigurationManager.AppSettings["LogPath"] ?? @"C:\ProRadNadia_Log";
        public static readonly string LicensePath = ConfigurationManager.AppSettings["LicensePath"];

        public static readonly string DbType = "LOCAL";         //DBタイプ (LOCAL,RS,YCOM)
        public static readonly string LoginAuth = "0";          //ログイン認証 (0:通常 1:Exporter)

        public static readonly string ThumbPath = "";           //サムネイルフォルダ
        public static readonly string ReportPath = "";          //レポートフォルダ
        public static readonly string MemoOutputPath = "";      //メモ出力フォルダ (空：出力なし)
        public static readonly string DeletePath = "";          //削除トリガーフォルダ

        public static readonly int RetryCount = 3;              //リトライ数
        public static readonly int SleepTime = 1000;            //リトライ待機(msec)

        public static readonly int DBTimeout = 120;             //DBLib用Timeout設定(sec)
        public static readonly int ExeTimeout = 600 * 1000;     //EXE用Timeout設定(sec)

        public static readonly int LockoutThreshold = 10;       //アカウント ロックアウトのしきい値 (0:ロックアウトしない)
        public static readonly int LockoutDuration = 60;        //アカウント ロックアウトの期間(分) (0:無期限ロックアウト)
        public static readonly int LockoutReset = 60;           //アカウント ロックアウトのリセット期間(分) (0:リセットしない)

        public static readonly int TimeLimit = 24;              //ログイン有効期限(時)

        public static readonly int MaxStudyList = 200;          //検査一覧の最大表示数 (0:制限なし)
        public static readonly string[] SkipModality = null;    //無視するモダリティ (複数指定：カンマ区切り)

        public static readonly string DicomExt = ".dcm";        //DICOM拡張子 ※.dcm or .meg
        public static readonly string CompExe = "";             //JPEG2000圧縮アプリ
        public static readonly string CompType = "0";           //圧縮タイプ (0:なし 2:MEG 50:JPEG-Lossy 70:JPEG-Lossless 90:JPEG2000-Lossless 91:JPEG2000-Lossy)
        public static readonly string CompOption = "";          //圧縮オプション CompType=2[MEG圧縮率(1.0～0.0)] 91[圧縮比(画素表現0):圧縮比(画素表現1)]
        public static readonly string ThumbPos = "0";           //サムネイル位置 (0:先頭 1:中央 2:最後)

        public static readonly Dictionary<string, string> ModalityCompType = new Dictionary<string, string>();      //モダリティ毎の圧縮タイプ
        public static readonly Dictionary<string, string> ModalityCompOption = new Dictionary<string, string>();    //モダリティ毎の圧縮オプション
        public static readonly Dictionary<string, string> ModalityThumbPos = new Dictionary<string, string>();      //モダリティ毎のサムネイル位置

        public static readonly string LoginUrl = "0";           //LoginIDによるURLコール (0:無効 1:有効)

        public static readonly byte[] rsAddr = null;            //【RapidServ】IPアドレス
        public static readonly ushort rsPort = 5216;            //【RapidServ】ポート番号 (デフォルト:5205+11)
        public static readonly int rsNas = 0;                   //【RapidServ】STUDY検索 (0:Localのみ 1:Local+Nas)
        public static readonly int rsMax = 200;                 //【RapidServ】最大応答数
        public static readonly int cmPatientID = 0;             //【RapidServ】CompMode (0:部分一致 1:完全一致)
        public static readonly int cmPatientName = 0;           //【RapidServ】CompMode (0:部分一致 1:完全一致)
        public static readonly int cmAccessionNumber = 0;       //【RapidServ】CompMode (0:部分一致 1:完全一致)
        public static readonly int cmModality = 0;              //【RapidServ】CompMode (0:部分一致 1:完全一致)

        public static readonly string YComClientInfo = "";      //【YCOM】
        public static readonly string YComHospitalID = "";      //【YCOM】
        public static readonly string YComUserID = "";          //【YCOM】
        public static readonly int YComOnlineLocation = 0;      //【YCOM】

        public static readonly string DcmtkExePath = "";        //DCMTK 3.5.4
        public static readonly string DcmtkDicPath = "";        //DCMTK 3.5.4
        public static readonly string DcmtkTempPath = "";       //DCMTK 3.5.4
        public static readonly string DcmtkCFindOptions = "";   //DCMTK 3.5.4
        public static readonly string DcmtkCMoveOptions = "";   //DCMTK 3.5.4
        public static readonly string DcmtkMyAETitle = "";      //DCMTK 3.5.4
        public static readonly string DcmtkMyPort = "";         //DCMTK 3.5.4
        public static readonly string DcmtkPacsAETitle = "";    //DCMTK 3.5.4
        public static readonly string DcmtkPacsPeer = "";       //DCMTK 3.5.4
        public static readonly string DcmtkPacsPort = "";       //DCMTK 3.5.4

        public static readonly int CFindTimeout = 300 * 1000;   //DcmtkCtl用Timeout設定(sec)
        public static readonly int CMoveTimeout = 1200 * 1000;  //DcmtkCtl用Timeout設定(sec)

        public static readonly int ImageCacheMax = 1000;
        public static readonly int ImageCacheTime = 10;

        public static readonly string HideData = "0";

        //拡張子
        public const string EXT_THUMB = ".jpg";

        //DB
        public const string DB_CLD = "LOCAL";
        public const string DB_EXP = "EXP";
        public const string DB_RS = "RS";
        public const string DB_YCOM = "YCOM";

        //ログイン認証
        public const string LOGIN_EXP = "1";

        //サムネイルサイズ
        public const int THUMB_SIZE = 64;

        //DICOMのセルサイズ
        public const ushort CELL_SIZE = 256;

        //戻り値
        public const int RTN_OK = 0;
        public const int RTN_ERR = 1;
        public const int RTN_NOT_LOGIN = 2;

        //DICOM画像タグ
        public static readonly DcmTag[] IMAGE_TAG =
        {
            DcmTag.TransferSyntaxUID,

            DcmTag.SpecificCharacterSet,
            DcmTag.SOPInstanceUID,
            DcmTag.StudyDate,
            DcmTag.StudyTime,
            DcmTag.AccessionNumber,
            DcmTag.Modality,
            DcmTag.InstitutionName,
            DcmTag.ReferringPhysicianName,
            DcmTag.StudyDescription,
            DcmTag.SeriesDescription,
            DcmTag.OperatorsName,

            DcmTag.PatientName,
            DcmTag.PatientID,
            DcmTag.PatientBirthDate,
            DcmTag.PatientSex,
            DcmTag.PatientAge,

            DcmTag.BodyPartExamined,
            DcmTag.SliceThickness,

            DcmTag.StudyInstanceUID,
            DcmTag.SeriesInstanceUID,
            DcmTag.StudyID,
            DcmTag.SeriesNumber,
            DcmTag.InstanceNumber,
            DcmTag.ImagePositionPatient,
            DcmTag.ImageOrientationPatient,
            DcmTag.SliceLocation,

            DcmTag.PhotometricInterpretation,
            DcmTag.NumberOfFrames,
            DcmTag.Rows,
            DcmTag.Columns,
            DcmTag.PixelSpacing,
            DcmTag.PixelRepresentation,
            DcmTag.WindowCenter,
            DcmTag.WindowWidth,
            DcmTag.RescaleIntercept,
            DcmTag.RescaleSlope,

            DcmTag.RequestingPhysician,
            DcmTag.RequestingService,
        };

        static AppUtil()
        {
            //LOGフォルダ
            LogPath = Path.Combine(LogPath, Path.GetFileName(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath.TrimEnd('\\')));

            LogUtil.Info("START");

            //ライセンスチェック
            if(File.Exists(LicensePath))
            {
                //////var License = File.ReadAllText(LicensePath);
                //////if (License != CryptoUtil.LicenseString())
                //////{
                //////    LogUtil.Error("License NG");
                //////    return;
                //////}
            }
            else
            {
                LogUtil.Error("License Not Found");
                return;
            }

            //ServerConfig取得
            Dictionary<string, string> svcfg;
            LCL.GetServerConfig(out svcfg);

            //サーバー設定
            if (svcfg.ContainsKey("DbType")) DbType = svcfg["DbType"];
            if (svcfg.ContainsKey("LoginAuth")) LoginAuth = svcfg["LoginAuth"];

            if (svcfg.ContainsKey("ThumbPath")) ThumbPath = svcfg["ThumbPath"];
            if (svcfg.ContainsKey("ReportPath")) ReportPath = svcfg["ReportPath"];
            if (svcfg.ContainsKey("MemoOutputPath")) MemoOutputPath = svcfg["MemoOutputPath"];
            if (svcfg.ContainsKey("DeletePath")) DeletePath = svcfg["DeletePath"];

            if (svcfg.ContainsKey("RetryCount")) RetryCount = int.Parse(svcfg["RetryCount"]);
            if (svcfg.ContainsKey("SleepTime")) SleepTime = int.Parse(svcfg["SleepTime"]);

            if (svcfg.ContainsKey("DBTimeout")) DBTimeout = int.Parse(svcfg["DBTimeout"]);
            if (svcfg.ContainsKey("ExeTimeout")) ExeTimeout = int.Parse(svcfg["ExeTimeout"]) * 1000;

            if (svcfg.ContainsKey("LockoutThreshold")) LockoutThreshold = int.Parse(svcfg["LockoutThreshold"]);
            if (svcfg.ContainsKey("LockoutDuration")) LockoutDuration = int.Parse(svcfg["LockoutDuration"]);
            if (svcfg.ContainsKey("LockoutReset")) LockoutReset = int.Parse(svcfg["LockoutReset"]);

            if (svcfg.ContainsKey("TimeLimit")) TimeLimit = int.Parse(svcfg["TimeLimit"]);

            if (svcfg.ContainsKey("MaxStudyList")) MaxStudyList = int.Parse(svcfg["MaxStudyList"]);

            if (svcfg.ContainsKey("DicomExt")) DicomExt = svcfg["DicomExt"];
            if (svcfg.ContainsKey("CompExe")) CompExe = svcfg["CompExe"];
            if (svcfg.ContainsKey("CompType")) CompType = svcfg["CompType"];
            if (svcfg.ContainsKey("CompOption")) CompOption = svcfg["CompOption"];
            if (svcfg.ContainsKey("ThumbPos")) ThumbPos = svcfg["ThumbPos"];

            if (svcfg.ContainsKey("LoginUrl")) LoginUrl = svcfg["LoginUrl"];

            if (svcfg.ContainsKey("RapidServ_Port")) rsPort = ushort.Parse(svcfg["RapidServ_Port"]);
            if (svcfg.ContainsKey("RapidServ_Nas")) rsNas = int.Parse(svcfg["RapidServ_Nas"]);
            if (svcfg.ContainsKey("RapidServ_Max")) rsMax = int.Parse(svcfg["RapidServ_Max"]);
            if (svcfg.ContainsKey("RapidServ_CM_PatientID")) cmPatientID = int.Parse(svcfg["RapidServ_CM_PatientID"]);
            if (svcfg.ContainsKey("RapidServ_CM_PatientName")) cmPatientName = int.Parse(svcfg["RapidServ_CM_PatientName"]);
            if (svcfg.ContainsKey("RapidServ_CM_AccessionNumber")) cmAccessionNumber = int.Parse(svcfg["RapidServ_CM_AccessionNumber"]);
            if (svcfg.ContainsKey("RapidServ_CM_Modality")) cmModality = int.Parse(svcfg["RapidServ_CM_Modality"]);

            if (svcfg.ContainsKey("YComClientInfo")) YComClientInfo = svcfg["YComClientInfo"];
            if (svcfg.ContainsKey("YComHospitalID")) YComHospitalID = svcfg["YComHospitalID"];
            if (svcfg.ContainsKey("YComUserID")) YComUserID = svcfg["YComUserID"];
            if (svcfg.ContainsKey("YComOnlineLocation")) YComOnlineLocation = int.Parse(svcfg["YComOnlineLocation"]);

            if (svcfg.ContainsKey("DcmtkExePath")) DcmtkExePath = svcfg["DcmtkExePath"];
            if (svcfg.ContainsKey("DcmtkDicPath")) DcmtkDicPath = svcfg["DcmtkDicPath"];
            if (svcfg.ContainsKey("DcmtkTempPath")) DcmtkTempPath = svcfg["DcmtkTempPath"];
            if (svcfg.ContainsKey("DcmtkCFindOptions")) DcmtkCFindOptions = svcfg["DcmtkCFindOptions"];
            if (svcfg.ContainsKey("DcmtkCMoveOptions")) DcmtkCMoveOptions = svcfg["DcmtkCMoveOptions"];
            if (svcfg.ContainsKey("DcmtkMyAETitle")) DcmtkMyAETitle = svcfg["DcmtkMyAETitle"];
            if (svcfg.ContainsKey("DcmtkMyPort")) DcmtkMyPort = svcfg["DcmtkMyPort"];
            if (svcfg.ContainsKey("DcmtkPacsAETitle")) DcmtkPacsAETitle = svcfg["DcmtkPacsAETitle"];
            if (svcfg.ContainsKey("DcmtkPacsPeer")) DcmtkPacsPeer = svcfg["DcmtkPacsPeer"];
            if (svcfg.ContainsKey("DcmtkPacsPort")) DcmtkPacsPort = svcfg["DcmtkPacsPort"];

            if (svcfg.ContainsKey("CFindTimeout")) CFindTimeout = int.Parse(svcfg["CFindTimeout"]) * 1000;
            if (svcfg.ContainsKey("CMoveTimeout")) CMoveTimeout = int.Parse(svcfg["CMoveTimeout"]) * 1000;

            if (svcfg.ContainsKey("ImageCacheMax")) ImageCacheMax = int.Parse(svcfg["ImageCacheMax"]);
            if (svcfg.ContainsKey("ImageCacheTime")) ImageCacheTime = int.Parse(svcfg["ImageCacheTime"]);

            if (svcfg.ContainsKey("HideData")) HideData = svcfg["HideData"];

            string mods = "";
            if (svcfg.ContainsKey("SkipModality")) mods = svcfg["SkipModality"];
            SkipModality = mods.Split(',');

            mods = "";
            if (svcfg.ContainsKey("ModalityCompType")) mods = svcfg["ModalityCompType"];
            foreach (string mod in mods.Split(','))
            {
                string[] tmp = mod.Split('=');
                if (tmp.Length > 1)
                {
                    ModalityCompType.Add(tmp[0], tmp[1]);
                }
            }

            mods = "";
            if (svcfg.ContainsKey("ModalityCompOption")) mods = svcfg["ModalityCompOption"];
            foreach (string mod in mods.Split(','))
            {
                string[] tmp = mod.Split('=');
                if (tmp.Length > 1)
                {
                    ModalityCompOption.Add(tmp[0], tmp[1]);
                }
            }

            mods = "";
            if (svcfg.ContainsKey("ModalityThumbPos")) mods = svcfg["ModalityThumbPos"];
            foreach (string mod in mods.Split(','))
            {
                string[] tmp = mod.Split('=');
                if (tmp.Length > 1)
                {
                    ModalityThumbPos.Add(tmp[0], tmp[1]);
                }
            }

            string addr = "";
            if (svcfg.ContainsKey("RapidServ_Addr")) addr = svcfg["RapidServ_Addr"];
            if (addr != "")
            {
                var tmp1 = new List<byte>();
                foreach (var s in addr.Split('.'))
                {
                    tmp1.Add(Convert.ToByte(s));
                }
                rsAddr = tmp1.ToArray();
            }

            //TryDb初期化
            TryDb.TryDbConfig.CommandTimeout = DBTimeout;
        }
    }
}
