using Homework.Domain.Interfaces.Services.ProductServices;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.ProductRequestModels;
using Homework.Domain.ViewModels.ProductViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homework.Service.ImplementServices.ProductServices
{
    public class ManageProductService : IManageProductService
    {
        private readonly postgresContext _context;
        public ManageProductService(postgresContext context)
        {
            _context = context;
        }


        public async Task<ProductManageViewModel> CreateProduct(
            CreateProductRequestModel request)
        {
            var newProduct = new Product
            {
                Sku = request.SKu,
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                Cost = request.Cost,
                StockQty = request.StockQty,
                CategoryId = request.CategoryId
            };
            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();
            return new ProductManageViewModel
            {

                IsSuccess = true,
                Message = "Product created successfully",
                ProductId = newProduct.ProductId

            };
        }
    }
}
