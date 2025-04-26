using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nguyenthithuthao_2122110543_buoi02.Data;
using nguyenthithuthao_2122110543_buoi02.DTO;
using nguyenthithuthao_2122110543_buoi02.Model;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderController(AppDbContext context)
    {
        _context = context;
    }

    // Lấy tất cả đơn hàng của người dùng hiện tại
    [HttpGet]
    public async Task<IActionResult> GetOrders()
    {
        var userId = GetCurrentUserId();

        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderDetails)
            .Include(o => o.User)
            .ToListAsync();

        return Ok(orders);
    }

    // Lấy đơn hàng theo ID của người dùng hiện tại
    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(long id)
    {
        var userId = GetCurrentUserId();

        var order = await _context.Orders
            .Where(o => o.UserId == userId && o.Id == id)
            .Include(o => o.OrderDetails)
            .Include(o => o.User)
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound();

        return Ok(order);
    }

    // Tạo đơn hàng mới cho người dùng hiện tại
    [HttpPost]
    public async Task<ActionResult<Order>> PostOrder(OrderCreateDto orderDto)
    {
        var userId = GetCurrentUserId();

        // Tính toán tổng tiền từ các chi tiết đơn hàng
        decimal totalAmount = orderDto.OrderDetails.Sum(od => od.Price * od.Qty);

        var order = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            Status = orderDto.Status ?? "PENDING",
            ShippingAddress = orderDto.ShippingAddress,
            TotalAmount = totalAmount, // Lưu tổng tiền vào đơn hàng
            OrderDetails = orderDto.OrderDetails.Select(od => new OrderDetail
            {
                ProductId = od.ProductId,
                Quantity = od.Qty,
                Price = od.Price
            }).ToList()
        };

        // Thêm đơn hàng vào DbContext
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Trả về phản hồi với thông tin đơn hàng vừa tạo
        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }



    // Cập nhật đơn hàng của người dùng hiện tại
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateOrder(long id, [FromBody] OrderUpdateDto updatedOrder)
    {
        var userId = GetCurrentUserId();

        var existingOrder = await _context.Orders
            .Where(o => o.UserId == userId && o.Id == id)
            .FirstOrDefaultAsync();

        if (existingOrder == null)
            return NotFound();

        // Cập nhật các trường cần thiết
        if (updatedOrder.Status != null)
        {
            existingOrder.Status = updatedOrder.Status;
        }

        if (updatedOrder.ShippingAddress != null)
        {
            existingOrder.ShippingAddress = updatedOrder.ShippingAddress;
        }

        _context.Orders.Update(existingOrder);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Xoá đơn hàng của người dùng hiện tại
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(long id)
    {
        var userId = GetCurrentUserId();

        var order = await _context.Orders
            .Where(o => o.UserId == userId && o.Id == id)
            .FirstOrDefaultAsync();

        if (order == null)
            return NotFound();

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Phương thức tiện ích để lấy UserId từ Claims
    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User is not authenticated");
        }
        return int.Parse(userIdClaim);
    }

    public class OrderUpdateDto
    {
        public string Status { get; set; }
        public string ShippingAddress { get; set; }
    }

}
