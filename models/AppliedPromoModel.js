import mongoose from "mongoose";
const appliedPromoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  appliedPromos: [
    {
      code: {
        type: String,
      },
    },
  ],
});

const AppliedPromos = mongoose.model("Appliedpromos", appliedPromoSchema);
export default AppliedPromos;
