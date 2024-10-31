$(document).ready(function() {
  // Get URL path and split it into segments
  var url = window.location.pathname;
  var getQuery = url.split('/');
  var saveFile = []; // Array to store form data

  // Handle form submission
  $('#submitButton').on('click', function(event) {
    event.preventDefault();  
    var formElements = $('.form-control');

    // Loop through each form element and store data
    formElements.each(function() {
      saveFile.push({ field: this.id, value: $(this).val() });
    });

    console.log(saveFile); // Output the form data array for debugging
  });

  // Hide or show mailing address fields based on checkbox selection
  var $mailingAddressLines = $("#mailingAddressLine1, #mailingAddressLine2, #mailingAddressLine3, #mailingAddressLine4");
  $('#sameAsPhysicalLocation').change(function(event) {
    event.preventDefault();
    if ($(this).is(":checked")) {
      $mailingAddressLines.addClass('hidden');
    } else {
      $mailingAddressLines.removeClass('hidden');
    }
  });

  // Phone number fields for formatting
  $('#primaryOfficeLine, #secondaryBackLine, #tollFree').on('blur', formatPhoneNumber);

  // Function to format phone numbers
  function formatPhoneNumber(event) {
    var phoneNumberInput = event.target;
    var phoneNumber = phoneNumberInput.value.replace(/\D/g, ''); // Remove non-numeric characters

    // Check if phone number has 10 digits
    if (phoneNumber.length === 10) {
      phoneNumberInput.value = '(' + phoneNumber.substring(0, 3) + ') ' + 
                               phoneNumber.substring(3, 6) + '-' + 
                               phoneNumber.substring(6);
      $('#error-message').hide(); // Hide error message if valid
    } else {
      // Show error message if not 10 digits
      $('#error-message').show();
    }
  }

  // Log current query segment for debugging
  console.log(getQuery[getQuery.length - 1]);
});

