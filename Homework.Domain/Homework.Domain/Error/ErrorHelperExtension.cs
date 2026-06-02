using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.Error
{
    public static class ErrorHelperExtension
    {
        /// <summary>
        /// Use When Exception Global Handle or when you need to Return Response To Client Only 
        /// </summary>
        /// <param name="error"></param>
        /// <returns></returns>
        public static CustomErrorViewModel ToViewModel(this CustomError error)
        {
            return new CustomErrorViewModel(error);
        }
    }
}
