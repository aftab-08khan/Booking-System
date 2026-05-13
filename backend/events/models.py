from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(default="")  
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    capacity = models.IntegerField(default=0)
    available_seats = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.pk and self.capacity: 
            self.available_seats = self.capacity
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title