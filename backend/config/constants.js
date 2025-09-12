const path = require("path");

const USER_KEYS = {
	sridhar: "abc123",
	testuser: "xyz789",
};
const EC2_API_URL = "http://3.108.234.37:3000";

const EC2_USER = "git"; // or ec2-user for Amazon Linux
const EC2_IP = "13.200.241.196";
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
