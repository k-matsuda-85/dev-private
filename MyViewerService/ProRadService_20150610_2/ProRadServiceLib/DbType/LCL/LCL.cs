using System.Configuration;

namespace ProRadServiceLib
{
    //LOCAL
    //  Dicom: [StudyInstanceUID]\[SeriesInstanceUID]\[SOPInstanceUID].dcm
    //  Thumb: [StudyInstanceUID]\[SeriesInstanceUID]\[SOPInstanceUID].jpg
    //  Meg:   [StudyInstanceUID]\[SeriesInstanceUID]\[SOPInstanceUID].meg
    partial class LCL
    {
        public static readonly ConnectionStringSettings settings = ConfigurationManager.ConnectionStrings[AppUtil.DB_CLD];
    }
}
