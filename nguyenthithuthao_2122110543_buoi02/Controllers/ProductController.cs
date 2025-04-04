using Microsoft.AspNetCore.Mvc;
using nguyenthithuthao_2122110543_buoi02.Model;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace nguyenthithuthao_2122110543_buoi02.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private static List<Product> _products = new List<Product>
    {
        new Product { Id = 1, Name = "Laptop", Image = "laptop.jpg", Description = "High-end laptop", Price = 1200.50 },
        new Product { Id = 2, Name = "Phone", Image = "phone.jpg", Description = "Latest smartphone", Price = 899.99 }
    };

        // GET: api/products
        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            return Ok(_products);
        }

        // GET: api/products/1
        [HttpGet("{id}")]
        public ActionResult<Product> GetProduct(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        // POST: api/products
        [HttpPost]
        public ActionResult<Product> CreateProduct([FromBody] Product product)
        {
            product.Id = _products.Max(p => p.Id) + 1;
            _products.Add(product);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/products/1
        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, [FromBody] Product updatedProduct)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();

            product.Name = updatedProduct.Name;
            product.Image = updatedProduct.Image;
            product.Description = updatedProduct.Description;
            product.Price = updatedProduct.Price;

            return NoContent();
        }

        // DELETE: api/products/1
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product == null) return NotFound();

            _products.Remove(product);
            return NoContent();
        }
    }
}
