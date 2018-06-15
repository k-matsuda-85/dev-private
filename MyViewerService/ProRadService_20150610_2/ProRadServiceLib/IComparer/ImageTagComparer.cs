using System.Collections.Generic;

namespace ProRadServiceLib.IComparer
{
    /// <summary>
    /// IMAGEソート条件
    /// </summary>
    class ImageTagComparer : IComparer<ImageTag>
    {
        public int Compare(ImageTag x, ImageTag y)
        {
            int c = (int)(x.InstanceNumber - y.InstanceNumber);
            if (c == 0)
            {
                return x.SOPInstanceUID.CompareTo(y.SOPInstanceUID);
            }
            else
            {
                return c;
            }
        }
    }
}
