import Product from "../models/ProductModel.js";
import User from "../models/Usermodel.js";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
// create a product
export const CreateProduct = async (req, res) => {
  try {
    // uploading the image
    const { name, description, price, brand, category, productimage, stock } =
      req.body;
    const mycloud = await cloudinary.v2.uploader.upload(productimage, {
      folder: "avatars",
    });
    const imageobj = {
      url: mycloud.url,
      public_id: mycloud.public_id,
    };
    const product = await Product({
      name,
      description,
      price,
      category,
      brand,
      stock,
    });
    product.image.push(imageobj);
    product.save();
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error,
    });
  }
};

// get all product
export const Getallproduct = async (req, res) => {
  let product;
  try {
    if (req.query.limit && req.query.limit > 0) {
      product = await Product.find({ ratings: 5 }).limit(req.query.limit);
      return res.status(200).json({
        success: true,
        product,
      });
    }
    product = await Product.find();
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "product not found",
    });
  }
};

export const getProductByCategory = async (req, res) => {
  if (req.body.category !== "all") {
    const product = await Product.find({ category: req.body.category });
    return res.status(200).json({
      success: true,
      product,
    });
  } else {
    const product = await Product.find();
    res.status(200).json({
      success: true,
      product,
    });
  }
};

// Update a product
export const UpdateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(401).json({ message: "product not found" });
    }
    let cloud;
    if (product.image[0].url !== req.body.avatarpreview) {
      const deleted = await cloudinary.uploader.destroy(req.body.public_id);
      cloud = await cloudinary.v2.uploader.upload(req.body.avatarpreview, {
        folder: "avatars",
      });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body);
    if (product.image[0].url !== req.body.avatarpreview) {
      product.image = {
        public_id: cloud.public_id,
        url: cloud.url,
      };
    }
    product.save();
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

//Delete product
export const Deleteproduct = async (req, res) => {
  try {
    const product = Product.findById(req.params.id);
    // await cloudinary.uploader.destroy(req.params.publicid);
    if (!product) {
      return res.status(400).json({
        message: "product not found",
      });
    }
    await product.remove();
    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// get product by id
export const getsingleproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(401).json({
        success: false,
        message: "no product found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
  }
};

// create  a review
export const createproductreview = async (req, res) => {
  let product;
  if (req.body.token) {
    const data = jwt.verify(req.body.token, process.env.JWT_SECRET);
    // finding the user
    const user = await User.findById(data.id);
    const review = {
      profile: req.body.profile,
      user: user._id,
      name: user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    //finding product to give review
    product = await Product.findById(req.body.productId);
    if (product) {
      product.reviews.push(review);
      product.numberofreviews = product.reviews.length;
      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;
      product.save();
      res.status(200).json({
        success: true,
        product,
      });
    }
  } else {
    return res.status(401).json({
      message: "product not found",
    });
  }
};

// get all review of single product Admin
export const getProductreview = async (req, res) => {
  const product = await Product.findById(req.body.productid);
  if (!product) {
    return res.status(401).json({
      message: "product not found",
    });
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
};

export const deletereview = async (req, res) => {
  const product = await Product.findById(req.params.productid);
  if (!product) {
    return res.status(401).json({
      message: "product not found",
    });
  }
  const review = product.reviews.filter(
    (rev) => rev._id.toString() != req.params.reviewId.toString()
  );
  product.reviews = review;
  if (review.length > 0) {
    product.numberofreviews = Number(product.reviews.length);
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += Number(rev.rating);
    });
    product.ratings = avg / Number(product.reviews.length);
  }
  product.save();
  res.status(200).json({
    success: true,
    product,
  });
};

// delete review Admin
export const deleteReviewAdmin = async (req, res) => {
  const { productId, reviewId } = req.body;
  const product = await Product.findById(productId);
  if (product) {
    product.reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== reviewId.toString()
    );
  }
  product.numberofreviews = Number(product.reviews.length);
  product.ratings = 0;
  if (product.reviews.length > 0) {
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += Number(rev.rating);
    });
    product.ratings = avg / Number(product.reviews.length);
  }
  product.save();
  res.status(200).json({
    success: true,
    reviews: product.reviews,
    message: "review deleted please reload the page",
  });
};

// add images in the single product
export const getallimage = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  console.log(product);
  if (product) {
    res.status(200).json({
      success: true,
      images: product.image,
    });
  }
};

// upload image function
const uploadImage = async (data) => {
  const cloud = await cloudinary.v2.uploader.upload(data, {
    folder: "avatars",
  });

  const imgobj = {
    public_id: cloud.public_id,
    url: cloud.url,
  };
  console.log(imgobj);
};

export const addimage = async (req, res) => {
  const { images } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(401).json({
        success: false,
        message: "product not found",
      });
    }
    for (let i = 0; i < images.length; i++) {
      const cloud = await cloudinary.v2.uploader.upload(images[i], {
        folder: "avatars",
      });
      product.image.push({
        public_id: cloud.public_id,
        url: cloud.secure_url,
      });
    }
    product.save();
    res.status(200).json({
      success: true,
      message: "image is succcessfully added",
      product,
    });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: error,
    });
  }
};
// delete images in the single product
export const deleteimage = async (req, res) => {
  const product = await Product.findById(req.params.id);
  const { imageid } = req.body;
  if (!product) {
    return res.status(401).json({
      success: false,
      message: "product not found",
    });
  }
  if (product.image.length > 1) {
    const updateimagearray = product.image.filter(
      (item) => item.public_id.toString() != imageid.toString()
    );
    product.image = updateimagearray;
    product.save();
    return res.status(200).json({
      success: true,
      message: "image is deleted successfully",
      product,
    });
  }
  else{
    return res.status(200).json({
      success: false,
      message: "Product contain only one image",
    });
  }
};
