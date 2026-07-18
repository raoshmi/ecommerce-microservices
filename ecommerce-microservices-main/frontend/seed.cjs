const http = require('http');

const products = [
    { name: "Sony Alpha a7 III", description: "Mirrorless Digital Camera", price: 1999.99, stock: 10, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" },
    { name: "Apple MacBook Pro 14", description: "M3 Pro chip, 18GB RAM, 512GB SSD", price: 1999.00, stock: 25, category: "Laptops", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800" },
    { name: "Nike Air Max 270", description: "Men's casual everyday sneakers", price: 150.00, stock: 50, category: "Shoes", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" },
    { name: "Sony WH-1000XM5", description: "Wireless Noise Canceling Headphones", price: 348.00, stock: 100, category: "Audio", imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800" }
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
