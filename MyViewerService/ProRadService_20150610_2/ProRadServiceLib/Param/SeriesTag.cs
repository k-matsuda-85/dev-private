using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// SERIESタグ
    /// </summary>
    [DataContract]
    public class SeriesTag
    {
        /// <summary>
        /// SERIESキー
        /// </summary>
        [DataMember]
        public string SeriesKey = "";

        /// <summary>
        /// IMAGEキー(ダイナミック検査用？)
        /// </summary>
        [DataMember]
        public List<string> ImageKeys = null;

        /// <summary>
        /// モダリティ
        /// </summary>
        [DataMember]
        public string Modality = "";

        /// <summary>
        /// シリーズ記述
        /// </summary>
        [DataMember]
        public string SeriesDescription = "";

        /// <summary>
        /// シリーズ番号
        /// </summary>
        [DataMember]
        public long SeriesNumber = 0;

        /// <summary>
        /// イメージ数
        /// </summary>
        [DataMember]
        public int NumberOfImages = 0;

        /// <summary>
        /// フレーム数
        /// </summary>
        [DataMember]
        public int NumberOfFrames = 0;

        /// <summary>
        /// GSPS有無フラグ
        /// </summary>
        [DataMember]
        public bool IsGSPS = false;

        //ソート用
        public string SeriesInstanceUID = "";
        public string SOPInstanceUID = "";
        public long InstanceNumber = 0;
    }
}
