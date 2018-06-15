using ProRadServiceLib;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.ServiceModel;

namespace ProRadService.OnPre
{
    [ServiceContract]
    public class ProRadServices
    {
        ProRadServiceLib.ProRadService sv = new ProRadServiceLib.ProRadService();

        //M

        /// ログイン
        [OperationContract]
        public int Login(string LoginID, string Password, string flag, out string SID)
        {
            using (new DebugLog())
            {
                return sv.Login(LoginID, Password, flag, out SID);
            }
        }

        /// ログイン
        [OperationContract]
        public int Login2(string LoginID, string Password, string flag, out string SID, out string UserID, out int IsAdmin)
        {
            using (new DebugLog())
            {
                return sv.Login2(LoginID, Password, flag, out SID, out UserID, out IsAdmin);
            }
        }

        /// ログイン(URLコール)
        [OperationContract]
        public int LoginUrl(string LoginID, out string SID)
        {
            using (new DebugLog())
            {
                return sv.LoginUrl(LoginID, out SID);
            }
        }

        /// ユーザ設定の取得
        [OperationContract]
        public int GetUserConfig(string SID, out Dictionary<string, string> items)
        {
            using (new DebugLog())
            {
                return sv.GetUserConfig(SID, out items);
            }
        }

        /// モダリティ設定の取得
        [OperationContract]
        public int GetModalityConfig(string SID, out Dictionary<string, Dictionary<string, string>> items)
        {
            using (new DebugLog())
            {
                return sv.GetModalityConfig(SID, out  items);
            }
        }

        /// アノテーション情報の取得
        [OperationContract]
        public int GetAnnotationList(string SID, out List<AnnotationItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetAnnotationList(SID, out items);
            }
        }

        /// ユーザ設定の保存
        [OperationContract]
        public int SetUserConfig(string SID, Dictionary<string, string> items)
        {
            using (new DebugLog())
            {
                return sv.SetUserConfig(SID, items);
            }
        }

        /// ユーザパスワードの変更
        [OperationContract]
        public int SetUserPassword(string SID, string Password, string NewPassword)
        {
            return sv.SetUserPassword(SID, Password, NewPassword);
        }

        /// LoginIDのチェック
        [OperationContract]
        public int CheckLoginID(string SID, string LoginID, out bool used)
        {
            using (new DebugLog())
            {
                return sv.CheckLoginID(SID, LoginID, out used);
            }
        }

        /// 採番マスタの取得
        [OperationContract]
        public int GetSaiban(string SID, string SaibanID, out string item)
        {
            using (new DebugLog())
            {
                return sv.GetSaiban(SID, SaibanID, out item);
            }
        }

        /// サーバー設定マスタの取得
        [OperationContract]
        public int GetMServerConfig(string SID, out Dictionary<string, Tuple<string, string>> items)
        {
            using (new DebugLog())
            {
                return sv.GetMServerConfig(SID, out items);
            }
        }

        /// サーバー設定マスタの保存
        [OperationContract]
        public int SetMServerConfig(string SID, Dictionary<string, string> items)
        {
            using (new DebugLog())
            {
                return sv.SetMServerConfig(SID, items);
            }
        }

        /// システム設定マスタの取得
        [OperationContract]
        public int GetMSystemConfig(string SID, out Dictionary<string, Tuple<string, string>> items)
        {
            using (new DebugLog())
            {
                return sv.GetMSystemConfig(SID, out items);
            }
        }

        /// システム設定マスタの保存
        [OperationContract]
        public int SetMSystemConfig(string SID, Dictionary<string, string> items)
        {
            using (new DebugLog())
            {
                return sv.SetMSystemConfig(SID, items);
            }
        }

