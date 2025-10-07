const path = require("path");

const USER_KEYS = {
	sridhar: "abc123",
	testuser: "xyz789",
};
const EC2_API_URL = "http://13.233.145.46:3000";

const EC2_USER = "git"; // or ec2-user for Amazon Linux
const EC2_IP = "13.233.145.46";
const PEM_PATH = path.resolve(__dirname, "../newCollabHub.pem"); // .pem file in backend folder
const PORT = 5000;

module.exports = {
	USER_KEYS,
	EC2_USER,
	EC2_IP,
	PEM_PATH,
	PORT,
	EC2_API_URL
}; 
