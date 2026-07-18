const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🚀 Starting Instant Deployment & Sharing...");

// Function to start localtunnel
function startTunnel(port, prefix) {
    return new Promise((resolve, reject) => {
        const tunnel = spawn('npx', ['localtunnel', '--port', port], { shell: true });
        
        tunnel.stdout.on('data', (data) => {
            const output = data.toString();
            const match = output.match(/your url is: (https:\/\/.*)/);
            if (match) {
                console.log(`✅ [${prefix}] Online at: ${match[1]}`);
                resolve({ url: match[1], process: tunnel });
            }
        });

        tunnel.stderr.on('data', (data) => {
            console.error(`❌ [${prefix} Error]: ${data}`);
        });

        tunnel.on('close', (code) => {
            console.log(`[${prefix}] tunnel closed with code ${code}`);
        });
    });
}

// Function to run a command
function runCommand(command, args, cwd) {
    return new Promise((resolve, reject) => {
        console.log(`⏳ Running: ${command} ${args.join(' ')}`);
        const proc = spawn(command, args, { cwd, stdio: 'inherit', shell: true });
        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}`));
        });
    });
}

async function share() {
    try {
        console.log("🌐 1. Exposing Backend API Gateway to the internet...");
        const backendTunnel = await startTunnel(8080, 'Backend');

        console.log("\n⚙️ 2. Configuring Frontend to use the new Public API URL...");
        const frontendDir = path.join(__dirname, 'frontend');
        fs.writeFileSync(path.join(frontendDir, '.env'), `VITE_API_BASE_URL=${backendTunnel.url}\n`);

        console.log("\n📦 3. Building Frontend for Production...");
        await runCommand('npm', ['run', 'build'], frontendDir);

        console.log("\n🌍 4. Starting Production Server...");
        const serveProc = spawn('npx', ['serve', '-s', 'dist', '-p', '3000'], { cwd: frontendDir, shell: true });
        serveProc.stdout.on('data', data => {}); // suppress output

        console.log("\n🌐 5. Exposing Frontend to the internet...");
        const frontendTunnel = await startTunnel(3000, 'Frontend');

        console.log("\n========================================================");
        console.log("🎉 SUCCESS! YOUR PROJECT IS NOW LIVE ON THE INTERNET! 🎉");
        console.log("========================================================");
        console.log(`👉 Share this link with anyone: ${frontendTunnel.url}`);
        console.log("========================================================");
        console.log("(Keep this terminal running to keep the website online. Press Ctrl+C to stop)");

    } catch (err) {
        console.error("Failed to share project:", err);
    }
}

share();
