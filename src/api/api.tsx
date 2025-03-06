export const updateStockStatus = async (
  email?: string,
  stockid?: string,
  category?: string,
  price?: number,
  quantity?: number
) => {
  try {
    await fetch(
      "https://cobt2dewyphoaoojbhiadl6gym0dozyt.lambda-url.eu-north-1.on.aws/",
      {
        method: "OPTIONS",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const response = await fetch(
      "https://cobt2dewyphoaoojbhiadl6gym0dozyt.lambda-url.eu-north-1.on.aws/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, stockid, category, price, quantity }),
      }
    );

    const data = await response.json(); 
  } catch (error) {
    console.error("Error:", error);
  }
};

export const GetStockStatus = async (email?: string) => {
  const url = new URL(
    "https://5zm6jjbdbox2sgvn6cx2zw7trq0cotbt.lambda-url.eu-north-1.on.aws/"
  );
  url.searchParams.append("email", String(email));
  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); 
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};
 