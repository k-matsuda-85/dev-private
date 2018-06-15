using System.Configuration;

namespace ProRadServiceLib
{
    //Exporter
    //  M_Hospital       → ×
    //  M_Group          → ×
    //  M_User           → UserTbl
    //  M_HospitalConfig → ×
    //  M_GroupConfig    → ×
    //  M_UserConfig     → ×
    partial class EXP
    {
        public static readonly ConnectionStringSettings settings = ConfigurationManager.ConnectionStrings[AppUtil.DB_EXP];
    }
}
