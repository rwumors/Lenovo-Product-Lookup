const axios = require('axios');

// Function to test the API
async function testApi(serialNumber) {
    const apiUrl = 'http://localhost:3000/api/product-info'; // Update with your API endpoint

    try {
        console.log(`Testing API with serial number: ${serialNumber}`);

        // Make a POST request to the API
        const response = await axios.post(apiUrl, { serialNumber });

        // Log the full response
        console.log('API Response:', JSON.stringify(response.data, null, 2));

        // Display key details
        const { model, warrantyEndDate, underWarranty } = response.data;
        console.log(`Model: ${model}`);
        console.log(`Warranty End Date: ${warrantyEndDate}`);
        console.log(`Under Warranty: ${underWarranty ? 'Yes' : 'No'}`);
    } catch (error) {
        console.error('Error testing API:', error.response?.data || error.message);
    }
}

// Example serial number to test
const testSerialNumber = 'PF4Y1BQN';
testApi(testSerialNumber);
