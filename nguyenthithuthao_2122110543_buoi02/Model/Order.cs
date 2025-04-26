using System.ComponentModel.DataAnnotations.Schema;

namespace nguyenthithuthao_2122110543_buoi02.Model
{
    public class Order
    {
        public long Id { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "PENDING";

        public decimal TotalAmount { get; set; }

        public string? ShippingAddress { get; set; }

        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }

}
