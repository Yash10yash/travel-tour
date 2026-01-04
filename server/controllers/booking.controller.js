import Booking from '../models/Booking.model.js';
import Tour from '../models/Tour.model.js';
import Coupon from '../models/Coupon.model.js';
import { sendBookingConfirmation } from '../utils/emailService.js';
import User from '../models/User.model.js';

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const { tour, travelDate, numberOfTravelers, travelerDetails, specialRequests, couponCode } = req.body;

    // Get tour
    const tourData = await Tour.findById(tour);
    if (!tourData || !tourData.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    // Calculate base price
    const basePrice = tourData.price;
    const discountPercent = tourData.discount || 0;
    const tourDiscountAmount = (basePrice * discountPercent) / 100;
    const priceAfterTourDiscount = basePrice - tourDiscountAmount;
    const subtotal = priceAfterTourDiscount * (numberOfTravelers.adults + (numberOfTravelers.children * 0.5));

    // Apply coupon if provided
    let couponDiscountAmount = 0;
    let finalCouponCode = null;
    
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      
      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coupon code'
        });
      }

      const validation = coupon.isValid(subtotal);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.message
        });
      }

      // Check if coupon is applicable to this tour
      if (coupon.applicableTours.length > 0 && !coupon.applicableTours.includes(tour)) {
        return res.status(400).json({
          success: false,
          message: 'This coupon is not applicable for this tour'
        });
      }

      couponDiscountAmount = coupon.calculateDiscount(subtotal);
      finalCouponCode = coupon.code;
      
      // Increment coupon usage
      coupon.usedCount += 1;
      await coupon.save();
    }

    const totalAmount = Math.round(subtotal - couponDiscountAmount);
    const totalDiscountAmount = Math.round(tourDiscountAmount * (numberOfTravelers.adults + numberOfTravelers.children) + couponDiscountAmount);

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      tour,
      travelDate,
      numberOfTravelers,
      totalAmount,
      discountAmount: totalDiscountAmount,
      couponCode: finalCouponCode,
      travelerDetails,
      specialRequests,
      status: 'pending'
    });

    // Send confirmation email
    const user = await User.findById(req.user.id);
    try {
      await sendBookingConfirmation(user, booking, tourData);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('tour', 'title images price slug')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('tour')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('tour', 'title')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    await booking.save();

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

