using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Homework.Domain.RequestModels.ProductRequestModels;
using Homework.Domain.ViewModels.ProductViewModels;
using Homework.Domain.Error;
namespace Homework.Domain.Interfaces.Services.ProductServices
{
    public interface IQueryProductService
    {
        Task<List<ProductListViewModel>> GetProductList(
        GetProductListRequestModel request,CustomError error);

        Task<ProductInfoViewModel?> GetProductInfo(
            GetProductInfoRequestModel request,CustomError error);
    }
}
