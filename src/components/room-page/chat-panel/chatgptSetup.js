

export const getGPTResponse = async (inputText, codeContent, language) => {
  // const endpoint = import.meta.env.VITE_CLOUD_CHATGPT_URL;

  const endpoint = import.meta.env.VITE_CLOUD_CHATGPT_URL;
  
  // console.log(endpoint);

  try {
    const payload = {
      prompt: `${inputText}\n\nLanguage: ${language}\n\nCode: ${codeContent}`,
      // Add other parameters if needed, like temperature, max_tokens, etc.
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include authorization headers if required, for instance:
        // Authorization: `Bearer ${your_access_token_here}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Assuming the cloud function returns the response directly
  } catch (error) {
    console.error("Failed to get GPT-3 response:", error);
    // Handle errors or show a message to the user
  }
};