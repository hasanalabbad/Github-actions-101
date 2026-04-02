const http = require("http");

const PORT = process.env.PORT || 3000;

function greet(name) {
  return `Hello, ${name}! Welcome to GitHub Actions 101.`;
}

if (require.main === module) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(greet("World"));
  });

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { greet };
