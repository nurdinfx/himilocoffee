const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    zipCode: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  paymentMethod: { type: String, required: true, default: 'Cash on Delivery' },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  taxPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
