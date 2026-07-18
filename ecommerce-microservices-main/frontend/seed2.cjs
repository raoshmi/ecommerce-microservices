const http = require('http');

const products = [
    { name: "Apple iPhone 15 Pro Max", description: "256GB, Titanium Blue", price: 159900.00, stock: 15, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800" },
    { name: "Samsung Galaxy S24 Ultra", description: "512GB, Titanium Gray, AI Features", price: 129999.00, stock: 20, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=800" },
    { name: "Sony PlayStation 5", description: "Standard Edition 825GB with DualSense", price: 44990.00, stock: 50, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=800" },
    { name: "Dell XPS 15 Laptop", description: "Intel Core i9, 32GB RAM, 1TB SSD, 4K OLED", price: 185000.00, stock: 8, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800" },
    { name: "Apple iPad Pro 12.9", description: "M2 Chip, 256GB, Wi-Fi", price: 112900.00, stock: 30, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800" },
    { name: "LG C3 65-inch OLED TV", description: "4K Smart TV, 120Hz, WebOS", price: 145000.00, stock: 10, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=800" }
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
