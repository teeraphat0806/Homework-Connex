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
        Task<object> GetProductList(GetProductListRequestModel param,CustomError error);

        Task<ProductViewModel?> GetProductInfo(GetProductInfoRequestModel param,CustomError error);
        Task<List<ProductViewModel>> SearchProducts(SearchProductsRequestModel param, CustomError error);
    }
}
