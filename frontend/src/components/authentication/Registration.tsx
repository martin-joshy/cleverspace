import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";

import { register } from "@/utils/api/publicApi";
import { validatePassword } from "@/utils/validators";

interface RegistrationFormValues {
  email: string;
  password: string;
  confirm_password: string;
}

export const Registration: React.FC = () => {
  const [serverError, setServerError] = useState<string>("");
  const navigate = useNavigate();

  const RegistrationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email address.")
      .max(320, "Email must be at most 320 characters long.")
      .required("This field is required."),
    password: Yup.string()
      .required("This field is required.")
      .test("validatePassword", "", async function (value) {
        try {
          const errors = await validatePassword(value);
          if (errors) {
            return this.createError({ message: errors.join(" ") });
          }
          return true;
        } catch (err: unknown) {
          if (err instanceof Error) {
            setServerError(
              (err as unknown as { response: { data: { message: string } } })
                .response.data.message
            );
          } else {
            setServerError(
              "An unexpected error occurred. Please try again later."
            );
          }
          return false;
        }
      }),
    confirm_password: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        "The two password fields didn't match."
      )
      .required("This field is required."),
  });

  const handleSubmit = (
    values: RegistrationFormValues,
    { setSubmitting }: FormikHelpers<RegistrationFormValues>
  ) => {
    const submitAsync = async () => {
      setServerError("");

      try {
        await register(values.email, values.password, values.confirm_password);
        navigate("/login", {
          state: { toastMessage: "Verification email sent successfully." },
          replace: true,
        });
      } catch (error: unknown) {
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          (error as unknown as { response: { data: string } }).response.data
        ) {
          const responseErrors = (
            error as unknown as { response: { data: { message: string } } }
          ).response.data.message;
          setServerError(responseErrors);
        } else {
          setServerError(
            "An unexpected error occurred. Please try again later."
          );
        }
        setSubmitting(false);
      }
    };

    submitAsync();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register an account
        </h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirm_password: "",
          }}
          validationSchema={RegistrationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, getFieldProps }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
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
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    {...getFieldProps("password")}
                  />
                  {touched.password && errors.password && (
                    <div className="text-red-500 text-sm">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    {...getFieldProps("confirm_password")}
                  />
                  {touched.confirm_password && errors.confirm_password && (
                    <div className="text-red-500 text-sm">
                      {errors.confirm_password}
                    </div>
                  )}
                </div>
              </div>
              {serverError && <div className="text-red-600">{serverError}</div>}

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
