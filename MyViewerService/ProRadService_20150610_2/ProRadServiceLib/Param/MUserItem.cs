using System;
using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    [DataContract]
    public class MUserItem
    {
        [DataMember]
        public string GroupID = null;

        [DataMember]
        public string UserID = null;

        [DataMember]
        public string UserName = null;

        [DataMember]
        public string LoginID = null;

        [DataMember]
        public string LoginPW = null;

        [DataMember]
        public int IsAdmin = 0;

        [DataMember]
        public bool InvalidFlag = false;

        [DataMember]
        public bool LockoutFlag = false;

        [DataMember]
        public DateTime LastLoginDate;
    }
}
