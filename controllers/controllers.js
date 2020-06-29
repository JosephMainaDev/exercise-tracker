const User = require("../models/user");
const Exercise = require("../models/exercise");

// POST username to create a user
exports.user_create = async (req, res, next) => {
  const username = req.body.username;
  if (!username) {
    return res.json({ Error: "Please enter a username to continue" });
  }
  const userInDb = await User.exists({ username: username });
  if (userInDb) {
    return res.json({
      Error: `${username} is already in use! Try another username.`
    });
  }
  if (username && !userInDb) {
    const user = new User({
      username: username
    });
    user
      .save()
      .then(res.json(user))
      .catch(err => next(err));
  }
};

// GET list of all users
exports.users_list = async (req, res, next) => {
  const users = await User.find();
  res.json([...users]);
};

// GET log of user exercises
exports.user_log = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const { from, to, limit } = req.query;
    if (!user) {
      return res.json({
        Error: `There is no user in the database with the ID: ${req.params.userId}`
      });
    }

    const filters = {
      userId: req.params.userId
    };

    if (from && !to) {
      filters.date = { $gte: new Date(from) };
    } else if (!from && to) {
      filters.date = { $lte: new Date(to) };
    } else if (from && to) {
      filters.date = { $gte: new Date(from), $lte: new Date() };
    }

    const exercises = await Exercise.find(filters, "-_id -userId", {
      limit: limit ? Number(limit) : null
    });

    // const count = await Exercise.countDocuments({ userId: req.params.userId });
    // count: `${count} exercises`
    
    const count = exercises.length;

    const userExercises = {
      username: user.username,
      exercises: exercises,
      count: `${ count } exercise${ count > 1 ? "s" : ""}`
    };
    res.json(userExercises);
  } catch (err) {
    next(err);
  }
};

// POST exercise of a user
exports.exercise_add = async (req, res, next) => {
  const user = await User.findById(req.body.userId)
    .lean()
    .exec();
  if (!user) {
    return res.json({
      Error: `No user was found in Database with the ID: ${req.body.userId}`
    });
  }

  const exercise = new Exercise({
    userId: req.body.userId,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date ? new Date(req.body.date) : new Date()
  });

  try {
    const ex = await exercise.save();
    // date: ex.date.toDateString(),

    const userExercise = {
      userId: ex.userId,
      username: user.username,
      date: ex.date,
      duration: `${ex.duration} minutes`,
      description: ex.description
    };

    return res.json(userExercise);
  } catch (err) {
    next(err);
  }
};
