using System;
using System.Collections.Generic;

namespace ProRadServiceLib
{
    class DbUtil
    {
        public static void LoginCheck(string SID, out LoginItem item)
        {
            LCL.LoginCheck(SID, out item);
        }

        //M

        public static void Login(string loginID, string password, string flag, out string SID)
        {
            string UserID;
            int IsAdmin;
            Login(loginID, password, flag, out SID, out UserID, out IsAdmin);
        }
        public static void Login(string loginID, string password, string flag, out string SID, out string UserID, out int IsAdmin)
        {
            if (AppUtil.LoginAuth == AppUtil.LOGIN_EXP)
            {
                EXP.Login(loginID, password, out SID);
                UserID = null;
                IsAdmin = 0;
            }
            else
            {
                LCL.Login(loginID, password, flag, out SID, out UserID, out IsAdmin);
            }
            LCL.DelLogin();
        }

        public static void LoginUrl(string loginID, out string SID)
        {
            if (AppUtil.LoginAuth == AppUtil.LOGIN_EXP)
            {
                EXP.LoginUrl(loginID, out SID);
            }
            else
            {
                LCL.LoginUrl(loginID, out SID);
            }
            LCL.DelLogin();
        }

        public static void GetUserConfig(LoginItem login, out Dictionary<string, string> items)
        {
            LCL.GetUserConfig(login, out items);
        }

        public static void GetModalityConfig(LoginItem login, out Dictionary<string, Dictionary<string, string>> items)
        {
            LCL.GetModalityConfig(login, out items);
        }

        public static void GetAnnotationList(LoginItem login, out List<AnnotationItem> items)
        {
            LCL.GetAnnotationList(login, out items);
        }

        public static void GetStorageList(out List<StorageItem> items)
        {
            LCL.GetStorageList(out items);
        }

        public static void SetUserConfig(string UserID, Dictionary<string, string> items)
        {
            LCL.SetUserConfig(UserID, items);
        }

        public static bool SetUserPassword(string UserID, string Password, string NewPassword)
        {
            return LCL.SetUserPassword(UserID, Password, NewPassword);
        }

        public static void CheckLoginID(string LoginID, out bool used)
        {
            LCL.CheckLoginID(LoginID, out used);
        }

        public static void GetSaiban(string SaibanID, out string item)
        {
            LCL.GetSaiban(SaibanID, out item);
        }

        public static void GetMServerConfig(out Dictionary<string, Tuple<string, string>> items)
        {
            LCL.GetMServerConfig(out items);
        }

        public static void SetMServerConfig(Dictionary<string, string> items)
        {
            LCL.SetMServerConfig(items);
        }

        public static void GetMSystemConfig(out Dictionary<string, Tuple<string, string>> items)
        {
            LCL.GetMSystemConfig(out items);
        }

        public static void SetMSystemConfig(Dictionary<string, string> items)
        {
            LCL.SetMSystemConfig(items);
        }

        public static void GetMGroup(out List<MGroupItem> items)
        {
            LCL.GetMGroup(out items);
        }

        public static void SetMGroup(MGroupItem item, DbActionType type)
        {
            LCL.SetMGroup(item, type);
        }

        public static void GetMGroupConfig(string GroupID, out Dictionary<string, string> items)
        {
            LCL.GetMGroupConfig(GroupID, out items);
        }

        public static void SetMGroupConfig(string GroupID, Dictionary<string, string> items)
        {
            LCL.SetMGroupConfig(GroupID, items);
        }

        public static void GetMUser(int IsAdmin, out List<MUserItem> items)
        {
            LCL.GetMUser(IsAdmin, out items);
        }

        public static void SetMUser(MUserItem item, DbActionType type)
        {
            LCL.SetMUser(item, type);
        }

        public static void GetMUserConfig(string UserID, out Dictionary<string, string> items)
        {
            LCL.GetMUserConfig(UserID, out items);
        }

        public static void SetMUserConfig(string UserID, Dictionary<string, string> items)
        {
            LCL.SetMUserConfig(UserID, items);
        }

        public static void GetMStorage(out List<MStorageItem> items)
        {
            LCL.GetMStorage(out items);
        }

        public static void SetMStorage(MStorageItem item, DbActionType type)
        {
            LCL.SetMStorage(item, type);
        }

        public static void GetMModalityConfig_Modality(string GroupID, out List<string> items)
        {
            LCL.GetMModalityConfig_Modality(GroupID, out items);
        }

        public static void GetMModalityConfig(string GroupID, string Modality, out Dictionary<string, Tuple<string, string>> items)
        {
            LCL.GetMModalityConfig(GroupID, Modality, out items);
        }

        public static void SetMModalityConfig(string GroupID, string Modality, Dictionary<string, string> items)
        {
            LCL.SetMModalityConfig(GroupID, Modality, items);
        }

        public static void GetMAnnotation_Modality(string GroupID, out List<string> items)
        {
            LCL.GetMAnnotation_Modality(GroupID, out items);
        }

        public static void GetMAnnotation(string GroupID, string Modality, out List<AnnotationItem> items)
        {
            LCL.GetMAnnotation(GroupID, Modality, out items);
        }

        public static void SetMAnnotation(string GroupID, string Modality, List<AnnotationItem> items)
        {
            LCL.SetMAnnotation(GroupID, Modality, items);
        }

        //T

