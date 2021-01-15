import React, { useEffect, useState } from "react";
import ProductCard from "./product_card.component.jsx";
import empty from "../../assets/images/empty.jpg";
import axios from "axios";
import { apiUrl } from "../../configParams.js";

export default function Home(props) {
  const [products, setProducts] = useState([]);

  

  useEffect(() => {
    axios.get(apiUrl + `products`).then((res) => {
      const products = res.data;
      if (products.status === "success") {
        setProducts(products.data.products);
      } else {
        setProducts([]);
      }
    });
  }, []);

  return (
    <div className="my-2 px-6 py-2">
      <h2 className="text-4xl font-extrabold text-gray-900 font-nunito py-3 text-center">
        Hello There... Let's go a-shopping!
      </h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-5 justify-between items-center gap-10 mt-10 mx-16">
          {products.map((product) => {
            return (
              <ProductCard
                key={product._id}
                productName={product.name}
                productPrice={product.price}
                currencyCode={product.currencyCode}
                imageLink={product.productImageLink}
                id={product._id}
              />
            );
          })}
        </div>
      ) : (
          <div className="text-4xl font-extrabld m-auto text-center py-20">
            <h2 className="text-3xl font-extrabold m-auto font-nunito text-yellow-800">
              No products at this time
          </h2>
            <img src={empty} alt="empty" className="w-2/5 mx-auto" />
          </div>
        )}
    </div>
  );
}
