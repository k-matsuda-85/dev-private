using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// GSPS
    /// </summary>
    [DataContract]
    public class GSPSItem
    {
        /// <summary>
        /// GSPSキー
        /// </summary>
        [DataMember]
        public string GSPSKey;

        /// <summary>
        /// コンテンツラベル
        /// </summary>
        [DataMember]
        public string ContentLabel;

        /// <summary>
        /// コンテンツ記述
        /// </summary>
        [DataMember]
        public string ContentDescription;

        /// <summary>
        /// 提示作成日付
        /// </summary>
        [DataMember]
        public string PresentationCreationDate;

        /// <summary>
        /// 提示作成時刻
        /// </summary>
        [DataMember]
        public string PresentationCreationTime;

        /// <summary>
        /// コンテンツ作成者の名前
        /// </summary>
        [DataMember]
        public string ContentCreatorName;
    }
}
