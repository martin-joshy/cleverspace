from django.db import models


class Task(models.Model):
    title = models.CharField(max_length=250)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    scheduled_on = models.DateTimeField()

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"
        ordering = ["-scheduled_on"]

    def __str__(self):
        return self.title
