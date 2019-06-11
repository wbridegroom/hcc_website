using System;
using System.Collections.Generic;

namespace HolyChildhood.Models
{
    public class Form
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<FormRow> FormRows { get; set; }
        public string ResponseEmail { get; set; }

    }

    public class FormRow
    {
        public int Id { get; set; }
        public int Index { get; set; }
        public List<FormElement> FormElements { get; set; }
    }

    public class FormElement
    {
        public int Id { get; set; }
        public int Index { get; set; }
        public int Size { get; set; }
        public int Type { get; set; }
        public string Label { get; set; }
        public string HelpText { get; set; }
        public bool IsRequired { get; set; }
        public string Value { get; set; }
        public string Group { get; set; }
        public List<FormElementValue> FormElementValues { get; set; }
    }

    public class FormElementValue
    {
        public int Id { get; set; }
        public string Value { get; set; }
    }
}
