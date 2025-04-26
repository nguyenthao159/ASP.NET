namespace nguyenthithuthao_2122110543_buoi02.DTO
{
    public class OrderCreateDto
    {
        public long Id { get; set; }
        public string? Status { get; set; }
        public string? ShippingAddress { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; }
    }

}
