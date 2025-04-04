using Microsoft.EntityFrameworkCore;
using nguyenthithuthao_2122110543_buoi02.Model;

namespace nguyenthithuthao_2122110543_buoi02.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categorys { get; set; }

    }
}
