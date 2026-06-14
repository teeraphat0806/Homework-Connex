using Homework.Domain.RequestModels.ProductRequestModels;
using Homework.Domain.Error;
using System;

namespace Homework.Domain.ValidateModels.ProductValidateModels
{
    public class CreateProductValidateModel
    {
        public static void Validate(CreateProductRequestModel param, CustomError error)
        {
            bool hasCategory = (param.CategoryId.HasValue && param.CategoryId.Value > 0) || 
                               (param.CategoryIds != null && param.CategoryIds.Any(id => id > 0));
            if (!hasCategory)
            {
                error.AddError("CategoryId", "กรุณาเลือกหมวดหมู่สินค้า");
            }
            if (string.IsNullOrWhiteSpace(param.ProductCode))
            {
                error.AddError("ProductCode", "กรุณากรอก ProductCode");
            }
            if (string.IsNullOrWhiteSpace(param.Name))
            {
                error.AddError("Name", "กรุณากรอกชื่อสินค้า");
            }
            if (param.Price < 0)
            {
                error.AddError("Price", "ราคาสินค้าต้องไม่น้อยกว่า 0");
            }
            if (param.StockQty < 0)
            {
                error.AddError("StockQty", "จำนวนสินค้าในคลังต้องไม่น้อยกว่า 0");
            }
        }
    }

    public class UpdateProductValidateModel
    {
        public static void Validate(UpdateProductRequestModel param, CustomError error)
        {
            if (param.ProductId <= 0)
            {
                error.AddError("ProductId", "รหัสสินค้าไม่ถูกต้อง");
            }
            bool hasCategory = (param.CategoryId.HasValue && param.CategoryId.Value > 0) || 
                               (param.CategoryIds != null && param.CategoryIds.Any(id => id > 0));
            if (!hasCategory)
            {
                error.AddError("CategoryId", "กรุณาเลือกหมวดหมู่สินค้า");
            }
            if (string.IsNullOrWhiteSpace(param.ProductCode))
            {
                error.AddError("ProductCode", "กรุณากรอก ProductCode");
            }
            if (string.IsNullOrWhiteSpace(param.Name))
            {
                error.AddError("Name", "กรุณากรอกชื่อสินค้า");
            }
            if (param.Price < 0)
            {
                error.AddError("Price", "ราคาสินค้าต้องไม่น้อยกว่า 0");
            }
            if (param.StockQty < 0)
            {
                error.AddError("StockQty", "จำนวนสินค้าในคลังต้องไม่น้อยกว่า 0");
            }
        }
    }
}
