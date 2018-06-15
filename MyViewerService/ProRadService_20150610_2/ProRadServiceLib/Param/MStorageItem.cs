using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    [DataContract]
    public class MStorageItem
    {
        [DataMember]
        public string StorageID = null;

        [DataMember]
        public string DicomPath = null;

        [DataMember]
        public int Priority = 0;

        [DataMember]
        public string LogonUsername = null;

        [DataMember]
        public string LogonPassword = null;
    }
}
