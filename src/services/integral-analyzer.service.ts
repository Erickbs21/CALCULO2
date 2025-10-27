import { Injectable } from '@angular/core';

export interface ResultadoAnalisis {
  metodo: string;
  tipo: string;
  explicacion: string;
  ejemplo: string;
}

interface ReglaIntegral {
  regex: RegExp;
  resultado: ResultadoAnalisis;
}

@Injectable({
  providedIn: 'root',
})
export class ServicioAnalizadorIntegrales {
  private readonly reglas: ReglaIntegral[];

  constructor() {
    this.reglas = [
      // Regla para Sustitución Trigonométrica
      {
        regex: /sqrt\(\s*\d+\s*[-+]\s*x\^2\s*\)|sqrt\(\s*x\^2\s*-\s*\d+\s*\)/i,
        resultado: {
          metodo: 'Sustitución Trigonométrica',
          tipo: 'Integral con Radicales de Formas Cuadráticas',
          explicacion: 'La presencia de una raíz cuadrada conteniendo una suma o diferencia de cuadrados (como a² - x², x² + a², o x² - a²) sugiere el uso de sustituciones trigonométricas (x = a*sin(θ), x = a*tan(θ), o x = a*sec(θ)) para simplificar la integral.',
          ejemplo: '∫ dx / (x^2 * sqrt(x^2 - 9))',
        },
      },
      // Regla para Integración por Partes
      {
        regex: /x\^?\d*\s*\*\s*(sin|cos|tan|ln|log|e\^)/i,
        resultado: {
          metodo: 'Integración por Partes',
          tipo: 'Integral de un Producto de Funciones',
          explicacion: 'Se identifica un producto de funciones de diferente naturaleza (algebraica, logarítmica, trigonométrica, exponencial). El método de integración por partes (∫ u dv = uv - ∫ v du) es ideal para estos casos. Se recomienda usar la regla mnemotécnica LIATE o ILATE para elegir "u".',
          ejemplo: '∫ x * e^x dx',
        },
      },
      // Regla para Fracciones Parciales
      {
        regex: /\(.*\)\s*\/\s*\(.*x\^2.*\)/i,
        resultado: {
          metodo: 'Fracciones Parciales',
          tipo: 'Integral de una Función Racional',
          explicacion: 'La integral es un cociente de polinomios. Este método consiste en descomponer la fracción racional en una suma de fracciones más simples, las cuales son más fáciles de integrar individualmente. Se requiere factorizar el denominador.',
          ejemplo: '∫ (5x - 3) / (x^2 - 2x - 3) dx',
        },
      },
      // Regla para Integrales Trigonométricas
      {
        regex: /(sin|cos|tan|sec|csc|cot)\^\d+/i,
        resultado: {
          metodo: 'Integrales Trigonométricas',
          tipo: 'Potencias de Funciones Trigonométricas',
          explicacion: 'La integral contiene potencias de funciones trigonométricas. Se utilizan identidades trigonométricas (pitagóricas, de ángulo doble, etc.) para reducir la complejidad del integrando a formas más básicas.',
          ejemplo: '∫ sin^2(x) * cos^3(x) dx',
        },
      },
       // Regla para Sustitución en U (funciones compuestas)
      {
        regex: /x\s*\*\s*.*\(x\^2\)/i,
        resultado: {
          metodo: 'Sustitución en U (Cambio de Variable)',
          tipo: 'Regla de la Cadena Inversa',
          explicacion: 'Se observa una función compuesta y la derivada (o un múltiplo de ella) de la función interna multiplicando afuera. La sustitución u = g(x) simplifica la integral a una forma más directa.',
          ejemplo: '∫ 2x * cos(x^2) dx',
        },
      },
    ];
  }

  analizar(integralComoTexto: string): ResultadoAnalisis | null {
    // Limpieza básica
    const integralLimpia = integralComoTexto.replace(/∫|dx|\s/g, '');

    for (const regla of this.reglas) {
      if (regla.regex.test(integralLimpia)) {
        return regla.resultado;
      }
    }

    // Opción por defecto a Sustitución en U si no se encuentra un patrón específico pero parece complejo
    if (integralLimpia.includes('(') && integralLimpia.includes(')')) {
        return {
            metodo: 'Sustitución en U (Cambio de Variable)',
            tipo: 'Integral de Función Compuesta',
            explicacion: 'Esta es una recomendación general cuando se detecta una función "interna". El método de sustitución en U es una de las técnicas más fundamentales y se aplica cuando el integrando es una composición de funciones, f(g(x)), multiplicada por la derivada de la función interna, g\'(x).',
            ejemplo: '∫ (x^2 + 1)^3 * 2x dx',
          };
    }

    return {
        metodo: 'Revisión Directa o Sustitución Simple',
        tipo: 'Integral Básica o No Identificada',
        explicacion: 'No se ha identificado un patrón claro para un método avanzado. La integral podría ser resoluble por reglas directas de integración (potencias, exponenciales, etc.) o una sustitución simple en U. Se recomienda verificar las tablas de integrales básicas.',
        ejemplo: '∫ (x^3 + 2x - 5) dx',
    };
  }
}