import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { register } from "@/utils/api/publicApi";
import { validatePassword } from "@/utils/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClipboardList } from "lucide-react";

interface RegistrationFormValues {
  email: string;
  password: string;
  confirm_password: string;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
  };
}

interface ApiError {
  response: {
    data: ApiErrorResponse;
  };
}

function isApiError(error: unknown): error is ApiError {
  return (
    error !== null &&
    typeof error === "object" &&
    "response" in error &&
    typeof (error as ApiError).response?.data === "object" &&
    "success" in (error as ApiError).response.data
  );
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
          if (isApiError(err)) {
            setServerError(err.response.data.message);
          } else {
            setServerError(
              "An unexpected error occurred. Please try again later."
            );
          }
          return false;
        }
      }),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), ""], "The two password fields didn't match.")
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
        if (isApiError(error)) {
          if (
            error.response.data.errors?.email &&
            error.response.data.errors.email.length > 0
          ) {
            setServerError(error.response.data.errors.email[0]);
          } else if (error.response.data.message) {
            setServerError(error.response.data.message);
          }
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
    <Card className="border-none shadow-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <ClipboardList className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details to get started with Task Manager
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <Form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-address">Email address</Label>
                <Input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  {...getFieldProps("email")}
                />
                {touched.email && errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  {...getFieldProps("password")}
                />
                {touched.password && errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  {...getFieldProps("confirm_password")}
                />
                {touched.confirm_password && errors.confirm_password && (
                  <p className="text-sm text-destructive">
                    {errors.confirm_password}
                  </p>
                )}
              </div>
              {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};
