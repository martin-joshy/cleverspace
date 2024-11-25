from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import generics
from django.contrib.auth.models import User

from backend.task_scheduler.utils import success_response
from .models import Task
from .serializers import TaskSerializer, UserSerializer


class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    @action(detail=True, methods=["post"])
    def swap_complete(self):
        task = self.get_object()
        task.is_completed = not task.is_completed
        task.save()
        serializer = TaskSerializer(task)
        return success_response(message="Task updated", data=serializer.data)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
