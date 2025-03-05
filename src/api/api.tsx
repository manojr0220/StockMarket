import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginapi = axios.create({
  baseURL: "https://gxp.sense7ai.com/api",
});
export const landingpage = axios.create({
  baseURL: "https://gxp.sense7ai.com/api",
});
export const applicationapi = axios.create({
  baseURL: "https://gxp.sense7ai.com/api",
});

export const stock = axios.create({
  baseURL: "https://11hr8dgjma.execute-api.eu-north-1.amazonaws.com/default",
});

export const Signupapi = (
  first_name: string,
  last_name: string,
  password: string,
  phone_num: string,
  organization_name: string,
  email: string
) => {
  const url = "/create_user";
  return loginapi.post(
    url,
    {
      first_name,
      last_name,
      password,
      phone_num,
      organization_name,
      email,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
};

export const updateStockStatus = async (
  email?: any,
  stockid?: any,
  category?: any,
  price?: any
) => {
  const url = "https://11hr8dgjma.execute-api.eu-north-1.amazonaws.com/default";

  try {
    const response = await stock.post(
      "/UpdateStockStatus",
      {
        email: email,
        stockid: stockid,
        category: category,
        price: price,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    if (response.status === 200) {
      // setloder(false);
      // notify(t("Form submitted successfully."), "success", 3000);
      // formik.resetForm();
    }
  } catch (error) {
    console.error("Error:", error);
    // notify(t("Form failed to save."), "error", 3000);
    // setloder(false);
  }
};

export const Signin = (email: string, password: string) => {
  const url = "login_api";
  return loginapi.post(
    url,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
};

export const VerifySignupapi = (email: string, otp: number) => {
  const url = "/verify_email";
  return loginapi.get(url, {
    params: {
      email,
      otp,
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const ForgotPasswordapi = (email: string) => {
  const url = "/send_reset_otp";
  return loginapi.post(
    url,
    {
      email,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
};

export const ResendCode = (email: string) => {
  const url = "/resend_verification";
  return loginapi.get(url, {
    params: {
      email,
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const Signoutapi = (email: string) => {
  const url = "/signout_api";
  return loginapi.get(url, {
    params: {
      email,
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

export const refresh_token = createAsyncThunk(
  "auth/refreshToken",
  async (refreshToken: string | null, { rejectWithValue }) => {
    if (!refreshToken) {
      return rejectWithValue("No refresh token available");
    }

    try {
      const response = await loginapi.post(
        "/refresh_token",
        { refresh_token: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data; // This will be `res.payload`
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to refresh token");
    }
  }
);

export const ResetPasswordapi = (
  otp: string,
  password: string,
  email: string
) => {
  const url = "/reset_password";
  return loginapi.post(
    url,
    {
      otp: otp,
      new_password: password,
      email,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
};

export const DeleteLocallibraryFile = (
  email: string,
  file_name: string,
  file_type: string
) => {
  const url = "/delete_local_library_file";
  return applicationapi.post(url, {
    email,
    file_name,
    file_type,
  });
};

// Create an async thunk for uploading files
export const uploadlocalfilelibrary = createAsyncThunk(
  "uploadLocalFileLibrary",
  async (formData: FormData, thunkAPI) => {
    const url = "/file_upload";
    const access_token = localStorage.getItem("access_token");

    try {
      const response = await applicationapi.post(url, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data", // Optional, as FormData sets it automatically
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Upload failed");
    }
  }
);

// Create an async thunk for uploading files
export const deletelocalfilelibrary = createAsyncThunk<any, FormData>(
  "deletelocalfilelibrary",
  async (formData, thunkAPI) => {
    const url = "/delete-file";
    const access_token = localStorage.getItem("access_token");

    try {
      const response = await applicationapi.post(url, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data; // Success case
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "File deletion failed"
      );
    }
  }
);

interface OtpResponse {
  success: boolean;
}

export const changepassword = createAsyncThunk<OtpResponse, FormData>(
  "changepassword",
  async (formData, thunkAPI) => {
    const access_token = localStorage.getItem("access_token");
    const url = "/change_password";
    try {
      const response = await applicationapi.post(url, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return thunkAPI.rejectWithValue({
              message: "Entered password does not match the current password.",
              status: 401,
            });
          case 404:
            return thunkAPI.rejectWithValue({
              message: "Resource not found.",
              status: 404,
            });
          case 500:
            return thunkAPI.rejectWithValue({
              message: "Internal server error. Please try again later.",
              status: 500,
            });
          default:
            return thunkAPI.rejectWithValue({
              message:
                error.response?.data?.data?.message || "Failed to fetch OTP",
              status: error.response.status,
            });
        }
      } else {
        return thunkAPI.rejectWithValue({
          message: "Network error or server did not respond.",
          status: null,
        });
      }
    }
  }
);

interface DeletechathistoryParams {
  thread_id: any;
}
export const DeleteSidebarData = createAsyncThunk<
  _Blob,
  DeletechathistoryParams
>("del_chat", async (params, thunkAPI) => {
  const url = "/del_chat";
  const access_token = localStorage.getItem("access_token");
  try {
    const response = await applicationapi.get(url, {
      params: { thread_id: params },
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return thunkAPI.rejectWithValue({
            message: "Incorrect Token. Please try again.",
            status: 401,
          });
        case 404:
          return thunkAPI.rejectWithValue({
            message: "Resource not found.",
            status: 404,
          });
        case 500:
          return thunkAPI.rejectWithValue({
            message: "Internal server error. Please try again later.",
            status: 500,
          });
        default:
          return thunkAPI.rejectWithValue({
            message:
              error.response?.data?.data?.message || "Failed to fetch data",
            status: error.response.status,
          });
      }
    } else {
      return thunkAPI.rejectWithValue({
        message: "Network error or server did not respond.",
        status: null,
      });
    }
  }
});

///// {Rename the sidbar chat history data} /////
export const RenameSidebarData = createAsyncThunk<_Blob, FormData>(
  "chat_rename",
  async (formData, thunkAPI) => {
    const url = "/chat_rename";
    const access_token = localStorage.getItem("access_token");
    try {
      const response = await applicationapi.post(url, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return thunkAPI.rejectWithValue({
              message: "Incorrect Token. Please try again.",
              status: 401,
            });
          case 404:
            return thunkAPI.rejectWithValue({
              message: "Resource not found.",
              status: 404,
            });
          case 500:
            return thunkAPI.rejectWithValue({
              message: "Internal server error. Please try again later.",
              status: 500,
            });
          default:
            return thunkAPI.rejectWithValue({
              message: error.response?.data?.message || "Failed to fetch data",
              status: error.response.status,
            });
        }
      } else {
        return thunkAPI.rejectWithValue({
          message: "Network error or server did not respond.",
          status: null,
        });
      }
    }
  }
);

const apis = {
  Signin,
};

export default apis;
