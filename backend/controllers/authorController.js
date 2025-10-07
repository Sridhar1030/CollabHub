const axios = require('axios');

const getAuthors = async (req, res) => {
    try {
        const response = await axios.get('http://13.233.145.46:3000/authors/sridhar/react-project');
        
        // Get the authors array from response
        const authors = response.data;
        
        // Create a Set to store unique usernames (case-insensitive)
        const uniqueAuthors = new Set();
        const uniqueAuthorsList = [];
        
        // Process each author entry
        authors.forEach(author => {
            // Convert to lowercase for case-insensitive comparison
            const lowerCaseAuthor = author.toLowerCase();
            if (!uniqueAuthors.has(lowerCaseAuthor)) {
                uniqueAuthors.add(lowerCaseAuthor);
                uniqueAuthorsList.push(author); // Keep original case in result
            }
        });
        
        res.json(uniqueAuthorsList);
    } catch (error) {
        console.error('Error fetching authors:', error);
        res.status(500).json({ error: 'Failed to fetch authors' });
    }
};

module.exports = {
    getAuthors
};
