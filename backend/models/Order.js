const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const order_schema = new Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: "users",
	},

	//this is not required as this data might not be available if a guest sends the request 
	customer: {
		name: String,
		email: String,
		phone: String,
		address: {
			city: {
				type: String,
				trim: true
			},
			street: {
				type: String,
				trim: true
			},
			building: {
				type: String,
				trim: true
			},
		},
	},

	//will be sets on save
	total_price: {
		type: Number,
		min: 1,
	},

	payment: {
		paypal_id: {
			type: String,
			match: /^[a-zA-Z0-9]+$/,
			unique: true,
			sparse: true //allow null
		},

		paypal_fee: Number,

		transaction_number: {
			type: String,
			match: /^[a-zA-Z0-9]+$/,
		},

		date: {
			type: Date,
			default: Date.now(),
		},
	},

	products: [
		{
			product: {
				type: mongoose.Types.ObjectId,
				ref: "products",
				required: true,
			},
			RTP: {
				type: Number,
				required: true,
				min: 1,
			},
			quantity: {
				type: Number,
				required: true,
				min: 1,
			},
		},
	],

	status: {
		type: Number,
		default: 1,
		min: [1, "minimum is 1"],
		max: [5, "maximum is 5"],
	},

	created_at: {
		type: Date,
		default: function () {
			return Date.now();
		},
	},

	expireAt: {
		type: Date,
		default: function () {
			return Date.now();
		},
		expires: 60 * 60 * 24 * 3 // delete order after 3 days
	}
});

order_schema.pre("save", function (next) {
	this.total_price = this.products.reduce((total, product) => {
		return total + product.RTP * product.quantity;
	}, 0);

	next();
});

module.exports = mongoose.model("orders", order_schema);