        /// グループ情報マスタの取得
        [OperationContract]
        public int GetMGroup(string SID, out List<MGroupItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetMGroup(SID, out items);
            }
        }

        /// グループ情報マスタの保存
        [OperationContract]
        public int SetMGroup(string SID, MGroupItem item, DbActionType type)
        {
            using (new DebugLog())
            {
                return sv.SetMGroup(SID, item, type);
            }
        }

        /// グループ設定マスタの取得
        [OperationContract]
        public int GetMGroupConfig(string SID, string GroupID, out Dictionary<string, string> items)
        {
            using (new DebugLog())
            {
                return sv.GetMGroupConfig(SID, GroupID, out items);
            }
        }

        /// グループ設定マスタの保存
        [OperationContract]
        public int SetMGroupConfig(string SID, string GroupID, Dictionary<string, string> items)
        {
            using (new DebugLog())
            {
                return sv.SetMGroupConfig(SID, GroupID, items);
            }
        }

        /// ユーザ情報マスタの取得
        [OperationContract]
        public int GetMUser(string SID, out List<MUserItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetMUser(SID, out items);
            }
        }

        /// ユーザ情報マスタの保存
        [OperationContract]
        public int SetMUser(string SID, MUserItem item, DbActionType type)
        {
            using (new DebugLog())
            {
                return sv.SetMUser(SID, item, type);
            }
        }

        /// ユーザ設定マスタの取得
        [OperationContract]
        public int GetMUserConfig(string SID, string UserID, out Dictionary<string, string> items)
        {
            using (new DebugLog())
            {
                return sv.GetMUserConfig(SID, UserID, out items);
            }
        }

        /// ユーザ設定マスタの保存
        [OperationContract]
        public int SetMUserConfig(string SID, string UserID, Dictionary<string, string> items)
        {
            using (new DebugLog())
            {
                return sv.SetMUserConfig(SID, UserID, items);
            }
        }

        /// ストレージ情報マスタの取得
        [OperationContract]
        public int GetMStorage(string SID, out List<MStorageItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetMStorage(SID, out items);
            }
        }

        /// ストレージ情報マスタの保存
        [OperationContract]
        public int SetMStorage(string SID, MStorageItem item, DbActionType type)
        {
            using (new DebugLog())
            {
                return sv.SetMStorage(SID, item, type);
            }
        }

        /// モダリティ設定マスタのモダリティ取得
        [OperationContract]
        public int GetMModalityConfig_Modality(string SID, string GroupID, out List<string> items)
        {
            using (new DebugLog())
            {
                return sv.GetMModalityConfig_Modality(SID, GroupID, out items);
            }
        }

        /// モダリティ設定マスタの取得
        [OperationContract]
        public int GetMModalityConfig(string SID, string GroupID, string Modality, out Dictionary<string, Tuple<string, string>> items)
        {
            using (new DebugLog())
            {
                return sv.GetMModalityConfig(SID, GroupID, Modality, out items);
            }
        }

        /// モダリティ設定マスタの保存
        [OperationContract]
        public int SetMModalityConfig(string SID, string GroupID, string Modality, Dictionary<string, string> items)
        {
            using (new DebugLog())
            {
                return sv.SetMModalityConfig(SID, GroupID, Modality, items);
            }
        }

        /// アノテーション設定マスタのモダリティ取得
        [OperationContract]
        public int GetMAnnotation_Modality(string SID, string GroupID, out List<string> items)
        {
            using (new DebugLog())
            {
                return sv.GetMAnnotation_Modality(SID, GroupID, out items);
            }
        }

        /// アノテーション設定マスタの取得
        [OperationContract]
        public int GetMAnnotation(string SID, string GroupID, string Modality, out List<AnnotationItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetMAnnotation(SID, GroupID, Modality, out items);
            }
        }

        /// アノテーション設定マスタの保存
        [OperationContract]
        public int SetMAnnotation(string SID, string GroupID, string Modality, List<AnnotationItem> items)
        {
            using (new DebugLog())
            {
                return sv.SetMAnnotation(SID, GroupID, Modality, items);
            }
        }

        /// RSKey文字列の取得
        [OperationContract]
        public int ToRSKeyString(string SID, RSKey rskey, out string rskeyString)
        {
            using (new DebugLog())
            {
                return sv.ToRSKeyString(SID, rskey, out rskeyString);
            }
        }

        /// RSKey⇒StudyKeyの取得
        [OperationContract]
        public int RSKey2StudyKey(string SID, string rskey, out string patid, out string studykey, out string path, out FindParam prm)
        {
            using (new DebugLog())
            {
                return sv.RSKey2StudyKey(SID, rskey, out patid, out studykey, out path, out prm);
            }
        }

        //T

        /// 検査一覧の取得
        [OperationContract]
        public int GetStudyList(string SID, FindParam prm, out List<StudyTag> tags, out int count)
        {
            using (new DebugLog())
            {
                return sv.GetStudyList(SID, prm, out tags, out count);
            }
        }

        /// 検査一覧の取得 (過去検査)
        [OperationContract]
        public int GetStudyList_Kako(string SID, string patientid, string studykey, out List<StudyTag> tags)
        {
            using (new DebugLog())
            {
                return sv.GetStudyList_Kako(SID, patientid, studykey, out tags);
            }
        }

        /// STUDYキーの取得 (URLコール用)
        [OperationContract]
        public int GetStudyKey(string SID, FindParam prm, out string patientid, out string studykey)
        {
            using (new DebugLog())
            {
                return sv.GetStudyKey(SID, prm, out patientid, out studykey);
            }
        }

        /// シリーズ一覧の取得
        [OperationContract]
        public int GetSeriesList(string SID, string studykey, out List<SeriesTag> tags)
        {
            using (new DebugLog())
            {
                return sv.GetSeriesList(SID, studykey, out tags);
            }
        }

        /// イメージ一覧の取得
        [OperationContract]
        public int GetImageList(string SID, string serieskey, out List<ImageTag> imTags, out List<SeriesTag> seTags)
        {
            using (new DebugLog())
            {
                return sv.GetImageList(SID, serieskey, out imTags, out seTags);
            }
        }

        /// イメージ一覧の取得（横展開 ダイナミック検査用?）
        [OperationContract]
        public int GetImageList2(string SID, List<string> imagekeys, out List<ImageTag> tags)
        {
            using (new DebugLog())
            {
                return sv.GetImageList2(SID, imagekeys, out tags);
            }
        }

        /// スタディの削除
        [OperationContract]
        public int DelStudy(string SID, string studykey)
        {
            using (new DebugLog())
            {
                return sv.DelStudy(SID, studykey);
            }
        }

        /// 検査メモの取得
        [OperationContract]
        public int GetStudyMemo(string SID, string studykey, out StudyMemoItem item, out int count)
        {
            return sv.GetStudyMemo(SID, studykey, out item, out count);
        }

        /// 検査メモ履歴の取得
        [OperationContract]
        public int GetStudyMemoHistory(string SID, string studykey, out List<StudyMemoItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetStudyMemoHistory(SID, studykey, out items);
            }
        }

        /// 検査メモの設定
        [OperationContract]
        public int SetStudyMemo(string SID, string studykey, StudyMemoItem item)
        {
            using (new DebugLog())
            {
                return sv.SetStudyMemo(SID, studykey, item);
            }
        }

        /// コメントの設定
        [OperationContract]
        public int SetComment(string SID, string studykey, string item)
        {
            using (new DebugLog())
            {
                return sv.SetComment(SID, studykey, item);
            }
        }

        /// キーワードの設定
        [OperationContract]
        public int SetKeyword(string SID, string studykey, string item)
        {
            using (new DebugLog())
            {
                return sv.SetKeyword(SID, studykey, item);
            }
        }

        /// 画像転送要求
        //public int ImageTransferRequest(string SID, KeyType type, string Key)
        //{
        //    using (new DebugLog())
        //    {
        //        return sv.ImageTransferRequest(SID, type, Key);
        //    }
        //}

        //I

        /// サムネイルの取得
        [OperationContract]
        public int GetThumbnail(string SID, string serieskey, out byte[] thumb)
        {
            using (new DebugLog())
            {
                return sv.GetThumbnail(SID, serieskey, out thumb);
            }
        }

        /// サムネイルの取得（PACSモードでの横展開）
        [OperationContract]
        public int GetThumbnail2(string SID, string imagekey, out byte[] thumb)
        {
            using (new DebugLog())
            {
                return sv.GetThumbnail2(SID, imagekey, out thumb);
            }
        }

        /// イメージの取得
        [OperationContract]
        public int GetImage(string SID, string imagekey, int level, int cx, int cy, int cw, int ch, double wc, double ww, int rot, int flipX, out byte[] image)
        {
            using (new DebugLog())
            {
                return sv.GetImage(SID, imagekey, level, cx, cy, cw, ch, wc, ww, rot, flipX, out image);
            }
        }
        [OperationContract]
        public int GetImage2(string SID, string imagekey, int level, int cx, int cy, int cw, int ch, double wc, double ww, int rot, int flipX, bool preview, out byte[] image)
        {
            using (new DebugLog())
            {
                return sv.GetImage2(SID, imagekey, level, cx, cy, cw, ch, wc, ww, rot, flipX, preview, out image);
            }
        }

        /// DICOMタグの取得
        [OperationContract]
        public int GetDicomTag(string SID, string imagekey, uint[] tags, out List<DicomTagItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetDicomTag(SID, imagekey, tags, out items);
            }
        }

        /// DICOMタグの取得
        [OperationContract]
        public int GetDicomTagAll(string SID, string imagekey, out List<DicomTagItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetDicomTagAll(SID, imagekey, out items);
            }
        }

        /// ROI取得
        [OperationContract]
        public int GetRoi(string SID, string imagekey, Point p1, Point p2, out RoiItem roi)
        {
            using (new DebugLog())
            {
                return sv.GetRoi(SID, imagekey, p1, p2, out roi);
            }
        }

        /// キャプチャ出力
        [OperationContract]
        public int PutImage(string SID, string[] trace, string path)
        {
            using (new DebugLog())
            {
                return sv.PutImage(SID, trace, path);
            }
        }

        /// プリフェッチ
        [OperationContract]
        public int PrefetchImageList(string SID, string serieskey, out List<string> keys)
        {
            using (new DebugLog())
            {
                return sv.PrefetchImageList(SID, serieskey, out keys);
            }
        }

        /// プリフェッチ
        [OperationContract]
        public int PrefetchImage(string SID, string imagekey)
        {
            using (new DebugLog())
            {
                return sv.PrefetchImage(SID, imagekey);
            }
        }

        /// イメージ情報の取得
        [OperationContract]
        public int GetImageInfo(string SID, string imagekey, out ImageTag tag)
        {
            using (new DebugLog())
            {
                return sv.GetImageInfo(SID, imagekey, out tag);
            }
        }

        //GSPS

        /// GSPS一覧の取得
        [OperationContract]
        public int GetGspsList(string SID, string serieskey, out List<GSPSItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetGspsList(SID, serieskey, out items);
            }
        }

        /// GSPSデータの取得
        [OperationContract]
        public int GetGsps(string SID, string gspskey, out Dictionary<string, GSPSDataItem> items)
        {
            using (new DebugLog())
            {
                return sv.GetGsps(SID, gspskey, out items);
            }
        }
    }
}
