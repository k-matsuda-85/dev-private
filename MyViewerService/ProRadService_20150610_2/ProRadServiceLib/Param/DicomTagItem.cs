using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// DICOMタグ
    /// </summary>
    [DataContract]
    public class DicomTagItem
    {
        [DataMember]
        public uint Tag;

        [DataMember]
        public string EName;

        [DataMember]
        public string JName;

        [DataMember]
        public string VR;

        [DataMember]
        public int DataSize;

        [DataMember]
        public string Value;
    }
}
