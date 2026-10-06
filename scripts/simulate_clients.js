async function simulateClient(clientNumber) {
    try {
        const response = await fetch('http://localhost:3000/read-file');
        const content = await response.text();
        console.log(`Klient ${clientNumber}: HTTP ${response.status} - ${content}`);
    } catch (error) {
        console.error(`Klient ${clientNumber}: fejl - ${error.message}`);
    }
}

async function main() {
    const clients = Array.from({ length: 10 }, (_, index) => simulateClient(index + 1));
    await Promise.all(clients);
}

main();
