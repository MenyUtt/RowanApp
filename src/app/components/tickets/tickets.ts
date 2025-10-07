import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonBackButton, IonSearchbar, IonSelect, IonSelectOption, 
  IonButton, IonIcon, IonCard, IonCardContent, IonImg,
  IonFab, IonFabButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, 
    IonToolbar, IonButtons, IonBackButton, IonSearchbar, IonSelect, 
    IonSelectOption, IonButton, IonIcon, IonCard, IonCardContent, 
    IonImg, IonFab, IonFabButton
  ],
})
export class Tickets implements OnInit {
  
  // Signals para el estado del componente
  public tickets = signal<any[]>([]);
  private allTickets = signal<any[]>([]); // Guarda la lista original de tickets
  public edificioNombre = signal('Cargando...');
  public tiposDeSistema = signal<any[]>([]); // Guarda los tipos de sistema para el filtro
  public userRole = signal<string>('');
  
  // Propiedades para los filtros
  public searchTerm: string = '';
  public selectedSystem: any = 'todos';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.userRole.set('Cliente');
    const edificioId = this.route.snapshot.paramMap.get('edificioId');

    if (edificioId) {
      // Preparamos 3 peticiones: edificio, tickets y tipos de sistema
      const edificioRequest = this.http.get<any>(`http://localhost:3000/edificios/${edificioId}`);
      const ticketsRequest = this.http.get<any[]>(`http://localhost:3000/tickets/por-edificio/${edificioId}`);
      const sistemasRequest = this.http.get<any[]>(`http://localhost:3000/tipos-sistema`);

      forkJoin([edificioRequest, ticketsRequest, sistemasRequest]).subscribe({
        next: ([edificio, tickets, sistemas]) => {
          this.edificioNombre.set(edificio.nombre);
          this.allTickets.set(tickets); // Guarda la lista completa
          this.tickets.set(tickets);     // Muestra la lista inicial
          this.tiposDeSistema.set(sistemas);
        },
        error: (error) => {
          console.error('Ocurrió un error al obtener los datos:', error);
          this.edificioNombre.set('Error al cargar');
        }
      });
    }
  }

  // Se llama cada vez que el usuario escribe en la barra de búsqueda
  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.applyFilters();
  }

  // Se llama cada vez que el usuario cambia el filtro de sistema
  onSystemChange(event: any) {
    this.selectedSystem = event.detail.value;
    this.applyFilters();
  }

  // Lógica central para filtrar los tickets
  applyFilters() {
    let filteredTickets = [...this.allTickets()];

    // 1. Filtrar por término de búsqueda (ID del ticket)
    if (this.searchTerm.trim() !== '') {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.codigo_ticket.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // 2. Filtrar por sistema seleccionado
    if (this.selectedSystem !== 'todos') {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.tipoSistema.id == this.selectedSystem
      );
    }

    this.tickets.set(filteredTickets);
  }
}