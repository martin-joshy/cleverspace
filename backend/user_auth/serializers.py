from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(required=False)
    otp = serializers.CharField(required=False)
    method = serializers.ChoiceField(choices=["password", "otp"])

    def validate(self, data):
        method = data.get("method")
        password = data.get("password")
        otp = data.get("otp")

        if method == "password" and not password:
            raise serializers.ValidationError(
                "Password is required for password authentication"
            )
        elif method == "otp" and not otp:
            raise serializers.ValidationError("OTP is required for OTP authentication")

        if method == "otp" and otp:
            if len(otp) != 6 or not otp.isdigit():
                raise serializers.ValidationError("OTP must be exactly 6 digits")

        return data


class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
