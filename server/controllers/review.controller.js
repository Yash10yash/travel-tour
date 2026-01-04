import Review from '../models/Review.model.js';
import Tour from '../models/Tour.model.js';
import Booking from '../models/Booking.model.js';

// @desc    Get reviews for a tour
// @route   GET /api/reviews/tour/:tourId
// @access  Public
export const getTourReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({
      tour: req.params.tourId,
      isApproved: true
    })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({
      tour: req.params.tourId,
      isApproved: true
    });

    res.json({
      success: true,
      count: reviews.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { tour, rating, comment, booking } = req.body;

    // Check if user has a booking for this tour
    if (booking) {
      const bookingData = await Booking.findById(booking);
      if (!bookingData || bookingData.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to review this tour'
        });
      }
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user.id,
      tour
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this tour'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      tour,
      booking,
      rating,
      comment,
      isVerified: !!booking
    });

    // Update tour rating
    await updateTourRating(tour);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Update tour rating
    await updateTourRating(review.tour);

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const tourId = review.tour;
    await review.deleteOne();

    // Update tour rating
    await updateTourRating(tourId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update tour rating
const updateTourRating = async (tourId) => {
  const reviews = await Review.find({ tour: tourId, isApproved: true });
  
  if (reviews.length === 0) {
    await Tour.findByIdAndUpdate(tourId, {
      'rating.average': 0,
      'rating.count': 0
    });
    return;
  }

  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await Tour.findByIdAndUpdate(tourId, {
    'rating.average': Math.round(average * 10) / 10,
    'rating.count': reviews.length
  });
};

