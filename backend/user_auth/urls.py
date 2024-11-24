from django.urls import path, re_path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from dj_rest_auth.registration.views import (
    VerifyEmailView,
    ResendEmailVerificationView,
    ConfirmEmailView,
)

from .views import LoginView, RequestOTPView, ValidatePasswordView, CustomRegisterView

urlpatterns = [
    path("account-confirm-email/<str:key>/", ConfirmEmailView.as_view()),
    path("token/", TokenObtainPairView.as_view(), name="token-obtain-pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("registration/", CustomRegisterView.as_view()),
    path(
        "validate-password/", ValidatePasswordView.as_view(), name="validate_password"
    ),
    path("verify-email/", VerifyEmailView.as_view(), name="rest_verify_email"),
    path(
        "account-confirm-email/",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    path(
        "resend-email/", ResendEmailVerificationView.as_view(), name="rest_resend_email"
    ),
    re_path(
        r"^account-confirm-email/(?P<key>[-:\w]+)/$",
        VerifyEmailView.as_view(),
        name="account_confirm_email",
    ),
    path("login/", LoginView.as_view(), name="custom-login"),
    path("request-otp/", RequestOTPView.as_view(), name="request-otp"),
]
