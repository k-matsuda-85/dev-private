using ProtoBuf;

namespace ProRadServiceLib
{
    /// <summary>
    /// GSPSキー
    /// </summary>
    [ProtoContract]
    public class GSPSKey
    {
        /// <summary>
        /// スタディインスタンスUID
        /// </summary>
        [ProtoMember(1)]
        public string StudyInstanceUID { get; set; }

        /// <summary>
        /// (参照)シリーズインスタンスUID
        /// </summary>
        [ProtoMember(2)]
        public string ReferencedSeriesInstanceUID { get; set; }

        /// <summary>
        /// (参照)SOPインスタンスUID
        /// </summary>
        [ProtoMember(3)]
        public string ReferencedSOPInstanceUID { get; set; }

        /// <summary>
        /// コンテンツラベル
        /// </summary>
        [ProtoMember(4)]
        public string ContentLabel { get; set; }
    }
}