        public static void GetStudyList(FindParam prm, out List<StudyTag> tags, out int count)
        {
            if (prm.IsPacsSearch)
            {
                DCM.GetStudyList(prm, out tags, out count);
            }
            else if (AppUtil.DbType == AppUtil.DB_RS)
            {
                RS.GetStudyList(prm, out tags, out count);
            }
            else if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                YCOM.GetStudyList(prm, out tags, out count);
            }
            else
            {
                LCL.GetStudyList(prm, out tags, out count);
            }
        }

        public static void GetStudyList_Kako(string patientid, StudyKey key, out List<StudyTag> tags)
        {
            if (key.IsPacsSearch)
            {
                DCM.GetStudyList_Kako(patientid, key, out tags);
            }
            else if (AppUtil.DbType == AppUtil.DB_RS)
            {
                RS.GetStudyList_Kako(patientid, key, out tags);
            }
            else if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                YCOM.GetStudyList_Kako(patientid, key, out tags);
            }
            else
            {
                LCL.GetStudyList_Kako(patientid, key, out tags);
            }
        }

        public static bool GetStudyKey(FindParam prm, out string patientid, out List<string> studykey)
        {
            if (prm.IsPacsSearch)
            {
                return DCM.GetStudyKey(prm, out patientid, out studykey);
            }
            else if (AppUtil.DbType == AppUtil.DB_RS)
            {
                return RS.GetStudyKey(prm, out patientid, out studykey);
            }
            else if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                return YCOM.GetStudyKey(prm, out patientid, out studykey);
            }
            else
            {
                return LCL.GetStudyKey(prm, out patientid, out studykey);
            }
        }

        public static void GetSeriesList(StudyKey key, out List<SeriesTag> tags)
        {
            if (key.IsPacsSearch)
            {
                DCM.GetSeriesList(key, out tags);
            }
            else if (AppUtil.DbType == AppUtil.DB_RS)
            {
                RS.GetSeriesList(key, out tags);
            }
            else if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                YCOM.GetSeriesList(key, out tags);
            }
            else
            {
                LCL.GetSeriesList(key, out tags);
            }
        }

        public static void GetImageList(LoginItem login, SeriesKey key, out List<ImageTag> imTags, out List<SeriesTag> seTags)
        {
            if (key.IsPacsSearch)
            {
                DCM.GetImageList(login, key, out imTags, out seTags);
            }
            else if (AppUtil.DbType == AppUtil.DB_RS)
            {
                RS.GetImageList(key, out imTags);
                seTags = null;
            }
            else if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                YCOM.GetImageList(key, out imTags);
                seTags = null;
            }
            else
            {
                LCL.GetImageList(key, out imTags);
                seTags = null;
            }
        }
        public static void GetImageList(ImageKey[] keys, out List<ImageTag> tags)
        {
            DCM.GetImageList(keys, out tags);
        }

        public static void GetThumbnail(SeriesKey key, out byte[] thumb, out bool save)
        {
            if (key.IsPacsSearch)
            {
                DCM.GetThumbnail(key, out thumb);
                save = true;
            }
            else if (AppUtil.DbType == AppUtil.DB_RS)
            {
                RS.GetThumbnail(key, out thumb);
                save = false;
            }
            else if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                YCOM.GetThumbnail(key, out thumb, out save);
            }
            else
            {
                LCL.GetThumbnail(key, out thumb);
                save = true;
            }
        }

        public static void GetStudyMemo(StudyKey key, out StudyMemoItem item, out int count)
        {
            if (AppUtil.DbType == AppUtil.DB_CLD)
            {
                LCL.GetStudyMemo(key, out item, out count);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        public static void GetStudyMemoHistory(StudyKey key, out List<StudyMemoItem> items)
        {
            if (AppUtil.DbType == AppUtil.DB_CLD)
            {
                LCL.GetStudyMemoHistory(key, out items);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        public static bool SetStudyMemo(StudyKey key, StudyMemoItem item)
        {
            if (AppUtil.DbType == AppUtil.DB_CLD)
            {
                return LCL.SetStudyMemo(key, item);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        public static bool SetComment(StudyKey key, string item)
        {
            if (AppUtil.DbType == AppUtil.DB_CLD)
            {
                return LCL.SetComment(key, item);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        public static bool SetKeyword(StudyKey key, string item)
        {
            if (AppUtil.DbType == AppUtil.DB_CLD)
            {
                return LCL.SetKeyword(key, item);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        public static bool DelStudy(StudyKey key, out List<string> items)
        {
            if (AppUtil.DbType == AppUtil.DB_CLD)
            {
                return LCL.DelStudy(key, out items);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        //I

        public static bool DicomToDB(List<Dictionary<string, string>> data)
        {
            return LCL.DicomToDB(data);
        }

        public static bool UpdateStudy(string StudyUid)
        {
            return LCL.UpdateStudy(StudyUid);
        }

        public static void PrefetchImageList(SeriesKey key, out List<string> keys)
        {
            if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                YCOM.PrefetchImageList(key, out keys);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        public static void PrefetchImage(ImageKey key)
        {
            if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                YCOM.PrefetchImage(key);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        public static void GetImageInfo(ImageKey key, out ImageTag tag)
        {
            if (AppUtil.DbType == AppUtil.DB_YCOM)
            {
                YCOM.GetImageInfo(key, out tag);
            }
            else
            {
                throw new NotImplementedException();
            }
        }

        //GSPS

        public static void GetGspsList(SeriesKey key, out List<GSPSItem> items)
        {
            LCL.GetGspsList(key, out items);
        }

        public static void GetGsps(GSPSKey key, out List<ImageKey> items)
        {
            LCL.GetGsps(key, out items);
        }
    }
}
