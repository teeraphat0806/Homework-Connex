using Homework.Domain.RequestModels.ProductRequestModels;
using Homework.Domain.ViewModels.ProductViewModels;
using Homework.Domain.Error;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Domain.Interfaces.Services.ProductServices
{
    public interface IManageProductService
    {
        Task<ProductManageViewModel> CreateProduct(
        CreateProductRequestModel request, CustomError error);

        Task<ProductManageViewModel> UpdateProduct(
        UpdateProductRequestModel request, CustomError error);

        Task<ProductManageViewModel> DeleteProduct(
        DeleteProductRequestModel request, CustomError error);
    }
}
