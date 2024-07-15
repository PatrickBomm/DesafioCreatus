const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	level: { type: Number, default: 1, min: 1, max: 5 },
	dtStart: { type: Date, default: Date.now },
	dtEnd: { type: Date },
	dtUpdate: { type: Date },
	active: { type: Boolean, default: true }
});

UserSchema.pre('save', function (next) {
	this.dtUpdate = new Date();
	next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
	this.set({ dtUpdate: new Date() });
	next();
});

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(this.password, salt);
		this.password = hash;
		next();
	} catch (err) {
		next(err);
	}
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
