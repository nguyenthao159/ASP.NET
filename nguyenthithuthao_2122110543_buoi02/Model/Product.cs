using System.ComponentModel.DataAnnotations.Schema;

namespace nguyenthithuthao_2122110543_buoi02.Model
{
    public class Product
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string Image { get; set; }

        public string Description { get; set; }

        public double Price { get; set; }

        // Add category
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }
    }

}
