using System.Collections.Generic;
using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// GSPSデータ
    /// </summary>
    [DataContract]
    public class GSPSDataItem
    {
        /// <summary>
        /// ImageHorizontalFlip
        /// </summary>
        [DataMember]
        public string Flip = "";

        /// <summary>
        /// ImageRotation
        /// </summary>
        [DataMember]
        public string Rotate = "";

        /// <summary>
        /// GraphicAnnotationSequence
        /// </summary>
        [DataMember]
        public string Info = "";

        /// <summary>
        /// SoftcopyVOILUTSequence
        /// </summary>
        [DataMember]
        public string VoiLut = "";

        /// <summary>
        /// DisplayedAreaSelectionSequence
        /// </summary>
        [DataMember]
        public string DisplayArea = "";
    }
}
