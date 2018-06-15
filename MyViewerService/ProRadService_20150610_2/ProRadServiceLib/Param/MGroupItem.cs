using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    [DataContract]
    public class MGroupItem
    {
        [DataMember]
        public string GroupID = null;

        [DataMember]
        public string GroupName = null;
    }
}
