import mongoose from 'mongoose';

const priceBenchmarkSchema = new mongoose.Schema({
  mode: {
    type: String,
    enum: ['auto', 'eRickshaw', 'guide'],
    required: true,
    unique: true
  },
  baseFare: {
    type: Number,
    required: true
  },
  perKmRate: {
    type: Number,
    required: true
  },
  waitingRate: {
    type: Number,
    required: true
  },
  nightMultiplier: {
    type: Number,
    default: 1.25
  },
  city: {
    type: String,
    default: 'Jaipur'
  }
}, {
  timestamps: true
});

export const PriceBenchmark = mongoose.model('PriceBenchmark', priceBenchmarkSchema);
