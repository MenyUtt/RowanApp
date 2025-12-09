import { Component, OnInit, signal, ViewChild, ElementRef, inject } from '@angular/core';
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
import { environment } from '../../../environments/environment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController } from '@ionic/angular/standalone';

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

  // Modal para agregar
  public isAddTicketModalOpen = signal(false);
  public newTicketDate: Date = new Date();
  public newTicket = {
    tipoSistemaId: null as number | null,
    descripcion: '',
    fecha_creacion: ''
  };
  private edificioId: string | null = null;

  private alertController = inject(AlertController);
  // Propiedades para el modal de edición
  public editingTicket = signal<any | null>(null);
  public tecnicos = signal<any[]>([]);

  public viewingImage = signal<string | null>(null);

  @ViewChild('pdfInput') pdfInput!: ElementRef;
  private selectedTicketIdForPdf: number | null = null;

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
    this.loadTecnicos();
  }

  // === LÓGICA DE CÁMARA ===
  async handleEvidence(ticket: any) {
    const role = this.userRole();
    const userId = this.currentUserId();

    // 1. SI ES TÉCNICO: SUBIR FOTO
    if (role === 'Tecnico') {
        // solo el asignado puede subir
        if (ticket.usuarioAsignado?.id !== userId) {
          alert('Solo el técnico asignado puede subir evidencias.');
          return;
        }

        try {
            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Prompt // Pregunta: ¿Cámara o Galería?
            });

            if (image.webPath) {
                this.uploadEvidence(image.webPath, ticket.id);
            }
        } catch (error) {
            console.log('Cámara cancelada o error:', error);
        }
    } 
    // 2. SI ES JEFE (Admin/Coord): VER FOTO
    else if (role === 'Administración' || role === 'Coordinador') {
        // Aquí asumimos que el ticket trae sus evidencias. 
        // Asegúrate que tu backend (findByEdificio) incluya la relación 'evidencias'.
        if (ticket.evidencias && ticket.evidencias.length > 0) {
            // Tomamos la última evidencia subida
            const lastEvidence = ticket.evidencias[ticket.evidencias.length - 1];
            // Construimos la URL completa al backend
            const fullUrl = `${environment.apiUrl}${lastEvidence.url_archivo}`;
            this.viewingImage.set(fullUrl); 
        } else {
            alert('Ventana de archivo no adjuntado: El técnico no ha subido evidencias.');
        }
    }
  }

  // Subir la foto al servidor
  async uploadEvidence(imagePath: string, ticketId: number) {
    // Convertir la ruta de la imagen a un Blob para subirlo
    const response = await fetch(imagePath);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append('file', blob, `evidence_${ticketId}.jpg`);
    formData.append('ticketId', ticketId.toString());
    formData.append('usuarioId', this.currentUserId()!.toString());

    this.http.post(`${environment.apiUrl}/evidencias/upload`, formData).subscribe({
        next: () => {
            alert('Evidencia subida correctamente');
            // Recargar para ver los cambios
            if (this.edificioId) this.loadTicketsAndSystems(this.edificioId);
        },
        error: (err) => {
            console.error(err);
            alert('Error al subir la imagen');
        }
    });
  }

  closeImageViewer() {
      this.viewingImage.set(null);
  }

  loadTicketsAndSystems(edificioId: string) {
    const edificioRequest = this.http.get<any>(`${environment.apiUrl}/edificios/${edificioId}`);
    const ticketsRequest = this.http.get<any[]>(`${environment.apiUrl}/tickets/por-edificio/${edificioId}`);
    const sistemasRequest = this.http.get<any[]>(`${environment.apiUrl}/tipos-sistema`);

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
        String(ticket.id).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedSystem !== 'todos') {
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.tipoSistema.id == this.selectedSystem
      );
    }

    this.tickets.set(filteredTickets);
  }

  loadTecnicos() {
    this.http.get<any[]>(`${environment.apiUrl}/usuarios/tecnicos`).subscribe({
      next: (data) => this.tecnicos.set(data),
      error: (err) => console.error('Error al cargar técnicos:', err)
    });
  }

  // --- Lógica para Modal de Agregar ---
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
    this.http.post(`${environment.apiUrl}/tickets`, ticketData).subscribe({
      next: () => {
        alert('Ticket creado exitosamente!');
        this.closeAddTicketModal();
        if (this.edificioId) {
          this.loadTicketsAndSystems(this.edificioId);
        }
      },
      error: (err) => {
        console.error('Error al crear el ticket:', err);
        alert('Hubo un error al crear el ticket.');
      }
    });
  }

  // --- Lógica para Modal de Editar ---
  openEditModal(ticket: any) {
    const ticketCopy = {
      ...ticket,
      tipo_sistema_id: ticket.tipoSistema.id,
      asignado_id: ticket.usuarioAsignado?.id || null
    };
    this.editingTicket.set(ticketCopy);
  }

  closeEditModal() {
    this.editingTicket.set(null);
  }

  saveTicketChanges() {
    const ticket = this.editingTicket();
    if (!ticket) return;

    const updateData = {
      descripcion: ticket.descripcion,
      tipo_sistema_id: ticket.tipo_sistema_id,
      asignado_id: ticket.asignado_id,
      status: ticket.status
    };

    this.http.put(`${environment.apiUrl}/tickets/${ticket.id}`, updateData).subscribe({
      next: () => {
        alert('Ticket actualizado exitosamente.');
        this.closeEditModal();
        if (this.edificioId) {
          this.loadTicketsAndSystems(this.edificioId);
        }
      },
      error: (err) => {
        console.error('Error al actualizar el ticket:', err);
        alert('Hubo un error al guardar los cambios.');
      }
    });
  }

  handlePdf(ticket: any) {
    const role = this.userRole();

    // CASO 1: COORDINADOR (SUBIR)
    if (role === 'Coordinador') {
      this.selectedTicketIdForPdf = ticket.id;
      // Simulamos un click en el input oculto para abrir el selector de archivos
      this.pdfInput.nativeElement.click();
    } 
    
    // CASO 2: ADMINISTRACIÓN (DESCARGAR)
    else if (role === 'Administración') {
      // Buscar si existe alguna evidencia tipo 'pdf'
      const pdfEvidence = ticket.evidencias?.find((e: any) => e.tipo_archivo === 'pdf');

      if (pdfEvidence) {
        const url = `${environment.apiUrl}${pdfEvidence.url_archivo}`;
        // Abrir el PDF en una nueva pestaña o navegador
        window.open(url, '_blank');
      } else {
        alert('Ventana de archivo no adjuntado: No hay PDF disponible para este ticket.');
      }
    }
  }
  // Evento cuando el Coordinador selecciona un archivo
  onPdfSelected(event: any) {
    const file = event.target.files[0];
    
    if (file && this.selectedTicketIdForPdf) {
      this.uploadPdf(file, this.selectedTicketIdForPdf);
    }
    
    // Limpiar el input para permitir subir el mismo archivo de nuevo si se desea
    event.target.value = '';
  }

  // Método para enviar el PDF al backend
  uploadPdf(file: File, ticketId: number) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ticketId', ticketId.toString());
    formData.append('usuarioId', this.currentUserId()!.toString());
    formData.append('tipo', 'pdf'); // <--- Le decimos al backend que es un PDF

    this.http.post(`${environment.apiUrl}/evidencias/upload`, formData).subscribe({
      next: () => {
        alert('PDF subido correctamente.');
        if (this.edificioId) this.loadTicketsAndSystems(this.edificioId); // Recargar lista
      },
      error: (err) => {
        console.error(err);
        alert('Error al subir el PDF.');
      }
    });
  }
  async confirmDelete(ticketId: number) {
    const alert = await this.alertController.create({
      header: 'Eliminar Ticket',
      message: '¿Estás seguro de que deseas eliminar este ticket permanentemente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Eliminación cancelada');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            this.deleteTicket(ticketId);
          }
        }
      ]
    });

    await alert.present();
  }
  deleteTicket(id: number) {
    this.http.delete(`${environment.apiUrl}/tickets/${id}`).subscribe({
      next: () => {
        // Recargar la lista de tickets
        if (this.edificioId) this.loadTicketsAndSystems(this.edificioId);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        alert('No se pudo eliminar el ticket.');
      }
    });
  }
}