from django.shortcuts import render
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from adminInventario2.models import *

# Create your views here.

def listar_carrito(request):
    productos = Productos.objects.all()
    return render(request, 'menu.html', {
        "productos":productos
    })