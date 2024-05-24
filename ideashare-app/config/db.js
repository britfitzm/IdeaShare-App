const mongoose = require("mongoose");
 
const connetDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};
 
mongoose.set("strictQuery", true);
 
module.exports = connetDB;
