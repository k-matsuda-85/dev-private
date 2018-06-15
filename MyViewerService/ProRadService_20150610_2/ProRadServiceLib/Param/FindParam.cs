using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// STUDY検索パラメータ
    /// </summary>
    [DataContract]
    public class FindParam
    {
        /// <summary>
        /// 患者ID
        /// </summary>
        [DataMember]
        public string PatientID { get; set; }

        /// <summary>
        /// 患者の名前
        /// </summary>
        [DataMember]
        public string PatientName { get; set; }

        /// <summary>
        /// 受付番号
        /// </summary>
        [DataMember]
        public string AccessionNumber { get; set; }

        /// <summary>
        /// モダリティ(カンマ区切り)
        /// </summary>
        [DataMember]
        public string Modality { get; set; }

        /// <summary>
        /// 検査日付(YYYYMMDD)
        /// </summary>
        [DataMember]
        public string StudyDateFrom { get; set; }

        /// <summary>
        /// 検査日付(YYYYMMDD)
        /// </summary>
        [DataMember]
        public string StudyDateTo { get; set; }

        /// <summary>
        /// コメント
        /// </summary>
        [DataMember]
        public string Comment { get; set; }

        /// <summary>
        /// キーワード
        /// </summary>
        [DataMember]
        public string Keyword { get; set; }

        /// <summary>
        /// PACS検索
        /// </summary>
        [DataMember]
        public bool IsPacsSearch { get; set; }
    }
}
