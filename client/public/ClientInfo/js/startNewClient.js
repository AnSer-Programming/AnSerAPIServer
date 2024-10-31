// Function to fetch URL codes from the backend API
const getURLCodes = async () => {
  try {
    // Make a GET request to /api/GetURLCode endpoint
    const response = await fetch(`/api/GetURLCode`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if the response is ok (status 200)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse and return the JSON response
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch URL codes:', error);
  }
};

// Handle form submission
$('#submitButton').on('click', async function(event) {
  event.preventDefault();  

  // Get all form elements with class 'form-control'
  let formElements = $('.form-control');
  let saveFile = [];

  // Loop through each form element and save field data
  formElements.each(function() {
    saveFile.push({
      field: this.id,
      value: this.value
    });
  });

  try {
    // Fetch URL codes from the backend
    let urlCode = await getURLCodes();

    // Output the fetched URL code and form data
    console.log('Fetched URL Code:', urlCode);
    console.log('Form Data:', saveFile);
  } catch (error) {
    console.error('Error handling form submission:', error);
  }
});
