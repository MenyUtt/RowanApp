import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink], // Agregue RouterLink a los imports
  templateUrl: './register.html', // Asumiendo que tu HTML se llama register.html
  styleUrls: [] // Puedes añadir aquí tu archivo de CSS si lo tienes
})
export class Register {

}
