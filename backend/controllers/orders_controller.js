const OrderModel = require(`../models/Order`);

module.exports = {

    //TODO: logic for new orders for users & guests
    addNewOrderForGuest: async (req, res) => {
        try {
            console.log(req.body)
            // gettind values from the body request
            const {
                payment_details,
                products,
                customer_details
            } = req.body;

            // creating OrderModel using the values from req.body
            const new_Order = OrderModel({
                payment_details,
                products,
                customer_details
            });

            // actual saving
            await new_Order.save();

            // return success message
            return res.status(200).json({
                success: true,
                message: `success to add new order - for guest`
            })
        } catch (error) {
            return res.status(500).json({
                message: `error in add order - for guest`,
                error: error.message
            })
        }
    },

    add: async (req, res) => {
        try {
            // gettind values from the body request
            const { user, total_price, payment_details, products } = req.body;

            // creating OrderModel using the values from req.body
            const new_Order = OrderModel({
                user,
                total_price,
                payment_details,
                products
            });

            // actual saving
            await new_Order.save();

            // return success message
            return res.status(200).json({
                success: true,
                message: `success to add new order`
            })
        } catch (error) {
            return res.status(500).json({
                message: `error in add order`,
                error: error.message
            })
        }
    },

    guests: {
        //get order by id ONLY IF it doesnt have user associated with it (to prevent privacy leak)
        getByID: async (req, res) => {
            try {
                const id = req.params.id;
                const order = await OrderModel.find({ id, user: { $exists: false } }).populate(['user', 'products.product']).exec();
                //TODO: strip all sensitive user data
                return res.status(200).json({
                    success: true,
                    message: `הזמנה נשלפה בהצלחה`,
                    order
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף הזמנה`,
                    error: error.message
                })
            }
        }
    },

    //user functions
    users: {
        getAll: async (req, res) => {
            try {
                const id = req.user
                const orders = await OrderModel.find(id).populate(['user', 'products.product']).exec();
                return res.status(200).json({
                    success: true,
                    message: `הזמנות נשלפו בהצלחה`,
                    orders
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף את ההזמנות`,
                    error: error.message
                })
            }
        },

        getByID: async (req, res) => {
            try {
                const id = req.params.id;
                const user = req.user;
                const order = await OrderModel.find({ id, user }).populate(['user', 'products.product']).exec();
                return res.status(200).json({
                    success: true,
                    message: `הזמנה נשלפה בהצלחה`,
                    order
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף הזמנה`,
                    error: error.message
                })
            }
        }
    },

    //manager functions
    managers: {
        getAll: async (req, res) => {
            try {
                const orders = await OrderModel.find().populate(['user', 'products.product']).exec();

                return res.status(200).json({
                    success: true,
                    message: `כל ההזמנות נשלפו בהצלחה`,
                    orders
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף את כל ההזמנות`,
                    error: error.message
                })
            }
        },

        getByID: async (req, res) => {
            try {
                const order = await OrderModel.findById(req.params.id).populate([/* 'user', */'products.product']).exec();

                return res.status(200).json({
                    success: true,
                    message: `הזמנה נשלפה בהצלחה`,
                    order
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לשלוף הזמנה זו`,
                    error: error.message
                })
            }
        },

        updateStatusByID: async (req, res) => {
            try {
                const id = req.params.id;

                await OrderModel.findByIdAndUpdate(id, { status: req.body.status }).exec();

                return res.status(200).json({
                    success: true,
                    message: `סטטוס הזמנה עודכן בהצלחה`
                })
            } catch (error) {
                return res.status(500).json({
                    message: `לא היה ניתן לעדכן סטטוס הזמנה`,
                    error: error.message
                })
            }
        }
    },

    //admin functions
    admins: {
        deleteByID: async (req, res) => {
            try {
                const id = req.params.id;

                await OrderModel.findByIdAndDelete(id).exec();

                return res.status(200).json({
                    success: true,
                    message: `הזמנה נמחקה`
                })
            } catch (error) {
                return res.status(500).json({
                    message: `שגיאה במחיקת הזמנה`,
                    error: error.message
                })
            }
        }
    }
}