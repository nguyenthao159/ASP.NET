using Microsoft.AspNetCore.Http;
namespace nguyenthithuthao_2122110543_buoi02.DTO
{
    public class ProductCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int CategoryId { get; set; }
        public IFormFile? Image { get; set; } // dùng để nhận file ảnh từ form
    }
}
