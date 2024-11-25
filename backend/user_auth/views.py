import json
import random

import requests
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from allauth.account.utils import has_verified_email
from rest_framework_simplejwt.tokens import RefreshToken
from dj_rest_auth.registration.views import RegisterView

from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.urls import reverse
from django.conf import settings

from task_scheduler.utils import success_response, error_response
from .models import OTP
from .serializers import LoginSerializer, RequestOTPSerializer


User = get_user_model()


class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if User.objects.filter(email=serializer.data["email"]).exists():
            errors = {"email": ["Email already exists"]}
            return error_response(
                errors,
                message="Email already exists",
                status_code=status.HTTP_409_CONFLICT,
            )

        return super().create(request, *args, **kwargs)


class RequestOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                serializer.errors,
                message="Invalid Format",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return error_response(
                errors=None,
                message="No user found with this email",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        otp_code = "".join([str(random.randint(0, 9)) for _ in range(6)])

        otp_obj, created = OTP.objects.get_or_create(
            user=user,
            defaults={
                "code": otp_code,
            },
        )

        if not created and otp_obj.remaining_seconds <= 0:
            otp_obj.refresh(otp_code)
        elif not created and otp_obj.remaining_seconds > 0:
            return error_response(
                errors=None,
                message=f"OTP already sent. Please wait for {otp_obj.remaining_seconds} seconds",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        send_mail(
            "Your Login OTP",
            f"Your OTP is: {otp_code}. It will expire in 10 minutes.",
            "from@example.com",
            [email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "OTP sent successfully",
                "expires_in": otp_obj.remaining_seconds,
            }
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                serializer.errors,
                message="Invalid Format",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        user_email = serializer.validated_data.get("email")
        user = User.objects.filter(email=user_email).first()
        if user and not user.is_staff and not has_verified_email(user):
            user_obj = User.objects.get(username=user)
            user_email = user_obj.email
            self.call_rest_resend_email_view(user_email)
            return error_response(
                errors=None,
                message="Email address must be verified before you can log in. An Verification email has been send to you email, please verfiy.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        method = serializer.validated_data["method"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            errors = {"email": ["No user found with this email"]}
            return error_response(
                errors,
                message="Invalid credentials",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if method == "password":
            password = serializer.validated_data["password"]
            user = authenticate(email=email, password=password)
            if not user:
                return error_response(
                    errors=None,
                    message="Invalid credentials",
                    status_code=status.HTTP_404_NOT_FOUND,
                )
        else:
            otp = serializer.validated_data["otp"]
            try:
                otp_obj = OTP.objects.get(user=user)
            except OTP.DoesNotExist:
                return error_response(
                    errors=None,
                    message="No OTP found. Please request a new OTP.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            if not otp_obj.is_valid():
                return error_response(
                    errors=None,
                    message="OTP has expired. Please request a new one.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            if otp_obj.code != otp:
                return error_response(
                    errors=None,
                    message="Invalid OTP",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            otp_obj.is_used = True
            otp_obj.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        )

    def call_rest_resend_email_view(self, email):
        url = reverse("rest_resend_email")
        domain = settings.BACKEND_DOMAIN
        payload = {"email": email}
        full_url = domain + url
        response = requests.post(
            full_url,
            data=json.dumps(payload),
            headers={"Content-Type": "application/json"},
            timeout=10,
        )
        return response


class ValidatePasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        password = request.data.get("password")
        try:
            validate_password(password)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return success_response(e.messages)
