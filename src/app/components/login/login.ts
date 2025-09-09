import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Importe RouterLink

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink], // Agregue RouterLink a los imports
  templateUrl: './login.html',
  styleUrls: []
})
export class Login {

}
