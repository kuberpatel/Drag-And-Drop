// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", function () {
  // Get the dropzone, input file element, and file list element from the DOM
  const dropzone = document.getElementById("dropzone");
  const inputFile = document.getElementById("inputFile");
  const fileList = document.getElementById("fileList");

  // Define the maximum number of images allowed
  const MAX_IMAGES = 5;

  // Add a "dragover" event listener to the dropzone to change its background color when an item is dragged over it
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = "#d3d3d3";
  });

  // Add a "dragleave" event listener to revert the dropzone background color when the dragged item leaves the dropzone
  dropzone.addEventListener("dragleave", () => {
    dropzone.style.backgroundColor = "white";
  });

  // Add a "drop" event listener to handle the drop event, change background color back, and manage the dropped files
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.backgroundColor = "white";

    const files = e.dataTransfer.files;
    manageFiles(files);
  });

  // Add a "change" event listener to handle file selection through the input element and manage the selected files
  inputFile.addEventListener("change", (e) => {
    const files = e.target.files;
    manageFiles(files);
  });

  // Add a "click" event listener to the dropzone to trigger the file input click event
  dropzone.addEventListener("click", () => {
    inputFile.click();
  });

  // Function to manage and display the files
  function manageFiles(files) {
    let imageCount = 0;
    for (const file of files) {
      if (file.type.startsWith("image/") && file.size <= 1024 * 1024) {
        imageCount++;
        if (imageCount <= MAX_IMAGES) {
          displayFile(file);
        } else {
          alert(
            "Maximum " + MAX_IMAGES + " images allowed. Skipping " + file.name
          );
        }
      } else {
        alert(file.name + " is not a valid image or it is too large.");
      }
    }
  }

  // Function to display the file in the file list
  function displayFile(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const div = document.createElement("div");
      div.className = "file-name";

      const img = document.createElement("img");
      img.src = e.target.result;
      img.alt = file.name;
      img.className = "thumbnail";
      div.appendChild(img);

      const textarea = document.createElement("textarea");
      textarea.placeholder = "Add a Description....";
      textarea.addEventListener("blur", saveToLocalStorage);
      div.appendChild(textarea);

      const checkBox = document.createElement("span");
      checkBox.textContent = "✅";
      checkBox.className = "desc-added";
      checkBox.addEventListener("click", () => {
        textarea.disabled = true;
        alert("Description added");
      });
      div.appendChild(checkBox);

      const deleteIcon = document.createElement("span");
      deleteIcon.textContent = "❌";
      deleteIcon.addEventListener("click", function () {
        fileList.removeChild(div);
        saveToLocalStorage();
      });
      div.appendChild(deleteIcon);

      fileList.appendChild(div);
    };
    reader.readAsDataURL(file);
  }

  // Function to save the displayed files and their descriptions to local storage
  function saveToLocalStorage() {
    const imagesData = Array.from(fileList.children).map((child) => {
      return {
        src: child.querySelector(".thumbnail").src,
        description: child.querySelector("textarea").value,
      };
    });
    localStorage.setItem("storedImagesData", JSON.stringify(imagesData));
  }

  // Function to load the data from local storage and display the files
  function loadFromLocalStorage() {
    const storedImagesData = JSON.parse(
      localStorage.getItem("storedImagesData") || "[]"
    );
    storedImagesData.forEach((data) => {
      const div = document.createElement("div");
      div.className = "file-name";

      const img = document.createElement("img");
      img.src = data.src;
      img.className = "thumbnail";
      div.appendChild(img);

      const textarea = document.createElement("textarea");
      textarea.value = data.description;
      textarea.placeholder = "Add a description...";
      div.appendChild(textarea);

      const checkBox = document.createElement("span");
      checkBox.textContent = "✅";
      checkBox.className = "desc-added";
      checkBox.addEventListener("click", () => {
        textarea.disabled = true;
        alert("Description added");
      });
      div.appendChild(checkBox);

      const deleteIcon = document.createElement("span");
      deleteIcon.textContent = "❌";
      deleteIcon.className = "delete-icon";
      deleteIcon.addEventListener("click", function () {
        fileList.removeChild(div);
        saveToLocalStorage();
      });

      div.appendChild(deleteIcon);
      fileList.appendChild(div);
    });
  }

  // Load the previously saved files from local storage when the page is loaded
  loadFromLocalStorage();
});
