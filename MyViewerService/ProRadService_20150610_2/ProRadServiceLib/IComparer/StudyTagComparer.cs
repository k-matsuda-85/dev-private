using System.Collections.Generic;

namespace ProRadServiceLib.IComparer
{
    /// <summary>
    /// STUDYソート条件
    /// </summary>
    class StudyTagComparer : IComparer<StudyTag>
    {
        public int Compare(StudyTag x, StudyTag y)
        {
            int c = (y.StudyDate + y.StudyTime).CompareTo(x.StudyDate + x.StudyTime);
            if (c == 0)
            {
                return x.StudyInstanceUID.CompareTo(y.StudyInstanceUID);
            }
            else
            {
                return c;
            }
        }
    }
}
