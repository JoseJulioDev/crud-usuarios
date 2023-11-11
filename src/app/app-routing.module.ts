import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch:  'full', redirectTo: 'usuarios'},
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then(u => u.UsuariosModule)
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
