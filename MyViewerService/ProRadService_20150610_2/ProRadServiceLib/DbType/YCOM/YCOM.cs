using System.Configuration;

namespace ProRadServiceLib
{
    //YCOM
    //  StorageID  : なし
    // 
    //  Dicom : YCOM
    //  Meg   : [StudyInstanceUID]\[SeriesInstanceUID]\[SOPInstanceUID].meg
    //  Thumb : [StudyInstanceUID]\[SeriesInstanceUID]\[SOPInstanceUID].jpg
    partial class YCOM
    {
        static readonly ConnectionStringSettings settings = ConfigurationManager.ConnectionStrings[AppUtil.DB_YCOM];
    }
}
