const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Function to fetch product information for a given serial number
async function fetchProductInfo(serialNumber) {
    const url = 'https://pcsupport.lenovo.com/ca/en/api/v4/upsell/redport/getIbaseInfo';
    const headers = { 'Content-Type': 'application/json' };
    const body = { serialNumber };

    try {
        console.log(`Fetching product info for serial number: ${serialNumber}`);
        
        const response = await axios.post(url, body, { headers });

        const data = response.data;

        const machineInfo = data?.data?.machineInfo;

        if (!machineInfo) {
            return { error: 'No machine information found for this serial number.' };
        }

        // Extract relevant details
        const model = machineInfo.productName?.split('(')[0].trim() || 'Unknown';
        const warrantyDetails = data.data.currentWarranty;
        const warrantyEndDate = warrantyDetails?.endDate || null;

        // Check if the product is under warranty
        const underWarranty = isUnderWarranty(warrantyEndDate);

        return {
            serialNumber,
            model,
            warrantyEndDate: warrantyEndDate || 'No warranty info available',
            underWarranty,
        };
    } catch (error) {
        console.error('Error fetching product info:', error.message);
        return { error: 'Failed to fetch product info.' };
    }
}

// Function to determine if the product is under warranty
function isUnderWarranty(warrantyEndDate) {
    if (!warrantyEndDate) {
        return false; // No warranty information available
    }

    const currentDate = new Date();
    const endDate = new Date(warrantyEndDate);

    return currentDate <= endDate; // True if the warranty end date is in the future
}

// API endpoint to fetch product information
app.post('/api/product-info', async (req, res) => {
    const { serialNumber } = req.body;

    if (!serialNumber) {
        return res.status(400).json({ error: 'Serial number is required.' });
    }

    const productInfo = await fetchProductInfo(serialNumber);

    if (productInfo.error) {
        return res.status(500).json(productInfo);
    }

    res.json(productInfo);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
