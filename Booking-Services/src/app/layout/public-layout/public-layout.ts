import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicNavbar } from '../public-navbar/public-navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, PublicNavbar, Footer],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {}
