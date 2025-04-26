namespace nguyenthithuthao_2122110543_buoi02.Model
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
