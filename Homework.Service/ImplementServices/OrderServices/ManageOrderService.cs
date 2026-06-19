using Homework.Domain.Enum;
using Homework.Domain.Error;
using Homework.Domain.Interfaces.Services.OrderServices;
using Homework.Domain.Interfaces.Services.UserServices;
using Homework.Domain.Models;
using Homework.Domain.RequestModels.OrderRequestModels;
using Homework.Domain.ViewModels.OrderViewModels;
using Homework.Domain.ViewModels.ProductViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Homework.Service.ImplementServices.OrderServices
{
    public class ManageOrderService : IManageOrderService
    {
        private readonly postgresContext _context;
        private readonly IUserContextService _userContextService;
        private readonly CustomError _error;
        public ManageOrderService(postgresContext context, IUserContextService userContextService, CustomError error)
        {
            _context = context;
            _userContextService = userContextService;
            _error = error;
        }
        #region Create Order
        public async Task<OrderManageViewModel> CreateOrder(CreateOrderRequestModel param, CustomError error)
        {
            var timeStamp = DateTime.UtcNow;

            if (param == null)
            {
                error.AddError("Request", "Request ไม่ถูกต้อง");
                error.ThrowIfError();
            }
            // ValidateOrder
            ValidateOrder(param, error);
            error.ThrowIfError();

            // ดึง UserId จาก Token
            var userIdText = _userContextService.GetUserIdFromToken();
            long? userId = long.TryParse(userIdText, out long parsedUserId)
                ? parsedUserId
                : null;

            // Start Transaction
            await using var transaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                // สร้างเลขที่ออเดอร์ GenerateOrderNo รูปแบบ: ORD-YYYY-Sequence
                var yearStr = timeStamp.ToString("yyyy");
                var orderNo = await GenerateOrderNo(yearStr);

                // สร้างออเดอร์ใหม่ในสถานะ Draft
                var order = new Orders
                {
                    OrderNo = orderNo,
                    OrderDate = timeStamp,
                    Status = EnumOrderStatus.Draft,
                    CreatedByUserId = userId,
                    CreatedTime = timeStamp,
                    TotalAmount = 0,
                    OrderItems = new List<OrderItems>()
                };
                // วนลูปสินค้าทุกรายการใน OrderItems
                foreach (var item in param.OrderItems)
                {
                    // ค้นหาสินค้า
                    var product = await _context.Products
                        .FirstOrDefaultAsync(x => x.ProductId == item.ProductId);
                    

                    ValidateOrderItem(error, item, product);
                    error.ThrowIfError();


                    var price = product.Price;
                    // สร้าง OrderItems
                    var orderItem = new OrderItems
                    {
                        ProductId = product.ProductId,
                        Qty = item.Qty,
                        Price = price,
                        OrderItemStatus = EnumOrderItemStatus.Draft
                    };
                    // เพิ่ม OrderItems เข้าไปในออเดอร์
                    order.OrderItems.Add(orderItem);
                    // คำนวณราคารวม
                    order.TotalAmount += item.Qty * price;
                }

                _context.Orders.Add(order);

                // Save รอบแรก เพื่อให้ได้ OrderId และ OrderItemId จริง
                await _context.SaveChangesAsync();

                // บันทึก Log Order
                var logOrder = new LogOrders
                {
                    OrderId = order.OrderId,
                    OrderNo = order.OrderNo,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    CreatedByUserId = userId,
                    Action = "Create",
                    LogTime = timeStamp
                };

                _context.LogOrders.Add(logOrder);

                // วนลูปสินค้าทุกรายการใน OrderItems
                foreach (var orderItem in order.OrderItems)
                {
                    // สร้าง Log OrderItems
                    var logOrderItem = new LogOrderItems
                    {
                        OrderItemId = orderItem.OrderItemId,
                        OrderId = order.OrderId,
                        ProductId = orderItem.ProductId,
                        Qty = orderItem.Qty,
                        Price = orderItem.Price,
                        OrderItemStatus = orderItem.OrderItemStatus,
                        CreatedByUserId = userId,
                        Action = "Create",
                        LogTime = timeStamp
                    };
                    
                    //สร้างธุรกรรมตัดสต็อก ProductStockTransactions
                    //ประเภท: Issue, สถานะ: Pending
                    var stockTransaction = new ProductStockTransactions
                    {
                        ProductId = orderItem.ProductId ?? 0,
                        OrderId = order.OrderId,
                        OrderItemId = orderItem.OrderItemId,
                        TransactionType = EnumStockTransactionType.Issue,
                        Qty = orderItem.Qty,
                        Status = EnumStockTransactionStatus.Pending,
                        CreatedByUserId = userId,
                        CreatedTime = timeStamp
                    };
                    // บันทึก Log OrderItems และ ProductStockTransactions
                    _context.LogOrderItems.Add(logOrderItem);
                    _context.ProductStockTransactions.Add(stockTransaction);
                }
                // บันทึกข้อมูลลงฐานข้อมูล
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new OrderManageViewModel
                {
                    IsSuccess = true,
                    Message = "Order created successfully",
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        #endregion

        private static void ValidateOrderItem(CustomError error, CreateOrderItemRequestModel item, Products? product)
        {
            if (product == null)
            {
                error.AddError("ProductId", $"ไม่พบสินค้า ProductId: {item.ProductId}");
                return;
            }

            if (product.IsActive == false)
            {
                error.AddError("ProductId", $"สินค้านี้ถูกปิดใช้งาน ProductId: {item.ProductId}");
            }
        }

        private static void ValidateOrder(CreateOrderRequestModel param, CustomError error)
        {
            if (param.OrderItems == null || !param.OrderItems.Any())
            {
                error.AddError("OrderItems", "กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
                return;
            }

            if (param.OrderItems.Any(x => x.Qty <= 0))
            {
                error.AddError("Qty", "จำนวนสินค้าต้องมากกว่า 0");
            }

        }

        private async Task<string> GenerateOrderNo(string todayStr)
        {
            // นับจำนวนออเดอร์ที่มีเลขที่ขึ้นต้นด้วย ORD-YYYY-
            var count = await _context.Orders
                .Where(o => o.OrderNo.StartsWith($"ORD-{todayStr}-"))
                .CountAsync();
            // บวก 1 เพื่อให้ได้เลขที่ออเดอร์ถัดไป
            var nextSeq = count + 1;
            // คืนค่าเลขที่ออเดอร์
            return $"ORD-{todayStr}-{nextSeq:D4}";
        }
        #region UpdateOrder
        public async Task<OrderManageViewModel> UpdateOrder(UpdateOrderRequestModel param, CustomError error)
        {
            var timeStamp = DateTime.UtcNow;

            ValidateUpdateOrder(param, error,timeStamp);
            error.ThrowIfError();

            // สร้าง Transaction
            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // ดึงข้อมูลออเดอร์
                var order = await _context.Orders.Include(x => x.OrderItems).FirstOrDefaultAsync(x => x.OrderId == param.OrderId);

                if (order == null)
                {
                    error.AddError("Order", "ไม่พบออเดอร์");
                    error.ThrowIfError();
                }

                if (order.Status != EnumOrderStatus.Draft && order.Status != EnumOrderStatus.Pending)
                {
                    error.AddError("Order", "แก้ไขได้เฉพาะออเดอร์ Draft หรือ Pending เท่านั้น");
                    error.ThrowIfError();
                }
                
                // ดึงข้อมูลผู้ใช้
                var userIdText = _userContextService.GetUserIdFromToken();
                long? userId = long.TryParse(userIdText, out long parsedUserId) ? parsedUserId : null;

                // อัปเดตข้อมูลออเดอร์
                order.OrderDate = param.OrderDate ?? order.OrderDate;
                order.ModifiedByUserId = userId;
                order.ModifiedTime = timeStamp;

                // 1. Cancel stock transaction เดิมของ order นี้
                var oldStockTransactions = await _context.ProductStockTransactions.Where(
                    x =>
                        x.OrderId == order.OrderId &&
                        x.TransactionType == EnumStockTransactionType.Issue &&
                        x.Status == EnumStockTransactionStatus.Pending)
                    .ToListAsync();
                // เปลี่ยนสถานะ stock transaction เดิมเป็น Cancelled
                foreach (var oldTransaction in oldStockTransactions)
                {
                    oldTransaction.Status = EnumStockTransactionStatus.Cancelled;
                    oldTransaction.Remark = "Cancelled by update order";
                }

                // 2. หา item ที่ถูกลบออกจาก request
                var requestItemIds = param.OrderItems.Where(x => x.OrderItemId.HasValue).Select(x => x.OrderItemId!.Value).ToList();
                // ลบ item ที่ถูกลบออกจาก request โดยการดึงข้อมูลที่มี OrderItemId ที่ไม่อยู่ใน requestItemIds
                var deleteItems = order.OrderItems.Where(x => !requestItemIds.Contains(x.OrderItemId)).ToList();
                // เก็บ OrderItemId ที่ถูกลบ
                var deleteItemIds = deleteItems.Select(x => x.OrderItemId).ToList();
                // ลบ stock transaction ที่เกี่ยวข้องกับ OrderItemId ที่ถูกลบ
                var deleteStockTransactions = await _context.ProductStockTransactions
                    .Where(x => x.OrderItemId.HasValue &&
                                deleteItemIds.Contains(x.OrderItemId.Value))
                    .ToListAsync();
                // ลบ log order ที่เกี่ยวข้องกับ OrderItemId ที่ถูกลบ
                var deleteLogItems = await _context.LogOrderItems.Where(x => deleteItemIds.Contains(x.OrderItemId)).ToListAsync();

                // ลบข้อมูลที่เกี่ยวข้อง
                _context.ProductStockTransactions.RemoveRange(deleteStockTransactions);
                _context.LogOrderItems.RemoveRange(deleteLogItems);
                _context.OrderItems.RemoveRange(deleteItems);

                // เพิ่ม log order
                var logOrder = new LogOrders
                {
                    OrderId = order.OrderId,
                    OrderNo = order.OrderNo,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    CreatedByUserId = userId,
                    Action = "Update",
                    LogTime = timeStamp
                };

                _context.LogOrders.Add(logOrder);

                // 3. Sync OrderItems
                foreach (var item in param.OrderItems)
                {
                    // ดึงข้อมูลสินค้า
                    var product = await _context.Products.FirstOrDefaultAsync(x => x.ProductId == item.ProductId);

                    // ตรวจสอบว่าสินค้ามีอยู่จริงหรือไม่
                    if (product == null)
                    {
                        error.AddError("ProductId", $"ไม่พบสินค้า ProductId: {item.ProductId}");
                        error.ThrowIfError();
                    }

                    // ตรวจสอบว่าสินค้าถูกเปิดใช้งานหรือไม่
                    if (product.IsActive == false)
                    {
                        error.AddError("ProductId", $"สินค้านี้ถูกปิดใช้งาน ProductId: {item.ProductId}");
                        error.ThrowIfError();
                    }




                    //  ดึงข้อมูล OrderItem โดยใช้ OrderItemId ที่ส่งมา
                    if (item.OrderItemId.HasValue)
                    {
                        //  หา OrderItem ที่มี OrderItemId ที่ส่งมา
                        var existingItem = order.OrderItems.FirstOrDefault(x => x.OrderItemId == item.OrderItemId.Value);

                        if (existingItem == null)
                        {
                            error.AddError("OrderItemId", $"ไม่พบ OrderItemId: {item.OrderItemId.Value}");

                            error.ThrowIfError();
                        }
                        //  อัปเดตข้อมูล OrderItem
                        existingItem.ProductId = product.ProductId;
                        existingItem.Qty = item.Qty;
                        existingItem.Price = product.Price;
                        existingItem.OrderItemStatus = order.Status == EnumOrderStatus.Draft ? EnumOrderItemStatus.Draft : EnumOrderItemStatus.Pending;

                        //  เพิ่ม log order item
                        var logOrderItem = new LogOrderItems
                        {
                            OrderItemId = existingItem.OrderItemId,
                            OrderId = order.OrderId,
                            ProductId = existingItem.ProductId,
                            Qty = existingItem.Qty,
                            Price = existingItem.Price,
                            OrderItemStatus = existingItem.OrderItemStatus,
                            CreatedByUserId = userId,
                            Action = "Update",
                            LogTime = timeStamp
                        };
                        _context.LogOrderItems.Add(logOrderItem);

                    }
                    // ไม่พบ OrderItemId  เป็นการเพิ่มรายการสินค้าใหม่
                    else
                    {
                        var newItem = new OrderItems
                        {
                            ProductId = product.ProductId,
                            Qty = item.Qty,
                            Price = product.Price,
                            OrderItemStatus = order.Status == EnumOrderStatus.Draft ? EnumOrderItemStatus.Draft : EnumOrderItemStatus.Pending
                        };
                        var logOrderItem = new LogOrderItems
                        {
                            OrderId = order.OrderId,
                            ProductId = newItem.ProductId,
                            Qty = newItem.Qty,
                            Price = newItem.Price,
                            OrderItemStatus = newItem.OrderItemStatus,
                            CreatedByUserId = userId,
                            Action = "Create",
                            LogTime = timeStamp
                        };
                        order.OrderItems.Add(newItem);
                        _context.LogOrderItems.Add(logOrderItem);
                    }


                }

                // 4. คำนวณยอดใหม่
                order.TotalAmount = order.OrderItems.Where(x => _context.Entry(x).State != EntityState.Deleted).Sum(x => x.Qty * x.Price);

                // Save รอบแรก เพื่อให้ OrderItemId ใหม่ถูกสร้าง
                await _context.SaveChangesAsync();

                // 5. Insert ProductStockTransactions ใหม่ทั้งหมดจาก OrderItems ปัจจุบัน
                var currentOrderItems = await _context.OrderItems.Where(x => x.OrderId == order.OrderId).ToListAsync();

                //  เพิ่มรายการ ProductStockTransactions ใหม่
                foreach (var orderItem in currentOrderItems)
                {
                    //  ตรวจสอบว่า ProductId ไม่เป็นค่าว่าง
                    if (!orderItem.ProductId.HasValue)
                    {
                        error.AddError("ProductId", $"ProductId ของ OrderItemId {orderItem.OrderItemId} เป็นค่าว่าง");

                        error.ThrowIfError();
                    }
                    //  เพิ่มรายการ ProductStockTransactions ใหม่
                    _context.ProductStockTransactions.Add(new ProductStockTransactions
                    {
                        ProductId = orderItem.ProductId.Value,
                        OrderId = order.OrderId,
                        OrderItemId = orderItem.OrderItemId,
                        TransactionType = EnumStockTransactionType.Issue,
                        Qty = orderItem.Qty,
                        Status = EnumStockTransactionStatus.Pending,
                        Remark = "Re-create borrow transaction after update order",
                        CreatedByUserId = userId,
                        CreatedTime = timeStamp
                    });
                }

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return new OrderManageViewModel
                {
                    IsSuccess = true,
                    Message = "อัปเดตออเดอร์เรียบร้อยแล้ว",
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        #endregion
        private static void ValidateUpdateOrder(UpdateOrderRequestModel param, CustomError error,DateTime timeStamp)
        {
            if (param.OrderId == null)
            {
                error.AddError("OrderId", "OrderId is required");
            }
            if (param.OrderDate == null)
            {
                error.AddError("OrderDate", "วันที่ออเดอร์เป็นข้อมูลที่จำเป็น");
            }
            if (param.OrderDate != null && param.OrderDate > timeStamp)
            {
                error.AddError("OrderDate", "วันที่ออเดอร์ต้องไม่เป็นอนาคต");
            }
        }

        #region delete order
        public async Task<OrderManageViewModel> DeleteOrder(DeleteOrderRequestModel param, CustomError error)
        {
            var order = await _context.Orders.Include(o => o.OrderItems).ThenInclude(oi => oi.Product).FirstOrDefaultAsync(o => o.OrderId == param.OrderId);
            var timeStamp = DateTime.UtcNow;
            if (order == null)
            {
                error.AddError("Order", "ไม่พบออเดอร์");
            }
            error.ThrowIfError();

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // ถ้าออเดอร์เป็นสถานะ Draft, Pending, Rejected จะเป็นการลบออเดอร์จริงๆ และ ลบ ProductStockTransactions
                if (order.Status == EnumOrderStatus.Draft || order.Status == EnumOrderStatus.Pending || order.Status == EnumOrderStatus.Rejected)
                {
                    //  ลบรายการ ProductStockTransactions
                    var stockTransactions = await _context.ProductStockTransactions.Where(x => x.OrderId == order.OrderId).ToListAsync();

                    _context.ProductStockTransactions.RemoveRange(stockTransactions);
                    _context.OrderItems.RemoveRange(order.OrderItems);
                    _context.Orders.Remove(order);
                }
                // ถ้าออเดอร์เป็นสถานะ Approved, Cancelled จะเป็นการเปลี่ยนสถานะของ Order และ OrderItems เป็น Cancelled และ เปลี่ยนสถานะของ ProductStockTransactions เป็น Cancelled ที่อนุมัติแล้ว
                else if (order.Status == EnumOrderStatus.Approved || order.Status == EnumOrderStatus.Cancelled)
                {
                    // ถ้าออเดอร์ถูกอนุมัติแล้ว ให้เปลี่ยนสถานะเป็น Cancelled แทนการลบ
                    order.Status = EnumOrderStatus.Cancelled;
                    _context.Orders.Update(order);
                    order.ModifiedTime = timeStamp;
                    //  เปลี่ยนสถานะของ OrderItems เป็น Cancelled
                    foreach (var item in order.OrderItems)
                    {
                        item.OrderItemStatus = EnumOrderItemStatus.Cancelled;
                    }
                    //  เปลี่ยนสถานะของ ProductStockTransactions เป็น Cancelled ที่อนุมัติแล้ว
                    var approvedTransactions = await _context.ProductStockTransactions
                        .Where(x =>
                            x.OrderId == order.OrderId &&
                            x.Status == EnumStockTransactionStatus.Approved)
                        .ToListAsync();

                    foreach (var tx in approvedTransactions)
                    {
                        tx.Status = EnumStockTransactionStatus.Cancelled;
                        tx.Remark = "Cancelled by delete order";
                    }
                }
                else
                {
                    error.AddError("Order", $"ไม่สามารถลบออเดอร์ที่มีสถานะ {order.Status} ได้");
                    error.ThrowIfError();
                }
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                transaction.RollbackAsync();
            }
            return new OrderManageViewModel
            {
                IsSuccess = true,
                Message = "ลบออเดอร์เรียบร้อยแล้ว",
            };
        }
        
        #endregion

        #region approve order
        public async Task<OrderManageViewModel> ApproveOrder(ApproveOrderRequestModel param, CustomError error)
        {
            // หาออเดอร์ที่ต้องการอนุมัติ
            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.OrderId == param.OrderId);
            if (order == null)
            {
                error.AddError("Order", "ไม่พบออเดอร์");
                error.ThrowIfError();
            }
            // ตรวจสอบว่าออเดอร์เป็นสถานะ Pending หรือไม่
            if (order.Status != EnumOrderStatus.Pending)
            {
                error.AddError("Order", "อนุมัติได้เฉพาะออเดอร์ที่มีสถานะ Pending เท่านั้น");
                error.ThrowIfError();
            }
            // ดึงข้อมูลผู้ใช้ที่อนุมัติ
            var userIdText = _userContextService.GetUserIdFromToken();
            long? userId = long.TryParse(userIdText, out long parsedUserId) ? parsedUserId : null;
            var timeStamp = DateTime.UtcNow;
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {// วนลูปหา order , orderItem หรือ productStockTransaction ที่ต้องการอนุมัติ
                if (param.Items == null || !param.Items.Any())
                {
                    // ===== สถานการณ์ที่ 1: ไม่ส่งรายการเข้ามาเลย (Approve All Fallback) =====
                    // เปลี่ยนสถานะออเดอร์เป็น Approved
                    order.Status = EnumOrderStatus.Approved;
                    order.ModifiedByUserId = userId;
                    order.ModifiedTime = timeStamp;
                    // วนลูปหา orderItem ที่ต้องการอนุมัติ เปลี่ยนสถานะเป็น Approved
                    foreach (var item in order.OrderItems)
                    {
                        // เปลี่ยนสถานะ orderItem เป็น Approved
                        item.OrderItemStatus = EnumOrderItemStatus.Approved;
                        item.ApprovedByUserId = userId;
                        item.ApprovedTime = timeStamp;
                        // เพิ่มข้อมูลลงใน logOrderItems
                        var logOrderItem = new LogOrderItems
                        {
                            OrderItemId = item.OrderItemId,
                            OrderId = order.OrderId,
                            ProductId = item.ProductId,
                            Qty = item.Qty,
                            Price = item.Price,
                            OrderItemStatus = item.OrderItemStatus,
                            ApprovedByUserId = userId,
                            ApprovedTime = timeStamp,
                            Action = "Approve",
                            CreatedByUserId = userId,
                            LogTime = timeStamp
                        };
                        _context.LogOrderItems.Add(logOrderItem);
                    }
                    // วนลูปหา ProductStockTransactions ที่ต้องการอนุมัติ เปลี่ยนสถานะเป็น Approved
                    var stockTransactions = await _context.ProductStockTransactions
                        .Where(x =>
                            x.OrderId == order.OrderId &&
                            x.TransactionType == EnumStockTransactionType.Issue &&
                            x.Status == EnumStockTransactionStatus.Pending)
                        .ToListAsync();
                    // เปลี่ยนสถานะ ProductStockTransactions เป็น Approved
                    foreach (var tx in stockTransactions)
                    {
                        tx.Status = EnumStockTransactionStatus.Approved;
                        tx.Remark = "Approved by approve order (All)";
                    }
                }
                else
                {
                    // ===== สถานการณ์ที่ 2: ส่งรายการ orderItem เข้ามาเลย (Individual Decisions) =====
                    // วนลูปหา orderItem ที่ต้องการอนุมัติ เปลี่ยนสถานะเป็น Approved
                    foreach (var item in order.OrderItems)
                    {
                        // หาข้อมูลการตัดสินใจในรายการ orderItem ที่ส่งเข้ามา
                        var decision = param.Items.FirstOrDefault(x => x.OrderItemId == item.OrderItemId);
                        // ถ้าไม่พบข้อมูลการตัดสินใจ หรือพบข้อมูลการตัดสินใจเป็น Approved ให้ดำเนินการต่อ
                        if (decision == null || decision.Status == EnumOrderItemStatus.Approved)
                        {
                           
                            if (decision != null && decision.Qty.HasValue)
                            {
                                var newQty = decision.Qty.Value;
                                if (newQty < 1)
                                {
                                    error.AddError("Qty", $"จำนวนสินค้าต้องอย่างน้อย 1 ชิ้น (OrderItemId: {item.OrderItemId}) หากต้องการยกเลิกให้เลือกสถานะ Rejected");
                                    error.ThrowIfError();
                                }
                               // ถ้ามีข้อมูลจำนวนสินค้ามาแล้วจำนวนต้องน้อยกว่าจำนวนสินค้าเดิม
                                if (newQty > item.Qty)
                                {
                                    error.AddError("Qty", $"ไม่สามารถเพิ่มจำนวนได้ (จำนวนเดิม: {item.Qty}, ขออนุมัติใหม่: {newQty})");
                                    error.ThrowIfError();
                                }
                                item.Qty = newQty;
                            }

                            item.OrderItemStatus = EnumOrderItemStatus.Approved;
                            item.ApprovedByUserId = userId;
                            item.ApprovedTime = timeStamp;

                            // ค้นหา ProductStockTransactions ที่เกี่ยวข้อง
                            var tx = await _context.ProductStockTransactions.FirstOrDefaultAsync(x => x.OrderItemId == item.OrderItemId && x.TransactionType == EnumStockTransactionType.Issue && x.Status == EnumStockTransactionStatus.Pending);
                            if (tx != null)
                            {
                                // ถ้ามีการส่งจำนวน Qty มาให้ update 
                                if (decision != null && decision.Qty.HasValue)
                                {
                                    tx.Qty = decision.Qty.Value;
                                }
                                tx.Status = EnumStockTransactionStatus.Approved;
                                tx.Remark = "Approved by approve order";
                            }
                            //  สร้าง LogOrderItems
                            var logOrderItem = new LogOrderItems
                            {
                                OrderItemId = item.OrderItemId,
                                OrderId = order.OrderId,
                                ProductId = item.ProductId,
                                Qty = item.Qty,
                                Price = item.Price,
                                OrderItemStatus = item.OrderItemStatus,
                                ApprovedByUserId = userId,
                                ApprovedTime = timeStamp,
                                Action = "Approve",
                                CreatedByUserId = userId,
                                LogTime = timeStamp
                            };
                            _context.LogOrderItems.Add(logOrderItem);
                        }
                        //  ถ้าพบข้อมูลการตัดสินใจเป็น Rejected เปลี่ยนสถานะ OrderItem เป็น Rejected และ Update LogOrderItems รวมถึง ProductStockTransactions 
                        else if (decision.Status == EnumOrderItemStatus.Rejected)
                        {
                            item.OrderItemStatus = EnumOrderItemStatus.Rejected;
                            item.RejectedByUserId = userId;
                            item.RejectedTime = timeStamp;
                            item.RejectedReason = decision.RejectedReason;

                            var tx = await _context.ProductStockTransactions.FirstOrDefaultAsync(x => x.OrderItemId == item.OrderItemId && x.TransactionType == EnumStockTransactionType.Issue && x.Status == EnumStockTransactionStatus.Pending);
                            // ถ้ามีข้อมูล ProductStockTransactions เปลี่ยนสถานะเป็น Cancelled
                            if (tx != null)
                            {
                                tx.Status = EnumStockTransactionStatus.Cancelled;
                                tx.Remark = $"Rejected by approve order: {decision.RejectedReason}";
                            }

                            var logOrderItem = new LogOrderItems
                            {
                                OrderItemId = item.OrderItemId,
                                OrderId = order.OrderId,
                                ProductId = item.ProductId,
                                Qty = item.Qty,
                                Price = item.Price,
                                OrderItemStatus = item.OrderItemStatus,
                                RejectedByUserId = userId,
                                RejectedTime = timeStamp,
                                RejectedReason = decision.RejectedReason,
                                Action = "Reject",
                                CreatedByUserId = userId,
                                LogTime = timeStamp
                            };
                            _context.LogOrderItems.Add(logOrderItem);
                        }
                    }

                    // Determine final order status
                    if (order.OrderItems.All(x => x.OrderItemStatus == EnumOrderItemStatus.Rejected))
                    {
                        order.Status = EnumOrderStatus.Rejected;
                    }
                    else
                    {
                        order.Status = EnumOrderStatus.Approved;
                    }

                    // Recalculate order total amount based on non-rejected items
                    order.TotalAmount = order.OrderItems
                        .Where(x => x.OrderItemStatus != EnumOrderItemStatus.Rejected)
                        .Sum(x => x.Qty * x.Price);

                    order.ModifiedByUserId = userId;
                    order.ModifiedTime = timeStamp;
                }

                var logOrder = new LogOrders
                {
                    OrderId = order.OrderId,
                    OrderNo = order.OrderNo,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    CreatedByUserId = userId,
                    Action = "Approve",
                    LogTime = timeStamp
                };

                _context.LogOrders.Add(logOrder);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return new OrderManageViewModel
                {
                    IsSuccess = true,
                    Message = "อนุมัติออเดอร์เรียบร้อยแล้ว",
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        #endregion
    
        #region RejectOrder
        public async Task<OrderManageViewModel> RejectOrder(RejectOrderRequestModel param, CustomError error)
        {
            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.OrderId == param.OrderId);
            if (order == null)
            {
                error.AddError("Order", "ไม่พบออเดอร์");
                error.ThrowIfError();
            }
            if (order.Status != EnumOrderStatus.Pending)
            {
                error.AddError("Order", "ปฏิเสธได้เฉพาะออเดอร์ที่มีสถานะ Pending เท่านั้น");
                error.ThrowIfError();
            }
            var userIdText = _userContextService.GetUserIdFromToken();
            long? userId = long.TryParse(userIdText, out long parsedUserId) ? parsedUserId : null;
            var timeStamp = DateTime.UtcNow;
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                order.Status = EnumOrderStatus.Rejected;
                order.ModifiedByUserId = userId;
                order.ModifiedTime = timeStamp;
                foreach (var item in order.OrderItems)
                {
                    item.OrderItemStatus = EnumOrderItemStatus.Rejected;
                }
                var stockTransactions = await _context.ProductStockTransactions
                    .Where(x =>
                        x.OrderId == order.OrderId &&
                        x.TransactionType == EnumStockTransactionType.Issue &&
                        x.Status == EnumStockTransactionStatus.Pending)
                    .ToListAsync();
                foreach (var tx in stockTransactions)
                {
                    tx.Status = EnumStockTransactionStatus.Cancelled;
                    tx.Remark = "Cancelled by reject order";
                }
                var logOrder = new LogOrders
                {
                    OrderId = order.OrderId,
                    OrderNo = order.OrderNo,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    CreatedByUserId = userId,
                    Action = "Reject",
                    LogTime = timeStamp
                };

                _context.LogOrders.Add(logOrder);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return new OrderManageViewModel
                {
                    IsSuccess = true,
                    Message = "ปฏิเสธออเดอร์เรียบร้อยแล้ว",
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        #endregion
        
        #region CancelOrder
        public async Task<OrderManageViewModel> CancelOrder(CancelOrderRequestModel param, CustomError error)
        {
            var order = await _context.Orders.Include(o => o.OrderItems).FirstOrDefaultAsync(o => o.OrderId == param.OrderId);
            if (order == null)
            {
                error.AddError("Order", "ไม่พบออเดอร์");
                error.ThrowIfError();
            }
            if (order.Status != EnumOrderStatus.Approved)
            {
                error.AddError("Order", "ยกเลิกได้เฉพาะออเดอร์ที่มีสถานะ Approved เท่านั้น");
                error.ThrowIfError();
            }
            var userIdText = _userContextService.GetUserIdFromToken();
            long? userId = long.TryParse(userIdText, out long parsedUserId) ? parsedUserId : null;
            var timeStamp = DateTime.UtcNow;
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                order.Status = EnumOrderStatus.Cancelled;
                order.ModifiedByUserId = userId;
                order.ModifiedTime = timeStamp;
                foreach (var item in order.OrderItems)
                {
                    item.OrderItemStatus = EnumOrderItemStatus.Cancelled;
                }
                var stockTransactions = await _context.ProductStockTransactions
                    .Where(x =>
                        x.OrderId == order.OrderId &&
                        x.TransactionType == EnumStockTransactionType.Issue &&
                        x.Status == EnumStockTransactionStatus.Approved)
                    .ToListAsync();
                foreach (var tx in stockTransactions)
                {
                    tx.Status = EnumStockTransactionStatus.Cancelled;
                    tx.Remark = "Cancelled by cancel order";
                }
                var logOrder = new LogOrders
                {
                    OrderId = order.OrderId,
                    OrderNo = order.OrderNo,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    CreatedByUserId = userId,
                    Action = "Cancel",
                    LogTime = timeStamp
                };

                _context.LogOrders.Add(logOrder);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return new OrderManageViewModel
                {
                    IsSuccess = true,
                    Message = "ยกเลิกออเดอร์เรียบร้อยแล้ว",
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        #endregion

        #region ReturnOrder
        public async Task<OrderManageViewModel> ReturnOrder(ReturnOrderRequestModel param,CustomError error)
        {
            var timeStamp = DateTime.UtcNow;
            var userIdText = _userContextService.GetUserIdFromToken();
            long? userId = long.TryParse(userIdText, out long parsedUserId) ? parsedUserId : null;
            if (param == null)
            {
                error.AddError("Request", "คำขอคืนสินค้าไม่ถูกต้อง");
                error.ThrowIfError();
            }
            if (param.Items == null || !param.Items.Any())
            {
                error.AddError("Items", "กรุณาระบุรายการสินค้าที่ต้องการคืนอย่างน้อย 1 รายการ");
                error.ThrowIfError();
            }
            if (param.Items.GroupBy(x => x.OrderItemId).Any(g => g.Count() > 1))
            {
                error.AddError("Items", "พบรายการสินค้าซ้ำในคำขอคืนสินค้า");
                error.ThrowIfError();
            }

            error.ThrowIfError();

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 1. ตรวจสอบว่าออเดอร์มีอยู่จริงและสถานะถูกต้อง
                var order = await _context.Orders.Include(x => x.OrderItems).FirstOrDefaultAsync(x => x.OrderId == param.OrderId);
                if (order == null)
                {
                    error.AddError("Order", "ไม่พบออเดอร์");
                    error.ThrowIfError();
                }
                // 2. ตรวจสอบว่าสถานะของออเดอร์เป็น Approved หรือ PartialReturned
                if (order.Status != EnumOrderStatus.Approved && order.Status != EnumOrderStatus.PartialReturned)
                {
                    error.AddError("Order", "คืนสินค้าได้เฉพาะออเดอร์ที่ Approved หรือ PartialReturned เท่านั้น");
                    error.ThrowIfError();
                }
                // 3. ตรวจสอบรายการสินค้าที่คืน
                foreach (var requestItem in param.Items)
                {
                    // ตรวจสอบว่า OrderItemId มีอยู่ในออเดอร์หรือไม่
                    var orderItem = order.OrderItems.FirstOrDefault(x => x.OrderItemId == requestItem.OrderItemId);
                    ValidateReturnOrderItem(error, requestItem, orderItem);

                    // ตรวจสอบจำนวนสินค้าที่คืนไม่เกินจำนวนที่ยืมมา
                    // คำนวณจำนวนสินค้าที่ยืมมา (Issue) และจำนวนสินค้าที่คืนแล้ว (Return)
                    var issueQty = await _context.ProductStockTransactions.Where(x => x.OrderItemId == requestItem.OrderItemId && x.TransactionType == EnumStockTransactionType.Issue && x.Status == EnumStockTransactionStatus.Approved).SumAsync(x => x.Qty);
                    var returnQty = await _context.ProductStockTransactions.Where(x => x.OrderItemId == requestItem.OrderItemId && x.TransactionType == EnumStockTransactionType.Return && x.Status == EnumStockTransactionStatus.Approved).SumAsync(x => x.Qty);
                    
                    // คำนวณจำนวนสินค้าที่ยังไม่ได้คืน (Outstanding Qty)
                    var outstandingQty = issueQty - returnQty;
                    if (requestItem.ReturnQty > outstandingQty)
                    {
                        error.AddError("ReturnQty", $"จำนวนสินค้าที่คืนต้องไม่เกินจำนวนที่ยืมมา (Outstanding Qty: {outstandingQty})");
                        error.ThrowIfError();
                    }


                    // 4. อัปเดตจำนวนสินค้าคงเหลือ (StockQty) ของสินค้า
                    var product = await _context.Products.FirstOrDefaultAsync(x => x.ProductId == orderItem.ProductId);
                    if (product == null)
                    {
                        error.AddError("Product", $"ไม่พบสินค้า ProductId: {orderItem.ProductId}");
                        error.ThrowIfError();
                    }
                    // ยอดสต็อกจะได้รับการปรับจากการเพิ่ม Return Transaction

                    // 5. สร้างรายการ ProductStockTransactions สำหรับการคืนสินค้า
                    var productStockTransaction = new ProductStockTransactions
                    {
                        ProductId = orderItem.ProductId ?? 0,
                        OrderId = order.OrderId,
                        OrderItemId = orderItem.OrderItemId,
                        TransactionType = EnumStockTransactionType.Return,
                        Qty = requestItem.ReturnQty,
                        Status = EnumStockTransactionStatus.Approved,
                        Remark = "Return by return order",
                        CreatedByUserId = null,
                        CreatedTime = timeStamp
                    };
                    
                    _context.ProductStockTransactions.Add(productStockTransaction);


                    // 6. อัปเดตสถานะของ OrderItem และ Order ตามจำนวนสินค้าที่คืน
                    var newReturnQty = returnQty + requestItem.ReturnQty;
                    orderItem.ReturnedQty = newReturnQty;
                    if (newReturnQty >= issueQty)
                    {
                        orderItem.OrderItemStatus = EnumOrderItemStatus.Returned;
                    }
                    else
                    {
                        orderItem.OrderItemStatus = EnumOrderItemStatus.PartialReturned;
                    }
                    var logOrderItem = new LogOrderItems
                    {
                        OrderItemId = orderItem.OrderItemId,
                        OrderId = order.OrderId,
                        ProductId = orderItem.ProductId,
                        Qty = requestItem.ReturnQty, // จำนวนที่คืนรอบนี้
                        Price = orderItem.Price,
                        OrderItemStatus = orderItem.OrderItemStatus,

                        Action = "Return",

                        CreatedByUserId = userId,
                        LogTime = timeStamp
                    };

                    _context.LogOrderItems.Add(logOrderItem);
                }
                // 7. อัปเดตสถานะของ Order ตามสถานะของ OrderItems
                if (order.OrderItems.All(x=> x.OrderItemStatus == EnumOrderItemStatus.Returned))
                {
                    order.Status = EnumOrderStatus.Returned;
                }
                else if(order.OrderItems.Any(x=> x.OrderItemStatus == EnumOrderItemStatus.Returned || x.OrderItemStatus == EnumOrderItemStatus.PartialReturned))
                {
                    order.Status = EnumOrderStatus.PartialReturned;
                }
                else
                {
                    order.Status = EnumOrderStatus.Approved;
                }
                var logOrder = new LogOrders
                {
                    OrderId = order.OrderId,
                    OrderNo = order.OrderNo,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    Action = "Return",
                    CreatedByUserId = userId,
                    LogTime = timeStamp
                };

                _context.LogOrders.Add(logOrder);
                // 8. บันทึกการเปลี่ยนแปลงทั้งหมด
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return new OrderManageViewModel
                {
                    IsSuccess = true,
                    Message = "คืนสินค้าเรียบร้อยแล้ว",
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        #endregion

        #region SubmitOrder
        public async Task<OrderManageViewModel> SubmitOrder(SubmitOrderRequestModel param, CustomError error)
        {
            var timeStamp = DateTime.UtcNow;

            if (param == null || param.OrderId <= 0)
            {
                error.AddError("OrderId", "กรุณาระบุ OrderId");
                error.ThrowIfError();
            }

            var userIdText = _userContextService.GetUserIdFromToken();

            long? userId = long.TryParse(userIdText, out long parsedUserId) ? parsedUserId : null;

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var order = await _context.Orders.Include(x => x.OrderItems).FirstOrDefaultAsync(x => x.OrderId == param.OrderId);

                if (order == null)
                {
                    error.AddError("Order", "ไม่พบออเดอร์");
                    error.ThrowIfError();
                }

                if (order.Status != EnumOrderStatus.Draft)
                {
                    error.AddError("Order", "Submit ได้เฉพาะออเดอร์สถานะ Draft เท่านั้น");
                    error.ThrowIfError();
                }

                if (order.OrderItems == null || !order.OrderItems.Any())
                {
                    error.AddError("OrderItems", "ไม่สามารถ Submit ออเดอร์ที่ไม่มีรายการสินค้าได้");
                    error.ThrowIfError();
                }

                order.Status = EnumOrderStatus.Pending;
                order.ModifiedByUserId = userId;
                order.ModifiedTime = timeStamp;

                foreach (var item in order.OrderItems)
                {
                    item.OrderItemStatus = EnumOrderItemStatus.Pending;

                    var logOrderItem = new LogOrderItems
                    {
                        OrderItemId = item.OrderItemId,
                        OrderId = order.OrderId,
                        ProductId = item.ProductId,
                        Qty = item.Qty,
                        Price = item.Price,
                        OrderItemStatus = item.OrderItemStatus,
                        Action = "Submit",
                        CreatedByUserId = userId,
                        LogTime = timeStamp
                    };

                    _context.LogOrderItems.Add(logOrderItem);
                }

                var logOrder = new LogOrders
                {
                    OrderId = order.OrderId,
                    OrderNo = order.OrderNo,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    Action = "Submit",
                    CreatedByUserId = userId,
                    LogTime = timeStamp
                };

                _context.LogOrders.Add(logOrder);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new OrderManageViewModel
                {
                    IsSuccess = true,
                    Message = "Submit ออเดอร์เรียบร้อยแล้ว",
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
        #endregion

        // Validate การคืนสินค้า
        private static void ValidateReturnOrderItem(CustomError error, ReturnOrderItemRequestModel requestItem, OrderItems? orderItem)
        {
            if (orderItem == null)
            {
                error.AddError("OrderItemId", $"ไม่พบ OrderItemId: {requestItem.OrderItemId}");
                return;
            }
            if (requestItem.ReturnQty <= 0)
            {
                error.AddError("ReturnQty", $"จำนวนสินค้าที่คืนต้องมากกว่า 0 (OrderItemId: {requestItem.OrderItemId})");
            }
            if (orderItem.OrderItemStatus == EnumOrderItemStatus.Returned)
            {
                error.AddError("OrderItemId", $"สินค้านี้ถูกคืนไปแล้ว (OrderItemId: {requestItem.OrderItemId})");
            }
            else if (orderItem.OrderItemStatus != EnumOrderItemStatus.Approved && orderItem.OrderItemStatus != EnumOrderItemStatus.PartialReturned)
            {
                error.AddError("OrderItemId", $"สามารถคืนสินค้าได้เฉพาะรายการที่มีสถานะ Approved หรือ PartialReturned เท่านั้น (OrderItemId: {requestItem.OrderItemId}, สถานะปัจจุบัน: {orderItem.OrderItemStatus})");
            }
            error.ThrowIfError();
        }
    }
}

