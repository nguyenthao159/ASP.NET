import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const query = useQuery().get("query");

  useEffect(() => {
    if (query) {
      axios.get(`http://localhost:5000/api/products/search?query=${query}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error(err));
    }
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Kết quả tìm kiếm cho: "{query}"</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3" key={product.id}>
            <div className="card">
              <img src={product.image} alt={product.name} className="card-img-top" />
              <div className="card-body">
                <h5>{product.name}</h5>
                <p>{product.price} VND</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
