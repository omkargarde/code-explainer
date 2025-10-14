"use server";

export async function explain(_prevState: any, formData: FormData) {
  const code = formData.get("code") as string;
  const language = (formData.get("language") as string) ?? "JavaScript";

  const url = import.meta.env.VITE_API_BASE_URL;
  if (!code) {
  }
  try {
    if (!code) {
      throw new Error("Code is required");
    }

    const response = await fetch(`${url}/explain-code`, {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ code, language }),
    });
    if (!response.ok) {
      return {
        error: "Failed to fetch the result",
        data: null,
      };
    }
    const data = await response.json();

    return {
      error: null,
      data: data,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
        data: null,
      };
    }
    return { error: "Something went Wrong", data: null };
  }
}
