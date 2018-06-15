using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Web;
using System.Xml.Linq;

namespace ProRadServiceLib
{
    public class ProRadService
    {
        //M

        /// ログイン
        public int Login(string LoginID, string Password, string flag, out string SID)
        {
            SID = null;
            try
            {
                if (LoginID == "")
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.Login(LoginID, Password, flag, out SID);
                if (SID != null)
                {
                    LogUtil.Info1("Login [{0}]", LoginID);
                    return AppUtil.RTN_OK;
                }
                else
                {
                    LogUtil.Warn1("Login Error [{0}]", LoginID);
                    return AppUtil.RTN_NOT_LOGIN;
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ログイン
        public int Login2(string LoginID, string Password, string flag, out string SID, out string UserID, out int IsAdmin)
        {
            SID = null;
            UserID = null;
            IsAdmin = 0;
            try
            {
                if (LoginID == "")
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.Login(LoginID, Password, flag, out SID, out UserID, out IsAdmin);
                if (SID != null)
                {
                    LogUtil.Info1("Login [{0}]", LoginID);
                    return AppUtil.RTN_OK;
                }
                else
                {
                    LogUtil.Warn1("Login Error [{0}]", LoginID);
                    return AppUtil.RTN_NOT_LOGIN;
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ログイン(URLコール)
        public int LoginUrl(string LoginID, out string SID)
        {
            SID = null;
            try
            {
                if (AppUtil.LoginUrl != "1")
                {
                    LogUtil.Error("Web.ConfigのLoginUrlが設定されていません");
                    return AppUtil.RTN_NOT_LOGIN;
                }

                if (LoginID == "")
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.LoginUrl(LoginID, out SID);
                if (SID != null)
                {
                    LogUtil.Info1("Login [{0}]", LoginID);
                    return AppUtil.RTN_OK;
                }
                else
                {
                    LogUtil.Warn1("Login Error [{0}]", LoginID);
                    return AppUtil.RTN_NOT_LOGIN;
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ユーザ設定の取得
        public int GetUserConfig(string SID, out Dictionary<string, string> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //設定取得
                DbUtil.GetUserConfig(login, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// モダリティ設定の取得
        public int GetModalityConfig(string SID, out Dictionary<string, Dictionary<string, string>> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //設定取得
                DbUtil.GetModalityConfig(login, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// アノテーション情報の取得
        public int GetAnnotationList(string SID, out List<AnnotationItem> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //取得
                DbUtil.GetAnnotationList(login, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ユーザ設定の保存
        public int SetUserConfig(string SID, Dictionary<string, string> items)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                if (login.UserID != "")
                {
                    DbUtil.SetUserConfig(login.UserID, items);
                }
                else
                {
                    LogUtil.Warn("無効: UserID");
                }
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ユーザパスワードの変更
        public int SetUserPassword(string SID, string Password, string NewPassword)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                if (login.UserID != "")
                {
                    if (DbUtil.SetUserPassword(login.UserID, Password, NewPassword))
                        return AppUtil.RTN_OK;
                }
                else
                {
                    LogUtil.Warn("無効: UserID");
                }

                return AppUtil.RTN_ERR;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// LoginIDのチェック
        public int CheckLoginID(string SID, string LoginID, out bool used)
        {
            used = false;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.CheckLoginID(LoginID, out used);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// 採番マスタの取得
        public int GetSaiban(string SID, string SaibanID, out string item)
        {
            item = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                //取得
                DbUtil.GetSaiban(SaibanID, out item);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// サーバー設定マスタの取得
        public int GetMServerConfig(string SID, out Dictionary<string, Tuple<string, string>> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMServerConfig(out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// サーバー設定マスタの保存
        public int SetMServerConfig(string SID, Dictionary<string, string> items)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 1)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.SetMServerConfig(items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// システム設定マスタの取得
        public int GetMSystemConfig(string SID, out Dictionary<string, Tuple<string, string>> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMSystemConfig(out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// システム設定マスタの保存
        public int SetMSystemConfig(string SID, Dictionary<string, string> items)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 1)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.SetMSystemConfig(items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// グループ情報マスタの取得
        public int GetMGroup(string SID, out List<MGroupItem> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMGroup(out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// グループ情報マスタの保存
        public int SetMGroup(string SID, MGroupItem item, DbActionType type)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.SetMGroup(item, type);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// グループ設定マスタの取得
        public int GetMGroupConfig(string SID, string GroupID, out Dictionary<string, string> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMGroupConfig(GroupID, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// グループ設定マスタの保存
        public int SetMGroupConfig(string SID, string GroupID, Dictionary<string, string> items)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.SetMGroupConfig(GroupID, items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ユーザ情報マスタの取得
        public int GetMUser(string SID, out List<MUserItem> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMUser(login.IsAdmin, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ユーザ情報マスタの保存
        public int SetMUser(string SID, MUserItem item, DbActionType type)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.SetMUser(item, type);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ユーザ設定マスタの取得
        public int GetMUserConfig(string SID, string UserID, out Dictionary<string, string> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMUserConfig(UserID, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ユーザ設定マスタの保存
        public int SetMUserConfig(string SID, string UserID, Dictionary<string, string> items)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.SetMUserConfig(UserID, items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ストレージ情報マスタの取得
        public int GetMStorage(string SID, out List<MStorageItem> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMStorage(out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ストレージ情報マスタの保存
        public int SetMStorage(string SID, MStorageItem item, DbActionType type)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 1)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.SetMStorage(item, type);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// モダリティ設定マスタのモダリティ取得
        public int GetMModalityConfig_Modality(string SID, string GroupID, out List<string> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMModalityConfig_Modality(GroupID, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// モダリティ設定マスタの取得
        public int GetMModalityConfig(string SID, string GroupID, string Modality, out Dictionary<string, Tuple<string, string>> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMModalityConfig(GroupID, Modality, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// モダリティ設定マスタの保存
        public int SetMModalityConfig(string SID, string GroupID, string Modality, Dictionary<string, string> items)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.SetMModalityConfig(GroupID, Modality, items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// アノテーション設定マスタのモダリティ取得
        public int GetMAnnotation_Modality(string SID, string GroupID, out List<string> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMAnnotation_Modality(GroupID, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// アノテーション設定マスタの取得
        public int GetMAnnotation(string SID, string GroupID, string Modality, out List<AnnotationItem> items)
        {
            items = null;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetMAnnotation(GroupID, Modality, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// アノテーション設定マスタの保存
        public int SetMAnnotation(string SID, string GroupID, string Modality, List<AnnotationItem> items)
        {
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //権限チェック
                if (login.IsAdmin <= 0)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.SetMAnnotation(GroupID, Modality, items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// RSKey文字列の取得
        public int ToRSKeyString(string SID, RSKey rskey, out string rskeyString)
        {
            rskeyString = "";
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                if (rskey == null)
                {
                    LogUtil.Error("Not RSKey");
                    return AppUtil.RTN_ERR;
                }

                if (rskey.PatientID == null || rskey.PatientID == "")
                {
                    LogUtil.Error("Not RSKey.PatientID");
                    return AppUtil.RTN_ERR;
                }

                rskeyString = ConvertUtil.Serialize(rskey);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// RSKey⇒StudyKeyの取得
        public int RSKey2StudyKey(string SID, string rskey, out string patientid, out string studykey, out string path, out FindParam prm)
        {
            patientid = "";
            studykey = "";
            path = "";
            prm = new FindParam();
            try
            {
                var key = ConvertUtil.Deserialize<RSKey>(rskey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //var prm = new FindParam();
                prm.PatientID = key.PatientID;
                prm.StudyDateFrom = key.StudyDate;
                prm.StudyDateTo = key.StudyDate;
                prm.Modality = key.Modality;
                prm.AccessionNumber = key.OrderNo;

                path = System.IO.Path.Combine(key.UserCD.ToString(), key.SerialNo.ToString());

                string patid;
                List<string> stkeys;
                DbUtil.GetStudyKey(prm, out patid, out stkeys);

                if (stkeys == null)
                {
                    //複数患者
                    patientid = "";
                    studykey = "";
                    return 10;
                }
                else if (stkeys.Count >= 2)
                {
                    //複数検査
                    patientid = patid;
                    studykey = stkeys[0];
                    return 11;
                }
                else if (stkeys.Count == 0)
                {
                    //0件
                    patientid = "";
                    studykey = "";
                    return AppUtil.RTN_OK;
                }
                else
                {
                    patientid = patid;
                    studykey = stkeys[0];
                    return AppUtil.RTN_OK;
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        //T

        /// 検査一覧の取得
        public int GetStudyList(string SID, FindParam prm, out List<StudyTag> tags, out int count)
        {
            tags = null;
            count = 0;
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetStudyList(prm, out tags, out count);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// 検査一覧の取得 (過去検査)
        public int GetStudyList_Kako(string SID, string patientid, string studykey, out List<StudyTag> tags)
        {
            tags = null;
            try
            {
                var key = ConvertUtil.Deserialize<StudyKey>(studykey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetStudyList_Kako(patientid, key, out tags);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// STUDYキーの取得 (URLコール用)
        public int GetStudyKey(string SID, FindParam prm, out string patientid, out string studykey)
        {
            patientid = "";
            studykey = "";
            try
            {
                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                string patid;
                List<string> stkeys;
                DbUtil.GetStudyKey(prm, out patid, out stkeys);

                if (stkeys == null)
                {
                    //複数患者
                    patientid = "";
                    studykey = "";
                    return 10;
                }
                else if (stkeys.Count >= 2)
                {
                    //複数検査
                    patientid = patid;
                    studykey = stkeys[0];
                    return 11;
                }
                else if (stkeys.Count == 0)
                {
                    //0件
                    patientid = "";
                    studykey = "";
                    return AppUtil.RTN_OK;
                }
                else
                {
                    patientid = patid;
                    studykey = stkeys[0];
                    return AppUtil.RTN_OK;
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// シリーズ一覧の取得
        public int GetSeriesList(string SID, string studykey, out List<SeriesTag> tags)
        {
            tags = null;
            try
            {
                var key = ConvertUtil.Deserialize<StudyKey>(studykey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetSeriesList(key, out tags);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// イメージ一覧の取得
        public int GetImageList(string SID, string serieskey, out List<ImageTag> imTags, out List<SeriesTag> seTags)
        {
            imTags = null;
            seTags = null;
            try
            {
                var key = ConvertUtil.Deserialize<SeriesKey>(serieskey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetImageList(login, key, out imTags, out seTags);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// イメージ一覧の取得（横展開 ダイナミック検査用?）
        public int GetImageList2(string SID, List<string> imagekeys, out List<ImageTag> tags)
        {
            tags = null;
            try
            {
                LoginItem login = null;

                var keys = new List<ImageKey>();
                foreach (var imagekey in imagekeys)
                {
                    var key = ConvertUtil.Deserialize<ImageKey>(imagekey);

                    //ログインチェック
                    if (login == null)
                    {
                        DbUtil.LoginCheck(SID, out login);
                        if (login == null)
                            return AppUtil.RTN_NOT_LOGIN;
                    }

                    keys.Add(key);
                }

                DbUtil.GetImageList(keys.ToArray(), out tags);

                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// スタディの削除
        public int DelStudy(string SID, string studykey)
        {
            try
            {
                var key = ConvertUtil.Deserialize<StudyKey>(studykey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                if (AppUtil.DbType == AppUtil.DB_CLD)
                {
                    List<string> stoList;
                    if (!DbUtil.DelStudy(key, out stoList))
                        return AppUtil.RTN_ERR;

                    LogUtil.Info1("DB DEL[{0}]", key.StudyInstanceUID);

                    foreach (var stoId in stoList)
                    {
                        var sto = DbCacheUtil.GetStorage(stoId);
                        using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                        {
                            var dicomDir = Path.Combine(sto.DicomPath, key.StudyInstanceUID);
                            if (FileUtil.Delete(dicomDir, false))
                                LogUtil.Info1("DICOM DEL[{0}]", dicomDir);
                        }
                    }
                }
                else if(AppUtil.DbType == AppUtil.DB_YCOM)
                {
                    var sto = DbCacheUtil.GetStorage();
                    using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                    {
                        var dicomDir = Path.Combine(sto.DicomPath, key.StudyInstanceUID);
                        if (FileUtil.Delete(dicomDir, false))
                            LogUtil.Info1("CACHE DEL[{0}]", dicomDir); 
                    }
                }

                var thumbDir = Path.Combine(AppUtil.ThumbPath, key.StudyInstanceUID);
                FileUtil.Delete(thumbDir, true);

                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// 検査メモの取得
        public int GetStudyMemo(string SID, string studykey, out StudyMemoItem item, out int count)
        {
            item = null;
            count = 0;
            try
            {
                var key = ConvertUtil.Deserialize<StudyKey>(studykey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetStudyMemo(key, out item, out count);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// 検査メモ履歴の取得
        public int GetStudyMemoHistory(string SID, string studykey, out List<StudyMemoItem> items)
        {
            items = null;
            try
            {
                var key = ConvertUtil.Deserialize<StudyKey>(studykey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetStudyMemoHistory(key, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// 検査メモの設定
        public int SetStudyMemo(string SID, string studykey, StudyMemoItem item)
        {
            try
            {
                var key = ConvertUtil.Deserialize<StudyKey>(studykey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                if (DbUtil.SetStudyMemo(key, item))
                {
                    //XML出力
                    if (AppUtil.MemoOutputPath != "" && Directory.Exists(AppUtil.MemoOutputPath))
                    {
                        StudyTag tag;
                        LCL.GetReportInfo(key, out tag);

                        var doc = new XDocument(new XDeclaration("1.0", "utf-8", ""));
                        var root = new XElement("root");
                        doc.Add(root);
                        root.Add(
                            new XElement("info",
                                new XElement("AcsessionNo", tag.AccessionNumber),
                                new XElement("StudyInstanceUID", key.StudyInstanceUID),
                                new XElement("PatientID", tag.PatientID),
                                new XElement("StudyDate", tag.StudyDate),
                                new XElement("StudyTime", tag.StudyTime.Length != 6 ? tag.StudyTime : string.Format("{0}:{1}:{2}", tag.StudyTime.Substring(0, 2), tag.StudyTime.Substring(2, 2), tag.StudyTime.Substring(4, 2))),
                                new XElement("Modality", tag.Modality)
                            )
                        );
                        root.Add(
                            new XElement("UpdateData",
                                new XElement("Finding", HttpUtility.HtmlEncode(item.Memo)),
                                new XElement("Diagnosing", ""),
                                new XElement("ReadPhysicianName", HttpUtility.HtmlEncode(item.UserName))
                            )
                        );

                        try
                        {
                            string OrderNo = tag.AccessionNumber != "" ? tag.AccessionNumber : key.StudyInstanceUID;
                            string file = Path.Combine(AppUtil.MemoOutputPath, OrderNo + DateTime.Now.ToString("yyyyMMddHHmmssfff") + ".xml");
                            doc.Save(file);
                        }
                        catch (Exception ex)
                        {
                            LogUtil.Error4("{0} [{1}][{2}][{3}]", ex.ToString(), key.StudyInstanceUID, item.MemoDate.ToString("yyyy/MM/dd HH:mm:ss"), item.UserName);
                        }
                    }

                    return AppUtil.RTN_OK;
                }
                else
                {
                    return AppUtil.RTN_ERR;
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// コメントの設定
        public int SetComment(string SID, string studykey, string item)
        {
            try
            {
                var key = ConvertUtil.Deserialize<StudyKey>(studykey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                if (DbUtil.SetComment(key, item))
                {
                    return AppUtil.RTN_OK;
                }
                else
                {
                    return AppUtil.RTN_ERR;
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// キーワードの設定
        public int SetKeyword(string SID, string studykey, string item)
        {
            try
            {
                var key = ConvertUtil.Deserialize<StudyKey>(studykey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                if (DbUtil.SetKeyword(key, item))
                {
                    return AppUtil.RTN_OK;
                }
                else
                {
                    return AppUtil.RTN_ERR;
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// 画像転送要求
        public int ImageTransferRequest(string SID, KeyType type, string Key)
        {
            try
            {
                dynamic key;
                if (type == KeyType.Study)
                {
                    key = ConvertUtil.Deserialize<StudyKey>(Key);
                }
                else if (type == KeyType.Series)
                {
                    key = ConvertUtil.Deserialize<SeriesKey>(Key);
                }
                else
                {
                    key = ConvertUtil.Deserialize<ImageKey>(Key);
                }

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //転送要求ファイル出力？
                //ファイル出力？




                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        //I

        /// サムネイルの取得
        public int GetThumbnail(string SID, string serieskey, out byte[] thumb)
        {
            thumb = null;
            try
            {
                var key = ConvertUtil.Deserialize<SeriesKey>(serieskey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                var file = FileUtil.GetThumbFile(key);
                if (File.Exists(file))
                {
                    ImageUtil.ImageToThumb(file, out thumb);
                }
                else
                {
                    bool save;
                    DbUtil.GetThumbnail(key, out thumb, out save);

                    if (thumb != null && save)
                    {
                        var dir = Path.GetDirectoryName(file);
                        if (!Directory.Exists(dir))
                            Directory.CreateDirectory(dir);

                        File.WriteAllBytes(file, thumb);
                    }
                }

                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// サムネイルの取得（PACSモードでの横展開）
        public int GetThumbnail2(string SID, string imagekey, out byte[] thumb)
        {
            thumb = null;
            try
            {
                var key = ConvertUtil.Deserialize<ImageKey>(imagekey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                var file = FileUtil.GetThumbFile(key);
                if (File.Exists(file))
                {
                    ImageUtil.ImageToThumb(file, out thumb);
                }
                else
                {
                    var sto = DbCacheUtil.GetStorage(key.StorageID);
                    using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                    {
                        var dicomFile = FileUtil.GetDicomFile(key);
                        if (File.Exists(dicomFile))
                        {
                            DicomUtil.DicomToThumb(dicomFile, out thumb);
                            if (thumb != null)
                            {
                                var dir = Path.GetDirectoryName(file);
                                if (!Directory.Exists(dir))
                                    Directory.CreateDirectory(dir);

                                File.WriteAllBytes(file, thumb);
                            }
                        }
                    }
                }

                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        static object cacheLock = new object();

        /// イメージの取得
        public int GetImage(string SID, string imagekey, int level, int cx, int cy, int cw, int ch, double wc, double ww, int rot, int flipX, out byte[] image)
        {
            return GetImage2(SID, imagekey, level, cx, cy, cw, ch, wc, ww, rot, flipX, false, out image);
        }
        public int GetImage2(string SID, string imagekey, int level, int cx, int cy, int cw, int ch, double wc, double ww, int rot, int flipX, bool preview, out byte[] image)
        {
            image = null;
            try
            {
                var key = ConvertUtil.Deserialize<ImageKey>(imagekey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //キャッシュ
                var cacheFile = Path.Combine(AppUtil.ThumbPath, key.StudyInstanceUID, key.SeriesInstanceUID, string.Format("{0}_{1}.jpg", key.SOPInstanceUID, key.FrameNumber));
                if (preview)
                {
                    if (File.Exists(cacheFile))
                    {
                        image = File.ReadAllBytes(cacheFile);
                        return AppUtil.RTN_OK;
                    }
                }

                var sto = DbCacheUtil.GetStorage(key.StorageID);
                using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                {
                    var file = FileUtil.GetDicomFile(key);
                    if (File.Exists(file))
                    {
                        //画像取得
                        ImageUtil.GetJpeg(file, key.FrameNumber, level, cx, cy, cw, ch, wc, ww, rot, flipX, out image);

                        //キャッシュ
                        if (preview && image != null)
                        {
                            if (!File.Exists(cacheFile))
                            {
                                lock (cacheLock)
                                {
                                    if (!File.Exists(cacheFile))
                                    {
                                        var dir = Path.GetDirectoryName(cacheFile);
                                        if (!Directory.Exists(dir))
                                            Directory.CreateDirectory(dir);

                                        File.WriteAllBytes(cacheFile, image);
                                    }
                                }
                            }
                        }
                    }
                }

                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// DICOMタグの取得
        public int GetDicomTag(string SID, string imagekey, uint[] tags, out List<DicomTagItem> items)
        {
            items = null;
            try
            {
                var key = ConvertUtil.Deserialize<ImageKey>(imagekey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                var sto = DbCacheUtil.GetStorage(key.StorageID);
                using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                {
                    string file = FileUtil.GetDicomFile(key);
                    if (File.Exists(file))
                    {
                        DicomUtil.GetDicomTag(file, tags, out items);
                    }
                }

                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// DICOMタグの取得
        public int GetDicomTagAll(string SID, string imagekey, out List<DicomTagItem> items)
        {
            items = null;
            try
            {
                var key = ConvertUtil.Deserialize<ImageKey>(imagekey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                var sto = DbCacheUtil.GetStorage(key.StorageID);
                using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                {
                    string file = FileUtil.GetDicomFile(key);
                    if (File.Exists(file))
                    {
                        DicomUtil.GetDicomTagAll(file, out items);
                    }
                }

                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// ROI取得
        public int GetRoi(string SID, string imagekey, Point p1, Point p2, out RoiItem roi)
        {
            roi = null;
            try
            {
                var key = ConvertUtil.Deserialize<ImageKey>(imagekey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                var sto = DbCacheUtil.GetStorage(key.StorageID);
                using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                {
                    var file = FileUtil.GetDicomFile(key);
                    if (File.Exists(file))
                    {
                        //ROI取得
                        ImageUtil.GetRoi(file, key.FrameNumber, p1, p2, out roi);
                    }
                }

                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// キャプチャ出力
        public int PutImage(string SID, string[] trace, string path)
        {
            try
            {
                string imagekey = "";

                foreach (var line in trace)
                {
                    var tokens = TraceCapture.lex(line);
                    if (tokens.Length == 0)
                        continue;
                    if (tokens[0] == "set" && tokens[1] == "ImageKey")
                    {
                        imagekey = tokens[2];
                    }
                }

                var key = ConvertUtil.Deserialize<ImageKey>(imagekey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                //出力ファイル
                var outfile = string.Format("{0}_{1}.jpg", Path.Combine(AppUtil.ReportPath, path), DateTime.Now.ToString("yyMMddHHmmssfff"));
                var outdir = Path.GetDirectoryName(outfile);
                if (!Directory.Exists(outdir))
                    Directory.CreateDirectory(outdir);

                var sto = DbCacheUtil.GetStorage(key.StorageID);
                using (var imp = new Impersonate(sto.LogonUsername, sto.LogonPassword))
                {
                    var file = FileUtil.GetDicomFile(key);
                    if (File.Exists(file))
                    {
                        //画像出力
                        ImageUtil.PutImage(file, key.FrameNumber, trace, outfile);
                    }
                }

                if (File.Exists(outfile))
                {
                    if (new FileInfo(outfile).Length > 0)
                    {
                        return AppUtil.RTN_OK;
                    }
                    else
                    {
                        try
                        {
                            File.Delete(outfile);
                        }
                        catch { }
                    }
                }

                //エラーログ
                var sb = new System.Text.StringBuilder();
                foreach (var t in trace)
                {
                    sb.Append("[" + t + "],");
                }
                LogUtil.Error2("path={0} trace={1}", path, sb.ToString().TrimEnd(','));

                return AppUtil.RTN_ERR;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// プリフェッチ
        public int PrefetchImageList(string SID, string serieskey, out List<string> keys)
        {
            keys = null;
            try
            {
                var key = ConvertUtil.Deserialize<SeriesKey>(serieskey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.PrefetchImageList(key, out keys);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// プリフェッチ
        public int PrefetchImage(string SID, string imagekey)
        {
            try
            {
                var key = ConvertUtil.Deserialize<ImageKey>(imagekey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.PrefetchImage(key);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// イメージ情報の取得
        public int GetImageInfo(string SID, string imagekey, out ImageTag tag)
        {
            tag = null;
            try
            {
                var key = ConvertUtil.Deserialize<ImageKey>(imagekey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetImageInfo(key, out tag);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        //GSPS

        /// GSPS一覧の取得
        public int GetGspsList(string SID, string serieskey, out List<GSPSItem> items)
        {
            items = null;
            try
            {
                var key = ConvertUtil.Deserialize<SeriesKey>(serieskey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                DbUtil.GetGspsList(key, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }

        /// GSPSデータの取得
        public int GetGsps(string SID, string gspskey, out Dictionary<string, GSPSDataItem> items)
        {
            items = null;
            try
            {
                var key = ConvertUtil.Deserialize<GSPSKey>(gspskey);

                //ログインチェック
                LoginItem login = null;
                DbUtil.LoginCheck(SID, out login);
                if (login == null)
                    return AppUtil.RTN_NOT_LOGIN;

                ImageUtil.GetGsps(key, out items);
                return AppUtil.RTN_OK;
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex.ToString());
                return AppUtil.RTN_ERR;
            }
        }
    }
}
