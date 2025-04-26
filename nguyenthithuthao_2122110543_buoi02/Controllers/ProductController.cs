using Microsoft.AspNetCore.Mvc;
using nguyenthithuthao_2122110543_buoi02.Data;
using nguyenthithuthao_2122110543_buoi02.DTO;
using nguyenthithuthao_2122110543_buoi02.Model;
using System.IO;

namespace nguyenthithuthao_2122110543_buoi02.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly AppDbContext _context;
        public ProductsController(AppDbContext context, IWebHostEnvironment env)
        {
            _env = env;
            _context = context;
        }

        private static List<Product> _products = new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", Image = "/images/laptop.jpg", Description = "High-end laptop", Price = 1200.50, CategoryId = 1 },
            new Product { Id = 2, Name = "Phone", Image = "/images/phone.jpg", Description = "Latest smartphone", Price = 899.99, CategoryId = 2 }
        };

        private static List<Category> _categories = new List<Category>
        {
            new Category { Id = 1, Name = "Electronics", Description = "Electronic items", Image = "electronics.jpg" },
            new Category { Id = 2, Name = "Mobile", Description = "Phones", Image = "mobile.jpg" }
        };

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] ProductCreateDto dto)
        {
            if (string.IsNullOrEmpty(dto.Name))
                return BadRequest("Tên sản phẩm là bắt buộc.");

           

            string imagePath = null;
            if (dto.Image != null && dto.Image.Length > 0)
            {
                var extension = Path.GetExtension(dto.Image.FileName).ToLower();
                if (extension != ".jpg" && extension != ".jpeg" && extension != ".png")
                    return BadRequest("Chỉ hỗ trợ tệp JPG hoặc PNG.");

                if (dto.Image.Length > 5 * 1024 * 1024)
                    return BadRequest("Tệp hình ảnh không được vượt quá 5MB.");

                var uploadsFolder = Path.Combine(_env.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                imagePath = $"/images/{fileName}";
            }

            var newProduct = new Product
            {
                Id = _products.Any() ? _products.Max(p => p.Id) + 1 : 1,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                Image = imagePath
            };

            _products.Add(newProduct);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            return Ok(_products);
        }

        [HttpGet("{id}")]
        public ActionResult<Product> GetProduct(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductCreateDto dto)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();

           
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.CategoryId = dto.CategoryId;

            if (dto.Image != null && dto.Image.Length > 0)
            {
                var extension = Path.GetExtension(dto.Image.FileName).ToLower();
                if (extension != ".jpg" && extension != ".jpeg" && extension != ".png")
                    return BadRequest("Chỉ hỗ trợ tệp JPG hoặc PNG.");

                if (dto.Image.Length > 5 * 1024 * 1024)
                    return BadRequest("Tệp hình ảnh không được vượt quá 5MB.");

                var uploadsFolder = Path.Combine(_env.WebRootPath, "images");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid().ToString() + extension;
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                product.Image = $"/images/{fileName}";
            }
            _context.SaveChanges();
            return NoContent();

        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();

            if (!string.IsNullOrEmpty(product.Image))
            {
                var imagePath = Path.Combine(_env.WebRootPath, product.Image.TrimStart('/'));
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _products.Remove(product);
            _context.SaveChanges();
            return NoContent();
        }
        [HttpGet("search")]
        public ActionResult<IEnumerable<Product>> SearchProducts([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Ok(_products); // Nếu không có query, trả về tất cả

            var results = _products
                .Where(p => p.Name.Contains(query, StringComparison.OrdinalIgnoreCase))
                .ToList();

            return Ok(results);
        }

    }
}
