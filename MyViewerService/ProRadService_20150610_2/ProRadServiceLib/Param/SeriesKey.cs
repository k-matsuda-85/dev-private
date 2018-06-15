using ProtoBuf;

namespace ProRadServiceLib
{
    /// <summary>
    /// SERIESキー
    /// </summary>
    [ProtoContract]
    public class SeriesKey
    {
        /// <summary>
        /// スタディインスタンスUID
        /// </summary>
        [ProtoMember(1)]
        public string StudyInstanceUID { get; set; }

        /// <summary>
        /// シリーズインスタンスUID
        /// </summary>
        [ProtoMember(2)]
        public string SeriesInstanceUID { get; set; }

        /// <summary>
        /// SOPインスタンスUID
        /// </summary>
        [ProtoMember(3)]
        public string SOPInstanceUID { get; set; }

        /// <summary>
        /// ストレージID
        /// </summary>
        [ProtoMember(4)]
        public string StorageID { get; set; }

        /// <summary>
        /// 画像かどうか
        /// </summary>
        [ProtoMember(5)]
        public bool IsImage { get; set; }

        /// <summary>
        /// PACS検索
        /// </summary>
        [ProtoMember(6)]
        public bool IsPacsSearch { get; set; }
    }
}
