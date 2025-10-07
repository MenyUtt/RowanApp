import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
  IonBackButton, IonSearchbar, IonSelect, IonSelectOption,
  IonButton, IonIcon, IonCard, IonCardContent, IonImg,
  IonFab, IonFabButton, IonTextarea
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle,
    IonToolbar, IonButtons, IonBackButton, IonSearchbar, IonSelect,
    IonSelectOption, IonButton, IonIcon, IonCard, IonCardContent,
    IonImg, IonFab, IonFabButton, IonTextarea
  ],
  providers: [DatePipe]
})
export class Tickets implements OnInit {

  // Signals para el estado del componente
  public tickets = signal<any[]>([]);
  private allTickets = signal<any[]>([]);
  public edificioNombre = signal('Cargando...');
  public tiposDeSistema = signal<any[]>([]);
  public userRole = signal<string>('');
  public currentUserId = signal<number | null>(null);

  // Propiedades para los filtros
  public searchTerm: string = '';
  public selectedSystem: any = 'todos';

  // Propiedades para el modal de agregar ticket
  public isAddTicketModalOpen = signal(false);
  public newTicketDate: Date = new Date();
  public newTicket = {
    tipoSistemaId: null as number | null,
    descripcion: '',
    fecha_creacion: ''
  };
  private edificioId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const userData = JSON.parse(userJson);
      this.userRole.set(userData.rol);
      this.currentUserId.set(userData.id);
    }

    this.edificioId = this.route.snapshot.paramMap.get('edificioId');

    if (this.edificioId) {
      this.loadTicketsAndSystems(this.edificioId);
    }
  }

  loadTicketsAndSystems(edificioId: string) {
    const edificioRequest = this.http.get<any>(`http://localhost:3000/edificios/${edificioId}`);
    const ticketsRequest = this.http.get<any[]>(`http://localhost:3000/tickets/por-edificio/${edificioId}`);
    const sistemasRequest = this.http.get<any[]>(`http://localhost:3000/tipos-sistema`);

    forkJoin([edificioRequest, ticketsRequest, sistemasRequest]).subscribe({
      next: ([edificio, tickets, sistemas]) => {
        this.edificioNombre.set(edificio.nombre);
        this.allTickets.set(tickets);
        this.tickets.set(tickets);
        this.tiposDeSistema.set(sistemas);
      },
      error: (error) => {
        console.error('Ocurrió un error al obtener los datos:', error);
        this.edificioNombre.set('Error al cargar');
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.applyFilters();
  }

  onSystemChange(event: any) {
    this.selectedSystem = event.detail.value;
    this.applyFilters();
  }

  applyFilters() {
    let filteredTickets = [...this.allTickets()];

    if (this.searchTerm.trim() !== '') {
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.codigo_ticket.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedSystem !== 'todos') {
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.tipoSistema.id == this.selectedSystem
      );
    }

    this.tickets.set(filteredTickets);
  }

  openAddTicketModal() {
    this.newTicketDate = new Date();
    this.newTicket = {
      tipoSistemaId: null,
      descripcion: '',
      fecha_creacion: this.datePipe.transform(this.newTicketDate, 'yyyy-MM-dd HH:mm:ss') || ''
    };
    this.isAddTicketModalOpen.set(true);
  }

  closeAddTicketModal() {
    this.isAddTicketModalOpen.set(false);
  }

  saveNewTicket() {
    if (!this.newTicket.tipoSistemaId || !this.newTicket.descripcion.trim()) {
      alert('Por favor, selecciona un tipo de sistema y escribe una descripción.');
      return;
    }

    if (!this.currentUserId() || !this.edificioId) {
      alert('Error: No se pudo obtener la información del usuario o del edificio.');
      return;
    }

    const ticketData = {
      descripcion: this.newTicket.descripcion.trim(),
      fecha_creacion: this.newTicket.fecha_creacion,
      status: 'pendiente', 
      cliente_id: this.currentUserId(),
      edificio_id: parseInt(this.edificioId),
      tipo_sistema_id: this.newTicket.tipoSistemaId
    };

    this.http.post('http://localhost:3000/tickets', ticketData).subscribe({
      next: (response) => {
        alert('Ticket creado exitosamente!');
        this.closeAddTicketModal();
        if (this.edificioId) {
          this.loadTicketsAndSystems(this.edificioId);
        }
      },
      error: (error) => {
        console.error('Error al crear el ticket:', error);
        alert('Hubo un error al crear el ticket. Intenta de nuevo.');
      }
    });
  }
}