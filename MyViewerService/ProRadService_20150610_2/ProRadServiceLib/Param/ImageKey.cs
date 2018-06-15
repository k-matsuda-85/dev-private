using ProtoBuf;

namespace ProRadServiceLib
{
    /// <summary>
    /// IMAGEキー
    /// </summary>
    [ProtoContract]
    public class ImageKey
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
        /// フレーム番号
        /// </summary>
        [ProtoMember(4)]
        public int FrameNumber { get; set; }

        /// <summary>
        /// ストレージID
        /// </summary>
        [ProtoMember(5)]
        public string StorageID { get; set; }
    }
}
