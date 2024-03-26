export async function handler(event: any) {
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "This is Open API Response" }),
    isBase64Encoded: false,
  };
  return response;
}
