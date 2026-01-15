export const apiGet = async (url) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`API FAILED: ${url}`);
  }

  return res.json();
};
