import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a destination name'],
    trim: true,
    unique: true
  },
  country: {
    type: String,
    required: [true, 'Please provide a country'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image']
  },
  images: [{
    type: String
  }],
  bestTimeToVisit: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  language: {
    type: String,
    default: 'English'
  },
  timeZone: {
    type: String
  },
  coordinates: {
    lat: {
      type: Number
    },
    lng: {
      type: Number
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

destinationSchema.index({ name: 1, country: 1 });
destinationSchema.index({ isActive: 1 });

export default mongoose.model('Destination', destinationSchema);

