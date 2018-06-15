using System.Runtime.Serialization;

namespace ProRadServiceLib
{
    /// <summary>
    /// ROI
    /// </summary>
    [DataContract]
    public class RoiItem
    {
        /// <summary>
        /// 最小値
        /// </summary>
        [DataMember]
        public double Minimum;

        /// <summary>
        /// 最大値
        /// </summary>
        [DataMember]
        public double Maximum;

        /// <summary>
        /// 平均値
        /// </summary>
        [DataMember]
        public double Average;

        /// <summary>
        /// 面積
        /// </summary>
        [DataMember]
        public double Area;

        /// <summary>
        /// 標準偏差
        /// </summary>
        [DataMember]
        public double StandardDeviation;
    }
}
