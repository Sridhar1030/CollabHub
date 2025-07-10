const path = require("path");

const USER_KEYS = {
	sridhar: "abc123",
	testuser: "xyz789",
};

const EC2_USER = "ubuntu"; // or ec2-user for Amazon Linux
const EC2_IP = "13.200.241.196";
const PEM_PATH = path.resolve(__dirname, "../collabhub.pem"); // .pem file in backend folder
const PORT = 3000;

module.exports = {
	USER_KEYS,
	EC2_USER,
	EC2_IP,
	PEM_PATH,
	PORT
}; 