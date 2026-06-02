using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.Error
{
    public class CustomErrorViewModel
    {
        public List<string> ErrorMessage { get; set; } = new List<string>();
        public Dictionary<string, List<Homework.Domain.Error.ErrorMessage>> ErrorList { get; set; } = new Dictionary<string, List<ErrorMessage>>();
        public CustomErrorViewModel(CustomError error)
        {
            this.ErrorMessage = error.ErrorMessage;
            this.ErrorList = error.ErrorList;
        }
    }
}
