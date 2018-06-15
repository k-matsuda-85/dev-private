using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// IMAGEタグ
    /// </summary>
    [DataContract]
    public class ImageTag
    {
        /// <summary>
        /// IMAGEキー
        /// </summary>
        [DataMember]
        public string ImageKey = "";

        /// <summary>
        /// インスタンス番号
        /// </summary>
        [DataMember]
        public long InstanceNumber = 0;

        /// <summary>
        /// スライス厚さ
        /// </summary>
        [DataMember]
        public string SliceThickness = null;

        /// <summary>
        /// 画像位置（患者）
        /// </summary>
        [DataMember]
        public string ImagePositionPatient = null;

        /// <summary>
        /// 画像方向（患者）
        /// </summary>
        [DataMember]
        public string ImageOrientationPatient = null;

        /// <summary>
        /// スライス位置
        /// </summary>
        [DataMember]
        public string SliceLocation = null;

        /// <summary>
        /// 行
        /// </summary>
        [DataMember]
        public int Rows = 0;

        /// <summary>
        /// 列
        /// </summary>
        [DataMember]
        public int Columns = 0;

        /// <summary>
        /// 画素間隔
        /// </summary>
        [DataMember]
        public string PixelSpacing = "";

        /// <summary>
        /// ウィンドウ中心
        /// </summary>
        [DataMember]
        public string WindowCenter = "";

        /// <summary>
        /// ウィンドウ幅
        /// </summary>
        [DataMember]
        public string WindowWidth = "";

        /// <summary>
        /// ImageInfo要求
        /// </summary>
        [DataMember]
        public bool IsImageInfo = false;

        //フレームの数
        public int NumberOfFrames = 1;

        //マルチフレームかどうか
        public bool IsMultiframe
        {
            get { return NumberOfFrames > 1; }
            set { }
        }

        //ソート用
        public string SOPInstanceUID = "";

        //YCOM用
        public ImageKey YcomImageKey = null;
    }
}
