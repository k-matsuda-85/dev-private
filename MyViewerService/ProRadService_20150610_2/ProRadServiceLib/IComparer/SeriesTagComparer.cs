using System.Collections.Generic;

namespace ProRadServiceLib.IComparer
{
    /// <summary>
    /// SERIESソート条件
    /// </summary>
    class SeriesTagComparer : IComparer<SeriesTag>
    {
        public int Compare(SeriesTag x, SeriesTag y)
        {
            int c = (int)(x.SeriesNumber - y.SeriesNumber);
            if (c == 0)
            {
                int c2 = x.SeriesInstanceUID.CompareTo(y.SeriesInstanceUID);
                if (c2 == 0)
                {
                    int c3 = (int)(x.InstanceNumber - y.InstanceNumber);
                    if (c3 == 0)
                    {
                        return x.SOPInstanceUID.CompareTo(y.SOPInstanceUID);
                    }
                    else
                    {
                        return c3;
                    }
                }
                else
                {
                    return c2;
                }
            }
            else
            {
                return c;
            }
        }
    }
}
