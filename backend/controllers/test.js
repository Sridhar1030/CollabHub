const axios = require("axios");
const EC2_API = "http://13.200.241.196:3000";

async function test() {
    const repos = await axios.get(`${EC2_API}/repositories`);
    console.log(repos.data);
}
test();