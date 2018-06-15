using ProtoBuf;
using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// レポートキー
    /// </summary>
    [DataContract]
    [ProtoContract]
    public class RSKey
    {
        /// <summary>
        /// ユーザCD
        /// </summary>
        [DataMember]
        [ProtoMember(1)]
        public int UserCD { get; set; }

        /// <summary>
        /// シリアル番号
        /// </summary>
        [DataMember]
        [ProtoMember(2)]
        public int SerialNo { get; set; }

        /// <summary>
        /// オーダー番号
        /// </summary>
        [DataMember]
        [ProtoMember(3)]
        public string OrderNo { get; set; }

        /// <summary>
        /// 患者ID
        /// </summary>
        [DataMember]
        [ProtoMember(4)]
        public string PatientID { get; set; }

        /// <summary>
        /// 検査実施日(YYYYMMDD)
        /// </summary>
        [DataMember]
        [ProtoMember(5)]
        public string StudyDate { get; set; }

        /// <summary>
        /// モダリティ
        /// </summary>
        [DataMember]
        [ProtoMember(6)]
        public string Modality { get; set; }

        /// <summary>
        /// ビューアのHospitalID
        /// </summary>
        [ProtoMember(7)]
        public string HospitalID { get; set; }
    }
}
