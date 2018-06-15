using ProtoBuf;

namespace ProRadServiceLib
{
    /// <summary>
    /// STUDYキー
    /// </summary>
    [ProtoContract]
    public class StudyKey
    {
        /// <summary>
        /// スタディインスタンスUID
        /// </summary>
        [ProtoMember(1)]
        public string StudyInstanceUID { get; set; }

        /// <summary>
        /// PACS検索
        /// </summary>
        [ProtoMember(2)]
        public bool IsPacsSearch { get; set; }

        /// <summary>
        /// ストレージID(RS用)
        /// </summary>
        [ProtoMember(3)]
        public string StorageID { get; set; }
    }
}
