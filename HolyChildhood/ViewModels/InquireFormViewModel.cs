using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HolyChildhood.ViewModels
{
    public class InquireFormViewModel
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string HomePhone { get; set; }
        public string MobilePhone { get; set; }
        public string EmailAddress { get; set; }
        public bool HasChildren { get; set; }
        public bool TalkToPastor { get; set; }
        public string BestTimeDay { get; set; }
        public List<string> Interests { get; set; }
        public string InterestsOther { get; set; }
        public string HeardHow { get; set; }
        public string HeardHowOther { get; set; }
        public string Comments { get; set; }
        public List<Child> Children { get; set; }
    }

    public class Child
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Birthday { get; set; }
        public string School { get; set; }
        public string Grade { get; set; }
    }
}
