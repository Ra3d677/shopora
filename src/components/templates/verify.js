const fs = require("fs");
const c = fs.readFileSync("E:/multo2/src/components/templates/Hotel1Template.tsx", "utf8");
console.log("Total lines:", c.split("\n").length);
console.log("Has use client:", c.includes('"use client"'));
console.log("Has export default:", c.includes("export default function"));
console.log("Has renderHome:", c.includes("const renderHome"));
console.log("Has renderAbout:", c.includes("const renderAbout"));
console.log("Has renderRooms:", c.includes("const renderRooms"));
console.log("Has renderRoomDetail:", c.includes("const renderRoomDetail"));
console.log("Has renderBlog:", c.includes("const renderBlog"));
console.log("Has renderBlogDetail:", c.includes("const renderBlogDetail"));
console.log("Has renderRestaurant:", c.includes("const renderRestaurant"));
console.log("Has renderSpa:", c.includes("const renderSpa"));
console.log("Has renderGallery:", c.includes("const renderGallery"));
console.log("Has renderContact:", c.includes("const renderContact"));
console.log("Has renderBooking:", c.includes("const renderBooking"));
console.log("Has useInsertionEffect:", c.includes("useInsertionEffect"));
console.log("Has hl-style:", c.includes("hl-style"));
const last50 = c.slice(-50);
console.log("Last 50 chars:", JSON.stringify(last50));
// Check for balanced braces
let opens = 0;
for (const ch of c) { if (ch === "{") opens++; if (ch === "}") opens--; }
console.log("Unbalanced braces:", opens);
