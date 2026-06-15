const Booking = require('../models/Booking');
const { handleError } = require('../utils/errorHandler');

const STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  in_progress: 'In Progress',
  completed: 'Completed',
};

exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const month = req.query.month;
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: 'Valid month query is required (YYYY-MM).' });
    }

    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 1);

    const bookings = await Booking.find({
      createdAt: { $gte: startDate, $lt: endDate },
    }).populate('serviceId', 'name');

    const totalBookings = bookings.length;
    const completedBookings = bookings.filter((b) => b.status === 'completed');
    const pendingBookings = bookings.filter((b) => b.status === 'pending');
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const serviceCounts = {};
    const serviceRevenue = {};
    bookings.forEach((b) => {
      const name = b.serviceId?.name || 'Unknown';
      serviceCounts[name] = (serviceCounts[name] || 0) + 1;
      if (b.status === 'completed') {
        serviceRevenue[name] = (serviceRevenue[name] || 0) + b.totalPrice;
      }
    });

    const statusBreakdown = Object.keys(STATUS_LABELS).map((status) => ({
      status,
      label: STATUS_LABELS[status],
      count: bookings.filter((b) => b.status === status).length,
    }));

    const serviceBreakdown = Object.entries(serviceCounts)
      .map(([serviceName, count]) => ({
        serviceName,
        count,
        revenue: serviceRevenue[serviceName] || 0,
      }))
      .sort((a, b) => b.count - a.count);

    const mostBookedService = serviceBreakdown[0]?.serviceName || 'N/A';

    res.json({
      month,
      totalBookings,
      completedCount: completedBookings.length,
      pendingCount: pendingBookings.length,
      totalRevenue,
      mostBookedService,
      statusBreakdown,
      serviceBreakdown,
    });
  } catch (error) {
    handleError(res, error, 'Failed to load analytics.');
  }
};

exports.getTrendAnalytics = async (req, res) => {
  try {
    const months = Math.min(Math.max(parseInt(req.query.months, 10) || 6, 1), 12);
    const now = new Date();
    const trend = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
      const startDate = new Date(year, monthIndex, 1);
      const endDate = new Date(year, monthIndex + 1, 1);

      const bookings = await Booking.find({
        createdAt: { $gte: startDate, $lt: endDate },
      });

      const completed = bookings.filter((b) => b.status === 'completed');
      trend.push({
        month: monthKey,
        label: date.toLocaleString('en-US', { month: 'short', year: '2-digit' }),
        totalBookings: bookings.length,
        completedCount: completed.length,
        totalRevenue: completed.reduce((sum, b) => sum + b.totalPrice, 0),
      });
    }

    res.json({ months, trend });
  } catch (error) {
    handleError(res, error, 'Failed to load trend analytics.');
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const pendingCount = await Booking.countDocuments({ status: 'pending' });
    const todayBookings = await Booking.find({ assignedDate: today, status: { $in: ['approved', 'in_progress'] } })
      .populate('customerId', 'name phone')
      .populate('serviceId', 'name')
      .sort({ assignedTime: 1 });

    res.json({ pendingCount, todayBookings });
  } catch (error) {
    handleError(res, error, 'Failed to load dashboard stats.');
  }
};
