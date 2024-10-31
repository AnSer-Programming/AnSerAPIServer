// Execute myFunction when scrolling
window.onscroll = function() { myFunction() };

// Get the header element
var header = document.getElementById("myHeader");
// Get the offset position of the header
var sticky = header.offsetTop;

// Add or remove "sticky" class based on scroll position
function myFunction() {
  // If the page is scrolled past the header's initial position, add "sticky"
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    // Otherwise, remove "sticky"
    header.classList.remove("sticky");
  }
}
