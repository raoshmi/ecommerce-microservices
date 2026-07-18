const http = require('http');

const products = [
    { name: "Garmin Fenix 7X Sapphire Solar", description: "Multisport GPS Smartwatch", price: 89990.00, stock: 15, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800" },
    { name: "Sony A7 IV Body", description: "Full-Frame Mirrorless Camera", price: 219990.00, stock: 8, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" },
    { name: "Razer DeathAdder V3 Pro", description: "Ergonomic Wireless Gaming Mouse", price: 14999.00, stock: 25, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c3f17?auto=format&fit=crop&q=80&w=800" },
    { name: "Asus ROG Zephyrus G14", description: "Gaming Laptop, Ryzen 9, RTX 4060", price: 165000.00, stock: 12, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800" },
    { name: "Samsung Galaxy Tab S9 Ultra", description: "14.6-inch Android Tablet with S-Pen", price: 119999.00, stock: 20, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800" },
    { name: "GoPro MAX 360", description: "Waterproof 360 + Traditional Action Camera", price: 44990.00, stock: 18, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1526166729864-ddc57657d48f?auto=format&fit=crop&q=80&w=800" },
    { name: "Bose SoundLink Flex", description: "Bluetooth Portable Speaker, Waterproof", price: 15900.00, stock: 50, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800" }
];

products.forEach(product => {
    const data = JSON.stringify(product);
    const options = {
        hostname: 'localhost',
        port: 8082,
        path: '/api/products',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    const req = http.request(options, res => {
        console.log(`Status: ${res.statusCode} for ${product.name}`);
    });
    req.on('error', error => console.error(error));
    req.write(data);
    req.end();
});
