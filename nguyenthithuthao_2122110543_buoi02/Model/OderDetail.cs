using System.Text.Json.Serialization;

namespace nguyenthithuthao_2122110543_buoi02.Model
{
    public class OrderDetail
    {
        public long Id { get; set; }

        public long OrderId { get; set; }

        public long ProductId { get; set; }

        public int Quantity { get; set; }

        public decimal Price { get; set; }

        [JsonIgnore]
        public Order ? Order { get; set; }
        public Product ? Product { get; set; }

    }

}
