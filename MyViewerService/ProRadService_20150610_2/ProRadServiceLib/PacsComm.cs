using DcmtkCtrl;
using DcmtkCtrl.DcmtkUtil;
using DcmUtil.Extensions;
using System;
using System.Text;

namespace ProRadServiceLib
{
    class PacsComm : IDisposable
    {


        static PacsComm()
        {
            //DcmtkCtl初期化
            DcmtkCtrl.DcmtkConfig.ExePath = AppUtil.DcmtkExePath;
            DcmtkCtrl.DcmtkConfig.DicPath = AppUtil.DcmtkDicPath;
            DcmtkCtrl.DcmtkConfig.TempPath = AppUtil.DcmtkTempPath;
            DcmtkCtrl.DcmtkConfig.CFindTimeOut = AppUtil.CFindTimeout;
            DcmtkCtrl.DcmtkConfig.CMoveTimeOut = AppUtil.CMoveTimeout;
        }

        DcmtkWork dcmtkWork = new DcmtkWork();
        string dcmtkAec;
        string dcmtkPeer;
        string dcmtkPort;

        public PacsComm()
        {
            dcmtkAec = AppUtil.DcmtkPacsAETitle;
            dcmtkPeer = AppUtil.DcmtkPacsPeer;
            dcmtkPort = AppUtil.DcmtkPacsPort;
        }

        public PacsComm(string DcmtkAec, string DcmtkPeer, string DcmtkPort)
        {
            dcmtkAec = DcmtkAec;
            dcmtkPeer = DcmtkPeer;
            dcmtkPort = DcmtkPort;
        }

        ~PacsComm()
        {
            Dispose(false);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        private void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (dcmtkWork != null) dcmtkWork.Dispose();
            }
        }

        public class FindParam
        {
            public string StudyInstanceUID { get; set; }
            public string StudyDate { get; set; }
            public string AccessionNumber { get; set; }
            public string PatientName { get; set; }
            public string PatientID { get; set; }
            public string Modality { get; set; }

            public void SetStudyDate(string StudyDateFrom, string StudyDateTo)
            {
                if (!StudyDateFrom.IsNullOrEmpty() && !StudyDateTo.IsNullOrEmpty())
                {
                    StudyDate = StudyDateFrom + "-" + StudyDateTo;
                }
                else if (!StudyDateFrom.IsNullOrEmpty())
                {
                    StudyDate = StudyDateFrom + "-";
                }
                else if (!StudyDateTo.IsNullOrEmpty())
                {
                    StudyDate = "-" + StudyDateTo;
                }
                else
                {
                    StudyDate = "";
                }
            }
        }

        //CFIND(STUDY)
        public DicomTagsResult CFindStudy(FindParam prm)
        {
            var sb = new StringBuilder();
            sb.Append(DicomDic.Find("QueryRetrieveLevel").ToString("({Tag}) {VR} [STUDY]\n"));
            sb.Append(DicomDic.Find("StudyInstanceUID").ToString("({Tag}) {VR} [{0}]\n", prm.StudyInstanceUID ?? ""));
            sb.Append(DicomDic.Find("StudyDate").ToString("({Tag}) {VR} [{0}]\n", prm.StudyDate ?? ""));
            sb.Append(DicomDic.Find("StudyTime").ToString("({Tag}) {VR}\n"));
            sb.Append(DicomDic.Find("AccessionNumber").ToString("({Tag}) {VR} [{0}]\n", prm.AccessionNumber ?? ""));
            sb.Append(DicomDic.Find("PatientsName").ToString("({Tag}) {VR} [{0}]\n", prm.PatientName ?? ""));
            sb.Append(DicomDic.Find("PatientID").ToString("({Tag}) {VR} [{0}]\n", prm.PatientID ?? ""));
            sb.Append(DicomDic.Find("StudyID").ToString("({Tag}) {VR}\n"));

            sb.Append(DicomDic.Find("ModalitiesInStudy").ToString("({Tag}) {VR} [{0}]\n", prm.Modality ?? ""));
            sb.Append(DicomDic.Find("StudyDescription").ToString("({Tag}) {VR}\n"));
            sb.Append(DicomDic.Find("PatientsBirthDate").ToString("({Tag}) {VR}\n"));
            sb.Append(DicomDic.Find("PatientsSex").ToString("({Tag}) {VR}\n"));
            sb.Append(DicomDic.Find("PatientsAge").ToString("({Tag}) {VR}\n"));
            sb.Append(DicomDic.Find("NumberOfStudyRelatedInstances").ToString("({Tag}) {VR}\n"));

            return CFind(sb.ToString());
        }

