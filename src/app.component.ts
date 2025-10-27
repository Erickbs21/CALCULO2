import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ServicioAnalizadorIntegrales, ResultadoAnalisis } from './services/integral-analyzer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  private servicioAnalizador = inject(ServicioAnalizadorIntegrales);

  integralIngresada = signal<string>('∫ x*cos(x) dx');
  resultadoAnalisis = signal<ResultadoAnalisis | null>(null);
  analizando = signal(false);
  mostrarEjemplos = signal(false);

  readonly ejemplos = [
    '∫ x*cos(x) dx',
    '∫ (2x+5)/(x^2-x-2) dx',
    '∫ sin^3(x)*cos^2(x) dx',
    '∫ 1/sqrt(4-x^2) dx',
    '∫ x*e^(x^2) dx',
  ];

  constructor() {
    // Realiza un análisis inicial con el valor por defecto
    this.analizarIntegral();
  }

  analizarIntegral(): void {
    const integral = this.integralIngresada();
    if (!integral.trim()) {
      this.resultadoAnalisis.set(null);
      return;
    }

    this.analizando.set(true);
    this.resultadoAnalisis.set(null);

    // Simula una operación asíncrona para una mejor experiencia de usuario
    setTimeout(() => {
      const resultado = this.servicioAnalizador.analizar(integral);
      this.resultadoAnalisis.set(resultado);
      this.analizando.set(false);
    }, 500);
  }

  alCambiarInput(evento: Event): void {
    const elementoInput = evento.target as HTMLInputElement;
    this.integralIngresada.set(elementoInput.value);
  }

  seleccionarEjemplo(ejemplo: string): void {
    this.integralIngresada.set(ejemplo);
    this.mostrarEjemplos.set(false);
    this.analizarIntegral();
  }
}