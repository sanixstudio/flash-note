export const stripHtml = (html: string): string => {
  // Create a temporary div element
  const tempDiv = document.createElement("div");

  // Set the HTML content
  tempDiv.innerHTML = html;

  // Replace <p> and <br> tags with newlines
  const elements = tempDiv.getElementsByTagName("*");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.tagName === "P" || element.tagName === "BR") {
      element.innerHTML += "\n";
    }
    // Handle list items
    if (element.tagName === "LI") {
      // If parent is ol (ordered list), use numbers
      if (element.parentElement?.tagName === "OL") {
        const index =
          Array.from(element.parentElement.children).indexOf(element) + 1;
        element.innerHTML = `${index}. ${element.innerHTML}\n`;
      } else {
        // For unordered lists, use bullet points
        element.innerHTML = `• ${element.innerHTML}\n`;
      }
    }
  }

  // Get the text content and clean it up
  let plainText = tempDiv.textContent || tempDiv.innerText || "";

  // Remove extra whitespace while preserving intentional line breaks
  plainText = plainText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line) // Remove empty lines
    .join("\n");

  return plainText;
};

// Alternative method using DOMParser (more robust)
export const stripHtmlAlternative = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");

  // Process lists and line breaks
  const elements = doc.body.getElementsByTagName("*");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.tagName === "P" || element.tagName === "BR") {
      element.innerHTML += "\n";
    }
    if (element.tagName === "LI") {
      if (element.parentElement?.tagName === "OL") {
        const index =
          Array.from(element.parentElement.children).indexOf(element) + 1;
        element.innerHTML = `${index}. ${element.innerHTML}\n`;
      } else {
        element.innerHTML = `• ${element.innerHTML}\n`;
      }
    }
  }

  const plainText = doc.body.textContent || "";
  return plainText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line)
    .join("\n");
};
