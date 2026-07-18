const http = require('http');

const products = [
    { name: "Apple Watch Series 9", description: "Smartwatch with Midnight Aluminum Case", price: 41900.00, stock: 40, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&q=80&w=800" },
    { name: "DJI Mini 4 Pro Drone", description: "Lightweight Mini Camera Drone with 4K HDR Video", price: 82990.00, stock: 12, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800" },
    { name: "GoPro HERO12 Black", description: "Waterproof Action Camera with 5.3K60 Video", price: 37990.00, stock: 25, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1526166729864-ddc57657d48f?auto=format&fit=crop&q=80&w=800" },
    { name: "Samsung Odyssey G9 Monitor", description: "49-inch Curved Gaming Monitor 240Hz", price: 135000.00, stock: 5, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800" },
    { name: "Logitech MX Master 3S", description: "Wireless Performance Mouse", price: 10995.00, stock: 60, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800" },
    { name: "Keychron K2 Mechanical Keyboard", description: "Wireless Mechanical Keyboard (Brown Switches)", price: 8999.00, stock: 35, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800" },
    { name: "Meta Quest 3", description: "Advanced All-in-One Virtual Reality Headset", price: 54990.00, stock: 20, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=800" },
    { name: "Apple AirPods Pro (2nd Gen)", description: "Wireless Earbuds with Active Noise Cancellation", price: 24900.00, stock: 100, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&q=80&w=800" },
    { name: "Anker PowerCore 20K", description: "20000mAh Portable Charger Power Bank", price: 3999.00, stock: 150, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&q=80&w=800" },
    { name: "JBL Flip 6", description: "Waterproof Portable Bluetooth Speaker", price: 11999.00, stock: 45, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800" },
    { name: "Amazon Echo Dot (5th Gen)", description: "Smart speaker with Alexa", price: 5499.00, stock: 80, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&q=80&w=800" },
    { name: "Netgear Nighthawk AX12", description: "12-Stream WiFi 6 Router (RAX120)", price: 42999.00, stock: 15, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1634085448386-8f2e2f385cce?auto=format&fit=crop&q=80&w=800" },
    { name: "Bose QuietComfort Earbuds II", description: "Noise Cancelling True Wireless Earbuds", price: 27900.00, stock: 30, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800" },
    { name: "Philips Hue Smart Bulb Starter Kit", description: "Color Smart LED Bulbs + Bridge", price: 14999.00, stock: 25, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800" },
    { name: "Nintendo Switch OLED", description: "Gaming Console with 7-inch OLED Screen", price: 34990.00, stock: 40, category: "Electronics", imageUrl: "https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?auto=format&fit=crop&q=80&w=800" }
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
