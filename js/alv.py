import random
print("A <- IZQUIERDA --- DERECHA -> B")
class Habitacion:
    def __init__(self, nombre):
        self.nombre = nombre
        self.estado = random.choice(["Limpio", "Sucio"])

    def limpiar(self):
        self.estado = "Limpio"

    def __str__(self):
        return f"Habitación {self.nombre}: {self.estado}"

class Aspiradora:
    def __init__(self, habitacion_actual):
        self.habitacion_actual = habitacion_actual
        self.visitas = {"A": False, "B": False}

    def mover(self, nueva_habitacion):
        self.habitacion_actual = nueva_habitacion
        self.visitas[nueva_habitacion.nombre] = True

    def limpiar(self):
        self.habitacion_actual.limpiar()

    def decidir_accion(self):
        if self.habitacion_actual.estado == "Sucio":
            return "Aspirar"
        elif self.habitacion_actual.nombre == "A":
            return "Derecha"
        else:
            return "Izquierda"

class Simulacion:
    def __init__(self):
        self.habitacion_a = Habitacion("A")
        self.habitacion_b = Habitacion("B")
        self.aspiradora = Aspiradora(random.choice([self.habitacion_a, self.habitacion_b]))

    def ejecutar(self):
        print("Estado inicial:")
        self.mostrar_estado()

        while not self.esta_todo_verificado():
            accion = self.aspiradora.decidir_accion()
            print(f"\nAcción: {accion}")

            if accion == "Aspirar":
                self.aspiradora.limpiar()
                print(f"Limpiando {self.aspiradora.habitacion_actual}")
            elif accion == "Derecha":
                self.aspiradora.mover(self.habitacion_b)
                print("Moviendo a la derecha (B)")
            elif accion == "Izquierda":
                self.aspiradora.mover(self.habitacion_a)
                print("Moviendo a la izquierda (A)")

            self.mostrar_estado()

        print("\n¡Todas las habitaciones han sido verificadas y están limpias!")

    def esta_todo_verificado(self):
        return self.aspiradora.visitas["A"] and self.aspiradora.visitas["B"] and self.habitacion_a.estado == "Limpio" and self.habitacion_b.estado == "Limpio"

    def mostrar_estado(self):
        print(self.habitacion_a)
        print(self.habitacion_b)
        print(f"Aspiradora en: {self.aspiradora.habitacion_actual.nombre}")

if __name__ == "__main__":
    simulacion = Simulacion()
    simulacion.ejecutar()