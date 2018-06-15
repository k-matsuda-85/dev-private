using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// モダリティ毎のアノテーション設定
    /// </summary>
    [DataContract]
    public class AnnotationItem
    {
        /// <summary>
        /// モダリティ
        /// </summary>
        [DataMember]
        public string Modality;

        /// <summary>
        /// 表示位置
        /// </summary>
        [DataMember]
        public int Position;

        /// <summary>
        /// 書式
        /// </summary>
        [DataMember]
        public string Format;

        /// <summary>
        /// タグ
        /// </summary>
        [DataMember]
        public string Tag;

        /// <summary>
        /// フォントサイズ
        /// </summary>
        [DataMember]
        public string FontSize;

        /// <summary>
        /// フォントスタイル
        /// </summary>
        [DataMember]
        public string FontStyle;
    }
}
