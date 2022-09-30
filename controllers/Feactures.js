import Product from "../models/ProductModel.js";

// search by name and category
export const Search = async (req, res) => {
  if (req.query.search) {
    let data = await Product.find({
      $or: [ 
        {
          name: { $regex: req.query.search, $options: "i" },
        },
        {
          category: { $regex: req.query.search, $options: "i" },
        },
        {
          brand: { $regex: req.query.search, $options: "i" },
        },
      ],
    });
    return res.json({
      data,
    });
  }
  res.status(401).json({
    success: false,
    message: "search something",
  });
};

// Filter by price
export const Filter = async (req, res) => {
  let productarray = [];
  const { category } = req.body;
  let data = await Product.find({
    price: { $gte: req.body.firstprice, $lte: req.body.secondprice },
  });
  if (category === "all") {
    res.status(200).json({
      mydata: data,
    });
  } else {
    data.forEach((product) => {
      if (product.category === category) {
        productarray.push(product);
      }
    });
    res.status(200).json({
      mydata: productarray,
    });
  }
};

export const sortingByprice = async (req, res) => {
  const { filter, category } = req.params;
  if (filter == 1 || filter == -1) {
    const product = await Product.find({ category: category }).sort({
      price: Number(filter),
    });
    res.status(200).json({
      success: true,
      product,
    });
  } else {
    if (category !== "all") {
      const product = await Product.find({ category: category });
      res.status(200).json({
        success: true,
        product,
      });
    } else {
      const product = await Product.find({});
      res.status(200).json({
        success: true,
        product,
      });
    }
  }
};
