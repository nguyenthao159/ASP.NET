using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using nguyenthithuthao_2122110543_buoi02.Data;
using nguyenthithuthao_2122110543_buoi02.Model;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace nguyenthithuthao_2122110543_buoi02.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderDetailController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderDetailController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetail
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetAll()
        {
            // Lấy UserId từ Claims của người dùng
            var userId = GetCurrentUserId();

            // Lấy tất cả OrderDetails của người dùng hiện tại, bao gồm cả thông tin Product (nếu Product là thuộc tính điều hướng)
            var orderDetails = await _context.OrderDetails
                                              .Include(od => od.Product) // Bao gồm thông tin Product
                                              .Where(od => od.Id == userId) // Giả sử bạn có UserId trong OrderDetail
                                              .ToListAsync(); // Sử dụng ToListAsync để lấy kết quả không đồng bộ

            return Ok(orderDetails); // Trả về danh sách OrderDetail
        }


        // GET: api/OrderDetail/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetail>> GetById(long id)
        {
            // Lấy UserId từ Claims của người dùng
            var userId = GetCurrentUserId();

            // Tìm OrderDetail của người dùng hiện tại
            var detail = await _context.OrderDetails
                .Where(od => od.Order.UserId == userId && od.Id == id)
                .Include(od => od.Order)
                .FirstOrDefaultAsync();

            if (detail == null)
                return NotFound();

            return Ok(detail);
        }

        // POST: api/OrderDetail
        [HttpPost]
        public async Task<ActionResult<OrderDetail>> Create(OrderDetail orderDetail)
        {
            // Lấy UserId từ Claims của người dùng
            var userId = GetCurrentUserId();

            // Kiểm tra xem đơn hàng có thuộc về người dùng hiện tại không
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderDetail.OrderId && o.UserId == userId);
            if (order == null)
                return Unauthorized();

            // Thêm OrderDetail mới vào cơ sở dữ liệu
            _context.OrderDetails.Add(orderDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = orderDetail.Id }, orderDetail);
        }

        // PUT: api/OrderDetail/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, OrderDetail orderDetail)
        {
            if (id != orderDetail.Id)
                return BadRequest();

            // Lấy UserId từ Claims của người dùng
            var userId = GetCurrentUserId();

            // Kiểm tra quyền sở hữu đơn hàng
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderDetail.OrderId && o.UserId == userId);
            if (order == null)
                return Unauthorized();

            _context.Entry(orderDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderDetailExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/OrderDetail/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);
            if (orderDetail == null)
                return NotFound();

            // Lấy UserId từ Claims của người dùng
            var userId = GetCurrentUserId();

            // Kiểm tra quyền sở hữu đơn hàng
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderDetail.OrderId && o.UserId == userId);
            if (order == null)
                return Unauthorized();

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderDetailExists(long id)
        {
            return _context.OrderDetails.Any(e => e.Id == id);
        }

        // Phương thức tiện ích để lấy UserId từ Claims
        private int GetCurrentUserId()
        {
            // Lấy UserId từ Claims trong Token (được mã hóa khi người dùng đăng nhập)
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim);
        }
    }
}
