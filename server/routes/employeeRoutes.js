const router = require('express').Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// ✅ POST /api/employees → create new employee (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
     console.log('req.user:', req.user); 
  try {
    const { username, email, password, phone, dob } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Please fill in all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployee = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      dob,
      role: "employee", // force role to employee
    });

    await newEmployee.save();

    const { password: _, ...employeeData } = newEmployee.toObject();
    res.status(201).json({ msg: "Employee added successfully", employee: employeeData });
  } catch (e) {
    console.error("Employee creation error:", e);
    res.status(500).json({ msg: "Failed to add employee" });
  }
});

// GET /api/employees → list all employees (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('_id username email phone status createdAt');
    res.json(employees);
  } catch (e) {
    console.error('Employees list error:', e);
    res.status(500).json({ msg: 'Failed to fetch employees' });
  }
});

// Search employees by username (Admin only)
router.get('/search/:query', auth, async (req, res) => {
  try {
    // Only admins can search
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const query = req.params.query;
    const employees = await User.find({
      role: 'employee',
      username: { $regex: query, $options: 'i' }
    }).select('username email'); // only send what is needed

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error during search' });
  }
});

// GET /api/employees/:id → get one employee (admin only)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const emp = await User.findById(req.params.id)
      .select('_id username email phone status role');
    if (!emp) return res.status(404).json({ msg: 'Employee not found' });
    res.json(emp);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Failed to fetch employee' });
  }
});

// PUT /api/employees/:id → update employee (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {

  try {
    const { username, email, phone, status } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phone, status },
      { new: true, runValidators: true, select: '_id username email phone status role' }
    );
    if (!updated) return res.status(404).json({ msg: 'Employee not found' });
    res.json({ msg: 'Employee updated', employee: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Failed to update employee' });
  }
});

module.exports = router;
