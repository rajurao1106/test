import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFood } from "../../../../redux/addFoodSlice.js";

export default function Redux() {
  const [input, setInput] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const foodList = useSelector((state) => state.foodManagement.value);
  const dispatch = useDispatch();

  const inputHandle = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const addFoodHandler = () => {
    if (!input.name || !input.price) return alert("Name & Price required!");

    dispatch(
      addFood({
        id: Date.now(),
        foodImage: image,
        foodName: input.name,
        foodDescription: input.description,
        foodPrice: input.price,
        foodQuantity: input.quantity,
      })
    );

    // Reset form
    setInput({ name: "", description: "", price: "", quantity: "" });
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="p-6 w-full mx-auto flex">
      <div className=" shadow-lg p-4 rounded-lg space-y-4">
        <label className="block">
          <span className="font-medium">Food Image</span>
          <input
            type="file"
            className="mt-1 block w-full border border-gray-300 p-2 rounded"
            onChange={handleImage}
          />
        </label>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-24 h-24 object-cover rounded-md mx-auto"
          />
        )}

        <input
          name="name"
          value={input.name}
          onChange={inputHandle}
          placeholder="Food Name"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <textarea
          name="description"
          value={input.description}
          onChange={inputHandle}
          placeholder="Description"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={input.price}
          onChange={inputHandle}
          placeholder="Price"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="number"
          name="quantity"
          value={input.quantity}
          onChange={inputHandle}
          placeholder="Quantity"
          className="w-full border border-gray-300 p-2 rounded"
        />

        <button
          onClick={addFoodHandler}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
        >
          ADD FOOD
        </button>
      </div>

      {/* Food List */}
      <div className="mt-8 space-y-4 w-[30rem]">
        <h2 className="text-lg font-semibold mb-2">Food List</h2>

        <div className="h-[30rem] overflow-y-scroll ">
          {foodList.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-lg shadow-sm"
            >
              {item.foodImage && (
                <img
                  src={URL.createObjectURL(item.foodImage)}
                  alt="food"
                  className="w-20 h-20 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold">{item.foodName}</h3>
                <p className="text-sm">{item.foodDescription}</p>
                <p className="font-medium">${item.foodPrice}</p>
                <p className="text-sm">Qty: {item.foodQuantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
