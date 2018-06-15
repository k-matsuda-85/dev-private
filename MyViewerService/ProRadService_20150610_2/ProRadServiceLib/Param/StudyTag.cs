using System;
using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// STUDYタグ
    /// </summary>
    [DataContract]
    public class StudyTag
    {
        /// <summary>
        /// STUDYキー
        /// </summary>
        [DataMember]
        public string StudyKey = "";

        /// <summary>
        /// 検査日付
        /// </summary>
        [DataMember]
        public string StudyDate = "";

        /// <summary>
        /// 検査時刻
        /// </summary>
        [DataMember]
        public string StudyTime = "";

        /// <summary>
        /// 受付番号
        /// </summary>
        [DataMember]
        public string AccessionNumber = "";

        /// <summary>
        /// モダリティ
        /// </summary>
        [DataMember]
        public string Modality = "";

        /// <summary>
        /// 検査記述
        /// </summary>
        [DataMember]
        public string StudyDescription = "";

        /// <summary>
        /// 患者の名前
        /// </summary>
        [DataMember]
        public string PatientName = "";

        /// <summary>
        /// 患者ＩＤ
        /// </summary>
        [DataMember]
        public string PatientID = "";

        /// <summary>
        /// 患者の誕生日
        /// </summary>
        [DataMember]
        public string PatientBirthDate = "";

        /// <summary>
        /// 患者の性別
        /// </summary>
        [DataMember]
        public string PatientSex = "";

        /// <summary>
        /// 患者の年齢
        /// </summary>
        [DataMember]
        public string PatientAge
        {
            get
            {
                if (_PatientAge.Trim() != "")
                {
                    return _PatientAge;
                }

                try
                {
                    string studyDate = StudyDate.Replace("/", "").Replace("-", "").Replace(".", "");
                    string birthDate = PatientBirthDate.Replace("/", "").Replace("-", "").Replace(".", "");

                    if (studyDate.Length == 8 && birthDate.Length == 8)
                    {
                        DateTime sd = DateTime.ParseExact(studyDate, "yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                        DateTime bd = DateTime.ParseExact(birthDate, "yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo);

                        int age = sd.Year - bd.Year;
                        if (sd.DayOfYear < bd.DayOfYear)
                        {
                            age--;
                        }

                        if (age >= 0 && age <= 999)
                        {
                            return age.ToString();
                        }
                    }
                    return "";
                }
                catch
                {
                    return "";
                }
            }
            set
            {
                _PatientAge = value;
            }
        }
        private string _PatientAge = "";

        /// <summary>
        /// 検査部位
        /// </summary>
        [DataMember]
        public string BodyPartExamined = "";

        /// <summary>
        /// 画像枚数
        /// </summary>
        [DataMember]
        public int NumberOfImages = 0;

        /// <summary>
        /// コメント
        /// </summary>
        [DataMember]
        public string Comment = "";

        /// <summary>
        /// キーワード
        /// </summary>
        [DataMember]
        public string Keyword = "";

        /// <summary>
        /// 検査メモ有無
        /// </summary>
        [DataMember]
        public int StudyMemoUmu = 0;


        //ソート用
        public string StudyInstanceUID = "";
    }
}
