using System;
using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// 検査メモ
    /// </summary>
    [DataContract]
    public class StudyMemoItem
    {
        /// <summary>
        /// メモ
        /// </summary>
        [DataMember]
        public string Memo;

        /// <summary>
        /// ユーザ
        /// </summary>
        [DataMember]
        public string UserName;

        /// <summary>
        /// メモ日付
        /// </summary>
        [DataMember]
        public DateTime MemoDate;
    }
}
