using DcmUtil;

namespace ProRadServiceLib
{
    //DICOM
    //  StorageID  : 0固定
    // 
    //  Dicom : なし
    //  Meg   : [StudyInstanceUID]\[SeriesInstanceUID]\[SOPInstanceUID].meg
    //  Thumb : [StudyInstanceUID]\[SeriesInstanceUID]\[SOPInstanceUID].jpg
    partial class DCM
    {
        public static readonly DcmTag[] STUDY_TAG =
        {
            DcmTag.StudyDate,
            DcmTag.StudyTime,
            DcmTag.StudyDescription,
            DcmTag.PatientName,
            DcmTag.Modality,
            DcmTag.BodyPartExamined,
        };

        public static readonly DcmTag[] SERIES_TAG =
        {
            DcmTag.Modality,
            DcmTag.SeriesDescription,
            DcmTag.SeriesNumber,
        };

        public static readonly DcmTag[] IMAGE_TAG =
        {
            DcmTag.SOPInstanceUID,

            DcmTag.SliceThickness,

            DcmTag.InstanceNumber,
            DcmTag.ImagePositionPatient,
            DcmTag.ImageOrientationPatient,
            DcmTag.SliceLocation,

            DcmTag.PhotometricInterpretation,
            DcmTag.NumberOfFrames,
            DcmTag.Rows,
            DcmTag.Columns,
            DcmTag.PixelSpacing,
            DcmTag.WindowCenter,
            DcmTag.WindowWidth,
            DcmTag.RescaleIntercept,
            DcmTag.RescaleSlope,

            DcmTag.RequestingPhysician,
            DcmTag.RequestingService,
        };
    }
}
