from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError
from rest_framework import status


def success_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    return Response(
        {"success": True, "message": message, "data": data}, status=status_code
    )


def error_response(errors, message="Error", status_code=status.HTTP_400_BAD_REQUEST):
    return Response(
        {"success": False, "message": message, "errors": errors}, status=status_code
    )


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, ValidationError) and response is not None:
        reformatted_errors = {}
        for field, errors in response.data.items():
            reformatted_errors[field] = errors

        response.data = {
            "success": False,
            "message": "Invalid request format",
            "errors": reformatted_errors,
        }

    return response
