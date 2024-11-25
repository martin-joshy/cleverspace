import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { login, requestOTP, loginWithOTP } from "@/utils/api/publicApi";
import { useTimer } from "@/../hooks/useTimer";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn } from "lucide-react";

interface LoginFormValues {
  email: string;
  password: string;
  otp: string;
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
    <Card className="border-none shadow-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <LogIn className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold text-center">
          Welcome back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={loginMethod}
          onValueChange={(value) => setLoginMethod(value as "password" | "otp")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
          </TabsList>
          <TabsContent value="password">
            <Formik
              initialValues={{
                email: "",
                password: "",
                otp: "",
              }}
              validationSchema={PasswordLoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched, getFieldProps }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
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
                      autoComplete="current-password"
                      required
                      {...getFieldProps("password")}
                    />
                    {touched.password && errors.password && (
                      <p className="text-sm text-destructive">
                        {errors.password}
                      </p>
                    )}
                  </div>
                  {serverError && (
                    <Alert variant="destructive">
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>
          <TabsContent value="otp">
            <Formik
              initialValues={{
                email: "",
                password: "",
                otp: "",
              }}
              validationSchema={OTPLoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched, values, getFieldProps }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
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
                    <Label htmlFor="otp">One-Time Password</Label>
                    <Input
                      id="otp"
                      type="text"
                      autoComplete="one-time-code"
                      required
                      {...getFieldProps("otp")}
                    />
                    {touched.otp && errors.otp && (
                      <p className="text-sm text-destructive">{errors.otp}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleRequestOTP(values.email)}
                    disabled={otpRequested && time > 0}
                  >
                    {otpRequested && time > 0
                      ? `Resend OTP in ${time}s`
                      : "Request OTP"}
                  </Button>
                  {serverError && (
                    <Alert variant="destructive">
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>
        </Tabs>
      </CardContent>
      <Toaster />
    </Card>
  );
};
