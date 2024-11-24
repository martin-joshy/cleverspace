import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

import { login, requestOTP, loginWithOTP } from "@/utils/api/publicApi";
import { useTimer } from "@/../hooks/useTimer";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";

interface LoginFormValues {
  email: string;
  password?: string;
  otp?: string;
}

const PasswordLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("This field is required"),
  password: Yup.string().required("This field is required"),
});

const OTPLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("This field is required"),
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("This field is required"),
});

export const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">(
    "password"
  );
  const [otpRequested, setOtpRequested] = useState(false);
  const { time, resetTimer } = useTimer(0);
  const [serverError, setServerError] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.toastMessage) {
      toast({
        title: "Success",
        description: location.state.toastMessage,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);

  useEffect(() => {
    console.log(loginMethod);
  }, [loginMethod]);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      let res;
      if (loginMethod === "password") {
        res = await login(values.email, values.password!);
      } else {
        res = await loginWithOTP(values.email, values.otp!);
      }
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/home", { replace: true });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as unknown as { response: { data: { message: string } } })
          .response.data.message
      ) {
        const responseErrors = (
          error as unknown as { response: { data: { message: string } } }
        ).response.data.message;
        setServerError(responseErrors);
      } else {
        setServerError("An unexpected error occurred. Please try again later.");
      }
    }
    setSubmitting(false);
  };

  const handleRequestOTP = async (email: string) => {
    try {
      await requestOTP(email);
      setOtpRequested(true);
      resetTimer(600);
      toast({
        title: "Success",
        description: "OTP sent successfully. Please check your email.",
      });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as unknown as { response: { data: { message: string } } })
          .response.data.message
      ) {
        const responseErrors = (
          error as unknown as { response: { data: { message: string } } }
        ).response.data.message;
        setServerError(responseErrors);
      } else {
        setServerError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <div className="mt-8 space-y-6">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setLoginMethod("password")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                loginMethod === "password"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setLoginMethod("otp")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                loginMethod === "otp"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              OTP
            </button>
          </div>

          <Formik
            initialValues={{
              email: "",
              password: "",
              otp: "",
            }}
            validationSchema={
              loginMethod === "password" ? PasswordLoginSchema : OTPLoginSchema
            }
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, values, getFieldProps }) => (
              <Form>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                      {...getFieldProps("email")}
                    />
                    {touched.email && errors.email && (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                  </div>
                  {loginMethod === "password" ? (
                    <div>
                      <label htmlFor="password" className="sr-only">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        {...getFieldProps("password")}
                      />
                      {touched.password && errors.password && (
                        <div className="text-red-500 text-sm">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label htmlFor="otp" className="sr-only">
                        OTP
                      </label>
                      <input
                        id="otp"
                        type="text"
                        autoComplete="one-time-code"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="One-Time Password"
                        {...getFieldProps("otp")}
                      />
                      {touched.otp && errors.otp && (
                        <div className="text-red-500 text-sm">{errors.otp}</div>
                      )}
                    </div>
                  )}
                </div>

                {loginMethod === "otp" && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => handleRequestOTP(values.email)}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      disabled={otpRequested && time > 0}
                    >
                      {otpRequested && time > 0
                        ? `Resend OTP in ${time}s`
                        : "Request OTP"}
                    </button>
                  </div>
                )}

                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </button>
                </div>

                {serverError && (
                  <div className="mt-2 text-center text-sm text-red-600">
                    {serverError}
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Toaster />
    </div>
  );
};
