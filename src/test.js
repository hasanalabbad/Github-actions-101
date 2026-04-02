const { greet } = require("./index");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log("Running tests...\n");

assert(greet("Alice") === "Hello, Alice! Welcome to GitHub Actions 101.", "greet returns correct message");
assert(greet("") === "Hello, ! Welcome to GitHub Actions 101.", "greet handles empty string");
assert(typeof greet("Bob") === "string", "greet returns a string");

console.log(`\nResults: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
