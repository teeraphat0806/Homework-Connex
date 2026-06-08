using Homework.Domain.RequestModels.ProductRequestModels;
using Homework.Domain.ViewModels.ProductViewModels;
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
        CreateProductRequestModel request);
    }
}
