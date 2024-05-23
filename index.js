// Get references to the HTML elements we need to interact with
const wrapper = document.querySelector(".wrapper");
const form = document.querySelector("form");
const fileInp = document.querySelector("input");
const inforText = document.querySelector("p");
const closeBtn = document.querySelector(".close");
const copyBtn = document.querySelector(".copy");

// Function to handle the QR code scanning request
function fetchRequest(file, formData) {
    // Update the information text to show that scanning is in progress
    inforText.innerText = "Scanning QR Code...";
    
    // Make a POST request to the QR code API with the form data
    fetch("http://api.qrserver.com/v1/read-qr-code/", {
        method: 'POST', 
        body: formData
    }).then(res => res.json()).then(result => {
        // Extract the data from the API response
        result = result[0].symbol[0].data;
        
        // Update the information text based on the scan result
        inforText.innerText = result ? "Upload QR Code To Scan" : "Couldn't Scan QR Code";
        if (!result) return;
        
        // Display the result in a textarea and the uploaded image in the form
        document.querySelector("textarea").innerText = result;
        form.querySelector("img").src = URL.createObjectURL(file);
        
        // Show the wrapper element
        wrapper.classList.add("active");
    }).catch(() => {
        // Update the information text if the scan failed
        inforText.innerText = "Couldn't Scan QR Code...";
    })
}

// Event listener for when a file is selected in the input
fileInp.addEventListener("change", async e => {
    let file = e.target.files[0];  // Get the selected file
    if (!file) return;  // If no file is selected, do nothing
    
    // Create form data and append the file to it
    let formData = new FormData();
    formData.append('file', file);
    
    // Call the fetchRequest function to scan the QR code
    fetchRequest(file, formData);
});

// Event listener for the copy button to copy the textarea content to the clipboard
copyBtn.addEventListener("click", () => {
    let text = document.querySelector("textarea").textContent;
    navigator.clipboard.writeText(text);  // Copy the text to the clipboard
});

// Event listener for the form to trigger the file input click
form.addEventListener("click", () => fileInp.click());

// Event listener for the close button to hide the wrapper element
closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));