        //CFIND(SERIES)
        public DicomTagsResult CFindSeries(string StudyInstanceUID)
        {
            var sb = new StringBuilder();
            sb.Append(DicomDic.Find("QueryRetrieveLevel").ToString("({Tag}) {VR} [SERIES]\n"));
            sb.Append(DicomDic.Find("StudyInstanceUID").ToString("({Tag}) {VR} [{0}]\n", StudyInstanceUID));
            sb.Append(DicomDic.Find("SeriesInstanceUID").ToString("({Tag}) {VR}\n"));
            sb.Append(DicomDic.Find("Modality").ToString("({Tag}) {VR}\n"));
            sb.Append(DicomDic.Find("SeriesNumber").ToString("({Tag}) {VR}\n"));

            sb.Append(DicomDic.Find("NumberOfSeriesRelatedInstances").ToString("({Tag}) {VR}\n"));
            sb.Append(DicomDic.Find("SeriesDescription").ToString("({Tag}) {VR}\n"));

            return CFind(sb.ToString());
        }

        //CFIND(IMAGE)
        public DicomTagsResult CFindImage(string StudyInstanceUID, string SeriesInstanceUID)
        {
            var sb = new StringBuilder();
            sb.Append(DicomDic.Find("QueryRetrieveLevel").ToString("({Tag}) {VR} [IMAGE]\n"));
            sb.Append(DicomDic.Find("StudyInstanceUID").ToString("({Tag}) {VR} [{0}]\n", StudyInstanceUID));
            sb.Append(DicomDic.Find("SeriesInstanceUID").ToString("({Tag}) {VR} [{0}]\n", SeriesInstanceUID));
            sb.Append(DicomDic.Find("SOPInstanceUID").ToString("({Tag}) {VR}\n"));
            sb.Append(DicomDic.Find("InstanceNumber").ToString("({Tag}) {VR}\n"));

            return CFind(sb.ToString());
        }

        //CMOVE
        public DicomFilesResult CMoveImage(string StudyInstanceUID, string SeriesInstanceUID, string SOPInstanceUID)
        {
            var sb = new StringBuilder();

            if (SOPInstanceUID != null && SOPInstanceUID != "")
            {
                sb.Append(DicomDic.Find("QueryRetrieveLevel").ToString("({Tag}) {VR} [IMAGE]\n"));
                sb.Append(DicomDic.Find("StudyInstanceUID").ToString("({Tag}) {VR} [{0}]\n", StudyInstanceUID));
                sb.Append(DicomDic.Find("SeriesInstanceUID").ToString("({Tag}) {VR} [{0}]\n", SeriesInstanceUID));
                sb.Append(DicomDic.Find("SOPInstanceUID").ToString("({Tag}) {VR} [{0}]\n", SOPInstanceUID));
            }
            else if (SeriesInstanceUID != null && SeriesInstanceUID != "")
            {
                sb.Append(DicomDic.Find("QueryRetrieveLevel").ToString("({Tag}) {VR} [SERIES]\n"));
                sb.Append(DicomDic.Find("StudyInstanceUID").ToString("({Tag}) {VR} [{0}]\n", StudyInstanceUID));
                sb.Append(DicomDic.Find("SeriesInstanceUID").ToString("({Tag}) {VR} [{0}]\n", SeriesInstanceUID));
            }
            else
            {
                sb.Append(DicomDic.Find("QueryRetrieveLevel").ToString("({Tag}) {VR} [STUDY]\n"));
                sb.Append(DicomDic.Find("StudyInstanceUID").ToString("({Tag}) {VR} [{0}]\n", StudyInstanceUID));
            }

            return CMove(sb.ToString());
        }

        private DicomTagsResult CFind(string qry)
        {
            string option = string.Format("-S -aet {0} -aec {1} {2}", AppUtil.DcmtkMyAETitle, dcmtkAec, AppUtil.DcmtkCFindOptions);
            return dcmtkWork.CFind(option, dcmtkPeer, dcmtkPort, qry);
        }

        private DicomFilesResult CMove(string qry)
        {
            string option = string.Format("-S -aet {0} -aec {1} +P {2} -e {3}", AppUtil.DcmtkMyAETitle, dcmtkAec, AppUtil.DcmtkMyPort, AppUtil.DcmtkCMoveOptions);
            return dcmtkWork.CMove(option, dcmtkPeer, dcmtkPort, qry);
        }
    }
}
