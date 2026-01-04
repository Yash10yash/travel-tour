import Destination from '../models/Destination.model.js';
import Tour from '../models/Tour.model.js';

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, country, search } = req.query;

    const query = { isActive: true };

    if (country) {
      query.country = new RegExp(country, 'i');
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { country: new RegExp(search, 'i') }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const destinations = await Destination.find(query)
      .sort('name')
      .skip(skip)
      .limit(Number(limit));

    const total = await Destination.countDocuments(query);

    res.json({
      success: true,
      count: destinations.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: destinations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
export const getDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination || !destination.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Get tours for this destination
    const tours = await Tour.find({
      destination: destination._id,
      isActive: true
    }).limit(6);

    res.json({
      success: true,
      data: {
        destination,
        tours
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create destination
// @route   POST /api/destinations
// @access  Private/Admin
export const createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
export const updateDestination = async (req, res, next) => {
  try {
    let destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: destination
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    await destination.deleteOne();

    res.json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get countries list
// @route   GET /api/destinations/countries/list
// @access  Public
export const getCountries = async (req, res, next) => {
  try {
    const countries = await Destination.distinct('country', { isActive: true });
    res.json({
      success: true,
      data: countries.sort()
    });
  } catch (error) {
    next(error);
  }
};

