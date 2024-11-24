import api from "@/utils/api/publicApi";

export const validatePassword = async (password: string) => {
  if (password !== "") {
    try {
      const response = await api.post("api/auth/validate-password/", {
        password: password,
      });
      return response.data.data || null;
    } catch (error) {
      console.error("Error validating password:", error);
      throw new Error("An unexpected error occurred. Please try again later.");
    }
  }
};
