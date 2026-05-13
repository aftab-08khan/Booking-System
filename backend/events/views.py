from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import Event
from .serializers import EventSerializer

class EventListCreateView(generics.ListCreateAPIView):
    """
    GET: List all active events (public)
    POST: Create a new event (authenticated users only)
    """
    queryset = Event.objects.filter(is_active=True)
    serializer_class = EventSerializer
    
    def get_permissions(self):
        print(f"Request method: {self.request.method}")  # Debug print
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def post(self, request, *args, **kwargs):
        print("POST request received")  # Debug print
        print("Request data:", request.data)  # Debug print
        print("User authenticated:", request.user.is_authenticated)  # Debug print
        
        # Check authentication
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Create serializer with data
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            print("Serializer is valid")  # Debug print
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print("Serializer errors:", serializer.errors)  # Debug print
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_create(self, serializer):
        serializer.save(
            available_seats=serializer.validated_data.get('capacity', 0)
        )

class EventDetailView(generics.RetrieveAPIView):
    """
    GET: Retrieve a specific event
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]