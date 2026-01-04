import Tour from '../models/Tour.model.js';
import Destination from '../models/Destination.model.js';
import Review from '../models/Review.model.js';

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
export const getTours = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      destination,
      minPrice,
      maxPrice,
      duration,
      difficulty,
      sort = '-createdAt',
      featured
    } = req.query;

    const query = { isActive: true };

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (destination) {
      query.destination = destination;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (duration) {
      query['duration.days'] = { $lte: Number(duration) };
    }
    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const tours = await Tour.find(query)
      .populate('destination', 'name country image')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Tour.countDocuments(query);

    res.json({
      success: true,
      count: tours.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: tours
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tour
// @route   GET /api/tours/:id
// @access  Public
export const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id)
      .populate('destination')
      .populate('createdBy', 'name');

    if (!tour || !tour.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    // Get reviews
    const reviews = await Review.find({ tour: tour._id, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        tour,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tour by slug
// @route   GET /api/tours/slug/:slug
// @access  Public
export const getTourBySlug = async (req, res, next) => {
  try {
    const tour = await Tour.findOne({ slug: req.params.slug, isActive: true })
      .populate('destination')
      .populate('createdBy', 'name');

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    const reviews = await Review.find({ tour: tour._id, isApproved: true })
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        tour,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create tour
// @route   POST /api/tours
// @access  Private/Admin
export const createTour = async (req, res, next) => {
  try {
    const tourData = {
      ...req.body,
      createdBy: req.user.id
    };

    const tour = await Tour.create(tourData);

    res.status(201).json({
      success: true,
      data: tour
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private/Admin
export const updateTour = async (req, res, next) => {
  try {
    let tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: tour
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private/Admin
export const deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    await tour.deleteOne();

    res.json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured tours
// @route   GET /api/tours/featured
// @access  Public
export const getFeaturedTours = async (req, res, next) => {
  try {
    const tours = await Tour.find({ isFeatured: true, isActive: true })
      .populate('destination', 'name country image')
      .sort('-rating.average')
      .limit(6);

    res.json({
      success: true,
      count: tours.length,
      data: tours
    });
  } catch (error) {
    next(error);
  }
};

