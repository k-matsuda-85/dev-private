using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace ProRadServiceLib
{
    //RapidServ
    //  StorageID  : なし
    // 
    //  Dicom : [データベースルートディレクトリ]\[StudyUID]\[SeriesUID]\[InstUID].dcm
    //  Meg   : なし
    //  Thumb : [データベースルートディレクトリ]\[StudyUID]\[SeriesUID]\Thumbnail.bmp
    //
    //  非対応：コメント、キーワード、レポート連携、スタディ削除、検査メモ
    partial class RS
    {
        //画像パス
        public static readonly Dictionary<int, string> server;

        static RS()
        {
            if (AppUtil.rsAddr != null && AppUtil.rsAddr.Length == 4 && AppUtil.rsPort > 0)
            {
                LogUtil.Info("RS START");
                GetDBList(out server);
            }
            else
            {
                LogUtil.Error("RS設定エラー");
            }
        }

        static bool GetDBList(out Dictionary<int, string> server)
        {
            server = new Dictionary<int, string>();

            int ret = RsWSAStartup();
            if (ret != 0)
            {
                LogUtil.Error1("RsWSAStartup={0}", ret);

                ret = RsWSACleanup();
                if (ret != 0)
                {
                    LogUtil.Error1("Retry: RsWSACleanup={0}", ret);
                }

                ret = RsWSAStartup();
                if (ret != 0)
                {
                    LogUtil.Error1("Retry: RsWSAStartup={0}", ret);
                }
            }

            int cnt;
            var errmsg = new StringBuilder(IRCOM_MAX_MESSAGE_LENGTH);

            var ptr = RsGetDBList(AppUtil.rsAddr, AppUtil.rsPort, out cnt, out ret, errmsg);
            if (ptr == null || ret != 0)
            {
                LogUtil.Error2("RsGetDBList={0} {1}", ret, errmsg);
                return false;
            }

            try
            {
                for (int i = 0; i < cnt; i++)
                {
                    var path = Marshal.PtrToStringAnsi(ptr + 64 * i);
                    server.Add(i - 1, path);
                }
                return true;
            }
            finally
            {
                RsFree(ptr);
            }
        }

        static bool GetStudyList(RBStudyQuery query, out List<RBStudy> studyList)
        {
            studyList = new List<RBStudy>();

            int cnt;
            int ret;
            var errmsg = new StringBuilder(IRCOM_MAX_MESSAGE_LENGTH);

            var ptr = RsGetStudyList(AppUtil.rsAddr, AppUtil.rsPort, ref query, out cnt, out ret, errmsg);
            if (ptr == null || ret != 0)
            {
                LogUtil.Error2("RsGetStudyList[{0}] {1}", ret, errmsg);
                return false;
            }

            try
            {
                for (int i = 0; i < cnt; i++)
                {
                    var study = (RBStudy)Marshal.PtrToStructure(ptr + Marshal.SizeOf(typeof(RBStudy)) * i, typeof(RBStudy));
                    if (study.NoOfImg == 0)
                        continue;

                    if (study.DBStatus == RB_STATUS_DBLOCK)
                    {
                        LogUtil.Warn1("RB_STATUS_DBLOCK: {0}", study.StudyUID);
                        continue;
                    }

                    studyList.Add(study);
                }
                return true;
            }
            finally
            {
                RsFree(ptr);
            }
        }

        static bool GetSeriesList(RBSeriesQuery query, out List<RBSeries> seriesList)
        {
            seriesList = new List<RBSeries>();

            int cnt;
            int ret;
            var errmsg = new StringBuilder(IRCOM_MAX_MESSAGE_LENGTH);

            var ptr = RsGetSeriesList(AppUtil.rsAddr, AppUtil.rsPort, ref query, out cnt, out ret, errmsg);
            if (ptr == null || ret != 0)
            {
                LogUtil.Error2("RsGetSeriesList[{0}] {1}", ret, errmsg);
                return false;
            }

            try
            {
                for (int i = 0; i < cnt; i++)
                {
                    var series = (RBSeries)Marshal.PtrToStructure(ptr + Marshal.SizeOf(typeof(RBSeries)) * i, typeof(RBSeries));
                    if (series.no_im == 0)
                        continue;

                    if (series.DBStatus == RB_STATUS_DBLOCK)
                    {
                        LogUtil.Warn1("RB_STATUS_DBLOCK: {0}", series.SeriesUID);
                        continue;
                    }

                    seriesList.Add(series);
                }
                return true;
            }
            finally
            {
                RsFree(ptr);
            }
        }

        static bool GetImageList(RBObjectQuery query, out List<RBImage> imageList)
        {
            imageList = new List<RBImage>();

            int cnt;
            int ret;
            var errmsg = new StringBuilder(IRCOM_MAX_MESSAGE_LENGTH);

            var ptr = RsGetImageList(AppUtil.rsAddr, AppUtil.rsPort, ref query, out cnt, out ret, errmsg);
            if (ptr == null || ret != 0)
            {
                LogUtil.Error2("RsGetImageList[{0}] {1}", ret, errmsg);
                return false;
            }

            try
            {
                for (int i = 0; i < cnt; i++)
                {
                    var image = (RBImage)Marshal.PtrToStructure(ptr + Marshal.SizeOf(typeof(RBImage)) * i, typeof(RBImage));
                    if (image.ObjectType != RB_OBJECT_IMAGE)
                        continue;

                    if (image.DBStatus == RB_STATUS_DBLOCK)
                    {
                        LogUtil.Warn1("RB_STATUS_DBLOCK: {0}", image.InstUID);
                        continue;
                    }

                    imageList.Add(image);
                }
                return true;
            }
            finally
            {
                RsFree(ptr);
            }
        }

        #region RSキャッシュ
        /*
        const int LIMIT = 10;
        static DateTime rsLimit = DateTime.Now.AddMinutes(-1);
        static ReaderWriterLockSlim rsLock = new ReaderWriterLockSlim();
        static Dictionary<string, RsImageKey> imKeys = new Dictionary<string, RsImageKey>();

        static bool GetCacheImageKey(string InstUID, out RsImageKey key)
        {
            key = null;

            if (InstUID == null)
                return false;

            if (rsLimit < DateTime.Now)
            {
                //ライターロック
                rsLock.EnterWriteLock();
                try
                {
                    if (rsLimit < DateTime.Now)
                    {
                        imKeys = new Dictionary<string, RsImageKey>();
                        rsLimit = DateTime.Now.AddMinutes(LIMIT);

                        //DEBUG
                        //LogUtil.Debug("(Clear)");
                    }
                }
                finally
                {
                    rsLock.ExitWriteLock();
                }
            }

            //リーダーロック
            rsLock.EnterReadLock();
            try
            {
                if (imKeys.ContainsKey(InstUID))
                {
                    key = imKeys[InstUID];
                    return true;
                }

                return false;
            }
            finally
            {
                rsLock.ExitReadLock();
            }
        }

        static void SetCacheImageKey(string InstUID, RsImageKey key)
        {
            if (InstUID == null)
                return;

            if (imKeys.ContainsKey(InstUID) == false)
            {
                //ライターロック
                rsLock.EnterWriteLock();
                try
                {
                    if (imKeys.ContainsKey(InstUID) == false)
                    {
                        imKeys.Add(InstUID, key);

                        //DEBUG
                        //LogUtil.Debug(InstUID);
                    }
                }
                finally
                {
                    rsLock.ExitWriteLock();
                }
            }
        }
        */
        #endregion

        #region RSライブラリ

        //定数
        const string FILE_THUMB = "Thumbnail.bmp";
        public const string EXT_DICOM = ".dcm";

        //メッセージ長さ
        const int IRCOM_MAX_MESSAGE_LENGTH = 384;

        // オブジェクトのタイプ
        const int RB_OBJECT_IMAGE = 1;

        // DB Status: データベースのロックで使用する
        const ulong RB_STATUS_FREE_STATUS = 0;              // 完全にフリーな状態
        const ulong RB_STATUS_DBLOCK = 0x1;                 // データロック
        const ulong RB_STATUS_NAS_AND_DB_BOTH_EXIST = 0x2;
        const ulong RB_STATUS_ARCHIVE_EXECUTING = 0x4;      // アーカイブ実行中を意味する
        const ulong RB_STATUS_INIT_CONFIRMED = 0x10;        // 初期化時の確認フラグ

        [DllImport("RsDbAccessLib.dll")]
        static extern IntPtr RsGetDBList(byte[] addr, ushort port_no, out int no_of_db, out int ret_code, StringBuilder message);

        [DllImport("RsDbAccessLib.dll")]
        static extern IntPtr RsGetStudyList(byte[] addr, ushort port_no, ref RBStudyQuery query_data, out int no_of_study, out int ret_code, StringBuilder message);

        [DllImport("RsDbAccessLib.dll")]
        static extern IntPtr RsGetSeriesList(byte[] addr, ushort port_no, ref RBSeriesQuery query_data, out int no_of_series, out int ret_code, StringBuilder message);

        [DllImport("RsDbAccessLib.dll")]
        static extern IntPtr RsGetImageList(byte[] addr, ushort port_no, ref RBObjectQuery query_data, out int no_of_obj, out int ret_code, StringBuilder message);

        [DllImport("RsDbAccessLib.dll")]
        static extern void RsFree(IntPtr ptr);

        [DllImport("RsDbAccessLib.dll")]
        static extern int RsWSAStartup();

        [DllImport("RsDbAccessLib.dll")]
        static extern int RsWSACleanup();

        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        struct RBStudyQuery
        {
            public int max_no_of_replay;
            public int is_filter_on;
            public int is_with_both_exist;
            public int is_asx_on;
            public int comp_mode_of_asx;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)]
            public ulong[] Asx;
            public int is_st_date_on;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string StudyDate;
            public int is_acc_no_on;
            public int comp_mode_of_acc_no;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string AccNo;
            public int is_modality_on;
            public int comp_mode_of_modality;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 56)]
            public string Modality;
            public int is_desc_on;
            public int comp_mode_of_desc;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string StudyDesc;
            public int is_pat_name_on;
            public int comp_mode_of_pat_name;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 128)]
            public string PatientName;
            public int is_pat_id_on;
            public int comp_mode_of_pat_id;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string PatientID;
            public int is_birth_on;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string BirthDate;
            public int is_sex_on;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 4)]
            public string Sex;
            public int is_st_uid_on;
            public int comp_mode_of_st_uid;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string StudyUID;
            public int is_study_id_on;
            public int comp_mode_of_study_id;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string StudyID;
        };

        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        struct RBSeriesQuery
        {
            public int is_filter_on;
            public int location;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string StudyUID;
            public int is_asx_on;
            public int comp_mode_of_asx;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)]
            public ulong[] Asx;
            public int is_modality_on;
            public int comp_mode_of_modality;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 56)]
            public string Modality;
        };

        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        struct RBObjectQuery
        {
            public int is_filter_on;
            public int location;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string StudyUID;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string SeriesUID;
        };

        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        struct RBStudy
        {
            public uint StudyNo;
            public uint StudySize;
            public uint NoOfSe;
            public uint NoOfObj;
            public uint NoOfImg;
            public uint Tsx;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)]
            public ulong[] Asx;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 4)]
            public int[] Language;
            public uint DBStatus;
            public uint Process;
            public uint Review;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 12)]
            public string StudyDate;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 8)]
            public string StudyTime;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string AccNo;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 56)]
            public string Modality;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string StudyDesc;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 128)]
            public string PatName;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 128)]
            public string PatNameSJ;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string PatID;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 12)]
            public string BirthDate;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 4)]
            public string Sex;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string BodyPart;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string StudyUID;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string StudyID;
            public uint HasReport;
            public uint ReportSize;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 4)]
            public uint[] HasImage;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string NASHostName;
        };

        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        struct RBSeries
        {
            public uint SeriesSize;
            public int NoOfObj;
            public int no_im;
            public int no_wav;
            public int no_spc;
            public int no_obj;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)]
            public ulong[] Asx;
            public uint Tsx;
            public uint DBStatus;
            public uint Process;
            public uint Review;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 4)]
            public int[] Language;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 20)]
            public string Modality;
            public int SeriesNo;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 20)]
            public string Station;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string SeriesDesc;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string BodyPart;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string SeriesUID;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string PositionReference;
        };

        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        struct RBImage
        {
            public int ObjectType;
            public uint ObjectSize;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)]
            public long[] Asx;
            public uint Tsx;
            public uint DBStatus;
            public uint Process;
            public uint Review;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 4)]
            public int[] Language;

            //[MarshalAs(UnmanagedType.ByValArray, SizeConst = 5 * 24)]
            //public char[] ImageType;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string ImageType1;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string ImageType2;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string ImageType3;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string ImageType4;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string ImageType5;

            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string InstUID;
            public int FrameRate;
            public int CM;
            public uint ScannningSequence;
            public uint SequenceVariant;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)]
            public uint[] ScanOptions;
            public uint MRAcqType;
            public int CineRate;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string SeqName;
            public double SliceThickness;
            public double KVP;
            public double TR;
            public double TE;
            public double TI;
            public double NoOfAverages;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 24)]
            public string ImagedNucleus;
            public int EchoNo;
            public int ETLength;
            public double MFS;
            public double TriggerTime;
            public double FOV;
            public double Tilt;
            public int HeartRate;
            public int ExposureTime;
            public int MA;
            public int mAs;
            public int microAs;
            public ushort PlayBackMethod;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 2)]
            public string Padding1;
            public uint CassetteOrientation;
            public uint Cassette;
            public uint PatientPosition;
            public uint ViewPosition;
            public double Sensitivity;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
            public double[] ImagePosition;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 6)]
            public double[] ImageOrientation;
            public double SliceLocation;
            public int ImageNo;
            public int NoOfFrames;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)]
            public double[] PixelSpacing;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 2)]
            public int[] PixelAspectRatio;
            public ushort SamplesPerPixel;
            public ushort PI;
            public ushort PlanarConfiguration;
            public ushort Rows;
            public ushort Columns;
            public ushort BitsAllocated;
            public ushort BitsStored;
            public ushort HighBit;
            public ushort PixelRepresentation;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 2)]
            public string Padding2;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
            public int[] Level;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 3)]
            public int[] Width;
            public double RescaleIntercept;
            public double RescaleSlope;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 72)]
            public string Desc;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 16)]
            public int[] SpecificModule;
            public int OffsetToPrivate;
            public int HeaderLength;
            public int PixelLength;
        };
        #endregion
    }
}
