const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Function to fetch product information for a given serial number
async function fetchProductInfo(serialNumber) {
    const url = 'https://pcsupport.lenovo.com/ca/en/api/v4/upsell/redport/getIbaseInfo';
    const headers = { 'Content-Type': 'application/json' };
    const body = { serialNumber };

    try {
        const response = await axios.post(url, body, { headers });
        const data = response.data;

        const machineInfo = data?.data?.machineInfo;

        if (!machineInfo) {
            return { error: 'No machine information found for this serial number.' };
        }

        const model = machineInfo.productName?.split('(')[0].trim() || 'Unknown';
        const warrantyDetails = data.data.currentWarranty;
        const warrantyEndDate = warrantyDetails?.endDate || null;
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
        return false;
    }
    const currentDate = new Date();
    const endDate = new Date(warrantyEndDate);
    return currentDate <= endDate;
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

// Serve the index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
