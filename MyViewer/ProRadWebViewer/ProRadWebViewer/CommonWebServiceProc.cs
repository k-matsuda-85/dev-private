using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Security.Cryptography;
using System.ServiceModel;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using ProRadWebViewer.ProRadService;

namespace ProRadWebViewer
{
    // 各種サービス用処理クラス
    class CommonWebServiceProc
    {
        // 各種コンフィグ設定値
        private static readonly string LoginIDMode = ConfigurationManager.AppSettings["LoginIDMode"] ?? "";
        private static readonly string DefLoginID = ConfigurationManager.AppSettings["DefLoginID"] ?? "";
        private static readonly string DefPassword = ConfigurationManager.AppSettings["DefPassword"] ?? "";
        private static readonly string URLCallSID = ConfigurationManager.AppSettings["URLCallSID"] ?? "";
        private static readonly string FigurePassword = ConfigurationManager.AppSettings["FigurePassword"] ?? "";

        // ログイン
        public static bool Login(string LoginID, string Password, string Extension)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // サービス呼び出し
                string SID;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.Login(out SID, LoginID, Password, "");
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Warning, "{0}[{1}]", "LoginNG", LoginID);
                    return false;
                }

                // セッションに登録
                HttpContext.Current.Session["sid"] = SID;
                if (Extension == "Login")
                {
                    HttpContext.Current.Session["login"] = "1";
                }
                else if (Extension == "Portal")
                {
                    HttpContext.Current.Session["login"] = "3";
                }
                LogUtil.Write(LogType.Information, "{0}[{1}]", "Login", LoginID);
                return true;
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return false;
            }
        }

        // ログアウト
        public static bool Logout()
        {
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // 検索で使用する情報を削除
                HttpContext.Current.Session.Remove("sid");
                HttpContext.Current.Session.Remove("login");
                HttpContext.Current.Session.Remove("prmhospitalid");
                HttpContext.Current.Session.Remove("prmpatientid");
                HttpContext.Current.Session.Remove("prmmodality");
                HttpContext.Current.Session.Remove("prmdate");
                HttpContext.Current.Session.Remove("prmaccessionno");
                LogUtil.Write(LogType.Information, "{0}", "Logout");
                return true;
            }
            catch (Exception ex)
            {
                // エラー
                LogUtil.Write(LogType.Error, ex);
                return false;
            }
        }

        // パスワード設定
        public static WebResult SetUserPassword(string Password, string NewPassword)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = (string)HttpContext.Current.Session["sid"];
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebResult() { Result = "Error", Message = "NoSession" };
                }

                // パスワードチェック
                int figure;
                if (int.TryParse(FigurePassword, out figure) && NewPassword.Length < figure)
                {
                    // エラー
                    LogUtil.Write(LogType.Warning, "{0}[{1}]", "ParameterNG", NewPassword);
                    return new WebResult() { Result = "Error", Message = "ParameterNG" };
                }
                else if (NewPassword.Length > 64)
                {
                    // エラー
                    LogUtil.Write(LogType.Warning, "{0}[{1}]", "ParameterNG", NewPassword);
                    return new WebResult() { Result = "Error", Message = "ParameterNG" };
                }
                else if (IsSpaceText(NewPassword))
                {
                    // エラー
                    LogUtil.Write(LogType.Warning, "{0}[{1}]", "ParameterNG", NewPassword);
                    return new WebResult() { Result = "Error", Message = "ParameterNG" };
                }

                // サービス呼び出し
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.SetUserPassword(sid, Password, NewPassword);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Warning, "{0}[{1}]", "PasswordNG", ret);
                    return new WebResult() { Result = "Error", Message = "ServiceError" };
                }
                return new WebResult() { Result = "Success" };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebResult() { Result = "Error", Message = "Exception" };
            }
        }

        // パラメータ設定
        public static bool SetParams(Dictionary<string, string> Param)
        {
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションに設定
                foreach (var key in Param.Keys)
                {
                    // 特定のキーは無視する
                    if (key == "sid")
                    {
                        continue;
                    }
                    HttpContext.Current.Session[key] = Param[key];
                }
                return true;
            }
            catch (Exception ex)
            {
                // エラー
                LogUtil.Write(LogType.Error, ex);
                return false;
            }
        }

        // パラメータ取得
        public static WebParams GetParams(string SKey)
        {
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // データ作成
                var webParams = new Dictionary<string, string>();

                // 取得するキーをチェック
                if (SKey == "")
                {
                    // 通常ログインに必要なパラメータを設定
                    if (HttpContext.Current.Session["login"] != null)
                    {
                        webParams.Add("login", (string)HttpContext.Current.Session["login"]);
                    }
                    if (HttpContext.Current.Session["prmhospitalid"] != null)
                    {
                        webParams.Add("prmhospitalid", (string)HttpContext.Current.Session["prmhospitalid"]);
                    }
                    if (HttpContext.Current.Session["prmpatientid"] != null)
                    {
                        webParams.Add("prmpatientid", (string)HttpContext.Current.Session["prmpatientid"]);
                    }
                    if (HttpContext.Current.Session["prmmodality"] != null)
                    {
                        webParams.Add("prmmodality", (string)HttpContext.Current.Session["prmmodality"]);
                    }
                    if (HttpContext.Current.Session["prmdate"] != null)
                    {
                        webParams.Add("prmdate", (string)HttpContext.Current.Session["prmdate"]);
                    }
                    if (HttpContext.Current.Session["prmaccessionno"] != null)
                    {
                        webParams.Add("prmaccessionno", (string)HttpContext.Current.Session["prmaccessionno"]);
                    }
                    if (HttpContext.Current.Session["patientid"] != null)
                    {
                        webParams.Add("patientid", (string)HttpContext.Current.Session["patientid"]);
                    }
                    if (HttpContext.Current.Session["studykey"] != null)
                    {
                        webParams.Add("studykey", (string)HttpContext.Current.Session["studykey"]);
                    }
                    if (HttpContext.Current.Session["serieskey"] != null)
                    {
                        webParams.Add("serieskey", (string)HttpContext.Current.Session["serieskey"]);
                    }

                    // ログインパスワード桁数を追加
                    webParams.Add("figurepassword", FigurePassword);
                }
                else
                {
                    // URLコールに必要なパラメータを設定
                    if (HttpContext.Current.Session["patientid_" + SKey] != null)
                    {
                        webParams.Add("patientid", (string)HttpContext.Current.Session["patientid_" + SKey]);
                    }
                    if (HttpContext.Current.Session["studykey_" + SKey] != null)
                    {
                        webParams.Add("studykey", (string)HttpContext.Current.Session["studykey_" + SKey]);
                    }
                    if (HttpContext.Current.Session["serieskey_" + SKey] != null)
                    {
                        webParams.Add("serieskey", (string)HttpContext.Current.Session["serieskey_" + SKey]);
                    }
                    if (HttpContext.Current.Session["rsoutpath_" + SKey] != null)
                    {
                        webParams.Add("rsoutpath", (string)HttpContext.Current.Session["rsoutpath_" + SKey]);
                    }
                    if (HttpContext.Current.Session["findmodality_" + SKey] != null)
                    {
                        webParams.Add("findmodality", (string)HttpContext.Current.Session["findmodality_" + SKey]);
                    }
                    if (HttpContext.Current.Session["finddate_" + SKey] != null)
                    {
                        webParams.Add("finddate", (string)HttpContext.Current.Session["finddate_" + SKey]);
                    }
                    if (HttpContext.Current.Session["findaccessionno_" + SKey] != null)
                    {
                        webParams.Add("findaccessionno", (string)HttpContext.Current.Session["findaccessionno_" + SKey]);
                    }

                    // 検査パスワード有無を追加
                    webParams.Add("isStudyPassword", "1");
                }
                return new WebParams() { Result = "Success", Params = webParams };
            }
            catch (Exception ex)
            {
                // エラー
                LogUtil.Write(LogType.Error, ex);
                return new WebParams() { Result = "Error", Message = "Exception" };
            }
        }

        // ユーザーコンフィグ取得
        public static WebUserConfigList GetUserConfig(string SKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebUserConfigList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                Dictionary<string, string> items;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetUserConfig(out items, sid);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebUserConfigList() { Result = "Error", Message = "ServiceError" };
                }
                return new WebUserConfigList() { Result = "Success", Items = items };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebUserConfigList() { Result = "Error", Message = "Exception" };
            }
        }

        // ユーザーコンフィグ設定
        public static WebResult SetUserConfig(Dictionary<string, string> Param)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = (string)HttpContext.Current.Session["sid"];
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebResult() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.SetUserConfig(sid, Param);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebResult() { Result = "Error", Message = "ServiceError" };
                }
                return new WebResult() { Result = "Success" };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebResult() { Result = "Error", Message = "Exception" };
            }
        }

        // モダリティコンフィグ取得
        public static WebModalityConfigList GetModalityConfig(string SKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebModalityConfigList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                Dictionary<string, Dictionary<string, string>> items;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetModalityConfig(out items, sid);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    //エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebModalityConfigList() { Result = "Error", Message = "ServiceError" };
                }
                return new WebModalityConfigList() { Result = "Success", Items = items };

            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebModalityConfigList() { Result = "Error", Message = "Exception" };
            }
        }

        // アノテーション取得
        public static WebAnnotationList GetAnnotationList(string SKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebAnnotationList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                AnnotationItem[] items;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetAnnotationList(out items, sid);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    //エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebAnnotationList() { Result = "Error", Message = "ServiceError" };
                }

                //タグのグループ,エレメントをUINTに変換
                var anoo = new List<AnnotationItem>();
                foreach (var item in items)
                {
                    string settag = "";
                    foreach (var tag in item.Tag.Split(';'))
                    {
                        string wktag = "";
                        if (tag.IndexOf(',') != -1)
                        {
                            string[] strtag = tag.Split(',');
                            ushort[] ustag = new ushort[2] { Convert.ToUInt16(strtag[0], 16), Convert.ToUInt16(strtag[1], 16) };
                            wktag = ((ustag[0] << 16) | ustag[1]).ToString();
                        }
                        else
                        {
                            wktag = tag;
                        }
                        if (settag == "")
                        {
                            settag = wktag;
                        }
                        else
                        {
                            settag = settag + ";" + wktag;
                        }
                    }
                    anoo.Add(new AnnotationItem()
                    {
                        Modality = item.Modality,
                        Position = item.Position,
                        Format = item.Format,
                        Tag = settag,
                        FontSize = item.FontSize,
                        FontStyle = item.FontStyle
                    });
                }
                return new WebAnnotationList() { Result = "Success", Items = anoo.ToArray() };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebAnnotationList() { Result = "Error", Message = "Exception" };
            }
        }

        // 検査一覧取得
        public static WebStudyList GetStudyList(string[] HospitalID, Dictionary<string, string> FindParam)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = (string)HttpContext.Current.Session["sid"];
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebStudyList() { Result = "Error", Message = "NoSession" };
                }

                // パラメータ作成
                var studyDate = GetDateString(FindParam.ContainsKey("StudyDate") ? FindParam["StudyDate"] : "");
                var param = new FindParam()
                {
                    PatientID = FindParam.ContainsKey("PatientID") ? FindParam["PatientID"] : "",
                    PatientName = FindParam.ContainsKey("PatientsName") ? FindParam["PatientsName"] : "",
                    Modality = FindParam.ContainsKey("Modality") ? FindParam["Modality"] : "",
                    StudyDateFrom = studyDate[0],
                    StudyDateTo = studyDate[1],
                    AccessionNumber = FindParam.ContainsKey("AccessionNumber") ? FindParam["AccessionNumber"] : "",
                    Keyword = FindParam.ContainsKey("Keyword") ? FindParam["Keyword"] : "",
                    Comment = FindParam.ContainsKey("Comment") ? FindParam["Comment"] : "",
                    IsPacsSearch = FindParam.ContainsKey("IsPacsSearch") ? bool.Parse(FindParam["IsPacsSearch"]) : false
                };

                // サービス呼び出し
                StudyTag[] tags;
                int count;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetStudyList(out tags, out count, sid, param);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error,
                        "{0}[{1}] {2}[{3}] {4}[{5}] {6}[{7}] {8}[{9}] {10}[{11}] {12}[{13}] {14}[{15}] {16}[{17}] {18}[{19}]",
                        "ServiceError", ret,
                        "PatientID", param.PatientID,
                        "PatientName", param.PatientName,
                        "Modality", param.Modality,
                        "StudyDateFrom", param.StudyDateFrom,
                        "StudyDateTo", param.StudyDateTo,
                        "AccessionNumber", param.AccessionNumber,
                        "Keyword", param.Keyword,
                        "Comment", param.Comment,
                        "IsPacsSearch", param.IsPacsSearch.ToString()
                        );
                    return new WebStudyList() { Result = "Error", Message = "ServiceError" };
                }

                // データ作成
                var webTags = new List<WebStudyTag>();
                foreach (var t in tags)
                {
                    // データ追加
                    webTags.Add(new WebStudyTag()
                    {
                        AccessionNumber = t.AccessionNumber,
                        BodyPartExamined = t.BodyPartExamined,
                        Modality = t.Modality,
                        NumberOfImages = t.NumberOfImages,
                        PatientID = t.PatientID,
                        PatientsAge = t.PatientAge,
                        PatientsBirthDate = t.PatientBirthDate,
                        PatientsName = t.PatientName,
                        PatientsSex = t.PatientSex,
                        StudyDate = t.StudyDate,
                        StudyDescription = t.StudyDescription,
                        StudyTime = t.StudyTime,
                        UploadDate = "",
                        UploadTime = "",
                        MemoUmu = t.StudyMemoUmu,
                        Keyword = t.Keyword,
                        Comment = t.Comment,
                        StudyPasswordUmu = 0,
                        StudyPortalUmu = 0,
                        StudyUrlUmu = 0,
                        HospitalID = "",
                        StudyKey = t.StudyKey
                    });
                }
                return new WebStudyList() { Result = "Success", Count = count, Tags = webTags.ToArray() };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebStudyList() { Result = "Error", Message = "Exception" };
            }
        }

        // 過去検査一覧取得
        public static WebStudyList GetPastStudyList(string SKey, string PatientID, string StudyKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebStudyList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                StudyTag[] tags;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetStudyList_Kako(out tags, sid, PatientID, StudyKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebStudyList() { Result = "Error", Message = "ServiceError" };
                }

                // データなし
                if (tags.Length == 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoData");
                    return new WebStudyList() { Result = "Error", Message = "NoData" };
                }

                // データ作成
                var webTags = new List<WebStudyTag>();
                foreach (var t in tags)
                {
                    // データ追加
                    webTags.Add(new WebStudyTag()
                    {
                        AccessionNumber = t.AccessionNumber,
                        BodyPartExamined = t.BodyPartExamined,
                        Modality = t.Modality,
                        NumberOfImages = t.NumberOfImages,
                        PatientID = t.PatientID,
                        PatientsAge = t.PatientAge,
                        PatientsBirthDate = t.PatientBirthDate,
                        PatientsName = t.PatientName,
                        PatientsSex = t.PatientSex,
                        StudyDate = t.StudyDate,
                        StudyDescription = t.StudyDescription,
                        StudyTime = t.StudyTime,
                        UploadDate = "",
                        UploadTime = "",
                        MemoUmu = t.StudyMemoUmu,
                        Keyword = t.Keyword,
                        Comment = t.Comment,
                        StudyPasswordUmu = 0,
                        StudyPortalUmu = 0,
                        StudyUrlUmu = 0,
                        HospitalID = "",
                        StudyKey = t.StudyKey
                    });
                }
                return new WebStudyList() { Result = "Success", Count = webTags.Count, Tags = webTags.ToArray() };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebStudyList() { Result = "Error", Message = "Exception" };
            }
        }

        // シリーズ一覧取得
        public static WebSeriesList GetSeriesList(string SKey, string StudyKey, string Password, bool IsGSPS)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebSeriesList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                SeriesTag[] tags;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetSeriesList(out tags, sid, StudyKey);

                // 結果確認
                if (ret != 0)
                {
                    //エラー
                    ServiceClient.Close();
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError[GetSeriesList]", ret);
                    return new WebSeriesList() { Result = "Error", Message = "ServiceError" };
                }

                // データ作成
                var webTags = new List<WebSeriesTag>();
                foreach (var t in tags)
                {
                    // PR情報ありの場合
                    var webItems = new List<WebGSPSItem>();
                    if (IsGSPS && t.IsGSPS)
                    {
                        GSPSItem[] items;
                        ret = ServiceClient.GetGspsList(out items, sid, t.SeriesKey);

                        // 結果確認
                        if (ret != 0)
                        {
                            //エラー
                            ServiceClient.Close();
                            LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError[GetGspsList]", ret);
                            return new WebSeriesList() { Result = "Error", Message = "ServiceError" };
                        }

                        // データ作成
                        foreach (var i in items)
                        {
                            webItems.Add(new WebGSPSItem()
                            {
                                ContentCreatorName = i.ContentCreatorName,
                                ContentDescription = i.ContentDescription,
                                ContentLabel = i.ContentLabel,
                                PresentationCreationDate = i.PresentationCreationDate,
                                PresentationCreationTime = i.PresentationCreationTime,
                                GSPSKey = i.GSPSKey
                            });
                        }
                    }

                    // データ追加
                    webTags.Add(new WebSeriesTag()
                    {
                        Modality = t.Modality,
                        NumberOfFrames = t.NumberOfFrames,
                        NumberOfImages = t.NumberOfImages,
                        SeriesDescription = t.SeriesDescription,
                        SeriesNumber = t.SeriesNumber,
                        IsGSPS = t.IsGSPS,
                        SeriesKey = t.SeriesKey,
                        ImageKey = t.ImageKeys,
                        GSPS = webItems.ToArray()
                    });
                }
                ServiceClient.Close();
                return new WebSeriesList() { Result = "Success", Tags = webTags.ToArray() };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebSeriesList() { Result = "Error", Message = "Exception" };
            }
        }

        // Image一覧取得
        public static WebImageList GetImageList(string SKey, string SeriesKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebImageList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                ImageTag[] imTags;
                SeriesTag[] seTags;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetImageList(out imTags, out seTags, sid, SeriesKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    //エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebImageList() { Result = "Error", Message = "ServiceError" };
                }

                //データ作成
                var webImTags = new List<WebImageTag>();
                if (imTags != null)
                {
                    foreach (var t in imTags)
                    {
                        webImTags.Add(new WebImageTag()
                        {
                            Columns = t.Columns,
                            ImageOrientationPatient = t.ImageOrientationPatient,
                            ImagePositionPatient = t.ImagePositionPatient,
                            InstanceNumber = t.InstanceNumber,
                            IsImageInfo = t.IsImageInfo,
                            PixelSpacing = t.PixelSpacing,
                            Rows = t.Rows,
                            SliceLocation = t.SliceLocation,
                            SliceThickness = t.SliceThickness,
                            WindowCenter = t.WindowCenter.Split('\\')[0],
                            WindowWidth = t.WindowWidth.Split('\\')[0],
                            ImageKey = t.ImageKey
                        });
                    }
                }
                var webSeTags = new List<WebSeriesTag>();
                if (seTags != null)
                {
                    foreach (var t in seTags)
                    {
                        webSeTags.Add(new WebSeriesTag()
                        {
                            Modality = t.Modality,
                            NumberOfFrames = t.NumberOfFrames,
                            NumberOfImages = t.NumberOfImages,
                            SeriesDescription = t.SeriesDescription,
                            SeriesNumber = t.SeriesNumber,
                            SeriesKey = t.SeriesKey,
                            ImageKey = t.ImageKeys
                        });
                    }
                }
                return new WebImageList() { Result = "Success", ImTags = webImTags.ToArray(), SeTags = webSeTags.ToArray() };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebImageList() { Result = "Error", Message = "Exception" };
            }
        }
        public static WebImageList GetImageList2(string SKey, string[] ImageKeys)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebImageList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                ImageTag[] tags;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetImageList2(out tags, sid, ImageKeys);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    //エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebImageList() { Result = "Error", Message = "ServiceError" };
                }

                //データ作成
                var webTags = new List<WebImageTag>();
                foreach (var t in tags)
                {
                    webTags.Add(new WebImageTag()
                    {
                        Columns = t.Columns,
                        ImageOrientationPatient = t.ImageOrientationPatient,
                        ImagePositionPatient = t.ImagePositionPatient,
                        InstanceNumber = t.InstanceNumber,
                        IsImageInfo = t.IsImageInfo,
                        PixelSpacing = t.PixelSpacing,
                        Rows = t.Rows,
                        SliceLocation = t.SliceLocation,
                        SliceThickness = t.SliceThickness,
                        WindowCenter = t.WindowCenter.Split('\\')[0],
                        WindowWidth = t.WindowWidth.Split('\\')[0],
                        ImageKey = t.ImageKey
                    });
                }
                return new WebImageList() { Result = "Success", ImTags = webTags.ToArray(), SeTags = new WebSeriesTag[0] };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebImageList() { Result = "Error", Message = "Exception" };
            }
        }

        // Image情報取得
        public static WebImageInfo GetImageInfo(string SKey, string ImageKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebImageInfo() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                ImageTag tag;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetImageInfo(out tag, sid, ImageKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebImageInfo() { Result = "Error", Message = "ServiceError" };
                }

                // データなし
                if (tag == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoData");
                    return new WebImageInfo() { Result = "Error", Message = "NoData" };
                }

                //データ作成
                var webTag = new WebImageTag()
                {
                    Columns = tag.Columns,
                    ImageOrientationPatient = tag.ImageOrientationPatient,
                    ImagePositionPatient = tag.ImagePositionPatient,
                    InstanceNumber = tag.InstanceNumber,
                    IsImageInfo = tag.IsImageInfo,
                    PixelSpacing = tag.PixelSpacing,
                    Rows = tag.Rows,
                    SliceLocation = tag.SliceLocation,
                    SliceThickness = tag.SliceThickness,
                    WindowCenter = tag.WindowCenter.Split('\\')[0],
                    WindowWidth = tag.WindowWidth.Split('\\')[0],
                    ImageKey = tag.ImageKey
                };
                return new WebImageInfo() { Result = "Success", Tag = webTag };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebImageInfo() { Result = "Error", Message = "Exception" };
            }
        }

        // DicomTag取得
        public static WebDicomTagList GetDicomTag(string SKey, string ImageKey, uint[] Tags)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebDicomTagList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                DicomTagItem[] tags;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetDicomTag(out tags, sid, ImageKey, Tags);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebDicomTagList() { Result = "Error", Message = "ServiceError" };
                }
                return new WebDicomTagList() { Result = "Success", Tags = tags };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebDicomTagList() { Result = "Error", Message = "Exception" };
            }
        }

        // DicomTag一覧取得
        public static WebDicomTagList GetDicomTagAll(string SKey, string ImageKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebDicomTagList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                DicomTagItem[] tags;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetDicomTagAll(out tags, sid, ImageKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebDicomTagList() { Result = "Error", Message = "ServiceError" };
                }
                return new WebDicomTagList() { Result = "Success", Tags = tags };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebDicomTagList() { Result = "Error", Message = "Exception" };
            }
        }

        // CT値取得
        public static WebCTValue GetCTValue(string SKey, string ImageKey, string Params)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebCTValue() { Result = "Error", Message = "NoSession" };
                }

                // パラメータ作成
                double x = 0, y = 0, w = 0;
                var prm = Params.Split(',');
                foreach (var pr in prm)
                {
                    var p = pr.Split(':');
                    switch (p[0])
                    {
                        case "x":
                            double.TryParse(p[1], out x);
                            break;
                        case "y":
                            double.TryParse(p[1], out y);
                            break;
                        case "w":
                            double.TryParse(p[1], out w);
                            if (w < 1)
                            {
                                w = 1;
                            }
                            break;
                    }
                }
                var p1 = new Point((int)(x - w), (int)(y - w));
                var p2 = new Point((int)(x + w), (int)(y + w));

                // サービス呼び出し
                RoiItem roi;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetRoi(out roi, sid, ImageKey, p1, p2);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebCTValue() { Result = "Error", Message = "ServiceError" };
                }

                // データ作成
                var sb = new StringBuilder();
                if (roi != null && roi.Area != 0)
                {
                    sb.AppendFormat("min{0} ", roi.Minimum.ToString("#####0.#"));
                    sb.AppendFormat("max{0} ", roi.Maximum.ToString("#####0.#"));
                    sb.AppendFormat("ave{0} <BR>", roi.Average.ToString("#####0.#"));
                    sb.AppendFormat("area{0} ", roi.Area.ToString("#####0.#"));
                    sb.AppendFormat("stddev{0} ", roi.StandardDeviation.ToString("#####0.#"));
                }
                else
                {
                    sb.AppendFormat("測定不能");
                }
                return new WebCTValue() { Result = "Success", Value = sb.ToString() };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebCTValue() { Result = "Error", Message = "Exception" };
            }
        }

        // 検査メモ取得
        public static WebMemoList GetStudyMemo(string SKey, string StudyKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebMemoList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                StudyMemoItem item;
                int count;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetStudyMemo(out item, out count, sid, StudyKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebMemoList() { Result = "Error", Message = "ServiceError" };
                }

                // データ作成
                var webItems = new List<WebMemoItem>();
                if (item != null)
                {
                    webItems.Add(new WebMemoItem()
                    {
                        UserName = item.UserName,
                        MemoDate = item.MemoDate.ToString("yyyy/MM/dd HH:mm"),
                        Memo = item.Memo
                    });
                }
                return new WebMemoList() { Result = "Success", Count = count, Items = webItems.ToArray() };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebMemoList() { Result = "Error", Message = "Exception" };
            }
        }

        // 検査メモ履歴取得
        public static WebMemoList GetStudyMemoHistory(string SKey, string StudyKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebMemoList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                StudyMemoItem[] items;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetStudyMemoHistory(out items, sid, StudyKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebMemoList() { Result = "Error", Message = "ServiceError" };
                }

                // データ作成
                var webItems = new List<WebMemoItem>();
                foreach (var i in items)
                {
                    // データ追加
                    webItems.Add(new WebMemoItem()
                    {
                        UserName = i.UserName,
                        MemoDate = i.MemoDate.ToString("yyyy/MM/dd HH:mm"),
                        Memo = i.Memo
                    });
                }
                return new WebMemoList() { Result = "Success", Count = webItems.Count, Items = webItems.ToArray() };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebMemoList() { Result = "Error", Message = "Exception" };
            }
        }

        // 検査メモ設定
        public static WebResult SetStudyMemo(string SKey, string StudyKey, string UserName, string Memo)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebResult() { Result = "Error", Message = "NoSession" };
                }

                // パラメータ作成
                var item = new StudyMemoItem()
                {
                    UserName = UserName,
                    Memo = Memo
                };

                // サービス呼び出し
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.SetStudyMemo(sid, StudyKey, item);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebResult() { Result = "Error", Message = "ServiceError" };
                }
                return new WebResult() { Result = "Success" };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebResult() { Result = "Error", Message = "Exception" };
            }
        }

        // キーワード設定
        public static WebResult SetKeyword(string StudyKey, string Keyword)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = (string)HttpContext.Current.Session["sid"];
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebResult() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.SetKeyword(sid, StudyKey, Keyword);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebResult() { Result = "Error", Message = "ServiceError" };
                }
                return new WebResult() { Result = "Success" };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebResult() { Result = "Error", Message = "Exception" };
            }
        }

        // 検査削除
        public static WebResult DelStudy(string StudyKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = (string)HttpContext.Current.Session["sid"];
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebResult() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.DelStudy(sid, StudyKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebResult() { Result = "Error", Message = "ServiceError" };
                }
                return new WebResult() { Result = "Success" };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebResult() { Result = "Error", Message = "Exception" };
            }
        }

        // 画像出力
        public static WebResult PutImage(string SKey, string[] Trace, string Path)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebResult() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.PutImage(sid, Trace, Path);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebResult() { Result = "Error", Message = "ServiceError" };
                }
                return new WebResult() { Result = "Success" };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebResult() { Result = "Error", Message = "Exception" };
            }
        }

        // コメント設定
        public static WebResult SetComment(string StudyKey, string Comment)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = (string)HttpContext.Current.Session["sid"];
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebResult() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.SetComment(sid, StudyKey, Comment);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebResult() { Result = "Error", Message = "ServiceError" };
                }
                return new WebResult() { Result = "Success" };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebResult() { Result = "Error", Message = "Exception" };
            }
        }

        // 事前画像対象一覧取得
        public static WebPrefetchImageList PrefetchImageList(string SKey, string SeriesKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebPrefetchImageList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                string[] keys;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.PrefetchImageList(out keys, sid, SeriesKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    //エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebPrefetchImageList() { Result = "Error", Message = "ServiceError" };
                }
                return new WebPrefetchImageList() { Result = "Success", ImageKey = keys };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebPrefetchImageList() { Result = "Error", Message = "Exception" };
            }
        }

        // 事前画像取得
        public static WebResult PrefetchImage(string SKey, string ImageKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebResult() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.PrefetchImage(sid, ImageKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    //エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebResult() { Result = "Error", Message = "ServiceError" };
                }
                return new WebResult() { Result = "Success" };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebResult() { Result = "Error", Message = "Exception" };
            }
        }

        // GSPSデータ取得
        public static WebGSPSDataList GetGspsDataList(string SKey, string GSPSKey)
        {
            ProRadServicesClient ServiceClient = null;
            try
            {
                // 結果をキャッシュしない
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.NoCache);

                // セッションチェック
                string sid = null;
                if (SKey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + SKey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return new WebGSPSDataList() { Result = "Error", Message = "NoSession" };
                }

                // サービス呼び出し
                Dictionary<string, GSPSDataItem> items;
                ServiceClient = new ProRadServicesClient();
                var ret = ServiceClient.GetGsps(out items, sid, GSPSKey);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    //エラー
                    LogUtil.Write(LogType.Error, "{0}[{1}]", "ServiceError", ret);
                    return new WebGSPSDataList() { Result = "Error", Message = "ServiceError" };
                }

                // データ作成
                var webItems = new Dictionary<string, WebGSPSDataItem>();
                foreach (var i in items)
                {
                    // データ追加
                    webItems.Add(i.Key, new WebGSPSDataItem()
                    {
                        DisplayArea = i.Value.DisplayArea,
                        Flip = i.Value.Flip,
                        Info = i.Value.Info,
                        Rotate = i.Value.Rotate,
                        VoiLut = i.Value.VoiLut
                    });
                }
                return new WebGSPSDataList() { Result = "Success", Items = webItems };
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
                return new WebGSPSDataList() { Result = "Error", Message = "Exception" };
            }
        }

        // サムネイル取得処理
        public static void GetThumbnail()
        {
            ProRadServicesClient proxy = null;
            try
            {
                // セッションチェック
                string sid = null;
                string skey = HttpContext.Current.Request.QueryString["sk"];
                if (skey == null || skey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + skey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return;
                }

                string key = HttpContext.Current.Request.QueryString["key"];
                byte[] image = null;

                // パラメータチェック
                var imMode = false;
                var keys = new List<string>(HttpContext.Current.Request.QueryString.AllKeys);
                if (keys.Contains("im"))
                {
                    // ImageKeyを使用する
                    imMode = true;
                }

                // ImageKeyを使用する場合
                if (imMode)
                {
                    // サービス呼び出し
                    proxy = new ProRadServicesClient();
                    for (int i = 0; i < 10; i++)
                    {
                        proxy.GetThumbnail2(out image, sid, key);
                        if (image == null)
                        {
                            // リトライ
                            continue;
                        }
                        break;
                    }
                    proxy.Close();
                }
                // SeriesKeyを使用する場合
                else
                {
                    // サービス呼び出し
                    proxy = new ProRadServicesClient();
                    for (int i = 0; i < 10; i++)
                    {
                        proxy.GetThumbnail(out image, sid, key);
                        if (image == null)
                        {
                            // リトライ
                            continue;
                        }
                        break;
                    }
                    proxy.Close();
                }
                if (image == null)
                {
                    // 画像なし
                    LogUtil.Write(LogType.Error, "NoImage");
                    return;
                }

                HttpContext.Current.Response.ClearContent();
                HttpContext.Current.Response.Cache.SetExpires(DateTime.Now.AddSeconds(3600));
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.Public);
                HttpContext.Current.Response.Cache.SetValidUntilExpires(true);
                HttpContext.Current.Response.ContentType = "image/jpeg";
                HttpContext.Current.Response.BinaryWrite(image);
                HttpContext.Current.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                if (proxy != null && proxy.State == CommunicationState.Faulted)
                {
                    proxy.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
            }
        }

        // 画像取得処理
        public static void GetImage()
        {
            ProRadServicesClient proxy = null;
            try
            {
                // セッションチェック
                string sid = null;
                string skey = HttpContext.Current.Request.QueryString["sk"];
                if (skey == null || skey == "")
                {
                    sid = (string)HttpContext.Current.Session["sid"];
                }
                else
                {
                    sid = (string)HttpContext.Current.Session["sid_" + skey];
                }
                if (sid == null)
                {
                    // エラー
                    LogUtil.Write(LogType.Error, "NoSession");
                    return;
                }

                string key = HttpContext.Current.Request.QueryString["key"];
                int level = Convert.ToInt32(HttpContext.Current.Request.QueryString["level"]);
                int cx = Convert.ToInt32(HttpContext.Current.Request.QueryString["cx"]);
                int cy = Convert.ToInt32(HttpContext.Current.Request.QueryString["cy"]);
                int cw = Convert.ToInt32(HttpContext.Current.Request.QueryString["cw"]);
                int ch = Convert.ToInt32(HttpContext.Current.Request.QueryString["ch"]);
                double wc = Convert.ToDouble(HttpContext.Current.Request.QueryString["wc"]);
                double ww = Convert.ToDouble(HttpContext.Current.Request.QueryString["ww"]);
                int rot = Convert.ToInt32(HttpContext.Current.Request.QueryString["rot"]);
                int flipX = Convert.ToInt32(HttpContext.Current.Request.QueryString["flipX"]);
                string preview = HttpContext.Current.Request.QueryString["preview"];

                // サービス呼び出し
                byte[] image = null;
                proxy = new ProRadServicesClient();
                for (int i = 0; i < 10; i++)
                {
                    if (preview == null || preview != "1" || rot != 0 || flipX != 0)
                    {
                        proxy.GetImage(out image, sid, key, level, cx, cy, cw, ch, wc, ww, rot, flipX);
                    }
                    else
                    {
                        proxy.GetImage2(out image, sid, key, level, cx, cy, cw, ch, wc, ww, rot, flipX, true);
                    }
                    if (image == null)
                    {
                        // リトライ
                        continue;
                    }
                    break;
                }
                proxy.Close();
                if (image == null)
                {
                    // 画像なし
                    LogUtil.Write(LogType.Error, "NoImage");
                    return;
                }

                HttpContext.Current.Response.ClearContent();
                HttpContext.Current.Response.Cache.SetExpires(DateTime.Now.AddSeconds(3600));
                HttpContext.Current.Response.Cache.SetCacheability(HttpCacheability.Public);
                HttpContext.Current.Response.Cache.SetValidUntilExpires(true);
                HttpContext.Current.Response.ContentType = "image/jpeg";
                HttpContext.Current.Response.BinaryWrite(image);
                HttpContext.Current.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                if (proxy != null && proxy.State == CommunicationState.Faulted)
                {
                    proxy.Abort();
                }
                LogUtil.Write(LogType.Error, ex);
            }
        }

        // WebLogin呼び出し処理
        public static void LoadWebLogin(out string LoginMode, out string DefaultID, out string DefaultPass)
        {
            LoginMode = "0";
            DefaultID = "";
            DefaultPass = "";
            try
            {
                // ログイン設定
                if (LoginIDMode == "1")
                {
                    // 前回ログインID設定
                    LoginMode = "1";
                    DefaultID = "";
                    DefaultPass = "";
                }
                else if (LoginIDMode == "2")
                {
                    // デフォルト設定
                    LoginMode = "2";
                    DefaultID = DefLoginID;
                    DefaultPass = DefPassword;
                }
            }
            catch (Exception ex)
            {
                // エラー
                LogUtil.Write(LogType.Error, ex);
            }
        }

        // WebSearchReq呼び出し処理
        public static void LoadWebSearchReq(out string ErrorMessage)
        {
            var RedirectPath = "./Search/WebSearch.aspx";
            ErrorMessage = "";
            ProRadServicesClient ServiceClient = null;
            try
            {
                // パラメータ初期化
                int ret;
                ServiceClient = new ProRadServicesClient();
                bool issid = true;
                string loginid = HttpContext.Current.Request.QueryString["loginid"];
                string sid = HttpContext.Current.Request.QueryString["sid"];
                string patientID = "";
                string modality = "";
                string studyDate = "";
                string accessionNumber = "";

                // セッションチェック
                if (loginid != null && sid != null)
                {
                    // loginidとsidが両方設定されていた場合はエラー
                    sid = "";
                    issid = false;
                }
                else if (loginid != null)
                {
                    // サービス呼び出し
                    ret = ServiceClient.LoginUrl(out sid, loginid);

                    // 結果確認
                    if (ret != 0)
                    {
                        sid = "";
                        issid = false;
                    }
                }
                else if (sid == null)
                {
                    // loginidとsidが未設定時の場合は固定のSIDを使用
                    sid = URLCallSID;
                    issid = false;
                }

                // パラメータ設定
                patientID = (HttpContext.Current.Request.QueryString["patientid"] != null) ? (string)HttpContext.Current.Request.QueryString["patientid"] : "";
                modality = (HttpContext.Current.Request.QueryString["modality"] != null) ? (string)HttpContext.Current.Request.QueryString["modality"] : "";
                studyDate = (HttpContext.Current.Request.QueryString["date"] != null) ? (string)HttpContext.Current.Request.QueryString["date"] : "";
                accessionNumber = (HttpContext.Current.Request.QueryString["accessionno"] != null) ? (string)HttpContext.Current.Request.QueryString["accessionno"] : "";

                // パラメータチェック
                if (sid == "" || (!issid && patientID == "" && modality == "" && studyDate == "" && accessionNumber == ""))
                {
                    // エラー
                    ServiceClient.Close();
                    ErrorMessage = "URLパラメータが正しくありません。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                    LogUtil.Write(LogType.Error, "{0} {1}[{2}]",
                        "URLParam",
                        "Query", HttpContext.Current.Request.Url.Query);
                    return;
                }

                // セッションチェックのためサービス呼び出し
                Dictionary<string, Dictionary<string, string>> items;
                ret = ServiceClient.GetModalityConfig(out items, sid);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0)
                {
                    //エラー
                    if (ret == 2)
                    {
                        ErrorMessage = "このユーザーでは表示できません。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                    }
                    else
                    {
                        ErrorMessage = "サービスでエラーが発生しました。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                    }
                    LogUtil.Write(LogType.Error, "{0}[{1}] {2}[{3}]",
                        "ServiceError", ret,
                        "Query", HttpContext.Current.Request.Url.Query);
                    return;
                }

                // セッション登録
                HttpContext.Current.Session["sid"] = sid;
                HttpContext.Current.Session["login"] = "2";
                HttpContext.Current.Session["prmpatientid"] = patientID;
                HttpContext.Current.Session["prmmodality"] = modality;
                HttpContext.Current.Session["prmdate"] = studyDate;
                HttpContext.Current.Session["prmaccessionno"] = accessionNumber;

                // パラメータ書き込み
                LogUtil.Write(LogType.Information, "{0}[{1}]",
                    "Query", HttpContext.Current.Request.Url.Query);

                // Searchにリダイレクト
                HttpContext.Current.Response.Redirect(RedirectPath, false);
                HttpContext.Current.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                ErrorMessage = "サービスで例外が発生しました。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                LogUtil.Write(LogType.Error, ex);
            }
        }

        // WebSearch呼び出し処理
        public static void LoadWebSearch()
        {
            var RedirectPath = "../WebLogin.aspx";
            try
            {
                // セッションチェック
                if (HttpContext.Current.Session["sid"] == null || HttpContext.Current.Session["login"] == null)
                {
                    // ログインにリダイレクト
                    HttpContext.Current.Response.Redirect(RedirectPath, false);
                    HttpContext.Current.ApplicationInstance.CompleteRequest();
                }
            }
            catch (Exception ex)
            {
                // エラー
                LogUtil.Write(LogType.Error, ex);
            }
        }

        // WebViewerReq呼び出し処理
        public static void LoadWebViewerReq(out string ErrorMessage)
        {
            var RedirectPath = "./Viewer/WebViewer.aspx";
            ErrorMessage = "";
            ProRadServicesClient ServiceClient = null;
            try
            {
                // パラメータ初期化
                int ret;
                FindParam param;
                ServiceClient = new ProRadServicesClient();
                string loginid = HttpContext.Current.Request.QueryString["loginid"];
                string sid = HttpContext.Current.Request.QueryString["sid"];
                string rskey = HttpContext.Current.Request.QueryString["rskey"];
                string report = HttpContext.Current.Request.QueryString["report"];
                string patientID = "";
                string modality = "";
                string studyDate = "";
                string accessionNumber = "";
                string studyKey = "";
                string path = "";

                // セッションキーを取得
                string skey = GetSessionKey();

                // セッションチェック
                if (loginid != null && sid != null)
                {
                    // loginidとsidが両方設定されていた場合はエラー
                    sid = "";
                }
                else if (loginid != null)
                {
                    // サービス呼び出し
                    ret = ServiceClient.LoginUrl(out sid, loginid);

                    // 結果確認
                    if (ret != 0)
                    {
                        sid = "";
                    }
                }
                else if (sid == null)
                {
                    // loginidとsidが未設定時の場合は固定のSIDを使用
                    sid = URLCallSID;
                }

                // rskeyが設定されている場合
                if (rskey != null)
                {
                    // サービス呼び出し
                    ret = ServiceClient.RSKey2StudyKey(out patientID, out studyKey, out path, out param, sid, rskey);
                    ServiceClient.Close();

                    // 結果確認
                    if (ret != 0 && ret != 11)
                    {
                        // エラー
                        if (ret == 2)
                        {
                            ErrorMessage = "このユーザーでは表示できません。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                        }
                        else if (ret == 10)
                        {
                            ErrorMessage = "複数の患者情報が見つかりました。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                        }
                        else
                        {
                            ErrorMessage = "サービスでエラーが発生しました。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                        }
                        LogUtil.Write(LogType.Error, "{0}[{1}] {2}[{3}]",
                            "RSKeyDecode", ret,
                            "Query", HttpContext.Current.Request.Url.Query);
                        return;
                    }

                    // データなし
                    if (studyKey == "")
                    {
                        // エラー
                        ErrorMessage = "画像が到着していない可能性があります。\r\nしばらく待ってから再度呼び出しを行ってください。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                        LogUtil.Write(LogType.Error, "{0} {1}[{2}]",
                            "RSKeyNoData",
                            "Query", HttpContext.Current.Request.Url.Query);
                        return;
                    }

                    // セッション登録
                    HttpContext.Current.Session["sid_" + skey] = sid;
                    HttpContext.Current.Session["patientid_" + skey] = patientID;
                    HttpContext.Current.Session["studykey_" + skey] = studyKey;
                    HttpContext.Current.Session["rsoutpath_" + skey] = path;
                    if (ret == 11)
                    {
                        // 複数検査のため検索条件を設定
                        HttpContext.Current.Session["findmodality_" + skey] = param.Modality;
                        HttpContext.Current.Session["finddate_" + skey] = param.StudyDateFrom;
                        HttpContext.Current.Session["findaccessionno_" + skey] = param.AccessionNumber;
                    }

                    // パラメータ書き込み
                    LogUtil.Write(LogType.Information, "{0}[{1}] {2}[{3}] {4}[{5}]",
                        "Query", HttpContext.Current.Request.Url.Query,
                        "PatientID", patientID,
                        "RSOutpath", path);

                    // Viewerにリダイレクト
                    HttpContext.Current.Response.Redirect(RedirectPath + "?sk=" + skey, false);
                    HttpContext.Current.ApplicationInstance.CompleteRequest();
                    return;
                }

                // パラメータ設定
                patientID = (HttpContext.Current.Request.QueryString["patientid"] != null) ? (string)HttpContext.Current.Request.QueryString["patientid"] : "";
                modality = (HttpContext.Current.Request.QueryString["modality"] != null) ? (string)HttpContext.Current.Request.QueryString["modality"] : "";
                studyDate = (HttpContext.Current.Request.QueryString["date"] != null) ? (string)HttpContext.Current.Request.QueryString["date"] : "";
                accessionNumber = (HttpContext.Current.Request.QueryString["accessionno"] != null) ? (string)HttpContext.Current.Request.QueryString["accessionno"] : "";

                // パラメータチェック
                if (patientID == "" && modality == "" && studyDate == "" && accessionNumber == "")
                {
                    // エラー
                    ServiceClient.Close();
                    ErrorMessage = "URLパラメータが正しくありません。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                    LogUtil.Write(LogType.Error, "{0} {1}[{2}]",
                        "URLParam",
                        "Query", HttpContext.Current.Request.Url.Query);
                    return;
                }

                // パラメータ作成
                param = new FindParam()
                {
                    PatientID = patientID,
                    Modality = modality,
                    StudyDateFrom = studyDate,
                    StudyDateTo = studyDate,
                    AccessionNumber = accessionNumber,
                    IsPacsSearch = false
                };

                // サービス呼び出し
                ret = ServiceClient.GetStudyKey(out patientID, out studyKey, sid, param);
                ServiceClient.Close();

                // 結果確認
                if (ret != 0 && ret != 11)
                {
                    // エラー
                    if (ret == 2)
                    {
                        ErrorMessage = "このユーザーでは表示できません。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                    }
                    else if (ret == 10)
                    {
                        ErrorMessage = "複数の患者情報が見つかりました。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                    }
                    else
                    {
                        ErrorMessage = "サービスでエラーが発生しました。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                    }
                    LogUtil.Write(LogType.Error, "{0}[{1}] {2}[{3}]",
                        "ServiceError", ret,
                        "Query", HttpContext.Current.Request.Url.Query);
                    return;
                }

                // データなし
                if (studyKey == "")
                {
                    // エラー
                    ErrorMessage = "該当する患者情報が見つかりませんでした。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                    LogUtil.Write(LogType.Error, "{0} {1}[{2}]",
                        "NoData",
                        "Query", HttpContext.Current.Request.Url.Query);
                    return;
                }

                // セッション登録
                HttpContext.Current.Session["sid_" + skey] = sid;
                HttpContext.Current.Session["patientid_" + skey] = patientID;
                HttpContext.Current.Session["studykey_" + skey] = studyKey;
                if (report != null && report == "1")
                {
                    // レポート出力用にパスを作成
                    path = HttpContext.Current.Request.UserHostAddress;
                    if (path != "" && path.IndexOfAny(Path.GetInvalidFileNameChars()) < 0)
                    {
                        HttpContext.Current.Session["rsoutpath_" + skey] = path + "/";
                    }
                }
                if (ret == 11)
                {
                    // 複数検査のため検索条件を設定
                    HttpContext.Current.Session["findmodality_" + skey] = modality;
                    HttpContext.Current.Session["finddate_" + skey] = studyDate;
                    HttpContext.Current.Session["findaccessionno_" + skey] = accessionNumber;
                }

                // パラメータ書き込み
                LogUtil.Write(LogType.Information, "{0}[{1}] {2}[{3}]",
                    "Query", HttpContext.Current.Request.Url.Query,
                    "PatientID", patientID);

                // Viewerにリダイレクト
                HttpContext.Current.Response.Redirect(RedirectPath + "?sk=" + skey, false);
                HttpContext.Current.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                // エラー
                if (ServiceClient != null && ServiceClient.State == CommunicationState.Faulted)
                {
                    ServiceClient.Abort();
                }
                ErrorMessage = "サービスで例外が発生しました。\r\n" + HttpContext.Current.Request.Url.Query.TrimStart('?');
                LogUtil.Write(LogType.Error, ex);
            }
        }

        // WebViewer呼び出し処理
        public static void LoadWebViewer()
        {
            try
            {
                // WebViewerReq以外からの場合
                if (HttpContext.Current.Request.QueryString["sk"] == null)
                {
                    // セッションチェック
                    if (HttpContext.Current.Session["sid"] == null)
                    {
                        // エラー
                        LogUtil.Write(LogType.Error, "NoSession");
                        return;
                    }

                    // パラメータ書き込み
                    LogUtil.Write(LogType.Information, "{0}[{1}]",
                        "PatientID", HttpContext.Current.Session["patientid"]);
                    return;
                }
                else
                {
                    var sk = (string)HttpContext.Current.Request.QueryString["sk"];

                    // セッションチェック
                    if (HttpContext.Current.Session["sid_" + sk] == null)
                    {
                        // エラー
                        LogUtil.Write(LogType.Error, "NoSession");
                        return;
                    }
                }
            }
            catch (Exception ex)
            {
                // エラー
                LogUtil.Write(LogType.Error, ex);
            }
        }

        // セッションキー取得処理
        private static string GetSessionKey()
        {
            using (var sha = SHA256Managed.Create())
            {
                var result = DateTime.Now.ToString("yyyyMMddHHmmssfff");
                var rnd = new Random();
                lock (HttpContext.Current.Session.SyncRoot)
                {
                    while (true)
                    {
                        result += "salt";
                        var bs = sha.ComputeHash(Encoding.UTF8.GetBytes(result));
                        result = BitConverter.ToString(bs).ToLower().Replace("-", "").Substring(rnd.Next(32) + 8, 16);
                        if (HttpContext.Current.Session["sid_" + result] == null)
                        {
                            HttpContext.Current.Session["sid_" + result] = "";
                            break;
                        }
                    }
                }
                return result;
            }
        }

        // 日付文字列取得処理
        private static string[] GetDateString(string strDate)
        {
            var ret = new string[2] { "", "" };
            try
            {
                string[] date;
                if (Regex.IsMatch(strDate, "-"))
                {
                    date = strDate.Split('-');
                }
                else
                {
                    date = new string[2] { strDate, strDate };
                }
                var now = DateTime.Today;
                for (var i = 0; i < 2; i++)
                {
                    if (date[i].Length == 0)
                    {
                        // 空
                        continue;
                    }
                    if (Regex.IsMatch(date[i], "/"))
                    {
                        // 区切り文字有
                        var sp = date[i].Split('/');
                        if (sp.Length == 2)
                        {
                            // 月日 or 年月
                            var spi = new int[2] { int.Parse(sp[0]), int.Parse(sp[1]) };
                            if (spi[0] < 1900)
                            {
                                // 月日(年は今年を付与)
                                ret[i] = new DateTime(now.Year, spi[0], spi[1]).ToString("yyyyMMdd");
                            }
                            else
                            {
                                // 年月(日はFromに月の先頭、Toに月の最終を付与)
                                if (i == 0)
                                {
                                    ret[i] = new DateTime(spi[0], spi[1], 1).ToString("yyyyMMdd");
                                }
                                else
                                {
                                    ret[i] = new DateTime(spi[0], spi[1], 1).AddMonths(1).AddDays(-1).ToString("yyyyMMdd");
                                }
                            }
                        }
                        else if (sp.Length == 3)
                        {
                            // 年月日
                            var spi = new int[3] { int.Parse(sp[0]), int.Parse(sp[1]), int.Parse(sp[2]) };
                            if (sp[0].Length == 2)
                            {
                                // 年を置換
                                var iy = now.Year - (now.Year % 100) + spi[0];
                                if (iy - 1 > now.Year)
                                {
                                    // 100年前に変換
                                    iy -= 100;
                                }
                                ret[i] = new DateTime(iy, spi[1], spi[2]).ToString("yyyyMMdd");
                            }
                            else if (sp[0].Length == 4)
                            {
                                // 年月日
                                ret[i] = new DateTime(spi[0], spi[1], spi[2]).ToString("yyyyMMdd");
                            }
                        }
                    }
                    else
                    {
                        // 数字のみ
                        if (date[i].Length <= 3)
                        {
                            // 0～999日前
                            ret[i] = now.AddDays(-(int.Parse(date[i]))).ToString("yyyyMMdd");
                        }
                        else if (date[i].Length == 4)
                        {
                            // 月日 or 年
                            if (int.Parse(date[i]) < 1900)
                            {
                                // 月日(年は今年を付与)
                                ret[i] = now.ToString("yyyy") + date[i];
                            }
                            else
                            {
                                // 年(月日はFromに年の先頭、Toに年の最終を付与)
                                if (i == 0)
                                {
                                    ret[i] = new DateTime(int.Parse(date[i]), 1, 1).ToString("yyyyMMdd");
                                }
                                else
                                {
                                    ret[i] = new DateTime(int.Parse(date[i]), 1, 1).AddYears(1).AddDays(-1).ToString("yyyyMMdd");
                                }
                            }
                        }
                        else if (date[i].Length == 6)
                        {
                            // 年月(日はFromに月の先頭、Toに月の最終を付与)
                            if (i == 0)
                            {
                                ret[i] = new DateTime(int.Parse(date[i].Substring(0, 4)), int.Parse(date[i].Substring(4, 2)), 1).ToString("yyyyMMdd");
                            }
                            else
                            {
                                ret[i] = new DateTime(int.Parse(date[i].Substring(0, 4)), int.Parse(date[i].Substring(4, 2)), 1).AddMonths(1).AddDays(-1).ToString("yyyyMMdd");
                            }
                        }
                        else if (date[i].Length == 8)
                        {
                            // 年月日
                            ret[i] = new DateTime(int.Parse(date[i].Substring(0, 4)), int.Parse(date[i].Substring(4, 2)), int.Parse(date[i].Substring(6, 2))).ToString("yyyyMMdd");
                        }
                    }
                }
            }
            catch { }
            return ret;
        }

        // 入力文字チェック
        private static bool IsSpaceText(string text)
        {
            return Regex.IsMatch(text, "\\s+");
        }
    }

    // アシスタントクラス群
    public class WebResult
    {
        public string Result { get; set; }
        public string Message { get; set; }
    }
    public class WebParams : WebResult
    {
        public Dictionary<string, string> Params { get; set; }
    }
    public class WebHospitalList : WebResult
    {
        public string PortalName { get; set; }
        public WebHospitalItem[] Items { get; set; }
    }
    public class WebUserConfigList : WebResult
    {
        public Dictionary<string, string> Items { get; set; }
    }
    public class WebModalityConfigList : WebResult
    {
        public Dictionary<string, Dictionary<string, string>> Items { get; set; }
    }
    public class WebAnnotationList : WebResult
    {
        public AnnotationItem[] Items { get; set; }
    }
    public class WebStudyList : WebResult
    {
        public int Count { get; set; }
        public WebStudyTag[] Tags { get; set; }
    }
    public class WebSeriesList : WebResult
    {
        public WebSeriesTag[] Tags { get; set; }
    }
    public class WebImageList : WebResult
    {
        public WebImageTag[] ImTags { get; set; }
        public WebSeriesTag[] SeTags { get; set; }
    }
    public class WebImageInfo : WebResult
    {
        public WebImageTag Tag { get; set; }
    }
    public class WebDicomTagList : WebResult
    {
        public DicomTagItem[] Tags { get; set; }
    }
    public class WebCTValue : WebResult
    {
        public string Value { get; set; }
    }
    public class WebStudyUrl : WebResult
    {
        public string StudyUrl { get; set; }
    }
    public class WebStorage : WebResult
    {
        public long Capacity { get; set; }
        public long InUse { get; set; }
    }
    public class WebMemoList : WebResult
    {
        public int Count { get; set; }
        public WebMemoItem[] Items { get; set; }
    }
    public class WebPortalMst : WebResult
    {
        public WebPortalMstItem[] Items { get; set; }
    }
    public class WebPortal : WebResult
    {
        public WebPortalItem[] Items { get; set; }
    }
    public class WebSetPortal : WebResult
    {
        public string Keyword { get; set; }
    }
    public class WebPrefetchImageList : WebResult
    {
        public string[] ImageKey { get; set; }
    }
    public class WebGSPSDataList : WebResult
    {
        public Dictionary<string, WebGSPSDataItem> Items { get; set; }
    }

    public class WebHospitalItem
    {
        public string Name { get; set; }
        public string ID { get; set; }
    }
    public class WebStudyTag
    {
        public string AccessionNumber { get; set; }
        public string BodyPartExamined { get; set; }
        public string Modality { get; set; }
        public int NumberOfImages { get; set; }
        public string PatientID { get; set; }
        public string PatientsAge { get; set; }
        public string PatientsBirthDate { get; set; }
        public string PatientsName { get; set; }
        public string PatientsSex { get; set; }
        public string StudyDate { get; set; }
        public string StudyTime { get; set; }
        public string StudyDescription { get; set; }
        public string UploadDate { get; set; }
        public string UploadTime { get; set; }
        public int MemoUmu { get; set; }
        public string Keyword { get; set; }
        public string Comment { get; set; }
        public int StudyPasswordUmu { get; set; }
        public int StudyPortalUmu { get; set; }
        public int StudyUrlUmu { get; set; }
        public string HospitalID { get; set; }
        public string StudyKey { get; set; }
    }
    public class WebSeriesTag
    {
        public string Modality { get; set; }
        public int NumberOfFrames { get; set; }
        public int NumberOfImages { get; set; }
        public string SeriesDescription { get; set; }
        public long SeriesNumber { get; set; }
        public bool IsGSPS { get; set; }
        public string SeriesKey { get; set; }
        public string[] ImageKey { get; set; }
        public WebGSPSItem[] GSPS { get; set; }
    }
    public class WebImageTag
    {
        public int Columns { get; set; }
        public string ImageOrientationPatient { get; set; }
        public string ImagePositionPatient { get; set; }
        public long InstanceNumber { get; set; }
        public bool IsImageInfo { get; set; }
        public string PixelSpacing { get; set; }
        public int Rows { get; set; }
        public string SliceLocation { get; set; }
        public string SliceThickness { get; set; }
        public string WindowCenter { get; set; }
        public string WindowWidth { get; set; }
        public string ImageKey { get; set; }
    }
    public class WebMemoItem
    {
        public string UserName { get; set; }
        public string MemoDate { get; set; }
        public string Memo { get; set; }
    }
    public class WebPortalMstItem
    {
        public string Title { get; set; }
        public string Column1 { get; set; }
        public string Column2 { get; set; }
        public string Column3 { get; set; }
        public string Password { get; set; }
        public string LinkTitle { get; set; }
        public string LinkURL { get; set; }
    }
    public class WebPortalItem
    {
        public bool Enable { get; set; }
        public string Column1 { get; set; }
        public string Column2 { get; set; }
        public string Column3 { get; set; }
    }
    public class WebGSPSItem
    {
        public string ContentCreatorName { set; get; }
        public string ContentDescription { set; get; }
        public string ContentLabel { set; get; }
        public string PresentationCreationDate { set; get; }
        public string PresentationCreationTime { set; get; }
        public string GSPSKey { set; get; }
    }
    public class WebGSPSDataItem
    {
        public string DisplayArea { set; get; }
        public string Flip { set; get; }
        public string Info { set; get; }
        public string Rotate { set; get; }
        public string VoiLut { set; get; }
    }

    // ログ関連
    class LogUtil
    {
        public static readonly string LogPath = ConfigurationManager.AppSettings["LogPath"] ?? "";

        static LogUtil()
        {
            CommonLib.Log.TraceFileLog.DefaultPath = LogPath;
            CommonLib.Log.TraceFileLog.Start();
        }

        public static void Write(LogType type, object message)
        {
            var st = new StackTrace(false);
            var sf = st.GetFrame(1);
            var mb = sf.GetMethod();
            string s = (message == null) ? "" : message.ToString();
            WriteFile(mb.ReflectedType.Name, type, mb.Name, s);
        }

        public static void Write(LogType type, string format, params object[] args)
        {
            var st = new StackTrace(false);
            var sf = st.GetFrame(1);
            var mb = sf.GetMethod();
            string s = "";
            try
            {
                s = string.Format(format, args);
            }
            catch
            {
                var sb = new StringBuilder();
                sb.Append(format).Append(" ");
                foreach (var o in args)
                {
                    sb.Append(o).Append(" ");
                }
                s = sb.Remove(sb.Length - 1, 1).ToString();
            }
            WriteFile(mb.ReflectedType.Name, type, mb.Name, s);
        }

        private static void WriteFile(object sender, LogType type, string source, string message)
        {
            List<object> m = new List<object>();
            m.Add("Source");
            m.Add(source);
            m.Add("Message");
            m.Add(message);

            var hc = System.Web.HttpContext.Current;
            if (hc != null)
            {
                m.Add("User");
                m.Add((hc.User != null) ? hc.User.Identity.Name : "");
                m.Add("Computer");
                m.Add(hc.Request.UserHostAddress);
                m.Add("UserAgent");
                m.Add(hc.Request.UserAgent);
                m.Add("UrlReferrer(Authority)");
                m.Add((hc.Request.UrlReferrer != null) ? hc.Request.UrlReferrer.Authority : "");
            }

            CommonLib.Log.LogType t;
            switch (type)
            {
                case LogType.Debug:
                    t = CommonLib.Log.LogType.DEBUG;
                    break;

                case LogType.Error:
                    t = CommonLib.Log.LogType.ERROR;
                    break;

                case LogType.Warning:
                    t = CommonLib.Log.LogType.WARNING;
                    break;

                case LogType.Information:
                    t = CommonLib.Log.LogType.NORMAL;
                    break;

                default:
                    t = CommonLib.Log.LogType.NORMAL;
                    break;
            }

            CommonLib.Log.CustomLog.Write(sender, t, m.ToArray());
        }
    }

    /// <summary>
    /// ログ種別
    /// </summary>
    enum LogType
    {
        /// <summary>
        /// デバック
        /// </summary>
        Debug,
        /// <summary>
        /// エラー
        /// </summary>
        Error,
        /// <summary>
        /// 警告
        /// </summary>
        Warning,
        /// <summary>
        /// 情報
        /// </summary>
        Information,
    }
}