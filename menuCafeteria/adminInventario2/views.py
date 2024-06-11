from django.shortcuts import render
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *

# Create your views here.

def numeroOrdenes(request):
    if request.method == "POST":
        # No es necesario cargar el cuerpo de la solicitud para esta operación
        numero_de_ordenes = numeroOrden.objects.values_list("numero", flat=True)

        # Convertir los números de orden a una lista
        numeros_lista = list(numero_de_ordenes)

        data = {
            "numeros": numeros_lista,
        }
        return JsonResponse(data)
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)

# def obtenerOrden(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)

#             pedido = data.get("detalles")
#             nombre = data.get("nombre")
#             correo = data.get("correo")
#             numero_pedido = data.get("numero")

#             guardar_numero(numero_pedido)

#             guardar_orden = Ordenes(
#                 numero=numero_pedido,
#                 nombre_cliente=nombre,
#                 correo_cliente=correo,
#                 detalles=json.dumps(pedido),
#             )

#             guardar_orden.save()

#             return JsonResponse(
#                 {
#                     "exito": "se paso la orden correctamente al back-end yiuju",
#                     "data": data,
#                 }
#             )

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Error al procesar el JSON"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
#     return JsonResponse({"error": "Método no permitido"}, status=405)
